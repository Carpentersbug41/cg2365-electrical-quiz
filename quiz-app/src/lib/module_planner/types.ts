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
  syllabusVersionId: string;
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
  masterBlueprint?: MasterLessonBlueprint;
}

export type BloomTag = 'remember' | 'understand' | 'apply';

export interface MasterBlockPlanEntry {
  sequence: number;
  key: string;
  label: string;
  type:
    | 'outcomes'
    | 'vocab'
    | 'diagram'
    | 'explanation'
    | 'practice'
    | 'worked-example'
    | 'guided-practice'
    | 'spaced-review';
  mode?: 'conceptual' | 'integrative';
  order: number;
  id: string;
  required: boolean;
}

export interface MasterLessonBlueprint {
  identity: {
    lessonId: string;
    title: string;
    unit: string;
    topic: string;
    audience: string;
    layout: 'split-vis' | 'linear-flow';
    prerequisites: string[];
    diagramIds: string[];
  };
  anchors: {
    unit: string;
    learningOutcomes: string[];
    assessmentCriteria: string[];
    rangeItems: string[];
    examIntent: string[];
    acAnchors: string[];
  };
  scopeControl: {
    inScope: string[];
    outOfScope: Array<{ topic: string; taughtInLessonId: string | null }>;
    assumptions: string[];
  };
  lessonOutcomes: Array<{
    id: string;
    text: string;
    bloom: BloomTag;
    acAnchors: string[];
  }>;
  blockPlan: {
    entries: MasterBlockPlanEntry[];
    checksAfterExplanation: Array<{ explanationId: string; checkId: string }>;
  };
  checksSpec: {
    understandingChecks: Array<{
      id: string;
      recallCount: number;
      connectionCount: number;
      questionIds: string[];
    }>;
    integrative: {
      id: string;
      connectionCount: number;
      synthesisCount: number;
      questionIds: string[];
    };
  };
  practiceSpec: {
    guidedPracticeRequired: boolean;
    practiceCounts: {
      recall: number;
      apply: number;
      scenario: number;
      spotTheError: number;
    };
  };
  misconceptions: Array<{
    wrongBelief: string;
    correctBelief: string;
  }>;
  safetyRigRules: {
    required: boolean;
    rules: string[];
  };
  masteryGate: {
    rule: string;
    passCriteria: string[];
  };
  idConventions: {
    lessonIdPattern: string;
    blockIdPattern: string;
    questionIdPattern: string;
    integrativeIdPattern: string;
  };
}

export type ValidationIssueCode =
  | 'MISSING_AC'
  | 'DUPLICATE_AC_ASSIGNMENT'
  | 'UNKNOWN_AC_KEY'
  | 'DUPLICATE_LESSON'
  | 'OVERLAP_HIGH'
  | 'TOO_BROAD_SCOPE'
  | 'EXCEEDS_MAX_LESSONS'
  | 'RAG_EMPTY'
  | 'RAG_GROUNDEDNESS_FAIL'
  | 'JSON_SCHEMA_FAIL'
  | 'BLUEPRINT_MISSING_SECTION'
  | 'BLUEPRINT_BLOCK_ORDER_INVALID'
  | 'BLUEPRINT_ID_PATTERN_INVALID'
  | 'BLUEPRINT_ANCHOR_MISMATCH'
  | 'BLUEPRINT_GENERATION_MISMATCH';

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
  syllabus_version_id: string;
  unit: string;
  selected_los_json: string[];
  constraints_json: ModuleConstraints | null;
  ordering_preference: OrderingPreference | null;
  notes: string | null;
  status: string;
  error_json: unknown | null;
  chat_transcript: string;
  request_json: ModulePlanRequest | null;
  request_hash: string | null;
}

export interface ModuleRunArtifactRow {
  id: string;
  run_id: string;
  stage: ModuleStage;
  artifact_json: unknown;
  retrieved_chunk_ids: string[];
  retrieved_chunk_text: string;
  created_at: string;
}

export interface ModuleRunLessonRow {
  id: string;
  run_id: string;
  blueprint_id: string;
  lesson_id: string;
  status: 'pending' | 'success' | 'failed';
  error: string | null;
  lesson_json?: unknown | null;
  created_at?: string;
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
  syllabusVersionId?: string;
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
  pageStart?: number | null;
  pageEnd?: number | null;
}

export interface SyllabusVersionRow {
  id: string;
  filename: string;
  content_hash: string;
  created_at: string;
  meta_json: Record<string, unknown> | null;
}

export type SyllabusIngestionState = 'RUNNING' | 'READY' | 'FAILED';

export interface SyllabusIngestionRow {
  id: string;
  source: string;
  state: SyllabusIngestionState;
  syllabus_version_id: string | null;
  error_message: string | null;
  meta_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SyllabusChunkAnchor {
  pageStart: number | null;
  pageEnd: number | null;
  headingPath: string[];
  unitGuess: string | null;
  loGuess: string | null;
}

export interface SyllabusChunkRow {
  id: string;
  syllabus_version_id: string;
  ordinal: number;
  text: string;
  anchor_json: SyllabusChunkAnchor;
}

export interface CanonicalAc {
  acNumber: string;
  text?: string;
  acKey: string;
}

export interface CanonicalLo {
  loNumber: string;
  title?: string;
  acs: CanonicalAc[];
}

export interface CanonicalUnitStructure {
  unit: string;
  los: CanonicalLo[];
  range?: string[];
}

export interface SyllabusStructureRow {
  id: string;
  syllabus_version_id: string;
  unit: string;
  structure_json: CanonicalUnitStructure;
  created_at: string;
}
