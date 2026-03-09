# V2 Completion Audit

Last updated: 2026-03-09
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

V2 is no longer just an idea. It has a real skeleton:

- separate V2 routes
- separate V2 tables
- published lesson runtime
- quiz submission
- review queue
- learner progress
- admin lesson version workflow
- admin generation workflow
- basic outcomes dashboard

But it is still a strong Phase 1 prototype, not a finished V2 platform.

The biggest remaining gap is this:

V2 currently demonstrates the end-to-end loop, but several important parts are still implemented as simplified shortcuts rather than final architecture.

## Status Summary

### Built and working

- V2 route surface exists and is separated from V1 deploy/runtime paths
- V2 database foundation exists with `v2_*` tables
- V2 published lesson listing and lesson rendering exist
- V2 quiz submission persists attempts, mastery, and review items
- V2 review queue and completion flow exist
- V2 learner progress summary exists
- V2 admin lesson version workflow exists
- V2 admin generation job workflow exists for lesson drafts
- V2 outcomes admin dashboard exists

### Built but still partial

- learner runtime rendering
- enrollment/gating/access model
- question bank architecture
- generation platform
- analytics pipeline
- role model and admin separation
- production operational hardening

### Not finished enough for “V2 complete”

- versioned question-bank workflow wired into runtime
- question generation workflow
- teacher/cohort dashboard layer
- aggregate/event-driven analytics pipeline
- stronger access control based on enrollment/policy
- full architecture conformance to the new guardrails

## What Is Solid

### 1. V2 boundary and route separation

The project now has a real V2 route surface:

- `/v2/*`
- `/api/v2/*`
- `/api/admin/v2/*`

The deployment split is also documented and enforced at middleware level.

### 2. Separate V2 data model

The schema foundation is real and materially separate from V1:

- `v2_lessons`
- `v2_lesson_versions`
- `v2_attempts`
- `v2_mastery_records`
- `v2_review_items`
- `v2_generation_jobs`
- `v2_event_log`

This is the right base for a rebuild instead of a refactor.

### 3. Core learner loop exists

The important user story is present:

- learn
- quiz
- review
- progress

That matters because it means V2 is no longer only admin/generation work.

### 4. Content version workflow exists

The lesson version lifecycle is real and guarded:

- draft
- needs review
- approved
- published
- retired

This is one of the most important improvements over V1.

## Main Gaps

### 1. Runtime still uses lesson-embedded questions instead of a real question-bank runtime

The docs position V2 as having versioned lessons and a question bank, but the learner quiz flow currently extracts questions directly from lesson blocks.

Current behavior:

- the quiz page reads a published lesson and derives questions from `practice` and `spaced-review` blocks
- the runtime submit API stores attempts against `question_stable_id`, but not a fully realized versioned question-bank workflow

Implication:

- `v2_questions` and `v2_question_versions` exist in schema, but they are not yet the real source of runtime assessment
- question versioning is not fully integrated into learner delivery
- the “question bank” part of the target architecture is still incomplete

Assessment:

- good enough for Phase 1 demo
- not good enough for a finished V2 architecture

### 2. Question generation is not fully built

The docs describe question generation as part of the target and Phase 1 direction, but the implementation is still incomplete.

Current behavior:

- lesson generation is operational
- question-draft queueing/generation path now exists in V2 admin/runtime
- question generation and moderation throughput are still not complete enough to call the content platform finished

Implication:

- generation is real, but not yet finished at the target architecture standard
- the content platform is still incomplete relative to the planned system

Assessment:

- partial generation platform, not complete generation platform

### 3. Analytics are improved but not yet fully aligned to the target contract

The reporting architecture says analytics should be canonical-event based with daily aggregates, cohort metrics, and dashboards.

Current behavior:

- main outcomes surfaces now use aggregate-backed tables
- reporting architecture is materially stronger than before
- event naming/coverage and the final analytics contract still need full alignment

Implication:

- the dashboards work
- but they are still closer to an admin query layer than a production reporting platform
- this will become fragile or slow as data volume grows

Assessment:

- useful and materially improved reporting
- not yet the final reporting architecture

### 4. Access control is improved but not yet the final institutional model

The runtime spec says lesson access should be driven by enrollment and gating policy.

Current behavior:

- V2 learner access now requires an explicit active enrollment
- runtime access is stronger than pure authentication
- the full institutional/role model is still not finished

Implication:

- any signed-in user can likely operate more broadly than the target design intends
- this is fine for demo conditions, but not enough for institutional production use

Assessment:

- explicit learner access control exists
- final access policy / role model is incomplete

### 5. Event model in code does not fully match the canonical event spec

The docs define a canonical event model including:

- `lesson_started`
- `quiz_started`
- `review_item_created`
- `review_item_due`
- `generation_job_started`
- `generation_job_completed`
- `content_published`

Current behavior:

- some runtime/admin events are written
- but event names and coverage are inconsistent with the canonical spec
- several canonical events are absent or replaced by admin-specific names

Implication:

- reporting consistency is not fully locked down yet
- the analytics contract is not yet as clean as the docs require

Assessment:

- event logging exists
- canonical event implementation is incomplete

### 6. Role model is simpler than the documented operating model

The docs describe:

- `admin`
- `content_operator`
- `teacher`
- `learner`

Current behavior:

- V2 admin access is effectively an admin-only model
- there is not yet a true separation between content-operator, teacher, and admin workflows in the implementation

Implication:

- acceptable for early delivery
- not enough for the operational model described in the docs

Assessment:

- partial admin model, not final role model

### 7. V2 still depends on some shared structures and generic legacy-adjacent helpers

Recent work improved separation significantly, but V2 is not yet fully self-contained.

Current examples:

- V2 lesson payloads still use shared lesson types
- V2 scope/session/client wrappers still sit on top of shared lower-level helpers
- generation still depends on the shared generation engine
- the seed flow is still file-backed for bootstrap

Implication:

- this is acceptable in a modular monolith if the shared pieces stay generic
- but some remaining dependencies are still transitional rather than final-state clean

Assessment:

- much cleaner than before
- not yet the final architectural finish line

## Phase Rating

### Product/runtime

- learner flow: `70%`
- admin flow: `75%`
- generation flow: `55%`
- analytics/reporting: `50%`
- access/roles/institution readiness: `40%`
- architecture conformance to target standard: `60%`

### Overall

V2 is approximately:

- `60%` of the way to a real, usable Biology-first V2 product
- `35-45%` of the way to the full long-term “complete system”

## What Must Happen Before V2 Can Be Called Finished

### Required for a strong Biology-first V2

1. finish the runtime/content model split properly
   - decide whether runtime assessment remains lesson-block-based in Phase 1
   - if not, move learner quizzes onto real `v2_questions` / `v2_question_versions`

2. finish the access model
   - enrollment checks
   - scoped learner access
   - explicit admin/operator/teacher permissions where needed

3. finish the event and analytics contract
   - align emitted event names to canonical spec
   - move outcome reporting toward aggregate/event-backed queries

4. finish the generation/content platform scope honestly
   - either implement question generation and question review workflow
   - or narrow the docs so Phase 1 is explicitly lesson-generation-only

5. expand and harden V2-native content inventory
   - enough published Biology content
   - reviewed and stable
   - consistent question coverage

6. complete architecture conformance audit
   - remove or wrap remaining dependencies that carry legacy product assumptions

### Required for the full long-term V2 platform

1. teacher/cohort dashboards
2. intervention tooling
3. fuller reporting pipeline
4. complete question-bank workflow
5. broader curriculum expansion
6. more mature review scheduling/personalization logic
7. stronger operational tooling and recovery/monitoring

## Honest Conclusion

V2 is no longer “just another experiment.” It has enough real architecture and working flow to justify continuing.

But it is not finished.

The current state is:

- good rebuild direction
- credible Phase 1 platform
- still incomplete as a V1 replacement

The main risk now is not that V2 has no foundation.

The main risk is that the team could mistake a working demo slice for a completed system and stop before the architectural shortcuts are resolved.

