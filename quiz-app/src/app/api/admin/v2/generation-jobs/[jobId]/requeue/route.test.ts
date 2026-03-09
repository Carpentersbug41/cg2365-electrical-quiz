import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const getV2ActorUserId = vi.fn(async () => 'admin-user-1');

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
  getV2ActorUserId,
}));

describe('POST /api/admin/v2/generation-jobs/[jobId]/requeue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('requeues a failed job and records an audit event', async () => {
    const updateCall = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    const eventInsert = vi.fn().mockResolvedValue({ error: null });

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_generation_jobs') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi
              .fn()
              .mockReturnValueOnce({
                limit: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                  data: {
                    id: 'job-1',
                    status: 'failed',
                    kind: 'lesson_draft',
                    lesson_id: 'lesson-1',
                    attempts_made: 3,
                    max_attempts: 3,
                    started_at: '2026-03-09T08:00:00.000Z',
                    payload: { lessonCode: 'BIO-101-1A' },
                  },
                  error: null,
                }),
              }),
            update: updateCall,
          };
        }
        if (table === 'v2_event_log') {
          return { insert: eventInsert };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/generation-jobs/job-1/requeue', {
        method: 'POST',
        body: JSON.stringify({ force: false }),
      }),
      { params: Promise.resolve({ jobId: 'job-1' }) }
    );

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(updateCall).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'queued',
        attempts_made: 0,
      })
    );
    expect(eventInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'admin_generation_job_requeued',
        user_id: 'admin-user-1',
      })
    );
  });

  it('rejects requeueing a non-stale running job without force', async () => {
    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_generation_jobs') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: 'job-2',
                  status: 'running',
                  kind: 'question_draft',
                  lesson_id: 'lesson-1',
                  attempts_made: 1,
                  max_attempts: 3,
                  started_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                  payload: {},
                },
                error: null,
              }),
            }),
          };
        }
        if (table === 'v2_event_log') {
          return { insert: vi.fn() };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/generation-jobs/job-2/requeue', {
        method: 'POST',
        body: JSON.stringify({ force: false }),
      }),
      { params: Promise.resolve({ jobId: 'job-2' }) }
    );

    expect(response.status).toBe(409);
  });
});
