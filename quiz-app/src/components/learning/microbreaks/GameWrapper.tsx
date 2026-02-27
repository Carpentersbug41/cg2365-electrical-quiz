'use client';

import { useState, useEffect } from 'react';
import { triggerCelebration, playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface GameWrapperProps {
  title: string;
  duration: number;
  instruction?: string;
  motionPreset?: 'soft' | 'medium' | 'bold';
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
  children: React.ReactNode | ((handleComplete: (score?: number, accuracy?: number) => void) => React.ReactNode);
  disableTimer?: boolean;
  disableCelebration?: boolean;
}

export default function GameWrapper({
  title,
  duration,
  instruction,
  motionPreset = 'medium',
  onComplete,
  onSkip,
  children,
  disableTimer = false,
  disableCelebration = false,
}: GameWrapperProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isCompleted || disableTimer) return;

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isCompleted, disableTimer]);

  const handleComplete = (score?: number, accuracy?: number) => {
    if (isCompleted) return;
    setIsCompleted(true);

    const shouldCelebrate = !disableCelebration && (accuracy === undefined || accuracy === 100);

    if (shouldCelebrate) {
      playSound('success', 0.7);
      triggerCelebration();
    }

    setTimeout(() => {
      onComplete(score, accuracy);
    }, shouldCelebrate ? 1500 : 500);
  };

  return (
    <div className={`microbreak-enter microbreak-enter-slow microbreak-game-${motionPreset} relative overflow-hidden rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-emerald-50 to-pink-50 p-6 shadow-xl dark:border-cyan-700 dark:from-slate-800 dark:via-teal-900 dark:to-indigo-900`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-pink-400 opacity-85" />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="microbreak-float text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">Quick Break Activity</p>
        </div>
        <div className="flex items-center gap-4">
          {!disableTimer && (
            <div className="microbreak-soft-pulse rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:bg-slate-700 dark:text-slate-300">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <button
            onClick={() => {
              playClickSound(0.3);
              onSkip();
            }}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-200"
          >
            Skip {'->'}
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-cyan-200 bg-white/85 px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-cyan-700 dark:bg-slate-800/70 dark:text-slate-200">
        {instruction ?? 'Follow the on-screen prompt, then submit your answer to check it.'}
      </div>

      <div className="mt-4">{typeof children === 'function' ? children(handleComplete) : children}</div>
    </div>
  );
}
