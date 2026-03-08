'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

type AdminProfileRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'student' | 'admin';
  course_id: string | null;
  tutor_profile_summary: string | null;
  updated_at: string;
};

type UserOutcomesRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'student' | 'admin';
  course_id: string | null;
  window_days: number;
  learning: {
    attempts_total: number;
    overall_accuracy_pct: number | null;
    question_count: number;
    first_attempt_accuracy_pct: number | null;
    latest_attempt_accuracy_pct: number | null;
    score_delta_pct: number | null;
    mastery_achieved_lessons: number;
    mastery_rate_pct: number | null;
  };
  behavior: {
    lessons_started: number;
    lessons_completed: number;
    lesson_completion_rate_pct: number | null;
    active_days: number;
  };
  review: {
    due_count: number;
    resolved_count: number;
    resolved_rate_pct: number | null;
    on_time_rate_pct: number | null;
    error_recovery_rate_pct: number | null;
  };
  operations: {
    active_quiz_set_count: number;
    median_response_time_ms: number | null;
  };
};

type OutcomesResponse = {
  success: boolean;
  window: {
    days: number;
    since_iso: string;
    now_iso: string;
  };
  totals: {
    users: number;
    attempts: number;
    activeUsers: number;
    averageAccuracyPct: number | null;
  };
  users: UserOutcomesRow[];
};

type TimeSeriesPoint = {
  date: string;
  active_users: number;
  attempts_total: number;
  accuracy_pct: number | null;
  review_due: number;
  review_resolved: number;
  review_on_time_pct: number | null;
  review_active_backlog: number;
};

type OutcomesTimeSeriesResponse = {
  success: boolean;
  window: {
    days: number;
    since_iso: string;
    now_iso: string;
  };
  timeline: TimeSeriesPoint[];
};

type SortKey =
  | 'name'
  | 'accuracy'
  | 'delta'
  | 'completion'
  | 'activeDays'
  | 'reviewResolved'
  | 'mastery';

function Sparkline({
  values,
  stroke,
}: {
  values: number[];
  stroke: string;
}) {
  if (values.length === 0) {
    return <div className="h-20 rounded border border-slate-200 bg-slate-50" />;
  }

  const width = 360;
  const height = 80;
  const padding = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const yRange = max - min || 1;

  const points = values
    .map((value, idx) => {
      const x =
        values.length === 1
          ? width / 2
          : padding + (idx / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / yRange) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full rounded border border-slate-200 bg-white">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function escapeCsvCell(value: unknown): string {
  const raw = value == null ? '' : String(value);
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map((header) => escapeCsvCell(header)).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function adminAuthedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const client = getSupabaseBrowserClient();
  const session = client ? await client.auth.getSession() : null;
  const token = session?.data.session?.access_token ?? null;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [draftByUser, setDraftByUser] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [windowDays, setWindowDays] = useState(30);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [outcomes, setOutcomes] = useState<UserOutcomesRow[]>([]);
  const [outcomesSummary, setOutcomesSummary] = useState<OutcomesResponse['totals'] | null>(null);
  const [outcomesWindow, setOutcomesWindow] = useState<OutcomesResponse['window'] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('activeDays');
  const [loadingTimeSeries, setLoadingTimeSeries] = useState(false);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOutcomesRow | null>(null);
  const [selectedUserSeries, setSelectedUserSeries] = useState<TimeSeriesPoint[]>([]);
  const [loadingSelectedUserSeries, setLoadingSelectedUserSeries] = useState(false);
  const [seedingV2, setSeedingV2] = useState(false);

  const filteredProfiles = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter((row) => {
      const haystack = [
        row.email ?? '',
        row.display_name ?? '',
        row.user_id,
        row.role,
        row.course_id ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [profiles, search]);

  const filteredOutcomes = useMemo(() => {
    const profileIds = new Set(filteredProfiles.map((row) => row.user_id));
    const visible = outcomes.filter((row) => profileIds.has(row.user_id));
    const sorted = [...visible].sort((a, b) => {
      if (sortKey === 'name') {
        const left = (a.display_name ?? a.email ?? a.user_id).toLowerCase();
        const right = (b.display_name ?? b.email ?? b.user_id).toLowerCase();
        return left.localeCompare(right);
      }
      if (sortKey === 'accuracy') {
        return (b.learning.overall_accuracy_pct ?? -1) - (a.learning.overall_accuracy_pct ?? -1);
      }
      if (sortKey === 'delta') {
        return (b.learning.score_delta_pct ?? -999) - (a.learning.score_delta_pct ?? -999);
      }
      if (sortKey === 'completion') {
        return (b.behavior.lesson_completion_rate_pct ?? -1) - (a.behavior.lesson_completion_rate_pct ?? -1);
      }
      if (sortKey === 'reviewResolved') {
        return (b.review.resolved_rate_pct ?? -1) - (a.review.resolved_rate_pct ?? -1);
      }
      if (sortKey === 'mastery') {
        return (b.learning.mastery_rate_pct ?? -1) - (a.learning.mastery_rate_pct ?? -1);
      }
      return b.behavior.active_days - a.behavior.active_days;
    });
    return sorted;
  }, [filteredProfiles, outcomes, sortKey]);

  const formatPct = (value: number | null): string => {
    if (value == null || Number.isNaN(value)) return '-';
    return `${value.toFixed(1)}%`;
  };

  const chartData = useMemo(() => {
    return {
      activeUsers: timeSeries.map((row) => row.active_users),
      accuracy: timeSeries.map((row) => row.accuracy_pct ?? 0),
      attempts: timeSeries.map((row) => row.attempts_total),
      reviewBacklog: timeSeries.map((row) => row.review_active_backlog),
      reviewResolved: timeSeries.map((row) => row.review_resolved),
    };
  }, [timeSeries]);

  const selectedUserChartData = useMemo(() => {
    return {
      attempts: selectedUserSeries.map((row) => row.attempts_total),
      accuracy: selectedUserSeries.map((row) => row.accuracy_pct ?? 0),
      reviewBacklog: selectedUserSeries.map((row) => row.review_active_backlog),
      reviewResolved: selectedUserSeries.map((row) => row.review_resolved),
    };
  }, [selectedUserSeries]);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthedFetch('/api/admin/users/profiles', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.success === false || !Array.isArray(data.profiles)) {
        throw new Error(data.message ?? 'Failed to load user profiles.');
      }
      const nextProfiles = data.profiles as AdminProfileRow[];
      setProfiles(nextProfiles);
      setDraftByUser(
        Object.fromEntries(nextProfiles.map((row) => [row.user_id, row.tutor_profile_summary ?? '']))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfiles();
  }, []);

  const loadOutcomes = useCallback(async (days = windowDays) => {
    setLoadingOutcomes(true);
    setError(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/users/outcomes?days=${days}`, { cache: 'no-store' });
      const data = (await response.json()) as OutcomesResponse & { message?: string };
      if (!response.ok || data.success === false || !Array.isArray(data.users)) {
        throw new Error(data.message ?? 'Failed to load outcomes dashboard.');
      }
      setOutcomes(data.users);
      setOutcomesSummary(data.totals);
      setOutcomesWindow(data.window);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load outcomes dashboard.');
    } finally {
      setLoadingOutcomes(false);
    }
  }, [windowDays]);

  const loadTimeSeries = useCallback(async (days = windowDays) => {
    setLoadingTimeSeries(true);
    setError(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/users/outcomes/timeseries?days=${days}`, {
        cache: 'no-store',
      });
      const data = (await response.json()) as OutcomesTimeSeriesResponse & { message?: string };
      if (!response.ok || data.success === false || !Array.isArray(data.timeline)) {
        throw new Error(data.message ?? 'Failed to load outcomes time series.');
      }
      setTimeSeries(data.timeline);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load outcomes time series.');
    } finally {
      setLoadingTimeSeries(false);
    }
  }, [windowDays]);

  const loadSelectedUserSeries = useCallback(async (userId: string, days = windowDays) => {
    setLoadingSelectedUserSeries(true);
    setError(null);
    try {
      const response = await adminAuthedFetch(
        `/api/admin/users/outcomes/timeseries?days=${days}&userId=${encodeURIComponent(userId)}`,
        { cache: 'no-store' }
      );
      const data = (await response.json()) as OutcomesTimeSeriesResponse & { message?: string };
      if (!response.ok || data.success === false || !Array.isArray(data.timeline)) {
        throw new Error(data.message ?? 'Failed to load selected user trends.');
      }
      setSelectedUserSeries(data.timeline);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load selected user trends.');
      setSelectedUserSeries([]);
    } finally {
      setLoadingSelectedUserSeries(false);
    }
  }, [windowDays]);

  useEffect(() => {
    void loadOutcomes(windowDays);
  }, [windowDays, loadOutcomes]);

  useEffect(() => {
    void loadTimeSeries(windowDays);
  }, [windowDays, loadTimeSeries]);

  useEffect(() => {
    if (!selectedUser) return;
    void loadSelectedUserSeries(selectedUser.user_id, windowDays);
  }, [selectedUser, windowDays, loadSelectedUserSeries]);

  const exportOutcomesCsv = () => {
    const rows = filteredOutcomes.map((row) => ({
      user_id: row.user_id,
      email: row.email ?? '',
      display_name: row.display_name ?? '',
      role: row.role,
      course_id: row.course_id ?? '',
      attempts_total: row.learning.attempts_total,
      overall_accuracy_pct: row.learning.overall_accuracy_pct ?? '',
      first_attempt_accuracy_pct: row.learning.first_attempt_accuracy_pct ?? '',
      latest_attempt_accuracy_pct: row.learning.latest_attempt_accuracy_pct ?? '',
      score_delta_pct: row.learning.score_delta_pct ?? '',
      lessons_started: row.behavior.lessons_started,
      lessons_completed: row.behavior.lessons_completed,
      lesson_completion_rate_pct: row.behavior.lesson_completion_rate_pct ?? '',
      mastery_achieved_lessons: row.learning.mastery_achieved_lessons,
      mastery_rate_pct: row.learning.mastery_rate_pct ?? '',
      active_days: row.behavior.active_days,
      review_due_count: row.review.due_count,
      review_resolved_count: row.review.resolved_count,
      review_resolved_rate_pct: row.review.resolved_rate_pct ?? '',
      review_on_time_rate_pct: row.review.on_time_rate_pct ?? '',
      error_recovery_rate_pct: row.review.error_recovery_rate_pct ?? '',
      active_quiz_set_count: row.operations.active_quiz_set_count,
      median_response_time_ms: row.operations.median_response_time_ms ?? '',
    }));
    downloadCsv(`user-outcomes-${windowDays}d.csv`, rows);
  };

  const exportTrendsCsv = () => {
    const rows = timeSeries.map((row) => ({
      date: row.date,
      active_users: row.active_users,
      attempts_total: row.attempts_total,
      accuracy_pct: row.accuracy_pct ?? '',
      review_due: row.review_due,
      review_resolved: row.review_resolved,
      review_on_time_pct: row.review_on_time_pct ?? '',
      review_active_backlog: row.review_active_backlog,
    }));
    downloadCsv(`outcome-trends-${windowDays}d.csv`, rows);
  };

  const exportSelectedUserTrendsCsv = () => {
    if (!selectedUser) return;
    const rows = selectedUserSeries.map((row) => ({
      date: row.date,
      attempts_total: row.attempts_total,
      accuracy_pct: row.accuracy_pct ?? '',
      review_due: row.review_due,
      review_resolved: row.review_resolved,
      review_on_time_pct: row.review_on_time_pct ?? '',
      review_active_backlog: row.review_active_backlog,
    }));
    const slug = (selectedUser.email ?? selectedUser.user_id).replace(/[^a-zA-Z0-9_.-]/g, '_');
    downloadCsv(`user-trends-${slug}-${windowDays}d.csv`, rows);
  };

  const saveProfileSummary = async (userId: string) => {
    setSavingUserId(userId);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/users/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tutorProfileSummary: draftByUser[userId] ?? '',
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false || !data.profile) {
        throw new Error(data.message ?? 'Failed to save profile summary.');
      }

      const updated = data.profile as AdminProfileRow;
      setProfiles((prev) => prev.map((row) => (row.user_id === userId ? updated : row)));
      setDraftByUser((prev) => ({ ...prev, [userId]: updated.tutor_profile_summary ?? '' }));
      setInfo(`Saved profile injection for ${updated.email ?? updated.user_id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile summary.');
    } finally {
      setSavingUserId(null);
    }
  };

  const runV2BiologySeed = async (dryRun: boolean) => {
    setSeedingV2(true);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/v2/seed-gcse-biology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        runStats?: {
          lessonsFound?: number;
          versionsInserted?: number;
          versionsWouldPublish?: number;
          versionsSkippedUnchanged?: number;
        };
      };
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to seed V2 GCSE Biology content.');
      }

      const found = data.runStats?.lessonsFound ?? 0;
      const inserted = data.runStats?.versionsInserted ?? 0;
      const wouldPublish = data.runStats?.versionsWouldPublish ?? 0;
      const skipped = data.runStats?.versionsSkippedUnchanged ?? 0;
      setInfo(
        dryRun
          ? `V2 biology dry-run complete. Lessons found: ${found}. Would publish versions: ${wouldPublish}.`
          : `V2 biology seed complete. Lessons found: ${found}, versions published: ${inserted}, unchanged: ${skipped}.`
      );

      if (!dryRun) {
        await Promise.all([loadOutcomes(windowDays), loadTimeSeries(windowDays)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed V2 GCSE Biology content.');
    } finally {
      setSeedingV2(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">User Tutor Profile Injections</h1>
              <p className="mt-2 text-sm text-slate-600">
                Edit the short personalization text injected into tutor prompts. Keep it to 1-3 sentences.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={courseHref('/admin')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to Admin
              </Link>
              <button
                type="button"
                onClick={() => void loadProfiles()}
                disabled={loading}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-60"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={() => void loadOutcomes(windowDays)}
                disabled={loadingOutcomes}
                className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
              >
                {loadingOutcomes ? 'Loading outcomes...' : 'Refresh Outcomes'}
              </button>
              <button
                type="button"
                onClick={() => void loadTimeSeries(windowDays)}
                disabled={loadingTimeSeries}
                className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-100 disabled:opacity-60"
              >
                {loadingTimeSeries ? 'Loading charts...' : 'Refresh Charts'}
              </button>
              <button
                type="button"
                onClick={() => void runV2BiologySeed(true)}
                disabled={seedingV2}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60"
              >
                {seedingV2 ? 'Running...' : 'V2 Biology Dry Run'}
              </button>
              <button
                type="button"
                onClick={() => void runV2BiologySeed(false)}
                disabled={seedingV2}
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
              >
                {seedingV2 ? 'Running...' : 'Seed V2 Biology'}
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email, name, user id, role..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:max-w-md"
            />
            <p className="text-sm text-slate-500">
              Showing {filteredProfiles.length} of {profiles.length} users
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">User Outcomes Dashboard</h2>
              <p className="text-sm text-slate-600">
                Learning, behavior, and review metrics per user for the selected time window.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-700">
                Window
                <select
                  value={windowDays}
                  onChange={(event) => setWindowDays(Number.parseInt(event.target.value, 10))}
                  className="ml-2 rounded border border-slate-300 px-2 py-1 text-sm"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                Sort
                <select
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as SortKey)}
                  className="ml-2 rounded border border-slate-300 px-2 py-1 text-sm"
                >
                  <option value="activeDays">Active days</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="delta">Score delta</option>
                  <option value="completion">Completion</option>
                  <option value="mastery">Mastery</option>
                  <option value="reviewResolved">Review resolved</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Users in window</p>
              <p className="text-xl font-semibold text-slate-900">{outcomesSummary?.users ?? 0}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Active users</p>
              <p className="text-xl font-semibold text-slate-900">{outcomesSummary?.activeUsers ?? 0}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Attempts logged</p>
              <p className="text-xl font-semibold text-slate-900">{outcomesSummary?.attempts ?? 0}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Avg accuracy</p>
              <p className="text-xl font-semibold text-slate-900">{formatPct(outcomesSummary?.averageAccuracyPct ?? null)}</p>
            </div>
          </div>

          {outcomesWindow && (
            <p className="text-xs text-slate-500">
              Window starts {new Date(outcomesWindow.since_iso).toLocaleString()}.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportOutcomesCsv}
              disabled={filteredOutcomes.length === 0}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Export User Outcomes CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Attempts</th>
                  <th className="px-3 py-2">Accuracy</th>
                  <th className="px-3 py-2">Delta</th>
                  <th className="px-3 py-2">Lessons</th>
                  <th className="px-3 py-2">Mastery</th>
                  <th className="px-3 py-2">Active days</th>
                  <th className="px-3 py-2">Review</th>
                  <th className="px-3 py-2">Median RT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredOutcomes.map((row) => (
                  <tr key={`outcome-${row.user_id}`} className="align-top">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(row)}
                        className="text-left font-medium text-slate-900 underline decoration-dotted underline-offset-2 hover:text-slate-700"
                      >
                        {row.display_name ?? row.email ?? row.user_id}
                      </button>
                      <p className="text-xs text-slate-500">{row.email ?? row.user_id}</p>
                    </td>
                    <td className="px-3 py-2">{row.learning.attempts_total}</td>
                    <td className="px-3 py-2">
                      <p>{formatPct(row.learning.overall_accuracy_pct)}</p>
                      <p className="text-xs text-slate-500">first {formatPct(row.learning.first_attempt_accuracy_pct)}</p>
                      <p className="text-xs text-slate-500">latest {formatPct(row.learning.latest_attempt_accuracy_pct)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          row.learning.score_delta_pct != null && row.learning.score_delta_pct > 0
                            ? 'text-emerald-700'
                            : row.learning.score_delta_pct != null && row.learning.score_delta_pct < 0
                              ? 'text-rose-700'
                              : 'text-slate-600'
                        }
                      >
                        {row.learning.score_delta_pct == null ? '-' : `${row.learning.score_delta_pct.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <p>
                        {row.behavior.lessons_completed}/{row.behavior.lessons_started}
                      </p>
                      <p className="text-xs text-slate-500">{formatPct(row.behavior.lesson_completion_rate_pct)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p>{row.learning.mastery_achieved_lessons}</p>
                      <p className="text-xs text-slate-500">{formatPct(row.learning.mastery_rate_pct)}</p>
                    </td>
                    <td className="px-3 py-2">{row.behavior.active_days}</td>
                    <td className="px-3 py-2">
                      <p>
                        {row.review.resolved_count}/{row.review.due_count}
                      </p>
                      <p className="text-xs text-slate-500">resolved {formatPct(row.review.resolved_rate_pct)}</p>
                      <p className="text-xs text-slate-500">on-time {formatPct(row.review.on_time_rate_pct)}</p>
                    </td>
                    <td className="px-3 py-2">
                      {row.operations.median_response_time_ms == null
                        ? '-'
                        : `${Math.round(row.operations.median_response_time_ms / 1000)}s`}
                    </td>
                  </tr>
                ))}

                {!loadingOutcomes && filteredOutcomes.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-slate-600" colSpan={9}>
                      No outcome data for the current filters/window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daily Trends</h2>
              <p className="text-sm text-slate-600">
                Time-series view for activity, learning performance, and review workload.
              </p>
            </div>
            <p className="text-xs text-slate-500">{timeSeries.length} points</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Active Users / day</h3>
                <span className="text-xs text-slate-500">
                  latest {chartData.activeUsers.at(-1) ?? 0}
                </span>
              </div>
              <Sparkline values={chartData.activeUsers} stroke="#0f766e" />
            </article>

            <article className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Accuracy % / day</h3>
                <span className="text-xs text-slate-500">
                  latest {formatPct(timeSeries.at(-1)?.accuracy_pct ?? null)}
                </span>
              </div>
              <Sparkline values={chartData.accuracy} stroke="#4338ca" />
            </article>

            <article className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Attempts / day</h3>
                <span className="text-xs text-slate-500">
                  latest {chartData.attempts.at(-1) ?? 0}
                </span>
              </div>
              <Sparkline values={chartData.attempts} stroke="#0369a1" />
            </article>

            <article className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Review Backlog / day</h3>
                <span className="text-xs text-slate-500">
                  latest {chartData.reviewBacklog.at(-1) ?? 0}
                </span>
              </div>
              <Sparkline values={chartData.reviewBacklog} stroke="#b45309" />
            </article>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportTrendsCsv}
              disabled={timeSeries.length === 0}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Export Daily Trends CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Active users</th>
                  <th className="px-3 py-2 text-left">Attempts</th>
                  <th className="px-3 py-2 text-left">Accuracy</th>
                  <th className="px-3 py-2 text-left">Review due</th>
                  <th className="px-3 py-2 text-left">Review resolved</th>
                  <th className="px-3 py-2 text-left">On-time %</th>
                  <th className="px-3 py-2 text-left">Backlog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSeries.slice(-14).map((row) => (
                  <tr key={`day-${row.date}`}>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.active_users}</td>
                    <td className="px-3 py-2">{row.attempts_total}</td>
                    <td className="px-3 py-2">{formatPct(row.accuracy_pct)}</td>
                    <td className="px-3 py-2">{row.review_due}</td>
                    <td className="px-3 py-2">{row.review_resolved}</td>
                    <td className="px-3 py-2">{formatPct(row.review_on_time_pct)}</td>
                    <td className="px-3 py-2">{row.review_active_backlog}</td>
                  </tr>
                ))}
                {!loadingTimeSeries && timeSeries.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-slate-600" colSpan={8}>
                      No daily trend data available in this window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedUser && (
          <section className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">User Drill-down</h2>
                <p className="text-sm text-slate-700">
                  {selectedUser.display_name ?? selectedUser.email ?? selectedUser.user_id}
                </p>
                <p className="text-xs text-slate-500">{selectedUser.email ?? selectedUser.user_id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void loadSelectedUserSeries(selectedUser.user_id, windowDays)}
                  disabled={loadingSelectedUserSeries}
                  className="rounded-lg border border-indigo-300 bg-white px-3 py-2 text-xs font-medium text-indigo-800 hover:bg-indigo-50 disabled:opacity-60"
                >
                  {loadingSelectedUserSeries ? 'Loading...' : 'Refresh User Trend'}
                </button>
                <button
                  type="button"
                  onClick={exportSelectedUserTrendsCsv}
                  disabled={selectedUserSeries.length === 0}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Export User Trend CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserSeries([]);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Attempts / day</h3>
                  <span className="text-xs text-slate-500">
                    latest {selectedUserChartData.attempts.at(-1) ?? 0}
                  </span>
                </div>
                <Sparkline values={selectedUserChartData.attempts} stroke="#1d4ed8" />
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Accuracy % / day</h3>
                  <span className="text-xs text-slate-500">
                    latest {formatPct(selectedUserSeries.at(-1)?.accuracy_pct ?? null)}
                  </span>
                </div>
                <Sparkline values={selectedUserChartData.accuracy} stroke="#4f46e5" />
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Review Backlog / day</h3>
                  <span className="text-xs text-slate-500">
                    latest {selectedUserChartData.reviewBacklog.at(-1) ?? 0}
                  </span>
                </div>
                <Sparkline values={selectedUserChartData.reviewBacklog} stroke="#b45309" />
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Review Resolved / day</h3>
                  <span className="text-xs text-slate-500">
                    latest {selectedUserChartData.reviewResolved.at(-1) ?? 0}
                  </span>
                </div>
                <Sparkline values={selectedUserChartData.reviewResolved} stroke="#0f766e" />
              </article>
            </div>
          </section>
        )}

        {error && (
          <section className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </section>
        )}
        {info && (
          <section className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">
            {info}
          </section>
        )}

        <section className="space-y-3">
          {filteredProfiles.map((row) => {
            const draft = draftByUser[row.user_id] ?? '';
            const isSaving = savingUserId === row.user_id;
            const unchanged = (row.tutor_profile_summary ?? '') === draft;
            return (
              <article key={row.user_id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{row.display_name ?? row.email ?? row.user_id}</p>
                    <p className="text-xs text-slate-500">
                      {row.email ?? 'No email'} | {row.role} | course {row.course_id ?? '-'}
                    </p>
                    <p className="text-xs text-slate-400">User ID: {row.user_id}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Updated {new Date(row.updated_at).toLocaleString()}
                  </p>
                </div>
                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Tutor profile injection
                  <textarea
                    value={draft}
                    onChange={(event) =>
                      setDraftByUser((prev) => ({ ...prev, [row.user_id]: event.target.value.slice(0, 500) }))
                    }
                    rows={3}
                    placeholder="Student prefers concise step-by-step explanations and calm encouragement. Use sports examples where relevant."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{draft.length}/500 characters</p>
                  <button
                    type="button"
                    onClick={() => void saveProfileSummary(row.user_id)}
                    disabled={isSaving || unchanged}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </article>
            );
          })}

          {!loading && filteredProfiles.length === 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No users found for this filter.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
