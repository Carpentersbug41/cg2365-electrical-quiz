import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireV2Session = vi.fn();
const getV2DefaultEnrollmentAccess = vi.fn();

vi.mock('@/lib/v2/session', () => ({
  requireV2Session,
}));

vi.mock('@/lib/v2/enrollment', () => ({
  getV2DefaultEnrollmentAccess,
}));

describe('POST /api/v2/enrollment/ensure', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 403 when the signed-in user is not enrolled in V2', async () => {
    requireV2Session.mockResolvedValue({
      session: {
        client: {},
        user: { id: 'user-1' },
      },
      response: null,
    });
    getV2DefaultEnrollmentAccess.mockResolvedValue({
      ok: true,
      courseId: 'course-1',
      enrollmentId: null,
      status: null,
      hasAccess: false,
    });

    const { POST } = await import('./route');
    const response = await POST(new Request('http://localhost/api/v2/enrollment/ensure', { method: 'POST' }) as any);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({
      success: false,
      code: 'ENROLLMENT_REQUIRED',
      message: 'This account does not yet have V2 course access.',
    });
  });
});
