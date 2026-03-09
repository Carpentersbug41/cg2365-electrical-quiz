import { FileGenerator } from '@/lib/generation/fileGenerator';
import type { QuizQuestion } from '@/lib/generation/types';
import type { V2QuestionDraft } from '@/lib/v2/questionRuntime';
import type { V2GenerationRequest } from '@/lib/v2/generation/engine';

function toAcceptedAnswers(question: QuizQuestion): string[] {
  const correct = question.options[question.correctAnswer];
  return typeof correct === 'string' && correct.trim().length > 0 ? [correct.trim()] : [];
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

  return generated.questions.slice(0, limit).map((question, index) => ({
    stableKey: `${stableKeyPrefix}::generated::q-${index + 1}`,
    prompt: question.question,
    acceptedAnswers: toAcceptedAnswers(question),
    options: Array.isArray(question.options) ? question.options : null,
    sourceBlockId: `generated-q-${index + 1}`,
    sourceBlockType: 'generated',
    questionType: 'mcq',
  }));
}
