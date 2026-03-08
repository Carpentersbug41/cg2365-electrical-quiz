# New Lesson Runtime Telemetry Spec

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Draft implementation spec

## 1. Purpose

This document defines the telemetry required for the new staged lesson runtime.

The goal is not generic analytics. The goal is to infer, from observed behaviour alone:
- when learners leave
- what they likely learned
- when fatigue starts
- what kinds of messages they send
- which lesson patterns improve completion and learning
- which lesson patterns increase confusion, fatigue, or dropout

The system must not ask users to self-report these things during lessons. All key conclusions should come from behavioural data.

## 2. Product Questions

Telemetry must be sufficient to answer these questions:

1. At which chunk, turn, or interaction do learners leave?
2. Which chunks appear to produce learning, not just completion?
3. At what point does productive effort become fatigue?
4. Which tutor behaviours recover a struggling learner?
5. Which chunk lengths, tutor turn lengths, and question densities correlate with dropout?
6. Do microbreak exercises restore attention or merely interrupt flow?
7. What kinds of learner messages appear most often in each runtime state?
8. Which misconceptions recur and at which lesson points?
9. Does the conversational runtime outperform the current lesson format on retention and completion?

## 3. Design Principles

Telemetry should follow these rules:
- log behavioural events, not opinion surveys
- capture enough context to explain why an event happened
- separate raw events from derived metrics
- avoid storing unnecessary personal data
- make every logged field useful for a concrete product decision
- support both per-turn analysis and per-session analysis
- preserve replayability of a session timeline

## 4. Data Model Overview

Use four layers:

1. Raw event stream
- every important learner or system action in timestamp order

2. Turn-level records
- normalized records for tutor turn, learner turn, and exercise turn

3. Session summary records
- one record per lesson session containing derived metrics

4. Analysis views / jobs
- derived scores for fatigue, confusion, engagement, dropout risk, and learning progress

## 5. Core Entities

### 5.1 Lesson Session
A single learner attempt through one lesson runtime.

Recommended fields:
- `session_id` uuid
- `user_id` uuid nullable
- `anonymous_id` string nullable
- `lesson_id` string
- `course_prefix` string
- `curriculum` string
- `unit_id` string nullable
- `lo_id` string nullable
- `runtime_version` string
- `lesson_format` enum
  - `legacy_static`
  - `guided_chunk`
  - `guided_chunk_streamed`
- `started_at` timestamptz
- `ended_at` timestamptz nullable
- `exit_reason` enum nullable
  - `completed`
  - `nav_away`
  - `window_closed`
  - `tab_hidden_timeout`
  - `idle_timeout`
  - `error`
  - `unknown`
- `device_type` enum nullable
  - `desktop`
  - `mobile`
  - `tablet`
- `auth_state` enum
  - `anonymous`
  - `authenticated`
- `onboarding_profile_id` uuid nullable
- `initial_mastery_state` jsonb nullable
- `initial_gate_state` jsonb nullable

### 5.2 Session Event
Immutable event record for replay and analysis.

Recommended fields:
- `event_id` uuid
- `session_id` uuid
- `user_id` uuid nullable
- `event_name` string
- `event_time` timestamptz
- `lesson_id` string
- `chunk_id` string nullable
- `turn_id` string nullable
- `tutor_state` enum nullable
  - `teach`
  - `recall`
  - `repair`
  - `deeper`
  - `transition`
  - `microbreak`
  - `summary`
- `sequence_index` integer
- `payload` jsonb

### 5.3 Tutor Turn
One tutor output shown to learner.

Recommended fields:
- `turn_id` uuid
- `session_id` uuid
- `chunk_id` string
- `tutor_state` enum
- `turn_index` integer
- `prompt_template_id` string nullable
- `text_char_count` integer
- `text_word_count` integer
- `streamed` boolean
- `stream_duration_ms` integer nullable
- `stream_skipped` boolean default false
- `voice_output_used` boolean default false
- `render_started_at` timestamptz
- `render_completed_at` timestamptz nullable
- `content_tags` jsonb
  - examples: `vocab`, `example`, `hint`, `question`, `repair`, `transition`

### 5.4 Learner Turn
One learner message or exercise response.

Recommended fields:
- `learner_turn_id` uuid
- `session_id` uuid
- `turn_id` uuid nullable
- `chunk_id` string nullable
- `tutor_state` enum nullable
- `submitted_at` timestamptz
- `response_latency_ms` integer
- `input_mode` enum
  - `text`
  - `voice`
  - `exercise_click`
  - `mixed`
- `raw_text` text nullable
- `normalized_text` text nullable
- `char_count` integer nullable
- `word_count` integer nullable
- `contains_question` boolean nullable
- `contains_help_request` boolean nullable
- `contains_uncertainty` boolean nullable
- `contains_frustration_signal` boolean nullable
- `contains_off_topic_signal` boolean nullable
- `semantic_relevance_score` numeric nullable
- `classification_label` enum nullable
  - `direct_answer`
  - `partial_answer`
  - `guess`
  - `confusion`
  - `help_request`
  - `frustration`
  - `off_topic`
  - `meta_comment`
  - `disengaged_low_effort`
  - `other`
- `confidence_proxy_score` numeric nullable
- `vocab_usage_score` numeric nullable

### 5.5 Assessment / Turn Outcome
Normalized judgement of how the learner performed on the turn.

Recommended fields:
- `outcome_id` uuid
- `session_id` uuid
- `learner_turn_id` uuid
- `chunk_id` string nullable
- `question_id` string nullable
- `question_type` enum nullable
  - `recall`
  - `deeper`
  - `repair_retest`
  - `microbreak_exercise`
  - `vocab_check`
- `correctness` enum
  - `correct`
  - `partially_correct`
  - `incorrect`
  - `not_answered`
- `misconception_code` string nullable
- `repair_triggered` boolean
- `hint_used` boolean
- `hint_level` integer nullable
- `retry_count` integer default 0
- `advanced_after_turn` boolean
- `mastery_signal_delta` numeric nullable

### 5.6 Chunk Summary
One row per chunk attempt inside a session.

Recommended fields:
- `chunk_attempt_id` uuid
- `session_id` uuid
- `chunk_id` string
- `chunk_index` integer
- `chunk_type` enum
  - `teach`
  - `vocab`
  - `worked_example`
  - `recall`
  - `deeper`
  - `mixed`
- `text_word_count` integer
- `question_count` integer
- `deeper_question_present` boolean
- `microbreak_after_chunk` boolean
- `started_at` timestamptz
- `completed_at` timestamptz nullable
- `completed` boolean
- `time_in_chunk_ms` integer nullable
- `avg_response_latency_ms` integer nullable
- `correct_rate` numeric nullable
- `repair_count` integer default 0
- `hint_count` integer default 0
- `fatigue_score_at_end` numeric nullable
- `dropout_after_chunk` boolean default false

## 6. Event Taxonomy

Recommended event names:

### Session lifecycle
- `lesson_session_started`
- `lesson_session_resumed`
- `lesson_session_completed`
- `lesson_session_exited`
- `lesson_session_error`
- `tab_hidden`
- `tab_visible`
- `idle_timeout_triggered`

### Gates and entry
- `mastery_gate_seen`
- `mastery_gate_passed`
- `mastery_gate_blocked`
- `diagnostic_gate_seen`
- `diagnostic_started`
- `diagnostic_completed`
- `diagnostic_skipped`

### Chunk lifecycle
- `chunk_started`
- `chunk_render_started`
- `chunk_render_completed`
- `chunk_completed`
- `chunk_abandoned`

### Tutor events
- `tutor_turn_started`
- `tutor_turn_completed`
- `tutor_turn_replayed`
- `tutor_stream_skipped`
- `tutor_stream_speed_changed`

### Learner events
- `learner_input_started`
- `learner_message_submitted`
- `learner_message_classified`
- `learner_turn_evaluated`
- `learner_requested_help`
- `learner_used_voice_input`

### Question / repair events
- `question_presented`
- `question_answered`
- `hint_presented`
- `repair_triggered`
- `repair_completed`
- `advanced_to_next_turn`
- `advanced_to_next_chunk`

### Microbreak exercise events
- `microbreak_started`
- `microbreak_completed`
- `microbreak_skipped`
- `microbreak_failed`

## 7. Minimum Payloads By Event

### `lesson_session_started`
Payload:
- `runtime_version`
- `lesson_format`
- `entry_route`
- `device_type`
- `auth_state`
- `initial_chunk_count`
- `initial_word_budget_estimate`

### `chunk_started`
Payload:
- `chunk_id`
- `chunk_index`
- `chunk_type`
- `planned_word_count`
- `planned_question_count`
- `deeper_question_present`
- `microbreak_after_chunk`

### `tutor_turn_completed`
Payload:
- `turn_id`
- `chunk_id`
- `tutor_state`
- `text_word_count`
- `streamed`
- `stream_duration_ms`
- `content_tags`

### `learner_message_submitted`
Payload:
- `learner_turn_id`
- `chunk_id`
- `tutor_state`
- `response_latency_ms`
- `input_mode`
- `char_count`
- `word_count`
- `message_present`

### `learner_message_classified`
Payload:
- `learner_turn_id`
- `classification_label`
- `semantic_relevance_score`
- `contains_help_request`
- `contains_uncertainty`
- `contains_frustration_signal`
- `contains_off_topic_signal`
- `vocab_usage_score`

### `learner_turn_evaluated`
Payload:
- `learner_turn_id`
- `question_id`
- `question_type`
- `correctness`
- `misconception_code`
- `repair_triggered`
- `hint_used`
- `retry_count`
- `advanced_after_turn`

### `lesson_session_exited`
Payload:
- `exit_reason`
- `last_chunk_id`
- `last_chunk_index`
- `last_tutor_state`
- `session_duration_ms`
- `chunks_completed`
- `last_activity_age_ms`

## 8. Inferred States

These are not entered by users. They are computed from behaviour.

### 8.1 Engagement State
Possible values:
- `high_engagement`
- `steady_engagement`
- `fragile_engagement`
- `disengaging`

Suggested inputs:
- response latency trend
- message length trend
- semantic relevance
- turn completion rate
- inactivity gaps
- replay / pacing-control usage

### 8.2 Fatigue State
Possible values:
- `fresh`
- `mild_fatigue`
- `rising_fatigue`
- `high_fatigue`

Suggested indicators:
- latency increasing over last N turns
- word count decreasing over last N turns
- more uncertainty terms
- more hints needed
- more incorrect answers after earlier success
- more abandoned turns
- exits after long text-heavy chunks

### 8.3 Confusion State
Possible values:
- `clear`
- `partial_confusion`
- `persistent_confusion`

Suggested indicators:
- low semantic relevance
- repeated misconception code
- repeated clarification-style messages
- incorrect vocab usage
- contradictory answers across turns

### 8.4 Mastery Progress State
Possible values:
- `not_started`
- `emerging`
- `unstable`
- `secure`

Suggested indicators:
- first-attempt correctness
- successful repair then correct retest
- correct later reuse of concept or vocab
- deeper question success
- delayed review success

### 8.5 Dropout Risk State
Possible values:
- `low`
- `medium`
- `high`

Suggested indicators:
- rising fatigue
- consecutive low-effort turns
- repeated help requests without recovery
- long idle gap after tutor question
- exits historically common at same chunk pattern

## 9. Derived Metrics

### 9.1 Session-level metrics
- `session_duration_ms`
- `chunks_started`
- `chunks_completed`
- `completion_rate`
- `exit_chunk_index`
- `avg_response_latency_ms`
- `latency_slope`
- `avg_learner_word_count`
- `word_count_slope`
- `correct_rate`
- `repair_rate`
- `hint_rate`
- `off_topic_rate`
- `frustration_signal_rate`
- `uncertainty_signal_rate`
- `microbreak_completion_rate`
- `estimated_fatigue_onset_chunk`
- `estimated_dropout_trigger`
- `estimated_learning_gain`

### 9.2 Chunk-level metrics
- `chunk_completion_rate`
- `avg_time_in_chunk_ms`
- `avg_latency_in_chunk_ms`
- `correct_rate_in_chunk`
- `repair_rate_in_chunk`
- `hint_rate_in_chunk`
- `message_quality_score`
- `fatigue_delta_after_chunk`
- `dropout_after_chunk_rate`

### 9.3 Tutor-performance metrics
- `recovery_after_repair_rate`
- `advance_without_hint_rate`
- `deeper_question_success_rate`
- `vocab_reuse_success_rate`
- `post_microbreak_recovery_rate`

## 10. Proposed Inference Rules

These should start simple and improve later.

### 10.1 Estimated fatigue onset
Suggested initial heuristic:
Flag the first chunk where at least 3 of the following occur relative to the learner's earlier baseline:
- response latency rises by >= 40%
- learner word count falls by >= 35%
- uncertainty / confusion markers increase
- hint use increases
- correctness drops by >= 20 percentage points
- learner submits two consecutive low-effort turns

### 10.2 Low-effort turn
Suggested initial definition:
A turn is `low_effort` if any 2 apply:
- word count <= 3
- semantic relevance low
- contains phrases like `idk`, `dont know`, `just tell me`, `whatever`
- response latency is very short for a difficult question
- answer is generic and non-contentful

### 10.3 Recovery after repair
A learner is counted as recovered if:
- repair is triggered
- the next relevant turn is correct or partially correct
- they continue to at least one more turn after recovery

### 10.4 Likely learning signal
A chunk produces a positive learning signal if at least 2 apply:
- learner answers a recall question correctly after explanation
- learner corrects successfully after repair
- learner uses new vocab correctly later in session
- learner answers deeper question correctly
- learner passes delayed related review later

## 11. Message Classification Spec

The classification layer should tag learner messages with both a primary label and zero or more boolean flags.

Primary labels:
- `direct_answer`
- `partial_answer`
- `guess`
- `confusion`
- `help_request`
- `frustration`
- `off_topic`
- `meta_comment`
- `disengaged_low_effort`
- `other`

Boolean flags:
- `contains_uncertainty`
- `contains_help_request`
- `contains_frustration_signal`
- `contains_social_talk`
- `contains_vocabulary_use`
- `contains_self_correction`
- `contains_copy_pattern`

Suggested implementation path:
1. start with rule-based classification for obvious patterns
2. add model-based classification later
3. preserve raw text and classifier version for reprocessing

## 12. Microbreak Exercise Measurement

These are not treated as entertainment games. They are short instructional exercises used to reduce cognitive fatigue from sustained text input while preserving retrieval and discrimination.

Log for each microbreak:
- type
- position after chunk index
- time spent
- completed / skipped / failed
- correctness if applicable
- response latency
- post-exercise latency on next main turn
- post-exercise answer quality on next main turn

Key analysis questions:
- does the learner's next-turn latency improve?
- does next-turn answer quality improve?
- does dropout risk fall after the exercise?
- which exercise types best restore attention?

## 13. Retention Measurement

To estimate actual learning rather than session-only success, connect lesson telemetry to later assessment data.

Recommended links:
- lesson chunk -> end-of-lesson quiz items
- lesson chunk -> spaced review items
- lesson chunk -> future cumulative quiz items

Retention metrics:
- same-session recall success
- end-of-lesson mastery success
- next-session related question success
- delayed review success at 1 day / 3 day / 7 day intervals where possible

## 14. Privacy and Data Minimization

Record only what is needed.

Do:
- store user id or anonymous id
- store timestamps and lesson context
- store learner messages if needed for quality analysis
- classify messages for analytics

Avoid unless clearly necessary:
- storing unrelated personal profile fields
- storing full sensitive chat content beyond educational context
- logging raw audio long-term if text transcript is sufficient

Recommended safeguards:
- retention limits for raw text where appropriate
- classifier redaction pass for obvious personal data leakage
- versioned analysis jobs so old sessions can be reinterpreted without losing provenance

## 15. Suggested Database Tables

Recommended first-pass tables:
- `lesson_sessions`
- `lesson_session_events`
- `lesson_tutor_turns`
- `lesson_learner_turns`
- `lesson_turn_outcomes`
- `lesson_chunk_summaries`
- `lesson_session_summaries`

## 16. Suggested Implementation Order

### Phase 1: essential instrumentation
Implement first:
- session lifecycle events
- chunk start / complete / exit
- tutor turn length and render info
- learner message text, latency, and input mode
- correctness, misconception, repair, hints
- microbreak start / complete / skip

### Phase 2: derived metrics
Implement next:
- fatigue heuristic
- low-effort turn detection
- engagement state
- recovery after repair
- chunk-level learning signal

### Phase 3: comparative analysis
Implement after enough traffic:
- compare lesson formats
- compare chunk lengths
- compare question density
- compare microbreak timings
- compare tutor styles / prompt variants

## 17. Initial Dashboards

Build dashboards for:

1. Dropout funnel
- session start -> first chunk -> first reply -> chunk 2 -> chunk 3 -> completion

2. Chunk heatmap
- completion, repair rate, latency, fatigue onset, dropout by chunk index

3. Learner message panel
- distribution of direct answers, confusion, help requests, frustration, off-topic

4. Recovery dashboard
- repair triggered -> recovered -> advanced -> completed

5. Microbreak exercise dashboard
- exercise type vs post-exercise recovery, latency, and dropout reduction

6. Retention dashboard
- lesson runtime pattern vs delayed related assessment success

## 18. Success Criteria For Telemetry

The telemetry is good enough when it can support decisions like:
- reduce chunk length from 160 to 110 words because dropout rises sharply beyond chunk 3
- move microbreak exercises earlier because fatigue begins after the second text-heavy chunk
- replace a tutor response pattern because it produces high repair but low recovery
- reduce deeper-question frequency because it increases exits for weaker learners
- keep one runtime variant because it improves delayed retention, not just completion

## 19. Concrete Example

Example session interpretation:
- learner starts lesson
- completes chunk 1 with good recall
- chunk 2 latency rises 50%
- answers become shorter and less relevant
- hint use rises
- microbreak exercise inserted after chunk 2
- chunk 3 latency improves and correctness recovers

Inference:
- fatigue likely started in chunk 2
- microbreak exercise may have restored attention
- current chunk sequence is viable, but text load before the first exercise may be near the upper limit

## 20. Recommendation

Implement the new runtime only with this telemetry in place.

Without behavioural telemetry, the team will only know whether the new lesson experience feels better. With it, the team can determine:
- whether learners learn more
- where they fatigue
- what causes dropout
- which runtime design actually works
