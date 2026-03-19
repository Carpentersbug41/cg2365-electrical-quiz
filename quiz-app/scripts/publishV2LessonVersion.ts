#!/usr/bin/env tsx

import { createConfiguredAdminClient, loadEnvFiles, publishLatestLessonVersion } from './lib/v2ContentWorkflow';

function parseArgs(argv: string[]): { lessonCode: string; qualityScore?: number } {
  let lessonCode = '';
  let qualityScore: number | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if ((arg === '--lessonCode' || arg === '--lesson') && next) {
      lessonCode = next.trim().toUpperCase();
      index += 1;
      continue;
    }
    if (arg === '--qualityScore' && next) {
      qualityScore = Number.parseFloat(next);
      index += 1;
    }
  }

  if (!lessonCode) {
    throw new Error('Usage: npx tsx scripts/publishV2LessonVersion.ts --lessonCode BIO-101-1A [--qualityScore 92]');
  }

  return { lessonCode, qualityScore };
}

async function main() {
  loadEnvFiles();

  const options = parseArgs(process.argv.slice(2));
  const adminClient = await createConfiguredAdminClient();
  const published = await publishLatestLessonVersion(adminClient, options.lessonCode, options.qualityScore);

  console.log(
    JSON.stringify(
      {
        success: true,
        ...published,
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
