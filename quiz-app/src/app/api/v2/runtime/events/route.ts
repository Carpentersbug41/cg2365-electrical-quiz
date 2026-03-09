import { NextRequest, NextResponse } from 'next/server';
import { requireV2EnrolledSession } from '@/lib/v2/session';

type RuntimeEventPayload = {
  lessonId?: string;
  eventType?: 'lesson_started' | 'quiz_started';
  sourceContext?: string;
};

export async function POST(request: NextRequest) {
  const { session, response } = await requireV2EnrolledSession(request);
  if (!session) return response!;

  let body: RuntimeEventPayload;
  try {
    body = (await request.json()) as RuntimeEventPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const lessonCode = typeof body.lessonId === 'string' ? body.lessonId.trim() : '';
  const eventType = body.eventType;
  const sourceContext =
    typeof body.sourceContext === 'string' && body.sourceContext.trim().length > 0
      ? body.sourceContext.trim()
      : 'runtime';

  if (!lessonCode || (eventType !== 'lesson_started' && eventType !== 'quiz_started')) {
    return NextResponse.json({ error: 'lessonId and a valid eventType are required.' }, { status: 400 });
  }

  const client = session.client;
  const userId = session.user.id;

  const { data: lessonRow, error: lessonError } = await client
    .from('v2_lessons')
    .select('id')
    .eq('code', lessonCode)
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (lessonError) return NextResponse.json({ error: lessonError.message }, { status: 500 });
  if (!lessonRow?.id) return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });

  const { data: versionRow, error: versionError } = await client
    .from('v2_lesson_versions')
    .select('id')
    .eq('lesson_id', lessonRow.id)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (versionError) return NextResponse.json({ error: versionError.message }, { status: 500 });
  if (!versionRow?.id) return NextResponse.json({ error: 'Published lesson version not found.' }, { status: 404 });

  const { error: insertError } = await client.from('v2_event_log').insert({
    event_type: eventType,
    user_id: userId,
    lesson_id: lessonRow.id,
    lesson_version_id: versionRow.id,
    source_context: sourceContext,
    payload: {
      lessonCode,
    },
  });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
