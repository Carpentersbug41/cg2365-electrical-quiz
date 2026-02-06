# Phase 10 Diagnostic System

**Status**: Production Ready  
**Version**: 1.0.0  
**Date**: February 6, 2026

## Overview

The Phase 10 Diagnostic System is a comprehensive testing and analysis framework designed to understand why Phase 10 refinements succeed or fail. It uses LLM-powered root cause analysis to identify patterns, reasoning flaws, and provide actionable recommendations for improving Phase 10 performance.

## Problem Statement

Phase 10 refinement attempts were making scores worse >50% of the time. While the system correctly rejects harmful patches, we needed to understand **WHY** they were being generated so we could prevent the problem.

## Architecture

```
Lesson Generation
    ↓
Initial Scoring (LLM)
    ↓
Score < 97? → Phase 10 Refinement
    ↓
Diagnostic Data Capture ← NEW
    ↓
Re-scoring
    ↓
Score Improved? → Save Success Data OR Save Failure Data
    ↓
LLM Root Cause Analysis ← NEW
    ↓
Diagnostic Reports
    ↓
Dashboard & Insights
```

## Components

### 1. Data Capture (`diagnosticUtils.ts`)

Automatically captures detailed diagnostic data whenever Phase 10 runs:

- Original and refined scores (full breakdown)
- All patches applied
- Section-level impacts
- Complete lesson JSONs
- Outcome (accepted/rejected)

**Storage**:
- Successes: `quiz-app/src/data/diagnostics/successes/`
- Failures: `quiz-app/src/data/diagnostics/failures/`

### 2. LLM Analyzer (`phase10Analyzer.ts`)

Uses Gemini Flash to analyze diagnostic data and provide:

- **Root Cause**: Why did the refinement fail/succeed?
- **Harmful Patches**: Which patches caused harm and why?
- **Reasoning Flaws**: What was wrong with Phase 10's logic?
- **Patterns**: Common failure modes
- **Recommendations**: Specific, actionable fixes

### 3. Test Harness (`phase10Tester.ts`)

Provides multiple testing modes:

- **Batch Analysis**: Analyze all existing diagnostic data
- **Single File Analysis**: Deep dive into one failure/success
- **Quick Tests**: Analyze most recent failure/success
- **Report Generation**: Markdown reports with insights

### 4. Dashboard (`phase10Dashboard.ts`)

Aggregates metrics and generates comprehensive dashboards:

- Overall performance (success rate, scores)
- Patch statistics (types, common paths, effectiveness)
- Section-level insights (most improved/declined)
- Performance indicators and recommendations

## Usage

### Quick Start

The system automatically captures data when lessons are generated. To analyze existing data:

```bash
# Show quick summary
npm run phase10:summary

# Generate full dashboard
npm run phase10:dashboard

# Analyze all diagnostic data
npm run phase10:analyze

# Analyze most recent failure
npm run phase10:analyze-recent

# Analyze failures only
npm run phase10:analyze-failures
```

### CLI Commands

All commands are run from the `quiz-app` directory:

| Command | Description |
|---------|-------------|
| `npm run phase10:summary` | Show quick metrics summary |
| `npm run phase10:dashboard` | Generate performance dashboard |
| `npm run phase10:analyze` | Analyze all diagnostic data (failures + successes) |
| `npm run phase10:analyze-failures` | Analyze failures only |
| `npm run phase10:analyze-recent` | Analyze most recent failure |

### Programmatic Usage

```typescript
import { analyzeExistingData } from '@/lib/analysis/phase10Tester';
import { saveDashboard } from '@/lib/analysis/phase10Dashboard';

// Analyze all data
const summary = await analyzeExistingData({
  analyzeFallures: true,
  analyzeSuccesses: true,
  saveReports: true,
  verbose: true,
});

// Generate dashboard
saveDashboard();
```

## Reports Generated

### 1. Diagnostic Data Files

**Location**: `quiz-app/src/data/diagnostics/`

- `successes/{lessonId}-{timestamp}.json` - Successful refinements
- `failures/{lessonId}-{timestamp}.json` - Failed refinements

**Contents**:
```json
{
  "lessonId": "203-3A2",
  "timestamp": "2026-02-06T...",
  "originalScore": { ... },
  "refinedScore": { ... },
  "scoreDelta": -6,
  "patchesApplied": [ ... ],
  "sectionImpacts": [ ... ],
  "wasAccepted": false,
  "reason": "declined",
  "originalLesson": { ... },
  "refinedLesson": { ... }
}
```

### 2. Analysis Reports

**Location**: `quiz-app/reports/phase10-analysis/`

- `{lessonId}-{timestamp}.json` - Individual LLM analysis
- `summary-{timestamp}.md` - Aggregated summary report
- `dashboard-{timestamp}.md` - Performance dashboard

**Analysis Contents**:
```json
{
  "lessonId": "203-3A2",
  "rootCause": "...",
  "harmfulPatches": [
    {
      "patchIndex": 1,
      "path": "blocks[4].content.questions[3].expectedAnswer",
      "intendedFix": "...",
      "actualEffect": "...",
      "whyHarmful": "...",
      "pointsLost": 3
    }
  ],
  "reasoningFlaws": [ ... ],
  "patterns": [ ... ],
  "recommendations": [ ... ]
}
```

## Workflow

### 1. Automatic Data Capture

Data is captured automatically during lesson generation:

1. Lesson is generated (Phases 1-9)
2. Initial scoring (LLM scoring service)
3. If score < 97: Phase 10 activates
4. Patches are applied
5. Re-scoring
6. **Diagnostic data is saved** (success or failure)

No manual intervention needed!

### 2. Periodic Analysis

Run analysis periodically (e.g., weekly) to:

1. Identify trends in failure patterns
2. Find common harmful patches
3. Get recommendations for Phase 10 improvements
4. Track success rate over time

```bash
# Weekly analysis routine
npm run phase10:analyze
npm run phase10:dashboard
```

### 3. Debugging Specific Failures

When you notice a lesson scored worse after refinement:

```bash
# Analyze the most recent failure
npm run phase10:analyze-recent
```

Review the generated analysis report for:
- Root cause explanation
- Which patches caused harm
- Recommendations to prevent similar failures

### 4. Implementing Improvements

Based on analysis insights:

1. Review recommendations from multiple analyses
2. Identify common patterns across failures
3. Update Phase 10 prompts in `Phase10_Refinement.ts`
4. Re-test with new lessons
5. Compare success rates before/after changes

## Key Metrics

### Success Rate

**Target**: >90%  
**Warning**: <70%  
**Critical**: <50%

Formula: `(Successful Refinements / Total Refinements) × 100`

### Average Score Impact

- **Improvement** (successful refinements): Should be +3 to +10 points
- **Decline** (failed refinements): Should be < -5 points

If average decline > average improvement, Phase 10 is net-harmful.

### Patch Effectiveness

Track which patch paths have high success rates:
- Patches with >80% success: Good targets
- Patches with <40% success: Problematic, needs review

## Interpreting Results

### Dashboard Indicators

| Indicator | Success Rate | Interpretation |
|-----------|--------------|----------------|
| ✅ EXCELLENT | ≥90% | Phase 10 working very well |
| ✅ GOOD | 70-89% | Acceptable but improvable |
| ⚠️ NEEDS IMPROVEMENT | 50-69% | Significant issues |
| 🚨 CRITICAL | <50% | System broken, needs immediate fix |

### Common Failure Patterns

Based on analysis results, common patterns include:

1. **Over-shortening**: Patches make answers too terse, losing context
2. **Introducing ambiguity**: Rewrites make questions less clear
3. **Breaking alignment**: Changing one field without updating related fields
4. **Scope violations**: Patches change more than intended

### Root Cause Categories

- **Prompt Issues**: Phase 10 misunderstands instructions
- **Context Issues**: Insufficient context about lesson structure
- **Scoring Misalignment**: Patch targets don't match actual scoring issues
- **Technical Errors**: JSON parsing, path resolution failures

## Troubleshooting

### No Diagnostic Data

**Issue**: Running analysis shows 0 successes and 0 failures

**Solution**: Generate some lessons first. Diagnostic data is only captured when Phase 10 runs (score < 97).

### LLM Analysis Fails

**Issue**: Analysis command errors out during LLM call

**Possible causes**:
1. Gemini API key not set
2. Rate limiting
3. Network issues
4. Invalid diagnostic data format

**Solution**: Check `.env` for `GEMINI_API_KEY`, verify API quota, check network

### Reports Not Saving

**Issue**: Analysis runs but no files in `reports/phase10-analysis/`

**Solution**: Check file permissions, ensure directory exists, verify disk space

## Cost Estimation

Per analysis run:
- Diagnostic data capture: Negligible (file I/O only)
- LLM analysis per failure: ~$0.003-0.005
- Batch analysis of 20 lessons: ~$0.50-1.00 total

Very affordable for the diagnostic value provided.

## Next Steps

After implementing this system:

1. **Generate 10-20 lessons** to collect diagnostic data
2. **Run initial analysis** with `npm run phase10:analyze`
3. **Review dashboard** to understand current performance
4. **Identify top 3-5 failure patterns** from analyses
5. **Update Phase 10 prompts** based on recommendations
6. **Re-generate lessons** and compare metrics
7. **Iterate** until success rate >90%

## Files Created

### Core System
- `quiz-app/src/lib/generation/types.ts` - Added diagnostic data types
- `quiz-app/src/lib/generation/diagnosticUtils.ts` - Data capture utilities
- `quiz-app/src/lib/generation/SequentialLessonGenerator.ts` - Modified for capture

### Analysis System
- `quiz-app/src/lib/analysis/phase10Analyzer.ts` - LLM root cause analysis
- `quiz-app/src/lib/analysis/phase10Tester.ts` - Test harness
- `quiz-app/src/lib/analysis/phase10Dashboard.ts` - Metrics and reporting

### CLI & Scripts
- `quiz-app/scripts/runPhase10Diagnostics.ts` - CLI interface
- `quiz-app/package.json` - Added npm scripts

### Directories
- `quiz-app/src/data/diagnostics/successes/` - Success data storage
- `quiz-app/src/data/diagnostics/failures/` - Failure data storage
- `quiz-app/reports/phase10-analysis/` - Generated reports

## Support

For issues or questions about the diagnostic system:

1. Check this README first
2. Review example analysis reports in `quiz-app/reports/phase10-analysis/`
3. Run `npm run phase10:summary` to check system status
4. Review diagnostic data files manually if needed

## Version History

### v1.0.0 (2026-02-06)
- Initial implementation
- Automatic diagnostic data capture
- LLM-powered root cause analysis
- Test harness with multiple modes
- Performance dashboard
- CLI interface
- Comprehensive documentation
