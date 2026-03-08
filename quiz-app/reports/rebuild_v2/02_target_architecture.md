# Target Architecture

Last updated: 2026-03-06

## Architectural Shape

V2 should be designed as a modular platform with clear ownership boundaries.

Logical services/modules:

- `identity-access`
- `curriculum-content`
- `learning-runtime`
- `assessment-review`
- `generation-jobs`
- `reporting-analytics`
- `admin-ops`

## Boundary Rules

`curriculum-content` owns:

- programs
- courses
- units
- lessons
- lesson versions
- questions
- question versions
- publish states

`learning-runtime` owns:

- lesson sessions
- quiz sessions
- attempts
- mastery state
- learner-facing progress

`assessment-review` owns:

- review items
- review scheduling
- remediation state

`generation-jobs` owns:

- AI jobs
- prompts
- scoring artifacts
- refinement artifacts
- operator approval inputs

`reporting-analytics` owns:

- immutable events
- daily aggregates
- cohort metrics
- dashboards and exports

## Deployment Guidance

Initial deployment may remain a single app plus one database if necessary. The key requirement is not microservices. The key requirement is clean module boundaries, explicit data ownership, and asynchronous operational workflows.

## Technical Direction

- API-first backend contracts
- published-content read model
- background jobs for generation and heavy processing
- event logging at runtime boundaries
- strong admin permission model

## Architectural Anti-Patterns to Avoid

- runtime dependence on local filesystem content wiring
- generation jobs inside request/response lifecycle
- duplicate representations of learner progress
- content writes directly from experimental tools into production runtime
- admin pages querying raw operational tables without service-layer rules

