'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { MicrobreakContent } from '@/data/lessons/types';

interface GamePreviewProps {
  games: Array<{
    id: string;
    type: string;
    order: number;
    content: MicrobreakContent;
  }>;
}

export default function GamePreview({ games }: GamePreviewProps) {
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set(games.map(g => g.id)));

  const toggleGame = (gameId: string) => {
    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(gameId)) {
      newExpanded.delete(gameId);
    } else {
      newExpanded.add(gameId);
    }
    setExpandedGames(newExpanded);
  };

  const getGameTypeLabel = (content: MicrobreakContent) => {
    if (content.breakType === 'rest') return 'Rest Break';
    switch (content.gameType) {
      case 'matching': return 'Matching Game';
      case 'sorting': return 'Sorting Game';
      case 'spot-error': return 'Spot the Error';
      case 'tap-label': return 'Tap to Label';
      case 'quick-win': return 'Quick Win Sprint';
      default: return 'Game';
    }
  };

  const getGameTypeColor = (content: MicrobreakContent) => {
    if (content.breakType === 'rest') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
    switch (content.gameType) {
      case 'matching': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'sorting': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'spot-error': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'tap-label': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case 'quick-win': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-700';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300 border-gray-300 dark:border-slate-600';
    }
  };

  const renderGameContent = (content: MicrobreakContent) => {
    if (content.breakType === 'rest') {
      return (
        <div className="text-sm text-gray-600 dark:text-slate-400">
          <p>Duration: {content.duration}s</p>
          <p className="mt-2 italic">{content.message || 'Look away from the screen. Stretch. Breathe.'}</p>
        </div>
      );
    }

    switch (content.gameType) {
      case 'matching':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-400">Pairs to match:</p>
            <div className="space-y-1">
              {content.pairs.map((pair, idx) => (
                <div key={idx} className="text-sm bg-blue-50 dark:bg-blue-900/20 rounded p-2 flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{pair.left}</span>
                  <span className="text-gray-400 dark:text-slate-500">↔</span>
                  <span className="text-gray-700 dark:text-slate-300">{pair.right}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'sorting':
        return (
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded-full text-sm font-medium">
                {content.buckets[0]}
              </span>
              <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded-full text-sm font-medium">
                {content.buckets[1]}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">{content.items.length} items to sort:</p>
            <div className="space-y-1">
              {content.items.map((item, idx) => (
                <div key={idx} className="text-sm bg-purple-50 dark:bg-purple-900/20 rounded p-2 flex justify-between">
                  <span className="text-gray-900 dark:text-white">{item.text}</span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    → {content.buckets[item.correctBucket]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'spot-error':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 rounded p-2">
              <strong>Scenario:</strong> {content.scenario}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{content.options.length} options:</p>
            <div className="space-y-1">
              {content.options.map((option, idx) => (
                <div 
                  key={idx} 
                  className={`text-sm rounded p-2 ${
                    option.isError 
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700' 
                      : 'bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-gray-900 dark:text-white">{option.text}</span>
                  {option.isError && <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-semibold">← ERROR</span>}
                </div>
              ))}
            </div>
            {content.explanation && (
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 italic">
                Explanation: {content.explanation}
              </p>
            )}
          </div>
        );

      case 'tap-label':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-400">{content.items.length} labels:</p>
            <div className="space-y-1">
              {content.items.map((item, idx) => (
                <div key={idx} className="text-sm bg-indigo-50 dark:bg-indigo-900/20 rounded p-2">
                  <span className="font-medium text-gray-900 dark:text-white">{item.id}:</span>{' '}
                  <span className="text-gray-700 dark:text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quick-win':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-400">{content.questions.length} questions:</p>
            <div className="space-y-1">
              {content.questions.map((q, idx) => (
                <div key={idx} className="text-sm bg-pink-50 dark:bg-pink-900/20 rounded p-2">
                  <div className="font-medium text-gray-900 dark:text-white">Q: {q.question}</div>
                  <div className="text-gray-700 dark:text-slate-300 ml-4">A: {q.answer}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p className="text-sm text-gray-500 dark:text-slate-500">Unknown game type</p>;
    }
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generated Games Preview</h3>
      
      {games.map((game) => {
        const isExpanded = expandedGames.has(game.id);
        
        return (
          <div 
            key={game.id}
            className="bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <button
              onClick={() => toggleGame(game.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getGameTypeColor(game.content)}`}>
                  {getGameTypeLabel(game.content)}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{game.id}</span>
                <span className="text-xs text-gray-500 dark:text-slate-500">Order: {game.order}</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              )}
            </button>
            
            {isExpanded && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700">
                {renderGameContent(game.content)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
