import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { getStudentQuizSet } from '@/lib/quizSets/repo';
import { generateQuizFeedbackReport } from '@/lib/review/quizFeedbackService';
import { upsertWrongItemsFromReport } from '@/lib/review/reviewQueueRepo';
import { WrongQuestionInput } from '@/lib/review/types';

interface Params {
  params: Promise<{ setId: string }>;
}

function parseWrongQuestions(body: unknown): WrongQuestionInput[] {
  if (!body || typeof body !== 'object') return [];
  const value = (body as { wrongQuestions?: unknown[] }).wrongQuestions;
  if (!Array.isArray(value)) return [];

  return value
    .map((row, idx) => {
      if (!row || typeof row !== 'object') return null;
      const item = row as Record<string, unknown>;
      return {
        questionNumber: Number(item.questionNumber ?? idx + 1),
        questionStableId: item.questionStableId == null ? null : String(item.questionStableId),
        questionText: String(item.questionText ?? ''),
        category: item.category == null ? undefined : String(item.category),
        tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag)) : [],
        unitCode: item.unitCode == null ? null : String(item.unitCode),
        loCode: item.loCode == null ? null : String(item.loCode),
        acCode: item.acCode == null ? null : String(item.acCode),
        userAnswer: String(item.userAnswer ?? ''),
        correctAnswer: String(item.correctAnswer ?? ''),
        explanation: item.explanation == null ? undefined : String(item.explanation),
        misconceptionName: item.misconceptionName == null ? undefined : String(item.misconceptionName),
        misconceptionFix: item.misconceptionFix == null ? undefined : String(item.misconceptionFix),
      } as WrongQuestionInput;
    })
    .filter((item): item is WrongQuestionInput => Boolean(item && item.questionText.trim().length > 0));
}

export async function POST(request: NextRequest, context: Params) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  const { setId } = await context.params;
  const set = await getStudentQuizSet(session.client, session.user.id, setId);
  if (!set) {
    return NextResponse.json({ error: 'Quiz set not found.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const wrongQuestions = parseWrongQuestions(body);
  if (wrongQuestions.length === 0) {
    return NextResponse.json({
      report: {
        summary: 'No wrong answers to review.',
        overallFocus: [],
        items: [],
      },
    });
  }

  try {
    const report = await generateQuizFeedbackReport(wrongQuestions);
    await upsertWrongItemsFromReport(session.client, session.user.id, wrongQuestions, report);
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to finalize quiz review.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
