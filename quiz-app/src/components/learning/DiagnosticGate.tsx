'use client';

/**
 * Diagnostic Gate Component
 * Wraps lesson content with prerequisite diagnostic quiz
 * Soft gate: allows skip but provides strong guidance
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DiagnosticConfig } from '@/data/lessons/types';
import { 
  getDiagnosticQuestions, 
  checkDiagnosticPass, 
  saveDiagnosticPass,
  getDiagnosticCoverage 
} from '@/lib/diagnostic/diagnosticService';
import { DiagnosticResults } from '@/lib/diagnostic/types';
import Quiz from '@/components/Quiz';
import DiagnosticFeedback from './DiagnosticFeedback';
import { TaggedQuestion } from '@/data/questions/types';
import { Question } from '@/data/questions';

interface DiagnosticGateProps {
  lessonId: string;
  diagnostic: DiagnosticConfig;
  children: React.ReactNode; // Lesson content
}

type GateState = 'checking' | 'show-gate' | 'taking-quiz' | 'passed' | 'failed' | 'lesson';

export default function DiagnosticGate({ lessonId, diagnostic, children }: DiagnosticGateProps) {
  const [state, setState] = useState<GateState>('checking');
  const [questions, setQuestions] = useState<TaggedQuestion[]>([]);
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const coverage = getDiagnosticCoverage(lessonId);

  useEffect(() => {
    // Check if already passed
    const hasPassed = checkDiagnosticPass(lessonId);
    
    if (hasPassed) {
      setState('lesson');
    } else {
      setState('show-gate');
    }
  }, [lessonId]);

  const handleStartDiagnostic = () => {
    // Load diagnostic questions
    const diagnosticQuestions = getDiagnosticQuestions(lessonId);
    setQuestions(diagnosticQuestions);
    setState('taking-quiz');
  };

  const handleQuizComplete = (quizResults: {
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    wrongAnswers: Array<{
      questionId: string;
      questionText: string;
      userAnswer: number;
      correctAnswer: number;
      options: string[];
    }>;
  }) => {
    const diagnosticResults: DiagnosticResults = {
      lessonId,
      coveredLessonIds: coverage.coveredLessonIds,
      score: quizResults.score,
      totalQuestions: quizResults.totalQuestions,
      percentage: quizResults.percentage,
      passed: quizResults.passed,
      passThreshold: diagnostic.passThreshold,
      wrongAnswers: quizResults.wrongAnswers.map(wa => ({
        questionId: wa.questionId,
        questionText: wa.questionText,
        userAnswer: wa.userAnswer,
        correctAnswer: wa.correctAnswer,
        misconceptionCode: undefined,
        tags: []
      })),
      completedAt: new Date()
    };

    setResults(diagnosticResults);

    if (quizResults.passed) {
      saveDiagnosticPass(lessonId);
      setState('passed');
    } else {
      setState('failed');
    }
  };

  const handleProceedToLesson = () => {
    setState('lesson');
  };

  // Checking state (loading)
  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Checking prerequisites...</p>
        </div>
      </div>
    );
  }

  // Show lesson (passed or skipped)
  if (state === 'lesson') {
    return <>{children}</>;
  }

  // Pre-diagnostic gate screen
  if (state === 'show-gate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-4">
                Quick Readiness Check
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                Before starting this lesson, let&apos;s make sure you&apos;re ready with a quick diagnostic.
              </p>
            </div>

            {coverage.coveredLessonIds.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                  This diagnostic covers:
                </h3>
                <p className="text-blue-800 dark:text-blue-400 font-medium">
                  Previous lessons in Unit {coverage.unitNumber}{coverage.unitName ? ` (${coverage.unitName})` : ''}
                </p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">
                What to Expect:
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="mr-3 text-green-500">✓</span>
                  <span><strong>{diagnostic.questionCount} questions</strong> from prerequisite material</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-500">✓</span>
                  <span><strong>2-3 minutes</strong> to complete</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-500">✓</span>
                  <span><strong>{diagnostic.passThreshold * 100}% to pass</strong> (mastery threshold)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">ℹ</span>
                  <span>Personalized study recommendations if you need review</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartDiagnostic}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Take Diagnostic
              </button>
            </div>

            {coverage.coveredLessonIds.length > 0 && (
              <div className="mt-6 text-center">
                <Link 
                  href="/learn"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  ← Back to Lesson Menu to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Taking quiz
  if (state === 'taking-quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mb-6 text-center pt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            Diagnostic Assessment
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            Unit {coverage.unitNumber}{coverage.unitName ? ` ${coverage.unitName}` : ''} Quiz
          </p>
        </div>
        
        <Quiz 
          questions={questions as Question[]}
          section={`Diagnostic: Unit ${coverage.unitNumber}${coverage.unitName ? ` ${coverage.unitName}` : ''}`}
          onComplete={handleQuizComplete}
          enableConfidence={true}
          enableImmediateFeedback={true}
          enableTypedRetries={true}
          context="diagnostic"
          lessonId={lessonId}
        />
      </div>
    );
  }

  // Passed screen
  if (state === 'passed' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <span className="text-5xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">
                Well Done!
              </h2>
              <p className="text-xl text-gray-700 dark:text-slate-300 mb-2">
                Score: {results.score}/{results.totalQuestions} ({Math.round(results.percentage)}%)
              </p>
            </div>

            {/* Show wrong answers if any */}
            {results.wrongAnswers.length > 0 && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                  Questions to Review:
                </h3>
                <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-400">
                  {results.wrongAnswers.map((wa, idx) => (
                    <li key={idx}>• {wa.questionText.substring(0, 60)}...</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6 text-center">
              <p className="text-gray-600 dark:text-slate-400">
                You&apos;ve demonstrated understanding of the prerequisite concepts. Ready to continue!
              </p>
            </div>

            <button
              onClick={handleProceedToLesson}
              className="w-full px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue to Lesson →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed screen with feedback
  if (state === 'failed' && results) {
    return (
      <DiagnosticFeedback
        results={results}
        onBackToMenu={() => window.location.href = '/learn'}
        onProceedAnyway={handleProceedToLesson}
      />
    );
  }

  return null;
}

