# Diagnostic Issues: Questions Count & LLM Analysis

**Date:** 2026-01-16  
**Status:** Under Investigation  
**Priority:** High

---

## Problem Statement

### Issue 1: Only 8 Questions Instead of 10

The diagnostic gate for lesson 202-5A is showing "Total questions available: 8" when it should show 10 questions.

**Expected:** 10 questions distributed equally across 202-1A, 202-2A, 202-3A, 202-4A  
**Actual:** Only 8 questions total

### Issue 2: LLM Analysis Not Generating

When failing the diagnostic, the LLM should generate personalized analysis explaining WHY mistakes were made. Instead, it's showing the fallback error message:

**Expected:**
```
❌ Why You Got These Wrong:
[Specific pattern analysis from LLM]

🎯 What You Need to Understand:
[Key concepts with explanations]

⚡ Quick Fix:
[Actionable advice]
```

**Actual:**
```
❌ Why You Got These Wrong:
We encountered an issue generating personalized analysis, but reviewing 
the prerequisite lessons will help strengthen your understanding.
```

**Status:** Not fixed yet. The LLM calls are failing, likely due to temporary API issues or rate limiting.

---

## Context

### What is the Diagnostic System?

The diagnostic system tests prerequisite knowledge before allowing students to proceed to a new lesson. For lesson 202-5A, it should:

1. Pull 10 questions from ALL previous lessons in the unit (202-1A through 202-4A)
2. Distribute questions equally across lessons to avoid bias
3. Randomize question selection within each lesson
4. Shuffle final order

### Recent Changes

We just implemented an **equal distribution algorithm** in `src/lib/questions/cumulativeQuestions.ts` to fix a previous issue where all questions came from 202-1A only.

**The algorithm should work like this:**

For 10 questions across 4 lessons:
- Base: `Math.floor(10 / 4) = 2` questions per lesson
- Remainder: `10 % 4 = 2` extra questions
- Distribution: `[3, 3, 2, 2]` questions from each lesson
- Total: 10 questions

---

## Question Bank Analysis

### Confirmed Question Counts

Based on grep searches:

```
202-1A: 50 questions (electricalQuantitiesQuestions.ts)
202-2A: 50 questions (ohmsLawQuestions.ts)
202-3A: 50 questions (seriesCircuitsQuestions.ts)
202-4A: 15 questions (parallelCircuitsQuestions.ts)
```

**All lessons have sufficient questions** - none are missing questions.

### How Questions Are Linked to Lessons

Questions use `learningOutcomeId` field (not `lessonId`):
- Format: `"lessonId-LOX"` (e.g., `"202-1A-LO1"`)
- The `filterQuestionsByLesson()` function matches by checking if `learningOutcomeId` starts with the lesson ID

Example:
```typescript
export function filterQuestionsByLesson(lessonId: string): TaggedQuestion[] {
  return questions.filter(q => {
    const taggedQ = q as TaggedQuestion;
    return taggedQ.learningOutcomeId?.startsWith(lessonId);
  }) as TaggedQuestion[];
}
```

---

## Code Flow

### 1. DiagnosticGate Component
**File:** `src/components/learning/DiagnosticGate.tsx`

```typescript
// Line 49-50
const diagnosticQuestions = getDiagnosticQuestions(lessonId);
setQuestions(diagnosticQuestions);
```

### 2. Diagnostic Service
**File:** `src/lib/diagnostic/diagnosticService.ts`

```typescript
export function getDiagnosticQuestions(lessonId: string): TaggedQuestion[] {
  // Get 10 questions from ALL previous lessons in the unit
  // Weight: 0.0 means 0% from current lesson, 100% from all previous
  const questions = getCumulativeQuestions(lessonId, 10, 0.0);
  return questions;
}
```

### 3. Cumulative Questions (Equal Distribution)
**File:** `src/lib/questions/cumulativeQuestions.ts`

```typescript
export function getCumulativeQuestions(
  lessonId: string,
  maxQuestions: number = 20,
  currentWeight: number = 0.5
): TaggedQuestion[] {
  // ... gets current lesson and previous lessons
  
  const currentCount = Math.floor(maxQuestions * currentWeight);  // = 0 for diagnostic
  const previousCount = maxQuestions - currentCount;               // = 10 for diagnostic
  
  // EQUAL DISTRIBUTION ALGORITHM
  if (previousCount > 0 && previousLessons.length > 0) {
    const questionsPerLesson = Math.floor(previousCount / previousLessons.length);
    const remainder = previousCount % previousLessons.length;
    
    previousLessons.forEach((lesson, index) => {
      const lessonQuestions = filterQuestionsByLesson(lesson.id);
      const questionsToTake = questionsPerLesson + (index < remainder ? 1 : 0);
      const selectedFromLesson = sample(lessonQuestions, questionsToTake);
      previousQuestions.push(...selectedFromLesson);
    });
  }
  
  // ... combine and shuffle
}
```

### 4. Quiz Component Display
**File:** `src/components/Quiz.tsx` (Line 382)

```typescript
<p className="text-gray-500 dark:text-slate-500">
  Total questions available: {sectionQuestions.length}
</p>
```

This displays the length of the questions array passed from DiagnosticGate.

---

## Debugging Added

Console logs have been added to `cumulativeQuestions.ts` (lines 87-105) to track:
- How many questions are being distributed
- How many lessons are involved
- For each lesson: available questions, questions to take, actually selected
- Total selected from all previous lessons

**To see the logs:**
1. Open browser console
2. Navigate to lesson 202-5A
3. Start the diagnostic
4. Check console for `[Cumulative Questions]` logs

---

## Possible Causes

### Hypothesis 1: Lesson Index Issue
Maybe `previousLessons` array doesn't contain all 4 lessons (202-1A through 202-4A)?

**Check:** Are all 4 lessons being included in the `previousLessons.forEach` loop?

### Hypothesis 2: Question Filter Issue
Maybe `filterQuestionsByLesson()` isn't finding all questions for one or more lessons?

**Check:** Do the console logs show 0 available questions for any lesson?

### Hypothesis 3: Sample Function Issue
Maybe the `sample()` function isn't returning the expected number of questions?

**Check:** Do the logs show a mismatch between "taking X" and "actually selected Y"?

### Hypothesis 4: LessonIndexEntry Order Issue
Maybe the lesson order values aren't sequential or some lessons are being filtered out?

**Lesson order values (from lessonIndex.ts):**
- 202-1A: order = 1
- 202-2A: order = 2
- 202-3A: order = 3
- 202-4A: order = 4
- 202-5A: order = 5

### Hypothesis 5: Question Import Issue
Maybe some question banks aren't being imported into the main questions array?

**Check in `src/data/questions.ts`:**
```typescript
export const questions: Question[] = [
  ...healthAndSafetyQuestions,
  ...communicationQuestions,
  ...scienceQuestions,
  ...electricalQuantitiesQuestions,  // 202-1A
  ...ohmsLawQuestions,               // 202-2A
  ...seriesCircuitsQuestions,        // 202-3A
  ...powerEnergyQuestions,
  ...magnetismElectromagnetismQuestions,
  ...acPrinciplesQuestions,
  ...acGenerationQuestions,
  ...acWaveformQuestions,
  ...transformersQuestions,
];
```

**Note:** `parallelCircuitsQuestions` (202-4A) is NOT in this list!

---

## Most Likely Root Cause

**`parallelCircuitsQuestions` is not imported or exported from `src/data/questions.ts`**

This would explain:
- 202-1A, 202-2A, 202-3A questions are available (imported)
- 202-4A questions are missing (not imported)
- Distribution would be: [3, 3, 2, 0] = 8 questions total

---

## Next Steps

1. **Check imports in `src/data/questions.ts`:**
   - Is `parallelCircuitsQuestions` imported?
   - Is it included in the `questions` array export?

2. **Add import if missing:**
   ```typescript
   import { parallelCircuitsQuestions } from './questions/parallelCircuitsQuestions';
   
   export const questions: Question[] = [
     // ... existing imports
     ...parallelCircuitsQuestions,  // ADD THIS
   ];
   ```

3. **Verify the fix:**
   - Restart dev server
   - Navigate to 202-5A diagnostic
   - Should now show "Total questions available: 10"
   - Console logs should show questions from all 4 lessons

---

## Files to Check

1. `src/data/questions.ts` - Main question export (CHECK IMPORTS HERE)
2. `src/data/questions/parallelCircuitsQuestions.ts` - Does it exist and export correctly?
3. `src/lib/questions/cumulativeQuestions.ts` - Console logs for debugging
4. `src/components/learning/DiagnosticGate.tsx` - Calls getDiagnosticQuestions
5. `src/lib/diagnostic/diagnosticService.ts` - Calls getCumulativeQuestions

---

## Important Notes

### ⚠️ About .env.local and LLM Models

**CRITICAL:** The model names in `.env.local` are CORRECT and should NOT be changed:

```env
GEMINI_MODEL=gemini-3-flash-preview          ✅ CORRECT - New 2026 model
GEMINI_FALLBACK_MODEL=gemini-2.5-flash       ✅ CORRECT - New 2026 model
```

**DO NOT:**
- Change these model names
- Replace with older models (gemini-1.5-flash, gemini-2.0-flash-exp, etc.)
- Add notes or comments saying these are "invalid"

**Why the LLM isn't working:**
The 503 errors are due to:
1. Temporary API overload (Google's servers are busy)
2. Possible rate limiting
3. API quota issues
4. Network connectivity issues

**NOT** because the model names are wrong. These are legitimate new models released in 2026.

### LLM Error Logs

Recent server logs show:
```
Error: [GoogleGenerativeAI Error]: Error fetching from 
https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent: 
[503 Service Unavailable] The model is overloaded. Please try again later.
```

This is a **temporary Google API issue**, not a configuration issue.

### Equal Distribution Algorithm

The algorithm is working correctly. The issue is not with the distribution logic - it's with the input data (missing questions from 202-4A).

---

## Resolution Checklist

### Issue 1: Question Count (Fixable Now)

- [ ] Verify `parallelCircuitsQuestions` exists and has 15 questions
- [ ] Check if `parallelCircuitsQuestions` is imported in `src/data/questions.ts`
- [ ] Add import and export if missing
- [ ] Restart dev server
- [ ] Test 202-5A diagnostic shows 10 questions
- [ ] Verify questions come from all 4 lessons (check console logs)
- [ ] Remove debug console.log statements after fix confirmed

### Issue 2: LLM Not Working (Not Fixable by Code Changes)

- [ ] Wait for Google API to recover from overload
- [ ] Check API quota/billing status if issue persists
- [ ] Verify API key is still valid
- [ ] Check network connectivity
- [ ] Monitor server logs for different error messages

**Note:** This is an external API issue, not a code bug. The fallback error handling is working correctly.
