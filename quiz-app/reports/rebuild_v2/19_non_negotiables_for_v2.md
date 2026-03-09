# Non-Negotiables For V2

Last updated: 2026-03-09

## Purpose

These are the rules V2 does not break, even if a shortcut looks faster.

## Non-Negotiables

1. No V1 runtime fallback inside V2.
   - no legacy content fallback
   - no V1 route reuse
   - no V1 progress/review helper dependency

2. No file-driven production runtime.
   - content must come from V2-owned persisted models/read paths

3. No dual source of truth for learner state.
   - mastery, attempts, review state, and progress are server-owned

4. No in-request AI generation for production workflows.
   - generation is queued, observable, and auditable

5. No direct mutation of published content.
   - published content changes only via version swaps

6. No admin bypass of domain rules.
   - admin UI is not permission to ignore invariants

7. No analytics invented at the page layer.
   - institutional metrics must align to the canonical event model

8. No permanent mixed V1/V2 production mode.
   - mixed mode may exist temporarily during transition only

9. No hidden styling lock-in in lesson content.
   - semantic structure only
   - no inline styles
   - no forced fonts/colors in stored lesson content

10. No “temporary” shortcut without an owner and removal plan.
   - if an exception is necessary, document it as operational debt with a date and exit path
