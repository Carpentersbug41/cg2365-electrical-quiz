import { describe, expect, test } from 'vitest';
import { computeQuestionHash } from '../hash';

describe('computeQuestionHash', () => {
  test('is stable across casing and whitespace changes', () => {
    const a = computeQuestionHash({
      stem: '  What is Ohm  law? ',
      options: ['A', 'B', 'C', 'D'],
      correct: 'A',
      unit_code: '202',
      lo_code: 'LO1',
      ac_code: '1.1',
      format: 'mcq',
    });
    const b = computeQuestionHash({
      stem: 'what is ohm law?',
      options: ['a', 'b', 'c', 'd'],
      correct: 'a',
      unit_code: '202',
      lo_code: 'LO1',
      ac_code: '1.1',
      format: 'mcq',
    });
    expect(a).toBe(b);
  });
});
