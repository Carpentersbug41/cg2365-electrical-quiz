# Lesson Generator Problems and Fixes

This document tracks issues found with the lesson generator and their resolutions.

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

---

## Emergency Troubleshooting Guide

### Error: "Failed to parse quiz questions" or "Expected property name in JSON"
1. **Check**: `grep "from '@/data/lessons/[^']*';" src/app/learn/*.tsx`
2. **Look for**: Any imports missing `.json` extension
3. **Fix**: Add `.json` to those imports
4. **Prevent**: Verify `fileIntegrator.ts` has the `lessonPath` fix (see Problem 2)

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
