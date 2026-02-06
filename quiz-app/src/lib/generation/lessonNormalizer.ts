/**
 * Lesson Schema Normalizer
 * 
 * Fixes deterministic/mechanical issues before LLM scoring
 * This frees up the LLM's "top 10 issues" budget for learning quality
 */

import { Lesson } from './types';

export interface NormalizationResult {
  normalized: Lesson;
  fixesApplied: string[];
}

/**
 * Normalize lesson schema before LLM scoring
 * Fixes mechanical issues so LLM can focus on learning quality
 */
export function normalizeLessonSchema(lesson: Lesson): NormalizationResult {
  const fixes: string[] = [];
  const normalized: Lesson = JSON.parse(JSON.stringify(lesson)); // deep clone

  // Fix 1: Ensure all block IDs have lesson prefix
  normalized.blocks.forEach((block, blockIdx) => {
    if (!block.id.startsWith(normalized.id + '-')) {
      const oldId = block.id;
      // Extract the suffix (e.g., "outcomes" from "203-3A4-outcomes" or just "outcomes")
      const suffix = block.id.includes('-') ? block.id.split('-').slice(-1)[0] : block.id;
      block.id = `${normalized.id}-${suffix}`;
      fixes.push(`Block ${blockIdx} ID: '${oldId}' → '${block.id}'`);
    }
  });

  // Fix 2: Ensure all question IDs have lesson prefix
  normalized.blocks.forEach((block, blockIdx) => {
    if (block.content?.questions && Array.isArray(block.content.questions)) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        if (q.id && !q.id.startsWith(normalized.id + '-')) {
          const oldId = q.id;
          q.id = `${normalized.id}-${q.id}`;
          fixes.push(`Question ${blockIdx}.${qIdx} ID: '${oldId}' → '${q.id}'`);
        }
      });
    }

    // Also check steps in guided practice and worked examples
    if (block.content?.steps && Array.isArray(block.content.steps)) {
      block.content.steps.forEach((step: any, stepIdx: number) => {
        if (step.id && !step.id.startsWith(normalized.id + '-')) {
          const oldId = step.id;
          step.id = `${normalized.id}-${step.id}`;
          fixes.push(`Step ${blockIdx}.${stepIdx} ID: '${oldId}' → '${step.id}'`);
        }
      });
    }
  });

  // Fix 3: Ensure expectedAnswer is always an array
  normalized.blocks.forEach((block, blockIdx) => {
    if (block.content?.questions && Array.isArray(block.content.questions)) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        if (q.expectedAnswer && !Array.isArray(q.expectedAnswer)) {
          const oldValue = q.expectedAnswer;
          q.expectedAnswer = [String(q.expectedAnswer)];
          fixes.push(`Question ${blockIdx}.${qIdx} expectedAnswer: converted '${oldValue}' to array`);
        }
      });
    }

    // Also check steps in guided practice
    if (block.content?.steps && Array.isArray(block.content.steps)) {
      block.content.steps.forEach((step: any, stepIdx: number) => {
        if (step.expectedAnswer && !Array.isArray(step.expectedAnswer)) {
          const oldValue = step.expectedAnswer;
          step.expectedAnswer = [String(step.expectedAnswer)];
          fixes.push(`Step ${blockIdx}.${stepIdx} expectedAnswer: converted to array`);
        }
      });
    }
  });

  // Fix 4: Ensure block orders are monotonic (no duplicates)
  const orders = normalized.blocks.map(b => b.order);
  const hasDuplicates = orders.length !== new Set(orders).size;
  
  if (hasDuplicates) {
    fixes.push('Fixed duplicate block orders - re-numbered maintaining relative positions');
    // Sort by current order to maintain intended sequence
    normalized.blocks.sort((a, b) => a.order - b.order);
    
    // Re-number blocks with proper spacing
    // Use integers with gaps: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    // This maintains relative order while eliminating duplicates
    let currentOrder = 1;
    normalized.blocks.forEach((block, idx) => {
      if (idx > 0 && block.order === normalized.blocks[idx - 1].order) {
        // Duplicate detected - assign next integer
        block.order = currentOrder++;
      } else {
        // Keep existing order if no conflict
        currentOrder = Math.ceil(block.order) + 1;
      }
    });
  }

  // Fix 5: Ensure spaced-review questions use correct field name
  normalized.blocks.forEach((block, blockIdx) => {
    if (block.type === 'spaced-review' && block.content?.questions) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        // Check for common typos
        if (q.attText || q.questiontext || q.question_text) {
          const wrongField = q.attText ? 'attText' : q.questiontext ? 'questiontext' : 'question_text';
          q.questionText = q.attText || q.questiontext || q.question_text;
          delete q[wrongField];
          fixes.push(`Spaced review ${blockIdx}.${qIdx}: renamed '${wrongField}' → 'questionText'`);
        }
      });
    }
  });

  // Fix 6: Ensure numeric expectedAnswer values don't have units
  normalized.blocks.forEach((block, blockIdx) => {
    if (block.content?.questions && Array.isArray(block.content.questions)) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        if (q.answerType === 'numeric' && Array.isArray(q.expectedAnswer)) {
          let needsFix = false;
          const cleaned = q.expectedAnswer.map((answer: string) => {
            const str = String(answer);
            // Check if it contains units (letters, %, etc.)
            if (/[a-zA-Z%]/.test(str)) {
              needsFix = true;
              // Extract just the number
              const match = str.match(/-?\d+\.?\d*/);
              return match ? match[0] : str;
            }
            return str;
          });
          
          if (needsFix) {
            q.expectedAnswer = cleaned;
            fixes.push(`Question ${blockIdx}.${qIdx}: removed units from numeric expectedAnswer`);
          }
        }
      });
    }
  });

  return {
    normalized,
    fixesApplied: fixes,
  };
}

/**
 * Validate that a lesson is properly normalized
 * Returns list of remaining issues (should be empty after normalization)
 */
export function validateNormalization(lesson: Lesson): string[] {
  const issues: string[] = [];

  // Check block IDs
  lesson.blocks.forEach((block, idx) => {
    if (!block.id.startsWith(lesson.id + '-')) {
      issues.push(`Block ${idx} ID '${block.id}' missing lesson prefix '${lesson.id}-'`);
    }
  });

  // Check question IDs
  lesson.blocks.forEach((block, blockIdx) => {
    if (block.content?.questions) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        if (q.id && !q.id.startsWith(lesson.id + '-')) {
          issues.push(`Question ${blockIdx}.${qIdx} ID '${q.id}' missing lesson prefix`);
        }
      });
    }
  });

  // Check expectedAnswer arrays
  lesson.blocks.forEach((block, blockIdx) => {
    if (block.content?.questions) {
      block.content.questions.forEach((q: any, qIdx: number) => {
        if (q.expectedAnswer && !Array.isArray(q.expectedAnswer)) {
          issues.push(`Question ${blockIdx}.${qIdx} expectedAnswer is not an array`);
        }
      });
    }
  });

  // Check for duplicate orders
  const orders = lesson.blocks.map(b => b.order);
  const duplicates = orders.filter((order, idx) => orders.indexOf(order) !== idx);
  if (duplicates.length > 0) {
    issues.push(`Duplicate block orders found: ${[...new Set(duplicates)].join(', ')}`);
  }

  return issues;
}
