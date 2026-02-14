import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { upsertLessonComplete } from '@/lib/authProgress/serverProgress';

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

  const payload = body as {
    lessonId?: string;
    score?: number;
    masteryAchieved?: boolean;
  };

  if (!payload.lessonId || typeof payload.lessonId !== 'string') {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  if (payload.score !== undefined && typeof payload.score !== 'number') {
    return NextResponse.json({ error: 'score must be a number when provided' }, { status: 400 });
  }

  if (
    payload.masteryAchieved !== undefined &&
    typeof payload.masteryAchieved !== 'boolean'
  ) {
    return NextResponse.json({ error: 'masteryAchieved must be a boolean when provided' }, { status: 400 });
  }

  try {
    await upsertLessonComplete(session.client, session.user.id, payload.lessonId, {
      score: payload.score,
      masteryAchieved: payload.masteryAchieved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to complete lesson progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

