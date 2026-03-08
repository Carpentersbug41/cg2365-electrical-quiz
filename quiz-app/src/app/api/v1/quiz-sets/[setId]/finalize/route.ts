import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { getStudentQuizSet } from '@/lib/quizSets/repo';
import { generateQuizFeedbackReport } from '@/lib/review/quizFeedbackService';
import { upsertReviewSignals, upsertWrongItemsFromReport } from '@/lib/review/reviewQueueRepo';
import { ReviewSignalInput, ReviewReason, WrongQuestionInput } from '@/lib/review/types';

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

function parseReviewSignals(body: unknown): ReviewSignalInput[] {
  if (!body || typeof body !== 'object') return [];
  const value = (body as { reviewSignals?: unknown[] }).reviewSignals;
  if (!Array.isArray(value)) return [];

  const isReason = (reason: string): reason is ReviewReason =>
    reason === 'misconception' || reason === 'wrong' || reason === 'guessing';

  return value
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const item = row as Record<string, unknown>;
      const reason = String(item.reason ?? '').trim().toLowerCase();
      if (!isReason(reason)) return null;
      return {
        questionStableId: item.questionStableId == null ? null : String(item.questionStableId),
        unitCode: item.unitCode == null ? null : String(item.unitCode),
        loCode: item.loCode == null ? null : String(item.loCode),
        acCode: item.acCode == null ? null : String(item.acCode),
        reason,
      } as ReviewSignalInput;
    })
    .filter((item): item is ReviewSignalInput => Boolean(item && item.questionStableId));
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
  const reviewSignals = parseReviewSignals(body);
  const hasWrongQuestions = wrongQuestions.length > 0;

  try {
    const report = hasWrongQuestions
      ? await generateQuizFeedbackReport(wrongQuestions)
      : {
          summary: 'No wrong answers to review.',
          overallFocus: [],
          items: [],
        };

    if (hasWrongQuestions) {
      await upsertWrongItemsFromReport(session.client, session.user.id, wrongQuestions, report);
    }
    if (reviewSignals.length > 0) {
      await upsertReviewSignals(session.client, session.user.id, reviewSignals);
    }
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to finalize quiz review.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
