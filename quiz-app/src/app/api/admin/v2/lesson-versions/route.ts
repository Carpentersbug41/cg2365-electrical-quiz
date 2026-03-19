import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type ContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';

type LessonVersionRow = {
  id: string;
  lesson_id: string;
  version_no: number;
  status: ContentStatus;
  source: 'human' | 'ai';
  quality_score: number | null;
  is_current: boolean;
  published_at: string | null;
  created_at: string;
};

type LessonRow = {
  id: string;
  unit_id: string;
  code: string;
  title: string;
};

type UnitRow = {
  id: string;
  course_id: string;
  code: string;
  name: string;
};

type CourseRow = {
  id: string;
  code: string;
  name: string;
};

const VALID_STATUSES = new Set<ContentStatus>([
  'draft',
  'needs_review',
  'approved',
  'published',
  'retired',
]);

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const statusParam = request.nextUrl.searchParams.get('status')?.trim() ?? '';
    const lessonCodeParam = request.nextUrl.searchParams.get('lessonCode')?.trim() ?? '';
    let constrainedLessonIds: string[] | null = null;

    if (lessonCodeParam) {
      const { data: matchingLessons, error: matchingLessonsError } = await adminClient
        .from('v2_lessons')
        .select('id')
        .ilike('code', `%${lessonCodeParam}%`)
        .returns<Array<{ id: string }>>();
      if (matchingLessonsError) throw matchingLessonsError;

      constrainedLessonIds = (matchingLessons ?? []).map((row) => row.id);
      if (constrainedLessonIds.length === 0) {
        return NextResponse.json({ success: true, versions: [] });
      }
    }

    let versionQuery = adminClient
      .from('v2_lesson_versions')
      .select('id, lesson_id, version_no, status, source, quality_score, is_current, published_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (statusParam && VALID_STATUSES.has(statusParam as ContentStatus)) {
      versionQuery = versionQuery.eq('status', statusParam);
    }
    if (constrainedLessonIds) {
      versionQuery = versionQuery.in('lesson_id', constrainedLessonIds);
    }

    const { data: versionsData, error: versionsError } = await versionQuery.returns<LessonVersionRow[]>();
    if (versionsError) throw versionsError;
    const versions = versionsData ?? [];

    if (versions.length === 0) {
      return NextResponse.json({ success: true, versions: [] });
    }

    const lessonIds = Array.from(new Set(versions.map((row) => row.lesson_id)));
    const { data: lessonsData, error: lessonsError } = await adminClient
      .from('v2_lessons')
      .select('id, unit_id, code, title')
      .in('id', lessonIds)
      .returns<LessonRow[]>();
    if (lessonsError) throw lessonsError;

    const lessons = lessonsData ?? [];
    const filteredLessonIdSet = new Set(lessons.map((row) => row.id));

    if (lessons.length === 0) {
      return NextResponse.json({ success: true, versions: [] });
    }

    const unitIds = Array.from(new Set(lessons.map((row) => row.unit_id)));
    const { data: unitsData, error: unitsError } = await adminClient
      .from('v2_units')
      .select('id, course_id, code, name')
      .in('id', unitIds)
      .returns<UnitRow[]>();
    if (unitsError) throw unitsError;

    const units = unitsData ?? [];
    const courseIds = Array.from(new Set(units.map((row) => row.course_id)));
    const { data: coursesData, error: coursesError } = await adminClient
      .from('v2_courses')
      .select('id, code, name')
      .in('id', courseIds)
      .returns<CourseRow[]>();
    if (coursesError) throw coursesError;

    const lessonById = new Map(lessons.map((row) => [row.id, row]));
    const unitById = new Map(units.map((row) => [row.id, row]));
    const courseById = new Map((coursesData ?? []).map((row) => [row.id, row]));

    const output = versions
      .filter((version) => filteredLessonIdSet.has(version.lesson_id))
      .map((version) => {
        const lesson = lessonById.get(version.lesson_id) ?? null;
        const unit = lesson ? unitById.get(lesson.unit_id) ?? null : null;
        const course = unit ? courseById.get(unit.course_id) ?? null : null;
        return {
          ...version,
          lesson: lesson
            ? {
                id: lesson.id,
                code: lesson.code,
                title: lesson.title,
              }
            : null,
          unit: unit
            ? {
                id: unit.id,
                code: unit.code,
                name: unit.name,
              }
            : null,
          course: course
            ? {
                id: course.id,
                code: course.code,
                name: course.name,
              }
            : null,
        };
      });

    return NextResponse.json({
      success: true,
      versions: output,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
