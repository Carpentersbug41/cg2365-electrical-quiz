import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const ensureAuthProgressEnabled = vi.fn();
const requireSupabaseSession = vi.fn();

vi.mock('@/lib/authProgress/routeGuard', () => ({
  ensureAuthProgressEnabled,
  requireSupabaseSession,
}));

describe('GET /api/v1/review/wrong-items', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 401 when auth is missing', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/v1/review/wrong-items'));

    expect(response.status).toBe(401);
  });

  it('deduplicates incorrect attempts by question_stable_id', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);

    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        error: null,
        data: [
          { question_stable_id: 'Q1', created_at: '2026-02-10T10:00:00Z' },
          { question_stable_id: 'Q1', created_at: '2026-02-09T10:00:00Z' },
          { question_stable_id: 'Q2', created_at: '2026-02-08T10:00:00Z' },
        ],
      }),
    };

    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {
          from: vi.fn().mockReturnValue(query),
        },
      },
      response: null,
    });

    const { GET } = await import('./route');
    const response = await GET(
      new NextRequest('http://localhost/api/v1/review/wrong-items?limit=2')
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items).toHaveLength(2);
    expect(payload.items[0].question_stable_id).toBe('Q1');
    expect(payload.items[1].question_stable_id).toBe('Q2');
  });
});
