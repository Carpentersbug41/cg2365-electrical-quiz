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

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseSessionFromRequest: vi.fn(async () => null),
}));

describe('POST /api/admin/v2/lesson-versions/status', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardUserAdminAccess.mockResolvedValue(null);
  });

  it('returns 400 when versionId/action are missing', async () => {
    createSupabaseAdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
      method: 'POST',
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(400);
  });

  it('returns 503 when admin client is unavailable', async () => {
    createSupabaseAdminClient.mockReturnValue(null);
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
      method: 'POST',
      body: JSON.stringify({ versionId: 'v1', action: 'approve' }),
    }));

    expect(response.status).toBe(503);
  });
});
