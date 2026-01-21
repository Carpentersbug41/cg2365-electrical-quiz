'use client';

/**
 * Diagnostic Feedback Component
 * Shows feedback when diagnostic test is failed
 * Hybrid approach: immediate simple feedback + async LLM analysis
 */

import { useState, useEffect } from 'react';
import { DiagnosticResults, StudyPlan } from '@/lib/diagnostic/types';

interface DiagnosticFeedbackProps {
  results: DiagnosticResults;
  onBackToMenu: () => void;
  onProceedAnyway: () => void;
}

export default function DiagnosticFeedback({ 
  results, 
  onBackToMenu, 
  onProceedAnyway 
}: DiagnosticFeedbackProps) {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Call LLM analysis API
    const analyzeResults = async () => {
      try {
        const response = await fetch('/api/diagnostic-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            misconceptions: results.wrongAnswers
              .map(wa => wa.misconceptionCode)
              .filter(Boolean),
            score: results.percentage / 100,
            wrongQuestions: results.wrongAnswers.map(wa => ({
              id: wa.questionId,
              tags: wa.tags,
              misconceptionCode: wa.misconceptionCode
            })),
            lessonId: results.lessonId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze results');
        }

        const data = await response.json();
        setStudyPlan(data.studyPlan);
        setLoading(false);
      } catch (err) {
        console.error('LLM analysis error:', err);
        setError(true);
        setLoading(false);
      }
    };

    analyzeResults();
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
              <span className="text-5xl">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-300 mb-2">
              Let&apos;s Review First
            </h2>
            <p className="text-xl text-gray-700 dark:text-slate-300 mb-2">
              Score: {results.score}/{results.totalQuestions} ({Math.round(results.percentage)}%)
            </p>
            <p className="text-gray-600 dark:text-slate-400">
              Need: {Math.round(results.passThreshold * 100)}% to proceed
            </p>
          </div>

          {/* Simple Immediate Feedback */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
              <span>📊</span>
              What Went Wrong:
            </h3>
            <p className="text-amber-800 dark:text-amber-400 mb-4">
              You got {results.wrongAnswers.length} out of {results.totalQuestions} questions wrong.
            </p>
            
            {results.wrongAnswers.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm mb-2">
                  Questions you got wrong:
                </p>
                <ul className="space-y-2">
                  {results.wrongAnswers.slice(0, 3).map((wa, idx) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span className="flex-1">{wa.questionText.substring(0, 80)}...</span>
                    </li>
                  ))}
                  {results.wrongAnswers.length > 3 && (
                    <li className="text-sm text-gray-600 dark:text-slate-400 italic">
                      ...and {results.wrongAnswers.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Basic Recommendation (Always shown) */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
            <p className="text-blue-800 dark:text-blue-400 flex items-start gap-2">
              <span className="text-xl">💡</span>
              <span>
                We recommend reviewing <strong className="text-blue-900 dark:text-blue-300">{results.coveredLessonIds.join(', ')}</strong> before continuing to strengthen your foundation.
              </span>
            </p>
          </div>

          {/* Enhanced LLM Feedback (Progressive Enhancement) */}
          {loading && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  Analyzing your responses for personalized recommendations...
                </p>
              </div>
            </div>
          )}

          {!loading && !error && studyPlan && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-purple-300 dark:border-purple-700">
              <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2 text-lg">
                <span>💡</span>
                Understanding Your Mistakes
              </h3>
              
              {/* Why Wrong - Most Important */}
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  Why You Got These Wrong:
                </h4>
                <p className="text-gray-700 dark:text-slate-300">{studyPlan.whyWrong}</p>
              </div>
              
              {/* Key Concepts to Understand */}
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">🎯</span>
                  What You Need to Understand:
                </h4>
                <ul className="space-y-3">
                  {studyPlan.keyConceptsToUnderstand.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">{idx + 1}.</span>
                      <div className="flex-1">
                        <div className="text-blue-900 dark:text-blue-300 font-medium mb-1">
                          {item.concept}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{item.explanation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Quick Fix */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <span>⚡</span>
                  Quick Fix:
                </h4>
                <p className="text-green-800 dark:text-green-400">{studyPlan.quickFix}</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Unable to load personalized recommendations, but you can still review the prerequisite lesson.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={onBackToMenu}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ← Back to Lesson Menu
            </button>
            
            <button
              onClick={onProceedAnyway}
              className="px-8 py-4 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Proceed to Lesson Anyway (Not Recommended)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
