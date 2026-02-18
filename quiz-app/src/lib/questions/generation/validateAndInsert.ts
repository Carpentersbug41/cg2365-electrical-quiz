import { createLLMClient } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { computeQuestionHash } from '../hash';
import { insertDraftQuestions } from '../bankRepo';
import { GeneratedQuestionDraftInput, QuestionBlueprint, QuestionGenerationRun, SyllabusAssessmentCriteria } from '../types';
import { validateQuestionDraft } from '../validation';

export interface ValidateInsertResult {
  created_count: number;
  failed_count: number;
  failures: Array<{ blueprint_index: number; reasons: string[] }>;
  inserted_question_ids: string[];
  llm_used_count: number;
  repair_retry_count: number;
  fallback_count: number;
}

export interface LlmGenerationDiagnostics {
  used_llm: boolean;
  used_repair: boolean;
  used_fallback: boolean;
  failure_reasons: string[];
}

export type LlmGeneratorFn = (prompt: string) => Promise<string>;

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

function parseLlmJson(raw: string): unknown {
  return JSON.parse(stripCodeFences(raw));
}

function formatQuestionFromBlueprint(
  blueprint: QuestionBlueprint,
  blueprintIndex: number
): Omit<GeneratedQuestionDraftInput, 'hash'> {
  const stem = `${blueprint.learning_target} (${blueprint.lo_code} ${blueprint.ac_code}) [v${blueprintIndex + 1}]`;
  if (blueprint.format === 'mcq' || blueprint.format === 'scenario') {
    const options = [
      `Correct approach for ${blueprint.ac_code}`,
      `Common misconception for ${blueprint.ac_code}`,
      `Out-of-scope option for ${blueprint.ac_code}`,
      `Incomplete method for ${blueprint.ac_code}`,
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
      rationale: `This aligns with ${blueprint.lo_code} ${blueprint.ac_code} and expected syllabus intent.`,
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
    correct: 'Expected syllabus-aligned response',
    rationale: 'Draft produced deterministically from syllabus blueprint.',
    tags: blueprint.key_terms ?? [],
    source: 'generated',
    status: 'draft',
    version: 1,
    doc_ref: null,
  };
}

function createLlmPrompt(blueprint: QuestionBlueprint, acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null }): string {
  return [
    'You are generating one assessment item as strict JSON only.',
    'Return a JSON object with keys:',
    'unit_code, lo_code, ac_code, level, difficulty, format, stem, options, correct, rationale.',
    'Rules:',
    '- Keep scope tightly aligned to AC context.',
    '- For mcq/multi_select/scenario include at least 4 distinct options.',
    '- For mcq: correct must be one option string.',
    '- For multi_select: correct must be an array subset of options.',
    '- Do not include markdown or code fences.',
    '',
    `Blueprint: ${JSON.stringify(blueprint)}`,
    `AC Context: ${JSON.stringify(acContext)}`,
  ].join('\n');
}

function createRepairPrompt(previousOutput: string, errors: string[], blueprint: QuestionBlueprint, acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null }): string {
  return [
    'Your previous output failed validation. Return corrected JSON only.',
    `Validation errors: ${errors.join(' | ')}`,
    `Previous output: ${previousOutput}`,
    `Blueprint: ${JSON.stringify(blueprint)}`,
    `AC Context: ${JSON.stringify(acContext)}`,
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
  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1200,
      responseMimeType: 'application/json',
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function buildDraftForBlueprint(params: {
  blueprint: QuestionBlueprint;
  blueprintIndex: number;
  runId: string;
  acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null };
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

  const firstPrompt = createLlmPrompt(params.blueprint, params.acContext);
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
    const repairPrompt = createRepairPrompt(firstRaw, firstValidation.reasons, params.blueprint, params.acContext);
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

export async function validateAndInsertDrafts(params: {
  run: QuestionGenerationRun;
  blueprints: QuestionBlueprint[];
  acByKey: Map<string, SyllabusAssessmentCriteria>;
  loTextByCode: Map<string, string>;
  llmGenerator?: LlmGeneratorFn;
}): Promise<ValidateInsertResult> {
  const toInsertByHash = new Map<string, GeneratedQuestionDraftInput>();
  const failures: Array<{ blueprint_index: number; reasons: string[] }> = [];
  let llm_used_count = 0;
  let repair_retry_count = 0;
  let fallback_count = 0;

  for (let index = 0; index < params.blueprints.length; index += 1) {
    const blueprint = params.blueprints[index];
    const acKey = `${blueprint.lo_code}|${blueprint.ac_code}`;
    const ac = params.acByKey.get(acKey);
    const acContext = {
      lo_text: params.loTextByCode.get(blueprint.lo_code),
      ac_text: ac?.ac_text,
      range_notes: ac?.range_notes ?? null,
    };

    const built = await buildDraftForBlueprint({
      blueprint,
      blueprintIndex: index,
      runId: params.run.id,
      acContext,
      llmGenerator: params.llmGenerator,
    });
    if (built.diagnostics.used_llm) llm_used_count += 1;
    if (built.diagnostics.used_repair) repair_retry_count += 1;
    if (built.diagnostics.used_fallback) fallback_count += 1;

    const validation = validateQuestionDraft(built.draft);
    if (!validation.valid) {
      failures.push({ blueprint_index: index, reasons: validation.reasons });
      continue;
    }
    toInsertByHash.set(built.draft.hash, built.draft);
  }

  const inserted = await insertDraftQuestions(Array.from(toInsertByHash.values()));
  return {
    created_count: inserted.length,
    failed_count: failures.length,
    failures,
    inserted_question_ids: inserted.map((row) => row.id),
    llm_used_count,
    repair_retry_count,
    fallback_count,
  };
}

