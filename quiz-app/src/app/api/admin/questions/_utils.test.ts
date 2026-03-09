import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const isAdminRequest = vi.fn();

vi.mock('@/lib/auth/roles', () => ({
  isAdminRequest,
}));

vi.mock('@/lib/questions/bankRepo', () => ({
  getQuestionById: vi.fn(),
}));

describe('guardQuestionAdminAccess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.QUESTION_ADMIN_TOKEN;
    delete process.env.MODULE_PLANNER_ADMIN_TOKEN;
  });

  it('allows signed-in admins even when question admin token is configured', async () => {
    process.env.QUESTION_ADMIN_TOKEN = 'expected-token';
    isAdminRequest.mockResolvedValue(true);

    const { guardQuestionAdminAccess } = await import('./_utils');
    const denied = await guardQuestionAdminAccess(
      new NextRequest('http://localhost/api/admin/questions/items')
    );

    expect(denied).toBeNull();
  });

  it('rejects non-admin requests when configured token is missing', async () => {
    process.env.QUESTION_ADMIN_TOKEN = 'expected-token';
    isAdminRequest.mockResolvedValue(false);

    const { guardQuestionAdminAccess } = await import('./_utils');
    const denied = await guardQuestionAdminAccess(
      new NextRequest('http://localhost/api/admin/questions/items')
    );

    expect(denied?.status).toBe(401);
  });
});
