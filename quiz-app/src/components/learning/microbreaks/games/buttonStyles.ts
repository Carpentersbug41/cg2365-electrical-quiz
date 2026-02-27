export type ChoiceButtonState =
  | 'idle'
  | 'selected'
  | 'matched'
  | 'correct'
  | 'wrong'
  | 'used';

const choiceBaseClass =
  'rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none';

const choiceStateClasses: Record<ChoiceButtonState, string> = {
  idle: 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5',
  selected:
    'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20',
  matched:
    'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-default opacity-90 shadow-[0_0_16px_rgba(16,185,129,0.18)]',
  correct:
    'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30',
  wrong:
    'bg-red-50 border-red-300 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  used: 'bg-slate-100 border-slate-200 text-slate-400 line-through',
};

const actionBaseClass =
  'rounded-xl border font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

export const primaryActionButtonClass = `${actionBaseClass} border-indigo-600 bg-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 text-white shadow-md hover:shadow-lg`;
export const secondaryActionButtonClass = `${actionBaseClass} border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 text-slate-700`;
export const positiveActionButtonClass = `${actionBaseClass} border-emerald-600 bg-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white shadow-md hover:shadow-lg`;

export function choiceButtonClass(state: ChoiceButtonState): string {
  return `${choiceBaseClass} ${choiceStateClasses[state]}`;
}
