import { NextRequest, NextResponse } from 'next/server';
import { listV2PrivilegedUserIds } from '@/lib/v2/access';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

const DB_PAGE_SIZE = 1000;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

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
  review_backlog: number;
};

type ProfileRow = {
  user_id: string;
  role: 'student' | 'admin';
};

type DayBucket = {
  date: string;
  activeUsers: Set<string>;
  attemptsTotal: number;
  attemptsCorrect: number;
  reviewDue: number;
  reviewResolved: number;
  reviewOnTime: number;
  reviewBacklog: number;
};

function parseDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function buildStartDate(days: number): string {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function listDayKeys(startDate: string): string[] {
  const out: string[] = [];
  const since = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date();
  since.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);
  while (since <= end) {
    out.push(since.toISOString().slice(0, 10));
    since.setUTCDate(since.getUTCDate() + 1);
  }
  return out;
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
    const userId = request.nextUrl.searchParams.get('userId')?.trim() ?? null;
    if (userId && !isUuid(userId)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'userId must be a valid UUID.' },
        { status: 400 }
      );
    }

    const startDate = buildStartDate(days);
    const dayKeys = listDayKeys(startDate);
    let includedUserIds: Set<string> | null = null;

    if (!userId) {
      const [profiles, privilegedUserIds] = await Promise.all([
        fetchAllRows<ProfileRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('profiles')
          .select('user_id, role')
          .range(from, to);
        return { data: data as ProfileRow[] | null, error: error as Error | null };
        }),
        listV2PrivilegedUserIds(adminClient),
      ]);
      includedUserIds = new Set(
        profiles
          .filter((profile) => profile.role !== 'admin' && !privilegedUserIds.has(profile.user_id))
          .map((profile) => profile.user_id)
      );
    }

    const metricRows = await fetchAllRows<DailyMetricRow>(async (from, to) => {
      let query = adminClient
        .from('v2_daily_user_metrics')
        .select(
          'day, user_id, attempts_count, attempts_correct, lessons_started, lessons_completed, review_due, review_resolved, review_on_time, review_backlog'
        )
        .gte('day', startDate);
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query.range(from, to);
      return { data: data as DailyMetricRow[] | null, error: error as Error | null };
    });

    const buckets = new Map<string, DayBucket>();
    for (const day of dayKeys) {
      buckets.set(day, {
        date: day,
        activeUsers: new Set<string>(),
        attemptsTotal: 0,
        attemptsCorrect: 0,
        reviewDue: 0,
        reviewResolved: 0,
        reviewOnTime: 0,
        reviewBacklog: 0,
      });
    }

    for (const row of metricRows) {
      if (includedUserIds && !includedUserIds.has(row.user_id)) continue;
      const bucket = buckets.get(row.day);
      if (!bucket) continue;
      bucket.attemptsTotal += row.attempts_count ?? 0;
      bucket.attemptsCorrect += row.attempts_correct ?? 0;
      bucket.reviewDue += row.review_due ?? 0;
      bucket.reviewResolved += row.review_resolved ?? 0;
      bucket.reviewOnTime += row.review_on_time ?? 0;
      bucket.reviewBacklog += row.review_backlog ?? 0;

      const isActive =
        (row.attempts_count ?? 0) > 0 ||
        (row.lessons_started ?? 0) > 0 ||
        (row.lessons_completed ?? 0) > 0 ||
        (row.review_due ?? 0) > 0 ||
        (row.review_resolved ?? 0) > 0 ||
        (row.review_backlog ?? 0) > 0;
      if (isActive) {
        bucket.activeUsers.add(row.user_id);
      }
    }

    const timeline = dayKeys.map((day) => {
      const bucket = buckets.get(day)!;
      return {
        date: day,
        active_users: bucket.activeUsers.size,
        attempts_total: bucket.attemptsTotal,
        accuracy_pct: toPercent(bucket.attemptsCorrect, bucket.attemptsTotal),
        review_due: bucket.reviewDue,
        review_resolved: bucket.reviewResolved,
        review_on_time_pct: toPercent(bucket.reviewOnTime, bucket.reviewDue),
        review_active_backlog: bucket.reviewBacklog,
      };
    });

    return NextResponse.json({
      success: true,
      window: { days, start_date: startDate, now_iso: new Date().toISOString() },
      user_id: userId,
      timeline,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
