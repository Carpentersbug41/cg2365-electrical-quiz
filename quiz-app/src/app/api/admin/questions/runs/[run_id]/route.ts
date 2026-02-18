import { NextRequest, NextResponse } from 'next/server';
import { getQuestionRun, listRunDrafts, listRunSteps } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../_utils';

interface Params {
  params: Promise<{ run_id: string }>;
}

export async function GET(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { run_id } = await context.params;
    const run = await getQuestionRun(run_id);
    if (!run) {
      return NextResponse.json({ success: false, message: `Run not found: ${run_id}` }, { status: 404 });
    }
    const [steps, drafts] = await Promise.all([listRunSteps(run_id), listRunDrafts(run_id)]);
    return NextResponse.json({
      success: true,
      run,
      steps,
      draft_count: drafts.length,
      summary: run.summary,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
