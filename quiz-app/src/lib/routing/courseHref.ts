export const COURSE_PREFIX = '/2365';

export function courseHref(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`[courseHref] Expected absolute path starting with "/": ${path}`);
  }

  if (path === '/') return COURSE_PREFIX;
  return `${COURSE_PREFIX}${path}`;
}

