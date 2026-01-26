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
import { healthSafetyLegislationQuestions } from './questions/healthSafetyLegislationQuestions';
import { electricalQuantitiesQuestions } from './questions/electricalQuantitiesQuestions';
import { ohmsLawQuestions } from './questions/ohmsLawQuestions';
import { seriesCircuitsQuestions } from './questions/seriesCircuitsQuestions';
import { parallelCircuitsQuestions } from './questions/parallelCircuitsQuestions';
import { powerEnergyQuestions } from './questions/powerEnergyQuestions';
import { magnetismElectromagnetismQuestions } from './questions/magnetismElectromagnetismQuestions';
import { acPrinciplesQuestions } from './questions/acPrinciplesQuestions';
import { acGenerationQuestions } from './questions/acGenerationQuestions';
import { acWaveformQuestions } from './questions/acWaveformQuestions';
import { transformersQuestions } from './questions/transformersQuestions';
import { deadTestLanguageWhatEachTestProvesQuestions } from './questions/deadTestLanguageWhatEachTestProvesQuestions';

export const questions: Question[] = [
  ...healthAndSafetyQuestions,
  ...communicationQuestions,
  ...scienceQuestions,
  ...healthSafetyLegislationQuestions,
  ...electricalQuantitiesQuestions,
  ...ohmsLawQuestions,
  ...seriesCircuitsQuestions,
  ...parallelCircuitsQuestions,
  ...powerEnergyQuestions,
  ...magnetismElectromagnetismQuestions,
  ...acPrinciplesQuestions,
  ...acGenerationQuestions,
  ...acWaveformQuestions,
  ...transformersQuestions,
];
