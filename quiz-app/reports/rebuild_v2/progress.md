# V2 Master Handover

Last updated: 2026-03-09
Owner: Carpe + Codex
Audience: new chat / new LLM taking over V2 work
Status: authoritative operational handover for current V2 state

## 1. Purpose

Read this document first.

It is the master handover for V2. It tells a new chat:

- what V2 is
- what has already been built
- what is currently working
- what is still partial or unfinished
- what to do next
- which deeper doc to read for each subsystem

This is not the full architecture spec and not the historical changelog. It is the operational summary that sits above the rest of `reports/rebuild_v2`.

## 2. Headline Status

V2 is now a real separate system inside the shared repo, not just a planning exercise.

It has:

- separate V2 routes
- separate `v2_*` tables
- published lesson runtime
- quiz submission and review loop
- learner progress
- onboarding and explicit V2 access control
- admin moderation and publish workflow
- generation-job workflow
- V2 readiness / intervention / outcomes admin views
- V2-only E2E smoke coverage

But it is still not a full V1 replacement.

The honest position is:

- strong Phase 1 platform
- credible Biology-first demo/product slice
- still incomplete for the long-term "complete system"

## 3. What Is Built And Working

### 3.1 Architecture and isolation

- V2 has its own route surface:
  - `/v2/*`
  - `/api/v2/*`
  - `/api/admin/v2/*`
- V2 uses separate `v2_*` tables and versioned content workflow.
- V2 is intentionally not allowed to reuse V1 lesson/content runtime behavior.
- V2 now has V2-owned wrappers around core admin/session/client plumbing in the key V2 paths.
- Middleware/runtime split exists so V1 and V2 can be separated by deployment/surface mode.

Read next:
- `02_target_architecture.md`
- `16_architecture_guardrails.md`
- `17_module_dependency_matrix.md`
- `19_non_negotiables_for_v2.md`

### 3.2 Learner runtime

- V2 lesson list and lesson pages work.
- V2 quiz page works.
- Quiz submission records attempts, review items, and progress data.
- Review queue and review completion loop work.
- Progress summary route/page work.
- Learner runtime is now behind explicit V2 enrollment, not automatic demo enrollment.

Read next:
- `04_learner_runtime.md`
- `03_domain_model_and_schema_v2.md`

### 3.3 Onboarding and learner entry

- First-time V2 users are redirected into onboarding before entering `/v2/*`.
- Onboarding no longer loops on prefixed routes.
- Onboarding has:
  - visible start/retry controls
  - active progress panel
  - STT mic input
  - recording waveform UI
  - responses captured counter
  - questions remaining counter
- Onboarding is now STT-focused; spoken playback was removed.

Current UX rule:
- if a user has no `tutor_profile_summary`, onboarding should appear before V2 access
- if onboarding is complete, the user should land in `/v2/learn`

### 3.4 Content, moderation, and publish workflow

- Lesson version lifecycle is implemented:
  - draft
  - needs_review
  - approved
  - published
  - retired
- Admin moderation/publish gates exist for lessons and question versions.
- Moderation evidence/checklist enforcement exists.
- Publish gate blocks invalid/styled/low-quality content.
- Question-bank backfill tooling exists.

Read next:
- `05_admin_ops.md`
- `18_data_invariants_and_state_machines.md`

### 3.5 Generation and operations

- V2 generation jobs exist and run asynchronously.
- Manual run, queue run, stale-job handling, retry/requeue, and alerting exist.
- Admin readiness now surfaces:
  - missing content coverage
  - moderation backlog
  - stale/stuck jobs
  - queue freshness
- Batch lesson queueing exists.
- Question-draft queueing is re-enabled in admin.

Important current truth:
- generation is operational
- generation platform is not yet "finished"

Read next:
- `06_generation_platform.md`
- `14_phase1_release_checklist.md`

### 3.6 Reporting and outcomes

- V2 outcomes admin surface exists in `/v2/admin`.
- Summary, timeseries, refresh, breakdown, readiness, and interventions endpoints exist.
- Reporting now reads aggregate-backed metrics tables rather than pure request-time raw scans for the main outcomes views.
- Lesson/unit cohort tables and at-risk learner views exist.

Read next:
- `07_event_and_analytics_spec.md`
- `20_v2_completion_audit.md`

### 3.7 Testing and deployment

- Production build is passing.
- V2-only E2E smoke flows exist and are passing.
- Separate V1/V2 deployment split is documented.
- Tester/demo runbook exists.

Read next:
- `13_deployment_split.md`
- `14_phase1_release_checklist.md`
- `15_tester_access_runbook.md`

## 4. Current Dev / Test Reality

### 4.1 Main local URLs

- Sign in: `http://localhost:3000/auth/sign-in`
- Onboarding: `http://localhost:3000/onboarding`
- V2 learn: `http://localhost:3000/v2/learn`
- V2 admin: `http://localhost:3000/v2/admin`
- V2 review: `http://localhost:3000/v2/review`
- V2 progress: `http://localhost:3000/v2/progress`

### 4.2 Local server note

If local behavior looks stale or route behavior does not match current code, restart V2 cleanly and clear `.next`. A stale local Next process has repeatedly been the cause of false debugging signals.

### 4.3 Current test shape

- E2E smoke exists for:
  - onboarding
  - learner V2 flow
  - admin V2 flow
- onboarding trial setup script exists and resets the onboarding test user
- deterministic V2 test-user provisioning exists

### 4.4 Current test/demo content position

- Biology-first Phase 1 target set is currently 7 named lessons
- readiness is measured against that explicit target set
- V2 is intended to be tested on this narrow slice before broader content expansion

## 5. What Is Partial Or Simplified

These are the major areas where V2 works, but not yet at final architecture standard.

### 5.1 Assessment architecture

- Question-bank-backed assessment has advanced materially, but this is still the most sensitive architectural area.
- The intent is published question versions as the authoritative assessment source.
- The remaining work is to remove any lingering shortcut behavior and make the runtime/content/question split fully clean and final.

### 5.2 Generation platform completeness

- Generation is real and operational.
- Lesson generation path is much stronger than earlier.
- Question generation/moderation exists but still needs completion and throughput hardening before this can be called a finished content platform.

### 5.3 Analytics contract

- Outcomes views are now materially better and aggregate-backed.
- Event naming/coverage still needs full alignment to the canonical spec.
- The analytics architecture is improved, but not fully closed.

### 5.4 Role model / institutional model

- Admin and learner flows exist.
- Teacher/content-operator separation is not yet a finished operating model.
- Institutional visibility exists in admin, but not yet as a finished teacher/cohort product layer.

### 5.5 Isolation finish line

- V2 is much cleaner than before.
- Some shared low-level infra and the intentional generation adapter still remain.
- That is acceptable for now, but not the final architectural finish line.

## 6. What Is Not Finished Yet

### 6.1 Must finish before calling Phase 1 properly complete

1. Finish remaining assessment architecture hardening
2. Finish question generation and moderation throughput
3. Complete canonical event alignment
4. Harden generation scheduler cadence / alerting / backlog operations
5. Run a final V2 guardrail conformance pass
6. Finalize Phase 1 sign-off against the release checklist

### 6.2 Still missing before V2 can be called a full V1 replacement

1. Complete teacher/cohort product layer
2. Complete role model beyond admin + learner
3. Finish long-term reporting/event architecture
4. Finish full question-bank/content platform maturity
5. Finish deeper operational hardening and recovery playbooks
6. Expand beyond Biology-first Phase 1 scope

## 7. Known Current Risks

- The easiest way to regress V2 is to reintroduce legacy/shared assumptions under time pressure.
- The biggest architectural risk remains assessment/content boundary drift.
- The biggest operational risk is mistaking a strong demo slice for a finished production system.
- Local stale-server behavior can still create false negatives during testing.

## 8. Immediate Next Actions

These are the next tasks another implementer should take in order.

1. Finish remaining assessment-architecture hardening
   - confirm runtime assessment is fully aligned to published question-version truth
2. Tighten question-generation quality + moderation throughput
   - improve operator speed without weakening publish gates
3. Finish canonical event alignment
   - make analytics semantics clean and stable
4. Harden generation ops
   - scheduler cadence, stuck-job handling, alerting, publish backlog prioritization
5. Run a full V2 guardrail conformance pass
   - remove remaining non-generic legacy/shared leakage
6. Execute the release checklist honestly
   - record pass/fail and remaining blockers

## 9. Rules For The Next Implementer

- Work on V2 only unless a shared low-level dependency is truly unavoidable.
- Do not reintroduce V1 runtime/content fallback logic into V2.
- Do not weaken the guardrails in `16` to `19`.
- Keep `progress.md` current when a major subsystem changes.
- Treat `12_progress_tracker.md` as the detailed implementation log and `progress.md` as the operational handover.

## 10. Document Map

### Start here

1. `progress.md`
2. `README.md`

### Then read by need

- Product and architecture:
  - `00_overview.md`
  - `01_prd.md`
  - `02_target_architecture.md`
- Schema / state:
  - `03_domain_model_and_schema_v2.md`
  - `18_data_invariants_and_state_machines.md`
- Learner runtime:
  - `04_learner_runtime.md`
- Admin / moderation / ops:
  - `05_admin_ops.md`
  - `06_generation_platform.md`
- Analytics:
  - `07_event_and_analytics_spec.md`
- Migration / deployment:
  - `08_migration_strategy.md`
  - `13_deployment_split.md`
  - `15_tester_access_runbook.md`
- Architecture protection:
  - `16_architecture_guardrails.md`
  - `17_module_dependency_matrix.md`
  - `19_non_negotiables_for_v2.md`
- Current truth about progress and gaps:
  - `12_progress_tracker.md`
  - `20_v2_completion_audit.md`
  - `21_ranked_implementation_backlog.md`
- Release sign-off:
  - `14_phase1_release_checklist.md`

## 11. Honest Bottom Line

V2 has enough real architecture and working flow to justify continuing as the successor system.

It is not just another demo.

But it is also not finished.

The correct stance for the next chat is:

- trust the direction
- trust the working V2 surface
- do not assume the platform is complete
- finish the architecture and operations properly before declaring V2 done
