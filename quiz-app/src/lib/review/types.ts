import { Question } from '@/data/questions';

export interface WrongQuestionInput {
  questionNumber: number;
  questionStableId?: string | null;
  questionText: string;
  category?: string;
  tags?: string[];
  unitCode?: string | null;
  loCode?: string | null;
  acCode?: string | null;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  misconceptionName?: string;
  misconceptionFix?: string;
}

export interface QuizFeedbackReportItem {
  questionNumber: number;
  whyWrong: string;
  howToGetRight: string;
  whatToReview: string[];
}

export interface QuizFeedbackReport {
  summary: string;
  overallFocus: string[];
  items: QuizFeedbackReportItem[];
}

export interface BuiltQuizQuestion extends Question {
  stableId?: string;
}
