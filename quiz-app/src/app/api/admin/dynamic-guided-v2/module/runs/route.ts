import { NextRequest, NextResponse } from 'next/server';
import { guardV2AdminAccess, getV2ActorUserId, toV2AdminError } from '@/lib/v2/admin/api';
import { listDynamicModulePlannerRuns, createDynamicModulePlannerRun } from '@/lib/dynamicGuidedV2/planner/store';
import { planDynamicModule } from '@/lib/dynamicGuidedV2/planner/service';
import type { DynamicModulePlanRequest } from '@/lib/dynamicGuidedV2/planner/types';

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const runs = await listDynamicModulePlannerRuns();
    return NextResponse.json({ success: true, runs });
  } catch (error) {
    return toV2AdminError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const body = (await request.json().catch(() => ({}))) as Partial<DynamicModulePlanRequest>;
    if (!body.moduleTitle || !body.sourceText) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_INPUT',
          message: 'moduleTitle and sourceText are required.',
        },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const planned = await planDynamicModule({
      moduleTitle: String(body.moduleTitle).trim(),
      subject: typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'C&G 2365',
      audience:
        typeof body.audience === 'string' && body.audience.trim()
          ? body.audience.trim()
          : 'Level 2 electrical learner',
      sourceName: typeof body.sourceName === 'string' && body.sourceName.trim() ? body.sourceName.trim() : null,
      sourceText: String(body.sourceText),
      requestedLessonCount: Number(body.requestedLessonCount ?? 3),
    });

    const created = await createDynamicModulePlannerRun({
      moduleTitle: planned.moduleTitle,
      subject: typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'C&G 2365',
      audience:
        typeof body.audience === 'string' && body.audience.trim()
          ? body.audience.trim()
          : 'Level 2 electrical learner',
      sourceName: typeof body.sourceName === 'string' && body.sourceName.trim() ? body.sourceName.trim() : null,
      sourceText: String(body.sourceText),
      requestedLessonCount: Math.max(1, Math.min(Number(body.requestedLessonCount ?? 3), 8)),
      blueprints: planned.blueprints,
      phaseArtifacts: planned.phaseArtifacts,
      createdBy: actorUserId,
    });

    return NextResponse.json({
      success: true,
      run: created.summary,
      blueprints: created.run.blueprints,
      phaseArtifacts: created.run.phaseArtifacts,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
