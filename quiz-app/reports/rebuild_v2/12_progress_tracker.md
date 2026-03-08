# Rebuild V2 Progress Tracker

Last updated: 2026-03-08
Owner: Carpe + Codex
Scope: V2 rebuild only (no V1 reuse)

## 1. Current Position

V2 is established as a separate architecture baseline (schema + core APIs), with isolated learner and admin routes in place.
V2 now has a minimal end-to-end content workflow (draft/review/approve/publish) plus a Phase 1 generation-job skeleton.

## 2. Completed

### 2.1 Architecture and planning
- [x] V2 rebuild documentation set created (`00` to `11`).
- [x] Decision direction set: V2 is a clean architecture, not a refactor of V1.
- [x] Constraint confirmed: no V1 fallback/content reuse for V2 runtime.

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

## 3. In Progress

### 3.1 V2 learner frontend
- [~] Improve V2 lesson block rendering quality/completeness beyond basic text rendering.
- [x] Build V2 learner quiz page and wire submit flow to V2 runtime endpoint.

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

### 4.2 V2 operations and admin
- [x] V2 admin content workflow UI (draft -> review -> approved -> published).
- [x] V2 analytics dashboard UX for learning/behavior/operations outcomes (in `/admin/users`).
- [x] V2 analytics dashboard cards/table in `/v2/admin` backed by V2-only metrics.
- [~] V2 generation worker endpoint now exists (`run-queued`) but still needs scheduler wiring/ops hardening.
- [~] V2 generation worker endpoint now exists (`run-queued`) and daily Vercel cron wiring is in place; needs production frequency upgrade/ops hardening.
- [x] V2 generation runner now calls the shared lesson generation engine (Phase 1-9 path via `FileGenerator`) with context-aware request shaping from latest lesson version metadata/content.

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
- [x] Verified test/build status after hardening:
  - `45 passed / 45 files` (`173 passed` tests)
  - production build successful
- [x] Deployed reliability + publish-gate slice to V2 production URL:
  - `https://quiz-app-v2-hed1tepsg-carpentersbugs-projects.vercel.app`

## 5. Guardrails (Must Hold)

- Do not import legacy lesson content into V2 runtime paths.
- Do not add V1 fallback logic inside V2 pages/APIs.
- Keep V2 data contracts in `v2_*` tables only.
- Keep V1 accessible only through explicit V1 route/deploy.

## 6. Immediate Next Build Slice

1. Expand V2-native biology lesson inventory for demo breadth and publish pipeline QA.
2. Run Phase 1 release checklist and sign off go/no-go criteria.
3. Add proactive notifications (email/webhook) for retry exhaustion and failure spikes.
4. Add richer moderation filters/export (by reviewer, decision type, lesson code, date range).
