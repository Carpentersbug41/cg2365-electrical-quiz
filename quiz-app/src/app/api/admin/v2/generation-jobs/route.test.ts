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

describe('POST /api/admin/v2/generation-jobs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardUserAdminAccess.mockResolvedValue(null);
  });

  it('returns 400 when lessonCode is missing for lesson_draft', async () => {
    createSupabaseAdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs', {
      method: 'POST',
      body: JSON.stringify({ kind: 'lesson_draft', lessonCode: '' }),
    }));

    expect(response.status).toBe(400);
  });

  it('returns 400 for unsupported question_draft jobs', async () => {
    createSupabaseAdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs', {
      method: 'POST',
      body: JSON.stringify({ kind: 'question_draft' }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.code).toBe('NOT_IMPLEMENTED');
  });

  it('returns 503 when admin client is unavailable', async () => {
    createSupabaseAdminClient.mockReturnValue(null);
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/generation-jobs'));

    expect(response.status).toBe(503);
  });
});
