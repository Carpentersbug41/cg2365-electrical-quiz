import { NextRequest, NextResponse } from 'next/server';
import { guardV2AdminAccess, getV2ActorUserId, toV2AdminError } from '@/lib/v2/admin/api';
import { generateAndStoreDynamicLessonDraft } from '@/lib/dynamicGuidedV2/generation/service';
import type { DynamicLessonGenerationInput } from '@/lib/dynamicGuidedV2/generation/types';

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const body = (await request.json().catch(() => ({}))) as Partial<DynamicLessonGenerationInput>;
    if (!body.lessonCode || !body.title || !body.unit || !body.topic || !body.sourceText) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_INPUT',
          message: 'lessonCode, title, unit, topic, and sourceText are required.',
        },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const result = await generateAndStoreDynamicLessonDraft({
      generationInput: {
        lessonCode: String(body.lessonCode).trim().toUpperCase(),
        title: String(body.title).trim(),
        unit: String(body.unit).trim(),
        topic: String(body.topic).trim(),
        subject: typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'C&G 2365',
        audience: typeof body.audience === 'string' && body.audience.trim() ? body.audience.trim() : 'Level 2 electrical learner',
        tonePrompt:
          typeof body.tonePrompt === 'string' && body.tonePrompt.trim()
            ? body.tonePrompt.trim()
            : 'Teach like a strong electrical tutor: practical, direct, technically precise, concise, and natural.',
        sourceText: String(body.sourceText),
        sourceRefs: Array.isArray(body.sourceRefs) ? body.sourceRefs.map((item) => String(item)) : [],
        stagePlan: Array.isArray(body.stagePlan) ? body.stagePlan : undefined,
        sourceContext: 'dynamic_admin_generate',
      },
      createdBy: actorUserId,
      sourceContext: 'dynamic_admin_generate',
    });

    return NextResponse.json({
      success: true,
      accepted: result.accepted,
      lessonCode: result.lesson.lessonCode,
      version: result.version,
      validation: result.validation,
      score: result.score,
      refined: result.refined,
      phases: result.phases,
      rejectionReason: result.rejectionReason,
      previewUrl: result.version
        ? `/2365/dynamic-guided-v2/${encodeURIComponent(result.lesson.lessonCode)}?versionId=${encodeURIComponent(result.version.id)}`
        : null,
      simpleChatbotPreviewUrl: result.version
        ? `/2365/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(result.lesson.lessonCode)}&dynamicVersionId=${encodeURIComponent(result.version.id)}`
        : null,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
