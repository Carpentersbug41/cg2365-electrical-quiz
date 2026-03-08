import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardUserAdminAccess = vi.fn();
const toUserAdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createSupabaseAdminClient = vi.fn();

vi.mock('@/app/api/admin/users/_utils', () => ({
  guardUserAdminAccess,
  toUserAdminError,
}));

vi.mock('@/lib/supabase/admin', () => ({
  createSupabaseAdminClient,
}));

describe('GET /api/admin/v2/outcomes/timeseries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardUserAdminAccess.mockResolvedValue(null);
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

    const attemptsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          { user_id: 'student-1', is_correct: true, created_at: '2026-03-08T10:00:00.000Z' },
          { user_id: 'admin-1', is_correct: false, created_at: '2026-03-08T11:00:00.000Z' },
        ],
        error: null,
      }),
    };

    const reviewsQuery = {
      select: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'student-1',
            status: 'resolved',
            due_at: '2026-03-08T09:00:00.000Z',
            resolved_at: '2026-03-08T08:30:00.000Z',
            updated_at: '2026-03-08T08:30:00.000Z',
          },
          {
            user_id: 'admin-1',
            status: 'resolved',
            due_at: '2026-03-08T12:00:00.000Z',
            resolved_at: '2026-03-08T12:30:00.000Z',
            updated_at: '2026-03-08T12:30:00.000Z',
          },
        ],
        error: null,
      }),
    };

    createSupabaseAdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_attempts') return attemptsQuery;
        if (table === 'v2_review_items') return reviewsQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/outcomes/timeseries?days=7'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    const targetDay = payload.timeline.find((row: { date: string }) => row.date === '2026-03-08');
    expect(targetDay.attempts_total).toBe(1);
    expect(targetDay.accuracy_pct).toBe(100);
    expect(targetDay.review_due).toBe(1);
    expect(targetDay.review_resolved).toBe(1);
  });
});
