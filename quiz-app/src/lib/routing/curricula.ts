export const DEFAULT_COURSE_PREFIX = '/2365';

export const SUPPORTED_COURSE_PREFIXES = [
  '/2365',
  '/gcse/science/physics',
] as const;

export type CoursePrefix = (typeof SUPPORTED_COURSE_PREFIXES)[number];

export function getCoursePrefixFromPathname(pathname: string): CoursePrefix {
  for (const prefix of SUPPORTED_COURSE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  return DEFAULT_COURSE_PREFIX;
}

export function getCoursePrefixForClient(): CoursePrefix {
  if (typeof window === 'undefined') {
    return DEFAULT_COURSE_PREFIX;
  }
  return getCoursePrefixFromPathname(window.location.pathname);
}

export function getCoursePrefixFromHeader(value: string | null): CoursePrefix {
  if (!value) return DEFAULT_COURSE_PREFIX;
  return getCoursePrefixFromPathname(value);
}
