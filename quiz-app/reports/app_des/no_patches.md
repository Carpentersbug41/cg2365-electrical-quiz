# Phase 10-13 Policy and Reality: Full JSON Refinement (No Active Patch Runtime)

Last verified: 2026-02-12
Status: Policy + current-state reality check

---

## 1. Intended Architecture Policy

For the active generation runtime, Phase 10-13 should operate as:
1. Phase 10 scores the assembled lesson.
2. Phase 12 refines by outputting a complete lesson JSON object.
3. Phase 13 rescoring compares original vs candidate and keeps the better pedagogical result.

Active runtime should not depend on patch-operation execution in this path.

---

## 2. What Is True in Current Runtime

In current production path (`SequentialLessonGenerator`):
- Active refinement uses `Phase10_Score`, `Phase12_Refine`, and `Phase13_Rescore`.
- `Phase11_Suggest` and `Phase12_Implement` are not imported or called in this runtime flow.
- Phase 12 (`Refine`) outputs full lesson JSON and validates structural invariants.
- Phase 13 decision is best-of comparison (improvement or tie with fewer issues), not a hard threshold gate.

---

## 3. What Still Exists (Legacy Drift)

Although patch runtime is inactive, patch-era artifacts still exist in codebase:
- Legacy phase files:
  - `src/lib/generation/phases/Phase11_Suggest.ts`
  - `src/lib/generation/phases/Phase12_Implement.ts`
- Legacy patch-oriented integration test:
  - `src/lib/generation/__tests__/phase10-13-pipeline.test.ts`
- Compatibility naming still present in active files:
  - fields/log labels like `patchesApplied`
  - rejected output filename suffix `-rejected-patches.json`
  - config/comments with old phase labeling
- Debug/analysis utilities and types still include patch-oriented shapes.

This means the repository is mixed: runtime is full-JSON, surrounding naming and archival/testing layers are not fully cleaned.

---

## 4. Operational Guardrail (Current)

When modifying generation:
- treat full-lesson JSON refine/rescore as the active architecture
- do not wire `Phase11_Suggest` or `Phase12_Implement` back into runtime
- do not add new patch-op execution paths to active generation orchestration

---

## 5. Practical Interpretation

"No patches" is currently true for the active lesson-generation runtime path, but not yet fully true as a repository-wide cleanup claim.

Use this distinction explicitly in docs and reviews:
- runtime architecture: full-JSON refinement
- residual legacy code: patch-era compatibility/archives

---

## 6. Acceptance Criteria for Future Cleanup

A full repository-level "no patches" state would require:
- removal or archival of patch-only test paths
- removal/rename of patch-era compatibility fields and logs
- config/comments aligned with active Phase 10 + 12 + 13 flow terminology

Until then, enforce "no active patch runtime" rather than "zero patch references in repo".
