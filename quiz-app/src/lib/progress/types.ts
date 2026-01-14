/**
 * Progress Tracking Types
 * Defines progress data structures for localStorage-based tracking
 */

/**
 * Lesson Progress: Tracks learner progress through a lesson
 */
export interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'reviewed';
  completedAt?: Date;
  lastAccessedAt: Date;
  blocksCompleted: string[]; // Block IDs
  practiceAttempts: {
    blockId: string;
    questionId: string;
    attempts: number;
    lastAttemptCorrect: boolean;
    timestamp: Date;
    masteryPending?: boolean; // Awaiting delayed confirmation
    nextReviewAt?: Date; // When to recheck mastery
  }[];
  timeSpent: number; // seconds
  notes?: string;
  masteryPending: boolean; // Overall lesson mastery pending
  masteryAchieved: boolean; // True mastery confirmed after delay
  nextReviewAt?: Date; // Next scheduled review for lesson
}

/**
 * Quiz Attempt: Single quiz attempt record
 */
export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    misconceptionCode?: string;
  }[];
  timeSpent: number; // seconds
  passed: boolean;
  passThreshold: number; // e.g., 70
}

/**
 * Quiz Progress: Tracks quiz attempts and mastery
 */
export interface QuizProgress {
  quizId: string;
  quizTitle: string;
  attempts: QuizAttempt[];
  bestScore: number;
  bestPercentage: number;
  attemptsCount: number;
  lastAttemptDate?: Date;
  masteryAchieved: boolean; // Passed + delayed recheck passed
  masteryPending: boolean; // Passed once, awaiting delayed confirmation
  masteryDate?: Date;
  nextReviewAt?: Date; // When delayed mastery check is scheduled
  retestScheduledFor?: Date; // Spaced repetition
  delayedCheckAttempts?: number; // Number of delayed check attempts
}

/**
 * Learning Path Progress: Overall progress across lessons
 */
export interface LearningPathProgress {
  pathId: string; // e.g., "unit-202"
  pathTitle: string;
  lessonsProgress: LessonProgress[];
  quizzesProgress: QuizProgress[];
  overallCompletionPercentage: number;
  currentLessonId?: string;
  startedAt: Date;
  lastActivityAt: Date;
  totalTimeSpent: number; // seconds
  streakDays: number;
  lastStreakDate?: Date;
}

/**
 * Spaced Review Item: Item scheduled for review
 */
export interface SpacedReviewItem {
  itemId: string; // Question ID or block ID
  itemType: 'question' | 'concept' | 'block';
  lessonId: string;
  lastReviewed: Date;
  nextReviewDate: Date;
  reviewCount: number;
  successCount: number;
  interval: number; // days
  easeFactor: number; // SM-2 algorithm
}

/**
 * Misconception Tracking: Persistent misconception records
 */
export interface MisconceptionTracking {
  misconceptionCode: string;
  occurrences: {
    date: Date;
    lessonId: string;
    questionId: string;
    fixed: boolean;
  }[];
  firstOccurred: Date;
  lastOccurred: Date;
  totalOccurrences: number;
  fixedCount: number;
  status: 'active' | 'improving' | 'fixed';
  relatedLessons: string[];
}

/**
 * Progress Summary: Dashboard-level summary
 */
export interface ProgressSummary {
  userId?: string;
  lessonsCompleted: number;
  lessonsInProgress: number;
  quizzesPassed: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  masteryAchievements: {
    lessonId: string;
    achievedAt: Date;
  }[];
  activeMisconceptions: MisconceptionTracking[];
  upcomingReviews: SpacedReviewItem[];
  lastUpdated: Date;
}

/**
 * Progress Storage: LocalStorage wrapper type
 */
export interface ProgressStorage {
  version: string; // Schema version for migration (e.g., "1.0", "2.0")
  progressVersion: number; // Numeric version for easier comparison (e.g., 1, 2, 3)
  learningPaths: LearningPathProgress[];
  spacedReviews: SpacedReviewItem[];
  misconceptions: MisconceptionTracking[];
  lastSynced?: Date;
  userId?: string; // For future server sync
  lessonContentVersions?: Record<string, number>; // Track content version for each lesson
}

/**
 * Progress Event: For analytics/logging
 */
export interface ProgressEvent {
  eventType:
    | 'lesson-started'
    | 'lesson-completed'
    | 'quiz-attempted'
    | 'quiz-passed'
    | 'mastery-achieved'
    | 'misconception-detected'
    | 'misconception-fixed'
    | 'review-completed';
  timestamp: Date;
  lessonId?: string;
  quizId?: string;
  metadata?: Record<string, unknown>;
}





