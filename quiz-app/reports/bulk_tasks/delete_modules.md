# How to Delete Lessons/Modules: Step-by-Step Guide

## Overview

This guide documents the complete process for removing lessons from the system. When a lesson is generated, it creates files and integrates into 7 different locations. All of these must be cleaned up to fully remove a lesson.

## Files Affected by Lesson Generation

Based on the generator's `fileIntegrator.ts`, each lesson touches:

1. **Lesson JSON file**: `src/data/lessons/[lesson-id]-[topic].json`
2. **Questions TypeScript file**: `src/data/questions/[topicName]Questions.ts`
3. **Questions index**: `src/data/questions/index.ts` (3 changes: import, export, array)
4. **Questions main**: `src/data/questions.ts` (2 changes: import, array)
5. **Lesson index**: `src/data/lessons/lessonIndex.ts` (registry entry)
6. **Lesson page**: `src/app/learn/[lessonId]/page.tsx` (import, registry)
7. **Learn page**: `src/app/learn/page.tsx` (import, array)

### Note: Microbreak Games

**IMPORTANT**: Microbreak games are stored as `microbreak` blocks **inside** the lesson JSON file itself, not as separate files. When you delete the lesson JSON file (step 7), all associated games are automatically deleted with it.

**What to check**:
- Games are stored in the `blocks` array with `"type": "microbreak"`
- Game IDs follow pattern: `{lesson-id}-microbreak-{index}` (e.g., `203-2B-microbreak-1`)
- No separate file deletion needed
- No additional integration points to clean up

**Verification**: After deleting the lesson JSON, search for the lesson ID to confirm no orphaned game references remain:
```bash
rg "203-2B-microbreak" quiz-app/src
```

## Step-by-Step Deletion Process

### Phase 1: Identify All References

Before deleting, search for all occurrences of the lesson ID:

```bash
# Search for the lesson ID across the codebase
rg "202-3AAAA" quiz-app/src
rg "202\.3AAAA" quiz-app/src
```

Document all files that reference the lesson.

### Phase 2: Remove Integration Points (7 files)

#### File 1: `src/data/lessons/lessonIndex.ts`

Remove the lesson entry from the `lessonIndex` array:

```typescript
// DELETE this entire block
{
  id: '202-3AAAA',
  title: 'Series Circuits',
  unit: 'Unit 202',
  unitNumber: '202',
  topic: 'Series Circuits',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('202-3AAAA'),
  available: true,
  order: 9.3,
},
```

#### File 2: `src/app/learn/[lessonId]/page.tsx`

Remove TWO things:

1. The import statement:
```typescript
// DELETE this line
import lesson202_3AAAA from '@/data/lessons/202-3AAAA-series-circuits.json';
```

2. The LESSONS registry entry:
```typescript
// DELETE this line from the LESSONS object
'202-3AAAA': lesson202_3AAAA as Lesson,
```

#### File 3: `src/app/learn/page.tsx`

Remove TWO things:

1. The import statement:
```typescript
// DELETE this line
import lesson202_3AAAA from '@/data/lessons/202-3AAAA-series-circuits.json';
```

2. The LESSONS array entry:
```typescript
// DELETE this line from the LESSONS array
lesson202_3AAAA,
```

#### File 4: `src/data/questions/index.ts`

Remove THREE things:

1. The import statement:
```typescript
// DELETE this line (if it's a generated question file)
import { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
```

2. The array spread:
```typescript
// DELETE this line from allTaggedQuestions array
...seriesCircuitsQuestions,
```

3. The export statement:
```typescript
// DELETE this line
export { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
```

**WARNING:** Only delete if this is the generated question file. If it's a pre-existing question bank used by multiple lessons, leave it alone.

#### File 5: `src/data/questions.ts`

Remove TWO things (if this file exists):

1. The import statement:
```typescript
// DELETE this line
import { seriesCircuitsQuestions } from './questions/seriesCircuitsQuestions';
```

2. The array spread:
```typescript
// DELETE this line from questions array
...seriesCircuitsQuestions,
```

### Phase 3: Delete Generated Files

#### File 6: Delete the lesson JSON file

```bash
rm quiz-app/src/data/lessons/202-3AAAA-series-circuits.json
```

#### File 7: Delete the questions TypeScript file (if generated)

**IMPORTANT:** Only delete if this was generated specifically for this lesson. Check if other lessons use the same questions file.

```bash
# Check if used elsewhere first
rg "seriesCircuitsQuestions" quiz-app/src

# If only referenced by the deleted lesson, delete it
rm quiz-app/src/data/questions/seriesCircuitsQuestions.ts
```

### Phase 4: Verify Deletion

1. Run the build to check for errors:
```bash
npm run build
```

2. Search for remaining references:
```bash
rg "202-3AAAA" quiz-app/src
```

3. If build succeeds and no references remain, deletion is complete.

### Phase 5: Restart Dev Server

**MANDATORY:** Restart the dev server to reflect the changes:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

Hard refresh the browser to verify the lesson is gone.

## Checklist Template

Use this checklist for each lesson deletion:

- [ ] Phase 1: Search and document all references (including microbreak games)
- [ ] Phase 2: Remove from lessonIndex.ts
- [ ] Phase 3: Remove from learn/[lessonId]/page.tsx (import + registry)
- [ ] Phase 4: Remove from learn/page.tsx (import + array)
- [ ] Phase 5: Remove from questions/index.ts (import + array + export) if applicable
- [ ] Phase 6: Remove from questions.ts (import + array) if applicable
- [ ] Phase 7: Delete lesson JSON file (this also deletes all microbreak games)
- [ ] Phase 8: Delete questions TS file (verify not used elsewhere first)
- [ ] Phase 9: Run build to verify no errors
- [ ] Phase 10: Search for remaining references (lesson ID and microbreak games)
- [ ] Phase 11: Restart dev server
- [ ] Phase 12: Verify lesson is gone in browser

## Common Pitfalls

1. **Forgetting to remove from all 7 locations** - Use the checklist
2. **Deleting shared question banks** - Always check if questions are used by other lessons
3. **Not restarting the dev server** - Changes won't appear until restart
4. **Leaving trailing commas** - Check array/object syntax after deletion
5. **Breaking imports** - Ensure no dangling imports remain

## Automation Potential

Currently manual. A future enhancement could be a deletion script that:
- Takes a lesson ID as input
- Searches and removes from all 7 locations
- Deletes the lesson file
- Checks if questions are orphaned before deleting
- Runs build verification
- Reports success/failure

This would be implemented in `src/lib/generation/lessonDeleter.ts` following the same pattern as `fileIntegrator.ts`.

## Quick Reference Card

| Location | Action | Count |
|----------|--------|-------|
| `lessonIndex.ts` | Remove entry | 1 block |
| `learn/[lessonId]/page.tsx` | Remove import + registry | 2 lines |
| `learn/page.tsx` | Remove import + array | 2 lines |
| `questions/index.ts` | Remove import + array + export | 3 lines |
| `questions.ts` | Remove import + array | 2 lines |
| Lesson JSON file | Delete file | 1 file |
| Questions TS file | Delete file (check first!) | 0-1 file |

**Total manual edits per lesson:** Minimum 5 files, up to 12 individual changes

**Time estimate:** 10-15 minutes per lesson (careful deletion)

**Risk level:** Medium - forgetting locations causes build errors

**Always remember:** Restart dev server after deletion!

## Completed Deletions

This section tracks modules that have been successfully deleted from the system.

### Deletion Record: 203-2B (February 2, 2026)

**Module ID:** 203-2B

**Reason for Deletion:** Lesson replacement/regeneration required.

**Files Deleted:**
1. `203-2B-reading-installation-drawings-legend-symbols-notes-abbreviations.json` (25,071 bytes)
2. `readingInstallationDrawingsLegendSymbolsNotesAbbreviationsQuestions.ts` (49,354 bytes)

**Microbreak Games Deleted:**
- All microbreak games were automatically deleted with the lesson JSON file
- Games were stored as blocks within the lesson file (not separate files)
- 4 microbreak game blocks were included in the deleted lesson

**Integration Points Cleaned:**
1. `lessonIndex.ts` - Removed lesson entry (1 block)
2. `learn/[lessonId]/page.tsx` - Removed import statement
3. `learn/[lessonId]/page.tsx` - Removed LESSONS registry entry
4. `learn/page.tsx` - Removed import statement
5. `learn/page.tsx` - Removed LESSONS array entry
6. `questions/index.ts` - Removed import statement
7. `questions/index.ts` - Removed array spread
8. `questions/index.ts` - Removed export statement
9. `questions.ts` - Removed import statement
10. `questions.ts` - Removed array spread

**Total Changes:** 2 files deleted, 5 files edited, 10 code integration points removed

**Verification:** 
- Build succeeded with no errors
- No remaining references to `203-2B` found in codebase
- No orphaned game references found

---

### Deletion Record: 204-13A (January 28, 2026)

**Module ID:** 204-13A (duplicate ID issue - both variants removed)

**Reason for Deletion:** Duplicate lesson ID `204-13A` with conflicting content. Both modules removed to resolve ID conflict.

**Files Deleted:**
1. `204-13A-one-way-lighting-3-plate-ceiling-rose.json` (orphaned file, no code references)
2. `204-13A-ceiling-rose-anatomy-3-plate.json` (fully integrated)
3. `ceilingRoseAnatomy3PlateQuestions.ts` (50 multiple choice questions, ~1360 lines)

**Integration Points Cleaned:**
1. `lessonIndex.ts` - Removed lesson entry (1 block)
2. `learn/[lessonId]/page.tsx` - Removed import statement
3. `learn/[lessonId]/page.tsx` - Removed LESSONS registry entry
4. `learn/page.tsx` - Removed import statement
5. `learn/page.tsx` - Removed LESSONS array entry
6. `questions/index.ts` - Removed import statement
7. `questions/index.ts` - Removed array spread
8. `questions/index.ts` - Removed export statement

**Total Changes:** 3 files deleted, 5 files edited, 8 code integration points removed

**Verification:** All references to `204-13A` successfully removed from codebase.
