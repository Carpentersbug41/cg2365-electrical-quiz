# New Lesson Platform Build Guide

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Implementation guide

## 1. Purpose

This document is the build guide for the new staged lesson platform/module.

It converts the product direction and telemetry requirements into an implementation sequence the team can follow while building.

This guide assumes the new runtime will:
- deliver lessons chunk by chunk
- keep tutor and learner in one shared session window
- use a staged lesson frame rather than fully unconstrained live generation
- capture behavioural data so learning, fatigue, and dropout can be inferred from usage

## 2. Core Product Decisions

These decisions should be treated as fixed unless evidence later says otherwise.

### 2.1 Runtime model
Build a `guided_chunk` runtime, not a fully live freeform tutor.

Meaning:
- the lesson frame is pre-generated
- chunks are pre-defined
- candidate questions are bounded
- runtime selects and renders the next turn dynamically
- tutor wording can vary, but allowed content stays controlled

### 2.2 UI model
Use one shared session window.

Meaning:
- tutor turns and learner responses appear in the same thread
- lesson is revealed chunk by chunk
- the whole lesson is not dumped up front
- each chunk should feel like a session unfolding, not a page rendering

### 2.3 Telemetry requirement
Do not ship the runtime without behavioural telemetry.

Meaning:
- session events must be logged from day one
- learner messages must be captured and classified
- chunk progression must be measurable
- retention must be linkable to later assessment activity

## 3. Build Scope

The new platform/module should include these parts:

1. lesson frame schema
2. runtime state machine
3. shared tutor-thread UI
4. runtime APIs
5. telemetry instrumentation
6. learner-message classification
7. summary analytics
8. experiment support for comparing variants

## 4. Build Order

Follow this order.

### Phase 1. Define the runtime contract
Goal:
Freeze the data shape required to run one lesson session.

Deliverables:
- lesson frame schema
- chunk schema
- tutor state enum
- question / repair / microbreak schema
- runtime versioning approach

Done when:
- one LO can be represented end to end without UI
- all required runtime states are enumerated
- telemetry fields can reference stable ids

### Phase 2. Build the lesson frame schema
Goal:
Represent a lesson as a staged chunk graph.

Each chunk should be able to contain:
- `chunk_id`
- `chunk_index`
- `chunk_type`
- `learning_goal`
- `teaching_core`
- `vocab_pack`
- `candidate_recall_questions`
- `candidate_deeper_questions`
- `misconceptions`
- `repair_patterns`
- `microbreak_slot`
- `advance_rules`

Rules:
- chunk content must be grounded to the lesson / LO
- chunk content must be small enough to render in one turn
- chunk content should support dynamic delivery without requiring full regeneration

Done when:
- a sample lesson can be stored in this structure
- every chunk can drive the runtime without hidden assumptions

### Phase 3. Build the runtime state machine
Goal:
Make the runtime conditional rather than scripted.

Minimum states:
- `teach`
- `recall`
- `repair`
- `deeper`
- `transition`
- `microbreak`
- `summary`

Rules:
- first-pass teaching should usually stay within the current chunk
- repair should trigger on weak or wrong answers
- deeper turns should appear when learner performance is strong enough
- microbreak exercises should appear at planned boundaries only
- state transitions must be deterministic enough to inspect later

Done when:
- the engine can decide the next state from current state + learner outcome
- a session can be replayed from stored events

### Phase 4. Build the shared session UI
Goal:
Create the single-window tutor session experience.

UI requirements:
- one central session card / thread
- tutor messages stream or reveal incrementally
- learner replies in the same thread
- input pinned at bottom of same surface
- internal scroll, not one long lesson page
- chunk separators are visible but not intrusive
- special rendering for vocab, repair, deeper question, and microbreak exercise turns

Rules:
- learner must never feel they are filling out a form in a separate system
- tutor and learner must feel like one ongoing interaction
- whole future lesson must not be visible up front

Done when:
- one lesson can be completed entirely inside the session window
- chunk transitions preserve continuity

### Phase 5. Build runtime APIs
Goal:
Support paged lesson delivery and turn progression.

Minimum API actions:
- `start_session`
- `get_next_turn`
- `submit_learner_turn`
- `advance_chunk`
- `start_microbreak`
- `complete_microbreak`
- `end_session`

Each action should return enough data to:
- render next tutor turn
- log the correct telemetry
- preserve state consistency

Done when:
- the front end never needs the whole lesson payload to progress
- the session can recover from refresh or reconnect

### Phase 6. Implement telemetry before optimization
Goal:
Capture behaviour from the first usable build.

Implement first:
- lesson session lifecycle events
- chunk start / complete / abandon
- tutor turn render events
- learner message submit events
- turn evaluation events
- repair / hint / retry events
- microbreak exercise events
- exit and timeout events

Use the telemetry spec in:
- [new_runtime_telemetry_spec.md](/C:/Users/carpe/Desktop/hs_quiz/quiz-app/reports/new_runtime_telemetry_spec.md)

Done when:
- every session can be reconstructed from raw events
- chunk-level dropout and completion can be measured

### Phase 7. Add learner-message classification
Goal:
Infer message type from behaviour and text.

Start simple:
- rule-based labels for obvious patterns
- uncertainty detection
- frustration detection
- low-effort detection
- off-topic detection
- help-request detection

Later add:
- semantic relevance scoring
- misconception-aware classification
- model-based classification if needed

Done when:
- every learner turn can be assigned a usable primary label
- fatigue and confusion heuristics can be computed automatically

### Phase 8. Add inferred-state logic
Goal:
Convert raw behaviour into useful product signals.

Implement first-pass inferred states:
- engagement state
- fatigue state
- confusion state
- mastery progress state
- dropout risk state

Rules:
- start with transparent heuristics
- version every heuristic
- do not hide logic in opaque metrics too early

Done when:
- each session gets a summary record with interpretable states

### Phase 9. Link runtime data to learning outcomes
Goal:
Measure learning, not just activity.

Connect session data to:
- end-of-lesson quiz performance
- spaced review performance
- cumulative quiz performance
- next-session related item performance

Done when:
- chunk/session patterns can be compared against later retention

### Phase 10. Add experiment support
Goal:
Make lesson design choices testable.

Variant dimensions to support:
- chunk length band
- question density
- deeper-question frequency
- tutor wording style
- streaming / reveal speed
- microbreak timing
- microbreak exercise type

Rules:
- variant id must be logged in session and turn telemetry
- variant assignment must be reproducible

Done when:
- two runtime versions can be compared without ambiguous data

## 5. What To Build Into The Lesson Frame

Each chunk should contain enough information for the runtime to feel adaptive without generating the lesson from scratch.

Recommended chunk object:
- `chunk_id`
- `chunk_index`
- `chunk_title`
- `chunk_type`
- `learning_goal`
- `teaching_core`
- `teaching_word_count`
- `vocab_pack`
- `candidate_recall_questions`
- `candidate_deeper_question`
- `misconception_codes`
- `repair_templates`
- `microbreak_recommendation`
- `advance_threshold`
- `fallback_hint_sequence`

Recommended vocab object:
- `term`
- `student_safe_definition`
- `why_it_matters_here`
- `common_confusion`
- `mini_check_prompt`

Recommended repair object:
- `misconception_code`
- `short_correction`
- `contrast_prompt`
- `retest_prompt`

## 6. Runtime Rules To Preserve

Do not let the runtime drift into these failure modes:
- full freeform generation of lesson content
- overlong tutor turns
- too many questions after every chunk regardless of performance
- decorative activities that break coherence
- assessor-style robotic tone
- multiple disconnected UI surfaces
- no telemetry

Do preserve:
- chunk-level progression
- retrieval after teaching
- targeted repair
- adaptive fading
- bounded microbreak exercise insertion
- one shared session window
- learner-visible continuity

## 7. Telemetry Requirements During Build

Each completed implementation ticket should answer:
- what user behaviour will this create?
- how will we measure whether it helped?
- which events and summary fields need to exist?

Minimum telemetry acceptance per feature:
- feature start event
- feature completion event
- feature abandon / skip event if relevant
- context ids logged
- enough detail to compare before/after behaviour

Examples:

For streamed tutor turns:
- log turn length
- log stream duration
- log skip / accelerate actions

For microbreak exercises:
- log start
- log completion or skip
- log correctness if relevant
- compare next-turn latency and answer quality

For deeper questions:
- log whether shown
- log learner outcome
- log whether they increase repair or dropout

## 8. Acceptance Criteria By Layer

### Schema layer
Accepted when:
- one full lesson can be expressed in the new schema
- ids are stable and telemetry-safe
- chunks support vocab, recall, repair, and exercise slots

### Runtime engine layer
Accepted when:
- state transitions are deterministic and inspectable
- next turn can be generated from stored state only
- runtime does not need the full lesson page loaded at once

### UI layer
Accepted when:
- lesson unfolds in one thread
- learner and tutor remain in same window
- chunk transitions are clear
- future chunks are not preloaded visibly

### Telemetry layer
Accepted when:
- session replay is possible
- chunk-level dropout is measurable
- fatigue heuristic can run
- learner-message types can be summarized

### Learning-outcomes layer
Accepted when:
- runtime sessions can be linked to later assessments
- learning can be compared across runtime variants

## 9. First Version Metrics To Watch

Track these immediately after launch:
- session start to first reply conversion
- completion rate by lesson
- dropout rate by chunk index
- average response latency by chunk index
- learner-message type distribution
- repair rate by chunk
- microbreak completion rate
- post-microbreak recovery rate
- delayed quiz performance for related items

## 10. Decision Rules After Launch

Use evidence to make changes.

Examples:
- If dropout rises sharply after chunk 3, reduce text or increase variation before chunk 3.
- If deeper questions trigger high repair but no later retention gain, reduce frequency.
- If microbreak exercises do not improve next-turn quality, move or remove them.
- If streaming slows experts but helps novices, add bounded pacing controls.
- If certain tutor phrasing reduces frustration and improves recovery, promote that prompt profile.

## 11. What Not To Do

Do not:
- ship based only on whether the experience feels better internally
- rely on learner surveys during the lesson for core evidence
- collect telemetry without a decision model
- make every chunk dynamic if a bounded frame can do the job
- add novelty features without logging their effects

## 12. Working Checklist

Use this checklist during implementation.

### Platform foundation
- [ ] Define lesson frame schema
- [ ] Define chunk schema
- [ ] Define tutor states
- [ ] Define variant ids

### Runtime engine
- [ ] Implement session start
- [ ] Implement next-turn logic
- [ ] Implement learner turn submit
- [ ] Implement repair transitions
- [ ] Implement deeper-question transitions
- [ ] Implement microbreak transitions
- [ ] Implement session end / recover

### UI
- [ ] Build shared tutor thread
- [ ] Build learner input in same surface
- [ ] Build streamed / incremental tutor rendering
- [ ] Build chunk separator UI
- [ ] Build vocab turn rendering
- [ ] Build repair turn rendering
- [ ] Build microbreak exercise rendering

### Telemetry
- [ ] Create session tables
- [ ] Create event tables
- [ ] Create turn tables
- [ ] Log lifecycle events
- [ ] Log chunk events
- [ ] Log learner messages
- [ ] Log outcomes and misconceptions
- [ ] Log exercise usage
- [ ] Build session summary job

### Analysis
- [ ] Implement low-effort turn heuristic
- [ ] Implement fatigue heuristic
- [ ] Implement confusion heuristic
- [ ] Implement mastery progress summary
- [ ] Build dropout dashboard
- [ ] Build recovery dashboard
- [ ] Build retention dashboard

## 13. Recommendation

Treat this build as a measured learning-system rollout, not a UI redesign.

The new platform should be considered successful only if it can show, from behavioural data:
- where learners leave
- where they fatigue
- what they likely learn
- which runtime patterns improve retention and completion
