import { NextRequest, NextResponse } from 'next/server';
import { fallbackReport, generateQuizFeedbackReport } from '@/lib/review/quizFeedbackService';
import { WrongQuestionInput } from '@/lib/review/types';

export async function POST(request: NextRequest) {
  let wrongQuestions: WrongQuestionInput[] = [];
  try {
    const body = await request.json();
    wrongQuestions = (body?.wrongQuestions || []) as WrongQuestionInput[];

    if (!Array.isArray(wrongQuestions) || wrongQuestions.length === 0) {
      return NextResponse.json({ error: 'No wrong questions supplied.' }, { status: 400 });
    }

    const report = await generateQuizFeedbackReport(wrongQuestions);
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Quiz feedback report error:', error);

    try {
      return NextResponse.json({ report: fallbackReport(wrongQuestions) });
    } catch {
      return NextResponse.json(
        {
          report: {
            summary: 'Feedback is temporarily unavailable.',
            overallFocus: ['Retry the quiz and review core concepts.'],
            items: [],
          },
        },
        { status: 200 }
      );
    }
  }
}
