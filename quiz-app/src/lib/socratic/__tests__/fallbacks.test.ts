import { describe, expect, it } from 'vitest';
import {
  deterministicFallbackEvaluation,
  deterministicFallbackQuestion,
  sanitizeSocraticQuestionText,
  salvageSocraticPayload,
  stripWrappingQuotes,
} from '../fallbacks';

describe('socratic fallbacks', () => {
  it('strips wrapping quotes and escaped characters', () => {
    const value = `"Line 1\\nLine 2 with \\"quote\\""`;
    expect(stripWrappingQuotes(value)).toBe('Line 1 Line 2 with "quote"');
  });

  it('salvages question from malformed JSON payload', () => {
    const malformed = `{"question":"Why does resistance increase when temperature rises?`;
    const payload = salvageSocraticPayload(malformed, 'question') as { question: string };
    expect(payload.question).toContain('resistance increase');
  });

  it('removes question key artifacts from malformed plain text', () => {
    const malformed = `question":"Ahoy! Name the three earthing systems used in UK homes.`;
    const cleaned = sanitizeSocraticQuestionText(malformed);
    expect(cleaned).toBe('Ahoy! Name the three earthing systems used in UK homes.');
  });

  it('salvages evaluation from loose plain-text payload', () => {
    const loose = 'FEEDBACK: Strong start; add one link to current. CORRECT: true';
    const payload = salvageSocraticPayload(loose, 'evaluation') as { feedback: string; isCorrect: boolean };
    expect(payload.feedback).toContain('Strong start');
    expect(payload.isCorrect).toBe(true);
  });

  it('builds deterministic fallback question from first learning outcome', () => {
    const summary = [
      'Lesson: Test (T-1)',
      'Learning outcomes:',
      '1. Explain voltage and current in a simple circuit',
    ].join('\n');
    const question = deterministicFallbackQuestion(summary, 1);
    expect(question).toContain('Explain voltage and current in a simple circuit');
  });

  it('returns deterministic evaluation as incorrect for short answers', () => {
    const result = deterministicFallbackEvaluation('Too short.');
    expect(result.isCorrect).toBe(false);
  });

  it('returns deterministic evaluation as correct for long answers', () => {
    const result = deterministicFallbackEvaluation('This answer contains enough words to pass the fallback correctness threshold.');
    expect(result.isCorrect).toBe(true);
  });
});
