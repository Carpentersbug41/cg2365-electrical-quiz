import { NextRequest, NextResponse } from 'next/server';
import { guardV2AdminAccess, getV2ActorUserId, toV2AdminError } from '@/lib/v2/admin/api';
import { getDynamicModulePlannerBlueprint } from '@/lib/dynamicGuidedV2/planner/store';
import { generateAndStoreDynamicLessonDraft } from '@/lib/dynamicGuidedV2/generation/service';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ runId: string; blueprintId: string }> }
) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const { runId, blueprintId } = await context.params;
    const planned = await getDynamicModulePlannerBlueprint({ runId, blueprintId });
    if (!planned) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_FOUND',
          message: `Dynamic module blueprint not found: ${blueprintId}`,
        },
        { status: 404 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const result = await generateAndStoreDynamicLessonDraft({
      generationInput: {
        lessonCode: planned.blueprint.lessonCode,
        title: planned.blueprint.title,
        unit: planned.blueprint.unit,
        topic: planned.blueprint.topic,
        subject: planned.run.subject,
        audience: planned.run.audience,
        tonePrompt: 'Teach like a strong electrical tutor: practical, direct, technically precise, concise, and natural.',
        sourceText: planned.blueprint.focusText,
        sourceRefs: planned.blueprint.sourceRefs,
        stagePlan: planned.blueprint.stagePlan,
        sourceContext: 'dynamic_module_native_blueprint',
      },
      createdBy: actorUserId,
      sourceContext: 'dynamic_module_native_blueprint',
    });

    return NextResponse.json({
      success: true,
      accepted: result.accepted,
      runId,
      blueprintId,
      lessonCode: result.lesson.lessonCode,
      version: result.version,
      validation: result.validation,
      score: result.score,
      planScore: result.planScore,
      fidelityScore: result.fidelityScore,
      refined: result.refined,
      phases: result.phases,
      rejectionReason: result.rejectionReason,
      previewUrl: result.version
        ? `/2365/dynamic-guided-v2/${encodeURIComponent(result.lesson.lessonCode)}?versionId=${encodeURIComponent(result.version.id)}&sourceContext=dynamic_module_native_preview`
        : null,
      simpleChatbotPreviewUrl: result.version
        ? `/2365/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(result.lesson.lessonCode)}&dynamicVersionId=${encodeURIComponent(result.version.id)}`
        : null,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
