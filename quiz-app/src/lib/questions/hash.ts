import crypto from 'crypto';
import { QuestionFormat } from './types';

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function normalizeOptions(options: string[] | null): string {
  if (!options || options.length === 0) return '';
  return options.map((option) => normalizeText(option)).join('|');
}

function normalizeCorrect(correct: string | string[]): string {
  if (Array.isArray(correct)) {
    return correct.map((item) => normalizeText(item)).sort().join('|');
  }
  return normalizeText(correct);
}

export function computeQuestionHash(input: {
  stem: string;
  options: string[] | null;
  correct: string | string[];
  unit_code: string;
  lo_code?: string | null;
  ac_code?: string | null;
  format: QuestionFormat;
}): string {
  const payload = [
    normalizeText(input.stem),
    normalizeOptions(input.options),
    normalizeCorrect(input.correct),
    normalizeText(input.unit_code),
    normalizeText(input.lo_code ?? ''),
    normalizeText(input.ac_code ?? ''),
    normalizeText(input.format),
  ].join('||');
  return crypto.createHash('sha256').update(payload).digest('hex');
}
