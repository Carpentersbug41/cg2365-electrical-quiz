/**
 * Lessons Status API Route
 * Returns quiz coverage status for all lessons
 */

import { NextResponse } from 'next/server';
import { getAllLessonQuizStatuses, getQuizCoverageStats } from '@/lib/generation/lessonDetector';

export async function GET() {
  try {
    const lessons = getAllLessonQuizStatuses();
    const stats = getQuizCoverageStats();

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
