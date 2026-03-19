import { NextRequest, NextResponse } from 'next/server';
import {
  createV2PlannerRun,
  getLatestV2SyllabusIngestion,
  getV2SyllabusStructureByVersionAndUnit,
  listV2ModulePlannerRuns,
  listV2ModulePlannerUnitLos,
  listV2ModulePlannerUnits,
  listV2SyllabusVersions,
} from '@/lib/v2/modulePlanner/service';
import {
  getV2ModulePlannerScope,
  guardV2ModulePlannerAccess,
  isSyllabusVersionInScope,
  toV2ModulePlannerError,
} from '../_utils';

export async function GET(request: NextRequest) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const scope = getV2ModulePlannerScope(request);
    const versions = (await listV2SyllabusVersions()).filter((version) => isSyllabusVersionInScope(version, scope));
    const requestedVersionId = request.nextUrl.searchParams.get('syllabusVersionId')?.trim() ?? '';
    const selectedVersionId =
      (requestedVersionId && versions.some((version) => version.id === requestedVersionId)
        ? requestedVersionId
        : versions[0]?.id) || '';

    const units = selectedVersionId ? await listV2ModulePlannerUnits(selectedVersionId) : [];
    const requestedUnit = request.nextUrl.searchParams.get('unit')?.trim() ?? '';
    const resolvedUnit = requestedUnit && units.includes(requestedUnit) ? requestedUnit : (units[0] ?? '');
    const unitLos = selectedVersionId && resolvedUnit ? await listV2ModulePlannerUnitLos(selectedVersionId, resolvedUnit) : [];
    const structure =
      selectedVersionId && resolvedUnit
        ? await getV2SyllabusStructureByVersionAndUnit(selectedVersionId, resolvedUnit)
        : null;
    const latestIngestion = await getLatestV2SyllabusIngestion();
    const allowedVersionIds = new Set(versions.map((version) => version.id));
    const recentRuns = (await listV2ModulePlannerRuns(100)).filter((run) => allowedVersionIds.has(run.syllabus_version_id));

    return NextResponse.json({
      success: true,
      units,
      unitLos,
      unitStructure: structure?.structure_json ?? null,
      resolvedUnit,
      syllabusVersions: versions,
      defaultSyllabusVersionId: selectedVersionId,
      latestIngestion,
      recentRuns: recentRuns.map((run) => ({
        id: run.id,
        unit: run.unit,
        status: run.status,
        created_at: run.created_at,
        syllabus_version_id: run.syllabus_version_id,
      })),
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const scope = getV2ModulePlannerScope(request);
    const body = (await request.json()) as { syllabusVersionId?: string; unit?: string; chatTranscript?: string };
    if (!body.unit || !body.syllabusVersionId) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'syllabusVersionId and unit are required' },
        { status: 400 }
      );
    }

    const versions = (await listV2SyllabusVersions()).filter((version) => isSyllabusVersionInScope(version, scope));
    const allowedVersionIds = new Set(versions.map((version) => version.id));
    if (!allowedVersionIds.has(body.syllabusVersionId)) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'syllabusVersionId is not in current curriculum scope' },
        { status: 400 }
      );
    }

    const run = await createV2PlannerRun({
      syllabusVersionId: body.syllabusVersionId,
      unit: body.unit,
      chatTranscript: body.chatTranscript ?? '',
    });
    return NextResponse.json({ success: true, run });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
