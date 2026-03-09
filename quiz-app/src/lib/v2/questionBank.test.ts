import { describe, expect, it, vi } from 'vitest';
import { createV2QuestionDraftVersions, syncPublishedLessonQuestions } from './questionBank';

function createSelectChain<T>(result: { data: T; error: null }) {
  return {
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
  };
}

describe('questionBank', () => {
  it('keeps existing published/current question versions in place when creating draft question versions', async () => {
    const questionsSelect = createSelectChain<{ id: string } | null>({
      data: { id: 'question-1' },
      error: null,
    });
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'version-2',
          question_id: 'question-1',
          version_no: 2,
          status: 'draft',
          is_current: false,
          published_at: null,
        },
      ],
      error: null,
    });

    const adminClient = {
      from: vi.fn((table: string) => {
        if (table === 'v2_questions') {
          return {
            select: vi.fn(() => questionsSelect),
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
      rpc,
    } as any;

    const result = await createV2QuestionDraftVersions(adminClient, {
      lessonId: 'lesson-1',
      lessonCode: 'BIO-101-1A',
      drafts: [
        {
          stableKey: 'BIO-101-1A::generated::q-1',
          prompt: 'Which organelle contains genetic material?',
          acceptedAnswers: ['Nucleus'],
          options: ['Cell wall', 'Nucleus', 'Ribosome', 'Membrane'],
          questionType: 'mcq',
          sourceBlockId: 'generated-q-1',
          sourceBlockType: 'generated',
        },
      ],
      source: 'ai',
      qualityScore: null,
      metadata: {
        sourceGenerationJobId: 'job-1',
      },
    });

    expect(rpc).toHaveBeenCalledWith(
      'v2_insert_question_draft_version',
      expect.objectContaining({
        target_question_id: 'question-1',
        version_source: 'ai',
        version_stem: 'Which organelle contains genetic material?',
        version_metadata: expect.objectContaining({
          lessonCode: 'BIO-101-1A',
          sourceBlockId: 'generated-q-1',
          sourceBlockType: 'generated',
          options: ['Cell wall', 'Nucleus', 'Ribosome', 'Membrane'],
          sourceGenerationJobId: 'job-1',
        }),
      })
    );
    expect(result).toEqual({
      questionCount: 1,
      createdCount: 1,
      questionVersionIds: ['version-2'],
      questionIds: ['question-1'],
    });
  });

  it('publishes a replacement question version when mcq options change', async () => {
    const lesson = {
      id: 'BIO-101-1A',
      title: 'Cells',
      description: 'Cells lesson',
      layout: 'linear-flow',
      unit: 'BIO-101',
      topic: 'Cells',
      learningOutcomes: ['Describe the nucleus.'],
      blocks: [
        {
          id: 'block-1',
          type: 'practice',
          order: 1,
          content: {
            title: 'Practice',
            questions: [
              {
                id: 'q-1',
                questionText: 'Which organelle contains genetic material?',
                expectedAnswer: 'Nucleus',
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
    } as const;

    const existingQuestionsSelect = createSelectChain<Array<{ id: string; stable_key: string }>>({
      data: [{ id: 'question-1', stable_key: 'block-1::practice::q-1' }],
      error: null,
    });
    const latestVersionSelect = createSelectChain<any>({
      data: {
        id: 'version-1',
        version_no: 1,
        status: 'published',
        is_current: true,
        stem: 'Which organelle contains genetic material?',
        answer_key: {
          acceptedAnswers: ['nucleus'],
        },
        metadata: {
          lessonCode: 'BIO-101-1A',
          sourceLessonVersionId: 'lesson-version-1',
          sourceBlockId: 'block-1',
          sourceBlockType: 'practice',
          options: ['Membrane', 'Nucleus'],
        },
      },
      error: null,
    });
    const nextVersionSelect = createSelectChain<{ version_no: number } | null>({
      data: { version_no: 1 },
      error: null,
    });
    const updateEq = vi.fn().mockResolvedValue({ error: null });
    const updateChain = {
      eq: vi.fn(() => ({
        eq: updateEq,
      })),
    };
    const insertSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'version-2',
        question_id: 'question-1',
        version_no: 2,
        status: 'published',
        is_current: true,
        published_at: '2026-03-09T00:00:00.000Z',
      },
      error: null,
    });
    const insertPayloads: any[] = [];
    const insertChain = {
      select: vi.fn(() => ({
        single: insertSingle,
      })),
    };
    const insert = vi.fn((payload: any) => {
      insertPayloads.push(payload);
      return insertChain;
    });

    const adminClient = {
      from: vi.fn((table: string) => {
        if (table === 'v2_questions') {
          return {
            select: vi.fn(() => existingQuestionsSelect),
          };
        }
        if (table === 'v2_question_versions') {
          return {
            select: vi.fn()
              .mockReturnValueOnce(latestVersionSelect)
              .mockReturnValueOnce(nextVersionSelect),
            update: vi.fn(() => updateChain),
            insert,
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    } as any;

    await syncPublishedLessonQuestions(adminClient, {
      lessonId: 'lesson-1',
      lessonCode: 'BIO-101-1A',
      lessonVersionId: 'lesson-version-2',
      contentJson: lesson,
      source: 'human',
      qualityScore: 100,
    });

    expect(updateEq).toHaveBeenCalledWith('is_current', true);
    expect(insertPayloads[0]).toEqual(
      expect.objectContaining({
        question_id: 'question-1',
        version_no: 2,
        status: 'published',
        source: 'human',
        stem: 'Which organelle contains genetic material?',
        metadata: expect.objectContaining({
          lessonCode: 'BIO-101-1A',
          sourceLessonVersionId: 'lesson-version-2',
          sourceBlockId: 'block-1',
          sourceBlockType: 'practice',
          options: null,
        }),
      })
    );
    expect(insertSingle).toHaveBeenCalled();
  });
});
