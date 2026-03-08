# Domain Model and Schema V2

Last updated: 2026-03-06

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
