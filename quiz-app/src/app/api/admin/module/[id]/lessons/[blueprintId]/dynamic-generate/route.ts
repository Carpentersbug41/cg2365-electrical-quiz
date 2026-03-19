import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicLessonFromModuleBlueprint } from '@/lib/dynamicGuidedV2/modulePlannerBridge';
import { assertModuleRunInScope, guardModulePlannerAccess, toErrorResponse } from '../../../../_utils';

interface Params {
  params: Promise<{ id: string; blueprintId: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id, blueprintId } = await context.params;
    const deniedScope = await assertModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;

    const result = await generateDynamicLessonFromModuleBlueprint({
      runId: id,
      blueprintId,
      createdBy: null,
    });

    return NextResponse.json({
      success: true,
      accepted: result.accepted,
      runId: id,
      blueprintId,
      score: result.score ?? null,
      validation: result.validation ?? null,
      version: result.version,
      rejectionReason: result.rejectionReason ?? null,
      phases: result.phases,
      previewUrl: result.version
        ? `/2365/dynamic-guided-v2/${encodeURIComponent(result.version.lessonCode)}?versionId=${encodeURIComponent(result.version.id)}&sourceContext=dynamic_module_preview`
        : null,
      simpleChatbotPreviewUrl: result.version
        ? `/2365/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(result.version.lessonCode)}&dynamicVersionId=${encodeURIComponent(result.version.id)}`
        : null,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
