import { NextRequest, NextResponse } from 'next/server';
import {
  createV2AdminClient,
  getV2ActorUserId,
  guardV2AdminAccess,
  toV2AdminError,
} from '@/lib/v2/admin/api';
import { persistV2LessonDraft } from '@/lib/v2/generation/persistLessonDraft';

type ImportPayload = {
  lessonCode?: string;
  generatedLesson?: unknown;
  sourcePayload?: unknown;
  sourceContext?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as ImportPayload;
    const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode.trim() : '';
    const generatedLesson = isRecord(body.generatedLesson)
      ? body.generatedLesson
      : null;
    const sourcePayload = isRecord(body.sourcePayload) ? body.sourcePayload : null;
    const sourceContext =
      typeof body.sourceContext === 'string' && body.sourceContext.trim().length > 0
        ? body.sourceContext.trim()
        : 'admin_v2_import';

    if (!lessonCode || !generatedLesson) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'lessonCode and generatedLesson are required.' },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const persisted = await persistV2LessonDraft(adminClient, {
      lessonCode,
      generatedLesson,
      actorUserId,
      sourceContext,
      sourcePayload,
    });

    return NextResponse.json({
      success: true,
      lessonId: persisted.lessonId,
      lessonCode: persisted.lessonCode,
      generatedLessonVersionId: persisted.versionId,
      generatedVersionNo: persisted.versionNo,
      qualityScore: persisted.qualityScore,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
