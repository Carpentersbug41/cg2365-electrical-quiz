# Phase 10-13 v3: Specific Code Analysis

## 1. Phase13 Acceptance Rule

### Exact Code Location
**File:** `quiz-app/src/lib/generation/phases/Phase13_Rescore.ts`

### Lines 114-117: Acceptance Logic
```typescript
// Decision logic
const meetsThreshold = candidateScore.total >= threshold;
const improves = candidateScore.total >= originalScore.total;

const accepted = meetsThreshold && improves;
```

### Threshold Value
**File:** `quiz-app/src/lib/generation/SequentialLessonGenerator.ts:996`

```typescript
const result = await rescorer.rescoreAndCompare(
  lesson,
  refinement.refinedLesson,
  phase10Score,
  this.phase10.lastSyllabusContext,
  this.generateWithRetry,
  96  // threshold ← HARDCODED TO 96
);
```

**Default in Phase13_Rescore.ts:40**
```typescript
async rescoreAndCompare(
  originalLesson: Lesson,
  candidateLesson: Lesson,
  originalScore: Phase10Score,
  syllabusContext: SyllabusContext | null,
  generateFn: Function,
  threshold: number = 96  // ← DEFAULT VALUE
): Promise<Phase13Result>
```

### Why 74→85 Should NOT Be Accepted (but logs claim it was)

**Math check with threshold = 96:**
- Original score: 74
- Candidate score: 85
- Improvement: +11

**Acceptance conditions:**
```typescript
meetsThreshold = (85 >= 96)  // ❌ FALSE
improves = (85 >= 74)        // ✅ TRUE
accepted = FALSE && TRUE     // ❌ FALSE
```

**Expected outcome:** REJECTED (does not meet threshold)

**Actual log message format (from Phase13_Rescore.ts:121):**
```typescript
if (accepted) {
  reason = `Candidate meets threshold (${candidateScore.total} >= ${threshold}) and improves on original (${candidateScore.total} >= ${originalScore.total})`;
}
```

### Possible Explanations for "74→85 accepted" in Logs

1. **Old logs from before threshold enforcement** - Code may have been updated after those logs were generated

2. **Different threshold was used** - If threshold was 85 or lower:
   ```typescript
   meetsThreshold = (85 >= 85)  // ✅ TRUE
   improves = (85 >= 74)        // ✅ TRUE
   accepted = TRUE && TRUE      // ✅ TRUE
   ```

3. **Bug in older code** - Previous version may have only checked `improves` without `meetsThreshold`

4. **Logs from Phase12 (old patch system)** - Before Phase13 was implemented, acceptance logic may have been different

### Current Implementation Status

**Code is correct as of latest commit:**
- ✅ Threshold hardcoded to 96
- ✅ Both conditions required (meets threshold AND improves)
- ✅ Rejection reason logged when threshold not met
- ❌ No evidence that 85 would be accepted with threshold 96

**Recommendation:** Run a new generation to verify current behavior matches code.

---

## 2. AC Scope Population

### Where targetAssessmentCriteria is Set

**Answer: NOWHERE**

### Evidence

**Complete codebase search results:**
```bash
grep -r "targetAssessmentCriteria\s*=" quiz-app/src/
# Result: NO MATCHES
```

**Files that reference targetAssessmentCriteria:**
1. `quiz-app/src/lib/generation/types.ts:109` - Interface definition (field added but never populated)
2. `quiz-app/src/lib/generation/phases/Phase10_Score.ts:239-243` - READ ONLY (checks if present)

### Exact Code That READS It (Phase10_Score.ts:239-244)

```typescript
// Determine which ACs to check
const targetACs = lesson.targetAssessmentCriteria 
  || (syllabusContext ? syllabusContext.assessmentCriteria : []);

const acScopeNote = lesson.targetAssessmentCriteria 
  ? `\nNOTE: This lesson is scoped to cover only the following Assessment Criteria:\n${lesson.targetAssessmentCriteria.map((ac, i) => `  ${i + 1}. ${ac}`).join('\n')}\n\nDo NOT penalize the lesson for not covering other ACs from this Learning Outcome.`
  : '';
```

### System Prompt Uses It (Phase10_Score.ts:254)

```typescript
This lesson must align with the TARGET Assessment Criteria listed ${lesson.targetAssessmentCriteria ? 'above' : '(all ACs from the LO)'}.
```

### Scoring Instructions Reference It (Phase10_Score.ts:290-292)

```typescript
D) Alignment to LO/AC (15 points):
   - Content addresses the TARGET Assessment Criteria for this lesson
   - If lesson.targetAssessmentCriteria is specified, check only those ACs
   - If not specified, check all ACs from the syllabus context
   - DO NOT penalize for missing ACs outside the lesson's target scope
```

### Current Behavior

**Since targetAssessmentCriteria is NEVER set:**

1. Line 239-240 always takes the fallback path:
   ```typescript
   const targetACs = undefined || syllabusContext.assessmentCriteria;
   // Result: targetACs = ALL ACs from the Learning Outcome
   ```

2. Line 242-244: `acScopeNote` is always empty string (else branch)

3. Line 254: Prompt says "(all ACs from the LO)" because condition is false

4. **Phase10 is scoring against ALL LO ACs**, not just the ones this lesson covers

### Impact

**Example scenario (Unit 202, LO5):**
- LO5 has ACs: 5.1, 5.2, 5.3, 5.4, 5.5
- Lesson "202-5A-magnetism-basics" only teaches 5.1 and 5.2
- **Current behavior:** Scorer penalizes for missing 5.3, 5.4, 5.5
- **Log evidence (from @Answers 2.md:139):**
  ```
  alignmentToLO: The lesson completely ignores AC 5.3, 5.4, and 5.5...: 0/15
  Suggestion: Alignment gap: Fails to address magnetic effects of currents, AC generation...
  ```

### Where It SHOULD Be Set

**Option A: Phase1_Planning** (recommended)
```typescript
// Phase1_Planning.ts output should include:
export interface PlanningOutput {
  // ... existing fields
  targetAssessmentCriteria: string[];  // e.g., ["AC 5.1", "AC 5.2"]
}

// Then in Phase9_Assembler:
lesson.targetAssessmentCriteria = planResult.targetAssessmentCriteria;
```

**Option B: Parse from additionalInstructions**
```typescript
// In SequentialLessonGenerator before Phase10:
if (request.additionalInstructions?.includes('only AC')) {
  lesson.targetAssessmentCriteria = extractACScope(request.additionalInstructions);
}
```

**Option C: Infer from mustHaveTopics**
```typescript
// In Phase1 or before Phase10:
lesson.targetAssessmentCriteria = inferACsFromTopics(
  lesson.mustHaveTopics,
  syllabusContext
);
```

### Summary Status

| Aspect | Status | Evidence |
|--------|--------|----------|
| Field defined in interface | ✅ | types.ts:109 |
| Field populated during generation | ❌ | No code sets it |
| Scorer checks for field | ✅ | Phase10_Score.ts:239 |
| Scorer defaults to ALL ACs | ✅ | Phase10_Score.ts:240 |
| Unfair penalties occurring | ✅ | Logs show AC scope issues |
| Population logic exists | ❌ | Not implemented |

**Conclusion:** The infrastructure is ready (field exists, scorer respects it), but NO CODE populates it during lesson generation. Every lesson is scored against ALL ACs from the matched Learning Outcome, causing unfair penalties when lessons are scoped to cover only a subset of ACs.

---

## Recommendations

### 1. Phase13 Threshold Verification
- Run a new generation that triggers refinement
- Verify terminal output matches code logic
- Confirm scores < 96 are rejected
- Check if old logs were from different code version

### 2. AC Scope Population (CRITICAL)
**Immediate action needed:**

Add AC scope population in Phase1_Planning:

```typescript
// Phase1_Planning.ts - Add to PlanningOutput
export interface PlanningOutput {
  teachingStructure: TeachingStructure[];
  taskMode: 'explain' | 'demonstrate' | 'purpose';
  targetAssessmentCriteria: string[];  // ← ADD THIS
}

// In buildUserPrompt or system prompt:
"Identify which Assessment Criteria from the syllabus this lesson will cover based on mustHaveTopics and scope."

// In Phase9_Assembler when building final lesson:
lesson.targetAssessmentCriteria = planResult.targetAssessmentCriteria;
```

**Alternative quick fix:**
Infer from mustHaveTopics before Phase10 scoring:
```typescript
// SequentialLessonGenerator.ts:290 (before scoring)
if (!lesson.targetAssessmentCriteria && syllabusContext) {
  lesson.targetAssessmentCriteria = inferACScope(
    lesson.mustHaveTopics,
    syllabusContext
  );
}
```

### 3. Validation
After implementing AC scope:
- Test with lesson covering partial ACs
- Verify scorer doesn't penalize excluded ACs
- Check prompt includes scope note
- Confirm alignment scores improve
