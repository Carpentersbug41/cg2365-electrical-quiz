# AI-Led Improvement Operating Model

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Operating model

## 1. Purpose

This document defines how the app should be improved by an LLM over time.

The goal is to create an evidence-led improvement loop where the LLM:
- designs from research and pedagogy
- monitors behavioural data
- analyses learner outcomes
- proposes or implements targeted changes
- measures whether those changes improved the app

This is not an unrestricted self-modifying system.
It is a controlled improvement system.

## 2. Core Principle

The LLM should improve the app from:
- research evidence
- pedagogy
- behavioural telemetry
- learning outcomes
- explicit product constraints

The LLM should not improve the app from:
- intuition alone
- small anecdotal patterns
- engagement metrics alone
- unconstrained autonomous redesign

## 3. Why This Model Is Good

For this app, the model is strong because:
- the product is already pedagogically structured
- the runtime can be instrumented deeply
- the system produces rich behavioural traces
- improvement needs to connect teaching quality, UX, and learner outcomes
- an LLM can synthesize research, telemetry, and product design faster than a manual-only process

## 4. Risks

This model fails if the LLM starts optimizing for the wrong thing.

Key risks:
- overfitting to short-term engagement
- improving completion while hurting learning
- making too many changes at once
- reacting to noisy or low-volume data
- drifting away from curriculum grounding
- changing assessment or gating logic without safeguards
- optimizing to what is easy to measure rather than what matters

## 5. The Improvement Loop

Use this loop.

1. collect telemetry
2. collect learning-outcome data
3. compile analysis input
4. run LLM analysis
5. identify problems and likely causes
6. propose a limited change set
7. classify change risk
8. implement or approve changes
9. run the updated variant
10. compare outcomes
11. keep, refine, or roll back

## 6. Inputs The LLM Needs

The LLM should be given structured inputs, not just raw logs.

### 6.1 Required data inputs
- telemetry summaries by lesson, chunk, runtime, and variant
- session summary records
- learner-message classifications
- retention / delayed review outcomes
- misconception summaries
- dropout summaries
- repair and recovery summaries
- microbreak exercise summaries
- current lesson frame / chunk schema
- current prompt files / prompt configs
- current UI/runtime config
- current experiment definitions

### 6.2 Optional but useful inputs
- example session transcripts
- example failing sessions
- example strong sessions
- prior improvement logs
- known product constraints
- known curriculum rules

### 6.3 Research inputs
The LLM should also be able to consult the current research docs:
- [new_research.txt](/C:/Users/carpe/Desktop/hs_quiz/quiz-app/reports/new_research.txt)
- [additional_research_for_ui_design.md](/C:/Users/carpe/Desktop/hs_quiz/quiz-app/reports/additional_research_for_ui_design.md)
- [new_runtime_telemetry_spec.md](/C:/Users/carpe/Desktop/hs_quiz/quiz-app/reports/new_runtime_telemetry_spec.md)
- [new_lesson_platform_build_guide.md](/C:/Users/carpe/Desktop/hs_quiz/quiz-app/reports/new_lesson_platform_build_guide.md)

## 7. Standard Analysis Output Format

Every AI analysis cycle should produce the same structure.

For each issue found:
- `problem`
- `evidence`
- `likely_cause`
- `research_basis`
- `proposed_change`
- `change_type`
- `risk_level`
- `expected_effect`
- `metric_to_watch`
- `rollback_condition`

This prevents vague or untraceable optimization.

## 8. Change Types

The LLM may work across several layers.

### 8.1 Prompt changes
Examples:
- tutor tone
- repair wording
- explanation brevity
- deeper-question phrasing
- vocab introduction pattern

### 8.2 Runtime changes
Examples:
- chunk length band
- question density
- deeper-question frequency
- repair trigger thresholds
- microbreak insertion timing
- pacing rules

### 8.3 UI changes
Examples:
- reveal speed
- thread layout
- chunk separator design
- vocab card presentation
- repair turn presentation
- microbreak exercise presentation

### 8.4 Analytics / inference changes
Examples:
- fatigue heuristic revision
- confusion classifier revision
- dropout-risk heuristic revision

## 9. Change Governance

Not all changes should be equally easy to apply.

### 9.1 Low-risk changes
Can be proposed and often implemented quickly.

Examples:
- prompt wording
- tutor tone
- reveal timing
- chunk presentation tweaks
- UI copy
- microbreak placement experiments
- explanation prompt frequency

### 9.2 Medium-risk changes
Should usually be run as explicit experiments.

Examples:
- chunk length changes
- question density changes
- deeper-question frequency changes
- repair pattern changes
- support fading logic
- prior-knowledge adaptation rules

### 9.3 High-risk changes
Should require explicit human approval.

Examples:
- mastery thresholds
- diagnostic gating rules
- assessment scoring logic
- lesson sequencing rules
- curriculum interpretation rules
- any change affecting what counts as success

## 10. What The LLM Can Change Safely

Default safe domains for LLM-led optimization:
- prompt refinements
- chunk presentation
- tutor response style
- reveal / pacing settings
- microbreak exercise timing
- repair message patterns
- vocab presentation order
- UI layout iteration inside the runtime shell

## 11. What The LLM Must Not Change Autonomously

Without explicit approval, the LLM must not directly change:
- grading standards
- pass/fail thresholds
- diagnostic pass criteria
- curriculum coverage rules
- syllabus grounding rules
- user privacy rules
- raw data retention policy
- experiment evaluation criteria

## 12. Evaluation Priorities

When comparing old vs new variants, use this priority order:

1. learning outcomes
- delayed review success
- end-of-lesson mastery
- transfer performance

2. productive persistence
- completion rate
- chunk progression
- recovery after repair

3. fatigue and friction
- fatigue onset
- hint dependence
- frustration markers
- abandonment points

4. engagement
- response quality
- willingness to continue
- microbreak completion

Important:
The app must not optimize engagement at the expense of learning.

## 13. Experiment Rules

The LLM should improve the app through controlled experiments.

Rules:
- change only a small number of variables at once
- assign a stable `variant_id`
- define the expected benefit before release
- define the success metric before release
- define the rollback condition before release
- log the variant in all relevant telemetry

Recommended experiment record:
- `experiment_id`
- `variant_id`
- `hypothesis`
- `change_set`
- `primary_metric`
- `secondary_metrics`
- `minimum_sample_requirement`
- `stop_rule`
- `rollback_rule`

## 14. Rollback Rules

A change should be rolled back if any of these occur:
- learning outcomes worsen materially
- retention worsens materially
- dropout increases materially at key chunks
- repair rate rises without later benefit
- fatigue markers worsen without compensating benefit
- misconception recurrence increases

The system should not keep a change just because it improves one superficial metric.

## 15. Data Review Modes

The LLM can operate in two modes.

### 15.1 Report mode
The LLM is passed a structured report.

Use when:
- data is already aggregated
- you want stable reproducible reviews
- you want lighter operational overhead

Required report sections:
- lesson/runtime summary
- chunk summary
- fatigue summary
- dropout summary
- misconception summary
- repair/recovery summary
- retention summary
- notable transcripts
- active variant definitions

### 15.2 Direct database analysis mode
The LLM inspects the database or warehouse directly.

Use when:
- deeper analysis is needed
- ad hoc pattern-finding is required
- the system needs to drill into raw events or transcripts

Requirements:
- read-only by default for analysis
- clear schema definitions
- stable views for common metrics
- privacy-safe access patterns

## 16. Recommended Working Pattern

Best default pattern:
- periodic report generation
- LLM analyses the report
- LLM proposes changes
- approved low-risk changes are implemented
- high-risk changes go through review

Use direct DB analysis when a report is insufficient.

Reason:
This keeps the loop structured while still allowing deeper investigations when needed.

## 17. Suggested Cadence

Recommended rhythm:
- daily lightweight monitoring for obvious breakages
- weekly structured analysis of runtime performance
- fortnightly or monthly redesign cycles for larger UX/runtime changes

Use longer cycles for pedagogic changes because retention signals need time to emerge.

## 18. Improvement Targets

The LLM should focus on these questions first:
- where do learners leave?
- where does fatigue begin?
- which repairs work?
- which chunk patterns produce later retention?
- which UI pacing patterns help weaker learners without slowing stronger learners too much?
- which tutor tone helps persistence after failure?

## 19. Example AI Recommendation Format

Example:

Problem:
Learners drop sharply after chunk 3 in runtime variant `guided_chunk_v2`.

Evidence:
- dropout after chunk 3 is 27% above baseline
- tutor turns in chunk 3 average 178 words
- response latency rises 44%
- low-effort turns increase 31%

Likely cause:
Chunk 3 combines too much explanation and retrieval before variation.

Research basis:
Segmentation and fatigue evidence suggest sustained text-heavy runs increase load; microbreak exercise timing may be too late.

Proposed change:
- reduce chunk 3 teaching core from 178 words to 110-130 words
- move microbreak exercise from after chunk 4 to after chunk 3
- shorten first repair prompt in chunk 3

Change type:
Runtime + UI

Risk level:
Medium

Expected effect:
Lower fatigue markers and improved progression into chunk 4.

Metric to watch:
- chunk 3 -> chunk 4 conversion
- latency slope after chunk 3
- post-microbreak recovery
- delayed related quiz outcome

Rollback condition:
If delayed related quiz performance drops by more than agreed threshold, revert.

## 20. Required Records For AI-Led Improvement

Keep these docs current:
- active runtime variants
- prompt versions
- experiment registry
- improvement log
- rollback log
- research basis docs

Each implemented change should be traceable to:
- a data pattern
- a hypothesis
- a change record
- a measured result

## 21. Recommendation

Yes, AI-led redesign of this app is a good idea if it is implemented as a controlled evidence loop.

The correct model is:
- LLM as researcher
- LLM as analyst
- LLM as prompt/runtime/UI improver
- LLM as experiment interpreter
- not LLM as unchecked autonomous product autopilot

## 22. Next Step

Build one more supporting artifact:
- an `AI improvement report template`

That template should be the standard input for each analysis cycle, whether generated from the database or manually compiled.
