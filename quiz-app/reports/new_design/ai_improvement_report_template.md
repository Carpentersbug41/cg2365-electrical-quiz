# AI Improvement Report Template

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Template

## 1. Purpose

This template is the standard input for each AI analysis cycle.

Use it when:
- generating a periodic product-improvement report
- passing structured runtime evidence to the LLM
- reviewing whether a runtime variant should be kept, changed, expanded, or rolled back

This template should be completed from telemetry, session summaries, lesson metadata, and relevant outcome data.

## 2. Report Metadata

- `report_id`:
- `report_period_start`:
- `report_period_end`:
- `runtime_version`:
- `variant_id`:
- `experiment_id`:
- `generated_at`:
- `generated_by`:
- `baseline_variant_id`:
- `sample_size_sessions`:
- `sample_size_learners`:
- `included_lessons`:
- `excluded_lessons`:
- `notes_on_data_quality`:

## 3. Executive Summary

Fill in:
- What appears to be working?
- What appears to be failing?
- What changed since the previous report?
- Is the current variant worth continuing?

Suggested structure:
- `top_positive_signal_1`
- `top_positive_signal_2`
- `top_risk_1`
- `top_risk_2`
- `overall_recommendation`

## 4. Runtime Summary

### 4.1 Session funnel
Include:
- sessions started
- first chunk rendered
- first learner reply
- chunk 2 reached
- chunk 3 reached
- lesson completed

### 4.2 Core metrics
Include:
- completion rate
- average chunks completed
- median session duration
- average response latency
- average learner message length
- repair rate
- recovery-after-repair rate
- microbreak completion rate
- exit rate by chunk index

### 4.3 Baseline comparison
Compare against:
- baseline runtime
- prior report period

Include:
- completion delta
- repair recovery delta
- delayed performance delta
- fatigue marker delta
- dropout delta

## 5. Chunk-Level Analysis

For each major chunk or chunk index band, include:
- `chunk_id`
- `chunk_index`
- `chunk_type`
- `chunk_word_count`
- `completion_rate`
- `dropout_after_chunk_rate`
- `avg_response_latency_ms`
- `correct_rate`
- `repair_rate`
- `fatigue_signal_rate`
- `notes`

Questions to answer:
- which chunks lose learners?
- which chunks produce high repair but good recovery?
- which chunks appear too dense?

## 6. Learner Message Analysis

Include distribution of primary message labels:
- direct_answer
- partial_answer
- guess
- confusion
- help_request
- frustration
- off_topic
- disengaged_low_effort
- other

Also include:
- uncertainty marker rate
- frustration marker rate
- low-effort turn rate
- average semantic relevance score
- vocab usage score if available

Questions to answer:
- what are learners actually doing in chat?
- are they answering, guessing, asking for help, or drifting?
- do message patterns worsen over time in-session?

## 7. Fatigue Analysis

Include:
- estimated fatigue onset chunk distribution
- fatigue marker rate by chunk index
- latency slope summary
- learner word-count slope summary
- hint-rate slope summary
- dropout after fatigue onset

Questions to answer:
- where does fatigue usually start?
- which runtime pattern seems to trigger it?
- do microbreak exercises reduce it?

## 8. Repair And Misconception Analysis

Include:
- top misconception codes
- misconception frequency by chunk
- repair trigger rate
- repair success rate
- repeat misconception recurrence rate
- dropout after repair

Questions to answer:
- which misconceptions dominate?
- which repair patterns work best?
- where are learners failing repeatedly?

## 9. Microbreak Exercise Analysis

Include:
- exercise type
- usage count
- completion rate
- skip rate
- average time spent
- post-exercise latency delta
- post-exercise correctness delta
- post-exercise dropout delta

Questions to answer:
- which exercise types restore attention?
- which are ignored or disruptive?
- is timing appropriate?

## 10. Learning Outcome Analysis

Include:
- end-of-lesson assessment performance
- related later review performance
- delayed retention comparison by chunk or lesson
- transfer-question performance if available

Questions to answer:
- is the runtime improving actual learning?
- is completion increasing without retention?
- which chunk patterns predict later success?

## 11. Variant And Experiment Analysis

For each active experiment:
- `experiment_id`
- `variant_id`
- `hypothesis`
- `change_set`
- `primary_metric`
- `secondary_metrics`
- `observed_result`
- `decision`

Possible decisions:
- keep
- expand
- refine
- roll back
- insufficient data

## 12. Notable Session Patterns

Include short structured summaries of:
- one strong session
- one weak session
- one dropout session
- one strong recovery-after-repair session
- one fatigue-heavy session

Each should include:
- lesson id
- chunk reached
- key message pattern
- key failure or success pattern
- why it matters

## 13. AI Analysis Section

This section is the direct input for the LLM.

For each identified issue, use this format:

### Issue
- `problem`:
- `evidence`:
- `likely_cause`:
- `research_basis`:
- `proposed_change`:
- `change_type`:
- `risk_level`:
- `expected_effect`:
- `metric_to_watch`:
- `rollback_condition`:

## 14. Recommended Changes

Summarize all proposed changes in a short table/list.

For each change include:
- `change_id`
- `scope`
- `risk_level`
- `owner`
- `needs_human_approval` yes/no
- `target_release`

## 15. Decisions

Record actual decisions made from the report.

For each:
- `decision_id`
- `decision`
- `reason`
- `approved_by`
- `effective_variant_id`
- `date`

## 16. Rollback Watchlist

List active conditions that would trigger rollback.

Examples:
- delayed retention down beyond threshold
- chunk 3 dropout above threshold
- repair recurrence above threshold
- fatigue markers rise without compensating benefit

## 17. Required Attachments

Attach or link:
- chunk summary export
- learner-message summary export
- fatigue summary export
- retention summary export
- experiment registry snapshot
- prompt/runtime config snapshot

## 18. Completion Checklist

- [ ] Report period and variant are clearly identified
- [ ] Baseline comparison is included
- [ ] Chunk-level analysis is included
- [ ] Message analysis is included
- [ ] Fatigue analysis is included
- [ ] Repair analysis is included
- [ ] Learning outcomes are included
- [ ] Proposed changes follow standard format
- [ ] Rollback conditions are stated
- [ ] Data-quality limitations are noted

## 19. Recommendation

Use this template for every formal analysis cycle.

The aim is to make AI-led redesign structured, comparable across time, and tied to evidence rather than intuition.
