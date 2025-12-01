export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  section: string; // e.g., "Health and Safety", "Communication"
}

import { healthAndSafetyQuestions } from './healthAndSafetyQuestions';
import { communicationQuestions } from './communicationQuestions';

export const questions: Question[] = [
  ...healthAndSafetyQuestions,
  ...communicationQuestions,
];

