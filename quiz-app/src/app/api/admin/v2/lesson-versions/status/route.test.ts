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

  it('returns 409 when publish gate validation fails', async () => {
    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'v1',
          lesson_id: 'l1',
          status: 'approved',
          version_no: 2,
          is_current: false,
          source: 'ai',
          quality_score: 90,
          content_json: { id: 'BIO-104-1A' },
        },
        error: null,
      }),
    };

    const lessonQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: 'l1', code: 'BIO-104-1A', title: 'Enzymes and rates' },
        error: null,
      }),
    };

    createSupabaseAdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lesson_versions') return versionQuery;
        if (table === 'v2_lessons') return lessonQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
        method: 'POST',
        body: JSON.stringify({ versionId: 'v1', action: 'publish' }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(409);
    expect(payload.code).toBe('PUBLISH_VALIDATION_FAILED');
    expect(Array.isArray(payload.gate?.issues)).toBe(true);
  });
});
