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
  imageUrl?: string;
}

interface GenerationStatus {
  stage: 'idle' | 'generating' | 'success' | 'error';
  message: string;
  progress: number;
  result?: {
    lessonFile: string;
    quizFile: string;
    commitHash: string;
    commitUrl: string;
    warnings: string[];
  };
  error?: string;
  debugInfo?: {
    rawResponse: string;
    parseError: string;
    errorPosition?: {
      message: string;
      position?: number;
      line?: number;
      column?: number;
    };
    contentPreview?: {
      before: string;
      errorLocation: string;
      after: string;
    };
    attemptedOperation: string;
    timestamp: string;
  };
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
    imageUrl: '',
  });

  const [status, setStatus] = useState<GenerationStatus>({
    stage: 'idle',
    message: '',
    progress: 0,
  });

  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    error: string | null;
  }>({
    uploading: false,
    error: null,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ uploading: true, error: null });

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update the imageUrl field with the uploaded file path
      setForm({ ...form, imageUrl: data.path });
      setUploadStatus({ uploading: false, error: null });
    } catch (error) {
      setUploadStatus({
        uploading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  };

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
        imageUrl: form.imageUrl && form.imageUrl.trim().length > 0
          ? form.imageUrl.trim()
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
        const error = new Error(data.error || 'Generation failed') as Error & { debugInfo?: GenerationStatus['debugInfo'] };
        error.debugInfo = data.debugInfo; // Capture debug info from API
        throw error;
      }

      setStatus({
        stage: 'success',
        message: 'Generation complete!',
        progress: 100,
        result: {
          lessonFile: data.lessonFile,
          quizFile: data.quizFile,
          commitHash: data.commitHash,
          commitUrl: data.commitUrl,
          warnings: data.warnings || [],
        },
      });
    } catch (error) {
      setStatus({
        stage: 'error',
        message: 'Generation failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: error instanceof Error && 'debugInfo' in error ? (error as Error & { debugInfo?: GenerationStatus['debugInfo'] }).debugInfo : undefined, // Capture debug info
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
      imageUrl: '',
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
            <div className="flex gap-3">
              <Link
                href="/generate-quiz"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Quiz Generator →
              </Link>
              <Link
                href="/learn"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ← Back to Lessons
              </Link>
            </div>
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

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Image URL or Path (optional)
                  <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                    — For diagram block image (external URL or local path)
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/diagram.png or /images/lessons/204-14A.png"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    disabled={status.stage === 'generating' || uploadStatus.uploading}
                  />
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={status.stage === 'generating' || uploadStatus.uploading}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {uploadStatus.uploading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="hidden sm:inline">Browse</span>
                        </>
                      )}
                    </span>
                  </label>
                </div>
                {uploadStatus.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Error: {uploadStatus.error}
                  </p>
                )}
                {!uploadStatus.error && form.imageUrl && form.imageUrl.startsWith('/images/lessons/') && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Image uploaded successfully
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Upload an image file (JPG, PNG, GIF, WebP - max 5MB) or paste an external URL
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

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={status.stage === 'generating'}
                  className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.stage === 'generating' ? 'Generating...' : 'Generate Lesson'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Pre-fill form with test data
                    const testForm: GenerationForm = {
                      unit: 203,
                      lessonId: 'TEST',
                      topic: 'Sequential Generator Test',
                      section: 'Science 2365 Level 2',
                      layout: 'split-vis',
                      prerequisites: ['202-1A', '202-2B'],
                      mustHaveTopics: '- Introduction to test concepts\n- Core testing principles\n- Practical test applications',
                      additionalInstructions: 'This is a test lesson to verify sequential generation is working correctly.',
                      youtubeUrl: '',
                      imageUrl: '',
                    };
                    setForm(testForm);
                    
                    // Submit immediately
                    setTimeout(() => {
                      const event = new Event('submit', { bubbles: true, cancelable: true }) as any;
                      event.preventDefault = () => {};
                      handleSubmit(event);
                    }, 100);
                  }}
                  disabled={status.stage === 'generating'}
                  className="px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                  Test Sequential Gen
                </button>
              </div>
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

                {status.result?.commitHash !== 'N/A' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Committed to main:
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
                <div className="text-sm text-gray-700 dark:text-slate-300">
                  <p className="font-mono">{status.error}</p>
                  {status.error?.toLowerCase().includes('api') && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
                      <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                        💡 API Error Detected
                      </p>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        This appears to be an API error. Common causes:
                      </p>
                      <ul className="text-xs text-yellow-800 dark:text-yellow-300 list-disc list-inside mt-1 space-y-1">
                        <li>Invalid or expired API key</li>
                        <li>Rate limit or quota exceeded</li>
                        <li>Temporary service outage</li>
                        <li>Network connectivity issue</li>
                      </ul>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-2">
                        Check the Raw LLM Response below for more details.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Debug Information - Only show if available */}
              {status.debugInfo && (
                <div className="space-y-4">
                  {/* Error Position */}
                  {status.debugInfo.errorPosition && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Error Location:
                      </h3>
                      <div className="text-sm text-gray-700 dark:text-slate-300 font-mono">
                        {status.debugInfo.errorPosition.line && (
                          <p>Line: {status.debugInfo.errorPosition.line}</p>
                        )}
                        {status.debugInfo.errorPosition.column && (
                          <p>Column: {status.debugInfo.errorPosition.column}</p>
                        )}
                        {status.debugInfo.errorPosition.position && (
                          <p>Position: {status.debugInfo.errorPosition.position}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Context Preview */}
                  {status.debugInfo.contentPreview && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Context Around Error:
                      </h3>
                      <div className="text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                        <span className="text-gray-400">{status.debugInfo.contentPreview.before}</span>
                        <span className="bg-red-600 text-white px-1">
                          {status.debugInfo.contentPreview.errorLocation}
                        </span>
                        <span className="text-gray-400">{status.debugInfo.contentPreview.after}</span>
                      </div>
                    </div>
                  )}

                  {/* Raw Response - Collapsible */}
                  <details className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <summary className="font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                      Raw LLM Response (click to expand)
                    </summary>
                    <pre className="text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto mt-2 max-h-96 overflow-y-auto">
                      {status.debugInfo.rawResponse}
                    </pre>
                  </details>

                  {/* Operation Details */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Operation:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {status.debugInfo.attemptedOperation}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                      Timestamp: {new Date(status.debugInfo.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Try Again Button */}
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
