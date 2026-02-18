import { GeneratedQuestionDraftInput } from './types';

export interface QuestionValidationResult {
  valid: boolean;
  reasons: string[];
}

function uniqueInsensitive(items: string[]): boolean {
  const keys = items.map((item) => item.trim().toLowerCase());
  return new Set(keys).size === keys.length;
}

export function validateQuestionDraft(input: GeneratedQuestionDraftInput): QuestionValidationResult {
  const reasons: string[] = [];

  if (!input.stem.trim()) reasons.push('Stem is required.');
  if (!input.unit_code.trim()) reasons.push('unit_code is required.');
  if (!input.hash.trim()) reasons.push('hash is required.');

  if (input.format === 'mcq' || input.format === 'multi_select') {
    if (!input.options || input.options.length < 4) {
      reasons.push(`${input.format} requires at least 4 options.`);
    } else {
      if (!uniqueInsensitive(input.options)) {
        reasons.push('Options must be distinct.');
      }
      const normalizedOptions = input.options.map((option) => option.trim().toLowerCase());
      if (input.format === 'mcq') {
        if (Array.isArray(input.correct)) {
          reasons.push('mcq correct must be a single option string.');
        } else if (!normalizedOptions.includes(input.correct.trim().toLowerCase())) {
          reasons.push('mcq correct must exist in options.');
        }
      }
      if (input.format === 'multi_select') {
        if (!Array.isArray(input.correct) || input.correct.length === 0) {
          reasons.push('multi_select correct must be a non-empty array.');
        } else {
          for (const answer of input.correct) {
            if (!normalizedOptions.includes(answer.trim().toLowerCase())) {
              reasons.push('multi_select correct answers must exist in options.');
              break;
            }
          }
        }
      }
      if (input.options.some((option) => /^all of the above$/i.test(option.trim()))) {
        reasons.push('"All of the above" is not allowed.');
      }
    }
  }

  if ((input.format === 'mcq' || input.format === 'scenario') && !input.rationale?.trim()) {
    reasons.push(`${input.format} requires rationale.`);
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
