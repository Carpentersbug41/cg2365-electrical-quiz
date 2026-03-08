import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';
import { validateLessonVersionForPublish } from '@/lib/v2/content/publishGate';

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

type VersionRow = {
  id: string;
  lesson_id: string;
  status: ContentStatus;
  version_no: number;
  is_current: boolean;
  source: 'human' | 'ai';
  quality_score: number | null;
  content_json: Record<string, unknown>;
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
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
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createSupabaseAdminClient();
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
      .from('v2_lesson_versions')
      .select('id, lesson_id, status, version_no, is_current, source, quality_score, content_json')
      .eq('id', versionId)
      .limit(1)
      .maybeSingle<VersionRow>();

    if (versionError) throw versionError;
    if (!version) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Lesson version not found.' },
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

    const { data: lesson, error: lessonError } = await adminClient
      .from('v2_lessons')
      .select('id, code, title')
      .eq('id', version.lesson_id)
      .limit(1)
      .maybeSingle<LessonRow>();
    if (lessonError) throw lessonError;
    if (!lesson) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Parent lesson not found.' },
        { status: 404 }
      );
    }

    if (action === 'approve' || action === 'publish') {
      const publishGate = validateLessonVersionForPublish({
        lessonCode: lesson.code,
        lessonTitle: lesson.title,
        qualityScore: version.quality_score,
        content: version.content_json,
      });
      if (!publishGate.ok) {
        return NextResponse.json(
          {
            success: false,
            code: 'PUBLISH_VALIDATION_FAILED',
            message: 'Lesson version failed publish gate checks.',
            gate: publishGate,
          },
          { status: 409 }
        );
      }
    }

    const nextStatus = resolveNextStatus(action);
    const nowIso = new Date().toISOString();
    const session = await getSupabaseSessionFromRequest(request);
    const actorUserId = session?.user?.id ?? null;

    if (action === 'publish') {
      const { error: retireOthersError } = await adminClient
        .from('v2_lesson_versions')
        .update({ status: 'retired', is_current: false })
        .eq('lesson_id', version.lesson_id)
        .eq('status', 'published')
        .neq('id', version.id);
      if (retireOthersError) throw retireOthersError;

      const { error: unsetCurrentError } = await adminClient
        .from('v2_lesson_versions')
        .update({ is_current: false })
        .eq('lesson_id', version.lesson_id)
        .neq('id', version.id);
      if (unsetCurrentError) throw unsetCurrentError;
    }

    const updatePayload: Record<string, unknown> = {
      status: nextStatus,
      is_current: action === 'publish',
      published_at: action === 'publish' ? nowIso : null,
    };
    if ((action === 'approve' || action === 'publish') && actorUserId) {
      updatePayload.approved_by = actorUserId;
    }

    const { data: updatedVersion, error: updateError } = await adminClient
      .from('v2_lesson_versions')
      .update(updatePayload)
      .eq('id', version.id)
      .select('id, lesson_id, status, version_no, is_current, published_at')
      .single<VersionRow & { published_at: string | null }>();
    if (updateError) throw updateError;

    if (actorUserId && (action === 'approve' || action === 'revert_draft' || action === 'publish')) {
      const decision =
        action === 'approve' ? 'approved' : action === 'publish' ? 'override_publish' : 'rejected';
      const moderationNotes =
        typeof moderation.notes === 'string' && moderation.notes.trim().length > 0
          ? moderation.notes.trim()
          : null;
      const decisionReason = [reason, moderationNotes].filter((part): part is string => Boolean(part)).join(' | ');
      const { error: decisionError } = await adminClient.from('v2_approval_decisions').insert({
        lesson_version_id: version.id,
        decided_by: actorUserId,
        decision,
        reason: decisionReason || null,
      });
      if (decisionError) {
        console.warn('[V2 Admin] Failed to record approval decision:', decisionError);
      }
    }

    const { error: eventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_lesson_version_transition',
      user_id: actorUserId,
      lesson_id: version.lesson_id,
      lesson_version_id: version.id,
      source_context: 'admin_v2',
      payload: {
        action,
        from: version.status,
        to: nextStatus,
        reason: reason || null,
        moderation: action === 'approve' || action === 'publish' ? moderation : null,
      },
    });
    if (eventError) {
      console.warn('[V2 Admin] Failed to write audit event for lesson transition:', eventError);
    }

    return NextResponse.json({
      success: true,
      version: updatedVersion,
      transition: {
        action,
        from: version.status,
        to: nextStatus,
      },
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
