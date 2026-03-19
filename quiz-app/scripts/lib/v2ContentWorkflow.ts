import fs from 'fs';
import path from 'path';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { GenerationRequest } from '@/lib/generation/types';

export type GeneratedDraftSummary = {
  lessonCode: string;
  versionId: string;
  versionNo: number;
  qualityScore: number | null;
  warnings: string[];
  blockCount: number;
  blockTypes: string[];
};

export type PublishedLessonSummary = {
  lessonCode: string;
  versionId: string;
  versionNo: number;
  publishedStatus: string;
  qualityScore: number | null;
  questionSync: {
    questionCount: number;
    syncedCount: number;
    retiredCount: number;
  };
  alreadyPublished?: boolean;
};

export type Phase1ValidationRow = {
  lessonCode: string;
  lessonId: string | null;
  publishedLessonVersionId: string | null;
  publishedVersionNo: number | null;
  qualityScore: number | null;
  questionCoverage: number;
  publishGateOk: boolean;
  issues: string[];
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
};

type LessonVersionRow = {
  id: string;
  lesson_id: string;
  version_no: number;
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
  quality_score: number | null;
  source: 'human' | 'ai';
  content_json: Record<string, unknown>;
};

export function loadEnvFiles(): void {
  for (const filePath of [path.join(process.cwd(), '.env.local'), path.join(process.cwd(), '.env')]) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || process.env[key]) continue;
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

export async function createConfiguredAdminClient() {
  const { createV2SupabaseAdminClient } = await import('../../src/lib/v2/supabase');
  const adminClient = createV2SupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client is not configured.');
  }
  return adminClient;
}

export async function generateDraftForLesson(
  adminClient: SupabaseClient,
  requestBody: Partial<GenerationRequest>,
  sourceContext = 'cli_v2_generate'
): Promise<GeneratedDraftSummary> {
  const { generateAndPersistV2LessonDraft } = await import('../../src/lib/v2/generation/service');
  const generated = await generateAndPersistV2LessonDraft(adminClient, {
    requestBody,
    requestContext: { coursePrefix: null, referer: null },
    actorUserId: null,
    sourceContext,
    importMode: sourceContext,
  });

  const blocks = Array.isArray(generated.generatedLesson.blocks) ? generated.generatedLesson.blocks : [];

  return {
    lessonCode: generated.lessonCode,
    versionId: generated.versionId,
    versionNo: generated.versionNo,
    qualityScore: generated.qualityScore,
    warnings: generated.warnings,
    blockCount: blocks.length,
    blockTypes: blocks.map((block) =>
      block && typeof block === 'object' && 'type' in block && typeof block.type === 'string'
        ? block.type
        : 'unknown'
    ),
  };
}

export async function publishLatestLessonVersion(
  adminClient: SupabaseClient,
  lessonCode: string,
  qualityScore?: number
): Promise<PublishedLessonSummary> {
  const [{ validateLessonVersionForPublish }, { syncPublishedLessonQuestions }, { writeV2CanonicalEvent }] =
    await Promise.all([
      import('../../src/lib/v2/content/publishGate'),
      import('../../src/lib/v2/questionBank'),
      import('../../src/lib/v2/events'),
    ]);

  const { data: lesson, error: lessonError } = await adminClient
    .from('v2_lessons')
    .select('id, code, title')
    .eq('code', lessonCode)
    .limit(1)
    .maybeSingle<LessonRow>();
  if (lessonError) throw lessonError;
  if (!lesson?.id) {
    throw new Error(`Lesson not found for code ${lessonCode}.`);
  }

  const { data: version, error: versionError } = await adminClient
    .from('v2_lesson_versions')
    .select('id, lesson_id, status, version_no, quality_score, source, content_json')
    .eq('lesson_id', lesson.id)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle<LessonVersionRow>();
  if (versionError) throw versionError;
  if (!version?.id) {
    throw new Error(`No lesson version found for ${lessonCode}.`);
  }

  if (Number.isFinite(qualityScore ?? Number.NaN) && qualityScore !== version.quality_score) {
    const { error: updateError } = await adminClient
      .from('v2_lesson_versions')
      .update({ quality_score: qualityScore })
      .eq('id', version.id);
    if (updateError) throw updateError;
    version.quality_score = qualityScore ?? null;
  }

  const gate = validateLessonVersionForPublish({
    lessonCode: lesson.code,
    lessonTitle: lesson.title,
    qualityScore: version.quality_score,
    content: version.content_json,
  });
  if (!gate.ok) {
    throw new Error(`Publish gate failed: ${gate.issues.map((issue) => issue.message).join(' | ')}`);
  }

  if (version.status === 'published') {
    return {
      lessonCode: lesson.code,
      versionId: version.id,
      versionNo: version.version_no,
      publishedStatus: 'published',
      qualityScore: version.quality_score,
      questionSync: { questionCount: 0, syncedCount: 0, retiredCount: 0 },
      alreadyPublished: true,
    };
  }

  const transitions: Array<'needs_review' | 'approved' | 'published'> = [];
  if (version.status === 'draft') transitions.push('needs_review', 'approved', 'published');
  else if (version.status === 'needs_review') transitions.push('approved', 'published');
  else if (version.status === 'approved') transitions.push('published');
  else throw new Error(`Cannot publish from status ${version.status}.`);

  let publishedStatus = 'published';
  for (const targetStatus of transitions) {
    const { data, error } = await adminClient.rpc('v2_apply_lesson_version_transition', {
      target_version_id: version.id,
      target_status: targetStatus,
      actor_user_id: null,
      transition_ts: new Date().toISOString(),
    });
    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) {
      const row = data[0] as { status?: string };
      publishedStatus = typeof row?.status === 'string' ? row.status : publishedStatus;
    }
  }

  const questionSync = await syncPublishedLessonQuestions(adminClient, {
    lessonId: lesson.id,
    lessonCode: lesson.code,
    lessonVersionId: version.id,
    contentJson: version.content_json,
    source: version.source,
    qualityScore: version.quality_score,
  });

  await adminClient.from('v2_event_log').insert({
    event_type: 'admin_lesson_version_transition',
    user_id: null,
    lesson_id: lesson.id,
    lesson_version_id: version.id,
    source_context: 'cli_v2_publish',
    payload: {
      action: 'publish',
      from: version.status,
      to: 'published',
      reason: 'Published via CLI to complete V2 Phase 1 content replacement.',
      questionSync,
    },
  });

  await writeV2CanonicalEvent(adminClient, {
    eventType: 'content_published',
    userId: null,
    lessonId: lesson.id,
    lessonVersionId: version.id,
    sourceContext: 'cli_v2_publish',
    payload: {
      contentType: 'lesson_version',
      lessonCode: lesson.code,
      action: 'publish',
      questionSync,
    },
  });

  return {
    lessonCode: lesson.code,
    versionId: version.id,
    versionNo: version.version_no,
    publishedStatus,
    qualityScore: version.quality_score,
    questionSync,
  };
}

export async function validatePhase1Lessons(
  adminClient: SupabaseClient,
  lessonCodes: string[]
): Promise<Phase1ValidationRow[]> {
  const { validateLessonVersionForPublish } = await import('../../src/lib/v2/content/publishGate');

  const { data: lessons, error: lessonsError } = await adminClient
    .from('v2_lessons')
    .select('id, code, title')
    .in('code', lessonCodes)
    .returns<LessonRow[]>();
  if (lessonsError) throw lessonsError;

  const lessonByCode = new Map((lessons ?? []).map((lesson) => [lesson.code, lesson]));
  const lessonIds = (lessons ?? []).map((lesson) => lesson.id);

  const { data: publishedVersions, error: versionsError } = await adminClient
    .from('v2_lesson_versions')
    .select('id, lesson_id, version_no, quality_score, source, content_json')
    .eq('status', 'published')
    .eq('is_current', true)
    .in('lesson_id', lessonIds)
    .returns<Array<Pick<LessonVersionRow, 'id' | 'lesson_id' | 'version_no' | 'quality_score' | 'source' | 'content_json'>>>();
  if (versionsError) throw versionsError;

  const versionByLessonId = new Map((publishedVersions ?? []).map((version) => [version.lesson_id, version]));

  const { data: questionVersions, error: questionVersionsError } = await adminClient
    .from('v2_question_versions')
    .select('id, v2_questions!inner(lesson_id)')
    .eq('status', 'published')
    .eq('is_current', true)
    .in('v2_questions.lesson_id', lessonIds)
    .returns<Array<{ id: string; v2_questions?: { lesson_id?: string } | null }>>();
  if (questionVersionsError) throw questionVersionsError;

  const questionCoverageByLessonId = new Map<string, number>();
  for (const row of questionVersions ?? []) {
    const related = row.v2_questions;
    const lessonId = related && typeof related.lesson_id === 'string' ? related.lesson_id : null;
    if (!lessonId) continue;
    questionCoverageByLessonId.set(lessonId, (questionCoverageByLessonId.get(lessonId) ?? 0) + 1);
  }

  return lessonCodes.map((lessonCode) => {
    const lesson = lessonByCode.get(lessonCode) ?? null;
    const version = lesson ? versionByLessonId.get(lesson.id) ?? null : null;
    const issues: string[] = [];

    if (!lesson) issues.push('Lesson row missing');
    if (!version) issues.push('Published current lesson version missing');

    let publishGateOk = false;
    if (lesson && version) {
      const gate = validateLessonVersionForPublish({
        lessonCode: lesson.code,
        lessonTitle: lesson.title,
        qualityScore: version.quality_score,
        content: version.content_json,
      });
      publishGateOk = gate.ok;
      if (!gate.ok) {
        issues.push(...gate.issues.map((issue) => issue.message));
      }
    }

    const questionCoverage = lesson ? questionCoverageByLessonId.get(lesson.id) ?? 0 : 0;
    if (questionCoverage <= 0) issues.push('Published question coverage missing');

    return {
      lessonCode,
      lessonId: lesson?.id ?? null,
      publishedLessonVersionId: version?.id ?? null,
      publishedVersionNo: version?.version_no ?? null,
      qualityScore: version?.quality_score ?? null,
      questionCoverage,
      publishGateOk,
      issues,
    };
  });
}
