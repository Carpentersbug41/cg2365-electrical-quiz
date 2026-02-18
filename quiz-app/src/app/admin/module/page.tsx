'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type StageKey = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

interface SyllabusVersion {
  id: string;
  filename: string;
  content_hash: string;
  created_at: string;
  meta_json: Record<string, unknown> | null;
}

interface RunSummary {
  run: {
    id: string;
    unit: string;
    status: string;
    request_hash: string | null;
    syllabus_version_id: string;
  };
  artifacts: Array<{
    stage: StageKey;
    artifact_json: unknown;
    created_at: string;
    retrieved_chunk_ids?: string[];
    retrieved_chunk_text?: string;
  }>;
  lessons: Array<{
    blueprint_id: string;
    lesson_id: string;
    status: string;
    error: string | null;
    lesson_json?: unknown | null;
    created_at?: string;
  }>;
  replayable: Record<StageKey, boolean>;
}

interface RunListItem {
  id: string;
  unit: string;
  status: string;
  created_at: string;
  syllabus_version_id: string;
}

interface StageResult {
  success: boolean;
  stage: StageKey;
  replayed: boolean;
  artifact: unknown;
  message?: string;
}

interface CanonicalUnitStructure {
  unit: string;
  range?: string[];
  los: Array<{
    loNumber: string;
    title?: string;
    acs: Array<{
      acNumber: string;
      text?: string;
      acKey: string;
      range?: string[];
    }>;
    range?: string[];
  }>;
}

type PopulateState = 'IDLE' | 'RUNNING' | 'READY' | 'FAILED';
interface LessonGenerationProgress {
  blueprintId: string;
  progress: number;
  phaseMessage: string;
}

const STAGE_ROUTE: Record<StageKey, string> = {
  M0: 'm0-distill',
  M1: 'm1-analyze',
  M2: 'm2-coverage',
  M3: 'm3-plan',
  M4: 'm4-blueprints',
  M5: 'm5-validate',
  M6: 'm6-generate',
};

const STAGE_LABEL: Record<StageKey, string> = {
  M0: 'Distill',
  M1: 'Analyze',
  M2: 'Extract Coverage',
  M3: 'Plan',
  M4: 'Build Blueprints',
  M5: 'Validate',
  M6: 'Generate',
};
const LESSON_GENERATION_PHASES: Array<{ progress: number; message: string }> = [
  { progress: 10, message: 'Phase 1/5: Validating prerequisites' },
  { progress: 26, message: 'Phase 2/5: Preparing blueprint payload' },
  { progress: 52, message: 'Phase 3/5: Generating lesson content' },
  { progress: 78, message: 'Phase 4/5: Running quality passes' },
  { progress: 94, message: 'Phase 5/5: Persisting lesson artifacts' },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ModulePlannerPage() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [unit, setUnit] = useState('');
  const [unitLos, setUnitLos] = useState<string[]>([]);
  const [chatTranscript, setChatTranscript] = useState('');
  const [manualLosInput, setManualLosInput] = useState('');
  const [manualLoOverride, setManualLoOverride] = useState(false);
  const [notes, setNotes] = useState('');
  const [runId, setRunId] = useState('');
  const [recentRuns, setRecentRuns] = useState<RunListItem[]>([]);
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [stageResults, setStageResults] = useState<Partial<Record<StageKey, StageResult>>>({});
  const [replayFromArtifacts, setReplayFromArtifacts] = useState(false);
  const [defaultMaxLessons, setDefaultMaxLessons] = useState(9);
  const [maxAcsPerLesson, setMaxAcsPerLesson] = useState(4);
  const [preferredAcsPerLesson, setPreferredAcsPerLesson] = useState(2);
  const [level, setLevel] = useState('Level 2');
  const [audience, setAudience] = useState('beginner');
  const [orderingPreference, setOrderingPreference] = useState<'foundation-first' | 'lo-order'>('foundation-first');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [retryNotice, setRetryNotice] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [syllabusVersions, setSyllabusVersions] = useState<SyllabusVersion[]>([]);
  const [syllabusVersionId, setSyllabusVersionId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [populateState, setPopulateState] = useState<PopulateState>('IDLE');
  const [activeStage, setActiveStage] = useState<StageKey | null>(null);
  const [activeTaskLabel, setActiveTaskLabel] = useState<string | null>(null);
  const [generatingBlueprintId, setGeneratingBlueprintId] = useState<string | null>(null);
  const [lessonGenerationProgress, setLessonGenerationProgress] = useState<LessonGenerationProgress | null>(null);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);
  const [unitStructure, setUnitStructure] = useState<CanonicalUnitStructure | null>(null);
  const [viewLessonPayload, setViewLessonPayload] = useState<{
    title: string;
    payload: unknown;
  } | null>(null);

  const selectedLos = useMemo(
    () => {
      const source = manualLoOverride ? manualLosInput : unitLos.join(',');
      return source
        .split(',')
        .map((lo: string) => lo.trim())
        .filter((lo: string) => lo.length > 0);
    },
    [manualLoOverride, manualLosInput, unitLos]
  );

  const activeVersion = useMemo(
    () => syllabusVersions.find((version) => version.id === syllabusVersionId) ?? null,
    [syllabusVersions, syllabusVersionId]
  );

  const chunkDiagnostics = useMemo(() => {
    if (!runSummary) return [];
    const rows: Array<{ stage: StageKey; id: string; pageStart: string; pageEnd: string }> = [];
    runSummary.artifacts.forEach((artifact) => {
      if (!artifact.retrieved_chunk_text) return;
      try {
        const parsed = JSON.parse(artifact.retrieved_chunk_text) as Array<Record<string, unknown>>;
        parsed.forEach((item) => {
          rows.push({
            stage: artifact.stage,
            id: String(item.id ?? '?'),
            pageStart: String(item.pageStart ?? '?'),
            pageEnd: String(item.pageEnd ?? '?'),
          });
        });
      } catch {
        // ignore malformed payload
      }
    });
    return rows;
  }, [runSummary]);

  const buildHeaders = useCallback(
    (contentType?: string): HeadersInit => {
      const headers: Record<string, string> = {};
      if (contentType) headers['content-type'] = contentType;
      if (adminToken.trim().length > 0) headers['x-module-admin-token'] = adminToken.trim();
      return headers;
    },
    [adminToken]
  );

  const callApi = useCallback(
    async (url: string, body?: unknown, isFormData = false, method?: 'GET' | 'POST' | 'DELETE') => {
      const requestMethod = method ?? (body ? 'POST' : 'GET');
      const maxAttempts = requestMethod === 'GET' ? 3 : 1;
      let lastError: Error | null = null;
      setRetryNotice(null);

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        let response: Response;
        try {
          response = await fetch(url, {
            method: requestMethod,
            cache: 'no-store',
            headers: body ? (isFormData ? buildHeaders() : buildHeaders('application/json')) : buildHeaders(),
            body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown network failure';
          lastError = new Error(`Network error while calling API: ${message}`);
          if (attempt < maxAttempts) {
            setRetryNotice(`Retrying request (${attempt + 1}/${maxAttempts}): ${url}`);
            await sleep(250 * attempt);
            continue;
          }
          setRetryNotice(null);
          throw lastError;
        }

        const contentType = response.headers.get('content-type') ?? '';
        const payload = contentType.includes('application/json')
          ? await response.json()
          : { message: await response.text() };
        const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
        if (!response.ok || data.success === false) {
          const message =
            (typeof data.message === 'string' && data.message) ||
            (typeof data.error === 'string' && data.error) ||
            `Request failed (${response.status})`;

          const isTransient =
            requestMethod === 'GET' &&
            (response.status >= 500 || response.status === 429 || message.toLowerCase().includes('network'));
          if (isTransient && attempt < maxAttempts) {
            setRetryNotice(`Retrying request (${attempt + 1}/${maxAttempts}): ${url}`);
            await sleep(300 * attempt);
            continue;
          }
          setRetryNotice(null);
          throw new Error(message);
        }
        setRetryNotice(null);
        return data;
      }
      setRetryNotice(null);
      throw lastError ?? new Error('Request failed unexpectedly');
    },
    [buildHeaders]
  );

  const loadVersionScope = useCallback(async (versionId: string, preferredUnit?: string) => {
    if (!versionId) {
      setUnits([]);
      setUnit('');
      setUnitLos([]);
      return;
    }

    const params = new URLSearchParams();
    params.set('syllabusVersionId', versionId);
    if (preferredUnit) params.set('unit', preferredUnit);
    const data = await callApi(`/api/admin/module/runs?${params.toString()}`);

    const nextUnits = Array.isArray(data.units) ? data.units.map((value) => String(value)) : [];
    const resolvedUnit = String(data.resolvedUnit ?? preferredUnit ?? nextUnits[0] ?? '');
    const los = Array.isArray(data.unitLos) ? data.unitLos.map((value) => String(value)) : [];
    const structure = (data.unitStructure ?? null) as CanonicalUnitStructure | null;

    setUnits(nextUnits);
    setUnit(resolvedUnit);
    setUnitLos(los);
    setUnitStructure(structure);
  }, [callApi]);

  const loadBootstrap = useCallback(async () => {
    try {
      const data = await callApi('/api/admin/module/runs');
      setEnabled(true);
      const versions = Array.isArray(data.syllabusVersions)
        ? (data.syllabusVersions as SyllabusVersion[])
        : [];
      const runs = Array.isArray(data.recentRuns)
        ? (data.recentRuns as RunListItem[])
        : [];
      const sortedRuns = [...runs].sort((a, b) => b.created_at.localeCompare(a.created_at));
      const defaultVersionId = String(data.defaultSyllabusVersionId ?? '');
      const nextVersionId =
        syllabusVersionId && versions.some((version) => version.id === syllabusVersionId)
          ? syllabusVersionId
          : defaultVersionId;

      setSyllabusVersions(versions);
      setRecentRuns(sortedRuns);
      setSyllabusVersionId(nextVersionId);
      if (nextVersionId) {
        await loadVersionScope(nextVersionId, unit);
      } else {
        setUnits([]);
        setUnit('');
        setUnitLos([]);
      }
      const latestIngestion =
        data.latestIngestion && typeof data.latestIngestion === 'object'
          ? (data.latestIngestion as Record<string, unknown>)
          : null;
      if (!latestIngestion) {
        setPopulateState('IDLE');
      } else {
        const state = String(latestIngestion.state ?? 'IDLE').toUpperCase();
        if (state === 'READY' || state === 'FAILED' || state === 'RUNNING') {
          setPopulateState(state as PopulateState);
        } else {
          setPopulateState('IDLE');
        }
      }
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      if (msg.includes('MODULE_PLANNER_ENABLED') || msg.toLowerCase().includes('disabled')) {
        setEnabled(false);
      } else {
        setEnabled(null);
        setError(msg);
      }
    }
  }, [callApi, loadVersionScope, syllabusVersionId, unit]);

  const loadRunSummary = useCallback(
    async (id: string) => {
      const data = await callApi(`/api/admin/module/runs/${id}`);
      const summary = data as unknown as RunSummary;
      setRunSummary(summary);
      const nextResults: Partial<Record<StageKey, StageResult>> = {};
      summary.artifacts.forEach((artifact) => {
        nextResults[artifact.stage] = {
          success: true,
          stage: artifact.stage,
          replayed: false,
          artifact: artifact.artifact_json,
        };
      });
      setStageResults(nextResults);
    },
    [callApi]
  );

  const refreshRunSummarySafe = useCallback(
    async (id: string) => {
      try {
        await loadRunSummary(id);
      } catch (error) {
        console.error('[ModulePlanner] Failed to refresh run summary', error);
      }
    },
    [loadRunSummary]
  );

  useEffect(() => {
    void loadBootstrap();
  }, [loadBootstrap]);

  const handlePopulateSyllabus = async () => {
    setLoading(true);
    setActiveTaskLabel('Populating syllabus');
    setError(null);
    setInfo(null);
    setPopulateState('RUNNING');
    try {
      const data = await callApi('/api/admin/module/syllabus/populate', {});
      const nextVersionId = String(data.syllabusVersionId ?? '');
      setPopulateState('READY');
      await loadBootstrap();
      if (nextVersionId) {
        setSyllabusVersionId(nextVersionId);
        await loadVersionScope(nextVersionId);
      }
      setInfo(String(data.message ?? `Syllabus populate completed (${nextVersionId.slice(0, 8)}).`));
    } catch (e) {
      setPopulateState('FAILED');
      setError(e instanceof Error ? e.message : 'Failed to populate syllabus');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleSyllabusVersionChange = async (nextVersionId: string) => {
    setSyllabusVersionId(nextVersionId);
    setRunId('');
    setRunSummary(null);
    setStageResults({});
    if (!nextVersionId) {
      setUnits([]);
      setUnit('');
      setUnitLos([]);
      return;
    }
    try {
      await loadVersionScope(nextVersionId);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load version data');
    }
  };

  const handleUnitChange = async (nextUnit: string) => {
    setUnit(nextUnit);
    setRunId('');
    setRunSummary(null);
    setStageResults({});
    if (!syllabusVersionId) return;
    try {
      await loadVersionScope(syllabusVersionId, nextUnit);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load unit LOs');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('Pick a file before upload.');
      return;
    }

    setLoading(true);
    setActiveTaskLabel('Uploading syllabus');
    setError(null);
    setInfo(null);
    try {
      const form = new FormData();
      form.append('file', uploadFile);
      const data = await callApi('/api/syllabus/upload', form, true);
      await loadBootstrap();
      const nextVersionId = String(data.syllabusVersionId);
      setSyllabusVersionId(nextVersionId);
      await loadVersionScope(nextVersionId);
      setInfo(`Uploaded syllabus version ${nextVersionId}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload syllabus');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleCreateRun = async () => {
    if (!syllabusVersionId) {
      setError('Select a syllabus version first.');
      return;
    }
    if (!unit) {
      setError('Select a unit first.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Creating run');
    setError(null);
    setInfo(null);
    try {
      const data = await callApi('/api/admin/module/runs', {
        syllabusVersionId,
        unit,
        chatTranscript,
      });
      const nextRunId = String((data.run as { id: string }).id);
      setRunId(nextRunId);
      await loadRunSummary(nextRunId);
      setInfo(`Created module run ${nextRunId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create run');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleRefreshRunSummary = async () => {
    if (!runId) {
      setError('Create or select a run before refreshing summary.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Refreshing run summary');
    setError(null);
    setInfo(null);
    try {
      await loadRunSummary(runId);
      setInfo(`Refreshed run summary for ${runId}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to refresh run summary');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleLoadRun = async (id: string) => {
    setLoading(true);
    setActiveTaskLabel(`Loading run ${id}`);
    setError(null);
    setInfo(null);
    try {
      const runIdValue = id.trim();
      setRunId(runIdValue);
      await loadRunSummary(runIdValue);
      setInfo(`Loaded run ${runIdValue}.`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load run';
      if (message.includes('Run not found')) {
        setRunId('');
        setRunSummary(null);
        setStageResults({});
        await loadBootstrap();
        setError(`Run ${id} no longer exists. Refreshed recent runs.`);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleDeleteRun = async (id: string) => {
    const target = recentRuns.find((row) => row.id === id);
    const confirmation = window.confirm(
      `Delete run ${id}${target ? ` (Unit ${target.unit}, ${new Date(target.created_at).toLocaleString()})` : ''}? This cannot be undone.`
    );
    if (!confirmation) return;

    setDeletingRunId(id);
    setError(null);
    setInfo(null);
    try {
      await callApi(`/api/admin/module/runs/${id}`, undefined, false, 'DELETE');
      setRecentRuns((prev) => prev.filter((row) => row.id !== id));
      if (runId === id) {
        setRunId('');
        setRunSummary(null);
        setStageResults({});
      }
      // Confirm the run no longer exists server-side.
      try {
        await callApi(`/api/admin/module/runs/${id}`);
        setError(`Delete warning: run ${id} still resolves from API.`);
      } catch {
        // Expected path: API should 404 after deletion.
      }
      await loadBootstrap();
      setInfo(`Deleted run ${id}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete run');
    } finally {
      setDeletingRunId(null);
    }
  };

  const runStage = async (stage: StageKey) => {
    if (!runId) {
      setError('Create a run before executing stages.');
      return;
    }
    setLoading(true);
    setActiveStage(stage);
    setActiveTaskLabel(`Running ${stage} - ${STAGE_LABEL[stage]}`);
    setError(null);
    setInfo(null);
    try {
      const endpoint = STAGE_ROUTE[stage];
      const basePayload = { replayFromArtifacts };
      const payload =
        stage === 'M0'
          ? {
              ...basePayload,
              syllabusVersionId,
              unit,
              selectedLos,
              constraints: {
                minimiseLessons: false,
                defaultMaxLessonsPerLO: defaultMaxLessons,
                maxAcsPerLesson,
                preferredAcsPerLesson,
                maxLessonsOverrides: {},
                level,
                audience,
              },
              orderingPreference,
              notes,
              chatTranscript,
            }
          : basePayload;

      const data = (await callApi(`/api/admin/module/${runId}/${endpoint}`, payload)) as unknown as StageResult;
      setStageResults((prev) => ({ ...prev, [stage]: data }));
      await loadRunSummary(runId);
      setInfo(`${STAGE_LABEL[stage]} completed${data.replayed ? ' (replayed)' : ''}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed stage ${stage}`);
    } finally {
      setLoading(false);
      setActiveStage(null);
      setActiveTaskLabel(null);
    }
  };

  const runPlanningFlow = async () => {
    if (!runId) {
      setError('Create a run before planning.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Planning lessons (M0-M5)');
    setError(null);
    setInfo(null);
    try {
      const planningStages: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];
      for (const stage of planningStages) {
        setActiveStage(stage);
        const endpoint = STAGE_ROUTE[stage];
        const basePayload = { replayFromArtifacts };
        const payload =
          stage === 'M0'
            ? {
                ...basePayload,
                syllabusVersionId,
                unit,
                selectedLos,
                constraints: {
                  minimiseLessons: false,
                  defaultMaxLessonsPerLO: defaultMaxLessons,
                  maxAcsPerLesson,
                  preferredAcsPerLesson,
                  maxLessonsOverrides: {},
                  level,
                  audience,
                },
                orderingPreference,
                notes,
                chatTranscript,
              }
            : basePayload;
        const data = (await callApi(`/api/admin/module/${runId}/${endpoint}`, payload)) as unknown as StageResult;
        setStageResults((prev) => ({ ...prev, [stage]: data }));
      }
      await loadRunSummary(runId);
      setInfo('Planning complete. Review the lesson matrix, then generate lessons individually.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed during planning flow');
    } finally {
      setLoading(false);
      setActiveStage(null);
      setActiveTaskLabel(null);
    }
  };

  const handleGenerateLesson = async (blueprintId: string) => {
    if (!runId) {
      setError('Create a run first.');
      return;
    }
    setGeneratingBlueprintId(blueprintId);
    setLessonGenerationProgress({
      blueprintId,
      progress: LESSON_GENERATION_PHASES[0].progress,
      phaseMessage: LESSON_GENERATION_PHASES[0].message,
    });
    setError(null);
    setInfo(null);
    let phaseIndex = 0;
    const phaseTimer = window.setInterval(() => {
      phaseIndex = Math.min(phaseIndex + 1, LESSON_GENERATION_PHASES.length - 1);
      const phase = LESSON_GENERATION_PHASES[phaseIndex];
      setLessonGenerationProgress((prev) => {
        if (!prev || prev.blueprintId !== blueprintId) return prev;
        return {
          blueprintId,
          progress: phase.progress,
          phaseMessage: phase.message,
        };
      });
    }, 3500);
    try {
      const data = await callApi(`/api/admin/module/${runId}/lessons/${encodeURIComponent(blueprintId)}/generate`, {});
      setLessonGenerationProgress({
        blueprintId,
        progress: 100,
        phaseMessage: 'Completed: lesson generated',
      });
      await refreshRunSummarySafe(runId);
      await sleep(400);
      setInfo(`Generated ${String(data.lessonId ?? blueprintId)}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to generate ${blueprintId}`);
      await refreshRunSummarySafe(runId);
    } finally {
      window.clearInterval(phaseTimer);
      setGeneratingBlueprintId(null);
      setLessonGenerationProgress(null);
    }
  };

  const stageOrder: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Module Planner vNext</h1>
            <p className="text-sm text-slate-600">Syllabus-versioned module planner pipeline (M0-M5) with manual per-lesson generation</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/generate" className="rounded border border-slate-300 px-3 py-2 text-sm">Lesson</Link>
            <span className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Module</span>
          </div>
        </header>

        <section className="rounded-lg bg-white p-4 shadow-sm space-y-3">
          <label className="block text-sm font-medium">Admin token (optional)</label>
          <div className="flex gap-2">
            <input className="w-full rounded border border-slate-300 px-2 py-2" value={adminToken} onChange={(e) => setAdminToken(e.target.value)} />
            <button onClick={() => void loadBootstrap()} className="rounded border border-slate-300 px-3 py-2 text-sm">Reload</button>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            <button onClick={() => void handlePopulateSyllabus()} disabled={loading} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">
              {populateState === 'RUNNING' ? 'Populating...' : 'Populate syllabus'}
            </button>
            <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
            <button onClick={() => void handleUpload()} disabled={loading} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">Upload syllabus</button>
            <select className="rounded border border-slate-300 px-2 py-2" value={syllabusVersionId} onChange={(e) => void handleSyllabusVersionChange(e.target.value)}>
              <option value="">Select syllabus version</option>
              {syllabusVersions.map((version) => (
                <option key={version.id} value={version.id}>{version.filename} - {version.id.slice(0, 8)}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-600">
            Populate state:{' '}
            <span className={populateState === 'FAILED' ? 'text-rose-700' : 'text-slate-700'}>
              {populateState}
            </span>
          </p>
          {syllabusVersions.length === 0 && (
            <p className="text-sm text-slate-700">
              No syllabus versions available yet. Click `Populate syllabus` to ingest the pre-seeded syllabus source.
            </p>
          )}
          {activeVersion && (
            <p className="text-xs text-slate-600">
              {activeVersion.filename} | {activeVersion.content_hash.slice(0, 12)} | {new Date(activeVersion.created_at).toLocaleString()} | chunks {String(activeVersion.meta_json?.chunkCount ?? '?')} | LOs {String(activeVersion.meta_json?.loCount ?? '?')} | ACs {String(activeVersion.meta_json?.acCount ?? '?')} | units {JSON.stringify(activeVersion.meta_json?.unitsFound ?? [])}
            </p>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Runs</h2>
          <p className="mb-2 text-xs text-slate-600">Newest first. Actions apply to the exact Run ID shown on each row.</p>
          {recentRuns.length === 0 ? (
            <p className="text-sm text-slate-600">No runs yet.</p>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((row, index) => (
                <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 p-2 text-sm">
                  <div>
                    <p className="font-medium">
                      Run #{index + 1} | Unit {row.unit}
                    </p>
                    <p className="text-xs text-slate-600 break-all">
                      Run ID: {row.id}
                    </p>
                    <p className="text-xs text-slate-600">
                      Date: {new Date(row.created_at).toLocaleString()} | Status: {row.status} | Syllabus: {row.syllabus_version_id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleLoadRun(row.id)}
                      disabled={loading || deletingRunId === row.id}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => void handleDeleteRun(row.id)}
                      disabled={loading || deletingRunId !== null}
                      className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                    >
                      {deletingRunId === row.id ? 'Deleting...' : 'Delete Entire Run'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {enabled !== false && (
          <section className="grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium">Unit
                <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={unit} onChange={(e) => void handleUnitChange(e.target.value)} disabled={!syllabusVersionId || units.length === 0}>
                  {units.length === 0 ? (
                    <option value="">No units available</option>
                  ) : (
                    units.map((u) => <option key={u} value={u}>Unit {u}</option>)
                  )}
                </select>
              </label>
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected LOs (default)</p>
                {!manualLoOverride && (
                  <div className="rounded border border-slate-200 bg-slate-50 px-2 py-2 text-sm">
                    {unitLos.length > 0 ? unitLos.join(', ') : 'No LOs found for selected unit.'}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={manualLoOverride}
                    onChange={(e) => {
                      const enabledOverride = e.target.checked;
                      setManualLoOverride(enabledOverride);
                      if (enabledOverride && manualLosInput.trim().length === 0) {
                        setManualLosInput(unitLos.join(', '));
                      }
                    }}
                  />
                  Manual LO override (advanced)
                </label>
                {manualLoOverride && (
                  <input
                    className="w-full rounded border border-slate-300 px-2 py-2"
                    value={manualLosInput}
                    onChange={(e) => setManualLosInput(e.target.value)}
                    placeholder="LO1, LO5"
                  />
                )}
              </div>
              <label className="block text-sm font-medium">Chat Transcript
                <textarea className="mt-1 h-36 w-full rounded border border-slate-300 px-2 py-2" value={chatTranscript} onChange={(e) => setChatTranscript(e.target.value)} />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Notes
                <textarea className="mt-1 h-20 w-full rounded border border-slate-300 px-2 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">Max lessons/LO
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={defaultMaxLessons} onChange={(e) => setDefaultMaxLessons(Number.parseInt(e.target.value || '9', 10))} />
                </label>
                <label className="block text-sm font-medium">Ordering
                  <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={orderingPreference} onChange={(e) => setOrderingPreference(e.target.value as 'foundation-first' | 'lo-order')}>
                    <option value="foundation-first">foundation-first</option>
                    <option value="lo-order">lo-order</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">Max ACs/Lesson (hard)
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={maxAcsPerLesson} onChange={(e) => setMaxAcsPerLesson(Number.parseInt(e.target.value || '4', 10))} />
                </label>
                <label className="block text-sm font-medium">Preferred ACs/Lesson (soft)
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={preferredAcsPerLesson} onChange={(e) => setPreferredAcsPerLesson(Number.parseInt(e.target.value || '2', 10))} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="rounded border border-slate-300 px-2 py-2" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" />
                <input className="rounded border border-slate-300 px-2 py-2" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={replayFromArtifacts} onChange={(e) => setReplayFromArtifacts(e.target.checked)} />Replay-from-artifacts</label>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => void handleCreateRun()} disabled={loading || !syllabusVersionId || !unit} className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Create Run</button>
                <button onClick={() => void runPlanningFlow()} disabled={loading || !runId} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">Plan lessons (M0-M5)</button>
                {runId && <span className="self-center text-xs text-slate-600">Run: {runId}</span>}
              </div>
            </div>
          </section>
        )}

        {unitStructure && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Truth Layer: Unit {unitStructure.unit}</h2>
            {Array.isArray(unitStructure.range) && unitStructure.range.length > 0 && (
              <div className="mb-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <p className="font-medium">Range</p>
                <ul className="mt-1 space-y-1">
                  {unitStructure.range.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              {unitStructure.los.map((lo) => (
                <div key={lo.loNumber} className="rounded border border-slate-200 p-3">
                  <p className="text-sm font-medium">LO{lo.loNumber}{lo.title ? ` - ${lo.title}` : ''}</p>
                  {Array.isArray(lo.range) && lo.range.length > 0 && (
                    <div className="mt-2 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
                      <p className="font-medium">Range</p>
                      <ul className="mt-1 space-y-1">
                        {lo.range.map((item, idx) => (
                          <li key={`${item}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {lo.acs.map((ac) => (
                      <li key={ac.acKey}>
                        <span className="font-semibold">{ac.acKey}</span>: {ac.text ?? ''}
                        {Array.isArray(ac.range) && ac.range.length > 0 ? ` (Range: ${ac.range.join(', ')})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Stages</h2>
          {loading && (
            <div className="mb-3 rounded border border-sky-200 bg-sky-50 p-2 text-xs text-sky-800">
              <p>{activeTaskLabel ?? 'Working...'}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-sky-100">
                <div className="h-full w-1/3 animate-pulse rounded bg-sky-500" />
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {stageOrder.map((stage) => (
              (() => {
                const hasArtifact = Boolean(stageResults[stage]?.artifact);
                const isRunning = activeStage === stage;
                const className = isRunning
                  ? 'border-sky-500 bg-sky-50 text-sky-900'
                  : hasArtifact
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-300 bg-white text-slate-900';
                return (
                  <button
                    key={stage}
                    onClick={() => void runStage(stage)}
                    disabled={loading || !runId}
                    className={`rounded border px-3 py-2 text-sm disabled:opacity-60 ${className}`}
                  >
                    {isRunning ? 'Running...' : STAGE_LABEL[stage]}
                    {isRunning ? '' : hasArtifact ? ' Done' : runSummary?.replayable?.[stage] ? ' *' : ''}
                  </button>
                );
              })()
            ))}
            <button
              onClick={() => void handleRefreshRunSummary()}
              disabled={loading || !runId}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              Refresh Run Summary
            </button>
          </div>
        </section>

        {retryNotice && (
          <section className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            {retryNotice}
          </section>
        )}
        {error && <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>}
        {info && <section className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</section>}

        <section className="grid gap-4 md:grid-cols-2">
          {stageOrder.map((stage) => {
            const artifact = stageResults[stage]?.artifact;
            const replayed = stageResults[stage]?.replayed;
            return (
              <article key={stage} className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold">{stage} - {STAGE_LABEL[stage]} {replayed ? '(replayed)' : ''}</h3>
                <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{artifact ? JSON.stringify(artifact, null, 2) : 'No artifact yet'}</pre>
              </article>
            );
          })}
        </section>

        {runSummary && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Run Summary</h2>
            <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(runSummary, null, 2)}</pre>
            {chunkDiagnostics.length > 0 && (
              <div className="mt-3 rounded border border-slate-200 p-3 text-xs">
                <p className="font-medium">Chunks Used (stage / chunk / pages)</p>
                <ul className="mt-2 space-y-1">
                  {chunkDiagnostics.map((row, index) => (
                    <li key={`${row.stage}-${row.id}-${index}`}>{row.stage} / {row.id} / {row.pageStart}-{row.pageEnd}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {runSummary && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Lesson Plan Matrix</h2>
            {(() => {
              const m2 = runSummary.artifacts.find((a) => a.stage === 'M2')?.artifact_json as
                | { los?: Array<{ lo: string; coverageTargets: Array<{ acKey: string; acText: string }> }> }
                | undefined;
              const m4Raw = runSummary.artifacts.find((a) => a.stage === 'M4')?.artifact_json as
                | Array<{ id: string; lo: string; topic: string; acAnchors: string[] }>
                | { blueprints?: Array<{ id: string; lo: string; topic: string; acAnchors: string[] }> }
                | undefined;
              const m4 = Array.isArray(m4Raw)
                ? m4Raw
                : Array.isArray(m4Raw?.blueprints)
                  ? m4Raw.blueprints
                  : [];
              const acByKey = new Map<string, string>();
              m2?.los?.forEach((lo) => lo.coverageTargets?.forEach((ac) => acByKey.set(ac.acKey, ac.acText)));
              const lessonByBlueprint = new Map(
                runSummary.lessons.map((row) => [row.blueprint_id, row] as const)
              );

              if (m4.length === 0) {
                return <p className="text-sm text-slate-600">No planned lessons yet. Run planning through M4/M5 first.</p>;
              }

              const byLo = new Map<string, Array<{ id: string; lo: string; topic: string; acAnchors: string[] }>>();
              m4.forEach((bp) => {
                const arr = byLo.get(bp.lo) ?? [];
                arr.push(bp);
                byLo.set(bp.lo, arr);
              });

              return (
                <div className="space-y-4">
                  {Array.from(byLo.entries())
                    .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
                    .map(([lo, lessons]) => (
                      <div key={lo} className="rounded border border-slate-300 p-3">
                        <h3 className="text-sm font-semibold">{lo} ({lessons.length} lesson{lessons.length === 1 ? '' : 's'})</h3>
                        <div className="mt-3 space-y-3">
                          {lessons.map((bp) => {
                            const row = lessonByBlueprint.get(bp.id);
                            const state = row?.status === 'success' ? 'generated' : row?.status === 'failed' ? 'failed' : row?.status === 'pending' ? 'generating' : 'planned';
                            return (
                              <div key={bp.id} className="rounded border border-slate-200 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold">{bp.id}</p>
                                    <p className="text-xs text-slate-600">{bp.topic}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">{state}</span>
                                    {state === 'generated' ? (
                                      <button
                                        onClick={() =>
                                          setViewLessonPayload({
                                            title: bp.id,
                                            payload: row?.lesson_json ?? { message: 'No persisted lesson payload found.' },
                                          })
                                        }
                                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                                      >
                                        View
                                      </button>
                                    ) : state === 'generating' ? (
                                      <button
                                        disabled
                                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-500"
                                      >
                                        Generating...
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => void handleGenerateLesson(bp.id)}
                                        disabled={Boolean(generatingBlueprintId)}
                                        className="rounded bg-slate-900 px-2 py-1 text-xs text-white disabled:opacity-60"
                                      >
                                        {generatingBlueprintId === bp.id ? 'Generating...' : 'Generate Lesson'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {lessonGenerationProgress?.blueprintId === bp.id && (
                                  <div className="mt-2 rounded border border-sky-200 bg-sky-50 p-2">
                                    <div className="flex items-center justify-between text-[11px] text-sky-800">
                                      <span>{lessonGenerationProgress.phaseMessage}</span>
                                      <span>{lessonGenerationProgress.progress}%</span>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-sky-100">
                                      <div
                                        className="h-full rounded bg-sky-500 transition-all duration-500"
                                        style={{ width: `${lessonGenerationProgress.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="mt-2 text-xs text-slate-700">
                                  <p className="font-medium">Covered ACs</p>
                                  <ul className="mt-1 space-y-1">
                                    {bp.acAnchors.map((ac) => (
                                      <li key={ac}>
                                        <span className="font-semibold">{ac}</span>
                                        {acByKey.get(ac) ? ` - ${acByKey.get(ac)}` : ''}
                                      </li>
                                    ))}
                                  </ul>
                                  {row?.error ? <p className="mt-2 text-rose-700">Error: {row.error}</p> : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })()}
          </section>
        )}

        {viewLessonPayload && (
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-3">
                <h3 className="text-sm font-semibold">Generated Lesson View: {viewLessonPayload.title}</h3>
                <button
                  onClick={() => setViewLessonPayload(null)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto p-3">
                <pre className="rounded bg-slate-900 p-3 text-xs text-slate-100">
                  {JSON.stringify(viewLessonPayload.payload, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
