import { NextRequest, NextResponse } from 'next/server';
import { executeQuestionRun } from '@/lib/questions/generation/orchestrator';
import { getQuestionRun } from '@/lib/questions/bankRepo';
import { assertUnitInQuestionScope, getQuestionAdminScope, guardQuestionAdminAccess, toQuestionAdminError } from '../../../_utils';

interface Params {
  params: Promise<{ run_id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { run_id } = await context.params;
    const run = await getQuestionRun(run_id);
    if (!run) {
      return NextResponse.json({ success: false, message: `Run not found: ${run_id}` }, { status: 404 });
    }
    const scope = getQuestionAdminScope(request);
    const deniedScope = assertUnitInQuestionScope(run.unit_code, scope);
    if (deniedScope) return NextResponse.json({ success: false, message: `Run not found: ${run_id}` }, { status: 404 });
    const result = await executeQuestionRun(run_id);
    return NextResponse.json({
      success: true,
      run: result.run,
      steps: result.steps,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
