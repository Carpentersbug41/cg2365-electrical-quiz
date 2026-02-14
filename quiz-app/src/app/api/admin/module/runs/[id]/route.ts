import { NextRequest, NextResponse } from 'next/server';
import { getPlannerRunSummary, getReplayableArtifacts } from '@/lib/module_planner';
import { guardModulePlannerEnabled, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  const disabled = guardModulePlannerEnabled();
  if (disabled) return disabled;

  try {
    const { id } = await context.params;
    const summary = getPlannerRunSummary(id);
    return NextResponse.json({
      success: true,
      ...summary,
      replayable: getReplayableArtifacts(id),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

