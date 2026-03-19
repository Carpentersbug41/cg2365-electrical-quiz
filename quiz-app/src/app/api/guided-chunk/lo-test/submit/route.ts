import { NextRequest, NextResponse } from 'next/server';
import { assertGuidedChunkSessionAccess } from '@/lib/guidedChunk/auth';
import { loadGuidedChunkFrame } from '@/lib/guidedChunk/frameLoader';
import { buildSessionPayload, submitLoTest } from '@/lib/guidedChunk/runtime';
import { loadGuidedChunkSession, saveGuidedChunkSession } from '@/lib/guidedChunk/sessionStore';
import type { GuidedChunkLoTestSubmission } from '@/lib/guidedChunk/types';
import { syncGuidedChunkTelemetry } from '@/lib/guidedChunk/telemetry';

type SubmitLoTestRequest = {
  sessionId?: string;
  submission?: GuidedChunkLoTestSubmission;
};

export async function POST(request: NextRequest) {
  let body: SubmitLoTestRequest;

  try {
    body = (await request.json()) as SubmitLoTestRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  if (!sessionId || !body.submission) {
    return NextResponse.json({ error: 'sessionId and submission are required.' }, { status: 400 });
  }

  const session = await loadGuidedChunkSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
  }

  const access = await assertGuidedChunkSessionAccess(request, session);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const frame = await loadGuidedChunkFrame(session.lessonCode, {
    previewVersionId: session.lessonVersionId ?? null,
  });
  if (!frame) {
    return NextResponse.json({ error: 'Lesson frame not found.' }, { status: 404 });
  }

  const animateTurnIds = submitLoTest(frame, session, body.submission);
  session.updatedAt = new Date().toISOString();
  await syncGuidedChunkTelemetry(frame, session);
  await saveGuidedChunkSession(session);

  return NextResponse.json(buildSessionPayload(frame, session, animateTurnIds));
}
