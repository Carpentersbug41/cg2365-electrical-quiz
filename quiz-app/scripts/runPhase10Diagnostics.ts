#!/usr/bin/env tsx

/**
 * Phase 10 Diagnostics CLI
 * 
 * Run Phase 10 diagnostic tests and generate reports.
 * 
 * Usage:
 *   npm run phase10:analyze          - Analyze existing diagnostic data
 *   npm run phase10:analyze-recent   - Analyze most recent failure
 *   npm run phase10:dashboard        - Generate dashboard
 *   npm run phase10:quick-summary    - Show quick summary
 */

import {
  analyzeExistingData,
  quickTestFailure,
  saveMarkdownReport,
} from '../src/lib/analysis/phase10Tester';
import {
  saveDashboard,
  printDashboard,
  getQuickSummary,
} from '../src/lib/analysis/phase10Dashboard';

async function main() {
  const command = process.argv[2] || 'analyze';
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║       Phase 10 Diagnostic System                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  switch (command) {
    case 'analyze':
    case 'analyze-all':
      console.log('📊 Running comprehensive analysis of all diagnostic data...\n');
      const summary = await analyzeExistingData({
        analyzeFallures: true,
        analyzeSuccesses: true,
        saveReports: true,
        verbose: true,
      });
      
      // Save markdown report
      saveMarkdownReport(summary);
      
      // Generate and save dashboard
      saveDashboard();
      
      console.log('\n✅ Analysis complete!');
      console.log('📄 Reports saved to: quiz-app/reports/phase10-analysis/\n');
      break;
    
    case 'analyze-failures':
      console.log('🔍 Analyzing failures only...\n');
      const failureSummary = await analyzeExistingData({
        analyzeFallures: true,
        analyzeSuccesses: false,
        saveReports: true,
        verbose: true,
      });
      
      saveMarkdownReport(failureSummary);
      
      console.log('\n✅ Failure analysis complete!\n');
      break;
    
    case 'analyze-recent':
    case 'quick-test':
      console.log('🚀 Analyzing most recent failure...\n');
      const analysis = await quickTestFailure();
      
      if (analysis) {
        console.log('\n✅ Analysis saved to: quiz-app/reports/phase10-analysis/\n');
      }
      break;
    
    case 'dashboard':
      console.log('📊 Generating dashboard...\n');
      printDashboard();
      saveDashboard();
      break;
    
    case 'summary':
    case 'quick-summary':
      console.log(getQuickSummary());
      break;
    
    case 'help':
    case '--help':
    case '-h':
      console.log(`
Phase 10 Diagnostics CLI

COMMANDS:
  analyze              Analyze all diagnostic data (failures and successes)
  analyze-failures     Analyze failures only
  analyze-recent       Analyze most recent failure
  dashboard            Generate and display performance dashboard
  summary              Show quick summary of metrics
  help                 Show this help message

EXAMPLES:
  npm run phase10:analyze
  npm run phase10:analyze-recent
  npm run phase10:dashboard
  npm run phase10:summary

FILES:
  Diagnostic data:  quiz-app/src/data/diagnostics/
  Analysis reports: quiz-app/reports/phase10-analysis/
`);
      break;
    
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run with "help" to see available commands.');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Error running diagnostics:', error);
  process.exit(1);
});
