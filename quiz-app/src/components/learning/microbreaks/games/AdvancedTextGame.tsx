'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { playClickSound, playCustomSound, playSound } from '@/lib/microbreaks/celebrationEffects';

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
  if (type === 'is-correct-why') return 'Is Correct + Why';
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
      return 'Tap a one-word option. It will slide into the gap. Complete all gaps, then tap Check.';
    case 'is-correct-why':
      return 'Step 1: Decide if the statement is correct. Step 2: Pick the best reason. Step 3: Tap Check.';
    case 'diagnosis-ranked':
      return 'Choose the best 1st and 2nd options, then tap Check.';
    case 'classify-two-bins':
      return 'Place each item in the left or right bin, then tap Check.';
    case 'scenario-match':
      return 'Pick the best answer for each scenario, then tap Check.';
    case 'formula-build':
      return 'Goal: build the target formula in order. Tap tokens left to right, use Clear to restart, then tap Check.';
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
  const defaultTimerSeconds = content.gameType === 'formula-build' ? 11 : 30;
  const safeTimerSeconds = typeof content.timerSeconds === 'number' && content.timerSeconds > 0 ? content.timerSeconds : defaultTimerSeconds;
  const [timeLeft, setTimeLeft] = useState<number | null>(safeTimerSeconds);
  const [hasStarted, setHasStarted] = useState(false);

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
    if (done || !hasStarted || timeLeft === null || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [done, hasStarted, timeLeft]);

  useEffect(() => {
    if (!hasStarted || !soundEnabled || content.gameType !== 'formula-build') return;
    playCustomSound('/sounds/The Countdown Clock 11.mp3', 0.35);
  }, [hasStarted, soundEnabled, content.gameType]);

  if (timeLeft !== null && timeLeft <= 0 && !done) {
    finish(0, 0);
  }

  return (
    <GameWrapper
      title={gameTitle(content.gameType)}
      duration={safeTimerSeconds}
      instruction={content.instructions ?? defaultInstruction(content.gameType)}
      motionPreset="soft"
      onComplete={onComplete}
      onSkip={onSkip}
      disableTimer
      disableCelebration
    >
      {(wrapperComplete) => (
        <div
          className="space-y-3 microbreak-enter-slow"
          onPointerDownCapture={() => setHasStarted(true)}
          onKeyDownCapture={() => setHasStarted(true)}
        >
          {content.prompt ? <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{content.prompt}</p> : null}
          {timeLeft !== null ? (
            <div className={`text-xs font-semibold ${timeLeft <= 8 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
              {hasStarted ? `Time left: ${timeLeft}s` : `Time starts on first tap: ${timeLeft}s`}
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
        <div key={`${step}-${idx}`} style={{ animationDelay: `${idx * 40}ms` }} className={`microbreak-stagger microbreak-card-glide flex items-center justify-between rounded border p-2 text-sm ${checked ? (isCorrect ? 'microbreak-correct border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 'microbreak-wrong border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
          <span>{step}</span>
          <div className="flex gap-1">
          <button disabled={checked} onClick={() => move(idx, -1)} className="rounded border px-2 py-1 text-xs microbreak-card-glide">Up</button>
          <button disabled={checked} onClick={() => move(idx, 1)} className="rounded border px-2 py-1 text-xs microbreak-card-glide">Down</button>
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
  const [animatingGapId, setAnimatingGapId] = useState<string | null>(null);
  const [landedGapId, setLandedGapId] = useState<string | null>(null);
  const [isFlyingActive, setIsFlyingActive] = useState(false);
  const [flyingChip, setFlyingChip] = useState<{
    key: number;
    text: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null>(null);

  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gapRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const flightKeyRef = useRef(0);

  const normalizedGaps = useMemo(() => {
    return content.gaps.slice(0, 5).map((gap, index) => {
      const safeOptions = gap.options
        .map((option) => String(option || '').trim().toLowerCase())
        .filter((option) => option.length > 0 && !/\s/.test(option))
        .slice(0, 4);
      const fallbackOptions = ['current', 'voltage', 'neutral', 'earth', 'circuit', 'switch'];
      while (safeOptions.length < 3) {
        const candidate = fallbackOptions[(index + safeOptions.length) % fallbackOptions.length];
        if (!safeOptions.includes(candidate)) safeOptions.push(candidate);
      }
      const correctOptionIndex = gap.correctOptionIndex >= 0 && gap.correctOptionIndex < safeOptions.length ? gap.correctOptionIndex : 0;
      return {
        ...gap,
        options: safeOptions,
        correctOptionIndex,
      };
    });
  }, [content.gaps]);

  const total = normalizedGaps.length;
  const correct = normalizedGaps.reduce((sum, gap) => sum + (answers[gap.id] === gap.correctOptionIndex ? 1 : 0), 0);
  const allAnswered = normalizedGaps.every((gap) => typeof answers[gap.id] === 'number');

  const renderedTemplate = useMemo(() => {
    return content.textTemplate.replace(/\[([^\]]+)\]/g, (match, gapId) => {
      const gap = normalizedGaps.find((g) => g.id === gapId);
      if (!gap) return match;
      const selectedIndex = answers[gap.id];
      const selectedOption = typeof selectedIndex === 'number' ? gap.options[selectedIndex] : null;
      return selectedOption ?? '_____';
    });
  }, [answers, content.textTemplate, normalizedGaps]);

  const handlePickOption = (gapId: string, idx: number) => {
    if (checked) return;
    const gap = normalizedGaps.find((g) => g.id === gapId);
    if (!gap) return;
    const selectedWord = gap.options[idx];
    if (!selectedWord) return;

    const sourceKey = `${gapId}:${idx}`;
    const source = optionRefs.current[sourceKey];
    const target = gapRefs.current[gapId];

    if (soundEnabled) playClickSound(0.2);

    if (source && target) {
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const fromX = sourceRect.left + sourceRect.width / 2;
      const fromY = sourceRect.top + sourceRect.height / 2;
      const toX = targetRect.left + targetRect.width / 2;
      const toY = targetRect.top + targetRect.height / 2;

      const nextKey = flightKeyRef.current + 1;
      flightKeyRef.current = nextKey;
      setAnimatingGapId(gapId);
      setFlyingChip({
        key: nextKey,
        text: selectedWord,
        fromX,
        fromY,
        toX,
        toY,
      });
      setIsFlyingActive(false);
      window.requestAnimationFrame(() => setIsFlyingActive(true));

      window.setTimeout(() => {
        setAnswers((prev) => ({ ...prev, [gapId]: idx }));
        if (soundEnabled) playClickSound(0.12);
        setAnimatingGapId((current) => (current === gapId ? null : current));
        setFlyingChip((current) => (current?.key === nextKey ? null : current));
        setIsFlyingActive(false);
        setLandedGapId(gapId);
        window.setTimeout(() => {
          setLandedGapId((current) => (current === gapId ? null : current));
        }, 240);
      }, 340);
      return;
    }

    setAnswers((prev) => ({ ...prev, [gapId]: idx }));
  };

  return (
    <div className="relative space-y-4">
      {flyingChip ? (
        <span
          key={flyingChip.key}
          className="pointer-events-none fixed z-[60] rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900 shadow-lg shadow-cyan-900/20"
          style={{
            left: flyingChip.fromX,
            top: flyingChip.fromY,
            transform: isFlyingActive
              ? `translate(-50%, -50%) translate(${flyingChip.toX - flyingChip.fromX}px, ${flyingChip.toY - flyingChip.fromY}px) scale(0.9) rotate(6deg)`
              : 'translate(-50%, -50%)',
            transition: 'transform 340ms cubic-bezier(0.22, 0.86, 0.32, 1.2), opacity 340ms ease-out',
            opacity: isFlyingActive ? 0.06 : 1,
          }}
        >
          {flyingChip.text}
        </span>
      ) : null}

      <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-3 text-sm leading-6 text-slate-800 dark:border-cyan-700/60 dark:from-slate-800 dark:to-teal-900/30 dark:text-slate-100">
        {renderedTemplate}
      </div>

      {normalizedGaps.map((gap, questionIndex) => {
        const selectedIndex = answers[gap.id];
        const selectedOption = typeof selectedIndex === 'number' ? gap.options[selectedIndex] : null;
        const lockedByAnimation = animatingGapId === gap.id;
        return (
          <div key={gap.id} className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700/70">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Question {questionIndex + 1} of {total}
              </p>
              <div
                ref={(node) => {
                  gapRefs.current[gap.id] = node;
                }}
                className={`min-w-20 rounded-full border px-3 py-1 text-center text-xs font-semibold transition-all duration-200 ${
                  selectedOption
                    ? 'border-cyan-300 bg-cyan-100 text-cyan-900 dark:border-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200'
                    : 'border-dashed border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
                } ${landedGapId === gap.id ? 'scale-105 ring-2 ring-cyan-300/80 dark:ring-cyan-500/70' : ''}`}
              >
                {selectedOption ?? 'tap word'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {gap.options.map((opt, idx) => {
                const selected = selectedIndex === idx;
                return (
                  <button
                    key={`${gap.id}-${opt}-${idx}`}
                    ref={(node) => {
                      optionRefs.current[`${gap.id}:${idx}`] = node;
                    }}
                    disabled={checked || lockedByAnimation}
                    onClick={() => handlePickOption(gap.id, idx)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      selected
                        ? tone(checked, idx === gap.correctOptionIndex, true)
                        : 'border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-800 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        disabled={checked || !allAnswered || Boolean(animatingGapId)}
        onClick={() => {
          if (soundEnabled) playClickSound(0.25);
          setChecked(true);
          onDone(correct, (correct / Math.max(1, total)) * 100);
        }}
        className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60"
      >
        Check
      </button>
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
      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">1) Is the statement correct?</p>
      <div className="flex gap-2">
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setChoice(true); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, content.isCorrect, choice === true)}`}>Correct</button>
        <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setChoice(false); }} className={`rounded border px-2 py-1 text-xs ${tone(checked, !content.isCorrect, choice === false)}`}>Incorrect</button>
      </div>
      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">2) Why?</p>
      <div className="space-y-1">
        {content.reasons.map((r, idx) => (
          <button key={`${r}-${idx}`} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setReason(idx); }} className={`block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctReasonIndex, reason === idx)}`}>{r}</button>
        ))}
      </div>
      {checked && content.explanation ? <p className="text-xs text-gray-600 dark:text-slate-400">{content.explanation}</p> : null}
      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">3) Check your answer</p>
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
          <button key={`${o}-${idx}`} style={{ animationDelay: `${idx * 35}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); if (first === null) setFirst(idx); else if (second === null && idx !== first) setSecond(idx); }} className={`microbreak-stagger microbreak-card-glide block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, correct, selected)}`}>
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
      {content.items.map((item, idx) => {
        const assignedBin = assigned[item.text];
        const leftSelected = assignedBin === 'left';
        const rightSelected = assignedBin === 'right';
        const rowTone = checked
          ? assignedBin === item.correctBin
            ? 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30'
            : 'border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-900/30'
          : assignedBin
            ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
            : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700';

        return (
          <div key={item.text} style={{ animationDelay: `${idx * 35}ms` }} className={`microbreak-stagger microbreak-card-glide flex items-center justify-between rounded border p-2 text-xs ${rowTone}`}>
            <span>{item.text}</span>
            <div className="flex gap-1">
              <button
                disabled={checked}
                onClick={() => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [item.text]: 'left' })); }}
                className={`rounded border px-2 py-1 ${tone(checked, item.correctBin === 'left', leftSelected)}`}
              >
                Left
              </button>
              <button
                disabled={checked}
                onClick={() => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [item.text]: 'right' })); }}
                className={`rounded border px-2 py-1 ${tone(checked, item.correctBin === 'right', rightSelected)}`}
              >
                Right
              </button>
            </div>
          </div>
        );
      })}
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
        <div key={`${pair.scenario}-${idx}`} style={{ animationDelay: `${idx * 35}ms` }} className={`microbreak-stagger microbreak-card-glide rounded border p-2 text-xs ${checked ? (assigned[idx] === pair.answer ? 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30' : 'border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-900/30') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
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
  const [lastAttemptWrong, setLastAttemptWrong] = useState(false);
  const isCorrect = sequence.length === content.correctSequence.length && sequence.every((t, i) => t === content.correctSequence[i]);
  const expectedLength = content.correctSequence.length;

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-600 dark:text-slate-400">
        Build the full formula in the answer box. You need {expectedLength} token{expectedLength === 1 ? '' : 's'} in the right order.
      </p>
      <div className={`min-h-10 rounded border p-2 text-xs ${checked ? (isCorrect ? 'border-green-500 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200' : 'border-red-500 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
        {sequence.join(' ') || 'Build the formula here'}
      </div>
      {checked && lastAttemptWrong ? (
        <p className="text-xs font-medium text-red-700 dark:text-red-300">
          Not quite. Tap Try again and rebuild the formula.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-1">
        {content.tokens.map((token, idx) => (
          <button key={`${token}-${idx}`} style={{ animationDelay: `${idx * 30}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSequence((prev) => [...prev, token]); }} className="microbreak-stagger microbreak-card-glide rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">{token}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          disabled={checked}
          onClick={() => {
            if (soundEnabled) playClickSound(0.2);
            setSequence([]);
            setLastAttemptWrong(false);
          }}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800"
        >
          Clear
        </button>
        <button
          disabled={checked}
          onClick={() => {
            if (soundEnabled) playClickSound(0.25);
            setChecked(true);
            if (isCorrect) {
              setLastAttemptWrong(false);
              onDone(1, 100);
              return;
            }
            setLastAttemptWrong(true);
          }}
          className="rounded bg-indigo-700 px-3 py-2 text-xs text-white disabled:opacity-60"
        >
          Check
        </button>
        {checked && lastAttemptWrong ? (
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.2);
              setChecked(false);
              setSequence([]);
              setLastAttemptWrong(false);
            }}
            className="rounded border border-indigo-300 bg-indigo-100 px-3 py-2 text-xs text-indigo-900 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
          >
            Try again
          </button>
        ) : null}
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
        <button key={`${line}-${idx}`} style={{ animationDelay: `${idx * 35}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`microbreak-stagger microbreak-card-glide block w-full rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctLineIndex, selected === idx)}`}>{line}</button>
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
          <button key={`${opt}-${idx}`} style={{ animationDelay: `${idx * 35}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`microbreak-stagger microbreak-card-glide rounded border px-2 py-1 text-xs ${tone(checked, idx === content.correctOptionIndex, selected === idx)}`}>{opt}</button>
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
          <button style={{ animationDelay: `${idx * 35}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setSelected(idx); }} className={`microbreak-stagger microbreak-card-glide flex-1 rounded border px-2 py-1 text-left text-xs ${tone(checked, idx === content.correctIndex, selected === idx)} ${eliminated.has(idx) ? 'opacity-60 line-through' : ''}`}>{opt}</button>
          <button style={{ animationDelay: `${idx * 35}ms` }} disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.2); setEliminated((prev) => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; }); }} className="microbreak-stagger microbreak-card-glide rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">X</button>
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
