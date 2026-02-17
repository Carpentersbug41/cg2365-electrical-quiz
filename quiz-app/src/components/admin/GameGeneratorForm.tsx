'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
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

type GenerationStatus = 'idle' | 'generating' | 'preview' | 'saving' | 'success' | 'error';

export default function GameGeneratorForm() {
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [selectedLessonFilename, setSelectedLessonFilename] = useState<string | null>(null);
  const [selectedGameTypes, setSelectedGameTypes] = useState<Set<GameType>>(new Set(['matching', 'sorting']));
  const [gameCount, setGameCount] = useState(2);
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

  // Load lessons on mount
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

  const toggleGameType = (gameType: GameType) => {
    const newTypes = new Set(selectedGameTypes);
    if (newTypes.has(gameType)) {
      newTypes.delete(gameType);
    } else {
      newTypes.add(gameType);
    }
    setSelectedGameTypes(newTypes);
  };

  const handleGeneratePreview = async () => {
    if (!selectedLessonFilename || selectedGameTypes.size === 0) {
      setErrorMessage('Please select a lesson and at least one game type');
      return;
    }

    if (!selectedLesson?.filename) {
      setErrorMessage('Invalid lesson selection');
      return;
    }

    console.log('=== Game Generation Request ===');
    console.log('Selected Lesson:', selectedLesson);
    console.log('Game Types:', Array.from(selectedGameTypes));
    console.log('Count per type:', gameCount);
    console.log('Total games to generate:', gameCount * selectedGameTypes.size);

    setStatus('generating');
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    try {
      const requestBody = {
        filename: selectedLesson.filename,
        gameTypes: Array.from(selectedGameTypes),
        count: gameCount,
        mode: 'preview'
      };

      console.log('Request body:', requestBody);

      const response = await fetch('/api/admin/generate-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        console.error('Request sent:', requestBody);
        
        // Build detailed error message
        let errorMsg = data.error || 'Generation failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        if (data.errorType) errorMsg += `\n\nError Type: ${data.errorType}`;
        if (data.stack) errorMsg += `\n\nStack:\n${data.stack}`;
        
        // Store debug info separately
        const debugData = {
          request: requestBody,
          response: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
        setDebugInfo(JSON.stringify(debugData, null, 2));
        
        throw new Error(errorMsg);
      }

      setGeneratedGames(data.games);
      setStatus('preview');
      setSuccessMessage(`Generated ${data.games.length} game${data.games.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Generation error caught:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate games');
    }
  };

  const handleSaveToLesson = async () => {
    if (!selectedLessonFilename || generatedGames.length === 0) return;

    if (!selectedLesson?.filename) {
      setErrorMessage('Invalid lesson selection');
      return;
    }

    console.log('=== Save Games Request ===');
    console.log('Selected Lesson:', selectedLesson);
    console.log('Games to save:', generatedGames.length);

    setStatus('saving');
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    try {
      const requestBody = {
        filename: selectedLesson.filename,
        gameTypes: Array.from(selectedGameTypes),
        count: gameCount,
        mode: 'save'
      };

      console.log('Request body:', requestBody);

      const response = await fetch('/api/admin/generate-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        console.error('Request sent:', requestBody);
        
        // Build detailed error message
        let errorMsg = data.error || 'Save failed';
        if (data.details) errorMsg += `\n\nDetails: ${data.details}`;
        if (data.errorType) errorMsg += `\n\nError Type: ${data.errorType}`;
        if (data.stack) errorMsg += `\n\nStack:\n${data.stack}`;
        
        // Store debug info separately
        const debugData = {
          request: requestBody,
          response: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
        setDebugInfo(JSON.stringify(debugData, null, 2));
        
        throw new Error(errorMsg);
      }

      setStatus('success');
      setSuccessMessage(`Successfully saved ${data.gamesAdded} game${data.gamesAdded > 1 ? 's' : ''} to ${data.lessonPath}`);
      
      // Reload lessons to update microbreak counts
      fetchLessons();
      
      // Clear preview after successful save
      setTimeout(() => {
        setGeneratedGames([]);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Save error caught:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save games');
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

  const isGenerating = status === 'generating' || status === 'saving';
  const hasPreview = status === 'preview' || status === 'success' || status === 'saving';

  return (
    <div className="space-y-6">
      {/* Lesson Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📚</span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
            </div>
          </div>
        )}
      </div>

      {/* Game Configuration */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎮</span>
          Game Configuration
        </h2>

        <div className="space-y-4">
          {/* Game Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Select Game Types
            </label>
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
          </div>

          {/* Game Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              How many of EACH game type?
            </label>
            <select
              value={gameCount}
              onChange={(e) => setGameCount(Number(e.target.value))}
              disabled={isGenerating}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none disabled:opacity-50"
            >
              {[1, 2].map(n => (
                <option key={n} value={n}>
                  {n} game{n > 1 ? 's' : ''} of each type
                </option>
              ))}
            </select>
            {selectedGameTypes.size > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Will generate <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {gameCount * selectedGameTypes.size} total game{gameCount * selectedGameTypes.size > 1 ? 's' : ''}
                </span> ({gameCount} × {selectedGameTypes.size} type{selectedGameTypes.size > 1 ? 's' : ''})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGeneratePreview}
          disabled={!selectedLessonFilename || selectedGameTypes.size === 0 || isGenerating}
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
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-900 dark:text-red-100">Error</div>
            <div className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono">
              {errorMessage}
            </div>
            {debugInfo && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
                  🐛 Debug Information (click to expand)
                </summary>
                <pre className="mt-2 text-xs bg-red-100 dark:bg-red-950 p-3 rounded overflow-x-auto border border-red-300 dark:border-red-800">
{debugInfo}
                </pre>
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

      {/* Preview Section */}
      {hasPreview && generatedGames.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
          <GamePreview games={generatedGames} />
        </div>
      )}
    </div>
  );
}
