'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface RunRow {
  id: string;
  unit_code: string;
  level: 2 | 3;
  lo_codes: string[] | null;
  target_count: number;
  status: string;
  created_at: string;
  summary: Record<string, unknown> | null;
}

interface StepRow {
  step_key: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  output: Record<string, unknown> | null;
  error: string | null;
}

interface DraftRow {
  id: string;
  unit_code: string;
  lo_code: string | null;
  ac_code: string | null;
  level: number;
  difficulty: string;
  format: string;
  status: string;
  stem: string;
}

interface QuestionBankRow extends DraftRow {
  generation_run_id?: string | null;
  created_at?: string;
}

interface ExistingQualityReport {
  summary: {
    unit_code: string;
    level: number;
    checked_count: number;
    valid_count: number;
    issue_count: number;
    schema_fail_count: number;
    alignment_fail_count: number;
    near_duplicate_count: number;
  };
  issues: Array<{
    question_id: string;
    status: string;
    reasons: string[];
  }>;
}

interface CatalogUnit {
  unit_code: string;
  unit_title: string;
  level_min: number;
  level_max: number;
  approved_question_count: number;
  approved_by_level: { 2: number; 3: number };
}

interface UnitLo {
  lo_code: string;
  lo_title: string | null;
  lo_text_preview: string;
  approved_question_count: number;
}

interface DuplicateCluster {
  key: string;
  size: number;
  ids: string[];
  keep_id: string;
  lo_codes: string[];
  ac_codes: string[];
  sample_stem: string;
  strongest_pair_score: number;
}

interface BatchTrialResult {
  trial: {
    unit_code: string;
    lo_code: string;
    level: number;
    requested_count: number;
    model: string;
    elapsed_ms: number;
  };
  output: {
    parsed_count: number;
    accepted_count?: number;
    attempt_summary?: string[];
    valid_count: number;
    invalid_count: number;
    alignment_pass_count: number;
    alignment_fail_count: number;
    exact_dup_stem_count: number;
    near_dup_pairs: number;
    answer_correlated_pairs: number;
  };
  examples: Array<{
    i: number;
    j: number;
    stemScore: number;
    answerScore: number;
    stemA: string;
    stemB: string;
    answerA: string;
    answerB: string;
  }>;
  alignment_examples: Array<{
    i: number;
    score: number;
    threshold: number;
    reasons: string[];
    matched_terms: string[];
    stem: string;
  }>;
  questions: Array<{
    unit_code: string;
    lo_code: string;
    ac_code: string;
    level: number;
    difficulty: string;
    format: string;
    stem: string;
    options: string[];
    correct: string;
    rationale: string;
  }>;
  attempted_questions?: Array<{
    unit_code: string;
    lo_code: string;
    ac_code: string;
    level: number;
    difficulty: string;
    format: string;
    stem: string;
    options: string[];
    correct: string;
    rationale: string;
  }>;
}

const defaultFormatMix = { mcq: 1 };
const defaultDifficultyMix = { easy: 0.4, med: 0.5, hard: 0.1 };
const runStepOrder: StepRow['step_key'][] = ['distill', 'analyze', 'extract_coverage', 'plan', 'build_blueprints', 'validate', 'refresh_summary'];

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

export default function AdminQuestionsPage() {
  const [catalogUnits, setCatalogUnits] = useState<CatalogUnit[]>([]);
  const [unitLos, setUnitLos] = useState<UnitLo[]>([]);
  const [selectedLoCodes, setSelectedLoCodes] = useState<string[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingRun, setStartingRun] = useState(false);
  const [cancellingRun, setCancellingRun] = useState(false);
  const [startElapsedSeconds, setStartElapsedSeconds] = useState(0);
  const [reviewingQuestionId, setReviewingQuestionId] = useState<string | null>(null);
  const [bulkApproving, setBulkApproving] = useState(false);
  const [retiringQuestionId, setRetiringQuestionId] = useState<string | null>(null);
  const [bulkRetiringQuestions, setBulkRetiringQuestions] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [bulkDeletingQuestions, setBulkDeletingQuestions] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [resolvingClusterKey, setResolvingClusterKey] = useState<string | null>(null);
  const [bulkResolvingClusters, setBulkResolvingClusters] = useState(false);
  const [selectedClusterKeys, setSelectedClusterKeys] = useState<string[]>([]);
  const [runningBatchTrial, setRunningBatchTrial] = useState(false);
  const [batchTrialProgress, setBatchTrialProgress] = useState(0);
  const [batchTrialResult, setBatchTrialResult] = useState<BatchTrialResult | null>(null);
  const [trialContextInjectionsText, setTrialContextInjectionsText] = useState('');
  const [duplicateClusters, setDuplicateClusters] = useState<DuplicateCluster[]>([]);
  const [duplicateAnalyzedItems, setDuplicateAnalyzedItems] = useState(0);
  const [duplicateTotalInScope, setDuplicateTotalInScope] = useState(0);
  const [scopedQuestions, setScopedQuestions] = useState<QuestionBankRow[]>([]);
  const [loadingScopedQuestions, setLoadingScopedQuestions] = useState(false);
  const [includeRetiredInScope, setIncludeRetiredInScope] = useState(false);
  const [runningExistingQualityCheck, setRunningExistingQualityCheck] = useState(false);
  const [existingQualityReport, setExistingQualityReport] = useState<ExistingQualityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [unitCode, setUnitCode] = useState('');
  const [level, setLevel] = useState<2 | 3>(2);
  const [targetCount, setTargetCount] = useState(50);
  const [formatMixJson, setFormatMixJson] = useState(JSON.stringify(defaultFormatMix));
  const [difficultyMixJson, setDifficultyMixJson] = useState(JSON.stringify(defaultDifficultyMix));

  const selectedRun = useMemo(() => runs.find((row) => row.id === selectedRunId) ?? null, [runs, selectedRunId]);
  const pendingDrafts = useMemo(() => drafts.filter((draft) => draft.status === 'draft'), [drafts]);
  const selectableRunQuestions = useMemo(() => drafts.filter((row) => row.status !== 'retired'), [drafts]);
  const selectedRunQuestions = useMemo(
    () => selectableRunQuestions.filter((row) => selectedQuestionIds.includes(row.id)),
    [selectableRunQuestions, selectedQuestionIds]
  );
  const retiredRunQuestions = useMemo(() => drafts.filter((row) => row.status === 'retired'), [drafts]);
  const selectedDeletableRunQuestions = useMemo(
    () => selectableRunQuestions.filter((row) => selectedQuestionIds.includes(row.id) && row.status !== 'draft'),
    [selectableRunQuestions, selectedQuestionIds]
  );
  const canCancelSelectedRun = useMemo(
    () => Boolean(selectedRun && (selectedRun.status === 'queued' || selectedRun.status === 'running')),
    [selectedRun]
  );
  const runProgress = useMemo(() => {
    if (!selectedRun) return { percent: 0, label: 'No run selected' };
    const completed = new Set(steps.filter((step) => step.status === 'completed').map((step) => step.step_key));
    let fraction = completed.size / runStepOrder.length;
    const validateStep = steps.find((step) => step.step_key === 'validate');
    const validateProgress = (validateStep?.output?.progress as Record<string, unknown> | undefined) ?? undefined;
    const processed = Number(validateProgress?.processed_blueprints ?? 0);
    const total = Number(validateProgress?.total_blueprints ?? 0);
    if (validateStep?.status === 'running' && Number.isFinite(processed) && Number.isFinite(total) && total > 0) {
      const validateIndex = runStepOrder.indexOf('validate');
      const perStep = 1 / runStepOrder.length;
      fraction = validateIndex * perStep + Math.min(1, Math.max(0, processed / total)) * perStep;
    }
    if (selectedRun.status === 'completed' || selectedRun.status === 'failed' || selectedRun.status === 'cancelled') {
      fraction = Math.max(fraction, 1);
    }
    const percent = Math.max(0, Math.min(100, Math.round(fraction * 100)));
    let label = `Run progress ${percent}%`;
    if (validateStep?.status === 'running' && total > 0) {
      label = `Validate ${processed}/${total} blueprints (${percent}%)`;
    }
    return { percent, label };
  }, [selectedRun, steps]);

  const loadCatalogUnits = async () => {
    const response = await adminAuthedFetch('/api/quiz/catalog', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.units)) {
      throw new Error(data.error ?? 'Failed to load unit catalog.');
    }
    const units = data.units as CatalogUnit[];
    setCatalogUnits(units);
    if (!unitCode && units.length > 0) {
      setUnitCode(units[0].unit_code);
    }
  };

  const loadUnitLos = async (nextUnitCode: string) => {
    const response = await adminAuthedFetch(`/api/quiz/units/${nextUnitCode}/los`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.los)) {
      throw new Error(data.error ?? `Failed to load learning outcomes for unit ${nextUnitCode}.`);
    }
    setUnitLos(data.los as UnitLo[]);
    setSelectedLoCodes([]);
  };

  const loadRuns = async () => {
    const response = await adminAuthedFetch('/api/admin/questions/runs', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.message ?? 'Failed to load runs.');
    }
    const list = (Array.isArray(data.runs) ? data.runs : []) as RunRow[];
    setRuns(list);
    if (!selectedRunId && list.length > 0) {
      setSelectedRunId(list[0].id);
    }
  };

  const loadScopedQuestions = async () => {
    if (!unitCode) return;
    const params = new URLSearchParams({
      unit_code: unitCode,
      level: String(level),
      limit: '500',
      include_retired: includeRetiredInScope ? 'true' : 'false',
    });
    if (selectedLoCodes.length > 0) {
      params.set('lo_codes', selectedLoCodes.join(','));
    }
    const response = await adminAuthedFetch(`/api/admin/questions/items?${params.toString()}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || data.success === false || !Array.isArray(data.questions)) {
      throw new Error(data.message ?? 'Failed to load existing questions.');
    }
    setScopedQuestions(data.questions as QuestionBankRow[]);
  };

  const loadRunDetails = async (runId: string) => {
    const [runResponse, draftResponse] = await Promise.all([
      adminAuthedFetch(`/api/admin/questions/runs/${runId}`, { cache: 'no-store' }),
      adminAuthedFetch(`/api/admin/questions/runs/${runId}/drafts`, { cache: 'no-store' }),
    ]);
    const runData = await runResponse.json();
    const draftData = await draftResponse.json();
    if (!runResponse.ok || runData.success === false) {
      throw new Error(runData.message ?? 'Failed to load run details.');
    }
    if (!draftResponse.ok || draftData.success === false) {
      throw new Error(draftData.message ?? 'Failed to load run drafts.');
    }
    setSteps((Array.isArray(runData.steps) ? runData.steps : []) as StepRow[]);
    setDrafts((Array.isArray(draftData.drafts) ? draftData.drafts : []) as DraftRow[]);
    setSelectedQuestionIds([]);
  };

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        await loadCatalogUnits();
        await loadRuns();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load runs.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!unitCode) {
      setUnitLos([]);
      setSelectedLoCodes([]);
      return;
    }
    void (async () => {
      try {
        setLoading(true);
        await loadUnitLos(unitCode);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load learning outcomes.');
      } finally {
        setLoading(false);
      }
    })();
  }, [unitCode]);

  useEffect(() => {
    if (!unitCode) return;
    void (async () => {
      try {
        setLoadingScopedQuestions(true);
        await loadScopedQuestions();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load existing questions.');
      } finally {
        setLoadingScopedQuestions(false);
      }
    })();
  }, [unitCode, level, includeRetiredInScope, selectedLoCodes.join(',')]);

  useEffect(() => {
    if (!selectedRunId) return;
    void (async () => {
      try {
        setLoading(true);
        await loadRunDetails(selectedRunId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load run details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedRunId]);

  useEffect(() => {
    if (!startingRun) return;
    const timer = window.setInterval(() => {
      setStartElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startingRun]);

  useEffect(() => {
    if (!runningBatchTrial) return;
    setBatchTrialProgress(8);
    const timer = window.setInterval(() => {
      setBatchTrialProgress((value) => {
        if (value >= 92) return value;
        const bump = value < 40 ? 6 : value < 70 ? 3 : 1;
        return Math.min(92, value + bump);
      });
    }, 450);
    return () => window.clearInterval(timer);
  }, [runningBatchTrial]);

  const toggleLo = (loCode: string) => {
    setSelectedLoCodes((prev) => (prev.includes(loCode) ? prev.filter((value) => value !== loCode) : [...prev, loCode]));
  };

  const createRun = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const formatMix = JSON.parse(formatMixJson) as Record<string, number>;
      const difficultyMix = JSON.parse(difficultyMixJson) as Record<string, number>;

      const response = await adminAuthedFetch('/api/admin/questions/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit_code: unitCode,
          level,
          lo_codes: selectedLoCodes.length > 0 ? selectedLoCodes : null,
          target_count: targetCount,
          format_mix: formatMix,
          difficulty_mix: difficultyMix,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to create run.');
      }
      setSelectedRunId(String(data.run_id));
      setInfo(`Created run ${String(data.run_id).slice(0, 8)}.`);
      await loadRuns();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create run.');
    } finally {
      setLoading(false);
    }
  };

  const startRun = async () => {
    if (!selectedRunId) return;
    setLoading(true);
    setStartingRun(true);
    setStartElapsedSeconds(0);
    setError(null);
    setInfo(null);
    const runId = selectedRunId;
    const poller = window.setInterval(() => {
      void (async () => {
        try {
          await loadRuns();
          await loadRunDetails(runId);
        } catch {
          // Keep polling best-effort while run is running.
        }
      })();
    }, 2500);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/runs/${runId}/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to start run.');
      }
      setSteps((Array.isArray(data.steps) ? data.steps : []) as StepRow[]);
      setInfo(`Run ${runId.slice(0, 8)} finished with status ${data.run?.status ?? 'unknown'}.`);
      await loadRuns();
      await loadRunDetails(runId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start run.');
    } finally {
      window.clearInterval(poller);
      setStartingRun(false);
      setLoading(false);
    }
  };

  const cancelRun = async () => {
    if (!selectedRunId || !canCancelSelectedRun) return;
    setCancellingRun(true);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/runs/${selectedRunId}/cancel`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to cancel run.');
      }
      setInfo(`Run ${selectedRunId.slice(0, 8)} cancelled.`);
      await loadRuns();
      await loadRunDetails(selectedRunId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel run.');
    } finally {
      setCancellingRun(false);
    }
  };

  const reviewAction = async (questionId: string, action: 'approve' | 'reject') => {
    setReviewingQuestionId(questionId);
    setError(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/${questionId}/${action}`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? `Failed to ${action} question.`);
      }
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${action} question.`);
    } finally {
      setReviewingQuestionId(null);
    }
  };

  const toggleQuestionSelected = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const selectAllRunQuestions = () => {
    setSelectedQuestionIds(selectableRunQuestions.map((row) => row.id));
  };

  const clearSelectedRunQuestions = () => {
    setSelectedQuestionIds([]);
  };

  const retireQuestion = async (questionId: string) => {
    setRetiringQuestionId(questionId);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/${questionId}/retire`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? `Failed to retire question ${questionId}.`);
      }
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
      await loadScopedQuestions();
      setInfo(`Retired question ${questionId.slice(0, 8)}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to retire question.');
    } finally {
      setRetiringQuestionId(null);
    }
  };

  const bulkRetireSelectedQuestions = async () => {
    const selected = selectedDeletableRunQuestions;
    if (selected.length === 0) return;

    setBulkRetiringQuestions(true);
    setError(null);
    setInfo(null);
    try {
      for (const question of selected) {
        const response = await adminAuthedFetch(`/api/admin/questions/${question.id}/retire`, { method: 'POST' });
        const data = await response.json();
        if (!response.ok || data.success === false) {
          throw new Error(data.message ?? `Failed to retire question ${question.id}.`);
        }
      }
      setSelectedQuestionIds([]);
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
      setInfo(`Retired ${selected.length} selected question${selected.length === 1 ? '' : 's'}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to bulk retire selected questions.');
    } finally {
      setBulkRetiringQuestions(false);
    }
  };

  const hardDeleteQuestion = async (questionId: string) => {
    const confirmed = window.confirm(`Permanently delete question ${questionId.slice(0, 8)}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingQuestionId(questionId);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/${questionId}/delete`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? `Failed to delete question ${questionId}.`);
      }
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
      await loadScopedQuestions();
      setInfo(`Hard deleted question ${questionId.slice(0, 8)}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to hard delete question.');
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const bulkHardDeleteSelectedQuestions = async () => {
    const selected = selectedRunQuestions;
    if (selected.length === 0) return;

    const confirmed = window.confirm(
      `Permanently delete ${selected.length} selected question${selected.length === 1 ? '' : 's'}? This cannot be undone.`
    );
    if (!confirmed) return;

    setBulkDeletingQuestions(true);
    setError(null);
    setInfo(null);
    try {
      const failedIds: string[] = [];
      for (const question of selected) {
        try {
          const response = await adminAuthedFetch(`/api/admin/questions/${question.id}/delete`, { method: 'POST' });
          const data = await response.json();
          if (!response.ok || data.success === false) {
            failedIds.push(question.id);
          }
        } catch {
          failedIds.push(question.id);
        }
      }
      setSelectedQuestionIds([]);
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
      const deletedCount = selected.length - failedIds.length;
      if (deletedCount > 0) {
        setInfo(`Hard deleted ${deletedCount} selected question${deletedCount === 1 ? '' : 's'}.`);
      }
      if (failedIds.length > 0) {
        setError(
          `Could not hard delete ${failedIds.length} question${failedIds.length === 1 ? '' : 's'} (${failedIds
            .slice(0, 5)
            .map((id) => id.slice(0, 8))
            .join(', ')}${failedIds.length > 5 ? ', ...' : ''}).`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to bulk hard delete selected questions.');
    } finally {
      setBulkDeletingQuestions(false);
    }
  };

  const approveAllDrafts = async () => {
    if (!selectedRunId) return;
    const pending = pendingDrafts;
    if (pending.length === 0) return;

    setBulkApproving(true);
    setError(null);
    setInfo(null);
    let approvedCount = 0;
    const failedIds: string[] = [];
    try {
      for (const draft of pending) {
        const response = await adminAuthedFetch(`/api/admin/questions/${draft.id}/approve`, { method: 'POST' });
        const data = await response.json();
        if (!response.ok || data.success === false) {
          failedIds.push(draft.id);
          continue;
        }
        approvedCount += 1;
      }

      if (approvedCount > 0) {
        setInfo(`Approved ${approvedCount} draft question${approvedCount === 1 ? '' : 's'}.`);
      }
      if (failedIds.length > 0) {
        setError(
          `Could not approve ${failedIds.length} question${failedIds.length === 1 ? '' : 's'} (likely duplicate guard).`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve all drafts.');
    } finally {
      if (selectedRunId) {
        try {
          await loadRunDetails(selectedRunId);
        } catch {
          // Keep UI responsive even if refresh fails.
        }
      }
      setBulkApproving(false);
    }
  };

  const restoreQuestion = async (questionId: string) => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/${questionId}/restore`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? `Failed to restore question ${questionId}.`);
      }
      if (selectedRunId) {
        await loadRunDetails(selectedRunId);
      }
      await loadScopedQuestions();
      setInfo(`Restored question ${questionId.slice(0, 8)} to draft.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to restore question.');
    } finally {
      setLoading(false);
    }
  };

  const runExistingQualityCheck = async () => {
    if (!unitCode) return;
    setRunningExistingQualityCheck(true);
    setError(null);
    try {
      const response = await adminAuthedFetch('/api/admin/questions/quality-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit_code: unitCode,
          level,
          lo_codes: selectedLoCodes.length > 0 ? selectedLoCodes : null,
          include_retired: includeRetiredInScope,
          limit: 500,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false || !data.summary) {
        throw new Error(data.message ?? 'Failed to run existing question quality check.');
      }
      setExistingQualityReport({
        summary: data.summary as ExistingQualityReport['summary'],
        issues: Array.isArray(data.issues) ? (data.issues as ExistingQualityReport['issues']) : [],
      });
      setInfo(`Quality check completed: ${Number(data.summary.issue_count ?? 0)} issue(s) found.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run existing question quality check.');
    } finally {
      setRunningExistingQualityCheck(false);
    }
  };

  const loadDuplicateReport = async () => {
    if (!unitCode) return;
    setLoadingDuplicates(true);
    setError(null);
    setInfo(null);
    try {
      const params = new URLSearchParams();
      params.set('unit_code', unitCode);
      params.set('level', String(level));
      if (selectedLoCodes.length > 0) {
        params.set('lo_codes', selectedLoCodes.join(','));
      }
      const response = await adminAuthedFetch(`/api/admin/questions/duplicates?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to load duplicate report.');
      }
      setDuplicateClusters((Array.isArray(data.clusters) ? data.clusters : []) as DuplicateCluster[]);
      setSelectedClusterKeys([]);
      setDuplicateAnalyzedItems(Number(data.analyzed_items ?? 0));
      setDuplicateTotalInScope(Number(data.total_approved_in_scope ?? 0));
      if (Number(data.duplicate_cluster_count ?? 0) === 0) {
        setInfo('No near-duplicate clusters found in the selected scope.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load duplicate report.');
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const runBatchTrial = async () => {
    const loForTrial = selectedLoCodes[0] ?? unitLos[0]?.lo_code;
    if (!unitCode || !loForTrial) {
      setError('Select a unit with at least one LO before running batch trial.');
      return;
    }
    setRunningBatchTrial(true);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/questions/trials/batch-quality', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit_code: unitCode,
          lo_code: loForTrial,
          level,
          count: 50,
          context_injections: trialContextInjectionsText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Batch trial failed.');
      }
      setBatchTrialResult(data as BatchTrialResult);
      setInfo(`Batch trial complete for ${unitCode} ${loForTrial}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run batch trial.');
    } finally {
      setBatchTrialProgress(100);
      window.setTimeout(() => setBatchTrialProgress(0), 900);
      setRunningBatchTrial(false);
    }
  };

  const downloadValidateStepReport = (step: StepRow) => {
    const blob = new Blob([JSON.stringify(step.output ?? {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `run-validate-report-${selectedRunId || 'unknown'}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadBatchTrialReport = () => {
    if (!batchTrialResult) return;
    const blob = new Blob([JSON.stringify(batchTrialResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `batch-trial-report-${batchTrialResult.trial.unit_code}-${batchTrialResult.trial.lo_code}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resolveDuplicateCluster = async (cluster: DuplicateCluster, retireAll = false) => {
    setResolvingClusterKey(cluster.key);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/questions/duplicates/resolve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          cluster_ids: cluster.ids,
          keep_id: retireAll ? null : cluster.keep_id,
          retire_all: retireAll,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to resolve duplicate cluster.');
      }
      const retiredCount = Number(data.retired_count ?? 0);
      if (retiredCount <= 0) {
        throw new Error('Resolve completed but retired 0 rows. Reload duplicate report and retry.');
      }
      // Remove immediately from current UI to avoid stale perception, then verify with refresh.
      setDuplicateClusters((prev) => prev.filter((item) => item.key !== cluster.key));
      setSelectedClusterKeys((prev) => prev.filter((key) => key !== cluster.key));
      await loadDuplicateReport();
      if (retireAll) {
        setInfo(`Resolved cluster: retired all ${retiredCount} question(s) in cluster.`);
      } else {
        setInfo(`Resolved cluster: kept ${data.keep_id}, retired ${retiredCount} duplicate(s).`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resolve duplicate cluster.');
    } finally {
      setResolvingClusterKey(null);
    }
  };

  const toggleClusterSelected = (clusterKey: string) => {
    setSelectedClusterKeys((prev) =>
      prev.includes(clusterKey) ? prev.filter((key) => key !== clusterKey) : [...prev, clusterKey]
    );
  };

  const selectAllVisibleClusters = () => {
    const keys = duplicateClusters.slice(0, 10).map((cluster) => cluster.key);
    setSelectedClusterKeys(keys);
  };

  const clearSelectedClusters = () => {
    setSelectedClusterKeys([]);
  };

  const bulkResolveSelectedClusters = async (retireAll: boolean) => {
    const selected = duplicateClusters.filter((cluster) => selectedClusterKeys.includes(cluster.key));
    if (selected.length === 0) return;

    setBulkResolvingClusters(true);
    setError(null);
    setInfo(null);
    try {
      let retiredTotal = 0;
      let keptTotal = 0;
      for (const cluster of selected) {
        const response = await adminAuthedFetch('/api/admin/questions/duplicates/resolve', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            cluster_ids: cluster.ids,
            keep_id: retireAll ? null : cluster.keep_id,
            retire_all: retireAll,
          }),
        });
        const data = await response.json();
        if (!response.ok || data.success === false) {
          throw new Error(data.message ?? `Failed to resolve cluster ${cluster.key}.`);
        }
        retiredTotal += Number(data.retired_count ?? 0);
        if (!retireAll && data.keep_id) keptTotal += 1;
      }

      setDuplicateClusters((prev) => prev.filter((cluster) => !selectedClusterKeys.includes(cluster.key)));
      setSelectedClusterKeys([]);
      await loadDuplicateReport();
      if (retireAll) {
        setInfo(`Retired ${retiredTotal} question(s) across ${selected.length} selected cluster(s).`);
      } else {
        setInfo(`Resolved ${selected.length} selected cluster(s): kept ${keptTotal}, retired ${retiredTotal} duplicates.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to bulk retire selected clusters.');
    } finally {
      setBulkResolvingClusters(false);
    }
  };

  return (
    <main className="admin-page min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-2xl font-semibold">Admin: Question Bank</h1>

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
          <label className="text-sm font-medium">
            Unit
            <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={unitCode} onChange={(e) => setUnitCode(e.target.value)}>
              {catalogUnits.map((unit) => (
                <option key={unit.unit_code} value={unit.unit_code}>
                  Unit {unit.unit_code} - {unit.unit_title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Level
            <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={level} onChange={(e) => setLevel(Number(e.target.value) as 2 | 3)}>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Target Count
            <input type="number" className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={targetCount} onChange={(e) => setTargetCount(Number.parseInt(e.target.value || '100', 10))} />
          </label>
          <label className="text-sm font-medium md:col-span-3">
            LO Codes (optional, from syllabus)
            <div className="mt-2 space-y-2 rounded border border-slate-300 p-3">
              {unitLos.length > 0 ? (
                <>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLoCodes(unitLos.map((lo) => lo.lo_code))}
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      Select all
                    </button>
                    <button type="button" onClick={() => setSelectedLoCodes([])} className="rounded border border-slate-300 px-2 py-1 text-xs">
                      Clear
                    </button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {unitLos.map((lo) => (
                      <label key={lo.lo_code} className="rounded border border-slate-200 p-2 text-sm">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedLoCodes.includes(lo.lo_code)}
                          onChange={() => toggleLo(lo.lo_code)}
                        />
                        <span className="font-semibold">{lo.lo_code}</span> ({lo.approved_question_count} approved)
                        <p className="mt-1 text-xs text-slate-600">{lo.lo_text_preview}</p>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    Leave all unchecked to generate across all LOs in this unit.
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-600">No LOs found for this unit.</p>
              )}
            </div>
          </label>
          <label className="text-sm font-medium md:col-span-3">
            Format Mix JSON
            <textarea className="mt-1 h-16 w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs" value={formatMixJson} onChange={(e) => setFormatMixJson(e.target.value)} />
          </label>
          <label className="text-sm font-medium md:col-span-3">
            Difficulty Mix JSON
            <textarea className="mt-1 h-16 w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs" value={difficultyMixJson} onChange={(e) => setDifficultyMixJson(e.target.value)} />
          </label>
          <div className="md:col-span-3 flex gap-2">
            <button
              onClick={() => void createRun()}
              disabled={loading || !unitCode}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              Create Run
            </button>
            <button onClick={() => void startRun()} disabled={loading || !selectedRunId} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">
              {startingRun ? 'Run In Progress...' : 'Start Selected Run'}
            </button>
            <button
              onClick={() => void cancelRun()}
              disabled={cancellingRun || !canCancelSelectedRun}
              className="rounded border border-rose-300 px-3 py-2 text-sm text-rose-700 disabled:opacity-60"
            >
              {cancellingRun ? 'Cancelling...' : 'Cancel Selected Run'}
            </button>
            <button
              onClick={() => void loadDuplicateReport()}
              disabled={loadingDuplicates || !unitCode}
              className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
            >
              {loadingDuplicates ? 'Loading Duplicates...' : 'Load Duplicate Report'}
            </button>
            <button
              onClick={() => void runBatchTrial()}
              disabled={runningBatchTrial || !unitCode || unitLos.length === 0}
              className="rounded border border-indigo-300 px-3 py-2 text-sm text-indigo-700 disabled:opacity-60"
            >
              {runningBatchTrial ? 'Running Batch-50 Trial...' : 'Run Batch-50 Trial'}
            </button>
          </div>
          <label className="text-sm font-medium md:col-span-3">
            Trial Context Injections (optional)
            <textarea
              className="mt-1 h-20 w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs"
              value={trialContextInjectionsText}
              onChange={(e) => setTrialContextInjectionsText(e.target.value)}
              placeholder="One line per LO-specific instruction or source snippet."
            />
          </label>
          {(runningBatchTrial || batchTrialProgress > 0) && (
            <div className="md:col-span-3">
              <div className="mb-1 flex items-center justify-between text-xs text-indigo-900">
                <span>{runningBatchTrial ? 'Running batch trial...' : 'Batch trial complete'}</span>
                <span>{batchTrialProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-indigo-100">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${batchTrialProgress}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {error && <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>}
        {info && <section className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</section>}
        {startingRun && (
          <section className="rounded border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900">
            Run in progress. Auto-refreshing timeline every ~2.5s. Elapsed:{' '}
            {Math.floor(startElapsedSeconds / 60).toString().padStart(2, '0')}:
            {(startElapsedSeconds % 60).toString().padStart(2, '0')}
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{runProgress.label}</span>
                <span>{runProgress.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-blue-100">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${runProgress.percent}%` }} />
              </div>
              <p className="mt-1 text-xs text-blue-800">Safety guard: run auto-aborts if it exceeds ~4 minutes.</p>
            </div>
          </section>
        )}
        {!loading && catalogUnits.length === 0 && (
          <section className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            No units found in the latest syllabus version. Upload or populate syllabus in `/admin/module` first.
          </section>
        )}
        {batchTrialResult && (
          <section className="rounded-lg border border-indigo-300 bg-indigo-50 p-4 text-sm text-indigo-950">
            <p className="font-semibold">
              Batch Trial Report ({batchTrialResult.trial.unit_code} {batchTrialResult.trial.lo_code} L{batchTrialResult.trial.level})
            </p>
            <p className="mt-1 text-xs">
              Model: {batchTrialResult.trial.model} | Requested: {batchTrialResult.trial.requested_count} | Parsed: {batchTrialResult.output.parsed_count} |
              Accepted: {batchTrialResult.output.accepted_count ?? batchTrialResult.questions.length} |
              Valid: {batchTrialResult.output.valid_count} | Invalid: {batchTrialResult.output.invalid_count} | Exact dup stems:{' '}
              {batchTrialResult.output.exact_dup_stem_count} | Alignment pass: {batchTrialResult.output.alignment_pass_count} | Alignment fail:{' '}
              {batchTrialResult.output.alignment_fail_count} | Near-dup pairs: {batchTrialResult.output.near_dup_pairs} | Answer-correlated pairs:{' '}
              {batchTrialResult.output.answer_correlated_pairs}
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={downloadBatchTrialReport}
                className="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-800"
              >
                Download Full Trial Report (JSON)
              </button>
            </div>
            {Array.isArray(batchTrialResult.output.attempt_summary) && batchTrialResult.output.attempt_summary.length > 0 && (
              <p className="mt-1 text-xs text-indigo-900">{batchTrialResult.output.attempt_summary.join(' | ')}</p>
            )}
            {batchTrialResult.alignment_examples.length > 0 && (
              <div className="mt-2 space-y-2 rounded border border-rose-200 bg-rose-50 p-2">
                <p className="text-xs font-semibold text-rose-900">Alignment gate failures (sample)</p>
                {batchTrialResult.alignment_examples.slice(0, 6).map((example) => (
                  <div key={`a-${example.i}`} className="rounded border border-rose-200 bg-white p-2 text-xs text-rose-900">
                    <p>
                      Q{example.i} | score {example.score.toFixed(2)} / {example.threshold.toFixed(2)}
                    </p>
                    <p className="mt-1">{example.stem}</p>
                    <p className="mt-1">Reasons: {example.reasons.join(' ')}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 space-y-2">
              {batchTrialResult.examples.slice(0, 8).map((example, index) => (
                <div key={`${example.i}-${example.j}-${index}`} className="rounded border border-indigo-200 bg-white p-2 text-xs">
                  <p>
                    Pair Q{example.i}/Q{example.j} | stem {example.stemScore.toFixed(2)} | answer {example.answerScore.toFixed(2)}
                  </p>
                  <p className="mt-1">{example.stemA}</p>
                  <p className="mt-1">{example.stemB}</p>
                </div>
              ))}
            </div>
            <details className="mt-3 rounded border border-indigo-200 bg-white p-2">
              <summary className="cursor-pointer text-xs font-semibold text-indigo-900">
                Show Accepted Questions ({batchTrialResult.questions.length})
              </summary>
              <div className="mt-2 max-h-96 space-y-2 overflow-auto">
                {batchTrialResult.questions.map((q, idx) => (
                  <div key={`${idx}-${q.stem.slice(0, 20)}`} className="rounded border border-indigo-100 p-2 text-xs">
                    <p className="font-semibold">
                      Q{idx + 1} | {q.lo_code}/{q.ac_code || '-'} | {q.difficulty}
                    </p>
                    <p className="mt-1">{q.stem}</p>
                    <ul className="mt-1 list-disc pl-4">
                      {q.options.map((option, oi) => (
                        <li key={`${idx}-${oi}`}>{option}</li>
                      ))}
                    </ul>
                    <p className="mt-1 font-medium">Answer: {q.correct}</p>
                  </div>
                ))}
              </div>
            </details>
            <details className="mt-2 rounded border border-indigo-200 bg-white p-2">
              <summary className="cursor-pointer text-xs font-semibold text-indigo-900">
                Show Attempted Questions ({batchTrialResult.attempted_questions?.length ?? batchTrialResult.output.parsed_count})
              </summary>
              <div className="mt-2 max-h-96 space-y-2 overflow-auto">
                {(batchTrialResult.attempted_questions ?? []).map((q, idx) => (
                  <div key={`a-${idx}-${q.stem.slice(0, 20)}`} className="rounded border border-indigo-100 p-2 text-xs">
                    <p className="font-semibold">
                      Attempt {idx + 1} | {q.lo_code}/{q.ac_code || '-'} | {q.difficulty}
                    </p>
                    <p className="mt-1">{q.stem}</p>
                    <p className="mt-1 font-medium">Answer: {q.correct}</p>
                  </div>
                ))}
              </div>
            </details>
          </section>
        )}
        {duplicateClusters.length > 0 && (
          <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Duplicate clusters: {duplicateClusters.length} (analyzed {duplicateAnalyzedItems} of {duplicateTotalInScope} approved in scope)
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectAllVisibleClusters}
                className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900"
              >
                Select All Visible
              </button>
              <button
                type="button"
                onClick={clearSelectedClusters}
                className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900"
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={() => void bulkResolveSelectedClusters(false)}
                disabled={bulkResolvingClusters || selectedClusterKeys.length === 0}
                className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 disabled:opacity-60"
              >
                {bulkResolvingClusters ? 'Bulk Resolving...' : 'Retire Duplicates (Keep One)'}
              </button>
              <button
                type="button"
                onClick={() => void bulkResolveSelectedClusters(true)}
                disabled={bulkResolvingClusters || selectedClusterKeys.length === 0}
                className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
              >
                {bulkResolvingClusters ? 'Bulk Retiring...' : 'Retire Entire Selected Clusters'}
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {duplicateClusters.slice(0, 10).map((cluster) => (
                <div key={cluster.key} className="rounded border border-amber-200 bg-white p-2 text-xs text-amber-900">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedClusterKeys.includes(cluster.key)}
                      onChange={() => toggleClusterSelected(cluster.key)}
                    />
                    <span>Select cluster</span>
                  </label>
                  <p>
                    Cluster size {cluster.size} | score {cluster.strongest_pair_score.toFixed(2)} | LO {cluster.lo_codes.join(', ') || '-'} | AC{' '}
                    {cluster.ac_codes.join(', ') || '-'}
                  </p>
                  <p className="mt-1">Keep: {cluster.keep_id}</p>
                  <p className="mt-1">{cluster.sample_stem}</p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => void resolveDuplicateCluster(cluster, false)}
                      disabled={resolvingClusterKey === cluster.key}
                      className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 disabled:opacity-60"
                    >
                      {resolvingClusterKey === cluster.key ? 'Resolving...' : 'Retire Duplicates (Keep Selected)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void resolveDuplicateCluster(cluster, true)}
                      disabled={resolvingClusterKey === cluster.key}
                      className="ml-2 rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                    >
                      {resolvingClusterKey === cluster.key ? 'Resolving...' : 'Retire Entire Cluster'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-[340px_1fr]">
          <aside className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Runs</h2>
            <div className="max-h-[60vh] space-y-2 overflow-auto">
              {runs.map((run) => (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full rounded border px-3 py-2 text-left text-sm ${selectedRunId === run.id ? 'border-slate-900 bg-slate-100' : 'border-slate-200'}`}
                >
                  <p className="font-semibold">Unit {run.unit_code} L{run.level}</p>
                  <p>Target {run.target_count}</p>
                  <p>Status: {run.status}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-lg font-semibold">Step Timeline</h2>
              {!selectedRun && <p className="text-sm text-slate-600">Select a run to view timeline.</p>}
              {steps.map((step) => (
                <div key={step.step_key} className="mb-2 rounded border border-slate-200 p-3">
                  <p className="text-sm font-semibold">{step.step_key}</p>
                  <p className="text-xs text-slate-600">Status: {step.status}</p>
                  {step.step_key === 'validate' && step.output && (
                    <div className="mt-2 grid gap-2 text-xs md:grid-cols-3">
                      <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                        LLM used: {Number(step.output.llm_used_count ?? 0)}
                      </div>
                      <div className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">
                        Repair retries: {Number(step.output.repair_retry_count ?? 0)}
                      </div>
                      <div className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-indigo-900">
                        Fallbacks: {Number(step.output.fallback_count ?? 0)}
                      </div>
                      {'progress' in step.output && (
                        <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-900 md:col-span-3">
                          Validate progress: {Number((step.output.progress as Record<string, unknown>)?.processed_blueprints ?? 0)} /{' '}
                          {Number((step.output.progress as Record<string, unknown>)?.total_blueprints ?? 0)} blueprints
                        </div>
                      )}
                      {'debug' in step.output && (
                        <div className="rounded border border-violet-200 bg-violet-50 px-2 py-1 text-violet-900 md:col-span-3">
                          Batch groups: {Number((step.output.debug as Record<string, unknown>)?.batch_lo_groups ?? 0)} | Batch LLM calls:{' '}
                          {Number((step.output.debug as Record<string, unknown>)?.batch_llm_calls ?? 0)} | Batch handled:{' '}
                          {Number((step.output.debug as Record<string, unknown>)?.batch_prehandled_blueprints ?? 0)} | Single path:{' '}
                          {Number((step.output.debug as Record<string, unknown>)?.single_path_blueprints ?? 0)}
                        </div>
                      )}
                      {Array.isArray((step.output.debug as Record<string, unknown> | undefined)?.batch_reports) && (
                        <div className="rounded border border-indigo-200 bg-indigo-50 px-2 py-2 text-indigo-900 md:col-span-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold">Batch Validate Report</p>
                            <button
                              type="button"
                              onClick={() => downloadValidateStepReport(step)}
                              className="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-900"
                            >
                              Download Validate Report
                            </button>
                          </div>
                          {((step.output.debug as Record<string, unknown>).batch_reports as Array<Record<string, unknown>>).map((report, idx) => (
                            <div key={`br-${idx}`} className="mt-2 rounded border border-indigo-200 bg-white p-2 text-xs">
                              <p>
                                LO {String(report.lo_code ?? '-')} | Target {Number(report.target_count ?? 0)} | Parsed {Number(report.parsed_count ?? 0)} |
                                Accepted {Number(report.accepted_count ?? 0)} | Valid {Number(report.valid_count ?? 0)} | Invalid {Number(report.invalid_count ?? 0)} |
                                Align pass {Number(report.alignment_pass_count ?? 0)} | Align fail {Number(report.alignment_fail_count ?? 0)} |
                                Near-dup rejects {Number(report.near_dup_reject_count ?? 0)}
                              </p>
                              {Array.isArray(report.attempt_summary) && report.attempt_summary.length > 0 && (
                                <p className="mt-1 text-indigo-900">{(report.attempt_summary as string[]).join(' | ')}</p>
                              )}
                              <details className="mt-2 rounded border border-indigo-100 p-1">
                                <summary className="cursor-pointer font-semibold">Show Accepted Questions ({Array.isArray(report.accepted_questions) ? report.accepted_questions.length : 0})</summary>
                                <div className="mt-1 max-h-40 overflow-auto space-y-1">
                                  {(Array.isArray(report.accepted_questions) ? (report.accepted_questions as Array<Record<string, unknown>>) : []).map((q, qIdx) => (
                                    <p key={`ba-${idx}-${qIdx}`} className="rounded border border-indigo-100 px-2 py-1">
                                      Q{qIdx + 1}: {String(q.stem ?? '').slice(0, 200)}
                                    </p>
                                  ))}
                                </div>
                              </details>
                              <details className="mt-2 rounded border border-indigo-100 p-1">
                                <summary className="cursor-pointer font-semibold">Show Attempted Questions ({Array.isArray(report.attempted_questions) ? report.attempted_questions.length : 0})</summary>
                                <div className="mt-1 max-h-40 overflow-auto space-y-1">
                                  {(Array.isArray(report.attempted_questions) ? (report.attempted_questions as Array<Record<string, unknown>>) : []).map((q, qIdx) => (
                                    <p key={`bt-${idx}-${qIdx}`} className="rounded border border-indigo-100 px-2 py-1">
                                      Q{qIdx + 1}: {String(q.stem ?? '').slice(0, 200)}
                                    </p>
                                  ))}
                                </div>
                              </details>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {step.error && <p className="mt-1 text-xs text-rose-700">{step.error}</p>}
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">
                    {JSON.stringify(step.output ?? {}, null, 2)}
                  </pre>
                </div>
              ))}
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Question Bank (All Existing Questions)</h2>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={includeRetiredInScope}
                      onChange={(e) => setIncludeRetiredInScope(e.target.checked)}
                    />
                    Include retired
                  </label>
                  <button
                    type="button"
                    onClick={() => void loadScopedQuestions()}
                    disabled={loadingScopedQuestions || !unitCode}
                    className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
                  >
                    {loadingScopedQuestions ? 'Loading...' : 'Refresh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runExistingQualityCheck()}
                    disabled={runningExistingQualityCheck || !unitCode}
                    className="rounded border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs text-indigo-800 disabled:opacity-60"
                  >
                    {runningExistingQualityCheck ? 'Checking...' : 'Run Quality Check'}
                  </button>
                </div>
              </div>
              <p className="mb-2 text-xs text-slate-600">
                Scope: unit {unitCode || '-'} / level {level} / LOs {selectedLoCodes.length > 0 ? selectedLoCodes.join(', ') : 'all'}.
              </p>
              {existingQualityReport && (
                <div className="mb-3 rounded border border-indigo-200 bg-indigo-50 p-2 text-xs text-indigo-900">
                  <p>
                    Checked {existingQualityReport.summary.checked_count} | Valid {existingQualityReport.summary.valid_count} | Issues{' '}
                    {existingQualityReport.summary.issue_count} | Schema {existingQualityReport.summary.schema_fail_count} | Alignment{' '}
                    {existingQualityReport.summary.alignment_fail_count} | Near-dup {existingQualityReport.summary.near_duplicate_count}
                  </p>
                  {existingQualityReport.issues.length > 0 && (
                    <details className="mt-2 rounded border border-indigo-100 bg-white p-2">
                      <summary className="cursor-pointer font-semibold">Show Issues ({existingQualityReport.issues.length})</summary>
                      <div className="mt-2 max-h-48 space-y-1 overflow-auto">
                        {existingQualityReport.issues.slice(0, 120).map((issue) => (
                          <p key={issue.question_id} className="rounded border border-indigo-100 px-2 py-1">
                            {issue.question_id.slice(0, 8)} ({issue.status}): {issue.reasons.join(' | ')}
                          </p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
              <div className="max-h-72 space-y-2 overflow-auto">
                {scopedQuestions.map((row) => (
                  <div key={`scoped-${row.id}`} className="rounded border border-slate-200 p-2 text-sm">
                    <p className="font-medium">{row.stem}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {row.unit_code} / {row.lo_code ?? '-'} / {row.ac_code ?? '-'} / {row.format} / {row.difficulty} / {row.status}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void retireQuestion(row.id)}
                        disabled={row.status === 'draft' || bulkRetiringQuestions || bulkDeletingQuestions || retiringQuestionId === row.id}
                        className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                      >
                        {retiringQuestionId === row.id ? 'Retiring...' : 'Retire'}
                      </button>
                      {row.status === 'retired' && (
                        <button
                          type="button"
                          onClick={() => void restoreQuestion(row.id)}
                          disabled={loading}
                          className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700 disabled:opacity-60"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void hardDeleteQuestion(row.id)}
                        disabled={bulkRetiringQuestions || bulkDeletingQuestions || deletingQuestionId === row.id}
                        className="rounded border border-rose-700 bg-rose-700 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-800 disabled:border-rose-200 disabled:bg-rose-100 disabled:text-rose-400"
                      >
                        {deletingQuestionId === row.id ? 'Deleting...' : 'Hard Delete'}
                      </button>
                    </div>
                  </div>
                ))}
                {scopedQuestions.length === 0 && <p className="text-sm text-slate-600">No questions found in this scope.</p>}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Run Question Manager</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void approveAllDrafts()}
                    disabled={bulkApproving || pendingDrafts.length === 0}
                    className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-700 disabled:opacity-60"
                    title={pendingDrafts.length > 0 ? `Approve all ${pendingDrafts.length} draft questions` : 'No draft questions to approve'}
                  >
                    {bulkApproving ? 'Approving...' : `Approve All Drafts${pendingDrafts.length > 0 ? ` (${pendingDrafts.length})` : ''}`}
                  </button>
                  <button
                    type="button"
                    onClick={selectAllRunQuestions}
                    disabled={selectableRunQuestions.length === 0}
                    className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearSelectedRunQuestions}
                    disabled={selectedQuestionIds.length === 0}
                    className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => void bulkRetireSelectedQuestions()}
                    disabled={bulkRetiringQuestions || selectedDeletableRunQuestions.length === 0}
                    className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                  >
                    {bulkRetiringQuestions ? 'Deleting...' : 'Delete Selected (Retire)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void bulkHardDeleteSelectedQuestions()}
                    disabled={bulkDeletingQuestions || selectedRunQuestions.length === 0}
                    className="rounded border border-rose-700 bg-rose-700 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-800 disabled:border-rose-200 disabled:bg-rose-100 disabled:text-rose-400"
                  >
                    {bulkDeletingQuestions ? 'Hard Deleting...' : 'Hard Delete Selected'}
                  </button>
                </div>
              </div>
              <p className="mb-2 text-xs text-slate-600">
                Retire actions skip drafts. Hard delete permanently removes selected questions, including drafts.
              </p>
              <div className="max-h-72 space-y-2 overflow-auto">
                {selectableRunQuestions.map((row) => (
                  <div key={row.id} className="rounded border border-slate-200 p-2 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <label className="inline-flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.includes(row.id)}
                          onChange={() => toggleQuestionSelected(row.id)}
                        />
                        <span>
                          <span className="font-medium">{row.stem}</span>
                          <span className="mt-1 block text-xs text-slate-600">
                            {row.unit_code} / {row.lo_code ?? '-'} / {row.ac_code ?? '-'} / {row.format} / {row.difficulty} / {row.status}
                          </span>
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => void retireQuestion(row.id)}
                        disabled={row.status === 'draft' || retiringQuestionId === row.id || bulkRetiringQuestions || bulkDeletingQuestions}
                        className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                      >
                        {retiringQuestionId === row.id ? 'Deleting...' : 'Delete (Retire)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void hardDeleteQuestion(row.id)}
                        disabled={deletingQuestionId === row.id || bulkRetiringQuestions || bulkDeletingQuestions}
                        className="rounded border border-rose-700 bg-rose-700 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-800 disabled:border-rose-200 disabled:bg-rose-100 disabled:text-rose-400"
                      >
                        {deletingQuestionId === row.id ? 'Hard Deleting...' : 'Hard Delete'}
                      </button>
                    </div>
                  </div>
                ))}
                {selectableRunQuestions.length === 0 && <p className="text-sm text-slate-600">No active questions for selected run.</p>}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-lg font-semibold">Retired Questions (This Run)</h2>
              <div className="max-h-56 space-y-2 overflow-auto">
                {retiredRunQuestions.map((row) => (
                  <div key={row.id} className="rounded border border-slate-200 p-2 text-sm">
                    <p className="font-medium">{row.stem}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {row.unit_code} / {row.lo_code ?? '-'} / {row.ac_code ?? '-'} / {row.format} / {row.difficulty} / {row.status}
                    </p>
                    <button
                      type="button"
                      onClick={() => void restoreQuestion(row.id)}
                      disabled={loading}
                      className="mt-2 rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700 disabled:opacity-60"
                    >
                      Restore to Draft
                    </button>
                  </div>
                ))}
                {retiredRunQuestions.length === 0 && <p className="text-sm text-slate-600">No retired questions for this run.</p>}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Draft Review Queue</h2>
                <button
                  type="button"
                  onClick={() => void approveAllDrafts()}
                  disabled={bulkApproving || pendingDrafts.length === 0}
                  className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700 disabled:opacity-60"
                >
                  {bulkApproving ? 'Approving All...' : 'Approve All Drafts'}
                </button>
              </div>
              <div className="space-y-2">
                {pendingDrafts.map((draft) => (
                  <div key={draft.id} className="rounded border border-slate-200 p-3 text-sm">
                    <p className="font-semibold">{draft.stem}</p>
                    <p className="text-xs text-slate-600">
                      {draft.unit_code} / {draft.lo_code ?? '-'} / {draft.ac_code ?? '-'} / {draft.format} / {draft.difficulty} / {draft.status}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => void reviewAction(draft.id, 'approve')}
                        disabled={bulkApproving || reviewingQuestionId === draft.id}
                        className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => void reviewAction(draft.id, 'reject')}
                        disabled={bulkApproving || reviewingQuestionId === draft.id}
                        className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingDrafts.length === 0 && <p className="text-sm text-slate-600">No drafts pending review for selected run.</p>}
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
