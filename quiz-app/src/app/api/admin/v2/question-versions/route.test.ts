import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
}));

describe('GET /api/admin/v2/question-versions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('filters by lesson code before applying the version limit', async () => {
    const lessonsFilterQuery = {
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-1' }],
        error: null,
      }),
    };

    const questionsFilterQuery = {
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'question-1' }],
        error: null,
      }),
    };

    const versionsQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'version-1',
            question_id: 'question-1',
            version_no: 2,
            status: 'published',
            source: 'ai',
            quality_score: 92,
            is_current: true,
            published_at: '2026-03-09T10:00:00.000Z',
            created_at: '2026-03-09T10:00:00.000Z',
            stem: 'What is the function of the nucleus?',
          },
        ],
        error: null,
      }),
    };

    const questionsLookupQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'question-1',
            lesson_id: 'lesson-1',
            stable_key: 'BIO-101-1A:practice:1',
            question_type: 'short',
          },
        ],
        error: null,
      }),
    };

    const lessonsLookupQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-1', code: 'BIO-101-1A', title: 'Cell structure' }],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lessons') {
          if (!lessonsFilterQuery.returns.mock.calls.length) return lessonsFilterQuery;
          return lessonsLookupQuery;
        }
        if (table === 'v2_questions') {
          if (!questionsFilterQuery.returns.mock.calls.length) return questionsFilterQuery;
          return questionsLookupQuery;
        }
        if (table === 'v2_question_versions') return versionsQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/question-versions?lessonCode=BIO-101'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.versions).toHaveLength(1);
    expect(payload.versions[0].lesson.code).toBe('BIO-101-1A');
    expect(payload.versions[0].question.stable_key).toBe('BIO-101-1A:practice:1');
  });
});
