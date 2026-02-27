'use client';

import { useState, useEffect } from 'react';
import GameWrapper from '../GameWrapper';
import { QuickWinGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';
import {
  positiveActionButtonClass,
  primaryActionButtonClass,
  secondaryActionButtonClass,
} from './buttonStyles';

interface QuickWinSprintGameProps {
  content: QuickWinGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

// Levenshtein distance calculation for fuzzy matching
function computeLevenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Calculate similarity score between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = computeLevenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function tokenizeForMatching(value: string): string[] {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
}

function bestTokenSimilarity(token: string, candidates: string[]): number {
  let best = 0;
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(token, candidate);
    if (similarity > best) best = similarity;
  }
  return best;
}

function clampToTwoWords(value: string): string {
  const tokens = value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  return tokens.slice(0, 2).join(' ');
}

// Validate answer with fuzzy matching
function validateAnswer(userInput: string, correctAnswer: string): boolean {
  const normalizeCompact = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  const normalizeSpaced = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  
  const normalizedUser = normalizeCompact(userInput);
  const normalizedCorrect = normalizeCompact(correctAnswer);
  const spacedUser = normalizeSpaced(userInput);
  const spacedCorrect = normalizeSpaced(correctAnswer);

  if (!normalizedUser || !normalizedCorrect) return false;
  
  // Exact match after normalization
  if (normalizedUser === normalizedCorrect) return true;

  // Accept containment for close phrase variants: "line conductor" vs "the line conductor"
  if (
    normalizedUser.length >= 4 &&
    normalizedCorrect.length >= 4 &&
    (normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect))
  ) {
    return true;
  }

  // Token-level fuzzy handling for multi-word answers
  const correctTokens = tokenizeForMatching(spacedCorrect);
  const userTokens = tokenizeForMatching(spacedUser);
  if (correctTokens.length > 1) {
    const minTokenSimilarity = 0.7;
    let matchedTokens = 0;
    for (const token of correctTokens) {
      const best = bestTokenSimilarity(token, userTokens);
      if (best >= minTokenSimilarity) matchedTokens++;
    }
    const coverage = matchedTokens / correctTokens.length;
    if (coverage >= 0.75) return true;
  }
  
  // Character-level fuzzy fallback with adaptive thresholds
  const distance = computeLevenshteinDistance(normalizedUser, normalizedCorrect);
  const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
  const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);

  // Short answers should tolerate small typo count.
  if (maxLen <= 4) return distance <= 1 || similarity >= 0.72;
  if (maxLen <= 7) return distance <= 2 || similarity >= 0.7;

  return similarity >= 0.68 || distance <= Math.floor(maxLen * 0.25);
}

export default function QuickWinSprintGame({ content, onComplete, onSkip }: QuickWinSprintGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  
  // Countdown timer state
  const [countdownAudio, setCountdownAudio] = useState<HTMLAudioElement | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(34);
  const [gameFailed, setGameFailed] = useState(false);

  const currentQuestion = content.questions[currentIndex];
  const currentExpectedAnswer = clampToTwoWords(currentQuestion.answer || '');
  const isLastQuestion = currentIndex === content.questions.length - 1;

  // Start countdown timer
  const startCountdown = () => {
    const audio = new Audio('/sounds/The Countdown Clock.mp3');
    setCountdownAudio(audio);
    setTimerStarted(true);
    
    audio.addEventListener('timeupdate', () => {
      const remaining = Math.ceil(34 - audio.currentTime);
      setTimeRemaining(remaining);
    });
    
    audio.addEventListener('ended', () => {
      handleTimeExpired();
    });
    
    audio.play().catch(err => {
      console.log('Countdown audio failed to play:', err.message);
    });
  };

  // Handle timer expiration
  const handleTimeExpired = () => {
    if (gameFailed) return; // Prevent double trigger
    
    setGameFailed(true);
    playSound('failure', 0.7);
    countdownAudio?.pause();
    
    // Complete game with current score after showing failure message
    setTimeout(() => {
      onComplete(correctCount, (correctCount / content.questions.length) * 100);
    }, 2000);
  };

  // Handle "I Know It" button click
  const handleKnowIt = () => {
    playClickSound(0.3);
    
    // Start timer on first question
    if (!timerStarted && currentIndex === 0) {
      startCountdown();
    }
    
    setShowInput(true);
  };

  // Handle answer submission
  const handleSubmitAnswer = (handleComplete: (score?: number, accuracy?: number) => void) => {
    if (!userAnswer.trim() || isValidating || gameFailed) return;
    playClickSound(0.3);
    
    setIsValidating(true);
    const clampedUserAnswer = clampToTwoWords(userAnswer);
    const isCorrect = validateAnswer(clampedUserAnswer, currentExpectedAnswer);
    
    setAnswerResult(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      playSound('success', 0.3);
      setCorrectCount(correctCount + 1);
    } else {
      playSound('failure', 0.3);
    }
    
    // Show result briefly, then advance
    setTimeout(() => {
      if (isLastQuestion) {
        // Cleanup audio before completing
        if (countdownAudio) {
          countdownAudio.pause();
        }
        const finalScore = isCorrect ? correctCount + 1 : correctCount;
        const accuracy = (finalScore / content.questions.length) * 100;
        handleComplete(finalScore, accuracy);
      } else {
        // Advance to next question
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setShowInput(false);
        setUserAnswer('');
        setIsValidating(false);
        setAnswerResult(null);
      }
    }, 1000);
  };

  // Handle "Show Answer" button click
  const handleSkipQuestion = (handleComplete: (score?: number, accuracy?: number) => void) => {
    playClickSound(0.3);
    
    // Start timer on first question
    if (!timerStarted && currentIndex === 0) {
      startCountdown();
    }
    
    setShowAnswer(true);
    playSound('failure', 0.15); // Very quiet

    setTimeout(() => {
      if (isLastQuestion) {
        // Cleanup audio before completing
        if (countdownAudio) {
          countdownAudio.pause();
        }
        const accuracy = (correctCount / content.questions.length) * 100;
        handleComplete(correctCount, accuracy);
      } else {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      }
    }, 2000);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (countdownAudio) {
        countdownAudio.pause();
        countdownAudio.currentTime = 0;
      }
    };
  }, [countdownAudio]);

  return (
    <GameWrapper 
      title="Quick Win Sprint"
      duration={34}
      instruction="Answer fast using 1-2 words: tap I Know It, type, then submit before the timer ends."
      motionPreset="bold"
      onComplete={onComplete}
      onSkip={onSkip}
      disableTimer={true}
    >
      {(handleComplete: (score?: number, accuracy?: number) => void) => (
        <div className="space-y-4">
          {gameFailed ? (
            // Time expired failure state
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Time&apos;s Up!</h3>
              <p className="text-red-600 dark:text-red-400">
                You completed {correctCount} out of {content.questions.length} questions
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                Final Score: {Math.round((correctCount / content.questions.length) * 100)}%
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  Question {currentIndex + 1} of {content.questions.length}
                </span>
                
                {timerStarted ? (
                  <div className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse microbreak-soft-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                    ⏱️ {timeRemaining}s
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-slate-500">
                    Click to start timer
                  </span>
                )}
                
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Score: {correctCount}/{content.questions.length}
                </span>
              </div>

              <div key={`q-card-${currentIndex}-${showInput}-${showAnswer}-${answerResult}`} className="microbreak-enter-slow microbreak-card-glide bg-white dark:bg-slate-700 rounded-xl p-6 border-2 border-gray-300 dark:border-slate-600 min-h-[200px] flex flex-col justify-center">
                {showInput ? (
                  // Answer input mode
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                      {currentQuestion.question}
                    </p>
                    
                    {answerResult ? (
                      // Show result
                      <div className="text-center space-y-4">
                        <div className={`text-5xl ${answerResult === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                          <span className={answerResult === 'correct' ? 'microbreak-correct inline-block' : 'microbreak-wrong inline-block'}>
                          {answerResult === 'correct' ? '✓' : '✗'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Correct answer: <span className="font-bold text-gray-900 dark:text-white">{currentExpectedAnswer}</span>
                        </p>
                      </div>
                    ) : (
                      // Input field
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(clampToTwoWords(e.target.value))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSubmitAnswer(handleComplete);
                            }
                          }}
                          placeholder="Type 1-2 words..."
                          autoFocus
                          disabled={isValidating}
                          className="w-full px-4 py-3 text-lg border-2 border-blue-400 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white microbreak-card-glide"
                        />
                        <button 
                          onClick={() => handleSubmitAnswer(handleComplete)} 
                          disabled={!userAnswer.trim() || isValidating}
                          className={`w-full py-3 microbreak-card-glide ${primaryActionButtonClass}`}
                        >
                          Submit Answer
                        </button>
                      </div>
                    )}
                  </div>
                ) : !showAnswer ? (
                  // Initial buttons
                  <>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
                      {currentQuestion.question}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleKnowIt()}
                        className={`flex-1 py-3 microbreak-card-glide ${positiveActionButtonClass}`}
                      >
                        I Know It! ✓
                      </button>
                      <button
                        onClick={() => handleSkipQuestion(handleComplete)}
                        className={`flex-1 py-3 microbreak-card-glide ${secondaryActionButtonClass}`}
                      >
                        Show Answer
                      </button>
                    </div>
                  </>
                ) : (
                  // Show answer mode (when skipped)
                  <div className="text-center space-y-4">
                    <div className="text-4xl">
                      👁️
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {currentQuestion.question}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentExpectedAnswer}
                    </p>
                  </div>
                )}
              </div>

              {isLastQuestion && showAnswer && (
                <div className="text-center text-gray-700 dark:text-slate-300 font-semibold">
                  Final Score: {correctCount}/{content.questions.length} ({Math.round((correctCount / content.questions.length) * 100)}%)
                </div>
              )}
            </>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
