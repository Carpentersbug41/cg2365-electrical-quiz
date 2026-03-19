import type { DynamicGuidedV2BasicQuestion, DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type {
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
  workedExampleObjective: string;
  guidedPracticeObjective: string;
  practiceObjective: string;
  integrativeObjective: string;
  spacedReviewObjective: string;
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
    retrievalTextLines: string[];
    hint?: string;
  }>;
};

export type DynamicUnderstandingChecksPhaseOutput = {
  teachChecks: Array<{
    title: string;
    basicQuestions: DynamicGuidedV2BasicQuestion[];
    deeperQuestionText: string;
    deeperAnswerGuidance: string[];
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
    answerGuidance: string[];
    hint?: string;
  };
  practice: {
    title: string;
    objective: string;
    retrievalTextLines: string[];
    questionText: string;
    answerGuidance: string[];
    hint?: string;
  };
};

export type DynamicIntegrationPhaseOutput = {
  integrative: {
    title: string;
    objective: string;
    retrievalTextLines: string[];
    questionText: string;
    answerGuidance: string[];
    hint?: string;
  };
};

export type DynamicSpacedReviewPhaseOutput = {
  title: string;
  objective: string;
  retrievalTextLines: string[];
  questionText: string;
  answerGuidance: string[];
};

export type DynamicLessonContentDraft = {
  teachChecks: Array<{
    title: string;
    objective: string;
    retrievalTextLines: string[];
    basicQuestions: DynamicGuidedV2BasicQuestion[];
    deeperQuestionText: string;
    deeperAnswerGuidance: string[];
    hint?: string;
  }>;
  workedExample: DynamicWorkedExamplePhaseOutput;
  guidedPractice: DynamicApplyPhaseOutput['guidedPractice'];
  practice: DynamicApplyPhaseOutput['practice'];
  integrative: DynamicIntegrationPhaseOutput['integrative'];
  spacedReview?: DynamicSpacedReviewPhaseOutput;
};

export type DynamicFixPlan = {
  summary: string;
  fixes: Array<{
    priority: 'high' | 'medium' | 'low';
    category:
      | 'beginnerClarity'
      | 'teachingBeforeTesting'
      | 'markingRobustness'
      | 'alignmentToLO'
      | 'questionQuality';
    targetPointers: string[];
    problem: string;
    repairInstruction: string;
  }>;
};

export type DynamicLessonAcceptanceDecision = {
  accepted: boolean;
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
  refined: boolean;
  accepted: boolean;
  rejectionReason: string | null;
  candidateLesson?: DynamicGuidedV2Lesson | null;
  candidateValidation?: DynamicLessonGenerationValidation | null;
  candidateScore?: DynamicLessonGenerationScore | null;
  fixPlan?: DynamicFixPlan | null;
};
