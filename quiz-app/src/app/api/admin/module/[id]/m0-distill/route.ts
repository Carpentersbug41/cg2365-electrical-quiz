import { NextRequest, NextResponse } from 'next/server';
import { DistillInput, runM0Distill } from '@/lib/module_planner';
import { guardModulePlannerEnabled, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const disabled = guardModulePlannerEnabled();
  if (disabled) return disabled;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as DistillInput & { replayFromArtifacts?: boolean };
    const result = runM0Distill(id, body, { replayFromArtifacts: body.replayFromArtifacts });
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

