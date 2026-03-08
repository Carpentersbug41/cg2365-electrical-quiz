import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const DB_PAGE_SIZE = 1000;

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'student' | 'admin';
};

type AttemptRow = {
  user_id: string;
  is_correct: boolean;
  created_at: string;
};

type LessonSessionRow = {
  user_id: string;
  status: 'started' | 'completed' | 'abandoned';
  created_at: string;
  completed_at: string | null;
};

type ReviewRow = {
  user_id: string;
  status: 'due' | 'completed' | 'resolved';
  due_at: string;
  resolved_at: string | null;
  times_wrong: number;
  times_right: number;
};

type JobRow = {
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
};

function parseDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, value);
}

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function buildSinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => Promise<{ data: T[] | null; error: Error | null }>
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  while (true) {
    const to = from + DB_PAGE_SIZE - 1;
    const { data, error } = await fetchPage(from, to);
    if (error) throw error;
    const pageRows = data ?? [];
    rows.push(...pageRows);
    if (pageRows.length < DB_PAGE_SIZE) break;
    from += DB_PAGE_SIZE;
  }
  return rows;
}

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

    const days = parseDays(request.nextUrl.searchParams.get('days'));
    const sinceIso = buildSinceIso(days);
    const nowIso = new Date().toISOString();

    const [profiles, attempts, sessions, reviews, jobs] = await Promise.all([
      fetchAllRows<ProfileRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('profiles')
          .select('user_id, display_name, role')
          .range(from, to);
        return { data: data as ProfileRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<AttemptRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_attempts')
          .select('user_id, is_correct, created_at')
          .gte('created_at', sinceIso)
          .range(from, to);
        return { data: data as AttemptRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<LessonSessionRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_lesson_sessions')
          .select('user_id, status, created_at, completed_at')
          .or(`created_at.gte.${sinceIso},completed_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as LessonSessionRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<ReviewRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_review_items')
          .select('user_id, status, due_at, resolved_at, times_wrong, times_right')
          .or(`due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as ReviewRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<JobRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_generation_jobs')
          .select('status, started_at, finished_at, created_at')
          .gte('created_at', sinceIso)
          .range(from, to);
        return { data: data as JobRow[] | null, error: error as Error | null };
      }),
    ]);

    const students = profiles.filter((profile) => profile.role !== 'admin');
    const studentSet = new Set(students.map((student) => student.user_id));

    const studentAttempts = attempts.filter((row) => studentSet.has(row.user_id));
    const correctAttempts = studentAttempts.filter((row) => row.is_correct).length;
    const overallAccuracyPct = toPercent(correctAttempts, studentAttempts.length);

    const startedSessions = sessions.filter(
      (row) => studentSet.has(row.user_id) && (row.status === 'started' || row.status === 'completed' || row.status === 'abandoned')
    );
    const completedSessions = sessions.filter(
      (row) => studentSet.has(row.user_id) && (row.status === 'completed' || row.completed_at != null)
    );

    const dueReviewItems = reviews.filter(
      (row) => studentSet.has(row.user_id) && row.due_at >= sinceIso && row.due_at <= nowIso
    );
    const resolvedReviewItems = dueReviewItems.filter((row) => row.status === 'resolved' || row.resolved_at != null);
    const onTimeReviewItems = dueReviewItems.filter(
      (row) => row.resolved_at != null && row.resolved_at <= row.due_at
    );
    const wrongItems = reviews.filter((row) => studentSet.has(row.user_id) && row.times_wrong > 0);
    const recoveredItems = wrongItems.filter((row) => row.times_right > 0);

    const jobsSucceeded = jobs.filter((row) => row.status === 'succeeded').length;
    const jobsFailed = jobs.filter((row) => row.status === 'failed').length;
    const runDurationsMs = jobs
      .map((row) => {
        if (!row.started_at || !row.finished_at) return null;
        const start = new Date(row.started_at).getTime();
        const end = new Date(row.finished_at).getTime();
        if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
        return end - start;
      })
      .filter((value): value is number => typeof value === 'number');
    const avgJobDurationMs =
      runDurationsMs.length > 0 ? Math.round(runDurationsMs.reduce((a, b) => a + b, 0) / runDurationsMs.length) : null;

    const masteryByUser = new Map<string, { achieved: number; total: number }>();
    for (const student of students) {
      masteryByUser.set(student.user_id, { achieved: 0, total: 0 });
    }

    const { data: masteryRows, error: masteryError } = await adminClient
      .from('v2_mastery_records')
      .select('user_id, mastery_status')
      .or(`last_attempt_at.gte.${sinceIso},first_attempt_at.gte.${sinceIso},achieved_at.gte.${sinceIso}`);
    if (masteryError) throw masteryError;

    for (const row of masteryRows ?? []) {
      const userId = (row as { user_id?: string }).user_id;
      if (!userId || !studentSet.has(userId)) continue;
      const state = masteryByUser.get(userId);
      if (!state) continue;
      state.total += 1;
      if ((row as { mastery_status?: string }).mastery_status === 'achieved') {
        state.achieved += 1;
      }
    }

    const attemptsByUser = new Map<string, AttemptRow[]>();
    for (const attempt of studentAttempts) {
      const list = attemptsByUser.get(attempt.user_id) ?? [];
      list.push(attempt);
      attemptsByUser.set(attempt.user_id, list);
    }

    const sessionsByUser = new Map<string, LessonSessionRow[]>();
    for (const session of sessions.filter((row) => studentSet.has(row.user_id))) {
      const list = sessionsByUser.get(session.user_id) ?? [];
      list.push(session);
      sessionsByUser.set(session.user_id, list);
    }

    const reviewByUser = new Map<string, ReviewRow[]>();
    for (const review of reviews.filter((row) => studentSet.has(row.user_id))) {
      const list = reviewByUser.get(review.user_id) ?? [];
      list.push(review);
      reviewByUser.set(review.user_id, list);
    }

    const users = students.map((student) => {
      const userAttempts = attemptsByUser.get(student.user_id) ?? [];
      const userCorrect = userAttempts.filter((attempt) => attempt.is_correct).length;
      const userSessions = sessionsByUser.get(student.user_id) ?? [];
      const userStarted = userSessions.filter((session) => session.status !== 'abandoned').length;
      const userCompleted = userSessions.filter(
        (session) => session.status === 'completed' || session.completed_at != null
      ).length;
      const userReviews = reviewByUser.get(student.user_id) ?? [];
      const userDue = userReviews.filter((review) => review.due_at >= sinceIso && review.due_at <= nowIso);
      const userResolved = userDue.filter((review) => review.status === 'resolved' || review.resolved_at != null);
      const mastery = masteryByUser.get(student.user_id) ?? { achieved: 0, total: 0 };

      return {
        user_id: student.user_id,
        display_name: student.display_name,
        attempts_total: userAttempts.length,
        accuracy_pct: toPercent(userCorrect, userAttempts.length),
        lessons_started: userStarted,
        lessons_completed: userCompleted,
        completion_rate_pct: toPercent(userCompleted, userStarted),
        review_due: userDue.length,
        review_resolved: userResolved.length,
        review_resolved_rate_pct: toPercent(userResolved.length, userDue.length),
        mastery_achieved_lessons: mastery.achieved,
        mastery_rate_pct: toPercent(mastery.achieved, mastery.total),
      };
    });

    users.sort((a, b) => (b.accuracy_pct ?? -1) - (a.accuracy_pct ?? -1));

    return NextResponse.json({
      success: true,
      window: { days, since_iso: sinceIso, now_iso: nowIso },
      summary: {
        learning: {
          attempts_total: studentAttempts.length,
          accuracy_pct: overallAccuracyPct,
          mastery_rate_pct: toPercent(
            Array.from(masteryByUser.values()).reduce((sum, row) => sum + row.achieved, 0),
            Array.from(masteryByUser.values()).reduce((sum, row) => sum + row.total, 0)
          ),
        },
        behavior: {
          lesson_completion_rate_pct: toPercent(completedSessions.length, startedSessions.length),
          review_adherence_pct: toPercent(resolvedReviewItems.length, dueReviewItems.length),
          review_on_time_pct: toPercent(onTimeReviewItems.length, dueReviewItems.length),
          error_recovery_pct: toPercent(recoveredItems.length, wrongItems.length),
        },
        operations: {
          generation_jobs_total: jobs.length,
          generation_jobs_succeeded: jobsSucceeded,
          generation_jobs_failed: jobsFailed,
          generation_success_rate_pct: toPercent(jobsSucceeded, jobsSucceeded + jobsFailed),
          average_generation_duration_ms: avgJobDurationMs,
        },
      },
      users,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
