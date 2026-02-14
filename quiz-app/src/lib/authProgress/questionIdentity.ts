import type { Question } from '@/data/questions';

interface AcMeta {
  ac_key: string | null;
  ac_source: 'question' | 'block' | 'lesson' | 'none';
}

type MaybeTaggedQuestion = Question & {
  stableId?: string;
  stable_id?: string;
  learningOutcomeId?: string;
  acKey?: string;
  ac_key?: string;
};

function sanitizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeQuestionStableId(value: string): string {
  return value.trim();
}

export function getStableIdForMcqQuestion(question: Question): string {
  const tagged = question as MaybeTaggedQuestion;

  if (typeof tagged.stableId === 'string' && tagged.stableId.trim().length > 0) {
    return normalizeQuestionStableId(tagged.stableId);
  }

  if (typeof tagged.stable_id === 'string' && tagged.stable_id.trim().length > 0) {
    return normalizeQuestionStableId(tagged.stable_id);
  }

  if (typeof tagged.learningOutcomeId === 'string' && tagged.learningOutcomeId.trim().length > 0) {
    return normalizeQuestionStableId(`${tagged.learningOutcomeId}::q${question.id}`);
  }

  const sectionToken = sanitizeToken(question.section || 'section');
  return normalizeQuestionStableId(`mcq::${sectionToken}::q${question.id}`);
}

export function getAcMetaFromQuestion(question: unknown): AcMeta {
  if (!question || typeof question !== 'object') {
    return { ac_key: null, ac_source: 'none' };
  }

  const data = question as Record<string, unknown>;

  if (typeof data.acKey === 'string' && data.acKey.trim().length > 0) {
    return { ac_key: data.acKey, ac_source: 'question' };
  }

  if (typeof data.ac_key === 'string' && data.ac_key.trim().length > 0) {
    return { ac_key: data.ac_key, ac_source: 'question' };
  }

  if (typeof data.learningOutcomeId === 'string' && data.learningOutcomeId.trim().length > 0) {
    return { ac_key: data.learningOutcomeId, ac_source: 'lesson' };
  }

  return { ac_key: null, ac_source: 'none' };
}

export function extractLessonIdFromBlockId(blockId: string): string | null {
  if (!blockId) {
    return null;
  }

  if (blockId.includes('#')) {
    const [lessonId] = blockId.split('#');
    return lessonId || null;
  }

  const match = blockId.match(/^([0-9]{3}-[A-Za-z0-9]+)/);
  return match?.[1] ?? null;
}
