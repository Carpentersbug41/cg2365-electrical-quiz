import { NextRequest, NextResponse } from 'next/server';
import {
  createGuidedChunkExperiment,
  listGuidedChunkExperiments,
  updateGuidedChunkExperiment,
  type GuidedChunkExperimentChangeType,
  type GuidedChunkExperimentResult,
  type GuidedChunkExperimentStatus,
} from '@/lib/guidedChunk/experimentStore';
import { getV2ActorUserId, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type CreatePayload = {
  name?: string;
  status?: GuidedChunkExperimentStatus;
  changeType?: GuidedChunkExperimentChangeType;
  hypothesis?: string;
  baselineVariantId?: string | null;
  targetVariantId?: string;
  runtimeVersion?: string | null;
  sourceContext?: string;
  metricsToWatch?: string[];
  notes?: string | null;
  changes?: Array<{
    lessonCode?: string | null;
    lessonVersionId?: string | null;
    changeType?: GuidedChunkExperimentChangeType;
    runtimeVersion?: string | null;
    variantId?: string;
    baselineVariantId?: string | null;
    sourceContext?: string;
    description?: string;
    expectedEffect?: Record<string, unknown>;
  }>;
};

type UpdatePayload = {
  experimentId?: string;
  status?: GuidedChunkExperimentStatus;
  notes?: string | null;
  result?: GuidedChunkExperimentResult | null;
};

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const data = await listGuidedChunkExperiments();
    return NextResponse.json(data);
  } catch (error) {
    return toV2AdminError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const body = (await request.json().catch(() => ({}))) as CreatePayload;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const hypothesis = typeof body.hypothesis === 'string' ? body.hypothesis.trim() : '';
    const changeType = body.changeType;
    const targetVariantId = typeof body.targetVariantId === 'string' ? body.targetVariantId.trim() : '';

    if (!name || !hypothesis || !changeType || !targetVariantId) {
      return NextResponse.json(
        { success: false, message: 'name, hypothesis, changeType, and targetVariantId are required.' },
        { status: 400 }
      );
    }

    const actorUserId = await getV2ActorUserId(request);
    const experiment = await createGuidedChunkExperiment({
      name,
      status: body.status,
      changeType,
      hypothesis,
      baselineVariantId: typeof body.baselineVariantId === 'string' ? body.baselineVariantId.trim() : null,
      targetVariantId,
      runtimeVersion: typeof body.runtimeVersion === 'string' ? body.runtimeVersion.trim() : null,
      sourceContext: typeof body.sourceContext === 'string' ? body.sourceContext.trim() : 'guided_chunk_runtime',
      metricsToWatch: Array.isArray(body.metricsToWatch)
        ? body.metricsToWatch.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        : [],
      notes: typeof body.notes === 'string' ? body.notes.trim() : null,
      actorUserId,
      changes: Array.isArray(body.changes)
        ? body.changes
            .filter((change) => typeof change.description === 'string' && change.description.trim().length > 0)
            .map((change) => ({
              lessonCode: typeof change.lessonCode === 'string' ? change.lessonCode.trim() : null,
              lessonVersionId: typeof change.lessonVersionId === 'string' ? change.lessonVersionId.trim() : null,
              changeType: change.changeType,
              runtimeVersion: typeof change.runtimeVersion === 'string' ? change.runtimeVersion.trim() : null,
              variantId: typeof change.variantId === 'string' ? change.variantId.trim() : undefined,
              baselineVariantId:
                typeof change.baselineVariantId === 'string' ? change.baselineVariantId.trim() : null,
              sourceContext: typeof change.sourceContext === 'string' ? change.sourceContext.trim() : undefined,
              description: change.description!.trim(),
              expectedEffect:
                typeof change.expectedEffect === 'object' && change.expectedEffect !== null ? change.expectedEffect : {},
            }))
        : [],
    });

    return NextResponse.json({ success: true, experiment });
  } catch (error) {
    return toV2AdminError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const body = (await request.json().catch(() => ({}))) as UpdatePayload;
    const experimentId = typeof body.experimentId === 'string' ? body.experimentId.trim() : '';
    if (!experimentId) {
      return NextResponse.json({ success: false, message: 'experimentId is required.' }, { status: 400 });
    }

    const experiment = await updateGuidedChunkExperiment({
      experimentId,
      status: body.status,
      notes: typeof body.notes === 'string' ? body.notes.trim() : null,
      result:
        typeof body.result === 'object' && body.result !== null
          ? body.result
          : null,
    });

    return NextResponse.json({ success: true, experiment });
  } catch (error) {
    return toV2AdminError(error);
  }
}
