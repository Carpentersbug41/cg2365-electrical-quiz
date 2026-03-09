import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { GCSE_BIOLOGY_PHASE1_TARGET } from '@/data/v2/gcse/biology/phase1Target';

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
  kind: 'lesson_draft' | 'question_draft';
  lesson_id: string | null;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  attempts_made: number;
  max_attempts: number;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  error_message?: string | null;
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

function getBiologySourceLessonCodes(): Set<string> {
  const baseDir = path.join(process.cwd(), 'src', 'data', 'v2', 'gcse', 'biology');
  if (!fs.existsSync(baseDir)) return new Set();

  return new Set(
    fs
      .readdirSync(baseDir)
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace(/\.json$/i, '').toUpperCase())
  );
}

function toAgeMinutes(iso: string | null): number | null {
  if (!iso) return null;
  const ageMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return null;
  return Math.round(ageMs / 60000);
}

const STUCK_RUNNING_THRESHOLD_MINUTES = 20;
const STALE_QUEUED_THRESHOLD_MINUTES = 30;
const STALE_QUEUE_RUN_THRESHOLD_MINUTES = 90;

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
        .select('id, kind, lesson_id, status, attempts_made, max_attempts, created_at, started_at, finished_at, error_message')
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
    const biologySourceLessonCodes = getBiologySourceLessonCodes();

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
    const lessonBacklog = {
      draft: lessonVersions.filter((row) => row.status === 'draft').length,
      needs_review: lessonVersions.filter((row) => row.status === 'needs_review').length,
      approved: lessonVersions.filter((row) => row.status === 'approved').length,
    };
    const questionBacklog = {
      draft: questionVersions.filter((row) => row.status === 'draft').length,
      needs_review: questionVersions.filter((row) => row.status === 'needs_review').length,
      approved: questionVersions.filter((row) => row.status === 'approved').length,
    };

    const retryExhaustedJobs = generationJobs.filter(
      (row) => row.status === 'failed' && row.attempts_made >= row.max_attempts
    ).length;
    const lastSuccessfulJobAt = generationJobs
      .filter((row) => row.status === 'succeeded' && row.finished_at)
      .map((row) => row.finished_at as string)
      .sort((a, b) => b.localeCompare(a))[0] ?? null;
    const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
    const stuckRunningJobs = generationJobs
      .filter((row) => row.status === 'running')
      .map((row) => ({
        ...row,
        age_minutes: toAgeMinutes(row.started_at),
        lesson_code: row.lesson_id ? lessonById.get(row.lesson_id)?.code ?? null : null,
      }))
      .filter((row) => (row.age_minutes ?? -1) >= STUCK_RUNNING_THRESHOLD_MINUTES)
      .sort((a, b) => (b.age_minutes ?? 0) - (a.age_minutes ?? 0));
    const staleQueuedJobs = generationJobs
      .filter((row) => row.status === 'queued')
      .map((row) => ({
        ...row,
        age_minutes: toAgeMinutes(row.created_at),
        lesson_code: row.lesson_id ? lessonById.get(row.lesson_id)?.code ?? null : null,
      }))
      .filter((row) => (row.age_minutes ?? -1) >= STALE_QUEUED_THRESHOLD_MINUTES)
      .sort((a, b) => (b.age_minutes ?? 0) - (a.age_minutes ?? 0));
    const queueRunAgeMinutes = toAgeMinutes(queueRunResult.data?.event_ts ?? null);

    const lessonByCode = new Map(lessons.map((lesson) => [lesson.code.toUpperCase(), lesson]));
    const phase1BiologyLessons = GCSE_BIOLOGY_PHASE1_TARGET.map((targetLesson) => {
      const lesson = lessonByCode.get(targetLesson.lessonCode);
      const lessonId = lesson?.id ?? null;
      const sourceAvailable = biologySourceLessonCodes.has(targetLesson.lessonCode);
      const publishedReady = lessonId ? publishedLessonIds.has(lessonId) : false;
      const questionCoverageReady = lessonId ? questionCoveredLessonIds.has(lessonId) : false;

      return {
        lesson_code: targetLesson.lessonCode,
        title: lesson?.title ?? targetLesson.title,
        unit_code: targetLesson.unitCode,
        source_available: sourceAvailable,
        published_ready: publishedReady,
        question_coverage_ready: questionCoverageReady,
      };
    });

    const phase1BiologyMissingFromSource = phase1BiologyLessons
      .filter((lesson) => !lesson.source_available)
      .map((lesson) => lesson.lesson_code);
    const phase1BiologyMissingPublished = phase1BiologyLessons
      .filter((lesson) => !lesson.published_ready)
      .map((lesson) => lesson.lesson_code);
    const phase1BiologyMissingQuestionCoverage = phase1BiologyLessons
      .filter((lesson) => lesson.published_ready && !lesson.question_coverage_ready)
      .map((lesson) => lesson.lesson_code);

    return NextResponse.json({
      success: true,
      content: {
        lessons_total: lessons.length,
        lessons_with_published_versions: publishedLessonIds.size,
        lessons_missing_published: lessonsMissingPublished,
        lessons_missing_question_coverage: lessonsMissingQuestionCoverage,
        lesson_versions_by_status: lessonVersionsByStatus,
        question_versions_by_status: questionVersionsByStatus,
        moderation_backlog: {
          lessons: lessonBacklog,
          questions: questionBacklog,
        },
      },
      access: {
        total_enrollments: enrollments.length,
        enrollments_by_status: enrollmentsByStatus,
      },
      operations: {
        generation_jobs_by_status: generationJobsByStatus,
        retry_exhausted_jobs: retryExhaustedJobs,
        last_successful_job_at: lastSuccessfulJobAt,
        queue_run_is_stale:
          queueRunResult.data != null && (queueRunAgeMinutes ?? 0) >= STALE_QUEUE_RUN_THRESHOLD_MINUTES,
        queue_run_age_minutes: queueRunAgeMinutes,
        stuck_running_jobs: stuckRunningJobs.map((row) => ({
          id: row.id,
          kind: row.kind,
          lesson_id: row.lesson_id,
          lesson_code: row.lesson_code,
          attempts_made: row.attempts_made,
          max_attempts: row.max_attempts,
          age_minutes: row.age_minutes,
          error_message: row.error_message ?? null,
        })),
        stale_queued_jobs: staleQueuedJobs.map((row) => ({
          id: row.id,
          kind: row.kind,
          lesson_id: row.lesson_id,
          lesson_code: row.lesson_code,
          attempts_made: row.attempts_made,
          max_attempts: row.max_attempts,
          age_minutes: row.age_minutes,
          error_message: row.error_message ?? null,
        })),
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
      phase1_biology: {
        target_lessons_total: GCSE_BIOLOGY_PHASE1_TARGET.length,
        source_lessons_available: phase1BiologyLessons.filter((lesson) => lesson.source_available).length,
        published_lessons_ready: phase1BiologyLessons.filter((lesson) => lesson.published_ready).length,
        question_covered_lessons_ready: phase1BiologyLessons.filter((lesson) => lesson.question_coverage_ready).length,
        missing_from_source: phase1BiologyMissingFromSource,
        missing_published: phase1BiologyMissingPublished,
        missing_question_coverage: phase1BiologyMissingQuestionCoverage,
        lessons: phase1BiologyLessons,
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
