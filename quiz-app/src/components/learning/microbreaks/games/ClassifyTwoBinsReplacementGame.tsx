'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftRight, CheckCircle2, RotateCcw, Sparkles, TimerReset, XCircle } from 'lucide-react';
import { ClassifyTwoBinsGameContent } from '@/data/lessons/types';
import { playClickSound, playSound } from '@/lib/microbreaks/celebrationEffects';

interface ClassifyTwoBinsReplacementGameProps {
  content: ClassifyTwoBinsGameContent;
  done: boolean;
  soundEnabled: boolean;
  onSkip: () => void;
  onDone: (score: number, accuracy: number) => void;
}

type BinSide = 'left' | 'right';

interface ItemFeedback {
  text: string;
  assignedTo: BinSide | null;
  correctBin: BinSide;
}

function binShell(side: BinSide, selected: boolean, checked: boolean): string {
  if (checked) {
    return side === 'left'
      ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
      : 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50';
  }

  if (selected) {
    return side === 'left'
      ? 'border-amber-400 bg-gradient-to-br from-amber-100 to-orange-100 shadow-[0_18px_45px_rgba(251,191,36,0.24)]'
      : 'border-cyan-400 bg-gradient-to-br from-cyan-100 to-sky-100 shadow-[0_18px_45px_rgba(34,211,238,0.24)]';
  }

  return side === 'left'
    ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/80'
    : 'border-cyan-200 bg-gradient-to-br from-white to-cyan-50/80';
}

export default function ClassifyTwoBinsReplacementGame({
  content,
  done,
  soundEnabled,
  onSkip,
  onDone,
}: ClassifyTwoBinsReplacementGameProps) {
  const [assignments, setAssignments] = useState<Record<string, BinSide | null>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timerSeconds ?? null);

  useEffect(() => {
    const initialAssignments: Record<string, BinSide | null> = {};
    content.items.forEach((item) => {
      initialAssignments[item.text] = null;
    });
    setAssignments(initialAssignments);
    setSelectedItem(null);
    setChecked(false);
    setTimeLeft(content.timerSeconds ?? null);
  }, [content]);

  useEffect(() => {
    if (done || checked || timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(id);
  }, [done, checked, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !checked) {
      setChecked(true);
      if (soundEnabled) playSound('failure', 0.25);
    }
  }, [timeLeft, checked, soundEnabled]);

  const feedbackItems: ItemFeedback[] = content.items.map((item) => ({
    text: item.text,
    assignedTo: assignments[item.text] ?? null,
    correctBin: item.correctBin,
  }));

  const totalItems = content.items.length;
  const assignedCount = feedbackItems.filter((item) => item.assignedTo !== null).length;
  const correctCount = feedbackItems.filter((item) => item.assignedTo === item.correctBin).length;
  const accuracy = totalItems > 0 ? (correctCount / totalItems) * 100 : 0;
  const leftItems = feedbackItems.filter((item) => item.assignedTo === 'left');
  const rightItems = feedbackItems.filter((item) => item.assignedTo === 'right');
  const unassignedItems = feedbackItems.filter((item) => item.assignedTo === null);
  const isReadyToCheck = assignedCount === totalItems && totalItems > 0;

  const assignSelected = (side: BinSide) => {
    if (done || checked || !selectedItem) return;
    setAssignments((prev) => ({ ...prev, [selectedItem]: side }));
    setSelectedItem(null);
    if (soundEnabled) playClickSound(0.22);
  };

  const assignDirect = (text: string, side: BinSide) => {
    if (done || checked) return;
    setAssignments((prev) => ({ ...prev, [text]: side }));
    setSelectedItem(null);
    if (soundEnabled) playClickSound(0.2);
  };

  const clearAssignment = (text: string) => {
    if (done || checked) return;
    setAssignments((prev) => ({ ...prev, [text]: null }));
    setSelectedItem(text);
    if (soundEnabled) playClickSound(0.18);
  };

  const resetRound = () => {
    if (soundEnabled) playClickSound(0.2);
    const nextAssignments: Record<string, BinSide | null> = {};
    content.items.forEach((item) => {
      nextAssignments[item.text] = null;
    });
    setAssignments(nextAssignments);
    setSelectedItem(null);
    setChecked(false);
    setTimeLeft(content.timerSeconds ?? null);
  };

  const submit = () => {
    if (done || checked || !isReadyToCheck) return;
    setChecked(true);
    if (soundEnabled) {
      playSound(correctCount === totalItems ? 'success' : correctCount > 0 ? 'success' : 'failure', correctCount > 0 ? 0.3 : 0.25);
    }
  };

  const renderItemCard = (item: ItemFeedback, index: number, compact = false) => {
    const isSelected = selectedItem === item.text;
    const isCorrect = checked && item.assignedTo === item.correctBin;
    const isWrong = checked && item.assignedTo !== null && item.assignedTo !== item.correctBin;

    return (
      <motion.div
        key={item.text}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: index * 0.03 }}
        className={`rounded-[1.35rem] border px-4 py-4 shadow-sm transition-all ${
          isCorrect
            ? 'border-emerald-300 bg-emerald-50'
            : isWrong
              ? 'border-rose-300 bg-rose-50'
              : isSelected
                ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]'
                : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className={`text-sm font-semibold leading-snug ${isSelected ? 'text-white' : 'text-slate-800'}`}>{item.text}</p>
            <p className={`text-[11px] uppercase tracking-[0.24em] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
              {item.assignedTo ? `Assigned to ${item.assignedTo === 'left' ? content.leftLabel : content.rightLabel}` : 'Awaiting bin'}
            </p>
          </div>
          {checked ? (
            isCorrect ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
            )
          ) : (
            <button
              onClick={() => setSelectedItem(item.text)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isSelected ? 'Selected' : item.assignedTo ? 'Move' : 'Select'}
            </button>
          )}
        </div>

        {!checked ? (
          <div className={`mt-4 flex ${compact ? 'flex-col' : 'flex-wrap'} gap-2`}>
            <button
              onClick={() => assignDirect(item.text, 'left')}
              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {content.leftLabel}
            </button>
            <button
              onClick={() => assignDirect(item.text, 'right')}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-900 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {content.rightLabel}
            </button>
            {item.assignedTo ? (
              <button
                onClick={() => clearAssignment(item.text)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : !isCorrect ? (
          <p className="mt-3 text-xs font-medium text-slate-600">
            Correct bin: {item.correctBin === 'left' ? content.leftLabel : content.rightLabel}
          </p>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_22%),linear-gradient(180deg,_#ffffff,_#f8fafc)] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Classify Two Bins
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Sort each card into the right side</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Select a card, then place it in the amber or cyan lane. You can also assign directly from each card.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {timeLeft !== null ? (
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${timeLeft <= 8 && !checked ? 'bg-rose-100 text-rose-700' : 'bg-white text-slate-700'} border border-slate-200`}>
                <TimerReset className="h-4 w-4" />
                {timeLeft}s
              </div>
            ) : null}
            <button
              onClick={resetRound}
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
              className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`min-h-[220px] rounded-[1.75rem] border p-5 text-left transition-all ${binShell('left', Boolean(selectedItem) && !checked, checked)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">Left Bin</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{content.leftLabel}</h3>
                </div>
                <div className="rounded-2xl bg-white/80 p-3 text-amber-500 shadow-sm">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
              </div>
              {!checked ? (
                <button
                  onClick={() => assignSelected('left')}
                  disabled={!selectedItem}
                  className="mt-4 w-full rounded-2xl border border-amber-200 bg-white/85 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-amber-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectedItem ? 'Drop selected card here' : 'Select a card first'}
                </button>
              ) : null}
              <div className="mt-5 space-y-3">
                {leftItems.length > 0 ? leftItems.map((item, index) => renderItemCard(item, index, true)) : (
                  <div className="rounded-[1.25rem] border border-dashed border-amber-200 bg-white/70 px-4 py-8 text-center text-sm font-medium text-slate-500">
                    {selectedItem ? 'Tap to drop the selected card here.' : 'No cards placed here yet.'}
                  </div>
                )}
              </div>
            </div>

            <div className={`min-h-[220px] rounded-[1.75rem] border p-5 text-left transition-all ${binShell('right', Boolean(selectedItem) && !checked, checked)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-700">Right Bin</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{content.rightLabel}</h3>
                </div>
                <div className="rounded-2xl bg-white/80 p-3 text-cyan-500 shadow-sm">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
              </div>
              {!checked ? (
                <button
                  onClick={() => assignSelected('right')}
                  disabled={!selectedItem}
                  className="mt-4 w-full rounded-2xl border border-cyan-200 bg-white/85 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectedItem ? 'Drop selected card here' : 'Select a card first'}
                </button>
              ) : null}
              <div className="mt-5 space-y-3">
                {rightItems.length > 0 ? rightItems.map((item, index) => renderItemCard(item, index, true)) : (
                  <div className="rounded-[1.25rem] border border-dashed border-cyan-200 bg-white/70 px-4 py-8 text-center text-sm font-medium text-slate-500">
                    {selectedItem ? 'Tap to drop the selected card here.' : 'No cards placed here yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Card Tray</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                  {checked ? 'Placement review' : 'Unassigned and movable cards'}
                </h3>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {assignedCount}/{totalItems} placed
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <AnimatePresence>
                {(checked ? feedbackItems : unassignedItems).map((item, index) => renderItemCard(item, index))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Progress</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected</p>
                <p className="mt-2 text-sm font-semibold text-white">{selectedItem ?? 'None'}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Assigned</p>
                <p className="mt-2 text-2xl font-black text-white">{assignedCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Accuracy</p>
                <p className="mt-2 text-2xl font-black text-white">{Math.round(accuracy)}%</p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={false}
                animate={{ width: `${totalItems > 0 ? (assignedCount / totalItems) * 100 : 0}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400"
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {checked
                ? `You placed ${correctCount} of ${totalItems} cards correctly.`
                : selectedItem
                  ? 'A card is armed. Tap a bin to snap it into place, or use the direct buttons on any card.'
                  : 'Start by picking a card from the tray or from a bin you want to reassign.'}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Actions</p>
            <div className="mt-4 space-y-3">
              {!checked ? (
                <button
                  onClick={submit}
                  disabled={!isReadyToCheck || done}
                  className={`w-full rounded-2xl px-4 py-4 text-base font-black tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    isReadyToCheck
                      ? 'bg-slate-900 text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400'
                  }`}
                >
                  CHECK SORT
                </button>
              ) : (
                <button
                  onClick={() => onDone(correctCount, accuracy)}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 text-base font-black tracking-[0.08em] text-white shadow-[0_16px_35px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  CONTINUE
                </button>
              )}
              <button
                onClick={resetRound}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Clear Board
              </button>
            </div>

            {checked ? (
              <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Summary</p>
                <p className="mt-2 text-lg font-black tracking-tight text-slate-900">
                  {correctCount === totalItems ? 'Everything landed perfectly.' : 'Some cards still belong in the opposite lane.'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Score: {correctCount}/{totalItems}. Review the highlighted cards, then continue when you are done.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
