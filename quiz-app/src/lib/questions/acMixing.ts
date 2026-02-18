import { QuestionItem, SyllabusAssessmentCriteria } from './types';

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
  const used = new Set<string>();

  for (const acKey of input.weightedAcKeys) {
    if (result.length >= input.desiredCount) break;
    const pool = input.approvedByAcKey.get(acKey) ?? [];
    const candidates = pool.filter((question) => !used.has(question.id));
    const picked = randomPick(candidates);
    if (!picked) continue;
    result.push(picked);
    used.add(picked.id);
  }

  if (result.length < input.desiredCount) {
    for (const question of input.fallbackPool) {
      if (result.length >= input.desiredCount) break;
      if (used.has(question.id)) continue;
      result.push(question);
      used.add(question.id);
    }
  }

  return {
    selected: result,
    shortfall: Math.max(0, input.desiredCount - result.length),
  };
}
