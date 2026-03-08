'use client';

import { useEffect, useMemo, useState } from 'react';
import V2Shell from '@/components/v2/V2Shell';
import { authedFetch } from '@/lib/api/authedFetch';

type ContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
type UpdateAction = 'submit_review' | 'approve' | 'publish' | 'retire' | 'revert_draft';

type VersionRow = {
  id: string;
  lesson_id: string;
  version_no: number;
  status: ContentStatus;
  source: 'human' | 'ai';
  quality_score: number | null;
  is_current: boolean;
  published_at: string | null;
  created_at: string;
  lesson: {
    id: string;
    code: string;
    title: string;
  } | null;
  unit: {
    id: string;
    code: string;
    name: string;
  } | null;
  course: {
    id: string;
    code: string;
    name: string;
  } | null;
};

type GenerationJob = {
  id: string;
  kind: 'lesson_draft' | 'question_draft';
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  lesson_id: string | null;
  payload: {
    lessonCode?: string | null;
    prompt?: string;
    lastErrorCode?: string;
    retryScheduled?: boolean;
  } | null;
  attempts_made: number;
  max_attempts: number;
  error_message: string | null;
  queued_at: string;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  lesson: {
    id: string;
    code: string;
    title: string;
  } | null;
};

type V2OutcomesSummary = {
  learning: {
    attempts_total: number;
    accuracy_pct: number | null;
    mastery_rate_pct: number | null;
  };
  behavior: {
    lesson_completion_rate_pct: number | null;
    review_adherence_pct: number | null;
    review_on_time_pct: number | null;
    error_recovery_pct: number | null;
  };
  operations: {
    generation_jobs_total: number;
    generation_jobs_succeeded: number;
    generation_jobs_failed: number;
    generation_success_rate_pct: number | null;
    average_generation_duration_ms: number | null;
  };
};

type V2OutcomesUserRow = {
  user_id: string;
  display_name: string | null;
  attempts_total: number;
  accuracy_pct: number | null;
  lessons_started: number;
  lessons_completed: number;
  completion_rate_pct: number | null;
  review_due: number;
  review_resolved: number;
  review_resolved_rate_pct: number | null;
  mastery_achieved_lessons: number;
  mastery_rate_pct: number | null;
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

type ApprovalDecisionRow = {
  id: string;
  decision: 'approved' | 'rejected' | 'override_publish';
  reason: string | null;
  created_at: string;
  reviewer: {
    user_id: string;
    display_name: string | null;
  };
  lesson_version: {
    id: string;
    version_no: number;
    status: ContentStatus;
  } | null;
  lesson: {
    id: string;
    code: string;
    title: string;
  } | null;
};

type ModerationPayload = {
  objectivesVerified: boolean;
  factualCheckPassed: boolean;
  policyCheckPassed: boolean;
  notes: string;
};

function allowedActions(status: ContentStatus): UpdateAction[] {
  if (status === 'draft') return ['submit_review', 'retire'];
  if (status === 'needs_review') return ['approve', 'revert_draft', 'retire'];
  if (status === 'approved') return ['publish', 'revert_draft', 'retire'];
  if (status === 'published') return ['retire'];
  return ['revert_draft'];
}

export default function V2AdminContentPage() {
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');
  const [lessonFilter, setLessonFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyVersionId, setBusyVersionId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [newJobLessonCode, setNewJobLessonCode] = useState('');
  const [newJobPrompt, setNewJobPrompt] = useState('');
  const [outcomesWindowDays, setOutcomesWindowDays] = useState(30);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [outcomesSummary, setOutcomesSummary] = useState<V2OutcomesSummary | null>(null);
  const [outcomesUsers, setOutcomesUsers] = useState<V2OutcomesUserRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<V2OutcomesUserRow | null>(null);
  const [selectedUserTimeline, setSelectedUserTimeline] = useState<TimeSeriesPoint[]>([]);
  const [loadingUserTimeline, setLoadingUserTimeline] = useState(false);
  const [approvalDecisions, setApprovalDecisions] = useState<ApprovalDecisionRow[]>([]);
  const [loadingApprovalDecisions, setLoadingApprovalDecisions] = useState(false);

  function formatPct(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return '-';
    return `${value.toFixed(1)}%`;
  }

  async function loadVersions() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (lessonFilter.trim()) params.set('lessonCode', lessonFilter.trim());
      const query = params.toString();
      const response = await authedFetch(`/api/admin/v2/lesson-versions${query ? `?${query}` : ''}`, {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 lesson versions.');
      }
      setVersions(Array.isArray(payload.versions) ? payload.versions : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 lesson versions.');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadJobs() {
    setLoadingJobs(true);
    setError(null);
    try {
      const response = await authedFetch('/api/admin/v2/generation-jobs', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load generation jobs.');
      }
      setJobs(Array.isArray(payload.jobs) ? payload.jobs : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load generation jobs.');
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadOutcomes(days = outcomesWindowDays) {
    setLoadingOutcomes(true);
    setError(null);
    try {
      const response = await authedFetch(`/api/admin/v2/outcomes/summary?days=${days}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 outcomes summary.');
      }
      setOutcomesSummary(payload.summary ?? null);
      setOutcomesUsers(Array.isArray(payload.users) ? payload.users : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 outcomes summary.');
      setOutcomesSummary(null);
      setOutcomesUsers([]);
    } finally {
      setLoadingOutcomes(false);
    }
  }

  async function loadSelectedUserTimeline(userId: string, days = outcomesWindowDays) {
    setLoadingUserTimeline(true);
    setError(null);
    try {
      const response = await authedFetch(
        `/api/admin/v2/outcomes/timeseries?days=${days}&userId=${encodeURIComponent(userId)}`,
        { cache: 'no-store' }
      );
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load selected user timeline.');
      }
      setSelectedUserTimeline(Array.isArray(payload.timeline) ? payload.timeline : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load selected user timeline.');
      setSelectedUserTimeline([]);
    } finally {
      setLoadingUserTimeline(false);
    }
  }

  async function loadApprovalDecisions() {
    setLoadingApprovalDecisions(true);
    setError(null);
    try {
      const response = await authedFetch('/api/admin/v2/approval-decisions?limit=100', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load approval decisions.');
      }
      setApprovalDecisions(Array.isArray(payload.decisions) ? payload.decisions : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load approval decisions.');
      setApprovalDecisions([]);
    } finally {
      setLoadingApprovalDecisions(false);
    }
  }

  useEffect(() => {
    void loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    void loadJobs();
    void loadApprovalDecisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadOutcomes(outcomesWindowDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcomesWindowDays]);

  useEffect(() => {
    if (!selectedUser) return;
    void loadSelectedUserTimeline(selectedUser.user_id, outcomesWindowDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, outcomesWindowDays]);

  const publishedCount = useMemo(
    () => versions.filter((version) => version.status === 'published').length,
    [versions]
  );
  const retryExhaustedJobs = useMemo(
    () => jobs.filter((job) => job.status === 'failed' && job.attempts_made >= job.max_attempts),
    [jobs]
  );
  const recentFailedJobs = useMemo(
    () =>
      jobs.filter((job) => {
        if (job.status !== 'failed') return false;
        const createdTs = new Date(job.created_at).getTime();
        if (Number.isNaN(createdTs)) return false;
        return Date.now() - createdTs <= 24 * 60 * 60 * 1000;
      }),
    [jobs]
  );

  function collectModerationPayloadIfRequired(action: UpdateAction): ModerationPayload | null {
    if (action !== 'approve' && action !== 'publish') return null;

    const objectivesVerified = window.confirm('Moderation: Have learning outcomes/objectives been verified?');
    if (!objectivesVerified) return null;
    const factualCheckPassed = window.confirm('Moderation: Factual correctness check passed?');
    if (!factualCheckPassed) return null;
    const policyCheckPassed = window.confirm('Moderation: Policy/safety/content check passed?');
    if (!policyCheckPassed) return null;
    const notes = window.prompt(
      'Add moderation evidence notes (required, at least 10 chars):',
      'Checked alignment, factual accuracy, and content policy.'
    );
    if (notes == null || notes.trim().length < 10) return null;

    return {
      objectivesVerified,
      factualCheckPassed,
      policyCheckPassed,
      notes: notes.trim(),
    };
  }

  async function transitionVersion(versionId: string, action: UpdateAction) {
    setBusyVersionId(versionId);
    setError(null);
    try {
      const moderation = collectModerationPayloadIfRequired(action);
      if ((action === 'approve' || action === 'publish') && !moderation) {
        throw new Error('Moderation checklist was not completed.');
      }

      const response = await authedFetch('/api/admin/v2/lesson-versions/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId, action, moderation }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        const gateIssues = Array.isArray(payload?.gate?.issues)
          ? payload.gate.issues
              .filter((issue: { severity?: string; message?: string }) => issue?.severity === 'error')
              .map((issue: { message?: string }) => issue.message)
              .filter((message: unknown): message is string => typeof message === 'string' && message.length > 0)
          : [];
        if (gateIssues.length > 0) {
          throw new Error(`Publish gate failed: ${gateIssues.join(' | ')}`);
        }
        if (payload.code === 'MODERATION_REQUIRED') {
          throw new Error('Moderation checklist and evidence notes are required.');
        }
        throw new Error(payload.message || 'Failed to transition version.');
      }
      await loadVersions();
    } catch (transitionError) {
      setError(transitionError instanceof Error ? transitionError.message : 'Failed to transition version.');
    } finally {
      setBusyVersionId(null);
    }
  }

  async function createLessonDraftJob() {
    setError(null);
    try {
      const response = await authedFetch('/api/admin/v2/generation-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'lesson_draft',
          lessonCode: newJobLessonCode.trim(),
          prompt: newJobPrompt.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to create generation job.');
      }
      await loadJobs();
      setNewJobPrompt('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create generation job.');
    }
  }

  async function runJob(jobId: string) {
    setBusyJobId(jobId);
    setError(null);
    try {
      const response = await authedFetch(`/api/admin/v2/generation-jobs/${encodeURIComponent(jobId)}/run`, {
        method: 'POST',
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to run generation job.');
      }
      await Promise.all([loadJobs(), loadVersions()]);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Failed to run generation job.');
    } finally {
      setBusyJobId(null);
    }
  }

  return (
    <V2Shell title="V2 Admin Content" subtitle="Draft -> review -> approve -> publish">
      <p>Use this page to manage V2 lesson version status without any V1 fallback.</p>
      <p>Total versions: {versions.length}</p>
      <p>Published versions: {publishedCount}</p>

      <p>
        <label htmlFor="statusFilter">Status filter: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | ContentStatus)}
        >
          <option value="all">all</option>
          <option value="draft">draft</option>
          <option value="needs_review">needs_review</option>
          <option value="approved">approved</option>
          <option value="published">published</option>
          <option value="retired">retired</option>
        </select>
      </p>

      <p>
        <label htmlFor="lessonFilter">Lesson code filter: </label>
        <input
          id="lessonFilter"
          value={lessonFilter}
          onChange={(event) => setLessonFilter(event.target.value)}
          placeholder="BIO-1-1A"
        />{' '}
        <button type="button" onClick={() => void loadVersions()}>
          Apply
        </button>
      </p>

      {loading && <p>Loading V2 versions...</p>}
      {error && <p>{error}</p>}
      {!loading && versions.length === 0 && <p>No V2 lesson versions found for this filter.</p>}

      {versions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">Lesson</th>
              <th align="left">Version</th>
              <th align="left">Status</th>
              <th align="left">Current</th>
              <th align="left">Source</th>
              <th align="left">Published</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version) => (
              <tr key={version.id}>
                <td>
                  <div>{version.lesson?.code ?? version.lesson_id}</div>
                  <div>{version.lesson?.title ?? 'Untitled lesson'}</div>
                </td>
                <td>v{version.version_no}</td>
                <td>{version.status}</td>
                <td>{version.is_current ? 'yes' : 'no'}</td>
                <td>{version.source}</td>
                <td>{version.published_at ? new Date(version.published_at).toLocaleString() : '-'}</td>
                <td>
                  {allowedActions(version.status).map((action) => (
                    <button
                      key={`${version.id}-${action}`}
                      type="button"
                      disabled={busyVersionId === version.id}
                      onClick={() => void transitionVersion(version.id, action)}
                    >
                      {action}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>V2 Outcomes Dashboard</h2>
      <p>Track learning, behavior, and operations metrics for V2 users only.</p>
      <p>
        <label htmlFor="outcomesDays">Window days: </label>
        <select
          id="outcomesDays"
          value={outcomesWindowDays}
          onChange={(event) => setOutcomesWindowDays(Number(event.target.value))}
        >
          <option value={7}>7</option>
          <option value={14}>14</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
          <option value={90}>90</option>
        </select>{' '}
        <button type="button" onClick={() => void loadOutcomes(outcomesWindowDays)} disabled={loadingOutcomes}>
          {loadingOutcomes ? 'Loading outcomes...' : 'Refresh outcomes'}
        </button>
      </p>

      {outcomesSummary && (
        <>
          <h3>Learning</h3>
          <p>Attempts: {outcomesSummary.learning.attempts_total}</p>
          <p>Accuracy: {formatPct(outcomesSummary.learning.accuracy_pct)}</p>
          <p>Mastery rate: {formatPct(outcomesSummary.learning.mastery_rate_pct)}</p>

          <h3>Behavior</h3>
          <p>Lesson completion: {formatPct(outcomesSummary.behavior.lesson_completion_rate_pct)}</p>
          <p>Review adherence: {formatPct(outcomesSummary.behavior.review_adherence_pct)}</p>
          <p>Review on-time: {formatPct(outcomesSummary.behavior.review_on_time_pct)}</p>
          <p>Error recovery: {formatPct(outcomesSummary.behavior.error_recovery_pct)}</p>

          <h3>Operations</h3>
          <p>Generation jobs: {outcomesSummary.operations.generation_jobs_total}</p>
          <p>Generation success: {formatPct(outcomesSummary.operations.generation_success_rate_pct)}</p>
          <p>Succeeded: {outcomesSummary.operations.generation_jobs_succeeded}</p>
          <p>Failed: {outcomesSummary.operations.generation_jobs_failed}</p>
          <p>
            Average generation duration:{' '}
            {outcomesSummary.operations.average_generation_duration_ms == null
              ? '-'
              : `${Math.round(outcomesSummary.operations.average_generation_duration_ms / 1000)}s`}
          </p>
        </>
      )}

      {outcomesUsers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">User</th>
              <th align="left">Attempts</th>
              <th align="left">Accuracy</th>
              <th align="left">Completion</th>
              <th align="left">Review</th>
              <th align="left">Mastery</th>
            </tr>
          </thead>
          <tbody>
            {outcomesUsers.map((row) => (
              <tr key={row.user_id}>
                <td>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(row)}
                  >
                    {row.display_name ?? row.user_id}
                  </button>
                </td>
                <td>{row.attempts_total}</td>
                <td>{formatPct(row.accuracy_pct)}</td>
                <td>
                  {row.lessons_completed}/{row.lessons_started} ({formatPct(row.completion_rate_pct)})
                </td>
                <td>
                  {row.review_resolved}/{row.review_due} ({formatPct(row.review_resolved_rate_pct)})
                </td>
                <td>
                  {row.mastery_achieved_lessons} ({formatPct(row.mastery_rate_pct)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <>
          <h3>User Drill-down</h3>
          <p>{selectedUser.display_name ?? selectedUser.user_id}</p>
          <p>
            <button
              type="button"
              onClick={() => void loadSelectedUserTimeline(selectedUser.user_id, outcomesWindowDays)}
              disabled={loadingUserTimeline}
            >
              {loadingUserTimeline ? 'Loading timeline...' : 'Refresh timeline'}
            </button>{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setSelectedUserTimeline([]);
              }}
            >
              Close
            </button>
          </p>
          {selectedUserTimeline.length === 0 ? (
            <p>No timeline points for this user in the selected window.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th align="left">Date</th>
                  <th align="left">Attempts</th>
                  <th align="left">Accuracy</th>
                  <th align="left">Review due</th>
                  <th align="left">Review resolved</th>
                  <th align="left">Review backlog</th>
                </tr>
              </thead>
              <tbody>
                {selectedUserTimeline.slice(-14).map((point) => (
                  <tr key={`timeline-${point.date}`}>
                    <td>{point.date}</td>
                    <td>{point.attempts_total}</td>
                    <td>{formatPct(point.accuracy_pct)}</td>
                    <td>{point.review_due}</td>
                    <td>{point.review_resolved}</td>
                    <td>{point.review_active_backlog}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <h2>Moderation History</h2>
      <p>Latest admin approval decisions for V2 lesson versions.</p>
      <p>
        <button type="button" onClick={() => void loadApprovalDecisions()} disabled={loadingApprovalDecisions}>
          {loadingApprovalDecisions ? 'Loading moderation history...' : 'Refresh moderation history'}
        </button>
      </p>
      {approvalDecisions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">Time</th>
              <th align="left">Reviewer</th>
              <th align="left">Lesson</th>
              <th align="left">Decision</th>
              <th align="left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {approvalDecisions.map((decision) => (
              <tr key={decision.id}>
                <td>{new Date(decision.created_at).toLocaleString()}</td>
                <td>{decision.reviewer.display_name ?? decision.reviewer.user_id}</td>
                <td>
                  {decision.lesson?.code ?? '-'} {decision.lesson_version ? `(v${decision.lesson_version.version_no})` : ''}
                </td>
                <td>{decision.decision}</td>
                <td>{decision.reason ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>AI Generation Jobs (Phase 1 skeleton)</h2>
      <p>Create queued lesson draft jobs, then run them to produce V2 draft lesson versions.</p>
      {retryExhaustedJobs.length > 0 && (
        <>
          <h3>Alert: Retry Exhausted Jobs</h3>
          <p>{retryExhaustedJobs.length} job(s) failed after max attempts and need manual action.</p>
        </>
      )}
      {recentFailedJobs.length >= 3 && (
        <>
          <h3>Alert: Failure Spike (24h)</h3>
          <p>{recentFailedJobs.length} generation job failures detected in the last 24 hours.</p>
        </>
      )}
      <p>
        <label htmlFor="newJobLessonCode">Lesson code: </label>
        <input
          id="newJobLessonCode"
          value={newJobLessonCode}
          onChange={(event) => setNewJobLessonCode(event.target.value)}
          placeholder="BIO-99-1A"
        />
      </p>
      <p>
        <label htmlFor="newJobPrompt">Prompt: </label>
        <input
          id="newJobPrompt"
          value={newJobPrompt}
          onChange={(event) => setNewJobPrompt(event.target.value)}
          placeholder="Improve examples for first lesson demo."
        />{' '}
        <button
          type="button"
          onClick={() => void createLessonDraftJob()}
          disabled={!newJobLessonCode.trim()}
        >
          Queue lesson draft job
        </button>{' '}
        <button type="button" onClick={() => void loadJobs()} disabled={loadingJobs}>
          {loadingJobs ? 'Loading jobs...' : 'Refresh jobs'}
        </button>
      </p>

      {jobs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">Job</th>
              <th align="left">Kind</th>
              <th align="left">Lesson</th>
              <th align="left">Status</th>
              <th align="left">Attempts</th>
              <th align="left">Prompt</th>
              <th align="left">Error</th>
              <th align="left">Retry</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id.slice(0, 8)}</td>
                <td>{job.kind}</td>
                <td>{job.lesson?.code ?? job.lesson_id ?? '-'}</td>
                <td>{job.status}</td>
                <td>
                  {job.attempts_made}/{job.max_attempts}
                </td>
                <td>{job.payload?.prompt ?? '-'}</td>
                <td>{job.error_message ?? job.payload?.lastErrorCode ?? '-'}</td>
                <td>{job.payload?.retryScheduled ? 'queued' : '-'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => void runJob(job.id)}
                    disabled={job.status !== 'queued' || busyJobId === job.id}
                  >
                    {busyJobId === job.id ? 'Running...' : 'Run now'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </V2Shell>
  );
}
