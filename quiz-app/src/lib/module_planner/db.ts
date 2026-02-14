import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ModuleRunArtifactRow,
  ModuleRunLessonRow,
  ModuleRunRow,
  ModuleRunSummary,
  ModuleStage,
} from './types';
import { MODULE_PLANNER_DB_FILE } from './constants';

interface ModulePlannerDatabase {
  module_runs: ModuleRunRow[];
  module_run_artifacts: ModuleRunArtifactRow[];
  module_run_lessons: ModuleRunLessonRow[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function resolveDbPath(): string {
  const override = process.env.MODULE_PLANNER_DB_PATH;
  if (override && override.trim().length > 0) {
    return path.isAbsolute(override) ? override : path.join(process.cwd(), override);
  }
  return path.join(process.cwd(), MODULE_PLANNER_DB_FILE);
}

function ensureDbFile(): string {
  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    const initial: ModulePlannerDatabase = {
      module_runs: [],
      module_run_artifacts: [],
      module_run_lessons: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
  }
  return dbPath;
}

function readDb(): ModulePlannerDatabase {
  const dbPath = ensureDbFile();
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<ModulePlannerDatabase>;
  return {
    module_runs: Array.isArray(parsed.module_runs) ? parsed.module_runs : [],
    module_run_artifacts: Array.isArray(parsed.module_run_artifacts) ? parsed.module_run_artifacts : [],
    module_run_lessons: Array.isArray(parsed.module_run_lessons) ? parsed.module_run_lessons : [],
  };
}

function writeDb(db: ModulePlannerDatabase): void {
  const dbPath = ensureDbFile();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

function createId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createModuleRun(input: {
  unit: string;
  chatTranscript: string;
}): ModuleRunRow {
  const db = readDb();
  const row: ModuleRunRow = {
    id: createId(),
    created_at: nowIso(),
    unit: input.unit,
    status: 'created',
    chat_transcript: input.chatTranscript,
    request_json: null,
    request_hash: null,
  };
  db.module_runs.push(row);
  writeDb(db);
  return row;
}

export function getModuleRunById(runId: string): ModuleRunRow | null {
  const db = readDb();
  return db.module_runs.find((row) => row.id === runId) ?? null;
}

export function updateModuleRun(
  runId: string,
  patch: Partial<Pick<ModuleRunRow, 'unit' | 'status' | 'chat_transcript' | 'request_json' | 'request_hash'>>
): ModuleRunRow {
  const db = readDb();
  const index = db.module_runs.findIndex((row) => row.id === runId);
  if (index < 0) {
    throw new Error(`Module run not found: ${runId}`);
  }
  const updated: ModuleRunRow = {
    ...db.module_runs[index],
    ...patch,
  };
  db.module_runs[index] = updated;
  writeDb(db);
  return updated;
}

export function saveStageArtifact(input: {
  moduleRunId: string;
  stage: ModuleStage;
  artifactJson: unknown;
  retrievedChunkIds?: string[];
  retrievedChunkText?: string;
}): ModuleRunArtifactRow {
  const db = readDb();
  const existingIndex = db.module_run_artifacts.findIndex(
    (row) => row.module_run_id === input.moduleRunId && row.stage === input.stage
  );
  const row: ModuleRunArtifactRow = {
    id: existingIndex >= 0 ? db.module_run_artifacts[existingIndex].id : createId(),
    module_run_id: input.moduleRunId,
    stage: input.stage,
    artifact_json: input.artifactJson,
    retrieved_chunk_ids: input.retrievedChunkIds ?? [],
    retrieved_chunk_text: input.retrievedChunkText ?? '',
    created_at: nowIso(),
  };
  if (existingIndex >= 0) {
    db.module_run_artifacts[existingIndex] = row;
  } else {
    db.module_run_artifacts.push(row);
  }
  writeDb(db);
  return row;
}

export function getStageArtifact(runId: string, stage: ModuleStage): ModuleRunArtifactRow | null {
  const db = readDb();
  const matches = db.module_run_artifacts.filter((row) => row.module_run_id === runId && row.stage === stage);
  if (matches.length === 0) return null;
  matches.sort((a, b) => a.created_at.localeCompare(b.created_at));
  return matches[matches.length - 1];
}

export function findArtifactByRequestHash(
  requestHash: string,
  stage: ModuleStage
): ModuleRunArtifactRow | null {
  const db = readDb();
  const runById = new Map<string, ModuleRunRow>(db.module_runs.map((run) => [run.id, run]));
  const matches = db.module_run_artifacts
    .filter((artifact) => artifact.stage === stage)
    .filter((artifact) => runById.get(artifact.module_run_id)?.request_hash === requestHash)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  if (matches.length === 0) return null;
  return matches[matches.length - 1];
}

export function listArtifactsForRun(runId: string): ModuleRunArtifactRow[] {
  const db = readDb();
  return db.module_run_artifacts
    .filter((row) => row.module_run_id === runId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function upsertRunLesson(input: {
  moduleRunId: string;
  blueprintId: string;
  lessonId: string;
  status: 'pending' | 'success' | 'failed';
  error?: string | null;
}): ModuleRunLessonRow {
  const db = readDb();
  const existingIndex = db.module_run_lessons.findIndex(
    (row) => row.module_run_id === input.moduleRunId && row.blueprint_id === input.blueprintId
  );
  const row: ModuleRunLessonRow = {
    id: existingIndex >= 0 ? db.module_run_lessons[existingIndex].id : createId(),
    module_run_id: input.moduleRunId,
    blueprint_id: input.blueprintId,
    lesson_id: input.lessonId,
    status: input.status,
    error: input.error ?? null,
  };
  if (existingIndex >= 0) {
    db.module_run_lessons[existingIndex] = row;
  } else {
    db.module_run_lessons.push(row);
  }
  writeDb(db);
  return row;
}

export function listRunLessons(runId: string): ModuleRunLessonRow[] {
  const db = readDb();
  return db.module_run_lessons.filter((row) => row.module_run_id === runId);
}

export function getRunSummary(runId: string): ModuleRunSummary | null {
  const run = getModuleRunById(runId);
  if (!run) return null;
  return {
    run,
    artifacts: listArtifactsForRun(runId),
    lessons: listRunLessons(runId),
  };
}

export function clearModulePlannerDbForTests(): void {
  if (process.env.NODE_ENV !== 'test') return;
  const dbPath = resolveDbPath();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
}

