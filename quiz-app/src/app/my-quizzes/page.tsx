'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import type { Question } from '@/data/questions';
import { authedFetch } from '@/lib/api/authedFetch';
import { courseHref } from '@/lib/routing/courseHref';

interface CatalogUnit {
  unit_code: string;
  unit_title: string;
}

interface LessonSummary {
  id: string;
  title: string;
  unitNumber: string;
}

interface StudentQuizSet {
  id: string;
  title: string;
  unit_code: string;
  level: 2 | 3;
  question_count: number;
  cadence_days: number;
  is_active: boolean;
  lesson_ids: string[];
  lo_codes: string[];
}

interface ReviewQueueRow {
  id: string;
  question_stable_id: string;
  status: 'active' | 'resolved';
  due_at: string;
  lo_code: string | null;
  llm_why_wrong: string | null;
}

const initialForm = {
  title: '',
  unit_code: '',
  lesson_ids: [] as string[],
  level: 2 as 2 | 3,
  question_count: 20,
  cadence_days: 3,
  lo_codes: '',
};

export default function MyQuizzesPage() {
  const [units, setUnits] = useState<CatalogUnit[]>([]);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [sets, setSets] = useState<StudentQuizSet[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueRow[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [runningSet, setRunningSet] = useState<StudentQuizSet | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);

  const activeQueueCount = useMemo(
    () => reviewQueue.filter((item) => item.status === 'active').length,
    [reviewQueue]
  );

  const lessonsForSelectedUnit = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.unitNumber === form.unit_code)
        .sort((a, b) => a.id.localeCompare(b.id)),
    [lessons, form.unit_code]
  );

  const selectedLessons = useMemo(
    () => lessonsForSelectedUnit.filter((lesson) => form.lesson_ids.includes(lesson.id)),
    [lessonsForSelectedUnit, form.lesson_ids]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthorized(false);
    try {
      const [catalogRes, lessonsRes, setsRes, queueRes] = await Promise.all([
        fetch('/api/quiz/catalog', { cache: 'no-store' }),
        fetch('/api/lessons', { cache: 'no-store' }),
        authedFetch('/api/v1/quiz-sets', { cache: 'no-store' }),
        authedFetch('/api/v1/review/queue?status=active&limit=100', { cache: 'no-store' }),
      ]);

      const catalogData = await catalogRes.json();
      setUnits(Array.isArray(catalogData.units) ? catalogData.units : []);
      if (Array.isArray(catalogData.units) && catalogData.units.length > 0) {
        setForm((prev) => (prev.unit_code ? prev : { ...prev, unit_code: catalogData.units[0].unit_code }));
      }
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        const list = Array.isArray(lessonsData.lessons)
          ? lessonsData.lessons
              .map((lesson) => ({
                id: String(lesson.id ?? ''),
                title: String(lesson.title ?? ''),
                unitNumber: String(lesson.unitNumber ?? ''),
              }))
              .filter((lesson) => lesson.id.length > 0 && lesson.title.length > 0 && lesson.unitNumber.length > 0)
          : [];
        setLessons(list);
      }

      if (setsRes.status === 401) {
        setUnauthorized(true);
        setSets([]);
        setReviewQueue([]);
        return;
      }
      if (!setsRes.ok) {
        const setsErr = await setsRes.json();
        throw new Error(setsErr.error || 'Failed to load quiz sets.');
      }
      if (!queueRes.ok && queueRes.status !== 401) {
        const queueErr = await queueRes.json();
        throw new Error(queueErr.error || 'Failed to load review queue.');
      }

      const setsData = await setsRes.json();
      const queueData = await queueRes.json();
      setSets(Array.isArray(setsData.sets) ? setsData.sets : []);
      setReviewQueue(Array.isArray(queueData.items) ? queueData.items : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleCreateSet = async () => {
    setSaving(true);
    setError(null);
    try {
      const loCodes = form.lo_codes
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);

      const response = await authedFetch('/api/v1/quiz-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          unit_code: form.unit_code,
          level: form.level,
          question_count: form.question_count,
          cadence_days: form.cadence_days,
          lesson_ids: form.lesson_ids,
          lo_codes: loCodes,
          is_active: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create set.');
      }

      setForm((prev) => ({
        ...initialForm,
        unit_code: prev.unit_code,
      }));
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create set.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    setError(null);
    try {
      const response = await authedFetch(`/api/v1/quiz-sets/${setId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete set.');
      }
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete set.');
    }
  };

  const handleRunSet = async (setItem: StudentQuizSet) => {
    setError(null);
    try {
      const response = await authedFetch(`/api/v1/quiz-sets/${setItem.id}/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: setItem.question_count }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to build quiz.');
      }
      const questions = Array.isArray(data.questions) ? (data.questions as Question[]) : [];
      if (questions.length === 0) {
        throw new Error('No questions available for this set yet.');
      }
      setRunningSet(setItem);
      setQuizQuestions(questions);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run set.');
    }
  };

  if (quizQuestions && runningSet) {
    return (
      <Quiz
        questions={quizQuestions}
        section={`My Set: ${runningSet.title}`}
        context="practice"
        quizSetId={runningSet.id}
        onBack={() => {
          setQuizQuestions(null);
          setRunningSet(null);
          void loadAll();
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Quiz Sets</h1>
          <div className="flex gap-2">
            <Link href={courseHref('/quiz')} className="rounded border border-slate-300 px-3 py-2 text-sm">
              Question Bank
            </Link>
            <Link href={courseHref('/')} className="rounded border border-slate-300 px-3 py-2 text-sm">
              Back Home
            </Link>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-700">
            Active review queue: <span className="font-semibold">{activeQueueCount}</span>
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Wrong answers are LLM-reviewed and added here. Correct answers resolve and drop out of future injections.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Create Quiz Set</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              placeholder="Set title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded border border-slate-300 px-3 py-2"
            />
            <select
              value={form.unit_code}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  unit_code: event.target.value,
                  lesson_ids: [],
                }))
              }
              className="rounded border border-slate-300 px-3 py-2"
            >
              {units.map((unit) => (
                <option key={unit.unit_code} value={unit.unit_code}>
                  {unit.unit_code} - {unit.unit_title}
                </option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(event) => setForm((prev) => ({ ...prev, level: Number(event.target.value) as 2 | 3 }))}
              className="rounded border border-slate-300 px-3 py-2"
            >
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </select>
            <select
              multiple
              value={form.lesson_ids}
              onChange={(event) => {
                const selected = Array.from(event.currentTarget.selectedOptions).map((option) => option.value);
                setForm((prev) => ({ ...prev, lesson_ids: selected }));
              }}
              className="min-h-28 rounded border border-slate-300 px-3 py-2"
            >
              {lessonsForSelectedUnit.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.id} - {lesson.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={100}
              value={form.question_count}
              onChange={(event) => setForm((prev) => ({ ...prev, question_count: Number(event.target.value || 20) }))}
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Question count"
            />
            <input
              type="number"
              min={1}
              max={60}
              value={form.cadence_days}
              onChange={(event) => setForm((prev) => ({ ...prev, cadence_days: Number(event.target.value || 3) }))}
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Cadence days"
            />
            <input
              placeholder="LO codes (comma separated, optional)"
              value={form.lo_codes}
              onChange={(event) => setForm((prev) => ({ ...prev, lo_codes: event.target.value }))}
              className="rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {selectedLessons.length > 0 ? (
              <p>
                Selected lessons: {selectedLessons.map((lesson) => `${lesson.id} - ${lesson.title}`).join(', ')}
              </p>
            ) : (
              <p>
                Lessons in unit: {lessonsForSelectedUnit.length > 0
                  ? lessonsForSelectedUnit.map((lesson) => lesson.title).join(', ')
                  : 'No lessons found for this unit.'}
              </p>
            )}
          </div>
          <button
            onClick={() => void handleCreateSet()}
            disabled={saving || unauthorized || !form.title.trim() || !form.unit_code}
            className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Create Set'}
          </button>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Your Sets</h2>
          {loading && <p className="text-sm text-slate-600">Loading...</p>}
          {!loading && sets.length === 0 && <p className="text-sm text-slate-600">No sets yet.</p>}
          <div className="space-y-3">
            {sets.map((setItem) => (
              <div key={setItem.id} className="rounded border border-slate-200 p-3">
                <p className="font-medium">{setItem.title}</p>
                <p className="text-sm text-slate-600">
                  Unit {setItem.unit_code} | Level {setItem.level} | {setItem.question_count} questions
                </p>
                <p className="text-sm text-slate-600">
                  Lessons: {setItem.lesson_ids?.length > 0 ? setItem.lesson_ids.join(', ') : 'All lessons in unit'}
                </p>
                <p className="text-sm text-slate-600">
                  LOs: {setItem.lo_codes.length > 0 ? setItem.lo_codes.join(', ') : 'All in unit'}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => void handleRunSet(setItem)}
                    className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white"
                  >
                    Run
                  </button>
                  <button
                    onClick={() => void handleDeleteSet(setItem.id)}
                    className="rounded border border-rose-300 px-3 py-1.5 text-sm text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </section>
        )}

        {unauthorized && (
          <section className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            Sign in to create and run personal quiz sets.
          </section>
        )}
      </div>
    </main>
  );
}
