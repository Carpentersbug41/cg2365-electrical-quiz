# Event and Analytics Specification

Last updated: 2026-03-06

## Principle

Analytics must be designed into V2, not added after the runtime is already built.

## Canonical Event Types

- `lesson_started`
- `lesson_completed`
- `quiz_started`
- `quiz_submitted`
- `question_attempted`
- `review_item_created`
- `review_item_due`
- `review_item_completed`
- `review_item_resolved`
- `generation_job_started`
- `generation_job_completed`
- `content_published`

## Minimum Event Payload Fields

- event id
- timestamp
- user id if applicable
- organization id
- course/program identifiers
- lesson/question identifiers
- session id
- source context
- event version

## Derived Metrics

- accuracy by learner/lesson/unit/cohort
- first-attempt vs later-attempt delta
- lesson completion
- mastery rate
- review adherence
- time to mastery
- active learners per day/week
- generation success/failure rate

## Phase 1 Institutional Metrics

- 14-day retention
- lesson completion
- mastery rate
- review adherence
- time to mastery

## Phase 1 Production Dashboard Metrics

- attempts volume and accuracy
- completion counts/rates
- mastery status counts/rates
- review due/resolved and resolution rates
- daily/weekly active users
- generation job outcomes (success/fail/retry, duration)

## Dashboards

- learner dashboard
- teacher/cohort dashboard
- operator dashboard
- executive outcomes dashboard
