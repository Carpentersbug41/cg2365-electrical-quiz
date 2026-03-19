# Ranked Implementation Backlog

Last updated: 2026-03-10
Owner: Carpe + Codex
Scope: V2 implementation sequence after the current completion audit

For the current operational status and immediate next-step summary, read `progress.md` first.

## Purpose

This document converts the completion audit into an execution order.

It is not a feature wish list. It is the ranked build sequence required to turn V2 from a strong Phase 1 Biology slice into a real V1 successor.

## Ranking Logic

Work is ranked by:

1. architectural importance
2. impact on core learner loop
3. risk of future rework if delayed
4. production/institution readiness

## Tier 0: Non-Negotiable Remaining Platform Completion

These items come first because the Phase 1 content slice is now real, so the main remaining risks are workflow, analytics, access, and ops maturity.

### 0.1 Finish access model

Status: partial
Priority: highest

Problem:

- current V2 access is stronger than before, but still not the full institutional operating model

Build:

- enforce remaining scope/policy rules for learner runtime routes/APIs
- define course/scope access rules cleanly
- separate learner, teacher, content operator, and admin access where needed
- ensure admin access is role-driven, not effectively global

Exit criteria:

- learner access depends on enrollment/policy, not just sign-in
- admin and non-admin responsibilities are cleanly separated

### 0.2 Align events to canonical spec

Status: partial
Priority: highest

Problem:

- events exist, but naming and coverage are still inconsistent with the canonical analytics spec

Build:

- standardize emitted event names and payloads
- add missing core runtime/admin events
- remove duplicate or ad hoc event semantics where possible

Exit criteria:

- runtime, review, generation, and publish workflows emit canonical events
- reporting no longer depends on route-specific event interpretation

### 0.3 Finish question-generation and moderation throughput

Status: partial
Priority: highest

Problem:

- the question-bank runtime split is done, and the full Phase 1 Biology set is published
- the remaining content-platform gap is operator throughput and moderation speed

Build:

- improve question-draft generation reliability and filters
- reduce review/publish friction without weakening quality gates
- make backlog clearance for missing question coverage faster and more observable

Exit criteria:

- operators can generate, review, approve, and publish question coverage at Phase 1 speed
- readiness debt clears predictably when content is published

## Tier 1: Completion For Biology-First V2

These are the next items required for a strong, credible V2 product beyond the current Phase 1 content replacement.

### 1.1 Complete aggregate-backed reporting

Status: partial
Priority: high

Problem:

- outcomes reporting is materially improved, but still not fully aligned to the final event/aggregate contract

Build:

- finish moving summary/timeseries/backlog semantics onto canonical event/aggregate reads
- preserve drilldown, but reduce request-time reconstruction logic

Exit criteria:

- admin outcomes APIs read primarily from stable aggregates
- metrics match canonical event definitions

### 1.2 Complete question-generation and moderation workflow maturity

Status: partial
Priority: high

Problem:

- lesson generation exists and has replaced all 7 Phase 1 Biology lessons
- question generation exists, but operator throughput still needs hardening

Build:

- harden `question_draft` generation pipeline
- persist artifacts/evaluations consistently for question generation
- improve question moderation lifecycle and audit usability

Exit criteria:

- operators can generate, review, approve, and publish question versions without backlog drag

### 1.3 Complete learner runtime robustness and polish

Status: partial
Priority: high

Problem:

- core loop exists and passes smoke tests, but it is still not polished to final quality

Build:

- harden repeated-use runtime behavior
- improve review state transitions and audit
- finish rendering coverage/polish for remaining lesson block shapes

Exit criteria:

- learner loop is reliable under repeated use
- runtime behavior matches the docs, not just the happy path

### 1.4 Complete Phase 1 signoff and stabilize the Biology slice

Status: partial
Priority: high

Problem:

- the full Phase 1 Biology target set is now published, but release evidence and manual signoff are not fully closed

Build:

- finish manual authenticated browser checks and checklist evidence
- document current quality and coverage state of the 7 target lessons
- confirm the richer content holds up under repeated demo/testing use

Exit criteria:

- Phase 1 can be signed off honestly as a stable Biology-first slice

## Tier 2: Architecture Conformance And Operational Hardening

These items reduce long-term fragility and bring the implementation into line with the rebuild rules.

### 2.1 Run a full V2 guardrail conformance pass

Status: partial
Priority: medium-high

Build:

- inspect V2 imports against the dependency matrix
- isolate remaining shared helpers that carry product assumptions
- reduce legacy/shared coupling where it is still more than generic infrastructure

Exit criteria:

- the implementation materially matches `16` to `19`

### 2.2 Complete operational readiness

Status: partial
Priority: medium-high

Build:

- strengthen monitoring and alerting
- document recovery paths and operational playbooks
- confirm backup/restore expectations
- harden worker/job reliability under sustained use

Exit criteria:

- V2 can be demonstrated and piloted without operator guesswork

### 2.3 Finish institutional/teacher visibility

Status: not built
Priority: medium

Build:

- teacher/cohort dashboard layer
- cohort drilldowns
- intervention-oriented views

Exit criteria:

- V2 is useful not only to learners and content operators, but also to teachers/institutions

## Tier 3: Expansion

These should not interrupt the items above.

### 3.1 Additional curricula

- GCSE Physics
- later qualifications

### 3.2 Richer personalization

- beyond tone/examples
- only after baseline runtime/reporting are stable

### 3.3 Broader content types

- simulations
- microbreak/game expansion
- plugins and richer interactive blocks

## Recommended Execution Order

1. access model
2. canonical event alignment
3. question generation and moderation throughput
4. aggregate-backed reporting completion
5. learner runtime hardening and polish
6. Phase 1 signoff and Biology slice stabilization
7. guardrail conformance pass
8. operational hardening
9. teacher/cohort dashboards
10. expansion work

Use this backlog together with `progress.md`:

- `progress.md` = current state, what is working now, immediate next actions
- `21_ranked_implementation_backlog.md` = ranked long-form implementation order

## What Not To Do

Do not:

- add more curricula before the workflow, reporting, and access foundations are complete
- add more admin surface area before question/content throughput is finished
- treat current dashboard behavior as the final reporting architecture
- treat the current Phase 1 Biology publication state as still-pending target work

## Definition Of "V2 Finished Enough"

V2 can be called a real V1 successor when all of these are true:

- learner runtime is versioned and policy-controlled
- question bank and lesson bank are both real runtime assets
- generation supports the intended content workflow at operator-ready speed
- reporting is based on canonical events and aggregates
- admin/operator/teacher boundaries are clear
- the codebase materially follows the architecture guardrails
