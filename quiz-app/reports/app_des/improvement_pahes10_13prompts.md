# Phase 10/12/13 Improvement Contracts (Current)

Last verified against code: 2026-03-05
Scope: `SequentialLessonGenerator`, `Phase10_Score`, `Phase12_Refine`, `Phase13_Rescore`

---

## 1. Active Pipeline

Current refinement path is:
1. Phase 10 score assembled lesson
2. Phase 12 generate full refined lesson candidate
3. Phase 13 rescore original vs candidate and decide accept/reject

There is no active JSON patch-apply runtime in this path.

## 2. Trigger Condition

Refinement runs only when initial score is below configured threshold from `getRefinementConfig()`.
If initial score meets threshold, lesson passes with `pass_no_refinement`.

## 3. Accept/Reject Rules

- candidate must meet threshold and pass Phase 13 comparison checks
- regressions can force rejection (`fail_regression`)
- if refined score remains below threshold, generation fails quality gate (`fail_below_threshold`)

## 4. Metadata Persisted

Generator emits `refinementMetadata.report` with statuses:
- `pass_no_refinement`
- `pass_after_refinement`
- `fail_below_threshold`
- `fail_regression`
- `fail_refinement_error`

API persists summary score/report into lesson metadata for admin visibility.

## 5. API-level Outcome

`/api/lesson-generator` can return:
- `409` `GENERATION_IN_PROGRESS` when lock exists
- `422` `QUALITY_THRESHOLD_FAIL` when final score is below threshold

## 6. Important Distinction

The older `improve-lesson` API is currently disabled (501). Active improvement is embedded in the lesson-generator flow.