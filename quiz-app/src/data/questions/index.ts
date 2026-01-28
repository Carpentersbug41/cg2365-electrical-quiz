/**
 * Question Bank Index
 * Central export for all question collections
 */

import { TaggedQuestion, QuestionTag } from './types';
import { healthSafetyLegislationQuestions } from './healthSafetyLegislationQuestions';
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
import { deadTestLanguageWhatEachTestProvesQuestions } from './deadTestLanguageWhatEachTestProvesQuestions';
import { circuitMapThinkingConductorRolesExpectedOutcomesQuestions } from './circuitMapThinkingConductorRolesExpectedOutcomesQuestions';
import { rigSafeDeadTestingMindsetAndSetupQuestions } from './rigSafeDeadTestingMindsetAndSetupQuestions';
import { provingYourTesterWorksQuestions } from './provingYourTesterWorksQuestions';
import { leadsNullingZeroingAndAvoidingFalseReadingsQuestions } from './leadsNullingZeroingAndAvoidingFalseReadingsQuestions';
import { theDeadInspectionChecklistQuestions } from './theDeadInspectionChecklistQuestions';
import { inspectionDecisionsAndRecordingQuestions } from './inspectionDecisionsAndRecordingQuestions';
import { oneWayLighting3PlateCeilingRoseQuestions } from './oneWayLighting3PlateCeilingRoseQuestions';
import { oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions } from './oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions';

/**
 * All tagged questions from all banks
 */
export const allTaggedQuestions: TaggedQuestion[] = [
  ...oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions,
  ...oneWayLighting3PlateCeilingRoseQuestions,
  ...inspectionDecisionsAndRecordingQuestions,
  ...theDeadInspectionChecklistQuestions,
  ...leadsNullingZeroingAndAvoidingFalseReadingsQuestions,
  ...provingYourTesterWorksQuestions,
  ...rigSafeDeadTestingMindsetAndSetupQuestions,
  ...circuitMapThinkingConductorRolesExpectedOutcomesQuestions,
  ...deadTestLanguageWhatEachTestProvesQuestions,
  ...healthSafetyLegislationQuestions,
  ...electricalQuantitiesQuestions,
  ...ohmsLawQuestions,
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
export { parallelCircuitsQuestions } from './parallelCircuitsQuestions';
export { powerEnergyQuestions } from './powerEnergyQuestions';
export { magnetismElectromagnetismQuestions } from './magnetismElectromagnetismQuestions';
export { acPrinciplesQuestions } from './acPrinciplesQuestions';
export { acGenerationQuestions } from './acGenerationQuestions';
export { acWaveformQuestions } from './acWaveformQuestions';
export { transformersQuestions } from './transformersQuestions';
export { cablesApplicationsQuestions } from './cablesApplicationsQuestions';
export { deadTestLanguageWhatEachTestProvesQuestions } from './deadTestLanguageWhatEachTestProvesQuestions';
export { circuitMapThinkingConductorRolesExpectedOutcomesQuestions } from './circuitMapThinkingConductorRolesExpectedOutcomesQuestions';
export { rigSafeDeadTestingMindsetAndSetupQuestions } from './rigSafeDeadTestingMindsetAndSetupQuestions';
export { provingYourTesterWorksQuestions } from './provingYourTesterWorksQuestions';
export { leadsNullingZeroingAndAvoidingFalseReadingsQuestions } from './leadsNullingZeroingAndAvoidingFalseReadingsQuestions';
export { theDeadInspectionChecklistQuestions } from './theDeadInspectionChecklistQuestions';
export { inspectionDecisionsAndRecordingQuestions } from './inspectionDecisionsAndRecordingQuestions';
export { oneWayLighting3PlateCeilingRoseQuestions } from './oneWayLighting3PlateCeilingRoseQuestions';
export { oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions } from './oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions';

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


