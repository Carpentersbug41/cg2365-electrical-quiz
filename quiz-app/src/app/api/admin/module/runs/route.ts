import { NextRequest, NextResponse } from 'next/server';
import { createPlannerRun, listModulePlannerUnitLos, listModulePlannerUnits } from '@/lib/module_planner';
import { guardModulePlannerAccess, toErrorResponse } from '../_utils';
import { listSyllabusVersions } from '@/lib/module_planner/syllabus';
import { getLatestSyllabusIngestion } from '@/lib/module_planner/db';

export async function GET(request: NextRequest) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const versions = await listSyllabusVersions();
    const requestedVersionId = request.nextUrl.searchParams.get('syllabusVersionId')?.trim() ?? '';
    const selectedVersionId =
      (requestedVersionId && versions.some((version) => version.id === requestedVersionId)
        ? requestedVersionId
        : versions[0]?.id) || '';

    const units = selectedVersionId ? await listModulePlannerUnits(selectedVersionId) : [];
    const requestedUnit = request.nextUrl.searchParams.get('unit')?.trim() ?? '';
    const resolvedUnit = requestedUnit && units.includes(requestedUnit) ? requestedUnit : (units[0] ?? '');
    const unitLos = selectedVersionId && resolvedUnit
      ? await listModulePlannerUnitLos(selectedVersionId, resolvedUnit)
      : [];
    const latestIngestion = await getLatestSyllabusIngestion();

    return NextResponse.json({
      success: true,
      units,
      unitLos,
      resolvedUnit,
      syllabusVersions: versions,
      defaultSyllabusVersionId: selectedVersionId,
      latestIngestion,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as { syllabusVersionId?: string; unit?: string; chatTranscript?: string };
    if (!body.unit || !body.syllabusVersionId) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'syllabusVersionId and unit are required' },
        { status: 400 }
      );
    }
    const run = await createPlannerRun({
      syllabusVersionId: body.syllabusVersionId,
      unit: body.unit,
      chatTranscript: body.chatTranscript ?? '',
    });
    return NextResponse.json({
      success: true,
      run,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
