# Auth + Progress Tracking + Retest System (Evidence-Based)

As-of date: February 12, 2026.

## A) Current App Reality Check

1) Where are questions defined today?
- Mixed.
- Lesson practice/spaced-review questions are embedded in lesson JSON files under `src/data/lessons/*.json` (`blocks[].content.questions`).
- Quiz/diagnostic/cumulative MCQs are in TypeScript banks under `src/data/questions/*.ts`, aggregated via `src/data/questions.ts` and `src/data/questions/index.ts`.
- Runtime mainly does selection/shuffling/filtering, not fresh generation for learners (`src/components/Quiz.tsx`, `src/lib/questions/cumulativeQuestions.ts`, `src/lib/questions/questionFilter.ts`).

2) Do questions already have stable IDs?
- Yes, but in two different systems:
- Lesson-block questions: string IDs like `202-2A-P1`, `202-2A-C1-L1-A`, `202-2A-SR-1` (example: `src/data/lessons/202-2A-ohms-law.json`).
- Quiz bank questions: numeric IDs (`id: number`) in `Question`/`TaggedQuestion` (`src/data/questions.ts`, `src/data/questions/types.ts`, e.g. `src/data/questions/ohmsLawQuestions.ts`).
- Creation/validation:
- Lesson question ID patterns are validated in `src/lib/generation/validationService.ts` (`validateQuestionIdPattern`).
- Quiz-bank ID assignment when generating new banks uses max+1 scan in `src/lib/generation/fileGenerator.ts` (`getStartingQuestionId()`), which is not regeneration-stable.

3) Do blocks already have stable IDs (`block_id`)?
- Yes, field is `block.id` (not `block_id`) in `src/data/lessons/types.ts`.
- Observed format is lesson-prefixed slug, e.g. `202-2A-outcomes`, `202-2A-check-1`, `202-2A-practice`.
- Guarantees today:
- Prefix check enforced in validation (`src/lib/generation/validationService.ts`: block ID must start with lesson ID).
- Progress migration validates block IDs against current lesson blocks and aliases (`src/lib/progress/migrationService.ts`).
- Important nuance: there is no hard DB-level uniqueness constraint today (no DB yet), so uniqueness is convention + generation/validation discipline.

4) What is the current answer checking flow?
- MCQ quiz flow (deterministic):
- In `src/components/Quiz.tsx`, correctness is often computed client-side via `selectedAnswer === correctAnswer`.
- `/api/marking` also supports deterministic MCQ grading via `markMCQ` when `answerType='mcq'` and numeric answer (`src/app/api/marking/route.ts`, `src/lib/marking/markingService.ts`).
- Lesson practice/spaced-review flow (LLM):
- `PracticeBlock` and `SpacedReviewBlock` call `/api/marking` with `questionText` + `expectedAnswer`.
- Route uses `markConceptualQuestion` (LLM semantic grading) for non-MCQ (`src/app/api/marking/route.ts`, `src/lib/marking/llmMarkingService.ts`).
- So grading is mixed: deterministic for MCQ paths, LLM-semantic for conceptual/text paths.

5) Smallest unit of progress considered complete?
- Operationally today: lesson quiz mastery status.
- Learn page badges and gating pull `QuizProgress.masteryAchieved/masteryPending` (`src/app/learn/page.tsx`, `src/lib/progress/progressService.ts`).
- Question attempts are tracked (IndexedDB + localStorage), but not as canonical server-side completion.
- Block-level fields exist in types (`blocksCompleted`, `practiceAttempts`), but are not the primary completion unit in current UX.

6) AC/LO anchor granularity today?
- LO exists per question in MCQ bank via `learningOutcomeId` (`src/data/questions/types.ts` + question files).
- AC anchors exist in some lesson metadata (`targetAssessmentCriteria`, `metadata.syllabusAnchors`) (e.g., `src/data/lessons/204-15A-testing-overview-safe-isolation.json`).
- No universal per-question `ac_key` in runtime schemas today.

## B) Authentication (Sign-in) Decisions

7) Recommended auth approach (Supabase Auth vs NextAuth/Auth.js + Postgres vs Clerk)
- Supabase Auth
- Pros: tight integration with Postgres + RLS, single platform for auth+DB, straightforward Next.js integration.
- Cons: vendor coupling; free project count is limited.
- NextAuth/Auth.js + Postgres
- Pros: open-source, provider-agnostic, flexible ownership.
- Cons: more implementation effort (sessions, email flows, role model, policy model); ecosystem transition signal (Auth.js site now points to Better Auth direction).
- Clerk
- Pros: fastest UX and auth primitives out-of-the-box.
- Cons: production RBAC/custom permissions are paid-plan territory; extra vendor and pricing surface.

Recommended choice: Supabase Auth + Supabase Postgres.
Reason: this repo currently has no auth, no DB, no ORM; fastest secure path is integrated auth + SQL + RLS with least custom plumbing.

8) Roles needed and enforcement location?
- Yes, minimum roles should be `student` and `admin` now; `parent` can be added as a later role.
- Enforce data access in Postgres RLS (source of truth).
- Use app middleware only for route UX gating (e.g., admin pages), not as sole security.

9) Under-18 handling needed?
- Yes, given school-age audience.
- Minimum flags to store:
- `is_under_18` (bool) or `age_band` enum (preferred over DOB).
- `guardian_consent_required` (bool).
- `guardian_consent_at` (timestamp, nullable).
- `consent_version` (text).
- Avoid storing full DOB unless legally required.

## C) Database Choice (Free Tier + SQL)

10) Free database provider to use?
- Supabase Postgres.
- Rationale: best match with chosen auth model + native RLS + SQL migrations.

11) Separate Dev/Test/Prod databases?
- Yes, required.
- Practical setup:
- `prod`: hosted Supabase project.
- `dev`: separate hosted Supabase project.
- `test`: ephemeral DB (local Supabase/Postgres in CI) unless paid plan is used for a third hosted project.
- Constraint: Supabase free plan currently allows 2 active projects.

12) Migration tool and current repo state?
- Current repo has no Prisma/Drizzle migration stack.
- Recommended: Supabase SQL migrations (`supabase/migrations/*.sql`) via Supabase CLI.
- Keep ORM optional initially; add typed query layer later if needed.

## D) Data Model (What We Must Store)

13) Minimal schema proposal
- `users`:
- Use `auth.users` (Supabase managed) as canonical auth table.
- Add `public.profiles` (`user_id` PK FK to `auth.users.id`, `display_name`, `course_id`, `timezone`, `role`, under-18 consent flags, timestamps).
- `lesson_progress`:
- `id`, `user_id`, `lesson_id`, `status`, `mastery_status`, `score_best`, `attempts_count`, `started_at`, `last_activity_at`, `completed_at`, `updated_at`.
- Unique (`user_id`, `lesson_id`).
- `question_attempts`:
- `id`, `user_id`, `lesson_id`, `block_id`, `question_id`, `correct`, `user_answer`, `grading_key_ref`, `expected_answer_snapshot`, `attempt_number`, `response_time_ms`, `ac_key`, `grading_mode`, `created_at`.
- Indexes on (`user_id`, `created_at`), (`user_id`, `lesson_id`), (`user_id`, `question_id`), (`user_id`, `ac_key`).
- Optional `user_ac_mastery`:
- `id`, `user_id`, `ac_key`, `mastery_score`, `attempts_total`, `correct_total`, `last_attempt_at`, `next_review_at`, `updated_at`.
- Unique (`user_id`, `ac_key`).

14) `question_attempts` exact fields to store
- Confirmed baseline fields (all):
- `user_id`
- `lesson_id`
- `block_id`
- `question_id` (stable key)
- `correct` (bool)
- `user_answer` (raw)
- `attempt_number`
- `response_time_ms`
- `created_at`
- For expected answer data:
- Store `grading_key_ref` as primary reference.
- Optionally store `expected_answer_snapshot` (nullable) for audit/debug reproducibility.

15) Guaranteeing `question_id` stability across regenerated lessons
- Current reality:
- Lesson block question IDs are semi-stable by pattern (e.g., `lessonId-P1`), but regeneration can still alter IDs/order.
- Quiz bank numeric IDs are not stable across regeneration (`getStartingQuestionId()` max+1 behavior).
- Strategy:
- Introduce canonical `question_stable_key` and treat it as identity in DB.
- For lesson questions: use current string ID as stable key.
- For MCQ banks: add deterministic stable key (e.g., hash of normalized prompt + LO + source lesson).
- Add mapping table for historical aliasing when IDs change (`old_question_id -> stable_key/new_question_id`).

## E) Linking Attempts to Syllabus Anchors (AC/LO)

16) Where should `ac_key` live?
- Target state: per question.
- Also denormalize `ac_key` onto `question_attempts` at write time for fast analytics.

17) Fallback if per-question AC is not immediately available
- Phase-1 fallback: block-level or lesson-level mapping.
- Use `lesson.targetAssessmentCriteria` / `metadata.syllabusAnchors` to assign provisional AC tags.
- Mark provenance (`ac_source = question|block|lesson_fallback`) so confidence is explicit.

## F) Retesting / Review Queue

18) Retest selection algorithm
- Candidate pool = questions meeting any:
- last attempt incorrect
- `next_review_at <= now` (spaced schedule due)
- weak AC mastery
- Priority score (descending):
- incorrect last attempt (high weight)
- wrong streak count
- overdue days
- inverse AC mastery
- low-confidence-correct bonus
- Build quiz with mix:
- ~60% recent incorrect
- ~30% weakest ACs
- ~10% low-confidence reinforcement

19) Where should review queue be stored?
- Use explicit server table `review_queue` (recommended).
- Reason: deterministic scheduling, fast query for "what to show now", lower runtime aggregation cost.
- Keep a recompute fallback from `question_attempts` for resiliency.

20) Where in UX do retests occur?
- Both.
- End-of-session: immediate wrong-item retry/review.
- Gateway: delayed mastery retest before final mastery confirmation / progression.

## G) Bespoke Remediation Lessons

21) Confirm frozen pipeline prompts?
- Confirmed: do not rewrite Phase prompts/pipeline behavior.
- Keep remediation additive and external to core phase prompt logic.

22) Safe remediation generation approach feasibility
- Feasible.
- Build remediation blueprint from weak ACs + misconception clusters.
- Feed blueprint through existing generator inputs (`mustHaveTopics`, `additionalInstructions`, constrained scope) without editing phase internals.

23) Remediation trigger rules
- Trigger when all are true:
- `mastery_score < threshold` (e.g., < 0.70) for an AC or lesson
- minimum attempts reached (e.g., >= 3)
- persisted weakness across sessions (not just one bad run)
- Optional cooldown to prevent remediation spam.

## H) Privacy, Security, and Cost

24) Minimal sign-up profile fields
- `email` (from auth provider)
- `display_name` (optional)
- `course_id`
- `timezone`
- `role`
- (if needed) under-18 consent flags above
- Confirmed direction: do not collect unnecessary demographic fields.

25) Encryption / PII handling
- Provider-managed encryption at rest + TLS in transit.
- Strict RLS on all learner data tables keyed by authenticated user ID.
- Minimize PII in logs; avoid exposing raw answers in analytics logs unless needed.

26) Free-tier limits + avoiding cost spikes
- As-of February 12, 2026:
- Supabase Free: 2 active projects, 500 MB DB, 5 GB egress, 1 GB storage, 50k monthly auth users, 500k edge function invocations/month.
- Neon Launch: 10 projects, 0.5 GB storage, 100 compute hours/month, 190 autoscaling compute hours/month, 10 GB transfer, Auth up to 10k MAU.
- Clerk Free: up to 10k MAU; production RBAC/custom permissions are paid-plan only.
- Cost-spike controls:
- Rate-limit attempt/marking endpoints.
- Keep MCQ deterministic; only use LLM grading where needed.
- Retention policy: age out raw answer payloads after a fixed window, keep aggregates.
- Add quota alarms + daily usage dashboard.

## I) Implementation Plan + Non-Regression

27) Phased implementation plan
- Step 1: Auth + DB foundation
- Supabase auth, profiles table, RLS, migrations, middleware gate.
- Step 2: Log attempts
- Add server attempt-write API; wire `Quiz`, `PracticeBlock`, `SpacedReviewBlock`.
- Step 3: Progress tracking
- Server `lesson_progress` updates and mastery transitions.
- Step 4: Review/retest
- Add `review_queue` and wrong-items endpoint + dashboard wiring.
- Step 5: Remediation
- AC mastery rollups, remediation trigger service, blueprint-driven lesson generation.

28) Regression policy
- Confirmed policy:
- No behavioral changes to existing lesson generation pipeline.
- New tracking features behind feature flags.
- Add tests for all new tracking/progress endpoints and RLS policies.

29) New code paths and no-touch areas
- Planned new code locations:
- `supabase/migrations/*`
- `src/lib/supabase/*` (client/server helpers)
- `src/lib/auth/*` (role helpers)
- `src/lib/progress_server/*` (server progress logic)
- `src/app/api/v1/attempts/route.ts`
- `src/app/api/v1/progress/*`
- `src/app/api/v1/review/*`
- `src/middleware.ts`
- Tests under `src/tests/*` (and/or `src/lib/*/__tests__`)
- No-touch areas:
- `src/lib/generation/**` phase behavior/prompt contracts
- `src/lib/module_planner/**` unless explicitly scoped
- Core generated lesson/question content pipeline behavior

## J) Demos / Proof

30) Minimal demo endpoint + ETA + file changes
- Demo endpoint:
- `POST /api/v1/demo/progress-smoke`
- Requires authenticated user session.
- Accepts `lesson_id` + 3 attempts payload.
- Performs:
- ensure profile exists
- mark lesson complete in `lesson_progress`
- insert 3 `question_attempts`
- return wrong-item list for that user (`correct = false`, most recent first)
- ETA:
- 3 working days from kickoff for this demo slice end-to-end.
- If started immediately on February 12, 2026, target delivery is Tuesday, February 17, 2026.
- Expected files changed (minimal slice):
- `package.json`
- `.env.example`
- `supabase/migrations/20260212_init_auth_progress.sql`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/auth/roles.ts`
- `src/app/api/v1/demo/progress-smoke/route.ts`
- `src/app/api/v1/review/wrong-items/route.ts`
- `src/middleware.ts`
- `src/tests/api/progress-smoke.test.ts`

## External References (Pricing/Auth, checked February 12, 2026)

- Supabase pricing/limits docs: https://supabase.com/docs/guides/platform/manage-your-usage
- Supabase pricing page: https://supabase.com/pricing
- Neon pricing page: https://neon.com/pricing
- Clerk pricing page: https://clerk.com/pricing
- Clerk RBAC availability note: https://clerk.com/docs/references/nextjs/clerk-middleware
- Auth.js homepage note (project direction): https://authjs.dev/
