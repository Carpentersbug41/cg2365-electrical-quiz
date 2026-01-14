/**
 * Prerequisite Gate Component
 * Shows locked content until prerequisites are mastered
 */

'use client';

import Link from 'next/link';
import { getQuizProgress } from '@/lib/progress/progressService';
import { getLessonById } from '@/data/lessons/lessonIndex';

interface PrerequisiteGateProps {
  prerequisites: string[]; // Lesson IDs
  quizTitle: string;
}

export default function PrerequisiteGate({ 
  prerequisites, 
  quizTitle 
}: PrerequisiteGateProps) {
  // Check which prerequisites are not met
  const prerequisiteDetails = prerequisites.map(prereqId => {
    const progress = getQuizProgress(`${prereqId}-quiz`);
    const lesson = getLessonById(prereqId);
    return {
      id: prereqId,
      title: lesson?.title || prereqId,
      masteryAchieved: progress?.masteryAchieved || false,
      masteryPending: progress?.masteryPending || false,
    };
  });

  const completedCount = prerequisiteDetails.filter(p => p.masteryAchieved).length;
  const totalCount = prerequisites.length;

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-8 border-2 border-red-300 dark:border-red-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-5xl">🔒</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-3">
            Prerequisites Required
          </h3>
          <p className="text-red-800 dark:text-red-300 mb-2 text-lg">
            Master the prerequisite lessons before accessing <strong>{quizTitle}</strong>.
          </p>
          <p className="text-red-700 dark:text-red-400 mb-6 text-sm">
            Progress: <strong>{completedCount}/{totalCount}</strong> prerequisites mastered
          </p>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Required Mastery:
            </p>
            {prerequisiteDetails.map((prereq) => {
              return (
                <div
                  key={prereq.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    prereq.masteryAchieved
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">
                    {prereq.masteryAchieved ? '✓' : '🔒'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {prereq.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      {prereq.masteryAchieved 
                        ? '✓ Mastered' 
                        : prereq.masteryPending 
                        ? '⏳ Pending retest' 
                        : '🔒 Not yet mastered'}
                    </p>
                  </div>
                  {!prereq.masteryAchieved && (
                    <Link
                      href={`/learn/${prereq.id}`}
                      className="px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Start
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-md"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Go to Lessons
            </Link>
          </div>

          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
              <span>💡</span>
              Why the Wait?
            </h4>
            <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
              Interleaved practice is most effective <strong>after</strong> you've mastered each concept separately. 
              Complete and master the prerequisite lessons first, then come back here to practice discrimination between concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

