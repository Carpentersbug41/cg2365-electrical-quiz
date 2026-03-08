'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react';
import { DiagnosisRankedGameContent } from '@/data/lessons/types';
import { playClickSound, playSound } from '@/lib/microbreaks/celebrationEffects';

interface DiagnosisRankedReplacementGameProps {
  content: DiagnosisRankedGameContent;
  done: boolean;
  soundEnabled: boolean;
  onSkip: () => void;
  onDone: (score: number, accuracy: number) => void;
}

export default function DiagnosisRankedReplacementGame({
  content,
  done,
  soundEnabled,
  onSkip,
  onDone,
}: DiagnosisRankedReplacementGameProps) {
  const [selections, setSelections] = useState<[number | null, number | null]>([null, null]);
  const [gameState, setGameState] = useState<'playing' | 'checked'>('playing');
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);

  const [correct1, correct2] = content.correctRankedIndices;

  useEffect(() => {
    setSelections([null, null]);
    setGameState('playing');
    setTimeLeft(content.timerSeconds ?? null);
  }, [content]);

  useEffect(() => {
    if (done || gameState !== 'playing' || timeLeft === null || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(id);
  }, [done, gameState, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      setGameState('checked');
    }
  }, [timeLeft, gameState]);

  const handleOptionClick = (index: number) => {
    if (done || gameState !== 'playing') return;

    const slotIndex = selections.indexOf(index);
    if (slotIndex !== -1) {
      const next = [...selections] as [number | null, number | null];
      next[slotIndex] = null;
      setSelections(next);
      if (soundEnabled) playClickSound(0.2);
      return;
    }

    const emptySlotIndex = selections.indexOf(null);
    if (emptySlotIndex !== -1) {
      const next = [...selections] as [number | null, number | null];
      next[emptySlotIndex] = index;
      setSelections(next);
      if (soundEnabled) playClickSound(0.2);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (done || gameState !== 'playing') return;
    if (selections[slotIndex] !== null) {
      const next = [...selections] as [number | null, number | null];
      next[slotIndex] = null;
      setSelections(next);
      if (soundEnabled) playClickSound(0.2);
    }
  };

  const score = useMemo(() => {
    const [rank1, rank2] = selections;
    if (rank1 === correct1 && rank2 === correct2) return 1;
    if (rank1 === correct1) return 0.5;
    return 0;
  }, [selections, correct1, correct2]);

  const accuracy = score * 100;
  const isReadyToCheck = selections[0] !== null && selections[1] !== null;
  const isPerfect = score === 1;

  const handleCheck = () => {
    if (done || gameState !== 'playing' || !isReadyToCheck) return;
    setGameState('checked');
    if (soundEnabled) {
      playSound(score === 1 ? 'success' : score > 0 ? 'success' : 'failure', score > 0 ? 0.3 : 0.25);
    }
  };

  const handleComplete = () => {
    if (done || gameState !== 'checked') return;
    if (soundEnabled) playClickSound(0.25);
    onDone(score, accuracy);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-slate-500">
            {timeLeft !== null ? (
              <>
                <Clock className="h-5 w-5" />
                <span className={timeLeft <= 10 && gameState === 'playing' ? 'animate-pulse text-rose-500' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </>
            ) : null}
          </div>
          {gameState === 'playing' ? (
            <button
              onClick={() => {
                if (soundEnabled) playClickSound(0.2);
                onSkip();
              }}
              className="rounded-md px-2 py-1 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Skip
            </button>
          ) : null}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">{content.scenario}</h2>
          {content.prompt ? <p className="mb-2 font-medium text-slate-700">{content.prompt}</p> : null}
          {content.instructions && gameState === 'playing' ? (
            <p className="text-sm text-slate-500">{content.instructions}</p>
          ) : null}
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {[0, 1].map((slotIndex) => {
            const selectedIndex = selections[slotIndex];
            const hasSelection = selectedIndex !== null;
            const isCorrect = gameState === 'checked' && selectedIndex === content.correctRankedIndices[slotIndex];
            return (
              <button
                key={slotIndex}
                onClick={() => handleSlotClick(slotIndex)}
                disabled={gameState === 'checked' || !hasSelection}
                className={`relative flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-2xl border-2 p-5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  gameState === 'checked'
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : hasSelection
                      ? 'cursor-pointer border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm hover:bg-indigo-100'
                      : 'border-dashed border-slate-300 bg-slate-50 text-slate-500'
                }`}
                aria-label={`Rank ${slotIndex + 1} slot`}
              >
                <span className="mb-2 text-xs font-bold uppercase tracking-wider opacity-70">
                  {slotIndex === 0 ? '1st Choice (Best)' : '2nd Choice'}
                </span>
                {hasSelection ? (
                  <span className="text-sm font-medium sm:text-base">{content.options[selectedIndex]}</span>
                ) : (
                  <span className="text-sm opacity-70">Click an option below</span>
                )}
                {gameState === 'checked' && hasSelection ? (
                  <div className="absolute -right-3 -top-3 rounded-full bg-white shadow-sm">
                    {isCorrect ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <XCircle className="h-8 w-8 text-rose-500" />}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {content.options.map((option, idx) => {
            const isSelected = selections.includes(idx);
            const slotIndex = selections.indexOf(idx);
            return (
              <button
                key={`${option}-${idx}`}
                onClick={() => handleOptionClick(idx)}
                disabled={gameState === 'checked' || done || isSelected}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected || gameState === 'checked'
                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-50'
                    : 'cursor-pointer border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
                aria-label={`Option ${idx + 1}`}
              >
                <span className="text-sm font-medium text-slate-700 sm:text-base">{option}</span>
                {isSelected ? (
                  <span className="ml-3 whitespace-nowrap rounded-md bg-slate-200 px-2 py-1 text-xs font-bold text-slate-600">
                    Rank {slotIndex + 1}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {gameState === 'checked' ? (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              className="overflow-hidden"
            >
              <div className={`rounded-2xl border p-6 ${isPerfect ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'}`}>
                <h3 className={`flex items-center gap-2 text-lg font-bold ${isPerfect ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {isPerfect ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                  {isPerfect ? 'Perfect!' : score > 0 ? 'Partial Credit' : 'Incorrect'}
                </h3>
                {!isPerfect ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-amber-900">Correct Ranking:</p>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-amber-800 sm:text-base">
                      <li>{content.options[correct1]}</li>
                      <li>{content.options[correct2]}</li>
                    </ol>
                  </div>
                ) : null}
                {content.rationale ? (
                  <div className="mt-5 border-t border-black/5 pt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-900">Rationale:</p>
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{content.rationale}</p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
        {gameState === 'playing' ? (
          <button
            onClick={handleCheck}
            disabled={!isReadyToCheck || done}
            className={`w-full rounded-xl py-4 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isReadyToCheck ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Continue <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
