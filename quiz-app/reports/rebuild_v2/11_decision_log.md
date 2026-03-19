# Decision Log

Last updated: 2026-03-10

Use this file to record architecture and product decisions once made.

## Template

### DEC-001

- Date:
- Status: proposed | accepted | rejected | superseded
- Decision:
- Why:
- Consequences:
- Related docs:

## Seed Decisions

### DEC-001

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will be treated as a ground-up rebuild, not a refactor of the current prototype.
- Why: The current application reflects discovery-driven evolution rather than a stable production architecture.
- Consequences: Existing code may still be mined for logic and reference, but architecture will not be derived from current route structure.
- Related docs: `00_overview.md`, `02_target_architecture.md`, `08_migration_strategy.md`

### DEC-002

- Date: 2026-03-06
- Status: accepted
- Decision: Content, learning runtime, generation, and reporting are separate domains in V2.
- Why: The prototype currently couples these concerns too tightly, which raises production risk.
- Consequences: New modules and ownership boundaries must be explicit even if deployment remains a modular monolith at first.
- Related docs: `02_target_architecture.md`, `03_domain_model_and_schema_v2.md`

### DEC-003

- Date: 2026-03-06
- Status: accepted
- Decision: V2 phase 1 will target a single curriculum slice for the demo.
- Why: Reduces scope, avoids early divergence, and enables a coherent end-to-end demo.
- Consequences: Additional curricula are explicitly deferred until after the first slice is stable.
- Related docs: `01_prd.md`, `09_execution_roadmap.md`, `10_open_questions.md`

### DEC-004

- Date: 2026-03-06
- Status: accepted
- Decision: The first V2 curriculum slice is GCSE Biology.
- Why: The prototype already supports GCSE Biology routing and this keeps the demo focused.
- Consequences: Content, event taxonomy, and outcome dashboards in phase 1 will be validated against GCSE Biology first.
- Related docs: `01_prd.md`, `08_migration_strategy.md`, `10_open_questions.md`

### DEC-005

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will be learner-first for the initial demo slice.
- Why: A learner-first narrative forces the runtime, outcomes, and reliability foundations to exist before operator optimizations.
- Consequences: Admin/generation features that do not directly support the learner loop are deferred behind the learner slice.
- Related docs: `04_learner_runtime.md`, `07_event_and_analytics_spec.md`, `09_execution_roadmap.md`, `10_open_questions.md`

### DEC-006

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will be delivered in phases (Phase 1 demo slice -> Phase 2 operationalization -> Phase 3 expansion), but all major prototype capabilities remain in the long-term target.
- Why: Prevents planning deadlock while keeping the long-term intent of a complete system.
- Consequences: Phase 1 scope is explicitly defined and anything else is deferred, not abandoned.
- Related docs: `01_prd.md`, `09_execution_roadmap.md`, `10_open_questions.md`

### DEC-007

- Date: 2026-03-06
- Status: accepted
- Decision: AI generation is required in Phase 1, but only to produce reviewable drafts; publishing requires an approval gate.
- Why: The demo must show the differentiator, while production safety requires draft vs published separation.
- Consequences: Generation runs asynchronously and persists artifacts; generation never mutates published learner content directly.
- Related docs: `06_generation_platform.md`, `01_prd.md`, `05_admin_ops.md`, `09_execution_roadmap.md`

### DEC-008

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will ship as a modular monolith initially, with a separate async worker process for generation jobs.
- Why: Keeps deployments simple for the demo while enforcing the job-based async model required for safe AI operations.
- Consequences: Code boundaries are explicit; generation does not run in the web request lifecycle; the worker can be split into a separate service later if needed.
- Related docs: `02_target_architecture.md`, `06_generation_platform.md`, `09_execution_roadmap.md`, `10_open_questions.md`

### DEC-009

- Date: 2026-03-06
- Status: accepted
- Decision: Supabase/Postgres remains the system of record for V2.
- Why: Existing prototype and migrations already use Supabase; it reduces rebuild risk and speeds the demo.
- Consequences: Schema v2 and event log will be designed for Postgres; any future migration away is an expansion task, not a phase 1 requirement.
- Related docs: `03_domain_model_and_schema_v2.md`, `07_event_and_analytics_spec.md`, `10_open_questions.md`

### DEC-010

- Date: 2026-03-06
- Status: accepted
- Decision: Generation workflows will use a Postgres table-backed queue (`generation_jobs`) and a polling worker process.
- Why: Minimal operational overhead for phase 1 while still enforcing asynchronous, auditable generation.
- Consequences: Job lifecycle is stored in Supabase; worker handles locking, retries, artifacts, and status transitions.
- Related docs: `06_generation_platform.md`, `03_domain_model_and_schema_v2.md`, `10_open_questions.md`

### DEC-011

- Date: 2026-03-06
- Status: accepted
- Decision: Lesson blocks are authored as schema-driven structured content and rendered as semantic HTML without inline styles or forced fonts/colors.
- Why: Keep total freedom to style later without being locked into a UI framework or design system.
- Consequences: Rendering output is un-opinionated; presentation is applied via themes/CSS layers later; block wrappers may include non-styling hooks (for example `data-block-type`) for future theming.
- Related docs: `04_learner_runtime.md`, `05_admin_ops.md`, `03_domain_model_and_schema_v2.md`, `10_open_questions.md`

### DEC-012

- Date: 2026-03-06
- Status: accepted
- Decision: Lesson lifecycle uses versioned states: `draft` -> `needs_review` -> `approved` -> `published` -> `retired`.
- Why: Separates experimentation and AI output from learner-visible content while keeping the workflow simple.
- Consequences: Published versions are immutable; publishing swaps which approved version is live; edits always create new versions.
- Related docs: `05_admin_ops.md`, `03_domain_model_and_schema_v2.md`, `06_generation_platform.md`, `08_migration_strategy.md`, `10_open_questions.md`

### DEC-013

- Date: 2026-03-06
- Status: accepted
- Decision: Default publish eligibility threshold for AI-generated lesson content is a final quality score of 92/100.
- Why: Keeps demo quality high and reduces risk of low-quality content reaching learners.
- Consequences: Generation jobs below threshold remain in review state; publishing requires meeting the threshold (or an explicit admin override with audit if overrides are later allowed).
- Related docs: `06_generation_platform.md`, `05_admin_ops.md`, `10_open_questions.md`

### DEC-014

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will ship with entirely new GCSE Biology lesson and question content (no direct migration of published content from the PoC).
- Why: Avoids importing prototype-era schema drift and quality variance; forces the V2 publish workflow to be exercised from the start.
- Consequences: Migration focuses on user accounts and operational configuration; content comes from V2 generation/authoring.
- Related docs: `08_migration_strategy.md`, `05_admin_ops.md`, `06_generation_platform.md`, `10_open_questions.md`

### DEC-015

- Date: 2026-03-06
- Status: accepted
- Decision: Migrate the small existing set of users from the PoC into V2.
- Why: Preserves continuity for current testers and reduces friction for the demo.
- Consequences: Migrate identity and profiles only; do not migrate attempts/progress history or review queue into V2.
- Related docs: `08_migration_strategy.md`, `07_event_and_analytics_spec.md`, `10_open_questions.md`

### DEC-016

- Date: 2026-03-06
- Status: accepted
- Decision: V2 will not migrate learner attempt history or review queue state from the PoC.
- Why: The V2 data model and event instrumentation are intentionally redesigned; importing legacy history adds complexity without improving the Phase 1 demo.
- Consequences: V2 outcomes start fresh from first use; the PoC remains the historical archive if needed.
- Related docs: `08_migration_strategy.md`, `07_event_and_analytics_spec.md`

### DEC-017

- Date: 2026-03-06
- Status: accepted
- Decision: Phase 1 mastery rule is lesson quiz score >= 80% to mark lesson mastery as achieved.
- Why: Keeps the first release simple, explainable, and fast to implement.
- Consequences: Retention and spaced review are tracked as separate outcome measures instead of being embedded in the mastery state machine in phase 1.
- Related docs: `04_learner_runtime.md`, `07_event_and_analytics_spec.md`, `10_open_questions.md`

### DEC-018

- Date: 2026-03-06
- Status: accepted
- Decision: Phase 1 uses soft prerequisite guidance and avoids hard progression locks.
- Why: Reduces learner friction in demo flows while still showing recommended sequencing.
- Consequences: Gating UX highlights prerequisite readiness but allows continuation; hard gating can be introduced later for specific paths.
- Related docs: `04_learner_runtime.md`, `10_open_questions.md`

### DEC-019

- Date: 2026-03-06
- Status: accepted
- Decision: Personalization in phase 1 is limited to tutor tone/examples from profile data, not adaptive sequencing.
- Why: Preserves personalization value without adding algorithmic complexity early.
- Consequences: Personalization impacts messaging only; lesson order and grading remain deterministic.
- Related docs: `04_learner_runtime.md`, `10_open_questions.md`

### DEC-020

- Date: 2026-03-06
- Status: accepted
- Decision: Institutional outcome metrics for phase 1 are 14-day retention, lesson completion, mastery rate, review adherence, and time-to-mastery.
- Why: These are high-signal metrics for adoption discussions and pilot evaluation.
- Consequences: Dashboards and aggregates prioritize these metrics before adding deeper analytics.
- Related docs: `07_event_and_analytics_spec.md`, `09_execution_roadmap.md`, `10_open_questions.md`

### DEC-021

- Date: 2026-03-06
- Status: accepted
- Decision: Production dashboards in phase 1 expose only reliably measurable metrics: attempts, completion, mastery status, review due/resolved, active users, generation job outcomes.
- Why: Keeps reporting trustworthy while event model matures.
- Consequences: Any metric requiring inferred or low-confidence data is deferred.
- Related docs: `07_event_and_analytics_spec.md`, `10_open_questions.md`

### DEC-022

- Date: 2026-03-06
- Status: accepted
- Decision: A canonical event schema is mandatory before implementation starts and is fixed in the analytics spec.
- Why: Prevents inconsistent telemetry and rework in reporting pipelines.
- Consequences: Runtime and generation features must emit required event fields from day one.
- Related docs: `07_event_and_analytics_spec.md`, `10_open_questions.md`, `09_execution_roadmap.md`

### DEC-023

- Date: 2026-03-09
- Status: accepted
- Decision: V2 must not take runtime or content dependencies on V1 product modules.
- Why: Shared legacy product paths are the fastest way to recreate V1 coupling inside the rebuild.
- Consequences: Any reused product logic must be copied or wrapped into V2-owned modules; V1 remains a reference source, not a runtime dependency.
- Related docs: `02_target_architecture.md`, `08_migration_strategy.md`, `16_architecture_guardrails.md`, `19_non_negotiables_for_v2.md`

### DEC-024

- Date: 2026-03-09
- Status: accepted
- Decision: V2 domain actions must flow through owned service/database transition paths rather than ad hoc table updates in route/page handlers.
- Why: State integrity and auditability degrade quickly when transitions are implemented as convenience field writes.
- Consequences: Publish/review/retry/mastery/review-item state changes require explicit transition ownership and idempotent side effects.
- Related docs: `03_domain_model_and_schema_v2.md`, `05_admin_ops.md`, `18_data_invariants_and_state_machines.md`

### DEC-025

- Date: 2026-03-09
- Status: accepted
- Decision: Mixed V1/V2 deploy mode is a transition aid only and is not a valid steady-state production architecture.
- Why: Keeping mixed mode around as a default makes boundary erosion too easy during delivery.
- Consequences: Production targets should run in explicit `v1` or `v2` mode; any temporary mixed mode must be treated as operational debt.
- Related docs: `13_deployment_split.md`, `16_architecture_guardrails.md`, `19_non_negotiables_for_v2.md`
