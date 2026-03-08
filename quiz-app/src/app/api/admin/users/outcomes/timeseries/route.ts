import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';

const DB_PAGE_SIZE = 1000;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

type AttemptRow = {
  user_id: string;
  correct: boolean;
  created_at: string;
};

type ReviewQueueRow = {
  user_id: string;
  status: 'active' | 'resolved';
  due_at: string;
  resolved_at: string | null;
  updated_at: string;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === '42P01';
}

type DayBucket = {
  date: string;
  active_users: Set<string>;
  attempts_total: number;
  attempts_correct: number;
  review_due: number;
  review_resolved: number;
  review_on_time: number;
  review_active: number;
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
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return since.toISOString();
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
    const requestedUserId = request.nextUrl.searchParams.get('userId')?.trim() ?? null;
    if (requestedUserId && !isUuid(requestedUserId)) {
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
        active_users: new Set<string>(),
        attempts_total: 0,
        attempts_correct: 0,
        review_due: 0,
        review_resolved: 0,
        review_on_time: 0,
        review_active: 0,
      });
    }

    const [attempts, reviewRows] = await Promise.all([
      fetchAllRows<AttemptRow>(async (from, to) => {
        let query = adminClient
          .from('question_attempts')
          .select('user_id, correct, created_at')
          .gte('created_at', sinceIso);
        if (requestedUserId) query = query.eq('user_id', requestedUserId);
        const { data, error } = await query.range(from, to);
        return { data: data as AttemptRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<ReviewQueueRow>(async (from, to) => {
        let query = adminClient
          .from('student_review_queue')
          .select('user_id, status, due_at, resolved_at, updated_at')
          .or(`updated_at.gte.${sinceIso},due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`);
        if (requestedUserId) query = query.eq('user_id', requestedUserId);
        const { data, error } = await query.range(from, to);
        return { data: data as ReviewQueueRow[] | null, error: error as Error | null };
      }),
    ]);

    const [v2Attempts, v2ReviewRows] = await Promise.all([
      (async () => {
        const rows = await fetchAllRows<{ user_id: string; is_correct: boolean; created_at: string }>(
          async (from, to) => {
            let query = adminClient
              .from('v2_attempts')
              .select('user_id, is_correct, created_at')
              .gte('created_at', sinceIso);
            if (requestedUserId) query = query.eq('user_id', requestedUserId);
            const { data, error } = await query.range(from, to);
            return { data: data ?? null, error: error as Error | null };
          }
        );
        return rows.map<AttemptRow>((row) => ({
          user_id: row.user_id,
          correct: row.is_correct,
          created_at: row.created_at,
        }));
      })().catch((error) => {
        if (!isMissingTableError(error)) {
          console.warn('[Admin outcomes timeseries] Failed to read v2_attempts:', error);
        }
        return [] as AttemptRow[];
      }),
      (async () => {
        const rows = await fetchAllRows<{
          user_id: string;
          status: 'due' | 'completed' | 'resolved';
          due_at: string;
          resolved_at: string | null;
          updated_at: string;
        }>(async (from, to) => {
          let query = adminClient
            .from('v2_review_items')
            .select('user_id, status, due_at, resolved_at, updated_at')
            .or(`updated_at.gte.${sinceIso},due_at.gte.${sinceIso},resolved_at.gte.${sinceIso}`);
          if (requestedUserId) query = query.eq('user_id', requestedUserId);
          const { data, error } = await query.range(from, to);
          return { data: data ?? null, error: error as Error | null };
        });
        return rows.map<ReviewQueueRow>((row) => ({
          user_id: row.user_id,
          status: row.status === 'resolved' ? 'resolved' : 'active',
          due_at: row.due_at,
          resolved_at: row.resolved_at,
          updated_at: row.updated_at,
        }));
      })().catch((error) => {
        if (!isMissingTableError(error)) {
          console.warn('[Admin outcomes timeseries] Failed to read v2_review_items:', error);
        }
        return [] as ReviewQueueRow[];
      }),
    ]);

    const allAttempts = [...attempts, ...v2Attempts];
    const allReviewRows = [...reviewRows, ...v2ReviewRows];

    for (const row of allAttempts) {
      const day = toDayKey(row.created_at);
      if (!day) continue;
      const bucket = buckets.get(day);
      if (!bucket) continue;
      bucket.attempts_total += 1;
      if (row.correct) bucket.attempts_correct += 1;
      bucket.active_users.add(row.user_id);
    }

    for (const row of allReviewRows) {
      const dueDay = toDayKey(row.due_at);
      if (dueDay) {
        const dueBucket = buckets.get(dueDay);
        if (dueBucket) dueBucket.review_due += 1;
      }

      const resolvedDay = toDayKey(row.resolved_at);
      if (resolvedDay) {
        const resolvedBucket = buckets.get(resolvedDay);
        if (resolvedBucket) {
          resolvedBucket.review_resolved += 1;
          if (row.resolved_at != null && row.due_at != null && row.resolved_at <= row.due_at) {
            resolvedBucket.review_on_time += 1;
          }
        }
      }
    }

    // Backlog approximation by day: active items due on/before day and unresolved by end-of-day.
    for (const day of dayKeys) {
      const dayEndIso = `${day}T23:59:59.999Z`;
      let activeCount = 0;
      for (const row of allReviewRows) {
        if (row.due_at > dayEndIso) continue;
        if (row.status === 'active') {
          activeCount += 1;
          continue;
        }
        if (row.resolved_at == null || row.resolved_at > dayEndIso) {
          activeCount += 1;
        }
      }
      const bucket = buckets.get(day);
      if (bucket) bucket.review_active = activeCount;
    }

    const timeline = dayKeys.map((day) => {
      const bucket = buckets.get(day)!;
      return {
        date: day,
        active_users: bucket.active_users.size,
        attempts_total: bucket.attempts_total,
        accuracy_pct: toPercent(bucket.attempts_correct, bucket.attempts_total),
        review_due: bucket.review_due,
        review_resolved: bucket.review_resolved,
        review_on_time_pct: toPercent(bucket.review_on_time, bucket.review_due),
        review_active_backlog: bucket.review_active,
      };
    });

    return NextResponse.json({
      success: true,
      window: {
        days,
        since_iso: sinceIso,
        now_iso: new Date().toISOString(),
      },
      user_id: requestedUserId,
      timeline,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
