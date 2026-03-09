type QuestionPublishGateInput = {
  stableKey: string;
  stem: string;
  answerKey: unknown;
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

export function validateQuestionVersionForPublish(input: QuestionPublishGateInput): QuestionPublishGateResult {
  const issues: PublishGateIssue[] = [];
  const stem = input.stem.trim();
  const acceptedAnswers = toAcceptedAnswers(input.answerKey);
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
