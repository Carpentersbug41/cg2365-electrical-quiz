# Sign-In, Auth Progress, and Review APIs - Operator Guide

Last verified: 2026-02-16
Primary routes:
- UI: `/auth/sign-in`, `/auth/callback`
- APIs: `/api/v1/*`

This guide explains how to use sign-in and auth-backed progress/review tracking.

---

## 1. Feature Summary

When enabled, users can sign in with Supabase email magic links and write progress server-side.

Capabilities:
- magic-link sign-in
- authenticated lesson start/complete tracking
- authenticated question-attempt logging
- authenticated wrong-item review feed

Feature gate:
- `AUTH_PROGRESS_ENABLED=true`

If disabled:
- `/api/v1/*` returns `404 { "error": "Not found" }`

---

## 2. Required Setup

Environment:
```env
AUTH_PROGRESS_ENABLED=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Database migration required:
- `supabase/migrations/202602120001_auth_progress_v1.sql`

Run app:
```powershell
npm run dev
```

---

## 3. Sign-In Flow (`/auth/sign-in`)

UI behavior:
- email input + `Send magic link`
- if already signed in, shows current email + `Sign out`
- shows inline success/error status messages

Flow:
1. open `/auth/sign-in`
2. enter email
3. click `Send magic link`
4. open email link
5. callback goes to `/auth/callback?next=/learn`

---

## 4. Callback Flow (`/auth/callback`)

Callback handles:
- `token_hash` + `type` (`verifyOtp`)
- or `code` (`exchangeCodeForSession`)
- or session fetch fallback

Redirect rule:
- `next` must start with `/`
- default redirect is `/learn`

---

## 5. Authenticated API Endpoints

All routes require:
- `AUTH_PROGRESS_ENABLED=true`
- `Authorization: Bearer <access_token>`

### POST `/api/v1/attempts`

Minimum payload:
```json
{
  "question_stable_id": "202-LO5-q1",
  "question_type": "mcq",
  "correct": true,
  "grading_mode": "deterministic"
}
```

Common optional fields:
- `lesson_id`, `block_id`
- `score`, `user_answer`, `attempt_number`, `response_time_ms`
- `ac_key`, `ac_source`

Success response:
```json
{ "ok": true, "id": "..." }
```

### POST `/api/v1/progress/lesson-start`

Payload:
```json
{ "lessonId": "202-5A" }
```

Success response:
```json
{ "ok": true }
```

### POST `/api/v1/progress/lesson-complete`

Payload:
```json
{
  "lessonId": "202-5A",
  "score": 0.86,
  "masteryAchieved": true
}
```

Success response:
```json
{ "ok": true }
```

### GET `/api/v1/progress/lesson/:lessonId`

Response:
```json
{ "progress": { ... } }
```

### GET `/api/v1/review/wrong-items?limit=20`

Behavior:
- dedupes wrong attempts by `question_stable_id` (newest-first)
- default `limit=20`, max `limit=100`

Response:
```json
{ "items": [], "count": 0, "limit": 20 }
```

---

## 6. Manual API Call Example

```bash
curl -X POST http://localhost:3000/api/v1/attempts \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"question_stable_id":"test-q1","question_type":"mcq","correct":false,"grading_mode":"deterministic"}'
```

If token is missing/invalid: `401`
If feature flag is off: `404`

---

## 7. Practical Troubleshooting

1. "Supabase environment variables are missing"
- set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. API returns 401
- ensure signed-in user and bearer token header are present

3. API returns 404
- set `AUTH_PROGRESS_ENABLED=true`

4. DB write errors
- confirm migration `202602120001_auth_progress_v1.sql` is applied

---

## 8. Key Source Files

- Sign-in page: `src/app/auth/sign-in/page.tsx`
- Callback page: `src/app/auth/callback/page.tsx`
- Feature guard: `src/lib/authProgress/routeGuard.ts`
- Browser telemetry: `src/lib/authProgress/clientTelemetry.ts`
- Attempts API: `src/app/api/v1/attempts/route.ts`
- Progress APIs: `src/app/api/v1/progress/*`
- Review API: `src/app/api/v1/review/wrong-items/route.ts`
- Supabase request auth: `src/lib/supabase/server.ts`

---

End of operator guide.
