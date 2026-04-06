# Scoring Model

## Purpose

Define the quality bar for the dynamic 2365 module.

This file defines the scoring architecture.

The current scoring target must match:
- [chunk_first_generation_plan.md](./chunk_first_generation_plan.md)

For the actual lesson-scoring rubric, use:
- [actual_lesson_rubric.md](./actual_lesson_rubric.md)

## Separation Rule

This scoring model applies to dynamic lessons only.
It does not score or redefine the authored static V1 lessons.

## Base Rubric

Use the existing weighted dimensions:
- beginner clarity `0-30`
- teaching before testing `0-25`
- marking robustness `0-20`
- alignment to LO `0-15`
- question quality `0-10`

## Score Split

The dynamic module uses three scores:
- `lesson score`
- `plan score`
- `fidelity score`

Only `lesson score` judges the actual lesson.

`plan score` and `fidelity score` are diagnostic.
They help explain why a lesson is good or weak, but they do not replace judgement of the lesson itself.

Apply the `lesson score` using the separate rubric doc so the standard stays consistent across lessons and reviewers.

## Consistency Requirement

Scoring should be rigid and consistent.

It is not the scorer's job to be inventive or stylistically flexible.
Its job is to apply the quality bar reliably across lessons and runs.

Scoring should not reward over-constrained runtime behavior.
If a lesson uses only the minimum guard rails needed for correctness and still supports strong live tutoring, that is the desired design.

## What Scoring Must Reward

A strong dynamic lesson should score well because it has:
- coherent core chunking
- good chunk-level teaching before questioning
- exactly 3 sharp checks in each core chunk
- one worthwhile deeper question inside each chunk
- corrective feedback potential inside each chunk
- strong misconception repair potential
- runtime-ready chunk context

When a chunk is explicitly planned as procedural or calculation-heavy, scoring should also reward:
- worked example to guided-practice continuity
- targeted practice that rehearses the procedure or calculation

## What Scoring Must Penalize

Scoring must penalize lessons that are weak even if the JSON looks valid.

That includes:
- generic or overloaded core chunks
- brittle or thin retrieval text
- worksheet-style bundled tasks in procedural extension stages when those stages are present
- lessons that cannot support natural repair loops
- lessons that are structurally correct but pedagogically inferior to a strong GPT baseline

## Chunk Standard

Scoring should judge chunk quality, not just stage presence.

That means asking:
- is each planned chunk narrow enough to teach and repair well?
- would the runtime have enough material to tighten learner wording properly?
- would a real tutor naturally stay on this chunk until secure?
- does the lesson progress from chunk teaching to application cleanly?

For question-only dynamic lessons, `marking robustness` means runtime-ready judgement support:
- clear question wording
- clear task framing
- enough anchor facts and key ideas for live judging
- enough constraints to distinguish partial, correct, and off-track replies

It does not require stored answer keys in the final artifact.

## Comparison Standard

The dynamic module should beat a simple GPT tutoring baseline on:
- coherence
- markability
- repair quality
- exam-language tightening
- progression discipline

If the generated lesson feels flatter, more bundled, or less adaptive than the GPT baseline, the score should reflect that.

## Acceptance Rule

The acceptance gate remains a quality-control mechanism for the dynamic module.

Scores should only be trusted if they reflect real teaching quality, not just structure.
Rejected drafts should still surface:
- score
- issue list
- phase feedback
- rejection reason

That feedback should make it obvious whether the next fix belongs to:
- generation prompts
- scoring prompts
- schema / representation

Scoring should remain stable even when runtime tutoring is intentionally more adaptive.
Scoring temperature should be pinned to `0` for repeatability.
The tutor may be loose in delivery.
The score should not be loose in judgement.

## Repair And Publish Rule

The live system now separates:
- repair target
- publish floor
- hard rejection floor

Current rule:
- unrepaired draft must clear the normal acceptance gate
- repaired lesson should still aim for `90+`
- repaired lesson is publishable at `80+`
- repaired lesson is rejected only if its best repaired score stays below `80`

Interpretation:
- `90+`
  - strong target
  - publish
- `80-89`
  - publishable after repair
  - below target, but above the minimum floor
- `<80`
  - reject after repair

This means:
- `90` is still the repair target
- `80` is the repaired publish floor

## Best-State Retention

The repair loop must keep the best valid repaired candidate seen during the run.

It must not simply keep the latest accepted repair state.

Reason:
- later accepted patches can lower the score
- the final published artifact should come from the highest valid repaired score reached in that run

So the live pipeline now uses:
- current working draft for continued repair exploration
- best repaired draft for final publish/reject decision

## Chunk-First Interpretation

For default concept chunks, scoring should not penalize the lesson for lacking:

- guided practice
- practice
- integrative

Those are no longer universal requirements.

They only become scoring expectations when the lesson plan explicitly marks the chunk as:

- `procedure`
- `calculation`

## Release Interpretation

For dynamic generation, the score split should be read like this:
- `lesson score`
  - release gate
  - this must clear the benchmark threshold
- `plan score`
  - planning diagnostic
  - should stay high, but does not rescue a weak lesson
- `fidelity score`
  - plan-following diagnostic
  - should stay high, but does not rescue a weak lesson

## Planner Diagnostic Standard

`plan score` should penalize thin planning, not just wrong planning.

Typical planner deductions should include:
- too few concrete in-scope anchors for the chunk count
- no out-of-scope boundaries
- no delivery constraints
- missing misconceptions on teach/check chunks
- missing later-stage objectives
- weak worked-example to guided-practice pairing
- source-grounding too thin to support the planned scope

The intent is:
- a weak plan should no longer receive a flattering `100`
- a strong plan should surface as `100` or close to it consistently on fresh runs
- once `plan score` is stabilized, remaining failures should mostly show up in `lesson score`

The benchmark thresholds and lesson set for the current pass are defined in:
- [generation_benchmark_gate.md](./generation_benchmark_gate.md)
