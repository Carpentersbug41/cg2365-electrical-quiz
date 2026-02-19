import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  GeneratedQuestionDraftInput,
  QuestionGenerationRun,
  QuestionGenerationRunStep,
  QuestionItem,
  QuestionRunStatus,
  QuestionRunStepKey,
  QuestionRunStepStatus,
} from './types';

function requireSupabase() {
  const client = createSupabaseAdminClient();
  if (!client) {
    throw new Error('Supabase admin client is unavailable. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return client;
}

function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.map((item) => String(item));
}

function normalizeQuestionRow(row: Record<string, unknown>): QuestionItem {
  return {
    id: String(row.id),
    generation_run_id: row.generation_run_id == null ? null : String(row.generation_run_id),
    unit_code: String(row.unit_code),
    lo_code: row.lo_code == null ? null : String(row.lo_code),
    ac_code: row.ac_code == null ? null : String(row.ac_code),
    level: Number(row.level),
    difficulty: String(row.difficulty) as QuestionItem['difficulty'],
    format: String(row.format) as QuestionItem['format'],
    stem: String(row.stem),
    options: toStringArray(row.options),
    correct: Array.isArray(row.correct) ? row.correct.map((item) => String(item)) : String(row.correct),
    rationale: row.rationale == null ? null : String(row.rationale),
    tags: toStringArray(row.tags),
    source: String(row.source) as QuestionItem['source'],
    status: String(row.status) as QuestionItem['status'],
    hash: String(row.hash),
    version: Number(row.version),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    created_by: row.created_by == null ? null : String(row.created_by),
    approved_by: row.approved_by == null ? null : String(row.approved_by),
    approved_at: row.approved_at == null ? null : String(row.approved_at),
    doc_ref: row.doc_ref == null ? null : String(row.doc_ref),
  };
}

function normalizeRunRow(row: Record<string, unknown>): QuestionGenerationRun {
  return {
    id: String(row.id),
    unit_code: String(row.unit_code),
    level: Number(row.level) as 2 | 3,
    lo_codes: toStringArray(row.lo_codes),
    target_count: Number(row.target_count),
    format_mix: (row.format_mix as Record<string, number>) ?? {},
    difficulty_mix: (row.difficulty_mix as Record<string, number>) ?? {},
    status: String(row.status) as QuestionRunStatus,
    created_at: String(row.created_at),
    created_by: row.created_by == null ? null : String(row.created_by),
    summary: (row.summary as Record<string, unknown> | null) ?? null,
  };
}

function normalizeRunStepRow(row: Record<string, unknown>): QuestionGenerationRunStep {
  return {
    id: String(row.id),
    run_id: String(row.run_id),
    step_key: String(row.step_key) as QuestionRunStepKey,
    status: String(row.status) as QuestionRunStepStatus,
    started_at: row.started_at == null ? null : String(row.started_at),
    completed_at: row.completed_at == null ? null : String(row.completed_at),
    output: (row.output as Record<string, unknown> | null) ?? null,
    error: row.error == null ? null : String(row.error),
  };
}

export async function listQuestionRuns(limit = 50): Promise<QuestionGenerationRun[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_generation_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Math.max(1, limit));
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeRunRow(row as Record<string, unknown>));
}

export async function createQuestionRun(input: {
  unit_code: string;
  level: 2 | 3;
  lo_codes: string[] | null;
  target_count: number;
  format_mix: Record<string, number>;
  difficulty_mix: Record<string, number>;
  created_by?: string | null;
}): Promise<QuestionGenerationRun> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_generation_runs')
    .insert({
      unit_code: input.unit_code,
      level: input.level,
      lo_codes: input.lo_codes,
      target_count: input.target_count,
      format_mix: input.format_mix,
      difficulty_mix: input.difficulty_mix,
      status: 'queued',
      created_by: input.created_by ?? null,
    })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create question run.');
  return normalizeRunRow(data as Record<string, unknown>);
}

export async function getQuestionRun(runId: string): Promise<QuestionGenerationRun | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('question_generation_runs').select('*').eq('id', runId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeRunRow(data as Record<string, unknown>) : null;
}

export async function updateQuestionRun(
  runId: string,
  patch: Partial<Pick<QuestionGenerationRun, 'status' | 'summary'>>
): Promise<QuestionGenerationRun> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_generation_runs')
    .update(patch)
    .eq('id', runId)
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? `Question run not found: ${runId}`);
  return normalizeRunRow(data as Record<string, unknown>);
}

export async function listRunSteps(runId: string): Promise<QuestionGenerationRunStep[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_generation_run_steps')
    .select('*')
    .eq('run_id', runId)
    .order('started_at', { ascending: true, nullsFirst: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeRunStepRow(row as Record<string, unknown>));
}

export async function upsertRunStep(input: {
  run_id: string;
  step_key: QuestionRunStepKey;
  status: QuestionRunStepStatus;
  output?: Record<string, unknown> | null;
  error?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
}): Promise<QuestionGenerationRunStep> {
  const supabase = requireSupabase();
  const row = {
    run_id: input.run_id,
    step_key: input.step_key,
    status: input.status,
    output: input.output ?? null,
    error: input.error ?? null,
    started_at: input.started_at ?? null,
    completed_at: input.completed_at ?? null,
  };
  const { data, error } = await supabase
    .from('question_generation_run_steps')
    .upsert(row, { onConflict: 'run_id,step_key' })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to upsert question run step.');
  return normalizeRunStepRow(data as Record<string, unknown>);
}

export async function insertDraftQuestions(inputs: GeneratedQuestionDraftInput[]): Promise<QuestionItem[]> {
  if (inputs.length === 0) return [];
  const supabase = requireSupabase();
  const payload = inputs.map((item) => ({
    generation_run_id: item.generation_run_id,
    unit_code: item.unit_code,
    lo_code: item.lo_code,
    ac_code: item.ac_code,
    level: item.level,
    difficulty: item.difficulty,
    format: item.format,
    stem: item.stem,
    options: item.options,
    correct: item.correct,
    rationale: item.rationale,
    tags: item.tags,
    source: item.source,
    status: item.status,
    hash: item.hash,
    version: item.version ?? 1,
    doc_ref: item.doc_ref ?? null,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from('question_items').upsert(payload, { onConflict: 'hash' }).select('*');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeQuestionRow(row as Record<string, unknown>));
}

export async function listRunDrafts(runId: string): Promise<QuestionItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_items')
    .select('*')
    .eq('generation_run_id', runId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeQuestionRow(row as Record<string, unknown>));
}

export async function getQuestionById(questionId: string): Promise<QuestionItem | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('question_items').select('*').eq('id', questionId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeQuestionRow(data as Record<string, unknown>) : null;
}

export async function deleteQuestionById(questionId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('question_items').delete().eq('id', questionId);
  if (error) throw new Error(error.message);
}

export async function updateQuestionById(
  questionId: string,
  patch: Partial<
    Pick<
      QuestionItem,
      | 'stem'
      | 'options'
      | 'correct'
      | 'rationale'
      | 'tags'
      | 'status'
      | 'approved_at'
      | 'approved_by'
      | 'difficulty'
      | 'format'
      | 'lo_code'
      | 'ac_code'
      | 'unit_code'
      | 'level'
      | 'hash'
      | 'version'
    >
  >
): Promise<QuestionItem> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('question_items')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', questionId)
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? `Question not found: ${questionId}`);
  return normalizeQuestionRow(data as Record<string, unknown>);
}

export async function createQuestionReview(input: {
  question_id: string;
  action: 'approve' | 'reject' | 'edit' | 'retire';
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  actor: string | null;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('question_reviews').insert({
    question_id: input.question_id,
    action: input.action,
    before: input.before,
    after: input.after,
    actor: input.actor,
  });
  if (error) throw new Error(error.message);
}

export async function listApprovedQuestionsByScope(input: {
  unit_code: string;
  level: number;
  lo_codes?: string[];
  difficulty?: string;
  format?: string;
}): Promise<QuestionItem[]> {
  const supabase = requireSupabase();
  let query = supabase
    .from('question_items')
    .select('*')
    .eq('status', 'approved')
    .eq('unit_code', input.unit_code)
    .eq('level', input.level);

  if (input.lo_codes && input.lo_codes.length > 0) {
    query = query.in('lo_code', input.lo_codes);
  }
  if (input.difficulty) {
    query = query.eq('difficulty', input.difficulty);
  }
  if (input.format) {
    query = query.eq('format', input.format);
  }

  const { data, error } = await query.limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeQuestionRow(row as Record<string, unknown>));
}

export async function listApprovedQuestionCountsByUnit(): Promise<Array<{ unit_code: string; level: number }>> {
  const supabase = requireSupabase();
  const pageSize = 1000;
  let from = 0;
  const rows: Array<{ unit_code: string; level: number }> = [];

  while (true) {
    const { data, error } = await supabase
      .from('question_items')
      .select('unit_code, level')
      .eq('status', 'approved')
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);

    const page = (data ?? []).map((row) => ({
      unit_code: String((row as Record<string, unknown>).unit_code),
      level: Number((row as Record<string, unknown>).level),
    }));
    rows.push(...page);

    if (page.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

export async function listApprovedQuestionCountsByLo(unitCode: string): Promise<Array<{ lo_code: string | null }>> {
  const supabase = requireSupabase();
  const pageSize = 1000;
  let from = 0;
  const rows: Array<{ lo_code: string | null }> = [];

  while (true) {
    const { data, error } = await supabase
      .from('question_items')
      .select('lo_code')
      .eq('status', 'approved')
      .eq('unit_code', unitCode)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);

    const page = (data ?? []).map((row) => ({
      lo_code: (row as Record<string, unknown>).lo_code == null ? null : String((row as Record<string, unknown>).lo_code),
    }));
    rows.push(...page);

    if (page.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

export async function listQuestionsByScope(input: {
  unit_code: string;
  level: number;
  lo_codes?: string[];
  status?: string;
  include_retired?: boolean;
  limit?: number;
}): Promise<QuestionItem[]> {
  const supabase = requireSupabase();
  let query = supabase
    .from('question_items')
    .select('*')
    .eq('unit_code', input.unit_code)
    .eq('level', input.level);

  if (!input.include_retired) {
    query = query.neq('status', 'retired');
  }
  if (input.lo_codes && input.lo_codes.length > 0) {
    query = query.in('lo_code', input.lo_codes);
  }
  if (input.status && input.status.trim().length > 0) {
    query = query.eq('status', input.status.trim());
  }

  const safeLimit = Math.max(1, Math.min(2000, Number(input.limit ?? 500)));
  const { data, error } = await query.order('created_at', { ascending: false }).limit(safeLimit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeQuestionRow(row as Record<string, unknown>));
}
