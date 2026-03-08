import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
  const fetchLimit = Math.min(limit * 5, 500);

  const { data, error } = await session.client
    .from('question_attempts')
    .select(
      'id, lesson_id, block_id, question_stable_id, question_type, correct, score, user_answer, attempt_number, ac_key, ac_source, grading_mode, created_at'
    )
    .eq('user_id', session.user.id)
    .eq('correct', false)
    .order('created_at', { ascending: false })
    .limit(fetchLimit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: v2Data, error: v2Error } = await session.client
    .from('v2_attempts')
    .select('id, lesson_id, question_stable_id, is_correct, score, attempt_no, created_at')
    .eq('user_id', session.user.id)
    .eq('is_correct', false)
    .order('created_at', { ascending: false })
    .limit(fetchLimit);
  if (v2Error && (v2Error as { code?: string }).code !== '42P01') {
    return NextResponse.json({ error: v2Error.message }, { status: 500 });
  }

  const merged = [
    ...(data ?? []),
    ...((v2Data ?? []).map((row) => ({
      id: row.id,
      lesson_id: row.lesson_id,
      block_id: null,
      question_stable_id: row.question_stable_id,
      question_type: 'mcq',
      correct: row.is_correct,
      score: row.score,
      user_answer: null,
      attempt_number: row.attempt_no,
      ac_key: null,
      ac_source: 'none',
      grading_mode: 'deterministic',
      created_at: row.created_at,
    })) as typeof data),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const deduped: typeof data = [];
  const seen = new Set<string>();

  for (const row of merged) {
    if (seen.has(row.question_stable_id)) {
      continue;
    }
    seen.add(row.question_stable_id);
    deduped.push(row);

    if (deduped.length >= limit) {
      break;
    }
  }

  return NextResponse.json({ items: deduped, count: deduped.length, limit });
}
