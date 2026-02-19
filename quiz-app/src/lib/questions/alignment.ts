export interface AlignmentContext {
  lo_code: string;
  lo_text?: string | null;
  ac_code?: string | null;
  ac_text?: string | null;
  range_notes?: string | null;
}

export interface AlignmentResult {
  pass: boolean;
  score: number;
  threshold: number;
  matched_terms: string[];
  reasons: string[];
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
  'following',
  'before',
  'after',
  'during',
  'must',
  'should',
  'would',
  'could',
]);

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: unknown): string[] {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function overlapRatio(source: Set<string>, target: Set<string>): number {
  if (target.size === 0) return 0;
  let hits = 0;
  for (const token of target) {
    if (source.has(token)) hits += 1;
  }
  return hits / target.size;
}

function overlapTerms(source: Set<string>, target: Set<string>): string[] {
  const terms: string[] = [];
  for (const token of target) {
    if (source.has(token)) terms.push(token);
  }
  return terms;
}

export function evaluateQuestionAlignment(params: {
  stem: string;
  options?: string[] | null;
  correct: string | string[];
  context: AlignmentContext;
}): AlignmentResult {
  const loTokens = new Set(tokenize(params.context.lo_text ?? ''));
  const acTokens = new Set(tokenize(params.context.ac_text ?? ''));
  const rangeTokens = new Set(tokenize(params.context.range_notes ?? ''));
  const scopeTokens = new Set([...loTokens, ...acTokens, ...rangeTokens]);

  const stemTokens = new Set(tokenize(params.stem));
  const answerText = Array.isArray(params.correct) ? params.correct.join(' ') : params.correct;
  const combinedText = [params.stem, ...(params.options ?? []), answerText].join(' ');
  const combinedTokens = new Set(tokenize(combinedText));

  const loStemOverlap = overlapRatio(stemTokens, loTokens);
  const loCombinedOverlap = overlapRatio(combinedTokens, loTokens);
  const acStemOverlap = overlapRatio(stemTokens, acTokens);
  const acCombinedOverlap = overlapRatio(combinedTokens, acTokens);
  const scopeCombinedOverlap = overlapRatio(combinedTokens, scopeTokens);

  const matched = overlapTerms(combinedTokens, scopeTokens);
  const matchedDistinct = new Set(matched).size;
  const acIsBroad = acTokens.size <= 4;

  const score = Number(
    (
      acCombinedOverlap * (acIsBroad ? 0.2 : 0.45) +
      loCombinedOverlap * (acIsBroad ? 0.45 : 0.25) +
      loStemOverlap * 0.15 +
      scopeCombinedOverlap * (acIsBroad ? 0.2 : 0.15)
    ).toFixed(4)
  );
  const threshold = acIsBroad ? 0.08 : 0.12;
  const reasons: string[] = [];

  if (!acIsBroad && acTokens.size > 0 && acCombinedOverlap < 0.05) {
    reasons.push(`Low AC overlap (${acCombinedOverlap.toFixed(2)}).`);
  }
  if (loTokens.size > 0 && loCombinedOverlap < 0.05) {
    reasons.push(`Low LO overlap (${loCombinedOverlap.toFixed(2)}).`);
  }
  const minMatchedTerms = acIsBroad ? 1 : 2;
  if (scopeTokens.size > 0 && matchedDistinct < minMatchedTerms) {
    reasons.push('Too few syllabus keywords matched.');
  }

  const pass = score >= threshold && matchedDistinct >= minMatchedTerms;
  if (!pass && reasons.length === 0) {
    reasons.push(`Alignment score ${score.toFixed(2)} below threshold ${threshold.toFixed(2)}.`);
  }

  return {
    pass,
    score,
    threshold,
    matched_terms: Array.from(new Set(matched)).slice(0, 12),
    reasons,
  };
}
