# V2 Master Handover

Last updated: 2026-03-10
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
- question-bank-backed quiz runtime
- explicit lesson/quiz session starts
- idempotent quiz submission and review loop
- learner progress
- onboarding and explicit V2 access control
- V2-scoped admin/content-operator role support
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
- Quiz runtime now reads published question-bank records only; learner quiz fallback to lesson blocks was removed.
- Lesson and quiz sessions now start explicitly before submission.
- Quiz submission is idempotent for an existing quiz session and records attempts against real published `question_version_id` rows.
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
- `/v2/admin` now includes V2 role management alongside enrollments.

Read next:
- `05_admin_ops.md`
- `18_data_invariants_and_state_machines.md`

### 3.5 Generation and operations

- V2 generation jobs exist and run asynchronously.
- Manual run, queue run, stale-job handling, retry/requeue, and alerting exist.
- V2 question moderation now supports bulk filtered transitions for:
  - submit all draft question versions to review
  - approve all filtered review question versions
  - publish all filtered approved question versions
- Admin readiness now surfaces:
  - missing content coverage
  - moderation backlog
  - stale/stuck jobs
  - queue freshness
- Readiness now reports queue cadence targets, overdue minutes, queued backlog volume, and oldest queued job age.
- Batch lesson queueing exists.
- Question-draft queueing is re-enabled in admin.
- Queue-run prioritization now favors:
  - question drafts for published lessons missing coverage
  - Phase 1 target lessons before lower-priority queued work
- `/v2/admin` now prioritizes generation jobs toward missing question coverage, Phase 1 lesson debt, retry-exhausted failures, and stale work.

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
- Aggregate refresh now derives attempts, lesson start/completion, mastery, and generation metrics from canonical `v2_event_log` events; review backlog/on-time still depends on review-item state.
- Lesson/unit cohort tables and at-risk learner views exist.
- Outcomes filtering now excludes V2-privileged users (`content_operator` / `admin`) from learner cohorts.
- Content publish flows now emit canonical `content_published` for both lesson and question publishing.
- Readiness no longer undercounts question moderation debt: question backlog is now computed from all question-version states, while published/current versions remain the coverage source of truth.

Read next:
- `07_event_and_analytics_spec.md`
- `20_v2_completion_audit.md`

### 3.7 Testing and deployment

- V2-only E2E smoke flows exist and are passing.
- Live deployed V2 smoke now passes against the current production URL for:
  - learner flow
  - admin generation queue flow
  - browser role management
- Live deployed V2 signoff coverage now also passes for:
  - exact 7-lesson `/v2/learn` surface
  - representative richer lesson rendering
  - authenticated split-route checks on the V2 surface
  - admin user drilldown timeline load
- Automated Phase 1 signoff report now exists:
  - `reports/rebuild_v2/phase1_signoff_report.json`
- Production build is passing again.
- Build stability note:
  - the local build crash on 2026-03-10 was resolved by clearing stale `.next` output and moving heavy static simulation repos out of `src/app/simulations` into `src/simulations`
- Split deployment has fresh live verification on 2026-03-09:
  - V2 production URL blocks `/learn` and `/api/v1/*`
  - V1 production URL blocks `/v2` and `/api/v2/*`
- Focused route tests now cover:
  - V2 role assignment API
  - quiz-session start behavior
  - updated quiz submit contract (`quizSessionId` required, duplicate submit handling)
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

- Published question versions are now the runtime assessment source of truth.
- The remaining work is no longer learner fallback removal; it is operator/content throughput and final cleanup around content/question workflow maturity.

### 5.2 Generation platform completeness

- Generation is real and operational.
- Lesson generation path is much stronger than earlier.
- Question generation/moderation exists but still needs completion and throughput hardening before this can be called a finished content platform.

### 5.3 Analytics contract

- Outcomes views are now materially better and aggregate-backed.
- Event naming/coverage is improved, and aggregate refresh now uses canonical events for the main learner/ops metrics.
- Remaining event work is alignment/completeness beyond the main publish/runtime/generation flows and richer review timing semantics.
- The analytics architecture is improved, but not fully closed.

### 5.4 Role model / institutional model

- Admin, learner, and content-operator flows now exist at the V2 access-control layer.
- Teacher separation is not yet a finished operating model.
- Institutional visibility exists in admin, but not yet as a finished teacher/cohort product layer.

### 5.5 Isolation finish line

- V2 is much cleaner than before.
- V2 route/UI layers no longer import legacy generation or module-planner modules directly.
- V2 lesson generation and module-planner access now go through V2-owned adapter/services:
  - `src/lib/v2/generation/service.ts`
  - `src/lib/v2/modulePlanner/service.ts`
- Some shared low-level infra and the intentional generation adapter still remain behind those V2-owned boundaries.
- That is acceptable for now, but not the final architectural finish line.

## 6. What Is Not Finished Yet

### 6.1 Must finish before calling Phase 1 properly complete

1. Finish question generation and moderation throughput
2. Complete canonical event alignment
3. Run a final V2 guardrail conformance pass
4. Decide how to handle historical content-provenance evidence for the seeded V2 biology dataset

Operational note:
- generation scheduler cadence cannot be increased beyond daily on the current Vercel Hobby plan
- the deployed app now reports a daily cadence honestly via `V2_GENERATION_QUEUE_CADENCE_MINUTES=1440`
- higher-frequency worker cadence is now a hosting-plan limitation, not an unresolved code path

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

1. Tighten question-generation quality + moderation throughput
   - improve operator speed beyond the new bulk moderation controls without weakening publish gates
2. Finish canonical event alignment
   - remaining alignment is outside the main runtime/publish/generation paths
3. Harden generation ops
   - the code supports richer cadence assumptions, but deployed cron remains daily on Hobby
4. Decide whether V2 needs stronger source-provenance recording for seeded/generated content
   - current signoff proves V2 ownership, not full historical authorship lineage

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

Recent completion notes:

- Added a V2-only manual lesson-generation route at `/api/admin/v2/generate/lesson` that reuses the strong generator pipeline but saves output into `v2_lesson_versions` instead of V1 lesson files.
- Added `/api/admin/v2/import-lesson-draft` so generated lesson payloads can be imported into V2 draft versions explicitly.
- Added V2-owned module planner routes under `/api/admin/v2/module/*` so the V2 module surface no longer depends on the old admin route family.
- Added V2-facing admin pages at `/v2/generate` and `/v2/admin/module`.
- Updated the module planner UI so generated blueprint lessons are auto-saved into V2 draft versions through the V2 route path, with manual import still available as a fallback control.
- Added direct links from `/v2/admin` to the V2 lesson generator and V2 module planner.
- Fixed the lesson-code normalization gap between module-planner IDs like `BIO-1-1A` and V2 lesson codes like `BIO-101-1A` at the V2 persistence boundary.
- Generated, persisted, and published a richer V2 lesson for `BIO-101-1A` on 2026-03-09:
  - published version: `v2`
  - quality score: `92`
  - published block count: `12`
  - question sync on publish: `18` active question versions, `3` retired
- Added CLI helpers:
  - `scripts/generateV2LessonDraft.ts`
  - `scripts/publishV2LessonVersion.ts`
- Added a centralized V2 lesson-code normalizer in `src/lib/v2/lessonCode.ts` so module-planner lesson IDs normalize consistently at the V2 boundary.
- Added V2-owned adapter/service layers for lesson generation and module planning:
  - `src/lib/v2/generation/service.ts`
  - `src/lib/v2/modulePlanner/service.ts`
- Updated queued lesson generation to persist first-class `quality_score` values when generator refinement metadata is available, rather than creating `null`-score AI drafts.
- Added an architecture boundary test to stop V2 route/UI files from directly importing legacy generation or module-planner modules:
  - `src/lib/v2/architectureBoundary.test.ts`
- Added a Phase 1 content-replacement workflow:
  - `src/data/v2/gcse/biology/phase1LessonProfiles.ts`
  - `scripts/lib/v2ContentWorkflow.ts`
  - `scripts/rebuildV2Phase1Lessons.ts`
  - `scripts/validateV2Phase1Lessons.ts`
- Rebuilt and republished the remaining six Phase 1 biology lessons through the V2 pipeline on 2026-03-10:
  - `BIO-101-1B` -> version `2`, quality `98`
  - `BIO-102-1A` -> version `2`, quality `96`
  - `BIO-102-1B` -> version `2`, quality `94`
  - `BIO-103-1A` -> version `2`, quality `96`
  - `BIO-103-1B` -> version `2`, quality `96`
  - `BIO-104-1A` -> version `5`, quality `96`
- Phase 1 validation now shows all 7 biology target lessons with published current versions, passing publish gates, and published question coverage (`17-18` questions each).
- Deployed V2 smoke still passes after the richer content replacement:
  - `E2E_BASE_URL=https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app npm run test:e2e:v2`
- Added a dedicated Phase 1 signoff verifier:
  - `scripts/verifyV2Phase1Signoff.ts`
  - writes `reports/rebuild_v2/phase1_signoff_report.json`
- Added a deployed-browser signoff spec:
  - `tests/e2e/v2-phase1-signoff.spec.ts`
  - now included in `npm run test:e2e:v2`
- Verified signoff evidence on 2026-03-10:
  - exact published Biology lesson set on `/v2/learn` matches the 7 target lessons
  - representative lessons render richer V2 blocks without fallback text
  - admin drilldown timeline loads from `/api/admin/v2/outcomes/timeseries`
  - authenticated V2 surface blocks `/learn` and `/api/v1/quiz-sets`
  - signoff workflow exercise proved `draft -> needs_review -> approved -> published -> retired -> draft` on a temporary lesson and cleaned up after itself
- Build stability cleanup on 2026-03-10:
  - moved static simulation repos out of `src/app/simulations` into `src/simulations`
  - added `src/lib/simulations/paths.ts` so the `/simulations/*` runtime and admin clone flow still resolve the correct filesystem root
  - cleared stale `.next` output and re-ran `npm run build` successfully
  - deployed V2 E2E remained green (`5 passed`)
- Added bulk V2 question moderation controls on 2026-03-10:
  - new shared transition helper: `src/lib/v2/questions/transition.ts`
  - new bulk route: `/api/admin/v2/question-versions/bulk-status`
  - `/v2/admin` now supports bulk filtered `submit_review`, `approve`, and `publish` for question versions
  - focused route tests passed and production build passed after a clean `.next` rebuild

## 11. Honest Bottom Line

V2 has enough real architecture and working flow to justify continuing as the successor system.

It is not just another demo.

But it is also not finished.

The correct stance for the next chat is:

- trust the direction
- trust the working V2 surface
- treat the learner assessment/runtime split as materially resolved
- do not assume the platform is complete
- finish the architecture and operations properly before declaring V2 done
