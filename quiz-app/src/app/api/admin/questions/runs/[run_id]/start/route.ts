import { NextRequest, NextResponse } from 'next/server';
import { executeQuestionRun } from '@/lib/questions/generation/orchestrator';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../../_utils';

interface Params {
  params: Promise<{ run_id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { run_id } = await context.params;
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
