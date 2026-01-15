/**
 * Cumulative Question Selection Service
 * Generates cumulative quizzes that include current + all previous lessons in the same unit
 */

import { questions } from '@/data/questions';
import { TaggedQuestion } from '@/data/questions/types';
import { getLessonsByUnit, getLessonById } from '@/data/lessons/lessonIndex';
import { filterQuestionsByLesson } from './questionFilter';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Sample n items from array randomly
 */
function sample<T>(array: T[], n: number): T[] {
  if (array.length <= n) {
    return shuffle(array);
  }
  return shuffle(array).slice(0, n);
}

/**
 * Get cumulative questions for a lesson
 * Includes questions from current lesson + all previous lessons in the same unit
 * 
 * @param lessonId - Current lesson ID (e.g., "202-4A")
 * @param maxQuestions - Maximum total questions (default 20)
 * @param currentWeight - Percentage of questions from current lesson (default 0.5 = 50%)
 * @returns Array of questions, shuffled and capped
 */
export function getCumulativeQuestions(
  lessonId: string,
  maxQuestions: number = 20,
  currentWeight: number = 0.5
): TaggedQuestion[] {
  const currentLesson = getLessonById(lessonId);
  
  if (!currentLesson) {
    console.warn(`Lesson ${lessonId} not found`);
    return [];
  }

  // Get all lessons in the same unit
  const lessonsByUnit = getLessonsByUnit();
  const unitLessons = lessonsByUnit[currentLesson.unitNumber] || [];
  
  // Get current and previous lessons (based on order)
  const relevantLessons = unitLessons.filter(
    lesson => lesson.order <= currentLesson.order
  );

  // If this is the first lesson in the unit, just return current lesson questions
  if (relevantLessons.length === 1) {
    const currentQuestions = filterQuestionsByLesson(lessonId);
    return sample(currentQuestions, maxQuestions);
  }

  // Get questions from current lesson
  const currentQuestions = filterQuestionsByLesson(lessonId);
  
  // Get questions from all previous lessons
  const previousLessons = relevantLessons.filter(l => l.order < currentLesson.order);
  const previousQuestions: TaggedQuestion[] = [];
  
  previousLessons.forEach(lesson => {
    const lessonQuestions = filterQuestionsByLesson(lesson.id);
    previousQuestions.push(...lessonQuestions);
  });

  // Calculate question counts
  const currentCount = Math.floor(maxQuestions * currentWeight);
  const previousCount = maxQuestions - currentCount;

  // Sample questions
  const selectedCurrent = sample(currentQuestions, currentCount);
  const selectedPrevious = sample(previousQuestions, previousCount);

  // Combine and shuffle
  const allQuestions = [...selectedCurrent, ...selectedPrevious];
  return shuffle(allQuestions);
}

/**
 * Get metadata about cumulative quiz for display
 */
export function getCumulativeQuizMetadata(lessonId: string) {
  const currentLesson = getLessonById(lessonId);
  
  if (!currentLesson) {
    return null;
  }

  const lessonsByUnit = getLessonsByUnit();
  const unitLessons = lessonsByUnit[currentLesson.unitNumber] || [];
  
  const relevantLessons = unitLessons.filter(
    lesson => lesson.order <= currentLesson.order
  );

  const previousLessons = relevantLessons.filter(l => l.order < currentLesson.order);

  return {
    currentLesson: currentLesson,
    includedLessons: relevantLessons,
    previousLessons: previousLessons,
    isFirstInUnit: relevantLessons.length === 1,
    totalLessonsIncluded: relevantLessons.length
  };
}
