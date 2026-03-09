import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
}));

describe('GET /api/admin/v2/outcomes/summary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('builds summary metrics from V2 aggregates while excluding admin users', async () => {
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

    const dailyMetricsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            day: '2026-03-08',
            user_id: 'student-1',
            attempts_count: 4,
            attempts_correct: 3,
            lessons_started: 2,
            lessons_completed: 1,
            review_due: 2,
            review_resolved: 1,
            review_on_time: 1,
            review_recovery_denominator: 1,
            review_recovery_numerator: 1,
          },
          {
            day: '2026-03-08',
            user_id: 'admin-1',
            attempts_count: 10,
            attempts_correct: 0,
            lessons_started: 1,
            lessons_completed: 1,
            review_due: 10,
            review_resolved: 0,
            review_on_time: 0,
            review_recovery_denominator: 0,
            review_recovery_numerator: 0,
          },
        ],
        error: null,
      }),
    };

    const opsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            day: '2026-03-08',
            generation_jobs_total: 3,
            generation_jobs_succeeded: 2,
            generation_jobs_failed: 1,
            generation_duration_ms_sum: 9000,
            generation_duration_count: 3,
          },
        ],
        error: null,
      }),
    };

    const masterySelect = vi.fn().mockReturnThis();
    const masteryOr = vi.fn().mockResolvedValue({
      data: [{ user_id: 'student-1', mastery_status: 'achieved' }],
      error: null,
    });

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_daily_user_metrics') return dailyMetricsQuery;
        if (table === 'v2_daily_ops_metrics') return opsQuery;
        if (table === 'v2_mastery_records') return { select: masterySelect, or: masteryOr };
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/outcomes/summary?days=7'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.summary.learning.attempts_total).toBe(4);
    expect(payload.summary.learning.accuracy_pct).toBe(75);
    expect(payload.summary.behavior.lesson_completion_rate_pct).toBe(50);
    expect(payload.summary.behavior.review_adherence_pct).toBe(50);
    expect(payload.summary.behavior.review_on_time_pct).toBe(50);
    expect(payload.summary.behavior.error_recovery_pct).toBe(100);
    expect(payload.summary.operations.generation_jobs_total).toBe(3);
    expect(payload.summary.operations.generation_success_rate_pct).toBeCloseTo(66.7, 1);
    expect(payload.summary.operations.average_generation_duration_ms).toBe(3000);
    expect(payload.users).toHaveLength(1);
    expect(payload.users[0].user_id).toBe('student-1');
    expect(payload.users[0].mastery_achieved_lessons).toBe(1);
  });
});
