/**
 * Lesson Content Types
 * Based on evidence-based learning structure with block-based content system
 */

export type BlockType =
  | 'outcomes'
  | 'vocab'
  | 'explanation'
  | 'worked-example'
  | 'guided-practice'
  | 'practice'
  | 'spaced-review'
  | 'diagram';

export type LayoutType = 'split-vis' | 'linear-flow' | 'focus-mode';

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

/**
 * Outcomes Block: Learning objectives with Bloom taxonomy
 */
export interface OutcomesBlockContent {
  outcomes: {
    text: string;
    bloomLevel: BloomLevel;
  }[];
}

/**
 * Vocabulary Block: Term/definition pairs
 */
export interface VocabBlockContent {
  terms: {
    term: string;
    definition: string;
  }[];
}

/**
 * Explanation Block: Rich text content with optional sub-sections
 */
export interface ExplanationBlockContent {
  title: string;
  content: string; // Markdown supported
  subsections?: {
    title: string;
    content: string;
  }[];
}

/**
 * Worked Example Block: Step-by-step solution model
 */
export interface WorkedExampleBlockContent {
  title: string;
  given: string;
  steps: {
    stepNumber: number;
    description: string;
    formula?: string;
    calculation?: string;
    result?: string;
  }[];
  notes?: string;
}

/**
 * Guided Practice Block: Step-based learner entry with scaffolding
 */
export interface GuidedPracticeBlockContent {
  title: string;
  problem: string;
  steps: {
    stepNumber: number;
    prompt: string;
    expectedAnswer: string | string[]; // Accept variations
    hint?: string;
  }[];
}

/**
 * Practice Block: Independent practice questions
 * All questions use LLM semantic evaluation
 */
export interface PracticeBlockContent {
  title: string;
  sequential?: boolean; // Forces sequential question unlocking
  questions: {
    id: string;
    questionText: string;
    expectedAnswer: string | string[]; // Model answer for LLM comparison
    cognitiveLevel?: 'recall' | 'connection' | 'synthesis'; // Depth of cognitive processing
    hint?: string;
  }[];
}

/**
 * Spaced Review Block: Review questions from prerequisites
 * All questions use LLM semantic evaluation
 */
export interface SpacedReviewBlockContent {
  title: string;
  questions: {
    id: string;
    questionText: string;
    expectedAnswer: string | string[]; // Model answer for LLM comparison
    hint?: string;
  }[];
  notes?: string;
}

/**
 * Diagram Block: Circuit diagram with stable element IDs
 */
export interface DiagramBlockContent {
  title: string;
  description: string;
  diagramType: 'series' | 'parallel' | 'mixed' | 'component' | 'concept';
  elementIds: string[]; // e.g., ['R1', 'R2', 'loop', 'branchA']
  placeholderText?: string; // For MVP before SVG implementation
  videoUrl?: string; // YouTube video URL or embed ID
  timestamps?: Array<{
    time: string; // Format: "0:45" or "1:23"
    label: string; // Description of what's shown
    elementId?: string; // Optional: related element ID
  }>;
  controls?: {
    id: string;
    label: string;
    action: 'highlight' | 'focus' | 'clear' | 'jumpToTimestamp';
    targetIds?: string[];
    timestamp?: string; // For jumpToTimestamp action
  }[];
}

/**
 * Block Content Union Type
 */
export type BlockContent =
  | OutcomesBlockContent
  | VocabBlockContent
  | ExplanationBlockContent
  | WorkedExampleBlockContent
  | GuidedPracticeBlockContent
  | PracticeBlockContent
  | SpacedReviewBlockContent
  | DiagramBlockContent;

/**
 * Block: Single content unit with stable ID
 */
export interface Block {
  id: string; // Format: "lessonId#blockId" e.g., "202-4A-outcomes"
  type: BlockType;
  content: BlockContent;
  order: number;
}

/**
 * Block ID Alias Map: For handling renamed blocks
 */
export interface BlockIdAliasMap {
  [oldBlockId: string]: string; // oldBlockId -> newBlockId
}

/**
 * Diagnostic Configuration: For prerequisite readiness checks
 */
export interface DiagnosticConfig {
  enabled: boolean;
  questionCount: number;
  passThreshold: number;
  sourceType: 'cumulative';
  allowSkip: boolean;
}

/**
 * Lesson: Complete lesson structure
 */
export interface Lesson {
  id: string; // e.g., "202-4A"
  title: string;
  description: string;
  layout: LayoutType;
  unit: string; // e.g., "Unit 202"
  topic: string; // e.g., "Series Circuits"
  learningOutcomes: string[]; // High-level outcomes
  prerequisites?: string[]; // Prerequisite lesson IDs
  blocks: Block[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author?: string;
    contentVersion?: number; // Version number for breaking changes
  };
  blockIdAliases?: BlockIdAliasMap; // Mapping for renamed blocks
  diagnostic?: DiagnosticConfig; // Optional diagnostic gate configuration
}

/**
 * Lesson Index: For listing/navigation
 */
export interface LessonIndex {
  id: string;
  title: string;
  description: string;
  unit: string;
  topic: string;
  order: number;
  available: boolean;
}


