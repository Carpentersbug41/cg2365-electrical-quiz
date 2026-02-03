# How to Rename Lessons/Modules: Complete Guide

## Overview

This guide documents the complete process for renaming lesson modules in the system. Unlike deletion, renaming preserves the lesson content but changes its identifier throughout the codebase.

### When to Rename vs Delete

**Rename when:**
- Reorganizing lesson numbering/ordering
- Fixing naming inconsistencies
- Restructuring curriculum hierarchy
- Lesson content stays the same, only ID changes

**Delete and recreate when:**
- Completely replacing lesson content
- Changing lesson structure significantly
- Starting fresh with new approach

### ⚠️ Critical Warning: localStorage Progress Data

**User progress data is keyed by lesson ID in localStorage.** When you rename a lesson:
- Users who started the old lesson ID will lose their progress
- They must restart the lesson with the new ID
- There is currently **no automatic migration mechanism** for lesson IDs
- Plan renames carefully and communicate changes to users

---

## Files Affected by Renaming

Based on actual 204-13A/13B → 204-14A/14B rename, the following locations must be updated:

### 1. Lesson JSON Files (2 changes per file)
**Location:** `src/data/lessons/[lesson-id]-[topic].json`

**Changes needed:**
- Filename itself
- Internal `id` field
- Internal `title` field (if it includes the ID)
- All block `id` fields (they use lesson ID as prefix)
- References in `prerequisites` array (if other lessons depend on this one)
- Cross-references in spaced review questions

### 2. Lesson Index Registry (1 entry per lesson)
**Location:** `src/data/lessons/lessonIndex.ts`

**Changes needed:**
- `id` field
- `questionCount: getLessonQuestionCount('LESSON-ID')` call
- `title` field (if it includes the ID)

### 3. Learn Page (2 changes per lesson)
**Location:** `src/app/learn/page.tsx`

**Changes needed:**
- Import statement for lesson JSON file
- Entry in `LESSONS` array

### 4. Lesson Detail Page (2 changes per lesson)
**Location:** `src/app/learn/[lessonId]/page.tsx`

**Changes needed:**
- Import statement for lesson JSON file
- Key-value pair in `LESSONS` registry object

### 5. Questions Files (50+ changes per file)
**Location:** `src/data/questions/[topicName]Questions.ts`

**Changes needed:**
- All `learningOutcomeId` strings (typically 40-50 occurrences)
- File header comment (lesson reference)

### 6. Documentation/Examples (variable)
**Locations:**
- `src/app/generate/page.tsx` (example placeholders)
- `reports/lesson_factory/generator/HOW_TO_USE_GENERATOR.md`
- Any other documentation referencing specific lesson IDs

---

## Step-by-Step Renaming Process

### Phase 1: Planning & Search

**Step 1.1:** Decide on new lesson IDs
```
Example: 204-13A → 204-14A, 204-13B → 204-14B
```

**Step 1.2:** Search for all occurrences of old IDs

**PowerShell:**
```powershell
# Search for lesson ID with hyphen
Select-String -Pattern "204-13[AB]" -Path quiz-app\src -Recurse

# Search for lesson ID with dot (used in titles)
Select-String -Pattern "204\.13[AB]" -Path quiz-app\src -Recurse
```

**Bash/Linux:**
```bash
# Search for lesson ID with hyphen
grep -r "204-13[AB]" quiz-app/src

# Search for lesson ID with dot (used in titles)
grep -r "204\.13[AB]" quiz-app/src
```

**Step 1.3:** Document all files returned by search
Create a checklist of every file that needs updating.

---

### Phase 2: Rename Files

**Step 2.1:** Rename the lesson JSON files

**PowerShell:**
```powershell
# Navigate to lessons directory
cd quiz-app/src/data/lessons

# Rename files (note: use semicolon, not &&)
mv 204-13A-one-way-lighting-3-plate-ceiling-rose.json 204-14A-one-way-lighting-3-plate-ceiling-rose.json

mv 204-13B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json 204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json
```

**Bash/Linux:**
```bash
# Navigate to lessons directory
cd quiz-app/src/data/lessons

# Rename files
mv 204-13A-one-way-lighting-3-plate-ceiling-rose.json 204-14A-one-way-lighting-3-plate-ceiling-rose.json

mv 204-13B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json 204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json
```

**Step 2.2:** Verify files were renamed
```powershell
# List the new files
ls *204-14*.json
```

---

### Phase 3: Update Lesson JSON Content

For **each renamed lesson file**, update internal references.

**Step 3.1:** Update main `id` field

**Before:**
```json
{
  "id": "204-13A",
  "title": "204.13A — One-way lighting...",
  ...
}
```

**After:**
```json
{
  "id": "204-14A",
  "title": "204.14A — One-way lighting...",
  ...
}
```

**Step 3.2:** Update `title` field (if it includes the ID)

Change `204.13A` to `204.14A` in title.

**Step 3.3:** Update ALL block IDs (use replace_all)

Block IDs use the lesson ID as a prefix. Replace **all occurrences** in the file:

**Before:**
```json
{
  "id": "204-13A-outcomes",
  "type": "outcomes",
  ...
},
{
  "id": "204-13A-vocab",
  "type": "vocab",
  ...
},
{
  "id": "204-13A-C1-L1-A",
  ...
}
```

**After:**
```json
{
  "id": "204-14A-outcomes",
  "type": "outcomes",
  ...
},
{
  "id": "204-14A-vocab",
  "type": "vocab",
  ...
},
{
  "id": "204-14A-C1-L1-A",
  ...
}
```

**Efficient method:** Use replace_all in your editor:
- Find: `204-13A`
- Replace: `204-14A`
- Replace All

**Step 3.4:** Update prerequisites array references

If **other lessons** reference this lesson in their `prerequisites` array:

**In 204-14B file (depends on 204-14A):**
```json
"prerequisites": [
  "204-11A",
  "204-11B",
  "204-11C",
  "204-12A",
  "204-12B",
  "204-14A"  // ← Update this reference
],
```

**Step 3.5:** Update spaced review cross-references

Check the `spaced-review` block for questions referencing the old ID:

**Before:**
```json
{
  "id": "204-14B-spaced-review",
  "type": "spaced-review",
  "content": {
    "questions": [
      "From 204-13A: Which conductor must the switch break?"
    ]
  }
}
```

**After:**
```json
{
  "id": "204-14B-spaced-review",
  "type": "spaced-review",
  "content": {
    "questions": [
      "From 204-14A: Which conductor must the switch break?"
    ]
  }
}
```

---

### Phase 4: Update Application Integration Points

**Step 4.1:** Update `src/data/lessons/lessonIndex.ts`

Find the lesson entries and update:

**Before:**
```typescript
{
  id: '204-13A',
  title: 'One-way lighting (3-plate ceiling rose)',
  unit: 'Unit 204',
  unitNumber: '204',
  topic: 'One-way lighting (3-plate ceiling rose)',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('204-13A'),
  available: true,
  order: 8,
},
{
  id: '204-13B',
  title: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
  unit: 'Unit 204',
  unitNumber: '204',
  topic: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('204-13B'),
  available: true,
  order: 9,
},
```

**After:**
```typescript
{
  id: '204-14A',
  title: 'One-way lighting (3-plate ceiling rose)',
  unit: 'Unit 204',
  unitNumber: '204',
  topic: 'One-way lighting (3-plate ceiling rose)',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('204-14A'),
  available: true,
  order: 8,
},
{
  id: '204-14B',
  title: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
  unit: 'Unit 204',
  unitNumber: '204',
  topic: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('204-14B'),
  available: true,
  order: 9,
},
```

**Step 4.2:** Update `src/app/learn/page.tsx`

**Change 1 - Import statements:**
```typescript
// Before
import lesson204_13A from '@/data/lessons/204-13A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_13B from '@/data/lessons/204-13B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';

// After
import lesson204_14A from '@/data/lessons/204-14A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_14B from '@/data/lessons/204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';
```

**Change 2 - LESSONS array:**
```typescript
// Before
const LESSONS = [
  lesson204_13B,
  lesson204_13A,
  // ... other lessons
];

// After
const LESSONS = [
  lesson204_14B,
  lesson204_14A,
  // ... other lessons
];
```

**Step 4.3:** Update `src/app/learn/[lessonId]/page.tsx`

**Change 1 - Import statements:**
```typescript
// Before
import lesson204_13A from '@/data/lessons/204-13A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_13B from '@/data/lessons/204-13B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';

// After
import lesson204_14A from '@/data/lessons/204-14A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_14B from '@/data/lessons/204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';
```

**Change 2 - LESSONS registry object:**
```typescript
// Before
const LESSONS: Record<string, Lesson> = {
  '204-13B': lesson204_13B as Lesson,
  '204-13A': lesson204_13A as Lesson,
  // ... other lessons
};

// After
const LESSONS: Record<string, Lesson> = {
  '204-14B': lesson204_14B as Lesson,
  '204-14A': lesson204_14A as Lesson,
  // ... other lessons
};
```

---

### Phase 5: Update Question Files

Question files contain **50+ references** to the lesson ID in `learningOutcomeId` fields. Use replace_all for efficiency.

**Step 5.1:** Update learningOutcomeId references

**File:** `src/data/questions/oneWayLighting3PlateCeilingRoseQuestions.ts`

**Before:**
```typescript
/**
 * One-way Lighting (3-plate ceiling rose) Questions
 * Aligned with lesson 204-13A learning outcomes
 */
export const oneWayLighting3PlateCeilingRoseQuestions: TaggedQuestion[] = [
  {
    question: '...',
    learningOutcomeId: '204-13A-LO1',
    // ...
  },
  {
    question: '...',
    learningOutcomeId: '204-13A-LO2',
    // ...
  },
  // ... 40+ more questions
];
```

**After:**
```typescript
/**
 * One-way Lighting (3-plate ceiling rose) Questions
 * Aligned with lesson 204-14A learning outcomes
 */
export const oneWayLighting3PlateCeilingRoseQuestions: TaggedQuestion[] = [
  {
    question: '...',
    learningOutcomeId: '204-14A-LO1',
    // ...
  },
  {
    question: '...',
    learningOutcomeId: '204-14A-LO2',
    // ...
  },
  // ... 40+ more questions
];
```

**Efficient method:**
- Open file in editor
- Find: `204-13A` (or use regex `204-13A` if you want to be precise)
- Replace: `204-14A`
- Replace All (this will update all ~50 occurrences)

**Step 5.2:** Repeat for each associated question file

Example: `oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions.ts` needs the same treatment for `204-13B` → `204-14B`.

---

### Phase 6: Update Documentation/Examples

**Step 6.1:** Update generator placeholder examples

**File:** `src/app/generate/page.tsx`

**Before:**
```typescript
placeholder="https://example.com/diagram.png or /images/lessons/204-13A.png"
```

**After:**
```typescript
placeholder="https://example.com/diagram.png or /images/lessons/204-14A.png"
```

**Step 6.2:** Update HOW_TO guides

**File:** `reports/lesson_factory/generator/HOW_TO_USE_GENERATOR.md`

**Before:**
```markdown
/images/lessons/204-13A-diagram.png
```

**After:**
```markdown
/images/lessons/204-14A-diagram.png
```

**Step 6.3:** Search for other documentation

```powershell
# Search in reports and docs folders
Select-String -Pattern "204-13[AB]" -Path quiz-app\reports,quiz-app\docs -Recurse
```

---

### Phase 7: Verification

**Step 7.1:** Search for remaining old ID references

**PowerShell:**
```powershell
# Should return NO results
Select-String -Pattern "204-13A" -Path quiz-app\src -Recurse
Select-String -Pattern "204-13B" -Path quiz-app\src -Recurse
Select-String -Pattern "204\.13A" -Path quiz-app\src -Recurse
Select-String -Pattern "204\.13B" -Path quiz-app\src -Recurse
```

**Bash/Linux:**
```bash
# Should return NO results
grep -r "204-13A" quiz-app/src
grep -r "204-13B" quiz-app/src
grep -r "204\.13A" quiz-app/src
grep -r "204\.13B" quiz-app/src
```

If any results appear, investigate and update those files.

**Step 7.2:** Kill existing dev server

**PowerShell:**
```powershell
# Kill all node processes
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
```

**Bash/Linux:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Step 7.3:** Restart dev server

```bash
cd quiz-app
npm run dev
```

Wait for server to fully start (look for "Ready in X seconds" message).

**Step 7.4:** Test in browser

1. Navigate to `http://localhost:3000/learn`
2. Verify lessons appear with new IDs (204.14A, 204.14B)
3. Click into a lesson and verify it loads
4. Check that questions load correctly

**Step 7.5:** Check browser console for errors

Open DevTools console and look for:
- 404 errors (missing files)
- Import errors (wrong paths)
- Undefined references (missing question IDs)

---

## PowerShell vs Bash Quick Reference

| Task | PowerShell | Bash |
|------|-----------|------|
| **Search for text** | `Select-String -Pattern "text" -Path dir -Recurse` | `grep -r "text" dir` |
| **Rename file** | `mv oldname.json newname.json` | `mv oldname.json newname.json` |
| **Chain commands** | Use semicolon `;` | Use `&&` or `;` |
| **List files** | `ls *.json` | `ls *.json` |
| **Kill node** | `Get-Process \| Where-Object { $_.ProcessName -like "*node*" } \| Stop-Process -Force` | `pkill node` |

---

## Checklist Template

Copy this checklist for each rename operation:

**Planning Phase:**
- [ ] Decide on new lesson ID(s)
- [ ] Search for all occurrences: `[OLD-ID]` pattern
- [ ] Search for all occurrences: `[OLD-ID with dot]` pattern
- [ ] Document all affected files

**File Renaming Phase:**
- [ ] Rename lesson JSON file(s)
- [ ] Verify files renamed successfully

**JSON Content Phase (per lesson file):**
- [ ] Update main `id` field
- [ ] Update `title` field (if includes ID)
- [ ] Update ALL block IDs (replace_all recommended)
- [ ] Update prerequisites references (if any)
- [ ] Update spaced review cross-references (if any)

**Application Integration Phase:**
- [ ] Update `lessonIndex.ts` (id, questionCount, title)
- [ ] Update `learn/page.tsx` (import + array entry)
- [ ] Update `learn/[lessonId]/page.tsx` (import + registry key)

**Questions Phase (per questions file):**
- [ ] Update all `learningOutcomeId` fields (replace_all)
- [ ] Update file header comment

**Documentation Phase:**
- [ ] Update `generate/page.tsx` examples (if any)
- [ ] Update HOW_TO guides (if any)
- [ ] Search and update other docs (if any)

**Verification Phase:**
- [ ] Search confirms NO remaining old ID references
- [ ] Kill existing dev server
- [ ] Restart dev server successfully
- [ ] Verify lessons appear with new IDs in browser
- [ ] Test lesson loads correctly
- [ ] Check browser console for errors
- [ ] Verify questions load correctly

**Completion:**
- [ ] All checklist items completed
- [ ] Consider notifying users about progress data impact

---

## Common Pitfalls

### 1. Missing Internal JSON References

**Problem:** You renamed the file and updated the main ID, but forgot block IDs.

**Symptom:** Lesson loads but progress tracking breaks, blocks don't mark as complete.

**Solution:** Use replace_all to update ALL occurrences of the lesson ID within the JSON file.

### 2. Forgetting Questions File Updates

**Problem:** You updated the lesson but not the associated questions file.

**Symptom:** Questions show "Unknown learning outcome" or don't associate with lesson correctly.

**Solution:** Search for the old lesson ID in the questions directory specifically.

### 3. Spaced Review Cross-References

**Problem:** Other lessons reference this lesson in spaced review questions.

**Symptom:** Spaced review shows old lesson ID in question text.

**Solution:** Search for the old ID in ALL lesson JSON files, not just the renamed one.

### 4. Prerequisites References

**Problem:** Lesson B depends on Lesson A. You renamed A but didn't update B's prerequisites.

**Symptom:** Dependency checking breaks, diagnostic gates fail.

**Solution:** After renaming, grep for the old ID in other lesson files' prerequisites arrays.

### 5. Not Restarting Dev Server

**Problem:** You made all changes but still see old lesson IDs in browser.

**Symptom:** Changes don't appear, old lesson still shows.

**Solution:** **ALWAYS kill and restart the dev server.** Next.js caches imports aggressively.

### 6. Trailing Commas and Syntax

**Problem:** When updating arrays/objects, you accidentally break syntax.

**Symptom:** Build fails with parsing errors.

**Solution:** After editing arrays/objects, verify commas are correct (last item shouldn't have comma in some contexts).

### 7. Case Sensitivity

**Problem:** You wrote `204-14a` instead of `204-14A`.

**Symptom:** Import fails, file not found errors.

**Solution:** Lesson IDs are case-sensitive. Match the exact case in filenames and all references.

### 8. localStorage Progress Data

**Problem:** You didn't warn users about the rename.

**Symptom:** Users complain about losing progress on the lesson.

**Solution:** This is unavoidable with current architecture. Plan renames carefully and communicate changes.

---

## Progress Data Handling

### Current Limitation

The progress service (`src/lib/progress/progressService.ts`) stores user progress keyed by lesson ID in browser localStorage:

```typescript
{
  learningPaths: [
    {
      lessonsProgress: [
        {
          lessonId: "204-13A",  // ← This becomes invalid after rename
          blocksCompleted: [...],
          status: "in-progress",
          // ...
        }
      ]
    }
  ]
}
```

**When you rename `204-13A` to `204-14A`:**
- Old progress data still references `204-13A`
- System looks for lesson `204-14A`
- No match found → user starts fresh
- Old progress data becomes orphaned in localStorage

### No Automatic Migration

Currently, there is **no lesson ID migration mechanism**. The system does not:
- Detect renamed lessons
- Migrate localStorage keys
- Transfer progress from old ID to new ID

### Impact on Users

- **Users who haven't started the lesson:** No impact
- **Users who completed the lesson:** They lose completion status, must redo
- **Users mid-lesson:** They lose all progress, must restart
- **Mastery tracking:** Lost, must re-achieve

### Workarounds

**Option 1: Accept the data loss**
- Document the rename
- Notify affected users
- Let them restart the lesson

**Option 2: Manual localStorage editing (advanced users only)**
Users can manually edit localStorage:
```javascript
// In browser console
let progress = JSON.parse(localStorage.getItem('cg2365-learning-progress'));
// Find and update lessonId fields from old to new
// Save back
localStorage.setItem('cg2365-learning-progress', JSON.stringify(progress));
```

**Option 3: Future Enhancement - Lesson ID Migration Map**

Potential addition to `src/lib/progress/migrationService.ts`:

```typescript
const LESSON_ID_MIGRATIONS = {
  '204-13A': '204-14A',
  '204-13B': '204-14B',
};

function migrateLessonIds(progress: ProgressStorage): void {
  for (const path of progress.learningPaths) {
    for (const lesson of path.lessonsProgress) {
      if (LESSON_ID_MIGRATIONS[lesson.lessonId]) {
        lesson.lessonId = LESSON_ID_MIGRATIONS[lesson.lessonId];
      }
    }
  }
}
```

This would require:
- Maintaining the migration map
- Running migration on storage load
- Incrementing progress version
- Testing migration thoroughly

---

## Quick Reference Card

| Location | Changes | Pattern | Count |
|----------|---------|---------|-------|
| **Lesson JSON filename** | Rename file | `OLD-ID` → `NEW-ID` | 1 file |
| **Lesson JSON `id`** | Update field | `"id": "OLD-ID"` → `"id": "NEW-ID"` | 1 |
| **Lesson JSON `title`** | Update if includes ID | `OLD.ID` → `NEW.ID` | 0-1 |
| **Lesson JSON block IDs** | Replace all | `OLD-ID-*` → `NEW-ID-*` | 10-30 |
| **Lesson JSON prerequisites** | Update if referenced | `"OLD-ID"` → `"NEW-ID"` | 0-5 |
| **Lesson JSON spaced review** | Update cross-refs | `From OLD-ID:` → `From NEW-ID:` | 0-4 |
| **lessonIndex.ts** | Update entry | Multiple fields | 3-4 |
| **learn/page.tsx** | Import + array | Import + variable | 2 |
| **learn/[lessonId]/page.tsx** | Import + registry | Import + key | 2 |
| **Questions file** | All learningOutcomeIds | `OLD-ID-LO*` → `NEW-ID-LO*` | 40-60 |
| **Generate examples** | Update placeholders | `OLD-ID` → `NEW-ID` | 0-2 |
| **Documentation** | Update references | `OLD-ID` → `NEW-ID` | 0-5 |

**Total locations:** 8-10 files
**Total individual changes:** 60-120 depending on lesson size

---

## Time Estimates

### Simple Rename (Single Lesson, No Cross-References)
- **Planning & Search:** 2-3 minutes
- **File Rename:** 1 minute
- **JSON Content:** 3-5 minutes
- **Integration Points:** 5-7 minutes
- **Questions File:** 2-3 minutes
- **Verification:** 3-5 minutes
- **Total: 15-25 minutes**

### Complex Rename (Multiple Lessons, Cross-References)
- **Planning & Search:** 5-8 minutes
- **File Renames:** 2-3 minutes
- **JSON Content (multiple files):** 10-15 minutes
- **Integration Points:** 8-12 minutes
- **Questions Files (multiple):** 5-8 minutes
- **Documentation:** 2-3 minutes
- **Verification:** 5-8 minutes
- **Total: 35-55 minutes**

### Factors Affecting Time
- Number of lessons being renamed
- Number of cross-references (prerequisites, spaced review)
- Number of block IDs per lesson
- Number of questions associated with lesson
- Familiarity with the process

---

## Future Automation Ideas

### Lesson Renamer Script

A future enhancement could be `src/lib/generation/lessonRenamer.ts`:

**Features:**
- Takes old and new lesson IDs as input
- Validates new ID doesn't exist
- Renames lesson JSON file
- Updates all internal JSON content
- Updates lessonIndex.ts
- Updates page imports and registries
- Updates questions files
- Searches and reports documentation references
- Runs verification checks
- Optionally creates localStorage migration entry

**Usage example:**
```typescript
npm run rename-lesson -- --old="204-13A" --new="204-14A"
```

**Implementation pattern:**
```typescript
import { renameLessonFiles } from './fileOperations';
import { updateLessonContent } from './contentUpdater';
import { updateIntegrations } from './integrationUpdater';
import { verifyRename } from './verificationService';

export async function renameLesson(
  oldId: string,
  newId: string,
  options?: RenameOptions
): Promise<RenameResult> {
  // 1. Validate
  validateIds(oldId, newId);
  
  // 2. Rename files
  const files = await renameLessonFiles(oldId, newId);
  
  // 3. Update content
  await updateLessonContent(files, oldId, newId);
  
  // 4. Update integration points
  await updateIntegrations(oldId, newId);
  
  // 5. Update questions
  await updateQuestionsFiles(oldId, newId);
  
  // 6. Verify
  const verification = await verifyRename(oldId, newId);
  
  // 7. Report
  return {
    success: verification.passed,
    filesChanged: files,
    remainingReferences: verification.remaining,
  };
}
```

This would follow the same pattern as `lessonDeleter.ts` and `fileIntegrator.ts`.

**Benefits:**
- Reduces human error
- Faster execution (seconds vs minutes)
- Consistent results
- Automatic verification
- Dry-run option for safety

**Challenges:**
- Handling edge cases (spaced review, prerequisites)
- Documentation references (harder to automate)
- Testing thoroughly before use
- Risk of data loss if script has bugs

---

## Real-World Example: 204-13A/13B → 204-14A/14B

This guide is based on an actual rename performed on January 28, 2026.

**Context:**
- Two related lessons needed renumbering
- Both had associated question files
- Cross-references between lessons (prerequisites)
- Multiple block IDs per lesson

**Files Changed:** 8
1. `204-13A-one-way-lighting-3-plate-ceiling-rose.json` (renamed + ~30 internal changes)
2. `204-13B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json` (renamed + ~35 internal changes)
3. `lessonIndex.ts` (2 entries updated)
4. `learn/page.tsx` (2 imports + 2 array entries)
5. `learn/[lessonId]/page.tsx` (2 imports + 2 registry keys)
6. `oneWayLighting3PlateCeilingRoseQuestions.ts` (~50 learningOutcomeId updates)
7. `oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions.ts` (~50 learningOutcomeId updates)
8. `generate/page.tsx` (1 placeholder example)

**Total Changes:** ~180 individual edits across 8 files

**Time Taken:** Approximately 45 minutes (careful, systematic approach)

**Verification:** Zero remaining references to old IDs, successful browser test

**User Impact:** Progress data for users who started 204-13A or 204-13B was lost (localStorage limitation)

---

## Summary

Renaming lessons is a multi-file operation requiring attention to detail:

1. ✅ **Always search first** - Know what you're changing
2. ✅ **Use replace_all** - Efficient for repetitive changes
3. ✅ **Update integration points** - lessonIndex, pages, registries
4. ✅ **Don't forget questions** - learningOutcomeId references
5. ✅ **Check cross-references** - Prerequisites, spaced review
6. ✅ **Restart dev server** - Mandatory for changes to appear
7. ⚠️ **Warn users** - Progress data will be lost

**When in doubt, use the checklist!**

See also:
- [How to Delete Modules](./delete_modules.md)
- [Lesson Generator Guide](../lesson_factory/generator/HOW_TO_USE_GENERATOR.md)
