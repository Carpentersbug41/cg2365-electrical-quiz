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

describe('GET /api/admin/v2/outcomes/interventions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns learner and lesson intervention rows for at-risk cases', async () => {
    const profilesQuery = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          { user_id: 'student-1', display_name: 'Student One', role: 'student' },
          { user_id: 'admin-1', display_name: 'Admin One', role: 'admin' },
        ],
        error: null,
      }),
    };
    const metricsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'student-1',
            attempts_count: 10,
            attempts_correct: 5,
            lessons_started: 4,
            lessons_completed: 1,
            review_due: 8,
            review_resolved: 2,
            review_backlog: 6,
          },
        ],
        error: null,
      }),
    };
    const masteryQuery = {
      select: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'student-1',
            lesson_id: 'lesson-1',
            attempts_count: 4,
            best_score_percent: 55,
            mastery_status: 'pending',
            v2_lessons: { code: 'BIO-101-1A', title: 'Cells' },
          },
        ],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: (table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_daily_user_metrics') return metricsQuery;
        if (table === 'v2_mastery_records') return masteryQuery;
        throw new Error(`Unexpected table ${table}`);
      },
    });

    const { GET } = await import('./route');
    const response = await GET({
      nextUrl: new URL('http://localhost/api/admin/v2/outcomes/interventions?days=30&limit=5'),
    } as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.learners[0]).toEqual(
      expect.objectContaining({
        user_id: 'student-1',
        risk_score: expect.any(Number),
      })
    );
    expect(payload.learners[0].risk_reasons).toContain('low_completion');
    expect(payload.lessons[0]).toEqual(
      expect.objectContaining({
        lesson_code: 'BIO-101-1A',
        risk_score: expect.any(Number),
      })
    );
  });
});
