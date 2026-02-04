/**
 * Type definitions for lesson generation system
 * 
 * ⚠️ CRITICAL FILE - READ BEFORE MODIFYING
 * See: reports/bulk_tasks/don't_touch.md
 * 
 * Changes to these types affect the ENTIRE generation system.
 * Every service, API route, and component relies on these definitions.
 * 
 * Common mistakes:
 * - Making fields optional that should be required → Runtime nulls
 * - Changing field names → Breaks every file that uses them
 * - Removing fields → Breaks API contracts, causes type errors everywhere
 * - Adding required fields without defaults → Breaks existing code
 * 
 * Before changing types:
 * 1. Search codebase for all usages
 * 2. Update ALL files that use the type
 * 3. Test frontend AND backend
 * 4. Check that old generated files still work
 * 
 * Breaking changes require:
 * - Migration for existing data
 * - Update to ALL services
 * - Thorough testing
 * 
 * If unsure, ASK FIRST. Type changes are high-risk.
 */

export interface GenerationRequest {
  unit: number;
  lessonId: string;
  topic: string;
  section: string;
  layout?: 'split-vis' | 'linear-flow';
  prerequisites?: string[];
  prerequisiteAnchors?: string; // Extracted key facts from prerequisite lessons for spaced review
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
  commitHash: string;
  commitUrl: string;
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
  commitHash: string;
  commitUrl: string;
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

// Re-export strict lint types from strictLintService
export type { LintErrorCode, LintFailure, StrictLintResult } from './strictLintService';
