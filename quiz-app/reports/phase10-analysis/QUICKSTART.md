# Phase 10 Diagnostic System - Quick Start Guide

## What This System Does

The Phase 10 Diagnostic System helps you understand why lesson refinements succeed or fail by:

1. **Automatically capturing data** when Phase 10 runs
2. **Analyzing failures** with LLM-powered root cause analysis  
3. **Identifying patterns** across multiple refinement attempts
4. **Providing recommendations** to improve Phase 10 performance

## How It Works

```
Generate Lesson → Phase 10 Runs → Data Captured Automatically → Analyze Data → Get Insights
```

## Getting Started

### Step 1: Generate Some Lessons

The system needs data to analyze. Generate 5-10 lessons through your normal lesson generation process:

- Lessons that trigger Phase 10 (score < 97) will automatically capture diagnostic data
- Both successful and failed refinements are captured
- Data is saved to `quiz-app/src/data/diagnostics/`

**Note**: You don't need to do anything special - data capture is automatic!

### Step 2: Check What Data You Have

```bash
npm run phase10:summary
```

This shows a quick summary:
- Total refinement attempts
- Success rate
- Average score changes

### Step 3: Generate Dashboard

```bash
npm run phase10:dashboard
```

This creates a comprehensive dashboard showing:
- Overall performance metrics
- Patch statistics
- Section-level impacts
- Recommendations based on your data

### Step 4: Analyze Failures (Most Important!)

```bash
npm run phase10:analyze-failures
```

This runs LLM analysis on all failures to identify:
- **Why** each refinement failed
- **Which patches** caused harm
- **What patterns** exist across failures
- **How to prevent** similar failures

## Understanding the Results

### Success Rate

- **>90%**: ✅ Excellent - Phase 10 is working great
- **70-90%**: ✅ Good - Working well but improvable
- **50-70%**: ⚠️ Needs Improvement - Significant issues
- **<50%**: 🚨 Critical - Phase 10 is harmful, needs immediate fix

### Common Issues

Based on the analysis, you'll see reports like:

```markdown
## Root Cause
Phase 10 attempted to shorten expectedAnswers but removed essential
context that the scoring system was checking for.

## Harmful Patches
1. blocks[4].content.questions[3].expectedAnswer
   - Intended: Make answer more concise
   - Actual: Removed key terminology
   - Why harmful: Scoring system couldn't find required terms
   - Points lost: 3

## Recommendations
1. Never remove technical terms from expectedAnswers
2. Check that all terms in explanation still exist after shortening
3. Add validation that shortened answers maintain key concepts
```

## Taking Action

### 1. Review Analysis Reports

All analyses are saved to: `quiz-app/reports/phase10-analysis/`

Look for:
- `summary-*.md` - Aggregated insights across all failures
- `dashboard-*.md` - Performance metrics
- `{lessonId}-*.json` - Detailed individual analyses

### 2. Identify Patterns

Run the full analysis to identify recurring issues:

```bash
npm run phase10:analyze
```

Look for patterns that appear in multiple analyses:
- Specific patch paths that frequently fail
- Common reasoning flaws
- Section scores that consistently decline

### 3. Update Phase 10

Based on the recommendations, update the Phase 10 prompt in:
- `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts`

Common improvements:
- Add constraints about what NOT to change
- Provide better examples of good patches
- Add validation rules for specific fields
- Clarify scoring criteria

### 4. Test and Compare

After making changes:
1. Generate 5-10 more lessons
2. Run `npm run phase10:summary` again
3. Compare success rate before/after
4. Iterate until success rate >90%

## Commands Reference

| Command | When to Use |
|---------|-------------|
| `npm run phase10:summary` | Quick check - show current metrics |
| `npm run phase10:dashboard` | Periodic review - detailed metrics |
| `npm run phase10:analyze-failures` | When investigating issues |
| `npm run phase10:analyze-recent` | Debug a specific recent failure |
| `npm run phase10:analyze` | Full analysis - all successes and failures |

## Troubleshooting

### "No diagnostic data found"

**Solution**: Generate some lessons first. Diagnostic data is only captured when Phase 10 runs (when initial score < 97).

### "Success rate is 0%"

**Solution**: This is the problem you're trying to fix! Run the analysis to understand why failures are happening, then update Phase 10 based on recommendations.

### "Analysis is too slow"

**Solution**: Use `npm run phase10:analyze-failures` instead of `npm run phase10:analyze` to skip success analysis (which is less critical).

## Best Practices

### 1. Regular Monitoring

Run dashboard weekly:
```bash
npm run phase10:dashboard
```

This helps you catch regressions early.

### 2. Investigate Major Changes

After updating Phase 10 prompts:
```bash
# Generate 5-10 lessons
# Then run:
npm run phase10:analyze
```

Compare results to pre-change metrics.

### 3. Focus on Failures

Successful refinements are good, but failures teach you more:
```bash
npm run phase10:analyze-failures
```

Always investigate why things go wrong.

### 4. Document Improvements

When you implement a recommendation that works:
1. Note what you changed
2. Note the improvement in success rate
3. Share with team

## Example Workflow

Here's a typical debugging session:

```bash
# 1. Check current state
npm run phase10:summary

# Output: 10 attempts, 3 successes (30%), 7 failures (70%)
# ⚠️ This is bad - Phase 10 is harmful!

# 2. Analyze what's going wrong
npm run phase10:analyze-failures

# Review generated reports in quiz-app/reports/phase10-analysis/

# 3. Read the recommendations
# Common pattern: "Patches are removing technical terms from answers"

# 4. Update Phase 10_Refinement.ts
# Add constraint: "Never remove technical terms that appear in explanation"

# 5. Test with new lessons (generate 10 more)

# 6. Check improvement
npm run phase10:summary

# Output: 10 attempts, 9 successes (90%), 1 failure (10%)
# ✅ Much better!

# 7. Generate dashboard to confirm
npm run phase10:dashboard
```

## Next Steps

1. ✅ **Generate lessons** to collect diagnostic data
2. ✅ **Run summary** to see current performance
3. ✅ **Analyze failures** to understand issues
4. ✅ **Implement recommendations** from analysis
5. ✅ **Test and iterate** until success rate >90%

## Support

For detailed information, see:
- `README.md` - Complete system documentation
- `quiz-app/reports/phase10-analysis/` - Generated reports
- Analysis JSON files - Detailed LLM insights

---

**Remember**: The system works automatically. Just generate lessons, then run the analysis commands to get insights!
