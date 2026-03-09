import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type ApprovalDecisionRow = {
  id: string;
  lesson_version_id: string | null;
  decided_by: string;
  decision: 'approved' | 'rejected' | 'override_publish';
  reason: string | null;
  created_at: string;
};

type LessonVersionRow = {
  id: string;
  lesson_id: string;
  version_no: number;
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
};

type ProfileRow = {
  user_id: string;
  display_name: string | null;
};

export async function GET(request: NextRequest) {
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

    const limitRaw = Number.parseInt(request.nextUrl.searchParams.get('limit') ?? '', 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, limitRaw)) : 100;
    const decisionFilter = (request.nextUrl.searchParams.get('decision') ?? '').trim();
    const reviewerFilter = (request.nextUrl.searchParams.get('reviewerId') ?? '').trim();
    const lessonCodeFilter = (request.nextUrl.searchParams.get('lessonCode') ?? '').trim().toLowerCase();
    const dateFrom = (request.nextUrl.searchParams.get('dateFrom') ?? '').trim();
    const dateTo = (request.nextUrl.searchParams.get('dateTo') ?? '').trim();
    let constrainedLessonVersionIds: string[] | null = null;

    if (lessonCodeFilter) {
      const { data: matchingLessons, error: matchingLessonsError } = await adminClient
        .from('v2_lessons')
        .select('id')
        .ilike('code', `%${lessonCodeFilter}%`)
        .returns<Array<{ id: string }>>();
      if (matchingLessonsError) throw matchingLessonsError;

      const lessonIds = (matchingLessons ?? []).map((lesson) => lesson.id);
      if (lessonIds.length === 0) {
        return NextResponse.json({ success: true, decisions: [] });
      }

      const { data: matchingVersions, error: matchingVersionsError } = await adminClient
        .from('v2_lesson_versions')
        .select('id')
        .in('lesson_id', lessonIds)
        .returns<Array<{ id: string }>>();
      if (matchingVersionsError) throw matchingVersionsError;

      constrainedLessonVersionIds = (matchingVersions ?? []).map((version) => version.id);
      if (constrainedLessonVersionIds.length === 0) {
        return NextResponse.json({ success: true, decisions: [] });
      }
    }

    let decisionsQuery = adminClient
      .from('v2_approval_decisions')
      .select('id, lesson_version_id, decided_by, decision, reason, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (decisionFilter) {
      decisionsQuery = decisionsQuery.eq('decision', decisionFilter);
    }
    if (reviewerFilter) {
      decisionsQuery = decisionsQuery.eq('decided_by', reviewerFilter);
    }
    if (constrainedLessonVersionIds) {
      decisionsQuery = decisionsQuery.in('lesson_version_id', constrainedLessonVersionIds);
    }
    if (dateFrom) {
      decisionsQuery = decisionsQuery.gte('created_at', dateFrom);
    }
    if (dateTo) {
      decisionsQuery = decisionsQuery.lte('created_at', dateTo);
    }

    const { data: decisionsData, error: decisionsError } = await decisionsQuery.returns<ApprovalDecisionRow[]>();
    if (decisionsError) throw decisionsError;

    const decisions = decisionsData ?? [];
    const lessonVersionIds = Array.from(
      new Set(decisions.map((decision) => decision.lesson_version_id).filter((id): id is string => Boolean(id)))
    );
    const userIds = Array.from(new Set(decisions.map((decision) => decision.decided_by)));

    const versionById = new Map<string, LessonVersionRow>();
    if (lessonVersionIds.length > 0) {
      const { data: versionsData, error: versionsError } = await adminClient
        .from('v2_lesson_versions')
        .select('id, lesson_id, version_no, status')
        .in('id', lessonVersionIds)
        .returns<LessonVersionRow[]>();
      if (versionsError) throw versionsError;
      for (const row of versionsData ?? []) {
        versionById.set(row.id, row);
      }
    }

    const lessonIds = Array.from(
      new Set(
        Array.from(versionById.values())
          .map((version) => version.lesson_id)
          .filter((id): id is string => Boolean(id))
      )
    );
    const lessonById = new Map<string, LessonRow>();
    if (lessonIds.length > 0) {
      const { data: lessonsData, error: lessonsError } = await adminClient
        .from('v2_lessons')
        .select('id, code, title')
        .in('id', lessonIds)
        .returns<LessonRow[]>();
      if (lessonsError) throw lessonsError;
      for (const row of lessonsData ?? []) {
        lessonById.set(row.id, row);
      }
    }

    const profileById = new Map<string, ProfileRow>();
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await adminClient
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds)
        .returns<ProfileRow[]>();
      if (profilesError) throw profilesError;
      for (const row of profilesData ?? []) {
        profileById.set(row.user_id, row);
      }
    }

    const filteredDecisions = decisions
      .map((decision) => {
        const version = decision.lesson_version_id ? versionById.get(decision.lesson_version_id) ?? null : null;
        const lesson = version ? lessonById.get(version.lesson_id) ?? null : null;
        const profile = profileById.get(decision.decided_by) ?? null;
        return {
          ...decision,
          reviewer: {
            user_id: decision.decided_by,
            display_name: profile?.display_name ?? null,
          },
          lesson_version: version
            ? {
                id: version.id,
                version_no: version.version_no,
                status: version.status,
              }
            : null,
          lesson: lesson
            ? {
                id: lesson.id,
                code: lesson.code,
                title: lesson.title,
              }
            : null,
        };
      });

    return NextResponse.json({
      success: true,
      decisions: filteredDecisions,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
