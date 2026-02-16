# C&G 2365 Quiz App - Current Implementation Documentation

Last verified: 2026-02-16
Status: Active implementation reference
Scope: Current code behavior only (not roadmap)

---

## 1. Purpose

This app is a Next.js learning platform for C&G 2365 content with:
- lesson delivery
- cumulative and diagnostic quiz flows
- learner progress and mastery tracking
- AI lesson and quiz generation pipelines
- admin microbreak game generation and insertion
- module-level planning/generation via Module Planner vNext
- optional Supabase auth + server-side progress APIs

This document reflects the code currently in `src/`.

---

## 2. Tech Stack

From `package.json`:
- Next.js: `15.5.7`
- React / React DOM: `19.1.2`
- TypeScript: `^5`
- Tailwind CSS: `^4`
- LLM SDKs:
  - `@google/generative-ai ^0.24.1`
  - `@google-cloud/vertexai ^1.4.0`
- Auth/storage:
  - `@supabase/supabase-js ^2.49.1`
- UI/utilities:
  - `canvas-confetti`
  - `lucide-react`
  - `uuid`
- Test runner: `vitest`

---

## 3. App Surface

### Pages

Implemented `page.tsx` routes:
- `/`
- `/learn`
- `/learn/[lessonId]`
- `/learn/[lessonId]/quiz`
- `/quiz`
- `/quiz/interleaved/[quizId]`
- `/generate`
- `/generate-quiz`
- `/admin/module`
- `/admin/generate-games`
- `/auth/sign-in`
- `/auth/callback`
- `/electron-simulation`
- `/test-generation`

### API routes

Implemented `route.ts` endpoints:
- `/api/lesson-generator`
- `/api/generate-quiz`
- `/api/admin/generate-games`
- `/api/admin/module/runs`
- `/api/admin/module/runs/:id`
- `/api/admin/module/syllabus/populate`
- `/api/admin/module/:id/m0-distill`
- `/api/admin/module/:id/m1-analyze`
- `/api/admin/module/:id/m2-coverage`
- `/api/admin/module/:id/m3-plan`
- `/api/admin/module/:id/m4-blueprints`
- `/api/admin/module/:id/m5-validate`
- `/api/admin/module/:id/m6-generate` (bulk mode, gated)
- `/api/admin/module/:id/lessons/:blueprintId/generate`
- `/api/syllabus/upload`
- `/api/v1/attempts`
- `/api/v1/progress/lesson-start`
- `/api/v1/progress/lesson-complete`
- `/api/v1/progress/lesson/:lessonId`
- `/api/v1/review/wrong-items`
- `/api/lessons`
- `/api/lessons-status`
- `/api/delete-lesson`
- `/api/improve-lesson` (disabled, returns HTTP 501)
- `/api/tutor`
- `/api/chat`
- `/api/marking`
- `/api/score-lesson`
- `/api/diagnostic-analysis`
- `/api/questions/variant`
- `/api/upload-image`

---

## 4. Content Corpus

Current local corpus in repo:
- Lesson JSON files in `src/data/lessons`: 44
- Quiz/question source files (`*Questions.ts`) in `src/data/questions`: 49
- Available lesson index entries (`available: true`) in `src/data/lessons/lessonIndex.ts`: 43

---

## 5. Learning Runtime

### Lesson index (`/learn`)

- The page imports lesson JSON files statically and builds `RAW_LESSONS`.
- Duplicate lesson IDs are removed at runtime with dedupe logic.
- Lessons are naturally sorted by parsed lesson ID (unit, lesson number, suffix).
- Unit cards currently render for 201, 202, 203, 204, and 210 when data exists.
- `ReviewDashboard` is shown above lesson cards.
- Lesson badges and CTA state are driven by quiz mastery progress.

### Dynamic lesson page (`/learn/[lessonId]`)

- Lesson registry is static in `src/app/learn/[lessonId]/page.tsx`.
- Layout mapping:
  - `split-vis` -> `LayoutA`
  - all other layout values -> `LayoutB`
- If `lesson.diagnostic?.enabled` is true, content is wrapped in `DiagnosticGate`.

### Diagnostic gate behavior

- Diagnostic is a soft gate, not a hard lock.
- Uses `getDiagnosticQuestions(lessonId)` and pass threshold from lesson config.
- Pass state is persisted and checked through diagnostic service helpers.
- On fail, learner can still proceed via "proceed anyway".

### Quiz behavior

Lesson quiz page (`/learn/[lessonId]/quiz`) configures `Quiz` with:
- `enableConfidence=true`
- `enableImmediateFeedback=true`
- `enableTypedRetries=true`
- `context="lesson"`

`Quiz` component behavior includes:
- randomized question count selection
- option shuffling per question
- confidence capture per answer
- immediate correctness feedback mode
- misconception surfacing when mappings exist
- typed retry section for wrong answers
- per-question attempt writes to IndexedDB (`saveAttempt`)
- needs-review priority updates in IndexedDB (`updateNeedsReview`)
- optional authenticated attempt/progress writes via `/api/v1/*`

---

## 6. Progress and Mastery

Progress is local-first, with optional server-side auth progress.

### Local progress

- Main local key: `cg2365-learning-progress`
- Service: `src/lib/progress/progressService.ts`
- Migration/version support via `migrationService`
- IndexedDB database: `quizTracking` with `attempts` and `needsReview` stores

### Mastery model

- First successful pass sets `masteryPending = true`
- Review/retest is scheduled (`nextReviewAt`)
- Later pass confirms `masteryAchieved = true`
- Failure during pending window resets pending mastery

### Optional server-side auth progress (`AUTH_PROGRESS_ENABLED=true`)

Protected endpoints under `/api/v1/*` support:
- attempt logging (`/api/v1/attempts`)
- lesson start/complete progress (`/api/v1/progress/*`)
- wrong-item review queue (`/api/v1/review/wrong-items`)

---

## 7. Microbreak System

### Block model

`microbreak` is a first-class lesson block type.

Supported game types:
- `matching`
- `sorting`
- `spot-error`
- `tap-label`
- `quick-win`

### Runtime

`MicrobreakBlock` routes to game/rest components by `content.breakType` and `content.gameType`.

Telemetry (local storage key `microbreak-telemetry`) records lesson/break identifiers, type, timestamps, and optional score/accuracy fields.

---

## 8. Lesson Generation Pipeline

### `/api/lesson-generator`

High-level flow:
1. Validate environment
2. Apply rate limit (`5` requests/hour per identifier)
3. Generate lesson (`FileGenerator` + `SequentialLessonGenerator`)
4. Validate lesson (`ValidationService`)
5. Generate quiz (target 50 questions)
6. Validate quiz
7. Write files
8. Integrate index/registry files
9. Optional git commit/push

### Sequential pipeline internals

Core orchestrator: `SequentialLessonGenerator`

Generation phases:
1. Planning
2. Vocabulary
3. Explanation
4. Understanding checks
5. Worked example (conditional)
6. Practice
7. Integration
8. Spaced review
9. Assembly

Refinement/scoring path:
- Phase 10: score (`Phase10_Score`)
- Phase 12: full-lesson refine (`Phase12_Refine`)
- Phase 13: rescore/compare (`Phase13_Rescore`)

Current acceptance behavior:
- accept candidate if total score improves
- also accept tie when candidate has fewer issues
- otherwise keep original

Blueprint enforcement now exists in `/api/lesson-generator`:
- pre-generation contract validation for `masterLessonBlueprint`
- post-generation lesson-vs-blueprint validation
- returns HTTP 400 on contract violations

### Improve endpoint status

`/api/improve-lesson` remains disabled and returns HTTP 501.

---

## 9. Module Planner vNext (`/admin/module`)

Module planner is syllabus-versioned and DB-backed.

### Operator flow (default UI path)

1. Open `/admin/module`
2. Supply admin token if `MODULE_PLANNER_ADMIN_TOKEN` is configured
3. Populate legacy syllabus or upload new syllabus (`PDF`, `DOCX`, `TXT`)
4. Select `Syllabus Version`
5. Select `Unit`
6. Optional manual LO override (otherwise unit-default LOs)
7. Enter `Chat Transcript`
8. Optional `Notes`
9. Set constraints:
- `Max lessons / LO`
- `Max ACs/Lesson (hard)`
- `Preferred ACs/Lesson (soft)`
- `Ordering` (`foundation-first` or `lo-order`)
- `Level`
- `Audience`
10. Click `Create Run`
11. Run planning stages (`M0`..`M5`) via buttons or "Plan lessons (M0-M5)"
12. Generate lessons from matrix using per-blueprint `Generate now`

### Key runtime details

- `syllabusVersionId` is required in create/distill flow.
- Request hash includes normalized transcript, request payload, and syllabus content hash.
- Replay reuses artifacts by `(request_hash, stage)`.
- M3 planning is LLM-driven with one automatic repair attempt.
- No deterministic auto-plan fallback exists when M3 LLM fails.
- M4 stores extended artifact metadata (`loBlueprintSets`, LO ledgers, lesson ledger deltas).
- M5 includes duplicate-prior-LO-content checks.
- M6 bulk endpoint exists but is disabled unless `MODULE_PLANNER_BULK_M6_ENABLED=true`.
- Default generation flow is per-lesson: `/api/admin/module/:id/lessons/:blueprintId/generate`.

### Persistence/runtime

- Supabase tables are primary persistence (`module_runs`, `module_run_artifacts`, `generated_lessons`, `syllabus_*`).
- In tests (or `MODULE_PLANNER_DB_MODE=memory`), an in-memory fallback store is used.
- Legacy `src/lib/syllabus/chunks.json` is now bootstrap-only (populate seed), not the primary planner truth source.

Detailed contracts are in `reports/app_des/module_planner.md` and `reports/app_des/module_planner_technical_doc.md`.

---

## 10. Sign-In and Auth Tracking

### Sign-in UI (`/auth/sign-in`)

- Magic-link email sign-in via Supabase (`signInWithOtp`)
- Shows signed-in email state
- Supports sign-out
- Redirect target is `/auth/callback?next=/learn`

### Callback UI (`/auth/callback`)

- Completes auth using `token_hash/type` or `code`
- Validates safe redirect (`next` must start with `/`)
- Redirects to `/learn` by default

No LLM prompts are used in sign-in/auth flows.

---

## 11. LLM Client Architecture

Abstraction: `src/lib/llm/client.ts`

Provider options:
- Google AI Studio
- Vertex AI

`createLLMClientWithFallback()` attempts Vertex when configured and falls back to AI Studio on init failure.

Used across tutor/chat/marking/generation pipelines.

---

## 12. Known Drift / Technical Debt

Runtime architecture for refinement is full-JSON (`Phase12_Refine`), but legacy patch-era residue remains:
- Legacy files still present (`Phase11_Suggest.ts`, `Phase12_Implement.ts`)
- Compatibility naming remains (`patchesApplied`, `-rejected-patches.json`)
- Some comments/log text still reference old patch pipeline language
- Some score-threshold log strings in generator are stale vs config values

Treat runtime imports/call paths as source of truth.

---

## 13. Quick File Map

Core learning pages:
- `src/app/learn/page.tsx`
- `src/app/learn/[lessonId]/page.tsx`
- `src/app/learn/[lessonId]/quiz/page.tsx`

Generation:
- `src/app/api/lesson-generator/route.ts`
- `src/lib/generation/fileGenerator.ts`
- `src/lib/generation/SequentialLessonGenerator.ts`
- `src/lib/generation/phases/*`

Module planner:
- `src/app/admin/module/page.tsx`
- `src/app/api/admin/module/*`
- `src/lib/module_planner/*`
- `supabase/migrations/202602140001_module_planner_vnext.sql`
- `supabase/migrations/202602140002_module_planner_ingestions.sql`

Auth + server progress:
- `src/app/auth/sign-in/page.tsx`
- `src/app/auth/callback/page.tsx`
- `src/app/api/v1/*`
- `src/lib/supabase/*`
- `src/lib/authProgress/*`

Admin microbreak generation:
- `src/app/admin/generate-games/page.tsx`
- `src/app/api/admin/generate-games/route.ts`
- `src/lib/generation/gameGenerator.ts`
- `src/components/learning/microbreaks/MicrobreakBlock.tsx`

---

This document supersedes older descriptions that treated module planner as file-DB only or M6-bulk-first.
