import { beforeEach, describe, expect, it, vi } from 'vitest';

const guardV2AdminAccess = vi.fn();
const createV2AdminClient = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => {
  throw error;
});
const getV2DefaultCourse = vi.fn();
const setV2DefaultEnrollmentStatus = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  createV2AdminClient,
  toV2AdminError,
}));

vi.mock('@/lib/v2/enrollment', () => ({
  getV2DefaultCourse,
  setV2DefaultEnrollmentStatus,
}));

describe('POST /api/admin/v2/enrollments', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
    getV2DefaultCourse.mockResolvedValue({ id: 'course-1' });
  });

  it('grants V2 enrollment to a known email address', async () => {
    const userId = '11111111-1111-4111-8111-111111111111';
    setV2DefaultEnrollmentStatus.mockResolvedValue({
      ok: true,
      courseId: 'course-1',
      enrollmentId: 'enrollment-1',
      status: 'active',
      created: true,
    });

    createV2AdminClient.mockReturnValue({
      auth: {
        admin: {
          listUsers: vi.fn().mockResolvedValue({
            data: {
              users: [{ id: userId, email: 'student@example.com' }],
            },
            error: null,
          }),
          getUserById: vi.fn().mockResolvedValue({
            data: { user: { id: userId, email: 'student@example.com' } },
            error: null,
          }),
        },
      },
      from: vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { user_id: userId, display_name: 'Student One', role: 'student' },
              error: null,
            }),
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/admin/v2/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'student@example.com', action: 'grant' }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(setV2DefaultEnrollmentStatus).toHaveBeenCalledWith(expect.anything(), userId, 'active');
    expect(payload.enrollment).toEqual(
      expect.objectContaining({
        user_id: userId,
        email: 'student@example.com',
        display_name: 'Student One',
        status: 'active',
        created: true,
      })
    );
  });
});
