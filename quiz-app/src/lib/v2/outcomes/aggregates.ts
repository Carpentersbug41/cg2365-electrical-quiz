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

type AttemptRow = {
  user_id: string;
  created_at: string;
  is_correct: boolean;
};

type LessonSessionRow = {
  user_id: string;
  started_at: string;
  completed_at: string | null;
};

type ReviewRow = {
  user_id: string;
  due_at: string;
  resolved_at: string | null;
  updated_at: string;
  times_wrong: number;
  times_right: number;
};

type MasteryRow = {
  user_id: string;
  achieved_at: string | null;
};

type JobRow = {
  requested_by: string | null;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
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

  const studentUserIds = new Set(
    profiles.filter((profile) => profile.role !== 'admin').map((profile) => profile.user_id)
  );

  const [attempts, lessonSessions, reviewItems, masteryRows, jobs] = await Promise.all([
    fetchAllRows<AttemptRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_attempts')
        .select('user_id, created_at, is_correct')
        .gte('created_at', startIso)
        .lt('created_at', endExclusiveIso)
        .range(from, to);
      return { data: data as AttemptRow[] | null, error: error as Error | null };
    }),
    fetchAllRows<LessonSessionRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_lesson_sessions')
        .select('user_id, started_at, completed_at')
        .or(`started_at.gte.${startIso},completed_at.gte.${startIso}`)
        .range(from, to);
      return { data: data as LessonSessionRow[] | null, error: error as Error | null };
    }),
    fetchAllRows<ReviewRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_review_items')
        .select('user_id, due_at, resolved_at, updated_at, times_wrong, times_right')
        .lt('due_at', endExclusiveIso)
        .range(from, to);
      return { data: data as ReviewRow[] | null, error: error as Error | null };
    }),
    fetchAllRows<MasteryRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_mastery_records')
        .select('user_id, achieved_at')
        .gte('achieved_at', startIso)
        .lt('achieved_at', endExclusiveIso)
        .range(from, to);
      return { data: data as MasteryRow[] | null, error: error as Error | null };
    }),
    fetchAllRows<JobRow>(async (from, to) => {
      const { data, error } = await adminClient
        .from('v2_generation_jobs')
        .select('requested_by, status, created_at, started_at, finished_at')
        .or(`created_at.gte.${startIso},finished_at.gte.${startIso}`)
        .range(from, to);
      return { data: data as JobRow[] | null, error: error as Error | null };
    }),
  ]);

  const userMetrics = new Map<string, DailyUserMetricRow>();
  const opsMetrics = new Map<string, DailyOpsMetricRow>();
  const dayKeys = listDayKeys(startDate, endDate);
  const dayIndex = new Map(dayKeys.map((day, index) => [day, index]));

  for (const row of attempts) {
    if (!studentUserIds.has(row.user_id)) continue;
    const day = toUtcDay(row.created_at);
    if (!isDayInRange(day, startDate, endDate)) continue;
    const metric = getUserMetricRow(userMetrics, day, row.user_id);
    metric.attempts_count += 1;
    if (row.is_correct) metric.attempts_correct += 1;
  }

  for (const row of lessonSessions) {
    if (!studentUserIds.has(row.user_id)) continue;
    const startedDay = toUtcDay(row.started_at);
    if (isDayInRange(startedDay, startDate, endDate)) {
      getUserMetricRow(userMetrics, startedDay, row.user_id).lessons_started += 1;
    }
    const completedDay = toUtcDay(row.completed_at);
    if (isDayInRange(completedDay, startDate, endDate)) {
      getUserMetricRow(userMetrics, completedDay, row.user_id).lessons_completed += 1;
    }
  }

  for (const row of masteryRows) {
    if (!studentUserIds.has(row.user_id)) continue;
    const achievedDay = toUtcDay(row.achieved_at);
    if (!isDayInRange(achievedDay, startDate, endDate)) continue;
    getUserMetricRow(userMetrics, achievedDay, row.user_id).mastered_lessons += 1;
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

  for (const row of jobs) {
    const createdDay = toUtcDay(row.created_at);
    if (isDayInRange(createdDay, startDate, endDate)) {
      getOpsMetricRow(opsMetrics, createdDay).generation_jobs_total += 1;
    }

    const finishedDay = toUtcDay(row.finished_at);
    if (isDayInRange(finishedDay, startDate, endDate)) {
      const ops = getOpsMetricRow(opsMetrics, finishedDay);
      if (row.status === 'succeeded') ops.generation_jobs_succeeded += 1;
      if (row.status === 'failed') ops.generation_jobs_failed += 1;

      if (row.started_at && row.finished_at) {
        const startedTs = new Date(row.started_at).getTime();
        const finishedTs = new Date(row.finished_at).getTime();
        if (!Number.isNaN(startedTs) && !Number.isNaN(finishedTs) && finishedTs >= startedTs) {
          ops.generation_duration_ms_sum += finishedTs - startedTs;
          ops.generation_duration_count += 1;
        }
      }
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
