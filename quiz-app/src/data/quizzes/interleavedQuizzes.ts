/**
 * Interleaved Quiz Configurations
 * Pre-configured quizzes that mix concepts for deep learning
 */

import { TaggedQuestion } from '@/data/questions/types';

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  unit: string;
  type: 'interleaved' | 'blocked' | 'diagnostic';
  prerequisites: string[]; // Lesson IDs that should be completed first
  tags: string[];
  estimatedTime: number; // minutes
  passingScore: number; // percentage
  isMasteryGate: boolean; // True if this unlocks next lessons
}

/**
 * Series vs Parallel Mixed Quiz
 * The primary interleaved assessment for circuit discrimination
 */
export const SERIES_PARALLEL_MIXED_QUIZ: QuizConfig = {
  id: 'mixed-series-parallel',
  title: 'Mixed Practice: Series & Parallel Discrimination',
  description: 'Test your ability to identify and apply the correct rules for series and parallel circuits. This quiz mixes both types to develop real-world problem-solving skills.',
  unit: 'Unit 202',
  type: 'interleaved',
  prerequisites: ['202-3A', '202-4A'], // Must complete both lessons first
  tags: ['series', 'parallel', 'discrimination', 'interleaved'],
  estimatedTime: 20,
  passingScore: 70,
  isMasteryGate: true
};

/**
 * All interleaved quiz configurations
 */
export const INTERLEAVED_QUIZZES: QuizConfig[] = [
  SERIES_PARALLEL_MIXED_QUIZ
];

/**
 * Get quiz configuration by ID
 */
export function getQuizConfig(quizId: string): QuizConfig | undefined {
  return INTERLEAVED_QUIZZES.find(q => q.id === quizId);
}

/**
 * Check if learner has completed prerequisites for a quiz
 */
export function hasCompletedPrerequisites(
  quizId: string,
  completedLessons: string[]
): boolean {
  const quiz = getQuizConfig(quizId);
  if (!quiz) return false;
  
  return quiz.prerequisites.every(prereq => 
    completedLessons.includes(prereq)
  );
}

/**
 * Get available quizzes based on completed lessons
 */
export function getAvailableQuizzes(completedLessons: string[]): QuizConfig[] {
  return INTERLEAVED_QUIZZES.filter(quiz => 
    hasCompletedPrerequisites(quiz.id, completedLessons)
  );
}


