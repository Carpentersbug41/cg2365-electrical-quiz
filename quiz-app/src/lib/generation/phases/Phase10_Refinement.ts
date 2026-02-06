/**
 * Phase 10: Auto-Refinement
 * Scores generated lessons and applies surgical JSON patches to fix issues when score < 93
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore, RubricDetail } from '../llmScoringService';

export interface RefinementInput {
  lesson: Lesson;
  rubricScore: RubricScore;
  maxFixes: number;  // Default: 10
}

export interface RefinementPatch {
  op: 'replace' | 'prepend' | 'append' | 'replaceSubstring';  // Patch operation type
  path: string;           // JSON Pointer format (e.g., "/blocks/8/content/questions/3")
  from?: unknown;         // Optional: original value for validation
  value: unknown;         // New value or text to append/prepend/replaceSubstring
  // For replaceSubstring only:
  find?: string;          // Substring to find (required for replaceSubstring)
  matchIndex?: number | 'all';  // Which occurrence to replace (default: 'all')
  reason?: string;        // Optional: audit trail describing the fix
  // Legacy fields for backward compatibility (internal use only)
  issue?: string;
  suggestion?: string;
  oldValue?: any;
  newValue?: any;
  pointsRecovered?: number;
}

export interface RefinementOutput {
  originalLesson: Lesson;
  refined: Lesson;
  patchesApplied: RefinementPatch[];
  originalScore: number;
  refinedScore: number;
  improvementSuccess: boolean;
}

interface IssueToFix {
  section: string;
  issue: string;
  suggestion: string;
  pointsLost: number;
  severity: number;
}

interface LLMPatchResponse {
  patches: Array<{
    op: 'replace' | 'prepend' | 'append' | 'replaceSubstring';
    path: string;
    value: any;
    find?: string;           // For replaceSubstring
    matchIndex?: number | 'all';  // For replaceSubstring
    reason: string;
  }>;
}

export class Phase10_Refinement extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 10: Auto-Refinement';
  }

  /**
   * Extract top issues and return input for LLM call
   */
  prepareRefinementInput(lesson: Lesson, rubricScore: RubricScore, maxFixes: number): {
    issues: IssueToFix[];
    lesson: Lesson;
  } {
    const topIssues = this.extractTopIssues(rubricScore, maxFixes);
    return { issues: topIssues, lesson };
  }

  /**
   * Extract top N issues from rubric, sorted by severity/points
   */
  private extractTopIssues(score: RubricScore, maxFixes: number): IssueToFix[] {
    const allIssues: IssueToFix[] = [];
    
    score.details.forEach(detail => {
      const pointsLost = detail.maxScore - detail.score;
      
      detail.issues.forEach((issue, idx) => {
        const suggestion = detail.suggestions[idx] || 'Fix this issue';
        
        // Skip structural suggestions that Phase 10 cannot handle
        if (this.isStructuralSuggestion(suggestion)) {
          console.log(`   ⊘ Skipping structural suggestion: ${suggestion.substring(0, 80)}...`);
          return; // Skip this issue
        }
        
        allIssues.push({
          section: detail.section,
          issue,
          suggestion,
          pointsLost,
          severity: this.calculateSeverity(detail, pointsLost)
        });
      });
    });
    
    // Sort by severity (higher = more important)
    return allIssues
      .sort((a, b) => b.severity - a.severity)
      .slice(0, maxFixes);
  }

  /**
   * Calculate severity score for prioritization
   */
  private calculateSeverity(detail: RubricDetail, pointsLost: number): number {
    // Base severity on points lost
    let severity = pointsLost;
    
    // Boost severity for schema/contract issues (critical)
    if (detail.section.startsWith('A')) {
      severity *= 2;
    }
    
    // Boost severity for safety issues
    if (detail.section.startsWith('F')) {
      severity *= 1.5;
    }
    
    return severity;
  }

  /**
   * Check if suggestion requires structural changes (adding/removing blocks)
   */
  private isStructuralSuggestion(suggestion: string): boolean {
    const structuralKeywords = [
      'insert a new block',
      'add a new block',
      'create a new block',
      'remove block',
      'delete block',
      'insert new block',
      'add new block',
      'create new block'
    ];
    
    const lowerSuggestion = suggestion.toLowerCase();
    return structuralKeywords.some(keyword => lowerSuggestion.includes(keyword));
  }

  /**
   * Log issues being targeted for debugging
   */
  logIssues(issues: IssueToFix[]): void {
    console.log('\n🎯 [Phase 10] Issues being targeted:');
    issues.forEach((issue, idx) => {
      console.log(`   ${idx + 1}. [${issue.section}] ${issue.issue}`);
      console.log(`      Suggestion: ${issue.suggestion}`);
      console.log(`      Points lost: ${issue.pointsLost}, Severity: ${issue.severity.toFixed(1)}`);
    });
    console.log('');
  }

  /**
   * Log patches being applied for debugging
   */
  logPatches(patches: RefinementPatch[]): void {
    console.log('\n📋 [Phase 10] Patches generated:');
    patches.forEach((patch, idx) => {
      console.log(`   ${idx + 1}. Path: ${patch.path}`);
      console.log(`      Old: ${JSON.stringify(patch.oldValue)}`);
      console.log(`      New: ${JSON.stringify(patch.newValue)}`);
      console.log(`      Reason: ${patch.issue}`);
    });
    console.log('');
  }

  /**
   * Log detailed score comparison for debugging
   */
  logScoreComparison(originalScore: RubricScore, refinedScore: RubricScore): void {
    console.log('\n📊 [Phase 10] Score comparison:');
    console.log(`   Overall: ${originalScore.total}/100 → ${refinedScore.total}/100`);
    console.log('\n   Section breakdown:');
    
    // Create a map of refined sections for safe lookup
    const refinedMap = new Map(refinedScore.details.map(d => [d.section, d]));
    
    originalScore.details.forEach((origDetail) => {
      const refDetail = refinedMap.get(origDetail.section);
      
      if (!refDetail) {
        console.log(`   ${origDetail.section}: ${origDetail.score}/${origDetail.maxScore} → [section removed]`);
        return;
      }
      
      const changed = origDetail.score !== refDetail.score ? '✓ CHANGED' : '';
      console.log(`   ${origDetail.section}: ${origDetail.score}/${origDetail.maxScore} → ${refDetail.score}/${refDetail.maxScore} ${changed}`);
      
      if (origDetail.score !== refDetail.score) {
        console.log(`      Issues before: ${origDetail.issues.length}`);
        console.log(`      Issues after: ${refDetail.issues.length}`);
      }
    });
    
    // Log any new sections in refined score
    const originalSections = new Set(originalScore.details.map(d => d.section));
    refinedScore.details.forEach((refDetail) => {
      if (!originalSections.has(refDetail.section)) {
        console.log(`   ${refDetail.section}: [new section] → ${refDetail.score}/${refDetail.maxScore}`);
      }
    });
    
    console.log('');
  }

  /**
   * Convert LLM patches response to RefinementPatches
   */
  convertLLMPatches(
    llmPatches: LLMPatchResponse,
    issues: IssueToFix[],
    originalLesson: Lesson
  ): RefinementPatch[] {
    const validPatches: RefinementPatch[] = [];
    
    llmPatches.patches.forEach((llmPatch, idx) => {
      // CRITICAL: Block answerType changes - these break grading contract
      if (llmPatch.path.endsWith('.answerType')) {
        console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} - answerType changes are NOT allowed in Phase 10`);
        console.warn(`   ⊘ Reason: Changing answerType requires corresponding grading contract/rubric changes`);
        return; // Skip this patch
      }
      
      // Check if patch references a non-existent block
      const blockMatch = llmPatch.path.match(/blocks\[(\d+)\]/);
      if (blockMatch) {
        const blockIndex = parseInt(blockMatch[1], 10);
        if (blockIndex >= originalLesson.blocks.length) {
          console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} references non-existent block[${blockIndex}]`);
          return; // Skip this patch
        }
      }
      
      // Validate expectedAnswer is array
      if (llmPatch.path.endsWith('.expectedAnswer')) {
        if (!Array.isArray(llmPatch.value)) {
          console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} value must be an array, got ${typeof llmPatch.value}`);
          return; // Skip this patch
        }
      }
      
      const relatedIssue = issues[idx] || issues[0];
      const oldValue = this.getValueAtPath(originalLesson, llmPatch.path);
      
      validPatches.push({
        op: llmPatch.op || 'replace',  // Default to replace if not specified
        path: llmPatch.path,
        from: oldValue,
        value: llmPatch.value,
        find: llmPatch.find,           // For replaceSubstring
        matchIndex: llmPatch.matchIndex, // For replaceSubstring
        reason: llmPatch.reason || relatedIssue.issue,
        // Legacy fields for internal use
        issue: relatedIssue.issue,
        suggestion: relatedIssue.suggestion,
        oldValue: oldValue,
        newValue: llmPatch.value,
        pointsRecovered: relatedIssue.pointsLost
      });
    });
    
    return validPatches;
  }

  /**
   * Get value at JSON path
   */
  private getValueAtPath(obj: any, path: string): any {
    try {
      const parts = path.split(/[\.\[\]]/).filter(p => p);
      let current = obj;
      
      for (const part of parts) {
        if (current === null || current === undefined) {
          return undefined;
        }
        current = current[part];
      }
      
      return current;
    } catch {
      return undefined;
    }
  }

  /**
   * Set value at JSON path
   */
  private setValueAtPath(obj: any, path: string, value: any): void {
    const parts = path.split(/[\.\[\]]/).filter(p => p);
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        // Determine if next part is numeric (array) or not (object)
        const nextPart = parts[i + 1];
        current[part] = /^\d+$/.test(nextPart) ? [] : {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Apply patches to lesson (deep clone first)
   */
  applyPatches(lesson: Lesson, patches: RefinementPatch[]): Lesson {
    const cloned = JSON.parse(JSON.stringify(lesson));
    
    console.log(`\n🔧 [Phase 10] Applying ${patches.length} patches to cloned lesson...`);
    console.log(`🔧 [Phase 10] Original lesson blocks: ${lesson.blocks.length}`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const patch of patches) {
      try {
        const oldValue = this.getValueAtPath(cloned, patch.path);
        let finalValue = patch.value;
        
        // Handle prepend/append operations for string values
        if (patch.op === 'prepend' && typeof oldValue === 'string') {
          finalValue = patch.value + oldValue;
        } else if (patch.op === 'append' && typeof oldValue === 'string') {
          finalValue = oldValue + patch.value;
        } else if (patch.op === 'replaceSubstring') {
          // Handle replaceSubstring operation
          if (typeof oldValue !== 'string') {
            console.warn(`   ⊘ Cannot replaceSubstring on non-string field at ${patch.path}`);
            failCount++;
            continue;
          }
          if (!patch.find) {
            console.warn(`   ⊘ replaceSubstring requires 'find' field at ${patch.path}`);
            failCount++;
            continue;
          }
          
          const findStr = patch.find as string;
          const replaceStr = patch.value as string;
          
          if (!oldValue.includes(findStr)) {
            console.warn(`   ⊘ Cannot find '${findStr.substring(0, 50)}...' in field at ${patch.path}`);
            failCount++;
            continue;
          }
          
          // Apply replacement based on matchIndex
          if (patch.matchIndex === 'all' || patch.matchIndex === undefined) {
            // Replace all occurrences
            finalValue = oldValue.replaceAll(findStr, replaceStr);
          } else if (typeof patch.matchIndex === 'number') {
            // Replace nth occurrence (0-indexed)
            let count = 0;
            const escapedFind = this.escapeRegex(findStr);
            finalValue = oldValue.replace(new RegExp(escapedFind, 'g'), (match) => {
              return count++ === patch.matchIndex ? replaceStr : match;
            });
          } else {
            // Default: replace all
            finalValue = oldValue.replaceAll(findStr, replaceStr);
          }
        }
        // For 'replace' operation or non-string values, just use value as-is
        
        this.setValueAtPath(cloned, patch.path, finalValue);
        const newValue = this.getValueAtPath(cloned, patch.path);
        
        console.log(`   ✓ ${patch.path} [${patch.op}]`);
        if (patch.op === 'replaceSubstring') {
          console.log(`      Find: "${patch.find}"`);
          console.log(`      Replace with: "${patch.value}"`);
        } else {
          console.log(`      Old: "${typeof oldValue === 'string' && oldValue.length > 100 ? oldValue.substring(0, 100) + '...' : oldValue}"`);
          console.log(`      New: "${typeof newValue === 'string' && newValue.length > 100 ? newValue.substring(0, 100) + '...' : newValue}"`);
        }
        console.log(`      Reason: ${patch.reason || patch.issue}`);
        console.log(`      Expected improvement: +${patch.pointsRecovered || 0} points`);
        successCount++;
      } catch (e) {
        console.warn(`   ✗ FAILED at ${patch.path}:`, e);
        failCount++;
      }
    }
    
    console.log(`\n🔧 [Phase 10] Patch Application Summary:`);
    console.log(`   Successful: ${successCount}/${patches.length}`);
    console.log(`   Failed: ${failCount}/${patches.length}`);
    console.log(`   Cloned lesson blocks: ${cloned.blocks.length}`);
    console.log('');
    
    return cloned;
  }

  /**
   * Audit all IDs in lesson for debugging
   */
  auditAllIDs(lesson: Lesson): void {
    console.log('\n🔍 [Phase 10] ID Audit after patching:');
    
    // Block IDs
    console.log('   Block IDs:');
    lesson.blocks.forEach(b => {
      console.log(`      ${b.id} (${b.type}, order ${b.order})`);
    });
    
    // Question IDs in all practice blocks
    const practiceBlocks = lesson.blocks.filter(b => b.type === 'practice');
    console.log(`\n   Question IDs in ${practiceBlocks.length} practice blocks:`);
    practiceBlocks.forEach(block => {
      const questions = (block.content as any).questions || [];
      console.log(`      Block ${block.id}:`);
      questions.forEach((q: any) => {
        const valid = /^(C\d-L[12](-[ABC])?|INT-\d+|P\d+|SR-\d+)$/.test(q.id);
        console.log(`         ${q.id} ${valid ? '✓' : '✗ INVALID'}`);
      });
    });
    console.log('');
  }

  /**
   * Validate patched lesson
   */
  validatePatches(original: Lesson, patched: Lesson): boolean {
    // 1. Must have same basic structure
    if (!patched.id || !patched.title || !patched.blocks) {
      console.warn('[Refinement] Missing required fields after patching');
      return false;
    }
    
    // 2. Block count should be unchanged
    if (original.blocks.length !== patched.blocks.length) {
      console.warn('[Refinement] Block count changed after patching');
      return false;
    }
    
    // 3. Block types validation - allow changes if new type is valid
    const validBlockTypes = [
      'outcomes', 'vocab', 'diagram', 'explanation', 
      'worked-example', 'guided-practice', 'practice', 
      'spaced-review', 'microbreak'
    ];
    
    for (let i = 0; i < original.blocks.length; i++) {
      const originalType = original.blocks[i].type;
      const patchedType = patched.blocks[i].type;
      
      if (originalType !== patchedType) {
        // Type changed - validate the NEW type is valid
        if (!validBlockTypes.includes(patchedType)) {
          console.warn(`[Refinement] Block ${i} type changed to INVALID type: "${patchedType}"`);
          return false;
        }
        console.log(`[Refinement] Block ${i} type corrected: "${originalType}" → "${patchedType}"`);
      }
    }
    
    // 4. Validate explanation structure (Phase 3 compliance)
    const explanationBlocks = patched.blocks.filter(b => b.type === 'explanation');
    for (const block of explanationBlocks) {
      const content = block.content?.content;
      if (typeof content !== 'string') continue;
      
      const requiredHeadings = [
        '### In this lesson',
        '**What this is**',
        '**Why it matters**',
        '**Key facts / rules**',
        '**Common mistakes**',
        '**Key Points**',
        '**Quick recap**',
        '### Coming Up Next'
      ];
      
      const missingHeadings = requiredHeadings.filter(h => !content.includes(h));
      if (missingHeadings.length > 2) { // Allow some flexibility (up to 2 missing)
        console.warn(`[Refinement] Explanation block ${block.id} missing ${missingHeadings.length} required Phase 3 headings`);
        console.warn(`[Refinement] Missing: ${missingHeadings.join(', ')}`);
        console.warn(`[Refinement] This indicates patches may have destroyed the explanation structure`);
        return false;
      } else if (missingHeadings.length > 0) {
        console.log(`[Refinement] Note: Explanation block ${block.id} missing ${missingHeadings.length} optional headings: ${missingHeadings.join(', ')}`);
      }
    }
    
    return true;
  }

  protected buildSystemPrompt(): string {
    return `You are a surgical JSON editor for educational content.

Your ONLY job: Implement the exact fixes specified in the suggestions.

CRITICAL OUTPUT FORMAT:
- Your response MUST start with the opening brace: {
- Do NOT write any explanation before the JSON
- Do NOT write "Here's the fix:" or similar preamble
- Do NOT write reasoning about the changes
- Start typing JSON immediately

STRICT RULES:
1. Each suggestion contains the EXACT change to make (e.g., "Change X from 'old' to 'new'", "Prepend to X:", "Append to X:")
2. Implement the suggestion EXACTLY as written - no creative interpretation
3. Return patches in this exact format:
   {
     "patches": [
       {
         "op": "replace",  // Use "replace", "prepend", or "append"
         "path": "blocks[8].content.questions[3].questionText",
         "value": "[exact value from suggestion]",
         "reason": "[brief reason]"
       }
     ]
   }
4. OPERATION FIELD RULES:
   - Use "replace" for FULL FIELD replacement (provide entire new value)
   - Use "replaceSubstring" for in-string edits (provide find + value)
     * find: the exact substring to locate
     * value: what to replace it with
     * Default behavior: replaces all occurrences
   - Use "prepend" for adding to beginning
   - Use "append" for adding to end
5. Maximum 10 patches total
6. Each patch must directly address ONE rubric issue
7. Do NOT change any other fields
8. Do NOT make improvements beyond what the suggestion specifies

EXPECTEDANSWER ARRAY ENFORCEMENT (CRITICAL):
- If path ends with ".expectedAnswer", value MUST be an array
- NEVER patch expectedAnswer with a string value
- Examples:
  * WRONG: "value": "correct answer"
  * RIGHT: "value": ["correct answer", "acceptable variant"]
  * WRONG: "value": "230V"
  * RIGHT: "value": ["230V", "230"]
- If scorer suggestion shows string format, convert to array format in your patch

EXAMPLE INPUT:
Issue: "Question ID 'blocks[4].content.questions[0].id' includes lesson prefix"
Suggestion: "Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'"

EXAMPLE CORRECT OUTPUT:
{
  "patches": [
    {
      "op": "replace",
      "path": "blocks[4].content.questions[0].id",
      "value": "C1-L1-A",
      "reason": "Removed lesson prefix per suggestion"
    }
  ]
}

ANOTHER EXAMPLE (expectedAnswer - MUST BE ARRAY):
Issue: "expectedAnswer ['approximately 20A'] is too vague"
Suggestion: "Change blocks[6].content.questions[2].expectedAnswer from ['approximately 20A'] to ['20A', '20.0A']"

CORRECT OUTPUT:
{
  "patches": [
    {
      "op": "replace",
      "path": "blocks[6].content.questions[2].expectedAnswer",
      "value": ["20A", "20.0A"],
      "reason": "Added specific variants per suggestion (ARRAY FORMAT)"
    }
  ]
}

CRITICAL: expectedAnswer MUST ALWAYS BE AN ARRAY:
- WRONG: "value": "ring circuit"
- RIGHT: "value": ["ring circuit", "ring final circuit"]
- Even single values must be arrays: ["answer"]

PREPEND EXAMPLE:
Issue: "blocks[3].content.content missing lesson intro"
Suggestion: "Prepend to blocks[3].content.content: '### In this lesson\\n\\nYou will learn about circuit protection...\\n\\n'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "op": "prepend",
      "path": "blocks[3].content.content",
      "value": "### In this lesson\\n\\nYou will learn about circuit protection...\\n\\n",
      "reason": "Added lesson intro per suggestion"
    }
  ]
}

APPEND EXAMPLE:
Issue: "blocks[5].content.content missing key points summary"
Suggestion: "Append to blocks[5].content.content: '\\n\\n### Key Points\\n1. Always check voltage ratings\\n2. Use appropriate cable sizes'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "op": "append",
      "path": "blocks[5].content.content",
      "value": "\\n\\n### Key Points\\n1. Always check voltage ratings\\n2. Use appropriate cable sizes",
      "reason": "Added key points summary per suggestion"
    }
  ]
}

REPLACESUBSTRING EXAMPLE (CRITICAL - USE THIS FOR IN-STRING EDITS):
Issue: "blocks[3].content.content mentions 'looping and linear' but should say 'ring final and radial'"
Suggestion: "In blocks[3].content.content, change 'looping and linear wiring methods' to 'ring final and radial topologies'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "op": "replaceSubstring",
      "path": "blocks[3].content.content",
      "find": "looping and linear wiring methods",
      "value": "ring final and radial topologies",
      "reason": "Updated terminology per suggestion"
    }
  ]
}

WRONG OUTPUT (DO NOT DO THIS):
{
  "patches": [
    {
      "op": "replace",
      "path": "blocks[3].content.content",
      "value": "### Coming Up Next\\nWe will look closer at ring final and radial topologies."
    }
  ]
}
⚠️ This wipes the entire field! Use replaceSubstring instead!

EXAMPLE WRONG OUTPUT (DO NOT DO THIS):
"Actually, looking at the IDs, I think we should change them..."
"Let me explain the fix first..."
"Here's what I would do..."

PATH FORMAT:
- Use dot notation for objects: "learningOutcomes[0]"
- Use bracket notation for arrays: "blocks[8].content.questions[3]"
- Combine: "blocks[8].content.questions[3].questionText"

FORBIDDEN:
- Rewriting entire sections
- Adding fields not mentioned in issues
- Changing multiple related fields without explicit instruction
- Creative improvements beyond the specific issues
- Changing block structure or order
- Adding new blocks (use "blocks[N]" path only for existing blocks)
- Removing blocks
- Changing block count in any way

CRITICAL: If a suggestion asks to "insert" or "add" a block, SKIP that patch.
Only patch existing blocks and their fields.

FOCUS: You have a maximum of 10 patches. Use them wisely on the most impactful fixes.

CRITICAL: Your first character MUST be '{'. No explanation. No preamble. JSON only.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: any): string {
    const { lesson, issues } = input as { lesson: Lesson; issues: IssueToFix[] };
    
    const issuesList = issues.map((issue, idx) => 
      `${idx + 1}. [${issue.section}] ${issue.issue}
   EXACT FIX: ${issue.suggestion}
   Impact: ${issue.pointsLost} points`
    ).join('\n\n');
    
    return `Implement the EXACT fixes specified below for this lesson.

LESSON ID: ${lesson.id}
CURRENT SCORE: Needs improvement

ISSUES TO FIX (ranked by severity):
${issuesList}

LESSON JSON EXCERPT (relevant sections):
${this.extractRelevantSections(lesson, issues)}

Generate patches to fix ONLY these specific issues. Return JSON in the format specified.

RESPONSE FORMAT (MANDATORY):
{
  "patches": [
    { "op": "replace", "path": "...", "value": ..., "reason": "..." }
  ]
}

Start your response with '{' immediately. No explanations.`;
  }

  /**
   * Extract relevant sections of lesson for context
   */
  private extractRelevantSections(lesson: Lesson, issues: IssueToFix[]): string {
    const sections: string[] = [];
    
    // Always include learning outcomes
    sections.push(`Learning Outcomes: ${JSON.stringify(lesson.learningOutcomes, null, 2)}`);
    
    // Include blocks summary
    sections.push(`\nBlocks (${lesson.blocks.length} total):`);
    lesson.blocks.forEach((block, idx) => {
      sections.push(`  [${idx}] ${block.type} (order: ${block.order})`);
    });
    
    // Include specific blocks mentioned in issues
    issues.forEach(issue => {
      if (issue.issue.includes('question') || issue.issue.includes('practice')) {
        const practiceBlock = lesson.blocks.find(b => b.type === 'practice');
        if (practiceBlock && !sections.some(s => s.includes('"type": "practice"'))) {
          sections.push(`\nPractice Block: ${JSON.stringify(practiceBlock, null, 2).substring(0, 500)}...`);
        }
      }
    });
    
    return sections.join('\n');
  }
}
