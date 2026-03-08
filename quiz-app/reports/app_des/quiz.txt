# Quiz System Documentation (Current Implementation)

Last verified: 2026-03-05
Project root: `C:\Users\carpe\Desktop\hs_quiz\quiz-app`

---

## 1. Learner Quiz Surfaces

- `/quiz`: build an ad-hoc MCQ quiz from approved bank by unit/LO/level/count
- `/learn/[lessonId]/quiz`: lesson-filtered quiz with optional cumulative mode
- `/my-quizzes`: authenticated saved quiz sets with cadence + review integration
- `/quiz/interleaved/[quizId]`: predefined interleaved quiz configurations

## 2. Build/Selection APIs

- `/api/quiz/catalog`
- `/api/quiz/units/[unit_code]/los`
- `/api/quiz/build`

`/api/quiz/build` uses AC-weighted selection (`acMixing`) and approved MCQ-only output mapping for current UI.

## 3. Authenticated Quiz-Set APIs (feature flagged)

Requires `AUTH_PROGRESS_ENABLED=true` and valid Supabase session:
- `/api/v1/quiz-sets` (list/create)
- `/api/v1/quiz-sets/[setId]` (read/update/delete)
- `/api/v1/quiz-sets/[setId]/build` (assemble quiz, review-aware)
- `/api/v1/quiz-sets/[setId]/finalize` (LLM feedback report + review queue upsert)

## 4. Attempts/Progress/Review APIs

- `/api/v1/attempts`
- `/api/v1/progress/lesson-start`
- `/api/v1/progress/lesson-complete`
- `/api/v1/progress/lesson/[lessonId]`
- `/api/v1/review/queue`
- `/api/v1/review/wrong-items`

## 5. Question Operations (Admin)

`/admin/questions` + `/api/admin/questions/*` support:
- generation run orchestration
- draft review and status transitions (approve/reject/edit/restore/retire/delete)
- duplicate clustering and resolve flow
- batch quality checks

## 6. Feedback and Marking

- `/api/marking` handles marking endpoint behavior used by quiz UI
- `/api/quiz-feedback-report` and `/api/quiz-feedback-chat` support post-quiz feedback flows

## 7. Current Constraints

- learner builder currently expects MCQ output
- quiz quality depends on approved bank coverage by unit/LO/AC
- curriculum scope restrictions apply to catalog and build paths