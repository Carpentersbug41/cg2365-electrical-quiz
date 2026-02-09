/**
 * Generate syllabus chunks.json file
 * 
 * Run with: npx tsx scripts/generateSyllabusChunks.ts
 */

import path from 'path';
import { generateChunksFile } from '../src/lib/syllabus/syllabusChunker';

async function main() {
  const syllabusPath = path.join(__dirname, '../resources/2365 l2.md');
  const outputPath = path.join(__dirname, '../src/lib/syllabus/chunks.json');
  
  console.log('🔄 Generating syllabus chunks...');
  console.log(`  Input: ${syllabusPath}`);
  console.log(`  Output: ${outputPath}`);
  
  await generateChunksFile(syllabusPath, outputPath);
  
  console.log('✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
