import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { GenerationJobError, runGenerationJobById } from '@/lib/v2/generation/runGenerationJob';

type QueuedJob = {
  id: string;
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
    const denied = await guardV2AdminAccess(request);
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

    const { data: queuedJobs, error: queuedError } = await adminClient
      .from('v2_generation_jobs')
      .select('id')
      .eq('status', 'queued')
      .order('queued_at', { ascending: true })
      .limit(limit)
      .returns<QueuedJob[]>();
    if (queuedError) throw queuedError;

    const processed: Array<{
      jobId: string;
      status: 'succeeded' | 'skipped' | 'failed';
      reason?: string;
    }> = [];

    for (const job of queuedJobs ?? []) {
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
          attempted: queuedJobs?.length ?? 0,
          dedupeWindowMinutes,
          processed,
        });
        await adminClient.from('v2_event_log').insert({
          event_type: 'admin_generation_failure_spike_alert',
          source_context: cronAccess ? 'cron-worker' : 'admin-worker',
          payload: {
            failedCount,
            attempted: queuedJobs?.length ?? 0,
            dedupeWindowMinutes,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      attempted: queuedJobs?.length ?? 0,
      processed,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
