/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Rubric-Based Lesson Scoring Service
 * 
 * Implements the universal lesson rubric (98/100 target)
 * Based on: reports/new_gen/runric.md
 * 
 * Scoring breakdown:
 * A) Schema & Contract Compliance (20)
 * B) Pedagogy & Staging (25)
 * C) Questions & Cognitive Structure (25)
 * D) Marking Robustness (20)
 * E) Visual/Diagram Alignment (5)
 * F) Safety, Accuracy, Professionalism (5)
 */

import { Lesson, LessonBlock } from './types';

export interface RubricScore {
  total: number;              // Out of 100
  breakdown: {
    schemaCompliance: number;    // A: 20 points
    pedagogy: number;            // B: 25 points
    questions: number;           // C: 25 points
    marking: number;             // D: 20 points
    visual: number;              // E: 5 points
    safety: number;              // F: 5 points
  };
  details: RubricDetail[];
  grade: string;                 // "Ship it" | "Strong" | "Usable" | "Needs rework"
  autoCap?: {
    triggered: boolean;
    reason: string;
    cappedAt: number;
  };
}

export interface RubricDetail {
  section: string;              // e.g., "A2: Block order contract"
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
}

interface SectionScore {
  score: number;
  maxScore: number;
  details: RubricDetail[];
  autoCap?: {
    triggered: boolean;
    reason: string;
    cappedAt: number;
  };
}

export class RubricScoringService {
  /**
   * Score a lesson using the universal rubric
   */
  scoreLesson(lesson: Lesson): RubricScore {
    // Score all sections
    const schemaResult = this.scoreSchemaCompliance(lesson);
    const pedagogyResult = this.scorePedagogy(lesson);
    const questionsResult = this.scoreQuestions(lesson);
    const markingResult = this.scoreMarking(lesson);
    const visualResult = this.scoreVisual(lesson);
    const safetyResult = this.scoreSafety(lesson);

    // Calculate total (may be capped)
    let total = 
      schemaResult.score +
      pedagogyResult.score +
      questionsResult.score +
      markingResult.score +
      visualResult.score +
      safetyResult.score;

    // Check for auto-cap conditions
    const autoCap = this.checkAutoCap(
      schemaResult,
      markingResult,
      safetyResult,
      total
    );

    if (autoCap.triggered) {
      total = Math.min(total, autoCap.cappedAt);
    }

    // Determine grade
    const grade = this.determineGrade(total, autoCap.triggered);

    // Combine all details
    const details = [
      ...schemaResult.details,
      ...pedagogyResult.details,
      ...questionsResult.details,
      ...markingResult.details,
      ...visualResult.details,
      ...safetyResult.details,
    ];

    return {
      total,
      breakdown: {
        schemaCompliance: schemaResult.score,
        pedagogy: pedagogyResult.score,
        questions: questionsResult.score,
        marking: markingResult.score,
        visual: visualResult.score,
        safety: safetyResult.score,
      },
      details,
      grade,
      autoCap: autoCap.triggered ? autoCap : undefined,
    };
  }

  /**
   * A) Schema & Contract Compliance (20 points)
   */
  private scoreSchemaCompliance(lesson: Lesson): SectionScore {
    const details: RubricDetail[] = [];
    let totalScore = 0;

    // A1: Valid JSON + required top-level fields (6)
    const a1 = this.scoreA1_ValidJSON(lesson);
    details.push(a1);
    totalScore += a1.score;

    // A2: Block order contract & monotonicity (8)
    const a2 = this.scoreA2_BlockOrderContract(lesson);
    details.push(a2);
    totalScore += a2.score;

    // A3: IDs + naming patterns (6)
    const a3 = this.scoreA3_IDsAndPatterns(lesson);
    details.push(a3);
    totalScore += a3.score;

    return {
      score: totalScore,
      maxScore: 20,
      details,
    };
  }

  private scoreA1_ValidJSON(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 6;

    // Check required fields
    const required = ['id', 'title', 'description', 'layout', 'unit', 'topic', 'learningOutcomes', 'prerequisites', 'blocks', 'metadata'];
    for (const field of required) {
      if (!(field in lesson)) {
        issues.push(`Missing required field: ${field}`);
        score -= 1;
      }
    }

    // Check learningOutcomes is array
    if (!Array.isArray(lesson.learningOutcomes)) {
      issues.push('learningOutcomes must be an array');
      score -= 1;
    }

    // Check blocks is array
    if (!Array.isArray(lesson.blocks)) {
      issues.push('blocks must be an array');
      score -= 2;
    }

    if (issues.length === 0) {
      suggestions.push('All required fields present and valid');
    } else {
      suggestions.push('Ensure all required top-level fields are present');
    }

    return {
      section: 'A1: Valid JSON + required fields',
      score: Math.max(0, score),
      maxScore: 6,
      issues,
      suggestions,
    };
  }

  private scoreA2_BlockOrderContract(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 8;

    const orders = lesson.blocks.map(b => b.order);
    
    // Required orders: 1, 2, 8, 9.5, 10
    const required = [1, 2, 8, 9.5, 10];
    for (const order of required) {
      if (!orders.includes(order)) {
        issues.push(`Missing required block order: ${order}`);
        score -= 2;
      }
    }

    // Spaced review must be last at order 10
    const lastOrder = orders[orders.length - 1];
    if (lastOrder !== 10) {
      issues.push(`Spaced review must be last (order 10), found ${lastOrder}`);
      score -= 3;
    }

    // Checks must be at .5 positions
    if (orders.includes(4) && !orders.includes(4.5)) {
      issues.push('Explanation at 4 requires check at 4.5');
      score -= 2;
    }
    if (orders.includes(5) && !orders.includes(5.5)) {
      issues.push('Explanation at 5 requires check at 5.5');
      score -= 2;
    }

    // Integrative must be at 9.5
    if (!orders.includes(9.5)) {
      issues.push('Integrative block must be at order 9.5');
      score -= 2;
    }

    // Check monotonic increasing
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] <= orders[i - 1]) {
        issues.push(`Non-monotonic order: ${orders[i - 1]} -> ${orders[i]}`);
        score -= 1;
        break;
      }
    }

    // Check uniqueness
    const unique = new Set(orders);
    if (unique.size !== orders.length) {
      issues.push('Duplicate block orders detected');
      score -= 2;
    }

    if (issues.length === 0) {
      suggestions.push('Block order contract perfectly followed');
    } else {
      suggestions.push('Fix block orders to: 1,2,(3),4,4.5,(5,5.5),(6,7),8,9.5,10');
    }

    return {
      section: 'A2: Block order contract & monotonicity',
      score: Math.max(0, score),
      maxScore: 8,
      issues,
      suggestions,
    };
  }

  private scoreA3_IDsAndPatterns(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 6;

    // Check block ID uniqueness
    const blockIds = lesson.blocks.map(b => b.id);
    const uniqueBlockIds = new Set(blockIds);
    if (uniqueBlockIds.size !== blockIds.length) {
      issues.push('Duplicate block IDs detected');
      score -= 2;
    }

    // Check question IDs in practice blocks
    const practiceBlocks = lesson.blocks.filter(b => b.type === 'practice');
    for (const block of practiceBlocks) {
      const questions = (block.content as any).questions;
      if (Array.isArray(questions)) {
        const questionIds = questions.map((q: any) => q.id).filter(Boolean);
        const uniqueQuestionIds = new Set(questionIds);
        if (questionIds.length !== uniqueQuestionIds.length) {
          issues.push(`Duplicate question IDs in block ${block.id}`);
          score -= 1;
        }

        // Check for proper ID patterns
        for (const q of questions) {
          if (q.id && typeof q.id === 'string') {
            // Valid patterns: C1-L1-A, INT-1, P1, SR-1
            const validPattern = /^(C\d-L[12](-[ABC])?|INT-\d+|P\d+|SR-\d+)$/;
            if (!validPattern.test(q.id)) {
              issues.push(`Invalid question ID pattern: ${q.id}`);
              score -= 0.5;
            }
          }
        }
      }
    }

    if (issues.length === 0) {
      suggestions.push('All IDs unique and follow correct patterns');
    } else {
      suggestions.push('Ensure block and question IDs are unique and follow patterns (C1-L1-A, INT-1, P1, SR-1)');
    }

    return {
      section: 'A3: IDs + naming patterns',
      score: Math.max(0, score),
      maxScore: 6,
      issues,
      suggestions,
    };
  }

  /**
   * B) Pedagogy & Staging (25 points)
   */
  private scorePedagogy(lesson: Lesson): SectionScore {
    const details: RubricDetail[] = [];
    let totalScore = 0;

    // B1: Teaching-before-testing (10)
    const b1 = this.scoreB1_TeachingBeforeTesting(lesson);
    details.push(b1);
    totalScore += b1.score;

    // B2: Explanation quality & required outline (10)
    const b2 = this.scoreB2_ExplanationQuality(lesson);
    details.push(b2);
    totalScore += b2.score;

    // B3: Learning outcomes coverage (5)
    const b3 = this.scoreB3_LearningOutcomesCoverage(lesson);
    details.push(b3);
    totalScore += b3.score;

    return {
      score: totalScore,
      maxScore: 25,
      details,
    };
  }

  private scoreB1_TeachingBeforeTesting(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 10;

    // Find explanations and checks
    const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
    const checkBlocks = lesson.blocks.filter(b => 
      b.type === 'practice' && (b.content as any).mode === 'conceptual'
    );

    // Checks should come after explanations
    for (const check of checkBlocks) {
      const checkOrder = check.order;
      const closestExplanation = explanationBlocks
        .filter(e => e.order < checkOrder)
        .sort((a, b) => b.order - a.order)[0];

      if (!closestExplanation) {
        issues.push(`Check at order ${checkOrder} has no prior explanation`);
        score -= 3;
      } else {
        // Check should be immediately after explanation (.5 positions)
        const expectedCheckOrder = Math.floor(closestExplanation.order) + 0.5;
        if (Math.abs(checkOrder - expectedCheckOrder) > 0.1) {
          issues.push(`Check at ${checkOrder} not immediately after explanation at ${closestExplanation.order}`);
          score -= 1;
        }
      }
    }

    if (issues.length === 0) {
      suggestions.push('All checks properly placed after explanations');
    } else {
      suggestions.push('Place understanding checks immediately after their explanations (at .5 positions)');
    }

    return {
      section: 'B1: Teaching-before-testing',
      score: Math.max(0, score),
      maxScore: 10,
      issues,
      suggestions,
    };
  }

  private scoreB2_ExplanationQuality(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 10;

    const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');

    for (const block of explanationBlocks) {
      const content = (block.content as any).content || '';
      
      // Check for required sections (rough heuristic)
      const hasWhatItIs = /what (this|it) is/i.test(content);
      const hasWhyMatters = /why (this|it) matters/i.test(content);
      const hasKeyFacts = /key (facts|rules)/i.test(content);
      const hasHowToUse = /how to use/i.test(content);
      const hasMistakes = /common mistakes/i.test(content);
      const hasRecap = /quick recap|recap/i.test(content);

      const sectionsPresent = [hasWhatItIs, hasWhyMatters, hasKeyFacts, hasHowToUse, hasMistakes, hasRecap].filter(Boolean).length;

      if (sectionsPresent < 4) {
        issues.push(`Explanation "${(block.content as any).title}" missing required sections (found ${sectionsPresent}/6)`);
        score -= 2;
      }

      // Check length (400-700 words rough target)
      const wordCount = content.split(/\s+/).length;
      if (wordCount < 300) {
        issues.push(`Explanation too short (${wordCount} words, target 400-700)`);
        score -= 1;
      } else if (wordCount > 900) {
        issues.push(`Explanation too long (${wordCount} words, target 400-700)`);
        score -= 0.5;
      }
    }

    if (explanationBlocks.length === 0) {
      issues.push('No explanation blocks found');
      score = 0;
    }

    if (issues.length === 0) {
      suggestions.push('Explanation structure and length appropriate');
    } else {
      suggestions.push('Ensure explanations follow 6-part structure: What it is, Why it matters, Key facts, How to use, Common mistakes, Quick recap');
    }

    return {
      section: 'B2: Explanation quality & required outline',
      score: Math.max(0, score),
      maxScore: 10,
      issues,
      suggestions,
    };
  }

  private scoreB3_LearningOutcomesCoverage(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 5;

    // Get all explanation content
    const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
    const allExplanationText = explanationBlocks
      .map(b => ((b.content as any).content || '').toLowerCase())
      .join(' ');

    // Check if learning outcomes are addressed
    for (const outcome of lesson.learningOutcomes) {
      const outcomeLower = outcome.toLowerCase();
      
      // Extract key verbs and nouns
      const keyTerms = outcome
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4); // Significant words

      const covered = keyTerms.some(term => allExplanationText.includes(term));

      if (!covered) {
        issues.push(`Learning outcome may not be covered: "${outcome}"`);
        score -= 2;
      }
    }

    if (issues.length === 0) {
      suggestions.push('All learning outcomes appear to be covered in explanations');
    } else {
      suggestions.push('Ensure each learning outcome is explicitly addressed in explanation content');
    }

    return {
      section: 'B3: Learning outcomes coverage',
      score: Math.max(0, score),
      maxScore: 5,
      issues,
      suggestions,
    };
  }

  /**
   * C) Questions & Cognitive Structure (25 points)
   */
  private scoreQuestions(lesson: Lesson): SectionScore {
    const details: RubricDetail[] = [];
    let totalScore = 0;

    // C1: Understanding checks structure (8)
    const c1 = this.scoreC1_UnderstandingChecksStructure(lesson);
    details.push(c1);
    totalScore += c1.score;

    // C2: Practice block quality (7)
    const c2 = this.scoreC2_PracticeQuality(lesson);
    details.push(c2);
    totalScore += c2.score;

    // C3: Integrative block (6)
    const c3 = this.scoreC3_IntegrativeBlock(lesson);
    details.push(c3);
    totalScore += c3.score;

    // C4: Spaced review quality (4)
    const c4 = this.scoreC4_SpacedReviewQuality(lesson);
    details.push(c4);
    totalScore += c4.score;

    return {
      score: totalScore,
      maxScore: 25,
      details,
    };
  }

  private scoreC1_UnderstandingChecksStructure(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 8;

    const checkBlocks = lesson.blocks.filter(b => 
      b.type === 'practice' && (b.content as any).mode === 'conceptual'
    );

    for (const block of checkBlocks) {
      const questions = (block.content as any).questions || [];
      
      // Should have exactly 4 questions: 3 recall + 1 connection
      if (questions.length !== 4) {
        issues.push(`Check block "${(block.content as any).title}" has ${questions.length} questions (expected 4)`);
        score -= 2;
      }

      // Check cognitive levels
      const recallCount = questions.filter((q: any) => q.cognitiveLevel === 'recall').length;
      const connectionCount = questions.filter((q: any) => q.cognitiveLevel === 'connection').length;

      if (recallCount !== 3) {
        issues.push(`Check should have 3 recall questions (found ${recallCount})`);
        score -= 1;
      }

      if (connectionCount !== 1) {
        issues.push(`Check should have 1 connection question (found ${connectionCount})`);
        score -= 1;
      }

      // Check if at correct position (.5 after explanation)
      if (block.order % 1 !== 0.5) {
        issues.push(`Check at order ${block.order} should be at .5 position`);
        score -= 1;
      }
    }

    // Should have at least 1 check block
    if (checkBlocks.length === 0) {
      issues.push('No understanding check blocks found');
      score = 0;
    }

    if (issues.length === 0) {
      suggestions.push('Understanding checks perfectly structured (3 recall + 1 connection)');
    } else {
      suggestions.push('Each check should have exactly 3 recall (L1) + 1 connection (L2) questions at .5 positions');
    }

    return {
      section: 'C1: Understanding checks structure',
      score: Math.max(0, score),
      maxScore: 8,
      issues,
      suggestions,
    };
  }

  private scoreC2_PracticeQuality(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 7;

    const practiceBlock = lesson.blocks.find(b => 
      b.type === 'practice' && b.order === 8
    );

    if (!practiceBlock) {
      issues.push('No practice block found at order 8');
      return {
        section: 'C2: Practice block quality',
        score: 0,
        maxScore: 7,
        issues,
        suggestions: ['Add practice block at order 8 with 3-5 questions'],
      };
    }

    const questions = (practiceBlock.content as any).questions || [];

    // Should have 3-5 questions
    if (questions.length < 3) {
      issues.push(`Practice has too few questions (${questions.length}, expected 3-5)`);
      score -= 2;
    } else if (questions.length > 5) {
      issues.push(`Practice has too many questions (${questions.length}, expected 3-5)`);
      score -= 1;
    }

    // Check for variety in question types
    const answerTypes = new Set(questions.map((q: any) => q.answerType));
    if (answerTypes.size === 1) {
      issues.push('Practice questions lack variety (all same answer type)');
      score -= 1;
    }

    if (issues.length === 0) {
      suggestions.push('Practice block has good variety and appropriate number of questions');
    } else {
      suggestions.push('Practice block should have 3-5 varied questions with mix of answer types');
    }

    return {
      section: 'C2: Practice block quality',
      score: Math.max(0, score),
      maxScore: 7,
      issues,
      suggestions,
    };
  }

  private scoreC3_IntegrativeBlock(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 6;

    const integrativeBlock = lesson.blocks.find(b => 
      b.type === 'practice' && (b.content as any).mode === 'integrative'
    );

    if (!integrativeBlock) {
      issues.push('No integrative block found');
      return {
        section: 'C3: Integrative block',
        score: 0,
        maxScore: 6,
        issues,
        suggestions: ['Add integrative block at order 9.5 with 2 questions'],
      };
    }

    // Check order
    if (integrativeBlock.order !== 9.5) {
      issues.push(`Integrative block at order ${integrativeBlock.order} (must be 9.5)`);
      score -= 2;
    }

    const questions = (integrativeBlock.content as any).questions || [];

    // Should have exactly 2 questions
    if (questions.length !== 2) {
      issues.push(`Integrative should have 2 questions (found ${questions.length})`);
      score -= 2;
    }

    // Check cognitive levels: 1 connection, 1 synthesis
    if (questions.length === 2) {
      const levels = questions.map((q: any) => q.cognitiveLevel);
      if (!levels.includes('connection')) {
        issues.push('Integrative Q1 should be connection level');
        score -= 1;
      }
      if (!levels.includes('synthesis')) {
        issues.push('Integrative Q2 should be synthesis level');
        score -= 1;
      }
    }

    if (issues.length === 0) {
      suggestions.push('Integrative block correctly structured at 9.5 with connection + synthesis');
    } else {
      suggestions.push('Integrative block must be at order 9.5 with 2 questions (connection + synthesis)');
    }

    return {
      section: 'C3: Integrative block',
      score: Math.max(0, score),
      maxScore: 6,
      issues,
      suggestions,
    };
  }

  private scoreC4_SpacedReviewQuality(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 4;

    const spacedReviewBlock = lesson.blocks.find(b => b.type === 'spaced-review');

    if (!spacedReviewBlock) {
      issues.push('No spaced review block found');
      return {
        section: 'C4: Spaced review quality',
        score: 0,
        maxScore: 4,
        issues,
        suggestions: ['Add spaced review block at order 10 with 4 questions'],
      };
    }

    // Check order
    if (spacedReviewBlock.order !== 10) {
      issues.push(`Spaced review at order ${spacedReviewBlock.order} (must be 10)`);
      score -= 1;
    }

    // Check if last
    const lastBlock = lesson.blocks[lesson.blocks.length - 1];
    if (lastBlock.id !== spacedReviewBlock.id) {
      issues.push('Spaced review must be the last block');
      score -= 1;
    }

    const questions = (spacedReviewBlock.content as any).questions || [];

    // Should have exactly 4 questions
    if (questions.length !== 4) {
      issues.push(`Spaced review should have 4 questions (found ${questions.length})`);
      score -= 1;
    }

    // Check for notes with provenance
    const notes = (spacedReviewBlock.content as any).notes || '';
    if (!notes || notes.length < 20) {
      issues.push('Spaced review missing provenance notes');
      score -= 1;
    }

    if (issues.length === 0) {
      suggestions.push('Spaced review correctly positioned with 4 questions and provenance notes');
    } else {
      suggestions.push('Spaced review must be at order 10 (last) with exactly 4 questions and provenance notes');
    }

    return {
      section: 'C4: Spaced review quality',
      score: Math.max(0, score),
      maxScore: 4,
      issues,
      suggestions,
    };
  }

  /**
   * D) Marking Robustness (20 points)
   */
  private scoreMarking(lesson: Lesson): SectionScore {
    const details: RubricDetail[] = [];
    let totalScore = 0;

    // D1: expectedAnswer policy (8)
    const d1 = this.scoreD1_ExpectedAnswerPolicy(lesson);
    details.push(d1);
    totalScore += d1.score;

    // D2: Numeric formatting (6)
    const d2 = this.scoreD2_NumericFormatting(lesson);
    details.push(d2);
    totalScore += d2.score;

    // D3: Answer coverage (6)
    const d3 = this.scoreD3_AnswerCoverage(lesson);
    details.push(d3);
    totalScore += d3.score;

    return {
      score: totalScore,
      maxScore: 20,
      details,
      autoCap: d2.autoCap, // D2 can trigger auto-cap
    };
  }

  private scoreD1_ExpectedAnswerPolicy(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 8;

    // Get all questions from practice blocks
    const practiceBlocks = lesson.blocks.filter(b => b.type === 'practice');
    let totalQuestions = 0;
    let arrayAnswers = 0;

    for (const block of practiceBlocks) {
      const questions = (block.content as any).questions || [];
      for (const q of questions) {
        totalQuestions++;
        if (Array.isArray(q.expectedAnswer)) {
          arrayAnswers++;
          // Check for short-text having 2-6 variants
          if (q.answerType === 'short-text' && (q.expectedAnswer.length < 2 || q.expectedAnswer.length > 6)) {
            issues.push(`Question ${q.id} short-text should have 2-6 answer variants (has ${q.expectedAnswer.length})`);
            score -= 0.5;
          }
        } else {
          issues.push(`Question ${q.id} expectedAnswer is not an array`);
          score -= 1;
        }
      }
    }

    if (totalQuestions === 0) {
      issues.push('No questions found to evaluate');
      score = 0;
    }

    if (issues.length === 0) {
      suggestions.push('All expectedAnswers are arrays with appropriate variants');
    } else {
      suggestions.push('All expectedAnswers must be arrays; short-text should have 2-6 variants');
    }

    return {
      section: 'D1: expectedAnswer policy',
      score: Math.max(0, score),
      maxScore: 8,
      issues,
      suggestions,
    };
  }

  private scoreD2_NumericFormatting(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 6;
    let hasUnitContamination = false;

    // Get all questions from practice blocks
    const practiceBlocks = lesson.blocks.filter(b => b.type === 'practice');

    for (const block of practiceBlocks) {
      const questions = (block.content as any).questions || [];
      for (const q of questions) {
        if (q.answerType === 'numeric' && Array.isArray(q.expectedAnswer)) {
          for (const answer of q.expectedAnswer) {
            const answerStr = String(answer);
            // Check for units/symbols
            if (/[%°£$€VΩAmm²³]|ohm|volt|amp|watt|meter|metre/i.test(answerStr)) {
              issues.push(`Question ${q.id} numeric answer contains units: "${answer}"`);
              score -= 2;
              hasUnitContamination = true;
            }
          }
        }
      }
    }

    if (issues.length === 0) {
      suggestions.push('All numeric answers are unit-free (correct)');
    } else {
      suggestions.push('Remove all units from numeric expectedAnswers (%, V, mm², etc.)');
    }

    const result: RubricDetail = {
      section: 'D2: Numeric formatting',
      score: Math.max(0, score),
      maxScore: 6,
      issues,
      suggestions,
    };

    // Auto-cap trigger
    if (hasUnitContamination) {
      (result as any).autoCap = {
        triggered: true,
        reason: 'Numeric answers contain units/symbols',
        cappedAt: 90,
      };
    }

    return result;
  }

  private scoreD3_AnswerCoverage(lesson: Lesson): RubricDetail {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 6;

    // Get all explanation content
    const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
    const allExplanationText = explanationBlocks
      .map(b => ((b.content as any).content || '').toLowerCase())
      .join(' ');

    // Get all questions (except spaced review)
    const practiceBlocks = lesson.blocks.filter(b => 
      b.type === 'practice' && b.order < 10
    );

    let checkedAnswers = 0;
    let missingAnswers = 0;

    for (const block of practiceBlocks) {
      const questions = (block.content as any).questions || [];
      for (const q of questions) {
        if (Array.isArray(q.expectedAnswer) && q.answerType === 'short-text') {
          for (const answer of q.expectedAnswer) {
            checkedAnswers++;
            const answerLower = String(answer).toLowerCase();
            
            // Check if answer words appear in explanation
            const answerWords = answerLower
              .replace(/[^a-z\s]/g, ' ')
              .split(/\s+/)
              .filter(w => w.length > 3);

            const covered = answerWords.some(word => allExplanationText.includes(word));

            if (!covered && answerWords.length > 0) {
              missingAnswers++;
              issues.push(`Answer "${answer}" for ${q.id} may not be covered in explanations`);
              score -= 0.5;
            }
          }
        }
      }
    }

    if (checkedAnswers === 0) {
      suggestions.push('No short-text answers to evaluate');
    } else if (issues.length === 0) {
      suggestions.push('All expected answers appear to be covered in explanations');
    } else {
      suggestions.push('Ensure all expectedAnswers are taught verbatim or paraphrased in explanations');
    }

    return {
      section: 'D3: Answer coverage',
      score: Math.max(0, score),
      maxScore: 6,
      issues,
      suggestions,
    };
  }

  /**
   * E) Visual/Diagram Alignment (5 points)
   */
  private scoreVisual(lesson: Lesson): SectionScore {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 5;

    const diagramBlock = lesson.blocks.find(b => b.type === 'diagram');

    if (!diagramBlock) {
      // No diagram is acceptable
      return {
        score: 3,
        maxScore: 5,
        details: [{
          section: 'E: Visual/Diagram alignment',
          score: 3,
          maxScore: 5,
          issues: ['No diagram block (acceptable if not needed)'],
          suggestions: ['Consider adding diagram for visual concepts'],
        }],
      };
    }

    const content = diagramBlock.content as any;

    // Check elementIds
    if (!content.elementIds || content.elementIds.length === 0) {
      issues.push('Diagram has empty elementIds array');
      score -= 2;
    } else if (content.elementIds.length < 3) {
      issues.push('Diagram has too few elementIds (need 3-5)');
      score -= 1;
    }

    // Check placeholder text
    if (!content.placeholderText || content.placeholderText.length < 50) {
      issues.push('Diagram placeholder text too generic or short');
      score -= 1;
    }

    // Check if diagram type is set
    if (!content.diagramType || content.diagramType === 'concept') {
      issues.push('Diagram type is generic (consider more specific type)');
      score -= 0.5;
    }

    if (issues.length === 0) {
      suggestions.push('Diagram well-integrated with meaningful elementIds and description');
    } else {
      suggestions.push('Add 3-5 elementIds and detailed placeholder description matching vocabulary terms');
    }

    return {
      score: Math.max(0, score),
      maxScore: 5,
      details: [{
        section: 'E: Visual/Diagram alignment',
        score: Math.max(0, score),
        maxScore: 5,
        issues,
        suggestions,
      }],
    };
  }

  /**
   * F) Safety, Accuracy, Professionalism (5 points)
   */
  private scoreSafety(lesson: Lesson): SectionScore {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 5;

    // Get all content text
    const allText = lesson.blocks
      .map(b => {
        if (b.type === 'explanation') {
          return (b.content as any).content || '';
        }
        return '';
      })
      .join(' ');

    // Check for unsafe language
    const unsafePatterns = [
      /you can skip/i,
      /not really necessary/i,
      /probably fine/i,
      /doesn't matter/i,
    ];

    for (const pattern of unsafePatterns) {
      if (pattern.test(allText)) {
        issues.push(`Unsafe/unprofessional language detected: ${pattern}`);
        score -= 1;
      }
    }

    // Check for invented claims
    if (/bs 7671|regulation|legal requirement/i.test(allText)) {
      // This is just a warning, not automatically wrong
      suggestions.push('Verify any regulatory claims are accurate and sourced');
    }

    // Check tone appropriateness (Level 2 vocational)
    if (/obviously|clearly|simply|just|merely/i.test(allText)) {
      issues.push('Avoid patronizing language (obviously, clearly, simply)');
      score -= 0.5;
    }

    if (issues.length === 0) {
      suggestions.push('Language is safe, accurate, and professionally appropriate');
    } else {
      suggestions.push('Ensure all content is safe, accurate, and professionally worded');
    }

    return {
      score: Math.max(0, score),
      maxScore: 5,
      details: [{
        section: 'F: Safety, Accuracy, Professionalism',
        score: Math.max(0, score),
        maxScore: 5,
        issues,
        suggestions,
      }],
    };
  }

  /**
   * Check for auto-cap conditions
   */
  private checkAutoCap(
    schemaResult: SectionScore,
    markingResult: SectionScore,
    safetyResult: SectionScore,
    currentTotal: number
  ): { triggered: boolean; reason: string; cappedAt: number } {
    // Check for D2 numeric unit contamination
    const d2Detail = markingResult.details.find(d => d.section.includes('D2'));
    if (d2Detail && (d2Detail as any).autoCap?.triggered) {
      return {
        triggered: true,
        reason: 'Numeric answers contain units/symbols (%, V, mm², etc.) - auto-cap at 90',
        cappedAt: 90,
      };
    }

    // Check for A2 block order violations (major)
    const a2Detail = schemaResult.details.find(d => d.section.includes('A2'));
    if (a2Detail && a2Detail.score <= 3) {
      return {
        triggered: true,
        reason: 'Severe block order contract violations - auto-cap at 80',
        cappedAt: 80,
      };
    }

    return { triggered: false, reason: '', cappedAt: 100 };
  }

  /**
   * Determine grade band from score
   */
  private determineGrade(score: number, autoCapped: boolean): string {
    if (autoCapped && score < 90) {
      return 'Usable (capped)';
    }

    if (score >= 98) {
      return 'Ship it';
    } else if (score >= 95) {
      return 'Strong';
    } else if (score >= 90) {
      return 'Usable';
    } else {
      return 'Needs rework';
    }
  }
}

