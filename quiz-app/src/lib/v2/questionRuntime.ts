import type { V2Lesson, V2PracticeBlockContent, V2SpacedReviewBlockContent } from '@/lib/v2/contentTypes';

export interface V2QuestionDraft {
  stableKey: string;
  prompt: string;
  acceptedAnswers: string[];
  options: string[] | null;
  sourceBlockId: string;
  sourceBlockType: 'practice' | 'spaced-review' | 'generated';
  questionType: 'short' | 'mcq';
}

export interface V2QuizQuestion {
  questionId: string | null;
  questionVersionId: string | null;
  stableId: string;
  prompt: string;
  acceptedAnswers: string[];
  options: string[] | null;
  sourceBlockId: string;
  sourceBlockType: 'practice' | 'spaced-review' | 'generated';
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

function toAcceptedAnswers(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const out = Array.isArray(value) ? value : [value];
  return out.map((item) => normalizeText(String(item))).filter((item) => item.length > 0);
}

export function isAnswerCorrect(input: string, acceptedAnswers: string[]): boolean {
  const normalizedInput = normalizeText(input);
  if (!normalizedInput || acceptedAnswers.length === 0) return false;

  if (acceptedAnswers.includes(normalizedInput)) return true;

  for (const accepted of acceptedAnswers) {
    if (accepted.length >= 4 && normalizedInput.includes(accepted)) return true;
    if (normalizedInput.length >= 4 && accepted.includes(normalizedInput)) return true;
  }

  const inputTokens = new Set(normalizedInput.split(' ').filter(Boolean));
  if (inputTokens.size === 0) return false;
  for (const accepted of acceptedAnswers) {
    const acceptedTokens = accepted.split(' ').filter(Boolean);
    if (acceptedTokens.length === 0) continue;
    let hits = 0;
    for (const token of acceptedTokens) {
      if (inputTokens.has(token)) hits += 1;
    }
    const ratio = hits / acceptedTokens.length;
    if (ratio >= 0.8) return true;
  }

  return false;
}

export function extractV2QuestionDraftsFromLesson(lesson: V2Lesson): V2QuestionDraft[] {
  const questions: V2QuestionDraft[] = [];

  for (const block of lesson.blocks) {
    if (block.type === 'practice') {
      const content = block.content as V2PracticeBlockContent;
      if (!Array.isArray(content.questions)) continue;
      content.questions.forEach((q, index) => {
        questions.push({
          stableKey: `${block.id}::practice::${q.id || `q-${index + 1}`}`,
          prompt: q.questionText,
          acceptedAnswers: toAcceptedAnswers(q.expectedAnswer),
          options: null,
          sourceBlockId: block.id,
          sourceBlockType: 'practice',
          questionType: 'short',
        });
      });
      continue;
    }

    if (block.type === 'spaced-review') {
      const content = block.content as V2SpacedReviewBlockContent;
      if (!Array.isArray(content.questions)) continue;
      content.questions.forEach((q, index) => {
        questions.push({
          stableKey: `${block.id}::spaced-review::${q.id || `q-${index + 1}`}`,
          prompt: q.questionText,
          acceptedAnswers: toAcceptedAnswers(q.expectedAnswer),
          options: null,
          sourceBlockId: block.id,
          sourceBlockType: 'spaced-review',
          questionType: 'short',
        });
      });
    }
  }

  return questions;
}

export function extractV2QuizQuestionsFromLesson(lesson: V2Lesson): V2QuizQuestion[] {
  return extractV2QuestionDraftsFromLesson(lesson).map((question) => ({
    questionId: null,
    questionVersionId: null,
    stableId: question.stableKey,
    prompt: question.prompt,
    acceptedAnswers: question.acceptedAnswers,
    options: question.options,
    sourceBlockId: question.sourceBlockId,
    sourceBlockType: question.sourceBlockType,
  }));
}
