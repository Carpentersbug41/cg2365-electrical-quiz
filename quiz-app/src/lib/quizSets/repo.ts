import type { SupabaseClient } from '@supabase/supabase-js';

export interface StudentQuizSet {
  id: string;
  user_id: string;
  title: string;
  unit_code: string;
  level: 2 | 3;
  question_count: number;
  cadence_days: number;
  is_active: boolean;
  lesson_ids: string[];
  created_at: string;
  updated_at: string;
  lo_codes: string[];
}

export interface UpsertStudentQuizSetInput {
  title: string;
  unit_code: string;
  level: 2 | 3;
  question_count: number;
  cadence_days: number;
  lesson_ids: string[];
  lo_codes: string[];
  is_active?: boolean;
}

function normalizeLoCodes(loCodes: string[] | undefined): string[] {
  if (!Array.isArray(loCodes)) return [];
  return Array.from(
    new Set(
      loCodes
        .map((value) => String(value ?? '').trim())
        .filter((value) => value.length > 0)
    )
  );
}

function normalizeLessonIds(lessonIds: string[] | undefined): string[] {
  if (!Array.isArray(lessonIds)) return [];
  return Array.from(
    new Set(
      lessonIds
        .map((value) => String(value ?? '').trim())
        .filter((value) => /^[A-Z0-9-]+$/i.test(value))
    )
  );
}

function validatePayload(input: UpsertStudentQuizSetInput): void {
  if (!input.title || input.title.trim().length < 2) {
    throw new Error('Title must be at least 2 characters.');
  }
  if (!input.unit_code || input.unit_code.trim().length < 1) {
    throw new Error('unit_code is required.');
  }
  if (input.level !== 2 && input.level !== 3) {
    throw new Error('level must be 2 or 3.');
  }
  if (!Number.isFinite(input.question_count) || input.question_count < 1 || input.question_count > 100) {
    throw new Error('question_count must be between 1 and 100.');
  }
  if (!Number.isFinite(input.cadence_days) || input.cadence_days < 1 || input.cadence_days > 60) {
    throw new Error('cadence_days must be between 1 and 60.');
  }
  if (!Array.isArray(input.lesson_ids)) {
    throw new Error('lesson_ids must be an array.');
  }
}

async function getLoCodes(client: SupabaseClient, setId: string): Promise<string[]> {
  const { data, error } = await client
    .from('student_quiz_set_los')
    .select('lo_code')
    .eq('set_id', setId)
    .order('lo_code', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => String((row as { lo_code: string }).lo_code));
}

async function toStudentQuizSet(client: SupabaseClient, row: Record<string, unknown>): Promise<StudentQuizSet> {
  const id = String(row.id);
  return {
    id,
    user_id: String(row.user_id),
    title: String(row.title),
    unit_code: String(row.unit_code),
    level: Number(row.level) as 2 | 3,
    question_count: Number(row.question_count),
    cadence_days: Number(row.cadence_days),
    is_active: Boolean(row.is_active),
    lesson_ids: Array.isArray(row.lesson_ids) ? row.lesson_ids.map((value) => String(value)) : [],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    lo_codes: await getLoCodes(client, id),
  };
}

export async function listStudentQuizSets(client: SupabaseClient, userId: string): Promise<StudentQuizSet[]> {
  const { data, error } = await client
    .from('student_quiz_sets')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Record<string, unknown>[];
  const sets: StudentQuizSet[] = [];
  for (const row of rows) {
    sets.push(await toStudentQuizSet(client, row));
  }
  return sets;
}

export async function getStudentQuizSet(
  client: SupabaseClient,
  userId: string,
  setId: string
): Promise<StudentQuizSet | null> {
  const { data, error } = await client
    .from('student_quiz_sets')
    .select('*')
    .eq('id', setId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return toStudentQuizSet(client, data as Record<string, unknown>);
}

export async function createStudentQuizSet(
  client: SupabaseClient,
  userId: string,
  input: UpsertStudentQuizSetInput
): Promise<StudentQuizSet> {
  validatePayload(input);
  const loCodes = normalizeLoCodes(input.lo_codes);
  const lessonIds = normalizeLessonIds(input.lesson_ids);

  const { data, error } = await client
    .from('student_quiz_sets')
    .insert({
      user_id: userId,
      title: input.title.trim(),
      unit_code: input.unit_code.trim(),
      level: input.level,
      question_count: Math.floor(input.question_count),
      cadence_days: Math.floor(input.cadence_days),
      lesson_ids: lessonIds,
      is_active: input.is_active ?? true,
    })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create quiz set.');

  if (loCodes.length > 0) {
    const { error: losError } = await client.from('student_quiz_set_los').insert(
      loCodes.map((loCode) => ({
        set_id: data.id,
        lo_code: loCode,
      }))
    );
    if (losError) throw new Error(losError.message);
  }

  return toStudentQuizSet(client, data as Record<string, unknown>);
}

export async function updateStudentQuizSet(
  client: SupabaseClient,
  userId: string,
  setId: string,
  input: UpsertStudentQuizSetInput
): Promise<StudentQuizSet> {
  validatePayload(input);
  const loCodes = normalizeLoCodes(input.lo_codes);
  const lessonIds = normalizeLessonIds(input.lesson_ids);

  const { data, error } = await client
    .from('student_quiz_sets')
    .update({
      title: input.title.trim(),
      unit_code: input.unit_code.trim(),
      level: input.level,
      question_count: Math.floor(input.question_count),
      cadence_days: Math.floor(input.cadence_days),
      lesson_ids: lessonIds,
      is_active: input.is_active ?? true,
    })
    .eq('id', setId)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to update quiz set.');

  const { error: deleteError } = await client.from('student_quiz_set_los').delete().eq('set_id', setId);
  if (deleteError) throw new Error(deleteError.message);

  if (loCodes.length > 0) {
    const { error: losError } = await client.from('student_quiz_set_los').insert(
      loCodes.map((loCode) => ({
        set_id: setId,
        lo_code: loCode,
      }))
    );
    if (losError) throw new Error(losError.message);
  }

  return toStudentQuizSet(client, data as Record<string, unknown>);
}

export async function deleteStudentQuizSet(
  client: SupabaseClient,
  userId: string,
  setId: string
): Promise<void> {
  const { error } = await client
    .from('student_quiz_sets')
    .delete()
    .eq('id', setId)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
