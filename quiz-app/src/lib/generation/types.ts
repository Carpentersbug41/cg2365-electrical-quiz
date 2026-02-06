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
  foundationAnchors?: string; // Baseline electrical knowledge for lessons with no prerequisites
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

export interface PhaseProgress {
  phase: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  output?: string;
}

// Note: RefinementPatch is defined in phases/Phase10_Refinement.ts
// Import it when needed: import { RefinementPatch } from './phases/Phase10_Refinement';

export interface GenerationResponse {
  success: boolean;
  lessonFile: string;
  quizFile: string;
  commitHash: string;
  commitUrl: string;
  warnings: string[];
  errors?: string[];
  debugInfo?: DebugInfo;
  phases?: PhaseProgress[];
  refinementMetadata?: {
    wasRefined: boolean;
    originalScore: number;
    finalScore: number;
    patchesApplied: number;
    details: any[]; // RefinementPatch[] - using any[] to avoid circular dependency
  };
  debugBundle?: GenerationDebugBundle;
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
  debugData?: any[];  // QuestionDebugInfo[] - using any to avoid circular dependency
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

// Phase 10 Diagnostic Data Types
// Used for analyzing why refinement attempts fail or succeed
export interface Phase10DiagnosticData {
  lessonId: string;
  timestamp: string;
  
  // Scores (full breakdown from LLM scorer)
  originalScore: any;  // RubricScore from llmScoringService
  refinedScore: any;   // RubricScore from llmScoringService
  scoreDelta: number;
  
  // Patches applied during refinement
  patchesApplied: any[];  // RefinementPatch[] - using any to avoid circular dependency
  
  // Section-level impact analysis
  sectionImpacts: Array<{
    section: string;
    originalScore: number;
    refinedScore: number;
    delta: number;
    affectedByPatches: string[];  // JSON Pointer paths that affected this section
  }>;
  
  // Outcome
  wasAccepted: boolean;
  reason: 'improved' | 'declined' | 'no-change';
  
  // Lessons (for deep analysis)
  originalLesson?: any;  // Full Lesson object
  refinedLesson?: any;   // Full Lesson object
}

// Analysis output from LLM analyzer
export interface Phase10Analysis {
  lessonId: string;
  timestamp: string;
  diagnosticData: Phase10DiagnosticData;
  
  // LLM Analysis Results
  rootCause: string;
  harmfulPatches: Array<{
    path: string;
    intendedFix: string;
    actualEffect: string;
    whyHarmful: string;
    pointsLost: number;
  }>;
  reasoningFlaws: string[];
  patterns: string[];
  recommendations: string[];
  
  // Metadata
  analysisModel: string;
  analysisDuration: number;
}

// ============================================================================
// Phase 10 Debug Bundle Types
// ============================================================================

/**
 * Patch validation result - checks if a patch is safe to apply
 */
export interface PatchValidationResult {
  pathStyle: 'dot' | 'jsonPointer' | 'unknown';
  targetExists: boolean;
  fromProvided: boolean;
  fromMatches: boolean;
  wouldCreateStructure: boolean;
  allowedOp: boolean;
  allowedPath: boolean;
  reasons: string[];
}

/**
 * Issue extracted from rubric score for Phase 10 to fix
 */
export interface IssueToFix {
  section: string;
  issue: string;
  suggestion: string;
  pointsLost: number;
  severity: number;
}

/**
 * Debug information for a single patch with validation and isolation scoring
 */
export interface PatchDebug {
  index: number;
  op: 'replace' | 'prepend' | 'append' | 'replaceSubstring';
  path: string;
  from?: unknown;
  value: unknown;
  reason?: string;
  
  // Before/after values
  oldValue?: unknown;
  appliedValue?: unknown;
  
  // Application status
  applyStatus: 'applied' | 'rejected' | 'failed';
  applyError?: string;
  
  // Validation results
  validation: PatchValidationResult;
  
  // Isolation scoring results
  scoreDeltaSequential?: number;
  scoreDeltaIndependent?: number;
  sectionDeltasSequential?: Record<string, number>;
  sectionDeltasIndependent?: Record<string, number>;
  
  // Link to issue that caused this patch
  linkedIssueIndex?: number;
}

/**
 * Postmortem analysis from LLM analyzing a refinement run
 */
export interface PostmortemAnalysis {
  rootCause: string;
  harmfulPatches: Array<{
    patchIndex: number;
    why: string;
    pointsLost: number;
  }>;
  reasoningFlaws: string[];
  patterns: string[];
  recommendations: string[];
}

/**
 * Complete debug bundle for a generation run with Phase 10 refinement
 */
export interface GenerationDebugBundle {
  runId: string;
  timestampISO: string;
  
  // Lesson metadata
  lessonMeta: {
    id: string;
    unit?: number;
    topic?: string;
    title?: string;
  };
  
  // Models used
  models: {
    generator?: string;
    scorer?: string;
    phase10?: string;
    postmortem?: string;
  };
  
  // Configuration
  config: {
    phase10Threshold: number;
    phase10MaxFixes: number;
    environment?: string;
  };
  
  // Baseline (before Phase 10)
  baseline: {
    lesson: any; // Lesson object
    score: any;  // RubricScore object
  };
  
  // Phase 10 execution (if triggered)
  phase10?: {
    triggered: boolean;
    extractedIssues: IssueToFix[];
    prompts: {
      system: string;
      user: string;
    };
    llmRawResponse: string;
    llmParsed?: any;
    patches: PatchDebug[];
    refined?: {
      lesson: any; // Lesson object
      score: any;  // RubricScore object
    };
    accepted: boolean;
    rejectionReason?: string;
  };
  
  // Diffs and audits
  diffs: {
    changedPaths: string[];
    changedBlocks: number[];
    idAudit: {
      invalidIds: string[];
      duplicateIds: string[];
    };
  };
  
  // Postmortem analysis
  postmortem?: PostmortemAnalysis;
}
