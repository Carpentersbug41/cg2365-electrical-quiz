/**
 * Phase 10 v2: Holistic Rewrite
 * 
 * Replaces patch-based refinement with holistic rewrite approach.
 * LLM outputs full improved lesson JSON in one shot while enforcing hard structural invariants.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore } from '../llmScoringService';
import { validateCandidate } from './Phase10_Validators';
import { preprocessToValidJson, safeJsonParse, validateLLMResponse, cleanCodeBlocks } from '../utils';

export interface RewriteInput {
  originalLesson: Lesson;
  rubricScore: RubricScore;
}

export interface RewriteOutput {
  candidateLesson: Lesson | null;
  validationFailures: string[];
  scoreComparison: {
    original: number;
    candidate: number;
    delta: number;
  } | null;
}

export class Phase10_Rewrite extends PhasePromptBuilder {
  // Store last prompts and response for debug bundle
  public lastPrompts: { system: string; user: string } = { system: '', user: '' };
  public lastRawResponse: string = '';
  
  private scorer: any; // LLMScoringService instance
  
  getPhaseName(): string {
    return 'Phase 10 v2: Holistic Rewrite';
  }
  
  /**
   * Main rewrite method
   * Takes original lesson and rubric score, returns improved candidate or null
   */
  async rewriteLesson(
    originalLesson: Lesson,
    rubricScore: RubricScore,
    generateFn: Function,
    scorer: any
  ): Promise<RewriteOutput> {
    this.scorer = scorer;
    
    console.log(`\n🔄 [Phase10v2] Starting holistic rewrite...`);
    console.log(`🔄 [Phase10v2] Original score: ${rubricScore.total}/100`);
    
    // Build prompts
    const input: RewriteInput = { originalLesson, rubricScore };
    const prompts = this.getPrompts(input);
    
    // Store for debug bundle
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    // Call LLM with generateWithRetry
    console.log(`🔄 [Phase10v2] Calling LLM for holistic rewrite...`);
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'phase', // type
        2,       // maxRetries
        false,   // attemptHigherLimit
        24000    // currentTokenLimit - increased for full lesson JSON
      );
      
      this.lastRawResponse = response;
      
      // Parse JSON response
      console.log(`🔄 [Phase10v2] Parsing LLM response (${response.length} chars)...`);
      const candidateLesson = this.parseLLMResponse(response);
      
      if (!candidateLesson) {
        return {
          candidateLesson: null,
          validationFailures: ['Failed to parse LLM response as valid JSON'],
          scoreComparison: null
        };
      }
      
      console.log(`🔄 [Phase10v2] Successfully parsed candidate lesson`);
      
      // Run hard validators
      console.log(`🔄 [Phase10v2] Running hard validators...`);
      const validation = validateCandidate(originalLesson, candidateLesson);
      
      if (!validation.valid) {
        console.log(`❌ [Phase10v2] Validation failed:`);
        validation.errors.forEach(err => console.log(`   - ${err}`));
        
        return {
          candidateLesson: null,
          validationFailures: validation.errors,
          scoreComparison: null
        };
      }
      
      if (validation.warnings.length > 0) {
        console.log(`⚠️  [Phase10v2] Validation warnings:`);
        validation.warnings.forEach(warn => console.log(`   - ${warn}`));
      }
      
      console.log(`✅ [Phase10v2] All hard validators passed`);
      
      // Score candidate (score gate implemented separately in step 3)
      console.log(`🔄 [Phase10v2] Scoring candidate lesson...`);
      const candidateScore = await this.scorer.scoreLesson(candidateLesson);
      
      console.log(`📊 [Phase10v2] Candidate score: ${candidateScore.total}/100`);
      console.log(`📊 [Phase10v2] Score delta: ${candidateScore.total >= rubricScore.total ? '+' : ''}${candidateScore.total - rubricScore.total}`);
      
      // SCORE GATE: Reject if score decreased
      if (candidateScore.total < rubricScore.total) {
        const decline = rubricScore.total - candidateScore.total;
        console.log(`❌ [Phase10v2] Score gate FAILED: score declined by ${decline} points`);
        console.log(`❌ [Phase10v2] Rejecting candidate and keeping original`);
        
        return {
          candidateLesson: null,
          validationFailures: [
            `Score gate failed: score declined from ${rubricScore.total} to ${candidateScore.total} (Δ-${decline})`
          ],
          scoreComparison: {
            original: rubricScore.total,
            candidate: candidateScore.total,
            delta: candidateScore.total - rubricScore.total
          }
        };
      }
      
      // Score improved or stayed the same - accept candidate
      const improvement = candidateScore.total - rubricScore.total;
      if (improvement > 0) {
        console.log(`✅ [Phase10v2] Score gate PASSED: score improved by ${improvement} points`);
      } else {
        console.log(`✅ [Phase10v2] Score gate PASSED: score unchanged (no harm)`);
      }
      
      return {
        candidateLesson,
        validationFailures: [],
        scoreComparison: {
          original: rubricScore.total,
          candidate: candidateScore.total,
          delta: candidateScore.total - rubricScore.total
        }
      };
      
    } catch (error) {
      console.error(`❌ [Phase10v2] Error during rewrite:`, error);
      return {
        candidateLesson: null,
        validationFailures: [`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`],
        scoreComparison: null
      };
    }
  }
  
  /**
   * Parse LLM response to Lesson object
   */
  private parseLLMResponse(response: string): Lesson | null {
    try {
      // Follow validation pipeline from don't_touch.md
      
      // 1. Validate (checks for error messages)
      const validation = validateLLMResponse(response);
      if (!validation.valid) {
        console.error(`❌ [Phase10v2] Validation failed:`, validation.error);
        return null;
      }
      
      // 2. Clean code blocks (removes ```json markers)
      const cleaned = cleanCodeBlocks(response);
      
      // 3. Preprocess (removes trailing commas, comments, etc)
      const preprocessed = preprocessToValidJson(cleaned);
      
      // 4. Parse (RFC 8259 JSON only)
      const parsed = safeJsonParse<Lesson>(preprocessed);
      
      if (!parsed.success || !parsed.data) {
        console.error(`❌ [Phase10v2] JSON parse failed:`, parsed.error);
        return null;
      }
      
      return parsed.data;
      
    } catch (error) {
      console.error(`❌ [Phase10v2] Exception during parsing:`, error);
      return null;
    }
  }
  
  /**
   * Build system prompt for Phase 10 v2
   * VERBATIM from spec
   */
  protected buildSystemPrompt(): string {
    return `You are an expert lesson JSON refiner.

You will be given:
1) The ORIGINAL lesson JSON (valid).
2) A scoring report listing issues and suggested improvements.

Your job:
Return a NEW lesson JSON that fixes the issues while preserving the lesson's structure.

STRICT RULES (HARD):
- Output ONLY valid JSON. No commentary. No markdown. No code fences.
- Do NOT change: lesson.id, lesson.unit, lesson.topic, lesson.layout.
- Do NOT reorder blocks.
- Do NOT add blocks.
- Do NOT remove blocks.
- Do NOT change any block.id values.
- Do NOT change any block.type values.
- Do NOT change any block.order values.
- Keep blocks array length EXACTLY the same.
- Only edit fields inside existing blocks to improve clarity, correctness, marking robustness, and alignment.

CONTENT RULES:
- Fix the issues described in the scoring report as priority.
- Do not introduce "[object Object]" or placeholder text.
- If the scoring report contains malformed suggestions (e.g. '[object Object]'), ignore those suggestions and instead implement the intended fix safely.

ANSWER TYPE RULES (CRITICAL):
- VALID answerTypes: "short-text", "multiple-choice", "calculation", "true-false"
- NEVER use: "numeric", "long-text", "essay", "open-ended", or any other type
- Do NOT change answerType unless you also update the question's grading expectations so marking remains robust.
- Prefer keeping answerType unchanged and improving hints/expectedAnswer variants unless explicitly required.
- If you must change answerType, use ONLY one of the 4 valid types above.

OUTPUT FORMAT:
Return the full lesson JSON object.

${this.getJsonOutputInstructions()}`;
  }
  
  /**
   * Build user prompt for Phase 10 v2
   * VERBATIM from spec
   */
  protected buildUserPrompt(input: any): string {
    const { originalLesson, rubricScore } = input as RewriteInput;
    
    // Format scoring report
    const scoringReport = this.formatScoringReport(rubricScore);
    
    return `REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
${JSON.stringify(originalLesson, null, 2)}

SCORING REPORT (issues + suggestions):
${scoringReport}

TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.`;
  }
  
  /**
   * Format scoring report for user prompt
   */
  private formatScoringReport(score: RubricScore): string {
    let report = `Total Score: ${score.total}/100 (${score.grade})\n\n`;
    report += `Issues by Section:\n`;
    
    score.details.forEach(detail => {
      if (detail.issues.length === 0) return;
      
      report += `\n## ${detail.section} (${detail.score}/${detail.maxScore})\n`;
      detail.issues.forEach((issue, idx) => {
        report += `- Issue: ${issue}\n`;
        if (detail.suggestions[idx]) {
          report += `  Suggestion: ${detail.suggestions[idx]}\n`;
        }
      });
    });
    
    return report;
  }
}
