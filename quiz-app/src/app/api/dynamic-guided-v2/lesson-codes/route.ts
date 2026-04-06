import { NextResponse } from 'next/server';
import { listDynamicGeneratedLessonArtifacts } from '@/lib/dynamicGuidedV2/generatedLessonArtifactStore';
import { listDynamicLessonVersions } from '@/lib/dynamicGuidedV2/versionStore';

export async function GET() {
  try {
    const versionRows = await listDynamicLessonVersions();
    const artifactRows = listDynamicGeneratedLessonArtifacts();

    const merged = new Map<string, { code: string; label: string }>();

    for (const row of artifactRows) {
      merged.set(row.lessonCode, {
        code: row.lessonCode,
        label: row.title ? `${row.lessonCode} ${row.title}` : row.lessonCode,
      });
    }

    for (const row of versionRows) {
      if (!merged.has(row.lessonCode)) {
        merged.set(row.lessonCode, {
          code: row.lessonCode,
          label: `${row.lessonCode} ${row.title}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      lessons: Array.from(merged.values()).sort((a, b) => a.code.localeCompare(b.code)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load lesson codes.',
      },
      { status: 500 }
    );
  }
}
