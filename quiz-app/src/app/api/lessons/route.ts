/**
 * Lessons API Route
 * Returns list of all lessons with metadata
 */

import { NextResponse } from 'next/server';
import { lessonIndex } from '@/data/lessons/lessonIndex';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const allLessons = lessonIndex;
    const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
    const generationScores = new Map<string, number>();

    // Read score metadata from lesson JSON files, if present.
    if (fs.existsSync(lessonsDir)) {
      const files = fs.readdirSync(lessonsDir).filter((file) => file.endsWith('.json'));
      for (const file of files) {
        try {
          const filePath = path.join(lessonsDir, file);
          const raw = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(raw) as {
            id?: string;
            metadata?: { generationScore?: unknown };
          };
          if (parsed.id && typeof parsed.metadata?.generationScore === 'number') {
            generationScores.set(parsed.id, parsed.metadata.generationScore);
          }
        } catch (error) {
          console.warn(`[Lessons API] Could not parse lesson file ${file}:`, error);
        }
      }
    }

    const lessonsWithScores = allLessons.map((lesson) => ({
      ...lesson,
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
