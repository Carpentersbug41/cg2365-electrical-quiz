/**
 * Learn Page - Lessons Index
 * Shows all available lessons with mastery gates
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import lesson202_1A from '@/data/lessons/202-1A-electrical-quantities-units.json';
import lesson202_2A from '@/data/lessons/202-2A-ohms-law.json';
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import lesson202_3AB from '@/data/lessons/202-3AB-series-circuits-linear.json';
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
import lesson202_3F from '@/data/lessons/202-3F-spacing-factor-enclosure-fill.json';
import lesson201_1A from '@/data/lessons/201-1A-roles-responsibilities.json';
import lesson201_1B from '@/data/lessons/201-1B-health-safety-legislation.json';
import lesson201_1C from '@/data/lessons/201-1C-environmental-legislation.json';
import lesson202_5A from '@/data/lessons/202-5A-magnetism-basics.json';
import lesson204_15A from '@/data/lessons/204-15A-testing-overview-safe-isolation.json';
import lesson204_9A from '@/data/lessons/204-9A-tools-measuring-marking-out-for-wiring-systems.json';
import lesson210_1A from '@/data/lessons/210-1A-site-management-and-trade-roles.json';
import lesson210_1B from '@/data/lessons/210-1B-site-visitors-and-inspectors.json';
import lesson210_2A from '@/data/lessons/210-2A-legislation-and-workplace-documentation.json';
import lesson203_1A from '@/data/lessons/203-1A-statutory-and-non-statutory-regulations.json';
import lesson203_1B from '@/data/lessons/203-1B-implications-of-regulatory-non-compliance.json';
import lesson203_2A from '@/data/lessons/203-2A-technical-information-and-drawing-types.json';
import lesson203_2B from '@/data/lessons/203-2B-symbols-and-scaling-in-drawings.json';
import lesson203_3B from '@/data/lessons/203-3B-conductor-sizing-and-protective-devices.json';
import lesson203_3C from '@/data/lessons/203-3C-installation-equipment-and-enclosure-spacing.json';
import lesson203_4A from '@/data/lessons/203-4A-earthing-systems-and-ads-components.json';
import lesson203_4B from '@/data/lessons/203-4B-exposed-and-extraneous-conductive-parts.json';
import lesson203_4C from '@/data/lessons/203-4C-earth-loop-impedance-path.json';
import lesson203_5A from '@/data/lessons/203-5A-electricity-generation-and-transmission.json';
import lesson203_5B from '@/data/lessons/203-5B-distribution-voltages-and-network-components.json';
import lesson203_6A from '@/data/lessons/203-6A-types-of-micro-renewable-energy.json';
import lesson203_6B from '@/data/lessons/203-6B-installation-and-evaluation-of-micro-renewables.json';
import lesson203_10B from '@/data/lessons/203-10B-consumer-units-purpose-protective-devices.json';
import lesson203_10C from '@/data/lessons/203-10C-consumer-unit-practical-position-entries-terminations-rig-safe.json';
import lesson203_10A from '@/data/lessons/203-10A-consumer-units-total-noob.json';
import lesson203_LC1A from '@/data/lessons/203-LC1A-lighting-circuits-noob-level-1.json';
import lesson201_203_SC1A from '@/data/lessons/201-203-SC1A-socket-circuits-noob-level-1.json';
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

const RAW_LESSONS = [
  lesson201_203_SC1A,
  lesson203_LC1A,
  lesson203_10A,
  lesson203_10C,
  lesson203_10B,
  lesson203_6B,
  lesson203_6A,
  lesson203_5B,
  lesson203_5A,
  lesson203_4C,
  lesson203_4B,
  lesson203_4A,
  lesson203_3C,
  lesson203_3B,
  lesson203_2B,
  lesson203_2A,
  lesson203_1B,
  lesson203_1A,
  lesson210_2A,
  lesson210_1B,
  lesson210_1A, lesson210_1A,
  lesson210_1A,
  lesson210_1A,
  lesson210_1A, lesson204_9A,
  lesson202_5A,  lesson201_1C,
  lesson201_1B,
  lesson201_1A,  lesson202_3F,  lesson204_13B,
  lesson204_13A,
  lesson204_14B,
  lesson204_14A,
  lesson204_15A,
  lesson204_12B,
  lesson204_12A,
  lesson204_11C,
  lesson204_11B,
  lesson204_11A,
  lesson204_10B,
  lesson204_10A,  lesson202_1A,
  lesson202_2A,
  lesson202_3A,
  lesson202_3AB,  lesson202_7A,
  lesson202_7B,
  lesson202_7C,
  lesson202_7D,
];

const LESSONS = (() => {
  const seen = new Set<string>();
  const duplicateIds = new Set<string>();

  const uniqueLessons = RAW_LESSONS.filter((lesson) => {
    if (seen.has(lesson.id)) {
      duplicateIds.add(lesson.id);
      return false;
    }

    seen.add(lesson.id);
    return true;
  });

  if (process.env.NODE_ENV === 'development' && duplicateIds.size > 0) {
    console.warn('[LearnPage] Duplicate lesson IDs removed:', Array.from(duplicateIds));
  }

  return uniqueLessons.sort(sortLessonsByIdNaturally);
})();

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
    '210': {
      border: 'border-cyan-200 dark:border-cyan-900',
      borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-600',
      badge: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700',
      text: 'text-cyan-600 dark:text-cyan-400',
      textHover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
      button: 'bg-cyan-600 dark:bg-cyan-500 group-hover:bg-cyan-700 dark:group-hover:bg-cyan-600',
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

  const unitMeta: Record<string, { title: string; description: string }> = {
    '201': {
      title: 'Unit 201 - Health & Safety',
      description: 'Essential health and safety legislation for electrical installations',
    },
    '202': {
      title: 'Unit 202 - Science',
      description: 'Fundamental electrical principles and circuit theory',
    },
    '203': {
      title: 'Unit 203 - Electrical Installations Technology',
      description: 'Practical installation techniques, cable selection, and wiring systems',
    },
    '204': {
      title: 'Unit 204 - Testing & Inspection',
      description: 'Electrical testing procedures, inspection requirements, and certification',
    },
    '210': {
      title: 'Unit 210 - Communication',
      description: 'Workplace communication, information sources, and professional relationships',
    },
  };

  const unitsToRender = Array.from(
    new Set(LESSONS.map((lesson) => lesson.id.split('-')[0]))
  ).sort((a, b) => Number(a) - Number(b));

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

        {unitsToRender.map((unitId) => {
          const unitLessons = LESSONS.filter((lesson) => lesson.id.startsWith(`${unitId}-`));
          if (unitLessons.length === 0) return null;

          const unitFirstLessonColors = getUnitColors(unitLessons[0].id);
          const meta = unitMeta[unitId] ?? {
            title: `Unit ${unitId}`,
            description: 'Generated lessons for this unit.',
          };

          return (
            <div key={unitId} className="mb-12">
              <div className="mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${unitFirstLessonColors.text}`}>
                  {meta.title}
                </h2>
                <p className="text-gray-600 dark:text-slate-300">
                  {meta.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitLessons.map((lesson) => {
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

                        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${colors.textHover} transition-colors`}>
                          {lesson.title}
                        </h3>

                        <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 flex-1">
                          {lesson.description}
                        </p>

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

                        <button className={`mt-4 w-full px-4 py-2 ${colors.button} text-white rounded-lg font-semibold transition-colors shadow-md`}>
                          {hasMastery ? 'Review Lesson' : isPending ? 'Review Lesson' : 'Start Lesson'} →
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

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
