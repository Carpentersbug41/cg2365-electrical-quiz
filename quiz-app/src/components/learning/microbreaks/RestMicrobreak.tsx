'use client';

import { useState, useEffect } from 'react';
import { RestMicrobreakContent } from '@/data/lessons/types';
import { playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface RestMicrobreakProps {
  content: RestMicrobreakContent;
  onComplete: () => void;
  onSkip: () => void;
}

export default function RestMicrobreak({ content, onComplete, onSkip }: RestMicrobreakProps) {
  const [countdown, setCountdown] = useState(content.duration);

  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }
    
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl shadow-xl p-8 border-2 border-green-200 dark:border-green-700 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 mb-4">
          <span className="text-4xl">🧘</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Take a Quick Break</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Your brain needs a moment to consolidate what you&apos;ve learned
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-slate-700">
        <p className="text-gray-700 dark:text-slate-300 mb-4">
          {content.message || "Look away from the screen. Stretch your shoulders. Take a deep breath."}
        </p>
        <div className="text-6xl font-bold text-green-600 dark:text-green-400">
          {countdown}s
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-slate-500 italic">
          Research shows short breaks improve focus and retention
        </p>
        <button 
          onClick={() => {
            playClickSound(0.3);
            onSkip();
          }}
          className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors underline"
        >
          Skip Break →
        </button>
      </div>
    </div>
  );
}
