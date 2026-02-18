'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Save, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';
import LessonSelector from './LessonSelector';
import GamePreview from './GamePreview';
import { MicrobreakContent } from '@/data/lessons/types';

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
}

type GameType =
  | 'matching'
  | 'sorting'
  | 'spot-error'
  | 'tap-label'
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

export default function GameGeneratorForm() {
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

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/admin/generate-games');
      const data = await response.json();
      setLessons(data.lessons || []);
    } catch (error) {
      console.error('Failed to load lessons:', error);
      setErrorMessage('Failed to load lessons. Please refresh the page.');
    } finally {
      setLoadingLessons(false);
    }
  };

  const selectedLesson = lessons.find(l => l.filename === selectedLessonFilename);
  const estimatedGenerationCount = selectedLesson?.availableMicrobreakSlots || 0;
  const isManualMode = selectionMode === 'manual';
  const hasManualWhitelist = selectedGameTypes.size > 0;

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
    allowedGameTypes: isManualMode ? Array.from(selectedGameTypes) : []
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
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

      const response = await fetch('/api/admin/generate-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error || 'Save failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        if (data.errorType) errorMsg += `\n\nError Type: ${data.errorType}`;
        if (data.stack) errorMsg += `\n\nStack:\n${data.stack}`;

        setDebugInfo(JSON.stringify({ request: requestBody, response: { status: response.status, data } }, null, 2));
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
        headers: { 'Content-Type': 'application/json' },
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

  const gameTypeOptions: Array<{ value: GameType; label: string; description: string }> = [
    { value: 'matching', label: 'Matching', description: 'Match terms to definitions' },
    { value: 'sorting', label: 'Sorting', description: 'Sort items into two categories' },
    { value: 'spot-error', label: 'Spot the Error', description: 'Identify the incorrect statement' },
    { value: 'tap-label', label: 'Tap to Label', description: 'Label diagram elements' },
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
    { value: 'elimination', label: 'Elimination', description: 'Eliminate then choose final answer' }
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>??</span>
          Lesson Selection
        </h2>

        {loadingLessons ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
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
          <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">{selectedLesson.title}</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">{selectedLesson.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
                <div className="text-gray-600 dark:text-slate-400">Total Blocks</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.totalBlocks}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
                <div className="text-gray-600 dark:text-slate-400">Vocab Terms</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.vocabTermCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
                <div className="text-gray-600 dark:text-slate-400">Explanations</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.explanationCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
                <div className="text-gray-600 dark:text-slate-400">Existing Games</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.microbreakCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded px-3 py-2">
                <div className="text-gray-600 dark:text-slate-400">Microbreak Slots</div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedLesson.availableMicrobreakSlots}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>??</span>
          Game Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <p className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Generation Mode</p>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectionMode === 'auto' ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-slate-700'}`}>
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
              <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectionMode === 'manual' ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-slate-700'}`}>
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
            <div className="rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-sm text-gray-700 dark:text-slate-300">
              Planner will choose the best game types for this lesson.
            </div>
          )}

          {isManualMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                Restrict Game Types (optional whitelist)
              </label>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                The planner will choose from this list. Not guaranteed 1-per-type.
              </p>
              <div className="space-y-2">
                {gameTypeOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGameTypes.has(option.value)
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGameTypes.has(option.value)}
                      onChange={() => toggleGameType(option.value)}
                      disabled={isGenerating}
                      className="mt-1 w-4 h-4 text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-slate-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
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

          <div className="rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-sm">
            <p className="text-gray-700 dark:text-slate-300">
              This lesson has <span className="font-semibold text-indigo-700 dark:text-indigo-300">{estimatedGenerationCount}</span> microbreak slot{estimatedGenerationCount !== 1 ? 's' : ''}.
            </p>
            <p className="text-gray-700 dark:text-slate-300 mt-1">
              Will generate <span className="font-semibold text-indigo-700 dark:text-indigo-300">{estimatedGenerationCount}</span> game{estimatedGenerationCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleGeneratePreview}
          disabled={generateDisabled}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {status === 'generating' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Preview
            </>
          )}
        </button>

        {hasPreview && (
          <button
            onClick={handleSaveToLesson}
            disabled={generatedGames.length === 0 || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {status === 'saving' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save to Lesson
              </>
            )}
          </button>
        )}

        <button
          onClick={handleDeleteGames}
          disabled={!selectedLessonFilename || !selectedLesson || selectedLesson.microbreakCount === 0 || isGenerating}
          className="flex items-center justify-center gap-2 px-5 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {status === 'deleting' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              Delete Games
            </>
          )}
        </button>
      </div>

      {estimatedGenerationCount === 0 && selectedLesson && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4">
          <div className="font-semibold text-amber-900 dark:text-amber-100">No Available Slots</div>
          <div className="text-sm text-amber-800 dark:text-amber-200">
            This lesson has 0 microbreak slots. No games will be generated unless lesson structure changes.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-900 dark:text-red-100">Error</div>
            <div className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono">{errorMessage}</div>
            {debugInfo && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
                  Debug Information (click to expand)
                </summary>
                <pre className="mt-2 text-xs bg-red-100 dark:bg-red-950 p-3 rounded overflow-x-auto border border-red-300 dark:border-red-800">{debugInfo}</pre>
              </details>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-green-900 dark:text-green-100">Success</div>
            <div className="text-sm text-green-800 dark:text-green-200">{successMessage}</div>
          </div>
        </div>
      )}

      {selectedLesson && selectedLesson.vocabTermCount < 3 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-900 dark:text-amber-100">Limited Content</div>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              This lesson has only {selectedLesson.vocabTermCount} vocab term{selectedLesson.vocabTermCount !== 1 ? 's' : ''}.
              Game generation may produce limited or repetitive content. Consider lessons with more vocabulary for better results.
            </div>
          </div>
        </div>
      )}

      {hasPreview && generatedGames.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
          <GamePreview games={generatedGames} />
        </div>
      )}
    </div>
  );
}
