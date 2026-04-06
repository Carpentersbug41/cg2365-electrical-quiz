#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { DynamicLessonGenerator } from '@/lib/dynamicGuidedV2/generation/DynamicLessonGenerator';
import { evaluateDynamicLessonIndependently } from '@/lib/dynamicGuidedV2/generation/independentEvaluator';
import type {
  DynamicLessonGenerationInput,
  DynamicLessonStageDescriptor,
  DynamicPromptVariantId,
} from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';

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

type VariantDefinition = {
  id: DynamicPromptVariantId;
  label: string;
  targetPhase: 'baseline' | 'phase3' | 'phase4' | 'phase41';
  changedVariable: string;
};

type ExperimentRunResult = {
  variantId: DynamicPromptVariantId;
  variantLabel: string;
  targetPhase: VariantDefinition['targetPhase'];
  changedVariable: string;
  lessonCode: string;
  runSucceeded: boolean;
  accepted: boolean;
  validationPassed: boolean;
  generatorScoreTotal: number;
  generatorGrade: string;
  generatorTopIssue: string | null;
  independentScoreTotal: number | null;
  independentBreakdown: Record<string, number> | null;
  independentTopIssues: Array<{ category: string; problem: string; jsonPointers: string[] }>;
  artifactPath: string;
  evaluationError: string | null;
  runError: string | null;
};

type ExperimentSummary = {
  createdAt: string;
  lessons: string[];
  variants: VariantDefinition[];
  initialRuns: ExperimentRunResult[];
  confirmationRuns: ExperimentRunResult[];
  promotedVariants: DynamicPromptVariantId[];
};

const ROOT = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const OUTPUT_ROOT = path.join(process.cwd(), '.runtime', 'prompt-experiments', 'phase34');
const LESSON_CODES = ['203-4A', '203-5A', '202-5A'] as const;

const VARIANTS: VariantDefinition[] = [
  { id: 'baseline', label: 'B0 Baseline', targetPhase: 'baseline', changedVariable: 'No prompt changes' },
  { id: 'p3_markdown_revert', label: 'P3-V1 Markdown revert', targetPhase: 'phase3', changedVariable: 'Phase 3 markdown removed' },
  { id: 'p3_critical_order', label: 'P3-V2 Critical order', targetPhase: 'phase3', changedVariable: 'Phase 3 critical instruction order' },
  { id: 'p3_few_shot_mini_example', label: 'P3-V3 Few-shot mini example', targetPhase: 'phase3', changedVariable: 'Phase 3 minimal positive example' },
  { id: 'p3_instruction_compression', label: 'P3-V4 Instruction compression', targetPhase: 'phase3', changedVariable: 'Phase 3 shorter equivalent steps' },
  { id: 'p4_context_cleanup', label: 'P4-V0 Context cleanup', targetPhase: 'phase4', changedVariable: 'Phase 4 literal wording without markdown' },
  { id: 'p4_markdown_only', label: 'P4-V1 Markdown only', targetPhase: 'phase4', changedVariable: 'Phase 4 markdown formatting only' },
  { id: 'p4_critical_rule_order', label: 'P4-V2 Critical rule order', targetPhase: 'phase4', changedVariable: 'Phase 4 chunk-local rules moved to top' },
  { id: 'p4_few_shot_positive', label: 'P4-V3 Positive few-shot', targetPhase: 'phase4', changedVariable: 'Phase 4 positive example only' },
  { id: 'p4_contrastive_example', label: 'P4-V4 Contrastive example', targetPhase: 'phase4', changedVariable: 'Phase 4 bad/good contrast example' },
  { id: 'p41_anti_meta', label: 'P4.1-V1 Anti-meta deeper checks', targetPhase: 'phase41', changedVariable: 'Phase 4.1 anti-meta deeper-question rule' },
  { id: 'p41_markdown_only', label: 'P4.1-V2 Markdown only', targetPhase: 'phase41', changedVariable: 'Phase 4.1 markdown formatting only' },
  { id: 'p41_few_shot_positive', label: 'P4.1-V3 Positive few-shot', targetPhase: 'phase41', changedVariable: 'Phase 4.1 positive example only' },
];

loadEnvConfig(process.cwd());

function resolveLessonCodes(): string[] {
  const override = String(process.env.DYNAMIC_EXPERIMENT_LESSONS ?? '')
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  return override.length > 0 ? override : [...LESSON_CODES];
}

function resolveVariants(): VariantDefinition[] {
  const override = String(process.env.DYNAMIC_EXPERIMENT_VARIANTS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (override.length === 0) return VARIANTS;
  return VARIANTS.filter((variant) => override.includes(variant.id));
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
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

function computeAverageIndependentScore(results: ExperimentRunResult[], variantId: DynamicPromptVariantId): number | null {
  const matching = results.filter(
    (result) => result.variantId === variantId && result.runSucceeded && result.independentScoreTotal !== null
  );
  if (matching.length === 0) return null;
  return matching.reduce((sum, result) => sum + (result.independentScoreTotal ?? 0), 0) / matching.length;
}

function getValidationFailures(results: ExperimentRunResult[], variantId: DynamicPromptVariantId): number {
  return results.filter((result) => result.variantId === variantId && (!result.runSucceeded || !result.validationPassed)).length;
}

function buildMarkdownSummary(summary: ExperimentSummary): string {
  const baselineAverage = computeAverageIndependentScore(summary.initialRuns, 'baseline');
  const lines: string[] = [
    '# Phase 3/4 Prompt Experiment Summary',
    '',
    `Created: ${summary.createdAt}`,
    `Lessons: ${summary.lessons.join(', ')}`,
    '',
    '## Initial pass',
    '',
    '| Variant | Phase | Avg independent | Avg delta vs baseline | Validation failures |',
    '| --- | --- | ---: | ---: | ---: |',
  ];

  for (const variant of summary.variants) {
    const average = computeAverageIndependentScore(summary.initialRuns, variant.id);
    const delta = baselineAverage !== null && average !== null ? average - baselineAverage : null;
    lines.push(
      `| ${variant.label} | ${variant.targetPhase} | ${average?.toFixed(2) ?? 'n/a'} | ${delta !== null ? delta.toFixed(2) : 'n/a'} | ${getValidationFailures(summary.initialRuns, variant.id)} |`
    );
  }

  if (summary.promotedVariants.length > 0) {
    lines.push('', '## Confirmation reruns', '', `Promoted variants: ${summary.promotedVariants.join(', ')}`, '');
  } else {
    lines.push('', '## Confirmation reruns', '', 'No variants met the promotion rule.', '');
  }

  return lines.join('\n');
}

async function runVariant(
  variant: VariantDefinition,
  lessonCode: string,
  runRoot: string
): Promise<ExperimentRunResult> {
  const latestPath = path.join(ROOT, lessonCode.toLowerCase(), 'latest.json');
  const artifact = readJsonFile<ExportedArtifact>(latestPath);
  const generationInput = buildGenerationInput(artifact);
  const generator = new DynamicLessonGenerator({
    promptVariantId: variant.id,
    disableAnalyticsLogging: true,
  });

  const variantDir = path.join(runRoot, variant.id);
  ensureDir(variantDir);
  const artifactPath = path.join(variantDir, `${lessonCode}.json`);
  try {
    const generated = await generator.generate(generationInput);
    fs.writeFileSync(
      artifactPath,
      JSON.stringify(
        {
          variantId: variant.id,
          lessonCode,
          lesson: generated.lesson,
          score: generated.score,
          validation: generated.validation,
        },
        null,
        2
      ),
      'utf8'
    );

    let independentScoreTotal: number | null = null;
    let independentBreakdown: Record<string, number> | null = null;
    let independentTopIssues: Array<{ category: string; problem: string; jsonPointers: string[] }> = [];
    let evaluationError: string | null = null;

    try {
      const independent = await evaluateDynamicLessonIndependently({
        generationInput,
        lesson: generated.lesson,
      });
      independentScoreTotal = independent.total;
      independentBreakdown = independent.breakdown;
      independentTopIssues = independent.issues.map((issue) => ({
        category: issue.category,
        problem: issue.problem,
        jsonPointers: issue.jsonPointers,
      }));
    } catch (error) {
      evaluationError = error instanceof Error ? error.message : String(error);
    }

    return {
      variantId: variant.id,
      variantLabel: variant.label,
      targetPhase: variant.targetPhase,
      changedVariable: variant.changedVariable,
      lessonCode,
      runSucceeded: true,
      accepted: generated.accepted,
      validationPassed: generated.validation.passed,
      generatorScoreTotal: generated.score.total,
      generatorGrade: generated.score.grade,
      generatorTopIssue: generated.score.issues[0]?.problem ?? null,
      independentScoreTotal,
      independentBreakdown,
      independentTopIssues,
      artifactPath,
      evaluationError,
      runError: null,
    };
  } catch (error) {
    const runError = error instanceof Error ? error.message : String(error);
    fs.writeFileSync(
      artifactPath,
      JSON.stringify(
        {
          variantId: variant.id,
          lessonCode,
          error: runError,
        },
        null,
        2
      ),
      'utf8'
    );
    return {
      variantId: variant.id,
      variantLabel: variant.label,
      targetPhase: variant.targetPhase,
      changedVariable: variant.changedVariable,
      lessonCode,
      runSucceeded: false,
      accepted: false,
      validationPassed: false,
      generatorScoreTotal: 0,
      generatorGrade: 'failed',
      generatorTopIssue: null,
      independentScoreTotal: null,
      independentBreakdown: null,
      independentTopIssues: [],
      artifactPath,
      evaluationError: null,
      runError,
    };
  }
}

async function main(): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const runRoot = path.join(OUTPUT_ROOT, timestamp);
  ensureDir(runRoot);
  const lessonCodes = resolveLessonCodes();
  const variants = resolveVariants();

  const initialRuns: ExperimentRunResult[] = [];
  for (const variant of variants) {
    for (const lessonCode of lessonCodes) {
      console.log(`[phase34-experiment] initial ${variant.id} ${lessonCode}`);
      initialRuns.push(await runVariant(variant, lessonCode, runRoot));
    }
  }

  const baselineAverage = computeAverageIndependentScore(initialRuns, 'baseline');
  const baselineValidationFailures = getValidationFailures(initialRuns, 'baseline');
  const promotedVariants = variants.filter((variant) => {
    if (variant.id === 'baseline') return false;
    const average = computeAverageIndependentScore(initialRuns, variant.id);
    if (average === null || baselineAverage === null) return false;
    const validationFailures = getValidationFailures(initialRuns, variant.id);
    return average - baselineAverage >= 2 && validationFailures <= baselineValidationFailures;
  }).map((variant) => variant.id);

  const confirmationRuns: ExperimentRunResult[] = [];
  for (const variantId of promotedVariants) {
    const variant = variants.find((entry) => entry.id === variantId);
    if (!variant) continue;
    const baselineVariant = variants.find((entry) => entry.id === 'baseline');
    if (!baselineVariant) break;
    for (const rerunVariant of [baselineVariant, variant]) {
      for (const lessonCode of lessonCodes) {
        console.log(`[phase34-experiment] confirmation ${rerunVariant.id} ${lessonCode}`);
        confirmationRuns.push(await runVariant(rerunVariant, lessonCode, path.join(runRoot, 'confirmation')));
      }
    }
  }

  const summary: ExperimentSummary = {
    createdAt: new Date().toISOString(),
    lessons: lessonCodes,
    variants,
    initialRuns,
    confirmationRuns,
    promotedVariants,
  };

  fs.writeFileSync(path.join(runRoot, 'results.json'), JSON.stringify(summary, null, 2), 'utf8');
  fs.writeFileSync(path.join(runRoot, 'summary.md'), buildMarkdownSummary(summary), 'utf8');
  console.log(`[phase34-experiment] wrote ${path.join(runRoot, 'results.json')}`);
}

main().catch((error) => {
  console.error('[phase34-experiment] failed', error);
  process.exitCode = 1;
});
