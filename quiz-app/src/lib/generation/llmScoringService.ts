/**
 * LLM-Based Lesson Scoring Service
 * 
 * Backward-compatible wrapper around Phase 10 scoring architecture.
 * Delegates to Phase10_Score for pedagogical assessment anchored to syllabus.
 * 
 * Architecture:
 * 1. Structural Validator (fast, deterministic) - Basic JSON structure checks
 * 2. Phase10_Score (pedagogical, syllabus-anchored) - Quality assessment by AI with RAG
 */

import { Lesson, LessonBlock } from './types';
import { Phase10_Score, Phase10Score } from './phases/Phase10_Score';
import { safeJsonParse, preprocessToValidJson } from './utils';
import { getScoringConfig } from './config';
import { getPhase10Model } from '@/lib/config/geminiConfig';

// Re-export interfaces for compatibility with existing code
export interface RubricScore {
  total: number;              // Out of 100
  breakdown: {
    schemaCompliance: number;           // A: 15 points (assume validated)
    pedagogy: number;                    // B: 30 points (maps from beginnerClarityStaging)
    questions: number;                   // C: 25 points
    marking: number;                     // D: 10 points (maps from markingRobustness)
    visual: number;                      // E: 5 points
    safety: number;                      // F: 0 points (deprecated, kept for backward compat)
  };
  details: RubricDetail[];
  grade: string;                 // "Ship it" | "Strong" | "Usable" | "Needs rework"
  overallAssessment?: string;    // NEW: 2-3 sentence macro observation of pedagogical patterns
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
  jsonPointers?: string[];      // JSON Pointer paths affected by this issue
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
    type: 'lesson' | 'quiz' | 'phase' | 'score',
    maxRetries: number,
    attemptHigherLimit?: boolean,
    tokenLimit?: number,
    modelOverride?: string  // NEW: Support model override for Phase 10
  ) => Promise<string>;

  constructor(generateWithRetryFn: any) {
    this.generateWithRetry = generateWithRetryFn;
  }

  /**
   * Score a lesson using Phase 10 pedagogical scoring
   */
  async scoreLesson(lesson: Lesson, additionalInstructions?: string): Promise<RubricScore> {
    // Step 1: Fast structural validation
    const structuralValidation = this.validateStructure(lesson);
    
    if (!structuralValidation.valid) {
      // Return failing score with structural errors
      return this.createStructuralFailureScore(structuralValidation.errors);
    }

    // Step 2: Use Phase10_Score for pedagogical assessment
    try {
      const scorer = new Phase10_Score();
      const phase10Score = await scorer.scoreLesson(
        lesson,
        this.generateWithRetry,
        additionalInstructions
      );
      
      // Convert Phase10Score to RubricScore for backward compatibility
      return this.convertToRubricScore(phase10Score);
      
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
   * Convert Phase10Score to RubricScore for backward compatibility
   */
  private convertToRubricScore(phase10Score: Phase10Score): RubricScore {
    // Map Phase 10 breakdown to legacy breakdown
    const pedagogy = phase10Score.breakdown.beginnerClarity + 
                     (phase10Score.breakdown.teachingBeforeTesting * 30 / 25);  // Scale to 30 points max
    
    const questions = phase10Score.breakdown.questionQuality + 
                      (phase10Score.breakdown.alignmentToLO * 25 / 15);  // Scale to 25 points max
    
    const marking = phase10Score.breakdown.markingRobustness / 2;  // Scale from 20 to 10 points
    
    // Convert issues to RubricDetails
    const details: RubricDetail[] = phase10Score.issues.map((issue, idx) => ({
      section: `${issue.category}: ${issue.problem.substring(0, 50)}${issue.problem.length > 50 ? '...' : ''}`,
      score: 0,  // Not directly available in Phase 10
      maxScore: this.getCategoryMaxScore(issue.category),
      issues: [issue.problem],
      suggestions: issue.alignmentGap ? 
        [`Alignment gap: ${issue.alignmentGap}`, issue.whyItMatters] : 
        [issue.whyItMatters],
      jsonPointers: issue.jsonPointers,
    }));
    
    return {
      total: phase10Score.total,
      breakdown: {
        schemaCompliance: 15,  // Assume validated (structural check passed)
        pedagogy: Math.round(Math.min(30, pedagogy)),
        questions: Math.round(Math.min(25, questions)),
        marking: Math.round(Math.min(10, marking)),
        visual: 5,  // Assume validated
        safety: 0,  // Deprecated
      },
      details,
      grade: phase10Score.grade,
      overallAssessment: phase10Score.overallAssessment,
    };
  }
  
  /**
   * Get max score for a category
   */
  private getCategoryMaxScore(category: string): number {
    switch (category) {
      case 'beginnerClarity': return 30;
      case 'teachingBeforeTesting': return 25;
      case 'markingRobustness': return 20;
      case 'alignmentToLO': return 15;
      case 'questionQuality': return 10;
      default: return 10;
    }
  }

  /**
   * Build system prompt for LLM scoring
   */
  private buildScoringSystemPrompt(): string {
    return `#You are an expert in 2365 city and guilds electrical who will suggest improvements to a lesson to raise the score to at least 96/100.

GOAL
1) Score the lesson's CONTENT QUALITY and MARKING QUALITY on a 100-point rubric.
2) Return  10 concrete examples where the pedagogy/marking needs improvement.  
   Each example must include: where it occurs, a short excerpt, why it's a problem, and a much improved version.
3) Never forget your objective is to suggest improvements that will raise the score to at least 96/100.


WHAT COUNTS AS "PEDAGOGY IMPROVEMENT" (FOCUS)
- Clarity: simpler wording, define jargon, remove ambiguity, better sequencing in the explanation text.
- Scaffolding: add steps/cues inside existing text so difficulty ramps smoothly.
- Teaching-before-testing: add the missing explanation sentence(s) before a question assesses it.
- Misconceptions: add a brief "common mistake" note where it prevents predictable errors.
- Question quality: tighten stems, remove absolutes, improve cognitive fit.
- Marking robustness: expectedAnswer becomes more gradeable without changing answerType.
- Questions from spaced review should be from the same module as the lesson but from preceeding lessons!  So if the lesson is city and guilds 2365 unit / module 203 then the spaced review questions should be from unit / module 203 (preceding lessons) NOT 202 / 210 etc. 
- Keep the spaced review questions from the same module!

SCORING RUBRIC (100)
A) schemaCompliance (15): Assume validated; give full points unless content is catastrophically unusable.
B) beginnerClarityStaging (30): definitions, plain language, examples, misconceptions, readability
C) alignment (15): worked/guided/independent alignment when present
D) questions (25): teaching-before-testing, wording, cognitive fit, integrative quality
E) markingRobustness (10): expectedAnswer gradeability and match to answerType
F) visual (5): Assume validated; deduct only if CONTENT references missing/contradictory diagrams

ISSUES / EXAMPLES REQUIREMENTS (CRITICAL)
- You MUST output EXACTLY 10 issues (no more, no fewer).
- If fewer than 10 major problems exist, include lower-impact "polish" items (still real, still concrete).
- Each issue must be specific and evidenced:
  - Provide a JSON Pointer to the exact field
  - Provide a short excerpt (max ~200 chars)
  - Explain the pedagogical/marking consequence
  - Provide at least one safe patch (unless truly requires regeneration)

  #Pedagogical reminder

  - Staging / order must be logical: Keep a strict learning flow: Outcomes → Vocab → Diagram (if used) → Explanations → Checks/Practice → Worked example/Guided practice → Independent practice → Integrative → Spaced review. Never place questions before the explanation that contains their answers.

- Spaced review must stay inside the same module/unit: Spaced-review questions must come from the same City & Guilds unit/module as the lesson, but from preceding lessons in that unit.
Example: If the lesson is 2365 Unit 203, spaced review must be Unit 203 content only (earlier 203 lessons), not Unit 202/210/etc.

- Every question’s answer must exist in the lesson content: For every practice/check question, ensure the exact facts/definitions needed to answer are explicitly stated in an earlier explanation, vocab, worked example, or notes block (no “implied” answers).

- Synthesis/connection marking must be strict enough: For connection/synthesis questions, don’t use loose keyword-soup expected answers. Use either:

2–6 full acceptable answer variants, or

a required key-point checklist (e.g., must include 3–5 specified points).

- Technical definitions must be exam-safe and not over-claim: Avoid wording that can be nitpicked (e.g., emergency circuits “always work in a fire”). Use qualified, syllabus-safe phrasing (e.g., “arrangements to maintain operation during loss of normal supply”) and avoid absolute claims unless the spec says so
- ALWYAS check that The improvements will raise the score to at least 96/100!
PATCH OPS (ONLY THESE)
- "replaceSubstring" (preferred for long strings): {op,path,find,value}
- "replace" (sparingly): {op,path,from,value}
- "append" / "prepend": {op,path,value}

OUTPUT FORMAT (JSON ONLY; NO MARKDOWN)
Return exactly:

{
  "total": 0,
  "breakdown": {
    "schemaCompliance": 0,
    "beginnerClarityStaging": 0,
    "alignment": 0,
    "questions": 0,
    "markingRobustness": 0,
    "visual": 0
  },
  "overallAssessment": "2-3 sentences describing the overall pedagogical pattern. Examples: 'Main weakness is teaching-before-testing violations across multiple blocks.' or 'Good scaffolding but marking robustness is weak throughout.' or 'Explanations are clear but questions lack cognitive alignment.'",
  "issues": [
    {
      "id": "ISSUE-1",
      "impact": 3,
      "category": "beginnerClarityStaging|alignment|questions|markingRobustness",
      "jsonPointers": ["/blocks/0/...", "/blocks/1/..."],
      "excerpt": "short excerpt from the current field value",
      "problem": "What is wrong pedagogically/marking-wise",
      "whyItMatters": "Concrete learning or grading consequence",
      "fixability": "phase10|requiresRegeneration",
      "patches": [
        { "op": "replaceSubstring|replace|append|prepend", "path": "/blocks/x/...", "find": "...", "from": "...", "value": "..." }
      ]
    }
  ],
  "grade": "Ship it|Strong|Usable|Needs rework"
}

VALIDATION RULES

- issues array length MUST be exactly 10.
- ALWAYS check that The improvements will raise the score to at least 96/100!  If not do again!

- overallAssessment must be 2-3 sentences maximum, identifying the PRIMARY pedagogical pattern or cross-cutting theme.
- No extra keys. No commentary.`;
  }

  /**
   * Build user prompt with lesson to score
   */
  private buildScoringUserPrompt(lesson: Lesson, additionalInstructions?: string): string {
    // Create a clean JSON representation of the lesson
    const lessonJson = JSON.stringify(lesson, null, 2);
    
    let prompt = '';
    
    // If additional instructions provided, add them as user context
    if (additionalInstructions && additionalInstructions.trim()) {
      prompt += `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions.trim()}\n\n`;
      prompt += `ASSISTANT ACKNOWLEDGMENT: I will ensure the lesson marking takes this additional context into consideration when scoring and suggesting improvements.\n\n`;
    }
    
    prompt += `Score this UK electrical installation lesson using the rubric.

LESSON TO SCORE:
${lessonJson}

CRITICAL REMINDERS:
1. Return EXACTLY 10 issues (no more, no fewer)
2. Each issue must include: excerpt, problem, whyItMatters, fixability, patches
3. Ensure total score equals sum of breakdown scores
4. Focus on CONTENT QUALITY only - structure already validated

Return ONLY the JSON scoring object. No markdown, no additional text.`;
    
    return prompt;
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

    // Enforce exactly 10 issues requirement for new format
    if (isNewFormat && (!data.issues || data.issues.length !== 10)) {
      throw new Error(`LLM must return exactly 10 issues, got ${data.issues?.length || 0}`);
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
          jsonPointers: issue.jsonPointers || [], // Extract JSON pointers from issue
        };
      });
    } else {
      // LEGACY FORMAT: Use details as-is
      details = data.details;
    }

    // Map new breakdown field names to legacy names for backward compatibility
    // New format has: schemaCompliance, beginnerClarityStaging, alignment, questions, markingRobustness, visual
    // Legacy format needs: schemaCompliance, pedagogy, questions, marking, visual, safety
    // Strategy: Map beginnerClarityStaging+alignment → pedagogy to preserve backward compat
    const breakdown = {
      schemaCompliance: data.breakdown.schemaCompliance || 0,
      pedagogy: (data.breakdown.beginnerClarityStaging || 0) + (data.breakdown.alignment || 0) || data.breakdown.pedagogy || 0,
      questions: data.breakdown.questions || 0,
      marking: data.breakdown.markingRobustness || data.breakdown.marking || 0,
      visual: data.breakdown.visual || 0,
      safety: 0,  // Always 0 for backward compatibility (deprecated)
    };

    // Return as RubricScore (backward compatible)
    return {
      total: data.total,
      breakdown: breakdown,
      details: details,
      grade: data.grade,
      overallAssessment: data.overallAssessment,
      autoCap: data.autoCap,
    };
  }
}
