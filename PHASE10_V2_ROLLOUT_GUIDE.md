# Phase 10 v2: Shadow Mode Testing & Rollout Guide

## Shadow Mode Testing (Step 6)

Shadow mode allows you to run both Phase 10 v1 and v2 in parallel, compare their results, but always ship the v1 result. This is essential for collecting comparison metrics without risk.

### Enabling Shadow Mode

To enable shadow mode, update `config.ts`:

```typescript
refinement: {
  // ... existing fields ...
  rewriteEnabled: false,        // Keep v1 as default
  rewriteShadowMode: true,      // Enable shadow mode
}
```

### Implementation Notes

Shadow mode is **NOT YET IMPLEMENTED** in the current codebase. To implement it:

1. **Modify `runPhase10()` in SequentialLessonGenerator.ts:**

```typescript
private async runPhase10(...): Promise<RefinementOutput | null> {
  const config = getRefinementConfig();
  const strategy = getPhase10Strategy();
  
  // Shadow mode: run both v1 and v2
  if (config.rewriteShadowMode) {
    console.log('  🔬 [Shadow Mode] Running both v1 and v2 for comparison...');
    
    // Run v1 (will be shipped)
    const v1Result = await this.runPhase10Patch(lesson, rubricScore, debugCollector);
    
    // Run v2 (for analysis only)
    const v2DebugCollector = new DebugBundleCollector({...}); // Clone metadata
    const v2Result = await this.runPhase10Rewrite(lesson, rubricScore, v2DebugCollector);
    
    // Log comparison
    console.log('\n📊 [Shadow Mode] Comparison:');
    console.log(`   v1 Result: ${v1Result ? 'Success' : 'Failed'}`);
    console.log(`   v2 Result: ${v2Result ? 'Success' : 'Failed'}`);
    
    if (v1Result && v2Result) {
      console.log(`   v1 Score: ${v1Result.originalScore} → ${v1Result.refinedScore} (Δ${v1Result.refinedScore - v1Result.originalScore})`);
      console.log(`   v2 Score: ${v2Result.originalScore} → ${v2Result.refinedScore} (Δ${v2Result.refinedScore - v2Result.originalScore})`);
    }
    
    // Save v2 result to separate debug bundle
    await saveDebugBundle(v2DebugCollector.getBundle(), 'shadow-v2');
    
    // ALWAYS return v1 result in shadow mode
    return v1Result;
  }
  
  // Normal mode: route based on strategy
  if (strategy === 'rewrite') {
    return await this.runPhase10Rewrite(lesson, rubricScore, debugCollector);
  } else {
    return await this.runPhase10Patch(lesson, rubricScore, debugCollector);
  }
}
```

### Collecting Metrics

After running shadow mode for 20+ lessons, analyze:

1. **Validation Pass Rate:**
   - Count how many v2 attempts passed all validators
   - Target: ≥90% pass rate

2. **Score Improvements:**
   - Compare v1 and v2 score deltas
   - Check if v2 consistently improves scores

3. **Structural Breaks:**
   - Count v2 structural invariant violations
   - Target: Zero structural breaks

4. **Token Usage:**
   - Monitor v2 token consumption (expect 2-3x v1 due to full lesson)
   - Ensure it stays within limits

5. **Time per Refinement:**
   - Measure v2 execution time vs v1

### Analysis Script Example

```typescript
// scripts/analyze-shadow-mode.ts
import * as fs from 'fs';
import * as path from 'path';

const debugRunsDir = path.join(__dirname, '../quiz-app/src/data/diagnostics/debug_runs');
const shadowFiles = fs.readdirSync(debugRunsDir).filter(f => f.includes('shadow-v2'));

const metrics = {
  v2PassCount: 0,
  v2FailCount: 0,
  v1Improvements: [],
  v2Improvements: [],
  structuralBreaks: 0,
};

shadowFiles.forEach(file => {
  const bundle = JSON.parse(fs.readFileSync(path.join(debugRunsDir, file), 'utf-8'));
  
  if (bundle.phase10v2) {
    if (bundle.phase10v2.accepted) {
      metrics.v2PassCount++;
      metrics.v2Improvements.push(bundle.phase10v2.scoreDelta);
    } else {
      metrics.v2FailCount++;
      if (bundle.phase10v2.validationFailures.some(f => f.includes('changed'))) {
        metrics.structuralBreaks++;
      }
    }
  }
  
  if (bundle.phase10?.accepted) {
    const v1Delta = bundle.phase10.refined.score.total - bundle.baseline.score.total;
    metrics.v1Improvements.push(v1Delta);
  }
});

console.log('Shadow Mode Analysis:');
console.log(`v2 Pass Rate: ${(metrics.v2PassCount / (metrics.v2PassCount + metrics.v2FailCount) * 100).toFixed(1)}%`);
console.log(`v2 Avg Improvement: ${(metrics.v2Improvements.reduce((a,b) => a+b, 0) / metrics.v2Improvements.length).toFixed(2)} points`);
console.log(`v1 Avg Improvement: ${(metrics.v1Improvements.reduce((a,b) => a+b, 0) / metrics.v1Improvements.length).toFixed(2)} points`);
console.log(`Structural Breaks: ${metrics.structuralBreaks}`);
```

---

## Staged Rollout (Step 7)

Once shadow mode results are satisfactory, proceed with staged rollout:

### Phase A: Shadow Mode (2-3 days)

**Status:** Not started

**Actions:**
1. Implement shadow mode (see above)
2. Set `rewriteShadowMode: true` in config
3. Generate 20-25 lessons across different units
4. Run analysis script daily
5. Fix any v2 issues discovered
6. Review debug bundles for failure patterns

**Success Criteria:**
- v2 validation pass rate ≥90%
- v2 score improvements ≥ v1 score improvements
- Zero structural breaks
- No `[object Object]` corruptions
- No catastrophic explanation wipes

---

### Phase B: Opt-in v2 (1-2 days)

**Status:** Not started (pending Phase A completion)

**Actions:**
1. Disable shadow mode: `rewriteShadowMode: false`
2. Enable v2: `rewriteEnabled: true`
3. Generate 10-15 lessons
4. Verify no regressions
5. Monitor debug bundles closely
6. Be ready to rollback if issues arise

**Rollback Procedure:**
```typescript
// In config.ts, immediately set:
rewriteEnabled: false  // Reverts to v1
```

**Success Criteria:**
- All generated lessons pass validation
- Scores improve consistently
- No user-facing issues
- Token usage within acceptable limits

---

### Phase C: v2 Default + v1 Deprecation (1 day)

**Status:** Not started (pending Phase B completion)

**Actions:**
1. Keep `rewriteEnabled: true` as default
2. Add deprecation warning to v1:

```typescript
private async runPhase10Patch(...): Promise<RefinementOutput | null> {
  console.warn('⚠️  [Phase 10 v1] Running deprecated patch-based refinement. Consider migrating to v2 (rewrite strategy).');
  // ... rest of v1 code
}
```

3. Update documentation to recommend v2
4. Keep v1 code for emergency fallback
5. Monitor for 1 week in production

**Success Criteria:**
- v2 proven stable over 50+ generations
- No critical issues requiring v1 fallback
- Team confidence in v2 implementation

---

### Phase D: v1 Removal (1 week after Phase C)

**Status:** Not started (pending Phase C completion)

**Actions:**
1. Delete `runPhase10Patch()` method
2. Remove patch-based code from `Phase10_Refinement.ts`
3. Remove `strategy` config field (v2 is only implementation)
4. Update imports and type definitions
5. Remove patch-related types and utilities
6. Clean up debug bundle fields for v1

**Files to Modify:**
- `SequentialLessonGenerator.ts` (remove `runPhase10Patch`)
- `config.ts` (remove `strategy`, `rewriteEnabled` - v2 is default)
- `types.ts` (remove `RefinementPatch` and patch-related types)
- `Phase10_Refinement.ts` (archive or delete file)

**Success Criteria:**
- Clean codebase with only v2 implementation
- All tests passing
- Documentation updated
- No references to v1 patch logic

---

## Current Implementation Status

### ✅ Completed
- [x] Step 0: Feature flag configuration
- [x] Step 1: Phase10_Rewrite.ts
- [x] Step 2: Phase10_Validators.ts
- [x] Step 3: Score gate
- [x] Step 4: Debug bundle integration
- [x] Step 5: Routing logic in SequentialLessonGenerator
- [x] Step 6: Unit tests

### ⏸️ Pending (Operational Tasks)
- [ ] **Shadow Mode Implementation:** Requires code changes to run both v1 and v2
- [ ] **Phase A:** Generate 20+ lessons in shadow mode, analyze metrics
- [ ] **Phase B:** Enable v2, generate 10+ lessons, verify no regressions
- [ ] **Phase C:** Run v2 as default for 1 week, monitor stability
- [ ] **Phase D:** Remove v1 code after v2 proven stable

---

## Testing the Current Implementation

### Quick Test (No Shadow Mode)

To test Phase 10 v2 immediately:

```typescript
// In config.ts:
rewriteEnabled: true
```

Then generate a lesson that will trigger Phase 10 (score < 97).

### Expected Behavior

1. Generator runs phases 1-9 normally
2. Lesson is normalized and scored
3. If score < 97:
   - Router checks strategy (now 'rewrite')
   - Calls `runPhase10Rewrite()`
   - Phase10_Rewrite builds prompts
   - LLM returns full refined lesson JSON
   - Validators run (structural, completeness, corruption)
   - Score gate checks if improvement
   - If all pass: refined lesson accepted
   - Else: original lesson kept (safe fallback)
4. Debug bundle saved with v2 fields

### Debug Output to Expect

```
🔄 [Phase10v2] Starting holistic rewrite...
🔄 [Phase10v2] Original score: 95/100
🔄 [Phase10v2] Calling LLM for holistic rewrite...
🔄 [Phase10v2] Parsing LLM response (45678 chars)...
🔄 [Phase10v2] Successfully parsed candidate lesson
🔄 [Phase10v2] Running hard validators...
✅ [Phase10v2] All hard validators passed
🔄 [Phase10v2] Scoring candidate lesson...
📊 [Phase10v2] Candidate score: 98/100
📊 [Phase10v2] Score delta: +3
✅ [Phase10v2] Score gate PASSED: score improved by 3 points
    ✓ Candidate accepted (score: 95 → 98, Δ+3)
```

---

## Troubleshooting

### v2 Always Fails Validation

**Check:**
- Are validators too strict?
- Review debug bundle to see which validator failed
- Examine LLM output for structural violations

**Fix:**
- Adjust validator thresholds if reasonable
- Improve system prompt if LLM ignoring instructions

### v2 Score Always Decreases

**Check:**
- Is LLM making wrong changes?
- Review scoring report vs candidate changes

**Fix:**
- Improve user prompt with more specific issues
- Adjust scoring rubric if too harsh

### v2 Uses Too Many Tokens

**Check:**
- Current token limit: 24000
- Full lesson JSON can be large

**Fix:**
- Consider truncating very long explanation content in prompt
- Or accept higher token cost as trade-off for holistic view

### v2 Takes Too Long

**Check:**
- LLM call time for 24K token output

**Fix:**
- Consider streaming response (if supported)
- Or accept longer time as trade-off for better quality

---

## Support

For questions or issues during rollout:

1. Check debug bundles first (`.json` and `.md` files)
2. Review validation failures and score comparisons
3. Test with different lesson types
4. Rollback to v1 if critical issues

Remember: **v1 remains available as fallback** until Phase D completion.
