'use client';

import { useState } from 'react';
import GameWrapper from '../GameWrapper';
import { SpotErrorGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface SpotTheErrorGameProps {
  content: SpotErrorGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

export default function SpotTheErrorGame({ content, onComplete, onSkip }: SpotTheErrorGameProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number, handleComplete: (score?: number, accuracy?: number) => void) => {
    playClickSound(0.3);
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = content.options[index].isError;
    
    // Play appropriate sound
    if (isCorrect) {
      playSound('success');
    } else {
      playSound('failure');
    }
    
    const score = isCorrect ? 1 : 0;
    const accuracy = isCorrect ? 100 : 0;

    setTimeout(() => {
      handleComplete(score, accuracy);
    }, 2000);
  };

  return (
    <GameWrapper 
      title="Spot the Error"
      duration={content.duration}
      instruction="Read the scenario and tap the one option that contains the error."
      motionPreset="soft"
      onComplete={onComplete}
      onSkip={onSkip}
      disableCelebration={true}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
              {content.scenario}
            </p>
          </div>

          <p className="text-sm text-gray-600 dark:text-slate-400 font-semibold">
            Which step or statement contains an error?
          </p>

          <div className="space-y-2">
            {content.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectAnswer = option.isError;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleSelect(index, handleComplete)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg text-left text-sm font-medium transition-all border-2 ${
                    showCorrect
                      ? 'microbreak-correct bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-400 dark:border-green-600'
                      : showWrong
                      ? 'microbreak-wrong bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-400 dark:border-red-600'
                      : isSelected
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-600'
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                  } disabled:cursor-default`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-300'
                    }`}>
                      {showCorrect ? '✓' : showWrong ? '✗' : index + 1}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && content.explanation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-gray-800 dark:text-slate-200">
                <strong>Explanation:</strong> {content.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
