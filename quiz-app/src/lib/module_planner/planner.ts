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
  listRunLessons,
  saveStageArtifact,
  updateModuleRun,
  upsertRunLesson,
} from './db';
import { ModulePlannerError } from './errors';
import {
  compareLoTag,
  deserializeRetrievedChunkRecords,
  getChunkById,
  getChunksByIds,
  getLoNumber,
  getUnitChunks,
  getUnitLos,
  normalizeLo,
  parseAssessmentCriteriaFromContent,
  parseRangeFromContent,
  serializeRetrievedChunkRecords,
  toRetrievedChunkRecords,
} from './syllabus';
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
  StageExecutionResult,
  StageReplayOptions,
  UnitStructure,
  ValidationIssue,
  ValidationResult,
} from './types';
import { generateLessonFromBlueprint } from './adapter';

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

function requireRun(runId: string): ModuleRunRow {
  const run = getModuleRunById(runId);
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

function updateStageStatus(runId: string, stage: ModuleStage): void {
  updateModuleRun(runId, { status: STAGE_STATUS[stage] });
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

function getTypedStageArtifact<T>(runId: string, stage: ModuleStage, validator: ValidationFn<T>): T {
  const artifact = getStageArtifact(runId, stage);
  return parseTypedArtifact(artifact, stage, validator);
}

function normalizeTranscript(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
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

function resolveSelectedLos(unit: string, selectedLos?: string[]): string[] {
  const available = getUnitLos(unit).map((lo) => normalizeLo(lo));
  if (available.length === 0) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `No syllabus chunks found for unit ${unit}.`, 400, { unit });
  }
  const normalized = (selectedLos ?? []).map((lo) => normalizeLo(lo)).filter((lo) => lo.length > 0);
  if (normalized.length === 0) return [...available];
  const missing = normalized.filter((lo) => !available.includes(lo));
  if (missing.length > 0) {
    throw new ModulePlannerError('M1', 'RAG_GROUNDEDNESS_FAIL', 'Selected LO is not present in retrieved unit content.', 400, {
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

function buildRequestHash(chatTranscript: string, request: ModulePlanRequest): string {
  return stableHash({
    chatTranscript: normalizeTranscript(chatTranscript),
    request,
    config: {
      maxAcsPerLesson: MAX_ACS_PER_LESSON,
      ordering: request.orderingPreference,
      defaultMaxLessonsPerLO: request.constraints.defaultMaxLessonsPerLO,
      maxLessonsOverrides: request.constraints.maxLessonsOverrides,
    },
  });
}

function stageReplay<T>(
  run: ModuleRunRow,
  stage: ModuleStage,
  options: StageReplayOptions,
  validator: ValidationFn<T>
): T | null {
  if (!options.replayFromArtifacts || !run.request_hash) return null;
  const replayArtifact = findArtifactByRequestHash(run.request_hash, stage);
  if (!replayArtifact) return null;
  const parsed = parseTypedArtifact(replayArtifact, stage, validator);
  if (replayArtifact.module_run_id !== run.id) {
    saveStageArtifact({
      moduleRunId: run.id,
      stage,
      artifactJson: parsed,
      retrievedChunkIds: replayArtifact.retrieved_chunk_ids,
      retrievedChunkText: replayArtifact.retrieved_chunk_text,
    });
  }
  updateStageStatus(run.id, stage);
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

function upsertArtifactAndStatus(
  runId: string,
  stage: ModuleStage,
  artifact: unknown,
  options?: { retrievedChunkIds?: string[]; retrievedChunkText?: string }
): void {
  saveStageArtifact({
    moduleRunId: runId,
    stage,
    artifactJson: artifact,
    retrievedChunkIds: options?.retrievedChunkIds ?? [],
    retrievedChunkText: options?.retrievedChunkText ?? '',
  });
  updateStageStatus(runId, stage);
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

export function createPlannerRun(input: { unit: string; chatTranscript: string }): ModuleRunRow {
  const normalizedUnit = String(input.unit).trim();
  if (!normalizedUnit) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'unit is required.', 400);
  }
  if (getUnitLos(normalizedUnit).length === 0) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `Unknown unit: ${normalizedUnit}`, 400);
  }
  return createModuleRun({
    unit: normalizedUnit,
    chatTranscript: normalizeTranscript(input.chatTranscript ?? ''),
  });
}

export function getPlannerRunSummary(runId: string): ModuleRunSummary {
  const summary = getRunSummary(runId);
  if (!summary) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', `Run not found: ${runId}`, 404);
  }
  return summary;
}

export function runM0Distill(
  runId: string,
  input: DistillInput,
  options: StageReplayOptions = {}
): StageExecutionResult<ModulePlanRequest> {
  const run = requireRun(runId);
  const transcript = normalizeTranscript(input.chatTranscript ?? run.chat_transcript ?? '');
  const unit = String(input.unit ?? run.unit).trim();
  if (!unit) {
    throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'Unit is required for distill stage.', 400);
  }

  if (input.requestJson) {
    if (!validateModulePlanRequest(input.requestJson)) {
      throw new ModulePlannerError('M0', 'JSON_SCHEMA_FAIL', 'requestJson is invalid for ModulePlanRequest schema.', 400);
    }
    const requestHash = buildRequestHash(transcript, input.requestJson);
    const updated = updateModuleRun(runId, {
      unit: input.requestJson.unit,
      chat_transcript: transcript,
      request_json: input.requestJson,
      request_hash: requestHash,
    });
    const replayed = stageReplay(updated, 'M0', options, validateModulePlanRequest);
    if (replayed) {
      return { stage: 'M0', replayed: true, artifact: replayed };
    }
    upsertArtifactAndStatus(runId, 'M0', input.requestJson);
    return { stage: 'M0', replayed: false, artifact: input.requestJson };
  }

  const selectedLos = resolveSelectedLos(
    unit,
    input.selectedLos && input.selectedLos.length > 0 ? input.selectedLos : inferSelectedLosFromChat(transcript)
  );
  const constraints = sanitizeConstraints(input.constraints);
  const orderingPreference = input.orderingPreference ?? DEFAULT_ORDERING_PREFERENCE;
  const request: ModulePlanRequest = {
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
  const requestHash = buildRequestHash(transcript, request);
  const updated = updateModuleRun(runId, {
    unit,
    chat_transcript: transcript,
    request_json: request,
    request_hash: requestHash,
  });
  const replayed = stageReplay(updated, 'M0', options, validateModulePlanRequest);
  if (replayed) {
    return { stage: 'M0', replayed: true, artifact: replayed };
  }
  upsertArtifactAndStatus(runId, 'M0', request);
  return { stage: 'M0', replayed: false, artifact: request };
}

export function runM1Analyze(
  runId: string,
  options: StageReplayOptions = {}
): StageExecutionResult<UnitStructure> {
  const run = requireRun(runId);
  const request = requireRequest(run);
  const replayed = stageReplay(run, 'M1', options, toUnitStructureValidator);
  if (replayed) return { stage: 'M1', replayed: true, artifact: replayed };

  const unitChunks = getUnitChunks(request.unit);
  if (unitChunks.length === 0) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `No syllabus chunks found for unit ${request.unit}.`, 400, {
      unit: request.unit,
    });
  }

  const selectedLos = resolveSelectedLos(request.unit, request.selectedLos);
  const selectedChunks = selectedLos.map((lo) => {
    const found = unitChunks.find((chunk) => normalizeLo(chunk.learningOutcome) === lo);
    if (!found) {
      throw new ModulePlannerError('M1', 'RAG_GROUNDEDNESS_FAIL', 'Selected LO missing from retrieved unit chunks.', 400, {
        lo,
      });
    }
    return found;
  });

  const output: UnitStructure = {
    unit: request.unit,
    unitTitle: selectedChunks[0]?.unitTitle ?? unitChunks[0].unitTitle,
    los: selectedChunks.map((chunk) => ({
      lo: normalizeLo(chunk.learningOutcome),
      title: chunk.loTitle.trim(),
      sourceChunkIds: [chunk.id],
    })),
  };

  if (!validateUnitStructure(output)) {
    throw new ModulePlannerError('M1', 'JSON_SCHEMA_FAIL', 'M1 output failed schema validation.', 400);
  }

  const records = toRetrievedChunkRecords(selectedChunks);
  upsertArtifactAndStatus(runId, 'M1', output, {
    retrievedChunkIds: records.map((record) => record.id),
    retrievedChunkText: serializeRetrievedChunkRecords(records),
  });
  return { stage: 'M1', replayed: false, artifact: output };
}

export function runM2Coverage(
  runId: string,
  options: StageReplayOptions = {}
): StageExecutionResult<CoverageTargets> {
  const run = requireRun(runId);
  const request = requireRequest(run);
  const replayed = stageReplay(run, 'M2', options, toCoverageTargetsValidator);
  if (replayed) return { stage: 'M2', replayed: true, artifact: replayed };

  const m1ArtifactRow = getStageArtifact(runId, 'M1');
  const m1 = parseTypedArtifact(m1ArtifactRow, 'M1', toUnitStructureValidator);
  const retrievedFromArtifact = deserializeRetrievedChunkRecords(m1ArtifactRow?.retrieved_chunk_text ?? '');
  const records =
    retrievedFromArtifact.length > 0
      ? retrievedFromArtifact
      : toRetrievedChunkRecords(getChunksByIds(m1ArtifactRow?.retrieved_chunk_ids ?? []));

  if (records.length === 0) {
    throw new ModulePlannerError('M2', 'RAG_EMPTY', 'M1 retrieved chunk payload is empty.', 400);
  }

  const selectedLos = request.selectedLos.length > 0 ? request.selectedLos : m1.los.map((lo) => lo.lo);

  const output: CoverageTargets = {
    unit: request.unit,
    los: selectedLos.map((loTag) => {
      const normalizedLo = normalizeLo(loTag);
      const record = records.find((item) => normalizeLo(item.learningOutcome) === normalizedLo);
      if (!record) {
        throw new ModulePlannerError('M2', 'RAG_GROUNDEDNESS_FAIL', 'LO missing from replayed chunk payload.', 400, {
          lo: normalizedLo,
        });
      }

      const criteria = record.assessmentCriteria.length > 0 ? record.assessmentCriteria : parseAssessmentCriteriaFromContent(record.content);
      if (criteria.length === 0) {
        throw new ModulePlannerError('M2', 'MISSING_AC', 'No assessment criteria extracted for LO.', 400, {
          lo: normalizedLo,
        });
      }

      const loNumber = getLoNumber(normalizedLo);
      const rangeText = parseRangeFromContent(record.content);
      const coverageTargets: CoverageTarget[] = criteria.map((criterion, index) => {
        const acText = criterion.replace(/\s+/g, ' ').trim();
        const grounded = record.content.toLowerCase().includes(acText.toLowerCase().slice(0, Math.min(acText.length, 24)));
        if (!grounded) {
          throw new ModulePlannerError(
            'M2',
            'RAG_GROUNDEDNESS_FAIL',
            'Extracted AC text is not grounded in retrieved chunk content.',
            400,
            { lo: normalizedLo, acText }
          );
        }
        return {
          acKey: `${request.unit}.LO${loNumber}.AC${loNumber}.${index + 1}`,
          acText,
          range: rangeText,
          sourceChunkIds: [record.id],
        };
      });

      return {
        lo: normalizedLo,
        coverageTargets,
      };
    }),
  };

  if (!validateCoverageTargets(output)) {
    throw new ModulePlannerError('M2', 'JSON_SCHEMA_FAIL', 'M2 output failed schema validation.', 400);
  }

  upsertArtifactAndStatus(runId, 'M2', output, {
    retrievedChunkIds: records.map((record) => record.id),
    retrievedChunkText: serializeRetrievedChunkRecords(records),
  });
  return { stage: 'M2', replayed: false, artifact: output };
}

export function runM3Plan(
  runId: string,
  options: StageReplayOptions = {}
): StageExecutionResult<MinimalLessonPlan> {
  const run = requireRun(runId);
  const request = requireRequest(run);
  const replayed = stageReplay(run, 'M3', options, toMinimalLessonPlanValidator);
  if (replayed) return { stage: 'M3', replayed: true, artifact: replayed };

  const m2 = getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);

  const output: MinimalLessonPlan = {
    unit: m2.unit,
    los: m2.los.map((loGroup) => {
      const loTag = normalizeLo(loGroup.lo);
      const loNumber = getLoNumber(loTag);
      const allAcKeys = loGroup.coverageTargets.map((target) => target.acKey);
      const duplicates = allAcKeys.filter((key, index) => allAcKeys.indexOf(key) !== index);
      if (duplicates.length > 0) {
        throw new ModulePlannerError('M3', 'DUPLICATE_AC_ASSIGNMENT', 'Duplicate ACs detected in M2 payload.', 400, {
          lo: loTag,
        });
      }

      const grouped = chunkArray(allAcKeys, MAX_ACS_PER_LESSON);
      const maxLessons = getMaxLessonsForLo(request.constraints, loTag);
      if (grouped.length > maxLessons) {
        throw new ModulePlannerError(
          'M3',
          'EXCEEDS_MAX_LESSONS',
          'Minimal lesson split exceeds configured cap for LO.',
          400,
          { lo: loTag, required: grouped.length, cap: maxLessons }
        );
      }

      const lessons = grouped.map((group, index) => {
        const topicCode = `${loNumber}${alphaIndex(index)}`;
        const titleBase = loGroup.coverageTargets[0]?.acText ?? `${loTag} coverage`;
        const title =
          grouped.length === 1
            ? `${titleBase}`
            : `${titleBase} (Part ${index + 1})`;
        return {
          topicCode,
          title,
          coversAcKeys: group,
          whySplit:
            grouped.length > 1 && index > 0
              ? 'Split to enforce anti-bloat cap (max 4 ACs per lesson).'
              : null,
        };
      });

      return {
        lo: loTag,
        lessonCount: lessons.length,
        lessons,
      };
    }),
  };

  if (!validateMinimalLessonPlan(output)) {
    throw new ModulePlannerError('M3', 'JSON_SCHEMA_FAIL', 'M3 output failed schema validation.', 400);
  }

  const expected = new Set(m2.los.flatMap((lo) => lo.coverageTargets.map((target) => target.acKey)));
  const assigned = output.los.flatMap((lo) => lo.lessons.flatMap((lesson) => lesson.coversAcKeys));
  const assignedSet = new Set(assigned);
  if (assigned.length !== assignedSet.size) {
    throw new ModulePlannerError('M3', 'DUPLICATE_AC_ASSIGNMENT', 'M3 assigned at least one AC more than once.', 400);
  }
  for (const key of expected) {
    if (!assignedSet.has(key)) {
      throw new ModulePlannerError('M3', 'MISSING_AC', 'M3 omitted an AC from M2.', 400, { acKey: key });
    }
  }

  upsertArtifactAndStatus(runId, 'M3', output);
  return { stage: 'M3', replayed: false, artifact: output };
}

export function runM4Blueprints(
  runId: string,
  options: StageReplayOptions = {}
): StageExecutionResult<LessonBlueprint[]> {
  const run = requireRun(runId);
  const request = requireRequest(run);
  const replayed = stageReplay(run, 'M4', options, toBlueprintsValidator);
  if (replayed) return { stage: 'M4', replayed: true, artifact: replayed };

  const m2 = getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  const m3 = getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);
  const acTextByKey = new Map<string, string>();
  m2.los.forEach((lo) => {
    lo.coverageTargets.forEach((target) => {
      acTextByKey.set(target.acKey, target.acText);
    });
  });

  const planningRows = m3.los
    .flatMap((lo) =>
      lo.lessons.map((lesson) => ({
        lo: lo.lo,
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
  for (const row of planningRows) {
    const loNumber = getLoNumber(row.lo);
    const current = (topicCodeCounter.get(row.topicCode) ?? 0) + 1;
    topicCodeCounter.set(row.topicCode, current);
    const id = `${request.unit}-${row.topicCode}${current}`;
    const acTexts = row.coversAcKeys.map((key) => acTextByKey.get(key) ?? '').filter((text) => text.length > 0);
    const mustHaveTopics = deriveMustHaveTopics(acTexts);
    const topic = row.title;
    const blueprint: LessonBlueprint = {
      id,
      unit: request.unit,
      lo: `LO${loNumber}`,
      acAnchors: [...row.coversAcKeys],
      topic,
      mustHaveTopics,
      level: request.constraints.level,
      layout: chooseLayout(topic, acTexts),
      prerequisites:
        request.orderingPreference === 'foundation-first' && blueprints.length > 0
          ? [blueprints[blueprints.length - 1].id]
          : [],
    };
    blueprints.push(blueprint);
  }

  const acCorpus = m2.los
    .flatMap((lo) => lo.coverageTargets.map((target) => target.acText.toLowerCase()))
    .join(' ');
  for (const blueprint of blueprints) {
    for (const topic of blueprint.mustHaveTopics) {
      if (!topic) continue;
      const candidate = topic.toLowerCase().replace(/\.\.\.$/, '');
      if (!acCorpus.includes(candidate.slice(0, Math.min(18, candidate.length)))) {
        throw new ModulePlannerError('M4', 'TOO_BROAD_SCOPE', 'Blueprint topic escaped AC scope.', 400, {
          blueprintId: blueprint.id,
          topic,
        });
      }
    }
  }

  if (!validateLessonBlueprints(blueprints)) {
    throw new ModulePlannerError('M4', 'JSON_SCHEMA_FAIL', 'M4 output failed schema validation.', 400);
  }

  upsertArtifactAndStatus(runId, 'M4', blueprints);
  return { stage: 'M4', replayed: false, artifact: blueprints };
}

function pushIssue(
  issues: ValidationIssue[],
  issue: ValidationIssue
): void {
  issues.push(issue);
}

export function runM5Validate(
  runId: string,
  options: StageReplayOptions = {}
): StageExecutionResult<ValidationResult> {
  const run = requireRun(runId);
  const request = requireRequest(run);
  const replayed = stageReplay(run, 'M5', options, toValidationResultValidator);
  if (replayed) return { stage: 'M5', replayed: true, artifact: replayed };

  const m2 = getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  const m3 = getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);
  const m4 = getTypedStageArtifact(runId, 'M4', toBlueprintsValidator);
  const issues: ValidationIssue[] = [];

  const expectedByLo = new Map<string, string[]>();
  m2.los.forEach((lo) => {
    expectedByLo.set(lo.lo, lo.coverageTargets.map((target) => target.acKey));
  });

  const assignedByLo = new Map<string, string[]>();
  m3.los.forEach((lo) => {
    const keys = lo.lessons.flatMap((lesson) => lesson.coversAcKeys);
    assignedByLo.set(lo.lo, keys);
  });

  for (const [lo, expectedKeys] of expectedByLo.entries()) {
    const assigned = assignedByLo.get(lo) ?? [];
    const counts = new Map<string, number>();
    assigned.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));
    for (const expectedKey of expectedKeys) {
      if (!counts.has(expectedKey)) {
        pushIssue(issues, {
          stage: 'M3',
          severity: 'error',
          code: 'MISSING_AC',
          message: 'AC not covered',
          meta: { acKey: expectedKey },
        });
      }
    }
    for (const [acKey, count] of counts.entries()) {
      if (count > 1) {
        pushIssue(issues, {
          stage: 'M3',
          severity: 'error',
          code: 'DUPLICATE_AC_ASSIGNMENT',
          message: 'AC assigned to multiple lessons',
          meta: { acKey, count },
        });
      }
    }
  }

  for (const loPlan of m3.los) {
    const cap = getMaxLessonsForLo(request.constraints, loPlan.lo);
    if (loPlan.lessonCount > cap) {
      pushIssue(issues, {
        stage: 'M3',
        severity: 'error',
        code: 'EXCEEDS_MAX_LESSONS',
        message: 'Lesson count exceeds configured cap',
        meta: { lo: loPlan.lo, lessonCount: loPlan.lessonCount, cap },
      });
    }
  }

  const m3AnchorSets = m3.los.flatMap((lo) =>
    lo.lessons.map((lesson) => `${lo.lo}:${lesson.coversAcKeys.slice().sort().join('|')}`)
  );
  const m4AnchorSets = m4.map((blueprint) => `${blueprint.lo}:${blueprint.acAnchors.slice().sort().join('|')}`);
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
  const blueprintAcCounter = new Map<string, number>();
  m4.forEach((blueprint) => {
    blueprint.acAnchors.forEach((acKey) => {
      blueprintAcCounter.set(acKey, (blueprintAcCounter.get(acKey) ?? 0) + 1);
      if (!allExpectedAcs.has(acKey)) {
        pushIssue(issues, {
          stage: 'M4',
          severity: 'error',
          code: 'TOO_BROAD_SCOPE',
          message: 'Blueprint includes AC outside M2 coverage targets',
          meta: { blueprintId: blueprint.id, acKey },
        });
      }
    });
  });
  for (const [acKey, count] of blueprintAcCounter.entries()) {
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

  const acTextCorpusByKey = new Map<string, string>();
  m2.los.forEach((lo) => {
    lo.coverageTargets.forEach((target) => acTextCorpusByKey.set(target.acKey, target.acText.toLowerCase()));
  });

  m4.forEach((blueprint) => {
    const localCorpus = blueprint.acAnchors
      .map((acKey) => acTextCorpusByKey.get(acKey) ?? '')
      .join(' ');
    blueprint.mustHaveTopics.forEach((topic) => {
      const normalizedTopic = topic.toLowerCase().replace(/\.\.\.$/, '');
      if (!normalizedTopic) return;
      if (!localCorpus.includes(normalizedTopic.slice(0, Math.min(18, normalizedTopic.length)))) {
        pushIssue(issues, {
          stage: 'M4',
          severity: 'error',
          code: 'TOO_BROAD_SCOPE',
          message: 'mustHaveTopics contains content not supported by AC text',
          meta: { blueprintId: blueprint.id, topic },
        });
      }
    });
  });

  const output: ValidationResult = {
    valid: !issues.some((issue) => issue.severity === 'error'),
    issues,
  };

  if (!validateValidationResult(output)) {
    throw new ModulePlannerError('M5', 'JSON_SCHEMA_FAIL', 'M5 output failed schema validation.', 400);
  }

  upsertArtifactAndStatus(runId, 'M5', output);
  return { stage: 'M5', replayed: false, artifact: output };
}

async function runBlueprintGenerationQueue(
  runId: string,
  blueprints: LessonBlueprint[],
  options: { apiBaseUrl: string }
): Promise<void> {
  const existingRows = listRunLessons(runId);
  const successfulBlueprints = new Set(
    existingRows.filter((row) => row.status === 'success').map((row) => row.blueprint_id)
  );
  const remaining = blueprints.filter((blueprint) => !successfulBlueprints.has(blueprint.id));
  if (remaining.length === 0) return;

  const concurrency = getModulePlannerConcurrency();
  let cursor = 0;
  let abortError: Error | null = null;

  async function worker(): Promise<void> {
    while (cursor < remaining.length && !abortError) {
      const index = cursor++;
      const blueprint = remaining[index];
      upsertRunLesson({
        moduleRunId: runId,
        blueprintId: blueprint.id,
        lessonId: blueprint.id,
        status: 'pending',
      });
      try {
        const result = await generateLessonFromBlueprint(blueprint, { apiBaseUrl: options.apiBaseUrl });
        upsertRunLesson({
          moduleRunId: runId,
          blueprintId: blueprint.id,
          lessonId: result.lessonId,
          status: 'success',
          error: null,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown generation failure';
        upsertRunLesson({
          moduleRunId: runId,
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
  const run = requireRun(runId);
  const replayed = stageReplay(run, 'M6', options, (value): value is GenerateSummary => {
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

  const validation = getTypedStageArtifact(runId, 'M5', toValidationResultValidator);
  if (!validation.valid) {
    throw new ModulePlannerError('M6', 'JSON_SCHEMA_FAIL', 'M5 validation failed. Generation cannot proceed.', 400);
  }
  const blueprints = getTypedStageArtifact(runId, 'M4', toBlueprintsValidator);

  updateModuleRun(runId, { status: 'm6-running' });
  try {
    await runBlueprintGenerationQueue(runId, blueprints, { apiBaseUrl: options.apiBaseUrl });
  } catch (error) {
    updateModuleRun(runId, { status: 'failed' });
    throw new ModulePlannerError(
      'M6',
      'JSON_SCHEMA_FAIL',
      error instanceof Error ? error.message : 'Blueprint generation failed.',
      500
    );
  }

  const lessons = listRunLessons(runId);
  const summary: GenerateSummary = {
    generated: lessons.filter((row) => row.status === 'success').length,
    failed: lessons.filter((row) => row.status === 'failed').length,
    lessonIds: lessons.filter((row) => row.status === 'success').map((row) => row.lesson_id),
  };
  upsertArtifactAndStatus(runId, 'M6', summary);
  if (summary.failed > 0) {
    updateModuleRun(runId, { status: 'failed' });
  }
  return { stage: 'M6', replayed: false, artifact: summary };
}

export function listModulePlannerUnits(): string[] {
  const unitSet = new Set<string>();
  ['201', '202', '203', '204', '210', '305'].forEach((u) => {
    if (getUnitLos(u).length > 0) unitSet.add(u);
  });
  return Array.from(unitSet).sort();
}

export function getReplayableArtifacts(runId: string): Record<ModuleStage, boolean> {
  const run = requireRun(runId);
  const map: Partial<Record<ModuleStage, boolean>> = {};
  (['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as ModuleStage[]).forEach((stage) => {
    map[stage] = Boolean(run.request_hash && findArtifactByRequestHash(run.request_hash, stage));
  });
  return map as Record<ModuleStage, boolean>;
}

export function ensureM1RagChunkReuse(runId: string): void {
  const m1Artifact = getStageArtifact(runId, 'M1');
  if (!m1Artifact) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', 'M1 artifact is missing.', 400);
  }
  if ((m1Artifact.retrieved_chunk_ids ?? []).length === 0 || !m1Artifact.retrieved_chunk_text) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', 'M1 did not persist retrieved chunk payload.', 400);
  }
}

export function ensureM2UsesStoredChunks(runId: string): void {
  ensureM1RagChunkReuse(runId);
  const m2Artifact = getStageArtifact(runId, 'M2');
  if (!m2Artifact) return;
  const m1Artifact = getStageArtifact(runId, 'M1');
  const m1ChunkIds = (m1Artifact?.retrieved_chunk_ids ?? []).slice().sort().join(',');
  const m2ChunkIds = (m2Artifact.retrieved_chunk_ids ?? []).slice().sort().join(',');
  if (m1ChunkIds !== m2ChunkIds) {
    throw new ModulePlannerError('M2', 'RAG_GROUNDEDNESS_FAIL', 'M2 chunk IDs diverged from M1 replay payload.', 400);
  }
}

export function lookupChunkByIdOrThrow(chunkId: string): string {
  const chunk = getChunkById(chunkId);
  if (!chunk) {
    throw new ModulePlannerError('M1', 'RAG_EMPTY', `Chunk ${chunkId} not found.`, 400);
  }
  return chunk.content;
}
