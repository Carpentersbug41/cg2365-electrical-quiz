# Target Architecture

Last updated: 2026-03-09

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

## Enforcement Boundaries

Domain boundaries are not only conceptual. They must be visible in code and data access patterns.

Required enforcement rules:

- learner-facing routes do not write content tables directly
- generation routes do not publish content directly
- admin routes do not bypass service-layer validation/state transitions
- reporting routes do not compute institutional metrics from ad hoc operational joins when canonical events/aggregates exist
- V2 modules do not import V1 runtime/content modules

## Service Entry Points

Each domain should expose a narrow service surface:

- `curriculum-content`: create draft version, request review, approve version, publish version, retire version, fetch published read model
- `learning-runtime`: start lesson session, submit quiz, update mastery, fetch progress summary
- `assessment-review`: create review items, fetch due queue, complete review item, resolve remediation
- `generation-jobs`: enqueue job, claim job, persist artifacts, persist evaluation, finalize status
- `reporting-analytics`: append event, build aggregates, serve dashboard queries/exports
- `admin-ops`: orchestrate moderated transitions and operational actions, but not bypass domain rules

## V1/V2 Separation Rule

V2 may share low-level generic infrastructure only where it carries no V1 product assumption.

Examples of acceptable sharing:

- Supabase client creation
- generic request/session parsing
- pure utility helpers

Examples of unacceptable sharing:

- V1 content registries
- V1 route-driven runtime services
- V1-specific progress/state helpers
- any code path that changes behavior based on legacy course/runtime assumptions

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
- cross-domain convenience imports that bypass ownership
- shared legacy helpers that smuggle V1 assumptions into V2
- mixed deploy modes treated as a permanent architecture rather than a transition aid

Reference:

- `16_architecture_guardrails.md`
- `17_module_dependency_matrix.md`
