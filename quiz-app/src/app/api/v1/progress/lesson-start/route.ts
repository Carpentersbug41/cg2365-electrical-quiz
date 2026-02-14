import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { upsertLessonStart } from '@/lib/authProgress/serverProgress';

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

  const lessonId = (body as { lessonId?: string })?.lessonId;
  if (!lessonId || typeof lessonId !== 'string') {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  try {
    await upsertLessonStart(session.client, session.user.id, lessonId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lesson progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

