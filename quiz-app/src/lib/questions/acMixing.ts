import { QuestionItem, SyllabusAssessmentCriteria } from './types';
import { evaluateNearDuplicate, toSimilarityLike } from './similarity';

export interface AcCoverage {
  ac_key: string;
  lo_code: string;
  ac_code: string;
  approved_count: number;
}

interface AcSamplingInput {
  acs: SyllabusAssessmentCriteria[];
  coverage: AcCoverage[];
  count: number;
}

function randomPick<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function questionContentKey(question: QuestionItem): string {
  const stem = normalizeText(question.stem);
  const options = Array.isArray(question.options)
    ? question.options.map((option) => normalizeText(option)).join('||')
    : '';
  const correct = Array.isArray(question.correct)
    ? question.correct.map((value) => normalizeText(value)).join('||')
    : normalizeText(question.correct);
  return `${stem}###${options}###${correct}`;
}

export function buildWeightedAcSelection(input: AcSamplingInput): string[] {
  const coverageByAc = new Map(input.coverage.map((row) => [row.ac_key, row.approved_count]));
  const rows = input.acs.map((ac) => {
    const key = `${ac.lo_code}|${ac.ac_code}`;
    const approved = coverageByAc.get(key) ?? 0;
    return {
      key,
      weight: 1 / (1 + approved),
    };
  });

  if (rows.length === 0) return [];

  const selected: string[] = [];
  for (let i = 0; i < input.count; i += 1) {
    const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0);
    const threshold = Math.random() * totalWeight;
    let cursor = 0;
    let selectedKey = rows[rows.length - 1].key;
    for (const row of rows) {
      cursor += row.weight;
      if (cursor >= threshold) {
        selectedKey = row.key;
        break;
      }
    }
    selected.push(selectedKey);
  }
  return selected;
}

export function selectQuestionsForQuiz(input: {
  desiredCount: number;
  weightedAcKeys: string[];
  approvedByAcKey: Map<string, QuestionItem[]>;
  fallbackPool: QuestionItem[];
}): { selected: QuestionItem[]; shortfall: number } {
  const result: QuestionItem[] = [];
  const usedIds = new Set<string>();
  const usedContentKeys = new Set<string>();
  const selectedAcCounts = new Map<string, number>();

  const maxPerAc = input.desiredCount >= 12 ? 2 : 1;

  const isTooSimilarToSelected = (candidate: QuestionItem): boolean => {
    const candidateSim = toSimilarityLike(candidate);
    return result.some((picked) => {
      const evaluated = evaluateNearDuplicate(candidateSim, toSimilarityLike(picked));
      if (evaluated.near) return true;
      const sameAc = candidate.lo_code && candidate.ac_code && picked.lo_code && picked.ac_code
        ? candidate.lo_code === picked.lo_code && candidate.ac_code === picked.ac_code
        : false;
      // Secondary relaxed guard for same AC variation inside one quiz.
      return sameAc && evaluated.score >= 0.62;
    });
  };

  const canAddByAcCap = (question: QuestionItem): boolean => {
    if (!question.lo_code || !question.ac_code) return true;
    const key = `${question.lo_code}|${question.ac_code}`;
    const current = selectedAcCounts.get(key) ?? 0;
    return current < maxPerAc;
  };

  const registerSelected = (question: QuestionItem) => {
    const contentKey = questionContentKey(question);
    result.push(question);
    usedIds.add(question.id);
    usedContentKeys.add(contentKey);
    if (question.lo_code && question.ac_code) {
      const key = `${question.lo_code}|${question.ac_code}`;
      selectedAcCounts.set(key, (selectedAcCounts.get(key) ?? 0) + 1);
    }
  };

  for (const acKey of input.weightedAcKeys) {
    if (result.length >= input.desiredCount) break;
    const pool = input.approvedByAcKey.get(acKey) ?? [];
    const candidates = pool.filter((question) => {
      if (usedIds.has(question.id)) return false;
      if (!canAddByAcCap(question)) return false;
      const key = questionContentKey(question);
      if (usedContentKeys.has(key)) return false;
      if (isTooSimilarToSelected(question)) return false;
      return true;
    });
    const picked = randomPick(candidates);
    if (!picked) continue;
    registerSelected(picked);
  }

  if (result.length < input.desiredCount) {
    // Relaxed fill: still enforce hard dedupe + AC cap, but ignore semantic similarity.
    for (const question of input.fallbackPool) {
      if (result.length >= input.desiredCount) break;
      if (usedIds.has(question.id)) continue;
      if (!canAddByAcCap(question)) continue;
      const contentKey = questionContentKey(question);
      if (usedContentKeys.has(contentKey)) continue;
      registerSelected(question);
    }
  }

  if (result.length < input.desiredCount) {
    // Final fill: allow exceeding AC cap when pool is tight, but keep hard dedupe.
    for (const question of input.fallbackPool) {
      if (result.length >= input.desiredCount) break;
      if (usedIds.has(question.id)) continue;
      const contentKey = questionContentKey(question);
      if (usedContentKeys.has(contentKey)) continue;
      registerSelected(question);
    }
  }

  return {
    selected: result,
    shortfall: Math.max(0, input.desiredCount - result.length),
  };
}
