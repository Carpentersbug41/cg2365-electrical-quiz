import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';

export type GuidedChunkPublishGateSeverity = 'error' | 'warning';

export type GuidedChunkPublishGateIssue = {
  code: string;
  severity: GuidedChunkPublishGateSeverity;
  message: string;
};

export type GuidedChunkPublishGateResult = {
  ok: boolean;
  issues: GuidedChunkPublishGateIssue[];
};

type Input = {
  lessonCode: string;
  title: string;
  qualityScore: number | null;
  frame: GuidedChunkFrame;
  validation?: { passed?: boolean; issues?: string[] } | null;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateGuidedChunkVersionForPublish(input: Input): GuidedChunkPublishGateResult {
  const issues: GuidedChunkPublishGateIssue[] = [];
  const { lessonCode, title, qualityScore, frame, validation } = input;

  if (frame.lessonCode !== lessonCode) {
    issues.push({
      code: 'LESSON_CODE_MISMATCH',
      severity: 'error',
      message: `Frame lessonCode (${frame.lessonCode}) does not match registry code (${lessonCode}).`,
    });
  }

  if (frame.title !== title) {
    issues.push({
      code: 'TITLE_MISMATCH',
      severity: 'warning',
      message: 'Frame title differs from lesson title. Review for consistency.',
    });
  }

  if (!Array.isArray(frame.loSequence) || frame.loSequence.length === 0) {
    issues.push({
      code: 'MISSING_LO_SEQUENCE',
      severity: 'error',
      message: 'Guided frame must contain at least one LO.',
    });
  }

  const totalChunks = frame.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0);
  if (totalChunks === 0) {
    issues.push({
      code: 'MISSING_CHUNKS',
      severity: 'error',
      message: 'Guided frame must contain at least one chunk.',
    });
  }

  for (const lo of frame.loSequence) {
    if (!isNonEmptyString(lo.loId) || !isNonEmptyString(lo.loTitle)) {
      issues.push({
        code: 'INVALID_LO_METADATA',
        severity: 'error',
        message: 'Every LO must have an id and title.',
      });
      break;
    }

    if (!Array.isArray(lo.chunkPlan) || lo.chunkPlan.length === 0) {
      issues.push({
        code: 'EMPTY_LO_CHUNKS',
        severity: 'error',
        message: `LO ${lo.loId} has no chunks.`,
      });
    }

    if (!Array.isArray(lo.loTestMcq?.mcqs) || lo.loTestMcq.mcqs.length === 0) {
      issues.push({
        code: 'MISSING_LO_MCQ',
        severity: 'error',
        message: `LO ${lo.loId} is missing its MCQ test.`,
      });
    }

    if (!Array.isArray(lo.loTestShortAnswer?.shortAnswers) || lo.loTestShortAnswer.shortAnswers.length === 0) {
      issues.push({
        code: 'MISSING_LO_SHORT_ANSWER',
        severity: 'error',
        message: `LO ${lo.loId} is missing its short-answer test.`,
      });
    }

    for (const chunk of lo.chunkPlan) {
      if (!isNonEmptyString(chunk.teachingCore) || chunk.teachingWordCount < 40) {
        issues.push({
          code: 'WEAK_CHUNK_CONTENT',
          severity: 'error',
          message: `Chunk ${chunk.chunkId} has insufficient teaching content.`,
        });
      }
      if (!Array.isArray(chunk.initialRecallQuestions) || chunk.initialRecallQuestions.length === 0) {
        issues.push({
          code: 'MISSING_RECALL',
          severity: 'error',
          message: `Chunk ${chunk.chunkId} has no initial recall questions.`,
        });
      }
      if (!Array.isArray(chunk.repairTemplates) || chunk.repairTemplates.length === 0) {
        issues.push({
          code: 'MISSING_REPAIR',
          severity: 'error',
          message: `Chunk ${chunk.chunkId} has no repair templates.`,
        });
      }
    }
  }

  if (typeof qualityScore === 'number' && qualityScore < 85) {
    issues.push({
      code: 'QUALITY_SCORE_TOO_LOW',
      severity: 'error',
      message: `Quality score ${qualityScore.toFixed(2)} is below publish threshold 85.`,
    });
  }

  if (validation && validation.passed === false) {
    issues.push({
      code: 'VALIDATION_FAILED',
      severity: 'error',
      message: `Generation validation failed: ${(validation.issues ?? []).slice(0, 3).join('; ') || 'unknown issue'}.`,
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
}
