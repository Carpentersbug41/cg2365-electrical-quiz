import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { DynamicLessonGenerator } from '@/lib/dynamicGuidedV2/generation/DynamicLessonGenerator';
import type { DynamicLessonGenerationInput, DynamicLessonStageDescriptor } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicLessonGenerationResult } from '@/lib/dynamicGuidedV2/generation/types';

type ExportedArtifact = {
  lessonCode: string;
  sourceContext?: string | null;
  lesson: DynamicGuidedV2Lesson;
  phases: Array<{
    phase: string;
    output?: {
      userPrompt?: string;
    };
  }>;
};

const ROOT = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const REPORT_PATH = path.join(process.cwd(), '.runtime', 'dynamic-generation-benchmark.json');
const BENCHMARK_CODES = [
  '202-1A',
  '202-2B',
  '202-4A',
  '202-4B',
  '202-4D',
  '202-5A',
  '203-1A',
  '203-3A',
  '203-4A',
  '203-5A',
] as const;
const LESSON_SCORE_GATE = 90;
const PLAN_SCORE_GATE = 90;
const FIDELITY_SCORE_GATE = 95;

function summarizeProblems(problems: string[], maxItems = 3): string | null {
  const uniqueProblems = [...new Set(problems.map((item) => item.trim()).filter(Boolean))];
  if (uniqueProblems.length === 0) return null;
  return uniqueProblems.slice(0, maxItems).join(' | ');
}

function mapReportedIssues(generated: DynamicLessonGenerationResult): Array<Record<string, unknown>> {
  return generated.score.issues.map((issue) => ({
    id: issue.id,
    category: issue.category,
    problem: issue.problem,
    jsonPointers: issue.jsonPointers,
    solution: issue.solution ?? issue.suggestion,
    suggestion: issue.suggestion,
  }));
}

function mapRemainingPatchableIssues(generated: DynamicLessonGenerationResult): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  return (generated.fixPlan?.fixes ?? [])
    .filter((fix) => fix.targetPointer)
    .filter((fix) => {
      const key = `${fix.repairClass}::${fix.targetPointer}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((fix) => ({
      repairClass: fix.repairClass,
      targetPointer: fix.targetPointer,
      problem: fix.problem,
    }));
}

function mapResolvedRepairTargets(generated: DynamicLessonGenerationResult): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  return (generated.repairSummary?.repairAttempts ?? [])
    .filter((attempt) => attempt.patchAccepted)
    .filter((attempt) => {
      const key = `${attempt.repairClass}::${attempt.targetPointer}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((attempt) => ({
      repairClass: attempt.repairClass,
      targetPointer: attempt.targetPointer,
      round: attempt.round,
    }));
}

function buildScoreDiagnosis(generated: DynamicLessonGenerationResult): Record<string, unknown> {
  const scoreGapTo95 = Math.max(0, LESSON_SCORE_GATE - generated.score.total);
  const issueProblems = generated.score.issues.map((issue) => issue.problem);
  const whyNot95 = summarizeProblems(issueProblems);
  const fixCount = generated.fixPlan?.fixes.length ?? 0;
  const repairSummary = generated.repairSummary ?? null;
  const remainingPatchableIssueCount = (generated.fixPlan?.fixes ?? []).length;

  if (generated.score.total >= LESSON_SCORE_GATE) {
    return {
      scoreGapTo95,
      remainingIssueCount: generated.score.issues.length,
      remainingPatchableIssueCount,
      whyNot95: null,
      promptImprovementLikely: false,
      repairImprovementLikely: false,
      recommendedNextMove: 'none',
      rationale: 'The lesson already cleared the 95 lesson-score gate.',
    };
  }

  if (!repairSummary?.phase12Ran) {
    if (fixCount > 0) {
      return {
        scoreGapTo95,
        remainingIssueCount: generated.score.issues.length,
        remainingPatchableIssueCount,
        whyNot95,
        promptImprovementLikely: true,
        repairImprovementLikely: true,
        recommendedNextMove: 'Improve repair routing/repair-class coverage first, then tighten the generation prompt for the flagged chunk.',
        rationale: 'Phase 11 found repair targets, but Phase 12 did not run. The generation defect is real, and the repair pipeline did not engage on it.',
      };
    }
    return {
      scoreGapTo95,
      remainingIssueCount: generated.score.issues.length,
      remainingPatchableIssueCount,
      whyNot95,
      promptImprovementLikely: true,
      repairImprovementLikely: false,
      recommendedNextMove: 'Improve the generation prompt or chunk-level validation for the flagged issue.',
      rationale: 'No usable repair target was produced, so the score gap is currently a generation-side problem.',
    };
  }

  if (!repairSummary.specificPromptReturnedPatch) {
    return {
      scoreGapTo95,
      remainingIssueCount: generated.score.issues.length,
      remainingPatchableIssueCount,
      whyNot95,
      promptImprovementLikely: false,
      repairImprovementLikely: true,
      recommendedNextMove: 'Improve the specific repair prompt for this repair class or add a better repair class.',
      rationale: 'Phase 12 ran, but the specific repair prompt did not return a patch.',
    };
  }

  if (repairSummary.fallbackPromptRan && !repairSummary.fallbackPromptReturnedPatch) {
    return {
      scoreGapTo95,
      remainingIssueCount: generated.score.issues.length,
      remainingPatchableIssueCount,
      whyNot95,
      promptImprovementLikely: false,
      repairImprovementLikely: true,
      recommendedNextMove: 'Improve the general fallback repair prompt or repair-target framing.',
      rationale: 'Both the specific prompt and the fallback path failed to produce a usable patch.',
    };
  }

  if (!repairSummary.patchAccepted) {
    return {
      scoreGapTo95,
      remainingIssueCount: generated.score.issues.length,
      remainingPatchableIssueCount,
      whyNot95,
      promptImprovementLikely: false,
      repairImprovementLikely: true,
      recommendedNextMove: 'Improve repair acceptance criteria or the repair prompt output quality for the targeted field.',
      rationale: repairSummary.patchRejectedReason ?? 'A patch was produced, but it was rejected before becoming the kept candidate.',
    };
  }

  return {
    scoreGapTo95,
    remainingIssueCount: generated.score.issues.length,
    remainingPatchableIssueCount,
    whyNot95,
    promptImprovementLikely: true,
    repairImprovementLikely: false,
    recommendedNextMove: 'Improve generation quality for the remaining content issues; the repair path already landed a patch.',
    rationale: 'A repair was accepted, but the kept lesson still remained below the 95 lesson-score gate due to remaining content quality issues.',
  };
}

function resolveBenchmarkCodes(): string[] {
  const override = String(process.env.DYNAMIC_BENCHMARK_CODES ?? '')
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  return override.length > 0 ? override : [...BENCHMARK_CODES];
}

loadEnvConfig(process.cwd());

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function extractGroundedSourceText(artifact: ExportedArtifact): string {
  const phase = artifact.phases.find((entry) => entry.phase === 'Phase 1 Planning');
  const userPrompt = phase?.output?.userPrompt;
  if (typeof userPrompt !== 'string') {
    throw new Error(`Missing Phase 1 Planning prompt for ${artifact.lessonCode}`);
  }

  const marker = 'Grounded source text:\n';
  const start = userPrompt.indexOf(marker);
  if (start < 0) {
    throw new Error(`Could not locate grounded source text in Phase 1 prompt for ${artifact.lessonCode}`);
  }

  const from = start + marker.length;
  const endMarker = '\n\nReturn JSON in this shape:';
  const end = userPrompt.indexOf(endMarker, from);
  if (end < 0) {
    throw new Error(`Could not locate end of grounded source text in Phase 1 prompt for ${artifact.lessonCode}`);
  }

  return userPrompt.slice(from, end).trim();
}

function buildStagePlan(lesson: DynamicGuidedV2Lesson): DynamicLessonStageDescriptor[] {
  const chunkFirstSteps = lesson.steps.filter((step) => step.stage === 'intro' || step.stage === 'teach_check');
  const sourceSteps = chunkFirstSteps.length > 0 ? chunkFirstSteps : lesson.steps;
  return sourceSteps.map((step) => ({
    key: step.id,
    title: step.title,
    role: step.role as DynamicLessonStageDescriptor['role'],
    stage: step.stage as DynamicLessonStageDescriptor['stage'],
    objective: step.objective,
    progressionRule: step.progressionRule as DynamicLessonStageDescriptor['progressionRule'],
    completionMode: step.completionMode,
  }));
}

function buildGenerationInput(artifact: ExportedArtifact): DynamicLessonGenerationInput {
  return {
    lessonCode: artifact.lesson.lessonCode,
    title: artifact.lesson.title,
    unit: artifact.lesson.unit,
    topic: artifact.lesson.title,
    subject: artifact.lesson.subject,
    audience: artifact.lesson.audience,
    tonePrompt: artifact.lesson.tonePrompt,
    sourceText: extractGroundedSourceText(artifact),
    sourceContext: artifact.sourceContext ?? undefined,
    stagePlan: buildStagePlan(artifact.lesson),
  };
}

async function main(): Promise<void> {
  const generator = new DynamicLessonGenerator();
  const results: Array<Record<string, unknown>> = [];

  const benchmarkCodes = resolveBenchmarkCodes();

  for (const lessonCode of benchmarkCodes) {
    const latestPath = path.join(ROOT, lessonCode.toLowerCase(), 'latest.json');
    if (!fs.existsSync(latestPath)) {
      throw new Error(`Missing exported artifact for ${lessonCode}: ${latestPath}`);
    }

    const artifact = readJsonFile<ExportedArtifact>(latestPath);
    const generationInput = buildGenerationInput(artifact);
    const startedAt = Date.now();
    const generated = await generator.generate(generationInput);
    const elapsedMs = Date.now() - startedAt;
    const lessonPassed = generated.score.total >= LESSON_SCORE_GATE;
    const planPassed = generated.planScore.total >= PLAN_SCORE_GATE;
    const fidelityPassed = generated.fidelityScore.total >= FIDELITY_SCORE_GATE;
    const validationPassed = generated.validation.passed;

    results.push({
      lessonCode,
      title: generationInput.title,
      accepted: generated.accepted,
      lessonScore: generated.score.total,
      lessonGrade: generated.score.grade,
      planScore: generated.planScore.total,
      planGrade: generated.planScore.grade,
      fidelityScore: generated.fidelityScore.total,
      fidelityGrade: generated.fidelityScore.grade,
      validationPassed,
      issueCount: generated.score.issues.length,
      issues: mapReportedIssues(generated),
      remainingPatchableIssues: mapRemainingPatchableIssues(generated),
      resolvedRepairTargets: mapResolvedRepairTargets(generated),
      topIssue: generated.score.issues[0]?.problem ?? null,
      rejectionReason: generated.rejectionReason,
      repairSummary: generated.repairSummary ?? null,
      diagnosis: buildScoreDiagnosis(generated),
      elapsedMs,
      meetsGate: lessonPassed && planPassed && fidelityPassed && validationPassed,
    });
    console.log(`[dynamic-generation-benchmark] ${lessonCode} lesson=${generated.score.total} plan=${generated.planScore.total} fidelity=${generated.fidelityScore.total}`);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      lessonScore: LESSON_SCORE_GATE,
      planScore: PLAN_SCORE_GATE,
      fidelityScore: FIDELITY_SCORE_GATE,
    },
    passCount: results.filter((item) => item.meetsGate).length,
    failCount: results.filter((item) => !item.meetsGate).length,
    results,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary, null, 2));

  if (summary.failCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[runDynamicGenerationBenchmark] failed', error);
  process.exitCode = 1;
});
