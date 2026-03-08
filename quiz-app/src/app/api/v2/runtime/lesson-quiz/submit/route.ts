import { NextRequest, NextResponse } from 'next/server';
import { requireSupabaseSession } from '@/lib/authProgress/routeGuard';

type AttemptInput = {
  questionId?: string;
  questionStableId?: string | null;
  isCorrect?: boolean;
  selectedAnswer?: number | null;
  correctAnswer?: number;
};

type SubmitPayload = {
  lessonId?: string;
  attempts?: AttemptInput[];
  sourceContext?: string;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === '42P01';
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  let body: SubmitPayload;
  try {
    body = (await request.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const lessonCode = typeof body.lessonId === 'string' ? body.lessonId.trim() : '';
  const attempts = Array.isArray(body.attempts) ? body.attempts : [];
  const sourceContext =
    typeof body.sourceContext === 'string' && body.sourceContext.trim().length > 0
      ? body.sourceContext.trim()
      : 'lesson_quiz';

  if (!lessonCode) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }
  if (attempts.length === 0) {
    return NextResponse.json({ error: 'attempts must contain at least one item' }, { status: 400 });
  }

  const normalizedAttempts = attempts.map((attempt, index) => {
    const stable =
      typeof attempt.questionStableId === 'string' && attempt.questionStableId.trim().length > 0
        ? attempt.questionStableId.trim()
        : typeof attempt.questionId === 'string' && attempt.questionId.trim().length > 0
          ? attempt.questionId.trim()
          : `q-${index + 1}`;
    const isCorrect = Boolean(attempt.isCorrect);
    return {
      question_stable_id: stable,
      attempt_no: 1,
      is_correct: isCorrect,
      score: isCorrect ? 1 : 0,
      max_score: 1,
      response_json: {
        selectedAnswer: attempt.selectedAnswer ?? null,
        correctAnswer: attempt.correctAnswer ?? null,
      },
    };
  });

  const correctCount = normalizedAttempts.filter((attempt) => attempt.is_correct).length;
  const percentage = (correctCount / normalizedAttempts.length) * 100;
  const masteryAchieved = percentage >= 80;

  const client = session.client;
  const userId = session.user.id;

  const { data: lessonRow, error: lessonError } = await client
    .from('v2_lessons')
    .select('id')
    .eq('code', lessonCode)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (lessonError) {
    if (isMissingTableError(lessonError)) {
      return NextResponse.json({ error: 'V2 runtime tables are not available yet.' }, { status: 503 });
    }
    return NextResponse.json({ error: lessonError.message }, { status: 500 });
  }
  if (!lessonRow?.id) {
    return NextResponse.json({ error: 'Published lesson not found in V2.' }, { status: 404 });
  }

  const lessonId = lessonRow.id;
  const nowIso = new Date().toISOString();

  const { data: lessonVersionRow, error: lessonVersionError } = await client
    .from('v2_lesson_versions')
    .select('id')
    .eq('lesson_id', lessonId)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (lessonVersionError) {
    if (isMissingTableError(lessonVersionError)) {
      return NextResponse.json({ error: 'V2 runtime tables are not available yet.' }, { status: 503 });
    }
    return NextResponse.json({ error: lessonVersionError.message }, { status: 500 });
  }
  if (!lessonVersionRow?.id) {
    return NextResponse.json({ error: 'Published lesson version not found.' }, { status: 404 });
  }

  const lessonVersionId = lessonVersionRow.id;

  const { data: lessonSessionRow, error: lessonSessionError } = await client
    .from('v2_lesson_sessions')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      status: 'completed',
      completed_at: nowIso,
    })
    .select('id')
    .single<{ id: string }>();

  if (lessonSessionError) {
    return NextResponse.json({ error: lessonSessionError.message }, { status: 500 });
  }

  const { data: quizSessionRow, error: quizSessionError } = await client
    .from('v2_quiz_sessions')
    .insert({
      user_id: userId,
      lesson_session_id: lessonSessionRow.id,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      source_context: sourceContext,
      submitted_at: nowIso,
      score_percent: percentage,
    })
    .select('id')
    .single<{ id: string }>();

  if (quizSessionError) {
    return NextResponse.json({ error: quizSessionError.message }, { status: 500 });
  }

  const quizSessionId = quizSessionRow.id;

  const attemptsToInsert = normalizedAttempts.map((attempt) => ({
    ...attempt,
    quiz_session_id: quizSessionId,
    user_id: userId,
    lesson_id: lessonId,
  }));

  const { error: attemptsError } = await client.from('v2_attempts').insert(attemptsToInsert);
  if (attemptsError) {
    return NextResponse.json({ error: attemptsError.message }, { status: 500 });
  }

  for (const attempt of normalizedAttempts) {
    const { data: existingReview, error: reviewFetchError } = await client
      .from('v2_review_items')
      .select('id, times_wrong, times_right, status')
      .eq('user_id', userId)
      .eq('question_stable_id', attempt.question_stable_id)
      .maybeSingle<{ id: string; times_wrong: number; times_right: number; status: 'due' | 'completed' | 'resolved' }>();
    if (reviewFetchError && !isMissingTableError(reviewFetchError)) {
      return NextResponse.json({ error: reviewFetchError.message }, { status: 500 });
    }

    if (!attempt.is_correct) {
      if (existingReview?.id) {
        const { data: updatedReview, error: updateReviewError } = await client
          .from('v2_review_items')
          .update({
            status: 'due',
            times_wrong: (existingReview.times_wrong ?? 0) + 1,
            due_at: nowIso,
            resolved_at: null,
            notes: { reason: 'wrong_answer' },
          })
          .eq('id', existingReview.id)
          .select('id')
          .single<{ id: string }>();
        if (updateReviewError) return NextResponse.json({ error: updateReviewError.message }, { status: 500 });
        await client.from('v2_review_events').insert({
          review_item_id: updatedReview.id,
          user_id: userId,
          event_type: 'due',
          payload: { questionStableId: attempt.question_stable_id, sourceContext: sourceContext },
        });
      } else {
        const { data: insertedReview, error: insertReviewError } = await client
          .from('v2_review_items')
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            question_stable_id: attempt.question_stable_id,
            status: 'due',
            due_at: nowIso,
            times_wrong: 1,
            times_right: 0,
            notes: { reason: 'wrong_answer' },
          })
          .select('id')
          .single<{ id: string }>();
        if (insertReviewError) return NextResponse.json({ error: insertReviewError.message }, { status: 500 });
        await client.from('v2_review_events').insert({
          review_item_id: insertedReview.id,
          user_id: userId,
          event_type: 'due',
          payload: { questionStableId: attempt.question_stable_id, sourceContext: sourceContext },
        });
      }
      continue;
    }

    if (existingReview?.id) {
      const { data: resolvedReview, error: resolveReviewError } = await client
        .from('v2_review_items')
        .update({
          status: 'resolved',
          times_right: (existingReview.times_right ?? 0) + 1,
          due_at: nowIso,
          resolved_at: nowIso,
        })
        .eq('id', existingReview.id)
        .select('id')
        .single<{ id: string }>();
      if (resolveReviewError) return NextResponse.json({ error: resolveReviewError.message }, { status: 500 });
      await client.from('v2_review_events').insert({
        review_item_id: resolvedReview.id,
        user_id: userId,
        event_type: 'resolved',
        payload: { questionStableId: attempt.question_stable_id, sourceContext: sourceContext },
      });
    }
  }

  const { data: masteryExisting, error: masteryFetchError } = await client
    .from('v2_mastery_records')
    .select('id, best_score_percent, attempts_count, first_attempt_at, achieved_at')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .limit(1)
    .maybeSingle<{
      id: string;
      best_score_percent: number | null;
      attempts_count: number;
      first_attempt_at: string | null;
      achieved_at: string | null;
    }>();

  if (masteryFetchError) {
    return NextResponse.json({ error: masteryFetchError.message }, { status: 500 });
  }

  const previousBest = masteryExisting?.best_score_percent ?? 0;
  const bestScore = Math.max(previousBest, percentage);
  const attemptsCount = (masteryExisting?.attempts_count ?? 0) + 1;
  const firstAttemptAt = masteryExisting?.first_attempt_at ?? nowIso;
  const achievedAt =
    masteryExisting?.achieved_at ?? (masteryAchieved || bestScore >= 80 ? nowIso : null);

  const masteryPayload: Record<string, unknown> = {
    user_id: userId,
    lesson_id: lessonId,
    mastery_status: masteryAchieved || bestScore >= 80 ? 'achieved' : 'pending',
    best_score_percent: bestScore,
    attempts_count: attemptsCount,
    first_attempt_at: firstAttemptAt,
    last_attempt_at: nowIso,
    achieved_at: achievedAt,
  };
  if (masteryExisting?.id) {
    masteryPayload.id = masteryExisting.id;
  }

  const { error: masteryUpsertError } = await client
    .from('v2_mastery_records')
    .upsert(masteryPayload, { onConflict: 'user_id,lesson_id' });

  if (masteryUpsertError) {
    return NextResponse.json({ error: masteryUpsertError.message }, { status: 500 });
  }

  const eventRows = [
    ...normalizedAttempts.map((attempt) => ({
      event_type: 'question_attempted',
      user_id: userId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      session_id: quizSessionId,
      source_context: sourceContext,
      payload: {
        questionStableId: attempt.question_stable_id,
        isCorrect: attempt.is_correct,
        score: attempt.score,
      },
    })),
    {
      event_type: 'quiz_submitted',
      user_id: userId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      session_id: quizSessionId,
      source_context: sourceContext,
      payload: {
        attemptsCount: normalizedAttempts.length,
        correctCount,
        percentage,
      },
    },
    {
      event_type: 'lesson_completed',
      user_id: userId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      session_id: quizSessionId,
      source_context: sourceContext,
      payload: {
        percentage,
        masteryAchieved: masteryAchieved || bestScore >= 80,
      },
    },
  ];

  const { error: eventError } = await client.from('v2_event_log').insert(eventRows);
  if (eventError && !isMissingTableError(eventError)) {
    console.warn('[V2 lesson-quiz submit] Event insert failed:', eventError);
  }

  return NextResponse.json({
    ok: true,
    quizSessionId,
    lessonCode,
    percentage,
    correctCount,
    attemptsCount: normalizedAttempts.length,
    masteryAchieved: masteryAchieved || bestScore >= 80,
  });
}
