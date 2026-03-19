import { NextRequest, NextResponse } from 'next/server';
import { guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { getDynamicModulePlannerRun } from '@/lib/dynamicGuidedV2/planner/store';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ runId: string }> }
) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const { runId } = await context.params;
    const result = await getDynamicModulePlannerRun(runId);
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_FOUND',
          message: `Dynamic module run not found: ${runId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      run: result.summary,
      blueprints: result.run.blueprints,
      phaseArtifacts: result.run.phaseArtifacts,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
