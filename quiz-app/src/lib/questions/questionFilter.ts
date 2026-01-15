/**
 * Question Filter Utility
 * Centralized filtering logic for questions based on various criteria
 */

import { questions } from '@/data/questions';
import { TaggedQuestion, QuestionTag } from '@/data/questions/types';

/**
 * Filter questions by lesson ID
 * Returns questions where learningOutcomeId starts with the lesson ID
 */
export function filterQuestionsByLesson(lessonId: string): TaggedQuestion[] {
  return questions.filter(q => {
    // Check if question has learningOutcomeId and it starts with lessonId
    const taggedQ = q as TaggedQuestion;
    return taggedQ.learningOutcomeId?.startsWith(lessonId);
  }) as TaggedQuestion[];
}

/**
 * Filter questions by section
 * Returns questions matching the specified section
 */
export function filterQuestionsBySection(section: string) {
  return questions.filter(q => q.section === section);
}

/**
 * Filter questions by tags
 * Returns questions that have ALL specified tags
 */
export function filterQuestionsByTags(tags: QuestionTag[]) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionFilter.ts:33',message:'filterQuestionsByTags called',data:{requestedTags:tags},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  return questions.filter(q => {
    const taggedQ = q as TaggedQuestion;
    if (!taggedQ.tags) return false;
    const hasAllTags = tags.every(tag => taggedQ.tags.includes(tag));
    // #region agent log
    if (hasAllTags) {
      fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionFilter.ts:36',message:'Question matches tags',data:{questionId:taggedQ.id,tags:taggedQ.tags,requestedTags:tags},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
    // #endregion
    return hasAllTags;
  }) as TaggedQuestion[];
}

/**
 * Get count of questions for a lesson
 */
export function getLessonQuestionCount(lessonId: string): number {
  return filterQuestionsByLesson(lessonId).length;
}

/**
 * Get count of questions for a section
 */
export function getSectionQuestionCount(section: string): number {
  return filterQuestionsBySection(section).length;
}

/**
 * Get all unique learning outcome IDs
 */
export function getAllLearningOutcomes(): string[] {
  const outcomes = new Set<string>();
  questions.forEach(q => {
    const taggedQ = q as TaggedQuestion;
    if (taggedQ.learningOutcomeId) {
      outcomes.add(taggedQ.learningOutcomeId);
    }
  });
  return Array.from(outcomes).sort();
}

/**
 * Get all unique lesson IDs from questions
 */
export function getAllLessonIds(): string[] {
  const lessonIds = new Set<string>();
  questions.forEach(q => {
    const taggedQ = q as TaggedQuestion;
    if (taggedQ.learningOutcomeId) {
      // Extract lesson ID (e.g., "202-4A" from "202-4A-LO1")
      const match = taggedQ.learningOutcomeId.match(/^(.+?)-LO\d+$/);
      if (match) {
        lessonIds.add(match[1]);
      }
    }
  });
  return Array.from(lessonIds).sort();
}

