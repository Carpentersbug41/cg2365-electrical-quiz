/**
 * Blockers Analyzer
 * 
 * Identifies issues that are blocked by policy conflicts or invariant limits.
 * Surfaces known hard conflicts explicitly.
 */

import { RubricScore } from './llmScoringService';
import { FixPlan } from './phases/Phase10_Planner';

export interface Blocker {
  issueId: string;
  type: 'blocked_by_policy' | 'requires_regeneration' | 'invariant_limits_fix';
  rubricRef: string;
  description: string;
  policyConflict?: string;
  recommendation?: string;
}

export interface BlockersSummary {
  lessonId: string;
  timestamp: string;
  blockers: Blocker[];
  summary: {
    totalBlocked: number;
    pointsBlocked: number;
  };
}

/**
 * Analyze blockers from fix plan and score
 */
export function analyzeBlockers(
  plan: FixPlan | undefined,
  scoreAfter: RubricScore
): BlockersSummary {
  console.log(`\n🚧 [BlockersAnalyzer] Analyzing policy blockers...`);
  
  const blockers: Blocker[] = [];
  let totalPointsBlocked = 0;
  
  if (!plan) {
    console.log(`  ⚠️  No plan available - skipping blocker analysis`);
    return {
      lessonId: 'unknown',
      timestamp: new Date().toISOString(),
      blockers: [],
      summary: {
        totalBlocked: 0,
        pointsBlocked: 0
      }
    };
  }
  
  // Analyze each plan item
  for (const planItem of plan.plan) {
    if (planItem.fixability === 'blocked_by_policy' || 
        planItem.fixability === 'requires_regeneration') {
      
      // Identify known conflicts
      const blocker = identifyBlocker(planItem, scoreAfter);
      if (blocker) {
        blockers.push(blocker);
        
        // Estimate points blocked (from corresponding score detail)
        const matchingDetail = scoreAfter.details.find(d => 
          d.section.includes(planItem.rubricRef) ||
          d.issues.join(' ').toLowerCase().includes(planItem.instructions.toLowerCase().slice(0, 30))
        );
        
        if (matchingDetail) {
          totalPointsBlocked += matchingDetail.maxScore;
        }
      }
    }
  }
  
  console.log(`✅ [BlockersAnalyzer] Found ${blockers.length} blockers (${totalPointsBlocked} points)`);
  if (blockers.length > 0) {
    console.log(`   Top blocker: ${blockers[0].description.substring(0, 80)}...`);
  }
  
  return {
    lessonId: plan.lessonId,
    timestamp: new Date().toISOString(),
    blockers,
    summary: {
      totalBlocked: blockers.length,
      pointsBlocked: totalPointsBlocked
    }
  };
}

/**
 * Identify specific blocker type and recommendation
 */
function identifyBlocker(planItem: any, scoreAfter: RubricScore): Blocker | null {
  const instructions = planItem.instructions.toLowerCase();
  const targets = planItem.targets.join(' ').toLowerCase();
  
  // Known blocker patterns
  
  // 1. D3 Multi-Sentence Synthesis vs. No Long-Text Policy
  if ((instructions.includes('synthesis') || instructions.includes('d3')) &&
      (instructions.includes('long-text') || instructions.includes('answertype') || instructions.includes('multi-sentence'))) {
    return {
      issueId: planItem.issueId,
      type: 'blocked_by_policy',
      rubricRef: planItem.rubricRef,
      description: 'D3 integrative synthesis question expects multi-sentence answer (3-4 sentences) but Phase 10 policy forbids long-text answerType.',
      policyConflict: 'Rubric D3 requires multi-sentence synthesis; Phase 10 answerTypes exclude long-text',
      recommendation: 'Option 1: Allow long-text answerType for integrative synthesis only. Option 2: Adjust rubric D3 to accept short-text with multi-phrase expectations. Option 3: Don\'t penalize D3 in Phase 10 scoring if policy forbids it.'
    };
  }
  
  // 2. Add/Remove Blocks Needed
  if (instructions.includes('add block') || instructions.includes('remove block') || 
      instructions.includes('additional block') || instructions.includes('extra block')) {
    return {
      issueId: planItem.issueId,
      type: 'invariant_limits_fix',
      rubricRef: planItem.rubricRef,
      description: `Issue requires adding or removing blocks, but Phase 10 invariant forbids changing block count.`,
      policyConflict: 'Rubric expects additional content blocks; Phase 10 cannot add/remove blocks',
      recommendation: 'Requires full lesson regeneration with adjusted block structure.'
    };
  }
  
  // 3. Reordering Needed
  if (instructions.includes('reorder') || instructions.includes('move block')) {
    return {
      issueId: planItem.issueId,
      type: 'invariant_limits_fix',
      rubricRef: planItem.rubricRef,
      description: 'Issue requires reordering blocks, but Phase 10 invariant forbids changing block order.',
      policyConflict: 'Rubric expects different block ordering; Phase 10 cannot reorder blocks',
      recommendation: 'Requires full lesson regeneration with corrected block order.'
    };
  }
  
  // 4. Answer Type Change
  if (instructions.includes('answertype') && 
      (instructions.includes('change') || instructions.includes('convert'))) {
    return {
      issueId: planItem.issueId,
      type: 'blocked_by_policy',
      rubricRef: planItem.rubricRef,
      description: 'Issue requires changing answerType, which breaks grading contract and is forbidden by Phase 10.',
      policyConflict: 'Answer type changes break existing grading expectations',
      recommendation: 'Keep existing answerType and adjust question wording/hints instead, or regenerate question.'
    };
  }
  
  // 5. Structural Redesign
  if (instructions.includes('restructure') || instructions.includes('redesign') || 
      instructions.includes('fundamental')) {
    return {
      issueId: planItem.issueId,
      type: 'requires_regeneration',
      rubricRef: planItem.rubricRef,
      description: 'Issue requires fundamental restructuring of lesson content.',
      policyConflict: 'Issue scope exceeds Phase 10 content-level editing capabilities',
      recommendation: 'Requires full lesson regeneration with revised structure.'
    };
  }
  
  // Generic blocker if no specific pattern matched
  if (planItem.fixability === 'blocked_by_policy') {
    return {
      issueId: planItem.issueId,
      type: 'blocked_by_policy',
      rubricRef: planItem.rubricRef,
      description: planItem.instructions,
      policyConflict: 'Conflicts with Phase 10 policy constraints',
      recommendation: 'Review policy constraints or adjust rubric expectations.'
    };
  }
  
  if (planItem.fixability === 'requires_regeneration') {
    return {
      issueId: planItem.issueId,
      type: 'requires_regeneration',
      rubricRef: planItem.rubricRef,
      description: planItem.instructions,
      recommendation: 'Requires full lesson regeneration.'
    };
  }
  
  return null;
}

/**
 * Generate blocker summary text for reporting
 */
export function generateBlockerReport(summary: BlockersSummary): string {
  if (summary.blockers.length === 0) {
    return 'No blockers identified. All issues are fixable within Phase 10 constraints.';
  }
  
  let report = `Blocker Analysis\n`;
  report += `================\n\n`;
  report += `Total Blockers: ${summary.summary.totalBlocked}\n`;
  report += `Points Blocked: ${summary.summary.pointsBlocked}\n\n`;
  
  summary.blockers.forEach((blocker, idx) => {
    report += `Blocker ${idx + 1}: ${blocker.rubricRef} - ${blocker.type}\n`;
    report += `  Description: ${blocker.description}\n`;
    
    if (blocker.policyConflict) {
      report += `  Policy Conflict: ${blocker.policyConflict}\n`;
    }
    
    if (blocker.recommendation) {
      report += `  Recommendation: ${blocker.recommendation}\n`;
    }
    
    report += `\n`;
  });
  
  return report;
}

/**
 * Check if a specific known blocker exists
 */
export function hasD3SynthesisBlocker(summary: BlockersSummary): boolean {
  return summary.blockers.some(b => 
    b.rubricRef === 'D3' && 
    b.policyConflict?.includes('multi-sentence') &&
    b.policyConflict?.includes('long-text')
  );
}

/**
 * Get recommendations for resolving all blockers
 */
export function getBlockerRecommendations(summary: BlockersSummary): string[] {
  const recommendations = new Set<string>();
  
  for (const blocker of summary.blockers) {
    if (blocker.recommendation) {
      recommendations.add(blocker.recommendation);
    }
  }
  
  return Array.from(recommendations);
}
