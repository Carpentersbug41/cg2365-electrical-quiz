import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireV2EnrolledSession = vi.fn();
const getV2PublishedLessonRecordByCode = vi.fn();
const listV2PublishedQuizQuestions = vi.fn();
const startLessonSession = vi.fn();
const startQuizSession = vi.fn();

vi.mock('@/lib/v2/session', () => ({
  requireV2EnrolledSession,
}));

vi.mock('@/lib/v2/publishedLessons', () => ({
  getV2PublishedLessonRecordByCode,
}));

vi.mock('@/lib/v2/questionBank', () => ({
  listV2PublishedQuizQuestions,
}));

vi.mock('@/lib/v2/runtimeSessions', () => ({
  startLessonSession,
  startQuizSession,
}));

describe('POST /api/v2/runtime/quiz-session/start', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    requireV2EnrolledSession.mockResolvedValue({
      session: {
        user: { id: 'user-1' },
        client: {},
      },
      response: null,
    });
  });

  it('blocks quiz start when published question coverage is missing', async () => {
    getV2PublishedLessonRecordByCode.mockResolvedValue({
      lessonId: 'lesson-row-1',
      lessonVersionId: 'version-1',
      lesson: { id: 'BIO-101-1A' },
    });
    listV2PublishedQuizQuestions.mockResolvedValue([]);

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/v2/runtime/quiz-session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: 'BIO-101-1A' }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toContain('no published question-bank coverage');
  });

  it('starts lesson and quiz sessions when coverage exists', async () => {
    getV2PublishedLessonRecordByCode.mockResolvedValue({
      lessonId: 'lesson-row-1',
      lessonVersionId: 'version-1',
      lesson: { id: 'BIO-101-1A' },
    });
    listV2PublishedQuizQuestions.mockResolvedValue([{ questionId: 'q1' }]);
    startLessonSession.mockResolvedValue({ lessonSessionId: 'lesson-session-1', created: true });
    startQuizSession.mockResolvedValue({ quizSessionId: 'quiz-session-1', created: true });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/v2/runtime/quiz-session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: 'BIO-101-1A' }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(startLessonSession).toHaveBeenCalled();
    expect(startQuizSession).toHaveBeenCalled();
    expect(payload).toEqual(
      expect.objectContaining({
        success: true,
        lessonSessionId: 'lesson-session-1',
        quizSessionId: 'quiz-session-1',
      })
    );
  });
});
