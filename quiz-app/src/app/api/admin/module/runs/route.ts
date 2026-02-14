import { NextRequest, NextResponse } from 'next/server';
import { createPlannerRun, listModulePlannerUnits } from '@/lib/module_planner';
import { guardModulePlannerEnabled, toErrorResponse } from '../_utils';

export async function GET() {
  const disabled = guardModulePlannerEnabled();
  if (disabled) return disabled;

  return NextResponse.json({
    success: true,
    units: listModulePlannerUnits(),
  });
}

export async function POST(request: NextRequest) {
  const disabled = guardModulePlannerEnabled();
  if (disabled) return disabled;

  try {
    const body = (await request.json()) as { unit?: string; chatTranscript?: string };
    if (!body.unit) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'unit is required' },
        { status: 400 }
      );
    }
    const run = createPlannerRun({
      unit: body.unit,
      chatTranscript: body.chatTranscript ?? '',
    });
    return NextResponse.json({
      success: true,
      run,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

