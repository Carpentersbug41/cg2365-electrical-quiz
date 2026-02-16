import { NextRequest, NextResponse } from 'next/server';
import { runM6GenerateLesson } from '@/lib/module_planner';
import { guardModulePlannerAccess, toErrorResponse } from '../../../../_utils';

interface Params {
  params: Promise<{ id: string; blueprintId: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id, blueprintId } = await context.params;
    const url = new URL(request.url);
    const result = await runM6GenerateLesson(id, blueprintId, { apiBaseUrl: url.origin });
    return NextResponse.json({
      success: true,
      runId: id,
      blueprintId,
      ...result,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
