import { beforeEach, describe, expect, it, vi } from 'vitest';

const guardV2AdminAccess = vi.fn();
const createV2AdminClient = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => {
  throw error;
});

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  createV2AdminClient,
  toV2AdminError,
}));

describe('POST /api/admin/v2/roles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('grants a V2 role to a known email address', async () => {
    const userId = '11111111-1111-4111-8111-111111111111';
    const upsert = vi.fn().mockResolvedValue({ error: null });

    createV2AdminClient.mockReturnValue({
      auth: {
        admin: {
          listUsers: vi.fn().mockResolvedValue({
            data: { users: [{ id: userId, email: 'operator@example.com' }] },
            error: null,
          }),
        },
      },
      from: vi.fn((table: string) => {
        if (table === 'v2_user_roles') {
          return {
            upsert,
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/admin/v2/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'operator@example.com', role: 'content_operator', action: 'grant' }),
      }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: userId,
        role: 'content_operator',
      }),
      { onConflict: 'user_id,role' }
    );
    expect(payload).toEqual(
      expect.objectContaining({
        success: true,
        userId,
        role: 'content_operator',
        action: 'grant',
      })
    );
  });
});
