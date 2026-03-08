import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardUserAdminAccess = vi.fn();
const toUserAdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createSupabaseAdminClient = vi.fn();

vi.mock('@/app/api/admin/users/_utils', () => ({
  guardUserAdminAccess,
  toUserAdminError,
}));

vi.mock('@/lib/supabase/admin', () => ({
  createSupabaseAdminClient,
}));

describe('GET /api/admin/v2/lesson-versions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardUserAdminAccess.mockResolvedValue(null);
  });

  it('filters by lesson code before applying the version limit', async () => {
    let v2LessonsCallCount = 0;

    const lessonMatchQuery = {
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-2' }],
        error: null,
      }),
    };

    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'version-2',
            lesson_id: 'lesson-2',
            version_no: 2,
            status: 'draft',
            source: 'ai',
            quality_score: 88,
            is_current: false,
            published_at: null,
            created_at: '2026-03-08T10:00:00.000Z',
          },
        ],
        error: null,
      }),
    };

    const lessonLookupQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'lesson-2', unit_id: 'unit-1', code: 'BIO-104-2A', title: 'Transport in cells' }],
        error: null,
      }),
    };

    const unitQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'unit-1', course_id: 'course-1', code: 'BIO-104', name: 'Cells' }],
        error: null,
      }),
    };

    const courseQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: [{ id: 'course-1', code: 'gcse-science-biology', name: 'GCSE Biology' }],
        error: null,
      }),
    };

    createSupabaseAdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lessons') {
          v2LessonsCallCount += 1;
          return v2LessonsCallCount === 1 ? lessonMatchQuery : lessonLookupQuery;
        }
        if (table === 'v2_lesson_versions') return versionQuery;
        if (table === 'v2_units') return unitQuery;
        if (table === 'v2_courses') return courseQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { GET } = await import('./route');
    const response = await GET(
      new NextRequest('http://localhost/api/admin/v2/lesson-versions?lessonCode=104-2A')
    );

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(versionQuery.in).toHaveBeenCalledWith('lesson_id', ['lesson-2']);
    expect(payload.versions).toHaveLength(1);
    expect(payload.versions[0].lesson.code).toBe('BIO-104-2A');
  });
});
