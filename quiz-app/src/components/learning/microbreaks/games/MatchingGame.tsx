'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import GameWrapper from '../GameWrapper';
import { MatchingGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface MatchingGameProps {
  content: MatchingGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

interface MatchingItem {
  id: string;
  text: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function MatchingGame({ content, onComplete, onSkip }: MatchingGameProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<{ left: string; right: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  // Shuffle arrays for display - initialize as empty to avoid hydration mismatch
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const completeHandlerRef = useRef<((score?: number, accuracy?: number) => void) | null>(null);
  const completionSentRef = useRef(false);

  // Shuffle only on client side after mount to avoid hydration mismatch
  useEffect(() => {
    const indexedPairs = content.pairs.map((pair, index) => ({
      id: `pair-${index}`,
      left: pair.left,
      right: pair.right,
    }));
    setLeftItems(shuffleArray(indexedPairs).map((pair) => ({ id: pair.id, text: pair.left })));
    setRightItems(shuffleArray(indexedPairs).map((pair) => ({ id: pair.id, text: pair.right })));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
    setWrongMatch(null);
    setCompleted(false);
    completionSentRef.current = false;
  }, [content.pairs]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    if (selectedLeft === selectedRight) {
      const matchedId = selectedLeft;
      playSound('success', 0.45);
      setTimeout(() => {
        setMatchedPairs((prev) => {
          const next = new Set(prev);
          next.add(matchedId);

          if (next.size === content.pairs.length && !completionSentRef.current) {
            completionSentRef.current = true;
            setCompleted(true);
            completeHandlerRef.current?.(content.pairs.length, 100);
          }

          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
      return;
    }

    const wrongLeft = selectedLeft;
    const wrongRight = selectedRight;
    playSound('failure', 0.45);
    setWrongMatch({ left: wrongLeft, right: wrongRight });
    setTimeout(() => {
      setWrongMatch(null);
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 800);
  }, [content.pairs.length, selectedLeft, selectedRight]);

  const handleLeftClick = (id: string) => {
    if (matchedPairs.has(id) || wrongMatch) return;
    playClickSound(0.3);
    setSelectedLeft((current) => (current === id ? null : id));
  };

  const handleRightClick = (id: string) => {
    if (matchedPairs.has(id) || wrongMatch) return;
    playClickSound(0.3);
    setSelectedRight((current) => (current === id ? null : id));
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
        {() => (
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
        (() => {
          completeHandlerRef.current = handleComplete;
          return (
            <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              <h3 className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
                Terms
              </h3>
              {leftItems.map((item, idx) => {
                const isMatched = matchedPairs.has(item.id);
                const isSelected = selectedLeft === item.id;
                const isWrong = wrongMatch?.left === item.id;
                const isMatching =
                  selectedLeft !== null &&
                  selectedRight !== null &&
                  selectedLeft === selectedRight &&
                  selectedLeft === item.id;

                return (
                  <button
                    key={`left-${item.id}`}
                    onClick={() => handleLeftClick(item.id)}
                    disabled={completed || isMatched || wrongMatch !== null || isMatching}
                    style={{ animationDelay: `${idx * 45}ms` }}
                    className={`
                      w-full relative p-3 md:p-4 text-left microbreak-stagger microbreak-card-glide
                      rounded-2xl border-2 transition-all duration-200
                      ${isMatched ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default opacity-40' :
                        isMatching ? 'microbreak-correct bg-emerald-50 border-emerald-400 text-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30 scale-[1.02]' :
                        isWrong ? 'microbreak-wrong bg-red-50 border-red-300 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                        isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20 scale-[1.02]' :
                        'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'}
                    `}
                  >
                    <span className="text-sm md:text-base font-medium leading-snug">{item.text}</span>
                    {isMatched && (
                      <CheckCircle2 className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-emerald-500 opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              <h3 className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
                Definitions
              </h3>
              {rightItems.map((item, idx) => {
                const isMatched = matchedPairs.has(item.id);
                const isSelected = selectedRight === item.id;
                const isWrong = wrongMatch?.right === item.id;
                const isMatching =
                  selectedLeft !== null &&
                  selectedRight !== null &&
                  selectedLeft === selectedRight &&
                  selectedRight === item.id;

                return (
                  <button
                    key={`right-${item.id}`}
                    onClick={() => handleRightClick(item.id)}
                    disabled={completed || isMatched || wrongMatch !== null || isMatching}
                    style={{ animationDelay: `${idx * 55}ms` }}
                    className={`
                      w-full relative p-3 md:p-4 text-left microbreak-stagger microbreak-card-glide
                      rounded-2xl border-2 transition-all duration-200
                      ${isMatched ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default opacity-40' :
                        isMatching ? 'microbreak-correct bg-emerald-50 border-emerald-400 text-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30 scale-[1.02]' :
                        isWrong ? 'microbreak-wrong bg-red-50 border-red-300 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                        isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20 scale-[1.02]' :
                        'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'}
                    `}
                  >
                    <span className="text-xs md:text-sm leading-relaxed">{item.text}</span>
                    {isMatched && (
                      <CheckCircle2 className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-emerald-500 opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {completed && (
            <div className="text-center text-green-700 dark:text-green-300 font-semibold text-lg">
              Perfect! All matched correctly.
            </div>
          )}
            </div>
          );
        })()
      )}
    </GameWrapper>
  );
}
