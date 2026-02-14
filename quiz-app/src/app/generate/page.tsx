/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

/**
 * Lesson Generator UI
 * Web interface for automated lesson generation
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DebugPanel } from '@/components/generate/DebugPanel';

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

interface LessonIndexEntry {
  id: string;
  title: string;
  unit: string;
  unitNumber: string;
  topic: string;
  description: string;
  questionCount: number;
  generationScore?: number | null;
  available: boolean;
  order: number;
}

interface DeleteStatus {
  deleting: boolean;
  success: boolean;
  error: string | null;
  filesModified?: string[];
  filesDeleted?: string[];
  warnings?: string[];
}

interface PhaseProgress {
  phase: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  output?: string;
}

interface RefinementPatch {
  path: string;
  issue: string;
  suggestion: string;
  oldValue: any;
  newValue: any;
  pointsRecovered: number;
}

interface QuestionDebugInfo {
  questionId: number;
  issue: string;
  questionText?: string;
  optionsCount?: number;
  options?: string[];
  fullQuestion?: any;
  expectedFormat?: string;
  actualFormat?: string;
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
    phases?: PhaseProgress[];
    refinementMetadata?: {
      wasRefined: boolean;
      originalScore: number;
      finalScore: number;
      patchesApplied: number;
      details: RefinementPatch[];
    };
    debugBundle?: any; // GenerationDebugBundle from types
  };
  error?: string;
  errors?: string[];
  warnings?: string[];
  rawResponse?: string;
  responseStatus?: number;
  responseType?: string;
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
  debugData?: QuestionDebugInfo[];
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

  const [lessons, setLessons] = useState<LessonIndexEntry[]>([]);
  const [lessonsByUnit, setLessonsByUnit] = useState<Record<string, LessonIndexEntry[]>>({});
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>({
    deleting: false,
    success: false,
    error: null,
  });

  // Improve Lesson state
  const [selectedImproveLesson, setSelectedImproveLesson] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [improveStatus, setImproveStatus] = useState<{
    improving: boolean;
    success: boolean;
    error: string | null;
    result?: {
      wasImproved: boolean;
      originalScore: number;
      finalScore: number;
      scoreDelta: number;
      validationFailures?: string[];
    };
  }>({
    improving: false,
    success: false,
    error: null,
  });
  const selectedImproveLessonData = selectedImproveLesson
    ? lessons.find((lesson) => lesson.id === selectedImproveLesson)
    : null;

  const fetchLessons = useCallback(async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons);
        setLessonsByUnit(data.byUnit);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  }, []);

  // Fetch lessons on mount
  useEffect(() => {
    void fetchLessons();
  }, [fetchLessons]);

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

      let data: any = null;
      let rawResponse: string = '';
      const responseStatus = response.status;
      const responseType = response.headers.get('content-type') || 'unknown';

      // STEP 1: Get raw response text first (works for both JSON and HTML)
      try {
        rawResponse = await response.text();
      } catch (textError) {
        throw new Error(`Failed to read response: ${textError instanceof Error ? textError.message : 'Unknown error'}`);
      }

      // STEP 2: Try to parse as JSON
      if (!response.ok) {
        // Response is an error (404, 500, etc.)
        let errorMessage = `API request failed with status ${response.status}`;
        let errors: string[] | undefined;
        let warnings: string[] | undefined;
        let debugInfo: any = undefined;
        
        // Try to parse error response as JSON
        let debugData: QuestionDebugInfo[] | undefined;
        try {
          data = JSON.parse(rawResponse);
          errorMessage = data.error || errorMessage;
          errors = data.errors;
          warnings = data.warnings;
          debugInfo = data.debugInfo;
          debugData = data.debugData;
        } catch {
          // Not JSON, probably HTML error page
          errorMessage = `Server returned ${response.status} error (non-JSON response)`;
        }
        
        const error = new Error(errorMessage) as Error & {
          errors?: string[];
          warnings?: string[];
          debugInfo?: any;
          debugData?: QuestionDebugInfo[];
          rawResponse?: string;
          responseStatus?: number;
          responseType?: string;
        };
        error.errors = errors;
        error.warnings = warnings;
        error.debugInfo = debugInfo;
        error.debugData = debugData;
        error.rawResponse = rawResponse;
        error.responseStatus = responseStatus;
        error.responseType = responseType;
        throw error;
      }

      // STEP 3: Parse successful response
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        const error = new Error('Failed to parse API response as JSON') as Error & {
          rawResponse?: string;
          responseStatus?: number;
          responseType?: string;
        };
        error.rawResponse = rawResponse;
        error.responseStatus = responseStatus;
        error.responseType = responseType;
        throw error;
      }

      // STEP 4: Check data.success
      if (!data.success) {
        const error = new Error(data.error || 'Generation failed') as Error & {
          debugInfo?: GenerationStatus['debugInfo'];
          debugData?: QuestionDebugInfo[];
          errors?: string[];
          warnings?: string[];
        };
        error.debugInfo = data.debugInfo;
        error.debugData = data.debugData;
        error.errors = data.errors;
        error.warnings = data.warnings;
        throw error;
      }

      // Success - proceed as normal
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
          phases: data.phases || [],
          refinementMetadata: data.refinementMetadata,
          debugBundle: data.debugBundle,
        },
      });

      // Refresh lesson list so newly generated score appears without page reload.
      void fetchLessons();
    } catch (error) {
      const errorObj = error as Error & {
        debugInfo?: GenerationStatus['debugInfo'];
        debugData?: QuestionDebugInfo[];
        errors?: string[];
        warnings?: string[];
        rawResponse?: string;
        responseStatus?: number;
        responseType?: string;
      };
      
      setStatus({
        stage: 'error',
        message: 'Generation failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        errors: errorObj.errors,
        warnings: errorObj.warnings,
        debugInfo: errorObj.debugInfo,
        debugData: errorObj.debugData,
        rawResponse: errorObj.rawResponse,
        responseStatus: errorObj.responseStatus,
        responseType: errorObj.responseType,
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

  const handleToggleLesson = (lessonId: string) => {
    setSelectedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLessons(lessons.map(l => l.id));
  };

  const handleDeselectAll = () => {
    setSelectedLessons([]);
  };

  const handleDeleteLessons = async () => {
    if (selectedLessons.length === 0) {
      alert('Please select at least one lesson to delete');
      return;
    }

    const selectedLessonDetails = selectedLessons.map(id => {
      const lesson = lessons.find(l => l.id === id);
      return lesson ? `  • ${id} - ${lesson.title}` : `  • ${id}`;
    }).join('\n');

    const confirmMessage = `Are you sure you want to delete ${selectedLessons.length} lesson(s)?\n\n${selectedLessonDetails}\n\nThis will remove the lessons from all 7 integration points and cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeleteStatus({
      deleting: true,
      success: false,
      error: null,
    });

    try {
      const allFilesModified: string[] = [];
      const allFilesDeleted: string[] = [];
      const allWarnings: string[] = [];
      const errors: string[] = [];

      // Delete lessons one by one
      for (const lessonId of selectedLessons) {
        try {
          const response = await fetch('/api/delete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            errors.push(`${lessonId}: ${data.error || 'Deletion failed'}`);
          } else {
            if (data.filesModified) allFilesModified.push(...data.filesModified);
            if (data.filesDeleted) allFilesDeleted.push(...data.filesDeleted);
            if (data.warnings) allWarnings.push(...data.warnings);
          }
        } catch (error) {
          errors.push(`${lessonId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Failed to delete some lessons:\n${errors.join('\n')}`);
      }

      setDeleteStatus({
        deleting: false,
        success: true,
        error: null,
        filesModified: Array.from(new Set(allFilesModified)),
        filesDeleted: Array.from(new Set(allFilesDeleted)),
        warnings: allWarnings.length > 0 ? allWarnings : undefined,
      });

      // Refresh lessons list
      await fetchLessons();

      // Clear selection
      setSelectedLessons([]);

      // Auto-clear success message after 10 seconds
      setTimeout(() => {
        setDeleteStatus(prev => ({ ...prev, success: false }));
      }, 10000);

    } catch (error) {
      setDeleteStatus({
        deleting: false,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during deletion',
      });
    }
  };

  const handleImproveLesson = async () => {
    if (!selectedImproveLesson) return;
    
    if (!window.confirm(`Run Phase 10 v2 refinement on "${selectedImproveLesson}"?\n\nThis will score the lesson, attempt to improve it, and save the result if the score improves.`)) {
      return;
    }
    
    setImproveStatus({ improving: true, success: false, error: null });
    
    try {
      const response = await fetch('/api/improve-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId: selectedImproveLesson,
          additionalInstructions: additionalInstructions.trim() || undefined
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImproveStatus({
          improving: false,
          success: true,
          error: null,
          result: {
            wasImproved: data.wasImproved,
            originalScore: data.originalScore,
            finalScore: data.finalScore,
            scoreDelta: data.scoreDelta,
            validationFailures: data.validationFailures,
          },
        });
        
        // Reset selection after 5 seconds
        setTimeout(() => {
          setSelectedImproveLesson('');
        }, 5000);
      } else {
        setImproveStatus({
          improving: false,
          success: false,
          error: data.error || 'Improvement failed',
        });
      }
    } catch (error) {
      setImproveStatus({
        improving: false,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
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
                    // Pre-fill form with test data for 203-3A
                    const testForm: GenerationForm = {
                      unit: 203,
                      lessonId: '3A',
                      topic: 'Circuit Types: What They Do',
                      section: 'Electrical Installations Technology',
                      layout: 'split-vis',
                      prerequisites: [],
                      mustHaveTopics: '203-3A — Circuit Types: What They Do (3.1)\n\nLighting vs power/heating vs alarm/emergency vs data/comms vs control + ring final vs radial (principles + typical use).',
                      additionalInstructions: '',
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

                {/* Phase Progress */}
                {status.result?.phases && status.result.phases.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Sequential Generation Phases:
                    </h3>
                    <div className="space-y-2">
                      {status.result.phases.map((phase, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          {phase.status === 'completed' && (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {phase.status === 'failed' && (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 dark:text-white">{phase.phase}</span>
                            {phase.duration && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">
                                ({(phase.duration / 1000).toFixed(2)}s)
                              </span>
                            )}
                            {phase.output && (
                              <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                                {phase.output}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lesson Quality Score */}
                {status.result?.refinementMetadata && (
                  <div className={`p-4 border-2 rounded-lg ${
                    status.result.refinementMetadata.wasRefined 
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {status.result.refinementMetadata.wasRefined ? (
                        <>
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <h3 className="font-bold text-purple-900 dark:text-purple-200 text-lg">
                            🔧 Auto-Refinement Activated
                          </h3>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-green-900 dark:text-green-200 text-lg">
                            ✅ Lesson Quality Score
                          </h3>
                        </>
                      )}
                    </div>
                    <div className="space-y-3">
                      {status.result.refinementMetadata.wasRefined ? (
                        <>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {status.result.refinementMetadata.originalScore}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Original Score</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {status.result.refinementMetadata.finalScore}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Refined Score</div>
                            </div>
                          </div>
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <p className="text-sm text-gray-800 dark:text-slate-200">
                              <strong>Applied {status.result.refinementMetadata.patchesApplied} automatic fixes</strong> to improve lesson quality. 
                              Both the original and refined versions have been saved for comparison.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {status.result.refinementMetadata.finalScore}
                                <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lesson Quality Score</div>
                            </div>
                          </div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <p className="text-sm text-gray-800 dark:text-slate-200">
                              <strong>Excellent quality!</strong> This lesson scored {status.result.refinementMetadata.finalScore}/100 and met the quality threshold (≥93), so no refinement was needed.
                            </p>
                          </div>
                        </>
                      )}
                      {status.result.refinementMetadata.details && status.result.refinementMetadata.details.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm font-semibold text-purple-900 dark:text-purple-200 hover:underline">
                            View {status.result.refinementMetadata.details.length} Fixes Applied
                          </summary>
                          <div className="mt-2 space-y-2 pl-4">
                            {status.result.refinementMetadata.details.map((patch, i) => (
                              <div key={i} className="text-xs text-gray-700 dark:text-gray-300 border-l-2 border-purple-300 dark:border-purple-700 pl-3 py-1">
                                <div className="font-semibold">{i + 1}. {patch.issue}</div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">→ {patch.suggestion}</div>
                                <div className="text-purple-700 dark:text-purple-400 mt-1 font-mono">Path: {patch.path}</div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                    {status.result.refinementMetadata.wasRefined && (
                      <div className="mt-3 pt-3 border-t border-purple-300 dark:border-purple-700">
                        <p className="text-xs text-purple-800 dark:text-purple-300">
                          💡 <strong>Compare versions:</strong> Check <code className="bg-purple-200 dark:bg-purple-900 px-1 py-0.5 rounded">{status.result.lessonFile}</code> (refined) 
                          vs <code className="bg-purple-200 dark:bg-purple-900 px-1 py-0.5 rounded">{status.result.lessonFile.replace('.json', '-original.json')}</code>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Debug Panel (Phase 10) */}
                {status.result?.debugBundle && (
                  <DebugPanel debugBundle={status.result.debugBundle} />
                )}

                {/* Enhanced Warnings Display */}
                {status.result?.warnings && status.result.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="font-bold text-yellow-900 dark:text-yellow-200 text-lg">
                        Validation Warnings ({status.result.warnings.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {status.result.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                          <span className="flex-1 text-gray-800 dark:text-slate-200 font-mono text-xs leading-relaxed">
                            {warning}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-yellow-300 dark:border-yellow-700">
                      <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        These warnings indicate potential quality issues that should be reviewed. The lesson was still generated successfully.
                      </p>
                    </div>
                  </div>
                )}

                {/* Debug Logs Section */}
                <details className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Debug Information (click to expand)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      <div className="space-y-1">
                        <div>Lesson ID: {status.result?.lessonFile}</div>
                        <div>Generation Method: Sequential (9 phases)</div>
                        <div>Phases Completed: {status.result?.phases?.filter(p => p.status === 'completed').length || 0}/9</div>
                        <div>Total Warnings: {status.result?.warnings?.length || 0}</div>
                        <div>Commit: {status.result?.commitHash}</div>
                      </div>
                    </div>
                  </div>
                </details>
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

              {/* Validation Errors - Full Details */}
              {status.errors && status.errors.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-bold text-red-900 dark:text-red-200 text-lg">
                      Validation Errors ({status.errors.length})
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {status.errors.map((error, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm p-2 bg-white dark:bg-slate-800 rounded">
                        <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">{i + 1}.</span>
                        <span className="flex-1 text-gray-900 dark:text-slate-100 font-mono text-xs leading-relaxed">
                          {error}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-300 dark:border-red-700">
                    <p className="text-xs text-red-800 dark:text-red-300">
                      ❌ These are critical validation errors that must be fixed before the lesson can be generated.
                    </p>
                  </div>
                </div>
              )}

              {/* Validation Warnings from Error State */}
              {status.warnings && status.warnings.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="font-bold text-yellow-900 dark:text-yellow-200 text-lg">
                      Validation Warnings ({status.warnings.length})
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {status.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                        <span className="flex-1 text-gray-800 dark:text-slate-200 font-mono text-xs leading-relaxed">
                          {warning}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Response Display */}
              {status.rawResponse && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-400 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <h3 className="font-bold text-gray-900 dark:text-gray-200 text-lg">
                      Raw API Response
                      {status.responseStatus && (
                        <span className="ml-2 text-sm font-normal">
                          (HTTP {status.responseStatus} - {status.responseType})
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-words">{status.rawResponse}</pre>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      This shows the exact response from the server. If it&apos;s HTML, the API route crashed or returned a 404/500 error page.
                    </p>
                  </div>
                </div>
              )}

              {/* Question Debug Data - NEW SECTION */}
              {status.debugData && status.debugData.length > 0 && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 dark:border-purple-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-bold text-purple-900 dark:text-purple-200 text-lg">
                      Detailed Question Debug Info ({status.debugData.length} questions with issues)
                    </h3>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {status.debugData.map((debug, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-lg p-4">
                        {/* Question ID and Issue */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-200 dark:border-purple-800">
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            Question {debug.questionId}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            • {debug.issue}
                          </span>
                        </div>
                        
                        {/* Question Text */}
                        {debug.questionText && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Question Text:
                            </p>
                            <p className="text-sm font-mono text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-gray-900 p-2 rounded">
                              {debug.questionText}
                            </p>
                          </div>
                        )}
                        
                        {/* Options Count */}
                        {debug.optionsCount !== undefined && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Options Count:
                            </p>
                            <p className="text-sm">
                              <span className={`font-bold ${
                                debug.optionsCount === 4 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {debug.optionsCount} options
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 ml-2">
                                (expected: 4)
                              </span>
                            </p>
                          </div>
                        )}
                        
                        {/* Options List */}
                        {debug.options && debug.options.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Options:
                            </p>
                            <div className="space-y-1">
                              {debug.options.map((opt, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <span className="text-gray-500 dark:text-gray-500 font-mono">
                                    {String.fromCharCode(65 + idx)}:
                                  </span>
                                  <span className="flex-1 font-mono text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                                    {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Expected vs Actual Format */}
                        {debug.expectedFormat && debug.actualFormat && (
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Expected:
                              </p>
                              <p className="text-xs font-mono text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                {debug.expectedFormat}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Actual:
                              </p>
                              <p className="text-xs font-mono text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {debug.actualFormat}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Full Question Object - Collapsible */}
                        {debug.fullQuestion && (
                          <details className="mt-3">
                            <summary className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                              View Full Question JSON
                            </summary>
                            <pre className="text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto mt-2 max-h-48 overflow-y-auto">
                              {JSON.stringify(debug.fullQuestion, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-purple-300 dark:border-purple-700">
                    <p className="text-xs text-purple-800 dark:text-purple-300">
                      🔍 This shows detailed information about questions that failed validation. Use this to debug the quiz generation prompts.
                    </p>
                  </div>
                </div>
              )}

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
                  <details open className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <summary className="font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                      Raw LLM Response (auto-expanded on error)
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

        {/* Delete Lesson Card */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete Existing Lesson
          </h3>
          
          <div className="space-y-4">
            {/* Select/Deselect Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  disabled={deleteStatus.deleting}
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  disabled={deleteStatus.deleting}
                >
                  Deselect All
                </button>
              </div>
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {selectedLessons.length} of {lessons.length} selected
              </span>
            </div>

            {/* Checkbox List */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg max-h-96 overflow-y-auto">
              {Object.entries(lessonsByUnit).map(([unitNumber, unitLessons]) => (
                <div key={unitNumber} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                  <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-2 font-medium text-sm text-gray-700 dark:text-slate-300">
                    Unit {unitNumber}
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-slate-700">
                    {unitLessons.map((lesson) => (
                      <label
                        key={lesson.id}
                        className="flex items-center px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLessons.includes(lesson.id)}
                          onChange={() => handleToggleLesson(lesson.id)}
                          disabled={deleteStatus.deleting}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 dark:border-slate-600 dark:bg-slate-700"
                        />
                        <span className="ml-3 text-sm text-gray-900 dark:text-slate-200">
                          <span className="font-mono font-medium">{lesson.id}</span>
                          <span className="text-gray-600 dark:text-slate-400"> - {lesson.title}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDeleteLessons}
              disabled={selectedLessons.length === 0 || deleteStatus.deleting}
              className="w-full px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteStatus.deleting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <span>Delete {selectedLessons.length} Lesson{selectedLessons.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>

            {/* Success Message */}
            {deleteStatus.success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className="font-semibold text-green-900 dark:text-green-200">
                    Lesson Deleted Successfully!
                  </h4>
                </div>
                {deleteStatus.filesDeleted && deleteStatus.filesDeleted.length > 0 && (
                  <div className="text-sm text-green-800 dark:text-green-300 mb-2">
                    <p className="font-medium">Files Deleted:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {deleteStatus.filesDeleted.map((file, i) => (
                        <li key={i} className="font-mono text-xs">{file.split('hs_quiz\\')[1] || file}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {deleteStatus.filesModified && deleteStatus.filesModified.length > 0 && (
                  <div className="text-sm text-green-800 dark:text-green-300">
                    <p className="font-medium">Files Modified:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {deleteStatus.filesModified.map((file, i) => (
                        <li key={i} className="font-mono text-xs">{file.split('hs_quiz\\')[1] || file}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {deleteStatus.warnings && deleteStatus.warnings.length > 0 && (
                  <div className="text-sm text-yellow-800 dark:text-yellow-300 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="font-medium">Warnings:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {deleteStatus.warnings.map((warning, i) => (
                        <li key={i} className="text-xs">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {deleteStatus.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-red-900 dark:text-red-200">
                    Deletion Failed
                  </h4>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {deleteStatus.error}
                </p>
              </div>
            )}

            {/* Warning Note */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>Warning:</strong> Deletion is permanent and removes the lesson from all 7 integration points (lessonIndex, page imports, question files, etc.). Make sure you have a backup if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Improve Lesson Card */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            Improve Existing Lesson
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            Run Phase 10 v2 refinement on an existing lesson to improve its quality.
          </p>
          
          <div className="space-y-4">
            {/* Lesson Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Select Lesson
              </label>
              <select
                value={selectedImproveLesson}
                onChange={(e) => setSelectedImproveLesson(e.target.value)}
                disabled={improveStatus.improving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">-- Select a lesson --</option>
                {Object.entries(lessonsByUnit).map(([unitNumber, unitLessons]) => (
                  <optgroup key={unitNumber} label={`Unit ${unitNumber}`}>
                    {unitLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.id} - {lesson.title} {lesson.generationScore == null ? '[No score]' : `[${lesson.generationScore}/100]`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selectedImproveLessonData && (
                <p className="mt-2 text-xs text-gray-600 dark:text-slate-400">
                  Current generation score:{' '}
                  <strong>
                    {selectedImproveLessonData.generationScore == null
                      ? 'Not available'
                      : `${selectedImproveLessonData.generationScore}/100`}
                  </strong>
                </p>
              )}
            </div>

            {/* Additional Instructions (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                disabled={improveStatus.improving}
                rows={3}
                placeholder="e.g., Focus particularly on spaced review quality, or ensure strict marking rubric for synthesis questions..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Provide specific context or requirements that the scoring and improvement should consider.
              </p>
            </div>

            {/* Improve Button */}
            <button
              onClick={handleImproveLesson}
              disabled={!selectedImproveLesson || improveStatus.improving}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {improveStatus.improving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Improving...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  <span>Improve Lesson</span>
                </>
              )}
            </button>

            {/* Success Message */}
            {improveStatus.success && improveStatus.result && (
              <div className={`p-4 rounded-lg border ${
                improveStatus.result.wasImproved
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className={`w-5 h-5 ${
                    improveStatus.result.wasImproved 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className={`font-semibold ${
                    improveStatus.result.wasImproved 
                      ? 'text-green-900 dark:text-green-200' 
                      : 'text-yellow-900 dark:text-yellow-200'
                  }`}>
                    {improveStatus.result.wasImproved ? 'Lesson Improved!' : 'No Improvement Made'}
                  </h4>
                </div>
                <div className={`text-sm ${
                  improveStatus.result.wasImproved 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-yellow-800 dark:text-yellow-300'
                }`}>
                  <p><strong>Original Score:</strong> {improveStatus.result.originalScore}/100</p>
                  <p><strong>Final Score:</strong> {improveStatus.result.finalScore}/100</p>
                  <p><strong>Delta:</strong> {improveStatus.result.scoreDelta > 0 ? '+' : ''}{improveStatus.result.scoreDelta}</p>
                  {improveStatus.result.validationFailures && improveStatus.result.validationFailures.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Validation Issues:</p>
                      <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                        {improveStatus.result.validationFailures.map((failure, i) => (
                          <li key={i}>{failure}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {improveStatus.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-red-900 dark:text-red-200">
                    Improvement Failed
                  </h4>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {improveStatus.error}
                </p>
              </div>
            )}

            {/* Info Note */}
            <div className="text-xs text-gray-500 dark:text-slate-500 p-3 bg-gray-50 dark:bg-slate-700/50 rounded">
              <strong>Note:</strong> This runs Phase 10 v2 refinement only. The lesson will be scored, refined by the LLM, validated, and re-scored. Only improvements that pass validation and score gates will be saved.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

