# C&G 2365 / GCSE Quiz App - Current Implementation Snapshot

Last verified: 2026-03-05
Status: Active implementation reference
Scope: What exists in code under `src/` and current runtime behavior

---

## 1. Product Scope

This Next.js app now supports three curriculum scopes selected from `/`:
- C&G 2365 (`/2365/*`)
- GCSE Science Physics (`/gcse/science/physics/*`)
- GCSE Science Biology (`/gcse/science/biology/*`)

Routing is enforced by middleware and `x-course-prefix` rewrites.

## 2. Primary Learner Surfaces

- `/learn` lesson catalog with curriculum filtering and review dashboard
- `/learn/[lessonId]` lesson runtime with `MasteryUnlockGate` and optional `DiagnosticGate`
- `/learn/[lessonId]/quiz` lesson quizzes (standard and cumulative mode)
- `/quiz` question-bank practice quiz builder (unit/LO based)
- `/my-quizzes` authenticated spaced quiz-set workflow (if auth progress enabled)
- `/onboarding` interview flow that builds personalized tutor profile context

## 3. Primary Admin Surfaces

- `/admin/module` Module Planner M0-M6 pipeline
- `/admin/questions` question generation/review/duplicates workflow
- `/admin/generate-games` microbreak game generation and save
- `/admin/simulations` simulation cloning + visual prompt workflows
- `/admin/users` user profile injections
- `/admin/prompt-profiles` global prompt injections
- `/generate`, `/generate-quiz`, `/test-generation` generator operations/debug pages

## 4. Core APIs (high level)

Key route groups under `src/app/api`:
- lesson generation + scoring: `/api/lesson-generator`, `/api/score-lesson`, `/api/improve-lesson` (disabled)
- quiz bank build/catalog: `/api/quiz/catalog`, `/api/quiz/build`, `/api/quiz/units/[unit_code]/los`
- auth progress v1: `/api/v1/attempts`, `/api/v1/progress/*`, `/api/v1/quiz-sets/*`, `/api/v1/review/*`
- tutor and feedback: `/api/tutor`, `/api/chat`, `/api/socratic/turn`, `/api/quiz-feedback-*`
- admin pipelines: `/api/admin/module/*`, `/api/admin/questions/*`, `/api/admin/generate-games`, `/api/admin/simulations/*`

## 5. Learning + Pedagogy Features Present in Runtime

- retrieval practice with immediate feedback in quiz flows
- typed retry support for wrong answers in lesson/diagnostic contexts
- cumulative quizzes to mix prior lesson material
- optional diagnostic prerequisite gate per lesson
- mastery/progress tracking (local and optional server-backed)
- review queue and wrong-item follow-up (auth mode)
- optional tutor/onboarding personalization layer

## 6. Generation Architecture (current)

Lesson generation uses `SequentialLessonGenerator`:
- phases 1-9 for lesson assembly
- phase 10 scoring
- phase 12 full-lesson refinement
- phase 13 rescore + accept/reject

Important runtime guards:
- lock file with `GENERATION_IN_PROGRESS` (`409`) for duplicate in-flight generation
- quality threshold enforcement with `QUALITY_THRESHOLD_FAIL` (`422`)
- generation score/report persisted in lesson metadata

## 7. Environment and Feature Flags

- `AUTH_PROGRESS_ENABLED` gates auth progress APIs
- `MODULE_PLANNER_ENABLED` gates module planner routes
- Supabase config required for authenticated user flows
- Gemini API key/model required for generation/scoring/game APIs

## 8. Notes

This file intentionally replaces older single-curriculum assumptions.
Refer to module-, quiz-, and auth-specific docs in this same folder for deeper contracts.