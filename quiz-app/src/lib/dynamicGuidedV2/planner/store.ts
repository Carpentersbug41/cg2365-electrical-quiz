import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { DynamicGenerationPhaseArtifact } from '@/lib/dynamicGuidedV2/versionStore';
import type {
  DynamicModulePlannerBlueprint,
  DynamicModulePlannerRun,
  DynamicModulePlannerRunSummary,
} from '@/lib/dynamicGuidedV2/planner/types';

type LocalDynamicModulePlannerStore = {
  runs: DynamicModulePlannerRun[];
};

const STORE_DIR = path.join(process.cwd(), '.runtime');
const STORE_PATH = path.join(STORE_DIR, 'dynamic-guided-v2-module-store.json');

function ensureStoreDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function readStore(): LocalDynamicModulePlannerStore {
  try {
    if (!existsSync(STORE_PATH)) {
      return { runs: [] };
    }
    const raw = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as Partial<LocalDynamicModulePlannerStore>;
    return {
      runs: Array.isArray(raw.runs) ? raw.runs : [],
    };
  } catch {
    return { runs: [] };
  }
}

function writeStore(store: LocalDynamicModulePlannerStore): void {
  ensureStoreDir();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function summarizeRun(run: DynamicModulePlannerRun): DynamicModulePlannerRunSummary {
  return {
    id: run.id,
    moduleTitle: run.moduleTitle,
    subject: run.subject,
    audience: run.audience,
    sourceName: run.sourceName ?? null,
    requestedLessonCount: run.requestedLessonCount,
    blueprintCount: run.blueprints.length,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
  };
}

export async function createDynamicModulePlannerRun(input: {
  moduleTitle: string;
  subject: string;
  audience: string;
  sourceName?: string | null;
  sourceText: string;
  requestedLessonCount: number;
  blueprints: DynamicModulePlannerBlueprint[];
  phaseArtifacts?: DynamicGenerationPhaseArtifact[];
  createdBy?: string | null;
}): Promise<{ summary: DynamicModulePlannerRunSummary; run: DynamicModulePlannerRun }> {
  const store = readStore();
  const timestamp = nowIso();
  const run: DynamicModulePlannerRun = {
    id: randomUUID(),
    moduleTitle: input.moduleTitle,
    subject: input.subject,
    audience: input.audience,
    sourceName: input.sourceName ?? null,
    sourceText: input.sourceText,
    requestedLessonCount: input.requestedLessonCount,
    blueprints: input.blueprints,
    phaseArtifacts: input.phaseArtifacts ?? [],
    createdBy: input.createdBy ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.runs.unshift(run);
  writeStore(store);
  return {
    summary: summarizeRun(run),
    run,
  };
}

export async function listDynamicModulePlannerRuns(): Promise<DynamicModulePlannerRunSummary[]> {
  return readStore().runs.map(summarizeRun);
}

export async function getDynamicModulePlannerRun(
  runId: string
): Promise<{ summary: DynamicModulePlannerRunSummary; run: DynamicModulePlannerRun } | null> {
  const run = readStore().runs.find((item) => item.id === runId);
  if (!run) return null;
  return {
    summary: summarizeRun(run),
    run,
  };
}

export async function getDynamicModulePlannerBlueprint(input: {
  runId: string;
  blueprintId: string;
}): Promise<{ run: DynamicModulePlannerRun; blueprint: DynamicModulePlannerBlueprint } | null> {
  const run = readStore().runs.find((item) => item.id === input.runId);
  if (!run) return null;
  const blueprint = run.blueprints.find((item) => item.id === input.blueprintId);
  if (!blueprint) return null;
  return { run, blueprint };
}
