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
      case 'sequencing': return 'Sequencing';
      case 'fill-gap': return 'Fill Gap';
      case 'is-correct-why': return 'Is Correct + Why';
      case 'diagnosis-ranked': return 'Diagnosis Ranked';
      case 'classify-two-bins': return 'Classify Two Bins';
      case 'scenario-match': return 'Scenario Match';
      case 'formula-build': return 'Formula Build';
      case 'tap-the-line': return 'Tap The Line';
      case 'tap-the-word': return 'Tap The Word';
      case 'elimination': return 'Elimination';
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
      case 'sequencing': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700';
      case 'fill-gap': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'is-correct-why': return 'bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-700';
      case 'diagnosis-ranked': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'classify-two-bins': return 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-700';
      case 'scenario-match': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700';
      case 'formula-build': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'tap-the-line': return 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-300 dark:border-fuchsia-700';
      case 'tap-the-word': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'elimination': return 'bg-stone-100 dark:bg-stone-900/30 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700';
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

      case 'sequencing':
        return (
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-slate-400">Steps: {content.steps.length}</p>
            {content.steps.map((step, idx) => (
              <div key={`${step}-${idx}`} className="rounded bg-cyan-50 dark:bg-cyan-900/20 p-2">{step}</div>
            ))}
          </div>
        );

      case 'fill-gap':
        return (
          <div className="space-y-1 text-sm">
            <p className="rounded bg-teal-50 p-2 dark:bg-teal-900/20">{content.textTemplate}</p>
            <p className="text-gray-600 dark:text-slate-400">Gaps: {content.gaps.length}</p>
          </div>
        );

      case 'is-correct-why':
        return (
          <div className="space-y-1 text-sm">
            <p className="rounded bg-lime-50 p-2 dark:bg-lime-900/20">{content.statement}</p>
            {content.reasons.map((r, idx) => <div key={`${r}-${idx}`} className="rounded border p-2">{r}</div>)}
          </div>
        );

      case 'diagnosis-ranked':
        return (
          <div className="space-y-1 text-sm">
            <p className="rounded bg-orange-50 p-2 dark:bg-orange-900/20">{content.scenario}</p>
            <p className="text-gray-600 dark:text-slate-400">Options: {content.options.length}</p>
          </div>
        );

      case 'classify-two-bins':
        return (
          <div className="space-y-1 text-sm">
            <p>{content.leftLabel} | {content.rightLabel}</p>
            <p className="text-gray-600 dark:text-slate-400">Items: {content.items.length}</p>
          </div>
        );

      case 'scenario-match':
        return (
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-slate-400">Pairs: {content.pairs.length}</p>
            {content.pairs.map((p, idx) => (
              <div key={`${p.scenario}-${idx}`} className="rounded border p-2">
                <div>{p.scenario}</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">→ {p.answer}</div>
              </div>
            ))}
          </div>
        );

      case 'formula-build':
        return (
          <div className="space-y-1 text-sm">
            <p>Tokens: {content.tokens.join(' ')}</p>
            <p className="text-xs text-gray-600 dark:text-slate-400">Answer: {content.correctSequence.join(' ')}</p>
          </div>
        );

      case 'tap-the-line':
        return (
          <div className="space-y-1 text-sm">
            {content.lines.map((line, idx) => (
              <div key={`${line}-${idx}`} className="rounded border p-2">{line}</div>
            ))}
          </div>
        );

      case 'tap-the-word':
        return (
          <div className="space-y-1 text-sm">
            <p className="rounded border p-2">{content.sentence}</p>
            <p>Options: {content.options.join(', ')}</p>
          </div>
        );

      case 'elimination':
        return (
          <div className="space-y-1 text-sm">
            <p className="rounded border p-2">{content.question}</p>
            <p className="text-gray-600 dark:text-slate-400">Options: {content.options.length}</p>
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
