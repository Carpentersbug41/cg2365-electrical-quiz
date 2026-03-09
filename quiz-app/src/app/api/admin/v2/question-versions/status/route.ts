import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { validateQuestionVersionForPublish } from '@/lib/v2/questions/publishGate';

type ContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
type UpdateAction = 'submit_review' | 'approve' | 'publish' | 'retire' | 'revert_draft';

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

type QuestionVersionRow = {
  id: string;
  question_id: string;
  status: ContentStatus;
  version_no: number;
  is_current: boolean;
  source: 'human' | 'ai';
  quality_score: number | null;
  stem: string;
  answer_key: unknown;
  metadata: unknown;
};

type QuestionRow = {
  id: string;
  lesson_id: string | null;
  stable_key: string;
  question_type: 'mcq' | 'short' | 'numeric' | 'other';
};

type TransitionedQuestionVersionRow = {
  id: string;
  question_id: string;
  status: ContentStatus;
  version_no: number;
  is_current: boolean;
  published_at: string | null;
};

function resolveNextStatus(action: UpdateAction): ContentStatus {
  if (action === 'submit_review') return 'needs_review';
  if (action === 'approve') return 'approved';
  if (action === 'publish') return 'published';
  if (action === 'retire') return 'retired';
  return 'draft';
}

const ALLOWED_TRANSITIONS: Record<ContentStatus, UpdateAction[]> = {
  draft: ['submit_review', 'retire'],
  needs_review: ['approve', 'revert_draft', 'retire'],
  approved: ['publish', 'revert_draft', 'retire'],
  published: ['retire'],
  retired: ['revert_draft'],
};

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request);
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

    const { data: version, error: versionError } = await adminClient
      .from('v2_question_versions')
      .select('id, question_id, status, version_no, is_current, source, quality_score, stem, answer_key, metadata')
      .eq('id', versionId)
      .limit(1)
      .maybeSingle<QuestionVersionRow>();
    if (versionError) throw versionError;
    if (!version) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Question version not found.' },
        { status: 404 }
      );
    }

    const allowedActions = ALLOWED_TRANSITIONS[version.status] ?? [];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_TRANSITION',
          message: `Action ${action} is not allowed from status ${version.status}.`,
        },
        { status: 409 }
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
            message:
              'Moderation checklist is required for approve/publish (all checks true + notes >= 10 chars).',
          },
          { status: 400 }
        );
      }
    }

    const { data: question, error: questionError } = await adminClient
      .from('v2_questions')
      .select('id, lesson_id, stable_key, question_type')
      .eq('id', version.question_id)
      .limit(1)
      .maybeSingle<QuestionRow>();
    if (questionError) throw questionError;
    if (!question) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Parent question not found.' },
        { status: 404 }
      );
    }

    if (action === 'approve' || action === 'publish') {
      const publishGate = validateQuestionVersionForPublish({
        stableKey: question.stable_key,
        stem: version.stem,
        answerKey: version.answer_key,
        metadata: version.metadata,
        qualityScore: version.quality_score,
      });
      if (!publishGate.ok) {
        return NextResponse.json(
          {
            success: false,
            code: 'PUBLISH_VALIDATION_FAILED',
            message: 'Question version failed publish gate checks.',
            gate: publishGate,
          },
          { status: 409 }
        );
      }
    }

    const nextStatus = resolveNextStatus(action);
    const actorUserId = await getV2ActorUserId(request);
    const nowIso = new Date().toISOString();

    const { data: updatedVersion, error: transitionError } = await adminClient.rpc(
      'v2_apply_question_version_transition',
      {
        target_version_id: version.id,
        target_status: nextStatus,
        actor_user_id: actorUserId,
        transition_ts: nowIso,
      }
    );
    if (transitionError) throw transitionError;
    if (!Array.isArray(updatedVersion) || updatedVersion.length === 0) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Question version not found during transition.' },
        { status: 404 }
      );
    }

    if (actorUserId && (action === 'approve' || action === 'revert_draft' || action === 'publish')) {
      const decision =
        action === 'approve' ? 'approved' : action === 'publish' ? 'override_publish' : 'rejected';
      const moderationNotes =
        typeof moderation.notes === 'string' && moderation.notes.trim().length > 0
          ? moderation.notes.trim()
          : null;
      const decisionReason = [reason, moderationNotes].filter((part): part is string => Boolean(part)).join(' | ');
      const { error: decisionError } = await adminClient.from('v2_approval_decisions').insert({
        question_version_id: version.id,
        decided_by: actorUserId,
        decision,
        reason: decisionReason || null,
      });
      if (decisionError) {
        console.warn('[V2 Admin] Failed to record question approval decision:', decisionError);
      }
    }

    const { error: eventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_question_version_transition',
      user_id: actorUserId,
      lesson_id: question.lesson_id,
      question_id: question.id,
      question_version_id: version.id,
      source_context: 'admin_v2',
      payload: {
        action,
        from: version.status,
        to: nextStatus,
        reason: reason || null,
        stableKey: question.stable_key,
        moderation: action === 'approve' || action === 'publish' ? moderation : null,
      },
    });
    if (eventError) {
      console.warn('[V2 Admin] Failed to write audit event for question transition:', eventError);
    }

    if (nextStatus === 'published') {
      const { error: publishedEventError } = await adminClient.from('v2_event_log').insert({
        event_type: 'question_content_published',
        user_id: actorUserId,
        lesson_id: question.lesson_id,
        question_id: question.id,
        question_version_id: version.id,
        source_context: 'admin_v2',
        payload: {
          stableKey: question.stable_key,
          action,
        },
      });
      if (publishedEventError) {
        console.warn('[V2 Admin] Failed to write question_content_published event:', publishedEventError);
      }
    }

    return NextResponse.json({
      success: true,
      version: updatedVersion[0] as TransitionedQuestionVersionRow,
      transition: {
        action,
        from: version.status,
        to: nextStatus,
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
