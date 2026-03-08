import { NextResponse } from 'next/server';
import { getCurriculumScopeFromHeaderOrReferer, type CurriculumScope } from '@/lib/routing/curriculumScope';
import { listV2PublishedLessons } from '@/lib/v2/publishedLessons';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const explicitScope = url.searchParams.get('scope');
    const scope: CurriculumScope =
      explicitScope === 'gcse-science-biology' ||
      explicitScope === 'gcse-science-physics' ||
      explicitScope === 'cg2365'
        ? (explicitScope as CurriculumScope)
        : getCurriculumScopeFromHeaderOrReferer(
            request.headers.get('x-course-prefix'),
            request.headers.get('referer')
          );

    const lessons = await listV2PublishedLessons(scope);
    return NextResponse.json({
      success: true,
      lessons,
      total: lessons.length,
      scope,
    });
  } catch (error) {
    console.error('[V2 Published Lessons API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lessons: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
