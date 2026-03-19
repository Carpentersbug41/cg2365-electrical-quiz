import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import type { DynamicGuidedV2BasicQuestion, DynamicGuidedV2Lesson, DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';
import {
  buildDynamicExplanationPrompt,
  buildDynamicFixPlanPrompt,
  buildDynamicIntegrationPrompt,
  buildDynamicPlanningPrompt,
  buildDynamicPracticePrompt,
  buildDynamicRefinePrompt,
  buildDynamicScorePrompt,
  buildDynamicSpacedReviewPrompt,
  buildDynamicUnderstandingChecksPrompt,
  buildDynamicVocabularyPrompt,
  buildDynamicWorkedExamplePrompt,
} from '@/lib/dynamicGuidedV2/generation/prompts';
import type {
  DynamicApplyPhaseOutput,
  DynamicExplanationPhaseOutput,
  DynamicFixPlan,
  DynamicIntegrationPhaseOutput,
  DynamicLessonAcceptanceDecision,
  DynamicLessonGenerationInput,
  DynamicLessonGenerationResult,
  DynamicLessonStageDescriptor,
  DynamicPlanningPhaseOutput,
  DynamicSpacedReviewPhaseOutput,
  DynamicUnderstandingChecksPhaseOutput,
  DynamicVocabularyPhaseOutput,
  DynamicWorkedExamplePhaseOutput,
} from '@/lib/dynamicGuidedV2/generation/types';
import type {
  DynamicGenerationPhaseArtifact,
  DynamicLessonGenerationScore,
  DynamicLessonGenerationValidation,
} from '@/lib/dynamicGuidedV2/versionStore';

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\bsection\s+\d+\b/i,
  /\bcurrent concept\b/i,
  /\bkey idea\s*\d*\b/i,
  /\bsupported practice task\b/i,
  /\bindependent practice task\b/i,
  /\bintegrative task\b/i,
  /\bshow the steps clearly\b/i,
  /\banswer the .*questions? for this section\b/i,
  /\bcorrect idea\b/i,
  /\blinked explanation\b/i,
  /\bguide the learner\b/i,
  /\bcore idea:\s*section\b/i,
];

const GENERIC_GUIDANCE_PATTERNS: RegExp[] = [
  /^key idea\s*\d*$/i,
  /^correct idea$/i,
  /^main idea$/i,
  /^important point$/i,
  /^answer\s*\d*$/i,
  /^point\s*\d*$/i,
  /^string$/i,
];

const SCORE_MAX = {
  beginnerClarity: 30,
  teachingBeforeTesting: 25,
  markingRobustness: 20,
  alignmentToLO: 15,
  questionQuality: 10,
} as const;

type ScoreCategory = keyof typeof SCORE_MAX;
type PromptPair = { system: string; user: string };

type JsonPhaseResult<T> = {
  parsed: T;
  rawText: string;
  prompt: PromptPair;
};

type SourceGroundingAssessment = {
  capsScoreAt: number | null;
  issues: Array<{
    problem: string;
    suggestion: string;
  }>;
};

async function getClient() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  return llmClientPromise;
}

function nowIso(): string {
  return new Date().toISOString();
}

function durationMs(startedAt: number): number {
  return Date.now() - startedAt;
}

function debugPrefix(input: DynamicLessonGenerationInput): string {
  return `[dynamic-generate][${input.lessonCode}]`;
}

function logGenerationEvent(input: DynamicLessonGenerationInput, message: string, details?: Record<string, unknown>): void {
  if (details && Object.keys(details).length > 0) {
    console.log(`${debugPrefix(input)} ${message}`, details);
    return;
  }
  console.log(`${debugPrefix(input)} ${message}`);
}

function normalizeWhitespace(text: unknown): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text: string): number {
  return normalizeWhitespace(text)
    .split(/\s+/)
    .filter(Boolean).length;
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function containsPlaceholderLanguage(text: string): boolean {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasSubstantiveTeachingText(text: string, minimumWords = 35): boolean {
  return wordCount(text) >= minimumWords && !containsPlaceholderLanguage(text);
}

function assessSourceGrounding(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput
): SourceGroundingAssessment {
  const issues: SourceGroundingAssessment['issues'] = [];
  const sourceWords = wordCount(input.sourceText);
  const lineCount = input.sourceText
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean).length;
  const inScopeCount = planning.inScope.length;
  const termCount = vocabulary.terms.length;

  let capsScoreAt: number | null = null;

  if (sourceWords < 25 || lineCount < 2) {
    capsScoreAt = 70;
    issues.push({
      problem: 'The source grounding is too thin to support a reliable dynamic lesson draft.',
      suggestion: 'Provide fuller source text with concrete facts, distinctions, and at least one worked-example-level detail.',
    });
  } else if (sourceWords < 80) {
    capsScoreAt = 88;
    issues.push({
      problem: 'The source grounding is brief, so the generated lesson may overreach beyond the evidence provided.',
      suggestion: 'Add more grounded detail before accepting the lesson as ship quality.',
    });
  }

  if (inScopeCount < 2) {
    capsScoreAt = capsScoreAt == null ? 88 : Math.min(capsScoreAt, 88);
    issues.push({
      problem: 'The planning phase could not extract enough concrete in-scope anchors from the source.',
      suggestion: 'Strengthen the source text so the planner can identify multiple concrete teaching anchors.',
    });
  }

  if (termCount < 2) {
    capsScoreAt = capsScoreAt == null ? 88 : Math.min(capsScoreAt, 88);
    issues.push({
      problem: 'The vocabulary phase found too few concrete technical terms to support a strong lesson.',
      suggestion: 'Add source material that explicitly defines the lesson’s technical terms and distinctions.',
    });
  }

  return {
    capsScoreAt,
    issues,
  };
}

function defaultStagePlan(input: DynamicLessonGenerationInput): DynamicLessonStageDescriptor[] {
  return [
    {
      key: 'intro',
      title: 'Intro',
      role: 'outcomes',
      stage: 'intro',
      objective: `Orient the learner to ${input.topic}.`,
      progressionRule: 'auto',
      completionMode: 'continue',
    },
    {
      key: 'teach-check-1',
      title: 'Teach/Check 1',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the first core idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-2',
      title: 'Teach/Check 2',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next core idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'worked-example-1',
      title: 'Worked Example',
      role: 'worked_example',
      stage: 'worked_example',
      objective: `Show one worked example for ${input.topic}.`,
      progressionRule: 'worked_example_feedback',
      completionMode: 'respond',
    },
    {
      key: 'guided-practice-1',
      title: 'Guided Practice',
      role: 'guided_practice',
      stage: 'guided_practice',
      objective: `Guide the learner through a supported task on ${input.topic}.`,
      progressionRule: 'auto',
      completionMode: 'respond',
    },
    {
      key: 'practice-1',
      title: 'Practice',
      role: 'practice',
      stage: 'practice',
      objective: `Check independent understanding of ${input.topic}.`,
      progressionRule: 'auto',
      completionMode: 'respond',
    },
    {
      key: 'integrative-1',
      title: 'Integrative Close',
      role: 'integrative',
      stage: 'integrative',
      objective: 'Pull the lesson together in one final synthesis task.',
      progressionRule: 'integrative_feedback',
      completionMode: 'respond',
    },
  ];
}

function extractJsonCandidate(rawText: string): string {
  const trimmed = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  const useBraces = firstBrace >= 0 && lastBrace > firstBrace;
  const useBrackets = firstBracket >= 0 && lastBracket > firstBracket && (!useBraces || firstBracket < firstBrace);
  return useBraces
    ? trimmed.slice(firstBrace, lastBrace + 1)
    : useBrackets
      ? trimmed.slice(firstBracket, lastBracket + 1)
      : trimmed;
}

function repairJsonCandidate(candidate: string): string[] {
  const attempts = new Set<string>();
  const normalized = candidate.trim();
  if (!normalized) return [];

  attempts.add(normalized);
  attempts.add(normalized.replace(/,\s*([}\]])/g, '$1'));

  const braceDelta = (normalized.match(/{/g) ?? []).length - (normalized.match(/}/g) ?? []).length;
  const bracketDelta = (normalized.match(/\[/g) ?? []).length - (normalized.match(/]/g) ?? []).length;
  if (braceDelta > 0 || bracketDelta > 0) {
    attempts.add(
      `${normalized.replace(/,\s*$/, '')}${']'.repeat(Math.max(0, bracketDelta))}${'}'.repeat(Math.max(0, braceDelta))}`
    );
  }

  return Array.from(attempts);
}

function parseJson<T>(rawText: string): T | null {
  const candidate = extractJsonCandidate(rawText);
  const attempts = repairJsonCandidate(candidate);
  try {
    for (const attempt of attempts) {
      try {
        return JSON.parse(attempt) as T;
      } catch {
        // try next repair
      }
    }
    return null;
  } catch {
    return null;
  }
}

function arrayOfStrings(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => normalizeWhitespace(item)).filter(Boolean);
}

function coerceBasicQuestions(value: unknown): DynamicGuidedV2BasicQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const question = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      return {
        questionText: normalizeWhitespace(question.questionText),
        answerGuidance: unique(arrayOfStrings(question.answerGuidance)),
      };
    })
    .filter((item) => item.questionText || item.answerGuidance.length > 0);
}

function aggregateAnswerGuidance(basicQuestions: DynamicGuidedV2BasicQuestion[]): string[] {
  return unique(
    basicQuestions
      .flatMap((question) => question.answerGuidance)
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
  );
}

function combineBasicQuestions(basicQuestions: DynamicGuidedV2BasicQuestion[]): string {
  return basicQuestions
    .map((question, index) => {
      const questionText = normalizeWhitespace(question.questionText);
      return questionText ? `${index + 1}. ${questionText}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

function coercePlanningOutput(raw: unknown, stagePlan: DynamicLessonStageDescriptor[]): DynamicPlanningPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRequired = stagePlan.filter((step) => step.stage === 'teach_check');
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  const teachChecks = teachChecksRequired.map((descriptor, index) => {
    const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
      ? (teachChecksRaw[index] as Record<string, unknown>)
      : {};
    return {
      key: descriptor.key,
      title: normalizeWhitespace(item.title) || descriptor.title,
      objective: normalizeWhitespace(item.objective) || descriptor.objective,
      conceptFocus: normalizeWhitespace(item.conceptFocus),
      whyItMatters: normalizeWhitespace(item.whyItMatters),
      misconceptions: arrayOfStrings(item.misconceptions),
    };
  });

  return {
    lessonAim: normalizeWhitespace(data.lessonAim),
    taskMode: normalizeWhitespace(data.taskMode) || 'teach-check electrical tutor',
    teachCheckCount: teachChecksRequired.length,
    teachChecks,
    workedExampleObjective: normalizeWhitespace(data.workedExampleObjective),
    guidedPracticeObjective: normalizeWhitespace(data.guidedPracticeObjective),
    practiceObjective: normalizeWhitespace(data.practiceObjective),
    integrativeObjective: normalizeWhitespace(data.integrativeObjective),
    spacedReviewObjective: normalizeWhitespace(data.spacedReviewObjective),
    inScope: arrayOfStrings(data.inScope),
    outOfScope: arrayOfStrings(data.outOfScope),
    constraints: arrayOfStrings(data.constraints),
  };
}

function coerceVocabularyOutput(raw: unknown): DynamicVocabularyPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const termsRaw = Array.isArray(data.terms) ? data.terms : [];
  return {
    terms: termsRaw
      .map((item) => {
        const term = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        return {
          term: normalizeWhitespace(term.term),
          simpleDefinition: normalizeWhitespace(term.simpleDefinition),
          anchor: normalizeWhitespace(term.anchor),
          misconception: normalizeWhitespace(term.misconception) || undefined,
        };
      })
      .filter((item) => item.term && item.simpleDefinition),
    anchorPhrases: arrayOfStrings(data.anchorPhrases),
    misconceptionTargets: arrayOfStrings(data.misconceptionTargets),
  };
}

function tokenizeLower(text: string): string[] {
  return normalizeWhitespace(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function questionRequestsSpecificTerm(questionText: string): boolean {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  return /what term|specific term|technical term|what is the name|name of the term|what does .* stand for/.test(normalized);
}

function inferRequiredVocabularyTerm(
  questionText: string,
  vocabulary: DynamicVocabularyPhaseOutput
): string | null {
  if (!questionRequestsSpecificTerm(questionText)) return null;
  const questionTokens = new Set(tokenizeLower(questionText));
  let bestTerm: string | null = null;
  let bestScore = 0;

  for (const term of vocabulary.terms) {
    const candidateTokens = new Set([
      ...tokenizeLower(term.term),
      ...tokenizeLower(term.simpleDefinition),
      ...tokenizeLower(term.anchor),
    ]);
    let overlap = 0;
    for (const token of candidateTokens) {
      if (questionTokens.has(token)) overlap += 1;
    }
    if (overlap > bestScore) {
      bestScore = overlap;
      bestTerm = normalizeWhitespace(term.term);
    }
  }

  return bestScore >= 2 ? bestTerm : null;
}

function enforceTechnicalTermGuidance(
  basicQuestions: DynamicGuidedV2BasicQuestion[],
  vocabulary: DynamicVocabularyPhaseOutput
): DynamicGuidedV2BasicQuestion[] {
  return basicQuestions.map((question) => {
    const exactTerm = inferRequiredVocabularyTerm(question.questionText, vocabulary);
    if (!exactTerm) return question;

    const guidance = unique([
      exactTerm,
      ...question.answerGuidance.filter((item) => normalizeWhitespace(item).toLowerCase() !== exactTerm.toLowerCase()),
    ]);

    return {
      ...question,
      answerGuidance: guidance,
    };
  });
}

function coerceExplanationOutput(raw: unknown, planning: DynamicPlanningPhaseOutput): DynamicExplanationPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  return {
    teachChecks: planning.teachChecks.map((planned, index) => {
      const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
        ? (teachChecksRaw[index] as Record<string, unknown>)
        : {};
      return {
        title: normalizeWhitespace(item.title) || planned.title,
        objective: normalizeWhitespace(item.objective) || planned.objective,
        retrievalTextLines: arrayOfStrings(item.retrievalTextLines),
        hint: normalizeWhitespace(item.hint) || undefined,
      };
    }),
  };
}

function coerceUnderstandingChecksOutput(
  raw: unknown,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput
): DynamicUnderstandingChecksPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  return {
    teachChecks: planning.teachChecks.map((planned, index) => {
      const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
        ? (teachChecksRaw[index] as Record<string, unknown>)
        : {};
      const basicQuestions = enforceTechnicalTermGuidance(
        coerceBasicQuestions(item.basicQuestions).slice(0, 3),
        vocabulary
      );
      return {
        title: normalizeWhitespace(item.title) || planned.title,
        basicQuestions,
        deeperQuestionText: normalizeWhitespace(item.deeperQuestionText),
        deeperAnswerGuidance: unique(arrayOfStrings(item.deeperAnswerGuidance)),
        hint: normalizeWhitespace(item.hint) || undefined,
      };
    }),
  };
}

function coerceWorkedExampleOutput(raw: unknown): DynamicWorkedExamplePhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    title: normalizeWhitespace(data.title) || 'Worked Example',
    objective: normalizeWhitespace(data.objective),
    retrievalTextLines: arrayOfStrings(data.retrievalTextLines),
    hint: normalizeWhitespace(data.hint) || undefined,
  };
}

function coerceApplyOutput(raw: unknown): DynamicApplyPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const guidedRaw = data.guidedPractice && typeof data.guidedPractice === 'object'
    ? (data.guidedPractice as Record<string, unknown>)
    : {};
  const practiceRaw = data.practice && typeof data.practice === 'object'
    ? (data.practice as Record<string, unknown>)
    : {};
  return {
    guidedPractice: {
      title: normalizeWhitespace(guidedRaw.title) || 'Guided Practice',
      objective: normalizeWhitespace(guidedRaw.objective),
      retrievalTextLines: arrayOfStrings(guidedRaw.retrievalTextLines),
      questionText: normalizeWhitespace(guidedRaw.questionText),
      answerGuidance: unique(arrayOfStrings(guidedRaw.answerGuidance)),
      hint: normalizeWhitespace(guidedRaw.hint) || undefined,
    },
    practice: {
      title: normalizeWhitespace(practiceRaw.title) || 'Practice',
      objective: normalizeWhitespace(practiceRaw.objective),
      retrievalTextLines: arrayOfStrings(practiceRaw.retrievalTextLines),
      questionText: normalizeWhitespace(practiceRaw.questionText),
      answerGuidance: unique(arrayOfStrings(practiceRaw.answerGuidance)),
      hint: normalizeWhitespace(practiceRaw.hint) || undefined,
    },
  };
}

function coerceIntegrationOutput(raw: unknown): DynamicIntegrationPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const integrativeRaw = data.integrative && typeof data.integrative === 'object'
    ? (data.integrative as Record<string, unknown>)
    : {};
  return {
    integrative: {
      title: normalizeWhitespace(integrativeRaw.title) || 'Integrative Close',
      objective: normalizeWhitespace(integrativeRaw.objective),
      retrievalTextLines: arrayOfStrings(integrativeRaw.retrievalTextLines),
      questionText: normalizeWhitespace(integrativeRaw.questionText),
      answerGuidance: unique(arrayOfStrings(integrativeRaw.answerGuidance)),
      hint: normalizeWhitespace(integrativeRaw.hint) || undefined,
    },
  };
}

function coerceSpacedReviewOutput(raw: unknown): DynamicSpacedReviewPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    title: normalizeWhitespace(data.title) || 'Spaced Review',
    objective: normalizeWhitespace(data.objective),
    retrievalTextLines: arrayOfStrings(data.retrievalTextLines),
    questionText: normalizeWhitespace(data.questionText),
    answerGuidance: unique(arrayOfStrings(data.answerGuidance)),
  };
}

function coerceFixPlan(raw: unknown, score: DynamicLessonGenerationScore): DynamicFixPlan {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const fixesRaw = Array.isArray(data.fixes) ? data.fixes : [];
  const fallbackFixes = score.issues.slice(0, 6).map((issue) => ({
    priority: 'high' as const,
    category: issue.category,
    targetPointers: Array.isArray(issue.jsonPointers) ? issue.jsonPointers : [],
    problem: issue.problem,
    repairInstruction: issue.suggestion,
  }));

  const fixes = fixesRaw.length > 0
    ? fixesRaw
        .map((item) => {
          const fix = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
          const priority = normalizeWhitespace(fix.priority).toLowerCase();
          const category = normalizeWhitespace(fix.category) as DynamicFixPlan['fixes'][number]['category'];
          return {
            priority: priority === 'medium' || priority === 'low' ? priority : 'high',
            category:
              category === 'beginnerClarity' ||
              category === 'teachingBeforeTesting' ||
              category === 'markingRobustness' ||
              category === 'alignmentToLO' ||
              category === 'questionQuality'
                ? category
                : 'beginnerClarity',
            targetPointers: arrayOfStrings(fix.targetPointers),
            problem: normalizeWhitespace(fix.problem),
            repairInstruction: normalizeWhitespace(fix.repairInstruction),
          };
        })
        .filter((item) => item.problem && item.repairInstruction)
    : fallbackFixes;

  return {
    summary: normalizeWhitespace(data.summary) || 'Fix the highest-impact pedagogical issues without changing the lesson structure.',
    fixes,
  };
}

function joinLines(lines: string[]): string {
  return lines.map((line) => normalizeWhitespace(line)).filter(Boolean).join('\n');
}

function workedExampleStructure(text: string): { lines: string[]; stepLines: string[]; hasResult: boolean; hasTakeaway: boolean } {
  const lines = text
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  return {
    lines,
    stepLines: lines.filter((line) => /^step\s*\d+/i.test(line) || /^\d+\./.test(line)),
    hasResult: lines.some((line) => /^result\b/i.test(line) || /^final result\b/i.test(line)),
    hasTakeaway: lines.some((line) => /takeaway|key point|therefore|so this means/i.test(line)),
  };
}

function countStructuredTaskParts(text: string | undefined, answerGuidance?: string[] | undefined): number {
  const normalized = normalizeWhitespace(text);
  const normalizedGuidance = (answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
  if (!normalized && normalizedGuidance.length === 0) return 0;
  const numberedParts = normalized.match(/(?:^|\s)(?:\d+\.|\d+\))/g) ?? [];
  const alphaParts = normalized.match(/\bPart\s+[A-Z]\b/gi) ?? [];
  const scenarioParts = normalized.match(/\bScenario\s+[A-Z]\b/gi) ?? [];
  const labeledGuidanceParts = normalizedGuidance.filter((item) => /^(?:Scenario\s+[A-Z]|[A-Z]\)|\d+[\.\)]|[^:]{1,40}:)/i.test(item)).length;
  const scenarioOutputMultiplier =
    scenarioParts.length > 0 && /\bidentify\b/i.test(normalized) && /\band\b/i.test(normalized)
      ? scenarioParts.length * 2
      : 0;
  return Math.max(numberedParts.length, alphaParts.length, scenarioParts.length, scenarioOutputMultiplier, labeledGuidanceParts, 1);
}

function isSeverelyBundledTask(questionText: string | undefined, answerGuidance?: string[] | undefined): boolean {
  const normalized = normalizeWhitespace(questionText);
  const normalizedGuidance = (answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
  if (!normalized) return false;

  const scenarioParts = normalized.match(/\bScenario\s+[A-Z]\b/gi) ?? [];
  const mixedOutputCue =
    /\bcircuit type\b/i.test(normalized) && /\bwiring system\b/i.test(normalized) ||
    /\blegal difference\b/i.test(normalized) && /\bhow\b/i.test(normalized) ||
    /\bstate\b/i.test(normalized) && /\blist\b/i.test(normalized);
  const labeledGuidanceParts = normalizedGuidance.filter((item) => /^(?:Scenario\s+[A-Z]|[A-Z]\)|\d+[\.\)]|[^:]{1,40}:)/i.test(item)).length;

  if (scenarioParts.length >= 2 && mixedOutputCue) {
    return true;
  }

  if (scenarioParts.length >= 2 && labeledGuidanceParts >= 4) {
    return true;
  }

  return false;
}

function hasThinGuidanceForBundledTask(questionText: string | undefined, answerGuidance: string[] | undefined): boolean {
  const partCount = countStructuredTaskParts(questionText, answerGuidance);
  const guidanceCount = (answerGuidance ?? []).filter(Boolean).length;
  if (partCount <= 1) return false;
  return guidanceCount < partCount;
}

function isGenericGuidanceList(items: string[] | undefined): boolean {
  const normalized = (items ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
  if (normalized.length === 0) return true;
  return normalized.every(
      (item) =>
      containsPlaceholderLanguage(item) ||
      GENERIC_GUIDANCE_PATTERNS.some((pattern) => pattern.test(item))
  );
}

function derivePhaseFeedback(
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation
): DynamicLessonGenerationScore['phaseFeedback'] {
  return lesson.steps.map((step) => {
    const strengths: string[] = [];
    const issues: string[] = [];
    const suggestedFixes: string[] = [];

    if (step.retrievalText && !containsPlaceholderLanguage(step.retrievalText) && wordCount(step.retrievalText) >= 20) {
      strengths.push('Grounded teaching text is present for this phase.');
    } else {
      issues.push('Teaching text is too thin or generic for this phase.');
      suggestedFixes.push('Strengthen the retrieval/explanation text with concrete, grounded content.');
    }

    if (step.stage === 'teach_check') {
      if (step.basicQuestions?.length === 3) {
        strengths.push('Uses the expected three-question teach/check pattern.');
      } else {
        issues.push('Does not use exactly three explicit basic questions.');
        suggestedFixes.push('Provide exactly three short-answer basic questions with distinct answer targets.');
      }
      if (!step.deeperQuestionText || containsPlaceholderLanguage(step.deeperQuestionText)) {
        issues.push('Deeper question is weak or too generic.');
        suggestedFixes.push('Write a deeper question that requires reasoning from the taught explanation.');
      }
    }

    if (step.stage === 'worked_example') {
      const summary = workedExampleStructure(step.retrievalText);
      if (summary.stepLines.length >= 2 && summary.hasResult && summary.hasTakeaway) {
        strengths.push('Worked example includes steps, result, and takeaway.');
      } else {
        issues.push('Worked example structure is incomplete.');
        suggestedFixes.push('Include numbered steps, a final result, and a takeaway.');
      }
    }

    if (step.stage === 'guided_practice' || step.stage === 'practice' || step.stage === 'integrative') {
      if (step.questionText) {
        strengths.push('A concrete learner task is present.');
      } else {
        issues.push('The learner task is missing.');
        suggestedFixes.push('Set one clear task for this phase.');
      }
      if (isSeverelyBundledTask(step.questionText, step.answerGuidance)) {
        issues.push('This phase asks for multiple distinct outputs in one learner response field.');
        suggestedFixes.push('Split the task or label each required answer part explicitly so marking can map one target to one output.');
      }
      if (hasThinGuidanceForBundledTask(step.questionText, step.answerGuidance)) {
        issues.push('This phase bundles multiple required answers without enough answer guidance.');
        suggestedFixes.push('Split the task or provide answer guidance that maps clearly to each part.');
      }
      if (!step.answerGuidance?.length || isGenericGuidanceList(step.answerGuidance)) {
        issues.push('Answer guidance is too weak for reliable marking.');
        suggestedFixes.push('Provide concrete, checkable answer targets for this phase.');
      }
    }

    const validationHits = validation.issues.filter((issue) => issue.toLowerCase().includes(step.title.toLowerCase()));
    validationHits.forEach((issue) => {
      issues.push(issue);
      suggestedFixes.push('Fix the validation issue affecting this phase.');
    });

    const status: 'strong' | 'mixed' | 'weak' =
      issues.length === 0 ? 'strong' : strengths.length > 0 ? 'mixed' : 'weak';

    return {
      phaseKey: step.id,
      phaseTitle: step.title,
      stage: step.stage,
      status,
      strengths: strengths.slice(0, 3),
      issues: issues.slice(0, 4),
      suggestedFixes: unique(suggestedFixes).slice(0, 3),
    };
  });
}

function ensurePhaseFeedback(
  score: DynamicLessonGenerationScore,
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation
): DynamicLessonGenerationScore {
  if (Array.isArray(score.phaseFeedback) && score.phaseFeedback.length === lesson.steps.length) {
    return score;
  }
  return {
    ...score,
    phaseFeedback: derivePhaseFeedback(lesson, validation),
  };
}

function strengthenScoreReport(
  score: DynamicLessonGenerationScore,
  heuristicScore: DynamicLessonGenerationScore
): DynamicLessonGenerationScore {
  const needsIssueBackfill = score.issues.length === 0 && score.total < 100;
  const needsSummaryBackfill =
    !normalizeWhitespace(score.summary) || normalizeWhitespace(score.summary) === 'No scoring summary provided.';
  const phaseFeedback = score.phaseFeedback.length > 0 ? score.phaseFeedback : heuristicScore.phaseFeedback;
  const synthesizedIssues = phaseFeedback
    .filter((phase) => phase.issues.length > 0)
    .slice(0, 3)
    .map((phase, index) =>
      buildIssue(
        phase.stage === 'teach_check' ? 'markingRobustness' : 'beginnerClarity',
        `${phase.phaseTitle}: ${phase.issues[0]}`,
        phase.suggestedFixes[0] || 'Tighten this lesson phase.',
        {
          id: `PHASE-${index + 1}`,
          jsonPointers: [`/steps/${phase.phaseKey}`],
          excerpt: phase.phaseTitle,
          whyItMatters: 'Phase-level weaknesses should be visible in the overall score report.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  const summary = needsSummaryBackfill ? heuristicScore.summary : score.summary;
  const normalizedSummary =
    score.total >= 95
      ? summary
      : summary.includes('suitable for runtime testing')
        ? 'The lesson has a workable structure but still needs improvement before it clears the stricter dynamic quality gate.'
        : summary;

  return {
    ...score,
    total: Math.min(score.total, heuristicScore.total + 6),
    issues: needsIssueBackfill ? [...heuristicScore.issues, ...synthesizedIssues].slice(0, 10) : score.issues,
    phaseFeedback,
    summary: normalizedSummary,
  };
}

function applyBundledTaskGuardrails(
  score: DynamicLessonGenerationScore,
  heuristicScore: DynamicLessonGenerationScore,
  validation: DynamicLessonGenerationValidation
): DynamicLessonGenerationScore {
  const bundledHeuristicIssues = heuristicScore.issues.filter((issue) => /^GP-2$|^PR-2$|^INT-2$/i.test(issue.id ?? ''));
  if (bundledHeuristicIssues.length === 0) {
    return score;
  }

  const primaryBundledIssue = bundledHeuristicIssues[0];
  const existingBundledIndex = score.issues.findIndex((issue) =>
    /bundl|multiple distinct outputs|single response field|multi-part/i.test(issue.problem)
  );
  const breakdown = {
    ...score.breakdown,
    markingRobustness: Math.min(score.breakdown.markingRobustness, heuristicScore.breakdown.markingRobustness),
    questionQuality: Math.min(score.breakdown.questionQuality, heuristicScore.breakdown.questionQuality),
  };
  const total =
    breakdown.beginnerClarity +
    breakdown.teachingBeforeTesting +
    breakdown.markingRobustness +
    breakdown.alignmentToLO +
    breakdown.questionQuality;
  const grade: DynamicLessonGenerationScore['grade'] =
    !validation.passed ? 'rework' : total >= 95 ? 'ship' : total >= 90 ? 'strong' : total >= 80 ? 'usable' : 'rework';

  return {
    ...score,
    total,
    grade,
    breakdown,
    issues:
      existingBundledIndex >= 0
        ? [score.issues[existingBundledIndex], ...score.issues.filter((_, index) => index !== existingBundledIndex)].slice(0, 10)
        : [primaryBundledIssue, ...score.issues].slice(0, 10),
    summary: `${score.summary} A bundled-task guardrail was applied because one response field carries too many distinct required outputs.`,
  };
}

function buildIntroStep(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  nextStepId?: string
): DynamicGuidedV2Step {
  const outcomeLines = planning.inScope.slice(0, 3).map((item, index) => `${index + 1}. ${item}`);
  return {
    id: `${input.lessonCode.toLowerCase()}-intro`,
    sourceBlockId: `${input.lessonCode}-outcomes`,
    title: 'Intro',
    role: 'outcomes',
    stage: 'intro',
    progressionRule: 'auto',
    nextStepId,
    objective: planning.lessonAim || `Orient the learner to ${input.topic}.`,
    completionMode: 'continue',
    retrievalText: [
      `Lesson: ${input.title}`,
      planning.lessonAim || `This lesson focuses on ${input.topic}.`,
      outcomeLines.length > 0 ? 'By the end of this lesson you should be able to:' : 'By the end of this lesson you should understand the core lesson idea and apply it in practice.',
      ...outcomeLines,
      'We will work in short chunks: teaching first, then checks, then example, practice, and a final integrative task.',
    ].join('\n'),
  };
}

function buildLessonFromPhases(
  input: DynamicLessonGenerationInput,
  stagePlan: DynamicLessonStageDescriptor[],
  planning: DynamicPlanningPhaseOutput,
  explanations: DynamicExplanationPhaseOutput,
  checks: DynamicUnderstandingChecksPhaseOutput,
  workedExample: DynamicWorkedExamplePhaseOutput,
  applyOutput: DynamicApplyPhaseOutput,
  integration: DynamicIntegrationPhaseOutput
): DynamicGuidedV2Lesson {
  const steps: DynamicGuidedV2Step[] = [];
  const teachCheckDescriptors = stagePlan.filter((step) => step.stage === 'teach_check');
  const firstTeachCheck = teachCheckDescriptors[0];
  steps.push(buildIntroStep(input, planning, firstTeachCheck ? `${input.lessonCode.toLowerCase()}-${firstTeachCheck.key}` : undefined));

  teachCheckDescriptors.forEach((descriptor, index) => {
    const explanation = explanations.teachChecks[index];
    const check = checks.teachChecks[index];
    const nextDescriptor = stagePlan[stagePlan.indexOf(descriptor) + 1];
    const basicQuestions = check?.basicQuestions ?? [];
    steps.push({
      id: `${input.lessonCode.toLowerCase()}-${descriptor.key}`,
      sourceBlockId: `${input.lessonCode}-${descriptor.key}`,
      title: explanation?.title || check?.title || descriptor.title,
      role: 'explanation',
      stage: 'teach_check',
      progressionRule: 'feedback_deeper',
      nextStepId: nextDescriptor ? `${input.lessonCode.toLowerCase()}-${nextDescriptor.key}` : undefined,
      objective: explanation?.objective || planning.teachChecks[index]?.objective || descriptor.objective,
      completionMode: 'respond',
      retrievalText: joinLines(explanation?.retrievalTextLines ?? []),
      basicQuestions,
      questionText: combineBasicQuestions(basicQuestions),
      answerGuidance: aggregateAnswerGuidance(basicQuestions),
      deeperQuestionText: check?.deeperQuestionText,
      deeperAnswerGuidance: check?.deeperAnswerGuidance,
      hint: explanation?.hint || check?.hint,
    });
  });

  const workedDescriptor = stagePlan.find((step) => step.stage === 'worked_example');
  if (workedDescriptor) {
    const nextDescriptor = stagePlan[stagePlan.indexOf(workedDescriptor) + 1];
    steps.push({
      id: `${input.lessonCode.toLowerCase()}-${workedDescriptor.key}`,
      sourceBlockId: `${input.lessonCode}-${workedDescriptor.key}`,
      title: workedExample.title || workedDescriptor.title,
      role: 'worked_example',
      stage: 'worked_example',
      progressionRule: 'worked_example_feedback',
      nextStepId: nextDescriptor ? `${input.lessonCode.toLowerCase()}-${nextDescriptor.key}` : undefined,
      objective: workedExample.objective || planning.workedExampleObjective || workedDescriptor.objective,
      completionMode: 'respond',
      retrievalText: joinLines(workedExample.retrievalTextLines),
      hint: workedExample.hint,
    });
  }

  const guidedDescriptor = stagePlan.find((step) => step.stage === 'guided_practice');
  if (guidedDescriptor) {
    const nextDescriptor = stagePlan[stagePlan.indexOf(guidedDescriptor) + 1];
    steps.push({
      id: `${input.lessonCode.toLowerCase()}-${guidedDescriptor.key}`,
      sourceBlockId: `${input.lessonCode}-${guidedDescriptor.key}`,
      title: applyOutput.guidedPractice.title || guidedDescriptor.title,
      role: 'guided_practice',
      stage: 'guided_practice',
      progressionRule: guidedDescriptor.progressionRule,
      nextStepId: nextDescriptor ? `${input.lessonCode.toLowerCase()}-${nextDescriptor.key}` : undefined,
      objective: applyOutput.guidedPractice.objective || planning.guidedPracticeObjective || guidedDescriptor.objective,
      completionMode: guidedDescriptor.completionMode,
      retrievalText: joinLines(applyOutput.guidedPractice.retrievalTextLines),
      questionText: applyOutput.guidedPractice.questionText,
      answerGuidance: applyOutput.guidedPractice.answerGuidance,
      hint: applyOutput.guidedPractice.hint,
    });
  }

  const practiceDescriptor = stagePlan.find((step) => step.stage === 'practice');
  if (practiceDescriptor) {
    const nextDescriptor = stagePlan[stagePlan.indexOf(practiceDescriptor) + 1];
    steps.push({
      id: `${input.lessonCode.toLowerCase()}-${practiceDescriptor.key}`,
      sourceBlockId: `${input.lessonCode}-${practiceDescriptor.key}`,
      title: applyOutput.practice.title || practiceDescriptor.title,
      role: 'practice',
      stage: 'practice',
      progressionRule: practiceDescriptor.progressionRule,
      nextStepId: nextDescriptor ? `${input.lessonCode.toLowerCase()}-${nextDescriptor.key}` : undefined,
      objective: applyOutput.practice.objective || planning.practiceObjective || practiceDescriptor.objective,
      completionMode: practiceDescriptor.completionMode,
      retrievalText: joinLines(applyOutput.practice.retrievalTextLines),
      questionText: applyOutput.practice.questionText,
      answerGuidance: applyOutput.practice.answerGuidance,
      hint: applyOutput.practice.hint,
    });
  }

  const integrativeDescriptor = stagePlan.find((step) => step.stage === 'integrative');
  if (integrativeDescriptor) {
    steps.push({
      id: `${input.lessonCode.toLowerCase()}-${integrativeDescriptor.key}`,
      sourceBlockId: `${input.lessonCode}-${integrativeDescriptor.key}`,
      title: integration.integrative.title || integrativeDescriptor.title,
      role: 'integrative',
      stage: 'integrative',
      progressionRule: 'integrative_feedback',
      objective: integration.integrative.objective || planning.integrativeObjective || integrativeDescriptor.objective,
      completionMode: integrativeDescriptor.completionMode,
      retrievalText: joinLines(integration.integrative.retrievalTextLines),
      questionText: integration.integrative.questionText,
      answerGuidance: integration.integrative.answerGuidance,
      hint: integration.integrative.hint,
    });
  }

  return {
    lessonId: `dynamic-v2-generated-${input.lessonCode.toLowerCase()}`,
    lessonCode: input.lessonCode,
    title: input.title,
    subject: input.subject,
    unit: input.unit,
    audience: input.audience,
    tonePrompt: input.tonePrompt,
    comparisonSource: 'dynamic_generator',
    steps,
  };
}

function normalizeLesson(raw: unknown): DynamicGuidedV2Lesson | null {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null;
  if (!data) return null;
  const stepsRaw = Array.isArray(data.steps) ? data.steps : null;
  if (!stepsRaw) return null;

  const lessonCode = normalizeWhitespace(data.lessonCode);
  const title = normalizeWhitespace(data.title);
  const subject = normalizeWhitespace(data.subject);
  const unit = normalizeWhitespace(data.unit);
  const audience = normalizeWhitespace(data.audience);
  const tonePrompt = normalizeWhitespace(data.tonePrompt);
  const lessonId = normalizeWhitespace(data.lessonId);
  if (!lessonCode || !title || !unit || !lessonId) return null;

  const steps: DynamicGuidedV2Step[] = stepsRaw
    .map((item) => {
      const step = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      const stage = normalizeWhitespace(step.stage) as DynamicGuidedV2Step['stage'];
      const role = normalizeWhitespace(step.role) as DynamicGuidedV2Step['role'];
      const completionMode = normalizeWhitespace(step.completionMode) as DynamicGuidedV2Step['completionMode'];
      const progressionRule = normalizeWhitespace(step.progressionRule) as DynamicGuidedV2Step['progressionRule'];
      return {
        id: normalizeWhitespace(step.id),
        sourceBlockId: normalizeWhitespace(step.sourceBlockId),
        title: normalizeWhitespace(step.title),
        role,
        stage,
        progressionRule: progressionRule || undefined,
        nextStepId: normalizeWhitespace(step.nextStepId) || undefined,
        objective: normalizeWhitespace(step.objective),
        retrievalText: String(step.retrievalText ?? ''),
        completionMode: completionMode === 'continue' ? 'continue' : 'respond',
        basicQuestions: coerceBasicQuestions(step.basicQuestions),
        questionText: normalizeWhitespace(step.questionText) || undefined,
        answerGuidance: unique(arrayOfStrings(step.answerGuidance)),
        deeperQuestionText: normalizeWhitespace(step.deeperQuestionText) || undefined,
        deeperAnswerGuidance: unique(arrayOfStrings(step.deeperAnswerGuidance)),
        hint: normalizeWhitespace(step.hint) || undefined,
      } satisfies DynamicGuidedV2Step;
    })
    .filter((step) => step.id && step.sourceBlockId && step.title && step.role && step.stage && step.objective && step.retrievalText);

  if (steps.length === 0) return null;

  return {
    lessonId,
    lessonCode,
    title,
    subject,
    unit,
    audience,
    tonePrompt,
    comparisonSource: 'dynamic_generator',
    steps,
  };
}

function buildIssue(
  category: DynamicLessonGenerationScore['issues'][number]['category'],
  problem: string,
  suggestion: string,
  extras?: Partial<DynamicLessonGenerationScore['issues'][number]>
): DynamicLessonGenerationScore['issues'][number] {
  return {
    category,
    problem,
    suggestion,
    ...extras,
  };
}

export function validateDynamicLesson(lesson: DynamicGuidedV2Lesson): DynamicLessonGenerationValidation {
  const issues: string[] = [];
  if (lesson.steps.length < 6) {
    issues.push('Lesson has too few steps.');
  }

  const intro = lesson.steps.find((step) => step.stage === 'intro');
  if (!intro) issues.push('Missing intro step.');

  const teachChecks = lesson.steps.filter((step) => step.stage === 'teach_check');
  if (teachChecks.length < 2) issues.push('Lesson must contain at least two teach/check steps.');
  for (const step of teachChecks) {
    if (!hasSubstantiveTeachingText(step.retrievalText, 35)) {
      issues.push(`${step.title} retrieval text is too thin or placeholder-like.`);
    }
    if (!step.basicQuestions || step.basicQuestions.length !== 3) {
      issues.push(`${step.title} must include exactly 3 explicit basic questions.`);
    } else {
      const uniqueQuestionTexts = new Set<string>();
      step.basicQuestions.forEach((question, index) => {
        const normalizedQuestion = normalizeWhitespace(question.questionText);
        uniqueQuestionTexts.add(normalizedQuestion.toLowerCase());
        if (wordCount(normalizedQuestion) < 4 || containsPlaceholderLanguage(normalizedQuestion)) {
          issues.push(`${step.title} question ${index + 1} is generic or placeholder-like.`);
        }
        if (question.answerGuidance.length < 2) {
          issues.push(`${step.title} question ${index + 1} is missing specific answer guidance.`);
        }
        if (question.answerGuidance.some((item) => containsPlaceholderLanguage(item))) {
          issues.push(`${step.title} question ${index + 1} has placeholder answer guidance.`);
        }
      });
      if (uniqueQuestionTexts.size !== 3) {
        issues.push(`${step.title} must contain 3 distinct basic questions.`);
      }
    }
    if (!step.deeperQuestionText || wordCount(step.deeperQuestionText) < 6 || containsPlaceholderLanguage(step.deeperQuestionText)) {
      issues.push(`${step.title} deeper question is missing or generic.`);
    }
    if (
      !step.deeperAnswerGuidance?.length ||
      isGenericGuidanceList(step.deeperAnswerGuidance) ||
      step.deeperAnswerGuidance.some((item) => containsPlaceholderLanguage(item))
    ) {
      issues.push(`${step.title} deeper answer guidance is missing or placeholder-like.`);
    }
    if (step.progressionRule !== 'feedback_deeper') {
      issues.push(`${step.title} must use feedback_deeper progression.`);
    }
  }

  const workedExample = lesson.steps.find((step) => step.stage === 'worked_example');
  if (!workedExample) {
    issues.push('Missing worked example step.');
  } else {
    const structure = workedExampleStructure(workedExample.retrievalText);
    if (
      structure.lines.length < 4 ||
      structure.stepLines.length < 2 ||
      !structure.hasResult ||
      !structure.hasTakeaway ||
      wordCount(workedExample.retrievalText) < 35 ||
      containsPlaceholderLanguage(workedExample.retrievalText)
    ) {
      issues.push('Worked example must include real steps, a result, and a takeaway.');
    }
    if (workedExample.progressionRule !== 'worked_example_feedback') {
      issues.push('Worked example must use worked_example_feedback progression.');
    }
  }

  const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
  if (!guidedPractice) {
    issues.push('Missing guided practice step.');
  } else {
    if (!guidedPractice.questionText || wordCount(guidedPractice.questionText) < 6 || containsPlaceholderLanguage(guidedPractice.questionText)) {
      issues.push('Guided practice question is missing or generic.');
    }
    if (!guidedPractice.answerGuidance?.length || isGenericGuidanceList(guidedPractice.answerGuidance)) {
      issues.push('Guided practice answer guidance is missing or placeholder-like.');
    }
    if (!guidedPractice.retrievalText || containsPlaceholderLanguage(guidedPractice.retrievalText)) {
      issues.push('Guided practice retrieval text is placeholder-like.');
    }
  }

  const practice = lesson.steps.find((step) => step.stage === 'practice');
  if (!practice) {
    issues.push('Missing practice step.');
  } else {
    if (!practice.questionText || wordCount(practice.questionText) < 6 || containsPlaceholderLanguage(practice.questionText)) {
      issues.push('Practice question is missing or generic.');
    }
    if (!practice.answerGuidance?.length || isGenericGuidanceList(practice.answerGuidance)) {
      issues.push('Practice answer guidance is missing or placeholder-like.');
    }
    if (!practice.retrievalText || containsPlaceholderLanguage(practice.retrievalText)) {
      issues.push('Practice retrieval text is placeholder-like.');
    }
  }

  const integrative = lesson.steps.find((step) => step.stage === 'integrative');
  if (!integrative) {
    issues.push('Missing integrative step.');
  } else {
    if (!integrative.questionText || wordCount(integrative.questionText) < 6 || containsPlaceholderLanguage(integrative.questionText)) {
      issues.push('Integrative question is missing or generic.');
    }
    if (!integrative.answerGuidance?.length || isGenericGuidanceList(integrative.answerGuidance)) {
      issues.push('Integrative answer guidance is missing or placeholder-like.');
    }
    if (!integrative.retrievalText || containsPlaceholderLanguage(integrative.retrievalText)) {
      issues.push('Integrative retrieval text is placeholder-like.');
    }
    if (integrative.progressionRule !== 'integrative_feedback') {
      issues.push('Integrative step must use integrative_feedback progression.');
    }
  }

  for (let index = 0; index < lesson.steps.length - 1; index += 1) {
    const step = lesson.steps[index];
    if (!step.nextStepId) {
      issues.push(`${step.title} is missing nextStepId.`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}

export function scoreDynamicLesson(
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation
): DynamicLessonGenerationScore {
  let beginnerClarity = SCORE_MAX.beginnerClarity;
  let teachingBeforeTesting = SCORE_MAX.teachingBeforeTesting;
  let markingRobustness = SCORE_MAX.markingRobustness;
  let alignmentToLO = SCORE_MAX.alignmentToLO;
  let questionQuality = SCORE_MAX.questionQuality;
  const issues: DynamicLessonGenerationScore['issues'] = [];

  const teachChecks = lesson.steps.filter((step) => step.stage === 'teach_check');
  if (teachChecks.length < 2) {
    alignmentToLO -= 8;
    issues.push(buildIssue('alignmentToLO', 'The lesson does not sustain the repeated teach/check pattern.', 'Include at least two teach/check sections with distinct concepts.', { id: 'ALIGN-1', jsonPointers: ['/steps'], excerpt: 'teach_check count', whyItMatters: 'The runtime expects repeated chunk learning before later practice.', alignmentGap: 'GENERAL PEDAGOGY' }));
  }

  teachChecks.forEach((step, index) => {
    if (!hasSubstantiveTeachingText(step.retrievalText, 35)) {
      beginnerClarity -= 8;
      teachingBeforeTesting -= 8;
      issues.push(buildIssue('teachingBeforeTesting', `${step.title} does not teach enough before questioning.`, 'Strengthen the explanation with concrete, grounded teaching before the questions.', { id: `TBT-${index + 1}`, jsonPointers: [`/steps/${index + 1}/retrievalText`], excerpt: step.retrievalText.slice(0, 140), whyItMatters: 'Learners cannot answer reliably if the concept has not been clearly taught first.', alignmentGap: 'GENERAL PEDAGOGY' }));
    }
    if (!step.basicQuestions || step.basicQuestions.length !== 3) {
      markingRobustness -= 8;
      questionQuality -= 8;
      issues.push(buildIssue('questionQuality', `${step.title} does not contain exactly 3 clear short-answer questions.`, 'Use exactly 3 concrete short-answer questions with distinct answer targets.', { id: `QQ-${index + 1}`, jsonPointers: [`/steps/${index + 1}/basicQuestions`], excerpt: step.questionText?.slice(0, 140) ?? '', whyItMatters: 'The runtime and feedback stages assume a fixed three-question check.', alignmentGap: 'GENERAL PEDAGOGY' }));
    }
    if (!step.deeperQuestionText || containsPlaceholderLanguage(step.deeperQuestionText)) {
      alignmentToLO -= 5;
      questionQuality -= 4;
      issues.push(buildIssue('alignmentToLO', `${step.title} deeper question is too weak to gate real understanding.`, 'Write a reasoning question that connects the taught facts and asks why or how.', { id: `DQ-${index + 1}`, jsonPointers: [`/steps/${index + 1}/deeperQuestionText`], excerpt: step.deeperQuestionText ?? '', whyItMatters: 'The deeper stage is the progression gate for concept security.', alignmentGap: 'GENERAL PEDAGOGY' }));
    }
    if (!step.deeperAnswerGuidance?.length || isGenericGuidanceList(step.deeperAnswerGuidance)) {
      markingRobustness -= 4;
      issues.push(buildIssue('markingRobustness', `${step.title} deeper answer guidance is too weak to mark reliably.`, 'Provide specific key points for the deeper answer.', { id: `MR-${index + 1}`, jsonPointers: [`/steps/${index + 1}/deeperAnswerGuidance`], excerpt: JSON.stringify(step.deeperAnswerGuidance ?? []), whyItMatters: 'Weak targets make feedback inconsistent and noisy.', alignmentGap: 'GENERAL PEDAGOGY' }));
    }
  });

  const workedExample = lesson.steps.find((step) => step.stage === 'worked_example');
  const workedSummary = workedExample ? workedExampleStructure(workedExample.retrievalText) : null;
  if (!workedExample || !workedSummary || workedSummary.stepLines.length < 2 || !workedSummary.hasResult || !workedSummary.hasTakeaway) {
    beginnerClarity -= 8;
    teachingBeforeTesting -= 5;
    issues.push(buildIssue('beginnerClarity', 'Worked example is too thin or incomplete.', 'Include a concrete scenario, numbered steps, a result, and a takeaway.', { id: 'WE-1', jsonPointers: ['/steps'], excerpt: workedExample?.retrievalText?.slice(0, 180) ?? '', whyItMatters: 'The worked example is the model learners use before guided practice.', alignmentGap: 'GENERAL PEDAGOGY' }));
  }

  const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
  if (!guidedPractice?.questionText || !guidedPractice.answerGuidance?.length) {
    markingRobustness -= 5;
    questionQuality -= 4;
    issues.push(buildIssue('questionQuality', 'Guided practice does not provide a concrete supported task.', 'Set one clear task with answer targets that mirrors the worked example.', { id: 'GP-1', jsonPointers: ['/steps'], excerpt: guidedPractice?.questionText ?? '', whyItMatters: 'Guided practice should transition learners from modelling to supported doing.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (isSeverelyBundledTask(guidedPractice.questionText, guidedPractice.answerGuidance)) {
    markingRobustness -= 4;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Guided practice asks for multiple mixed outputs in one learner response field.',
        'Split the guided task or clearly label each required answer part so each output can be marked independently.',
        {
          id: 'GP-2',
          jsonPointers: ['/steps'],
          excerpt: guidedPractice.questionText.slice(0, 180),
          whyItMatters: 'Mixed-output guided tasks are hard to mark and weaken the bridge from worked example to supported practice.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (hasThinGuidanceForBundledTask(guidedPractice.questionText, guidedPractice.answerGuidance)) {
    markingRobustness -= 4;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Guided practice bundles multiple sub-tasks without granular answer guidance.',
        'Provide one answer target per sub-task, or reduce the prompt to a single supported task.',
        {
          id: 'GP-2',
          jsonPointers: ['/steps'],
          excerpt: guidedPractice.questionText.slice(0, 180),
          whyItMatters: 'Bundled guided tasks are harder to mark reliably and weaken the support bridge from the worked example.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  }

  const practice = lesson.steps.find((step) => step.stage === 'practice');
  if (!practice?.questionText || !practice.answerGuidance?.length) {
    markingRobustness -= 4;
    questionQuality -= 4;
    issues.push(buildIssue('questionQuality', 'Practice does not provide a properly independent task.', 'Make practice concrete and slightly less scaffolded than guided practice.', { id: 'PR-1', jsonPointers: ['/steps'], excerpt: practice?.questionText ?? '', whyItMatters: 'Independent practice checks whether the learner can apply the idea without heavy support.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (isSeverelyBundledTask(practice.questionText, practice.answerGuidance)) {
    markingRobustness -= 4;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Practice asks for multiple mixed outputs in one learner response field.',
        'Split the task or label each expected answer separately so marking can evaluate each output independently.',
        {
          id: 'PR-2',
          jsonPointers: ['/steps'],
          excerpt: practice.questionText.slice(0, 180),
          whyItMatters: 'Independent practice becomes unreliable when one response box carries several different output types or scenarios.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (hasThinGuidanceForBundledTask(practice.questionText, practice.answerGuidance)) {
    markingRobustness -= 3;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Practice bundles multiple sub-tasks without enough answer guidance.',
        'Either split the task or provide one clear answer target per sub-part.',
        {
          id: 'PR-2',
          jsonPointers: ['/steps'],
          excerpt: practice.questionText.slice(0, 180),
          whyItMatters: 'Independent practice still needs enough structure for reliable marking and feedback.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  }

  const integrative = lesson.steps.find((step) => step.stage === 'integrative');
  if (!integrative?.questionText || !integrative.answerGuidance?.length) {
    alignmentToLO -= 4;
    questionQuality -= 3;
    issues.push(buildIssue('alignmentToLO', 'Integrative task is too weak to test synthesis.', 'Ask the learner to pull the lesson ideas together in one applied explanation.', { id: 'INT-1', jsonPointers: ['/steps'], excerpt: integrative?.questionText ?? '', whyItMatters: 'The close should test synthesis, not just another recall check.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (isSeverelyBundledTask(integrative.questionText, integrative.answerGuidance)) {
    markingRobustness -= 4;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Integrative task asks for multiple mixed outputs in one learner response field.',
        'Simplify the synthesis task or label each expected answer component so the final response remains markable.',
        {
          id: 'INT-2',
          jsonPointers: ['/steps'],
          excerpt: integrative.questionText.slice(0, 180),
          whyItMatters: 'Even synthesis tasks need a markable structure when they ask for several different outputs.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (hasThinGuidanceForBundledTask(integrative.questionText, integrative.answerGuidance)) {
    markingRobustness -= 3;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Integrative task bundles multiple required outputs without enough answer guidance.',
        'Provide answer targets that map clearly to each required part of the synthesis task.',
        {
          id: 'INT-2',
          jsonPointers: ['/steps'],
          excerpt: integrative.questionText.slice(0, 180),
          whyItMatters: 'Even synthesis tasks need enough marking structure to support the final feedback gate.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  }

  if (validation.issues.length > 0) {
    beginnerClarity = Math.min(beginnerClarity, 10);
    teachingBeforeTesting = Math.min(teachingBeforeTesting, 8);
    markingRobustness = Math.min(markingRobustness, 6);
    alignmentToLO = Math.min(alignmentToLO, 6);
    questionQuality = Math.min(questionQuality, 5);
    validation.issues.slice(0, 4).forEach((issue, index) => {
      issues.push(buildIssue('alignmentToLO', issue, 'Fix the validation failure before treating this as runnable.', { id: `VAL-${index + 1}`, jsonPointers: ['/steps'], excerpt: issue, whyItMatters: 'Hard validation failures mean the lesson is not safe to run as a strong draft.', alignmentGap: 'GENERAL PEDAGOGY' }));
    });
  }

  beginnerClarity = clamp(beginnerClarity, 0, SCORE_MAX.beginnerClarity);
  teachingBeforeTesting = clamp(teachingBeforeTesting, 0, SCORE_MAX.teachingBeforeTesting);
  markingRobustness = clamp(markingRobustness, 0, SCORE_MAX.markingRobustness);
  alignmentToLO = clamp(alignmentToLO, 0, SCORE_MAX.alignmentToLO);
  questionQuality = clamp(questionQuality, 0, SCORE_MAX.questionQuality);

  const rawTotal = beginnerClarity + teachingBeforeTesting + markingRobustness + alignmentToLO + questionQuality;
  const total = validation.passed ? rawTotal : Math.min(rawTotal, 60);
  const grade: DynamicLessonGenerationScore['grade'] =
    !validation.passed ? 'rework' : total >= 95 ? 'ship' : total >= 90 ? 'strong' : total >= 80 ? 'usable' : 'rework';

  return {
    total,
    grade,
    breakdown: {
      beginnerClarity,
      teachingBeforeTesting,
      markingRobustness,
      alignmentToLO,
      questionQuality,
    },
    issues: issues.slice(0, 10),
    phaseFeedback: derivePhaseFeedback(lesson, validation),
    summary:
      !validation.passed
        ? 'The lesson fails hard validation and cannot be treated as a runnable draft.'
        : total >= 95
          ? 'The lesson is strong across the core pedagogy domains and is suitable for runtime testing.'
          : 'The lesson needs further improvement before it matches the stricter V1 quality bar.',
  };
}

function normalizeScore(raw: unknown, validation: DynamicLessonGenerationValidation): DynamicLessonGenerationScore {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const breakdownRaw = data.breakdown && typeof data.breakdown === 'object'
    ? (data.breakdown as Record<string, unknown>)
    : {};
  const breakdown = {
    beginnerClarity: clamp(Number(breakdownRaw.beginnerClarity ?? 0), 0, SCORE_MAX.beginnerClarity),
    teachingBeforeTesting: clamp(Number(breakdownRaw.teachingBeforeTesting ?? 0), 0, SCORE_MAX.teachingBeforeTesting),
    markingRobustness: clamp(Number(breakdownRaw.markingRobustness ?? 0), 0, SCORE_MAX.markingRobustness),
    alignmentToLO: clamp(Number(breakdownRaw.alignmentToLO ?? 0), 0, SCORE_MAX.alignmentToLO),
    questionQuality: clamp(Number(breakdownRaw.questionQuality ?? 0), 0, SCORE_MAX.questionQuality),
  };
  const total = breakdown.beginnerClarity + breakdown.teachingBeforeTesting + breakdown.markingRobustness + breakdown.alignmentToLO + breakdown.questionQuality;
  const issuesRaw = Array.isArray(data.issues) ? data.issues : [];
  const issues = issuesRaw
    .map((item, index) => {
      const issue = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      const category = normalizeWhitespace(issue.category) as DynamicLessonGenerationScore['issues'][number]['category'];
      return {
        id: normalizeWhitespace(issue.id) || `ISSUE-${index + 1}`,
        category:
          category === 'beginnerClarity' ||
          category === 'teachingBeforeTesting' ||
          category === 'markingRobustness' ||
          category === 'alignmentToLO' ||
          category === 'questionQuality'
            ? category
            : 'beginnerClarity',
        jsonPointers: arrayOfStrings(issue.jsonPointers),
        excerpt: normalizeWhitespace(issue.excerpt),
        problem: normalizeWhitespace(issue.problem),
        whyItMatters: normalizeWhitespace(issue.whyItMatters),
        alignmentGap: normalizeWhitespace(issue.alignmentGap),
        suggestion: normalizeWhitespace(issue.suggestion) || normalizeWhitespace(issue.whyItMatters) || 'Tighten the affected lesson content.',
      };
    })
    .filter((issue) => issue.problem)
    .slice(0, 10);

  const grade: DynamicLessonGenerationScore['grade'] =
    !validation.passed ? 'rework' : total >= 95 ? 'ship' : total >= 90 ? 'strong' : total >= 80 ? 'usable' : 'rework';

  const phaseFeedbackRaw = Array.isArray(data.phaseFeedback) ? data.phaseFeedback : [];
  const phaseFeedback = phaseFeedbackRaw
    .map((item) => {
      const phase = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      const status = normalizeWhitespace(phase.status).toLowerCase();
      return {
        phaseKey: normalizeWhitespace(phase.phaseKey),
        phaseTitle: normalizeWhitespace(phase.phaseTitle),
        stage: normalizeWhitespace(phase.stage),
        status: status === 'weak' || status === 'mixed' ? status : 'strong',
        strengths: arrayOfStrings(phase.strengths),
        issues: arrayOfStrings(phase.issues),
        suggestedFixes: arrayOfStrings(phase.suggestedFixes),
      };
    })
    .filter((item) => item.phaseTitle || item.phaseKey);

  return {
    total: validation.passed ? total : Math.min(total, 60),
    grade,
    breakdown,
    issues,
    phaseFeedback,
    summary: normalizeWhitespace(data.summary) || normalizeWhitespace((data as { overallAssessment?: unknown }).overallAssessment) || 'No scoring summary provided.',
  };
}

function applyFallbackScoringGuardrails(
  score: DynamicLessonGenerationScore,
  validation: DynamicLessonGenerationValidation,
  usedFallback: boolean
): DynamicLessonGenerationScore {
  if (!usedFallback) return score;

  const cappedTotal = Math.min(score.total, 94);
  const grade: DynamicLessonGenerationScore['grade'] =
    !validation.passed ? 'rework' : cappedTotal >= 95 ? 'ship' : cappedTotal >= 90 ? 'strong' : cappedTotal >= 80 ? 'usable' : 'rework';

  return {
    ...score,
    total: cappedTotal,
    grade,
    issues: [
      buildIssue(
        'markingRobustness',
        'The Phase 10 scorer response was malformed, so a local fallback scorer was used.',
        'Do not treat this as a perfect score. Re-run generation or inspect the Phase 10 raw output before trusting the result.',
        {
          id: 'SCORE-FALLBACK-1',
          jsonPointers: ['/phaseArtifacts/phase10'],
          excerpt: 'Phase 10 fallback scoring',
          whyItMatters: 'The local fallback scorer is intentionally stricter and less authoritative than a clean Phase 10 model score.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      ),
      ...score.issues,
    ].slice(0, 10),
    phaseFeedback: score.phaseFeedback,
    summary: `${score.summary} Phase 10 scoring fell back to the local heuristic because the model score was malformed.`,
  };
}

function applySourceGroundingGuardrails(
  score: DynamicLessonGenerationScore,
  validation: DynamicLessonGenerationValidation,
  assessment: SourceGroundingAssessment
): DynamicLessonGenerationScore {
  if (assessment.issues.length === 0 && assessment.capsScoreAt == null) {
    return score;
  }

  const cappedTotal = assessment.capsScoreAt == null ? score.total : Math.min(score.total, assessment.capsScoreAt);
  const cappedGrade: DynamicLessonGenerationScore['grade'] =
    !validation.passed ? 'rework' : cappedTotal >= 95 ? 'ship' : cappedTotal >= 90 ? 'strong' : cappedTotal >= 80 ? 'usable' : 'rework';

  const groundingIssues = assessment.issues.map((issue, index) =>
    buildIssue(
      'alignmentToLO',
      issue.problem,
      issue.suggestion,
      {
        id: `GROUND-${index + 1}`,
        jsonPointers: ['/sourceText'],
        excerpt: 'source grounding',
        whyItMatters: 'Thin grounding makes the generator and scorer more likely to overfit or invent detail.',
        alignmentGap: 'GENERAL PEDAGOGY',
      }
    )
  );

  return {
    ...score,
    total: cappedTotal,
    grade: cappedGrade,
    issues: [...groundingIssues, ...score.issues].slice(0, 10),
    phaseFeedback: score.phaseFeedback,
    summary:
      groundingIssues.length > 0
        ? `${score.summary} Source-grounding guardrails also flagged the draft as under-evidenced.`
        : score.summary,
  };
}

function compareScores(
  originalScore: DynamicLessonGenerationScore,
  candidateScore: DynamicLessonGenerationScore,
  candidateValidationPassed: boolean,
  refined: boolean
): DynamicLessonAcceptanceDecision {
  const regressions: string[] = [];
  (Object.keys(SCORE_MAX) as ScoreCategory[]).forEach((key) => {
    if (candidateScore.breakdown[key] < originalScore.breakdown[key]) {
      regressions.push(`${key} ${originalScore.breakdown[key]}->${candidateScore.breakdown[key]}`);
    }
  });

  const issuesImproved = candidateScore.issues.length <= originalScore.issues.length;
  const totalImproved = candidateScore.total > originalScore.total;
  const sameScore = candidateScore.total === originalScore.total;
  const meetsGate = candidateScore.total >= 95 && candidateValidationPassed;
  const accepted = meetsGate && regressions.length === 0 && (!refined || totalImproved || (sameScore && issuesImproved));

  let reason = '';
  if (!candidateValidationPassed) {
    reason = refined
      ? 'Refined candidate failed hard validation, so the original draft was kept.'
      : 'Draft fails hard validation.';
  } else if (candidateScore.total < 95) {
    reason = `Candidate score ${candidateScore.total} is below the 95 acceptance gate.`;
  } else if (regressions.length > 0) {
    reason = `Candidate regressed on protected score domains: ${regressions.join(', ')}`;
  } else if (refined && !(totalImproved || (sameScore && issuesImproved))) {
    reason = 'Refined candidate did not improve total score or reduce issue count.';
  } else {
    reason = refined
      ? 'Refined candidate cleared the 95 acceptance gate with no score regressions.'
      : 'Original draft cleared the 95 acceptance gate without refinement.';
  }

  return {
    accepted,
    reason,
    originalScore,
    candidateScore,
    regressions,
  };
}

export class DynamicLessonGenerator {
  private async runJsonPhase<T>(
    input: DynamicLessonGenerationInput,
    phaseName: string,
    prompt: PromptPair,
    coerce: (raw: unknown) => T,
    phases: DynamicGenerationPhaseArtifact[],
    options?: { temperature?: number; maxOutputTokens?: number }
  ): Promise<JsonPhaseResult<T>> {
    const startedAt = nowIso();
    const startedAtMs = Date.now();
    logGenerationEvent(input, `${phaseName} start`, {
      temperature: options?.temperature ?? 0.25,
      maxOutputTokens: options?.maxOutputTokens ?? 4096,
    });
    const client = await getClient();
    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      systemInstruction: prompt.system,
      generationConfig: {
        temperature: options?.temperature ?? 0.25,
        maxOutputTokens: options?.maxOutputTokens ?? 4096,
        responseMimeType: 'application/json',
      },
    });

    try {
      const result = await model.generateContent(prompt.user);
      const rawText = result.response.text();
      const parsed = coerce(parseJson<unknown>(rawText));
      phases.push({
        phase: phaseName,
        status: 'completed',
        output: {
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
          rawText,
          parsed,
        },
        startedAt,
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, `${phaseName} completed`, {
        durationMs: durationMs(startedAtMs),
      });
      return { parsed, rawText, prompt };
    } catch (error) {
      phases.push({
        phase: phaseName,
        status: 'failed',
        output: {
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
          error: error instanceof Error ? error.message : String(error),
        },
        startedAt,
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, `${phaseName} failed`, {
        durationMs: durationMs(startedAtMs),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async generate(input: DynamicLessonGenerationInput): Promise<DynamicLessonGenerationResult> {
    const phases: DynamicGenerationPhaseArtifact[] = [];
    const stagePlan = input.stagePlan && input.stagePlan.length > 0 ? input.stagePlan : defaultStagePlan(input);
    const runStartedAtMs = Date.now();

    logGenerationEvent(input, 'run start', {
      title: input.lessonTitle,
      topic: input.topic,
      stageCount: stagePlan.length,
      sourceContext: input.sourceContext ?? null,
    });

    const planning = (
      await this.runJsonPhase(
        input,
        'Phase 1 Planning',
        buildDynamicPlanningPrompt(input, stagePlan),
        (raw) => coercePlanningOutput(raw, stagePlan),
        phases,
        { temperature: 0.2, maxOutputTokens: 2200 }
      )
    ).parsed;

    const vocabulary = (
      await this.runJsonPhase(
        input,
        'Phase 2 Vocabulary',
        buildDynamicVocabularyPrompt(input, planning, stagePlan),
        (raw) => coerceVocabularyOutput(raw),
        phases,
        { temperature: 0.2, maxOutputTokens: 2200 }
      )
    ).parsed;

    const sourceGrounding = assessSourceGrounding(input, planning, vocabulary);
    const phase2Artifact = phases.find((phase) => phase.phase === 'Phase 2 Vocabulary');
    if (phase2Artifact) {
      phase2Artifact.output = {
        ...(phase2Artifact.output as Record<string, unknown>),
        sourceGrounding,
      };
      if (sourceGrounding.issues.length > 0) {
        phase2Artifact.status = 'failed';
      }
    }
    logGenerationEvent(input, 'source grounding assessed', {
      capsScoreAt: sourceGrounding.capsScoreAt,
      issueCount: sourceGrounding.issues.length,
      issues: sourceGrounding.issues.map((issue) => issue.problem),
    });

    const explanations = (
      await this.runJsonPhase(
        input,
        'Phase 3 Explanation',
        buildDynamicExplanationPrompt(input, planning, vocabulary, stagePlan),
        (raw) => coerceExplanationOutput(raw, planning),
        phases,
        { temperature: 0.35, maxOutputTokens: 3200 }
      )
    ).parsed;

    const checks = (
      await this.runJsonPhase(
        input,
        'Phase 4 Understanding Checks',
        buildDynamicUnderstandingChecksPrompt(input, planning, explanations, vocabulary, stagePlan),
        (raw) => coerceUnderstandingChecksOutput(raw, planning, vocabulary),
        phases,
        { temperature: 0.2, maxOutputTokens: 2600 }
      )
    ).parsed;

    const workedExample = (
      await this.runJsonPhase(
        input,
        'Phase 5 Worked Example',
        buildDynamicWorkedExamplePrompt(input, planning, vocabulary, explanations, checks, stagePlan),
        (raw) => coerceWorkedExampleOutput(raw),
        phases,
        { temperature: 0.3, maxOutputTokens: 2200 }
      )
    ).parsed;

    const practice = (
      await this.runJsonPhase(
        input,
        'Phase 6 Practice',
        buildDynamicPracticePrompt(input, planning, vocabulary, workedExample, stagePlan),
        (raw) => coerceApplyOutput(raw),
        phases,
        { temperature: 0.3, maxOutputTokens: 2400 }
      )
    ).parsed;

    const integration = (
      await this.runJsonPhase(
        input,
        'Phase 7 Integration',
        buildDynamicIntegrationPrompt(input, planning, vocabulary, explanations, practice, stagePlan),
        (raw) => coerceIntegrationOutput(raw),
        phases,
        { temperature: 0.25, maxOutputTokens: 1800 }
      )
    ).parsed;

    const spacedReview = (
      await this.runJsonPhase(
        input,
        'Phase 8 Spaced Review',
        buildDynamicSpacedReviewPrompt(input, planning, vocabulary, stagePlan),
        (raw) => coerceSpacedReviewOutput(raw),
        phases,
        { temperature: 0.2, maxOutputTokens: 1600 }
      )
    ).parsed;

    const lesson = buildLessonFromPhases(input, stagePlan, planning, explanations, checks, workedExample, practice, integration);
    phases.push({
      phase: 'Phase 9 Assembler',
      status: 'completed',
      output: {
        lesson,
        spacedReview,
      },
      startedAt: nowIso(),
      finishedAt: nowIso(),
    });
    logGenerationEvent(input, 'Phase 9 Assembler completed', {
      stepCount: lesson.steps.length,
      teachCheckCount: lesson.steps.filter((step) => step.stage === 'teach_check').length,
    });

    const validation = validateDynamicLesson(lesson);
    logGenerationEvent(input, 'validation complete', {
      passed: validation.passed,
      issueCount: validation.issues.length,
      issues: validation.issues,
    });
    const phase10Prompt = buildDynamicScorePrompt(input, lesson, validation.issues, planning, vocabulary, spacedReview);
    let scoreRaw: unknown = null;
    let phase10UsedFallback = false;
    try {
      scoreRaw = (
        await this.runJsonPhase(
          input,
          'Phase 10 Score',
          phase10Prompt,
          (raw) => raw,
          phases,
          { temperature: 0.0, maxOutputTokens: 3200 }
        )
      ).parsed;
    } catch {
      scoreRaw = null;
    }
    phase10UsedFallback = !scoreRaw;
    const heuristicScore = scoreDynamicLesson(lesson, validation);
    const score = ensurePhaseFeedback(
      strengthenScoreReport(
        applyBundledTaskGuardrails(
          applySourceGroundingGuardrails(
            applyFallbackScoringGuardrails(
              scoreRaw ? normalizeScore(scoreRaw, validation) : heuristicScore,
              validation,
              phase10UsedFallback
            ),
            validation,
            sourceGrounding
          ),
          heuristicScore,
          validation
        ),
        heuristicScore
      ),
      lesson,
      validation
    );
    const phase10Artifact = phases.find((phase) => phase.phase === 'Phase 10 Score');
    if (phase10Artifact) {
      phase10Artifact.output = {
        ...(phase10Artifact.output as Record<string, unknown>),
        parseFailed: phase10UsedFallback,
        parsed: score,
      };
      phase10Artifact.status = validation.passed ? 'completed' : 'failed';
    }
    logGenerationEvent(input, 'Phase 10 Score evaluated', {
      score: score.total,
      grade: score.grade,
      validationPassed: validation.passed,
      issueCount: score.issues.length,
      fallbackUsed: phase10UsedFallback,
      topIssue: score.issues[0]?.problem ?? null,
    });

    let fixPlan: DynamicFixPlan | null = null;
    if (score.total < 95 || !validation.passed) {
      fixPlan = (
        await this.runJsonPhase(
          input,
          'Phase 11 Suggest Fixes',
          buildDynamicFixPlanPrompt(lesson, score),
          (raw) => coerceFixPlan(raw, score),
          phases,
          { temperature: 0.1, maxOutputTokens: 2200 }
        )
      ).parsed;
      logGenerationEvent(input, 'Phase 11 Suggest Fixes completed', {
        fixCount: fixPlan.fixes.length,
        targetPhases: unique(fixPlan.fixes.map((fix) => fix.phaseKey)).length,
      });
    } else {
      phases.push({
        phase: 'Phase 11 Suggest Fixes',
        status: 'completed',
        output: { skipped: true, reason: 'Original draft already cleared the score gate.' },
        startedAt: nowIso(),
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, 'Phase 11 Suggest Fixes skipped', {
        reason: 'Original draft already cleared the score gate.',
      });
    }

    let refined = false;
    let candidateLesson: DynamicGuidedV2Lesson = lesson;
    let candidateValidation = validation;
    let candidateScore = score;

    if ((score.total < 91 || !validation.passed) && fixPlan) {
      const refineResult = await this.runJsonPhase(
        input,
        'Phase 12 Refine',
        buildDynamicRefinePrompt(input, lesson, score, fixPlan, stagePlan),
        (raw) => raw,
        phases,
        { temperature: 0.25, maxOutputTokens: 7000 }
      );
      const parsedLesson = normalizeLesson(refineResult.parsed);
      if (parsedLesson) {
        candidateLesson = parsedLesson;
        candidateValidation = validateDynamicLesson(candidateLesson);
        refined = true;
      }
      const phase12Artifact = phases.find((phase) => phase.phase === 'Phase 12 Refine');
      if (phase12Artifact) {
        phase12Artifact.output = {
          ...(phase12Artifact.output as Record<string, unknown>),
          parsed: parsedLesson,
          validation: parsedLesson ? candidateValidation : { passed: false, issues: ['Failed to parse refined lesson JSON.'] },
        };
        if (!parsedLesson) {
          phase12Artifact.status = 'failed';
        }
      }
      logGenerationEvent(input, 'Phase 12 Refine processed', {
        parsedLesson: Boolean(parsedLesson),
        validationPassed: parsedLesson ? candidateValidation.passed : false,
        validationIssues: parsedLesson ? candidateValidation.issues : ['Failed to parse refined lesson JSON.'],
      });
    } else {
      phases.push({
        phase: 'Phase 12 Refine',
        status: 'completed',
        output: { skipped: true, reason: 'Refinement only runs below 91 or on validation failure.' },
        startedAt: nowIso(),
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, 'Phase 12 Refine skipped', {
        reason: 'Refinement only runs below 91 or on validation failure.',
      });
    }

    if (refined) {
      let rescoredRaw: unknown = null;
      let phase13UsedFallback = false;
      try {
        rescoredRaw = (
          await this.runJsonPhase(
            input,
            'Phase 13 Rescore & Accept/Reject',
            buildDynamicScorePrompt(input, candidateLesson, candidateValidation.issues, planning, vocabulary, spacedReview),
            (raw) => raw,
            phases,
            { temperature: 0.0, maxOutputTokens: 3200 }
          )
        ).parsed;
      } catch {
        rescoredRaw = null;
      }
      phase13UsedFallback = !rescoredRaw;
      const heuristicCandidateScore = scoreDynamicLesson(candidateLesson, candidateValidation);
      candidateScore = applySourceGroundingGuardrails(
        ensurePhaseFeedback(
          strengthenScoreReport(
            applyBundledTaskGuardrails(
              applyFallbackScoringGuardrails(
                rescoredRaw ? normalizeScore(rescoredRaw, candidateValidation) : heuristicCandidateScore,
                candidateValidation,
                phase13UsedFallback
              ),
              heuristicCandidateScore,
              candidateValidation
            ),
            heuristicCandidateScore
          ),
          candidateLesson,
          candidateValidation,
        ),
        candidateValidation,
        sourceGrounding
      );
      const decision = compareScores(score, candidateScore, candidateValidation.passed, true);
      const phase13Artifact = phases.find((phase) => phase.phase === 'Phase 13 Rescore & Accept/Reject');
      if (phase13Artifact) {
        phase13Artifact.output = {
          ...(phase13Artifact.output as Record<string, unknown>),
          parseFailed: phase13UsedFallback,
          candidateScore,
          decision,
        };
        phase13Artifact.status = decision.accepted ? 'completed' : 'failed';
      }
      logGenerationEvent(input, 'Phase 13 Rescore & Accept/Reject evaluated', {
        candidateScore: candidateScore.total,
        candidateGrade: candidateScore.grade,
        candidateValidationPassed: candidateValidation.passed,
        accepted: decision.accepted,
        reason: decision.reason,
        regressions: decision.regressions,
        fallbackUsed: phase13UsedFallback,
      });
    } else {
      const decision = compareScores(score, score, validation.passed, false);
      phases.push({
        phase: 'Phase 13 Rescore & Accept/Reject',
        status: decision.accepted ? 'completed' : 'failed',
        output: {
          candidateScore: score,
          decision,
        },
        startedAt: nowIso(),
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, 'Phase 13 Rescore & Accept/Reject completed', {
        accepted: decision.accepted,
        reason: decision.reason,
      });
    }

    const phase13Artifact = phases.find((phase) => phase.phase === 'Phase 13 Rescore & Accept/Reject');
    const decision =
      phase13Artifact?.output &&
      typeof phase13Artifact.output === 'object' &&
      'decision' in (phase13Artifact.output as Record<string, unknown>)
        ? ((phase13Artifact.output as { decision: DynamicLessonAcceptanceDecision }).decision)
        : compareScores(score, candidateScore, candidateValidation.passed, refined);

    const finalLesson = refined && decision.accepted ? candidateLesson : lesson;
    const finalValidation = refined && decision.accepted ? candidateValidation : validation;
    const finalScore = refined && decision.accepted ? candidateScore : score;

    logGenerationEvent(input, 'run complete', {
      durationMs: durationMs(runStartedAtMs),
      accepted: decision.accepted,
      refined,
      finalScore: finalScore.total,
      finalGrade: finalScore.grade,
      finalValidationPassed: finalValidation.passed,
      rejectionReason: decision.accepted ? null : decision.reason,
    });

    return {
      lesson: finalLesson,
      phases,
      validation: finalValidation,
      score: finalScore,
      refined,
      accepted: decision.accepted,
      rejectionReason: decision.accepted ? null : decision.reason,
      candidateLesson: refined ? candidateLesson : null,
      candidateValidation: refined ? candidateValidation : null,
      candidateScore: refined ? candidateScore : null,
      fixPlan,
    };
  }

  async rescoreLesson(input: {
    generationInput: DynamicLessonGenerationInput;
    lesson: DynamicGuidedV2Lesson;
    planning: DynamicPlanningPhaseOutput;
    vocabulary: DynamicVocabularyPhaseOutput;
    spacedReview?: DynamicSpacedReviewPhaseOutput | null;
  }): Promise<{
    score: DynamicLessonGenerationScore;
    validation: DynamicLessonGenerationValidation;
    phaseArtifact: DynamicGenerationPhaseArtifact;
  }> {
    const phases: DynamicGenerationPhaseArtifact[] = [];
    const validation = validateDynamicLesson(input.lesson);
    const sourceGrounding = assessSourceGrounding(input.generationInput, input.planning, input.vocabulary);
    const phase10Prompt = buildDynamicScorePrompt(
      input.generationInput,
      input.lesson,
      validation.issues,
      input.planning,
      input.vocabulary,
      input.spacedReview ?? null
    );

    let scoreRaw: unknown = null;
    let usedFallback = false;
    let rescoreError: string | null = null;

    try {
      scoreRaw = (
        await this.runJsonPhase(
          input.generationInput,
          'Phase 10 Score',
          phase10Prompt,
          (raw) => raw,
          phases,
          { temperature: 0.0, maxOutputTokens: 3200 }
        )
      ).parsed;
    } catch (error) {
      scoreRaw = null;
      rescoreError = error instanceof Error ? error.message : String(error);
    }

    usedFallback = !scoreRaw;
    const heuristicScore = scoreDynamicLesson(input.lesson, validation);
    const score = ensurePhaseFeedback(
      strengthenScoreReport(
        applyBundledTaskGuardrails(
          applySourceGroundingGuardrails(
            applyFallbackScoringGuardrails(
              scoreRaw ? normalizeScore(scoreRaw, validation) : heuristicScore,
              validation,
              usedFallback
            ),
            validation,
            sourceGrounding
          ),
          heuristicScore,
          validation
        ),
        heuristicScore
      ),
      input.lesson,
      validation
    );

    const phaseArtifact = phases[0] ?? {
      phase: 'Phase 10 Score',
      status: 'failed',
      output: {
        parseFailed: true,
        parsed: score,
      },
      startedAt: nowIso(),
      finishedAt: nowIso(),
    };

    phaseArtifact.output = {
      ...(phaseArtifact.output as Record<string, unknown>),
      parseFailed: usedFallback,
      error: rescoreError,
      parsed: score,
    };
    phaseArtifact.status = validation.passed ? 'completed' : 'failed';

    logGenerationEvent(input.generationInput, 'Phase 10 Score rescored', {
      score: score.total,
      grade: score.grade,
      validationPassed: validation.passed,
      issueCount: score.issues.length,
      fallbackUsed: usedFallback,
      error: rescoreError,
      topIssue: score.issues[0]?.problem ?? null,
    });

    return {
      score,
      validation,
      phaseArtifact,
    };
  }
}
