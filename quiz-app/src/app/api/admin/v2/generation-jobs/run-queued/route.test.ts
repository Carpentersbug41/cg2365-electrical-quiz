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

vi.mock('@/lib/v2/generation/runGenerationJob', () => ({
  GenerationJobError: class extends Error {},
  runGenerationJobById: vi.fn(),
}));

describe('POST /api/admin/v2/generation-jobs/run-queued', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.V2_GENERATION_CRON_SECRET;
    guardUserAdminAccess.mockResolvedValue(null);
  });

  it('returns denied response for non-admin requests without cron secret', async () => {
    guardUserAdminAccess.mockResolvedValue(
      Response.json({ success: false, code: 'FORBIDDEN' }, { status: 403 })
    );
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs/run-queued', {
      method: 'POST',
    }));

    expect(response.status).toBe(403);
  });

  it('returns 503 when admin client is unavailable (cron auth path)', async () => {
    process.env.V2_GENERATION_CRON_SECRET = 'secret-1';
    createSupabaseAdminClient.mockReturnValue(null);
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/generation-jobs/run-queued', {
      method: 'POST',
      headers: {
        'x-cron-secret': 'secret-1',
      },
      body: JSON.stringify({ limit: 2 }),
    }));

    expect(response.status).toBe(503);
  });
});
