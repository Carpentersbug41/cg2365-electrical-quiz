export type DynamicGuidedV2StepRole =
  | 'outcomes'
  | 'vocab'
  | 'diagram'
  | 'explanation'
  | 'check'
  | 'worked_example'
  | 'guided_practice'
  | 'practice'
  | 'integrative'
  | 'spaced_review';

export type DynamicGuidedV2Stage =
  | 'intro'
  | 'teach_check'
  | 'worked_example'
  | 'guided_practice'
  | 'practice'
  | 'integrative'
  | 'spaced_review';

export type DynamicGuidedV2Asset = {
  title: string;
  description?: string;
  placeholderText?: string;
};

export type DynamicGuidedV2TaskSkeleton = {
  scenario?: string;
  steps?: string[];
  takeaway?: string;
  requiredOutputs?: string[];
};

export type DynamicGuidedV2BasicQuestion = {
  questionText: string;
  answerGuidance?: string[];
};

export type DynamicGuidedV2DeeperQuestionMode = 'connection' | 'synthesis' | 'hypothesis';

export type DynamicGuidedV2ArtifactVersion = 'legacy_rich' | 'thin_guard_rails';

export type DynamicGuidedV2Step = {
  id: string;
  sourceBlockId: string;
  title: string;
  role: DynamicGuidedV2StepRole;
  stage: DynamicGuidedV2Stage;
  progressionRule?: 'auto' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback';
  nextStepId?: string;
  objective: string;
  completionMode: 'continue' | 'respond';
  retrievalText?: string;
  keyTerms?: string[];
  keyIdeas?: string[];
  anchorFacts?: string[];
  misconceptionsToWatch?: string[];
  taskConstraints?: string[];
  questionIntent?: string;
  deeperQuestionIntent?: string;
  taskSkeleton?: DynamicGuidedV2TaskSkeleton;
  basicQuestions?: DynamicGuidedV2BasicQuestion[];
  questionText?: string;
  answerGuidance?: string[];
  deeperQuestionText?: string;
  deeperQuestionMode?: DynamicGuidedV2DeeperQuestionMode;
  deeperAnswerGuidance?: string[];
  hint?: string;
  asset?: DynamicGuidedV2Asset;
};

export type DynamicGuidedV2Lesson = {
  lessonId: string;
  lessonCode: string;
  title: string;
  subject: string;
  unit: string;
  audience: string;
  tonePrompt: string;
  comparisonSource: 'v1_lesson_json' | 'dynamic_generator';
  artifactVersion?: DynamicGuidedV2ArtifactVersion;
  keyTerms?: string[];
  keyIdeas?: string[];
  steps: DynamicGuidedV2Step[];
};

export type DynamicGuidedV2ThreadTurn = {
  id: string;
  role: 'tutor' | 'learner' | 'system';
  text: string;
  stepId?: string;
};

export type DynamicGuidedV2ChatResult = {
  assistantMessage: string;
  advance: boolean;
};
