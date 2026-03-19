import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

type ContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';

type QuestionVersionRow = {
  id: string;
  question_id: string;
  version_no: number;
  status: ContentStatus;
  source: 'human' | 'ai';
  quality_score: number | null;
  is_current: boolean;
  published_at: string | null;
  created_at: string;
  stem: string;
};

type QuestionRow = {
  id: string;
  lesson_id: string | null;
  stable_key: string;
  question_type: 'mcq' | 'short' | 'numeric' | 'other';
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
};

const VALID_STATUSES = new Set<ContentStatus>(['draft', 'needs_review', 'approved', 'published', 'retired']);

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
    const stableKeyParam = request.nextUrl.searchParams.get('stableKey')?.trim() ?? '';

    let constrainedLessonIds: string[] | null = null;
    if (lessonCodeParam) {
      const { data: matchingLessons, error: lessonFilterError } = await adminClient
        .from('v2_lessons')
        .select('id')
        .ilike('code', `%${lessonCodeParam}%`)
        .returns<Array<{ id: string }>>();
      if (lessonFilterError) throw lessonFilterError;
      constrainedLessonIds = (matchingLessons ?? []).map((row) => row.id);
      if (constrainedLessonIds.length === 0) {
        return NextResponse.json({ success: true, versions: [] });
      }
    }

    let constrainedQuestionIds: string[] | null = null;
    if (stableKeyParam || constrainedLessonIds) {
      let questionQuery = adminClient.from('v2_questions').select('id');
      if (stableKeyParam) {
        questionQuery = questionQuery.ilike('stable_key', `%${stableKeyParam}%`);
      }
      if (constrainedLessonIds) {
        questionQuery = questionQuery.in('lesson_id', constrainedLessonIds);
      }
      const { data: matchingQuestions, error: questionFilterError } = await questionQuery.returns<Array<{ id: string }>>();
      if (questionFilterError) throw questionFilterError;
      constrainedQuestionIds = (matchingQuestions ?? []).map((row) => row.id);
      if (constrainedQuestionIds.length === 0) {
        return NextResponse.json({ success: true, versions: [] });
      }
    }

    let versionQuery = adminClient
      .from('v2_question_versions')
      .select('id, question_id, version_no, status, source, quality_score, is_current, published_at, created_at, stem')
      .order('created_at', { ascending: false })
      .limit(500);

    if (statusParam && VALID_STATUSES.has(statusParam as ContentStatus)) {
      versionQuery = versionQuery.eq('status', statusParam);
    }
    if (constrainedQuestionIds) {
      versionQuery = versionQuery.in('question_id', constrainedQuestionIds);
    }

    const { data: versionsData, error: versionsError } = await versionQuery.returns<QuestionVersionRow[]>();
    if (versionsError) throw versionsError;
    const versions = versionsData ?? [];
    if (versions.length === 0) {
      return NextResponse.json({ success: true, versions: [] });
    }

    const questionIds = Array.from(new Set(versions.map((row) => row.question_id)));
    const { data: questionsData, error: questionsError } = await adminClient
      .from('v2_questions')
      .select('id, lesson_id, stable_key, question_type')
      .in('id', questionIds)
      .returns<QuestionRow[]>();
    if (questionsError) throw questionsError;

    const questions = questionsData ?? [];
    const filteredQuestionIdSet = new Set(questions.map((row) => row.id));
    if (questions.length === 0) {
      return NextResponse.json({ success: true, versions: [] });
    }

    const lessonIds = Array.from(
      new Set(questions.map((row) => row.lesson_id).filter((id): id is string => Boolean(id)))
    );
    const lessonsById = new Map<string, LessonRow>();
    if (lessonIds.length > 0) {
      const { data: lessonsData, error: lessonsError } = await adminClient
        .from('v2_lessons')
        .select('id, code, title')
        .in('id', lessonIds)
        .returns<LessonRow[]>();
      if (lessonsError) throw lessonsError;
      for (const lesson of lessonsData ?? []) {
        lessonsById.set(lesson.id, lesson);
      }
    }

    const questionById = new Map(questions.map((row) => [row.id, row]));

    return NextResponse.json({
      success: true,
      versions: versions
        .filter((version) => filteredQuestionIdSet.has(version.question_id))
        .map((version) => {
          const question = questionById.get(version.question_id) ?? null;
          const lesson = question?.lesson_id ? lessonsById.get(question.lesson_id) ?? null : null;
          return {
            ...version,
            question: question
              ? {
                  id: question.id,
                  stable_key: question.stable_key,
                  question_type: question.question_type,
                }
              : null,
            lesson: lesson
              ? {
                  id: lesson.id,
                  code: lesson.code,
                  title: lesson.title,
                }
              : null,
          };
        }),
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
