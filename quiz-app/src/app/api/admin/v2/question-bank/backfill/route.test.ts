import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const syncPublishedLessonQuestions = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
}));

vi.mock('@/lib/v2/questionBank', () => ({
  syncPublishedLessonQuestions,
}));

describe('POST /api/admin/v2/question-bank/backfill', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
    syncPublishedLessonQuestions.mockResolvedValue({
      questionCount: 2,
      syncedCount: 2,
      retiredCount: 0,
    });
  });

  it('returns 503 when the admin client is unavailable', async () => {
    createV2AdminClient.mockReturnValue(null);

    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/question-bank/backfill', { method: 'POST' }));

    expect(response.status).toBe(503);
  });

  it('backfills published lesson versions through the sync utility', async () => {
    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'version-1',
            lesson_id: 'lesson-1',
            source: 'human',
            quality_score: 100,
            content_json: { id: 'BIO-101-1A' },
            v2_lessons: { code: 'BIO-101-1A' },
          },
        ],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lesson_versions') return versionQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/question-bank/backfill', { method: 'POST' }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(syncPublishedLessonQuestions).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        lessonId: 'lesson-1',
        lessonCode: 'BIO-101-1A',
        lessonVersionId: 'version-1',
      })
    );
    expect(payload.totalSynced).toBe(2);
  });
});
