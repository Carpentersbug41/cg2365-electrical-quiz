'use client';

/**
 * Test Generation UI
 * Score lessons with rubric and compare regenerations
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RubricScore {
  total: number;
  breakdown: {
    schemaCompliance: number;
    pedagogy: number;
    questions: number;
    marking: number;
    visual: number;
    safety: number;
  };
  details: RubricDetail[];
  grade: string;
  autoCap?: {
    triggered: boolean;
    reason: string;
    cappedAt: number;
  };
}

interface RubricDetail {
  section: string;
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
}

interface LessonOption {
  id: string;
  title: string;
}

export default function TestGenerationPage() {
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [score, setScore] = useState<RubricScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [regenerating, setRegenerating] = useState(false);
  const [previousScore, setPreviousScore] = useState<RubricScore | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Load available lessons on mount
  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/lessons-status');
      const data = await response.json();
      if (data.lessons) {
        setLessons(data.lessons.map((l: any) => ({ id: l.id, title: l.title })));
      }
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  const scoreLesson = async () => {
    if (!selectedLessonId) {
      setError('Please select a lesson');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/score-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: selectedLessonId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to score lesson');
      }

      setScore(data.score);

      // Load lesson data for preview
      const lessonResponse = await fetch(`/api/lessons/${selectedLessonId}`);
      if (lessonResponse.ok) {
        const lesson = await lessonResponse.json();
        setLessonData(lesson);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const regenerateLesson = async () => {
    if (!selectedLessonId) return;

    setRegenerating(true);
    setError(null);
    
    // Save current score for comparison
    if (score) {
      setPreviousScore(score);
      setShowComparison(true);
    }

    try {
      // Extract lesson details from ID (e.g., "203-3F")
      const [unitStr, topicId] = selectedLessonId.split('-');
      const unit = parseInt(unitStr);

      const response = await fetch('/api/lesson-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit,
          lessonId: topicId,
          topic: selectedLessonId,
          section: 'Science 2365 Level 2',
          layout: 'split-vis',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to regenerate lesson');
      }

      // Re-score the regenerated lesson
      await scoreLesson();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string): string => {
    if (grade.includes('Ship it')) return 'bg-green-100 text-green-800';
    if (grade.includes('Strong')) return 'bg-blue-100 text-blue-800';
    if (grade.includes('Usable')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
          <h1 className="text-3xl font-bold mt-4">Lesson Quality Testing</h1>
          <p className="text-gray-600 mt-2">Score lessons with the universal rubric and compare regenerations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Controls</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Lesson
                  </label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select Lesson --</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.id} - {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={scoreLesson}
                  disabled={loading || !selectedLessonId}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Scoring...' : 'Score Lesson'}
                </button>

                <button
                  onClick={regenerateLesson}
                  disabled={regenerating || !selectedLessonId}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {regenerating ? 'Regenerating...' : 'Regenerate & Compare'}
                </button>

                {showComparison && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showComparison}
                      onChange={(e) => setShowComparison(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Comparison</span>
                  </label>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {score && (
              <div className="space-y-6">
                {/* Score Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Score Report</h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {score.total}/100
                      </div>
                      <div className={`text-sm px-3 py-1 rounded-full inline-block ${getGradeColor(score.grade)}`}>
                        {score.grade}
                      </div>
                    </div>
                  </div>

                  {score.autoCap && score.autoCap.triggered && (
                    <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-md text-orange-800 text-sm">
                      <strong>Auto-capped:</strong> {score.autoCap.reason}
                    </div>
                  )}

                  {/* Breakdown Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Schema</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.schemaCompliance, 20)}`}>
                        {score.breakdown.schemaCompliance}/20
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Pedagogy</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.pedagogy, 25)}`}>
                        {score.breakdown.pedagogy}/25
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Questions</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.questions, 25)}`}>
                        {score.breakdown.questions}/25
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Marking</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.marking, 20)}`}>
                        {score.breakdown.marking}/20
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Visual</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.visual, 5)}`}>
                        {score.breakdown.visual}/5
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">Safety</div>
                      <div className={`text-xl font-bold ${getScoreColor(score.breakdown.safety, 5)}`}>
                        {score.breakdown.safety}/5
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    {score.details.map((detail, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(detail.section)}
                          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition"
                        >
                          <span className="font-medium">{detail.section}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${getScoreColor(detail.score, detail.maxScore)}`}>
                              {detail.score}/{detail.maxScore}
                            </span>
                            <span className="text-gray-500">
                              {expandedSections.has(detail.section) ? '▼' : '▶'}
                            </span>
                          </div>
                        </button>

                        {expandedSections.has(detail.section) && (
                          <div className="p-4 space-y-3">
                            {detail.issues.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-red-700 mb-2">Issues:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {detail.issues.map((issue, i) => (
                                    <li key={i} className="text-sm text-red-600">{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {detail.suggestions.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-blue-700 mb-2">Suggestions:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {detail.suggestions.map((suggestion, i) => (
                                    <li key={i} className="text-sm text-blue-600">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison View */}
                {showComparison && previousScore && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Before vs After</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Previous</h4>
                        <div className="text-2xl font-bold text-gray-600">
                          {previousScore.total}/100
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Current</h4>
                        <div className="text-2xl font-bold text-blue-600">
                          {score.total}/100
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className={`text-lg font-semibold ${score.total > previousScore.total ? 'text-green-600' : score.total < previousScore.total ? 'text-red-600' : 'text-gray-600'}`}>
                        {score.total > previousScore.total && `+${score.total - previousScore.total} points improvement`}
                        {score.total < previousScore.total && `${previousScore.total - score.total} points worse`}
                        {score.total === previousScore.total && 'No change'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson Preview */}
                {lessonData && (
                  <details className="bg-white rounded-lg shadow p-6">
                    <summary className="text-xl font-semibold cursor-pointer hover:text-blue-600">
                      Lesson Data Preview
                    </summary>
                    <pre className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(lessonData, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {!score && !loading && (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                <p className="text-lg">Select a lesson and click "Score Lesson" to begin</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Scoring lesson...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
