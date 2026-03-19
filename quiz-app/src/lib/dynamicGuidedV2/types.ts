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

export type DynamicGuidedV2BasicQuestion = {
  questionText: string;
  answerGuidance: string[];
};

export type DynamicGuidedV2Step = {
  id: string;
  sourceBlockId: string;
  title: string;
  role: DynamicGuidedV2StepRole;
  stage: DynamicGuidedV2Stage;
  progressionRule?: 'auto' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback';
  nextStepId?: string;
  objective: string;
  retrievalText: string;
  completionMode: 'continue' | 'respond';
  basicQuestions?: DynamicGuidedV2BasicQuestion[];
  questionText?: string;
  answerGuidance?: string[];
  deeperQuestionText?: string;
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
