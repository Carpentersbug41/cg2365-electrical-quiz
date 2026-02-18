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

interface CatalogUnit {
  unit_code: string;
  unit_title: string;
  level_min: number;
  level_max: number;
  approved_question_count: number;
  approved_by_level: { 2: number; 3: number };
}

const defaultFormatMix = { mcq: 0.7, scenario: 0.2, short_answer: 0.1 };
const defaultDifficultyMix = { easy: 0.4, med: 0.5, hard: 0.1 };

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
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [unitCode, setUnitCode] = useState('');
  const [level, setLevel] = useState<2 | 3>(2);
  const [loCodes, setLoCodes] = useState('');
  const [targetCount, setTargetCount] = useState(100);
  const [formatMixJson, setFormatMixJson] = useState(JSON.stringify(defaultFormatMix));
  const [difficultyMixJson, setDifficultyMixJson] = useState(JSON.stringify(defaultDifficultyMix));

  const selectedRun = useMemo(() => runs.find((row) => row.id === selectedRunId) ?? null, [runs, selectedRunId]);

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

  const createRun = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const formatMix = JSON.parse(formatMixJson) as Record<string, number>;
      const difficultyMix = JSON.parse(difficultyMixJson) as Record<string, number>;
      const lo_codes = loCodes
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);

      const response = await adminAuthedFetch('/api/admin/questions/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit_code: unitCode,
          level,
          lo_codes: lo_codes.length > 0 ? lo_codes : null,
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
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch(`/api/admin/questions/runs/${selectedRunId}/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? 'Failed to start run.');
      }
      setSteps((Array.isArray(data.steps) ? data.steps : []) as StepRow[]);
      setInfo(`Run ${selectedRunId.slice(0, 8)} finished with status ${data.run?.status ?? 'unknown'}.`);
      await loadRuns();
      await loadRunDetails(selectedRunId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start run.');
    } finally {
      setLoading(false);
    }
  };

  const reviewAction = async (questionId: string, action: 'approve' | 'reject') => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
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
            LO Codes (comma-separated, optional)
            <input className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={loCodes} onChange={(e) => setLoCodes(e.target.value)} placeholder="LO3, LO4" />
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
              Start Selected Run
            </button>
          </div>
        </section>

        {error && <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>}
        {info && <section className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</section>}
        {!loading && catalogUnits.length === 0 && (
          <section className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            No units found in the latest syllabus version. Upload or populate syllabus in `/admin/module` first.
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
              <h2 className="mb-2 text-lg font-semibold">Draft Review Queue</h2>
              <div className="space-y-2">
                {drafts.map((draft) => (
                  <div key={draft.id} className="rounded border border-slate-200 p-3 text-sm">
                    <p className="font-semibold">{draft.stem}</p>
                    <p className="text-xs text-slate-600">
                      {draft.unit_code} / {draft.lo_code ?? '-'} / {draft.ac_code ?? '-'} / {draft.format} / {draft.difficulty} / {draft.status}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => void reviewAction(draft.id, 'approve')} disabled={loading} className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700">
                        Approve
                      </button>
                      <button onClick={() => void reviewAction(draft.id, 'reject')} disabled={loading} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {drafts.length === 0 && <p className="text-sm text-slate-600">No drafts for selected run.</p>}
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
