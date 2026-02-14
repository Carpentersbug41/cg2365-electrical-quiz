'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  }>;
  replayable: Record<StageKey, boolean>;
}

interface StageResult {
  success: boolean;
  stage: StageKey;
  replayed: boolean;
  artifact: unknown;
  message?: string;
}

type PopulateState = 'IDLE' | 'RUNNING' | 'READY' | 'FAILED';

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
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [stageResults, setStageResults] = useState<Partial<Record<StageKey, StageResult>>>({});
  const [replayFromArtifacts, setReplayFromArtifacts] = useState(true);
  const [defaultMaxLessons, setDefaultMaxLessons] = useState(2);
  const [level, setLevel] = useState('Level 2');
  const [audience, setAudience] = useState('beginner');
  const [orderingPreference, setOrderingPreference] = useState<'foundation-first' | 'lo-order'>('foundation-first');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [syllabusVersions, setSyllabusVersions] = useState<SyllabusVersion[]>([]);
  const [syllabusVersionId, setSyllabusVersionId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [populateState, setPopulateState] = useState<PopulateState>('IDLE');

  const abortRef = useRef<AbortController | null>(null);

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
    async (url: string, body?: unknown, isFormData = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: body ? (isFormData ? buildHeaders() : buildHeaders('application/json')) : buildHeaders(),
        body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || `Request failed (${response.status})`);
      }
      return data as Record<string, unknown>;
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

    setUnits(nextUnits);
    setUnit(resolvedUnit);
    setUnitLos(los);
  }, [callApi]);

  const loadBootstrap = useCallback(async () => {
    try {
      const data = await callApi('/api/admin/module/runs');
      setEnabled(true);
      const versions = Array.isArray(data.syllabusVersions)
        ? (data.syllabusVersions as SyllabusVersion[])
        : [];
      const defaultVersionId = String(data.defaultSyllabusVersionId ?? '');
      const nextVersionId =
        syllabusVersionId && versions.some((version) => version.id === syllabusVersionId)
          ? syllabusVersionId
          : defaultVersionId;

      setSyllabusVersions(versions);
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
      if (summary.run.request_hash) setReplayFromArtifacts(true);
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

  useEffect(() => {
    void loadBootstrap();
  }, [loadBootstrap]);

  const handlePopulateSyllabus = async () => {
    setLoading(true);
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
    }
  };

  const runStage = async (stage: StageKey) => {
    if (!runId) {
      setError('Create a run before executing stages.');
      return;
    }
    setLoading(true);
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
                minimiseLessons: true,
                defaultMaxLessonsPerLO: defaultMaxLessons,
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
    }
  };

  const stageOrder: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Module Planner vNext</h1>
            <p className="text-sm text-slate-600">Syllabus-versioned module generation pipeline (M0-M6)</p>
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
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={defaultMaxLessons} onChange={(e) => setDefaultMaxLessons(Number.parseInt(e.target.value || '2', 10))} />
                </label>
                <label className="block text-sm font-medium">Ordering
                  <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={orderingPreference} onChange={(e) => setOrderingPreference(e.target.value as 'foundation-first' | 'lo-order')}>
                    <option value="foundation-first">foundation-first</option>
                    <option value="lo-order">lo-order</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="rounded border border-slate-300 px-2 py-2" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" />
                <input className="rounded border border-slate-300 px-2 py-2" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={replayFromArtifacts} onChange={(e) => setReplayFromArtifacts(e.target.checked)} />Replay-from-artifacts</label>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => void handleCreateRun()} disabled={loading || !syllabusVersionId || !unit} className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Create Run</button>
                {runId && <span className="self-center text-xs text-slate-600">Run: {runId}</span>}
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Stages</h2>
          <div className="flex flex-wrap gap-2">
            {stageOrder.map((stage) => (
              <button key={stage} onClick={() => void runStage(stage)} disabled={loading || !runId} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">
                {STAGE_LABEL[stage]}{runSummary?.replayable?.[stage] ? ' *' : ''}
              </button>
            ))}
          </div>
        </section>

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
      </div>
    </main>
  );
}
