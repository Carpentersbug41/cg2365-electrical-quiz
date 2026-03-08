import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const getV2ActorUserId = vi.fn(async () => null);

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
  getV2ActorUserId,
}));

describe('POST /api/admin/v2/lesson-versions/status', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
  });

  it('returns 400 when versionId/action are missing', async () => {
    createV2AdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
      method: 'POST',
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(400);
  });

  it('returns 503 when admin client is unavailable', async () => {
    createV2AdminClient.mockReturnValue(null);
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

    createV2AdminClient.mockReturnValue({
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
        body: JSON.stringify({
          versionId: 'v1',
          action: 'publish',
          moderation: {
            objectivesVerified: true,
            factualCheckPassed: true,
            policyCheckPassed: true,
            notes: 'QA verified and approved for publish.',
          },
        }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(409);
    expect(payload.code).toBe('PUBLISH_VALIDATION_FAILED');
    expect(Array.isArray(payload.gate?.issues)).toBe(true);
  });

  it('returns 400 when moderation checklist is missing for approve', async () => {
    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'v1',
          lesson_id: 'l1',
          status: 'needs_review',
          version_no: 2,
          is_current: false,
          source: 'ai',
          quality_score: 90,
          content_json: {},
        },
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lesson_versions') return versionQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });
    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
        method: 'POST',
        body: JSON.stringify({ versionId: 'v1', action: 'approve' }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.code).toBe('MODERATION_REQUIRED');
  });

  it('returns 404 for a missing version before moderation validation', async () => {
    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_lesson_versions') return versionQuery;
        throw new Error(`Unexpected table ${table}`);
      }),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/lesson-versions/status', {
        method: 'POST',
        body: JSON.stringify({ versionId: 'missing', action: 'approve' }),
      })
    );

    const payload = await response.json();
    expect(response.status).toBe(404);
    expect(payload.code).toBe('NOT_FOUND');
  });
});
