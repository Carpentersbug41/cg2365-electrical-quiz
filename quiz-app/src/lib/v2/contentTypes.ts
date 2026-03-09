export type V2BlockType =
  | 'outcomes'
  | 'vocab'
  | 'explanation'
  | 'worked-example'
  | 'guided-practice'
  | 'practice'
  | 'spaced-review'
  | 'diagram'
  | 'microbreak'
  | 'socratic';

export type V2LayoutType = 'split-vis' | 'linear-flow' | 'focus-mode';
export type V2BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface V2OutcomesBlockContent {
  outcomes: {
    text: string;
    bloomLevel: V2BloomLevel;
  }[];
}

export interface V2VocabBlockContent {
  terms: {
    term: string;
    definition: string;
  }[];
}

export interface V2ExplanationBlockContent {
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface V2WorkedExampleBlockContent {
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

export interface V2GuidedPracticeBlockContent {
  title: string;
  problem: string;
  steps: {
    stepNumber: number;
    prompt: string;
    expectedAnswer: string | string[];
    hint?: string;
  }[];
}

export interface V2PracticeBlockContent {
  title: string;
  sequential?: boolean;
  questions: {
    id: string;
    questionText: string;
    answerType?: 'short-text' | 'long-text';
    expectedAnswer?: string | string[];
    keyPoints?: string[];
    cognitiveLevel?: 'recall' | 'connection' | 'synthesis';
    hint?: string;
  }[];
}

export interface V2SpacedReviewBlockContent {
  title: string;
  questions: {
    id: string;
    questionText: string;
    expectedAnswer: string | string[];
    hint?: string;
  }[];
  notes?: string;
}

export interface V2SocraticBlockContent {
  title: string;
  description?: string;
  enabled?: boolean;
  questionCount: number;
  startLevel: 1 | 2 | 3 | 4;
  allowVoiceInput?: boolean;
  allowVoiceOutput?: boolean;
}

export interface V2DiagramBlockContent {
  title: string;
  description: string;
  diagramType: 'series' | 'parallel' | 'mixed' | 'component' | 'concept' | 'circuit' | 'other';
  elementIds: string[];
  placeholderText?: string;
  videoUrl?: string;
  imageUrl?: string;
  embedUrl?: string;
  timestamps?: Array<{
    time: string;
    label: string;
    elementId?: string;
  }>;
  controls?: {
    id: string;
    label: string;
    action: 'highlight' | 'focus' | 'clear' | 'jumpToTimestamp';
    targetIds?: string[];
    timestamp?: string;
  }[];
}

export type V2MicrobreakType = 'rest' | 'game';
export type V2GameType =
  | 'matching'
  | 'sorting'
  | 'spot-error'
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

export interface V2MicrobreakGameBase {
  breakType: 'game';
  gameType: V2GameType;
  id?: string;
  prompt?: string;
  instructions?: string;
  difficulty?: 'easy' | 'medium';
  timerSeconds?: number;
  enableSound?: boolean;
  enableEffects?: boolean;
}

export interface V2RestMicrobreakContent {
  breakType: 'rest';
  duration: number;
  message?: string;
}

export interface V2MatchingGameContent {
  breakType: 'game';
  gameType: 'matching';
  duration: number;
  pairs: Array<{
    left: string;
    right: string;
  }>;
}

export interface V2SortingGameContent {
  breakType: 'game';
  gameType: 'sorting';
  duration: number;
  buckets: [string, string];
  items: Array<{
    text: string;
    correctBucket: 0 | 1;
  }>;
}

export interface V2SpotErrorGameContent {
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

export interface V2QuickWinGameContent {
  breakType: 'game';
  gameType: 'quick-win';
  duration: number;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface V2SequencingGameContent extends V2MicrobreakGameBase {
  gameType: 'sequencing';
  steps: string[];
  correctOrder: string[];
}

export interface V2FillGapGameContent extends V2MicrobreakGameBase {
  gameType: 'fill-gap';
  textTemplate: string;
  gaps: Array<{
    id: string;
    options: string[];
    correctOptionIndex: number;
  }>;
}

export interface V2IsCorrectWhyGameContent extends V2MicrobreakGameBase {
  gameType: 'is-correct-why';
  statement: string;
  isCorrect: boolean;
  reasons: string[];
  correctReasonIndex: number;
  explanation?: string;
  questions?: Array<{
    statement: string;
    isCorrect: boolean;
    reasons: string[];
    correctReasonIndex: number;
    explanation?: string;
  }>;
}

export interface V2DiagnosisRankedGameContent extends V2MicrobreakGameBase {
  gameType: 'diagnosis-ranked';
  scenario: string;
  options: string[];
  correctRankedIndices: [number, number];
  rationale?: string;
}

export interface V2ClassifyTwoBinsGameContent extends V2MicrobreakGameBase {
  gameType: 'classify-two-bins';
  leftLabel: string;
  rightLabel: string;
  items: Array<{
    text: string;
    correctBin: 'left' | 'right';
  }>;
}

export interface V2ScenarioMatchGameContent extends V2MicrobreakGameBase {
  gameType: 'scenario-match';
  pairs: Array<{
    scenario: string;
    answer: string;
  }>;
  distractors?: string[];
}

export interface V2FormulaBuildGameContent extends V2MicrobreakGameBase {
  gameType: 'formula-build';
  tokens: string[];
  correctSequence: string[];
  questions?: Array<{
    prompt?: string;
    tokens: string[];
    correctSequence: string[];
    timerSeconds?: number;
  }>;
}

export interface V2TapTheLineGameContent extends V2MicrobreakGameBase {
  gameType: 'tap-the-line';
  lines: string[];
  correctLineIndex: number;
  feedback?: string;
}

export interface V2TapTheWordGameContent extends V2MicrobreakGameBase {
  gameType: 'tap-the-word';
  sentence: string;
  options: string[];
  correctOptionIndex: number;
}

export interface V2EliminationGameContent extends V2MicrobreakGameBase {
  gameType: 'elimination';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export type V2MicrobreakContent =
  | V2RestMicrobreakContent
  | V2MatchingGameContent
  | V2SortingGameContent
  | V2SpotErrorGameContent
  | V2QuickWinGameContent
  | V2SequencingGameContent
  | V2FillGapGameContent
  | V2IsCorrectWhyGameContent
  | V2DiagnosisRankedGameContent
  | V2ClassifyTwoBinsGameContent
  | V2ScenarioMatchGameContent
  | V2FormulaBuildGameContent
  | V2TapTheLineGameContent
  | V2TapTheWordGameContent
  | V2EliminationGameContent;

export type V2BlockContent =
  | V2OutcomesBlockContent
  | V2VocabBlockContent
  | V2ExplanationBlockContent
  | V2WorkedExampleBlockContent
  | V2GuidedPracticeBlockContent
  | V2PracticeBlockContent
  | V2SpacedReviewBlockContent
  | V2DiagramBlockContent
  | V2MicrobreakContent
  | V2SocraticBlockContent;

export interface V2Block {
  id: string;
  type: V2BlockType;
  content: V2BlockContent;
  order: number;
}

export interface V2BlockIdAliasMap {
  [oldBlockId: string]: string;
}

export interface V2DiagnosticConfig {
  enabled: boolean;
  questionCount: number;
  passThreshold: number;
  sourceType: 'cumulative';
  allowSkip: boolean;
}

export interface V2Lesson {
  id: string;
  title: string;
  description: string;
  layout: V2LayoutType;
  unit: string;
  topic: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  blocks: V2Block[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author?: string;
    contentVersion?: number;
  };
  blockIdAliases?: V2BlockIdAliasMap;
  diagnostic?: V2DiagnosticConfig;
}
