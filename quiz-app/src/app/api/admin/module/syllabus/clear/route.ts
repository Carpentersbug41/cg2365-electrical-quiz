import { NextRequest, NextResponse } from 'next/server';
import { getModulePlannerScope, guardModulePlannerAccess, isSyllabusVersionInScope } from '../../_utils';
import { listSyllabusVersions } from '@/lib/module_planner/syllabus';
import { deleteModuleRunsBySyllabusVersionIds, deleteSyllabusVersionsByIds } from '@/lib/module_planner/db';

export async function POST(request: NextRequest) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const scope = getModulePlannerScope(request);
    const versions = await listSyllabusVersions();
    const scopedVersionIds = versions
      .filter((version) => isSyllabusVersionInScope(version, scope))
      .map((version) => version.id);

    if (scopedVersionIds.length === 0) {
      return NextResponse.json({
        success: true,
        deletedVersions: 0,
        message: 'No syllabus versions found for current curriculum scope.',
      });
    }

    await deleteModuleRunsBySyllabusVersionIds(scopedVersionIds);
    await deleteSyllabusVersionsByIds(scopedVersionIds);

    return NextResponse.json({
      success: true,
      deletedVersions: scopedVersionIds.length,
      message: `Deleted ${scopedVersionIds.length} syllabus version(s) for current curriculum scope.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to clear syllabus versions.',
      },
      { status: 500 }
    );
  }
}
