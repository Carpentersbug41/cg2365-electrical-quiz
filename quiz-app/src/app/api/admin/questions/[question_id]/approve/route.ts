import { NextRequest, NextResponse } from 'next/server';
import { createQuestionReview, getQuestionById, updateQuestionById } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../_utils';

interface Params {
  params: Promise<{ question_id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { question_id } = await context.params;
    const before = await getQuestionById(question_id);
    if (!before) {
      return NextResponse.json({ success: false, message: `Question not found: ${question_id}` }, { status: 404 });
    }
    const after = await updateQuestionById(question_id, {
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: null,
    });
    await createQuestionReview({
      question_id,
      action: 'approve',
      before: before as unknown as Record<string, unknown>,
      after: after as unknown as Record<string, unknown>,
      actor: null,
    });
    return NextResponse.json({ success: true, question: after });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
