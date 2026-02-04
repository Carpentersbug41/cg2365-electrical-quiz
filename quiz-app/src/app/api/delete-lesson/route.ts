/**
 * Delete Lesson API Route
 * Removes lesson and all its integrations from the codebase
 */

import { NextRequest, NextResponse } from 'next/server';
import { LessonDeleter } from '@/lib/generation/lessonDeleter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId } = body;

    // Validate input
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'lessonId is required and must be a string',
        },
        { status: 400 }
      );
    }

    console.log(`[DeleteLesson] Starting deletion for lesson: ${lessonId}`);

    // Initialize deleter
    const deleter = new LessonDeleter();

    // Auto-detect lesson files
    const deletionRequest = await deleter.detectLessonFiles(lessonId);
    
    if (!deletionRequest) {
      return NextResponse.json(
        {
          success: false,
          error: `Lesson file not found for ID: ${lessonId}`,
        },
        { status: 404 }
      );
    }

    console.log(`[DeleteLesson] Detected files:`, deletionRequest);

    // Execute deletion
    const result = await deleter.deleteLesson(deletionRequest);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deletion completed with errors',
          errors: result.errors,
          warnings: result.warnings,
          filesModified: result.filesModified,
          filesDeleted: result.filesDeleted,
        },
        { status: 500 }
      );
    }

    console.log(`[DeleteLesson] Deletion successful for ${lessonId}`);
    console.log(`[DeleteLesson] Files modified: ${result.filesModified.length}`);
    console.log(`[DeleteLesson] Files deleted: ${result.filesDeleted.length}`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted lesson ${lessonId}`,
      filesModified: result.filesModified,
      filesDeleted: result.filesDeleted,
      warnings: result.warnings,
    });

  } catch (error) {
    console.error('[DeleteLesson] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during deletion',
      },
      { status: 500 }
    );
  }
}
