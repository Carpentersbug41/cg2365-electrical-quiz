# Directive: Phase 10–13 must remain FULL-JSON (No Patches, No Structural Games)

## Non-negotiable decision
Phase 10–13 is **FULL LESSON JSON refinement only**.

- The refiner outputs **a complete Lesson JSON object**.
- We do **not** use JSON patches (RFC6902 or “applyPatch”) anywhere in the Phase 10–13 runtime path.
- We do **not** reintroduce “patch plans”, “patch appliers”, “replaceSubstring”, or any patch-based pipeline.

If you are tempted to re-add patches: **don’t**. It’s rejected by product direction.

---

## Explicit bans (do not add / do not resurrect)
### Banned concepts in Phase 10–13:
- Patch generation (Phase11-style “fix plans” that produce patch ops)
- Patch application (Phase12_Implement-style `applyPatch`, `replaceSubstring`, path-based mutations)
- Any “structural gymnastics” intended to make patching safer:
  - signature locking as a pretext to re-enable patching
  - path-stability hacks
  - “immutable structure constraints” used to justify patch ops
  - partial JSON return fragments that must be merged

### Banned files in the active path:
- `Phase11_Suggest` must remain **unused**
- `Phase12_Implement` must remain **unused**
- No imports, no instantiation, no calls from `SequentialLessonGenerator` or any runtime orchestrator.

They can exist on disk for archival only, but must be **dead code**.

---

## Required architecture (keep it simple)
### Only this pipeline is allowed:
1. Phase10: score original lesson  
2. If score < trigger threshold → Phase12_Refine outputs **complete refined lesson JSON**
3. Phase13: rescore candidate and **keep the best score**  
   - If candidate improves, keep candidate  
   - If not, keep original  
   - **No “candidate must meet threshold” gate**

That’s it.

---

## Guardrails you must implement
- Add a code comment in the orchestrator:
  - “Phase10–13 is full-JSON only. Patches are forbidden.”
- Add a unit test that fails if:
  - `Phase11_Suggest` or `Phase12_Implement` are imported in production code
  - any `applyPatch` / patch op types appear in the Phase10–13 runtime path
- If any patch-related log strings appear in terminal output for Phase10–13, treat it as a regression.

---

## Acceptance criteria
We accept the work only if:
- Phase10–13 runs with **zero patch operations**
- Phase12 outputs **complete lesson JSON**
- Phase13 returns **the better-scoring lesson** (no threshold gate)
- Patch-related modules remain **unreachable** from production execution

Failure to comply = revert the change.
