import { NextRequest, NextResponse } from 'next/server';
import { getV2ActorUserId } from '@/lib/v2/admin/api';
import { generateDynamicLessonFromModuleBlueprint } from '@/lib/dynamicGuidedV2/modulePlannerBridge';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../../../_utils';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; blueprintId: string }> }
) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id, blueprintId } = await context.params;
    const deniedScope = await assertV2ModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;

    const actorUserId = await getV2ActorUserId(request);
    const result = await generateDynamicLessonFromModuleBlueprint({
      runId: id,
      blueprintId,
      createdBy: actorUserId,
    });

    const lessonCode = encodeURIComponent(result.version.lessonCode);
    const versionId = encodeURIComponent(result.version.id);

    return NextResponse.json({
      success: true,
      runId: id,
      blueprintId,
      score: result.score ?? null,
      validation: result.validation ?? null,
      version: result.version,
      previewUrl: `/2365/dynamic-guided-v2/${lessonCode}?versionId=${versionId}&sourceContext=dynamic_module_preview`,
      simpleChatbotPreviewUrl: `/2365/simple-chatbot?lessonMode=1&lessonCode=${lessonCode}&dynamicVersionId=${versionId}`,
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
