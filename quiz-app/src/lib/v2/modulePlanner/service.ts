import {
  createPlannerRun,
  deletePlannerRun,
  getPlannerRunSummary,
  getReplayableArtifacts,
  isModulePlannerEnabled,
  listModulePlannerRuns,
  listModulePlannerUnitLos,
  listModulePlannerUnits,
  ModulePlannerError,
  runM0Distill,
  runM1Analyze,
  runM2Coverage,
  runM3Plan,
  runM4Blueprints,
  runM5Validate,
  runM6DeleteLesson,
  runM6GenerateLesson,
} from '@/lib/module_planner';
import {
  createSyllabusIngestion,
  deleteModuleRunsBySyllabusVersionIds,
  deleteSyllabusVersionsByIds,
  getLatestSyllabusIngestion,
  getSyllabusStructureByVersionAndUnit,
  updateSyllabusIngestion,
} from '@/lib/module_planner/db';
import { listSyllabusVersions, seedLegacyChunksAsDefaultVersionIfNeeded } from '@/lib/module_planner/syllabus';
import type { DistillInput } from '@/lib/module_planner/types';

export type { SyllabusVersionRow } from '@/lib/module_planner/types';
export type { DistillInput };
export { ModulePlannerError };

export {
  createPlannerRun as createV2PlannerRun,
  deletePlannerRun as deleteV2PlannerRun,
  getLatestSyllabusIngestion as getLatestV2SyllabusIngestion,
  getPlannerRunSummary as getV2PlannerRunSummary,
  getReplayableArtifacts as getV2ReplayableArtifacts,
  getSyllabusStructureByVersionAndUnit as getV2SyllabusStructureByVersionAndUnit,
  isModulePlannerEnabled as isV2ModulePlannerEnabled,
  listModulePlannerRuns as listV2ModulePlannerRuns,
  listModulePlannerUnitLos as listV2ModulePlannerUnitLos,
  listModulePlannerUnits as listV2ModulePlannerUnits,
  listSyllabusVersions as listV2SyllabusVersions,
  runM0Distill as runV2M0Distill,
  runM1Analyze as runV2M1Analyze,
  runM2Coverage as runV2M2Coverage,
  runM3Plan as runV2M3Plan,
  runM4Blueprints as runV2M4Blueprints,
  runM5Validate as runV2M5Validate,
  runM6DeleteLesson as runV2M6DeleteLesson,
  runM6GenerateLesson as runV2M6GenerateLesson,
  seedLegacyChunksAsDefaultVersionIfNeeded as seedLegacyV2SyllabusChunksIfNeeded,
  createSyllabusIngestion as createV2SyllabusIngestion,
  updateSyllabusIngestion as updateV2SyllabusIngestion,
  deleteModuleRunsBySyllabusVersionIds as deleteV2ModuleRunsBySyllabusVersionIds,
  deleteSyllabusVersionsByIds as deleteV2SyllabusVersionsByIds,
};
