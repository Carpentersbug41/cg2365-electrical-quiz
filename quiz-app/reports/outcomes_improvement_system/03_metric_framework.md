# Metric Framework

## Design principle

Metrics must be grouped by meaning, not by convenience.

The system should distinguish:

- learning metrics
- instructional support metrics
- operational metrics

If these are mixed together, the team will start optimizing the wrong things.

## Tier 1: Primary learning metrics

These are the metrics that matter most.
They should drive intervention decisions.

### Retention

Measures whether learning lasts after time has passed.

Core windows:

- `retention_7d_pct`
- `retention_14d_pct`
- `retention_30d_pct`

### Transfer

Measures whether learners can answer in a later or mixed context rather than only on repeated lesson items.

Core metric:

- `transfer_pct`

### Mastery

Measures whether the learner reached the lesson or LO mastery threshold.

Core metrics:

- `mastery_rate_pct`
- `time_to_mastery_days`

### Review recovery

Measures whether previously failed content is later recovered through review.

Core metric:

- `review_recovery_rate_pct`

## Tier 2: Secondary instructional metrics

These are useful, but they are not proof of durable learning by themselves.

- `first_attempt_accuracy_pct`
- `latest_attempt_accuracy_pct`
- `score_delta_pct`
- `lesson_completion_rate_pct`
- `review_resolved_rate_pct`

These help explain why Tier 1 metrics are moving.

## Tier 3: Supporting and operational metrics

These should be visible, but visually separated from learning metrics.

- `active_days`
- `attempts_total`
- `median_response_time_ms`
- `review_backlog_count`
- `active_quiz_set_count`
- `generation_jobs_total`
- `generation_failure_rate_pct`
- `content_approval_throughput`

These are useful for product operations and delivery health, not as direct evidence of learning.

## Recommended default views

### Cohort summary

Show:

- retention
- transfer
- mastery
- review recovery

Then supporting metrics underneath.

### Lesson view

This should be one of the default intervention views.

Show:

- mastery rate
- retention by window
- transfer
- completion
- review recovery

### LO view

This is the most actionable instructional lens.

Show:

- learner count
- first accuracy
- latest accuracy
- score delta
- retention
- transfer
- mastery
- risk flag

## Metrics to de-emphasize

The system should not center the product narrative on:

- raw attempt volume
- active days alone
- completion alone
- mean user percentage without weighting

These are easy to misread and easy to game.

## Decision priority

When metrics conflict, prioritize in this order:

1. Retention
2. Transfer
3. Mastery
4. Review recovery
5. Completion
6. Activity
