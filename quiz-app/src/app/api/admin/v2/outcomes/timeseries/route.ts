import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';

const DB_PAGE_SIZE = 1000;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

type AttemptRow = {
  user_id: string;
  is_correct: boolean;
  created_at: string;
};

type ReviewRow = {
  user_id: string;
  status: 'due' | 'completed' | 'resolved';
  due_at: string;
  resolved_at: string | null;
  updated_at: string;
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

function toDayKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function buildSinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function listDayKeys(sinceIso: string): string[] {
  const out: string[] = [];
  const since = new Date(sinceIso);
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
    const userId = request.nextUrl.searchParams.get('userId')?.trim() ?? null;
    if (userId && !isUuid(userId)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'userId must be a valid UUID.' },
        { status: 400 }
      );
    }
    const sinceIso = buildSinceIso(days);
    const dayKeys = listDayKeys(sinceIso);

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

    const [attempts, reviews] = await Promise.all([
      fetchAllRows<AttemptRow>(async (from, to) => {
        let query = adminClient
          .from('v2_attempts')
          .select('user_id, is_correct, created_at')
          .gte('created_at', sinceIso);
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.range(from, to);
        return { data: data as AttemptRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<ReviewRow>(async (from, to) => {
        let query = adminClient
          .from('v2_review_items')
          .select('user_id, status, due_at, resolved_at, updated_at')
          .or(`updated_at.gte.${sinceIso},due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`);
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.range(from, to);
        return { data: data as ReviewRow[] | null, error: error as Error | null };
      }),
    ]);

    for (const row of attempts) {
      const day = toDayKey(row.created_at);
      if (!day) continue;
      const bucket = buckets.get(day);
      if (!bucket) continue;
      bucket.attemptsTotal += 1;
      if (row.is_correct) bucket.attemptsCorrect += 1;
      bucket.activeUsers.add(row.user_id);
    }

    for (const row of reviews) {
      const dueDay = toDayKey(row.due_at);
      if (dueDay) {
        const dueBucket = buckets.get(dueDay);
        if (dueBucket) dueBucket.reviewDue += 1;
      }
      const resolvedDay = toDayKey(row.resolved_at);
      if (resolvedDay) {
        const resolvedBucket = buckets.get(resolvedDay);
        if (resolvedBucket) {
          resolvedBucket.reviewResolved += 1;
          if (row.resolved_at && row.resolved_at <= row.due_at) {
            resolvedBucket.reviewOnTime += 1;
          }
        }
      }
    }

    for (const day of dayKeys) {
      const dayEndIso = `${day}T23:59:59.999Z`;
      let activeCount = 0;
      for (const row of reviews) {
        if (row.due_at > dayEndIso) continue;
        if (row.status !== 'resolved') {
          activeCount += 1;
          continue;
        }
        if (!row.resolved_at || row.resolved_at > dayEndIso) {
          activeCount += 1;
        }
      }
      const bucket = buckets.get(day);
      if (bucket) bucket.reviewBacklog = activeCount;
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
      window: { days, since_iso: sinceIso, now_iso: new Date().toISOString() },
      user_id: userId,
      timeline,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
