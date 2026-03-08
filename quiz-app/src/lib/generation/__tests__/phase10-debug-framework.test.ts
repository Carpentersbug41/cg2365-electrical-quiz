import { describe, expect, it } from 'vitest';
import { generatePointerDiff } from '../pointerDiffGenerator';
import { extractPointersByRubricSection, extractPointersFromIssue } from '../pointerExtractor';
import { runStabilityCheck } from '../scoreStabilityChecker';
import { Lesson } from '../types';

const baseLesson: Lesson = {
  id: 'TEST-001',
  unit: 'test-unit',
  topic: 'Testing',
  title: 'Test Lesson',
  description: 'A test lesson',
  layout: 'linear-flow',
  prerequisites: [],
  learningOutcomes: ['Learn testing'],
  blocks: [
    {
      id: 'outcomes-1',
      type: 'outcomes',
      order: 0,
      content: { outcomes: [{ text: 'Learn testing', bloomLevel: 'Remember' }] },
    },
    {
      id: 'explanation-1',
      type: 'explanation',
      order: 1,
      content: { title: 'What is Testing?', content: 'Testing is important for quality.' },
    },
    {
      id: 'practice-1',
      type: 'practice',
      order: 2,
      content: {
        questions: [
          {
            id: 'q1',
            questionText: 'What is testing?',
            expectedAnswer: ['quality assurance', 'verification'],
            answerType: 'short-text',
            hint: 'Think about quality',
          },
        ],
      },
    },
  ],
  metadata: {
    created: '2026-02-07T00:00:00Z',
    updated: '2026-02-07T00:00:00Z',
    version: '1.0',
    author: 'Test Framework',
  },
};

const updatedLesson: Lesson = {
  ...baseLesson,
  blocks: [
    baseLesson.blocks[0],
    {
      ...baseLesson.blocks[1],
      content: {
        title: 'What is Software Testing?',
        content: 'Testing is very important for quality assurance.',
      },
    },
    {
      ...baseLesson.blocks[2],
      content: {
        questions: [
          {
            ...((baseLesson.blocks[2].content as { questions: Array<Record<string, unknown>> }).questions[0] as Record<
              string,
              unknown
            >),
            hint: 'Think about quality and verification',
          },
        ],
      },
    },
  ],
};

describe('phase10 debug framework helpers', () => {
  it('generates pointer diff for changed lesson fields', () => {
    const diff = generatePointerDiff(baseLesson, updatedLesson);
    const paths = diff.changes.map((c) => c.path);

    expect(paths).toContain('/blocks/1/content/title');
    expect(paths).toContain('/blocks/1/content/content');
    expect(paths).toContain('/blocks/2/content/questions/0/hint');
  });

  it('extracts pointers from issue text and rubric section', () => {
    const issueText = 'Explanation block at blocks[1] missing key points summary. Question blocks[2] needs better hint.';
    const pointers = extractPointersFromIssue(issueText, baseLesson);
    const rubricPointers = extractPointersByRubricSection('B1', baseLesson);

    expect(pointers.length).toBeGreaterThan(0);
    expect(rubricPointers.length).toBeGreaterThan(0);
  });

  it('runs stability check with mock scorer', async () => {
    const mockScorer = {
      scoreLesson: async () => ({
        total: 92,
        grade: 'Strong',
        breakdown: {},
        details: [{ section: 'B1: Beginner Clarity', score: 4, maxScore: 5, issues: [], suggestions: [] }],
      }),
    };

    const result = await runStabilityCheck(baseLesson, mockScorer as never, 3);
    expect(result.runs).toHaveLength(3);
    expect(result.analysis.variance).toBe(0);
    expect(result.analysis.isStable).toBe(true);
  });
});
