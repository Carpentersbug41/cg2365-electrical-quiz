import { FileGenerator } from '@/lib/generation/fileGenerator';
import type { QuizQuestion } from '@/lib/generation/types';
import type { V2QuestionDraft } from '@/lib/v2/questionRuntime';
import type { V2GenerationRequest } from '@/lib/v2/generation/engine';

const FORBIDDEN_STYLE_TOKENS = ['style=', 'color:', 'font-family', 'background:', 'class='];

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

function toAcceptedAnswers(question: QuizQuestion): string[] {
  const correct = question.options[question.correctAnswer];
  return typeof correct === 'string' && correct.trim().length > 0 ? [correct.trim()] : [];
}

function toValidatedDraft(question: QuizQuestion, stableKeyPrefix: string, index: number): V2QuestionDraft | null {
  const prompt = typeof question.question === 'string' ? question.question.trim() : '';
  const options = Array.isArray(question.options)
    ? question.options
        .map((option) => (typeof option === 'string' ? option.trim() : ''))
        .filter((option) => option.length > 0)
    : [];

  if (prompt.length < 12) return null;
  if (FORBIDDEN_STYLE_TOKENS.some((token) => prompt.toLowerCase().includes(token))) return null;
  if (!Number.isInteger(question.correctAnswer) || question.correctAnswer < 0 || question.correctAnswer >= options.length) {
    return null;
  }

  const normalizedOptions = options.map((option) => normalizeText(option)).filter((option) => option.length > 0);
  if (options.length < 3) return null;
  if (new Set(normalizedOptions).size !== normalizedOptions.length) return null;

  const acceptedAnswers = toAcceptedAnswers({
    ...question,
    options,
  });
  if (acceptedAnswers.length === 0) return null;

  return {
    stableKey: `${stableKeyPrefix}::generated::q-${index + 1}`,
    prompt,
    acceptedAnswers,
    options,
    sourceBlockId: `generated-q-${index + 1}`,
    sourceBlockType: 'generated',
    questionType: 'mcq',
  };
}

export async function generateV2QuestionDrafts(
  request: V2GenerationRequest,
  stableKeyPrefix: string,
  limit = 12
): Promise<V2QuestionDraft[]> {
  const generator = new FileGenerator();
  const generated = await generator.generateQuiz(request);
  if (!generated.success || !Array.isArray(generated.questions) || generated.questions.length === 0) {
    throw new Error(generated.error || 'Question generation pipeline failed to produce quiz questions.');
  }

  const drafts: V2QuestionDraft[] = [];
  const seenPrompts = new Set<string>();

  for (let index = 0; index < generated.questions.length && drafts.length < limit; index += 1) {
    const draft = toValidatedDraft(generated.questions[index], stableKeyPrefix, index);
    if (!draft) continue;
    const normalizedPrompt = normalizeText(draft.prompt);
    if (normalizedPrompt.length === 0 || seenPrompts.has(normalizedPrompt)) continue;
    seenPrompts.add(normalizedPrompt);
    drafts.push(draft);
  }

  if (drafts.length === 0) {
    throw new Error('Question generation pipeline did not produce any valid draft questions.');
  }

  return drafts;
}
