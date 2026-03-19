# Lesson Spec

## Purpose

Define the stored lesson object for the new module.

## Rule

The stored object is a runtime spec, not final lesson prose.
It must support section-level retrieval cleanly.
Versioned lesson drafts can be produced by:
- the native dynamic module planner
- or the manual dynamic lesson generator

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

Each step should contain:
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

For the first implementation, the important stored `stage` values are:
- `intro`
- `teach_check`
- `worked_example`
- `guided_practice`
- `practice`
- `integrative`

The important runtime feedback phases are:
- `feedback_basic`
- `feedback_deeper`
- `worked_example_feedback`
- `integrative_feedback`

## Roles

Allowed roles initially:
- `outcomes`
- `vocab`
- `diagram`
- `explanation`
- `check`
- `worked_example`
- `guided_practice`
- `practice`
- `integrative`
- `spaced_review`

## Ordering Rule

The runtime must display and process steps in stored array order.
No hidden reordering.

## Naming Rule

The attachment should make stage boundaries obvious.

Use labels like:
- `Teach/Check 1`
- `Teach/Check 2`
- `Guided practice 1`
- `Practice 1`
- `Integrative 1`

Do not leave the runtime to infer the pedagogic phase from vague titles.

## Prompt Boundary Rule

The current clean prompt handover is:
- Prompt 1 for `intro`
- Prompt 2 for `teach_check`
- Prompt 3 for `feedback_basic` and `feedback_deeper`
- Prompt 4 for `worked_example`
- Prompt 5 for `worked_example_feedback`
- Prompt 6 for `guided_practice` and `practice`
- Prompt 7 for `integrative` and `integrative_feedback`

## Current Practical Rule

For now, structure the attachment so the stage boundary is obvious.

Use:
- `Intro`
- `Teach/Check 1`
- `Teach/Check 2`
- `Worked Example`
- `Worked Example Feedback`
- `Guided Practice`
- `Practice 1`
- `Integrative 1`

This makes the runtime simpler and keeps the prompt handover auditable.

The immediate goal is not a perfect final schema.
It is a clean attachment format that supports:
- Prompt 1 for introduction
- Prompt 2 for the teach/check cycle
- Prompt 3 for the feedback cycle
- Prompt 4 for worked example
- Prompt 5 for worked example feedback
- Prompt 6 for guided and independent practice
- Prompt 7 for integrative close and its feedback
- one retrieved section at a time
