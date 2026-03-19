#!/usr/bin/env tsx

import { GCSE_BIOLOGY_PHASE1_TARGET } from '../src/data/v2/gcse/biology/phase1Target';
import { getGcseBiologyPhase1LessonProfile } from '../src/data/v2/gcse/biology/phase1LessonProfiles';
import {
  createConfiguredAdminClient,
  generateDraftForLesson,
  loadEnvFiles,
  publishLatestLessonVersion,
  validatePhase1Lessons,
} from './lib/v2ContentWorkflow';

function parseArgs(argv: string[]) {
  const lessonCodeArgs = argv.filter((arg, index) => argv[index - 1] === '--lessonCode' || argv[index - 1] === '--lessonCodes');
  return {
    includeCompleted: argv.includes('--includeCompleted'),
    lessonCodes: lessonCodeArgs
      .flatMap((value) => value.split(','))
      .map((value) => value.trim().toUpperCase())
      .filter((value) => value.length > 0),
  };
}

async function main() {
  loadEnvFiles();
  const options = parseArgs(process.argv.slice(2));
  const adminClient = await createConfiguredAdminClient();

  const defaultTargetCodes = GCSE_BIOLOGY_PHASE1_TARGET
    .map((lesson) => lesson.lessonCode)
    .filter((lessonCode) => options.includeCompleted || lessonCode !== 'BIO-101-1A');
  const targetCodes = options.lessonCodes.length > 0 ? options.lessonCodes : defaultTargetCodes;

  const results: Array<Record<string, unknown>> = [];
  for (const lessonCode of targetCodes) {
    const profile = getGcseBiologyPhase1LessonProfile(lessonCode);
    if (!profile) {
      throw new Error(`No Phase 1 lesson profile configured for ${lessonCode}.`);
    }

    const parts = lessonCode.split('-');
    const generated = await generateDraftForLesson(
      adminClient,
      {
        curriculum: 'gcse-science-biology',
        unit: `${parts[0]}-${parts[1]}`,
        lessonId: parts[2],
        topic: profile.topic,
        section: 'GCSE Science Biology',
        layout: 'linear-flow',
        prerequisites: [],
        mustHaveTopics: profile.mustHaveTopics,
        additionalInstructions: profile.additionalInstructions,
      },
      'cli_v2_phase1_batch_generate'
    );

    const published = await publishLatestLessonVersion(adminClient, lessonCode, generated.qualityScore ?? undefined);
    if (published.alreadyPublished !== true && published.questionSync.questionCount <= 0) {
      throw new Error(`Question sync produced no coverage for ${lessonCode}.`);
    }

    results.push({
      lessonCode,
      generated,
      published,
    });
  }

  const validation = await validatePhase1Lessons(
    adminClient,
    GCSE_BIOLOGY_PHASE1_TARGET.map((lesson) => lesson.lessonCode)
  );
  const failures = validation.filter((row) => row.issues.length > 0);
  if (failures.length > 0) {
    throw new Error(`Phase 1 validation failed for: ${failures.map((row) => row.lessonCode).join(', ')}`);
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        processedLessons: targetCodes,
        results,
        validation,
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
