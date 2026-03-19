import { NextRequest, NextResponse } from 'next/server';
import { writeV2CanonicalEvent } from '@/lib/v2/events';
import { requireV2EnrolledSession } from '@/lib/v2/session';

type CompletePayload = {
  reviewItemId?: string;
  correct?: boolean;
};

export async function POST(request: NextRequest) {
  const { session, response } = await requireV2EnrolledSession(request);
  if (!session) return response!;

  let body: CompletePayload;
  try {
    body = (await request.json()) as CompletePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const reviewItemId = typeof body.reviewItemId === 'string' ? body.reviewItemId.trim() : '';
  const correct = body.correct !== false;
  if (!reviewItemId) {
    return NextResponse.json({ error: 'reviewItemId is required' }, { status: 400 });
  }

  const client = session.client;
  const userId = session.user.id;
  const nowIso = new Date().toISOString();

  const { data: existing, error: fetchError } = await client
    .from('v2_review_items')
    .select('id, lesson_id, times_wrong, times_right, question_stable_id')
    .eq('id', reviewItemId)
    .eq('user_id', userId)
    .maybeSingle<{ id: string; lesson_id: string | null; times_wrong: number; times_right: number; question_stable_id: string }>();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Review item not found' }, { status: 404 });

  const updatePayload = correct
    ? {
        status: 'resolved',
        times_right: (existing.times_right ?? 0) + 1,
        resolved_at: nowIso,
        due_at: nowIso,
      }
    : {
        status: 'due',
        times_wrong: (existing.times_wrong ?? 0) + 1,
        resolved_at: null,
        due_at: nowIso,
      };

  const { error: updateError } = await client
    .from('v2_review_items')
    .update(updatePayload)
    .eq('id', reviewItemId)
    .eq('user_id', userId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const { error: eventError } = await client.from('v2_review_events').insert({
    review_item_id: reviewItemId,
    user_id: userId,
    event_type: correct ? 'resolved' : 'due',
    payload: { questionStableId: existing.question_stable_id, sourceContext: 'v2_review_page' },
  });
  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 500 });
  }

  let questionId: string | null = null;
  let questionVersionId: string | null = null;
  try {
    const { data: questionRow, error: questionError } = await client
      .from('v2_questions')
      .select('id')
      .eq('stable_key', existing.question_stable_id)
      .limit(1)
      .maybeSingle<{ id: string }>();
    if (questionError) throw questionError;
    questionId = questionRow?.id ?? null;

    if (questionId) {
      const { data: versionRow, error: versionError } = await client
        .from('v2_question_versions')
        .select('id')
        .eq('question_id', questionId)
        .eq('status', 'published')
        .eq('is_current', true)
        .limit(1)
        .maybeSingle<{ id: string }>();
      if (versionError) throw versionError;
      questionVersionId = versionRow?.id ?? null;
    }

    await writeV2CanonicalEvent(client, {
      eventType: 'review_item_completed',
      userId,
      lessonId: existing.lesson_id,
      questionId,
      questionVersionId,
      sourceContext: 'v2_review_page',
      payload: {
        reviewItemId,
        questionStableId: existing.question_stable_id,
        correct,
      },
    });
    await writeV2CanonicalEvent(client, {
      eventType: correct ? 'review_item_resolved' : 'review_item_due',
      userId,
      lessonId: existing.lesson_id,
      questionId,
      questionVersionId,
      sourceContext: 'v2_review_page',
      payload: {
        reviewItemId,
        questionStableId: existing.question_stable_id,
      },
    });
  } catch (canonicalEventError) {
    return NextResponse.json(
      { error: canonicalEventError instanceof Error ? canonicalEventError.message : 'Failed to write review events.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
