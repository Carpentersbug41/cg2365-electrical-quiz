import { NextRequest, NextResponse } from 'next/server';
import {
  createV2AdminClient,
  getV2ActorUserId,
  guardV2AdminAccess,
  toV2AdminError,
} from '@/lib/v2/admin/api';
import { generateAndPersistV2LessonDraft, V2LessonGenerationError } from '@/lib/v2/generation/service';

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

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const actorUserId = await getV2ActorUserId(request);
    const persisted = await generateAndPersistV2LessonDraft(adminClient, {
      requestBody: body,
      requestContext: {
        coursePrefix: request.headers.get('x-course-prefix'),
        referer: request.headers.get('referer'),
      },
      actorUserId,
      sourceContext: 'admin_v2_generate',
      importMode: 'manual_draft_import',
    });

    return NextResponse.json({
      success: true,
      lessonCode: persisted.lessonCode,
      generatedLessonVersionId: persisted.versionId,
      generatedVersionNo: persisted.versionNo,
      qualityScore: persisted.qualityScore,
      warnings: persisted.warnings,
      phases: persisted.phases,
      refinementMetadata: persisted.refinementMetadata,
      debugBundle: persisted.debugBundle,
    });
  } catch (error) {
    if (error instanceof V2LessonGenerationError) {
      return NextResponse.json(
        {
          success: false,
          code: error.code,
          message: error.message,
          ...(error.details ?? {}),
        },
        { status: error.status }
      );
    }
    return toV2AdminError(error);
  }
}
