export type PublishGateSeverity = 'error' | 'warning';

export type PublishGateIssue = {
  code: string;
  severity: PublishGateSeverity;
  message: string;
};

export type PublishGateResult = {
  ok: boolean;
  issues: PublishGateIssue[];
};

type PublishGateInput = {
  lessonCode: string;
  lessonTitle: string;
  qualityScore: number | null;
  content: unknown;
};

const REQUIRED_TOP_LEVEL_FIELDS = [
  'id',
  'title',
  'description',
  'layout',
  'unit',
  'topic',
  'learningOutcomes',
  'prerequisites',
  'blocks',
  'metadata',
] as const;

const INLINE_STYLE_PATTERNS = [
  'style=',
  '<style',
  'font-family:',
  'color:',
  'background:',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function containsForbiddenStyling(content: unknown): boolean {
  const serialized = JSON.stringify(content).toLowerCase();
  return INLINE_STYLE_PATTERNS.some((pattern) => serialized.includes(pattern));
}

export function validateLessonVersionForPublish(input: PublishGateInput): PublishGateResult {
  const issues: PublishGateIssue[] = [];
  const { lessonCode, lessonTitle, qualityScore, content } = input;

  if (!isRecord(content)) {
    return {
      ok: false,
      issues: [
        {
          code: 'INVALID_CONTENT',
          severity: 'error',
          message: 'Lesson content must be a JSON object.',
        },
      ],
    };
  }

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in content)) {
      issues.push({
        code: 'MISSING_REQUIRED_FIELD',
        severity: 'error',
        message: `Missing required field: ${field}.`,
      });
    }
  }

  if (!isNonEmptyString(content.id)) {
    issues.push({
      code: 'INVALID_LESSON_ID',
      severity: 'error',
      message: 'Lesson content id must be a non-empty string.',
    });
  }

  if (isNonEmptyString(content.id) && content.id !== lessonCode) {
    issues.push({
      code: 'LESSON_CODE_MISMATCH',
      severity: 'error',
      message: `Content id (${content.id}) does not match lesson code (${lessonCode}).`,
    });
  }

  if (!isNonEmptyString(content.title)) {
    issues.push({
      code: 'INVALID_TITLE',
      severity: 'error',
      message: 'Lesson title is required.',
    });
  }

  if (isNonEmptyString(content.title) && content.title !== lessonTitle) {
    issues.push({
      code: 'TITLE_MISMATCH',
      severity: 'warning',
      message: 'Content title differs from lesson title. Review for consistency.',
    });
  }

  if (!isNonEmptyString(content.description)) {
    issues.push({
      code: 'MISSING_DESCRIPTION',
      severity: 'error',
      message: 'Lesson description is required.',
    });
  }

  if (!Array.isArray(content.learningOutcomes) || content.learningOutcomes.length < 2) {
    issues.push({
      code: 'INVALID_LEARNING_OUTCOMES',
      severity: 'error',
      message: 'At least 2 learning outcomes are required.',
    });
  } else {
    const allStrings = content.learningOutcomes.every(isNonEmptyString);
    if (!allStrings) {
      issues.push({
        code: 'INVALID_LEARNING_OUTCOME_ENTRY',
        severity: 'error',
        message: 'All learning outcomes must be non-empty strings.',
      });
    }
  }

  if (!Array.isArray(content.prerequisites)) {
    issues.push({
      code: 'INVALID_PREREQUISITES',
      severity: 'error',
      message: 'Prerequisites must be a string array (can be empty).',
    });
  }

  if (!Array.isArray(content.blocks) || content.blocks.length === 0) {
    issues.push({
      code: 'INVALID_BLOCKS',
      severity: 'error',
      message: 'Lesson must contain at least one content block.',
    });
  }

  if (containsForbiddenStyling(content)) {
    issues.push({
      code: 'INLINE_STYLING_FORBIDDEN',
      severity: 'error',
      message: 'Inline styling or CSS-like tokens detected in lesson content.',
    });
  }

  if (typeof qualityScore === 'number' && qualityScore < 85) {
    issues.push({
      code: 'QUALITY_SCORE_TOO_LOW',
      severity: 'error',
      message: `Quality score ${qualityScore.toFixed(2)} is below publish threshold 85.`,
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
}
