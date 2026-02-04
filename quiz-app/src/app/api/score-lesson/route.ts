/**
 * API Route: Score Lesson with Rubric
 * 
 * POST /api/score-lesson
 * Scores a lesson using the universal rubric (98/100 target)
 */

import { NextRequest, NextResponse } from 'next/server';
import { RubricScoringService } from '@/lib/generation/rubricScoringService';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Load lesson file
    const lessonPath = path.join(
      process.cwd(),
      'src',
      'data',
      'lessons',
      `${lessonId}.json`
    );

    if (!fs.existsSync(lessonPath)) {
      return NextResponse.json(
        { error: `Lesson file not found: ${lessonId}` },
        { status: 404 }
      );
    }

    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));

    // Score the lesson
    const scoringService = new RubricScoringService();
    const score = scoringService.scoreLesson(lessonData);

    return NextResponse.json({
      success: true,
      lessonId,
      score,
    });
  } catch (error: any) {
    console.error('[score-lesson] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to score lesson',
      },
      { status: 500 }
    );
  }
}
