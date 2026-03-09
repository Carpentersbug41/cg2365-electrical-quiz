import { beforeEach, describe, expect, it, vi } from 'vitest';

const guardV2AdminAccess = vi.fn();
const createV2AdminClient = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => {
  throw error;
});

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  createV2AdminClient,
  toV2AdminError,
}));

describe('GET /api/admin/v2/readiness', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns content, access, and operations readiness signals', async () => {
    const lessonsQuery = {
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          { id: 'lesson-1', code: 'BIO-101-1A', title: 'Cells' },
          { id: 'lesson-2', code: 'BIO-102-1A', title: 'Transport' },
        ],
        error: null,
      }),
    };
    const lessonVersionsQuery = {
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          { lesson_id: 'lesson-1', status: 'published' },
          { lesson_id: 'lesson-2', status: 'draft' },
        ],
        error: null,
      }),
    };
    const questionVersionsQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          { status: 'published', v2_questions: { lesson_id: 'lesson-1' } },
        ],
        error: null,
      }),
    };
    const enrollmentsQuery = {
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ status: 'active' }, { status: 'withdrawn' }],
        error: null,
      }),
    };
    const generationJobsQuery = {
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'job-1',
            kind: 'lesson_draft',
            lesson_id: 'lesson-2',
            status: 'failed',
            attempts_made: 3,
            max_attempts: 3,
            created_at: '2026-03-09T08:55:00.000Z',
            started_at: '2026-03-09T09:00:00.000Z',
            finished_at: '2026-03-09T09:10:00.000Z',
            error_message: '[UNKNOWN] failed',
          },
          {
            id: 'job-2',
            kind: 'question_draft',
            lesson_id: 'lesson-1',
            status: 'succeeded',
            attempts_made: 1,
            max_attempts: 3,
            created_at: '2026-03-09T07:55:00.000Z',
            started_at: '2026-03-09T08:00:00.000Z',
            finished_at: '2026-03-09T08:05:00.000Z',
            error_message: null,
          },
          {
            id: 'job-3',
            kind: 'lesson_draft',
            lesson_id: 'lesson-2',
            status: 'running',
            attempts_made: 1,
            max_attempts: 3,
            created_at: '2026-03-09T07:00:00.000Z',
            started_at: '2026-03-09T07:05:00.000Z',
            finished_at: null,
            error_message: null,
          },
          {
            id: 'job-4',
            kind: 'question_draft',
            lesson_id: 'lesson-2',
            status: 'queued',
            attempts_made: 0,
            max_attempts: 3,
            created_at: '2026-03-09T06:00:00.000Z',
            started_at: null,
            finished_at: null,
            error_message: null,
          },
        ],
        error: null,
      }),
    };
    const eventLogQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          event_ts: '2026-03-09T09:15:00.000Z',
          payload: { attempted: 2, succeeded: 1, failed: 1, skipped: 0 },
        },
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: (table: string) => {
        if (table === 'v2_lessons') return lessonsQuery;
        if (table === 'v2_lesson_versions') return lessonVersionsQuery;
        if (table === 'v2_question_versions') return questionVersionsQuery;
        if (table === 'v2_enrollments') return enrollmentsQuery;
        if (table === 'v2_generation_jobs') return generationJobsQuery;
        if (table === 'v2_event_log') return eventLogQuery;
        throw new Error(`Unexpected table ${table}`);
      },
    });

    const { GET } = await import('./route');
    const response = await GET({ nextUrl: new URL('http://localhost/api/admin/v2/readiness') } as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.content.lessons_missing_published).toEqual([
      { id: 'lesson-2', code: 'BIO-102-1A', title: 'Transport' },
    ]);
    expect(payload.content.lessons_missing_question_coverage).toEqual([]);
    expect(payload.access.enrollments_by_status).toEqual({
      active: 1,
      withdrawn: 1,
    });
    expect(payload.content.moderation_backlog).toEqual({
      lessons: { draft: 1, needs_review: 0, approved: 0 },
      questions: { draft: 0, needs_review: 0, approved: 0 },
    });
    expect(payload.operations.retry_exhausted_jobs).toBe(1);
    expect(payload.operations.stuck_running_jobs).toEqual([
      expect.objectContaining({
        id: 'job-3',
        kind: 'lesson_draft',
        lesson_code: 'BIO-102-1A',
      }),
    ]);
    expect(payload.operations.stale_queued_jobs).toEqual([
      expect.objectContaining({
        id: 'job-4',
        kind: 'question_draft',
        lesson_code: 'BIO-102-1A',
      }),
    ]);
    expect(payload.operations.queue_run_is_stale).toBeTypeOf('boolean');
    expect(payload.operations.last_queue_run).toEqual({
      event_ts: '2026-03-09T09:15:00.000Z',
      attempted: 2,
      succeeded: 1,
      failed: 1,
      skipped: 0,
    });
    expect(payload.phase1_biology.target_lessons_total).toBe(7);
    expect(payload.phase1_biology.source_lessons_available).toBe(7);
    expect(payload.phase1_biology.missing_from_source).toEqual([]);
    expect(payload.phase1_biology.missing_published).toContain('BIO-101-1B');
    expect(payload.phase1_biology.lessons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lesson_code: 'BIO-101-1A',
          source_available: true,
          published_ready: true,
          question_coverage_ready: true,
        }),
      ])
    );
  });
});
