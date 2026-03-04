'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FolderGit2,
  Info,
  Loader2,
  Link2,
  RefreshCcw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import LessonSelector from './LessonSelector';
import GamePreview from './GamePreview';
import { MicrobreakContent } from '@/data/lessons/types';
import { getCoursePrefixForClient } from '@/lib/routing/curricula';

interface LessonOption {
  id: string;
  filename: string;
  title: string;
  unit: string;
  description: string;
  microbreakCount: number;
  hasVocab: boolean;
  vocabTermCount: number;
  hasExplanations: boolean;
  explanationCount: number;
  totalBlocks: number;
  availableMicrobreakSlots: number;
  simulationEmbedUrl?: string | null;
  simulationRepoName?: string | null;
  hasSocratic?: boolean;
  socraticQuestionCount?: number | null;
  socraticStartLevel?: number | null;
}

type GameType =
  | 'matching'
  | 'sorting'
  | 'spot-error'
  | 'quick-win'
  | 'sequencing'
  | 'fill-gap'
  | 'is-correct-why'
  | 'diagnosis-ranked'
  | 'classify-two-bins'
  | 'scenario-match'
  | 'formula-build'
  | 'tap-the-line'
  | 'tap-the-word'
  | 'elimination';

type GenerationStatus = 'idle' | 'generating' | 'preview' | 'saving' | 'deleting' | 'success' | 'error';
type SelectionMode = 'auto' | 'manual';

interface GameGeneratorFormProps {
  initialSelectedLessonFilename?: string | null;
}

export default function GameGeneratorForm({ initialSelectedLessonFilename = null }: GameGeneratorFormProps) {
  const extractRepoFromEmbedUrl = (embedUrl?: string | null): string | null => {
    if (!embedUrl) return null;
    const match = embedUrl.trim().match(/^\/simulations\/([^/?#]+)/i);
    return match?.[1] ?? null;
  };

  const coursePrefix = getCoursePrefixForClient();
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [selectedLessonFilename, setSelectedLessonFilename] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('auto');
  const [selectedGameTypes, setSelectedGameTypes] = useState<Set<GameType>>(new Set(['matching', 'sorting']));
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedGames, setGeneratedGames] = useState<Array<{
    id: string;
    type: string;
    order: number;
    content: MicrobreakContent;
  }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [embedPath, setEmbedPath] = useState('');
  const [overwriteSimulation, setOverwriteSimulation] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'cloning' | 'updating' | 'deleting'>('idle');
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<{
    message: string;
    embedUrl?: string;
    path?: string;
  } | null>(null);
  const [socraticQuestionCount, setSocraticQuestionCount] = useState(8);
  const [socraticStatus, setSocraticStatus] = useState<'idle' | 'saving'>('idle');

  const fetchLessons = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/generate-games', {
        headers: {
          'x-course-prefix': coursePrefix,
        },
      });
      const data = await response.json();
      const loadedLessons: LessonOption[] = data.lessons || [];
      setLessons(loadedLessons);

      if (initialSelectedLessonFilename) {
        const hasRequestedLesson = loadedLessons.some(
          (lesson) => lesson.filename === initialSelectedLessonFilename
        );
        if (hasRequestedLesson) {
          setSelectedLessonFilename(initialSelectedLessonFilename);
        }
      }
    } catch (error) {
      console.error('Failed to load lessons:', error);
      setErrorMessage('Failed to load lessons. Please refresh the page.');
    } finally {
      setLoadingLessons(false);
    }
  }, [coursePrefix, initialSelectedLessonFilename]);

  useEffect(() => {
    void fetchLessons();
  }, [fetchLessons]);

  const selectedLesson = lessons.find((l) => l.filename === selectedLessonFilename);
  const selectedSimulationEmbedUrl = selectedLesson?.simulationEmbedUrl ?? null;
  const selectedSimulationRepo =
    selectedLesson?.simulationRepoName ??
    extractRepoFromEmbedUrl(selectedSimulationEmbedUrl);
  const estimatedGenerationCount = selectedLesson?.availableMicrobreakSlots || 0;
  const isManualMode = selectionMode === 'manual';
  const hasManualWhitelist = selectedGameTypes.size > 0;

  useEffect(() => {
    if (!selectedLesson) {
      setSocraticQuestionCount(8);
      return;
    }
    const current = selectedLesson.socraticQuestionCount;
    if (typeof current === 'number') {
      setSocraticQuestionCount(Math.max(8, Math.min(10, Math.round(current))));
      return;
    }
    setSocraticQuestionCount(8);
  }, [selectedLesson]);

  const toggleGameType = (gameType: GameType) => {
    const newTypes = new Set(selectedGameTypes);
    if (newTypes.has(gameType)) {
      newTypes.delete(gameType);
    } else {
      newTypes.add(gameType);
    }
    setSelectedGameTypes(newTypes);
  };

  const buildRequestBody = (operation: 'preview' | 'save') => ({
    filename: selectedLesson?.filename,
    operation,
    mode: selectionMode,
    allowedGameTypes: isManualMode ? Array.from(selectedGameTypes) : [],
  });

  const handleGeneratePreview = async () => {
    if (!selectedLessonFilename) {
      setErrorMessage('Please select a lesson.');
      return;
    }

    if (isManualMode && !hasManualWhitelist) {
      setErrorMessage('Select at least one game type, or switch to Auto-pick.');
      return;
    }

    setStatus('generating');
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    try {
      const requestBody = buildRequestBody('preview');

      const response = await fetch('/api/admin/generate-games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error || 'Generation failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        if (data.errorType) errorMsg += `\n\nError Type: ${data.errorType}`;
        if (data.stack) errorMsg += `\n\nStack:\n${data.stack}`;

        setDebugInfo(JSON.stringify({ request: requestBody, response: { status: response.status, data } }, null, 2));
        throw new Error(errorMsg);
      }

      setGeneratedGames(data.games || []);
      setStatus('preview');
      setSuccessMessage(
        `Slots: ${data.slotCount ?? 0} | Planned: ${data.gamesPlanned ?? 0} | Generated: ${data.generatedCount ?? (data.games?.length || 0)} | Mode: ${data.modeUsed ?? selectionMode}`
      );
    } catch (error) {
      console.error('Generation error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate games');
    }
  };

  const handleSaveToLesson = async () => {
    if (!selectedLessonFilename || generatedGames.length === 0) return;

    if (isManualMode && !hasManualWhitelist) {
      setErrorMessage('Select at least one game type, or switch to Auto-pick.');
      return;
    }

    setStatus('saving');
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    try {
      const requestBody = buildRequestBody('save');
      const requestBodyWithGames = {
        ...requestBody,
        games: generatedGames,
      };

      const response = await fetch('/api/admin/generate-games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify(requestBodyWithGames),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error || 'Save failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        if (data.errorType) errorMsg += `\n\nError Type: ${data.errorType}`;
        if (data.stack) errorMsg += `\n\nStack:\n${data.stack}`;

        setDebugInfo(JSON.stringify({ request: requestBodyWithGames, response: { status: response.status, data } }, null, 2));
        throw new Error(errorMsg);
      }

      setStatus('success');
      setSuccessMessage(
        `Saved ${data.generatedCount ?? data.gamesAdded ?? 0} game(s). Slots: ${data.slotCount ?? 0} | Mode: ${data.modeUsed ?? selectionMode}`
      );

      fetchLessons();
      setTimeout(() => {
        setGeneratedGames([]);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Save error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save games');
    }
  };

  const handleDeleteGames = async () => {
    if (!selectedLesson?.filename) return;
    if (selectedLesson.microbreakCount === 0) return;

    const confirmed = window.confirm(
      `Delete all ${selectedLesson.microbreakCount} game(s) from ${selectedLesson.id}?`
    );
    if (!confirmed) return;

    setStatus('deleting');
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    try {
      const requestBody = { filename: selectedLesson.filename };
      const response = await fetch('/api/admin/generate-games', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMsg = data.error || 'Delete failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        setDebugInfo(JSON.stringify({ request: requestBody, response: { status: response.status, data } }, null, 2));
        throw new Error(errorMsg);
      }

      setGeneratedGames([]);
      setStatus('success');
      setSuccessMessage(`Deleted ${data.removedCount ?? 0} game(s) from ${selectedLesson.id}.`);
      await fetchLessons();
      setStatus('idle');
    } catch (error) {
      console.error('Delete games error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete games');
    }
  };

  const handleCloneSimulation = async (forceOverwrite: boolean, mode: 'cloning' | 'updating') => {
    if (!selectedLesson?.id) {
      setSimulationError('Please select a lesson first.');
      return;
    }

    if (!repoUrl.trim()) {
      setSimulationError('Please enter a GitHub repository URL.');
      return;
    }

    setSimulationStatus(mode);
    setSimulationError(null);
    setSimulationSuccess(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          repoUrl: repoUrl.trim(),
          embedPath: embedPath.trim() || undefined,
          overwrite: forceOverwrite || overwriteSimulation,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Clone and lesson link update failed.');
      }

      if (selectedLesson?.filename) {
        const nextEmbedUrl = typeof data.embedUrl === 'string' ? data.embedUrl : selectedLesson.simulationEmbedUrl ?? null;
        const nextRepoName = typeof data.repo?.name === 'string'
          ? data.repo.name
          : extractRepoFromEmbedUrl(nextEmbedUrl);

        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.filename === selectedLesson.filename
              ? {
                  ...lesson,
                  simulationEmbedUrl: nextEmbedUrl,
                  simulationRepoName: nextRepoName,
                }
              : lesson
          )
        );
      }

      setSimulationSuccess({
        message: mode === 'updating' ? 'Simulation repo updated and lesson iframe linked.' : 'Simulation repo cloned and lesson iframe linked.',
        embedUrl: data.embedUrl,
        path: data.repo?.path,
      });
    } catch (error) {
      setSimulationError(error instanceof Error ? error.message : 'Simulation operation failed.');
    } finally {
      setSimulationStatus('idle');
    }
  };

  const handleDeleteSimulation = async () => {
    if (!selectedLesson?.id) {
      setSimulationError('Please select a lesson first.');
      return;
    }

    const confirmed = window.confirm(
      `Delete the linked simulation repo folder for ${selectedLesson.id}? This removes files from src/app/simulations.`
    );
    if (!confirmed) return;

    setSimulationStatus('deleting');
    setSimulationError(null);
    setSimulationSuccess(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          repoUrl: repoUrl.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed.');
      }

      if (selectedLesson?.filename && data.embedCleared) {
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.filename === selectedLesson.filename
              ? {
                  ...lesson,
                  simulationEmbedUrl: null,
                  simulationRepoName: null,
                }
              : lesson
          )
        );
      }

      setSimulationSuccess({
        message: data.message || 'Simulation repo delete completed.',
        embedUrl: data.embedCleared ? '(cleared from lesson diagram)' : undefined,
        path: data.repo?.path,
      });
    } catch (error) {
      setSimulationError(error instanceof Error ? error.message : 'Delete failed.');
    } finally {
      setSimulationStatus('idle');
    }
  };

  const handleAddSocraticQuestions = async () => {
    if (!selectedLesson) {
      setErrorMessage('Please select a lesson first.');
      return;
    }

    const defaultQuestionCount = Math.max(8, Math.min(10, Math.round(socraticQuestionCount)));
    const defaultStartLevel = 1;

    setSocraticStatus('saving');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/admin/socratic-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          filename: selectedLesson.filename,
          enabled: true,
          questionCount: defaultQuestionCount,
          startLevel: defaultStartLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save Socratic settings.');
      }

      setSuccessMessage(`Socratic questions enabled (${defaultQuestionCount} questions, start Level ${defaultStartLevel}).`);
      await fetchLessons();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save Socratic settings.');
    } finally {
      setSocraticStatus('idle');
    }
  };

  const gameTypeOptions: Array<{ value: GameType; label: string; description: string }> = [
    { value: 'matching', label: 'Matching', description: 'Match terms to definitions' },
    { value: 'sorting', label: 'Sorting', description: 'Sort items into two categories' },
    { value: 'spot-error', label: 'Spot the Error', description: 'Identify the incorrect statement' },
    { value: 'quick-win', label: 'Quick Win Sprint', description: 'Rapid-fire easy questions' },
    { value: 'sequencing', label: 'Sequencing', description: 'Arrange steps in correct order' },
    { value: 'fill-gap', label: 'Fill Gap', description: 'Fill missing terms in sentence context' },
    { value: 'is-correct-why', label: 'Is Correct + Why', description: 'Judge statement then pick reason' },
    { value: 'diagnosis-ranked', label: 'Diagnosis Ranked', description: 'Rank top two likely causes' },
    { value: 'classify-two-bins', label: 'Classify Two Bins', description: 'Sort items into left/right bins' },
    { value: 'scenario-match', label: 'Scenario Match', description: 'Match scenarios to answers' },
    { value: 'formula-build', label: 'Formula Build', description: 'Assemble formula from tokens' },
    { value: 'tap-the-line', label: 'Tap The Line', description: 'Pick the correct line from list' },
    { value: 'tap-the-word', label: 'Tap The Word', description: 'Pick the correct word or phrase' },
    { value: 'elimination', label: 'Elimination', description: 'Eliminate then choose final answer' },
  ];

  const isGenerating = status === 'generating' || status === 'saving' || status === 'deleting';
  const hasPreview = status === 'preview' || status === 'success' || status === 'saving';
  const generateDisabled =
    !selectedLessonFilename ||
    isGenerating ||
    estimatedGenerationCount === 0 ||
    (isManualMode && !hasManualWhitelist);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 dark:text-white">
          <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          Lesson Selection
        </h2>

        {loadingLessons ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600 dark:text-cyan-400" />
            <span className="ml-2 text-gray-600 dark:text-slate-400">Loading lessons...</span>
          </div>
        ) : (
          <LessonSelector
            lessons={lessons}
            selectedLessonFilename={selectedLessonFilename}
            onSelect={setSelectedLessonFilename}
            disabled={isGenerating}
          />
        )}

        {selectedLesson && (
          <div className="mt-4 rounded-xl border border-cyan-300/50 bg-cyan-50/80 p-4 dark:border-cyan-700/40 dark:bg-cyan-950/25">
            <h3 className="mb-1 font-semibold text-cyan-900 dark:text-cyan-100">{selectedLesson.title}</h3>
            <p className="mb-3 text-sm text-cyan-800 dark:text-cyan-200">{selectedLesson.description}</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5 text-sm">
              <div className="rounded bg-white/90 px-3 py-2 dark:bg-slate-900/60">
                <div className="text-gray-600 dark:text-slate-400">Total Blocks</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.totalBlocks}</div>
              </div>
              <div className="rounded bg-white/90 px-3 py-2 dark:bg-slate-900/60">
                <div className="text-gray-600 dark:text-slate-400">Vocab Terms</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.vocabTermCount}</div>
              </div>
              <div className="rounded bg-white/90 px-3 py-2 dark:bg-slate-900/60">
                <div className="text-gray-600 dark:text-slate-400">Explanations</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.explanationCount}</div>
              </div>
              <div className="rounded bg-white/90 px-3 py-2 dark:bg-slate-900/60">
                <div className="text-gray-600 dark:text-slate-400">Existing Games</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.microbreakCount}</div>
              </div>
              <div className="rounded bg-white/90 px-3 py-2 dark:bg-slate-900/60">
                <div className="text-gray-600 dark:text-slate-400">Microbreak Slots</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.availableMicrobreakSlots}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 dark:text-white">
          <SlidersHorizontal className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          Game Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <p className="mb-3 block text-sm font-semibold text-gray-700 dark:text-slate-300">Generation Mode</p>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${selectionMode === 'auto' ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                <input
                  type="radio"
                  name="generationMode"
                  checked={selectionMode === 'auto'}
                  onChange={() => setSelectionMode('auto')}
                  disabled={isGenerating}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Auto-pick best games (recommended)</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Planner chooses best eligible game types for this lesson.</div>
                </div>
              </label>
              <label className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${selectionMode === 'manual' ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                <input
                  type="radio"
                  name="generationMode"
                  checked={selectionMode === 'manual'}
                  onChange={() => setSelectionMode('manual')}
                  disabled={isGenerating}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Let me choose allowed game types (advanced)</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Use a whitelist to restrict what the planner may choose.</div>
                </div>
              </label>
            </div>
          </div>

          {!isManualMode && (
            <div className="rounded-lg border border-cyan-300/60 bg-cyan-50/80 p-4 text-sm text-gray-700 dark:border-cyan-700/50 dark:bg-cyan-900/20 dark:text-slate-300">
              Planner will choose the best game types for this lesson.
            </div>
          )}

          {isManualMode && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Restrict Game Types (optional whitelist)
              </label>
              <p className="mb-3 text-sm text-gray-600 dark:text-slate-400">
                The planner will choose from this list. Not guaranteed 1-per-type.
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {gameTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                      selectedGameTypes.has(option.value)
                        ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGameTypes.has(option.value)}
                      onChange={() => toggleGameType(option.value)}
                      disabled={isGenerating}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-600 dark:text-cyan-400 dark:focus:ring-cyan-400"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {!hasManualWhitelist && (
                <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
                  Select at least one game type, or switch to Auto-pick.
                </p>
              )}
            </div>
          )}

          <div className="rounded-lg border border-amber-300/60 bg-amber-50/80 p-4 text-sm dark:border-amber-700/50 dark:bg-amber-900/20">
            <p className="text-gray-700 dark:text-slate-300">
              This lesson has <span className="font-semibold text-amber-700 dark:text-amber-300">{estimatedGenerationCount}</span> microbreak slot{estimatedGenerationCount !== 1 ? 's' : ''}.
            </p>
            <p className="mt-1 text-gray-700 dark:text-slate-300">
              Will generate <span className="font-semibold text-amber-700 dark:text-amber-300">{estimatedGenerationCount}</span> game{estimatedGenerationCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 dark:text-white">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          End-of-Lesson Socratic Questions
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-slate-300">One click adds Socratic questions (question count 8-10, start Level 1).</p>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-sm dark:border-indigo-800/70 dark:bg-indigo-900/20">
            <p className="font-semibold text-indigo-800 dark:text-indigo-200">
              Status:{' '}
              {selectedLesson
                ? selectedLesson.hasSocratic
                  ? 'Added'
                  : 'Not added'
                : 'Select a lesson'}
            </p>
            {selectedLesson?.hasSocratic && (
              <p className="mt-1 text-indigo-700 dark:text-indigo-300">
                Current settings: {selectedLesson.socraticQuestionCount ?? 8} questions, start Level {selectedLesson.socraticStartLevel ?? 1}.
              </p>
            )}
          </div>

          <label className="flex max-w-xs flex-col gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Question Count</span>
            <input
              type="number"
              min={8}
              max={10}
              value={socraticQuestionCount}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                if (Number.isNaN(parsed)) return;
                setSocraticQuestionCount(Math.max(8, Math.min(10, Math.round(parsed))));
              }}
              disabled={!selectedLesson || socraticStatus === 'saving' || isGenerating}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
            />
          </label>

          <button
            onClick={handleAddSocraticQuestions}
            disabled={!selectedLesson || socraticStatus === 'saving' || isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4338ca,#6366f1)] px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {socraticStatus === 'saving' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Adding Socratic Questions...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {selectedLesson?.hasSocratic ? 'Update Socratic Questions' : 'Add Socratic Questions'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 dark:text-white">
          <FolderGit2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          Simulation Repo Import
        </h2>

        <div className="mb-4 rounded-lg border border-emerald-300/60 bg-emerald-50/80 p-4 text-sm dark:border-emerald-700/50 dark:bg-emerald-900/20">
          <p className="text-gray-800 dark:text-slate-200">
            Working lesson:{' '}
            <span className="font-semibold">
              {selectedLesson ? `${selectedLesson.id} - ${selectedLesson.title}` : 'No lesson selected'}
            </span>
          </p>
          <p className="text-gray-800 dark:text-slate-200">
            Current simulation repo: <span className="font-semibold">{selectedSimulationRepo ?? 'No repo cloned'}</span>
          </p>
          {selectedSimulationEmbedUrl && (
            <p className="text-gray-700 dark:text-slate-300">
              Current embed URL: <code>{selectedSimulationEmbedUrl}</code>
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Lesson for simulation import</span>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
              value={selectedLessonFilename ?? ''}
              onChange={(event) => setSelectedLessonFilename(event.target.value || null)}
              disabled={loadingLessons || isGenerating || simulationStatus !== 'idle'}
            >
              <option value="">Select lesson...</option>
              {lessons.map((lesson) => (
                <option key={lesson.filename} value={lesson.filename}>
                  {lesson.id} - {lesson.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-slate-300">GitHub Repo URL</span>
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repo.git"
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
              disabled={isGenerating || simulationStatus !== 'idle'}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Iframe File Path</span>
            <input
              type="text"
              value={embedPath}
              onChange={(event) => setEmbedPath(event.target.value)}
              placeholder="Leave blank to auto-detect (recommended)"
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
              disabled={isGenerating || simulationStatus !== 'idle'}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={overwriteSimulation}
              onChange={(event) => setOverwriteSimulation(event.target.checked)}
              disabled={isGenerating || simulationStatus !== 'idle'}
            />
            Overwrite existing simulation folder
          </label>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <button
            onClick={() => handleCloneSimulation(false, 'cloning')}
            disabled={!selectedLesson || simulationStatus !== 'idle' || isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#059669,#16a34a)] px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {simulationStatus === 'cloning' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cloning Repo...
              </>
            ) : (
              <>
                <Link2 className="h-5 w-5" />
                Clone and Link Iframe
              </>
            )}
          </button>

          <button
            onClick={() => handleCloneSimulation(true, 'updating')}
            disabled={!selectedLesson || simulationStatus !== 'idle' || isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {simulationStatus === 'updating' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating Repo...
              </>
            ) : (
              <>
                <RefreshCcw className="h-5 w-5" />
                Update Repo
              </>
            )}
          </button>

          <button
            onClick={handleDeleteSimulation}
            disabled={!selectedLesson || simulationStatus !== 'idle' || isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {simulationStatus === 'deleting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Deleting Repo...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete Repo
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
          Clones into <code>src/app/simulations</code> and updates the selected lesson&apos;s diagram
          <code className="ml-1">embedUrl</code>.
        </p>

        {simulationError && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200">
            {simulationError}
          </div>
        )}

        {simulationSuccess && (
          <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="font-semibold">{simulationSuccess.message}</p>
            {simulationSuccess.embedUrl && <p>Embed URL: <code>{simulationSuccess.embedUrl}</code></p>}
            {simulationSuccess.path && <p>Folder: <code>{simulationSuccess.path}</code></p>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          onClick={handleGeneratePreview}
          disabled={generateDisabled}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0891b2,#0ea5e9)] px-6 py-4 font-semibold text-white shadow-lg shadow-cyan-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'generating' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Preview
            </>
          )}
        </button>

        {hasPreview && (
          <button
            onClick={handleSaveToLesson}
            disabled={generatedGames.length === 0 || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#059669,#16a34a)] px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'saving' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save to Lesson
              </>
            )}
          </button>
        )}

        <button
          onClick={handleDeleteGames}
          disabled={!selectedLessonFilename || !selectedLesson || selectedLesson.microbreakCount === 0 || isGenerating}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'deleting' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-5 w-5" />
              Delete Games
            </>
          )}
        </button>
      </div>

      {estimatedGenerationCount === 0 && selectedLesson && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="font-semibold text-amber-900 dark:text-amber-100">No Available Slots</div>
          <div className="text-sm text-amber-800 dark:text-amber-200">
            This lesson has 0 microbreak slots. No games will be generated unless lesson structure changes.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <div className="font-semibold text-red-900 dark:text-red-100">Error</div>
            <div className="whitespace-pre-wrap font-mono text-sm text-red-800 dark:text-red-200">{errorMessage}</div>
            {debugInfo && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100">
                  Debug Information (click to expand)
                </summary>
                <pre className="mt-2 overflow-x-auto rounded border border-red-300 bg-red-100 p-3 text-xs dark:border-red-800 dark:bg-red-950">{debugInfo}</pre>
              </details>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <div className="font-semibold text-green-900 dark:text-green-100">Success</div>
            <div className="text-sm text-green-800 dark:text-green-200">{successMessage}</div>
          </div>
        </div>
      )}

      {selectedLesson && selectedLesson.vocabTermCount < 3 && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <div className="font-semibold text-amber-900 dark:text-amber-100">Limited Content</div>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              This lesson has only {selectedLesson.vocabTermCount} vocab term{selectedLesson.vocabTermCount !== 1 ? 's' : ''}. Game generation may produce limited or repetitive content. Consider lessons with more vocabulary for better results.
            </div>
          </div>
        </div>
      )}

      {hasPreview && generatedGames.length > 0 && (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
          <GamePreview games={generatedGames} />
        </div>
      )}
    </div>
  );
}
