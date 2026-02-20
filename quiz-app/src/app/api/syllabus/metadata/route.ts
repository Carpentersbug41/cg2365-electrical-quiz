import { NextResponse } from 'next/server';
import { listSyllabusVersions } from '@/lib/module_planner/syllabus';
import { listSyllabusStructuresByVersion } from '@/lib/module_planner/db';

export async function GET() {
  try {
    const versions = await listSyllabusVersions();
    const selectedVersionId = versions[0]?.id ?? '';
    const structures = selectedVersionId ? await listSyllabusStructuresByVersion(selectedVersionId) : [];

    return NextResponse.json({
      success: true,
      selectedVersionId,
      syllabusVersions: versions.map((version) => ({
        id: version.id,
        filename: version.filename,
        created_at: version.created_at,
      })),
      units: structures
        .map((row) => ({
          unit: row.unit,
          unitTitle: row.structure_json.unitTitle ?? `Unit ${row.unit}`,
          loCount: Array.isArray(row.structure_json.los) ? row.structure_json.los.length : 0,
        }))
        .sort((a, b) => Number(a.unit) - Number(b.unit)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load syllabus metadata',
      },
      { status: 500 }
    );
  }
}
