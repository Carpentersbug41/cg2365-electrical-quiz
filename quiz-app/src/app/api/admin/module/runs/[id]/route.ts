import { NextRequest, NextResponse } from 'next/server';
import { deletePlannerRun, getPlannerRunSummary, getReplayableArtifacts } from '@/lib/module_planner';
import { assertModuleRunInScope, guardModulePlannerAccess, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(_request);
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
    const deniedScope = await assertModuleRunInScope(_request, runId);
    if (deniedScope) return deniedScope;
    const summary = await getPlannerRunSummary(runId);
    return NextResponse.json({
      success: true,
      ...summary,
      replayable: await getReplayableArtifacts(runId),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(_request);
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
    const deniedScope = await assertModuleRunInScope(_request, runId);
    if (deniedScope) return deniedScope;
    await deletePlannerRun(runId);
    return NextResponse.json({ success: true, deletedRunId: runId });
  } catch (error) {
    return toErrorResponse(error);
  }
}
