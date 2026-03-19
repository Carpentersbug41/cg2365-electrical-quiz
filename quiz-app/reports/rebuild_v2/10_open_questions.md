# Open Questions

Last updated: 2026-03-10

## Product Questions

- What is the first commercial slice: one institution, one curriculum, or one qualification family?
  - Resolved (2026-03-06): one curriculum.
- Is V2 primarily a learner platform, an operator platform, or both from day one?
  - Resolved (2026-03-06): learner-first demo slice.
- Which current features are genuinely differentiating versus distracting?
  - Resolved (2026-03-06): V2 uses phased delivery (P1 demo slice -> P2 ops hardening -> P3 expansion). Phase 1 includes AI generation (with approval gates) as part of the demo story.

### Demo Slice Clarification

- Resolved (2026-03-06): V2 initial curriculum = GCSE Biology.

## Technical Questions

- Single deployable modular monolith first, or early service split?
  - Resolved (2026-03-06): modular monolith first, with a separate async worker process for generation jobs.
- Postgres/Supabase remains system of record, or move to another operational stack?
  - Resolved (2026-03-06): Supabase/Postgres remains system of record for V2.
- What queue/job runner will own generation workflows?
  - Resolved (2026-03-06): Supabase/Postgres table-backed queue (`generation_jobs`) with a polling worker.
- What content editor model will be used for lesson blocks?
  - Resolved (2026-03-06): schema-driven block editor that reads/writes canonical lesson JSON; renderer outputs semantic HTML only with no inline styles and no forced fonts/colors; styling is applied later via theming.

## Content Questions

- What is the exact draft/review/publish lifecycle for lessons?
  - Resolved (2026-03-06): `draft` -> `needs_review` -> `approved` -> `published` -> `retired` (versioned, published immutable, publish swaps versions).
- What approval threshold is required before AI-generated content becomes publishable?
  - Resolved (2026-03-06): default threshold = 92/100 (final quality score).
- Which existing lesson/question assets are clean enough to migrate directly?
  - Resolved (2026-03-06): no content migration; V2 uses entirely new GCSE Biology content authored/generated under the V2 publish workflow.

## Runtime Questions

- What mastery rule is the actual v2 rule, not just a prototype heuristic?
  - Resolved (2026-03-06): lesson mastery is achieved when lesson quiz score >= 80% in V2 phase 1.
- Which gating behaviors remain mandatory in v2?
  - Resolved (2026-03-06): soft prerequisite guidance only; no hard progression locks in phase 1 (except auth/access and published-content visibility).
- How much personalization belongs in the first release?
  - Resolved (2026-03-06): light personalization only (tone/examples from profile), no adaptive sequencing in phase 1.

## Reporting Questions

- Which metrics matter to institutions enough to drive adoption?
  - Resolved (2026-03-06): 14-day retention, lesson completion, mastery rate, review adherence, time-to-mastery.
- Which metrics are reliable enough to expose in production dashboards?
  - Resolved (2026-03-06): attempts, completion, mastery status, review due/resolved, active users, generation job outcomes.
- What event schema must be fixed before implementation begins?
  - Resolved (2026-03-06): canonical event schema with required fields defined in `07_event_and_analytics_spec.md`.
