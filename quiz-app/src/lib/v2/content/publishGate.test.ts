import { describe, expect, it } from 'vitest';
import { validateLessonVersionForPublish } from './publishGate';

const validLesson = {
  id: 'BIO-104-1A',
  title: 'Enzymes and rates',
  description: 'GCSE biology lesson about enzymes.',
  layout: 'linear-flow',
  unit: 'BIO-104',
  topic: 'Enzymes',
  learningOutcomes: ['Define enzyme', 'Explain denaturation'],
  prerequisites: ['BIO-101-1A'],
  blocks: [{ id: 'b1', type: 'explanation', title: 'Intro', content: 'Text' }],
  metadata: { curriculum: 'gcse-science-biology' },
};

describe('validateLessonVersionForPublish', () => {
  it('passes valid content', () => {
    const result = validateLessonVersionForPublish({
      lessonCode: 'BIO-104-1A',
      lessonTitle: 'Enzymes and rates',
      qualityScore: 90,
      content: validLesson,
    });

    expect(result.ok).toBe(true);
    expect(result.issues.filter((issue) => issue.severity === 'error')).toHaveLength(0);
  });

  it('fails when required fields are missing', () => {
    const result = validateLessonVersionForPublish({
      lessonCode: 'BIO-104-1A',
      lessonTitle: 'Enzymes and rates',
      qualityScore: 90,
      content: { id: 'BIO-104-1A' },
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'MISSING_REQUIRED_FIELD')).toBe(true);
  });

  it('fails when inline styles are present', () => {
    const result = validateLessonVersionForPublish({
      lessonCode: 'BIO-104-1A',
      lessonTitle: 'Enzymes and rates',
      qualityScore: 90,
      content: {
        ...validLesson,
        blocks: [{ id: 'b1', content: '<p style="color:red">Bad</p>' }],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'INLINE_STYLING_FORBIDDEN')).toBe(true);
  });

  it('fails when quality score is below threshold', () => {
    const result = validateLessonVersionForPublish({
      lessonCode: 'BIO-104-1A',
      lessonTitle: 'Enzymes and rates',
      qualityScore: 70,
      content: validLesson,
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'QUALITY_SCORE_TOO_LOW')).toBe(true);
  });
});
