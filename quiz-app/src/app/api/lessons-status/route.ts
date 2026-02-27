/**
 * Lessons Status API Route
 * Returns quiz coverage status for all lessons
 */

import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { getAllLessonQuizStatuses } from '@/lib/generation/lessonDetector';
import { Lesson } from '@/lib/generation/types';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

function extractRepoFromEmbedUrl(embedUrl: unknown): string | null {
  if (typeof embedUrl !== 'string') return null;
  const normalized = embedUrl.trim();
  const match = normalized.match(/^\/simulations\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

function getSimulationInfoFromLessonFile(lessonFilePath?: string): { simulationEmbedUrl: string | null; simulationRepoName: string | null } {
  if (!lessonFilePath) {
    return {
      simulationEmbedUrl: null,
      simulationRepoName: null,
    };
  }

  try {
    const lessonData = readFileSync(lessonFilePath, 'utf-8');
    const lesson = JSON.parse(lessonData) as Lesson;
    const diagramBlock = lesson.blocks?.find((block) => block.type === 'diagram');
    const embedUrl =
      diagramBlock &&
      typeof diagramBlock.content === 'object' &&
      diagramBlock.content !== null &&
      'embedUrl' in diagramBlock.content &&
      typeof diagramBlock.content.embedUrl === 'string'
        ? diagramBlock.content.embedUrl
        : null;

    return {
      simulationEmbedUrl: embedUrl,
      simulationRepoName: extractRepoFromEmbedUrl(embedUrl),
    };
  } catch {
    return {
      simulationEmbedUrl: null,
      simulationRepoName: null,
    };
  }
}

export async function GET(request: Request) {
  try {
    const scope = getCurriculumScopeFromHeaderOrReferer(
      request.headers.get('x-course-prefix'),
      request.headers.get('referer')
    );
    const lessons = getAllLessonQuizStatuses()
      .filter((lesson) => isLessonIdAllowedForScope(lesson.lessonId, scope))
      .map((lesson) => ({
        ...lesson,
        ...getSimulationInfoFromLessonFile(lesson.lessonFilePath),
      }));
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
