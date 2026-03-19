import { DynamicLessonGenerator } from '@/lib/dynamicGuidedV2/generation/DynamicLessonGenerator';
import type { DynamicLessonGenerationInput } from '@/lib/dynamicGuidedV2/generation/types';
import { createDynamicLessonDraftVersion } from '@/lib/dynamicGuidedV2/versionStore';
import { writeDynamicGeneratedLessonArtifact } from '@/lib/dynamicGuidedV2/generatedLessonArtifactStore';

function buildDetailedRejectionReason(input: {
  rejectionReason: string | null;
  score: {
    issues?: Array<{ problem: string; suggestion: string }>;
    phaseFeedback?: Array<{ phaseTitle: string; issues: string[]; suggestedFixes: string[] }>;
    total: number;
    grade: string;
  };
  validation: {
    issues?: string[];
    passed: boolean;
  };
}): string {
  const base = input.rejectionReason || `Draft rejected at score ${input.score.total} (${input.score.grade}).`;
  const topValidationIssue = Array.isArray(input.validation.issues) ? input.validation.issues.find(Boolean) : null;
  const topScoreIssue = Array.isArray(input.score.issues) ? input.score.issues.find((issue) => issue?.problem) : null;
  const topPhaseIssue = Array.isArray(input.score.phaseFeedback)
    ? input.score.phaseFeedback.find((phase) => Array.isArray(phase.issues) && phase.issues.length > 0)
    : null;

  if (topValidationIssue) {
    return `${base} Validation issue: ${topValidationIssue}`;
  }

  if (topScoreIssue?.problem) {
    const fix = topScoreIssue.suggestion ? ` Fix: ${topScoreIssue.suggestion}` : '';
    return `${base} Top issue: ${topScoreIssue.problem}${fix}`;
  }

  if (topPhaseIssue) {
    const fix = topPhaseIssue.suggestedFixes?.[0] ? ` Fix: ${topPhaseIssue.suggestedFixes[0]}` : '';
    return `${base} Phase issue in ${topPhaseIssue.phaseTitle}: ${topPhaseIssue.issues[0]}${fix}`;
  }

  return base;
}

export async function generateAndStoreDynamicLessonDraft(input: {
  generationInput: DynamicLessonGenerationInput;
  createdBy?: string | null;
  sourceContext?: string | null;
}) {
  console.log(`[dynamic-generate][${input.generationInput.lessonCode}] service start`, {
    sourceContext: input.sourceContext ?? input.generationInput.sourceContext ?? null,
    createdBy: input.createdBy ?? null,
  });
  const generator = new DynamicLessonGenerator();
  const generated = await generator.generate(input.generationInput);

  if (!generated.accepted) {
    const detailedReason = buildDetailedRejectionReason({
      rejectionReason: generated.rejectionReason,
      score: generated.score,
      validation: generated.validation,
    });
    const artifact = writeDynamicGeneratedLessonArtifact({
      result: {
        ...generated,
        rejectionReason: detailedReason,
      },
      version: null,
      sourceContext: input.sourceContext ?? input.generationInput.sourceContext ?? null,
      createdBy: input.createdBy ?? null,
    });
    console.warn(`[dynamic-generate][${input.generationInput.lessonCode}] service reject`, {
      score: generated.score.total,
      grade: generated.score.grade,
      validationPassed: generated.validation.passed,
      reason: detailedReason,
      artifactPath: artifact.runFilePath,
    });
    return {
      ...generated,
      rejectionReason: detailedReason,
      version: null,
    };
  }

  const version = await createDynamicLessonDraftVersion({
    lesson: generated.lesson,
    createdBy: input.createdBy ?? null,
    sourceContext: input.sourceContext ?? input.generationInput.sourceContext ?? null,
    sourceRefs: input.generationInput.sourceRefs ?? [],
    qualityScore: generated.score.total,
    validation: generated.validation,
    report: generated.score,
    phaseArtifacts: generated.phases,
    source: 'ai',
  });

  const artifact = writeDynamicGeneratedLessonArtifact({
    result: generated,
    version,
    sourceContext: input.sourceContext ?? input.generationInput.sourceContext ?? null,
    createdBy: input.createdBy ?? null,
  });

  console.log(`[dynamic-generate][${input.generationInput.lessonCode}] service stored`, {
    versionId: version.id,
    versionNo: version.versionNo,
    score: generated.score.total,
    grade: generated.score.grade,
    artifactPath: artifact.runFilePath,
  });

  return {
    ...generated,
    version,
  };
}
