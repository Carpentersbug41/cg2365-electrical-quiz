# V2 Completion Audit

Last updated: 2026-03-10
Owner: Carpe + Codex
Scope: current V2 implementation vs rebuild docs

For the current operational handover and next-step summary, read `progress.md` first.

## Purpose

This document evaluates the current V2 implementation against the intended rebuild architecture.

It is not a code-quality review. It answers:

- what is genuinely complete
- what is partially built
- what is still missing before V2 is a real replacement for V1
- what architectural gaps remain despite recent isolation work

## Headline Verdict

V2 is no longer just an idea. It now has a real Biology-first product slice:

- separate V2 routes
- separate V2 tables
- published lesson runtime
- question-bank-backed quiz runtime
- review queue
- learner progress
- admin lesson/question publish workflow
- generation workflow
- outcomes dashboard

It is no longer accurate to call V2 only a prototype for the Phase 1 Biology slice.

It is accurate to say:

- strong Phase 1 platform
- honest 7-lesson Biology slice
- still not a full V1 replacement

## Status Summary

### Built and working

- V2 route surface exists and is separated from V1 deploy/runtime paths
- V2 database foundation exists with `v2_*` tables
- V2 published lesson listing and lesson rendering exist
- V2 quiz runtime uses published question-bank records
- V2 quiz submission persists attempts, mastery, and review items
- V2 review queue and completion flow exist
- V2 learner progress summary exists
- V2 admin lesson/question version workflow exists
- V2 admin generation workflow exists
- all 7 Phase 1 Biology lessons are now published through the richer V2 generation flow
- all 7 Phase 1 Biology lessons have published question coverage
- deployed V2 E2E still passes after the richer content replacement

### Built but still partial

- learner runtime rendering polish
- enrollment/gating/access model
- question-generation throughput and moderation speed
- analytics/event contract completeness
- role model and admin separation
- production operational hardening

### Not finished enough for “V2 complete”

- teacher/cohort dashboard layer
- richer aggregate/event-driven analytics contract
- stronger institutional access control beyond current enrollment/policy
- full architecture conformance to the new guardrails
- deeper operational tooling and recovery maturity

## What Is Solid

### 1. V2 boundary and route separation

The project has a real V2 route surface:

- `/v2/*`
- `/api/v2/*`
- `/api/admin/v2/*`

The deployment split is documented and enforced at middleware level.

### 2. Separate V2 data model

The schema foundation is real and materially separate from V1:

- `v2_lessons`
- `v2_lesson_versions`
- `v2_questions`
- `v2_question_versions`
- `v2_attempts`
- `v2_mastery_records`
- `v2_review_items`
- `v2_generation_jobs`
- `v2_event_log`

This is the right base for a rebuild instead of a refactor.

### 3. Core learner loop exists

The important user story is present and working:

- learn
- quiz
- review
- progress

That matters because V2 is no longer only admin/generation work.

### 4. Content version workflow exists

The lesson version lifecycle is real and guarded:

- draft
- needs review
- approved
- published
- retired

Question publish workflow is also real enough to back learner delivery.

### 5. Phase 1 Biology content is now real, not placeholder-level

The full 7-lesson target set now exists as current published V2 content with:

- richer generated lesson structure
- current published quality scores in the `92-98` range
- current published question coverage in the `17-18` range per lesson

That materially changes the V2 Phase 1 assessment from “demo-only shell” to “usable narrow product slice.”

## Main Gaps

### 1. Question-bank runtime is resolved, but question workflow maturity is still incomplete

Current behavior:

- learner quizzes now load from published `v2_questions` / `v2_question_versions`
- attempts persist real `question_id` / `question_version_id`
- published lesson/question sync is working for the full Phase 1 Biology set

Remaining problem:

- the question-generation and moderation path still needs throughput hardening
- operators need faster backlog clearance without weakening publish gates

Assessment:

- runtime/content split: materially resolved
- question workflow maturity: still partial

### 2. Generation is real, but the content platform is not finished

Current behavior:

- V2 lesson generation is operational
- V2 module-planner handoff is operational
- V2 question-draft generation exists
- the generation pipeline has now proven itself by replacing the full Phase 1 Biology set

Remaining problem:

- moderation speed
- question-generation throughput
- ops cadence and recovery limits

Assessment:

- real generation platform
- not yet the finished content platform

### 3. Analytics are improved but not yet fully aligned to the target contract

Current behavior:

- main outcomes surfaces use aggregate-backed tables
- canonical events are materially better than earlier
- publish/runtime/generation flows are closer to the intended contract

Remaining problem:

- event naming/coverage still needs cleanup outside the main paths
- review timing semantics are still not fully canonical-event-backed

Assessment:

- useful and materially improved reporting
- not yet the final reporting architecture

### 4. Access control is improved but not yet the final institutional model

Current behavior:

- V2 learner access requires active enrollment
- V2 roles now distinguish learner, content operator, and admin

Remaining problem:

- the full institutional/teacher model is not finished
- some policy boundaries are still simpler than the target operating model

Assessment:

- explicit learner access control exists
- final institutional model is incomplete

### 5. V2 still depends on some shared structures and generic legacy-adjacent helpers

Recent work improved separation significantly:

- V2 route/UI layers no longer import legacy generation or module-planner modules directly
- V2 now uses V2-owned adapter/service layers for those subsystems

Remaining problem:

- some shared low-level and generation internals are still transitional rather than fully final-state clean

Assessment:

- much cleaner than before
- not yet the final architectural finish line

## Phase Rating

### Product/runtime

- learner flow: `85%`
- admin flow: `82%`
- generation flow: `75%`
- analytics/reporting: `68%`
- access/roles/institution readiness: `55%`
- architecture conformance to target standard: `78%`

### Overall

V2 is approximately:

- `75%` of the way to a real, usable Biology-first V2 product
- `45-55%` of the way to the full long-term complete system

## What Must Happen Before V2 Can Be Called Finished

### Required for a strong Biology-first V2

1. finish the access model
   - scoped learner access
   - explicit admin/operator/teacher permissions where needed

2. finish the event and analytics contract
   - align emitted event names to canonical spec
   - move remaining outcome reporting onto stable aggregate/event-backed logic

3. finish the generation/content platform honestly
   - improve question generation and question review throughput
   - keep publish gates strict while reducing operator friction

4. complete architecture conformance audit
   - remove or wrap remaining dependencies that carry legacy product assumptions

5. finish release-signoff and ops hardening
   - manual authenticated checks
   - operator recovery paths
   - scheduler/worker limitations documented and owned

### Required for the full long-term V2 platform

1. teacher/cohort dashboards
2. intervention tooling beyond current admin tables
3. fuller reporting/event pipeline
4. more mature question-bank/content platform
5. broader curriculum expansion
6. stronger operational tooling and recovery/monitoring

## Honest Conclusion

V2 is no longer “just another experiment.” It now has enough real architecture and enough real published Biology content to justify continuing as the successor system.

But it is not finished.

The current state is:

- good rebuild direction
- credible Phase 1 product slice
- still incomplete as a V1 replacement

The main risk now is no longer that V2 has no foundation.

The main risk is mistaking a strong narrow slice for a completed system and stopping before the remaining workflow, analytics, access, and operational gaps are resolved.
