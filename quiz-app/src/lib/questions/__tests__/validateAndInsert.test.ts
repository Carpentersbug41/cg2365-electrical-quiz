import { describe, expect, test } from 'vitest';
import { buildDraftForBlueprint } from '../generation/validateAndInsert';
import { QuestionBlueprint } from '../types';

const blueprint: QuestionBlueprint = {
  unit_code: '202',
  lo_code: 'LO1',
  ac_code: '1.1',
  level: 2,
  difficulty: 'easy',
  format: 'mcq',
  learning_target: 'Assess LO1 1.1 with practical clarity',
  key_terms: ['math'],
};

describe('buildDraftForBlueprint', () => {
  test('uses llm output when valid on first attempt', async () => {
    const llm = async () =>
      JSON.stringify({
        unit_code: '202',
        lo_code: 'LO1',
        ac_code: '1.1',
        level: 2,
        difficulty: 'easy',
        format: 'mcq',
        stem: 'What is the correct method?',
        options: ['Method A', 'Method B', 'Method C', 'Method D'],
        correct: 'Method A',
        rationale: 'Aligned to AC',
      });

    const result = await buildDraftForBlueprint({
      blueprint,
      blueprintIndex: 0,
      runId: 'run-1',
      acContext: {},
      llmGenerator: llm,
    });

    expect(result.diagnostics.used_llm).toBe(true);
    expect(result.diagnostics.used_repair).toBe(false);
    expect(result.diagnostics.used_fallback).toBe(false);
    expect(result.draft.stem).toBe('What is the correct method?');
  });

  test('retries once with repair when first llm output fails validation', async () => {
    let calls = 0;
    const llm = async () => {
      calls += 1;
      if (calls === 1) {
        return JSON.stringify({
          unit_code: '202',
          lo_code: 'LO1',
          ac_code: '1.1',
          level: 2,
          difficulty: 'easy',
          format: 'mcq',
          stem: 'Broken options',
          options: ['A', 'A', 'A', 'A'],
          correct: 'Z',
          rationale: 'broken',
        });
      }
      return JSON.stringify({
        unit_code: '202',
        lo_code: 'LO1',
        ac_code: '1.1',
        level: 2,
        difficulty: 'easy',
        format: 'mcq',
        stem: 'Repaired question',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
        rationale: 'repaired',
      });
    };

    const result = await buildDraftForBlueprint({
      blueprint,
      blueprintIndex: 1,
      runId: 'run-2',
      acContext: {},
      llmGenerator: llm,
    });

    expect(calls).toBe(2);
    expect(result.diagnostics.used_llm).toBe(true);
    expect(result.diagnostics.used_repair).toBe(true);
    expect(result.diagnostics.used_fallback).toBe(false);
    expect(result.draft.stem).toBe('Repaired question');
  });

  test('falls back deterministically if llm and repair both fail', async () => {
    const llm = async () => 'not-json-at-all';

    const result = await buildDraftForBlueprint({
      blueprint,
      blueprintIndex: 2,
      runId: 'run-3',
      acContext: {},
      llmGenerator: llm,
    });

    expect(result.diagnostics.used_llm).toBe(true);
    expect(result.diagnostics.used_repair).toBe(false);
    expect(result.diagnostics.used_fallback).toBe(true);
    expect(result.draft.stem).toContain('[v3]');
  });
});
