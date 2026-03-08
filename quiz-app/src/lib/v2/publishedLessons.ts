import type { Lesson } from '@/data/lessons/types';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isLessonIdAllowedForScope, type CurriculumScope } from '@/lib/routing/curriculumScope';

interface PublishedLessonRow {
  content_json?: unknown;
  v2_lessons?: {
    code?: unknown;
  } | null;
}

function isLessonShape(value: unknown): value is Lesson {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Lesson>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.unit === 'string' &&
    Array.isArray(candidate.blocks)
  );
}

function normalizeLessonPayload(value: unknown): Lesson | null {
  if (!isLessonShape(value)) return null;
  return value;
}

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: unknown }).code;
  return code === '42P01';
}

export async function getV2PublishedLessonByCode(lessonCode: string): Promise<Lesson | null> {
  const client = createSupabaseAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('v2_lesson_versions')
    .select('content_json, v2_lessons!inner(code)')
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

  return normalizeLessonPayload(data?.content_json);
}

export async function listV2PublishedLessons(scope: CurriculumScope): Promise<Lesson[]> {
  const client = createSupabaseAdminClient();
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
    .filter((lesson): lesson is Lesson => Boolean(lesson))
    .filter((lesson) => isLessonIdAllowedForScope(lesson.id, scope));
}
