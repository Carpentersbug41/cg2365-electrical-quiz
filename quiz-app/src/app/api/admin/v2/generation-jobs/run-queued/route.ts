import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { getGcseBiologyPhase1TargetCodes } from '@/data/v2/gcse/biology/phase1Target';
import { GenerationJobError, runGenerationJobById } from '@/lib/v2/generation/runGenerationJob';
import { getV2GenerationQueueCadenceMinutes } from '@/lib/v2/operations';

type QueuedJob = {
  id: string;
  kind: 'lesson_draft' | 'question_draft';
  lesson_id: string | null;
  queued_at: string;
};

type LessonRow = {
  id: string;
  code: string;
};

type PublishedQuestionCoverageRow = {
  v2_questions?: {
    lesson_id: string | null;
  } | null;
};

async function sendAlertWebhook(payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.V2_ADMIN_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'v2_generation_queue_runner',
        ts: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (error) {
    console.warn('[V2 Admin] Failed to send queue-run alert webhook:', error);
  }
}

function hasCronAccess(request: NextRequest): boolean {
  const secret =
    process.env.V2_GENERATION_CRON_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    '';
  if (!secret) return false;

  const explicit = request.headers.get('x-cron-secret')?.trim();
  if (explicit && explicit === secret) return true;

  const authorization = request.headers.get('authorization')?.trim() || '';
  if (authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.slice(7).trim();
    if (token && token === secret) return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  const cronAccess = hasCronAccess(request);
  if (!cronAccess) {
    const denied = await guardV2AdminAccess(request, 'content_operator');
    if (denied) return denied;
  }

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { limit?: number };
    const limitRaw = Number(body.limit);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(20, Math.floor(limitRaw))) : 5;
    const cadenceMinutes = getV2GenerationQueueCadenceMinutes();

    const { data: queuedJobs, error: queuedError } = await adminClient
      .from('v2_generation_jobs')
      .select('id, kind, lesson_id, queued_at')
      .eq('status', 'queued')
      .order('queued_at', { ascending: true })
      .limit(Math.max(limit * 4, 20))
      .returns<QueuedJob[]>();
    if (queuedError) throw queuedError;

    const lessonIds = Array.from(
      new Set((queuedJobs ?? []).map((job) => job.lesson_id).filter((lessonId): lessonId is string => Boolean(lessonId)))
    );
    const [lessonsResult, publishedCoverageResult] = await Promise.all([
      lessonIds.length > 0
        ? adminClient.from('v2_lessons').select('id, code').in('id', lessonIds).returns<LessonRow[]>()
        : Promise.resolve({ data: [] as LessonRow[], error: null }),
      lessonIds.length > 0
        ? adminClient
            .from('v2_question_versions')
            .select('v2_questions!inner(lesson_id)')
            .eq('status', 'published')
            .eq('is_current', true)
            .in('v2_questions.lesson_id', lessonIds)
            .returns<PublishedQuestionCoverageRow[]>()
        : Promise.resolve({ data: [] as PublishedQuestionCoverageRow[], error: null }),
    ]);
    if (lessonsResult.error) throw lessonsResult.error;
    if (publishedCoverageResult.error) throw publishedCoverageResult.error;

    const lessonCodeById = new Map((lessonsResult.data ?? []).map((lesson) => [lesson.id, lesson.code]));
    const phase1Codes = new Set(getGcseBiologyPhase1TargetCodes());
    const coveredLessonIds = new Set(
      (publishedCoverageResult.data ?? [])
        .map((row) => row.v2_questions?.lesson_id)
        .filter((lessonId): lessonId is string => Boolean(lessonId))
    );
    const prioritizedJobs = (queuedJobs ?? [])
      .slice()
      .sort((a, b) => {
        const aCode = a.lesson_id ? lessonCodeById.get(a.lesson_id) ?? '' : '';
        const bCode = b.lesson_id ? lessonCodeById.get(b.lesson_id) ?? '' : '';
        const aPriority =
          a.kind === 'question_draft' && a.lesson_id && !coveredLessonIds.has(a.lesson_id)
            ? 0
            : a.kind === 'lesson_draft' && phase1Codes.has(aCode)
              ? 1
              : 2;
        const bPriority =
          b.kind === 'question_draft' && b.lesson_id && !coveredLessonIds.has(b.lesson_id)
            ? 0
            : b.kind === 'lesson_draft' && phase1Codes.has(bCode)
              ? 1
              : 2;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.queued_at.localeCompare(b.queued_at);
      })
      .slice(0, limit);
    const oldestQueuedAt = (queuedJobs ?? []).map((job) => job.queued_at).sort((a, b) => a.localeCompare(b))[0] ?? null;
    const oldestQueuedAgeMinutes =
      oldestQueuedAt == null ? null : Math.max(0, Math.round((Date.now() - new Date(oldestQueuedAt).getTime()) / 60000));

    const processed: Array<{
      jobId: string;
      status: 'succeeded' | 'skipped' | 'failed';
      reason?: string;
    }> = [];

    for (const job of prioritizedJobs) {
      try {
        const result = await runGenerationJobById(adminClient, job.id, cronAccess ? 'cron-worker' : 'admin-worker');
        processed.push({ jobId: result.jobId, status: 'succeeded' });
      } catch (error) {
        if (error instanceof GenerationJobError && (error.code === 'INVALID_STATE' || error.code === 'CLAIM_FAILED')) {
          processed.push({ jobId: job.id, status: 'skipped', reason: error.message });
          continue;
        }
        processed.push({
          jobId: job.id,
          status: 'failed',
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const failedCount = processed.filter((row) => row.status === 'failed').length;
    const dedupeWindowMinutes = 30;
    if (failedCount >= 3) {
      const sinceIso = new Date(Date.now() - dedupeWindowMinutes * 60 * 1000).toISOString();
      const { data: existingAlert, error: alertLookupError } = await adminClient
        .from('v2_event_log')
        .select('id')
        .eq('event_type', 'admin_generation_failure_spike_alert')
        .gte('event_ts', sinceIso)
        .order('event_ts', { ascending: false })
        .limit(1)
        .maybeSingle<{ id: string }>();
      if (alertLookupError) {
        console.warn('[V2 Admin] Failed to check dedupe window for failure spike alert:', alertLookupError);
      }

      if (!existingAlert?.id) {
        await sendAlertWebhook({
          type: 'generation_failure_spike',
          failedCount,
          attempted: prioritizedJobs.length,
          dedupeWindowMinutes,
          processed,
        });
        await adminClient.from('v2_event_log').insert({
          event_type: 'admin_generation_failure_spike_alert',
          source_context: cronAccess ? 'cron-worker' : 'admin-worker',
          payload: {
            failedCount,
            attempted: prioritizedJobs.length,
            dedupeWindowMinutes,
            cadenceMinutes,
          },
        });
      }
    }

    await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_queue_run',
      source_context: cronAccess ? 'cron-worker' : 'admin-worker',
      payload: {
        attempted: prioritizedJobs.length,
        succeeded: processed.filter((row) => row.status === 'succeeded').length,
        failed: failedCount,
        skipped: processed.filter((row) => row.status === 'skipped').length,
        queuedTotal: (queuedJobs ?? []).length,
        remainingQueued: Math.max((queuedJobs ?? []).length - prioritizedJobs.length, 0),
        oldestQueuedAgeMinutes,
        cadenceMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      attempted: prioritizedJobs.length,
      queued_total: (queuedJobs ?? []).length,
      remaining_queued: Math.max((queuedJobs ?? []).length - prioritizedJobs.length, 0),
      cadence_minutes: cadenceMinutes,
      oldest_queued_age_minutes: oldestQueuedAgeMinutes,
      processed,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
