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

describe('GET /api/admin/v2/approval-decisions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardUserAdminAccess.mockResolvedValue(null);
  });

  it('returns denied response when access guard blocks', async () => {
    guardUserAdminAccess.mockResolvedValue(
      Response.json({ success: false, code: 'FORBIDDEN' }, { status: 403 })
    );
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/approval-decisions'));
    expect(response.status).toBe(403);
  });

  it('returns 503 when admin client is unavailable', async () => {
    createSupabaseAdminClient.mockReturnValue(null);
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/approval-decisions'));
    expect(response.status).toBe(503);
  });
});
