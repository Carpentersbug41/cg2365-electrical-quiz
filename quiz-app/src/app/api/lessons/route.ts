/**
 * Lessons API Route
 * Returns list of all lessons with metadata
 */

import { NextResponse } from 'next/server';
import { lessonIndex, getLessonsByUnit } from '@/data/lessons/lessonIndex';

export async function GET() {
  try {
    const allLessons = lessonIndex;
    const byUnit = getLessonsByUnit();

    return NextResponse.json({
      success: true,
      lessons: allLessons,
      byUnit,
      total: allLessons.length,
    });
  } catch (error) {
    console.error('[Lessons API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lessons: [],
        byUnit: {},
        total: 0,
      },
      { status: 500 }
    );
  }
}
