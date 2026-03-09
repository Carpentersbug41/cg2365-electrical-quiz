import { NextResponse } from 'next/server';
import { listV2PublishedLessons } from '@/lib/v2/publishedLessons';
import { resolveV2CurriculumScope } from '@/lib/v2/scope';
import { requireV2EnrolledSession } from '@/lib/v2/session';

export async function GET(request: Request) {
  const { session, response } = await requireV2EnrolledSession(request);
  if (!session) return response!;

  try {
    const scope = resolveV2CurriculumScope(request);

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
