import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { syncPublishedLessonQuestions } from '@/lib/v2/questionBank';

type PublishedLessonVersionRow = {
  id: string;
  lesson_id: string;
  source: 'human' | 'ai';
  quality_score: number | null;
  content_json: unknown;
  v2_lessons?: {
    code?: string;
  } | null;
};

export async function POST(request: NextRequest) {
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

    const lessonCodeFilter = request.nextUrl.searchParams.get('lessonCode')?.trim() ?? '';

    let query = adminClient
      .from('v2_lesson_versions')
      .select('id, lesson_id, source, quality_score, content_json, v2_lessons!inner(code)')
      .eq('status', 'published')
      .order('published_at', { ascending: true });

    if (lessonCodeFilter) {
      query = query.eq('v2_lessons.code', lessonCodeFilter);
    }

    const { data, error } = await query.returns<PublishedLessonVersionRow[]>();
    if (error) throw error;

    const versions = data ?? [];
    const results: Array<{
      lessonCode: string;
      lessonVersionId: string;
      questionCount: number;
      syncedCount: number;
      retiredCount: number;
    }> = [];

    for (const version of versions) {
      const lessonCode = typeof version.v2_lessons?.code === 'string' ? version.v2_lessons.code : '';
      if (!lessonCode) continue;

      const synced = await syncPublishedLessonQuestions(adminClient, {
        lessonId: version.lesson_id,
        lessonCode,
        lessonVersionId: version.id,
        contentJson: version.content_json,
        source: version.source,
        qualityScore: version.quality_score,
      });

      results.push({
        lessonCode,
        lessonVersionId: version.id,
        ...synced,
      });
    }

    return NextResponse.json({
      success: true,
      totalLessons: results.length,
      totalQuestions: results.reduce((sum, row) => sum + row.questionCount, 0),
      totalSynced: results.reduce((sum, row) => sum + row.syncedCount, 0),
      totalRetired: results.reduce((sum, row) => sum + row.retiredCount, 0),
      results,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
