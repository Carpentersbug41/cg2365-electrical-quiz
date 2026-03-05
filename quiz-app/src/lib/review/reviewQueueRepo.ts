import type { SupabaseClient } from '@supabase/supabase-js';
import { QuizFeedbackReport, WrongQuestionInput } from './types';

export interface ReviewQueueRow {
  id: string;
  user_id: string;
  question_stable_id: string;
  unit_code: string | null;
  lo_code: string | null;
  ac_code: string | null;
  status: 'active' | 'resolved';
  times_wrong: number;
  times_right: number;
  last_wrong_at: string | null;
  last_right_at: string | null;
  due_at: string;
  llm_why_wrong: string | null;
  llm_how_to_fix: string | null;
  llm_what_to_review: string[] | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

function asQuestionStableId(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function listReviewQueue(
  client: SupabaseClient,
  userId: string,
  options?: {
    status?: 'active' | 'resolved';
    limit?: number;
  }
): Promise<ReviewQueueRow[]> {
  let query = client
    .from('student_review_queue')
    .select('*')
    .eq('user_id', userId)
    .order('due_at', { ascending: true })
    .order('updated_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ReviewQueueRow[];
}

export async function resolveReviewQueueItemOnCorrect(
  client: SupabaseClient,
  userId: string,
  questionStableId: string
): Promise<void> {
  const stableId = asQuestionStableId(questionStableId);
  if (!stableId) return;

  const { data: existing, error: getError } = await client
    .from('student_review_queue')
    .select('id, times_right, status')
    .eq('user_id', userId)
    .eq('question_stable_id', stableId)
    .maybeSingle();
  if (getError) throw new Error(getError.message);
  if (!existing) return;

  const now = new Date().toISOString();
  const { error } = await client
    .from('student_review_queue')
    .update({
      status: 'resolved',
      times_right: (existing.times_right ?? 0) + 1,
      last_right_at: now,
      resolved_at: now,
      due_at: now,
    })
    .eq('id', existing.id);
  if (error) throw new Error(error.message);
}

export async function upsertWrongItemsFromReport(
  client: SupabaseClient,
  userId: string,
  wrongQuestions: WrongQuestionInput[],
  report: QuizFeedbackReport
): Promise<void> {
  const now = new Date().toISOString();

  for (const question of wrongQuestions) {
    const stableId = asQuestionStableId(question.questionStableId);
    if (!stableId) continue;

    const reportItem = report.items.find((item) => item.questionNumber === question.questionNumber);
    const { data: existing, error: getError } = await client
      .from('student_review_queue')
      .select('id, times_wrong')
      .eq('user_id', userId)
      .eq('question_stable_id', stableId)
      .maybeSingle();
    if (getError) throw new Error(getError.message);

    if (existing) {
      const { error } = await client
        .from('student_review_queue')
        .update({
          status: 'active',
          times_wrong: (existing.times_wrong ?? 0) + 1,
          last_wrong_at: now,
          due_at: now,
          resolved_at: null,
          unit_code: question.unitCode ?? null,
          lo_code: question.loCode ?? null,
          ac_code: question.acCode ?? null,
          llm_why_wrong: reportItem?.whyWrong ?? null,
          llm_how_to_fix: reportItem?.howToGetRight ?? null,
          llm_what_to_review: reportItem?.whatToReview ?? null,
        })
        .eq('id', existing.id);
      if (error) throw new Error(error.message);
      continue;
    }

    const { error } = await client.from('student_review_queue').insert({
      user_id: userId,
      question_stable_id: stableId,
      unit_code: question.unitCode ?? null,
      lo_code: question.loCode ?? null,
      ac_code: question.acCode ?? null,
      status: 'active',
      times_wrong: 1,
      times_right: 0,
      last_wrong_at: now,
      due_at: now,
      llm_why_wrong: reportItem?.whyWrong ?? null,
      llm_how_to_fix: reportItem?.howToGetRight ?? null,
      llm_what_to_review: reportItem?.whatToReview ?? null,
    });
    if (error) throw new Error(error.message);
  }
}
