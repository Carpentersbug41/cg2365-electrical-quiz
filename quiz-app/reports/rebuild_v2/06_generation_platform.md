# Generation Platform Specification

Last updated: 2026-03-10

## Goal

Preserve the useful generation capability from the prototype while moving it into a production-safe operating model.

## Core Rules

- generation runs asynchronously
- every run is a job with status
- all prompts and artifacts are stored
- content is reviewed before publishing
- generation does not mutate live learner content directly
- generation outputs include a quality score; publishing is gated by a score threshold (default 92/100)

## Job Lifecycle

- `queued`
- `running`
- `needs_review`
- `approved`
- `rejected`
- `failed`
- `published` only after content workflow transition

## Quality Gate

Default rule: AI-generated lesson drafts must meet a final quality score threshold of 92/100 to be eligible for publishing.

Notes:

- drafts below threshold remain `needs_review` (or may be regenerated/refined)
- publish transitions are blocked unless threshold is met
- if manual overrides are introduced later, they must be explicitly audited

## Supported Job Types

- lesson generation
- question generation
- lesson scoring
- lesson refinement
- game/microbreak generation

## Artifacts to Persist

- prompt input
- prompt version/profile
- raw model output
- parsed output
- score/evaluation reports
- validation reports
- operator decision

## Production Requirements

- retries with reason codes
- timeout handling
- idempotency keys
- queue visibility
- job-level observability

## Current Phase 1 Reality

- V2 lesson generation is now operational through V2-owned adapters and CLI/admin entrypoints.
- The full 7-lesson Biology Phase 1 set has been generated/published through the V2 workflow.
- Current published quality scores for the target set are in the `92-98` range.
- Published question coverage now exists for all 7 target lessons, with `17-18` current published questions per lesson.
- Reproducible content workflow helpers now exist:
  - `scripts/rebuildV2Phase1Lessons.ts`
  - `scripts/validateV2Phase1Lessons.ts`

What remains unfinished in this subsystem:

- question-generation throughput and moderation speed
- remaining canonical event cleanup outside the main runtime/publish/generation paths
- ops hardening beyond the current daily Vercel cron constraint
