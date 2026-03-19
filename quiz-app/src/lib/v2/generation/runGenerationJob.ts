import type { SupabaseClient } from '@supabase/supabase-js';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import { type V2GenerationRequest } from '@/lib/v2/generation/engine';
import { generateV2LessonDraftResult } from '@/lib/v2/generation/service';
import { persistV2LessonDraft } from '@/lib/v2/generation/persistLessonDraft';
import { generateV2QuestionDrafts } from '@/lib/v2/generation/questionEngine';
import { createV2QuestionDraftVersions } from '@/lib/v2/questionBank';

type GenerationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

type GenerationJobRow = {
  id: string;
  kind: 'lesson_draft' | 'question_draft';
  status: GenerationStatus;
  lesson_id: string | null;
  payload: Record<string, unknown>;
  attempts_made: number;
  max_attempts: number;
};

type GenerationErrorCode =
  | 'TRANSIENT_TIMEOUT'
  | 'TRANSIENT_RATE_LIMIT'
  | 'TRANSIENT_NETWORK'
  | 'CONFIG_AUTH'
  | 'VALIDATION'
  | 'UNKNOWN';

type LessonVersionRow = {
  version_no: number;
  content_json: Record<string, unknown> | null;
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
};

export type RunGenerationJobResult = {
  jobId: string;
  status: 'succeeded';
  output: Record<string, unknown>;
};

export class GenerationJobError extends Error {
  code:
    | 'NOT_FOUND'
    | 'INVALID_STATE'
    | 'NOT_IMPLEMENTED'
    | 'INVALID_JOB'
    | 'CLAIM_FAILED';
  status: number;

  constructor(
    code: GenerationJobError['code'],
    message: string,
    status = 400
  ) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function classifyGenerationError(error: unknown): GenerationErrorCode {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  if (message.includes('timeout') || message.includes('timed out') || message.includes('deadline')) {
    return 'TRANSIENT_TIMEOUT';
  }
  if (
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('429') ||
    message.includes('too many requests')
  ) {
    return 'TRANSIENT_RATE_LIMIT';
  }
  if (
    message.includes('econnreset') ||
    message.includes('enotfound') ||
    message.includes('fetch') ||
    message.includes('network')
  ) {
    return 'TRANSIENT_NETWORK';
  }
  if (
    message.includes('api key') ||
    message.includes('unauthorized') ||
    message.includes('403') ||
    message.includes('401')
  ) {
    return 'CONFIG_AUTH';
  }
  if (message.includes('validation') || message.includes('schema') || message.includes('invalid')) {
    return 'VALIDATION';
  }
  return 'UNKNOWN';
}

function isRetryableErrorCode(code: GenerationErrorCode): boolean {
  return code === 'TRANSIENT_TIMEOUT' || code === 'TRANSIENT_RATE_LIMIT' || code === 'TRANSIENT_NETWORK';
}

function toDurationMs(startedAtIso: string): number {
  const duration = Date.now() - new Date(startedAtIso).getTime();
  return Math.max(0, duration);
}

async function sendGenerationAlert(alert: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.V2_ADMIN_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'v2_generation_runner',
        ts: new Date().toISOString(),
        ...alert,
      }),
    });
  } catch (error) {
    console.warn('[V2 Generation] Failed to send alert webhook:', error);
  }
}

function parseLessonCode(lessonCode: string): { unit: string; lessonId: string } | null {
  const parts = lessonCode.trim().toUpperCase().split('-');
  if (parts.length !== 3) return null;
  const [prefix, unitNum, lessonTail] = parts;
  if (prefix !== 'BIO') return null;
  if (!unitNum || !lessonTail) return null;
  return { unit: `${prefix}-${unitNum}`, lessonId: lessonTail };
}

function toStringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((entry) => entry.length > 0);
}

function toV2GenerationRequest(lesson: LessonRow, promptText: string): V2GenerationRequest {
  const parsed = parseLessonCode(lesson.code);
  if (!parsed) {
    throw new GenerationJobError(
      'INVALID_JOB',
      `Unsupported lesson code format for V2 generation: ${lesson.code}`,
      400
    );
  }

  return {
    curriculum: 'gcse-science-biology',
    unit: parsed.unit,
    lessonId: parsed.lessonId,
    topic: lesson.title,
    section: lesson.title,
    layout: 'linear-flow',
    prerequisites: [],
    mustHaveTopics: lesson.title,
    additionalInstructions: promptText
      ? `V2 generation job prompt:\n${promptText}`
      : 'Generate a clear GCSE biology lesson aligned to the lesson code scope.',
  };
}

function toContextAwareGenerationRequest(
  lesson: LessonRow,
  payload: Record<string, unknown>,
  baseVersionContent: Record<string, unknown> | null
): V2GenerationRequest {
  const promptText = typeof payload?.prompt === 'string' ? payload.prompt.trim() : '';
  const fallbackRequest = toV2GenerationRequest(lesson, promptText);
  if (!baseVersionContent) return fallbackRequest;

  const topic = toStringOrEmpty(baseVersionContent.topic) || lesson.title;
  const section =
    toStringOrEmpty(baseVersionContent.unit) ||
    `Unit ${fallbackRequest.unit}`;
  const prerequisites = toStringArray(baseVersionContent.prerequisites);
  const learningOutcomes = toStringArray(baseVersionContent.learningOutcomes).slice(0, 6);
  const description = toStringOrEmpty(baseVersionContent.description);

  const mustHaveTopicsParts = [
    topic,
    ...learningOutcomes.map((outcome) => `LO: ${outcome}`),
  ].filter((part) => part.length > 0);

  const additionalInstructions = [
    promptText ? `V2 generation job prompt:\n${promptText}` : '',
    description ? `Keep lesson intent aligned to this description:\n${description}` : '',
    learningOutcomes.length > 0
      ? `Preserve alignment to these learning outcomes:\n${learningOutcomes.join('\n')}`
      : '',
    prerequisites.length > 0
      ? `Respect prerequisite chain:\n${prerequisites.join(', ')}`
      : '',
    'Output must remain GCSE Biology, student-first, plain text content blocks.',
  ]
    .filter((part) => part.length > 0)
    .join('\n\n');

  return {
    ...fallbackRequest,
    topic,
    section,
    prerequisites,
    mustHaveTopics: mustHaveTopicsParts.join('; '),
    additionalInstructions,
  };
}

async function generateDraftLessonContent(
  lesson: LessonRow,
  payload: Record<string, unknown>,
  baseVersionContent: Record<string, unknown> | null
): Promise<Awaited<ReturnType<typeof generateV2LessonDraftResult>>> {
  const request = toContextAwareGenerationRequest(lesson, payload, baseVersionContent);
  return generateV2LessonDraftResult(request);
}

async function generateDraftQuestionContent(
  lesson: LessonRow,
  payload: Record<string, unknown>,
  baseVersionContent: Record<string, unknown> | null,
  jobId: string
) {
  const request = toContextAwareGenerationRequest(lesson, payload, baseVersionContent);
  return generateV2QuestionDrafts(request, `${lesson.code}:${jobId}`);
}

export async function runGenerationJobById(
  adminClient: SupabaseClient,
  jobId: string,
  lockOwner: string
): Promise<RunGenerationJobResult> {
  const { data: job, error: jobError } = await adminClient
    .from('v2_generation_jobs')
    .select('id, kind, status, lesson_id, payload, attempts_made, max_attempts')
    .eq('id', jobId)
    .limit(1)
    .maybeSingle<GenerationJobRow>();
  if (jobError) throw jobError;
  if (!job) {
    throw new GenerationJobError('NOT_FOUND', 'Generation job not found.', 404);
  }
  if (job.status !== 'queued') {
    throw new GenerationJobError(
      'INVALID_STATE',
      `Only queued jobs can run (current: ${job.status}).`,
      409
    );
  }
  if (job.kind !== 'lesson_draft' && job.kind !== 'question_draft') {
    throw new GenerationJobError(
      'NOT_IMPLEMENTED',
      'Unsupported generation job kind.',
      400
    );
  }
  if (!job.lesson_id) {
    throw new GenerationJobError(
      'INVALID_JOB',
      'lesson_id missing for generation job.',
      400
    );
  }

  const startedAt = new Date().toISOString();
  const attemptsAfterClaim = (job.attempts_made ?? 0) + 1;
  const { data: claimRow, error: markRunningError } = await adminClient
    .from('v2_generation_jobs')
    .update({
      status: 'running',
      started_at: startedAt,
      attempts_made: attemptsAfterClaim,
      locked_by: lockOwner,
      locked_at: startedAt,
      error_message: null,
    })
    .eq('id', job.id)
    .eq('status', 'queued')
    .select('id')
    .maybeSingle<{ id: string }>();
  if (markRunningError) throw markRunningError;
  if (!claimRow?.id) {
    throw new GenerationJobError(
      'CLAIM_FAILED',
      'Generation job could not be claimed for processing.',
      409
    );
  }

  const { error: startedEventError } = await adminClient.from('v2_event_log').insert({
    event_type: 'admin_generation_job_started',
    lesson_id: job.lesson_id,
    source_context: 'admin_v2',
    payload: {
      jobId: job.id,
      kind: job.kind,
      lockOwner,
    },
  });
  if (startedEventError) {
    console.warn('[V2 Admin] Failed to write generation start audit event:', startedEventError);
  }

  try {
    await writeV2CanonicalEvent(adminClient, {
      eventType: 'generation_job_started',
      lessonId: job.lesson_id,
      sourceContext: 'admin_v2',
      payload: {
        jobId: job.id,
        kind: job.kind,
        lockOwner,
      },
    });
  } catch (error) {
    console.warn('[V2 Admin] Failed to write canonical generation start event:', error);
  }

  let insertedVersionId: string | null = null;
  let insertedQuestionVersionIds: string[] = [];
  let insertedQuestionIds: string[] = [];
  const stepKey = job.kind === 'question_draft' ? 'create_question_draft' : 'create_lesson_draft';

  try {
    const { data: lesson, error: lessonError } = await adminClient
      .from('v2_lessons')
      .select('id, code, title')
      .eq('id', job.lesson_id)
      .limit(1)
      .single<LessonRow>();
    if (lessonError) throw lessonError;

    const { data: latestVersion, error: latestVersionError } = await adminClient
      .from('v2_lesson_versions')
      .select('version_no, content_json')
      .eq('lesson_id', job.lesson_id)
      .order('version_no', { ascending: false })
      .limit(1)
      .maybeSingle<LessonVersionRow>();
    if (latestVersionError) throw latestVersionError;

    let output: Record<string, unknown>;

    if (job.kind === 'lesson_draft') {
      const generatedDraft = await generateDraftLessonContent(
        lesson,
        job.payload ?? {},
        latestVersion?.content_json ?? null
      );
      const persisted = await persistV2LessonDraft(adminClient, {
        lessonCode: generatedDraft.lessonCode,
        generatedLesson: generatedDraft.generatedLesson,
        actorUserId: null,
        sourceContext: 'admin_v2_generation_job',
        importMode: 'queued_generation_job',
        sourcePayload: {
          generatorResponse: {
            refinementMetadata: generatedDraft.refinementMetadata,
          },
          phases: generatedDraft.phases,
        },
      });
      insertedVersionId = persisted.versionId;

      output = {
        generatedLessonVersionId: persisted.versionId,
        baseVersionNo: latestVersion?.version_no ?? null,
        generatedVersionNo: persisted.versionNo,
        qualityScore: persisted.qualityScore,
      };
    } else {
      const drafts = await generateDraftQuestionContent(
        lesson,
        job.payload ?? {},
        latestVersion?.content_json ?? null,
        job.id
      );
      const questionDraftOutput = await createV2QuestionDraftVersions(adminClient, {
        lessonId: job.lesson_id,
        lessonCode: lesson.code,
        drafts,
        source: 'ai',
        qualityScore: null,
        metadata: {
          sourceGenerationJobId: job.id,
          sourceLessonVersionNo: latestVersion?.version_no ?? null,
        },
      });
      insertedQuestionVersionIds = questionDraftOutput.questionVersionIds;
      insertedQuestionIds = questionDraftOutput.questionIds;
      output = {
        generatedQuestionCount: questionDraftOutput.questionCount,
        createdQuestionVersions: questionDraftOutput.createdCount,
        questionVersionIds: questionDraftOutput.questionVersionIds,
      };
    }

    const { error: stepError } = await adminClient.from('v2_generation_job_steps').insert({
      job_id: job.id,
      step_key: stepKey,
      status: 'succeeded',
      input_json: job.payload ?? {},
      output_json: output,
      duration_ms: toDurationMs(startedAt),
    });
    if (stepError) throw stepError;

    const { error: artifactError } = await adminClient.from('v2_generation_artifacts').insert({
      job_id: job.id,
      artifact_type: job.kind,
      artifact_json: output,
    });
    if (artifactError) throw artifactError;

    const finishedAt = new Date().toISOString();
    const { error: markSuccessError } = await adminClient
      .from('v2_generation_jobs')
      .update({
        status: 'succeeded',
        finished_at: finishedAt,
        locked_by: null,
        locked_at: null,
        error_message: null,
      })
      .eq('id', job.id);
    if (markSuccessError) throw markSuccessError;

    const { error: successEventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_job_succeeded',
      lesson_id: job.lesson_id,
      source_context: 'admin_v2',
      payload: {
        jobId: job.id,
        output,
      },
    });
    if (successEventError) {
      console.warn('[V2 Admin] Failed to write generation success audit event:', successEventError);
    }

    try {
      await writeV2CanonicalEvent(adminClient, {
        eventType: 'generation_job_completed',
        lessonId: job.lesson_id,
        sourceContext: 'admin_v2',
        payload: {
          jobId: job.id,
          status: 'succeeded',
          durationMs: toDurationMs(startedAt),
          output,
        },
      });
    } catch (error) {
      console.warn('[V2 Admin] Failed to write canonical generation completion event:', error);
    }

    return {
      jobId: job.id,
      status: 'succeeded',
      output,
    };
  } catch (runError) {
    const finishedAt = new Date().toISOString();
    const errorMessage = runError instanceof Error ? runError.message : 'Unknown generation failure.';
    const errorCode = classifyGenerationError(runError);
    const canRetry = isRetryableErrorCode(errorCode) && attemptsAfterClaim < (job.max_attempts ?? 1);
    const nextStatus: GenerationStatus = canRetry ? 'queued' : 'failed';
    const updatedPayload = {
      ...(job.payload ?? {}),
      lastErrorCode: errorCode,
      lastErrorMessage: errorMessage,
      lastErrorAt: finishedAt,
      retryScheduled: canRetry,
    };

    await adminClient
      .from('v2_generation_jobs')
      .update({
        status: nextStatus,
        finished_at: finishedAt,
        locked_by: null,
        locked_at: null,
        error_message: `[${errorCode}] ${errorMessage}`,
        payload: updatedPayload,
      })
      .eq('id', job.id);

    await adminClient.from('v2_generation_job_steps').insert({
      job_id: job.id,
      step_key: stepKey,
      status: 'failed',
      input_json: job.payload ?? {},
      output_json: {
        errorCode,
        attemptsMade: attemptsAfterClaim,
        maxAttempts: job.max_attempts,
        retryScheduled: canRetry,
      },
      error_message: errorMessage,
      duration_ms: toDurationMs(startedAt),
    });

    await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_job_failed',
      lesson_id: job.lesson_id,
      source_context: 'admin_v2',
      payload: {
        jobId: job.id,
        errorCode,
        error: errorMessage,
        nextStatus,
        retryScheduled: canRetry,
        lockOwner,
      },
    });

    try {
      await writeV2CanonicalEvent(adminClient, {
        eventType: 'generation_job_completed',
        lessonId: job.lesson_id,
        sourceContext: 'admin_v2',
        payload: {
          jobId: job.id,
          status: nextStatus,
          durationMs: toDurationMs(startedAt),
          errorCode,
          error: errorMessage,
          retryScheduled: canRetry,
        },
      });
    } catch (error) {
      console.warn('[V2 Admin] Failed to write canonical generation failure event:', error);
    }

    if (insertedVersionId) {
      const { error: cleanupError } = await adminClient
        .from('v2_lesson_versions')
        .delete()
        .eq('id', insertedVersionId);
      if (cleanupError) {
        console.warn('[V2 Generation] Failed to clean up draft version after run failure:', cleanupError);
      }
    }

    if (insertedQuestionVersionIds.length > 0) {
      const { error: cleanupQuestionVersionsError } = await adminClient
        .from('v2_question_versions')
        .delete()
        .in('id', insertedQuestionVersionIds);
      if (cleanupQuestionVersionsError) {
        console.warn(
          '[V2 Generation] Failed to clean up draft question versions after run failure:',
          cleanupQuestionVersionsError
        );
      }
    }

    if (insertedQuestionIds.length > 0) {
      for (const questionId of insertedQuestionIds) {
        const { data: remainingVersions, error: remainingVersionsError } = await adminClient
          .from('v2_question_versions')
          .select('id')
          .eq('question_id', questionId)
          .limit(1);
        if (remainingVersionsError) {
          console.warn('[V2 Generation] Failed to inspect question versions after cleanup:', remainingVersionsError);
          continue;
        }
        if ((remainingVersions ?? []).length > 0) continue;
        const { error: cleanupQuestionError } = await adminClient
          .from('v2_questions')
          .delete()
          .eq('id', questionId);
        if (cleanupQuestionError) {
          console.warn('[V2 Generation] Failed to clean up orphan question after run failure:', cleanupQuestionError);
        }
      }
    }

    if (!canRetry) {
      await sendGenerationAlert({
        type: 'generation_retry_exhausted',
        jobId: job.id,
        lessonId: job.lesson_id,
        lockOwner,
        errorCode,
        errorMessage,
        attemptsMade: attemptsAfterClaim,
        maxAttempts: job.max_attempts,
      });
    }

    throw runError;
  }
}
