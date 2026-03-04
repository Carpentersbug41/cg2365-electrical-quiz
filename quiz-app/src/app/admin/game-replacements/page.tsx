'use client';

import { useState } from 'react';
import MatchingGame from '@/components/learning/microbreaks/games/MatchingGame';
import SortingGame from '@/components/learning/microbreaks/games/SortingGame';
import AdvancedTextGame from '@/components/learning/microbreaks/games/AdvancedTextGame';
import {
  MatchingGameContent,
  SortingGameContent,
  SequencingGameContent,
} from '@/data/lessons/types';

type ResultState = {
  status: 'idle' | 'completed' | 'skipped';
  score?: number;
  accuracy?: number;
};

const matchingContent: MatchingGameContent = {
  breakType: 'game',
  gameType: 'matching',
  duration: 75,
  pairs: [
    { left: 'Voltage', right: 'Potential difference between two points' },
    { left: 'Current', right: 'Rate of flow of charge' },
    { left: 'Resistance', right: 'Opposition to current flow' },
    { left: 'Power', right: 'Rate of electrical energy transfer' },
  ],
};

const sortingContent: SortingGameContent = {
  breakType: 'game',
  gameType: 'sorting',
  duration: 90,
  buckets: ['Series Circuit', 'Parallel Circuit'],
  items: [
    { text: 'Single current path', correctBucket: 0 },
    { text: 'Multiple current paths', correctBucket: 1 },
    { text: 'One lamp fails, all fail', correctBucket: 0 },
    { text: 'One lamp fails, others stay on', correctBucket: 1 },
    { text: 'Same current through each load', correctBucket: 0 },
    { text: 'Voltage shared equally across branches', correctBucket: 1 },
  ],
};

const sequencingContent: SequencingGameContent = {
  breakType: 'game',
  gameType: 'sequencing',
  prompt: 'Order the safe isolation process',
  instructions: 'Arrange each step in correct sequence, then check your answer.',
  timerSeconds: 60,
  steps: [
    'Lock off the isolator',
    'Identify the correct circuit',
    'Prove your voltage tester on a known live source',
    'Verify dead at the point of work',
    'Re-prove your tester on a known live source',
  ],
  correctOrder: [
    'Identify the correct circuit',
    'Lock off the isolator',
    'Prove your voltage tester on a known live source',
    'Verify dead at the point of work',
    'Re-prove your tester on a known live source',
  ],
};

function ResultBadge({ label, result }: { label: string; result: ResultState }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
      <span className="font-semibold">{label}:</span>{' '}
      {result.status === 'idle'
        ? 'Not attempted'
        : result.status === 'skipped'
          ? 'Skipped'
          : `Completed (score: ${result.score ?? 0}, accuracy: ${(result.accuracy ?? 0).toFixed(1)}%)`}
    </div>
  );
}

export default function GameReplacementsPage() {
  const [matchingResult, setMatchingResult] = useState<ResultState>({ status: 'idle' });
  const [sortingResult, setSortingResult] = useState<ResultState>({ status: 'idle' });
  const [sequencingResult, setSequencingResult] = useState<ResultState>({ status: 'idle' });

  const [matchingKey, setMatchingKey] = useState(0);
  const [sortingKey, setSortingKey] = useState(0);
  const [sequencingKey, setSequencingKey] = useState(0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Completed Game Replacements</h1>
        <p className="text-sm text-slate-600">
          Test page for in-app microbreak ports: Matching, Sorting, and Sequencing.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <ResultBadge label="Matching" result={matchingResult} />
        <ResultBadge label="Sorting" result={sortingResult} />
        <ResultBadge label="Sequencing" result={sequencingResult} />
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Matching</h2>
          <button
            onClick={() => {
              setMatchingKey((k) => k + 1);
              setMatchingResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Matching
          </button>
        </div>
        <MatchingGame
          key={`matching-${matchingKey}`}
          content={matchingContent}
          onComplete={(score, accuracy) => setMatchingResult({ status: 'completed', score, accuracy })}
          onSkip={() => setMatchingResult({ status: 'skipped' })}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Sorting</h2>
          <button
            onClick={() => {
              setSortingKey((k) => k + 1);
              setSortingResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Sorting
          </button>
        </div>
        <SortingGame
          key={`sorting-${sortingKey}`}
          content={sortingContent}
          onComplete={(score, accuracy) => setSortingResult({ status: 'completed', score, accuracy })}
          onSkip={() => setSortingResult({ status: 'skipped' })}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Sequencing</h2>
          <button
            onClick={() => {
              setSequencingKey((k) => k + 1);
              setSequencingResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Sequencing
          </button>
        </div>
        <AdvancedTextGame
          key={`sequencing-${sequencingKey}`}
          content={sequencingContent}
          onComplete={(score, accuracy) => setSequencingResult({ status: 'completed', score, accuracy })}
          onSkip={() => setSequencingResult({ status: 'skipped' })}
        />
      </section>
    </main>
  );
}
