/**
 * Lessons API Route
 * Returns list of all lessons with metadata
 */

import { NextResponse } from 'next/server';
import { lessonIndex } from '@/data/lessons/lessonIndex';
import { getLessonQuestionCount } from '@/lib/questions/questionFilter';
import { getCurriculumScopeFromReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';
import fs from 'fs';
import path from 'path';

function collectLessonJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectLessonJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function GET(request: Request) {
  try {
    const scope = getCurriculumScopeFromReferer(request.headers.get('referer'));
    const allLessons = lessonIndex.filter((lesson) => isLessonIdAllowedForScope(lesson.id, scope));
    const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
    const generationScores = new Map<string, number>();

    // Read score metadata from lesson JSON files, if present.
    if (fs.existsSync(lessonsDir)) {
      const files = collectLessonJsonFiles(lessonsDir);
      for (const filePath of files) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(raw) as {
            id?: string;
            metadata?: { generationScore?: unknown };
          };
          if (parsed.id && typeof parsed.metadata?.generationScore === 'number') {
            generationScores.set(parsed.id, parsed.metadata.generationScore);
          }
        } catch (error) {
          console.warn(`[Lessons API] Could not parse lesson file ${filePath}:`, error);
        }
      }
    }

    const lessonsWithScores = allLessons.map((lesson) => ({
      ...lesson,
      questionCount: getLessonQuestionCount(lesson.id),
      generationScore: generationScores.get(lesson.id) ?? null,
    }));
    const byUnit = lessonsWithScores.reduce<Record<string, typeof lessonsWithScores>>((acc, lesson) => {
      if (!acc[lesson.unitNumber]) {
        acc[lesson.unitNumber] = [];
      }
      acc[lesson.unitNumber].push(lesson);
      return acc;
    }, {});

    // Keep unit arrays stable by lesson order.
    Object.values(byUnit).forEach((unitLessons) => {
      unitLessons.sort((a, b) => a.order - b.order);
    });

    return NextResponse.json({
      success: true,
      lessons: lessonsWithScores,
      byUnit,
      total: lessonsWithScores.length,
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
