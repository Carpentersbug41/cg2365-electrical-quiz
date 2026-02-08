/**
 * Phase 10: Auto-Refinement (DEPRECATED)
 * 
 * This is the legacy patch-based approach.
 * The system now uses Phase10_Rewrite (v2 holistic rewrite) by default.
 * This stub exists only for backward compatibility with the "patch" strategy.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { RubricScore, RubricDetail } from '../llmScoringService';

export interface RefinementInput {
  lesson: Lesson;
  rubricScore: RubricScore;
  maxFixes: number;
}

export interface RefinementPatch {
  op: 'replace' | 'prepend' | 'append' | 'replaceSubstring';
  path: string;
  from?: unknown;
  value: unknown;
  find?: string;
  matchIndex?: number | 'all';
  reason?: string;
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

/**
 * DEPRECATED: Use Phase10_Rewrite instead
 * This class is maintained only for backward compatibility with the "patch" strategy
 */
export class Phase10_Refinement extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 10: Auto-Refinement (DEPRECATED)';
  }

  prepareRefinementInput(lesson: Lesson, rubricScore: RubricScore, maxFixes: number): {
    issues: IssueToFix[];
    lesson: Lesson;
  } {
    console.warn('⚠️  Phase10_Refinement is DEPRECATED. Use Phase10_Rewrite (rewrite strategy) instead.');
    const topIssues = this.extractTopIssues(rubricScore, maxFixes);
    return { issues: topIssues, lesson };
  }

  private extractTopIssues(score: RubricScore, maxFixes: number): IssueToFix[] {
    const allIssues: IssueToFix[] = [];
    
    score.details.forEach(detail => {
      const pointsLost = detail.maxScore - detail.score;
      
      detail.issues.forEach((issue, idx) => {
        const suggestion = detail.suggestions[idx] || 'Fix this issue';
        
        allIssues.push({
          section: detail.section,
          issue,
          suggestion,
          pointsLost,
          severity: pointsLost
        });
      });
    });
    
    return allIssues.sort((a, b) => b.severity - a.severity).slice(0, maxFixes);
  }

  logIssues(issues: IssueToFix[]): void {
    console.log('\n🎯 [Phase 10 DEPRECATED] Issues:');
    issues.forEach((issue, idx) => {
      console.log(`   ${idx + 1}. [${issue.section}] ${issue.issue}`);
    });
  }

  convertLLMPatches(llmPatches: any, issues: IssueToFix[], originalLesson: Lesson): RefinementPatch[] {
    console.warn('⚠️  Using deprecated patch strategy. Consider switching to rewrite strategy.');
    return [];
  }

  applyPatches(lesson: Lesson, patches: RefinementPatch[]): Lesson {
    console.warn('⚠️  Using deprecated patch strategy. Consider switching to rewrite strategy.');
    return lesson;
  }

  validatePatches(original: Lesson, patched: Lesson): boolean {
    return true;
  }

  auditAllIDs(lesson: Lesson): void {
    // No-op
  }

  logPatches(patches: RefinementPatch[]): void {
    console.log('\n📋 [Phase 10 DEPRECATED] Patches (deprecated path)');
  }

  logScoreComparison(originalScore: RubricScore, refinedScore: RubricScore): void {
    console.log(`\n📊 [Phase 10 DEPRECATED] Score: ${originalScore.total} → ${refinedScore.total}`);
  }

  protected buildSystemPrompt(): string {
    return 'DEPRECATED: Use Phase10_Rewrite instead';
  }

  protected buildUserPrompt(input: any): string {
    return 'DEPRECATED: Use Phase10_Rewrite instead';
  }
}
