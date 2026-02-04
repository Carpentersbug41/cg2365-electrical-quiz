/**
 * Phase 10: Auto-Refinement
 * Scores generated lessons and applies surgical JSON patches to fix issues when score < 93
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore, RubricDetail } from '../rubricScoringService';

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
    
    for (const patch of patches) {
      try {
        this.setValueAtPath(cloned, patch.path, patch.newValue);
      } catch (e) {
        console.warn(`[Refinement] Failed to apply patch at ${patch.path}:`, e);
      }
    }
    
    return cloned;
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
    
    // 3. Block types should match
    for (let i = 0; i < original.blocks.length; i++) {
      if (original.blocks[i].type !== patched.blocks[i].type) {
        console.warn(`[Refinement] Block type mismatch at index ${i}`);
        return false;
      }
    }
    
    return true;
  }

  protected buildSystemPrompt(): string {
    return `You are a surgical JSON editor for educational content.

Your ONLY job: Fix specific defects in a lesson JSON file.

CRITICAL OUTPUT FORMAT:
- Your response MUST start with the opening brace: {
- Do NOT write any explanation before the JSON
- Do NOT write "Here's the fix:" or similar preamble
- Do NOT write reasoning about the changes
- Start typing JSON immediately

STRICT RULES:
1. Fix ONLY the fields provided in the issue list
2. Return patches in this exact format:
   {
     "patches": [
       {
         "path": "blocks[8].content.questions[3].questionText",
         "newValue": "[corrected value]",
         "reason": "[why this fixes the issue]"
       }
     ]
   }
3. Maximum 10 patches total
4. Each patch must directly address ONE rubric issue
5. Do NOT change any other fields
6. Do NOT add new content beyond fixing the defect

EXAMPLE CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[2].content.checks[0].id",
      "newValue": "C1-L1-A",
      "reason": "Removed lesson prefix from check ID per schema"
    },
    {
      "path": "learningOutcomes[0]",
      "newValue": "Identify the purpose of a circuit breaker",
      "reason": "Changed 'Explain' to 'Identify' per constraint"
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

CRITICAL: Your first character MUST be '{'. No explanation. No preamble. JSON only.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: any): string {
    const { lesson, issues } = input as { lesson: Lesson; issues: IssueToFix[] };
    
    const issuesList = issues.map((issue, idx) => 
      `${idx + 1}. [${issue.section}] ${issue.issue}
   Suggestion: ${issue.suggestion}
   Points lost: ${issue.pointsLost}`
    ).join('\n\n');
    
    return `Fix the following issues in this lesson JSON.

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
