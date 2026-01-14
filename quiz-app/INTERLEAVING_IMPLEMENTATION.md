# Interleaving Implementation

**Date:** 2026-01-14  
**Status:** Complete ✓  
**Tests:** 13/13 passing

---

## What Was Implemented

### Overview
Implemented **interleaved practice** for the C&G 2365 Level 2 learning system. Interleaving mixes different concepts (series and parallel circuits) during practice to force learners to **discriminate** between similar concepts, leading to deeper understanding and better long-term retention.

---

## 1. Question Bank Additions

### File: `quiz-app/src/data/questions/parallelCircuitsQuestions.ts`
- **New file** with 15 parallel circuit questions
- Includes:
  - Discrimination questions (identify series vs parallel)
  - Conceptual questions (current rules, voltage rules)
  - Calculation questions (total resistance)
  - Formula recognition
  - Application questions
- All questions tagged appropriately (`parallel`, `discrimination`, `conceptual`, `calculation`, etc.)
- Misconception codes mapped for Fix mode

### File: `quiz-app/src/data/questions/index.ts`
- Central export for all question banks
- `allTaggedQuestions` array combining series + parallel
- Helper functions: `getQuestionsByTags()`, `getQuestionsByLesson()`

---

## 2. Interleaving Service

### File: `quiz-app/src/lib/questions/interleavingService.ts`
Core service that creates mixed question sets.

**Key Functions:**
- `createInterleavedQuiz()` - Main function, takes config and generates mixed quiz
- `createSeriesParallelMixedQuiz()` - Pre-configured series/parallel mix
- `validateInterleaving()` - Checks quality of interleaving

**Interleaving Strategies:**
1. **Alternating** - Systematic A, B, Disc, A, B, Disc pattern
2. **Progressive** - Start with discrimination, then lighter interleaving, then heavier practice
3. **Random** - Fully randomized (maintains unpredictability)

**Configuration:**
```typescript
SERIES_PARALLEL_INTERLEAVED_CONFIG = {
  pools: [
    { tag: 'series', count: 5 },
    { tag: 'parallel', count: 5 }
  ],
  discriminationCount: 4,
  strategy: 'alternating',
  difficultyProgression: 'easy-to-hard'
}
```

**Validation:**
The service validates that:
- Questions are properly mixed (longest block ≤ 2)
- All concept types are represented
- Discrimination questions are included

---

## 3. Quiz Configuration System

### File: `quiz-app/src/data/quizzes/interleavedQuizzes.ts`
Defines quiz metadata and prerequisites.

**Quiz Config:**
```typescript
SERIES_PARALLEL_MIXED_QUIZ = {
  id: 'mixed-series-parallel',
  title: 'Mixed Practice: Series & Parallel Discrimination',
  type: 'interleaved',
  prerequisites: ['202-4A', '202-4B'],
  estimatedTime: 20,
  passingScore: 70,
  isMasteryGate: true
}
```

**Functions:**
- `getQuizConfig()` - Get quiz by ID
- `hasCompletedPrerequisites()` - Check if learner is ready
- `getAvailableQuizzes()` - Filter by completed lessons

---

## 4. UI Route

### File: `quiz-app/src/app/quiz/interleaved/[quizId]/page.tsx`
Dedicated page for interleaved quizzes.

**Features:**
- Dynamic route: `/quiz/interleaved/mixed-series-parallel`
- Generates fresh interleaved question set on each attempt
- Validates interleaving quality (logs stats to console)
- Checks prerequisites (warns but doesn't block in MVP)
- Shows methodology explainer banner
- Uses Focus Mode styling (Layout C principles)
- Integrates with existing Quiz component

**UI Elements:**
- Minimal header (Focus Mode)
- Interleaving explanation banner
- Quiz metadata (question count, time, pass threshold)
- "Why Mixed Practice?" explainer

---

## 5. Learn Page Integration

### File: `quiz-app/src/app/learn/page.tsx`
Added prominent link to interleaved quiz.

**Design:**
- Purple gradient card (distinct from lessons)
- 🔀 icon for interleaving
- Prerequisites listed (202-4A & 202-4B)
- Shows it's a "Mastery Assessment"
- Positioned after lessons, before "coming soon"

---

## 6. Testing

### File: `quiz-app/src/tests/interleaving.test.ts`
Comprehensive test suite with **13 passing tests**.

**Test Coverage:**
- ✓ Creates quizzes with all pool questions
- ✓ Respects question counts from config
- ✓ Applies difficulty progression correctly
- ✓ Generates properly interleaved sets
- ✓ Uses predefined config correctly
- ✓ Validates interleaving quality
- ✓ Detects poor interleaving (blocked practice)
- ✓ Returns correct statistics
- ✓ Alternating strategy works
- ✓ Progressive strategy includes early discrimination
- ✓ Question bank has discrimination questions
- ✓ Question bank has series questions
- ✓ Question bank has parallel questions

**Test Results:**
```
 Test Files  1 passed (1)
      Tests  13 passed (13)
   Duration  465ms
```

---

## Why This Matters

### Educational Theory
**Blocked practice** (one concept at a time) produces:
- ✓ Good performance during practice
- ✗ Poor performance on delayed tests
- ✗ Inability to discriminate when to use each concept

**Interleaved practice** (mixed concepts) produces:
- ✗ Worse performance during practice (feels harder)
- ✓ Better performance on delayed tests
- ✓ Strong discrimination skills (choosing the right method)

### Real-World Application
On the C&G 2365 exam, questions are **not** organized by topic. Learners must:
1. Look at the circuit
2. **Discriminate** (series or parallel?)
3. **Select** the correct rule
4. **Apply** the formula

Interleaved practice trains exactly this skill.

---

## How to Use

### For Learners
1. Complete lesson 202-4A (Series Circuits)
2. Complete lesson 202-4B (Parallel Circuits)
3. Navigate to `/learn`
4. Click the purple "Mixed Practice" card
5. Take the interleaved quiz

### For Developers
```typescript
import { createSeriesParallelMixedQuiz } from '@/lib/questions/interleavingService';
import { allTaggedQuestions } from '@/data/questions/index';

const questions = createSeriesParallelMixedQuiz(allTaggedQuestions);
// Returns ~14 mixed questions
```

---

## Future Enhancements

### Short Term
- [ ] Lock mode switcher in interleaved quizzes (enforce Check mode)
- [ ] Show interleaving stats to learner after completion
- [ ] Track interleaved quiz performance separately

### Medium Term
- [ ] More interleaved quizzes (Ohm's Law + Power, etc.)
- [ ] Adaptive interleaving (adjust mix based on performance)
- [ ] Spaced interleaved reviews (return to mixed practice after delay)

### Long Term
- [ ] Machine learning to optimize interleaving strategy
- [ ] Personalized question selection based on misconceptions
- [ ] Real-time interleaving quality feedback

---

## Alignment with Methodology

From **"3# Learning Method Rules"**:
> **6) Interleaving after basics**  
> Once learners understand fundamentals, practice mixes similar concepts so they learn to choose the correct rule/method.

✓ **Implemented exactly as specified**

From **"# 6 QA / Evaluation Overview"**:
> **5) Consistency over time**  
> Prompt updates and content updates must not degrade behaviour or reliability.

✓ **Validated with automated tests** - Golden Set pattern applied to interleaving

---

## Files Created/Modified

**Created:**
- `quiz-app/src/data/questions/parallelCircuitsQuestions.ts`
- `quiz-app/src/data/questions/index.ts`
- `quiz-app/src/lib/questions/interleavingService.ts`
- `quiz-app/src/data/quizzes/interleavedQuizzes.ts`
- `quiz-app/src/app/quiz/interleaved/[quizId]/page.tsx`
- `quiz-app/src/tests/interleaving.test.ts`
- `quiz-app/INTERLEAVING_IMPLEMENTATION.md` (this file)

**Modified:**
- `quiz-app/src/app/learn/page.tsx` (added interleaved quiz link)

---

## Conclusion

Interleaving is now fully implemented and tested. The system can:
- ✓ Mix series and parallel questions
- ✓ Include discrimination questions
- ✓ Validate interleaving quality
- ✓ Apply different mixing strategies
- ✓ Track question statistics
- ✓ Integrate with existing Quiz component

**This closes a critical gap in the methodology and brings the app into full alignment with evidence-based learning principles.**

The next priority gaps (from earlier assessment):
1. Complete Layout C (Focus Mode with locked tutor)
2. Enforce spaced review gates
3. Close misconception→Fix→retest loop


