import type { SupabaseClient } from '@supabase/supabase-js';
import { writeV2CanonicalEvent } from '@/lib/v2/events';

type LessonVersionRow = {
  id: string;
  lesson_id: string;
};

type LessonSessionRow = {
  id: string;
  status: 'started' | 'completed' | 'abandoned';
};

type QuizSessionRow = {
  id: string;
  submitted_at: string | null;
};

export async function getPublishedLessonVersion(
  client: SupabaseClient,
  lessonId: string
): Promise<LessonVersionRow | null> {
  const { data, error } = await client
    .from('v2_lesson_versions')
    .select('id, lesson_id')
    .eq('lesson_id', lessonId)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle<LessonVersionRow>();
  if (error) throw error;
  return data ?? null;
}

export async function startLessonSession(input: {
  client: SupabaseClient;
  userId: string;
  lessonId: string;
  lessonVersionId: string;
  sourceContext: string;
}): Promise<{ lessonSessionId: string; created: boolean }> {
  const { client, userId, lessonId, lessonVersionId, sourceContext } = input;
  const { data: existing, error: existingError } = await client
    .from('v2_lesson_sessions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .eq('lesson_version_id', lessonVersionId)
    .eq('status', 'started')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle<LessonSessionRow>();
  if (existingError) throw existingError;
  if (existing?.id) {
    return { lessonSessionId: existing.id, created: false };
  }

  const { data: inserted, error: insertError } = await client
    .from('v2_lesson_sessions')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      status: 'started',
    })
    .select('id')
    .single<{ id: string }>();
  if (insertError) throw insertError;

  await writeV2CanonicalEvent(client, {
    eventType: 'lesson_started',
    userId,
    lessonId,
    lessonVersionId,
    sessionId: inserted.id,
    sourceContext,
    payload: {
      lessonSessionId: inserted.id,
    },
  });

  return { lessonSessionId: inserted.id, created: true };
}

export async function startQuizSession(input: {
  client: SupabaseClient;
  userId: string;
  lessonId: string;
  lessonVersionId: string;
  lessonSessionId: string;
  sourceContext: string;
}): Promise<{ quizSessionId: string; created: boolean }> {
  const { client, userId, lessonId, lessonVersionId, lessonSessionId, sourceContext } = input;
  const { data: existing, error: existingError } = await client
    .from('v2_quiz_sessions')
    .select('id, submitted_at')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .eq('lesson_version_id', lessonVersionId)
    .eq('lesson_session_id', lessonSessionId)
    .is('submitted_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle<QuizSessionRow>();
  if (existingError) throw existingError;
  if (existing?.id) {
    return { quizSessionId: existing.id, created: false };
  }

  const { data: inserted, error: insertError } = await client
    .from('v2_quiz_sessions')
    .insert({
      user_id: userId,
      lesson_session_id: lessonSessionId,
      lesson_id: lessonId,
      lesson_version_id: lessonVersionId,
      source_context: sourceContext,
    })
    .select('id')
    .single<{ id: string }>();
  if (insertError) throw insertError;

  await writeV2CanonicalEvent(client, {
    eventType: 'quiz_started',
    userId,
    lessonId,
    lessonVersionId,
    sessionId: inserted.id,
    sourceContext,
    payload: {
      lessonSessionId,
      quizSessionId: inserted.id,
    },
  });

  return { quizSessionId: inserted.id, created: true };
}
