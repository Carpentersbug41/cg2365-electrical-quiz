import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, getV2ActorUserId } from '@/lib/v2/admin/api';
import { persistV2LessonDraft } from '@/lib/v2/generation/persistLessonDraft';
import { getV2PlannerRunSummary, runV2M6DeleteLesson, runV2M6GenerateLesson } from '@/lib/v2/modulePlanner/service';
import { assertV2ModuleRunInScope, guardV2ModulePlannerAccess, toV2ModulePlannerError } from '../../../../_utils';

interface Params {
  params: Promise<{ id: string; blueprintId: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function POST(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const { id, blueprintId } = await context.params;
    const deniedScope = await assertV2ModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;

    const url = new URL(request.url);
    const result = await runV2M6GenerateLesson(id, blueprintId, { apiBaseUrl: url.origin });

    let importedDraft: { versionId: string; versionNo: number; qualityScore: number | null } | null = null;
    if (result.status === 'generated') {
      const summary = await getV2PlannerRunSummary(id);
      const runLesson = summary.lessons.find((lesson) => lesson.blueprint_id === blueprintId);
      const sourcePayload = isRecord(runLesson?.lesson_json) ? runLesson.lesson_json : null;
      const generatedLesson = sourcePayload && isRecord(sourcePayload.generatedLesson) ? sourcePayload.generatedLesson : null;
      if (generatedLesson) {
        const actorUserId = await getV2ActorUserId(request);
        const persisted = await persistV2LessonDraft(adminClient, {
          lessonCode: blueprintId,
          generatedLesson,
          actorUserId,
          sourceContext: 'admin_v2_module_planner',
          sourcePayload,
          importMode: 'module_planner_import',
        });
        importedDraft = {
          versionId: persisted.versionId,
          versionNo: persisted.versionNo,
          qualityScore: persisted.qualityScore,
        };
      }
    }

    return NextResponse.json({
      success: true,
      runId: id,
      blueprintId,
      ...result,
      importedDraft,
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  try {
    const { id, blueprintId } = await context.params;
    const deniedScope = await assertV2ModuleRunInScope(request, id);
    if (deniedScope) return deniedScope;
    const result = await runV2M6DeleteLesson(id, blueprintId);
    return NextResponse.json({
      success: true,
      runId: id,
      blueprintId,
      ...result,
    });
  } catch (error) {
    return toV2ModulePlannerError(error);
  }
}
