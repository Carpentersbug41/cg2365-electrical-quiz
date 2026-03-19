# Dynamic Guided Runtime V2

## Purpose

This document defines the new baseline model for the guided lesson rebuild.

It is intentionally simpler than the previous guided runtime architecture.
It captures what the system should do, not an over-engineered implementation plan.

This document exists because the previous guided runtime became too rigid, too constrained, and too inferior to a plain GPT tutoring loop. The rebuilt system must use GPT-class tutoring quality as the baseline and must beat that baseline to justify the product.

## Core Product Standard

The comparison baseline is not the old guided runtime.
The comparison baseline is a strong GPT tutoring prompt.

If the app cannot produce lessons that are better than GPT given a simple high-quality prompt, there is no reason to keep building complexity around it.

The new system must therefore be evaluated against:
- plain GPT tutoring from a simple prompt
- the current V1 lesson-generation quality bar
- measured learner outcomes

## Main Shift

The old guided model treated chunks as learner-facing final text.

The new model should treat chunks as instructions for the language model.

So:
- the lesson is still planned and chunked in advance
- but the stored chunk is a `teaching brief`, not the final tutor wording
- the runtime language model uses that brief plus conversation context to produce the actual tutor turn

This is the central design change.

## What Stays From V1

Keep from V1:
- the lesson planning methodology
- chunking discipline
- LO alignment
- pedagogic scoring priorities
- quality-control mindset
- microbreak and asset concepts where useful

Use the V1 scoring philosophy as the quality bar:
- beginner clarity
- teaching before testing
- marking robustness
- alignment to LO
- question quality

Do not keep the V1 block UI or old static lesson runtime.

## What The Runtime Should Do

For each chunk, the runtime should give the model:
- a concise system prompt
- the current chunk brief
- the relevant recent conversation history
- the learner tone/profile prompt
- the current lesson state

The model then produces:
- the actual teaching turn
- the required question(s)
- the natural transition into the next learner response

The important point is that the model should generate the visible tutor turn at runtime.
The chunk brief constrains the content, but the wording should remain live and natural.

## Chunk Brief Model

Each chunk should be stored as a structured brief.

A chunk brief should include at least:
- `chunk_id`
- `learning_goal`
- `concepts_that_must_be_taught`
- `concepts_not_to_skip`
- `misconceptions_to_watch`
- `required_questions`
- `optional_deeper_question`
- `asset_or_microbreak_marker`
- `progression_intent`
- `tone_notes`

The brief is not the final lesson text.
It is the instruction object that guides the tutor model.

## Prompt Philosophy

The new runtime should start with minimal constraint.

Use:
- a concise system prompt
- explicit chunk instructions
- learner tone/profile instructions
- recent conversation history

Do not start with:
- heavy evaluator logic
- complex outcome taxonomies
- large canned fallback trees
- aggressive branch engineering for every edge case

The rule is:
- let the model operate normally first
- constrain only when real failure appears

## Conversation Context

Conversation history is important.
The model should see recent tutor and learner turns so it can respond naturally.

The chunk brief gives structural guidance.
The conversation history gives continuity.

That combination is what should replace rigid prewritten lesson playback.

## Simplicity Rule

The rebuilt runtime should begin as a POC.

The initial system should only need enough state to track:
- current LO
- current chunk
- recent thread
- whether the learner is ready to move on

Do not try to solve every future failure before the first good lesson exists.

## Minimal Runtime Behavior

The first working version should support this loop:
1. load chunk brief
2. ask the model to produce the tutor turn from that brief
3. show the tutor turn in the shared thread
4. let the learner reply
5. ask the model to continue from the learner reply and current chunk brief
6. decide simply whether to:
   - move on
   - ask one more question
   - clarify
7. continue

That is enough for the POC.

## What Should Be Scored

The scoring system should judge actual teaching quality, not just structural validity.

The system should score:
- whether the chunk teaches clearly
- whether it teaches before testing
- whether the question is useful
- whether the tutor language is natural
- whether the chunk actually advances the LO
- whether the output would be competitive with GPT baseline output

The score should not be satisfied by:
- correct keywords alone
- valid JSON shape alone
- curriculum labels alone
- technical structure without good teaching

## A/B Principle

The product should explicitly compare:
- guided runtime output
- GPT simple-prompt baseline output

Possible comparison criteria:
- learner preference
- completion rate
- answer quality
- drop-off point
- fatigue markers
- LO test performance
- retention where available

The new system should be built with this comparison in mind from the start.

## Subject Tone

Different subjects need different tutor tone and level.

Examples:
- GCSE Biology should use age-appropriate, accessible science language
- C&G 2365 should sound vocational, practical, and technically precise

The tone/profile prompt should therefore be separate from the system prompt and separate from the chunk brief.

This is part of the runtime input, not an afterthought.

## Microbreaks And Assets

Microbreaks and images still belong in the design, but they are secondary.

They should be added only when they improve the lesson loop.
They should not be used to compensate for weak teaching.

The priority order is:
1. good tutor turn
2. good question flow
3. good progression
4. then assets and microbreaks where useful

## What To Remove From The Previous Guided Model

The rebuild should move away from:
- over-constrained evaluator layers
- rigid canned fallback phrasing
- excessive edge-case branching
- treating prewritten chunk text as the main learner experience
- optimizing the runtime before the lesson itself is good

## Build Principle

Build one excellent lesson first.

Then:
- test it
- compare it against GPT baseline
- inspect the payloads and full history
- identify actual failures
- add constraints only where those failures justify them

That is the correct order.

## Relationship To The Rest Of The Docs

This document is the current product-direction source for the guided rebuild.

Use it together with:
- `handbook.md`
- `prompt_pattern_to_superior_product.md`
- `handover_next_steps.md`

Do not treat older guided runtime specs as fixed if they conflict with this simpler model.
