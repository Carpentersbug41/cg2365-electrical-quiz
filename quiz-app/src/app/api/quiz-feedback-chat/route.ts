import { NextRequest, NextResponse } from 'next/server';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';

type QuizReport = {
  summary: string;
  overallFocus: string[];
  items: Array<{
    questionNumber: number;
    whyWrong: string;
    howToGetRight: string;
    whatToReview: string[];
  }>;
};

type WrongQuestionContext = {
  questionNumber: number;
  questionText: string;
  category?: string;
  tags?: string[];
  userAnswer: string;
  correctAnswer: string;
};

function normalizePlainText(text: string): string {
  let normalized = text;
  normalized = normalized.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  normalized = normalized.replace(/\$([^$\n]+)\$/g, '$1');
  normalized = normalized.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)');
  normalized = normalized.replace(/\\times/g, ' x ');
  normalized = normalized.replace(/[{}]/g, '');
  normalized = normalized.replace(/[ \t]{2,}/g, ' ');
  return normalized.trim();
}

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = String(body?.message || '').trim();
    const report = body?.report as QuizReport | undefined;
    const wrongQuestions = (body?.wrongQuestions || []) as WrongQuestionContext[];

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!llmClientPromise) {
      llmClientPromise = createLLMClientWithFallback();
    }

    const client = await llmClientPromise;
    const modelName = getGeminiModelWithDefault();
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 900,
      },
    });

    const prompt = `You are a quiz results assistant for C&G 2365 electrical learners.
Use ONLY the supplied quiz context and report.

Wrong-question context:
${JSON.stringify(wrongQuestions, null, 2)}

LLM report:
${JSON.stringify(report ?? {}, null, 2)}

Student asks:
${message}

Respond with:
- Plain, clear English
- Specific explanation of why their choice was wrong
- Simple steps to reach the correct answer
- What to revise next

Rules:
- Keep answer concise (80-180 words).
- No LaTeX, no markdown table, no code fences.
- If the question is unclear, ask one short clarifying question.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 900,
      },
    });

    return NextResponse.json({ response: normalizePlainText(result.response.text()) });
  } catch (error) {
    console.error('Quiz feedback chat error:', error);
    return NextResponse.json(
      {
        response:
          'I could not load the detailed explanation right now. Ask about a specific question number and I will explain the mistake and fix steps.',
      },
      { status: 200 }
    );
  }
}
