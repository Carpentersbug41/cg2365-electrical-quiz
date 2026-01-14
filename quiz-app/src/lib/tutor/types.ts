/**
 * Tutor System Types
 * Defines tutor modes, messages, and context structures
 */

/**
 * Tutor Mode: Determines behavior and rules
 */
export type TutorMode = 'teach' | 'check' | 'fix';

/**
 * Message Role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Tutor Message
 */
export interface TutorMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  mode?: TutorMode; // Track which mode generated this message
  blockReferences?: string[]; // Block IDs referenced in this message
}

/**
 * Lesson Context: Injected into tutor for grounding
 */
export interface LessonContext {
  lessonId: string;
  lessonTitle: string;
  blocks: {
    id: string;
    type: string;
    content: string; // Formatted for LLM consumption
  }[];
  learningOutcomes: string[];
}

/**
 * Question Context: Current question being discussed
 */
export interface QuestionContext {
  questionId: string;
  questionText: string;
  category: string;
  section: string;
  options?: string[];
  answerType?: string;
  tags?: string[];
}

/**
 * Tutor Context: Complete context for tutor interaction
 */
export interface TutorContext {
  mode: TutorMode;
  lessonContext?: LessonContext;
  questionContext?: QuestionContext;
  history: TutorMessage[];
  userProgress?: {
    attemptsOnCurrentQuestion: number;
    lastAttemptWasCorrect?: boolean;
    identifiedMisconceptions?: string[];
  };
}

/**
 * Context Type: Whether we're in lesson or assessment
 */
export type ContextType = 'lesson' | 'assessment';

/**
 * Tutor Request: API request structure
 */
export interface TutorRequest {
  message: string;
  mode: TutorMode;
  contextType?: ContextType; // Explicit context for guardrails
  lessonContext?: LessonContext;
  questionContext?: QuestionContext;
  history: TutorMessage[];
  userProgress?: TutorContext['userProgress'];
  blockIdsToInclude?: string[]; // Specific block IDs to include (for context budget management)
  currentPracticeBlockId?: string; // Current practice block being worked on
}

/**
 * Tutor Response: API response structure
 */
export interface TutorResponse {
  response: string;
  blockReferences?: string[]; // Block IDs cited in response
  suggestedAction?: 'retry' | 'next' | 'review' | 'scaffold' | 'fix';
  requiresBlockSelection?: boolean; // True if grounding failed and student needs to point to specific content
  metadata?: {
    model: string;
    tokensUsed?: number;
    responseTime?: number;
  };
}

/**
 * Tutor Mode Config: Behavior rules for each mode
 */
export interface TutorModeConfig {
  mode: TutorMode;
  displayName: string;
  description: string;
  rules: string[];
  systemPrompt: string;
  temperature: number; // LLM temperature setting
  allowedActions: ('hint' | 'scaffold' | 'answer' | 'clarify' | 'correct')[];
}

/**
 * Scaffold Type: Different scaffolding strategies
 */
export type ScaffoldType =
  | 'binary-choice'     // "Is it A or B?"
  | 'fill-blank'        // "The formula is ___ = I × R"
  | 'step-prompt'       // "What's the first step?"
  | 'hint'              // General hint
  | 'worked-similar'    // Show similar worked example
  | 'diagram-highlight' // Highlight diagram element
  | 'formula-reminder'; // Remind of relevant formula

/**
 * Scaffold Action: Structured scaffolding prompt
 */
export interface ScaffoldAction {
  type: ScaffoldType;
  prompt: string;
  options?: string[]; // For binary-choice
  targetBlockId?: string; // For worked-similar
  diagramElementIds?: string[]; // For diagram-highlight
}

/**
 * Fix Action: Remediation targeting misconception
 */
export interface FixAction {
  misconceptionCode: string;
  shortCorrection: string;
  retestQuestionId?: string;
  relatedBlockIds?: string[];
}

/**
 * Tutor State: UI state management
 */
export interface TutorState {
  isOpen: boolean;
  isCollapsed: boolean;
  currentMode: TutorMode;
  messages: TutorMessage[];
  isLoading: boolean;
  error?: string;
}

/**
 * Diagram Action: Actions tutor can trigger on diagram
 */
export interface DiagramAction {
  action: 'highlight' | 'focus' | 'clear' | 'annotate';
  elementIds?: string[];
  duration?: number; // ms
  message?: string; // Annotation text
}





