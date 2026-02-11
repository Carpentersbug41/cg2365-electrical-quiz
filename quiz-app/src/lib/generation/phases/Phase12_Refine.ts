/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Phase 12: Full-Lesson Refinement
 * 
 * Replaces the patch-based system with a full-lesson output approach.
 * Takes original lesson + Phase10 score + issues, outputs COMPLETE refined lesson JSON.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { Phase10Score } from './Phase10_Score';
import { SyllabusContext } from '@/lib/syllabus/syllabusRAG';
import { preprocessToValidJson, safeJsonParse } from '../utils';
import { debugLogger } from '../debugLogger';

export interface RefinementInput {
  originalLesson: Lesson;
  phase10Score: Phase10Score;
  syllabusContext: SyllabusContext | null;
  additionalInstructions?: string;
}

export interface RefinementOutput {
  refinedLesson: Lesson;
  success: boolean;
  error?: string;
  validationErrors?: string[];
}

interface StructureSignature {
  blocksLength: number;
  blockIds: string[];
  blockTypes: string[];
  blockOrders: number[];
  answerTypes: Map<string, string>; // questionId -> answerType
}

export class Phase12_Refine extends PhasePromptBuilder {
  public lastPrompts: { system: string; user: string } = { system: '', user: '' };
  public lastRawResponse: string = '';
  
  getPhaseName(): string {
    return 'Phase 12: Full-Lesson Refinement';
  }
  
  /**
   * Refine a lesson by outputting complete improved JSON
   */
  async refineLesson(
    input: RefinementInput,
    generateFn: Function
  ): Promise<RefinementOutput> {
    const stopTimer = debugLogger.startTimer('Phase 12: Full-Lesson Refinement');
    
    console.log(`\n🔨 [Phase12_Refine] Refining lesson ${input.originalLesson.id}...`);
    debugLogger.phaseHeader('Phase 12: Full-Lesson Refinement', input.originalLesson.id);
    
    debugLogger.logInput('Input', {
      'Lesson ID': input.originalLesson.id,
      'Block Count': input.originalLesson.blocks.length,
      'Original Score': `${input.phase10Score.total}/100`,
      'Issues to Fix': input.phase10Score.issues.length,
      'Additional Instructions': input.additionalInstructions || '(none)'
    });
    
    // Step 1: Extract structure signature for validation
    const signature = this.extractStructureSignature(input.originalLesson);
    debugLogger.logStep('\n🔒 Extracted structure signature (immutable constraints)');
    
    // Step 2: Build prompts
    debugLogger.logStep('\n🔨 Building refinement prompts...');
    const prompts = this.getPrompts(input);
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    debugLogger.logPrompt('system', prompts.systemPrompt);
    debugLogger.logPrompt('user', prompts.userPrompt);
    
    // Step 3: Call LLM to generate complete refined lesson
    const { getPhase12Model } = await import('@/lib/config/geminiConfig');
    const phase12Model = getPhase12Model();
    
    console.log(`🤖 [Phase12_Refine] Calling LLM for full-lesson refinement...`);
    debugLogger.logLLMCall(phase12Model);

    if (process.env.DEBUG_PHASE10 === 'true') {
      console.log('\n\n>>> ENTERING PHASE 12: Full-Lesson Refinement - LLM CALL <<<\n');
    }

    const llmStartTime = Date.now();
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'lesson',
        2,       // maxRetries
        false,   // attemptHigherLimit
        16000,   // tokenLimit - needs space for full lesson JSON
        phase12Model
      );
      
      const llmDuration = Date.now() - llmStartTime;
      this.lastRawResponse = response;
      
      debugLogger.logLLMResponse(response, llmDuration);
      
      // Step 4: Parse refined lesson
      console.log(`🔍 [Phase12_Refine] Parsing refined lesson (${response.length} chars)...`);
      debugLogger.logStep('\n🔍 Parsing refined lesson JSON...');
      
      const refinedLesson = this.parseRefinedLesson(response);
      
      if (!refinedLesson) {
        stopTimer();
        return {
          refinedLesson: input.originalLesson,
          success: false,
          error: 'Failed to parse refined lesson JSON'
        };
      }
      
      // Step 5: Validate structure unchanged
      console.log(`🔍 [Phase12_Refine] Validating structure preservation...`);
      debugLogger.logStep('\n🔍 Validating structure preservation...');
      
      const validationErrors = this.validateStructure(signature, refinedLesson);
      
      if (validationErrors.length > 0) {
        console.error(`❌ [Phase12_Refine] Structure validation failed:`);
        validationErrors.forEach(err => console.error(`   - ${err}`));
        debugLogger.logError('Structure validation failed');
        stopTimer();
        
        return {
          refinedLesson: input.originalLesson,
          success: false,
          error: 'Structure validation failed',
          validationErrors
        };
      }
      
      console.log(`✅ [Phase12_Refine] Structure preserved successfully`);
      debugLogger.logSuccess('Refined lesson passed structure validation');
      
      stopTimer();
      return {
        refinedLesson,
        success: true
      };
      
    } catch (error: any) {
      console.error(`❌ [Phase12_Refine] Error:`, error);
      debugLogger.logError(`Refinement failed: ${error.message}`);
      stopTimer();
      
      return {
        refinedLesson: input.originalLesson,
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Extract immutable structure signature from lesson
   */
  private extractStructureSignature(lesson: Lesson): StructureSignature {
    const answerTypes = new Map<string, string>();
    
    // Extract all answerType fields from questions in all blocks
    for (const block of lesson.blocks) {
      if (block.content.questions && Array.isArray(block.content.questions)) {
        for (const question of block.content.questions as any[]) {
          if (question.id && question.answerType) {
            answerTypes.set(question.id, question.answerType);
          }
        }
      }
    }
    
    return {
      blocksLength: lesson.blocks.length,
      blockIds: lesson.blocks.map(b => b.id),
      blockTypes: lesson.blocks.map(b => b.type),
      blockOrders: lesson.blocks.map(b => b.order),
      answerTypes
    };
  }
  
  /**
   * Validate that refined lesson preserves structure
   */
  private validateStructure(signature: StructureSignature, refinedLesson: Lesson): string[] {
    const errors: string[] = [];
    
    // Check blocks length
    if (refinedLesson.blocks.length !== signature.blocksLength) {
      errors.push(`Block count changed: expected ${signature.blocksLength}, got ${refinedLesson.blocks.length}`);
      return errors; // Fatal error, don't check further
    }
    
    // Check block IDs
    for (let i = 0; i < refinedLesson.blocks.length; i++) {
      if (refinedLesson.blocks[i].id !== signature.blockIds[i]) {
        errors.push(`Block ${i} ID changed: expected '${signature.blockIds[i]}', got '${refinedLesson.blocks[i].id}'`);
      }
    }
    
    // Check block types
    for (let i = 0; i < refinedLesson.blocks.length; i++) {
      if (refinedLesson.blocks[i].type !== signature.blockTypes[i]) {
        errors.push(`Block ${i} type changed: expected '${signature.blockTypes[i]}', got '${refinedLesson.blocks[i].type}'`);
      }
    }
    
    // Check block orders
    for (let i = 0; i < refinedLesson.blocks.length; i++) {
      if (refinedLesson.blocks[i].order !== signature.blockOrders[i]) {
        errors.push(`Block ${i} order changed: expected ${signature.blockOrders[i]}, got ${refinedLesson.blocks[i].order}`);
      }
    }
    
    // Check answerTypes preserved
    for (const block of refinedLesson.blocks) {
      if (block.content.questions && Array.isArray(block.content.questions)) {
        for (const question of block.content.questions as any[]) {
          if (question.id) {
            const expectedType = signature.answerTypes.get(question.id);
            if (expectedType && question.answerType !== expectedType) {
              errors.push(`Question ${question.id} answerType changed: expected '${expectedType}', got '${question.answerType}'`);
            }
          }
        }
      }
    }
    
    return errors;
  }
  
  /**
   * Parse refined lesson JSON from LLM response
   */
  private parseRefinedLesson(response: string): Lesson | null {
    const cleaned = preprocessToValidJson(response);
    const parsed = safeJsonParse(cleaned);
    
    if (!parsed.success || !parsed.data) {
      console.error(`❌ [Phase12_Refine] Failed to parse JSON: ${parsed.error}`);
      return null;
    }
    
    // Basic validation that it's a lesson
    const lesson = parsed.data;
    if (!lesson.id || !lesson.blocks || !Array.isArray(lesson.blocks)) {
      console.error(`❌ [Phase12_Refine] Parsed JSON is not a valid lesson`);
      return null;
    }
    
    return lesson as Lesson;
  }
  
  /**
   * Build system prompt
   */
  protected buildSystemPrompt(input: any): string {
    const { originalLesson, phase10Score, syllabusContext } = input;
    
    // Build structure signature for prompt
    const signature = this.extractStructureSignature(originalLesson);
    const blocksList = originalLesson.blocks.map((b, i) => 
      `  ${i + 1}. ID: ${b.id}, Type: ${b.type}, Order: ${b.order}`
    ).join('\n');
    
    const answerTypesList = Array.from(signature.answerTypes.entries())
      .map(([id, type]) => `  - ${id}: ${type}`)
      .join('\n');
    
    const syllabusSection = syllabusContext ? `
SYLLABUS CONTEXT (syllabus specification):
Unit: ${syllabusContext.unit} - ${syllabusContext.unitTitle}
Learning Outcome: ${syllabusContext.learningOutcome} - ${syllabusContext.loTitle}
Assessment Criteria:
${syllabusContext.assessmentCriteria.map((ac, i) => `  ${i + 1}. ${ac}`).join('\n')}
` : '';
    
    return `You are a pedagogical refinement expert for City & Guilds technical and vocational lessons.

TASK: Output a COMPLETE refined lesson JSON that fixes the pedagogical issues below while preserving the exact structure.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Keep all refinements transferable across technical subjects.

UNIVERSAL PEDAGOGICAL STANDARDS TO ENFORCE:
- Concrete before abstract.
- Observable before symbolic.
- Concept before unit.
- Definition + concrete anchor + micro-scenario.
- Recall -> reasoning -> integration.
- Simplified but technically defensible wording.

${syllabusSection}

LOCKED STRUCTURE (IMMUTABLE - DO NOT CHANGE):
- Block count: ${signature.blocksLength} (MUST remain ${signature.blocksLength})
- Block IDs, types, and order values (MUST remain exactly as listed below):
${blocksList}

- answerType fields (MUST remain unchanged):
${answerTypesList || '  (no questions with answerType)'}

PEDAGOGICAL ISSUES TO FIX:
Score: ${phase10Score.total}/100 (${phase10Score.grade})
Breakdown:
  - Beginner Clarity: ${phase10Score.breakdown.beginnerClarity}/30
  - Teaching-Before-Testing: ${phase10Score.breakdown.teachingBeforeTesting}/25
  - Marking Robustness: ${phase10Score.breakdown.markingRobustness}/20
  - Alignment to LO: ${phase10Score.breakdown.alignmentToLO}/15
  - Question Quality: ${phase10Score.breakdown.questionQuality}/10

Issues (${phase10Score.issues.length}):
${phase10Score.issues.map((issue, i) => `
${i + 1}. ${issue.id} (${issue.category})
   Problem: ${issue.problem}
   Why It Matters: ${issue.whyItMatters}
   Alignment Gap: ${issue.alignmentGap || 'N/A'}
   Excerpt: "${issue.excerpt.substring(0, 100)}${issue.excerpt.length > 100 ? '...' : ''}"
`).join('')}

REFINEMENT RULES:
1. Output COMPLETE Lesson JSON (full object with all fields, all blocks, all content)
2. Fix content within blocks to address the pedagogical issues
3. Improve clarity, examples, explanations, question wording, expectedAnswer arrays
3a. Add concrete anchors after formal definitions when missing
3b. Add micro-scenarios for measurement/unit/comparison concepts when missing
3c. Ensure at least one early reasoning check after recall before next major concept
4. DO NOT add, remove, or reorder blocks
5. DO NOT change block IDs, types, or order values
6. DO NOT change answerType fields
7. Preserve all required schema fields (id, title, description, layout, unit, topic, learningOutcomes, prerequisites, blocks, metadata)
8. Maintain all block structure (each block must have id, type, order, content)
9. Preserve scope/anchor metadata if present (targetAssessmentCriteria, metadata.syllabusAnchors, metadata.scope, metadata.misconceptions)
10. If the issues explicitly call for missing scope/anchor/misconception metadata, add them without changing structural invariants

PEDAGOGICAL PRIORITIES:
- Clear, beginner-friendly language
- Teach concepts before testing them
- Robust expectedAnswer arrays (gradeable by LLM)
- Alignment with syllabus outcomes, assessment criteria, and declared scope
- High-quality, unambiguous questions

${this.getJsonOutputInstructions()}

Return the COMPLETE refined lesson as valid JSON. Nothing else.`;
  }
  
  /**
   * Build user prompt
   */
  protected buildUserPrompt(input: any): string {
    const { originalLesson, additionalInstructions } = input;
    
    const lessonJson = JSON.stringify(originalLesson, null, 2);
    
    let prompt = '';
    
    // Add additional instructions if provided
    if (additionalInstructions && additionalInstructions.trim()) {
      prompt += `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions.trim()}\n\n`;
      prompt += `ASSISTANT ACKNOWLEDGMENT: I will consider this context when refining the lesson.\n\n`;
    }
    
    prompt += `ORIGINAL LESSON TO REFINE:
${lessonJson}

Output the complete refined lesson JSON that fixes the pedagogical issues while preserving the structure.`;
    
    return prompt;
  }
}



