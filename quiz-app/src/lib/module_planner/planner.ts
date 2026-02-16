import {
  DEFAULT_AUDIENCE,
  DEFAULT_LEVEL,
  DEFAULT_MAX_ACS_PER_LESSON,
  DEFAULT_MAX_LESSONS_PER_LO,
  DEFAULT_MINIMISE_LESSONS,
  DEFAULT_ORDERING_PREFERENCE,
  DEFAULT_PREFERRED_ACS_PER_LESSON,
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
  parseAssessmentCriteriaEntriesFromContent,
  serializeRetrievedChunkRecords,
  toRetrievedChunkRecords,
} from './syllabus';
import { buildMasterLessonBlueprint, validateMasterLessonBlueprintContract } from './masterLessonBlueprint';
import {
  validateCoverageTargets,
  validateLessonBlueprints,
  validateM4BlueprintArtifact,
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
  LessonLedgerMetadata,
  LoBlueprintSetArtifact,
  LoLedger,
  LoLedgerArtifact,
  M4BlueprintArtifact,
  MinimalLessonPlan,
  ModuleConstraints,
  ModulePlanRequest,
  ModuleRunArtifactRow,
  ModuleRunRow,
  ModuleRunSummary,
  ModuleStage,
  OrderingPreference,
  RetrievedChunkRecord,
  StageExecutionResult,
  StageReplayOptions,
  UnitStructure,
  ValidationIssue,
  ValidationResult,
} from './types';
import { BlueprintGenerationResult, generateLessonFromBlueprint } from './adapter';
import { createLLMClient } from '@/lib/llm/client';
import { getGeminiApiKey, getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { cleanCodeBlocks, preprocessToValidJson, safeJsonParse } from '@/lib/generation/utils';
import fs from 'fs';
import path from 'path';

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
  const maxAcsPerLessonRaw = Number.parseInt(
    String(input?.maxAcsPerLesson ?? DEFAULT_MAX_ACS_PER_LESSON),
    10
  );
  const preferredAcsPerLessonRaw = Number.parseInt(
    String(input?.preferredAcsPerLesson ?? DEFAULT_PREFERRED_ACS_PER_LESSON),
    10
  );
  const maxAcsPerLesson =
    Number.isNaN(maxAcsPerLessonRaw) || maxAcsPerLessonRaw <= 0
      ? DEFAULT_MAX_ACS_PER_LESSON
      : maxAcsPerLessonRaw;
  const preferredAcsPerLesson =
    Number.isNaN(preferredAcsPerLessonRaw) || preferredAcsPerLessonRaw <= 0
      ? DEFAULT_PREFERRED_ACS_PER_LESSON
      : preferredAcsPerLessonRaw;
  return {
    minimiseLessons: input?.minimiseLessons ?? DEFAULT_MINIMISE_LESSONS,
    defaultMaxLessonsPerLO: Number.isNaN(defaultMax) || defaultMax <= 0 ? DEFAULT_MAX_LESSONS_PER_LO : defaultMax,
    maxAcsPerLesson,
    preferredAcsPerLesson,
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
      maxAcsPerLesson: request.constraints.maxAcsPerLesson,
      preferredAcsPerLesson: request.constraints.preferredAcsPerLesson,
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const AC_COMMAND_VERBS = new Set([
  'identify',
  'state',
  'define',
  'describe',
  'explain',
  'apply',
  'list',
  'outline',
  'demonstrate',
  'recognise',
  'recognize',
  'select',
  'calculate',
  'summarise',
  'summarize',
  'name',
]);

function normalizeCurriculumPhrase(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/^\d+(?:\.\d+)?\s*/, '')
    .replace(/^[-:;,.()\s]+/, '')
    .trim();
}

function stripCommandVerb(value: string): string {
  const cleaned = normalizeCurriculumPhrase(value);
  if (!cleaned) return '';
  const tokens = cleaned.split(' ').filter((token) => token.length > 0);
  if (tokens.length <= 1) return cleaned;
  return AC_COMMAND_VERBS.has(tokens[0].toLowerCase()) ? tokens.slice(1).join(' ') : cleaned;
}

function cleanConceptPhrase(value: string): string {
  return stripCommandVerb(value)
    .replace(/\s+/g, ' ')
    .replace(/^[^A-Za-z0-9]+/, '')
    .replace(/[:;,.]+$/, '')
    .trim();
}

function normalizeTopicCode(topicCode: string, unit: string, loHint?: string): string {
  const trimmed = String(topicCode ?? '').trim();
  if (!trimmed) return trimmed;
  let normalized = trimmed.replace(/\s+/g, '');
  normalized = normalized.replace(new RegExp(`^${escapeRegExp(unit)}[-_.]?`, 'i'), '');
  normalized = normalized.replace(/^topic[-_.]?/i, '');

  if (/^\d+[A-Z]{1,2}$/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  const loFromHint = loHint ? String(getLoNumber(loHint)) : null;
  const loFromCode = normalized.match(/LO(\d+)/i)?.[1] ?? null;
  const loNumber = loFromHint ?? loFromCode;
  const lessonOrdinalMatch =
    normalized.match(/(?:^|[._-])L(?:ESSON)?(\d+)$/i) ??
    normalized.match(/LESSON(\d+)$/i);

  if (loNumber && lessonOrdinalMatch) {
    const ordinal = Number.parseInt(lessonOrdinalMatch[1], 10);
    if (!Number.isNaN(ordinal) && ordinal > 0) {
      return `${loNumber}${alphaIndex(ordinal - 1)}`;
    }
  }

  if (loNumber) {
    const letterSuffix = normalized.match(/(?:^|[._-])([A-Z]{1,2})$/i)?.[1] ?? null;
    if (letterSuffix) return `${loNumber}${letterSuffix.toUpperCase()}`;
  }

  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function toRangeList(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter((item) => item.length > 0);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }
  return [];
}

function looksLikeLoHeading(value: string): boolean {
  const normalized = value.trim();
  return /^LO\s*\d+\b/i.test(normalized) || /^Learning Outcome\s*\d*/i.test(normalized);
}

function pickMostFrequent(values: string[]): string | null {
  if (values.length === 0) return null;
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  let bestValue: string | null = null;
  let bestCount = -1;
  for (const [value, count] of counts.entries()) {
    if (count > bestCount) {
      bestValue = value;
      bestCount = count;
    }
  }
  return bestValue;
}

function normalizeCoverageAcText(acNumber: string, acText: string): string {
  const text = String(acText ?? '').trim();
  if (!text) return text;
  const suffix = String(acNumber ?? '').split('.').pop()?.trim();
  if (!suffix) return text;
  const prefixed = new RegExp(`^${escapeRegExp(suffix)}\\s+`);
  return text
    .replace(prefixed, '')
    .replace(/\s*[:;]+$/, '')
    .trim();
}

function normalizeAcNumberToken(value: string): string {
  return String(value ?? '').replace(/^AC\s*/i, '').trim();
}

function isLikelyTruncatedAcText(value: string): boolean {
  const text = String(value ?? '').trim();
  if (!text) return true;
  if (/[:;]$/.test(text)) return true;
  return /\b(with|between|for|to|from|of|in|on|at|into|onto|about|against|among|across|via)$/i.test(text);
}

function enrichCoverageAcTextFromRecords(params: {
  acNumber: string;
  acText: string;
  loRecords: RetrievedChunkRecord[];
}): string {
  const normalizedBase = normalizeCoverageAcText(params.acNumber, params.acText);
  const targetAcNumber = normalizeAcNumberToken(params.acNumber);
  let best = normalizedBase;

  for (const record of params.loRecords) {
    const entries = parseAssessmentCriteriaEntriesFromContent(record.content);
    for (const entry of entries) {
      if (normalizeAcNumberToken(entry.acNumber) !== targetAcNumber) continue;
      const candidate = normalizeCoverageAcText(params.acNumber, entry.text);
      if (!candidate) continue;
      if (!best) {
        best = candidate;
        continue;
      }
      const preferCandidate =
        (isLikelyTruncatedAcText(best) && !isLikelyTruncatedAcText(candidate)) ||
        candidate.length > best.length + 8;
      if (preferCandidate) {
        best = candidate;
      }
    }
  }

  return best;
}

function formatPlanIssuesForError(issues: ValidationIssue[]): string {
  const summarized = issues.slice(0, 12).map((issue, index) => {
    const acKey = issue.meta?.acKey ? ` ac=${issue.meta.acKey}` : '';
    const lessonTitle = issue.meta?.lessonTitle ? ` lesson="${issue.meta.lessonTitle}"` : '';
    const lo = issue.meta?.lo ? ` lo=${issue.meta.lo}` : '';
    return `${index + 1}. [${issue.severity}] ${issue.code}${lo}${acKey}${lessonTitle} - ${issue.message}`;
  });
  const suffix = issues.length > summarized.length ? ` | +${issues.length - summarized.length} more` : '';
  return `${summarized.join(' | ')}${suffix}`;
}

function hasBlockingPlanIssues(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}

type M3LlmFailureReason =
  | 'OK'
  | 'NO_API_KEY'
  | 'NO_MODEL'
  | 'LLM_EXCEPTION'
  | 'EMPTY_RESPONSE'
  | 'JSON_PARSE_FAIL'
  | 'JSON_SCHEMA_FAIL';

interface M3LlmDiagnostics {
  failureReason: M3LlmFailureReason;
  model: string | null;
  finishReason: string | null;
  responseChars: number;
  parseError: string | null;
  schemaValid: boolean | null;
  shapeCoerced: boolean | null;
  errorMessage: string | null;
  rawPreview: string | null;
}

interface M3LlmAttempt {
  plan: MinimalLessonPlan | null;
  diagnostics: M3LlmDiagnostics;
}

function truncateText(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 3))}...`;
}

function formatM3DiagnosticsForMessage(diagnostics: M3LlmDiagnostics): string {
  const parts = [`reason=${diagnostics.failureReason}`];
  if (diagnostics.finishReason) parts.push(`finishReason=${diagnostics.finishReason}`);
  if (diagnostics.responseChars > 0) parts.push(`responseChars=${diagnostics.responseChars}`);
  if (diagnostics.parseError) parts.push(`parseError=${truncateText(diagnostics.parseError, 180)}`);
  if (diagnostics.errorMessage) parts.push(`error=${truncateText(diagnostics.errorMessage, 180)}`);
  return parts.join(', ');
}

function toM3DiagnosticsMeta(
  diagnostics: M3LlmDiagnostics
): Record<string, string | number | boolean | null> {
  return {
    llmFailureReason: diagnostics.failureReason,
    llmModel: diagnostics.model,
    llmFinishReason: diagnostics.finishReason,
    llmResponseChars: diagnostics.responseChars,
    llmParseError: diagnostics.parseError ? truncateText(diagnostics.parseError, 500) : null,
    llmSchemaValid: diagnostics.schemaValid,
    llmShapeCoerced: diagnostics.shapeCoerced,
    llmErrorMessage: diagnostics.errorMessage ? truncateText(diagnostics.errorMessage, 500) : null,
    llmRawPreview: diagnostics.rawPreview ? truncateText(diagnostics.rawPreview, 500) : null,
  };
}

function toCleanString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return unique(
    value
      .map((item) => toCleanString(item))
      .filter((item): item is string => Boolean(item))
  );
}

function normalizePlanTopicCodes(plan: MinimalLessonPlan, request: ModulePlanRequest): MinimalLessonPlan {
  return {
    unit: plan.unit,
    los: plan.los.map((loGroup) => {
      const lo = normalizeLo(loGroup.lo);
      const lessons = loGroup.lessons.map((lesson, index) => {
        const fallbackTopicCode = `${String(getLoNumber(lo))}${alphaIndex(index)}`;
        const normalizedTopicCode = normalizeTopicCode(lesson.topicCode, request.unit, lo);
        return {
          ...lesson,
          topicCode: normalizedTopicCode || fallbackTopicCode,
        };
      });
      return {
        lo,
        lessonCount: lessons.length,
        lessons,
      };
    }),
  };
}

function coerceMinimalLessonPlanShape(value: unknown, request: ModulePlanRequest): MinimalLessonPlan | null {
  const root = Array.isArray(value)
    ? { unit: request.unit, los: value }
    : isRecord(value)
      ? {
          unit: toCleanString(value.unit) ?? request.unit,
          los: Array.isArray(value.los)
            ? value.los
            : Array.isArray(value.plan)
              ? value.plan
              : Array.isArray(value.lessonPlan)
                ? value.lessonPlan
                : [],
        }
      : null;

  if (!root || root.los.length === 0) return null;

  const requestedLoOrder = request.selectedLos.map((lo) => normalizeLo(lo));
  const requestedLoSet = new Set(requestedLoOrder);
  const loOrder = new Map(requestedLoOrder.map((lo, idx) => [lo, idx]));

  const normalizedLos: MinimalLessonPlan['los'] = [];

  for (const loEntry of root.los) {
    if (!isRecord(loEntry)) continue;

    const rawLoTag =
      toCleanString(loEntry.lo) ??
      toCleanString(loEntry.learningOutcome) ??
      (toCleanString(loEntry.loNumber) ? `LO${toCleanString(loEntry.loNumber)}` : null);
    if (!rawLoTag) continue;

    const lo = normalizeLo(rawLoTag);
    if (!requestedLoSet.has(lo)) continue;

    const lessonRows = Array.isArray(loEntry.lessons)
      ? loEntry.lessons
      : Array.isArray(loEntry.lessonPlan)
        ? loEntry.lessonPlan
        : Array.isArray(loEntry.items)
          ? loEntry.items
          : [];

    const normalizedLessons: MinimalLessonPlan['los'][number]['lessons'] = [];

    for (let lessonIndex = 0; lessonIndex < lessonRows.length; lessonIndex += 1) {
      const lesson = lessonRows[lessonIndex];
      if (!isRecord(lesson)) continue;

      const coversAcKeys = toStringArray(
        lesson.coversAcKeys ??
          lesson.acKeys ??
          lesson.assessmentCriteriaKeys ??
          lesson.coverageKeys
      );
      if (coversAcKeys.length === 0) continue;

      const fallbackTopicCode = `${String(getLoNumber(lo))}${alphaIndex(lessonIndex)}`;
      const topicCodeRaw =
        toCleanString(lesson.topicCode) ??
        toCleanString(lesson.code) ??
        toCleanString(lesson.lessonCode) ??
        toCleanString(lesson.topic) ??
        fallbackTopicCode;
      const topicCode = normalizeTopicCode(topicCodeRaw, request.unit, lo) || fallbackTopicCode;

      const title =
        toCleanString(lesson.title) ??
        toCleanString(lesson.topic) ??
        toCleanString(lesson.name) ??
        `${lo} Lesson ${lessonIndex + 1}`;

      normalizedLessons.push({
        topicCode,
        title,
        coversAcKeys,
        whySplit: toCleanString(lesson.whySplit),
      });
    }

    if (normalizedLessons.length === 0) continue;
    normalizedLos.push({
      lo,
      lessonCount: normalizedLessons.length,
      lessons: normalizedLessons,
    });
  }

  if (normalizedLos.length === 0) return null;
  normalizedLos.sort((a, b) => (loOrder.get(a.lo) ?? Number.MAX_SAFE_INTEGER) - (loOrder.get(b.lo) ?? Number.MAX_SAFE_INTEGER));

  return {
    unit: root.unit,
    los: normalizedLos,
  };
}

function deriveMustHaveTopics(acTexts: string[]): string[] {
  const topics: string[] = [];
  for (const text of acTexts) {
    const normalized = normalizeCurriculumPhrase(text);
    if (!normalized) continue;
    const splitByColon = normalized.split(':').map((part) => part.trim()).filter(Boolean);
    if (splitByColon.length > 0) {
      topics.push(cleanConceptPhrase(splitByColon[0]));
      if (splitByColon.length > 1) {
        const enumerated = splitByColon
          .slice(1)
          .flatMap((part) => part.split(';'))
          .map((part) => cleanConceptPhrase(part))
          .filter((part) => part.length > 0);
        topics.push(...enumerated);
      }
    }
  }
  return unique(
    topics
      .map((topic) => topic.replace(/^and\s+/i, '').trim())
      .map((topic) => (topic.length > 90 ? `${topic.slice(0, 87).trim()}...` : topic))
      .filter((topic) => topic.length > 0)
  ).slice(0, 10);
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

type M4StoredArtifact = LessonBlueprint[] | M4BlueprintArtifact;

interface PlannedLessonForM4 {
  lo: string;
  topicCode: string;
  id: string;
  title: string;
  coversAcKeys: string[];
}

interface PlannedLoGroupForM4 {
  lo: string;
  lessons: PlannedLessonForM4[];
}

function toM4StoredArtifactValidator(value: unknown): value is M4StoredArtifact {
  return validateLessonBlueprints(value) || validateM4BlueprintArtifact(value);
}

function getBlueprintsFromM4StoredArtifact(value: M4StoredArtifact): LessonBlueprint[] {
  return Array.isArray(value) ? value : value.blueprints;
}

function buildM4StoredArtifact(
  unit: string,
  blueprints: LessonBlueprint[],
  loBlueprintSets: LoBlueprintSetArtifact[],
  loLedgers: LoLedgerArtifact[],
  lessonLedgerMetadata: LessonLedgerMetadata[]
): M4BlueprintArtifact {
  return {
    unit,
    generatedAt: new Date().toISOString(),
    blueprints,
    loBlueprintSets,
    loLedgers,
    lessonLedgerMetadata,
  };
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

    for (const lesson of loPlan.lessons) {
      const lessonAcCount = lesson.coversAcKeys.length;
      if (lessonAcCount > constraints.maxAcsPerLesson) {
        issues.push({
          stage: 'M3',
          severity: 'error',
          code: 'EXCEEDS_MAX_ACS_PER_LESSON',
          message: 'Lesson AC count exceeds configured ceiling.',
          meta: {
            lo,
            lessonTitle: lesson.title,
            lessonAcCount,
            maxAcsPerLesson: constraints.maxAcsPerLesson,
          },
        });
      }
      if (lessonAcCount > constraints.preferredAcsPerLesson) {
        issues.push({
          stage: 'M3',
          severity: 'warn',
          code: 'EXCEEDS_PREFERRED_ACS_PER_LESSON',
          message: 'Lesson AC count exceeds preferred target.',
          meta: {
            lo,
            lessonTitle: lesson.title,
            lessonAcCount,
            preferredAcsPerLesson: constraints.preferredAcsPerLesson,
          },
        });
      }
    }
  }

  return issues;
}

async function callM3PlannerLLM(params: {
  request: ModulePlanRequest;
  coverage: CoverageTargets;
  evidenceByLo: Record<string, string[]>;
  repairErrors?: ValidationIssue[];
  previousPlan?: MinimalLessonPlan;
}): Promise<M3LlmAttempt> {
  if (!getGeminiApiKey()) {
    return {
      plan: null,
      diagnostics: {
        failureReason: 'NO_API_KEY',
        model: null,
        finishReason: null,
        responseChars: 0,
        parseError: null,
        schemaValid: null,
        shapeCoerced: null,
        errorMessage: null,
        rawPreview: null,
      },
    };
  }

  let modelName: string;
  try {
    modelName = getGeminiModelWithDefault();
  } catch (error) {
    return {
      plan: null,
      diagnostics: {
        failureReason: 'NO_MODEL',
        model: null,
        finishReason: null,
        responseChars: 0,
        parseError: null,
        schemaValid: null,
        shapeCoerced: null,
        errorMessage: error instanceof Error ? error.message : 'GEMINI_MODEL is unavailable',
        rawPreview: null,
      },
    };
  }

  const diagnostics: M3LlmDiagnostics = {
    failureReason: 'LLM_EXCEPTION',
    model: modelName,
    finishReason: null,
    responseChars: 0,
    parseError: null,
    schemaValid: null,
    shapeCoerced: null,
    errorMessage: null,
    rawPreview: null,
  };

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
      `No lesson may contain more than ${params.request.constraints.maxAcsPerLesson} AC keys.`,
      `Prefer around ${params.request.constraints.preferredAcsPerLesson} AC keys per lesson when possible.`,
      'Top-level JSON must be object: {"unit":"string","los":[...]} (not an array).',
      'Each lesson must include keys: topicCode, title, coversAcKeys, whySplit.',
      'Output strict JSON only.',
    ],
  };

  try {
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

    const response = await model.generateContent(JSON.stringify(prompt));
    diagnostics.finishReason = response.response.candidates?.[0]?.finishReason ?? null;
    const rawText = response.response.text();
    diagnostics.responseChars = rawText.length;
    diagnostics.rawPreview = rawText.trim().length > 0 ? rawText.replace(/\s+/g, ' ').trim().slice(0, 500) : null;

    const raw = cleanCodeBlocks(rawText);
    if (raw.trim().length === 0) {
      diagnostics.failureReason = 'EMPTY_RESPONSE';
      return { plan: null, diagnostics };
    }

    const parsed = safeJsonParse<unknown>(preprocessToValidJson(raw));
    if (!parsed.success || !parsed.data) {
      diagnostics.failureReason = 'JSON_PARSE_FAIL';
      diagnostics.parseError = parsed.error ?? 'Unable to parse Gemini response as JSON.';
      return { plan: null, diagnostics };
    }
    let finalPlan: MinimalLessonPlan | null = null;
    if (validateMinimalLessonPlan(parsed.data)) {
      finalPlan = parsed.data;
      diagnostics.shapeCoerced = false;
    } else {
      finalPlan = coerceMinimalLessonPlanShape(parsed.data, params.request);
      diagnostics.shapeCoerced = finalPlan ? true : false;
    }

    if (!finalPlan || !validateMinimalLessonPlan(finalPlan)) {
      diagnostics.failureReason = 'JSON_SCHEMA_FAIL';
      diagnostics.schemaValid = false;
      return { plan: null, diagnostics };
    }

    const normalizedPlan = normalizePlanTopicCodes(finalPlan, params.request);
    if (!validateMinimalLessonPlan(normalizedPlan)) {
      diagnostics.failureReason = 'JSON_SCHEMA_FAIL';
      diagnostics.schemaValid = false;
      return { plan: null, diagnostics };
    }

    diagnostics.failureReason = 'OK';
    diagnostics.schemaValid = true;
    return { plan: normalizedPlan, diagnostics };
  } catch (error) {
    diagnostics.failureReason = 'LLM_EXCEPTION';
    diagnostics.errorMessage = error instanceof Error ? error.message : 'Unknown Gemini exception';
    return { plan: null, diagnostics };
  }
}

async function runM3WithRepair(request: ModulePlanRequest, m2: CoverageTargets): Promise<MinimalLessonPlan> {
  const evidenceByLo: Record<string, string[]> = {};
  for (const lo of request.selectedLos) {
    const loChunks = await getChunksForUnitLO(request.syllabusVersionId, request.unit, lo, 3);
    evidenceByLo[normalizeLo(lo)] = loChunks.map((chunk) => chunk.text.slice(0, 1200));
  }

  const initialAttempt = await callM3PlannerLLM({
    request,
    coverage: m2,
    evidenceByLo,
  });
  const initialPlan = initialAttempt.plan;
  if (!initialPlan) {
    console.warn('[M3] Initial Gemini planning attempt unusable', initialAttempt.diagnostics);
    throw new ModulePlannerError(
      'M3',
      'JSON_SCHEMA_FAIL',
      `Planning failed: Gemini response unusable (${formatM3DiagnosticsForMessage(initialAttempt.diagnostics)}).`,
      503,
      toM3DiagnosticsMeta(initialAttempt.diagnostics)
    );
  }

  const initialIssues = getPlanValidationIssues(m2, initialPlan, request.constraints);
  if (!hasBlockingPlanIssues(initialIssues)) return initialPlan;

  const repairAttempt = await callM3PlannerLLM({
    request,
    coverage: m2,
    evidenceByLo,
    repairErrors: initialIssues,
    previousPlan: initialPlan,
  });
  const repairedPlan = repairAttempt.plan;
  if (!repairedPlan) {
    console.warn('[M3] Gemini repair attempt unusable', repairAttempt.diagnostics);
    throw new ModulePlannerError(
      'M3',
      'JSON_SCHEMA_FAIL',
      `M3 plan invalid and repair attempt was unusable (${formatM3DiagnosticsForMessage(repairAttempt.diagnostics)}).`,
      400,
      toM3DiagnosticsMeta(repairAttempt.diagnostics)
    );
  }

  const repairedIssues = getPlanValidationIssues(m2, repairedPlan, request.constraints);
  if (hasBlockingPlanIssues(repairedIssues)) {
    throw new ModulePlannerError(
      'M3',
      'JSON_SCHEMA_FAIL',
      `M3 plan invalid after single repair attempt. ${formatPlanIssuesForError(repairedIssues)}`,
      400,
      {
        issueCount: repairedIssues.length,
        issues: JSON.stringify(repairedIssues),
      }
    );
  }
  return repairedPlan;
}

function buildPlannedLoGroupsForM4(m3: MinimalLessonPlan, request: ModulePlanRequest): PlannedLoGroupForM4[] {
  const groups = m3.los.map((loGroup) => {
    const lo = normalizeLo(loGroup.lo);
    const lessons = loGroup.lessons.map((lesson) => ({
      topicCode: normalizeTopicCode(lesson.topicCode, request.unit, lo),
      title: lesson.title,
      coversAcKeys: [...lesson.coversAcKeys],
    }));
    if (request.orderingPreference === 'foundation-first') {
      lessons.sort((a, b) => a.topicCode.localeCompare(b.topicCode));
    }
    const loNumber = getLoNumber(lo);
    return {
      lo,
      lessons: lessons.map((lesson, idx) => ({
        lo,
        topicCode: lesson.topicCode,
        id: `${request.unit}-${loNumber}${alphaIndex(idx)}`,
        title: lesson.title,
        coversAcKeys: lesson.coversAcKeys,
      })),
    };
  });

  if (request.orderingPreference === 'foundation-first') {
    groups.sort((a, b) => compareLoTag(a.lo, b.lo));
  }
  return groups;
}

function sameStringSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  return leftSorted.every((value, idx) => value === rightSorted[idx]);
}

interface LessonLedgerDelta {
  newTeachingConcepts: string[];
  newVocab: string[];
  outOfScopeTopics: string[];
  examplesUsed: string[];
  questionTypesUsed: string[];
}

interface LessonBlueprintDraftResult {
  blueprint: LessonBlueprint;
  ledgerDelta: LessonLedgerDelta;
}

interface LessonDraftExpectations {
  lessonId: string;
  unit: string;
  lo: string;
  topic: string;
  acAnchors: string[];
  level: string;
}

interface DuplicateLedgerOverlap {
  conceptOverlaps: string[];
  vocabOverlaps: string[];
}

interface PreviousBlueprintSummary {
  lessonId: string;
  topic: string;
  acAnchors: string[];
  newTeachingConcepts: string[];
  newVocab: string[];
  examplesUsed: string[];
  questionTypesUsed: string[];
}

function normalizeLedgerItem(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function sanitizeLedgerList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const item of items) {
    const normalized = normalizeLedgerItem(item);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    deduped.push(item);
  }
  return deduped;
}

function toConceptLedgerItems(values: string[]): string[] {
  return unique(
    values
      .map((value) => cleanConceptPhrase(value))
      .filter((value) => value.length > 0 && value.length <= 100)
  ).slice(0, 30);
}

function toVocabLedgerItems(values: string[]): string[] {
  const candidates = values
    .flatMap((value) =>
      cleanConceptPhrase(value)
        .split(/[,;|]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
    .map((item) => item.replace(/[().]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((item) => item.length > 0);

  return unique(
    candidates.filter((item) => {
      const wordCount = item.split(' ').length;
      return item.length <= 48 && wordCount <= 5;
    })
  ).slice(0, 20);
}

function mergeUniqueLedgerItems(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing.map((item) => normalizeLedgerItem(item)));
  const merged = [...existing];
  for (const item of incoming) {
    const normalized = normalizeLedgerItem(item);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    merged.push(item);
  }
  return merged;
}

function getLedgerOverlap(candidate: string[], existing: string[]): string[] {
  const existingNormalized = new Set(existing.map((item) => normalizeLedgerItem(item)));
  const overlaps: string[] = [];
  const seen = new Set<string>();
  for (const item of candidate) {
    const normalized = normalizeLedgerItem(item);
    if (!normalized || !existingNormalized.has(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    overlaps.push(item);
  }
  return overlaps;
}

function createEmptyLoLedger(): LoLedger {
  return {
    alreadyTaughtConcepts: [],
    taughtConcepts: [],
    taughtVocab: [],
    examplesUsed: [],
    questionTypesUsed: [],
    doNotTeach: [],
    lastUpdatedAt: new Date(0).toISOString(),
    sourceLessonIds: [],
  };
}

function deriveQuestionTypesFromBlueprint(blueprint: LessonBlueprint): string[] {
  const fromPracticeCounts = Object.entries(blueprint.masterBlueprint?.practiceSpec?.practiceCounts ?? {})
    .filter(([, count]) => typeof count === 'number' && count > 0)
    .map(([type]) => type);
  const understandingChecks = (blueprint.masterBlueprint?.checksSpec?.understandingChecks ?? []).length > 0 ? ['understanding-check'] : [];
  const integrative = blueprint.masterBlueprint?.checksSpec?.integrative ? ['integrative'] : [];
  return unique([...fromPracticeCounts, ...understandingChecks, ...integrative]);
}

function buildLedgerDeltaFromBlueprint(blueprint: LessonBlueprint): LessonLedgerDelta {
  const conceptSeeds = [
    ...sanitizeLedgerList(blueprint.masterBlueprint?.scopeControl?.inScope),
    ...sanitizeLedgerList(blueprint.mustHaveTopics),
    ...sanitizeLedgerList(blueprint.masterBlueprint?.anchors?.assessmentCriteria),
  ];
  const newTeachingConcepts = toConceptLedgerItems(conceptSeeds);
  const vocabSeeds = [
    ...sanitizeLedgerList(blueprint.masterBlueprint?.anchors?.rangeItems),
    ...newTeachingConcepts,
  ];
  const newVocab = toVocabLedgerItems(vocabSeeds);
  const outOfScopeTopics = toConceptLedgerItems(
    (blueprint.masterBlueprint?.scopeControl?.outOfScope ?? [])
      .filter((item) => item?.taughtInLessonId == null)
      .map((item) => item.topic)
  );
  const examplesUsed = unique(
    (blueprint.masterBlueprint?.blockPlan?.entries ?? [])
      .filter((entry) => entry.type === 'worked-example' || entry.type === 'guided-practice')
      .map((entry) => entry.label)
  );
  const questionTypesUsed = deriveQuestionTypesFromBlueprint(blueprint);
  return {
    newTeachingConcepts,
    newVocab,
    outOfScopeTopics,
    examplesUsed,
    questionTypesUsed,
  };
}

function toLessonLedgerMetadata(blueprint: LessonBlueprint, ledgerDelta: LessonLedgerDelta): LessonLedgerMetadata {
  return {
    lessonId: blueprint.id,
    lo: normalizeLo(blueprint.lo),
    newTeachingConcepts: toConceptLedgerItems(sanitizeLedgerList(ledgerDelta.newTeachingConcepts)),
    newVocab: toVocabLedgerItems(sanitizeLedgerList(ledgerDelta.newVocab)),
    outOfScopeTopics: toConceptLedgerItems(sanitizeLedgerList(ledgerDelta.outOfScopeTopics)),
    examplesUsed: sanitizeLedgerList(ledgerDelta.examplesUsed),
    questionTypesUsed: sanitizeLedgerList(ledgerDelta.questionTypesUsed),
  };
}

function applyLessonDeltaToLoLedger(ledger: LoLedger, metadata: LessonLedgerMetadata): LoLedger {
  const taughtConcepts = mergeUniqueLedgerItems(ledger.taughtConcepts, metadata.newTeachingConcepts);
  const taughtVocab = mergeUniqueLedgerItems(ledger.taughtVocab, metadata.newVocab);
  const doNotTeach = mergeUniqueLedgerItems(ledger.doNotTeach, metadata.outOfScopeTopics);
  return {
    alreadyTaughtConcepts: taughtConcepts,
    taughtConcepts,
    taughtVocab,
    examplesUsed: mergeUniqueLedgerItems(ledger.examplesUsed, metadata.examplesUsed),
    questionTypesUsed: mergeUniqueLedgerItems(ledger.questionTypesUsed, metadata.questionTypesUsed),
    doNotTeach,
    lastUpdatedAt: new Date().toISOString(),
    sourceLessonIds: mergeUniqueLedgerItems(ledger.sourceLessonIds, [metadata.lessonId]),
  };
}

function summarizePreviousBlueprint(
  blueprint: LessonBlueprint,
  metadata: LessonLedgerMetadata
): PreviousBlueprintSummary {
  return {
    lessonId: blueprint.id,
    topic: blueprint.topic,
    acAnchors: [...blueprint.acAnchors],
    newTeachingConcepts: [...metadata.newTeachingConcepts],
    newVocab: [...metadata.newVocab],
    examplesUsed: [...metadata.examplesUsed],
    questionTypesUsed: [...metadata.questionTypesUsed],
  };
}

function withBlueprintPrerequisites(blueprint: LessonBlueprint, prerequisites: string[]): LessonBlueprint {
  if (!blueprint.masterBlueprint) {
    return {
      ...blueprint,
      prerequisites,
    };
  }
  return {
    ...blueprint,
    prerequisites,
    masterBlueprint: {
      ...blueprint.masterBlueprint,
      identity: {
        ...blueprint.masterBlueprint.identity,
        prerequisites,
      },
    },
  };
}

function buildDeterministicBlueprintForPlannedLesson(params: {
  request: ModulePlanRequest;
  lesson: PlannedLessonForM4;
  allPlannedLessons: PlannedLessonForM4[];
  acTextByKey: Map<string, string>;
  rangeByAcKey: Map<string, string[]>;
}): LessonBlueprint {
  const acTexts = params.lesson.coversAcKeys
    .map((key) => params.acTextByKey.get(key) ?? '')
    .filter((text) => text.length > 0);
  const mustHaveTopics = deriveMustHaveTopics(acTexts);
  const outOfScope = params.allPlannedLessons
    .filter((planned) => planned.lo === params.lesson.lo && planned.id !== params.lesson.id)
    .map((planned) => ({ topic: planned.title, taughtInLessonId: planned.id }));
  const rangeItems = params.lesson.coversAcKeys
    .flatMap((acKey) => params.rangeByAcKey.get(acKey) ?? [])
    .filter((item) => item.trim().length > 0);

  const masterBlueprint = buildMasterLessonBlueprint({
    lessonId: params.lesson.id,
    unit: params.request.unit,
    lo: params.lesson.lo,
    topic: params.lesson.title,
    layout: chooseLayout(params.lesson.title, acTexts),
    audience: params.request.constraints.audience,
    prerequisites: [],
    acAnchors: [...params.lesson.coversAcKeys],
    acTexts,
    rangeItems,
    inScopeTopics: mustHaveTopics.length > 0 ? mustHaveTopics : acTexts,
    outOfScopeTopics: outOfScope,
  });

  return {
    id: params.lesson.id,
    unit: params.request.unit,
    lo: params.lesson.lo,
    acAnchors: [...params.lesson.coversAcKeys],
    topic: params.lesson.title,
    mustHaveTopics,
    level: params.request.constraints.level,
    layout: masterBlueprint.identity.layout,
    prerequisites: masterBlueprint.identity.prerequisites,
    masterBlueprint,
  };
}

function validateLessonDraftBlueprintAgainstPlan(params: {
  request: ModulePlanRequest;
  lo: string;
  plannedLesson: PlannedLessonForM4;
  candidateBlueprint: LessonBlueprint;
}): string[] {
  const errors: string[] = [];
  const blueprint = params.candidateBlueprint;
  const plannedLesson = params.plannedLesson;
  if (blueprint.id !== plannedLesson.id) {
    errors.push(`blueprint id mismatch (expected ${plannedLesson.id})`);
  }
  if (blueprint.unit !== params.request.unit) {
    errors.push(`unit mismatch for ${blueprint.id} (expected ${params.request.unit})`);
  }
  if (normalizeLo(blueprint.lo) !== params.lo) {
    errors.push(`LO mismatch for ${blueprint.id} (expected ${params.lo})`);
  }
  if (blueprint.topic !== plannedLesson.title) {
    errors.push(`topic mismatch for ${blueprint.id} (expected "${plannedLesson.title}")`);
  }
  if (!sameStringSet(blueprint.acAnchors, plannedLesson.coversAcKeys)) {
    errors.push(`acAnchors mismatch for ${blueprint.id}`);
  }
  if (!blueprint.masterBlueprint) {
    errors.push(`masterBlueprint missing for ${blueprint.id}`);
    return errors;
  }
  const contractErrors = validateMasterLessonBlueprintContract(blueprint.masterBlueprint, blueprint.id);
  for (const contractError of contractErrors) {
    errors.push(`${blueprint.id}: ${contractError}`);
  }
  if (!sameStringSet(blueprint.masterBlueprint.anchors.acAnchors ?? [], plannedLesson.coversAcKeys)) {
    errors.push(`masterBlueprint.anchors.acAnchors mismatch for ${blueprint.id}`);
  }
  return errors;
}

function getDuplicateLedgerOverlap(metadata: LessonLedgerMetadata, loLedger: LoLedger): DuplicateLedgerOverlap {
  return {
    conceptOverlaps: getLedgerOverlap(metadata.newTeachingConcepts, loLedger.taughtConcepts),
    vocabOverlaps: getLedgerOverlap(metadata.newVocab, loLedger.taughtVocab),
  };
}

function buildDuplicateLedgerErrors(metadata: LessonLedgerMetadata, loLedger: LoLedger): string[] {
  const overlap = getDuplicateLedgerOverlap(metadata, loLedger);
  const errors: string[] = [];
  if (overlap.conceptOverlaps.length > 0) {
    errors.push(
      `DUPLICATES_PRIOR_LO_CONTENT concepts for ${metadata.lessonId}: ${overlap.conceptOverlaps.join(', ')} (ledger has ${loLedger.sourceLessonIds.join(', ') || 'none'})`
    );
  }
  if (overlap.vocabOverlaps.length > 0) {
    errors.push(
      `DUPLICATES_PRIOR_LO_CONTENT vocab for ${metadata.lessonId}: ${overlap.vocabOverlaps.join(', ')} (ledger has ${loLedger.sourceLessonIds.join(', ') || 'none'})`
    );
  }
  return errors;
}

function stripDuplicateLedgerItems(metadata: LessonLedgerMetadata, loLedger: LoLedger): LessonLedgerMetadata {
  const conceptOverlap = new Set(getLedgerOverlap(metadata.newTeachingConcepts, loLedger.taughtConcepts).map(normalizeLedgerItem));
  const vocabOverlap = new Set(getLedgerOverlap(metadata.newVocab, loLedger.taughtVocab).map(normalizeLedgerItem));
  return {
    ...metadata,
    newTeachingConcepts: metadata.newTeachingConcepts.filter((item) => !conceptOverlap.has(normalizeLedgerItem(item))),
    newVocab: metadata.newVocab.filter((item) => !vocabOverlap.has(normalizeLedgerItem(item))),
  };
}

function parseLessonLedgerDelta(value: unknown, blueprint: LessonBlueprint): LessonLedgerDelta {
  const fallback = buildLedgerDeltaFromBlueprint(blueprint);
  if (!isRecord(value)) return fallback;
  return {
    newTeachingConcepts: sanitizeLedgerList(value.newTeachingConcepts ?? fallback.newTeachingConcepts),
    newVocab: sanitizeLedgerList(value.newVocab ?? fallback.newVocab),
    outOfScopeTopics: sanitizeLedgerList(value.outOfScopeTopics ?? value.doNotTeach ?? fallback.outOfScopeTopics),
    examplesUsed: sanitizeLedgerList(value.examplesUsed ?? fallback.examplesUsed),
    questionTypesUsed: sanitizeLedgerList(value.questionTypesUsed ?? fallback.questionTypesUsed),
  };
}

function tryParseJsonLoose(raw: string): unknown | null {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return null;
  const candidates = new Set<string>([trimmed]);

  const firstObject = trimmed.indexOf('{');
  const lastObject = trimmed.lastIndexOf('}');
  if (firstObject >= 0 && lastObject > firstObject) {
    candidates.add(trimmed.slice(firstObject, lastObject + 1));
  }

  const firstArray = trimmed.indexOf('[');
  const lastArray = trimmed.lastIndexOf(']');
  if (firstArray >= 0 && lastArray > firstArray) {
    candidates.add(trimmed.slice(firstArray, lastArray + 1));
  }

  for (const candidate of candidates) {
    const parsed = safeJsonParse<unknown>(preprocessToValidJson(candidate));
    if (parsed.success && parsed.data) {
      return parsed.data;
    }
  }
  return null;
}

function coerceLessonBlueprintCandidate(value: unknown, expected: LessonDraftExpectations): LessonBlueprint | null {
  if (validateLessonBlueprints([value])) {
    return (value as LessonBlueprint[])[0];
  }
  if (!isRecord(value)) return null;

  const masterBlueprintCandidate = isRecord(value.masterBlueprint)
    ? value.masterBlueprint
    : isRecord(value.master_blueprint)
      ? value.master_blueprint
      : isRecord(value.master)
        ? value.master
        : null;

  const layoutCandidate =
    toCleanString(value.layout) ??
    (masterBlueprintCandidate && isRecord(masterBlueprintCandidate.identity)
      ? toCleanString(masterBlueprintCandidate.identity.layout)
      : null);
  const layout = layoutCandidate === 'split-vis' || layoutCandidate === 'linear-flow' ? layoutCandidate : 'linear-flow';

  const acAnchors = toStringArray(value.acAnchors ?? value.coversAcKeys ?? value.covers_ac_keys);
  const mustHaveTopics = toStringArray(value.mustHaveTopics ?? value.must_have_topics);
  const prerequisites = toStringArray(value.prerequisites);
  const topic = toCleanString(value.topic ?? value.title) ?? expected.topic;

  const candidate: LessonBlueprint = {
    id: toCleanString(value.id) ?? expected.lessonId,
    unit: toCleanString(value.unit) ?? expected.unit,
    lo: normalizeLo(toCleanString(value.lo) ?? expected.lo),
    acAnchors: acAnchors.length > 0 ? acAnchors : [...expected.acAnchors],
    topic,
    mustHaveTopics: mustHaveTopics.length > 0 ? mustHaveTopics : deriveMustHaveTopics([topic]),
    level: toCleanString(value.level) ?? expected.level,
    layout,
    prerequisites,
    masterBlueprint: (masterBlueprintCandidate as unknown as LessonBlueprint['masterBlueprint']) ?? undefined,
  };

  if (!validateLessonBlueprints([candidate])) return null;
  return candidate;
}

function parseSingleLessonDraftResult(data: unknown, expected: LessonDraftExpectations): LessonBlueprintDraftResult | null {
  let blueprintCandidate: unknown = data;
  let ledgerDeltaCandidate: unknown = undefined;

  if (Array.isArray(data)) {
    blueprintCandidate =
      data.find((item) => isRecord(item) && typeof item.id === 'string' && item.id === expected.lessonId) ?? data[0];
  }

  if (isRecord(data)) {
    if (Array.isArray(data.blueprints)) {
      blueprintCandidate =
        data.blueprints.find((item) => isRecord(item) && typeof item.id === 'string' && item.id === expected.lessonId) ??
        data.blueprints[0];
    } else if (data.blueprint) {
      blueprintCandidate = data.blueprint;
    } else if (Array.isArray(data.lessonBlueprints)) {
      blueprintCandidate =
        data.lessonBlueprints.find((item) => isRecord(item) && typeof item.id === 'string' && item.id === expected.lessonId) ??
        data.lessonBlueprints[0];
    }
    ledgerDeltaCandidate = data.ledgerDelta ?? data.loLedgerDelta ?? undefined;
  }

  const blueprint = coerceLessonBlueprintCandidate(blueprintCandidate, expected);
  if (!blueprint) return null;
  const ledgerDelta = parseLessonLedgerDelta(ledgerDeltaCandidate, blueprint);
  return { blueprint, ledgerDelta };
}

async function callM4LessonBlueprintDraftLLM(params: {
  request: ModulePlanRequest;
  lo: string;
  canonicalCoverage: CoverageTarget[];
  loPlanLessons: PlannedLessonForM4[];
  lesson: PlannedLessonForM4;
  loLedger: LoLedger;
  previousLessonSummary?: PreviousBlueprintSummary;
  repairErrors?: string[];
  previousDraft?: LessonBlueprintDraftResult;
}): Promise<LessonBlueprintDraftResult | null> {
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
      'You are Module Planner M4 LO Blueprint Drafter. Output strict JSON only. Build master-blueprint contracts without inventing AC anchors.',
  });

  const contextPayload = {
    mode: params.repairErrors ? 'repair' : 'draft',
    unit: params.request.unit,
    lo: params.lo,
    level: params.request.constraints.level,
    audience: params.request.constraints.audience,
    orderingPreference: params.request.orderingPreference,
    canonicalCoverage: params.canonicalCoverage,
    loPlan: {
      lessonCount: params.loPlanLessons.length,
      lessons: params.loPlanLessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        coversAcKeys: lesson.coversAcKeys,
      })),
    },
    loLedger: params.loLedger,
    previousLessonSummary: params.previousLessonSummary ?? null,
    previousDraft: params.previousDraft ?? null,
    repairErrors: params.repairErrors ?? [],
  };
  const instructionPayload = {
    task: 'Generate one MasterLessonBlueprint for the requested lesson only.',
    lessonId: params.lesson.id,
    lessonTitle: params.lesson.title,
    coversAcKeys: params.lesson.coversAcKeys,
    hardRules: [
      'Return exactly one blueprint matching lessonId.',
      'Blueprint acAnchors must exactly match coversAcKeys.',
      'loLedger.alreadyTaughtConcepts are already covered in this LO; avoid re-teaching and use recap/reference instead.',
      'You may not introduce NEW teaching that duplicates loLedger.alreadyTaughtConcepts.',
      'loLedger.doNotTeach are explicit out-of-scope topics and must never be taught.',
      'Recap is allowed only as Recap and max 4 bullets.',
      'If content exists in loLedger.alreadyTaughtConcepts, reference earlier lessonId instead of re-teaching.',
      'Do not repeat example types or question scenario styles already listed in loLedger unless explicitly necessary.',
      'Each masterBlueprint must satisfy the fixed contract and include explicit outOfScope links to sibling lessons.',
      'Output strict JSON only.',
    ],
    outputShape: {
      blueprint: {
        id: 'string',
        unit: 'string',
        lo: 'string',
        acAnchors: ['string'],
        topic: 'string',
        mustHaveTopics: ['string'],
        level: 'string',
        layout: 'split-vis|linear-flow',
        prerequisites: ['string'],
        masterBlueprint: 'MasterLessonBlueprint object (fixed contract)',
      },
      ledgerDelta: {
        newTeachingConcepts: ['string'],
        newVocab: ['string'],
        outOfScopeTopics: ['string'],
        examplesUsed: ['string'],
        questionTypesUsed: ['string'],
      },
    },
  };

  const expected: LessonDraftExpectations = {
    lessonId: params.lesson.id,
    unit: params.request.unit,
    lo: params.lo,
    topic: params.lesson.title,
    acAnchors: [...params.lesson.coversAcKeys],
    level: params.request.constraints.level,
  };

  let lastRaw = '';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: JSON.stringify(contextPayload) }] },
          { role: 'user', parts: [{ text: JSON.stringify(instructionPayload) }] },
          ...(attempt > 0
            ? [
                {
                  role: 'user' as const,
                  parts: [{ text: 'Retry. Return strict JSON object only. Do not include markdown fences or commentary.' }],
                },
              ]
            : []),
        ],
      });
      const raw = cleanCodeBlocks(response.response.text());
      lastRaw = raw;
      const parsed = tryParseJsonLoose(raw);
      if (!parsed) {
        continue;
      }
      const draft = parseSingleLessonDraftResult(parsed, expected);
      if (draft) {
        return draft;
      }
    } catch (error) {
      if (attempt >= 2) {
        console.warn('[M4] LLM draft call failed', {
          lessonId: params.lesson.id,
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  console.warn('[M4] LLM draft parse/shape validation failed', {
    lessonId: params.lesson.id,
    rawPreview: lastRaw.slice(0, 240),
  });
  return null;
}

async function runM4LessonDraftWithRepair(params: {
  request: ModulePlanRequest;
  lo: string;
  canonicalCoverage: CoverageTarget[];
  loPlanLessons: PlannedLessonForM4[];
  lesson: PlannedLessonForM4;
  loLedger: LoLedger;
  previousLessonSummary?: PreviousBlueprintSummary;
}): Promise<LessonBlueprintDraftResult | null> {
  const initial = await callM4LessonBlueprintDraftLLM({
    request: params.request,
    lo: params.lo,
    canonicalCoverage: params.canonicalCoverage,
    loPlanLessons: params.loPlanLessons,
    lesson: params.lesson,
    loLedger: params.loLedger,
    previousLessonSummary: params.previousLessonSummary,
  });
  if (!initial) return null;

  const initialErrors = validateLessonDraftBlueprintAgainstPlan({
    request: params.request,
    lo: params.lo,
    plannedLesson: params.lesson,
    candidateBlueprint: initial.blueprint,
  });
  if (initialErrors.length === 0) return initial;

  const repaired = await callM4LessonBlueprintDraftLLM({
    request: params.request,
    lo: params.lo,
    canonicalCoverage: params.canonicalCoverage,
    loPlanLessons: params.loPlanLessons,
    lesson: params.lesson,
    loLedger: params.loLedger,
    previousLessonSummary: params.previousLessonSummary,
    repairErrors: initialErrors.slice(0, 30),
    previousDraft: initial,
  });
  if (!repaired) return null;

  const repairedErrors = validateLessonDraftBlueprintAgainstPlan({
    request: params.request,
    lo: params.lo,
    plannedLesson: params.lesson,
    candidateBlueprint: repaired.blueprint,
  });
  if (repairedErrors.length > 0) return null;
  return repaired;
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

function validateLoLedgerProgression(issues: ValidationIssue[], blueprints: LessonBlueprint[], metadata: LessonLedgerMetadata[]): void {
  const metadataByLessonId = new Map(metadata.map((entry) => [entry.lessonId, entry]));
  const loLedgers = new Map<string, LoLedger>();
  for (const blueprint of blueprints) {
    const lo = normalizeLo(blueprint.lo);
    const lessonMetadata = metadataByLessonId.get(blueprint.id);
    if (!lessonMetadata) continue;
    const ledger = loLedgers.get(lo) ?? createEmptyLoLedger();
    const overlap = getDuplicateLedgerOverlap(lessonMetadata, ledger);
    if (overlap.conceptOverlaps.length > 0 || overlap.vocabOverlaps.length > 0) {
      pushIssue(issues, {
        stage: 'M5',
        severity: 'error',
        code: 'DUPLICATES_PRIOR_LO_CONTENT',
        message: 'Lesson introduces LO content already taught in earlier LO lesson.',
        meta: {
          blueprintId: blueprint.id,
          lo,
          conceptOverlaps: overlap.conceptOverlaps.join(', ') || null,
          vocabOverlaps: overlap.vocabOverlaps.join(', ') || null,
        },
      });
    }
    loLedgers.set(lo, applyLessonDeltaToLoLedger(ledger, lessonMetadata));
  }
}

function validateM4FallbackUsage(issues: ValidationIssue[], loBlueprintSets: LoBlueprintSetArtifact[]): void {
  for (const set of loBlueprintSets) {
    if (set.generatedBy !== 'fallback') continue;
    pushIssue(issues, {
      stage: 'M4',
      severity: 'warn',
      code: 'BLUEPRINT_GENERATION_MISMATCH',
      message: 'LO blueprint generation used deterministic fallback instead of primary LLM drafting.',
      meta: {
        lo: set.lo,
        lessonCount: set.blueprints.length,
      },
    });
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
  const chunksByLo = new Map<string, Awaited<ReturnType<typeof getChunksForUnitLO>>>();
  const missingLos: string[] = [];
  const chunkIds: string[] = [];
  const records = [];

  for (const lo of selectedLos) {
    const chunks = await getChunksForUnitLO(request.syllabusVersionId, request.unit, lo, 3);
    if (chunks.length === 0) {
      missingLos.push(lo);
      continue;
    }
    chunksByLo.set(lo, chunks);
    chunkIds.push(...chunks.map((chunk) => chunk.id));
    records.push(...toRetrievedChunkRecords(chunks));
  }

  if (missingLos.length > 0) {
    throw new ModulePlannerError(
      'M1',
      'RAG_EMPTY',
      `M1 retrieval returned no chunks for selected LOs: ${missingLos.join(', ')}`,
      400,
      {
        missingLos: missingLos.join(', '),
        selectedLos: selectedLos.join(', '),
      }
    );
  }

  const fallbackUnitTitle = `Unit ${request.unit}`;
  const structureUnitTitle = String(structure.structure_json.unitTitle ?? '').trim();
  const loTitles = selectedLos
    .map((lo) => {
      const loNumber = String(getLoNumber(lo));
      return String(structure.structure_json.los.find((entry) => entry.loNumber === loNumber)?.title ?? '').trim().toLowerCase();
    })
    .filter((title) => title.length > 0);
  const recordTitles = records
    .map((record) => String(record.unitTitle ?? '').trim())
    .filter((title) => title.length > 0);
  const strongCandidates = recordTitles.filter(
    (title) =>
      title.toLowerCase() !== fallbackUnitTitle.toLowerCase() &&
      !looksLikeLoHeading(title) &&
      !loTitles.includes(title.toLowerCase())
  );
  const neutralCandidates = recordTitles.filter((title) => !looksLikeLoHeading(title));
  const hasExplicitStructureUnitTitle =
    structureUnitTitle.length > 0 &&
    !looksLikeLoHeading(structureUnitTitle) &&
    !loTitles.includes(structureUnitTitle.toLowerCase());
  const preferredUnitTitle =
    (hasExplicitStructureUnitTitle ? structureUnitTitle : null) ??
    pickMostFrequent(strongCandidates) ??
    pickMostFrequent(neutralCandidates) ??
    pickMostFrequent(recordTitles) ??
    fallbackUnitTitle;

  const output: UnitStructure = {
    unit: request.unit,
    unitTitle: preferredUnitTitle,
    los: selectedLos.map((lo) => {
      const loNumber = String(getLoNumber(lo));
      const loStruct = structure.structure_json.los.find((entry) => entry.loNumber === loNumber);
      return {
        lo,
        title: loStruct?.title ?? lo,
        sourceChunkIds: unique((chunksByLo.get(lo) ?? []).map((chunk) => chunk.id)),
      };
    }),
  };

  if (!validateUnitStructure(output)) {
    throw new ModulePlannerError('M1', 'JSON_SCHEMA_FAIL', 'M1 output failed schema validation.', 400);
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
      const loRecords = records.filter((record) => normalizeLo(record.learningOutcome) === lo);
      const sourceChunkIds = loRecords.map((record) => record.id);
      const coverageTargets: CoverageTarget[] = loStruct.acs.map((ac) => ({
        acKey: ac.acKey,
        acText: enrichCoverageAcTextFromRecords({
          acNumber: ac.acNumber,
          acText: ac.text ?? ac.acKey,
          loRecords,
        }),
        range: ac.range ?? loStruct.range ?? null,
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
  await upsertArtifactAndStatus(runId, 'M3', output);
  return { stage: 'M3', replayed: false, artifact: output };
}

export async function runM4Blueprints(
  runId: string,
  options: StageReplayOptions = {}
): Promise<StageExecutionResult<LessonBlueprint[]>> {
  const run = await requireRun(runId);
  const request = requireRequest(run);
  const replayed = await stageReplay(run, 'M4', options, toM4StoredArtifactValidator);
  if (replayed) {
    return { stage: 'M4', replayed: true, artifact: getBlueprintsFromM4StoredArtifact(replayed) };
  }

  const m2 = await getTypedStageArtifact(runId, 'M2', toCoverageTargetsValidator);
  const m3 = await getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);

  const acTextByKey = new Map<string, string>();
  const rangeByAcKey = new Map<string, string[]>();
  const coverageByLo = new Map<string, CoverageTarget[]>();
  m2.los.forEach((lo) => {
    const normalizedLo = normalizeLo(lo.lo);
    coverageByLo.set(normalizedLo, lo.coverageTargets);
    lo.coverageTargets.forEach((target) => {
      acTextByKey.set(target.acKey, target.acText);
      rangeByAcKey.set(target.acKey, toRangeList(target.range));
    });
  });

  const plannedLoGroups = buildPlannedLoGroupsForM4(m3, request);
  const allPlannedLessons = plannedLoGroups.flatMap((group) => group.lessons);
  const loBlueprintSets: LoBlueprintSetArtifact[] = [];
  const loLedgers: LoLedgerArtifact[] = [];
  const lessonLedgerMetadata: LessonLedgerMetadata[] = [];

  for (const loGroup of plannedLoGroups) {
    const canonicalCoverage = coverageByLo.get(loGroup.lo) ?? [];
    const generatedBlueprints: LessonBlueprint[] = [];
    let loLedger = createEmptyLoLedger();
    let previousLessonSummary: PreviousBlueprintSummary | undefined;
    let usedFallback = false;

    for (const lesson of loGroup.lessons) {
      const llmDraft = await runM4LessonDraftWithRepair({
        request,
        lo: loGroup.lo,
        canonicalCoverage,
        loPlanLessons: loGroup.lessons,
        lesson,
        loLedger,
        previousLessonSummary,
      });

      let blueprint: LessonBlueprint;
      let metadata: LessonLedgerMetadata;

      if (llmDraft) {
        blueprint = llmDraft.blueprint;
        metadata = stripDuplicateLedgerItems(toLessonLedgerMetadata(blueprint, llmDraft.ledgerDelta), loLedger);
      } else {
        usedFallback = true;
        blueprint = buildDeterministicBlueprintForPlannedLesson({
          request,
          lesson,
          allPlannedLessons,
          acTextByKey,
          rangeByAcKey,
        });
        metadata = stripDuplicateLedgerItems(toLessonLedgerMetadata(blueprint, buildLedgerDeltaFromBlueprint(blueprint)), loLedger);
      }

      generatedBlueprints.push(blueprint);
      lessonLedgerMetadata.push(metadata);
      loLedger = applyLessonDeltaToLoLedger(loLedger, metadata);
      previousLessonSummary = summarizePreviousBlueprint(blueprint, metadata);
    }

    loBlueprintSets.push({
      lo: loGroup.lo,
      generatedBy: usedFallback ? 'fallback' : 'llm',
      blueprints: generatedBlueprints,
    });
    loLedgers.push({ lo: loGroup.lo, ledger: loLedger });
  }

  const blueprintById = new Map(loBlueprintSets.flatMap((set) => set.blueprints).map((blueprint) => [blueprint.id, blueprint]));
  const orderedBlueprints: LessonBlueprint[] = [];
  for (const lesson of allPlannedLessons) {
    const blueprint = blueprintById.get(lesson.id);
    if (blueprint) {
      orderedBlueprints.push(blueprint);
      continue;
    }
    orderedBlueprints.push(
      buildDeterministicBlueprintForPlannedLesson({
        request,
        lesson,
        allPlannedLessons,
        acTextByKey,
        rangeByAcKey,
      })
    );
  }

  const blueprints = orderedBlueprints.map((blueprint, index) => {
    const prerequisites =
      request.orderingPreference === 'foundation-first' && index > 0 ? [orderedBlueprints[index - 1].id] : [];
    return withBlueprintPrerequisites(blueprint, prerequisites);
  });

  const sequencedById = new Map(blueprints.map((blueprint) => [blueprint.id, blueprint]));
  const finalizedLoSets: LoBlueprintSetArtifact[] = loBlueprintSets.map((set) => ({
    ...set,
    blueprints: set.blueprints
      .map((blueprint) => sequencedById.get(blueprint.id))
      .filter((item): item is LessonBlueprint => Boolean(item)),
  }));

  if (!validateLessonBlueprints(blueprints)) {
    throw new ModulePlannerError('M4', 'JSON_SCHEMA_FAIL', 'M4 output failed schema validation.', 400);
  }
  const storedArtifact = buildM4StoredArtifact(request.unit, blueprints, finalizedLoSets, loLedgers, lessonLedgerMetadata);
  if (!validateM4BlueprintArtifact(storedArtifact)) {
    throw new ModulePlannerError('M4', 'JSON_SCHEMA_FAIL', 'M4 stored artifact failed schema validation.', 400);
  }

  for (const blueprint of blueprints) {
    await upsertRunLesson({
      runId,
      blueprintId: blueprint.id,
      lessonId: blueprint.id,
      status: 'planned',
      error: null,
      lessonJson: null,
    });
  }

  await upsertArtifactAndStatus(runId, 'M4', storedArtifact, {
    retrievedChunkIds: plannedLoGroups.map((group) => group.lo),
  });
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
  const m3 = await getTypedStageArtifact(runId, 'M3', toMinimalLessonPlanValidator);
  const m4Stored = await getTypedStageArtifact(runId, 'M4', toM4StoredArtifactValidator);
  const m4 = getBlueprintsFromM4StoredArtifact(m4Stored);
  const m4LessonLedgerMetadata = Array.isArray(m4Stored) ? [] : m4Stored.lessonLedgerMetadata ?? [];

  const issues: ValidationIssue[] = [];
  issues.push(...getPlanValidationIssues(m2, m3, request.constraints));

  validateM4AgainstM3AndM2(issues, m2, m3, m4);
  if (m4LessonLedgerMetadata.length > 0) {
    validateLoLedgerProgression(issues, m4, m4LessonLedgerMetadata);
  }
  if (!Array.isArray(m4Stored)) {
    validateM4FallbackUsage(issues, m4Stored.loBlueprintSets ?? []);
  }

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
          lessonJson: buildPersistedLessonPayload(result),
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

function readGeneratedLessonJson(lessonFile?: string): unknown | null {
  if (!lessonFile) return null;
  try {
    const safeFile = path.basename(lessonFile);
    const lessonPath = path.join(process.cwd(), 'src', 'data', 'lessons', safeFile);
    if (!fs.existsSync(lessonPath)) return null;
    const raw = fs.readFileSync(lessonPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildPersistedLessonPayload(result: {
  response: BlueprintGenerationResult['response'];
  lessonId: string;
}): Record<string, unknown> {
  const lessonFile = result.response.lessonFile ?? null;
  return {
    lessonId: result.lessonId,
    lessonFile,
    generatedAt: new Date().toISOString(),
    generatorResponse: result.response,
    generatedLesson: readGeneratedLessonJson(result.response.lessonFile),
  };
}

export async function runM6GenerateLesson(
  runId: string,
  blueprintId: string,
  options: { apiBaseUrl: string }
): Promise<{ lessonId: string; status: 'generated' | 'failed'; error: string | null }> {
  await requireRun(runId);
  const validation = await getTypedStageArtifact(runId, 'M5', toValidationResultValidator);
  if (!validation.valid) {
    throw new ModulePlannerError('M6', 'JSON_SCHEMA_FAIL', 'M5 validation failed. Generation cannot proceed.', 400);
  }

  const m4Stored = await getTypedStageArtifact(runId, 'M4', toM4StoredArtifactValidator);
  const blueprints = getBlueprintsFromM4StoredArtifact(m4Stored);
  const blueprint = blueprints.find((item) => item.id === blueprintId);
  if (!blueprint) {
    throw new ModulePlannerError('M6', 'JSON_SCHEMA_FAIL', `Blueprint not found: ${blueprintId}`, 404);
  }

  await upsertRunLesson({
    runId,
    blueprintId: blueprint.id,
    lessonId: blueprint.id,
    status: 'pending',
    error: null,
  });

  try {
    const result = await generateLessonFromBlueprint(blueprint, { apiBaseUrl: options.apiBaseUrl });
    await upsertRunLesson({
      runId,
      blueprintId: blueprint.id,
      lessonId: result.lessonId,
      status: 'success',
      error: null,
      lessonJson: buildPersistedLessonPayload(result),
    });
    const lessons = await listRunLessons(runId);
    const summary: GenerateSummary = {
      generated: lessons.filter((row) => row.status === 'success').length,
      failed: lessons.filter((row) => row.status === 'failed').length,
      lessonIds: lessons.filter((row) => row.status === 'success').map((row) => row.lesson_id),
    };
    await upsertArtifactAndStatus(runId, 'M6', summary);
    return { lessonId: result.lessonId, status: 'generated', error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown generation failure';
    await upsertRunLesson({
      runId,
      blueprintId: blueprint.id,
      lessonId: blueprint.id,
      status: 'failed',
      error: message,
    });
    const lessons = await listRunLessons(runId);
    const summary: GenerateSummary = {
      generated: lessons.filter((row) => row.status === 'success').length,
      failed: lessons.filter((row) => row.status === 'failed').length,
      lessonIds: lessons.filter((row) => row.status === 'success').map((row) => row.lesson_id),
    };
    await upsertArtifactAndStatus(runId, 'M6', summary);
    return { lessonId: blueprint.id, status: 'failed', error: message };
  }
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
  const m4Stored = await getTypedStageArtifact(runId, 'M4', toM4StoredArtifactValidator);
  const blueprints = getBlueprintsFromM4StoredArtifact(m4Stored);

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
