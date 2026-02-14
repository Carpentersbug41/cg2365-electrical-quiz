'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type StageKey = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

interface RunSummary {
  run: {
    id: string;
    unit: string;
    status: string;
    request_hash: string | null;
  };
  artifacts: Array<{
    stage: StageKey;
    artifact_json: unknown;
    created_at: string;
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
  const [unit, setUnit] = useState('202');
  const [chatTranscript, setChatTranscript] = useState('');
  const [selectedLosInput, setSelectedLosInput] = useState('');
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
  const abortRef = useRef<AbortController | null>(null);

  const selectedLos = useMemo(
    () =>
      selectedLosInput
        .split(',')
        .map((lo) => lo.trim())
        .filter((lo) => lo.length > 0),
    [selectedLosInput]
  );

  const callApi = useCallback(async (url: string, body?: unknown) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || `Request failed (${response.status})`);
    }
    return data as Record<string, unknown>;
  }, []);

  const loadBootstrap = useCallback(async () => {
    try {
      const data = await callApi('/api/admin/module/runs');
      setEnabled(true);
      const nextUnits = Array.isArray(data.units) ? data.units.map((u) => String(u)) : [];
      setUnits(nextUnits);
      if (nextUnits.length > 0 && !nextUnits.includes(unit)) {
        setUnit(nextUnits[0]);
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
  }, [callApi, unit]);

  const loadRunSummary = useCallback(
    async (id: string) => {
      const data = await callApi(`/api/admin/module/runs/${id}`);
      const summary = data as unknown as RunSummary;
      setRunSummary(summary);
      if (summary.run.request_hash) {
        setReplayFromArtifacts(true);
      }
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

  const handleCreateRun = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const data = await callApi('/api/admin/module/runs', {
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

  const stopCurrent = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setInfo('Stopped current request.');
      setLoading(false);
    }
  };

  const stageOrder: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Module Planner v6</h1>
            <p className="text-sm text-slate-600">Additive module-level generation pipeline (M0-M6)</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/generate" className="rounded border border-slate-300 px-3 py-2 text-sm">
              Lesson
            </Link>
            <span className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Module</span>
          </div>
        </header>

        {enabled === false && (
          <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <h2 className="font-semibold">Module planner disabled</h2>
            <p className="text-sm">
              Set <code>MODULE_PLANNER_ENABLED=true</code> to enable Module Mode.
            </p>
          </section>
        )}

        {enabled !== false && (
          <section className="grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Unit
                <select
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {(units.length > 0 ? units : ['202']).map((u) => (
                    <option key={u} value={u}>
                      Unit {u}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Selected LOs (comma-separated)
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                  value={selectedLosInput}
                  onChange={(e) => setSelectedLosInput(e.target.value)}
                  placeholder="LO1, LO5"
                />
              </label>

              <label className="block text-sm font-medium">
                Chat Transcript
                <textarea
                  className="mt-1 h-40 w-full rounded border border-slate-300 px-2 py-2"
                  value={chatTranscript}
                  onChange={(e) => setChatTranscript(e.target.value)}
                  placeholder="Describe intent for this module run..."
                />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Notes
                <textarea
                  className="mt-1 h-20 w-full rounded border border-slate-300 px-2 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Planner notes"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">
                  Max lessons / LO
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    value={defaultMaxLessons}
                    onChange={(e) => setDefaultMaxLessons(Number.parseInt(e.target.value || '2', 10))}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Ordering
                  <select
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    value={orderingPreference}
                    onChange={(e) => setOrderingPreference(e.target.value as 'foundation-first' | 'lo-order')}
                  >
                    <option value="foundation-first">foundation-first</option>
                    <option value="lo-order">lo-order</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">
                  Level
                  <input
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Audience
                  <input
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={replayFromArtifacts}
                  onChange={(e) => setReplayFromArtifacts(e.target.checked)}
                />
                Replay-from-artifacts
              </label>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={handleCreateRun}
                  disabled={loading}
                  className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Create Run
                </button>
                <button
                  onClick={stopCurrent}
                  disabled={!loading}
                  className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
                >
                  Stop
                </button>
                {runId && <span className="self-center text-xs text-slate-600">Run: {runId}</span>}
              </div>
            </div>
          </section>
        )}

        {enabled !== false && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Stages</h2>
            <div className="flex flex-wrap gap-2">
              {stageOrder.map((stage) => (
                <button
                  key={stage}
                  onClick={() => void runStage(stage)}
                  disabled={loading || !runId}
                  className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
                >
                  {STAGE_LABEL[stage]}
                  {runSummary?.replayable?.[stage] ? ' *' : ''}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">* replay artifact available for this request hash</p>
          </section>
        )}

        {error && (
          <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>
        )}
        {info && <section className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</section>}

        {enabled !== false && (
          <section className="grid gap-4 md:grid-cols-2">
            {stageOrder.map((stage) => {
              const artifact = stageResults[stage]?.artifact;
              const replayed = stageResults[stage]?.replayed;
              return (
                <article key={stage} className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="mb-2 font-semibold">
                    {stage} - {STAGE_LABEL[stage]} {replayed ? '(replayed)' : ''}
                  </h3>
                  <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                    {artifact ? JSON.stringify(artifact, null, 2) : 'No artifact yet'}
                  </pre>
                </article>
              );
            })}
          </section>
        )}

        {runSummary && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Run Summary</h2>
            <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(runSummary, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}

