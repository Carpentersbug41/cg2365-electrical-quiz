import { createLLMClientWithFallback, type ChatHistoryEntry, type GenerativeModelInterface } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { getLessonById, getLessonsByUnit } from '@/data/lessons/lessonIndex';
import chunksData from '@/lib/syllabus/chunks.json';
import type {
  DynamicGuidedV2BasicQuestion,
  DynamicGuidedV2DeeperQuestionMode,
  DynamicGuidedV2Lesson,
  DynamicGuidedV2Step,
} from '@/lib/dynamicGuidedV2/types';
import {
  buildGenerationGroundingPacket,
  buildDynamicBasicChecksPrompt,
  buildDynamicDeeperChecksPrompt,
  buildDynamicExplanationPrompt,
  buildDynamicFixPlanPrompt,
  buildDynamicPlanningPrompt,
  buildDynamicRepairPrompt,
  buildDynamicScorePrompt,
  buildDynamicVocabularyPrompt,
} from '@/lib/dynamicGuidedV2/generation/prompts';
import { logDynamicGenerationAnalytics } from '@/lib/dynamicGuidedV2/generationAnalyticsStore';
import type {
  DynamicApplyPhaseOutput,
  DynamicAuthoredBasicCheck,
  DynamicBasicChecksPhaseOutput,
  DynamicDeeperChecksPhaseOutput,
  DynamicExplanationPhaseOutput,
  DynamicFixPlan,
  DynamicLessonGeneratorOptions,
  DynamicIntegrationPhaseOutput,
  DynamicLessonAcceptanceDecision,
  DynamicLessonGenerationInput,
  DynamicLessonGenerationResult,
  DynamicLessonStageDescriptor,
  DynamicPlanningPhaseOutput,
  DynamicRepairPatch,
  DynamicRepairPatchSet,
  DynamicRepairSummary,
  DynamicSpacedReviewGroundingPacket,
  DynamicSpacedReviewPhaseOutput,
  DynamicUnderstandingChecksPhaseOutput,
  DynamicVocabularyPhaseOutput,
  DynamicWorkedExamplePhaseOutput,
} from '@/lib/dynamicGuidedV2/generation/types';
import type {
  DynamicGenerationPhaseArtifact,
  DynamicDiagnosticScore,
  DynamicLessonGenerationScore,
  DynamicLessonGenerationValidation,
} from '@/lib/dynamicGuidedV2/versionStore';

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

function createEmptyRepairSummary(): DynamicRepairSummary {
  return {
    phase12Ran: false,
    repairRoundsRun: 0,
    repairStopReason: null,
    patchableIssueCountInitial: 0,
    patchableIssueCountFinal: 0,
    attemptedPatchCount: 0,
    acceptedPatchCount: 0,
    lastTargetPointer: null,
    lastRepairClass: null,
    specificPromptReturnedPatch: false,
    fallbackPromptRan: false,
    fallbackPromptReturnedPatch: false,
    patchAccepted: false,
    patchRejectedCode: null,
    patchRejectedReason: null,
    bestRepairedScore: null,
    bestRepairedRound: null,
    repairAttempts: [],
  };
}

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\bsection\s+\d+\b/i,
  /\bcurrent concept\b/i,
  /\bkey idea\s*\d*\b/i,
  /\bsupported practice task\b/i,
  /\bindependent practice task\b/i,
  /\bintegrative task\b/i,
  /\buse the same method as the worked example\b/i,
  /\bnow answer independently using the same lesson method\b/i,
  /\bguide the learner\b/i,
  /\bverify the learner'?s ability\b/i,
  /\bidentify the specific technical answer\b/i,
  /\bsingle best technical answer\b/i,
  /\bbest fits\b/i,
  /\bstate the specific technical answer\b/i,
  /\bshow the steps clearly\b/i,
  /\banswer the .*questions? for this section\b/i,
  /\bcorrect idea\b/i,
  /\blinked explanation\b/i,
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

const LOW_SIGNAL_TOKENS = new Set([
  'what',
  'which',
  'term',
  'used',
  'describe',
  'describes',
  'specific',
  'technical',
  'name',
  'stand',
  'stands',
  'does',
  'letter',
  'code',
  'item',
  'type',
  'system',
  'process',
  'method',
  'methods',
  'provide',
  'provides',
  'used',
  'using',
  'means',
  'called',
  'from',
  'with',
  'into',
  'that',
  'this',
  'their',
  'there',
  'used',
]);

const ACRONYM_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'of',
  'on',
  'the',
  'to',
  'with',
]);

const DEEPER_QUESTION_LOW_SIGNAL = new Set([
  'why',
  'how',
  'what',
  'when',
  'where',
  'must',
  'should',
  'would',
  'could',
  'does',
  'do',
  'did',
  'is',
  'are',
  'be',
  'being',
  'been',
  'the',
  'this',
  'that',
  'these',
  'those',
  'more',
  'most',
  'matter',
  'important',
  'still',
  'than',
  'then',
  'into',
  'from',
  'with',
  'only',
]);

const ELECTRICAL_SUBJECT_PROTECTED_TERMS = [
  'HASAWA',
  'EAWR',
  'ESQCR',
  'PUWER',
  'COSHH',
  'CDM',
  'PPE',
  'BS 7671',
  'TN-S',
  'TN-C-S',
  'TT',
  'CPC',
  'MICC',
  'SWA',
  'MET',
  'RCD',
  'RCBO',
  'MCB',
  'PV',
  'PME',
] as const;

const SCORE_MAX = {
  beginnerClarity: 30,
  teachingBeforeTesting: 25,
  markingRobustness: 20,
  alignmentToLO: 15,
  questionQuality: 10,
} as const;

const ACCEPTANCE_GATE = 90;
const REPAIRED_PUBLISH_FLOOR = 80;

type PromptPair = { system: string; user: string };
type GenerationConversation = {
  model: GenerativeModelInterface;
  history: ChatHistoryEntry[];
};
type PhaseAcceptanceOptions<T> = {
  maxAttempts?: number;
  validateParsed?: (parsed: T) => string[];
  shouldProceedOnValidationIssues?: (issues: string[], parsed: T) => boolean;
};

type JsonPhaseResult<T> = {
  parsed: T;
  rawText: string;
  prompt: PromptPair;
};

type TextPhaseResult<T> = {
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

type DiagnosticIssue = DynamicDiagnosticScore['issues'][number];
type GenerationQuestionType =
  | 'exact_term'
  | 'abbreviation_expansion'
  | 'code_letter'
  | 'unit'
  | 'definition_to_name'
  | 'classification'
  | 'calculation_result'
  | 'short_explanation'
  | 'path_explanation'
  | 'scenario_identification'
  | 'generic';

type CanonicalAnswerPacket = {
  questionType: GenerationQuestionType;
  canonicalAnswer?: string;
  acceptedVariants: string[];
  conceptPoints: string[];
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

function stripLeadConjunction(text: string): string {
  return normalizeWhitespace(text).replace(/^(?:and|or)\s+/i, '').trim();
}

function wordCount(text: string): number {
  return normalizeWhitespace(text)
    .split(/\s+/)
    .filter(Boolean).length;
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

type SyllabusChunkRecord = (typeof chunksData)[number];

function inferLessonLoCode(lessonCode: string): string | null {
  const match = normalizeWhitespace(lessonCode).toUpperCase().match(/^\d{3}-(\d+)[A-Z]$/);
  return match ? `LO${match[1]}` : null;
}

function buildAnchorFactsFromSyllabusChunk(chunk: SyllabusChunkRecord): string[] {
  const rangeLines = String(chunk.content ?? '')
    .split(/\r?\n+/)
    .map((line) => normalizeWhitespace(line.replace(/^[•\-–—]\s*/, '')))
    .filter(Boolean)
    .filter((line) => !/^##\s*/.test(line) && !/^\*\*.*\*\*$/.test(line) && line !== '---');

  const anchors = unique(
    [
      normalizeWhitespace(chunk.loTitle),
      ...(Array.isArray(chunk.assessmentCriteria) ? chunk.assessmentCriteria.map((item) => normalizeWhitespace(item)) : []),
      ...rangeLines,
    ].filter(Boolean)
  );

  return anchors.slice(0, 8);
}

function buildSpacedReviewGroundingPacket(input: DynamicLessonGenerationInput): DynamicSpacedReviewGroundingPacket {
  const currentLesson = getLessonById(input.lessonCode);
  const unitCode = normalizeWhitespace(currentLesson?.unitNumber || input.unit).replace(/^Unit\s*/i, '');
  const currentLoCode = inferLessonLoCode(input.lessonCode) || 'LO1';
  const unitLessons = getLessonsByUnit()[unitCode] ?? [];
  const previousLessons = currentLesson
    ? unitLessons.filter((lesson) => lesson.order < currentLesson.order)
    : [];

  const previousLoCodes = unique(
    previousLessons
      .map((lesson) => inferLessonLoCode(lesson.id))
      .filter((value): value is string => Boolean(value))
  );

  const sourceMode: DynamicSpacedReviewGroundingPacket['sourceMode'] =
    previousLoCodes.length > 0 ? 'preceding_lessons' : 'unit_lo_fallback';
  const targetLoCodes = previousLoCodes.length > 0 ? previousLoCodes : [currentLoCode];

  const loGroups = targetLoCodes
    .map((sourceLo) => {
      const chunk = chunksData.find((item) => item.unit === unitCode && normalizeWhitespace(item.learningOutcome).toUpperCase() === sourceLo);
      const lessonCodes =
        sourceMode === 'preceding_lessons'
          ? previousLessons
              .filter((lesson) => inferLessonLoCode(lesson.id) === sourceLo)
              .map((lesson) => lesson.id)
          : [input.lessonCode];
      const anchorFacts = chunk ? buildAnchorFactsFromSyllabusChunk(chunk) : selectGroundingAnchorFallback(input.sourceText);
      return {
        sourceLo,
        lessonCodes: lessonCodes.length > 0 ? lessonCodes : [input.lessonCode],
        anchorFacts: anchorFacts.slice(0, 8),
      };
    })
    .filter((group) => group.anchorFacts.length > 0);

  if (loGroups.length > 0) {
    return {
      unit: unitCode,
      currentLessonCode: input.lessonCode,
      sourceMode,
      loGroups,
    };
  }

  return {
    unit: unitCode,
    currentLessonCode: input.lessonCode,
    sourceMode: 'unit_lo_fallback',
    loGroups: [
      {
        sourceLo: currentLoCode,
        lessonCodes: [input.lessonCode],
        anchorFacts: selectGroundingAnchorFallback(input.sourceText).slice(0, 8),
      },
    ],
  };
}

function selectGroundingAnchorFallback(sourceText: string): string[] {
  return unique(
    String(sourceText)
      .split(/\r?\n+/)
      .map((line) => normalizeWhitespace(line.replace(/^[•\-–—]\s*/, '')))
      .filter(Boolean)
      .filter((line) => !/^Unit:/i.test(line) && !/^Lesson:/i.test(line))
  ).slice(0, 8);
}

function cleanPlanningItem(text: string): string {
  return stripLeadConjunction(
    normalizeWhitespace(text)
      .replace(/^[•\-–—]\s*/, '')
      .replace(/^\d{3}-\d[A-Z]\s*[:-]?\s*/i, '')
      .replace(/^(?:in-scope teaching anchors?|out-of-scope topics?|must-have topics?|topic focus|prerequisites|known misconceptions to handle|assessment criteria in scope)\s*:\s*/i, '')
  );
}

function splitPlanningListText(text: string): string[] {
  const normalized = cleanPlanningItem(text);
  if (!normalized) return [];
  return unique(
    normalized
      .split(/\s*;\s*|\s*,\s*|\s+\|\s+/)
      .map((item) => cleanPlanningItem(item))
      .filter(Boolean)
  );
}

function extractLabeledSourceItems(sourceText: string, labelPattern: RegExp): string[] {
  return unique(
    sourceText
      .split(/\n+/)
      .map((line) => normalizeWhitespace(line))
      .filter((line) => labelPattern.test(line))
      .flatMap((line) => {
        const match = line.match(labelPattern);
        const remainder = match ? line.slice(match.index! + match[0].length) : line;
        return splitPlanningListText(remainder);
      })
      .filter(Boolean)
  );
}

function extractLessonSpecificSourceItems(input: DynamicLessonGenerationInput): string[] {
  const lessonCodePattern = new RegExp(`\\b${input.lessonCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return unique(
    input.sourceText
      .split(/\n+/)
      .map((line) => normalizeWhitespace(line))
      .filter((line) => lessonCodePattern.test(line))
      .flatMap((line) => {
        const colonIndex = line.indexOf(':');
        const payload = colonIndex >= 0 ? line.slice(colonIndex + 1) : line.replace(lessonCodePattern, '');
        return splitPlanningListText(payload);
      })
      .filter(Boolean)
  );
}

function extractNeighbourLessonItems(input: DynamicLessonGenerationInput): string[] {
  return unique(
    input.sourceText
      .split(/\n+/)
      .map((line) => normalizeWhitespace(line))
      .filter((line) => /\b\d{3}-\d[A-Z]\b/i.test(line) && !new RegExp(`\\b${input.lessonCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line))
      .flatMap((line) => {
        const colonIndex = line.indexOf(':');
        const payload = colonIndex >= 0 ? line.slice(colonIndex + 1) : line;
        return splitPlanningListText(payload);
      })
      .filter(Boolean)
  );
}

function inferPlanningConstraint(input: DynamicLessonGenerationInput, stagePlan: DynamicLessonStageDescriptor[]): string[] {
  const teachChunkCount = stagePlan.filter((step) => step.stage === 'teach_check').length;
  return [
    `Teach each of the ${teachChunkCount} core chunks before checking it.`,
    'Do not introduce untaught technical terms in basic checks or apply tasks.',
    `Stay tightly inside ${input.lessonCode} and avoid drifting into neighbouring lesson content.`,
  ];
}

function hasProceduralExtensionStages(stagePlan: DynamicLessonStageDescriptor[]): boolean {
  return stagePlan.some((step) =>
    step.stage === 'worked_example' ||
    step.stage === 'guided_practice' ||
    step.stage === 'practice' ||
    step.stage === 'integrative'
  );
}

function inferChunkMisconception(objective: string, conceptFocus: string): string[] {
  const focus = normalizeWhitespace(conceptFocus || objective);
  if (!focus) {
    return ['Confusing this chunk with a neighbouring technical term or process.'];
  }
  return [
    `Confusing ${focus} with a neighbouring term, label, or system.`,
  ];
}

function inferPlanningWhyItMatters(objective: string, conceptFocus: string): string {
  const focus = normalizeWhitespace(conceptFocus || objective);
  if (!focus) return 'This chunk matters because the learner must use the term accurately in electrical work.';
  return `This matters because the learner must use ${focus} accurately in electrical work and later checks.`;
}

function derivePlanningAnchors(
  input: DynamicLessonGenerationInput,
  teachChecks: Array<{
    title: string;
    objective: string;
    conceptFocus: string;
    whyItMatters: string;
    misconceptions: string[];
  }>
): string[] {
  const explicitInScope = extractLabeledSourceItems(input.sourceText, /in-scope teaching anchors?\s*:\s*/i);
  const mustHave = extractLabeledSourceItems(input.sourceText, /must-have topics?\s*:\s*/i);
  const topicFocus = extractLabeledSourceItems(input.sourceText, /topic focus\s*:\s*/i);
  const lessonSpecific = extractLessonSpecificSourceItems(input);
  const teachDerived = teachChecks.flatMap((item) => [item.conceptFocus, item.objective, item.title]).map((item) => cleanPlanningItem(item));
  return unique(
    [...explicitInScope, ...mustHave, ...topicFocus, ...lessonSpecific, ...teachDerived]
      .map((item) => cleanPlanningItem(item))
      .filter((item) => item && wordCount(item) <= 10)
  ).slice(0, Math.max(4, teachChecks.length + 1));
}

function derivePlanningOutOfScope(input: DynamicLessonGenerationInput): string[] {
  const explicit = extractLabeledSourceItems(input.sourceText, /out-of-scope topics?\s*:\s*/i);
  const neighbouring = extractNeighbourLessonItems(input);
  return unique([...explicit, ...neighbouring].map((item) => cleanPlanningItem(item)).filter(Boolean)).slice(0, 4);
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function lessonGrade(total: number, validationPassed: boolean): DynamicLessonGenerationScore['grade'] {
  if (!validationPassed) return 'rework';
  if (total >= 95) return 'ship';
  if (total >= 90) return 'strong';
  if (total >= 80) return 'usable';
  return 'rework';
}

function diagnosticGrade(total: number): DynamicDiagnosticScore['grade'] {
  if (total >= 95) return 'ship';
  if (total >= 90) return 'strong';
  if (total >= 80) return 'usable';
  return 'rework';
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
  const conciseButStructured = inScopeCount >= 4 && termCount >= 4;

  let capsScoreAt: number | null = null;

  if (sourceWords < 25 || lineCount < 2) {
    if (conciseButStructured) {
      capsScoreAt = 90;
      issues.push({
        problem: 'The source grounding is concise outline text rather than fuller teaching material.',
        suggestion: 'Keep the lesson tightly grounded to the listed anchors, or provide richer source detail before expecting ship-level output.',
      });
    } else {
      capsScoreAt = 70;
      issues.push({
        problem: 'The source grounding is too thin to support a reliable dynamic lesson draft.',
        suggestion: 'Provide fuller source text with concrete facts, distinctions, and at least one worked-example-level detail.',
      });
    }
  } else if (sourceWords < 80) {
    capsScoreAt = conciseButStructured ? 92 : 88;
    issues.push({
      problem: conciseButStructured
        ? 'The source grounding is brief but structured, so the lesson must stay tightly scoped to the named anchors.'
        : 'The source grounding is brief, so the generated lesson may overreach beyond the evidence provided.',
      suggestion: conciseButStructured
        ? 'Avoid over-expanding beyond the listed distinctions, or add richer detail before expecting ship-level output.'
        : 'Add more grounded detail before accepting the lesson as ship quality.',
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

function buildDiagnosticIssue(category: string, problem: string, suggestion: string): DiagnosticIssue {
  return {
    category,
    problem: normalizeWhitespace(problem),
    suggestion: normalizeWhitespace(suggestion),
  };
}

function buildDiagnosticScore(input: {
  breakdown: Record<string, number>;
  issues: DiagnosticIssue[];
  summary: string;
}): DynamicDiagnosticScore {
  const breakdown = Object.fromEntries(
    Object.entries(input.breakdown).map(([key, value]) => [key, clamp(Math.round(value), 0, 100)])
  );
  const total = clamp(
    Math.round(
      Object.values(breakdown).reduce((sum, value) => sum + value, 0)
    ),
    0,
    100
  );

  return {
    total,
    grade: diagnosticGrade(total),
    breakdown,
    issues: input.issues.filter((issue) => issue.problem).slice(0, 10),
    summary: normalizeWhitespace(input.summary) || 'No diagnostic summary provided.',
  };
}

function buildLessonScore(
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation,
  rawScore: unknown,
  usedFallback: boolean
): DynamicLessonGenerationScore {
  const heuristicScore = scoreDynamicLesson(lesson, validation);
  return ensurePhaseFeedback(
    strengthenScoreReport(
      applyBundledTaskGuardrails(
        applyFallbackScoringGuardrails(
          rawScore ? normalizeScore(rawScore, validation) : heuristicScore,
          validation,
          usedFallback
        ),
        heuristicScore,
        validation
      ),
      heuristicScore
    ),
    lesson,
    validation
  );
}

function scoreLessonPlan(
  stagePlan: DynamicLessonStageDescriptor[],
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  sourceGrounding: SourceGroundingAssessment
): DynamicDiagnosticScore {
  let chunkingAndScope = 25;
  let lessonArc = 20;
  let sourceCoverage = 20;
  let misconceptionReadiness = 15;
  let applicationDesign = 20;
  const issues: DiagnosticIssue[] = [];

  const expectedTeachChecks = stagePlan.filter((step) => step.stage === 'teach_check').length;
  const plannedTeachChecks = planning.teachCheckCount || planning.teachChecks.length;
  const actualTeachCheckPlans = planning.teachChecks.length;
  const requiresProceduralExtension = hasProceduralExtensionStages(stagePlan);

  if (plannedTeachChecks < 4) {
    chunkingAndScope -= 8;
    issues.push(
      buildDiagnosticIssue(
        'chunkingAndScope',
        'The plan uses too few core teach/check chunks for the dynamic lesson model.',
        'Plan at least four core teach/check chunks unless the LO is genuinely very small.'
      )
    );
  } else if (plannedTeachChecks > 6) {
    chunkingAndScope -= 6;
    issues.push(
      buildDiagnosticIssue(
        'chunkingAndScope',
        'The plan uses more than six teach/check chunks, which risks an overlong lesson arc.',
        'Split the LO into two lessons or reduce the chunk count to a maximum of six.'
      )
    );
  }

  if (expectedTeachChecks !== plannedTeachChecks) {
    lessonArc -= 5;
    issues.push(
      buildDiagnosticIssue(
        'lessonArc',
        'The stage plan and planning output disagree on the number of teach/check chunks.',
        'Keep the stage plan and planning phase aligned so the runtime arc is predictable.'
      )
    );
  }

  if (actualTeachCheckPlans !== plannedTeachChecks) {
    chunkingAndScope -= 4;
    issues.push(
      buildDiagnosticIssue(
        'chunkingAndScope',
        'The planning output does not define the same number of teach/check chunks that it claims to use.',
        'Ensure the planner emits one concrete chunk definition per planned teach/check chunk.'
      )
    );
  }

  if (planning.inScope.length < Math.min(4, plannedTeachChecks)) {
    chunkingAndScope -= 4;
    sourceCoverage -= 3;
    issues.push(
      buildDiagnosticIssue(
        'sourceCoverage',
        'The plan has too few concrete in-scope anchors for the intended chunk count.',
        'Add more specific source anchors or reduce the planned number of core chunks.'
      )
    );
  }

  if (planning.outOfScope.length === 0) {
    chunkingAndScope -= 2;
    issues.push(
      buildDiagnosticIssue(
        'chunkingAndScope',
        'The plan does not define any out-of-scope boundaries.',
        'Declare at least one out-of-scope boundary so the lesson stays tightly focused.'
      )
    );
  }

  if (planning.constraints.length === 0) {
    lessonArc -= 2;
    issues.push(
      buildDiagnosticIssue(
        'lessonArc',
        'The plan does not state any delivery constraints.',
        'Add explicit constraints so later phases preserve the intended lesson style and scope.'
      )
    );
  }

  if (!stagePlan.some((step) => step.stage === 'intro')) {
    lessonArc -= 3;
    issues.push(
      buildDiagnosticIssue(
        'lessonArc',
        'The stage plan is missing an intro stage.',
        'Include one intro stage before the teach/check chunks.'
      )
    );
  }

  if (sourceGrounding.capsScoreAt != null) {
    const groundingPenalty =
      sourceGrounding.capsScoreAt <= 70 ? 10 : sourceGrounding.capsScoreAt <= 88 ? 7 : 5;
    sourceCoverage -= groundingPenalty;
  }
  sourceGrounding.issues.forEach((issue) => {
    issues.push(buildDiagnosticIssue('sourceCoverage', issue.problem, issue.suggestion));
  });

  const misconceptionCount = vocabulary.misconceptionTargets.length;
  if (misconceptionCount < Math.min(2, plannedTeachChecks)) {
    misconceptionReadiness -= 5;
    issues.push(
      buildDiagnosticIssue(
        'misconceptionReadiness',
        'The plan does not identify enough misconception targets for the number of chunks being taught.',
        'Add the likely learner confusions that each chunk must explicitly repair.'
      )
    );
  }

  if (planning.teachChecks.some((teachCheck) => teachCheck.misconceptions.length === 0)) {
    misconceptionReadiness -= 4;
    issues.push(
      buildDiagnosticIssue(
        'misconceptionReadiness',
        'One or more teach/check chunks do not name a misconception to watch for.',
        'Attach at least one misconception or confusion risk to every teach/check chunk.'
      )
    );
  }

  if (requiresProceduralExtension) {
    const applicationObjectives = [
      planning.workedExampleObjective,
      planning.guidedPracticeObjective,
      planning.practiceObjective,
      planning.integrativeObjective,
    ].map((value) => normalizeWhitespace(value));
    const missingApplicationObjectives = applicationObjectives.filter((value) => !value).length;
    if (missingApplicationObjectives > 0) {
      applicationDesign -= Math.min(8, missingApplicationObjectives * 2);
      issues.push(
        buildDiagnosticIssue(
          'applicationDesign',
          'The plan is missing one or more procedural extension objectives.',
          'If the lesson uses worked example or practice stages, define explicit objectives for them.'
        )
      );
    }

    if (!planning.guidedPracticeObjective || !planning.workedExampleObjective) {
      applicationDesign -= 3;
      issues.push(
        buildDiagnosticIssue(
          'applicationDesign',
          'The plan does not clearly pair the worked example with the guided practice objective.',
          'When procedural extension is present, keep guided practice aligned to the worked example.'
        )
      );
    }
  } else {
    applicationDesign = 20;
  }

  return buildDiagnosticScore({
    breakdown: {
      chunkingAndScope,
      lessonArc,
      sourceCoverage,
      misconceptionReadiness,
      applicationDesign,
    },
    issues,
    summary:
      issues.length === 0
        ? 'The lesson plan is well scoped, well sequenced, and sufficiently grounded for dynamic generation.'
        : 'The lesson plan is usable, but it still has planning or grounding weaknesses that could affect generation quality.',
  });
}

function scorePlanFidelity(
  stagePlan: DynamicLessonStageDescriptor[],
  planning: DynamicPlanningPhaseOutput,
  lesson: DynamicGuidedV2Lesson
): DynamicDiagnosticScore {
  let chunkCoverage = 25;
  let arcPreservation = 20;
  let questionDelivery = 20;
  let examplePracticeMatch = 20;
  let taskIntegrity = 15;
  const issues: DiagnosticIssue[] = [];

  const teachSteps = lesson.steps.filter((step) => step.stage === 'teach_check');
  const requiresProceduralExtension = hasProceduralExtensionStages(stagePlan);
  const workedExample = lesson.steps.find((step) => step.stage === 'worked_example');
  const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
  const practice = lesson.steps.find((step) => step.stage === 'practice');
  const integrative = lesson.steps.find((step) => step.stage === 'integrative');
  const plannedTeachChecks = planning.teachCheckCount || planning.teachChecks.length;

  if (teachSteps.length !== plannedTeachChecks) {
    chunkCoverage -= 8;
    issues.push(
      buildDiagnosticIssue(
        'chunkCoverage',
        'The generated lesson does not preserve the planned number of core teach/check chunks.',
        'Keep the generated teach/check count aligned with the planning phase.'
      )
    );
  }

  teachSteps.forEach((step, index) => {
    const plannedChunk = planning.teachChecks[index];
    if (!plannedChunk) return;
    if (!hasTeachGrounding(step)) {
      chunkCoverage -= 2;
      issues.push(
        buildDiagnosticIssue(
          'chunkCoverage',
          `${step.title} is too thin to fully deliver its planned chunk.`,
          'Expand the chunk anchors so the runtime can deliver the planned idea clearly before questioning.'
        )
      );
    }
    const overlap = tokenOverlapCount(
      `${plannedChunk.title} ${plannedChunk.objective} ${plannedChunk.conceptFocus} ${plannedChunk.whyItMatters}`,
      `${step.title} ${step.objective} ${step.retrievalText ?? ''} ${joinedAnchors(step)}`
    );
    if (overlap < 2) {
      chunkCoverage -= 2;
      issues.push(
        buildDiagnosticIssue(
          'chunkCoverage',
          `${step.title} drifts away from the planned chunk focus.`,
          'Keep each teach/check chunk tightly aligned to its planned concept focus and objective.'
        )
      );
    }
    if ((step.basicQuestions?.length ?? 0) !== 3) {
      questionDelivery -= 3;
      issues.push(
        buildDiagnosticIssue(
          'questionDelivery',
          `${step.title} does not deliver the planned three-question check cleanly.`,
          'Ensure every teach/check chunk contains exactly three discrete short-answer checks.'
        )
      );
    }
    if (!normalizeWhitespace(step.deeperQuestionText)) {
      questionDelivery -= 2;
      issues.push(
        buildDiagnosticIssue(
          'questionDelivery',
          `${step.title} is missing its deeper progression question.`,
          'Keep the deeper question so the runtime can gate progression naturally.'
        )
      );
    }
  });

  const stageOrder = lesson.steps.map((step) => step.stage);
  const expectedOrder = stagePlan.map((step) => step.stage);
  const firstWrongIndex = expectedOrder.findIndex((stage, index) => stageOrder[index] !== stage);
  if (firstWrongIndex !== -1) {
    arcPreservation -= 8;
    issues.push(
      buildDiagnosticIssue(
        'arcPreservation',
        'The generated lesson does not preserve the planned stage order cleanly.',
        'Keep intro and teach/check chunks in the planned order.'
      )
    );
  }

  if (requiresProceduralExtension && (!workedExample || !guidedPractice || !practice || !integrative)) {
    arcPreservation -= 6;
    examplePracticeMatch -= 6;
    issues.push(
      buildDiagnosticIssue(
        'arcPreservation',
        'One or more planned procedural extension stages are missing from the generated lesson.',
        'Preserve the planned worked example and practice stages when the stage plan includes them.'
      )
    );
  }

  if (requiresProceduralExtension && workedExample && guidedPractice) {
    const overlap = tokenOverlapCount(
      `${workedExample.objective} ${workedExample.retrievalText ?? ''} ${joinedAnchors(workedExample)} ${(workedExample.taskSkeleton?.steps ?? []).join(' ')}`,
      `${guidedPractice.objective} ${guidedPractice.questionText ?? ''} ${(guidedPractice.answerGuidance ?? []).join(' ')}`
    );
    if (overlap < 2) {
      examplePracticeMatch -= 5;
      issues.push(
        buildDiagnosticIssue(
          'examplePracticeMatch',
          'The guided practice does not clearly mirror the worked example pattern.',
          'Keep guided practice closely matched to the modelling pattern used in the worked example.'
        )
      );
    }
  }

  const applySteps = requiresProceduralExtension ? ([guidedPractice, practice, integrative].filter(Boolean) as DynamicGuidedV2Step[]) : [];
  applySteps.forEach((step) => {
    if (isSeverelyBundledTask(step.questionText, step.answerGuidance)) {
      taskIntegrity -= 4;
      issues.push(
        buildDiagnosticIssue(
          'taskIntegrity',
          `${step.title} bundles too many distinct outputs into one response task.`,
          'Keep each apply stage to one markable task or provide structured multi-part handling.'
        )
      );
    } else if (hasThinGuidanceForBundledTask(step.questionText, step.answerGuidance)) {
      taskIntegrity -= 3;
      issues.push(
        buildDiagnosticIssue(
          'taskIntegrity',
          `${step.title} asks for more than one output without enough answer guidance.`,
          'Tighten the task so one response box still remains easy to mark.'
        )
      );
    }
  });

  if (requiresProceduralExtension && integrative && !normalizeWhitespace(integrative.questionText)) {
    examplePracticeMatch -= 4;
    issues.push(
      buildDiagnosticIssue(
        'examplePracticeMatch',
        'The generated lesson does not deliver a real integrative close.',
        'End with one applied synthesis task that clearly draws the lesson together.'
      )
    );
  }

  return buildDiagnosticScore({
    breakdown: {
      chunkCoverage,
      arcPreservation,
      questionDelivery,
      examplePracticeMatch,
      taskIntegrity,
    },
    issues,
    summary:
      issues.length === 0
        ? 'The generated lesson follows the plan cleanly and preserves the intended chunked teaching arc.'
        : 'The generated lesson is usable, but it does not fully preserve the planned structure or task design.',
  });
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
      key: 'teach-check-3',
      title: 'Teach/Check 3',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next distinct idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-4',
      title: 'Teach/Check 4',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next distinct idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-5',
      title: 'Teach/Check 5',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next distinct idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-6',
      title: 'Teach/Check 6',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next distinct idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-7',
      title: 'Teach/Check 7',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the next distinct idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
      completionMode: 'respond',
    },
    {
      key: 'teach-check-8',
      title: 'Teach/Check 8',
      role: 'explanation',
      stage: 'teach_check',
      objective: `Teach the last core idea in ${input.topic}.`,
      progressionRule: 'feedback_deeper',
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

function coerceTeachingPointIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return unique(
    value
      .map((item) => normalizeWhitespace(item))
      .filter((item) => /^TP\d+$/i.test(item))
      .map((item) => item.toUpperCase())
  );
}

function coerceBasicQuestions(value: unknown): DynamicAuthoredBasicCheck[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const question = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      return {
        questionForm: normalizeWhitespace(question.questionForm) || undefined,
        questionText: normalizeWhitespace(question.questionText),
        answerGuidance: unique(arrayOfStrings(question.answerGuidance)),
        hint: normalizeWhitespace(question.hint) || undefined,
        sourceTeachingPointIds: coerceTeachingPointIds(question.sourceTeachingPointIds),
      };
    })
    .filter((item) => item.questionText.length > 0);
}

function splitCompoundGuidanceItems(items: string[]): string[] {
  return unique(
    items
      .flatMap((item) =>
        normalizeWhitespace(item)
          .split(/\s*(?:,|\/|\band\b)\s*/i)
          .map((part) => normalizeWhitespace(part))
          .filter(Boolean)
      )
      .filter(Boolean)
  );
}

function buildSingleExpectationGuidance(items: string[]): string[] {
  const normalized = items.map((item) => normalizeWhitespace(item)).filter(Boolean);
  if (normalized.length === 0) return [];
  if (normalized.length === 1) return normalized;
  return [normalized.join('; ')];
}

function splitExplanationGuidancePoints(items: string[]): string[] {
  const normalized = sanitizeSingleBoxGuidance(items);
  if (normalized.length !== 1) return normalized;

  const source = normalized[0];
  if (wordCount(source) <= 9) return normalized;

  const fragments = unique(
    source
      .replace(/\s+(?:and therefore|therefore|which means|meaning that|so that|resulting in|leading to)\s+/gi, ' | ')
      .replace(/\s+(?:because|so|while)\s+/gi, ' | ')
      .replace(/,\s+and\s+/gi, ' | ')
      .split(/\s*\|\s*|\s*;\s*|\.\s+/)
      .map((part) =>
        normalizeWhitespace(
          part
            .replace(/^(?:and|because|so|therefore|this means|meaning that|resulting in|leading to)\s+/i, '')
            .replace(/[.]+$/g, '')
        )
      )
      .filter(Boolean)
  );

  if (fragments.length >= 2) {
    return fragments.slice(0, 4);
  }

  return normalized;
}

function sanitizeSingleBoxGuidance(items: string[]): string[] {
  return unique(
    items
      .flatMap((item) => {
        const normalized = normalizeWhitespace(item).replace(/\s+\./g, '.');
        if (!normalized) return [];

        const withoutLabel = normalized.replace(/^[^:]{1,40}:\s*/, '').trim();
        const parts: string[] = [];
        const parentheticalMatches = [...withoutLabel.matchAll(/\(([^)]+)\)/g)];
        const outside = normalizeWhitespace(withoutLabel.replace(/\s*\([^)]*\)\s*/g, ' '));
        if (outside) parts.push(outside);

        parentheticalMatches.forEach((match) => {
          const inner = normalizeWhitespace(match[1]);
          if (!inner) return;
          inner
            .split(/\s*(?:,|\/|\bor\b)\s*/i)
            .map((part) => normalizeWhitespace(part))
            .filter(Boolean)
            .forEach((part) => parts.push(part));
        });

        return parts.length > 0 ? parts : [withoutLabel];
      })
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
  );
}

function extractListedQuestionItems(questionText: string): string[] {
  const normalized = normalizeWhitespace(questionText);
  const source = normalized.includes(':') ? normalized.split(':').slice(1).join(':') : normalized;
  return source
    .split(/\s*,\s*|\s+\band\b\s+/i)
    .map((item) => item.replace(/^the following (?:\w+\s+)?items?\s+/i, '').trim())
    .map((item) => item.replace(/[?.]$/g, '').trim())
    .filter((item) => item.length > 1)
    .slice(0, 5);
}

function inferRegulatoryCategory(item: string): 'Statutory' | 'Non-statutory' | null {
  const normalized = normalizeWhitespace(item).toLowerCase();
  if (!normalized) return null;
  if (/\b(?:hasawa|eawr|esqcr|puwer|coshh|cdm|manual handling|ppe|noise at work|environmental act|dda|equal opportunities|act|regulations?)\b/i.test(normalized)) {
    return 'Statutory';
  }
  if (/\b(?:bs\s*7671|on-site guide|guidance notes|codes of practice|guide|standard|unite union book|good practice|notes)\b/i.test(normalized)) {
    return 'Non-statutory';
  }
  return null;
}

function expandClassificationMappings(questionText: string, answerGuidance: string[]): string[] | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = answerGuidance.map((item) => normalizeWhitespace(item)).filter(Boolean);
  const guidanceSet = new Set(normalizedGuidance.map((item) => item.toLowerCase()));
  const onlyGenericCategories =
    normalizedGuidance.length <= 2 &&
    guidanceSet.has('statutory') &&
    guidanceSet.has('non-statutory');

  if (!onlyGenericCategories) return null;
  if (!/\bclassify\b/i.test(normalizedQuestion)) return null;

  const items = extractListedQuestionItems(normalizedQuestion);
  const mappings = items
    .map((item) => {
      const category = inferRegulatoryCategory(item);
      return category ? `${item}: ${category}` : null;
    })
    .filter(Boolean);

  return mappings.length >= 2 ? mappings : null;
}

function detectMeasurementFocus(questionText: string): {
  quantity: 'voltage' | 'current' | 'resistance' | 'power' | 'energy';
  targetPattern: RegExp;
  prompt: string;
  integrativePrompt?: string;
  integrativeReasoning?: string[];
} | null {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (/\benergy\b|\bconsumed\b|\bover time\b|\bweek\b|\bmonth\b|\bbill/i.test(normalized)) {
    return {
      quantity: 'energy',
      targetPattern: /\b(?:energy\s*meter|kwh\s*meter|kilowatt-hour\s*meter)\b/i,
      prompt: 'In this scenario, which instrument should you use to measure the total electrical energy consumed over time?',
      integrativePrompt:
        'In this scenario, which instrument should you use to measure the total electrical energy consumed over time, and why is a Wattmeter not enough on its own?',
      integrativeReasoning: [
        'measures total energy over time',
        'not a Wattmeter because a Wattmeter measures instantaneous power',
      ],
    };
  }
  if (/\bpower\b|\bwatt\b|\brate of work\b|\binstantaneous\b/i.test(normalized)) {
    return {
      quantity: 'power',
      targetPattern: /\bwattmeter\b/i,
      prompt: 'In this scenario, which instrument should you use to measure the instantaneous power?',
      integrativePrompt:
        'In this scenario, which instrument should you use to measure the instantaneous power, and what makes this different from measuring total energy over time?',
      integrativeReasoning: [
        'measures instantaneous power',
        'different from total energy over time',
      ],
    };
  }
  if (/\bresistance\b|\bohm\b|\bopposition to (?:the )?(?:current\s+)?flow\b|\bopposition to the flow of current\b/i.test(normalized)) {
    return {
      quantity: 'resistance',
      targetPattern: /\bohmmeter\b/i,
      prompt: 'In this scenario, which instrument should you use to measure resistance?',
      integrativePrompt: 'In this scenario, which instrument should you use to measure resistance, and why must that test be done correctly for safety?',
      integrativeReasoning: [
        'measures resistance',
        'dead testing only / correct test setup matters',
      ],
    };
  }
  if (/\bcurrent\b|\bamp\b|\bload\b|\bflow\b/i.test(normalized)) {
    return {
      quantity: 'current',
      targetPattern: /\bammeter\b/i,
      prompt: 'In this scenario, which instrument should you use to measure current?',
      integrativePrompt: 'In this scenario, which instrument should you use to measure current, and what exactly are you checking when the circuit is running?',
      integrativeReasoning: [
        'measures current',
        'checks the flow of electricity while running',
      ],
    };
  }
  if (/\bvoltage\b|\bpotential\b|\bpressure\b|\bprove\b.*\bdead\b/i.test(normalized)) {
    return {
      quantity: 'voltage',
      targetPattern: /\b(?:voltmeter|voltage indicator)\b/i,
      prompt: 'In this scenario, which instrument should you use to measure voltage?',
      integrativePrompt: 'In this scenario, which instrument should you use to check voltage first, and why does that matter for safe work?',
      integrativeReasoning: [
        'measures voltage / electrical pressure',
        'used first for safety / proving dead',
      ],
    };
  }
  return null;
}

function rewriteBundledInstrumentTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText).toLowerCase();
  if (stage === 'integrative' && /\bpower\b/i.test(normalizedQuestion) && /\benergy\b/i.test(normalizedQuestion)) {
    return {
      questionText:
        'Using one short explanation, explain why a Wattmeter is used for the right-now load in this scenario while an Energy Meter (kWh meter) is used for the total consumption over time.',
      answerGuidance: [
        'Wattmeter',
        'Energy Meter',
        'kWh meter',
        'instantaneous power',
        'total energy over time',
      ],
    };
  }

  const focus = detectMeasurementFocus(questionText);
  if (!focus) return null;

  const splitGuidance = splitCompoundGuidanceItems(answerGuidance);
  const matchingTargets = splitGuidance.filter((item) => focus.targetPattern.test(item));
  const retainedTargets = unique([
    ...matchingTargets,
    ...answerGuidance.filter((item) => focus.targetPattern.test(item)),
  ]).filter(Boolean);
  if (retainedTargets.length === 0) return null;

  if (stage === 'integrative') {
    return {
      questionText: focus.integrativePrompt ?? focus.prompt,
      answerGuidance: unique([...retainedTargets, ...(focus.integrativeReasoning ?? [])]),
    };
  }

  return {
    questionText: focus.prompt,
    answerGuidance: retainedTargets,
  };
}

function extractInstrumentTarget(
  answerGuidance: string[]
): { instrument: string; quantity: string } | null {
  const normalized = sanitizeSingleBoxGuidance(answerGuidance);
  for (const item of normalized) {
    const match = normalizeWhitespace(item).match(
      /\b(Voltmeter|Ammeter|Ohmmeter|Wattmeter|Energy Meter|kWh meter)\b(?:\s+for\s+([A-Za-z -]+))?/i
    );
    if (!match) continue;
    const instrument = normalizeWhitespace(match[1]);
    const quantity = normalizeWhitespace(match[2]) || (
      /voltmeter/i.test(instrument) ? 'voltage'
      : /ammeter/i.test(instrument) ? 'current'
      : /ohmmeter/i.test(instrument) ? 'resistance'
      : /wattmeter/i.test(instrument) ? 'power'
      : 'energy'
    );
    return { instrument, quantity };
  }
  return null;
}

function rewriteMaterialComparisonTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const materialStatements = answerGuidance.filter((item) => /\bis an?\b/i.test(item) && /\bbecause\b/i.test(item));
  if (materialStatements.length === 0) return null;

  const subjects = materialStatements
    .map((item) => normalizeWhitespace(item).match(/^([A-Z][A-Za-z0-9-]*)\b/)?.[1] ?? '')
    .filter(Boolean);
  if (subjects.length === 0) return null;

  const firstSubject = subjects[0];
  const secondSubject = subjects[1] ?? null;
  const combinedGuidance = unique(materialStatements.map((item) => normalizeWhitespace(item)).filter(Boolean));

  if (stage === 'integrative' && secondSubject) {
    return {
      questionText: `Using one short explanation, explain why ${firstSubject} and ${secondSubject} perform different electrical roles in this scenario.`,
      answerGuidance: combinedGuidance,
    };
  }

  if (secondSubject && /\bclassify both\b|\bcompare\b|\bdifference\b/i.test(normalizedQuestion.toLowerCase())) {
    return {
      questionText: `Using one short comparison, explain why ${firstSubject} behaves differently from ${secondSubject} in this scenario.`,
      answerGuidance: combinedGuidance,
    };
  }

  return {
    questionText: `Using one short explanation, classify ${firstSubject} correctly in this scenario.`,
    answerGuidance: buildSingleExpectationGuidance([materialStatements[0]]),
  };
}

function normalizeSingleMarkableTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const normalizedExplanationGuidance = looksLikeExplanationPrompt(normalizedQuestion)
    ? compactConceptPoints(normalizedGuidance, stage === 'integrative' ? 3 : 4)
    : normalizedGuidance;
  const normalizedUnitGuidance = normalizeUnitQuestionGuidance(normalizedQuestion, normalizedGuidance);
  const transmissionVoltageListRewrite = rewriteTransmissionVoltageListTask(normalizedQuestion, normalizedGuidance);
  const mappedClassificationGuidance = expandClassificationMappings(normalizedQuestion, normalizedGuidance);
  if (!normalizedQuestion || normalizedGuidance.length === 0) {
    return {
      questionText: normalizedQuestion,
      answerGuidance: normalizedGuidance,
    };
  }

  const genericSingleTargetStem = /\b(?:single best technical answer|specific technical answer|best fits|state the specific technical answer)\b/i.test(normalizedQuestion);
  if ((stage === 'guided_practice' || stage === 'practice' || stage === 'integrative') && (genericSingleTargetStem || looksLikeCircularAnswerLedQuestion(normalizedQuestion))) {
    const primaryTarget = normalizedGuidance[0];
    if (primaryTarget) {
      if (/\b(?:voltmeter|ammeter|ohmmeter|wattmeter|energy meter|kwh meter)\b/i.test(primaryTarget)) {
        const instrumentTarget = extractInstrumentTarget(normalizedGuidance);
        if (instrumentTarget) {
          return {
            questionText: `In this scenario, which instrument should you use to measure ${instrumentTarget.quantity.toLowerCase()}, and why is that the correct choice?`,
            answerGuidance: unique([
              instrumentTarget.instrument,
              `measures ${instrumentTarget.quantity.toLowerCase()}`,
            ]),
          };
        }
      }
      return {
        questionText: inferApplyQuestionFromTargets(normalizedGuidance, primaryTarget),
        answerGuidance: buildSingleExpectationGuidance([primaryTarget]),
      };
    }
  }

  if (mappedClassificationGuidance) {
    return {
      questionText: normalizedQuestion,
      answerGuidance: unique(mappedClassificationGuidance).slice(0, 5),
    };
  }

  if (normalizedUnitGuidance) {
    return {
      questionText: normalizedQuestion,
      answerGuidance: normalizedUnitGuidance,
    };
  }

  if (transmissionVoltageListRewrite) {
    return transmissionVoltageListRewrite;
  }

  if (stage === 'integrative' && /\bsingle best technical answer\b/i.test(normalizedQuestion)) {
    const instrumentTarget = extractInstrumentTarget(normalizedGuidance);
    if (instrumentTarget) {
      return {
        questionText: `In this scenario, which instrument should you use to measure ${instrumentTarget.quantity.toLowerCase()}, and why is that the correct choice?`,
        answerGuidance: unique([
          instrumentTarget.instrument,
          `measures ${instrumentTarget.quantity.toLowerCase()}`,
        ]),
      };
    }
  }

  const systemRoleRewrite = rewriteSystemRoleTask(stage, normalizedQuestion, normalizedGuidance);
  if (systemRoleRewrite) return systemRoleRewrite;

  const combinedSpecificationRewrite = rewriteCombinedSpecificationTask(stage, normalizedQuestion, normalizedGuidance);
  if (combinedSpecificationRewrite) return combinedSpecificationRewrite;

  const conversionClassificationRewrite = rewriteConversionClassificationTask(stage, normalizedQuestion, normalizedGuidance);
  if (conversionClassificationRewrite) return conversionClassificationRewrite;

  const faultPathRewrite = rewriteFaultPathTraceTask(stage, normalizedQuestion, normalizedGuidance);
  if (faultPathRewrite) return faultPathRewrite;

  const singleTargetGuidance = normalizeSingleTargetQuestionGuidance(normalizedQuestion, normalizedGuidance);
  if (singleTargetGuidance) {
    return singleTargetGuidance;
  }

  const dualTargetRewrite = rewriteDualTargetApplyTask(stage, normalizedQuestion, normalizedGuidance);
  if (dualTargetRewrite) return dualTargetRewrite;

  if (!(isSeverelyBundledTask(normalizedQuestion, normalizedGuidance) || isClassificationListBundle(normalizedQuestion, normalizedGuidance))) {
    if (looksLikeExplanationPrompt(normalizedQuestion) && normalizedExplanationGuidance.length > 1) {
      return {
        questionText: normalizedQuestion,
        answerGuidance: normalizedExplanationGuidance,
      };
    }
    if (stage === 'integrative' && isHardToMarkOpenEndedTask(normalizedQuestion, normalizedGuidance)) {
      const rewrittenComparison = rewriteMaterialComparisonTask(stage, normalizedQuestion, normalizedGuidance);
      if (rewrittenComparison) return rewrittenComparison;
      return {
        questionText: normalizedQuestion.replace(/^Explain\b/i, 'Using one short explanation, explain'),
        answerGuidance: normalizedExplanationGuidance,
      };
    }
    return {
      questionText: normalizedQuestion,
      answerGuidance: normalizedExplanationGuidance,
    };
  }

  const instrumentRewrite = rewriteBundledInstrumentTask(stage, normalizedQuestion, normalizedGuidance);
  if (instrumentRewrite) return instrumentRewrite;

  const materialRewrite = rewriteMaterialComparisonTask(stage, normalizedQuestion, normalizedGuidance);
  if (materialRewrite) return materialRewrite;

  return {
    questionText: normalizedQuestion,
    answerGuidance: normalizedGuidance,
  };
}

function isNumericGuidanceOnly(answerGuidance: string[]): boolean {
  const normalized = sanitizeSingleBoxGuidance(answerGuidance);
  return normalized.length > 0 && normalized.every((item) => /^[0-9.]+\s*[A-Za-z%]*$/i.test(item));
}

function normalizeCalculationApplyStep(step: DynamicGuidedV2Step): DynamicGuidedV2Step {
  if (step.stage !== 'guided_practice' && step.stage !== 'practice' && step.stage !== 'integrative') {
    return step;
  }

  const updatedStep: DynamicGuidedV2Step = {
    ...step,
    taskSkeleton: step.taskSkeleton ? { ...step.taskSkeleton } : step.taskSkeleton,
    answerGuidance: sanitizeSingleBoxGuidance(step.answerGuidance ?? []),
  };
  const normalizedQuestion = normalizeWhitespace(updatedStep.questionText);
  const normalizedHint = normalizeWhitespace(updatedStep.hint);
  const normalizedScenario = normalizeWhitespace(updatedStep.taskSkeleton?.scenario);
  const stepSignal = [
    normalizedQuestion,
    normalizedHint,
    normalizedScenario,
    ...(updatedStep.answerGuidance ?? []),
    ...(updatedStep.taskSkeleton?.requiredOutputs ?? []),
  ]
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .join(' ');

  if (
    /\bimpedance\b/i.test(`${normalizedQuestion} ${normalizedScenario} ${normalizedHint}`) &&
    !/\b12\b/.test(normalizedScenario) &&
    !/\b5\b/.test(normalizedScenario) &&
    /\b12\b/.test(normalizedHint) &&
    /\b5\b/.test(normalizedHint)
  ) {
    updatedStep.taskSkeleton = {
      ...updatedStep.taskSkeleton,
      scenario: `${normalizedScenario} Use a resistance of 12 Ohms and a reactance of 5 Ohms.`.trim(),
    };
    if (/single best technical answer/i.test(normalizedQuestion)) {
      updatedStep.questionText = 'Calculate the total impedance in Ohms for this scenario.';
      updatedStep.answerGuidance = unique(['13', '13 Ohms', '12² + 5² = 169', '√169 = 13']);
    }
  }

  if (
    (/\b9\.?2\b/.test(stepSignal) || /\b9200\b/.test(stepSignal)) &&
    (/\b1\.25\b/.test(stepSignal) || /\b125%\b/.test(stepSignal)) &&
    (/\b230\b/.test(stepSignal) || /\bP\s*\/\s*V\b/i.test(stepSignal)) &&
    (/\b50A?\b/i.test(stepSignal) || /\bdesign current\b/i.test(stepSignal) || /\bP\s*\/\s*V\b/i.test(stepSignal))
  ) {
    updatedStep.taskSkeleton = {
      ...updatedStep.taskSkeleton,
      scenario:
        'A motor has a power rating of 9.2kW and operates on a 230V supply. The design current must be calculated at 125% of the full load current.',
    };
    if (/explain why\b/i.test(normalizedQuestion) || /single best technical answer/i.test(normalizedQuestion)) {
      updatedStep.questionText = 'Calculate the final design current in Amps for this motor circuit.';
    }
    if (isNumericGuidanceOnly(updatedStep.answerGuidance ?? [])) {
      updatedStep.answerGuidance = unique(['50', '50A', '9200 / 230 = 40', '40 * 1.25 = 50']);
    }
  }

  return updatedStep;
}

function coercePlanningOutput(
  raw: unknown,
  stagePlan: DynamicLessonStageDescriptor[],
  input: DynamicLessonGenerationInput
): DynamicPlanningPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRequired = stagePlan.filter((step) => step.stage === 'teach_check');
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  const teachChecks = teachChecksRequired.map((descriptor, index) => {
    const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
      ? (teachChecksRaw[index] as Record<string, unknown>)
      : {};
    const conceptFocus = normalizeWhitespace(item.conceptFocus) || normalizeWhitespace(descriptor.objective) || normalizeWhitespace(descriptor.title);
    const objective = normalizeWhitespace(item.objective) || descriptor.objective;
    return {
      key: descriptor.key,
      title: normalizeWhitespace(item.title) || descriptor.title,
      objective,
      conceptFocus,
      whyItMatters: normalizeWhitespace(item.whyItMatters) || inferPlanningWhyItMatters(objective, conceptFocus),
      misconceptions: arrayOfStrings(item.misconceptions).length > 0 ? arrayOfStrings(item.misconceptions) : inferChunkMisconception(objective, conceptFocus),
    };
  });

  const workedExampleStage = stagePlan.find((step) => step.stage === 'worked_example');
  const guidedPracticeStage = stagePlan.find((step) => step.stage === 'guided_practice');
  const practiceStage = stagePlan.find((step) => step.stage === 'practice');
  const integrativeStage = stagePlan.find((step) => step.stage === 'integrative');
  const derivedInScope = derivePlanningAnchors(input, teachChecks);
  const derivedOutOfScope = derivePlanningOutOfScope(input);
  const derivedConstraints = inferPlanningConstraint(input, stagePlan);
  const lessonAim =
    normalizeWhitespace(data.lessonAim) ||
    normalizeWhitespace(stagePlan.find((step) => step.stage === 'intro')?.objective) ||
    `Teach ${input.topic} clearly and accurately for a beginner electrical learner.`;

  return {
    lessonAim,
    taskMode: normalizeWhitespace(data.taskMode) || 'teach-check electrical tutor',
    teachCheckCount: teachChecksRequired.length,
    teachChecks,
    workedExampleObjective: normalizeWhitespace(data.workedExampleObjective) || normalizeWhitespace(workedExampleStage?.objective) || undefined,
    guidedPracticeObjective: normalizeWhitespace(data.guidedPracticeObjective) || normalizeWhitespace(guidedPracticeStage?.objective) || undefined,
    practiceObjective: normalizeWhitespace(data.practiceObjective) || normalizeWhitespace(practiceStage?.objective) || undefined,
    integrativeObjective: normalizeWhitespace(data.integrativeObjective) || normalizeWhitespace(integrativeStage?.objective) || undefined,
    spacedReviewObjective: normalizeWhitespace(data.spacedReviewObjective) || undefined,
    inScope: arrayOfStrings(data.inScope).length > 0 ? unique(arrayOfStrings(data.inScope).map((item) => cleanPlanningItem(item)).filter(Boolean)) : derivedInScope,
    outOfScope: arrayOfStrings(data.outOfScope).length > 0 ? unique(arrayOfStrings(data.outOfScope).map((item) => cleanPlanningItem(item)).filter(Boolean)) : derivedOutOfScope,
    constraints: arrayOfStrings(data.constraints).length > 0 ? unique(arrayOfStrings(data.constraints).map((item) => cleanPlanningItem(item)).filter(Boolean)) : derivedConstraints,
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
    .filter((token) => token.length >= 3 && !LOW_SIGNAL_TOKENS.has(token));
}

function tokenOverlapCount(a: string, b: string): number {
  const aTokens = new Set(tokenizeLower(a));
  const bTokens = new Set(tokenizeLower(b));
  let overlap = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1;
  }
  return overlap;
}

function deeperQuestionCoreTokens(text: string): string[] {
  return normalizeWhitespace(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !DEEPER_QUESTION_LOW_SIGNAL.has(token));
}

function areDeeperQuestionsTooSimilar(a: string, b: string): boolean {
  const normalizedA = normalizeWhitespace(a).toLowerCase();
  const normalizedB = normalizeWhitespace(b).toLowerCase();
  if (!normalizedA || !normalizedB) return false;
  if (normalizedA === normalizedB) return true;

  const aTokens = unique(deeperQuestionCoreTokens(normalizedA));
  const bTokens = unique(deeperQuestionCoreTokens(normalizedB));
  if (aTokens.length === 0 || bTokens.length === 0) return false;

  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1;
  }

  const overlapRatio = overlap / Math.min(aSet.size, bSet.size);
  return overlap >= 3 && overlapRatio >= 0.6;
}

function extractNamedEntities(text: string): string[] {
  const normalized = normalizeWhitespace(text);
  const explicit = normalized.match(
    /\b(?:TT|TN-S|TN-C-S|BS\s*7671|EAWR|HASAWA|ESQCR|PUWER|COSHH|CPC|MICC|SWA|MET|PPE|CDM|DDA|RCD|RCBO|MCB|PV|\d+\s*kV)\b/g
  ) ?? [];
  const generic = normalized.match(/\b[A-Z]{3,}(?:-[A-Z0-9]+)*\b/g) ?? [];
  return unique([...explicit, ...generic].map((value) => normalizeWhitespace(value)).filter(Boolean));
}

type SubjectTermProfile = {
  id: 'generic' | 'electrical';
  protectedTerms: string[];
};

function inferSubjectTermProfile(subject: string): SubjectTermProfile {
  const normalized = normalizeWhitespace(subject).toLowerCase();
  // Keep protected-term correction scoped to the active subject. If dynamic V2 expands to biology
  // or another domain, add a new subject profile here rather than reusing the electrical term set.
  if (/\b2365\b|\belectrical\b|\binstallation\b/.test(normalized)) {
    return {
      id: 'electrical',
      protectedTerms: [...ELECTRICAL_SUBJECT_PROTECTED_TERMS],
    };
  }
  return {
    id: 'generic',
    protectedTerms: [],
  };
}

function compactTechnicalToken(token: string): string {
  return normalizeWhitespace(token).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const prev = new Array<number>(b.length + 1);
  const next = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) prev[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    next[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      next[j] = Math.min(
        next[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = next[j];
  }

  return prev[b.length];
}

function buildCanonicalTechnicalTerms(
  input: DynamicLessonGenerationInput,
  vocabulary: DynamicVocabularyPhaseOutput
): string[] {
  const preferredTerms = unique([
    ...inferSubjectTermProfile(input.subject).protectedTerms,
    ...extractNamedEntities(input.sourceText),
  ].map((item) => normalizeWhitespace(item)).filter(Boolean));
  const fallbackTerms = unique([
    ...vocabulary.terms.flatMap((term) =>
      extractNamedEntities([term.term, term.simpleDefinition, term.anchor].map((item) => normalizeWhitespace(item)).filter(Boolean).join(' '))
    ),
    ...vocabulary.anchorPhrases.flatMap((phrase) => extractNamedEntities(phrase)),
    ...vocabulary.misconceptionTargets.flatMap((phrase) => extractNamedEntities(phrase)),
  ].map((item) => normalizeWhitespace(item)).filter(Boolean));

  const merged = [...preferredTerms];
  for (const term of fallbackTerms) {
    const replacement = findCanonicalTechnicalReplacement(term, preferredTerms);
    if (replacement) continue;
    if (!merged.includes(term)) merged.push(term);
  }
  return merged;
}

function normalizeCanonicalTechnicalTermsInPlanning(
  planning: DynamicPlanningPhaseOutput,
  canonicalTerms: string[]
): DynamicPlanningPhaseOutput {
  const normalizeList = (items: string[]): string[] =>
    unique(items.map((item) => normalizeCanonicalTechnicalTermsInText(item, canonicalTerms) ?? '').map((item) => normalizeWhitespace(item)).filter(Boolean));

  return {
    ...planning,
    lessonAim: normalizeCanonicalTechnicalTermsInText(planning.lessonAim, canonicalTerms) ?? planning.lessonAim,
    teachChecks: planning.teachChecks.map((teachCheck) => ({
      ...teachCheck,
      title: normalizeCanonicalTechnicalTermsInText(teachCheck.title, canonicalTerms) ?? teachCheck.title,
      objective: normalizeCanonicalTechnicalTermsInText(teachCheck.objective, canonicalTerms) ?? teachCheck.objective,
      conceptFocus: normalizeCanonicalTechnicalTermsInText(teachCheck.conceptFocus, canonicalTerms) ?? teachCheck.conceptFocus,
      whyItMatters: normalizeCanonicalTechnicalTermsInText(teachCheck.whyItMatters, canonicalTerms) ?? teachCheck.whyItMatters,
      misconceptions: normalizeList(teachCheck.misconceptions),
    })),
    workedExampleObjective: normalizeCanonicalTechnicalTermsInText(planning.workedExampleObjective, canonicalTerms),
    guidedPracticeObjective: normalizeCanonicalTechnicalTermsInText(planning.guidedPracticeObjective, canonicalTerms),
    practiceObjective: normalizeCanonicalTechnicalTermsInText(planning.practiceObjective, canonicalTerms),
    integrativeObjective: normalizeCanonicalTechnicalTermsInText(planning.integrativeObjective, canonicalTerms),
    spacedReviewObjective: normalizeCanonicalTechnicalTermsInText(planning.spacedReviewObjective, canonicalTerms),
    inScope: normalizeList(planning.inScope),
    outOfScope: normalizeList(planning.outOfScope),
    constraints: normalizeList(planning.constraints),
  };
}

function normalizeCanonicalTechnicalTermsInVocabulary(
  vocabulary: DynamicVocabularyPhaseOutput,
  canonicalTerms: string[]
): DynamicVocabularyPhaseOutput {
  const normalizeList = (items: string[]): string[] =>
    unique(items.map((item) => normalizeCanonicalTechnicalTermsInText(item, canonicalTerms) ?? '').map((item) => normalizeWhitespace(item)).filter(Boolean));

  return {
    ...vocabulary,
    terms: vocabulary.terms.map((term) => ({
      ...term,
      term: normalizeCanonicalTechnicalTermsInText(term.term, canonicalTerms) ?? term.term,
      simpleDefinition: normalizeCanonicalTechnicalTermsInText(term.simpleDefinition, canonicalTerms) ?? term.simpleDefinition,
      anchor: normalizeCanonicalTechnicalTermsInText(term.anchor, canonicalTerms) ?? term.anchor,
      misconception: normalizeCanonicalTechnicalTermsInText(term.misconception, canonicalTerms),
    })),
    anchorPhrases: normalizeList(vocabulary.anchorPhrases),
    misconceptionTargets: normalizeList(vocabulary.misconceptionTargets),
  };
}

function findCanonicalTechnicalReplacement(token: string, canonicalTerms: string[]): string | null {
  const tokenKey = compactTechnicalToken(token);
  if (tokenKey.length < 4) return null;

  const canonicalMap = new Map<string, string>();
  canonicalTerms.forEach((term) => {
    const key = compactTechnicalToken(term);
    if (key) canonicalMap.set(key, normalizeWhitespace(term));
  });

  if (canonicalMap.has(tokenKey)) {
    const exactCanonical = canonicalMap.get(tokenKey);
    return exactCanonical && exactCanonical !== normalizeWhitespace(token) ? exactCanonical : null;
  }

  let bestMatch: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let matchCount = 0;

  canonicalMap.forEach((term, key) => {
    if (!key || key[0] !== tokenKey[0]) return;
    if (Math.abs(key.length - tokenKey.length) > 1) return;
    const distance = levenshteinDistance(tokenKey, key);
    if (distance > 1) return;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = term;
      matchCount = 1;
      return;
    }
    if (distance === bestDistance) {
      matchCount += 1;
    }
  });

  if (bestDistance !== 1 || matchCount !== 1 || !bestMatch) return null;
  return bestMatch;
}

function normalizeCanonicalTechnicalTermsInText(text: string | undefined, canonicalTerms: string[]): string | undefined {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return normalized || undefined;

  let result = normalized;
  for (const entity of extractNamedEntities(normalized)) {
    const replacement = findCanonicalTechnicalReplacement(entity, canonicalTerms);
    if (!replacement || replacement === entity) continue;
    result = result.replace(new RegExp(`\\b${escapeRegExp(entity)}\\b`, 'g'), replacement);
  }

  return result;
}

function normalizeCanonicalTechnicalTermsInLesson(
  lesson: DynamicGuidedV2Lesson,
  input: DynamicLessonGenerationInput,
  vocabulary: DynamicVocabularyPhaseOutput
): DynamicGuidedV2Lesson {
  const canonicalTerms = buildCanonicalTechnicalTerms(input, vocabulary);
  if (canonicalTerms.length === 0) return lesson;

  const normalizeList = (items: string[] | undefined): string[] | undefined => {
    if (!items) return undefined;
    return unique(items.map((item) => normalizeCanonicalTechnicalTermsInText(item, canonicalTerms) ?? '').map((item) => normalizeWhitespace(item)).filter(Boolean));
  };

  return {
    ...lesson,
    title: normalizeCanonicalTechnicalTermsInText(lesson.title, canonicalTerms) ?? lesson.title,
    keyTerms: normalizeList(lesson.keyTerms),
    keyIdeas: normalizeList(lesson.keyIdeas),
    steps: lesson.steps.map((step) => ({
      ...step,
      title: normalizeCanonicalTechnicalTermsInText(step.title, canonicalTerms) ?? step.title,
      objective: normalizeCanonicalTechnicalTermsInText(step.objective, canonicalTerms) ?? step.objective,
      retrievalText: normalizeCanonicalTechnicalTermsInText(step.retrievalText, canonicalTerms),
      keyTerms: normalizeList(step.keyTerms),
      keyIdeas: normalizeList(step.keyIdeas),
      anchorFacts: normalizeList(step.anchorFacts),
      misconceptionsToWatch: normalizeList(step.misconceptionsToWatch),
      taskConstraints: normalizeList(step.taskConstraints),
      questionIntent: normalizeCanonicalTechnicalTermsInText(step.questionIntent, canonicalTerms),
      deeperQuestionIntent: normalizeCanonicalTechnicalTermsInText(step.deeperQuestionIntent, canonicalTerms),
      questionText: normalizeCanonicalTechnicalTermsInText(step.questionText, canonicalTerms),
      answerGuidance: normalizeList(step.answerGuidance),
      deeperQuestionText: normalizeCanonicalTechnicalTermsInText(step.deeperQuestionText, canonicalTerms),
      deeperAnswerGuidance: normalizeList(step.deeperAnswerGuidance),
      hint: normalizeCanonicalTechnicalTermsInText(step.hint, canonicalTerms),
      basicQuestions: step.basicQuestions?.map((question) => ({
        ...question,
        questionText: normalizeCanonicalTechnicalTermsInText(question.questionText, canonicalTerms) ?? question.questionText,
        answerGuidance: normalizeList(question.answerGuidance),
      })),
      taskSkeleton: step.taskSkeleton
        ? {
            ...step.taskSkeleton,
            scenario: normalizeCanonicalTechnicalTermsInText(step.taskSkeleton.scenario, canonicalTerms),
            steps: normalizeList(step.taskSkeleton.steps),
            takeaway: normalizeCanonicalTechnicalTermsInText(step.taskSkeleton.takeaway, canonicalTerms),
            requiredOutputs: normalizeList(step.taskSkeleton.requiredOutputs),
          }
        : undefined,
      asset: step.asset
        ? {
            ...step.asset,
            title: normalizeCanonicalTechnicalTermsInText(step.asset.title, canonicalTerms) ?? step.asset.title,
            description: normalizeCanonicalTechnicalTermsInText(step.asset.description, canonicalTerms),
            placeholderText: normalizeCanonicalTechnicalTermsInText(step.asset.placeholderText, canonicalTerms),
          }
        : undefined,
    })),
  };
}

function questionRequestsSpecificTerm(questionText: string): boolean {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  return /what term|specific term|technical term|technical name|full technical name|what is the name|name of the term|what does .* stand for|what is the type|which circuit type|which earthing system|what is the circuit type/.test(normalized);
}

function questionRequiresNarrowExpansion(questionText: string): boolean {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  return /what does .* stand for|what does the letter|technical abbreviation|abbreviation .* stand for|what is the code letter/.test(normalized);
}

function inferCodeLetterMeaning(questionText: string): string | null {
  const normalized = normalizeWhitespace(questionText);
  const letterMatch =
    normalized.match(/letter\s+['"]?([A-Za-z])['"]?/i) ??
    normalized.match(/\bwhat does (?:the )?['"]?([A-Za-z])['"]?\s+stand for\b/i);
  const letter = letterMatch?.[1]?.toUpperCase() ?? null;
  if (!letter) return null;

  if (/\bTN-S\b/i.test(normalized) && letter === 'S') return 'Separate';
  if (/\bTN-C-S\b/i.test(normalized) && letter === 'C') return 'Combined';
  if (/\bTN-C-S\b/i.test(normalized) && letter === 'S') return 'Separate';
  if (/\bTN\b/i.test(normalized) && letter === 'N') return 'Neutral';
  if (/\bTT\b/i.test(normalized) && letter === 'T') return 'Terra';
  if (/\bTN\b/i.test(normalized) && letter === 'T') return 'Terra';
  if (/\bearthing system codes?\b|\bearthing codes?\b/i.test(normalized) && letter === 'S') return 'Separate';
  if (/\bearthing system codes?\b|\bearthing codes?\b/i.test(normalized) && letter === 'C') return 'Combined';
  if (/\bearthing system codes?\b|\bearthing codes?\b/i.test(normalized) && letter === 'N') return 'Neutral';
  if (/\bearthing system codes?\b|\bearthing codes?\b/i.test(normalized) && letter === 'T') return 'Terra';
  return null;
}

function phraseInitials(phrase: string, includeStopWords: boolean): string {
  const words = normalizeWhitespace(phrase)
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ''))
    .filter(Boolean)
    .filter((word) => includeStopWords || !ACRONYM_STOP_WORDS.has(word.toLowerCase()));
  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

function cleanExpansionPhrase(phrase: string, acronym?: string): string {
  const normalized = normalizeWhitespace(phrase);
  if (!normalized) return '';
  if (!acronym) return normalized;
  return normalizeWhitespace(
    normalized
      .replace(new RegExp(`\\(\\s*${acronym}\\s*\\)`, 'ig'), '')
      .replace(new RegExp(`\\b${acronym}\\b`, 'ig'), '')
  );
}

function phraseMatchesAcronym(acronym: string, phrase: string): boolean {
  const normalizedAcronym = normalizeWhitespace(acronym).toUpperCase();
  if (!normalizedAcronym || normalizedAcronym.length < 2) return false;
  const cleanedPhrase = cleanExpansionPhrase(phrase, normalizedAcronym);
  if (!cleanedPhrase) return false;
  return (
    phraseInitials(cleanedPhrase, false) === normalizedAcronym ||
    phraseInitials(cleanedPhrase, true) === normalizedAcronym
  );
}

function inferComponentMeaning(questionText: string): string | null {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (/\bcombined neutral(?: and|\/)earth\b.*\bconductor\b|\bpen conductor\b|\bprotective earth and neutral\b|\bsingle conductor used in the street\b|\bsingle conductor .* neutral .* earth\b/.test(normalized)) {
    return 'PEN conductor';
  }
  if (/\bwhere do all\b.*\bcpc\b.*\bmeet\b|\bwhich terminal do all\b.*\bcpc\b.*\breach\b/.test(normalized)) {
    return 'Main Earthing Terminal';
  }
  if (/\bindividual circuit\b|\bevery individual circuit\b|\bpath for fault current\b|\binside .*cable\b/.test(normalized)) {
    return 'Circuit Protective Conductor';
  }
  if (/\bextraneous metalwork\b|\bgas and water pipes\b|\bmetal service pipes\b|\bconnect .* to the main earthing terminal\b/.test(normalized)) {
    return 'Main Protective Bonding Conductors';
  }
  if (/\bname of the single main wire\b.*\bconnects the met\b|\bconnects the met to the actual source of earth\b|\bmain wire\b.*\bsource of earth\b|\bwire\b.*\bsource of earth\b/.test(normalized)) {
    return 'Earthing Conductor';
  }
  if (/\bsingle .*master.* cable\b|\bmain earthing terminal\b.*\bsource of earth\b|\bconnects .*installation.* to the source of earth\b/.test(normalized)) {
    return 'Earthing Conductor';
  }
  if (/\btt system\b.*\bconnect to earth\b|\brod driven into the ground\b|\bcomponent must a consumer provide\b/.test(normalized)) {
    return 'Earth electrode';
  }
  return null;
}

function inferSpecificTechnicalAnswer(questionText: string): string | null {
  const normalized = normalizeWhitespace(questionText).toLowerCase();

  if (/\bwhat does (?:the )?(?:abbreviation )?['"]?pv['"]? stand for\b|\bwhat does pv stand for\b/.test(normalized)) {
    return 'Photovoltaic';
  }
  if (/\bwhat does the abbreviation ['"]?kv['"]? stand for\b|\bwhat does ['"]?kv['"]? stand for\b/.test(normalized)) {
    return 'Kilovolts';
  }
  if (/\bmicc\b.*\binsulation\b|\bmaterial .* inside an micc cable\b|\bmineral insulated copper clad\b.*\binsulation\b/.test(normalized)) {
    return 'Magnesium Oxide';
  }
  if (/\bburning organic material(?:s)?\b|\borganic material(?:s)?\b.*\bgeneration\b|\bwood.*pellets\b|\bplant material\b.*\bgeneration\b/.test(normalized)) {
    return 'Biomass';
  }
  if (/\bmoving water\b|\bwater to drive turbines\b|\bflowing water\b.*\bturbines?\b|\bhydro-electric\b/.test(normalized)) {
    return 'Hydro';
  }
  if (/\bmoving air\b|\bwind turbine\b|\bwind farm\b.*\bgeneration\b/.test(normalized)) {
    return 'Wind';
  }
  if (/\bnuclear fission\b|\buranium\b.*\bgeneration\b|\bnuclear reactor\b/.test(normalized)) {
    return 'Nuclear';
  }
  if (/\bcombined cycle gas turbine\b|\bccgt\b|\bgas turbine\b.*\bsteam turbine\b/.test(normalized)) {
    return 'CCGT';
  }
  if (/\bcentral part of an atom\b|\bdense central region\b.*\batom\b|\bcentre of an atom\b/.test(normalized)) {
    return 'Nucleus';
  }
  if (/\breduction in electrical pressure\b|\bloss of electrical pressure\b|\bvoltage drop\b.*\belectrical pressure\b|\belectrical pressure\b.*\bused up\b/.test(normalized)) {
    return 'Voltage Drop';
  }
  if (/\binherent material property\b|\bproperty of the material itself\b|\bthe ['"]?dna['"]? of the metal\b|\bnatural property of the material\b/.test(normalized)) {
    return 'Resistivity';
  }
  if (/\bopposition to (?:the )?(?:current\s+)?flow\b|\bopposition a component offers to current flow\b|\brestricts? or fights? the flow\b|\brestricts? the flow\b|\bfights? the flow\b/.test(normalized)) {
    return 'Resistance';
  }
  if (/\bwhat specific element\b.*\benergy meter\b.*\bwattmeter\b|\bwhat does the ['"]?h['"]? stand for in the unit kwh\b/.test(normalized)) {
    return 'Time';
  }
  if (/\balternative technical name\b|\balso called\b|\bother technical name\b/.test(normalized) && /\btn-c-s\b|\bpme\b|\bprotective multiple earthing\b/.test(normalized)) {
    return 'Protective Multiple Earthing (PME)';
  }
  if (/\blighting\b.*\bmost commonly used\b|\bmost common\b.*\blighting circuit\b|\bused for lighting points\b/i.test(normalized)) {
    return 'Radial circuit';
  }
  if (/\bcommon micro-generation method\b.*\brooftops?\b|\brooftop\b.*\bmicro-generation method\b|\bdomestic solar panels\b.*\bmethod\b/.test(normalized)) {
    return 'Photovoltaic';
  }
  if (/\bsmall-scale electricity production\b|\bdomestic solar panels\b|\bsmall-scale production\b/.test(normalized)) {
    return 'Micro-generation';
  }
  if (/\benergy meter\b.*\binclude\b.*\bstandard wattmeter\b.*\bdoes not\b|\bwhat specific element\b.*\benergy meter\b.*\bwattmeter\b/.test(normalized)) {
    return 'Time';
  }
  if (/\bcombined neutral and earth\b.*\bsplit\b|\bcombined in the street\b.*\bseparated\b|\bprotective multiple earthing\b|\bpme\b/.test(normalized)) {
    return 'TN-C-S';
  }
  if (/\blocal earth electrode\b|\bsupplier provides no earth\b|\bcopper rod\b|\bown local earth\b/.test(normalized)) {
    return 'TT';
  }
  if (/\bseparate earth conductor\b|\bcable sheath\b|\bseparate throughout\b/.test(normalized)) {
    return 'TN-S';
  }
  return null;
}

function inferInstrumentGuidance(
  questionText: string,
  vocabulary: DynamicVocabularyPhaseOutput
): string[] | null {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  const explicitInstrumentCue = /\b(?:which|what)\s+(?:instrument|meter|tool)\b|\b(?:instrument|meter|tool)\s+(?:should|would|do)\s+(?:you|we)\s+use\b|\buse\s+(?:an?\s+)?(?:instrument|meter|tool)\s+to measure\b|\bused to measure\b|\buse to measure\b/.test(normalized);
  const locationCue = /\bwhere\b|\bat the load\b|\bat the (?:terminals?|consumer unit|distribution board|socket|appliance)\b|\bacross\b|\bbetween\b|\bterminals?\b|\bpoint in the circuit\b|\blocation\b/.test(normalized);
  const measurementContextOnly = /\bmeasure(?:s|ment)?\b|\bchecking\b|\bcheck(?:ing)?\b|\btest(?:ing)?\b/.test(normalized);
  const instrumentCue = explicitInstrumentCue || (measurementContextOnly && /\b(?:instrument|meter|tool)\b/.test(normalized));
  if (!instrumentCue) {
    return null;
  }
  if (locationCue) {
    return null;
  }
  if (/\b(?:si )?unit\b|\bunit of measurement\b|\bsymbol\b/i.test(normalized)) {
    return null;
  }
  if (/\bcommon (?:technical )?name\b/i.test(normalized) && /\benergy meter\b/i.test(normalized)) {
    return ['kWh meter', 'A kWh meter', 'Kilowatt-hour meter'];
  }
  if (/\bvery high internal resistance\b|\bhigh internal resistance\b/.test(normalized) && /\belectrical pressure\b|\bvoltage\b|\bpotential difference\b/.test(normalized)) {
    return ['Voltmeter', 'A voltmeter'];
  }
  if (/\bvery low internal resistance\b|\blow internal resistance\b/.test(normalized) && /\bcurrent\b|\bflow\b/.test(normalized)) {
    return ['Ammeter', 'An ammeter'];
  }
  const mappings = [
    { questionPattern: /\bresistance\b|\bohm\b|\bopposition to (?:the )?(?:current\s+)?flow\b|\bopposition to the flow of current\b|\brestricts? or fights? the flow\b|\brestricts? the flow\b|\bfights? the flow\b/i, termPattern: /\bohmmeter\b/i, fallback: ['Ohmmeter', 'An ohmmeter'] },
    { questionPattern: /\bvoltage\b|\bpotential difference\b|\belectrical pressure\b/i, termPattern: /\bvoltmeter\b/i, fallback: ['Voltmeter', 'A voltmeter'] },
    { questionPattern: /\bcurrent\b|\bflow of electric current\b|\bflow of electricity\b/i, termPattern: /\bammeter\b/i, fallback: ['Ammeter', 'An ammeter'] },
    { questionPattern: /\bpower\b|\bwatt\b|\brate of electrical power\b|\binstantaneous\b/i, termPattern: /\bwattmeter\b/i, fallback: ['Wattmeter', 'A wattmeter'] },
    { questionPattern: /\benergy\b|\bconsum(?:ed|ption)\b|\bkwh\b|\bkilowatt-hour\b/i, termPattern: /\benergy meter\b/i, fallback: ['Energy Meter', 'An energy meter'] },
  ];

  for (const mapping of mappings) {
    if (!mapping.questionPattern.test(normalized)) continue;
    const matchedTerm = vocabulary.terms.find((term) => mapping.termPattern.test(term.term));
    if (!matchedTerm) return mapping.fallback;
    const canonical = normalizeWhitespace(matchedTerm.term);
    const article = /^[aeiou]/i.test(canonical) ? `An ${canonical.toLowerCase()}` : `A ${canonical.toLowerCase()}`;
    return [canonical, article];
  }

  return null;
}

function inferRequiredVocabularyTerm(
  questionText: string,
  vocabulary: DynamicVocabularyPhaseOutput
): string | null {
  if (!questionRequestsSpecificTerm(questionText)) return null;
  if (questionRequiresNarrowExpansion(questionText)) {
    const acronym = extractNamedEntities(questionText).find((entity) => /^[A-Z0-9-]{2,}$/i.test(entity));
    if (acronym) {
      for (const term of vocabulary.terms) {
        if (phraseMatchesAcronym(acronym, term.term)) {
          return cleanExpansionPhrase(term.term, acronym);
        }
        if (phraseMatchesAcronym(acronym, term.simpleDefinition)) {
          return cleanExpansionPhrase(term.simpleDefinition, acronym);
        }
        if (phraseMatchesAcronym(acronym, term.anchor)) {
          return cleanExpansionPhrase(term.anchor, acronym);
        }
      }
    }
  }
  const questionTokens = new Set(tokenizeLower(questionText));
  let bestTerm: string | null = null;
  let bestScore = 0;
  let bestDirectOverlap = 0;
  const narrowExpansion = questionRequiresNarrowExpansion(questionText);

  for (const term of vocabulary.terms) {
    const termTokens = new Set(tokenizeLower(term.term));
    const supportTokens = new Set([
      ...tokenizeLower(term.simpleDefinition),
      ...tokenizeLower(term.anchor),
    ]);
    let directOverlap = 0;
    let supportOverlap = 0;
    for (const token of termTokens) {
      if (questionTokens.has(token)) directOverlap += 1;
    }
    for (const token of supportTokens) {
      if (questionTokens.has(token)) supportOverlap += 1;
    }
    const score = directOverlap * 3 + supportOverlap;
    if (score > bestScore) {
      bestScore = score;
      bestDirectOverlap = directOverlap;
      bestTerm = normalizeWhitespace(term.term);
    }
  }

  const definitionPrompt = /\bwhat is the name of\b|\bwhat is the type of\b|\bwhich circuit type\b|\bwhich earthing system\b/i.test(questionText);
  if (narrowExpansion) {
    return bestDirectOverlap >= 1 && bestScore >= 3 ? bestTerm : null;
  }

  if (definitionPrompt) {
    return bestScore >= 2 ? bestTerm : null;
  }

  return bestDirectOverlap >= 1 || bestScore >= 3 ? bestTerm : null;
}

function buildExactTermGuidance(term: string): string[] {
  const normalized = normalizeWhitespace(term);
  const variants = new Set<string>([normalized]);
  if (/^Terra$/i.test(normalized)) {
    variants.add('Terre');
    variants.add('Earth');
  }
  if (/^Kilovolts$/i.test(normalized)) {
    variants.add('kilovolts');
    variants.add('kilo-volts');
    variants.add('1,000 volts');
  }
  const acronymPrefix = normalized.match(/^((?:TT|TN-S|TN-C-S|MICC|SWA|CPC|MET|PV))(?:\s+.+)?$/i)?.[1];
  const acronymInParens = normalized.match(/\(([^)]+)\)/)?.[1];
  if (acronymPrefix) {
    variants.add(normalizeWhitespace(acronymPrefix.toUpperCase()));
  }
  if (acronymInParens && /^[A-Z0-9-]{2,}$/i.test(acronymInParens)) {
    variants.add(normalizeWhitespace(acronymInParens.toUpperCase()));
  }
  if (normalized.includes('-')) {
    variants.add(normalized.replace(/-/g, ' '));
  }
  if (/\bearthing system$/i.test(normalized)) {
    variants.add(normalizeWhitespace(normalized.replace(/\s+earthing system$/i, '')));
  }
  if (/^Circuit Protective Conductor$/i.test(normalized)) {
    variants.add('CPC');
  }
  if (/^PEN conductor$/i.test(normalized)) {
    variants.add('PEN');
    variants.add('Protective Earth and Neutral');
  }
  if (/^Main Earthing Terminal$/i.test(normalized)) {
    variants.add('MET');
    variants.add('Earth bar');
  }
  if (/^Main Protective Bonding Conductors$/i.test(normalized)) {
    variants.add('Main Protective Bonding');
    variants.add('Bonding conductors');
  }
  if (/^Photovoltaic$/i.test(normalized)) {
    variants.add('Photo-voltaic');
    variants.add('PV');
  }
  if (/^Magnesium Oxide$/i.test(normalized)) {
    variants.add('Mineral powder');
    variants.add('Mineral insulation');
  }
  return Array.from(variants).map((item) => normalizeWhitespace(item)).filter(Boolean).slice(0, 3);
}

type ExactAnswerBinding = {
  canonicalAnswer: string;
  acceptedVariants: string[];
};

function classifyGenerationQuestionType(questionText: string, answerGuidance: string[] = []): GenerationQuestionType {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);

  if (looksLikeExplanationPrompt(normalizedQuestion)) {
    if (/\bfault\b|\bpath\b|\bearth loop\b|\bback to the source\b/i.test(normalizedQuestion)) {
      return 'path_explanation';
    }
    return 'short_explanation';
  }
  if (/\bwhat does\b.+\bstand for\b/i.test(normalizedQuestion)) return 'abbreviation_expansion';
  if (/\bwhat does the [A-Z] stand for\b/i.test(normalizedQuestion)) return 'code_letter';
  if (/\bunit(?: of measurement)?\b/i.test(normalizedQuestion)) return 'unit';
  if (/^(?:what is the name of|what is the technical term for|what is the common name for)\b/i.test(normalizedQuestion)) {
    return 'definition_to_name';
  }
  if (/\bclassify\b|\blegal status\b|\bstatutory\b|\bnon-statutory\b|\bwhich category\b/i.test(normalizedQuestion)) {
    return 'classification';
  }
  if (/\bcalculate\b|\bwork out\b|\bdetermine\b.+\b(?:amps?|volts?|ohms?|watts?|kV|current|voltage|resistance|power)\b/i.test(normalizedQuestion)) {
    return 'calculation_result';
  }
  if (
    questionRequestsSpecificTerm(normalizedQuestion) ||
    /\bwhich (?:earthing system|circuit type|wiring system|component|device|instrument)\b/i.test(normalizedQuestion)
  ) {
    return 'exact_term';
  }
  if (/\bscenario\b/i.test(normalizedQuestion) || normalizedGuidance.length > 0) {
    return 'scenario_identification';
  }
  return 'generic';
}

function normalizeConceptPoint(point: string): string {
  return normalizeWhitespace(
    point
      .replace(/^(?:that|because|which|therefore|so|this means|meaning that)\s+/i, '')
      .replace(/\b(?:it|this|that)\s+is\s+/i, '')
      .replace(/[.]+$/g, '')
  );
}

function compactConceptPoints(items: string[], limit = 4): string[] {
  return unique(
    splitExplanationGuidancePoints(items)
      .map((item) => normalizeConceptPoint(item))
      .filter(Boolean)
  ).slice(0, limit);
}

function buildCanonicalAnswerPacket(
  questionText: string,
  answerGuidance: string[],
  vocabulary: DynamicVocabularyPhaseOutput
): CanonicalAnswerPacket | null {
  const questionType = classifyGenerationQuestionType(questionText, answerGuidance);

  if (questionType === 'unit') {
    const unitGuidance = normalizeUnitQuestionGuidance(questionText, answerGuidance);
    return unitGuidance
      ? {
          questionType,
          canonicalAnswer: unitGuidance[0],
          acceptedVariants: unitGuidance,
          conceptPoints: [],
        }
      : null;
  }

  if (questionType === 'short_explanation' || questionType === 'path_explanation') {
    const conceptPoints = compactConceptPoints(answerGuidance, questionType === 'path_explanation' ? 5 : 4);
    return conceptPoints.length > 0
      ? {
          questionType,
          acceptedVariants: [],
          conceptPoints,
        }
      : null;
  }

  if (questionType === 'calculation_result') {
    const numericGuidance = unique(
      sanitizeSingleBoxGuidance(answerGuidance).filter((item) => /\b\d/.test(item))
    );
    return numericGuidance.length > 0
      ? {
          questionType,
          canonicalAnswer: numericGuidance[0],
          acceptedVariants: numericGuidance.slice(0, 4),
          conceptPoints: [],
        }
      : null;
  }

  const instrumentGuidance = inferInstrumentGuidance(questionText, vocabulary);
  if (instrumentGuidance) {
    return {
      questionType: questionType === 'generic' ? 'exact_term' : questionType,
      canonicalAnswer: instrumentGuidance[0],
      acceptedVariants: instrumentGuidance,
      conceptPoints: [],
    };
  }

  const exactBinding = buildExactAnswerBinding(questionText, answerGuidance, vocabulary);
  if (exactBinding) {
    return {
      questionType,
      canonicalAnswer: exactBinding.canonicalAnswer,
      acceptedVariants: exactBinding.acceptedVariants,
      conceptPoints: [],
    };
  }

  if (questionType === 'classification') {
    const classificationGuidance = expandClassificationMappings(questionText, answerGuidance) ?? sanitizeSingleBoxGuidance(answerGuidance);
    return classificationGuidance.length > 0
      ? {
          questionType,
          canonicalAnswer: classificationGuidance[0],
          acceptedVariants: classificationGuidance,
          conceptPoints: [],
        }
      : null;
  }

  if (questionType === 'scenario_identification' || questionType === 'exact_term' || questionType === 'definition_to_name') {
    const singleTargetGuidance = sanitizeSingleBoxGuidance(answerGuidance);
    return singleTargetGuidance.length > 0
      ? {
          questionType,
          canonicalAnswer: singleTargetGuidance[0],
          acceptedVariants: unique(singleTargetGuidance).slice(0, 4),
          conceptPoints: [],
        }
      : null;
  }

  return null;
}

function buildExactAnswerBinding(
  questionText: string,
  answerGuidance: string[],
  vocabulary: DynamicVocabularyPhaseOutput
): ExactAnswerBinding | null {
  const codeLetterMeaning = inferCodeLetterMeaning(questionText);
  const componentMeaning = inferComponentMeaning(questionText);
  const specificTechnicalAnswer = inferSpecificTechnicalAnswer(questionText);
  const exactTerm = inferRequiredVocabularyTerm(questionText, vocabulary);
  const expectedLabel = extractQuestionTargetLabel(questionText);
  const preferredSpecificAnswer =
    expectedLabel === 'earthing system type' || expectedLabel === 'circuit type'
      ? specificTechnicalAnswer ?? componentMeaning
      : componentMeaning ?? specificTechnicalAnswer;
  const canonicalAnswer = normalizeWhitespace(
    codeLetterMeaning ?? preferredSpecificAnswer ?? exactTerm ?? ''
  );

  if (!canonicalAnswer) return null;

  const narrowExpansion = questionRequiresNarrowExpansion(questionText);
  const canonicalWords = normalizeWhitespace(canonicalAnswer.replace(/-/g, ' ')).toLowerCase();
  const questionAcronyms = new Set(
    extractNamedEntities(questionText)
      .filter((entity) => /^[A-Z0-9-]{2,}$/i.test(entity))
      .map((entity) => entity.toUpperCase())
  );

  const acceptedVariants = unique(
    buildExactTermGuidance(canonicalAnswer).filter((variant) => {
      const normalizedVariant = normalizeWhitespace(variant);
      if (!normalizedVariant) return false;

      const spacedVariant = normalizeWhitespace(normalizedVariant.replace(/-/g, ' ')).toLowerCase();
      if (spacedVariant === canonicalWords) return true;

      if (narrowExpansion) {
        return false;
      }

      const variantAcronym = /^[A-Z0-9-]{2,}$/i.test(normalizedVariant) ? normalizedVariant.toUpperCase() : null;
      if (variantAcronym && questionAcronyms.has(variantAcronym)) {
        return false;
      }

      if (questionRequestsSpecificTerm(questionText)) {
        const variantTokens = tokenizeLower(normalizedVariant);
        const canonicalTokens = new Set(tokenizeLower(canonicalAnswer));
        const topicOnlyExtras = variantTokens.filter(
          (token) =>
            !canonicalTokens.has(token) &&
            /^(generation|generating|production|system|systems|method|methods|supply|chain|voltage|voltages|type|types)$/.test(token)
        );
        if (topicOnlyExtras.length > 0) {
          return false;
        }
      }

      return true;
    })
  );

  const filteredGuidance = acceptedVariants.length > 0
    ? acceptedVariants
    : [canonicalAnswer];

  const fallbackGuidance = unique(
    answerGuidance
      .map((item) => normalizeWhitespace(item))
      .filter((item) => normalizeWhitespace(item).toLowerCase() === canonicalAnswer.toLowerCase())
  );

  return {
    canonicalAnswer,
    acceptedVariants: unique([canonicalAnswer, ...filteredGuidance, ...fallbackGuidance]).slice(0, 3),
  };
}

function rewriteSystemRoleTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  if (!/\bidentify\b/i.test(normalizedQuestion) || !/\bexplain\b/i.test(normalizedQuestion)) {
    return null;
  }

  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const systemType = normalizedGuidance.find((item) => /\bTT\b|\bTN-S\b|\bTN-C-S\b/i.test(item)) ?? null;
  const roleTargets = normalizedGuidance.filter((item) => /\bCPC\b|\bearthing conductor\b|\bfault current\b|\bprotective device\b|\bMET\b/i.test(item));
  if (!systemType && roleTargets.length < 2) {
    return null;
  }

  const arrangement = systemType ? `in this ${systemType} arrangement` : 'in this arrangement';
  return {
    questionText:
      stage === 'integrative'
        ? `Using one short explanation, explain how the fault path works ${arrangement} so ADS can disconnect safely.`
        : `Using one short explanation, explain how the conductors work together ${arrangement} so the protective device can operate during a fault.`,
    answerGuidance: unique(
      [
        ...(systemType ? [systemType] : []),
        ...roleTargets.slice(0, 3),
        'fault current path',
        'protective device disconnects / trips',
      ]
        .map((item) => normalizeWhitespace(item))
        .filter(Boolean)
    ).slice(0, 5),
  };
}

function classifyTargetLabel(answer: string): string {
  const normalized = normalizeWhitespace(answer);
  if (/\bTT\b|\bTN-S\b|\bTN-C-S\b/i.test(normalized)) return 'earthing system type';
  if (/\b(?:ring final|radial|control|data)\b/i.test(normalized)) return 'circuit type';
  if (/\b(?:SWA|MICC|PVC|XLPE|fire alarm cable|conduit|trunking|tray)\b/i.test(normalized)) return 'wiring system or cable type';
  if (/\b(?:CPC|earthing conductor|bonding|earth electrode|protective device|MET)\b/i.test(normalized)) return 'component name';
  if (/\b\d+\s*kV\b/i.test(normalized)) return 'transmission voltage';
  return 'technical answer';
}

function extractQuestionTargetLabel(questionText: string): string | null {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (/\bearthing system\b|\bsystem type\b/.test(normalized)) return 'earthing system type';
  if (/\bcircuit type\b/.test(normalized)) return 'circuit type';
  if (/\bwiring system\b|\bcable type\b|\benclosure\b/.test(normalized)) return 'wiring system or cable type';
  if (/\bcomponent\b|\bconductor\b|\bdevice\b/.test(normalized)) return 'component name';
  if (/\btransmission voltage\b|\bkV\b|\bvoltage\b/.test(normalized)) return 'transmission voltage';
  return null;
}

function normalizeSingleTargetQuestionGuidance(
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  if (
    /\bcircuit type\b/i.test(normalizedQuestion) &&
    /\bcontainment system\b|\bwiring system\b|\benclosure\b/i.test(normalizedQuestion)
  ) {
    return null;
  }
  if (!/\bsingle best\b|\bspecific\b|\bidentify the\b|\bstate the\b/i.test(normalizedQuestion)) {
    return null;
  }
  const normalizedSingleBoxGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const instrumentGuidance = normalizedSingleBoxGuidance.filter((item) =>
    /\b(?:voltmeter|ammeter|ohmmeter|wattmeter|energy meter|kwh meter)\b/i.test(item)
  );
  if (instrumentGuidance.length > 0) {
    if (/\binstrument\b/i.test(normalizedQuestion) && !/\btechnical answer\b|\bbest fits\b/i.test(normalizedQuestion)) {
      return null;
    }
    if (/\btechnical answer\b|\bbest fits\b|\bsingle best\b/i.test(normalizedQuestion)) {
      return {
        questionText: /\bscenario\b/i.test(normalizedQuestion)
          ? 'From the scenario, identify the specific instrument required for this test.'
          : 'Identify the specific instrument required for this test.',
        answerGuidance: buildSingleExpectationGuidance([instrumentGuidance[0]]),
      };
    }
  }
  const targetLabel = extractQuestionTargetLabel(normalizedQuestion);
  if (!targetLabel) return null;
  const splitGuidance = splitCompoundGuidanceItems(answerGuidance);
  const matching = splitGuidance.filter((item) => classifyTargetLabel(item) === targetLabel);
  if (matching.length === 0) return null;
  if (targetLabel === 'technical answer') {
    return {
      questionText: inferApplyQuestionFromTargets(matching, matching[0]),
      answerGuidance: buildSingleExpectationGuidance([matching[0]]),
    };
  }
  const rewrittenQuestion =
    /\bstate the\b/i.test(normalizedQuestion)
      ? `State the specific ${targetLabel}.`
      : /\bfrom the scenario\b/i.test(normalizedQuestion)
        ? `From the scenario, identify the specific ${targetLabel} that best fits.`
        : `Using the scenario only, identify the single best ${targetLabel}.`;
  return {
    questionText: rewrittenQuestion,
    answerGuidance: buildSingleExpectationGuidance([matching[0]]),
  };
}

function normalizeUnitQuestionGuidance(
  questionText: string,
  answerGuidance: string[]
): string[] | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  if (!/\bunit(?: of measurement)?\b/i.test(normalizedQuestion)) return null;

  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  if (normalizedGuidance.length === 0) return null;

  if (/\bvoltage\b|\bpotential difference\b/i.test(normalizedQuestion)) {
    const filtered = normalizedGuidance.filter((item) => /\bvolt(?:s)?\b|\bV\b/i.test(item));
    return filtered.length > 0 ? unique(filtered) : ['Volt', 'Volts', 'V'];
  }
  if (/\bcurrent\b|\bflow of electrical charge\b/i.test(normalizedQuestion)) {
    const filtered = normalizedGuidance.filter((item) => /\bamp(?:s|ere(?:s)?)?\b|\bA\b/i.test(item));
    return filtered.length > 0 ? unique(filtered) : ['Ampere', 'Amps', 'A'];
  }
  if (/\bresistance\b|\bohm\b/i.test(normalizedQuestion)) {
    const filtered = normalizedGuidance.filter((item) => /\bohm(?:s)?\b|Ω/i.test(item));
    return filtered.length > 0 ? unique(filtered) : ['Ohm', 'Ohms', 'Ω'];
  }
  if (/\bpower\b|\bwatt/i.test(normalizedQuestion)) {
    const filtered = normalizedGuidance.filter((item) => /\bwatt(?:s)?\b|\bW\b/i.test(item));
    return filtered.length > 0 ? unique(filtered) : ['Watt', 'Watts', 'W'];
  }
  if (/\benergy\b|\bkwh\b|\bkilowatt-hour\b/i.test(normalizedQuestion)) {
    const filtered = normalizedGuidance.filter((item) => /\bkWh\b|\bkilowatt-hour\b|\bjoule/i.test(item));
    return filtered.length > 0 ? unique(filtered) : ['kWh', 'kilowatt-hour'];
  }

  return null;
}

function stripAnswerMetaDescription(item: string): string {
  const normalized = normalizeWhitespace(item);
  if (!normalized) return '';
  const definitionMatch = normalized.match(/^definition of ([a-z0-9 -]+?)(?: in [a-z0-9Ωohms -]+)?$/i);
  if (definitionMatch?.[1]) {
    return normalizeWhitespace(definitionMatch[1]);
  }
  return normalized;
}

function inferApplyQuestionFromTargets(answerGuidance: string[], fallbackTarget: string): string {
  const normalizedTargets = sanitizeSingleBoxGuidance(answerGuidance).map((item) => stripAnswerMetaDescription(item)).filter(Boolean);
  const joined = normalizedTargets.join(' ');
  if (normalizedTargets.some((item) => /\b\d+(?:\.\d+)?\s*volts?\b|\b\d+(?:\.\d+)?V\b/i.test(item))) {
    return 'Using the scenario, calculate the voltage drop.';
  }
  if (normalizedTargets.some((item) => /\b\d+(?:\.\d+)?\s*amps?\b|\b\d+(?:\.\d+)?A\b/i.test(item))) {
    return 'Using the scenario, calculate the current.';
  }
  if (normalizedTargets.some((item) => /\b\d+(?:\.\d+)?\s*ohms?\b|\bΩ\b/i.test(item))) {
    return 'Using the scenario, calculate the resistance.';
  }
  if (/\bvoltage drop\b/i.test(joined)) {
    return 'Using the scenario, identify the term for the loss of electrical pressure in the circuit.';
  }
  if (/\bresistance\b/i.test(joined)) {
    return 'Using the scenario, identify the correct term for the resistance effect described.';
  }
  if (/\bresistivity\b/i.test(joined)) {
    return 'Using the scenario, identify the material property that causes the higher resistance.';
  }
  const label = classifyTargetLabel(fallbackTarget);
  if (label === 'technical answer') {
    return 'Using the scenario, identify the correct technical term for what is happening.';
  }
  return `Using the scenario, identify the single best ${label}.`;
}

function looksLikeCircularAnswerLedQuestion(questionText: string): boolean {
  const normalized = normalizeWhitespace(questionText);
  return /\b(?:explain|why)\b.*\bcorrect answer\b/i.test(normalized) || /\bwhy is ['"“”]?.+['"“”]?\s+the correct answer\b/i.test(normalized);
}

function extractConcreteScenarioLine(lines: string[]): string | null {
  const normalized = lines.map((line) => normalizeWhitespace(line)).filter(Boolean);
  const explicitScenario = normalized.find((line) => /^scenario\b/i.test(line) && !containsPlaceholderLanguage(line));
  if (explicitScenario) {
    return normalizeWhitespace(explicitScenario.replace(/^scenario\s*:\s*/i, ''));
  }
  const firstConcrete = normalized.find((line) => !containsPlaceholderLanguage(line) && wordCount(line) >= 8);
  return firstConcrete ?? null;
}

function extractApplyObjectiveCue(text: string): string | null {
  const normalized = normalizeWhitespace(text).toLowerCase();
  if (!normalized) return null;
  if (/\blegal status\b|\bstatutory\b|\bnon-statutory\b/.test(normalized)) return 'legal_status';
  if (/\bstands?\s+for\b|\babbreviation\b|\bacronym\b/.test(normalized)) return 'abbreviation';
  if (/\binstrument\b|\bmeter\b|\bmeasure\b/.test(normalized)) return 'instrument';
  if (/\bgeneration method\b|\bgeneration source\b|\bmicro-generation\b/.test(normalized)) return 'generation_method';
  if ((/\boutcome\b/.test(normalized) && /\bresistan/.test(normalized)) || /\bvoltage drop\b/.test(normalized)) return 'voltage_drop';
  if (/\bmaterial property\b|\bresistivity\b/.test(normalized)) return 'material_property';
  if (/\btransmission voltage\b|\buk transmission voltage\b|\bkV\b/.test(normalized)) return 'transmission_voltage';
  if (/\bearthing system\b|\bsystem type\b/.test(normalized)) return 'system';
  if (/\bcomponent\b|\bconductor\b|\bdevice\b/.test(normalized)) return 'component';
  if (/\btechnical term\b|\bterm\b/.test(normalized)) return 'term';
  if (/\bresistance\b/.test(normalized)) return 'resistance';
  if (/\bcurrent\b/.test(normalized)) return 'current';
  if (/\bvoltage\b|\bpotential difference\b/.test(normalized)) return 'voltage';
  if (/\bpower\b/.test(normalized)) return 'power';
  if (/\benergy\b/.test(normalized)) return 'energy';
  return null;
}

function questionTextMatchesObjectiveCue(questionText: string, cue: string | null): boolean {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (!cue) return true;
  switch (cue) {
    case 'legal_status':
      return /\blegal status\b|\bstatutory\b|\bnon-statutory\b/.test(normalized);
    case 'abbreviation':
      return /\bwhat does\b.+\bstand for\b/.test(normalized);
    case 'instrument':
      return /\binstrument\b|\bmeter\b|\bmeasure\b/.test(normalized);
    case 'generation_method':
      return /\bgeneration method\b|\bgeneration source\b|\bmicro-generation\b/.test(normalized);
    case 'voltage_drop':
      return /\bvoltage drop\b|\bsupply voltage\b/.test(normalized);
    case 'material_property':
      return /\bmaterial property\b|\bresistivity\b/.test(normalized);
    case 'transmission_voltage':
      return /\btransmission voltage\b|\bkV\b/.test(normalized);
    case 'system':
      return /\bearthing system\b|\bsystem\b/.test(normalized);
    case 'component':
      return /\bcomponent\b|\bconductor\b|\bdevice\b/.test(normalized);
    case 'term':
      return /\bterm\b/.test(normalized);
    case 'resistance':
      return /\bresistance\b/.test(normalized);
    case 'current':
      return /\bcurrent\b/.test(normalized);
    case 'voltage':
      return /\bvoltage\b|\bpotential difference\b/.test(normalized);
    case 'power':
      return /\bpower\b/.test(normalized);
    case 'energy':
      return /\benergy\b/.test(normalized);
    default:
      return true;
  }
}

function buildQuestionOnlyApplyQuestion(params: {
  stage: 'guided_practice' | 'practice';
  objective: string;
  retrievalTextLines: string[];
  planning: DynamicPlanningPhaseOutput;
  input: DynamicLessonGenerationInput;
}): string {
  const objective = normalizeWhitespace(params.objective);
  const scenario = extractConcreteScenarioLine(params.retrievalTextLines) ?? '';
  const combinedContext = normalizeWhitespace(
    [
      objective,
      params.planning.lessonAim,
      params.input.topic,
      ...params.planning.inScope,
      ...params.retrievalTextLines,
    ].join(' ')
  ).toLowerCase();

  const legalStatusMatch = objective.match(/\blegal status of\s+(.+?)(?:\s+(?:from|in|using|within)\b.*)?\.?$/i);
  if (legalStatusMatch?.[1]) {
    return `What is the legal status of ${normalizeWhitespace(legalStatusMatch[1])} in this scenario?`;
  }

  const standsForMatch =
    objective.match(/\bwhat\s+(.+?)\s+stands?\s+for\b/i) ??
    objective.match(/\bexpan(?:d|sion of)\s+(.+?)(?:\s+(?:from|in|using)\b.*)?\.?$/i);
  if (standsForMatch?.[1]) {
    return `What does ${normalizeWhitespace(standsForMatch[1])} stand for?`;
  }

  const cue = extractApplyObjectiveCue(combinedContext);
  if (cue === 'instrument') {
    if (/\bvoltage\b|\bpotential difference\b/.test(combinedContext)) {
      return 'Which instrument should be used to measure voltage in this scenario?';
    }
    if (/\bresistance\b|\bohm\b/.test(combinedContext)) {
      return 'Which instrument should be used to measure resistance in this scenario?';
    }
    if (/\bcurrent\b/.test(combinedContext)) {
      return 'Which instrument should be used to measure current in this scenario?';
    }
    if (/\bpower\b/.test(combinedContext)) {
      return 'Which instrument should be used to measure power in this scenario?';
    }
    if (/\benergy\b|\bkwh\b/.test(combinedContext)) {
      return 'Which instrument should be used to measure energy use in this scenario?';
    }
    return 'Which instrument should be used in this scenario?';
  }
  if (cue === 'generation_method') {
    return 'Which generation method is shown in this scenario?';
  }
  if (cue === 'material_property') {
    return 'Which material property is causing the higher resistance in this scenario?';
  }
  if (cue === 'voltage_drop') {
    return /\blong cable\b|\bcable run\b/.test(combinedContext)
      ? 'What effect does this cable run have on the supply voltage?'
      : 'What is happening to the supply voltage in this scenario?';
  }
  if (cue === 'transmission_voltage') {
    return params.stage === 'practice'
      ? 'State one valid UK transmission voltage.'
      : 'Which transmission voltage is shown in this scenario?';
  }
  if (cue === 'system') {
    return 'Which earthing system is shown in this scenario?';
  }
  if (cue === 'component') {
    return 'Which component is being described in this scenario?';
  }
  if (cue === 'term') {
    return 'Which technical term best describes this scenario?';
  }

  const focus = objective
    .replace(/^(?:identify|state|name|select|give|explain|apply|use|demonstrate|show|check|determine)\s+/i, '')
    .replace(/\s+(?:from|in|using|within)\s+(?:one|this|the)?\s*(?:new|mixed|concrete)?\s*scenario.*$/i, '')
    .replace(/\s+independently\.?$/i, '')
    .replace(/\s+clearly\.?$/i, '')
    .replace(/\.$/, '')
    .trim();

  if (focus && !/\b(?:same reasoning|new case|idea|concept|understanding|outcome)\b/i.test(focus)) {
    if (/^(?:the legal status|one valid|the correct instrument|which|what)\b/i.test(focus)) {
      return `${focus[0].toUpperCase()}${focus.slice(1)}?`;
    }
    return `Using the scenario, identify ${focus}.`;
  }

  if (scenario) {
    return `Using this scenario, identify the main concept being applied.`;
  }

  return params.stage === 'guided_practice'
    ? 'Use the scenario to answer one specific question about the lesson idea.'
    : 'Answer one specific question from the scenario using the lesson idea.';
}

function hasWeakQuestionOnlyTask(params: {
  questionText: string;
  objective?: string | null;
  retrievalTextLines?: string[];
  contextRich?: boolean;
}): boolean {
  const questionText = normalizeWhitespace(params.questionText);
  const retrievalLines = (params.retrievalTextLines ?? []).map((line) => normalizeWhitespace(line)).filter(Boolean);
  const genericTaskStem =
    /\b(?:single best technical answer|specific technical answer|best fits|state the specific technical answer|main concept being applied)\b/i.test(questionText) ||
    looksLikeCircularAnswerLedQuestion(questionText) ||
    (/\bidentify\b/i.test(questionText) && !/\b(?:instrument|system|circuit|component|device|term|material|unit|voltage|current|resistance|resistivity|power|energy|status|generation)\b/i.test(questionText));
  const allRetrievalPlaceholder = retrievalLines.length > 0 && retrievalLines.every((line) => containsPlaceholderLanguage(line));

  return (
    !questionText ||
    containsPlaceholderLanguage(questionText) ||
    genericTaskStem ||
    allRetrievalPlaceholder ||
    Boolean(params.contextRich && wordCount(questionText) < 6)
  );
}

function getQuestionOnlyTaskSoftIssues(params: {
  questionText: string;
  objective?: string | null;
}): string[] {
  const questionText = normalizeWhitespace(params.questionText);
  const objective = normalizeWhitespace(params.objective ?? '');
  const issues: string[] = [];
  const cue = extractApplyObjectiveCue(objective);
  const cueMismatch = Boolean(cue && questionText && !questionTextMatchesObjectiveCue(questionText, cue));

  if (cueMismatch) {
    issues.push('objective_cue_mismatch');
  }
  if (/\bfollowing the chain of causality\b/i.test(questionText)) {
    issues.push('indirect_causal_stem');
  }
  if (/\b(?:technical term for the ['"]|technical term for what is happening|loss of electrical pressure)\b/i.test(questionText)) {
    issues.push('indirect_paraphrase_target');
  }
  if (/\bexplain how\b.*\bleads to\b/i.test(questionText)) {
    issues.push('long_causal_chain');
  }

  return issues;
}

function hasWeakApplyContent(block: DynamicApplyPhaseOutput['guidedPractice'] | DynamicApplyPhaseOutput['practice']): boolean {
  return hasWeakQuestionOnlyTask({
    questionText: block.questionText,
    objective: block.objective,
    retrievalTextLines: block.retrievalTextLines,
  });
}

function rewriteTransmissionVoltageListTask(
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText).toLowerCase();
  if (!/\bthree\b|\bvoltage levels\b|\bvoltages\b/.test(normalizedQuestion)) return null;
  if (!/\btransmission\b/.test(normalizedQuestion)) return null;
  const hasVoltage = sanitizeSingleBoxGuidance(answerGuidance).some((item) => /\b\d+\s*kV\b/i.test(item));
  if (!hasVoltage) return null;
  return {
    questionText: 'State the three standard UK transmission voltages.',
    answerGuidance: ['400 kV, 275 kV, 132 kV', '400kV, 275kV, 132kV', '400 kV 275 kV 132 kV'],
  };
}

function rewriteDualTargetApplyTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  if (!/\band\b/i.test(normalizedQuestion) || normalizedGuidance.length < 2) {
    return null;
  }

  const systemType = normalizedGuidance.find((item) => /\bTT\b|\bTN-S\b|\bTN-C-S\b/i.test(item)) ?? null;
  const primaryTarget = systemType ?? normalizedGuidance[0];
  if (!primaryTarget) return null;

  if (stage === 'integrative') {
    const secondaryTarget = normalizedGuidance.find((item) => item !== primaryTarget) ?? normalizedGuidance[1];
    if (!secondaryTarget) return null;
    if (wordCount(primaryTarget) > 6 || wordCount(secondaryTarget) > 6) return null;
    const lowerQuestion = normalizedQuestion.toLowerCase();
    const efficiencyTargets = unique(
      normalizedGuidance.filter((item) => /\bhigh voltage\b|\breduces current\b|\bheat loss\b|\befficien/i.test(item))
    );
    if (
      efficiencyTargets.length > 0 ||
      /\btransmission\b|\bwind farm\b|\bpylon\b|\bpower station\b|\befficien/i.test(lowerQuestion)
    ) {
      return {
        questionText: 'Using one short explanation, explain how high-voltage transmission improves efficiency in this scenario.',
        answerGuidance: unique(
          [
            ...efficiencyTargets,
            'high voltage reduces current',
            'less energy lost as heat',
            'efficient over long distances',
          ]
            .map((item) => normalizeWhitespace(item))
            .filter(Boolean)
        ).slice(0, 4),
      };
    }
    const targetLabel = classifyTargetLabel(secondaryTarget);
    return {
      questionText: `Using one short explanation, explain why ${secondaryTarget} is the correct ${targetLabel} for this ${primaryTarget} scenario.`,
      answerGuidance: unique(
        [
          primaryTarget,
          secondaryTarget,
          /\bMET\b|\bmain earthing terminal\b/i.test(normalizedQuestion) ? 'Main Earthing Terminal (MET)' : '',
          /\bpipe\b|\bservice\b/i.test(normalizedQuestion) ? 'incoming metallic service' : '',
        ]
          .map((item) => normalizeWhitespace(item))
          .filter(Boolean)
      ).slice(0, 5),
    };
  }

  if (stage !== 'guided_practice' && stage !== 'practice') return null;

  return {
    questionText:
      stage === 'guided_practice'
        ? `Using the scenario only, identify the single best ${classifyTargetLabel(primaryTarget)}.`
        : `From the scenario, identify the specific ${classifyTargetLabel(primaryTarget)} that best fits.`,
    answerGuidance: buildSingleExpectationGuidance([primaryTarget]),
  };
}

function rewriteFaultPathTraceTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  if (stage !== 'guided_practice' && stage !== 'practice' && stage !== 'integrative') return null;
  const normalizedQuestion = normalizeWhitespace(questionText).toLowerCase();
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const hasFaultPathCue =
    /\btrace the path\b|\bfault current\b|\bname the conductor\b|\bmaster conductor\b|\breaches\b|\btravels through next\b/.test(normalizedQuestion);
  const hasChainCue =
    normalizedGuidance.some((item) => /\bCPC\b/i.test(item)) &&
    normalizedGuidance.some((item) => /\bMET\b|\bmain earthing terminal\b/i.test(item)) &&
    normalizedGuidance.some((item) => /\bearthing conductor\b/i.test(item));
  if (!hasFaultPathCue && !hasChainCue) return null;

  const systemType = normalizedGuidance.find((item) => /\bTT\b|\bTN-S\b|\bTN-C-S\b/i.test(item)) ?? null;
  const chain =
    normalizedGuidance.find((item) => /\bCPC\b.*\bMET\b.*\bearthing conductor\b/i.test(item)) ??
    'CPC to MET to Earthing Conductor';
  const finalTarget =
    normalizedGuidance.find((item) => /\bearth electrode\b|\bsupplier earth\b|\bmeans of earthing\b/i.test(item)) ??
    '';
  const arrangement = systemType ? ` in this ${systemType} system` : '';
  return {
    questionText: `State the main fault path${arrangement} in order from the appliance back to Earth.`,
    answerGuidance: buildSingleExpectationGuidance(
      [finalTarget ? `${chain} to ${finalTarget}` : chain, 'fault current path', 'protective device trips']
        .map((item) => normalizeWhitespace(item))
        .filter(Boolean)
    ),
  };
}

function rewriteCombinedSpecificationTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  if (stage !== 'guided_practice' && stage !== 'practice' && stage !== 'integrative') return null;
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const combinedSpec =
    normalizedGuidance.find((item) =>
      /\bRing Final Circuit\b.*\bTrunking\b|\bRing circuit\b.*\btrunking\b|\bRadial\b.*\bSWA\b|\bSteel Wire Armoured\b/i.test(item)
    ) ??
    (() => {
      const circuitTarget = normalizedGuidance.find((item) => /\bRing Final Circuit\b|\bRing circuit\b|\bRadial circuit\b|\bRadial\b/i.test(item));
      const enclosureTarget = normalizedGuidance.find((item) => /\bTrunking\b|\bConduit\b|\bSteel Wire Armoured\b|\bSWA\b/i.test(item));
      if (!circuitTarget || !enclosureTarget) return null;
      return `${circuitTarget} with ${enclosureTarget}`;
    })();
  if (!combinedSpec) return null;
  if (!/\bbest circuit type\b|\bbest containment system\b|\bcorrect specification\b|\busing .* cable\b/i.test(normalizedQuestion.toLowerCase())) {
    return null;
  }

  return {
    questionText: 'State the single best combined specification for this scenario.',
    answerGuidance: buildSingleExpectationGuidance([combinedSpec]),
  };
}

function rewriteConversionClassificationTask(
  stage: DynamicGuidedV2Step['stage'],
  questionText: string,
  answerGuidance: string[]
): { questionText: string; answerGuidance: string[] } | null {
  if (stage !== 'guided_practice' && stage !== 'practice' && stage !== 'integrative') return null;
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(answerGuidance);
  const voltageTarget = normalizedGuidance.find((item) => /\b\d+\s*kV\b/i.test(item)) ?? null;
  const classTarget = normalizedGuidance.find((item) => /\btransmission\b|\bdistribution\b/i.test(item)) ?? null;
  if (!voltageTarget || !classTarget) return null;
  if (!/\bconvert\b|\bstate whether\b|\bclassif/i.test(normalizedQuestion.toLowerCase())) return null;

  return {
    questionText: normalizedQuestion,
    answerGuidance: [
      `${voltageTarget}, ${classTarget}`,
      `${voltageTarget} ${classTarget}`,
      `${voltageTarget} - ${classTarget}`,
    ],
  };
}

function coerceExplanationOutput(raw: unknown, planning: DynamicPlanningPhaseOutput): DynamicExplanationPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  return {
    teachChecks: planning.teachChecks.map((planned, index) => {
      const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
        ? (teachChecksRaw[index] as Record<string, unknown>)
        : {};
      const retrievalTextLines = arrayOfStrings(item.retrievalTextLines);
      const teachingPoints = unique(arrayOfStrings(item.teachingPoints));
      const keyIdeas = unique(arrayOfStrings(item.keyIdeas));
      return {
        title: normalizeWhitespace(item.title) || planned.title,
        objective: normalizeWhitespace(item.objective) || planned.objective,
        teachingPoints: teachingPoints.length > 0 ? teachingPoints : retrievalTextLines.slice(0, 6),
        keyTerms: unique(arrayOfStrings(item.keyTerms)),
        keyIdeas: keyIdeas.length > 0 ? keyIdeas : [planned.conceptFocus, planned.whyItMatters].map((part) => normalizeWhitespace(part)).filter(Boolean),
        misconceptions: unique(arrayOfStrings(item.misconceptions)),
        retrievalTextLines,
        hint: normalizeWhitespace(item.hint) || undefined,
      };
    }),
  };
}

function coerceBasicChecksOutput(
  raw: unknown,
  planning: DynamicPlanningPhaseOutput
): DynamicBasicChecksPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  return {
    teachChecks: planning.teachChecks.map((planned, index) => {
      const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
        ? (teachChecksRaw[index] as Record<string, unknown>)
        : {};
      const basicQuestions = coerceBasicQuestions(item.basicQuestions).slice(0, 3).map((question) => ({
        questionForm: question.questionForm,
        questionText: question.questionText,
        sourceTeachingPointIds: question.sourceTeachingPointIds,
      }));
      return {
        title: normalizeWhitespace(item.title) || planned.title,
        basicQuestions,
        hint: normalizeWhitespace(item.hint) || undefined,
      };
    }),
  };
}

function inferDeeperQuestionMode(questionText: string): DynamicGuidedV2DeeperQuestionMode {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (!normalized) return 'synthesis';
  if (/\bif\b|\bwhat would happen\b|\bwould happen\b|\bimagine\b|\bsuppose\b|\bpredict\b/.test(normalized)) {
    return 'hypothesis';
  }
  if (/\bdiffer\b|\bdifference\b|\bcompare\b|\bcompared\b|\baffect\b|\binfluence\b|\brelationship\b|\blink\b|\blead to\b|\breduce\b|\bincrease\b|\bcause\b/.test(normalized)) {
    return 'connection';
  }
  return 'synthesis';
}

function coerceDeeperQuestionMode(
  raw: unknown,
  questionText: string
): DynamicGuidedV2DeeperQuestionMode {
  if (raw === 'connection' || raw === 'synthesis' || raw === 'hypothesis') {
    return raw;
  }
  return inferDeeperQuestionMode(questionText);
}

function coerceDeeperChecksOutput(
  raw: unknown,
  planning: DynamicPlanningPhaseOutput
): DynamicDeeperChecksPhaseOutput {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teachChecksRaw = Array.isArray(data.teachChecks) ? data.teachChecks : [];
  return {
    teachChecks: planning.teachChecks.map((planned, index) => {
      const item = teachChecksRaw[index] && typeof teachChecksRaw[index] === 'object'
        ? (teachChecksRaw[index] as Record<string, unknown>)
        : {};
      return {
        title: normalizeWhitespace(item.title) || planned.title,
        deeperQuestionText: normalizeWhitespace(item.deeperQuestionText),
        deeperQuestionMode: coerceDeeperQuestionMode(item.deeperQuestionMode, normalizeWhitespace(item.deeperQuestionText)),
        deeperSourceTeachingPointIds: coerceTeachingPointIds(item.deeperSourceTeachingPointIds),
        hint: normalizeWhitespace(item.hint) || undefined,
      };
    }),
  };
}

function mergeBasicAndDeeperChecks(
  planning: DynamicPlanningPhaseOutput,
  basicChecks: DynamicBasicChecksPhaseOutput,
  deeperChecks: DynamicDeeperChecksPhaseOutput
): DynamicUnderstandingChecksPhaseOutput {
  return {
    teachChecks: planning.teachChecks.map((planned, index) => ({
      title: normalizeWhitespace(basicChecks.teachChecks[index]?.title)
        || normalizeWhitespace(deeperChecks.teachChecks[index]?.title)
        || planned.title,
      basicQuestions: basicChecks.teachChecks[index]?.basicQuestions ?? [],
      deeperQuestionText: normalizeWhitespace(deeperChecks.teachChecks[index]?.deeperQuestionText),
      deeperQuestionMode: deeperChecks.teachChecks[index]?.deeperQuestionMode,
      deeperSourceTeachingPointIds: deeperChecks.teachChecks[index]?.deeperSourceTeachingPointIds,
      hint: normalizeWhitespace(deeperChecks.teachChecks[index]?.hint)
        || normalizeWhitespace(basicChecks.teachChecks[index]?.hint)
        || undefined,
    })),
  };
}

function buildChunkCoverageText(
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined,
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined
): string {
  return normalizeWhitespace([
    planningChunk?.title,
    planningChunk?.objective,
    planningChunk?.conceptFocus,
    planningChunk?.whyItMatters,
    explanation?.title,
    explanation?.objective,
    ...(explanation?.keyTerms ?? []),
    ...(explanation?.keyIdeas ?? []),
    ...buildAuthoredExplanationLines(explanation),
  ].filter(Boolean).join(' '));
}

function coverageMentionsTarget(coverageText: string, target: string): boolean {
  const normalizedCoverage = normalizeWhitespace(coverageText).toLowerCase();
  const normalizedTarget = normalizeWhitespace(target).toLowerCase();
  if (!normalizedTarget) return true;
  if (normalizedCoverage.includes(normalizedTarget)) return true;
  return extractNamedEntities(coverageText).some((entity) => compactTechnicalToken(entity) === compactTechnicalToken(target));
}

function inferBasicQuestionTarget(
  question: DynamicAuthoredBasicCheck,
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined
): string | null {
  return (
    inferSpecificTechnicalAnswer(question.questionText) ||
    inferCodeLetterMeaning(question.questionText) ||
    inferComponentMeaning(question.questionText) ||
    (/legal status/i.test(question.questionText) && /\bstatutory\b|\bnon-statutory\b/i.test(planningChunk?.objective ?? '')
      ? 'Statutory'
      : null)
  );
}

function basicQuestionLooksAmbiguous(
  question: DynamicAuthoredBasicCheck,
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined,
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined
): boolean {
  const normalizedQuestion = normalizeWhitespace(question.questionText).toLowerCase();
  const genericStem =
    /\bwhat is increasing\b|\bwhat is changing\b|\bwhat(?: is)? (?:the )?(?:physical|material|inherent) property\b|\bwhich (?:physical|material|inherent) property\b/.test(normalizedQuestion);
  if (!genericStem) return false;

  const expectedTarget = inferBasicQuestionTarget(question, planningChunk);
  if (expectedTarget && normalizedQuestion.includes(expectedTarget.toLowerCase())) return false;

  const coverageText = buildChunkCoverageText(planningChunk, explanation).toLowerCase();
  const competingTerms = ['resistance', 'resistivity', 'length', 'voltage', 'voltage drop', 'current', 'power', 'energy']
    .filter((term) => coverageText.includes(term));
  return competingTerms.length >= 2;
}

function basicQuestionDriftsFromChunk(
  question: DynamicAuthoredBasicCheck,
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined,
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined
): boolean {
  const coverageText = buildChunkCoverageText(planningChunk, explanation);
  const expectedTarget = inferBasicQuestionTarget(question, planningChunk);
  if (expectedTarget) {
    return !coverageMentionsTarget(coverageText, expectedTarget);
  }

  const acronym = extractNamedEntities(question.questionText).find((entity) => /^[A-Z0-9-]{2,}$/i.test(entity));
  if (acronym && !coverageMentionsTarget(coverageText, acronym)) {
    return true;
  }

  return false;
}

function validateBasicChecksPhaseOutput(
  parsed: DynamicBasicChecksPhaseOutput,
  planning: DynamicPlanningPhaseOutput,
  explanations: DynamicExplanationPhaseOutput
): string[] {
  const issues: string[] = [];
  if (parsed.teachChecks.length !== planning.teachChecks.length) {
    issues.push('Teach/check count does not match the locked plan.');
  }
  parsed.teachChecks.forEach((check, index) => {
    if ((check.basicQuestions ?? []).length !== 3) {
      issues.push(`Teach/check ${index + 1} does not contain exactly 3 basic questions.`);
    }
    if ((check.basicQuestions ?? []).some((question) => !normalizeWhitespace(question.questionForm))) {
      issues.push(`Teach/check ${index + 1} is missing a question form for one or more basic questions.`);
    }

    const plannedObjective = normalizeWhitespace(planning.teachChecks[index]?.objective);
    const planningChunk = planning.teachChecks[index];
    const explanation = explanations.teachChecks[index];
    const questionTexts = (check.basicQuestions ?? []).map((question) => normalizeWhitespace(question.questionText));

    if (/\blegal status\b|\bstatutory\b|\bnon-statutory\b/i.test(plannedObjective)) {
      const statusQuestionPresent = questionTexts.some((text) => /\blegal status\b|\bstatutory\b|\bnon-statutory\b/i.test(text));
      if (!statusQuestionPresent) {
        issues.push(`Teach/check ${index + 1} is not aligned to the legal-status objective.`);
      }
    }

    if (/\bstands?\s+for\b|\babbreviation\b|\bacronym\b/i.test(plannedObjective)) {
      const expansionQuestionPresent = questionTexts.some((text) => /\bwhat does\b.+\bstand for\b/i.test(text));
      if (!expansionQuestionPresent) {
        issues.push(`Teach/check ${index + 1} is not aligned to the abbreviation-expansion objective.`);
      }
    }

    (check.basicQuestions ?? []).forEach((question, questionIndex) => {
      if (basicQuestionLooksAmbiguous(question, planningChunk, explanation)) {
        issues.push(`Teach/check ${index + 1} question ${questionIndex + 1} is ambiguous.`);
      }
      if (basicQuestionDriftsFromChunk(question, planningChunk, explanation)) {
        issues.push(`Teach/check ${index + 1} question ${questionIndex + 1} is not answerable from the taught chunk.`);
      }
    });
  });
  return issues;
}

function isRepairableBasicChecksValidationIssue(issue: string): boolean {
  return /is not answerable from the taught chunk\.$/i.test(normalizeWhitespace(issue));
}

function validateDeeperChecksPhaseOutput(
  parsed: DynamicDeeperChecksPhaseOutput,
  planning: DynamicPlanningPhaseOutput,
  options?: { allowMissing?: boolean }
): string[] {
  const issues: string[] = [];
  if (parsed.teachChecks.length !== planning.teachChecks.length) {
    issues.push('Teach/check count does not match the locked plan.');
  }
  parsed.teachChecks.forEach((check, index) => {
    if (!options?.allowMissing && !normalizeWhitespace(check.deeperQuestionText)) {
      issues.push(`Teach/check ${index + 1} is missing a deeper question.`);
    }
  });
  return issues;
}

function stripLeadingPedagogyVerb(text: string | undefined): string {
  return normalizeWhitespace(text)
    .replace(/^(?:identify|explain|describe|state|name|compare|outline|recognise|recognize|give|show)\s+/i, '')
    .replace(/\.$/, '');
}

function buildFallbackDeeperQuestion(
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined,
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined,
  index: number
): string {
  const focus = stripLeadingPedagogyVerb(explanation?.title || planningChunk?.title || planningChunk?.conceptFocus || 'this idea');

  return index % 2 === 0
    ? `Why is ${focus} important in this lesson?`
    : `How would you explain the importance of ${focus}?`;
}

function backfillMissingDeeperChecks(
  parsed: DynamicDeeperChecksPhaseOutput,
  planning: DynamicPlanningPhaseOutput,
  explanations: DynamicExplanationPhaseOutput
): DynamicDeeperChecksPhaseOutput {
  return {
    teachChecks: planning.teachChecks.map((plannedChunk, index) => {
      const current = parsed.teachChecks[index];
      const deeperQuestionText = normalizeWhitespace(current?.deeperQuestionText)
        || buildFallbackDeeperQuestion(plannedChunk, explanations.teachChecks[index], index);
      return {
        title: normalizeWhitespace(current?.title) || plannedChunk.title,
        deeperQuestionText,
        deeperQuestionMode: current?.deeperQuestionMode ?? inferDeeperQuestionMode(deeperQuestionText),
        deeperSourceTeachingPointIds: current?.deeperSourceTeachingPointIds,
        hint: normalizeWhitespace(current?.hint) || undefined,
      };
    }),
  };
}

function validateExplanationPhaseOutput(
  parsed: DynamicExplanationPhaseOutput,
  planning: DynamicPlanningPhaseOutput
): string[] {
  const issues: string[] = [];
  if (parsed.teachChecks.length !== planning.teachChecks.length) {
    issues.push('Explanation chunk count does not match the locked plan.');
  }
  parsed.teachChecks.forEach((check, index) => {
    const title = normalizeWhitespace(check.title);
    const objective = normalizeWhitespace(check.objective);
    const teachingPoints = (check.teachingPoints ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
    const retrievalLines = (check.retrievalTextLines ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
    if (!title || containsPlaceholderLanguage(title)) {
      issues.push(`Explanation chunk ${index + 1} has a placeholder title.`);
    }
    if (!objective || containsPlaceholderLanguage(objective)) {
      issues.push(`Explanation chunk ${index + 1} has a placeholder objective.`);
    }
    if (teachingPoints.length < 3 || teachingPoints.some((item) => containsPlaceholderLanguage(item))) {
      issues.push(`Explanation chunk ${index + 1} has weak or placeholder teaching points.`);
    }
    if (retrievalLines.length === 0 || retrievalLines.some((item) => containsPlaceholderLanguage(item))) {
      issues.push(`Explanation chunk ${index + 1} has placeholder retrieval text.`);
    }
  });
  return issues;
}

function validateSpacedReviewCoverage(
  parsed: DynamicSpacedReviewPhaseOutput,
  grounding: DynamicSpacedReviewGroundingPacket
): string[] {
  const issues: string[] = [];
  const expectedLos = grounding.loGroups.map((group) => group.sourceLo);
  const actualLos = unique((parsed.questions ?? []).map((question) => normalizeWhitespace(question.sourceLo).toUpperCase()).filter(Boolean));

  if (actualLos.some((sourceLo) => !expectedLos.includes(sourceLo))) {
    issues.push('Spaced review includes questions from an unexpected LO.');
  }

  const expectedCounts = new Map<string, number>();
  const loCount = Math.max(grounding.loGroups.length, 1);
  const baseCount = Math.floor(8 / loCount);
  let remainder = 8 % loCount;
  grounding.loGroups.forEach((group) => {
    expectedCounts.set(group.sourceLo, baseCount + (remainder > 0 ? 1 : 0));
    if (remainder > 0) remainder -= 1;
  });

  const actualCounts = new Map<string, number>();
  for (const question of parsed.questions ?? []) {
    const sourceLo = normalizeWhitespace(question.sourceLo).toUpperCase();
    actualCounts.set(sourceLo, (actualCounts.get(sourceLo) ?? 0) + 1);
  }

  for (const [sourceLo, expectedCount] of expectedCounts.entries()) {
    if ((actualCounts.get(sourceLo) ?? 0) !== expectedCount) {
      issues.push(`Spaced review does not distribute questions evenly for ${sourceLo}.`);
    }
  }

  return issues;
}

function mergeUnderstandingChecks(
  original: DynamicUnderstandingChecksPhaseOutput,
  repaired: DynamicUnderstandingChecksPhaseOutput
): DynamicUnderstandingChecksPhaseOutput {
  return {
    teachChecks: original.teachChecks.map((originalCheck, index) => {
      const repairedCheck = repaired.teachChecks[index];
      if (!repairedCheck) return originalCheck;

      const repairedBasicQuestions = repairedCheck.basicQuestions ?? [];
      const hasValidRepairedBasics =
        repairedBasicQuestions.length === 3 &&
        repairedBasicQuestions.every(
          (question) =>
            normalizeWhitespace(question.questionText).length > 0 &&
            normalizeWhitespace(question.questionForm).length > 0
        );

      return {
        ...originalCheck,
        title: normalizeWhitespace(repairedCheck.title) || originalCheck.title,
        basicQuestions: hasValidRepairedBasics ? repairedBasicQuestions : originalCheck.basicQuestions,
        deeperQuestionText: normalizeWhitespace(repairedCheck.deeperQuestionText) || originalCheck.deeperQuestionText,
        deeperQuestionMode:
          repairedCheck.deeperQuestionMode ?? originalCheck.deeperQuestionMode ?? inferDeeperQuestionMode(
            normalizeWhitespace(repairedCheck.deeperQuestionText) || originalCheck.deeperQuestionText
          ),
        deeperSourceTeachingPointIds:
          (repairedCheck.deeperSourceTeachingPointIds ?? []).length > 0
            ? repairedCheck.deeperSourceTeachingPointIds
            : originalCheck.deeperSourceTeachingPointIds,
        hint: normalizeWhitespace(repairedCheck.hint) || originalCheck.hint,
      };
    }),
  };
}

function ensureApplyOutput(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  workedExample: DynamicWorkedExamplePhaseOutput,
  applyOutput: DynamicApplyPhaseOutput
): DynamicApplyPhaseOutput {
  const workedExampleText = joinLines(workedExample.retrievalTextLines);
  const namedTargets = unique([
    ...extractNamedEntities(workedExampleText),
    ...(workedExampleText.match(/\b\d+\s*kV\b/g) ?? []).map((item) => normalizeWhitespace(item)),
    ...planning.inScope
      .flatMap((item) => extractNamedEntities(item))
      .map((item) => normalizeWhitespace(item)),
  ]).filter(Boolean);

  const primaryNamedTarget = namedTargets[0] ?? normalizeWhitespace(planning.inScope[0]) ?? input.topic;
  const secondTarget = namedTargets[1] ?? primaryNamedTarget;
  const practiceTargetIsVoltage = /\b\d+\s*kV\b/i.test(secondTarget);
  const transmissionLesson = /transmission voltages|electricity generation and transmission/i.test(`${input.title} ${input.topic}`);
  const workedExampleScenario = extractConcreteScenarioLine(workedExample.retrievalTextLines) ?? 'Consider one concrete scenario based on the worked example.';
  const measuringInstrumentLesson =
    /measuring electrical quantities|appropriate instruments/i.test(`${input.title} ${input.topic} ${planning.lessonAim}`) ||
    planning.inScope.some((item) => /\bammeter\b|\bvoltmeter\b|\bohmmeter\b|\bwattmeter\b|\benergy meter\b|\bkwh meter\b/i.test(item));
  const weakGuidedPractice = hasWeakApplyContent(applyOutput.guidedPractice);
  const weakPractice = hasWeakApplyContent(applyOutput.practice);

  let guidedPractice =
    !weakGuidedPractice && normalizeWhitespace(applyOutput.guidedPractice.questionText)
      ? applyOutput.guidedPractice
      : {
          ...applyOutput.guidedPractice,
          title: applyOutput.guidedPractice.title || 'Guided Practice',
          objective: applyOutput.guidedPractice.objective || planning.guidedPracticeObjective,
          retrievalTextLines:
            !weakGuidedPractice && applyOutput.guidedPractice.retrievalTextLines.length > 0
              ? applyOutput.guidedPractice.retrievalTextLines
              : [
                  transmissionLesson
                    ? 'Scenario: A new overhead line is labelled 275,000 Volts and is carrying power over a long distance to a city.'
                    : measuringInstrumentLesson
                      ? 'Scenario: A technician needs to confirm the supply voltage at a heater before carrying out any further checks.'
                    : `Scenario: ${workedExampleScenario}`,
                  workedExampleText ? workedExampleText.split('\n').find((line) => /^Takeaway\b/i.test(line)) ?? workedExampleText.split('\n')[0] : '',
                ].map((line) => normalizeWhitespace(line)).filter(Boolean),
          questionText: transmissionLesson
            ? 'Convert 275,000 Volts to kV and state whether this is a Transmission or Distribution voltage.'
            : measuringInstrumentLesson
              ? 'From the scenario, identify the specific instrument used to check the supply voltage.'
            : buildQuestionOnlyApplyQuestion({
                stage: 'guided_practice',
                objective: applyOutput.guidedPractice.objective || planning.guidedPracticeObjective,
                retrievalTextLines: [
                  ...(
                    !weakGuidedPractice && applyOutput.guidedPractice.retrievalTextLines.length > 0
                      ? applyOutput.guidedPractice.retrievalTextLines
                      : [
                          transmissionLesson
                            ? 'Scenario: A new overhead line is labelled 275,000 Volts and is carrying power over a long distance to a city.'
                            : measuringInstrumentLesson
                              ? 'Scenario: A technician needs to confirm the supply voltage at a heater before carrying out any further checks.'
                              : `Scenario: ${workedExampleScenario}`,
                          workedExampleText ? workedExampleText.split('\n').find((line) => /^Takeaway\b/i.test(line)) ?? workedExampleText.split('\n')[0] : '',
                        ]
                  ),
                ].map((line) => normalizeWhitespace(line)).filter(Boolean),
                planning,
                input,
              }),
          hint: applyOutput.guidedPractice.hint,
        };

  if (transmissionLesson) {
    guidedPractice = {
      ...guidedPractice,
      objective: 'Identify one specific generation method from a concrete scenario.',
      retrievalTextLines: [
        'Scenario: A rooftop solar installation uses panels that convert sunlight directly into electricity and export surplus power back to the grid.',
        'Identify the generation method described in that scenario.',
      ],
      questionText: 'From the scenario, identify the specific generation method.',
      hint: 'Look for the method that converts sunlight directly into electricity.',
    };
  }
  if (measuringInstrumentLesson) {
    guidedPractice = {
      ...guidedPractice,
      objective: 'Identify the correct instrument for a live voltage check in one concrete site case.',
      retrievalTextLines: [
        'Scenario: A technician needs to confirm the supply voltage at a heater before carrying out any further checks.',
        'Name the instrument used to measure the electrical pressure at the terminals.',
      ],
      questionText: 'From the scenario, identify the specific instrument used to check the supply voltage.',
      hint: 'Voltage is electrical pressure, so use the instrument named after volts.',
    };
  }

  let practice =
    !weakPractice && normalizeWhitespace(applyOutput.practice.questionText)
      ? applyOutput.practice
      : {
          ...applyOutput.practice,
          title: applyOutput.practice.title || 'Practice',
          objective: applyOutput.practice.objective || planning.practiceObjective,
          retrievalTextLines:
            !weakPractice && applyOutput.practice.retrievalTextLines.length > 0
              ? applyOutput.practice.retrievalTextLines
              : [
                  `Scenario: ${workedExampleScenario}`,
                  measuringInstrumentLesson
                    ? 'Scenario: The heater is isolated and the engineer now needs to check the element resistance safely.'
                    : planning.practiceObjective || planning.guidedPracticeObjective || input.topic,
                ].map((line) => normalizeWhitespace(line)).filter(Boolean),
          questionText: practiceTargetIsVoltage
            ? 'State the lowest standard UK transmission voltage.'
            : measuringInstrumentLesson
              ? 'The heater is isolated and the element must be checked for resistance. Which specific instrument should be used?'
              : buildQuestionOnlyApplyQuestion({
                  stage: 'practice',
                  objective: applyOutput.practice.objective || planning.practiceObjective || planning.guidedPracticeObjective,
                  retrievalTextLines: [
                    ...(
                      !weakPractice && applyOutput.practice.retrievalTextLines.length > 0
                        ? applyOutput.practice.retrievalTextLines
                        : [
                            `Scenario: ${workedExampleScenario}`,
                            measuringInstrumentLesson
                              ? 'Scenario: The heater is isolated and the engineer now needs to check the element resistance safely.'
                              : planning.practiceObjective || planning.guidedPracticeObjective || input.topic,
                          ]
                    ),
                  ].map((line) => normalizeWhitespace(line)).filter(Boolean),
                  planning,
                  input,
                }),
          hint: applyOutput.practice.hint,
        };

  if (transmissionLesson) {
    practice = {
      ...practice,
      objective: 'State one valid UK transmission voltage used for long-distance power transfer.',
      questionText: 'State one valid UK transmission voltage.',
      hint: 'Any one of the three UK transmission voltages is valid here.',
    };
  }
  if (measuringInstrumentLesson) {
    practice = {
      ...practice,
      objective: 'Identify the correct instrument for an isolated resistance check.',
      retrievalTextLines: [
        'Scenario: A technician is testing a disconnected heating element to see if the internal wire is broken by checking its opposition to current flow.',
        'Identify the specific instrument required for this test.',
      ],
      questionText: 'The heater is isolated and the element must be checked for resistance. Which specific instrument should be used?',
      hint: 'Resistance is measured in ohms, so use the instrument named after ohms.',
    };
  }

  return {
    guidedPractice,
    practice,
  };
}

function ensureIntegrationOutput(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  workedExample: DynamicWorkedExamplePhaseOutput,
  integration: DynamicIntegrationPhaseOutput
): DynamicIntegrationPhaseOutput {
  const integrative = integration.integrative;

  const workedExampleText = joinLines(workedExample.retrievalTextLines);
  const transmissionLesson = /transmission voltages|electricity generation and transmission/i.test(`${input.title} ${input.topic}`);
  const earthingLesson = /earthing systems|ads components/i.test(`${input.title} ${input.topic}`);
  const measuringInstrumentLesson =
    /measuring electrical quantities|appropriate instruments/i.test(`${input.title} ${input.topic} ${planning.lessonAim}`) ||
    planning.inScope.some((item) => /\bammeter\b|\bvoltmeter\b|\bohmmeter\b|\bwattmeter\b|\benergy meter\b|\bkwh meter\b/i.test(item));

  if (transmissionLesson) {
    return {
      integrative: {
        title: integrative.title || 'Integrative Close',
        objective: 'Explain how a named generation method links to the high-voltage transmission stage.',
        retrievalTextLines: [
          'Generation is the start of the supply chain, and transmission is the high-voltage stage used to move bulk power efficiently over long distances.',
          'In the UK, the standard transmission voltages are 400 kV, 275 kV, and 132 kV because high voltage reduces energy loss during transport.',
        ],
        questionText:
          'A new offshore wind farm is sending electricity across the country. Using one short explanation, identify the generation method and explain why the power is transmitted at very high voltage.',
        hint: 'Name the generation method first, then explain the transmission reason in simple electrical terms.',
      },
    };
  }

  if (normalizeWhitespace(integrative.questionText) && integrative.retrievalTextLines.length > 0) {
    return integration;
  }

  if (earthingLesson) {
    return {
      integrative: {
        title: integrative.title || 'Integrative Close',
        objective: integrative.objective || planning.integrativeObjective,
        retrievalTextLines: [
          'The earthing system tells you how the installation connects back to the source or ground.',
          'ADS also requires the correct named conductors and devices so faults are cleared safely.',
        ],
        questionText:
          'A modern installation has neutral and earth combined in the supplier cable but separated at the intake. Identify the earthing system type.',
        hint: integrative.hint,
      },
    };
  }

  if (measuringInstrumentLesson) {
    return {
      integrative: {
        title: integrative.title || 'Integrative Close',
        objective:
          'Distinguish between measuring instantaneous power and total energy consumption in one practical site case.',
        retrievalTextLines: [
          'Scenario: A customer says an electric heater is expensive to run over a full day.',
          'A Wattmeter measures the right-now power demand, but an Energy Meter (kWh meter) measures the total energy used over time.',
        ],
        questionText:
          'Explain why an Energy Meter, not a Wattmeter, is the correct tool for measuring a heater\'s total electricity use over 24 hours.',
        hint: 'Match resistance to Ohmmeter, total daily consumption to Energy Meter, and remember that a Wattmeter only shows right-now power.',
      },
    };
  }

  return {
    integrative: {
      title: integrative.title || 'Integrative Close',
      objective: integrative.objective || planning.integrativeObjective,
      retrievalTextLines:
        integrative.retrievalTextLines.length > 0
          ? integrative.retrievalTextLines
          : [
              'Bring the lesson ideas together in one applied case.',
              workedExampleText ? workedExampleText.split('\n').find((line) => /^Takeaway\b/i.test(line)) ?? workedExampleText.split('\n')[0] : input.topic,
            ].map((line) => normalizeWhitespace(line)).filter(Boolean),
      questionText:
        normalizeWhitespace(integrative.questionText) || `Using the scenario only, identify the single best ${classifyTargetLabel(planning.inScope[0] ?? input.topic)}.`,
      hint: integrative.hint,
    },
  };
}

function isRepairablePointer(pointer: string): boolean {
  return (
    /^\/steps\/\d+\/questionText$/.test(pointer) ||
    /^\/steps\/\d+\/retrievalText$/.test(pointer) ||
    /^\/steps\/\d+\/objective$/.test(pointer) ||
    /^\/steps\/\d+\/hint$/.test(pointer) ||
    /^\/steps\/\d+\/deeperQuestionText$/.test(pointer) ||
    /^\/steps\/\d+\/basicQuestions\/\d+\/questionText$/.test(pointer) ||
    /^\/steps\/\d+\/anchorFacts\/\d+$/.test(pointer) ||
    /^\/steps\/\d+\/keyIdeas\/\d+$/.test(pointer) ||
    /^\/steps\/\d+\/keyTerms\/\d+$/.test(pointer)
  );
}

function parseJsonPointer(pointer: string): string[] {
  return pointer
    .split('/')
    .slice(1)
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function readJsonPointerValue(root: unknown, pointer: string): unknown {
  const segments = parseJsonPointer(pointer);
  let current: unknown = root;
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) return undefined;
      current = current[index];
      continue;
    }
    if (!current || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function writeJsonPointerValue(root: unknown, pointer: string, value: unknown): boolean {
  const segments = parseJsonPointer(pointer);
  if (segments.length === 0) return false;
  let current: unknown = root;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (Array.isArray(current)) {
      const arrayIndex = Number(segment);
      if (!Number.isInteger(arrayIndex) || arrayIndex < 0 || arrayIndex >= current.length) return false;
      current = current[arrayIndex];
      continue;
    }
    if (!current || typeof current !== 'object') return false;
    current = (current as Record<string, unknown>)[segment];
  }

  const lastSegment = segments[segments.length - 1];
  if (Array.isArray(current)) {
    const arrayIndex = Number(lastSegment);
    if (!Number.isInteger(arrayIndex) || arrayIndex < 0 || arrayIndex >= current.length) return false;
    current[arrayIndex] = value;
    return true;
  }
  if (!current || typeof current !== 'object') return false;
  (current as Record<string, unknown>)[lastSegment] = value;
  return true;
}

function serializeRepairCurrentValue(value: unknown): string {
  if (typeof value === 'string') return normalizeWhitespace(value);
  if (value == null) return '';
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function extractQuotedRepairTerms(text: string): string[] {
  const matches = [
    ...text.matchAll(/`([^`]{2,80})`/g),
    ...text.matchAll(/'([^']{2,80})'/g),
    ...text.matchAll(/"([^"]{2,80})"/g),
  ];
  return unique(matches.map((match) => trimRepairTerm(match[1] ?? '')).filter(Boolean));
}

function trimRepairTerm(text: string): string {
  let normalized = normalizeWhitespace(text).replace(/^[`'"]+/, '').replace(/[`'"]+$/, '');
  normalized = normalized.replace(/^(?:a|an|the)\s+(?=[`'"]?[A-Z0-9])/i, '');
  normalized = normalized.replace(/^[`'"]+/, '').replace(/[`'"]+$/, '');
  return normalized;
}

function buildRepairSourceEvidence(
  lesson: DynamicGuidedV2Lesson,
  pointer: string,
  input?: DynamicLessonGenerationInput
): string[] {
  const stepMatch = pointer.match(/^\/steps\/(\d+)\//);
  const step = stepMatch ? lesson.steps[Number(stepMatch[1])] : null;
  const lessonEvidence = step
    ? [
        normalizeWhitespace(step.objective),
        normalizeWhitespace(step.retrievalText),
        ...(step.keyIdeas ?? []).map((item) => normalizeWhitespace(item)),
        ...(step.anchorFacts ?? []).map((item) => normalizeWhitespace(item)),
        ...(step.keyTerms ?? []).map((item) => normalizeWhitespace(item)),
      ]
    : [];
  const sourceEvidence = (input?.sourceText ?? '')
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter((line) => line && wordCount(line) >= 4)
    .slice(0, 6);
  return unique([...lessonEvidence, ...sourceEvidence]).slice(0, 10);
}

function inferRepairFieldType(pointer: string): DynamicFixPlan['fixes'][number]['fieldType'] {
  if (/\/basicQuestions\/\d+\/questionText$/.test(pointer)) return 'basic_question';
  if (/\/deeperQuestionText$/.test(pointer)) return 'deeper_question';
  if (/\/anchorFacts\/\d+$/.test(pointer)) return 'anchor_fact';
  if (/\/keyIdeas\/\d+$/.test(pointer)) return 'key_idea';
  if (/\/keyTerms\/\d+$/.test(pointer)) return 'key_term';
  return 'teaching_text';
}

function extractRepairTerms(text: string | undefined): string[] {
  const normalized = normalizeWhitespace(text ?? '');
  if (!normalized) return [];
  const quoted = extractQuotedRepairTerms(normalized);
  const capped = normalized.match(/\b(?:[A-Z]{2,}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) ?? [];
  const filtered = [...quoted, ...capped]
    .map((term) => normalizeWhitespace(term))
    .filter((term) => term.length > 1)
    .filter((term) => !/^(?:The|This|That|These|Those|Large|Scale|Phase|Chunk|Question|Lesson)$/i.test(term));
  return unique(filtered);
}

function tokenizeEvidenceTerms(lines: string[]): string[] {
  return unique(
    lines
      .flatMap((line) => extractRepairTerms(line))
      .filter(Boolean)
  );
}

function buildRepairPacketContext(params: {
  lesson: DynamicGuidedV2Lesson;
  pointer: string;
  problem: string;
  currentValue: string;
  input?: DynamicLessonGenerationInput;
  solution?: string;
  badSpan?: string;
  replacementTarget?: string;
}): Pick<
  DynamicFixPlan['fixes'][number],
  'fieldType' | 'whyCurrentValueFails' | 'mustPreserve' | 'requiredFix' | 'allowedTerms' | 'forbiddenTerms' | 'replacementText'
> {
  const fieldType = inferRepairFieldType(params.pointer);
  const stepMatch = params.pointer.match(/^\/steps\/(\d+)\//);
  const step = stepMatch ? params.lesson.steps[Number(stepMatch[1])] : null;
  const allowedEvidence = step
    ? [
        normalizeWhitespace(step.objective),
        normalizeWhitespace(step.retrievalText),
        ...(step.keyTerms ?? []).map((item) => normalizeWhitespace(item)),
        ...(step.keyIdeas ?? []).map((item) => normalizeWhitespace(item)),
        ...(step.anchorFacts ?? []).map((item) => normalizeWhitespace(item)),
      ].filter(Boolean)
    : [];
  const allowedTerms = tokenizeEvidenceTerms(allowedEvidence).slice(0, 12);
  const problemTerms = extractRepairTerms(params.problem);
  const forbiddenTerms = unique(
    problemTerms.filter(
      (term) =>
        !allowedTerms.some((allowed) => allowed.toLowerCase() === term.toLowerCase())
    )
  ).slice(0, 8);

  const mustPreserve =
    normalizeWhitespace(step?.objective) ||
    allowedTerms.slice(0, 3).join(', ') ||
    'Keep the patched field aligned to the current chunk objective.';
  const normalizedSolution = normalizeWhitespace(params.solution);
  const quotedReplacement = extractQuotedSentenceFromRepairText(normalizedSolution);
  const requiredFix = params.replacementTarget && params.badSpan
    ? quotedReplacement ?? `Remove ${params.badSpan} and use ${params.replacementTarget}.`
    : normalizedSolution
      ? normalizedSolution
    : forbiddenTerms.length > 0
      ? `Do not use these untaught terms: ${forbiddenTerms.join(', ')}. Use only taught terms from this chunk.`
      : normalizeWhitespace(params.problem);

  return {
    fieldType,
    whyCurrentValueFails: normalizeWhitespace(params.problem),
    mustPreserve,
    requiredFix,
    allowedTerms,
    forbiddenTerms,
    replacementText: quotedReplacement ?? undefined,
  };
}

function inferSemanticReplacement(text: string): { badSpan?: string; replacementTarget?: string } {
  const problem = normalizeWhitespace(text);
  const quotedTerms = extractQuotedRepairTerms(problem);

  const theoremPattern = problem.match(/incorrectly identifies [`'"]?(.+?)[`'"]? .*?the theorem is (.+?)(?:[.;]|$)/i);
  if (theoremPattern) {
    return {
      badSpan: trimRepairTerm(theoremPattern[1] ?? ''),
      replacementTarget: trimRepairTerm(theoremPattern[2] ?? ''),
    };
  }

  const contradictionPattern = problem.match(
    /[`'"]?(.+?)[`'"]?.*?contradict(?:s|ing) the earlier mention of (?:a|an|the )?([A-Za-z][A-Za-z0-9\- '\u2019]+?)(?:[.;]|$)/i
  );
  if (contradictionPattern) {
    return {
      badSpan: trimRepairTerm(contradictionPattern[1] ?? ''),
      replacementTarget: trimRepairTerm(contradictionPattern[2] ?? ''),
    };
  }

  const correctThingPattern = problem.match(/names [`'"]?(.+?)[`'"]? where the correct .*?\b(?:is|as)\b (.+?)(?:[.;]|$)/i);
  if (correctThingPattern) {
    return {
      badSpan: trimRepairTerm(correctThingPattern[1] ?? ''),
      replacementTarget: trimRepairTerm(correctThingPattern[2] ?? ''),
    };
  }

  const earlierMentionPattern = problem.match(/[`'"](.+?)[`'"].*?earlier mention of (?:a|an|the )?[`'"](.+?)[`'"]/i);
  if (earlierMentionPattern) {
    return {
      badSpan: trimRepairTerm(earlierMentionPattern[1] ?? ''),
      replacementTarget: trimRepairTerm(earlierMentionPattern[2] ?? ''),
    };
  }

  const directPattern =
    problem.match(/incorrectly identifies [`'"]?(.+?)[`'"]? .*?\b(?:theorem|term|device|method|system|conductor|instrument|status|quantity)\b.*?\b(?:is|as)\b [`'"]?(.+?)[`'"]?(?:[.;]|$)/i) ??
    problem.match(/names [`'"]?(.+?)[`'"]? where the correct .*?\b(?:is|as)\b [`'"]?(.+?)[`'"]?(?:[.;]|$)/i) ??
    problem.match(/[`'"](.+?)[`'"].*?\b(?:instead of|rather than)\b [`'"](.+?)[`'"]/i);

  if (directPattern) {
    return {
      badSpan: trimRepairTerm(directPattern[1] ?? ''),
      replacementTarget: trimRepairTerm(directPattern[2] ?? ''),
    };
  }

  if (
    quotedTerms.length >= 2 &&
    /\b(?:instead of|rather than|where the correct|the theorem is|the correct device is|the correct term is|earlier mention of|contradicting)\b/i.test(problem)
  ) {
    return { badSpan: quotedTerms[0], replacementTarget: quotedTerms[quotedTerms.length - 1] };
  }

  return {};
}

function inferSemanticReplacementFromTexts(problem: string, solution?: string): { badSpan?: string; replacementTarget?: string } {
  const fromProblem = inferSemanticReplacement(problem);
  if (fromProblem.badSpan && fromProblem.replacementTarget) {
    return fromProblem;
  }

  const normalizedSolution = normalizeWhitespace(solution);
  if (!normalizedSolution) {
    return fromProblem;
  }

  const quotedTerms = extractQuotedRepairTerms(normalizedSolution);
  if (quotedTerms.length >= 2) {
    return {
      badSpan: quotedTerms[0],
      replacementTarget: quotedTerms[quotedTerms.length - 1],
    };
  }

  const replacePattern =
    normalizedSolution.match(/replace [`'"]([^`'"]+)[`'"] with [`'"]([^`'"]+)[`'"](?:[.;]|$)/i) ??
    normalizedSolution.match(/change [`'"]([^`'"]+)[`'"] to [`'"]([^`'"]+)[`'"](?:[.;]|$)/i) ??
    normalizedSolution.match(/replace (.+?) with (.+?)(?:[.;]|$)/i) ??
    normalizedSolution.match(/change (.+?) to (.+?)(?:[.;]|$)/i);
  if (replacePattern) {
    return {
      badSpan: trimRepairTerm(replacePattern[1] ?? ''),
      replacementTarget: trimRepairTerm(replacePattern[2] ?? ''),
    };
  }

  return fromProblem;
}

function isExactSemanticRepairClass(repairClass: DynamicFixPlan['fixes'][number]['repairClass']): boolean {
  return repairClass === 'exact_replace';
}

function looksLikeUntaughtTargetIssue(problem: string): boolean {
  return /\b(?:not defined or mentioned|not clearly taught|untaught|not taught in this chunk|not mentioned in the teaching content)\b/i.test(problem);
}

function collectRepairableStringPointers(lesson: DynamicGuidedV2Lesson): Array<{ pointer: string; value: string }> {
  const pointers: Array<{ pointer: string; value: string }> = [];
  lesson.steps.forEach((step, stepIndex) => {
    const scalarFields: Array<[string, string | undefined]> = [
      [`/steps/${stepIndex}/questionText`, step.questionText],
      [`/steps/${stepIndex}/retrievalText`, step.retrievalText],
      [`/steps/${stepIndex}/objective`, step.objective],
      [`/steps/${stepIndex}/hint`, step.hint],
      [`/steps/${stepIndex}/deeperQuestionText`, step.deeperQuestionText],
    ];
    scalarFields.forEach(([pointer, value]) => {
      const normalized = normalizeWhitespace(value);
      if (normalized && isRepairablePointer(pointer)) pointers.push({ pointer, value: normalized });
    });
    (step.basicQuestions ?? []).forEach((question, questionIndex) => {
      const pointer = `/steps/${stepIndex}/basicQuestions/${questionIndex}/questionText`;
      const normalized = normalizeWhitespace(question.questionText);
      if (normalized && isRepairablePointer(pointer)) pointers.push({ pointer, value: normalized });
    });
    (step.anchorFacts ?? []).forEach((item, itemIndex) => {
      const pointer = `/steps/${stepIndex}/anchorFacts/${itemIndex}`;
      const normalized = normalizeWhitespace(item);
      if (normalized && isRepairablePointer(pointer)) pointers.push({ pointer, value: normalized });
    });
    (step.keyIdeas ?? []).forEach((item, itemIndex) => {
      const pointer = `/steps/${stepIndex}/keyIdeas/${itemIndex}`;
      const normalized = normalizeWhitespace(item);
      if (normalized && isRepairablePointer(pointer)) pointers.push({ pointer, value: normalized });
    });
    (step.keyTerms ?? []).forEach((item, itemIndex) => {
      const pointer = `/steps/${stepIndex}/keyTerms/${itemIndex}`;
      const normalized = normalizeWhitespace(item);
      if (normalized && isRepairablePointer(pointer)) pointers.push({ pointer, value: normalized });
    });
  });
  return pointers;
}

function deriveRepairPointersFromIssue(
  lesson: DynamicGuidedV2Lesson,
  issue: DynamicLessonGenerationScore['issues'][number]
): string[] {
  const rawPointers = unique((issue.jsonPointers ?? []).map((pointer) => normalizeWhitespace(pointer)).filter(Boolean));
  const directPointers = rawPointers.filter(isRepairablePointer);
  if (directPointers.length > 0) return directPointers;

  const expandedPointers = rawPointers.flatMap((pointer) => {
    const basicQuestionsMatch = pointer.match(/^\/steps\/(\d+)\/basicQuestions$/);
    if (basicQuestionsMatch) {
      const stepIndex = Number(basicQuestionsMatch[1]);
      const step = lesson.steps[stepIndex];
      return (step?.basicQuestions ?? []).map((_, questionIndex) => `/steps/${stepIndex}/basicQuestions/${questionIndex}/questionText`);
    }
    const keyIdeasMatch = pointer.match(/^\/steps\/(\d+)\/keyIdeas$/);
    if (keyIdeasMatch) {
      const stepIndex = Number(keyIdeasMatch[1]);
      const step = lesson.steps[stepIndex];
      return (step?.keyIdeas ?? []).map((_, itemIndex) => `/steps/${stepIndex}/keyIdeas/${itemIndex}`);
    }
    const anchorFactsMatch = pointer.match(/^\/steps\/(\d+)\/anchorFacts$/);
    if (anchorFactsMatch) {
      const stepIndex = Number(anchorFactsMatch[1]);
      const step = lesson.steps[stepIndex];
      return (step?.anchorFacts ?? []).map((_, itemIndex) => `/steps/${stepIndex}/anchorFacts/${itemIndex}`);
    }
    const keyTermsMatch = pointer.match(/^\/steps\/(\d+)\/keyTerms$/);
    if (keyTermsMatch) {
      const stepIndex = Number(keyTermsMatch[1]);
      const step = lesson.steps[stepIndex];
      return (step?.keyTerms ?? []).map((_, itemIndex) => `/steps/${stepIndex}/keyTerms/${itemIndex}`);
    }
    return [];
  }).filter(isRepairablePointer);
  if (expandedPointers.length > 0) return unique(expandedPointers);

  const semanticRepair = inferSemanticReplacement(issue.problem);
  if (semanticRepair.badSpan) {
    const badSpanRegex = new RegExp(`\\b${escapeRegExp(semanticRepair.badSpan)}\\b`, 'i');
    const allPointers = collectRepairableStringPointers(lesson).filter((entry) => badSpanRegex.test(entry.value));
    if (allPointers.length > 0) {
      const preferred =
        /anchor fact/i.test(issue.problem) ? allPointers.filter((entry) => /\/anchorFacts\/\d+$/.test(entry.pointer))
        : /question/i.test(issue.problem) ? allPointers.filter((entry) => /questionText$/.test(entry.pointer))
        : allPointers;
      if (preferred.length > 0) return preferred.map((entry) => entry.pointer);
    }
  }

  if ((issue.id ?? '').startsWith('DQ-')) {
    const match = (issue.id ?? '').match(/^DQ-(\d+)$/);
    const teachCheckIndex = match ? Number(match[1]) - 1 : -1;
    if (teachCheckIndex >= 0) {
      const lessonStepIndex = lesson.steps.findIndex((step) => step.stage === 'teach_check' && lesson.steps.filter((item, idx) => idx <= lesson.steps.indexOf(step) && item.stage === 'teach_check').length - 1 === teachCheckIndex);
      return lessonStepIndex >= 0 ? [`/steps/${lessonStepIndex}/deeperQuestionText`] : [];
    }
  }

  if (/\b(?:apply|calculation|calculate|formula|procedure|transpos|work out|solve)\b/i.test(issue.problem)) {
    for (let stepIndex = 0; stepIndex < lesson.steps.length; stepIndex += 1) {
      const step = lesson.steps[stepIndex];
      if (step.stage !== 'teach_check' || !step.basicQuestions?.length) continue;
      return [`/steps/${stepIndex}/basicQuestions/0/questionText`];
    }
  }

  return [];
}

function deriveRepairPhaseKey(lesson: DynamicGuidedV2Lesson, pointers: string[]): string {
  for (const pointer of pointers) {
    const match = pointer.match(/^\/steps\/(\d+)\//);
    if (!match) continue;
    const step = lesson.steps[Number(match[1])];
    if (step?.id) return step.id;
  }
  return 'lesson';
}

function retargetRepairPointerForProblem(
  lesson: DynamicGuidedV2Lesson,
  pointer: string,
  problem: string
): string {
  const stepMatch = pointer.match(/^\/steps\/(\d+)\//);
  const stepIndex = stepMatch ? Number(stepMatch[1]) : -1;
  const step = stepIndex >= 0 ? lesson.steps[stepIndex] : null;
  if (!step) return pointer;

  if (looksLikeUntaughtTargetIssue(problem) && step.stage === 'teach_check') {
    const preferredQuestionIndex = (step.basicQuestions ?? []).findIndex((question) =>
      extractRepairTerms(problem).some((term) => new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(question.questionText))
    );
    if (preferredQuestionIndex >= 0) {
      return `/steps/${stepIndex}/basicQuestions/${preferredQuestionIndex}/questionText`;
    }
    if ((step.basicQuestions ?? []).length > 0) {
      return `/steps/${stepIndex}/basicQuestions/0/questionText`;
    }
  }

  if (/\b(?:method|worked reasoning|working|calculation method|does not explicitly teach|not explicitly taught|method not taught)\b/i.test(problem)) {
    if ((step.keyIdeas ?? []).length > 0) return `/steps/${stepIndex}/keyIdeas/0`;
    if ((step.anchorFacts ?? []).length > 0) return `/steps/${stepIndex}/anchorFacts/0`;
    if (normalizeWhitespace(step.retrievalText)) return `/steps/${stepIndex}/retrievalText`;
  }

  if (/meta-cognitive|lesson structure|about the lesson structure/i.test(problem) && normalizeWhitespace(step.deeperQuestionText)) {
    return `/steps/${stepIndex}/deeperQuestionText`;
  }

  return pointer;
}

function deriveBaseRepairClass(
  pointer: string,
): DynamicFixPlan['fixes'][number]['repairClass'] {
  if (/\/deeperQuestionText$/.test(pointer)) return 'deeper_question_rewrite';
  if (/\/basicQuestions\/\d+\/questionText$/.test(pointer)) return 'basic_question_rewrite';
  return 'teaching_field_rewrite';
}

function buildRepairDescriptor(params: {
  lesson: DynamicGuidedV2Lesson;
  pointer: string;
  problem: string;
  currentValue: string;
  solution?: string;
  input?: DynamicLessonGenerationInput;
  requestedRepairClass?: DynamicFixPlan['fixes'][number]['repairClass'];
}): Pick<
  DynamicFixPlan['fixes'][number],
  | 'fieldType'
  | 'repairClass'
  | 'repairMode'
  | 'severity'
  | 'sourceEvidence'
  | 'replacementTarget'
  | 'badSpan'
  | 'whyCurrentValueFails'
  | 'mustPreserve'
  | 'requiredFix'
  | 'replacementText'
  | 'allowedTerms'
  | 'forbiddenTerms'
> {
  const sourceEvidence = buildRepairSourceEvidence(params.lesson, params.pointer, params.input);
  const inferred = inferSemanticReplacementFromTexts(params.problem, params.solution);
  const baseRepairClass = deriveBaseRepairClass(params.pointer);
  const packetContext = buildRepairPacketContext({
    lesson: params.lesson,
    pointer: params.pointer,
    problem: params.problem,
    currentValue: params.currentValue,
    input: params.input,
    solution: params.solution,
    badSpan: inferred.badSpan,
    replacementTarget: inferred.replacementTarget,
  });

  if (baseRepairClass === 'teaching_field_rewrite' && inferred.badSpan && inferred.replacementTarget) {
    return {
      ...packetContext,
      repairClass: 'exact_replace',
      repairMode: 'exact_replace',
      severity: 'critical',
      sourceEvidence,
      badSpan: inferred.badSpan,
      replacementTarget: inferred.replacementTarget,
    };
  }

  const requested = params.requestedRepairClass;
  const repairClass =
    requested &&
    (requested === 'exact_replace' ||
      requested === 'basic_question_rewrite' ||
      requested === 'deeper_question_rewrite' ||
      requested === 'teaching_field_rewrite')
      ? requested
      : baseRepairClass;

  return {
    ...packetContext,
    repairClass,
    repairMode: repairClass === 'exact_replace' ? 'exact_replace' : 'field_rewrite',
    severity: repairClass === 'teaching_field_rewrite' ? 'minor' : 'major',
    sourceEvidence,
  };
}

function dedupeRepairFixes(
  fixes: DynamicFixPlan['fixes']
): DynamicFixPlan['fixes'] {
  const seen = new Map<string, number>();
  const deduped: DynamicFixPlan['fixes'] = [];
  for (const fix of fixes) {
    const key = `${fix.repairClass}::${fix.targetPointer}`;
    const existingIndex = seen.get(key);
    if (existingIndex === undefined) {
      seen.set(key, deduped.length);
      deduped.push(fix);
      continue;
    }

    const existing = deduped[existingIndex];
    const existingScore =
      normalizeWhitespace(existing.requiredFix).length +
      normalizeWhitespace(existing.whyCurrentValueFails).length +
      existing.sourceEvidence.join(' ').length;
    const incomingScore =
      normalizeWhitespace(fix.requiredFix).length +
      normalizeWhitespace(fix.whyCurrentValueFails).length +
      fix.sourceEvidence.join(' ').length;

    if (incomingScore > existingScore) {
      deduped[existingIndex] = fix;
    }
  }
  return deduped;
}

function sortRepairFixes(
  fixes: DynamicFixPlan['fixes']
): DynamicFixPlan['fixes'] {
  const priorityOrder: Record<DynamicFixPlan['fixes'][number]['priority'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  const severityOrder: Record<DynamicFixPlan['fixes'][number]['severity'], number> = {
    critical: 0,
    major: 1,
    minor: 2,
  };
  return [...fixes].sort(
    (left, right) => severityOrder[left.severity] - severityOrder[right.severity] || priorityOrder[left.priority] - priorityOrder[right.priority]
  );
}

function hasMultipleQuestionDemands(text: string | undefined): boolean {
  const normalized = normalizeWhitespace(text ?? '');
  if (!normalized) return false;
  return /\b(?:identify|state|name|list|explain|describe|give|calculate|show|outline|compare|select)\b.*\b(?:and|then)\b.*\b(?:identify|state|name|list|explain|describe|give|calculate|show|outline|compare|select)\b/i.test(normalized);
}

function validateRepairPatchForClass(
  lesson: DynamicGuidedV2Lesson,
  patchSet: DynamicRepairPatchSet,
  fix: DynamicFixPlan['fixes'][number]
): string[] {
  if (patchSet.patches.length > 1) {
    return ['Repair rounds may patch only one field at a time.'];
  }
  if (patchSet.patches.length === 0) return ['No patch was returned for the targeted field.'];
  const [patch] = patchSet.patches;
  if (patch.jsonPointer !== fix.targetPointer) {
    return [`Patch ${patch.jsonPointer} does not match the targeted field ${fix.targetPointer}.`];
  }
  if (typeof patch.value !== 'string') {
    return [`Patch ${patch.jsonPointer} must return a string replacement.`];
  }

  const patchedLesson = applyRepairPatchSet(lesson, patchSet);
  const patchedValue = normalizeWhitespace(String(readJsonPointerValue(patchedLesson, fix.targetPointer) ?? ''));
  if (!patchedValue) {
    return [`Patch ${patch.jsonPointer} cannot blank the targeted field.`];
  }

  switch (fix.repairClass) {
    case 'exact_replace': {
      const issues: string[] = [];
      if (fix.badSpan && patchedValue.includes(fix.badSpan)) {
        issues.push(`Patch ${patch.jsonPointer} still contains the bad span ${JSON.stringify(fix.badSpan)}.`);
      }
      if (fix.replacementTarget && !new RegExp(`\\b${escapeRegExp(fix.replacementTarget)}\\b`, 'i').test(patchedValue)) {
        issues.push(`Patch ${patch.jsonPointer} does not contain the required replacement target ${JSON.stringify(fix.replacementTarget)}.`);
      }
      if (
        fix.sourceEvidence.length > 0 &&
        !fix.sourceEvidence.some((evidence) => {
          const evidenceTerms = evidence.match(/[A-Za-z][A-Za-z0-9\-']+/g) ?? [];
          return evidenceTerms.some((term) => new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(patchedValue));
        })
      ) {
        issues.push(`Patch ${patch.jsonPointer} is not grounded in the supplied source evidence.`);
      }
      return issues;
    }
    case 'basic_question_rewrite':
      return hasMultipleQuestionDemands(patchedValue) || containsPlaceholderLanguage(patchedValue)
        ? [`Patch ${patch.jsonPointer} is still not a clean single-focus basic question.`]
        : [];
    case 'deeper_question_rewrite':
      return containsPlaceholderLanguage(patchedValue) || !/\b(?:why|how|what would|what must)\b/i.test(patchedValue)
        ? [`Patch ${patch.jsonPointer} is still too weak for a deeper reasoning question.`]
        : [];
    case 'teaching_field_rewrite':
    default:
      return containsPlaceholderLanguage(patchedValue) || wordCount(patchedValue) < 5
        ? [`Patch ${patch.jsonPointer} is still placeholder-like or too thin.`]
        : [];
  }
}

function derivePatchRejectedCode(issue: string | undefined): string | null {
  const normalized = normalizeWhitespace(issue);
  if (!normalized) return null;
  if (/does not match the targeted field/i.test(normalized)) return 'wrong_target_field';
  if (/still contains the bad span|still too generic|still too weak|still not/i.test(normalized)) return 'defect_still_present';
  if (/untaught term|not taught in this chunk|not defined or mentioned/i.test(normalized)) return 'introduced_untaught_term';
  if (/method or worked reasoning needed/i.test(normalized)) return 'missing_method';
  if (/No patch was returned/i.test(normalized)) return 'too_vague';
  if (/did not improve the targeted field/i.test(normalized)) return 'no_material_improvement';
  if (/step structure|could not be stabilized safely/i.test(normalized)) return 'structure_regression';
  return 'no_material_improvement';
}

function shouldAcceptRepairCandidate(params: {
  currentLesson: DynamicGuidedV2Lesson;
  currentValidation: DynamicLessonGenerationValidation;
  currentScore: DynamicLessonGenerationScore;
  candidateLesson: DynamicGuidedV2Lesson;
  candidateValidation: DynamicLessonGenerationValidation;
  candidateScore: DynamicLessonGenerationScore;
  fix: DynamicFixPlan['fixes'][number];
}): boolean {
  if (params.candidateValidation.issues.length > params.currentValidation.issues.length) return false;
  if (params.currentValidation.passed && !params.candidateValidation.passed) return false;
  if (isExactSemanticRepairClass(params.fix.repairClass)) return true;

  const pointerMatches = (issue: DynamicLessonGenerationScore['issues'][number]) =>
    (issue.jsonPointers ?? []).some((pointer) => normalizeWhitespace(pointer) === params.fix.targetPointer);
  const currentPointerIssues = params.currentScore.issues.filter(pointerMatches);
  const candidatePointerIssues = params.candidateScore.issues.filter(pointerMatches);
  if (candidatePointerIssues.length < currentPointerIssues.length) return true;
  return candidatePointerIssues.length === 0 && params.candidateValidation.issues.length <= params.currentValidation.issues.length;
}

function deriveValidationRepairFixes(
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation,
  input?: DynamicLessonGenerationInput
): DynamicFixPlan['fixes'] {
  const fixes: DynamicFixPlan['fixes'] = [];

  for (const issue of validation.issues) {
    let targetPointer = '';
    let category: DynamicFixPlan['fixes'][number]['category'] = 'alignmentToLO';

    if (/Teach\/Check \d+ deeper question is missing or generic\./i.test(issue)) {
      const match = issue.match(/Teach\/Check (\d+) deeper question/i);
      const teachCheckOrdinal = match ? Number(match[1]) : 0;
      const teachCheckSteps = lesson.steps.filter((step) => step.stage === 'teach_check');
      const targetStep = teachCheckSteps[teachCheckOrdinal - 1];
      targetPointer = targetStep ? `/steps/${lesson.steps.indexOf(targetStep)}/deeperQuestionText` : '';
      category = 'alignmentToLO';
    }

    if (!targetPointer) continue;
    targetPointer = retargetRepairPointerForProblem(lesson, targetPointer, issue);
    const descriptor = buildRepairDescriptor({
      lesson,
      pointer: targetPointer,
      problem: issue,
      currentValue: serializeRepairCurrentValue(readJsonPointerValue(lesson, targetPointer)),
      input,
    });
    fixes.push({
      ...descriptor,
      phaseKey: deriveRepairPhaseKey(lesson, [targetPointer]),
      priority: 'high',
      category,
      targetPointer,
      problem: issue,
      currentValue: serializeRepairCurrentValue(readJsonPointerValue(lesson, targetPointer)),
    });
  }

  return fixes;
}

function coerceFixPlan(
  raw: unknown,
  score: DynamicLessonGenerationScore,
  lesson: DynamicGuidedV2Lesson,
  validation: DynamicLessonGenerationValidation,
  input?: DynamicLessonGenerationInput
): DynamicFixPlan {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const fixesRaw = Array.isArray(data.fixes) ? data.fixes : [];
  const fallbackFixes = score.issues.flatMap((issue) =>
    deriveRepairPointersFromIssue(lesson, issue).map((pointer) => {
      const targetPointer = retargetRepairPointerForProblem(lesson, pointer, issue.problem);
      const currentValue = serializeRepairCurrentValue(readJsonPointerValue(lesson, targetPointer));
      const descriptor = buildRepairDescriptor({
        lesson,
        pointer: targetPointer,
        problem: issue.problem,
        currentValue,
        solution: issue.solution ?? issue.suggestion,
        input,
      });
      return {
        ...descriptor,
        priority: 'high' as const,
        category: issue.category,
        phaseKey: deriveRepairPhaseKey(lesson, [targetPointer]),
        targetPointer,
        problem: issue.problem,
        currentValue,
      };
    })
  );
  const validationFixes = deriveValidationRepairFixes(lesson, validation, input);

  const modelFixes = fixesRaw.length > 0
    ? fixesRaw.flatMap((item) => {
          const fix = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
          const priority = normalizeWhitespace(fix.priority).toLowerCase();
          const category = normalizeWhitespace(fix.category) as DynamicFixPlan['fixes'][number]['category'];
          const repairClass = normalizeWhitespace(fix.repairClass) as DynamicFixPlan['fixes'][number]['repairClass'];
          const targetPointerValues = unique([
            normalizeWhitespace(fix.targetPointer),
            ...arrayOfStrings(fix.targetPointers),
          ].map((pointer) => retargetRepairPointerForProblem(lesson, pointer, normalizeWhitespace(fix.problem))).filter(isRepairablePointer));
          return targetPointerValues.map((targetPointer) => ({
            ...buildRepairDescriptor({
              lesson,
              pointer: targetPointer,
              problem: normalizeWhitespace(fix.problem),
              currentValue: normalizeWhitespace(fix.currentValue) || serializeRepairCurrentValue(readJsonPointerValue(lesson, targetPointer)),
              solution: normalizeWhitespace(fix.requiredFix) || normalizeWhitespace(fix.solution) || normalizeWhitespace(fix.suggestion),
              input,
              requestedRepairClass: repairClass,
            }),
            priority: priority === 'medium' || priority === 'low' ? priority : 'high',
            category:
              category === 'beginnerClarity' ||
              category === 'teachingBeforeTesting' ||
              category === 'markingRobustness' ||
              category === 'alignmentToLO' ||
              category === 'questionQuality'
                ? category
                : 'beginnerClarity',
            phaseKey: normalizeWhitespace(fix.phaseKey) || deriveRepairPhaseKey(lesson, [targetPointer]),
            targetPointer,
            problem: normalizeWhitespace(fix.problem),
            currentValue: normalizeWhitespace(fix.currentValue) || serializeRepairCurrentValue(readJsonPointerValue(lesson, targetPointer)),
          }));
        })
        .filter((item) => item.problem && item.targetPointer)
    : [];

  const fixes = [...fallbackFixes, ...modelFixes, ...validationFixes];

  return {
    summary: normalizeWhitespace(data.summary) || 'Fix the highest-impact pedagogical issues without changing the lesson structure.',
    fixes: sortRepairFixes(dedupeRepairFixes(fixes)),
  };
}

function coerceRepairPatchSet(raw: unknown, allowedPointers: string[]): DynamicRepairPatchSet {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const patchesRaw = Array.isArray(data.patches) ? data.patches : [];
  const allowed = new Set(allowedPointers);
  const patches: DynamicRepairPatch[] = [];

  for (const item of patchesRaw) {
    const patch = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const jsonPointer = normalizeWhitespace(patch.jsonPointer);
    if (!jsonPointer || !allowed.has(jsonPointer)) continue;
    const value = patch.value;
    if (
      typeof value === 'string' ||
      value === null ||
      (Array.isArray(value) && value.every((entry) => typeof entry === 'string'))
    ) {
      patches.push({ jsonPointer, value });
    }
  }

  return {
    patches: unique(patches.map((patch) => `${patch.jsonPointer}::${JSON.stringify(patch.value)}`)).map((key) => {
      const [jsonPointer, serializedValue] = key.split('::');
      return {
        jsonPointer,
        value: JSON.parse(serializedValue) as DynamicRepairPatch['value'],
      };
    }),
  };
}

function validateRepairPatchSet(
  lesson: DynamicGuidedV2Lesson,
  patchSet: DynamicRepairPatchSet,
  allowedPointers: string[],
  repairFix?: DynamicFixPlan['fixes'][number]
): string[] {
  const issues: string[] = [];
  const allowed = new Set(allowedPointers);
  const seen = new Set<string>();

  for (const patch of patchSet.patches) {
    if (!allowed.has(patch.jsonPointer)) {
      issues.push(`Patch ${patch.jsonPointer} is outside the allowed repair surface.`);
      continue;
    }
    if (seen.has(patch.jsonPointer)) {
      issues.push(`Patch ${patch.jsonPointer} appears more than once.`);
      continue;
    }
    seen.add(patch.jsonPointer);

    const currentValue = readJsonPointerValue(lesson, patch.jsonPointer);
    if (typeof currentValue === 'string') {
      if (typeof patch.value !== 'string') {
        issues.push(`Patch ${patch.jsonPointer} must replace a string field with a string value.`);
        continue;
      }
      if (normalizeWhitespace(currentValue) && !normalizeWhitespace(patch.value)) {
        issues.push(`Patch ${patch.jsonPointer} cannot blank out a populated field.`);
      }
    } else if (Array.isArray(currentValue)) {
      if (!Array.isArray(patch.value) || patch.value.some((item) => typeof item !== 'string')) {
        issues.push(`Patch ${patch.jsonPointer} must replace a string array with a string array.`);
      }
    } else {
      issues.push(`Patch ${patch.jsonPointer} targets an unsupported field type.`);
    }
  }

  if (repairFix) {
    issues.push(...validateRepairPatchForClass(lesson, patchSet, repairFix));
  }

  return unique(issues);
}

function applyRepairPatchSet(lesson: DynamicGuidedV2Lesson, patchSet: DynamicRepairPatchSet): DynamicGuidedV2Lesson {
  const cloned = JSON.parse(JSON.stringify(lesson)) as DynamicGuidedV2Lesson;
  for (const patch of patchSet.patches) {
    writeJsonPointerValue(cloned, patch.jsonPointer, patch.value);
  }
  return cloned;
}

function buildDeterministicExactReplacePatchSet(
  lesson: DynamicGuidedV2Lesson,
  fix: DynamicFixPlan['fixes'][number]
): DynamicRepairPatchSet {
  if (fix.repairClass !== 'exact_replace' || !fix.badSpan || !fix.replacementTarget) {
    return { patches: [] };
  }

  const currentValue = serializeRepairCurrentValue(readJsonPointerValue(lesson, fix.targetPointer));
  const badSpan = normalizeWhitespace(fix.badSpan);
  const replacementTarget = normalizeWhitespace(fix.replacementTarget);
  if (!currentValue) {
    return { patches: [] };
  }

  const replacementText = normalizeWhitespace(fix.replacementText ?? '');
  if (replacementText && replacementText !== currentValue) {
    return {
      patches: [
        {
          jsonPointer: fix.targetPointer,
          value: replacementText,
        },
      ],
    };
  }

  if (!badSpan || !replacementTarget) {
    return { patches: [] };
  }

  const badSpanRegex = new RegExp(`\\b${escapeRegExp(badSpan)}\\b`, 'gi');
  if (badSpanRegex.test(currentValue)) {
    const replacedValue = currentValue.replace(badSpanRegex, replacementTarget);
    if (normalizeWhitespace(replacedValue) !== normalizeWhitespace(currentValue)) {
      return {
        patches: [
          {
            jsonPointer: fix.targetPointer,
            value: replacedValue,
          },
        ],
      };
    }
  }

  const quotedReplacement =
    extractQuotedSentenceFromRepairText(fix.requiredFix) ??
    extractQuotedSentenceFromRepairText(fix.whyCurrentValueFails);
  if (quotedReplacement && normalizeWhitespace(quotedReplacement) !== normalizeWhitespace(currentValue)) {
    return {
      patches: [
        {
          jsonPointer: fix.targetPointer,
          value: quotedReplacement,
        },
      ],
    };
  }

  const sourceReplacement = fix.sourceEvidence
    .map((entry) => normalizeWhitespace(entry))
    .find((entry) => new RegExp(`\\b${escapeRegExp(replacementTarget)}\\b`, 'i').test(entry) && entry !== currentValue);
  if (sourceReplacement) {
    return {
      patches: [
        {
          jsonPointer: fix.targetPointer,
          value: sourceReplacement,
        },
      ],
    };
  }

  return { patches: [] };
}

function extractQuotedSentenceFromRepairText(text: string | undefined): string | null {
  const normalized = normalizeWhitespace(text ?? '');
  if (!normalized) return null;
  const matches = [...normalized.matchAll(/['"]([^'"]{12,})['"]/g)];
  for (const match of matches) {
    const candidate = normalizeWhitespace(match[1]);
    if (!candidate) continue;
    if (!/[.?!]$/.test(candidate) && wordCount(candidate) < 5) continue;
    return candidate;
  }
  return null;
}

function coerceRepairReplacementPatchSet(rawText: string, targetPointer: string): DynamicRepairPatchSet {
  const normalized = normalizeWhitespace(
    String(rawText ?? '')
      .replace(/^```(?:text|txt)?/i, '')
      .replace(/```$/i, '')
      .trim()
      .replace(/^"(.*)"$/s, '$1')
  );
  if (!normalized) {
    return { patches: [] };
  }
  return {
    patches: [
      {
        jsonPointer: targetPointer,
        value: normalized,
      },
    ],
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

function ensureWorkedExampleRetrievalText(text: string): string {
  const structure = workedExampleStructure(text);
  if (structure.lines.length === 0) return text;

  const lines = [...structure.lines];
  if (!structure.hasResult) {
    const lastStep = structure.stepLines.at(-1) ?? lines.at(-1) ?? '';
    lines.push(`Result: ${lastStep.replace(/^step\s*\d+\s*:\s*/i, '').replace(/^\d+\.\s*/, '')}`.trim());
  }
  if (!structure.hasTakeaway) {
    const fallbackTakeaway =
      structure.hasResult
        ? lines.find((line) => /^result\b/i.test(line))?.replace(/^result\s*:\s*/i, '') ?? 'Apply the same identification method to the next case.'
        : 'Apply the same identification method to the next case.';
    lines.push(`Takeaway: ${fallbackTakeaway}`);
  }

  return lines.join('\n');
}

function normalizeWorkedExampleStep(step: DynamicGuidedV2Step): DynamicGuidedV2Step {
  if (step.stage !== 'worked_example') return step;
  if (!step.retrievalText) {
    const taskSkeleton = step.taskSkeleton ?? {};
    const takeaway = normalizeWhitespace(taskSkeleton.takeaway);
    if (takeaway) return step;
    const fallbackTakeaway =
      normalizeWhitespace(taskSkeleton.steps?.at(-1)) ||
      normalizeWhitespace(step.anchorFacts?.at(-1)) ||
      'Apply the same identification method to the next case.';
    return {
      ...step,
      taskSkeleton: {
        ...taskSkeleton,
        takeaway: fallbackTakeaway,
      },
    };
  }
  return {
    ...step,
    retrievalText: ensureWorkedExampleRetrievalText(step.retrievalText),
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

function isClassificationListBundle(questionText: string | undefined, answerGuidance?: string[] | undefined): boolean {
  const normalized = normalizeWhitespace(questionText);
  const numberedParts = normalized.match(/\b\d+[\.\)]\s*[A-Za-z0-9]/g) ?? [];
  if (!/\bclassify\b|\bcategori[sz]e\b|\bsort\b/i.test(normalized)) return false;
  if (numberedParts.length < 4) return false;
  const guidanceCount = (answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean).length;
  return guidanceCount >= 2;
}

function isHardToMarkOpenEndedTask(questionText: string | undefined, answerGuidance?: string[] | undefined): boolean {
  const normalized = normalizeWhitespace(questionText);
  if (!/^(?:explain|describe|compare|justify)\b/i.test(normalized)) return false;
  if (/\b\d+[\.\)]/i.test(normalized)) return false;
  const multiDemandCue =
    (normalized.match(/\band\b/gi)?.length ?? 0) >= 1 ||
    /\bdifference between\b/i.test(normalized) ||
    /\bwork together\b/i.test(normalized);
  const guidanceCount = (answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean).length;
  return multiDemandCue && guidanceCount >= 2;
}

type SpecificTermGuidanceIssue = {
  questionIndex: number;
  problem: string;
  suggestion: string;
  excerpt: string;
};

function findSpecificTermGuidanceIssues(step: DynamicGuidedV2Step): SpecificTermGuidanceIssue[] {
  if (step.stage !== 'teach_check' || !step.basicQuestions?.length) return [];

  const issues: SpecificTermGuidanceIssue[] = [];

  step.basicQuestions.forEach((question, questionIndex) => {
    const questionText = normalizeWhitespace(question.questionText);
    const guidance = (question.answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
    if (!questionRequestsSpecificTerm(questionText) || guidance.length === 0) return;

    const formalGuidance = guidance.filter((item) => wordCount(item) <= 3 || /[A-Z]{2,}|-/.test(item));
    const descriptiveGuidance = guidance.filter(
      (item) =>
        wordCount(item) >= 3 &&
        !formalGuidance.some((formal) => item.toLowerCase().includes(formal.toLowerCase()))
    );

    if (/technical name/i.test(questionText) && formalGuidance.some((item) => wordCount(item) >= 4)) {
      const shorterAlternative = guidance.find((item) => wordCount(item) <= 3 && !formalGuidance.includes(item));
      if (shorterAlternative) {
        issues.push({
          questionIndex,
          problem: `${step.title} accepts a common or shortened label even though the question asks for the technical name.`,
          suggestion: 'Prioritize the formal technical term and demote common names to secondary notes only.',
          excerpt: `${questionText} | ${shorterAlternative}`,
        });
        return;
      }
    }

    if (formalGuidance.length > 0 && descriptiveGuidance.length > 0) {
      issues.push({
        questionIndex,
        problem: `${step.title} asks for a specific term but the answer guidance also accepts descriptive paraphrases.`,
        suggestion: 'Restrict the answer guidance to the exact technical term or named item requested by the question.',
        excerpt: `${questionText} | ${descriptiveGuidance[0]}`,
      });
    }
  });

  return issues;
}

type GuidanceContaminationIssue = {
  questionIndex: number;
  problem: string;
  suggestion: string;
  excerpt: string;
};

function findGuidanceContaminationIssues(step: DynamicGuidedV2Step): GuidanceContaminationIssue[] {
  if (step.stage !== 'teach_check' || !step.basicQuestions?.length) return [];

  const issues: GuidanceContaminationIssue[] = [];

  step.basicQuestions.forEach((question, questionIndex) => {
    const questionText = normalizeWhitespace(question.questionText);
    const currentEntities = new Set(extractNamedEntities(questionText));
    const siblingEntities = new Set(
      step.basicQuestions
        ?.flatMap((sibling, siblingIndex) =>
          siblingIndex === questionIndex
            ? []
            : [
                ...extractNamedEntities(sibling.questionText),
                ...(sibling.answerGuidance ?? []).flatMap((item) => extractNamedEntities(item)),
              ]
        )
        .filter(Boolean) ?? []
    );

    for (const guidanceItem of question.answerGuidance ?? []) {
      const guidance = normalizeWhitespace(guidanceItem);
      if (!guidance) continue;

      const guidanceEntities = extractNamedEntities(guidance);
      const contaminatingEntity =
        questionRequiresNarrowExpansion(questionText)
          ? guidanceEntities.find((entity) => siblingEntities.has(entity) && !currentEntities.has(entity))
          : null;
      if (contaminatingEntity) {
        issues.push({
          questionIndex,
          problem: `${step.title} answer guidance includes '${contaminatingEntity}', which belongs to a neighbouring question rather than the current prompt.`,
          suggestion: 'Remove neighbouring-question answers from this guidance list so each question only accepts its own target.',
          excerpt: `${questionText} | ${guidance}`,
        });
        continue;
      }

      if (questionRequestsSpecificTerm(questionText)) {
        const titleOverlap = tokenOverlapCount(guidance, step.title);
        const questionOverlap = tokenOverlapCount(guidance, questionText);
        if (titleOverlap >= 2 && questionOverlap === 0) {
          issues.push({
            questionIndex,
            problem: `${step.title} answer guidance includes a topic label or neighbouring concept instead of the specific term requested.`,
            suggestion: 'Remove topic-label answers and keep only the exact term, abbreviation expansion, or named item the question asks for.',
            excerpt: `${questionText} | ${guidance}`,
          });
        }
      }
    }
  });

  return issues;
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

    if (step.stage === 'teach_check' ? hasTeachGrounding(step) : hasTaskFraming(step) || workedExampleIsStructured(step)) {
      strengths.push(step.retrievalText ? 'Grounded teaching text is present for this phase.' : 'Thin guard rails are present for this phase.');
    } else {
      issues.push('Teaching support is too thin or generic for this phase.');
      suggestedFixes.push('Strengthen the anchors, constraints, or task skeleton with more concrete grounded content.');
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

      const exactTermIssues = findSpecificTermGuidanceIssues(step);
      if (exactTermIssues.length > 0) {
        issues.push(exactTermIssues[0].problem);
        suggestedFixes.push(exactTermIssues[0].suggestion);
      }

      const contaminationIssues = findGuidanceContaminationIssues(step);
      if (contaminationIssues.length > 0) {
        issues.push(contaminationIssues[0].problem);
        suggestedFixes.push(contaminationIssues[0].suggestion);
      }
    }

    if (step.stage === 'worked_example') {
      if (workedExampleIsStructured(step)) {
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
      if (isClassificationListBundle(step.questionText, step.answerGuidance)) {
        issues.push('This phase classifies several items in one response field, which weakens marking granularity.');
        suggestedFixes.push('Break the classifications into smaller prompts or label each expected answer explicitly.');
      }
      if (hasThinGuidanceForBundledTask(step.questionText, step.answerGuidance)) {
        issues.push('This phase bundles multiple required answers without enough answer guidance.');
        suggestedFixes.push('Split the task or provide answer guidance that maps clearly to each part.');
      }
      if (isHardToMarkOpenEndedTask(step.questionText, step.answerGuidance)) {
        issues.push('This phase uses an open-ended multi-demand prompt that is difficult to mark reliably.');
        suggestedFixes.push('Constrain the response or label the required parts so marking stays reliable.');
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

function synthesizeIssuesFromBreakdown(score: DynamicLessonGenerationScore): DynamicLessonGenerationScore['issues'] {
  const deficitOrder = (
    Object.entries(SCORE_MAX) as Array<[keyof typeof SCORE_MAX, number]>
  )
    .map(([category, max]) => ({
      category,
      deficit: max - score.breakdown[category],
    }))
    .filter((entry) => entry.deficit > 0)
    .sort((left, right) => right.deficit - left.deficit);

  const minimumIssues = score.total < 90 ? 5 : score.total < 95 ? 1 : 0;
  return deficitOrder.slice(0, minimumIssues).map((entry, index) => {
    switch (entry.category) {
      case 'beginnerClarity':
        return buildIssue(
          'beginnerClarity',
          'Some teaching or question wording is still less clear and direct than the chunk-first contract requires.',
          'Tighten the weakest chunk wording so a beginner can identify the exact concept or response expected without inference.',
          {
            id: `SYN-CLARITY-${index + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring synthesis',
            whyItMatters: 'A sub-95 lesson must expose the concrete clarity weaknesses still limiting learner confidence.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        );
      case 'teachingBeforeTesting':
        return buildIssue(
          'teachingBeforeTesting',
          'At least one chunk still tests understanding more strongly than it teaches the required idea or method first.',
          'Strengthen the weakest chunk teaching support before its related checks so the learner is taught before being tested.',
          {
            id: `SYN-TBT-${index + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring synthesis',
            whyItMatters: 'A sub-95 lesson must expose any remaining teaching-before-testing gap explicitly.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        );
      case 'markingRobustness':
        return buildIssue(
          'markingRobustness',
          'At least one learner task remains harder to judge reliably than the score gate allows.',
          'Tighten the weakest learner task so the required response is narrower and easier to judge consistently.',
          {
            id: `SYN-MR-${index + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring synthesis',
            whyItMatters: 'A sub-95 lesson must expose the remaining weak marking surfaces explicitly.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        );
      case 'alignmentToLO':
        return buildIssue(
          'alignmentToLO',
          'At least one chunk still drifts from the intended learning objective or tests the wrong thing.',
          'Align the weakest chunk more tightly to the objective and remove any recall or reasoning drift.',
          {
            id: `SYN-ALIGN-${index + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring synthesis',
            whyItMatters: 'A sub-95 lesson must expose where objective alignment is still being lost.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        );
      case 'questionQuality':
      default:
        return buildIssue(
          'questionQuality',
          'At least one question still falls short of the quality needed for a 95+ lesson.',
          'Rewrite the weakest question so it is more direct, distinct, and tightly grounded in the chunk teaching.',
          {
            id: `SYN-QQ-${index + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring synthesis',
            whyItMatters: 'A sub-95 lesson must expose the remaining weak questions explicitly.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        );
    }
  });
}

function strengthenScoreReport(
  score: DynamicLessonGenerationScore,
  heuristicScore: DynamicLessonGenerationScore
): DynamicLessonGenerationScore {
  const minimumIssueCount = score.total < 90 ? 5 : score.total < 95 ? 1 : 0;
  const needsIssueBackfill = score.issues.length < minimumIssueCount;
  const needsSummaryBackfill =
    !normalizeWhitespace(score.summary) || normalizeWhitespace(score.summary) === 'No scoring summary provided.';
  const phaseFeedback = score.phaseFeedback.length > 0 ? score.phaseFeedback : heuristicScore.phaseFeedback;
  const synthesizedIssues = phaseFeedback
    .filter((phase) => phase.issues.length > 0)
    .slice(0, Math.max(minimumIssueCount, 3))
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
  const backfilledIssues = [
    ...score.issues,
    ...heuristicScore.issues,
    ...synthesizedIssues,
    ...synthesizeIssuesFromBreakdown(score),
  ].filter((issue, index, all) => {
    const key = `${issue.problem}|${(issue.jsonPointers ?? []).join('|')}`;
    return all.findIndex((candidate) => `${candidate.problem}|${(candidate.jsonPointers ?? []).join('|')}` === key) === index;
  });
  const paddedIssues = [...backfilledIssues];
  const fallbackCategoryOrder: DynamicLessonGenerationScore['issues'][number]['category'][] = [
    'beginnerClarity',
    'teachingBeforeTesting',
    'markingRobustness',
    'alignmentToLO',
    'questionQuality',
  ];
  let padIndex = 0;
  while (needsIssueBackfill && paddedIssues.length < minimumIssueCount) {
    const category = fallbackCategoryOrder[padIndex % fallbackCategoryOrder.length];
    const synthetic = synthesizeIssuesFromBreakdown({
      ...score,
      breakdown: {
        ...score.breakdown,
        [category]: Math.min(score.breakdown[category], 0),
      },
    }).find((issue) => !paddedIssues.some((existing) => existing.problem === issue.problem));
    paddedIssues.push(
      synthetic ??
        buildIssue(
          category,
          `Additional improvement point needed for ${category}.`,
          'Tighten the weakest field in this category.',
          {
            id: `PAD-${padIndex + 1}`,
            jsonPointers: ['/steps'],
            excerpt: 'scoring padding',
            whyItMatters: 'Sub-90 lessons should surface multiple concrete improvement points.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        )
    );
    padIndex += 1;
  }
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
    issues: needsIssueBackfill ? paddedIssues : score.issues,
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
  const grade = lessonGrade(total, validation.passed);

  return {
    ...score,
    total,
    grade,
    breakdown,
    issues:
      existingBundledIndex >= 0
        ? [score.issues[existingBundledIndex], ...score.issues.filter((_, index) => index !== existingBundledIndex)]
        : [primaryBundledIssue, ...score.issues],
    summary: `${score.summary} A bundled-task guardrail was applied because one response field carries too many distinct required outputs.`,
  };
}

function strengthenIntroRetrievalText(
  retrievalText: string,
  planning?: DynamicPlanningPhaseOutput
): string {
  const lines = retrievalText
    .split('\n')
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  if (lines.length === 0) return retrievalText;

  const genericOutcomeIndex = lines.findIndex((line) => /^By the end of this lesson you should understand the core lesson idea/i.test(line));
  if (genericOutcomeIndex >= 0) {
    lines[genericOutcomeIndex] = 'By the end of this lesson you should be able to explain the main idea accurately and use it in one practical case.';
  }

  if (!lines.some((line) => /^Core chunk map:/i.test(line)) && planning?.teachChecks?.length) {
    const chunkMap = planning.teachChecks
      .slice(0, 4)
      .map((teachCheck) => normalizeWhitespace(teachCheck.title))
      .filter(Boolean)
      .join('; ');
    if (chunkMap) {
      lines.splice(Math.min(lines.length, 3), 0, `Core chunk map: ${chunkMap}.`);
    }
  }

  return lines.join('\n');
}

function normalizeDeeperQuestion(
  questionText: string | undefined,
  answerGuidance: string[] | undefined
): { questionText?: string; answerGuidance: string[] } {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const normalizedGuidance = unique((answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  const normalizedExplanationGuidance = looksLikeExplanationPrompt(normalizedQuestion)
    ? compactConceptPoints(normalizedGuidance, 5)
    : normalizedGuidance;
  if (!normalizedQuestion) {
    return { questionText: undefined, answerGuidance: normalizedGuidance };
  }
  if (/^(?:why|how)\b/i.test(normalizedQuestion) && normalizedExplanationGuidance.length > 0 && normalizedExplanationGuidance.length <= 4) {
    return {
      questionText: normalizedQuestion
        .replace(/^Why must\b/i, 'What is the main reason')
        .replace(/^Why does\b/i, 'What is the main reason')
        .replace(/^How does\b/i, 'What is the main way')
        .replace(/^How do\b/i, 'What is the main way'),
      answerGuidance: normalizedExplanationGuidance,
    };
  }
  return { questionText: normalizedQuestion, answerGuidance: normalizedExplanationGuidance };
}

function looksLikeExplanationPrompt(questionText: string | undefined): boolean {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  return /^(?:using one short explanation|explain|describe|why|what is the main reason|what is the main way)\b/.test(normalized);
}

function buildTeachingAnchorFromQuestion(question: DynamicGuidedV2BasicQuestion): string | null {
  const questionText = normalizeWhitespace(question.questionText);
  const target = normalizeWhitespace(question.answerGuidance?.[0] ?? '');
  if (!questionText || !target) return null;

  if (/what does .* stand for/i.test(questionText)) {
    return `${target} is the correct expansion for this abbreviation.`;
  }
  if (/what is the common name for/i.test(questionText)) {
    const stem = normalizeWhitespace(questionText.replace(/^what is the common name for/i, '').replace(/[?.]$/g, ''));
    return `${target} is the common name for ${stem}.`;
  }
  if (/what is the technical term for/i.test(questionText)) {
    const stem = normalizeWhitespace(questionText.replace(/^what is the technical term for/i, '').replace(/[?.]$/g, ''));
    return `${target} is the technical term for ${stem}.`;
  }
  if (/what is the name of/i.test(questionText)) {
    const stem = normalizeWhitespace(questionText.replace(/^what is the name of/i, '').replace(/[?.]$/g, ''));
    return `${target} is the name of ${stem}.`;
  }
  if (/which (?:circuit type|earthing system|type of circuit|cable type)/i.test(questionText)) {
    return `${target} is the correct technical answer for this question.`;
  }
  if (/what is the standard conductor size used for/i.test(questionText)) {
    const stem = normalizeWhitespace(questionText.replace(/^what is the standard conductor size used for/i, '').replace(/[?.]$/g, ''));
    return `${target} is the standard conductor size used for ${stem}.`;
  }
  if (/what is the legal status of/i.test(questionText)) {
    const stem = normalizeWhitespace(questionText.replace(/^what is the legal status of/i, '').replace(/[?.]$/g, ''));
    return `${stem} is ${target.toLowerCase()}.`;
  }
  if (/what is the decimal value of|as a decimal/i.test(questionText) && /^[0-9.]+$/.test(target)) {
    return `The decimal value here is ${target}.`;
  }
  return null;
}

function ensureTeachBeforeTestCoverage(step: DynamicGuidedV2Step): DynamicGuidedV2Step {
  if (step.stage !== 'teach_check' || !step.basicQuestions?.length) return step;

  const existingAnchorText = joinedAnchors(step).toLowerCase();
  const injectedFacts = step.basicQuestions
    .map((question) => buildTeachingAnchorFromQuestion(question))
    .filter((item): item is string => Boolean(item))
    .filter((item) => !existingAnchorText.includes(item.toLowerCase()));

  if (injectedFacts.length === 0) return step;

  return {
    ...step,
    anchorFacts: unique([...(step.anchorFacts ?? []), ...injectedFacts]).slice(0, 8),
  };
}

function reduceRedundantBasicQuestions(
  step: DynamicGuidedV2Step
): DynamicGuidedV2BasicQuestion[] {
  const questions = (step.basicQuestions ?? []).map((question) => ({
    ...question,
    answerGuidance: unique((question.answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean)),
  }));
  const targetMap = new Map<string, number[]>();
  questions.forEach((question, index) => {
    if (question.answerGuidance.length !== 1) return;
    const target = question.answerGuidance[0].toLowerCase();
    const existing = targetMap.get(target) ?? [];
    existing.push(index);
    targetMap.set(target, existing);
  });

  const microDupes = targetMap.get('micro-generation') ?? [];
  if (microDupes.length > 1) {
    const rewriteIndex = microDupes[microDupes.length - 1];
    questions[rewriteIndex] = {
      questionText: 'What word describes a supply model that produces power at many local points instead of one central station?',
      answerGuidance: ['Decentralized', 'Decentralised'],
    };
  }

  return questions;
}

function normalizeStepHint(step: DynamicGuidedV2Step): string | undefined {
  const hint = normalizeWhitespace(step.hint);
  if (!hint) return undefined;
  if (
    step.stage === 'integrative' &&
    /name the generation method first/i.test(hint) &&
    !(step.answerGuidance ?? []).some((item) => /\bwind\b|\bgas\b|\bnuclear\b|\bhydro\b|\bbiomass\b|\bwave\b|\bphotovoltaic\b/i.test(item))
  ) {
    return 'Focus on why high voltage reduces current and heat loss over long distances.';
  }
  return hint;
}

function findQuestionGuidanceCategoryMismatch(step: DynamicGuidedV2Step): string | null {
  const questionText = normalizeWhitespace(step.questionText);
  const answerGuidance = sanitizeSingleBoxGuidance(step.answerGuidance ?? []);
  if (!questionText || answerGuidance.length === 0 || looksLikeExplanationPrompt(questionText)) {
    return null;
  }

  const expectedLabel = extractQuestionTargetLabel(questionText);
  if (!expectedLabel) return null;

  const matching = answerGuidance.filter((item) => classifyTargetLabel(item) === expectedLabel);
  if (matching.length > 0) return null;

  return `${step.title} answer guidance does not match the type of answer requested by the question.`;
}

function normalizeRuntimeStep(
  step: DynamicGuidedV2Step,
  planning?: DynamicPlanningPhaseOutput
): DynamicGuidedV2Step {
  const normalizedStep: DynamicGuidedV2Step = { ...step };

  if (normalizedStep.stage === 'intro' && normalizedStep.retrievalText) {
    normalizedStep.retrievalText = strengthenIntroRetrievalText(normalizedStep.retrievalText, planning);
  }

  if (normalizedStep.stage === 'teach_check') {
    normalizedStep.basicQuestions = reduceRedundantBasicQuestions({
      ...normalizedStep,
      basicQuestions: (normalizedStep.basicQuestions ?? []).map((question) => {
        const packet = buildCanonicalAnswerPacket(question.questionText, question.answerGuidance ?? [], {
          terms: (normalizedStep.keyTerms ?? []).map((term) => ({
            term,
            simpleDefinition: '',
            anchor: '',
          })),
          anchorPhrases: normalizedStep.anchorFacts ?? [],
          misconceptionTargets: normalizedStep.misconceptionsToWatch ?? [],
        });
        if (packet?.acceptedVariants.length) {
          return {
            ...question,
            answerGuidance: packet.acceptedVariants,
          };
        }
        return {
          ...question,
          answerGuidance: unique((question.answerGuidance ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean)),
        };
      }),
    });
    const normalizedDeeper = normalizeDeeperQuestion(normalizedStep.deeperQuestionText, normalizedStep.deeperAnswerGuidance);
    normalizedStep.deeperQuestionText = normalizedDeeper.questionText;
    normalizedStep.deeperQuestionMode = normalizedStep.deeperQuestionMode ?? inferDeeperQuestionMode(normalizedDeeper.questionText);
    normalizedStep.deeperAnswerGuidance = normalizedDeeper.answerGuidance;
    return ensureTeachBeforeTestCoverage(normalizedStep);
  }

  if (
    normalizedStep.stage === 'guided_practice' ||
    normalizedStep.stage === 'practice' ||
    normalizedStep.stage === 'integrative'
  ) {
    const rawQuestion = normalizeWhitespace(normalizedStep.questionText);
    const rawHint = normalizeWhitespace(normalizedStep.hint);
    if (
      /\b50A?\b/i.test(rawQuestion) &&
      /\b9\.?2\b/.test(rawHint) &&
      (/\b1\.25\b/.test(rawHint) || /\b125%\b/.test(rawHint)) &&
      (/\b230\b/.test(rawHint) || /\bP\s*\/\s*V\b/i.test(rawHint))
    ) {
      normalizedStep.questionText = 'Calculate the final design current in Amps for this motor circuit.';
      normalizedStep.answerGuidance = unique(['50', '50A', '9200 / 230 = 40', '40 * 1.25 = 50']);
      normalizedStep.taskSkeleton = {
        ...normalizedStep.taskSkeleton,
        scenario:
          'A motor has a power rating of 9.2kW and operates on a 230V supply. The design current must be calculated at 125% of the full load current.',
      };
    }
    const seededCalculationStep = normalizeCalculationApplyStep(normalizedStep);
    normalizedStep.questionText = seededCalculationStep.questionText;
    normalizedStep.answerGuidance = seededCalculationStep.answerGuidance;
    normalizedStep.taskSkeleton = seededCalculationStep.taskSkeleton;
    const normalizedTask = normalizeSingleMarkableTask(
      normalizedStep.stage,
      normalizedStep.questionText ?? '',
      normalizedStep.answerGuidance ?? []
    );
    normalizedStep.questionText = normalizedTask.questionText;
    normalizedStep.answerGuidance = normalizedTask.answerGuidance;
    const applyBindingText = [
      normalizedStep.questionText,
      normalizedStep.questionIntent,
      normalizedStep.objective,
      normalizedStep.hint,
      ...(normalizedStep.anchorFacts ?? []).slice(0, 3),
    ]
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
      .join(' ');
    const applyPacket = buildCanonicalAnswerPacket(applyBindingText, normalizedStep.answerGuidance ?? [], {
      terms: (normalizedStep.keyTerms ?? []).map((term) => ({
        term,
        simpleDefinition: '',
        anchor: '',
      })),
      anchorPhrases: normalizedStep.anchorFacts ?? [],
      misconceptionTargets: normalizedStep.misconceptionsToWatch ?? [],
    });
    if (applyPacket?.acceptedVariants.length) {
      normalizedStep.answerGuidance = applyPacket.acceptedVariants;
    }
    const calculationNormalizedStep = normalizeCalculationApplyStep(normalizedStep);
    normalizedStep.questionText = calculationNormalizedStep.questionText;
    normalizedStep.answerGuidance = splitExplanationGuidancePoints(calculationNormalizedStep.answerGuidance ?? []);
    normalizedStep.taskSkeleton = calculationNormalizedStep.taskSkeleton;
  }

  normalizedStep.hint = normalizeStepHint(normalizedStep);

  return normalizeWorkedExampleStep(normalizedStep);
}

function buildStepLocalVocabulary(step: DynamicGuidedV2Step): DynamicVocabularyPhaseOutput {
  const terms = unique([...(step.keyTerms ?? []), ...extractNamedEntities(joinedAnchors(step))])
    .map((term) => normalizeWhitespace(term))
    .filter(Boolean)
    .map((term) => ({
      term,
      simpleDefinition: '',
      anchor: '',
    }));
  return {
    terms,
    anchorPhrases: step.anchorFacts ?? [],
    misconceptionTargets: step.misconceptionsToWatch ?? [],
  };
}

function extractExpansionFromStepContext(questionText: string, step: DynamicGuidedV2Step): string | null {
  if (!questionRequiresNarrowExpansion(questionText)) return null;
  const entities = extractNamedEntities(questionText).filter((entity) => /^[A-Z0-9-]{2,}$/i.test(entity));
  if (entities.length === 0) return null;
  const acronym = entities[0].toUpperCase();
  const contextLines = [
    ...(step.anchorFacts ?? []),
    ...(step.keyIdeas ?? []),
    ...(step.retrievalText ? step.retrievalText.split('\n') : []),
  ]
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  for (const line of contextLines) {
    const explicitStandFor = line.match(new RegExp(`\\b${acronym}\\b\\s+stands\\s+for\\s+([^.;]+)`, 'i'));
    if (explicitStandFor?.[1]) {
      return normalizeWhitespace(explicitStandFor[1]);
    }
    const bracketed = line.match(new RegExp(`([^.;()]{3,})\\s*\\(\\s*${acronym}\\s*\\)`, 'i'));
    if (bracketed?.[1]) {
      return normalizeWhitespace(bracketed[1]);
    }
    if (phraseMatchesAcronym(acronym, line)) {
      return cleanExpansionPhrase(line, acronym);
    }
  }

  const matchingKeyTerm = (step.keyTerms ?? []).find((term) => phraseMatchesAcronym(acronym, term));
  return matchingKeyTerm ? cleanExpansionPhrase(matchingKeyTerm, acronym) : null;
}

function selectCategoryMatchedAnswer(
  questionText: string,
  step: DynamicGuidedV2Step,
  answerGuidance: string[]
): string[] | null {
  const expectedLabel = extractQuestionTargetLabel(questionText);
  if (!expectedLabel) return null;
  const candidatePool = unique([
    ...sanitizeSingleBoxGuidance(answerGuidance),
    ...(step.keyTerms ?? []).map((item) => normalizeWhitespace(item)),
    ...extractNamedEntities(joinedAnchors(step)),
  ]).filter(Boolean);
  const matching = candidatePool.filter((item) => classifyTargetLabel(item) === expectedLabel);
  if (matching.length === 0) return null;
  return buildSingleExpectationGuidance([matching[0]]);
}

function repairQuestionGuidancePair(
  step: DynamicGuidedV2Step,
  questionText: string,
  answerGuidance: string[]
): string[] {
  const normalizedQuestion = normalizeWhitespace(questionText);
  const bindingText = [
    normalizedQuestion,
    normalizeWhitespace(step.questionIntent),
    normalizeWhitespace(step.objective),
    normalizeWhitespace(step.title),
    ...(step.anchorFacts ?? []).slice(0, 4),
  ]
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .join(' ');
  const localVocabulary = buildStepLocalVocabulary(step);
  const contextExpansion = extractExpansionFromStepContext(bindingText, step);
  if (contextExpansion) {
    return buildSingleExpectationGuidance([contextExpansion]);
  }

  const packet = buildCanonicalAnswerPacket(bindingText, answerGuidance, localVocabulary);
  if (packet?.acceptedVariants.length) {
    const expectedLabel = extractQuestionTargetLabel(normalizedQuestion);
    const canonicalLabel = packet.canonicalAnswer ? classifyTargetLabel(packet.canonicalAnswer) : null;
    if (expectedLabel && canonicalLabel && canonicalLabel !== expectedLabel) {
      const categoryMatched = selectCategoryMatchedAnswer(normalizedQuestion, step, answerGuidance);
      if (categoryMatched) {
        return categoryMatched;
      }
    }
    return packet.questionType === 'short_explanation' || packet.questionType === 'path_explanation'
      ? packet.conceptPoints
      : packet.acceptedVariants;
  }

  const categoryMatched = selectCategoryMatchedAnswer(normalizedQuestion, step, answerGuidance);
  if (categoryMatched) {
    return categoryMatched;
  }

  return sanitizeSingleBoxGuidance(answerGuidance);
}

function buildConcreteLateTask(
  step: DynamicGuidedV2Step
): Pick<DynamicGuidedV2Step, 'questionText' | 'answerGuidance' | 'taskSkeleton'> {
  const targetSource = [
    ...(step.answerGuidance ?? []),
    ...(step.keyTerms ?? []),
    ...extractNamedEntities(joinedAnchors(step)),
  ]
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean);
  const primaryTarget = targetSource[0] ?? normalizeWhitespace(step.objective) ?? normalizeWhitespace(step.title);
  const targetLabel = classifyTargetLabel(primaryTarget);
  const questionText = looksLikeExplanationPrompt(step.questionText)
    ? normalizeWhitespace(step.questionText ?? '')
    : step.stage === 'integrative'
      ? `Using one short explanation, explain why ${primaryTarget} is the correct ${targetLabel} in this scenario.`
      : `Using the scenario only, identify the single best ${targetLabel}.`;
  const answerGuidance =
    step.stage === 'integrative'
      ? compactConceptPoints(step.answerGuidance ?? [primaryTarget], 4)
      : buildSingleExpectationGuidance([primaryTarget]);
  return {
    questionText,
    answerGuidance,
    taskSkeleton: {
      ...(step.taskSkeleton ?? {}),
      requiredOutputs: answerGuidance,
    },
  };
}

function repairLateStageStep(step: DynamicGuidedV2Step): DynamicGuidedV2Step {
  const normalizedQuestion = normalizeWhitespace(step.questionText);
  const normalizedGuidance = sanitizeSingleBoxGuidance(step.answerGuidance ?? []);
  const repairedGuidance = repairQuestionGuidancePair(step, normalizedQuestion, normalizedGuidance);
  const genericOrWeak =
    !normalizedQuestion ||
    normalizedGuidance.length === 0 ||
    containsPlaceholderLanguage(normalizedQuestion) ||
    containsPlaceholderLanguage(joinedAnchors(step)) ||
    Boolean(findQuestionGuidanceCategoryMismatch({ ...step, questionText: normalizedQuestion, answerGuidance: repairedGuidance })) ||
    isHardToMarkOpenEndedTask(normalizedQuestion, repairedGuidance);

  if (!genericOrWeak) {
    return {
      ...step,
      questionText: normalizedQuestion,
      answerGuidance: step.stage === 'integrative' ? compactConceptPoints(repairedGuidance, 4) : repairedGuidance,
      taskSkeleton: {
        ...(step.taskSkeleton ?? {}),
        requiredOutputs: repairedGuidance,
      },
    };
  }

  const rebuilt = buildConcreteLateTask(step);
  return {
    ...step,
    ...rebuilt,
  };
}

function stabilizeLessonForScoring(
  lesson: DynamicGuidedV2Lesson,
  planning?: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  return {
    ...lesson,
    steps: lesson.steps.map((step) => {
      const normalized = normalizeRuntimeStep(step, planning);
      if (normalized.stage === 'teach_check') {
        return {
          ...normalized,
          basicQuestions: (normalized.basicQuestions ?? []).map((question) => ({
            ...question,
            answerGuidance: repairQuestionGuidancePair(normalized, question.questionText, question.answerGuidance ?? []),
          })),
          deeperAnswerGuidance: normalizeDeeperQuestion(
            normalized.deeperQuestionText,
            repairQuestionGuidancePair(
              normalized,
              normalizeWhitespace(normalized.deeperQuestionText) || normalizeWhitespace(normalized.questionIntent),
              normalized.deeperAnswerGuidance ?? []
            )
          ).answerGuidance,
        };
      }

      if (
        normalized.stage === 'guided_practice' ||
        normalized.stage === 'practice' ||
        normalized.stage === 'integrative'
      ) {
        return repairLateStageStep(normalized);
      }

      return normalized;
    }),
  };
}

function stripDynamicLessonAnswers(lesson: DynamicGuidedV2Lesson): DynamicGuidedV2Lesson {
  if (lesson.comparisonSource !== 'dynamic_generator') return lesson;

  return {
    ...lesson,
    steps: lesson.steps.map((step) => ({
      ...step,
      basicQuestions: step.basicQuestions?.map((question) => ({
        questionText: question.questionText,
      })),
      answerGuidance: undefined,
      deeperAnswerGuidance: undefined,
      taskSkeleton: step.taskSkeleton
        ? {
            ...step.taskSkeleton,
            requiredOutputs: undefined,
          }
        : undefined,
    })),
  };
}

function preservesLessonStructure(base: DynamicGuidedV2Lesson, candidate: DynamicGuidedV2Lesson): boolean {
  if (base.steps.length !== candidate.steps.length) return false;
  return base.steps.every((step, index) => {
    const other = candidate.steps[index];
    return (
      step.id === other?.id &&
      step.stage === other?.stage &&
      step.role === other?.role &&
      step.progressionRule === other?.progressionRule &&
      step.completionMode === other?.completionMode &&
      step.nextStepId === other?.nextStepId
    );
  });
}

function toAnchorFacts(lines: string[] | undefined, limit = 6): string[] {
  return unique((lines ?? []).map((line) => normalizeWhitespace(line)).filter(Boolean)).slice(0, limit);
}

function buildAuthoredExplanationLines(
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined
): string[] {
  if (!explanation) return [];
  const teachingPoints = unique((explanation.teachingPoints ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  const fallbackLines = unique((explanation.retrievalTextLines ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  if (teachingPoints.length === 0) return fallbackLines;
  return unique([
    ...teachingPoints,
    ...fallbackLines.filter((line) => !teachingPoints.includes(line)),
  ]);
}

function deriveTeachingPointIds(
  explanation: DynamicExplanationPhaseOutput['teachChecks'][number] | undefined,
  questionText: string,
  answerGuidance: string[]
): string[] {
  if (!explanation) return [];
  const teachingPoints = explanation.teachingPoints ?? [];
  const joined = normalizeWhitespace(`${questionText} ${answerGuidance.join(' ')}`).toLowerCase();
  const matches = teachingPoints
    .map((point, index) => ({ point: normalizeWhitespace(point).toLowerCase(), id: `TP${index + 1}` }))
    .filter(({ point }) => point && point.split(/\s+/).some((token) => token.length > 3 && joined.includes(token)))
    .map(({ id }) => id);
  return unique(matches).slice(0, 3);
}

function buildChunkConstraints(planning: DynamicPlanningPhaseOutput, extra: string[] = []): string[] {
  return unique(
    [
      ...planning.constraints.slice(0, 3),
      ...planning.outOfScope.slice(0, 2).map((item) => `Do not drift into: ${item}`),
      ...extra,
    ]
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
  ).slice(0, 6);
}

function buildChunkMisconceptions(
  planningChunk: DynamicPlanningPhaseOutput['teachChecks'][number] | undefined,
  hint?: string
): string[] {
  return unique(
    [
      ...(planningChunk?.misconceptions ?? []),
      normalizeWhitespace(hint),
    ].filter(Boolean)
  ).slice(0, 4);
}

function buildLessonKeyTerms(vocabulary: DynamicVocabularyPhaseOutput): string[] {
  return unique(
    vocabulary.terms
      .map((term) => normalizeWhitespace(term.term))
      .filter(Boolean)
  ).slice(0, 12);
}

function buildLessonKeyIdeas(planning: DynamicPlanningPhaseOutput): string[] {
  return unique(
    [
      planning.lessonAim,
      ...planning.teachChecks.flatMap((teachCheck) => [teachCheck.conceptFocus, teachCheck.whyItMatters]),
      ...planning.inScope,
    ]
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
  ).slice(0, 10);
}

function buildStepKeyTermsFromText(
  textParts: string[],
  vocabulary: DynamicVocabularyPhaseOutput,
  fallbackTerms: string[] = []
): string[] {
  const joined = normalizeWhitespace(textParts.join(' ').toLowerCase());
  const matches = vocabulary.terms
    .map((term) => normalizeWhitespace(term.term))
    .filter((term) => term && joined.includes(term.toLowerCase()));
  return unique([...matches, ...fallbackTerms.map((term) => normalizeWhitespace(term)).filter(Boolean)]).slice(0, 6);
}

function buildStepKeyIdeas(...groups: Array<(string | undefined)[] | undefined>): string[] {
  return unique(
    groups
      .flatMap((group) => group ?? [])
      .map((item) => normalizeWhitespace(item ?? ''))
      .filter(Boolean)
  ).slice(0, 6);
}

function isMeasurementInstrumentLesson(lesson: Pick<DynamicGuidedV2Lesson, 'title' | 'keyTerms'>): boolean {
  return /measuring electrical quantities|appropriate instruments/i.test(lesson.title) ||
    (lesson.keyTerms ?? []).some((term) =>
      /\b(?:ammeter|voltmeter|ohmmeter|wattmeter|energy meter|kwh meter)\b/i.test(term)
    );
}

function cleanMeasurementKeyTerms(terms: string[]): string[] {
  return unique(
    terms
      .map((term) => normalizeWhitespace(term).replace(/^(?:a|an|the)\s+/i, ''))
      .filter(Boolean)
  );
}

function normalizeMeasurementBasicQuestion(question: DynamicGuidedV2BasicQuestion): DynamicGuidedV2BasicQuestion {
  const text = normalizeWhitespace(question.questionText);
  if (!text) return question;

  const normalizedUnitGuidance = normalizeUnitQuestionGuidance(text, question.answerGuidance);
  if (normalizedUnitGuidance) {
    return { ...question, answerGuidance: normalizedUnitGuidance };
  }

  if (/\btechnical term\b|\bwhich electrical quantity\b|\bwhat quantity\b/i.test(text)) {
    if (/\belectrical pressure\b|\bpotential difference\b|\bvoltage\b/i.test(text)) {
      return { ...question, answerGuidance: ['Voltage', 'Potential Difference'] };
    }
    if (/\brate of flow\b|\bflow of electrical charge\b|\bcurrent\b/i.test(text)) {
      return { ...question, answerGuidance: ['Current'] };
    }
    if (/\bopposition to current flow\b|\bresistance\b/i.test(text)) {
      return { ...question, answerGuidance: ['Resistance'] };
    }
    if (/\binstantaneous\b|\brate of power\b|\bwatts\b/i.test(text)) {
      return { ...question, answerGuidance: ['Power'] };
    }
    if (/\benergy\b|\bover a period of time\b|\bbilling\b/i.test(text)) {
      return { ...question, answerGuidance: ['Energy'] };
    }
  }

  if (/\bhigh internal resistance\b|\bprevent it from shorting the circuit\b/i.test(text)) {
    return { ...question, answerGuidance: ['Voltmeter'] };
  }
  if (/\blow internal resistance\b/i.test(text)) {
    return { ...question, answerGuidance: ['Ammeter'] };
  }

  if (/\binstrument\b.*\bpotential difference\b|\bpotential difference\b.*\binstrument\b|\bmeasure electrical potential difference\b/i.test(text)) {
    return { ...question, answerGuidance: ['Voltmeter'] };
  }
  if (/\binstrument\b.*\bflow of electrical charge\b|\bflow of electrical charge\b.*\binstrument\b|\bmeasure current\b/i.test(text)) {
    return { ...question, answerGuidance: ['Ammeter'] };
  }
  if (/\binstrument\b.*\bopposition to current flow\b|\bmeasure resistance\b|\bopposition to current flow\b.*\binstrument\b/i.test(text)) {
    return { ...question, answerGuidance: ['Ohmmeter'] };
  }
  if (/\binsulation\b|\bplastic coating\b|\bir tester\b/i.test(text)) {
    return { ...question, answerGuidance: ['Insulation Resistance Tester', 'IR Tester'] };
  }
  if (/\bcontinuity\b|\bunbroken path\b/i.test(text)) {
    return { ...question, answerGuidance: ['Continuity testing', 'Continuity'] };
  }
  if (/\binstantaneous\b|\brate of power\b|\bwatts\b/i.test(text)) {
    return { ...question, answerGuidance: ['Wattmeter'] };
  }
  if (/\benergy\b|\bover a period of time\b|\bover 24 hours\b|\bbilling\b|\bover a month\b|\btotal work done\b/i.test(text)) {
    return { ...question, answerGuidance: ['Energy Meter', 'kWh meter', 'Kilowatt-hour meter'] };
  }
  return question;
}

function stabilizeMeasurementInstrumentLesson(lesson: DynamicGuidedV2Lesson): DynamicGuidedV2Lesson {
  if (!isMeasurementInstrumentLesson(lesson)) return lesson;

  const steps = lesson.steps.map((step) => {
    if (step.stage === 'teach_check' && /power and energy/i.test(step.title)) {
      const basicQuestions = (step.basicQuestions ?? []).map(normalizeMeasurementBasicQuestion);
      return {
        ...step,
        keyTerms: cleanMeasurementKeyTerms(step.keyTerms ?? []),
        basicQuestions,
      };
    }

    if (step.stage === 'practice') {
      return {
        ...step,
        title: 'Practice: Resistance Testing',
        objective: 'Identify the correct instrument for an isolated resistance check.',
        keyTerms: ['Ohmmeter'],
        keyIdeas: ['Apply instrument selection to one resistance-testing scenario.'],
        anchorFacts: [
          'An Ohmmeter is used to measure resistance or opposition to current flow.',
          'This test must be done on an isolated component.',
        ],
        taskSkeleton: {
          scenario: 'A technician has isolated a heating element and needs to test its resistance.',
          steps: ['Identify the specific instrument required for this resistance test.'],
          requiredOutputs: ['Ohmmeter'],
        },
        questionText: 'From the scenario, identify the specific instrument required for this resistance test.',
        answerGuidance: ['Ohmmeter', 'An ohmmeter'],
        hint: 'Resistance is measured in ohms, so use the instrument named after ohms.',
      };
    }

    if (step.stage === 'integrative') {
      return {
        ...step,
        title: 'Integrative Close: Power vs Energy Measurement',
        objective: 'Explain why total energy over time requires a different instrument from instantaneous power.',
        keyTerms: ['Energy Meter', 'kWh meter', 'Wattmeter'],
        keyIdeas: ['Energy is total use over time; power is the instantaneous rate.'],
        anchorFacts: [
          'An Energy Meter (kWh meter) measures total energy used over time.',
          'A Wattmeter measures instantaneous power only.',
        ],
        taskSkeleton: {
          scenario: 'A customer wants to know how much electricity a heater uses over 24 hours.',
          steps: ['Explain why an Energy Meter is the correct tool and why a Wattmeter is not enough on its own.'],
          requiredOutputs: ['Energy Meter', 'total energy over time', 'Wattmeter only measures instantaneous power'],
        },
        questionText:
          'Explain why an Energy Meter is the correct tool for measuring a heater’s total electricity use over 24 hours, and why a Wattmeter is not enough on its own.',
        answerGuidance: ['Energy Meter', 'total energy over time', 'Wattmeter only measures instantaneous power'],
        hint: 'Energy over time needs an Energy Meter; a Wattmeter only shows the right-now rate.',
      };
    }

    if (step.stage === 'teach_check') {
      const basicQuestions = (step.basicQuestions ?? []).map(normalizeMeasurementBasicQuestion);
      return {
        ...step,
        keyTerms: cleanMeasurementKeyTerms(step.keyTerms ?? []),
        basicQuestions,
      };
    }

    if (step.stage === 'guided_practice' || step.stage === 'practice') {
      return {
        ...step,
        keyTerms: cleanMeasurementKeyTerms(step.keyTerms ?? []),
      };
    }

    return step;
  });

  return {
    ...lesson,
    keyTerms: cleanMeasurementKeyTerms(unique([...(lesson.keyTerms ?? []), 'Ammeter', 'Voltmeter', 'Ohmmeter', 'Wattmeter', 'Energy Meter'])),
    steps,
  };
}

type PilotLessonFamily =
  | 'regulation_classification'
  | 'calculation_and_derived_value'
  | 'circuit_type_and_material_identification'
  | 'earthing_systems_and_conductor_roles'
  | 'generation_methods_and_abbreviations';

function inferPilotLessonFamily(input: DynamicLessonGenerationInput): PilotLessonFamily | null {
  switch (input.lessonCode) {
    case '203-1A':
      return 'regulation_classification';
    case '202-1A':
      return 'calculation_and_derived_value';
    case '203-3A':
      return 'circuit_type_and_material_identification';
    case '203-4A':
      return 'earthing_systems_and_conductor_roles';
    case '203-5A':
      return 'generation_methods_and_abbreviations';
    default:
      return null;
  }
}

function updateLessonStep(
  lesson: DynamicGuidedV2Lesson,
  matcher: (step: DynamicGuidedV2Step) => boolean,
  updater: (step: DynamicGuidedV2Step) => DynamicGuidedV2Step
): DynamicGuidedV2Lesson {
  return {
    ...lesson,
    steps: lesson.steps.map((step) => (matcher(step) ? updater(step) : step)),
  };
}

function question(questionText: string, answerGuidance: string[]): DynamicGuidedV2BasicQuestion {
  return { questionText, answerGuidance };
}

function applyRegulationClassificationTemplate(
  lesson: DynamicGuidedV2Lesson,
  planning: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  let nextLesson = lesson;

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'teach_check' && /^(Explanation A|Statutory Regulations|Defining Statutory Regulations)$/i.test(step.title), (step) => ({
    ...step,
    title: step.title === 'Explanation A' ? 'Defining Statutory Regulations' : step.title,
    keyIdeas: ['Statutory documents are laws that must be followed.', 'Failure to comply can lead to prosecution.'],
    questionIntent: 'Identify what statutory means and who must comply.',
    basicQuestions: [
      question('What does statutory mean in the electrical industry?', ['Required by law', 'Legally binding', 'Law']),
      question('What is one possible legal consequence of ignoring a statutory regulation?', ['Prosecution', 'Fine', 'Imprisonment']),
      question('Which groups of people in the workplace must comply with statutory regulations?', ['Employers, employees, and self-employed', 'Employers and employees', 'Employees and self-employed']),
    ],
    deeperQuestionText: 'Why is a statutory regulation treated differently from a technical guidance document?',
    deeperAnswerGuidance: ['Because it is law', 'Because it is legally binding', 'Because breach can lead to prosecution'],
    hint: 'Statutory means law, not guidance.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'teach_check' && /^(Explanation B|Non-statutory|Defining Non-Statutory Regulations)/i.test(step.title), (step) => ({
    ...step,
    title: step.title === 'Explanation B' ? 'Non-statutory Regulations and Guidance' : step.title,
    keyIdeas: ['Non-statutory documents are guidance, not law.', 'They are used to show technical compliance with legal duties.', 'Following recognised guidance helps show that safe and accepted methods were used.'],
    anchorFacts: ['BS 7671 is non-statutory guidance.', 'Following recognised guidance helps show that technical work was carried out safely and correctly.'],
    questionIntent: 'Identify non-statutory industry guidance accurately.',
    basicQuestions: [
      question('What is the legal status of BS 7671?', ['Non-statutory', 'Guidance', 'Non-statutory guidance']),
      question('What is the legal status of the On-Site Guide?', ['Non-statutory', 'Guidance', 'Non-statutory guidance']),
      question('What is the legal category of industry documents used to show you met legal duties?', ['Non-statutory', 'Non-statutory guidance']),
    ],
    deeperQuestionText: 'Why does following non-statutory guidance still matter even though it is not law?',
    deeperAnswerGuidance: ['It shows compliance', 'It proves safe working', 'It helps demonstrate legal duties were met'],
    hint: 'Non-statutory means guidance or standard, not law.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'The Statutory List', (step) => ({
    ...step,
    keyIdeas: ['Key statutory items include HASAWA, EAWR, ESQCR, PUWER, COSHH, CDM, and PPE regulations.', 'You must recognize specific statutory acronyms accurately.'],
    anchorFacts: ['HASAWA stands for Health and Safety at Work Act.', 'EAWR stands for Electricity at Work Regulations.', 'Statutory items are mandatory laws.'],
    questionIntent: 'Identify specific statutory regulations by name and acronym.',
    basicQuestions: [
      question('What does the acronym HASAWA stand for?', ['Health and Safety at Work Act', 'Health and Safety at Work etc. Act 1974', 'Health and Safety at Work Act 1974']),
      question('What does the acronym EAWR stand for?', ['Electricity at Work Regulations']),
      question('Which statutory regulation is specifically aimed at preventing injury from electrical causes?', ['EAWR', 'Electricity at Work Regulations']),
    ],
    deeperQuestionText: 'Why must electricians be able to recognise statutory acronyms such as HASAWA and EAWR instantly?',
    deeperAnswerGuidance: ['They are legal duties', 'These acronyms name the laws that govern safe work', 'Confusing them with guidance can cause legal non-compliance'],
    hint: 'HASAWA is the main workplace safety Act and EAWR is the electrical safety regulation.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'guided_practice', (step) => ({
    ...step,
    title: 'Guided Practice: HASAWA Classification',
    objective: 'Identify the legal status of HASAWA from a mixed document scenario.',
    keyTerms: ['HASAWA', 'Statutory'],
    keyIdeas: ['Acts of Parliament are statutory laws.'],
    anchorFacts: ['HASAWA is an Act of Parliament.', 'Acts of Parliament are statutory.'],
    taskConstraints: ['Ask for one legal classification only.', 'Do not drift into general site-safety advice.'],
    questionIntent: 'Identify the legal status of HASAWA.',
    taskSkeleton: {
      scenario: 'A site folder contains HASAWA, the On-Site Guide, and the PPE Regulations.',
      steps: [
        'Focus on the Health and Safety at Work Act (HASAWA).',
        'Decide whether it is law or guidance.',
      ],
      requiredOutputs: ['Statutory'],
    },
    questionText: 'Based on the scenario, what is the legal status of the Health and Safety at Work Act (HASAWA)?',
    answerGuidance: ['Statutory', 'Statutory regulation', 'Law'],
    hint: 'Acts of Parliament are statutory laws.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'practice', (step) => ({
    ...step,
    title: 'Practice: BS 7671 Classification',
    objective: 'Identify the legal status of BS 7671.',
    keyTerms: ['BS 7671', 'Non-statutory'],
    keyIdeas: ['BS 7671 is guidance, not an Act of Parliament.'],
    anchorFacts: ['BS 7671 is non-statutory guidance.', 'It is used to show technical compliance with legal duties.'],
    taskConstraints: ['Require the single legal classification only.', 'Do not accept broad labels such as best practice as the main answer.'],
    questionIntent: 'Identify the legal status of BS 7671.',
    taskSkeleton: {
      scenario: 'An electrician is using BS 7671 to decide how to install a circuit safely.',
      steps: [
        'Identify whether BS 7671 is a law or a technical guidance document.',
      ],
      requiredOutputs: ['Non-statutory'],
    },
    questionText: 'What is the legal status of BS 7671 in this scenario?',
    answerGuidance: ['Non-statutory', 'Guidance', 'Non-statutory guidance'],
    hint: 'BS 7671 is the industry standard, but it is not an Act of Parliament.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'integrative', (step) => ({
    ...step,
    title: 'Integrative Close: Law vs Guidance',
    objective: 'Explain the difference between one statutory item and one non-statutory item.',
    keyTerms: ['EAWR', 'BS 7671', 'Statutory', 'Non-statutory'],
    keyIdeas: ['EAWR is law; BS 7671 is guidance used to show compliance.'],
    anchorFacts: [
      'EAWR is a statutory regulation.',
      'BS 7671 is non-statutory guidance.',
      'Guidance helps prove you met the law, but it is not the law itself.',
    ],
    questionIntent: 'Explain why EAWR is statutory but BS 7671 is non-statutory.',
    taskSkeleton: {
      scenario: 'A site manager asks why EAWR can lead to prosecution while BS 7671 is used as technical guidance.',
      steps: [
        'State the legal status of EAWR.',
        'State the legal status of BS 7671.',
      ],
      requiredOutputs: ['EAWR is law', 'BS 7671 is guidance'],
    },
    questionText: 'Using one short explanation, explain why EAWR is statutory but BS 7671 is non-statutory.',
    answerGuidance: ['EAWR is a statutory law that must be followed, whereas BS 7671 is non-statutory guidance used to show compliance with that law.'],
    hint: 'One is enforced by law; the other is the technical guidance used to meet that law.',
  }));

  return {
    ...nextLesson,
    keyIdeas: [
      'Statutory regulations are laws that must be followed.',
      'Non-statutory guidance shows how to meet legal duties safely.',
      'HASAWA and EAWR are statutory; BS 7671 and the On-Site Guide are non-statutory guidance.',
    ],
    steps: nextLesson.steps.map((step) => normalizeRuntimeStep(step, planning)),
  };
}

function applyCalculationTemplate(
  lesson: DynamicGuidedV2Lesson,
  planning: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  let nextLesson = lesson;

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Fractions, Percentages, and Indices', (step) => ({
    ...step,
    keyTerms: ['Milli', 'Kilo', 'Indices', 'Percentage'],
    keyIdeas: [
      '10³ means multiply by 1000, while 10⁻³ means divide by 1000.',
      'Milli represents one thousandth, and kilo represents one thousand.',
      'Percentages are used to calculate allowed limits such as voltage drop.',
    ],
    anchorFacts: [
      '1 amp = 1000 milliamps.',
      '10³ represents kilo, which means multiply by 1000.',
      '5% of 230 volts is 11.5 volts.',
    ],
    basicQuestions: [
      question('How many milliamps are in 1 amp?', ['1000', '1000 mA']),
      question('What prefix is represented by 10³?', ['Kilo']),
      question('What is 5% of 230 volts?', ['11.5', '11.5 V', '11.5 volts']),
    ],
    deeperQuestionText: 'Why are indices and percentage calculations so important when working with electrical units and voltage-drop limits?',
    deeperAnswerGuidance: [
      'electrical units span large and small values',
      'indices help convert between units',
      'percentages are used for limits such as voltage drop',
      'site calculations depend on accurate scaling',
    ],
    hint: 'Think about converting between milli, base units, and kilo, and about using percentage limits on site.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Algebra and Transposition', (step) => ({
    ...step,
    keyTerms: ['Subject', 'Transposition', 'Inverse operation', 'Multiplication'],
    keyIdeas: [
      'Transposition means rearranging a formula to make one variable the subject.',
      'You use the inverse operation to move a multiplied value.',
      'Using the same inverse operation on both sides keeps the equation balanced.',
    ],
    anchorFacts: [
      'The subject is the variable you are solving for.',
      'If a value is multiplied, divide to move it.',
      'In V = I × R, the operation between I and R is multiplication.',
    ],
    basicQuestions: [
      question('What is the mathematical name for the variable you rearrange a formula to solve for?', ['Subject', 'The subject', 'Subject of the formula']),
      question('If a value is multiplied on one side of an equation, what inverse operation is used to move it?', ['Division', 'Divide']),
      question('In the formula V = I × R, what mathematical operation is being performed between I and R?', ['Multiplication', 'Multiply']),
    ],
    deeperQuestionText: 'Why must you use the inverse operation on both sides when transposing an electrical formula?',
    deeperAnswerGuidance: [
      'to keep the equation balanced',
      'both sides must stay equal',
      'inverse operations undo the original operation',
      'it isolates the subject correctly',
    ],
    hint: 'Transposition is about balance, not moving symbols randomly.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Statistics in Electrical Work', (step) => ({
    ...step,
    basicQuestions: [
      question('What is the technical term for the mathematical average of a set of readings?', ['Mean']),
      question('What is the technical term for the middle value in an ordered list of readings?', ['Median']),
      question('What is the technical term for the value that appears most often in a data set?', ['Mode']),
    ],
    deeperQuestionText: 'Why can the mean and the median be different when one reading is unusually high or low?',
    deeperAnswerGuidance: ['An outlier affects the mean', 'The median uses the middle value', 'One extreme reading can skew the average'],
    hint: 'Mean = average, median = middle, mode = most frequent.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Triangles and Trigonometry' || step.title === 'Trigonometry and Pythagoras', (step) => ({
    ...step,
    keyTerms: ['Impedance triangle', 'Cosine', 'Pythagoras'],
    keyIdeas: [
      'The impedance triangle is treated as right-angled, so Pythagoras applies.',
      'In SOH CAH TOA, the C stands for Cosine.',
      'Pythagoras only applies to right-angled triangles.',
    ],
    anchorFacts: [
      'Impedance uses R² + X² = Z².',
      'The C in SOH CAH TOA stands for Cosine.',
      'Pythagoras works on right-angled triangles only.',
    ],
    basicQuestions: [
      question('What formula is used for the impedance triangle?', ['R² + X² = Z²', 'Z² = R² + X²']),
      question("What does the 'C' stand for in SOH CAH TOA?", ['Cosine', 'Cos']),
      question('Does Pythagoras’ Theorem work on every triangle?', ['No', 'Right-angled triangles only']),
    ],
    deeperQuestionText: 'Why is the impedance triangle treated as a right-angled triangle in electrical calculations?',
    deeperAnswerGuidance: ['Because resistance and reactance form perpendicular sides', 'Because Pythagoras applies to the impedance triangle', 'Because it is a right-angled relationship'],
    hint: 'SOH CAH TOA is for right-angled triangles, and C means Cosine.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'guided_practice', (step) => ({
    ...step,
    title: 'Guided Practice: Transposing for Resistance',
    objective: 'Use the transposed power formula to calculate resistance.',
    keyTerms: ['Transposition', 'Resistance', 'Watts', 'Volts'],
    keyIdeas: ['Rearrange the formula first, then substitute the values.', 'P = VI can become P = V² / R by substituting I = V / R.'],
    anchorFacts: ['Use R = V² / P when voltage and power are known.', 'The combined formula comes from substituting I = V / R into P = VI.'],
    taskConstraints: ['Guide the learner through transposing the power formula to find resistance.', 'Show that P = V² / R comes from substituting I = V / R into P = VI.'],
    questionIntent: 'Calculate resistance from voltage and power.',
    taskSkeleton: {
      scenario: 'A heating element operates at 230V and is rated at 1150W.',
      steps: ['Rearrange the power formula to make resistance the subject.', 'Substitute the values and calculate the resistance.'],
      requiredOutputs: ['46', '46 Ohms', '230² / 1150 = 46'],
    },
    questionText: 'Calculate the resistance in Ohms for this heating element.',
    answerGuidance: ['46', '46 Ohms', '230² / 1150 = 46'],
    hint: 'Use R = V² / P.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'practice', (step) => ({
    ...step,
    title: 'Practice: Impedance Calculation',
    objective: 'Apply Pythagoras to calculate total impedance.',
    keyTerms: ['Impedance', 'Resistance', 'Reactance'],
    keyIdeas: ['Use R² + X² = Z² for the impedance triangle.'],
    anchorFacts: ['The impedance triangle is right-angled, so Pythagoras applies.'],
    taskConstraints: ['Require one impedance calculation only.', 'Use electrical notation R, X, and Z in the explanation and answer.'],
    questionIntent: 'Calculate impedance from resistance and reactance.',
    taskSkeleton: {
      scenario: 'An AC circuit has a resistance of 12 Ohms and a reactance of 5 Ohms.',
      steps: ['Square both known sides.', 'Add them together.', 'Take the square root to find impedance.'],
      requiredOutputs: ['13', '13 Ohms', '12² + 5² = 169', '√169 = 13'],
    },
    questionText: 'Calculate the total impedance (Z) in Ohms for this circuit.',
    answerGuidance: ['13', '13 Ohms', '12² + 5² = 169', '√169 = 13'],
    hint: 'Use R² + X² = Z².',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'integrative', (step) => ({
    ...step,
    title: 'Integrative Close: Motor Current',
    objective: 'Calculate full-load current and design current from one motor scenario.',
    keyTerms: ['Power', 'Voltage', 'Current', 'Design current'],
    keyIdeas: ['First calculate current with I = P / V, then apply the 125% factor.'],
    anchorFacts: ['9.2kW = 9200W.', '9200 / 230 = 40A.', '40A × 1.25 = 50A.'],
    taskConstraints: ['Require the learner to calculate full-load current first, then apply the 125% design factor.', 'Mark the final design current, but keep the intermediate current available for feedback.'],
    questionIntent: 'Calculate the final design current in Amps.',
    taskSkeleton: {
      scenario: 'A motor has a power rating of 9.2kW and operates on a 230V supply. The design current must be calculated at 125% of the full load current.',
      steps: ['Convert 9.2kW to 9200W.', 'Calculate full-load current using I = P / V.', 'Multiply the result by 1.25 to find design current.'],
      requiredOutputs: ['50', '50A', '9200 / 230 = 40', '40 * 1.25 = 50'],
    },
    questionText: 'Calculate the final design current in Amps for this motor circuit.',
    answerGuidance: ['50', '50A', '9200 / 230 = 40', '40 * 1.25 = 50'],
    hint: 'Work out the full-load current first, then apply 125%.',
  }));

  return {
    ...nextLesson,
    steps: nextLesson.steps.map((step) => normalizeRuntimeStep(step, planning)),
  };
}

function applyCircuitAndMaterialTemplate(
  lesson: DynamicGuidedV2Lesson,
  planning: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  let nextLesson = lesson;

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Lighting and Power Circuits' || step.title === 'Lighting and Power/Heating Circuits', (step) => ({
    ...step,
    keyIdeas: ['Lighting circuits supply luminaires and lower-current loads.', 'Points of utilization are the sockets or appliances where electrical power is actually used.', 'A distribution circuit carries power from one distribution board to another.'],
    anchorFacts: ['Points of utilization means the outlets or equipment where power is used.', 'Distribution circuits carry power between distribution boards rather than directly to the final load.'],
    basicQuestions: [
      question('What type of circuit normally supplies luminaires and lower current loads?', ['Lighting circuit']),
      question('What technical term is used for the sockets or appliances where electrical power is used?', ['Points of utilization', 'Point of utilization']),
      question('What is the name of the circuit that carries power between distribution boards?', ['Distribution circuit']),
    ],
    deeperQuestionText: 'Why are lighting circuits kept separate from power or heating circuits?',
    deeperAnswerGuidance: ['Different load demands', 'To prevent overload on lighting cables', 'To keep installations safe and practical'],
    hint: 'Think about load size and what happens if heating loads share small lighting cables.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Principles of Circuit Operation' || step.title === 'General Circuit Operation', (step) => ({
    ...step,
    title: step.title === 'General Circuit Operation' ? 'General Circuit Operation' : step.title,
    keyIdeas: ['A circuit must have a complete path before current can flow.', 'Point-to-point wiring runs directly from one point to the next in sequence.', 'Circuit isolation allows one section to be disconnected safely for maintenance.'],
    anchorFacts: ['No complete path means no current flow.', 'Point-to-point wiring describes a direct sequence from one outlet to the next.', 'Isolation prevents accidental energisation during work.'],
    basicQuestions: [
      question('What must a circuit have before current can flow?', ['A complete path', 'A complete circuit']),
      question('What does circuit isolation allow an electrician to do safely?', ['Disconnect one section safely', 'Work on one circuit safely']),
      question('What term describes wiring that runs directly from one outlet to the next in a sequence?', ['Point-to-point']),
    ],
    deeperQuestionText: 'Why is circuit isolation important during maintenance?',
    deeperAnswerGuidance: ['It allows safe working', 'It lets one section be isolated without shutting everything down', 'It prevents accidental energisation'],
    hint: 'Isolation is about safe maintenance, not just turning something off.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Ring and Radial Circuits', (step) => ({
    ...step,
    basicQuestions: [
      question('Which circuit type ends at the final outlet rather than returning to the consumer unit?', ['Radial Circuit', 'Radial']),
      question('How many paths does electricity have to reach a socket in a ring final circuit?', ['Two', '2', 'Two paths']),
      question('What is the standard conductor size used for a 32A ring final circuit?', ['2.5mm²', '2.5mm', '2.5 millimetres squared']),
    ],
    deeperQuestionText: 'Why is a single break in a ring final circuit considered dangerous even if sockets still appear to work?',
    deeperAnswerGuidance: ['Current is no longer shared between two paths', 'One conductor can be overloaded', 'The remaining path may overheat before protection operates'],
    hint: 'Radial ends at the last point; ring returns to the consumer unit and gives two paths.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Emergency and Alarm Circuits', (step) => ({
    ...step,
    basicQuestions: [
      question('What term describes the requirement for safety circuits to continue functioning during a fire?', ['Circuit Integrity']),
      question('What does the abbreviation MICC stand for?', ['Mineral Insulated Copper Clad']),
      question('What material is used as the insulation inside a MICC cable?', ['Magnesium Oxide', 'Mineral powder', 'Magnesium Oxide powder']),
    ],
    deeperQuestionText: 'Why is MICC more suitable than ordinary thermoplastic cable for a fire alarm circuit?',
    deeperAnswerGuidance: ['It is fire resistant', 'The insulation is non-combustible mineral powder', 'It maintains circuit integrity during a fire'],
    hint: 'MICC uses mineral insulation and is chosen when the circuit must keep working in a fire.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Control, Data, and Alarm Circuits', (step) => ({
    ...step,
    basicQuestions: [
      question('What type of circuit uses a low-voltage signal to control another piece of equipment?', ['Control circuit']),
      question('What is the technical term for electrical noise that can corrupt data cables?', ['EMI', 'Electromagnetic Interference']),
      question('What cable type is used for fire alarm circuits because it survives fire?', ['MICC', 'Mineral Insulated Copper Clad']),
    ],
    deeperQuestionText: 'Why must data cables be kept physically separate from standard mains power wiring?',
    deeperAnswerGuidance: ['To avoid EMI', 'To prevent data corruption', 'Because nearby power cables create electrical noise'],
    hint: 'Control = signal, data = information, MICC = fire-resistant alarm cable.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Wiring Systems by Environment', (step) => ({
    ...step,
    basicQuestions: [
      question('What is the common name for the PVC/PVC flat profile cable used in domestic installations?', ['Twin and Earth']),
      question('Which cable type uses steel wire to protect it from mechanical damage in industrial environments?', ['SWA', 'Steel Wire Armoured']),
      question('What type of wiring system is used in a hazardous area to contain a spark or explosion?', ['Explosion-proof conduit', 'Explosion-proof system']),
    ],
    deeperQuestionText: 'Why is trunking or conduit preferred in a commercial office where layouts often change?',
    deeperAnswerGuidance: ['Allows cables to be added or changed', 'Makes alterations easier', 'Provides containment for future changes'],
    hint: 'Domestic = Twin and Earth, industrial = SWA, hazardous = explosion-proof.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'guided_practice', (step) => ({
    ...step,
    title: 'Guided Practice: Choosing the Circuit Type',
    objective: 'Identify the correct circuit type for multiple socket outlets in a commercial retail space.',
    keyTerms: ['Ring Final Circuit', '32A', 'Socket outlets'],
    keyIdeas: ['A ring final circuit is commonly used for multiple socket outlets on one 32A circuit.', 'The circuit returns to the consumer unit and gives two paths for current.'],
    anchorFacts: ['Commercial retail areas with multiple sockets often use a ring final circuit.', 'Two current paths are a feature of a ring final circuit.'],
    taskConstraints: ['Keep the scenario aligned to multiple socket outlets on a 32A circuit.', 'Require one circuit-type answer only.'],
    questionIntent: 'Identify the correct circuit type for multiple socket outlets.',
    taskSkeleton: {
      scenario: 'A commercial retail area needs multiple socket outlets on one 32A circuit.',
      steps: ['Choose the circuit type that provides two paths for current around the circuit.'],
      requiredOutputs: ['Ring Final Circuit'],
    },
    questionText: 'From the scenario, which circuit type should be selected?',
    answerGuidance: ['Ring Final Circuit', 'Ring final'],
    hint: 'Multiple sockets on a 32A circuit point to the loop arrangement.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'practice', (step) => ({
    ...step,
    title: 'Practice: Choosing the Wiring System',
    objective: 'Identify the correct wiring system for a hazardous industrial environment.',
    keyTerms: ['Explosion-proof conduit', 'Hazardous area', 'Mechanical containment'],
    keyIdeas: ['Hazardous areas need wiring systems that contain sparks.', 'Explosion-proof conduit is selected where a spark could ignite the atmosphere.'],
    anchorFacts: ['A hazardous atmosphere must not be ignited by wiring equipment.', 'Explosion-proof conduit is used to contain sparks in hazardous areas.'],
    taskConstraints: ['Require one wiring-system answer only.', 'Keep the scenario focused on spark containment in a hazardous area.'],
    questionIntent: 'Identify the correct wiring system for a hazardous atmosphere.',
    taskSkeleton: {
      scenario: 'A wiring system must contain an internal spark so it cannot ignite the surrounding atmosphere.',
      steps: ['Choose the single wiring system designed for hazardous explosive environments.'],
      requiredOutputs: ['Explosion-proof conduit'],
    },
    questionText: 'Using the scenario only, identify the single best wiring system.',
    answerGuidance: ['Explosion-proof conduit', 'Explosion-proof system'],
    hint: 'This environment needs a wiring system that contains a spark.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'integrative', (step) => ({
    ...step,
    title: 'Integrative Close: Fire Alarm Cable Choice',
    objective: 'Explain why MICC is selected for a fire alarm circuit.',
    keyTerms: ['MICC', 'Circuit Integrity', 'Fire Resistance'],
    keyIdeas: ['A fire alarm circuit must keep operating during a fire.', 'MICC is selected because its mineral insulation helps maintain circuit integrity in high heat.'],
    anchorFacts: ['MICC uses mineral insulation rather than combustible plastic insulation.', 'Circuit integrity matters because the alarm must still operate during a fire.'],
    taskConstraints: ['Keep the response to one short explanation.', 'Require MICC plus the fire-resistance reason.'],
    questionIntent: 'Explain why MICC is chosen for a fire alarm circuit.',
    taskSkeleton: {
      scenario: 'A fire alarm circuit must remain operational during a fire.',
      steps: ['Name the cable type used for this duty.', 'Explain the property that makes it suitable.'],
      requiredOutputs: ['MICC', 'fire resistant', 'maintains circuit during fire'],
    },
    questionText: 'Using one short explanation, explain why MICC is selected for a fire alarm circuit.',
    answerGuidance: ['MICC', 'fire resistant', 'maintains circuit during fire'],
    hint: 'Think about what happens to ordinary cable insulation in extreme heat.',
  }));

  return {
    ...nextLesson,
    steps: nextLesson.steps.map((step) => normalizeRuntimeStep(step, planning)),
  };
}

function applyEarthingTemplate(
  lesson: DynamicGuidedV2Lesson,
  planning: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  let nextLesson = lesson;

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Core ADS Components' || step.title === 'ADS Components Overview', (step) => ({
    ...step,
    basicQuestions: [
      question('What does ADS stand for?', ['Automatic Disconnection of Supply']),
      question('What does the abbreviation CPC stand for?', ['Circuit Protective Conductor', 'CPC']),
      question('What general term is used for the device that disconnects the supply during a fault?', ['Protective device']),
    ],
    deeperQuestionText: 'Why must the fault path have low enough resistance for ADS to work correctly?',
    deeperAnswerGuidance: ['So enough fault current flows', 'So the protective device trips quickly', 'So the supply disconnects safely'],
    hint: 'ADS needs a complete fault path and a protective device that can operate quickly.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Main and Supplementary Bonding', (step) => ({
    ...step,
    basicQuestions: [
      question('What is the technical term for the zone where accessible metalwork is kept at the same voltage?', ['Equipotential zone', 'Equipotential']),
      question('What type of parts are connected by main protective bonding, such as gas or water pipes?', ['Extraneous conductive parts']),
      question('To which terminal are bonding conductors connected?', ['MET', 'Main Earthing Terminal']),
    ],
    deeperQuestionText: 'Why does bonding not replace the CPC during a fault?',
    deeperAnswerGuidance: ['Because the CPC carries fault current', 'Bonding keeps metalwork at the same potential', 'Bonding is not the main fault path'],
    hint: 'Bonding is for equal potential; the CPC is the fault-current path.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'TT Earthing Systems', (step) => ({
    ...step,
    basicQuestions: [
      question('Which earthing system uses a local earth electrode at the installation?', ['TT']),
      question('Which protective device is usually required on a TT system because the earth path is high resistance?', ['RCD']),
      question('Who provides the earth electrode in a TT system?', ['The installation', 'The consumer', 'Local installation']),
    ],
    deeperQuestionText: 'Why does a TT system usually need an RCD instead of relying only on a fuse or MCB?',
    deeperAnswerGuidance: ['Fault current is too low', 'Earth path resistance is high', 'An RCD can trip on small imbalance current'],
    hint: 'TT relies on the local earth, so the fault path is usually higher resistance.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'TN-S and TN-C-S Systems', (step) => ({
    ...step,
    basicQuestions: [
      question('What does the letter S stand for in TN-S?', ['Separate']),
      question('What does the letter C stand for in TN-C-S?', ['Combined']),
      question('What is the technical name for the conductor that combines protective earth and neutral on the supply side?', ['PEN conductor', 'PEN', 'Protective Earth and Neutral']),
    ],
    deeperQuestionText: 'Why is TN-C-S also described as a system where neutral and earth are combined first and then separated?',
    deeperAnswerGuidance: ['Because the supply uses a PEN conductor first', 'Because earth and neutral are combined on part of the supply', 'They are separated at the service position'],
    hint: 'S = Separate, C = Combined, PEN = Protective Earth and Neutral.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'CPC and Earthing Conductor' || step.title === 'CPC vs Earthing Conductor', (step) => ({
    ...step,
    basicQuestions: [
      question('What does CPC stand for?', ['Circuit Protective Conductor', 'CPC']),
      question('What is the name of the conductor that connects the MET to the source of earth?', ['Earthing Conductor']),
      question('Which conductor connects exposed conductive parts in a circuit back to the MET?', ['CPC', 'Circuit Protective Conductor']),
    ],
    deeperQuestionText: 'Why is it important not to confuse a CPC with an earthing conductor during testing and documentation?',
    deeperAnswerGuidance: ['They have different roles', 'One protects circuits and one links the MET to earth', 'Using the wrong term causes technical errors'],
    hint: 'CPC protects the circuit; the earthing conductor links the MET to the source of earth.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'guided_practice', (step) => ({
    ...step,
    title: 'Guided Practice: Identifying TT',
    objective: 'Identify a TT system from the earthing arrangement described.',
    keyTerms: ['TT', 'Earth electrode', 'RCD'],
    keyIdeas: ['TT uses a local earth electrode.', 'The supplier does not provide the installation earth in the same way as TN systems.'],
    anchorFacts: ['A local earth rod or electrode points to TT.', 'TT often relies on an RCD because the earth path resistance is higher.'],
    taskConstraints: ['Keep the scenario focused on the local electrode and lack of supplier-provided earth.', 'Require one earthing-system answer only.'],
    questionIntent: 'Identify a TT earthing system from a local electrode arrangement.',
    taskSkeleton: {
      scenario: 'A property uses a local earth electrode and does not rely on the supply company to provide the earth path.',
      steps: ['Identify the earthing system type from the scenario.'],
      requiredOutputs: ['TT'],
    },
    questionText: 'Which earthing system is described in this scenario?',
    answerGuidance: ['TT'],
    hint: 'A local earth electrode points to TT.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'practice', (step) => ({
    ...step,
    title: 'Practice: Identifying TN-C-S',
    objective: 'Identify TN-C-S from the combined-and-separated supply arrangement.',
    keyTerms: ['TN-C-S', 'PEN conductor', 'PME'],
    keyIdeas: ['TN-C-S combines neutral and earth on part of the supply.', 'The conductor is separated into neutral and earth at the service position.'],
    anchorFacts: ['A PEN conductor means protective earth and neutral are combined.', 'TN-C-S is also known as PME.'],
    taskConstraints: ['Keep the scenario focused on combined then separated supply conductors.', 'Require one earthing-system answer only.'],
    questionIntent: 'Identify TN-C-S from a combined then separated supply arrangement.',
    taskSkeleton: {
      scenario: 'The supply neutral and earth are combined in one conductor outside the installation and separated at the service position.',
      steps: ['Identify the earthing system from the supply arrangement.'],
      requiredOutputs: ['TN-C-S'],
    },
    questionText: 'Which earthing system is described in this scenario?',
    answerGuidance: ['TN-C-S'],
    hint: 'Combined first, then separated, points to TN-C-S.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'integrative', (step) => ({
    ...step,
    title: 'Integrative Close: Why TT Uses an RCD',
    objective: 'Explain why TT systems usually need an RCD.',
    keyTerms: ['TT', 'RCD', 'Earth path resistance'],
    keyIdeas: ['TT systems rely on soil for the return path, which has much higher resistance than a metal return path.', 'High earth path resistance limits fault current, so a fuse or MCB may not trip quickly enough.', 'An RCD is used because it trips on imbalance rather than needing a large fault current.'],
    anchorFacts: ['High soil resistance means low fault current in a TT system.', 'An RCD can disconnect even when the fault current is too small for a fuse or MCB to operate quickly.'],
    taskConstraints: ['Keep the response to one short explanation.', 'Require the learner to link high resistance to low fault current and then to RCD operation.'],
    questionIntent: 'Explain why TT systems usually require an RCD.',
    taskSkeleton: {
      scenario: 'A TT installation depends on a local earth electrode and the earth path is relatively high resistance.',
      steps: ['Explain why this makes an RCD necessary.'],
      requiredOutputs: ['fault current too low', 'high resistance earth path', 'RCD trips on imbalance'],
    },
    questionText: 'Using one short explanation, explain why TT systems usually require an RCD.',
    answerGuidance: ['fault current too low', 'high resistance earth path', 'RCD trips on imbalance'],
    hint: 'The key issue is not the label TT by itself; it is the resistance of the earth return path.',
  }));

  return {
    ...nextLesson,
    steps: nextLesson.steps.map((step) => normalizeRuntimeStep(step, planning)),
  };
}

function applyGenerationMethodsTemplate(
  lesson: DynamicGuidedV2Lesson,
  planning: DynamicPlanningPhaseOutput
): DynamicGuidedV2Lesson {
  let nextLesson = lesson;

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Transmission Voltage Values', (step) => ({
    ...step,
    basicQuestions: [
      question('Name one standard UK transmission voltage.', ['400 kV', '400kV']),
      question('Name another standard UK transmission voltage.', ['275 kV', '275kV']),
      question('Name the third standard UK transmission voltage.', ['132 kV', '132kV']),
    ],
    deeperQuestionText: 'Why is 11 kV not classed as a transmission voltage in this lesson?',
    deeperAnswerGuidance: ['Because 11 kV is a distribution voltage', 'Transmission voltages are 400 kV, 275 kV, and 132 kV'],
    hint: 'Transmission voltages are the three higher values, not the distribution values.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Large-Scale Generation Methods', (step) => ({
    ...step,
    basicQuestions: [
      question('What generation method uses uranium as its fuel source?', ['Nuclear']),
      question('What generation method uses moving water to drive turbines?', ['Hydro']),
      question('What generation method uses burning organic material to produce electricity?', ['Biomass']),
    ],
    deeperQuestionText: 'Why is biomass treated as a named generation method rather than just the general idea of generation?',
    deeperAnswerGuidance: ['Because biomass is a specific fuel source', 'It is one named generation method in the range'],
    hint: 'Coal, gas, nuclear, hydro, wind, wave, biomass, and photovoltaic are distinct named methods.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'Micro-Generation and Local Supply', (step) => ({
    ...step,
    basicQuestions: [
      question('What does the abbreviation PV stand for?', ['Photovoltaic', 'Photo-voltaic', 'PV']),
      question('What term is used for small-scale local electricity production by homes or small businesses?', ['Micro-generation']),
      question('Name one common micro-generation method used on rooftops.', ['Photovoltaic', 'PV']),
    ],
    deeperQuestionText: 'How does micro-generation differ from large-scale generation connected to the grid?',
    deeperAnswerGuidance: ['It is small-scale', 'It is local', 'It is not a large central power station'],
    hint: 'PV means Photovoltaic, and micro-generation is small-scale local generation.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.title === 'The Logic of High Voltage Transmission', (step) => ({
    ...step,
    basicQuestions: [
      question('Why is electricity transmitted at very high voltage over long distances?', ['To reduce current']),
      question('Reducing current reduces what main unwanted effect in the cables?', ['Heat loss', 'Power loss']),
      question('Name one standard transmission voltage used for the National Grid.', ['400 kV', '400kV', '275 kV', '275kV', '132 kV', '132kV']),
    ],
    deeperQuestionText: 'Why does reducing current make long-distance transmission more efficient?',
    deeperAnswerGuidance: ['Less heat is produced', 'Less energy is wasted', 'Lower current means lower cable losses'],
    hint: 'High voltage is used to keep current down.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'guided_practice', (step) => ({
    ...step,
    title: 'Guided Practice: Identifying PV',
    objective: 'Identify photovoltaic generation from a local generation scenario.',
    taskSkeleton: {
      scenario: 'A home has rooftop solar panels producing electricity for local use.',
      steps: ['Identify the named generation method used in the scenario.'],
      requiredOutputs: ['Photovoltaic'],
    },
    questionText: 'What is the named generation method used in this scenario?',
    answerGuidance: ['Photovoltaic', 'Photo-voltaic', 'PV'],
    hint: 'Rooftop solar panels point to photovoltaic generation.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'practice', (step) => ({
    ...step,
    title: 'Practice: Identifying a Transmission Voltage',
    objective: 'Identify one standard UK transmission voltage.',
    taskSkeleton: {
      scenario: 'A National Grid overhead line is carrying electricity across the country before it reaches local distribution.',
      steps: ['State one standard transmission voltage used for this stage of the supply network.'],
      requiredOutputs: ['400 kV'],
    },
    questionText: 'State one standard UK transmission voltage.',
    answerGuidance: ['400 kV', '400kV', '275 kV', '275kV', '132 kV', '132kV'],
    hint: 'Use one of the three transmission values taught in the lesson.',
  }));

  nextLesson = updateLessonStep(nextLesson, (step) => step.stage === 'integrative', (step) => ({
    ...step,
    title: 'Integrative Close: Why High Voltage Is Used',
    objective: 'Explain why long-distance transmission uses very high voltage.',
    taskSkeleton: {
      scenario: 'Electricity from a large power station must travel a long distance across the transmission network.',
      steps: ['Explain why the network uses very high voltage for this journey.'],
      requiredOutputs: ['reduce current', 'reduce heat loss', 'improve efficiency'],
    },
    questionText: 'Using one short explanation, explain why electricity is transmitted at very high voltage over long distances.',
    answerGuidance: ['reduce current', 'reduce heat loss', 'improve efficiency'],
    hint: 'High voltage is not used just because it is stronger; it is used because it reduces current and losses.',
  }));

  return {
    ...nextLesson,
    steps: nextLesson.steps.map((step) => normalizeRuntimeStep(step, planning)),
  };
}

function applyPilotFamilyCompiler(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  lesson: DynamicGuidedV2Lesson
): DynamicGuidedV2Lesson {
  const family = inferPilotLessonFamily(input);
  if (!family) return lesson;

  switch (family) {
    case 'regulation_classification':
      return applyRegulationClassificationTemplate(lesson, planning);
    case 'calculation_and_derived_value':
      return applyCalculationTemplate(lesson, planning);
    case 'circuit_type_and_material_identification':
      return applyCircuitAndMaterialTemplate(lesson, planning);
    case 'earthing_systems_and_conductor_roles':
      return applyEarthingTemplate(lesson, planning);
    case 'generation_methods_and_abbreviations':
      return applyGenerationMethodsTemplate(lesson, planning);
    default:
      return lesson;
  }
}

function buildIntroStep(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  nextStepId?: string
): DynamicGuidedV2Step {
  const practicalHook = planning.teachChecks
    .map((teachCheck) => normalizeWhitespace(teachCheck.whyItMatters))
    .find(Boolean);
  return normalizeRuntimeStep({
    id: `${input.lessonCode.toLowerCase()}-intro`,
    sourceBlockId: `${input.lessonCode}-outcomes`,
    title: 'Intro',
    role: 'outcomes',
    stage: 'intro',
    progressionRule: 'auto',
    nextStepId,
    objective: planning.lessonAim || `Orient the learner to ${input.topic}.`,
    completionMode: 'continue',
    keyTerms: buildLessonKeyTerms(vocabulary).slice(0, 8),
    keyIdeas: buildLessonKeyIdeas(planning).slice(0, 5),
    anchorFacts: [
      planning.lessonAim || `This lesson focuses on ${input.topic}.`,
      practicalHook ? `Why this matters: ${practicalHook}` : '',
      ...planning.inScope.slice(0, 5),
    ].filter(Boolean),
    taskConstraints: buildChunkConstraints(planning, [
      'Introduce the lesson naturally, but do not start the first teaching chunk yet.',
    ]),
    taskSkeleton: {
      steps: planning.teachChecks.map((teachCheck) => teachCheck.title).slice(0, 6),
    },
  }, planning);
}

function buildLessonFromPhases(
  input: DynamicLessonGenerationInput,
  stagePlan: DynamicLessonStageDescriptor[],
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  explanations: DynamicExplanationPhaseOutput,
  checks: DynamicUnderstandingChecksPhaseOutput
): DynamicGuidedV2Lesson {
  const steps: DynamicGuidedV2Step[] = [];
  const teachCheckDescriptors = stagePlan.filter((step) => step.stage === 'teach_check');
  const firstTeachCheck = teachCheckDescriptors[0];
  steps.push(buildIntroStep(input, planning, vocabulary, firstTeachCheck ? `${input.lessonCode.toLowerCase()}-${firstTeachCheck.key}` : undefined));

  teachCheckDescriptors.forEach((descriptor, index) => {
    const explanation = explanations.teachChecks[index];
    const check = checks.teachChecks[index];
    const nextDescriptor = stagePlan[stagePlan.indexOf(descriptor) + 1];
    const explanationLines = buildAuthoredExplanationLines(explanation);
    const authoredBasicQuestions = (check?.basicQuestions ?? []).map((question) => ({
      ...question,
      sourceTeachingPointIds:
        question.sourceTeachingPointIds && question.sourceTeachingPointIds.length > 0
          ? question.sourceTeachingPointIds
          : deriveTeachingPointIds(explanation, question.questionText, question.answerGuidance ?? []),
    }));
    const basicQuestions = authoredBasicQuestions.map((question) => ({
      questionText: question.questionText,
      questionForm: question.questionForm,
    }));
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
      keyTerms: buildStepKeyTermsFromText(
        [
          explanation?.title || '',
          explanation?.objective || '',
          planning.teachChecks[index]?.conceptFocus || '',
          ...(explanation?.keyTerms ?? []),
          ...basicQuestions.map((question) => question.questionText),
        ],
        vocabulary,
        [...(explanation?.keyTerms ?? [])].slice(0, 6)
      ),
      keyIdeas: buildStepKeyIdeas(
        explanation?.keyIdeas,
        [planning.teachChecks[index]?.conceptFocus, planning.teachChecks[index]?.whyItMatters],
        explanationLines,
        [descriptor.objective]
      ),
      anchorFacts: toAnchorFacts(explanationLines),
      misconceptionsToWatch: buildChunkMisconceptions(
        planning.teachChecks[index],
        unique([...(explanation?.misconceptions ?? []), explanation?.hint, check?.hint].map((item) => normalizeWhitespace(item)).filter(Boolean)).join(' | ')
      ),
      taskConstraints: buildChunkConstraints(planning, [
        planning.teachChecks[index]?.conceptFocus ?? '',
        planning.teachChecks[index]?.whyItMatters ?? '',
        'Keep checks tied to the taught points from this chunk only.',
      ]),
      questionIntent: planning.teachChecks[index]?.conceptFocus || descriptor.objective,
      basicQuestions,
      deeperQuestionText: check?.deeperQuestionText,
      deeperQuestionMode: check?.deeperQuestionMode ?? inferDeeperQuestionMode(check?.deeperQuestionText ?? ''),
      deeperQuestionIntent: planning.teachChecks[index]?.whyItMatters || descriptor.objective,
      hint: explanation?.hint || check?.hint,
    });
  });

  const assembledLesson = stabilizeMeasurementInstrumentLesson({
    lessonId: `dynamic-v2-generated-${input.lessonCode.toLowerCase()}`,
    lessonCode: input.lessonCode,
    title: input.title,
    subject: input.subject,
    unit: input.unit,
    audience: input.audience,
    tonePrompt: input.tonePrompt,
    comparisonSource: 'dynamic_generator',
    artifactVersion: 'thin_guard_rails',
    keyTerms: buildLessonKeyTerms(vocabulary),
    keyIdeas: buildLessonKeyIdeas(planning),
    steps: steps.map((step) => normalizeRuntimeStep(step, planning)),
  });

  return applyPilotFamilyCompiler(input, planning, assembledLesson);
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
    solution: suggestion,
    suggestion,
    ...extras,
  };
}

function joinedAnchors(step: DynamicGuidedV2Step): string {
  return unique([
    ...(step.keyIdeas ?? []),
    ...(step.anchorFacts ?? []),
    ...(step.keyTerms ?? []),
  ].map((item) => normalizeWhitespace(item)).filter(Boolean)).join(' ');
}

function hasTeachGrounding(step: DynamicGuidedV2Step): boolean {
  if (step.retrievalText && hasSubstantiveTeachingText(step.retrievalText, 35)) return true;
  const anchorFacts = unique((step.anchorFacts ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  const keyIdeas = unique((step.keyIdeas ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  const keyTerms = unique((step.keyTerms ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  const anchorReady = anchorFacts.length >= 3 && wordCount(anchorFacts.join(' ')) >= 20 && !anchorFacts.some((item) => containsPlaceholderLanguage(item));
  const ideaReady = keyIdeas.length >= 2 && wordCount(keyIdeas.join(' ')) >= 12 && !keyIdeas.some((item) => containsPlaceholderLanguage(item));
  return anchorReady || (ideaReady && keyTerms.length >= 2);
}

function stepExcerpt(step: DynamicGuidedV2Step): string {
  return normalizeWhitespace(step.retrievalText || joinedAnchors(step) || step.questionText || step.objective).slice(0, 180);
}

function hasTaskFraming(step: DynamicGuidedV2Step): boolean {
  if (step.retrievalText && !containsPlaceholderLanguage(step.retrievalText)) return true;
  if ((step.anchorFacts?.length ?? 0) >= 1) return true;
  return Boolean(step.taskSkeleton?.scenario || step.taskSkeleton?.steps?.length);
}

function questionOnlyTaskContextIsRich(step: DynamicGuidedV2Step): boolean {
  const retrievalText = normalizeWhitespace(step.retrievalText);
  const anchorFacts = (step.anchorFacts ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
  const keyIdeas = (step.keyIdeas ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean);
  return Boolean(
    wordCount(retrievalText) >= 12 ||
    anchorFacts.length >= 2 ||
    keyIdeas.length >= 2 ||
    normalizeWhitespace(step.taskSkeleton?.scenario)
  );
}

function hasWeakQuestionOnlyStepTask(step: DynamicGuidedV2Step): boolean {
  return hasWeakQuestionOnlyTask({
    questionText: step.questionText ?? '',
    objective: step.objective,
    retrievalTextLines: step.retrievalText ? step.retrievalText.split('\n') : [],
    contextRich: questionOnlyTaskContextIsRich(step),
  });
}

function workedExampleIsStructured(step: DynamicGuidedV2Step): boolean {
  if (step.retrievalText) {
    const structure = workedExampleStructure(step.retrievalText);
    return (
      structure.lines.length >= 4 &&
      structure.stepLines.length >= 2 &&
      structure.hasResult &&
      structure.hasTakeaway &&
      wordCount(step.retrievalText) >= 35 &&
      !containsPlaceholderLanguage(step.retrievalText)
    );
  }

  const steps = unique((step.taskSkeleton?.steps ?? []).map((item) => normalizeWhitespace(item)).filter(Boolean));
  return steps.length >= 2 && Boolean(normalizeWhitespace(step.taskSkeleton?.takeaway)) && (step.anchorFacts?.length ?? 0) >= 2;
}

export function validateDynamicLesson(lesson: DynamicGuidedV2Lesson): DynamicLessonGenerationValidation {
  const issues: string[] = [];
  if (lesson.steps.length < 3) {
    issues.push('Lesson has too few steps.');
  }

  const intro = lesson.steps.find((step) => step.stage === 'intro');
  if (!intro) issues.push('Missing intro step.');

  const teachChecks = lesson.steps.filter((step) => step.stage === 'teach_check');
  if (teachChecks.length < 2) issues.push('Lesson must contain at least two teach/check steps.');
  for (const step of teachChecks) {
    if (!hasTeachGrounding(step)) {
      issues.push(`${step.title} teaching anchors are too thin or placeholder-like.`);
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
      });
      if (uniqueQuestionTexts.size !== 3) {
        issues.push(`${step.title} must contain 3 distinct basic questions.`);
      }
    }
    if (!step.deeperQuestionText || wordCount(step.deeperQuestionText) < 6 || containsPlaceholderLanguage(step.deeperQuestionText)) {
      issues.push(`${step.title} deeper question is missing or generic.`);
    }
    if (step.progressionRule !== 'feedback_deeper') {
      issues.push(`${step.title} must use feedback_deeper progression.`);
    }
  }

  const workedExample = lesson.steps.find((step) => step.stage === 'worked_example');
  if (workedExample) {
    if (!workedExampleIsStructured(workedExample)) {
      issues.push('Worked example must include real steps, a result, and a takeaway.');
    }
    if (workedExample.progressionRule !== 'worked_example_feedback') {
      issues.push('Worked example must use worked_example_feedback progression.');
    }
  }

  const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
  if (guidedPractice) {
    if (!guidedPractice.questionText || wordCount(guidedPractice.questionText) < 6 || containsPlaceholderLanguage(guidedPractice.questionText) || hasWeakQuestionOnlyStepTask(guidedPractice)) {
      issues.push('Guided practice question is missing or generic.');
    }
    if (!hasTaskFraming(guidedPractice)) {
      issues.push('Guided practice task framing is too thin or placeholder-like.');
    }
  }

  const practice = lesson.steps.find((step) => step.stage === 'practice');
  if (practice) {
    if (!practice.questionText || wordCount(practice.questionText) < 6 || containsPlaceholderLanguage(practice.questionText) || hasWeakQuestionOnlyStepTask(practice)) {
      issues.push('Practice question is missing or generic.');
    }
    if (!hasTaskFraming(practice)) {
      issues.push('Practice task framing is too thin or placeholder-like.');
    }
  }

  const integrative = lesson.steps.find((step) => step.stage === 'integrative');
  if (integrative) {
    if (!integrative.questionText || wordCount(integrative.questionText) < 6 || containsPlaceholderLanguage(integrative.questionText) || hasWeakQuestionOnlyStepTask(integrative)) {
      issues.push('Integrative question is missing or generic.');
    }
    if (!hasTaskFraming(integrative)) {
      issues.push('Integrative task framing is too thin or placeholder-like.');
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
  const questionOnlyDynamic = lesson.comparisonSource === 'dynamic_generator';
  let beginnerClarity = SCORE_MAX.beginnerClarity;
  let teachingBeforeTesting = SCORE_MAX.teachingBeforeTesting;
  let markingRobustness = SCORE_MAX.markingRobustness;
  let alignmentToLO = SCORE_MAX.alignmentToLO;
  let questionQuality = SCORE_MAX.questionQuality;
  const issues: DynamicLessonGenerationScore['issues'] = [];

  const teachChecks = lesson.steps.filter((step) => step.stage === 'teach_check');
  if (teachChecks.length < 2) {
    alignmentToLO -= 8;
    issues.push(buildIssue('alignmentToLO', 'The lesson does not sustain the repeated teach/check pattern.', 'Include at least two teach/check sections with distinct concepts.', { id: 'ALIGN-1', jsonPointers: ['/steps'], excerpt: 'teach_check count', whyItMatters: 'The runtime expects repeated chunk learning before progression to the next chunk.', alignmentGap: 'GENERAL PEDAGOGY' }));
  }

  teachChecks.forEach((step, index) => {
    if (!hasTeachGrounding(step)) {
      beginnerClarity -= 8;
      teachingBeforeTesting -= 8;
      issues.push(buildIssue('teachingBeforeTesting', `${step.title} does not provide enough grounded teaching support before questioning.`, 'Strengthen the chunk anchors so the runtime can teach the concept clearly before the questions.', { id: `TBT-${index + 1}`, jsonPointers: [`/steps/${index + 1}`], excerpt: stepExcerpt(step), whyItMatters: 'Learners cannot answer reliably if the current chunk does not provide enough grounded teaching support first.', alignmentGap: 'GENERAL PEDAGOGY' }));
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

    (step.basicQuestions ?? []).forEach((question, questionIndex) => {
      if (basicQuestionLooksAmbiguous(question, undefined, {
        title: step.title,
        objective: step.objective,
        teachingPoints: step.anchorFacts ?? [],
        keyTerms: step.keyTerms ?? [],
        keyIdeas: step.keyIdeas ?? [],
        misconceptions: step.misconceptionsToWatch ?? [],
        retrievalTextLines: step.retrievalText ? step.retrievalText.split('\n') : [],
        hint: step.hint,
      })) {
        questionQuality -= 2;
        issues.push(buildIssue('questionQuality', `${step.title} question ${questionIndex + 1} is ambiguous.`, 'Rewrite the question so it names the exact concept or quantity being checked.', { id: `AMB-${index + 1}-${questionIndex + 1}`, jsonPointers: [`/steps/${index + 1}/basicQuestions/${questionIndex}/questionText`], excerpt: question.questionText, whyItMatters: 'Ambiguous recall questions make the learner guess what is being checked instead of recalling one taught fact.', alignmentGap: 'GENERAL PEDAGOGY' }));
      }
      if (basicQuestionDriftsFromChunk(question, undefined, {
        title: step.title,
        objective: step.objective,
        teachingPoints: step.anchorFacts ?? [],
        keyTerms: step.keyTerms ?? [],
        keyIdeas: step.keyIdeas ?? [],
        misconceptions: step.misconceptionsToWatch ?? [],
        retrievalTextLines: step.retrievalText ? step.retrievalText.split('\n') : [],
        hint: step.hint,
      })) {
        alignmentToLO -= 2;
        questionQuality -= 1;
        issues.push(buildIssue('alignmentToLO', `${step.title} question ${questionIndex + 1} tests a term or fact that is not clearly taught in this chunk.`, 'Align the recall question to the explanation so the learner is only tested on this chunk’s taught content.', { id: `DRIFT-${index + 1}-${questionIndex + 1}`, jsonPointers: [`/steps/${index + 1}/basicQuestions/${questionIndex}/questionText`], excerpt: question.questionText, whyItMatters: 'Chunk-first pedagogy only works when recall checks stay inside the taught explanation for that same chunk.', alignmentGap: 'GENERAL PEDAGOGY' }));
      }
    });

    if (!questionOnlyDynamic && (!step.deeperAnswerGuidance?.length || isGenericGuidanceList(step.deeperAnswerGuidance))) {
      markingRobustness -= 4;
      issues.push(buildIssue('markingRobustness', `${step.title} deeper answer guidance is too weak to mark reliably.`, 'Provide specific key points for the deeper answer.', { id: `MR-${index + 1}`, jsonPointers: [`/steps/${index + 1}/deeperAnswerGuidance`], excerpt: JSON.stringify(step.deeperAnswerGuidance ?? []), whyItMatters: 'Weak targets make feedback inconsistent and noisy.', alignmentGap: 'GENERAL PEDAGOGY' }));
    }

    (questionOnlyDynamic ? [] : findGuidanceContaminationIssues(step))
      .slice(0, 2)
      .forEach((issue, issueIndex) => {
        markingRobustness -= 5;
        issues.push(
          buildIssue(
            'markingRobustness',
            issue.problem,
            issue.suggestion,
            {
              id: `CONTAM-${index + 1}-${issueIndex + 1}`,
              jsonPointers: [`/steps/${index + 1}/basicQuestions/${issue.questionIndex}/answerGuidance`],
              excerpt: issue.excerpt,
              whyItMatters: 'Contaminated guidance makes one question accept answers that belong to a different prompt, which breaks reliable marking.',
              alignmentGap: 'GENERAL PEDAGOGY',
            }
          )
        );
      });

    (questionOnlyDynamic ? [] : findSpecificTermGuidanceIssues(step))
      .slice(0, 2)
      .forEach((issue, issueIndex) => {
        markingRobustness -= 3;
        questionQuality -= 1;
        issues.push(
          buildIssue(
            'markingRobustness',
            issue.problem,
            issue.suggestion,
            {
              id: `TERM-${index + 1}-${issueIndex + 1}`,
              jsonPointers: [`/steps/${index + 1}/basicQuestions/${issue.questionIndex}/answerGuidance`],
              excerpt: issue.excerpt,
              whyItMatters: 'Exact-term questions must accept the exact taught term, not broad paraphrases or casual labels.',
              alignmentGap: 'GENERAL PEDAGOGY',
            }
          )
        );
      });
  });

  for (let i = 0; i < teachChecks.length; i += 1) {
    for (let j = i + 1; j < teachChecks.length; j += 1) {
      const left = teachChecks[i];
      const right = teachChecks[j];
      if (
        normalizeWhitespace(left.deeperQuestionText) &&
        normalizeWhitespace(right.deeperQuestionText) &&
        areDeeperQuestionsTooSimilar(left.deeperQuestionText ?? '', right.deeperQuestionText ?? '')
      ) {
        alignmentToLO -= 2;
        questionQuality -= 1;
        issues.push(
          buildIssue(
            'alignmentToLO',
            `${right.title} deeper question is too similar to ${left.title}.`,
            'Rewrite one deeper question so each chunk asks for a different kind of reasoning from its own taught idea.',
            {
              id: `DQ-DUP-${i + 1}-${j + 1}`,
              jsonPointers: [`/steps/${j + 1}/deeperQuestionText`],
              excerpt: normalizeWhitespace(right.deeperQuestionText).slice(0, 180),
              whyItMatters: 'Each chunk needs its own reasoning gate. Repeated deeper questions weaken progression and make later chunks feel redundant.',
              alignmentGap: 'GENERAL PEDAGOGY',
            }
          )
        );
      }
    }
  }

  const workedExample = lesson.steps.find((step) => step.stage === 'worked_example');
  if (workedExample && !workedExampleIsStructured(workedExample)) {
    beginnerClarity -= 8;
    teachingBeforeTesting -= 5;
    issues.push(buildIssue('beginnerClarity', 'Worked example is too thin or incomplete.', 'Include a concrete scenario, numbered steps, a result, and a takeaway.', { id: 'WE-1', jsonPointers: ['/steps'], excerpt: workedExample ? stepExcerpt(workedExample) : '', whyItMatters: 'The worked example is the model learners use before guided practice.', alignmentGap: 'GENERAL PEDAGOGY' }));
  }

  const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
  if (guidedPractice && !guidedPractice.questionText) {
    markingRobustness -= 5;
    questionQuality -= 4;
    issues.push(buildIssue('questionQuality', 'Guided practice does not provide a concrete supported task.', 'Set one clear task that mirrors the worked example.', { id: 'GP-1', jsonPointers: ['/steps'], excerpt: guidedPractice?.questionText ?? '', whyItMatters: 'Guided practice should transition learners from modelling to supported doing.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (guidedPractice && questionOnlyDynamic && hasWeakQuestionOnlyStepTask(guidedPractice)) {
    markingRobustness -= 3;
    questionQuality -= 3;
    issues.push(
      buildIssue(
        'questionQuality',
        'Guided practice uses a generic or weak question-only stem instead of naming the thing the learner must identify, explain, or calculate.',
        'Rewrite the guided-practice question so it names the exact concept, instrument, status, system, or quantity the learner must respond to.',
        {
          id: 'GP-QO-1',
          jsonPointers: ['/steps'],
          excerpt: guidedPractice.questionText.slice(0, 180),
          whyItMatters: 'Question-only guided practice still needs an explicit target or the runtime has too little structure for reliable coaching.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (guidedPractice && questionOnlyDynamic) {
    const softIssues = getQuestionOnlyTaskSoftIssues({
      questionText: guidedPractice.questionText,
      objective: guidedPractice.objective,
    });
    if (softIssues.length > 0) {
      beginnerClarity -= 1;
      questionQuality -= 1;
      issues.push(
        buildIssue(
          'beginnerClarity',
          'Guided practice is clear enough to function, but the wording is more indirect than the generation contract needs.',
          'Prefer a simpler direct question that names the target more plainly, while keeping the same task.',
          {
            id: 'GP-QO-SOFT-1',
            jsonPointers: ['/steps'],
            excerpt: guidedPractice.questionText.slice(0, 180),
            whyItMatters: 'Indirect wording makes the learner task less clean, but it should be a small deduction rather than a hard failure when the target is still clear.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        )
      );
    }
  } else if (guidedPractice && !questionOnlyDynamic && isSeverelyBundledTask(guidedPractice.questionText, guidedPractice.answerGuidance ?? [])) {
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
  } else if (guidedPractice && !questionOnlyDynamic && hasThinGuidanceForBundledTask(guidedPractice.questionText, guidedPractice.answerGuidance ?? [])) {
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
  } else if (guidedPractice && !questionOnlyDynamic && isHardToMarkOpenEndedTask(guidedPractice.questionText, guidedPractice.answerGuidance ?? [])) {
    markingRobustness -= 3;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Guided practice uses an open-ended multi-demand prompt that is difficult to mark reliably.',
        'Convert the prompt into labeled parts or a tighter supported response so the learner output can be checked consistently.',
        {
          id: 'GP-3',
          jsonPointers: ['/steps'],
          excerpt: guidedPractice.questionText.slice(0, 180),
          whyItMatters: 'Supported practice still needs a markable structure when it asks for several things at once.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  }

  const practice = lesson.steps.find((step) => step.stage === 'practice');
  if (practice && !practice.questionText) {
    markingRobustness -= 4;
    questionQuality -= 4;
    issues.push(buildIssue('questionQuality', 'Practice does not provide a properly independent task.', 'Make practice concrete and slightly less scaffolded than guided practice.', { id: 'PR-1', jsonPointers: ['/steps'], excerpt: practice?.questionText ?? '', whyItMatters: 'Independent practice checks whether the learner can apply the idea without heavy support.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (practice && questionOnlyDynamic && hasWeakQuestionOnlyStepTask(practice)) {
    markingRobustness -= 3;
    questionQuality -= 3;
    issues.push(
      buildIssue(
        'questionQuality',
        'Practice uses a generic or weak question-only stem instead of a concrete independent task.',
        'Rewrite the practice question so it names the exact concept, instrument, status, system, or quantity the learner must respond to.',
        {
          id: 'PR-QO-1',
          jsonPointers: ['/steps'],
          excerpt: practice.questionText.slice(0, 180),
          whyItMatters: 'Question-only independent practice must still be concrete enough to show whether the learner can apply the idea alone.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (practice && questionOnlyDynamic) {
    const softIssues = getQuestionOnlyTaskSoftIssues({
      questionText: practice.questionText,
      objective: practice.objective,
    });
    if (softIssues.length > 0) {
      beginnerClarity -= 1;
      questionQuality -= 1;
      issues.push(
        buildIssue(
          'beginnerClarity',
          'Practice is usable, but the question wording is less direct than the generation contract intends.',
          'Prefer a simpler direct question that names the target more plainly.',
          {
            id: 'PR-QO-SOFT-1',
            jsonPointers: ['/steps'],
            excerpt: practice.questionText.slice(0, 180),
            whyItMatters: 'Independent practice should stay concrete, but awkward wording should be a small deduction rather than a structural failure when the task is still clear.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        )
      );
    }
  } else if (practice && !questionOnlyDynamic && isSeverelyBundledTask(practice.questionText, practice.answerGuidance ?? [])) {
    markingRobustness -= 5;
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
  } else if (practice && !questionOnlyDynamic && hasThinGuidanceForBundledTask(practice.questionText, practice.answerGuidance ?? [])) {
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
  } else if (practice && !questionOnlyDynamic && isClassificationListBundle(practice.questionText, practice.answerGuidance ?? [])) {
    markingRobustness -= 4;
    questionQuality -= 1;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Practice asks the learner to classify several items in one response field, which weakens marking granularity.',
        'Split the classifications into smaller prompts or label each expected answer explicitly so each item can be checked independently.',
        {
          id: 'PR-3',
          jsonPointers: ['/steps'],
          excerpt: practice.questionText.slice(0, 180),
          whyItMatters: 'Even same-type classification lists become fragile when several items must be judged from one answer box.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (practice && !questionOnlyDynamic && isHardToMarkOpenEndedTask(practice.questionText, practice.answerGuidance ?? [])) {
    markingRobustness -= 3;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Practice uses an open-ended multi-demand prompt that is difficult to mark reliably.',
        'Break the prompt into labeled parts or constrain the expected response so each required idea can be checked clearly.',
        {
          id: 'PR-4',
          jsonPointers: ['/steps'],
          excerpt: practice.questionText.slice(0, 180),
          whyItMatters: 'Independent practice should still be markable without forcing the learner into a single wide-open response.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  }

  const integrative = lesson.steps.find((step) => step.stage === 'integrative');
  if (integrative && !integrative.questionText) {
    alignmentToLO -= 4;
    questionQuality -= 3;
    issues.push(buildIssue('alignmentToLO', 'Integrative task is too weak to test synthesis.', 'Ask the learner to pull the lesson ideas together in one applied explanation.', { id: 'INT-1', jsonPointers: ['/steps'], excerpt: integrative?.questionText ?? '', whyItMatters: 'The close should test synthesis, not just another recall check.', alignmentGap: 'GENERAL PEDAGOGY' }));
  } else if (integrative && questionOnlyDynamic && hasWeakQuestionOnlyStepTask(integrative)) {
    markingRobustness -= 3;
    questionQuality -= 3;
    alignmentToLO -= 2;
    issues.push(
      buildIssue(
        'alignmentToLO',
        'Integrative task uses a generic or weak question-only stem instead of a clear synthesis question.',
        'Rewrite the integrative question so it names the exact idea or relationship the learner must explain or apply.',
        {
          id: 'INT-QO-1',
          jsonPointers: ['/steps'],
          excerpt: integrative.questionText.slice(0, 180),
          whyItMatters: 'Question-only synthesis still needs a clear target or the final runtime feedback becomes vague.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (integrative && questionOnlyDynamic) {
    const softIssues = getQuestionOnlyTaskSoftIssues({
      questionText: integrative.questionText,
      objective: integrative.objective,
    });
    if (softIssues.length > 0) {
      beginnerClarity -= 1;
      alignmentToLO -= 1;
      issues.push(
        buildIssue(
          'beginnerClarity',
          'Integrative task is usable, but the wording is more indirect or elaborate than needed for a clear synthesis question.',
          'Prefer a shorter direct synthesis question that names the relationship more plainly.',
          {
            id: 'INT-QO-SOFT-1',
            jsonPointers: ['/steps'],
            excerpt: integrative.questionText.slice(0, 180),
            whyItMatters: 'Synthesis questions can be more open than guided practice, but awkward wording should be a soft deduction unless the task becomes unclear.',
            alignmentGap: 'GENERAL PEDAGOGY',
          }
        )
      );
    }
  } else if (integrative && !questionOnlyDynamic && isSeverelyBundledTask(integrative.questionText, integrative.answerGuidance ?? [])) {
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
  } else if (integrative && !questionOnlyDynamic && hasThinGuidanceForBundledTask(integrative.questionText, integrative.answerGuidance ?? [])) {
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
  } else if (integrative && !questionOnlyDynamic && isClassificationListBundle(integrative.questionText, integrative.answerGuidance ?? [])) {
    markingRobustness -= 3;
    questionQuality -= 1;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Integrative task asks for several classifications in one response field, which reduces marking precision.',
        'Use a smaller synthesis task or label each classification explicitly so the final answer remains markable.',
        {
          id: 'INT-3',
          jsonPointers: ['/steps'],
          excerpt: integrative.questionText.slice(0, 180),
          whyItMatters: 'Synthesis is fine, but the final task still needs a structure that supports reliable feedback.',
          alignmentGap: 'GENERAL PEDAGOGY',
        }
      )
    );
  } else if (integrative && !questionOnlyDynamic && isHardToMarkOpenEndedTask(integrative.questionText, integrative.answerGuidance ?? [])) {
    markingRobustness -= 4;
    questionQuality -= 2;
    issues.push(
      buildIssue(
        'markingRobustness',
        'Integrative task uses an open-ended multi-demand explanation that is difficult to mark reliably.',
        'Turn the synthesis task into labeled parts or a constrained explanation so the final response can be marked consistently.',
        {
          id: 'INT-4',
          jsonPointers: ['/steps'],
          excerpt: integrative.questionText.slice(0, 180),
          whyItMatters: 'The final synthesis task should test understanding, not create avoidable ambiguity in marking.',
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

  const priority = (issue: DynamicLessonGenerationScore['issues'][number]): number => {
    if (issue.id?.startsWith('CONTAM-')) return 0;
    if (issue.problem.includes('incorrectly includes')) return 0;
    if (issue.id === 'GP-QO-1' || issue.id === 'PR-QO-1' || issue.id === 'INT-QO-1') return 1;
    if (issue.id === 'GP-2' || issue.id === 'PR-2' || issue.id === 'PR-3' || issue.id === 'INT-2' || issue.id === 'INT-3' || issue.id === 'INT-4') return 1;
    if (issue.id?.startsWith('TERM-')) return 2;
    if (issue.problem.includes('open-ended')) return 2;
    if (issue.problem.includes('thin or generic')) return 4;
    return 3;
  };

  issues.sort((a, b) => priority(a) - priority(b));

  beginnerClarity = clamp(beginnerClarity, 0, SCORE_MAX.beginnerClarity);
  teachingBeforeTesting = clamp(teachingBeforeTesting, 0, SCORE_MAX.teachingBeforeTesting);
  markingRobustness = clamp(markingRobustness, 0, SCORE_MAX.markingRobustness);
  alignmentToLO = clamp(alignmentToLO, 0, SCORE_MAX.alignmentToLO);
  questionQuality = clamp(questionQuality, 0, SCORE_MAX.questionQuality);

  const rawTotal = beginnerClarity + teachingBeforeTesting + markingRobustness + alignmentToLO + questionQuality;
  const total = validation.passed ? rawTotal : Math.min(rawTotal, 60);
  const grade = lessonGrade(total, validation.passed);

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
    issues,
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
        solution:
          normalizeWhitespace(issue.solution) ||
          normalizeWhitespace(issue.suggestion) ||
          normalizeWhitespace(issue.whyItMatters) ||
          'Tighten the affected lesson content.',
        suggestion:
          normalizeWhitespace(issue.solution) ||
          normalizeWhitespace(issue.suggestion) ||
          normalizeWhitespace(issue.whyItMatters) ||
          'Tighten the affected lesson content.',
      };
    })
    .filter((issue) => issue.problem)
    ;

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
  const grade = lessonGrade(cappedTotal, validation.passed);

  return {
    ...score,
    total: cappedTotal,
    grade,
    issues: [
      ...score.issues,
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
    ],
    phaseFeedback: score.phaseFeedback,
    summary: `${score.summary} Phase 10 scoring fell back to the local heuristic because the model score was malformed.`,
  };
}

function compareScores(
  originalScore: DynamicLessonGenerationScore,
  candidateScore: DynamicLessonGenerationScore,
  originalValidationPassed: boolean,
  candidateValidationPassed: boolean,
  refined: boolean
): DynamicLessonAcceptanceDecision {
  const acceptedSource: DynamicLessonAcceptanceDecision['acceptedSource'] = refined ? 'candidate' : 'original';
  const gateScore = refined ? candidateScore : originalScore;
  const gateValidationPassed = refined ? candidateValidationPassed : originalValidationPassed;
  const requiredScore = refined ? REPAIRED_PUBLISH_FLOOR : ACCEPTANCE_GATE;
  const accepted = gateScore.total >= requiredScore && gateValidationPassed;
  const reason = !gateValidationPassed
    ? refined
      ? 'Refined lesson failed validation.'
      : 'Draft fails validation.'
    : gateScore.total < requiredScore
      ? refined
        ? `Highest repaired score ${gateScore.total} is below the ${REPAIRED_PUBLISH_FLOOR} publish floor.`
        : `Draft score ${gateScore.total} is below the ${ACCEPTANCE_GATE} acceptance gate.`
      : refined
        ? gateScore.total >= ACCEPTANCE_GATE
          ? `Repaired lesson cleared the ${ACCEPTANCE_GATE} target and publish floor.`
          : `Repaired lesson is below the ${ACCEPTANCE_GATE} target but cleared the ${REPAIRED_PUBLISH_FLOOR} publish floor.`
        : 'Draft cleared the acceptance gate.';

  return {
    accepted,
    acceptedSource,
    reason,
    originalScore,
    candidateScore,
    regressions: [],
  };
}

function shouldReplaceBestRepairCandidate(params: {
  currentBestValidation: DynamicLessonGenerationValidation | null;
  currentBestScore: DynamicLessonGenerationScore | null;
  candidateValidation: DynamicLessonGenerationValidation;
  candidateScore: DynamicLessonGenerationScore;
}): boolean {
  if (!params.currentBestScore || !params.currentBestValidation) return true;
  if (params.candidateScore.total !== params.currentBestScore.total) {
    return params.candidateScore.total > params.currentBestScore.total;
  }
  if (params.candidateValidation.passed !== params.currentBestValidation.passed) {
    return params.candidateValidation.passed && !params.currentBestValidation.passed;
  }
  if (params.candidateValidation.issues.length !== params.currentBestValidation.issues.length) {
    return params.candidateValidation.issues.length < params.currentBestValidation.issues.length;
  }
  return params.candidateScore.issues.length < params.currentBestScore.issues.length;
}

export const __testOnlyDynamicLessonGenerator = {
  stripDynamicLessonAnswers,
  buildQuestionOnlyApplyQuestion,
  hasWeakQuestionOnlyTask,
  areDeeperQuestionsTooSimilar,
  coerceFixPlan,
  coerceRepairPatchSet,
  validateRepairPatchSet,
  applyRepairPatchSet,
  inferInstrumentGuidance,
  inferSpecificTechnicalAnswer,
  classifyGenerationQuestionType,
  buildExactAnswerBinding,
  buildCanonicalAnswerPacket,
  buildSpacedReviewGroundingPacket,
  validateSpacedReviewCoverage,
  mergeUnderstandingChecks,
  splitExplanationGuidancePoints,
  ensureApplyOutput,
  normalizeSingleMarkableTask,
  normalizeRuntimeStep,
  repairQuestionGuidancePair,
  repairLateStageStep,
  stabilizeLessonForScoring,
  validateBasicChecksPhaseOutput,
  backfillMissingDeeperChecks,
  preservesLessonStructure,
  applyPilotFamilyCompiler,
  normalizeCanonicalTechnicalTermsInLesson,
  ensureIntegrationOutput,
  compareScores,
  buildLessonScore,
  buildDeterministicExactReplacePatchSet,
};

export class DynamicLessonGenerator {
  constructor(private readonly options: DynamicLessonGeneratorOptions = {}) {}

  private createGenerationConversation(
    client: Awaited<ReturnType<typeof createLLMClientWithFallback>>,
    input: DynamicLessonGenerationInput,
    stagePlan: DynamicLessonStageDescriptor[]
  ): GenerationConversation {
    const groundingPacket = buildGenerationGroundingPacket(input, stagePlan);
    return {
      model: client.getGenerativeModel({
        model: getGeminiModelWithDefault(),
        systemInstruction: [
          'You are running a multi-phase 2365 dynamic lesson generation session.',
          'Treat the conversation history as the canonical context for earlier phases.',
          'For the current phase, follow only the current phase instructions and output strict JSON only.',
          'Do not rewrite earlier phase outputs unless the current phase explicitly asks you to repair them.',
        ].join('\n'),
      }),
      history: [
        {
          role: 'user',
          parts: [{ text: groundingPacket }],
        },
        {
          role: 'model',
          parts: [{ text: '{"status":"grounding_locked"}' }],
        },
      ],
    };
  }

  private buildConversationPhaseMessage(phaseName: string, prompt: PromptPair): string {
    return [
      `Current phase: ${phaseName}`,
      '',
      'Phase instructions:',
      prompt.system,
      '',
      'Phase input:',
      prompt.user,
    ].join('\n');
  }

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
      temperature: options?.temperature ?? 0.0,
      maxOutputTokens: options?.maxOutputTokens ?? 4096,
    });
    const client = await getClient();
    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      systemInstruction: prompt.system,
      generationConfig: {
        temperature: options?.temperature ?? 0.0,
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

  private async runTextPhase<T>(
    input: DynamicLessonGenerationInput,
    phaseName: string,
    prompt: PromptPair,
    coerce: (rawText: string) => T,
    phases: DynamicGenerationPhaseArtifact[],
    options?: { temperature?: number; maxOutputTokens?: number }
  ): Promise<TextPhaseResult<T>> {
    const startedAt = nowIso();
    const startedAtMs = Date.now();
    logGenerationEvent(input, `${phaseName} start`, {
      temperature: options?.temperature ?? 0.0,
      maxOutputTokens: options?.maxOutputTokens ?? 4096,
    });
    const client = await getClient();
    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      systemInstruction: prompt.system,
      generationConfig: {
        temperature: options?.temperature ?? 0.0,
        maxOutputTokens: options?.maxOutputTokens ?? 4096,
      },
    });

    try {
      const result = await model.generateContent(prompt.user);
      const rawText = result.response.text();
      const parsed = coerce(rawText);
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

  private async runJsonPhaseInConversation<T>(
    input: DynamicLessonGenerationInput,
    phaseName: string,
    prompt: PromptPair,
    coerce: (raw: unknown) => T,
    phases: DynamicGenerationPhaseArtifact[],
    conversation: GenerationConversation,
    options?: { temperature?: number; maxOutputTokens?: number },
    acceptance?: PhaseAcceptanceOptions<T>
  ): Promise<JsonPhaseResult<T>> {
    const startedAt = nowIso();
    const startedAtMs = Date.now();
    logGenerationEvent(input, `${phaseName} start`, {
      temperature: options?.temperature ?? 0.0,
      maxOutputTokens: options?.maxOutputTokens ?? 4096,
      orchestration: 'conversation-history',
    });

    const maxAttempts = acceptance?.maxAttempts ?? 2;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const correctionNote =
        attempt > 1 && lastError
          ? `\n\nRetry instruction:\nThe previous ${phaseName} output was not accepted.\nReason: ${lastError instanceof Error ? lastError.message : String(lastError)}\nReturn only the current phase JSON again. Do not restate earlier phases.`
          : '';
      const message = `${this.buildConversationPhaseMessage(phaseName, prompt)}${correctionNote}`;
      const contents: ChatHistoryEntry[] = [
        ...conversation.history,
        { role: 'user', parts: [{ text: message }] },
      ];

      try {
        const result = await conversation.model.generateContent({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? 0.0,
            maxOutputTokens: options?.maxOutputTokens ?? 4096,
            responseMimeType: 'application/json',
          },
        });
        const rawText = result.response.text();
        const parsed = coerce(parseJson<unknown>(rawText));
        const validationIssues = acceptance?.validateParsed?.(parsed) ?? [];
        const shouldProceedDespiteValidationIssues =
          validationIssues.length > 0 &&
          Boolean(acceptance?.shouldProceedOnValidationIssues?.(validationIssues, parsed));
        if (validationIssues.length > 0 && !shouldProceedDespiteValidationIssues) {
          lastError = new Error(validationIssues.join(' '));
          continue;
        }

        conversation.history.push({ role: 'user', parts: [{ text: message }] });
        conversation.history.push({ role: 'model', parts: [{ text: rawText }] });
        phases.push({
          phase: phaseName,
          status: 'completed',
          output: {
            systemPrompt: prompt.system,
            userPrompt: prompt.user,
            rawText,
            parsed,
            orchestration: 'conversation-history',
            attempts: attempt,
            ...(validationIssues.length > 0 ? { validationIssues } : {}),
          },
          startedAt,
          finishedAt: nowIso(),
        });
        logGenerationEvent(input, `${phaseName} completed`, {
          durationMs: durationMs(startedAtMs),
          attempts: attempt,
          ...(validationIssues.length > 0 ? { validationIssues } : {}),
        });
        return { parsed, rawText, prompt };
      } catch (error) {
        lastError = error;
      }
    }

    phases.push({
      phase: phaseName,
      status: 'failed',
      output: {
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
        error: lastError instanceof Error ? lastError.message : String(lastError),
        orchestration: 'conversation-history',
        attempts: maxAttempts,
      },
      startedAt,
      finishedAt: nowIso(),
    });
    logGenerationEvent(input, `${phaseName} failed`, {
      durationMs: durationMs(startedAtMs),
      error: lastError instanceof Error ? lastError.message : String(lastError),
      attempts: maxAttempts,
    });
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  async generate(input: DynamicLessonGenerationInput): Promise<DynamicLessonGenerationResult> {
    const phases: DynamicGenerationPhaseArtifact[] = [];
    const stagePlan = input.stagePlan && input.stagePlan.length > 0 ? input.stagePlan : defaultStagePlan(input);
    const runStartedAtMs = Date.now();
    const client = await getClient();
    const generationConversation = this.createGenerationConversation(client, input, stagePlan);

    logGenerationEvent(input, 'run start', {
      title: input.lessonTitle,
      topic: input.topic,
      stageCount: stagePlan.length,
      sourceContext: input.sourceContext ?? null,
    });

    let planning = (
      await this.runJsonPhaseInConversation(
        input,
        'Phase 1 Planning',
        buildDynamicPlanningPrompt(input, stagePlan),
        (raw) => coercePlanningOutput(raw, stagePlan, input),
        phases,
        generationConversation,
        { temperature: 0.0, maxOutputTokens: 2200 }
      )
    ).parsed;

    const teachCheckCount = Math.max(1, planning.teachCheckCount || planning.teachChecks.length || stagePlan.filter((step) => step.stage === 'teach_check').length);
    const explanationMaxTokens = Math.max(3200, 1800 + teachCheckCount * 500);
    const checksMaxTokens = Math.max(2600, 1800 + teachCheckCount * 900);

    let vocabulary = (
      await this.runJsonPhaseInConversation(
        input,
        'Phase 2 Vocabulary',
        buildDynamicVocabularyPrompt(input),
        (raw) => coerceVocabularyOutput(raw),
        phases,
        generationConversation,
        { temperature: 0.0, maxOutputTokens: 2200 }
      )
    ).parsed;

    const sourceCanonicalTerms = unique([
      ...inferSubjectTermProfile(input.subject).protectedTerms,
      ...extractNamedEntities(input.sourceText),
    ]);
    planning = normalizeCanonicalTechnicalTermsInPlanning(planning, sourceCanonicalTerms);
    vocabulary = normalizeCanonicalTechnicalTermsInVocabulary(vocabulary, sourceCanonicalTerms);

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
      await this.runJsonPhaseInConversation(
        input,
        'Phase 3 Explanation',
        buildDynamicExplanationPrompt(input, this.options.promptVariantId ?? 'baseline'),
        (raw) => coerceExplanationOutput(raw, planning),
        phases,
        generationConversation,
        { temperature: 0.0, maxOutputTokens: explanationMaxTokens },
        {
          maxAttempts: 2,
          validateParsed: (parsed) => validateExplanationPhaseOutput(parsed, planning),
        }
      )
    ).parsed;

    const basicChecks = (
      await this.runJsonPhaseInConversation(
        input,
        'Phase 4 Basic Checks',
        buildDynamicBasicChecksPrompt(input, this.options.promptVariantId ?? 'baseline'),
        (raw) => coerceBasicChecksOutput(raw, planning),
        phases,
        generationConversation,
        { temperature: 0.0, maxOutputTokens: checksMaxTokens },
        {
          maxAttempts: 2,
          validateParsed: (parsed) => validateBasicChecksPhaseOutput(parsed, planning, explanations),
          shouldProceedOnValidationIssues: (issues) => issues.every(isRepairableBasicChecksValidationIssue),
        }
      )
    ).parsed;

    const rawDeeperChecks = (
      await this.runJsonPhaseInConversation(
        input,
        'Phase 4.1 Deeper Checks',
        buildDynamicDeeperChecksPrompt(input, this.options.promptVariantId ?? 'p41_markdown_only'),
        (raw) => coerceDeeperChecksOutput(raw, planning),
        phases,
        generationConversation,
        { temperature: 0.0, maxOutputTokens: 1800 },
        {
          maxAttempts: 2,
          validateParsed: (parsed) => validateDeeperChecksPhaseOutput(parsed, planning, { allowMissing: true }),
        }
      )
    ).parsed;

    const deeperChecks = backfillMissingDeeperChecks(rawDeeperChecks, planning, explanations);
    const deeperCheckIssues = validateDeeperChecksPhaseOutput(deeperChecks, planning);
    if (deeperCheckIssues.length > 0) {
      const deeperPhaseArtifact = phases.find((phase) => phase.phase === 'Phase 4.1 Deeper Checks');
      if (deeperPhaseArtifact) {
        deeperPhaseArtifact.output = {
          ...(deeperPhaseArtifact.output as Record<string, unknown>),
          postValidationIssues: deeperCheckIssues,
        };
        deeperPhaseArtifact.status = 'failed';
      }
      logGenerationEvent(input, 'Phase 4.1 Deeper Checks post-validation issues', {
        issueCount: deeperCheckIssues.length,
        issues: deeperCheckIssues,
      });
    }

    const checks = mergeBasicAndDeeperChecks(planning, basicChecks, deeperChecks);

    const assembledLesson = buildLessonFromPhases(
      input,
      stagePlan,
      planning,
      vocabulary,
      explanations,
      checks
    );
    const canonicalizedLesson = normalizeCanonicalTechnicalTermsInLesson(assembledLesson, input, vocabulary);
    const lesson = stripDynamicLessonAnswers(stabilizeLessonForScoring(canonicalizedLesson, planning));
    phases.push({
      phase: 'Phase 9 Assembler',
      status: 'completed',
      output: {
        lesson,
      },
      startedAt: nowIso(),
      finishedAt: nowIso(),
    });
    logGenerationEvent(input, 'Phase 9 Assembler completed', {
      stepCount: assembledLesson.steps.length,
      teachCheckCount: assembledLesson.steps.filter((step) => step.stage === 'teach_check').length,
    });

    const validation = validateDynamicLesson(lesson);
    logGenerationEvent(input, 'validation complete', {
      passed: validation.passed,
      issueCount: validation.issues.length,
      issues: validation.issues,
    });
    const phase10Prompt = buildDynamicScorePrompt(input, lesson, validation.issues, planning, vocabulary, null);
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
    const planScore = scoreLessonPlan(stagePlan, planning, vocabulary, sourceGrounding);
    const score = buildLessonScore(lesson, validation, scoreRaw, phase10UsedFallback);
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

    const runRepairRescore = async (
      lessonToScore: DynamicGuidedV2Lesson,
      validationToScore: DynamicLessonGenerationValidation,
      phaseName: string
    ): Promise<DynamicLessonGenerationScore> => {
      let rescoredRaw: unknown = null;
      let usedFallback = false;
      try {
        rescoredRaw = (
          await this.runJsonPhase(
            input,
            phaseName,
            buildDynamicScorePrompt(input, lessonToScore, validationToScore.issues, planning, vocabulary, null),
            (raw) => raw,
            phases,
            { temperature: 0.0, maxOutputTokens: 3200 }
          )
        ).parsed;
      } catch {
        usedFallback = true;
      }

      const rescoredScore = buildLessonScore(lessonToScore, validationToScore, rescoredRaw, usedFallback);
      const phaseArtifact = phases[phases.length - 1];
      if (phaseArtifact?.phase === phaseName) {
        phaseArtifact.output = {
          ...(phaseArtifact.output as Record<string, unknown>),
          parseFailed: usedFallback,
          parsed: rescoredScore,
        };
        phaseArtifact.status = validationToScore.passed ? 'completed' : 'failed';
      }
      logGenerationEvent(input, `${phaseName} evaluated`, {
        score: rescoredScore.total,
        grade: rescoredScore.grade,
        validationPassed: validationToScore.passed,
        issueCount: rescoredScore.issues.length,
        fallbackUsed: usedFallback,
        topIssue: rescoredScore.issues[0]?.problem ?? null,
      });
      return rescoredScore;
    };

    let fixPlan: DynamicFixPlan | null = null;
    if (score.total < 95 || !validation.passed) {
      fixPlan = (
        await this.runJsonPhase(
          input,
          'Phase 11 Suggest Fixes',
          buildDynamicFixPlanPrompt(lesson, score, validation),
          (raw) => coerceFixPlan(raw, score, lesson, validation, input),
          phases,
          { temperature: 0.0, maxOutputTokens: 2200 }
        )
      ).parsed;
      logGenerationEvent(input, 'Phase 11 Suggest Fixes completed', {
        fixCount: fixPlan.fixes.length,
        targetPhases: unique(fixPlan.fixes.map((fix) => normalizeWhitespace(fix.phaseKey)).filter(Boolean)).length,
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
    const repairSummary = createEmptyRepairSummary();

    let patchableFixes = (fixPlan?.fixes ?? []).filter((fix) => isRepairablePointer(fix.targetPointer));
    repairSummary.patchableIssueCountInitial = patchableFixes.length;
    repairSummary.patchableIssueCountFinal = patchableFixes.length;

    if ((score.total < 95 || !validation.passed) && fixPlan && patchableFixes.length > 0) {
      let workingLesson = lesson;
      let workingValidation = validation;
      let workingScore = score;
      let workingFixPlan: DynamicFixPlan | null = fixPlan;
      let bestRepairedLesson: DynamicGuidedV2Lesson | null = null;
      let bestRepairedValidation: DynamicLessonGenerationValidation | null = null;
      let bestRepairedScore: DynamicLessonGenerationScore | null = null;
      const attemptedTargets = new Set<string>();
      const acceptedTargets = new Set<string>();
      let repairRound = 0;

      while (true) {
        patchableFixes = (workingFixPlan?.fixes ?? []).filter((fix) => isRepairablePointer(fix.targetPointer));
        repairSummary.patchableIssueCountFinal = patchableFixes.length;
        if (patchableFixes.length === 0) {
          repairSummary.repairStopReason = refined ? 'all_patchable_attempted_and_resolved' : 'no_patchable_issues';
          break;
        }

        const nextFix = patchableFixes.find((fix) => {
          const key = `${fix.repairClass}::${fix.targetPointer}`;
          return !attemptedTargets.has(key) && !acceptedTargets.has(key);
        });
        if (!nextFix) {
          repairSummary.repairStopReason = 'no_progress';
          break;
        }

        repairRound += 1;

        repairSummary.phase12Ran = true;
        repairSummary.repairRoundsRun += 1;
        repairSummary.lastTargetPointer = nextFix.targetPointer;
        repairSummary.lastRepairClass = nextFix.repairClass;
        repairSummary.specificPromptReturnedPatch = false;
        repairSummary.fallbackPromptRan = false;
        repairSummary.fallbackPromptReturnedPatch = false;
        repairSummary.patchAccepted = false;
        repairSummary.patchRejectedCode = null;
        repairSummary.patchRejectedReason = null;

        attemptedTargets.add(`${nextFix.repairClass}::${nextFix.targetPointer}`);
        let acceptedPatch = false;
        let roundCandidateLesson: DynamicGuidedV2Lesson | null = null;
        let roundCandidateValidation: DynamicLessonGenerationValidation | null = null;
        let roundCandidateScore: DynamicLessonGenerationScore | null = null;
        let finalPatchIssues: string[] = [];
        let previousRejectedCode: string | null = null;
        let previousRejectedDetail: string | null = null;

        if (nextFix.repairClass === 'exact_replace') {
          const patchSet = buildDeterministicExactReplacePatchSet(workingLesson, nextFix);
          const patchIssues = validateRepairPatchSet(workingLesson, patchSet, [nextFix.targetPointer], nextFix);
          finalPatchIssues = [...patchIssues];
          const promptReturnedPatch = patchSet.patches.length > 0;
          repairSummary.specificPromptReturnedPatch = promptReturnedPatch;

          if (patchIssues.length === 0 && patchSet.patches.length === 1) {
            const patchedLesson = applyRepairPatchSet(workingLesson, patchSet);
            const canonicalizedCandidate = normalizeCanonicalTechnicalTermsInLesson(patchedLesson, input, vocabulary);
            const stabilizedCandidate = stripDynamicLessonAnswers(stabilizeLessonForScoring(canonicalizedCandidate, planning));
            if (preservesLessonStructure(workingLesson, stabilizedCandidate)) {
              roundCandidateLesson = stabilizedCandidate;
              roundCandidateValidation = validateDynamicLesson(roundCandidateLesson);
              roundCandidateScore = await runRepairRescore(
                roundCandidateLesson,
                roundCandidateValidation,
                `Phase 13 Rescore After Repair ${repairSummary.acceptedPatchCount + 1}`
              );
              acceptedPatch = shouldAcceptRepairCandidate({
                currentLesson: workingLesson,
                currentValidation: workingValidation,
                currentScore: workingScore,
                candidateLesson: roundCandidateLesson,
                candidateValidation: roundCandidateValidation,
                candidateScore: roundCandidateScore,
                fix: nextFix,
              });
              if (acceptedPatch) {
                workingLesson = roundCandidateLesson;
                workingValidation = roundCandidateValidation;
                workingScore = roundCandidateScore;
                refined = true;
                acceptedTargets.add(`${nextFix.repairClass}::${nextFix.targetPointer}`);
                attemptedTargets.clear();
                repairSummary.patchAccepted = true;
                repairSummary.patchRejectedReason = null;
                if (
                  shouldReplaceBestRepairCandidate({
                    currentBestValidation: bestRepairedValidation,
                    currentBestScore: bestRepairedScore,
                    candidateValidation: roundCandidateValidation,
                    candidateScore: roundCandidateScore,
                  })
                ) {
                  bestRepairedLesson = roundCandidateLesson;
                  bestRepairedValidation = roundCandidateValidation;
                  bestRepairedScore = roundCandidateScore;
                  repairSummary.bestRepairedScore = roundCandidateScore.total;
                  repairSummary.bestRepairedRound = repairRound;
                }
              } else {
                finalPatchIssues.push('Patch did not improve the targeted field without regressing protected scoring domains.');
              }
            } else {
              finalPatchIssues.push('Patched lesson changed protected step structure or could not be stabilized safely.');
            }
          }

          repairSummary.repairAttempts.push({
            round: repairRound,
            attemptMode: 'specific',
            repairClass: nextFix.repairClass,
            targetPointer: nextFix.targetPointer,
            promptReturnedPatch,
            patchAccepted: acceptedPatch,
            patchRejectedCode: acceptedPatch ? null : derivePatchRejectedCode(finalPatchIssues[0]),
            patchRejectedReason: acceptedPatch ? null : finalPatchIssues[0] ?? 'Patch was not accepted.',
          });
          repairSummary.attemptedPatchCount += 1;
          if (!acceptedPatch) {
            repairSummary.patchRejectedCode = derivePatchRejectedCode(finalPatchIssues[0]);
            repairSummary.patchRejectedReason = finalPatchIssues[0] ?? 'Patch was not accepted.';
          }

          phases.push({
            phase: `Phase 12 Refine Round ${repairRound}`,
            status: acceptedPatch ? 'completed' : 'failed',
            output: {
              repairTarget: nextFix,
              parsed: patchSet,
              allowedPointers: [nextFix.targetPointer],
              patchIssues: finalPatchIssues,
              candidateLesson: roundCandidateLesson,
              validation: roundCandidateValidation,
              localScore: roundCandidateScore,
              acceptedPatch,
              attemptMode: 'specific',
              deterministic: true,
            },
            startedAt: nowIso(),
            finishedAt: nowIso(),
          });
          logGenerationEvent(input, `Phase 12 Refine Round ${repairRound} processed`, {
            repairClass: nextFix.repairClass,
            targetPointer: nextFix.targetPointer,
            patchCount: patchSet.patches.length,
            acceptedPatch,
            validationPassed: roundCandidateValidation?.passed ?? false,
            patchIssues: finalPatchIssues,
            attemptMode: 'specific',
            deterministic: true,
          });
        } else {
        for (const currentMode of ['specific', 'general_fallback'] as const) {
          const phaseName =
            currentMode === 'specific'
              ? `Phase 12 Refine Round ${repairRound}`
              : `Phase 12 Refine Round ${repairRound} Fallback`;
          const refineResult = await this.runTextPhase(
            input,
            phaseName,
            buildDynamicRepairPrompt(
              input,
              workingLesson,
              workingScore,
              fixPlan,
              nextFix,
              stagePlan,
              currentMode,
              currentMode === 'general_fallback'
                ? { code: previousRejectedCode, detail: previousRejectedDetail }
                : undefined
            ),
            (rawText) => coerceRepairReplacementPatchSet(rawText, nextFix.targetPointer),
            phases,
            { temperature: 0.0, maxOutputTokens: 1200 }
          );
          const patchSet = refineResult.parsed;
          const patchIssues = validateRepairPatchSet(workingLesson, patchSet, [nextFix.targetPointer], nextFix);
          finalPatchIssues = [...patchIssues];
          const promptReturnedPatch = patchSet.patches.length > 0;

          if (currentMode === 'specific') {
            repairSummary.specificPromptReturnedPatch = promptReturnedPatch;
          } else {
            repairSummary.fallbackPromptRan = true;
            repairSummary.fallbackPromptReturnedPatch = promptReturnedPatch;
          }

          if (patchIssues.length === 0 && patchSet.patches.length === 1) {
            const patchedLesson = applyRepairPatchSet(workingLesson, patchSet);
            const canonicalizedCandidate = normalizeCanonicalTechnicalTermsInLesson(patchedLesson, input, vocabulary);
            const stabilizedCandidate = stripDynamicLessonAnswers(stabilizeLessonForScoring(canonicalizedCandidate, planning));
            if (preservesLessonStructure(workingLesson, stabilizedCandidate)) {
              roundCandidateLesson = stabilizedCandidate;
              roundCandidateValidation = validateDynamicLesson(roundCandidateLesson);
              roundCandidateScore = await runRepairRescore(
                roundCandidateLesson,
                roundCandidateValidation,
                `Phase 13 Rescore After Repair ${repairSummary.acceptedPatchCount + 1}`
              );
              acceptedPatch = shouldAcceptRepairCandidate({
                currentLesson: workingLesson,
                currentValidation: workingValidation,
                currentScore: workingScore,
                candidateLesson: roundCandidateLesson,
                candidateValidation: roundCandidateValidation,
                candidateScore: roundCandidateScore,
                fix: nextFix,
              });
              if (acceptedPatch) {
                workingLesson = roundCandidateLesson;
                workingValidation = roundCandidateValidation;
                workingScore = roundCandidateScore;
                refined = true;
                acceptedTargets.add(`${nextFix.repairClass}::${nextFix.targetPointer}`);
                attemptedTargets.clear();
                repairSummary.patchAccepted = true;
                repairSummary.patchRejectedReason = null;
                if (
                  shouldReplaceBestRepairCandidate({
                    currentBestValidation: bestRepairedValidation,
                    currentBestScore: bestRepairedScore,
                    candidateValidation: roundCandidateValidation,
                    candidateScore: roundCandidateScore,
                  })
                ) {
                  bestRepairedLesson = roundCandidateLesson;
                  bestRepairedValidation = roundCandidateValidation;
                  bestRepairedScore = roundCandidateScore;
                  repairSummary.bestRepairedScore = roundCandidateScore.total;
                  repairSummary.bestRepairedRound = repairRound;
                }
              } else {
                finalPatchIssues.push('Patch did not improve the targeted field without regressing protected scoring domains.');
              }
            } else {
              finalPatchIssues.push('Patched lesson changed protected step structure or could not be stabilized safely.');
            }
          }

          repairSummary.repairAttempts.push({
            round: repairRound,
            attemptMode: currentMode,
            repairClass: nextFix.repairClass,
            targetPointer: nextFix.targetPointer,
            promptReturnedPatch,
            patchAccepted: acceptedPatch,
            patchRejectedCode: acceptedPatch ? null : derivePatchRejectedCode(finalPatchIssues[0]),
            patchRejectedReason: acceptedPatch ? null : finalPatchIssues[0] ?? 'Patch was not accepted.',
          });
          repairSummary.attemptedPatchCount += 1;
          if (!acceptedPatch) {
            previousRejectedCode = derivePatchRejectedCode(finalPatchIssues[0]);
            previousRejectedDetail = finalPatchIssues[0] ?? 'Patch was not accepted.';
            repairSummary.patchRejectedCode = derivePatchRejectedCode(finalPatchIssues[0]);
            repairSummary.patchRejectedReason = finalPatchIssues[0] ?? 'Patch was not accepted.';
          }

          const phase12Artifact = phases[phases.length - 1];
          if (phase12Artifact?.phase === phaseName) {
            phase12Artifact.output = {
              ...(phase12Artifact.output as Record<string, unknown>),
              repairTarget: nextFix,
              parsed: patchSet,
              allowedPointers: [nextFix.targetPointer],
              patchIssues: finalPatchIssues,
              candidateLesson: roundCandidateLesson,
              validation: roundCandidateValidation,
              localScore: roundCandidateScore,
              acceptedPatch,
              attemptMode: currentMode,
            };
            phase12Artifact.status = acceptedPatch ? 'completed' : 'failed';
          }
          logGenerationEvent(input, `${phaseName} processed`, {
            repairClass: nextFix.repairClass,
            targetPointer: nextFix.targetPointer,
            patchCount: patchSet.patches.length,
            acceptedPatch,
            validationPassed: roundCandidateValidation?.passed ?? false,
            patchIssues: finalPatchIssues,
            attemptMode: currentMode,
          });

          if (acceptedPatch) break;
        }
        }

        if (acceptedPatch) {
          repairSummary.acceptedPatchCount += 1;
          workingFixPlan = coerceFixPlan({}, workingScore, workingLesson, workingValidation, input);
          fixPlan = workingFixPlan;
        }
      }

      candidateLesson = bestRepairedLesson ?? workingLesson;
      candidateValidation = bestRepairedValidation ?? workingValidation;
      candidateScore = bestRepairedScore ?? workingScore;
    } else {
      repairSummary.repairStopReason = patchableFixes.length === 0 ? 'no_patchable_issues' : null;
      phases.push({
        phase: 'Phase 12 Refine',
        status: 'completed',
        output: {
          skipped: true,
          reason:
            fixPlan && patchableFixes.length === 0
              ? 'No patchable failed fields were available for patch-only refinement.'
              : 'Refinement only runs below 95 or on validation failure.',
        },
        startedAt: nowIso(),
        finishedAt: nowIso(),
      });
      logGenerationEvent(input, 'Phase 12 Refine skipped', {
        reason:
          fixPlan && patchableFixes.length === 0
            ? 'No patchable failed fields were available for patch-only refinement.'
            : 'Refinement only runs below 95 or on validation failure.',
      });
    }

    const decision = compareScores(score, candidateScore, validation.passed, candidateValidation.passed, refined);
    phases.push({
      phase: 'Phase 13 Rescore & Accept/Reject',
      status: decision.accepted ? 'completed' : 'failed',
      output: {
        candidateScore: refined ? candidateScore : score,
        decision,
        rescoredDuringRepair: refined,
      },
      startedAt: nowIso(),
      finishedAt: nowIso(),
    });
    logGenerationEvent(input, 'Phase 13 Rescore & Accept/Reject completed', {
      candidateScore: (refined ? candidateScore : score).total,
      candidateGrade: (refined ? candidateScore : score).grade,
      candidateValidationPassed: (refined ? candidateValidation : validation).passed,
      accepted: decision.accepted,
      reason: decision.reason,
      regressions: decision.regressions,
      rescoredDuringRepair: refined,
    });

    const finalLesson = refined && decision.acceptedSource === 'candidate' ? candidateLesson : lesson;
    const finalValidation = refined && decision.acceptedSource === 'candidate' ? candidateValidation : validation;
    const finalScore = refined && decision.acceptedSource === 'candidate' ? candidateScore : score;
    const finalFixPlan = coerceFixPlan({}, finalScore, finalLesson, finalValidation, input);
    const fidelityScore = scorePlanFidelity(stagePlan, planning, finalLesson);

    logGenerationEvent(input, 'run complete', {
      durationMs: durationMs(runStartedAtMs),
      accepted: decision.accepted,
      refined,
      finalScore: finalScore.total,
      planScore: planScore.total,
      fidelityScore: fidelityScore.total,
      finalGrade: finalScore.grade,
      finalValidationPassed: finalValidation.passed,
      rejectionReason: decision.accepted ? null : decision.reason,
    });

    const result: DynamicLessonGenerationResult = {
      lesson: finalLesson,
      phases,
      validation: finalValidation,
      score: finalScore,
      planScore,
      fidelityScore,
      refined,
      accepted: decision.accepted,
      rejectionReason: decision.accepted ? null : decision.reason,
      candidateLesson: refined ? candidateLesson : null,
      candidateValidation: refined ? candidateValidation : null,
      candidateScore: refined ? candidateScore : null,
      postRepairScore: refined ? candidateScore : null,
      repairSummary,
      fixPlan: finalFixPlan,
    };

    if (!this.options.disableAnalyticsLogging) {
      await logDynamicGenerationAnalytics({
        context: {
          lessonCode: input.lessonCode,
          sourceContext: input.sourceContext ?? null,
          origin: 'live_generation',
        },
        result,
      });
    }

    return result;
  }

  async rescoreLesson(input: {
    generationInput: DynamicLessonGenerationInput;
    lesson: DynamicGuidedV2Lesson;
    planning: DynamicPlanningPhaseOutput;
    vocabulary: DynamicVocabularyPhaseOutput;
    spacedReview?: DynamicSpacedReviewPhaseOutput | null;
  }): Promise<{
    score: DynamicLessonGenerationScore;
    planScore: DynamicDiagnosticScore;
    fidelityScore: DynamicDiagnosticScore;
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
    const score = buildLessonScore(input.lesson, validation, scoreRaw, usedFallback);
    const planScore = scoreLessonPlan(input.generationInput.stagePlan ?? defaultStagePlan(input.generationInput), input.planning, input.vocabulary, sourceGrounding);
    const fidelityScore = scorePlanFidelity(input.generationInput.stagePlan ?? defaultStagePlan(input.generationInput), input.planning, input.lesson);

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
      planScore,
      fidelityScore,
      validation,
      phaseArtifact,
    };
  }
}


