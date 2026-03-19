import { NextRequest, NextResponse } from 'next/server';
import { getV2ActorUserId } from '@/lib/v2/admin/api';
import { generateGuidedLessonFromModuleBlueprint } from '@/lib/guidedChunk/modulePlannerBridge';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../../../_utils';

interface Params {
  params: Promise<{ id: string; blueprintId: string }>;
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id, blueprintId } = await context.params;
    const deniedScope = await assertV2ModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;

    const actorUserId = await getV2ActorUserId(request);
    const result = await generateGuidedLessonFromModuleBlueprint({
      runId: id,
      blueprintId,
      createdBy: actorUserId,
    });

    return NextResponse.json({
      success: true,
      runId: id,
      blueprintId,
      score: result.score ?? null,
      validation: result.validation ?? null,
      version: result.version,
      previewUrl: `/guided-chunk/${encodeURIComponent(result.frame.lessonCode)}?versionId=${encodeURIComponent(result.version.id)}&sourceContext=guided_chunk_module_preview`,
      adminUrl: '/admin/guided-chunk',
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
