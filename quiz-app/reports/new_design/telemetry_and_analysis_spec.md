# Telemetry And Analysis Spec

## Purpose

This is the canonical measurement document for the guided chunk platform.

It defines how the system measures:
- learner performance
- app performance
- AI-change performance

## Measurement Layers

### Learner-performance measurement
Used to improve instruction inside the app.

Examples:
- correctness
- misconceptions
- support dependence
- recovery after repair
- transfer success
- later review performance

### App-performance measurement
Used to improve the product.

Examples:
- chunk-level dropout
- fatigue onset patterns
- repair effectiveness by runtime variant
- pacing mismatch
- learning efficiency
- microbreak timing effectiveness

### AI-change quality measurement
Used to evaluate the AI improvement loop itself.

Examples:
- win rate of prompt changes
- win rate of UI changes
- rollback rate
- time to detect regressions

## Core Entities

Minimum tracked entities:
- `lesson_session`
- `session_event`
- `tutor_turn`
- `learner_turn`
- `turn_outcome`
- `chunk_summary`
- `session_summary`
- `change_record`

## Current Guided Runtime Storage

The guided runtime now persists data in four layers:

1. `gc_lesson_versions`
- stores the full guided lesson/frame JSON
- this is the canonical stored lesson content

2. `gc_sessions`
- stores the full guided session snapshot as `session_json`
- includes current step, full thread, review flags, LO results, and event history

3. `gc_session_turns`
- stores every visible turn in normalized form
- includes tutor turns, learner answers, dividers, images, microbreak turns, and LO-test intro turns

4. `gc_session_events`
- stores every runtime event in normalized form
- includes chunk start, question asked, learner answer submitted, question evaluated, repair, microbreak actions, LO-test submission/completion, and session completion

This means the system now stores:
- the whole lesson version
- the whole session snapshot
- the full conversation thread
- the runtime event history

5. `gc_session_summaries`
- now stores both raw summary counts and persisted derived metrics
- includes:
  - average response latency
  - fatigue score
  - fatigue-onset chunk
  - confusion score
  - disengagement score
  - support dependence score
  - recovery rate
  - transfer quality
  - pace mismatch score
  - learning efficiency

6. `gc_experiments`
- stores named prompt/UI/runtime/content/telemetry experiments
- links target and baseline variants to explicit hypotheses and metrics to watch

7. `gc_experiment_changes`
- stores concrete change records within an experiment
- captures lesson/version scope, variant ids, change description, expected effect, and result data

## Current Derived Analytics

The guided runtime now persists derived metrics into `gc_session_summaries`.

The guided admin analytics route still computes per-session drilldown from `gc_sessions.session_json` on read.

Current inferred metrics:
- average response latency
- fatigue score
- fatigue onset chunk
- confusion score
- disengagement score
- support dependence score
- recovery rate
- transfer quality
- pace mismatch score
- learning efficiency

These are currently exposed in:
- `/api/admin/guided-chunk/analytics`
- `/admin/guided-chunk`

Current split:
- per-session detail: derived on read from `gc_sessions.session_json`
- persisted summary metrics: stored in `gc_session_summaries`

## Event Model

Minimum events:
- `lesson_session_started`
- `lesson_session_resumed`
- `lesson_session_completed`
- `lesson_session_exited`
- `chunk_started`
- `chunk_completed`
- `chunk_abandoned`
- `tutor_turn_completed`
- `learner_message_submitted`
- `learner_message_classified`
- `learner_turn_evaluated`
- `repair_triggered`
- `microbreak_started`
- `microbreak_completed`
- `microbreak_skipped`

## Core Learner Metrics

Measure:
- correctness and partial correctness
- misconception frequency
- repair trigger rate
- first-failure recovery
- second-failure recovery
- support dependence
- unsupported success
- support fade success
- near-transfer success
- later review performance

## Core App Metrics

Measure:
- completion rate
- chunk-level dropout
- fatigue marker rate by chunk
- latency slope
- learner word-count slope
- pace mismatch signals
- microbreak exercise effect on next-turn quality
- learning gain per minute
- retention gain per minute

## Core AI-Change Metrics

Measure:
- change id and type
- expected metric shift
- actual metric shift
- rollback required or not
- time to detect negative change
- win/loss rate by change type

## Inferred States

Compute, at minimum:
- engagement state
- fatigue state
- confusion state
- mastery progress state
- dropout risk state

These are inferred from behavior, not asked directly.

Current implementation status:
- fatigue state: implemented
- confusion state: implemented
- disengagement state: implemented
- support dependence: implemented
- recovery capacity: implemented as recovery rate
- transfer quality: implemented
- pace mismatch: implemented
- learning efficiency: implemented
- AI-change quality: not yet implemented

## Dashboards

Minimum dashboards:
- session funnel
- chunk heatmap
- learner-message distribution
- repair / recovery dashboard
- microbreak effect dashboard
- retention dashboard
- support dependence dashboard
- transfer dashboard
- pace mismatch dashboard
- learning efficiency dashboard
- AI-change quality dashboard

## Current Guided Admin Coverage

The guided admin page now provides:
- lesson/version-level averages
- recent per-session drilldown
- session drilldown filters for lesson, status, source context, and variant
- experiment registry
- experiment performance against baseline variants where defined
- experiment win/loss/mixed/inconclusive classification

Backfill support:
- `npx tsx scripts/backfillGuidedChunkSessionSummaries.ts`
- use this to repopulate `gc_session_summaries` for older guided sessions after metric-schema changes

## Decision Rules

The telemetry is useful only if it can support decisions like:
- shorten chunk 3 because dropout and fatigue rise there
- change repair wording because recovery is weak
- move a microbreak earlier because fatigue begins sooner
- reduce scaffolding because unsupported success is rising
- roll back a prompt/UI change because retention worsened

## Relationship To The Other Docs

- `implementation_spec.md` defines where telemetry hooks are needed
- `ai_improvement_system.md` defines how telemetry is turned into changes
- `appendix_report_template.md` defines the standard analysis format
