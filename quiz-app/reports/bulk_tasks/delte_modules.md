# Module Deletion Guide

## Overview

This guide provides a systematic approach to deleting modules from the quiz application. A "module" consists of a lesson and potentially associated multiple-choice questions. When deleting a module like `202-202.3AAA` or `202-3AAAA`, you need to remove files and references from 8 different locations.

## Module Structure

Each module in the system consists of:

- **Lesson JSON file**: Contains the lesson content, blocks, and structure
- **Lesson Index entry**: Registers the module in the navigation system
- **Question bank references**: Multiple choice questions may be embedded in existing question files
- **Page component imports**: Lesson pages need to import and register each module
- **Quiz prerequisites**: Some quizzes may list the module as a prerequisite

## Files and Locations to Update

Based on the codebase analysis, here are all the places where a module (e.g., `202-202.3AAA`) is referenced:

### 1. Lesson JSON File
- **Location**: `quiz-app/src/data/lessons/[MODULE_ID]-[name].json`
- **Example**: `quiz-app/src/data/lessons/202-202.3AAA-series-circuits.json`

### 2. Lesson Index Registry
- **Location**: `quiz-app/src/data/lessons/lessonIndex.ts`
- **What to remove**: The entry object in the `lessonIndex` array

### 3. Question Bank File
- **Location**: `quiz-app/src/data/questions/[topic]Questions.ts`
- **Example**: `quiz-app/src/data/questions/seriesCircuitsQuestions.ts`
- **Note**: Questions are often shared across multiple modules. For `202-3AAAA`, all questions reference `learningOutcomeId: "202-3AAAA-LO1"` or similar

### 4. Questions Index (if applicable)
- **Location**: `quiz-app/src/data/questions/index.ts`
- **Note**: Only needed if you created a dedicated question file for the module

### 5. Main Questions File (if applicable)
- **Location**: `quiz-app/src/data/questions.ts`
- **Note**: Only needed if you have a dedicated question import

### 6. Lesson Page Component
- **Location**: `quiz-app/src/app/learn/[lessonId]/page.tsx`
- **What to remove**:
  - Import statement (e.g., `import lesson202_202_3AAA from '@/data/lessons/202-202.3AAA-series-circuits.json'`)
  - Entry in the `LESSONS` object

### 7. Learn Page
- **Location**: `quiz-app/src/app/learn/page.tsx`
- **What to remove**:
  - Import statement
  - Entry in the `LESSONS` array

### 8. Quiz Prerequisites (if applicable)
- **Location**: `quiz-app/src/data/quizzes/interleavedQuizzes.ts`
- **What to check**: Whether any quiz configurations list the module in their `prerequisites` array

## Step-by-Step Deletion Process

### Prerequisites

- [ ] Identify the module ID you want to delete (e.g., `202-202.3AAA`)
- [ ] Search the codebase for all references to ensure nothing is missed
- [ ] Back up your code or ensure you're on a branch

### Step 1: Search for All References

**PowerShell (Windows):**
```powershell
# Search for the module ID across all files
Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern "202-202.3AAA"
```

**Git Bash / Linux / Mac:**
```bash
# Search for the module ID across all files
grep -r "202-202.3AAA" quiz-app/src/
```

**Using ripgrep (faster, recommended):**
```bash
rg "202-202.3AAA" quiz-app/src/
```

This will show you every file that references the module.

### Step 2: Delete the Lesson JSON File

- [ ] Navigate to `quiz-app/src/data/lessons/`
- [ ] Delete the file: `[MODULE_ID]-[name].json`
  - Example: `202-202.3AAA-series-circuits.json`

### Step 3: Remove from Lesson Index

- [ ] Open `quiz-app/src/data/lessons/lessonIndex.ts`
- [ ] Find and delete the entire entry object for your module in the `lessonIndex` array
- [ ] The entry looks like:

```typescript
{
  id: '202-202.3AAA',
  title: 'Series Circuits',
  unit: 'Unit 202',
  unitNumber: '202',
  topic: 'Series Circuits',
  description: '[Generated lesson]',
  questionCount: getLessonQuestionCount('202-202.3AAA'),
  available: true,
  order: 8.3,
},
```

### Step 4: Remove Multiple Choice Questions

**Option A: If questions are in a shared question bank file**

- [ ] Open the relevant question file (e.g., `quiz-app/src/data/questions/seriesCircuitsQuestions.ts`)
- [ ] Search for `learningOutcomeId` that matches your module (e.g., `"202-202.3AAA-LO1"`)
- [ ] Delete all question objects that reference the module's learning outcomes
- [ ] **Important**: Questions may reference like `"202-3AAAA-LO1"` - search for variations

**Search command to find questions:**
```powershell
# PowerShell
Get-ChildItem -Path "quiz-app/src/data/questions/" -Recurse -File | Select-String -Pattern "202-202.3AAA"
```

```bash
# Git Bash / Linux / Mac
grep -r "202-202.3AAA" quiz-app/src/data/questions/
```

**Option B: If you created a dedicated question file**

- [ ] Delete the question file from `quiz-app/src/data/questions/`
- [ ] Remove the import from `quiz-app/src/data/questions/index.ts`
- [ ] Remove from the `allTaggedQuestions` array
- [ ] Remove the export statement
- [ ] Remove the import from `quiz-app/src/data/questions.ts` if it exists

### Step 5: Remove from Lesson Page Component

- [ ] Open `quiz-app/src/app/learn/[lessonId]/page.tsx`
- [ ] Delete the import statement:
  ```typescript
  import lesson202_202_3AAA from '@/data/lessons/202-202.3AAA-series-circuits.json';
  ```
- [ ] Delete the entry in the `LESSONS` object:
  ```typescript
  '202-202.3AAA': lesson202_202_3AAA as Lesson,
  ```

### Step 6: Remove from Learn Page

- [ ] Open `quiz-app/src/app/learn/page.tsx`
- [ ] Delete the import statement
- [ ] Remove the entry from the `LESSONS` array

### Step 7: Check Quiz Prerequisites

- [ ] Open `quiz-app/src/data/quizzes/interleavedQuizzes.ts`
- [ ] Search for your module ID in the `prerequisites` arrays
- [ ] Remove it from any quiz configurations if found

### Step 8: Verify and Test

- [ ] Run a final search to ensure no references remain:
  ```bash
  rg "202-202.3AAA" quiz-app/src/
  ```
- [ ] Start the development server: `npm run dev`
- [ ] Check that the app builds without errors
- [ ] Navigate to the learn page and verify the module no longer appears
- [ ] Run linter to check for any import errors: `npm run lint`

## Concrete Examples

### Example 1: Deleting Module 202-202.3AAA

Here's a concrete walkthrough for deleting the trial module `202-202.3AAA`:

#### Files to Modify/Delete

1. **DELETE**: `quiz-app/src/data/lessons/202-202.3AAA-series-circuits.json`
2. **EDIT**: `quiz-app/src/data/lessons/lessonIndex.ts` - Remove entry with `id: '202-202.3AAA'`
3. **EDIT**: `quiz-app/src/data/questions/seriesCircuitsQuestions.ts` - Remove questions with `learningOutcomeId` starting with `"202-202.3AAA"`
4. **EDIT**: `quiz-app/src/app/learn/[lessonId]/page.tsx` - Remove import and LESSONS entry
5. **EDIT**: `quiz-app/src/app/learn/page.tsx` - Remove import and LESSONS array entry

#### Search Command

```powershell
# PowerShell
Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern "202-202\.3AAA|202\.202\.3AAA"
```

```bash
# Git Bash / Linux / Mac
grep -rE "202-202\.3AAA|202\.202\.3AAA" quiz-app/src/
```

```bash
# Ripgrep (recommended)
rg "202-202\.3AAA|202\.202\.3AAA" quiz-app/src/
```

#### Detailed Steps

**Step 1: Search**
```bash
rg "202-202\.3AAA" quiz-app/src/
```

Expected results will show references in:
- `lessonIndex.ts`
- `learn/[lessonId]/page.tsx`
- `learn/page.tsx`
- `202-202.3AAA-series-circuits.json` (the file itself)

**Step 2: Delete lesson file**
```bash
# Navigate to lessons directory
cd quiz-app/src/data/lessons/
# Delete the file
rm 202-202.3AAA-series-circuits.json
```

**Step 3-7: Edit files** (follow the checklist above)

**Step 8: Verify**
```bash
rg "202-202\.3AAA" quiz-app/src/
# Should return no results if deletion is complete
```

### Example 2: Deleting Module 202-3AAAA

Similar process for the trial module `202-3AAAA`:

#### Files to Modify/Delete

1. **DELETE**: `quiz-app/src/data/lessons/202-3AAAA-series-circuits.json`
2. **EDIT**: `quiz-app/src/data/lessons/lessonIndex.ts` - Remove entry with `id: '202-3AAAA'`
3. **EDIT**: `quiz-app/src/data/questions/seriesCircuitsQuestions.ts` - **IMPORTANT**: This module has 50 questions! All need to be deleted. Search for `"202-3AAAA-LO1"` or `"202-3AAAA-LO2"`
4. **EDIT**: `quiz-app/src/app/learn/[lessonId]/page.tsx` - Remove import and LESSONS entry
5. **EDIT**: `quiz-app/src/app/learn/page.tsx` - Remove import and LESSONS array entry

#### Search Command

```bash
# This will show all references
rg "202-3AAAA" quiz-app/src/
```

#### Special Note for 202-3AAAA

This module has **50 multiple choice questions** in `seriesCircuitsQuestions.ts`. The questions are from ID 4051 to 4100, and they all have:
- `learningOutcomeId: "202-3AAAA-LO1"` or `"202-3AAAA-LO2"`
- The file header comment says: `* Aligned with lesson 202-3AAAA learning outcomes`

**To delete all questions:**
1. Open `quiz-app/src/data/questions/seriesCircuitsQuestions.ts`
2. Search for the comment `* Aligned with lesson 202-3AAAA learning outcomes`
3. Delete all question objects from ID 4051 to 4100 (the entire `seriesCircuitsQuestions` array content)
4. You'll need to delete approximately 1400 lines of code

**Alternative approach:** Since ALL questions in this file are for 202-3AAAA, you could:
1. Delete the entire file `seriesCircuitsQuestions.ts`
2. Remove the import from `quiz-app/src/data/questions/index.ts`
3. Remove the duplicate import from the same file (it's imported twice!)
4. Remove from `allTaggedQuestions` array

## Search Commands Reference

### Windows PowerShell

```powershell
# Basic search
Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern "MODULE_ID"

# Search with multiple patterns
Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern "202-202\.3AAA|202\.202\.3AAA"

# Search in specific directory
Get-ChildItem -Path "quiz-app/src/data/questions/" -Recurse -File | Select-String -Pattern "202-3AAAA"

# Count occurrences
(Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern "202-3AAAA").Count
```

### Git Bash / Linux / Mac

```bash
# Basic search
grep -r "MODULE_ID" quiz-app/src/

# Search with extended regex
grep -rE "202-202\.3AAA|202\.202\.3AAA" quiz-app/src/

# Search in specific directory
grep -r "202-3AAAA" quiz-app/src/data/questions/

# Count occurrences
grep -r "202-3AAAA" quiz-app/src/ | wc -l

# Show only filenames
grep -rl "202-3AAAA" quiz-app/src/
```

### Ripgrep (Recommended - Fastest)

```bash
# Basic search
rg "MODULE_ID" quiz-app/src/

# Search with regex
rg "202-202\.3AAA|202\.202\.3AAA" quiz-app/src/

# Search in specific directory
rg "202-3AAAA" quiz-app/src/data/questions/

# Count occurrences
rg "202-3AAAA" quiz-app/src/ --count

# Show only filenames
rg "202-3AAAA" quiz-app/src/ --files-with-matches

# Search for multiple patterns
rg -e "202-3AAAA" -e "202-202.3AAA" quiz-app/src/
```

## Common Issues and Solutions

### Issue 1: TypeScript errors after deletion

**Symptom:** 
```
Error: Module '"@/data/lessons/202-202.3AAA-series-circuits"' not found
Cannot find name 'lesson202_202_3AAA'
```

**Solution**: 
Make sure you removed both the import statement AND the usage in the LESSONS object/array. Check:
1. Import statement at the top of the file
2. Entry in the LESSONS object (for `[lessonId]/page.tsx`)
3. Entry in the LESSONS array (for `learn/page.tsx`)

### Issue 2: Questions still appearing in quizzes

**Symptom:** 
Questions from the deleted module still show up when taking quizzes.

**Solution**: 
Check that you removed all questions with matching `learningOutcomeId` values. Use grep to search:

```bash
rg "202-202.3AAA" quiz-app/src/data/questions/
```

If results appear, you missed some questions. Delete all question objects that reference the module.

### Issue 3: Build fails with "module not found"

**Symptom:**
```
Module not found: Can't resolve '@/data/lessons/202-202.3AAA-series-circuits.json'
```

**Solution**: 
You likely missed removing an import statement. Check all files in:
- Step 5: `quiz-app/src/app/learn/[lessonId]/page.tsx`
- Step 6: `quiz-app/src/app/learn/page.tsx`

Search for the import:
```bash
rg "import.*202-202.3AAA" quiz-app/src/
```

### Issue 4: Module still shows on learn page

**Symptom:** 
After deletion, the module still appears in the lesson list on the learn page.

**Solution**: 
Check that you removed it from both:
1. `quiz-app/src/app/learn/page.tsx` - LESSONS array
2. `quiz-app/src/data/lessons/lessonIndex.ts` - lessonIndex array

The module needs to be removed from BOTH places to stop appearing.

### Issue 5: Development server won't start

**Symptom:**
```
npm run dev fails with compilation errors
```

**Solution**:
1. Check for syntax errors in files you edited (missing commas, brackets)
2. Run the linter: `npm run lint`
3. Check the terminal for specific error messages
4. If you edited `lessonIndex.ts`, make sure you didn't leave a trailing comma after the last entry

### Issue 6: Questions file has duplicate imports

**Symptom:**
In `quiz-app/src/data/questions/index.ts`, you see the same question file imported twice.

**Solution**:
Remove both instances of the duplicate import and export. This is a bug in the current codebase - `seriesCircuitsQuestions` is imported twice:

```typescript
// Remove both of these if deleting seriesCircuitsQuestions
import { seriesCircuitsQuestions } from './seriesCircuitsQuestions';
// ... later in the file ...
import { seriesCircuitsQuestions } from './seriesCircuitsQuestions'; // duplicate!
```

### Issue 7: getLessonQuestionCount returns non-zero for deleted module

**Symptom:**
Even after deleting questions, the count still shows questions exist.

**Solution**:
The `getLessonQuestionCount` function caches results. After removing questions:
1. Restart the development server
2. Clear any browser cache
3. Verify the questions are actually deleted from the question bank file

## Safety Tips

1. **Always use version control**: Commit your work before starting deletions so you can easily revert if needed
   ```bash
   git add .
   git commit -m "Checkpoint before deleting module 202-202.3AAA"
   ```

2. **Search thoroughly**: Use grep/ripgrep to find all references before starting deletion
   ```bash
   rg "MODULE_ID" quiz-app/src/
   ```

3. **Delete one module at a time**: Don't try to delete multiple modules simultaneously - it's easy to make mistakes

4. **Test after each deletion**: Run the dev server after each module deletion to catch errors early
   ```bash
   npm run dev
   ```

5. **Check for variations**: Module IDs might appear with dots, hyphens, or underscores in different contexts:
   - `202-202.3AAA` (with dots)
   - `202_202_3AAA` (with underscores in variable names)
   - `202-202-3AAA` (all hyphens)

6. **Keep a backup**: Consider backing up the lesson JSON file before deletion in case you need to reference it later

7. **Document why**: Add a comment in your commit message explaining why the module was deleted (e.g., "trial module" or "superseded by 202-3A")

## Quick Reference Checklist

Use this checklist for deleting any module `[MODULE_ID]`:

### Pre-Deletion
- [ ] **Identify**: Confirm the exact module ID
- [ ] **Commit**: Save current work to version control
- [ ] **Search**: Run `rg "[MODULE_ID]" quiz-app/src/` to find all references

### Deletion Steps
- [ ] **Delete**: `quiz-app/src/data/lessons/[MODULE_ID]-*.json`
- [ ] **Edit**: `lessonIndex.ts` - Remove entry from `lessonIndex` array
- [ ] **Edit**: Question file - Remove questions with matching `learningOutcomeId`
- [ ] **Edit**: `questions/index.ts` - Remove import/export (if dedicated file)
- [ ] **Edit**: `questions.ts` - Remove import (if exists)
- [ ] **Edit**: `learn/[lessonId]/page.tsx` - Remove import and LESSONS entry
- [ ] **Edit**: `learn/page.tsx` - Remove import and LESSONS entry
- [ ] **Check**: `interleavedQuizzes.ts` - Remove from prerequisites (if exists)

### Post-Deletion Verification
- [ ] **Search again**: `rg "[MODULE_ID]" quiz-app/src/` should return no results
- [ ] **Lint**: Run `npm run lint` to check for errors
- [ ] **Build**: Run `npm run dev` to ensure app starts
- [ ] **Test**: Navigate to learn page and verify module doesn't appear
- [ ] **Commit**: Save your changes with a descriptive message

## Advanced: Batch Deletion Script

If you need to delete multiple trial modules, you can create a script. Here's an example PowerShell script:

```powershell
# delete-modules.ps1
# WARNING: Test this on a branch first!

$modulesToDelete = @(
    "202-202.3AAA",
    "202-3AAAA"
)

foreach ($moduleId in $modulesToDelete) {
    Write-Host "Searching for references to $moduleId..."
    $results = Get-ChildItem -Path "quiz-app/src/" -Recurse -File | Select-String -Pattern $moduleId
    
    Write-Host "Found $($results.Count) references"
    $results | ForEach-Object { Write-Host "  $($_.Path):$($_.LineNumber)" }
    
    Write-Host ""
}

Write-Host "Review the above references and delete manually following the guide."
Write-Host "DO NOT use automated deletion - it's too risky!"
```

**Note**: Automated deletion is NOT recommended. Always delete modules manually following the checklist to avoid breaking your application.

## Summary

Deleting a module requires careful attention to ensure all references are removed. The key locations are:

1. The lesson JSON file itself
2. The lesson index registry
3. Multiple choice questions (often 50+ questions per module)
4. Page component imports (2 files)
5. Quiz prerequisites (if applicable)

Always search first, delete systematically, and test thoroughly. When in doubt, commit your changes at each step so you can roll back if needed.

---

**Last Updated**: January 26, 2026  
**Tested With**: Modules 202-202.3AAA and 202-3AAAA
