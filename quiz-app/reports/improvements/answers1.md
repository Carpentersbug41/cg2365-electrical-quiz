# Phase 10 v3 — Dev Clarifications (Q+A) — Answers

## Q1) Should we keep the patch pipeline (Phase11/12) or output full JSON?

**Answer:** Full JSON. v3 = Scorer (read-only) → Refiner (outputs **complete improved lesson JSON**) → deterministic validators → rescore. Patches are creating noise, typos, stale pointers, and corrupt candidates.

**Current State:**
- Phase 11 (`Phase11_Suggest.ts`) generates JSON Pointer patches (`PatchOperation[]`)
- Phase 12 (`Phase12_Implement.ts`) applies patches sequentially via `applyPatch()`
- Known issues: path invalidation after mutations, stale pointers, corruption

**Action Required:**
- Remove/disable Phase11_Suggest + Phase12_Implement from the default pipeline
- Add Phase12_RefineFullJson (single LLM call) that outputs a full `Lesson` JSON
- Refiner should receive: original lesson JSON + Phase10 score/issues + structure signature
- Refiner should output: complete improved lesson JSON (same structure, improved content)

**Files to Modify:**
- `quiz-app/src/lib/generation/SequentialLessonGenerator.ts` (lines 964-1039) — replace Phase11/12 with Phase12_RefineFullJson
- Create new `quiz-app/src/lib/generation/phases/Phase12_RefineFullJson.ts`
- Update `quiz-app/src/lib/generation/config.ts` to disable patch pipeline

---

## Q2) Why did we see "TRUNCATION DETECTED: missing blocks" during Phase 3?

**Answer:** Because Phase3_Explanation outputs `{ explanations: [...] }` but the call is tagged as `Type: lesson`, so truncation/validators expect `blocks`. It's a false positive caused by wrong "type".

**Current State:**
- Phase3 call in `SequentialLessonGenerator.ts` line 585 uses `'lesson'` type:
  ```typescript
  const response = await this.generateWithRetry(
    prompts.systemPrompt,
    prompts.userPrompt,
    'lesson',  // ❌ WRONG TYPE
    2,
    false,
    8000
  );
  ```
- Phase3 output format is `{ explanations: ExplanationBlock[] }` (no `blocks` field)
- Truncation detector checks for `"blocks"` when `type === 'lesson'` (see `truncationDetector.ts` line 248)

**Action Required:**
- Set Phase3 calls to `Type: phase` (or a dedicated `Type: explanation`)
- Make truncation detection **type-aware**:
  - `lesson` must contain `blocks`
  - `score` must contain `total/breakdown/issues`
  - `phase` must match its phase schema (e.g., `explanations`, `terms`, etc.)

**Files to Modify:**
- `quiz-app/src/lib/generation/SequentialLessonGenerator.ts` line 585 — change `'lesson'` to `'phase'`
- `quiz-app/src/lib/generation/truncationDetector.ts` — add type-aware validation logic

---

## Q3) Why is the lesson ID showing as `202-202-5A`?

**Answer:** ID concatenation is happening twice. This will break mapping, retrieval, and file paths.

**Current State:**
- `generateLessonId()` in `utils.ts` line 115: `return \`${unit}-${lessonId}\`;`
- Multiple places concatenate IDs manually:
  - `SequentialLessonGenerator.ts` line 571: `lessonId: \`${request.unit}-${request.lessonId}\``
  - `Phase1_Planning.ts` line 69: `const fullLessonId = \`${request.unit}-${request.lessonId}\`;`
  - `fileIntegrator.ts` line 255: `const fullLessonId = generateLessonId(request.unit, request.lessonId);`

**Root Cause:**
- If `request.lessonId` already contains the unit prefix (e.g., `"202-5A"`), then `generateLessonId(202, "202-5A")` produces `"202-202-5A"`

**Action Required:**
- Normalize lesson id generation to exactly `UNIT-CODE` once (e.g., `202-5A`)
- Add a guard: if `id` already starts with `202-`, don't prefix again
- Ensure all ID generation goes through `generateLessonId()` helper with normalization

**Files to Modify:**
- `quiz-app/src/lib/generation/utils.ts` — add normalization guard in `generateLessonId()`
- Audit all manual concatenations and replace with `generateLessonId()` calls

---

## Q4) Why did Phase 10 penalize "missing AC 5.3/5.4/5.5" when Phase1 said to exclude them?

**Answer:** Scope mismatch. The scorer is judging against the whole LO instead of the **AC subset** declared for the lesson.

**Current State:**
- Phase10 retrieves full LO context via RAG (`syllabusRAG.ts`)
- Phase10 scoring prompt (line 279) says: "All ACs are covered in the lesson"
- Phase1 Planning may declare a subset of ACs (e.g., only AC 5.1, 5.2)
- Phase10 doesn't know which ACs are "in scope" for this specific lesson

**Action Required:**
- Add `structureSignature.assessmentCriteriaInScope` (or similar) to lesson metadata
- Pass that into scoring and force Phase10 to score alignment ONLY against that list
- If AC subset is missing, fallback to full LO (but log it loudly)

**Files to Modify:**
- `quiz-app/src/lib/generation/phases/Phase1_Planning.ts` — capture AC subset in planning output
- `quiz-app/src/lib/generation/phases/Phase10_Score.ts` — use AC subset for alignment scoring
- `quiz-app/src/lib/generation/types.ts` — add `assessmentCriteriaInScope` to lesson structure

---

## Q5) Why does Phase 10 run twice before any refinement?

**Answer:** The pipeline re-scores immediately when entering refinement, wasting calls and causing score drift.

**Current State:**
- `SequentialLessonGenerator.ts` line 319: checks `initialScore.total < threshold`
- Line 327: calls `runPhase10()` which calls `scorer.scoreLesson()` again (line 976)
- This means Phase10 runs:
  1. First time: Initial scoring (line ~310, before refinement check)
  2. Second time: Inside `runPhase10()` pipeline (line 976)

**Action Required:**
- Reuse the initial Phase10 score when deciding to refine
- Only rescore after a candidate lesson exists
- Pass `initialScore` into `runPhase10()` and skip the first Phase10 call if score already exists

**Files to Modify:**
- `quiz-app/src/lib/generation/SequentialLessonGenerator.ts` — modify `runPhase10()` to accept optional existing score
- Skip Phase10 scoring if score already provided, only run Phase11-13

---

## Q6) What caused `candidate.blocks` to be undefined and crash validators?

**Answer:** Candidate is getting corrupted. Most likely `applyPatch()` returns a leaf value (string/array) and the caller assigns it to `candidateLesson`, overwriting the root lesson object.

**Current State:**
- `Phase12_Implement.ts` line 253-297: `applyPatch()` method
- Line 282-291: Operations mutate `obj[key]` and return `obj` (the parent object, not root)
- Line 184: `candidateLesson = this.applyPatch(candidateLesson, patch);`
- Problem: If `applyPatch()` returns a mutated parent object instead of root, assignment overwrites `candidateLesson`

**Root Cause Analysis:**
- `applyReplaceSubstring()` line 332: `return obj;` (returns parent, not root)
- `applyAppend()` line 349: `return obj;` (returns parent, not root)
- `applyPrepend()` line 366: `return obj;` (returns parent, not root)
- `applyReplace()` line 376: `return obj;` (returns parent, not root)
- BUT: These operations mutate `obj[key]` in place, so the root should still be valid
- **Actual issue**: If `applyPatch()` navigates incorrectly or returns wrong reference, root gets overwritten

**Action Required:**
- In validators: log defensively (`candidate?.blocks?.length ?? 'MISSING'`) so logs don't crash
- If patching remains anywhere: ensure patch functions either mutate in place and return the root, or always return a full root clone
- **Preferred**: Delete patching from v3 (see Q1)

**Files to Modify:**
- `quiz-app/src/lib/generation/phases/Phase10_Validators.ts` — add defensive null checks
- `quiz-app/src/lib/generation/phases/Phase12_Implement.ts` — ensure `applyPatch()` always returns root lesson object
- **Better**: Remove Phase12 entirely per Q1

---

## Q7) Where should `additionalInstructions` be injected?

**Answer:** As separate conversation history messages before the task, not stuffed into the system prompt. Same injection pattern for scorer and refiner for consistency.

**Current State:**
- `Phase10_Score.ts` line 331-360: `buildUserPrompt()` includes `additionalInstructions` directly in user prompt
- `llmScoringService.ts` line 371-374: Adds `additionalInstructions` as text in user prompt
- No separate message injection pattern

**Action Required:**
- Implement message injection exactly:
  - system: stable scorer/refiner system prompt
  - user: `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions}` (optional)
  - assistant: `Acknowledged... only if compatible with invariants/rubric.`
  - user: main task + payload
- Add sanitiser:
  - cap length (1–2k chars)
  - strip requests that try to change structure/invariants

**Files to Modify:**
- `quiz-app/src/lib/generation/phases/Phase10_Score.ts` — implement message injection pattern
- `quiz-app/src/lib/generation/phases/Phase12_RefineFullJson.ts` (new) — same pattern for refiner
- `quiz-app/src/lib/generation/utils.ts` — add `sanitizeAdditionalInstructions()` helper

---

## Summary: Minimal v3 Pipeline (What We Want to Implement)

### Flow
1) Deterministic validate input lesson JSON + structure signature  
2) Scorer LLM (read-only) → score + 10 issues  
3) If score >= threshold → ship  
4) Else Refiner LLM → outputs **full improved lesson JSON** (structure unchanged)  
5) Deterministic validate invariants + corruption checks  
6) Scorer LLM again → accept if >= threshold AND >= original

### Action Tasks
- Replace Phase11/12 with a single "RefinerFullJson" step
- Ensure both scorer+refiner use the same `additionalInstructions` injection
- Ensure scoring uses the AC subset "in scope"

---

## Quick Checklist for Bug Fixes (Fix Order)

1) Fix Phase3 `Type: lesson` → `Type: phase`
2) Fix double-prefix lesson id `202-202-5A` → `202-5A`
3) Stop Phase10 running twice before refinement
4) Implement AC-subset scoring (avoid penalising excluded ACs)
5) Remove patch flow and implement full JSON refiner
6) Harden validator logging (no crashes on undefined)
