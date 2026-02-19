import { NextRequest, NextResponse } from 'next/server';
import { createQuestionReview, getQuestionById, listApprovedQuestionsByScope, updateQuestionById } from '@/lib/questions/bankRepo';
import { findNearDuplicate, toSimilarityLike } from '@/lib/questions/similarity';
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
    if (before.status === 'approved') {
      return NextResponse.json({ success: true, question: before });
    }

    const approvedScope = await listApprovedQuestionsByScope({
      unit_code: before.unit_code,
      level: before.level,
      lo_codes: before.lo_code ? [before.lo_code] : undefined,
    });
    const approvedPool = approvedScope
      .filter((row) => row.id !== before.id)
      .map((row) => toSimilarityLike(row));
    const near = findNearDuplicate(toSimilarityLike(before), approvedPool);
    if (near) {
      return NextResponse.json(
        {
          success: false,
          code: 'NEAR_DUPLICATE',
          message: `Approval blocked: similar to approved question ${near.question.id ?? '(unknown)'} (similarity ${near.score.toFixed(2)}).`,
        },
        { status: 409 }
      );
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
