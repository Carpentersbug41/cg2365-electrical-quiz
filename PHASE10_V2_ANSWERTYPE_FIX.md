# Phase 10 v2: Invalid AnswerTypes Fixed

## Status: ✅ FIXED

Fixed Phase 10 v2 system prompt to explicitly list valid answerTypes and prevent LLM from using invalid types.

---

## Problem Identified

**From terminal output (lines 358-362):**
```
❌ [Phase10v2] Validation failed:
   - 203-3A2-practice question 3: invalid answerType "numeric"
   - 203-3A2-integrative question 0: invalid answerType "long-text"
   - 203-3A2-integrative question 1: invalid answerType "long-text"
```

The LLM was inventing invalid answerTypes because the system prompt didn't explicitly list which types are valid.

---

## Solution Implemented

**File:** `quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts`

**System Prompt (lines 233-238):**

**Before:**
```typescript
ANSWER TYPE RULES:
- Do NOT change answerType unless you also update the question's grading expectations so marking remains robust.
- Prefer keeping answerType unchanged and improving hints/expectedAnswer variants unless explicitly required.
```

**After:**
```typescript
ANSWER TYPE RULES (CRITICAL):
- VALID answerTypes: "short-text", "multiple-choice", "calculation", "true-false"
- NEVER use: "numeric", "long-text", "essay", "open-ended", or any other type
- Do NOT change answerType unless you also update the question's grading expectations so marking remains robust.
- Prefer keeping answerType unchanged and improving hints/expectedAnswer variants unless explicitly required.
- If you must change answerType, use ONLY one of the 4 valid types above.
```

---

## Why This Works

### The 4 Valid AnswerTypes

1. **`"short-text"`** - Brief text answers (1-3 words)
2. **`"multiple-choice"`** - Select from options
3. **`"calculation"`** - Numeric calculations with units
4. **`"true-false"`** - Boolean questions

These are the only types supported by the marking system.

### Examples of Invalid Types (Now Explicitly Forbidden)

- ❌ `"numeric"` - LLM invented this (probably meant "calculation")
- ❌ `"long-text"` - LLM invented this (not supported by marking system)
- ❌ `"essay"` - Not supported
- ❌ `"open-ended"` - Not supported

### Validator Already Enforced This

The validator in `Phase10_Validators.ts` (lines 275-285) was already checking:

```typescript
const validAnswerTypes = ['short-text', 'multiple-choice', 'calculation', 'true-false'];
```

It correctly caught the LLM's invalid types. We just needed to tell the LLM which types are valid upfront.

---

## Expected Improvement

**Before fix:**
- LLM could invent answerTypes like "numeric", "long-text"
- Validators would catch and reject (correct but wasteful)
- Candidates rejected due to preventable mistakes

**After fix:**
- LLM knows the 4 valid answerTypes explicitly
- LLM knows which types to NEVER use (with examples)
- Should reduce validation rejections
- Should improve Phase 10 v2 success rate

---

## Testing

Next time Phase 10 v2 runs (score < 97), you should see:
- LLM uses only valid answerTypes
- Fewer validation rejections
- Higher acceptance rate for refined lessons

Monitor the console output for:
```
✅ [Phase10v2] All hard validators passed
✅ [Phase10v2] Score gate PASSED: score improved by X points
    ✓ Candidate accepted
```

---

## Files Modified

- `quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts` (5 lines added to system prompt)

**Total:** 1 file, 5 lines, no linting errors

---

## Confirmation

✅ Phase 10 v2 is still the default strategy
✅ v1 is still offline
✅ System prompt now explicitly lists valid answerTypes
✅ LLM should no longer invent invalid types
✅ Validators remain unchanged (already correct)

**Ready for next generation run to test the fix!**

---

**Implementation Date:** 2026-02-06
**Status:** Fixed and ready for testing
