/**
 * Mastery Gate Component
 * Displays mastery status and enforces delayed retest requirements
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LessonProgress, QuizProgress } from '@/lib/progress/types';
import { isMasteryReviewDue } from '@/lib/progress/progressService';

interface MasteryGateProps {
  progress: LessonProgress | QuizProgress;
  lessonId: string;
  lessonTitle: string;
  onRetestReady?: () => void;
}

export default function MasteryGate({
  progress,
  lessonId,
  lessonTitle,
  onRetestReady,
}: MasteryGateProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!progress.nextReviewAt) return;

    const updateTimer = () => {
      const now = new Date();
      const reviewDate = new Date(progress.nextReviewAt!);
      const diff = reviewDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsReady(true);
        setTimeRemaining('Ready now!');
        onRetestReady?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days} day${days > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [progress.nextReviewAt, onRetestReady]);

  // Mastery achieved - show celebration
  if (progress.masteryAchieved) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border-2 border-green-300 dark:border-green-700">
        <div className="text-center">
          <div className="text-6xl mb-3">🏆</div>
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
            Mastery Achieved!
          </h3>
          <p className="text-green-700 dark:text-green-400 mb-4">
            You&apos;ve demonstrated true understanding of <strong>{lessonTitle}</strong> through delayed recall.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>This learning has stuck!</span>
          </div>
        </div>
      </div>
    );
  }

  // Mastery pending - awaiting delayed retest
  if (progress.masteryPending) {
    const isDue = isMasteryReviewDue(progress);

    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg p-6 border-2 border-amber-300 dark:border-amber-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            {isDue || isReady ? '🔔' : '⏳'}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-2">
              {isDue || isReady ? 'Retest Ready!' : 'Mastery Pending'}
            </h3>
            
            {isDue || isReady ? (
              <>
                <p className="text-amber-800 dark:text-amber-300 mb-4">
                  You passed <strong>{lessonTitle}</strong>! Now let&apos;s confirm your mastery with a delayed retest.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                  This measures true learning - can you recall it after a delay?
                </p>
                <Link
                  href={`/learn/${lessonId}/quiz?retest=true`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Start Retest
                </Link>
              </>
            ) : (
              <>
                <p className="text-amber-800 dark:text-amber-300 mb-3">
                  Great job passing <strong>{lessonTitle}</strong>! Your retest will be ready in:
                </p>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 border border-amber-200 dark:border-amber-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Time until retest:
                    </span>
                    <span className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                      {timeRemaining}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                  <strong>Why wait?</strong> Delayed testing confirms true mastery, not just short-term performance.
                </p>
                <Link
                  href={`/learn/${lessonId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-200 rounded-lg font-medium transition-colors border border-amber-300 dark:border-amber-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Review Lesson While You Wait
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No mastery status - shouldn't normally see this
  return null;
}


