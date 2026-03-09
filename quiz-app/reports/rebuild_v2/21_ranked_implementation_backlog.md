# Ranked Implementation Backlog

Last updated: 2026-03-09
Owner: Carpe + Codex
Scope: V2 implementation sequence after completion audit

For the current operational status and immediate next-step summary, read `progress.md` first.

## Purpose

This document converts the completion audit into an execution order.

It is not a feature wish list. It is the ranked build sequence required to turn V2 from a strong Phase 1 prototype into a real V1 successor.

## Ranking Logic

Work is ranked by:

1. architectural importance
2. impact on core learner loop
3. risk of future rework if delayed
4. production/institution readiness

## Tier 0: Non-Negotiable Architecture Completion

These items come first because building around them later is expensive and messy.

### 0.1 Finish assessment architecture

Status: not finished
Priority: highest

Problem:

- V2 quiz runtime still derives questions from lesson blocks
- `v2_questions` and `v2_question_versions` are not yet the real assessment source of truth

Build:

- define the final relationship between lesson content and question bank
- make published question versions the authoritative runtime source
- keep lesson blocks as teaching content, not the long-term quiz data source
- wire attempts to real `question_id` / `question_version_id` consistently
- add admin workflow for question draft/review/publish

Exit criteria:

- learner quiz runtime can run entirely from published question versions
- lesson and question versioning are consistent
- attempts link to real question version records

### 0.2 Finish access model

Status: partial
Priority: highest

Problem:

- current V2 is mostly authentication-gated, not access-policy-gated

Build:

- enforce enrollment checks for learner runtime routes/APIs
- define course/scope access rules
- separate learner, teacher, content operator, and admin access where needed
- ensure admin access is role-driven, not effectively global

Exit criteria:

- learner access depends on enrollment/policy, not just sign-in
- admin and non-admin responsibilities are cleanly separated

### 0.3 Align events to canonical spec

Status: partial
Priority: highest

Problem:

- events exist, but naming and coverage are inconsistent with the canonical analytics spec

Build:

- standardize emitted event names and payloads
- add missing core runtime/admin events
- remove duplicate or ad hoc event semantics where possible

Exit criteria:

- runtime, review, generation, and publish workflows emit canonical events
- reporting no longer depends on route-specific event interpretation

## Tier 1: Platform Completion For Biology-First V2

These are the next items required for a strong, credible V2 product.

### 1.1 Replace raw-table dashboard computation with aggregate-backed reporting

Status: partial
Priority: high

Problem:

- current outcomes dashboards compute directly from operational tables at request time

Build:

- implement daily aggregate jobs/materialized views
- move summary and timeseries APIs onto canonical event/aggregate reads
- preserve user drilldown, but reduce page-time reconstruction logic

Exit criteria:

- admin outcomes APIs read primarily from stable aggregates
- metrics match canonical event definitions

### 1.2 Complete question generation and question moderation workflow

Status: not built
Priority: high

Problem:

- lesson generation exists
- question generation does not

Build:

- add `question_draft` generation pipeline
- persist artifacts/evaluations for question generation
- add question moderation lifecycle and audit

Exit criteria:

- operators can generate, review, approve, and publish question versions

### 1.3 Complete learner runtime robustness

Status: partial
Priority: high

Problem:

- core loop exists, but it is still Phase-1-simple

Build:

- make lesson start/quiz start flows explicit
- harden retry and duplicate-submit behavior
- improve review state transitions and audit
- finish rendering coverage for lesson block types that still degrade gracefully

Exit criteria:

- learner loop is reliable under repeated use
- runtime behavior matches the docs, not just the happy path

### 1.4 Expand and stabilize V2-native Biology content inventory

Status: partial
Priority: high

Problem:

- there is enough content for demos, not enough for a finished Biology-first product

Build:

- publish a coherent Biology slice with consistent structure and question coverage
- review generated content through the full V2 workflow
- remove temporary/demo-only content assumptions

Exit criteria:

- V2 Biology can support repeated testing/demo use without thin-content failure

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
- harden worker cadence and job reliability under sustained use

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

1. assessment architecture
2. access model
3. canonical event alignment
4. aggregate-backed reporting
5. question generation + moderation
6. learner runtime hardening
7. Biology content expansion
8. guardrail conformance pass
9. operational hardening
10. teacher/cohort dashboards
11. expansion work

Use this backlog together with `progress.md`:

- `progress.md` = current state + what is working now + immediate next actions
- `21_ranked_implementation_backlog.md` = ranked long-form implementation order

## What Not To Do

Do not:

- add more curricula before the assessment/runtime/reporting foundations are complete
- add more admin surface area before question/content workflows are finished
- treat current dashboard queries as the final reporting architecture
- keep lesson-block-derived quiz runtime as the permanent assessment model unless that is explicitly re-decided and documented

## Definition Of "V2 Finished Enough"

V2 can be called a real V1 successor when all of these are true:

- learner runtime is versioned and policy-controlled
- question bank and lesson bank are both real runtime assets
- generation supports the intended content workflow, not only lesson drafts
- reporting is based on canonical events and aggregates
- admin/operator/teacher boundaries are clear
- the codebase materially follows the architecture guardrails
