import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';
import type { GuidedChunkCurriculumKey } from '@/lib/generation/guidedChunk/profiles';

export interface GuidedChunkGenerationInput {
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  sourceText: string;
  sourceRefs?: string[];
  targetAudience?: string;
  curriculum?: GuidedChunkCurriculumKey | 'gcse-science-biology' | 'gcse-science-physics';
  lessonProfileNotes?: string;
}

export interface GuidedChunkScaffoldChunk {
  chunkId: string;
  learningGoal: string;
  mustTeach: string[];
  mustNotRepeat: string[];
  vocab: Array<{ term: string; definition: string }>;
  misconceptions: string[];
  deeperQuestionFocus?: string;
  assessmentTargets?: string[];
  assetSuggestion?: 'none' | 'image';
  microbreakSuggestion?: 'none' | 'classify-two-bins';
}

export interface GuidedChunkLoScaffold {
  loId: string;
  loTitle: string;
  successCriteria: string[];
  reviewHooks: string[];
  chunkBlueprints: GuidedChunkScaffoldChunk[];
  endAssessmentFocus: string[];
}

export interface GuidedChunkGenerationMemory {
  coveredConcepts: string[];
  introducedVocab: string[];
  handledMisconceptions: string[];
  chunkSummaries: string[];
}

export interface GuidedChunkGenerationPhaseArtifact {
  phase: number;
  name: string;
  output: unknown;
}

export interface GuidedChunkGenerationResult {
  frame: GuidedChunkFrame;
  artifacts: GuidedChunkGenerationPhaseArtifact[];
  score?: GuidedChunkGenerationScore;
  validation?: GuidedChunkGenerationValidation;
}

export interface GuidedChunkGenerationIssue {
  category:
    | 'beginnerClarity'
    | 'teachingBeforeTesting'
    | 'markingRobustness'
    | 'alignmentToLO'
    | 'questionQuality';
  problem: string;
  suggestion: string;
}

export interface GuidedChunkGenerationScore {
  total: number;
  grade: 'ship' | 'strong' | 'usable' | 'rework';
  breakdown: {
    beginnerClarity: number;
    teachingBeforeTesting: number;
    markingRobustness: number;
    alignmentToLO: number;
    questionQuality: number;
  };
  issues: GuidedChunkGenerationIssue[];
  summary: string;
  scoringMode?: 'heuristic' | 'heuristic_plus_llm';
  refinementNotes?: string[];
}

export interface GuidedChunkGenerationValidation {
  passed: boolean;
  issues: string[];
}
