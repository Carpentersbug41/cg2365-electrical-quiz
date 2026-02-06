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
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import lesson202_3AB from '@/data/lessons/202-3AB-series-circuits-linear.json';
import lesson202_4A from '@/data/lessons/202-4A-series-circuits-extended.json';
import lesson202_5A from '@/data/lessons/202-5A-power-energy.json';
import lesson202_6A from '@/data/lessons/202-6A-magnetism-electromagnetism.json';
import lesson202_7A from '@/data/lessons/202-7A-ac-principles.json';
import lesson202_7B from '@/data/lessons/202-7B-how-ac-is-generated.json';
import lesson202_7C from '@/data/lessons/202-7C-sine-wave-vocab.json';
import lesson202_7D from '@/data/lessons/202-7D-transformers.json';
import lesson204_10A from '@/data/lessons/204-10A-dead-test-language-what-each-test-proves.json';
import lesson204_10B from '@/data/lessons/204-10B-circuit-map-thinking-conductor-roles-expected-outcomes.json';
import lesson204_11A from '@/data/lessons/204-11A-rig-safe-dead-testing-mindset-and-setup.json';
import lesson204_11B from '@/data/lessons/204-11B-proving-your-tester-works.json';
import lesson204_11C from '@/data/lessons/204-11C-leads-nulling-zeroing-and-avoiding-false-readings.json';
import lesson204_12A from '@/data/lessons/204-12A-the-dead-inspection-checklist.json';
import lesson204_12B from '@/data/lessons/204-12B-inspection-decisions-and-recording.json';
import lesson204_14A from '@/data/lessons/204-14A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_14B from '@/data/lessons/204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';
import lesson204_13A from '@/data/lessons/204-13A-3-plate-ceiling-rose-loop-in-explained-for-a-total-beginner.json';
import lesson204_13B from '@/data/lessons/204-13B-ceiling-rose-to-one-way-switch-for-absolute-beginners.json';
import lesson203_1A from '@/data/lessons/203-1A-statutory-regulations-law.json';
import lesson203_1B from '@/data/lessons/203-1B-non-statutory-regulations-guidance.json';
import lesson203_1C from '@/data/lessons/203-1C-using-bs-7671-on-a-job.json';
import lesson203_2A from '@/data/lessons/203-2A-sources-drawings-symbols-scale.json';
import lesson203_2B from '@/data/lessons/203-2B-reading-installation-drawings-legend-symbols-notes-abbreviations.json';
import lesson203_2C from '@/data/lessons/203-2C-recognising-electrical-symbols-on-drawings.json';
import lesson203_2D from '@/data/lessons/203-2D-converting-drawing-scale-to-real-measurements.json';
import lesson203_3A from '@/data/lessons/203-3A-circuit-types-what-they-do-principles-of-operation.json';
import lesson203_3B from '@/data/lessons/203-3B-wiring-systems-by-environment-choosing-the-right-cable-containment.json';
import lesson203_3C from '@/data/lessons/203-3C-cable-sizing-basics-ib-in-iz-factors.json';
import lesson203_3D from '@/data/lessons/203-3D-protective-devices-basics-fuses-mcb-types-rcds-rcbos.json';
import lesson203_3E from '@/data/lessons/203-3E-specialised-installing-equipment.json';
import lesson202_3F from '@/data/lessons/202-3F-spacing-factor-enclosure-fill.json';
import lesson203_3F from '@/data/lessons/203-3F-spacing-factor-enclosure-fill.json';
import lesson203_3A11 from '@/data/lessons/203-3A11-circuit-types-what-they-do.json';
import lesson203_3A6 from '@/data/lessons/203-3A6-circuit-types-what-they-do.json';
import lesson203_3A2 from '@/data/lessons/203-3A2-circuit-types-what-they-do.json';
import lesson203_3A4 from '@/data/lessons/203-3A4-circuit-types-what-they-do.json';
import { getLessonProgress, getQuizProgress } from '@/lib/progress/progressService';
import { LessonProgress, QuizProgress } from '@/lib/progress/types';
import ReviewDashboard from '@/components/learning/ReviewDashboard';

/**
 * Natural sort function for lesson IDs
 * Sorts by: unit number (numerical) → lesson number (numerical) → suffix (alphabetical)
 * Handles formats like "204-10A", "202-3AB", "204-12B"
 */
function sortLessonsByIdNaturally(a: { id: string }, b: { id: string }) {
  const parseId = (id: string) => {
    const parts = id.split('-');
    const unit = parseInt(parts[0], 10);
    
    // Get the last part which contains lesson number + suffix
    const lastPart = parts[parts.length - 1];
    const lessonMatch = lastPart.match(/\d+/);
    const suffixMatch = lastPart.match(/[A-Z]+/);
    
    const lesson = lessonMatch ? parseInt(lessonMatch[0], 10) : 0;
    const suffix = suffixMatch ? suffixMatch[0] : '';
    
    return { unit, lesson, suffix };
  };
  
  const aData = parseId(a.id);
  const bData = parseId(b.id);
  
  // Compare unit numbers first
  if (aData.unit !== bData.unit) {
    return aData.unit - bData.unit;
  }
  
  // Then compare lesson numbers
  if (aData.lesson !== bData.lesson) {
    return aData.lesson - bData.lesson;
  }
  
  // Finally compare suffixes alphabetically
  return aData.suffix.localeCompare(bData.suffix);
}

const LESSONS = [
  lesson203_3A4,
  lesson203_3A2,
  lesson203_3A6,
  lesson203_3A11,  lesson203_3F,  lesson202_3F,
  lesson203_3E,
  lesson203_3D,
  lesson203_3C,
  lesson203_3B,
  lesson203_3A,
  lesson203_2D,
  lesson203_2C,
  lesson203_2B,
  lesson203_2A,
  lesson203_1C,
  lesson203_1B,
  lesson203_1A,
  lesson204_13B,
  lesson204_13A,
  lesson204_14B,
  lesson204_14A,
  lesson204_12B,
  lesson204_12A,
  lesson204_11C,
  lesson204_11B,
  lesson204_11A,
  lesson204_10B,
  lesson204_10A,
  lesson201_1A,
  lesson202_1A,
  lesson202_2A,
  lesson202_3A,
  lesson202_3AB,
  lesson202_4A,
  lesson202_5A,
  lesson202_6A,
  lesson202_7A,
  lesson202_7B,
  lesson202_7C,
  lesson202_7D,
].sort(sortLessonsByIdNaturally);

// Color schemes for different units (analogous color scheme)
const getUnitColors = (lessonId: string) => {
  const unitNumber = lessonId.split('-')[0];
  
  const colorSchemes = {
    '201': {
      border: 'border-blue-200 dark:border-blue-900',
      borderHover: 'hover:border-blue-400 dark:hover:border-blue-600',
      badge: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
      text: 'text-blue-600 dark:text-blue-400',
      textHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
      button: 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 dark:group-hover:bg-blue-600',
    },
    '202': {
      border: 'border-indigo-200 dark:border-indigo-900',
      borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
      badge: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700',
      text: 'text-indigo-600 dark:text-indigo-400',
      textHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
      button: 'bg-indigo-600 dark:bg-indigo-500 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-600',
    },
    '203': {
      border: 'border-violet-200 dark:border-violet-900',
      borderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
      badge: 'text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700',
      text: 'text-violet-600 dark:text-violet-400',
      textHover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
      button: 'bg-violet-600 dark:bg-violet-500 group-hover:bg-violet-700 dark:group-hover:bg-violet-600',
    },
    '204': {
      border: 'border-purple-200 dark:border-purple-900',
      borderHover: 'hover:border-purple-400 dark:hover:border-purple-600',
      badge: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
      text: 'text-purple-600 dark:text-purple-400',
      textHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      button: 'bg-purple-600 dark:bg-purple-500 group-hover:bg-purple-700 dark:group-hover:bg-purple-600',
    },
  };
  
  return colorSchemes[unitNumber as keyof typeof colorSchemes] || colorSchemes['202'];
};

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

        {/* Unit 201: Health & Safety */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
              Unit 201 - Health & Safety
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Essential health and safety legislation for electrical installations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS.filter(lesson => lesson.id.startsWith('201')).map((lesson) => {
              const progress = lessonsProgress[lesson.id];
              const hasMastery = progress?.masteryAchieved;
              const isPending = progress?.masteryPending;
              const colors = getUnitColors(lesson.id);
              
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="group"
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-xl ${colors.borderHover} transition-all duration-200 h-full flex flex-col`}>
                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium ${colors.badge} rounded-full border`}>
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
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${colors.textHover} transition-colors`}>
                    {lesson.title}
                  </h3>

                  {/* Lesson Description */}
                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                    {lesson.description}
                  </p>

                  {/* Lesson Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>✓</span>
                      {lesson.learningOutcomes.length} Outcomes
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>📝</span>
                      {lesson.blocks.filter(b => b.type === 'practice').length} Practice
                    </span>
                  </div>

                  {/* Start Button */}
                  <button className={`mt-4 w-full px-4 py-2 ${colors.button} text-white rounded-lg font-semibold transition-colors shadow-md`}>
                    {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                  </button>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Unit 202: Science */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">
              Unit 202 - Science
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Fundamental electrical principles and circuit theory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS.filter(lesson => lesson.id.startsWith('202')).map((lesson) => {
              const progress = lessonsProgress[lesson.id];
              const hasMastery = progress?.masteryAchieved;
              const isPending = progress?.masteryPending;
              const colors = getUnitColors(lesson.id);
              
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="group"
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-xl ${colors.borderHover} transition-all duration-200 h-full flex flex-col`}>
                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium ${colors.badge} rounded-full border`}>
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
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${colors.textHover} transition-colors`}>
                    {lesson.title}
                  </h3>

                  {/* Lesson Description */}
                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                    {lesson.description}
                  </p>

                  {/* Lesson Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>✓</span>
                      {lesson.learningOutcomes.length} Outcomes
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>📝</span>
                      {lesson.blocks.filter(b => b.type === 'practice').length} Practice
                    </span>
                  </div>

                  {/* Start Button */}
                  <button className={`mt-4 w-full px-4 py-2 ${colors.button} text-white rounded-lg font-semibold transition-colors shadow-md`}>
                    {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                  </button>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Unit 203: Electrical Installations Technology */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-300 mb-2">
              Unit 203 - Electrical Installations Technology
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Practical installation techniques, cable selection, and wiring systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS.filter(lesson => lesson.id.startsWith('203')).map((lesson) => {
              const progress = lessonsProgress[lesson.id];
              const hasMastery = progress?.masteryAchieved;
              const isPending = progress?.masteryPending;
              const colors = getUnitColors(lesson.id);
              
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="group"
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-xl ${colors.borderHover} transition-all duration-200 h-full flex flex-col`}>
                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium ${colors.badge} rounded-full border`}>
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
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${colors.textHover} transition-colors`}>
                    {lesson.title}
                  </h3>

                  {/* Lesson Description */}
                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                    {lesson.description}
                  </p>

                  {/* Lesson Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>✓</span>
                      {lesson.learningOutcomes.length} Outcomes
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>📝</span>
                      {lesson.blocks.filter(b => b.type === 'practice').length} Practice
                    </span>
                  </div>

                  {/* Start Button */}
                  <button className={`mt-4 w-full px-4 py-2 ${colors.button} text-white rounded-lg font-semibold transition-colors shadow-md`}>
                    {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                  </button>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Unit 204: Testing & Inspection */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-2">
              Unit 204 - Testing & Inspection
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Electrical testing procedures, inspection requirements, and certification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS.filter(lesson => lesson.id.startsWith('204')).map((lesson) => {
              const progress = lessonsProgress[lesson.id];
              const hasMastery = progress?.masteryAchieved;
              const isPending = progress?.masteryPending;
              const colors = getUnitColors(lesson.id);
              
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="group"
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-xl ${colors.borderHover} transition-all duration-200 h-full flex flex-col`}>
                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-medium ${colors.badge} rounded-full border`}>
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
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${colors.textHover} transition-colors`}>
                    {lesson.title}
                  </h3>

                  {/* Lesson Description */}
                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                    {lesson.description}
                  </p>

                  {/* Lesson Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>✓</span>
                      {lesson.learningOutcomes.length} Outcomes
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={colors.text}>📝</span>
                      {lesson.blocks.filter(b => b.type === 'practice').length} Practice
                    </span>
                  </div>

                  {/* Start Button */}
                  <button className={`mt-4 w-full px-4 py-2 ${colors.button} text-white rounded-lg font-semibold transition-colors shadow-md`}>
                    {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                  </button>
                </div>
              </Link>
              );
            })}
          </div>
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
                      <span>202-3A & 202-4A</span>
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
