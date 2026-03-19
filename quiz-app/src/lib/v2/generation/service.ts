import { getRefinementConfig } from '@/lib/generation/config';
import { FileGenerator } from '@/lib/generation/fileGenerator';
import type { GenerationRequest, GenerationResponse } from '@/lib/generation/types';
import { generateLessonId } from '@/lib/generation/utils';
import { ValidationService } from '@/lib/generation/validationService';
import { getCurriculumScopeFromHeaderOrReferer } from '@/lib/routing/curriculumScope';
import type { SupabaseClient } from '@supabase/supabase-js';
import { persistV2LessonDraft } from '@/lib/v2/generation/persistLessonDraft';

type LessonGenerationResult = Awaited<ReturnType<FileGenerator['generateLesson']>> & {
  phases?: GenerationResponse['phases'];
  refinementMetadata?: GenerationResponse['refinementMetadata'];
  debugBundle?: GenerationResponse['debugBundle'];
};

export class V2LessonGenerationError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export type V2GeneratedLessonDraftResult = {
  lessonCode: string;
  generatedLesson: Record<string, unknown>;
  qualityScore: number | null;
  warnings: string[];
  phases: GenerationResponse['phases'];
  refinementMetadata: GenerationResponse['refinementMetadata'] | null;
  debugBundle: GenerationResponse['debugBundle'] | null;
};

function inferSectionFromUnit(unit: number | string): string {
  const unitToken = String(unit).trim();
  if (/^phy-/i.test(unitToken)) return 'GCSE Science Physics';
  if (/^bio-/i.test(unitToken)) return 'GCSE Science Biology';
  return `Unit ${unitToken}`;
}

function toGenerationRequest(
  body: Partial<GenerationRequest>,
  requestContext: { coursePrefix?: string | null; referer?: string | null }
): GenerationRequest {
  return {
    curriculum:
      body.curriculum ??
      getCurriculumScopeFromHeaderOrReferer(requestContext.coursePrefix ?? null, requestContext.referer ?? null),
    unit: body.unit ?? '',
    lessonId: typeof body.lessonId === 'string' ? body.lessonId.trim() : '',
    topic: typeof body.topic === 'string' ? body.topic.trim() : '',
    section:
      typeof body.section === 'string' && body.section.trim().length > 0
        ? body.section.trim()
        : inferSectionFromUnit(body.unit ?? ''),
    syllabusVersionId: body.syllabusVersionId,
    layout: body.layout,
    prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : [],
    prerequisiteAnchors: body.prerequisiteAnchors,
    foundationAnchors: body.foundationAnchors,
    mustHaveTopics: body.mustHaveTopics,
    additionalInstructions: body.additionalInstructions,
    youtubeUrl: body.youtubeUrl,
    imageUrl: body.imageUrl,
    masterLessonBlueprint: body.masterLessonBlueprint,
  };
}

function toQualityScore(result: LessonGenerationResult): number | null {
  return result.refinementMetadata?.finalScore ?? result.refinementMetadata?.originalScore ?? null;
}

export function buildV2LessonGenerationRequest(
  body: Partial<GenerationRequest>,
  requestContext: { coursePrefix?: string | null; referer?: string | null }
): GenerationRequest {
  return toGenerationRequest(body, requestContext);
}

export async function generateV2LessonDraftResult(
  generationRequest: GenerationRequest
): Promise<V2GeneratedLessonDraftResult> {
  if (!generationRequest.unit || !generationRequest.lessonId || !generationRequest.topic) {
    throw new V2LessonGenerationError('INVALID_INPUT', 'unit, lessonId, and topic are required.', 400);
  }

  const lessonCode = generateLessonId(generationRequest.unit, generationRequest.lessonId).toUpperCase();
  const lessonGenerator = new FileGenerator();
  const validator = new ValidationService();
  const generated = (await lessonGenerator.generateLesson(generationRequest)) as LessonGenerationResult;

  if (!generated.success || !generated.content) {
    throw new V2LessonGenerationError(
      'GENERATION_FAILED',
      generated.error || 'Generation pipeline failed to produce lesson content.',
      500,
      { debugInfo: generated.debugInfo ?? null }
    );
  }

  const validation = validator.validateLesson(generated.content, lessonCode);
  if (!validation.valid) {
    throw new V2LessonGenerationError(
      'VALIDATION_FAILED',
      'Generated lesson failed validation.',
      400,
      {
        errors: validation.errors,
        warnings: validation.warnings,
        debugData: validation.debugData,
      }
    );
  }

  const refinementConfig = getRefinementConfig();
  const qualityScore = toQualityScore(generated);
  if (typeof qualityScore === 'number' && qualityScore < refinementConfig.scoreThreshold) {
    throw new V2LessonGenerationError(
      'QUALITY_THRESHOLD_FAIL',
      `Lesson quality ${qualityScore}/100 below threshold ${refinementConfig.scoreThreshold}/100.`,
      422,
      {
        qualityGate: {
          threshold: refinementConfig.scoreThreshold,
          finalScore: qualityScore,
          passed: false,
        },
        refinementMetadata: generated.refinementMetadata ?? null,
      }
    );
  }

  return {
    lessonCode,
    generatedLesson: generated.content as Record<string, unknown>,
    qualityScore,
    warnings: validation.warnings ?? [],
    phases: generated.phases ?? [],
    refinementMetadata: generated.refinementMetadata ?? null,
    debugBundle: generated.debugBundle ?? null,
  };
}

export async function generateAndPersistV2LessonDraft(
  adminClient: SupabaseClient,
  input: {
    requestBody: Partial<GenerationRequest>;
    requestContext: { coursePrefix?: string | null; referer?: string | null };
    actorUserId?: string | null;
    sourceContext: string;
    importMode?: string;
  }
): Promise<V2GeneratedLessonDraftResult & { versionId: string; versionNo: number }> {
  const generationRequest = buildV2LessonGenerationRequest(input.requestBody, input.requestContext);
  const generated = await generateV2LessonDraftResult(generationRequest);
  const persisted = await persistV2LessonDraft(adminClient, {
    lessonCode: generated.lessonCode,
    generatedLesson: generated.generatedLesson,
    actorUserId: input.actorUserId,
    sourceContext: input.sourceContext,
    importMode: input.importMode,
    sourcePayload: {
      generatorResponse: {
        refinementMetadata: generated.refinementMetadata,
      },
      phases: generated.phases,
    },
  });

  return {
    ...generated,
    lessonCode: persisted.lessonCode,
    versionId: persisted.versionId,
    versionNo: persisted.versionNo,
    qualityScore: persisted.qualityScore,
  };
}

