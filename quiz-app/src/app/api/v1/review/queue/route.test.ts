import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const ensureAuthProgressEnabled = vi.fn();
const requireSupabaseSession = vi.fn();
const listReviewQueue = vi.fn();

vi.mock('@/lib/authProgress/routeGuard', () => ({
  ensureAuthProgressEnabled,
  requireSupabaseSession,
}));

vi.mock('@/lib/review/reviewQueueRepo', () => ({
  listReviewQueue,
}));

describe('GET /api/v1/review/queue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/v1/review/queue'));
    expect(response.status).toBe(401);
  });

  it('returns queue rows for authenticated users', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    listReviewQueue.mockResolvedValue([
      { id: 'q1', question_stable_id: 'question-1', status: 'active' },
      { id: 'q2', question_stable_id: 'question-2', status: 'active' },
    ]);
    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/v1/review/queue?status=active&limit=10'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.count).toBe(2);
    expect(listReviewQueue).toHaveBeenCalledTimes(1);
  });
});
