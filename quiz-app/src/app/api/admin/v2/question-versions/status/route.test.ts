import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const guardV2AdminAccess = vi.fn();
const toV2AdminError = vi.fn((error: unknown) => Response.json({ success: false, error }, { status: 500 }));
const createV2AdminClient = vi.fn();
const getV2ActorUserId = vi.fn();

vi.mock('@/lib/v2/admin/api', () => ({
  guardV2AdminAccess,
  toV2AdminError,
  createV2AdminClient,
  getV2ActorUserId,
}));

describe('POST /api/admin/v2/question-versions/status', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    guardV2AdminAccess.mockResolvedValue(null);
    getV2ActorUserId.mockResolvedValue('admin-user');
  });

  it('returns 400 when versionId/action are missing', async () => {
    createV2AdminClient.mockReturnValue({});
    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/question-versions/status', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    );
    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.code).toBe('INVALID_INPUT');
  });

  it('blocks publish when the question publish gate fails', async () => {
    const versionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'version-1',
          question_id: 'question-1',
          status: 'approved',
          version_no: 2,
          is_current: true,
          source: 'ai',
          quality_score: 60,
          stem: 'short',
          answer_key: {},
        },
        error: null,
      }),
    };

    const questionQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'question-1',
          lesson_id: 'lesson-1',
          stable_key: 'BIO-101-1A:practice:1',
          question_type: 'short',
        },
        error: null,
      }),
    };

    createV2AdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'v2_question_versions') return versionQuery;
        if (table === 'v2_questions') return questionQuery;
        if (table === 'v2_event_log') return { insert: vi.fn().mockResolvedValue({ error: null }) };
        throw new Error(`Unexpected table ${table}`);
      }),
      rpc: vi.fn(),
    });

    const { POST } = await import('./route');
    const response = await POST(
      new NextRequest('http://localhost/api/admin/v2/question-versions/status', {
        method: 'POST',
        body: JSON.stringify({
          versionId: 'version-1',
          action: 'publish',
          moderation: {
            objectivesVerified: true,
            factualCheckPassed: true,
            policyCheckPassed: true,
            notes: 'Checked for question quality and correctness.',
          },
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.code).toBe('PUBLISH_VALIDATION_FAILED');
    expect(payload.gate.ok).toBe(false);
  });
});
