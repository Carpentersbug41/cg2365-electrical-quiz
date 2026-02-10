# Phase 10: answerType Safety Fix

## Problem Identified

Phase 10 generated a patch changing `answerType` from `"short-text"` to `"long-text"`, which caused a **-4 point score drop** because:
- Long-text grading requires a different contract/rubric (essay scoring)
- The grading system doesn't have the proper infrastructure for long-text yet
- Changing answerType breaks the grading contract without corresponding backend changes

## Root Cause

1. **Scorer suggested answerType change** when detecting questions that needed longer answers
2. **Phase 10 applied the patch** without understanding it breaks grading
3. **No validation gate** prevented contract-breaking changes

## Fixes Implemented

### 1. ✅ Block answerType Patches in Phase 10 (CRITICAL)

**File:** `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts`

**Change:** Added early rejection in `convertLLMPatches()`:
```typescript
// CRITICAL: Block answerType changes - these break grading contract
if (llmPatch.path.endsWith('.answerType')) {
  console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} - answerType changes are NOT allowed in Phase 10`);
  console.warn(`   ⊘ Reason: Changing answerType requires corresponding grading contract/rubric changes`);
  return; // Skip this patch
}
```

**Result:** Any patch targeting `.answerType` is immediately rejected with clear logging.

### 2. ✅ Update Scorer Prompt to Stop Suggesting answerType Changes

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`

**Changes:**
1. Added to "Not Allowed" list:
   - Change answerType (e.g., short-text → long-text) - breaks grading contract
   - Change block.order or block.type

2. Added explicit guidance:
```
⚠️ NEVER suggest changing answerType (e.g., short-text → long-text)
✓ INSTEAD: For questions needing longer answers:
  - Add instructions to questionText: "Answer in 2-4 sentences..."
  - Tighten expectedAnswer to be more specific
  - Mark as "requiresRegeneration" if fundamental restructuring needed
```

**Result:** Scorer will now suggest improving questionText instead of changing answerType.

### 3. ✅ Fix False "TRUNCATION DETECTED" for Score Responses

**File:** `quiz-app/src/lib/generation/truncationDetector.ts`

**Problem:** Scorer outputs don't always have `"details"` field, but truncation detector required it, causing false positives.

**Fix:** Made schema check more flexible:
```typescript
else if (type === 'score') {
  // Score responses have variable schema - check for either "details" OR "total" or "issues"
  const hasScoreFields = trimmed.includes('"total"') || trimmed.includes('"issues"') || trimmed.includes('"details"');
  if (!hasScoreFields) {
    issues.push('Score response missing expected fields (total, issues, or details)');
  }
  // Note: "details" is optional in some score formats
}
```

**Result:** No more false truncation warnings for valid score responses.

### 4. ✅ High-Risk Patch Gate (Defense in Depth)

**File:** `quiz-app/src/lib/generation/patchValidator.ts`

**Added validation for contract-breaking changes:**
```typescript
const highRiskPatterns = [
  { pattern: /\.answerType$/, name: 'answerType', reason: 'breaks grading contract' },
  { pattern: /\.order$/, name: 'block order', reason: 'changes lesson sequence' },
  { pattern: /blocks\[\d+\]\.type$/, name: 'block type', reason: 'changes block contract' },
];
```

**Result:** Multiple layers of protection against dangerous patches.

## Test Coverage

All tests passing (21/21):
- ✅ Original replaceSubstring tests (5)
- ✅ Content wipe safety gate tests (4)
- ✅ Post-patch heading validation tests (3)
- ✅ Path collision detection tests (2)
- ✅ **NEW: answerType safety gate tests (2)**
- ✅ **NEW: High-risk patch gate tests (4)**
- ✅ Patch validator updates (1)

### New Tests Added

```typescript
describe('Phase 10 Refinement - answerType Safety Gate', () => {
  it('should reject patches that change answerType')
  it('should allow other patches to pass through')
});

describe('Phase 10 Refinement - High-Risk Patch Gate', () => {
  it('should reject answerType changes via validator')
  it('should reject block order changes')
  it('should reject block type changes')
  it('should allow safe patches')
});
```

## Expected Behavior After Fix

### Before Fix
```
Patch 1: expectedAnswer → applied (+2 points)
Patch 2: answerType: "short-text" → "long-text" → applied (-4 points)
Final score: -2 points (net negative)
```

### After Fix
```
Patch 1: expectedAnswer → applied (+2 points)
Patch 2: answerType change → REJECTED by safety gate
Final score: +2 points (positive improvement)
```

## Verification Checklist

When running the same lesson that failed:

- [x] ✅ Phase 10 still applies expectedAnswer patches (good patches)
- [x] ✅ Phase 10 rejects answerType patches with clear logging
- [x] ✅ No more false "TRUNCATION DETECTED: score response missing details"
- [x] ✅ Final score does not drop due to Phase 10
- [x] ✅ All 21 tests pass

## Files Modified

1. `Phase10_Refinement.ts` - Added answerType rejection in convertLLMPatches()
2. `llmScoringService.ts` - Updated scorer prompt to forbid answerType suggestions
3. `truncationDetector.ts` - Fixed score response validation
4. `patchValidator.ts` - Added high-risk patch gate
5. `__tests__/phase10-refinement.test.ts` - Added 6 new tests

## Defense Layers

Now we have **3 layers of protection** against answerType changes:

1. **Layer 1 (Scorer):** Scorer told not to suggest answerType changes
2. **Layer 2 (Phase 10):** Phase 10 filters out answerType patches immediately
3. **Layer 3 (Validator):** Patch validator rejects high-risk patches

## Future Work

When long-text grading is implemented:
1. Implement essay scoring rubric/contract
2. Add backend support for long-text evaluation
3. Update grading service to handle long-text answerType
4. **Only then** can we allow answerType changes via Phase 10
5. Will need to update the high-risk gate to allow it conditionally

## Impact

- **Immediate:** Prevents -4 point score drops from answerType changes
- **Broader:** Protects against any contract-breaking changes (order, type, answerType)
- **Reliability:** Reduces false positive truncation warnings
- **Maintainability:** Clear logging shows exactly why patches are rejected

---

**Implementation Date:** 2026-02-06  
**Status:** ✅ COMPLETE & TESTED (21/21 tests pass)  
**Risk:** LOW (purely defensive, no breaking changes)  
**Priority:** CRITICAL (prevents known -4 point score regression)
