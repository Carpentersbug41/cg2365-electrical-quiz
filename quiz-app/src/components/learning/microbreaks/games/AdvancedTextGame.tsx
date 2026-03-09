'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GameWrapper from '../GameWrapper';
import { ArrowUp, ArrowDown, CheckCircle, CheckCircle2, XCircle, GripVertical, Clock, RotateCcw, ArrowRight, SkipForward, X, AlertCircle, Sparkles } from 'lucide-react';
import { Reorder, motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import ClassifyTwoBinsReplacementGame from './ClassifyTwoBinsReplacementGame';
import DiagnosisRankedReplacementGame from './DiagnosisRankedReplacementGame';
import IsCorrectWhyReplacementGame from './IsCorrectWhyReplacementGame';
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
import {
  primaryActionButtonClass,
} from './buttonStyles';

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

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function AdvancedTextGame({ content, onComplete, onSkip }: AdvancedTextGameProps) {
  const [done, setDone] = useState(false);
  const completionNotifiedRef = useRef(false);
  const defaultTimerSeconds = 30;
  const safeTimerSeconds = typeof content.timerSeconds === 'number' && content.timerSeconds > 0 ? content.timerSeconds : defaultTimerSeconds;
  const useLocalHeaderAndTimer =
    content.gameType === 'sequencing' ||
    content.gameType === 'fill-gap' ||
    content.gameType === 'formula-build' ||
    content.gameType === 'is-correct-why' ||
    content.gameType === 'diagnosis-ranked' ||
    content.gameType === 'classify-two-bins';
  const [timeLeft, setTimeLeft] = useState<number | null>(useLocalHeaderAndTimer ? null : safeTimerSeconds);
  const [hasStarted, setHasStarted] = useState(false);

  const soundEnabled = content.enableSound !== false;

  const finish = useCallback((score: number, accuracy: number) => {
    if (done || completionNotifiedRef.current) return;
    completionNotifiedRef.current = true;
    setDone(true);
    if (soundEnabled && content.gameType !== 'formula-build' && content.gameType !== 'is-correct-why') {
      if (accuracy >= 99) playSound('success', 0.6);
      else if (accuracy >= 50) playSound('success', 0.3);
      else playSound('failure', 0.35);
    }
    // Defer parent update to avoid setState during descendant render paths.
    setTimeout(() => {
      onComplete(score, clampPercent(accuracy));
    }, 0);
  }, [done, soundEnabled, content.gameType, onComplete]);

  useEffect(() => {
    completionNotifiedRef.current = false;
    setDone(false);
  }, [content]);

  useEffect(() => {
    if (done || !hasStarted || timeLeft === null || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [done, hasStarted, timeLeft]);

  useEffect(() => {
    setTimeLeft(useLocalHeaderAndTimer ? null : safeTimerSeconds);
  }, [useLocalHeaderAndTimer, safeTimerSeconds]);

  useEffect(() => {
    if (timeLeft === null || timeLeft > 0 || done) return;
    finish(0, 0);
  }, [timeLeft, done, finish]);

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
          {!useLocalHeaderAndTimer && content.prompt ? <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{content.prompt}</p> : null}
          {!useLocalHeaderAndTimer && timeLeft !== null ? (
            <div className={`text-xs font-semibold ${timeLeft <= 8 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
              {hasStarted ? `Time left: ${timeLeft}s` : `Time starts on first tap: ${timeLeft}s`}
            </div>
          ) : null}
          <AdvancedGameBody
            content={content}
            done={done}
            soundEnabled={soundEnabled}
            onSkip={onSkip}
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

function SequencingGame({ content, done, soundEnabled, onDone, onSkip }: { content: SequencingGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; onSkip: () => void; }) {
  const sequencingTimerSeconds = 33;
  const [items, setItems] = useState<Array<{ id: string; text: string }>>(
    content.steps.map((step, index) => ({ id: `step-${index}`, text: step }))
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<{ score: number; accuracy: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(sequencingTimerSeconds);
  const [hasStarted, setHasStarted] = useState(false);
  const countdownStartedRef = useRef(false);

  useEffect(() => {
    setItems(content.steps.map((step, index) => ({ id: `step-${index}`, text: step })));
    setIsSubmitted(false);
    setResults(null);
    setTimeLeft(sequencingTimerSeconds);
    setHasStarted(false);
    countdownStartedRef.current = false;
  }, [content]);

  useEffect(() => {
    if (!hasStarted || timeLeft === null || isSubmitted || timeLeft <= 0 || done) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, isSubmitted, done]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted || done) return;
    const nextItems = [...items];
    if (direction === 'up' && index > 0) {
      [nextItems[index - 1], nextItems[index]] = [nextItems[index], nextItems[index - 1]];
      setItems(nextItems);
      if (soundEnabled) playClickSound(0.2);
    } else if (direction === 'down' && index < nextItems.length - 1) {
      [nextItems[index + 1], nextItems[index]] = [nextItems[index], nextItems[index + 1]];
      setItems(nextItems);
      if (soundEnabled) playClickSound(0.2);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted || done) return;
    let correctCount = 0;
    items.forEach((item, index) => {
      if (item.text === content.correctOrder[index]) correctCount++;
    });
    const accuracy = (correctCount / Math.max(1, items.length)) * 100;
    setIsSubmitted(true);
    setResults({ score: correctCount, accuracy });
  };

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && !done) handleSubmit();
    // intentionally reacts only to timer/submitted flags
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitted, done]);

  useEffect(() => {
    if (!hasStarted || done || isSubmitted || timeLeft === null || timeLeft <= 0 || countdownStartedRef.current) return;
    countdownStartedRef.current = true;
    if (soundEnabled) playCustomSound('/sounds/Countdown clock.mp3', 0.35);
  }, [hasStarted, done, isSubmitted, soundEnabled, timeLeft]);

  const handleContinue = () => {
    if (results) onDone(results.score, results.accuracy);
    else onDone(0, 0);
  };

  const handleReset = () => {
    setItems(content.steps.map((step, index) => ({ id: `step-${index}`, text: step })));
    setIsSubmitted(false);
    setResults(null);
    setTimeLeft(sequencingTimerSeconds);
    setHasStarted(false);
    countdownStartedRef.current = false;
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200"
      onPointerDownCapture={() => setHasStarted(true)}
      onKeyDownCapture={() => setHasStarted(true)}
    >
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {content.prompt || 'Order the steps'}
          </h2>
          {content.instructions ? <p className="text-slate-600">{content.instructions}</p> : null}
        </div>
        {timeLeft !== null ? (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-medium shrink-0 transition-colors ${
              timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            }`}
            role="timer"
            aria-live="polite"
          >
            <Clock className="w-4 h-4" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        ) : null}
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={isSubmitted || done ? () => undefined : setItems}
        className="space-y-3 mb-8"
        as="ul"
      >
        {items.map((item, index) => {
          const isCorrect = isSubmitted ? item.text === content.correctOrder[index] : null;
          return (
            <Reorder.Item
              key={item.id}
              value={item}
              dragListener={!isSubmitted && !done}
              as="li"
              className={`relative flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                isSubmitted
                  ? (isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50')
                  : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
              }`}
            >
              {!isSubmitted && !done ? (
                <div className="text-slate-400 cursor-grab active:cursor-grabbing p-1" aria-hidden="true">
                  <GripVertical className="w-5 h-5" />
                </div>
              ) : null}

              {isSubmitted ? (
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" aria-label="Correct position" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" aria-label="Incorrect position" />
                  )}
                </div>
              ) : null}

              <div className="flex-1 text-slate-700 font-medium select-none">{item.text}</div>

              {!isSubmitted && !done ? (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    aria-label={`Move "${item.text}" up`}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    aria-label={`Move "${item.text}" down`}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.2);
              onSkip();
            }}
            className="px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Skip
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.2);
              handleReset();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            aria-label="Reset order"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {!isSubmitted ? (
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.25);
              handleSubmit();
            }}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Check Answer
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-700" aria-live="polite">
              Score: <span className={results?.accuracy === 100 ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'}>{results?.score} / {items.length}</span>
            </div>
            <button
              onClick={() => {
                if (soundEnabled) playClickSound(0.25);
                handleContinue();
              }}
              className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const FillGapSlot = ({
  gap,
  isActive,
  selectedOptionIndex,
  isSubmitted,
  onClick,
}: {
  key?: React.Key;
  gap: FillGapGameContent['gaps'][0];
  isActive: boolean;
  selectedOptionIndex?: number;
  isSubmitted: boolean;
  onClick: () => void;
}) => {
  const hasAnswer = selectedOptionIndex !== undefined;
  const isCorrect = hasAnswer && selectedOptionIndex === gap.correctOptionIndex;
  const selectedText = hasAnswer ? gap.options[selectedOptionIndex] : '';
  const longestOption = useMemo(() => [...gap.options].sort((a, b) => b.length - a.length)[0] || '', [gap.options]);

  return (
    <span
      className={`
        relative inline-flex items-center justify-center h-10 mx-1.5 align-bottom
        rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}
        ${!isSubmitted && isActive ? 'bg-indigo-50 border-2 border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : ''}
        ${!isSubmitted && !isActive && !hasAnswer ? 'bg-slate-100 border-2 border-slate-200 hover:bg-slate-200' : ''}
        ${!isSubmitted && !isActive && hasAnswer ? 'bg-transparent' : ''}
      `}
      onClick={!isSubmitted ? onClick : undefined}
      role="button"
      tabIndex={isSubmitted ? -1 : 0}
      aria-label={`Gap. ${hasAnswer ? `Selected: ${selectedText}` : 'Empty'}`}
      onKeyDown={(e) => {
        if (!isSubmitted && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className="invisible px-4 text-sm md:text-base font-bold whitespace-nowrap">
        {longestOption}
      </span>

      {hasAnswer && (
        <motion.span
          layoutId={`chip-${gap.id}-${selectedOptionIndex}`}
          className={`
            absolute inset-0 flex items-center justify-center px-4 rounded-xl font-bold text-sm md:text-base shadow-sm whitespace-nowrap
            ${isSubmitted && isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : ''}
            ${isSubmitted && !isCorrect ? 'bg-rose-500 text-white border-rose-600' : ''}
            ${!isSubmitted ? 'bg-white text-indigo-900 border-2 border-slate-200 hover:border-indigo-300' : ''}
          `}
          initial={false}
          animate={{ scale: 1 }}
          whileHover={!isSubmitted ? { scale: 1.02 } : {}}
          whileTap={!isSubmitted ? { scale: 0.98 } : {}}
        >
          {selectedText}
        </motion.span>
      )}

      {isSubmitted && !isCorrect && (
        <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded shadow-sm z-10 flex items-center gap-1 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          {gap.options[gap.correctOptionIndex]}
        </span>
      )}
    </span>
  );
};

function FillGapGame({ content, soundEnabled, onDone, onSkip }: { content: FillGapGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; onSkip: () => void; }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeGapId, setActiveGapId] = useState<string | null>(content.gaps[0]?.id || null);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);
  const [result, setResult] = useState<{ score: number; accuracy: number } | null>(null);

  const parsedTemplate = useMemo(() => {
    const parts: Array<{ type: 'text' | 'gap'; value: string }> = [];
    const regex = /\{\{([^}]+)\}\}|\{([^}]+)\}|\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content.textTemplate)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.textTemplate.slice(lastIndex, match.index) });
      }
      const gapId = match[1] || match[2] || match[3];
      parts.push({ type: 'gap', value: gapId });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.textTemplate.length) {
      parts.push({ type: 'text', value: content.textTemplate.slice(lastIndex) });
    }
    return parts;
  }, [content.textTemplate]);

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setActiveGapId(content.gaps[0]?.id || null);
    setTimeLeft(content.timerSeconds ?? null);
    setResult(null);
  };

  useEffect(() => {
    handleReset();
    // reset when content payload changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    if (soundEnabled) playClickSound(0.25);
    setIsSubmitted(true);
    setActiveGapId(null);

    let score = 0;
    content.gaps.forEach((gap) => {
      if (answers[gap.id] === gap.correctOptionIndex) score += 1;
    });
    const accuracy = content.gaps.length > 0 ? (score / content.gaps.length) * 100 : 0;
    if (soundEnabled) {
      if (accuracy === 100) playSound('success', 0.5);
      else if (accuracy >= 50) playSound('success', 0.25);
      else playSound('failure', 0.35);
    }
    setResult({ score, accuracy });
  }, [answers, content.gaps, isSubmitted, soundEnabled]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => (t !== null ? t - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const handleSelectOption = (gapId: string, optionIndex: number) => {
    if (isSubmitted) return;
    if (soundEnabled) playClickSound(0.2);

    setAnswers((prev) => ({
      ...prev,
      [gapId]: optionIndex,
    }));

    const nextAnswers = { ...answers, [gapId]: optionIndex };
    const gapIndex = content.gaps.findIndex((g) => g.id === gapId);
    let nextGapId: string | null = null;

    for (let i = gapIndex + 1; i < content.gaps.length; i += 1) {
      if (nextAnswers[content.gaps[i].id] === undefined) {
        nextGapId = content.gaps[i].id;
        break;
      }
    }
    if (!nextGapId) {
      for (let i = 0; i < gapIndex; i += 1) {
        if (nextAnswers[content.gaps[i].id] === undefined) {
          nextGapId = content.gaps[i].id;
          break;
        }
      }
    }

    if (nextGapId) setActiveGapId(nextGapId);
  };

  const handleGapClick = (gapId: string) => {
    if (isSubmitted) return;
    if (soundEnabled) playClickSound(0.15);
    setActiveGapId(gapId);
    setAnswers((prev) => {
      if (prev[gapId] !== undefined) {
        const next = { ...prev };
        delete next[gapId];
        return next;
      }
      return prev;
    });
  };

  const isAllAnswered = content.gaps.every((g) => answers[g.id] !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex-1">
          {content.prompt ? <h2 className="text-xl font-bold text-slate-800 mb-2">{content.prompt}</h2> : null}
          {content.instructions ? <p className="text-sm text-slate-500">{content.instructions}</p> : null}
        </div>

        <div className="flex items-center gap-4 ml-4">
          {timeLeft !== null ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm ${timeLeft <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          ) : null}
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.2);
              handleReset();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            aria-label="Reset game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.2);
              onSkip();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            aria-label="Skip game"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-8 md:p-12">
        <p className="text-xl md:text-2xl text-slate-700 leading-[4rem] font-medium whitespace-pre-wrap">
          {parsedTemplate.map((part, i) => {
            if (part.type === 'text') return <span key={i}>{part.value}</span>;
            const gap = content.gaps.find((g) => g.id === part.value);
            if (!gap) return <span key={i} className="text-rose-500">[Missing Gap: {part.value}]</span>;
            return (
              <FillGapSlot
                key={gap.id}
                gap={gap}
                isActive={activeGapId === gap.id}
                selectedOptionIndex={answers[gap.id]}
                isSubmitted={isSubmitted}
                onClick={() => handleGapClick(gap.id)}
              />
            );
          })}
        </p>
      </div>

      {!isSubmitted && (
        <div className="px-8 pb-4">
          <div className="min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeGapId ? (
                <motion.div
                  key={activeGapId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-3 justify-center items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 w-full"
                >
                  {content.gaps.find((g) => g.id === activeGapId)?.options.map((opt, index) => {
                    const isSelected = answers[activeGapId] === index;
                    return (
                      <div key={index} className="relative flex items-center justify-center">
                        <div className="px-4 h-10 rounded-xl bg-slate-200/50 border border-slate-200 flex items-center justify-center">
                          <span className="invisible text-sm md:text-base font-bold whitespace-nowrap">{opt}</span>
                        </div>

                        {!isSelected && (
                          <motion.div
                            layoutId={`chip-${activeGapId}-${index}`}
                            className="absolute inset-0 flex items-center justify-center px-4 rounded-xl font-bold text-sm md:text-base bg-white text-indigo-900 border-2 border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 whitespace-nowrap"
                            onClick={() => handleSelectOption(activeGapId, index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectOption(activeGapId, index);
                              }
                            }}
                          >
                            {opt}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        {isSubmitted && result ? (
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${result.accuracy === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {result.score}/{content.gaps.length}
            </div>
            <div className="flex flex-col">
              <span className={`font-bold ${result.accuracy === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {result.accuracy === 100 ? 'Perfect!' : 'Good effort!'}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                Accuracy: {Math.round(result.accuracy)}%
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              ${isAllAnswered ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95' : 'bg-slate-300 cursor-not-allowed'}
            `}
          >
            Check Answers
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.25);
              onDone(result?.score ?? 0, result?.accuracy ?? 0);
            }}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Next Question
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function IsCorrectWhyGame({ content, soundEnabled, onDone }: { content: IsCorrectWhyGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; }) {
  const questions = useMemo(() => {
    const raw = Array.isArray(content.questions) ? content.questions : [];
    const normalized = raw
      .map((q) => ({
        statement: typeof q?.statement === 'string' ? q.statement : '',
        isCorrect: Boolean(q?.isCorrect),
        reasons: Array.isArray(q?.reasons) ? q.reasons.filter((r): r is string => typeof r === 'string' && r.trim().length > 0) : [],
        correctReasonIndex: typeof q?.correctReasonIndex === 'number' ? q.correctReasonIndex : -1,
        explanation: typeof q?.explanation === 'string' ? q.explanation : undefined,
      }))
      .filter((q) => q.statement.trim().length > 0 && q.reasons.length >= 2 && q.correctReasonIndex >= 0 && q.correctReasonIndex < q.reasons.length);

    if (normalized.length > 0) return normalized;
    return [
      {
        statement: content.statement,
        isCorrect: content.isCorrect,
        reasons: content.reasons,
        correctReasonIndex: content.correctReasonIndex,
        explanation: content.explanation,
      },
    ];
  }, [content]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const completionSentRef = useRef(false);
  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];
  const score = choice === currentQuestion.isCorrect && reason === currentQuestion.correctReasonIndex ? 1 : choice === currentQuestion.isCorrect ? 0.5 : 0;
  const isLastQuestion = questionIndex >= questions.length - 1;
  const canCheck = !checked && choice !== null && reason !== null;
  const outcomeLabel = score === 1 ? 'Perfect reasoning' : score === 0.5 ? 'Good start' : 'Not correct yet';
  const isPerfect = checked && score === 1;
  const isPartial = checked && score === 0.5;

  useEffect(() => {
    setQuestionIndex(0);
    setTotalScore(0);
    setChoice(null);
    setReason(null);
    setChecked(false);
    completionSentRef.current = false;
  }, [questions]);

  const handleResetQuiz = () => {
    setQuestionIndex(0);
    setTotalScore(0);
    setChoice(null);
    setReason(null);
    setChecked(false);
    completionSentRef.current = false;
  };

  const choiceTone = (value: boolean) => {
    const idleSelected = value
      ? 'border-emerald-500 bg-white text-emerald-900 shadow-sm'
      : 'border-rose-500 bg-white text-rose-900 shadow-sm';
    const idleUnselected = value
      ? 'border-slate-200 bg-white text-emerald-800 hover:border-emerald-300'
      : 'border-slate-200 bg-white text-rose-800 hover:border-rose-300';

    if (!checked) {
      if (choice === value) return idleSelected;
      return idleUnselected;
    }

    const isSelected = choice === value;
    const isCorrectChoice = value === currentQuestion.isCorrect;
    if (isSelected && isCorrectChoice) return 'microbreak-correct border-emerald-300 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 shadow-sm';
    if (isSelected && !isCorrectChoice) return 'microbreak-wrong border-rose-300 bg-gradient-to-br from-rose-100 to-orange-100 text-rose-900 shadow-sm';
    if (!isSelected && isCorrectChoice) return 'border-emerald-200 bg-emerald-50/80 text-emerald-700';
    return 'border-slate-200 bg-slate-50 text-slate-500';
  };

  const reasonTone = (idx: number) => {
    if (!checked) {
      if (reason === idx) return 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm';
      return 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50';
    }

    const isSelected = reason === idx;
    const isCorrectReason = idx === currentQuestion.correctReasonIndex;
    if (isSelected && isCorrectReason) return 'microbreak-correct border-emerald-300 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 shadow-sm';
    if (isSelected && !isCorrectReason) return 'microbreak-wrong border-rose-300 bg-gradient-to-br from-rose-100 to-orange-100 text-rose-900 shadow-sm';
    if (!isSelected && isCorrectReason) return 'border-emerald-200 bg-emerald-50/80 text-emerald-700';
    return 'border-slate-200 bg-slate-50 text-slate-500';
  };

  const reasonBadgeTone = (idx: number) => {
    if (!checked) return reason === idx ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600';
    if (idx === currentQuestion.correctReasonIndex) return 'bg-emerald-100 text-emerald-700';
    if (reason === idx && idx !== currentQuestion.correctReasonIndex) return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 240 }}
      className={`w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border overflow-hidden transition-colors ${
        isPerfect
          ? 'border-emerald-200'
          : checked
            ? 'border-rose-200'
            : 'border-slate-100/80'
      }`}
    >
      <div className={`px-6 md:px-8 py-5 border-b transition-colors ${
        isPerfect
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-100'
          : checked
            ? 'bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border-rose-100'
            : 'bg-gradient-to-r from-indigo-50/90 via-blue-50/90 to-cyan-50/90 border-slate-100'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            is-correct-why
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-widest">
            <div className={`rounded-full px-3 py-1.5 text-center transition-colors ${choice !== null ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Step 1</div>
            <div className={`rounded-full px-3 py-1.5 text-center transition-colors ${reason !== null ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Step 2</div>
            <div className={`rounded-full px-3 py-1.5 text-center transition-colors ${checked ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Check</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Question {questionIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white p-6 md:p-7 shadow-sm"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">Statement</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`statement-${questionIndex}`}
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.24 }}
              className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-slate-800"
            >
              {currentQuestion.statement}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/70 p-4 md:p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Step 1: Is this correct?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              type="button"
              disabled={checked}
              whileHover={checked ? undefined : { y: -2 }}
              whileTap={checked ? undefined : { scale: 0.99 }}
              onClick={() => {
                if (soundEnabled) playClickSound(0.2);
                setChoice(true);
              }}
                className={`microbreak-card-glide flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-base font-extrabold transition-all ${choiceTone(true)}`}
              >
              <CheckCircle2 className="h-5 w-5" />
              Correct
            </motion.button>
            <motion.button
              type="button"
              disabled={checked}
              whileHover={checked ? undefined : { y: -2 }}
              whileTap={checked ? undefined : { scale: 0.99 }}
              onClick={() => {
                if (soundEnabled) playClickSound(0.2);
                setChoice(false);
              }}
                className={`microbreak-card-glide flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-base font-extrabold transition-all ${choiceTone(false)}`}
              >
              <XCircle className="h-5 w-5" />
              Incorrect
            </motion.button>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/60 p-4 md:p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Step 2: Pick the best reason</p>
          <div className="space-y-2">
            {currentQuestion.reasons.map((r, idx) => (
              <motion.button
                key={`reason-${questionIndex}-${idx}-${r}`}
                type="button"
                disabled={checked}
                whileHover={checked ? undefined : { y: -1 }}
                whileTap={checked ? undefined : { scale: 0.995 }}
                style={{ animationDelay: `${idx * 45}ms` }}
                onClick={() => {
                  if (soundEnabled) playClickSound(0.2);
                  setReason(idx);
                }}
                className={`microbreak-stagger microbreak-card-glide block w-full rounded-2xl border px-4 py-3.5 text-left text-base font-semibold transition-all ${reasonTone(idx)}`}
              >
                <span className={`mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${reasonBadgeTone(idx)}`}>{String.fromCharCode(65 + idx)}</span>
                <span>{r}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {checked ? (
            <motion.div
              key="icw-feedback"
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className={`rounded-3xl border p-5 text-sm ${score > 0 ? 'microbreak-correct border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-emerald-900' : 'microbreak-wrong border-rose-200 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 text-rose-900'}`}
            >
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                Scored
              </div>
              <p className="text-base font-extrabold tracking-tight">{outcomeLabel}</p>
              {currentQuestion.explanation ? <p className="mt-2 leading-relaxed">{currentQuestion.explanation}</p> : null}
              <div className="mt-3 text-xs font-bold uppercase tracking-widest opacity-80">
                {isPerfect ? '1.0 / 1.0' : isPartial ? '0.5 / 1.0' : '0.0 / 1.0'}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 md:px-8 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Step 3: Check your answer</p>
        {!checked ? (
          <button
            type="button"
            disabled={!canCheck}
            onClick={() => {
              if (!canCheck) return;
              if (soundEnabled) playClickSound(0.25);
              if (soundEnabled) {
                if (score >= 1) playSound('success', 0.45);
                else if (score >= 0.5) playSound('success', 0.3);
                else playSound('failure', 0.35);
              }
              setChecked(true);
            }}
            className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
              canCheck
                ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_12px_30px_-12px_rgba(79,70,229,0.7)] hover:brightness-105 active:scale-[0.99]'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playClickSound(0.25);
              const nextTotal = totalScore + score;
              if (isLastQuestion) {
                const accuracy = (nextTotal / Math.max(1, questions.length)) * 100;
                if (!completionSentRef.current) {
                  completionSentRef.current = true;
                  setTimeout(() => onDone(nextTotal, accuracy), 0);
                }
                return;
              }
              setTotalScore(nextTotal);
              setQuestionIndex((prev) => prev + 1);
              setChoice(null);
              setReason(null);
              setChecked(false);
            }}
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-wide text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-[0_12px_30px_-12px_rgba(79,70,229,0.7)] transition-all hover:brightness-105 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
        <button
          type="button"
          onClick={handleResetQuiz}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          Reset Quiz
        </button>
      </div>
    </motion.div>
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
      <button disabled={checked || first === null || second === null} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(score, score * 100); }} className={primaryActionButtonClass}>Check</button>
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
          <div key={item.text} style={{ animationDelay: `${idx * 35}ms` }} className={`microbreak-stagger microbreak-card-glide flex items-center justify-between rounded border p-2 text-xs ${checked ? (assignedBin === item.correctBin ? 'microbreak-correct' : 'microbreak-wrong') : ''} ${rowTone}`}>
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
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(correct, (correct / Math.max(1, total)) * 100); }} className={primaryActionButtonClass}>Check</button>
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
        <div key={`${pair.scenario}-${idx}`} style={{ animationDelay: `${idx * 35}ms` }} className={`microbreak-stagger microbreak-card-glide rounded border p-2 text-xs ${checked ? (assigned[idx] === pair.answer ? 'microbreak-correct border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30' : 'microbreak-wrong border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-900/30') : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
          <p className="mb-1">{pair.scenario}</p>
          <select disabled={checked} value={assigned[idx] ?? ''} onChange={(e) => { if (soundEnabled) playClickSound(0.2); setAssigned((p) => ({ ...p, [idx]: e.target.value })); }} className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800">
            <option value="">Select answer</option>
            {answers.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      ))}
      <button disabled={checked} onClick={() => { if (soundEnabled) playClickSound(0.25); setChecked(true); onDone(correct, (correct / Math.max(1, total)) * 100); }} className={primaryActionButtonClass}>Check</button>
    </div>
  );
}

function FormulaBuildGame({ content, done, soundEnabled, onDone, onSkip }: { content: FormulaBuildGameContent; done: boolean; soundEnabled: boolean; onDone: (score: number, accuracy: number) => void; onSkip: () => void; }) {
  const shouldReduceMotion = useReducedMotion();
  const animTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 400, damping: 32, mass: 0.8 };

  const formulaQuestions = useMemo(() => {
    const rawQuestions = Array.isArray(content.questions) ? content.questions : [];
    if (rawQuestions.length > 0) {
      const first = rawQuestions[0];
      const firstQuestion = {
        prompt: first?.prompt ?? content.prompt ?? 'Build the formula',
        tokens: Array.isArray(first?.tokens) ? first.tokens : content.tokens,
        correctSequence: Array.isArray(first?.correctSequence) ? first.correctSequence : content.correctSequence,
        timerSeconds: typeof first?.timerSeconds === 'number' ? first.timerSeconds : content.timerSeconds,
      };
      return [firstQuestion];
    }

    return [{
      prompt: content.prompt ?? 'Build the formula',
      tokens: content.tokens,
      correctSequence: content.correctSequence,
      timerSeconds: content.timerSeconds,
    }];
  }, [content]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const currentQuestion = formulaQuestions[questionIndex] ?? formulaQuestions[0];
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [displayTokens, setDisplayTokens] = useState<string[]>([]);

  useEffect(() => {
    const sourceTokens = currentQuestion?.tokens ?? [];
    setDisplayTokens(shuffleArray(sourceTokens));
  }, [currentQuestion, questionIndex, shuffleNonce]);

  const initialTokens = useMemo(() => {
    return displayTokens.map((value, index) => ({
      id: `token-${index}-${value}`,
      value,
    }));
  }, [displayTokens]);
  const tokenById = useMemo(() => new Map(initialTokens.map((token) => [token.id, token])), [initialTokens]);

  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [mistakesInCurrentQuestion, setMistakesInCurrentQuestion] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [shake, setShake] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const completedRef = useRef<boolean>(false);
  const checkInFlightRef = useRef<boolean>(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimeouts = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = null;
    }
  }, []);
  const resolvedSelectedTokens = useMemo(
    () => selectedTokenIds.map((id) => tokenById.get(id)).filter((token): token is { id: string; value: string } => Boolean(token)),
    [selectedTokenIds, tokenById]
  );

  useEffect(() => {
    setQuestionIndex(0);
    setAccumulatedScore(0);
    setTotalMistakes(0);
    setSelectedTokenIds([]);
    setMistakesInCurrentQuestion(0);
    setIsComplete(false);
    setFeedback('idle');
    setShake(false);
    setHasStarted(false);
    startTimeRef.current = Date.now();
    completedRef.current = false;
    checkInFlightRef.current = false;
    clearPendingTimeouts();
  }, [content, formulaQuestions, clearPendingTimeouts]);

  useEffect(() => {
    setSelectedTokenIds([]);
    setMistakesInCurrentQuestion(0);
    setFeedback('idle');
    setShake(false);
    setHasStarted(false);
    startTimeRef.current = Date.now();
    checkInFlightRef.current = false;
    clearPendingTimeouts();
  }, [questionIndex, currentQuestion, content.timerSeconds, clearPendingTimeouts]);

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, [clearPendingTimeouts]);

  const handleCheck = useCallback(() => {
    if (checkInFlightRef.current) return;
    if (!currentQuestion || isComplete || selectedTokenIds.length === 0 || completedRef.current || done) return;
    checkInFlightRef.current = true;
    if (soundEnabled) playClickSound(0.25);

    const currentSequence = resolvedSelectedTokens.map((token) => token.value);
    const answerIsCorrect =
      currentSequence.length === currentQuestion.correctSequence.length &&
      currentSequence.every((value, index) => value === currentQuestion.correctSequence[index]);

    if (answerIsCorrect) {
      setFeedback('correct');
      setIsComplete(true);
      if (soundEnabled) playSound('success', 0.45);

      const baseScore = 1000;
      const timeBonus = 0;
      const mistakePenalty = mistakesInCurrentQuestion * 100;
      const questionScore = Math.round(Math.max(0, baseScore + timeBonus - mistakePenalty));
      const nextTotalScore = accumulatedScore + questionScore;

      advanceTimeoutRef.current = setTimeout(() => {
        if (questionIndex >= formulaQuestions.length - 1) {
          completedRef.current = true;
          const combinedMistakes = totalMistakes;
          const accuracy = Math.round((formulaQuestions.length / Math.max(1, formulaQuestions.length + combinedMistakes)) * 100);
          onDone(nextTotalScore, accuracy);
          checkInFlightRef.current = false;
          advanceTimeoutRef.current = null;
          return;
        }

        setAccumulatedScore(nextTotalScore);
        setQuestionIndex((prev) => prev + 1);
        setIsComplete(false);
        checkInFlightRef.current = false;
        advanceTimeoutRef.current = null;
      }, 1500);
      return;
    }

    setFeedback('incorrect');
    setMistakesInCurrentQuestion((prev) => prev + 1);
    setTotalMistakes((prev) => prev + 1);
    if (soundEnabled) playSound('failure', 0.35);
    setShake(true);
    shakeTimeoutRef.current = setTimeout(() => {
      setShake(false);
      shakeTimeoutRef.current = null;
    }, 500);

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback((prev) => (prev === 'incorrect' ? 'idle' : prev));
      checkInFlightRef.current = false;
      feedbackTimeoutRef.current = null;
    }, 2000);
  }, [currentQuestion, isComplete, selectedTokenIds.length, done, soundEnabled, mistakesInCurrentQuestion, accumulatedScore, questionIndex, formulaQuestions.length, totalMistakes, onDone, resolvedSelectedTokens]);

  const handleAddToken = (id: string) => {
    if (isComplete || feedback === 'correct' || done) return;
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
    }

    if (!selectedTokenIds.includes(id)) {
      if (soundEnabled) playClickSound(0.2);
      setSelectedTokenIds((prev) => [...prev, id]);
      if (feedback === 'incorrect') setFeedback('idle');
    }
  };

  const handleRemoveToken = (id: string) => {
    if (isComplete || feedback === 'correct' || done) return;
    if (soundEnabled) playClickSound(0.2);
    setSelectedTokenIds((prev) => prev.filter((tokenId) => tokenId !== id));
    if (feedback === 'incorrect') setFeedback('idle');
  };

  const handleClear = () => {
    if (isComplete || feedback === 'correct' || done) return;
    if (soundEnabled) playClickSound(0.2);
    setSelectedTokenIds([]);
    if (feedback === 'incorrect') setFeedback('idle');
  };

  const handleResetRound = () => {
    if (soundEnabled) playClickSound(0.3);
    clearPendingTimeouts();
    completedRef.current = false;
    setQuestionIndex(0);
    setAccumulatedScore(0);
    setTotalMistakes(0);
    setSelectedTokenIds([]);
    setMistakesInCurrentQuestion(0);
    setIsComplete(false);
    setFeedback('idle');
    setShake(false);
    setHasStarted(false);
    startTimeRef.current = Date.now();
    setShuffleNonce((prev) => prev + 1);
    checkInFlightRef.current = false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col font-sans relative">
      <div className="px-8 py-6 flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100/50">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Formula Build</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleResetRound}
            className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-xl px-3 py-2 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" /> RESET
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playClickSound(0.3);
              onSkip();
            }}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-xl px-3 py-2 hover:bg-slate-50"
          >
            SKIP <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-8 pb-8 flex flex-col gap-10">
        {currentQuestion?.prompt && (
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl text-slate-800 font-extrabold tracking-tight leading-tight">
              {currentQuestion.prompt}
            </h3>
            {formulaQuestions.length > 1 && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Formula {questionIndex + 1} of {formulaQuestions.length}
              </p>
            )}
          </div>
        )}

        <LayoutGroup>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Answer</label>
              {selectedTokenIds.length > 0 && !isComplete && (
                <button
                  onClick={handleClear}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg px-3 py-1.5 uppercase tracking-wider"
                  aria-label="Reset formula"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> RESET
                </button>
              )}
            </div>

            <motion.div
              layout
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`relative min-h-[140px] p-6 rounded-[1.5rem] flex flex-wrap gap-3 items-center justify-center transition-colors border-2 ${
                feedback === 'correct' ? 'bg-emerald-50/50 border-emerald-200'
                  : feedback === 'incorrect' ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/50 border-dashed border-slate-200'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {selectedTokenIds.length === 0 && (
                  <motion.div
                    key="empty-placeholder"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={animTransition}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-slate-400 font-medium text-center px-4">Tap tokens below to build the formula</span>
                  </motion.div>
                )}

                {resolvedSelectedTokens.map((token) => {
                  return (
                    <motion.button
                      layout
                      layoutId={`token-${token.id}`}
                      key={`answer-${token.id}`}
                      onClick={() => handleRemoveToken(token.id)}
                      disabled={isComplete || done}
                      transition={animTransition}
                      className={`relative px-6 py-3 rounded-xl font-mono text-2xl font-bold transition-colors cursor-pointer select-none flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 z-20 ${
                        feedback === 'correct'
                          ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_4px_0_0_#059669] focus-visible:ring-emerald-500'
                          : feedback === 'incorrect'
                            ? 'bg-rose-500 text-white border-2 border-rose-600 shadow-[0_4px_0_0_#e11d48] focus-visible:ring-rose-500'
                            : 'bg-indigo-500 text-white border-2 border-indigo-600 shadow-[0_4px_0_0_#4f46e5] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#4f46e5] active:translate-y-1 active:shadow-none focus-visible:ring-indigo-500'
                      }`}
                      aria-label={`Remove ${token.value}`}
                    >
                      {token.value}
                      {!isComplete && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm scale-75 group-hover:scale-100">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            <div aria-live="polite" className="sr-only">
              Current formula: {resolvedSelectedTokens.map((token) => token.value).join(', ')}
            </div>
            <div aria-live="assertive" className="sr-only">
              {feedback === 'correct' ? 'Correct! Formula built successfully.' : feedback === 'incorrect' ? 'Incorrect formula. Please try again.' : ''}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full h-px bg-slate-100 mb-2"></div>
            <div className="flex flex-wrap gap-3 justify-center">
              {initialTokens.map((token) => {
                const isSelected = selectedTokenIds.includes(token.id);
                return (
                  <div key={token.id} className="relative">
                    <div className="px-6 py-3 border-2 border-transparent opacity-0 pointer-events-none font-mono text-2xl font-bold">
                      {token.value}
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key={`placeholder-${token.id}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="absolute inset-0 px-6 py-3 bg-slate-100 border-2 border-slate-200/50 rounded-xl font-mono text-2xl font-bold text-slate-300 flex items-center justify-center pointer-events-none"
                        >
                          {token.value}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!isSelected && (
                        <motion.button
                          layout
                          layoutId={`token-${token.id}`}
                          key={`bank-${token.id}`}
                          onClick={() => handleAddToken(token.id)}
                          disabled={isComplete || done}
                          transition={animTransition}
                          className="absolute inset-0 px-6 py-3 bg-white border-2 border-slate-200 shadow-[0_4px_0_0_#e2e8f0] rounded-xl font-mono text-2xl font-bold text-slate-700 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#e2e8f0] hover:border-slate-300 active:translate-y-1 active:shadow-none transition-colors cursor-pointer select-none flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 z-10"
                          aria-label={`Add ${token.value}`}
                        >
                          {token.value}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </LayoutGroup>

        <div className="pt-6 mt-2 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {feedback === 'incorrect' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 text-rose-500 font-bold mb-4"
              >
                <AlertCircle className="w-5 h-5" />
                That doesn&apos;t look quite right.
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleCheck}
            disabled={selectedTokenIds.length === 0 || isComplete || done}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
              selectedTokenIds.length === 0 || isComplete || done
                ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                : feedback === 'correct'
                  ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_4px_0_0_#059669] focus-visible:ring-emerald-500'
                  : 'bg-indigo-500 text-white border-2 border-indigo-600 shadow-[0_4px_0_0_#4f46e5] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#4f46e5] active:translate-y-1 active:shadow-none focus-visible:ring-indigo-500'
            }`}
          >
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Perfect!
              </>
            ) : (
              'CHECK ANSWER'
            )}
          </button>
        </div>
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
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctLineIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className={primaryActionButtonClass}>Check</button>
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
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctOptionIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className={primaryActionButtonClass}>Check</button>
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
      <button disabled={checked || selected === null} onClick={() => { if (soundEnabled) playClickSound(0.25); const isCorrect = selected === content.correctIndex; setChecked(true); onDone(isCorrect ? 1 : 0, isCorrect ? 100 : 0); }} className={primaryActionButtonClass}>Check</button>
    </div>
  );
}

function AdvancedGameBody(props: {
  content: AdvancedGameContent;
  done: boolean;
  soundEnabled: boolean;
  onDone: (score: number, accuracy: number) => void;
  onSkip: () => void;
}) {
  switch (props.content.gameType) {
    case 'sequencing':
      return <SequencingGame {...props} content={props.content} />;
    case 'fill-gap':
      return <FillGapGame {...props} content={props.content} />;
    case 'is-correct-why':
      return <IsCorrectWhyReplacementGame {...props} content={props.content} />;
    case 'diagnosis-ranked':
      return <DiagnosisRankedReplacementGame {...props} content={props.content} />;
    case 'classify-two-bins':
      return <ClassifyTwoBinsReplacementGame {...props} content={props.content} />;
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
