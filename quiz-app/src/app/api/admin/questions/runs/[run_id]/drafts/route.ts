import { NextRequest, NextResponse } from 'next/server';
import { listRunDrafts } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../../_utils';

interface Params {
  params: Promise<{ run_id: string }>;
}

export async function GET(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { run_id } = await context.params;
    const drafts = await listRunDrafts(run_id);
    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
