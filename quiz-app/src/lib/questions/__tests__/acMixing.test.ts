import { describe, expect, test } from 'vitest';
import { buildWeightedAcSelection, selectQuestionsForQuiz } from '../acMixing';
import { QuestionItem, SyllabusAssessmentCriteria } from '../types';

function mkQuestion(id: string, lo: string, ac: string): QuestionItem {
  return {
    id,
    generation_run_id: null,
    unit_code: '202',
    lo_code: lo,
    ac_code: ac,
    level: 2,
    difficulty: 'easy',
    format: 'mcq',
    stem: id,
    options: ['A', 'B', 'C', 'D'],
    correct: 'A',
    rationale: 'x',
    tags: [],
    source: 'generated',
    status: 'approved',
    hash: id,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    approved_by: null,
    approved_at: null,
    doc_ref: null,
  };
}

describe('ac mixing', () => {
  test('weighted selection returns requested size', () => {
    const acs: SyllabusAssessmentCriteria[] = [
      { unit_code: '202', lo_code: 'LO1', ac_code: '1.1', ac_text: 'A', range_notes: null },
      { unit_code: '202', lo_code: 'LO1', ac_code: '1.2', ac_text: 'B', range_notes: null },
    ];
    const result = buildWeightedAcSelection({
      acs,
      coverage: [
        { ac_key: 'LO1|1.1', lo_code: 'LO1', ac_code: '1.1', approved_count: 10 },
        { ac_key: 'LO1|1.2', lo_code: 'LO1', ac_code: '1.2', approved_count: 0 },
      ],
      count: 20,
    });
    expect(result).toHaveLength(20);
  });

  test('selection dedupes and returns shortfall', () => {
    const selected = selectQuestionsForQuiz({
      desiredCount: 3,
      weightedAcKeys: ['LO1|1.1', 'LO1|1.1', 'LO1|1.1'],
      approvedByAcKey: new Map([['LO1|1.1', [mkQuestion('q1', 'LO1', '1.1')]]]),
      fallbackPool: [],
    });
    expect(selected.selected).toHaveLength(1);
    expect(selected.shortfall).toBe(2);
  });
});
