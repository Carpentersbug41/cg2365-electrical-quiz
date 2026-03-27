# Lesson Spec

## Purpose

Define the stored lesson object for the dynamic 2365 module.

The stored object is a runtime teaching spec, not final learner-facing prose.
It should preserve the planned core-chunk structure clearly enough that the runtime can teach, check, repair, and progress without inventing the lesson shape.

## Separation Rule

This spec applies only to the dynamic lesson system.

It does not replace the authored static lesson schema used in `src/data/lessons/2365`.

## Design Rule

The stored object should represent two layers at once:
- pedagogic layer: planned core chunks and later application stages
- runtime layer: explicit ordered stages for prompt handover

The pedagogic source of truth is the core chunk.
The runtime stages are the way that chunk is delivered conversationally.

## Top-Level Shape

Each lesson should contain:
- `lessonId`
- `lessonCode`
- `title`
- `subject`
- `unit`
- `audience`
- `tonePrompt`
- `los[]`

## LO Shape

Each LO should contain:
- `loId`
- `loTitle`
- `steps[]`

## Step Shape

Each step should contain enough information to support:
- one clear teaching move
- its checks or task
- its answer guidance
- misconception repair
- deterministic prompt handover

The currently important stored fields remain:
- `stepId`
- `role`
- `stage`
- `title`
- `learningGoal`
- `conceptsMustTeach[]`
- `conceptsNotToSkip[]`
- `requiredQuestions[]`
- `optionalDeeperQuestion`
- `misconceptionsToWatch[]`
- `toneNotes[]`
- `assetMarker`
- `microbreakMarker`
- `progressionIntent`

## Stage Model

The current important stored stages remain:
- `intro`
- `teach_check`
- `worked_example`
- `guided_practice`
- `practice`
- `integrative`

The important runtime feedback phases remain:
- `feedback_basic`
- `feedback_deeper`
- `worked_example_feedback`
- `integrative_feedback`

These stages should be understood as runtime delivery stages, not as the pedagogic model itself.

## Core Chunk Rule

A planned core chunk should usually map to one `teach_check` step.

That step must carry enough detail for the runtime to do all of this without inventing content:
- teach the current idea
- ask 3 short-answer checks
- give basic feedback
- ask or resolve one deeper probe
- remain in repair if the learner is still confused

The runtime may spend multiple turns inside the same stored `teach_check` step.
That does not mean the lesson needs more planned chunks.

## Ordering Rule

The runtime must display and process steps in stored array order.
No hidden reordering.

The normal ordered shape is:
- `Intro`
- `Teach/Check 1...N`
- `Worked Example`
- `Guided Practice`
- `Practice`
- `Integrative Close`

Where `N` is normally `4-6` core chunks at planning time.

## Naming Rule

Step titles should make the lesson structure obvious.
Use labels like:
- `Intro`
- `Teach/Check 1`
- `Teach/Check 2`
- `Worked Example`
- `Guided Practice`
- `Practice`
- `Integrative Close`

The title should help the runtime and debug surfaces audit the lesson shape, but the pedagogic quality should come from the step content, not the label itself.

## Prompt Boundary Rule

The current prompt handover can stay minimal:
- Prompt 1 for `intro`
- Prompt 2 for `teach_check`
- Prompt 3 for `feedback_basic` and `feedback_deeper`
- Prompt 4 for `worked_example`
- Prompt 5 for `worked_example_feedback`
- Prompt 6 for `guided_practice` and `practice`
- Prompt 7 for `integrative` and `integrative_feedback`

That prompt split exists to support runtime control.
It should not force the planner to think in brittle page-block terms.
