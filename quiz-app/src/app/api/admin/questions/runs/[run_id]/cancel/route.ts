import { NextRequest, NextResponse } from 'next/server';
import { getQuestionRun, updateQuestionRun } from '@/lib/questions/bankRepo';
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

    if (run.status === 'completed' || run.status === 'failed') {
      return NextResponse.json(
        { success: false, message: `Run ${run_id} is already ${run.status} and cannot be cancelled.` },
        { status: 409 }
      );
    }

    if (run.status === 'cancelled') {
      return NextResponse.json({ success: true, run });
    }

    const updatedRun = await updateQuestionRun(run_id, { status: 'cancelled' });
    return NextResponse.json({ success: true, run: updatedRun });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
