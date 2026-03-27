# Runtime Model

## Purpose

Define how the dynamic runtime should deliver a lesson conversationally.

## Separation Rule

This runtime model applies to the dynamic module only.
It does not govern the static V1 authored lesson runtime.

## Runtime Inputs

For each tutor turn, give the model:
- a concise system prompt
- the learner tone/profile prompt
- the current lesson step as grounding
- the recent conversation history
- the current lesson position and feedback phase

## Runtime Objective

The runtime should make one planned core chunk feel like natural tutoring.

The runtime should be the loosest layer in the system.
Its job is not structural consistency.
Its job is live explanation, clarification, repair, and progression judgement within the lesson guard rails.

Those lesson guard rails should be minimal.
They should define boundaries, not delivery style.
The runtime should have freedom inside those boundaries to explain, rephrase, and repair naturally.

That means it must be able to:
- teach one idea
- check understanding
- give corrective feedback
- stay on the same chunk while the learner is confused
- only progress when that chunk is secure enough

## Core Chunk Delivery

A planned core chunk is usually stored as one `teach_check` step.

At runtime, that one step may expand into multiple tutor turns:
1. teaching plus 3 short-answer checks
2. feedback on those checks
3. one deeper probe when appropriate
4. one or more repair turns if the learner is still confused

The runtime should not confuse:
- number of stored chunks
- number of learner turns needed to finish the chunk

## Minimal State

Track only what is needed for progression:
- current step index
- current section phase (`teach`, `feedback_basic`, `feedback_deeper`, `worked_example_feedback`, or `integrative_feedback`)
- recent thread

The lesson artifact should continue to carry:
- ordered step sequence
- `progressionRule`
- `nextStepId`

## Prompt Philosophy

The prompt should support natural tutoring, not scripted page reading.

It should:
- teach before testing
- stay on the current chunk only
- tighten learner wording toward exam language
- repair misunderstanding directly
- avoid jumping forward just because a stored step exists after this one

It should not sound like the generation layer.
The generator should be rigid.
The runtime should be adaptive and natural.

Do not add runtime guard rails whose main effect is to make the tutor wording more scripted.
Guard rails are justified only when they protect correctness, scope, required terminology, or safe progression.

## Current Prompt Separation

The current prompt split can stay minimal:
1. `intro`
2. `teach_check`
3. `feedback_basic` and `feedback_deeper`
4. `worked_example`
5. `worked_example_feedback`
6. `guided_practice` and `practice`
7. `integrative` and `integrative_feedback`

This split is a runtime control mechanism.
It should not be mistaken for the real pedagogic chunk count.

## Progression Rule

The runtime should move on when the learner is secure enough on the current chunk, not just because one reply happened.

That means:
- `feedback_basic` should tighten and probe
- `feedback_deeper` should decide whether to repair again or advance
- worked example feedback should decide whether the learner is ready to try one themselves
- integrative feedback should decide whether the final synthesis is good enough

## Comparison Standard

The runtime should be judged against a strong GPT tutoring baseline.

A good runtime lesson should feel:
- natural
- corrective
- adaptive
- chunked tightly enough to avoid overload
- flexible enough to stay on the misconception that actually appeared

That is where naturalness matters most.
If the system is going to feel better than a plain GPT tutoring session, it will be because the runtime layer handles the live turn well.
