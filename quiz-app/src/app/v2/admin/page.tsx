'use client';

import { useEffect, useMemo, useState } from 'react';
import V2Shell from '@/components/v2/V2Shell';
import { v2AuthedFetch } from '@/lib/v2/client';

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

type QuestionVersionRow = {
  id: string;
  question_id: string;
  version_no: number;
  status: ContentStatus;
  source: 'human' | 'ai';
  quality_score: number | null;
  is_current: boolean;
  published_at: string | null;
  created_at: string;
  stem: string;
  question: {
    id: string;
    stable_key: string;
    question_type: 'mcq' | 'short' | 'numeric' | 'other';
  } | null;
  lesson: {
    id: string;
    code: string;
    title: string;
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

type OutcomesLessonRow = {
  lesson_id: string;
  lesson_code: string;
  lesson_title: string;
  unit_code: string | null;
  unit_name: string | null;
  learners_started: number;
  learners_mastered: number;
  mastery_rate_pct: number | null;
  average_best_score_pct: number | null;
  average_attempts: number | null;
};

type OutcomesUnitRow = {
  unit_code: string;
  unit_name: string;
  lessons_tracked: number;
  learners_started: number;
  learners_mastered: number;
  mastery_rate_pct: number | null;
  average_best_score_pct: number | null;
  average_attempts: number | null;
};

type OutcomesLessonSortField = 'mastery_rate' | 'average_best_score' | 'average_attempts' | 'learners_started' | 'lesson_code';
type OutcomesUnitSortField = 'mastery_rate' | 'average_best_score' | 'average_attempts' | 'learners_started' | 'unit_code';
type OutcomesSortDir = 'asc' | 'desc';

type InterventionLearnerRow = {
  user_id: string;
  display_name: string | null;
  attempts_total: number;
  accuracy_pct: number | null;
  completion_rate_pct: number | null;
  mastery_rate_pct: number | null;
  review_backlog: number;
  review_resolved_rate_pct: number | null;
  risk_score: number;
  risk_reasons: string[];
};

type InterventionLessonRow = {
  lesson_id: string;
  lesson_code: string;
  lesson_title: string;
  learners_started: number;
  learners_mastered: number;
  mastery_rate_pct: number | null;
  average_best_score_pct: number | null;
  average_attempts: number | null;
  risk_score: number;
  risk_reasons: string[];
};

type ReadinessPayload = {
  content: {
    lessons_total: number;
    lessons_with_published_versions: number;
    lessons_missing_published: Array<{ id: string; code: string; title: string }>;
    lessons_missing_question_coverage: Array<{ id: string; code: string; title: string }>;
    lesson_versions_by_status: Record<string, number>;
    question_versions_by_status: Record<string, number>;
    moderation_backlog: {
      lessons: Record<string, number>;
      questions: Record<string, number>;
    };
  };
  access: {
    total_enrollments: number;
    enrollments_by_status: Record<string, number>;
  };
  operations: {
    generation_jobs_by_status: Record<string, number>;
    retry_exhausted_jobs: number;
    last_successful_job_at: string | null;
    queue_run_is_stale: boolean;
    queue_run_age_minutes: number | null;
    stuck_running_jobs: Array<{
      id: string;
      kind: 'lesson_draft' | 'question_draft';
      lesson_id: string | null;
      lesson_code: string | null;
      attempts_made: number;
      max_attempts: number;
      age_minutes: number | null;
      error_message: string | null;
    }>;
    stale_queued_jobs: Array<{
      id: string;
      kind: 'lesson_draft' | 'question_draft';
      lesson_id: string | null;
      lesson_code: string | null;
      attempts_made: number;
      max_attempts: number;
      age_minutes: number | null;
      error_message: string | null;
    }>;
    last_queue_run: {
      event_ts: string;
      attempted: number;
      succeeded: number;
      failed: number;
      skipped: number;
    } | null;
  };
  phase1_biology: {
    target_lessons_total: number;
    source_lessons_available: number;
    published_lessons_ready: number;
    question_covered_lessons_ready: number;
    missing_from_source: string[];
    missing_published: string[];
    missing_question_coverage: string[];
    lessons: Array<{
      lesson_code: string;
      title: string;
      unit_code: string;
      source_available: boolean;
      published_ready: boolean;
      question_coverage_ready: boolean;
    }>;
  };
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

type EnrollmentRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'student' | 'admin';
  status: 'active' | 'completed' | 'withdrawn';
  enrolled_at: string;
  completed_at: string | null;
  updated_at: string;
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
  const [questionVersions, setQuestionVersions] = useState<QuestionVersionRow[]>([]);
  const [questionStatusFilter, setQuestionStatusFilter] = useState<'all' | ContentStatus>('all');
  const [questionLessonFilter, setQuestionLessonFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingQuestionVersions, setLoadingQuestionVersions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyVersionId, setBusyVersionId] = useState<string | null>(null);
  const [busyQuestionVersionId, setBusyQuestionVersionId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [backfillingQuestions, setBackfillingQuestions] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [busyEnrollmentUserId, setBusyEnrollmentUserId] = useState<string | null>(null);
  const [newEnrollmentEmail, setNewEnrollmentEmail] = useState('');
  const [newJobLessonCode, setNewJobLessonCode] = useState('');
  const [newJobLessonCodesBulk, setNewJobLessonCodesBulk] = useState('');
  const [newJobPrompt, setNewJobPrompt] = useState('');
  const [outcomesWindowDays, setOutcomesWindowDays] = useState(30);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [outcomesSummary, setOutcomesSummary] = useState<V2OutcomesSummary | null>(null);
  const [outcomesUsers, setOutcomesUsers] = useState<V2OutcomesUserRow[]>([]);
  const [outcomesLessons, setOutcomesLessons] = useState<OutcomesLessonRow[]>([]);
  const [outcomesUnits, setOutcomesUnits] = useState<OutcomesUnitRow[]>([]);
  const [interventionLearners, setInterventionLearners] = useState<InterventionLearnerRow[]>([]);
  const [interventionLessons, setInterventionLessons] = useState<InterventionLessonRow[]>([]);
  const [loadingReadiness, setLoadingReadiness] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessPayload | null>(null);
  const [outcomesLessonCodeFilter, setOutcomesLessonCodeFilter] = useState('');
  const [outcomesUnitCodeFilter, setOutcomesUnitCodeFilter] = useState('');
  const [outcomesLessonSortBy, setOutcomesLessonSortBy] = useState<OutcomesLessonSortField>('mastery_rate');
  const [outcomesUnitSortBy, setOutcomesUnitSortBy] = useState<OutcomesUnitSortField>('mastery_rate');
  const [outcomesSortDir, setOutcomesSortDir] = useState<OutcomesSortDir>('desc');
  const [outcomesLimit, setOutcomesLimit] = useState(25);
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] = useState<'all' | EnrollmentRow['status']>('all');
  const [selectedUser, setSelectedUser] = useState<V2OutcomesUserRow | null>(null);
  const [selectedUserTimeline, setSelectedUserTimeline] = useState<TimeSeriesPoint[]>([]);
  const [loadingUserTimeline, setLoadingUserTimeline] = useState(false);
  const [approvalDecisions, setApprovalDecisions] = useState<ApprovalDecisionRow[]>([]);
  const [loadingApprovalDecisions, setLoadingApprovalDecisions] = useState(false);
  const [approvalDecisionFilter, setApprovalDecisionFilter] = useState<'all' | 'approved' | 'rejected' | 'override_publish'>('all');
  const [approvalLessonCodeFilter, setApprovalLessonCodeFilter] = useState('');
  const [approvalReviewerFilter, setApprovalReviewerFilter] = useState('');
  const [approvalDateFromFilter, setApprovalDateFromFilter] = useState('');
  const [approvalDateToFilter, setApprovalDateToFilter] = useState('');

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
      const response = await v2AuthedFetch(`/api/admin/v2/lesson-versions${query ? `?${query}` : ''}`, {
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

  async function loadQuestionVersions() {
    setLoadingQuestionVersions(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (questionStatusFilter !== 'all') params.set('status', questionStatusFilter);
      if (questionLessonFilter.trim()) params.set('lessonCode', questionLessonFilter.trim());
      const query = params.toString();
      const response = await v2AuthedFetch(`/api/admin/v2/question-versions${query ? `?${query}` : ''}`, {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 question versions.');
      }
      setQuestionVersions(Array.isArray(payload.versions) ? payload.versions : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 question versions.');
      setQuestionVersions([]);
    } finally {
      setLoadingQuestionVersions(false);
    }
  }

  async function loadJobs() {
    setLoadingJobs(true);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/generation-jobs', { cache: 'no-store' });
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
      const refreshResponse = await v2AuthedFetch(`/api/admin/v2/outcomes/refresh?days=${days}`, {
        method: 'POST',
        cache: 'no-store',
      });
      const refreshPayload = await refreshResponse.json();
      if (!refreshResponse.ok || refreshPayload.success === false) {
        throw new Error(refreshPayload.message || 'Failed to refresh V2 outcomes aggregates.');
      }

      const response = await v2AuthedFetch(`/api/admin/v2/outcomes/summary?days=${days}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 outcomes summary.');
      }

      const breakdownParams = new URLSearchParams({ days: String(days), sortDir: outcomesSortDir, limit: String(outcomesLimit) });
      if (outcomesLessonCodeFilter.trim()) breakdownParams.set('lessonCode', outcomesLessonCodeFilter.trim());
      if (outcomesUnitCodeFilter.trim()) breakdownParams.set('unitCode', outcomesUnitCodeFilter.trim());
      breakdownParams.set('lessonSortBy', outcomesLessonSortBy);
      breakdownParams.set('unitSortBy', outcomesUnitSortBy);

      const breakdownResponse = await v2AuthedFetch(`/api/admin/v2/outcomes/breakdown?${breakdownParams.toString()}`, {
        cache: 'no-store',
      });
      const breakdownPayload = await breakdownResponse.json();
      if (!breakdownResponse.ok || breakdownPayload.success === false) {
        throw new Error(breakdownPayload.message || 'Failed to load V2 outcomes breakdown.');
      }

      const interventionsResponse = await v2AuthedFetch(
        `/api/admin/v2/outcomes/interventions?days=${days}&limit=${encodeURIComponent(String(outcomesLimit))}`,
        { cache: 'no-store' }
      );
      const interventionsPayload = await interventionsResponse.json();
      if (!interventionsResponse.ok || interventionsPayload.success === false) {
        throw new Error(interventionsPayload.message || 'Failed to load V2 interventions.');
      }

      setOutcomesSummary(payload.summary ?? null);
      setOutcomesUsers(Array.isArray(payload.users) ? payload.users : []);
      setOutcomesLessons(Array.isArray(breakdownPayload.lessons) ? breakdownPayload.lessons : []);
      setOutcomesUnits(Array.isArray(breakdownPayload.units) ? breakdownPayload.units : []);
      setInterventionLearners(Array.isArray(interventionsPayload.learners) ? interventionsPayload.learners : []);
      setInterventionLessons(Array.isArray(interventionsPayload.lessons) ? interventionsPayload.lessons : []);
      if (selectedUser) {
        await loadSelectedUserTimeline(selectedUser.user_id, days);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 outcomes summary.');
      setOutcomesSummary(null);
      setOutcomesUsers([]);
      setOutcomesLessons([]);
      setOutcomesUnits([]);
      setInterventionLearners([]);
      setInterventionLessons([]);
    } finally {
      setLoadingOutcomes(false);
    }
  }

  async function loadReadiness() {
    setLoadingReadiness(true);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/readiness', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 readiness.');
      }
      setReadiness(payload as ReadinessPayload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 readiness.');
      setReadiness(null);
    } finally {
      setLoadingReadiness(false);
    }
  }

  async function loadSelectedUserTimeline(userId: string, days = outcomesWindowDays) {
    setLoadingUserTimeline(true);
    setError(null);
    try {
      const response = await v2AuthedFetch(
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
      const params = new URLSearchParams();
      params.set('limit', '200');
      if (approvalDecisionFilter !== 'all') params.set('decision', approvalDecisionFilter);
      if (approvalLessonCodeFilter.trim()) params.set('lessonCode', approvalLessonCodeFilter.trim());
      if (approvalReviewerFilter.trim()) params.set('reviewerId', approvalReviewerFilter.trim());
      if (approvalDateFromFilter.trim()) params.set('dateFrom', approvalDateFromFilter.trim());
      if (approvalDateToFilter.trim()) params.set('dateTo', approvalDateToFilter.trim());
      const response = await v2AuthedFetch(`/api/admin/v2/approval-decisions?${params.toString()}`, { cache: 'no-store' });
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

  async function loadEnrollments() {
    setLoadingEnrollments(true);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/enrollments', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to load V2 enrollments.');
      }
      setEnrollments(Array.isArray(payload.enrollments) ? payload.enrollments : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load V2 enrollments.');
      setEnrollments([]);
    } finally {
      setLoadingEnrollments(false);
    }
  }

  async function updateEnrollment(action: 'grant' | 'withdraw', userId?: string, email?: string) {
    setBusyEnrollmentUserId(userId ?? email ?? 'new');
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId,
          email,
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to update V2 enrollment.');
      }
      if (action === 'grant') {
        setNewEnrollmentEmail('');
      }
      await Promise.all([loadEnrollments(), loadReadiness()]);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update V2 enrollment.');
    } finally {
      setBusyEnrollmentUserId(null);
    }
  }

  function exportApprovalDecisionsCsv() {
    if (approvalDecisions.length === 0) return;
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ['created_at', 'decision', 'reviewer', 'reviewer_id', 'lesson_code', 'lesson_title', 'version_no', 'reason'],
      ...approvalDecisions.map((row) => [
        row.created_at,
        row.decision,
        row.reviewer.display_name ?? '',
        row.reviewer.user_id,
        row.lesson?.code ?? '',
        row.lesson?.title ?? '',
        row.lesson_version ? String(row.lesson_version.version_no) : '',
        row.reason ?? '',
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => escape(cell)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `v2-moderation-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    void loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    void loadQuestionVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionStatusFilter]);

  useEffect(() => {
    void loadJobs();
    void loadApprovalDecisions();
    void loadEnrollments();
    void loadReadiness();
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
  }, [selectedUser]);

  const publishedCount = useMemo(
    () => versions.filter((version) => version.status === 'published').length,
    [versions]
  );
  const filteredEnrollments = useMemo(
    () =>
      enrollmentStatusFilter === 'all'
        ? enrollments
        : enrollments.filter((row) => row.status === enrollmentStatusFilter),
    [enrollmentStatusFilter, enrollments]
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

      const response = await v2AuthedFetch('/api/admin/v2/lesson-versions/status', {
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
      await Promise.all([loadVersions(), loadReadiness()]);
    } catch (transitionError) {
      setError(transitionError instanceof Error ? transitionError.message : 'Failed to transition version.');
    } finally {
      setBusyVersionId(null);
    }
  }

  async function transitionQuestionVersion(versionId: string, action: UpdateAction) {
    setBusyQuestionVersionId(versionId);
    setError(null);
    try {
      const moderation = collectModerationPayloadIfRequired(action);
      if ((action === 'approve' || action === 'publish') && !moderation) {
        throw new Error('Moderation checklist was not completed.');
      }

      const response = await v2AuthedFetch('/api/admin/v2/question-versions/status', {
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
          throw new Error(`Question publish gate failed: ${gateIssues.join(' | ')}`);
        }
        throw new Error(payload.message || 'Failed to transition question version.');
      }
      await Promise.all([loadQuestionVersions(), loadReadiness()]);
    } catch (transitionError) {
      setError(transitionError instanceof Error ? transitionError.message : 'Failed to transition question version.');
    } finally {
      setBusyQuestionVersionId(null);
    }
  }

  async function createLessonDraftJob() {
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/generation-jobs', {
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
      await Promise.all([loadJobs(), loadReadiness()]);
      setNewJobPrompt('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create generation job.');
    }
  }

  async function createQuestionDraftJob() {
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/generation-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'question_draft',
          lessonCode: newJobLessonCode.trim(),
          prompt: newJobPrompt.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to create question generation job.');
      }
      await Promise.all([loadJobs(), loadQuestionVersions(), loadReadiness()]);
      setNewJobPrompt('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create question generation job.');
    }
  }

  async function createBatchLessonDraftJobs() {
    setError(null);
    try {
      const lessonCodes = newJobLessonCodesBulk
        .split(/\r?\n|,/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      if (lessonCodes.length === 0) {
        throw new Error('Enter one or more lesson codes for batch queueing.');
      }
      const response = await v2AuthedFetch('/api/admin/v2/generation-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'lesson_draft',
          lessonCodes,
          prompt: newJobPrompt.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to create batch generation jobs.');
      }
      await Promise.all([loadJobs(), loadReadiness()]);
      setNewJobLessonCodesBulk('');
      setNewJobPrompt('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create batch generation jobs.');
    }
  }

  async function createBatchQuestionDraftJobs() {
    setError(null);
    try {
      const lessonCodes = newJobLessonCodesBulk
        .split(/\r?\n|,/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      if (lessonCodes.length === 0) {
        throw new Error('Enter one or more lesson codes for batch queueing.');
      }
      const response = await v2AuthedFetch('/api/admin/v2/generation-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'question_draft',
          lessonCodes,
          prompt: newJobPrompt.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to create batch question generation jobs.');
      }
      await Promise.all([loadJobs(), loadQuestionVersions(), loadReadiness()]);
      setNewJobLessonCodesBulk('');
      setNewJobPrompt('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create batch question generation jobs.');
    }
  }

  async function runJob(jobId: string) {
    setBusyJobId(jobId);
    setError(null);
    try {
      const response = await v2AuthedFetch(`/api/admin/v2/generation-jobs/${encodeURIComponent(jobId)}/run`, {
        method: 'POST',
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to run generation job.');
      }
      await Promise.all([loadJobs(), loadVersions(), loadReadiness()]);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Failed to run generation job.');
    } finally {
      setBusyJobId(null);
    }
  }

  async function requeueJob(jobId: string, force = false) {
    setBusyJobId(jobId);
    setError(null);
    try {
      const response = await v2AuthedFetch(`/api/admin/v2/generation-jobs/${encodeURIComponent(jobId)}/requeue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to requeue generation job.');
      }
      await Promise.all([loadJobs(), loadReadiness()]);
    } catch (requeueError) {
      setError(requeueError instanceof Error ? requeueError.message : 'Failed to requeue generation job.');
    } finally {
      setBusyJobId(null);
    }
  }

  async function backfillQuestionBank() {
    setBackfillingQuestions(true);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/admin/v2/question-bank/backfill', {
        method: 'POST',
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Failed to backfill published question bank.');
      }
      await Promise.all([loadVersions(), loadReadiness()]);
    } catch (backfillError) {
      setError(backfillError instanceof Error ? backfillError.message : 'Failed to backfill published question bank.');
    } finally {
      setBackfillingQuestions(false);
    }
  }

  return (
    <V2Shell title="V2 Admin Content" subtitle="Draft -> review -> approve -> publish">
      <p>Use this page to manage V2 lesson version status without any V1 fallback.</p>
      <p>Total versions: {versions.length}</p>
      <p>Published versions: {publishedCount}</p>

      <h2>V2 Access</h2>
      <p>V2 learner access is now explicit. Accounts must have an active V2 enrollment to enter learner routes.</p>
      <p>
        <label htmlFor="newEnrollmentEmail">Grant by email: </label>
        <input
          id="newEnrollmentEmail"
          value={newEnrollmentEmail}
          onChange={(event) => setNewEnrollmentEmail(event.target.value)}
          placeholder="student@example.com"
        />{' '}
        <button
          type="button"
          onClick={() => void updateEnrollment('grant', undefined, newEnrollmentEmail.trim())}
          disabled={!newEnrollmentEmail.trim() || busyEnrollmentUserId === 'new'}
        >
          {busyEnrollmentUserId === 'new' ? 'Granting...' : 'Grant access'}
        </button>{' '}
        <button type="button" onClick={() => void loadEnrollments()} disabled={loadingEnrollments}>
          {loadingEnrollments ? 'Loading enrollments...' : 'Refresh access list'}
        </button>
      </p>
      <p>
        <label htmlFor="enrollmentStatusFilter">Status filter: </label>
        <select
          id="enrollmentStatusFilter"
          value={enrollmentStatusFilter}
          onChange={(event) => setEnrollmentStatusFilter(event.target.value as 'all' | EnrollmentRow['status'])}
        >
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="completed">completed</option>
          <option value="withdrawn">withdrawn</option>
        </select>
      </p>
      {filteredEnrollments.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">User</th>
              <th align="left">Role</th>
              <th align="left">Status</th>
              <th align="left">Updated</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.map((row) => (
              <tr key={row.user_id}>
                <td>
                  <div>{row.display_name ?? row.user_id}</div>
                  <div>{row.email ?? row.user_id}</div>
                </td>
                <td>{row.role}</td>
                <td>{row.status}</td>
                <td>{new Date(row.updated_at).toLocaleString()}</td>
                <td>
                  {row.status !== 'active' ? (
                    <button
                      type="button"
                      onClick={() => void updateEnrollment('grant', row.user_id)}
                      disabled={busyEnrollmentUserId === row.user_id}
                    >
                      {busyEnrollmentUserId === row.user_id ? 'Updating...' : 'Grant'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void updateEnrollment('withdraw', row.user_id)}
                      disabled={busyEnrollmentUserId === row.user_id}
                    >
                      {busyEnrollmentUserId === row.user_id ? 'Updating...' : 'Withdraw'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

      <h2>V2 Question Bank</h2>
      <p>Review and transition versioned quiz questions independently from lesson versions.</p>
      <p>
        <label htmlFor="questionStatusFilter">Question status filter: </label>
        <select
          id="questionStatusFilter"
          value={questionStatusFilter}
          onChange={(event) => setQuestionStatusFilter(event.target.value as 'all' | ContentStatus)}
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
        <label htmlFor="questionLessonFilter">Lesson code filter: </label>
        <input
          id="questionLessonFilter"
          value={questionLessonFilter}
          onChange={(event) => setQuestionLessonFilter(event.target.value)}
          placeholder="BIO-101-1A"
        />{' '}
        <button type="button" onClick={() => void loadQuestionVersions()}>
          Apply
        </button>
      </p>
      {loadingQuestionVersions && <p>Loading V2 question versions...</p>}
      {!loadingQuestionVersions && questionVersions.length === 0 && <p>No V2 question versions found for this filter.</p>}
      {questionVersions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th align="left">Question</th>
              <th align="left">Lesson</th>
              <th align="left">Version</th>
              <th align="left">Status</th>
              <th align="left">Current</th>
              <th align="left">Source</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionVersions.map((version) => (
              <tr key={version.id}>
                <td>
                  <div>{version.question?.stable_key ?? version.question_id}</div>
                  <div>{version.stem}</div>
                </td>
                <td>{version.lesson?.code ?? '-'}</td>
                <td>v{version.version_no}</td>
                <td>{version.status}</td>
                <td>{version.is_current ? 'yes' : 'no'}</td>
                <td>{version.source}</td>
                <td>
                  {allowedActions(version.status).map((action) => (
                    <button
                      key={`${version.id}-${action}`}
                      type="button"
                      disabled={busyQuestionVersionId === version.id}
                      onClick={() => void transitionQuestionVersion(version.id, action)}
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

      <h2>V2 Readiness</h2>
      <p>Check whether content, access, and operations are ready for a stable Biology demo.</p>
      <p>
        <button type="button" onClick={() => void loadReadiness()} disabled={loadingReadiness}>
          {loadingReadiness ? 'Loading readiness...' : 'Refresh readiness'}
        </button>
      </p>
      {readiness && (
        <>
          <h3>Content readiness</h3>
          <p>
            Published lessons: {readiness.content.lessons_with_published_versions}/{readiness.content.lessons_total}
          </p>
          <p>Missing published lessons: {readiness.content.lessons_missing_published.length}</p>
          <p>Missing question coverage: {readiness.content.lessons_missing_question_coverage.length}</p>
          <p>Lesson versions by status: {JSON.stringify(readiness.content.lesson_versions_by_status)}</p>
          <p>Question versions by status: {JSON.stringify(readiness.content.question_versions_by_status)}</p>
          <p>
            Moderation backlog:
            {' '}lesson draft {readiness.content.moderation_backlog.lessons.draft ?? 0},
            {' '}lesson review {readiness.content.moderation_backlog.lessons.needs_review ?? 0},
            {' '}lesson approved {readiness.content.moderation_backlog.lessons.approved ?? 0},
            {' '}question draft {readiness.content.moderation_backlog.questions.draft ?? 0},
            {' '}question review {readiness.content.moderation_backlog.questions.needs_review ?? 0},
            {' '}question approved {readiness.content.moderation_backlog.questions.approved ?? 0}
          </p>
          {readiness.content.lessons_missing_published.length > 0 && (
            <>
              <h4>Lessons missing published versions</h4>
              <table>
                <thead>
                  <tr>
                    <th align="left">Code</th>
                    <th align="left">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {readiness.content.lessons_missing_published.map((lesson) => (
                    <tr key={`missing-published-${lesson.id}`}>
                      <td>{lesson.code}</td>
                      <td>{lesson.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {readiness.content.lessons_missing_question_coverage.length > 0 && (
            <>
              <h4>Lessons missing question coverage</h4>
              <table>
                <thead>
                  <tr>
                    <th align="left">Code</th>
                    <th align="left">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {readiness.content.lessons_missing_question_coverage.map((lesson) => (
                    <tr key={`missing-questions-${lesson.id}`}>
                      <td>{lesson.code}</td>
                      <td>{lesson.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <h3>Phase 1 Biology target</h3>
          <p>
            Source lessons ready: {readiness.phase1_biology.source_lessons_available}/
            {readiness.phase1_biology.target_lessons_total}
          </p>
          <p>
            Published target lessons: {readiness.phase1_biology.published_lessons_ready}/
            {readiness.phase1_biology.target_lessons_total}
          </p>
          <p>
            Question-covered target lessons: {readiness.phase1_biology.question_covered_lessons_ready}/
            {readiness.phase1_biology.target_lessons_total}
          </p>
          <p>
            Missing from source: {readiness.phase1_biology.missing_from_source.join(', ') || '-'}
          </p>
          <p>
            Missing published target lessons: {readiness.phase1_biology.missing_published.join(', ') || '-'}
          </p>
          <p>
            Missing target question coverage:{' '}
            {readiness.phase1_biology.missing_question_coverage.join(', ') || '-'}
          </p>
          <table>
            <thead>
              <tr>
                <th align="left">Lesson</th>
                <th align="left">Unit</th>
                <th align="left">Source</th>
                <th align="left">Published</th>
                <th align="left">Questions</th>
              </tr>
            </thead>
            <tbody>
              {readiness.phase1_biology.lessons.map((lesson) => (
                <tr key={`phase1-bio-${lesson.lesson_code}`}>
                  <td>
                    <div>{lesson.lesson_code}</div>
                    <div>{lesson.title}</div>
                  </td>
                  <td>{lesson.unit_code}</td>
                  <td>{lesson.source_available ? 'yes' : 'no'}</td>
                  <td>{lesson.published_ready ? 'yes' : 'no'}</td>
                  <td>{lesson.question_coverage_ready ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Access readiness</h3>
          <p>Total enrollments: {readiness.access.total_enrollments}</p>
          <p>Enrollments by status: {JSON.stringify(readiness.access.enrollments_by_status)}</p>

          <h3>Operational readiness</h3>
          <p>Generation jobs by status: {JSON.stringify(readiness.operations.generation_jobs_by_status)}</p>
          <p>Retry exhausted jobs: {readiness.operations.retry_exhausted_jobs}</p>
          <p>Stuck running jobs: {readiness.operations.stuck_running_jobs.length}</p>
          <p>Stale queued jobs: {readiness.operations.stale_queued_jobs.length}</p>
          <p>
            Last successful generation job:{' '}
            {readiness.operations.last_successful_job_at
              ? new Date(readiness.operations.last_successful_job_at).toLocaleString()
              : '-'}
          </p>
          <p>
            Queue freshness:{' '}
            {readiness.operations.queue_run_is_stale
              ? `stale (${readiness.operations.queue_run_age_minutes ?? '-'} min since last run)`
              : `ok${readiness.operations.queue_run_age_minutes == null ? '' : ` (${readiness.operations.queue_run_age_minutes} min ago)`}`}
          </p>
          <p>
            Last queue run:{' '}
            {readiness.operations.last_queue_run
              ? `${new Date(readiness.operations.last_queue_run.event_ts).toLocaleString()} | attempted ${readiness.operations.last_queue_run.attempted} | succeeded ${readiness.operations.last_queue_run.succeeded} | failed ${readiness.operations.last_queue_run.failed} | skipped ${readiness.operations.last_queue_run.skipped}`
              : '-'}
          </p>
          {readiness.operations.stuck_running_jobs.length > 0 && (
            <>
              <h4>Stuck running jobs</h4>
              <table>
                <thead>
                  <tr>
                    <th align="left">Job</th>
                    <th align="left">Kind</th>
                    <th align="left">Lesson</th>
                    <th align="left">Age</th>
                    <th align="left">Attempts</th>
                    <th align="left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {readiness.operations.stuck_running_jobs.map((job) => (
                    <tr key={`stuck-${job.id}`}>
                      <td>{job.id.slice(0, 8)}</td>
                      <td>{job.kind}</td>
                      <td>{job.lesson_code ?? job.lesson_id ?? '-'}</td>
                      <td>{job.age_minutes == null ? '-' : `${job.age_minutes} min`}</td>
                      <td>{job.attempts_made}/{job.max_attempts}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => void requeueJob(job.id, true)}
                          disabled={busyJobId === job.id}
                        >
                          {busyJobId === job.id ? 'Requeueing...' : 'Force requeue'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {readiness.operations.stale_queued_jobs.length > 0 && (
            <>
              <h4>Stale queued jobs</h4>
              <table>
                <thead>
                  <tr>
                    <th align="left">Job</th>
                    <th align="left">Kind</th>
                    <th align="left">Lesson</th>
                    <th align="left">Age</th>
                    <th align="left">Attempts</th>
                    <th align="left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {readiness.operations.stale_queued_jobs.map((job) => (
                    <tr key={`queued-${job.id}`}>
                      <td>{job.id.slice(0, 8)}</td>
                      <td>{job.kind}</td>
                      <td>{job.lesson_code ?? job.lesson_id ?? '-'}</td>
                      <td>{job.age_minutes == null ? '-' : `${job.age_minutes} min`}</td>
                      <td>{job.attempts_made}/{job.max_attempts}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => void runJob(job.id)}
                          disabled={busyJobId === job.id}
                        >
                          {busyJobId === job.id ? 'Running...' : 'Run now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
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
          {loadingOutcomes ? 'Refreshing aggregates...' : 'Refresh outcomes'}
        </button>
      </p>
      <p>
        <label htmlFor="outcomesLessonCodeFilter">Lesson code filter: </label>
        <input
          id="outcomesLessonCodeFilter"
          value={outcomesLessonCodeFilter}
          onChange={(event) => setOutcomesLessonCodeFilter(event.target.value)}
          placeholder="BIO-104"
        />{' '}
        <label htmlFor="outcomesUnitCodeFilter">Unit code filter: </label>
        <input
          id="outcomesUnitCodeFilter"
          value={outcomesUnitCodeFilter}
          onChange={(event) => setOutcomesUnitCodeFilter(event.target.value)}
          placeholder="BIO-CELL"
        />
      </p>
      <p>
        <label htmlFor="outcomesLessonSortBy">Lesson sort: </label>
        <select
          id="outcomesLessonSortBy"
          value={outcomesLessonSortBy}
          onChange={(event) => setOutcomesLessonSortBy(event.target.value as OutcomesLessonSortField)}
        >
          <option value="mastery_rate">mastery rate</option>
          <option value="average_best_score">average best score</option>
          <option value="average_attempts">average attempts</option>
          <option value="learners_started">learners started</option>
          <option value="lesson_code">lesson code</option>
        </select>{' '}
        <label htmlFor="outcomesUnitSortBy">Unit sort: </label>
        <select
          id="outcomesUnitSortBy"
          value={outcomesUnitSortBy}
          onChange={(event) => setOutcomesUnitSortBy(event.target.value as OutcomesUnitSortField)}
        >
          <option value="mastery_rate">mastery rate</option>
          <option value="average_best_score">average best score</option>
          <option value="average_attempts">average attempts</option>
          <option value="learners_started">learners started</option>
          <option value="unit_code">unit code</option>
        </select>{' '}
        <label htmlFor="outcomesSortDir">Direction: </label>
        <select
          id="outcomesSortDir"
          value={outcomesSortDir}
          onChange={(event) => setOutcomesSortDir(event.target.value as OutcomesSortDir)}
        >
          <option value="desc">desc</option>
          <option value="asc">asc</option>
        </select>{' '}
        <label htmlFor="outcomesLimit">Rows: </label>
        <select
          id="outcomesLimit"
          value={outcomesLimit}
          onChange={(event) => setOutcomesLimit(Number(event.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
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

      {interventionLearners.length > 0 && (
        <>
          <h3>Intervention learners</h3>
          <table>
            <thead>
              <tr>
                <th align="left">Learner</th>
                <th align="left">Risk</th>
                <th align="left">Accuracy</th>
                <th align="left">Completion</th>
                <th align="left">Mastery</th>
                <th align="left">Review backlog</th>
                <th align="left">Reasons</th>
              </tr>
            </thead>
            <tbody>
              {interventionLearners.map((row) => (
                <tr key={`intervention-learner-${row.user_id}`}>
                  <td>{row.display_name ?? row.user_id}</td>
                  <td>{row.risk_score}</td>
                  <td>{formatPct(row.accuracy_pct)}</td>
                  <td>{formatPct(row.completion_rate_pct)}</td>
                  <td>{formatPct(row.mastery_rate_pct)}</td>
                  <td>{row.review_backlog}</td>
                  <td>{row.risk_reasons.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {interventionLessons.length > 0 && (
        <>
          <h3>Intervention lessons</h3>
          <table>
            <thead>
              <tr>
                <th align="left">Lesson</th>
                <th align="left">Risk</th>
                <th align="left">Learners</th>
                <th align="left">Mastery</th>
                <th align="left">Avg best score</th>
                <th align="left">Avg attempts</th>
                <th align="left">Reasons</th>
              </tr>
            </thead>
            <tbody>
              {interventionLessons.map((row) => (
                <tr key={`intervention-lesson-${row.lesson_id}`}>
                  <td>
                    <div>{row.lesson_code}</div>
                    <div>{row.lesson_title}</div>
                  </td>
                  <td>{row.risk_score}</td>
                  <td>{row.learners_started}</td>
                  <td>{formatPct(row.mastery_rate_pct)}</td>
                  <td>{formatPct(row.average_best_score_pct)}</td>
                  <td>{row.average_attempts == null ? '-' : row.average_attempts.toFixed(1)}</td>
                  <td>{row.risk_reasons.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {outcomesLessons.length > 0 && (
        <>
          <h3>Lesson Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th align="left">Lesson</th>
                <th align="left">Unit</th>
                <th align="left">Learners</th>
                <th align="left">Mastery</th>
                <th align="left">Avg best score</th>
                <th align="left">Avg attempts</th>
              </tr>
            </thead>
            <tbody>
              {outcomesLessons.map((row) => (
                <tr key={row.lesson_id}>
                  <td>
                    <div>{row.lesson_code}</div>
                    <div>{row.lesson_title}</div>
                  </td>
                  <td>{row.unit_code ?? '-'}</td>
                  <td>{row.learners_started}</td>
                  <td>
                    {row.learners_mastered}/{row.learners_started} ({formatPct(row.mastery_rate_pct)})
                  </td>
                  <td>{formatPct(row.average_best_score_pct)}</td>
                  <td>{row.average_attempts == null ? '-' : row.average_attempts.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {outcomesUnits.length > 0 && (
        <>
          <h3>Unit Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th align="left">Unit</th>
                <th align="left">Lessons</th>
                <th align="left">Learners</th>
                <th align="left">Mastery</th>
                <th align="left">Avg best score</th>
                <th align="left">Avg attempts</th>
              </tr>
            </thead>
            <tbody>
              {outcomesUnits.map((row) => (
                <tr key={row.unit_code}>
                  <td>
                    <div>{row.unit_code}</div>
                    <div>{row.unit_name}</div>
                  </td>
                  <td>{row.lessons_tracked}</td>
                  <td>{row.learners_started}</td>
                  <td>
                    {row.learners_mastered}/{row.learners_started} ({formatPct(row.mastery_rate_pct)})
                  </td>
                  <td>{formatPct(row.average_best_score_pct)}</td>
                  <td>{row.average_attempts == null ? '-' : row.average_attempts.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
        <label htmlFor="approvalDecisionFilter">Decision: </label>
        <select
          id="approvalDecisionFilter"
          value={approvalDecisionFilter}
          onChange={(event) =>
            setApprovalDecisionFilter(
              event.target.value as 'all' | 'approved' | 'rejected' | 'override_publish'
            )
          }
        >
          <option value="all">all</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="override_publish">override_publish</option>
        </select>{' '}
        <label htmlFor="approvalLessonCodeFilter">Lesson code: </label>
        <input
          id="approvalLessonCodeFilter"
          value={approvalLessonCodeFilter}
          onChange={(event) => setApprovalLessonCodeFilter(event.target.value)}
          placeholder="BIO-104"
        />{' '}
        <label htmlFor="approvalReviewerFilter">Reviewer ID: </label>
        <input
          id="approvalReviewerFilter"
          value={approvalReviewerFilter}
          onChange={(event) => setApprovalReviewerFilter(event.target.value)}
          placeholder="user uuid"
        />
      </p>
      <p>
        <label htmlFor="approvalDateFromFilter">From: </label>
        <input
          id="approvalDateFromFilter"
          type="datetime-local"
          value={approvalDateFromFilter}
          onChange={(event) => setApprovalDateFromFilter(event.target.value)}
        />{' '}
        <label htmlFor="approvalDateToFilter">To: </label>
        <input
          id="approvalDateToFilter"
          type="datetime-local"
          value={approvalDateToFilter}
          onChange={(event) => setApprovalDateToFilter(event.target.value)}
        />
      </p>
      <p>
        <button type="button" onClick={() => void loadApprovalDecisions()} disabled={loadingApprovalDecisions}>
          {loadingApprovalDecisions ? 'Loading moderation history...' : 'Refresh moderation history'}
        </button>{' '}
        <button type="button" onClick={exportApprovalDecisionsCsv} disabled={approvalDecisions.length === 0}>
          Export CSV
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
      <p>Create queued lesson or question draft jobs, then run them to produce V2 draft content for moderation.</p>
      <p>
        <button type="button" onClick={() => void backfillQuestionBank()} disabled={backfillingQuestions}>
          {backfillingQuestions ? 'Backfilling question bank...' : 'Backfill question bank from published lessons'}
        </button>
      </p>
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
        <button
          type="button"
          onClick={() => void createQuestionDraftJob()}
          disabled={!newJobLessonCode.trim()}
        >
          Queue question draft job
        </button>{' '}
        <button
          type="button"
          onClick={() => void createBatchLessonDraftJobs()}
          disabled={!newJobLessonCodesBulk.trim()}
        >
          Queue batch jobs
        </button>{' '}
        <button
          type="button"
          onClick={() => void createBatchQuestionDraftJobs()}
          disabled={!newJobLessonCodesBulk.trim()}
        >
          Queue batch question jobs
        </button>{' '}
        <button type="button" onClick={() => void loadJobs()} disabled={loadingJobs}>
          {loadingJobs ? 'Loading jobs...' : 'Refresh jobs'}
        </button>
      </p>
      <p>
        <label htmlFor="newJobLessonCodesBulk">Batch lesson codes (comma or newline separated): </label>
        <br />
        <textarea
          id="newJobLessonCodesBulk"
          value={newJobLessonCodesBulk}
          onChange={(event) => setNewJobLessonCodesBulk(event.target.value)}
          placeholder={'BIO-105-1A\nBIO-105-1B\nBIO-106-1A'}
          rows={4}
          cols={40}
        />
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
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() => void requeueJob(job.id, job.status === 'running')}
                    disabled={
                      busyJobId === job.id ||
                      (job.status !== 'failed' && job.status !== 'cancelled' && job.status !== 'running')
                    }
                  >
                    {busyJobId === job.id ? 'Requeueing...' : job.status === 'running' ? 'Force requeue' : 'Requeue'}
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
