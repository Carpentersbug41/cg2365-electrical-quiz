import { NextRequest, NextResponse } from 'next/server';
import {
  getGuidedChunkVersionSummary,
  loadGuidedChunkVersionFrame,
  transitionGuidedLessonVersion,
  type GuidedChunkVersionAction,
} from '@/lib/guidedChunk/versionStore';
import { validateGuidedChunkVersionForPublish } from '@/lib/guidedChunk/publishGate';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import { createV2AdminClient, getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type Payload = {
  versionId?: string;
  action?: GuidedChunkVersionAction;
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
    const body = (await request.json().catch(() => ({}))) as Payload;
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

    const current = await getGuidedChunkVersionSummary(versionId);
    if (!current) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Guided lesson version not found.' },
        { status: 404 }
      );
    }

    if (action === 'approve' || action === 'publish') {
      const objectivesVerified = moderation.objectivesVerified === true;
      const factualCheckPassed = moderation.factualCheckPassed === true;
      const policyCheckPassed = moderation.policyCheckPassed === true;
      const notes = typeof moderation.notes === 'string' ? moderation.notes.trim() : '';

      if (!objectivesVerified || !factualCheckPassed || !policyCheckPassed || notes.length < 10) {
        return NextResponse.json(
          {
            success: false,
            code: 'MODERATION_REQUIRED',
            message: 'Moderation checklist is required for approve/publish (all checks true + notes >= 10 chars).',
          },
          { status: 400 }
        );
      }
    }

    const actorUserId = await getV2ActorUserId(request);
    const versionFrame = await loadGuidedChunkVersionFrame(versionId);
    if (!versionFrame) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Guided lesson frame not found for this version.' },
        { status: 404 }
      );
    }

    if (action === 'approve' || action === 'publish') {
      const publishGate = validateGuidedChunkVersionForPublish({
        lessonCode: current.lessonCode,
        title: current.title,
        qualityScore: current.qualityScore ?? null,
        frame: versionFrame,
        validation: current.validation ?? null,
      });
      if (!publishGate.ok) {
        return NextResponse.json(
          {
            success: false,
            code: 'PUBLISH_VALIDATION_FAILED',
            message: 'Guided lesson version failed publish gate checks.',
            gate: publishGate,
          },
          { status: 409 }
        );
      }
    }

    const updated = await transitionGuidedLessonVersion({
      versionId,
      action,
      actorUserId,
    });

    const adminClient = createV2AdminClient();
    if (adminClient) {
      await adminClient.from('v2_event_log').insert({
        event_type: 'admin_guided_chunk_version_transition',
        user_id: actorUserId,
        source_context: 'admin_guided_chunk',
        payload: {
          versionId,
          action,
          from: current.status,
          to: updated.status,
          lessonCode: updated.lessonCode,
          reason: reason || null,
          moderation: action === 'approve' || action === 'publish' ? moderation : null,
        },
      });

      if (updated.status === 'published') {
        try {
          await writeV2CanonicalEvent(adminClient, {
            eventType: 'content_published',
            userId: actorUserId,
            sourceContext: 'admin_guided_chunk',
            payload: {
              contentType: 'guided_chunk_version',
              lessonCode: updated.lessonCode,
              versionId: updated.id,
              action,
            },
          });
        } catch {
          // Audit event already exists in v2_event_log. Keep publish moving if canonical event fails.
        }
      }
    }

    return NextResponse.json({
      success: true,
      version: updated,
      transition: {
        action,
        from: current.status,
        to: updated.status,
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
