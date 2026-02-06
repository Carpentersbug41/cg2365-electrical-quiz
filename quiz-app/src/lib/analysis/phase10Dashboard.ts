/**
 * Phase 10 Dashboard
 * 
 * Aggregates diagnostic data and generates comprehensive dashboards
 * showing Phase 10 performance metrics, trends, and insights.
 */

import { loadAllDiagnosticData } from '../generation/diagnosticUtils';
import { Phase10DiagnosticData } from '../generation/types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  // Overall stats
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  
  // Score statistics
  averageImprovement: number;
  averageDecline: number;
  bestImprovement: number;
  worstDecline: number;
  
  // Patch statistics
  averagePatchesApplied: number;
  totalPatchesApplied: number;
  
  // Section-level insights
  mostImprovedSections: Array<{ section: string; averageDelta: number; count: number }>;
  mostDeclinedSections: Array<{ section: string; averageDelta: number; count: number }>;
  
  // Temporal data
  timestamp: string;
}

/**
 * Patch effectiveness metrics
 */
export interface PatchMetrics {
  totalPatches: number;
  patchesByOperation: {
    replace: number;
    prepend: number;
    append: number;
  };
  commonPatchPaths: Array<{ path: string; count: number; successRate: number }>;
}

/**
 * Calculate dashboard metrics from diagnostic data
 */
export function calculateMetrics(): DashboardMetrics {
  const { successes, failures } = loadAllDiagnosticData();
  
  const totalAttempts = successes.length + failures.length;
  const successRate = totalAttempts > 0 ? (successes.length / totalAttempts) * 100 : 0;
  
  // Score statistics
  const improvements = successes.map(s => s.scoreDelta);
  const declines = failures.map(f => Math.abs(f.scoreDelta));
  
  const averageImprovement = improvements.length > 0
    ? improvements.reduce((a, b) => a + b, 0) / improvements.length
    : 0;
  
  const averageDecline = declines.length > 0
    ? declines.reduce((a, b) => a + b, 0) / declines.length
    : 0;
  
  const bestImprovement = improvements.length > 0 ? Math.max(...improvements) : 0;
  const worstDecline = declines.length > 0 ? Math.max(...declines) : 0;
  
  // Patch statistics
  const allPatches = [...successes, ...failures].flatMap(d => d.patchesApplied);
  const averagePatchesApplied = totalAttempts > 0
    ? allPatches.length / totalAttempts
    : 0;
  
  // Section-level analysis
  const sectionDeltas = new Map<string, number[]>();
  
  for (const data of [...successes, ...failures]) {
    for (const impact of data.sectionImpacts) {
      if (!sectionDeltas.has(impact.section)) {
        sectionDeltas.set(impact.section, []);
      }
      sectionDeltas.get(impact.section)!.push(impact.delta);
    }
  }
  
  const sectionAverages = Array.from(sectionDeltas.entries())
    .map(([section, deltas]) => ({
      section,
      averageDelta: deltas.reduce((a, b) => a + b, 0) / deltas.length,
      count: deltas.length
    }))
    .sort((a, b) => b.averageDelta - a.averageDelta);
  
  const mostImprovedSections = sectionAverages.filter(s => s.averageDelta > 0).slice(0, 5);
  const mostDeclinedSections = sectionAverages.filter(s => s.averageDelta < 0).slice(0, 5);
  
  return {
    totalAttempts,
    successCount: successes.length,
    failureCount: failures.length,
    successRate,
    averageImprovement,
    averageDecline,
    bestImprovement,
    worstDecline,
    averagePatchesApplied,
    totalPatchesApplied: allPatches.length,
    mostImprovedSections,
    mostDeclinedSections,
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate patch effectiveness metrics
 */
export function calculatePatchMetrics(): PatchMetrics {
  const { successes, failures } = loadAllDiagnosticData();
  
  const allData = [...successes, ...failures];
  const allPatches = allData.flatMap(d => 
    d.patchesApplied.map(p => ({ ...p, wasSuccessful: d.wasAccepted }))
  );
  
  // Patches by operation type
  const patchesByOperation = {
    replace: allPatches.filter(p => p.op === 'replace').length,
    prepend: allPatches.filter(p => p.op === 'prepend').length,
    append: allPatches.filter(p => p.op === 'append').length,
  };
  
  // Common patch paths and their success rates
  const pathCounts = new Map<string, { total: number; successful: number }>();
  
  for (const patch of allPatches) {
    const pathKey = patch.path;
    if (!pathCounts.has(pathKey)) {
      pathCounts.set(pathKey, { total: 0, successful: 0 });
    }
    const stats = pathCounts.get(pathKey)!;
    stats.total++;
    if (patch.wasSuccessful) {
      stats.successful++;
    }
  }
  
  const commonPatchPaths = Array.from(pathCounts.entries())
    .map(([path, stats]) => ({
      path,
      count: stats.total,
      successRate: (stats.successful / stats.total) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  return {
    totalPatches: allPatches.length,
    patchesByOperation,
    commonPatchPaths
  };
}

/**
 * Generate a comprehensive dashboard report (markdown)
 */
export function generateDashboard(): string {
  const metrics = calculateMetrics();
  const patchMetrics = calculatePatchMetrics();
  
  let report = `# Phase 10 Performance Dashboard

**Generated**: ${new Date(metrics.timestamp).toLocaleString()}

---

## 📊 Overall Performance

`;

  // Performance indicator
  if (metrics.successRate >= 90) {
    report += `### ✅ EXCELLENT\n\n`;
  } else if (metrics.successRate >= 70) {
    report += `### ✅ GOOD\n\n`;
  } else if (metrics.successRate >= 50) {
    report += `### ⚠️ NEEDS IMPROVEMENT\n\n`;
  } else {
    report += `### 🚨 CRITICAL - SYSTEM BROKEN\n\n`;
  }

  report += `| Metric | Value |
|--------|-------|
| **Total Refinement Attempts** | ${metrics.totalAttempts} |
| **Successes** | ${metrics.successCount} (${metrics.successRate.toFixed(1)}%) |
| **Failures** | ${metrics.failureCount} (${(100 - metrics.successRate).toFixed(1)}%) |
| **Success Rate** | ${metrics.successRate.toFixed(1)}% |

`;

  // Score impact analysis
  report += `## 📈 Score Impact

| Metric | Successes | Failures |
|--------|-----------|----------|
| **Average Change** | +${metrics.averageImprovement.toFixed(2)} pts | -${metrics.averageDecline.toFixed(2)} pts |
| **Best/Worst Case** | +${metrics.bestImprovement.toFixed(2)} pts | -${metrics.worstDecline.toFixed(2)} pts |

`;

  if (metrics.averageDecline > metrics.averageImprovement) {
    report += `⚠️ **WARNING**: Average decline (${metrics.averageDecline.toFixed(2)} pts) exceeds average improvement (${metrics.averageImprovement.toFixed(2)} pts). When Phase 10 fails, it fails harder than it succeeds.

`;
  }

  // Patch statistics
  report += `## 🔧 Patch Statistics

| Metric | Value |
|--------|-------|
| **Total Patches Applied** | ${patchMetrics.totalPatches} |
| **Average per Attempt** | ${metrics.averagePatchesApplied.toFixed(1)} |
| **Replace Operations** | ${patchMetrics.patchesByOperation.replace} (${((patchMetrics.patchesByOperation.replace / patchMetrics.totalPatches) * 100).toFixed(1)}%) |
| **Prepend Operations** | ${patchMetrics.patchesByOperation.prepend} (${((patchMetrics.patchesByOperation.prepend / patchMetrics.totalPatches) * 100).toFixed(1)}%) |
| **Append Operations** | ${patchMetrics.patchesByOperation.append} (${((patchMetrics.patchesByOperation.append / patchMetrics.totalPatches) * 100).toFixed(1)}%) |

`;

  // Most common patch paths
  if (patchMetrics.commonPatchPaths.length > 0) {
    report += `### Most Common Patch Targets

| Path | Count | Success Rate |
|------|-------|--------------|
`;
    
    patchMetrics.commonPatchPaths.slice(0, 10).forEach(patch => {
      const truncatedPath = patch.path.length > 60 
        ? patch.path.substring(0, 57) + '...' 
        : patch.path;
      report += `| \`${truncatedPath}\` | ${patch.count} | ${patch.successRate.toFixed(1)}% |\n`;
    });
    
    report += '\n';
  }

  // Section-level insights
  if (metrics.mostImprovedSections.length > 0) {
    report += `## ⬆️ Most Improved Sections

These scoring sections show the most improvement when Phase 10 succeeds:

| Section | Avg Delta | Occurrences |
|---------|-----------|-------------|
`;
    
    metrics.mostImprovedSections.forEach(section => {
      report += `| ${section.section} | +${section.averageDelta.toFixed(2)} | ${section.count} |\n`;
    });
    
    report += '\n';
  }

  if (metrics.mostDeclinedSections.length > 0) {
    report += `## ⬇️ Most Declined Sections

These scoring sections show the most decline when Phase 10 fails:

| Section | Avg Delta | Occurrences |
|---------|-----------|-------------|
`;
    
    metrics.mostDeclinedSections.forEach(section => {
      report += `| ${section.section} | ${section.averageDelta.toFixed(2)} | ${section.count} |\n`;
    });
    
    report += '\n';
  }

  // Recommendations
  report += `## 💡 Recommendations

`;

  if (metrics.successRate < 50) {
    report += `### 🚨 Critical Issues

1. **Success rate is below 50%** - Phase 10 is harmful more often than helpful
2. **Immediate action required** - Review Phase 10 prompt and patch generation logic
3. **Consider disabling Phase 10** until issues are resolved
4. **Analyze failure patterns** using the diagnostic tools

`;
  } else if (metrics.successRate < 70) {
    report += `### ⚠️ Needs Improvement

1. **Success rate is below 70%** - Phase 10 needs significant tuning
2. **Review common patch patterns** that lead to failures
3. **Analyze harmful patches** to understand what's going wrong
4. **Refine Phase 10 prompts** based on diagnostic insights

`;
  } else if (metrics.successRate < 90) {
    report += `### ✅ Good Performance

1. **Success rate is acceptable** but can be improved
2. **Focus on edge cases** that cause failures
3. **Continue monitoring** patch effectiveness
4. **Iterate on prompts** to push success rate higher

`;
  } else {
    report += `### ✅ Excellent Performance

1. **Phase 10 is working very well**
2. **Continue monitoring** for any regressions
3. **Document successful patterns** for future reference
4. **Consider sharing** improvements with the team

`;
  }

  // Data sources
  report += `## 📁 Data Sources

- Diagnostic data: \`quiz-app/src/data/diagnostics/\`
- Analysis reports: \`quiz-app/reports/phase10-analysis/\`
- Total data points: ${metrics.totalAttempts}

`;

  return report;
}

/**
 * Save dashboard to file
 */
export function saveDashboard(): void {
  const dashboard = generateDashboard();
  const reportsDir = path.join(process.cwd(), 'quiz-app', 'reports', 'phase10-analysis');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `dashboard-${timestamp}.md`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, dashboard, 'utf-8');
  
  console.log(`\n📊 [Dashboard] Dashboard saved: ${filename}`);
  console.log(`📊 [Dashboard] Location: ${filepath}\n`);
}

/**
 * Print dashboard to console
 */
export function printDashboard(): void {
  const dashboard = generateDashboard();
  console.log('\n' + dashboard);
}

/**
 * Get quick metrics summary for console output
 */
export function getQuickSummary(): string {
  const metrics = calculateMetrics();
  
  return `
┌─────────────────────────────────────────────┐
│        Phase 10 Quick Summary               │
├─────────────────────────────────────────────┤
│ Total Attempts: ${metrics.totalAttempts.toString().padStart(4)}                        │
│ Successes:      ${metrics.successCount.toString().padStart(4)} (${metrics.successRate.toFixed(1)}%)              │
│ Failures:       ${metrics.failureCount.toString().padStart(4)} (${(100 - metrics.successRate).toFixed(1)}%)              │
│ Avg Improvement: +${metrics.averageImprovement.toFixed(2)} pts              │
│ Avg Decline:     -${metrics.averageDecline.toFixed(2)} pts              │
└─────────────────────────────────────────────┘
`;
}
