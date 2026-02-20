'use client';

import { useEffect, useMemo, useState } from 'react';
import GameWrapper from '../GameWrapper';
import {
  ClassifyTwoBinsGameContent,
  DiagnosisRankedGameContent,
  EliminationGameContent,
  FillGapGameContent,
  FormulaBuildGameContent,
  IsCorrectWhyGameContent,
  ScenarioMatchGameContent,
  SequencingGameContent,
  TapTheLineGameContent,
  TapTheWordGameContent,
} from '@/data/lessons/types';
import { playClickSound, playSound } from '@/lib/microbreaks/celebrationEffects';

type AdvancedGameContent =
  | SequencingGameContent
  | FillGapGameContent
  | IsCorrectWhyGameContent
  | DiagnosisRankedGameContent
  | ClassifyTwoBinsGameContent
  | ScenarioMatchGameContent
  | FormulaBuildGameContent
  | TapTheLineGameContent
  | TapTheWordGameContent
  | EliminationGameContent;

interface AdvancedTextGameProps {
  content: AdvancedGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function gameTitle(type: AdvancedGameContent['gameType']): string {
  return type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function defaultInstruction(type: AdvancedGameContent['gameType']): string {
  switch (type) {
    case 'sequencing':
      return 'Use Up and Down to order the steps, then tap Check.';
    case 'fill-gap':
      return 'Choose one option for each gap, then tap Check.';
    case 'is-correct-why':
      return 'Pick Correct or Incorrect, choose the best reason, then check.';
    case 'diagnosis-ranked':
      return 'Choose the best 1st and 2nd options, then tap Check.';
    case 'classify-two-bins':
      return 'Place each item in the left or right bin, then tap Check.';
    case 'scenario-match':
      return 'Pick the best answer for each scenario, then tap Check.';
    case 'formula-build':
      return 'Tap tokens to build the formula, then tap Check.';
    case 'tap-the-line':
      return 'Tap the correct line and then tap Check.';
    case 'tap-the-word':
      return 'Tap the correct word and then tap Check.';
    case 'elimination':
      return 'Eliminate weak options, choose your final answer, then tap Check.';
    default:
      return 'Follow the prompt and tap Check.';
  }
}

function tone(checked: boolean, isCorrect: boolean, isSelected: boolean): string {
  if (checked && isCorrect) return 'microbreak-correct border-green-500 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200';
  if (checked && isSelected && !isCorrect) return 'microbreak-wrong border-red-500 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200';
  if (!checked && isSelected) return 'border-blue-500 bg-blue-100 text-blue-900 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-200';
  return 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800';
}

export default function AdvancedTextGame({ content, onComplete, onSkip }: AdvancedTextGameProps) {
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);

  const soundEnabled = content.enableSound !== false;

  const finish = (score: number, accuracy: number) => {
    if (done) return;
    setDone(true);
    if (soundEnabled) {
      if (accuracy >= 99) playSound('success', 0.6);
      else if (accuracy >= 50) playSound('success', 0.3);
      else playSound('failure', 0.35);
    }
    onComplete(score, clampPercent(accuracy));
  };

  useEffect(() => {
    if (done || timeLeft === null || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [done, timeLeft]);

  if (timeLeft !== null && timeLeft <= 0 && !done) {
    finish(0, 0);
  }

  return (
    <GameWrapper
      title={gameTitle(content.gameType)}
      duration={content.timerSeconds ?? 30}
      instruction={content.instructions ?? defaultInstruction(content.gameType)}
      motionPreset="soft"
      onComplete={onComplete}
      onSkip={onSkip}
      disableTimer
      disableCelebration
    >
      {(wrapperComplete) => (
        <div className="space-y-3">
          {content.prompt ? <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{content.prompt}</p> : null}
          {timeLeft !== null ? (
            <div className={`text-xs font-semibold ${timeLeft <= 8 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
              Time left: {timeLeft}s
            </div>
          ) : null}
          <AdvancedGameBody
            content={content}
            done={done}
            soundEnabled={soundEnabled}
            onDone={(score, accuracy) => {
              finish(score, accuracy);
              wrapperComplete(score, accuracy);
            }}
          />
        </div>
      )}
    </GameWrapper>
  );
}

function SequencingGame({ content, done, soundEnabled, onDone }: { content: SequencingGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [steps, setSteps] = useState(content.steps);
  const [checked, setChecked] = useState(false);
  const isCorrect = useMemo(() => steps.length === content.correctOrder.length && steps.every((s, i) => s === content.correctOrder[i]), [steps, content.correctOrder]);

  const move = (index: number, delta: -1 | 1) => {
    if (done || checked) return;
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= steps.length) return;
    if (soundEnabled) playClickSound(0.2);
    const next = [...steps];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setSteps(next);
  };

  return (
    <div className="space-y-2">
      {steps.map((step, idx) => (
        <div key={`${step}-${idx}`} className={`flex items-center justify-between rounded border p-2 text-sm ${checked ? (isCorrect ? 'microbreak-correct border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 'microbreak-wrong border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
          <span>{step}</span>
          <div className="flex gap-1">
            <button disabled={checked} onClick={() => move(idx, -1)} className="rounded border px-2 py-1 text-xs">Up</button>
            <button disabled={checked} onClick={() => move(idx, 1)} className="rounded border px-2 py-1 text-xs">Down</button>
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function FillGapGame({ content, soundEnabled, onDone }: { content: FillGapGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const total = content.gaps.length;
  const correct = content.gaps.reduce((sum, gap) => sum + (answers[gap.id] === gap.correctOptionIndex ? 1 : 0), 0);

  return (
    <div className="space-y-2">
      <p className="text-sm">{content.textTemplate}</p>
      {content.gaps.map((gap) => (
        <div key={gap.id} className="rounded border border-gray-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-700">
          <p className="mb-1 text-xs font-semibold">Gap {gap.id}</p>
          <div className="flex flex-wrap gap-1">
            {gap.options.map((opt, idx) => {
              const selected = answers[gap.id] === idx;
              return (
                <button key={`${gap.id}-${opt}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setAnswers((prev) => ({ ...prev, [gap.id]: idx })); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, idx === gap.correctOptionIndex, selected)}`}>{opt}</button>
              );
            })}
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(correct, (correct / Math.max(1, total)) * 100); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function IsCorrectWhyGame({ content, soundEnabled, onDone }: { content: IsCorrectWhyGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const score = choice === content.isCorrect && reason === content.correctReasonIndex ? 1 : choice === content.isCorrect ? 0.5 : 0;

  return (
    <div className="space-y-2">
      <p className="rounded border border-gray-300 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-700">{content.statement}</p>
      <div className="flex gap-2">
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setChoice(true); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, content.isCorrect, choice === true)}`}>Correct</button>
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setChoice(false); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, !content.isCorrect, choice === false)}`}>Incorrect</button>
      </div>
      <div className="space-y-1">
        {content.reasons.map((r, idx) => (
          <button key={`${r}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setReason(idx); }} className={`block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctReasonIndex, reason === idx)}`}>{r}</button>
        ))}
      </div>
      {checked && content.explanation ? <p className="text-xs text-gray-600 dark:text-slate-400">{content.explanation}</p> : null}
      <button disabled={checked || choice === null || reason === null} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(score, score * 100); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function DiagnosisRankedGame({ content, soundEnabled, onDone }: { content: DiagnosisRankedGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [a, b] = content.correctRankedIndices;
  let score = 0;
  if (first === a && second === b) score = 1;
  else if (first === b && second === a) score = 0.5;
  else if (first === a) score = 0.5;

  return (
    <div className="space-y-2">
      <p className="rounded border border-gray-300 bg-white p-2 text-xs dark:border-slate-600 dark:bg-slate-700">{content.scenario}</p>
      {content.options.map((o, idx) => {
        const selected = first === idx || second === idx;
        const correct = idx === a || idx === b;
        return (
          <button key={`${o}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); if (first === null) setFirst(idx); else if (second === null && idx !== first) setSecond(idx); }} className={`block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, correct, selected)}`}>
            {o} {first === idx ? '(1st)' : second === idx ? '(2nd)' : ''}
          </button>
        );
      })}
      {checked && content.rationale ? <p className="text-xs text-gray-600 dark:text-slate-400">{content.rationale}</p> : null}
      <button disabled={checked || first === null || second === null} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(score, score * 100); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function ClassifyTwoBinsGame({ content, soundEnabled, onDone }: { content: ClassifyTwoBinsGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [assigned, setAssigned] = useState<Record<string, 'left' | 'right'>>({});
  const [checked, setChecked] = useState(false);
  const total = content.items.length;
  const correct = content.items.reduce((sum, i) => sum + (assigned[i.text] === i.correctBin ? 1 : 0), 0);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <div className="rounded border border-indigo-300 bg-indigo-100 p-2 text-center text-indigo-900 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">{content.leftLabel}</div>
        <div className="rounded border border-indigo-300 bg-indigo-100 p-2 text-center text-indigo-900 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">{content.rightLabel}</div>
      </div>
      {content.items.map((item) => (
        <div key={item.text} className={`flex items-center justify-between rounded border p-2 text-xs ${checked ? (assigned[item.text] === item.correctBin ? 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30' : 'border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-900/30') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
          <span>{item.text}</span>
          <div className="flex gap-1">
            <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [item.text]: 'left' })); }} className="rounded border px-2 py-1">Left</button>
            <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [item.text]: 'right' })); }} className="rounded border px-2 py-1">Right</button>
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(correct, (correct / Math.max(1, total)) * 100); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function ScenarioMatchGame({ content, soundEnabled, onDone }: { content: ScenarioMatchGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [assigned, setAssigned] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const answers = useMemo(() => [...new Set([...content.pairs.map((p) => p.answer), ...(content.distractors ?? [])])], [content]);
  const total = content.pairs.length;
  const correct = content.pairs.reduce((sum, p, idx) => sum + (assigned[idx] === p.answer ? 1 : 0), 0);

  return (
    <div className="space-y-2">
      {content.pairs.map((pair, idx) => (
        <div key={`${pair.scenario}-${idx}`} className={`rounded border p-2 text-xs ${checked ? (assigned[idx] === pair.answer ? 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30' : 'border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-900/30') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
          <p className="mb-1">{pair.scenario}</p>
          <select disabled={checked} value={assigned[idx] ?? ''} onChange={(e) => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [idx]: e.target.value })); }} className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">
            <option value="">Select answer</option>
            {answers.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      ))}
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(correct, (correct / Math.max(1, total)) * 100); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function FormulaBuildGame({ content, soundEnabled, onDone }: { content: FormulaBuildGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = sequence.length === content.correctSequence.length && sequence.every((t, i) => t === content.correctSequence[i]);

  return (
    <div className="space-y-2">
      <div className={`min-h-10 rounded border p-2 text-xs ${checked ? (isCorrect ? 'border-green-500 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200' : 'border-red-500 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
        {sequence.join(' ') || 'Build the formula here'}
      </div>
      <div className="flex flex-wrap gap-1">
        {content.tokens.map((token, idx) => (
          <button key={`${token}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSequence((prev) => [...prev, token]); }} className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">{token}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSequence([]); }} className="rounded border border-gray-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800">Clear</button>
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
      </div>
    </div>
  );
}

function TapTheLineGame({ content, soundEnabled, onDone }: { content: TapTheLineGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-2">
      {content.lines.map((line, idx) => (
        <button key={`${line}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctLineIndex, selected === idx)}`}>{line}</button>
      ))}
      {checked && content.feedback ? <p className="text-xs text-gray-600 dark:text-slate-400">{content.feedback}</p> : null}
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctLineIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function TapTheWordGame({ content, soundEnabled, onDone }: { content: TapTheWordGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-2">
      <p className="rounded border border-gray-300 bg-white p-2 text-xs dark:border-slate-600 dark:bg-slate-700">{content.sentence}</p>
      <div className="flex flex-wrap gap-1">
        {content.options.map((opt, idx) => (
          <button key={`${opt}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, idx === content.correctOptionIndex, selected === idx)}`}>{opt}</button>
        ))}
      </div>
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctOptionIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function EliminationGame({ content, soundEnabled, onDone }: { content: EliminationGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-2">
      <p className="rounded border border-gray-300 bg-white p-2 text-xs dark:border-slate-600 dark:bg-slate-700">{content.question}</p>
      {content.options.map((opt, idx) => (
        <div key={`${opt}-${idx}`} className="flex items-center gap-2">
          <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`flex-1 rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctIndex, selected === idx)} ${eliminated.has(idx) ? 'opacity-60 line-through' : ''}`}>{opt}</button>
          <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setEliminated((prev) => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; }); }} className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">X</button>
        </div>
      ))}
      {checked && content.explanation ? <p className="text-xs text-gray-600 dark:text-slate-400">{content.explanation}</p> : null}
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function AdvancedGameBody(props: {
  content: AdvancedGameContent;
  done: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  switch (props.content.gameType) {
    case 'sequencing':
      return <SequencingGame {...props} content={props.content} />;
    case 'fill-gap':
      return <FillGapGame {...props} content={props.content} />;
    case 'is-correct-why':
      return <IsCorrectWhyGame {...props} content={props.content} />;
    case 'diagnosis-ranked':
      return <DiagnosisRankedGame {...props} content={props.content} />;
    case 'classify-two-bins':
      return <ClassifyTwoBinsGame {...props} content={props.content} />;
    case 'scenario-match':
      return <ScenarioMatchGame {...props} content={props.content} />;
    case 'formula-build':
      return <FormulaBuildGame {...props} content={props.content} />;
    case 'tap-the-line':
      return <TapTheLineGame {...props} content={props.content} />;
    case 'tap-the-word':
      return <TapTheWordGame {...props} content={props.content} />;
    case 'elimination':
      return <EliminationGame {...props} content={props.content} />;
    default:
      return null;
  }
}
