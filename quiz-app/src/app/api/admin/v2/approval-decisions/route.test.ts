import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
}));

describe('GET /api/admin/v2/approval-decisions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns denied response when access guard blocks', async () => {
    guardV2AdminAccess.mockResolvedValue(
      Response.json({ success: false, code: 'FORBIDDEN' }, { status: 403 })
    );
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/approval-decisions'));
    expect(response.status).toBe(403);
  });

  it('returns 503 when admin client is unavailable', async () => {
    createV2AdminClient.mockReturnValue(null);
    const { GET } = await import('./route');
    const response = await GET(new NextRequest('http://localhost/api/admin/v2/approval-decisions'));
    expect(response.status).toBe(503);
  });
});
