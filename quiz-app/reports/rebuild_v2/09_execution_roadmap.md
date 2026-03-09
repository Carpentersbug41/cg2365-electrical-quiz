# Execution Roadmap

Last updated: 2026-03-09

## 0-30 Days

- finalize architecture docs
- define schema v2
- pick first curriculum slice
- define event spec
- decide stack and deployment assumptions

Exit criteria:

- docs approved
- first schema draft approved
- rebuild scope reduced to one achievable slice
- architecture guardrails, dependency rules, and non-negotiables approved

## 30-60 Days

- build content platform foundation
- build learner runtime skeleton
- implement auth/enrollment/progress baseline
- implement event logging
- implement generation job skeleton for lesson drafts (async, stored artifacts, needs-review state)
- implement minimal publish workflow (draft -> needs_review -> published)

Exit criteria:

- one learner can complete one lesson and one quiz on v2
- attempts and progress are server-backed and queryable
- one operator can run a lesson generation job that produces a reviewable draft
- learner runtime reads published V2 content only
- no V2 feature in this slice depends on V1 runtime/content code paths

## 60-90 Days

- implement review queue and mastery updates
- build first admin publishing workflow (ergonomics + audit visibility)
- expand generation jobs to question drafts + review/approval loop
- build first reporting dashboard

Exit criteria:

- one course slice runs end to end in v2
- content can be drafted, reviewed, published, consumed, and measured
- AI generation is part of the demo slice without writing to published content directly
- core state transitions and invariants are enforced via V2-owned service/database paths

## After 90 Days

- migrate additional curricula
- add richer generation workflows
- add teacher dashboards and intervention tooling
- retire prototype runtime gradually

## Critical Risks

- trying to migrate too much at once
- preserving prototype route structure in the new system
- rebuilding generation before content/versioning foundations
- shipping without event instrumentation
- allowing “temporary” shared legacy dependencies to become permanent
- building pages faster than domain contracts

## Phase 1 Implementation Backlog (Ordered)

1. schema v2 foundation (users, content versions, attempts, review items, generation jobs, event log)
2. published-content read path for GCSE Biology lesson runtime
3. learner quiz flow with server-backed attempts and mastery (`>=80%`)
4. review queue creation/serving/completion flow
5. generation worker + `generation_jobs` lifecycle + artifact persistence
6. draft/review/approve/publish admin workflow for lesson/question versions
7. baseline outcome dashboard with phase 1 production metrics

Definition of done for Phase 1:

- learner can complete the full loop (`lesson -> quiz -> review -> outcomes`)
- operator can generate drafts and publish through approval gates
- reporting shows agreed institutional metrics from canonical events
- V2 routes/services are not dependent on V1 runtime/content paths
- the architecture guardrail docs remain true in the implementation
