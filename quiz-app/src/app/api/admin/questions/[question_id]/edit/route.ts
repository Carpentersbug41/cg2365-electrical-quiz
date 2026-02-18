import { NextRequest, NextResponse } from 'next/server';
import { computeQuestionHash } from '@/lib/questions/hash';
import { createQuestionReview, getQuestionById, updateQuestionById } from '@/lib/questions/bankRepo';
import { validateQuestionDraft } from '@/lib/questions/validation';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../_utils';

interface Params {
  params: Promise<{ question_id: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { question_id } = await context.params;
    const body = (await request.json()) as {
      stem?: string;
      options?: string[] | null;
      correct?: string | string[];
      rationale?: string | null;
      tags?: string[] | null;
      status?: 'draft' | 'approved';
      unit_code?: string;
      lo_code?: string | null;
      ac_code?: string | null;
      level?: 2 | 3;
      format?: 'mcq' | 'multi_select' | 'short_answer' | 'scenario' | 'ordering' | 'matching';
      difficulty?: 'easy' | 'med' | 'hard';
    };

    const before = await getQuestionById(question_id);
    if (!before) {
      return NextResponse.json({ success: false, message: `Question not found: ${question_id}` }, { status: 404 });
    }

    const next = {
      ...before,
      stem: body.stem ?? before.stem,
      options: body.options ?? before.options,
      correct: body.correct ?? before.correct,
      rationale: body.rationale ?? before.rationale,
      tags: body.tags ?? before.tags,
      status: body.status ?? before.status,
      unit_code: body.unit_code ?? before.unit_code,
      lo_code: body.lo_code ?? before.lo_code,
      ac_code: body.ac_code ?? before.ac_code,
      level: body.level ?? (before.level as 2 | 3),
      format: body.format ?? before.format,
      difficulty: body.difficulty ?? before.difficulty,
    };

    const nextHash = computeQuestionHash({
      stem: next.stem,
      options: next.options,
      correct: next.correct,
      unit_code: next.unit_code,
      lo_code: next.lo_code,
      ac_code: next.ac_code,
      format: next.format,
    });

    const validation = validateQuestionDraft({
      generation_run_id: next.generation_run_id,
      unit_code: next.unit_code,
      lo_code: next.lo_code,
      ac_code: next.ac_code,
      level: next.level as 2 | 3,
      difficulty: next.difficulty,
      format: next.format,
      stem: next.stem,
      options: next.options,
      correct: next.correct,
      rationale: next.rationale,
      tags: next.tags,
      source: next.source,
      status: next.status,
      hash: nextHash,
      version: before.version + 1,
      doc_ref: next.doc_ref,
    });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, code: 'VALIDATION_FAILED', reasons: validation.reasons },
        { status: 400 }
      );
    }

    const after = await updateQuestionById(question_id, {
      stem: next.stem,
      options: next.options,
      correct: next.correct,
      rationale: next.rationale,
      tags: next.tags,
      status: next.status,
      unit_code: next.unit_code,
      lo_code: next.lo_code,
      ac_code: next.ac_code,
      level: next.level,
      format: next.format,
      difficulty: next.difficulty,
      hash: nextHash,
      version: before.version + 1,
      approved_at: next.status === 'approved' ? new Date().toISOString() : null,
      approved_by: next.status === 'approved' ? null : null,
    });

    await createQuestionReview({
      question_id,
      action: 'edit',
      before: before as unknown as Record<string, unknown>,
      after: after as unknown as Record<string, unknown>,
      actor: null,
    });

    return NextResponse.json({ success: true, question: after });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
