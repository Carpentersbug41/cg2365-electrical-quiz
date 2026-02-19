import { QuestionItem } from './types';

export interface QuestionSimilarityLike {
  id?: string;
  unit_code?: string;
  lo_code?: string | null;
  ac_code?: string | null;
  format?: string;
  stem: string;
  options: string[] | null;
  correct: string | string[];
}

export interface SimilarityMatch {
  question: QuestionSimilarityLike;
  score: number;
  threshold: number;
  reason: 'overall' | 'answer_correlated';
}

export interface SimilarityBreakdown {
  overall: number;
  stem: number;
  options: number;
  correct: number;
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'with',
  'which',
  'what',
  'when',
  'where',
  'who',
  'why',
  'how',
]);

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function toTokenSet(values: string[]): Set<string> {
  return new Set(values);
}

function jaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function questionThreshold(a: QuestionSimilarityLike, b: QuestionSimilarityLike): number {
  const sameLo = (a.lo_code ?? null) !== null && (a.lo_code ?? null) === (b.lo_code ?? null);
  const sameAc = (a.ac_code ?? null) !== null && (a.ac_code ?? null) === (b.ac_code ?? null);
  const sameFormat = (a.format ?? null) !== null && (a.format ?? null) === (b.format ?? null);
  if (sameLo && sameAc && sameFormat) return 0.76;
  if (sameLo && sameFormat) return 0.82;
  return 0.88;
}

function toCorrectString(value: string | string[]): string {
  return Array.isArray(value) ? value.join(' ') : value;
}

function cleanForAnswer(value: string): string {
  return normalizeText(value)
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function answerTokenSet(value: string): Set<string> {
  return toTokenSet(tokenize(cleanForAnswer(value)));
}

export function questionSimilarityBreakdown(a: QuestionSimilarityLike, b: QuestionSimilarityLike): SimilarityBreakdown {
  const stemA = toTokenSet(tokenize(a.stem));
  const stemB = toTokenSet(tokenize(b.stem));
  const stemScore = jaccard(stemA, stemB);

  const optionsA = toTokenSet(tokenize(Array.isArray(a.options) ? a.options.join(' ') : ''));
  const optionsB = toTokenSet(tokenize(Array.isArray(b.options) ? b.options.join(' ') : ''));
  const optionsScore = jaccard(optionsA, optionsB);

  const correctA = toTokenSet(tokenize(Array.isArray(a.correct) ? a.correct.join(' ') : a.correct));
  const correctB = toTokenSet(tokenize(Array.isArray(b.correct) ? b.correct.join(' ') : b.correct));
  const correctScore = jaccard(correctA, correctB);

  return {
    overall: stemScore * 0.7 + optionsScore * 0.2 + correctScore * 0.1,
    stem: stemScore,
    options: optionsScore,
    correct: correctScore,
  };
}

export function questionSimilarityScore(a: QuestionSimilarityLike, b: QuestionSimilarityLike): number {
  return questionSimilarityBreakdown(a, b).overall;
}

export function evaluateNearDuplicate(
  a: QuestionSimilarityLike,
  b: QuestionSimilarityLike
): { near: boolean; score: number; threshold: number; reason: 'overall' | 'answer_correlated' } {
  const scores = questionSimilarityBreakdown(a, b);
  const threshold = questionThreshold(a, b);
  if (scores.overall >= threshold) {
    return { near: true, score: scores.overall, threshold, reason: 'overall' };
  }

  // Additional guard: same effective answer + similar stem indicates likely duplicate intent.
  const answerA = cleanForAnswer(toCorrectString(a.correct));
  const answerB = cleanForAnswer(toCorrectString(b.correct));
  const answerJaccard = jaccard(answerTokenSet(answerA), answerTokenSet(answerB));
  const sameAnswer = answerA.length > 0 && answerA === answerB;
  const answerEquivalent = sameAnswer || answerJaccard >= 0.65;
  const sameFormat = (a.format ?? '') === (b.format ?? '');
  const sameLo = (a.lo_code ?? '') !== '' && (a.lo_code ?? '') === (b.lo_code ?? '');
  const answerCorrelatedStemThreshold = sameLo ? 0.50 : 0.62;
  if (answerEquivalent && sameFormat && scores.stem >= answerCorrelatedStemThreshold) {
    return {
      near: true,
      score: scores.stem,
      threshold: answerCorrelatedStemThreshold,
      reason: 'answer_correlated',
    };
  }

  return { near: false, score: scores.overall, threshold, reason: 'overall' };
}

export function findNearDuplicate(
  candidate: QuestionSimilarityLike,
  pool: QuestionSimilarityLike[]
): SimilarityMatch | null {
  let best: SimilarityMatch | null = null;
  for (const row of pool) {
    if (candidate.id && row.id && candidate.id === row.id) continue;
    const evaluated = evaluateNearDuplicate(candidate, row);
    if (evaluated.near && (!best || evaluated.score > best.score)) {
      best = {
        question: row,
        score: evaluated.score,
        threshold: evaluated.threshold,
        reason: evaluated.reason,
      };
    }
  }
  return best;
}

export function toSimilarityLike(question: QuestionItem): QuestionSimilarityLike {
  return {
    id: question.id,
    unit_code: question.unit_code,
    lo_code: question.lo_code,
    ac_code: question.ac_code,
    format: question.format,
    stem: question.stem,
    options: question.options,
    correct: question.correct,
  };
}
