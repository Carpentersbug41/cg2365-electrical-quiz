import { describe, expect, it, vi } from 'vitest';
import { getV2DefaultEnrollmentAccess, setV2DefaultEnrollmentStatus } from './enrollment';

function createSelectChain(result: unknown) {
  return {
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: result, error: null }),
    single: vi.fn().mockResolvedValue({ data: result, error: null }),
  };
}

describe('v2 enrollment helpers', () => {
  it('returns hasAccess false when the user is not enrolled', async () => {
    const courseSelect = createSelectChain({ id: 'course-1' });
    const enrollmentSelect = createSelectChain(null);

    const client = {
      from: vi.fn((table: string) => {
        if (table === 'v2_courses') return { select: vi.fn(() => courseSelect) };
        if (table === 'v2_enrollments') return { select: vi.fn(() => enrollmentSelect) };
        throw new Error(`Unexpected table ${table}`);
      }),
    } as any;

    const result = await getV2DefaultEnrollmentAccess(client, 'user-1');

    expect(result).toEqual({
      ok: true,
      courseId: 'course-1',
      enrollmentId: null,
      status: null,
      hasAccess: false,
    });
  });

  it('grants an active enrollment when requested explicitly', async () => {
    const courseSelect = createSelectChain({ id: 'course-1' });
    const enrollmentSelect = createSelectChain(null);
    const insertSelect = {
      single: vi.fn().mockResolvedValue({
        data: { id: 'enrollment-1', status: 'active' },
        error: null,
      }),
    };

    const client = {
      from: vi.fn((table: string) => {
        if (table === 'v2_courses') return { select: vi.fn(() => courseSelect) };
        if (table === 'v2_enrollments') {
          return {
            select: vi.fn(() => enrollmentSelect),
            insert: vi.fn(() => ({ select: vi.fn(() => insertSelect) })),
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    } as any;

    const result = await setV2DefaultEnrollmentStatus(client, 'user-1', 'active');

    expect(result).toEqual({
      ok: true,
      courseId: 'course-1',
      enrollmentId: 'enrollment-1',
      status: 'active',
      created: true,
    });
  });
});
