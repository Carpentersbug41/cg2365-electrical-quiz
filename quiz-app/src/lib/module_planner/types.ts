export type ModuleStage = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

export type OrderingPreference = 'foundation-first' | 'lo-order';

export interface ModuleConstraints {
  minimiseLessons: boolean;
  defaultMaxLessonsPerLO: number;
  maxLessonsOverrides: Record<string, number>;
  level: string;
  audience: string;
}

export interface ModulePlanRequest {
  unit: string;
  selectedLos: string[];
  constraints: ModuleConstraints;
  orderingPreference: OrderingPreference;
  notes: string;
}

export interface UnitStructureLO {
  lo: string;
  title: string;
  sourceChunkIds: string[];
}

export interface UnitStructure {
  unit: string;
  unitTitle: string;
  los: UnitStructureLO[];
}

export interface CoverageTarget {
  acKey: string;
  acText: string;
  range: string | null;
  sourceChunkIds: string[];
}

export interface CoverageTargetsByLo {
  lo: string;
  coverageTargets: CoverageTarget[];
}

export interface CoverageTargets {
  unit: string;
  los: CoverageTargetsByLo[];
}

export interface PlannedLesson {
  topicCode: string;
  title: string;
  coversAcKeys: string[];
  whySplit: string | null;
}

export interface MinimalLessonPlanByLo {
  lo: string;
  lessonCount: number;
  lessons: PlannedLesson[];
}

export interface MinimalLessonPlan {
  unit: string;
  los: MinimalLessonPlanByLo[];
}

export interface LessonBlueprint {
  id: string;
  unit: string;
  lo: string;
  acAnchors: string[];
  topic: string;
  mustHaveTopics: string[];
  level: string;
  layout: 'split-vis' | 'linear-flow';
  prerequisites: string[];
}

export type ValidationIssueCode =
  | 'MISSING_AC'
  | 'DUPLICATE_AC_ASSIGNMENT'
  | 'DUPLICATE_LESSON'
  | 'OVERLAP_HIGH'
  | 'TOO_BROAD_SCOPE'
  | 'EXCEEDS_MAX_LESSONS'
  | 'RAG_EMPTY'
  | 'RAG_GROUNDEDNESS_FAIL'
  | 'JSON_SCHEMA_FAIL';

export interface ValidationIssue {
  stage: ModuleStage;
  severity: 'error' | 'warn';
  code: ValidationIssueCode;
  message: string;
  meta?: Record<string, string | number | boolean | null>;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface ModuleRunRow {
  id: string;
  created_at: string;
  unit: string;
  status: string;
  chat_transcript: string;
  request_json: ModulePlanRequest | null;
  request_hash: string | null;
}

export interface ModuleRunArtifactRow {
  id: string;
  module_run_id: string;
  stage: ModuleStage;
  artifact_json: unknown;
  retrieved_chunk_ids: string[];
  retrieved_chunk_text: string;
  created_at: string;
}

export interface ModuleRunLessonRow {
  id: string;
  module_run_id: string;
  blueprint_id: string;
  lesson_id: string;
  status: 'pending' | 'success' | 'failed';
  error: string | null;
}

export interface ModuleRunSummary {
  run: ModuleRunRow;
  artifacts: ModuleRunArtifactRow[];
  lessons: ModuleRunLessonRow[];
}

export interface StageExecutionResult<T> {
  stage: ModuleStage;
  replayed: boolean;
  artifact: T;
}

export interface StageReplayOptions {
  replayFromArtifacts?: boolean;
}

export interface DistillInput {
  unit?: string;
  selectedLos?: string[];
  constraints?: Partial<ModuleConstraints>;
  orderingPreference?: OrderingPreference;
  notes?: string;
  chatTranscript?: string;
  requestJson?: ModulePlanRequest;
}

export interface GenerateSummary {
  generated: number;
  failed: number;
  lessonIds: string[];
}

export interface RetrievedChunkRecord {
  id: string;
  unit: string;
  unitTitle: string;
  learningOutcome: string;
  loTitle: string;
  assessmentCriteria: string[];
  content: string;
}

