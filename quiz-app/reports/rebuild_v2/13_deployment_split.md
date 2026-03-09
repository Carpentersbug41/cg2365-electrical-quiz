# Deployment Split (V1 vs V2)

Last updated: 2026-03-09

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

Current deployed projects (2026-03-08):

- V1 project: `quiz-app`
  - Production URL: `https://quiz-7ermiufgo-carpentersbugs-projects.vercel.app`
- V2 project: `quiz-app-v2`
  - Production URL: `https://quiz-app-v2-fl8ifeu7c-carpentersbugs-projects.vercel.app`

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

## Cron Worker

- Configured in `vercel.json`:
  - path: `/api/admin/v2/generation-jobs/run-queued`
  - schedule: `0 3 * * *` (daily)
- Note: on Vercel Hobby, high-frequency cron (e.g. every 5 minutes) is not permitted.

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
  - `/` -> `200`
  - `/learn` -> legacy redirect then `200`
  - `/v2/learn` -> `404`
  - `/api/lessons` -> `200`
  - `/api/v2/*` -> `404`
- V2 split verification (live):
  - `/` -> `307` to `/v2`
  - `/v2` -> `200`
  - `/v2/learn` -> `200`
  - `/learn` -> `404`
  - `/api/v2/*` -> reachable
  - `/api/v1/*` -> `404`
- V1 project currently still responds with Vercel protection (`401`), so V1 boundary verification needs either protection disabled there too or authenticated Vercel access.
