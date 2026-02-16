import { NextRequest, NextResponse } from 'next/server';
import { runM6Generate } from '@/lib/module_planner';
import { guardModulePlannerAccess, toErrorResponse } from '../../_utils';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  return NextResponse.json(
    {
      success: false,
      code: 'FORBIDDEN',
      message: 'Bulk generation is disabled. Run planner stages through M5, then generate lessons one at a time from the lesson matrix.',
    },
    { status: 403 }
  );

  // Keep params/context in signature for route compatibility.
  void context;
  void runM6Generate;
  void toErrorResponse;
}
