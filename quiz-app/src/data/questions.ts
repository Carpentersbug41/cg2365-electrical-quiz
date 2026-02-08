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
import { parallelCircuitsQuestions } from './questions/parallelCircuitsQuestions';
import { powerEnergyQuestions } from './questions/powerEnergyQuestions';
import { magnetismElectromagnetismQuestions } from './questions/magnetismElectromagnetismQuestions';
import { acPrinciplesQuestions } from './questions/acPrinciplesQuestions';
import { acGenerationQuestions } from './questions/acGenerationQuestions';
import { acWaveformQuestions } from './questions/acWaveformQuestions';
import { transformersQuestions } from './questions/transformersQuestions';
import { deadTestLanguageWhatEachTestProvesQuestions } from './questions/deadTestLanguageWhatEachTestProvesQuestions';
import { circuitMapThinkingConductorRolesExpectedOutcomesQuestions } from './questions/circuitMapThinkingConductorRolesExpectedOutcomesQuestions';
import { rigSafeDeadTestingMindsetAndSetupQuestions } from './questions/rigSafeDeadTestingMindsetAndSetupQuestions';
import { provingYourTesterWorksQuestions } from './questions/provingYourTesterWorksQuestions';
import { leadsNullingZeroingAndAvoidingFalseReadingsQuestions } from './questions/leadsNullingZeroingAndAvoidingFalseReadingsQuestions';
import { theDeadInspectionChecklistQuestions } from './questions/theDeadInspectionChecklistQuestions';
import { inspectionDecisionsAndRecordingQuestions } from './questions/inspectionDecisionsAndRecordingQuestions';
import { oneWayLighting3PlateCeilingRoseQuestions } from './questions/oneWayLighting3PlateCeilingRoseQuestions';
import { oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions } from './questions/oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions';
import { threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './questions/3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
import { ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions } from './questions/ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions';
import { statutoryRegulationsLawQuestions } from './questions/statutoryRegulationsLawQuestions';
import { nonStatutoryRegulationsGuidanceQuestions } from './questions/nonStatutoryRegulationsGuidanceQuestions';
import { usingBs7671OnAJobQuestions } from './questions/usingBs7671OnAJobQuestions';
import { sourcesDrawingsSymbolsScaleQuestions } from './questions/sourcesDrawingsSymbolsScaleQuestions';
import { readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions } from './questions/readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions';
import { recognisingElectricalSymbolsOnDrawingsQuestions } from './questions/recognisingElectricalSymbolsOnDrawingsQuestions';
import { convertingDrawingScaleToRealMeasurementsQuestions } from './questions/convertingDrawingScaleToRealMeasurementsQuestions';
import { circuitTypesWhatTheyDoPrinciplesOfOperationQuestions } from './questions/circuitTypesWhatTheyDoPrinciplesOfOperationQuestions';
import { wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions } from './questions/wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions';
import { cableSizingBasicsIbInIzFactorsQuestions } from './questions/cableSizingBasicsIbInIzFactorsQuestions';
import { protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions } from './questions/protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions';
import { specialisedInstallingEquipmentQuestions } from './questions/specialisedInstallingEquipmentQuestions';
import { spacingFactorEnclosureFillQuestions } from './questions/spacingFactorEnclosureFillQuestions';
import { sequentialGeneratorTestQuestions } from './questions/sequentialGeneratorTestQuestions';
import { circuitTypesWhatTheyDoQuestions } from './questions/circuitTypesWhatTheyDoQuestions';
import { rolesResponsibilitiesQuestions } from './questions/rolesResponsibilitiesQuestions';
import { environmentalLegislationQuestions } from './questions/environmentalLegislationQuestions';
import { magnetismBasicsQuestions } from './questions/magnetismBasicsQuestions';
import { magneticEffectsOfElectricalCurrentQuestions } from './questions/magneticEffectsOfElectricalCurrentQuestions';

export const questions: Question[] = [
  ...healthAndSafetyQuestions,
  ...communicationQuestions,
  ...scienceQuestions,
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
  ...deadTestLanguageWhatEachTestProvesQuestions,
  ...circuitMapThinkingConductorRolesExpectedOutcomesQuestions,
  ...rigSafeDeadTestingMindsetAndSetupQuestions,
  ...provingYourTesterWorksQuestions,
  ...leadsNullingZeroingAndAvoidingFalseReadingsQuestions,
  ...theDeadInspectionChecklistQuestions,
  ...inspectionDecisionsAndRecordingQuestions,
  ...oneWayLighting3PlateCeilingRoseQuestions,
  ...oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions,
  ...threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions,
  ...ceilingRoseToOneWaySwitchForAbsoluteBeginnersQuestions,
  ...statutoryRegulationsLawQuestions,
  ...nonStatutoryRegulationsGuidanceQuestions,
  ...usingBs7671OnAJobQuestions,
  ...sourcesDrawingsSymbolsScaleQuestions,
  ...readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions,
  ...recognisingElectricalSymbolsOnDrawingsQuestions,
  ...convertingDrawingScaleToRealMeasurementsQuestions,
  ...circuitTypesWhatTheyDoPrinciplesOfOperationQuestions,
  ...wiringSystemsByEnvironmentChoosingTheRightCableContainmentQuestions,
  ...cableSizingBasicsIbInIzFactorsQuestions,
  ...protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions,
  ...specialisedInstallingEquipmentQuestions,
  ...spacingFactorEnclosureFillQuestions,
  ...sequentialGeneratorTestQuestions,
  ...circuitTypesWhatTheyDoQuestions,
  ...rolesResponsibilitiesQuestions,
  ...environmentalLegislationQuestions,
  ...magnetismBasicsQuestions,
  ...magneticEffectsOfElectricalCurrentQuestions,
];

// Re-export allTaggedQuestions for API routes
export { allTaggedQuestions } from './questions/index';
