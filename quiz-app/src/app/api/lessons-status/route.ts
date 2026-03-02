/**
 * Lessons Status API Route
 * Returns quiz coverage status for all lessons
 */

import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { getAllLessonQuizStatuses } from '@/lib/generation/lessonDetector';
import { Lesson } from '@/lib/generation/types';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

type ExplanationSummary = {
  id: string;
  title: string;
  order: number;
  linkedDiagramId: string | null;
  linkedDiagramEmbedUrl: string | null;
};

function extractRepoFromEmbedUrl(embedUrl: unknown): string | null {
  if (typeof embedUrl !== 'string') return null;
  const normalized = embedUrl.trim();
  const match = normalized.match(/^\/simulations\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

function getSimulationInfoFromLessonFile(
  lessonFilePath?: string
): {
  simulationEmbedUrl: string | null;
  simulationRepoName: string | null;
  explanations: ExplanationSummary[];
} {
  if (!lessonFilePath) {
    return {
      simulationEmbedUrl: null,
      simulationRepoName: null,
      explanations: [],
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

    const explanationBlocks = (lesson.blocks ?? []).filter(
      (block) => block.type === 'explanation' && typeof block.id === 'string'
    );

    const diagramBlocks = (lesson.blocks ?? []).filter(
      (block) =>
        block.type === 'diagram' &&
        typeof block.id === 'string' &&
        typeof block.content === 'object' &&
        block.content !== null
    );

    const explanations: ExplanationSummary[] = explanationBlocks.map((explanation) => {
      const linkedDiagram = diagramBlocks.find((block) => {
        const content = block.content as Record<string, unknown>;
        return typeof content.linkedExplanationId === 'string' && content.linkedExplanationId === explanation.id;
      });

      const fallbackSingleDiagram =
        !linkedDiagram &&
        explanationBlocks.length === 1 &&
        diagramBlocks.length === 1 &&
        typeof (diagramBlocks[0].content as Record<string, unknown>).embedUrl === 'string'
          ? diagramBlocks[0]
          : null;
      const resolved = linkedDiagram ?? fallbackSingleDiagram;
      const explanationContent = explanation.content as Record<string, unknown> | undefined;
      const resolvedContent = resolved?.content as Record<string, unknown> | undefined;

      return {
        id: explanation.id,
        title:
          (typeof explanationContent?.title === 'string' && explanationContent.title.trim()) ||
          explanation.id,
        order: typeof explanation.order === 'number' ? explanation.order : 0,
        linkedDiagramId: resolved?.id ?? null,
        linkedDiagramEmbedUrl:
          resolved && typeof resolvedContent?.embedUrl === 'string'
            ? resolvedContent.embedUrl
            : null,
      };
    });

    return {
      simulationEmbedUrl: embedUrl,
      simulationRepoName: extractRepoFromEmbedUrl(embedUrl),
      explanations,
    };
  } catch {
    return {
      simulationEmbedUrl: null,
      simulationRepoName: null,
      explanations: [],
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
