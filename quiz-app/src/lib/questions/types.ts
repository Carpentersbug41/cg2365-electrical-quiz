export type QuestionDifficulty = 'easy' | 'med' | 'hard';
export type QuestionFormat = 'mcq' | 'multi_select' | 'short_answer' | 'scenario' | 'ordering' | 'matching';
export type QuestionSource = 'static' | 'generated' | 'syllabus_seed';
export type QuestionStatus = 'draft' | 'approved' | 'rejected' | 'retired';

export type QuestionRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type QuestionRunStepStatus = 'queued' | 'running' | 'completed' | 'failed' | 'skipped';
export type QuestionRunStepKey =
  | 'distill'
  | 'analyze'
  | 'extract_coverage'
  | 'plan'
  | 'build_blueprints'
  | 'validate'
  | 'refresh_summary';

export interface SyllabusAssessmentCriteria {
  unit_code: string;
  lo_code: string;
  ac_code: string;
  ac_text: string;
  range_notes: string | null;
}

export interface SyllabusLearningOutcome {
  unit_code: string;
  lo_code: string;
  lo_title: string | null;
  lo_text: string;
  assessment_criteria: SyllabusAssessmentCriteria[];
}

export interface SyllabusUnit {
  unit_code: string;
  unit_title: string;
  level_min: number;
  level_max: number;
  active: boolean;
  learning_outcomes: SyllabusLearningOutcome[];
}

export interface QuestionItem {
  id: string;
  generation_run_id: string | null;
  unit_code: string;
  lo_code: string | null;
  ac_code: string | null;
  level: number;
  difficulty: QuestionDifficulty;
  format: QuestionFormat;
  stem: string;
  options: string[] | null;
  correct: string | string[];
  rationale: string | null;
  tags: string[] | null;
  source: QuestionSource;
  status: QuestionStatus;
  hash: string;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  doc_ref: string | null;
}

export interface QuestionGenerationRun {
  id: string;
  unit_code: string;
  level: 2 | 3;
  lo_codes: string[] | null;
  target_count: number;
  format_mix: Record<string, number>;
  difficulty_mix: Record<string, number>;
  status: QuestionRunStatus;
  created_at: string;
  created_by: string | null;
  summary: Record<string, unknown> | null;
}

export interface QuestionGenerationRunStep {
  id: string;
  run_id: string;
  step_key: QuestionRunStepKey;
  status: QuestionRunStepStatus;
  started_at: string | null;
  completed_at: string | null;
  output: Record<string, unknown> | null;
  error: string | null;
}

export interface QuestionBlueprint {
  unit_code: string;
  lo_code: string;
  ac_code: string;
  level: 2 | 3;
  difficulty: QuestionDifficulty;
  format: QuestionFormat;
  learning_target: string;
  scenario_stub?: string;
  misconception_trap?: string;
  key_terms?: string[];
}

export interface GeneratedQuestionDraftInput {
  generation_run_id: string | null;
  unit_code: string;
  lo_code: string | null;
  ac_code: string | null;
  level: 2 | 3;
  difficulty: QuestionDifficulty;
  format: QuestionFormat;
  stem: string;
  options: string[] | null;
  correct: string | string[];
  rationale: string | null;
  tags: string[] | null;
  source: QuestionSource;
  status: QuestionStatus;
  hash: string;
  version?: number;
  doc_ref?: string | null;
}

export interface QuizBuildRequest {
  unit_code: string;
  level: 2 | 3;
  mode: 'unit' | 'lo';
  lo_codes?: string[];
  count: number;
  difficulty?: QuestionDifficulty;
}
