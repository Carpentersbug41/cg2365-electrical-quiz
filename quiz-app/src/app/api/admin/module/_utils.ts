import { NextResponse } from 'next/server';
import { ModulePlannerError, isModulePlannerEnabled } from '@/lib/module_planner';

export function modulePlannerDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: 'MODULE_PLANNER_DISABLED',
      message: 'Module planner is disabled by MODULE_PLANNER_ENABLED.',
    },
    { status: 403 }
  );
}

export function guardModulePlannerEnabled(): NextResponse | null {
  if (!isModulePlannerEnabled()) {
    return modulePlannerDisabledResponse();
  }
  return null;
}

export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ModulePlannerError) {
    return NextResponse.json(
      {
        success: false,
        stage: error.stage,
        code: error.code,
        message: error.message,
        meta: error.meta ?? null,
      },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown module planner error',
    },
    { status: 500 }
  );
}

