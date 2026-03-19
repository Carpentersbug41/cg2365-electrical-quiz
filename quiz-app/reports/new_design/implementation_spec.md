# Guided Chunk V1 Implementation Spec

## Purpose

This document is the decision-complete implementation spec for `guided_chunk_v1`.

Important reset:
- the guided platform has been simplified back to a built-in JSON/object baseline
- generated guided content is not currently the trusted baseline
- runtime order must be proven directly from stored frame data before generation is reintroduced as the primary path

## Runtime Definition

`guided_chunk_v1` is a constrained conversational lesson runtime built on a pre-generated lesson frame.

Its shape is intentionally close to the prompt benchmark described in `prompt_pattern_to_superior_product.md`: short teaching turn, immediate recall, brief tutor response, then progression. The app should add control and measurement without breaking that rhythm.

The runtime is fed by a separate generation pipeline described in `generation_pipeline_spec.md`. It should not consume the old block lesson format as its primary authored target.

The runtime and authoring workflow should also stay separate from the old static lesson workflow:
- old/static planning remains in `/admin/module`
- guided planning and guided generation run through guided-only planner routes
- the learner runtime resolves guided content only

Current POC baseline:
- one built-in frame in `src/data/guided-chunk/...`
- loaded through `frameLoader.ts`
- rendered in exact `loSequence -> chunkPlan` order

The runtime must:
- render one teaching chunk at a time
- keep tutor and learner in one thread
- pseudo-stream tutor turns so pre-generated content feels live
- ask one immediate pre-generated recall question after each teaching chunk by default
- generate bounded follow-up questioning from the learner response
- trigger short repair on weak or wrong answers
- inject planned images or diagrams inline when the frame says they help
- optionally insert a microbreak exercise at planned boundaries
- log the full interaction for later analysis

## Lesson Frame Contract

The runtime must treat the stored frame order as canonical.

The displayed lesson order is:
1. `lo_sequence[0]`
2. `chunk_plan[0]`
3. `chunk_plan[1]`
4. continue in array order

The runtime must not introduce extra ordering logic beyond walking the stored structure.

Each lesson must include:
- `lesson_id`
- `runtime_version`
- `variant_id`
- `unit`
- `topic`
- `lo_sequence[]`

Each LO must include:
- `lo_id`
- `lo_title`
- `chunk_plan[]`
- `lo_test_mcq`
- `lo_test_short_answer`

Each chunk must include:
- `chunk_id`
- `chunk_index`
- `chunk_type`
- `learning_goal`
- `teaching_core`
- `teaching_word_count`
- `vocab_pack`
- `initial_recall_questions`
- `candidate_follow_up_modes`
- `candidate_deeper_question` nullable
- `misconception_codes`
- `repair_templates`
- `asset_injection`
- `microbreak_recommendation`
- `advance_threshold`

Each repair template must include:
- `misconception_code`
- `short_correction`
- `contrast_prompt`
- `retest_prompt`

Each guided version should also persist:
- `quality_score`
- `grade`
- `validation`
- `report`
- `status`
- `version_no`

## Runtime States

Allowed v1 states:
- `teach`
- `recall`
- `clarify`
- `retry`
- `transition`
- `microbreak`
- `summary`

Do not add extra runtime families or state trees in the rebuilt POC.

Important simplification rule:
- do not engineer for every edge case from the start
- use the minimum state needed to keep the lesson moving coherently

## Runtime Rules

Default v1 flow for a chunk:
1. pseudo-stream `teach`
2. continue in the same tutor turn with one `recall` question
3. classify learner response intent
4. if response is strong enough: `transition` then next chunk
5. if learner asks for clarification or asks about tutor wording: handle `clarify`, then restate or resume the active question
6. if response is weak: ask one simpler follow-up or one retry
7. advance according to simple good-enough progression rules
8. if chunk boundary is marked: optional inline image or `microbreak`

Default advancement rule:
- move on when the learner is good enough for now, not only when perfect
- good enough means one of:
  - at least 2 recall responses are acceptable
  - one repair loop produced an acceptable retry
  - the deeper follow-up shows understanding
  - the misconception is identified and flagged for later review
- do not hold the learner in the same chunk for repeated loops in the POC

Default content limits:
- teaching chunk: roughly 80-150 words
- tutor follow-up or retry turn: 20-70 words
- vocab turn: 20-60 words
- deeper question: optional, not routine
- microbreak exercise: after 2-4 chunks, not every chunk

## UI Behavior

The runtime UI must:
- use one shared session window
- show tutor turns and learner turns in the same thread
- keep input in the same surface
- avoid revealing the full lesson up front
- use a scrolling chat-style window first; richer layouts come later if needed
- provide lightweight chunk transitions
- make repair look like tutoring, not marking bureaucracy
- keep the first teaching turn and first recall question visually continuous where possible
- render images and diagrams inline inside the thread
- keep microbreak exercises inside the same session flow

Optional if cheap:
- progressive reveal
- continue / speed-up / replay controls

## API Responsibilities

The runtime needs endpoints or actions for:
- starting or restoring a session
- returning the next tutor turn
- submitting a learner turn
- evaluating correctness and misconception outcome
- completing or skipping a microbreak exercise
- ending a session cleanly

The API layer must make the next state explainable from stored lesson data plus learner outcome.

The response layer must not expose raw internal workflow language such as:
- `flagged for review`
- `advance rule`
- `repair loop`

Those states may exist internally, but tutor output must render them as natural tutoring language.

Debug requirement for the POC:
- full payload and thread inspection must be available in browser and server console
- this is required until the runtime feel is stable

## Telemetry Integration Points

The implementation must emit telemetry for:
- session start / resume / end / exit
- chunk start / complete / abandon
- tutor turn render
- learner turn submit
- learner-message classification
- correctness / misconception / repair
- microbreak start / complete / skip
- summary generation

The implementation must also support guided content governance telemetry:
- version created
- report stored
- status transition
- preview opened
- published runtime started

The runtime should not ship without these hooks.

## Acceptance Criteria

`guided_chunk_v1` is acceptable when:
- one real lesson runs end to end using the new frame
- learner and tutor interact inside one thread
- first chunk and first recall question feel like one live tutor turn
- bounded follow-up questioning works from learner answers
- clarification/meta turns do not get misread as content answers
- wrong answers trigger repair
- planned asset injection works
- optional microbreak exercise flow works
- telemetry captures the session lifecycle and turn outcomes
- the session can be linked to later lesson-review outcomes
- the runtime can be compared against the current lesson model
- guided drafts persist across reload in guided planner/admin
- grading reports are visible for generated guided versions

## Out Of Scope For V1

Do not implement in v1:
- full live lesson generation at runtime
- full personalization engine
- autonomous mastery-threshold tuning
- multi-agent orchestration
- full app-wide redesign
- broad migration of many lessons before one proves itself
