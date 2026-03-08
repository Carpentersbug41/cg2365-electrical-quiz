import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';

const AUTH_USERS_PER_PAGE = 1000;
const MAX_AUTH_USER_PAGES = 20;
const DB_PAGE_SIZE = 1000;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'student' | 'admin';
  course_id: string | null;
  updated_at: string;
};

type AttemptRow = {
  user_id: string;
  question_stable_id: string;
  correct: boolean;
  attempt_number: number;
  response_time_ms: number | null;
  created_at: string;
};

type LessonProgressRow = {
  user_id: string;
  lesson_id: string;
  status: 'started' | 'completed' | 'abandoned';
  mastery_status: 'pending' | 'achieved';
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

type ReviewQueueRow = {
  user_id: string;
  status: 'active' | 'resolved';
  due_at: string;
  times_wrong: number;
  times_right: number;
  resolved_at: string | null;
  updated_at: string;
};

type QuizSetRow = {
  user_id: string;
  is_active: boolean;
  created_at: string;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === '42P01';
}

type UserAccumulator = {
  attempts: AttemptRow[];
  lessonRows: LessonProgressRow[];
  reviewRows: ReviewQueueRow[];
  quizSetRows: QuizSetRow[];
  activeDayKeys: Set<string>;
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

function toDayKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function buildSinceIso(days: number): string {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return since.toISOString();
}

async function buildEmailLookup(
  adminClient: NonNullable<ReturnType<typeof createSupabaseAdminClient>>
): Promise<Map<string, string | null>> {
  const lookup = new Map<string, string | null>();
  for (let page = 1; page <= MAX_AUTH_USER_PAGES; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: AUTH_USERS_PER_PAGE,
    });
    if (error) throw error;

    const users = data.users ?? [];
    for (const user of users) {
      lookup.set(user.id, user.email ?? null);
    }

    if (users.length < AUTH_USERS_PER_PAGE) break;
  }
  return lookup;
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

function getAccumulator(map: Map<string, UserAccumulator>, userId: string): UserAccumulator {
  const existing = map.get(userId);
  if (existing) return existing;
  const created: UserAccumulator = {
    attempts: [],
    lessonRows: [],
    reviewRows: [],
    quizSetRows: [],
    activeDayKeys: new Set<string>(),
  };
  map.set(userId, created);
  return created;
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
    const includeAdmins = request.nextUrl.searchParams.get('includeAdmins') === 'true';
    const sinceIso = buildSinceIso(days);
    const nowIso = new Date().toISOString();

    const [emailById, profiles, attempts, lessonProgressRows, reviewQueueRows, quizSetRows] = await Promise.all([
      buildEmailLookup(adminClient),
      fetchAllRows<ProfileRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('profiles')
          .select('user_id, display_name, role, course_id, updated_at')
          .range(from, to);
        return { data: data as ProfileRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<AttemptRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('question_attempts')
          .select('user_id, question_stable_id, correct, attempt_number, response_time_ms, created_at')
          .gte('created_at', sinceIso)
          .range(from, to);
        return { data: data as AttemptRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<LessonProgressRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('lesson_progress')
          .select('user_id, lesson_id, status, mastery_status, started_at, completed_at, updated_at')
          .or(`updated_at.gte.${sinceIso},started_at.gte.${sinceIso},completed_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as LessonProgressRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<ReviewQueueRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('student_review_queue')
          .select('user_id, status, due_at, times_wrong, times_right, resolved_at, updated_at')
          .or(`updated_at.gte.${sinceIso},due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as ReviewQueueRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<QuizSetRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('student_quiz_sets')
          .select('user_id, is_active, created_at')
          .gte('created_at', sinceIso)
          .range(from, to);
        return { data: data as QuizSetRow[] | null, error: error as Error | null };
      }),
    ]);

    const [v2Attempts, v2MasteryRows, v2ReviewRows] = await Promise.all([
      (async () => {
        const rows = await fetchAllRows<{
          user_id: string;
          question_stable_id: string;
          is_correct: boolean;
          attempt_no: number;
          created_at: string;
        }>(async (from, to) => {
          const { data, error } = await adminClient
            .from('v2_attempts')
            .select('user_id, question_stable_id, is_correct, attempt_no, created_at')
            .gte('created_at', sinceIso)
            .range(from, to);
          return { data: data ?? null, error: error as Error | null };
        });
        return rows.map<AttemptRow>((row) => ({
          user_id: row.user_id,
          question_stable_id: row.question_stable_id,
          correct: row.is_correct,
          attempt_number: row.attempt_no,
          response_time_ms: null,
          created_at: row.created_at,
        }));
      })().catch((error) => {
        if (!isMissingTableError(error)) {
          console.warn('[Admin outcomes] Failed to read v2_attempts:', error);
        }
        return [] as AttemptRow[];
      }),
      (async () => {
        const rows = await fetchAllRows<{
          user_id: string;
          lesson_id: string;
          mastery_status: 'pending' | 'achieved';
          first_attempt_at: string | null;
          achieved_at: string | null;
          last_attempt_at: string | null;
        }>(async (from, to) => {
          const { data, error } = await adminClient
            .from('v2_mastery_records')
            .select('user_id, lesson_id, mastery_status, first_attempt_at, achieved_at, last_attempt_at')
            .or(`last_attempt_at.gte.${sinceIso},first_attempt_at.gte.${sinceIso},achieved_at.gte.${sinceIso}`)
            .range(from, to);
          return { data: data ?? null, error: error as Error | null };
        });
        return rows.map<LessonProgressRow>((row) => ({
          user_id: row.user_id,
          lesson_id: row.lesson_id,
          status: row.achieved_at ? 'completed' : 'started',
          mastery_status: row.mastery_status,
          started_at: row.first_attempt_at,
          completed_at: row.achieved_at,
          updated_at: row.last_attempt_at ?? row.first_attempt_at ?? row.achieved_at ?? sinceIso,
        }));
      })().catch((error) => {
        if (!isMissingTableError(error)) {
          console.warn('[Admin outcomes] Failed to read v2_mastery_records:', error);
        }
        return [] as LessonProgressRow[];
      }),
      (async () => {
        const rows = await fetchAllRows<{
          user_id: string;
          status: 'due' | 'completed' | 'resolved';
          due_at: string;
          times_wrong: number;
          times_right: number;
          resolved_at: string | null;
          updated_at: string;
        }>(async (from, to) => {
          const { data, error } = await adminClient
            .from('v2_review_items')
            .select('user_id, status, due_at, times_wrong, times_right, resolved_at, updated_at')
            .or(`updated_at.gte.${sinceIso},due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`)
            .range(from, to);
          return { data: data ?? null, error: error as Error | null };
        });
        return rows.map<ReviewQueueRow>((row) => ({
          user_id: row.user_id,
          status: row.status === 'resolved' ? 'resolved' : 'active',
          due_at: row.due_at,
          times_wrong: row.times_wrong,
          times_right: row.times_right,
          resolved_at: row.resolved_at,
          updated_at: row.updated_at,
        }));
      })().catch((error) => {
        if (!isMissingTableError(error)) {
          console.warn('[Admin outcomes] Failed to read v2_review_items:', error);
        }
        return [] as ReviewQueueRow[];
      }),
    ]);

    const allAttempts = [...attempts, ...v2Attempts];
    const allLessonProgressRows = [...lessonProgressRows, ...v2MasteryRows];
    const allReviewQueueRows = [...reviewQueueRows, ...v2ReviewRows];

    const userMap = new Map<string, UserAccumulator>();
    for (const row of allAttempts) {
      const acc = getAccumulator(userMap, row.user_id);
      acc.attempts.push(row);
      const day = toDayKey(row.created_at);
      if (day) acc.activeDayKeys.add(day);
    }
    for (const row of allLessonProgressRows) {
      const acc = getAccumulator(userMap, row.user_id);
      acc.lessonRows.push(row);
      const keys = [toDayKey(row.started_at), toDayKey(row.completed_at), toDayKey(row.updated_at)];
      for (const key of keys) {
        if (key) acc.activeDayKeys.add(key);
      }
    }
    for (const row of allReviewQueueRows) {
      const acc = getAccumulator(userMap, row.user_id);
      acc.reviewRows.push(row);
      const keys = [toDayKey(row.due_at), toDayKey(row.resolved_at), toDayKey(row.updated_at)];
      for (const key of keys) {
        if (key) acc.activeDayKeys.add(key);
      }
    }
    for (const row of quizSetRows) {
      const acc = getAccumulator(userMap, row.user_id);
      acc.quizSetRows.push(row);
      const day = toDayKey(row.created_at);
      if (day) acc.activeDayKeys.add(day);
    }

    const output = profiles
      .filter((profile) => includeAdmins || profile.role !== 'admin')
      .map((profile) => {
        const acc = userMap.get(profile.user_id);
        const attemptsForUser = acc?.attempts ?? [];
        const lessonRows = acc?.lessonRows ?? [];
        const reviewRows = acc?.reviewRows ?? [];
        const quizRows = acc?.quizSetRows ?? [];

        const totalAttempts = attemptsForUser.length;
        const correctAttempts = attemptsForUser.filter((row) => row.correct).length;
        const overallAccuracyPct = toPercent(correctAttempts, totalAttempts);

        const attemptsByQuestion = new Map<string, AttemptRow[]>();
        for (const attempt of attemptsForUser) {
          const list = attemptsByQuestion.get(attempt.question_stable_id) ?? [];
          list.push(attempt);
          attemptsByQuestion.set(attempt.question_stable_id, list);
        }

        let firstCorrectCount = 0;
        let latestCorrectCount = 0;
        for (const list of attemptsByQuestion.values()) {
          list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          if (list[0]?.correct) firstCorrectCount += 1;
          if (list[list.length - 1]?.correct) latestCorrectCount += 1;
        }
        const questionCount = attemptsByQuestion.size;
        const firstAttemptAccuracyPct = toPercent(firstCorrectCount, questionCount);
        const latestAttemptAccuracyPct = toPercent(latestCorrectCount, questionCount);
        const scoreDeltaPct =
          firstAttemptAccuracyPct != null && latestAttemptAccuracyPct != null
            ? Math.round((latestAttemptAccuracyPct - firstAttemptAccuracyPct) * 10) / 10
            : null;

        const lessonsStarted = lessonRows.filter((row) => {
          if (row.status === 'started' || row.status === 'completed' || row.status === 'abandoned') return true;
          return row.started_at != null;
        }).length;
        const lessonsCompleted = lessonRows.filter((row) => row.status === 'completed' || row.completed_at != null).length;
        const lessonCompletionRatePct = toPercent(lessonsCompleted, lessonsStarted);
        const masteryAchievedLessons = lessonRows.filter((row) => row.mastery_status === 'achieved').length;
        const masteryRatePct = toPercent(masteryAchievedLessons, lessonRows.length);

        const dueItems = reviewRows.filter((row) => row.due_at >= sinceIso && row.due_at <= nowIso);
        const resolvedItems = dueItems.filter((row) => row.status === 'resolved' || row.resolved_at != null);
        const onTimeResolvedItems = dueItems.filter((row) => row.resolved_at != null && row.resolved_at <= row.due_at);
        const reviewDueCount = dueItems.length;
        const reviewResolvedCount = resolvedItems.length;
        const reviewResolvedRatePct = toPercent(reviewResolvedCount, reviewDueCount);
        const reviewOnTimeRatePct = toPercent(onTimeResolvedItems.length, reviewDueCount);

        const wrongItems = reviewRows.filter((row) => row.times_wrong > 0);
        const recoveredItems = wrongItems.filter((row) => row.times_right > 0);
        const errorRecoveryRatePct = toPercent(recoveredItems.length, wrongItems.length);

        const responseTimes = attemptsForUser
          .map((row) => row.response_time_ms)
          .filter((value): value is number => typeof value === 'number' && value >= 0);
        const medianResponseTimeMs = (() => {
          if (responseTimes.length === 0) return null;
          const sorted = [...responseTimes].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
        })();

        const activeQuizSetCount = quizRows.filter((row) => row.is_active).length;

        return {
          user_id: profile.user_id,
          email: emailById.get(profile.user_id) ?? null,
          display_name: profile.display_name,
          role: profile.role,
          course_id: profile.course_id,
          updated_at: profile.updated_at,
          window_days: days,
          learning: {
            attempts_total: totalAttempts,
            overall_accuracy_pct: overallAccuracyPct,
            question_count: questionCount,
            first_attempt_accuracy_pct: firstAttemptAccuracyPct,
            latest_attempt_accuracy_pct: latestAttemptAccuracyPct,
            score_delta_pct: scoreDeltaPct,
            mastery_achieved_lessons: masteryAchievedLessons,
            mastery_rate_pct: masteryRatePct,
          },
          behavior: {
            lessons_started: lessonsStarted,
            lessons_completed: lessonsCompleted,
            lesson_completion_rate_pct: lessonCompletionRatePct,
            active_days: acc?.activeDayKeys.size ?? 0,
          },
          review: {
            due_count: reviewDueCount,
            resolved_count: reviewResolvedCount,
            resolved_rate_pct: reviewResolvedRatePct,
            on_time_rate_pct: reviewOnTimeRatePct,
            error_recovery_rate_pct: errorRecoveryRatePct,
          },
          operations: {
            active_quiz_set_count: activeQuizSetCount,
            median_response_time_ms: medianResponseTimeMs,
          },
        };
      });

    const totals = {
      users: output.length,
      attempts: output.reduce((sum, row) => sum + row.learning.attempts_total, 0),
      activeUsers: output.filter((row) => row.behavior.active_days > 0).length,
      averageAccuracyPct:
        output.length > 0
          ? Math.round(
              (output.reduce((sum, row) => sum + (row.learning.overall_accuracy_pct ?? 0), 0) / output.length) * 10
            ) / 10
          : null,
    };

    return NextResponse.json({
      success: true,
      window: { days, since_iso: sinceIso, now_iso: nowIso },
      totals,
      users: output,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
