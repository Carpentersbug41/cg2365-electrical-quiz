import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const ensureAuthProgressEnabled = vi.fn();
const requireSupabaseSession = vi.fn();
const listStudentQuizSets = vi.fn();
const createStudentQuizSet = vi.fn();

vi.mock('@/lib/authProgress/routeGuard', () => ({
  ensureAuthProgressEnabled,
  requireSupabaseSession,
}));

vi.mock('@/lib/quizSets/repo', () => ({
  listStudentQuizSets,
  createStudentQuizSet,
}));

describe('api/v1/quiz-sets', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('GET returns 401 when auth is missing', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/v1/quiz-sets'));
    expect(response.status).toBe(401);
  });

  it('GET returns sets for authenticated user', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    listStudentQuizSets.mockResolvedValue([{ id: 'set-1', title: 'Weak ACs' }]);
    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/v1/quiz-sets'));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.sets).toHaveLength(1);
  });

  it('POST returns 201 on successful create', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    createStudentQuizSet.mockResolvedValue({ id: 'set-1', title: 'New Set' });
    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/v1/quiz-sets', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Set',
          unit_code: '202',
          level: 2,
          question_count: 20,
          cadence_days: 3,
          lo_codes: [],
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(response.status).toBe(201);
  });
});
