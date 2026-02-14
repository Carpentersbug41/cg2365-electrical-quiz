export const MODULE_PLANNER_DB_FILE = '.module_planner/module_planner_db.json';
export const MAX_ACS_PER_LESSON = 4;
export const DEFAULT_MAX_LESSONS_PER_LO = 2;
export const DEFAULT_LEVEL = 'Level 2';
export const DEFAULT_AUDIENCE = 'beginner';
export const DEFAULT_ORDERING_PREFERENCE = 'foundation-first';
export const DEFAULT_MINIMISE_LESSONS = true;

const MIN_CONCURRENCY = 1;
const MAX_CONCURRENCY = 2;

export function getModulePlannerConcurrency(): number {
  const raw = process.env.MODULE_PLANNER_CONCURRENCY;
  if (!raw) return 1;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return 1;
  return Math.max(MIN_CONCURRENCY, Math.min(MAX_CONCURRENCY, parsed));
}

