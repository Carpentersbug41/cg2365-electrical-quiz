/**
 * Review Dashboard Widget
 * Shows due reviews and scheduled reviews
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getReviewsDue, getUpcomingReviews, getReviewStats } from '@/lib/progress/reviewScheduler';
import { getLessonById } from '@/data/lessons/lessonIndex';
import { SpacedReviewItem } from '@/lib/progress/types';

export default function ReviewDashboard() {
  const [dueReviews, setDueReviews] = useState<SpacedReviewItem[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<SpacedReviewItem[]>([]);
  const [stats, setStats] = useState({ dueToday: 0, dueThisWeek: 0, totalScheduled: 0, streak: 0 });

  useEffect(() => {
    const due = getReviewsDue();
    const upcoming = getUpcomingReviews(7);
    const reviewStats = getReviewStats();

    setDueReviews(due);
    setUpcomingReviews(upcoming);
    setStats(reviewStats);
  }, []);

  if (stats.totalScheduled === 0) {
    return null; // Don't show if no reviews scheduled
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2 mb-1">
            <span className="text-3xl">📅</span>
            Spaced Review
          </h2>
          <p className="text-purple-700 dark:text-purple-300 text-sm">
            Keep your knowledge fresh with spaced repetition
          </p>
        </div>

        {stats.streak > 0 && (
          <div className="bg-purple-100 dark:bg-purple-900/50 rounded-xl px-4 py-2 border border-purple-300 dark:border-purple-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                {stats.streak}
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                Day Streak 🔥
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.dueToday}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">
            Due Today
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.dueThisWeek}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">
            This Week
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalScheduled}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">
            Scheduled
          </div>
        </div>
      </div>

      {/* Due Reviews */}
      {dueReviews.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
            <span>⏰</span>
            Ready to Review
          </h3>
          <div className="space-y-2">
            {dueReviews.slice(0, 3).map((review) => {
              const lesson = getLessonById(review.lessonId);
              const daysSinceReview = Math.floor(
                (Date.now() - new Date(review.lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Link
                  key={review.itemId}
                  href={`/learn/${review.lessonId}/quiz?review=true`}
                  className="block bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {lesson?.title || review.lessonId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Last reviewed {daysSinceReview} day{daysSinceReview !== 1 ? 's' : ''} ago
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                        Due
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {dueReviews.length > 3 && (
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2 text-center">
              + {dueReviews.length - 3} more review{dueReviews.length - 3 !== 1 ? 's' : ''} due
            </p>
          )}
        </div>
      )}

      {/* Upcoming Reviews */}
      {upcomingReviews.length > 0 && dueReviews.length === 0 && (
        <div>
          <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
            <span>📆</span>
            Coming Up
          </h3>
          <div className="space-y-2">
            {upcomingReviews.slice(0, 2).map((review) => {
              const lesson = getLessonById(review.lessonId);
              const daysUntil = Math.ceil(
                (new Date(review.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={review.itemId}
                  className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {lesson?.title || review.lessonId}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {dueReviews.length === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 text-center">
          <p className="text-green-800 dark:text-green-300 font-medium text-sm flex items-center justify-center gap-2">
            <span>✅</span>
            All caught up! Check back later for more reviews.
          </p>
        </div>
      )}
    </div>
  );
}


