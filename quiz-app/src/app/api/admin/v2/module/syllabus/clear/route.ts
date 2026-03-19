import { NextRequest, NextResponse } from 'next/server';
import { getV2ModulePlannerScope, guardV2ModulePlannerAccess, isSyllabusVersionInScope } from '../../_utils';
import {
  deleteV2ModuleRunsBySyllabusVersionIds,
  deleteV2SyllabusVersionsByIds,
  listV2SyllabusVersions,
} from '@/lib/v2/modulePlanner/service';

export async function POST(request: NextRequest) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const scope = getV2ModulePlannerScope(request);
    const versions = await listV2SyllabusVersions();
    const scopedVersionIds = versions.filter((version) => isSyllabusVersionInScope(version, scope)).map((version) => version.id);

    if (scopedVersionIds.length === 0) {
      return NextResponse.json({
        success: true,
        deletedVersions: 0,
        message: 'No syllabus versions found for current curriculum scope.',
      });
    }

    await deleteV2ModuleRunsBySyllabusVersionIds(scopedVersionIds);
    await deleteV2SyllabusVersionsByIds(scopedVersionIds);

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
