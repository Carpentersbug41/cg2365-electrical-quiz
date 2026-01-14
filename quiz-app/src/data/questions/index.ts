/**
 * Question Bank Index
 * Central export for all question collections
 */

import { TaggedQuestion } from './types';
import { healthSafetyLegislationQuestions } from './healthSafetyLegislationQuestions';
import { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
import { parallelCircuitsQuestions } from './parallelCircuitsQuestions';
import { electricalQuantitiesQuestions } from './electricalQuantitiesQuestions';
import { ohmsLawQuestions } from './ohmsLawQuestions';
import { powerEnergyQuestions } from './powerEnergyQuestions';
import { magnetismElectromagnetismQuestions } from './magnetismElectromagnetismQuestions';
import { acPrinciplesQuestions } from './acPrinciplesQuestions';

/**
 * All tagged questions from all banks
 */
export const allTaggedQuestions: TaggedQuestion[] = [
  ...healthSafetyLegislationQuestions,
  ...electricalQuantitiesQuestions,
  ...ohmsLawQuestions,
  ...seriesCircuitsQuestions,
  ...parallelCircuitsQuestions,
  ...powerEnergyQuestions,
  ...magnetismElectromagnetismQuestions,
  ...acPrinciplesQuestions
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

/**
 * Filter questions by tags
 */
export function getQuestionsByTags(tags: string[]): TaggedQuestion[] {
  return allTaggedQuestions.filter(q => 
    tags.some(tag => q.tags.includes(tag as any))
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


