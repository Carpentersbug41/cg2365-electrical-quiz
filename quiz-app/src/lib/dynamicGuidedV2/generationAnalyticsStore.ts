import { createHash, randomUUID } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { DynamicLessonGenerationResult } from '@/lib/dynamicGuidedV2/generation/types';

export type DynamicGenerationAnalyticsOrigin = 'live_generation' | 'artifact_backfill';

export type DynamicGenerationAnalyticsContext = {
  lessonCode: string;
  sourceContext?: string | null;
  promptVersion?: string | null;
  origin: DynamicGenerationAnalyticsOrigin;
  runFingerprint?: string | null;
};

export type DynamicGenerationRunAnalyticsRow = {
  lesson_code: string;
  source_context: string | null;
  prompt_version: string | null;
  run_fingerprint: string;
  origin: DynamicGenerationAnalyticsOrigin;
  accepted: boolean;
  refined: boolean;
  lesson_score: number;
  lesson_grade: string;
  plan_score: number;
  fidelity_score: number;
  validation_passed: boolean;
  issue_count: number;
  remaining_patchable_issue_count: number;
  attempted_patch_count: number;
  accepted_patch_count: number;
  repair_stop_reason: string | null;
  rejection_reason: string | null;
  report_json: Record<string, unknown>;
  repair_summary_json: Record<string, unknown> | null;
};

export type DynamicGenerationIssueAnalyticsRow = {
  lesson_code: string;
  issue_index: number;
  category: string;
  problem: string;
  why_it_matters: string | null;
  solution: string | null;
  suggestion: string | null;
  json_pointers: string[];
  repairable: boolean;
  repair_class: string | null;
  normalized_key: string;
  resolved_by_repair: boolean;
  score_phase: 'final';
};

export type DynamicGenerationAnalyticsPayload = {
  runRow: DynamicGenerationRunAnalyticsRow;
  issueRows: DynamicGenerationIssueAnalyticsRow[];
};

function normalizeText(value: string | null | undefined): string {
  return String(value ?? '').trim().toLowerCase();
}

function inferPromptVersion(context: DynamicGenerationAnalyticsContext): string | null {
  const explicit = context.promptVersion?.trim();
  if (explicit) return explicit;
  const envValue = process.env.DYNAMIC_GENERATION_PROMPT_VERSION?.trim();
  return envValue ? envValue : null;
}

function pointersMatch(left: string, right: string): boolean {
  return left === right || left.startsWith(right) || right.startsWith(left);
}

function findMatchingFix(
  issue: DynamicLessonGenerationResult['score']['issues'][number],
  result: DynamicLessonGenerationResult
) {
  const issuePointers = (issue.jsonPointers ?? []).filter((pointer): pointer is string => typeof pointer === 'string' && pointer.length > 0);
  return (result.fixPlan?.fixes ?? []).find((fix) =>
    typeof fix.targetPointer === 'string' &&
    fix.targetPointer.length > 0 &&
    issuePointers.some((pointer) => pointersMatch(pointer, fix.targetPointer))
  );
}

export function buildDynamicGenerationRunFingerprint(input: {
  context: DynamicGenerationAnalyticsContext;
  result: DynamicLessonGenerationResult;
  artifactPath?: string | null;
  exportedAt?: string | null;
}): string {
  if (input.context.runFingerprint?.trim()) {
    return input.context.runFingerprint.trim();
  }

  if (input.context.origin === 'live_generation') {
    return `live:${input.context.lessonCode}:${Date.now()}:${randomUUID()}`;
  }

  const stableKey = JSON.stringify({
    lessonCode: input.context.lessonCode,
    artifactPath: input.artifactPath ?? null,
    exportedAt: input.exportedAt ?? null,
    accepted: input.result.accepted,
    refined: input.result.refined,
    lessonScore: input.result.score.total,
    issueCount: input.result.score.issues.length,
    sourceContext: input.context.sourceContext ?? null,
  });

  return `artifact:${createHash('sha1').update(stableKey).digest('hex')}`;
}

export function normalizeDynamicGenerationIssueKey(
  issue: DynamicLessonGenerationResult['score']['issues'][number],
  result?: DynamicLessonGenerationResult
): string {
  const problem = normalizeText(issue.problem);
  const solution = normalizeText(issue.solution ?? issue.suggestion);
  const pointers = issue.jsonPointers ?? [];
  const category = normalizeText(issue.category);
  const hasBasicQuestionPointer = pointers.some((pointer) => pointer.includes('/basicQuestions/'));
  const hasDeeperQuestionPointer = pointers.some((pointer) => pointer.includes('/deeperQuestionText'));

  if (
    problem.includes('step-up transformer') ||
    problem.includes('wrong named device') ||
    solution.includes('step-up transformer') ||
    solution.includes('change the anchor fact to')
  ) {
    return 'wrong_named_device';
  }

  if (
    problem.includes('not answerable from the taught chunk') ||
    solution.includes('answerable from the taught chunk')
  ) {
    return 'question_not_answerable_from_chunk';
  }

  if (
    hasBasicQuestionPointer &&
    (problem.includes('not clearly taught in this chunk') ||
      problem.includes('without those being taught') ||
      solution.includes('add ') ||
      solution.includes('rewrite question to use one taught'))
  ) {
    return 'untaught_term_in_basic_question';
  }

  if (
    hasDeeperQuestionPointer &&
    (problem.includes('meta') ||
      problem.includes('lesson framing') ||
      solution.includes('replace with application question') ||
      solution.includes('replace the meta deeper question'))
  ) {
    return 'meta_deeper_question';
  }

  if (problem.includes('teach') && problem.includes('before') && problem.includes('method')) {
    return 'method_not_taught_before_question';
  }

  if (
    problem.includes('open-ended') ||
    problem.includes('harder to judge reliably') ||
    solution.includes('make the question more precise') ||
    solution.includes('make it directly markable')
  ) {
    return category === 'markingrobustness' ? 'marking_robustness_weak' : 'question_too_open_ended';
  }

  if (
    problem.includes('bundle') ||
    problem.includes('two tasks') ||
    solution.includes('unbundle') ||
    solution.includes('split into one direct')
  ) {
    return 'question_bundle_or_double_barrelled';
  }

  if (
    problem.includes('drifts from the intended lo') ||
    problem.includes('drifts from the lo') ||
    solution.includes('align the question directly to the lo')
  ) {
    return 'lo_alignment_drift';
  }

  if (category === 'beginnerclarity') {
    return 'beginner_clarity_soft';
  }

  if (result) {
    const repairClass = findMatchingFix(issue, result)?.repairClass;
    if (repairClass === 'deeper_question_rewrite') return 'meta_deeper_question';
    if (repairClass === 'basic_question_rewrite') return 'question_too_open_ended';
    if (repairClass === 'teaching_field_rewrite') return 'method_not_taught_before_question';
  }

  return 'generic_other';
}

export function buildDynamicGenerationAnalyticsPayload(input: {
  context: DynamicGenerationAnalyticsContext;
  result: DynamicLessonGenerationResult;
  artifactPath?: string | null;
  exportedAt?: string | null;
}): DynamicGenerationAnalyticsPayload {
  const { context, result } = input;
  const repairSummary = result.repairSummary ?? null;
  const runFingerprint = buildDynamicGenerationRunFingerprint(input);

  const runRow: DynamicGenerationRunAnalyticsRow = {
    lesson_code: context.lessonCode,
    source_context: context.sourceContext ?? null,
    prompt_version: inferPromptVersion(context),
    run_fingerprint: runFingerprint,
    origin: context.origin,
    accepted: result.accepted,
    refined: result.refined,
    lesson_score: result.score.total,
    lesson_grade: result.score.grade,
    plan_score: result.planScore.total,
    fidelity_score: result.fidelityScore.total,
    validation_passed: result.validation.passed,
    issue_count: result.score.issues.length,
    remaining_patchable_issue_count: result.fixPlan?.fixes.length ?? 0,
    attempted_patch_count: repairSummary?.attemptedPatchCount ?? 0,
    accepted_patch_count: repairSummary?.acceptedPatchCount ?? 0,
    repair_stop_reason: repairSummary?.repairStopReason ?? null,
    rejection_reason: result.rejectionReason,
    report_json: {
      score: result.score,
      planScore: result.planScore,
      fidelityScore: result.fidelityScore,
      validation: result.validation,
      fixPlan: result.fixPlan ?? null,
    },
    repair_summary_json: repairSummary as Record<string, unknown> | null,
  };

  const issueRows: DynamicGenerationIssueAnalyticsRow[] = result.score.issues.map((issue, index) => {
    const matchingFix = findMatchingFix(issue, result);
    return {
      lesson_code: context.lessonCode,
      issue_index: index,
      category: issue.category,
      problem: issue.problem,
      why_it_matters: issue.whyItMatters ?? null,
      solution: issue.solution ?? null,
      suggestion: issue.suggestion ?? null,
      json_pointers: issue.jsonPointers ?? [],
      repairable: Boolean(matchingFix),
      repair_class: matchingFix?.repairClass ?? null,
      normalized_key: normalizeDynamicGenerationIssueKey(issue, result),
      resolved_by_repair: false,
      score_phase: 'final',
    };
  });

  return { runRow, issueRows };
}

export async function persistDynamicGenerationAnalytics(input: {
  payload: DynamicGenerationAnalyticsPayload;
}): Promise<{ runId: string; issueCount: number }> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client unavailable. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { data, error } = await adminClient
    .from('dynamic_generation_runs')
    .upsert(input.payload.runRow, { onConflict: 'run_fingerprint' })
    .select('id')
    .single<{ id: string }>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to upsert dynamic generation run analytics.');
  }

  const { error: deleteError } = await adminClient.from('dynamic_generation_issues').delete().eq('run_id', data.id);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (input.payload.issueRows.length === 0) {
    return { runId: data.id, issueCount: 0 };
  }

  const issueRows = input.payload.issueRows.map((row) => ({
    ...row,
    run_id: data.id,
  }));
  const { error: issueError } = await adminClient.from('dynamic_generation_issues').insert(issueRows);
  if (issueError) {
    throw new Error(issueError.message);
  }

  return {
    runId: data.id,
    issueCount: input.payload.issueRows.length,
  };
}

export async function logDynamicGenerationAnalytics(input: {
  context: DynamicGenerationAnalyticsContext;
  result: DynamicLessonGenerationResult;
}): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return;

  const payload = buildDynamicGenerationAnalyticsPayload({
    context: input.context,
    result: input.result,
  });

  try {
    await persistDynamicGenerationAnalytics({ payload });
  } catch (error) {
    console.warn('[dynamic-generation-analytics] write failed', {
      lessonCode: input.context.lessonCode,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
