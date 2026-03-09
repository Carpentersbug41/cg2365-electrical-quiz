export type V2CurriculumScope = 'cg2365' | 'gcse-science-physics' | 'gcse-science-biology';

function getCoursePrefixFromPathname(pathname: string): string {
  if (pathname.startsWith('/gcse/science/biology')) return '/gcse/science/biology';
  if (pathname.startsWith('/gcse/science/physics')) return '/gcse/science/physics';
  return '/cg2365';
}

function getCoursePrefixFromHeader(value: string): string {
  if (value.startsWith('/gcse/science/biology')) return '/gcse/science/biology';
  if (value.startsWith('/gcse/science/physics')) return '/gcse/science/physics';
  return '/cg2365';
}

function getV2CurriculumScopeFromCoursePrefix(prefix: string): V2CurriculumScope {
  if (prefix === '/gcse/science/physics') return 'gcse-science-physics';
  if (prefix === '/gcse/science/biology') return 'gcse-science-biology';
  return 'cg2365';
}

function getV2CurriculumScopeFromHeaderOrReferer(
  coursePrefixHeader: string | null,
  referer: string | null
): V2CurriculumScope {
  if (coursePrefixHeader) {
    return getV2CurriculumScopeFromCoursePrefix(getCoursePrefixFromHeader(coursePrefixHeader));
  }

  if (!referer) return 'cg2365';
  try {
    const pathname = new URL(referer).pathname;
    return getV2CurriculumScopeFromCoursePrefix(getCoursePrefixFromPathname(pathname));
  } catch {
    return 'cg2365';
  }
}

export function isLessonIdAllowedForV2Scope(lessonId: string, scope: V2CurriculumScope): boolean {
  if (scope === 'gcse-science-physics') {
    return /^PHY-/i.test(lessonId);
  }
  if (scope === 'gcse-science-biology') {
    return /^BIO-/i.test(lessonId);
  }
  return /^(201|202|203|204|210|305)-/i.test(lessonId);
}

export function resolveV2CurriculumScope(request: Request): V2CurriculumScope {
  const url = new URL(request.url);
  const explicitScope = url.searchParams.get('scope');
  if (
    explicitScope === 'gcse-science-biology' ||
    explicitScope === 'gcse-science-physics' ||
    explicitScope === 'cg2365'
  ) {
    return explicitScope;
  }

  return getV2CurriculumScopeFromHeaderOrReferer(
    request.headers.get('x-course-prefix'),
    request.headers.get('referer')
  );
}
