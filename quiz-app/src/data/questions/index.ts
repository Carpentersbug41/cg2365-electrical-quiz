/**
 * Question Bank Index
 * Central export for all question collections
 */

import { TaggedQuestion, QuestionTag } from './types';
import { healthSafetyLegislationQuestions } from './healthSafetyLegislationQuestions';
import { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
import { parallelCircuitsQuestions } from './parallelCircuitsQuestions';
import { electricalQuantitiesQuestions } from './electricalQuantitiesQuestions';
import { ohmsLawQuestions } from './ohmsLawQuestions';
import { powerEnergyQuestions } from './powerEnergyQuestions';
import { magnetismElectromagnetismQuestions } from './magnetismElectromagnetismQuestions';
import { acPrinciplesQuestions } from './acPrinciplesQuestions';
import { acGenerationQuestions } from './acGenerationQuestions';
import { acWaveformQuestions } from './acWaveformQuestions';
import { transformersQuestions } from './transformersQuestions';
import { cablesApplicationsQuestions } from './cablesApplicationsQuestions';
import { testQuestions } from './testQuestions';

/**
 * All tagged questions from all banks
 */
export const allTaggedQuestions: TaggedQuestion[] = [
  ...testQuestions,
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
  ...cablesApplicationsQuestions
];

/**
 * Export individual banks
 */
export { healthSafetyLegislationQuestions } from './healthSafetyLegislationQuestions';
export { electricalQuantitiesQuestions } from './electricalQuantitiesQuestions';
export { ohmsLawQuestions } from './ohmsLawQuestions';
export { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
export { parallelCircuitsQuestions } from './parallelCircuitsQuestions';
export { powerEnergyQuestions } from './powerEnergyQuestions';
export { magnetismElectromagnetismQuestions } from './magnetismElectromagnetismQuestions';
export { acPrinciplesQuestions } from './acPrinciplesQuestions';
export { acGenerationQuestions } from './acGenerationQuestions';
export { acWaveformQuestions } from './acWaveformQuestions';
export { transformersQuestions } from './transformersQuestions';
export { cablesApplicationsQuestions } from './cablesApplicationsQuestions';
export { testQuestions } from './testQuestions';

/**
 * Filter questions by tags
 */
export function getQuestionsByTags(tags: QuestionTag[]): TaggedQuestion[] {
  return allTaggedQuestions.filter(q => 
    tags.some(tag => q.tags.includes(tag))
  );
}

/**
 * Get questions for a specific lesson
 */
export function getQuestionsByLesson(lessonId: string): TaggedQuestion[] {
  return allTaggedQuestions.filter(q => 
    q.learningOutcomeId.startsWith(lessonId)
  );
}


