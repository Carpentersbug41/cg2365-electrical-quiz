import { NextRequest, NextResponse } from 'next/server';
import { runM1Analyze } from '@/lib/module_planner';
import { guardModulePlannerAccess, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { replayFromArtifacts?: boolean };
    const result = await runM1Analyze(id, { replayFromArtifacts: body.replayFromArtifacts });
    return NextResponse.json({
      success: true,
      stage: result.stage,
      replayed: result.replayed,
      artifact: result.artifact,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
