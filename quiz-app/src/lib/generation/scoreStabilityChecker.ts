/**
 * Score Stability Checker
 * 
 * Scores the same lesson multiple times to measure scorer variance.
 * Identifies which issues are stable vs. variable across runs.
 */

import { Lesson } from './types';
import { LLMScoringService, RubricScore } from './llmScoringService';

export interface StabilityRun {
  runNumber: number;
  total: number;
  grade: string;
  file: string;
  details: RubricScore['details'];
}

export interface StabilityResult {
  enabled: true;
  runs: StabilityRun[];
  analysis: {
    n: number;
    totals: number[];
    min: number;
    median: number;
    max: number;
    variance: number;
    isStable: boolean;
    variableIssues: string[];
  };
}

/**
 * Run stability check by scoring the same lesson N times
 */
export async function runStabilityCheck(
  lesson: Lesson,
  scorer: LLMScoringService,
  n: number = 3
): Promise<StabilityResult> {
  console.log(`\n🔬 [StabilityCheck] Running stability check (${n} iterations)...`);
  
  const runs: StabilityRun[] = [];
  
  // Run N scoring iterations
  for (let i = 0; i < n; i++) {
    console.log(`  🔬 [StabilityCheck] Run ${i + 1}/${n}...`);
    
    try {
      const score = await scorer.scoreLesson(lesson);
      
      runs.push({
        runNumber: i + 1,
        total: score.total,
        grade: score.grade,
        file: `20_stability_run_${i + 1}.json`,
        details: score.details
      });
      
      console.log(`    ✓ Score: ${score.total}/100`);
    } catch (error) {
      console.error(`    ✗ Run ${i + 1} failed:`, error);
      // Continue with other runs
    }
  }
  
  if (runs.length === 0) {
    throw new Error('All stability check runs failed');
  }
  
  // Analyze results
  const analysis = analyzeStability(runs);
  
  console.log(`✅ [StabilityCheck] Complete`);
  console.log(`   Range: ${analysis.min} - ${analysis.max} (variance: ${analysis.variance})`);
  console.log(`   Median: ${analysis.median}`);
  console.log(`   Stable: ${analysis.isStable ? 'YES' : 'NO'}`);
  if (analysis.variableIssues.length > 0) {
    console.log(`   Variable issues (${analysis.variableIssues.length}):`, analysis.variableIssues.slice(0, 5));
  }
  
  return {
    enabled: true,
    runs,
    analysis
  };
}

/**
 * Analyze stability from multiple scoring runs
 */
function analyzeStability(runs: StabilityRun[]): StabilityResult['analysis'] {
  const totals = runs.map(r => r.total);
  
  // Calculate statistics
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const median = calculateMedian(totals);
  const variance = max - min;
  
  // Check if stable (variance <= 2 points)
  const isStable = variance <= 2;
  
  // Identify variable issues
  const variableIssues = identifyVariableIssues(runs);
  
  return {
    n: runs.length,
    totals,
    min,
    median,
    max,
    variance,
    isStable,
    variableIssues
  };
}

/**
 * Calculate median from array of numbers
 */
function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/**
 * Identify issues that appear in some runs but not others
 */
function identifyVariableIssues(runs: StabilityRun[]): string[] {
  // Collect all issue identifiers across runs
  const issuesByRun: string[][] = runs.map(run => 
    run.details.map(detail => normalizeIssueId(detail.section))
  );
  
  // Find issues that don't appear in all runs
  const allIssues = new Set(issuesByRun.flat());
  const variableIssues: string[] = [];
  
  for (const issueId of allIssues) {
    const appearanceCount = issuesByRun.filter(issues => issues.includes(issueId)).length;
    
    // If issue doesn't appear in all runs, it's variable
    if (appearanceCount < runs.length && appearanceCount > 0) {
      variableIssues.push(issueId);
    }
  }
  
  return variableIssues;
}

/**
 * Normalize issue identifier for comparison
 */
function normalizeIssueId(section: string): string {
  // Extract meaningful identifier from section name
  // Remove scores, remove special characters
  return section
    .toLowerCase()
    .replace(/\(\d+\/\d+\)/g, '') // Remove (0/5) patterns
    .replace(/\W+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
}

/**
 * Compare two stability results to detect scorer drift
 */
export function compareStabilityResults(
  result1: StabilityResult,
  result2: StabilityResult
): {
  varianceChange: number;
  newVariableIssues: string[];
  resolvedVariableIssues: string[];
} {
  const varianceChange = result2.analysis.variance - result1.analysis.variance;
  
  const set1 = new Set(result1.analysis.variableIssues);
  const set2 = new Set(result2.analysis.variableIssues);
  
  const newVariableIssues = result2.analysis.variableIssues.filter(i => !set1.has(i));
  const resolvedVariableIssues = result1.analysis.variableIssues.filter(i => !set2.has(i));
  
  return {
    varianceChange,
    newVariableIssues,
    resolvedVariableIssues
  };
}
