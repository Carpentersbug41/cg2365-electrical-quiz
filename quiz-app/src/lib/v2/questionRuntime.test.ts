import { describe, expect, it } from 'vitest';
import { extractV2QuestionDraftsFromLesson, extractV2QuizQuestionsFromLesson, isAnswerCorrect } from '@/lib/v2/questionRuntime';
import type { V2Lesson } from '@/lib/v2/contentTypes';

const lesson: V2Lesson = {
  id: 'BIO-101-1A',
  title: 'Cells',
  description: 'Introduction to cells',
  layout: 'linear-flow',
  unit: 'Unit BIO-101',
  topic: 'Cells',
  learningOutcomes: ['Describe animal and plant cells'],
  blocks: [
    {
      id: 'BIO-101-1A#practice',
      type: 'practice',
      order: 1,
      content: {
        title: 'Practice',
        questions: [
          {
            id: 'q1',
            questionText: 'What is the control center of the cell?',
            expectedAnswer: ['nucleus', 'the nucleus'],
          },
        ],
      },
    },
    {
      id: 'BIO-101-1A#review',
      type: 'spaced-review',
      order: 2,
      content: {
        title: 'Review',
        questions: [
          {
            id: 'q2',
            questionText: 'Which organelle is the site of respiration?',
            expectedAnswer: 'mitochondria',
          },
        ],
      },
    },
  ],
  metadata: {
    created: '2026-03-09T00:00:00.000Z',
    updated: '2026-03-09T00:00:00.000Z',
    version: '1',
  },
};

describe('questionRuntime', () => {
  it('extracts stable question drafts from supported lesson blocks', () => {
    const drafts = extractV2QuestionDraftsFromLesson(lesson);

    expect(drafts).toHaveLength(2);
    expect(drafts[0]).toMatchObject({
      stableKey: 'BIO-101-1A#practice::practice::q1',
      sourceBlockType: 'practice',
    });
    expect(drafts[1]).toMatchObject({
      stableKey: 'BIO-101-1A#review::spaced-review::q2',
      sourceBlockType: 'spaced-review',
    });
  });

  it('derives quiz questions with null database ids before sync', () => {
    const questions = extractV2QuizQuestionsFromLesson(lesson);

    expect(questions[0].questionId).toBeNull();
    expect(questions[0].questionVersionId).toBeNull();
    expect(questions[0].stableId).toBe('BIO-101-1A#practice::practice::q1');
  });

  it('matches normalized answer variants', () => {
    expect(isAnswerCorrect('The nucleus', ['nucleus', 'the nucleus'])).toBe(true);
    expect(isAnswerCorrect('mitochondria', ['mitochondria'])).toBe(true);
    expect(isAnswerCorrect('chloroplast', ['mitochondria'])).toBe(false);
  });
});
