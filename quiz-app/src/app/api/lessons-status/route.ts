/**
 * Lessons Status API Route
 * Returns quiz coverage status for all lessons
 */

import { NextResponse } from 'next/server';
import { getAllLessonQuizStatuses } from '@/lib/generation/lessonDetector';
import { getCurriculumScopeFromReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

export async function GET(request: Request) {
  try {
    const scope = getCurriculumScopeFromReferer(request.headers.get('referer'));
    const lessons = getAllLessonQuizStatuses().filter((lesson) =>
      isLessonIdAllowedForScope(lesson.lessonId, scope)
    );
    const stats = {
      total: lessons.length,
      complete: lessons.filter((s) => s.questionCount >= 50).length,
      partial: lessons.filter((s) => s.questionCount > 0 && s.questionCount < 50).length,
      missing: lessons.filter((s) => s.questionCount === 0).length,
      needsWork: lessons.filter((s) => s.questionCount < 30).length,
    };

    return NextResponse.json({
      success: true,
      lessons,
      stats,
    });
  } catch (error) {
    console.error('[LessonsStatus] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lessons: [],
        stats: {
          total: 0,
          complete: 0,
          partial: 0,
          missing: 0,
          needsWork: 0,
        },
      },
      { status: 500 }
    );
  }
}
