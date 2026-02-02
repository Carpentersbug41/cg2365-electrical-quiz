'use client';

/**
 * Quiz Generator UI
 * Generate quizzes for existing lessons
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LessonQuizStatus {
  lessonId: string;
  title: string;
  unit: string;
  unitNumber: string;
  section: string;
  questionCount: number;
  needsQuiz: boolean;
  hasPartialQuiz: boolean;
}

interface GenerationStatus {
  stage: 'idle' | 'generating' | 'success' | 'error';
  message: string;
  progress: number;
  result?: {
    quizFile: string;
    commitHash: string;
    commitUrl: string;
    previousQuestionCount?: number;
    warnings: string[];
  };
  error?: string;
}

type FilterMode = 'all' | 'needs' | 'missing' | 'partial';

export default function GenerateQuizPage() {
  const [lessons, setLessons] = useState<LessonQuizStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>('needs');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>({
    stage: 'idle',
    message: '',
    progress: 0,
  });

  // Load lessons on mount
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lessons-status');
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    // Apply filter mode
    let matchesFilter = true;
    switch (filterMode) {
      case 'needs':
        matchesFilter = lesson.needsQuiz;
        break;
      case 'missing':
        matchesFilter = lesson.questionCount === 0;
        break;
      case 'partial':
        matchesFilter = lesson.hasPartialQuiz;
        break;
      case 'all':
      default:
        matchesFilter = true;
    }

    // Apply unit filter
    const matchesUnit = unitFilter === 'all' || lesson.unitNumber === unitFilter;

    return matchesFilter && matchesUnit;
  });

  const handleLessonClick = (lesson: LessonQuizStatus) => {
    setSelectedLesson(lesson.lessonId);
    
    // Show confirmation if lesson already has questions
    if (lesson.questionCount > 0) {
      setShowConfirmDialog(true);
    } else {
      startGeneration(lesson.lessonId, false);
    }
  };

  const handleConfirmRegenerate = () => {
    if (selectedLesson) {
      setShowConfirmDialog(false);
      startGeneration(selectedLesson, true);
    }
  };

  const startGeneration = async (lessonId: string, regenerate: boolean) => {
    setStatus({
      stage: 'generating',
      message: 'Starting quiz generation...',
      progress: 10,
    });

    try {
      setStatus({
        stage: 'generating',
        message: 'Generating 50 questions...',
        progress: 30,
      });

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, regenerate }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setStatus({
        stage: 'success',
        message: 'Quiz generated successfully!',
        progress: 100,
        result: {
          quizFile: data.quizFile,
          commitHash: data.commitHash,
          commitUrl: data.commitUrl,
          previousQuestionCount: data.previousQuestionCount,
          warnings: data.warnings || [],
        },
      });

      // Refresh lessons list
      fetchLessons();
    } catch (error) {
      setStatus({
        stage: 'error',
        message: 'Generation failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const resetForm = () => {
    setSelectedLesson(null);
    setShowConfirmDialog(false);
    setStatus({
      stage: 'idle',
      message: '',
      progress: 0,
    });
  };

  const getQuizBadge = (lesson: LessonQuizStatus) => {
    if (lesson.questionCount === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">0 questions</span>;
    } else if (lesson.questionCount < 30) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">{lesson.questionCount} questions</span>;
    } else if (lesson.questionCount < 50) {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">{lesson.questionCount} questions</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">{lesson.questionCount} questions</span>;
    }
  };

  const getActionButton = (lesson: LessonQuizStatus) => {
    if (lesson.questionCount === 0) {
      return <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Generate</span>;
    } else {
      return <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Regenerate</span>;
    }
  };

  const stats = {
    total: lessons.length,
    complete: lessons.filter(l => l.questionCount >= 50).length,
    partial: lessons.filter(l => l.hasPartialQuiz).length,
    missing: lessons.filter(l => l.questionCount === 0).length,
    needsWork: lessons.filter(l => l.needsQuiz).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Generator</h1>
              <p className="text-gray-600 dark:text-slate-300 mt-1">
                Generate quizzes for existing lessons
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/generate"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Lesson Generator
              </Link>
              <Link
                href="/learn"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {status.stage === 'idle' || status.stage === 'generating' ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coverage Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Total Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.complete}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Complete (50+)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.partial}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Partial (1-49)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.missing}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Missing (0)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.needsWork}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Needs Work (&lt;30)</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterMode}
                    onChange={e => setFilterMode(e.target.value as FilterMode)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    disabled={status.stage === 'generating'}
                  >
                    <option value="needs">Needs Quiz (&lt; 30 questions)</option>
                    <option value="missing">Missing Quiz (0 questions)</option>
                    <option value="partial">Partial Quiz (1-49 questions)</option>
                    <option value="all">All Lessons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Filter by Unit
                  </label>
                  <select
                    value={unitFilter}
                    onChange={e => setUnitFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    disabled={status.stage === 'generating'}
                  >
                    <option value="all">All Units</option>
                    <option value="201">Unit 201 - Health & Safety</option>
                    <option value="202">Unit 202 - Science</option>
                    <option value="203">Unit 203 - Installations</option>
                    <option value="204">Unit 204 - Testing & Inspection</option>
                    <option value="210">Unit 210 - Communication</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lessons ({filteredLessons.length})
                </h2>
                {loading && (
                  <div className="text-sm text-gray-500 dark:text-slate-400">Loading...</div>
                )}
              </div>

              {/* Progress Bar */}
              {status.stage === 'generating' && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                    <span>{status.message}</span>
                    <span>{status.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLessons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    No lessons match the selected filters
                  </div>
                ) : (
                  filteredLessons.map(lesson => (
                    <button
                      key={lesson.lessonId}
                      onClick={() => handleLessonClick(lesson)}
                      disabled={status.stage === 'generating'}
                      className="w-full text-left px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {lesson.lessonId}
                            </span>
                            {getQuizBadge(lesson)}
                            {getActionButton(lesson)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                            {lesson.title}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : status.stage === 'success' ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">Quiz Generated Successfully!</h2>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Generated File:
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    📝 Quiz: {status.result?.quizFile}
                  </p>
                  {status.result?.previousQuestionCount && (
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-2">
                      Previous: {status.result.previousQuestionCount} questions → New: 50 questions
                    </p>
                  )}
                </div>

                {status.result?.commitHash !== 'N/A' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Git Commit:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mb-2 font-mono">
                      {status.result?.commitHash.substring(0, 7)}
                    </p>
                    <a
                      href={status.result?.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Commit on GitHub →
                    </a>
                  </div>
                )}

                {status.result?.warnings && status.result.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Warnings:
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-slate-300 list-disc list-inside">
                      {status.result.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                  Generate Another
                </button>
                <Link
                  href="/learn"
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-center"
                >
                  View Lessons
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              {/* Error Header */}
              <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">Generation Failed</h2>
              </div>

              {/* Error Message */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                  Error:
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  {status.error}
                </p>
              </div>

              {/* Try Again Button */}
              <button
                onClick={resetForm}
                className="w-full px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Regeneration
            </h3>
            <p className="text-gray-700 dark:text-slate-300 mb-6">
              This lesson already has {lessons.find(l => l.lessonId === selectedLesson)?.questionCount} questions.
              Regenerating will create 50 new questions. The old questions will remain in the system but won't be used.
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-6">
              ⚠️ Warning: This action cannot be undone without reverting the git commit.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRegenerate}
                className="flex-1 px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              >
                Generate Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
