'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { IsCorrectWhyGameContent } from '@/data/lessons/types';
import { playClickSound, playSound } from '@/lib/microbreaks/celebrationEffects';

type ButtonStatus = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

interface IsCorrectWhyReplacementGameProps {
  content: IsCorrectWhyGameContent;
  done: boolean;
  soundEnabled: boolean;
  onSkip: () => void;
  onDone: (score: number, accuracy: number) => void;
}

interface QuestionView {
  statement: string;
  isCorrect: boolean;
  reasons: string[];
  correctReasonIndex: number;
  explanation?: string;
}

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function getButtonStyles(status: ButtonStatus): string {
  switch (status) {
    case 'default':
      return 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/50';
    case 'selected':
      return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500';
    case 'correct':
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500';
    case 'incorrect':
      return 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300 ring-1 ring-red-500';
    case 'dimmed':
      return 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 opacity-60';
    default:
      return '';
  }
}

function StatusIcon({ status, isRadio = false }: { status: ButtonStatus; isRadio?: boolean }) {
  if (status === 'correct') return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
  if (status === 'incorrect') return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
  if (status === 'selected') return <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
  if (isRadio) return <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />;
  return null;
}

export default function IsCorrectWhyReplacementGame({
  content,
  done,
  soundEnabled,
  onSkip,
  onDone,
}: IsCorrectWhyReplacementGameProps) {
  const questions = useMemo<QuestionView[]>(() => {
    if (content.questions && content.questions.length > 0) {
      return content.questions.map((q) => ({
        statement: q.statement,
        isCorrect: q.isCorrect,
        reasons: q.reasons,
        correctReasonIndex: q.correctReasonIndex,
        explanation: q.explanation,
      }));
    }
    return [
      {
        statement: content.statement,
        isCorrect: content.isCorrect,
        reasons: content.reasons,
        correctReasonIndex: content.correctReasonIndex,
        explanation: content.explanation,
      },
    ];
  }, [content]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [truthChoice, setTruthChoice] = useState<boolean | null>(null);
  const [reasonChoice, setReasonChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];

  useEffect(() => {
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setTruthChoice(null);
    setReasonChoice(null);
    setIsSubmitted(false);
    setTimeLeft(content.timerSeconds ?? null);
    setCompleted(false);
  }, [content]);

  useEffect(() => {
    if (done || isSubmitted || timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(id);
  }, [done, isSubmitted, timeLeft]);

  const submit = useCallback(
    (isTimeout = false) => {
      if (done || isSubmitted || completed) return;
      if (!isTimeout && (truthChoice === null || reasonChoice === null)) return;
      setIsSubmitted(true);
      if (soundEnabled) {
        const isTruthCorrect = truthChoice === currentQuestion.isCorrect;
        const isReasonCorrect = reasonChoice === currentQuestion.correctReasonIndex;
        const isFullCorrect = isTruthCorrect && isReasonCorrect;
        playSound(isFullCorrect ? 'success' : 'failure', isFullCorrect ? 0.35 : 0.3);
      }
    },
    [done, isSubmitted, completed, truthChoice, reasonChoice, currentQuestion, soundEnabled]
  );

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) submit(true);
  }, [timeLeft, isSubmitted, submit]);

  const getTruthStatus = (value: boolean): ButtonStatus => {
    if (!isSubmitted) return truthChoice === value ? 'selected' : 'default';
    if (currentQuestion.isCorrect === value) return 'correct';
    if (truthChoice === value) return 'incorrect';
    return 'dimmed';
  };

  const getReasonStatus = (index: number): ButtonStatus => {
    if (!isSubmitted) return reasonChoice === index ? 'selected' : 'default';
    if (currentQuestion.correctReasonIndex === index) return 'correct';
    if (reasonChoice === index) return 'incorrect';
    return 'dimmed';
  };

  const isTruthCorrect = truthChoice === currentQuestion.isCorrect;
  const isReasonCorrect = reasonChoice === currentQuestion.correctReasonIndex;
  const isFullCorrect = isTruthCorrect && isReasonCorrect;

  const moveNext = () => {
    if (done || completed) return;
    if (soundEnabled) playClickSound(0.2);

    const nextCorrect = correctAnswers + (isFullCorrect ? 1 : 0);
    if (questionIndex >= questions.length - 1) {
      const total = Math.max(1, questions.length);
      const accuracy = (nextCorrect / total) * 100;
      setCompleted(true);
      onDone(nextCorrect, accuracy);
      return;
    }

    setCorrectAnswers(nextCorrect);
    setQuestionIndex((prev) => prev + 1);
    setTruthChoice(null);
    setReasonChoice(null);
    setIsSubmitted(false);
    setTimeLeft(content.timerSeconds ?? null);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white font-sans shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {questions.length > 1 ? (
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold dark:bg-zinc-800">
              {questionIndex + 1}/{questions.length}
            </span>
          ) : null}
          {timeLeft !== null && !isSubmitted ? (
            <span
              className={cn(
                'rounded-md bg-zinc-100 px-2 py-1 tabular-nums dark:bg-zinc-800',
                timeLeft <= 5 && 'animate-pulse bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              )}
            >
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          ) : null}
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Concept Check</span>
        </div>
        <button
          onClick={() => {
            if (soundEnabled) playClickSound(0.2);
            onSkip();
          }}
          disabled={isSubmitted || done}
          className="rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-zinc-300"
          aria-label="Skip question"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col gap-10 p-6 md:p-8">
        <div className="space-y-4" role="region" aria-label="Statement to evaluate">
          <p className="text-xl font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 md:text-2xl">
            "{currentQuestion.statement}"
          </p>
        </div>

        <div className="space-y-4" role="radiogroup" aria-labelledby="truth-label">
          <h3 id="truth-label" className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">1</span>
            Is this statement correct or incorrect?
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              role="radio"
              aria-checked={truthChoice === true}
              disabled={isSubmitted || done}
              onClick={() => {
                if (!isSubmitted && !done) {
                  if (soundEnabled) playClickSound(0.2);
                  setTruthChoice(true);
                }
              }}
              className={cn(
                'relative flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                getButtonStyles(getTruthStatus(true)),
                !isSubmitted && !done && 'cursor-pointer active:scale-[0.98]'
              )}
            >
              <span className="font-medium">Correct</span>
              <StatusIcon status={getTruthStatus(true)} isRadio />
            </button>
            <button
              role="radio"
              aria-checked={truthChoice === false}
              disabled={isSubmitted || done}
              onClick={() => {
                if (!isSubmitted && !done) {
                  if (soundEnabled) playClickSound(0.2);
                  setTruthChoice(false);
                }
              }}
              className={cn(
                'relative flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                getButtonStyles(getTruthStatus(false)),
                !isSubmitted && !done && 'cursor-pointer active:scale-[0.98]'
              )}
            >
              <span className="font-medium">Incorrect</span>
              <StatusIcon status={getTruthStatus(false)} isRadio />
            </button>
          </div>
        </div>

        <div
          className={cn(
            'space-y-4 transition-all duration-500',
            truthChoice === null && !isSubmitted ? 'pointer-events-none opacity-40 grayscale-[0.5]' : 'opacity-100'
          )}
          role="radiogroup"
          aria-labelledby="reason-label"
        >
          <h3 id="reason-label" className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">2</span>
            What is the best reason?
          </h3>
          <div className="flex flex-col gap-3">
            {currentQuestion.reasons.map((reason, idx) => {
              const status = getReasonStatus(idx);
              return (
                <button
                  key={`${reason}-${idx}`}
                  role="radio"
                  aria-checked={reasonChoice === idx}
                  disabled={isSubmitted || done}
                  onClick={() => {
                    if (!isSubmitted && !done) {
                      if (soundEnabled) playClickSound(0.2);
                      setReasonChoice(idx);
                    }
                  }}
                  className={cn(
                    'relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                    getButtonStyles(status),
                    !isSubmitted && !done && 'cursor-pointer active:scale-[0.99]'
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <StatusIcon status={status} isRadio />
                  </div>
                  <span className="font-medium leading-relaxed">{reason}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/80">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key={`submit-${questionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-end"
            >
              <button
                onClick={() => submit(false)}
                disabled={truthChoice === null || reasonChoice === null || done}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:bg-zinc-300 disabled:text-zinc-500 disabled:active:scale-100 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500 dark:focus-visible:ring-offset-zinc-900"
              >
                Check Answer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`feedback-${questionIndex}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6"
            >
              <div
                className={cn(
                  'flex gap-4 rounded-xl border p-5',
                  isFullCorrect
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                    : 'border-red-200 bg-red-50 text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100'
                )}
                role="alert"
                aria-live="assertive"
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isFullCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="w-full space-y-2">
                  <h4 className="text-lg font-bold">{isFullCorrect ? 'Correct!' : 'Not quite right.'}</h4>
                  {!isFullCorrect ? (
                    <p className="text-sm font-medium opacity-90">
                      {!isTruthCorrect && !isReasonCorrect
                        ? 'Both the truth value and the reason were incorrect.'
                        : !isTruthCorrect
                          ? 'The reason may fit, but the statement truth value was incorrect.'
                          : 'The truth value was right, but the reason was incorrect.'}
                    </p>
                  ) : null}
                  {currentQuestion.explanation ? (
                    <div className="mt-3 border-t border-current/10 pt-3 text-sm leading-relaxed">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider opacity-80">Explanation</span>
                      {currentQuestion.explanation}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={moveNext}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-900"
                >
                  {questionIndex >= questions.length - 1 ? 'Finish' : 'Continue'} <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
