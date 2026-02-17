import { NextRequest, NextResponse } from 'next/server';
import { deletePlannerRun, getPlannerRunSummary, getReplayableArtifacts } from '@/lib/module_planner';
import { guardModulePlannerAccess, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(_request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const summary = await getPlannerRunSummary(id);
    return NextResponse.json({
      success: true,
      ...summary,
      replayable: await getReplayableArtifacts(id),
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
    await deletePlannerRun(id);
    return NextResponse.json({ success: true, deletedRunId: id });
  } catch (error) {
    return toErrorResponse(error);
  }
}
