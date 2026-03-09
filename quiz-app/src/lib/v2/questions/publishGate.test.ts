import { describe, expect, it } from 'vitest';
import { validateQuestionVersionForPublish } from './publishGate';

describe('validateQuestionVersionForPublish', () => {
  it('accepts a valid MCQ question version', () => {
    const result = validateQuestionVersionForPublish({
      stableKey: 'BIO-101-1A::generated::q-1',
      stem: 'Which organelle contains genetic material?',
      answerKey: { acceptedAnswers: ['Nucleus'] },
      metadata: { options: ['Cell wall', 'Nucleus', 'Cytoplasm', 'Cell membrane'] },
      qualityScore: 90,
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('rejects MCQ options that do not contain the accepted answer', () => {
    const result = validateQuestionVersionForPublish({
      stableKey: 'BIO-101-1A::generated::q-2',
      stem: 'Which structure contains genetic material?',
      answerKey: { acceptedAnswers: ['Nucleus'] },
      metadata: { options: ['Cell wall', 'Ribosome', 'Cytoplasm'] },
      qualityScore: 90,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'metadata.options',
          severity: 'error',
        }),
      ])
    );
  });
});
