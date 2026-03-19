import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type GenerationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

type GenerationJobRow = {
  id: string;
  status: GenerationStatus;
  kind: 'lesson_draft' | 'question_draft';
  lesson_id: string | null;
  attempts_made: number;
  max_attempts: number;
  started_at: string | null;
  payload: Record<string, unknown> | null;
};

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

const STUCK_RUNNING_THRESHOLD_MINUTES = 20;

function getAgeMinutes(iso: string | null): number | null {
  if (!iso) return null;
  const ageMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return null;
  return Math.round(ageMs / 60000);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const { jobId } = await context.params;
    if (!jobId) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'jobId is required.' },
        { status: 400 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { force?: boolean };
    const force = Boolean(body.force);

    const { data: job, error: jobError } = await adminClient
      .from('v2_generation_jobs')
      .select('id, status, kind, lesson_id, attempts_made, max_attempts, started_at, payload')
      .eq('id', jobId)
      .limit(1)
      .maybeSingle<GenerationJobRow>();
    if (jobError) throw jobError;
    if (!job) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Generation job not found.' },
        { status: 404 }
      );
    }

    if (job.status === 'queued') {
      return NextResponse.json({ success: true, message: 'Generation job is already queued.' });
    }
    if (job.status === 'succeeded') {
      return NextResponse.json(
        { success: false, code: 'INVALID_STATE', message: 'Succeeded jobs cannot be manually requeued.' },
        { status: 409 }
      );
    }

    const runningAgeMinutes = getAgeMinutes(job.started_at);
    if (
      job.status === 'running' &&
      !force &&
      ((runningAgeMinutes ?? 0) < STUCK_RUNNING_THRESHOLD_MINUTES)
    ) {
      return NextResponse.json(
        {
          success: false,
          code: 'JOB_NOT_STALE',
          message: `Running jobs can only be requeued after ${STUCK_RUNNING_THRESHOLD_MINUTES} minutes unless force=true.`,
        },
        { status: 409 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const manualRequeueCount =
      typeof job.payload?.manualRequeueCount === 'number' ? Number(job.payload.manualRequeueCount) : 0;

    const { error: updateError } = await adminClient
      .from('v2_generation_jobs')
      .update({
        status: 'queued',
        attempts_made: 0,
        started_at: null,
        finished_at: null,
        locked_by: null,
        locked_at: null,
        error_message: null,
        payload: {
          ...(job.payload ?? {}),
          manualRequeueAt: new Date().toISOString(),
          manualRequeueCount: manualRequeueCount + 1,
          retryScheduled: false,
        },
      })
      .eq('id', job.id);
    if (updateError) throw updateError;

    const { error: eventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_job_requeued',
      user_id: actorUserId,
      lesson_id: job.lesson_id,
      source_context: 'admin_v2',
      payload: {
        jobId: job.id,
        previousStatus: job.status,
        force,
        runningAgeMinutes,
      },
    });
    if (eventError) {
      console.warn('[V2 Admin] Failed to write generation requeue audit event:', eventError);
    }

    return NextResponse.json({
      success: true,
      message: 'Generation job requeued.',
      job: {
        id: job.id,
        status: 'queued',
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
