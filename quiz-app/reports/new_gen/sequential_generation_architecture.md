# Sequential Lesson Generation Architecture

**Date:** February 4, 2026  
**Status:** ✅ Implemented (Feature Flag: `USE_SEQUENTIAL_GENERATION`)  
**Purpose:** Replace monolithic 700-line prompt with 9 focused phases for higher quality lessons

---

## Problem Statement

The original `lessonPromptBuilder.ts` contained a **700-line monolithic prompt** trying to handle:
- Teaching pedagogy rules
- Block structure templates (10+ types)
- Cognitive level theory
- Answer formatting rules
- Self-audit checklists
- JSON schema validation

**Result:** No model can effectively handle all these concerns simultaneously. This led to:
- ❌ Questions referencing untaught concepts
- ❌ Answer alignment failures (expectedAnswer not in explanation)
- ❌ Inconsistent terminology
- ❌ Hard to debug (which part failed?)
- ❌ Lower strict lint pass rate (~60%)

---

## Solution: Sequential Pipeline

Break the monolithic prompt into **9 specialized phases**, each with a single responsibility:

```
Request → Phase 1 (Planning)
       → Phase 2 (Vocabulary)
       → Phase 3 (Explanation)
       → Phase 4 (Understanding Checks)
       → Phase 5 (Worked Example)
       → Phase 6 (Practice)
       → Phase 7 (Integration)
       → Phase 8 (Spaced Review)
       → Phase 9 (Assembler)
       → Complete Lesson JSON
```

Each phase:
- Has focused prompt (60-120 lines vs 700)
- Returns structured JSON
- Validates its own output
- Passes validated data to next phase

---

## Architecture

### File Structure

```
src/lib/generation/
├── phases/
│   ├── PhasePromptBuilder.ts          (Base class, shared utilities)
│   ├── Phase1_Planning.ts             (Lesson structure planning)
│   ├── Phase2_Vocabulary.ts           (Essential terms)
│   ├── Phase3_Explanation.ts          (Teaching content)
│   ├── Phase4_UnderstandingChecks.ts  (Formative assessment)
│   ├── Phase5_WorkedExample.ts        (Calculations/procedures)
│   ├── Phase6_Practice.ts             (Independent practice)
│   ├── Phase7_Integration.ts          (Synthesis questions)
│   ├── Phase8_SpacedReview.ts         (Prerequisite review)
│   ├── Phase9_Assembler.ts            (Assembly logic)
│   └── index.ts                       (Exports)
├── SequentialLessonGenerator.ts       (Orchestrator)
└── fileGenerator.ts                   (Feature flag integration)
```

### Phase Descriptions

#### Phase 1: Planning
- **Input:** GenerationRequest
- **Output:** Lesson structure plan (blocks needed, layout, learning outcomes)
- **Token Limit:** 4,000
- **Purpose:** Determine architecture before generating content

#### Phase 2: Vocabulary
- **Input:** Planning output
- **Output:** 4-6 essential technical terms with definitions
- **Token Limit:** 3,000
- **Purpose:** Establish terminology consistency

#### Phase 3: Explanation
- **Input:** Planning + Vocabulary
- **Output:** 1-2 explanation blocks (400-600 words each, 6-part structure)
- **Token Limit:** 8,000
- **Purpose:** Teach core concepts (this is the "source of truth" for all assessments)

#### Phase 4: Understanding Checks
- **Input:** Explanation blocks (full text)
- **Output:** Check blocks with 3 recall + 1 connection question each
- **Token Limit:** 6,000
- **Purpose:** Ensure questions align with taught content (receives explanation as input)

#### Phase 5: Worked Example (Conditional)
- **Input:** Explanations + task type
- **Output:** Worked example + guided practice (if needed)
- **Token Limit:** 6,000
- **Purpose:** Demonstrate calculations/procedures step-by-step

#### Phase 6: Practice
- **Input:** All explanations + vocabulary
- **Output:** 3-5 independent practice questions
- **Token Limit:** 5,000
- **Purpose:** "You Do" - independent application

#### Phase 7: Integration
- **Input:** Planning + all explanations
- **Output:** 2 integrative questions (connection + synthesis)
- **Token Limit:** 5,000
- **Purpose:** "Big picture" - tie all concepts together

#### Phase 8: Spaced Review
- **Input:** Prerequisites + anchors
- **Output:** 4 prerequisite review questions
- **Token Limit:** 4,000
- **Purpose:** Spaced repetition from prior lessons

#### Phase 9: Assembler
- **Input:** All phase outputs
- **Output:** Complete lesson JSON
- **Purpose:** Assembly + validation (not an LLM call)

---

## Key Design Decisions

### 1. Teach-Before-Test Enforcement

Phase 4 (Understanding Checks) explicitly receives Phase 3 (Explanation) output as input:

```typescript
const checksResult = await this.runPhase4(lessonId, explanationResult);
```

This **guarantees** questions can only reference taught content.

### 2. Reuse Existing Infrastructure

**Critical:** We do NOT create new parsing/validation logic. We reuse:
- `generateWithRetry()` for LLM calls
- `preprocessToValidJson()` for cleaning
- `safeJsonParse()` for parsing
- `validateLLMResponse()` for response validation
- `strictLintService` for final validation
- `debugLog()` for all logging

This preserves all the hard-won defensive code from `don't_touch.md`.

### 3. Feature Flag for Rollback

```typescript
const USE_SEQUENTIAL = process.env.USE_SEQUENTIAL_GENERATION === 'true';

if (USE_SEQUENTIAL) {
  return this.generateLessonSequential(request);
}
// Existing monolithic generation (unchanged)
```

**Benefits:**
- Test new pipeline without breaking existing functionality
- Easy rollback if issues arise
- Compare quality between approaches
- Gradual migration path

### 4. No Breaking Changes

**What we DID:**
- ✅ Added new files (phases/*, SequentialLessonGenerator.ts)
- ✅ Added new method (`generateLessonSequential`)
- ✅ Added feature flag check at start of `generateLesson`

**What we DID NOT do:**
- ❌ Remove or modify existing `generateLesson` logic
- ❌ Change validation/preprocessing pipeline
- ❌ Remove any defensive code
- ❌ Modify any existing files except adding imports

---

## Usage

### Enable Sequential Generation

Set environment variable:

```bash
USE_SEQUENTIAL_GENERATION=true
```

Or in `.env.local`:

```
USE_SEQUENTIAL_GENERATION=true
```

### Disable Sequential Generation

Remove the variable or set to `false`:

```bash
USE_SEQUENTIAL_GENERATION=false
```

The system will fall back to the monolithic generation.

---

## Quality Improvements (Expected)

| Metric | Before (Monolithic) | After (Sequential) |
|--------|---------------------|-------------------|
| Strict lint pass rate | ~60% | **Target: 85%+** |
| Answer alignment | ~80% | **Target: 100%** |
| Terminology consistency | Variable | **Target: 100%** |
| Manual fix rate | ~40% | **Target: <10%** |
| Generation success rate | ~85% | **Target: 95%+** |

### Why Sequential is Better

1. **Focused Context:** Each phase has 60-120 lines vs 700 (model can focus)
2. **Explicit Dependencies:** Phase 4 receives Phase 3 output (alignment enforced)
3. **Terminology Lock:** All phases use Phase 2 vocab (consistency enforced)
4. **Debugging:** Know exactly which phase failed
5. **Iterative Refinement:** Can regenerate just Phase 4 if checks are weak

---

## Debugging

### Check Which Generation Path is Used

Look for console output:

```
🔄 Using SEQUENTIAL generation pipeline (feature flag enabled)
```

or

```
[Default monolithic generation - no flag set]
```

### Phase-by-Phase Logging

When sequential generation runs, you'll see:

```
🔄 [Sequential] Starting sequential generation for 203-4A
  📋 Phase 1: Planning lesson structure...
    ✓ Layout: split-vis, Sections: 2
  📚 Phase 2: Generating vocabulary...
    ✓ Generated 5 terms
  📝 Phase 3: Writing explanations...
    ✓ Generated 2 explanation(s)
  ✅ Phase 4: Creating understanding checks...
    ✓ Generated 2 check(s)
  🔢 Phase 5: Worked example...
    ✓ Generated worked example + guided practice
  💪 Phase 6: Practice questions...
    ✓ Generated 4 practice questions
  🔗 Phase 7: Integration questions...
    ✓ Generated 2 integrative questions
  🔄 Phase 8: Spaced review...
    ✓ Generated 4 review questions
✅ [Sequential] Generation complete for 203-4A
```

### Debug Logs

Check `.cursor/debug.log` for detailed phase logging:

```
SEQUENTIAL_GEN_START: { lessonId: '203-4A' }
PHASE1_START: { lessonId: '203-4A' }
PHASE1_COMPLETE: { layout: 'split-vis', explanationSections: 2 }
PHASE2_START: { lessonId: '203-4A' }
...
```

---

## Maintenance

### Adding New Phases

1. Create new phase class extending `PhasePromptBuilder`
2. Add to orchestrator in `SequentialLessonGenerator.ts`
3. Update assembler if needed
4. Export from `phases/index.ts`

### Modifying Phase Prompts

**Safe to modify:**
- Prompt text (keep JSON output requirements)
- Token limits (adjust per phase needs)
- Input/output interfaces (add optional fields)

**DO NOT:**
- Remove validation steps
- Skip preprocessing
- Change parsing pipeline order
- Disable feature flag without testing

### Testing Changes

Before committing phase changes:

1. Generate a simple lesson (2-3 topics, no prerequisites)
2. Generate a complex lesson (5+ topics, worked example)
3. Check debug.log for errors
4. Verify strict lint passes
5. Compare output quality to monolithic

---

## Rollback Procedure

If sequential generation causes issues:

1. **Immediate:** Set `USE_SEQUENTIAL_GENERATION=false`
2. **Verify:** Restart dev server, test generation
3. **Investigate:** Check debug.log for specific phase failures
4. **Fix:** Address failing phase, test in isolation
5. **Re-enable:** After fix verified, re-enable feature flag

---

## Future Enhancements

### Potential Improvements

1. **Parallel Phases:** Run Phase 2 (Vocab) and Phase 3 (Diagram) in parallel
2. **Smart Caching:** Cache Phase 2 vocab across similar lessons
3. **Dynamic Token Allocation:** Adjust per-phase limits based on complexity
4. **Phase Retries:** Retry individual phases instead of entire generation
5. **Quality Scoring:** Score each phase output before assembly

### Deprecation Plan

Once sequential generation is stable (4-6 weeks):

1. Monitor metrics (lint pass rate, manual fix rate)
2. If sequential outperforms monolithic consistently:
   - Remove feature flag
   - Make sequential the default
   - Archive monolithic prompt as reference
   - Update all documentation

---

## Related Files

- **Implementation:** `src/lib/generation/SequentialLessonGenerator.ts`
- **Integration:** `src/lib/generation/fileGenerator.ts` (lines ~335-425)
- **Phases:** `src/lib/generation/phases/*.ts`
- **Constraints:** `reports/bulk_tasks/don't_touch.md`
- **History:** `reports/bulk_tasks/gen_problems.md`

---

## Questions?

**Before modifying sequential generation:**

1. Read this document
2. Read `don't_touch.md` (critical constraints)
3. Check git history for why code exists
4. Test with actual generation before committing

**If something breaks:**

1. Set `USE_SEQUENTIAL_GENERATION=false` (immediate rollback)
2. Check `debug.log` for phase failure details
3. Read `gen_problems.md` for similar issues
4. Fix specific phase, don't remove defensive code

---

**Last Updated:** February 4, 2026  
**Maintained by:** Generation System Team  
**Questions:** See #generator-help or check debug.log
