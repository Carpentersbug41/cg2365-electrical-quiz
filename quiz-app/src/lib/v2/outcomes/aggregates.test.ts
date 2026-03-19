import { beforeEach, describe, expect, it, vi } from 'vitest';

const listV2PrivilegedUserIds = vi.fn();

vi.mock('@/lib/v2/access', () => ({
  listV2PrivilegedUserIds,
}));

describe('refreshV2DailyMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listV2PrivilegedUserIds.mockResolvedValue(new Set<string>());
  });

  it('builds learner and ops metrics from canonical events', async () => {
    const profilesQuery = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [{ user_id: 'user-1', role: 'student' }],
        error: null,
      }),
    };
    const eventsQuery = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          { event_type: 'lesson_started', user_id: 'user-1', event_ts: '2026-03-09T10:00:00.000Z', payload: {} },
          { event_type: 'question_attempted', user_id: 'user-1', event_ts: '2026-03-09T10:05:00.000Z', payload: { isCorrect: true } },
          { event_type: 'question_attempted', user_id: 'user-1', event_ts: '2026-03-09T10:06:00.000Z', payload: { isCorrect: false } },
          { event_type: 'lesson_completed', user_id: 'user-1', event_ts: '2026-03-09T10:10:00.000Z', payload: { masteryAchieved: true } },
          { event_type: 'review_item_due', user_id: 'user-1', event_ts: '2026-03-09T10:11:00.000Z', payload: {} },
          { event_type: 'review_item_resolved', user_id: 'user-1', event_ts: '2026-03-09T10:12:00.000Z', payload: {} },
          { event_type: 'generation_job_started', user_id: null, event_ts: '2026-03-09T11:00:00.000Z', payload: { jobId: 'job-1' } },
          { event_type: 'generation_job_completed', user_id: null, event_ts: '2026-03-09T11:05:00.000Z', payload: { status: 'succeeded', durationMs: 5000 } },
        ],
        error: null,
      }),
    };
    const reviewItemsQuery = {
      select: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'user-1',
            due_at: '2026-03-09T10:11:00.000Z',
            resolved_at: '2026-03-09T10:12:00.000Z',
            updated_at: '2026-03-09T10:12:00.000Z',
            times_wrong: 1,
            times_right: 1,
          },
        ],
        error: null,
      }),
    };
    const deleteUserQuery = {
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ error: null }),
    };
    const deleteOpsQuery = {
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ error: null }),
    };
    const upsertUserMetrics = vi.fn().mockResolvedValue({ error: null });
    const upsertOpsMetrics = vi.fn().mockResolvedValue({ error: null });

    const adminClient = {
      from: vi.fn((table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_event_log') return eventsQuery;
        if (table === 'v2_review_items') return reviewItemsQuery;
        if (table === 'v2_daily_user_metrics') {
          return {
            delete: vi.fn().mockReturnValue(deleteUserQuery),
            upsert: upsertUserMetrics,
          };
        }
        if (table === 'v2_daily_ops_metrics') {
          return {
            delete: vi.fn().mockReturnValue(deleteOpsQuery),
            upsert: upsertOpsMetrics,
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    } as any;

    const { refreshV2DailyMetrics } = await import('./aggregates');
    const result = await refreshV2DailyMetrics(adminClient, {
      startDate: '2026-03-09',
      endDate: '2026-03-09',
    });

    expect(result).toEqual({
      userRowsUpserted: 1,
      opsRowsUpserted: 1,
      startDate: '2026-03-09',
      endDate: '2026-03-09',
    });
    expect(upsertUserMetrics).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          day: '2026-03-09',
          user_id: 'user-1',
          attempts_count: 2,
          attempts_correct: 1,
          lessons_started: 1,
          lessons_completed: 1,
          mastered_lessons: 1,
          review_due: 2,
          review_resolved: 2,
          review_recovery_denominator: 1,
          review_recovery_numerator: 1,
          accuracy_percent: 50,
        }),
      ],
      { onConflict: 'day,user_id' }
    );
    expect(upsertOpsMetrics).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          day: '2026-03-09',
          generation_jobs_total: 1,
          generation_jobs_succeeded: 1,
          generation_jobs_failed: 0,
          generation_duration_ms_sum: 5000,
          generation_duration_count: 1,
        }),
      ],
      { onConflict: 'day' }
    );
  });
});
