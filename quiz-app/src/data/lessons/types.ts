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
  | 'diagram'
  | 'microbreak';

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
    answerType?: 'short-text' | 'long-text';  // Answer type (default: short-text)
    expectedAnswer?: string | string[];        // Model answer for LLM comparison
    keyPoints?: string[];                      // Rubric points for long-text
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
  diagramType: 'series' | 'parallel' | 'mixed' | 'component' | 'concept' | 'circuit' | 'other';
  elementIds: string[]; // e.g., ['R1', 'R2', 'loop', 'branchA']
  placeholderText?: string; // For MVP before SVG implementation
  videoUrl?: string; // YouTube video URL or embed ID
  imageUrl?: string; // Static image URL or local path (e.g., /images/lessons/diagram.png)
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
 * Microbreak Block: Short engagement reset activities
 */
export type MicrobreakType = 'rest' | 'game';
export type GameType =
  | 'matching'
  | 'sorting'
  | 'spot-error'
  | 'tap-label'
  | 'quick-win'
  | 'sequencing'
  | 'fill-gap'
  | 'is-correct-why'
  | 'diagnosis-ranked'
  | 'classify-two-bins'
  | 'scenario-match'
  | 'formula-build'
  | 'tap-the-line'
  | 'tap-the-word'
  | 'elimination';

export interface MicrobreakGameBase {
  breakType: 'game';
  gameType: GameType;
  id?: string;
  prompt?: string;
  instructions?: string;
  difficulty?: 'easy' | 'medium';
  timerSeconds?: number;
  enableSound?: boolean;
  enableEffects?: boolean;
}

export interface RestMicrobreakContent {
  breakType: 'rest';
  duration: number; // seconds (20-40)
  message?: string;
}

export interface MatchingGameContent {
  breakType: 'game';
  gameType: 'matching';
  duration: number; // seconds (60-120)
  pairs: Array<{
    left: string;
    right: string;
  }>;
}

export interface SortingGameContent {
  breakType: 'game';
  gameType: 'sorting';
  duration: number;
  buckets: [string, string]; // Exactly 2 categories
  items: Array<{
    text: string;
    correctBucket: 0 | 1; // Index of correct bucket
  }>;
}

export interface SpotErrorGameContent {
  breakType: 'game';
  gameType: 'spot-error';
  duration: number;
  scenario: string;
  options: Array<{
    text: string;
    isError: boolean;
  }>;
  explanation?: string;
}

export interface TapLabelGameContent {
  breakType: 'game';
  gameType: 'tap-label';
  duration: number;
  imageUrl?: string; // Optional diagram reference
  items: Array<{
    id: string;
    label: string;
    correctPosition: { x: number; y: number }; // Percentage-based
  }>;
}

export interface QuickWinGameContent {
  breakType: 'game';
  gameType: 'quick-win';
  duration: number;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface SequencingGameContent extends MicrobreakGameBase {
  gameType: 'sequencing';
  steps: string[];
  correctOrder: string[];
}

export interface FillGapGameContent extends MicrobreakGameBase {
  gameType: 'fill-gap';
  textTemplate: string;
  gaps: Array<{
    id: string;
    options: string[];
    correctOptionIndex: number;
  }>;
}

export interface IsCorrectWhyGameContent extends MicrobreakGameBase {
  gameType: 'is-correct-why';
  statement: string;
  isCorrect: boolean;
  reasons: string[];
  correctReasonIndex: number;
  explanation?: string;
}

export interface DiagnosisRankedGameContent extends MicrobreakGameBase {
  gameType: 'diagnosis-ranked';
  scenario: string;
  options: string[];
  correctRankedIndices: [number, number];
  rationale?: string;
}

export interface ClassifyTwoBinsGameContent extends MicrobreakGameBase {
  gameType: 'classify-two-bins';
  leftLabel: string;
  rightLabel: string;
  items: Array<{
    text: string;
    correctBin: 'left' | 'right';
  }>;
}

export interface ScenarioMatchGameContent extends MicrobreakGameBase {
  gameType: 'scenario-match';
  pairs: Array<{
    scenario: string;
    answer: string;
  }>;
  distractors?: string[];
}

export interface FormulaBuildGameContent extends MicrobreakGameBase {
  gameType: 'formula-build';
  tokens: string[];
  correctSequence: string[];
}

export interface TapTheLineGameContent extends MicrobreakGameBase {
  gameType: 'tap-the-line';
  lines: string[];
  correctLineIndex: number;
  feedback?: string;
}

export interface TapTheWordGameContent extends MicrobreakGameBase {
  gameType: 'tap-the-word';
  sentence: string;
  options: string[];
  correctOptionIndex: number;
}

export interface EliminationGameContent extends MicrobreakGameBase {
  gameType: 'elimination';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export type MicrobreakContent = 
  | RestMicrobreakContent
  | MatchingGameContent
  | SortingGameContent
  | SpotErrorGameContent
  | TapLabelGameContent
  | QuickWinGameContent
  | SequencingGameContent
  | FillGapGameContent
  | IsCorrectWhyGameContent
  | DiagnosisRankedGameContent
  | ClassifyTwoBinsGameContent
  | ScenarioMatchGameContent
  | FormulaBuildGameContent
  | TapTheLineGameContent
  | TapTheWordGameContent
  | EliminationGameContent;

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
  | DiagramBlockContent
  | MicrobreakContent;

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
 * 
 * IMPORTANT: Diagnostic gates determine which lessons to test based on 
 * lesson ORDER in lessonIndex.ts, NOT the prerequisites array in lesson files.
 * The diagnostic pulls questions from all lessons in the SAME UNIT with 
 * lower order values (e.g., 203-2C tests 203-1A through 203-2B).
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
  prerequisites?: string[]; // Lesson IDs for reference (NOT used for diagnostic gates - see DiagnosticConfig)
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

