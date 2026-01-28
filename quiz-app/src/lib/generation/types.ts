/**
 * Type definitions for lesson generation system
 */

export interface GenerationRequest {
  unit: number;
  lessonId: string;
  topic: string;
  section: string;
  layout?: 'split-vis' | 'linear-flow';
  prerequisites?: string[];
  mustHaveTopics?: string;
  additionalInstructions?: string;
  youtubeUrl?: string;
  imageUrl?: string;
}

export interface DebugInfo {
  rawResponse: string;
  parseError: string;
  errorPosition?: {
    message: string;
    position?: number;
    line?: number;
    column?: number;
  };
  contentPreview?: {
    before: string;
    errorLocation: string;
    after: string;
  };
  attemptedOperation: string;
  timestamp: string;
}

export interface GenerationResponse {
  success: boolean;
  lessonFile: string;
  quizFile: string;
  branchName: string;
  branchUrl: string;
  warnings: string[];
  errors?: string[];
  debugInfo?: DebugInfo;
}

export interface LessonBlock {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  layout: 'split-vis' | 'linear-flow';
  unit: string;
  topic: string;
  learningOutcomes: string[];
  prerequisites: string[];
  blocks: LessonBlock[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  misconceptionCodes?: Record<number, string>;
  section: string;
  category: string;
  tags: string[];
  learningOutcomeId: string;
  answerType: string;
  difficulty: number;
  estimatedTime: number;
  explanation: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileIntegrationResult {
  success: boolean;
  filesUpdated: string[];
  errors: string[];
}

export interface GitResult {
  success: boolean;
  branchName: string;
  branchUrl: string;
  commitHash?: string;
  error?: string;
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
  examples?: string[];
}

export interface GenerationProgress {
  stage: 'prompt' | 'lesson' | 'quiz' | 'validation' | 'integration' | 'git' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
}
