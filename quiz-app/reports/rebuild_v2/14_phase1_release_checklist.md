# Phase 1 Release Checklist (V2 Demo)

Last updated: 2026-03-10
Owner: Carpe + Codex
Scope: V2 demo readiness only

## 1. Product Surface

- [x] `/v2/learn` shows only V2-published biology lessons.
- [x] `/v2/learn/[lessonId]` renders all required lesson blocks without fallback to V1.
- [x] `/v2/quiz/[lessonId]` submits successfully and stores attempts in V2 tables.
- [x] `/v2/review` shows due items and completion updates queue state.
- [x] `/v2/progress` reflects learner metrics after quiz/review activity.

## 2. Admin Surface

- [x] `/v2/admin` loads summary cards (learning/behavior/operations) from V2-only APIs.
- [x] Per-user drilldown loads timeline data from `/api/admin/v2/outcomes/timeseries`.
- [x] Lesson version workflow works end-to-end:
  - [x] Draft -> Needs review
  - [x] Needs review -> Approved
  - [x] Approved -> Published
  - [x] Published -> Retired/Reverted
- [x] Generation jobs can be created and manually run to produce draft lesson versions.
- [x] Audit log entries are written for generation and status transitions.

## 3. Data and Isolation Guardrails

- [x] No V1 lesson content is reachable via `/v2/*` routes.
- [x] No V2 endpoints are reachable on V1-only surface mode.
- [x] `v2_*` tables are used for V2 runtime outcomes and review flow.
- [ ] Seeded V2 biology dataset contains only new V2-authored content.
  Evidence remains partial. `reports/rebuild_v2/phase1_signoff_report.json` proves V2-published/runtime ownership, but historical authorship provenance is not currently recorded strongly enough to make this a hard automated claim.

## 4. Quality Gates

- [x] Unit/integration tests pass (`npx vitest run --silent`).
- [x] Production build passes (`npm run build`).
- [x] E2E learner/admin smoke tests pass with auto-provisioned auth test accounts (`npm run test:e2e:v2`).
- [x] Live deployed V2 E2E passes for learner flow, admin generation flow, browser role management, and Phase 1 signoff coverage (`E2E_BASE_URL=https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app npm run test:e2e:v2`).
- [x] Phase 1 biology content replacement completed and validated:
  - all 7 target lessons have current published versions
  - all 7 pass publish-gate validation
  - all 7 have published question coverage after sync
- [x] Split-route deployment checks recorded:
  - V2 production (`https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app`): `/v2` -> `200`, `/v2/learn` -> `200`, `/learn` -> `404`, `/api/v1/quiz-sets` -> `404`
  - V1 production (`https://quiz-app-coral-iota-99.vercel.app`): `/v2` -> `404`, `/api/v2/published-lessons` -> `404`
- [x] Manual authenticated browser checks recorded for split route behavior.

## 5. Deployment and Access

- [x] Separate Vercel projects deployed:
  - [x] V1: `quiz-app`
  - [x] V2: `quiz-app-v2`
- [x] Environment split flags set:
  - [x] `APP_SURFACE_MODE` (v1/v2)
  - [x] `NEXT_PUBLIC_APP_SURFACE_MODE` (v1/v2)
- [x] Confirm access method for testers (Supabase sign-in on protected Vercel deploys; no custom bypass tokens).
- [x] Publish final tester handover with URLs and sign-in steps.

## 6. Go/No-Go Criteria

Go if all are true:

- [x] V2 learner flow is functional (learn -> quiz -> review -> progress).
- [x] V2 admin flow is functional (authoring + outcomes visibility).
- [x] Split deployment prevents accidental V1/V2 cross-surface usage.
- [x] Demo users can sign in and run the full flow without manual DB intervention.

No-go if any are true:

- [ ] Any V2 learner route serves V1 content.
- [ ] Any core V2 API fails for authenticated demo user.
- [ ] Access control prevents demo users from reaching deployed surface.

## 7. Evidence Recorded On 2026-03-10

- Automated signoff report written to `reports/rebuild_v2/phase1_signoff_report.json`.
- Build blocker closed:
  - static simulation repos were moved out of `src/app/simulations` into `src/simulations`
  - local stale `.next` output was cleared
  - `npm run build` is green again on 2026-03-10
- Signoff report result:
  - exact published Biology lesson set matches the 7 Phase 1 targets
  - all 7 current published lessons pass publish-gate validation
  - all 7 have published question coverage (`17-18` questions each)
  - E2E learner runtime evidence exists in `v2_lesson_sessions`, `v2_quiz_sessions`, `v2_attempts`, and `v2_review_items`
  - temporary workflow exercise confirmed `draft -> needs_review -> approved -> published -> retired -> draft` and cleaned up after itself
- Deployed browser signoff coverage now includes:
  - `/v2/learn` exact 7-lesson list
  - representative rich lesson rendering for `BIO-101-1A`, `BIO-102-1A`, and `BIO-104-1A`
  - authenticated `/learn` -> `404` on the V2 surface
  - authenticated `/api/v1/quiz-sets` -> `404` on the V2 surface
  - admin user drilldown timeline load from `/api/admin/v2/outcomes/timeseries`
