/**
 * Strict Lint Service
 * High-priority validation rules that MUST pass for 95+ lesson scores
 * These are hard failures that trigger automatic repair
 */

import { Lesson, LessonBlock } from './types';

export type LintErrorCode =
  // Schema failures
  | 'SCHEMA_MISSING_FIELD'
  | 'SCHEMA_INVALID_TYPE'
  | 'SCHEMA_LO_NOT_STRING_ARRAY'
  | 'SCHEMA_EXPECTED_ANSWER_NOT_ARRAY'
  
  // ID failures
  | 'ID_DUPLICATE_BLOCK'
  | 'ID_DUPLICATE_QUESTION'
  | 'ID_PATTERN_INVALID'
  
  // Order failures
  | 'ORDER_NOT_MONOTONIC'
  | 'ORDER_DUPLICATE'
  | 'ORDER_CHECK_NOT_AFTER_EXPLANATION'
  | 'ORDER_SR_NOT_LAST'
  | 'ORDER_DIAGRAM_MISSING_SPLITVIS'
  
  // Structure failures
  | 'STRUCTURE_CHECK_WRONG_COUNT'
  | 'STRUCTURE_CHECK_WRONG_LEVELS'
  | 'STRUCTURE_INTEGRATIVE_WRONG_COUNT'
  | 'STRUCTURE_INTEGRATIVE_WRONG_LEVELS'
  | 'STRUCTURE_SR_WRONG_COUNT'
  
  // Field name failures
  | 'FIELD_QUESTIONTEXT_TYPO'
  | 'FIELD_ANSWERTYPE_INVALID';

export interface LintFailure {
  code: LintErrorCode;
  severity: 'critical' | 'high' | 'medium';
  message: string;
  path?: string; // JSON path like "blocks[5].content.questions[2]"
  suggestedFix?: string;
  example?: string;
}

export interface StrictLintResult {
  passed: boolean;
  failures: LintFailure[];
  stats: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
  };
}

export class StrictLintService {
  /**
   * Run strict lint validation on a lesson
   * Returns hard failures that must be fixed for 95+ scores
   */
  strictLint(lesson: Lesson, lessonId: string): StrictLintResult {
    const failures: LintFailure[] = [];

    // Run all validation rules
    this.validateSchema(lesson, lessonId, failures);
    this.validateIds(lesson, lessonId, failures);
    this.validateOrders(lesson, failures);
    this.validateStructure(lesson, failures);
    this.validateFieldNames(lesson, failures);

    // Calculate stats
    const stats = {
      criticalCount: failures.filter(f => f.severity === 'critical').length,
      highCount: failures.filter(f => f.severity === 'high').length,
      mediumCount: failures.filter(f => f.severity === 'medium').length,
    };

    return {
      passed: failures.length === 0,
      failures,
      stats,
    };
  }

  /**
   * Format failures for repair prompt
   */
  formatFailuresForRepair(failures: LintFailure[]): string {
    const formatFailure = (f: LintFailure) => {
      let msg = `[${f.code}] ${f.message}`;
      if (f.path) msg += `\n  Location: ${f.path}`;
      if (f.suggestedFix) msg += `\n  Fix: ${f.suggestedFix}`;
      if (f.example) msg += `\n  Example: ${f.example}`;
      return msg;
    };

    const critical = failures.filter(f => f.severity === 'critical');
    const high = failures.filter(f => f.severity === 'high');
    const medium = failures.filter(f => f.severity === 'medium');

    let output = '';
    
    if (critical.length > 0) {
      output += `CRITICAL FAILURES (${critical.length}):\n`;
      output += critical.map(formatFailure).join('\n\n') + '\n\n';
    }
    
    if (high.length > 0) {
      output += `HIGH PRIORITY (${high.length}):\n`;
      output += high.map(formatFailure).join('\n\n') + '\n\n';
    }
    
    if (medium.length > 0) {
      output += `MEDIUM PRIORITY (${medium.length}):\n`;
      output += medium.map(formatFailure).join('\n\n');
    }

    return output;
  }

  /**
   * Validate schema requirements
   */
  private validateSchema(lesson: Lesson, lessonId: string, failures: LintFailure[]): void {
    // Required top-level fields
    const required: Array<keyof Lesson> = [
      'id', 'title', 'description', 'layout', 'unit', 'topic',
      'learningOutcomes', 'blocks', 'metadata'
    ];

    for (const field of required) {
      if (!(field in lesson) || lesson[field] === undefined || lesson[field] === null) {
        failures.push({
          code: 'SCHEMA_MISSING_FIELD',
          severity: 'critical',
          message: `Missing required field: ${field}`,
          path: field,
          suggestedFix: `Add "${field}" field at top level`,
        });
      }
    }

    // Validate learningOutcomes is string[]
    if (lesson.learningOutcomes) {
      if (!Array.isArray(lesson.learningOutcomes)) {
        failures.push({
          code: 'SCHEMA_LO_NOT_STRING_ARRAY',
          severity: 'critical',
          message: 'learningOutcomes must be an array',
          path: 'learningOutcomes',
          suggestedFix: 'Change to array format: ["outcome1", "outcome2"]',
        });
      } else {
        lesson.learningOutcomes.forEach((lo, idx) => {
          if (typeof lo !== 'string') {
            failures.push({
              code: 'SCHEMA_LO_NOT_STRING_ARRAY',
              severity: 'critical',
              message: `learningOutcomes[${idx}] must be a string, not an object`,
              path: `learningOutcomes[${idx}]`,
              suggestedFix: 'Use plain string format, not {text: "...", bloomLevel: "..."}',
              example: '"Define key electrical terms" (not {"text": "...", "bloomLevel": "..."})',
            });
          }
        });
      }
    }

    // Validate all expectedAnswer fields are arrays
    if (lesson.blocks) {
      for (let blockIdx = 0; blockIdx < lesson.blocks.length; blockIdx++) {
        const block = lesson.blocks[blockIdx];
        const questions = block.content.questions;
        
        if (Array.isArray(questions)) {
          for (let qIdx = 0; qIdx < questions.length; qIdx++) {
            const question = questions[qIdx];
            
            if (question.expectedAnswer !== undefined && !Array.isArray(question.expectedAnswer)) {
              failures.push({
                code: 'SCHEMA_EXPECTED_ANSWER_NOT_ARRAY',
                severity: 'critical',
                message: `expectedAnswer must be an array in question ${question.id || qIdx}`,
                path: `blocks[${blockIdx}].content.questions[${qIdx}].expectedAnswer`,
                suggestedFix: 'Change to array format: ["answer"] or ["answer1", "answer2"]',
                example: '["5.5"] or ["Residual Current Device", "RCD"]',
              });
            }
          }
        }
      }
    }

    // Validate layout enum
    if (lesson.layout && !['split-vis', 'linear-flow', 'focus-mode'].includes(lesson.layout)) {
      failures.push({
        code: 'SCHEMA_INVALID_TYPE',
        severity: 'critical',
        message: `Invalid layout: "${lesson.layout}"`,
        path: 'layout',
        suggestedFix: 'Use "split-vis", "linear-flow", or "focus-mode"',
      });
    }
  }

  /**
   * Validate ID uniqueness and patterns
   */
  private validateIds(lesson: Lesson, lessonId: string, failures: LintFailure[]): void {
    if (!lesson.blocks) return;

    const blockIds = new Set<string>();
    const questionIds = new Set<string>();

    for (let blockIdx = 0; blockIdx < lesson.blocks.length; blockIdx++) {
      const block = lesson.blocks[blockIdx];

      // Check block ID uniqueness
      if (blockIds.has(block.id)) {
        failures.push({
          code: 'ID_DUPLICATE_BLOCK',
          severity: 'critical',
          message: `Duplicate block ID: ${block.id}`,
          path: `blocks[${blockIdx}].id`,
          suggestedFix: `Make block ID unique, suggest: ${block.id}-alt or ${block.id}-2`,
        });
      }
      blockIds.add(block.id);

      // Check block ID starts with lessonId
      if (!block.id.startsWith(lessonId)) {
        failures.push({
          code: 'ID_PATTERN_INVALID',
          severity: 'high',
          message: `Block ID ${block.id} doesn't start with lesson ID ${lessonId}`,
          path: `blocks[${blockIdx}].id`,
          suggestedFix: `Prefix with ${lessonId}-`,
        });
      }

      // Check question IDs
      const questions = block.content.questions;
      if (Array.isArray(questions)) {
        for (let qIdx = 0; qIdx < questions.length; qIdx++) {
          const question = questions[qIdx];
          
          if (!question.id) {
            failures.push({
              code: 'ID_PATTERN_INVALID',
              severity: 'critical',
              message: `Question missing ID in block ${block.id}`,
              path: `blocks[${blockIdx}].content.questions[${qIdx}].id`,
              suggestedFix: 'Add unique ID following pattern',
            });
            continue;
          }

          // Check uniqueness
          if (questionIds.has(question.id)) {
            failures.push({
              code: 'ID_DUPLICATE_QUESTION',
              severity: 'critical',
              message: `Duplicate question ID: ${question.id}`,
              path: `blocks[${blockIdx}].content.questions[${qIdx}].id`,
              suggestedFix: 'Increment question number to make unique',
            });
          }
          questionIds.add(question.id);

          // Validate pattern based on block type
          this.validateQuestionIdPattern(question, block.type, block.content.mode, lessonId, failures, blockIdx, qIdx);
        }
      }
    }
  }

  /**
   * Validate question ID patterns
   */
  private validateQuestionIdPattern(
    question: { id?: string },
    blockType: string,
    blockMode: string | undefined,
    lessonId: string,
    failures: LintFailure[],
    blockIdx?: number,
    qIdx?: number
  ): void {
    if (!question.id) return;

    const id = question.id;
    let expectedPattern = '';
    let isValid = false;

    if (blockType === 'practice' && blockMode === 'conceptual') {
      // Understanding check: lessonId-C{n}-L{1|2}[-{A-Z}]
      expectedPattern = `${lessonId}-C\\d+-L[12](-[A-Z])?`;
      isValid = new RegExp(`^${expectedPattern}$`).test(id);
    } else if (blockType === 'practice' && blockMode === 'integrative') {
      // Integrative: lessonId-INT-{n}
      expectedPattern = `${lessonId}-INT-\\d+`;
      isValid = new RegExp(`^${expectedPattern}$`).test(id);
    } else if (blockType === 'practice' && !blockMode) {
      // Practice: lessonId-P{n}
      expectedPattern = `${lessonId}-P\\d+`;
      isValid = new RegExp(`^${expectedPattern}$`).test(id);
    } else if (blockType === 'spaced-review') {
      // Spaced review: lessonId-SR-{n}
      expectedPattern = `${lessonId}-SR-\\d+`;
      isValid = new RegExp(`^${expectedPattern}$`).test(id);
    } else {
      // Other block types with questions - just check starts with lessonId
      isValid = id.startsWith(lessonId);
    }

    if (!isValid && expectedPattern) {
      const path = blockIdx !== undefined && qIdx !== undefined
        ? `blocks[${blockIdx}].content.questions[${qIdx}].id`
        : 'question.id';
      
      failures.push({
        code: 'ID_PATTERN_INVALID',
        severity: 'high',
        message: `Question ID "${id}" doesn't follow pattern`,
        path,
        suggestedFix: `Use pattern: ${expectedPattern.replace(/\\\\/g, '\\')}`,
        example: this.getIdPatternExample(blockType, blockMode, lessonId),
      });
    }
  }

  /**
   * Get example ID for a block type
   */
  private getIdPatternExample(blockType: string, blockMode: string | undefined, lessonId: string): string {
    if (blockType === 'practice' && blockMode === 'conceptual') {
      return `${lessonId}-C1-L1-A or ${lessonId}-C1-L2`;
    } else if (blockType === 'practice' && blockMode === 'integrative') {
      return `${lessonId}-INT-1 or ${lessonId}-INT-2`;
    } else if (blockType === 'practice' && !blockMode) {
      return `${lessonId}-P1 or ${lessonId}-P2`;
    } else if (blockType === 'spaced-review') {
      return `${lessonId}-SR-1 or ${lessonId}-SR-2`;
    }
    return `${lessonId}-{type}-{number}`;
  }

  /**
   * Validate block order requirements
   */
  private validateOrders(lesson: Lesson, failures: LintFailure[]): void {
    if (!lesson.blocks || lesson.blocks.length === 0) return;

    const blocks = lesson.blocks;
    const orders = blocks.map(b => ({ order: b.order, id: b.id, type: b.type }));

    // Check monotonic (strictly increasing)
    const sortedOrders = [...orders].sort((a, b) => a.order - b.order);
    for (let i = 1; i < sortedOrders.length; i++) {
      if (sortedOrders[i].order <= sortedOrders[i - 1].order) {
        failures.push({
          code: 'ORDER_NOT_MONOTONIC',
          severity: 'critical',
          message: `Orders not strictly increasing: ${sortedOrders[i - 1].order} (${sortedOrders[i - 1].id}) → ${sortedOrders[i].order} (${sortedOrders[i].id})`,
          path: 'blocks[].order',
          suggestedFix: 'Use decimal spacing: 1, 2, 3, 4, 4.5, 5, 5.5, 6, etc.',
        });
      }
    }

    // Check for duplicate orders
    const orderMap = new Map<number, string[]>();
    for (const block of blocks) {
      const existing = orderMap.get(block.order) || [];
      existing.push(block.id);
      orderMap.set(block.order, existing);
    }

    for (const [order, blockIds] of orderMap.entries()) {
      if (blockIds.length > 1) {
        failures.push({
          code: 'ORDER_DUPLICATE',
          severity: 'critical',
          message: `Duplicate order ${order} used by: ${blockIds.join(', ')}`,
          path: 'blocks[].order',
          suggestedFix: 'Assign unique order values to each block',
        });
      }
    }

    // Spaced review must be last
    const srBlock = blocks.find(b => b.type === 'spaced-review');
    const maxOrder = Math.max(...blocks.map(b => b.order));
    if (srBlock && srBlock.order !== maxOrder) {
      failures.push({
        code: 'ORDER_SR_NOT_LAST',
        severity: 'high',
        message: `Spaced review at order ${srBlock.order}, but max order is ${maxOrder}. SR must be last.`,
        path: `${srBlock.id}.order`,
        suggestedFix: `Change spaced review order to ${maxOrder + 0.5} or ensure it's the final block`,
      });
    }

    // Diagram required for split-vis layout
    if (lesson.layout === 'split-vis') {
      const hasDiagram = blocks.some(b => b.type === 'diagram');
      if (!hasDiagram) {
        failures.push({
          code: 'ORDER_DIAGRAM_MISSING_SPLITVIS',
          severity: 'high',
          message: 'Layout is "split-vis" but no diagram block found',
          path: 'blocks',
          suggestedFix: 'Add diagram block at order 3, or change layout to "linear-flow"',
        });
      }
    }

    // Understanding checks must come after explanations (order X.5 after order X)
    const explanationOrders = blocks
      .filter(b => b.type === 'explanation')
      .map(b => b.order);
    
    const checks = blocks.filter(b => 
      b.type === 'practice' && b.content.mode === 'conceptual'
    );

    for (const check of checks) {
      // Check should be at X.5 where X is an explanation order
      const checkOrder = check.order;
      const expectedExplanationOrder = Math.floor(checkOrder);
      
      // Find if there's an explanation at the expected order
      const hasExplanationBefore = explanationOrders.some(
        expOrder => expOrder === expectedExplanationOrder
      );

      if (!hasExplanationBefore) {
        failures.push({
          code: 'ORDER_CHECK_NOT_AFTER_EXPLANATION',
          severity: 'high',
          message: `Understanding check at order ${checkOrder} should follow explanation at order ${expectedExplanationOrder}`,
          path: `${check.id}.order`,
          suggestedFix: `Place check immediately after (0.5 above) the explanation it assesses`,
        });
      }
    }
  }

  /**
   * Validate block structure requirements
   */
  private validateStructure(lesson: Lesson, failures: LintFailure[]): void {
    if (!lesson.blocks) return;

    for (let blockIdx = 0; blockIdx < lesson.blocks.length; blockIdx++) {
      const block = lesson.blocks[blockIdx];

      // Understanding check validation
      if (block.type === 'practice' && block.content.mode === 'conceptual') {
        const questions = block.content.questions || [];
        
        // Must have exactly 4 questions
        if (questions.length !== 4) {
          failures.push({
            code: 'STRUCTURE_CHECK_WRONG_COUNT',
            severity: 'high',
            message: `Understanding check "${block.id}" has ${questions.length} questions, needs exactly 4`,
            path: `blocks[${blockIdx}].content.questions`,
            suggestedFix: '3 recall questions (cognitiveLevel: "recall") + 1 connection question (cognitiveLevel: "connection")',
          });
        }

        // Must be 3 recall + 1 connection
        const levels = questions.map(q => q.cognitiveLevel);
        const recallCount = levels.filter(l => l === 'recall').length;
        const connectionCount = levels.filter(l => l === 'connection').length;

        if (recallCount !== 3 || connectionCount !== 1) {
          failures.push({
            code: 'STRUCTURE_CHECK_WRONG_LEVELS',
            severity: 'high',
            message: `Check "${block.id}" has ${recallCount} recall, ${connectionCount} connection. Need exactly 3 recall + 1 connection.`,
            path: `blocks[${blockIdx}].content.questions`,
            suggestedFix: 'First 3 questions: cognitiveLevel "recall", Last question: cognitiveLevel "connection"',
          });
        }
      }

      // Integrative validation
      if (block.type === 'practice' && block.content.mode === 'integrative') {
        const questions = block.content.questions || [];
        
        // Must have exactly 2 questions
        if (questions.length !== 2) {
          failures.push({
            code: 'STRUCTURE_INTEGRATIVE_WRONG_COUNT',
            severity: 'high',
            message: `Integrative block "${block.id}" has ${questions.length} questions, needs exactly 2`,
            path: `blocks[${blockIdx}].content.questions`,
            suggestedFix: '1 connection question + 1 synthesis question',
          });
        }

        // Must be connection + synthesis
        if (questions.length === 2) {
          const levels = questions.map(q => q.cognitiveLevel);
          if (levels[0] !== 'connection' || levels[1] !== 'synthesis') {
            failures.push({
              code: 'STRUCTURE_INTEGRATIVE_WRONG_LEVELS',
              severity: 'high',
              message: `Integrative "${block.id}" must have Q1=connection, Q2=synthesis (found: ${levels[0]}, ${levels[1]})`,
              path: `blocks[${blockIdx}].content.questions`,
              suggestedFix: 'Q1: cognitiveLevel "connection", Q2: cognitiveLevel "synthesis"',
            });
          }
        }
      }

      // Spaced review validation
      if (block.type === 'spaced-review') {
        const questions = block.content.questions || [];
        
        // Should have exactly 4 questions
        if (questions.length !== 4) {
          failures.push({
            code: 'STRUCTURE_SR_WRONG_COUNT',
            severity: 'medium',
            message: `Spaced review "${block.id}" has ${questions.length} questions, should have exactly 4`,
            path: `blocks[${blockIdx}].content.questions`,
            suggestedFix: 'Add or remove questions to have exactly 4 spaced review questions',
          });
        }
      }
    }
  }

  /**
   * Validate field names (common typos)
   */
  private validateFieldNames(lesson: Lesson, failures: LintFailure[]): void {
    if (!lesson.blocks) return;

    for (let blockIdx = 0; blockIdx < lesson.blocks.length; blockIdx++) {
      const block = lesson.blocks[blockIdx];
      const questions = block.content.questions;

      if (Array.isArray(questions)) {
        for (let qIdx = 0; qIdx < questions.length; qIdx++) {
          const question = questions[qIdx];

          // Check for questionText typos (common LLM error)
          if (!('questionText' in question)) {
            // Check for common typos
            const keys = Object.keys(question);
            const typos = ['attText', 'questiontext', 'question_text', 'text', 'questionTxt'];
            const foundTypo = keys.find(k => typos.includes(k));

            if (foundTypo) {
              failures.push({
                code: 'FIELD_QUESTIONTEXT_TYPO',
                severity: 'critical',
                message: `Question has "${foundTypo}" instead of "questionText"`,
                path: `blocks[${blockIdx}].content.questions[${qIdx}]`,
                suggestedFix: `Rename "${foundTypo}" to "questionText"`,
              });
            }
          }

          // Validate answerType enum
          if (question.answerType) {
            const validTypes = ['numeric', 'short-text', 'mcq', 'true-false'];
            if (!validTypes.includes(question.answerType)) {
              failures.push({
                code: 'FIELD_ANSWERTYPE_INVALID',
                severity: 'high',
                message: `Invalid answerType: "${question.answerType}"`,
                path: `blocks[${blockIdx}].content.questions[${qIdx}].answerType`,
                suggestedFix: `Use one of: ${validTypes.join(', ')}`,
              });
            }
          }
        }
      }
    }
  }
}
