'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { authedFetch } from '@/lib/api/authedFetch';
import { courseHref } from '@/lib/routing/courseHref';
import { getCoursePrefixForClient } from '@/lib/routing/curricula';

interface LessonSummary {
  id: string;
  title: string;
  unitNumber: string;
  questionCount: number;
}

interface LessonStatus {
  lessonId: string;
  questionCount: number;
  needsQuiz: boolean;
  hasPartialQuiz: boolean;
}

interface StudentQuizSet {
  id: string;
  title: string;
  unit_code: string;
  question_count: number;
  cadence_days: number;
  lesson_ids: string[];
}

interface QuestionRun {
  id: string;
  unit_code: string;
  level: 2 | 3;
  lo_codes: string[] | null;
  target_count: number;
  status: string;
  created_at: string;
}

function curriculumFromPrefix(): 'cg2365' | 'gcse-science-physics' | 'gcse-science-biology' {
  const prefix = getCoursePrefixForClient();
  if (prefix === '/gcse/science/physics') return 'gcse-science-physics';
  if (prefix === '/gcse/science/biology') return 'gcse-science-biology';
  return 'cg2365';
}

export default function QuizHubPage() {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [statuses, setStatuses] = useState<LessonStatus[]>([]);
  const [sets, setSets] = useState<StudentQuizSet[]>([]);
  const [runs, setRuns] = useState<QuestionRun[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [runsUnavailable, setRunsUnavailable] = useState(false);

  const [lessonId, setLessonId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const [runUnitCode, setRunUnitCode] = useState('203');
  const [runLevel, setRunLevel] = useState<2 | 3>(2);
  const [runLoCodes, setRunLoCodes] = useState('');
  const [runTargetCount, setRunTargetCount] = useState(50);
  const [creatingRun, setCreatingRun] = useState(false);
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [runningRunId, setRunningRunId] = useState<string | null>(null);

  const coverage = useMemo(() => {
    const total = statuses.length;
    const complete = statuses.filter((item) => item.questionCount >= 50).length;
    const partial = statuses.filter((item) => item.hasPartialQuiz).length;
    const missing = statuses.filter((item) => item.questionCount === 0).length;
    const needs = statuses.filter((item) => item.needsQuiz).length;
    return { total, complete, partial, missing, needs };
  }, [statuses]);

  const loadData = useCallback(async () => {
    setPageError(null);
    try {
      const [lessonsRes, statusRes, setsRes] = await Promise.all([
        fetch('/api/lessons', { cache: 'no-store' }),
        fetch('/api/lessons-status', { cache: 'no-store' }),
        authedFetch('/api/v1/quiz-sets', { cache: 'no-store' }),
      ]);

      if (lessonsRes.ok) {
        const payload = await lessonsRes.json();
        const mapped = Array.isArray(payload.lessons)
          ? payload.lessons.map((item: Record<string, unknown>) => ({
            id: String(item.id ?? ''),
            title: String(item.title ?? ''),
            unitNumber: String(item.unitNumber ?? ''),
            questionCount: Number(item.questionCount ?? 0),
          })).filter((item) => item.id.length > 0)
          : [];
        setLessons(mapped);
        setLessonId((prev) => (prev.length > 0 ? prev : mapped[0]?.id ?? ''));
      }

      if (statusRes.ok) {
        const payload = await statusRes.json();
        const mapped = Array.isArray(payload.lessons)
          ? payload.lessons.map((item: Record<string, unknown>) => ({
            lessonId: String(item.lessonId ?? ''),
            questionCount: Number(item.questionCount ?? 0),
            needsQuiz: Boolean(item.needsQuiz),
            hasPartialQuiz: Boolean(item.hasPartialQuiz),
          }))
          : [];
        setStatuses(mapped);
      }

      if (setsRes.ok) {
        const payload = await setsRes.json();
        const mapped = Array.isArray(payload.sets) ? payload.sets : [];
        setSets(mapped);
      } else {
        setSets([]);
      }

      const runsRes = await authedFetch('/api/admin/questions/runs', { cache: 'no-store' });
      if (runsRes.ok) {
        const payload = await runsRes.json();
        setRuns(Array.isArray(payload.runs) ? payload.runs : []);
        setRunsUnavailable(false);
      } else {
        setRuns([]);
        setRunsUnavailable(true);
      }
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Failed to load quiz hub data.');
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleGenerateLessonQuiz = async () => {
    if (!lessonId) return;
    setGenerating(true);
    setGenerateMessage('Generating quiz via strict engine...');
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          regenerate: true,
          curriculum: curriculumFromPrefix(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to generate quiz.');
      }
      const warningText = Array.isArray(payload.warnings) && payload.warnings.length > 0
        ? ` Warnings: ${payload.warnings.join(' | ')}`
        : '';
      setGenerateMessage(`Generated ${payload.quizFile ?? 'quiz file'}.${warningText}`);
      await loadData();
    } catch (error) {
      setGenerateMessage(error instanceof Error ? error.message : 'Failed to generate quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateAndRun = async () => {
    setCreatingRun(true);
    setRunMessage('Creating advanced question run...');
    try {
      const loCodes = runLoCodes
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      const createRes = await authedFetch('/api/admin/questions/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_code: runUnitCode,
          level: runLevel,
          lo_codes: loCodes.length > 0 ? loCodes : null,
          target_count: runTargetCount,
        }),
      });
      const createPayload = await createRes.json();
      if (!createRes.ok || !createPayload.success) {
        throw new Error(createPayload.message || createPayload.error || 'Failed to create run.');
      }
      const runId = String(createPayload.run_id);
      setRunMessage(`Run created (${runId}). Starting...`);
      setRunningRunId(runId);
      const startRes = await authedFetch(`/api/admin/questions/runs/${runId}/start`, {
        method: 'POST',
      });
      const startPayload = await startRes.json();
      if (!startRes.ok || !startPayload.success) {
        throw new Error(startPayload.message || startPayload.error || 'Failed to start run.');
      }
      setRunMessage(`Run ${runId} completed.`);
      await loadData();
    } catch (error) {
      setRunMessage(error instanceof Error ? error.message : 'Advanced run failed.');
    } finally {
      setRunningRunId(null);
      setCreatingRun(false);
    }
  };

  const handleStartExistingRun = async (runId: string) => {
    setRunningRunId(runId);
    setRunMessage(`Starting run ${runId}...`);
    try {
      const response = await authedFetch(`/api/admin/questions/runs/${runId}/start`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || payload.error || 'Failed to start run.');
      }
      setRunMessage(`Run ${runId} completed.`);
      await loadData();
    } catch (error) {
      setRunMessage(error instanceof Error ? error.message : 'Failed to start run.');
    } finally {
      setRunningRunId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Quiz Hub</h1>
            <p className="text-sm text-slate-600">One place for lesson quiz generation, advanced bank runs, sets, and coverage.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href={courseHref('/my-quizzes')} className="rounded border border-slate-300 px-3 py-2 hover:bg-slate-100">My Quizzes</Link>
            <Link href={courseHref('/learn')} className="rounded border border-slate-300 px-3 py-2 hover:bg-slate-100">Learn</Link>
            <Link href={courseHref('/generate-quiz')} className="rounded border border-slate-300 px-3 py-2 hover:bg-slate-100">Generate Quiz</Link>
            <Link href={courseHref('/quiz')} className="rounded border border-slate-300 px-3 py-2 hover:bg-slate-100">Question Bank</Link>
          </div>
        </div>

        {pageError && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</div>
        )}

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Relevant URLs</h2>
          <div className="mt-2 grid gap-1 text-sm text-slate-700">
            <div>Frontend: <code>{courseHref('/quiz-hub')}</code>, <code>{courseHref('/my-quizzes')}</code>, <code>{courseHref('/learn')}</code>, <code>{courseHref('/generate-quiz')}</code></div>
            <div>APIs: <code>POST /api/generate-quiz</code>, <code>POST /api/admin/questions/runs</code>, <code>POST /api/admin/questions/runs/{'{run_id}'}/start</code></div>
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Lesson Quiz Generation (Strict-First)</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.id} - {lesson.title} ({lesson.questionCount} questions)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleGenerateLessonQuiz}
              disabled={generating || !lessonId}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {generating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
          {generateMessage && <p className="mt-3 text-sm text-slate-700">{generateMessage}</p>}
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Advanced Question Bank Runs</h2>
          <p className="mt-1 text-sm text-slate-600">Create strict run, then execute immediately. Admin access required.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <input
              value={runUnitCode}
              onChange={(event) => setRunUnitCode(event.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="Unit code (e.g. 203)"
            />
            <select
              value={String(runLevel)}
              onChange={(event) => setRunLevel(Number(event.target.value) as 2 | 3)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
            <input
              value={runTargetCount}
              onChange={(event) => setRunTargetCount(Number(event.target.value))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              type="number"
              min={1}
              max={300}
              placeholder="Target count"
            />
            <input
              value={runLoCodes}
              onChange={(event) => setRunLoCodes(event.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="LO codes CSV (optional)"
            />
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleCreateAndRun}
              disabled={creatingRun}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {creatingRun ? 'Running...' : 'Create + Run Advanced Generator'}
            </button>
          </div>
          {runMessage && <p className="mt-3 text-sm text-slate-700">{runMessage}</p>}
          {runsUnavailable ? (
            <p className="mt-3 text-sm text-amber-700">Admin runs are unavailable for this account/scope.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-2 py-2">Run ID</th>
                    <th className="px-2 py-2">Scope</th>
                    <th className="px-2 py-2">Target</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.slice(0, 12).map((run) => (
                    <tr key={run.id} className="border-b border-slate-100">
                      <td className="px-2 py-2 font-mono text-xs">{run.id}</td>
                      <td className="px-2 py-2">{run.unit_code} / L{run.level}{run.lo_codes?.length ? ` / ${run.lo_codes.join(',')}` : ''}</td>
                      <td className="px-2 py-2">{run.target_count}</td>
                      <td className="px-2 py-2">{run.status}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => void handleStartExistingRun(run.id)}
                          disabled={runningRunId === run.id}
                          className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-100 disabled:cursor-not-allowed"
                        >
                          {runningRunId === run.id ? 'Running...' : 'Start'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">My Quiz Sets</h2>
            <p className="mt-1 text-sm text-slate-600">Visible sets for quick sanity check.</p>
            <div className="mt-3 space-y-2">
              {sets.length === 0 ? (
                <p className="text-sm text-slate-600">No sets yet.</p>
              ) : (
                sets.slice(0, 10).map((setItem) => (
                  <div key={setItem.id} className="rounded border border-slate-200 px-3 py-2 text-sm">
                    <div className="font-medium">{setItem.title}</div>
                    <div className="text-slate-600">
                      Unit {setItem.unit_code} | {setItem.question_count} questions | cadence {setItem.cadence_days} days
                    </div>
                    <div className="text-slate-500">Lessons: {setItem.lesson_ids.length}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Coverage Snapshot</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border border-slate-200 p-2">Total lessons: <strong>{coverage.total}</strong></div>
              <div className="rounded border border-slate-200 p-2">Complete (50+): <strong>{coverage.complete}</strong></div>
              <div className="rounded border border-slate-200 p-2">Partial (1-49): <strong>{coverage.partial}</strong></div>
              <div className="rounded border border-slate-200 p-2">Missing (0): <strong>{coverage.missing}</strong></div>
              <div className="rounded border border-slate-200 p-2">Needs work (&lt;30): <strong>{coverage.needs}</strong></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

