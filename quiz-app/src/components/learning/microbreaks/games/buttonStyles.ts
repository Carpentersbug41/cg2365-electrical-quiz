export type ChoiceButtonState =
  | 'idle'
  | 'selected'
  | 'matched'
  | 'correct'
  | 'wrong'
  | 'used';

const choiceBaseClass =
  'rounded-2xl border-2 transition-[transform,box-shadow,border-color,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed';

const choiceStateClasses: Record<ChoiceButtonState, string> = {
  idle: 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.05)] hover:bg-white hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-[0_10px_22px_rgba(79,70,229,0.12)]',
  selected:
    'bg-white dark:bg-slate-700 border-indigo-400 dark:border-indigo-400 text-indigo-900 dark:text-indigo-100 shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_10px_24px_rgba(99,102,241,0.16)] ring-2 ring-indigo-300/30',
  matched:
    'bg-white dark:bg-slate-700 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_10px_24px_rgba(16,185,129,0.15)] ring-2 ring-emerald-300/30',
  correct:
    'bg-white dark:bg-slate-700 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_10px_24px_rgba(16,185,129,0.15)] ring-2 ring-emerald-300/30',
  wrong:
    'bg-white dark:bg-slate-700 border-rose-300 dark:border-rose-500 text-rose-700 dark:text-rose-100 shadow-[0_8px_20px_rgba(244,63,94,0.12)]',
  used: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 line-through',
};

const actionBaseClass =
  'rounded-xl font-semibold transition-[transform,box-shadow,border-color,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed';

export const primaryActionButtonClass = `${actionBaseClass} bg-white text-indigo-700 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 shadow-[0_8px_22px_rgba(79,70,229,0.12)] dark:bg-slate-700 dark:text-indigo-100 dark:border-indigo-500/50 dark:hover:bg-slate-600`;
export const secondaryActionButtonClass = `${actionBaseClass} bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600`;
export const positiveActionButtonClass = `${actionBaseClass} bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 shadow-[0_8px_22px_rgba(16,185,129,0.12)] dark:bg-slate-700 dark:text-emerald-100 dark:border-emerald-500/50 dark:hover:bg-slate-600`;

export function choiceButtonClass(state: ChoiceButtonState): string {
  return `${choiceBaseClass} ${choiceStateClasses[state]}`;
}
