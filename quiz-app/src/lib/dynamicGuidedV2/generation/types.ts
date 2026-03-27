import type { DynamicGuidedV2BasicQuestion, DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type {
  DynamicDiagnosticScore,
  DynamicGenerationPhaseArtifact,
  DynamicLessonGenerationScore,
  DynamicLessonGenerationValidation,
} from '@/lib/dynamicGuidedV2/versionStore';

export type DynamicLessonStageDescriptor = {
  key: string;
  title: string;
  role: 'outcomes' | 'explanation' | 'worked_example' | 'guided_practice' | 'practice' | 'integrative';
  stage: 'intro' | 'teach_check' | 'worked_example' | 'guided_practice' | 'practice' | 'integrative';
  objective: string;
  progressionRule?: 'auto' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback';
  completionMode: 'continue' | 'respond';
};

export type DynamicLessonGenerationInput = {
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  subject: string;
  audience: string;
  tonePrompt: string;
  sourceText: string;
  sourceRefs?: string[];
  stagePlan?: DynamicLessonStageDescriptor[];
  sourceContext?: string;
};

export type DynamicPlanningPhaseOutput = {
  lessonAim: string;
  taskMode: string;
  teachCheckCount: number;
  teachChecks: Array<{
    key: string;
    title: string;
    objective: string;
    conceptFocus: string;
    whyItMatters: string;
    misconceptions: string[];
  }>;
  workedExampleObjective?: string;
  guidedPracticeObjective?: string;
  practiceObjective?: string;
  integrativeObjective?: string;
  spacedReviewObjective?: string;
  inScope: string[];
  outOfScope: string[];
  constraints: string[];
};

export type DynamicVocabularyPhaseOutput = {
  terms: Array<{
    term: string;
    simpleDefinition: string;
    anchor: string;
    misconception?: string;
  }>;
  anchorPhrases: string[];
  misconceptionTargets: string[];
};

export type DynamicExplanationPhaseOutput = {
  teachChecks: Array<{
    title: string;
    objective: string;
    teachingPoints: string[];
    keyTerms: string[];
    keyIdeas: string[];
    misconceptions: string[];
    retrievalTextLines: string[];
    hint?: string;
  }>;
};

export type DynamicAuthoredBasicCheck = DynamicGuidedV2BasicQuestion & {
  questionForm?: string;
  sourceTeachingPointIds?: string[];
};

export type DynamicBasicChecksPhaseOutput = {
  teachChecks: Array<{
    title: string;
    basicQuestions: DynamicAuthoredBasicCheck[];
    hint?: string;
  }>;
};

export type DynamicDeeperChecksPhaseOutput = {
  teachChecks: Array<{
    title: string;
    deeperQuestionText: string;
    deeperSourceTeachingPointIds?: string[];
    hint?: string;
  }>;
};

export type DynamicUnderstandingChecksPhaseOutput = {
  teachChecks: Array<{
    title: string;
    basicQuestions: DynamicAuthoredBasicCheck[];
    deeperQuestionText: string;
    deeperSourceTeachingPointIds?: string[];
    hint?: string;
  }>;
};

export type DynamicWorkedExamplePhaseOutput = {
  title: string;
  objective: string;
  retrievalTextLines: string[];
  hint?: string;
};

export type DynamicApplyPhaseOutput = {
  guidedPractice: {
    title: string;
    objective: string;
    retrievalTextLines: string[];
    questionText: string;
    hint?: string;
  };
  practice: {
    title: string;
    objective: string;
    retrievalTextLines: string[];
    questionText: string;
    hint?: string;
  };
};

export type DynamicIntegrationPhaseOutput = {
  integrative: {
    title: string;
    objective: string;
    retrievalTextLines: string[];
    questionText: string;
    hint?: string;
  };
};

export type DynamicSpacedReviewQuestion = {
  sourceLo: string;
  questionText: string;
  hint?: string;
};

export type DynamicSpacedReviewCoverageItem = {
  sourceLo: string;
  lessonCodes: string[];
  anchorSummary: string;
};

export type DynamicSpacedReviewPhaseOutput = {
  title: string;
  objective: string;
  retrievalTextLines: string[];
  coveragePlan: DynamicSpacedReviewCoverageItem[];
  questions: DynamicSpacedReviewQuestion[];
};

export type DynamicSpacedReviewGroundingPacket = {
  unit: string;
  currentLessonCode: string;
  sourceMode: 'preceding_lessons' | 'unit_lo_fallback';
  loGroups: Array<{
    sourceLo: string;
    lessonCodes: string[];
    anchorFacts: string[];
  }>;
};

export type DynamicLessonContentDraft = {
  teachChecks: Array<{
    title: string;
    objective: string;
    teachingPoints: string[];
    keyTerms: string[];
    keyIdeas: string[];
    misconceptions: string[];
    retrievalTextLines: string[];
    basicQuestions: DynamicAuthoredBasicCheck[];
    deeperQuestionText: string;
    deeperSourceTeachingPointIds?: string[];
    hint?: string;
  }>;
  workedExample?: DynamicWorkedExamplePhaseOutput;
  guidedPractice?: DynamicApplyPhaseOutput['guidedPractice'];
  practice?: DynamicApplyPhaseOutput['practice'];
  integrative?: DynamicIntegrationPhaseOutput['integrative'];
  spacedReview?: DynamicSpacedReviewPhaseOutput;
};

export type DynamicAuthoredIntermediateLesson = {
  outcomes: string[];
  vocab: Array<{
    term: string;
    definition: string;
    anchor: string;
  }>;
  teachChecks: DynamicLessonContentDraft['teachChecks'];
  workedExample?: DynamicWorkedExamplePhaseOutput;
  guidedPractice?: DynamicApplyPhaseOutput['guidedPractice'];
  practice?: DynamicApplyPhaseOutput['practice'];
  integrative?: DynamicIntegrationPhaseOutput['integrative'];
  spacedReview?: DynamicSpacedReviewPhaseOutput;
};

export type DynamicFixPlan = {
  summary: string;
  fixes: Array<{
    fieldType: 'basic_question' | 'deeper_question' | 'anchor_fact' | 'key_idea' | 'key_term' | 'teaching_text';
    repairClass:
      | 'exact_replace'
      | 'basic_question_rewrite'
      | 'deeper_question_rewrite'
      | 'teaching_field_rewrite';
    repairMode: 'exact_replace' | 'field_rewrite';
    phaseKey?: string;
    priority: 'high' | 'medium' | 'low';
    severity: 'critical' | 'major' | 'minor';
    category:
      | 'beginnerClarity'
      | 'teachingBeforeTesting'
      | 'markingRobustness'
      | 'alignmentToLO'
      | 'questionQuality';
    targetPointer: string;
    problem: string;
    currentValue?: string;
    whyCurrentValueFails: string;
    mustPreserve: string;
    requiredFix: string;
    allowedTerms: string[];
    forbiddenTerms: string[];
    sourceEvidence: string[];
    replacementText?: string;
    replacementTarget?: string;
    badSpan?: string;
  }>;
};

export type DynamicRepairPatch = {
  jsonPointer: string;
  value: string | string[] | null;
};

export type DynamicRepairPatchSet = {
  patches: DynamicRepairPatch[];
};

export type DynamicRepairAttemptSummary = {
  round: number;
  attemptMode: 'specific' | 'general_fallback';
  repairClass: DynamicFixPlan['fixes'][number]['repairClass'];
  targetPointer: string;
  promptReturnedPatch: boolean;
  patchAccepted: boolean;
  patchRejectedCode: string | null;
  patchRejectedReason: string | null;
};

export type DynamicRepairSummary = {
  phase12Ran: boolean;
  repairRoundsRun: number;
  repairStopReason: 'no_patchable_issues' | 'all_patchable_attempted_and_resolved' | 'no_progress' | null;
  patchableIssueCountInitial: number;
  patchableIssueCountFinal: number;
  attemptedPatchCount: number;
  acceptedPatchCount: number;
  lastTargetPointer: string | null;
  lastRepairClass: DynamicFixPlan['fixes'][number]['repairClass'] | null;
  specificPromptReturnedPatch: boolean;
  fallbackPromptRan: boolean;
  fallbackPromptReturnedPatch: boolean;
  patchAccepted: boolean;
  patchRejectedCode: string | null;
  patchRejectedReason: string | null;
  repairAttempts: DynamicRepairAttemptSummary[];
};

export type DynamicLessonAcceptanceDecision = {
  accepted: boolean;
  acceptedSource: 'none' | 'original' | 'candidate';
  reason: string;
  originalScore: DynamicLessonGenerationScore;
  candidateScore: DynamicLessonGenerationScore;
  regressions: string[];
};

export type DynamicLessonGenerationResult = {
  lesson: DynamicGuidedV2Lesson;
  phases: DynamicGenerationPhaseArtifact[];
  validation: DynamicLessonGenerationValidation;
  score: DynamicLessonGenerationScore;
  planScore: DynamicDiagnosticScore;
  fidelityScore: DynamicDiagnosticScore;
  refined: boolean;
  accepted: boolean;
  rejectionReason: string | null;
  candidateLesson?: DynamicGuidedV2Lesson | null;
  candidateValidation?: DynamicLessonGenerationValidation | null;
  candidateScore?: DynamicLessonGenerationScore | null;
  postRepairScore?: DynamicLessonGenerationScore | null;
  repairSummary?: DynamicRepairSummary | null;
  fixPlan?: DynamicFixPlan | null;
};
