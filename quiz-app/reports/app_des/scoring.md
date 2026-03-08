# Scoring and Quality Gates (Current)

Last verified: 2026-03-05

---

## 1. Runtime Sequence

After phases 1-9 assembly:
- Phase 10 scores pedagogical quality
- Phase 12 refines full lesson candidate (if needed)
- Phase 13 rescoring determines accept/reject

## 2. API-Level Enforcement

`/api/lesson-generator` enforces:
- per-lesson lock to prevent concurrent duplicate generation
- threshold check against final score
- `409` with `GENERATION_IN_PROGRESS` on lock conflict
- `422` with `QUALITY_THRESHOLD_FAIL` when below threshold

## 3. Persisted Quality Metadata

Generation writes score metadata in lesson JSON, including:
- generation score
- original/final score details
- refinement report status and reason fields

## 4. Manual Scoring Endpoint

`/api/score-lesson` can score an existing lesson and optionally persist score metadata (`persist=true`).

## 5. Disabled Legacy Endpoint

`/api/improve-lesson` currently returns `501` and is not the active quality-improvement route.