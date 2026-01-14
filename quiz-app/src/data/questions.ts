export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  section: string; // e.g., "Health and Safety", "Communication"
  image?: string; // Optional path to an image
}

import { healthAndSafetyQuestions } from './healthAndSafetyQuestions';
import { communicationQuestions } from './communicationQuestions';
import { scienceQuestions } from './scienceQuestions';
import { electricalQuantitiesQuestions } from './questions/electricalQuantitiesQuestions';
import { ohmsLawQuestions } from './questions/ohmsLawQuestions';
import { seriesCircuitsQuestions } from './questions/seriesCircuitsQuestions';
import { powerEnergyQuestions } from './questions/powerEnergyQuestions';
import { magnetismElectromagnetismQuestions } from './questions/magnetismElectromagnetismQuestions';
import { acPrinciplesQuestions } from './questions/acPrinciplesQuestions';

export const questions: Question[] = [
  ...healthAndSafetyQuestions,
  ...communicationQuestions,
  ...scienceQuestions,
  ...electricalQuantitiesQuestions,
  ...ohmsLawQuestions,
  ...seriesCircuitsQuestions,
  ...powerEnergyQuestions,
  ...magnetismElectromagnetismQuestions,
  ...acPrinciplesQuestions,
];
