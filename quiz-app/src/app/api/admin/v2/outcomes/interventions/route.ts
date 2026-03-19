import { NextRequest, NextResponse } from 'next/server';
import { listV2PrivilegedUserIds } from '@/lib/v2/access';
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
  user_id: string;
  attempts_count: number;
  attempts_correct: number;
  lessons_started: number;
  lessons_completed: number;
  review_due: number;
  review_resolved: number;
  review_backlog: number;
};

type MasteryRow = {
  user_id: string;
  lesson_id: string;
  attempts_count: number | null;
  best_score_percent: number | null;
  mastery_status: 'pending' | 'achieved';
  v2_lessons?: {
    code: string;
    title: string;
  } | null;
};

function parseDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, value);
}

function parseLimit(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return 10;
  return Math.min(50, value);
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
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
    const sinceIso = buildSinceIso(days);
    const startDate = sinceIso.slice(0, 10);

    const [profiles, metrics, masteryRows, privilegedUserIds] = await Promise.all([
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
          .select('user_id, attempts_count, attempts_correct, lessons_started, lessons_completed, review_due, review_resolved, review_backlog')
          .gte('day', startDate)
          .range(from, to);
        return { data: data as DailyMetricRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<MasteryRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_mastery_records')
          .select('user_id, lesson_id, attempts_count, best_score_percent, mastery_status, v2_lessons(code,title)')
          .or(`last_attempt_at.gte.${sinceIso},first_attempt_at.gte.${sinceIso},achieved_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as MasteryRow[] | null, error: error as Error | null };
      }),
      listV2PrivilegedUserIds(adminClient),
    ]);

    const students = profiles.filter(
      (profile) => profile.role !== 'admin' && !privilegedUserIds.has(profile.user_id)
    );
    const studentSet = new Set(students.map((profile) => profile.user_id));

    const metricsByUser = new Map<string, DailyMetricRow>();
    for (const row of metrics) {
      if (!studentSet.has(row.user_id)) continue;
      const existing = metricsByUser.get(row.user_id) ?? {
        user_id: row.user_id,
        attempts_count: 0,
        attempts_correct: 0,
        lessons_started: 0,
        lessons_completed: 0,
        review_due: 0,
        review_resolved: 0,
        review_backlog: 0,
      };
      existing.attempts_count += row.attempts_count ?? 0;
      existing.attempts_correct += row.attempts_correct ?? 0;
      existing.lessons_started += row.lessons_started ?? 0;
      existing.lessons_completed += row.lessons_completed ?? 0;
      existing.review_due += row.review_due ?? 0;
      existing.review_resolved += row.review_resolved ?? 0;
      existing.review_backlog += row.review_backlog ?? 0;
      metricsByUser.set(row.user_id, existing);
    }

    const masteryByUser = new Map<string, { total: number; achieved: number }>();
    const lessonBuckets = new Map<
      string,
      {
        lesson_id: string;
        lesson_code: string;
        lesson_title: string;
        learners_started: number;
        learners_mastered: number;
        attempts_sum: number;
        best_score_sum: number;
        best_score_count: number;
      }
    >();

    for (const row of masteryRows) {
      if (!studentSet.has(row.user_id)) continue;
      const userBucket = masteryByUser.get(row.user_id) ?? { total: 0, achieved: 0 };
      userBucket.total += 1;
      if (row.mastery_status === 'achieved') userBucket.achieved += 1;
      masteryByUser.set(row.user_id, userBucket);

      const lessonBucket =
        lessonBuckets.get(row.lesson_id) ??
        {
          lesson_id: row.lesson_id,
          lesson_code: row.v2_lessons?.code ?? row.lesson_id,
          lesson_title: row.v2_lessons?.title ?? row.lesson_id,
          learners_started: 0,
          learners_mastered: 0,
          attempts_sum: 0,
          best_score_sum: 0,
          best_score_count: 0,
        };
      lessonBucket.learners_started += 1;
      if (row.mastery_status === 'achieved') lessonBucket.learners_mastered += 1;
      lessonBucket.attempts_sum += row.attempts_count ?? 0;
      if (typeof row.best_score_percent === 'number') {
        lessonBucket.best_score_sum += row.best_score_percent;
        lessonBucket.best_score_count += 1;
      }
      lessonBuckets.set(row.lesson_id, lessonBucket);
    }

    const learners = students
      .map((student) => {
        const metricsRow = metricsByUser.get(student.user_id) ?? {
          user_id: student.user_id,
          attempts_count: 0,
          attempts_correct: 0,
          lessons_started: 0,
          lessons_completed: 0,
          review_due: 0,
          review_resolved: 0,
          review_backlog: 0,
        };
        const mastery = masteryByUser.get(student.user_id) ?? { total: 0, achieved: 0 };

        const accuracyPct = toPercent(metricsRow.attempts_correct, metricsRow.attempts_count);
        const completionRatePct = toPercent(metricsRow.lessons_completed, metricsRow.lessons_started);
        const masteryRatePct = toPercent(mastery.achieved, mastery.total);
        const reviewResolvedRatePct = toPercent(metricsRow.review_resolved, metricsRow.review_due);

        const riskReasons: string[] = [];
        let riskScore = 0;
        if ((completionRatePct ?? 100) < 60) {
          riskScore += 3;
          riskReasons.push('low_completion');
        }
        if ((accuracyPct ?? 100) < 70) {
          riskScore += 3;
          riskReasons.push('low_accuracy');
        }
        if ((masteryRatePct ?? 100) < 50) {
          riskScore += 2;
          riskReasons.push('low_mastery');
        }
        if ((metricsRow.review_backlog ?? 0) >= 5) {
          riskScore += 2;
          riskReasons.push('review_backlog');
        }
        if ((reviewResolvedRatePct ?? 100) < 60 && metricsRow.review_due > 0) {
          riskScore += 1;
          riskReasons.push('low_review_resolution');
        }

        return {
          user_id: student.user_id,
          display_name: student.display_name,
          attempts_total: metricsRow.attempts_count,
          accuracy_pct: accuracyPct,
          completion_rate_pct: completionRatePct,
          mastery_rate_pct: masteryRatePct,
          review_backlog: metricsRow.review_backlog,
          review_resolved_rate_pct: reviewResolvedRatePct,
          risk_score: riskScore,
          risk_reasons: riskReasons,
        };
      })
      .filter((row) => row.risk_score > 0)
      .sort((a, b) => b.risk_score - a.risk_score || (a.accuracy_pct ?? 100) - (b.accuracy_pct ?? 100))
      .slice(0, limit);

    const lessons = Array.from(lessonBuckets.values())
      .map((bucket) => {
        const masteryRatePct = toPercent(bucket.learners_mastered, bucket.learners_started);
        const averageBestScorePct =
          bucket.best_score_count > 0 ? Math.round((bucket.best_score_sum / bucket.best_score_count) * 10) / 10 : null;
        const averageAttempts =
          bucket.learners_started > 0 ? Math.round((bucket.attempts_sum / bucket.learners_started) * 10) / 10 : null;

        const riskReasons: string[] = [];
        let riskScore = 0;
        if ((masteryRatePct ?? 100) < 70) {
          riskScore += 3;
          riskReasons.push('low_mastery');
        }
        if ((averageBestScorePct ?? 100) < 75) {
          riskScore += 2;
          riskReasons.push('low_score');
        }
        if ((averageAttempts ?? 0) > 3) {
          riskScore += 1;
          riskReasons.push('high_attempts');
        }

        return {
          lesson_id: bucket.lesson_id,
          lesson_code: bucket.lesson_code,
          lesson_title: bucket.lesson_title,
          learners_started: bucket.learners_started,
          learners_mastered: bucket.learners_mastered,
          mastery_rate_pct: masteryRatePct,
          average_best_score_pct: averageBestScorePct,
          average_attempts: averageAttempts,
          risk_score: riskScore,
          risk_reasons: riskReasons,
        };
      })
      .filter((row) => row.risk_score > 0)
      .sort((a, b) => b.risk_score - a.risk_score || (a.mastery_rate_pct ?? 100) - (b.mastery_rate_pct ?? 100))
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      window: { days, since_iso: sinceIso, now_iso: new Date().toISOString() },
      learners,
      lessons,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
