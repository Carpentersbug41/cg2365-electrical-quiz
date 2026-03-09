type QuestionPublishGateInput = {
  stableKey: string;
  stem: string;
  answerKey: unknown;
  metadata?: unknown;
  qualityScore: number | null;
};

type PublishGateIssue = {
  severity: 'error' | 'warning';
  field: string;
  message: string;
};

export type QuestionPublishGateResult = {
  ok: boolean;
  issues: PublishGateIssue[];
};

const FORBIDDEN_STYLE_TOKENS = ['style=', 'color:', 'font-family', 'background:', 'class='];

function toAcceptedAnswers(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const raw = (value as { acceptedAnswers?: unknown }).acceptedAnswers;
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
}

function toOptions(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const raw = (value as { options?: unknown }).options;
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function validateQuestionVersionForPublish(input: QuestionPublishGateInput): QuestionPublishGateResult {
  const issues: PublishGateIssue[] = [];
  const stem = input.stem.trim();
  const acceptedAnswers = toAcceptedAnswers(input.answerKey);
  const options = toOptions(input.metadata);
  const lowerStem = stem.toLowerCase();

  if (input.stableKey.trim().length === 0) {
    issues.push({ severity: 'error', field: 'stableKey', message: 'Question stable key is required.' });
  }

  if (stem.length < 10) {
    issues.push({ severity: 'error', field: 'stem', message: 'Question stem must be at least 10 characters.' });
  }

  if (acceptedAnswers.length === 0) {
    issues.push({
      severity: 'error',
      field: 'answerKey.acceptedAnswers',
      message: 'At least one accepted answer is required.',
    });
  }

  if (options.length > 0) {
    const normalizedOptions = options.map((option) => normalizeText(option)).filter((option) => option.length > 0);
    if (options.length < 3) {
      issues.push({
        severity: 'error',
        field: 'metadata.options',
        message: 'MCQ questions require at least 3 non-empty options.',
      });
    }
    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      issues.push({
        severity: 'error',
        field: 'metadata.options',
        message: 'MCQ options must be unique.',
      });
    }
    const normalizedAcceptedAnswers = new Set(acceptedAnswers.map((answer) => normalizeText(answer)));
    const optionMatchesAcceptedAnswer = normalizedOptions.some((option) => normalizedAcceptedAnswers.has(option));
    if (!optionMatchesAcceptedAnswer) {
      issues.push({
        severity: 'error',
        field: 'metadata.options',
        message: 'At least one accepted answer must match one of the MCQ options.',
      });
    }
  }

  if (FORBIDDEN_STYLE_TOKENS.some((token) => lowerStem.includes(token))) {
    issues.push({
      severity: 'error',
      field: 'stem',
      message: 'Question stem contains styling tokens. Keep V2 content style-agnostic.',
    });
  }

  if (input.qualityScore != null && input.qualityScore < 85) {
    issues.push({
      severity: 'error',
      field: 'qualityScore',
      message: `Question quality score ${input.qualityScore} is below the publish threshold of 85.`,
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
}
