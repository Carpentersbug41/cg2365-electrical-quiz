import { NextRequest, NextResponse } from 'next/server';
import { requireSupabaseSession } from '@/lib/authProgress/routeGuard';

type MasteryRow = {
  lesson_id: string;
  best_score_percent: number | null;
  attempts_count: number;
  mastery_status: 'pending' | 'achieved';
  achieved_at: string | null;
  v2_lessons?: { code: string; title: string } | null;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === '42P01';
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireSupabaseSession(request);
  if (!session) return response!;

  const client = session.client;
  const userId = session.user.id;

  const { data: masteryRows, error: masteryError } = await client
    .from('v2_mastery_records')
    .select('lesson_id, best_score_percent, attempts_count, mastery_status, achieved_at, v2_lessons(code,title)')
    .eq('user_id', userId)
    .order('last_attempt_at', { ascending: false })
    .returns<MasteryRow[]>();

  if (masteryError) {
    if (isMissingTableError(masteryError)) {
      return NextResponse.json({ success: true, summary: { masteredLessons: 0, totalAttempts: 0, averageBestScore: 0 }, lessons: [] });
    }
    return NextResponse.json({ error: masteryError.message }, { status: 500 });
  }

  const lessons = (masteryRows ?? []).map((row) => ({
    lessonId: row.v2_lessons?.code ?? row.lesson_id,
    lessonTitle: row.v2_lessons?.title ?? row.lesson_id,
    bestScorePercent: row.best_score_percent ?? 0,
    attemptsCount: row.attempts_count ?? 0,
    masteryStatus: row.mastery_status,
    achievedAt: row.achieved_at,
  }));

  const masteredLessons = lessons.filter((lesson) => lesson.masteryStatus === 'achieved').length;
  const totalAttempts = lessons.reduce((sum, lesson) => sum + lesson.attemptsCount, 0);
  const averageBestScore = lessons.length
    ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.bestScorePercent, 0) / lessons.length)
    : 0;

  return NextResponse.json({
    success: true,
    summary: {
      masteredLessons,
      totalLessons: lessons.length,
      totalAttempts,
      averageBestScore,
    },
    lessons,
  });
}

