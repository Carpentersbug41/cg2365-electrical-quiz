import { NextRequest, NextResponse } from 'next/server';
import { runM6Generate } from '@/lib/module_planner';
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
    const url = new URL(request.url);
    const result = await runM6Generate(id, {
      replayFromArtifacts: body.replayFromArtifacts,
      apiBaseUrl: url.origin,
    });
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
