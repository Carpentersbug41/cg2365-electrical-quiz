import { NextRequest, NextResponse } from 'next/server';
import { generateGuidedLessonFromModuleBlueprint } from '@/lib/guidedChunk/modulePlannerBridge';
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

    const result = await generateGuidedLessonFromModuleBlueprint({
      runId: id,
      blueprintId,
      createdBy: null,
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
    return toErrorResponse(error);
  }
}
