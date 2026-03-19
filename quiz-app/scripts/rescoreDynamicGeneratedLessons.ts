import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { DynamicLessonGenerator } from '@/lib/dynamicGuidedV2/generation/DynamicLessonGenerator';
import type {
  DynamicLessonGenerationInput,
  DynamicPlanningPhaseOutput,
  DynamicSpacedReviewPhaseOutput,
  DynamicVocabularyPhaseOutput,
} from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';

type ExportedArtifact = {
  lessonCode: string;
  sourceContext?: string | null;
  lesson: DynamicGuidedV2Lesson;
  score: {
    total: number;
    grade: string;
    issues?: Array<{ problem?: string }>;
  };
  validation: {
    passed: boolean;
    issues: string[];
  };
  phases: Array<{
    phase: string;
    output?: {
      parsed?: unknown;
      userPrompt?: string;
    };
  }>;
};

const ROOT = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const LESSON_CODES = ['203-1A', '203-3A', '203-4A', '203-5A'];

loadEnvConfig(process.cwd());

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function findPhase<T>(artifact: ExportedArtifact, phaseName: string): T {
  const phase = artifact.phases.find((entry) => entry.phase === phaseName);
  if (!phase?.output || typeof phase.output !== 'object' || !('parsed' in phase.output)) {
    throw new Error(`Missing ${phaseName} parsed output in exported artifact for ${artifact.lessonCode}`);
  }
  return phase.output.parsed as T;
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
    sourceContext: artifact.sourceContext ?? null ?? undefined,
  };
}

async function main(): Promise<void> {
  const generator = new DynamicLessonGenerator();
  const results: Array<Record<string, unknown>> = [];

  for (const lessonCode of LESSON_CODES) {
    const folder = path.join(ROOT, lessonCode.toLowerCase());
    const latestPath = path.join(folder, 'latest.json');
    const artifact = readJsonFile<ExportedArtifact>(latestPath);
    const planning = findPhase<DynamicPlanningPhaseOutput>(artifact, 'Phase 1 Planning');
    const vocabulary = findPhase<DynamicVocabularyPhaseOutput>(artifact, 'Phase 2 Vocabulary');
    const spacedReview = findPhase<DynamicSpacedReviewPhaseOutput>(artifact, 'Phase 8 Spaced Review');
    const generationInput = buildGenerationInput(artifact);

    const rescored = await generator.rescoreLesson({
      generationInput,
      lesson: artifact.lesson,
      planning,
      vocabulary,
      spacedReview,
    });

    results.push({
      lessonCode,
      folder,
      previousScore: artifact.score.total,
      previousGrade: artifact.score.grade,
      rescoredScore: rescored.score.total,
      rescoredGrade: rescored.score.grade,
      previousValidationPassed: artifact.validation.passed,
      rescoredValidationPassed: rescored.validation.passed,
      previousTopIssue: artifact.score.issues?.[0]?.problem ?? null,
      rescoredTopIssue: rescored.score.issues[0]?.problem ?? null,
      rescoreError:
        rescored.phaseArtifact.output &&
        typeof rescored.phaseArtifact.output === 'object' &&
        'error' in rescored.phaseArtifact.output
          ? (rescored.phaseArtifact.output as { error?: string | null }).error ?? null
          : null,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error('[rescore-dynamic-generated-lessons] failed', error);
  process.exitCode = 1;
});
