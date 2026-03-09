# Tester Access Runbook (V1 + V2)

Last updated: 2026-03-08
Goal: allow controlled demo/testing access without adding insecure in-app bypass logic.

Read `progress.md` first for the current V2 state and current recommended test entrypoints.

## 1. Recommended Access Model

- Keep app auth (Supabase sign-in) unchanged.
- Use Vercel deployment protection for outer access control.
- Allow only known testers (or shared password for short demo windows).

Do not add custom middleware "admin pass" tokens for production demos.

## 2. Current Production URLs

- V1: `https://quiz-akgt5dt7u-carpentersbugs-projects.vercel.app`
- V2: `https://quiz-app-v2-hvzbal8q8-carpentersbugs-projects.vercel.app`

## 3. Vercel Settings to Apply (Dashboard)

For each project (`quiz-app`, `quiz-app-v2`):

1. Open Project -> Settings -> Deployment Protection.
2. Choose one:
   - Trusted users / team login (best).
   - Password protection (acceptable for quick external demos).
3. Keep protection on Production if you do not want public access.
4. Ensure same policy is applied consistently to both projects.

Expected result:
- Unauthenticated probes may return `401`.
- Authorized testers can load the app and then sign in normally via Supabase.

## 4. Demo User Setup

- Create two real test users in Supabase Auth:
  - learner demo user
  - admin demo user
- Grant admin role in the app data model to the admin user only.
- Verify both users can sign in on V2 URL and reach expected pages.

## 5. Validation Sequence (After Access Is Enabled)

1. V2 learner flow:
   - `/v2/learn` -> open lesson -> `/v2/quiz/[lessonId]` -> `/v2/review` -> `/v2/progress`
2. V2 admin flow:
   - `/v2/admin` -> create generation job -> run/queue -> approve/publish -> check outcomes drilldown
3. Surface split check:
   - V1 URL should show V1 surface only.
   - V2 URL should show V2 surface only.
4. Record pass/fail against:
   - `reports/rebuild_v2/14_phase1_release_checklist.md`

## 6. If You Need Faster Internal Testing

- Use local dev for unrestricted validation:
  - V1 mode: `npm run dev:v1`
  - V2 mode: `npm run dev:v2`

This avoids Vercel protection friction while preserving secure production defaults.
