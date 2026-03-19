import type { GuidedChunkLoResult, GuidedChunkSession } from '@/lib/guidedChunk/types';

export interface GuidedChunkDerivedSessionMetrics {
  avgResponseLatencySeconds: number | null;
  fatigueScore: number;
  fatigueOnsetChunkIndex: number | null;
  confusionScore: number;
  disengagementScore: number;
  supportDependenceScore: number;
  recoveryRatePct: number | null;
  transferQualityPct: number | null;
  paceMismatchScore: number;
  learningEfficiency: number | null;
}

type NumericSeriesPoint = {
  index: number;
  value: number;
};

type ChunkSignals = {
  latencies: number[];
  lowEffortCount: number;
  answerCount: number;
};

const LOW_EFFORT_PATTERN = /\b(idk|i don't know|dont know|not sure|no idea|just tell me|whatever|maybe)\b/i;
const CONFUSION_PATTERN = /\b(what do you mean|i don't get|dont get|confused|not following|explain again|why did you say)\b/i;
const DISENGAGEMENT_PATTERN = /\b(just tell me|can't be bothered|skip|whatever)\b/i;

function round(value: number | null, digits = 2): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function toWordCount(text: string | undefined): number {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function extractPayloadString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === 'string' ? value : '';
}

function extractPayloadNumber(payload: Record<string, unknown>, key: string): number | null {
  const value = payload[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return round((numerator / denominator) * 100, 2);
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function slope(points: NumericSeriesPoint[]): number {
  if (points.length < 2) return 0;
  const n = points.length;
  const sumX = points.reduce((sum, point) => sum + point.index, 0);
  const sumY = points.reduce((sum, point) => sum + point.value, 0);
  const sumXY = points.reduce((sum, point) => sum + point.index * point.value, 0);
  const sumXX = points.reduce((sum, point) => sum + point.index * point.index, 0);
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return 0;
  return (n * sumXY - sumX * sumY) / denominator;
}

function computeTransferQuality(loResults: GuidedChunkLoResult[], deeperAccepted: number, deeperAsked: number): number | null {
  const mcqCorrect = loResults.reduce((sum, result) => sum + result.mcqCorrect, 0);
  const mcqTotal = loResults.reduce((sum, result) => sum + result.mcqTotal, 0);
  const shortPassed = loResults.reduce((sum, result) => sum + result.shortAnswerPassed, 0);
  const shortTotal = loResults.reduce((sum, result) => sum + result.shortAnswerTotal, 0);
  const deeperPct = toPercent(deeperAccepted, deeperAsked);
  const shortPct = toPercent(shortPassed, shortTotal);
  const mcqPct = toPercent(mcqCorrect, mcqTotal);
  const pieces = [deeperPct, shortPct, mcqPct].filter((value): value is number => value !== null);
  if (pieces.length === 0) return null;
  return round(pieces.reduce((sum, value) => sum + value, 0) / pieces.length, 2);
}

function computeLearningEfficiency(transferQualityPct: number | null, durationSeconds: number, reviewFlagCount: number): number | null {
  if (transferQualityPct === null || durationSeconds <= 0) return null;
  const durationMinutes = durationSeconds / 60;
  if (durationMinutes <= 0) return null;
  const reviewPenalty = Math.min(25, reviewFlagCount * 4);
  return round(Math.max(0, transferQualityPct - reviewPenalty) / durationMinutes, 2);
}

export function deriveGuidedChunkSessionMetrics(session: GuidedChunkSession): GuidedChunkDerivedSessionMetrics {
  const questionAskedAt = new Map<string, string>();
  const chunkSignals = new Map<string, ChunkSignals>();
  const latencySeries: NumericSeriesPoint[] = [];
  const answerWordSeries: NumericSeriesPoint[] = [];
  const fatigueCandidates: { chunkIndex: number; score: number }[] = [];

  let answerIndex = 0;
  let clarificationCount = 0;
  let repairCount = 0;
  let followUpCount = 0;
  let acceptedCount = 0;
  let acceptedAssistedCount = 0;
  let lowEffortCount = 0;
  let confusionPhraseCount = 0;
  let disengagementPhraseCount = 0;
  let deeperAsked = 0;
  let deeperAccepted = 0;
  let repairOpportunityCount = 0;
  let repairRecoveryCount = 0;

  const pendingRecoveryByChunk = new Map<string, number>();

  for (const event of session.events) {
    if (event.type === 'question_asked') {
      const questionId = extractPayloadString(event.payload, 'questionId');
      if (questionId) {
        questionAskedAt.set(questionId, event.createdAt);
      }
      if (extractPayloadString(event.payload, 'questionKind') === 'deeper') {
        deeperAsked += 1;
      }
      continue;
    }

    if (event.type === 'learner_turn_submitted') {
      const questionId = extractPayloadString(event.payload, 'questionId');
      const learnerAnswer = extractPayloadString(event.payload, 'learnerAnswer');
      const chunkId = extractPayloadString(event.payload, 'chunkId') || 'unknown';
      const chunkIndex = extractPayloadNumber(event.payload, 'chunkIndex') ?? answerIndex;
      const askedAt = questionId ? questionAskedAt.get(questionId) : null;
      const latencySeconds =
        askedAt !== null
          ? Math.max(0, (new Date(event.createdAt).getTime() - new Date(askedAt).getTime()) / 1000)
          : null;
      const wordCount = toWordCount(learnerAnswer);
      const isLowEffort = wordCount <= 2 || LOW_EFFORT_PATTERN.test(learnerAnswer);
      const isConfusionPhrase = CONFUSION_PATTERN.test(learnerAnswer);
      const isDisengagedPhrase = DISENGAGEMENT_PATTERN.test(learnerAnswer);

      if (latencySeconds !== null) {
        latencySeries.push({ index: answerIndex, value: latencySeconds });
      }
      answerWordSeries.push({ index: answerIndex, value: wordCount });

      const chunkBucket = chunkSignals.get(chunkId) ?? { latencies: [], lowEffortCount: 0, answerCount: 0 };
      if (latencySeconds !== null) {
        chunkBucket.latencies.push(latencySeconds);
      }
      chunkBucket.answerCount += 1;
      if (isLowEffort) {
        chunkBucket.lowEffortCount += 1;
        lowEffortCount += 1;
      }
      chunkSignals.set(chunkId, chunkBucket);

      if (isConfusionPhrase) confusionPhraseCount += 1;
      if (isDisengagedPhrase) disengagementPhraseCount += 1;

      if (latencySeconds !== null) {
        const localFatigueScore =
          (latencySeconds > 20 ? 1 : 0) +
          (latencySeconds > 35 ? 1 : 0) +
          (isLowEffort ? 1 : 0) +
          (wordCount <= 1 ? 1 : 0);
        fatigueCandidates.push({ chunkIndex, score: localFatigueScore });
      }

      answerIndex += 1;
      continue;
    }

    if (event.type === 'question_evaluated') {
      const outcome = extractPayloadString(event.payload, 'outcome');
      const questionKind = extractPayloadString(event.payload, 'questionKind');
      const chunkId = extractPayloadString(event.payload, 'chunkId') || 'unknown';
      if (outcome === 'clarification') clarificationCount += 1;
      if (outcome === 'follow_up') followUpCount += 1;
      if (outcome === 'accepted') {
        acceptedCount += 1;
        if (questionKind === 'follow_up' || questionKind === 'repair') {
          acceptedAssistedCount += 1;
        }
        if (questionKind === 'deeper') {
          deeperAccepted += 1;
        }
        const pending = pendingRecoveryByChunk.get(chunkId) ?? 0;
        if (pending > 0) {
          repairRecoveryCount += 1;
          pendingRecoveryByChunk.set(chunkId, pending - 1);
        }
      }
      continue;
    }

    if (event.type === 'repair_triggered') {
      const chunkId = extractPayloadString(event.payload, 'chunkId') || 'unknown';
      repairCount += 1;
      repairOpportunityCount += 1;
      pendingRecoveryByChunk.set(chunkId, (pendingRecoveryByChunk.get(chunkId) ?? 0) + 1);
    }
  }

  const avgResponseLatency = average(latencySeries.map((point) => point.value));
  const latencySlope = slope(latencySeries);
  const wordSlope = slope(answerWordSeries);
  const averageAnswerWords = average(answerWordSeries.map((point) => point.value)) ?? 0;
  const lateLowEffortShare = (() => {
    if (fatigueCandidates.length === 0) return 0;
    const laterHalf = fatigueCandidates.slice(Math.floor(fatigueCandidates.length / 2));
    if (laterHalf.length === 0) return 0;
    return laterHalf.filter((candidate) => candidate.score >= 2).length / laterHalf.length;
  })();

  const fatigueScore = clamp(
    (avgResponseLatency ?? 0) * 1.2 +
      Math.max(0, latencySlope) * 14 +
      Math.max(0, -wordSlope) * 18 +
      lateLowEffortShare * 35 +
      (session.status === 'abandoned' ? 10 : 0),
    0,
    100
  );

  const fatigueOnsetChunkIndex = (() => {
    if (fatigueCandidates.length === 0) return null;
    const candidate = fatigueCandidates.find((entry) => entry.score >= 2);
    return candidate ? candidate.chunkIndex : null;
  })();

  const confusionScore = clamp(
    clarificationCount * 12 +
      confusionPhraseCount * 14 +
      followUpCount * 8 +
      repairCount * 6 +
      session.reviewFlags.length * 5,
    0,
    100
  );

  const disengagementScore = clamp(
    (averageAnswerWords <= 3 ? 20 : 0) +
      lowEffortCount * 12 +
      disengagementPhraseCount * 18 +
      (session.status === 'abandoned' ? 25 : 0),
    0,
    100
  );

  const supportDependenceScore = clamp(
    (acceptedAssistedCount / Math.max(1, acceptedCount)) * 100 + repairCount * 4 + followUpCount * 3,
    0,
    100
  );

  const recoveryRatePct = toPercent(repairRecoveryCount, repairOpportunityCount);
  const transferQualityPct = computeTransferQuality(session.loResults, deeperAccepted, deeperAsked);
  const paceMismatchScore = clamp(
    (avgResponseLatency ?? 0) * 0.9 +
      Math.max(0, latencySlope) * 10 +
      clarificationCount * 6 +
      followUpCount * 4 +
      (lowEffortCount / Math.max(1, answerIndex)) * 35,
    0,
    100
  );

  const durationSeconds = Math.max(
    0,
    (new Date(session.updatedAt).getTime() - new Date(session.createdAt).getTime()) / 1000
  );
  const learningEfficiency = computeLearningEfficiency(transferQualityPct, durationSeconds, session.reviewFlags.length);

  return {
    avgResponseLatencySeconds: round(avgResponseLatency, 2),
    fatigueScore: round(fatigueScore, 2) ?? 0,
    fatigueOnsetChunkIndex,
    confusionScore: round(confusionScore, 2) ?? 0,
    disengagementScore: round(disengagementScore, 2) ?? 0,
    supportDependenceScore: round(supportDependenceScore, 2) ?? 0,
    recoveryRatePct,
    transferQualityPct,
    paceMismatchScore: round(paceMismatchScore, 2) ?? 0,
    learningEfficiency,
  };
}
