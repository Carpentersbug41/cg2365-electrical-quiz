import type { DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';

export type RuntimeVariant = 'control' | 'lean_feedback_v1';
export type RuntimeReplyClass = 'correct' | 'partial' | 'misconception' | 'unclear';

export type ReplyClassification = {
  replyClass: RuntimeReplyClass;
  matchedTargets: string[];
  missingTargets: string[];
  likelyMisconception: string;
  recommendedRepairFocus: string;
};

export type WorkedExampleReadinessClassification = {
  readiness: 'ready' | 'needs_support' | 'unclear';
  evidence: string;
  recommendedSupportFocus: string;
};

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function guidanceMatchesUserAnswer(userAnswer: string, guidance: string): boolean {
  const normalizedUser = normalizeForMatch(userAnswer);
  const normalizedGuidance = normalizeForMatch(guidance);
  if (!normalizedUser || !normalizedGuidance) return false;
  if (normalizedUser.includes(normalizedGuidance)) return true;
  const guidanceTokens = normalizedGuidance.split(' ').filter((token) => token.length >= 2);
  if (guidanceTokens.length === 0) return false;
  const matchedTokenCount = guidanceTokens.filter((token) => normalizedUser.includes(token)).length;
  if (guidanceTokens.length <= 3) {
    return matchedTokenCount === guidanceTokens.length;
  }
  return matchedTokenCount / guidanceTokens.length >= 0.6;
}

function isUnclearReply(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  const normalized = normalizeForMatch(trimmed);
  if (!normalized) return true;
  const lowSignalPatterns = [
    /\bi don t know\b/,
    /\bidk\b/,
    /\bnot sure\b/,
    /\bunsure\b/,
    /\bdon t understand\b/,
    /\bno idea\b/,
    /\bmaybe\b/,
  ];
  if (lowSignalPatterns.some((pattern) => pattern.test(normalized))) return true;
  return normalized.split(' ').filter(Boolean).length <= 2;
}

function getLikelyMisconception(step: DynamicGuidedV2Step): string {
  return (
    step.hint?.trim() ||
    step.misconceptionsToWatch?.find((value) => value.trim())?.trim() ||
    ''
  );
}

function normalizeText(text: string): string {
  return normalizeForMatch(text);
}

export function classifyLessonReply(
  step: DynamicGuidedV2Step,
  latestUserMessage: string,
  lessonSectionPhase: 'feedback_basic' | 'feedback_deeper'
): ReplyClassification {
  const trimmedUser = latestUserMessage.trim();
  const likelyMisconception = getLikelyMisconception(step);

  if (isUnclearReply(trimmedUser)) {
    return {
      replyClass: 'unclear',
      matchedTargets: [],
      missingTargets:
        lessonSectionPhase === 'feedback_basic'
          ? (step.basicQuestions ?? []).map((question) => question.answerGuidance?.[0] ?? question.questionText).filter(Boolean)
          : [...(step.deeperAnswerGuidance ?? [])],
      likelyMisconception,
      recommendedRepairFocus:
        lessonSectionPhase === 'feedback_basic'
          ? (step.basicQuestions?.[0]?.answerGuidance?.[0] ?? step.basicQuestions?.[0]?.questionText ?? '')
          : (step.deeperAnswerGuidance?.[0] ?? ''),
    };
  }

  if (lessonSectionPhase === 'feedback_basic' && step.basicQuestions?.length) {
    const matchedTargets = step.basicQuestions
      .filter((question) => (question.answerGuidance ?? []).some((guidance) => guidanceMatchesUserAnswer(trimmedUser, guidance)))
      .map((question) => question.answerGuidance?.[0] ?? question.questionText)
      .filter(Boolean);
    const missingTargets = step.basicQuestions
      .filter((question) => !(question.answerGuidance ?? []).some((guidance) => guidanceMatchesUserAnswer(trimmedUser, guidance)))
      .map((question) => question.answerGuidance?.[0] ?? question.questionText)
      .filter(Boolean);

    const hasStoredTargets = step.basicQuestions.some((question) => (question.answerGuidance ?? []).length > 0);
    if (!hasStoredTargets) {
      return {
        replyClass: isUnclearReply(trimmedUser) ? 'unclear' : 'partial',
        matchedTargets: [],
        missingTargets: step.basicQuestions.map((question) => question.questionText).filter(Boolean),
        likelyMisconception,
        recommendedRepairFocus: step.basicQuestions[0]?.questionText ?? likelyMisconception,
      };
    }

    const matchedCount = matchedTargets.length;
    const total = step.basicQuestions.length;
    const replyClass: RuntimeReplyClass =
      matchedCount === total ? 'correct' : matchedCount > 0 ? 'partial' : 'misconception';

    return {
      replyClass,
      matchedTargets,
      missingTargets,
      likelyMisconception,
      recommendedRepairFocus: missingTargets[0] ?? likelyMisconception,
    };
  }

  const deeperTargets = [...(step.deeperAnswerGuidance ?? [])];
  const matchedTargets = deeperTargets.filter((guidance) => guidanceMatchesUserAnswer(trimmedUser, guidance));
  const missingTargets = deeperTargets.filter((guidance) => !guidanceMatchesUserAnswer(trimmedUser, guidance));
  const matchRatio = deeperTargets.length > 0 ? matchedTargets.length / deeperTargets.length : 0;
  const replyClass: RuntimeReplyClass =
    matchRatio >= 0.6 ? 'correct' : matchRatio > 0 ? 'partial' : 'misconception';

  return {
    replyClass,
    matchedTargets,
    missingTargets,
    likelyMisconception,
    recommendedRepairFocus: missingTargets[0] ?? likelyMisconception,
  };
}

export function classifyWorkedExampleReadiness(
  step: DynamicGuidedV2Step,
  latestUserMessage: string
): WorkedExampleReadinessClassification {
  const normalized = normalizeText(latestUserMessage);
  const supportFocus =
    step.taskSkeleton?.takeaway?.trim() ||
    step.hint?.trim() ||
    step.anchorFacts?.find((value) => value.trim())?.trim() ||
    step.objective;

  const readyPatterns = [
    /\bready\b/,
    /\byes\b/,
    /\bmakes sense\b/,
    /\bi understand\b/,
    /\bgot it\b/,
    /\bok(?:ay)?\b/,
    /\bunderstand now\b/,
  ];
  const supportPatterns = [
    /\bnot yet\b/,
    /\bconfused\b/,
    /\bexplain\b/,
    /\bagain\b/,
    /\bdon t understand\b/,
    /\bnot clear\b/,
    /\bstuck\b/,
    /\bno\b/,
  ];

  if (!normalized) {
    return {
      readiness: 'unclear',
      evidence: 'The learner did not clearly signal whether the worked example makes sense yet.',
      recommendedSupportFocus: supportFocus,
    };
  }

  if (supportPatterns.some((pattern) => pattern.test(normalized))) {
    return {
      readiness: 'needs_support',
      evidence: 'The learner signalled that the worked example still needs clarification.',
      recommendedSupportFocus: supportFocus,
    };
  }

  if (readyPatterns.some((pattern) => pattern.test(normalized))) {
    return {
      readiness: 'ready',
      evidence: 'The learner signalled that the worked example now makes sense.',
      recommendedSupportFocus: supportFocus,
    };
  }

  if (isUnclearReply(latestUserMessage)) {
    return {
      readiness: 'unclear',
      evidence: 'The learner did not clearly signal whether the worked example makes sense yet.',
      recommendedSupportFocus: supportFocus,
    };
  }

  return {
    readiness: 'needs_support',
    evidence: 'The learner replied with content, but did not clearly signal confidence yet.',
    recommendedSupportFocus: supportFocus,
  };
}

export function buildTeachCheckRepairFocusFromClassification(
  step: DynamicGuidedV2Step,
  lessonSectionPhase: 'feedback_basic' | 'feedback_deeper',
  classification: ReplyClassification
): string {
  if (step.stage !== 'teach_check') return '';

  if (lessonSectionPhase === 'feedback_basic') {
    return [
      `Reply class: ${classification.replyClass}`,
      classification.matchedTargets.length
        ? `Secure targets: ${classification.matchedTargets.join(' | ')}`
        : 'Secure targets: none yet',
      classification.missingTargets.length
        ? `Missing targets: ${classification.missingTargets.join(' | ')}`
        : 'Missing targets: none obvious',
      classification.likelyMisconception
        ? `Likely misconception: ${classification.likelyMisconception}`
        : '',
      classification.recommendedRepairFocus
        ? `Repair this first: ${classification.recommendedRepairFocus}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    `Reply class: ${classification.replyClass}`,
    classification.matchedTargets.length
      ? `Matched deeper targets: ${classification.matchedTargets.join(' | ')}`
      : 'Matched deeper targets: none clearly matched',
    classification.missingTargets.length
      ? `Missing deeper targets: ${classification.missingTargets.join(' | ')}`
      : 'Missing deeper targets: none obvious',
    classification.likelyMisconception
      ? `Likely misconception: ${classification.likelyMisconception}`
      : '',
    classification.recommendedRepairFocus
      ? `Repair this first: ${classification.recommendedRepairFocus}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWorkedExampleSupportFocusFromClassification(
  classification: WorkedExampleReadinessClassification
): string {
  return [
    `Worked example readiness: ${classification.readiness}`,
    `Evidence: ${classification.evidence}`,
    classification.recommendedSupportFocus
      ? `Support this first: ${classification.recommendedSupportFocus}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
