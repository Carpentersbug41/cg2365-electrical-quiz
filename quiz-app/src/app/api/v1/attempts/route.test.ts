import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NextResponse } from 'next/server';

const ensureAuthProgressEnabled = vi.fn();
const requireSupabaseSession = vi.fn();
const updateLessonProgressFromAttempt = vi.fn();

vi.mock('@/lib/authProgress/routeGuard', () => ({
  ensureAuthProgressEnabled,
  requireSupabaseSession,
}));

vi.mock('@/lib/authProgress/serverProgress', () => ({
  updateLessonProgressFromAttempt,
}));

describe('POST /api/v1/attempts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    });

    const request = new Request('http://localhost/api/v1/attempts', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const { POST } = await import('./route');
    const response = await POST(request as never);
    expect(response.status).toBe(401);
  });

  it('inserts a valid attempt row for authenticated users', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);

    const single = vi.fn().mockResolvedValue({ data: { id: 'attempt-1' }, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: { from },
      },
      response: null,
    });

    const request = new Request('http://localhost/api/v1/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lesson_id: '202-2A',
        question_stable_id: '202-2A-LO1::q3051',
        question_type: 'mcq',
        correct: true,
        score: 1,
        user_answer: 'Ampere (A)',
        grading_mode: 'deterministic',
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(request as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(from).toHaveBeenCalledWith('question_attempts');
    expect(updateLessonProgressFromAttempt).toHaveBeenCalledTimes(1);
  });
});
