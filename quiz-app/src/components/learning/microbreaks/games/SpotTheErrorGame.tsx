'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import GameWrapper from '../GameWrapper';
import { SpotErrorGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface SpotTheErrorGameProps {
  content: SpotErrorGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

export default function SpotTheErrorGame({ content, onComplete, onSkip }: SpotTheErrorGameProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setIsSubmitted(false);
    setHasCompleted(false);
  }, [content]);

  const handleOptionClick = useCallback((index: number) => {
    if (isSubmitted) return;
    playClickSound(0.3);
    setSelectedIndex(index);
  }, [isSubmitted]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(index);
    }
  }, [handleOptionClick]);

  const handleSubmit = useCallback((handleComplete: (score?: number, accuracy?: number) => void) => {
    if (selectedIndex === null || isSubmitted || hasCompleted) return;

    setIsSubmitted(true);
    setHasCompleted(true);

    const isCorrect = content.options[selectedIndex]?.isError === true;
    const score = isCorrect ? 1 : 0;
    const accuracy = isCorrect ? 100 : 0;

    playSound(isCorrect ? 'success' : 'failure');
    handleComplete(score, accuracy);
  }, [content.options, hasCompleted, isSubmitted, selectedIndex]);

  return (
    <GameWrapper
      title="Spot the Error"
      duration={content.duration}
      instruction="Read the scenario, choose one option, then check your answer."
      motionPreset="soft"
      onComplete={onComplete}
      onSkip={onSkip}
      disableCelebration={true}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="w-full max-w-2xl mx-auto p-5 sm:p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Spot the Error
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{content.scenario}</p>
          </div>

          <div className="space-y-3 mb-8" role="radiogroup" aria-label="Select the error">
            {content.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const showCorrect = isSubmitted && option.isError;
              const showIncorrect = isSubmitted && isSelected && !option.isError;

              let optionClasses =
                'relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ';
              if (!isSubmitted) {
                optionClasses += isSelected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700';
              } else if (showCorrect) {
                optionClasses += 'border-emerald-500 bg-emerald-50 text-emerald-900';
              } else if (showIncorrect) {
                optionClasses += 'border-rose-500 bg-rose-50 text-rose-900';
              } else {
                optionClasses += 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOptionClick(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={optionClasses}
                  disabled={isSubmitted}
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={isSubmitted}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex-1 font-medium">{option.text}</span>
                    {isSubmitted && (
                      <div className="flex-shrink-0 mt-0.5">
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {showIncorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="submit-btn"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <button
                  onClick={() => {
                    playClickSound(0.3);
                    handleSubmit(handleComplete);
                  }}
                  disabled={selectedIndex === null}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-sm disabled:shadow-none"
                  aria-label="Submit answer"
                >
                  Check Answer
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  {content.options[selectedIndex ?? -1]?.isError ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-semibold text-lg mb-1 ${
                        content.options[selectedIndex ?? -1]?.isError ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {content.options[selectedIndex ?? -1]?.isError ? 'Correct!' : 'Not quite.'}
                    </h3>
                    {!content.options[selectedIndex ?? -1]?.isError && (
                      <p className="text-slate-600 mb-3">
                        The actual error was:{' '}
                        <span className="font-medium text-slate-800">
                          {content.options.find((item) => item.isError)?.text}
                        </span>
                      </p>
                    )}
                    {content.explanation && (
                      <div className="text-slate-600 text-sm leading-relaxed mt-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <span className="font-semibold text-slate-800 block mb-1">Explanation</span>
                        {content.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </GameWrapper>
  );
}
