import crypto from 'crypto';
import {
  CanonicalUnitStructure,
  ModuleConstraints,
  ModuleRunArtifactRow,
  ModuleRunLessonRow,
  ModuleRunRow,
  ModuleRunSummary,
  ModuleStage,
  OrderingPreference,
  SyllabusChunkAnchor,
  SyllabusChunkRow,
  SyllabusIngestionRow,
  SyllabusStructureRow,
  SyllabusVersionRow,
} from './types';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

interface MemoryDb {
  module_runs: ModuleRunRow[];
  module_run_artifacts: ModuleRunArtifactRow[];
  generated_lessons: ModuleRunLessonRow[];
  syllabus_versions: SyllabusVersionRow[];
  syllabus_ingestions: SyllabusIngestionRow[];
  syllabus_chunks: SyllabusChunkRow[];
  syllabus_structure: SyllabusStructureRow[];
}

const memoryDb: MemoryDb = {
  module_runs: [],
  module_run_artifacts: [],
  generated_lessons: [],
  syllabus_versions: [],
  syllabus_ingestions: [],
  syllabus_chunks: [],
  syllabus_structure: [],
};

function nowIso(): string {
  return new Date().toISOString();
}

function createId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function useMemoryDb(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.MODULE_PLANNER_DB_MODE === 'memory';
}

function requireSupabase() {
  const client = createSupabaseAdminClient();
  if (!client) {
    throw new Error('Supabase admin client is unavailable. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return client;
}

function normalizeRunRow(row: Record<string, unknown>): ModuleRunRow {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    syllabus_version_id: String(row.syllabus_version_id ?? ''),
    unit: String(row.unit),
    selected_los_json: Array.isArray(row.selected_los_json) ? row.selected_los_json.map((v) => String(v)) : [],
    constraints_json: (row.constraints_json as ModuleConstraints | null) ?? null,
    ordering_preference: (row.ordering_preference as OrderingPreference | null) ?? null,
    notes: row.notes == null ? null : String(row.notes),
    status: String(row.status),
    error_json: row.error_json ?? null,
    chat_transcript: String(row.chat_transcript ?? ''),
    request_json: (row.request_json as ModuleRunRow['request_json']) ?? null,
    request_hash: row.request_hash == null ? null : String(row.request_hash),
  };
}

function normalizeArtifactRow(row: Record<string, unknown>): ModuleRunArtifactRow {
  return {
    id: String(row.id),
    run_id: String(row.run_id),
    stage: String(row.stage) as ModuleStage,
    artifact_json: row.artifact_json,
    retrieved_chunk_ids: Array.isArray(row.retrieved_chunk_ids)
      ? row.retrieved_chunk_ids.map((v) => String(v))
      : [],
    retrieved_chunk_text: String(row.retrieved_chunk_text ?? ''),
    created_at: String(row.created_at),
  };
}

function normalizeLessonRow(row: Record<string, unknown>): ModuleRunLessonRow {
  return {
    id: String(row.id),
    run_id: String(row.run_id),
    blueprint_id: String(row.blueprint_id),
    lesson_id: String(row.lesson_id),
    status: String(row.status) as ModuleRunLessonRow['status'],
    error: row.error == null ? null : String(row.error),
    lesson_json: row.lesson_json ?? null,
    created_at: row.created_at == null ? undefined : String(row.created_at),
  };
}

function normalizeVersionRow(row: Record<string, unknown>): SyllabusVersionRow {
  return {
    id: String(row.id),
    filename: String(row.filename),
    content_hash: String(row.content_hash),
    created_at: String(row.created_at),
    meta_json: (row.meta_json as Record<string, unknown> | null) ?? null,
  };
}

function normalizeChunkAnchor(value: unknown): SyllabusChunkAnchor {
  const obj = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    pageStart: typeof obj.pageStart === 'number' ? obj.pageStart : null,
    pageEnd: typeof obj.pageEnd === 'number' ? obj.pageEnd : null,
    headingPath: Array.isArray(obj.headingPath) ? obj.headingPath.map((v) => String(v)) : [],
    unitGuess: obj.unitGuess == null ? null : String(obj.unitGuess),
    loGuess: obj.loGuess == null ? null : String(obj.loGuess),
  };
}

function normalizeIngestionRow(row: Record<string, unknown>): SyllabusIngestionRow {
  return {
    id: String(row.id),
    source: String(row.source ?? ''),
    state: String(row.state) as SyllabusIngestionRow['state'],
    syllabus_version_id: row.syllabus_version_id == null ? null : String(row.syllabus_version_id),
    error_message: row.error_message == null ? null : String(row.error_message),
    meta_json: (row.meta_json as Record<string, unknown> | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function normalizeChunkRow(row: Record<string, unknown>): SyllabusChunkRow {
  return {
    id: String(row.id),
    syllabus_version_id: String(row.syllabus_version_id),
    ordinal: Number(row.ordinal),
    text: String(row.text ?? ''),
    anchor_json: normalizeChunkAnchor(row.anchor_json),
  };
}

function normalizeStructureRow(row: Record<string, unknown>): SyllabusStructureRow {
  return {
    id: String(row.id),
    syllabus_version_id: String(row.syllabus_version_id),
    unit: String(row.unit),
    structure_json: row.structure_json as CanonicalUnitStructure,
    created_at: String(row.created_at),
  };
}

export async function createModuleRun(input: {
  syllabusVersionId: string;
  unit: string;
  selectedLos: string[];
  constraints: ModuleConstraints | null;
  orderingPreference: OrderingPreference | null;
  notes: string | null;
  chatTranscript: string;
}): Promise<ModuleRunRow> {
  const row: ModuleRunRow = {
    id: createId(),
    created_at: nowIso(),
    syllabus_version_id: input.syllabusVersionId,
    unit: input.unit,
    selected_los_json: input.selectedLos,
    constraints_json: input.constraints,
    ordering_preference: input.orderingPreference,
    notes: input.notes,
    status: 'created',
    error_json: null,
    chat_transcript: input.chatTranscript,
    request_json: null,
    request_hash: null,
  };

  if (useMemoryDb()) {
    memoryDb.module_runs.push(row);
    return row;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('module_runs').insert(row).select('*').single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create module run');
  return normalizeRunRow(data as Record<string, unknown>);
}

export async function getModuleRunById(runId: string): Promise<ModuleRunRow | null> {
  if (useMemoryDb()) {
    return memoryDb.module_runs.find((row) => row.id === runId) ?? null;
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('module_runs').select('*').eq('id', runId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeRunRow(data as Record<string, unknown>) : null;
}

export async function updateModuleRun(
  runId: string,
  patch: Partial<
    Pick<ModuleRunRow, 'unit' | 'status' | 'error_json' | 'chat_transcript' | 'request_json' | 'request_hash'> & {
      syllabus_version_id: string;
      selected_los_json: string[];
      constraints_json: ModuleConstraints;
      ordering_preference: OrderingPreference;
      notes: string;
    }
  >
): Promise<ModuleRunRow> {
  if (useMemoryDb()) {
    const idx = memoryDb.module_runs.findIndex((row) => row.id === runId);
    if (idx < 0) throw new Error(`Module run not found: ${runId}`);
    const updated = { ...memoryDb.module_runs[idx], ...patch };
    memoryDb.module_runs[idx] = updated;
    return updated;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('module_runs').update(patch).eq('id', runId).select('*').single();
  if (error || !data) throw new Error(error?.message ?? `Module run not found: ${runId}`);
  return normalizeRunRow(data as Record<string, unknown>);
}

export async function saveStageArtifact(input: {
  runId: string;
  stage: ModuleStage;
  artifactJson: unknown;
  retrievedChunkIds?: string[];
  retrievedChunkText?: string;
}): Promise<ModuleRunArtifactRow> {
  if (useMemoryDb()) {
    const idx = memoryDb.module_run_artifacts.findIndex((row) => row.run_id === input.runId && row.stage === input.stage);
    const row: ModuleRunArtifactRow = {
      id: idx >= 0 ? memoryDb.module_run_artifacts[idx].id : createId(),
      run_id: input.runId,
      stage: input.stage,
      artifact_json: input.artifactJson,
      retrieved_chunk_ids: input.retrievedChunkIds ?? [],
      retrieved_chunk_text: input.retrievedChunkText ?? '',
      created_at: nowIso(),
    };
    if (idx >= 0) {
      memoryDb.module_run_artifacts[idx] = row;
    } else {
      memoryDb.module_run_artifacts.push(row);
    }
    return row;
  }

  const supabase = requireSupabase();
  const row = {
    run_id: input.runId,
    stage: input.stage,
    artifact_json: input.artifactJson,
    retrieved_chunk_ids: input.retrievedChunkIds ?? [],
    retrieved_chunk_text: input.retrievedChunkText ?? '',
  };
  const { data, error } = await supabase
    .from('module_run_artifacts')
    .upsert(row, { onConflict: 'run_id,stage' })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to save stage artifact');
  return normalizeArtifactRow(data as Record<string, unknown>);
}

export async function getStageArtifact(runId: string, stage: ModuleStage): Promise<ModuleRunArtifactRow | null> {
  if (useMemoryDb()) {
    const matches = memoryDb.module_run_artifacts
      .filter((row) => row.run_id === runId && row.stage === stage)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return matches[matches.length - 1] ?? null;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('module_run_artifacts')
    .select('*')
    .eq('run_id', runId)
    .eq('stage', stage)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeArtifactRow(data as Record<string, unknown>) : null;
}

export async function findArtifactByRequestHash(
  requestHash: string,
  stage: ModuleStage
): Promise<ModuleRunArtifactRow | null> {
  if (useMemoryDb()) {
    const runById = new Map(memoryDb.module_runs.map((run) => [run.id, run]));
    const matches = memoryDb.module_run_artifacts
      .filter((artifact) => artifact.stage === stage)
      .filter((artifact) => runById.get(artifact.run_id)?.request_hash === requestHash)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return matches[matches.length - 1] ?? null;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('module_run_artifacts')
    .select('*,module_runs!inner(request_hash)')
    .eq('stage', stage)
    .eq('module_runs.request_hash', requestHash)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeArtifactRow(data as Record<string, unknown>) : null;
}

export async function listArtifactsForRun(runId: string): Promise<ModuleRunArtifactRow[]> {
  if (useMemoryDb()) {
    return memoryDb.module_run_artifacts
      .filter((row) => row.run_id === runId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('module_run_artifacts')
    .select('*')
    .eq('run_id', runId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeArtifactRow(row as Record<string, unknown>));
}

export async function upsertRunLesson(input: {
  runId: string;
  blueprintId: string;
  lessonId: string;
  status: 'planned' | 'pending' | 'success' | 'failed';
  error?: string | null;
  lessonJson?: unknown | null;
}): Promise<ModuleRunLessonRow> {
  if (useMemoryDb()) {
    const idx = memoryDb.generated_lessons.findIndex(
      (row) => row.run_id === input.runId && row.blueprint_id === input.blueprintId
    );
    const row: ModuleRunLessonRow = {
      id: idx >= 0 ? memoryDb.generated_lessons[idx].id : createId(),
      run_id: input.runId,
      blueprint_id: input.blueprintId,
      lesson_id: input.lessonId,
      status: input.status,
      error: input.error ?? null,
      lesson_json: input.lessonJson ?? null,
      created_at: nowIso(),
    };
    if (idx >= 0) {
      memoryDb.generated_lessons[idx] = row;
    } else {
      memoryDb.generated_lessons.push(row);
    }
    return row;
  }

  const supabase = requireSupabase();
  const row = {
    run_id: input.runId,
    blueprint_id: input.blueprintId,
    lesson_id: input.lessonId,
    status: input.status,
    error: input.error ?? null,
    lesson_json: input.lessonJson ?? null,
  };
  const { data, error } = await supabase
    .from('generated_lessons')
    .upsert(row, { onConflict: 'run_id,blueprint_id' })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to upsert generated lesson');
  return normalizeLessonRow(data as Record<string, unknown>);
}

export async function listRunLessons(runId: string): Promise<ModuleRunLessonRow[]> {
  if (useMemoryDb()) {
    return memoryDb.generated_lessons.filter((row) => row.run_id === runId);
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('generated_lessons').select('*').eq('run_id', runId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeLessonRow(row as Record<string, unknown>));
}

export async function getRunSummary(runId: string): Promise<ModuleRunSummary | null> {
  const run = await getModuleRunById(runId);
  if (!run) return null;
  return {
    run,
    artifacts: await listArtifactsForRun(runId),
    lessons: await listRunLessons(runId),
  };
}

export async function createSyllabusVersion(input: {
  filename: string;
  contentHash: string;
  metaJson?: Record<string, unknown>;
}): Promise<SyllabusVersionRow> {
  const row: SyllabusVersionRow = {
    id: createId(),
    filename: input.filename,
    content_hash: input.contentHash,
    created_at: nowIso(),
    meta_json: input.metaJson ?? null,
  };

  if (useMemoryDb()) {
    memoryDb.syllabus_versions.push(row);
    return row;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('syllabus_versions').insert(row).select('*').single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create syllabus version');
  return normalizeVersionRow(data as Record<string, unknown>);
}

export async function updateSyllabusVersionMeta(id: string, metaJson: Record<string, unknown>): Promise<void> {
  if (useMemoryDb()) {
    const idx = memoryDb.syllabus_versions.findIndex((row) => row.id === id);
    if (idx >= 0) {
      memoryDb.syllabus_versions[idx] = { ...memoryDb.syllabus_versions[idx], meta_json: metaJson };
    }
    return;
  }
  const supabase = requireSupabase();
  const { error } = await supabase.from('syllabus_versions').update({ meta_json: metaJson }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listSyllabusVersions(): Promise<SyllabusVersionRow[]> {
  if (useMemoryDb()) {
    return [...memoryDb.syllabus_versions].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('syllabus_versions').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeVersionRow(row as Record<string, unknown>));
}

export async function getSyllabusVersionById(id: string): Promise<SyllabusVersionRow | null> {
  if (useMemoryDb()) {
    return memoryDb.syllabus_versions.find((row) => row.id === id) ?? null;
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('syllabus_versions').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeVersionRow(data as Record<string, unknown>) : null;
}

export async function createSyllabusIngestion(input: {
  source: string;
  state?: SyllabusIngestionRow['state'];
  syllabusVersionId?: string | null;
  errorMessage?: string | null;
  metaJson?: Record<string, unknown> | null;
}): Promise<SyllabusIngestionRow> {
  const row: SyllabusIngestionRow = {
    id: createId(),
    source: input.source,
    state: input.state ?? 'RUNNING',
    syllabus_version_id: input.syllabusVersionId ?? null,
    error_message: input.errorMessage ?? null,
    meta_json: input.metaJson ?? null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  if (useMemoryDb()) {
    memoryDb.syllabus_ingestions.push(row);
    return row;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('syllabus_ingestions').insert({
    source: row.source,
    state: row.state,
    syllabus_version_id: row.syllabus_version_id,
    error_message: row.error_message,
    meta_json: row.meta_json,
  }).select('*').single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create syllabus ingestion');
  return normalizeIngestionRow(data as Record<string, unknown>);
}

export async function updateSyllabusIngestion(
  id: string,
  patch: Partial<Pick<SyllabusIngestionRow, 'state' | 'syllabus_version_id' | 'error_message' | 'meta_json'>>
): Promise<SyllabusIngestionRow> {
  if (useMemoryDb()) {
    const idx = memoryDb.syllabus_ingestions.findIndex((row) => row.id === id);
    if (idx < 0) throw new Error(`Syllabus ingestion not found: ${id}`);
    const updated: SyllabusIngestionRow = {
      ...memoryDb.syllabus_ingestions[idx],
      ...patch,
      updated_at: nowIso(),
    };
    memoryDb.syllabus_ingestions[idx] = updated;
    return updated;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_ingestions')
    .update({
      ...patch,
      updated_at: nowIso(),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? `Syllabus ingestion not found: ${id}`);
  return normalizeIngestionRow(data as Record<string, unknown>);
}

export async function getLatestSyllabusIngestion(): Promise<SyllabusIngestionRow | null> {
  if (useMemoryDb()) {
    const sorted = [...memoryDb.syllabus_ingestions].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return sorted[0] ?? null;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_ingestions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeIngestionRow(data as Record<string, unknown>) : null;
}

export async function insertSyllabusChunks(
  syllabusVersionId: string,
  chunks: Array<{ ordinal: number; text: string; anchorJson: SyllabusChunkAnchor }>
): Promise<SyllabusChunkRow[]> {
  const rows: SyllabusChunkRow[] = chunks.map((chunk) => ({
    id: createId(),
    syllabus_version_id: syllabusVersionId,
    ordinal: chunk.ordinal,
    text: chunk.text,
    anchor_json: chunk.anchorJson,
  }));

  if (useMemoryDb()) {
    memoryDb.syllabus_chunks.push(...rows);
    return rows;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from('syllabus_chunks').insert(rows).select('*');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeChunkRow(row as Record<string, unknown>));
}

export async function listSyllabusChunksByVersion(versionId: string): Promise<SyllabusChunkRow[]> {
  if (useMemoryDb()) {
    return memoryDb.syllabus_chunks
      .filter((row) => row.syllabus_version_id === versionId)
      .sort((a, b) => a.ordinal - b.ordinal);
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_chunks')
    .select('*')
    .eq('syllabus_version_id', versionId)
    .order('ordinal', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeChunkRow(row as Record<string, unknown>));
}

export async function upsertSyllabusStructure(input: {
  syllabusVersionId: string;
  unit: string;
  structureJson: CanonicalUnitStructure;
}): Promise<SyllabusStructureRow> {
  const row: SyllabusStructureRow = {
    id: createId(),
    syllabus_version_id: input.syllabusVersionId,
    unit: input.unit,
    structure_json: input.structureJson,
    created_at: nowIso(),
  };

  if (useMemoryDb()) {
    const idx = memoryDb.syllabus_structure.findIndex(
      (entry) => entry.syllabus_version_id === input.syllabusVersionId && entry.unit === input.unit
    );
    if (idx >= 0) {
      row.id = memoryDb.syllabus_structure[idx].id;
      memoryDb.syllabus_structure[idx] = row;
    } else {
      memoryDb.syllabus_structure.push(row);
    }
    return row;
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_structure')
    .upsert(
      {
        syllabus_version_id: input.syllabusVersionId,
        unit: input.unit,
        structure_json: input.structureJson,
      },
      { onConflict: 'syllabus_version_id,unit' }
    )
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to upsert syllabus structure');
  return normalizeStructureRow(data as Record<string, unknown>);
}

export async function listSyllabusStructuresByVersion(versionId: string): Promise<SyllabusStructureRow[]> {
  if (useMemoryDb()) {
    return memoryDb.syllabus_structure.filter((row) => row.syllabus_version_id === versionId);
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_structure')
    .select('*')
    .eq('syllabus_version_id', versionId)
    .order('unit', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeStructureRow(row as Record<string, unknown>));
}

export async function getSyllabusStructureByVersionAndUnit(
  versionId: string,
  unit: string
): Promise<SyllabusStructureRow | null> {
  if (useMemoryDb()) {
    return memoryDb.syllabus_structure.find((row) => row.syllabus_version_id === versionId && row.unit === unit) ?? null;
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('syllabus_structure')
    .select('*')
    .eq('syllabus_version_id', versionId)
    .eq('unit', unit)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeStructureRow(data as Record<string, unknown>) : null;
}

export async function clearModulePlannerDbForTests(): Promise<void> {
  if (!useMemoryDb()) return;
  memoryDb.module_runs = [];
  memoryDb.module_run_artifacts = [];
  memoryDb.generated_lessons = [];
  memoryDb.syllabus_versions = [];
  memoryDb.syllabus_ingestions = [];
  memoryDb.syllabus_chunks = [];
  memoryDb.syllabus_structure = [];
}
