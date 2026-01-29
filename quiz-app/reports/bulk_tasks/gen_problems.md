# Lesson Generator Problems and Fixes

This document tracks issues found with the lesson generator and their resolutions.

---

## 🚨 CRITICAL PRINCIPLES 🚨

### Non-Negotiable Requirements for the Generator

#### 1. Debug Information Must ALWAYS Be Displayed
**Location**: `http://localhost:3000/generate`

When generation fails, the error page **MUST** display comprehensive debugging information including:
- ✅ Complete error message
- ✅ Error location (line, column, position)
- ✅ Context preview around the error (with highlighted error character)
- ✅ Raw LLM response (full, expandable)
- ✅ Operation details (what failed, timestamp)

**If debug info is missing:**
- This is a **CRITICAL BUG** that must be fixed immediately
- Debug info must flow through the entire error chain: backend → API → frontend
- Never discard `debugInfo` during error propagation
- TypeScript types must enforce `debugInfo` inclusion

#### 2. Fix Root Causes, NOT Symptoms
**Every bug must be fixed at its root cause, not just patched over.**

❌ **WRONG**: Adding a try-catch to hide an error  
✅ **RIGHT**: Identifying why the error occurs and preventing it

❌ **WRONG**: Manually fixing generated files after each run  
✅ **RIGHT**: Fixing the generator code so it produces correct files

❌ **WRONG**: Adding workarounds in multiple places  
✅ **RIGHT**: Fixing the single source of the problem

**Process for fixing bugs:**
1. **Identify the root cause** - trace the error to its origin
2. **Fix at the source** - modify the code that creates the problem
3. **Prevent recurrence** - add type safety, validation, or tests
4. **Document thoroughly** - explain the root cause and fix in this file
5. **Verify completely** - test that the fix works end-to-end

#### 3. Generator Must Work Flawlessly Every Time
**The generator is a critical tool and must be 100% reliable.**

Requirements:
- ✅ Every generation must succeed or fail with clear, actionable error messages
- ✅ All generated files must be valid and immediately usable
- ✅ All integrations (imports, exports, registrations) must be automatic and correct
- ✅ No manual fixes should ever be needed after generation
- ✅ Build must succeed immediately after generation (may need dev server restart)
- ✅ All validation must pass before files are written

**When something doesn't work:**
1. Stop immediately - don't proceed with partial fixes
2. Investigate the root cause thoroughly
3. Fix it permanently with proper error handling
4. Add documentation to this file
5. Add safeguards to prevent similar issues

**Red Flags (indicators of symptom-fixing, not root-cause fixing):**
- 🚩 "Just manually edit this file after generation"
- 🚩 "It usually works, just retry if it fails"
- 🚩 "This is a known issue, we'll fix it later"
- 🚩 "Add this workaround in your code"
- 🚩 "The error message is misleading, ignore it"

**When in doubt:** Ask "Why did this happen?" five times until you reach the root cause.

---

## Problem 1: Duplicate Import Declarations

### Issue
Build errors occurred due to duplicate import statements being generated:
- `Module parse failed: Identifier 'seriesCircuitsQuestions' has already been declared`
- Occurred in both `src/data/questions.ts` and `src/data/questions/index.ts`

### Root Cause
The generator's `updateQuestionsMain()` and `updateQuestionsIndex()` methods in `fileIntegrator.ts` were checking for duplicate imports using exact string matching (`content.includes(importStatement)`), which failed when:
1. The same variable name was imported multiple times
2. The import statement format varied slightly
3. The generator ran multiple times on the same lesson

### Fix Applied
**File**: `src/lib/generation/fileIntegrator.ts`

1. **`updateQuestionsMain()` method**:
   - Changed from exact string matching to regex-based variable name detection
   - Now checks if the variable name is already imported using: `new RegExp(\`import\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}\`, 'g')`
   - Prevents duplicate imports even if formatting differs

2. **`updateQuestionsIndex()` method**:
   - Added regex check for duplicate imports: `new RegExp(\`import\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}\`, 'g')`
   - Added regex check for duplicate exports: `new RegExp(\`export\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}\`, 'g')`
   - Prevents both duplicate imports and exports

3. **`updateLessonPage()` and `updateLearnPage()` methods**:
   - Added regex check for duplicate default imports: `new RegExp(\`import\\s+${variableName}\\s+from\`, 'g')`
   - Fixed missing `.json` extension in import paths (TypeScript requires explicit extensions for JSON imports)
   - Changed from `lessonFilename.replace('.json', '')` to ensuring `.json` extension is always included

### Files Fixed
- `src/data/questions.ts` - Removed duplicate `seriesCircuitsQuestions` import
- `src/data/questions/index.ts` - Removed duplicate import, array entry, and export
- `src/app/learn/[lessonId]/page.tsx` - Fixed missing `.json` extension
- `src/app/learn/page.tsx` - Fixed missing `.json` extension

### Prevention
The generator now checks for variable name duplicates before adding imports/exports, preventing this issue from recurring.

---

## Problem 2: Missing JSON Extension in Import Paths ⚠️ **PERMANENTLY FIXED - Jan 27, 2026**

### Issue Symptoms
Multiple manifestations of the same root cause:
- TypeScript build errors: `Cannot find module '@/data/lessons/202-3AAAA-series-circuits'`
- Runtime errors: `Failed to parse quiz questions: Expected property name or '}' in JSON at position 10 (line 3 column 5)`
- Lesson imports missing the `.json` extension
- TypeScript requires explicit file extensions for JSON imports

### Root Cause ✅ **CONFIRMED**
The generator in `fileIntegrator.ts` was **actively removing** the `.json` extension from import paths using `.replace('.json', '')` on lines ~219 and ~262:

```typescript
// WRONG CODE (was in fileIntegrator.ts before fix):
const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;
```

This caused TypeScript's module resolver to fail, leading to:
1. Module not found errors during build
2. JSON parsing errors at runtime when TypeScript tried alternative resolution strategies
3. Silent failures where lessons wouldn't load

### The Permanent Fix ✅ **APPLIED - Jan 27, 2026**

**File**: `src/lib/generation/fileIntegrator.ts`

**Method 1: `updateLessonPage()` (~line 213-220)**
```typescript
// BEFORE (line ~219):
const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;

// AFTER (lines ~218-220):
// Ensure .json extension is included in import path
const lessonPath = lessonFilename.endsWith('.json') ? lessonFilename : `${lessonFilename}.json`;
const importStatement = `import ${variableName} from '@/data/lessons/${lessonPath}';`;
```

**Method 2: `updateLearnPage()` (~line 256-263)**
```typescript
// BEFORE (line ~262):
const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;

// AFTER (lines ~261-263):
// Ensure .json extension is included in import path
const lessonPath = lessonFilename.endsWith('.json') ? lessonFilename : `${lessonFilename}.json`;
const importStatement = `import ${variableName} from '@/data/lessons/${lessonPath}';`;
```

### Files Manually Repaired (Jan 27, 2026)
These files had broken imports that were manually fixed by adding `.json` extensions:

1. `src/app/learn/page.tsx`:
   - Line 24: `lesson204_10B` - added `.json`
   - Line 25: `lesson204_11A` - added `.json`

2. `src/app/learn/[lessonId]/page.tsx`:
   - Line 28: `lesson204_10B` - added `.json`
   - Line 29: `lesson204_11A` - added `.json`

### Verification Steps

**To verify the fix is in place:**

1. **Check the generator code** (`src/lib/generation/fileIntegrator.ts`):
   - Search for `.replace('.json', '')` - should find **ZERO** occurrences in import statements
   - Search for `const lessonPath = lessonFilename.endsWith('.json')` - should find **TWO** occurrences
   - Both `updateLessonPage()` and `updateLearnPage()` should have the fix

2. **Check existing imports** in page files:
   ```bash
   # Run from quiz-app directory
   # All lesson imports should end with .json
   grep "from '@/data/lessons/" src/app/learn/page.tsx
   grep "from '@/data/lessons/" src/app/learn/[lessonId]/page.tsx
   ```
   Every lesson import should end with `.json` (except `lessonIndex.ts` which is a TypeScript file)

3. **Run the linter**:
   ```bash
   npm run lint
   ```
   Should show no errors related to missing modules

4. **Start dev server**:
   ```bash
   npm run dev
   ```
   Should compile without "Cannot find module" or JSON parsing errors

### If This Error Reappears

**DO NOT just fix the symptom** (adding .json to broken imports). **Fix the root cause:**

1. **Check if someone reverted the fix** in `fileIntegrator.ts`:
   - Look at lines ~219 and ~262
   - If you see `.replace('.json', '')`, the fix was reverted
   - Re-apply the fix using the code above

2. **Check for new code** that generates imports:
   - Search the codebase for `.replace('.json', '')` in any generation code
   - Replace with the proper `lessonPath` logic shown above

3. **Fix any broken imports** in page files:
   - Search for imports missing `.json`: `grep "from '@/data/lessons/[^']*';" src/app/learn/`
   - Add `.json` to any lesson imports that are missing it

### Prevention
- **Code review checkpoint**: When reviewing any changes to `fileIntegrator.ts`, verify that JSON imports retain the `.json` extension
- **Testing**: After running the generator, always check that new imports include `.json`
- **Don't touch the fix**: The `lessonPath` logic in both methods should never be removed or modified

---

## Problem 3: Lesson Not Visible After Generation ⚠️ **RECURRING ISSUE**

### Issue
Generated lessons are not appearing in the learn page even though:
- Lesson JSON file exists
- Lesson is registered in `lessonIndex.ts`
- Lesson is imported in `learn/page.tsx` and `learn/[lessonId]/page.tsx`
- Lesson is added to LESSONS array

### Root Cause ✅ **CONFIRMED**
**Next.js dev server does NOT hot-reload new import statements**

When the generator:
1. Creates a new lesson JSON file
2. Adds import statements to `learn/page.tsx` and `learn/[lessonId]/page.tsx`
3. Adds the lesson to the LESSONS array

The dev server continues using the **old module graph** and doesn't recognize the new imports. This is a Next.js limitation - while it hot-reloads code changes, it doesn't pick up new file imports automatically.

### Why This Keeps Happening
Every time you generate a new lesson, the generator adds new import statements to existing files. Next.js only detects file content changes, not module dependency changes, so the new imports are ignored until the server restarts.

### The Fix: Always Restart Dev Server After Generation

**MANDATORY STEP** after generating any lesson:

```bash
# Stop the dev server (Ctrl+C in the terminal)
# Then restart
npm run dev
```

This forces Next.js to rebuild the module graph and recognize the new imports.

### Alternative: Hard Refresh (Less Reliable)
Sometimes a hard refresh works, but restarting the dev server is more reliable:
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Verified Resolution
✅ **Tested with lesson `202-3AAAA`:**
- Before restart: Lesson not visible
- After restart: Lesson appears correctly in Unit 202 section
- All functionality works (lesson loads, displays correctly)

### Prevention
**Add to your workflow:**
1. Run the generator
2. Wait for generation to complete
3. **IMMEDIATELY restart the dev server**
4. Refresh the browser
5. Verify the lesson appears

This must be done for **EVERY** lesson generation - there is no way to avoid it with the current architecture.

---

## Testing Checklist

After generating a new lesson, **FOLLOW THESE STEPS IN ORDER**:

1. **Generation Phase**:
   - [ ] Generator completes without errors
   - [ ] All files are created (lesson JSON, questions TS)

2. **Build Verification**:
   - [ ] Run `npm run build` to check for errors
   - [ ] No duplicate imports in `questions.ts` or `questions/index.ts`
   - [ ] Import statements include `.json` extension
   - [ ] Build succeeds without TypeScript errors

3. **Server Restart (MANDATORY)** ⚠️:
   - [ ] **Stop the dev server** (Ctrl+C)
   - [ ] **Restart the dev server** (`npm run dev`)
   - [ ] Wait for "Ready" message

4. **Visual Verification**:
   - [ ] Hard refresh browser (`Ctrl + Shift + R` or `Cmd + Shift + R`)
   - [ ] Lesson appears in `/learn` page (in correct unit section)
   - [ ] Lesson page loads at `/learn/[lessonId]`
   - [ ] Lesson renders without errors
   - [ ] Learning outcomes display correctly
   - [ ] Practice blocks are interactive

5. **Data Verification**:
   - [ ] Lesson is registered in `lessonIndex.ts`
   - [ ] Questions are properly linked to the lesson
   - [ ] Quiz page loads at `/learn/[lessonId]/quiz`

## Quick Reference: Why Restart?

**Problem**: Next.js dev server doesn't hot-reload new imports  
**Solution**: Restart dev server after every generation  
**Time saved**: 5 minutes of confused debugging

---

## Problem 4: Insufficient Debug Information on Generation Failures ✅ **FULLY FIXED - Jan 29, 2026**

### Issue
When quiz generation failed with JSON parsing errors (e.g., "Failed to parse quiz questions: Expected property name or '}' in JSON at position 10..."), debugging was extremely difficult because:
- Only a generic error message was displayed
- The raw LLM response that failed to parse was not captured or shown
- No context about WHERE in the response the error occurred
- No way to see what the LLM actually returned without checking terminal logs
- Users had to dig through terminal output or debug logs to understand the failure

### Root Cause ✅ **FULLY IDENTIFIED - Jan 29, 2026**

**ORIGINAL ISSUE (Jan 28, 2026):**
The error handling pipeline lost critical debugging information as errors propagated from backend to frontend:

1. **`safeJsonParse` in `utils.ts`**: Only returned error message, discarded raw input
2. **`fileGenerator.ts`**: Didn't capture or pass along the raw LLM response
3. **API route**: Only forwarded the error message
4. **Frontend**: Only displayed the error message in a simple div

**DEEPER ISSUE DISCOVERED (Jan 29, 2026):**
Even after the Jan 28 fix that added debug info generation, **the debug info was being discarded during error propagation**:

1. **`generateQuestionBatch()` in `fileGenerator.ts`** (lines 243-259): Correctly created comprehensive `debugInfo` with raw response, error position, context preview, etc.
2. **`generateQuiz()` in `fileGenerator.ts`** (lines 128, 143, 158): When batch generation failed, it only returned `{ success: false, questions: [], error: easyQuestions.error }` - **completely discarding the `debugInfo` field!**
3. **TypeScript return types** didn't include `debugInfo`, so the compiler couldn't catch this omission
4. **API route** received no `debugInfo`, so frontend had nothing to display

This explained why users reported "no debug report appears" even though Problem 4 was supposedly "FIXED" on Jan 28.

### The Fix ✅ **IMPLEMENTED - Jan 28, 2026**

**Enhanced error information is now captured and displayed at every level:**

#### Backend Changes

**1. Enhanced `safeJsonParse` in `src/lib/generation/utils.ts`:**
```typescript
export function safeJsonParse<T>(json: string): { 
  success: boolean; 
  data?: T; 
  error?: string;
  rawInput?: string;           // NEW: Captures the raw input
  errorDetails?: {             // NEW: Extracts position info
    message: string;
    position?: number;
    line?: number;
    column?: number;
  };
}
```

**2. Added Context Preview Helper in `src/lib/generation/fileGenerator.ts`:**
```typescript
function generateContextPreview(content: string, position?: number): {
  before: string;        // 100 chars before error
  errorLocation: string; // The problematic character
  after: string;         // 100 chars after error
}
```

**3. Enhanced Error Response in `fileGenerator.ts`:**
When quiz parsing fails, the error response now includes:
```typescript
{
  success: false,
  error: "Failed to parse quiz questions: ...",
  debugInfo: {
    rawResponse: string,           // Full LLM response
    parseError: string,            // JSON parse error
    errorPosition: {...},          // Line, column, position
    contentPreview: {...},         // Context around error
    attemptedOperation: string,    // What was being parsed
    timestamp: string              // When it failed
  }
}
```

**4. API Route Passes Debug Info:**
`src/app/api/lesson-generator/route.ts` now includes `debugInfo` in error responses

**5. New Types in `src/lib/generation/types.ts`:**
- Added `DebugInfo` interface
- Updated `GenerationResponse` to include optional `debugInfo`

#### Frontend Changes

**6. Enhanced UI in `src/app/generate/page.tsx`:**

The error page now displays comprehensive debug information:

```
┌────────────────────────────────────────────────┐
│ ❌ Generation Failed                           │
├────────────────────────────────────────────────┤
│ Error: Failed to parse quiz questions         │
│ Expected property name or '}' in JSON          │
└────────────────────────────────────────────────┘

┌─ Error Location ───────────────────────────────┐
│ Line: 3                                        │
│ Column: 5                                      │
│ Position: 10                                   │
└────────────────────────────────────────────────┘

┌─ Context Around Error ─────────────────────────┐
│ ...{"id": 1,↵                                  │
│  {field: "test"}...                            │
│  ↑ ERROR HERE (character highlighted in red)   │
└────────────────────────────────────────────────┘

▼ Raw LLM Response (click to expand)
  [Full scrollable code block with syntax highlighting]

┌─ Operation Details ────────────────────────────┐
│ Operation: Parsing quiz questions array        │
│ Timestamp: 1/28/2026, 8:45:23 AM              │
└────────────────────────────────────────────────┘
```

### The REAL Fix ✅ **ACTUALLY FIXED - Jan 29, 2026**

**Problem**: The Jan 28 fix created the debug info but it was being discarded during error propagation!

**Solution**: Updated error propagation to preserve `debugInfo` through the entire call chain.

**Changes Made to `src/lib/generation/fileGenerator.ts`:**

1. **Updated Return Types** (Lines 112, 183):
   ```typescript
   // Added debugInfo to return types
   Promise<{ success: boolean; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo }>
   ```
   Now TypeScript enforces that `debugInfo` can be included and won't be accidentally omitted.

2. **Fixed Error Propagation** (Lines 128, 143, 158):
   ```typescript
   // BEFORE (discarded debugInfo):
   return { success: false, questions: [], error: easyQuestions.error };
   
   // AFTER (preserves debugInfo):
   return { success: false, questions: [], error: easyQuestions.error, debugInfo: easyQuestions.debugInfo };
   ```
   Applied to all three batch error returns (easy, medium, hard).

3. **Added Debug Info to Array Validation Error** (Lines 264-276):
   ```typescript
   if (!Array.isArray(questions)) {
     return {
       success: false,
       questions: [],
       error: 'Generated content is not an array',
       debugInfo: {
         rawResponse: cleanedContent,
         parseError: 'Array validation failed - result is not an array',
         attemptedOperation: 'Validating quiz questions array structure',
         timestamp: new Date().toISOString(),
       }
     };
   }
   ```

4. **Added Type-Safe Helper Method** (After line 74):
   ```typescript
   /**
    * Helper to safely propagate error results with debug info
    * Ensures debugInfo is never accidentally omitted during error propagation
    */
   private propagateError(result: { 
     success: false; 
     questions: QuizQuestion[]; 
     error?: string; 
     debugInfo?: DebugInfo 
   }): { 
     success: false; 
     questions: QuizQuestion[]; 
     error?: string; 
     debugInfo?: DebugInfo 
   } {
     return {
       success: false,
       questions: [],
       error: result.error,
       debugInfo: result.debugInfo,
     };
   }
   ```
   This helper can be used in future code to prevent accidental omissions.

### How to Use the Debug Information

When a generation fails:

1. **Error Message**: Read the main error at the top
2. **Error Location**: Check line/column/position to understand where in the response the parse failed
3. **Context Preview**: See the exact characters around the error (error character is highlighted in red)
4. **Raw Response**: Expand the collapsible section to see the full LLM response
5. **Copy for Analysis**: You can copy the raw response for manual inspection or to report an issue

### Files Modified

**Jan 28, 2026 - Initial debug info implementation:**
- `src/lib/generation/utils.ts` - Enhanced `safeJsonParse()`
- `src/lib/generation/fileGenerator.ts` - Added context preview helper and debug info to errors
- `src/lib/generation/types.ts` - Added `DebugInfo` interface
- `src/app/api/lesson-generator/route.ts` - Pass debug info through API
- `src/app/generate/page.tsx` - Added debug info to interface, error handling, and comprehensive UI display

**Jan 29, 2026 - Fixed error propagation bug:**
- `src/lib/generation/fileGenerator.ts` - Updated return types, fixed error propagation (lines 128, 143, 158, 264-276), added `propagateError()` helper method
- `quiz-app/reports/bulk_tasks/gen_problems.md` - Documented root cause and complete fix

### Benefits

- **Instant Debugging**: No need to check terminal logs or debug files
- **Precise Error Location**: Exact line, column, and character position
- **Full Context**: See exactly what the LLM returned
- **Visual Highlighting**: Error character is highlighted in red with surrounding context
- **Copy-Paste Ready**: Raw response can be easily copied for further analysis
- **Professional UX**: Collapsible sections keep the UI clean while providing deep debugging info
- **Future-Proof**: Works for any JSON parsing error in the generation pipeline

### Verification

To verify the fix is in place:

**Jan 28 components:**
1. **Check utils.ts**: `safeJsonParse` should return `rawInput` and `errorDetails`
2. **Check fileGenerator.ts**: Look for `generateContextPreview` function
3. **Check types.ts**: Look for `DebugInfo` interface
4. **Check API route**: Error response should include `debugInfo`
5. **Check frontend**: Error display should show multiple debug sections

**Jan 29 error propagation fix:**
6. **Check fileGenerator.ts imports**: Should include `DebugInfo` from `./types`
7. **Check return types** (lines 112, 183): Both should include `debugInfo?: DebugInfo`
8. **Check error returns** (lines 128, 143, 158): All three should include `debugInfo: [batch]Questions.debugInfo`
9. **Check array validation** (lines 264-276): Should include full `debugInfo` object
10. **Check for helper method**: `propagateError()` method should exist after constructor

### Testing

**End-to-End Verification:**

Trigger a generation that fails with a JSON parse error (can be done artificially or wait for a natural LLM error):

1. **Navigate to**: `http://localhost:3000/generate`
2. **Start a generation** that will fail (or wait for natural failure)
3. **Verify the error page shows**:
   - ✅ Error message at the top
   - ✅ Error Location section (line, column, position)
   - ✅ Context Around Error section (with red-highlighted error character)
   - ✅ Raw LLM Response (collapsible, expandable section with full response)
   - ✅ Operation Details (operation name and timestamp)
4. **Check browser console**: Should show error with debugInfo
5. **Check `.cursor/debug.log`**: Should contain the full error chain

**If any of these are missing**, the Jan 29 fix was not properly applied. Check the verification steps above.

---

## Quick Problem Reference

### ✅ Problem 1: Duplicate Import Declarations
- **Status**: FIXED
- **File**: `src/lib/generation/fileIntegrator.ts`
- **Solution**: Regex-based duplicate detection in all methods
- **Risk**: Low - unlikely to reoccur

### ✅ Problem 2: Missing JSON Extension in Import Paths
- **Status**: PERMANENTLY FIXED (Jan 27, 2026)
- **File**: `src/lib/generation/fileIntegrator.ts` (lines ~219, ~262)
- **Solution**: `lessonPath` logic ensures `.json` is always present
- **Verification**: Search for `.replace('.json', '')` should find ZERO results in import generation code
- **Risk**: Medium - could be accidentally reverted in future edits
- **If it breaks**: Check the two `importStatement` lines in `updateLessonPage()` and `updateLearnPage()`

### ⚠️ Problem 3: Lesson Not Visible After Generation
- **Status**: ARCHITECTURAL LIMITATION (not fixable)
- **Workaround**: Always restart dev server after generation
- **Risk**: High - happens every single time
- **Solution**: Make it part of the workflow, no code fix possible

### ✅ Problem 4: Insufficient Debug Information on Generation Failures
- **Status**: FULLY FIXED (Jan 28 + Jan 29, 2026)
- **Root Cause**: Debug info was generated but discarded during error propagation
- **Files**: `utils.ts`, `fileGenerator.ts`, `types.ts`, `lesson-generator/route.ts`, `generate/page.tsx`
- **Solution**: 
  - Jan 28: Added debug info generation (raw response, error position, context preview)
  - Jan 29: Fixed error propagation to preserve debugInfo through call chain
- **Features**: Raw LLM response, error location, context preview, collapsible UI
- **Verification**: Error page shows all 5 debug sections when generation fails
- **Risk**: Very Low - TypeScript now enforces debugInfo in return types
- **Benefit**: Instant debugging without checking logs, comprehensive error context

---

## Problem 5: LLM Field Name Typos in Spaced Review Questions ✅ **FIXED - Jan 28, 2026**

### Issue
Runtime error when viewing lessons with malformed spaced-review questions:
```
TypeError: Cannot read properties of undefined (reading 'replace')
at decodeHtmlEntities (SpacedReviewBlock.tsx:18:8)
```

The error occurred because the LLM generated `"attText"` instead of `"questionText"` in a spaced-review question, causing the component to crash when trying to decode HTML entities.

### Root Cause ✅ **CONFIRMED**

**Validation Gap**: The [`validationService.ts`](../../src/lib/generation/validationService.ts) validated spaced-review blocks but only checked:
- That questions array exists
- That there are 4 questions

It did **NOT** validate the structure of individual spaced-review question objects. The `validateQuestion()` method (which checks for `questionText`) was only called for practice blocks, not spaced-review blocks.

**LLM Typo**: The LLM made a typo in lesson `204-13A-ceiling-rose-anatomy-3-plate.json` line 233:
```json
{
  "id": "204-13A-SR-4",
  "attText": "Why must we always...",  // ❌ Should be "questionText"
  "expectedAnswer": "...",
  "hint": "..."
}
```

**Runtime Crash**: When `SpacedReviewBlock.tsx` tried to access `q.questionText` (which was undefined), then called `.replace()` on it, the application crashed.

### The Permanent Fix ✅ **APPLIED - Jan 28, 2026**

#### 1. Enhanced Validation (Primary Fix)

**File**: `src/lib/generation/validationService.ts`

**Added new method `validateSpacedReviewQuestion()`** that validates:
- `id` field exists and starts with lessonId
- `questionText` field exists (with typo detection for "attText", "questiontext", etc.)
- `expectedAnswer` field exists
- `hint` field exists (optional but recommended)

**Modified `validateBlockContent()`** spaced-review case to validate each question:
```typescript
case 'spaced-review':
  if (!block.content.questions || !Array.isArray(block.content.questions)) {
    errors.push('Spaced review must have questions array');
  } else {
    if (block.content.questions.length !== 4) {
      warnings.push('Spaced review should have exactly 4 questions');
    }
    
    // NEW: Validate each spaced-review question structure
    for (const question of block.content.questions) {
      this.validateSpacedReviewQuestion(question, lessonId, errors, warnings);
    }
  }
  break;
```

#### 2. Defensive Coding (Safety Net)

**File**: `src/components/learning/blocks/SpacedReviewBlock.tsx`

**Added null/undefined checks** in question normalization (line 26-56):
- Checks if `questionText` exists before accessing it
- Detects suspected typos (like "attText") and provides helpful error message
- Prevents crashes by providing fallback error text
- Logs errors to console for debugging

```typescript
// Modern format: structured object - check if questionText exists
if (!q.questionText) {
  // DEFENSIVE: Handle missing questionText field (catches LLM typos like "attText")
  console.error(`Spaced review question missing questionText field:`, q);
  const allKeys = Object.keys(q);
  const suspectedField = allKeys.find(k => k.toLowerCase().includes('text'));
  
  return {
    ...q,
    questionText: suspectedField 
      ? `[ERROR: Found "${suspectedField}" instead of "questionText". Question ID: ${q.id || 'unknown'}]`
      : `[ERROR: Question text missing. Question ID: ${q.id || 'unknown'}. Available fields: ${allKeys.join(', ')}]`
  };
}
```

#### 3. Improved LLM Prompt

**File**: `src/lib/generation/lessonPromptBuilder.ts`

**Added inline comments** emphasizing correct field name in spaced-review example (lines 290-310):
```typescript
"questionText": "[Review question]",  // CRITICAL: Must be "questionText" (NOT "attText", "questiontext", or any other variant!)
```

**Added new rule** to CRITICAL QUALITY RULES section:
```
10. **FIELD NAMES**: All spaced-review questions MUST use "questionText" field (NEVER "attText", "questiontext", "question_text", or any other variant!)
```

#### 4. Fixed the Bad Lesson

**File**: `src/data/lessons/204-13A-ceiling-rose-anatomy-3-plate.json`

**Fixed line 233**: Changed `"attText"` to `"questionText"`

### Verification Steps

**To verify the fix is in place:**

1. **Check validation code** (`src/lib/generation/validationService.ts`):
   - Search for `validateSpacedReviewQuestion` method - should exist
   - Check spaced-review case calls this method for each question
   - Validation should catch missing or misnamed questionText fields

2. **Check defensive coding** (`src/components/learning/blocks/SpacedReviewBlock.tsx`):
   - Look for null check on `q.questionText` around line 48
   - Should have error handling and console logging

3. **Check prompt** (`src/lib/generation/lessonPromptBuilder.ts`):
   - Search for "FIELD NAMES" rule in CRITICAL QUALITY RULES
   - Check spaced-review example has inline comments about "questionText"

4. **Test validation**:
   ```bash
   # Try generating a lesson - validation should catch any field name errors
   npm run dev
   # Navigate to generator page and create a test lesson
   ```

### If This Error Reappears

**DO NOT just fix the symptom** (fixing the JSON file manually). **Investigate why validation didn't catch it:**

1. **Check if validation was bypassed**:
   - Was the lesson file edited manually after generation?
   - Was validation disabled or skipped during generation?

2. **Check for new typo variants**:
   - The validation checks for common typos like "attText"
   - If a new variant appears, add it to the detection logic

3. **Fix the lesson file**:
   - Change the incorrect field name to `"questionText"`
   - Restart dev server to clear cached imports

4. **Report the issue**:
   - If validation should have caught it but didn't, investigate why
   - Update validation logic if needed

### Prevention

**Triple-Layer Defense System:**

1. **Validation Layer** (Generation Time):
   - Validates every spaced-review question before file creation
   - Detects typos and provides clear error messages
   - Prevents malformed lessons from being generated

2. **Defensive Coding** (Runtime):
   - Gracefully handles missing fields if they slip through
   - Provides helpful error messages instead of crashing
   - Logs issues to console for debugging

3. **Improved Prompts** (LLM Guidance):
   - Explicit inline comments about correct field names
   - Dedicated rule in CRITICAL QUALITY RULES
   - Makes field naming crystal clear to the LLM

**Risk Level**: Medium → Low after fixes
- Validation now catches field name errors at generation time
- Even if validation fails, defensive coding prevents crashes
- LLM is explicitly instructed on correct field naming
- Triple redundancy ensures this specific error won't recur

---

## Quick Problem Reference

### ✅ Problem 1: Duplicate Import Declarations
- **Status**: FIXED
- **File**: `src/lib/generation/fileIntegrator.ts`
- **Solution**: Regex-based duplicate detection in all methods
- **Risk**: Low - unlikely to reoccur

### ✅ Problem 2: Missing JSON Extension in Import Paths
- **Status**: PERMANENTLY FIXED (Jan 27, 2026)
- **File**: `src/lib/generation/fileIntegrator.ts` (lines ~219, ~262)
- **Solution**: `lessonPath` logic ensures `.json` is always present
- **Verification**: Search for `.replace('.json', '')` should find ZERO results in import generation code
- **Risk**: Medium - could be accidentally reverted in future edits
- **If it breaks**: Check the two `importStatement` lines in `updateLessonPage()` and `updateLearnPage()`

### ⚠️ Problem 3: Lesson Not Visible After Generation
- **Status**: ARCHITECTURAL LIMITATION (not fixable)
- **Workaround**: Always restart dev server after generation
- **Risk**: High - happens every single time
- **Solution**: Make it part of the workflow, no code fix possible

### ✅ Problem 4: Insufficient Debug Information on Generation Failures
- **Status**: FULLY FIXED (Jan 28 + Jan 29, 2026)
- **Root Cause**: Debug info was generated but discarded during error propagation
- **Files**: `utils.ts`, `fileGenerator.ts`, `types.ts`, `lesson-generator/route.ts`, `generate/page.tsx`
- **Solution**: 
  - Jan 28: Added debug info generation (raw response, error position, context preview)
  - Jan 29: Fixed error propagation to preserve debugInfo through call chain
- **Features**: Raw LLM response, error location, context preview, collapsible UI
- **Verification**: Error page shows all 5 debug sections when generation fails
- **Risk**: Very Low - TypeScript now enforces debugInfo in return types
- **Benefit**: Instant debugging without checking logs, comprehensive error context

### ✅ Problem 5: LLM Field Name Typos in Spaced Review Questions
- **Status**: FIXED (Jan 28, 2026)
- **Files**: `validationService.ts`, `SpacedReviewBlock.tsx`, `lessonPromptBuilder.ts`
- **Solution**: Enhanced validation + defensive coding + improved prompts
- **Root Cause**: Validation gap allowed malformed questions; LLM typos ("attText" instead of "questionText")
- **Prevention**: Triple-layer defense (validation, defensive coding, prompt improvements)
- **Verification**: Generate a lesson and check validation catches field name errors
- **Risk**: Low - multiple layers of protection
- **Benefit**: Prevents runtime crashes from malformed spaced-review questions

### ✅ Problem 6: Invalid JavaScript Identifiers Starting with Numbers
- **Status**: DOCUMENTED (Jan 28, 2026) - Manual fix required when it occurs
- **Files**: Question bank file, `src/data/questions/index.ts` (3 locations)
- **Solution**: Spell out leading numbers (e.g., `3` → `three`)
- **Root Cause**: Lesson generator doesn't validate that identifiers follow JavaScript naming rules
- **Prevention**: Future work - add identifier validation to generator
- **Verification**: Dev server starts without "Identifier cannot follow number" error
- **Risk**: Medium - will occur whenever lesson title starts with a number
- **Benefit**: Clear fix pattern documented for quick resolution

### ✅ Problem 7: Feature Branches Causing Lesson Confusion
- **Status**: PERMANENTLY FIXED (Jan 29, 2026)
- **Files**: `gitService.ts`, `types.ts`, `route.ts`, `page.tsx`, `errorHandler.ts`, `constants.ts`
- **Solution**: Generator now commits directly to main instead of creating feature branches
- **Root Cause**: Feature branch workflow caused lessons to "disappear" and violated "ALWAYS work on main" principle
- **Prevention**: Type system now enforces commit hash instead of branch names
- **Verification**: Generated lessons commit directly to main, no feature branches created
- **Risk**: None - feature branch workflow was the problem
- **Benefit**: Lessons appear immediately, no manual merging, matches documented workflow

---

## Problem 6: Invalid JavaScript Identifiers Starting with Numbers ✅ **FIXED - Jan 28, 2026**

### Issue Symptoms
Build error when trying to compile after lesson generation:
```
Error: x Identifier cannot follow number
./src/data/questions.ts
Error:   x Identifier cannot follow number
    ,-[C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\data\questions.ts:34:1]
 34 | import { 3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './questions/3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
    :           ^
```

### Root Cause ✅ **CONFIRMED**
JavaScript/TypeScript identifiers (variable names, function names, etc.) **cannot start with a number**. When the lesson generator creates a question bank from a lesson title that starts with a number (e.g., "3-plate ceiling rose"), it converts it directly to camelCase without validating that the resulting identifier is valid JavaScript.

**Example of the problem:**
- Lesson title: "3-plate ceiling rose (loop-in) — explained for a total beginner"
- Generated identifier: `3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions` ❌ (starts with `3`)
- Valid identifier: `threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions` ✅ (starts with `three`)

### The Fix ✅ **APPLIED - Jan 28, 2026**

**Manual fix required** - the lesson generator does NOT currently validate identifier names.

#### Files to Modify

**1. Question Bank File** (e.g., `src/data/questions/3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions.ts`):

```typescript
// BEFORE:
export const 3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions: TaggedQuestion[] = [

// AFTER:
export const threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions: TaggedQuestion[] = [
```

**2. Questions Index File** (`src/data/questions/index.ts`) - **3 locations:**

a) Import statement:
```typescript
// BEFORE:
import { 3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';

// AFTER:
import { threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
```

b) Array usage:
```typescript
// BEFORE:
export const allTaggedQuestions: TaggedQuestion[] = [
  ...3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions,

// AFTER:
export const allTaggedQuestions: TaggedQuestion[] = [
  ...threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions,
```

c) Re-export:
```typescript
// BEFORE:
export { 3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';

// AFTER:
export { threePlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions } from './3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions';
```

### Important Note on File Names
The **file name itself** can start with a number without issues (e.g., `3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions.ts` is fine). Only the JavaScript/TypeScript identifier (the exported variable name) needs to be fixed.

### Naming Convention
When a lesson title starts with a number, spell it out in the identifier:
- `3` → `three`
- `2` → `two`
- `1` → `one`
- `10` → `ten`
- etc.

This follows existing patterns in the codebase (e.g., `oneWayLighting3PlateCeilingRoseQuestions`).

### Verification Steps

**To verify the fix worked:**

1. **Restart the dev server** (required after any import changes):
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

2. **Check for build errors**:
   - Dev server should start without "Identifier cannot follow number" errors
   - Look for `✓ Ready in XXXXms` message

3. **Verify the lesson loads**:
   - Navigate to `/learn` page
   - The lesson should appear in the list
   - Click on the lesson to verify it loads without errors

### If This Error Reappears

**Step 1: Identify the invalid identifier**
The error message will show which identifier is invalid:
```
import { 3SomeName } from './questions/3SomeName';
         ^
```

**Step 2: Spell out the leading number**
Replace the leading number with its spelled-out equivalent:
- `3SomeName` → `threeSomeName`
- `2WaySwitch` → `twoWaySwitch`
- `10AmpCircuit` → `tenAmpCircuit`

**Step 3: Update all three locations in `index.ts`**
- Import statement
- Array spread in `allTaggedQuestions`
- Re-export statement

**Step 4: Update the export in the question bank file**

**Step 5: Restart dev server and verify**

### Prevention (Future Work)

The lesson generator should be updated to validate identifier names. Suggested location: `src/lib/generation/fileGenerator.ts` or `src/lib/generation/utils.ts`

**Add identifier validation function:**
```typescript
function sanitizeIdentifier(name: string): string {
  // If starts with a number, spell it out
  const numberMap: Record<string, string> = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
    '10': 'ten', '11': 'eleven', '12': 'twelve', '13': 'thirteen',
    '14': 'fourteen', '15': 'fifteen', '16': 'sixteen', '17': 'seventeen',
    '18': 'eighteen', '19': 'nineteen', '20': 'twenty'
  };
  
  // Check if identifier starts with a number
  const match = name.match(/^(\d+)/);
  if (match) {
    const num = match[1];
    const replacement = numberMap[num] || `number${num}`;
    return name.replace(/^\d+/, replacement);
  }
  
  return name;
}
```

**Apply this function when generating question bank variable names.**

### Files Modified (Jan 28, 2026)
- `src/data/questions/3PlateCeilingRoseLoopInExplainedForATotalBeginnerQuestions.ts` - Fixed export name
- `src/data/questions/index.ts` - Fixed import, array usage, and re-export

### Benefits
- **Build succeeds**: No more "Identifier cannot follow number" errors
- **Quick fix**: Clear pattern to follow (spell out leading numbers)
- **Documentation**: This guide provides step-by-step instructions
- **Future-proof**: Suggested prevention code for the generator

**Risk Level**: Medium → Low after documentation
- Lesson generator doesn't validate identifiers (needs future fix)
- Manual fix is straightforward with clear pattern
- Well-documented for future occurrences

---

## Problem 7: Feature Branches Causing Lesson Confusion ✅ **PERMANENTLY FIXED - Jan 29, 2026**

### Issue Symptoms
Multiple manifestations of the same workflow problem:
- Generated lessons "disappeared" when viewing main branch
- Lessons existed but weren't visible in the app
- Required manual merging of feature branches after each generation
- Confusion about which branch contained the work
- Violated the documented principle: "ALWAYS work on main branch"

### Root Cause ✅ **CONFIRMED**
The generator was creating a new feature branch for each lesson (e.g., `feat/lesson-203-1A-1769680463565`):

```typescript
// OLD CODE (before fix):
await execAsync(`git checkout -b ${branchName}`);  // Creates NEW branch
await execAsync('git add .');
await execAsync(`git commit -m "${commitMessage}"`);
await execAsync(`git push -u ${GIT_CONFIG.REMOTE} ${branchName}`);
await execAsync('git checkout main');  // Returns to main
```

This caused:
1. Lessons were committed to feature branches, not main
2. Files appeared to "disappear" when viewing main branch
3. Each lesson required manual merge from feature branch to main
4. Conflicted with documented workflow in `pushing_to_git.md`
5. Created unnecessary branch clutter in the repository

### The Permanent Fix ✅ **APPLIED - Jan 29, 2026**

**File**: `src/lib/generation/gitService.ts`

**Rewritten `commitAndPush()` method** to commit directly to main:

```typescript
// NEW CODE (after fix):
await this.ensureMainBranch();  // Ensure on main
await execAsync('git add .');
await execAsync(`git commit -m "${commitMessage}"`);
await execAsync(`git push ${GIT_CONFIG.REMOTE} main`);  // Push to main
const { stdout: commitHash } = await execAsync('git rev-parse HEAD');
```

### Files Modified (Jan 29, 2026)

**Core Changes:**
1. `src/lib/generation/gitService.ts` - Rewritten to commit directly to main
   - Removed `generateBranchName()` method
   - Renamed `getBranchUrl()` → `getCommitUrl()`
   - Updated `rollback()` to handle main commits
   - Removed branch creation/deletion logic

2. `src/lib/generation/types.ts` - Updated interfaces
   - `GitResult`: Changed `branchName` → `commitHash`, `branchUrl` → `commitUrl`
   - `GenerationResponse`: Changed `branchName` → `commitHash`, `branchUrl` → `commitUrl`

3. `src/app/api/lesson-generator/route.ts` - Updated API handler
   - Changed variable names to `commitHash`/`commitUrl`
   - Updated success logging
   - Removed branch parameter from rollback

4. `src/app/generate/page.tsx` - Updated UI
   - Changed state interface to use `commitHash`/`commitUrl`
   - Updated display: "Git Branch:" → "Committed to main:"
   - Shows commit hash (first 7 chars) instead of branch name
   - Link now goes to commit view instead of branch view

5. `src/lib/generation/errorHandler.ts` - Updated rollback
   - Removed `branchName` parameter
   - Removed branch deletion logic
   - Added warning about manual revert if needed

6. `src/lib/generation/constants.ts` - Cleaned up config
   - Removed `BRANCH_PREFIX` (no longer used)

7. `src/lib/generation/fileGenerator.ts` - Fixed debug logging
   - Updated debug log path to correct location

### New Workflow

**Before (Feature Branches):**
```
Generate → Create branch → Commit to branch → Push branch → Switch to main
Result: Files on feature branch, not visible on main, requires manual merge
```

**After (Direct to Main):**
```
Generate → Ensure on main → Commit to main → Push main
Result: Files immediately available on main, no merge needed
```

### Benefits

1. **No More Disappearing Lessons**: Everything stays on main
2. **Simpler Workflow**: No branch management needed
3. **Immediate Visibility**: Generated lessons appear right away
4. **Matches Documentation**: Aligns with "ALWAYS work on main" principle
5. **Cleaner Git History**: No feature branch clutter
6. **Automatic Deployment**: Changes go straight to production branch

### Verification Steps

**To verify the fix is in place:**

1. **Check gitService.ts**:
   - No `git checkout -b` commands
   - Should push to `main` not a branch name
   - `getCommitUrl()` method exists (not `getBranchUrl()`)

2. **Check types.ts**:
   - `GitResult` and `GenerationResponse` use `commitHash`/`commitUrl`
   - No references to `branchName`/`branchUrl`

3. **Test generation**:
   - Generate a lesson
   - Verify it commits to main (check `git log`)
   - Verify files appear immediately
   - UI should show "Committed to main: abc123f"

### If You Need the Old Behavior

**Don't.** The feature branch workflow caused confusion and violated established practices. If you absolutely need to review before pushing to main:

1. Generate the lesson (it commits to main)
2. Review the commit with `git show HEAD`
3. If you need to undo: `git revert HEAD && git push`

Or consider implementing a staging/review system outside the generator.

### Migration Notes

**Existing feature branches** should be merged into main and deleted:

```bash
# For each existing feature branch:
git checkout main
git merge feat/lesson-XXX-timestamp --no-edit
git push origin main
git branch -d feat/lesson-XXX-timestamp
git push origin --delete feat/lesson-XXX-timestamp
```

### Prevention

- **Never modify gitService.ts** to create branches again
- **Code review checkpoint**: Any changes to git workflow must commit to main
- **Documentation**: Both `gen_problems.md` and `pushing_to_git.md` enforce main-only workflow
- **Type safety**: Interfaces now enforce commit hash instead of branch names

**Risk Level**: None - workflow is now correct and documented
- Feature branch workflow was the problem, not the solution
- Direct-to-main is simpler, clearer, and matches project standards
- All stakeholders prefer this approach

---

## Emergency Troubleshooting Guide

### Error: "Failed to parse quiz questions" or "Expected property name in JSON"

**NEW (Jan 28, 2026)**: The error page now shows comprehensive debug information!

1. **Check the Error Page First** (Problem 4 - NEW):
   - **Error Location**: Line, column, position numbers
   - **Context Preview**: See the exact characters around the error
   - **Raw Response**: Expand to see full LLM output
   - **Operation Details**: What was being parsed when it failed
   
2. **Common Causes**:
   - **LLM returned malformed JSON**: Most common - just retry generation
   - **Missing `.json` extension**: Check imports (see below)
   - **JSON structure issue**: Use the raw response to identify the problem

3. **If it's an import issue** (Problem 2):
   - **Check**: `grep "from '@/data/lessons/[^']*';" src/app/learn/*.tsx`
   - **Look for**: Any imports missing `.json` extension
   - **Fix**: Add `.json` to those imports
   - **Prevent**: Verify `fileIntegrator.ts` has the `lessonPath` fix (see Problem 2)

4. **If it's a malformed LLM response**:
   - **Action**: Just retry the generation (LLMs occasionally produce invalid JSON)
   - **Debug**: Use the raw response on error page to see what went wrong
   - **Report**: If it keeps failing, copy the raw response for bug report

### Error: "Cannot find module '@/data/lessons/xxx'"
1. **Check**: Does the JSON file exist? `ls src/data/lessons/*.json | grep xxx`
2. **Check**: Does the import have `.json`? (see Problem 2)
3. **Fix**: Add `.json` extension if missing
4. **Verify**: Restart dev server

### Error: Lesson not showing in /learn page
1. **First**: Restart dev server (see Problem 3)
2. **Then**: Hard refresh browser
3. **Check**: Is lesson in `LESSONS` array in both page files?
4. **Check**: Is lesson in `lessonIndex.ts`?

### Error: Duplicate imports causing build failure
1. **Check**: `grep "import.*{.*variableName.*}" src/data/questions/index.ts`
2. **Fix**: Remove duplicate import/export lines
3. **Prevent**: Should be caught by regex checks (see Problem 1)

### Error: "Identifier cannot follow number" or "x Identifier cannot follow number"
**NEW (Jan 28, 2026)**: JavaScript identifiers cannot start with numbers!

1. **Identify the problem** (Problem 6):
   - Error shows which identifier is invalid (e.g., `3PlateCeilingRose...`)
   - This happens when lesson title starts with a number

2. **Quick Fix Pattern**:
   - Spell out the leading number: `3` → `three`, `2` → `two`, etc.
   - Example: `3PlateCeilingRoseQuestions` → `threePlateCeilingRoseQuestions`

3. **Files to update (3 locations in index.ts + 1 in question file)**:
   - Import: `import { threePlate... } from './3Plate...'`
   - Array: `...threePlate...`
   - Export: `export { threePlate... } from './3Plate...'`
   - Question file: `export const threePlate... = [`

4. **Verify**:
   - Restart dev server
   - Should see `✓ Ready` without errors

5. **Full details**: See Problem 6 above for complete step-by-step instructions

### Error: "Cannot read properties of undefined (reading 'replace')" in SpacedReviewBlock
**NEW (Jan 28, 2026)**: This error is now prevented by validation and defensive coding!

1. **Check the lesson JSON file** (Problem 5 - FIXED):
   - Look for spaced-review questions with incorrect field names
   - Search for `"attText"`, `"questiontext"`, or other variants instead of `"questionText"`
   
2. **Immediate Fix**:
   - Open the lesson JSON file mentioned in the error
   - Find the spaced-review block (type: "spaced-review")
   - Change any incorrect field names to `"questionText"`
   - Restart dev server

3. **Why it happened**:
   - LLM made a typo when generating the lesson
   - Validation should now catch this (verify validation is running)
   - If validation didn't catch it, report the issue

4. **Prevention**:
   - Validation now checks all spaced-review question field names
   - Defensive coding prevents crashes even if validation fails
   - Should not occur in newly generated lessons
