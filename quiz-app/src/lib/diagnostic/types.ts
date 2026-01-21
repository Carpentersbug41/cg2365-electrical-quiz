/**
 * Diagnostic Types
 * Type definitions for diagnostic gate functionality
 */

import { TaggedQuestion, MisconceptionCode } from '@/data/questions/types';

/**
 * Diagnostic Results: Quiz results from diagnostic test
 */
export interface DiagnosticResults {
  lessonId: string;
  coveredLessonIds: string[];
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passThreshold: number;
  wrongAnswers: WrongAnswer[];
  completedAt: Date;
}

/**
 * Wrong Answer Details
 */
export interface WrongAnswer {
  questionId: string;
  questionText: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  misconceptionCode?: MisconceptionCode;
  tags: string[];
}

/**
 * Study Plan: LLM-generated personalized study recommendations
 */
export interface StudyPlan {
  whyWrong: string; // Explanation of why mistakes were made
  keyConceptsToUnderstand: KeyConcept[]; // Concepts they need to understand
  quickFix: string; // One actionable fix
}

/**
 * Key Concept to Understand
 */
export interface KeyConcept {
  concept: string; // e.g., "Unit Conversion Direction"
  explanation: string; // Clear explanation of what they need to understand
}

/**
 * Diagnostic Analysis Request: Sent to LLM API
 */
export interface DiagnosticAnalysisRequest {
  misconceptions: MisconceptionCode[];
  score: number;
  wrongQuestions: {
    id: string;
    tags: string[];
    misconceptionCode?: MisconceptionCode;
  }[];
  lessonId: string;
}

/**
 * Diagnostic Analysis Response: From LLM API
 */
export interface DiagnosticAnalysisResponse {
  studyPlan: StudyPlan;
}
