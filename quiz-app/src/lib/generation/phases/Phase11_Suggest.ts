/**
 * Phase 11: Improvement Suggestions
 * 
 * Analyzes Phase 10 scoring issues and generates concrete, actionable improvement patches.
 * Classifies issues by fixability and respects Phase 10 structural invariants.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { Phase10Score } from './Phase10_Score';
import { SyllabusContext } from '@/lib/syllabus/syllabusRAG';
import { preprocessToValidJson, safeJsonParse } from '../utils';
import { debugLogger } from '../debugLogger';

export interface PatchOperation {
  op: 'replaceSubstring' | 'append' | 'prepend' | 'replace';
  path: string;  // JSON Pointer
  find?: string;  // For replaceSubstring
  from?: string;  // For replace (old value for context)
  value: string;  // New value
}

export interface FixPlan {
  issueId: string;
  targets: string[];  // JSON Pointers affected
  instructions: string;
  patches: PatchOperation[];
}

export interface BlockedIssue {
  issueId: string;
  reason: string;
  policyConflict: string;
}

export interface Phase11Suggestions {
  lessonId: string;
  fixablePlans: FixPlan[];
  blockedIssues: BlockedIssue[];
  regenerationNeeded: boolean;
}

export class Phase11_Suggest extends PhasePromptBuilder {
  public lastPrompts: { system: string; user: string } = { system: '', user: '' };
  public lastRawResponse: string = '';
  
  getPhaseName(): string {
    return 'Phase 11: Improvement Suggestions';
  }
  
  /**
   * Generate fix plans from Phase 10 scoring issues
   */
  async generateSuggestions(
    originalLesson: Lesson,
    phase10Score: Phase10Score,
    syllabusContext: SyllabusContext | null,
    generateFn: Function
  ): Promise<Phase11Suggestions> {
    const stopTimer = debugLogger.startTimer('Phase 11: Improvement Suggestions');
    
    console.log(`\n🔧 [Phase11_Suggest] Generating fix plans for lesson ${originalLesson.id}...`);
    console.log(`   - Issues to analyze: ${phase10Score.issues.length}`);
    
    debugLogger.phaseHeader('Phase 11: Improvement Suggestions', originalLesson.id);
    
    // Verbose: Log input issues
    debugLogger.logInput('Input', {
      'Lesson ID': originalLesson.id,
      'Block Count': originalLesson.blocks.length,
      'Phase 10 Score': `${phase10Score.total}/100 (${phase10Score.grade})`,
      'Issues': phase10Score.issues.length,
      'Syllabus Context': syllabusContext ? `Unit ${syllabusContext.unit} - ${syllabusContext.loTitle}` : '(none)'
    });
    
    // Verbose: Log all issues with details
    if (debugLogger.isEnabled()) {
      console.log(`\n📥 Input Issues (${phase10Score.issues.length}):`);
      phase10Score.issues.forEach((issue, idx) => {
        console.log(`\n  ${idx + 1}. ${issue.id} [${issue.category}]`);
        console.log(`     Paths: ${issue.jsonPointers.join(', ')}`);
        console.log(`     Problem: ${issue.problem}`);
        const excerpt = issue.excerpt.substring(0, 80);
        const ellipsis = issue.excerpt.length > 80 ? '...' : '';
        console.log(`     Excerpt: "${excerpt}${ellipsis}"`);
      });
    }
    
    // Build prompts
    debugLogger.logStep('\n🔨 Building fix planning prompts...');
    const input = { originalLesson, phase10Score, syllabusContext };
    const prompts = this.getPrompts(input);
    
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    // Verbose: Log prompts
    debugLogger.logPrompt('system', prompts.systemPrompt);
    debugLogger.logPrompt('user', prompts.userPrompt);
    
    // Call LLM for planning
    const { getPhase10Model } = await import('@/lib/config/geminiConfig');
    const phase10Model = getPhase10Model();
    
    console.log(`🔧 [Phase11_Suggest] Calling LLM for fix planning...`);
    debugLogger.logLLMCall(phase10Model);

    if (process.env.DEBUG_PHASE10 === 'true') {
      console.log('\n\n>>> ENTERING PHASE 11: Improvement Suggestions - LLM CALL <<<\n');
    }

    const llmStartTime = Date.now();
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'phase',
        2,       // maxRetries
        false,   // attemptHigherLimit
        12000,   // tokenLimit - planning needs space for detailed patches
        phase10Model
      );
      
      const llmDuration = Date.now() - llmStartTime;
      this.lastRawResponse = response;
      
      // Verbose: Log LLM response
      debugLogger.logLLMResponse(response, llmDuration);
      
      // Parse response
      console.log(`🔧 [Phase11_Suggest] Parsing suggestions (${response.length} chars)...`);
      debugLogger.logStep('\n🔍 Parsing suggestions...');
      
      const suggestions = this.parseSuggestionsResponse(response, originalLesson.id);
      
      console.log(`✅ [Phase11_Suggest] Generated suggestions:`);
      console.log(`   - Fixable plans: ${suggestions.fixablePlans.length}`);
      console.log(`   - Blocked issues: ${suggestions.blockedIssues.length}`);
      console.log(`   - Regeneration needed: ${suggestions.regenerationNeeded}`);
      
      // Verbose: Log detailed suggestions
      if (debugLogger.isEnabled()) {
        console.log(`\n✅ Fixable Plans (${suggestions.fixablePlans.length}):`);
        suggestions.fixablePlans.forEach((plan, idx) => {
          console.log(`\n  Plan ${idx + 1}: ${plan.issueId}`);
          console.log(`    Targets: ${plan.targets.join(', ')}`);
          console.log(`    Instructions: ${plan.instructions}`);
          console.log(`    Patches: ${plan.patches.length}`);
          plan.patches.forEach((patch, pIdx) => {
            console.log(`      ${pIdx + 1}. ${patch.op} at ${patch.path}`);
            if (patch.find) {
              const find = patch.find.substring(0, 60);
              const ellipsis = patch.find.length > 60 ? '...' : '';
              console.log(`         Find: "${find}${ellipsis}"`);
            }
            const valueStr = String(patch.value);
            const val = valueStr.substring(0, 60);
            const ellipsis = valueStr.length > 60 ? '...' : '';
            console.log(`         Value: "${val}${ellipsis}"`);
          });
        });
        
        if (suggestions.blockedIssues.length > 0) {
          console.log(`\n❌ Blocked Issues (${suggestions.blockedIssues.length}):`);
          suggestions.blockedIssues.forEach((blocked, idx) => {
            console.log(`  ${idx + 1}. ${blocked.issueId}`);
            console.log(`     Reason: ${blocked.reason}`);
            console.log(`     Policy Conflict: ${blocked.policyConflict}`);
          });
        }
        
        if (suggestions.regenerationNeeded) {
          debugLogger.logWarning('Regeneration needed for some issues');
        }
      }
      
      stopTimer();
      return suggestions;
      
    } catch (error) {
      console.error(`❌ [Phase11_Suggest] Error during planning:`, error);
      debugLogger.logError(`Error during planning: ${error}`);
      stopTimer();
      throw error;
    }
  }
  
  /**
   * Parse LLM suggestions response
   */
  private parseSuggestionsResponse(response: string, lessonId: string): Phase11Suggestions {
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
        throw new Error(`Failed to parse suggestions response: ${parsed.error || 'Unknown error'}`);
      }
      
      const data = parsed.data as any;
      
      // Validate required fields
      if (!Array.isArray(data.fixablePlans)) {
        throw new Error('Suggestions response missing required field: fixablePlans array');
      }
      if (!Array.isArray(data.blockedIssues)) {
        throw new Error('Suggestions response missing required field: blockedIssues array');
      }
      if (typeof data.regenerationNeeded !== 'boolean') {
        throw new Error('Suggestions response missing required field: regenerationNeeded');
      }
      
      return {
        lessonId,
        fixablePlans: data.fixablePlans,
        blockedIssues: data.blockedIssues,
        regenerationNeeded: data.regenerationNeeded,
      };
      
    } catch (error) {
      console.error(`❌ [Phase11_Suggest] Exception during parsing:`, error);
      throw error;
    }
  }
  
  /**
   * Build system prompt for fix planning
   */
  protected buildSystemPrompt(input: any): string {
    return `You are an expert lesson improver for City & Guilds technical and vocational training.

GOAL: Generate concrete, actionable fix patches for pedagogical issues identified in Phase 10 scoring.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Keep fixes transferable across technical subjects.

PEDAGOGICAL TIGHTENING PRIORITIES:
- Add concrete anchors after formal definitions when missing.
- Add micro-scenarios for quantity/unit/comparison concepts when missing.
- Raise early cognitive demand from recall to reasoning where missing.
- Tighten technical precision (simplify without distortion).

PHASE 10 INVARIANTS (CRITICAL - CANNOT VIOLATE):
- Cannot add blocks
- Cannot remove blocks
- Cannot reorder blocks
- Cannot change block.id, block.type, or block.order
- Cannot change answerType field
- Block count must remain EXACTLY the same

ALLOWED OPERATIONS:
- Edit content within existing blocks
- Modify text fields: content, questionText, title, description, hints, expectedAnswer
- Add/edit/remove items in arrays WITHIN existing blocks (e.g., add vocab terms, add questions)

FIXABILITY CLASSIFICATION:

1. "llm_editable" - Content changes within existing fields:
   - Improve clarity of explanations
   - Enhance question wording
   - Add teaching context or examples (within existing explanation blocks)
   - Improve hint quality
   - Strengthen expectedAnswer gradeability
   - Add missing explanations (within existing blocks)

2. "blocked_by_policy" - Conflicts with Phase 10 constraints:
   - Requires answerType change (STRICTLY FORBIDDEN)
   - Requires structural changes (add/remove/reorder blocks)
   - Note the specific policy conflict

3. "requires_regeneration" - Needs fundamental restructuring:
   - Requires adding/removing entire blocks
   - Needs reordering blocks
   - Fundamental content flow restructuring

PATCH OPERATIONS:

You can use these operations:

1. "replaceSubstring": Find and replace text within a field
   { "op": "replaceSubstring", "path": "/blocks/3/content/content", "find": "old text", "value": "new text" }

2. "append": Add text to end of a field
   { "op": "append", "path": "/blocks/3/content/hints/0", "value": " Additional hint text." }

3. "prepend": Add text to start of a field
   { "op": "prepend", "path": "/blocks/4/content/explanation", "value": "### Key Concept\\n\\n" }

4. "replace": Replace entire field value (use sparingly)
   { "op": "replace", "path": "/blocks/5/content/expectedAnswer", "from": "[old value]", "value": ["new", "answer", "array"] }

OUTPUT FORMAT (JSON only):
{
  "fixablePlans": [
    {
      "issueId": "ISSUE-1",
      "targets": ["/blocks/3/content/content"],
      "instructions": "Add a clear definition of the key concept before a question assesses it.",
      "patches": [
        {
          "op": "append",
          "path": "/blocks/3/content/content",
          "value": "\\n\\n**Key Concept:** The measured value describes how much output is produced per unit input. Compare two cases to decide which one is more efficient."
        }
      ]
    }
  ],
  "blockedIssues": [
    {
      "issueId": "ISSUE-7",
      "reason": "Question requires long-text answer but answerType is short-text",
      "policyConflict": "Cannot change answerType (Phase 10 invariant)"
    }
  ],
  "regenerationNeeded": false
}

CRITICAL RULES:
- One fix plan per fixable issue
- Use JSON Pointer format for paths (e.g., "/blocks/3/content/questionText")
- Be specific in instructions - explain WHAT to add/change and WHY
- For blocked issues, clearly state the policy conflict
- Include patches for all llm_editable issues
- Set regenerationNeeded=true if any requires_regeneration issues exist

${this.getJsonOutputInstructions()}`;
  }
  
  /**
   * Build user prompt with issues to fix
   */
  protected buildUserPrompt(input: any): string {
    const { originalLesson, phase10Score, syllabusContext } = input;
    
    // Format issues from Phase 10
    const issuesText = phase10Score.issues.map((issue: any, idx: number) => {
      return `ISSUE ${idx + 1}: ${issue.id}
  Category: ${issue.category}
  Problem: ${issue.problem}
  Why It Matters: ${issue.whyItMatters}
  Affected Paths: ${issue.jsonPointers.join(', ')}
  Excerpt: "${issue.excerpt}"
  Alignment Gap: ${issue.alignmentGap || 'N/A'}`;
    }).join('\n\n');
    
    // Lesson structure summary
    const blockSummary = originalLesson.blocks.map((b: any, idx: number) => 
      `  ${idx}: ${b.type} (id: ${b.id})`
    ).join('\n');
    
    // Syllabus context if available
    const syllabusText = syllabusContext ? `
SYLLABUS CONTEXT:
Unit: ${syllabusContext.unit} - ${syllabusContext.unitTitle}
Learning Outcome: ${syllabusContext.learningOutcome} - ${syllabusContext.loTitle}
Assessment Criteria:
${syllabusContext.assessmentCriteria.map((ac, i) => `  ${i + 1}. ${ac}`).join('\n')}
` : 'SYLLABUS CONTEXT: Not available';
    
    return `CREATE FIX PLANS FOR THESE PEDAGOGICAL ISSUES.

${syllabusText}

LESSON METADATA:
- ID: ${originalLesson.id}
- Title: ${originalLesson.title}
- Block Count: ${originalLesson.blocks.length} (MUST NOT CHANGE)

BLOCK STRUCTURE (IMMUTABLE):
${blockSummary}

PHASE 10 SCORING ISSUES:
${issuesText}

TASK:
For each issue above, either:
1. Create a fix plan with patches (if llm_editable)
2. Mark as blocked with policy conflict (if blocked_by_policy)
3. Mark as requiring regeneration (if requires_regeneration)

Remember:
- Phase 10 CANNOT add/remove/reorder blocks
- Phase 10 CANNOT change answerType
- Phase 10 CAN edit content within blocks
- Be explicit about what's fixable vs. blocked

Return ONLY the JSON suggestions object. No markdown, no additional text.`;
  }
}


