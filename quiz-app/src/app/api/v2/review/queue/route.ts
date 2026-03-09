import { NextRequest, NextResponse } from 'next/server';
import { requireV2Session } from '@/lib/v2/session';

type ReviewRow = {
  id: string;
  question_stable_id: string;
  status: 'due' | 'completed' | 'resolved';
  due_at: string;
  times_wrong: number;
  times_right: number;
  lesson_id: string | null;
  v2_lessons?: { code: string; title: string } | null;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === '42P01';
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireV2Session(request);
  if (!session) return response!;

  const client = session.client;
  const userId = session.user.id;

  const { data, error } = await client
    .from('v2_review_items')
    .select('id, question_stable_id, status, due_at, times_wrong, times_right, lesson_id, v2_lessons(code,title)')
    .eq('user_id', userId)
    .in('status', ['due', 'completed'])
    .order('due_at', { ascending: true })
    .returns<ReviewRow[]>();

  if (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: true, items: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((row) => ({
    id: row.id,
    questionStableId: row.question_stable_id,
    status: row.status,
    dueAt: row.due_at,
    timesWrong: row.times_wrong,
    timesRight: row.times_right,
    lessonId: row.v2_lessons?.code ?? null,
    lessonTitle: row.v2_lessons?.title ?? null,
  }));

  return NextResponse.json({ success: true, items });
}
