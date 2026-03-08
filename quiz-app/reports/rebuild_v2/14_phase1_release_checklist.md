# Phase 1 Release Checklist (V2 Demo)

Last updated: 2026-03-08
Owner: Carpe + Codex
Scope: V2 demo readiness only

## 1. Product Surface

- [ ] `/v2/learn` shows only V2-published biology lessons.
- [ ] `/v2/learn/[lessonId]` renders all required lesson blocks without fallback to V1.
- [ ] `/v2/quiz/[lessonId]` submits successfully and stores attempts in V2 tables.
- [ ] `/v2/review` shows due items and completion updates queue state.
- [ ] `/v2/progress` reflects learner metrics after quiz/review activity.

## 2. Admin Surface

- [ ] `/v2/admin` loads summary cards (learning/behavior/operations) from V2-only APIs.
- [ ] Per-user drilldown loads timeline data from `/api/admin/v2/outcomes/timeseries`.
- [ ] Lesson version workflow works end-to-end:
  - [ ] Draft -> Needs review
  - [ ] Needs review -> Approved
  - [ ] Approved -> Published
  - [ ] Published -> Retired/Reverted
- [ ] Generation jobs can be created and manually run to produce draft lesson versions.
- [ ] Audit log entries are written for generation and status transitions.

## 3. Data and Isolation Guardrails

- [ ] No V1 lesson content is reachable via `/v2/*` routes.
- [ ] No V2 endpoints are reachable on V1-only surface mode.
- [ ] `v2_*` tables are used for V2 runtime outcomes and review flow.
- [ ] Seeded V2 biology dataset contains only new V2-authored content.

## 4. Quality Gates

- [x] Unit/integration tests pass (`npx vitest run --silent`).
- [x] Production build passes (`npm run build`).
- [x] E2E learner/admin smoke tests pass with auto-provisioned auth test accounts (`npm run test:e2e:v2`).
- [ ] Manual authenticated browser checks recorded for split route behavior.

## 5. Deployment and Access

- [x] Separate Vercel projects deployed:
  - [x] V1: `quiz-app`
  - [x] V2: `quiz-app-v2`
- [x] Environment split flags set:
  - [x] `APP_SURFACE_MODE` (v1/v2)
  - [x] `NEXT_PUBLIC_APP_SURFACE_MODE` (v1/v2)
- [ ] Confirm access method for testers (auth/protection bypass if enabled).
- [ ] Publish final tester handover with URLs and sign-in steps.

## 6. Go/No-Go Criteria

Go if all are true:

- [ ] V2 learner flow is functional (learn -> quiz -> review -> progress).
- [ ] V2 admin flow is functional (authoring + outcomes visibility).
- [ ] Split deployment prevents accidental V1/V2 cross-surface usage.
- [ ] Demo users can sign in and run the full flow without manual DB intervention.

No-go if any are true:

- [ ] Any V2 learner route serves V1 content.
- [ ] Any core V2 API fails for authenticated demo user.
- [ ] Access control prevents demo users from reaching deployed surface.
