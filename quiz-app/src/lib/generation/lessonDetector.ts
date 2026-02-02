/**
 * Lesson Detector Utility
 * Analyzes lessons and their quiz coverage to identify which need quizzes
 */

import { lessonIndex, getLessonById, type LessonIndexEntry } from '@/data/lessons/lessonIndex';
import { getLessonQuestionCount } from '@/lib/questions/questionFilter';
import { Lesson } from './types';
import fs from 'fs';
import path from 'path';

export interface LessonQuizStatus {
  lessonId: string;
  title: string;
  unit: string;
  unitNumber: string;
  section: string;
  questionCount: number;
  needsQuiz: boolean; // true if < 30 questions
  hasPartialQuiz: boolean; // true if has some questions but < 50
  lessonFilePath?: string; // path to lesson JSON file
}

/**
 * Get all lessons from the lesson index
 */
export function getAllLessons(): LessonIndexEntry[] {
  return lessonIndex;
}

/**
 * Get quiz status for a specific lesson
 */
export function getLessonQuizStatus(lessonId: string): LessonQuizStatus | null {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return null;
  }

  const questionCount = getLessonQuestionCount(lessonId);
  const lessonFilePath = findLessonFile(lessonId);

  return {
    lessonId: lesson.id,
    title: lesson.title,
    unit: lesson.unit,
    unitNumber: lesson.unitNumber,
    section: inferSectionFromUnit(lesson.unitNumber),
    questionCount,
    needsQuiz: questionCount < 30,
    hasPartialQuiz: questionCount > 0 && questionCount < 50,
    lessonFilePath,
  };
}

/**
 * Get quiz status for all lessons
 */
export function getAllLessonQuizStatuses(): LessonQuizStatus[] {
  return lessonIndex.map(lesson => {
    const questionCount = getLessonQuestionCount(lesson.id);
    const lessonFilePath = findLessonFile(lesson.id);

    return {
      lessonId: lesson.id,
      title: lesson.title,
      unit: lesson.unit,
      unitNumber: lesson.unitNumber,
      section: inferSectionFromUnit(lesson.unitNumber),
      questionCount,
      needsQuiz: questionCount < 30,
      hasPartialQuiz: questionCount > 0 && questionCount < 50,
      lessonFilePath,
    };
  });
}

/**
 * Get lessons that need quizzes (less than threshold)
 */
export function getLessonsNeedingQuizzes(threshold: number = 30): LessonQuizStatus[] {
  return getAllLessonQuizStatuses().filter(status => status.questionCount < threshold);
}

/**
 * Get lessons with no questions at all
 */
export function getLessonsWithoutQuizzes(): LessonQuizStatus[] {
  return getAllLessonQuizStatuses().filter(status => status.questionCount === 0);
}

/**
 * Get lessons with partial quizzes (1-49 questions)
 */
export function getLessonsWithPartialQuizzes(): LessonQuizStatus[] {
  return getAllLessonQuizStatuses().filter(status => status.hasPartialQuiz);
}

/**
 * Find the lesson JSON file for a given lesson ID
 */
export function findLessonFile(lessonId: string): string | undefined {
  const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
  
  try {
    const files = fs.readdirSync(lessonsDir);
    const lessonFile = files.find(file => 
      file.startsWith(lessonId) && file.endsWith('.json')
    );
    
    if (lessonFile) {
      return path.join(lessonsDir, lessonFile);
    }
  } catch (error) {
    console.error(`Error finding lesson file for ${lessonId}:`, error);
  }
  
  return undefined;
}

/**
 * Load lesson data from JSON file
 */
export function getExistingLesson(lessonId: string): Lesson | null {
  const lessonPath = findLessonFile(lessonId);
  
  if (!lessonPath) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(lessonPath, 'utf-8');
    const lesson = JSON.parse(content) as Lesson;
    return lesson;
  } catch (error) {
    console.error(`Error loading lesson ${lessonId}:`, error);
    return null;
  }
}

/**
 * Extract learning outcomes from lesson data
 */
export function extractLearningOutcomes(lesson: Lesson): string[] {
  // Try to find outcomes block
  const outcomesBlock = lesson.blocks?.find(block => block.type === 'outcomes');
  
  if (outcomesBlock && outcomesBlock.content.outcomes) {
    return outcomesBlock.content.outcomes as string[];
  }
  
  // Fallback to top-level learningOutcomes
  if (lesson.learningOutcomes && Array.isArray(lesson.learningOutcomes)) {
    return lesson.learningOutcomes;
  }
  
  return [];
}

/**
 * Infer section from unit number
 */
function inferSectionFromUnit(unitNumber: string): string {
  switch (unitNumber) {
    case '201':
      return 'Health & Safety Level 1';
    case '202':
      return 'Science 2365 Level 2';
    case '203':
      return 'Electrical Installations Technology';
    case '204':
      return 'Electrical Installations Technology';
    case '210':
      return 'Communication';
    case '305':
      return 'Health & Safety Level 2';
    default:
      return 'Science 2365 Level 2';
  }
}

/**
 * Get summary statistics
 */
export function getQuizCoverageStats(): {
  total: number;
  complete: number;
  partial: number;
  missing: number;
  needsWork: number;
} {
  const all = getAllLessonQuizStatuses();
  
  return {
    total: all.length,
    complete: all.filter(s => s.questionCount >= 50).length,
    partial: all.filter(s => s.questionCount > 0 && s.questionCount < 50).length,
    missing: all.filter(s => s.questionCount === 0).length,
    needsWork: all.filter(s => s.questionCount < 30).length,
  };
}
