import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import type { DynamicLessonGenerationResult } from '@/lib/dynamicGuidedV2/generation/types';
import {
  buildDynamicGenerationAnalyticsPayload,
  persistDynamicGenerationAnalytics,
  type DynamicGenerationAnalyticsContext,
} from '@/lib/dynamicGuidedV2/generationAnalyticsStore';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type {
  DynamicDiagnosticScore,
  DynamicGenerationPhaseArtifact,
  DynamicLessonGenerationScore,
  DynamicLessonGenerationValidation,
} from '@/lib/dynamicGuidedV2/versionStore';
import type { DynamicFixPlan, DynamicRepairSummary } from '@/lib/dynamicGuidedV2/generation/types';

type StoredArtifact = {
  lessonCode: string;
  exportedAt?: string | null;
  accepted: boolean;
  refined: boolean;
  rejectionReason: string | null;
  sourceContext?: string | null;
  lesson: DynamicGuidedV2Lesson;
  score: DynamicLessonGenerationScore;
  planScore: DynamicDiagnosticScore;
  fidelityScore: DynamicDiagnosticScore;
  validation: DynamicLessonGenerationValidation;
  fixPlan?: DynamicFixPlan | null;
  repairSummary?: DynamicRepairSummary | null;
  phases?: DynamicGenerationPhaseArtifact[];
  candidateLesson?: DynamicGuidedV2Lesson | null;
  candidateValidation?: DynamicLessonGenerationValidation | null;
  candidateScore?: DynamicLessonGenerationScore | null;
  postRepairScore?: DynamicLessonGenerationScore | null;
};

const ROOT = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const TIMESTAMPED_RUN_PATTERN = /^[0-9]{8}-[0-9]{6}z-(accepted|rejected)\.json$/i;

loadEnvConfig(process.cwd());

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function listArtifactFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((lessonDir) =>
      fs
        .readdirSync(path.join(root, lessonDir.name), { withFileTypes: true })
        .filter((entry) => entry.isFile() && TIMESTAMPED_RUN_PATTERN.test(entry.name))
        .map((entry) => path.join(root, lessonDir.name, entry.name))
    )
    .sort((left, right) => left.localeCompare(right));
}

function buildResultFromArtifact(artifact: StoredArtifact): DynamicLessonGenerationResult {
  const fallbackDiagnostic: DynamicDiagnosticScore = {
    total: 0,
    grade: 'rework',
    breakdown: {},
    issues: [],
    summary: 'Legacy artifact did not store this diagnostic score.',
  };

  return {
    lesson: artifact.lesson,
    phases: artifact.phases ?? [],
    validation: artifact.validation,
    score: artifact.score,
    planScore: artifact.planScore ?? fallbackDiagnostic,
    fidelityScore: artifact.fidelityScore ?? fallbackDiagnostic,
    refined: artifact.refined,
    accepted: artifact.accepted,
    rejectionReason: artifact.rejectionReason,
    candidateLesson: artifact.candidateLesson ?? null,
    candidateValidation: artifact.candidateValidation ?? null,
    candidateScore: artifact.candidateScore ?? null,
    postRepairScore: artifact.postRepairScore ?? null,
    repairSummary: artifact.repairSummary ?? null,
    fixPlan: artifact.fixPlan ?? null,
  };
}

function buildBackfillContext(filePath: string, artifact: StoredArtifact): DynamicGenerationAnalyticsContext {
  return {
    lessonCode: artifact.lessonCode,
    sourceContext: artifact.sourceContext ?? null,
    origin: 'artifact_backfill',
    runFingerprint: `artifact:${path.relative(process.cwd(), filePath).replace(/\\/g, '/')}`,
  };
}

async function main(): Promise<void> {
  const files = listArtifactFiles(ROOT);
  if (files.length === 0) {
    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          artifactRoot: ROOT,
          scannedFiles: 0,
          backfilledRuns: 0,
          backfilledIssues: 0,
        },
        null,
        2
      )
    );
    return;
  }

  let backfilledRuns = 0;
  let backfilledIssues = 0;

  for (const filePath of files) {
    const artifact = readJsonFile<StoredArtifact>(filePath);
    const result = buildResultFromArtifact(artifact);
    const payload = buildDynamicGenerationAnalyticsPayload({
      context: buildBackfillContext(filePath, artifact),
      result,
      artifactPath: filePath,
      exportedAt: artifact.exportedAt ?? null,
    });
    const persisted = await persistDynamicGenerationAnalytics({ payload });
    backfilledRuns += 1;
    backfilledIssues += persisted.issueCount;
  }

  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        artifactRoot: ROOT,
        scannedFiles: files.length,
        backfilledRuns,
        backfilledIssues,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('[backfill-dynamic-generation-issues] failed', error);
  process.exitCode = 1;
});
