/**
 * Phase 10 Planner
 * 
 * Generates explicit fix plans between scoring and rewrite stages.
 * Classifies each issue by fixability and provides structured instructions.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore, RubricDetail } from '../llmScoringService';
import { preprocessToValidJson, safeJsonParse } from '../utils';

export interface FixPlanItem {
  issueId: string;
  rubricRef: string;            // e.g., "B1", "D3"
  fixability: 'deterministic' | 'llm_editable' | 'blocked_by_policy' | 'requires_regeneration';
  targets: string[];            // JSON Pointer paths
  instructions: string;
  guardrails?: string[];        // e.g., "do not change id/type/order"
  textSnippets?: string[];      // Optional text to insert
}

export interface FixPlan {
  lessonId: string;
  timestamp: string;
  plan: FixPlanItem[];
}

export class Phase10_Planner extends PhasePromptBuilder {
  public lastPrompts: { system: string; user: string } = { system: '', user: '' };
  public lastRawResponse: string = '';
  
  getPhaseName(): string {
    return 'Phase 10 Planner';
  }
  
  /**
   * Generate fix plan from scoring results
   */
  async generatePlan(
    originalLesson: Lesson,
    rubricScore: RubricScore,
    generateFn: Function
  ): Promise<FixPlan> {
    console.log(`\n📋 [Phase10Planner] Generating fix plan...`);
    
    const input = { originalLesson, rubricScore };
    const prompts = this.getPrompts(input);
    
    // Store for debug bundle
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    // Call LLM with planner prompts
    console.log(`📋 [Phase10Planner] Calling LLM for planning...`);
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'phase',
        2,       // maxRetries
        false,   // attemptHigherLimit
        8000     // currentTokenLimit - planning doesn't need as much
      );
      
      this.lastRawResponse = response;
      
      // Parse JSON response
      console.log(`📋 [Phase10Planner] Parsing plan response (${response.length} chars)...`);
      const fixPlan = this.parsePlanResponse(response, originalLesson.id);
      
      console.log(`✅ [Phase10Planner] Generated plan with ${fixPlan.plan.length} items`);
      const fixableCount = fixPlan.plan.filter(
        p => p.fixability === 'deterministic' || p.fixability === 'llm_editable'
      ).length;
      const blockedCount = fixPlan.plan.filter(
        p => p.fixability === 'blocked_by_policy' || p.fixability === 'requires_regeneration'
      ).length;
      console.log(`   - Fixable: ${fixableCount}`);
      console.log(`   - Blocked: ${blockedCount}`);
      
      return fixPlan;
      
    } catch (error) {
      console.error(`❌ [Phase10Planner] Error during planning:`, error);
      
      // Return empty plan on error
      return {
        lessonId: originalLesson.id,
        timestamp: new Date().toISOString(),
        plan: []
      };
    }
  }
  
  /**
   * Parse LLM plan response to FixPlan object
   */
  private parsePlanResponse(response: string, lessonId: string): FixPlan {
    try {
      // Clean response
      let cleaned = response.trim();
      
      // Remove markdown code blocks if present
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // Preprocess and parse
      const preprocessed = preprocessToValidJson(cleaned);
      const parsed = safeJsonParse(preprocessed);
      
      if (!parsed.success || !parsed.data) {
        console.error(`❌ [Phase10Planner] JSON parse failed:`, parsed.error);
        throw new Error('Failed to parse plan response');
      }
      
      const data = parsed.data as any;
      
      // Validate structure
      if (!Array.isArray(data.plan)) {
        throw new Error('Plan response missing "plan" array');
      }
      
      return {
        lessonId: lessonId,
        timestamp: new Date().toISOString(),
        plan: data.plan
      };
      
    } catch (error) {
      console.error(`❌ [Phase10Planner] Exception during parsing:`, error);
      throw error;
    }
  }
  
  /**
   * Build system prompt for planner
   */
  protected buildSystemPrompt(): string {
    return `You are an expert lesson JSON fix planner.

Your task is to analyze scoring issues and create an explicit fix plan that classifies each issue by fixability and provides structured instructions.

PHASE 10 INVARIANTS (CRITICAL):
- Cannot add blocks
- Cannot remove blocks
- Cannot reorder blocks
- Cannot change block.id, block.type, or block.order
- Cannot change lesson.id, lesson.unit, lesson.topic, or lesson.layout
- Block count must remain EXACTLY the same

ALLOWED OPERATIONS:
- Edit content within existing blocks
- Modify text fields (content, questionText, title, description, etc.)
- Update expectedAnswer arrays
- Modify hints
- Change Bloom levels
- Update learning outcomes
- Add/edit/remove items in arrays within existing blocks (e.g., add vocab terms to existing vocab block, add questions to existing practice block)

FIXABILITY CLASSIFICATIONS:

1. "deterministic" - Mechanical fixes that follow a clear rule:
   - Add missing "Coming Up Next" text
   - Standardize formatting
   - Fix consistent terminology issues

2. "llm_editable" - Content improvements requiring judgment:
   - Improve clarity of explanations
   - Enhance question wording
   - Add context or examples
   - Improve hint quality

3. "blocked_by_policy" - Conflicts with Phase 10 constraints:
   - Issue requires answerType change (answerType changes are STRICTLY FORBIDDEN)
   - Issue requires structural changes (add/remove/reorder blocks)
   - Note the specific policy conflict

4. "requires_regeneration" - Needs structural changes:
   - Issue requires adding/removing entire blocks
   - Needs reordering blocks
   - Requires changing block types
   - Fundamental restructuring of content
   - NOTE: Adding items to arrays WITHIN existing blocks is allowed (vocab terms, learning outcomes, etc.)

OUTPUT FORMAT:

Return ONLY valid JSON with this structure:

{
  "plan": [
    {
      "issueId": "B1.orientation.preview",
      "rubricRef": "B1",
      "fixability": "llm_editable",
      "targets": ["/blocks/3/content/content"],
      "instructions": "Add 'In this lesson' preview section at start of explanation. Should describe what students will learn in 2-3 sentences.",
      "guardrails": ["do not change block id or type", "preserve existing content"],
      "textSnippets": ["### In this lesson\\n\\nYou will learn about..."]
    },
    {
      "issueId": "B1.orientation.comingUpNext",
      "rubricRef": "B1",
      "fixability": "deterministic",
      "targets": ["/blocks/9/content/notes"],
      "instructions": "Append 'Coming Up Next: [Next Lesson Topic]' to notes field.",
      "textSnippets": [" Coming Up Next: Circuit Protection and Overcurrent Devices."]
    },
    {
      "issueId": "D3.integrative.synthesis.format",
      "rubricRef": "D3",
      "fixability": "llm_editable",
      "targets": ["/blocks/8/content/questions/1/questionText", "/blocks/8/content/questions/1/expectedAnswer"],
      "instructions": "Add 'Answer in 3-4 sentences' to questionText; set expectedAnswer to key-points checklist (4-8 phrases covering main concepts to look for in student answer)."
    }
  ]
}

RULES:
- One plan item per scoring issue
- Use JSON Pointer format for targets (e.g., "/blocks/3/content/content")
- Be specific in instructions - explain WHAT to add/change and WHERE
- For blocked issues, clearly state the policy conflict
- Include guardrails for safety (e.g., "preserve existing content", "do not change IDs")
- Optional textSnippets for deterministic fixes

${this.getJsonOutputInstructions()}`;
  }
  
  /**
   * Build user prompt for planner
   */
  protected buildUserPrompt(input: any): string {
    const { originalLesson, rubricScore } = input;
    
    // Format scoring issues
    const issuesText = this.formatScoringIssues(rubricScore);
    
    // Extract invariants summary
    const blockCount = originalLesson.blocks.length;
    const blockTypes = originalLesson.blocks.map((b: any, idx: number) => `  ${idx}: ${b.type} (id: ${b.id})`).join('\n');
    
    return `CREATE A FIX PLAN FOR THIS LESSON.

LESSON METADATA:
- ID: ${originalLesson.id}
- Unit: ${originalLesson.unit}
- Topic: ${originalLesson.topic}
- Layout: ${originalLesson.layout}
- Block Count: ${blockCount} (MUST NOT CHANGE)

BLOCK STRUCTURE (IMMUTABLE):
${blockTypes}

SCORING ISSUES:
${issuesText}

TASK:
For each scoring issue above, create a fix plan item that:
1. Classifies fixability (deterministic / llm_editable / blocked_by_policy / requires_regeneration)
2. Lists target JSON Pointer paths
3. Provides clear, specific instructions
4. Notes any guardrails or safety constraints
5. For blocked issues, explains the policy conflict

Remember:
- Phase 10 CANNOT add/remove/reorder blocks
- Phase 10 CANNOT change answerType (especially short-text → long-text)
- Phase 10 CAN edit content within blocks
- Be explicit about what's fixable vs. what's blocked

Return ONLY the JSON plan object. No markdown, no additional text.`;
  }
  
  /**
   * Format scoring issues for prompt
   */
  private formatScoringIssues(score: RubricScore): string {
    let text = `Total Score: ${score.total}/100 (${score.grade})\n\n`;
    
    if (score.details.length === 0) {
      return text + 'No issues found.';
    }
    
    score.details.forEach((detail, idx) => {
      text += `ISSUE ${idx + 1}: ${detail.section}\n`;
      text += `  Max Impact: ${detail.maxScore} points\n`;
      
      if (detail.issues.length > 0) {
        text += `  Problem: ${detail.issues.join(' ')}\n`;
      }
      
      if (detail.suggestions.length > 0) {
        text += `  Suggestions:\n`;
        detail.suggestions.forEach(sug => {
          text += `    - ${sug}\n`;
        });
      }
      
      if (detail.jsonPointers && detail.jsonPointers.length > 0) {
        text += `  Affected Paths: ${detail.jsonPointers.join(', ')}\n`;
      }
      
      text += '\n';
    });
    
    return text;
  }
}
