import { getCurriculumScopeFromHeaderOrReferer, type CurriculumScope } from '@/lib/routing/curriculumScope';

export type V2CurriculumScope = CurriculumScope;

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

  return getCurriculumScopeFromHeaderOrReferer(
    request.headers.get('x-course-prefix'),
    request.headers.get('referer')
  );
}
