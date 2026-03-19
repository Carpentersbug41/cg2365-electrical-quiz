import { NextRequest, NextResponse } from 'next/server';
import { getV2PublishedLessonRecordByCode } from '@/lib/v2/publishedLessons';
import { requireV2EnrolledSession } from '@/lib/v2/session';
import { startLessonSession } from '@/lib/v2/runtimeSessions';

type StartPayload = {
  lessonId?: string;
  sourceContext?: string;
};

export async function POST(request: NextRequest) {
  const { session, response } = await requireV2EnrolledSession(request);
  if (!session) return response!;

  let body: StartPayload;
  try {
    body = (await request.json()) as StartPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const lessonCode = typeof body.lessonId === 'string' ? body.lessonId.trim() : '';
  if (!lessonCode) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  const sourceContext =
    typeof body.sourceContext === 'string' && body.sourceContext.trim().length > 0
      ? body.sourceContext.trim()
      : 'lesson_page';

  const lessonRecord = await getV2PublishedLessonRecordByCode(lessonCode);
  if (!lessonRecord) {
    return NextResponse.json({ error: 'Published lesson not found in V2.' }, { status: 404 });
  }

  const result = await startLessonSession({
    client: session.client,
    userId: session.user.id,
    lessonId: lessonRecord.lessonId,
    lessonVersionId: lessonRecord.lessonVersionId,
    sourceContext,
  });

  return NextResponse.json({
    success: true,
    lessonSessionId: result.lessonSessionId,
    created: result.created,
  });
}
