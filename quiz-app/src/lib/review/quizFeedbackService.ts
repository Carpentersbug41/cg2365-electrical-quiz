import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { QuizFeedbackReport, WrongQuestionInput } from './types';

function cleanModelJson(text: string): string {
  return text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
}

export function normalizePlainText(text: string): string {
  let normalized = text;
  normalized = normalized.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  normalized = normalized.replace(/\$([^$\n]+)\$/g, '$1');
  normalized = normalized.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)');
  normalized = normalized.replace(/\\times/g, ' x ');
  normalized = normalized.replace(/[{}]/g, '');
  normalized = normalized.replace(/[ \t]{2,}/g, ' ');
  return normalized.trim();
}

export const fallbackReport = (wrongQuestions: WrongQuestionInput[]): QuizFeedbackReport => ({
  summary: 'You have a few concept gaps to tighten. Focus on method first, then accuracy.',
  overallFocus: [
    'Identify what the question is testing before calculating.',
    'Use the core formula/rule and check units at the end.',
  ],
  items: wrongQuestions.map((q) => ({
    questionNumber: q.questionNumber,
    whyWrong:
      q.misconceptionFix ||
      q.explanation ||
      'Your selected option does not match the required concept for this question.',
    howToGetRight: `Start by identifying the principle in question ${q.questionNumber}, then apply it step by step before choosing an option.`,
    whatToReview: q.tags && q.tags.length > 0 ? q.tags.slice(0, 3) : ['core concept', 'formula use', 'units'],
  })),
});

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

export async function generateQuizFeedbackReport(
  wrongQuestions: WrongQuestionInput[]
): Promise<QuizFeedbackReport> {
  if (!Array.isArray(wrongQuestions) || wrongQuestions.length === 0) {
    throw new Error('No wrong questions supplied.');
  }

  try {
    if (!llmClientPromise) {
      llmClientPromise = createLLMClientWithFallback();
    }

    const client = await llmClientPromise;
    const modelName = getGeminiModelWithDefault();
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1600,
      },
    });

    const prompt = `You are an expert electrical tutor for C&G 2365.

Create a concise post-quiz feedback report for the student based only on the wrong answers below.

Student wrong answers:
${JSON.stringify(wrongQuestions, null, 2)}

Return STRICT JSON only in this exact shape:
{
  "summary": "string, 2-3 short sentences",
  "overallFocus": ["string", "string", "string"],
  "items": [
    {
      "questionNumber": 1,
      "whyWrong": "string, explain the misunderstanding clearly",
      "howToGetRight": "string, practical step-by-step method in plain language",
      "whatToReview": ["string", "string"]
    }
  ]
}

Rules:
- Cover every wrong question exactly once by questionNumber.
- Explain in simple, direct English.
- No markdown fences.
- No LaTeX or symbols like $, $$, \\frac, \\times.
- Keep each field concise and actionable.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1600,
      },
    });

    const rawText = normalizePlainText(result.response.text());
    const parsed = JSON.parse(cleanModelJson(rawText)) as QuizFeedbackReport;

    if (!parsed?.summary || !Array.isArray(parsed?.items) || parsed.items.length === 0) {
      return fallbackReport(wrongQuestions);
    }

    return {
      summary: normalizePlainText(parsed.summary),
      overallFocus: Array.isArray(parsed.overallFocus)
        ? parsed.overallFocus.map((item) => normalizePlainText(String(item))).slice(0, 5)
        : [],
      items: wrongQuestions.map((q) => {
        const match = parsed.items.find((item) => item.questionNumber === q.questionNumber);
        if (!match) {
          return fallbackReport([q]).items[0];
        }
        return {
          questionNumber: q.questionNumber,
          whyWrong: normalizePlainText(match.whyWrong || ''),
          howToGetRight: normalizePlainText(match.howToGetRight || ''),
          whatToReview: Array.isArray(match.whatToReview)
            ? match.whatToReview.map((item) => normalizePlainText(String(item))).slice(0, 4)
            : [],
        };
      }),
    };
  } catch (error) {
    console.error('Quiz feedback report generation error:', error);
    return fallbackReport(wrongQuestions);
  }
}
