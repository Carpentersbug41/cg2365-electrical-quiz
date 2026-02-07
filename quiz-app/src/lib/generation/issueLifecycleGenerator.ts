/**
 * Issue Lifecycle Generator
 * 
 * Generates issue lifecycle tracking from scoring, planning, and diff data.
 * Determines outcome for each issue: fixed / unmoved / worsened.
 */

import { RubricScore } from './llmScoringService';
import { FixPlan } from './phases/Phase10_Planner';
import { PointerDiff, PointerChange } from './pointerDiffGenerator';
import { extractPointersFromIssue, extractPointersByRubricSection, isParentPointer } from './pointerExtractor';
import { Lesson } from './types';

export interface IssueLifecycleItem {
  issueId: string;
  rubricRef: string;
  section: string;
  scoreBefore: number;
  maxScore: number;
  jsonPointers: string[];
  fixability: 'deterministic' | 'llm_editable' | 'blocked_by_policy' | 'requires_regeneration';
  reason?: string;
  plan: {
    strategy: string;
    targets: string[];
  } | null;
  appliedEdits: Array<{
    op: 'replace' | 'add' | 'remove';
    path: string;
    summary: string;
  }>;
  outcome: 'fixed' | 'unmoved' | 'worsened';
}

export interface IssueLifecycle {
  runId: string;
  lessonId: string;
  issues: IssueLifecycleItem[];
}

export interface IssueLifecycleInput {
  runId: string;
  lessonId: string;
  lesson: Lesson;
  scoreBeforeDetails: RubricScore['details'];
  plan?: FixPlan;
  pointerDiff: PointerDiff;
  scoreAfterDetails: RubricScore['details'];
}

/**
 * Generate issue lifecycle from Phase 10 run data
 */
export function generateIssueLifecycle(input: IssueLifecycleInput): IssueLifecycle {
  const issues: IssueLifecycleItem[] = [];
  
  // Process each issue from before score
  input.scoreBeforeDetails.forEach((detail, idx) => {
    // Generate stable issue ID
    const issueId = generateIssueId(detail, idx);
    const rubricRef = extractRubricRef(detail.section);
    
    // Get JSON pointers for this issue
    let jsonPointers = detail.jsonPointers || [];
    
    // Fallback: Extract pointers from issue text if not provided
    if (jsonPointers.length === 0) {
      jsonPointers = extractPointersFromIssue(detail.issues.join(' '), input.lesson);
    }
    
    // Fallback: Extract pointers by rubric section
    if (jsonPointers.length === 0) {
      jsonPointers = extractPointersByRubricSection(rubricRef, input.lesson);
    }
    
    // Find matching plan item
    const planItem = input.plan?.plan.find(p => 
      p.issueId === issueId || 
      p.rubricRef === rubricRef ||
      matchesIssueContext(p, detail)
    );
    
    // Determine fixability
    const fixability = planItem?.fixability || classifyFixability(detail);
    
    // Find applied edits from pointer diff
    const appliedEdits = findAppliedEdits(jsonPointers, input.pointerDiff.changes);
    
    // Determine outcome
    const outcome = determineOutcome(
      detail,
      input.scoreAfterDetails,
      appliedEdits.length > 0
    );
    
    issues.push({
      issueId,
      rubricRef,
      section: categorizeSectionType(detail.section),
      scoreBefore: detail.score,
      maxScore: detail.maxScore,
      jsonPointers,
      fixability,
      reason: planItem?.instructions || detail.issues.join(' '),
      plan: planItem ? {
        strategy: planItem.instructions,
        targets: planItem.targets
      } : null,
      appliedEdits,
      outcome
    });
  });
  
  return {
    runId: input.runId,
    lessonId: input.lessonId,
    issues
  };
}

/**
 * Generate stable issue ID from detail
 */
function generateIssueId(detail: any, index: number): string {
  // Extract category from section
  const section = detail.section.toLowerCase();
  
  // Try to extract meaningful identifier
  if (section.includes('beginner')) return `B${index + 1}.beginnerClarity`;
  if (section.includes('alignment')) return `C${index + 1}.alignment`;
  if (section.includes('question')) return `D${index + 1}.questions`;
  if (section.includes('marking')) return `E${index + 1}.marking`;
  if (section.includes('visual') || section.includes('diagram')) return `F${index + 1}.visual`;
  if (section.includes('schema')) return `A${index + 1}.schema`;
  
  // Fallback to generic ID
  return `ISSUE-${index + 1}`;
}

/**
 * Extract rubric reference from section name
 */
function extractRubricRef(section: string): string {
  // Match patterns like "B1:", "D3:", etc.
  const match = section.match(/^([A-F]\d*)/i);
  if (match) return match[1];
  
  // Fallback: categorize by keywords
  const lower = section.toLowerCase();
  if (lower.includes('schema')) return 'A';
  if (lower.includes('beginner') || lower.includes('clarity')) return 'B';
  if (lower.includes('alignment')) return 'C';
  if (lower.includes('question')) return 'D';
  if (lower.includes('marking')) return 'E';
  if (lower.includes('visual') || lower.includes('diagram')) return 'F';
  
  return 'UNKNOWN';
}

/**
 * Categorize section type from rubric detail
 */
function categorizeSectionType(section: string): string {
  const lower = section.toLowerCase();
  
  if (lower.includes('question')) return 'questions';
  if (lower.includes('diagram') || lower.includes('visual')) return 'visual';
  if (lower.includes('explanation')) return 'explanation';
  if (lower.includes('practice')) return 'practice';
  if (lower.includes('outcomes')) return 'outcomes';
  if (lower.includes('vocab')) return 'vocabulary';
  
  return 'general';
}

/**
 * Match plan item to issue detail by context
 */
function matchesIssueContext(planItem: any, detail: any): boolean {
  const detailText = `${detail.section} ${detail.issues.join(' ')}`.toLowerCase();
  const planText = `${planItem.instructions}`.toLowerCase();
  
  // Check for common keywords
  const keywords = ['preview', 'key points', 'coming up', 'diagram', 'answer type'];
  for (const keyword of keywords) {
    if (detailText.includes(keyword) && planText.includes(keyword)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Classify fixability from detail (fallback if no plan)
 */
function classifyFixability(detail: any): 'deterministic' | 'llm_editable' | 'blocked_by_policy' | 'requires_regeneration' {
  const text = `${detail.section} ${detail.issues.join(' ')} ${detail.suggestions.join(' ')}`.toLowerCase();
  
  // Check for policy blocks
  if (text.includes('answertype') && text.includes('long-text')) {
    return 'blocked_by_policy';
  }
  
  // Check for regeneration needs
  if (text.includes('add block') || text.includes('remove block') || text.includes('reorder')) {
    return 'requires_regeneration';
  }
  
  // Check for deterministic patterns
  if (text.includes('coming up next') || text.includes('append') || text.includes('prepend')) {
    return 'deterministic';
  }
  
  // Default to LLM-editable
  return 'llm_editable';
}

/**
 * Find applied edits from pointer diff that match issue pointers
 */
function findAppliedEdits(
  issuePointers: string[],
  allChanges: PointerChange[]
): Array<{ op: 'replace' | 'add' | 'remove'; path: string; summary: string }> {
  const appliedEdits: Array<{ op: any; path: string; summary: string }> = [];
  
  for (const pointer of issuePointers) {
    // Find changes that match this pointer (exact or child)
    const matchingChanges = allChanges.filter(change => 
      change.path === pointer || isParentPointer(pointer, change.path)
    );
    
    for (const change of matchingChanges) {
      appliedEdits.push({
        op: change.op,
        path: change.path,
        summary: change.summary
      });
    }
  }
  
  return appliedEdits;
}

/**
 * Determine outcome: fixed / unmoved / worsened
 */
function determineOutcome(
  detailBefore: any,
  detailsAfter: any[],
  hasAppliedEdits: boolean
): 'fixed' | 'unmoved' | 'worsened' {
  // Find corresponding issue in after score
  const afterDetail = detailsAfter.find(d => 
    isSameIssue(detailBefore, d)
  );
  
  if (!afterDetail) {
    // Issue not present in after score
    if (hasAppliedEdits) {
      return 'fixed'; // Issue was addressed and disappeared
    }
    return 'unmoved'; // Issue may have been below threshold after
  }
  
  // Compare scores
  const scoreBefore = detailBefore.score;
  const scoreAfter = afterDetail.score;
  
  if (scoreAfter > scoreBefore) {
    return 'fixed'; // Score improved
  } else if (scoreAfter < scoreBefore) {
    return 'worsened'; // Score got worse
  } else {
    return 'unmoved'; // Score unchanged
  }
}

/**
 * Check if two details represent the same issue
 */
function isSameIssue(detail1: any, detail2: any): boolean {
  // Compare section names
  const section1 = detail1.section.toLowerCase().replace(/\W+/g, '');
  const section2 = detail2.section.toLowerCase().replace(/\W+/g, '');
  
  if (section1 === section2) return true;
  
  // Compare issue text similarity
  const issues1 = detail1.issues.join(' ').toLowerCase();
  const issues2 = detail2.issues.join(' ').toLowerCase();
  
  // Check for significant keyword overlap
  const keywords1 = issues1.split(/\s+/).filter(w => w.length > 4);
  const keywords2 = issues2.split(/\s+/).filter(w => w.length > 4);
  
  const commonKeywords = keywords1.filter(k => keywords2.includes(k));
  const overlapRatio = commonKeywords.length / Math.min(keywords1.length, keywords2.length);
  
  return overlapRatio > 0.5;
}
