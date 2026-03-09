import { beforeEach, describe, expect, it, vi } from 'vitest';

const guardV2AdminAccess = vi.fn();
const createV2AdminClient = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => {
  throw error;
});

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  createV2AdminClient,
  toV2AdminError,
}));

describe('GET /api/admin/v2/outcomes/breakdown', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('builds unit and lesson breakdowns while excluding admin users', async () => {
    const profilesQuery = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          { user_id: 'student-1', role: 'student' },
          { user_id: 'student-2', role: 'student' },
          { user_id: 'admin-1', role: 'admin' },
        ],
        error: null,
      }),
    };

    const masteryQuery = {
      select: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'student-1',
            lesson_id: 'lesson-1',
            attempts_count: 2,
            best_score_percent: 80,
            mastery_status: 'achieved',
            v2_lessons: {
              code: 'BIO-101-1A',
              title: 'Cells',
              v2_units: { code: 'BIO-101', name: 'Unit BIO-101' },
            },
          },
          {
            user_id: 'student-2',
            lesson_id: 'lesson-1',
            attempts_count: 3,
            best_score_percent: 60,
            mastery_status: 'pending',
            v2_lessons: {
              code: 'BIO-101-1A',
              title: 'Cells',
              v2_units: { code: 'BIO-101', name: 'Unit BIO-101' },
            },
          },
          {
            user_id: 'admin-1',
            lesson_id: 'lesson-2',
            attempts_count: 1,
            best_score_percent: 100,
            mastery_status: 'achieved',
            v2_lessons: {
              code: 'BIO-102-1A',
              title: 'Transport',
              v2_units: { code: 'BIO-102', name: 'Unit BIO-102' },
            },
          },
        ],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: (table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_mastery_records') return masteryQuery;
        throw new Error(`Unexpected table ${table}`);
      },
    });

    const { GET } = await import('./route');
    const request = {
      nextUrl: new URL('http://localhost/api/admin/v2/outcomes/breakdown?days=30'),
    };
    const response = await GET(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.lessons).toEqual([
      {
        lesson_id: 'lesson-1',
        lesson_code: 'BIO-101-1A',
        lesson_title: 'Cells',
        unit_code: 'BIO-101',
        unit_name: 'Unit BIO-101',
        learners_started: 2,
        learners_mastered: 1,
        mastery_rate_pct: 50,
        average_best_score_pct: 70,
        average_attempts: 2.5,
      },
    ]);
    expect(payload.units).toEqual([
      {
        unit_code: 'BIO-101',
        unit_name: 'Unit BIO-101',
        lessons_tracked: 1,
        learners_started: 2,
        learners_mastered: 1,
        mastery_rate_pct: 50,
        average_best_score_pct: 70,
        average_attempts: 2.5,
      },
    ]);
  });

  it('applies lesson/unit filters, sorting, and limit', async () => {
    const profilesQuery = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [{ user_id: 'student-1', role: 'student' }],
        error: null,
      }),
    };

    const masteryQuery = {
      select: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            user_id: 'student-1',
            lesson_id: 'lesson-1',
            attempts_count: 4,
            best_score_percent: 55,
            mastery_status: 'pending',
            v2_lessons: {
              code: 'BIO-101-1A',
              title: 'Cells',
              v2_units: { code: 'BIO-101', name: 'Unit BIO-101' },
            },
          },
          {
            user_id: 'student-1',
            lesson_id: 'lesson-2',
            attempts_count: 1,
            best_score_percent: 90,
            mastery_status: 'achieved',
            v2_lessons: {
              code: 'BIO-102-1A',
              title: 'Transport',
              v2_units: { code: 'BIO-102', name: 'Unit BIO-102' },
            },
          },
        ],
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: (table: string) => {
        if (table === 'profiles') return profilesQuery;
        if (table === 'v2_mastery_records') return masteryQuery;
        throw new Error(`Unexpected table ${table}`);
      },
    });

    const { GET } = await import('./route');
    const request = {
      nextUrl: new URL(
        'http://localhost/api/admin/v2/outcomes/breakdown?unitCode=BIO-101&lessonSortBy=average_best_score&sortDir=asc&limit=1'
      ),
    };
    const response = await GET(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.lessons).toHaveLength(1);
    expect(payload.lessons[0].lesson_code).toBe('BIO-101-1A');
    expect(payload.units).toEqual([
      {
        unit_code: 'BIO-101',
        unit_name: 'Unit BIO-101',
        lessons_tracked: 1,
        learners_started: 1,
        learners_mastered: 0,
        mastery_rate_pct: 0,
        average_best_score_pct: 55,
        average_attempts: 4,
      },
    ]);
  });
});
