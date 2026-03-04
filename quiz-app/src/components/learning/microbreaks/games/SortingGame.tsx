'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, SkipForward, Check } from 'lucide-react';
import { SortingGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface SortingGameProps {
  content: SortingGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

type GameItem = {
  id: string;
  text: string;
  correctBucket: 0 | 1;
  assignedBucket: 0 | 1 | null;
};

export default function SortingGame({ content, onComplete, onSkip }: SortingGameProps) {
  const [items, setItems] = useState<GameItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset item state when a new sorting block is rendered.
  useEffect(() => {
    const baseItems = content.items.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      assignedBucket: null,
    }));
    setItems(baseItems);
    setIsSubmitted(false);
  }, [content.items]);

  // Shuffle only after mount/update to avoid hydration mismatch.
  useEffect(() => {
    setItems((prev) => {
      if (prev.length === 0) return prev;
      const shuffled = [...prev]
        .map((item) => ({ ...item, sortKey: Math.random() }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(({ sortKey, ...rest }) => rest);
      return shuffled;
    });
  }, [content.items]);

  const handleAssign = useCallback((id: string, bucket: 0 | 1 | null) => {
    if (isSubmitted) return;
    playClickSound(0.2);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, assignedBucket: bucket } : item)));
  }, [isSubmitted]);

  const allAssigned = items.length > 0 && items.every((item) => item.assignedBucket !== null);

  const handleSubmit = useCallback(() => {
    if (!allAssigned || isSubmitted) return;
    playClickSound(0.25);
    setIsSubmitted(true);
    const score = items.filter((item) => item.assignedBucket === item.correctBucket).length;
    const accuracy = (score / items.length) * 100;
    if (accuracy === 100) playSound('success', 0.5);
    else if (accuracy >= 70) playSound('success', 0.25);
    else playSound('failure', 0.35);
    onComplete(score, accuracy);
  }, [allAssigned, isSubmitted, items, onComplete]);

  const bucket0Items = items.filter((i) => i.assignedBucket === 0);
  const unassignedItems = items.filter((i) => i.assignedBucket === null);
  const bucket1Items = items.filter((i) => i.assignedBucket === 1);

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 md:p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sorting Game</h2>
          <p className="text-slate-500 text-sm mt-1">Assign all items to the correct category.</p>
        </div>
        {!isSubmitted && (
          <button
            onClick={() => {
              playClickSound(0.2);
              onSkip();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Skip game"
          >
            <span>Skip</span>
            <SkipForward className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
        <BucketColumn
          title={content.buckets[0]}
          items={bucket0Items}
          bucketIndex={0}
          isSubmitted={isSubmitted}
          onAssign={handleAssign}
          bucketNames={content.buckets}
        />

        <div className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-100/50">
            <h3 className="font-semibold text-slate-700 text-center">Unassigned</h3>
            <div className="text-xs text-slate-500 text-center mt-1">{unassignedItems.length} remaining</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {unassignedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isSubmitted={isSubmitted}
                  onAssign={handleAssign}
                  bucketNames={content.buckets}
                />
              ))}
            </AnimatePresence>
            {unassignedItems.length === 0 && !isSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center text-slate-400 text-sm italic"
              >
                All items assigned!
              </motion.div>
            )}
          </div>
        </div>

        <BucketColumn
          title={content.buckets[1]}
          items={bucket1Items}
          bucketIndex={1}
          isSubmitted={isSubmitted}
          onAssign={handleAssign}
          bucketNames={content.buckets}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!allAssigned || isSubmitted}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/30
            ${isSubmitted
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : allAssigned
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
          aria-label={isSubmitted ? 'Game completed' : 'Submit answers'}
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Submit Answers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

type BucketColumnProps = {
  key?: React.Key;
  title: string;
  items: GameItem[];
  bucketIndex: 0 | 1;
  isSubmitted: boolean;
  onAssign: (id: string, bucket: 0 | 1 | null) => void;
  bucketNames: [string, string];
};

function BucketColumn({ title, items, bucketIndex, isSubmitted, onAssign, bucketNames }: BucketColumnProps) {
  const isLeft = bucketIndex === 0;
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`p-4 border-b border-slate-200 ${isLeft ? 'bg-blue-50/80' : 'bg-purple-50/80'}`}>
        <h3 className={`font-semibold text-center ${isLeft ? 'text-blue-900' : 'text-purple-900'}`}>{title}</h3>
        <div className="text-xs text-slate-500 text-center mt-1">{items.length} items</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isSubmitted={isSubmitted}
              onAssign={onAssign}
              bucketNames={bucketNames}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

type ItemCardProps = {
  key?: React.Key;
  item: GameItem;
  isSubmitted: boolean;
  onAssign: (id: string, bucket: 0 | 1 | null) => void;
  bucketNames: [string, string];
};

function ItemCard({ item, isSubmitted, onAssign, bucketNames }: ItemCardProps) {
  const isCorrect = isSubmitted ? item.assignedBucket === item.correctBucket : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        relative flex flex-col gap-3 p-3 rounded-xl border bg-white shadow-sm
        ${isSubmitted
          ? isCorrect
            ? 'border-emerald-300 bg-emerald-50/50'
            : 'border-rose-300 bg-rose-50/50'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md transition-all'}
      `}
    >
      <div className="text-center text-sm font-medium text-slate-700 px-2 pt-1">{item.text}</div>

      {!isSubmitted && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onAssign(item.id, item.assignedBucket === 0 ? null : 0)}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              item.assignedBucket === 0
                ? 'bg-blue-500 text-white shadow-inner'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'
            }`}
            aria-pressed={item.assignedBucket === 0}
            aria-label={`Assign to ${bucketNames[0]}`}
          >
            {bucketNames[0]}
          </button>
          <button
            onClick={() => onAssign(item.id, item.assignedBucket === 1 ? null : 1)}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              item.assignedBucket === 1
                ? 'bg-purple-500 text-white shadow-inner'
                : 'bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-700'
            }`}
            aria-pressed={item.assignedBucket === 1}
            aria-label={`Assign to ${bucketNames[1]}`}
          >
            {bucketNames[1]}
          </button>
        </div>
      )}

      {isSubmitted && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-500" />
          )}
        </div>
      )}

      {isSubmitted && !isCorrect && (
        <div className="text-[10px] font-bold text-center text-rose-600 uppercase tracking-wider bg-rose-100 py-1 rounded-md mt-1">
          Should be: {bucketNames[item.correctBucket]}
        </div>
      )}
    </motion.div>
  );
}
