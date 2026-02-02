'use client';

import { useState, useEffect } from 'react';
import { triggerCelebration, playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface GameWrapperProps {
  title: string;
  duration: number;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
  children: React.ReactNode;
  disableTimer?: boolean;
  disableCelebration?: boolean;
}

export default function GameWrapper({ 
  title, 
  duration, 
  onComplete, 
  onSkip, 
  children,
  disableTimer = false,
  disableCelebration = false
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
    
    // Only trigger celebration for perfect score (100% accuracy)
    // If accuracy is undefined, assume it's a perfect score (for games that are all-or-nothing)
    const shouldCelebrate = !disableCelebration && (accuracy === undefined || accuracy === 100);
    
    if (shouldCelebrate) {
      // Play success sound and show random celebration
      playSound('success', 0.7); // Louder for game completion
      triggerCelebration();
    }
    
    setTimeout(() => {
      onComplete(score, accuracy);
    }, shouldCelebrate ? 1500 : 500); // Shorter delay if no celebration
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-indigo-900 rounded-2xl shadow-xl p-6 border-2 border-blue-200 dark:border-blue-700">
      {/* Header with timer and skip */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">Quick Break Activity</p>
        </div>
        <div className="flex items-center gap-4">
          {!disableTimer && (
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 px-3 py-1 rounded-full">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <button 
            onClick={() => {
              playClickSound(0.3);
              onSkip();
            }} 
            className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>
      
      {/* Pass handleComplete to children via context or props */}
      <div className="mt-4">
        {typeof children === 'function' ? children(handleComplete) : children}
      </div>
    </div>
  );
}
