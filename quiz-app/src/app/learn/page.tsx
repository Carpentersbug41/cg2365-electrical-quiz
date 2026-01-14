/**
 * Learn Page - Lessons Index
 * Shows all available lessons with mastery gates
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import lesson201_1A from '@/data/lessons/201-1A-health-safety-legislation.json';
import lesson202_1A from '@/data/lessons/202-1A-electrical-quantities-units.json';
import lesson202_2A from '@/data/lessons/202-2A-ohms-law.json';
import lesson202_4A from '@/data/lessons/202-4A-series-circuits.json';
import lesson202_4B from '@/data/lessons/202-4B-series-circuits-extended.json';
import lesson202_5A from '@/data/lessons/202-5A-power-energy.json';
import lesson202_6A from '@/data/lessons/202-6A-magnetism-electromagnetism.json';
import lesson202_7A from '@/data/lessons/202-7A-ac-principles.json';
import { getLessonProgress, getQuizProgress } from '@/lib/progress/progressService';
import { LessonProgress, QuizProgress } from '@/lib/progress/types';
import ReviewDashboard from '@/components/learning/ReviewDashboard';

const LESSONS = [
  lesson201_1A,
  lesson202_1A,
  lesson202_2A,
  lesson202_4A,
  lesson202_4B,
  lesson202_5A,
  lesson202_6A,
  lesson202_7A,
];

export default function LearnPage() {
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, QuizProgress | null>>({});

  useEffect(() => {
    // Load progress for all lessons
    const progress: Record<string, QuizProgress | null> = {};
    LESSONS.forEach(lesson => {
      progress[lesson.id] = getQuizProgress(`${lesson.id}-quiz`);
    });
    setLessonsProgress(progress);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Modules</h1>
              <p className="text-gray-600 dark:text-slate-300 mt-1">Select a lesson to start learning</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Lessons Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Review Dashboard */}
        <div className="mb-8">
          <ReviewDashboard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LESSONS.map((lesson) => {
            const progress = lessonsProgress[lesson.id];
            const hasMastery = progress?.masteryAchieved;
            const isPending = progress?.masteryPending;
            
            return (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.id}`}
                className="group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-indigo-200 dark:border-indigo-900 p-6 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 h-full flex flex-col">
                  {/* Lesson Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full border border-indigo-300 dark:border-indigo-700">
                        {lesson.unit}
                      </span>
                      {hasMastery && (
                        <span className="px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700 flex items-center gap-1">
                          <span>🏆</span> Mastered
                        </span>
                      )}
                      {isPending && !hasMastery && (
                        <span className="px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                          <span>⏳</span> Pending
                        </span>
                      )}
                    </div>
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {hasMastery ? '🏆' : '📚'}
                    </span>
                  </div>

                {/* Lesson Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {lesson.title}
                </h2>

                {/* Lesson Description */}
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                  {lesson.description}
                </p>

                {/* Lesson Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <span className="flex items-center gap-1">
                    <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                    {lesson.learningOutcomes.length} Outcomes
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-indigo-600 dark:text-indigo-400">📝</span>
                    {lesson.blocks.filter(b => b.type === 'practice').length} Practice
                  </span>
                </div>

                {/* Start Button */}
                <button className="mt-4 w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold group-hover:bg-indigo-700 dark:group-hover:bg-indigo-600 transition-colors shadow-md">
                  {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                </button>
              </div>
            </Link>
            );
          })}
        </div>

        {/* Interleaved Quiz Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mastery Assessment
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              After completing lessons, test your discrimination skills with mixed practice
            </p>
          </div>

          <Link
            href="/quiz/interleaved/mixed-series-parallel"
            className="group block"
          >
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="text-6xl">🔀</div>
                
                {/* Content */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold">
                      Series & Parallel: Mixed Practice
                    </h3>
                    <span className="px-3 py-1 text-xs font-bold bg-white/20 rounded-full border border-white/30">
                      Interleaved
                    </span>
                  </div>
                  
                  <p className="text-purple-100 mb-4 text-lg">
                    Test your ability to discriminate between series and parallel circuits. 
                    Questions are mixed to develop real-world problem-solving skills.
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <span className="font-semibold">Prerequisites:</span>
                      <span>202-4A & 202-4B</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <span className="font-semibold">Questions:</span>
                      <span>~14 mixed</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <span className="font-semibold">Time:</span>
                      <span>~20 min</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <span className="font-semibold">Pass:</span>
                      <span>70%</span>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                    <span>Start Mixed Quiz</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-slate-600 p-8 text-center">
          <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">More lessons coming soon...</p>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Check back for updates!</p>
        </div>
      </main>
    </div>
  );
}
