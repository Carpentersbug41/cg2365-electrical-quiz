#!/usr/bin/env tsx

import { GCSE_BIOLOGY_PHASE1_TARGET } from '../src/data/v2/gcse/biology/phase1Target';
import { createConfiguredAdminClient, loadEnvFiles, validatePhase1Lessons } from './lib/v2ContentWorkflow';

async function main() {
  loadEnvFiles();
  const adminClient = await createConfiguredAdminClient();
  const validation = await validatePhase1Lessons(
    adminClient,
    GCSE_BIOLOGY_PHASE1_TARGET.map((lesson) => lesson.lessonCode)
  );

  console.log(
    JSON.stringify(
      {
        success: validation.every((row) => row.issues.length === 0),
        validation,
      },
      null,
      2
    )
  );

  if (validation.some((row) => row.issues.length > 0)) {
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
