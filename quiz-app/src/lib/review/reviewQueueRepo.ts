import type { SupabaseClient } from '@supabase/supabase-js';
import { QuizFeedbackReport, ReviewReason, ReviewSignalInput, WrongQuestionInput } from './types';

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
  review_reason: ReviewReason;
  priority_score: number;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

function reasonPriority(reason: ReviewReason): number {
  if (reason === 'misconception') return 100;
  if (reason === 'wrong') return 70;
  return 40; // guessing
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
  const legacyRows = (data ?? []) as ReviewQueueRow[];

  const v2Status =
    options?.status === 'active'
      ? ['due', 'completed']
      : options?.status === 'resolved'
        ? ['resolved']
        : ['due', 'completed', 'resolved'];
  const v2Limit = options?.limit ? Math.min(options.limit, 500) : 200;
  const { data: v2Data, error: v2Error } = await client
    .from('v2_review_items')
    .select('id, user_id, question_stable_id, status, times_wrong, times_right, due_at, resolved_at, created_at, updated_at, notes')
    .eq('user_id', userId)
    .in('status', v2Status)
    .order('due_at', { ascending: true })
    .limit(v2Limit);

  const v2Rows: ReviewQueueRow[] = [];
  if (v2Error) {
    if ((v2Error as { code?: string }).code !== '42P01') {
      throw new Error(v2Error.message);
    }
  } else {
    for (const row of v2Data ?? []) {
      const notes = (row.notes ?? {}) as { lo_code?: string | null; unit_code?: string | null; ac_code?: string | null };
      v2Rows.push({
        id: String(row.id),
        user_id: String(row.user_id),
        question_stable_id: String(row.question_stable_id),
        unit_code: notes.unit_code ?? null,
        lo_code: notes.lo_code ?? null,
        ac_code: notes.ac_code ?? null,
        status: row.status === 'resolved' ? 'resolved' : 'active',
        times_wrong: Number(row.times_wrong ?? 0),
        times_right: Number(row.times_right ?? 0),
        last_wrong_at: null,
        last_right_at: null,
        due_at: String(row.due_at),
        llm_why_wrong: null,
        llm_how_to_fix: null,
        llm_what_to_review: null,
        review_reason: 'wrong',
        priority_score: 50,
        resolved_at: row.resolved_at ? String(row.resolved_at) : null,
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
      });
    }
  }

  const merged = [...legacyRows, ...v2Rows]
    .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
    .slice(0, options?.limit ?? 50);

  return merged;
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

export async function lowerReviewQueuePriorityOnRetryPass(
  client: SupabaseClient,
  userId: string,
  questionStableId: string
): Promise<void> {
  const stableId = asQuestionStableId(questionStableId);
  if (!stableId) return;

  const { data: existing, error: getError } = await client
    .from('student_review_queue')
    .select('id, priority_score, review_reason, times_right, status')
    .eq('user_id', userId)
    .eq('question_stable_id', stableId)
    .maybeSingle();
  if (getError) throw new Error(getError.message);
  const now = new Date();
  if (existing) {
    const loweredPriority = Math.max(10, Number(existing.priority_score ?? 70) - 25);
    const downgradedReason =
      existing.review_reason === 'misconception'
        ? 'wrong'
        : existing.review_reason === 'wrong'
          ? 'guessing'
          : 'guessing';

    const nextDue = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    const { error } = await client
      .from('student_review_queue')
      .update({
        status: existing.status ?? 'active',
        review_reason: downgradedReason,
        priority_score: loweredPriority,
        times_right: (existing.times_right ?? 0) + 1,
        last_right_at: now.toISOString(),
        due_at: nextDue,
      })
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  }

  const { data: v2Existing, error: v2GetError } = await client
    .from('v2_review_items')
    .select('id, times_right')
    .eq('user_id', userId)
    .eq('question_stable_id', stableId)
    .maybeSingle();
  if (v2GetError && (v2GetError as { code?: string }).code !== '42P01') {
    throw new Error(v2GetError.message);
  }
  if (v2Existing) {
    const v2Due = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    const { error: v2UpdateError } = await client
      .from('v2_review_items')
      .update({
        status: 'completed',
        times_right: (v2Existing.times_right ?? 0) + 1,
        due_at: v2Due,
      })
      .eq('id', v2Existing.id);
    if (v2UpdateError) throw new Error(v2UpdateError.message);
  }
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
          review_reason: 'wrong',
          priority_score: reasonPriority('wrong'),
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
      review_reason: 'wrong',
      priority_score: reasonPriority('wrong'),
    });
    if (error) throw new Error(error.message);
  }
}

export async function upsertReviewSignals(
  client: SupabaseClient,
  userId: string,
  signals: ReviewSignalInput[]
): Promise<void> {
  const now = new Date().toISOString();

  for (const signal of signals) {
    const stableId = asQuestionStableId(signal.questionStableId);
    if (!stableId) continue;

    const { data: existing, error: getError } = await client
      .from('student_review_queue')
      .select('id, times_wrong, times_right')
      .eq('user_id', userId)
      .eq('question_stable_id', stableId)
      .maybeSingle();
    if (getError) throw new Error(getError.message);

    const nextReason = signal.reason;
    const nextPriority = reasonPriority(nextReason);

    if (existing) {
      const patch =
        nextReason === 'guessing'
          ? {
              status: 'active',
              times_right: (existing.times_right ?? 0) + 1,
              last_right_at: now,
              due_at: now,
              resolved_at: null,
              unit_code: signal.unitCode ?? null,
              lo_code: signal.loCode ?? null,
              ac_code: signal.acCode ?? null,
              review_reason: nextReason,
              priority_score: nextPriority,
            }
          : {
              status: 'active',
              times_wrong: (existing.times_wrong ?? 0) + 1,
              last_wrong_at: now,
              due_at: now,
              resolved_at: null,
              unit_code: signal.unitCode ?? null,
              lo_code: signal.loCode ?? null,
              ac_code: signal.acCode ?? null,
              review_reason: nextReason,
              priority_score: nextPriority,
            };
      const { error } = await client.from('student_review_queue').update(patch).eq('id', existing.id);
      if (error) throw new Error(error.message);
      continue;
    }

    const row =
      nextReason === 'guessing'
        ? {
            user_id: userId,
            question_stable_id: stableId,
            unit_code: signal.unitCode ?? null,
            lo_code: signal.loCode ?? null,
            ac_code: signal.acCode ?? null,
            status: 'active',
            times_wrong: 0,
            times_right: 1,
            last_right_at: now,
            due_at: now,
            review_reason: nextReason,
            priority_score: nextPriority,
          }
        : {
            user_id: userId,
            question_stable_id: stableId,
            unit_code: signal.unitCode ?? null,
            lo_code: signal.loCode ?? null,
            ac_code: signal.acCode ?? null,
            status: 'active',
            times_wrong: 1,
            times_right: 0,
            last_wrong_at: now,
            due_at: now,
            review_reason: nextReason,
            priority_score: nextPriority,
          };

    const { error } = await client.from('student_review_queue').insert(row);
    if (error) throw new Error(error.message);
  }
}
