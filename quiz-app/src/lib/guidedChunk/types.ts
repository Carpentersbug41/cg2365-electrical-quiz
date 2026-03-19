import type { Block } from '@/data/lessons/types';

export type GuidedChunkQuestionKind = 'initial' | 'follow_up' | 'repair' | 'deeper';

export interface GuidedChunkVocabItem {
  term: string;
  definition: string;
  confusionWith?: string;
}

export interface GuidedChunkQuestion {
  id: string;
  prompt: string;
  acceptableAnswers?: string[];
  expectedConcepts: string[];
  hint?: string;
}

export interface GuidedChunkRepairTemplate {
  misconceptionCode: string;
  triggerPhrases?: string[];
  shortCorrection: string;
  contrastPrompt: string;
  retryPrompt: string;
}

export interface GuidedChunkImageAsset {
  kind: 'image';
  assetId: string;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

export type GuidedChunkAssetInjection = GuidedChunkImageAsset | null;

export interface GuidedChunkAdvanceRule {
  minAcceptedRecallAnswers: number;
  maxRepairLoops: number;
  allowAdvanceOnFlaggedWeakness: boolean;
}

export interface GuidedChunkMicrobreak {
  id: string;
  intro: string;
  resumePrompt: string;
  block: Block;
}

export interface GuidedChunkChunk {
  chunkId: string;
  chunkIndex: number;
  learningGoal: string;
  teachingCore: string;
  teachingWordCount: number;
  vocabPack: GuidedChunkVocabItem[];
  initialRecallQuestions: GuidedChunkQuestion[];
  candidateFollowUpModes: string[];
  candidateDeeperQuestion?: GuidedChunkQuestion | null;
  misconceptionCodes: string[];
  repairTemplates: GuidedChunkRepairTemplate[];
  assetInjection?: GuidedChunkAssetInjection;
  microbreakAfter?: GuidedChunkMicrobreak | null;
  advanceRule: GuidedChunkAdvanceRule;
}

export interface GuidedChunkMcqQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GuidedChunkShortAnswerTestQuestion {
  id: string;
  prompt: string;
  acceptableAnswers?: string[];
  expectedConcepts: string[];
}

export interface GuidedChunkLoTest {
  intro: string;
  mcqs: GuidedChunkMcqQuestion[];
  shortAnswers: GuidedChunkShortAnswerTestQuestion[];
}

export interface GuidedChunkLo {
  loId: string;
  loTitle: string;
  successCriteria: string[];
  chunkPlan: GuidedChunkChunk[];
  loTestMcq: GuidedChunkLoTest;
  loTestShortAnswer: GuidedChunkLoTest;
  reviewHooks: string[];
}

export interface GuidedChunkFrame {
  lessonId: string;
  lessonCode: string;
  title: string;
  runtimeVersion: string;
  variantId: string;
  unit: string;
  topic: string;
  sourceRefs: string[];
  loSequence: GuidedChunkLo[];
  metadata: {
    created: string;
    updated: string;
    author: string;
  };
}

export interface GuidedChunkThreadMessageTurn {
  id: string;
  role: 'assistant' | 'user';
  kind: 'message';
  content: string;
  createdAt: string;
  stream?: boolean;
}

export interface GuidedChunkThreadDividerTurn {
  id: string;
  role: 'system';
  kind: 'divider';
  label: string;
  content: string;
  createdAt: string;
}

export interface GuidedChunkThreadImageTurn {
  id: string;
  role: 'system';
  kind: 'image';
  asset: GuidedChunkImageAsset;
  createdAt: string;
}

export interface GuidedChunkThreadMicrobreakTurn {
  id: string;
  role: 'system';
  kind: 'microbreak';
  intro: string;
  microbreak: GuidedChunkMicrobreak;
  createdAt: string;
}

export interface GuidedChunkThreadLoTestTurn {
  id: string;
  role: 'assistant';
  kind: 'lo_test_intro';
  content: string;
  createdAt: string;
  stream?: boolean;
}

export type GuidedChunkTurn =
  | GuidedChunkThreadMessageTurn
  | GuidedChunkThreadDividerTurn
  | GuidedChunkThreadImageTurn
  | GuidedChunkThreadMicrobreakTurn
  | GuidedChunkThreadLoTestTurn;

export interface GuidedChunkActiveQuestion {
  questionId: string;
  prompt: string;
  kind: GuidedChunkQuestionKind;
  sourceQuestionId?: string;
  acceptableAnswers?: string[];
  expectedConcepts: string[];
}

export interface GuidedChunkChunkProgress {
  loIndex: number;
  chunkIndex: number;
  askedInitialQuestionIds: string[];
  acceptedInitialQuestionIds: string[];
  repairLoops: number;
  deeperAsked: boolean;
  deeperAccepted: boolean;
  flaggedForReview: boolean;
  activeQuestion: GuidedChunkActiveQuestion;
}

export type GuidedChunkSessionStep =
  | { kind: 'question'; chunk: GuidedChunkChunkProgress }
  | { kind: 'microbreak'; loIndex: number; chunkIndex: number }
  | { kind: 'lo_test'; loIndex: number; loTest: GuidedChunkLoTest }
  | { kind: 'completed' };

export interface GuidedChunkReviewFlag {
  loId: string;
  chunkId: string;
  misconceptionCode?: string | null;
  reason: string;
}

export interface GuidedChunkLoResult {
  loId: string;
  mcqCorrect: number;
  mcqTotal: number;
  shortAnswerPassed: number;
  shortAnswerTotal: number;
}

export interface GuidedChunkEvent {
  id: string;
  type: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface GuidedChunkSession {
  id: string;
  lessonCode: string;
  lessonVersionId?: string | null;
  lessonStatus?: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired' | 'builtin' | null;
  userId?: string | null;
  sourceContext?: string | null;
  runtimeVersion: string;
  variantId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'abandoned';
  currentLoIndex: number;
  thread: GuidedChunkTurn[];
  step: GuidedChunkSessionStep;
  reviewFlags: GuidedChunkReviewFlag[];
  loResults: GuidedChunkLoResult[];
  events: GuidedChunkEvent[];
  syncedEventIds?: string[];
  syncedReviewKeys?: string[];
}

export interface GuidedChunkEvaluationResult {
  accepted: boolean;
  outcome: 'accepted' | 'follow_up' | 'repair' | 'advance_with_flag' | 'clarification';
  feedback: string;
  followUpQuestion?: string;
  misconceptionCode?: string | null;
  rationale?: string;
}

export interface GuidedChunkLoTestSubmission {
  mcqAnswers: Record<string, number>;
  shortAnswers: Record<string, string>;
}

export interface GuidedChunkSessionPayload {
  sessionId: string;
  lessonCode: string;
  lessonVersionId?: string | null;
  lessonStatus?: string | null;
  lessonTitle: string;
  unit: string;
  topic: string;
  runtimeVersion: string;
  variantId: string;
  thread: GuidedChunkTurn[];
  step: GuidedChunkSessionStep;
  progress: {
    currentLoIndex: number;
    loCount: number;
    currentChunkIndex: number | null;
    chunkCountInCurrentLo: number | null;
    reviewFlagCount: number;
  };
  animateTurnIds: string[];
}
