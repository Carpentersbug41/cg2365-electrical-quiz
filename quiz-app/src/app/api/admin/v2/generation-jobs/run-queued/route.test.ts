import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const runGenerationJobById = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
}));

vi.mock('@/lib/v2/generation/runGenerationJob', () => ({
  GenerationJobError: class extends Error {},
  runGenerationJobById,
}));

describe('POST /api/admin/v2/generation-jobs/run-queued', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.V2_GENERATION_CRON_SECRET;
    delete process.env.V2_GENERATION_QUEUE_CADENCE_MINUTES;
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns denied response for non-admin requests without cron secret', async () => {
    guardV2AdminAccess.mockResolvedValue(
      Response.json({ success: false, code: 'FORBIDDEN' }, { status: 403 })
    );
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs/run-queued', {
      method: 'POST',
    }));

    expect(response.status).toBe(403);
  });

  it('returns 503 when admin client is unavailable (cron auth path)', async () => {
    process.env.V2_GENERATION_CRON_SECRET = 'secret-1';
    createV2AdminClient.mockReturnValue(null);
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs/run-queued', {
      method: 'POST',
      headers: {
        'x-cron-secret': 'secret-1',
      },
      body: JSON.stringify({ limit: 2 }),
    }));

    expect(response.status).toBe(503);
  });

  it('returns cadence and queue metadata after processing prioritized jobs', async () => {
    process.env.V2_GENERATION_QUEUE_CADENCE_MINUTES = '15';
    const queuedJobsQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          { id: 'job-question', kind: 'question_draft', lesson_id: 'lesson-1', queued_at: '2026-03-09T09:00:00.000Z' },
          { id: 'job-lesson', kind: 'lesson_draft', lesson_id: 'lesson-2', queued_at: '2026-03-09T09:10:00.000Z' },
        ],
        error: null,
      }),
    };
    const lessonsQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          { id: 'lesson-1', code: 'BIO-101-1A' },
          { id: 'lesson-2', code: 'BIO-101-1B' },
        ],
        error: null,
      }),
    };
    const publishedCoverageQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };
    const eventInsert = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    };
    runGenerationJobById.mockResolvedValueOnce({ jobId: 'job-question', status: 'succeeded', output: {} });

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_generation_jobs') return queuedJobsQuery;
        if (table === 'v2_lessons') return lessonsQuery;
        if (table === 'v2_question_versions') return publishedCoverageQuery;
        if (table === 'v2_event_log') return eventInsert;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs/run-queued', {
      method: 'POST',
      body: JSON.stringify({ limit: 1 }),
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.attempted).toBe(1);
    expect(payload.queued_total).toBe(2);
    expect(payload.remaining_queued).toBe(1);
    expect(payload.cadence_minutes).toBe(15);
    expect(payload.processed).toEqual([
      expect.objectContaining({ jobId: 'job-question', status: 'succeeded' }),
    ]);
  });
});
