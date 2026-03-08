'use client';

import { useState } from 'react';
import MatchingGame from '@/components/learning/microbreaks/games/MatchingGame';
import SortingGame from '@/components/learning/microbreaks/games/SortingGame';
import AdvancedTextGame from '@/components/learning/microbreaks/games/AdvancedTextGame';
import QuickWinSprintGame from '@/components/learning/microbreaks/games/QuickWinSprintGame';
import {
  DiagnosisRankedGameContent,
  FillGapGameContent,
  FormulaBuildGameContent,
  IsCorrectWhyGameContent,
  MatchingGameContent,
  QuickWinGameContent,
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

const quickWinContent: QuickWinGameContent = {
  breakType: 'game',
  gameType: 'quick-win',
  duration: 33,
  questions: [
    { question: 'What is the SI unit of current?', answer: 'ampere' },
    { question: 'What is the SI unit of voltage?', answer: 'volt' },
    { question: 'What does R represent in Ohm\'s law?', answer: 'resistance' },
    { question: 'What is 12 divided by 3?', answer: '4' },
    { question: 'Name the device that protects from fault current.', answer: 'fuse' },
  ],
};

const isCorrectWhyContent: IsCorrectWhyGameContent = {
  breakType: 'game',
  gameType: 'is-correct-why',
  prompt: 'Decide if the statement is correct, then pick the best reason.',
  statement: 'In a parallel circuit, each branch has the same voltage as the supply.',
  isCorrect: true,
  reasons: [
    'Branches are connected across the same two supply points.',
    'Current is always equal in every branch regardless of resistance.',
    'Voltage is consumed by the first component in the circuit.',
    'Parallel circuits force one single current path through all loads.',
  ],
  correctReasonIndex: 0,
  explanation: 'Parallel branches are across the same potential difference, so branch voltages match the supply.',
  timerSeconds: 45,
  questions: [
    {
      statement: 'In a series circuit, current is the same at every point.',
      isCorrect: true,
      reasons: [
        'A series circuit has only one path for current.',
        'Series circuits always split current into branches.',
        'Current is consumed by the first component.',
        'The battery forces different current in each resistor.',
      ],
      correctReasonIndex: 0,
      explanation: 'With one path only, the same current flows through every component.',
    },
    {
      statement: 'Increasing resistance at fixed voltage increases current.',
      isCorrect: false,
      reasons: [
        'From I = V/R, higher resistance gives lower current when voltage is fixed.',
        'Resistance raises current to keep power constant.',
        'Current and resistance always rise together.',
        'Only AC circuits follow Ohm’s law.',
      ],
      correctReasonIndex: 0,
      explanation: 'Ohm’s law shows current is inversely proportional to resistance for fixed voltage.',
    },
    {
      statement: 'Electrical power can be calculated using P = V × I.',
      isCorrect: true,
      reasons: [
        'Power equals voltage multiplied by current.',
        'Power always equals voltage divided by current.',
        'Power has no relationship to current.',
        'This formula applies only to motors.',
      ],
      correctReasonIndex: 0,
      explanation: 'P = V × I is a standard power relationship for electrical circuits.',
    },
  ],
};

const diagnosisRankedContent: DiagnosisRankedGameContent = {
  breakType: 'game',
  gameType: 'diagnosis-ranked',
  prompt: 'Rank the best and second-best immediate actions.',
  instructions: 'Choose your 1st choice, then your 2nd choice, then check.',
  timerSeconds: 50,
  scenario:
    'A learner reports: one lamp failed and all other lamps in the same loop went off. What are the best two immediate diagnostic steps?',
  options: [
    'Check for an open-circuit fault in the series path.',
    'Verify supply voltage at the source terminals.',
    'Assume a parallel branch fault and replace all lamps.',
    'Increase fuse rating to force current through.',
    'Bypass all protective devices and re-test.',
  ],
  correctRankedIndices: [0, 1],
  rationale:
    'In a series path, one open circuit can stop current everywhere. After identifying likely open-circuit behavior, confirm source voltage before deeper component-level checks.',
};

const fillGapQuestions: FillGapGameContent[] = [
  {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Fill Gap 1/5: Series basics',
    instructions: 'Tap each blank and choose the best option.',
    timerSeconds: 45,
    textTemplate: 'In a {{circuitType}} circuit, current has {{paths}} path(s) and the lamps are connected in {{layout}}.',
    gaps: [
      {
        id: 'circuitType',
        options: ['series', 'parallel', 'radial', 'ring'],
        correctOptionIndex: 0,
      },
      {
        id: 'paths',
        options: ['one', 'two', 'many', 'zero'],
        correctOptionIndex: 0,
      },
      {
        id: 'layout',
        options: ['a single loop', 'separate branches', 'star-delta', 'mesh only'],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Fill Gap 2/5: Parallel basics',
    instructions: 'Tap each blank and choose the best option.',
    timerSeconds: 45,
    textTemplate: 'In a {{circuitType}} circuit, each branch has the same {{electricalQuantity}} and loads are wired on {{branchType}} branches.',
    gaps: [
      {
        id: 'circuitType',
        options: ['parallel', 'series', 'ring', 'radial'],
        correctOptionIndex: 0,
      },
      {
        id: 'electricalQuantity',
        options: ['voltage', 'resistance only', 'frequency drift', 'impedance spike'],
        correctOptionIndex: 0,
      },
      {
        id: 'branchType',
        options: ['separate', 'shared single', 'floating', 'temporary'],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Fill Gap 3/5: Protection',
    instructions: 'Tap each blank and choose the best option.',
    timerSeconds: 45,
    textTemplate: 'A fuse protects a circuit by melting when {{cause}} exceeds its rating, which {{action}} the circuit.',
    gaps: [
      {
        id: 'cause',
        options: ['current', 'voltage color', 'wire label', 'frequency name'],
        correctOptionIndex: 0,
      },
      {
        id: 'action',
        options: ['disconnects', 'amplifies', 'stores', 'balances'],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Fill Gap 4/5: Ohm\'s law',
    instructions: 'Tap each blank and choose the best option.',
    timerSeconds: 45,
    textTemplate: 'Ohm\'s law states that {{quantity1}} equals current multiplied by {{quantity2}}.',
    gaps: [
      {
        id: 'quantity1',
        options: ['voltage', 'power', 'frequency', 'capacitance'],
        correctOptionIndex: 0,
      },
      {
        id: 'quantity2',
        options: ['resistance', 'inductance', 'temperature', 'admittance'],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Fill Gap 5/5: Test safety',
    instructions: 'Tap each blank and choose the best option.',
    timerSeconds: 45,
    textTemplate: 'Before testing for dead, first {{step1}} the tester on a known live source, then {{step2}} after the test.',
    gaps: [
      {
        id: 'step1',
        options: ['prove', 'store', 'disable', 'charge'],
        correctOptionIndex: 0,
      },
      {
        id: 'step2',
        options: ['re-prove', 'rewire', 'repaint', 'relabel'],
        correctOptionIndex: 0,
      },
    ],
  },
];

const formulaBuildContent: FormulaBuildGameContent = {
  breakType: 'game',
  gameType: 'formula-build',
  prompt: 'Build formula 1: Electrical power.',
  tokens: ['P', '=', 'V', '×', 'I', '+', 'R'],
  correctSequence: ['P', '=', 'V', '×', 'I'],
  timerSeconds: 33,
  questions: [
    {
      prompt: 'Build formula 1: Electrical power.',
      tokens: ['P', '=', 'V', '×', 'I', '+', 'R'],
      correctSequence: ['P', '=', 'V', '×', 'I'],
      timerSeconds: 33,
    },
    {
      prompt: 'Build formula 2: Ohm\'s law.',
      tokens: ['V', '=', 'I', '×', 'R', '+', 'P'],
      correctSequence: ['V', '=', 'I', '×', 'R'],
      timerSeconds: 33,
    },
    {
      prompt: 'Build formula 3: Electrical energy.',
      tokens: ['E', '=', 'P', '×', 't', '+', 'I'],
      correctSequence: ['E', '=', 'P', '×', 't'],
      timerSeconds: 33,
    },
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
  const [quickWinResult, setQuickWinResult] = useState<ResultState>({ status: 'idle' });
  const [formulaBuildResult, setFormulaBuildResult] = useState<ResultState>({ status: 'idle' });
  const [fillGapResult, setFillGapResult] = useState<ResultState>({ status: 'idle' });
  const [isCorrectWhyResult, setIsCorrectWhyResult] = useState<ResultState>({ status: 'idle' });
  const [diagnosisRankedResult, setDiagnosisRankedResult] = useState<ResultState>({ status: 'idle' });
  const [matchingKey, setMatchingKey] = useState(0);
  const [sortingKey, setSortingKey] = useState(0);
  const [sequencingKey, setSequencingKey] = useState(0);
  const [quickWinKey, setQuickWinKey] = useState(0);
  const [formulaBuildKey, setFormulaBuildKey] = useState(0);
  const [fillGapKey, setFillGapKey] = useState(0);
  const [isCorrectWhyKey, setIsCorrectWhyKey] = useState(0);
  const [diagnosisRankedKey, setDiagnosisRankedKey] = useState(0);
  const [fillGapIndex, setFillGapIndex] = useState(0);
  const [fillGapCompleted, setFillGapCompleted] = useState<Array<{ score?: number; accuracy?: number }>>([]);
  const [fillGapHandledIndex, setFillGapHandledIndex] = useState<number | null>(null);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Completed Game Replacements</h1>
        <p className="text-sm text-slate-600">
          Test page for in-app microbreak ports: Matching, Sorting, Sequencing, Is Correct Why, Diagnosis Ranked, Quick Win, Fill Gap, and Formula Build.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
        <ResultBadge label="Matching" result={matchingResult} />
        <ResultBadge label="Sorting" result={sortingResult} />
        <ResultBadge label="Sequencing" result={sequencingResult} />
        <ResultBadge label="Is Correct Why" result={isCorrectWhyResult} />
        <ResultBadge label="Diagnosis Ranked" result={diagnosisRankedResult} />
        <ResultBadge label="Quick Win" result={quickWinResult} />
        <ResultBadge label="Formula Build" result={formulaBuildResult} />
        <ResultBadge label="Fill Gap" result={fillGapResult} />
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

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Fill Gap</h2>
          <button
            onClick={() => {
              setFillGapKey((k) => k + 1);
              setFillGapIndex(0);
              setFillGapCompleted([]);
              setFillGapHandledIndex(null);
              setFillGapResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Fill Gap
          </button>
        </div>
        <div className="text-xs text-slate-500">
          {fillGapResult.status === 'completed'
            ? `Question ${fillGapQuestions.length} of ${fillGapQuestions.length}`
            : `Question ${fillGapIndex + 1} of ${fillGapQuestions.length}`}
        </div>
        {fillGapResult.status === 'completed' ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <h3 className="text-2xl font-bold text-emerald-800">Quiz finished</h3>
            <p className="mt-2 text-sm text-emerald-700">
              Final score: {fillGapResult.score ?? 0} | Accuracy: {(fillGapResult.accuracy ?? 0).toFixed(1)}%
            </p>
            <button
              onClick={() => {
                setFillGapKey((k) => k + 1);
                setFillGapIndex(0);
                setFillGapCompleted([]);
                setFillGapHandledIndex(null);
                setFillGapResult({ status: 'idle' });
              }}
              className="mt-4 rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Play Fill Gap Again
            </button>
          </div>
        ) : (
          <AdvancedTextGame
            key={`fill-gap-${fillGapKey}-${fillGapIndex}`}
            content={fillGapQuestions[fillGapIndex]}
            onComplete={(score, accuracy) => {
              // Ignore duplicate completion events for the same visible question.
              if (fillGapHandledIndex === fillGapIndex) return;
              setFillGapHandledIndex(fillGapIndex);

              const nextCompleted = [...fillGapCompleted, { score, accuracy }];
              setFillGapCompleted(nextCompleted);

              if (fillGapIndex < fillGapQuestions.length - 1) {
                setFillGapIndex(fillGapIndex + 1);
                return;
              }

              const totalScore = nextCompleted.reduce((sum, r) => sum + (r.score ?? 0), 0);
              const totalGaps = fillGapQuestions.reduce((sum, q) => sum + q.gaps.length, 0);
              const overallAccuracy = totalGaps > 0 ? (totalScore / totalGaps) * 100 : 0;
              setFillGapResult({ status: 'completed', score: totalScore, accuracy: overallAccuracy });
            }}
            onSkip={() => {
              setFillGapHandledIndex(fillGapIndex);
              if (fillGapIndex < fillGapQuestions.length - 1) {
                setFillGapIndex((i) => i + 1);
                return;
              }
              setFillGapResult({ status: 'skipped' });
            }}
          />
        )}
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Is Correct Why</h2>
          <button
            onClick={() => {
              setIsCorrectWhyKey((k) => k + 1);
              setIsCorrectWhyResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Is Correct Why
          </button>
        </div>
        <AdvancedTextGame
          key={`is-correct-why-${isCorrectWhyKey}`}
          content={isCorrectWhyContent}
          onComplete={(score, accuracy) => setIsCorrectWhyResult({ status: 'completed', score, accuracy })}
          onSkip={() => setIsCorrectWhyResult({ status: 'skipped' })}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Diagnosis Ranked</h2>
          <button
            onClick={() => {
              setDiagnosisRankedKey((k) => k + 1);
              setDiagnosisRankedResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Diagnosis Ranked
          </button>
        </div>
        <AdvancedTextGame
          key={`diagnosis-ranked-${diagnosisRankedKey}`}
          content={diagnosisRankedContent}
          onComplete={(score, accuracy) => setDiagnosisRankedResult({ status: 'completed', score, accuracy })}
          onSkip={() => setDiagnosisRankedResult({ status: 'skipped' })}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Quick Win</h2>
          <button
            onClick={() => {
              setQuickWinKey((k) => k + 1);
              setQuickWinResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Quick Win
          </button>
        </div>
        <QuickWinSprintGame
          key={`quick-win-${quickWinKey}`}
          content={quickWinContent}
          onComplete={(score, accuracy) => setQuickWinResult({ status: 'completed', score, accuracy })}
          onSkip={() => setQuickWinResult({ status: 'skipped' })}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Formula Build</h2>
          <button
            onClick={() => {
              setFormulaBuildKey((k) => k + 1);
              setFormulaBuildResult({ status: 'idle' });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Formula Build
          </button>
        </div>
        <AdvancedTextGame
          key={`formula-build-${formulaBuildKey}`}
          content={formulaBuildContent}
          onComplete={(score, accuracy) => setFormulaBuildResult({ status: 'completed', score, accuracy })}
          onSkip={() => setFormulaBuildResult({ status: 'skipped' })}
        />
      </section>
    </main>
  );
}
