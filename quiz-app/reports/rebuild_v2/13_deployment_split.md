# Deployment Split (V1 vs V2)

Last updated: 2026-03-10

## Goal

Run V1 and V2 as separate deploy surfaces so V2 demos cannot accidentally show V1 runtime/content.

Mixed mode exists only to support transition work. It should be treated as temporary operational debt, not part of the target architecture.

## Runtime Mode Flag

Use `APP_SURFACE_MODE`:

- `all`: current mixed mode for local/dev transition only; not valid as a steady-state production target.
- `v1`: blocks `/v2` and `/api/v2` surfaces.
- `v2`: allows only `/v2`, `/api/v2`, `/api/admin/v2`, and auth/static routes.

Enforced in:
- `src/middleware.ts`

## URL Map

- V1 deploy: root + legacy routes (`/learn`, `/quiz`, `/admin`, course-prefixed URLs).
- V2 deploy: `/v2/*` only.

Current deployed projects (2026-03-09):

- V1 project: `quiz-app`
  - Production URL: `https://quiz-app-coral-iota-99.vercel.app`
- V2 project: `quiz-app-v2`
  - Production URL: `https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app`

Recommended:

1. V1 domain: `legacy.<your-domain>`
2. V2 domain: `app.<your-domain>` (or `v2.<your-domain>`)

## Environment Matrix

V1 project env:

- `APP_SURFACE_MODE=v1`
- `NEXT_PUBLIC_APP_SURFACE_MODE=v1`
- V1 env keys unchanged

V2 project env:

- `APP_SURFACE_MODE=v2`
- `NEXT_PUBLIC_APP_SURFACE_MODE=v2`
- same Supabase project initially (Phase 1)
- can move to dedicated Supabase project later
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` synced
- generation/model envs synced from local `.env`/`.env.local`
- optional worker auth secret:
  - `V2_GENERATION_CRON_SECRET` or `CRON_SECRET`
- optional queue-cadence target for readiness/ops signals:
  - `V2_GENERATION_QUEUE_CADENCE_MINUTES` (defaults to `15`)

## Cron Worker

- Configured in `vercel.json`:
  - path: `/api/admin/v2/generation-jobs/run-queued`
  - schedule: `0 3 * * *` (daily)
- `V2_GENERATION_QUEUE_CADENCE_MINUTES` is now set to `1440` in the V2 project env so readiness matches the actual deployed worker cadence.
- Constraint: this project is on Vercel Hobby, and Hobby rejects cron schedules that run more than once per day. Higher worker cadence requires upgrading the V2 project plan or moving the worker off Vercel cron.

## Phase 1 Rollout Steps

1. Create V2 deployment target/project.
2. Set `APP_SURFACE_MODE=v2`.
3. Verify routes:
   - `/v2` works
   - `/learn` returns not found
   - `/api/v2/*` works
   - `/api/v1/*` returns not found
4. Keep V1 deployment with `APP_SURFACE_MODE=v1`.
5. Publish internal URL handover doc for testers.

Production rule:

- V1 production deploys should run `v1`
- V2 production deploys should run `v2`
- `all` should be limited to local/dev or explicitly time-boxed transition environments

## Verification Status

- Deployment completed successfully for both projects with the current split middleware.
- V1 split verification (live):
  - URL: `https://quiz-app-coral-iota-99.vercel.app`
  - `/learn` -> `307`
  - `/v2` -> `404`
  - `/api/v2/published-lessons` -> `404`
- V2 split verification (live):
  - URL: `https://quiz-app-v2-s2tjyoemn-carpentersbugs-projects.vercel.app`
  - `/v2` -> `200`
  - `/v2/learn` -> `200`
  - `/learn` -> `404`
  - `/api/v1/quiz-sets` -> `404`
  - `/api/v2/published-lessons` -> `401` unauthenticated (expected because runtime auth applies)
- Deployed V2 smoke re-verified on 2026-03-10 after the richer Phase 1 biology content replacement:
  - learner flow passed
  - admin generation flow passed
  - browser role management passed
