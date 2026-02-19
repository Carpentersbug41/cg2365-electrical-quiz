import { beforeEach, describe, expect, test, vi } from 'vitest';
import { validateAndInsertDrafts } from '../generation/validateAndInsert';
import { GeneratedQuestionDraftInput, QuestionBlueprint, QuestionGenerationRun, QuestionItem } from '../types';

const bankRepoMocks = vi.hoisted(() => ({
  listApprovedQuestionsByScope: vi.fn(),
  insertDraftQuestions: vi.fn(),
}));

vi.mock('../bankRepo', () => ({
  listApprovedQuestionsByScope: bankRepoMocks.listApprovedQuestionsByScope,
  insertDraftQuestions: bankRepoMocks.insertDraftQuestions,
}));

function makeRun(): QuestionGenerationRun {
  return {
    id: 'run-batch-test',
    unit_code: '203',
    level: 2,
    lo_codes: ['LO6'],
    target_count: 2,
    format_mix: { mcq: 1 },
    difficulty_mix: { easy: 0.5, med: 0.4, hard: 0.1 },
    status: 'running',
    created_at: '2026-02-19T00:00:00.000Z',
    created_by: null,
    summary: null,
  };
}

function makeBlueprint(index: number): QuestionBlueprint {
  return {
    unit_code: '203',
    lo_code: 'LO6',
    ac_code: '6.1',
    level: 2,
    difficulty: 'med',
    format: 'mcq',
    learning_target: `Assess LO6 6.1 with practical clarity ${index + 1}`,
    key_terms: ['safe', 'isolation', 'testing', 'dead'],
  };
}

function toInsertedQuestion(input: GeneratedQuestionDraftInput, index: number): QuestionItem {
  return {
    id: `q-${index + 1}`,
    generation_run_id: input.generation_run_id,
    unit_code: input.unit_code,
    lo_code: input.lo_code,
    ac_code: input.ac_code,
    level: input.level,
    difficulty: input.difficulty,
    format: input.format,
    stem: input.stem,
    options: input.options,
    correct: input.correct,
    rationale: input.rationale,
    tags: input.tags,
    source: input.source,
    status: input.status,
    hash: input.hash,
    version: input.version ?? 1,
    created_at: '2026-02-19T00:00:00.000Z',
    updated_at: '2026-02-19T00:00:00.000Z',
    created_by: null,
    approved_by: null,
    approved_at: null,
    doc_ref: input.doc_ref ?? null,
  };
}

describe('validateAndInsertDrafts batch recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bankRepoMocks.listApprovedQuestionsByScope.mockResolvedValue([]);
    bankRepoMocks.insertDraftQuestions.mockImplementation(async (inputs: GeneratedQuestionDraftInput[]) =>
      inputs.map((input, index) => toInsertedQuestion(input, index))
    );
  });

  test('accepts batch payload returned as top-level array', async () => {
    const run = makeRun();
    const blueprints = [makeBlueprint(0), makeBlueprint(1), makeBlueprint(2)];
    const batchLlmGenerator = vi.fn(async () =>
      JSON.stringify([
        {
          unit_code: '203',
          lo_code: 'LO6',
          ac_code: '6.1',
          level: 2,
          difficulty: 'easy',
          format: 'mcq',
          stem: 'During safe isolation on a ring final circuit, which action proves the conductors are dead before starting work?',
          options: [
            'Use a proving unit, test the tester, verify dead at point of work, then retest the tester',
            'Switch off and start work immediately',
            'Rely on the circuit chart without testing',
            'Only test line to neutral once and continue',
          ],
          correct: 'Use a proving unit, test the tester, verify dead at point of work, then retest the tester',
          rationale: 'Assesses safe isolation testing sequence for proving dead conductors.',
        },
        {
          unit_code: '203',
          lo_code: 'LO6',
          ac_code: '6.1',
          level: 2,
          difficulty: 'med',
          format: 'mcq',
          stem: 'What is the safest reason for locking off the isolator during dead testing and inspection work?',
          options: [
            'To prevent inadvertent re-energisation while testing continuity and polarity',
            'To speed up instrument readings',
            'To avoid recording test results',
            'To allow live fault finding without PPE',
          ],
          correct: 'To prevent inadvertent re-energisation while testing continuity and polarity',
          rationale: 'Aligns with safe isolation controls before dead tests are performed.',
        },
        {
          unit_code: '203',
          lo_code: 'LO6',
          ac_code: '6.1',
          level: 2,
          difficulty: 'hard',
          format: 'mcq',
          stem: 'Before insulation resistance testing, which preparation step is required to keep equipment safe and test results valid?',
          options: [
            'Disconnect sensitive loads and verify isolation before applying test voltage',
            'Leave all electronic equipment connected',
            'Carry out only a visual check',
            'Increase supply voltage for a stronger reading',
          ],
          correct: 'Disconnect sensitive loads and verify isolation before applying test voltage',
          rationale: 'Focuses on dead-test preparation within safe isolation procedure.',
        },
      ])
    );

    const result = await validateAndInsertDrafts({
      run,
      blueprints,
      acByKey: new Map([
        [
          'LO6|6.1',
          {
            unit_code: '203',
            lo_code: 'LO6',
            ac_code: '6.1',
            ac_text: 'Carry out safe isolation before dead testing activities.',
            range_notes: 'Use correct proving dead sequence and lock-off controls.',
          },
        ],
      ]),
      loTextByCode: new Map([['LO6', 'Apply safe isolation and dead testing process for electrical circuits.']]),
      batchLlmGenerator,
      maxDurationMs: 120_000,
    });

    expect(result.created_count).toBe(3);
    expect(result.failed_count).toBe(0);
    expect(result.debug.batch_reports[0]?.parsed_count).toBe(3);
    expect(result.debug.batch_llm_calls).toBe(1);
    expect(batchLlmGenerator).toHaveBeenCalledTimes(1);
  });

  test('falls back to single path when batch repeatedly parses zero rows', async () => {
    const run = makeRun();
    const blueprints = [makeBlueprint(0), makeBlueprint(1)];
    const batchLlmGenerator = vi.fn(async () => JSON.stringify({ status: 'ok', note: 'no questions key provided' }));
    let singleCounter = 0;
    const llmGenerator = vi.fn(async () => {
      singleCounter += 1;
      const stems = [
        'A trainee must prove dead before replacing an accessory. Which sequence is correct for safe isolation testing?',
        'While planning dead tests on a radial circuit, which step controls risk from accidental re-energisation?',
      ];
      const answers = [
        'Test proving unit, test circuit conductors at point of work, then re-test proving unit',
        'Apply lock-off and warning notice after isolation and verification before dead testing',
      ];
      return JSON.stringify({
        unit_code: '203',
        lo_code: 'LO6',
        ac_code: '6.1',
        level: 2,
        difficulty: 'med',
        format: 'mcq',
        stem: stems[singleCounter - 1] ?? stems[0],
        options: [
          answers[singleCounter - 1] ?? answers[0],
          'Start continuity testing before isolation',
          'Rely on labels without proving dead',
          'Skip lock-off when time is limited',
        ],
        correct: answers[singleCounter - 1] ?? answers[0],
        rationale: 'Aligned to safe isolation and dead testing controls.',
      });
    });

    const result = await validateAndInsertDrafts({
      run,
      blueprints,
      acByKey: new Map([
        [
          'LO6|6.1',
          {
            unit_code: '203',
            lo_code: 'LO6',
            ac_code: '6.1',
            ac_text: 'Carry out safe isolation before dead testing activities.',
            range_notes: 'Use correct proving dead sequence and lock-off controls.',
          },
        ],
      ]),
      loTextByCode: new Map([['LO6', 'Apply safe isolation and dead testing process for electrical circuits.']]),
      llmGenerator,
      batchLlmGenerator,
      maxDurationMs: 120_000,
    });

    expect(result.created_count).toBe(2);
    expect(result.failed_count).toBe(0);
    expect(result.debug.batch_reports[0]?.parsed_count).toBe(0);
    expect(result.debug.batch_reports[0]?.attempt_summary.some((row) => row.includes('deferring remainder'))).toBe(true);
    expect(batchLlmGenerator).toHaveBeenCalledTimes(2);
    expect(llmGenerator).toHaveBeenCalledTimes(2);
  });
});
