'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Clock3, RotateCcw, SkipForward, Sparkles, Target, XCircle } from 'lucide-react';
import { FillGapGameContent } from '@/data/lessons/types';
import { playClickSound, playSound } from '@/lib/microbreaks/celebrationEffects';

interface FillGapReplacementGameProps {
  content: FillGapGameContent;
  done: boolean;
  soundEnabled: boolean;
  onSkip: () => void;
  onDone: (score: number, accuracy: number) => void;
}

type TemplatePart =
  | { type: 'text'; value: string }
  | { type: 'gap'; value: string };

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export default function FillGapReplacementGame({
  content,
  done,
  soundEnabled,
  onSkip,
  onDone,
}: FillGapReplacementGameProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeGapId, setActiveGapId] = useState<string | null>(content.gaps[0]?.id ?? null);
  const [checked, setChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);

  const parsedTemplate = useMemo<TemplatePart[]>(() => {
    const parts: TemplatePart[] = [];
    const regex = /\{\{([^}]+)\}\}|\{([^}]+)\}|\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content.textTemplate)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.textTemplate.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'gap', value: match[1] || match[2] || match[3] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.textTemplate.length) {
      parts.push({ type: 'text', value: content.textTemplate.slice(lastIndex) });
    }

    return parts;
  }, [content.textTemplate]);

  useEffect(() => {
    setAnswers({});
    setActiveGapId(content.gaps[0]?.id ?? null);
    setChecked(false);
    setTimeLeft(content.timerSeconds ?? null);
    setWasAutoSubmitted(false);
  }, [content]);

  const score = useMemo(
    () => content.gaps.reduce((total, gap) => total + (answers[gap.id] === gap.correctOptionIndex ? 1 : 0), 0),
    [answers, content.gaps],
  );
  const accuracy = content.gaps.length > 0 ? (score / content.gaps.length) * 100 : 0;
  const answeredCount = content.gaps.filter((gap) => answers[gap.id] !== undefined).length;
  const unansweredGaps = content.gaps.filter((gap) => answers[gap.id] === undefined);
  const activeGap = content.gaps.find((gap) => gap.id === activeGapId) ?? unansweredGaps[0] ?? content.gaps[0] ?? null;
  const isReadyToCheck = answeredCount === content.gaps.length && content.gaps.length > 0;

  const submitRound = useCallback((reason: 'manual' | 'timeout') => {
    setChecked((previous) => {
      if (previous) return previous;
      if (reason === 'manual' && soundEnabled) {
        playSound(score > 0 ? 'success' : 'failure', score > 0 ? 0.28 : 0.24);
      }
      return true;
    });
    setActiveGapId(null);
    setWasAutoSubmitted(reason === 'timeout');
  }, [score, soundEnabled]);

  useEffect(() => {
    if (done || checked || timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(id);
  }, [done, checked, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !checked) {
      submitRound('timeout');
    }
  }, [timeLeft, checked, submitRound]);

  const handleReset = () => {
    if (soundEnabled) playClickSound(0.2);
    setAnswers({});
    setActiveGapId(content.gaps[0]?.id ?? null);
    setChecked(false);
    setTimeLeft(content.timerSeconds ?? null);
    setWasAutoSubmitted(false);
  };

  const handleGapClick = (gapId: string) => {
    if (done || checked) return;
    setActiveGapId(gapId);
    if (soundEnabled) playClickSound(0.16);
  };

  const handleSelectOption = (gapId: string, optionIndex: number) => {
    if (done || checked) return;

    setAnswers((prev) => {
      const next = { ...prev, [gapId]: optionIndex };
      const gapIndex = content.gaps.findIndex((gap) => gap.id === gapId);

      let nextGapId: string | null = null;
      for (let i = gapIndex + 1; i < content.gaps.length; i += 1) {
        if (next[content.gaps[i].id] === undefined) {
          nextGapId = content.gaps[i].id;
          break;
        }
      }
      if (!nextGapId) {
        for (let i = 0; i < gapIndex; i += 1) {
          if (next[content.gaps[i].id] === undefined) {
            nextGapId = content.gaps[i].id;
            break;
          }
        }
      }

      setActiveGapId(nextGapId);
      return next;
    });

    if (soundEnabled) playClickSound(0.2);
  };

  const handleContinue = () => {
    if (done || !checked) return;
    if (soundEnabled) playClickSound(0.24);
    onDone(score, accuracy);
  };

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.14),_transparent_24%),linear-gradient(180deg,_#ffffff,_#f8fafc)] shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              Fill Gap
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {content.prompt || 'Complete the sentence precisely'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {content.instructions || 'Move through the blanks, choose the best term for each one, then check the full sentence.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {timeLeft !== null ? (
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                timeLeft <= 8 && !checked ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700'
              }`}>
                <Clock3 className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
            ) : null}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playClickSound(0.2);
                onSkip();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/80 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.45fr_0.95fr] lg:px-8">
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Sentence Canvas</p>
            <div className="mt-5 text-lg leading-[3.5rem] text-slate-700 sm:text-[1.55rem] sm:leading-[4rem]">
              {parsedTemplate.map((part, index) => {
                if (part.type === 'text') {
                  return <span key={`text-${index}`} className="whitespace-pre-wrap">{part.value}</span>;
                }

                const gap = content.gaps.find((item) => item.id === part.value);
                if (!gap) {
                  return <span key={`missing-${index}`} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">Missing gap: {part.value}</span>;
                }

                const selectedOptionIndex = answers[gap.id];
                const hasAnswer = selectedOptionIndex !== undefined;
                const isCorrect = hasAnswer && selectedOptionIndex === gap.correctOptionIndex;
                const isActive = activeGap?.id === gap.id && !checked;
                const selectedText = hasAnswer ? gap.options[selectedOptionIndex] : 'Select';

                return (
                  <button
                    key={gap.id}
                    onClick={() => handleGapClick(gap.id)}
                    disabled={checked}
                    className={`mx-1 inline-flex min-h-[48px] min-w-[120px] items-center justify-center rounded-2xl border px-4 py-2 text-center align-middle text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:text-base ${
                      checked
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                          : 'border-rose-300 bg-rose-50 text-rose-900'
                        : isActive
                          ? 'border-teal-400 bg-teal-50 text-teal-900 shadow-[0_14px_35px_rgba(20,184,166,0.18)]'
                          : hasAnswer
                            ? 'border-slate-300 bg-slate-50 text-slate-800'
                            : 'border-dashed border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    aria-label={`Gap ${gap.id}`}
                  >
                    {selectedText}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Option Deck</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                  {checked ? 'Review answers' : activeGap ? `Choose for "${activeGap.id}"` : 'All blanks complete'}
                </h3>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {answeredCount}/{content.gaps.length} filled
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeGap?.id ?? 'review'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="mt-5 grid gap-3 sm:grid-cols-2"
              >
                {(checked ? content.gaps : activeGap ? [activeGap] : []).flatMap((gap) =>
                  gap.options.map((option, optionIndex) => {
                    const selected = answers[gap.id] === optionIndex;
                    const correct = gap.correctOptionIndex === optionIndex;
                    const showCorrect = checked && correct;
                    const showWrong = checked && selected && !correct;

                    return (
                      <button
                        key={`${gap.id}-${optionIndex}`}
                        onClick={() => handleSelectOption(gap.id, optionIndex)}
                        disabled={checked || activeGap?.id !== gap.id}
                        className={`rounded-[1.35rem] border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                          showCorrect
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                            : showWrong
                              ? 'border-rose-300 bg-rose-50 text-rose-900'
                              : selected
                                ? 'border-teal-400 bg-teal-50 text-teal-900'
                                : checked || activeGap?.id !== gap.id
                                  ? 'cursor-default border-slate-200 bg-slate-50 text-slate-500'
                                  : 'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold sm:text-base">{option}</span>
                          {showCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : null}
                          {showWrong ? <XCircle className="h-5 w-5 shrink-0 text-rose-600" /> : null}
                        </div>
                      </button>
                    );
                  }),
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Round Status</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active</p>
                <p className="mt-2 text-sm font-semibold text-white">{activeGap?.id ?? 'Review'}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Filled</p>
                <p className="mt-2 text-2xl font-black text-white">{answeredCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Score</p>
                <p className="mt-2 text-2xl font-black text-white">{checked ? `${score}/${content.gaps.length}` : '--'}</p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={false}
                animate={{ width: `${content.gaps.length > 0 ? (answeredCount / content.gaps.length) * 100 : 0}%` }}
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-orange-400"
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {checked
                ? wasAutoSubmitted
                  ? 'Time expired, so the sentence was checked automatically. Review the marked blanks and continue.'
                  : `Checked. You landed ${score} of ${content.gaps.length} blanks correctly.`
                : activeGap
                  ? 'Choose an option for the highlighted blank. You can revisit any blank before checking.'
                  : 'All blanks are filled. Check the full sentence when you are ready.'}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Actions</p>
            <div className="mt-4 space-y-3">
              {!checked ? (
                <button
                  onClick={() => submitRound('manual')}
                  disabled={!isReadyToCheck || done}
                  className={`w-full rounded-2xl px-4 py-4 text-base font-black tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    isReadyToCheck
                      ? 'bg-slate-900 text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400'
                  }`}
                >
                  CHECK SENTENCE
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-4 text-base font-black tracking-[0.08em] text-white shadow-[0_16px_35px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  Continue
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={handleReset}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Clear Answers
              </button>
            </div>

            {checked ? (
              <div className={`mt-5 rounded-[1.25rem] border p-4 ${score === content.gaps.length ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${score === content.gaps.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Summary</p>
                    <p className="text-lg font-black tracking-tight text-slate-900">
                      {score === content.gaps.length ? 'Every blank is correct.' : 'A few blanks need another look.'}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Accuracy: {Math.round(accuracy)}%. Incorrect blanks are marked in red, and the correct options are highlighted in green.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
