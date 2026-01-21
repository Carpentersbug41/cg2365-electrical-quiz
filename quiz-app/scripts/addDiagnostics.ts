/**
 * Bulk Script: Add Diagnostic Configuration to Lessons
 * Adds diagnostic gates to all non-first lessons in each unit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LESSONS_DIR = path.join(__dirname, '../src/data/lessons');
const FIRST_LESSONS = ['201-1A', '202-1A', '203-1A']; // First lesson in each unit

interface Lesson {
  id: string;
  diagnostic?: {
    enabled: boolean;
    questionCount: number;
    passThreshold: number;
    sourceType: string;
    allowSkip: boolean;
  };
  [key: string]: unknown;
}

function addDiagnosticToLesson(filePath: string): void {
  const fileName = path.basename(filePath);
  
  // Read lesson file
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lesson: Lesson = JSON.parse(fileContent);
  
  // Skip if already has diagnostic
  if (lesson.diagnostic) {
    console.log(`⏭️  ${lesson.id} already has diagnostic config`);
    return;
  }
  
  // Skip if first lesson in unit
  if (FIRST_LESSONS.includes(lesson.id)) {
    console.log(`⏭️  ${lesson.id} is first in unit, skipping`);
    return;
  }
  
  // Add diagnostic configuration
  lesson.diagnostic = {
    enabled: true,
    questionCount: 10,
    passThreshold: 0.8,
    sourceType: 'cumulative',
    allowSkip: true
  };
  
  // Write back to file with pretty formatting
  fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n');
  console.log(`✅ Added diagnostic to ${lesson.id} (${fileName})`);
}

function main() {
  console.log('🚀 Starting bulk diagnostic addition...\n');
  
  // Get all JSON files in lessons directory
  const files = fs.readdirSync(LESSONS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(LESSONS_DIR, file));
  
  console.log(`Found ${files.length} lesson files\n`);
  
  // Process each file
  let processedCount = 0;
  let skippedCount = 0;
  let addedCount = 0;
  
  files.forEach(file => {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const lesson: Lesson = JSON.parse(fileContent);
      
      if (lesson.diagnostic) {
        skippedCount++;
      } else if (FIRST_LESSONS.includes(lesson.id)) {
        skippedCount++;
      } else {
        addedCount++;
      }
      
      addDiagnosticToLesson(file);
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(file)}:`, error);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Total files: ${files.length}`);
  console.log(`   Processed: ${processedCount}`);
  console.log(`   Added diagnostics: ${addedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log('='.repeat(50));
  console.log('\n✅ Bulk diagnostic addition complete!');
}

// Run the script
main();
