export function isModulePlannerEnabled(): boolean {
  const raw = process.env.MODULE_PLANNER_ENABLED?.trim();
  if (!raw) return false;
  return raw.toLowerCase() === 'true';
}
