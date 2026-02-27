import { getCoursePrefixFromPathname } from './curricula';

export type CurriculumScope = 'cg2365' | 'gcse-science-physics' | 'gcse-science-biology';

export function getCurriculumScopeFromCoursePrefix(prefix: string): CurriculumScope {
  if (prefix === '/gcse/science/physics') return 'gcse-science-physics';
  if (prefix === '/gcse/science/biology') return 'gcse-science-biology';
  return 'cg2365';
}

export function getCurriculumScopeFromReferer(referer: string | null): CurriculumScope {
  if (!referer) return 'cg2365';

  try {
    const pathname = new URL(referer).pathname;
    const prefix = getCoursePrefixFromPathname(pathname);
    return getCurriculumScopeFromCoursePrefix(prefix);
  } catch {
    return 'cg2365';
  }
}

export function isUnitAllowedForScope(unitCode: string, scope: CurriculumScope): boolean {
  if (scope === 'cg2365') {
    return /^(201|202|203|204|210|305)\b/.test(unitCode);
  }

  if (scope === 'gcse-science-physics') return /^PHY-/i.test(unitCode);
  return /^BIO-/i.test(unitCode);
}

export function isLessonIdAllowedForScope(lessonId: string, scope: CurriculumScope): boolean {
  if (scope === 'gcse-science-physics') {
    return /^PHY-/i.test(lessonId);
  }
  if (scope === 'gcse-science-biology') {
    return /^BIO-/i.test(lessonId);
  }
  return /^(201|202|203|204|210|305)-/i.test(lessonId);
}
