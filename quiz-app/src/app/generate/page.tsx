'use client';

/**
 * Lesson Generator UI
 * Web interface for automated lesson generation
 */

import { useState } from 'react';
import Link from 'next/link';

interface GenerationForm {
  unit: number;
  lessonId: string;
  topic: string;
  section: string;
  layout?: 'split-vis' | 'linear-flow' | 'auto';
  prerequisites: string[];
  mustHaveTopics?: string;
  additionalInstructions?: string;
  youtubeUrl?: string;
}

interface GenerationStatus {
  stage: 'idle' | 'generating' | 'success' | 'error';
  message: string;
  progress: number;
  result?: {
    lessonFile: string;
    quizFile: string;
    branchName: string;
    branchUrl: string;
    warnings: string[];
  };
  error?: string;
}

export default function GeneratePage() {
  const [form, setForm] = useState<GenerationForm>({
    unit: 202,
    lessonId: '',
    topic: '',
    section: 'Science 2365 Level 2',
    layout: 'auto',
    prerequisites: [],
    mustHaveTopics: '',
    additionalInstructions: '',
    youtubeUrl: '',
  });

  const [status, setStatus] = useState<GenerationStatus>({
    stage: 'idle',
    message: '',
    progress: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.lessonId || !form.topic) {
      alert('Please fill in all required fields');
      return;
    }

    setStatus({
      stage: 'generating',
      message: 'Starting generation...',
      progress: 10,
    });

    try {
      // Prepare request
      const request = {
        unit: form.unit,
        lessonId: form.lessonId,
        topic: form.topic,
        section: form.section,
        layout: form.layout === 'auto' ? undefined : form.layout,
        prerequisites: form.prerequisites.filter(p => p.length > 0),
        mustHaveTopics: form.mustHaveTopics && form.mustHaveTopics.trim().length > 0 
          ? form.mustHaveTopics.trim() 
          : undefined,
        additionalInstructions: form.additionalInstructions && form.additionalInstructions.trim().length > 0
          ? form.additionalInstructions.trim()
          : undefined,
        youtubeUrl: form.youtubeUrl && form.youtubeUrl.trim().length > 0
          ? form.youtubeUrl.trim()
          : undefined,
      };

      setStatus({
        stage: 'generating',
        message: 'Generating lesson content...',
        progress: 30,
      });

      // Call API
      const response = await fetch('/api/lesson-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setStatus({
        stage: 'success',
        message: 'Generation complete!',
        progress: 100,
        result: {
          lessonFile: data.lessonFile,
          quizFile: data.quizFile,
          branchName: data.branchName,
          branchUrl: data.branchUrl,
          warnings: data.warnings || [],
        },
      });
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
    setForm({
      unit: 202,
      lessonId: '',
      topic: '',
      section: 'Science 2365 Level 2',
      layout: 'auto',
      prerequisites: [],
      mustHaveTopics: '',
      additionalInstructions: '',
      youtubeUrl: '',
    });
    setStatus({
      stage: 'idle',
      message: '',
      progress: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lesson Generator</h1>
              <p className="text-gray-600 dark:text-slate-300 mt-1">
                Automatically generate complete lessons with AI
              </p>
            </div>
            <Link
              href="/learn"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              ← Back to Lessons
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          {status.stage === 'idle' || status.stage === 'generating' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Unit & Lesson ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Unit Number *
                  </label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    disabled={status.stage === 'generating'}
                  >
                    <option value={201}>Unit 201 - Health & Safety</option>
                    <option value={202}>Unit 202 - Science</option>
                    <option value={203}>Unit 203 - Installations</option>
                    <option value={204}>Unit 204 - Wiring Systems & Enclosures</option>
                    <option value={210}>Unit 210 - Communication</option>
                    <option value={305}>Unit 305 - Advanced Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Lesson ID * (e.g., 7E)
                  </label>
                  <input
                    type="text"
                    value={form.lessonId}
                    onChange={e => setForm({ ...form, lessonId: e.target.value.toUpperCase() })}
                    placeholder="7E"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    disabled={status.stage === 'generating'}
                    required
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  placeholder="e.g., Capacitors in AC Circuits"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  disabled={status.stage === 'generating'}
                  required
                />
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Section *
                </label>
                <select
                  value={form.section}
                  onChange={e => setForm({ ...form, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  disabled={status.stage === 'generating'}
                >
                  <option value="Science 2365 Level 2">Science 2365 Level 2</option>
                  <option value="Health & Safety Level 1">Health & Safety Level 1</option>
                  <option value="Health & Safety Level 2">Health & Safety Level 2</option>
                  <option value="Electrical Installations Technology">
                    Electrical Installations Technology
                  </option>
                </select>
              </div>

              {/* Layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Layout
                </label>
                <select
                  value={form.layout}
                  onChange={e => setForm({ ...form, layout: e.target.value as 'split-vis' | 'linear-flow' | 'auto' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  disabled={status.stage === 'generating'}
                >
                  <option value="auto">Auto (infer from content)</option>
                  <option value="split-vis">Split-Vis (diagram + content)</option>
                  <option value="linear-flow">Linear Flow (single column)</option>
                </select>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Prerequisites (comma-separated lesson IDs)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 202-1A, 202-2A"
                  onChange={e =>
                    setForm({
                      ...form,
                      prerequisites: e.target.value.split(',').map(p => p.trim()),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  disabled={status.stage === 'generating'}
                />
              </div>

              {/* Lesson Structure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Lesson Structure (optional)
                  <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                    — A high-level view of the lesson and its syllabus or goals
                  </span>
                </label>
                <textarea
                  value={form.mustHaveTopics}
                  onChange={e => setForm({ ...form, mustHaveTopics: e.target.value })}
                  placeholder="Example:&#10;- Introduction and foundational concepts&#10;- Core principles and theory&#10;- Practical applications and examples&#10;- Safety considerations and procedures&#10;- Real-world scenarios"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
                  disabled={status.stage === 'generating'}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Provide a high-level outline of sections and topics that must be included. AI will structure the lesson blocks to comprehensively cover this syllabus.
                </p>
              </div>

              {/* Additional Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Additional Instructions (optional)
                  <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                    — Custom instructions for the LLM
                  </span>
                </label>
                <textarea
                  value={form.additionalInstructions}
                  onChange={e => setForm({ ...form, additionalInstructions: e.target.value })}
                  placeholder="Example:&#10;- Make this lesson very detailed and text-heavy&#10;- Use lots of real-world examples&#10;- Focus on practical applications over theory&#10;- Keep explanations simple and avoid jargon"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
                  disabled={status.stage === 'generating'}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Provide any custom instructions for how the AI should generate the lesson (tone, style, depth, etc.)
                </p>
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  YouTube Video URL (optional)
                  <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                    — For diagram block video embedding
                  </span>
                </label>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  disabled={status.stage === 'generating'}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  YouTube video to embed in the diagram block (for split-vis layouts). Also saved in metadata.
                </p>
              </div>

              {/* Progress */}
              {status.stage === 'generating' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                    <span>{status.message}</span>
                    <span>{status.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status.stage === 'generating'}
                className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.stage === 'generating' ? 'Generating...' : 'Generate Lesson'}
              </button>
            </form>
          ) : status.stage === 'success' ? (
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
                <h2 className="text-2xl font-bold">Generation Complete!</h2>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Generated Files:
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-slate-300">
                    <li>📄 Lesson: {status.result?.lessonFile}</li>
                    <li>📝 Quiz: {status.result?.quizFile}</li>
                  </ul>
                </div>

                {status.result?.branchName !== 'N/A' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Git Branch:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                      {status.result?.branchName}
                    </p>
                    <a
                      href={status.result?.branchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View on GitHub →
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
                  className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
          ) : (
            <div className="space-y-6">
              {/* Error Message */}
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

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-slate-300">{status.error}</p>
              </div>

              <button
                onClick={resetForm}
                className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How it works
          </h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-slate-300 list-decimal list-inside">
            <li>Enter lesson details (unit, ID, topic)</li>
            <li>AI generates complete lesson with 8-10 blocks</li>
            <li>AI generates 50 quiz questions with misconception mapping</li>
            <li>System validates structure and quality</li>
            <li>Files are automatically integrated into codebase</li>
            <li>Git branch is created and pushed (auto-commit)</li>
            <li>Review the branch before merging to main</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
