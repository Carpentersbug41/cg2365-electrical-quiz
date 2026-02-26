import { getCoursePrefixFromPathname } from './curricula';

export type CurriculumScope = 'cg2365' | 'gcse-science-physics';

export function getCurriculumScopeFromReferer(referer: string | null): CurriculumScope {
  if (!referer) return 'cg2365';

  try {
    const pathname = new URL(referer).pathname;
    const prefix = getCoursePrefixFromPathname(pathname);
    if (prefix === '/gcse/science/physics') return 'gcse-science-physics';
    return 'cg2365';
  } catch {
    return 'cg2365';
  }
}

export function isUnitAllowedForScope(unitCode: string, scope: CurriculumScope): boolean {
  if (scope === 'cg2365') {
    return /^(201|202|203|204|210|305)\b/.test(unitCode);
  }

  // GCSE Physics must use its own bank namespace to avoid mixing with 2365.
  return /^PHY-/i.test(unitCode);
}

export function isLessonIdAllowedForScope(lessonId: string, scope: CurriculumScope): boolean {
  if (scope === 'gcse-science-physics') {
    return /^PHY-/i.test(lessonId);
  }
  return /^(201|202|203|204|210|305)-/i.test(lessonId);
}
