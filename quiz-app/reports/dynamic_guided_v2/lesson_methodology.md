# Lesson Methodology

## Purpose

Define the pedagogic sequence to copy from V1.

## Canonical Sequence

1. `outcomes`
2. `vocab`
3. `diagram` if needed
4. `explanation_a`
5. `check_a`
6. `worked_example_a` if needed
7. `guided_practice_a` if needed
8. `explanation_b` optional
9. `check_b` optional
10. `worked_example_b` if needed
11. `guided_practice_b` if needed
12. `practice`
13. `integrative`
14. `integrative_feedback`

`spaced_review` should be treated separately as prerequisite retrieval or later review logic, not as the closing step of the live lesson arc.

## Why This Sequence

It preserves the V1 teaching logic:
- orient the learner
- define the language
- ground the concept visually if useful
- teach before testing
- check understanding quickly
- model the process if needed
- scaffold learner practice
- move toward independence
- connect ideas together
- run a final synthesis check with repair if needed

## New Runtime Interpretation

These are not page blocks in V2.
They are instructional roles in a conversational lesson spec.

The runtime should express them through tutor turns, learner responses, and inline assets.

In the current 2365 dynamic system, this sequence is planned either:
- from native dynamic blueprints created in `/2365/admin/dynamic-module`
- or directly from grounded lesson source in `/2365/admin/dynamic-generate`

## Important Runtime Interpretation

In the new runtime, `vocab` is usually not a separate learner-facing phase.

Instead:
- the V1 vocab block remains useful as source material
- key terms are normally introduced inside `teach/check` chunks
- only create a separate vocab activity if it materially improves understanding

So the old V1 sequence is still the pedagogic reference, but the runtime delivery can merge:
- `vocab`
- `explanation`
- `check`

into one teaching/checking loop.

## Old Roles vs New Stages

The old V1 model gives us `roles`.
The new runtime adds `stages`.

Typical mapping:

- `outcomes` -> `intro`
- `vocab` -> `teach_check`
- `diagram` -> `teach_check`
- `explanation_*` -> `teach_check`
- `check_*` -> `teach_check`
- `worked_example_*` -> `worked_example`
- `guided_practice_*` -> `guided_practice`
- `practice` -> `practice`
- `integrative` -> `integrative`
- `integrative_feedback` -> `integrative_feedback`

For the current prototype, each `teach_check` section expands at runtime into:

- `teach_check`
- `feedback_basic`
- `feedback_deeper`

Only `feedback_deeper` is the progression gate for the repeated concept loop.

After the final `teach_check` loop, the live lesson arc becomes:

- `worked_example`
- `worked_example_feedback`
- `guided_practice`
- `practice`
- `integrative`
- `integrative_feedback`

This is the key shift:
- old model = block type / instructional role
- new model = role plus pedagogic stage for prompt handover

## Conditional Items

`diagram`, `worked_example_*`, and `guided_practice_*` should only appear when the topic actually needs them.

Use them for:
- process
- wiring flow
- calculations
- procedural sequencing
- dense physical distinctions

Do not force them into every lesson.
