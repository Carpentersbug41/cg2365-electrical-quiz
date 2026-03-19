import { NextRequest, NextResponse } from 'next/server';
import { assertGuidedChunkSessionAccess } from '@/lib/guidedChunk/auth';
import { loadGuidedChunkFrame } from '@/lib/guidedChunk/frameLoader';
import { evaluateChunkAnswer } from '@/lib/guidedChunk/evaluator';
import { applyChunkEvaluation, buildSessionPayload } from '@/lib/guidedChunk/runtime';
import { loadGuidedChunkSession, saveGuidedChunkSession } from '@/lib/guidedChunk/sessionStore';
import { syncGuidedChunkTelemetry } from '@/lib/guidedChunk/telemetry';
import { buildGuidedSubmitDebugSnapshot, logGuidedServerDebug } from '@/lib/guidedChunk/debug';

type SubmitTurnRequest = {
  sessionId?: string;
  answer?: string;
};

export async function POST(request: NextRequest) {
  let body: SubmitTurnRequest;

  try {
    body = (await request.json()) as SubmitTurnRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim() : '';

  if (!sessionId || !answer) {
    return NextResponse.json({ error: 'sessionId and answer are required.' }, { status: 400 });
  }

  const session = await loadGuidedChunkSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
  }

  const access = await assertGuidedChunkSessionAccess(request, session);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (session.step.kind !== 'question') {
    return NextResponse.json({ error: 'Session is not waiting for a learner answer.' }, { status: 400 });
  }

  const frame = await loadGuidedChunkFrame(session.lessonCode, {
    previewVersionId: session.lessonVersionId ?? null,
  });
  if (!frame) {
    return NextResponse.json({ error: 'Lesson frame not found.' }, { status: 404 });
  }

  const chunk = frame.loSequence[session.step.chunk.loIndex].chunkPlan[session.step.chunk.chunkIndex];
  const priorTurns = session.thread
    .slice(-6)
    .map((turn) => ('content' in turn ? turn.content : 'asset' in turn ? turn.asset.description : turn.kind));

  const evaluation = await evaluateChunkAnswer({
    learnerAnswer: answer,
    question: session.step.chunk.activeQuestion,
    chunk,
    priorTurns,
  });

  const animateTurnIds = applyChunkEvaluation(frame, session, answer, evaluation);
  session.updatedAt = new Date().toISOString();
  await syncGuidedChunkTelemetry(frame, session);
  await saveGuidedChunkSession(session);
  const payload = buildSessionPayload(frame, session, animateTurnIds);
  logGuidedServerDebug('turns/submit', buildGuidedSubmitDebugSnapshot({
    frame,
    session,
    learnerAnswer: answer,
    priorTurns,
    evaluation,
    payload,
  }));

  return NextResponse.json(payload);
}
