# Data Contract And Storage

## Principle

The system must preserve three different things:

- raw evidence
- interpreted conclusions
- product interventions

These must not be collapsed into one table or one document.

## Existing data sources in the app

Current app tables already provide much of the raw evidence:

- `question_attempts`
- `lesson_progress`
- `student_review_queue`
- `student_quiz_sets`
- `v2_attempts`
- `v2_mastery_records`
- `v2_review_items`
- `v2_daily_user_metrics`
- `v2_daily_ops_metrics`
- `profiles`

## Canonical runtime records

The implementation should normalize runtime data into canonical record shapes before metric calculation.

### CanonicalAttempt

- `user_id`
- `question_stable_id`
- `lesson_id`
- `lesson_code`
- `unit_code`
- `lo_code`
- `ac_code`
- `is_correct`
- `attempt_no`
- `attempt_at`
- `source_context`
- `response_time_ms`
- `source_version`

### CanonicalLessonProgress

- `user_id`
- `lesson_id`
- `lesson_code`
- `status`
- `mastery_status`
- `started_at`
- `completed_at`
- `achieved_at`
- `updated_at`
- `source_version`

### CanonicalReviewItem

- `user_id`
- `question_stable_id`
- `lesson_id`
- `lo_code`
- `status`
- `due_at`
- `resolved_at`
- `times_wrong`
- `times_right`
- `updated_at`
- `source_version`

## Precedence rules

- V2 beats V1 when both exist for the same logical entity.
- V1 is fallback when V2 is absent.
- Lesson records must be deduped by `user_id + lesson_id`.
- Review items must be deduped by `user_id + question_stable_id`.

## New persistence required

To support a full product-improvement loop, new tables or equivalent persisted storage are required.

### `outcomes_evidence_reviews`

Stores evidence review entries.

Fields:

- `id`
- `created_at`
- `created_by`
- `analysis_window_days`
- `scope_type` (`cohort`, `lesson`, `lo`, `feature`, `user_segment`)
- `scope_key`
- `headline`
- `evidence_summary`
- `metric_snapshot`
- `source_refs`
- `status` (`open`, `accepted`, `closed`, `superseded`)

### `outcomes_interventions`

Stores the product changes made because of evidence.

Fields:

- `id`
- `created_at`
- `created_by`
- `title`
- `hypothesis`
- `change_type` (`content`, `ux`, `review_policy`, `hint_policy`, `question_bank`, `sequencing`, `other`)
- `target_scope_type`
- `target_scope_key`
- `linked_evidence_review_id`
- `implementation_ref`
- `status` (`proposed`, `approved`, `implemented`, `monitoring`, `kept`, `revised`, `rolled_back`)
- `monitoring_start_at`
- `monitoring_end_at`

### `outcomes_intervention_results`

Stores the before/after evaluation summary for an intervention.

Fields:

- `id`
- `intervention_id`
- `created_at`
- `window_before_days`
- `window_after_days`
- `before_snapshot`
- `after_snapshot`
- `result_summary`
- `decision`
- `decision_notes`

## Source references

Every evidence review and intervention should reference:

- metrics endpoint or export used
- date window
- lesson or LO scope if applicable
- deployment or commit reference when available

## Storage guidance

- keep raw runtime evidence in normal transactional tables
- keep derived daily aggregates for efficient dashboards
- keep reviews, interventions, and intervention results in dedicated persistence
- never overwrite historical intervention results with fresh recalculations

## Data retention

The product-improvement system only works if historical data is preserved.

Required rule:

- raw evidence and intervention history are append-only except for explicit administrative correction

## Privacy and minimization

The system should store only the user identifiers needed for analysis and should avoid unnecessary personal data in narrative notes.

Recommended practice:

- use user IDs in system records
- keep free-text notes focused on product behavior, not personal commentary about learners
