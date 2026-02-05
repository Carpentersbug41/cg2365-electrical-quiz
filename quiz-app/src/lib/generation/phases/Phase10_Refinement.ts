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
  path: string;           // JSON path (e.g., "blocks[8].content.questions[3]")
  issue: string;          // Description of what's wrong
  suggestion: string;     // What to fix
  oldValue: any;          // Original value
  newValue: any;          // Fixed value
  pointsRecovered: number;// Estimated points recovered
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
    path: string;
    newValue: any;
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
        allIssues.push({
          section: detail.section,
          issue,
          suggestion: detail.suggestions[idx] || 'Fix this issue',
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
    
    originalScore.details.forEach((origDetail, idx) => {
      const refDetail = refinedScore.details[idx];
      const changed = origDetail.score !== refDetail.score ? '✓ CHANGED' : '';
      
      console.log(`   ${origDetail.section}: ${origDetail.score}/${origDetail.maxScore} → ${refDetail.score}/${refDetail.maxScore} ${changed}`);
      
      if (origDetail.score !== refDetail.score) {
        console.log(`      Issues before: ${origDetail.issues.length}`);
        console.log(`      Issues after: ${refDetail.issues.length}`);
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
    return llmPatches.patches.map((llmPatch, idx) => {
      const relatedIssue = issues[idx] || issues[0];
      
      return {
        path: llmPatch.path,
        issue: relatedIssue.issue,
        suggestion: relatedIssue.suggestion,
        oldValue: this.getValueAtPath(originalLesson, llmPatch.path),
        newValue: llmPatch.newValue,
        pointsRecovered: relatedIssue.pointsLost
      };
    });
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
        this.setValueAtPath(cloned, patch.path, patch.newValue);
        const newValue = this.getValueAtPath(cloned, patch.path);
        
        console.log(`   ✓ ${patch.path}`);
        console.log(`      Old: "${oldValue}"`);
        console.log(`      New: "${newValue}"`);
        console.log(`      Reason: ${patch.issue}`);
        console.log(`      Expected improvement: +${patch.pointsRecovered} points`);
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
1. Each suggestion contains the EXACT change to make (e.g., "Change X from 'old' to 'new'")
2. Implement the suggestion EXACTLY as written - no creative interpretation
3. Return patches in this exact format:
   {
     "patches": [
       {
         "path": "blocks[8].content.questions[3].questionText",
         "newValue": "[exact value from suggestion]",
         "reason": "[brief reason]"
       }
     ]
   }
4. Maximum 10 patches total
5. Each patch must directly address ONE rubric issue
6. Do NOT change any other fields
7. Do NOT make improvements beyond what the suggestion specifies

EXAMPLE INPUT:
Issue: "Question ID 'blocks[4].content.questions[0].id' includes lesson prefix"
Suggestion: "Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'"

EXAMPLE CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[4].content.questions[0].id",
      "newValue": "C1-L1-A",
      "reason": "Removed lesson prefix per suggestion"
    }
  ]
}

ANOTHER EXAMPLE:
Issue: "expectedAnswer 'approximately 20A' is too vague"
Suggestion: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[6].content.questions[2].expectedAnswer",
      "newValue": "20A ± 2A",
      "reason": "Added specific tolerance per suggestion"
    }
  ]
}

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
    { "path": "...", "newValue": ..., "reason": "..." }
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
