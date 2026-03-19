#!/usr/bin/env tsx

import { getGcseBiologyPhase1LessonProfile } from '../src/data/v2/gcse/biology/phase1LessonProfiles';
import { createConfiguredAdminClient, generateDraftForLesson, loadEnvFiles } from './lib/v2ContentWorkflow';

type CliOptions = {
  lessonCode: string;
  topic?: string;
  mustHaveTopics?: string;
  additionalInstructions?: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: Partial<CliOptions> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if ((arg === '--lessonCode' || arg === '--lesson') && next) {
      options.lessonCode = next.trim();
      index += 1;
      continue;
    }
    if (arg === '--topic' && next) {
      options.topic = next.trim();
      index += 1;
      continue;
    }
    if (arg === '--mustHaveTopics' && next) {
      options.mustHaveTopics = next;
      index += 1;
      continue;
    }
    if (arg === '--additionalInstructions' && next) {
      options.additionalInstructions = next;
      index += 1;
    }
  }

  if (!options.lessonCode) {
    throw new Error(
      'Usage: npx tsx scripts/generateV2LessonDraft.ts --lessonCode BIO-101-1A [--topic "Cell Structure Basics"]'
    );
  }

  return options as CliOptions;
}

function toGenerationRequest(options: CliOptions) {
  const lessonCode = options.lessonCode.trim().toUpperCase();
  const parts = lessonCode.split('-');
  if (parts.length !== 3) {
    throw new Error(`Unsupported lesson code format: ${options.lessonCode}`);
  }
  const [prefix, unit, lessonId] = parts;
  if (prefix !== 'BIO') {
    throw new Error(`Only BIO lesson codes are supported by this script right now: ${options.lessonCode}`);
  }
  const profile = getGcseBiologyPhase1LessonProfile(lessonCode);
  const topic = options.topic?.trim() || profile?.topic;
  if (!topic) {
    throw new Error(`No topic provided and no Phase 1 lesson profile exists for ${lessonCode}.`);
  }

  return {
    curriculum: 'gcse-science-biology' as const,
    unit: `${prefix}-${unit}`,
    lessonId,
    topic,
    section: 'GCSE Science Biology',
    layout: 'linear-flow' as const,
    prerequisites: [],
    mustHaveTopics:
      options.mustHaveTopics ??
      profile?.mustHaveTopics ??
      `${topic}; nucleus; cell membrane; cytoplasm; mitochondria; ribosomes; plant cell structures; animal vs plant comparison`,
    additionalInstructions:
      options.additionalInstructions ??
      profile?.additionalInstructions ??
      [
        'Generate a rich GCSE biology lesson suitable for V2 publication.',
        'Use a fuller structure than the current placeholder content.',
        'Teach before testing, include clear explanation blocks, checks, practice, and spaced review.',
      ].join('\n'),
  };
}

async function main() {
  loadEnvFiles();

  const options = parseArgs(process.argv.slice(2));
  const request = toGenerationRequest(options);
  const adminClient = await createConfiguredAdminClient();

  console.log(`Generating V2 lesson draft for ${options.lessonCode}...`);
  const generated = await generateDraftForLesson(adminClient, request, 'cli_v2_generate');
  console.log(
    JSON.stringify(
      {
        success: true,
        ...generated,
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
