import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const ensureAuthProgressEnabled = vi.fn();
const requireSupabaseSession = vi.fn();
const getStudentQuizSet = vi.fn();
const generateQuizFeedbackReport = vi.fn();
const upsertWrongItemsFromReport = vi.fn();

vi.mock('@/lib/authProgress/routeGuard', () => ({
  ensureAuthProgressEnabled,
  requireSupabaseSession,
}));

vi.mock('@/lib/quizSets/repo', () => ({
  getStudentQuizSet,
}));

vi.mock('@/lib/review/quizFeedbackService', () => ({
  generateQuizFeedbackReport,
}));

vi.mock('@/lib/review/reviewQueueRepo', () => ({
  upsertWrongItemsFromReport,
}));

describe('POST /api/v1/quiz-sets/[setId]/finalize', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 401 when auth is missing', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/v1/quiz-sets/set-1/finalize', {
        method: 'POST',
        body: JSON.stringify({ wrongQuestions: [] }),
      }),
      { params: Promise.resolve({ setId: 'set-1' }) } as never
    );
    expect(response.status).toBe(401);
  });

  it('returns 404 when set is missing', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    getStudentQuizSet.mockResolvedValue(null);
    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/v1/quiz-sets/set-1/finalize', {
        method: 'POST',
        body: JSON.stringify({ wrongQuestions: [] }),
      }),
      { params: Promise.resolve({ setId: 'set-1' }) } as never
    );
    expect(response.status).toBe(404);
  });

  it('generates report and persists wrong items', async () => {
    ensureAuthProgressEnabled.mockReturnValue(null);
    getStudentQuizSet.mockResolvedValue({
      id: 'set-1',
      user_id: 'user-1',
    });
    generateQuizFeedbackReport.mockResolvedValue({
      summary: 's',
      overallFocus: [],
      items: [{ questionNumber: 1, whyWrong: 'w', howToGetRight: 'h', whatToReview: ['x'] }],
    });
    requireSupabaseSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/v1/quiz-sets/set-1/finalize', {
        method: 'POST',
        body: JSON.stringify({
          wrongQuestions: [
            {
              questionNumber: 1,
              questionStableId: 'qid-1',
              questionText: 'Q1',
              userAnswer: 'A',
              correctAnswer: 'B',
            },
          ],
        }),
      }),
      { params: Promise.resolve({ setId: 'set-1' }) } as never
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.report.summary).toBe('s');
    expect(generateQuizFeedbackReport).toHaveBeenCalledTimes(1);
    expect(upsertWrongItemsFromReport).toHaveBeenCalledTimes(1);
  });
});
