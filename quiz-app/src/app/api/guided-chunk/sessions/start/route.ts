import { NextRequest, NextResponse } from 'next/server';
import { loadGuidedChunkFrame } from '@/lib/guidedChunk/frameLoader';
import { buildSessionPayload, createInitialSession } from '@/lib/guidedChunk/runtime';
import { saveGuidedChunkSession } from '@/lib/guidedChunk/sessionStore';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';
import { syncGuidedChunkTelemetry } from '@/lib/guidedChunk/telemetry';
import { getGuidedChunkVersionSummary, getPublishedGuidedChunkVersionSummaryByCode } from '@/lib/guidedChunk/versionStore';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';
import { buildGuidedSessionDebugSnapshot, logGuidedServerDebug } from '@/lib/guidedChunk/debug';

type StartRequestBody = {
  lessonCode?: string;
  versionId?: string;
  sourceContext?: string;
};

export async function POST(request: NextRequest) {
  let body: StartRequestBody;

  try {
    body = (await request.json()) as StartRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode.trim() : '';
  const versionId = typeof body.versionId === 'string' ? body.versionId.trim() : '';
  const sourceContext =
    typeof body.sourceContext === 'string' && body.sourceContext.trim().length > 0
      ? body.sourceContext.trim()
      : 'guided_chunk_runtime';
  if (!lessonCode) {
    return NextResponse.json({ error: 'lessonCode is required.' }, { status: 400 });
  }

  if (versionId) {
    const denied = await guardV2AdminAccess(request, 'content_operator');
    if (denied) return denied;
  }

  const frame = await loadGuidedChunkFrame(lessonCode, {
    previewVersionId: versionId || null,
  });
  if (!frame) {
    return NextResponse.json({ error: 'Guided chunk lesson not found.' }, { status: 404 });
  }

  const authSession = await getSupabaseSessionFromRequest(request);
  const versionSummary = versionId
    ? await getGuidedChunkVersionSummary(versionId)
    : await getPublishedGuidedChunkVersionSummaryByCode(lessonCode);
  const { session, animateTurnIds } = createInitialSession(frame, {
    userId: authSession?.user.id ?? null,
    lessonVersionId: versionSummary?.id ?? null,
    lessonStatus: versionSummary?.status ?? 'builtin',
    sourceContext,
  });
  await syncGuidedChunkTelemetry(frame, session);
  await saveGuidedChunkSession(session);
  const payload = buildSessionPayload(frame, session, animateTurnIds);
  logGuidedServerDebug('session/start', {
    request: { lessonCode, versionId: versionId || null, sourceContext },
    session: buildGuidedSessionDebugSnapshot(frame, session),
    responsePayload: payload,
  });

  return NextResponse.json(payload);
}
