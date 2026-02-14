import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { AttemptPayload } from '@/lib/authProgress/types';
import { normalizeQuestionStableId } from '@/lib/authProgress/questionIdentity';
import { updateLessonProgressFromAttempt } from '@/lib/authProgress/serverProgress';

const VALID_QUESTION_TYPES = new Set(['mcq', 'short', 'numeric', 'other']);
const VALID_AC_SOURCES = new Set(['question', 'block', 'lesson', 'none']);
const VALID_GRADING_MODES = new Set(['deterministic', 'llm']);

function validateAttemptPayload(payload: unknown): payload is AttemptPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const data = payload as Record<string, unknown>;
  return (
    typeof data.question_stable_id === 'string' &&
    data.question_stable_id.trim().length > 0 &&
    typeof data.question_type === 'string' &&
    VALID_QUESTION_TYPES.has(data.question_type) &&
    typeof data.correct === 'boolean' &&
    typeof data.grading_mode === 'string' &&
    VALID_GRADING_MODES.has(data.grading_mode)
  );
}

export async function POST(request: NextRequest) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!validateAttemptPayload(body)) {
    return NextResponse.json({ error: 'Invalid attempt payload' }, { status: 400 });
  }

  const payload = body as AttemptPayload;
  const acSource = payload.ac_source ?? 'none';
  if (!VALID_AC_SOURCES.has(acSource)) {
    return NextResponse.json({ error: 'Invalid ac_source' }, { status: 400 });
  }

  const insertRow = {
    user_id: session.user.id,
    lesson_id: payload.lesson_id ?? null,
    block_id: payload.block_id ?? null,
    question_stable_id: normalizeQuestionStableId(payload.question_stable_id),
    question_type: payload.question_type,
    correct: payload.correct,
    score: payload.score ?? null,
    user_answer: payload.user_answer ?? null,
    attempt_number: payload.attempt_number ?? 1,
    response_time_ms: payload.response_time_ms ?? null,
    ac_key: payload.ac_key ?? null,
    ac_source: acSource,
    grading_mode: payload.grading_mode,
  };

  const { data, error } = await session.client
    .from('question_attempts')
    .insert(insertRow)
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await updateLessonProgressFromAttempt(session.client, session.user.id, payload);
  } catch (progressError) {
    console.warn('Failed to update lesson progress from attempt:', progressError);
  }

  return NextResponse.json({ ok: true, id: data.id });
}

