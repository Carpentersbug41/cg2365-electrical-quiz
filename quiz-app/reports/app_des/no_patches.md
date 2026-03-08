# Refinement Policy Reality Check - No Patch Runtime

Last verified: 2026-03-05
Status: Accurate for current code

---

## 1. Current Truth

Active lesson improvement uses full-candidate refinement and comparison:
- Phase 10 score
- Phase 12 full refined lesson candidate
- Phase 13 compare and accept/reject

The runtime does not apply incremental JSON patches as the operational mechanism.

## 2. Evidence in Current Code

- `SequentialLessonGenerator.runPhase10` comments and behavior show full lesson candidate path
- compatibility `patchesApplied` field exists but is not the active mutation model
- `improve-lesson` API is disabled (`501`) and explicitly marked for refactor

## 3. Practical Impact

- debugging is done by comparing original vs candidate lesson payloads
- quality gating uses final score + regression checks, not patch counts
- failures surface as quality/report statuses rather than patch-operation failures