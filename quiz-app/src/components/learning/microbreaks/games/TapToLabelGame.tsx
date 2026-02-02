'use client';

import { useState } from 'react';
import GameWrapper from '../GameWrapper';
import { TapLabelGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface TapToLabelGameProps {
  content: TapLabelGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

export default function TapToLabelGame({ content, onComplete, onSkip }: TapToLabelGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentItem = content.items[currentIndex];
  const availableLabels = content.items.map(item => item.label);

  const handleLabelSelect = (label: string, handleComplete: (score?: number, accuracy?: number) => void) => {
    playClickSound(0.3);
    const newAnswers = { ...userAnswers, [currentItem.id]: label };
    setUserAnswers(newAnswers);
    
    // Provide feedback for each selection
    const isCorrect = label === currentItem.label;
    if (isCorrect) {
      playSound('success', 0.2);
    } else {
      playSound('failure', 0.2);
    }

    if (currentIndex < content.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All items labeled - show results
      setShowResults(true);
      setCompleted(true);

      // Calculate score
      let correct = 0;
      content.items.forEach(item => {
        if (newAnswers[item.id] === item.label) {
          correct++;
        }
      });

      const accuracy = (correct / content.items.length) * 100;
      handleComplete(correct, accuracy);
    }
  };

  return (
    <GameWrapper 
      title="Label the Diagram"
      duration={content.duration}
      onComplete={onComplete}
      onSkip={onSkip}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="space-y-4">
          {content.imageUrl && (
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 border-2 border-gray-300 dark:border-slate-600">
              <img 
                src={content.imageUrl} 
                alt="Diagram to label" 
                className="w-full h-auto rounded"
              />
            </div>
          )}

          {!showResults ? (
            <>
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  Item {currentIndex + 1} of {content.items.length}
                </span>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  What is this component?
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Position: {currentItem.id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {availableLabels.map((label) => {
                  const isUsed = Object.values(userAnswers).includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => !isUsed && handleLabelSelect(label, handleComplete)}
                      disabled={isUsed}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        isUsed
                          ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 border-2 border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-center">
                Results
              </h4>
              {content.items.map((item) => {
                const userAnswer = userAnswers[item.id];
                const isCorrect = userAnswer === item.label;
                return (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border-2 ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        {item.id}: {item.label}
                      </span>
                      <span className="text-lg">
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        You answered: {userAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="text-center text-gray-700 dark:text-slate-300 font-semibold">
                {Math.round((content.items.filter(item => userAnswers[item.id] === item.label).length / content.items.length) * 100)}% correct!
              </div>
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
