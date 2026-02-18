import { describe, expect, test } from 'vitest';
import { validateQuestionDraft } from '../validation';

describe('validateQuestionDraft', () => {
  test('rejects duplicate options and invalid correct answer', () => {
    const result = validateQuestionDraft({
      generation_run_id: null,
      unit_code: '202',
      lo_code: 'LO1',
      ac_code: '1.1',
      level: 2,
      difficulty: 'easy',
      format: 'mcq',
      stem: 'Question?',
      options: ['A', 'A', 'C', 'D'],
      correct: 'Z',
      rationale: 'Because.',
      tags: [],
      source: 'generated',
      status: 'draft',
      hash: 'x',
    });
    expect(result.valid).toBe(false);
    expect(result.reasons.some((item) => item.includes('distinct'))).toBe(true);
    expect(result.reasons.some((item) => item.includes('must exist in options'))).toBe(true);
  });

  test('accepts a valid mcq payload', () => {
    const result = validateQuestionDraft({
      generation_run_id: null,
      unit_code: '202',
      lo_code: 'LO1',
      ac_code: '1.1',
      level: 2,
      difficulty: 'easy',
      format: 'mcq',
      stem: 'Question?',
      options: ['A', 'B', 'C', 'D'],
      correct: 'A',
      rationale: 'Because.',
      tags: [],
      source: 'generated',
      status: 'draft',
      hash: 'x',
    });
    expect(result.valid).toBe(true);
  });
});
