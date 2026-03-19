import type { SupabaseClient } from '@supabase/supabase-js';
import { listV2PrivilegedUserIds } from '@/lib/v2/access';

const DB_PAGE_SIZE = 1000;

type V2AdminClient = {
  from: (table: string) => {
    select: (...args: unknown[]) => any;
    delete?: (...args: unknown[]) => any;
    upsert?: (...args: unknown[]) => any;
  };
};

type ProfileRow = {
  user_id: string;
  role: 'student' | 'admin';
};

type EventRow = {
  event_type: string;
  user_id: string;
  event_ts: string;
  payload: {
    isCorrect?: boolean;
    masteryAchieved?: boolean;
    status?: string;
    durationMs?: number;
  } | null;
};

type ReviewRow = {
  user_id: string;
  due_at: string;
  resolved_at: string | null;
  updated_at: string;
  times_wrong: number;
  times_right: number;
};

type DailyUserMetricRow = {
  day: string;
  user_id: string;
  attempts_count: number;
  attempts_correct: number;
  accuracy_percent: number | null;
  lessons_started: number;
  lessons_completed: number;
  mastered_lessons: number;
  review_due: number;
  review_resolved: number;
  review_on_time: number;
  review_backlog: number;
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

export type RefreshV2DailyMetricsResult = {
  userRowsUpserted: number;
  opsRowsUpserted: number;
  startDate: string;
  endDate: string;
};

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 10000) / 100;
}

function toUtcDay(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function isDayInRange(day: string | null, startDate: string, endDate: string): day is string {
  return day != null && day >= startDate && day <= endDate;
}

function buildWindowBounds(startDate: string, endDate: string) {
  const startIso = `${startDate}T00:00:00.000Z`;
  const endDateObj = new Date(`${endDate}T00:00:00.000Z`);
  endDateObj.setUTCDate(endDateObj.getUTCDate() + 1);
  const endExclusiveIso = endDateObj.toISOString();
  return { startIso, endExclusiveIso };
}

function listDayKeys(startDate: string, endDate: string): string[] {
  const out: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
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
    const page = data ?? [];
    rows.push(...page);
    if (page.length < DB_PAGE_SIZE) break;
    from += DB_PAGE_SIZE;
  }
  return rows;
}

function getUserMetricRow(
  bucket: Map<string, DailyUserMetricRow>,
  day: string,
  userId: string
): DailyUserMetricRow {
  const key = `${day}:${userId}`;
  const existing = bucket.get(key);
  if (existing) return existing;
  const row: DailyUserMetricRow = {
    day,
    user_id: userId,
    attempts_count: 0,
    attempts_correct: 0,
    accuracy_percent: null,
    lessons_started: 0,
    lessons_completed: 0,
    mastered_lessons: 0,
    review_due: 0,
    review_resolved: 0,
    review_on_time: 0,
    review_backlog: 0,
    review_recovery_denominator: 0,
    review_recovery_numerator: 0,
  };
  bucket.set(key, row);
  return row;
}

function getOpsMetricRow(bucket: Map<string, DailyOpsMetricRow>, day: string): DailyOpsMetricRow {
  const existing = bucket.get(day);
  if (existing) return existing;
  const row: DailyOpsMetricRow = {
    day,
    generation_jobs_total: 0,
    generation_jobs_succeeded: 0,
    generation_jobs_failed: 0,
    generation_duration_ms_sum: 0,
    generation_duration_count: 0,
  };
  bucket.set(day, row);
  return row;
}

export async function refreshV2DailyMetrics(
  adminClient: V2AdminClient,
  options: { startDate: string; endDate: string }
): Promise<RefreshV2DailyMetricsResult> {
  const { startDate, endDate } = options;
  const { startIso, endExclusiveIso } = buildWindowBounds(startDate, endDate);

  const profiles = await fetchAllRows<ProfileRow>(async (from, to) => {
    const { data, error } = await adminClient.from('profiles').select('user_id, role').range(from, to);
    return { data: data as ProfileRow[] | null, error: error as Error | null };
  });

  const privilegedUserIds = await listV2PrivilegedUserIds(adminClient as SupabaseClient);
  const studentUserIds = new Set(
    profiles
      .filter((profile) => profile.role !== 'admin')
      .map((profile) => profile.user_id)
      .filter((userId) => !privilegedUserIds.has(userId))
  );

  const [events, reviewItems] = await Promise.all([
    fetchAllRows<EventRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_event_log')
        .select('event_type, user_id, event_ts, payload')
        .gte('event_ts', startIso)
        .lt('event_ts', endExclusiveIso)
        .range(from, to);
      return { data: data as EventRow[] | null, error: error as Error | null };
    }),
    fetchAllRows<ReviewRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_review_items')
        .select('user_id, due_at, resolved_at, updated_at, times_wrong, times_right')
        .lt('due_at', endExclusiveIso)
        .range(from, to);
      return { data: data as ReviewRow[] | null, error: error as Error | null };
    }),
  ]);

  const userMetrics = new Map<string, DailyUserMetricRow>();
  const opsMetrics = new Map<string, DailyOpsMetricRow>();
  const dayKeys = listDayKeys(startDate, endDate);
  const dayIndex = new Map(dayKeys.map((day, index) => [day, index]));

  for (const row of events) {
    const day = toUtcDay(row.event_ts);
    if (!isDayInRange(day, startDate, endDate)) continue;
    if (row.event_type === 'generation_job_started') {
      getOpsMetricRow(opsMetrics, day).generation_jobs_total += 1;
      continue;
    }
    if (row.event_type === 'generation_job_completed') {
      const ops = getOpsMetricRow(opsMetrics, day);
      const status = typeof row.payload?.status === 'string' ? row.payload.status : '';
      if (status === 'succeeded') ops.generation_jobs_succeeded += 1;
      if (status === 'failed') ops.generation_jobs_failed += 1;
      if (typeof row.payload?.durationMs === 'number' && row.payload.durationMs >= 0) {
        ops.generation_duration_ms_sum += row.payload.durationMs;
        ops.generation_duration_count += 1;
      }
      continue;
    }
    if (!row.user_id || !studentUserIds.has(row.user_id)) continue;
    const metric = getUserMetricRow(userMetrics, day, row.user_id);
    if (row.event_type === 'question_attempted') {
      metric.attempts_count += 1;
      if (row.payload?.isCorrect === true) metric.attempts_correct += 1;
      continue;
    }
    if (row.event_type === 'lesson_started') {
      metric.lessons_started += 1;
      continue;
    }
    if (row.event_type === 'lesson_completed') {
      metric.lessons_completed += 1;
      if (row.payload?.masteryAchieved === true) {
        metric.mastered_lessons += 1;
      }
      continue;
    }
    if (row.event_type === 'review_item_due') {
      metric.review_due += 1;
      continue;
    }
    if (row.event_type === 'review_item_resolved') {
      metric.review_resolved += 1;
    }
  }

  for (const row of reviewItems) {
    if (!studentUserIds.has(row.user_id)) continue;

    const dueDay = toUtcDay(row.due_at);
    if (isDayInRange(dueDay, startDate, endDate)) {
      getUserMetricRow(userMetrics, dueDay, row.user_id).review_due += 1;
    }

    const resolvedDay = toUtcDay(row.resolved_at);
    if (isDayInRange(resolvedDay, startDate, endDate)) {
      const metric = getUserMetricRow(userMetrics, resolvedDay, row.user_id);
      metric.review_resolved += 1;
      if (row.resolved_at != null && row.resolved_at <= row.due_at) {
        metric.review_on_time += 1;
      }
    }

    const updatedDay = toUtcDay(row.updated_at);
    if (isDayInRange(updatedDay, startDate, endDate) && row.times_wrong > 0) {
      const metric = getUserMetricRow(userMetrics, updatedDay, row.user_id);
      metric.review_recovery_denominator += 1;
      if (row.times_right > 0) {
        metric.review_recovery_numerator += 1;
      }
    }

    const dueIndex = dueDay ? dayIndex.get(dueDay) : undefined;
    const resolvedIndex = resolvedDay ? dayIndex.get(resolvedDay) : undefined;
    if (dueIndex == null) continue;
    const backlogStartIndex = dueIndex;
    const backlogEndIndex =
      resolvedIndex == null ? dayKeys.length - 1 : Math.min(dayKeys.length - 1, resolvedIndex - 1);

    if (backlogEndIndex < backlogStartIndex) continue;
    for (let index = backlogStartIndex; index <= backlogEndIndex; index += 1) {
      const backlogDay = dayKeys[index];
      getUserMetricRow(userMetrics, backlogDay, row.user_id).review_backlog += 1;
    }
  }

  const userMetricRows = Array.from(userMetrics.values()).map((row) => ({
    ...row,
    accuracy_percent: toPercent(row.attempts_correct, row.attempts_count),
  }));
  const opsMetricRows = Array.from(opsMetrics.values());

  const deleteUserQuery = adminClient.from('v2_daily_user_metrics').delete();
  if (typeof deleteUserQuery.gte === 'function') {
    await deleteUserQuery.gte('day', startDate).lte('day', endDate);
  }

  const deleteOpsQuery = adminClient.from('v2_daily_ops_metrics').delete();
  if (typeof deleteOpsQuery.gte === 'function') {
    await deleteOpsQuery.gte('day', startDate).lte('day', endDate);
  }

  if (userMetricRows.length > 0) {
    const { error } = await adminClient
      .from('v2_daily_user_metrics')
      .upsert(userMetricRows, { onConflict: 'day,user_id' });
    if (error) throw error;
  }

  if (opsMetricRows.length > 0) {
    const { error } = await adminClient.from('v2_daily_ops_metrics').upsert(opsMetricRows, { onConflict: 'day' });
    if (error) throw error;
  }

  return {
    userRowsUpserted: userMetricRows.length,
    opsRowsUpserted: opsMetricRows.length,
    startDate,
    endDate,
  };
}
