# Learner Runtime Specification

Last updated: 2026-03-06

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

## Personalization Scope (Phase 1)

- personalization influences tutor tone and examples only
- it does not alter lesson sequencing, gating, or grading rules
