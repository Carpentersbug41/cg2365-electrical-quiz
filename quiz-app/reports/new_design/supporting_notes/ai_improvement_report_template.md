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

## 20. Additional Measurement Sections To Include When Available

As the runtime matures, extend the report with the following sections.

## 21. Support Dependence Analysis

Include:
- supported success rate
- unsupported success rate
- hint dependence rate
- repair dependence rate
- support fade success rate

Questions to answer:
- are learners becoming more independent?
- which lesson patterns create dependency on support?

## 22. Transfer Analysis

Include:
- near-transfer performance
- far-transfer performance if available
- transfer after explanation
- transfer after repair
- transfer by chunk type

Questions to answer:
- which chunks produce application, not just recall?
- where is recall strong but transfer weak?

## 23. Recovery Capacity Analysis

Include:
- first-failure recovery rate
- second-failure recovery rate
- continue-after-recovery rate
- later correct use after recovery

Questions to answer:
- which repair paths produce real recovery?
- where do learners recover temporarily but fail again later?

## 24. Pace Mismatch Analysis

Include:
- reveal skip or speed-up usage
- replay usage
- fast accurate progress patterns
- slow stable progress patterns
- dropout by pacing pattern

Questions to answer:
- which learners are being slowed down unnecessarily?
- which learners are being overloaded by the current pace?

## 25. Learning Efficiency Analysis

Include:
- learning gain per minute
- retention gain per minute
- turns to first success
- turns to stable success
- chunk efficiency by lesson type

Questions to answer:
- which runtime patterns teach efficiently rather than just thoroughly?
- are some chunks too expensive in time for the learning they produce?

## 26. AI-Change Quality Analysis

Include:
- AI-proposed changes shipped in the period
- win/loss rate of those changes
- rollback rate
- time to detect regressions
- prompt-change vs UI-change vs runtime-rule change outcomes

Questions to answer:
- is the AI improvement loop making the product better overall?
- which types of AI-led changes are reliable, and which are not?

## 27. Additional Attachments

Attach or link when available:
- support dependence summary export
- transfer summary export
- recovery capacity summary export
- pace mismatch summary export
- learning efficiency summary export
- AI-change quality summary export

## 28. Extended Completion Checklist

- [ ] Support dependence analysis is included when available
- [ ] Transfer analysis is included when available
- [ ] Recovery capacity analysis is included when available
- [ ] Pace mismatch analysis is included when available
- [ ] Learning efficiency analysis is included when available
- [ ] AI-change quality analysis is included when available
