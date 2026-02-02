#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateMicrobreaksForLesson } from '../src/lib/generation/gameGenerator';
import { Lesson } from '../src/data/lessons/types';

/**
 * CLI tool to generate microbreak games for a lesson
 * Usage: npm run generate:games <lesson-id>
 * Example: npm run generate:games 201-1A
 */
async function main() {
  const lessonId = process.argv[2];
  
  if (!lessonId) {
    console.error('❌ Usage: npm run generate:games <lesson-id>');
    console.error('   Example: npm run generate:games 201-1A');
    process.exit(1);
  }

  console.log(`\n🎮 Generating microbreak games for lesson: ${lessonId}\n`);

  // Construct lesson file path
  const lessonPath = join(__dirname, '../src/data/lessons', `${lessonId}.json`);

  // Read lesson file
  let lesson: Lesson;
  try {
    const lessonData = readFileSync(lessonPath, 'utf-8');
    lesson = JSON.parse(lessonData);
    console.log(`✓ Loaded lesson: ${lesson.title}`);
  } catch (error) {
    console.error(`❌ Failed to read lesson file: ${lessonPath}`);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Check if lesson already has microbreaks
  const existingMicrobreaks = lesson.blocks.filter(b => b.type === 'microbreak');
  if (existingMicrobreaks.length > 0) {
    console.log(`\n⚠️  Warning: Lesson already has ${existingMicrobreaks.length} microbreak(s).`);
    console.log('   Existing microbreak IDs:', existingMicrobreaks.map(b => b.id).join(', '));
    
    // Ask user if they want to continue (simple check for --force flag)
    if (!process.argv.includes('--force')) {
      console.log('\n   Use --force flag to regenerate games (this will add new games, not replace existing ones)');
      process.exit(0);
    }
  }

  // Generate games
  console.log('\n🤖 Generating games with LLM...');
  try {
    const games = await generateMicrobreaksForLesson(lesson, {
      count: 2,
      gameTypes: ['matching', 'sorting'],
    });

    console.log(`✓ Generated ${games.length} games:`);
    games.forEach(game => {
      const content = game.content as any;
      console.log(`  - ${game.id}: ${content.gameType} (order: ${game.order})`);
    });

    // Add games to lesson
    lesson.blocks.push(...games);
    
    // Re-sort blocks by order
    lesson.blocks.sort((a, b) => a.order - b.order);

    // Update metadata
    lesson.metadata.updated = new Date().toISOString().split('T')[0];
    if (lesson.metadata.version) {
      const versionParts = lesson.metadata.version.split('.');
      versionParts[1] = String(parseInt(versionParts[1] || '0') + 1);
      lesson.metadata.version = versionParts.join('.');
    }

    // Save lesson file
    writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));
    console.log(`\n✓ Saved updated lesson to: ${lessonPath}`);
    console.log(`✓ Total blocks: ${lesson.blocks.length}`);

  } catch (error) {
    console.error('\n❌ Failed to generate games:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log('\n✅ Done!\n');
}

main().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
