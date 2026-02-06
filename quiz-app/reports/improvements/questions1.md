# Phase 10 Implementation Q&A

## Output typing / truncation

### Q: Why are Phase 10 patch/scoring calls logged as `Type: lesson`? Where is that type set?

**A:** Phase 10 patch/scoring calls show different types depending on the call:

1. **Patch generation call** (line 835 in `SequentialLessonGenerator.ts`):
   ```typescript
   const response = await this.generateWithRetry(
     prompts.systemPrompt,
     prompts.userPrompt,
     'phase',  // ← Correctly set to 'phase'
     2,
     false,
     8000
   );
   ```
   This is logged as `Type: phase`

2. **Scoring calls** (line 199 in `llmScoringService.ts`):
   ```typescript
   const response = await this.generateWithRetry(
     systemPrompt,
     userPrompt,
     'lesson',  // ← Set to 'lesson'
     2,
     false,
     scoringConfig.maxTokens
   );
   ```
   This is logged as `Type: lesson`

**Why scoring uses 'lesson':**
- The scoring service calls `generateWithRetry` with type `'lesson'` because it's scoring a complete lesson JSON structure
- This type is hardcoded in `llmScoringService.ts` at line 202
- The patch isolation scorer (which scores lessons multiple times) inherits this 'lesson' type through its calls to `scorer.scoreLesson()`

### Q: Does the truncation detector check for blocks whenever `type === "lesson"`? If yes, why is it applied to patch/scoring outputs?

**A:** Yes, but it depends on the call:

1. **For `type === 'lesson'`** (line 249 in `truncationDetector.ts`):
   ```typescript
   if (type === 'lesson' && !trimmed.includes('"blocks"')) {
     issues.push('Complete lesson JSON missing "blocks" property');
   }
   ```
   - Checks that response includes `"blocks"` property
   - Also checks that blocks array is properly closed (line 265)

2. **For `type === 'phase'`** (line 251-254):
   - Explicitly DOES NOT check for blocks (this is expected for phase responses)
   - Logs info message but doesn't add to issues

**Why this matters for scoring:**
- Scoring calls use `type: 'lesson'` and expect a scoring rubric JSON, NOT a lesson JSON
- The truncation detector incorrectly checks for `"blocks"` in scoring responses
- **This is a bug**: Scoring responses don't have blocks, so this check is wrong
- The check probably never fires because scoring responses don't typically truncate (much smaller token budgets)

### Q: When "TRUNCATION DETECTED" fires, what code path happens next (retry, fallback parse, discard, partial apply)?

**A:** The flow is in `fileGenerator.ts` lines 978-986:

```typescript
// If high-confidence truncation detected, throw error to trigger retry
if (truncationCheck.isTruncated && !isResponseSafeToParse(truncationCheck)) {
  throw new Error(
    `TRUNCATED_RESPONSE: ${truncationCheck.reasons.join('; ')} (confidence: ${truncationCheck.confidence})`
  );
}

// Response looks good, return it
return cleanedText;
```

**Decision logic:**
1. If `confidence === 'high'`: **Throw error → Retry** (not safe to parse)
2. If `confidence === 'medium'` AND `reasons.length >= 2`: **Throw error → Retry** (not safe to parse)
3. Otherwise: **Attempt parsing** (low confidence or single medium reason)

**Retry behavior:**
- The error is caught in the retry loop (line 987-1027)
- If retries remain: tries again
- If no retries left: throws final error → entire generation fails
- No fallback parse, no partial apply - it's all-or-nothing

---

## Patch semantics

### Q: When a suggestion says "Change blocks[3].content.content …", do we intend whole-field replace or substring replace?

**A:** **Whole-field replace** is intended.

From `Phase10_Refinement.ts` lines 317-328:

```typescript
const oldValue = this.getValueAtPath(cloned, patch.path);
let finalValue = patch.value;

// Handle prepend/append operations for string values
if (patch.op === 'prepend' && typeof oldValue === 'string') {
  finalValue = patch.value + oldValue;
} else if (patch.op === 'append' && typeof oldValue === 'string') {
  finalValue = oldValue + patch.value;
}
// For 'replace' operation or non-string values, just use value as-is

this.setValueAtPath(cloned, patch.path, finalValue);
```

**Three operations:**
1. `op: 'replace'`: Entire field value is replaced
2. `op: 'prepend'`: Value is prepended to existing string
3. `op: 'append'`: Value is appended to existing string

**No substring/find-replace operation exists.**

### Q: Do we currently have any safe "replace within string" operation? If not, can we add it?

**A:** **No, we don't have this operation.**

**Current state:**
- Only operations: `replace`, `prepend`, `append`
- All are whole-field operations (no substring manipulation)

**Adding it would require:**
1. New operation: `op: 'replaceSubstring'`
2. Additional fields:
   ```typescript
   {
     op: 'replaceSubstring',
     path: 'blocks[3].content.content',
     find: 'old text',      // What to find
     value: 'new text',     // What to replace it with
     matchIndex?: number,   // Optional: which match (default: all)
   }
   ```
3. Implementation in `applyPatches()` and `patchIsolationScorer.ts:applyPatch()`
4. Update system prompt to explain this operation
5. Validation logic in `patchValidator.ts`

**Complexity considerations:**
- What if find string appears multiple times? (need matchIndex or replaceAll flag)
- What if find string not found? (fail silently? error?)
- Escaping/special characters?
- This might make the LLM's job harder (more decisions to make)

### Q: If two patches hit the same path (blocks[3].content.content appears twice), how do we resolve order/override?

**A:** **Sequential application - last patch wins** (for `replace` operations).

From `Phase10_Refinement.ts` lines 314-340:

```typescript
for (const patch of patches) {
  try {
    const oldValue = this.getValueAtPath(cloned, patch.path);
    let finalValue = patch.value;
    
    // ... apply the patch ...
    
    this.setValueAtPath(cloned, patch.path, finalValue);
  } catch (e) {
    console.warn(`   ✗ FAILED at ${patch.path}:`, e);
  }
}
```

**Behavior by operation type:**
- **Two `replace` operations:** Second completely overwrites first (last wins)
- **Two `prepend` operations:** Both are applied (first patch's value is further left)
- **Two `append` operations:** Both are applied (first patch's value is further left)
- **Mixed operations:** Order matters:
  - `replace` then `append`: append adds to the replaced value
  - `append` then `replace`: replace wipes out the append
  - `prepend` then `replace`: replace wipes out the prepend

**No deduplication or conflict detection:**
- Patches are NOT checked for path collisions
- Validation only checks individual patch validity, not interactions
- This could cause unexpected behavior if LLM generates duplicate paths

**Potential improvements:**
1. Detect duplicate paths during validation
2. Merge compatible operations (multiple appends → single append)
3. Warn/reject conflicting operations (append followed by replace)

---

## Safety gates

### Q: After patch apply, do we validate that required Phase 3 headings still exist in each explanation? If not, can we add a hard gate?

**A:** **No, we don't validate Phase 3 headings after patching.**

**Current validation** (lines 380-415 in `Phase10_Refinement.ts`):
```typescript
validatePatches(original: Lesson, patched: Lesson): boolean {
  // 1. Must have same basic structure
  if (!patched.id || !patched.title || !patched.blocks) {
    return false;
  }
  
  // 2. Block count should be unchanged
  if (original.blocks.length !== patched.blocks.length) {
    return false;
  }
  
  // 3. Block types validation - allow changes if new type is valid
  // [validates block types]
  
  return true;
}
```

**What's NOT validated:**
- Phase 3 heading structure (`### What is X?`, `### Why it Matters`, etc.)
- Question count/structure in practice blocks
- expectedAnswer variant counts
- Learning outcome alignment
- Any semantic content requirements

**To add heading validation:**
1. Parse explanation blocks' `content.content` field
2. Check for required headings based on `generation_prompts.md` Phase 3 rules
3. Add to `validatePatches()`:
   ```typescript
   // 4. Validate explanation structure
   for (const block of patched.blocks) {
     if (block.type === 'explanation') {
       const content = block.content.content;
       const requiredHeadings = [
         '### What is', 
         '### Why it Matters',
         '### How it Works',
         '### In Practice'
       ];
       for (const heading of requiredHeadings) {
         if (!content.includes(heading)) {
           console.warn(`[Refinement] Missing required heading: ${heading}`);
           return false;
         }
       }
     }
   }
   ```

**Considerations:**
- Should this be a hard gate (reject patches) or soft warning?
- What if patch is fixing something more important than headings?
- Could make Phase 10 overly restrictive

### Q: Are we validating expectedAnswer variant counts (2–4 etc.) after patching?

**A:** **No, variant counts are NOT validated after patching.**

**Current validation** (lines 233-238 in `Phase10_Refinement.ts`):
```typescript
// Validate expectedAnswer is array
if (llmPatch.path.endsWith('.expectedAnswer')) {
  if (!Array.isArray(llmPatch.value)) {
    console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} value must be an array`);
    return; // Skip this patch
  }
}
```

**What IS validated:**
- expectedAnswer must be an array (not a string)

**What is NOT validated:**
- Array length (must have 2-4 variants for L2 questions)
- Array contents (non-empty strings)
- Appropriateness of variants

**To add variant count validation:**
```typescript
// Validate expectedAnswer variant counts
if (llmPatch.path.endsWith('.expectedAnswer')) {
  if (!Array.isArray(llmPatch.value)) {
    console.warn(`   ⊘ Rejecting patch: ${llmPatch.path} must be array`);
    return;
  }
  
  // Check variant count for L2 questions
  if (llmPatch.path.includes('-L2')) {
    if (llmPatch.value.length < 2 || llmPatch.value.length > 4) {
      console.warn(`   ⊘ Rejecting patch: L2 expectedAnswer must have 2-4 variants, got ${llmPatch.value.length}`);
      return;
    }
  }
  
  // Check no empty variants
  if (llmPatch.value.some((v: any) => !v || typeof v !== 'string')) {
    console.warn(`   ⊘ Rejecting patch: expectedAnswer contains invalid variant`);
    return;
  }
}
```

**Location:** Add to `convertLLMPatches()` in `Phase10_Refinement.ts` around line 233

---

## Data actually being rescored

### Q: When rescoring, are we rescoring the in-memory patched lesson or a re-parsed model output?

**A:** **In-memory patched lesson** (not re-parsed).

From `SequentialLessonGenerator.ts` lines 897-916:

```typescript
// Apply accepted patches
const refinedLesson = this.phase10.applyPatches(lesson, acceptedPatches);

// Validate refined lesson structure
if (!this.phase10.validatePatches(lesson, refinedLesson)) {
  console.log('    ❌ Validation failed, keeping original');
  return null;
}

// Run patch isolation scoring (sequential + independent)
const patchesWithIsolation = await isolatePatches(lesson, acceptedPatches, this.scorer);

// Re-score refined lesson
console.log(`\n📊 [Re-scoring] Scoring refined lesson...`);
const refinedScore = await this.scorer.scoreLesson(refinedLesson);
```

**Flow:**
1. Parse LLM patch JSON response → get patch objects
2. Apply patches to in-memory lesson object → `refinedLesson`
3. Score `refinedLesson` (the in-memory object)
4. Never re-serialize → parse → re-score

**This is correct because:**
- Patches are already validated/parsed
- No need to round-trip through JSON
- Faster and more reliable

### Q: Are we passing the full lesson to the scorer, or only excerpts? (Excerpt scoring can mis-evaluate template compliance.)

**A:** **Full lesson** is passed to the scorer.

From `llmScoringService.ts` line 193:

```typescript
private async scoreLessonWithLLM(lesson: Lesson): Promise<RubricScore> {
  const systemPrompt = this.buildScoringSystemPrompt();
  const userPrompt = this.buildScoringUserPrompt(lesson);  // ← Builds prompt from full lesson
  // ...
}
```

And line 443:

```typescript
private buildScoringUserPrompt(lesson: Lesson): string {
  const lessonJson = JSON.stringify(lesson, null, 2);  // ← Full lesson serialized
  
  return `Score this lesson using the rubric:

${lessonJson}

Return scoring JSON with rubric sections, issues, and surgical patch suggestions.`;
}
```

**Scoring receives:**
- Complete lesson JSON (all blocks, all fields)
- Full learning outcomes
- Complete vocab, diagrams, questions, etc.

**However:**
- For large lessons, token limits could truncate the prompt
- Scorer sees full lesson but may not have attention over all parts
- Phase 10 patch prompts DO use excerpts (line 578-619 in `Phase10_Refinement.ts`)

**Patch generation sees excerpts:**
```typescript
LESSON JSON EXCERPT (relevant sections):
${this.extractRelevantSections(lesson, issues)}
```

This shows:
- Learning outcomes
- Block summary (types and order)
- First 500 chars of practice blocks mentioned in issues

**Potential issue:**
- Scorer sees full lesson (correct evaluation)
- Patch generator sees excerpts (may miss context)
- This asymmetry could cause patches that don't fully address scorer's concerns

---

## Summary of Findings

### Bugs identified:
1. **Scoring truncation check bug**: Scoring calls use `type: 'lesson'` which incorrectly triggers blocks array check
2. **No heading validation**: Phase 3 heading requirements not enforced after patching
3. **No variant count validation**: expectedAnswer variant counts (2-4) not checked
4. **No duplicate path detection**: Two patches can hit same path with no warning

### Missing features:
1. **No substring replace**: Only whole-field operations available
2. **Limited patch validation**: Only basic structural checks
3. **Asymmetric context**: Scorer sees full lesson, patch generator sees excerpts

### Working correctly:
1. **Patch application**: Sequential, deterministic, logged
2. **Isolation scoring**: Both sequential and independent isolation work
3. **Type differentiation**: Patch calls use 'phase', scoring uses 'lesson'
4. **Truncation retry**: High-confidence truncation triggers retry
