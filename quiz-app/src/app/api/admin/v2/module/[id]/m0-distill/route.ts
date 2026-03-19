import { NextRequest, NextResponse } from 'next/server';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../_utils';
import { DistillInput, runV2M0Distill } from '@/lib/v2/modulePlanner/service';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const deniedScope = await assertV2ModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;
    const body = (await request.json()) as DistillInput & { replayFromArtifacts?: boolean };
    const result = await runV2M0Distill(id, body, { replayFromArtifacts: body.replayFromArtifacts });
    return NextResponse.json({ success: true, stage: result.stage, replayed: result.replayed, artifact: result.artifact });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
