import { beforeEach, describe, expect, it, vi } from 'vitest';

const generateV2QuestionDrafts = vi.fn();
const createV2QuestionDraftVersions = vi.fn();
const writeV2CanonicalEvent = vi.fn();

vi.mock('@/lib/v2/generation/questionEngine', () => ({
  generateV2QuestionDrafts,
}));

vi.mock('@/lib/v2/questionBank', () => ({
  createV2QuestionDraftVersions,
}));

vi.mock('@/lib/v2/events', () => ({
  writeV2CanonicalEvent,
}));

describe('runGenerationJobById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeV2CanonicalEvent.mockResolvedValue(undefined);
  });

  it('processes question_draft jobs and records question artifact output', async () => {
    generateV2QuestionDrafts.mockResolvedValue([
      {
        stableKey: 'BIO-101-1A:job-1::generated::q-1',
        prompt: 'Which structure contains DNA?',
        acceptedAnswers: ['Nucleus'],
        options: ['Cell wall', 'Nucleus', 'Cytoplasm', 'Membrane'],
        questionType: 'mcq',
        sourceBlockId: 'generated-q-1',
        sourceBlockType: 'generated',
      },
    ]);
    createV2QuestionDraftVersions.mockResolvedValue({
      questionCount: 1,
      createdCount: 1,
      questionVersionIds: ['qv-1'],
      questionIds: ['q-1'],
    });

    const eventLogInsert = vi.fn().mockResolvedValue({ error: null });
    const generationStepsInsert = vi.fn().mockResolvedValue({ error: null });
    const generationArtifactsInsert = vi.fn().mockResolvedValue({ error: null });
    const generationJobsUpdate = vi
      .fn()
      .mockImplementationOnce(() => ({
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'job-1' }, error: null }),
      }))
      .mockImplementationOnce(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }));

    const adminClient = {
      from: vi.fn((table: string) => {
        if (table === 'v2_generation_jobs') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                id: 'job-1',
                kind: 'question_draft',
                status: 'queued',
                lesson_id: 'lesson-1',
                payload: { prompt: 'Generate fresh biology quiz questions.', lessonCode: 'BIO-101-1A' },
                attempts_made: 0,
                max_attempts: 3,
              },
              error: null,
            }),
            update: generationJobsUpdate,
          };
        }
        if (table === 'v2_lessons') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: 'lesson-1', code: 'BIO-101-1A', title: 'Cell Structure Basics' },
              error: null,
            }),
          };
        }
        if (table === 'v2_lesson_versions') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                version_no: 2,
                content_json: {
                  id: 'BIO-101-1A',
                  title: 'Cell Structure Basics',
                  description: 'Cells intro',
                  unit: 'BIO-101',
                  blocks: [],
                },
              },
              error: null,
            }),
          };
        }
        if (table === 'v2_generation_job_steps') {
          return { insert: generationStepsInsert };
        }
        if (table === 'v2_generation_artifacts') {
          return { insert: generationArtifactsInsert };
        }
        if (table === 'v2_event_log') {
          return { insert: eventLogInsert };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    } as any;

    const { runGenerationJobById } = await import('./runGenerationJob');
    const result = await runGenerationJobById(adminClient, 'job-1', 'test-worker');

    expect(result.status).toBe('succeeded');
    expect(result.output).toEqual({
      generatedQuestionCount: 1,
      createdQuestionVersions: 1,
      questionVersionIds: ['qv-1'],
    });
    expect(generateV2QuestionDrafts).toHaveBeenCalledTimes(1);
    expect(createV2QuestionDraftVersions).toHaveBeenCalledWith(
      adminClient,
      expect.objectContaining({
        lessonId: 'lesson-1',
        lessonCode: 'BIO-101-1A',
        source: 'ai',
      })
    );
    expect(generationArtifactsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        artifact_type: 'question_draft',
        artifact_json: expect.objectContaining({
          generatedQuestionCount: 1,
          questionVersionIds: ['qv-1'],
        }),
      })
    );
  });
});
