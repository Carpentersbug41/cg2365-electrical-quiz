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
import { getScoringConfig } from './config';

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
    const scoringConfig = getScoringConfig();
    const response = await this.generateWithRetry(
      systemPrompt,
      userPrompt,
      'score',  // Changed from 'lesson' to 'score' for proper truncation detection
      2,
      false,
      scoringConfig.maxTokens
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

TASK
1) Score the lesson JSON on a 100-point rubric.
2) Identify the TOP 10 highest-impact learning quality issues.
3) For each issue, provide precise field-level patches.
4) Respect Phase 10 constraints (no add/remove/reorder blocks).

PHASE 10 CONSTRAINT (CRITICAL)
- Allowed operations:
  * SUBSTRING_REPLACE: Change text within a string field (use for small in-string edits)
  * PREPEND: Add text to beginning of field
  * APPEND: Add text to end of field
  * FULL_REPLACE: Replace entire field value (use sparingly for long fields)
- Not Allowed: add blocks, remove blocks, reorder blocks, change block count
- If an issue requires structural changes, mark fixability as "requiresRegeneration"

SUGGESTION FORMAT (CRITICAL):
For string field edits within long content (e.g., explanation blocks), use SUBSTRING_REPLACE format:
"SUBSTRING_REPLACE in blocks[3].content.content: find 'old text' replace with 'new text'"

For adding content:
"PREPEND to blocks[3].content.content: 'text to add at start'"
"APPEND to blocks[3].content.content: 'text to add at end'"

For complete field replacement (only when necessary):
"FULL_REPLACE blocks[4].content.questions[2].expectedAnswer with: ['variant1', 'variant2']"

⚠️ NEVER write: "Change blocks[3].content.content from 'X' to 'Y'" (ambiguous - leads to content destruction!)
✓ ALWAYS write: "SUBSTRING_REPLACE in blocks[3].content.content: find 'X' replace with 'Y'"

SCORING RUBRIC (100 points total):

A) Schema & Contract Compliance (15 points)
   - Valid JSON, required fields present, no duplicate IDs
   - Relative ordering correct: checks after explanations; worked before guided; guided before independent; integrative near end; spaced review last
   - NOTE: Schema issues like IDs and field types are pre-normalized before scoring, so only flag if critically broken

B) Beginner Clarity & Staging (30 points)
   B1: Beginner Orientation (10 points)
       - Has "In this lesson" preview section explaining what students will learn
       - Has "Key Points" summary section with bullet list of main takeaways
       - Has "Coming Up Next" transition connecting to next lesson
   B2: Teaching-Before-Testing (10 points)
       - Content appears in explanation before questions assess it
       - No questions about terms/concepts not yet explicitly taught
       - Understanding checks placed immediately after relevant explanations
   B3: Scaffolding (10 points)
       - Difficulty ramps smoothly from simple to complex
       - Concepts build logically on each other
       - No sudden jumps in complexity

C) Worked/Guided/Independent Alignment (15 points)
   - Guided practice mirrors worked example steps exactly (same decision points, same process flow)
   - Independent practice matches what was modelled in worked/guided sections (no new task types suddenly introduced)
   - If no worked example exists, score full points

D) Questions & Cognitive Structure (25 points)
   D1: Scope + Technical Accuracy (10 points)
       - Questions match lesson scope and learning outcomes
       - Technically correct information throughout
       - Appropriate difficulty level for target audience
   D2: Question Quality (10 points)
       - Clear, unambiguous wording
       - Avoids unjustified absolutes ("always", "never" - prefer "typically", "often", "usually")
       - Uses appropriate question verbs for task type
   D3: Integrative Block Structure (5 points)
       - If integrative block exists, it contains exactly 2 questions
       - Question 1: connection question (ties together 2-3 major concepts)
       - Question 2: synthesis question (integrates all lesson concepts in 3-4 sentences)

E) Marking Robustness (10 points)
   - expectedAnswer is gradeable and matches answerType
   - For numeric answers: expectedAnswer contains numbers only (no units - units go in hint)
   - For short-text: provides 2-6 acceptable variations

F) Visual/Diagram Alignment (5 points)
   - Diagrams referenced appropriately in explanations and questions
   - No missing or broken diagram references

PRIORITIZATION RULES (CRITICAL)
- Maximum 10 issues total
- Focus on learning quality issues (sections B, C, D) - these drive student success
- Schema/mechanical issues (A, E) are pre-normalized - only flag if critically broken
- Impact ranking: Beginner Clarity (B) > Alignment (C) > Questions (D) > Marking (E) > Schema (A)
- If there are many similar mechanical issues (e.g., 20 IDs missing prefix), group them into ONE issue with note: "Deterministic fix - recommend code pre-pass"

OUTPUT FORMAT (JSON ONLY, no markdown)

Return JSON in this EXACT format:

{
  "total": 91,
  "breakdown": {
    "schemaCompliance": 14,
    "beginnerClarityStaging": 24,
    "alignment": 12,
    "questions": 22,
    "markingRobustness": 9,
    "visual": 5
  },
  "issues": [
    {
      "id": "ISSUE-1",
      "impact": 3,
      "category": "beginnerClarityStaging",
      "problem": "Explanation block at blocks[3] missing required 'Key Points' summary section with bullet list. Students need explicit takeaways for retention.",
      "fixability": "phase10",
      "patches": [
        {
          "op": "append",
          "path": "/blocks/3/content/content",
          "value": "\\n\\n### Key Points\\n- [Point one extracted from explanation]\\n- [Point two extracted from explanation]\\n- [Point three extracted from explanation]"
        }
      ]
    },
    {
      "id": "ISSUE-2",
      "impact": 2,
      "category": "beginnerClarityStaging",
      "problem": "Check block at blocks[4] asks about 'residual current' but explanation at blocks[3] never explicitly defines this term. Violates teaching-before-testing.",
      "fixability": "phase10",
      "patches": [
        {
          "op": "prepend",
          "path": "/blocks/3/content/content",
          "value": "### In this lesson\\n\\nYou will learn about residual current and how it affects circuit protection.\\n\\n"
        }
      ]
    },
    {
      "id": "ISSUE-3",
      "impact": 2,
      "category": "alignment",
      "problem": "Guided practice at blocks[7] uses different steps than worked example at blocks[6]. Should mirror exactly for effective scaffolding.",
      "fixability": "requiresRegeneration",
      "patches": []
    }
  ],
  "grade": "Strong"
}

PATCH OPERATION TYPES:

"replaceSubstring" - Replace text WITHIN a string field (PREFERRED for explanation edits)
  Required fields: "op", "path", "find", "value"
  Use when: Fixing terminology, correcting phrases, updating specific text
  Example: {"op": "replaceSubstring", "path": "/blocks/3/content/content", "find": "looping and linear wiring", "value": "ring final and radial topologies"}

"replace" - Replace ENTIRE field value (use sparingly for long fields)
  Required fields: "op", "path", "from", "value"
  Use when: Changing short fields entirely (IDs, titles, expectedAnswer arrays)
  Example: {"op": "replace", "path": "/blocks/4/content/title", "from": "Old Title", "value": "New Title"}

"append" - Add text to END of existing string field
  Required fields: "op", "path", "value"
  Example: {"op": "append", "path": "/blocks/3/content/content", "value": "\\n\\n### Key Points\\n- Point one"}

"prepend" - Add text to BEGINNING of existing string field
  Required fields: "op", "path", "value"
  Example: {"op": "prepend", "path": "/blocks/3/content/content", "value": "### In this lesson\\n\\nOverview text\\n\\n"}

VALIDATION RULES:
- Total MUST equal sum of breakdown scores (CRITICAL - previous example had math error!)
- All paths must use JSON Pointer format (/blocks/3/content/title)
- Each issue must have at least one patch (unless fixability is "requiresRegeneration")
- Maximum 10 issues total
- Focus issues on learning quality (B, C, D sections), not mechanical schema fixes (A, E sections)

GRADE SCALE:
- 95-100: "Ship it" (excellent, production-ready)
- 90-94: "Strong" (good quality, minor improvements needed)
- 85-89: "Usable" (acceptable quality, some issues to address)
- Below 85: "Needs rework" (significant problems require attention)`;
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

CRITICAL REMINDERS:
1. Focus on TOP 10 learning quality issues (sections B, C, D) - schema issues (A, E) are pre-normalized
2. Use structured patch format with JSON Pointer paths (e.g., "/blocks/3/content/content")
3. Ensure total score equals sum of breakdown scores (avoid math errors!)
4. Each patch must specify "op" (replace/append/prepend), "path", and "value"
5. Mark structural issues as "requiresRegeneration" with empty patches array

Return ONLY the JSON scoring object following the exact format specified above. No markdown, no additional text.`;
  }

  /**
   * Parse LLM scoring response (handles both new and legacy formats)
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
    if (typeof data.grade !== 'string') {
      throw new Error('LLM response missing required field: grade');
    }

    // Check if this is new format (issues array) or legacy format (details array)
    const isNewFormat = Array.isArray(data.issues);
    const isLegacyFormat = Array.isArray(data.details);

    if (!isNewFormat && !isLegacyFormat) {
      throw new Error('LLM response missing required field: issues or details array');
    }

    // Convert new format to legacy RubricScore format for backward compatibility
    let details: RubricDetail[];

    if (isNewFormat) {
      // NEW FORMAT: Convert issues with patches to details with suggestions
      details = data.issues.map((issue: any) => {
        // Convert patches to suggestion strings for Phase 10
        const suggestions = (issue.patches || []).map((patch: any) => {
          const jsonPath = patch.path || '';
          // Convert JSON Pointer (/blocks/3/content/title) to dot notation (blocks[3].content.title)
          const dotPath = jsonPath
            .replace(/^\//, '')
            .replace(/\//g, '.')
            .replace(/\.(\d+)\./g, '[$1].')
            .replace(/\.(\d+)$/, '[$1]');

          if (patch.op === 'replace') {
            const from = patch.from || '[current value]';
            const value = patch.value || '';
            return `Change ${dotPath} from '${from}' to '${value}'`;
          } else if (patch.op === 'append') {
            return `Append to ${dotPath}: '${patch.value || ''}'`;
          } else if (patch.op === 'prepend') {
            return `Prepend to ${dotPath}: '${patch.value || ''}'`;
          }
          return `Modify ${dotPath}`;
        });

        // If no patches (requiresRegeneration), add a note
        if (issue.fixability === 'requiresRegeneration') {
          suggestions.push('Cannot be fixed by Phase 10 - requires regeneration');
        }

        return {
          section: `${issue.category || 'General'}: ${(issue.problem || '').substring(0, 60)}${issue.problem && issue.problem.length > 60 ? '...' : ''}`,
          score: 0, // Not directly provided in new format
          maxScore: issue.impact || 1,
          issues: [issue.problem || 'Issue detected'],
          suggestions: suggestions.length > 0 ? suggestions : ['Review and fix manually'],
        };
      });
    } else {
      // LEGACY FORMAT: Use details as-is
      details = data.details;
    }

    // Map new breakdown field names to legacy names if needed
    const breakdown = {
      schemaCompliance: data.breakdown.schemaCompliance || 0,
      pedagogy: data.breakdown.beginnerClarityStaging || data.breakdown.pedagogy || 0,
      questions: data.breakdown.questions || 0,
      marking: data.breakdown.markingRobustness || data.breakdown.marking || 0,
      visual: data.breakdown.visual || 0,
      safety: data.breakdown.safety || 0,
    };

    // Return as RubricScore (backward compatible)
    return {
      total: data.total,
      breakdown: breakdown,
      details: details,
      grade: data.grade,
      autoCap: data.autoCap,
    };
  }
}
