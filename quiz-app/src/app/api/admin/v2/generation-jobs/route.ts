import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

type GenerationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

type CreatePayload = {
  kind?: 'lesson_draft' | 'question_draft';
  lessonCode?: string;
  lessonCodes?: string[];
  prompt?: string;
};

type GenerationJobRow = {
  id: string;
  kind: 'lesson_draft' | 'question_draft';
  status: GenerationStatus;
  lesson_id: string | null;
  payload: Record<string, unknown>;
  attempts_made: number;
  max_attempts: number;
  error_message: string | null;
  queued_at: string;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
};

type LessonLookupRow = {
  id: string;
  code: string;
  title: string;
};

export async function GET(request: NextRequest) {
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

    const status = request.nextUrl.searchParams.get('status')?.trim() ?? '';
    let query = adminClient
      .from('v2_generation_jobs')
      .select('id, kind, status, lesson_id, payload, attempts_made, max_attempts, error_message, queued_at, started_at, finished_at, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.returns<GenerationJobRow[]>();
    if (error) throw error;
    const jobs = data ?? [];

    const lessonIds = Array.from(
      new Set(jobs.map((job) => job.lesson_id).filter((id): id is string => Boolean(id)))
    );

    const lessonById = new Map<string, LessonLookupRow>();
    if (lessonIds.length > 0) {
      const { data: lessons, error: lessonsError } = await adminClient
        .from('v2_lessons')
        .select('id, code, title')
        .in('id', lessonIds)
        .returns<LessonLookupRow[]>();
      if (lessonsError) throw lessonsError;
      for (const lesson of lessons ?? []) {
        lessonById.set(lesson.id, lesson);
      }
    }

    return NextResponse.json({
      success: true,
      jobs: jobs.map((job) => ({
        ...job,
        lesson: job.lesson_id ? lessonById.get(job.lesson_id) ?? null : null,
      })),
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}

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

    const body = (await request.json().catch(() => ({}))) as CreatePayload;
    const kind = body.kind === 'question_draft' ? 'question_draft' : 'lesson_draft';
    const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode.trim() : '';
    const lessonCodes = Array.isArray(body.lessonCodes)
      ? body.lessonCodes
          .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
          .filter((entry) => entry.length > 0)
      : [];
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 5000) : '';

    const effectiveLessonCodes = kind === 'lesson_draft'
      ? Array.from(new Set([lessonCode, ...lessonCodes].filter((entry) => entry.length > 0)))
      : [];

    if (kind === 'lesson_draft' && effectiveLessonCodes.length === 0) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'lessonCode or lessonCodes is required for lesson_draft jobs.' },
        { status: 400 }
      );
    }

    const lessonCodeToId = new Map<string, string>();
    if (effectiveLessonCodes.length > 0) {
      const { data: lessons, error: lessonsError } = await adminClient
        .from('v2_lessons')
        .select('id, code')
        .in('code', effectiveLessonCodes)
        .returns<Array<{ id: string; code: string }>>();
      if (lessonsError) throw lessonsError;
      for (const lesson of lessons ?? []) {
        lessonCodeToId.set(lesson.code, lesson.id);
      }

      const missingCodes = effectiveLessonCodes.filter((code) => !lessonCodeToId.has(code));
      if (missingCodes.length > 0) {
        return NextResponse.json(
          {
            success: false,
            code: 'NOT_FOUND',
            message: `V2 lesson not found for code(s): ${missingCodes.join(', ')}.`,
          },
          { status: 404 }
        );
      }
    }

    const session = await getSupabaseSessionFromRequest(request);
    const requestedBy = session?.user?.id ?? null;

    const targetLessonIds = effectiveLessonCodes.map((code) => lessonCodeToId.get(code)!).filter(Boolean);
    if (targetLessonIds.length > 0) {
      const { data: existingJobs, error: existingError } = await adminClient
        .from('v2_generation_jobs')
        .select('id, lesson_id, status')
        .in('lesson_id', targetLessonIds)
        .in('status', ['queued', 'running'])
        .returns<Array<{ id: string; lesson_id: string | null; status: GenerationStatus }>>();
      if (existingError) throw existingError;
      const activeLessonIds = new Set(
        (existingJobs ?? [])
          .map((row) => row.lesson_id)
          .filter((id): id is string => Boolean(id))
      );
      for (const code of Array.from(lessonCodeToId.keys())) {
        const id = lessonCodeToId.get(code);
        if (id && activeLessonIds.has(id)) {
          lessonCodeToId.delete(code);
        }
      }
    }

    const insertRows = (kind === 'lesson_draft' ? Array.from(lessonCodeToId.entries()) : [[null, null] as const]).map(
      ([code, id]) => ({
        kind,
        status: 'queued' as GenerationStatus,
        lesson_id: id,
        requested_by: requestedBy,
        payload: {
          prompt,
          lessonCode: code,
          requestedAt: new Date().toISOString(),
        },
      })
    );

    if (insertRows.length === 0) {
      return NextResponse.json({
        success: true,
        jobs: [],
        skipped: effectiveLessonCodes,
        message: 'No jobs queued because active jobs already exist for the selected lessons.',
      });
    }

    const { data: jobs, error: insertError } = await adminClient
      .from('v2_generation_jobs')
      .insert(insertRows)
      .select('id, kind, status, lesson_id, payload, attempts_made, max_attempts, error_message, queued_at, started_at, finished_at, created_at')
      .returns<GenerationJobRow[]>();
    if (insertError) throw insertError;

    const { error: eventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_job_created',
      user_id: requestedBy,
      lesson_id: null,
      source_context: 'admin_v2',
      payload: {
        jobIds: (jobs ?? []).map((row) => row.id),
        kind,
        lessonCodes: effectiveLessonCodes,
      },
    });
    if (eventError) {
      console.warn('[V2 Admin] Failed to write generation job creation audit event:', eventError);
    }

    return NextResponse.json({
      success: true,
      jobs: jobs ?? [],
      skipped: effectiveLessonCodes.filter((code) => !lessonCodeToId.has(code)),
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
