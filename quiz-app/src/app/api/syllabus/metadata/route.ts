import { NextResponse } from 'next/server';
import { listSyllabusVersions } from '@/lib/module_planner/syllabus';
import { listSyllabusStructuresByVersion } from '@/lib/module_planner/db';
import { getCurriculumScopeFromReferer } from '@/lib/routing/curriculumScope';

export async function GET(request: Request) {
  try {
    const scope = getCurriculumScopeFromReferer(request.headers.get('referer'));
    const versions = (await listSyllabusVersions()).filter((version) => {
      const tagged = version.meta_json && typeof version.meta_json === 'object'
        ? (version.meta_json as Record<string, unknown>).curriculum
        : null;
      if (scope === 'gcse-science-physics') return tagged === 'gcse-science-physics';
      if (scope === 'gcse-science-biology') return tagged === 'gcse-science-biology';
      return tagged === 'cg2365' || tagged == null;
    });
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
        .sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true })),
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
