/**
 * Diagnostic Service
 * Helper functions for diagnostic gate functionality
 */

import { getCumulativeQuestions, getCumulativeQuizMetadata } from '@/lib/questions/cumulativeQuestions';
import { getLessonById } from '@/data/lessons/lessonIndex';
import { TaggedQuestion } from '@/data/questions/types';

/**
 * Get diagnostic questions for a lesson
 * Uses cumulative quiz system to pull 10 questions from ALL previous lessons in unit
 */
export function getDiagnosticQuestions(lessonId: string): TaggedQuestion[] {
  // Get 10 questions from ALL previous lessons in the unit
  // Weight: 0.0 means 0% from current lesson, 100% from all previous
  const questions = getCumulativeQuestions(lessonId, 10, 0.0);
  
  return questions;
}

/**
 * Get list of all previous lessons covered by diagnostic
 */
export function getDiagnosticCoverage(lessonId: string): {
  coveredLessonIds: string[];
  isFirstLesson: boolean;
} {
  const metadata = getCumulativeQuizMetadata(lessonId);
  
  if (!metadata || metadata.isFirstInUnit) {
    return {
      coveredLessonIds: [],
      isFirstLesson: true
    };
  }
  
  // Return all previous lessons (exclude current)
  return {
    coveredLessonIds: metadata.previousLessons.map(l => l.id),
    isFirstLesson: false
  };
}

/**
 * Check if user has passed diagnostic for a lesson
 * Reads from localStorage
 */
export function checkDiagnosticPass(lessonId: string): boolean {
  if (typeof window === 'undefined') {
    return false; // SSR - assume not passed
  }
  
  const key = `diagnostic-pass-${lessonId}`;
  const value = localStorage.getItem(key);
  
  return value === 'true';
}

/**
 * Save diagnostic pass status
 * Writes to localStorage
 */
export function saveDiagnosticPass(lessonId: string): void {
  if (typeof window === 'undefined') {
    return; // SSR - can't save
  }
  
  const key = `diagnostic-pass-${lessonId}`;
  localStorage.setItem(key, 'true');
}

/**
 * Clear diagnostic pass status (for retesting)
 */
export function clearDiagnosticPass(lessonId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const key = `diagnostic-pass-${lessonId}`;
  localStorage.removeItem(key);
}

/**
 * Get diagnostic pass status for all lessons
 * Useful for debugging or showing completion status
 */
export function getAllDiagnosticPassStatuses(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const statuses: Record<string, boolean> = {};
  
  // Scan localStorage for diagnostic pass keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('diagnostic-pass-')) {
      const lessonId = key.replace('diagnostic-pass-', '');
      statuses[lessonId] = localStorage.getItem(key) === 'true';
    }
  }
  
  return statuses;
}
