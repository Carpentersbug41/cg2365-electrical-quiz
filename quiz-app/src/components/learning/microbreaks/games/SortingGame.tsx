'use client';

import { useState, useEffect } from 'react';
import GameWrapper from '../GameWrapper';
import { SortingGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface SortingGameProps {
  content: SortingGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

export default function SortingGame({ content, onComplete, onSkip }: SortingGameProps) {
  const [assignments, setAssignments] = useState<Record<string, number | null>>({});
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Shuffle items for display - initialize as empty to avoid hydration mismatch
  const [shuffledItems, setShuffledItems] = useState<typeof content.items>([]);

  // Shuffle only on client side after mount to avoid hydration mismatch
  useEffect(() => {
    setShuffledItems([...content.items].sort(() => Math.random() - 0.5));
  }, [content.items]);

  const handleAssignment = (itemText: string, bucketIndex: number) => {
    playClickSound(0.3);
    const newAssignments = { ...assignments, [itemText]: bucketIndex };
    setAssignments(newAssignments);
  };

  const handleSubmit = (handleComplete: (score?: number, accuracy?: number) => void) => {
    playClickSound(0.3);
    setShowResults(true);
    setCompleted(true);

    // Calculate score
    let correct = 0;
    content.items.forEach(item => {
      if (assignments[item.text] === item.correctBucket) {
        correct++;
      }
    });

    const accuracy = (correct / content.items.length) * 100;
    
    // Play appropriate sound based on accuracy
    if (accuracy === 100) {
      playSound('success');
    } else if (accuracy >= 70) {
      playSound('success', 0.2); // Quieter for partial success
    } else {
      playSound('failure');
    }
    
    handleComplete(correct, accuracy);
  };

  const allAssigned = shuffledItems.every(item => assignments[item.text] !== undefined && assignments[item.text] !== null);

  // Wait for items to be shuffled before rendering
  if (shuffledItems.length === 0) {
    return (
      <GameWrapper 
        title="Sort into Categories"
        duration={content.duration}
        instruction="Assign every item to the correct category, then press Check Answers."
        motionPreset="medium"
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
      title="Sort into Categories"
      duration={content.duration}
      instruction="Assign every item to the correct category, then press Check Answers."
      motionPreset="medium"
      onComplete={onComplete}
      onSkip={onSkip}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="space-y-4">
          {/* Category headers */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            {content.buckets.map((bucket, index) => (
              <div 
                key={index}
                className="bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-3 text-center font-bold text-indigo-900 dark:text-indigo-100"
              >
                {bucket}
              </div>
            ))}
          </div>

          {/* Items to sort */}
          <div className="space-y-2">
            {shuffledItems.map((item) => {
              const assignedBucket = assignments[item.text];
              const isCorrect = showResults && assignedBucket === item.correctBucket;
              const isWrong = showResults && assignedBucket !== item.correctBucket;

              return (
                <div 
                  key={item.text}
                  className="bg-white dark:bg-slate-700 rounded-lg border-2 border-gray-300 dark:border-slate-600 p-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-800 dark:text-slate-200 flex-1">
                      {item.text}
                    </span>
                    
                    <div className="flex gap-2">
                      {content.buckets.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleAssignment(item.text, index)}
                          disabled={completed}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            assignedBucket === index
                              ? showResults
                                ? isCorrect
                                  ? 'microbreak-correct bg-green-500 text-white'
                                  : 'microbreak-wrong bg-red-500 text-white'
                                : 'bg-indigo-600 text-white'
                              : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                          } disabled:cursor-not-allowed`}
                        >
                          {index === 0 ? '1' : '2'}
                        </button>
                      ))}
                    </div>

                    {showResults && (
                      <span className="text-lg">
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!completed && (
            <button
              onClick={() => handleSubmit(handleComplete)}
              disabled={!allAssigned}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Check Answers
            </button>
          )}

          {showResults && (
            <div className="text-center text-gray-700 dark:text-slate-300 font-semibold">
              {Math.round((shuffledItems.filter((item) => assignments[item.text] === item.correctBucket).length / content.items.length) * 100)}% correct!
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
