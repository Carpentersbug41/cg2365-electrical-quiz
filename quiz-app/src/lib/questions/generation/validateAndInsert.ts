import { createLLMClient } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { computeQuestionHash } from '../hash';
import { insertDraftQuestions, listApprovedQuestionsByScope } from '../bankRepo';
import { GeneratedQuestionDraftInput, QuestionBlueprint, QuestionGenerationRun, SyllabusAssessmentCriteria } from '../types';
import { validateQuestionDraft } from '../validation';
import { findNearDuplicate, QuestionSimilarityLike, toSimilarityLike } from '../similarity';
import { createBatchGenerationPrompt, createSingleQuestionPrompt } from './promptBuilder';
import { evaluateQuestionAlignment } from '../alignment';

export interface ValidateInsertResult {
  created_count: number;
  failed_count: number;
  failures: Array<{ blueprint_index: number; reasons: string[] }>;
  inserted_question_ids: string[];
  llm_used_count: number;
  repair_retry_count: number;
  fallback_count: number;
  processed_blueprints: number;
  total_blueprints: number;
  timed_out: boolean;
  max_duration_ms: number | null;
  debug: {
    batch_lo_groups: number;
    batch_llm_calls: number;
    batch_prehandled_blueprints: number;
    single_path_blueprints: number;
    batch_reports: Array<{
      lo_code: string;
      target_count: number;
      parsed_count: number;
      accepted_count: number;
      valid_count: number;
      invalid_count: number;
      alignment_pass_count: number;
      alignment_fail_count: number;
      near_dup_reject_count: number;
      attempt_summary: string[];
      accepted_questions: BatchGeneratedQuestion[];
      attempted_questions: BatchGeneratedQuestion[];
    }>;
  };
}

export interface LlmGenerationDiagnostics {
  used_llm: boolean;
  used_repair: boolean;
  used_fallback: boolean;
  failure_reasons: string[];
}

export type LlmGeneratorFn = (prompt: string) => Promise<string>;
export type ValidateProgressFn = (progress: {
  processed_blueprints: number;
  total_blueprints: number;
  created_count: number;
  failed_count: number;
  elapsed_ms: number;
}) => Promise<void> | void;

interface BatchGeneratedQuestion {
  unit_code: string;
  lo_code: string;
  ac_code: string;
  level: number;
  difficulty: string;
  format: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
}

interface BatchParseResult {
  rows: BatchGeneratedQuestion[];
  parse_mode: string;
  parse_error: string | null;
  raw_preview: string;
}

function toText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}

function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => toText(item)).filter((item): item is string => Boolean(item));
  return items;
}

function stripCodeFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

function previewRaw(raw: string): string {
  const compact = raw.replace(/\s+/g, ' ').trim();
  return compact.slice(0, 220);
}

function tryParseJson(raw: string): unknown {
  return JSON.parse(raw);
}

function findQuestionRows(parsed: unknown, depth = 0): { rows: unknown[]; mode: string } | null {
  if (depth > 3) return null;
  if (Array.isArray(parsed)) {
    return { rows: parsed, mode: 'array' };
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const row = parsed as Record<string, unknown>;

  const directKeys = ['questions', 'items', 'results'];
  for (const key of directKeys) {
    const value = row[key];
    if (Array.isArray(value)) {
      return { rows: value, mode: `object.${key}` };
    }
    if (typeof value === 'string') {
      const nestedRaw = stripCodeFences(value);
      try {
        const nestedParsed = tryParseJson(nestedRaw);
        const nestedRows = findQuestionRows(nestedParsed, depth + 1);
        if (nestedRows) {
          return { rows: nestedRows.rows, mode: `object.${key}->${nestedRows.mode}` };
        }
      } catch {
        // Ignore nested parse failure and continue searching.
      }
    }
  }

  const nestedKeys = ['data', 'output', 'response', 'result'];
  for (const key of nestedKeys) {
    const value = row[key];
    if (!value || typeof value !== 'object') continue;
    const nestedRows = findQuestionRows(value, depth + 1);
    if (nestedRows) {
      return { rows: nestedRows.rows, mode: `object.${key}->${nestedRows.mode}` };
    }
  }

  return null;
}

function normalizeBatchQuestion(item: unknown): BatchGeneratedQuestion {
  const row = (item ?? {}) as Record<string, unknown>;
  const rawDifficulty = String(row.difficulty ?? 'med').trim().toLowerCase();
  return {
    unit_code: String(row.unit_code ?? ''),
    lo_code: String(row.lo_code ?? ''),
    ac_code: String(row.ac_code ?? ''),
    level: Number(row.level ?? 2),
    difficulty: rawDifficulty === 'low' ? 'easy' : rawDifficulty,
    format: String(row.format ?? 'mcq'),
    stem: String(row.stem ?? ''),
    options: Array.isArray(row.options) ? row.options.map((x) => String(x)) : [],
    correct: String(row.correct ?? ''),
    rationale: String(row.rationale ?? ''),
  };
}

function parseLlmJson(raw: string): unknown {
  const cleaned = stripCodeFences(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('LLM output is malformed JSON.');
  }
}

function parseBatchQuestionsPayload(raw: string): BatchParseResult {
  const cleaned = stripCodeFences(raw);
  const attempts: Array<{ label: string; payload: string }> = [{ label: 'full', payload: cleaned }];
  const objectStart = cleaned.indexOf('{');
  const objectEnd = cleaned.lastIndexOf('}');
  if (objectStart >= 0 && objectEnd > objectStart) {
    const sliced = cleaned.slice(objectStart, objectEnd + 1);
    if (sliced !== cleaned) attempts.push({ label: 'sliced_object', payload: sliced });
  }
  const arrayStart = cleaned.indexOf('[');
  const arrayEnd = cleaned.lastIndexOf(']');
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    const sliced = cleaned.slice(arrayStart, arrayEnd + 1);
    if (!attempts.some((attempt) => attempt.payload === sliced)) {
      attempts.push({ label: 'sliced_array', payload: sliced });
    }
  }
  let parseError: string | null = null;
  for (const attempt of attempts) {
    try {
      const parsed = tryParseJson(attempt.payload);
      const extracted = findQuestionRows(parsed);
      if (!extracted) {
        parseError = 'JSON parsed but no question array was found.';
        continue;
      }
      return {
        rows: extracted.rows.map((item) => normalizeBatchQuestion(item)),
        parse_mode: `${attempt.label}:${extracted.mode}`,
        parse_error: null,
        raw_preview: previewRaw(cleaned),
      };
    } catch (error) {
      parseError = error instanceof Error ? error.message : 'Malformed JSON.';
    }
  }

  return {
    rows: [],
    parse_mode: 'failed',
    parse_error: parseError ?? 'Unable to parse batch payload.',
    raw_preview: previewRaw(cleaned),
  };
}

function formatQuestionFromBlueprint(
  blueprint: QuestionBlueprint,
  blueprintIndex: number
): Omit<GeneratedQuestionDraftInput, 'hash'> {
  const keyTerms = (blueprint.key_terms ?? []).slice(0, 4);
  const focusText = keyTerms.join(', ');
  const stem = `${blueprint.learning_target} (${blueprint.lo_code} ${blueprint.ac_code}) [v${blueprintIndex + 1}]${
    focusText ? ` Focus: ${focusText}.` : ''
  }`;
  if (blueprint.format === 'mcq' || blueprint.format === 'scenario') {
    const coreAnswer = focusText ? `Best practice using ${focusText}` : `Correct approach for ${blueprint.ac_code}`;
    const options = [
      coreAnswer,
      focusText
        ? `Common misconception when applying ${focusText}`
        : `Common misconception for ${blueprint.ac_code}`,
      focusText ? `Out-of-scope action unrelated to ${focusText}` : `Out-of-scope option for ${blueprint.ac_code}`,
      focusText ? `Partially correct step missing key ${focusText}` : `Incomplete method for ${blueprint.ac_code}`,
    ];
    return {
      generation_run_id: null,
      unit_code: blueprint.unit_code,
      lo_code: blueprint.lo_code,
      ac_code: blueprint.ac_code,
      level: blueprint.level,
      difficulty: blueprint.difficulty,
      format: blueprint.format,
      stem,
      options,
      correct: options[0],
      rationale: `This aligns with ${blueprint.lo_code} ${blueprint.ac_code}${focusText ? ` and key terms: ${focusText}` : ''}.`,
      tags: blueprint.key_terms ?? [],
      source: 'generated',
      status: 'draft',
      version: 1,
      doc_ref: null,
    };
  }

  return {
    generation_run_id: null,
    unit_code: blueprint.unit_code,
    lo_code: blueprint.lo_code,
    ac_code: blueprint.ac_code,
    level: blueprint.level,
    difficulty: blueprint.difficulty,
    format: blueprint.format,
    stem,
    options: null,
    correct: focusText ? `Expected response should include: ${focusText}` : 'Expected syllabus-aligned response',
    rationale: `Draft produced deterministically from syllabus blueprint${focusText ? ` using key terms ${focusText}` : ''}.`,
    tags: blueprint.key_terms ?? [],
    source: 'generated',
    status: 'draft',
    version: 1,
    doc_ref: null,
  };
}

function createRepairPrompt(
  previousOutput: string,
  errors: string[],
  blueprint: QuestionBlueprint,
  acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null },
  antiDuplicateHistory: string
): string {
  return [
    'Your previous output failed validation. Return corrected JSON only.',
    `Validation errors: ${errors.join(' | ')}`,
    `Previous output: ${previousOutput}`,
    `Blueprint: ${JSON.stringify(blueprint)}`,
    `AC Context: ${JSON.stringify(acContext)}`,
    antiDuplicateHistory,
  ].join('\n');
}

function compactAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(' | ');
  return value;
}

function buildAntiDuplicateHistory(params: {
  blueprint: QuestionBlueprint;
  approvedRows: Array<{
    lo_code: string | null;
    ac_code: string | null;
    stem: string;
    correct: string | string[];
    format: string;
  }>;
  acceptedDrafts: Array<{
    lo_code: string | null;
    ac_code: string | null;
    stem: string;
    correct: string | string[];
    format: string;
  }>;
}): string {
  const prioritized = [...params.approvedRows, ...params.acceptedDrafts]
    .filter((row) => row.format === params.blueprint.format)
    .filter((row) => row.lo_code === params.blueprint.lo_code || row.ac_code === params.blueprint.ac_code)
    .slice(0, 12)
    .map((row, index) => {
      const stem = row.stem.trim().replace(/\s+/g, ' ');
      const correct = compactAnswer(row.correct).trim().replace(/\s+/g, ' ');
      return `${index + 1}. [${row.lo_code ?? '-'}|${row.ac_code ?? '-'}] Q: ${stem} | A: ${correct}`;
    });

  if (prioritized.length === 0) {
    return 'ANTI-DUPLICATE HISTORY: none provided for this blueprint.';
  }

  return [
    'ANTI-DUPLICATE HISTORY (existing approved/recently generated questions):',
    ...prioritized,
    'STRICT RULE: Do not create a duplicate or light paraphrase of any item above, especially if the intended correct answer overlaps.',
    'If similar intent appears, materially change scenario/context and assessment angle while remaining AC-aligned.',
  ].join('\n');
}

function coerceLlmQuestionJson(
  parsed: unknown,
  blueprint: QuestionBlueprint
): { draft: Omit<GeneratedQuestionDraftInput, 'hash'> | null; errors: string[] } {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { draft: null, errors: ['LLM output is not a JSON object.'] };
  }
  const row = parsed as Record<string, unknown>;
  const stem = toText(row.stem);
  const rationale = toText(row.rationale) ?? '';

  const unit_code = toText(row.unit_code) ?? blueprint.unit_code;
  const lo_code = toText(row.lo_code) ?? blueprint.lo_code;
  const ac_code = toText(row.ac_code) ?? blueprint.ac_code;
  const level = Number(row.level ?? blueprint.level) as 2 | 3;
  const difficulty = (toText(row.difficulty) ?? blueprint.difficulty) as GeneratedQuestionDraftInput['difficulty'];
  const format = (toText(row.format) ?? blueprint.format) as GeneratedQuestionDraftInput['format'];

  if (!stem) return { draft: null, errors: ['LLM output missing stem.'] };

  let options: string[] | null = null;
  if (format === 'mcq' || format === 'multi_select' || format === 'scenario') {
    options = toStringArray(row.options) ?? null;
  }

  let correct: string | string[] = '';
  if (format === 'multi_select') {
    correct = toStringArray(row.correct) ?? [];
  } else {
    correct = toText(row.correct) ?? '';
  }

  const draft: Omit<GeneratedQuestionDraftInput, 'hash'> = {
    generation_run_id: null,
    unit_code,
    lo_code,
    ac_code,
    level,
    difficulty,
    format,
    stem,
    options,
    correct,
    rationale,
    tags: toStringArray(row.tags) ?? blueprint.key_terms ?? [],
    source: 'generated',
    status: 'draft',
    version: 1,
    doc_ref: null,
  };
  return { draft, errors: [] };
}

async function defaultLlmGenerator(prompt: string): Promise<string> {
  const timeoutMs = 20_000;
  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1200,
      responseMimeType: 'application/json',
    },
  });
  const result = await Promise.race([
    model.generateContent(prompt),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`LLM generation timed out after ${timeoutMs}ms.`)), timeoutMs);
    }),
  ]);
  return result.response.text();
}

async function defaultBatchLlmGenerator(prompt: string): Promise<string> {
  const timeoutMs = 45_000;
  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 10000,
      responseMimeType: 'application/json',
    },
  });
  const result = await Promise.race([
    model.generateContent(prompt),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Batch LLM generation timed out after ${timeoutMs}ms.`)), timeoutMs);
    }),
  ]);
  return result.response.text();
}

export async function buildDraftForBlueprint(params: {
  blueprint: QuestionBlueprint;
  blueprintIndex: number;
  runId: string;
  acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null };
  antiDuplicateHistory?: string;
  llmGenerator?: LlmGeneratorFn;
}): Promise<{ draft: GeneratedQuestionDraftInput; diagnostics: LlmGenerationDiagnostics }> {
  const deterministic = formatQuestionFromBlueprint(params.blueprint, params.blueprintIndex);
  const llmGenerator = params.llmGenerator ?? defaultLlmGenerator;
  const diagnostics: LlmGenerationDiagnostics = {
    used_llm: false,
    used_repair: false,
    used_fallback: false,
    failure_reasons: [],
  };

  const antiDuplicateHistory = params.antiDuplicateHistory ?? 'ANTI-DUPLICATE HISTORY: none provided for this blueprint.';
  const firstPrompt = [createSingleQuestionPrompt(params.blueprint, params.acContext), antiDuplicateHistory].join('\n\n');
  try {
    diagnostics.used_llm = true;
    const firstRaw = await llmGenerator(firstPrompt);
    const firstParsed = parseLlmJson(firstRaw);
    const firstCoerced = coerceLlmQuestionJson(firstParsed, params.blueprint);
    if (!firstCoerced.draft) {
      diagnostics.failure_reasons.push(...firstCoerced.errors);
      throw new Error(firstCoerced.errors.join(' | ') || 'LLM coercion failed.');
    }
    const firstHash = computeQuestionHash({
      stem: firstCoerced.draft.stem,
      options: firstCoerced.draft.options,
      correct: firstCoerced.draft.correct,
      unit_code: firstCoerced.draft.unit_code,
      lo_code: firstCoerced.draft.lo_code,
      ac_code: firstCoerced.draft.ac_code,
      format: firstCoerced.draft.format,
    });
    const firstValidation = validateQuestionDraft({ ...firstCoerced.draft, hash: firstHash });
    if (firstValidation.valid) {
      return {
        draft: { ...firstCoerced.draft, generation_run_id: params.runId, hash: firstHash },
        diagnostics,
      };
    }

    diagnostics.used_repair = true;
    diagnostics.failure_reasons.push(...firstValidation.reasons);
    const repairPrompt = createRepairPrompt(
      firstRaw,
      firstValidation.reasons,
      params.blueprint,
      params.acContext,
      antiDuplicateHistory
    );
    const repairRaw = await llmGenerator(repairPrompt);
    const repairParsed = parseLlmJson(repairRaw);
    const repairCoerced = coerceLlmQuestionJson(repairParsed, params.blueprint);
    if (!repairCoerced.draft) {
      diagnostics.failure_reasons.push(...repairCoerced.errors);
      throw new Error(repairCoerced.errors.join(' | ') || 'LLM repair coercion failed.');
    }

    const repairHash = computeQuestionHash({
      stem: repairCoerced.draft.stem,
      options: repairCoerced.draft.options,
      correct: repairCoerced.draft.correct,
      unit_code: repairCoerced.draft.unit_code,
      lo_code: repairCoerced.draft.lo_code,
      ac_code: repairCoerced.draft.ac_code,
      format: repairCoerced.draft.format,
    });
    const repairValidation = validateQuestionDraft({ ...repairCoerced.draft, hash: repairHash });
    if (repairValidation.valid) {
      return {
        draft: { ...repairCoerced.draft, generation_run_id: params.runId, hash: repairHash },
        diagnostics,
      };
    }
    diagnostics.failure_reasons.push(...repairValidation.reasons);
  } catch (error) {
    diagnostics.failure_reasons.push(error instanceof Error ? error.message : 'LLM generation error.');
  }

  diagnostics.used_fallback = true;
  const fallbackHash = computeQuestionHash({
    stem: deterministic.stem,
    options: deterministic.options,
    correct: deterministic.correct,
    unit_code: deterministic.unit_code,
    lo_code: deterministic.lo_code,
    ac_code: deterministic.ac_code,
    format: deterministic.format,
  });
  return {
    draft: { ...deterministic, generation_run_id: params.runId, hash: fallbackHash },
    diagnostics,
  };
}

async function generateBatchForLo(params: {
  run: QuestionGenerationRun;
  lo_code: string;
  entries: Array<{ blueprint_index: number; blueprint: QuestionBlueprint }>;
  acByKey: Map<string, SyllabusAssessmentCriteria>;
  loTextByCode: Map<string, string>;
  approvedPool: QuestionSimilarityLike[];
  acceptedPool: QuestionSimilarityLike[];
  deadlineMs: number;
  batchLlmGenerator?: LlmGeneratorFn;
}): Promise<{
  accepted: Array<{ blueprint_index: number; draft: GeneratedQuestionDraftInput; similarity: QuestionSimilarityLike }>;
  failed: Array<{ blueprint_index: number; reasons: string[] }>;
  llm_calls: number;
  report: {
    lo_code: string;
    target_count: number;
    parsed_count: number;
    accepted_count: number;
    valid_count: number;
    invalid_count: number;
    alignment_pass_count: number;
    alignment_fail_count: number;
    near_dup_reject_count: number;
    attempt_summary: string[];
    accepted_questions: BatchGeneratedQuestion[];
    attempted_questions: BatchGeneratedQuestion[];
  };
}> {
  const accepted: Array<{ blueprint_index: number; draft: GeneratedQuestionDraftInput; similarity: QuestionSimilarityLike }> = [];
  const failed: Array<{ blueprint_index: number; reasons: string[] }> = [];
  const allAcCodes = Array.from(new Set(params.entries.map((entry) => entry.blueprint.ac_code)));
  const maxAttempts = 5;
  let llmCalls = 0;
  let parsedCount = 0;
  let validCount = 0;
  let invalidCount = 0;
  let alignmentPassCount = 0;
  let alignmentFailCount = 0;
  let nearDupRejectCount = 0;
  let parseZeroCount = 0;
  const attemptSummary: string[] = [];
  const attemptedQuestions: BatchGeneratedQuestion[] = [];
  const acceptedRows: BatchGeneratedQuestion[] = [];

  const normalizeAcCode = (value: string): string => value.trim().replace(/^ac\s*/i, '');
  const isValidMcqRow = (row: BatchGeneratedQuestion): boolean => {
    const stem = String(row.stem ?? '').trim();
    const options = Array.isArray(row.options) ? row.options.map((x) => String(x).trim()).filter((x) => x.length > 0) : [];
    const correct = String(row.correct ?? '').trim();
    if (stem.length < 20) return false;
    if (options.length !== 4) return false;
    if (new Set(options.map((x) => x.toLowerCase())).size !== options.length) return false;
    if (options.some((x) => /^all of the above$/i.test(x))) return false;
    if (!options.some((x) => x.toLowerCase() === correct.toLowerCase())) return false;
    return true;
  };

  let consecutiveModelFailures = 0;
  let requestCeiling = 30;
  const batchLlmGenerator = params.batchLlmGenerator ?? defaultBatchLlmGenerator;
  for (
    let attempt = 1;
    attempt <= maxAttempts && acceptedRows.length < params.entries.length && Date.now() < params.deadlineMs;
    attempt += 1
  ) {
    if (params.deadlineMs - Date.now() < 15_000) {
      attemptSummary.push(`Attempt ${attempt}: stopped early to preserve fallback time budget.`);
      break;
    }
    const remaining = params.entries.length - acceptedRows.length;
    const requestCount = Math.min(requestCeiling, Math.max(remaining * 2, 12));
    const antiDupHistory = [...params.approvedPool, ...params.acceptedPool, ...accepted.map((x) => x.similarity)]
      .slice(0, 12)
      .map((row, idx) => {
        const stem = String(row.stem ?? '').replace(/\s+/g, ' ').slice(0, 180);
        const answer = (Array.isArray(row.correct) ? row.correct.join(' | ') : String(row.correct ?? ''))
          .replace(/\s+/g, ' ')
          .slice(0, 100);
        return `${idx + 1}. [${row.lo_code ?? '-'}|${row.ac_code ?? '-'}] Q: ${stem} | A: ${answer}`;
      })
      .join('\n');

    const acList = allAcCodes
      .map((ac_code) => {
        const ac = params.acByKey.get(`${params.lo_code}|${ac_code}`);
        return ac ? { ac_code: ac.ac_code, ac_text: ac.ac_text, range_notes: ac.range_notes } : null;
      })
      .filter((x): x is { ac_code: string; ac_text: string; range_notes: string | null } => Boolean(x));

    const prompt = createBatchGenerationPrompt({
      unit_code: params.run.unit_code,
      lo_code: params.lo_code,
      level: params.run.level,
      count: requestCount,
      lo_text: params.loTextByCode.get(params.lo_code) ?? `Learning outcome ${params.lo_code}`,
      ac_list: acList,
      anti_duplicate_history: antiDupHistory || '(none)',
      context_injections: [
        'Return only high-quality distinct MCQs aligned to the LO/AC scope.',
        'Do not paraphrase existing history items.',
      ],
    });

    let rows: BatchGeneratedQuestion[] = [];
    try {
      llmCalls += 1;
      const raw = await batchLlmGenerator(prompt);
      const parsed = parseBatchQuestionsPayload(raw);
      rows = parsed.rows;
      if (rows.length === 0) {
        parseZeroCount += 1;
        const reason = parsed.parse_error ? `${parsed.parse_mode}; ${parsed.parse_error}` : parsed.parse_mode;
        attemptSummary.push(`Attempt ${attempt}: parsed 0 (${reason}).`);
        if (parsed.raw_preview) {
          attemptSummary.push(`Attempt ${attempt} raw preview: ${parsed.raw_preview}`);
        }
        requestCeiling = Math.max(12, Math.floor(requestCeiling * 0.7));
        consecutiveModelFailures = 0;
        if (parseZeroCount >= 2) {
          attemptSummary.push('Repeated parse-zero responses; deferring remainder to single-item fallback path.');
          break;
        }
        continue;
      }
      parseZeroCount = 0;
      consecutiveModelFailures = 0;
    } catch (error) {
      rows = [];
      consecutiveModelFailures += 1;
      const message = error instanceof Error ? error.message : 'unknown error';
      attemptSummary.push(`Attempt ${attempt}: model call failed (${message}).`);
      if (consecutiveModelFailures >= 2) {
        break;
      }
      continue;
    }
    parsedCount += rows.length;
    attemptedQuestions.push(...rows);

    const acceptedBefore = acceptedRows.length;
    for (const row of rows) {
      if (acceptedRows.length >= params.entries.length) break;
      if (!isValidMcqRow(row)) {
        invalidCount += 1;
        continue;
      }
      validCount += 1;

      const acCodeNormalized = normalizeAcCode(String(row.ac_code ?? ''));
      const acContext = params.acByKey.get(`${params.lo_code}|${acCodeNormalized}`);
      const alignment = evaluateQuestionAlignment({
        stem: row.stem,
        options: row.options,
        correct: row.correct,
        context: {
          lo_code: params.lo_code,
          lo_text: params.loTextByCode.get(params.lo_code),
          ac_code: acCodeNormalized,
          ac_text: acContext?.ac_text,
          range_notes: acContext?.range_notes ?? null,
        },
      });
      if (!alignment.pass) {
        alignmentFailCount += 1;
        continue;
      }
      alignmentPassCount += 1;

      const similarity: QuestionSimilarityLike = {
        unit_code: params.run.unit_code,
        lo_code: params.lo_code,
        ac_code: acCodeNormalized,
        format: 'mcq',
        stem: row.stem,
        options: row.options,
        correct: row.correct,
      };

      const nearApproved = findNearDuplicate(similarity, params.approvedPool);
      if (nearApproved) {
        nearDupRejectCount += 1;
        continue;
      }
      const nearGenerated = findNearDuplicate(similarity, [...params.acceptedPool, ...accepted.map((x) => x.similarity)]);
      if (nearGenerated) {
        nearDupRejectCount += 1;
        continue;
      }

      acceptedRows.push({
        ...row,
        ac_code: acCodeNormalized,
      });
    }
    attemptSummary.push(`Attempt ${attempt}: parsed ${rows.length}, accepted ${acceptedRows.length}/${params.entries.length}.`);
  }

  const acceptedCount = Math.min(acceptedRows.length, params.entries.length);
  for (let i = 0; i < acceptedCount; i += 1) {
    const row = acceptedRows[i];
    const entry = params.entries[i];
    const sourceBlueprint = entry.blueprint;
    const acKnown = Boolean(params.acByKey.get(`${params.lo_code}|${row.ac_code}`));
    const acCode = acKnown ? row.ac_code : sourceBlueprint.ac_code;
    const difficulty = ['easy', 'med', 'hard'].includes(row.difficulty)
      ? (row.difficulty as GeneratedQuestionDraftInput['difficulty'])
      : sourceBlueprint.difficulty;
    const draft: GeneratedQuestionDraftInput = {
      generation_run_id: params.run.id,
      unit_code: params.run.unit_code,
      lo_code: params.lo_code,
      ac_code: acCode,
      level: params.run.level,
      difficulty,
      format: 'mcq',
      stem: row.stem,
      options: row.options,
      correct: row.correct,
      rationale: row.rationale,
      tags: sourceBlueprint.key_terms ?? [],
      source: 'generated',
      status: 'draft',
      hash: '',
      version: 1,
      doc_ref: null,
    };
    draft.hash = computeQuestionHash({
      stem: draft.stem,
      options: draft.options,
      correct: draft.correct,
      unit_code: draft.unit_code,
      lo_code: draft.lo_code,
      ac_code: draft.ac_code,
      format: draft.format,
    });
    const validation = validateQuestionDraft(draft);
    if (!validation.valid) {
      failed.push({ blueprint_index: entry.blueprint_index, reasons: validation.reasons });
      continue;
    }
    const similarity: QuestionSimilarityLike = {
      unit_code: draft.unit_code,
      lo_code: draft.lo_code,
      ac_code: draft.ac_code,
      format: draft.format,
      stem: draft.stem,
      options: draft.options,
      correct: draft.correct,
    };
    accepted.push({ blueprint_index: entry.blueprint_index, draft, similarity });
  }

  for (let i = acceptedCount; i < params.entries.length; i += 1) {
    const entry = params.entries[i];
    failed.push({
      blueprint_index: entry.blueprint_index,
      reasons: [`Batch generation accepted ${acceptedCount}/${params.entries.length} questions for LO ${params.lo_code}.`],
    });
  }

  return {
    accepted,
    failed,
    llm_calls: llmCalls,
    report: {
      lo_code: params.lo_code,
      target_count: params.entries.length,
      parsed_count: parsedCount,
      accepted_count: accepted.length,
      valid_count: validCount,
      invalid_count: invalidCount,
      alignment_pass_count: alignmentPassCount,
      alignment_fail_count: alignmentFailCount,
      near_dup_reject_count: nearDupRejectCount,
      attempt_summary: attemptSummary,
      accepted_questions: acceptedRows.slice(0, accepted.length),
      attempted_questions: attemptedQuestions,
    },
  };
}

export async function validateAndInsertDrafts(params: {
  run: QuestionGenerationRun;
  blueprints: QuestionBlueprint[];
  acByKey: Map<string, SyllabusAssessmentCriteria>;
  loTextByCode: Map<string, string>;
  llmGenerator?: LlmGeneratorFn;
  batchLlmGenerator?: LlmGeneratorFn;
  maxDurationMs?: number;
  onProgress?: ValidateProgressFn;
}): Promise<ValidateInsertResult> {
  const startedAt = Date.now();
  const maxDurationMs = params.maxDurationMs ?? 180_000;
  const runDeadlineMs = startedAt + maxDurationMs;
  const nonMcqBlueprintCount = params.blueprints.filter((blueprint) => blueprint.format !== 'mcq').length;
  const singlePathReserveMs =
    nonMcqBlueprintCount === 0 ? 15_000 : Math.min(60_000, Math.max(20_000, Math.floor(maxDurationMs * 0.33)));
  const batchDeadlineMs = Math.min(runDeadlineMs, Math.max(startedAt + 30_000, runDeadlineMs - singlePathReserveMs));
  let lastProgressAt = 0;
  const toInsertByHash = new Map<string, GeneratedQuestionDraftInput>();
  const failures: Array<{ blueprint_index: number; reasons: string[] }> = [];
  const generatedAccepted: QuestionSimilarityLike[] = [];
  const maxAttemptsPerBlueprint = 4;
  let processedBlueprints = 0;
  let timedOut = false;
  let llm_used_count = 0;
  let repair_retry_count = 0;
  let fallback_count = 0;
  let batchLlmCalls = 0;
  let batchPrehandled = 0;
  let singlePathCount = 0;
  const batchReports: Array<{
    lo_code: string;
    target_count: number;
    parsed_count: number;
    accepted_count: number;
    valid_count: number;
    invalid_count: number;
    alignment_pass_count: number;
    alignment_fail_count: number;
    near_dup_reject_count: number;
    attempt_summary: string[];
    accepted_questions: BatchGeneratedQuestion[];
    attempted_questions: BatchGeneratedQuestion[];
  }> = [];
  const approvedScope = await listApprovedQuestionsByScope({
    unit_code: params.run.unit_code,
    level: params.run.level,
    lo_codes: params.run.lo_codes ?? undefined,
  });
  const approvedSimilarityPool = approvedScope.map((item) => toSimilarityLike(item));

  // Batch-first path for MCQ blueprints (same strategy family as Batch-50 trial).
  const mcqEntries = params.blueprints
    .map((blueprint, blueprint_index) => ({ blueprint, blueprint_index }))
    .filter((entry) => entry.blueprint.format === 'mcq');
  const mcqByLo = new Map<string, Array<{ blueprint_index: number; blueprint: QuestionBlueprint }>>();
  for (const entry of mcqEntries) {
    const arr = mcqByLo.get(entry.blueprint.lo_code) ?? [];
    arr.push(entry);
    mcqByLo.set(entry.blueprint.lo_code, arr);
  }
  const preHandledIndexes = new Set<number>();
  for (const [lo_code, entries] of mcqByLo.entries()) {
    if (Date.now() >= batchDeadlineMs) {
      break;
    }
    if (Date.now() > runDeadlineMs) {
      timedOut = true;
      break;
    }
    const batch = await generateBatchForLo({
      run: params.run,
      lo_code,
      entries,
      acByKey: params.acByKey,
      loTextByCode: params.loTextByCode,
      approvedPool: approvedSimilarityPool,
      acceptedPool: generatedAccepted,
      deadlineMs: batchDeadlineMs,
      batchLlmGenerator: params.batchLlmGenerator,
    });
    llm_used_count += batch.llm_calls;
    batchLlmCalls += batch.llm_calls;
    batchReports.push(batch.report);
    for (const row of batch.accepted) {
      toInsertByHash.set(row.draft.hash, row.draft);
      generatedAccepted.push(row.similarity);
      preHandledIndexes.add(row.blueprint_index);
      processedBlueprints += 1;
      batchPrehandled += 1;
    }
    // Do not mark batch failures as final; let single-item path attempt recovery.
    if (
      params.onProgress &&
      (Date.now() - lastProgressAt > 1000 || processedBlueprints % 5 === 0 || processedBlueprints === params.blueprints.length)
    ) {
      lastProgressAt = Date.now();
      await params.onProgress({
        processed_blueprints: processedBlueprints,
        total_blueprints: params.blueprints.length,
        created_count: toInsertByHash.size,
        failed_count: failures.length,
        elapsed_ms: Date.now() - startedAt,
      });
    }
  }
  const degradedBatchMode = batchReports.some((report) => {
    const summary = report.attempt_summary ?? [];
    const hasModelFailures = summary.some((line) => line.includes('model call failed'));
    return report.accepted_count === 0 && hasModelFailures;
  });
  const hasBatchModelFailures = batchReports.some((report) =>
    (report.attempt_summary ?? []).some((line) => line.includes('model call failed'))
  );
  const lowBatchYield = mcqEntries.length > 0 && batchPrehandled < Math.ceil(mcqEntries.length * 0.7);
  const fastFallbackLlmGenerator: LlmGeneratorFn = async () => {
    throw new Error('Skipped LLM generation in degraded fallback mode.');
  };

  for (let index = 0; index < params.blueprints.length; index += 1) {
    if (preHandledIndexes.has(index)) continue;
    singlePathCount += 1;
    if (Date.now() > runDeadlineMs) {
      timedOut = true;
      break;
    }
    const blueprint = params.blueprints[index];
    const remainingBlueprints = params.blueprints.length - processedBlueprints;
    const remainingTimeMs = runDeadlineMs - Date.now();
    const forceFastFallback =
      blueprint.format === 'mcq' &&
      (degradedBatchMode ||
        (hasBatchModelFailures && lowBatchYield) ||
        (remainingTimeMs < 45_000 && remainingBlueprints > 8));
    const localMaxAttempts = forceFastFallback ? 1 : maxAttemptsPerBlueprint;
    const attemptReasons: string[] = [];
    let acceptedDraft: GeneratedQuestionDraftInput | null = null;
    let acceptedSimilarity: QuestionSimilarityLike | null = null;

    for (let attempt = 1; attempt <= localMaxAttempts; attempt += 1) {
      if (Date.now() > runDeadlineMs) {
        timedOut = true;
        attemptReasons.push(`Validate deadline reached after ${maxDurationMs}ms.`);
        break;
      }
      if (!forceFastFallback && runDeadlineMs - Date.now() < 8_000) {
        timedOut = true;
        attemptReasons.push('Insufficient remaining time for another LLM attempt.');
        break;
      }
      const acKey = `${blueprint.lo_code}|${blueprint.ac_code}`;
      const ac = params.acByKey.get(acKey);
      const acContext = {
        lo_text: params.loTextByCode.get(blueprint.lo_code),
        ac_text: ac?.ac_text,
        range_notes: ac?.range_notes ?? null,
      };
      const attemptBlueprint =
        attempt === 1
          ? blueprint
          : {
              ...blueprint,
              learning_target: `${blueprint.learning_target} (alternate assessment angle ${attempt})`,
            };

      const built = await buildDraftForBlueprint({
        blueprint: attemptBlueprint,
        blueprintIndex: index,
        runId: params.run.id,
        acContext,
        antiDuplicateHistory: buildAntiDuplicateHistory({
          blueprint: attemptBlueprint,
          approvedRows: approvedScope,
          acceptedDrafts: Array.from(toInsertByHash.values()).map((row) => ({
            lo_code: row.lo_code,
            ac_code: row.ac_code,
            stem: row.stem,
            correct: row.correct,
            format: row.format,
          })),
        }),
        llmGenerator: forceFastFallback ? fastFallbackLlmGenerator : params.llmGenerator,
      });
      if (built.diagnostics.used_llm) llm_used_count += 1;
      if (built.diagnostics.used_repair) repair_retry_count += 1;
      if (built.diagnostics.used_fallback) fallback_count += 1;

      const validation = validateQuestionDraft(built.draft);
      if (!validation.valid) {
        attemptReasons.push(...validation.reasons);
        continue;
      }

      const alignment = evaluateQuestionAlignment({
        stem: built.draft.stem,
        options: built.draft.options,
        correct: built.draft.correct,
        context: {
          lo_code: blueprint.lo_code,
          lo_text: acContext.lo_text,
          ac_code: blueprint.ac_code,
          ac_text: acContext.ac_text,
          range_notes: acContext.range_notes,
        },
      });
      if (!alignment.pass) {
        attemptReasons.push(
          `Alignment gate failed (score ${alignment.score.toFixed(2)} < ${alignment.threshold.toFixed(2)}).`
        );
        attemptReasons.push(...alignment.reasons);
        continue;
      }

      const draftSimilarity: QuestionSimilarityLike = {
        unit_code: built.draft.unit_code,
        lo_code: built.draft.lo_code,
        ac_code: built.draft.ac_code,
        format: built.draft.format,
        stem: built.draft.stem,
        options: built.draft.options,
        correct: built.draft.correct,
      };
      if (forceFastFallback) {
        acceptedDraft = built.draft;
        acceptedSimilarity = draftSimilarity;
        break;
      }

      const nearApproved = findNearDuplicate(draftSimilarity, approvedSimilarityPool);
      if (nearApproved) {
        attemptReasons.push(
          `Near-duplicate of approved question ${nearApproved.question.id ?? '(unknown)'} (similarity ${nearApproved.score.toFixed(2)}).`
        );
        continue;
      }

      const nearGenerated = findNearDuplicate(draftSimilarity, generatedAccepted);
      if (nearGenerated) {
        attemptReasons.push(`Near-duplicate of another draft in this run (similarity ${nearGenerated.score.toFixed(2)}).`);
        continue;
      }

      acceptedDraft = built.draft;
      acceptedSimilarity = draftSimilarity;
      break;
    }

    if (!acceptedDraft || !acceptedSimilarity) {
      const compactReasons = Array.from(new Set(attemptReasons)).slice(0, 8);
      failures.push({
        blueprint_index: index,
        reasons: compactReasons.length > 0 ? compactReasons : ['Failed to generate a valid aligned non-duplicate draft.'],
      });
    } else {
      toInsertByHash.set(acceptedDraft.hash, acceptedDraft);
      generatedAccepted.push(acceptedSimilarity);
    }
    processedBlueprints += 1;
    if (
      params.onProgress &&
      (Date.now() - lastProgressAt > 1000 || processedBlueprints % 5 === 0 || processedBlueprints === params.blueprints.length)
    ) {
      lastProgressAt = Date.now();
      await params.onProgress({
        processed_blueprints: processedBlueprints,
        total_blueprints: params.blueprints.length,
        created_count: toInsertByHash.size,
        failed_count: failures.length,
        elapsed_ms: Date.now() - startedAt,
      });
    }
  }

  const inserted = await insertDraftQuestions(Array.from(toInsertByHash.values()));
  if (timedOut) {
    failures.push({
      blueprint_index: processedBlueprints,
      reasons: [`Validate step timed out after ${maxDurationMs}ms. Remaining blueprints were skipped.`],
    });
  }
  return {
    created_count: inserted.length,
    failed_count: failures.length,
    failures,
    inserted_question_ids: inserted.map((row) => row.id),
    llm_used_count,
    repair_retry_count,
    fallback_count,
    processed_blueprints: processedBlueprints,
    total_blueprints: params.blueprints.length,
    timed_out: timedOut,
    max_duration_ms: maxDurationMs,
    debug: {
      batch_lo_groups: mcqByLo.size,
      batch_llm_calls: batchLlmCalls,
      batch_prehandled_blueprints: batchPrehandled,
      single_path_blueprints: singlePathCount,
      batch_reports: batchReports,
    },
  };
}
