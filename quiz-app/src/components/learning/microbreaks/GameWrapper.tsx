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
    <div className={`microbreak-enter microbreak-enter-slow microbreak-game-${motionPreset} relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900`}>
      <div className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-slate-800 dark:text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Quick Break Activity</p>
        </div>
        <div className="flex items-center gap-4">
          {!disableTimer && (
            <div className="microbreak-soft-pulse rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <button
            onClick={() => {
              playClickSound(0.3);
              onSkip();
            }}
            className="p-2 -mr-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
          >
            Skip {'->'}
          </button>
        </div>
      </div>

      <div className="m-4 mb-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {instruction ?? 'Follow the on-screen prompt, then submit your answer to check it.'}
      </div>

      <div className="p-4">{typeof children === 'function' ? children(handleComplete) : children}</div>
    </div>
  );
}
