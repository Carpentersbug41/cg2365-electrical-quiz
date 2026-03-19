import { NextRequest, NextResponse } from 'next/server';
import { getV2PublishedLessonRecordByCode } from '@/lib/v2/publishedLessons';
import { listV2PublishedQuizQuestions } from '@/lib/v2/questionBank';
import { startLessonSession, startQuizSession } from '@/lib/v2/runtimeSessions';
import { requireV2EnrolledSession } from '@/lib/v2/session';

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
      : 'quiz_page';

  const lessonRecord = await getV2PublishedLessonRecordByCode(lessonCode);
  if (!lessonRecord) {
    return NextResponse.json({ error: 'Published lesson not found in V2.' }, { status: 404 });
  }

  const questions = await listV2PublishedQuizQuestions(lessonRecord.lessonId);
  if (questions.length === 0) {
    return NextResponse.json(
      { error: 'This lesson has no published question-bank coverage yet.' },
      { status: 409 }
    );
  }

  const lessonSession = await startLessonSession({
    client: session.client,
    userId: session.user.id,
    lessonId: lessonRecord.lessonId,
    lessonVersionId: lessonRecord.lessonVersionId,
    sourceContext,
  });
  const quizSession = await startQuizSession({
    client: session.client,
    userId: session.user.id,
    lessonId: lessonRecord.lessonId,
    lessonVersionId: lessonRecord.lessonVersionId,
    lessonSessionId: lessonSession.lessonSessionId,
    sourceContext,
  });

  return NextResponse.json({
    success: true,
    lessonSessionId: lessonSession.lessonSessionId,
    quizSessionId: quizSession.quizSessionId,
    created: quizSession.created,
  });
}
