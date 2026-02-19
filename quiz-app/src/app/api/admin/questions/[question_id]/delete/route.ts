import { NextRequest, NextResponse } from 'next/server';
import { createQuestionReview, deleteQuestionById, getQuestionById } from '@/lib/questions/bankRepo';
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

    await createQuestionReview({
      question_id,
      action: 'retire',
      before: before as unknown as Record<string, unknown>,
      after: { deleted: true, id: question_id },
      actor: null,
    });
    await deleteQuestionById(question_id);
    return NextResponse.json({ success: true, deleted_id: question_id });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
