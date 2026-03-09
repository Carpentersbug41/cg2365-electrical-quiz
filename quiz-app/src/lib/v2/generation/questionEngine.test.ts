import { beforeEach, describe, expect, it, vi } from 'vitest';

const generateQuiz = vi.fn();

vi.mock('@/lib/generation/fileGenerator', () => ({
  FileGenerator: class MockFileGenerator {
    generateQuiz = generateQuiz;
  },
}));

describe('generateV2QuestionDrafts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps generated quiz questions into V2 question drafts with options', async () => {
    generateQuiz.mockResolvedValue({
      success: true,
      questions: [
        {
          id: 1,
          question: 'Which organelle contains genetic material?',
          options: ['Cell wall', 'Nucleus', 'Ribosome', 'Membrane'],
          correctAnswer: 1,
        },
      ],
    });

    const { generateV2QuestionDrafts } = await import('./questionEngine');
    const drafts = await generateV2QuestionDrafts(
      {
        curriculum: 'gcse-science-biology',
        unit: 'BIO-101',
        lessonId: '1A',
        topic: 'Cells',
        section: 'Cells',
      },
      'BIO-101-1A:job-1',
      5
    );

    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatchObject({
      stableKey: 'BIO-101-1A:job-1::generated::q-1',
      prompt: 'Which organelle contains genetic material?',
      acceptedAnswers: ['Nucleus'],
      options: ['Cell wall', 'Nucleus', 'Ribosome', 'Membrane'],
      sourceBlockType: 'generated',
      questionType: 'mcq',
    });
  });
});
