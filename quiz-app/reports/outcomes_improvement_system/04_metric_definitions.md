# Metric Definitions

## Rules that apply to all metrics

- Use weighted cohort metrics where weighting is appropriate.
- Same-session retries do not count as retention.
- Repeated attempts on the exact same item pool should not be treated as transfer.
- V2 data takes precedence over V1 when both describe the same logical entity.
- Missing optional tables should degrade to empty input, not system failure.

## Canonical dimensions

Every derived metric should be computed against canonical records with these dimensions where available:

- `user_id`
- `lesson_id`
- `lesson_code`
- `unit_code`
- `lo_code`
- `ac_code`
- `question_stable_id`
- `attempt_at`
- `source_context`
- `is_correct`
- `attempt_no`

## Primary metrics

### First attempt accuracy

Definition:

- percentage of unique question records answered correctly on the learner's first attempt in the analysis window

Formula:

- `first_attempt_accuracy_pct = correct_first_attempts / total_first_attempts * 100`

### Latest attempt accuracy

Definition:

- percentage of unique question records answered correctly on the latest attempt in the analysis window

Formula:

- `latest_attempt_accuracy_pct = correct_latest_attempts / total_latest_attempts * 100`

### Score delta

Definition:

- change between latest attempt accuracy and first attempt accuracy for the same learner, lesson, LO, or cohort slice

Formula:

- `score_delta_pct = latest_attempt_accuracy_pct - first_attempt_accuracy_pct`

### Lesson completion rate

Definition:

- share of started lessons that reached completed state

Formula:

- `lesson_completion_rate_pct = completed_lessons / started_lessons * 100`

### Mastery rate

Definition:

- share of deduped lesson or LO records whose mastery state is achieved

Formula:

- `mastery_rate_pct = mastered_records / total_records * 100`

### Time to mastery

Definition:

- number of days between first lesson or quiz interaction and mastery achieved

Formula:

- `time_to_mastery_days = achieved_at - first_attempt_at`

Rules:

- compute only when mastery is achieved
- report median and p75 for cohorts

### Retention

Definition:

- performance on later attempts after a delay window, excluding same-day and same-session retry behavior

Windows:

- 7 day
- 14 day
- 30 day

Formula:

- `retention_14d_pct = correct_delayed_attempts_14d / total_delayed_attempts_14d * 100`

Rules:

- attempt must occur on or after the relevant day boundary from the learner's first qualifying interaction
- qualifying interaction should normally be the first lesson completion or first scored attempt for the lesson/LO
- if there are no delayed attempts in the window, return `null`, not `0`

### Transfer

Definition:

- performance on later mixed, cumulative, interleaved, review, or otherwise non-direct-repeat contexts

Formula:

- `transfer_pct = correct_transfer_attempts / total_transfer_attempts * 100`

Accepted source contexts for initial build:

- `cumulative`
- `interleaved`
- `review`
- `mixed`
- explicit future flags for transfer-capable assessments

Rules:

- do not classify direct lesson-repeat attempts as transfer
- return `null` when transfer-classified attempts do not exist

### Review resolved rate

Definition:

- share of due review items that are resolved in the window

Formula:

- `review_resolved_rate_pct = resolved_review_items / due_review_items * 100`

### Review on-time rate

Definition:

- share of resolved review items completed on or before due date

Formula:

- `review_on_time_rate_pct = resolved_on_time_items / resolved_review_items * 100`

### Review recovery rate

Definition:

- share of previously failed items later answered correctly in a later review-capable context

Formula:

- `review_recovery_rate_pct = recovered_items / recoverable_items * 100`

Rules:

- the initial wrong attempt and later correct attempt must not be the same session event
- later attempt should be in review or delayed practice context when possible

### Review backlog

Definition:

- number of due items unresolved as of end-of-day or current timestamp

Formula:

- count of items where `due_at <= as_of_time` and `resolved_at is null or resolved_at > as_of_time`

Rules:

- do not use status-first shortcuts that can overcount backlog
- unresolved predicate is the source of truth

## Cohort metric rules

### Weighted accuracy

Definition:

- cohort accuracy must be based on total correct attempts divided by total attempts

Formula:

- `cohort_accuracy_pct = total_correct_attempts / total_attempts * 100`

Do not use:

- simple average of per-user percentages as the headline cohort metric

## Risk flag rules

### High risk

- low retention and low transfer
- or unresolved review backlog plus low mastery

### Medium risk

- improving but still below target mastery threshold
- or high completion with weak retention

### Low risk

- mastery achieved and no active review concern
