import { NextRequest, NextResponse } from 'next/server';
import { assertGuidedChunkSessionAccess } from '@/lib/guidedChunk/auth';
import { loadGuidedChunkFrame } from '@/lib/guidedChunk/frameLoader';
import { buildSessionPayload } from '@/lib/guidedChunk/runtime';
import { loadGuidedChunkSession, saveGuidedChunkSession } from '@/lib/guidedChunk/sessionStore';
import { syncGuidedChunkTelemetry } from '@/lib/guidedChunk/telemetry';
import { getPublishedGuidedChunkVersionSummaryByCode } from '@/lib/guidedChunk/versionStore';
import { buildGuidedSessionDebugSnapshot, logGuidedServerDebug } from '@/lib/guidedChunk/debug';

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { sessionId } = await context.params;
  const session = await loadGuidedChunkSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
  }

  const access = await assertGuidedChunkSessionAccess(_request, session);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (!session.lessonVersionId && session.sourceContext === 'guided_chunk_runtime') {
    return NextResponse.json({ error: 'Stale published session.' }, { status: 409 });
  }

  if (session.sourceContext === 'guided_chunk_runtime') {
    const published = await getPublishedGuidedChunkVersionSummaryByCode(session.lessonCode);
    if (!published || published.id !== session.lessonVersionId) {
      return NextResponse.json({ error: 'Stale published session.' }, { status: 409 });
    }
  }

  const frame = await loadGuidedChunkFrame(session.lessonCode, {
    previewVersionId: session.lessonVersionId ?? null,
  });
  if (!frame) {
    return NextResponse.json({ error: 'Lesson frame not found.' }, { status: 404 });
  }

  session.updatedAt = new Date().toISOString();
  await syncGuidedChunkTelemetry(frame, session);
  await saveGuidedChunkSession(session);
  const payload = buildSessionPayload(frame, session);
  logGuidedServerDebug('sessions/[sessionId] restore', {
    request: { sessionId },
    session: buildGuidedSessionDebugSnapshot(frame, session),
    responsePayload: payload,
  });

  return NextResponse.json(payload);
}
