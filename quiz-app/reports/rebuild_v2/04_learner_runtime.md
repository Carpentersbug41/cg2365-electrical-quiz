# Learner Runtime Specification

Last updated: 2026-03-09

## Scope

This spec defines the learner-facing product in V2.

## Main Flows

1. learner signs in
2. learner opens course/unit/lesson
3. learner consumes lesson content
4. learner completes assessment
5. learner receives immediate result and mastery update
6. learner receives due review items later

## Required Surfaces

- course home
- lesson page
- lesson quiz page
- review queue page
- learner progress summary

## Runtime Rules

- only published content is learner-visible
- one server-backed progress model exists
- lesson access rules are driven by enrollment and configured gating policy
- every learner attempt emits an event
- review due state is computed server-side, not in the client
- phase 1 uses soft prerequisite guidance instead of hard progression locks

## Runtime Boundary Rules

The learner runtime is a consumer of approved/published content, not a content authoring surface.

- runtime pages and APIs read from published V2 content only
- runtime does not inspect draft or needs-review versions
- runtime does not call V1 lesson registries, file loaders, or legacy progress helpers
- runtime does not infer institutional metrics directly; it emits canonical events for reporting
- client code is presentation only; grading, mastery, and review scheduling remain server-owned

## Mastery Model

Phase 1 uses a simple mastery model:

- `pending`
- `achieved`

Rule:

- set lesson mastery to `achieved` when learner scores >= 80% on the lesson quiz

Retention and spaced review are measured separately in reporting rather than folded into mastery transitions in phase 1.

## Review Model

Review should be tied to:

- wrong answers
- low-confidence answers if implemented
- elapsed time/cadence policy

Each review item should have:

- source question
- learner
- due timestamp
- status
- times seen
- times corrected

Only the review domain may mutate review-item lifecycle state.

## Personalization Scope (Phase 1)

- personalization influences tutor tone and examples only
- it does not alter lesson sequencing, gating, or grading rules

## Runtime Non-Goals

- no dual source of truth between client state and server state
- no hidden use of unpublished content for learner rendering
- no runtime-specific exceptions that bypass content versioning
