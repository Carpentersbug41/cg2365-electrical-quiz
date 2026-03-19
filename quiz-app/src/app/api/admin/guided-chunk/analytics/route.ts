import { NextRequest, NextResponse } from 'next/server';
import { deriveGuidedChunkSessionMetrics } from '@/lib/guidedChunk/analytics';
import { listGuidedChunkExperiments } from '@/lib/guidedChunk/experimentStore';
import type { GuidedChunkSession } from '@/lib/guidedChunk/types';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';

type GuidedSummaryRow = {
  session_id: string;
  lesson_code: string;
  lesson_version_id: string | null;
  source_context: string;
  status: 'active' | 'completed' | 'abandoned';
  review_flag_count: number;
  repair_count: number;
  mcq_correct_total: number;
  mcq_total: number;
  short_answer_passed_total: number;
  short_answer_total: number;
  duration_seconds: number | null;
  avg_response_latency_seconds: number | null;
  fatigue_score: number | null;
  fatigue_onset_chunk_index: number | null;
  confusion_score: number | null;
  disengagement_score: number | null;
  support_dependence_score: number | null;
  recovery_rate_pct: number | null;
  transfer_quality_pct: number | null;
  pace_mismatch_score: number | null;
  learning_efficiency: number | null;
  gc_lesson_versions?: {
    variant_id?: string | null;
    runtime_version?: string | null;
  } | null;
};

type GuidedSessionRow = {
  id: string;
  lesson_code: string;
  lesson_version_id: string | null;
  source_context: string | null;
  status: 'active' | 'completed' | 'abandoned';
  current_lo_index: number | null;
  review_flag_count: number | null;
  created_at: string;
  updated_at: string;
  session_json: GuidedChunkSession;
  gc_lesson_versions?: {
    variant_id?: string | null;
    runtime_version?: string | null;
  } | null;
};

type V2SessionRow = {
  status: 'started' | 'completed' | 'abandoned';
  lesson_id: string;
  v2_lessons?: {
    code?: string;
  } | null;
};

type SummaryAccumulator = {
  lessonCode: string;
  sourceContext: string;
  lessonVersionId: string | null;
  variantId: string | null;
  runtimeVersion: string | null;
  started: number;
  completed: number;
  abandoned: number;
  reviewFlags: number;
  repairs: number;
  durations: number;
  mcqPctTotal: number;
  shortPctTotal: number;
  responseLatencyTotal: number;
  responseLatencyCount: number;
  fatigueScoreTotal: number;
  fatigueCount: number;
  fatigueOnsetTotal: number;
  fatigueOnsetCount: number;
  confusionScoreTotal: number;
  confusionCount: number;
  disengagementScoreTotal: number;
  disengagementCount: number;
  supportDependenceScoreTotal: number;
  supportDependenceCount: number;
  recoveryRateTotal: number;
  recoveryRateCount: number;
  transferQualityTotal: number;
  transferQualityCount: number;
  paceMismatchScoreTotal: number;
  paceMismatchCount: number;
  learningEfficiencyTotal: number;
  learningEfficiencyCount: number;
};

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 10000) / 100;
}

function average(total: number, count: number): number | null {
  if (count <= 0) return null;
  return Math.round((total / count) * 100) / 100;
}

function classifyExperimentResult(input: {
  metricsToWatch: string[];
  deltas: {
    completionRatePct: number | null;
    fatigueScore: number | null;
    confusionScore: number | null;
    transferQualityPct: number | null;
    learningEfficiency: number | null;
  } | null;
}): 'win' | 'loss' | 'mixed' | 'inconclusive' {
  const deltas = input.deltas;
  if (!deltas) return 'inconclusive';

  const metricDirection: Record<string, { delta: number | null; favorableWhen: 'up' | 'down' }> = {
    completionRatePct: { delta: deltas.completionRatePct, favorableWhen: 'up' },
    fatigueScore: { delta: deltas.fatigueScore, favorableWhen: 'down' },
    confusionScore: { delta: deltas.confusionScore, favorableWhen: 'down' },
    transferQualityPct: { delta: deltas.transferQualityPct, favorableWhen: 'up' },
    learningEfficiency: { delta: deltas.learningEfficiency, favorableWhen: 'up' },
  };

  const watched = input.metricsToWatch.length > 0 ? input.metricsToWatch : Object.keys(metricDirection);
  let favorable = 0;
  let unfavorable = 0;
  let observed = 0;

  for (const metric of watched) {
    const config = metricDirection[metric];
    if (!config || config.delta === null) continue;
    observed += 1;
    if ((config.favorableWhen === 'up' && config.delta > 0) || (config.favorableWhen === 'down' && config.delta < 0)) {
      favorable += 1;
    } else if (config.delta !== 0) {
      unfavorable += 1;
    }
  }

  if (observed === 0) return 'inconclusive';
  if (favorable > 0 && unfavorable === 0) return 'win';
  if (unfavorable > 0 && favorable === 0) return 'loss';
  if (favorable > 0 && unfavorable > 0) return 'mixed';
  return 'inconclusive';
}

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ summaries: [], comparisons: [], sessions: [], experiments: [], experimentChanges: [], experimentPerformance: [] });
  }

  const [guidedResult, sessionsResult, v2Result, experimentData] = await Promise.all([
    adminClient
      .from('gc_session_summaries')
      .select(
        'session_id, lesson_code, lesson_version_id, source_context, status, review_flag_count, repair_count, mcq_correct_total, mcq_total, short_answer_passed_total, short_answer_total, duration_seconds, avg_response_latency_seconds, fatigue_score, fatigue_onset_chunk_index, confusion_score, disengagement_score, support_dependence_score, recovery_rate_pct, transfer_quality_pct, pace_mismatch_score, learning_efficiency, gc_lesson_versions(variant_id, runtime_version)'
      )
      .order('updated_at', { ascending: false }),
    adminClient
      .from('gc_sessions')
      .select(
        'id, lesson_code, lesson_version_id, source_context, status, current_lo_index, review_flag_count, created_at, updated_at, session_json, gc_lesson_versions(variant_id, runtime_version)'
      )
      .order('updated_at', { ascending: false })
      .limit(50),
    adminClient
      .from('v2_lesson_sessions')
      .select('status, lesson_id, v2_lessons!inner(code)')
      .order('updated_at', { ascending: false }),
    listGuidedChunkExperiments(),
  ]);

  const guidedRows = guidedResult.error ? [] : ((guidedResult.data ?? []) as GuidedSummaryRow[]);
  const sessionRows = sessionsResult.error ? [] : ((sessionsResult.data ?? []) as GuidedSessionRow[]);
  const v2Rows = v2Result.error ? [] : ((v2Result.data ?? []) as V2SessionRow[]);
  const { experiments, changes } = experimentData;
  const sessionById = new Map(sessionRows.map((row) => [row.id, row]));

  const summaryMap = new Map<string, SummaryAccumulator>();

  for (const row of guidedRows) {
    const fallbackSession = sessionById.get(row.session_id)?.session_json ?? null;
    const fallbackDerived = fallbackSession ? deriveGuidedChunkSessionMetrics(fallbackSession) : null;
    const key = `${row.lesson_code}:${row.lesson_version_id ?? 'builtin'}:${row.source_context}`;
    const current =
      summaryMap.get(key) ??
      {
        lessonCode: row.lesson_code,
        sourceContext: row.source_context,
        lessonVersionId: row.lesson_version_id,
        variantId: row.gc_lesson_versions?.variant_id ?? null,
        runtimeVersion: row.gc_lesson_versions?.runtime_version ?? null,
        started: 0,
        completed: 0,
        abandoned: 0,
        reviewFlags: 0,
        repairs: 0,
        durations: 0,
        mcqPctTotal: 0,
        shortPctTotal: 0,
        responseLatencyTotal: 0,
        responseLatencyCount: 0,
        fatigueScoreTotal: 0,
        fatigueCount: 0,
        fatigueOnsetTotal: 0,
        fatigueOnsetCount: 0,
        confusionScoreTotal: 0,
        confusionCount: 0,
        disengagementScoreTotal: 0,
        disengagementCount: 0,
        supportDependenceScoreTotal: 0,
        supportDependenceCount: 0,
        recoveryRateTotal: 0,
        recoveryRateCount: 0,
        transferQualityTotal: 0,
        transferQualityCount: 0,
        paceMismatchScoreTotal: 0,
        paceMismatchCount: 0,
        learningEfficiencyTotal: 0,
        learningEfficiencyCount: 0,
      } satisfies SummaryAccumulator;

    current.started += 1;
    if (row.status === 'completed') current.completed += 1;
    if (row.status === 'abandoned') current.abandoned += 1;
    current.reviewFlags += row.review_flag_count;
    current.repairs += row.repair_count;
    current.durations += row.duration_seconds ?? 0;
    current.mcqPctTotal += toPercent(row.mcq_correct_total, row.mcq_total) ?? 0;
    current.shortPctTotal += toPercent(row.short_answer_passed_total, row.short_answer_total) ?? 0;

    const avgResponseLatencySeconds =
      typeof row.avg_response_latency_seconds === 'number'
        ? row.avg_response_latency_seconds
        : fallbackDerived?.avgResponseLatencySeconds ?? null;
    const fatigueScore =
      typeof row.fatigue_score === 'number' ? row.fatigue_score : fallbackDerived?.fatigueScore ?? null;
    const fatigueOnsetChunkIndex =
      typeof row.fatigue_onset_chunk_index === 'number'
        ? row.fatigue_onset_chunk_index
        : fallbackDerived?.fatigueOnsetChunkIndex ?? null;
    const confusionScore =
      typeof row.confusion_score === 'number' ? row.confusion_score : fallbackDerived?.confusionScore ?? null;
    const disengagementScore =
      typeof row.disengagement_score === 'number'
        ? row.disengagement_score
        : fallbackDerived?.disengagementScore ?? null;
    const supportDependenceScore =
      typeof row.support_dependence_score === 'number'
        ? row.support_dependence_score
        : fallbackDerived?.supportDependenceScore ?? null;
    const recoveryRatePct =
      typeof row.recovery_rate_pct === 'number' ? row.recovery_rate_pct : fallbackDerived?.recoveryRatePct ?? null;
    const transferQualityPct =
      typeof row.transfer_quality_pct === 'number'
        ? row.transfer_quality_pct
        : fallbackDerived?.transferQualityPct ?? null;
    const paceMismatchScore =
      typeof row.pace_mismatch_score === 'number'
        ? row.pace_mismatch_score
        : fallbackDerived?.paceMismatchScore ?? null;
    const learningEfficiency =
      typeof row.learning_efficiency === 'number'
        ? row.learning_efficiency
        : fallbackDerived?.learningEfficiency ?? null;

    if (typeof avgResponseLatencySeconds === 'number') {
      current.responseLatencyTotal += avgResponseLatencySeconds;
      current.responseLatencyCount += 1;
    }
    if (typeof fatigueScore === 'number') {
      current.fatigueScoreTotal += fatigueScore;
      current.fatigueCount += 1;
    }
    if (typeof fatigueOnsetChunkIndex === 'number') {
      current.fatigueOnsetTotal += fatigueOnsetChunkIndex;
      current.fatigueOnsetCount += 1;
    }
    if (typeof confusionScore === 'number') {
      current.confusionScoreTotal += confusionScore;
      current.confusionCount += 1;
    }
    if (typeof disengagementScore === 'number') {
      current.disengagementScoreTotal += disengagementScore;
      current.disengagementCount += 1;
    }
    if (typeof supportDependenceScore === 'number') {
      current.supportDependenceScoreTotal += supportDependenceScore;
      current.supportDependenceCount += 1;
    }
    if (typeof recoveryRatePct === 'number') {
      current.recoveryRateTotal += recoveryRatePct;
      current.recoveryRateCount += 1;
    }
    if (typeof transferQualityPct === 'number') {
      current.transferQualityTotal += transferQualityPct;
      current.transferQualityCount += 1;
    }
    if (typeof paceMismatchScore === 'number') {
      current.paceMismatchScoreTotal += paceMismatchScore;
      current.paceMismatchCount += 1;
    }
    if (typeof learningEfficiency === 'number') {
      current.learningEfficiencyTotal += learningEfficiency;
      current.learningEfficiencyCount += 1;
    }

    summaryMap.set(key, current);
  }

  const summaries = Array.from(summaryMap.values()).map((entry) => ({
    lessonCode: entry.lessonCode,
    sourceContext: entry.sourceContext,
    lessonVersionId: entry.lessonVersionId,
    variantId: entry.variantId,
    runtimeVersion: entry.runtimeVersion,
    started: entry.started,
    completed: entry.completed,
    abandoned: entry.abandoned,
    completionRatePct: toPercent(entry.completed, entry.started),
    avgReviewFlags: average(entry.reviewFlags, entry.started),
    avgRepairCount: average(entry.repairs, entry.started),
    avgDurationSeconds: average(entry.durations, entry.started),
    mcqPct: average(entry.mcqPctTotal, entry.started),
    shortAnswerPct: average(entry.shortPctTotal, entry.started),
    avgResponseLatencySeconds: average(entry.responseLatencyTotal, entry.responseLatencyCount),
    fatigueScore: average(entry.fatigueScoreTotal, entry.fatigueCount),
    fatigueOnsetChunkIndex: average(entry.fatigueOnsetTotal, entry.fatigueOnsetCount),
    confusionScore: average(entry.confusionScoreTotal, entry.confusionCount),
    disengagementScore: average(entry.disengagementScoreTotal, entry.disengagementCount),
    supportDependenceScore: average(entry.supportDependenceScoreTotal, entry.supportDependenceCount),
    recoveryRatePct: average(entry.recoveryRateTotal, entry.recoveryRateCount),
    transferQualityPct: average(entry.transferQualityTotal, entry.transferQualityCount),
    paceMismatchScore: average(entry.paceMismatchScoreTotal, entry.paceMismatchCount),
    learningEfficiency: average(entry.learningEfficiencyTotal, entry.learningEfficiencyCount),
  }));

  const v2Map = new Map<string, { started: number; completed: number; abandoned: number }>();
  for (const row of v2Rows) {
    const lessonCode = row.v2_lessons?.code;
    if (!lessonCode) continue;
    const current = v2Map.get(lessonCode) ?? { started: 0, completed: 0, abandoned: 0 };
    current.started += 1;
    if (row.status === 'completed') current.completed += 1;
    if (row.status === 'abandoned') current.abandoned += 1;
    v2Map.set(lessonCode, current);
  }

  const comparisons = summaries.map((summary) => {
    const v2 = v2Map.get(summary.lessonCode) ?? null;
    return {
      lessonCode: summary.lessonCode,
      guidedSourceContext: summary.sourceContext,
      guidedCompletionRatePct: summary.completionRatePct,
      guidedStarted: summary.started,
      guidedCompleted: summary.completed,
      guidedFatigueScore: summary.fatigueScore,
      guidedConfusionScore: summary.confusionScore,
      guidedDisengagementScore: summary.disengagementScore,
      guidedSupportDependenceScore: summary.supportDependenceScore,
      guidedRecoveryRatePct: summary.recoveryRatePct,
      guidedTransferQualityPct: summary.transferQualityPct,
      guidedPaceMismatchScore: summary.paceMismatchScore,
      guidedLearningEfficiency: summary.learningEfficiency,
      v2Started: v2?.started ?? 0,
      v2Completed: v2?.completed ?? 0,
      v2CompletionRatePct: v2 ? toPercent(v2.completed, v2.started) : null,
    };
  });

  const sessions = sessionRows.map((row) => {
    const derived = deriveGuidedChunkSessionMetrics(row.session_json);
    const durationSeconds = Math.max(
      0,
      Math.round((new Date(row.updated_at).getTime() - new Date(row.created_at).getTime()) / 1000)
    );
    return {
      sessionId: row.id,
      lessonCode: row.lesson_code,
      lessonVersionId: row.lesson_version_id,
      sourceContext: row.source_context ?? 'guided_chunk_runtime',
      variantId: row.gc_lesson_versions?.variant_id ?? row.session_json.variantId ?? null,
      runtimeVersion: row.gc_lesson_versions?.runtime_version ?? row.session_json.runtimeVersion ?? null,
      status: row.status,
      currentLoIndex: row.current_lo_index ?? row.session_json.currentLoIndex,
      reviewFlagCount: row.review_flag_count ?? row.session_json.reviewFlags.length,
      threadCount: row.session_json.thread.length,
      eventCount: row.session_json.events.length,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      durationSeconds,
      avgResponseLatencySeconds: derived.avgResponseLatencySeconds,
      fatigueScore: derived.fatigueScore,
      fatigueOnsetChunkIndex: derived.fatigueOnsetChunkIndex,
      confusionScore: derived.confusionScore,
      disengagementScore: derived.disengagementScore,
      supportDependenceScore: derived.supportDependenceScore,
      recoveryRatePct: derived.recoveryRatePct,
      transferQualityPct: derived.transferQualityPct,
      paceMismatchScore: derived.paceMismatchScore,
      learningEfficiency: derived.learningEfficiency,
    };
  });

  const summaryByVariant = new Map<string, typeof summaries>();
  for (const summary of summaries) {
    const bucket = summary.variantId ? summaryByVariant.get(summary.variantId) ?? [] : [];
    if (summary.variantId) {
      bucket.push(summary);
      summaryByVariant.set(summary.variantId, bucket);
    }
  }

  const experimentPerformance = experiments.map((experiment) => {
    const targetSummaries = summaryByVariant.get(experiment.targetVariantId) ?? [];
    const baselineSummaries = experiment.baselineVariantId ? summaryByVariant.get(experiment.baselineVariantId) ?? [] : [];
    const aggregate = (items: typeof summaries) => {
      const started = items.reduce((sum, item) => sum + item.started, 0);
      const completed = items.reduce((sum, item) => sum + item.completed, 0);
      return {
        started,
        completed,
        completionRatePct: toPercent(completed, started),
        fatigueScore: average(
          items.reduce((sum, item) => sum + (item.fatigueScore ?? 0), 0),
          items.filter((item) => item.fatigueScore !== null).length
        ),
        confusionScore: average(
          items.reduce((sum, item) => sum + (item.confusionScore ?? 0), 0),
          items.filter((item) => item.confusionScore !== null).length
        ),
        transferQualityPct: average(
          items.reduce((sum, item) => sum + (item.transferQualityPct ?? 0), 0),
          items.filter((item) => item.transferQualityPct !== null).length
        ),
        learningEfficiency: average(
          items.reduce((sum, item) => sum + (item.learningEfficiency ?? 0), 0),
          items.filter((item) => item.learningEfficiency !== null).length
        ),
      };
    };

    const target = aggregate(targetSummaries);
    const baseline = aggregate(baselineSummaries);

    return {
      experimentId: experiment.id,
      name: experiment.name,
      status: experiment.status,
      changeType: experiment.changeType,
      targetVariantId: experiment.targetVariantId,
      baselineVariantId: experiment.baselineVariantId ?? null,
      metricsToWatch: experiment.metricsToWatch,
      target,
      baseline: experiment.baselineVariantId ? baseline : null,
      deltas: experiment.baselineVariantId
        ? {
            completionRatePct:
              target.completionRatePct !== null && baseline.completionRatePct !== null
                ? Math.round((target.completionRatePct - baseline.completionRatePct) * 100) / 100
                : null,
            fatigueScore:
              target.fatigueScore !== null && baseline.fatigueScore !== null
                ? Math.round((target.fatigueScore - baseline.fatigueScore) * 100) / 100
                : null,
            confusionScore:
              target.confusionScore !== null && baseline.confusionScore !== null
                ? Math.round((target.confusionScore - baseline.confusionScore) * 100) / 100
                : null,
            transferQualityPct:
              target.transferQualityPct !== null && baseline.transferQualityPct !== null
                ? Math.round((target.transferQualityPct - baseline.transferQualityPct) * 100) / 100
                : null,
            learningEfficiency:
              target.learningEfficiency !== null && baseline.learningEfficiency !== null
                ? Math.round((target.learningEfficiency - baseline.learningEfficiency) * 100) / 100
                : null,
          }
        : null,
      classification: classifyExperimentResult({
        metricsToWatch: experiment.metricsToWatch,
        deltas: experiment.baselineVariantId
          ? {
              completionRatePct:
                target.completionRatePct !== null && baseline.completionRatePct !== null
                  ? Math.round((target.completionRatePct - baseline.completionRatePct) * 100) / 100
                  : null,
              fatigueScore:
                target.fatigueScore !== null && baseline.fatigueScore !== null
                  ? Math.round((target.fatigueScore - baseline.fatigueScore) * 100) / 100
                  : null,
              confusionScore:
                target.confusionScore !== null && baseline.confusionScore !== null
                  ? Math.round((target.confusionScore - baseline.confusionScore) * 100) / 100
                  : null,
              transferQualityPct:
                target.transferQualityPct !== null && baseline.transferQualityPct !== null
                  ? Math.round((target.transferQualityPct - baseline.transferQualityPct) * 100) / 100
                  : null,
              learningEfficiency:
                target.learningEfficiency !== null && baseline.learningEfficiency !== null
                  ? Math.round((target.learningEfficiency - baseline.learningEfficiency) * 100) / 100
                  : null,
            }
          : null,
      }),
    };
  });

  return NextResponse.json({
    summaries,
    comparisons,
    sessions,
    experiments,
    experimentChanges: changes,
    experimentPerformance,
  });
}
