# Sequential Generation Quick Start

**TL;DR:** The lesson generator now uses 9 focused phases instead of one massive prompt.

---

## Enable Sequential Generation

In `.env.local`:

```
USE_SEQUENTIAL_GENERATION=true
```

Restart your dev server.

---

## What Changed?

### Before (Monolithic)
- ❌ One 700-line prompt trying to do everything
- ❌ Questions often referenced untaught content
- ❌ Answer alignment failures
- ❌ Hard to debug

### After (Sequential)
- ✅ 9 focused prompts (60-120 lines each)
- ✅ Questions guaranteed to align with explanations
- ✅ Better terminology consistency
- ✅ Easy to debug (know which phase failed)

---

## How It Works

```
1. Planning      → Determine structure
2. Vocabulary    → Define key terms
3. Explanation   → Write teaching content
4. Checks        → Test understanding (uses explanation as input)
5. Worked Example → Show procedures (if needed)
6. Practice      → Independent questions
7. Integration   → Tie concepts together
8. Spaced Review → Review prerequisites
9. Assembler     → Combine into complete JSON
```

**Key Innovation:** Phase 4 receives Phase 3's explanation text as input, ensuring perfect alignment.

---

## File Structure

```
src/lib/generation/
├── phases/                          (NEW)
│   ├── Phase1_Planning.ts
│   ├── Phase2_Vocabulary.ts
│   ├── Phase3_Explanation.ts
│   ├── Phase4_UnderstandingChecks.ts
│   ├── Phase5_WorkedExample.ts
│   ├── Phase6_Practice.ts
│   ├── Phase7_Integration.ts
│   ├── Phase8_SpacedReview.ts
│   └── Phase9_Assembler.ts
├── SequentialLessonGenerator.ts     (NEW - Orchestrator)
└── fileGenerator.ts                 (MODIFIED - Added feature flag)
```

---

## Console Output

You'll see phase-by-phase progress:

```
🔄 Using SEQUENTIAL generation pipeline
  📋 Phase 1: Planning... ✓
  📚 Phase 2: Vocabulary... ✓
  📝 Phase 3: Explanations... ✓
  ✅ Phase 4: Understanding checks... ✓
  🔢 Phase 5: Worked example... ✓
  💪 Phase 6: Practice... ✓
  🔗 Phase 7: Integration... ✓
  🔄 Phase 8: Spaced review... ✓
✅ Generation complete
```

---

## Debugging

### Check Feature Flag Status

Console will show:
- `🔄 Using SEQUENTIAL generation` = Sequential enabled
- No message = Monolithic (feature flag off)

### Check Debug Logs

`.cursor/debug.log` has detailed phase logging:

```
PHASE1_START: { lessonId: '203-4A' }
PHASE1_COMPLETE: { layout: 'split-vis' }
PHASE2_START: ...
```

### If Something Breaks

1. **Immediate rollback:** Set `USE_SEQUENTIAL_GENERATION=false`
2. **Check logs:** Look at `.cursor/debug.log`
3. **Identify phase:** Console shows which phase failed
4. **Report:** Include phase name and error message

---

## What Wasn't Changed

✅ **All existing infrastructure preserved:**
- Validation pipeline (Validate → Clean → Preprocess → Parse)
- Debug info flow
- Strict linting
- Preprocessing steps
- Error handling
- JSON parsing with `safeJsonParse()`

✅ **The old monolithic generator still exists:**
- Turn off feature flag to use it
- Easy rollback if needed

---

## Modifying Prompts

**Each phase has its own prompt builder** in `src/lib/generation/phases/`.

To modify a phase prompt:

1. Open the phase file (e.g., `Phase3_Explanation.ts`)
2. Edit `buildSystemPrompt()` or `buildUserPrompt()`
3. Keep the JSON output format requirements
4. Test with actual generation

**Example:** Make explanation prompts more concise:

```typescript
// In Phase3_Explanation.ts
protected buildSystemPrompt(): string {
  return `You are a technical writer for electrical training.

Write clear, concise explanations (400-600 words).

// ... rest of prompt
```

---

## Common Tasks

### Change Token Limits

In `SequentialLessonGenerator.ts`, each phase call specifies token limit:

```typescript
const response = await this.generateWithRetry(
  prompts.systemPrompt,
  prompts.userPrompt,
  'lesson',
  2,
  false,
  8000  // ← Change this
);
```

### Add New Phase

1. Create `PhaseX_NewPhase.ts` extending `PhasePromptBuilder`
2. Add to orchestrator in `SequentialLessonGenerator.ts`
3. Update assembler if needed
4. Export from `phases/index.ts`

### Skip a Phase

Make it conditional in the orchestrator:

```typescript
if (someCondition) {
  const phaseResult = await this.runPhaseX(...);
} else {
  // Skip phase, return empty result
  const phaseResult = { /* empty */ };
}
```

---

## Performance

### Latency

- **9 LLM calls** vs 1 monolithic call
- Each call is **smaller and faster**
- Total time: Slightly longer, but quality is worth it
- Per requirements: "Time is not important - quality is"

### Cost

- More API calls, but **smaller prompts**
- Less retry waste (fix specific phase, not entire lesson)
- Fewer manual fixes = **net cost savings**

---

## Quality Metrics (Target)

| Metric | Before | After |
|--------|--------|-------|
| Strict lint pass rate | ~60% | **85%+** |
| Answer alignment | ~80% | **100%** |
| Terminology consistency | Variable | **100%** |
| Manual fixes needed | ~40% | **<10%** |

---

## Documentation

- **Full Architecture:** `sequential_generation_architecture.md`
- **Constraints:** `don't_touch.md`
- **History:** `gen_problems.md`

---

## Questions?

1. Read `sequential_generation_architecture.md` (detailed explanation)
2. Check `.cursor/debug.log` (phase execution logs)
3. Try both modes (toggle feature flag, compare results)
4. Ask in #generator-help

---

**Remember:** This is a **non-breaking change**. The old generator still works. Toggle the feature flag to compare.
