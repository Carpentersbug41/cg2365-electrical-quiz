import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireV2EnrolledSession = vi.fn();
const isAnswerCorrect = vi.fn();
const writeV2CanonicalEvent = vi.fn();

vi.mock('@/lib/v2/session', () => ({
  requireV2EnrolledSession,
}));

vi.mock('@/lib/v2/questionRuntime', () => ({
  isAnswerCorrect,
}));

vi.mock('@/lib/v2/events', () => ({
  writeV2CanonicalEvent,
}));

describe('POST /api/v2/runtime/lesson-quiz/submit', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('requires quizSessionId in the submit payload', async () => {
    requireV2EnrolledSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/v2/runtime/lesson-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: 'BIO-101-1A',
          attempts: [{ questionVersionId: 'version-1', questionStableId: 'stable-1', responseText: 'cell' }],
        }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('quizSessionId is required');
  });

  it('returns the existing result for duplicate quiz submissions', async () => {
    const maybeSingle = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: 'lesson-row-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'version-1' }, error: null })
      .mockResolvedValueOnce({
        data: {
          id: 'quiz-session-1',
          lesson_session_id: 'lesson-session-1',
          submitted_at: '2026-03-09T12:00:00.000Z',
          score_percent: 100,
        },
        error: null,
      });
    const returns = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'question-version-1',
          question_id: 'question-1',
          answer_key: { acceptedAnswers: ['cell'] },
          v2_questions: { stable_key: 'stable-1', lesson_id: 'lesson-row-1' },
        },
      ],
      error: null,
    });
    const select = vi.fn((fields?: string) => {
      if (String(fields).includes('is_correct')) {
        return {
          eq: vi.fn().mockReturnThis(),
          returns: vi.fn().mockResolvedValue({
            data: [{ is_correct: true }],
            error: null,
          }),
        };
      }
      return {
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle,
        returns,
      };
    });

    const client = {
      from: vi.fn(() => ({
        select,
      })),
    };

    requireV2EnrolledSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client,
      },
      response: null,
    });
    isAnswerCorrect.mockReturnValue(true);

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/v2/runtime/lesson-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: 'BIO-101-1A',
          quizSessionId: 'quiz-session-1',
          attempts: [{ questionVersionId: 'question-version-1', questionStableId: 'stable-1', responseText: 'cell' }],
        }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual(
      expect.objectContaining({
        ok: true,
        quizSessionId: 'quiz-session-1',
        percentage: 100,
        correctCount: 1,
        attemptsCount: 1,
        masteryAchieved: true,
        duplicate: true,
      })
    );
    expect(writeV2CanonicalEvent).not.toHaveBeenCalled();
  });
});
