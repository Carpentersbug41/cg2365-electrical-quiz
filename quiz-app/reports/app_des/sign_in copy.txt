# Sign-In, Auth Progress, and Review APIs - Operator Guide

Last verified: 2026-02-13
Primary routes:
- UI: `/auth/sign-in`, `/auth/callback`
- APIs: `/api/v1/*`

This document explains exactly how to use sign-in and auth-backed progress/review tracking in the current implementation.

---

## 1. What This Feature Does

When enabled, users can sign in with Supabase email magic links and the app can record progress/attempts server-side.

Capabilities:
- email magic-link sign-in
- authenticated lesson start/complete tracking
- authenticated question attempt tracking
- authenticated wrong-item review feed

Feature gate:
- `AUTH_PROGRESS_ENABLED=true`

If disabled:
- `/api/v1/*` auth-progress routes return `404` with `{ "error": "Not found" }`
- tracking logic does not execute

---

## 2. Required Environment Setup

In `.env.local` (or environment):

```env
AUTH_PROGRESS_ENABLED=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Then run:
```powershell
npm run dev
```

Database requirement:
- Supabase migration `supabase/migrations/202602120001_auth_progress_v1.sql` must be applied.

---

## 3. Sign-In UI (`/auth/sign-in`)

Interface behavior:
- Email input + `Send magic link` button
- If already signed in, page shows signed-in email and `Sign out` button
- Status messages:
  - success: "Magic link sent..."
  - missing env: "Supabase environment variables are missing."

Action flow:
1. Open `/auth/sign-in`.
2. Enter email.
3. Click `Send magic link`.
4. Open the email link.
5. Link redirects to `/auth/callback?next=/learn`.

---

## 4. Callback UI (`/auth/callback`)

Callback page behavior:
- Handles one of:
  - `token_hash` + `type` (`verifyOtp`)
  - `code` (`exchangeCodeForSession`)
  - fallback session fetch
- Validates redirect target:
  - `next` must start with `/`
  - default is `/learn`
- On success: `router.replace(next)`
- On failure: error message shown on callback page

---

## 5. Prompts/Instructions Involved

- No LLM prompts are used in sign-in/auth APIs.
- These flows are direct Supabase auth/session/database operations.
- No natural-language prompt text is required from the user beyond entering email.

---

## 6. Authenticated API Endpoints

All routes below require:
- `AUTH_PROGRESS_ENABLED=true`
- authenticated `Authorization: Bearer <access_token>` header

Important auth detail:
- server auth checks **only** bearer token header (no cookie-session fallback in API guard)

## 6.1 POST `/api/v1/attempts`

Purpose:
- write a question attempt row
- update lesson activity/start progress

Minimum payload:
```json
{
  "question_stable_id": "202-LO5-q1",
  "question_type": "mcq",
  "correct": true,
  "grading_mode": "deterministic"
}
```

Supported fields:
- `lesson_id`, `block_id`
- `score`, `user_answer`, `attempt_number`, `response_time_ms`
- `ac_key`, `ac_source` (`question|block|lesson|none`)

Validation constraints:
- `question_type`: `mcq|short|numeric|other`
- `grading_mode`: `deterministic|llm`
- `ac_source` (if provided): `question|block|lesson|none`
- invalid payload -> `400`

Response success:
```json
{ "ok": true, "id": "..." }
```

## 6.2 POST `/api/v1/progress/lesson-start`

Payload:
```json
{ "lessonId": "202-5A" }
```

Response:
```json
{ "ok": true }
```

## 6.3 POST `/api/v1/progress/lesson-complete`

Payload:
```json
{
  "lessonId": "202-5A",
  "score": 86,
  "masteryAchieved": false
}
```

Response:
```json
{ "ok": true }
```

## 6.4 GET `/api/v1/progress/lesson/:lessonId`

Response:
```json
{
  "progress": {
    "lesson_id": "202-5A",
    "status": "completed",
    "mastery_status": "pending"
  }
}
```

## 6.5 GET `/api/v1/review/wrong-items?limit=20`

Purpose:
- returns recent wrong attempts deduplicated by `question_stable_id`

Limit rules:
- default `limit=20`
- max `limit=100`
- internally fetches up to `min(limit * 5, 500)` rows before dedupe

Response shape:
```json
{
  "items": [
    {
      "question_stable_id": "...",
      "correct": false,
      "lesson_id": "..."
    }
  ],
  "count": 12,
  "limit": 20
}
```

---

## 7. How to Call APIs Manually (Example)

Get a Supabase access token from signed-in browser session, then:

```bash
curl -X POST http://localhost:3000/api/v1/attempts \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"question_stable_id":"test-q1","question_type":"mcq","correct":false,"grading_mode":"deterministic"}'
```

If token missing/invalid:
- API returns `401 Unauthorized`.

If feature flag is off:
- API returns `404 Not found`.

---

## 8. Interface and Runtime Notes

- `/auth/sign-in` always shows live signed-in status using Supabase browser client state.
- `Sign out` clears Supabase auth session.
- Callback page is transient; it auto-redirects after session completion.
- Auth tracking is additive and feature-flagged.

---

## 9. Troubleshooting

1. "Supabase environment variables are missing"
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. API returns 401
- Ensure user is signed in and `Authorization: Bearer <access_token>` is present.

3. API routes appear disabled
- Set `AUTH_PROGRESS_ENABLED=true`.

4. DB write errors
- Confirm migration `202602120001_auth_progress_v1.sql` is applied.

---

## 10. Key Source Files

- Sign-in UI: `src/app/auth/sign-in/page.tsx`
- Callback UI: `src/app/auth/callback/page.tsx`
- Guard/feature flag: `src/lib/authProgress/routeGuard.ts`, `src/lib/authProgress/featureFlag.ts`
- Supabase client helpers: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Attempt API: `src/app/api/v1/attempts/route.ts`
- Progress APIs: `src/app/api/v1/progress/*`
- Review API: `src/app/api/v1/review/wrong-items/route.ts`
- Token extraction/session guard: `src/lib/supabase/server.ts`

---

End of operator guide.
