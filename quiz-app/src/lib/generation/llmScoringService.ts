/**
 * LLM-Based Lesson Scoring Service
 * 
 * Replaces hardcoded rubric with intelligent LLM scoring.
 * Scores lessons like a human instructor would, judging quality holistically.
 * 
 * Architecture:
 * 1. Structural Validator (fast, deterministic) - Basic JSON structure checks
 * 2. LLM Scorer (intelligent, holistic) - Quality assessment by AI
 */

import { Lesson, LessonBlock } from './types';
import { safeJsonParse, preprocessToValidJson } from './utils';

// Re-export interfaces for compatibility with existing code
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

interface StructuralValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * LLM-Based Scoring Service
 * Uses AI to evaluate lesson quality like a human instructor would
 */
export class LLMScoringService {
  private generateWithRetry: (
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz' | 'phase',
    maxRetries: number,
    attemptHigherLimit?: boolean,
    tokenLimit?: number
  ) => Promise<string>;

  constructor(generateWithRetryFn: any) {
    this.generateWithRetry = generateWithRetryFn;
  }

  /**
   * Score a lesson using LLM-based evaluation
   */
  async scoreLesson(lesson: Lesson): Promise<RubricScore> {
    // Step 1: Fast structural validation
    const structuralValidation = this.validateStructure(lesson);
    
    if (!structuralValidation.valid) {
      // Return failing score with structural errors
      return this.createStructuralFailureScore(structuralValidation.errors);
    }

    // Step 2: LLM scoring (quality assessment)
    try {
      const llmScore = await this.scoreLessonWithLLM(lesson);
      return llmScore;
    } catch (error: any) {
      console.error('[LLMScoringService] Error scoring lesson:', error);
      
      // Fallback: Return a neutral score with error details
      return {
        total: 0,
        breakdown: {
          schemaCompliance: 0,
          pedagogy: 0,
          questions: 0,
          marking: 0,
          visual: 0,
          safety: 0,
        },
        details: [{
          section: 'Scoring Error',
          score: 0,
          maxScore: 100,
          issues: [`Failed to score lesson: ${error.message}`],
          suggestions: ['Try regenerating the lesson or contact support'],
        }],
        grade: 'Needs rework',
      };
    }
  }

  /**
   * Validate basic lesson structure (fast, deterministic)
   * Only checks for critical structural problems, not quality
   */
  private validateStructure(lesson: Lesson): StructuralValidationResult {
    const errors: string[] = [];

    // Check required top-level fields
    if (!lesson.id) errors.push('Missing required field: id');
    if (!lesson.title) errors.push('Missing required field: title');
    if (!lesson.description) errors.push('Missing required field: description');
    if (!lesson.blocks) errors.push('Missing required field: blocks');
    
    // Check blocks is an array
    if (!Array.isArray(lesson.blocks)) {
      errors.push('blocks must be an array');
      return { valid: false, errors }; // Can't continue validation
    }

    // Check blocks have required fields and valid types
    const validBlockTypes = [
      'outcomes',          // Learning objectives block
      'vocab',             // Vocabulary/glossary block
      'diagram',           // Image/video/diagram block
      'explanation',       // Teaching content block
      'worked-example',    // Step-by-step example block
      'guided-practice',   // Scaffolded practice block
      'practice',          // Quiz questions block
      'spaced-review',     // Review questions block
      'microbreak'         // Break/rest block
    ];
    for (let i = 0; i < lesson.blocks.length; i++) {
      const block = lesson.blocks[i];
      
      if (!block.id) errors.push(`Block ${i} missing id`);
      if (!block.type) errors.push(`Block ${i} missing type`);
      if (block.type && !validBlockTypes.includes(block.type)) {
        errors.push(`Block ${i} has invalid type: ${block.type}`);
      }
      if (!block.content) errors.push(`Block ${i} missing content`);
    }

    // Check metadata exists
    if (!lesson.metadata) errors.push('Missing metadata object');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a failing score for structural validation errors
   */
  private createStructuralFailureScore(errors: string[]): RubricScore {
    return {
      total: 0,
      breakdown: {
        schemaCompliance: 0,
        pedagogy: 0,
        questions: 0,
        marking: 0,
        visual: 0,
        safety: 0,
      },
      details: [{
        section: 'A1: Valid JSON and required fields',
        score: 0,
        maxScore: 20,
        issues: errors,
        suggestions: ['Fix structural errors before quality assessment'],
      }],
      grade: 'Needs rework',
      autoCap: {
        triggered: true,
        reason: 'Critical structural errors',
        cappedAt: 0,
      },
    };
  }

  /**
   * Score lesson using LLM
   */
  private async scoreLessonWithLLM(lesson: Lesson): Promise<RubricScore> {
    const systemPrompt = this.buildScoringSystemPrompt();
    const userPrompt = this.buildScoringUserPrompt(lesson);

    // Call LLM with scoring prompts
    const response = await this.generateWithRetry(
      systemPrompt,
      userPrompt,
      'lesson',
      2,
      false,
      4000 // Token limit for scoring
    );

    // Parse LLM response
    const parsed = this.parseScoringResponse(response);
    
    return parsed;
  }

  /**
   * Build system prompt for LLM scoring
   */
  private buildScoringSystemPrompt(): string {
    return `You are an expert educational content reviewer for electrical trade training.
Your job is to score lessons on a 100-point rubric and provide detailed, actionable feedback.

SCORING RUBRIC (100 points total):

A) Schema & Contract Compliance (20 points)
   A1: Valid JSON + required fields (6 points)
   A2: Block order contract (8 points)
      - explanation → understanding checks → worked example → practice → integrative → spaced review
   A3: IDs + naming patterns (6 points)
      - Question IDs MUST include lesson prefix: {lessonId}-C1-L1-A (checks), {lessonId}-INT-1 (integrative), {lessonId}-P1 (practice), {lessonId}-SR-1 (review)
      - No duplicate IDs
      - Block IDs match lesson ID

B) Pedagogy & Staging (25 points)
   B1: Teaching-before-testing (10 points)
      - Explanation comes before questions about that content
      - Understanding checks appear immediately after relevant explanation sections
   B2: Explanation quality + required outline (10 points)
      - Clear, well-structured explanations
      - Has "In this lesson" preview
      - Has "Key Points" summary  
      - Has "Coming Up Next" transition
   B3: Appropriate scaffolding (5 points)
      - Difficulty progresses logically
      - Concepts build on each other

C) Questions & Cognitive Structure (25 points)
   C1: Scope + accuracy (10 points)
      - Questions match lesson scope
      - Technically accurate
      - Appropriate difficulty level
   C2: Question quality + banned verbs (10 points)
      - Well-written, clear questions
      - No banned verbs in wrong contexts: "list", "describe", "explain" for calculation tasks
      - No absolute language: "always", "never", "all", "none" (unless technically accurate)
   C3: expectedAnswer quality (5 points)
      - Specific enough for grading
      - Appropriate format for question type
      - Not too vague or too rigid

D) Marking Robustness (20 points)
   D1: expectedAnswer tightness (10 points)
      - Multiple choice has single clear correct answer
      - Calculations have specific values with tolerances
      - Not open-ended where precision is needed
   D2: Answer format clarity (10 points)
      - Answer format matches question type
      - Units specified where needed
      - No ambiguity in what constitutes correct answer

E) Visual/Diagram Alignment (5 points)
   - Diagrams referenced appropriately
   - Visual aids support learning
   - No missing diagram references

F) Safety, Accuracy, Professionalism (5 points)
   - Technically accurate information
   - Appropriate safety emphasis for electrical work
   - Professional tone throughout

CRITICAL RULES FOR ISSUES & SUGGESTIONS:
1. Return ONLY valid JSON, no markdown code blocks
2. Total score MUST equal sum of breakdown scores
3. Focus on the TOP 10 most impactful issues (ignore minor problems)
4. For EACH issue, provide a SPECIFIC suggestion with the exact rewrite/change
5. NEVER group multiple array items into one issue - create SEPARATE issue/suggestion pairs for EACH item that needs fixing

SUGGESTION FORMAT - BE LASER FOCUSED:
❌ BAD: "Make expectedAnswer more specific"
✅ GOOD: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

❌ BAD: "Improve question wording"  
✅ GOOD: "Change blocks[7].content.questions[1].questionText from 'What happens?' to 'Calculate the total resistance when three 10Ω resistors are connected in series.'"

❌ BAD: "Fix ID pattern"
✅ GOOD: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A4-C1-L1-A'"

CRITICAL OPERATION VERBS - USE PRECISELY:

For CONTENT ADDITIONS (adding text to beginning/end of existing content):
✅ CORRECT: "Prepend to blocks[3].content.content: '### In this lesson\\n\\nYou will learn...\\n\\n'"
✅ CORRECT: "Append to blocks[5].content.content: '\\n\\n### Key Points\\n1. Point one\\n2. Point two'"
❌ WRONG: "Add 'In this lesson...' to the start of blocks[3].content.content" (ambiguous - add or replace?)

For VALUE REPLACEMENTS (changing specific fields):
✅ CORRECT: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
✅ CORRECT: "Change blocks[7].content.questions[2].expectedAnswer from 'yes' to '10A,10.0'"
❌ WRONG: "Fix the ID" (not specific enough)

For MULTIPLE ITEMS IN ARRAY - Create SEPARATE issue AND suggestion for EACH item:
CRITICAL: If a block has 4 invalid question IDs, you MUST create 4 separate issue/suggestion pairs (one for EACH invalid ID).

✅ CORRECT (separate issue/suggestion for EACH invalid ID):
  Issue 1: "Question ID 'blocks[4].content.questions[0].id' is 'C1-L1-A' but missing required lesson prefix"
  Suggestion 1: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
  
  Issue 2: "Question ID 'blocks[4].content.questions[1].id' is 'C1-L1-B' but missing required lesson prefix"
  Suggestion 2: "Change blocks[4].content.questions[1].id from 'C1-L1-B' to '203-3A9-C1-L1-B'"
  
  Issue 3: "Question ID 'blocks[4].content.questions[2].id' is 'C1-L1-C' but missing required lesson prefix"
  Suggestion 3: "Change blocks[4].content.questions[2].id from 'C1-L1-C' to '203-3A9-C1-L1-C'"
  
  Issue 4: "Question ID 'blocks[4].content.questions[3].id' is 'C1-L2' but missing required lesson prefix"
  Suggestion 4: "Change blocks[4].content.questions[3].id from 'C1-L2' to '203-3A9-C1-L2'"

❌ WRONG - Generic issue grouping multiple IDs:
  Issue: "Question IDs in block 4 are missing the lesson prefix '203-3A9-'"
  Suggestion: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
  (This only fixes the FIRST ID, leaving questions[1], [2], [3] broken!)

❌ WRONG - Generic suggestion without specific path:
  "Change ALL question IDs in blocks[4] to add prefix" (requires iteration, only first item will be fixed)

OPERATION VERB RULES:
- "Prepend to X:" = add to BEGINNING of existing string (keeps original content)
- "Append to X:" = add to END of existing string (keeps original content)
- "Change X from Y to Z:" = REPLACE value Y with value Z (overwrites completely)
- "Set X to Y:" = REPLACE/assign value (overwrites completely)
- NEVER use "Add" (ambiguous - could mean append or replace)

Each suggestion should be so specific that someone could implement it WITHOUT needing to make creative decisions.

PRIORITIZATION:
- Only report issues that significantly impact quality (score impact ≥ 0.5 points)
- Rank by impact: Schema/Safety > Pedagogy > Questions > Visual
- Maximum 10 issues total across ALL sections (laser focus on highest impact)

GRADE SCALE:
- 95-100: "Ship it" (excellent, production-ready)
- 90-94: "Strong" (good quality, minor improvements)
- 85-89: "Usable" (acceptable, some issues)
- Below 85: "Needs rework" (significant problems)

Return JSON in this EXACT format:
{
  "total": 92,
  "breakdown": {
    "schemaCompliance": 18,
    "pedagogy": 23,
    "questions": 22,
    "marking": 18,
    "visual": 5,
    "safety": 5
  },
  "details": [
    {
      "section": "A3: IDs + naming patterns",
      "score": 2,
      "maxScore": 6,
      "issues": [
        "Question ID 'blocks[4].content.questions[0].id' is 'C1-L1-A' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[1].id' is 'C1-L1-B' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[2].id' is 'C1-L1-C' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[3].id' is 'C1-L2' but missing required lesson prefix"
      ],
      "suggestions": [
        "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A4-C1-L1-A'",
        "Change blocks[4].content.questions[1].id from 'C1-L1-B' to '203-3A4-C1-L1-B'",
        "Change blocks[4].content.questions[2].id from 'C1-L1-C' to '203-3A4-C1-L1-C'",
        "Change blocks[4].content.questions[3].id from 'C1-L2' to '203-3A4-C1-L2'"
      ]
    },
    {
      "section": "C3: expectedAnswer quality",
      "score": 3,
      "maxScore": 5,
      "issues": [
        "Question 'blocks[6].content.questions[2].expectedAnswer' is 'approximately 20A' which is too vague for grading"
      ],
      "suggestions": [
        "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A' to provide specific tolerance"
      ]
    }
  ],
  "grade": "Strong"
}`;
  }

  /**
   * Build user prompt with lesson to score
   */
  private buildScoringUserPrompt(lesson: Lesson): string {
    // Create a clean JSON representation of the lesson
    const lessonJson = JSON.stringify(lesson, null, 2);
    
    return `Score this electrical trade lesson using the rubric.

LESSON TO SCORE:
${lessonJson}

CRITICAL: For each issue, provide a SPECIFIC suggestion with the EXACT change to make.
- Include JSON paths (e.g., "blocks[4].content.questions[0].id")
- Include old and new values (e.g., "Change from 'X' to 'Y'")
- Be so specific that someone can implement it without making creative decisions

Focus on the TOP 10 most impactful issues only (laser focus, not everything).

Return ONLY the JSON scoring object, no additional text.`;
  }

  /**
   * Parse LLM scoring response
   */
  private parseScoringResponse(response: string): RubricScore {
    // Clean the response
    let cleaned = response.trim();
    
    // Remove markdown code blocks if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    // Preprocess and parse
    const preprocessed = preprocessToValidJson(cleaned);
    const parsed = safeJsonParse(preprocessed);

    if (!parsed.success || !parsed.data) {
      throw new Error(`Failed to parse LLM scoring response: ${parsed.error || 'Unknown error'}`);
    }

    const data = parsed.data as any;

    // Validate required fields
    if (typeof data.total !== 'number') {
      throw new Error('LLM response missing required field: total');
    }
    if (!data.breakdown || typeof data.breakdown !== 'object') {
      throw new Error('LLM response missing required field: breakdown');
    }
    if (!Array.isArray(data.details)) {
      throw new Error('LLM response missing required field: details');
    }
    if (typeof data.grade !== 'string') {
      throw new Error('LLM response missing required field: grade');
    }

    // Return as RubricScore
    return {
      total: data.total,
      breakdown: data.breakdown,
      details: data.details,
      grade: data.grade,
      autoCap: data.autoCap,
    };
  }
}
