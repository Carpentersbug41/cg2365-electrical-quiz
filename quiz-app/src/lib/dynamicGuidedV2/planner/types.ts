import type { DynamicLessonStageDescriptor } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGenerationPhaseArtifact } from '@/lib/dynamicGuidedV2/versionStore';

export type DynamicModulePlannerBlueprint = {
  id: string;
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  objectiveSummary: string;
  focusText: string;
  sourceRefs: string[];
  stagePlan: DynamicLessonStageDescriptor[];
};

export type DynamicModulePlannerRun = {
  id: string;
  moduleTitle: string;
  subject: string;
  audience: string;
  sourceName: string | null;
  sourceText: string;
  requestedLessonCount: number;
  blueprints: DynamicModulePlannerBlueprint[];
  phaseArtifacts: DynamicGenerationPhaseArtifact[];
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DynamicModulePlannerRunSummary = {
  id: string;
  moduleTitle: string;
  subject: string;
  audience: string;
  sourceName: string | null;
  requestedLessonCount: number;
  blueprintCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DynamicModulePlanRequest = {
  moduleTitle: string;
  subject?: string;
  audience?: string;
  sourceName?: string | null;
  sourceText: string;
  requestedLessonCount?: number;
};

export type DynamicModulePlannerDraft = {
  moduleTitle: string;
  blueprints: Array<{
    lessonCode: string;
    title: string;
    unit: string;
    topic: string;
    objectiveSummary: string;
    focusText: string;
    sourceRefs: string[];
    teachChecks: Array<{
      title: string;
      objective: string;
    }>;
    workedExampleObjective?: string;
    guidedPracticeObjective?: string;
    practiceObjective?: string;
    integrativeObjective?: string;
  }>;
};
