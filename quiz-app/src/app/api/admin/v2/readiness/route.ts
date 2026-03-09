import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type LessonRow = {
  id: string;
  code: string;
  title: string;
};

type LessonVersionRow = {
  lesson_id: string;
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
};

type QuestionVersionRow = {
  status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
  v2_questions?: {
    lesson_id: string | null;
  } | null;
};

type EnrollmentRow = {
  status: 'active' | 'completed' | 'withdrawn';
};

type GenerationJobRow = {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  attempts_made: number;
  max_attempts: number;
  started_at: string | null;
  finished_at: string | null;
};

type QueueRunEventRow = {
  event_ts: string;
  payload: {
    attempted?: number;
    succeeded?: number;
    failed?: number;
    skipped?: number;
  } | null;
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

    const [
      lessonsResult,
      lessonVersionsResult,
      questionVersionsResult,
      enrollmentsResult,
      generationJobsResult,
      queueRunResult,
    ] = await Promise.all([
      adminClient.from('v2_lessons').select('id, code, title').returns<LessonRow[]>(),
      adminClient.from('v2_lesson_versions').select('lesson_id, status').returns<LessonVersionRow[]>(),
      adminClient
        .from('v2_question_versions')
        .select('status, v2_questions!inner(lesson_id)')
        .eq('status', 'published')
        .eq('is_current', true)
        .returns<QuestionVersionRow[]>(),
      adminClient.from('v2_enrollments').select('status').returns<EnrollmentRow[]>(),
      adminClient
        .from('v2_generation_jobs')
        .select('id, status, attempts_made, max_attempts, started_at, finished_at')
        .returns<GenerationJobRow[]>(),
      adminClient
        .from('v2_event_log')
        .select('event_ts, payload')
        .eq('event_type', 'admin_generation_queue_run')
        .order('event_ts', { ascending: false })
        .limit(1)
        .maybeSingle<QueueRunEventRow>(),
    ]);

    if (lessonsResult.error) throw lessonsResult.error;
    if (lessonVersionsResult.error) throw lessonVersionsResult.error;
    if (questionVersionsResult.error) throw questionVersionsResult.error;
    if (enrollmentsResult.error) throw enrollmentsResult.error;
    if (generationJobsResult.error) throw generationJobsResult.error;
    if (queueRunResult.error) throw queueRunResult.error;

    const lessons = lessonsResult.data ?? [];
    const lessonVersions = lessonVersionsResult.data ?? [];
    const questionVersions = questionVersionsResult.data ?? [];
    const enrollments = enrollmentsResult.data ?? [];
    const generationJobs = generationJobsResult.data ?? [];

    const publishedLessonIds = new Set(
      lessonVersions.filter((row) => row.status === 'published').map((row) => row.lesson_id)
    );
    const questionCoveredLessonIds = new Set(
      questionVersions
        .map((row) => row.v2_questions?.lesson_id)
        .filter((lessonId): lessonId is string => Boolean(lessonId))
    );

    const lessonsMissingPublished = lessons
      .filter((lesson) => !publishedLessonIds.has(lesson.id))
      .map((lesson) => ({ id: lesson.id, code: lesson.code, title: lesson.title }));
    const lessonsMissingQuestionCoverage = lessons
      .filter((lesson) => publishedLessonIds.has(lesson.id) && !questionCoveredLessonIds.has(lesson.id))
      .map((lesson) => ({ id: lesson.id, code: lesson.code, title: lesson.title }));

    const lessonVersionsByStatus = lessonVersions.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});
    const questionVersionsByStatus = questionVersions.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});
    const enrollmentsByStatus = enrollments.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});
    const generationJobsByStatus = generationJobs.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});

    const retryExhaustedJobs = generationJobs.filter(
      (row) => row.status === 'failed' && row.attempts_made >= row.max_attempts
    ).length;
    const lastSuccessfulJobAt = generationJobs
      .filter((row) => row.status === 'succeeded' && row.finished_at)
      .map((row) => row.finished_at as string)
      .sort((a, b) => b.localeCompare(a))[0] ?? null;

    return NextResponse.json({
      success: true,
      content: {
        lessons_total: lessons.length,
        lessons_with_published_versions: publishedLessonIds.size,
        lessons_missing_published: lessonsMissingPublished,
        lessons_missing_question_coverage: lessonsMissingQuestionCoverage,
        lesson_versions_by_status: lessonVersionsByStatus,
        question_versions_by_status: questionVersionsByStatus,
      },
      access: {
        total_enrollments: enrollments.length,
        enrollments_by_status: enrollmentsByStatus,
      },
      operations: {
        generation_jobs_by_status: generationJobsByStatus,
        retry_exhausted_jobs: retryExhaustedJobs,
        last_successful_job_at: lastSuccessfulJobAt,
        last_queue_run:
          queueRunResult.data
            ? {
                event_ts: queueRunResult.data.event_ts,
                attempted: queueRunResult.data.payload?.attempted ?? 0,
                succeeded: queueRunResult.data.payload?.succeeded ?? 0,
                failed: queueRunResult.data.payload?.failed ?? 0,
                skipped: queueRunResult.data.payload?.skipped ?? 0,
              }
            : null,
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
