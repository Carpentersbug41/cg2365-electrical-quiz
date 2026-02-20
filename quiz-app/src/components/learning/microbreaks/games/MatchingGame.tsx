'use client';

import { useState, useEffect } from 'react';
import GameWrapper from '../GameWrapper';
import { MatchingGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface MatchingGameProps {
  content: MatchingGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

export default function MatchingGame({ content, onComplete, onSkip }: MatchingGameProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);

  // Shuffle arrays for display - initialize as empty to avoid hydration mismatch
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);

  // Shuffle only on client side after mount to avoid hydration mismatch
  useEffect(() => {
    setLeftItems([...content.pairs].sort(() => Math.random() - 0.5).map(p => p.left));
    setRightItems([...content.pairs].sort(() => Math.random() - 0.5).map(p => p.right));
  }, [content.pairs]);

  const handleLeftClick = (item: string) => {
    if (matches[item]) return; // Already matched
    playClickSound(0.3);
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string, handleComplete: (score?: number, accuracy?: number) => void) => {
    if (!selectedLeft) return;
    if (Object.values(matches).includes(item)) return; // Already used

    playClickSound(0.3);

    // Check if this is a correct match
    const correctPair = content.pairs.find(p => p.left === selectedLeft);
    if (correctPair && correctPair.right === item) {
      // Correct match
      playSound('success', 0.5); // Louder, clearer ding
      const newMatches = { ...matches, [selectedLeft]: item };
      setMatches(newMatches);
      setSelectedLeft(null);

      // Check if all matched
      if (Object.keys(newMatches).length === content.pairs.length) {
        setCompleted(true);
        const accuracy = 100; // All correct by nature of the game
        handleComplete(content.pairs.length, accuracy);
      }
    } else {
      // Wrong match - show red flash
      playSound('failure', 0.5);
      setWrongMatch(item);
      
      // Flash red then return to neutral after 800ms
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedLeft(null);
      }, 800);
    }
  };

  // Wait for arrays to be shuffled before rendering
  if (leftItems.length === 0 || rightItems.length === 0) {
    return (
      <GameWrapper 
        title="Match the Terms"
        duration={content.duration}
        instruction="Tap a term on the left, then tap its matching definition on the right."
        motionPreset="bold"
        onComplete={onComplete}
        onSkip={onSkip}
      >
        {(_handleComplete: (score?: number, accuracy?: number) => void) => (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-slate-400">Loading...</div>
          </div>
        )}
      </GameWrapper>
    );
  }

  return (
    <GameWrapper 
      title="Match the Terms"
      duration={content.duration}
      instruction="Tap a term on the left, then tap its matching definition on the right."
      motionPreset="bold"
      onComplete={onComplete}
      onSkip={onSkip}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              {leftItems.map((item, idx) => (
                <button
                  key={`left-${idx}-${item || 'blank'}`}
                  onClick={() => handleLeftClick(item)}
                  disabled={completed || !!matches[item]}
                    className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left ${
                      matches[item]
                      ? 'microbreak-correct bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-700'
                      : selectedLeft === item
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-400 dark:border-blue-600 shadow-md'
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 border-2 border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {rightItems.map((item, idx) => {
                const isMatched = Object.values(matches).includes(item);
                return (
                  <button
                    key={`right-${idx}-${item || 'blank'}`}
                    onClick={() => handleRightClick(item, handleComplete)}
                    disabled={completed || isMatched || !selectedLeft}
                    className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left ${
                      isMatched
                        ? 'microbreak-correct bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-700'
                        : wrongMatch === item
                        ? 'microbreak-wrong bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 border-2 border-red-500 dark:border-red-600'
                        : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 border-2 border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {completed && (
            <div className="text-center text-green-700 dark:text-green-300 font-semibold text-lg">
              Perfect! All matched correctly! 🎉
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
