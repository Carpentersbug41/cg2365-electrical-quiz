/**
 * Script to remove keyword-based marking fields from lesson JSON files
 * Part of the LLM-first marking system migration
 */

import * as fs from 'fs';
import * as path from 'path';

const LESSONS_DIR = path.join(__dirname, '../src/data/lessons');

interface Question {
  id: string;
  questionText: string;
  answerType: string;
  expectedAnswer: string | string[];
  cognitiveLevel?: string;
  expectedKeywords?: string[];
  minimumKeywordMatch?: number;
  hint?: string;
  options?: string[];
  correctOptionIndex?: number;
}

interface PracticeBlock {
  type: string;
  content: {
    title: string;
    mode?: string;
    sequential?: boolean;
    questions: Question[];
  };
}

interface Lesson {
  blocks: PracticeBlock[];
  [key: string]: unknown;
}

function updateLessonFile(filename: string): void {
  const filePath = path.join(LESSONS_DIR, filename);
  
  // Skip non-JSON files
  if (!filename.endsWith('.json')) {
    return;
  }
  
  console.log(`\n📄 Processing: ${filename}`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf-8');
    const lesson = JSON.parse(content) as Lesson;
    
    let changesCount = 0;
    
    // Find practice blocks
    lesson.blocks.forEach((block) => {
      if (block.type === 'practice' && block.content?.questions) {
        block.content.questions.forEach((question) => {
          let questionChanged = false;
          
          // Remove expectedKeywords
          if (question.expectedKeywords) {
            delete question.expectedKeywords;
            questionChanged = true;
          }
          
          // Remove minimumKeywordMatch
          if (question.minimumKeywordMatch) {
            delete question.minimumKeywordMatch;
            questionChanged = true;
          }
          
          // Convert expectedAnswer from array to string if needed
          if (Array.isArray(question.expectedAnswer)) {
            // Use the first element as the comprehensive answer
            // In the future, these can be manually enhanced to be more detailed
            question.expectedAnswer = question.expectedAnswer[0];
            questionChanged = true;
          }
          
          if (questionChanged) {
            changesCount++;
            console.log(`  ✓ Updated question: ${question.id}`);
          }
        });
      }
    });
    
    if (changesCount > 0) {
      // Write back to file with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2), 'utf-8');
      console.log(`  ✅ Saved ${changesCount} changes to ${filename}`);
    } else {
      console.log(`  ℹ️  No changes needed for ${filename}`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error);
  }
}

function main() {
  console.log('🚀 Starting lesson keyword removal migration...\n');
  console.log('This script removes expectedKeywords and minimumKeywordMatch fields');
  console.log('from all lesson JSON files as part of the LLM-first marking migration.\n');
  
  // Get all files in lessons directory
  const files = fs.readdirSync(LESSONS_DIR);
  
  // Filter for JSON files only
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  console.log(`Found ${jsonFiles.length} lesson files to process\n`);
  console.log('=' .repeat(60));
  
  // Process each file
  jsonFiles.forEach(updateLessonFile);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes in git diff');
  console.log('2. Manually enhance expectedAnswer fields to be comprehensive');
  console.log('3. Test the LLM marking with sample questions');
  console.log('4. Commit the changes\n');
}

main();
