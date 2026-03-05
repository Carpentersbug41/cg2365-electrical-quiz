import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import {
  deleteStudentQuizSet,
  getStudentQuizSet,
  updateStudentQuizSet,
  UpsertStudentQuizSetInput,
} from '@/lib/quizSets/repo';

interface Params {
  params: Promise<{ setId: string }>;
}

function parsePatchBody(value: unknown): UpsertStudentQuizSetInput {
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

export async function GET(request: NextRequest, context: Params) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  try {
    const { setId } = await context.params;
    const set = await getStudentQuizSet(session.client, session.user.id, setId);
    if (!set) {
      return NextResponse.json({ error: 'Quiz set not found.' }, { status: 404 });
    }
    return NextResponse.json({ set });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch quiz set.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Params) {
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
    const { setId } = await context.params;
    const input = parsePatchBody(body);
    const set = await updateStudentQuizSet(session.client, session.user.id, setId, input);
    return NextResponse.json({ set });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update quiz set.';
    const status = message.toLowerCase().includes('must be') || message.toLowerCase().includes('required') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  try {
    const { setId } = await context.params;
    await deleteStudentQuizSet(session.client, session.user.id, setId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete quiz set.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
