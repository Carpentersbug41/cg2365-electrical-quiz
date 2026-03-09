# Domain Model and Schema V2

Last updated: 2026-03-09

## Core Content Entities

- `organization`
- `program`
- `course`
- `unit`
- `lesson`
- `lesson_version`
- `lesson_block`
- `question`
- `question_version`
- `content_mapping`

## Learning Entities

- `enrollment`
- `lesson_session`
- `quiz_session`
- `attempt`
- `mastery_record`
- `review_item`
- `review_event`

## Generation Entities

- `generation_job`
- `generation_job_step`
- `generation_artifact`
- `generation_evaluation`
- `approval_decision`

## Reporting Entities

- `event_log`
- `daily_user_metrics`
- `daily_cohort_metrics`
- `lesson_outcome_metrics`
- `question_quality_metrics`

## Content Versioning Rules

- `lesson` is the stable logical identity
- `lesson_version` is immutable once created
- only one version is `published` at a time
- learner runtime reads published versions only
- editing creates a new draft version, never an in-place mutation

The same rule applies to `question` and `question_version`.

## Lesson Version States

V2 uses these version states for lessons:

- `draft`
- `needs_review`
- `approved`
- `published`
- `retired`

## Key Invariants

- one learner has one authoritative mastery record per lesson
- one review item represents one learner/question remediation state
- attempts are append-only
- events are append-only
- published content is immutable

## Authoritative Write Ownership

The schema must reflect domain ownership. Convenience writes across domains are not allowed.

- `curriculum-content` writes: `lesson`, `lesson_version`, `lesson_block`, `question`, `question_version`, publish-state metadata
- `learning-runtime` writes: `lesson_session`, `quiz_session`, `attempt`, `mastery_record`
- `assessment-review` writes: `review_item`, `review_event`
- `generation-jobs` writes: `generation_job`, `generation_job_step`, `generation_artifact`, `generation_evaluation`, generated draft versions via content-service entry points
- `reporting-analytics` writes: `event_log`, aggregate tables
- `admin-ops` records approvals and orchestrates transitions, but should not mutate runtime rows ad hoc

## Read Models

V2 should distinguish operational tables from runtime/admin read models.

- learner runtime reads published lesson/question versions only
- learner dashboards should prefer dedicated summary queries/materialized views over raw multi-table joins in page code
- institutional reporting should prefer canonical events and aggregates
- admin moderation surfaces may join operational data, but only through V2-owned query/service paths

## Constraints To Enforce

Schema and database functions should enforce these wherever practical:

- exactly one published lesson version per lesson
- exactly one published question version per question
- exactly one authoritative mastery record per learner/lesson
- at most one active review item per learner/question/source context
- at most one active generation job of the same type for the same target where duplicate work is unsafe
- legal state transitions only
- published rows become immutable

## State Transition Ownership

Application code must not implement state changes as informal field updates.

- publish/retire/review transitions should go through explicit service/database transition functions
- side effects from transitions must be deterministic and idempotent
- transitions should fail atomically if invariants cannot be satisfied

## Minimal First Schema

If full schema is too large for the first build, implement these first:

- `users`
- `organizations`
- `programs`
- `courses`
- `units`
- `lessons`
- `lesson_versions`
- `questions`
- `question_versions`
- `quiz_sessions`
- `attempts`
- `mastery_records`
- `review_items`
- `event_log`
- `generation_jobs`
- `generation_artifacts`

Reference:

- `18_data_invariants_and_state_machines.md`
