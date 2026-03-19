import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import {
  transitionQuestionVersionStatus,
  type QuestionUpdateAction as UpdateAction,
  type QuestionUpdateModeration,
} from '@/lib/v2/questions/transition';

type BulkUpdatePayload = {
  versionIds?: string[];
  action?: UpdateAction;
  reason?: string;
  moderation?: QuestionUpdateModeration;
};

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as BulkUpdatePayload;
    const action = body.action;
    const versionIds = Array.isArray(body.versionIds)
      ? Array.from(
          new Set(
            body.versionIds
              .map((value) => (typeof value === 'string' ? value.trim() : ''))
              .filter((value) => value.length > 0)
          )
        )
      : [];
    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 500) : null;
    const moderation = body.moderation ?? {};

    if (!action || versionIds.length === 0) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'versionIds and action are required.' },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const succeeded: Array<{ versionId: string; status: string; transition: { action: string; from: string; to: string } }> = [];
    const failed: Array<{ versionId: string; code: string; message: string }> = [];

    for (const versionId of versionIds) {
      const result = await transitionQuestionVersionStatus(adminClient, {
        versionId,
        action,
        actorUserId,
        moderation,
        reason,
        sourceContext: 'admin_v2_bulk',
      });

      if (result.ok) {
        succeeded.push({
          versionId: result.version.id,
          status: result.version.status,
          transition: result.transition,
        });
      } else {
        failed.push({
          versionId,
          code: result.code,
          message: result.message,
        });
      }
    }

    return NextResponse.json({
      success: failed.length === 0,
      action,
      requested: versionIds.length,
      succeeded,
      failed,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
