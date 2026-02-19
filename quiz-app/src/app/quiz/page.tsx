'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import type { Question } from '@/data/questions';

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

export default function QuizPage() {
  const [units, setUnits] = useState<CatalogUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<2 | 3>(2);
  const [los, setLos] = useState<UnitLo[]>([]);
  const [selectedLoCode, setSelectedLoCode] = useState('');
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);
  const [selectionSummary, setSelectionSummary] = useState<string>('');

  const selectedLo = useMemo(() => los.find((lo) => lo.lo_code === selectedLoCode) ?? null, [los, selectedLoCode]);

  const canBuild = useMemo(() => {
    if (!selectedUnit || loading) return false;
    return true;
  }, [loading, selectedUnit]);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/quiz/catalog', { cache: 'no-store' });
        const data = await response.json();
        const list = (Array.isArray(data.units) ? data.units : []) as CatalogUnit[];
        setUnits(list);
        if (list.length > 0) setSelectedUnit(list[0].unit_code);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load quiz catalog.');
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedUnit) return;
    void (async () => {
      try {
        const response = await fetch(`/api/quiz/units/${selectedUnit}/los`, { cache: 'no-store' });
        const data = await response.json();
        const list = (Array.isArray(data.los) ? data.los : []) as UnitLo[];
        setLos(list);
        setSelectedLoCode('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load learning outcomes.');
      }
    })();
  }, [selectedUnit]);

  const buildQuiz = async () => {
    if (!canBuild) return;
    setLoading(true);
    setError(null);
    try {
      const mode: 'unit' | 'lo' = selectedLoCode ? 'lo' : 'unit';
      const response = await fetch('/api/quiz/build', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit_code: selectedUnit,
          level: selectedLevel,
          mode,
          lo_codes: mode === 'lo' ? [selectedLoCode] : undefined,
          count,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to build quiz.');
      }
      const questions = (Array.isArray(data.questions) ? data.questions : []) as Question[];
      if (questions.length === 0) {
        throw new Error('No approved MCQ questions available for this selection.');
      }
      setQuizQuestions(questions);
      setSelectionSummary(
        `Unit ${selectedUnit}, Level ${selectedLevel}, ${mode === 'unit' ? 'all LOs' : selectedLoCode}, ${questions.length} questions`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to build quiz.');
    } finally {
      setLoading(false);
    }
  };

  if (quizQuestions) {
    return (
      <Quiz
        questions={quizQuestions}
        section={selectionSummary}
        onBack={() => setQuizQuestions(null)}
        enableConfidence={false}
        enableImmediateFeedback
        enableTypedRetries={false}
        context="practice"
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Question Bank Practice</h1>
          <Link href="/" className="rounded border border-slate-300 px-3 py-2 text-sm">
            Back Home
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <label className="block text-sm font-medium">Unit</label>
          <select
            className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
            value={selectedUnit}
            onChange={(event) => setSelectedUnit(event.target.value)}
          >
            {units.map((unit) => (
              <option key={unit.unit_code} value={unit.unit_code}>
                Unit {unit.unit_code} - {unit.unit_title} ({unit.approved_question_count} approved)
              </option>
            ))}
          </select>
        </section>

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
          <label className="text-sm font-medium">
            Level
            <select
              className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(Number(event.target.value) as 2 | 3)}
            >
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Learning Outcome
            <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={selectedLoCode} onChange={(event) => setSelectedLoCode(event.target.value)}>
              <option value="">All LOs in unit</option>
              {los.map((lo) => (
                <option key={lo.lo_code} value={lo.lo_code}>
                  {lo.lo_code} ({lo.approved_question_count} approved)
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Questions
            <input
              type="number"
              min={1}
              max={100}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-2"
              value={count}
              onChange={(event) => setCount(Number.parseInt(event.target.value || '20', 10))}
            />
          </label>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium">LO Description</p>
          {selectedLo ? (
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p>
                <span className="font-semibold">{selectedLo.lo_code}</span> ({selectedLo.approved_question_count} approved)
              </p>
              <p className="mt-1 text-slate-700">{selectedLo.lo_text_preview}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {los.map((lo) => (
                <div key={lo.lo_code} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p>
                    <span className="font-semibold">{lo.lo_code}</span> ({lo.approved_question_count} approved)
                  </p>
                  <p className="mt-1 text-slate-700">{lo.lo_text_preview}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && (
          <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </section>
        )}

        <button
          onClick={() => void buildQuiz()}
          disabled={!canBuild}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Building Quiz...' : 'Build Quiz'}
        </button>
      </div>
    </main>
  );
}
