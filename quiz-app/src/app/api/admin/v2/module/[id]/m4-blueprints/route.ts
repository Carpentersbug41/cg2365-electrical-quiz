import { NextRequest, NextResponse } from 'next/server';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../_utils';
import { runV2M4Blueprints } from '@/lib/v2/modulePlanner/service';

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
    const body = (await request.json().catch(() => ({}))) as { replayFromArtifacts?: boolean };
    const result = await runV2M4Blueprints(id, { replayFromArtifacts: body.replayFromArtifacts });
    return NextResponse.json({ success: true, stage: result.stage, replayed: result.replayed, artifact: result.artifact });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
