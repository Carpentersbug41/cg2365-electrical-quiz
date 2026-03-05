import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { createStudentQuizSet, listStudentQuizSets, UpsertStudentQuizSetInput } from '@/lib/quizSets/repo';

function parseCreateBody(value: unknown): UpsertStudentQuizSetInput {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid payload.');
  }
  const body = value as Record<string, unknown>;
  return {
    title: String(body.title ?? ''),
    unit_code: String(body.unit_code ?? ''),
    level: Number(body.level) as 2 | 3,
    question_count: Number(body.question_count),
    cadence_days: Number(body.cadence_days),
    lesson_ids: Array.isArray(body.lesson_ids) ? body.lesson_ids.map((item) => String(item)) : [],
    lo_codes: Array.isArray(body.lo_codes) ? body.lo_codes.map((item) => String(item)) : [],
    is_active: body.is_active === undefined ? true : Boolean(body.is_active),
  };
}

export async function GET(request: NextRequest) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  try {
    const sets = await listStudentQuizSets(session.client, session.user.id);
    return NextResponse.json({ sets });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list quiz sets.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const input = parseCreateBody(body);
    const set = await createStudentQuizSet(session.client, session.user.id, input);
    return NextResponse.json({ set }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create quiz set.';
    const status = message.toLowerCase().includes('must be') || message.toLowerCase().includes('required') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
