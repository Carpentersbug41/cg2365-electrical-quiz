import { NextRequest, NextResponse } from 'next/server';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../_utils';
import { deleteV2PlannerRun, getV2PlannerRunSummary, getV2ReplayableArtifacts } from '@/lib/v2/modulePlanner/service';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const runId = id.trim();
    if (!runId) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'Run id is required' },
        { status: 400 }
      );
    }
    const deniedScope = await assertV2ModuleRunInScope(request, runId);
    if (deniedScope) return deniedScope;
    const summary = await getV2PlannerRunSummary(runId);
    return NextResponse.json({
      success: true,
      ...summary,
      replayable: await getV2ReplayableArtifacts(runId),
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const runId = id.trim();
    if (!runId) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'Run id is required' },
        { status: 400 }
      );
    }
    const deniedScope = await assertV2ModuleRunInScope(request, runId);
    if (deniedScope) return deniedScope;
    await deleteV2PlannerRun(runId);
    return NextResponse.json({ success: true, deletedRunId: runId });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
