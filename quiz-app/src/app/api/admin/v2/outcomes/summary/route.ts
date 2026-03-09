import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const DB_PAGE_SIZE = 1000;

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'student' | 'admin';
};

type DailyMetricRow = {
  day: string;
  user_id: string;
  attempts_count: number;
  attempts_correct: number;
  lessons_started: number;
  lessons_completed: number;
  review_due: number;
  review_resolved: number;
  review_on_time: number;
  review_recovery_denominator: number;
  review_recovery_numerator: number;
};

type DailyOpsMetricRow = {
  day: string;
  generation_jobs_total: number;
  generation_jobs_succeeded: number;
  generation_jobs_failed: number;
  generation_duration_ms_sum: number;
  generation_duration_count: number;
};

type MasteryRow = {
  user_id: string;
  mastery_status: 'pending' | 'achieved';
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

function buildStartDate(days: number): string {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
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

    const days = parseDays(request.nextUrl.searchParams.get('days'));
    const sinceIso = buildSinceIso(days);
    const startDate = buildStartDate(days);
    const endDate = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();

    const [profiles, dailyMetrics, dailyOps] = await Promise.all([
      fetchAllRows<ProfileRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('profiles')
          .select('user_id, display_name, role')
          .range(from, to);
        return { data: data as ProfileRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<DailyMetricRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_daily_user_metrics')
          .select(
            'day, user_id, attempts_count, attempts_correct, lessons_started, lessons_completed, review_due, review_resolved, review_on_time, review_recovery_denominator, review_recovery_numerator'
          )
          .gte('day', startDate)
          .lte('day', endDate)
          .range(from, to);
        return { data: data as DailyMetricRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<DailyOpsMetricRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_daily_ops_metrics')
          .select(
            'day, generation_jobs_total, generation_jobs_succeeded, generation_jobs_failed, generation_duration_ms_sum, generation_duration_count'
          )
          .gte('day', startDate)
          .lte('day', endDate)
          .range(from, to);
        return { data: data as DailyOpsMetricRow[] | null, error: error as Error | null };
      }),
    ]);

    const students = profiles.filter((profile) => profile.role !== 'admin');
    const studentSet = new Set(students.map((student) => student.user_id));
    const studentMetrics = dailyMetrics.filter((row) => studentSet.has(row.user_id));

    const byUser = new Map<
      string,
      {
        attempts_total: number;
        attempts_correct: number;
        lessons_started: number;
        lessons_completed: number;
        review_due: number;
        review_resolved: number;
        review_on_time: number;
        review_recovery_denominator: number;
        review_recovery_numerator: number;
      }
    >();

    for (const row of studentMetrics) {
      const bucket =
        byUser.get(row.user_id) ??
        {
          attempts_total: 0,
          attempts_correct: 0,
          lessons_started: 0,
          lessons_completed: 0,
          review_due: 0,
          review_resolved: 0,
          review_on_time: 0,
          review_recovery_denominator: 0,
          review_recovery_numerator: 0,
        };

      bucket.attempts_total += row.attempts_count ?? 0;
      bucket.attempts_correct += row.attempts_correct ?? 0;
      bucket.lessons_started += row.lessons_started ?? 0;
      bucket.lessons_completed += row.lessons_completed ?? 0;
      bucket.review_due += row.review_due ?? 0;
      bucket.review_resolved += row.review_resolved ?? 0;
      bucket.review_on_time += row.review_on_time ?? 0;
      bucket.review_recovery_denominator += row.review_recovery_denominator ?? 0;
      bucket.review_recovery_numerator += row.review_recovery_numerator ?? 0;
      byUser.set(row.user_id, bucket);
    }

    const masteryByUser = new Map<string, { achieved: number; total: number }>();
    for (const student of students) {
      masteryByUser.set(student.user_id, { achieved: 0, total: 0 });
    }

    const { data: masteryRows, error: masteryError } = await adminClient
      .from('v2_mastery_records')
      .select('user_id, mastery_status')
      .or(`last_attempt_at.gte.${sinceIso},first_attempt_at.gte.${sinceIso},achieved_at.gte.${sinceIso}`);
    if (masteryError) throw masteryError;

    for (const row of (masteryRows ?? []) as MasteryRow[]) {
      if (!studentSet.has(row.user_id)) continue;
      const state = masteryByUser.get(row.user_id);
      if (!state) continue;
      state.total += 1;
      if (row.mastery_status === 'achieved') state.achieved += 1;
    }

    const attemptsTotal = studentMetrics.reduce((sum, row) => sum + (row.attempts_count ?? 0), 0);
    const attemptsCorrect = studentMetrics.reduce((sum, row) => sum + (row.attempts_correct ?? 0), 0);
    const lessonsStarted = studentMetrics.reduce((sum, row) => sum + (row.lessons_started ?? 0), 0);
    const lessonsCompleted = studentMetrics.reduce((sum, row) => sum + (row.lessons_completed ?? 0), 0);
    const reviewDue = studentMetrics.reduce((sum, row) => sum + (row.review_due ?? 0), 0);
    const reviewResolved = studentMetrics.reduce((sum, row) => sum + (row.review_resolved ?? 0), 0);
    const reviewOnTime = studentMetrics.reduce((sum, row) => sum + (row.review_on_time ?? 0), 0);
    const reviewRecoveryDenominator = studentMetrics.reduce(
      (sum, row) => sum + (row.review_recovery_denominator ?? 0),
      0
    );
    const reviewRecoveryNumerator = studentMetrics.reduce(
      (sum, row) => sum + (row.review_recovery_numerator ?? 0),
      0
    );

    const opsTotals = dailyOps.reduce(
      (acc, row) => {
        acc.generation_jobs_total += row.generation_jobs_total ?? 0;
        acc.generation_jobs_succeeded += row.generation_jobs_succeeded ?? 0;
        acc.generation_jobs_failed += row.generation_jobs_failed ?? 0;
        acc.generation_duration_ms_sum += row.generation_duration_ms_sum ?? 0;
        acc.generation_duration_count += row.generation_duration_count ?? 0;
        return acc;
      },
      {
        generation_jobs_total: 0,
        generation_jobs_succeeded: 0,
        generation_jobs_failed: 0,
        generation_duration_ms_sum: 0,
        generation_duration_count: 0,
      }
    );

    const users = students.map((student) => {
      const metrics = byUser.get(student.user_id) ?? {
        attempts_total: 0,
        attempts_correct: 0,
        lessons_started: 0,
        lessons_completed: 0,
        review_due: 0,
        review_resolved: 0,
        review_on_time: 0,
        review_recovery_denominator: 0,
        review_recovery_numerator: 0,
      };
      const mastery = masteryByUser.get(student.user_id) ?? { achieved: 0, total: 0 };

      return {
        user_id: student.user_id,
        display_name: student.display_name,
        attempts_total: metrics.attempts_total,
        accuracy_pct: toPercent(metrics.attempts_correct, metrics.attempts_total),
        lessons_started: metrics.lessons_started,
        lessons_completed: metrics.lessons_completed,
        completion_rate_pct: toPercent(metrics.lessons_completed, metrics.lessons_started),
        review_due: metrics.review_due,
        review_resolved: metrics.review_resolved,
        review_resolved_rate_pct: toPercent(metrics.review_resolved, metrics.review_due),
        mastery_achieved_lessons: mastery.achieved,
        mastery_rate_pct: toPercent(mastery.achieved, mastery.total),
      };
    });

    users.sort((a, b) => (b.accuracy_pct ?? -1) - (a.accuracy_pct ?? -1));

    return NextResponse.json({
      success: true,
      window: { days, since_iso: sinceIso, now_iso: nowIso, start_date: startDate, end_date: endDate },
      summary: {
        learning: {
          attempts_total: attemptsTotal,
          accuracy_pct: toPercent(attemptsCorrect, attemptsTotal),
          mastery_rate_pct: toPercent(
            Array.from(masteryByUser.values()).reduce((sum, row) => sum + row.achieved, 0),
            Array.from(masteryByUser.values()).reduce((sum, row) => sum + row.total, 0)
          ),
        },
        behavior: {
          lesson_completion_rate_pct: toPercent(lessonsCompleted, lessonsStarted),
          review_adherence_pct: toPercent(reviewResolved, reviewDue),
          review_on_time_pct: toPercent(reviewOnTime, reviewDue),
          error_recovery_pct: toPercent(reviewRecoveryNumerator, reviewRecoveryDenominator),
        },
        operations: {
          generation_jobs_total: opsTotals.generation_jobs_total,
          generation_jobs_succeeded: opsTotals.generation_jobs_succeeded,
          generation_jobs_failed: opsTotals.generation_jobs_failed,
          generation_success_rate_pct: toPercent(
            opsTotals.generation_jobs_succeeded,
            opsTotals.generation_jobs_succeeded + opsTotals.generation_jobs_failed
          ),
          average_generation_duration_ms:
            opsTotals.generation_duration_count > 0
              ? Math.round(opsTotals.generation_duration_ms_sum / opsTotals.generation_duration_count)
              : null,
        },
      },
      users,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
