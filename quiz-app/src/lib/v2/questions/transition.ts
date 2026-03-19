import type { SupabaseClient } from '@supabase/supabase-js';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import { validateQuestionVersionForPublish, type QuestionPublishGateResult } from '@/lib/v2/questions/publishGate';

export type QuestionContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
export type QuestionUpdateAction = 'submit_review' | 'approve' | 'publish' | 'retire' | 'revert_draft';

export type QuestionUpdateModeration = {
  objectivesVerified?: boolean;
  factualCheckPassed?: boolean;
  policyCheckPassed?: boolean;
  notes?: string;
};

export type QuestionVersionRow = {
  id: string;
  question_id: string;
  status: QuestionContentStatus;
  version_no: number;
  is_current: boolean;
  source: 'human' | 'ai';
  quality_score: number | null;
  stem: string;
  answer_key: unknown;
  metadata: unknown;
};

export type QuestionRow = {
  id: string;
  lesson_id: string | null;
  stable_key: string;
  question_type: 'mcq' | 'short' | 'numeric' | 'other';
};

export type TransitionedQuestionVersionRow = {
  id: string;
  question_id: string;
  status: QuestionContentStatus;
  version_no: number;
  is_current: boolean;
  published_at: string | null;
};

export type TransitionQuestionVersionResult =
  | {
      ok: true;
      version: TransitionedQuestionVersionRow;
      transition: {
        action: QuestionUpdateAction;
        from: QuestionContentStatus;
        to: QuestionContentStatus;
      };
    }
  | {
      ok: false;
      code: string;
      status: number;
      message: string;
      gate?: QuestionPublishGateResult;
    };

const ALLOWED_TRANSITIONS: Record<QuestionContentStatus, QuestionUpdateAction[]> = {
  draft: ['submit_review', 'retire'],
  needs_review: ['approve', 'revert_draft', 'retire'],
  approved: ['publish', 'revert_draft', 'retire'],
  published: ['retire'],
  retired: ['revert_draft'],
};

function resolveNextStatus(action: QuestionUpdateAction): QuestionContentStatus {
  if (action === 'submit_review') return 'needs_review';
  if (action === 'approve') return 'approved';
  if (action === 'publish') return 'published';
  if (action === 'retire') return 'retired';
  return 'draft';
}

export async function transitionQuestionVersionStatus(
  adminClient: SupabaseClient,
  input: {
    versionId: string;
    action: QuestionUpdateAction;
    actorUserId: string | null;
    moderation?: QuestionUpdateModeration;
    reason?: string | null;
    sourceContext?: string;
  }
): Promise<TransitionQuestionVersionResult> {
  const sourceContext = input.sourceContext ?? 'admin_v2';
  const reason = typeof input.reason === 'string' ? input.reason.trim().slice(0, 500) : null;
  const moderation = input.moderation ?? {};

  const { data: version, error: versionError } = await adminClient
    .from('v2_question_versions')
    .select('id, question_id, status, version_no, is_current, source, quality_score, stem, answer_key, metadata')
    .eq('id', input.versionId)
    .limit(1)
    .maybeSingle<QuestionVersionRow>();
  if (versionError) throw versionError;
  if (!version) {
    return {
      ok: false,
      code: 'NOT_FOUND',
      status: 404,
      message: 'Question version not found.',
    };
  }

  const allowedActions = ALLOWED_TRANSITIONS[version.status] ?? [];
  if (!allowedActions.includes(input.action)) {
    return {
      ok: false,
      code: 'INVALID_TRANSITION',
      status: 409,
      message: `Action ${input.action} is not allowed from status ${version.status}.`,
    };
  }

  if (input.action === 'approve' || input.action === 'publish') {
    const objectivesVerified = moderation.objectivesVerified === true;
    const factualCheckPassed = moderation.factualCheckPassed === true;
    const policyCheckPassed = moderation.policyCheckPassed === true;
    const notes = typeof moderation.notes === 'string' ? moderation.notes.trim() : '';

    if (!objectivesVerified || !factualCheckPassed || !policyCheckPassed || notes.length < 10) {
      return {
        ok: false,
        code: 'MODERATION_REQUIRED',
        status: 400,
        message: 'Moderation checklist is required for approve/publish (all checks true + notes >= 10 chars).',
      };
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
    return {
      ok: false,
      code: 'NOT_FOUND',
      status: 404,
      message: 'Parent question not found.',
    };
  }

  if (input.action === 'approve' || input.action === 'publish') {
    const publishGate = validateQuestionVersionForPublish({
      stableKey: question.stable_key,
      stem: version.stem,
      answerKey: version.answer_key,
      metadata: version.metadata,
      qualityScore: version.quality_score,
    });
    if (!publishGate.ok) {
      return {
        ok: false,
        code: 'PUBLISH_VALIDATION_FAILED',
        status: 409,
        message: 'Question version failed publish gate checks.',
        gate: publishGate,
      };
    }
  }

  const nextStatus = resolveNextStatus(input.action);
  const nowIso = new Date().toISOString();

  const { data: updatedVersion, error: transitionError } = await adminClient.rpc(
    'v2_apply_question_version_transition',
    {
      target_version_id: version.id,
      target_status: nextStatus,
      actor_user_id: input.actorUserId,
      transition_ts: nowIso,
    }
  );
  if (transitionError) throw transitionError;
  if (!Array.isArray(updatedVersion) || updatedVersion.length === 0) {
    return {
      ok: false,
      code: 'NOT_FOUND',
      status: 404,
      message: 'Question version not found during transition.',
    };
  }

  if (input.actorUserId && (input.action === 'approve' || input.action === 'revert_draft' || input.action === 'publish')) {
    const decision =
      input.action === 'approve' ? 'approved' : input.action === 'publish' ? 'override_publish' : 'rejected';
    const moderationNotes =
      typeof moderation.notes === 'string' && moderation.notes.trim().length > 0
        ? moderation.notes.trim()
        : null;
    const decisionReason = [reason, moderationNotes].filter((part): part is string => Boolean(part)).join(' | ');
    const { error: decisionError } = await adminClient.from('v2_approval_decisions').insert({
      question_version_id: version.id,
      decided_by: input.actorUserId,
      decision,
      reason: decisionReason || null,
    });
    if (decisionError) {
      console.warn('[V2 Admin] Failed to record question approval decision:', decisionError);
    }
  }

  const { error: eventError } = await adminClient.from('v2_event_log').insert({
    event_type: 'admin_question_version_transition',
    user_id: input.actorUserId,
    lesson_id: question.lesson_id,
    question_id: question.id,
    question_version_id: version.id,
    source_context: sourceContext,
    payload: {
      action: input.action,
      from: version.status,
      to: nextStatus,
      reason: reason || null,
      stableKey: question.stable_key,
      moderation: input.action === 'approve' || input.action === 'publish' ? moderation : null,
    },
  });
  if (eventError) {
    console.warn('[V2 Admin] Failed to write audit event for question transition:', eventError);
  }

  if (nextStatus === 'published') {
    try {
      await writeV2CanonicalEvent(adminClient, {
        eventType: 'content_published',
        userId: input.actorUserId,
        lessonId: question.lesson_id,
        questionId: question.id,
        questionVersionId: version.id,
        sourceContext,
        payload: {
          contentType: 'question_version',
          stableKey: question.stable_key,
          action: input.action,
        },
      });
    } catch (publishedEventError) {
      console.warn('[V2 Admin] Failed to write content_published event for question version:', publishedEventError);
    }
  }

  return {
    ok: true,
    version: updatedVersion[0] as TransitionedQuestionVersionRow,
    transition: {
      action: input.action,
      from: version.status,
      to: nextStatus,
    },
  };
}
