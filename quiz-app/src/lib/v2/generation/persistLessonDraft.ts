import type { SupabaseClient } from '@supabase/supabase-js';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import { normalizeV2LessonCode } from '@/lib/v2/lessonCode';

type LessonLookupRow = {
  id: string;
  code: string;
};

type LessonVersionRow = {
  version_no: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function inferQualityScore(
  generatedLesson: Record<string, unknown>,
  sourcePayload: Record<string, unknown> | null
): number | null {
  const generationScores = sourcePayload && isRecord(sourcePayload.generationScores)
    ? sourcePayload.generationScores
    : null;
  const generatorResponse = sourcePayload && isRecord(sourcePayload.generatorResponse)
    ? sourcePayload.generatorResponse
    : null;
  const refinementMetadata = generatorResponse && isRecord(generatorResponse.refinementMetadata)
    ? generatorResponse.refinementMetadata
    : null;
  const metadata = isRecord(generatedLesson.metadata) ? generatedLesson.metadata : null;
  const generationScoreDetails = metadata && isRecord(metadata.generationScoreDetails)
    ? metadata.generationScoreDetails
    : null;

  return (
    toFiniteNumber(generationScores?.phase13FinalScore) ??
    toFiniteNumber(refinementMetadata?.finalScore) ??
    toFiniteNumber(generationScoreDetails?.finalScore) ??
    toFiniteNumber(metadata?.generationScore)
  );
}

export async function persistV2LessonDraft(
  adminClient: SupabaseClient,
  input: {
    lessonCode: string;
    generatedLesson: Record<string, unknown>;
    actorUserId?: string | null;
    sourceContext: string;
    sourcePayload?: Record<string, unknown> | null;
    importMode?: string;
  }
): Promise<{ lessonId: string; lessonCode: string; versionId: string; versionNo: number; qualityScore: number | null }> {
  const lessonCode = normalizeV2LessonCode(input.lessonCode);
  if (!lessonCode) {
    throw new Error('lessonCode is required.');
  }

  const { data: lesson, error: lessonError } = await adminClient
    .from('v2_lessons')
    .select('id, code')
    .eq('code', lessonCode)
    .limit(1)
    .maybeSingle<LessonLookupRow>();
  if (lessonError) throw lessonError;
  if (!lesson?.id) {
    throw new Error(`V2 lesson not found for code ${lessonCode}.`);
  }

  const { data: latestVersion, error: latestVersionError } = await adminClient
    .from('v2_lesson_versions')
    .select('version_no')
    .eq('lesson_id', lesson.id)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle<LessonVersionRow>();
  if (latestVersionError) throw latestVersionError;

  const nextVersionNo = (latestVersion?.version_no ?? 0) + 1;
  const qualityScore = inferQualityScore(input.generatedLesson, input.sourcePayload ?? null);

  const { data: insertedVersion, error: insertError } = await adminClient
    .from('v2_lesson_versions')
    .insert({
      lesson_id: lesson.id,
      version_no: nextVersionNo,
      status: 'draft',
      source: 'ai',
      quality_score: qualityScore,
      content_json: input.generatedLesson,
      is_current: false,
      created_by: input.actorUserId ?? null,
      approved_by: null,
      published_at: null,
    })
    .select('id')
    .single<{ id: string }>();
  if (insertError) throw insertError;

  await adminClient.from('v2_event_log').insert({
    event_type: 'admin_v2_lesson_draft_imported',
    user_id: input.actorUserId ?? null,
    lesson_id: lesson.id,
    source_context: input.sourceContext,
    payload: {
      lessonCode,
      lessonVersionId: insertedVersion.id,
      lessonVersionNo: nextVersionNo,
      qualityScore,
    },
  });

  try {
    await writeV2CanonicalEvent(adminClient, {
      eventType: 'generation_job_completed',
      userId: input.actorUserId ?? null,
      lessonId: lesson.id,
      lessonVersionId: insertedVersion.id,
      sourceContext: input.sourceContext,
      payload: {
        importMode: input.importMode ?? 'manual_draft_import',
        lessonCode,
        lessonVersionNo: nextVersionNo,
        qualityScore,
      },
    });
  } catch (error) {
    console.warn('[V2 Generation] Failed to write canonical imported lesson event:', error);
  }

  return {
    lessonId: lesson.id,
    lessonCode,
    versionId: insertedVersion.id,
    versionNo: nextVersionNo,
    qualityScore,
  };
}
