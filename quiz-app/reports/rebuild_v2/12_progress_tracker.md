# Rebuild V2 Progress Tracker

Last updated: 2026-03-10
Owner: Carpe + Codex
Scope: V2 rebuild only (no V1 reuse)

This is the detailed implementation tracker.
For a new chat / new LLM, start with `progress.md` first.

## 1. Current Position

V2 is established as a separate architecture baseline (schema + core APIs), with isolated learner and admin routes in place.
V2 now has a minimal end-to-end content workflow (draft/review/approve/publish) plus a Phase 1 generation-job skeleton.
V2 admin now has release-readiness, intervention, and access-control visibility on top of the content workflow.

## 2. Completed

### 2.1 Architecture and planning
- [x] V2 rebuild documentation set created (`00` to `11`).
- [x] Decision direction set: V2 is a clean architecture, not a refactor of V1.
- [x] Constraint confirmed: no V1 fallback/content reuse for V2 runtime.
- [x] Architecture guardrail layer added:
  - [x] `16_architecture_guardrails.md`
  - [x] `17_module_dependency_matrix.md`
  - [x] `18_data_invariants_and_state_machines.md`
  - [x] `19_non_negotiables_for_v2.md`
- [x] Completion audit added:
  - [x] `20_v2_completion_audit.md`
- [x] Ranked execution backlog added:
  - [x] `21_ranked_implementation_backlog.md`

### 2.2 Data and backend foundations
- [x] V2 schema/migrations added (separate `v2_*` tables).
- [x] V2 published lessons API exists: `/api/v2/published-lessons`.
- [x] V2 runtime submit API exists: `/api/v2/runtime/lesson-quiz/submit`.
- [x] Admin outcomes endpoints include V2 metrics inputs.
- [x] V2 admin lesson version APIs:
  - [x] `/api/admin/v2/lesson-versions`
  - [x] `/api/admin/v2/lesson-versions/status`
- [x] V2 generation-job APIs:
  - [x] `/api/admin/v2/generation-jobs`
  - [x] `/api/admin/v2/generation-jobs/[jobId]/run`
  - [x] `/api/admin/v2/generation-jobs/run-queued`
- [x] V2 outcomes summary API:
  - [x] `/api/admin/v2/outcomes/summary`
  - [x] `/api/admin/v2/outcomes/timeseries`
  - [x] `/api/admin/v2/outcomes/refresh`
- [x] V2 question version admin APIs:
  - [x] `/api/admin/v2/question-versions`
  - [x] `/api/admin/v2/question-versions/status`

### 2.3 Isolation work completed in this session
- [x] Removed biology route fallback from V2 path to legacy lesson JSON.
- [x] Added dedicated V2 route namespace:
  - [x] `/v2`
  - [x] `/v2/learn`
  - [x] `/v2/learn/[lessonId]`
- [x] Added V2 quiz route and runner:
  - [x] `/v2/quiz/[lessonId]`
- [x] Added V2 review route and API:
  - [x] `/v2/review`
  - [x] `/api/v2/review/queue`
  - [x] `/api/v2/review/complete`
- [x] Added V2 progress route and API:
  - [x] `/v2/progress`
  - [x] `/api/v2/progress/summary`
- [x] Added V2-specific auth gate layout for `/v2/*` routes.
- [x] Smoke-tested V2 submit/progress pipeline with a temporary V2 lesson (`BIO-99-1A`).
- [x] Extended `/v2/learn/[lessonId]` block renderer coverage for major block types.
- [x] Added V2 quiz-to-review UX link when incorrect answers exist.
- [x] Cleared seeded mixed V2 biology rows to reset clean boundary.
- [x] Updated biology seed route to V2-only source path (`src/data/v2/gcse/biology`), not legacy lesson folder.
- [x] Removed V2 surface styling classes to keep V2 UI plain and style-agnostic for later design pass.
- [x] Added V2 admin surface:
  - [x] `/v2/admin`
  - [x] lesson version transitions: `draft -> needs_review -> approved -> published` and retire/revert support.
  - [x] generation job queue + manual run to create AI-sourced draft lesson versions.
- [x] Added V2 question-bank moderation surface in `/v2/admin`:
  - [x] question version listing/filtering by lesson/status
  - [x] question version transitions with moderation + publish gate
- [x] Added V2-owned content/runtime types and question runtime adapters.
- [x] Contained legacy lesson generation dependency behind a V2-owned generation engine adapter.

## 3. In Progress

### 3.1 V2 learner frontend
- [~] Improve V2 lesson block rendering quality/completeness beyond basic text rendering.
- [x] Build V2 learner quiz page and wire submit flow to V2 runtime endpoint.
- [x] Removed learner quiz fallback to lesson-block-derived questions; quiz page now blocks when published question coverage is missing.
- [x] Added explicit V2 lesson/quiz session start flow before quiz submission.
- [x] Updated V2 quiz submit contract to require `quizSessionId` and return idempotent results for duplicate submit attempts.

### 3.2 V2 content readiness
- [x] Add first truly V2-native biology lessons into V2 content source.
- [x] Re-seed V2 from V2-only source once content is authored.
- [x] Remove temporary smoke-test lesson (`BIO-99-1A`) from V2 published content.
- [x] Expanded V2 biology demo inventory to 7 published lessons (`BIO-101-1A`, `BIO-101-1B`, `BIO-102-1A`, `BIO-102-1B`, `BIO-103-1A`, `BIO-103-1B`, `BIO-104-1A`).

## 4. Not Started / Left To Do

### 4.1 V2 runtime productization
- [x] `/v2/review` page for due items and completion loop.
- [x] `/v2/progress` page for learner mastery/attempt summaries.
- [x] V2 onboarding/auth gate across `/v2/*`.
- [x] V2 learner access now requires an explicit active V2 enrollment; learner routes no longer auto-create demo enrollment on first visit.

### 4.2 V2 operations and admin
- [x] V2 admin content workflow UI (draft -> review -> approved -> published).
- [x] V2 analytics dashboard UX for learning/behavior/operations outcomes (in `/admin/users`).
- [x] V2 analytics dashboard cards/table in `/v2/admin` backed by V2-only metrics.
- [x] V2 outcomes reporting now refreshes and reads aggregate tables (`v2_daily_user_metrics`, `v2_daily_ops_metrics`) instead of request-time scans over attempts/review/job tables.
- [x] V2 admin outcomes dashboard now includes cohort breakdown tables by lesson and unit (`/api/admin/v2/outcomes/breakdown`).
- [x] V2 admin now includes enrollment access controls:
  - list current V2 enrollments
  - grant access by email
  - withdraw access without touching V1
- [x] V2 admin now includes V2 role management:
  - new API: `/api/admin/v2/roles`
  - grant/revoke `learner`, `content_operator`, and `admin`
  - role controls surfaced in `/v2/admin`
- [x] V2 admin now includes readiness and intervention views:
  - `/api/admin/v2/readiness`
  - `/api/admin/v2/outcomes/interventions`
  - filter/sort/limit controls on `/api/admin/v2/outcomes/breakdown`
- [x] V2 admin dashboard now shows:
  - content readiness gaps (missing published lessons / question coverage)
  - enrollment status filtering and access counts
  - operational readiness including last queue run and retry exhaustion
  - at-risk learner and lesson intervention tables
- [x] V2 readiness is now measured against an explicit Biology Phase 1 target set (7 named lessons), not just generic lesson counts.
- [~] V2 generation worker endpoint now exists (`run-queued`) and readiness now tracks cadence targets, overdue queue runs, queued backlog volume, and oldest queued work; production scheduler wiring still needs final high-frequency verification.
- [x] V2 generation runner now calls the shared lesson generation engine (Phase 1-9 path via `FileGenerator`) with context-aware request shaping from latest lesson version metadata/content.
- [x] V2 admin now supports manual requeue for failed or stale generation jobs.
- [x] Queue-run prioritization now favors:
  - question-draft jobs for published lessons missing question coverage
  - Phase 1 target lessons ahead of lower-priority queued work
- [x] `/v2/admin` generation jobs are now sorted toward:
  - question coverage debt first
  - Phase 1 lesson debt next
  - retry-exhausted / stale / stuck jobs before lower-priority work

### 4.3 Deployment separation
- [x] Separate V2 deployment URL/project from V1 deployment.
- [x] Keep V1 only on legacy domain/paths at runtime via `APP_SURFACE_MODE` gating in middleware.
- [x] Publish clear URL map and environment matrix (V1 vs V2).

### 4.4 Quality and test hardening
- [~] Add V2-specific integration tests for learner journey.
- [x] Add V2-only E2E smoke tests.
- [x] Add release checklist for Phase 1 demo.

Completed in this slice:
- [x] Added route tests for V2 admin status and generation APIs.
- [x] Added middleware tests for `APP_SURFACE_MODE` split behavior.
- [x] Fixed Vitest scope so nested simulation `node_modules` tests are excluded.
- [x] Verified test suite status: `43 passed / 43 files` (`165 passed` tests).
- [x] Verified production build completes cleanly on current code.
- [x] Redeployed separate V1 + V2 production projects after middleware/env updates.
- [~] External route-boundary probe is blocked by deployment protection (`401` on all tested paths), so path-level runtime confirmation still needs authenticated browser validation.
- [x] Added autonomous queue-run API for V2 generation jobs (`POST /api/admin/v2/generation-jobs/run-queued`) with cron-secret option.
- [x] Added tests for queue-run auth/service-unavailable behavior.
- [x] Fixed V2 middleware mode parsing to trim env values (handles newline-contaminated Vercel env entries).
- [x] Fixed V2 middleware flow to stop legacy course-prefix redirects for allowed `/v2/*` routes.
- [x] Verified live V2 boundary behavior on production URL:
  - `/v2` and `/v2/learn` reachable
  - legacy `/learn` blocked
  - `/api/v1/*` blocked, `/api/v2/*` reachable
- [x] Added deterministic V2 E2E harness with automatic Supabase test-user provisioning.
- [x] Passing E2E smoke flows: learner (`/v2/learn -> quiz -> review -> progress`) and admin (`/v2/admin` generation queue smoke).
- [x] Verified live V2 generation run creates AI draft lesson version:
  - created job for `BIO-104-1A`
  - executed `/api/admin/v2/generation-jobs/[jobId]/run`
  - resulting version state includes `version_no=2`, `status=draft`, `source=ai`.
- [x] Added context-aware generation request shaping in V2 runner:
  - merges latest lesson context (`topic`, `section`, `prerequisites`, `learningOutcomes`) into the generation request
  - expands `mustHaveTopics` and `additionalInstructions` with existing lesson intent
- [x] Deployed V2 and ran live smoke verification against shared Supabase on 2026-03-08:
  - queued and executed job `4553e093-f40c-4f0b-a9a3-feb65852427e` for `BIO-104-1A`
  - created draft version `0e38c5f7-9287-4a0d-93d7-6a8338350175` as `version_no=3`, `source=ai`, `status=draft`.
- [x] Added strict V2 publish gate on admin status transitions (`approve`/`publish`):
  - validates lesson content schema presence and core fields
  - blocks inline-style tokens to preserve style-agnostic content contract
  - enforces minimum publish quality threshold when score is present (`<85` blocked)
- [x] Added generation reliability hardening in V2 job runner:
  - failure taxonomy (`TRANSIENT_TIMEOUT`, `TRANSIENT_RATE_LIMIT`, `TRANSIENT_NETWORK`, `CONFIG_AUTH`, `VALIDATION`, `UNKNOWN`)
  - automatic retry re-queue for transient failures when attempts remain
  - richer failure telemetry in `v2_generation_job_steps`, `v2_generation_jobs.payload`, and event log payload
- [x] Updated V2 admin UI to surface publish-gate failures and generation retry/error metadata.
- [x] Added moderation evidence enforcement for `approve` / `publish` transitions:
  - required checklist confirmations (objectives, factual correctness, policy check)
  - required reviewer evidence notes (min length) before status transition
- [x] Added V2 admin generation alerting:
  - retry-exhausted failed job alerts
  - 24-hour failure spike alert section
- [x] Added V2 moderation history timeline:
  - new API: `/api/admin/v2/approval-decisions`
  - new V2 admin table showing reviewer, lesson/version, decision, reason, timestamp
- [x] Added proactive alert hook for generation retry exhaustion:
  - optional webhook via `V2_ADMIN_ALERT_WEBHOOK_URL`
  - emits `generation_retry_exhausted` payload with job/lesson/error/attempt metadata
- [x] Added failure-spike webhook alerting with dedupe window:
  - queue worker triggers `generation_failure_spike` webhook when >=3 failures in a run
  - 30-minute dedupe via `v2_event_log` event (`admin_generation_failure_spike_alert`)
- [x] Added moderation history filters/export:
  - API filters: decision, reviewerId, lessonCode, dateFrom, dateTo
  - UI filters + CSV export from `/v2/admin` moderation history section
- [x] Added batch lesson generation queueing for content expansion:
  - API accepts `lessonCodes[]` and de-duplicates active queued/running jobs
  - V2 admin supports comma/newline batch code entry and one-click queueing
- [x] Added question-bank backfill tooling for existing published V2 lessons:
  - new admin API: `/api/admin/v2/question-bank/backfill`
  - new V2 admin action to sync published lesson content into `v2_questions` / `v2_question_versions`
- [x] Verified test/build status after hardening:
  - `45 passed / 45 files` (`173 passed` tests)
  - production build successful
- [x] Deployed reliability + publish-gate slice to V2 production URL:
  - `https://quiz-app-v2-n1ncwwldz-carpentersbugs-projects.vercel.app`
- [x] Replaced request-time outcomes scans with aggregate-backed reporting:
  - added refresh endpoint: `/api/admin/v2/outcomes/refresh`
  - `summary` and `timeseries` now read `v2_daily_user_metrics` / `v2_daily_ops_metrics`
  - admin dashboard refreshes aggregates before loading outcomes
  - remote migration applied: `202603090001_v2_outcomes_aggregates.sql`
- [x] Excluded V2-privileged users from learner outcome cohorts:
  - `content_operator` / `admin` users are now filtered out of summary, timeseries, interventions, breakdown, and aggregate refresh paths
- [x] Moved V2 aggregate refresh closer to the canonical analytics contract:
  - `refreshV2DailyMetrics` now derives attempts, lesson start/completion, mastery, and generation metrics from `v2_event_log`
  - review backlog/on-time still uses `v2_review_items` state where canonical event payloads are not yet sufficient
- [x] Fixed readiness backlog accounting for questions:
  - question moderation backlog now reads all `v2_question_versions`
  - published/current question versions remain the coverage source of truth
- [x] Added V2 question moderation workflow primitives:
  - aggregate-backed question bank remains sourced from published lesson/question records
  - new question publish gate validates stem, accepted answers, styling neutrality, quality threshold
  - atomic question-version transition RPC added and applied remotely: `202603090002_v2_apply_question_version_transition.sql`
- [x] Hardened version-write integrity for V2 content publishing/generation:
  - draft question generation no longer displaces current published question versions
  - published question sync now detects MCQ metadata changes (including `options`)
  - atomic DB helpers added/applied for lesson publish, published question sync, and question draft insertion: `202603090004_v2_atomic_version_writes.sql`
- [x] Verified current validation status after aggregate reporting + V2 isolation pass:
  - full test suite: `58 files`, `198 tests`
  - production build successful
- [x] Verified focused access-control slice after explicit enrollment hardening:
  - focused V2 tests: `8 files`, `19 tests`
  - production build successful
- [x] Added V2 readiness endpoint aggregating content, access, and operations health.
- [x] Added explicit `GCSE_BIOLOGY_PHASE1_TARGET` manifest and surfaced target-set readiness in `/api/admin/v2/readiness` and `/v2/admin`.
- [x] Added V2 intervention endpoint for at-risk learners and lessons.
- [x] Extended V2 outcomes breakdown API with lesson/unit filters, sorting, and row limits.
- [x] Added queue-run audit event logging so readiness can report the last successful admin queue sweep.
- [x] Removed false UI affordance for unimplemented question-draft queueing in `/v2/admin`.
- [x] Added minimal `src/pages/_error.tsx` fallback so the repo-wide Next.js build completes reliably.
- [x] Continued V2 isolation pass:
  - moved V2 scope filtering off shared curriculum helpers into `src/lib/v2/scope.ts`
  - reduced remaining non-V2 dependencies in V2-owned paths to low-level Supabase wrappers and the intentional legacy generation adapter
- [x] Re-enabled V2 question-draft queueing in admin after confirming the runner path is implemented.
- [x] Added question-draft runner coverage:
  - `src/lib/v2/generation/runGenerationJob.test.ts`
- [x] Added stricter V2 question-generation filtering before draft creation:
  - rejects malformed/duplicate/low-signal generated MCQs
  - prevents duplicate prompts in a single question-generation run
- [x] Hardened V2 question publish gate for MCQs:
  - requires unique non-empty options
  - requires at least one accepted answer to match an option
- [x] Verified current validation status after readiness/admin expansion:
  - focused V2 tests: `6 files`, `8 tests`
  - full test suite: `63 files`, `205 tests`
  - production build successful
- [x] Verified current validation status after Biology target-set readiness + question-draft path re-enable:
  - focused V2 tests: `3 files`, `6 tests`
  - production build successful
- [x] Added operational backlog visibility to V2 readiness:
  - lesson/question moderation backlog counts
  - stuck running generation jobs
  - stale queued generation jobs
  - queue-run freshness signal
- [x] Added manual requeue endpoint for generation jobs:
  - `POST /api/admin/v2/generation-jobs/[jobId]/requeue`
- [x] Added operator actions in `/v2/admin` for:
  - force requeue of stuck running jobs
  - requeue of failed/cancelled jobs
  - direct run of stale queued jobs
- [x] Verified current validation status after ops hardening:
  - focused V2 tests: `2 files`, `3 tests`
  - production build successful
- [x] Verified current validation status after question-quality hardening:
  - focused V2 tests: `3 files`, `7 tests`
  - production build successful
- [x] Hardened onboarding entry flow for V2:
  - first-time V2 users are redirected into onboarding before `/v2/*`
  - prefixed onboarding redirect loops were fixed in the global auth wrapper
- [x] Upgraded onboarding UX:
  - STT mic control added
  - waveform/recording UI added
  - more active progress states added
  - responses captured and questions remaining now shown explicitly
- [x] Removed spoken onboarding question playback so onboarding stays STT-focused.
- [x] Strengthened tutor voice rules:
  - teach/check/fix prompts now explicitly require simple-first explanations and plain language before technical depth
- [x] Hardened Phase 1 runtime/session architecture:
  - new runtime endpoints: `/api/v2/runtime/lesson-session/start` and `/api/v2/runtime/quiz-session/start`
  - quiz start now requires published question-bank coverage
  - quiz submit now grades only against published `v2_question_versions`
  - duplicate submit returns the existing session result rather than creating duplicate attempts
- [x] Added V2 canonical event helper and aligned main runtime/publish flows:
  - runtime submit now writes canonical runtime/review events through a shared helper
  - lesson publish and question publish now both emit canonical `content_published`
  - lesson/question publish now resolve lesson/course/unit/org context through the canonical helper
- [x] Added V2-scoped role/access primitives:
  - new helper: `src/lib/v2/access.ts`
  - V2 admin guard now accepts `content_operator` where appropriate while preserving admin fallback
  - new migration added and applied remotely: `202603090009_v2_roles_and_runtime_constraints.sql`
- [x] Added focused validation for the new Phase 1 slice:
  - role route test: `/api/admin/v2/roles`
  - runtime test: `/api/v2/runtime/quiz-session/start`
  - runtime test: `/api/v2/runtime/lesson-quiz/submit`
  - focused tests passed (`5 tests`)
  - production build successful
- [x] Verified validation after queue-cadence/readiness correction:
  - focused V2 tests: `6 files`, `15 tests`
  - production build successful
- [x] Verified live deployed V2 E2E on 2026-03-09 against `https://quiz-app-v2-gu96094oj-carpentersbugs-projects.vercel.app`:
  - learner flow (`/v2/learn -> quiz -> review -> progress`)
  - admin generation queue smoke
  - browser role grant by email
- [x] Updated E2E harness to provision active V2 enrollments before Playwright runs so deployed V2 access gating is exercised correctly.
- [x] Re-verified live deployed V2 E2E after deploy/signoff cleanup on 2026-03-09 against `https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app`:
  - learner flow passed
  - admin generation queue smoke passed
  - browser role grant passed
- [x] Verified split deployment with current production URLs:
  - V2 URL blocks `/learn` and `/api/v1/*`
  - V1 URL (`https://quiz-app-coral-iota-99.vercel.app`) blocks `/v2` and `/api/v2/*`
- [x] Checked cron/scheduler closeout:
  - attempted hourly Vercel cron update
  - Vercel Hobby rejected it because Hobby supports daily cron only
  - set `V2_GENERATION_QUEUE_CADENCE_MINUTES=1440` so readiness matches deployed reality
  - higher-frequency worker cadence is now a hosting-plan limitation, not a missing code path
- [x] Added V2-facing lesson generation and module import surfaces:
  - new route: `/api/admin/v2/generate/lesson`
  - new route: `/api/admin/v2/import-lesson-draft`
  - new V2-owned module planner route family under `/api/admin/v2/module/*`
  - new pages: `/v2/generate` and `/v2/admin/module`
  - V2 module planner now runs through V2-owned routes and auto-saves generated blueprint lessons into V2 draft versions
  - V2 admin now links directly to the manual lesson generator and module planner
- [x] Fixed V2 module-to-lesson code normalization:
  - module planner biology IDs like `BIO-1-1A` now normalize to V2 lesson codes like `BIO-101-1A` before draft persistence
- [x] Rebuilt and published the first thin Phase 1 biology lesson:
  - generated `BIO-101-1A` through the V2 lesson-generation path
  - produced a 12-block published lesson version with score `92`
  - synced `18` question versions on publish and retired `3`
  - verified the published record in `v2_lesson_versions` is version `2` with status `published`
- [x] Added reusable CLI helpers for direct V2 content operations:
  - `scripts/generateV2LessonDraft.ts`
  - `scripts/publishV2LessonVersion.ts`
- [x] Tightened V2 internal architecture boundaries:
  - added `src/lib/v2/generation/service.ts` as the V2-owned lesson-generation adapter
  - added `src/lib/v2/modulePlanner/service.ts` as the V2-owned module-planner adapter
  - removed direct legacy generation/module-planner imports from V2 route files
  - added `src/lib/v2/architectureBoundary.test.ts` to enforce that boundary
- [x] Centralized V2 lesson code normalization in `src/lib/v2/lessonCode.ts`.
- [x] Improved V2 generation persistence:
  - queued and manual lesson generation now persist `quality_score` from refinement metadata when available
  - V2 lesson draft persistence now records source-specific import modes (`manual_draft_import`, `queued_generation_job`, `module_planner_import`)
- [x] Added reproducible Phase 1 content-replacement tooling:
  - lesson prompt/profile map: `src/data/v2/gcse/biology/phase1LessonProfiles.ts`
  - shared CLI workflow helper: `scripts/lib/v2ContentWorkflow.ts`
  - batch rebuild: `scripts/rebuildV2Phase1Lessons.ts`
  - validation pass: `scripts/validateV2Phase1Lessons.ts`
- [x] Replaced the remaining six thin Phase 1 biology lessons through the V2 pipeline on 2026-03-10:
  - `BIO-101-1B` published as version `2` with score `98`
  - `BIO-102-1A` published as version `2` with score `96`
  - `BIO-102-1B` published as version `2` with score `94`
  - `BIO-103-1A` published as version `2` with score `96`
  - `BIO-103-1B` published as version `2` with score `96`
  - `BIO-104-1A` published as version `5` with score `96`
- [x] Verified Phase 1 target-set content quality after replacement:
  - all 7 target lessons now have published current versions
  - all 7 pass the publish gate on validation
  - question coverage now sits at `17-18` published questions per lesson
- [x] Re-ran deployed V2 smoke after the richer content replacement:
  - `E2E_BASE_URL=https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app npm run test:e2e:v2`
  - `5 passed`
- [x] Added automated Phase 1 signoff verification:
  - new script: `scripts/verifyV2Phase1Signoff.ts`
  - writes: `reports/rebuild_v2/phase1_signoff_report.json`
  - verifies exact 7-lesson published Biology set, publish-gate readiness, question coverage, V2 runtime table usage for the E2E learner, audit evidence, and a temporary lesson-version workflow exercise
- [x] Added deployed-browser signoff coverage:
  - new Playwright spec: `tests/e2e/v2-phase1-signoff.spec.ts`
  - verifies `/v2/learn` exact lesson set, richer lesson rendering, authenticated split-surface `404`s, and admin user drilldown timeline loading
- [x] Resolved the local build instability uncovered during signoff:
  - moved heavy static simulation repos out of `src/app/simulations` into `src/simulations`
  - added `src/lib/simulations/paths.ts` and repointed the simulation route/admin clone flow to the new filesystem root
  - cleared stale `.next` output
  - `npm run build` is passing again on 2026-03-10
- [x] Improved V2 question moderation throughput:
  - extracted shared question-transition logic to `src/lib/v2/questions/transition.ts`
  - added bulk moderation API: `/api/admin/v2/question-versions/bulk-status`
  - `/v2/admin` now supports bulk filtered transitions for question versions:
    - submit all drafts
    - approve all filtered review items
    - publish all filtered approved items
  - focused tests passed:
    - `src/app/api/admin/v2/question-versions/status/route.test.ts`
    - `src/app/api/admin/v2/question-versions/bulk-status/route.test.ts`
  - production build passed after a clean `.next` rebuild

## 5. Guardrails (Must Hold)

- Do not import legacy lesson content into V2 runtime paths.
- Do not add V1 fallback logic inside V2 pages/APIs.
- Keep V2 data contracts in `v2_*` tables only.
- Keep V1 accessible only through explicit V1 route/deploy.

## 6. Immediate Next Build Slice

1. Continue moderation throughput improvements now that all Phase 1 biology lessons are on richer generated content and quality scores persist automatically.
2. Tighten question-generation workflow maturity and operator speed beyond the new bulk moderation controls without weakening publish gates.
3. Decide whether to upgrade V2 hosting or move queue execution off Vercel cron if sub-daily generation cadence is required.
4. Decide whether to record stronger historical authorship/source provenance for seeded/generated V2 content.
