import { getCoursePrefixForClient } from './curricula';

export function courseHref(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`[courseHref] Expected absolute path starting with "/": ${path}`);
  }

  if (typeof window === 'undefined') {
    return path;
  }

  const prefix = getCoursePrefixForClient();
  if (path === '/') return prefix;
  return `${prefix}${path}`;
}
