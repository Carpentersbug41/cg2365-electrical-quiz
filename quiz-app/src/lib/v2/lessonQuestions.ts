import type { Lesson, PracticeBlockContent, SpacedReviewBlockContent } from '@/data/lessons/types';

export interface V2QuizQuestion {
  stableId: string;
  prompt: string;
  acceptedAnswers: string[];
  sourceBlockId: string;
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

export function extractV2QuizQuestionsFromLesson(lesson: Lesson): V2QuizQuestion[] {
  const questions: V2QuizQuestion[] = [];

  for (const block of lesson.blocks) {
    if (block.type === 'practice') {
      const content = block.content as PracticeBlockContent;
      if (!Array.isArray(content.questions)) continue;
      content.questions.forEach((q, index) => {
        questions.push({
          stableId: `${block.id}::practice::${q.id || `q-${index + 1}`}`,
          prompt: q.questionText,
          acceptedAnswers: toAcceptedAnswers(q.expectedAnswer),
          sourceBlockId: block.id,
        });
      });
      continue;
    }

    if (block.type === 'spaced-review') {
      const content = block.content as SpacedReviewBlockContent;
      if (!Array.isArray(content.questions)) continue;
      content.questions.forEach((q, index) => {
        questions.push({
          stableId: `${block.id}::spaced-review::${q.id || `q-${index + 1}`}`,
          prompt: q.questionText,
          acceptedAnswers: toAcceptedAnswers(q.expectedAnswer),
          sourceBlockId: block.id,
        });
      });
    }
  }

  return questions;
}
