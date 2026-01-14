'use client';

/**
 * Interleaved Quiz Page
 * Specialized quiz page for mixed-concept practice
 * Uses Layout C principles (Focus Mode)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import { allTaggedQuestions } from '@/data/questions/index';
import { getQuizConfig } from '@/data/quizzes/interleavedQuizzes';
import { createSeriesParallelMixedQuiz, validateInterleaving, checkInterleavingEligibility } from '@/lib/questions/interleavingService';
import { getLessonProgress } from '@/lib/progress/progressService';
import { Question } from '@/data/questions';
import { TaggedQuestion } from '@/data/questions/types';
import PrerequisiteGate from '@/components/learning/PrerequisiteGate';

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default function InterleavedQuizPage({ params }: PageProps) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [missingPrereqs, setMissingPrereqs] = useState<string[]>([]);
  const [quizConfig, setQuizConfig] = useState<ReturnType<typeof getQuizConfig>>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(({ quizId: id }) => {
      setQuizId(id);
      
      // Get quiz configuration
      const config = getQuizConfig(id);
      
      if (!config) {
        setError('Quiz not found');
        return;
      }

      setQuizConfig(config);

      // Check mastery of prerequisites (strict enforcement)
      const eligibility = checkInterleavingEligibility(id, config.prerequisites);
      setIsEligible(eligibility.eligible);
      setMissingPrereqs(eligibility.missingPrerequisites);

      if (!eligibility.eligible) {
        console.log(`Prerequisites not mastered. Missing: ${eligibility.missingPrerequisites.join(', ')}`);
        setIsReady(true); // Ready to show prerequisite gate
        return;
      }

      // Generate interleaved question set
      let interleavedQuestions: TaggedQuestion[] = [];
      
      if (id === 'mixed-series-parallel') {
        interleavedQuestions = createSeriesParallelMixedQuiz(allTaggedQuestions);
      } else {
        setError('Unknown quiz type');
        return;
      }

      // Validate interleaving
      const stats = validateInterleaving(interleavedQuestions);
      console.log('📊 Interleaving Stats:', stats);

      if (!stats.isProperlyInterleaved) {
        console.warn('⚠️ Warning: Quiz may not be properly interleaved');
      }

      // Convert to Question format for Quiz component
      const quizQuestions: Question[] = interleavedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        section: q.section,
        category: q.category
      }));

      setQuestions(quizQuestions);
      setIsReady(true);
    });
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Error
          </h1>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {error}
          </p>
          <Link
            href="/learn"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  if (!isReady || !quizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔀</div>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Preparing your interleaved quiz...
          </p>
        </div>
      </div>
    );
  }

  // Show prerequisite gate if not eligible
  if (!isEligible && quizConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            >
              <span>←</span>
              <span>Back to Lessons</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {quizConfig.title}
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              {quizConfig.description}
            </p>
          </div>

          {/* Prerequisite Gate */}
          <PrerequisiteGate
            prerequisites={missingPrereqs}
            quizTitle={quizConfig.title}
          />
        </div>
      </div>
    );
  }

  const config = getQuizConfig(quizId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header - Minimal (Layout C principle) */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn"
                className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Exit
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {config?.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Interleaved Practice • {config?.estimatedTime} min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-300 dark:border-purple-700">
                Focus Mode
              </span>
              <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full border border-indigo-300 dark:border-indigo-700">
                {config?.unit}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔀</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Interleaved Practice</h2>
              <p className="text-purple-100 mb-3">
                {config?.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                  <span className="font-semibold">Questions:</span>
                  <span>{questions.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                  <span className="font-semibold">Pass:</span>
                  <span>{config?.passingScore}%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                  <span className="font-semibold">Time:</span>
                  <span>~{config?.estimatedTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology Explainer */}
        <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Why Mixed Practice?</span>
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            This quiz <strong>mixes series and parallel questions</strong> to help you develop a critical skill: 
            <strong> discrimination</strong> — knowing which rule to apply in each situation.
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Research shows that interleaved practice (mixing concepts) leads to better long-term learning than 
            blocked practice (one concept at a time), even though it feels harder during practice.
          </p>
        </div>
      </div>

      {/* Quiz Component */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Quiz 
          questions={questions}
          sectionName={config?.title || 'Interleaved Quiz'}
        />
      </div>
    </div>
  );
}

