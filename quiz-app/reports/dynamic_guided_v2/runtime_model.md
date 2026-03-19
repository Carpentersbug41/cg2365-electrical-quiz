# Runtime Model

## Purpose

Define the minimal runtime model for the rebuild.

## Runtime Inputs

For each tutor turn, give the model:
- a concise system prompt
- the learner tone/profile prompt
- the current attached lesson section
- the recent conversation history
- the current lesson position through the selected section

## Runtime Outputs

The model produces:
- the visible tutor teaching turn
- the required question(s)
- the next conversational reply only

## Minimal State

Track only:
- current step index
- current section phase (`teach`, `feedback_basic`, `feedback_deeper`, `worked_example_feedback`, or `integrative_feedback`)
- recent thread

Do not add evaluator states or hidden progression counters.

The lesson artifact should carry the ordered step sequence and minimal progression metadata.
For this prototype, that means each generated step can define:

- `progressionRule`
- `nextStepId`

The runtime should read that structure rather than guessing:
- how many `teach_check` sections the lesson contains
- what comes after the final `teach_check`
- which steps are gated by `feedback_deeper`

## Prompt Philosophy

Start with minimal constraint and mirror the proven GPT baseline.

Use:
- concise role instruction
- fixed lesson scope
- current attached lesson context
- tone prompt
- recent history

Do not start with:
- rigid canned fallbacks
- dense hidden branching
- edge-case trees

Add constraints only after seeing real failure.

## Current Prompt Shape

The first runtime should stay close to:

- expert tutor for the target course
- teach the requested unit only
- use the attached lesson context as grounding, not as a script
- teach before testing
- never ask about untaught material

The lesson artifact carries the structure.
The runtime prompt should stay short.

## Prompt Separation

The active runtime keeps the split minimal:

1. `Prompt 1: intro`
2. `Prompt 2: teach/check prompt`
3. `Prompt 3: feedback prompt`
4. `Prompt 4: worked example prompt`
5. `Prompt 5: worked example feedback prompt`
6. `Prompt 6: apply prompt`
7. `Prompt 7: integrative feedback prompt`

`Prompt 1` handles:
- welcome
- lesson orientation
- natural presentation of the outcomes
- explanation of how the session will work
- no main teaching chunk yet

`Prompt 2` handles the teaching turn for the current retrieved section.

`Prompt 3` handles the learner's answers on the current section in two passes:
- `feedback_basic`: feedback on the 3 short questions and asking the attached deeper question
- `feedback_deeper`: feedback on the deeper answer and deciding whether the learner is ready to move on

`Prompt 4` handles the current worked example only.

`Prompt 5` handles `worked_example_feedback`.

`Prompt 6` handles the later task stages:
- `guided_practice`
- `practice`
- `integrative`

`Prompt 7` handles `integrative_feedback`.

The current lesson cycle is:
1. intro turn once
2. retrieve one lesson section
3. `teach_check` turn on that section with 3 short questions
4. learner reply
5. `feedback_basic` turn on that same section
6. the deeper question is taken from the attached lesson section, not generated on the fly
7. learner replies to the deeper question
8. `feedback_deeper` decides:
   - stay on `feedback_deeper`
   - or move to the next generated step
9. if the next step is `worked_example`, run the worked example prompt
10. the learner replies and `worked_example_feedback` decides whether they are ready to try one themselves
11. if `worked_example_feedback` resolves, the client auto-requests the next visible step
12. then continue to `guided_practice`, `practice`, and `integrative` as defined by the lesson data
13. after `integrative`, run `integrative_feedback` as the final lesson gate

The app controls progression from the tiny control output returned by the active feedback phase.

In this prototype, the app should combine:
- the generated lesson step metadata
- the active feedback control output

That means:
- the lesson data defines the sequence
- the active feedback phase decides whether a gated step is complete
- the runtime then follows the generated `nextStepId`
- for `worked_example_feedback`, the server returns only control metadata on resolve and the client immediately requests the next visible tutor turn

`spaced_review` is not part of the active lesson arc for this prototype.
Treat it as separate prerequisite retrieval or later review logic.

Do not add:
- evaluator layers
- hidden progression machinery

## Current Runtime Surfaces

The active 2365 runtime surfaces are:
- `/2365/dynamic-guided-v2/[lessonCode]?versionId=...`
- `/2365/simple-chatbot?lessonMode=1&lessonCode=...&dynamicVersionId=...`

`simple-chatbot` remains the main comparison/debug surface.

Baseline mode:
- minimal runtime
- system prompt plus user profile tone
- optional attached grounding document

Lesson mode:
- the same runtime path
- one intro turn
- one retrieved lesson section at a time

These surfaces consume versioned dynamic lesson drafts created by:
- the native dynamic module planner
- or the manual dynamic lesson generator

## Immediate Next Step

Do not add more runtime logic first.

Next:
- attach a scored lesson artifact generated from the module/lesson pipeline
- compare output quality against plain GPT
- optimize the attachment and prompt until first chunks score `90+`, then `95+`
- keep feedback and correction simpler than the main explanation language

## Thread Principle

The learner must experience one shared tutor window.
The tutor and learner stay in the same conversation thread.
