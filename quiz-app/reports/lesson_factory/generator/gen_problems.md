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

## Problem 2: Missing JSON Extension in Import Paths

### Issue
TypeScript build errors: `Cannot find module '@/data/lessons/202-3AAAA-series-circuits'`
- Lesson imports were missing the `.json` extension
- TypeScript requires explicit file extensions for JSON imports

### Root Cause
The generator was removing the `.json` extension from import paths:
```typescript
const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;
```

### Fix Applied
**File**: `src/lib/generation/fileIntegrator.ts`

Changed both `updateLessonPage()` and `updateLearnPage()` methods to:
```typescript
// Ensure .json extension is included in import path
const lessonPath = lessonFilename.endsWith('.json') ? lessonFilename : `${lessonFilename}.json`;
const importStatement = `import ${variableName} from '@/data/lessons/${lessonPath}';`;
```

This ensures the `.json` extension is always included, regardless of whether the filename parameter includes it or not.

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
