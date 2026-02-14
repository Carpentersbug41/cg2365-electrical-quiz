# Sign-In + Auth Progress Tracking - Technical Documentation

Last verified: 2026-02-13
UI routes:
- `/auth/sign-in`
- `/auth/callback`

API routes:
- `/api/v1/attempts`
- `/api/v1/progress/lesson-start`
- `/api/v1/progress/lesson-complete`
- `/api/v1/progress/lesson/:lessonId`
- `/api/v1/review/wrong-items`

This document is the complete technical reference for auth and server-side progress/retest tracking.

---

## 1. Architecture and Flow

Execution flow:

1. User signs in via Supabase magic link (`/auth/sign-in`)
2. Callback finalizes session (`/auth/callback`)
3. Client telemetry helper fetches access token from Supabase session
4. Client sends `Authorization: Bearer <token>` to `/api/v1/*`
5. Server extracts token, validates user with Supabase `auth.getUser`
6. Server writes/reads `lesson_progress` and `question_attempts` with RLS

Feature gate:
- `AUTH_PROGRESS_ENABLED=true`
- Guard function: `ensureAuthProgressEnabled()` in `src/lib/authProgress/routeGuard.ts`

If disabled:
- `/api/v1/*` returns `404 { "error": "Not found" }`

---

## 2. Environment and Dependency Requirements

Required env vars:

- `AUTH_PROGRESS_ENABLED=true`
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

Required package:
- `@supabase/supabase-js`

Required migration:
- `supabase/migrations/202602120001_auth_progress_v1.sql`

---

## 3. Database Schema (Supabase SQL)

From migration `202602120001_auth_progress_v1.sql`.

## 3.1 `public.profiles`

Columns:
- `user_id uuid primary key references auth.users(id)`
- `display_name text null`
- `role text not null default 'student' check role in ('student','admin')`
- `course_id text null`
- `timezone text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## 3.2 `public.lesson_progress`

Columns:
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `lesson_id text not null`
- `status text not null check in ('started','completed','abandoned')`
- `mastery_status text not null default 'pending' check in ('pending','achieved')`
- `score_best numeric null`
- `attempts_count integer not null default 0 check attempts_count >= 0`
- `started_at timestamptz null`
- `last_activity_at timestamptz null`
- `completed_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `unique (user_id, lesson_id)`

## 3.3 `public.question_attempts`

Columns:
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `lesson_id text null`
- `block_id text null`
- `question_stable_id text not null`
- `question_type text not null check in ('mcq','short','numeric','other')`
- `correct boolean not null`
- `score numeric null`
- `user_answer text null`
- `attempt_number integer not null default 1 check attempt_number >= 1`
- `response_time_ms integer null check response_time_ms >= 0`
- `ac_key text null`
- `ac_source text not null default 'none' check in ('question','block','lesson','none')`
- `grading_mode text not null check in ('deterministic','llm')`
- `created_at timestamptz not null default now()`

Indexes:
- `idx_question_attempts_user_created_at (user_id, created_at desc)`
- `idx_question_attempts_user_lesson (user_id, lesson_id)`
- `idx_question_attempts_user_question_stable (user_id, question_stable_id)`
- `idx_question_attempts_user_ac_key (user_id, ac_key)`

---

## 4. DB Functions, Triggers, and RLS

Functions:
- `public.set_updated_at()` trigger function
- `public.handle_new_user_profile()` auto profile creation
- `public.is_admin()` helper for role checks

Triggers:
- `trg_profiles_set_updated_at`
- `trg_lesson_progress_set_updated_at`
- `on_auth_user_created` on `auth.users`

RLS enabled on:
- `public.profiles`
- `public.lesson_progress`
- `public.question_attempts`

Policies (pattern):
- select own row OR admin via `public.is_admin()`
- insert/update/delete own rows only via `auth.uid() = user_id`

---

## 5. Supabase Client/Server Layer

Config:
- `src/lib/supabase/config.ts`
- `getSupabaseConfig()` returns `url` + `anonKey` or `null`

Browser client:
- `src/lib/supabase/client.ts`
- singleton with `persistSession=true`, `autoRefreshToken=true`, `detectSessionInUrl=true`

Server client and token parsing:
- `src/lib/supabase/server.ts`
- `getBearerTokenFromRequest(request)` expects `Authorization: Bearer ...`
- `getSupabaseSessionFromRequest(request)` validates token via `client.auth.getUser(accessToken)`

Server session object:
- `accessToken`
- `user`
- `client` (supabase client with auth header)

---

## 6. Feature Gate and Route Guard

Files:
- `src/lib/authProgress/featureFlag.ts`
- `src/lib/authProgress/routeGuard.ts`

Behavior:
- `isAuthProgressEnabled()` checks `AUTH_PROGRESS_ENABLED?.toLowerCase() === 'true'`
- `ensureAuthProgressEnabled()` returns `404` JSON if disabled
- `requireSupabaseSession()` returns `401` JSON when no valid session

---

## 7. Payload Contracts and Field Semantics

From `src/lib/authProgress/types.ts`.

`AttemptPayload` fields:
- `lesson_id?: string | null`
- `block_id?: string | null`
- `question_stable_id: string`
- `question_type: 'mcq'|'short'|'numeric'|'other'`
- `correct: boolean`
- `score?: number | null`
- `user_answer?: string | null`
- `attempt_number?: number`
- `response_time_ms?: number | null`
- `ac_key?: string | null`
- `ac_source?: 'question'|'block'|'lesson'|'none'`
- `grading_mode: 'deterministic'|'llm'`

`LessonStartPayload`:
- `lessonId: string`

`LessonCompletePayload`:
- `lessonId: string`
- `score?: number`
- `masteryAchieved?: boolean`

---

## 8. API Endpoint Technical Details

## 8.1 POST `/api/v1/attempts`

File:
- `src/app/api/v1/attempts/route.ts`

Validation rules:
- requires valid JSON body
- requires `question_stable_id`, `question_type`, `correct`, `grading_mode`
- accepted `question_type`: `mcq|short|numeric|other`
- accepted `ac_source`: `question|block|lesson|none`
- accepted `grading_mode`: `deterministic|llm`

Insert row mapping:
- `question_stable_id` normalized via `normalizeQuestionStableId()`
- `attempt_number` default `1`
- `ac_source` default `'none'`

Side effect:
- calls `updateLessonProgressFromAttempt()`

Response:
```json
{ "ok": true, "id": "<uuid>" }
```

## 8.2 POST `/api/v1/progress/lesson-start`

File:
- `src/app/api/v1/progress/lesson-start/route.ts`

Payload:
```json
{ "lessonId": "202-5A" }
```

Calls:
- `upsertLessonStart(client, userId, lessonId)`

Response:
```json
{ "ok": true }
```

## 8.3 POST `/api/v1/progress/lesson-complete`

File:
- `src/app/api/v1/progress/lesson-complete/route.ts`

Payload:
```json
{
  "lessonId": "202-5A",
  "score": 0.86,
  "masteryAchieved": true
}
```

Validation:
- `lessonId` required string
- `score` optional number
- `masteryAchieved` optional boolean

Calls:
- `upsertLessonComplete(client, userId, lessonId, { score, masteryAchieved })`

Response:
```json
{ "ok": true }
```

## 8.4 GET `/api/v1/progress/lesson/:lessonId`

File:
- `src/app/api/v1/progress/lesson/[lessonId]/route.ts`

Behavior:
- reads one row from `lesson_progress` for authenticated user

Response:
```json
{ "progress": { ... } }
```

## 8.5 GET `/api/v1/review/wrong-items?limit=20`

File:
- `src/app/api/v1/review/wrong-items/route.ts`

Rules:
- `limit` default 20, max 100
- internally fetches up to `min(limit*5, 500)` recent wrong attempts
- dedupes by `question_stable_id`, newest-first

Response:
```json
{
  "items": [ ... ],
  "count": 20,
  "limit": 20
}
```

---

## 9. Progress Upsert Semantics

From `src/lib/authProgress/serverProgress.ts`.

`upsertLessonStart`:
- inserts started row if missing
- otherwise updates `last_activity_at`
- preserves `completed` status when already completed

`upsertLessonComplete`:
- inserts completed row if missing
- otherwise updates:
  - `status='completed'`
  - `mastery_status` retained as achieved once achieved
  - `score_best = max(existing, incoming)`
  - `attempts_count += 1`
  - timestamps

`updateLessonProgressFromAttempt`:
- no-op when no `lesson_id`
- upserts/updates started activity only
- does not increment `attempts_count`

---

## 10. Question Identity and AC Provenance

From `src/lib/authProgress/questionIdentity.ts`.

Stable ID helpers:
- `normalizeQuestionStableId(value)` trims string
- `getStableIdForMcqQuestion(question)` precedence:
  1. `stableId`
  2. `stable_id`
  3. `learningOutcomeId::q{id}`
  4. fallback `mcq::{sectionToken}::q{id}`

AC metadata extraction:
- `acKey` -> source `question`
- `ac_key` -> source `question`
- `learningOutcomeId` -> source `lesson`
- else -> `ac_key=null`, `ac_source='none'`

Block lesson extraction:
- `extractLessonIdFromBlockId(blockId)` parses `lessonId#...` or `^[0-9]{3}-...`

---

## 11. Client Telemetry Integration

Helper:
- `src/lib/authProgress/clientTelemetry.ts`

Mechanism:
- reads Supabase session access token from browser client
- sends authenticated requests with `Authorization: Bearer ...`
- swallows `401` and `404` to keep core UX resilient

Methods:
- `logAttempt(payload)` -> `/api/v1/attempts`
- `markLessonStarted(lessonId)` -> `/api/v1/progress/lesson-start`
- `markLessonCompleted(payload)` -> `/api/v1/progress/lesson-complete`

---

## 12. UI Components Wired to Auth Telemetry

Sign-in UIs:
- `src/app/auth/sign-in/page.tsx`
- `src/app/auth/callback/page.tsx`

Learning components emitting telemetry:
- `src/components/Quiz.tsx`
  - logs MCQ attempts (`grading_mode='deterministic'`)
  - marks lesson start at quiz start
  - marks lesson complete at submit
- `src/components/learning/blocks/PracticeBlock.tsx`
  - logs short-text attempts (`grading_mode='llm'`)
- `src/components/learning/blocks/SpacedReviewBlock.tsx`
  - logs short-text review attempts (`grading_mode='llm'`)
- `src/components/learning/layouts/LayoutA.tsx`
- `src/components/learning/layouts/LayoutB.tsx`
  - mark lesson start on lesson page load

---

## 13. Prompt Inventory

Auth/sign-in subsystem prompt status:
- No LLM prompt templates are used in sign-in/auth-progress flows.
- All logic is deterministic request handling + Supabase operations.

Related marking subsystem note:
- Practice and spaced-review blocks call `/api/marking`, which is separate from sign-in feature scope.
- Sign-in/auth docs cover auth and persistence, not marking prompt internals.

---

## 14. Security and Access Control Notes

- API access requires bearer token from Supabase session.
- RLS policies enforce per-user data isolation.
- Admin read paths rely on `public.is_admin()` and `profiles.role='admin'`.
- Server client runs with anon key plus bearer token; effective row access controlled by RLS.

---

## 15. Error and Response Semantics

Common errors:
- `404 {"error":"Not found"}` when feature disabled
- `401 {"error":"Authentication required"}` when token/session missing
- `400` for invalid JSON/payload fields
- `500` for DB errors

Sign-in page local errors:
- missing Supabase env -> user-visible message
- Supabase auth errors -> surfaced as status message

Callback page local errors:
- OTP/code/session exchange errors shown in callback UI

---

## 16. Test Coverage

Relevant tests:
- `src/app/api/v1/attempts/route.test.ts`
- `src/app/api/v1/review/wrong-items/route.test.ts`
- `src/lib/authProgress/__tests__/migration-rls.test.ts`

Coverage focus:
- auth required checks (401)
- insert flow
- wrong-item dedupe behavior
- migration RLS policy presence

---

End of technical document.
