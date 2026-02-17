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
  MicrobreakContent,
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

function titleFor(gameType: AdvancedGameContent['gameType']): string {
  switch (gameType) {
    case 'sequencing':
      return 'Sequencing';
    case 'fill-gap':
      return 'Fill Gap';
    case 'is-correct-why':
      return 'Is Correct + Why';
    case 'diagnosis-ranked':
      return 'Diagnosis Ranked';
    case 'classify-two-bins':
      return 'Classify Two Bins';
    case 'scenario-match':
      return 'Scenario Match';
    case 'formula-build':
      return 'Formula Build';
    case 'tap-the-line':
      return 'Tap The Line';
    case 'tap-the-word':
      return 'Tap The Word';
    case 'elimination':
      return 'Elimination';
    default:
      return 'Game';
  }
}

export default function AdvancedTextGame({ content, onComplete, onSkip }: AdvancedTextGameProps) {
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);

  const soundEnabled = content.enableSound !== false;
  const effectsEnabled = content.enableEffects !== false;

  const finish = (score: number, accuracy: number) => {
    if (done) return;
    setDone(true);
    if (soundEnabled) {
      if (accuracy >= 99) playSound('success', 0.6);
      else if (accuracy >= 50) playSound('success', 0.3);
      else playSound('failure', 0.25);
    }
    onComplete(score, clampPercent(accuracy));
  };

  useEffect(() => {
    if (done || timeLeft === null) return;
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [done, timeLeft]);

  if (timeLeft !== null && timeLeft <= 0 && !done) {
    // Auto-check contract: time expiry locks and submits current state as zero for this generic wrapper.
    finish(0, 0);
  }

  return (
    <GameWrapper
      title={titleFor(content.gameType)}
      duration={content.timerSeconds ?? 30}
      onComplete={onComplete}
      onSkip={onSkip}
      disableTimer
      disableCelebration
    >
      {(wrapperComplete) => (
        <div className="space-y-3">
          {content.prompt ? (
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{content.prompt}</p>
          ) : null}
          {content.instructions ? (
            <p className="text-xs text-gray-600 dark:text-slate-400">{content.instructions}</p>
          ) : null}
          {timeLeft !== null ? (
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Time left: {timeLeft}s</div>
          ) : null}
          <AdvancedGameBody
            content={content}
            done={done}
            effectsEnabled={effectsEnabled}
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

function AdvancedGameBody(props: {
  content: AdvancedGameContent;
  done: boolean;
  effectsEnabled: boolean;
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

function SequencingGame(props: {
  content: SequencingGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [steps, setSteps] = useState(props.content.steps);
  const [checked, setChecked] = useState(false);
  const isCorrect = useMemo(
    () => steps.length === props.content.correctOrder.length && steps.every((s, i) => s === props.content.correctOrder[i]),
    [steps, props.content.correctOrder]
  );
  const move = (index: number, direction: -1 | 1) => {
    if (props.done || checked) return;
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    if (props.soundEnabled) playClickSound(0.2);
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  };
  const check = () => {
    if (props.done) return;
    setChecked(true);
    props.onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0);
  };
  return (
    <div className="space-y-2">
      {steps.map((step, idx) => (
        <div
          key={`${step}-${idx}`}
          className={`flex items-center justify-between rounded border p-2 text-sm ${checked && isCorrect && props.effectsEnabled ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
        >
          <span>{step}</span>
          <div className="flex gap-1">
            <button disabled={checked} onClick={() => move(idx, -1)} className="rounded border px-2 py-1 text-xs">Up</button>
            <button disabled={checked} onClick={() => move(idx, 1)} className="rounded border px-2 py-1 text-xs">Down</button>
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function FillGapGame(props: {
  content: FillGapGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const total = props.content.gaps.length;
  const correct = props.content.gaps.reduce((sum, gap) => sum + (answers[gap.id] === gap.correctOptionIndex ? 1 : 0), 0);
  const check = () => {
    setChecked(true);
    props.onDone(correct, (correct / Math.max(1, total)) * 100);
  };
  return (
    <div className="space-y-2">
      <p className="text-sm">{props.content.textTemplate}</p>
      {props.content.gaps.map((gap) => (
        <div key={gap.id} className="rounded border p-2">
          <p className="mb-1 text-xs font-semibold">Gap {gap.id}</p>
          <div className="flex flex-wrap gap-1">
            {gap.options.map((opt, idx) => (
              <button
                key={`${gap.id}-${opt}-${idx}`}
                disabled={checked}
                onClick={() => {
                  if (props.soundEnabled) playClickSound(0.2);
                  setAnswers((prev) => ({ ...prev, [gap.id]: idx }));
                }}
                className={`rounded border px-2 py-1 text-xs ${answers[gap.id] === idx ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function IsCorrectWhyGame(props: {
  content: IsCorrectWhyGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const check = () => {
    const binary = choice === props.content.isCorrect;
    const why = reason === props.content.correctReasonIndex;
    const score = binary && why ? 1 : binary ? 0.5 : 0;
    setChecked(true);
    props.onDone(score, score * 100);
  };
  return (
    <div className="space-y-2">
      <p className="rounded border p-2 text-sm">{props.content.statement}</p>
      <div className="flex gap-2">
        <button disabled={checked} onClick={() => setChoice(true)} className={`rounded border px-2 py-1 text-xs ${choice === true ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>Correct</button>
        <button disabled={checked} onClick={() => setChoice(false)} className={`rounded border px-2 py-1 text-xs ${choice === false ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>Incorrect</button>
      </div>
      <div className="space-y-1">
        {props.content.reasons.map((r, idx) => (
          <button key={`${r}-${idx}`} disabled={checked} onClick={() => setReason(idx)} className={`block w-full rounded border px-2 py-1 text-left text-xs ${reason === idx ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>{r}</button>
        ))}
      </div>
      {checked && props.content.explanation ? <p className="text-xs text-gray-600 dark:text-slate-400">{props.content.explanation}</p> : null}
      <button disabled={checked || choice === null || reason === null} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function DiagnosisRankedGame(props: {
  content: DiagnosisRankedGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const check = () => {
    const [a, b] = props.content.correctRankedIndices;
    let score = 0;
    if (first === a && second === b) score = 1;
    else if (first === b && second === a) score = 0.5;
    else if (first === a) score = 0.5;
    setChecked(true);
    props.onDone(score, score * 100);
  };
  return (
    <div className="space-y-2">
      <p className="rounded border p-2 text-xs">{props.content.scenario}</p>
      {props.content.options.map((o, idx) => (
        <button key={`${o}-${idx}`} disabled={checked} onClick={() => (first === null ? setFirst(idx) : setSecond(idx))} className="block w-full rounded border px-2 py-1 text-left text-xs">
          {o} {first === idx ? '(1st)' : second === idx ? '(2nd)' : ''}
        </button>
      ))}
      {checked && props.content.rationale ? <p className="text-xs text-gray-600 dark:text-slate-400">{props.content.rationale}</p> : null}
      <button disabled={checked || first === null || second === null} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function ClassifyTwoBinsGame(props: {
  content: ClassifyTwoBinsGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [assigned, setAssigned] = useState<Record<string, 'left' | 'right'>>({});
  const [checked, setChecked] = useState(false);
  const total = props.content.items.length;
  const correct = props.content.items.reduce((sum, i) => sum + (assigned[i.text] === i.correctBin ? 1 : 0), 0);
  const check = () => {
    setChecked(true);
    props.onDone(correct, (correct / Math.max(1, total)) * 100);
  };
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <div className="rounded border p-2 text-center">{props.content.leftLabel}</div>
        <div className="rounded border p-2 text-center">{props.content.rightLabel}</div>
      </div>
      {props.content.items.map((item) => (
        <div key={item.text} className="flex items-center justify-between rounded border p-2 text-xs">
          <span>{item.text}</span>
          <div className="flex gap-1">
            <button disabled={checked} onClick={() => setAssigned((p) => ({ ...p, [item.text]: 'left' }))} className={`rounded border px-2 py-1 ${assigned[item.text] === 'left' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>Left</button>
            <button disabled={checked} onClick={() => setAssigned((p) => ({ ...p, [item.text]: 'right' }))} className={`rounded border px-2 py-1 ${assigned[item.text] === 'right' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>Right</button>
          </div>
        </div>
      ))}
      <button disabled={checked} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function ScenarioMatchGame(props: {
  content: ScenarioMatchGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [assigned, setAssigned] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const answers = useMemo(() => [...new Set([...props.content.pairs.map((p) => p.answer), ...(props.content.distractors ?? [])])], [props.content]);
  const total = props.content.pairs.length;
  const correct = props.content.pairs.reduce((sum, p, idx) => sum + (assigned[idx] === p.answer ? 1 : 0), 0);
  const check = () => {
    setChecked(true);
    props.onDone(correct, (correct / Math.max(1, total)) * 100);
  };
  return (
    <div className="space-y-2">
      {props.content.pairs.map((pair, idx) => (
        <div key={`${pair.scenario}-${idx}`} className="rounded border p-2 text-xs">
          <p className="mb-1">{pair.scenario}</p>
          <select
            disabled={checked}
            value={assigned[idx] ?? ''}
            onChange={(e) => setAssigned((prev) => ({ ...prev, [idx]: e.target.value }))}
            className="w-full rounded border px-2 py-1 text-xs"
          >
            <option value="">Select answer</option>
            {answers.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      ))}
      <button disabled={checked} onClick={check} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function FormulaBuildGame(props: {
  content: FormulaBuildGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = sequence.length === props.content.correctSequence.length && sequence.every((t, i) => t === props.content.correctSequence[i]);
  const clear = () => setSequence([]);
  return (
    <div className="space-y-2">
      <div className="min-h-10 rounded border p-2 text-xs">{sequence.join(' ') || 'Build the formula here'}</div>
      <div className="flex flex-wrap gap-1">
        {props.content.tokens.map((token, idx) => (
          <button key={`${token}-${idx}`} disabled={checked} onClick={() => setSequence((prev) => [...prev, token])} className="rounded border px-2 py-1 text-xs">{token}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button disabled={checked} onClick={clear} className="rounded border px-3 py-2 text-xs">Clear</button>
        <button disabled={checked} onClick={() => { setChecked(true); props.onDone(correct ? 1 : 0, correct ? 100 : 0); }} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
      </div>
    </div>
  );
}

function TapTheLineGame(props: {
  content: TapTheLineGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-2">
      {props.content.lines.map((line, idx) => (
        <button key={`${line}-${idx}`} disabled={checked} onClick={() => setSelected(idx)} className={`block w-full rounded border px-2 py-1 text-left text-xs ${selected === idx ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>{line}</button>
      ))}
      {checked && props.content.feedback ? <p className="text-xs text-gray-600 dark:text-slate-400">{props.content.feedback}</p> : null}
      <button disabled={checked || selected === null} onClick={() => { const correct = selected === props.content.correctLineIndex; setChecked(true); props.onDone(correct ? 1 : 0, correct ? 100 : 0); }} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function TapTheWordGame(props: {
  content: TapTheWordGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-2">
      <p className="rounded border p-2 text-xs">{props.content.sentence}</p>
      <div className="flex flex-wrap gap-1">
        {props.content.options.map((opt, idx) => (
          <button key={`${opt}-${idx}`} disabled={checked} onClick={() => setSelected(idx)} className={`rounded border px-2 py-1 text-xs ${selected === idx ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>{opt}</button>
        ))}
      </div>
      <button disabled={checked || selected === null} onClick={() => { const correct = selected === props.content.correctOptionIndex; setChecked(true); props.onDone(correct ? 1 : 0, correct ? 100 : 0); }} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}

function EliminationGame(props: {
  content: EliminationGameContent;
  done: boolean;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
}) {
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-2">
      <p className="rounded border p-2 text-xs">{props.content.question}</p>
      {props.content.options.map((opt, idx) => {
        const isEliminated = eliminated.has(idx);
        return (
          <div key={`${opt}-${idx}`} className="flex items-center gap-2">
            <button disabled={checked} onClick={() => setSelected(idx)} className={`flex-1 rounded border px-2 py-1 text-left text-xs ${selected === idx ? 'bg-blue-100 dark:bg-blue-900/30' : ''} ${isEliminated ? 'opacity-50 line-through' : ''}`}>{opt}</button>
            <button
              disabled={checked}
              onClick={() =>
                setEliminated((prev) => {
                  const next = new Set(prev);
                  if (next.has(idx)) next.delete(idx);
                  else next.add(idx);
                  return next;
                })
              }
              className="rounded border px-2 py-1 text-xs"
            >
              X
            </button>
          </div>
        );
      })}
      {checked && props.content.explanation ? <p className="text-xs text-gray-600 dark:text-slate-400">{props.content.explanation}</p> : null}
      <button disabled={checked || selected === null} onClick={() => { const correct = selected === props.content.correctIndex; setChecked(true); props.onDone(correct ? 1 : 0, correct ? 100 : 0); }} className="rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60">Check</button>
    </div>
  );
}
