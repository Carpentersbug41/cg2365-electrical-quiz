import type { V2Lesson } from '@/lib/v2/contentTypes';
import { isLessonIdAllowedForV2Scope, type V2CurriculumScope } from '@/lib/v2/scope';
import { createV2SupabaseAdminClient } from '@/lib/v2/supabase';

interface PublishedLessonRow {
  id?: string;
  lesson_id?: string;
  content_json?: unknown;
  v2_lessons?: {
    code?: unknown;
  } | null;
}

export interface V2PublishedLessonRecord {
  lessonId: string;
  lessonVersionId: string;
  lesson: V2Lesson;
}

function isLessonShape(value: unknown): value is V2Lesson {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<V2Lesson>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.unit === 'string' &&
    Array.isArray(candidate.blocks)
  );
}

function normalizeLessonPayload(value: unknown): V2Lesson | null {
  if (!isLessonShape(value)) return null;
  return value;
}

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: unknown }).code;
  return code === '42P01';
}

export async function getV2PublishedLessonByCode(lessonCode: string): Promise<V2Lesson | null> {
  const record = await getV2PublishedLessonRecordByCode(lessonCode);
  return record?.lesson ?? null;
}

export async function getV2PublishedLessonRecordByCode(
  lessonCode: string
): Promise<V2PublishedLessonRecord | null> {
  const client = createV2SupabaseAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('v2_lesson_versions')
    .select('id, lesson_id, content_json, v2_lessons!inner(code)')
    .eq('status', 'published')
    .eq('v2_lessons.code', lessonCode)
    .limit(1)
    .maybeSingle<PublishedLessonRow>();

  if (error) {
    if (!isMissingTableError(error)) {
      console.warn('[V2 Published Lessons] Failed to read lesson by code:', lessonCode, error);
    }
    return null;
  }

  const lesson = normalizeLessonPayload(data?.content_json);
  if (!lesson || typeof data?.id !== 'string' || typeof data?.lesson_id !== 'string') {
    return null;
  }

  return {
    lesson,
    lessonId: data.lesson_id,
    lessonVersionId: data.id,
  };
}

export async function listV2PublishedLessons(scope: V2CurriculumScope): Promise<V2Lesson[]> {
  const client = createV2SupabaseAdminClient();
  if (!client) return [];

  const { data, error } = await client
    .from('v2_lesson_versions')
    .select('content_json, v2_lessons!inner(code)')
    .eq('status', 'published')
    .order('published_at', { ascending: true })
    .returns<PublishedLessonRow[]>();

  if (error) {
    if (!isMissingTableError(error)) {
      console.warn('[V2 Published Lessons] Failed to list lessons:', error);
    }
    return [];
  }

  return (data ?? [])
    .map((row) => normalizeLessonPayload(row.content_json))
    .filter((lesson): lesson is V2Lesson => Boolean(lesson))
    .filter((lesson) => isLessonIdAllowedForV2Scope(lesson.id, scope));
}
