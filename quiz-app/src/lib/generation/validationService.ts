/**
 * Validation Service
 * Validates generated lessons and quizzes for quality and correctness
 */

import { Lesson, LessonBlock, QuizQuestion, ValidationResult } from './types';
import { APPROVED_TAGS, APPROVED_MISCONCEPTION_CODES, BLOOM_LEVELS, COGNITIVE_LEVELS, BLOCK_ORDER } from './constants';

export class ValidationService {
  /**
   * Validate lesson structure and content
   */
  validateLesson(lesson: Lesson, lessonId: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

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

    if (!lesson.learningOutcomes || lesson.learningOutcomes.length < 2) {
      errors.push('Lesson must have at least 2 learning outcomes');
    }

    if (!lesson.blocks || lesson.blocks.length < 6) {
      errors.push('Lesson must have at least 6 blocks');
    }

    // Validate blocks
    if (lesson.blocks) {
      this.validateBlocks(lesson.blocks, lessonId, errors, warnings);
    }

    // Validate metadata
    if (!lesson.metadata) {
      errors.push('Lesson metadata is required');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate lesson blocks structure and order
   */
  private validateBlocks(blocks: LessonBlock[], lessonId: string, errors: string[], warnings: string[]): void {
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
      this.validateBlockContent(block, lessonId, errors, warnings);
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
  private validateBlockContent(block: LessonBlock, lessonId: string, errors: string[], warnings: string[]): void {
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
        } else if (typeof block.content.content === 'string' && block.content.content.length < 200) {
          warnings.push('Explanation content seems short (< 200 chars)');
        }
        break;

      case 'practice':
        if (!block.content.questions || !Array.isArray(block.content.questions)) {
          errors.push(`Practice block ${block.id} must have questions array`);
        } else {
          for (const question of block.content.questions) {
            this.validateQuestion(question, lessonId, errors, warnings);
          }

          // Check understanding check structure
          if (typeof block.content.mode === 'string' && block.content.mode === 'conceptual' && block.content.questions.length !== 4) {
            warnings.push('Understanding check should have exactly 4 questions (3×L1 + 1×L2)');
          }

          // Check integrative structure
          if (typeof block.content.mode === 'string' && block.content.mode === 'integrative' && block.content.questions.length !== 1) {
            warnings.push('Integrative block should have exactly 1 question');
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
            this.validateSpacedReviewQuestion(question, lessonId, errors, warnings);
          }
        }
        break;
    }
  }

  /**
   * Validate practice question
   */
  private validateQuestion(question: Record<string, unknown>, lessonId: string, errors: string[], warnings: string[]): void {
    if (!question.id) {
      errors.push('Question missing ID');
      return;
    }

    if (!question.questionText) {
      errors.push(`Question ${question.id} missing questionText`);
    }

    if (!question.answerType) {
      errors.push(`Question ${question.id} missing answerType`);
    }

    if (question.cognitiveLevel && !COGNITIVE_LEVELS.includes(question.cognitiveLevel as typeof COGNITIVE_LEVELS[number])) {
      errors.push(`Question ${question.id} has invalid cognitiveLevel: ${question.cognitiveLevel}`);
    }

    // Check for removed 'hypothesis' level
    if (question.cognitiveLevel === 'hypothesis') {
      errors.push(`Question ${question.id} uses removed cognitiveLevel "hypothesis" - use "synthesis" instead`);
    }
  }

  /**
   * Validate spaced-review question
   */
  private validateSpacedReviewQuestion(question: Record<string, unknown>, lessonId: string, errors: string[], warnings: string[]): void {
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
      } else {
        errors.push(`Spaced review question ${question.id} missing questionText field`);
      }
    }

    if (!question.expectedAnswer) {
      errors.push(`Spaced review question ${question.id} missing expectedAnswer`);
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

    if (!questions || questions.length === 0) {
      errors.push('Quiz must have at least one question');
      return { valid: false, errors, warnings };
    }

    if (questions.length !== 50) {
      warnings.push(`Quiz should have 50 questions, got ${questions.length}`);
    }

    const usedIds = new Set<number>();

    for (const question of questions) {
      // Check ID uniqueness
      if (usedIds.has(question.id)) {
        errors.push(`Duplicate question ID: ${question.id}`);
      }
      usedIds.add(question.id);

      // Validate required fields
      if (!question.question || question.question.length === 0) {
        errors.push(`Question ${question.id} missing question text`);
      }

      if (!question.options || question.options.length !== 4) {
        errors.push(`Question ${question.id} must have exactly 4 options`);
      }

      if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer > 3) {
        errors.push(`Question ${question.id} has invalid correctAnswer index`);
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
