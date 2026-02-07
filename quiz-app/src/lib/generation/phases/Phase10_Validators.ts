/**
 * Phase 10 v2: Hard Validators
 * Strict validation gates to ensure structural integrity of rewritten lessons
 */

import { Lesson, LessonBlock, ValidationResult } from '../types';

/**
 * Validate structural invariants between original and candidate lessons
 * HARD RULE: Block count, IDs, types, and orders must be EXACTLY preserved
 */
export function validateStructuralInvariants(
  original: Lesson,
  candidate: Lesson
): ValidationResult {
  const errors: string[] = [];
  
  // Block count must be identical
  if (candidate.blocks.length !== original.blocks.length) {
    errors.push(`Block count changed: ${original.blocks.length} → ${candidate.blocks.length}`);
    // Fatal error - return immediately
    return {
      valid: false,
      errors,
      warnings: []
    };
  }
  
  // Check each block's structural properties
  for (let i = 0; i < original.blocks.length; i++) {
    const origBlock = original.blocks[i];
    const candBlock = candidate.blocks[i];
    
    if (!candBlock) {
      errors.push(`Block ${i} missing in candidate`);
      continue;
    }
    
    // Block ID must be preserved
    if (candBlock.id !== origBlock.id) {
      errors.push(`Block ${i} ID changed: ${origBlock.id} → ${candBlock.id}`);
    }
    
    // Block type must be preserved
    if (candBlock.type !== origBlock.type) {
      errors.push(`Block ${i} type changed: ${origBlock.type} → ${candBlock.type}`);
    }
    
    // Block order must be preserved
    if (candBlock.order !== origBlock.order) {
      errors.push(`Block ${i} order changed: ${origBlock.order} → ${candBlock.order}`);
    }
  }
  
  // Lesson metadata must be preserved
  if (candidate.id !== original.id) {
    errors.push(`Lesson ID changed: ${original.id} → ${candidate.id}`);
  }
  
  if (candidate.unit !== original.unit) {
    errors.push(`Lesson unit changed: ${original.unit} → ${candidate.unit}`);
  }
  
  if (candidate.topic !== original.topic) {
    errors.push(`Lesson topic changed: ${original.topic} → ${candidate.topic}`);
  }
  
  if (candidate.layout !== original.layout) {
    errors.push(`Lesson layout changed: ${original.layout} → ${candidate.layout}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate that all blocks have required content fields
 * Ensures no empty or malformed blocks
 */
export function validateBlockCompleteness(
  candidate: Lesson
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const block of candidate.blocks) {
    switch (block.type) {
      case 'outcomes':
        if (!block.content.outcomes || !Array.isArray(block.content.outcomes)) {
          errors.push(`${block.id}: missing outcomes array`);
        } else if (block.content.outcomes.length === 0) {
          errors.push(`${block.id}: empty outcomes array`);
        } else {
          // Validate each outcome has required fields
          (block.content.outcomes as any[]).forEach((outcome, idx) => {
            if (!outcome.text || typeof outcome.text !== 'string') {
              errors.push(`${block.id}: outcome ${idx} missing or invalid text field`);
            }
            if (!outcome.bloomLevel || typeof outcome.bloomLevel !== 'string') {
              errors.push(`${block.id}: outcome ${idx} missing or invalid bloomLevel field`);
            }
          });
        }
        break;
        
      case 'vocab':
        if (!block.content.terms || !Array.isArray(block.content.terms)) {
          errors.push(`${block.id}: missing terms array`);
        } else if (block.content.terms.length === 0) {
          errors.push(`${block.id}: empty terms array`);
        } else {
          // Check each term has required fields
          (block.content.terms as any[]).forEach((term, idx) => {
            if (!term.term || typeof term.term !== 'string' || term.term.trim() === '') {
              errors.push(`${block.id}: term ${idx} missing or empty term field`);
            }
            if (!term.definition || typeof term.definition !== 'string' || term.definition.trim() === '') {
              errors.push(`${block.id}: term ${idx} missing or empty definition field`);
            }
          });
        }
        break;
        
      case 'explanation':
        if (!block.content.content || typeof block.content.content !== 'string') {
          errors.push(`${block.id}: missing or invalid content field`);
        } else if (block.content.content.trim().length === 0) {
          errors.push(`${block.id}: empty content`);
        } else if (block.content.content.trim().length < 100) {
          warnings.push(`${block.id}: explanation content is very short (${block.content.content.trim().length} chars)`);
        }
        
        // Validate title exists
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        break;
        
      case 'practice':
        if (!block.content.questions || !Array.isArray(block.content.questions)) {
          errors.push(`${block.id}: missing questions array`);
        } else if (block.content.questions.length === 0) {
          errors.push(`${block.id}: empty questions array`);
        } else {
          // Check each question has required fields
          (block.content.questions as any[]).forEach((q, idx) => {
            if (!q.id || typeof q.id !== 'string') {
              errors.push(`${block.id}: question ${idx} missing or invalid id`);
            }
            if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim() === '') {
              errors.push(`${block.id}: question ${idx} missing or empty questionText`);
            }
            if (!q.expectedAnswer) {
              errors.push(`${block.id}: question ${idx} missing expectedAnswer`);
            } else if (!Array.isArray(q.expectedAnswer)) {
              errors.push(`${block.id}: question ${idx} expectedAnswer must be array (got ${typeof q.expectedAnswer})`);
            } else if (q.expectedAnswer.length === 0) {
              errors.push(`${block.id}: question ${idx} expectedAnswer array is empty`);
            }
            if (!q.answerType || typeof q.answerType !== 'string') {
              errors.push(`${block.id}: question ${idx} missing or invalid answerType`);
            }
          });
        }
        
        // Validate title
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        break;
        
      case 'spaced-review':
        // Allow empty for first-in-module (Phase 8 responsibility)
        // But if present, must have at least 3 questions
        if (block.content.questions) {
          if (!Array.isArray(block.content.questions)) {
            errors.push(`${block.id}: questions must be an array`);
          } else if (block.content.questions.length > 0 && block.content.questions.length < 3) {
            errors.push(`${block.id}: spaced-review must have 0 or ≥3 questions (got ${block.content.questions.length})`);
          } else if (block.content.questions.length > 0) {
            // Validate each question
            (block.content.questions as any[]).forEach((q, idx) => {
              if (!q.id || typeof q.id !== 'string') {
                errors.push(`${block.id}: question ${idx} missing or invalid id`);
              }
              if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim() === '') {
                errors.push(`${block.id}: question ${idx} missing or empty questionText`);
              }
              if (!q.expectedAnswer) {
                errors.push(`${block.id}: question ${idx} missing expectedAnswer`);
              } else if (!Array.isArray(q.expectedAnswer)) {
                errors.push(`${block.id}: question ${idx} expectedAnswer must be array`);
              }
              if (!q.answerType || typeof q.answerType !== 'string') {
                errors.push(`${block.id}: question ${idx} missing or invalid answerType`);
              }
            });
          }
        }
        
        // Validate title
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        break;
        
      case 'worked-example':
        if (!block.content.steps || !Array.isArray(block.content.steps)) {
          errors.push(`${block.id}: missing steps array`);
        } else if (block.content.steps.length === 0) {
          errors.push(`${block.id}: empty steps array`);
        }
        
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        
        if (!block.content.given || typeof block.content.given !== 'string') {
          errors.push(`${block.id}: missing or invalid given field`);
        }
        break;
        
      case 'guided-practice':
        if (!block.content.steps || !Array.isArray(block.content.steps)) {
          errors.push(`${block.id}: missing steps array`);
        } else if (block.content.steps.length === 0) {
          errors.push(`${block.id}: empty steps array`);
        }
        
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        
        if (!block.content.problem || typeof block.content.problem !== 'string') {
          errors.push(`${block.id}: missing or invalid problem field`);
        }
        break;
        
      case 'diagram':
        if (!block.content.title || typeof block.content.title !== 'string') {
          errors.push(`${block.id}: missing or invalid title field`);
        }
        
        if (!block.content.description || typeof block.content.description !== 'string') {
          errors.push(`${block.id}: missing or invalid description field`);
        }
        break;
        
      case 'microbreak':
        // Microbreaks have minimal requirements
        if (!block.content.title || typeof block.content.title !== 'string') {
          warnings.push(`${block.id}: missing or invalid title field`);
        }
        break;
        
      default:
        warnings.push(`${block.id}: unknown block type "${block.type}"`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Detect obvious corruption patterns in candidate lesson
 */
export function detectCorruption(candidate: Lesson): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonStr = JSON.stringify(candidate);
  
  // Check for [object Object] corruption
  if (jsonStr.includes('[object Object]')) {
    errors.push('Detected [object Object] corruption in JSON');
  }
  
  // Check for invalid answerTypes
  const validAnswerTypes = ['short-text', 'multiple-choice', 'calculation', 'true-false'];
  
  for (const block of candidate.blocks) {
    if (block.type === 'practice' || block.type === 'spaced-review') {
      const questions = block.content.questions as any[] || [];
      questions.forEach((q, idx) => {
        if (q.answerType && !validAnswerTypes.includes(q.answerType)) {
          errors.push(`${block.id} question ${idx}: invalid answerType "${q.answerType}"`);
        }
      });
    }
  }
  
  // Check for empty required strings in explanations
  for (const block of candidate.blocks) {
    if (block.type === 'explanation') {
      const content = block.content.content as string;
      if (!content || !content.trim()) {
        errors.push(`${block.id}: explanation content is empty or whitespace only`);
      }
    }
  }
  
  // Check for undefined or null in critical fields
  if (!candidate.id || candidate.id === 'undefined' || candidate.id === 'null') {
    errors.push('Lesson ID is undefined or null');
  }
  
  if (!candidate.title || candidate.title === 'undefined' || candidate.title === 'null') {
    errors.push('Lesson title is undefined or null');
  }
  
  // Check for placeholder text that shouldn't be there
  const placeholderPatterns = [
    /\[TODO\]/i,
    /\[PLACEHOLDER\]/i,
    /\[FILL IN\]/i,
    /\[REPLACE THIS\]/i,
    /XXX/g,
  ];
  
  for (const pattern of placeholderPatterns) {
    if (pattern.test(jsonStr)) {
      warnings.push(`Detected placeholder pattern in lesson: ${pattern.source}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Run all validators on candidate lesson
 * Returns combined validation result
 */
export function validateCandidate(
  original: Lesson,
  candidate: Lesson
): ValidationResult {
  const results: ValidationResult[] = [
    validateStructuralInvariants(original, candidate),
    validateBlockCompleteness(candidate),
    detectCorruption(candidate),
  ];
  
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}
