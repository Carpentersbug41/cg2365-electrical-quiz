# Phases 10-13: Lesson Improvement Contracts (Current Implementation)

Version: 2.1
Last verified against code: 2026-02-17
Scope: `Phase10_Score`, `Phase12_Refine`, `Phase13_Rescore`, and orchestration in `SequentialLessonGenerator`

Note (2026-02-17 sync):
- Module Planner now stops at M5 for planning and uses explicit per-lesson generation actions.
- No change to Phase 10-13 lesson generator contracts documented here.

---

## 1. What This Pipeline Does

Current post-generation quality path is:
1. Phase 10 (`Phase10_Score`) scores pedagogical quality and reports issues.
2. Phase 12 (`Phase12_Refine`) returns a complete refined lesson JSON candidate.
3. Phase 13 (`Phase13_Rescore`) rescoring + accept/reject decision.

This path runs only when initial score is below threshold.

---

## 2. Runtime Trigger Rules

Primary threshold source:
- `src/lib/generation/config.ts`
- `GENERATION_CONFIG.refinement.scoreThreshold = 95`

Activation rule:
- refinement path runs when `initialScore.total < 95`
- if score is `>= 95`, refine path is skipped

Compatibility note:
- generator currently passes `96` as the Phase 13 `threshold` argument, but Phase 13 acceptance is comparison-based and does not require crossing that threshold.

---

## 3. Phase 10 (Pedagogical Scoring)

Code:
- `src/lib/generation/phases/Phase10_Score.ts`

### Inputs
- full lesson JSON
- optional additional instructions
- syllabus context from `retrieveSyllabusContext(...)` when available

### Rubric
- Beginner Clarity: /30
- Teaching-Before-Testing: /25
- Marking Robustness: /20
- Alignment to LO/AC: /15
- Question Quality: /10
- Total: /100

### Issue contract
- `issues` is required
- allowed count is `0-10`
- parser rejects `issues.length > 10`

### Output shape
- `total`
- `grade`
- `syllabus`
- `breakdown`
- `issues[]`
- optional `overallAssessment`

---

## 4. Phase 12 (Full-Lesson Refinement)

Code:
- `src/lib/generation/phases/Phase12_Refine.ts`

Purpose:
- produce complete refined lesson JSON (not patches)
- fix Phase 10 issues
- preserve structure invariants

Hard structural validation checks include:
- block count unchanged
- block ids unchanged
- block types unchanged
- block order values unchanged
- question `answerType` values unchanged

If validation fails, Phase 12 returns failure and the original lesson is kept.

---

## 5. Phase 13 (Rescore and Decision)

Code:
- `src/lib/generation/phases/Phase13_Rescore.ts`

Behavior:
- re-scores candidate by calling `Phase10_Score.scoreLesson(...)`
- compares candidate vs original
- returns accepted/rejected decision + reason + final lesson

Acceptance policy:
- accept if `candidateScore.total > originalScore.total`
- also accept if scores tie and candidate has fewer issues
- otherwise reject candidate and keep original

Important clarification:
- Phase 13 is not LLM-free; it invokes Phase 10 scorer for candidate rescoring.

---

## 6. Orchestration in `SequentialLessonGenerator`

Runtime flow:
1. build lesson (Phases 1-9)
2. normalize schema
3. run Phase 10
4. if below threshold, run Phase 12
5. run Phase 13 compare
6. keep best lesson according to acceptance policy

Returned metadata still uses compatibility naming such as `patchesApplied` (count only).

---

## 7. Legacy vs Active

Active runtime path:
- Phase 10 score
- Phase 12 refine
- Phase 13 rescore/compare

Legacy files still present but not on active runtime path:
- `Phase11_Suggest.ts`
- `Phase12_Implement.ts`

---

## 8. Corrections Maintained in This Revision

This document keeps these corrected facts:
- issues are `0-10`, not exactly 10
- tie with fewer issues can be accepted
- threshold source is config default `95`
- Phase 13 performs LLM-backed rescoring through Phase 10

