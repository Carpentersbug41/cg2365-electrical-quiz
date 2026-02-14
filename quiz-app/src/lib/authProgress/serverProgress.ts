import type { SupabaseClient } from '@supabase/supabase-js';
import { AttemptPayload } from './types';

interface LessonProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'started' | 'completed' | 'abandoned';
  mastery_status: 'pending' | 'achieved';
  score_best: number | null;
  attempts_count: number;
  started_at: string | null;
  last_activity_at: string | null;
  completed_at: string | null;
}

async function getLessonProgress(
  client: SupabaseClient,
  userId: string,
  lessonId: string
): Promise<LessonProgressRow | null> {
  const { data, error } = await client
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle<LessonProgressRow>();

  if (error) {
    throw error;
  }

  return data ?? null;
}

function maxScore(existing: number | null, incoming: number | null | undefined): number | null {
  if (incoming === null || incoming === undefined) {
    return existing;
  }

  if (existing === null || existing === undefined) {
    return incoming;
  }

  return Math.max(existing, incoming);
}

export async function upsertLessonStart(
  client: SupabaseClient,
  userId: string,
  lessonId: string
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await getLessonProgress(client, userId, lessonId);

  if (!existing) {
    const { error } = await client.from('lesson_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'started',
      mastery_status: 'pending',
      attempts_count: 0,
      started_at: now,
      last_activity_at: now,
    });
    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await client
    .from('lesson_progress')
    .update({
      status: existing.status === 'completed' ? 'completed' : 'started',
      started_at: existing.started_at ?? now,
      last_activity_at: now,
    })
    .eq('id', existing.id);

  if (error) {
    throw error;
  }
}

export async function upsertLessonComplete(
  client: SupabaseClient,
  userId: string,
  lessonId: string,
  options?: {
    score?: number;
    masteryAchieved?: boolean;
  }
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await getLessonProgress(client, userId, lessonId);
  const incomingScore = options?.score;
  const masteryStatus = options?.masteryAchieved ? 'achieved' : 'pending';

  if (!existing) {
    const { error } = await client.from('lesson_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'completed',
      mastery_status: masteryStatus,
      score_best: incomingScore ?? null,
      attempts_count: 1,
      started_at: now,
      last_activity_at: now,
      completed_at: now,
    });
    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await client
    .from('lesson_progress')
    .update({
      status: 'completed',
      mastery_status:
        existing.mastery_status === 'achieved' || options?.masteryAchieved
          ? 'achieved'
          : 'pending',
      score_best: maxScore(existing.score_best, incomingScore),
      attempts_count: existing.attempts_count + 1,
      started_at: existing.started_at ?? now,
      last_activity_at: now,
      completed_at: now,
    })
    .eq('id', existing.id);

  if (error) {
    throw error;
  }
}

export async function updateLessonProgressFromAttempt(
  client: SupabaseClient,
  userId: string,
  attempt: AttemptPayload
): Promise<void> {
  if (!attempt.lesson_id) {
    return;
  }

  const lessonId = attempt.lesson_id;
  const now = new Date().toISOString();
  const existing = await getLessonProgress(client, userId, lessonId);

  if (!existing) {
    const { error } = await client.from('lesson_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'started',
      mastery_status: 'pending',
      score_best: null,
      attempts_count: 0,
      started_at: now,
      last_activity_at: now,
    });
    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await client
    .from('lesson_progress')
    .update({
      status: existing.status === 'completed' ? 'completed' : 'started',
      started_at: existing.started_at ?? now,
      last_activity_at: now,
    })
    .eq('id', existing.id);

  if (error) {
    throw error;
  }
}
