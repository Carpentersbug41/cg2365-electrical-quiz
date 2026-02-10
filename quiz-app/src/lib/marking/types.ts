/**
 * Marking System Types
 * Defines marking results, misconceptions, and feedback structures
 */

import { MisconceptionCode } from '@/data/questions/types';

/**
 * Marking Result: Outcome of answer evaluation
 */
export interface MarkingResult {
  isCorrect: boolean;
  score: number; // 0-1 or 0-100 depending on context
  userAnswer: string;
  expectedAnswer: string | string[];
  misconceptionCode?: MisconceptionCode;
  feedback: string;
  detailedFeedback?: {
    whatWasWrong?: string;
    whyItMatters?: string;
    howToFix?: string;
  };
  partialCredit?: {
    awarded: boolean;
    points: number;
    reason: string;
  };
  canRetry?: boolean;
  serviceUnavailable?: boolean;
  metadata?: {
    markedAt?: Date;
    markingStrategy: string;
    confidence?: number; // For AI-assisted marking
    feedbackEnhanced?: boolean; // True if LLM enhanced the feedback wording
    keywordMatches?: number; // DEPRECATED: Number of keywords matched
    keywordsRequired?: number; // DEPRECATED: Minimum keywords needed
    keywordsTotal?: number; // DEPRECATED: Total keywords available
    errorCode?: string; // Error code for LLM service failures
    errorType?: string; // Error type classification
    timestamp?: Date; // Timestamp for errors
    modelUsed?: string; // LLM model used for marking
  };
}

/**
 * Misconception Definition: Taxonomy entry
 */
export interface MisconceptionDefinition {
  code: MisconceptionCode;
  name: string;
  description: string;
  commonIn: string[]; // Topics where this appears
  fixPrompt: string; // Short correction message
  relatedBlockIds?: string[]; // Lesson blocks to review
  severity: 'minor' | 'moderate' | 'critical';
}

/**
 * Marking Strategy: How to evaluate an answer
 */
export type MarkingStrategy =
  | 'exact-match'           // Exact string match
  | 'normalized-match'      // After trimming, lowercasing
  | 'numeric-tolerance'     // Within tolerance range
  | 'contains-keywords'     // Contains required keywords
  | 'keyword-counting'      // NEW: Counts keywords and checks minimum threshold
  | 'regex-pattern'         // Matches regex
  | 'ai-assisted'           // LLM judges conceptual correctness
  | 'step-validation';      // Validates each step

/**
 * Answer Validation Config: Rules for marking
 */
export interface AnswerValidationConfig {
  strategy: MarkingStrategy;
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  acceptVariations?: boolean;
  requiredKeywords?: string[];
  minimumKeywordCount?: number; // NEW: Minimum keywords needed to pass (for conceptual questions)
  forbiddenKeywords?: string[];
  unitsRequired?: boolean;
  unitsList?: string[]; // Acceptable units
  tolerance?: number; // For numeric
  toleranceType?: 'absolute' | 'percentage';
  regexPattern?: string;
  partialCreditRules?: {
    condition: string;
    points: number;
  }[];
}

/**
 * Marking Request: API request for marking
 */
export interface MarkingRequest {
  questionId: string;
  userAnswer: string;
  answerType: string;
  expectedAnswers?: string[]; // Optional: for questions not in question bank
  validationConfig?: AnswerValidationConfig;
  // For LLM-based marking
  questionText?: string;
  expectedAnswer?: string; // Model answer for conceptual questions
  cognitiveLevel?: 'connection' | 'synthesis' | 'hypothesis';
  keyPoints?: string[]; // Rubric points for long-text questions
  context?: {
    lessonId: string;
    attemptNumber: number;
  };
}

/**
 * Marking Response: API response
 */
export interface MarkingResponse extends MarkingResult {
  suggestedNextAction: 'continue' | 'retry' | 'review' | 'fix';
  fixAction?: {
    misconceptionCode: MisconceptionCode;
    fixPrompt: string;
    retestQuestionId?: string;
  };
}

/**
 * Batch Marking Request: Mark multiple answers at once
 */
export interface BatchMarkingRequest {
  submissions: {
    questionId: string;
    userAnswer: string;
  }[];
  context?: {
    quizId: string;
    lessonId: string;
  };
}

/**
 * Batch Marking Response
 */
export interface BatchMarkingResponse {
  results: MarkingResult[];
  summary: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    totalScore: number;
    percentage: number;
    misconceptionsFound: MisconceptionCode[];
  };
  recommendations: {
    reviewLessonIds: string[];
    retakeQuiz: boolean;
    fixModeRecommended: boolean;
    targetedPractice: string[];
  };
}

/**
 * Step Validation: For multi-step answers
 */
export interface StepValidation {
  stepNumber: number;
  prompt: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
  expectedAnswer: string | string[];
}

/**
 * Step Validation Result: Complete multi-step marking
 */
export interface StepValidationResult {
  allStepsCorrect: boolean;
  steps: StepValidation[];
  overallFeedback: string;
  score: number;
  firstIncorrectStep?: number;
}





