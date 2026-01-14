/**
 * Review Scheduler Service
 * Implements spaced repetition scheduling based on forgetting curves
 */

import { SpacedReviewItem, LessonProgress, QuizProgress } from './types';
import { getProgressStorage, saveProgressStorage } from './progressService';

// Review intervals in days (based on SM-2 algorithm simplified)
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

/**
 * Calculate next review date based on performance and review count
 */
export function calculateNextReviewDate(
  lastReviewed: Date,
  reviewCount: number,
  performance: number // 0-1 scale, 1 = perfect
): Date {
  const intervalIndex = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  let interval = REVIEW_INTERVALS[intervalIndex];

  // Adjust interval based on performance
  if (performance < 0.6) {
    // Poor performance: reset to day 1
    interval = REVIEW_INTERVALS[0];
  } else if (performance < 0.8) {
    // Mediocre performance: don't advance
    interval = REVIEW_INTERVALS[Math.max(0, intervalIndex - 1)];
  } else {
    // Good performance: use calculated interval
    // (Already set above)
  }

  const nextReview = new Date(lastReviewed);
  nextReview.setDate(nextReview.getDate() + interval);
  return nextReview;
}

/**
 * Schedule a review for a lesson
 */
export function scheduleReview(
  lessonId: string,
  lastReviewed: Date = new Date(),
  reviewCount: number = 0,
  performance: number = 1
): Date {
  const nextReviewDate = calculateNextReviewDate(lastReviewed, reviewCount, performance);
  
  const storage = getProgressStorage();
  
  // Find or create spaced review item
  let reviewItem = storage.spacedReviews.find(
    r => r.itemId === lessonId && r.itemType === 'concept'
  );

  if (!reviewItem) {
    reviewItem = {
      itemId: lessonId,
      itemType: 'concept',
      lessonId,
      lastReviewed,
      nextReviewDate,
      reviewCount: 0,
      successCount: 0,
      interval: REVIEW_INTERVALS[0],
      easeFactor: 2.5, // Default ease factor
    };
    storage.spacedReviews.push(reviewItem);
  } else {
    reviewItem.lastReviewed = lastReviewed;
    reviewItem.nextReviewDate = nextReviewDate;
    reviewItem.reviewCount = reviewCount + 1;
    if (performance >= 0.8) {
      reviewItem.successCount++;
    }
  }

  saveProgressStorage(storage);
  return nextReviewDate;
}

/**
 * Get all reviews that are due today or overdue
 */
export function getReviewsDue(): SpacedReviewItem[] {
  const storage = getProgressStorage();
  const now = new Date();
  
  return storage.spacedReviews.filter(review => {
    const reviewDate = new Date(review.nextReviewDate);
    return reviewDate <= now;
  }).sort((a, b) => {
    // Sort by urgency (oldest due date first)
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
  });
}

/**
 * Get upcoming reviews (next 7 days)
 */
export function getUpcomingReviews(days: number = 7): SpacedReviewItem[] {
  const storage = getProgressStorage();
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return storage.spacedReviews.filter(review => {
    const reviewDate = new Date(review.nextReviewDate);
    return reviewDate > now && reviewDate <= futureDate;
  }).sort((a, b) => {
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
  });
}

/**
 * Mark a review as complete and reschedule
 */
export function markReviewComplete(
  lessonId: string,
  performance: number // 0-1 scale
): void {
  const storage = getProgressStorage();
  
  const reviewItem = storage.spacedReviews.find(
    r => r.itemId === lessonId && r.itemType === 'concept'
  );

  if (!reviewItem) {
    // Create new review schedule
    scheduleReview(lessonId, new Date(), 0, performance);
    return;
  }

  // Update review item
  const now = new Date();
  reviewItem.lastReviewed = now;
  reviewItem.reviewCount++;
  
  if (performance >= 0.8) {
    reviewItem.successCount++;
  }

  // Calculate next review date
  reviewItem.nextReviewDate = calculateNextReviewDate(
    now,
    reviewItem.reviewCount,
    performance
  );

  // Update interval
  const intervalIndex = Math.min(reviewItem.reviewCount, REVIEW_INTERVALS.length - 1);
  reviewItem.interval = REVIEW_INTERVALS[intervalIndex];

  saveProgressStorage(storage);
}

/**
 * Get review statistics
 */
export function getReviewStats(): {
  dueToday: number;
  dueThisWeek: number;
  totalScheduled: number;
  streak: number;
} {
  const storage = getProgressStorage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const dueToday = storage.spacedReviews.filter(r => {
    const reviewDate = new Date(r.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  }).length;

  const dueThisWeek = storage.spacedReviews.filter(r => {
    const reviewDate = new Date(r.nextReviewDate);
    return reviewDate > today && reviewDate <= nextWeek;
  }).length;

  const totalScheduled = storage.spacedReviews.length;

  // Calculate streak (consecutive days with completed reviews)
  // Simplified: check last activity dates
  const streak = storage.learningPaths.reduce((maxStreak, path) => {
    return Math.max(maxStreak, path.streakDays || 0);
  }, 0);

  return {
    dueToday,
    dueThisWeek,
    totalScheduled,
    streak,
  };
}

/**
 * Clear old completed reviews (optional cleanup)
 */
export function cleanupOldReviews(daysOld: number = 90): void {
  const storage = getProgressStorage();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  storage.spacedReviews = storage.spacedReviews.filter(review => {
    const reviewDate = new Date(review.lastReviewed);
    // Keep if recently reviewed or has upcoming review
    return reviewDate > cutoffDate || new Date(review.nextReviewDate) > new Date();
  });

  saveProgressStorage(storage);
}

