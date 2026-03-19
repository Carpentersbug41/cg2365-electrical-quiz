import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import {
  transitionQuestionVersionStatus,
  type QuestionUpdateAction as UpdateAction,
} from '@/lib/v2/questions/transition';

type UpdatePayload = {
  versionId?: string;
  action?: UpdateAction;
  reason?: string;
  moderation?: {
    objectivesVerified?: boolean;
    factualCheckPassed?: boolean;
    policyCheckPassed?: boolean;
    notes?: string;
  };
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

    const body = (await request.json().catch(() => ({}))) as UpdatePayload;
    const versionId = typeof body.versionId === 'string' ? body.versionId.trim() : '';
    const action = body.action;
    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 500) : null;
    const moderation = body.moderation ?? {};

    if (!versionId || !action) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'versionId and action are required.' },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const result = await transitionQuestionVersionStatus(adminClient, {
      versionId,
      action,
      actorUserId,
      moderation,
      reason,
      sourceContext: 'admin_v2',
    });
    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          code: result.code,
          message: result.message,
          ...(result.gate ? { gate: result.gate } : {}),
        },
        { status: result.status }
      );
    }

    return NextResponse.json({
      success: true,
      version: result.version,
      transition: result.transition,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
