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
import { deadTestLanguageWhatEachTestProvesQuestions } from './deadTestLanguageWhatEachTestProvesQuestions';
import { circuitMapThinkingConductorRolesExpectedOutcomesQuestions } from './circuitMapThinkingConductorRolesExpectedOutcomesQuestions';
import { rigSafeDeadTestingMindsetAndSetupQuestions } from './rigSafeDeadTestingMindsetAndSetupQuestions';
import { provingYourTesterWorksQuestions } from './provingYourTesterWorksQuestions';
import { leadsNullingZeroingAndAvoidingFalseReadingsQuestions } from './leadsNullingZeroingAndAvoidingFalseReadingsQuestions';
import { theDeadInspectionChecklistQuestions } from './theDeadInspectionChecklistQuestions';
import { inspectionDecisionsAndRecordingQuestions } from './inspectionDecisionsAndRecordingQuestions';
import { oneWayLighting3PlateCeilingRoseQuestions } from './oneWayLighting3PlateCeilingRoseQuestions';
import { oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions } from './oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions';
import { threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
import { ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions } from './ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions';
import { statutoryRegulationsLawQuestions } from './statutoryRegulationsLawQuestions';
import { nonStatutoryRegulationsGuidanceQuestions } from './nonStatutoryRegulationsGuidanceQuestions';
import { usingBs7671OnAJobQuestions } from './usingBs7671OnAJobQuestions';
import { sourcesDrawingsSymbolsScaleQuestions } from './sourcesDrawingsSymbolsScaleQuestions';
import { readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions } from './readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions';
import { recognisingElectricalSymbolsOnDrawingsQuestions } from './recognisingElectricalSymbolsOnDrawingsQuestions';
import { convertingDrawingScaleToRealMeasurementsQuestions } from './convertingDrawingScaleToRealMeasurementsQuestions';
import { circuitTypesWhatTheyDoPrinciplesOfOperationQuestions } from './circuitTypesWhatTheyDoPrinciplesOfOperationQuestions';
import { wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions } from './wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions';
import { cableSizingBasicsIbInIzFactorsQuestions } from './cableSizingBasicsIbInIzFactorsQuestions';
import { protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions } from './protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions';
import { specialisedInstallingEquipmentQuestions } from './specialisedInstallingEquipmentQuestions';
import { spacingFactorEnclosureFillQuestions } from './spacingFactorEnclosureFillQuestions';
import { sequentialGeneratorTestQuestions } from './sequentialGeneratorTestQuestions';
import { circuitTypesWhatTheyDoQuestions } from './circuitTypesWhatTheyDoQuestions';
import { rolesResponsibilitiesQuestions } from './rolesResponsibilitiesQuestions';
import { environmentalLegislationQuestions } from './environmentalLegislationQuestions';
import { magnetismBasicsQuestions } from './magnetismBasicsQuestions';
import { magneticEffectsOfElectricalCurrentQuestions } from './magneticEffectsOfElectricalCurrentQuestions';

/**
 * All tagged questions from all banks
 */
export const allTaggedQuestions: TaggedQuestion[] = [
  ...magneticEffectsOfElectricalCurrentQuestions,
  ...magnetismBasicsQuestions,
  ...environmentalLegislationQuestions,
  ...rolesResponsibilitiesQuestions,
  ...circuitTypesWhatTheyDoQuestions,
  ...sequentialGeneratorTestQuestions,
  ...spacingFactorEnclosureFillQuestions,
  ...specialisedInstallingEquipmentQuestions,
  ...protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions,
  ...cableSizingBasicsIbInIzFactorsQuestions,
  ...wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions,
  ...circuitTypesWhatTheyDoPrinciplesOfOperationQuestions,
  ...convertingDrawingScaleToRealMeasurementsQuestions,
  ...recognisingElectricalSymbolsOnDrawingsQuestions,
  ...readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions,
  ...sourcesDrawingsSymbolsScaleQuestions,
  ...usingBs7671OnAJobQuestions,
  ...nonStatutoryRegulationsGuidanceQuestions,
  ...statutoryRegulationsLawQuestions,
  ...ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions,
  ...threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions,
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
  ...transformersQuestions
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
export { deadTestLanguageWhatEachTestProvesQuestions } from './deadTestLanguageWhatEachTestProvesQuestions';
export { circuitMapThinkingConductorRolesExpectedOutcomesQuestions } from './circuitMapThinkingConductorRolesExpectedOutcomesQuestions';
export { rigSafeDeadTestingMindsetAndSetupQuestions } from './rigSafeDeadTestingMindsetAndSetupQuestions';
export { provingYourTesterWorksQuestions } from './provingYourTesterWorksQuestions';
export { leadsNullingZeroingAndAvoidingFalseReadingsQuestions } from './leadsNullingZeroingAndAvoidingFalseReadingsQuestions';
export { theDeadInspectionChecklistQuestions } from './theDeadInspectionChecklistQuestions';
export { inspectionDecisionsAndRecordingQuestions } from './inspectionDecisionsAndRecordingQuestions';
export { oneWayLighting3PlateCeilingRoseQuestions } from './oneWayLighting3PlateCeilingRoseQuestions';
export { oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions } from './oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions';
export { threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
export { ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions } from './ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions';
export { statutoryRegulationsLawQuestions } from './statutoryRegulationsLawQuestions';
export { nonStatutoryRegulationsGuidanceQuestions } from './nonStatutoryRegulationsGuidanceQuestions';
export { usingBs7671OnAJobQuestions } from './usingBs7671OnAJobQuestions';
export { sourcesDrawingsSymbolsScaleQuestions } from './sourcesDrawingsSymbolsScaleQuestions';
export { readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions } from './readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions';
export { recognisingElectricalSymbolsOnDrawingsQuestions } from './recognisingElectricalSymbolsOnDrawingsQuestions';
export { convertingDrawingScaleToRealMeasurementsQuestions } from './convertingDrawingScaleToRealMeasurementsQuestions';
export { circuitTypesWhatTheyDoPrinciplesOfOperationQuestions } from './circuitTypesWhatTheyDoPrinciplesOfOperationQuestions';
export { wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions } from './wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions';
export { cableSizingBasicsIbInIzFactorsQuestions } from './cableSizingBasicsIbInIzFactorsQuestions';
export { protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions } from './protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions';
export { specialisedInstallingEquipmentQuestions } from './specialisedInstallingEquipmentQuestions';
export { spacingFactorEnclosureFillQuestions } from './spacingFactorEnclosureFillQuestions';
export { sequentialGeneratorTestQuestions } from './sequentialGeneratorTestQuestions';
export { circuitTypesWhatTheyDoQuestions } from './circuitTypesWhatTheyDoQuestions';
export { rolesResponsibilitiesQuestions } from './rolesResponsibilitiesQuestions';
export { environmentalLegislationQuestions } from './environmentalLegislationQuestions';
export { magnetismBasicsQuestions } from './magnetismBasicsQuestions';
export { magneticEffectsOfElectricalCurrentQuestions } from './magneticEffectsOfElectricalCurrentQuestions';

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


