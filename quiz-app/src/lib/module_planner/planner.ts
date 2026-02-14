import {
  DEFAULT_AUDIENCE,
  DEFAULT_LEVEL,
  DEFAULT_MAX_LESSONS_PER_LO,
  DEFAULT_MINIMISE_LESSONS,
  DEFAULT_ORDERING_PREFERENCE,
  MAX_ACS_PER_LESSON,
  getModulePlannerConcurrency,
} from './constants';
import {
  createModuleRun,
  findArtifactByRequestHash,
  getModuleRunById,
  getRunSummary,
  getStageArtifact,
  getSyllabusStructureByVersionAndUnit,
  getSyllabusVersionById,
  listRunLessons,
  saveStageArtifact,
  updateModuleRun,
  upsertRunLesson,
} from './db';
import { ModulePlannerError } from './errors';
import {
  compareLoTag,
  deserializeRetrievedChunkRecords,
  getAllUnits,
  getChunkById,
  getChunksForUnitLO,
  getLoNumber,
  getUnitLos,
  normalizeLo,
  parseRangeFromContent,
  serializeRetrievedChunkRecords,
  toRetrievedChunkRecords,
} from './syllabus';
import { buildMasterLessonBlueprint, validateMasterLessonBlueprintContract } from './masterLessonBlueprint';
import {
  validateCoverageTargets,
  validateLessonBlueprints,
  validateMinimalLessonPlan,
  validateModulePlanRequest,
  validateUnitStructure,
  validateValidationResult,
} from './schemas';
import { stableHash } from './stableHash';
import {
  CoverageTarget,
  CoverageTargets,
  DistillInput,
  GenerateSummary,
  LessonBlueprint,
  MinimalLessonPlan,
  ModuleConstraints,
  ModulePlanRequest,
  ModuleRunArtifactRow,
  ModuleRunRow,
  ModuleRunSummary,
  ModuleStage,
  OrderingPreference,
  StageExecutionResult,
  StageReplayOptions,
  UnitStructure,
  ValidationIssue,
  ValidationResult,
} from './types';
import { generateLessonFromBlueprint } from './adapter';
import { createLLMClient } from '@/lib/llm/client';
import { getGeminiApiKey, getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { cleanCodeBlocks, preprocessToValidJson, safeJsonParse } from '@/lib/generation/utils';

type ValidationFn<T> = (value: unknown) => value is T;

const STAGE_STATUS: Record<ModuleStage, string> = {
  M0: 'm0-complete',
  M1: 'm1-complete',
  M2: 'm2-complete',
  M3: 'm3-complete',
  M4: 'm4-complete',
  M5: 'm5-complete',
  M6: 'm6-complete',
};

function normalizeTranscript(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

function parseTypedArtifact<T>(
  row: ModuleRunArtifactRow | null,
  stage: ModuleStage,
  validator: ValidationFn<T>
): T {
  if (!row) {
    throw new ModulePlannerError(stage, 'JSON_SCHEMA_FAIL', `${stage} artifact is missing.`, 400);
  }
  if (!validator(row.artifact_json)) {
    throw new ModulePlannerError(stage, 'JSON_SCHEMA_FAIL', `${stage} artifact does not match schema.`, 400);
  }
  return row.artifact_json;
}

async function getTypedStageArtifact<T>(runId: string, stage: ModuleStage, validator: ValidationFn<T>): Promise<T> {
  const artifact = await getStageArtifact(runId, stage);
  return parseTypedArtifact(artifact, stage, validator);
}

async function requireRun(runId: string): Promise<ModuleRunRow> {
  const run = await getModuleRunById(runId);
  if (!run) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', `Run not found: ${runId}`, 404);
  }
  return run;
}

function requireRequest(run: ModuleRunRow): ModulePlanRequest {
  if (!run.request_json) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'M0 Distill has not been completed.', 400);
  }
  return run.request_json;
}

async function updateStageStatus(runId: string, stage: ModuleStage): Promise<void> {
  await updateModuleRun(runId, { status: STAGE_STATUS[stage] });
}

function sanitizeConstraints(input?: Partial<ModuleConstraints>): ModuleConstraints {
  const rawOverrides = input?.maxLessonsOverrides ?? {};
  const overrides: Record<string, number> = {};
  for (const [rawLo, rawCap] of Object.entries(rawOverrides)) {
    const lo = normalizeLo(rawLo);
    const cap = Number.parseInt(String(rawCap), 10);
    if (!Number.isNaN(cap) && cap > 0) {
      overrides[lo] = cap;
    }
  }
  const defaultMax = Number.parseInt(String(input?.defaultMaxLessonsPerLO ?? DEFAULT_MAX_LESSONS_PER_LO), 10);
  return {
    minimiseLessons: input?.minimiseLessons ?? DEFAULT_MINIMISE_LESSONS,
    defaultMaxLessonsPerLO: Number.isNaN(defaultMax) || defaultMax <= 0 ? DEFAULT_MAX_LESSONS_PER_LO : defaultMax,
    maxLessonsOverrides: overrides,
    level: typeof input?.level === 'string' && input.level.trim().length > 0 ? input.level.trim() : DEFAULT_LEVEL,
    audience:
      typeof input?.audience === 'string' && input.audience.trim().length > 0
        ? input.audience.trim()
        : DEFAULT_AUDIENCE,
  };
}

async function resolveSelectedLos(versionId: string, unit: string, selectedLos?: string[]): Promise<string[]> {
  const available = (await getUnitLos(versionId, unit)).map((lo) => normalizeLo(lo));
  if (available.length === 0) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `No syllabus structure found for unit ${unit}.`, 400, { unit });
  }
  const normalized = (selectedLos ?? []).map((lo) => normalizeLo(lo)).filter((lo) => lo.length > 0);
  if (normalized.length === 0) return [...available];
  const missing = normalized.filter((lo) => !available.includes(lo));
  if (missing.length > 0) {
    throw new ModulePlannerError('M1', 'RAG_GROUNDEDNESS_FAIL', 'Selected LO is not present in unit structure.', 400, {
      missingLos: missing.join(', '),
    });
  }
  return Array.from(new Set(normalized)).sort(compareLoTag);
}

function inferSelectedLosFromChat(chatTranscript: string): string[] {
  const matches = [...chatTranscript.matchAll(/\bLO\s*([0-9]+)\b/gi)];
  if (matches.length === 0) return [];
  return Array.from(new Set(matches.map((m) => `LO${m[1]}`))).sort(compareLoTag);
}

function buildRequestHash(chatTranscript: string, request: ModulePlanRequest, contentHash: string | null): string {
  return stableHash({
    chatTranscript: normalizeTranscript(chatTranscript),
    request,
    syllabus: {
      syllabusVersionId: request.syllabusVersionId,
      contentHash,
    },
    config: {
      maxAcsPerLesson: MAX_ACS_PER_LESSON,
      ordering: request.orderingPreference,
      defaultMaxLessonsPerLO: request.constraints.defaultMaxLessonsPerLO,
      maxLessonsOverrides: request.constraints.maxLessonsOverrides,
    },
  });
}

async function stageReplay<T>(
  run: ModuleRunRow,
  stage: ModuleStage,
  options: StageReplayOptions,
  validator: ValidationFn<T>
): Promise<T | null> {
  if (!options.replayFromArtifacts || !run.request_hash) return null;
  const replayArtifact = await findArtifactByRequestHash(run.request_hash, stage);
  if (!replayArtifact) return null;
  let parsed: T;
  try {
    parsed = parseTypedArtifact(replayArtifact, stage, validator);
  } catch {
    return null;
  }
  if (replayArtifact.run_id !== run.id) {
    await saveStageArtifact({
      runId: run.id,
      stage,
      artifactJson: parsed,
      retrievedChunkIds: replayArtifact.retrieved_chunk_ids,
      retrievedChunkText: replayArtifact.retrieved_chunk_text,
    });
  }
  await updateStageStatus(run.id, stage);
  return parsed;
}

function alphaIndex(index: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < alphabet.length) return alphabet[index];
  const first = Math.floor(index / alphabet.length) - 1;
  const second = index % alphabet.length;
  return `${alphabet[first]}${alphabet[second]}`;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function deriveMustHaveTopics(acTexts: string[]): string[] {
  const topics: string[] = [];
  for (const text of acTexts) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) continue;
    const splitByColon = normalized.split(':').map((part) => part.trim()).filter(Boolean);
    if (splitByColon.length > 1) {
      topics.push(splitByColon[0]);
      topics.push(splitByColon[1]);
    } else {
      topics.push(normalized);
    }
  }
  return unique(
    topics
      .map((topic) => topic.replace(/^[A-Za-z]+\s+/u, '').trim())
      .map((topic) => (topic.length > 90 ? `${topic.slice(0, 87).trim()}...` : topic))
      .filter((topic) => topic.length > 0)
  ).slice(0, 6);
}

function chooseLayout(topic: string, acTexts: string[]): 'split-vis' | 'linear-flow' {
  const corpus = `${topic} ${acTexts.join(' ')}`.toLowerCase();
  const splitVisHints = ['diagram', 'circuit', 'wave', 'waveform', 'magnet', 'generator', 'field', 'flux'];
  const shouldSplit = splitVisHints.some((hint) => corpus.includes(hint));
  return shouldSplit ? 'split-vis' : 'linear-flow';
}

function getMaxLessonsForLo(constraints: ModuleConstraints, lo: string): number {
  if (constraints.maxLessonsOverrides[lo] && constraints.maxLessonsOverrides[lo] > 0) {
    return constraints.maxLessonsOverrides[lo];
  }
  return constraints.defaultMaxLessonsPerLO;
}

async function upsertArtifactAndStatus(
  runId: string,
  stage: ModuleStage,
  artifact: unknown,
  options?: { retrievedChunkIds?: string[]; retrievedChunkText?: string }
): Promise<void> {
  await saveStageArtifact({
    runId,
    stage,
    artifactJson: artifact,
    retrievedChunkIds: options?.retrievedChunkIds ?? [],
    retrievedChunkText: options?.retrievedChunkText ?? '',
  });
  await updateStageStatus(runId, stage);
}

function toUnitStructureValidator(value: unknown): value is UnitStructure {
  return validateUnitStructure(value);
}

function toCoverageTargetsValidator(value: unknown): value is CoverageTargets {
  return validateCoverageTargets(value);
}

function toMinimalLessonPlanValidator(value: unknown): value is MinimalLessonPlan {
  return validateMinimalLessonPlan(value);
}

function toBlueprintsValidator(value: unknown): value is LessonBlueprint[] {
  return validateLessonBlueprints(value);
}

function toValidationResultValidator(value: unknown): value is ValidationResult {
  return validateValidationResult(value);
}
function getPlanValidationIssues(m2: CoverageTargets, m3: MinimalLessonPlan, constraints: ModuleConstraints): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const expectedByLo = new Map<string, string[]>();
  m2.los.forEach((lo) => expectedByLo.set(normalizeLo(lo.lo), lo.coverageTargets.map((target) => target.acKey)));

  for (const loPlan of m3.los) {
    const lo = normalizeLo(loPlan.lo);
    const expected = new Set(expectedByLo.get(lo) ?? []);
    const assigned = loPlan.lessons.flatMap((lesson) => lesson.coversAcKeys);
    const counts = new Map<string, number>();
    assigned.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));

    for (const key of assigned) {
      if (!expected.has(key)) {
        issues.push({
          stage: 'M3',
          severity: 'error',
          code: 'UNKNOWN_AC_KEY',
          message: 'Lesson references AC key outside canonical truth layer.',
          meta: { lo, acKey: key },
        });
      }
    }

    for (const key of expected) {
      if (!counts.has(key)) {
        issues.push({
          stage: 'M3',
          severity: 'error',
          code: 'MISSING_AC',
          message: 'Canonical AC key is missing from lesson plan.',
          meta: { lo, acKey: key },
        });
      }
    }

    for (const [acKey, count] of counts.entries()) {
      if (count > 1) {
        issues.push({
          stage: 'M3',
          severity: 'error',
          code: 'DUPLICATE_AC_ASSIGNMENT',
          message: 'AC key appears in more than one lesson.',
          meta: { lo, acKey, count },
        });
      }
    }

    const cap = getMaxLessonsForLo(constraints, lo);
    if (loPlan.lessonCount > cap) {
      issues.push({
        stage: 'M3',
        severity: 'error',
        code: 'EXCEEDS_MAX_LESSONS',
        message: 'LO lesson count exceeds configured ceiling.',
        meta: { lo, lessonCount: loPlan.lessonCount, cap },
      });
    }
  }

  return issues;
}

function buildDeterministicFallbackPlan(m2: CoverageTargets, request: ModulePlanRequest): MinimalLessonPlan {
  return {
    unit: m2.unit,
    los: m2.los.map((loGroup) => {
      const loTag = normalizeLo(loGroup.lo);
      const loNumber = getLoNumber(loTag);
      const grouped = chunkArray(loGroup.coverageTargets.map((t) => t.acKey), MAX_ACS_PER_LESSON);
      const cap = getMaxLessonsForLo(request.constraints, loTag);
      if (grouped.length > cap) {
        throw new ModulePlannerError('M3', 'EXCEEDS_MAX_LESSONS', 'Fallback plan exceeds lesson cap.', 400, {
          lo: loTag,
          required: grouped.length,
          cap,
        });
      }

      return {
        lo: loTag,
        lessonCount: grouped.length,
        lessons: grouped.map((keys, i) => ({
          topicCode: `${request.unit}-${loNumber}${alphaIndex(i)}`,
          title: loGroup.coverageTargets[Math.min(i, loGroup.coverageTargets.length - 1)]?.acText ?? `${loTag} Lesson ${i + 1}`,
          coversAcKeys: keys,
          whySplit: grouped.length > 1 ? 'Split to keep lesson scope manageable and deterministic.' : null,
        })),
      };
    }),
  };
}

async function callM3PlannerLLM(params: {
  request: ModulePlanRequest;
  coverage: CoverageTargets;
  evidenceByLo: Record<string, string[]>;
  repairErrors?: ValidationIssue[];
  previousPlan?: MinimalLessonPlan;
}): Promise<MinimalLessonPlan | null> {
  if (!getGeminiApiKey()) return null;

  let modelName: string;
  try {
    modelName = getGeminiModelWithDefault();
  } catch {
    return null;
  }

  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json',
    },
    systemInstruction:
      'You are Module Planner M3. You may only group and title lessons from canonical acKeys. Never invent or rename curriculum keys.',
  });

  const prompt = {
    mode: params.repairErrors ? 'repair' : 'plan',
    syllabusVersionId: params.request.syllabusVersionId,
    unit: params.request.unit,
    selectedLos: params.request.selectedLos,
    constraints: params.request.constraints,
    canonicalCoverage: params.coverage,
    evidenceByLo: params.evidenceByLo,
    previousPlan: params.previousPlan ?? null,
    repairErrors: params.repairErrors ?? [],
    hardRules: [
      'Use only canonical acKeys in coversAcKeys.',
      'Each canonical AC key must appear exactly once for each LO.',
      'lessonCount must equal lessons.length for each LO.',
      'Output strict JSON only.',
    ],
  };

  const response = await model.generateContent(JSON.stringify(prompt));
  const raw = cleanCodeBlocks(response.response.text());
  const parsed = safeJsonParse<MinimalLessonPlan>(preprocessToValidJson(raw));
  if (!parsed.success || !parsed.data) return null;
  if (!validateMinimalLessonPlan(parsed.data)) return null;
  return parsed.data;
}

async function runM3WithRepair(request: ModulePlanRequest, m2: CoverageTargets): Promise<MinimalLessonPlan> {
  const evidenceByLo: Record<string, string[]> = {};
  for (const lo of request.selectedLos) {
    const loChunks = await getChunksForUnitLO(request.syllabusVersionId, request.unit, lo, 3);
    evidenceByLo[normalizeLo(lo)] = loChunks.map((chunk) => chunk.text.slice(0, 1200));
  }

  const initialPlan =
    (await callM3PlannerLLM({
      request,
      coverage: m2,
      evidenceByLo,
    })) ?? buildDeterministicFallbackPlan(m2, request);

  const initialIssues = getPlanValidationIssues(m2, initialPlan, request.constraints);
  if (initialIssues.length === 0) return initialPlan;

  const repairedPlan = await callM3PlannerLLM({
    request,
    coverage: m2,
    evidenceByLo,
    repairErrors: initialIssues,
    previousPlan: initialPlan,
  });
  if (!repairedPlan) {
    throw new ModulePlannerError('M3', 'JSON_SCHEMA_FAIL', 'M3 plan invalid and repair failed to return valid JSON.', 400);
  }

  const repairedIssues = getPlanValidationIssues(m2, repairedPlan, request.constraints);
  if (repairedIssues.length > 0) {
    throw new ModulePlannerError('M3', 'JSON_SCHEMA_FAIL', 'M3 plan remained invalid after one repair attempt.', 400, {
      errors: repairedIssues.map((issue) => issue.message).join(' | '),
    });
  }

  return repairedPlan;
}

function pushIssue(issues: ValidationIssue[], issue: ValidationIssue): void {
  issues.push(issue);
}

function validateM4AgainstM3AndM2(
  issues: ValidationIssue[],
  m2: CoverageTargets,
  m3: MinimalLessonPlan,
  m4: LessonBlueprint[]
): void {
  const m3AnchorSets = m3.los.flatMap((lo) =>
    lo.lessons.map((lesson) => `${normalizeLo(lo.lo)}:${lesson.coversAcKeys.slice().sort().join('|')}`)
  );
  const m4AnchorSets = m4.map((blueprint) => `${normalizeLo(blueprint.lo)}:${blueprint.acAnchors.slice().sort().join('|')}`);
  const m4AnchorSetValues = new Set(m4AnchorSets);
  for (const set of m3AnchorSets) {
    if (!m4AnchorSetValues.has(set)) {
      pushIssue(issues, {
        stage: 'M4',
        severity: 'error',
        code: 'DUPLICATE_LESSON',
        message: 'Planned lesson does not map to a blueprint',
        meta: { anchorSet: set },
      });
    }
  }

  const allExpectedAcs = new Set(m2.los.flatMap((lo) => lo.coverageTargets.map((target) => target.acKey)));
  const counter = new Map<string, number>();
  m4.forEach((blueprint) => {
    blueprint.acAnchors.forEach((acKey) => {
      counter.set(acKey, (counter.get(acKey) ?? 0) + 1);
      if (!allExpectedAcs.has(acKey)) {
        pushIssue(issues, {
          stage: 'M4',
          severity: 'error',
          code: 'TOO_BROAD_SCOPE',
          message: 'Blueprint includes AC outside coverage targets',
          meta: { blueprintId: blueprint.id, acKey },
        });
      }
    });
  });
  for (const [acKey, count] of counter.entries()) {
    if (count > 1) {
      pushIssue(issues, {
        stage: 'M4',
        severity: 'error',
        code: 'OVERLAP_HIGH',
        message: 'AC appears in multiple blueprints',
        meta: { acKey, count },
      });
    }
  }
}
export async function createPlannerRun(input: {
  syllabusVersionId: string;
  unit: string;
  chatTranscript: string;
}): Promise<ModuleRunRow> {
  const normalizedUnit = String(input.unit).trim();
  const syllabusVersionId = String(input.syllabusVersionId ?? '').trim();
  if (!normalizedUnit) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'unit is required.', 400);
  }
  if (!syllabusVersionId) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'syllabusVersionId is required.', 400);
  }
  if (!(await getSyllabusVersionById(syllabusVersionId))) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', `Unknown syllabusVersionId ${syllabusVersionId}`, 400);
  }
  if ((await getUnitLos(syllabusVersionId, normalizedUnit)).length === 0) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `Unknown unit ${normalizedUnit} for syllabus version ${syllabusVersionId}`, 400);
  }
  return createModuleRun({
    syllabusVersionId,
    unit: normalizedUnit,
    selectedLos: [],
    constraints: null,
    orderingPreference: null,
    notes: null,
    chatTranscript: normalizeTranscript(input.chatTranscript ?? ''),
  });
}

export async function getPlannerRunSummary(runId: string): Promise<ModuleRunSummary> {
  const summary = await getRunSummary(runId);
  if (!summary) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', `Run not found: ${runId}`, 404);
  }
  return summary;
}

export async function runM0Distill(
  runId: string,
  input: DistillInput,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<ModulePlanRequest>> {
  const run = await requireRun(runId);
  const transcript = normalizeTranscript(input.chatTranscript ?? run.chat_transcript ?? '');
  const unit = String(input.unit ?? run.unit).trim();
  const syllabusVersionId = String(input.syllabusVersionId ?? run.syllabus_version_id ?? '').trim();
  if (!unit) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'Unit is required for distill stage.', 400);
  }
  if (!syllabusVersionId) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'syllabusVersionId is required for distill stage.', 400);
  }

  if (!(await getSyllabusVersionById(syllabusVersionId))) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', `Unknown syllabusVersionId ${syllabusVersionId}`, 400);
  }

  if (input.requestJson) {
    if (!validateModulePlanRequest(input.requestJson)) {
      throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'requestJson is invalid for ModulePlanRequest schema.', 400);
    }
    const version = await getSyllabusVersionById(input.requestJson.syllabusVersionId);
    const requestHash = buildRequestHash(transcript, input.requestJson, version?.content_hash ?? null);
    const updated = await updateModuleRun(runId, {
      syllabus_version_id: input.requestJson.syllabusVersionId,
      unit: input.requestJson.unit,
      selected_los_json: input.requestJson.selectedLos,
      constraints_json: input.requestJson.constraints,
      ordering_preference: input.requestJson.orderingPreference,
      notes: input.requestJson.notes,
      chat_transcript: transcript,
      request_json: input.requestJson,
      request_hash: requestHash,
    });
    const replayed = await stageReplay(updated, 'M0', options, validateModulePlanRequest);
    if (replayed) return { stage: 'M0', replayed: true, artifact: replayed };
    await upsertArtifactAndStatus(runId, 'M0', input.requestJson);
    return { stage: 'M0', replayed: false, artifact: input.requestJson };
  }

  const selectedLos = await resolveSelectedLos(
    syllabusVersionId,
    unit,
    input.selectedLos && input.selectedLos.length > 0 ? input.selectedLos : inferSelectedLosFromChat(transcript)
  );
  const constraints = sanitizeConstraints(input.constraints);
  const orderingPreference: OrderingPreference = input.orderingPreference ?? DEFAULT_ORDERING_PREFERENCE;
  const request: ModulePlanRequest = {
    syllabusVersionId,
    unit,
    selectedLos,
    constraints,
    orderingPreference,
    notes:
      typeof input.notes === 'string' && input.notes.trim().length > 0
        ? input.notes.trim()
        : transcript.slice(0, 600),
  };

  if (!validateModulePlanRequest(request)) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'Distill output failed schema validation.', 400);
  }

  const version = await getSyllabusVersionById(request.syllabusVersionId);
  const requestHash = buildRequestHash(transcript, request, version?.content_hash ?? null);
  const updated = await updateModuleRun(runId, {
    syllabus_version_id: request.syllabusVersionId,
    unit,
    selected_los_json: selectedLos,
    constraints_json: constraints,
    ordering_preference: orderingPreference,
    notes: request.notes,
    chat_transcript: transcript,
    request_json: request,
    request_hash: requestHash,
  });
  const replayed = await stageReplay(updated, 'M0', options, validateModulePlanRequest);
  if (replayed) return { stage: 'M0', replayed: true, artifact: replayed };

  await upsertArtifactAndStatus(runId, 'M0', request);
  return { stage: 'M0', replayed: false, artifact: request };
}

export async function runM1Analyze(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<UnitStructure>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M1', options, toUnitStructureValidator);
  if (replayed) return { stage: 'M1', replayed: true, artifact: replayed };

  const structure = await getSyllabusStructureByVersionAndUnit(request.syllabusVersionId, request.unit);
  if (!structure) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `No syllabus structure found for unit ${request.unit}.`, 400, {
      unit: request.unit,
    });
  }

  const selectedLos = await resolveSelectedLos(request.syllabusVersionId, request.unit, request.selectedLos);
  const output: UnitStructure = {
    unit: request.unit,
    unitTitle: `Unit ${request.unit}`,
    los: selectedLos.map((lo) => {
      const loNumber = String(getLoNumber(lo));
      const loStruct = structure.structure_json.los.find((entry) => entry.loNumber === loNumber);
      return {
        lo,
        title: loStruct?.title ?? lo,
        sourceChunkIds: [],
      };
    }),
  };

  if (!validateUnitStructure(output)) {
    throw new ModulePlannerError('M1', 'JSON_SCHEMA_FAIL', 'M1 output failed schema validation.', 400);
  }

  const chunkIds: string[] = [];
  const records = [];
  for (const lo of selectedLos) {
    const chunks = await getChunksForUnitLO(request.syllabusVersionId, request.unit, lo, 3);
    chunkIds.push(...chunks.map((chunk) => chunk.id));
    records.push(...toRetrievedChunkRecords(chunks));
  }
  await upsertArtifactAndStatus(runId, 'M1', output, {
    retrievedChunkIds: unique(chunkIds),
    retrievedChunkText: serializeRetrievedChunkRecords(records),
  });
  return { stage: 'M1', replayed: false, artifact: output };
}

export async function runM2Coverage(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<CoverageTargets>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M2', options, toCoverageTargetsValidator);
  if (replayed) return { stage: 'M2', replayed: true, artifact: replayed };

  const structure = await getSyllabusStructureByVersionAndUnit(request.syllabusVersionId, request.unit);
  if (!structure) {
    throw new ModulePlannerError('M2', 'RAG_EMPTY', 'No structure row found for selected unit.', 400);
  }
  const m1ArtifactRow = await getStageArtifact(runId, 'M1');
  const records = deserializeRetrievedChunkRecords(m1ArtifactRow?.retrieved_chunk_text ?? '');

  const output: CoverageTargets = {
    unit: request.unit,
    los: request.selectedLos.map((loTag) => {
      const lo = normalizeLo(loTag);
      const loNumber = String(getLoNumber(lo));
      const loStruct = structure.structure_json.los.find((entry) => entry.loNumber === loNumber);
      if (!loStruct) {
        throw new ModulePlannerError('M2', 'RAG_GROUNDEDNESS_FAIL', 'Selected LO missing from truth structure.', 400, { lo });
      }
      const sourceChunkIds = records
        .filter((record) => normalizeLo(record.learningOutcome) === lo)
        .map((record) => record.id);
      const sampleChunk = records.find((record) => normalizeLo(record.learningOutcome) === lo);
      const coverageTargets: CoverageTarget[] = loStruct.acs.map((ac) => ({
        acKey: ac.acKey,
        acText: ac.text ?? ac.acKey,
        range: sampleChunk ? parseRangeFromContent(sampleChunk.content) : null,
        sourceChunkIds: unique(sourceChunkIds),
      }));
      return { lo, coverageTargets };
    }),
  };

  if (!validateCoverageTargets(output)) {
    throw new ModulePlannerError('M2', 'JSON_SCHEMA_FAIL', 'M2 output failed schema validation.', 400);
  }

  await upsertArtifactAndStatus(runId, 'M2', output, {
    retrievedChunkIds: m1ArtifactRow?.retrieved_chunk_ids ?? [],
    retrievedChunkText: m1ArtifactRow?.retrieved_chunk_text ?? '',
  });
  return { stage: 'M2', replayed: false, artifact: output };
}
export async function runM3Plan(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<MinimalLessonPlan>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M3', options, toMinimalLessonPlanValidator);
  if (replayed) return { stage: 'M3', replayed: true, artifact: replayed };

  const m2 = await getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  const output = await runM3WithRepair(request, m2);
  if (!validateMinimalLessonPlan(output)) {
    throw new ModulePlannerError('M3', 'JSON_SCHEMA_FAIL', 'M3 output failed schema validation.', 400);
  }
  const issues = getPlanValidationIssues(m2, output, request.constraints);
  if (issues.some((issue) => issue.severity === 'error')) {
    throw new ModulePlannerError('M3', 'JSON_SCHEMA_FAIL', 'M3 deterministic validation failed.', 400, {
      errors: issues.map((issue) => issue.message).join(' | '),
    });
  }
  await upsertArtifactAndStatus(runId, 'M3', output);
  return { stage: 'M3', replayed: false, artifact: output };
}

export async function runM4Blueprints(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<LessonBlueprint[]>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M4', options, toBlueprintsValidator);
  if (replayed) return { stage: 'M4', replayed: true, artifact: replayed };

  const m2 = await getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  const m3 = await getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);

  const acTextByKey = new Map<string, string>();
  m2.los.forEach((lo) => lo.coverageTargets.forEach((target) => acTextByKey.set(target.acKey, target.acText)));

  const planningRows = m3.los
    .flatMap((lo) =>
      lo.lessons.map((lesson) => ({
        lo: normalizeLo(lo.lo),
        topicCode: lesson.topicCode,
        title: lesson.title,
        coversAcKeys: lesson.coversAcKeys,
      }))
    )
    .sort((a, b) => {
      if (request.orderingPreference === 'foundation-first') {
        const loDiff = compareLoTag(a.lo, b.lo);
        if (loDiff !== 0) return loDiff;
        return a.topicCode.localeCompare(b.topicCode);
      }
      return 0;
    });

  const topicCodeCounter = new Map<string, number>();
  const blueprints: LessonBlueprint[] = [];
  const allPlannedLessons = m3.los.flatMap((lo) =>
    lo.lessons.map((lesson) => ({
      lo: normalizeLo(lo.lo),
      topicCode: lesson.topicCode,
      lessonId: `${request.unit}-${lesson.topicCode}`,
      title: lesson.title,
      coversAcKeys: lesson.coversAcKeys,
    }))
  );

  for (const row of planningRows) {
    const loNumber = getLoNumber(row.lo);
    const current = (topicCodeCounter.get(row.topicCode) ?? 0) + 1;
    topicCodeCounter.set(row.topicCode, current);
    const id = `${request.unit}-${row.topicCode}${current}`;
    const acTexts = row.coversAcKeys.map((key) => acTextByKey.get(key) ?? '').filter((text) => text.length > 0);
    const mustHaveTopics = deriveMustHaveTopics(acTexts);
    const outOfScope = allPlannedLessons
      .filter((planned) => planned.lo === row.lo && planned.topicCode !== row.topicCode)
      .map((planned) => ({ topic: planned.title, taughtInLessonId: planned.lessonId }));
    const rangeItems = row.coversAcKeys
      .map((acKey) => {
        for (const loGroup of m2.los) {
          const target = loGroup.coverageTargets.find((item) => item.acKey === acKey);
          if (target) return target.range ?? '';
        }
        return '';
      })
      .filter((item) => item.trim().length > 0);

    const masterBlueprint = buildMasterLessonBlueprint({
      lessonId: id,
      unit: request.unit,
      lo: `LO${loNumber}`,
      topic: row.title,
      layout: chooseLayout(row.title, acTexts),
      audience: request.constraints.audience,
      prerequisites:
        request.orderingPreference === 'foundation-first' && blueprints.length > 0
          ? [blueprints[blueprints.length - 1].id]
          : [],
      acAnchors: [...row.coversAcKeys],
      acTexts,
      rangeItems,
      inScopeTopics: mustHaveTopics.length > 0 ? mustHaveTopics : acTexts,
      outOfScopeTopics: outOfScope,
    });

    blueprints.push({
      id,
      unit: request.unit,
      lo: `LO${loNumber}`,
      acAnchors: [...row.coversAcKeys],
      topic: row.title,
      mustHaveTopics,
      level: request.constraints.level,
      layout: masterBlueprint.identity.layout,
      prerequisites: masterBlueprint.identity.prerequisites,
      masterBlueprint,
    });
  }

  if (!validateLessonBlueprints(blueprints)) {
    throw new ModulePlannerError('M4', 'JSON_SCHEMA_FAIL', 'M4 output failed schema validation.', 400);
  }

  await upsertArtifactAndStatus(runId, 'M4', blueprints);
  return { stage: 'M4', replayed: false, artifact: blueprints };
}

export async function runM5Validate(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<ValidationResult>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M5', options, toValidationResultValidator);
  if (replayed) return { stage: 'M5', replayed: true, artifact: replayed };

  const m2 = await getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  let m3 = await getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);
  let m4 = await getTypedStageArtifact(runId, 'M4', toBlueprintsValidator);

  let issues: ValidationIssue[] = [];
  issues.push(...getPlanValidationIssues(m2, m3, request.constraints));

  // Single automatic repair loop: re-run M3 (with its internal one-pass repair) and rebuild M4 once.
  if (issues.some((issue) => issue.severity === 'error')) {
    try {
      await runM3Plan(runId, { replayFromArtifacts: false });
      await runM4Blueprints(runId, { replayFromArtifacts: false });
      m3 = await getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);
      m4 = await getTypedStageArtifact(runId, 'M4', toBlueprintsValidator);
      issues = getPlanValidationIssues(m2, m3, request.constraints);
    } catch (repairError) {
      issues.push({
        stage: 'M5',
        severity: 'error',
        code: 'JSON_SCHEMA_FAIL',
        message: repairError instanceof Error ? repairError.message : 'Automatic repair failed.',
      });
    }
  }

  validateM4AgainstM3AndM2(issues, m2, m3, m4);

  m4.forEach((blueprint) => {
    if (!blueprint.masterBlueprint) {
      pushIssue(issues, {
        stage: 'M4',
        severity: 'error',
        code: 'BLUEPRINT_MISSING_SECTION',
        message: 'masterBlueprint section is missing',
        meta: { blueprintId: blueprint.id },
      });
      return;
    }
    const contractErrors = validateMasterLessonBlueprintContract(blueprint.masterBlueprint, blueprint.id);
    for (const contractError of contractErrors) {
      const code = contractError.includes('order')
        ? 'BLUEPRINT_BLOCK_ORDER_INVALID'
        : contractError.includes('ID')
          ? 'BLUEPRINT_ID_PATTERN_INVALID'
          : contractError.includes('anchor')
            ? 'BLUEPRINT_ANCHOR_MISMATCH'
            : 'BLUEPRINT_MISSING_SECTION';
      pushIssue(issues, {
        stage: 'M5',
        severity: 'error',
        code,
        message: contractError,
        meta: { blueprintId: blueprint.id },
      });
    }
  });

  const output: ValidationResult = {
    valid: !issues.some((issue) => issue.severity === 'error'),
    issues,
  };

  if (!validateValidationResult(output)) {
    throw new ModulePlannerError('M5', 'JSON_SCHEMA_FAIL', 'M5 output failed schema validation.', 400);
  }
  await upsertArtifactAndStatus(runId, 'M5', output);
  return { stage: 'M5', replayed: false, artifact: output };
}
async function runBlueprintGenerationQueue(
  runId: string,
  blueprints: LessonBlueprint[],
  options: { apiBaseUrl: string }
): Promise<void> {
  const existingRows = await listRunLessons(runId);
  const successfulBlueprints = new Set(existingRows.filter((row) => row.status === 'success').map((row) => row.blueprint_id));
  const remaining = blueprints.filter((blueprint) => !successfulBlueprints.has(blueprint.id));
  if (remaining.length === 0) return;

  const concurrency = getModulePlannerConcurrency();
  let cursor = 0;
  let abortError: Error | null = null;

  async function worker(): Promise<void> {
    while (cursor < remaining.length && !abortError) {
      const index = cursor++;
      const blueprint = remaining[index];
      await upsertRunLesson({
        runId,
        blueprintId: blueprint.id,
        lessonId: blueprint.id,
        status: 'pending',
      });
      try {
        const result = await generateLessonFromBlueprint(blueprint, { apiBaseUrl: options.apiBaseUrl });
        await upsertRunLesson({
          runId,
          blueprintId: blueprint.id,
          lessonId: result.lessonId,
          status: 'success',
          error: null,
          lessonJson: result.response,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown generation failure';
        await upsertRunLesson({
          runId,
          blueprintId: blueprint.id,
          lessonId: blueprint.id,
          status: 'failed',
          error: message,
        });
        abortError = new Error(message);
      }
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);
  if (abortError) throw abortError;
}

export async function runM6Generate(
  runId: string,
  options: StageReplayOptions & { apiBaseUrl: string }
): Promise<StageExecutionResult<GenerateSummary>> {
  const run = await requireRun(runId);
  const replayed = await stageReplay(run, 'M6', options, (value): value is GenerateSummary => {
    if (!value || typeof value !== 'object') return false;
    const obj = value as Record<string, unknown>;
    return (
      typeof obj.generated === 'number' &&
      typeof obj.failed === 'number' &&
      Array.isArray(obj.lessonIds) &&
      obj.lessonIds.every((id) => typeof id === 'string')
    );
  });
  if (replayed) return { stage: 'M6', replayed: true, artifact: replayed };

  const validation = await getTypedStageArtifact(runId, 'M5', toValidationResultValidator);
  if (!validation.valid) {
    throw new ModulePlannerError('M6', 'JSON_SCHEMA_FAIL', 'M5 validation failed. Generation cannot proceed.', 400);
  }
  const blueprints = await getTypedStageArtifact(runId, 'M4', toBlueprintsValidator);

  await updateModuleRun(runId, { status: 'm6-running' });
  try {
    await runBlueprintGenerationQueue(runId, blueprints, { apiBaseUrl: options.apiBaseUrl });
  } catch (error) {
    await updateModuleRun(runId, { status: 'failed' });
    throw new ModulePlannerError(
      'M6',
      'JSON_SCHEMA_FAIL',
      error instanceof Error ? error.message : 'Blueprint generation failed.',
      500
    );
  }

  const lessons = await listRunLessons(runId);
  const summary: GenerateSummary = {
    generated: lessons.filter((row) => row.status === 'success').length,
    failed: lessons.filter((row) => row.status === 'failed').length,
    lessonIds: lessons.filter((row) => row.status === 'success').map((row) => row.lesson_id),
  };
  await upsertArtifactAndStatus(runId, 'M6', summary);
  if (summary.failed > 0) {
    await updateModuleRun(runId, { status: 'failed' });
  }
  return { stage: 'M6', replayed: false, artifact: summary };
}

export async function listModulePlannerUnits(syllabusVersionId: string): Promise<string[]> {
  return getAllUnits(syllabusVersionId);
}

export async function listModulePlannerUnitLos(syllabusVersionId: string, unit: string): Promise<string[]> {
  return getUnitLos(syllabusVersionId, unit);
}

export async function getReplayableArtifacts(runId: string): Promise<Record<ModuleStage, boolean>> {
  const run = await requireRun(runId);
  const map: Partial<Record<ModuleStage, boolean>> = {};
  for (const stage of ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as ModuleStage[]) {
    map[stage] = Boolean(run.request_hash && (await findArtifactByRequestHash(run.request_hash, stage)));
  }
  return map as Record<ModuleStage, boolean>;
}

export async function ensureM1RagChunkReuse(runId: string): Promise<void> {
  const m1Artifact = await getStageArtifact(runId, 'M1');
  if (!m1Artifact) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', 'M1 artifact is missing.', 400);
  }
  if ((m1Artifact.retrieved_chunk_ids ?? []).length === 0 || !m1Artifact.retrieved_chunk_text) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', 'M1 did not persist retrieved chunk payload.', 400);
  }
}

export async function ensureM2UsesStoredChunks(runId: string): Promise<void> {
  await ensureM1RagChunkReuse(runId);
  const m2Artifact = await getStageArtifact(runId, 'M2');
  if (!m2Artifact) return;
  const m1Artifact = await getStageArtifact(runId, 'M1');
  const m1ChunkIds = (m1Artifact?.retrieved_chunk_ids ?? []).slice().sort().join(',');
  const m2ChunkIds = (m2Artifact.retrieved_chunk_ids ?? []).slice().sort().join(',');
  if (m1ChunkIds !== m2ChunkIds) {
    throw new ModulePlannerError('M2', 'RAG_GROUNDEDNESS_FAIL', 'M2 chunk IDs diverged from M1 replay payload.', 400);
  }
}

export async function lookupChunkByIdOrThrow(syllabusVersionId: string, chunkId: string): Promise<string> {
  const chunk = await getChunkById(syllabusVersionId, chunkId);
  if (!chunk) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `Chunk ${chunkId} not found.`, 400);
  }
  return chunk.text;
}
