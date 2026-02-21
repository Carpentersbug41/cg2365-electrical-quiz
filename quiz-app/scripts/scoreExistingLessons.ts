#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { createLLMClientWithFallback } from '../src/lib/llm/client';
import { getPhase10Model } from '../src/lib/config/geminiConfig';
import { Phase10_Score, Phase10Score } from '../src/lib/generation/phases/Phase10_Score';
import type { Lesson } from '../src/lib/generation/types';

interface CliOptions {
  lessonId?: string;
  all: boolean;
  write: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { all: false, write: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') {
      options.all = true;
      continue;
    }
    if (arg === '--write') {
      options.write = true;
      continue;
    }
    if (arg === '--lesson' || arg === '-l') {
      options.lessonId = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return options;
}

function printUsage(): void {
  console.log('Usage: npx tsx scripts/scoreExistingLessons.ts [--lesson <id> | --all] [--write]');
  console.log('Examples:');
  console.log('  npx tsx scripts/scoreExistingLessons.ts --lesson 203-10A');
  console.log('  npx tsx scripts/scoreExistingLessons.ts --all');
  console.log('  npx tsx scripts/scoreExistingLessons.ts --all --write');
}

function resolveLessonFiles(lessonsDir: string, lessonId?: string): string[] {
  const files = fs
    .readdirSync(lessonsDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(lessonsDir, name));

  if (!lessonId) return files.sort();

  const exact = path.join(lessonsDir, `${lessonId}.json`);
  if (fs.existsSync(exact)) return [exact];

  const prefix = `${lessonId}-`;
  return files.filter((file) => path.basename(file).startsWith(prefix)).sort();
}

function persistScore(lessonPath: string, lesson: Lesson, score: Phase10Score): void {
  const withMetadata = lesson as Lesson & { metadata?: Record<string, unknown> };
  const metadata = withMetadata.metadata || {};
  metadata.generationScore = score.total;
  metadata.generationScoreDetails = {
    originalScore: score.total,
    finalScore: score.total,
    wasRefined: false,
    generatedAt: new Date().toISOString(),
    source: 'score-existing-lessons-cli',
  };
  withMetadata.metadata = metadata;
  fs.writeFileSync(lessonPath, JSON.stringify(withMetadata, null, 2), 'utf-8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if ((!options.lessonId && !options.all) || (options.lessonId && options.all)) {
    printUsage();
    process.exit(1);
  }

  const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
  const lessonFiles = resolveLessonFiles(lessonsDir, options.lessonId);
  if (lessonFiles.length === 0) {
    console.error('No matching lesson files found.');
    process.exit(1);
  }

  const client = await createLLMClientWithFallback();
  const defaultModel = getPhase10Model();

  const generateWithRetry = async (
    systemPrompt: string,
    userPrompt: string,
    _type: 'lesson' | 'quiz' | 'phase' | 'score',
    maxRetries: number,
    _attemptHigherLimit?: boolean,
    tokenLimit?: number,
    modelOverride?: string
  ): Promise<string> => {
    let lastErr: unknown = null;
    const retries = Math.max(1, maxRetries);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = client.getGenerativeModel({
          model: modelOverride || defaultModel,
        });
        const result = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
            { role: 'user', parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            temperature: 0.0,
            maxOutputTokens: tokenLimit || 12000,
          },
        });
        return result.response.text();
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr instanceof Error ? lastErr : new Error('LLM scoring failed');
  };

  const scorer = new Phase10_Score();
  const summary: Array<{ id: string; total: number; grade: string; file: string }> = [];

  for (const lessonPath of lessonFiles) {
    const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf-8')) as Lesson;
    const score = await scorer.scoreLesson(lesson, generateWithRetry);
    summary.push({
      id: lesson.id,
      total: score.total,
      grade: score.grade,
      file: path.basename(lessonPath),
    });

    if (options.write) {
      persistScore(lessonPath, lesson, score);
    }

    console.log(`${lesson.id}: ${score.total}/100 (${score.grade}) - ${path.basename(lessonPath)}`);
  }

  const avg = summary.reduce((acc, s) => acc + s.total, 0) / summary.length;
  console.log(`\nScored ${summary.length} lesson(s). Average: ${avg.toFixed(2)}/100`);
  if (options.write) {
    console.log('Scores persisted to lesson metadata.generationScore + metadata.generationScoreDetails');
  }
}

main().catch((error) => {
  console.error('Scoring failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

