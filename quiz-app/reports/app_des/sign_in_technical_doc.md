# Sign-In + Auth Progress Tracking - Technical Documentation

Last verified: 2026-02-16
UI routes:
- `/auth/sign-in`
- `/auth/callback`

API routes:
- `/api/v1/attempts`
- `/api/v1/progress/lesson-start`
- `/api/v1/progress/lesson-complete`
- `/api/v1/progress/lesson/:lessonId`
- `/api/v1/review/wrong-items`

This document is the technical reference for auth and server-side progress tracking.

---

## 1. Architecture and Flow

1. user signs in via Supabase magic link (`/auth/sign-in`)
2. callback finalizes session (`/auth/callback`)
3. client telemetry helper reads Supabase access token from browser session
4. client sends `Authorization: Bearer <token>` to `/api/v1/*`
5. API validates bearer token via Supabase `auth.getUser`
6. API reads/writes `lesson_progress` and `question_attempts` under RLS

Feature gate:
- `AUTH_PROGRESS_ENABLED=true`

If disabled:
- `/api/v1/*` returns `404 { "error": "Not found" }`

---

## 2. Environment and Dependencies

Required env vars:
- `AUTH_PROGRESS_ENABLED=true`
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

Required package:
- `@supabase/supabase-js`

Required migration:
- `supabase/migrations/202602120001_auth_progress_v1.sql`

---

## 3. Database Schema (Migration)

From `202602120001_auth_progress_v1.sql`:

Tables:
- `public.profiles`
- `public.lesson_progress`
- `public.question_attempts`

Highlights:
- `lesson_progress` unique key: `(user_id, lesson_id)`
- `question_attempts` includes `ac_key`, `ac_source`, `grading_mode`
- RLS enabled on all three tables
- helper/trigger functions include `set_updated_at`, `handle_new_user_profile`, `is_admin`

---

## 4. Supabase Client and Session Layer

Config:
- `src/lib/supabase/config.ts`

Browser client:
- `src/lib/supabase/client.ts`
- singleton with session persistence and auto refresh

Server auth layer:
- `src/lib/supabase/server.ts`
- `getBearerTokenFromRequest(...)`
- `getSupabaseSessionFromRequest(...)`

Important:
- API auth guard currently relies on bearer token header
- no cookie-session fallback is used in auth-progress API guard

---

## 5. Feature Gate and Route Guard

Files:
- `src/lib/authProgress/featureFlag.ts`
- `src/lib/authProgress/routeGuard.ts`

Behavior:
- `ensureAuthProgressEnabled()` -> 404 when disabled
- `requireSupabaseSession()` -> 401 when missing/invalid token

---

## 6. Payload Contracts

From `src/lib/authProgress/types.ts`.

`AttemptPayload` required fields:
- `question_stable_id`
- `question_type` (`mcq|short|numeric|other`)
- `correct`
- `grading_mode` (`deterministic|llm`)

Optional fields include:
- `lesson_id`, `block_id`
- `score`, `user_answer`, `attempt_number`, `response_time_ms`
- `ac_key`, `ac_source` (`question|block|lesson|none`)

Progress payloads:
- lesson start: `{ lessonId: string }`
- lesson complete: `{ lessonId: string, score?: number, masteryAchieved?: boolean }`

---

## 7. API Endpoint Details

### POST `/api/v1/attempts`

File:
- `src/app/api/v1/attempts/route.ts`

Validation:
- requires valid JSON body
- validates required fields and enum values
- normalizes `question_stable_id`
- defaults `ac_source` to `none`

Insert target:
- `question_attempts`

Side effect:
- calls `updateLessonProgressFromAttempt(...)`

Success response:
```json
{ "ok": true, "id": "<uuid>" }
```

### POST `/api/v1/progress/lesson-start`

File:
- `src/app/api/v1/progress/lesson-start/route.ts`

Calls:
- `upsertLessonStart(...)`

Success response:
```json
{ "ok": true }
```

### POST `/api/v1/progress/lesson-complete`

File:
- `src/app/api/v1/progress/lesson-complete/route.ts`

Calls:
- `upsertLessonComplete(...)`

Success response:
```json
{ "ok": true }
```

### GET `/api/v1/progress/lesson/:lessonId`

File:
- `src/app/api/v1/progress/lesson/[lessonId]/route.ts`

Response:
```json
{ "progress": { ... } }
```

### GET `/api/v1/review/wrong-items?limit=20`

File:
- `src/app/api/v1/review/wrong-items/route.ts`

Rules:
- default limit 20
- max limit 100
- fetches up to `min(limit*5, 500)` and dedupes by `question_stable_id`

Response shape:
```json
{ "items": [], "count": 0, "limit": 20 }
```

---

## 8. Progress Upsert Semantics

From `src/lib/authProgress/serverProgress.ts`.

`upsertLessonStart`:
- inserts started row if missing
- otherwise refreshes `last_activity_at`
- preserves `completed` status if already completed

`upsertLessonComplete`:
- inserts completed row if missing
- otherwise updates to completed
- keeps `mastery_status='achieved'` once achieved
- updates best score via max(existing, incoming)
- increments `attempts_count`

`updateLessonProgressFromAttempt`:
- no-op when `lesson_id` missing
- upserts/updates started activity
- does not increment `attempts_count`

---

## 9. Client Telemetry Integration

File:
- `src/lib/authProgress/clientTelemetry.ts`

Behavior:
- reads access token from Supabase browser session
- sends bearer-auth requests to `/api/v1/*`
- swallows `401` and `404` to keep UX resilient

Methods:
- `logAttempt(payload)`
- `markLessonStarted(lessonId)`
- `markLessonCompleted(payload)`

---

## 10. UI Components Using Auth Tracking

Sign-in UIs:
- `src/app/auth/sign-in/page.tsx`
- `src/app/auth/callback/page.tsx`

Learning surfaces calling telemetry:
- `src/components/Quiz.tsx`
- `src/components/learning/blocks/PracticeBlock.tsx`
- `src/components/learning/blocks/SpacedReviewBlock.tsx`
- `src/components/learning/layouts/LayoutA.tsx`
- `src/components/learning/layouts/LayoutB.tsx`

---

## 11. Prompt Inventory

Auth subsystem prompt status:
- no LLM prompt templates are used in sign-in/auth-progress flow
- all behavior is deterministic auth/session/database logic

---

## 12. Test Coverage

Relevant tests:
- `src/app/api/v1/attempts/route.test.ts`
- `src/app/api/v1/review/wrong-items/route.test.ts`
- `src/lib/authProgress/__tests__/migration-rls.test.ts`

Coverage focus includes auth checks, payload validation, dedupe logic, and migration/RLS assertions.

---

End of technical document.
