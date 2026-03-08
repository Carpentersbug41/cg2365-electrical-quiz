# Generation Platform Specification

Last updated: 2026-03-06

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
