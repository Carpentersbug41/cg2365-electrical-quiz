import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { deriveGuidedChunkSessionMetrics } from '@/lib/guidedChunk/analytics';
import { upsertReviewSignals } from '@/lib/review/reviewQueueRepo';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import type { GuidedChunkFrame, GuidedChunkReviewFlag, GuidedChunkSession } from '@/lib/guidedChunk/types';

function buildReviewStableId(frame: GuidedChunkFrame, reviewFlag: GuidedChunkReviewFlag): string {
  return `guided-chunk:${frame.lessonCode}:${reviewFlag.loId}:${reviewFlag.chunkId}:${reviewFlag.misconceptionCode ?? 'review'}`;
}

function buildReviewKey(frame: GuidedChunkFrame, reviewFlag: GuidedChunkReviewFlag): string {
  return `${frame.lessonCode}:${reviewFlag.loId}:${reviewFlag.chunkId}:${reviewFlag.misconceptionCode ?? 'review'}`;
}

function countEvents(session: GuidedChunkSession, type: string): number {
  return session.events.filter((event) => event.type === type).length;
}

export function buildGuidedChunkSessionSummary(frame: GuidedChunkFrame, session: GuidedChunkSession) {
  const derived = deriveGuidedChunkSessionMetrics(session);
  const startedAt = session.createdAt;
  const completedAt = session.status === 'completed' ? session.updatedAt : null;
  const durationSeconds = Math.max(
    0,
    Math.round((new Date(session.updatedAt).getTime() - new Date(startedAt).getTime()) / 1000)
  );
  const mcqCorrectTotal = session.loResults.reduce((sum, result) => sum + result.mcqCorrect, 0);
  const mcqTotal = session.loResults.reduce((sum, result) => sum + result.mcqTotal, 0);
  const shortAnswerPassedTotal = session.loResults.reduce((sum, result) => sum + result.shortAnswerPassed, 0);
  const shortAnswerTotal = session.loResults.reduce((sum, result) => sum + result.shortAnswerTotal, 0);

  return {
    session_id: session.id,
    user_id: session.userId ?? null,
    lesson_code: frame.lessonCode,
    lesson_version_id: session.lessonVersionId ?? null,
    source_context: session.sourceContext ?? 'guided_chunk_runtime',
    status: session.status,
    current_lo_index: session.currentLoIndex,
    exit_chunk_index: session.step.kind === 'question' ? session.step.chunk.chunkIndex : session.step.kind === 'microbreak' ? session.step.chunkIndex : null,
    review_flag_count: session.reviewFlags.length,
    repair_count: countEvents(session, 'repair_triggered'),
    microbreak_completed_count: countEvents(session, 'microbreak_completed'),
    microbreak_skipped_count: countEvents(session, 'microbreak_skipped'),
    lo_tests_completed: session.loResults.length,
    lo_count: frame.loSequence.length,
    mcq_correct_total: mcqCorrectTotal,
    mcq_total: mcqTotal,
    short_answer_passed_total: shortAnswerPassedTotal,
    short_answer_total: shortAnswerTotal,
    events_count: session.events.length,
    duration_seconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
    avg_response_latency_seconds: derived.avgResponseLatencySeconds,
    fatigue_score: derived.fatigueScore,
    fatigue_onset_chunk_index: derived.fatigueOnsetChunkIndex,
    confusion_score: derived.confusionScore,
    disengagement_score: derived.disengagementScore,
    support_dependence_score: derived.supportDependenceScore,
    recovery_rate_pct: derived.recoveryRatePct,
    transfer_quality_pct: derived.transferQualityPct,
    pace_mismatch_score: derived.paceMismatchScore,
    learning_efficiency: derived.learningEfficiency,
    started_at: startedAt,
    completed_at: completedAt,
  };
}

export async function syncGuidedChunkTelemetry(frame: GuidedChunkFrame, session: GuidedChunkSession): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return;

  const syncedEventIds = new Set(session.syncedEventIds ?? []);
  for (const event of session.events) {
    if (syncedEventIds.has(event.id)) continue;

    try {
      await writeV2CanonicalEvent(adminClient, {
        eventType: `guided_chunk_${event.type}`,
        userId: session.userId ?? null,
        sessionId: session.id,
        sourceContext: session.sourceContext ?? 'guided_chunk_v1',
        payload: {
          lessonCode: frame.lessonCode,
          lessonTitle: frame.title,
          runtimeVersion: frame.runtimeVersion,
          variantId: frame.variantId,
          lessonVersionId: session.lessonVersionId ?? null,
          lessonStatus: session.lessonStatus ?? null,
          reviewFlagCount: session.reviewFlags.length,
          ...event.payload,
        },
      });
      syncedEventIds.add(event.id);
    } catch {
      break;
    }
  }
  session.syncedEventIds = Array.from(syncedEventIds);

  if (!session.userId || session.reviewFlags.length === 0) {
    return;
  }

  const syncedReviewKeys = new Set(session.syncedReviewKeys ?? []);
  const pendingReviewFlags = session.reviewFlags.filter((flag) => !syncedReviewKeys.has(buildReviewKey(frame, flag)));
  if (pendingReviewFlags.length === 0) {
    return;
  }

  try {
    await adminClient.from('gc_session_summaries').upsert(buildGuidedChunkSessionSummary(frame, session), {
      onConflict: 'session_id',
    });
  } catch {
    // Session summary is a telemetry convenience layer. Leave event sync intact if this fails.
  }

  try {
    await upsertReviewSignals(
      adminClient,
      session.userId,
      pendingReviewFlags.map((flag) => ({
        questionStableId: buildReviewStableId(frame, flag),
        unitCode: frame.unit,
        loCode: flag.loId,
        acCode: flag.chunkId,
        reason: flag.misconceptionCode ? 'misconception' : 'wrong',
      }))
    );
    for (const flag of pendingReviewFlags) {
      syncedReviewKeys.add(buildReviewKey(frame, flag));
    }
    session.syncedReviewKeys = Array.from(syncedReviewKeys);
  } catch {
    // Leave review flags unsynced so a later request can retry.
  }
}
