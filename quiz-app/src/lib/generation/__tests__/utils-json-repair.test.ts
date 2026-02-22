import { describe, expect, it } from 'vitest';
import {
  generateLessonId,
  preprocessToValidJson,
  repairMalformedJsonStrings,
  safeJsonParse,
} from '../utils';

describe('generation utils JSON repair', () => {
  it('normalizes lesson IDs to avoid duplicated unit prefix', () => {
    expect(generateLessonId(203, 'SC1A')).toBe('203-SC1A');
    expect(generateLessonId(203, '203-SC1A')).toBe('203-SC1A');
  });

  it('repairs unescaped quotes inside JSON string values', () => {
    const malformed = `{
  "explanations": [
    {
      "id": "203-SC1A-explain-1",
      "content": "Use the term "ring final circuit" correctly."
    }
  ]
}`;

    const preprocessed = preprocessToValidJson(malformed);
    const firstParse = safeJsonParse(preprocessed);
    expect(firstParse.success).toBe(false);

    const repaired = repairMalformedJsonStrings(preprocessed);
    const repairedParse = safeJsonParse<{ explanations: Array<{ content: string }> }>(repaired);
    expect(repairedParse.success).toBe(true);
    expect(repairedParse.data?.explanations[0].content).toContain('"ring final circuit"');
  });
});
