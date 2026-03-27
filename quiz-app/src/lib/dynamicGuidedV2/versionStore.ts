import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';

export type DynamicLessonVersionStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';

export type DynamicLessonGenerationValidation = {
  passed: boolean;
  issues: string[];
};

export type DynamicLessonGenerationScore = {
  total: number;
  grade: 'ship' | 'strong' | 'usable' | 'rework';
  breakdown: {
    beginnerClarity: number;
    teachingBeforeTesting: number;
    markingRobustness: number;
    alignmentToLO: number;
    questionQuality: number;
  };
  issues: Array<{
    id?: string;
    category:
      | 'beginnerClarity'
      | 'teachingBeforeTesting'
      | 'markingRobustness'
      | 'alignmentToLO'
      | 'questionQuality';
    jsonPointers?: string[];
    excerpt?: string;
    problem: string;
    whyItMatters?: string;
    alignmentGap?: string;
    solution?: string;
    suggestion: string;
  }>;
  phaseFeedback: Array<{
    phaseKey: string;
    phaseTitle: string;
    stage: string;
    status: 'strong' | 'mixed' | 'weak';
    strengths: string[];
    issues: string[];
    suggestedFixes: string[];
  }>;
  summary: string;
};

export type DynamicDiagnosticScore = {
  total: number;
  grade: 'ship' | 'strong' | 'usable' | 'rework';
  breakdown: Record<string, number>;
  issues: Array<{
    category: string;
    problem: string;
    suggestion: string;
  }>;
  summary: string;
};

export type DynamicGenerationPhaseArtifact = {
  phase: string;
  status: 'completed' | 'failed';
  output: unknown;
  startedAt: string;
  finishedAt: string;
};

export type DynamicLessonVersionSummary = {
  id: string;
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  versionNo: number;
  status: DynamicLessonVersionStatus;
  source: 'human' | 'ai';
  qualityScore: number | null;
  validation: DynamicLessonGenerationValidation | null;
  report: DynamicLessonGenerationScore | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
  comparisonSource: DynamicGuidedV2Lesson['comparisonSource'];
  stepCount: number;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
  sourceContext?: string | null;
};

type LocalDynamicLessonVersion = {
  id: string;
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  versionNo: number;
  status: DynamicLessonVersionStatus;
  source: 'human' | 'ai';
  qualityScore: number | null;
  validation: DynamicLessonGenerationValidation | null;
  report: DynamicLessonGenerationScore | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
  lesson: DynamicGuidedV2Lesson;
  phaseArtifacts: DynamicGenerationPhaseArtifact[];
  sourceContext?: string | null;
  sourceRefs?: string[];
  createdBy?: string | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

type LocalStore = {
  versions: LocalDynamicLessonVersion[];
};

const STORE_DIR = path.join(process.cwd(), '.runtime');
const STORE_PATH = path.join(STORE_DIR, 'dynamic-guided-v2-version-store.json');

function ensureStoreDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, '');
}

function readStore(): LocalStore {
  try {
    if (!existsSync(STORE_PATH)) {
      return { versions: [] };
    }
    const raw = JSON.parse(stripBom(readFileSync(STORE_PATH, 'utf8'))) as Partial<LocalStore>;
    return {
      versions: Array.isArray(raw.versions) ? raw.versions : [],
    };
  } catch {
    return { versions: [] };
  }
}

function writeStore(store: LocalStore): void {
  ensureStoreDir();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function summarizeVersion(version: LocalDynamicLessonVersion): DynamicLessonVersionSummary {
  return {
    id: version.id,
    lessonCode: version.lessonCode,
    title: version.title,
    unit: version.unit,
    topic: version.topic,
    versionNo: version.versionNo,
    status: version.status,
    source: version.source,
    qualityScore: version.qualityScore,
    validation: version.validation,
    report: version.report,
    planScore: version.planScore ?? null,
    fidelityScore: version.fidelityScore ?? null,
    comparisonSource: version.lesson.comparisonSource,
    stepCount: version.lesson.steps.length,
    isCurrent: version.isCurrent,
    createdAt: version.createdAt,
    updatedAt: version.updatedAt,
    sourceContext: version.sourceContext ?? null,
  };
}

export async function createDynamicLessonDraftVersion(input: {
  lesson: DynamicGuidedV2Lesson;
  createdBy?: string | null;
  sourceContext?: string | null;
  sourceRefs?: string[];
  qualityScore?: number | null;
  validation?: DynamicLessonGenerationValidation | null;
  report?: DynamicLessonGenerationScore | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
  phaseArtifacts?: DynamicGenerationPhaseArtifact[];
  source?: 'human' | 'ai';
}): Promise<DynamicLessonVersionSummary> {
  const store = readStore();
  const matching = store.versions.filter((item) => item.lessonCode === input.lesson.lessonCode);
  const nextVersionNo =
    matching.length > 0 ? Math.max(...matching.map((item) => item.versionNo)) + 1 : 1;
  const timestamp = nowIso();

  for (const version of matching) {
    version.isCurrent = false;
    version.updatedAt = timestamp;
  }

  const version: LocalDynamicLessonVersion = {
    id: randomUUID(),
    lessonCode: input.lesson.lessonCode,
    title: input.lesson.title,
    unit: input.lesson.unit,
    topic: input.lesson.title.replace(/^\s*\d+(?:\.\d+)?[A-Z]?\s*-\s*/, '').trim() || input.lesson.title,
    versionNo: nextVersionNo,
    status: 'draft',
    source: input.source ?? 'ai',
    qualityScore: input.qualityScore ?? null,
    validation: input.validation ?? null,
    report: input.report ?? null,
    planScore: input.planScore ?? null,
    fidelityScore: input.fidelityScore ?? null,
    lesson: input.lesson,
    phaseArtifacts: input.phaseArtifacts ?? [],
    sourceContext: input.sourceContext ?? null,
    sourceRefs: input.sourceRefs ?? [],
    createdBy: input.createdBy ?? null,
    isCurrent: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.versions.push(version);
  writeStore(store);
  return summarizeVersion(version);
}

export async function listDynamicLessonVersions(lessonCode?: string): Promise<DynamicLessonVersionSummary[]> {
  const store = readStore();
  return store.versions
    .filter((item) => (lessonCode ? item.lessonCode === lessonCode : true))
    .sort((a, b) => {
      if (a.lessonCode !== b.lessonCode) return a.lessonCode.localeCompare(b.lessonCode);
      return b.versionNo - a.versionNo;
    })
    .map(summarizeVersion);
}

export async function getDynamicLessonVersion(versionId: string): Promise<{
  summary: DynamicLessonVersionSummary;
  lesson: DynamicGuidedV2Lesson;
  phaseArtifacts: DynamicGenerationPhaseArtifact[];
  sourceRefs: string[];
} | null> {
  const store = readStore();
  const version = store.versions.find((item) => item.id === versionId);
  if (!version) return null;
  return {
    summary: summarizeVersion(version),
    lesson: version.lesson,
    phaseArtifacts: version.phaseArtifacts,
    sourceRefs: version.sourceRefs ?? [],
  };
}

export async function getCurrentDynamicLessonVersionByCode(lessonCode: string): Promise<{
  summary: DynamicLessonVersionSummary;
  lesson: DynamicGuidedV2Lesson;
  phaseArtifacts: DynamicGenerationPhaseArtifact[];
  sourceRefs: string[];
} | null> {
  const store = readStore();
  const version = store.versions
    .filter((item) => item.lessonCode === lessonCode)
    .sort((a, b) => b.versionNo - a.versionNo)
    .find((item) => item.isCurrent);
  if (!version) return null;
  return {
    summary: summarizeVersion(version),
    lesson: version.lesson,
    phaseArtifacts: version.phaseArtifacts,
    sourceRefs: version.sourceRefs ?? [],
  };
}

export async function deleteDynamicLessonVersion(versionId: string): Promise<DynamicLessonVersionSummary | null> {
  const store = readStore();
  const index = store.versions.findIndex((item) => item.id === versionId);
  if (index < 0) return null;

  const [removed] = store.versions.splice(index, 1);
  const timestamp = nowIso();

  const remainingMatching = store.versions
    .filter((item) => item.lessonCode === removed.lessonCode)
    .sort((a, b) => b.versionNo - a.versionNo);

  if (removed.isCurrent && remainingMatching.length > 0) {
    remainingMatching.forEach((version, idx) => {
      version.isCurrent = idx === 0;
      version.updatedAt = timestamp;
    });
  }

  writeStore(store);
  return summarizeVersion(removed);
}
