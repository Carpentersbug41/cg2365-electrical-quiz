# Guided Chunk Generation Pipeline Spec

## Purpose

This document defines the separate generation pipeline for the guided chunk runtime.

It exists because the new runtime is not a block-based lesson page. It is a conversational lesson frame designed for a scrolling tutor window. The existing static lesson generator should remain intact. This pipeline should be built and operated separately.

## Why A Separate Pipeline Exists

The current lesson generator produces page-oriented lessons with:

- `layout`
- `blocks[]`
- long explanation blocks
- fixed practice blocks
- embedded diagrams and microbreaks as page components

The guided chunk runtime needs a different output:

- LO-by-LO conversational flow
- short teaching chunks
- pre-generated first questions
- dynamic follow-up questioning
- inline asset and microbreak injection points
- fluid progression rules

The two systems can share assets and supporting logic, but they should not share the same generation target.

The same rule applies at workflow level:
- do not mix guided generation controls into the old static lesson authoring UI
- do reuse strong syllabus extraction, LO extraction, AC coverage, and blueprint planning upstream
- then diverge into guided-only generation and guided-only moderation

## Output Contract

The guided chunk pipeline should output a `guided_chunk_frame`.

Top-level fields:

- `lesson_id`
- `runtime_version`
- `variant_id`
- `unit`
- `topic`
- `source_refs`
- `lo_sequence[]`
- `global_assets[]`
- `metadata`

The generated lesson data must also define the ordered runtime step sequence.
That means the generated artifact, not the runtime, should decide:

- how many `teach_check` sections exist
- what comes after the final `teach_check`
- which sections are gated by `feedback_deeper`
- what the next section is when a gate clears
- whether a `worked_example` stage appears
- whether later `guided_practice`, `practice`, and `integrative` stages appear

Each LO should include:

- `lo_id`
- `lo_title`
- `success_criteria`
- `chunk_plan[]`
- `lo_test_mcq`
- `lo_test_short_answer`
- `review_hooks`

Each chunk should include:

- `chunk_id`
- `chunk_index`
- `learning_goal`
- `teaching_core`
- `teaching_word_count`
- `vocab_pack`
- `initial_recall_questions`
- `candidate_follow_up_modes`
- `deeper_question`
- `deeper_answer_targets`
- `misconception_codes`
- `repair_templates`
- `asset_injection`
- `microbreak_after`
- `advance_rule`
- `progression_rule`
- `next_step_id`

For the current prototype, `progression_rule` should stay minimal:

- `auto`
- `feedback_deeper`

`next_step_id` should point to the next generated step in the lesson sequence.

Important rule:
- progression metadata belongs in the structured generated lesson data
- it should not be rendered into the attachment prose sent to the model
- the attachment should carry teaching content and answer targets, not runtime control text

Each repair template should include:

- `misconception_code`
- `short_correction`
- `contrast_prompt`
- `retry_prompt`

The generated frame is not the only persisted artifact. The pipeline should also produce and persist:
- quality score
- score breakdown
- score issues and suggested fixes
- refinement notes
- validation result

That report is part of the operating model because the generator is expected to be tightened iteratively from evidence, not guesswork.

## Static Vs Dynamic In This Pipeline

### Pre-generated

- LO order
- chunk sequence
- runtime step sequence
- teaching chunks
- first recall questions
- deeper-question candidates
- repair patterns
- microbreak insertion points
- image and diagram insertion points
- LO-end MCQ test
- LO-end short-answer test

### Generated at runtime

- short tutor reaction to the learner answer
- follow-up question selection and wording
- repair wording
- transition language
- whether to probe once more or move on

The rule is simple: pre-generate the frame, generate the moment.

For this prototype, the generated frame should be able to say, in structured data, for example:

- `Intro -> Teach/Check 1`
- `Teach/Check 1 --feedback_deeper--> Teach/Check 2`
- `Teach/Check 2 --feedback_deeper--> Worked Example`
- `Worked Example --worked_example_feedback--> Guided Practice`
- `Guided Practice -> Practice -> Integrative`
- `Integrative --integrative_feedback--> lesson complete`

For `worked_example_feedback`, the clean runtime pattern is:
- server returns gate control only when the learner is ready
- client auto-requests the next visible step
- no hidden second tutor message should be generated inside the same server response

The runtime should follow that generated structure rather than guessing the lesson shape.

`spaced_review` should not be treated as the closing step of the live lesson arc in this prototype.
It is better handled as separate prerequisite retrieval or later review logic.

## Presentation Model

The guided chunk runtime should present the pre-generated frame as if the tutor is composing it live.

That means:

- tutor text should pseudo-stream
- the teaching chunk and first question should usually appear in the same tutor turn
- the runtime should stay inside one scrolling tutor window
- the learner should never see the full lesson upfront
- images and microbreaks should appear inline at planned points

This is a performance layer, not unconstrained live generation.

## Advancement Rules

Chunk progression should be fluid, not rigid.

Default move-on rule:

- advance when the learner is good enough for now

In v1, a chunk is considered good enough when any one of these is true:

- the learner answers at least 2 of the initial recall questions acceptably
- the learner answers one recall question weakly, gets one repair, then answers the retry acceptably
- the learner demonstrates correct understanding in the deeper follow-up
- the learner remains weak, but the misconception has been identified and flagged for later review

Do not trap the learner in a chunk indefinitely.

If the learner is still shaky after one repair loop:

- flag for spaced review
- move on with a light transition

## Phase 1-13 Pipeline

### Phase 1. Scope and source grounding

Generate:

- exact unit/topic scope
- allowed sources
- forbidden out-of-scope content

### Phase 2. LO extraction and ordering

Generate:

- LO list
- LO order
- prerequisite relationships

### Phase 3. LO teaching map

Generate per LO:

- what must be taught
- what must not be taught
- success criteria
- likely pain points

### Phase 4. Chunk planning

Generate:

- chunk count per LO
- chunk goal
- target word count
- chunk order

Output should be an LO scaffold, not just a loose chunk count. Each scaffold should define:
- chunk goal
- must-teach concepts
- must-not-repeat concepts
- vocab target
- misconception target
- deeper-question focus
- assessment focus

### Phase 5. Vocab planning

Generate:

- just-in-time vocab per chunk
- beginner-safe definitions
- confusions to watch
- reuse points

### Phase 6. Teaching core generation

Generate:

- sequential chunk drafts inside each LO
- 100-150 word teaching core per chunk
- one main idea per chunk
- beginner-safe phrasing
- with all prior chunks for that LO passed in history/context

Do not generate all chunks in one unconstrained pass. The generator should:
1. build the LO scaffold
2. generate chunk 1
3. append chunk 1 to LO history
4. generate chunk 2 with chunk 1 in history
5. continue until the LO is complete

### Phase 7. Initial recall bank generation

Generate:

- 2-3 short-answer questions per chunk
- ordered easiest to harder
- grounded only in the chunk and prior taught material

### Phase 8. Deeper question generation

Generate:

- one deeper question when useful
- transfer or connection style
- short-answer format
- accepted deeper answer targets

Important rule:
- the deeper question should be part of the generated attachment/frame
- it should not be invented on the fly by the runtime prompt
- the runtime may word its surrounding feedback naturally, but the deeper question itself should come from the generated artifact
- the generated artifact should also carry the answer targets needed to judge the deeper response

### Phase 9. Misconception and repair generation

Generate:

- misconception codes
- expected weak answers
- short correction
- contrast prompt
- retry prompt

### Phase 10. Asset injection planning

Generate:

- image or diagram insertion points
- why the asset helps
- which chunk it supports

### Phase 11. Microbreak planning

Generate:

- whether a microbreak is needed
- where to place it
- what exercise type fits

### Phase 12. LO-end assessment generation

Generate:

- MCQ set
- short-answer set
- only on taught material

### Phase 13. Frame assembly and validation

Assemble:

- final `guided_chunk_frame`
- runtime metadata
- version identifiers

Validate:

- LO coverage
- chunk length
- beginner clarity
- untaught-content leakage
- repair quality
- runtime coherence
- cross-chunk overlap
- duplicate recall prompts
- malformed repair templates
- weak assessment alignment

## Subject Profiles

The platform should use one shared generator engine with subject-specific profiles and refinement layers.

Do not create one totally separate generator per subject.

Correct architecture:
- shared generator engine
- subject profile
- subject scaffold rules
- subject refinement layer
- subject scoring overlay

Current important profiles:
- `gcse-science-biology`
- `cg2365`

`cg2365` specifically needs:
- electrical vocab enrichment
- electrical misconception libraries
- electrical question-shaping rules
- electrical asset preferences
- shorter paragraphing for dense technical paths

## Promotion And Report Persistence

Guided generation is not complete when a frame is assembled.

The pipeline should also:
1. create a guided draft version
2. persist the frame and report together
3. expose the report in guided admin
4. allow regeneration into a new version without deleting older versions

This matters because the system is explicitly designed to improve generation quality by comparing reports across versions.

## Shared Infrastructure With The Old System

The new pipeline may reuse:

- diagrams and image assets
- vocab extraction ideas
- prerequisite logic
- microbreak catalog
- lesson scoring concepts
- source-grounding utilities

It should not reuse the old lesson object as its primary output target.

## First Build Principle

First build the guided chunk lesson frame and render it in a simple scrolling tutor window.

Do not try to match the full static lesson UI first.
Do not try to migrate old lessons directly without conversion.
Do not try to make the new runtime consume `blocks[]` as if that were the final target format.
