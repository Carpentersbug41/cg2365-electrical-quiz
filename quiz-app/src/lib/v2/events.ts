import type { SupabaseClient } from '@supabase/supabase-js';

type LessonContextRow = {
  lesson_id: string;
  course_id: string | null;
  unit_id: string | null;
  program_id: string | null;
  organization_id: string | null;
};

export type V2CanonicalEventInput = {
  eventType: string;
  userId?: string | null;
  sessionId?: string | null;
  lessonId?: string | null;
  lessonVersionId?: string | null;
  questionId?: string | null;
  questionVersionId?: string | null;
  sourceContext?: string;
  payload?: Record<string, unknown>;
};

export async function resolveLessonContext(
  client: SupabaseClient,
  lessonId: string | null | undefined
): Promise<LessonContextRow | null> {
  if (!lessonId) return null;
  const { data, error } = await client
    .from('v2_lessons')
    .select('id, unit_id, v2_units!inner(course_id, v2_courses!inner(program_id, v2_programs!inner(organization_id)))')
    .eq('id', lessonId)
    .limit(1)
    .maybeSingle<{
      id: string;
      unit_id: string;
      v2_units?: {
        course_id?: string | null;
        v2_courses?: {
          program_id?: string | null;
          v2_programs?: {
            organization_id?: string | null;
          } | null;
        } | null;
      } | null;
    }>();
  if (error || !data?.id) return null;

  return {
    lesson_id: data.id,
    unit_id: data.unit_id ?? null,
    course_id: data.v2_units?.course_id ?? null,
    program_id: data.v2_units?.v2_courses?.program_id ?? null,
    organization_id: data.v2_units?.v2_courses?.v2_programs?.organization_id ?? null,
  };
}

export async function writeV2CanonicalEvent(
  client: SupabaseClient,
  input: V2CanonicalEventInput
): Promise<void> {
  const lessonContext = await resolveLessonContext(client, input.lessonId);
  const { error } = await client.from('v2_event_log').insert({
    event_type: input.eventType,
    event_version: 1,
    user_id: input.userId ?? null,
    organization_id: lessonContext?.organization_id ?? null,
    program_id: lessonContext?.program_id ?? null,
    course_id: lessonContext?.course_id ?? null,
    unit_id: lessonContext?.unit_id ?? null,
    lesson_id: input.lessonId ?? null,
    lesson_version_id: input.lessonVersionId ?? null,
    question_id: input.questionId ?? null,
    question_version_id: input.questionVersionId ?? null,
    session_id: input.sessionId ?? null,
    source_context: input.sourceContext ?? 'runtime',
    payload: input.payload ?? {},
  });
  if (error) {
    throw error;
  }
}
