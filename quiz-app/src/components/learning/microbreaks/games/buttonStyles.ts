export type ChoiceButtonState =
  | 'idle'
  | 'selected'
  | 'matched'
  | 'correct'
  | 'wrong'
  | 'used';

const choiceBaseClass =
  'rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

const choiceStateClasses: Record<ChoiceButtonState, string> = {
  idle: 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)]',
  selected:
    'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-400 text-indigo-900 dark:text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20',
  matched:
    'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30',
  correct:
    'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30',
  wrong:
    'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-500 text-red-700 dark:text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  used: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 line-through',
};

const actionBaseClass =
  'rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

export const primaryActionButtonClass = `${actionBaseClass} bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_24px_rgba(79,70,229,0.25)]`;
export const secondaryActionButtonClass = `${actionBaseClass} bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 border border-slate-200 dark:border-slate-600`;
export const positiveActionButtonClass = `${actionBaseClass} bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_8px_24px_rgba(16,185,129,0.25)]`;

export function choiceButtonClass(state: ChoiceButtonState): string {
  return `${choiceBaseClass} ${choiceStateClasses[state]}`;
}
