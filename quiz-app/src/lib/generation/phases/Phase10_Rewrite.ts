/**
 * Phase 10 v2: Holistic Rewrite
 * 
 * Replaces patch-based refinement with holistic rewrite approach.
 * LLM outputs full improved lesson JSON in one shot while enforcing hard structural invariants.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore } from '../llmScoringService';
import { validateCandidate, DetailedValidationResult } from './Phase10_Validators';
import { preprocessToValidJson, safeJsonParse, validateLLMResponse, cleanCodeBlocks } from '../utils';
import { Phase10RunRecorder } from '../Phase10RunRecorder';
import { FixPlan } from './Phase10_Planner';

export interface RewriteInput {
  originalLesson: Lesson;
  rubricScore: RubricScore;
  fixPlan?: FixPlan;  // Optional fix plan from planner stage
}

export interface RewriteOutput {
  candidateLesson: Lesson | null;
  validationFailures: string[];
  validationResult: DetailedValidationResult | null;
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
    scorer: any,
    recorder?: Phase10RunRecorder,
    fixPlan?: FixPlan
  ): Promise<RewriteOutput> {
    this.scorer = scorer;
    
    console.log(`\n🔄 [Phase10v2] Starting holistic rewrite...`);
    console.log(`🔄 [Phase10v2] Original score: ${rubricScore.total}/100`);
    if (fixPlan) {
      console.log(`🔄 [Phase10v2] Using fix plan with ${fixPlan.plan.length} items`);
    }
    
    // Get Phase 10 model for better reasoning
    const { getPhase10Model } = await import('@/lib/config/geminiConfig');
    const phase10Model = getPhase10Model();
    
    // Build prompts
    const input: RewriteInput = { originalLesson, rubricScore, fixPlan };
    const prompts = this.getPrompts(input);
    
    // Store for debug bundle
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    // Write prompts to recorder
    if (recorder) {
      await recorder.writePrompt(
        '02_prompt_rewrite.json',
        'rewrite',
        phase10Model,  // Use Phase 10 model in recording
        prompts.systemPrompt,
        prompts.userPrompt,
        {
          maxTokens: 24000,
          inputRefs: ['00_input_lesson.json', '01_score_before.json'],
          notes: 'Holistic rewrite approach (v2)',
        }
      );
    }
    
    // Call LLM with generateWithRetry
    console.log(`🔄 [Phase10v2] Calling LLM for holistic rewrite...`);
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'phase', // type
        2,       // maxRetries
        false,   // attemptHigherLimit
        24000,   // currentTokenLimit - increased for full lesson JSON
        phase10Model  // NEW: Pass Phase 10 model
      );
      
      this.lastRawResponse = response;
      
      // Write raw response to recorder
      if (recorder) {
        await recorder.writeText('03_output_rewrite.txt', response);
      }
      
      // Parse JSON response
      console.log(`🔄 [Phase10v2] Parsing LLM response (${response.length} chars)...`);
      const candidateLesson = this.parseLLMResponse(response);
      
      if (!candidateLesson) {
        // Record parse error
        if (recorder) {
          recorder.recordParseResult(undefined, 'Failed to parse LLM response as valid JSON');
          recorder.recordStatus('failed', { step: 'parse', message: 'Failed to parse LLM response' });
        }
        
        return {
          candidateLesson: null,
          validationFailures: ['Failed to parse LLM response as valid JSON'],
          validationResult: null,
          scoreComparison: null
        };
      }
      
      console.log(`🔄 [Phase10v2] Successfully parsed candidate lesson`);
      
      // Enforce synthesis instruction format (post-processing guardrail)
      console.log(`🔄 [Phase10v2] Enforcing synthesis instruction format...`);
      this.enforceSynthesisInstruction(candidateLesson);
      
      // Record parsed candidate (for v2, no patches - this is full lesson rewrite)
      if (recorder) {
        recorder.recordParseResult([], undefined); // Empty patches array for v2
      }
      
      // Run hard validators
      console.log(`🔄 [Phase10v2] Running hard validators...`);
      const validation = validateCandidate(originalLesson, candidateLesson);
      
      // Record validation result
      if (recorder) {
        recorder.recordValidation(validation);
      }
      
      if (!validation.valid) {
        console.log(`❌ [Phase10v2] Validation failed:`);
        validation.errors.forEach(err => console.log(`   - ${err}`));
        
        if (recorder) {
          recorder.recordStatus('failed', { step: 'validate', message: validation.errors.join('; ') });
        }
        
        return {
          candidateLesson: null,
          validationFailures: validation.errors,
          validationResult: validation,
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
      
      // Record after score
      if (recorder) {
        recorder.recordScore('after', candidateScore);
      }
      
      console.log(`📊 [Phase10v2] Candidate score: ${candidateScore.total}/100`);
      console.log(`📊 [Phase10v2] Score delta: ${candidateScore.total >= rubricScore.total ? '+' : ''}${candidateScore.total - rubricScore.total}`);
      
      // SCORE GATE: Reject if score decreased
      if (candidateScore.total < rubricScore.total) {
        const decline = rubricScore.total - candidateScore.total;
        console.log(`❌ [Phase10v2] Score gate FAILED: score declined by ${decline} points`);
        console.log(`❌ [Phase10v2] Rejecting candidate and keeping original`);
        
        if (recorder) {
          recorder.recordStatus('failed', { 
            step: 'score', 
            message: `Score gate failed: score declined by ${decline} points` 
          });
        }
        
        return {
          candidateLesson: null,
          validationFailures: [
            `Score gate failed: score declined from ${rubricScore.total} to ${candidateScore.total} (Δ-${decline})`
          ],
          validationResult: validation,
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
      
      // Record success
      if (recorder) {
        recorder.recordStatus('success');
      }
      
      return {
        candidateLesson,
        validationFailures: [],
        validationResult: validation,
        scoreComparison: {
          original: rubricScore.total,
          candidate: candidateScore.total,
          delta: candidateScore.total - rubricScore.total
        }
      };
      
    } catch (error) {
      console.error(`❌ [Phase10v2] Error during rewrite:`, error);
      
      if (recorder) {
        recorder.recordStatus('failed', { 
          step: 'unknown', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      
      return {
        candidateLesson: null,
        validationFailures: [`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`],
        validationResult: null,
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
Improve the lesson's PEDAGOGICAL QUALITY (clarity, teaching effectiveness, gradeability).
Return a NEW lesson JSON that fixes the pedagogical issues while preserving the lesson's structure.

CRITICAL: Structure validation is enforced by Phase10_Validators.ts BEFORE this stage.
Focus on PEDAGOGY: content clarity, teaching-before-testing, scaffolding, question quality, and marking robustness.
Do NOT worry about schema/structure - that's already validated.

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
- DO NOT change answerType anywhere. This is a hard constraint.
- For synthesis questions (cognitiveLevel: "synthesis"): questionText MUST end with EXACTLY this instruction: "Answer in 3-4 sentences OR concise bullet points." AND expectedAnswer MUST be a checklist of 4-8 key concepts/phrases to grade against (not full sentence variants). Do not use any other numbers or phrasing variants.

SYNTHESIS QUESTION REQUIREMENTS:
- questionText ends with: "Answer in 3-4 sentences OR concise bullet points."
- expectedAnswer format: ["key concept 1", "key concept 2", "key concept 3", "key concept 4", ...]
- Example expectedAnswer: ["fault isolation and continuity", "cable economy", "load sharing across paths", "safety of movement during faults"]
- Do NOT use full sentence variants for synthesis questions

CONNECTION QUESTION REQUIREMENTS (D3 Question 1):
- For mapping questions (e.g., "which circuit type for X and Y"), expectedAnswer must use explicit mappings
- BAD: ["radial and ring", "ring and radial"]
- GOOD: ["lighting: radial; sockets: ring", "radial for lighting, ring final for sockets"]
- Prevents false positives from reversed answers

OUTPUT FORMAT:
Return the full lesson JSON object.

${this.getJsonOutputInstructions()}`;
  }
  
  /**
   * Build user prompt for Phase 10 v2
   * VERBATIM from spec
   */
  protected buildUserPrompt(input: any): string {
    const { originalLesson, rubricScore, fixPlan } = input as RewriteInput;
    
    // Format scoring report
    const scoringReport = this.formatScoringReport(rubricScore);
    
    let prompt = `REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
${JSON.stringify(originalLesson, null, 2)}

SCORING REPORT (issues + suggestions):
${scoringReport}`;

    // Add fix plan if available
    if (fixPlan && fixPlan.plan.length > 0) {
      prompt += `

FIX PLAN (implement every non-blocked item):
${JSON.stringify(fixPlan, null, 2)}

IMPLEMENTATION PRIORITY:
- Implement ALL items marked as "llm_editable"
- DO NOT attempt items marked as "blocked_by_policy" or "requires_regeneration"
- Follow the specific instructions and guardrails for each plan item
- Use the suggested textSnippets where provided`;
    }
    
    prompt += `

TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.`;
    
    return prompt;
  }
  
  /**
   * Format scoring report for user prompt
   */
  private formatScoringReport(score: RubricScore): string {
    let report = `Total Score: ${score.total}/100 (${score.grade})\n\n`;
    
    // Add overall assessment if available
    if (score.overallAssessment) {
      report += `OVERALL ASSESSMENT:\n${score.overallAssessment}\n\n`;
    }
    
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
  
  /**
   * Enforce exact synthesis instruction format
   * Ensures all synthesis questions use the approved instruction
   */
  private enforceSynthesisInstruction(lesson: Lesson): Lesson {
    const APPROVED_INSTRUCTION = "Answer in 3-4 sentences OR concise bullet points.";
    
    lesson.blocks.forEach(block => {
      if ((block.type === 'practice' || block.type === 'integrative' || block.type === 'spaced-review') 
          && block.content.questions) {
        block.content.questions.forEach((q: any) => {
          if (q.cognitiveLevel === 'synthesis' && q.answerType === 'short-text') {
            // Remove any existing "Answer in..." instruction (case insensitive)
            let text = q.questionText.replace(/\s*\(?Answer in \d+-?\d* sentences?[^.]*\.?\)?/gi, '').trim();
            // Also remove just "(3-4 sentences)" style without "Answer in"
            text = text.replace(/\s*\(?\d+-?\d* sentences?\)?\.?$/gi, '').trim();
            // Append approved instruction
            q.questionText = `${text} ${APPROVED_INSTRUCTION}`;
          }
        });
      }
    });
    
    return lesson;
  }
}
