/**
 * Progress Tracking Service
 * localStorage-based progress tracking for lessons and quizzes
 */

import {
  LessonProgress,
  QuizProgress,
  QuizAttempt,
  ProgressStorage,
  LearningPathProgress,
} from './types';
import { 
  safeLoadProgress, 
  PROGRESS_STORAGE_KEY,
  CURRENT_PROGRESS_VERSION 
} from './migrationService';

const STORAGE_KEY = PROGRESS_STORAGE_KEY;
const STORAGE_VERSION = `${CURRENT_PROGRESS_VERSION}.0`;

/**
 * Get all progress data from localStorage with automatic migration
 */
export function getProgressStorage(): ProgressStorage {
  return safeLoadProgress();
}

/**
 * Save progress data to localStorage
 */
export function saveProgressStorage(data: ProgressStorage): void {
  if (typeof window === 'undefined') return;

  try {
    data.lastSynced = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save progress data:', error);
  }
}

/**
 * Get lesson progress by lesson ID
 */
export function getLessonProgress(lessonId: string): LessonProgress | null {
  const storage = getProgressStorage();
  
  for (const path of storage.learningPaths) {
    const lesson = path.lessonsProgress.find(l => l.lessonId === lessonId);
    if (lesson) return lesson;
  }

  return null;
}

/**
 * Save lesson progress
 */
export function saveLessonProgress(
  lessonId: string,
  updates: Partial<LessonProgress>
): void {
  const storage = getProgressStorage();
  
  // Find or create learning path (default to unit-202)
  let path = storage.learningPaths.find(p => p.pathId === 'unit-202');
  
  if (!path) {
    path = {
      pathId: 'unit-202',
      pathTitle: 'Unit 202 Electrical Science',
      lessonsProgress: [],
      quizzesProgress: [],
      overallCompletionPercentage: 0,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      totalTimeSpent: 0,
      streakDays: 0,
    };
    storage.learningPaths.push(path);
  }

  // Find or create lesson progress
  let lesson = path.lessonsProgress.find(l => l.lessonId === lessonId);
  
  if (!lesson) {
    lesson = {
      lessonId,
      lessonTitle: updates.lessonTitle || lessonId,
      status: 'not-started',
      lastAccessedAt: new Date(),
      blocksCompleted: [],
      practiceAttempts: [],
      timeSpent: 0,
      masteryPending: false,
      masteryAchieved: false,
    };
    path.lessonsProgress.push(lesson);
  }

  // Apply updates
  Object.assign(lesson, updates, {
    lastAccessedAt: new Date(),
  });

  // Update path metadata
  path.lastActivityAt = new Date();
  path.totalTimeSpent += updates.timeSpent || 0;

  // Recalculate completion percentage
  const completedLessons = path.lessonsProgress.filter(l => l.status === 'completed').length;
  const totalLessons = path.lessonsProgress.length;
  path.overallCompletionPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  saveProgressStorage(storage);
}

/**
 * Mark lesson as completed
 */
export function completeLesson(lessonId: string): void {
  saveLessonProgress(lessonId, {
    status: 'completed',
    completedAt: new Date(),
  });
}

/**
 * Calculate next review date for delayed mastery confirmation
 * Default: 1 day later (24 hours)
 */
function calculateNextReviewDate(delayDays: number = 1): Date {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + delayDays);
  return nextReview;
}

/**
 * Check if mastery review is due
 */
export function isMasteryReviewDue(progress: LessonProgress | QuizProgress): boolean {
  if (!progress.nextReviewAt) return false;
  return new Date() >= new Date(progress.nextReviewAt);
}

/**
 * Mark lesson mastery as pending (passed once, needs delayed confirmation)
 */
export function markLessonMasteryPending(
  lessonId: string,
  delayDays: number = 1
): void {
  const lesson = getLessonProgress(lessonId);
  if (!lesson) return;

  saveLessonProgress(lessonId, {
    masteryPending: true,
    masteryAchieved: false,
    nextReviewAt: calculateNextReviewDate(delayDays),
  });

  console.log(`📅 Mastery pending for ${lessonId}, review scheduled for ${calculateNextReviewDate(delayDays)}`);
}

/**
 * Confirm lesson mastery after delayed recheck
 */
export function confirmLessonMastery(lessonId: string): void {
  saveLessonProgress(lessonId, {
    masteryPending: false,
    masteryAchieved: true,
    status: 'completed',
    completedAt: new Date(),
  });

  console.log(`✓ Mastery confirmed for ${lessonId}`);
}

/**
 * Reset mastery (failed delayed recheck)
 */
export function resetLessonMastery(lessonId: string): void {
  saveLessonProgress(lessonId, {
    masteryPending: false,
    masteryAchieved: false,
    nextReviewAt: undefined,
  });

  console.log(`✗ Mastery reset for ${lessonId}, needs more practice`);
}

/**
 * Get quiz progress by quiz ID
 */
export function getQuizProgress(quizId: string): QuizProgress | null {
  const storage = getProgressStorage();
  
  for (const path of storage.learningPaths) {
    const quiz = path.quizzesProgress.find(q => q.quizId === quizId);
    if (quiz) return quiz;
  }

  return null;
}

/**
 * Save quiz attempt
 */
export function saveQuizAttempt(
  quizId: string,
  quizTitle: string,
  attempt: QuizAttempt
): void {
  const storage = getProgressStorage();
  
  // Find or create learning path
  let path = storage.learningPaths.find(p => p.pathId === 'unit-202');
  
  if (!path) {
    path = {
      pathId: 'unit-202',
      pathTitle: 'Unit 202 Electrical Science',
      lessonsProgress: [],
      quizzesProgress: [],
      overallCompletionPercentage: 0,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      totalTimeSpent: 0,
      streakDays: 0,
    };
    storage.learningPaths.push(path);
  }

  // Find or create quiz progress
  let quiz = path.quizzesProgress.find(q => q.quizId === quizId);
  
  if (!quiz) {
    quiz = {
      quizId,
      quizTitle,
      attempts: [],
      bestScore: 0,
      bestPercentage: 0,
      attemptsCount: 0,
      masteryAchieved: false,
      masteryPending: false,
    };
    path.quizzesProgress.push(quiz);
  }

  // Add attempt
  quiz.attempts.push(attempt);
  quiz.attemptsCount++;
  quiz.lastAttemptDate = attempt.completedAt;

  // Update best score
  if (attempt.score > quiz.bestScore) {
    quiz.bestScore = attempt.score;
    quiz.bestPercentage = attempt.percentage;
  }

  // Check for mastery (passed with >= 80%)
  // NEW: Instead of immediate mastery, set masteryPending
  if (attempt.passed && attempt.percentage >= 80) {
    if (!quiz.masteryPending && !quiz.masteryAchieved) {
      // First pass: Set pending, schedule review
      quiz.masteryPending = true;
      quiz.nextReviewAt = calculateNextReviewDate(1); // 1 day delay
      console.log(`📅 Quiz mastery pending for ${quizId}, review scheduled`);
    } else if (quiz.masteryPending && isMasteryReviewDue(quiz)) {
      // Delayed recheck passed: Confirm mastery
      quiz.masteryAchieved = true;
      quiz.masteryPending = false;
      quiz.masteryDate = attempt.completedAt;
      console.log(`✓ Quiz mastery confirmed for ${quizId}`);
    }
  } else if (quiz.masteryPending) {
    // Failed delayed recheck: Reset mastery
    quiz.masteryPending = false;
    quiz.nextReviewAt = undefined;
    console.log(`✗ Quiz mastery reset for ${quizId}, needs more practice`);
  }

  // Update path
  path.lastActivityAt = new Date();
  path.totalTimeSpent += attempt.timeSpent;

  saveProgressStorage(storage);
}

/**
 * Get all lessons progress for a learning path
 */
export function getLearningPathProgress(pathId: string = 'unit-202'): LearningPathProgress | null {
  const storage = getProgressStorage();
  return storage.learningPaths.find(p => p.pathId === pathId) || null;
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export progress as JSON (for backup/debugging)
 */
export function exportProgress(): string {
  const storage = getProgressStorage();
  return JSON.stringify(storage, null, 2);
}

/**
 * Import progress from JSON
 */
export function importProgress(jsonData: string): boolean {
  try {
    const data: ProgressStorage = JSON.parse(jsonData);
    saveProgressStorage(data);
    return true;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return false;
  }
}





