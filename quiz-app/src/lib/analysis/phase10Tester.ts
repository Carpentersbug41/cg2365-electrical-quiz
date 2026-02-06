/**
 * Phase 10 Test Harness
 * 
 * Provides testing modes for analyzing Phase 10 refinement behavior:
 * - Single lesson deep dive
 * - Batch testing across multiple lessons
 * - Patch isolation testing
 * - Score determinism testing
 */

import { loadDiagnosticData, loadAllDiagnosticData } from '../generation/diagnosticUtils';
import { analyzeFailure, analyzeSuccess, saveAnalysis } from './phase10Analyzer';
import { Phase10DiagnosticData, Phase10Analysis } from '../generation/types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test configuration options
 */
export interface TestConfig {
  analyzeFallures?: boolean;
  analyzeSuccesses?: boolean;
  saveReports?: boolean;
  verbose?: boolean;
}

/**
 * Test results summary
 */
export interface TestSummary {
  totalTests: number;
  successCount: number;
  failureCount: number;
  averageImprovement: number;
  averageDecline: number;
  successRate: number;
  analyses: Phase10Analysis[];
  timestamp: string;
}

/**
 * Analyze all existing diagnostic data
 */
export async function analyzeExistingData(config: TestConfig = {}): Promise<TestSummary> {
  console.log('\n🧪 [Tester] Starting analysis of existing diagnostic data...\n');
  
  const {
    analyzeFallures = true,
    analyzeSuccesses = false,
    saveReports = true,
    verbose = true,
  } = config;
  
  // Load all diagnostic data
  const { successes, failures } = loadAllDiagnosticData();
  
  console.log(`📊 [Tester] Loaded ${successes.length} successes, ${failures.length} failures\n`);
  
  const analyses: Phase10Analysis[] = [];
  let totalImprovement = 0;
  let totalDecline = 0;
  
  // Analyze failures
  if (analyzeFallures && failures.length > 0) {
    console.log(`🔍 [Tester] Analyzing ${failures.length} failures...\n`);
    
    for (const failure of failures) {
      if (verbose) {
        console.log(`\n--- Analyzing failure: ${failure.lessonId} ---`);
      }
      
      const analysis = await analyzeFailure(failure);
      analyses.push(analysis);
      totalDecline += Math.abs(failure.scoreDelta);
      
      if (saveReports) {
        saveAnalysis(analysis);
      }
      
      if (verbose) {
        console.log(`Root cause: ${analysis.rootCause}`);
        console.log(`Harmful patches: ${analysis.harmfulPatches.length}`);
        console.log(`Recommendations: ${analysis.recommendations.length}`);
      }
    }
  }
  
  // Analyze successes (optional)
  if (analyzeSuccesses && successes.length > 0) {
    console.log(`\n✅ [Tester] Analyzing ${successes.length} successes...\n`);
    
    for (const success of successes) {
      if (verbose) {
        console.log(`\n--- Analyzing success: ${success.lessonId} ---`);
      }
      
      const analysis = await analyzeSuccess(success);
      analyses.push(analysis);
      totalImprovement += success.scoreDelta;
      
      if (saveReports) {
        saveAnalysis(analysis);
      }
      
      if (verbose) {
        console.log(`Improvement: +${success.scoreDelta} points`);
        console.log(`Patterns: ${analysis.patterns.length}`);
      }
    }
  }
  
  // Calculate summary statistics
  const totalTests = successes.length + failures.length;
  const successRate = totalTests > 0 ? (successes.length / totalTests) * 100 : 0;
  const averageImprovement = successes.length > 0 ? totalImprovement / successes.length : 0;
  const averageDecline = failures.length > 0 ? totalDecline / failures.length : 0;
  
  const summary: TestSummary = {
    totalTests,
    successCount: successes.length,
    failureCount: failures.length,
    averageImprovement,
    averageDecline,
    successRate,
    analyses,
    timestamp: new Date().toISOString(),
  };
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total refinement attempts: ${totalTests}`);
  console.log(`Successes: ${successes.length} (${successRate.toFixed(1)}%)`);
  console.log(`Failures: ${failures.length} (${(100 - successRate).toFixed(1)}%)`);
  console.log(`Average improvement (when successful): +${averageImprovement.toFixed(2)} points`);
  console.log(`Average decline (when failed): -${averageDecline.toFixed(2)} points`);
  console.log(`Analyses generated: ${analyses.length}`);
  console.log('='.repeat(60) + '\n');
  
  return summary;
}

/**
 * Analyze a single diagnostic file by path
 */
export async function analyzeSingleFile(filepath: string, saveReport: boolean = true): Promise<Phase10Analysis | null> {
  console.log(`\n🔍 [Tester] Analyzing single file: ${filepath}\n`);
  
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const diagnosticData: Phase10DiagnosticData = JSON.parse(content);
    
    console.log(`Lesson ID: ${diagnosticData.lessonId}`);
    console.log(`Outcome: ${diagnosticData.reason} (${diagnosticData.wasAccepted ? 'accepted' : 'rejected'})`);
    console.log(`Score: ${diagnosticData.originalScore.total} → ${diagnosticData.refinedScore.total} (${diagnosticData.scoreDelta > 0 ? '+' : ''}${diagnosticData.scoreDelta})`);
    
    const analysis = diagnosticData.wasAccepted
      ? await analyzeSuccess(diagnosticData)
      : await analyzeFailure(diagnosticData);
    
    if (saveReport) {
      saveAnalysis(analysis);
    }
    
    // Print detailed analysis
    console.log('\n' + '-'.repeat(60));
    console.log('ROOT CAUSE');
    console.log('-'.repeat(60));
    console.log(analysis.rootCause);
    
    if (analysis.harmfulPatches.length > 0) {
      console.log('\n' + '-'.repeat(60));
      console.log('HARMFUL PATCHES');
      console.log('-'.repeat(60));
      analysis.harmfulPatches.forEach((patch, idx) => {
        console.log(`\n${idx + 1}. ${patch.path}`);
        console.log(`   Intended: ${patch.intendedFix}`);
        console.log(`   Actual: ${patch.actualEffect}`);
        console.log(`   Why harmful: ${patch.whyHarmful}`);
        console.log(`   Points lost: ${patch.pointsLost}`);
      });
    }
    
    if (analysis.reasoningFlaws.length > 0) {
      console.log('\n' + '-'.repeat(60));
      console.log('REASONING FLAWS');
      console.log('-'.repeat(60));
      analysis.reasoningFlaws.forEach((flaw, idx) => {
        console.log(`${idx + 1}. ${flaw}`);
      });
    }
    
    if (analysis.patterns.length > 0) {
      console.log('\n' + '-'.repeat(60));
      console.log('PATTERNS');
      console.log('-'.repeat(60));
      analysis.patterns.forEach((pattern, idx) => {
        console.log(`${idx + 1}. ${pattern}`);
      });
    }
    
    if (analysis.recommendations.length > 0) {
      console.log('\n' + '-'.repeat(60));
      console.log('RECOMMENDATIONS');
      console.log('-'.repeat(60));
      analysis.recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}`);
      });
    }
    
    console.log('\n');
    
    return analysis;
    
  } catch (error) {
    console.error(`❌ [Tester] Failed to analyze file:`, error);
    return null;
  }
}

/**
 * Find most recent failure in diagnostics
 */
export function findMostRecentFailure(): string | null {
  const failuresDir = path.join(process.cwd(), 'quiz-app', 'src', 'data', 'diagnostics', 'failures');
  
  if (!fs.existsSync(failuresDir)) {
    return null;
  }
  
  const files = fs.readdirSync(failuresDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'))
    .map(f => ({
      name: f,
      path: path.join(failuresDir, f),
      mtime: fs.statSync(path.join(failuresDir, f)).mtime
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  
  return files.length > 0 ? files[0].path : null;
}

/**
 * Find most recent success in diagnostics
 */
export function findMostRecentSuccess(): string | null {
  const successesDir = path.join(process.cwd(), 'quiz-app', 'src', 'data', 'diagnostics', 'successes');
  
  if (!fs.existsSync(successesDir)) {
    return null;
  }
  
  const files = fs.readdirSync(successesDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'))
    .map(f => ({
      name: f,
      path: path.join(successesDir, f),
      mtime: fs.statSync(path.join(successesDir, f)).mtime
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  
  return files.length > 0 ? files[0].path : null;
}

/**
 * Quick test: Analyze most recent failure
 */
export async function quickTestFailure(): Promise<Phase10Analysis | null> {
  console.log('\n🚀 [Tester] Quick test: Analyzing most recent failure...\n');
  
  const filepath = findMostRecentFailure();
  
  if (!filepath) {
    console.log('❌ No failure diagnostics found');
    return null;
  }
  
  return analyzeSingleFile(filepath, true);
}

/**
 * Quick test: Analyze most recent success
 */
export async function quickTestSuccess(): Promise<Phase10Analysis | null> {
  console.log('\n🚀 [Tester] Quick test: Analyzing most recent success...\n');
  
  const filepath = findMostRecentSuccess();
  
  if (!filepath) {
    console.log('❌ No success diagnostics found');
    return null;
  }
  
  return analyzeSingleFile(filepath, true);
}

/**
 * Generate a markdown report from test summary
 */
export function generateMarkdownReport(summary: TestSummary): string {
  let report = `# Phase 10 Diagnostic Report

Generated: ${new Date(summary.timestamp).toLocaleString()}

## Summary Statistics

- **Total Refinement Attempts**: ${summary.totalTests}
- **Successes**: ${summary.successCount} (${summary.successRate.toFixed(1)}%)
- **Failures**: ${summary.failureCount} (${(100 - summary.successRate).toFixed(1)}%)
- **Average Improvement** (successful): +${summary.averageImprovement.toFixed(2)} points
- **Average Decline** (failed): -${summary.averageDecline.toFixed(2)} points

## Success Rate Analysis

`;

  if (summary.successRate < 50) {
    report += `⚠️ **CRITICAL**: Success rate is below 50%. Phase 10 is making things worse more often than it helps.

`;
  } else if (summary.successRate < 70) {
    report += `⚠️ **WARNING**: Success rate is below 70%. Phase 10 needs significant improvement.

`;
  } else if (summary.successRate < 90) {
    report += `✅ **GOOD**: Success rate is above 70%. Phase 10 is working reasonably well but has room for improvement.

`;
  } else {
    report += `✅ **EXCELLENT**: Success rate is above 90%. Phase 10 is performing very well.

`;
  }

  // Common patterns from failures
  const failureAnalyses = summary.analyses.filter(a => 
    a.diagnosticData.reason === 'declined'
  );
  
  if (failureAnalyses.length > 0) {
    report += `## Common Failure Patterns

`;
    
    const allPatterns = failureAnalyses.flatMap(a => a.patterns);
    const patternCounts = new Map<string, number>();
    
    allPatterns.forEach(pattern => {
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    });
    
    const sortedPatterns = Array.from(patternCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedPatterns.forEach(([pattern, count], idx) => {
      report += `${idx + 1}. **${pattern}** (${count} occurrences)\n`;
    });
    
    report += '\n';
  }

  // Top recommendations
  const allRecommendations = summary.analyses.flatMap(a => a.recommendations);
  const recCounts = new Map<string, number>();
  
  allRecommendations.forEach(rec => {
    recCounts.set(rec, (recCounts.get(rec) || 0) + 1);
  });
  
  const sortedRecs = Array.from(recCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  if (sortedRecs.length > 0) {
    report += `## Top Recommendations

`;
    
    sortedRecs.forEach(([rec, count], idx) => {
      report += `${idx + 1}. **${rec}** (${count} analyses)\n`;
    });
    
    report += '\n';
  }

  // Detailed analyses
  report += `## Detailed Analyses

${summary.analyses.length} analyses generated. See individual JSON files in \`quiz-app/reports/phase10-analysis/\` for details.

`;

  return report;
}

/**
 * Save markdown report to file
 */
export function saveMarkdownReport(summary: TestSummary): void {
  const report = generateMarkdownReport(summary);
  const reportsDir = path.join(process.cwd(), 'quiz-app', 'reports', 'phase10-analysis');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `summary-${timestamp}.md`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, report, 'utf-8');
  
  console.log(`📄 [Tester] Markdown report saved: ${filename}`);
}
