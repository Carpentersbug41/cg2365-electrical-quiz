import { NextRequest, NextResponse } from 'next/server';
import { assertGuidedChunkSessionAccess } from '@/lib/guidedChunk/auth';
import { loadGuidedChunkFrame } from '@/lib/guidedChunk/frameLoader';
import { buildSessionPayload, completeMicrobreakStep } from '@/lib/guidedChunk/runtime';
import { loadGuidedChunkSession, saveGuidedChunkSession } from '@/lib/guidedChunk/sessionStore';
import { syncGuidedChunkTelemetry } from '@/lib/guidedChunk/telemetry';

type CompleteMicrobreakRequest = {
  sessionId?: string;
  skipped?: boolean;
};

export async function POST(request: NextRequest) {
  let body: CompleteMicrobreakRequest;

  try {
    body = (await request.json()) as CompleteMicrobreakRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
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

  const animateTurnIds = completeMicrobreakStep(frame, session, Boolean(body.skipped));
  session.updatedAt = new Date().toISOString();
  await syncGuidedChunkTelemetry(frame, session);
  await saveGuidedChunkSession(session);

  return NextResponse.json(buildSessionPayload(frame, session, animateTurnIds));
}
