import type { SupabaseClient } from '@supabase/supabase-js';
import type { V2Lesson } from '@/lib/v2/contentTypes';
import { createV2SupabaseAdminClient } from '@/lib/v2/supabase';
import { extractV2QuestionDraftsFromLesson, type V2QuizQuestion } from '@/lib/v2/questionRuntime';

type PublishedQuestionRow = {
  id: string;
  question_id: string;
  stem: string;
  answer_key: { acceptedAnswers?: unknown } | null;
  metadata: { sourceBlockId?: unknown; sourceBlockType?: unknown; options?: unknown } | null;
  v2_questions?: {
    stable_key?: unknown;
    question_type?: unknown;
  } | null;
};

type ExistingQuestionRow = {
  id: string;
  stable_key: string;
};

type ExistingQuestionVersionRow = {
  id: string;
  version_no: number;
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
  is_current: boolean;
  stem: string;
  answer_key: unknown;
  metadata: unknown;
};

type InsertedQuestionVersionRow = {
  id: string;
  question_id: string;
  version_no: number;
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
  is_current: boolean;
  published_at: string | null;
};

function isLessonShape(value: unknown): value is V2Lesson {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<V2Lesson>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.unit === 'string' &&
    Array.isArray(candidate.blocks)
  );
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, inner]) => `${JSON.stringify(key)}:${stableJson(inner)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function toAcceptedAnswers(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const raw = (value as { acceptedAnswers?: unknown }).acceptedAnswers;
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
}

function toOptions(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const options = value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  return options.length > 0 ? options : null;
}

function toQuestionVersionMetadata(
  lessonCode: string,
  input: {
    sourceBlockId: string;
    sourceBlockType: 'practice' | 'spaced-review' | 'generated';
    options: string[] | null;
    sourceLessonVersionId?: string;
    extraMetadata?: Record<string, unknown>;
  }
): Record<string, unknown> {
  return {
    lessonCode,
    sourceBlockId: input.sourceBlockId,
    sourceBlockType: input.sourceBlockType,
    options: input.options,
    ...(input.sourceLessonVersionId ? { sourceLessonVersionId: input.sourceLessonVersionId } : {}),
    ...(input.extraMetadata ?? {}),
  };
}

export async function listV2PublishedQuizQuestions(lessonId: string): Promise<V2QuizQuestion[]> {
  const client = createV2SupabaseAdminClient();
  if (!client) return [];

  const { data, error } = await client
    .from('v2_question_versions')
    .select('id, question_id, stem, answer_key, metadata, v2_questions!inner(stable_key, question_type)')
    .eq('status', 'published')
    .eq('is_current', true)
    .eq('v2_questions.lesson_id', lessonId)
    .order('published_at', { ascending: true })
    .returns<PublishedQuestionRow[]>();

  if (error) {
    console.warn('[V2 Question Bank] Failed to list published quiz questions:', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    questionId: row.question_id,
    questionVersionId: row.id,
    stableId:
      typeof row.v2_questions?.stable_key === 'string'
        ? row.v2_questions.stable_key
        : `${row.question_id}:${row.id}`,
    prompt: row.stem,
    acceptedAnswers: toAcceptedAnswers(row.answer_key),
    options: toOptions(row.metadata?.options),
    sourceBlockId: typeof row.metadata?.sourceBlockId === 'string' ? row.metadata.sourceBlockId : '',
    sourceBlockType:
      row.metadata?.sourceBlockType === 'spaced-review'
        ? 'spaced-review'
        : row.metadata?.sourceBlockType === 'generated'
          ? 'generated'
          : 'practice',
  }));
}

export async function syncPublishedLessonQuestions(
  adminClient: SupabaseClient,
  input: {
    lessonId: string;
    lessonCode: string;
    lessonVersionId: string;
    contentJson: unknown;
    source: 'human' | 'ai';
    qualityScore: number | null;
  }
): Promise<{ questionCount: number; syncedCount: number; retiredCount: number }> {
  if (!isLessonShape(input.contentJson)) {
    return { questionCount: 0, syncedCount: 0, retiredCount: 0 };
  }

  const lesson = input.contentJson;
  const drafts = extractV2QuestionDraftsFromLesson(lesson);
  const stableKeys = new Set(drafts.map((draft) => draft.stableKey));

  const { data: existingQuestions, error: existingQuestionsError } = await adminClient
    .from('v2_questions')
    .select('id, stable_key')
    .eq('lesson_id', input.lessonId)
    .returns<ExistingQuestionRow[]>();
  if (existingQuestionsError) throw existingQuestionsError;

  const questionByStableKey = new Map((existingQuestions ?? []).map((row) => [row.stable_key, row]));
  let retiredCount = 0;
  let syncedCount = 0;

  for (const existingQuestion of existingQuestions ?? []) {
    if (stableKeys.has(existingQuestion.stable_key)) continue;
    const { error: retireError } = await adminClient
      .from('v2_question_versions')
      .update({
        status: 'retired',
        is_current: false,
      })
      .eq('question_id', existingQuestion.id)
      .eq('is_current', true);
    if (retireError) throw retireError;
    retiredCount += 1;
  }

  for (const draft of drafts) {
    let question = questionByStableKey.get(draft.stableKey) ?? null;
    if (!question) {
      const { data: insertedQuestion, error: insertQuestionError } = await adminClient
        .from('v2_questions')
        .insert({
          lesson_id: input.lessonId,
          stable_key: draft.stableKey,
          question_type: draft.questionType,
        })
        .select('id, stable_key')
        .single<ExistingQuestionRow>();
      if (insertQuestionError) throw insertQuestionError;
      question = insertedQuestion;
      questionByStableKey.set(draft.stableKey, question);
    }

    const { data: latestVersion, error: latestVersionError } = await adminClient
      .from('v2_question_versions')
      .select('id, version_no, status, is_current, stem, answer_key, metadata')
      .eq('question_id', question.id)
      .order('version_no', { ascending: false })
      .limit(1)
      .maybeSingle<ExistingQuestionVersionRow>();
    if (latestVersionError) throw latestVersionError;

    const nextAnswerKey = {
      acceptedAnswers: draft.acceptedAnswers,
    };
    const nextMetadata = toQuestionVersionMetadata(input.lessonCode, {
      sourceLessonVersionId: input.lessonVersionId,
      sourceBlockId: draft.sourceBlockId,
      sourceBlockType: draft.sourceBlockType,
      options: draft.options,
    });

    if (
      latestVersion &&
      latestVersion.status === 'published' &&
      latestVersion.is_current === true &&
      latestVersion.stem === draft.prompt &&
      stableJson(latestVersion.answer_key) === stableJson(nextAnswerKey) &&
      stableJson(latestVersion.metadata) === stableJson(nextMetadata)
    ) {
      continue;
    }

    const { data: insertedVersion, error: insertVersionError } = await adminClient.rpc(
      'v2_insert_published_question_version',
      {
        target_question_id: question.id,
        version_source: input.source,
        version_quality_score: input.qualityScore,
        version_stem: draft.prompt,
        version_answer_key: nextAnswerKey,
        version_metadata: nextMetadata,
        actor_user_id: null,
        publish_ts: new Date().toISOString(),
      }
    );
    if (insertVersionError) throw insertVersionError;
    if (!Array.isArray(insertedVersion) || insertedVersion.length === 0) {
      throw new Error(`Failed to create published question version for ${draft.stableKey}.`);
    }
    syncedCount += 1;
  }

  return {
    questionCount: drafts.length,
    syncedCount,
    retiredCount,
  };
}

export async function createV2QuestionDraftVersions(
  adminClient: SupabaseClient,
  input: {
    lessonId: string;
    lessonCode: string;
    drafts: Array<{
      stableKey: string;
      prompt: string;
      acceptedAnswers: string[];
      options: string[] | null;
      questionType: 'short' | 'mcq';
      sourceBlockId: string;
      sourceBlockType: 'practice' | 'spaced-review' | 'generated';
    }>;
    source: 'human' | 'ai';
    qualityScore: number | null;
    metadata?: Record<string, unknown>;
  }
): Promise<{ questionCount: number; createdCount: number; questionVersionIds: string[]; questionIds: string[] }> {
  let createdCount = 0;
  const questionVersionIds: string[] = [];
  const questionIds = new Set<string>();

  for (const draft of input.drafts) {
    let questionId: string;
    const { data: existingQuestion, error: existingQuestionError } = await adminClient
      .from('v2_questions')
      .select('id')
      .eq('stable_key', draft.stableKey)
      .limit(1)
      .maybeSingle<{ id: string }>();
    if (existingQuestionError) throw existingQuestionError;

    if (existingQuestion?.id) {
      questionId = existingQuestion.id;
    } else {
      const { data: insertedQuestion, error: insertQuestionError } = await adminClient
        .from('v2_questions')
        .insert({
          lesson_id: input.lessonId,
          stable_key: draft.stableKey,
          question_type: draft.questionType,
        })
        .select('id')
        .single<{ id: string }>();
      if (insertQuestionError) throw insertQuestionError;
      questionId = insertedQuestion.id;
    }
    questionIds.add(questionId);

    const metadata = toQuestionVersionMetadata(input.lessonCode, {
      sourceBlockId: draft.sourceBlockId,
      sourceBlockType: draft.sourceBlockType,
      options: draft.options,
      extraMetadata: input.metadata,
    });

    const { data: insertedVersion, error: insertVersionError } = await adminClient.rpc(
      'v2_insert_question_draft_version',
      {
        target_question_id: questionId,
        version_source: input.source,
        version_quality_score: input.qualityScore,
        version_stem: draft.prompt,
        version_answer_key: {
          acceptedAnswers: draft.acceptedAnswers,
        },
        version_metadata: metadata,
        actor_user_id: null,
      }
    );
    if (insertVersionError) throw insertVersionError;
    if (!Array.isArray(insertedVersion) || insertedVersion.length === 0) {
      throw new Error(`Failed to create draft question version for ${draft.stableKey}.`);
    }
    questionVersionIds.push((insertedVersion[0] as InsertedQuestionVersionRow).id);
    createdCount += 1;
  }

  return {
    questionCount: input.drafts.length,
    createdCount,
    questionVersionIds,
    questionIds: Array.from(questionIds),
  };
}
