import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const isAdminRequest = vi.fn();

vi.mock('@/lib/auth/roles', () => ({
  isAdminRequest,
}));

describe('guardUserAdminAccess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.USER_ADMIN_TOKEN;
    delete process.env.QUESTION_ADMIN_TOKEN;
    delete process.env.MODULE_PLANNER_ADMIN_TOKEN;
  });

  it('allows signed-in admins even when an admin token is configured', async () => {
    process.env.USER_ADMIN_TOKEN = 'expected-token';
    isAdminRequest.mockResolvedValue(true);

    const { guardUserAdminAccess } = await import('./_utils');
    const denied = await guardUserAdminAccess(
      new NextRequest('http://localhost/api/admin/v2/generation-jobs')
    );

    expect(denied).toBeNull();
    expect(isAdminRequest).toHaveBeenCalled();
  });

  it('rejects non-admin requests when token is configured and not provided', async () => {
    process.env.USER_ADMIN_TOKEN = 'expected-token';
    isAdminRequest.mockResolvedValue(false);

    const { guardUserAdminAccess } = await import('./_utils');
    const denied = await guardUserAdminAccess(
      new NextRequest('http://localhost/api/admin/v2/generation-jobs')
    );

    expect(denied?.status).toBe(401);
  });
});
