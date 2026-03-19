# Guided Chunk V1 Implementation Backlog

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Execution backlog
Source: `reports/new_design/first_version_scope.md`

## 1. Purpose

This document converts the brutally narrow v1 scope into an implementation backlog.

The backlog is organized into:
- milestones
- tickets
- dependencies
- acceptance criteria
- definition of done

This is the build plan for `guided_chunk_v1`.

## 2. V1 Outcome

By the end of this backlog, the app should have:
- one new lesson runtime mode: `guided_chunk_v1`
- one shared tutor-thread UI
- one bounded lesson frame schema
- one small runtime state machine
- strong behavioural telemetry
- one clean comparison path against the current runtime

## 3. Delivery Principles

Use these rules while executing the backlog:
- keep scope narrow
- do not add extra runtime families
- do not build full live lesson generation
- do not change mastery thresholds or scoring rules in v1
- do not ship without telemetry
- keep all major ids and variants stable for analysis

## 4. Milestone Overview

### Milestone 1. Runtime contract and schema
Goal:
Define the data shape required to run `guided_chunk_v1`.

### Milestone 2. Runtime engine and APIs
Goal:
Make a single lesson session progress chunk by chunk through a bounded state machine.

### Milestone 3. Shared session UI
Goal:
Deliver the one-window tutor-thread experience.

### Milestone 4. Telemetry and analysis foundations
Goal:
Capture enough behavioural data to evaluate the runtime.

### Milestone 5. Baseline comparison and launch readiness
Goal:
Run the new runtime against a clear baseline and make it measurable.

## 5. Detailed Backlog

## Milestone 1. Runtime Contract And Schema

### T1.1 Define `guided_chunk_v1` lesson frame schema
Description:
Create the core JSON/data contract for lessons used by the new runtime.

Must include:
- `lesson_id`
- `runtime_version`
- `chunks`
- per-chunk ids and indexes
- teaching core
- vocab pack
- recall question pool
- optional deeper question
- misconception / repair patterns
- optional microbreak slot

Dependencies:
- none

Acceptance criteria:
- a sample lesson can be represented end to end
- schema supports all required v1 turn types
- schema is stable enough for telemetry ids

### T1.2 Define chunk object contract
Description:
Specify the required fields for each chunk.

Required fields:
- `chunk_id`
- `chunk_index`
- `chunk_type`
- `learning_goal`
- `teaching_core`
- `teaching_word_count`
- `vocab_pack`
- `candidate_recall_questions`
- `candidate_deeper_question` nullable
- `misconception_codes`
- `repair_templates`
- `microbreak_recommendation`
- `advance_threshold`

Dependencies:
- T1.1

Acceptance criteria:
- every runtime turn can be generated from chunk data alone
- no hidden implicit fields required

### T1.3 Define tutor state enum for v1
Description:
Freeze the runtime state machine vocabulary.

Allowed states:
- `teach`
- `recall`
- `repair`
- `transition`
- `microbreak`
- `summary`

Dependencies:
- T1.1

Acceptance criteria:
- no extra states required for v1 flow
- all UI components map cleanly to these states

### T1.4 Define repair pattern contract
Description:
Specify how misconceptions and repair logic are represented.

Required fields:
- `misconception_code`
- `short_correction`
- `contrast_prompt`
- `retest_prompt`

Dependencies:
- T1.2

Acceptance criteria:
- one wrong-answer path can be completed from stored repair data

### T1.5 Define runtime variant and experiment ids
Description:
Create stable ids for runtime variants and future experiments.

Required fields:
- `runtime_version`
- `variant_id`
- `experiment_id` nullable

Dependencies:
- T1.1

Acceptance criteria:
- all sessions can be unambiguously assigned to one runtime variant

### T1.6 Create one reference lesson in the new frame
Description:
Convert one suitable existing lesson into the new guided chunk schema.

Selection criteria:
- conceptually clear
- moderate complexity
- not the hardest lesson in the curriculum
- already reasonably stable in existing system

Dependencies:
- T1.1 to T1.4

Acceptance criteria:
- one lesson exists in production-like format for runtime testing
- chunk sizes remain within v1 target range

## Milestone 2. Runtime Engine And APIs

### T2.1 Implement session bootstrap
Description:
Create runtime session start logic.

Must do:
- create or restore a session
- select first chunk
- select first tutor state
- return first renderable tutor turn

Dependencies:
- T1.1 to T1.6

Acceptance criteria:
- a session can start from stored lesson frame only

### T2.2 Implement next-turn decision logic
Description:
Build the core state transition logic.

Rules for v1:
- after `teach`, ask one recall question
- after correct recall, go to `transition` or next chunk
- after weak/wrong recall, go to `repair`
- after repair success, advance
- at configured boundary, optionally go to `microbreak`

Dependencies:
- T2.1

Acceptance criteria:
- runtime path is deterministic and inspectable
- next step can be explained from state + learner outcome

### T2.3 Implement learner-turn submission endpoint
Description:
Accept learner response and return evaluated next state.

Must do:
- receive learner text/input
- evaluate correctness / partial correctness
- attach misconception code if available
- trigger repair if needed
- return next tutor turn payload

Dependencies:
- T2.2

Acceptance criteria:
- one full chunk can be completed through the endpoint

### T2.4 Implement repair flow
Description:
Create the short correction + retry loop.

Rules:
- one short correction
- one contrast or clarification prompt
- one retry turn
- then advance or mark unresolved and move on according to v1 rule

Dependencies:
- T1.4, T2.3

Acceptance criteria:
- wrong answer path works cleanly inside session thread
- repair path is visibly distinct from ordinary feedback

### T2.5 Implement microbreak exercise flow
Description:
Support optional microbreak turn between selected chunks.

Must do:
- start exercise
- complete / skip exercise
- return next main lesson turn

Dependencies:
- T2.2

Acceptance criteria:
- microbreak does not break session continuity
- skip path works

### T2.6 Implement session resume / recover
Description:
Allow refresh or reconnect without losing the lesson session.

Dependencies:
- T2.1 to T2.5

Acceptance criteria:
- learner can reload and continue from latest valid state

### T2.7 Implement end-of-session summary state
Description:
Close the lesson session with a summary turn and session-final event.

Dependencies:
- T2.2

Acceptance criteria:
- completed session ends cleanly with summary state and final telemetry

## Milestone 3. Shared Session UI

### T3.1 Build shared session shell
Description:
Create the main one-window runtime container.

Must include:
- tutor/learner thread
- input area in same surface
- internal scroll
- consistent session layout

Dependencies:
- T2.1

Acceptance criteria:
- full interaction occurs in one surface
- no separate answer/evaluator panel

### T3.2 Build tutor message renderer
Description:
Render tutor turns by state.

Must support:
- `teach`
- `recall`
- `repair`
- `transition`
- `microbreak`
- `summary`

Dependencies:
- T3.1, T1.3

Acceptance criteria:
- tutor states are visually distinct but coherent

### T3.3 Build learner input component
Description:
Create text-first learner input in the same thread surface.

V1 requirement:
- text input only is acceptable
- voice input can be deferred unless cheap

Dependencies:
- T3.1, T2.3

Acceptance criteria:
- learner can answer without leaving the session flow

### T3.4 Build chunk transition UI
Description:
Add clear but lightweight chunk transitions.

Dependencies:
- T3.2

Acceptance criteria:
- learner understands progression without seeing the whole lesson at once

### T3.5 Build vocab turn presentation
Description:
Render short just-in-time vocab moments inside the thread.

Dependencies:
- T1.2, T3.2

Acceptance criteria:
- vocab does not appear as a detached glossary dump

### T3.6 Build repair turn presentation
Description:
Create a concise repair visual treatment.

Dependencies:
- T2.4, T3.2

Acceptance criteria:
- repair feels like tutoring, not bureaucratic marking

### T3.7 Build microbreak exercise UI
Description:
Render the microbreak exercise inside the same thread/system.

Dependencies:
- T2.5, T3.2

Acceptance criteria:
- exercise feels connected to the session
- start / skip / complete states are clear

### T3.8 Add optional progressive reveal controls
Description:
If low-cost, support bounded reveal behaviour.

Controls:
- continue
- speed up
- replay last tutor turn

Dependencies:
- T3.2

Acceptance criteria:
- controls do not introduce major complexity
- can be cut if they delay v1

## Milestone 4. Telemetry And Analysis Foundations

### T4.1 Create telemetry tables
Description:
Create the minimum schema for lesson sessions, events, turns, outcomes, and summaries.

Dependencies:
- telemetry spec doc

Acceptance criteria:
- required tables exist for v1 instrumentation

### T4.2 Log session lifecycle events
Description:
Instrument start, resume, complete, exit, and timeout paths.

Dependencies:
- T2.1, T2.6, T2.7, T4.1

Acceptance criteria:
- every session has a reconstructable lifecycle

### T4.3 Log chunk lifecycle events
Description:
Instrument chunk start, complete, abandon.

Dependencies:
- T2.2, T4.1

Acceptance criteria:
- chunk-level dropout is measurable

### T4.4 Log tutor-turn events
Description:
Record tutor state, text length, render timing, and reveal metadata.

Dependencies:
- T3.2, T4.1

Acceptance criteria:
- each tutor turn is linked to session, chunk, and state

### T4.5 Log learner-turn events
Description:
Record learner message, timing, input mode, and classification hooks.

Dependencies:
- T3.3, T4.1

Acceptance criteria:
- each learner turn can be tied to preceding tutor turn

### T4.6 Log outcome and repair events
Description:
Record correctness, misconception, repair, retry, hint usage.

Dependencies:
- T2.3, T2.4, T4.1

Acceptance criteria:
- recovery after repair can be measured

### T4.7 Log microbreak exercise events
Description:
Record start, complete, skip, time spent, correctness if relevant.

Dependencies:
- T2.5, T4.1

Acceptance criteria:
- exercise effects on next-turn behaviour can be analyzed

### T4.8 Implement learner-message first-pass classifier
Description:
Start with rule-based classification.

Labels:
- `direct_answer`
- `partial_answer`
- `guess`
- `confusion`
- `help_request`
- `frustration`
- `off_topic`
- `disengaged_low_effort`
- `other`

Dependencies:
- T4.5

Acceptance criteria:
- every learner turn can receive a primary label
- classifier version is logged

### T4.9 Implement first-pass fatigue heuristic
Description:
Compute simple fatigue indicators from behavioural data.

Dependencies:
- T4.3 to T4.8

Acceptance criteria:
- session summary includes estimated fatigue onset or no-signal result

### T4.10 Build session summary job
Description:
Create aggregated summary rows for each session.

Dependencies:
- T4.2 to T4.9

Acceptance criteria:
- each session gets summary metrics and inferred states

## Milestone 5. Baseline Comparison And Launch Readiness

### T5.1 Define baseline comparison lesson(s)
Description:
Choose the existing lesson runtime baseline for side-by-side comparison.

Dependencies:
- T1.6

Acceptance criteria:
- comparison target is explicit and stable

### T5.2 Define v1 success metrics
Description:
Freeze the initial metric set.

Required:
- completion rate
- chunk-level dropout
- repair recovery
- end-of-lesson performance
- later related review performance
- fatigue markers

Dependencies:
- T4.10

Acceptance criteria:
- every metric has a clear definition

### T5.3 Define v1 failure / rollback conditions
Description:
Set explicit thresholds for stopping or reverting.

Dependencies:
- T5.2

Acceptance criteria:
- v1 is not judged by vibes alone

### T5.4 Build first analysis dashboard or report
Description:
Produce the first standard output for v1 runtime monitoring.

Must show:
- session funnel
- chunk heatmap
- repair/recovery
- message type distribution
- fatigue summary
- baseline comparison

Dependencies:
- T4.10, T5.1, T5.2

Acceptance criteria:
- runtime performance can be reviewed without raw-log inspection

### T5.5 Run internal pilot on one lesson
Description:
Use one lesson to validate flow, logging, and comparability.

Dependencies:
- T1.6, T2.*, T3.*, T4.*, T5.1 to T5.4

Acceptance criteria:
- end-to-end session works
- telemetry is complete enough to analyze
- obvious defects are identified before broader rollout

### T5.6 Launch gated external trial
Description:
Expose `guided_chunk_v1` to a controlled subset of sessions.

Dependencies:
- T5.5

Acceptance criteria:
- variant routing is stable
- baseline comparison is possible
- data volume is sufficient for first review cycle

## 6. Suggested Execution Sequence

Use this order:
1. T1.1 to T1.6
2. T2.1 to T2.5
3. T3.1 to T3.7
4. T4.1 to T4.7
5. T2.6 to T2.7
6. T4.8 to T4.10
7. T5.1 to T5.4
8. T5.5 to T5.6
9. T3.8 only if it does not destabilize the schedule

## 7. Critical Path

These tickets are on the critical path:
- T1.1
- T1.6
- T2.1
- T2.2
- T2.3
- T3.1
- T3.2
- T3.3
- T4.1
- T4.2
- T4.3
- T4.5
- T4.6
- T4.10
- T5.1
- T5.2
- T5.5

If these slip, v1 slips.

## 8. Definition Of Done For Guided Chunk V1

`guided_chunk_v1` is done when all of the following are true:
- one real lesson runs end to end in the new runtime
- learner and tutor interact in one shared session window
- runtime uses the bounded chunk frame, not live lesson generation
- wrong answers trigger repair flow
- optional microbreak flow works
- telemetry captures session, chunk, tutor, learner, outcome, and exit data
- session summaries can be generated automatically
- baseline comparison metrics are defined and visible
- pilot review can determine whether v1 is worth expanding

## 9. What To Defer Explicitly

Do not promote these into the v1 backlog unless something breaks badly without them:
- large personalization system
- full voice-first runtime
- complex pacing AI
- autonomous mastery-threshold tuning
- multi-agent orchestration
- full app-wide redesign
- broad lesson migration across many modules
- too many experiment dimensions at once

## 10. Recommendation

Treat this backlog as an execution fence.

Its purpose is to stop the new module becoming bigger than the evidence loop can support.

If a proposed task does not help prove `guided_chunk_v1`, move it out of this backlog.
