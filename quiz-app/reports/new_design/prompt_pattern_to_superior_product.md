# Prompt Pattern To Superior Product

## Purpose

This document records a major product finding: a simple prompt-based tutoring loop may currently produce a better learner experience than the app's existing lesson runtime.

The goal is not to replace the app with a raw GPT prompt. The goal is to extract the winning teaching pattern from the prompt and build a stronger product around it.

Read this after `handbook.md` and before `implementation_spec.md`.

## The Prompt Benchmark

The prompt benchmark is a syllabus-grounded tutor flow with these properties:

- restricted to one unit or LO set
- breaks the unit into LOs
- teaches one LO in short chunks
- presents about 150-200 words at a time
- asks 3 short-answer questions after the chunk
- asks one deeper follow-up question
- repeats the loop until the LO is complete
- ends the LO with a test on taught material only

In practice, the learner experiences:

- a small amount of text
- immediate interaction
- a visible sense of progress
- one continuous tutor voice
- no large page of content to process at once

## What The Prompt Is Doing Better

The prompt benchmark appears to outperform the current app runtime because of interaction design, not because the content is necessarily better.

The likely advantages are:

- better pacing
- lower cognitive load per step
- faster move from reading to retrieval
- less UI friction
- more obvious tutor continuity
- less dead time between teaching and interaction

The critical lesson is that a simple teaching loop can beat a more elaborate product if the simple loop keeps attention, reduces fatigue, and maintains active recall.

## What This Does Not Mean

This does not mean:

- the app architecture was a mistake
- the app should be replaced by freeform chat
- grounding, diagnostics, telemetry, and review logic are unimportant
- more live generation is automatically better

The prompt is good at delivery. The app is still the better place for:

- curriculum control
- lesson quality control
- measurable mastery and review logic
- structured microbreak insertion
- versioned prompt and UI experiments
- telemetry-driven redesign

The correct move is to preserve the prompt's teaching rhythm and combine it with the app's stronger instructional infrastructure.

## Working Product Hypothesis

The likely winning product is:

- one shared tutor and learner thread
- one short teaching chunk at a time
- immediate recall after each chunk
- short tutor response to the learner's answer
- deeper question only when instructionally useful
- optional microbreak exercise at planned boundaries
- images or diagrams only when they materially improve understanding
- end-of-LO test on taught material only
- spaced review after the session

The learner should feel that the lesson is unfolding live. Under the hood, the runtime should still be bounded, pre-generated, measurable, and curriculum-grounded.

## Design Rules

The app should follow these rules if it wants to outperform the prompt benchmark:

- Keep the runtime in one tutor thread.
- Do not dump the full lesson on the screen.
- Keep each teaching turn short.
- Move from teaching to retrieval quickly.
- Make repair feel like tutoring, not marking.
- Use microbreak exercises to reduce fatigue, not to decorate the product.
- Use images and diagrams only when they clarify the concept being taught.
- Keep the shell visually quiet so inserted activities can carry their own visual weight.
- Add only features that improve learning or reduce friction.

## Anti-Patterns

The app should avoid:

- walls of explanatory text
- static blocks of many questions shown at once
- assessment on untaught material
- fully unconstrained live lesson generation
- decorative gamification that interrupts the teaching loop
- UI chrome that competes with the lesson thread
- adding multiple new variables at once and then claiming a win

## Implications For Guided Chunk V1

`guided_chunk_v1` should stay very close to the prompt benchmark in shape.

That means:

- teaching chunks should stay short
- recall should happen immediately
- tutor responses should be brief and specific
- deeper questions should be selective, not constant
- microbreak exercises should be sparse and purposeful
- the end-of-LO test should only cover taught material

The app does not need to feel more complex than the prompt. It needs to feel more effective while preserving the same simplicity of use.

## What The App Should Add

The app should add the things the prompt cannot do well on its own:

- reliable curriculum coverage
- structured lesson frames
- quality control on generated content
- telemetry at turn, chunk, session, and review level
- review and spacing logic
- measurable microbreak timing experiments
- safe versioning of prompt, layout, and runtime changes

These additions only matter if they preserve the underlying teaching rhythm.

## Measurement Implications

Because of this finding, the product must explicitly measure whether the app is actually better than the prompt benchmark.

Track at minimum:

- completion rate by chunk and LO
- exit point by chunk
- response latency drift across the session
- answer quality after text-heavy chunks
- repair success rate
- post-microbreak recovery
- end-of-LO test performance
- delayed review performance
- learning gain per minute
- prompt-style versus app-runtime comparisons

The benchmark is not "does the app look richer?" The benchmark is "does the app beat the prompt on learning, fatigue, and completion without losing control?"

## Strategic Conclusion

The prompt benchmark should be treated as:

- a product benchmark
- a runtime reference
- a specification in disguise

If a plain prompt currently feels better than the app, the right response is not defensiveness. The right response is to preserve what makes the prompt strong, then add only the product structure that measurably improves learning and iteration.
