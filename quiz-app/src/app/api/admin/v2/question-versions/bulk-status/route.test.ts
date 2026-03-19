import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const getV2ActorUserId = vi.fn();
const transitionQuestionVersionStatus = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
  getV2ActorUserId,
}));

vi.mock('@/lib/v2/questions/transition', () => ({
  transitionQuestionVersionStatus,
}));

describe('POST /api/admin/v2/question-versions/bulk-status', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
    getV2ActorUserId.mockResolvedValue('admin-user');
    createV2AdminClient.mockReturnValue({});
  });

  it('returns 400 when versionIds/action are missing', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/question-versions/bulk-status', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    );
    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.code).toBe('INVALID_INPUT');
  });

  it('returns partial failures without aborting the whole batch', async () => {
    transitionQuestionVersionStatus
      .mockResolvedValueOnce({
        ok: true,
        version: { id: 'version-1', status: 'approved' },
        transition: { action: 'approve', from: 'needs_review', to: 'approved' },
      })
      .mockResolvedValueOnce({
        ok: false,
        code: 'PUBLISH_VALIDATION_FAILED',
        status: 409,
        message: 'Question version failed publish gate checks.',
      });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/question-versions/bulk-status', {
        method: 'POST',
        body: JSON.stringify({
          versionIds: ['version-1', 'version-2'],
          action: 'approve',
          moderation: {
            objectivesVerified: true,
            factualCheckPassed: true,
            policyCheckPassed: true,
            notes: 'Batch moderation evidence recorded.',
          },
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(false);
    expect(payload.succeeded).toHaveLength(1);
    expect(payload.failed).toEqual([
      {
        versionId: 'version-2',
        code: 'PUBLISH_VALIDATION_FAILED',
        message: 'Question version failed publish gate checks.',
      },
    ]);
  });
});
