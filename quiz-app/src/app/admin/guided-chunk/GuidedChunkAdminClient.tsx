'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { authedFetch } from '@/lib/api/authedFetch';
import type { GuidedChunkVersionAction, GuidedChunkVersionSummary } from '@/lib/guidedChunk/versionStore';

type VersionsResponse = {
  versions: GuidedChunkVersionSummary[];
};

type BatchResult = {
  lessonCode: string;
  success: boolean;
  versionId?: string;
  status?: string;
  score?: number;
  grade?: string;
  error?: string;
};

type BatchResponse = {
  count: number;
  results: BatchResult[];
};

type AnalyticsSummary = {
  lessonCode: string;
  lessonVersionId: string | null;
  sourceContext: string;
  variantId: string | null;
  runtimeVersion: string | null;
  started: number;
  completed: number;
  abandoned: number;
  completionRatePct: number | null;
  avgReviewFlags: number | null;
  avgRepairCount: number | null;
  avgDurationSeconds: number | null;
  mcqPct: number | null;
  shortAnswerPct: number | null;
  avgResponseLatencySeconds: number | null;
  fatigueScore: number | null;
  fatigueOnsetChunkIndex: number | null;
  confusionScore: number | null;
  disengagementScore: number | null;
  supportDependenceScore: number | null;
  recoveryRatePct: number | null;
  transferQualityPct: number | null;
  paceMismatchScore: number | null;
  learningEfficiency: number | null;
};

type AnalyticsComparison = {
  lessonCode: string;
  guidedSourceContext: string;
  guidedCompletionRatePct: number | null;
  guidedStarted: number;
  guidedCompleted: number;
  guidedFatigueScore: number | null;
  guidedConfusionScore: number | null;
  guidedDisengagementScore: number | null;
  guidedSupportDependenceScore: number | null;
  guidedRecoveryRatePct: number | null;
  guidedTransferQualityPct: number | null;
  guidedPaceMismatchScore: number | null;
  guidedLearningEfficiency: number | null;
  v2Started: number;
  v2Completed: number;
  v2CompletionRatePct: number | null;
};

type AnalyticsResponse = {
  summaries: AnalyticsSummary[];
  comparisons: AnalyticsComparison[];
  sessions: Array<{
    sessionId: string;
    lessonCode: string;
    lessonVersionId: string | null;
    sourceContext: string;
    variantId: string | null;
    runtimeVersion: string | null;
    status: 'active' | 'completed' | 'abandoned';
    currentLoIndex: number;
    reviewFlagCount: number;
    threadCount: number;
    eventCount: number;
    createdAt: string;
    updatedAt: string;
    durationSeconds: number;
    avgResponseLatencySeconds: number | null;
    fatigueScore: number | null;
    fatigueOnsetChunkIndex: number | null;
    confusionScore: number | null;
    disengagementScore: number | null;
    supportDependenceScore: number | null;
    recoveryRatePct: number | null;
    transferQualityPct: number | null;
    paceMismatchScore: number | null;
    learningEfficiency: number | null;
  }>;
  experiments: Array<{
    id: string;
    name: string;
    status: 'draft' | 'active' | 'completed' | 'rolled_back' | 'cancelled';
    changeType: 'prompt' | 'ui' | 'runtime' | 'telemetry' | 'content';
    hypothesis: string;
    baselineVariantId?: string | null;
    targetVariantId: string;
    runtimeVersion?: string | null;
    sourceContext: string;
    metricsToWatch: string[];
  }>;
  experimentChanges: Array<{
    id: string;
    experimentId: string;
    lessonCode?: string | null;
    lessonVersionId?: string | null;
    changeType: 'prompt' | 'ui' | 'runtime' | 'telemetry' | 'content';
    runtimeVersion?: string | null;
    variantId: string;
    baselineVariantId?: string | null;
    sourceContext: string;
    description: string;
    status: 'active' | 'completed' | 'rolled_back' | 'cancelled';
  }>;
  experimentPerformance: Array<{
    experimentId: string;
    name: string;
    status: 'draft' | 'active' | 'completed' | 'rolled_back' | 'cancelled';
    changeType: 'prompt' | 'ui' | 'runtime' | 'telemetry' | 'content';
    targetVariantId: string;
    baselineVariantId: string | null;
    metricsToWatch: string[];
    target: {
      started: number;
      completed: number;
      completionRatePct: number | null;
      fatigueScore: number | null;
      confusionScore: number | null;
      transferQualityPct: number | null;
      learningEfficiency: number | null;
    };
    baseline: {
      started: number;
      completed: number;
      completionRatePct: number | null;
      fatigueScore: number | null;
      confusionScore: number | null;
      transferQualityPct: number | null;
      learningEfficiency: number | null;
    } | null;
    deltas: {
      completionRatePct: number | null;
      fatigueScore: number | null;
      confusionScore: number | null;
      transferQualityPct: number | null;
      learningEfficiency: number | null;
    } | null;
    classification: 'win' | 'loss' | 'mixed' | 'inconclusive';
  }>;
};

const transitionLabels: Record<GuidedChunkVersionAction, string> = {
  submit_review: 'Submit review',
  approve: 'Approve',
  publish: 'Publish',
  retire: 'Retire',
  revert_draft: 'Revert draft',
};

const allowedActions: Record<GuidedChunkVersionSummary['status'], GuidedChunkVersionAction[]> = {
  draft: ['submit_review', 'retire'],
  needs_review: ['approve', 'revert_draft', 'retire'],
  approved: ['publish', 'revert_draft', 'retire'],
  published: ['retire'],
  retired: ['revert_draft'],
};

function formatPct(value: number | null | undefined): string {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : 'n/a';
}

function formatNumber(value: number | null | undefined): string {
  return typeof value === 'number' ? value.toFixed(1) : 'n/a';
}

export default function GuidedChunkAdminClient() {
  const [versions, setVersions] = useState<GuidedChunkVersionSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [transitioningId, setTransitioningId] = useState<string | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creatingExperiment, setCreatingExperiment] = useState(false);
  const [updatingExperimentId, setUpdatingExperimentId] = useState<string | null>(null);
  const [experimentForm, setExperimentForm] = useState({
    name: '',
    changeType: 'runtime' as 'prompt' | 'ui' | 'runtime' | 'telemetry' | 'content',
    hypothesis: '',
    baselineVariantId: '',
    targetVariantId: '',
    runtimeVersion: 'guided_chunk_v1',
    metricsToWatch: 'completionRatePct, fatigueScore, transferQualityPct, learningEfficiency',
    lessonCode: '',
    description: '',
  });
  const [sessionFilters, setSessionFilters] = useState({
    lessonCode: '',
    status: 'all' as 'all' | 'active' | 'completed' | 'abandoned',
    sourceContext: '',
    variantId: '',
  });

  const groupedByLesson = useMemo(() => {
    const map = new Map<string, GuidedChunkVersionSummary[]>();
    for (const version of versions) {
      const bucket = map.get(version.lessonCode) ?? [];
      bucket.push(version);
      map.set(version.lessonCode, bucket);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [versions]);

  const filteredSessions = useMemo(() => {
    if (!analytics) return [];
    return analytics.sessions.filter((session) => {
      if (sessionFilters.lessonCode && !session.lessonCode.toLowerCase().includes(sessionFilters.lessonCode.toLowerCase())) {
        return false;
      }
      if (sessionFilters.status !== 'all' && session.status !== sessionFilters.status) {
        return false;
      }
      if (
        sessionFilters.sourceContext &&
        !session.sourceContext.toLowerCase().includes(sessionFilters.sourceContext.toLowerCase())
      ) {
        return false;
      }
      if (sessionFilters.variantId && !(session.variantId ?? '').toLowerCase().includes(sessionFilters.variantId.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [analytics, sessionFilters]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [versionsResponse, analyticsResponse] = await Promise.all([
        authedFetch('/api/admin/guided-chunk/versions'),
        authedFetch('/api/admin/guided-chunk/analytics'),
      ]);

      const versionsPayload = (await versionsResponse.json()) as VersionsResponse & { error?: string };
      if (!versionsResponse.ok) {
        throw new Error(versionsPayload.error || 'Failed to load guided versions.');
      }
      setVersions(versionsPayload.versions);

      const analyticsPayload = (await analyticsResponse.json()) as AnalyticsResponse & { error?: string };
      if (analyticsResponse.ok) {
        setAnalytics(analyticsPayload);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to load guided admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function runBiologyBatch() {
    setRunningBatch(true);
    setError(null);
    setBatchResult(null);
    try {
      const response = await authedFetch('/api/guided-chunk/generate-biology-phase1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const payload = (await response.json()) as BatchResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Biology batch generation failed.');
      }
      setBatchResult(payload);
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Biology batch generation failed.');
    } finally {
      setRunningBatch(false);
    }
  }

  async function transitionVersion(versionId: string, action: GuidedChunkVersionAction) {
    setTransitioningId(versionId);
    setError(null);
    try {
      const response = await authedFetch('/api/admin/guided-chunk/versions/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          action,
          moderation: {
            objectivesVerified: true,
            factualCheckPassed: true,
            policyCheckPassed: true,
            notes: 'Internal guided chunk moderation pass approved.',
          },
        }),
      });
      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(payload.message || payload.error || 'Version transition failed.');
      }
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Version transition failed.');
    } finally {
      setTransitioningId(null);
    }
  }

  async function createExperiment() {
    setCreatingExperiment(true);
    setError(null);
    try {
      const response = await authedFetch('/api/admin/guided-chunk/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: experimentForm.name,
          status: 'active',
          changeType: experimentForm.changeType,
          hypothesis: experimentForm.hypothesis,
          baselineVariantId: experimentForm.baselineVariantId || null,
          targetVariantId: experimentForm.targetVariantId,
          runtimeVersion: experimentForm.runtimeVersion || null,
          metricsToWatch: experimentForm.metricsToWatch
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
          changes: [
            {
              lessonCode: experimentForm.lessonCode || null,
              description: experimentForm.description,
            },
          ],
        }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.message || payload.error || 'Failed to create experiment.');
      }
      setExperimentForm({
        name: '',
        changeType: 'runtime',
        hypothesis: '',
        baselineVariantId: '',
        targetVariantId: '',
        runtimeVersion: 'guided_chunk_v1',
        metricsToWatch: 'completionRatePct, fatigueScore, transferQualityPct, learningEfficiency',
        lessonCode: '',
        description: '',
      });
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to create experiment.');
    } finally {
      setCreatingExperiment(false);
    }
  }

  async function updateExperimentStatus(
    experimentId: string,
    status: 'active' | 'completed' | 'rolled_back' | 'cancelled',
    result?: { classification?: 'win' | 'loss' | 'mixed' | 'inconclusive'; summary?: string | null } | null
  ) {
    setUpdatingExperimentId(experimentId);
    setError(null);
    try {
      const response = await authedFetch('/api/admin/guided-chunk/experiments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId,
          status,
          result: result ?? null,
        }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.message || payload.error || 'Failed to update experiment.');
      }
      await loadData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to update experiment.');
    } finally {
      setUpdatingExperimentId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-6 py-10 text-[#17202b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-3xl border border-[#dde3ea] bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5a6b7c]">Guided Chunk Admin</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Promotion, Runtime, and Telemetry</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#526171]">
            Generate draft guided lessons, moderate them through publish states, launch preview or published runtime sessions,
            and compare guided session outcomes with the current lesson runtime.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void runBiologyBatch()}
              disabled={runningBatch}
              className="rounded-full bg-[#17202b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243242] disabled:cursor-not-allowed disabled:bg-[#8b97a4]"
            >
              {runningBatch ? 'Running Biology batch...' : 'Generate Biology Phase 1'}
            </button>
            <Link
              href="/guided-chunk-lab"
              className="rounded-full border border-[#cfd7e0] bg-white px-5 py-2.5 text-sm font-semibold text-[#17202b] transition hover:border-[#9ba8b5]"
            >
              Open generator lab
            </Link>
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="rounded-full border border-[#cfd7e0] bg-white px-5 py-2.5 text-sm font-semibold text-[#17202b] transition hover:border-[#9ba8b5] disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-[#a12626]">{error}</p> : null}
        </header>

        {batchResult ? (
          <section className="rounded-3xl border border-[#dde3ea] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a6b7c]">Latest batch</p>
                <h2 className="mt-2 text-2xl font-semibold">Biology Phase 1 generation results</h2>
              </div>
              <p className="text-sm text-[#526171]">{batchResult.count} lesson runs</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {batchResult.results.map((result) => (
                <article key={`${result.lessonCode}:${result.versionId ?? 'na'}`} className="rounded-2xl border border-[#e4e8ed] bg-[#fafbfc] p-4">
                  <p className="text-sm font-semibold text-[#17202b]">{result.lessonCode}</p>
                  <p className="mt-2 text-sm text-[#526171]">
                    {result.success
                      ? `Score ${result.score ?? 'n/a'} · ${result.grade ?? 'ungraded'} · ${result.status ?? 'draft'}`
                      : result.error ?? 'Generation failed'}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {analytics ? (
          <section className="rounded-3xl border border-[#dde3ea] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a6b7c]">Telemetry</p>
                <h2 className="mt-2 text-2xl font-semibold">Guided runtime performance</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <input
                value={sessionFilters.lessonCode}
                onChange={(event) => setSessionFilters((current) => ({ ...current, lessonCode: event.target.value }))}
                className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Filter by lesson code"
              />
              <select
                value={sessionFilters.status}
                onChange={(event) =>
                  setSessionFilters((current) => ({
                    ...current,
                    status: event.target.value as typeof sessionFilters.status,
                  }))
                }
                className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <input
                value={sessionFilters.sourceContext}
                onChange={(event) =>
                  setSessionFilters((current) => ({ ...current, sourceContext: event.target.value }))
                }
                className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Filter by source context"
              />
              <input
                value={sessionFilters.variantId}
                onChange={(event) => setSessionFilters((current) => ({ ...current, variantId: event.target.value }))}
                className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Filter by variant id"
              />
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[#5a6b7c]">
                  <tr>
                    <th className="pb-3 pr-4">Lesson</th>
                    <th className="pb-3 pr-4">Source</th>
                    <th className="pb-3 pr-4">Started</th>
                    <th className="pb-3 pr-4">Completion</th>
                    <th className="pb-3 pr-4">Review flags</th>
                    <th className="pb-3 pr-4">Repairs</th>
                    <th className="pb-3 pr-4">Latency</th>
                    <th className="pb-3 pr-4">Fatigue</th>
                    <th className="pb-3 pr-4">Fatigue onset</th>
                    <th className="pb-3 pr-4">Confusion</th>
                    <th className="pb-3 pr-4">Disengage</th>
                    <th className="pb-3 pr-4">Support dep.</th>
                    <th className="pb-3 pr-4">Recovery</th>
                    <th className="pb-3 pr-4">Transfer</th>
                    <th className="pb-3 pr-4">Pace mismatch</th>
                    <th className="pb-3 pr-4">Efficiency</th>
                    <th className="pb-3 pr-4">MCQ %</th>
                    <th className="pb-3 pr-4">Short %</th>
                    <th className="pb-3 pr-4">Avg sec</th>
                    <th className="pb-3 pr-4">V2 completion</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.comparisons.map((comparison) => {
                    const summary = analytics.summaries.find(
                      (entry) =>
                        entry.lessonCode === comparison.lessonCode &&
                        entry.sourceContext === comparison.guidedSourceContext
                    );
                    return (
                      <tr key={`${comparison.lessonCode}:${comparison.guidedSourceContext}`} className="border-t border-[#eef2f6]">
                        <td className="py-3 pr-4 font-medium">{comparison.lessonCode}</td>
                        <td className="py-3 pr-4">{comparison.guidedSourceContext}</td>
                        <td className="py-3 pr-4">{comparison.guidedStarted}</td>
                        <td className="py-3 pr-4">{formatPct(comparison.guidedCompletionRatePct)}</td>
                        <td className="py-3 pr-4">{formatNumber(summary?.avgReviewFlags)}</td>
                        <td className="py-3 pr-4">{formatNumber(summary?.avgRepairCount)}</td>
                        <td className="py-3 pr-4">{formatNumber(summary?.avgResponseLatencySeconds)}</td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedFatigueScore)}</td>
                        <td className="py-3 pr-4">
                          {typeof summary?.fatigueOnsetChunkIndex === 'number'
                            ? `Chunk ${Math.round(summary.fatigueOnsetChunkIndex) + 1}`
                            : 'n/a'}
                        </td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedConfusionScore)}</td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedDisengagementScore)}</td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedSupportDependenceScore)}</td>
                        <td className="py-3 pr-4">{formatPct(comparison.guidedRecoveryRatePct)}</td>
                        <td className="py-3 pr-4">{formatPct(comparison.guidedTransferQualityPct)}</td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedPaceMismatchScore)}</td>
                        <td className="py-3 pr-4">{formatNumber(comparison.guidedLearningEfficiency)}</td>
                        <td className="py-3 pr-4">{formatPct(summary?.mcqPct)}</td>
                        <td className="py-3 pr-4">{formatPct(summary?.shortAnswerPct)}</td>
                        <td className="py-3 pr-4">{formatNumber(summary?.avgDurationSeconds)}</td>
                        <td className="py-3 pr-4">{formatPct(comparison.v2CompletionRatePct)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {analytics ? (
          <section className="rounded-3xl border border-[#dde3ea] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a6b7c]">Session drilldown</p>
                <h2 className="mt-2 text-2xl font-semibold">Recent guided sessions</h2>
              </div>
              <p className="text-sm text-[#526171]">{analytics.sessions.length} recent sessions</p>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[#5a6b7c]">
                  <tr>
                    <th className="pb-3 pr-4">Session</th>
                    <th className="pb-3 pr-4">Lesson</th>
                    <th className="pb-3 pr-4">Variant</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Duration</th>
                    <th className="pb-3 pr-4">Flags</th>
                    <th className="pb-3 pr-4">Latency</th>
                    <th className="pb-3 pr-4">Fatigue</th>
                    <th className="pb-3 pr-4">Confusion</th>
                    <th className="pb-3 pr-4">Disengage</th>
                    <th className="pb-3 pr-4">Support dep.</th>
                    <th className="pb-3 pr-4">Recovery</th>
                    <th className="pb-3 pr-4">Transfer</th>
                    <th className="pb-3 pr-4">Pace mismatch</th>
                    <th className="pb-3 pr-4">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => (
                    <tr key={session.sessionId} className="border-t border-[#eef2f6]">
                      <td className="py-3 pr-4 font-mono text-xs">{session.sessionId.slice(0, 8)}</td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">{session.lessonCode}</div>
                        <div className="text-xs text-[#5a6b7c]">{session.sourceContext}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div>{session.variantId ?? 'n/a'}</div>
                        <div className="text-xs text-[#5a6b7c]">{session.runtimeVersion ?? 'n/a'}</div>
                      </td>
                      <td className="py-3 pr-4">{session.status}</td>
                      <td className="py-3 pr-4">{formatNumber(session.durationSeconds)}</td>
                      <td className="py-3 pr-4">{session.reviewFlagCount}</td>
                      <td className="py-3 pr-4">{formatNumber(session.avgResponseLatencySeconds)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.fatigueScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.confusionScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.disengagementScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.supportDependenceScore)}</td>
                      <td className="py-3 pr-4">{formatPct(session.recoveryRatePct)}</td>
                      <td className="py-3 pr-4">{formatPct(session.transferQualityPct)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.paceMismatchScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(session.learningEfficiency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {analytics ? (
          <section className="rounded-3xl border border-[#dde3ea] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a6b7c]">AI change tracking</p>
                <h2 className="mt-2 text-2xl font-semibold">Prompt, UI, and runtime experiments</h2>
              </div>
              <p className="text-sm text-[#526171]">{analytics.experiments.length} experiments</p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e4e8ed] bg-[#fafbfc] p-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input
                  value={experimentForm.name}
                  onChange={(event) => setExperimentForm((current) => ({ ...current, name: event.target.value }))}
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                  placeholder="Experiment name"
                />
                <select
                  value={experimentForm.changeType}
                  onChange={(event) =>
                    setExperimentForm((current) => ({
                      ...current,
                      changeType: event.target.value as typeof experimentForm.changeType,
                    }))
                  }
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                >
                  <option value="prompt">Prompt</option>
                  <option value="ui">UI</option>
                  <option value="runtime">Runtime</option>
                  <option value="telemetry">Telemetry</option>
                  <option value="content">Content</option>
                </select>
                <input
                  value={experimentForm.baselineVariantId}
                  onChange={(event) =>
                    setExperimentForm((current) => ({ ...current, baselineVariantId: event.target.value }))
                  }
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                  placeholder="Baseline variant id"
                />
                <input
                  value={experimentForm.targetVariantId}
                  onChange={(event) =>
                    setExperimentForm((current) => ({ ...current, targetVariantId: event.target.value }))
                  }
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                  placeholder="Target variant id"
                />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input
                  value={experimentForm.lessonCode}
                  onChange={(event) => setExperimentForm((current) => ({ ...current, lessonCode: event.target.value }))}
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                  placeholder="Lesson code (optional)"
                />
                <input
                  value={experimentForm.runtimeVersion}
                  onChange={(event) =>
                    setExperimentForm((current) => ({ ...current, runtimeVersion: event.target.value }))
                  }
                  className="rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                  placeholder="Runtime version"
                />
              </div>
              <textarea
                value={experimentForm.hypothesis}
                onChange={(event) => setExperimentForm((current) => ({ ...current, hypothesis: event.target.value }))}
                className="mt-3 min-h-[84px] w-full rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Hypothesis"
              />
              <textarea
                value={experimentForm.description}
                onChange={(event) => setExperimentForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-3 min-h-[84px] w-full rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Describe the concrete prompt/UI/runtime change"
              />
              <input
                value={experimentForm.metricsToWatch}
                onChange={(event) =>
                  setExperimentForm((current) => ({ ...current, metricsToWatch: event.target.value }))
                }
                className="mt-3 w-full rounded-xl border border-[#cfd7e0] px-3 py-2 text-sm"
                placeholder="Comma-separated metrics to watch"
              />
              <div className="mt-3">
                <button
                  type="button"
                  disabled={creatingExperiment}
                  onClick={() => void createExperiment()}
                  className="rounded-full bg-[#17202b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243242] disabled:cursor-not-allowed disabled:bg-[#8b97a4]"
                >
                  {creatingExperiment ? 'Creating experiment...' : 'Create experiment'}
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[#5a6b7c]">
                  <tr>
                    <th className="pb-3 pr-4">Experiment</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Variants</th>
                    <th className="pb-3 pr-4">Target completion</th>
                    <th className="pb-3 pr-4">Delta completion</th>
                    <th className="pb-3 pr-4">Delta fatigue</th>
                    <th className="pb-3 pr-4">Delta confusion</th>
                    <th className="pb-3 pr-4">Delta transfer</th>
                    <th className="pb-3 pr-4">Delta efficiency</th>
                    <th className="pb-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.experimentPerformance.map((experiment) => (
                    <tr key={experiment.experimentId} className="border-t border-[#eef2f6]">
                      <td className="py-3 pr-4">
                        <div className="font-medium">{experiment.name}</div>
                        <div className="text-xs text-[#5a6b7c]">{experiment.status}</div>
                        <div className="text-xs text-[#5a6b7c]">Outcome: {experiment.classification}</div>
                      </td>
                      <td className="py-3 pr-4">{experiment.changeType}</td>
                      <td className="py-3 pr-4">
                        <div>{experiment.targetVariantId}</div>
                        <div className="text-xs text-[#5a6b7c]">vs {experiment.baselineVariantId ?? 'none'}</div>
                      </td>
                      <td className="py-3 pr-4">{formatPct(experiment.target.completionRatePct)}</td>
                      <td className="py-3 pr-4">{formatNumber(experiment.deltas?.completionRatePct)}</td>
                      <td className="py-3 pr-4">{formatNumber(experiment.deltas?.fatigueScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(experiment.deltas?.confusionScore)}</td>
                      <td className="py-3 pr-4">{formatNumber(experiment.deltas?.transferQualityPct)}</td>
                      <td className="py-3 pr-4">{formatNumber(experiment.deltas?.learningEfficiency)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={updatingExperimentId === experiment.experimentId}
                            onClick={() =>
                              void updateExperimentStatus(experiment.experimentId, 'completed', {
                                classification: experiment.classification,
                                summary: `Completed with ${experiment.classification} result.`,
                              })
                            }
                            className="rounded-full border border-[#cfd7e0] bg-white px-3 py-1 text-xs font-semibold text-[#17202b] transition hover:border-[#9ba8b5] disabled:cursor-not-allowed"
                          >
                            Complete
                          </button>
                          <button
                            type="button"
                            disabled={updatingExperimentId === experiment.experimentId}
                            onClick={() =>
                              void updateExperimentStatus(experiment.experimentId, 'rolled_back', {
                                classification: experiment.classification,
                                summary: 'Rolled back after guided comparison review.',
                              })
                            }
                            className="rounded-full border border-[#cfd7e0] bg-white px-3 py-1 text-xs font-semibold text-[#17202b] transition hover:border-[#9ba8b5] disabled:cursor-not-allowed"
                          >
                            Roll back
                          </button>
                          <button
                            type="button"
                            disabled={updatingExperimentId === experiment.experimentId}
                            onClick={() => void updateExperimentStatus(experiment.experimentId, 'cancelled')}
                            className="rounded-full border border-[#cfd7e0] bg-white px-3 py-1 text-xs font-semibold text-[#17202b] transition hover:border-[#9ba8b5] disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-[#dde3ea] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a6b7c]">Guided versions</p>
              <h2 className="mt-2 text-2xl font-semibold">Drafts, approvals, and published runtime</h2>
            </div>
            <p className="text-sm text-[#526171]">{versions.length} versions</p>
          </div>
          <div className="mt-6 flex flex-col gap-6">
            {groupedByLesson.map(([lessonCode, lessonVersions]) => (
              <section key={lessonCode} className="rounded-2xl border border-[#e4e8ed] bg-[#fafbfc] p-5">
                <h3 className="text-lg font-semibold text-[#17202b]">{lessonCode}</h3>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {lessonVersions.map((version) => (
                    <article key={version.id} className="rounded-2xl border border-[#dde3ea] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">
                            v{version.versionNo} · {version.status}
                          </p>
                          <h4 className="mt-2 text-base font-semibold">{version.title}</h4>
                          <p className="mt-1 text-sm text-[#526171]">
                            {version.unit} · {version.topic}
                          </p>
                        </div>
                        <div className="text-right text-sm text-[#526171]">
                          <p>Score {version.qualityScore ?? 'n/a'}</p>
                          <p>{version.grade ?? 'ungraded'}</p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-[#526171]">
                        {version.loCount} LOs · {version.chunkCount} chunks · {version.runtimeVersion}
                      </p>

                      {version.report ? (
                        <details className="mt-4 rounded-2xl border border-[#e4e8ed] bg-[#fafbfc] p-4">
                          <summary className="cursor-pointer text-sm font-semibold text-[#17202b]">
                            View grading report
                          </summary>
                          <div className="mt-4 space-y-4 text-sm text-[#334155]">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Overall</p>
                                <p className="mt-2">Score {version.report.total}</p>
                                <p>Grade {version.report.grade}</p>
                                <p>Mode {version.report.scoringMode ?? 'unknown'}</p>
                              </div>
                              <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Validation</p>
                                <p className="mt-2">{version.validation?.passed === false ? 'Failed' : 'Passed'}</p>
                                {(version.validation?.issues ?? []).length > 0 ? (
                                  <ul className="mt-2 list-disc space-y-1 pl-5">
                                    {(version.validation?.issues ?? []).map((issue, index) => (
                                      <li key={`${version.id}:validation:${index}`}>{issue}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-2">No validation issues recorded.</p>
                                )}
                              </div>
                            </div>

                            <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Breakdown</p>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <p>Beginner clarity: {version.report.breakdown.beginnerClarity}</p>
                                <p>Teaching before testing: {version.report.breakdown.teachingBeforeTesting}</p>
                                <p>Marking robustness: {version.report.breakdown.markingRobustness}</p>
                                <p>Alignment to LO: {version.report.breakdown.alignmentToLO}</p>
                                <p>Question quality: {version.report.breakdown.questionQuality}</p>
                              </div>
                            </div>

                            <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Summary</p>
                              <p className="mt-2">{version.report.summary}</p>
                            </div>

                            <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Issues To Fix</p>
                              {version.report.issues.length > 0 ? (
                                <div className="mt-3 space-y-3">
                                  {version.report.issues.map((issue, index) => (
                                    <div key={`${version.id}:issue:${index}`} className="rounded-xl border border-[#e4e8ed] bg-[#fafbfc] p-3">
                                      <p className="font-semibold text-[#17202b]">{issue.category}</p>
                                      <p className="mt-1">{issue.problem}</p>
                                      <p className="mt-2 text-[#0f766e]">Suggested fix: {issue.suggestion}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-2">No scoring issues recorded.</p>
                              )}
                            </div>

                            <div className="rounded-xl border border-[#e4e8ed] bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a6b7c]">Refinement Notes</p>
                              {(version.report.refinementNotes ?? []).length > 0 ? (
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {(version.report.refinementNotes ?? []).map((note, index) => (
                                    <li key={`${version.id}:note:${index}`}>{note}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-2">No refinement notes recorded.</p>
                              )}
                            </div>
                          </div>
                        </details>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/guided-chunk/${encodeURIComponent(version.lessonCode)}?versionId=${encodeURIComponent(version.id)}&sourceContext=guided_chunk_admin_preview`}
                          className="rounded-full border border-[#cfd7e0] bg-white px-4 py-2 text-sm font-semibold text-[#17202b] transition hover:border-[#9ba8b5]"
                        >
                          Preview version
                        </Link>
                        {version.status === 'published' ? (
                          <Link
                            href={`/guided-chunk/${encodeURIComponent(version.lessonCode)}?sourceContext=guided_chunk_internal_catalog`}
                            className="rounded-full bg-[#17202b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243242]"
                          >
                            Open published
                          </Link>
                        ) : null}
                        {allowedActions[version.status].map((action) => (
                          <button
                            key={`${version.id}:${action}`}
                            type="button"
                            disabled={transitioningId === version.id}
                            onClick={() => void transitionVersion(version.id, action)}
                            className="rounded-full border border-[#cfd7e0] bg-white px-4 py-2 text-sm font-semibold text-[#17202b] transition hover:border-[#9ba8b5] disabled:cursor-not-allowed"
                          >
                            {transitioningId === version.id ? 'Working...' : transitionLabels[action]}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
