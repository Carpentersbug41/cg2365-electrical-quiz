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

describe('GET /api/admin/v2/outcomes/timeseries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('excludes admin users from cohort metrics when no userId is specified', async () => {
    const profilesQuery = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          { user_id: 'student-1', role: 'student' },
          { user_id: 'admin-1', role: 'admin' },
        ],
        error: null,
      }),
    };

    const metricsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            day: '2026-03-08',
            user_id: 'student-1',
            attempts_count: 2,
            attempts_correct: 1,
            lessons_started: 1,
            lessons_completed: 0,
            review_due: 1,
            review_resolved: 1,
            review_on_time: 1,
            review_backlog: 0,
          },
          {
            day: '2026-03-08',
            user_id: 'admin-1',
            attempts_count: 10,
            attempts_correct: 0,
            lessons_started: 1,
            lessons_completed: 1,
            review_due: 4,
            review_resolved: 0,
            review_on_time: 0,
            review_backlog: 4,
          },
        ],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_daily_user_metrics') return metricsQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/outcomes/timeseries?days=7'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    const targetDay = payload.timeline.find((row: { date: string }) => row.date === '2026-03-08');
    expect(targetDay.attempts_total).toBe(2);
    expect(targetDay.accuracy_pct).toBe(50);
    expect(targetDay.review_due).toBe(1);
    expect(targetDay.review_resolved).toBe(1);
    expect(targetDay.review_active_backlog).toBe(0);
    expect(targetDay.active_users).toBe(1);
  });
});
