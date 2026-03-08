import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

type GenerationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

type CreatePayload = {
  kind?: 'lesson_draft' | 'question_draft';
  lessonCode?: string;
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
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 5000) : '';

    if (kind === 'lesson_draft' && !lessonCode) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'lessonCode is required for lesson_draft jobs.' },
        { status: 400 }
      );
    }

    let lessonId: string | null = null;
    if (lessonCode) {
      const { data: lesson, error: lessonError } = await adminClient
        .from('v2_lessons')
        .select('id')
        .eq('code', lessonCode)
        .limit(1)
        .maybeSingle<{ id: string }>();
      if (lessonError) throw lessonError;
      if (!lesson?.id) {
        return NextResponse.json(
          { success: false, code: 'NOT_FOUND', message: `V2 lesson not found for code ${lessonCode}.` },
          { status: 404 }
        );
      }
      lessonId = lesson.id;
    }

    const session = await getSupabaseSessionFromRequest(request);
    const requestedBy = session?.user?.id ?? null;

    const { data: job, error: insertError } = await adminClient
      .from('v2_generation_jobs')
      .insert({
        kind,
        status: 'queued',
        lesson_id: lessonId,
        requested_by: requestedBy,
        payload: {
          prompt,
          lessonCode: lessonCode || null,
          requestedAt: new Date().toISOString(),
        },
      })
      .select('id, kind, status, lesson_id, payload, attempts_made, max_attempts, error_message, queued_at, started_at, finished_at, created_at')
      .single<GenerationJobRow>();

    if (insertError) throw insertError;

    const { error: eventError } = await adminClient.from('v2_event_log').insert({
      event_type: 'admin_generation_job_created',
      user_id: requestedBy,
      lesson_id: lessonId,
      source_context: 'admin_v2',
      payload: {
        jobId: job.id,
        kind,
        lessonCode: lessonCode || null,
      },
    });
    if (eventError) {
      console.warn('[V2 Admin] Failed to write generation job creation audit event:', eventError);
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
