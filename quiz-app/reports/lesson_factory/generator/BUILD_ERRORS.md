# Lesson Generator Quiz Parsing Issue - Debug Report

**Date**: 2026-01-25  
**Status**: ✅ FIXED - Build errors resolved, ready for testing  
**Issue**: `Failed to parse quiz questions: Expected property name or '}' in JSON at position 10 (line 3 column 5)`

---

## Problem Summary

The lesson generator is failing during quiz generation with a JSON parsing error. The error occurs when trying to parse the LLM's response containing quiz questions.

---

## Root Causes Identified

### 1. **Token Limit Too Low** ⚠️ CRITICAL
- **Issue**: `maxOutputTokens` was set to 4000 for quiz generation
- **Impact**: LLM responses were being **truncated mid-sentence**, cutting off the JSON before it could close properly
- **Evidence from logs**:
  - Response ends with `"Power` (incomplete word)
  - `endsWithBracket: false`, `lastChar: "r"`
  - 133+ characters lost from truncation
  - Response was 7764 chars but got cut to 7631 chars by regex

### 2. **JavaScript vs JSON Syntax Mismatch**
- **Issue**: LLM generates JavaScript object syntax (unquoted keys: `id: 4051`) but code tries to parse as JSON (`"id": 4051`)
- **Impact**: When eval() fails, JSON.parse() fallback fails because keys aren't quoted
- **Evidence**: `contentLine3: "    id: 4051,"` shows unquoted key at position 10

### 3. **Regex Array Extraction Issue**
- **Issue**: When response is truncated, the regex `/\[[\s\S]*\]/` matches to the FIRST `]` it finds inside the JSON
- **Impact**: Further truncates an already incomplete response
- **Evidence**: Regex matched 7631 chars from 7764 char response (133 char loss)

---

## What We've Done

### Debug Instrumentation Added ✅
Comprehensive logging added to track every step:

1. **Batch start** - Configuration, difficulty, token limits
2. **LLM generation config** - Model, maxTokens, temperature
3. **Raw LLM response** - Full start/end, length, token usage, finish reason
4. **After extraction** - What extractTypeScriptArray returns
5. **Bracket checking** - Proper bracketing validation
6. **Eval attempt** - Success/failure tracking
7. **JSON.parse fallback** - Complete error details with full content

**Files with instrumentation**:
- `src/lib/generation/fileGenerator.ts` - 9 debug log points
- `src/lib/generation/utils.ts` - 7 debug log points in extractTypeScriptArray

### Fix Applied ✅
```typescript
// fileGenerator.ts line 238
const maxTokens = type === 'lesson' ? 8000 : 8000; // Changed from 4000 to 8000
```

---

## Current Status

### ✅ Completed
1. Added comprehensive debug logging throughout the pipeline
2. Identified token limit as primary issue (4000 → 8000 tokens)
3. Identified unquoted key syntax as secondary issue
4. Applied token limit fix
5. **Fixed TypeScript build error** - Removed usageMetadata access that wasn't in wrapper interface
6. **Build passes** - `npm run build` completes successfully

### 🔄 Needs Verification
1. **Test the fix** - Need to run generation to confirm 8000 tokens is sufficient
2. **Check finish reason** - Logs will show if LLM is still hitting limits
3. **Verify eval() success** - Logs will show if JavaScript syntax works with eval()

### ⚠️ Potential Next Steps (if current fix fails)

#### Option A: If still truncated (finish reason shows token limit)
- Increase to 10000 or 12000 tokens
- Or reduce batch size from 15/10/5 to 10/10/5

#### Option B: If JavaScript syntax causes other issues
- Change prompt to explicitly request JSON with quoted keys
- Update all misconceptionCodes keys to use strings ("1": not 1:)
- This was attempted before but needs proper prompt engineering

#### Option C: If regex continues to truncate
- Fix extractTypeScriptArray to check for proper bracketing FIRST
- Only use regex as absolute fallback
- Current code has the check but needs testing

---

## Debug Log Analysis

### Key Evidence from Last Run

```json
// Token limit was 4000 (TOO LOW)
{"maxOutputTokens":4000}

// Response was truncated
{"endsWithBracket":false,"lastChar":"r"}

// Lost 133 characters
{"contentLength":7764} → {"matchedLength":7631}

// Unquoted keys (JavaScript syntax)
{"contentLine3":"    id: 4051,"}

// Error at position 10 (the unquoted 'id')
{"parseError":"Expected property name or '}' in JSON at position 10"}
```

---

## Testing Checklist

When testing the fix, check these log entries:

1. **LLM GENERATION CONFIG** - Should show `maxOutputTokens: 8000` ✓
2. **LLM RESPONSE RECEIVED** - Check `finishReason` (should be "STOP", not "MAX_TOKENS")
3. **RAW LLM RESPONSE** - Check `endsWithBracket: true` and `lastChar: "]"`
4. **AFTER EXTRACTION** - Should have `differenceFromRaw: 0` (no chars lost)
5. **EVAL SUCCESS** or **JSON.parse SUCCESS** - One should succeed
6. **BATCH START** through all 6 batches - All should complete

---

## Technical Details

### Files Modified
- `src/lib/generation/fileGenerator.ts` - Token limit increased, debug logs added
- `src/lib/generation/utils.ts` - extractTypeScriptArray with comprehensive logging

### Prompt Configuration
Current prompts request "TypeScript/JavaScript array syntax" which produces:
```javascript
[
  {
    id: 4051,  // ← Unquoted keys (valid JS, invalid JSON)
    question: "...",
    // ...
  }
]
```

This works with eval() but fails with JSON.parse().

### Parsing Strategy
1. Try eval() first (handles JavaScript syntax)
2. Fall back to JSON.parse() if eval fails
3. Return error if both fail

---

## Build Fix Applied

### TypeScript Error Fixed
**Error**: `Property 'usageMetadata' does not exist on type '{ text(): string; }'`  
**Location**: Line 263 in `fileGenerator.ts`  
**Cause**: Debug logging tried to access metadata not exposed by LLM client wrapper  
**Fix**: Simplified debug log to only use available properties (textLength, textStart, textEnd, isEmpty)

### Build Status
✅ **Build passes**: `npm run build` completes without errors  
✅ **TypeScript compilation**: No type errors  
⚠️ **Lint warnings**: Only unused variable warnings (non-blocking)

## Next Actions

1. **Test generation** with current fix (8000 tokens)
2. **Review debug logs** to verify:
   - No truncation (endsWithBracket: true)
   - Eval succeeds (questionCount shows proper count)
   - All 6 batches complete (15+25+10 = 50 questions)
3. **If successful**: Remove debug instrumentation
4. **If failed**: Analyze new logs and apply Option A/B/C above

---

## Log File Location

Debug logs are written to: `c:\Users\carpe\Desktop\hs_quiz\.cursor\debug.log`

After each test run, read this file to see the complete execution trace.

---

## Summary for New Chat

**Problem**: Quiz generation fails with JSON parsing error  
**Root Cause**: Token limit too low (4000) + JavaScript syntax vs JSON mismatch  
**Fix Applied**: Increased token limit to 8000  
**Status**: Needs testing to confirm fix works  
**Debug**: Comprehensive logging active in both files  

If generation still fails, the debug logs will show:
- Whether we're still hitting token limits (check finishReason)
- Where exactly truncation happens (check content end)
- Whether eval succeeds with JavaScript syntax

The next person can read the debug.log file and see exactly what's happening at each step.
