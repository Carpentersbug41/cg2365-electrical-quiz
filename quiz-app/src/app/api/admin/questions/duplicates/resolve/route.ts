import { NextRequest, NextResponse } from 'next/server';
import { createQuestionReview, getQuestionById, updateQuestionById } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../_utils';

export async function POST(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      cluster_ids?: string[];
      keep_id?: string;
      retire_all?: boolean;
    };
    const clusterIds = Array.isArray(body.cluster_ids)
      ? body.cluster_ids.map((value) => String(value).trim()).filter((value) => value.length > 0)
      : [];
    if (clusterIds.length < 2) {
      return NextResponse.json({ success: false, message: 'cluster_ids must include at least 2 question IDs.' }, { status: 400 });
    }

    const rows = (
      await Promise.all(clusterIds.map(async (id) => ({ id, question: await getQuestionById(id) })))
    ).filter((entry) => Boolean(entry.question && entry.question.status === 'approved')) as Array<{
      id: string;
      question: NonNullable<Awaited<ReturnType<typeof getQuestionById>>>;
    }>;

    if (rows.length < 2) {
      return NextResponse.json({ success: false, message: 'Need at least 2 approved questions to resolve a cluster.' }, { status: 400 });
    }

    const retireAll = Boolean(body.retire_all);
    const requestedKeep = String(body.keep_id ?? '').trim();
    const keepId = retireAll
      ? ''
      : requestedKeep && rows.some((row) => row.id === requestedKeep)
        ? requestedKeep
        : rows
            .slice()
            .sort((a, b) => a.question.created_at.localeCompare(b.question.created_at))[0].id;

    const retiredIds: string[] = [];
    for (const row of rows) {
      if (!retireAll && row.id === keepId) continue;
      const before = row.question as unknown as Record<string, unknown>;
      const after = await updateQuestionById(row.id, {
        status: 'retired',
        approved_at: null,
        approved_by: null,
      });
      await createQuestionReview({
        question_id: row.id,
        action: 'retire',
        before,
        after: after as unknown as Record<string, unknown>,
        actor: null,
      });
      retiredIds.push(row.id);
    }

    return NextResponse.json({
      success: true,
      keep_id: keepId || null,
      retired_ids: retiredIds,
      retired_count: retiredIds.length,
      retire_all: retireAll,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
