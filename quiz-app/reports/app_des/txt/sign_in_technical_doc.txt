# Sign-In + Auth Progress Tracking - Technical Reference

Last verified: 2026-03-05

---

## 1. Core Modules

- Supabase clients: `src/lib/supabase/{client,server,admin}.ts`
- auth progress gate: `src/lib/authProgress/featureFlag.ts`
- route guards: `src/lib/authProgress/routeGuard.ts`

`ensureAuthProgressEnabled()` returns 404 when feature is off.
`requireSupabaseSession()` returns 401 when request is unauthenticated.

## 2. UI Authentication Flow

- sign-in page calls Supabase password auth methods
- callback page resolves OTP hash/code and creates session
- onboarding page calls authed interview/profile APIs and redirects when completed

## 3. Auth Progress API Set

Protected by both feature flag and session:
- `POST /api/v1/attempts`
- `POST /api/v1/progress/lesson-start`
- `POST /api/v1/progress/lesson-complete`
- `GET /api/v1/progress/lesson/[lessonId]`
- `GET /api/v1/review/queue`
- `GET /api/v1/review/wrong-items`
- quiz-set routes under `/api/v1/quiz-sets/*`

## 4. Attempt Logging Contract

`/api/v1/attempts` validates payload shape (`question_stable_id`, `question_type`, `correct`, `grading_mode`) and updates server progress/review state after insert.

## 5. Security Model

- bearer token from Supabase session is required for protected endpoints
- server routes resolve user from request-auth context
- feature flag allows safe deploys where auth progress is intentionally disabled