import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const getV2ActorUserId = vi.fn(async () => null);

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
  getV2ActorUserId,
}));

describe('POST /api/admin/v2/generation-jobs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns 400 when lessonCode is missing for lesson_draft', async () => {
    createV2AdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs', {
      method: 'POST',
      body: JSON.stringify({ kind: 'lesson_draft', lessonCode: '' }),
    }));

    expect(response.status).toBe(400);
  });

  it('accepts question_draft jobs when a lesson code is provided', async () => {
    const lessonLookup = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-1', code: 'BIO-101-1A' }],
        error: null,
      }),
    };

    const existingJobsLookup = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };

    const insertQuery = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{
          id: 'job-1',
          kind: 'question_draft',
          status: 'queued',
          lesson_id: 'lesson-1',
          payload: { lessonCode: 'BIO-101-1A' },
          attempts_made: 0,
          max_attempts: 3,
          error_message: null,
          queued_at: '2026-03-09T12:00:00.000Z',
          started_at: null,
          finished_at: null,
          created_at: '2026-03-09T12:00:00.000Z',
        }],
        error: null,
      }),
    };

    const eventInsert = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lessons') return lessonLookup;
        if (table === 'v2_generation_jobs') {
          return existingJobsLookup.in.mock.calls.length === 0 ? existingJobsLookup : insertQuery;
        }
        if (table === 'v2_event_log') return eventInsert;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs', {
      method: 'POST',
      body: JSON.stringify({ kind: 'question_draft', lessonCode: 'BIO-101-1A' }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.jobs).toHaveLength(1);
    expect(payload.jobs[0].kind).toBe('question_draft');
  });

  it('returns 503 when admin client is unavailable', async () => {
    createV2AdminClient.mockReturnValue(null);
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/generation-jobs'));

    expect(response.status).toBe(503);
  });

  it('gracefully skips lesson codes that hit a unique-violation race on insert', async () => {
    const lessonLookup = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-1', code: 'BIO-101-1A' }],
        error: null,
      }),
    };

    const existingJobsLookup = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };

    const insertQuery = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      }),
    };

    const eventInsert = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lessons') return lessonLookup;
        if (table === 'v2_generation_jobs') {
          return existingJobsLookup.in.mock.calls.length === 0 ? existingJobsLookup : insertQuery;
        }
        if (table === 'v2_event_log') return eventInsert;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs', {
      method: 'POST',
      body: JSON.stringify({ kind: 'lesson_draft', lessonCode: 'BIO-101-1A' }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.jobs).toEqual([]);
    expect(payload.skipped).toEqual(['BIO-101-1A']);
  });
});
