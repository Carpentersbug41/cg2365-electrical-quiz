'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Trophy, SkipForward, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuickWinGameContent } from '@/data/lessons/types';
import { playSound, playClickSound } from '@/lib/microbreaks/celebrationEffects';

interface QuickWinSprintGameProps {
  content: QuickWinGameContent;
  onComplete: (score?: number, accuracy?: number) => void;
  onSkip: () => void;
}

const computeLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

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
};

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1;
  const editDistance = computeLevenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const tokenizeForMatching = (value: string): string[] => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0);
};

const bestTokenSimilarity = (token: string, candidates: string[]): number => {
  let best = 0;
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(token, candidate);
    if (similarity > best) best = similarity;
  }
  return best;
};

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalizeCompact = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizeSpaced = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const normalizedUser = normalizeCompact(userAnswer);
  const normalizedCorrect = normalizeCompact(correctAnswer);
  const spacedUser = normalizeSpaced(userAnswer);
  const spacedCorrect = normalizeSpaced(correctAnswer);

  if (!normalizedUser || !normalizedCorrect) return false;
  if (normalizedUser === normalizedCorrect) return true;

  if (
    normalizedUser.length >= 4 &&
    normalizedCorrect.length >= 4 &&
    (normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect))
  ) {
    return true;
  }

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

  const distance = computeLevenshteinDistance(normalizedUser, normalizedCorrect);
  const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
  const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);

  if (maxLen <= 4) return distance <= 1 || similarity >= 0.72;
  if (maxLen <= 7) return distance <= 2 || similarity >= 0.7;
  return similarity >= 0.68 || distance <= Math.floor(maxLen * 0.25);
};

export default function QuickWinSprintGame({ content, onComplete, onSkip }: QuickWinSprintGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content.duration ?? 60);
  const [hasStarted, setHasStarted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedRef = useRef(false);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);

  const questions = content.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setInputValue('');
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
    setTimeLeft(content.duration ?? 60);
    setHasStarted(false);
    hasCompletedRef.current = false;
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, [content]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0;
        countdownAudioRef.current = null;
      }
    };
  }, []);

  const handleComplete = useCallback((finalScore: number, total: number) => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current = null;
    }

    setIsFinished(true);
    const accuracy = total > 0 ? Math.round((finalScore / total) * 100) : 0;
    onComplete(finalScore, accuracy);
  }, [onComplete]);

  useEffect(() => {
    if (!hasStarted || isFinished || timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [hasStarted, isFinished, timeLeft]);

  useEffect(() => {
    if (hasStarted && timeLeft <= 0 && !isFinished) {
      playSound('failure', 0.35);
      handleComplete(score, totalQuestions);
    }
  }, [hasStarted, timeLeft, isFinished, handleComplete, score, totalQuestions]);

  const handleSubmit = (event?: FormEvent) => {
    if (event) event.preventDefault();
    if (!hasStarted || feedback !== null || isFinished || !currentQuestion) return;
    if (!inputValue.trim()) return;

    playClickSound(0.3);
    const isCorrect = checkAnswer(inputValue, currentQuestion.answer);

    let newScore = score;
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
      setFeedback('correct');
      playSound('success', 0.25);
    } else {
      setFeedback('incorrect');
      playSound('failure', 0.25);
    }

    timeoutRef.current = setTimeout(() => {
      setFeedback(null);
      setInputValue('');

      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        handleComplete(newScore, totalQuestions);
      }
    }, 1500);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  if (isFinished) {
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/80 overflow-hidden"
      >
        <div className="p-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] shadow-lg shadow-emerald-500/30 flex items-center justify-center rotate-3"
          >
            <Trophy className="w-12 h-12 text-white -rotate-3" />
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sprint Complete!</h2>
            <p className="text-slate-500 font-medium">You&apos;ve successfully finished the challenge.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-5 rounded-3xl border border-indigo-100/50"
            >
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                <Zap className="w-4 h-4" />
                <div className="text-xs font-bold uppercase tracking-wider">Score</div>
              </div>
              <div className="text-4xl font-black text-indigo-950">
                {score} <span className="text-xl text-indigo-300 font-bold">/ {totalQuestions}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-fuchsia-50/50 p-5 rounded-3xl border border-purple-100/50"
            >
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <Target className="w-4 h-4" />
                <div className="text-xs font-bold uppercase tracking-wider">Accuracy</div>
              </div>
              <div className="text-4xl font-black text-purple-950">{accuracy}%</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  const isTimeLow = timeLeft <= 10;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / (content.duration ?? 60)) * circumference;

  const tickRadius = 54;
  const tickCircumference = 2 * Math.PI * tickRadius;
  const tickDash = 2;
  const tickGap = (tickCircumference / 60) - tickDash;
  const tickOffset = tickCircumference - (timeLeft / (content.duration ?? 60)) * tickCircumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100/80 flex flex-col overflow-hidden"
    >
      <div className="px-6 py-5 flex items-center justify-between bg-slate-50/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question</span>
          <span className="text-sm font-bold text-slate-700">
            {currentIndex + 1} <span className="text-slate-300">/</span> {totalQuestions}
          </span>
        </div>

        <button
          onClick={() => {
            playClickSound(0.3);
            if (countdownAudioRef.current) {
              countdownAudioRef.current.pause();
              countdownAudioRef.current.currentTime = 0;
              countdownAudioRef.current = null;
            }
            onSkip();
          }}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
          aria-label="Skip game"
        >
          Skip
          <SkipForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="w-full h-1 bg-slate-100/50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <div className="flex justify-center mb-6">
          {hasStarted ? (
            <div className="relative flex items-center justify-center w-36 h-36" aria-label={`${timeLeft} seconds remaining`}>
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r={tickRadius}
                  className="stroke-slate-200"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${tickDash} ${tickGap}`}
                />
                <circle
                  cx="60" cy="60" r={tickRadius}
                  className={`transition-all duration-1000 ease-linear ${isTimeLow ? 'stroke-rose-500/40' : 'stroke-indigo-500/40'}`}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${tickDash} ${tickGap}`}
                  strokeDashoffset={tickOffset}
                />
                <circle
                  cx="60" cy="60" r={radius}
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60" cy="60" r={radius}
                  className={`transition-all duration-1000 ease-linear ${isTimeLow ? 'stroke-rose-500' : 'stroke-indigo-500'}`}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <motion.span
                  animate={isTimeLow ? { scale: [1, 1.1, 1] } : {}}
                  transition={isTimeLow ? { repeat: Infinity, duration: 1 } : {}}
                  className={`text-5xl font-black tabular-nums tracking-tighter ${isTimeLow ? 'text-rose-600' : 'text-slate-800'}`}
                >
                  {timeLeft}
                </motion.span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">sec</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClickSound(0.3);
                const countdownAudio = new Audio('/sounds/Countdown clock.mp3');
                countdownAudio.volume = 0.6;
                countdownAudioRef.current = countdownAudio;
                countdownAudio.play().catch(() => undefined);
                setHasStarted(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Sprint
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-[120px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight tracking-tight">
                {currentQuestion.question}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-auto">
          <label htmlFor="answer-input" className="sr-only">Your answer</label>
          <motion.div
            animate={feedback === 'incorrect' ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative flex items-center"
          >
            <input
              ref={inputRef}
              id="answer-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!hasStarted || feedback !== null}
              placeholder="Type your answer..."
              className={`w-full px-6 py-5 pr-16 rounded-2xl border-2 outline-none transition-all text-lg font-medium shadow-sm
                ${feedback === null
                  ? 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 bg-slate-50/50 focus:bg-white text-slate-800 placeholder:text-slate-400'
                  : feedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-emerald-500/10'
                    : 'border-rose-500 bg-rose-50 text-rose-900 shadow-rose-500/10'
                }
                disabled:opacity-100
              `}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {hasStarted && feedback === null && (
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-3 p-2.5 rounded-xl bg-indigo-600 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:shadow-none active:scale-95"
                aria-label="Submit answer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-5 text-emerald-500 bg-emerald-100 rounded-full p-1"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              )}
              {feedback === 'incorrect' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-5 text-rose-500 bg-rose-100 rounded-full p-1"
                >
                  <XCircle className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div aria-live="polite" className="h-10 mt-4 text-center flex items-center justify-center">
            <AnimatePresence mode="wait">
              {feedback === 'correct' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Brilliant!
                </motion.div>
              )}
              {feedback === 'incorrect' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full font-bold text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Correct answer: <span className="bg-white/50 px-2 py-0.5 rounded-md">{currentQuestion.answer}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
