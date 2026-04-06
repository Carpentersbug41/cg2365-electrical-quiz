import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import type { DynamicLessonGenerationInput } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';

export type IndependentEvaluationIssue = {
  category:
    | 'beginnerClarity'
    | 'teachingBeforeTesting'
    | 'markingRobustness'
    | 'alignmentToLO'
    | 'questionQuality';
  jsonPointers: string[];
  problem: string;
  whyItMatters: string;
};

export type IndependentEvaluationScore = {
  total: number;
  breakdown: {
    beginnerClarity: number;
    teachingBeforeTesting: number;
    markingRobustness: number;
    alignmentToLO: number;
    questionQuality: number;
  };
  issues: IndependentEvaluationIssue[];
  summary: string;
};

function parseJson<T>(rawText: string): T {
  return JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()) as T;
}

function buildLessonReference(input: DynamicLessonGenerationInput): string {
  return [
    `Lesson code: ${input.lessonCode}`,
    `Lesson title: ${input.title}`,
    `Unit: ${input.unit}`,
    `Topic: ${input.topic}`,
    `Subject: ${input.subject}`,
    `Audience: ${input.audience}`,
    `Tone: ${input.tonePrompt}`,
  ].join('\n');
}

export async function evaluateDynamicLessonIndependently(input: {
  generationInput: DynamicLessonGenerationInput;
  lesson: DynamicGuidedV2Lesson;
}): Promise<IndependentEvaluationScore> {
  const client = await createLLMClientWithFallback();
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    systemInstruction: [
      'You are an independent lesson reviewer for City & Guilds 2365 lessons.',
      'You are not the generation scorer and you are not repairing the lesson.',
      'Evaluate the final lesson as a strict external reviewer using only the rubric below.',
      'Return strict JSON only.',
      '',
      'Rubric:',
      '- beginnerClarity: 0-30',
      '- teachingBeforeTesting: 0-25',
      '- markingRobustness: 0-20',
      '- alignmentToLO: 0-15',
      '- questionQuality: 0-10',
      '',
      'Rules:',
      '- total must equal the breakdown sum.',
      '- Score the lesson that exists, not the lesson you wish existed.',
      '- Penalize untaught-term drift, meta questions, bundled prompts, weak markability, and objective drift.',
      '- Keep issues concrete and point to the lesson JSON where possible.',
      '- Return at most 3 issues, sorted by impact.',
      '- summary must be 2 sentences max.',
    ].join('\n'),
    generationConfig: {
      temperature: 0.0,
      maxOutputTokens: 2200,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent([
    buildLessonReference(input.generationInput),
    '',
    'Lesson JSON:',
    JSON.stringify(input.lesson, null, 2),
    '',
    'Return JSON in this shape:',
    JSON.stringify(
      {
        total: 0,
        breakdown: {
          beginnerClarity: 0,
          teachingBeforeTesting: 0,
          markingRobustness: 0,
          alignmentToLO: 0,
          questionQuality: 0,
        },
        issues: [
          {
            category: 'beginnerClarity',
            jsonPointers: ['/steps/1/basicQuestions/0/questionText'],
            problem: 'string',
            whyItMatters: 'string',
          },
        ],
        summary: 'string',
      },
      null,
      2
    ),
  ].join('\n'));

  return parseJson<IndependentEvaluationScore>(result.response.text());
}
