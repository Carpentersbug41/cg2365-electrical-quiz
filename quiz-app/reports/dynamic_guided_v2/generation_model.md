# Generation Model

## Purpose

Define how lessons should be generated for the new module.

## Generation Principle

Generate the lesson attachment first.
Do not generate final learner-facing paragraphs as the source of truth.

The attachment is a scored teaching artifact that will later be used as runtime grounding.
It is not the final visible lesson output.

## Supported Generation Flows

There are now two supported dynamic generation entry points:

1. Native module-planner flow
- use `/2365/admin/dynamic-module`
- plan native dynamic blueprints directly from source text
- select one native blueprint
- generate a versioned dynamic lesson draft from that blueprint

2. Manual lesson-generator flow
- use `/2365/admin/dynamic-generate`
- provide grounded source text for a single lesson
- generate a versioned dynamic lesson draft directly

In both flows, generation should ensure each step has:
- role
- goal
- core concept
- key facts
- example or application where needed
   - required question targets
   - misconceptions where useful
Then:
- score the generated lesson artifact with the V1-style rubric
- only then use it at runtime as grounded context

## Current Phase Model

Dynamic lesson generation now follows a V1-aligned 13-phase flow:

1. `Phase 1 Planning`
2. `Phase 2 Vocabulary`
3. `Phase 3 Explanation`
4. `Phase 4 Understanding Checks`
5. `Phase 5 Worked Example`
6. `Phase 6 Practice`
7. `Phase 7 Integration`
8. `Phase 8 Spaced Review`
9. `Phase 9 Assembler`
10. `Phase 10 Score`
11. `Phase 11 Suggest Fixes`
12. `Phase 12 Refine`
13. `Phase 13 Rescore & Accept/Reject`

The runtime lesson artifact still stays in the `DynamicGuidedV2Lesson` schema.
The V1 parity is in prompt discipline, phase separation, scoring, and accept/reject rigor.

## Acceptance Gate

Dynamic generation now uses the stricter V1-style acceptance philosophy:

- validation failures are hard failures
- scoring is weighted:
  - beginner clarity `30`
  - teaching before testing `25`
  - marking robustness `20`
  - alignment to LO `15`
  - question quality `10`
- refinement runs only when:
  - score is below `91`
  - or validation fails
- a draft is only saved as a runnable version if:
  - final score is `95+`
  - validation passes
  - there are no protected score-domain regressions

Rejected drafts should still return:
- score
- validation
- phase artifacts
- rejection reason

But they should not be saved as current runnable lesson versions.

## Conversation History In Generation

When generating later explanation/check/worked-example steps, prior relevant steps can be included as context.

But the generation target remains the attachment / step brief, not the final tutor wording.

## Attachment Rule

The runtime should not consume raw V1 lesson JSON directly if that causes the model to shadow authored prose.

The preferred path is:
- V1 lesson or module pipeline output
- distilled into plain teaching context
- scored
- then retrieved section-by-section at runtime

The attachment should be narrow enough that the runtime model can produce:
- one clean chunk
- direct questions
- no overpacking

## Current Attachment Direction

The next attachment format should not mirror the old V1 block list too literally.

Instead, generate attachments with clearly marked runtime sections such as:
- `Teach/Check 1`
- `Teach/Check 2`
- `Practice 1`

Each section should contain only the material needed for that phase.

In practice:
- vocab should usually be folded into `Teach/Check`
- explanation and checking can be grouped into the same teaching unit
- each section should be narrow enough for one runtime cycle
- the attachment should be bare enough that the prompt provides the teaching style rather than the attachment acting like scripted prose

## Separation Rule

The old dynamic bridge from the V2 module planner is retired.

Dynamic generation should not depend on:
- `/api/admin/v2/module/.../dynamic-generate`
- old validated module blueprints from the legacy planner path

Native dynamic blueprints are now produced and stored by the dynamic module planner itself.

## Subject Handling

Use one engine with subject profiles.

Examples:
- GCSE Biology profile
- C&G 2365 profile

Different subjects should have different:
- tone guidance
- misconception libraries
- question style
- asset preferences

## Simplicity Rule

Keep generation readable and auditable.
If a lesson spec is bad, it must be obvious from the stored object.
