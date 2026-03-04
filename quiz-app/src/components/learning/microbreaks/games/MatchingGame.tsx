'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, AlertCircle, Check, X } from 'lucide-react';
import { MatchingGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface MatchingGameProps {
  content: MatchingGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

interface MatchingPair {
  id: string;
  leftContent: string;
  rightContent: string;
}

type CardState = 'idle' | 'selected' | 'matched' | 'error';

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function MatchingCard({
  content,
  side,
  state,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  content: string;
  side: 'left' | 'right';
  state: CardState;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  const isMatched = state === 'matched';
  const isSelected = state === 'selected';
  const isError = state === 'error';

  let bgClass = 'bg-white';
  let borderClass = 'border-stone-200';
  let textClass = 'text-stone-800';
  let shadowClass = 'shadow-sm hover:shadow-md';

  if (isMatched) {
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
    textClass = 'text-emerald-700';
    shadowClass = 'shadow-none';
  } else if (isError) {
    bgClass = 'bg-red-50';
    borderClass = 'border-red-300';
    textClass = 'text-red-700';
  } else if (isSelected) {
    bgClass = 'bg-indigo-50';
    borderClass = 'border-indigo-400';
    textClass = 'text-indigo-900';
    shadowClass = 'shadow-md ring-2 ring-indigo-400 ring-opacity-50';
  }

  return (
    <motion.button
      layout
      initial={false}
      animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={isError ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={!isMatched && !isSelected ? { scale: 1.02 } : {}}
      whileTap={!isMatched ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isMatched}
      draggable={side === 'left' && !isMatched}
      onDragStartCapture={onDragStart}
      onDragOverCapture={onDragOver}
      onDropCapture={onDrop}
      className={`
        relative w-full p-4 min-h-[80px] flex items-center justify-center text-center
        rounded-xl border-2 transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-opacity-50
        ${bgClass} ${borderClass} ${textClass} ${shadowClass}
        ${isMatched ? 'opacity-60 cursor-default' : 'cursor-pointer'}
        ${side === 'left' && !isMatched ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      aria-label={`${content}${isMatched ? ' (Matched)' : ''}`}
    >
      <span className="font-medium text-sm md:text-base leading-snug">{content}</span>

      {isMatched && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 text-emerald-500"
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      )}

      {isError && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 text-red-500"
        >
          <X size={16} strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function MatchingGame({ content, onComplete, onSkip }: MatchingGameProps) {
  const pairs: MatchingPair[] = content.pairs.map((pair, index) => ({
    id: `pair-${index}`,
    leftContent: pair.left,
    rightContent: pair.right,
  }));

  const [leftItems, setLeftItems] = useState<{ id: string; content: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; content: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [errorPair, setErrorPair] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedLeftId, setDraggedLeftId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(content.duration);
  const completionSentRef = useRef(false);

  useEffect(() => {
    if (pairs.length === 0) return;
    setLeftItems(shuffle(pairs.map((p) => ({ id: p.id, content: p.leftContent }))));
    setRightItems(shuffle(pairs.map((p) => ({ id: p.id, content: p.rightContent }))));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setErrorPair(null);
    setMistakes(0);
    setIsCompleted(false);
    setDraggedLeftId(null);
    setTimeLeft(content.duration);
    completionSentRef.current = false;
  }, [content.duration, pairs.length]);

  useEffect(() => {
    if (timeLeft <= 0 || isCompleted) return;
    const timer = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [isCompleted, timeLeft]);

  const finishIfComplete = useCallback(
    (next: Set<string>, nextMistakes: number) => {
      if (next.size !== pairs.length || completionSentRef.current) return;
      completionSentRef.current = true;
      setIsCompleted(true);
      playSound('success', 0.55);
      const totalAttempts = pairs.length + nextMistakes;
      const accuracy = totalAttempts > 0 ? Math.round((pairs.length / totalAttempts) * 100) : 100;
      onComplete(pairs.length, accuracy);
    },
    [onComplete, pairs.length]
  );

  const handleMatchAttempt = useCallback(
    (leftId: string, rightId: string) => {
      if (leftId === rightId) {
        playSound('success', 0.45);
        setMatchedIds((prev) => {
          const next = new Set(prev).add(leftId);
          finishIfComplete(next, mistakes);
          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
        return;
      }

      playSound('failure', 0.45);
      setMistakes((m) => m + 1);
      setErrorPair([leftId, rightId]);
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    },
    [finishIfComplete, mistakes]
  );

  const selectLeft = useCallback(
    (id: string) => {
      if (matchedIds.has(id) || errorPair) return;
      if (selectedLeft === id) {
        setSelectedLeft(null);
        return;
      }
      playClickSound(0.3);
      setSelectedLeft(id);
      if (selectedRight) handleMatchAttempt(id, selectedRight);
    },
    [errorPair, handleMatchAttempt, matchedIds, selectedLeft, selectedRight]
  );

  const selectRight = useCallback(
    (id: string) => {
      if (matchedIds.has(id) || errorPair) return;
      if (selectedRight === id) {
        setSelectedRight(null);
        return;
      }
      playClickSound(0.3);
      setSelectedRight(id);
      if (selectedLeft) handleMatchAttempt(selectedLeft, id);
    },
    [errorPair, handleMatchAttempt, matchedIds, selectedLeft, selectedRight]
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeftId(id);
    e.dataTransfer.effectAllowed = 'link';
    selectLeft(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  };

  const handleDrop = (e: React.DragEvent, rightId: string) => {
    e.preventDefault();
    if (draggedLeftId && !matchedIds.has(rightId)) {
      handleMatchAttempt(draggedLeftId, rightId);
    }
    setDraggedLeftId(null);
  };

  if (pairs.length === 0) {
    return <div className="p-8 text-center text-stone-500">No pairs provided.</div>;
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-xs md:text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Match the Pairs
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
            <Clock size={13} />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">Match the Pairs</h2>
          <p className="text-stone-600">Select an item from the left and its match on the right.</p>
        </div>

        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="game-board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              <div className="flex flex-col gap-3">
                {leftItems.map((item) => {
                  const isMatched = matchedIds.has(item.id);
                  const isSelected = selectedLeft === item.id;
                  const isError = errorPair?.[0] === item.id;

                  return (
                    <MatchingCard
                      key={`left-${item.id}`}
                      content={item.content}
                      side="left"
                      state={isMatched ? 'matched' : isError ? 'error' : isSelected ? 'selected' : 'idle'}
                      onClick={() => selectLeft(item.id)}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                    />
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                {rightItems.map((item) => {
                  const isMatched = matchedIds.has(item.id);
                  const isSelected = selectedRight === item.id;
                  const isError = errorPair?.[1] === item.id;

                  return (
                    <MatchingCard
                      key={`right-${item.id}`}
                      content={item.content}
                      side="right"
                      state={isMatched ? 'matched' : isError ? 'error' : isSelected ? 'selected' : 'idle'}
                      onClick={() => selectRight(item.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completion-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-stone-100 text-center max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy size={40} strokeWidth={1.5} />
              </motion.div>

              <h3 className="text-2xl font-bold text-stone-900 mb-2">Excellent Work!</h3>
              <p className="text-stone-600 mb-8">You successfully matched all pairs.</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center justify-center text-stone-500 mb-1">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm font-medium uppercase tracking-wider">Mistakes</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">{mistakes}</div>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center justify-center text-stone-500 mb-1">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm font-medium uppercase tracking-wider">Pairs</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">{pairs.length}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
