/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validation Service
 * Validates generated lessons and quizzes for quality and correctness
 * 
 * ⚠️ CRITICAL FILE - READ BEFORE MODIFYING
 * See: reports/bulk_tasks/don't_touch.md
 * 
 * Every validation check exists because we debugged that exact failure case.
 * Don't remove checks to "simplify" or "speed up" generation.
 * 
 * Common mistakes:
 * - Commenting out checks to make tests pass → Production bugs
 * - Removing "annoying" warnings → Issues reach users
 * - Weakening validation thresholds → Quality drops
 * 
 * These checks prevent:
 * - Runtime crashes (wrong field names, missing data)
 * - Broken UI (invalid structures, order collisions)
 * - Bad UX (poor content quality, incorrect formats)
 * 
 * If validation fails, fix the GENERATOR, not the validation.
 * Test thoroughly before committing!
 */

import { Lesson, LessonBlock, QuizQuestion, ValidationResult } from './types';
import { WorkedExampleBlockContent, GuidedPracticeBlockContent } from '@/data/lessons/types';
import { APPROVED_TAGS, APPROVED_MISCONCEPTION_CODES, BLOOM_LEVELS, COGNITIVE_LEVELS, BLOCK_ORDER } from './constants';

export interface QuestionDebugInfo {
  questionId: number;
  issue: string;
  questionText?: string;
  optionsCount?: number;
  options?: string[];
  fullQuestion?: Partial<QuizQuestion>;
  expectedFormat?: string;
  actualFormat?: string;
}

export class ValidationService {
  /**
   * Validate lesson structure and content
   */
  validateLesson(lesson: Lesson, lessonId: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const debugData: QuestionDebugInfo[] = [];

    // NORMALIZE: Convert comma-separated strings to arrays before validation
    if (lesson.blocks) {
      this.normalizeLessonQuestionFields(lesson.blocks);
      for (const block of lesson.blocks) {
        if (block.type === 'practice' && block.content.questions) {
          this.normalizeExpectedAnswers(block.content.questions);
        }
        if (block.type === 'spaced-review' && block.content.questions) {
          this.normalizeExpectedAnswers(block.content.questions);
        }
      }
    }

    // Validate required fields
    if (!lesson.id || lesson.id !== lessonId) {
      errors.push(`Lesson ID mismatch: expected ${lessonId}, got ${lesson.id}`);
    }

    if (!lesson.title || lesson.title.length === 0) {
      errors.push('Lesson title is required');
    }

    if (!lesson.description || lesson.description.length === 0) {
      errors.push('Lesson description is required');
    }

    if (!lesson.layout || (lesson.layout !== 'split-vis' && lesson.layout !== 'linear-flow')) {
      errors.push('Lesson layout must be either "split-vis" or "linear-flow"');
    }

    // Validate learningOutcomes exist and have correct structure
    if (!lesson.learningOutcomes || !Array.isArray(lesson.learningOutcomes)) {
      errors.push('Lesson must have learningOutcomes array');
    } else if (lesson.learningOutcomes.length < 2) {
      errors.push('Lesson must have at least 2 learning outcomes');
    } else {
      // CRITICAL: Validate each outcome is a STRING, not an object
      lesson.learningOutcomes.forEach((outcome, idx) => {
        if (typeof outcome !== 'string') {
          errors.push(
            `Learning outcome #${idx + 1} must be a string, not an object. ` +
            `Found: ${JSON.stringify(outcome).substring(0, 100)}. ` +
            `The top-level learningOutcomes field uses plain strings. ` +
            `Objects with "text" and "bloomLevel" are only for the outcomes BLOCK content.`
          );
        }
      });
    }

    if (!lesson.blocks || lesson.blocks.length < 6) {
      errors.push('Lesson must have at least 6 blocks');
    }

    // Validate blocks
    if (lesson.blocks) {
      this.validateBlocks(lesson.blocks, lessonId, errors, warnings, debugData);
      this.validateBlockOrders(lesson.blocks, errors, warnings);
      this.validateWorkedExampleAlignment(lesson.blocks, errors, warnings);
      this.validateQuestionStaging(lesson.blocks, errors, warnings);
      this.validateMicrobreakPlacement(lesson.blocks, errors, warnings);
      this.validateAnswerCoverage(lesson.blocks, errors, warnings);
      this.validateLongTextQuestions(lesson.blocks, errors);
    }

    // Validate metadata
    if (!lesson.metadata) {
      errors.push('Lesson metadata is required');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      debugData: debugData.length > 0 ? debugData : undefined,
    };
  }

  /**
   * Normalize common LLM field omissions/variants for lesson questions.
   * Keeps validator strict while avoiding hard fails on trivial shape drift.
   */
  private normalizeLessonQuestionFields(blocks: LessonBlock[]): void {
    for (const block of blocks) {
      const questions = (block.content as Record<string, unknown>).questions;
      if (!Array.isArray(questions)) continue;

      for (const rawQuestion of questions) {
        if (!rawQuestion || typeof rawQuestion !== 'object') continue;
        const question = rawQuestion as Record<string, unknown>;

        // Map alternate field spellings first.
        if (!question.answerType && typeof question.answer_type === 'string') {
          question.answerType = question.answer_type;
        }

        // Canonicalize answerType value variants.
        if (typeof question.answerType === 'string') {
          const normalized = question.answerType.toLowerCase().replace(/\s+/g, '').replace(/_/g, '-');
          if (normalized === 'shorttext' || normalized === 'short-text') question.answerType = 'short-text';
          else if (normalized === 'longtext' || normalized === 'long-text' || normalized === 'essay' || normalized === 'openended') {
            question.answerType = 'long-text';
          } else if (normalized === 'number' || normalized === 'numeric') {
            question.answerType = 'numeric';
          }
        }

        // Fill missing answerType deterministically.
        if (!question.answerType) {
          if (Array.isArray(question.keyPoints) && question.keyPoints.length > 0) {
            question.answerType = 'long-text';
          } else {
            question.answerType = 'short-text';
          }
        }
      }
    }
  }
  
  /**
   * Enhanced validation: Check block orders are monotonic and correct
   */
  private validateBlockOrders(blocks: LessonBlock[], errors: string[], warnings: string[]): void {
    const orderMap = new Map<number, string[]>();
    
    // Group blocks by order to detect collisions
    for (const block of blocks) {
      const blockIds = orderMap.get(block.order) || [];
      blockIds.push(`${block.id} (${block.type})`);
      orderMap.set(block.order, blockIds);
    }
    
    // Check for duplicate orders
    for (const [order, blockIds] of orderMap.entries()) {
      if (blockIds.length > 1) {
        errors.push(
          `Order collision at ${order}: ${blockIds.join(', ')} - ` +
          `Each block must have a unique order value. Use decimal spacing (4, 4.2, 4.5, 4.7, 5).`
        );
      }
    }
    
    // Check monotonic ordering
    const orders = Array.from(orderMap.keys()).sort((a, b) => a - b);
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] <= orders[i - 1]) {
        errors.push(`Block orders are not monotonic: ${orders[i - 1]} followed by ${orders[i]}`);
        break;
      }
    }
  }
  
  /**
   * Enhanced validation: Check worked example and guided practice alignment
   */
  private validateWorkedExampleAlignment(blocks: LessonBlock[], errors: string[], warnings: string[]): void {
    const workedExample = blocks.find(b => b.type === 'worked-example');
    const guidedPractice = blocks.find(b => b.type === 'guided-practice');
    
    if (workedExample && !guidedPractice) {
      warnings.push('Worked example exists but no guided practice - they should be paired');
    }
    
    if (workedExample && guidedPractice) {
      const workedContent = workedExample.content as unknown as WorkedExampleBlockContent;
      const guidedContent = guidedPractice.content as unknown as GuidedPracticeBlockContent;
      const workedSteps = workedContent.steps?.length || 0;
      const guidedSteps = guidedContent.steps?.length || 0;
      
      if (workedSteps > 0 && guidedSteps > 0 && Math.abs(workedSteps - guidedSteps) > 1) {
        warnings.push(`Worked example (${workedSteps} steps) and guided practice (${guidedSteps} steps) should have similar number of steps`);
      }
    }
  }
  
  /**
   * Enhanced validation: Check questions appear after explanations (teach before test)
   */
  private validateQuestionStaging(blocks: LessonBlock[], errors: string[], warnings: string[]): void {
    const explanationOrders = blocks
      .filter(b => b.type === 'explanation')
      .map(b => b.order);
    
    const minExplanationOrder = explanationOrders.length > 0 ? Math.min(...explanationOrders) : Infinity;
    
    // Check that understanding checks come after at least one explanation
    const checks = blocks.filter(b => b.type === 'practice' && b.content.mode === 'conceptual');
    for (const check of checks) {
      if (check.order <= minExplanationOrder) {
        errors.push(`Understanding check at order ${check.order} appears before or at same level as first explanation (${minExplanationOrder}). Checks must come AFTER teaching.`);
      }
    }
    
    // Check that practice/integrative come after explanations
    const practiceBlocks = blocks.filter(b => 
      (b.type === 'practice' && !b.content.mode) || 
      (b.type === 'practice' && b.content.mode === 'integrative')
    );
    
    for (const practice of practiceBlocks) {
      if (explanationOrders.length > 0 && practice.order <= Math.max(...explanationOrders)) {
        warnings.push(`Practice block at order ${practice.order} may appear too early. Ensure all relevant explanations come first.`);
      }
    }
  }

  /**
   * Enhanced validation: Check microbreak placement (must come after explanations)
   */
  private validateMicrobreakPlacement(blocks: LessonBlock[], errors: string[], warnings: string[]): void {
    const microbreaks = blocks.filter(b => b.type === 'microbreak');
    const explanations = blocks.filter(b => b.type === 'explanation').map(b => b.order);
    
    if (microbreaks.length === 0) return;
    
    const minExplanationOrder = explanations.length > 0 ? Math.min(...explanations) : Infinity;
    
    for (const microbreak of microbreaks) {
      if (microbreak.order < minExplanationOrder) {
        errors.push(
          `Microbreak "${microbreak.id}" at order ${microbreak.order} appears before ` +
          `first explanation (order ${minExplanationOrder}). Microbreaks must test only ` +
          `concepts that have been taught in explanations.`
        );
      }
    }
  }

  /**
   * Enhanced validation: Check that question answers are covered in explanation content
   * This helps identify questions testing concepts not explicitly taught
   */
  private validateAnswerCoverage(blocks: LessonBlock[], errors: string[], warnings: string[]): void {
    // Build combined explanation content
    const explanationContent = blocks
      .filter(b => b.type === 'explanation')
      .map(b => {
        const content = b.content.content;
        return typeof content === 'string' ? content.toLowerCase() : '';
      })
      .join(' ');
    
    if (explanationContent.length === 0) {
      // No explanations to check against - skip this validation
      return;
    }
    
    // Get all questions from practice and spaced-review blocks
    const questionBlocks = blocks.filter(b => 
      b.type === 'practice' || b.type === 'spaced-review'
    );
    
    for (const block of questionBlocks) {
      const questions = block.content.questions;
      if (!Array.isArray(questions)) continue;
      
      for (const question of questions) {
        if (!question.expectedAnswer || !Array.isArray(question.expectedAnswer)) continue;
        
        // Skip spaced review (it reviews prerequisites, not current content)
        if (block.type === 'spaced-review') continue;
        
        // Skip synthesis questions (they combine concepts in new ways)
        if (question.cognitiveLevel === 'synthesis') continue;
        
        // Check if at least one expected answer variant appears in explanations
        const anyAnswerFound = question.expectedAnswer.some((answer: unknown) => {
          if (typeof answer !== 'string') return false;
          
          const answerLower = answer.toLowerCase();
          const answerWords = answerLower.split(/\s+/).filter((word: string) => word.length > 3);
          
          // For very short answers (single words), do direct match
          if (answerWords.length <= 1) {
            return explanationContent.includes(answerLower);
          }
          
          // For multi-word answers, check if at least 50% of significant words appear
          const matchCount = answerWords.filter((word: string) => 
            explanationContent.includes(word)
          ).length;
          
          return matchCount >= answerWords.length * 0.5;
        });
        
        if (!anyAnswerFound) {
          warnings.push(
            `Question ${question.id}: Expected answers may not be adequately covered in explanation content. ` +
            `Review if the answer can be clearly derived from what was taught. ` +
            `Answers: ${JSON.stringify(question.expectedAnswer).substring(0, 100)}`
          );
        }
      }
    }
  }

  /**
   * Validate long-text questions have required keyPoints
   */
  private validateLongTextQuestions(blocks: LessonBlock[], errors: string[]): void {
    for (const block of blocks) {
      if (block.type === 'practice') {
        const content = block.content as any;
        if (content.questions) {
          for (const q of content.questions) {
            if (q.answerType === 'long-text') {
              // Must have keyPoints array with 3-8 items
              if (!q.keyPoints || !Array.isArray(q.keyPoints)) {
                errors.push(`Question ${q.id}: long-text requires keyPoints array`);
              } else if (q.keyPoints.length < 3) {
                errors.push(`Question ${q.id}: long-text requires at least 3 keyPoints (has ${q.keyPoints.length})`);
              } else if (q.keyPoints.length > 8) {
                errors.push(`Question ${q.id}: long-text should have at most 8 keyPoints (has ${q.keyPoints.length})`);
              } else {
                // keyPoints must be non-empty strings
                for (let i = 0; i < q.keyPoints.length; i++) {
                  if (typeof q.keyPoints[i] !== 'string' || q.keyPoints[i].trim().length === 0) {
                    errors.push(`Question ${q.id}: keyPoints[${i}] must be non-empty string`);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Validate lesson blocks structure and order
   */
  private validateBlocks(blocks: LessonBlock[], lessonId: string, errors: string[], warnings: string[], debugData: QuestionDebugInfo[]): void {
    const blockTypes = new Set<string>();
    const orders = new Set<number>();
    let hasOutcomes = false;
    let hasVocab = false;
    let hasExplanation = false;
    let hasUnderstandingCheck = false;
    let hasPractice = false;
    let hasIntegrative = false;
    let hasSpacedReview = false;

    for (const block of blocks) {
      // Check required block fields
      if (!block.id || !block.type || block.order === undefined || !block.content) {
        errors.push(`Invalid block structure: ${JSON.stringify(block).substring(0, 100)}`);
        continue;
      }

      // Check ID pattern
      if (!block.id.startsWith(lessonId)) {
        errors.push(`Block ID ${block.id} does not start with lesson ID ${lessonId}`);
      }

      // Track block types
      blockTypes.add(block.type);
      orders.add(block.order);

      // Check for required blocks
      if (block.type === 'outcomes') hasOutcomes = true;
      if (block.type === 'vocab') hasVocab = true;
      if (block.type === 'explanation') hasExplanation = true;
      if (block.type === 'practice') {
        if (block.content.mode === 'conceptual') hasUnderstandingCheck = true;
        if (block.content.mode === 'integrative') hasIntegrative = true;
        if (!block.content.mode) hasPractice = true;
      }
      if (block.type === 'spaced-review') hasSpacedReview = true;

      // Validate specific block types
      this.validateBlockContent(block, lessonId, errors, warnings, debugData);
    }

    // Check for required block types
    if (!hasOutcomes) errors.push('Missing required outcomes block');
    if (!hasVocab) errors.push('Missing required vocab block');
    if (!hasExplanation) errors.push('Missing required explanation block');
    if (!hasUnderstandingCheck) warnings.push('Missing understanding check block (recommended)');
    if (!hasPractice) errors.push('Missing required practice block');
    if (!hasIntegrative) warnings.push('Missing integrative question block (recommended)');
    if (!hasSpacedReview) warnings.push('Missing spaced review block (recommended)');
  }

  /**
   * Validate specific block content
   */
  private validateBlockContent(block: LessonBlock, lessonId: string, errors: string[], warnings: string[], debugData: QuestionDebugInfo[]): void {
    switch (block.type) {
      case 'outcomes':
        if (!block.content.outcomes || !Array.isArray(block.content.outcomes)) {
          errors.push('Outcomes block must have outcomes array');
        } else {
          for (const outcome of block.content.outcomes) {
            if (typeof outcome !== 'object' || outcome === null || !('text' in outcome) || !('bloomLevel' in outcome)) {
              errors.push('Each outcome must have text and bloomLevel');
              continue;
            }
            const outcomeObj = outcome as { text: unknown; bloomLevel: unknown };
            if (!outcomeObj.text || !outcomeObj.bloomLevel) {
              errors.push('Each outcome must have text and bloomLevel');
            }
            if (typeof outcomeObj.bloomLevel === 'string' && !BLOOM_LEVELS.includes(outcomeObj.bloomLevel as typeof BLOOM_LEVELS[number])) {
              errors.push(`Invalid bloom level: ${outcomeObj.bloomLevel}`);
            }
          }
        }
        break;

      case 'vocab':
        if (!block.content.terms || !Array.isArray(block.content.terms)) {
          errors.push('Vocab block must have terms array');
        } else if (block.content.terms.length < 3) {
          warnings.push('Vocab block should have at least 3 terms');
        }
        break;

      case 'explanation':
        if (!block.content.title || !block.content.content) {
          errors.push('Explanation block must have title and content');
        } else if (typeof block.content.content === 'string') {
          // Count approximate words (400-600 target)
          const wordCount = block.content.content.split(/\s+/).length;
          if (wordCount < 200) {
            warnings.push(`Explanation seems too short (~${wordCount} words, target 400-600)`);
          } else if (wordCount > 800) {
            warnings.push(`Explanation seems too long (~${wordCount} words, target 400-600)`);
          }
        }
        break;

      case 'practice':
        if (!block.content.questions || !Array.isArray(block.content.questions)) {
          errors.push(`Practice block ${block.id} must have questions array`);
        } else {
          // Determine block type for ID validation
          let blockType = 'practice';
          if (typeof block.content.mode === 'string' && block.content.mode === 'conceptual') {
            blockType = 'understanding-check';
          } else if (typeof block.content.mode === 'string' && block.content.mode === 'integrative') {
            blockType = 'integrative';
          }
          
          for (const question of block.content.questions) {
            this.validateQuestion(question, lessonId, errors, warnings, debugData);
            // Validate question ID pattern
            if (question.id) {
              this.validateQuestionIdPattern(question, lessonId, blockType, errors);
            }
          }

          // Enhanced: Check understanding check structure with cognitive levels
          if (typeof block.content.mode === 'string' && block.content.mode === 'conceptual') {
            if (block.content.questions.length !== 4) {
              errors.push('Understanding check MUST have exactly 4 questions (3×L1 recall + 1×L2 connection)');
            } else {
              // Validate cognitive level pattern: recall, recall, recall, connection
              const levels = block.content.questions.map(q => q.cognitiveLevel);
              const recallCount = levels.filter(l => l === 'recall').length;
              const connectionCount = levels.filter(l => l === 'connection').length;
              
              if (recallCount !== 3 || connectionCount !== 1) {
                errors.push(`Understanding check must have 3 recall + 1 connection questions (found ${recallCount} recall, ${connectionCount} connection)`);
              }
            }
          }

          // Enhanced: Check integrative structure with cognitive levels
          if (typeof block.content.mode === 'string' && block.content.mode === 'integrative') {
            if (block.content.questions.length !== 2) {
              errors.push('Integrative block MUST have exactly 2 questions (1×L2 connection + 1×L3 synthesis)');
            } else {
              // Validate cognitive level pattern: connection, synthesis
              const levels = block.content.questions.map(q => q.cognitiveLevel);
              if (levels[0] !== 'connection' || levels[1] !== 'synthesis') {
                errors.push(`Integrative questions must be: Q1=connection, Q2=synthesis (found ${levels[0]}, ${levels[1]})`);
              }
            }
          }
          
          // Check practice block has 3-5 questions
          if (!block.content.mode && (block.content.questions.length < 3 || block.content.questions.length > 5)) {
            warnings.push(`Practice block should have 3-5 questions (found ${block.content.questions.length})`);
          }
        }
        break;

      case 'worked-example':
        if (!block.content.steps || !Array.isArray(block.content.steps)) {
          errors.push('Worked example must have steps array');
        }
        break;

      case 'guided-practice':
        if (!block.content.steps || !Array.isArray(block.content.steps)) {
          errors.push('Guided practice must have steps array');
        }
        break;

      case 'spaced-review':
        if (!block.content.questions || !Array.isArray(block.content.questions)) {
          errors.push('Spaced review must have questions array');
        } else {
          if (block.content.questions.length !== 4) {
            warnings.push('Spaced review should have exactly 4 questions');
          }
          
          // Validate each spaced-review question structure
          for (const question of block.content.questions) {
            this.validateSpacedReviewQuestion(question, lessonId, errors, warnings, debugData);
            // Validate question ID pattern
            if (question.id) {
              this.validateQuestionIdPattern(question, lessonId, 'spaced-review', errors);
            }
          }
        }
        break;
    }
  }

  /**
   * Validate practice question
   */
  private validateQuestion(question: Record<string, unknown>, lessonId: string, errors: string[], warnings: string[], debugData: QuestionDebugInfo[]): void {
    if (!question.id) {
      errors.push('Question missing ID');
      return;
    }

    if (!question.questionText) {
      errors.push(`Question ${question.id} missing questionText`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Missing questionText',
        questionText: 'N/A',
        fullQuestion: question,
        expectedFormat: 'Non-empty string',
        actualFormat: question.questionText ? 'Empty string' : 'undefined or null',
      });
    }

    if (!question.answerType) {
      errors.push(`Question ${question.id} missing answerType`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Missing answerType',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: '"short-text" or "numeric"',
        actualFormat: question.answerType ? `${typeof question.answerType}: ${question.answerType}` : 'undefined or null',
      });
    }

    if (question.cognitiveLevel && !COGNITIVE_LEVELS.includes(question.cognitiveLevel as typeof COGNITIVE_LEVELS[number])) {
      errors.push(`Question ${question.id} has invalid cognitiveLevel: ${question.cognitiveLevel}`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Invalid cognitiveLevel',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: `One of: ${COGNITIVE_LEVELS.join(', ')}`,
        actualFormat: `${question.cognitiveLevel}`,
      });
    }

    // Check for removed 'hypothesis' level
    if (question.cognitiveLevel === 'hypothesis') {
      errors.push(`Question ${question.id} uses removed cognitiveLevel "hypothesis" - use "synthesis" instead`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Removed cognitiveLevel "hypothesis"',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: 'Use "synthesis" instead',
        actualFormat: 'hypothesis (removed)',
      });
    }
    
    // Enhanced: Enforce array format for ALL questions
    if (!question.expectedAnswer) {
      errors.push(`Question ${question.id} missing expectedAnswer`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Missing expectedAnswer',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: 'Array of strings: ["answer1", "answer2"]',
        actualFormat: 'undefined or null',
      });
    } else if (!Array.isArray(question.expectedAnswer)) {
      errors.push(
        `Question ${question.id}: expectedAnswer MUST be an array. ` +
        `Found: ${typeof question.expectedAnswer}. ` +
        `Use ["answer"] even for single values.`
      );
      debugData.push({
        questionId: question.id as string,
        issue: 'expectedAnswer is not an array',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: 'Array of strings: ["answer1", "answer2"]',
        actualFormat: `${typeof question.expectedAnswer}: ${JSON.stringify(question.expectedAnswer).substring(0, 150)}`,
      });
    }
    
    // Enhanced: Check numeric answers don't include units
    if (question.answerType === 'numeric' && question.expectedAnswer && Array.isArray(question.expectedAnswer)) {
      for (const answer of question.expectedAnswer) {
        if (typeof answer === 'string') {
          // Check for any letters (units), percentage symbols, or whitespace followed by units
          const hasUnitsOrLetters = /[a-zA-Z%]/.test(answer) || /\d+\s*[a-zA-Z%]/.test(answer);
          
          if (hasUnitsOrLetters) {
            // Extract just the numeric part for the suggested fix
            const numericOnly = answer.replace(/[^0-9.-]/g, '');
            
            warnings.push(
              `Question ${question.id}: CRITICAL - numeric expectedAnswer "${answer}" contains units/letters/symbols. ` +
              `This WILL cause marking failures. Remove all units and symbols, put them in hint only. ` +
              `Expected format: ["${numericOnly}"] with units in hint field.`
            );
          }
        }
      }
    }
  }

  /**
   * Validate question ID patterns
   */
  private validateQuestionIdPattern(question: Record<string, unknown>, lessonId: string, blockType: string, errors: string[]): void {
    const id = question.id as string;
    
    if (blockType === 'understanding-check') {
      // Pattern: lessonId-C{n}-L{level}-{letter}
      const pattern = new RegExp(`^${lessonId}-C\\d+-L[12](-[A-Z])?$`);
      if (!pattern.test(id)) {
        errors.push(
          `Question ${id} in understanding check doesn't follow pattern: ` +
          `${lessonId}-C{n}-L{level}-{letter}. Example: ${lessonId}-C1-L1-A`
        );
      }
    } else if (blockType === 'integrative') {
      // Pattern: lessonId-INT-{n}
      const pattern = new RegExp(`^${lessonId}-INT-\\d+$`);
      if (!pattern.test(id)) {
        errors.push(
          `Question ${id} in integrative block doesn't follow pattern: ` +
          `${lessonId}-INT-{n}. Example: ${lessonId}-INT-1`
        );
      }
    } else if (blockType === 'practice') {
      // Pattern: lessonId-P{n}
      const pattern = new RegExp(`^${lessonId}-P\\d+$`);
      if (!pattern.test(id)) {
        errors.push(
          `Question ${id} in practice block doesn't follow pattern: ` +
          `${lessonId}-P{n}. Example: ${lessonId}-P1`
        );
      }
    } else if (blockType === 'spaced-review') {
      // Pattern: lessonId-SR-{n}
      const pattern = new RegExp(`^${lessonId}-SR-\\d+$`);
      if (!pattern.test(id)) {
        errors.push(
          `Question ${id} in spaced review doesn't follow pattern: ` +
          `${lessonId}-SR-{n}. Example: ${lessonId}-SR-1`
        );
      }
    }
  }

  /**
   * Normalize expectedAnswer fields: convert comma-separated strings to arrays
   * This handles LLM output inconsistencies despite explicit prompting
   */
  private normalizeExpectedAnswers(questions: Record<string, unknown>[]): void {
    for (const question of questions) {
      if (question.expectedAnswer && typeof question.expectedAnswer === 'string') {
        // Convert comma-separated string to array
        const stringValue = question.expectedAnswer as string;
        const arrayValue = stringValue.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        console.warn(
          `[Normalization] Converted expectedAnswer from string to array for question ${question.id}:`,
          `String: "${stringValue.substring(0, 100)}..."`,
          `Array length: ${arrayValue.length}`
        );
        
        question.expectedAnswer = arrayValue;
      }
    }
  }

  /**
   * Validate spaced-review question
   */
  private validateSpacedReviewQuestion(question: Record<string, unknown>, lessonId: string, errors: string[], warnings: string[], debugData: QuestionDebugInfo[]): void {
    if (!question.id) {
      errors.push('Spaced review question missing ID');
      return;
    }

    // Check ID pattern
    if (typeof question.id === 'string' && !question.id.startsWith(lessonId)) {
      errors.push(`Spaced review question ID ${question.id} does not start with lesson ID ${lessonId}`);
    }

    // CRITICAL: Check for questionText field (common LLM typo: "attText")
    if (!question.questionText) {
      // Check for common typos
      const hasTypo = 'attText' in question || 'questiontext' in question || 'question_text' in question;
      if (hasTypo) {
        errors.push(`Spaced review question ${question.id} has typo in field name - found "${Object.keys(question).find(k => k.toLowerCase().includes('text'))}" but expected "questionText"`);
        debugData.push({
          questionId: question.id as string,
          issue: 'Field name typo (questionText)',
          questionText: 'N/A',
          fullQuestion: question,
          expectedFormat: 'questionText',
          actualFormat: Object.keys(question).find(k => k.toLowerCase().includes('text')) || 'N/A',
        });
      } else {
        errors.push(`Spaced review question ${question.id} missing questionText field`);
        debugData.push({
          questionId: question.id as string,
          issue: 'Missing questionText',
          questionText: 'N/A',
          fullQuestion: question,
          expectedFormat: 'Non-empty string',
          actualFormat: 'undefined or null',
        });
      }
    }

    if (!question.expectedAnswer) {
      errors.push(`Spaced review question ${question.id} missing expectedAnswer`);
      debugData.push({
        questionId: question.id as string,
        issue: 'Missing expectedAnswer',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: 'Array of strings: ["answer1", "answer2"]',
        actualFormat: 'undefined or null',
      });
    } else if (!Array.isArray(question.expectedAnswer)) {
      errors.push(
        `Spaced review question ${question.id}: expectedAnswer MUST be an array. ` +
        `Found: ${typeof question.expectedAnswer}. ` +
        `Use ["answer"] even for single values.`
      );
      debugData.push({
        questionId: question.id as string,
        issue: 'expectedAnswer is not an array',
        questionText: (question.questionText as string)?.substring(0, 150) || 'N/A',
        fullQuestion: question,
        expectedFormat: 'Array of strings: ["answer1", "answer2"]',
        actualFormat: `${typeof question.expectedAnswer}: ${JSON.stringify(question.expectedAnswer).substring(0, 150)}`,
      });
    }

    // Hint is optional but recommended
    if (!question.hint) {
      warnings.push(`Spaced review question ${question.id} missing hint (recommended for better learning experience)`);
    }
  }

  /**
   * Validate quiz questions
   */
  validateQuiz(questions: QuizQuestion[], lessonId: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const debugData: QuestionDebugInfo[] = [];

    // NORMALIZE: Convert comma-separated strings to arrays before validation
    this.normalizeExpectedAnswers(questions as unknown as Record<string, unknown>[]);

    if (!questions || questions.length === 0) {
      errors.push('Quiz must have at least one question');
      return { valid: false, errors, warnings, debugData: undefined };
    }

    if (questions.length !== 50) {
      warnings.push(`Quiz should have 50 questions, got ${questions.length}`);
    }

    const usedIds = new Set<number>();

    for (const question of questions) {
      // Check ID uniqueness
      if (usedIds.has(question.id)) {
        errors.push(`Duplicate question ID: ${question.id}`);
        debugData.push({
          questionId: question.id,
          issue: 'Duplicate question ID',
          questionText: question.question?.substring(0, 100) || 'N/A',
          fullQuestion: question,
          expectedFormat: 'Unique ID',
          actualFormat: 'ID already used',
        });
      }
      usedIds.add(question.id);

      // Validate required fields
      if (!question.question || question.question.length === 0) {
        errors.push(`Question ${question.id} missing question text`);
        debugData.push({
          questionId: question.id,
          issue: 'Missing question text',
          questionText: 'N/A',
          fullQuestion: question,
          expectedFormat: 'Non-empty string',
          actualFormat: question.question ? 'Empty string' : 'undefined or null',
        });
      }

      if (!question.options || question.options.length !== 4) {
        const optionsCount = question.options?.length || 0;
        const duplicateCount = question.options ? question.options.length - new Set(question.options).size : 0;
        const duplicateInfo = duplicateCount > 0 ? ` (includes ${duplicateCount} duplicate(s))` : '';
        errors.push(
          `Question ${question.id} must have exactly 4 options (found ${optionsCount}${duplicateInfo})`
        );
        debugData.push({
          questionId: question.id,
          issue: 'Invalid options count',
          questionText: question.question?.substring(0, 100) || 'N/A',
          optionsCount: optionsCount,
          options: question.options || [],
          fullQuestion: question,
          expectedFormat: 'Array with exactly 4 strings',
          actualFormat: question.options 
            ? `Array with ${question.options.length} items` 
            : 'undefined or null',
        });
      }

      if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer > 3) {
        errors.push(`Question ${question.id} has invalid correctAnswer index`);
        debugData.push({
          questionId: question.id,
          issue: 'Invalid correctAnswer index',
          questionText: question.question?.substring(0, 100) || 'N/A',
          optionsCount: question.options?.length || 0,
          options: question.options || [],
          fullQuestion: question,
          expectedFormat: 'Number between 0-3',
          actualFormat: `${question.correctAnswer} (${typeof question.correctAnswer})`,
        });
      }

      // Validate tags
      if (!question.tags || question.tags.length === 0) {
        warnings.push(`Question ${question.id} has no tags`);
      } else {
        for (const tag of question.tags) {
          if (!APPROVED_TAGS.includes(tag as typeof APPROVED_TAGS[number])) {
            warnings.push(`Question ${question.id} uses unapproved tag: ${tag}`);
          }
        }
      }

      // Validate misconception codes
      if (question.misconceptionCodes) {
        for (const [index, code] of Object.entries(question.misconceptionCodes)) {
          if (!APPROVED_MISCONCEPTION_CODES.includes(code as typeof APPROVED_MISCONCEPTION_CODES[number])) {
            warnings.push(`Question ${question.id} uses unapproved misconception code: ${code}`);
          }
        }
      }

      // Validate difficulty
      if (!question.difficulty || question.difficulty < 1 || question.difficulty > 5) {
        errors.push(`Question ${question.id} has invalid difficulty`);
        debugData.push({
          questionId: question.id,
          issue: 'Invalid difficulty',
          questionText: question.question?.substring(0, 100) || 'N/A',
          fullQuestion: question,
          expectedFormat: 'Number between 1-5',
          actualFormat: `${question.difficulty} (${typeof question.difficulty})`,
        });
      }

      // Validate learning outcome ID
      if (!question.learningOutcomeId || !question.learningOutcomeId.startsWith(lessonId)) {
        warnings.push(`Question ${question.id} learningOutcomeId doesn't match lesson`);
      }
    }

    // Check difficulty distribution
    this.validateDifficultyDistribution(questions, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      debugData: debugData.length > 0 ? debugData : undefined,
    };
  }

  /**
   * Validate difficulty distribution
   */
  private validateDifficultyDistribution(questions: QuizQuestion[], warnings: string[]): void {
    const easy = questions.filter(q => q.difficulty >= 1 && q.difficulty <= 2).length;
    const medium = questions.filter(q => q.difficulty === 3).length;
    const hard = questions.filter(q => q.difficulty >= 4 && q.difficulty <= 5).length;

    const total = questions.length;
    const easyPercent = (easy / total) * 100;
    const mediumPercent = (medium / total) * 100;
    const hardPercent = (hard / total) * 100;

    // Expected: 30% easy, 50% medium, 20% hard
    if (Math.abs(easyPercent - 30) > 10) {
      warnings.push(`Difficulty distribution: ${easyPercent.toFixed(0)}% easy (expected ~30%)`);
    }

    if (Math.abs(mediumPercent - 50) > 10) {
      warnings.push(`Difficulty distribution: ${mediumPercent.toFixed(0)}% medium (expected ~50%)`);
    }

    if (Math.abs(hardPercent - 20) > 10) {
      warnings.push(`Difficulty distribution: ${hardPercent.toFixed(0)}% hard (expected ~20%)`);
    }
  }

  /**
   * Validate basic formula correctness (Ohm's Law, etc.)
   */
  validateFormulas(content: string): string[] {
    const warnings: string[] = [];

    // Check for common formula errors
    if (content.includes('V=IR') || content.includes('V = IR')) {
      // This is correct
    } else if (content.includes('V=RI') || content.includes('V = RI')) {
      warnings.push("Formula error: Should be V=IR, not V=RI");
    }

    if (content.includes('P=VI') || content.includes('P = VI')) {
      // This is correct
    } else if (content.includes('P=IV') || content.includes('P = IV')) {
      // Also acceptable
    }

    // Check for series resistance
    if (content.toLowerCase().includes('series') && content.toLowerCase().includes('resistance')) {
      if (content.includes('R_total = R1 + R2')) {
        // Correct
      } else if (content.includes('R_total = R1 * R2') || content.includes('R_total = R1 × R2')) {
        warnings.push('Formula error: Series resistance adds (R1 + R2), not multiplies');
      }
    }

    return warnings;
  }
}

