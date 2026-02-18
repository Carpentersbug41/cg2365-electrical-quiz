import { buildWeightedAcSelection } from '../acMixing';
import {
  createQuestionRun,
  getQuestionRun,
  listApprovedQuestionsByScope,
  listRunSteps,
  upsertRunStep,
  updateQuestionRun,
} from '../bankRepo';
import { getSyllabusUnit } from '../syllabusRepo';
import { QuestionBlueprint, QuestionGenerationRun, QuestionRunStepKey, SyllabusAssessmentCriteria } from '../types';
import { validateAndInsertDrafts } from './validateAndInsert';

const STEP_ORDER: QuestionRunStepKey[] = [
  'distill',
  'analyze',
  'extract_coverage',
  'plan',
  'build_blueprints',
  'validate',
  'refresh_summary',
];

function nowIso(): string {
  return new Date().toISOString();
}

function toSafeRatioMap(input: Record<string, number>, fallback: Record<string, number>): Record<string, number> {
  const source = Object.keys(input ?? {}).length > 0 ? input : fallback;
  const cleanEntries = Object.entries(source)
    .map(([key, value]) => [key, Number(value)] as const)
    .filter(([, value]) => Number.isFinite(value) && value > 0);
  if (cleanEntries.length === 0) return fallback;
  const sum = cleanEntries.reduce((total, [, value]) => total + value, 0);
  const result: Record<string, number> = {};
  for (const [key, value] of cleanEntries) {
    result[key] = value / sum;
  }
  return result;
}

function allocateCounts(total: number, mix: Record<string, number>): Record<string, number> {
  const keys = Object.keys(mix);
  const raw = keys.map((key) => ({ key, value: total * mix[key] }));
  const base = raw.map((item) => ({ key: item.key, count: Math.floor(item.value), remainder: item.value % 1 }));
  let allocated = base.reduce((sum, item) => sum + item.count, 0);
  base.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; allocated < total && i < base.length; i += 1) {
    base[i].count += 1;
    allocated += 1;
  }
  return Object.fromEntries(base.map((item) => [item.key, item.count]));
}

function difficultyFromRank(rank: number, max: number): 'easy' | 'med' | 'hard' {
  const ratio = max <= 1 ? 0 : rank / (max - 1);
  if (ratio < 0.34) return 'easy';
  if (ratio < 0.8) return 'med';
  return 'hard';
}

async function setStepRunning(runId: string, stepKey: QuestionRunStepKey) {
  await upsertRunStep({
    run_id: runId,
    step_key: stepKey,
    status: 'running',
    started_at: nowIso(),
    completed_at: null,
    error: null,
  });
}

async function setStepDone(
  runId: string,
  stepKey: QuestionRunStepKey,
  output: Record<string, unknown>
) {
  await upsertRunStep({
    run_id: runId,
    step_key: stepKey,
    status: 'completed',
    started_at: null,
    completed_at: nowIso(),
    output,
    error: null,
  });
}

async function setStepFailed(runId: string, stepKey: QuestionRunStepKey, errorMessage: string) {
  await upsertRunStep({
    run_id: runId,
    step_key: stepKey,
    status: 'failed',
    started_at: null,
    completed_at: nowIso(),
    output: null,
    error: errorMessage,
  });
}

async function readStepOutput(runId: string, stepKey: QuestionRunStepKey): Promise<Record<string, unknown>> {
  const steps = await listRunSteps(runId);
  const row = steps.find((step) => step.step_key === stepKey && step.output);
  if (!row?.output) {
    throw new Error(`Missing output for step ${stepKey}.`);
  }
  return row.output;
}

export async function createDefaultQuestionRun(input: {
  unit_code: string;
  level: 2 | 3;
  lo_codes: string[] | null;
  target_count: number;
  format_mix?: Record<string, number>;
  difficulty_mix?: Record<string, number>;
  created_by?: string | null;
}): Promise<QuestionGenerationRun> {
  return createQuestionRun({
    unit_code: input.unit_code,
    level: input.level,
    lo_codes: input.lo_codes,
    target_count: input.target_count,
    format_mix: toSafeRatioMap(input.format_mix ?? {}, { mcq: 0.7, scenario: 0.2, short_answer: 0.1 }),
    difficulty_mix: toSafeRatioMap(input.difficulty_mix ?? {}, { easy: 0.4, med: 0.5, hard: 0.1 }),
    created_by: input.created_by ?? null,
  });
}

async function runDistill(run: QuestionGenerationRun): Promise<Record<string, unknown>> {
  const unit = await getSyllabusUnit(run.unit_code);
  if (!unit) {
    throw new Error(`Unit ${run.unit_code} not found in syllabus structure.`);
  }
  const scopedLos = run.lo_codes && run.lo_codes.length > 0
    ? unit.learning_outcomes.filter((lo) => run.lo_codes?.includes(lo.lo_code))
    : unit.learning_outcomes;
  const acs = scopedLos.flatMap((lo) => lo.assessment_criteria);

  return {
    unit: {
      code: unit.unit_code,
      title: unit.unit_title,
      level_min: unit.level_min,
      level_max: unit.level_max,
    },
    los: scopedLos.map((lo) => ({
      lo_code: lo.lo_code,
      lo_text: lo.lo_text,
      lo_title: lo.lo_title,
    })),
    acs,
    ac_index: Object.fromEntries(
      acs.map((ac) => [`${ac.lo_code}|${ac.ac_code}`, { ac_text: ac.ac_text, range_notes: ac.range_notes }])
    ),
  };
}

async function runAnalyze(runId: string): Promise<Record<string, unknown>> {
  const distill = await readStepOutput(runId, 'distill');
  const acs = Array.isArray(distill.acs) ? (distill.acs as SyllabusAssessmentCriteria[]) : [];
  const analysis = acs.map((ac) => ({
    lo_code: ac.lo_code,
    ac_code: ac.ac_code,
    recommended_formats: ['mcq', 'scenario', 'short_answer'],
    risk_flags: [],
    key_terms: ac.ac_text
      .split(/\s+/)
      .map((token) => token.toLowerCase())
      .filter((token) => token.length > 4)
      .slice(0, 6),
  }));
  return { ac_analysis: analysis };
}

async function runExtractCoverage(run: QuestionGenerationRun, runId: string): Promise<Record<string, unknown>> {
  const approved = await listApprovedQuestionsByScope({
    unit_code: run.unit_code,
    level: run.level,
    lo_codes: run.lo_codes ?? undefined,
  });
  const byLo: Record<string, number> = {};
  const byAc: Record<string, number> = {};
  const byFormat: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};

  for (const question of approved) {
    if (question.lo_code) byLo[question.lo_code] = (byLo[question.lo_code] ?? 0) + 1;
    if (question.lo_code && question.ac_code) {
      const key = `${question.lo_code}|${question.ac_code}`;
      byAc[key] = (byAc[key] ?? 0) + 1;
    }
    byFormat[question.format] = (byFormat[question.format] ?? 0) + 1;
    byDifficulty[question.difficulty] = (byDifficulty[question.difficulty] ?? 0) + 1;
  }

  const distill = await readStepOutput(runId, 'distill');
  const acs = Array.isArray(distill.acs) ? (distill.acs as SyllabusAssessmentCriteria[]) : [];
  const thinAcs = [...acs]
    .sort((a, b) => ((byAc[`${a.lo_code}|${a.ac_code}`] ?? 0) - (byAc[`${b.lo_code}|${b.ac_code}`] ?? 0)))
    .slice(0, Math.min(10, acs.length))
    .map((ac) => `${ac.lo_code}|${ac.ac_code}`);

  return {
    approved_total: approved.length,
    by_lo: byLo,
    by_ac: byAc,
    by_format: byFormat,
    by_difficulty: byDifficulty,
    thin_acs: thinAcs,
  };
}

async function runPlan(run: QuestionGenerationRun, runId: string): Promise<Record<string, unknown>> {
  const distill = await readStepOutput(runId, 'distill');
  const coverage = await readStepOutput(runId, 'extract_coverage');
  const acs = Array.isArray(distill.acs) ? (distill.acs as SyllabusAssessmentCriteria[]) : [];
  const byAc = (coverage.by_ac as Record<string, number>) ?? {};

  const weightedKeys = buildWeightedAcSelection({
    acs,
    coverage: acs.map((ac) => ({
      ac_key: `${ac.lo_code}|${ac.ac_code}`,
      lo_code: ac.lo_code,
      ac_code: ac.ac_code,
      approved_count: byAc[`${ac.lo_code}|${ac.ac_code}`] ?? 0,
    })),
    count: run.target_count,
  });

  const countByAc: Record<string, number> = {};
  for (const key of weightedKeys) {
    countByAc[key] = (countByAc[key] ?? 0) + 1;
  }

  const generationPlan = Object.entries(countByAc).map(([acKey, target]) => {
    const [lo_code, ac_code] = acKey.split('|');
    return {
      lo_code,
      ac_code,
      target,
      targets: allocateCounts(target, run.format_mix),
      difficulty: allocateCounts(target, run.difficulty_mix),
    };
  });

  return { generation_plan: generationPlan };
}

async function runBuildBlueprints(run: QuestionGenerationRun, runId: string): Promise<Record<string, unknown>> {
  const plan = await readStepOutput(runId, 'plan');
  const analysis = await readStepOutput(runId, 'analyze');
  const acAnalysis = Array.isArray(analysis.ac_analysis)
    ? (analysis.ac_analysis as Array<{ lo_code: string; ac_code: string; key_terms: string[] }>)
    : [];
  const keyTermsMap = new Map(acAnalysis.map((row) => [`${row.lo_code}|${row.ac_code}`, row.key_terms ?? []]));
  const blueprints: QuestionBlueprint[] = [];

  const rows = Array.isArray(plan.generation_plan)
    ? (plan.generation_plan as Array<{
        lo_code: string;
        ac_code: string;
        targets: Record<string, number>;
      }>)
    : [];

  for (const row of rows) {
    const formatCounts = row.targets ?? {};
    for (const [format, count] of Object.entries(formatCounts)) {
      const safeCount = Number(count);
      if (!Number.isFinite(safeCount) || safeCount <= 0) continue;
      for (let i = 0; i < safeCount; i += 1) {
        blueprints.push({
          unit_code: run.unit_code,
          lo_code: row.lo_code,
          ac_code: row.ac_code,
          level: run.level,
          difficulty: difficultyFromRank(i, safeCount),
          format: format as QuestionBlueprint['format'],
          learning_target: `Assess ${row.lo_code} ${row.ac_code} with practical clarity`,
          key_terms: keyTermsMap.get(`${row.lo_code}|${row.ac_code}`) ?? [],
        });
      }
    }
  }

  return { blueprints };
}

async function runValidate(run: QuestionGenerationRun, runId: string): Promise<Record<string, unknown>> {
  const output = await readStepOutput(runId, 'build_blueprints');
  const distill = await readStepOutput(runId, 'distill');
  const blueprints = Array.isArray(output.blueprints) ? (output.blueprints as QuestionBlueprint[]) : [];
  const acs = Array.isArray(distill.acs) ? (distill.acs as SyllabusAssessmentCriteria[]) : [];
  const los = Array.isArray(distill.los) ? (distill.los as Array<{ lo_code: string; lo_text: string }>) : [];
  const acByKey = new Map(acs.map((ac) => [`${ac.lo_code}|${ac.ac_code}`, ac]));
  const loTextByCode = new Map(los.map((lo) => [lo.lo_code, lo.lo_text]));

  const result = await validateAndInsertDrafts({
    run,
    blueprints,
    acByKey,
    loTextByCode,
  });
  return result as unknown as Record<string, unknown>;
}

async function runRefreshSummary(run: QuestionGenerationRun, runId: string): Promise<Record<string, unknown>> {
  const validate = await readStepOutput(runId, 'validate');
  return {
    run_id: runId,
    target_count: run.target_count,
    created_count: Number(validate.created_count ?? 0),
    failed_count: Number(validate.failed_count ?? 0),
    draft_ids: Array.isArray(validate.inserted_question_ids) ? validate.inserted_question_ids : [],
  };
}

export async function executeQuestionRun(runId: string): Promise<{
  run: QuestionGenerationRun;
  steps: Awaited<ReturnType<typeof listRunSteps>>;
}> {
  const run = await getQuestionRun(runId);
  if (!run) throw new Error(`Question run not found: ${runId}`);

  await updateQuestionRun(runId, { status: 'running' });

  try {
    for (const step of STEP_ORDER) {
      await setStepRunning(runId, step);
      let output: Record<string, unknown>;

      if (step === 'distill') output = await runDistill(run);
      else if (step === 'analyze') output = await runAnalyze(runId);
      else if (step === 'extract_coverage') output = await runExtractCoverage(run, runId);
      else if (step === 'plan') output = await runPlan(run, runId);
      else if (step === 'build_blueprints') output = await runBuildBlueprints(run, runId);
      else if (step === 'validate') output = await runValidate(run, runId);
      else output = await runRefreshSummary(run, runId);

      await setStepDone(runId, step, output);
      if (step === 'refresh_summary') {
        await updateQuestionRun(runId, { summary: output });
      }
    }
    const updatedRun = await updateQuestionRun(runId, { status: 'completed' });
    const steps = await listRunSteps(runId);
    return { run: updatedRun, steps };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Question run failed.';
    const existingSteps = await listRunSteps(runId);
    const currentStep = STEP_ORDER.find((key) => !existingSteps.find((step) => step.step_key === key && step.status === 'completed'));
    if (currentStep) {
      await setStepFailed(runId, currentStep, message);
    }
    const failedRun = await updateQuestionRun(runId, { status: 'failed' });
    const steps = await listRunSteps(runId);
    return { run: failedRun, steps };
  }
}
