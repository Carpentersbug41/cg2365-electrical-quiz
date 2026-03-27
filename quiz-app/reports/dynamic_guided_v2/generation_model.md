# Generation Model

## Purpose

Define how lessons should be planned and generated for the dynamic 2365 module.

The current canonical target is the chunk-first model in:
- [chunk_first_generation_plan.md](./chunk_first_generation_plan.md)

## Separation Rule

This model is for the dynamic planner and generator only.
It does not replace the static V1 lesson generation or the authored static lessons.

## Current Direction

The older full lesson arc in this file is now superseded as the default target.

Dynamic V2 should now default to:

- chunk teaching
- `3` recall questions per chunk
- `1` deeper question per chunk
- runtime-led feedback and progression

Only procedural or calculation-heavy chunks should add:

- worked example
- guided practice
- `3-5` targeted practice questions

Integrative should not be treated as a required universal closing stage.

Use this file as background and implementation history.
Use [chunk_first_generation_plan.md](./chunk_first_generation_plan.md) as the current target spec.

## Previous Generation Principle

Generate a scored runtime lesson spec, not final tutor prose.

Generation should be rigid.
Its job is consistency, not conversational flair.

The old authored static pipeline is the reference discipline for generation.
See [old_pipeline_recovery.md](C:\Users\carpe\Desktop\hs_quiz\quiz-app\reports\dynamic_guided_v2\old_pipeline_recovery.md).

The generator should first decide the pedagogic shape:
- how many lessons the LO needs
- how many core chunks the lesson needs
- what each chunk must teach
- what misconceptions each chunk must repair

Only then should it assemble the runtime step artifact.

The previous model assumed the generator would build an authored intermediate first:
- outcomes
- vocab
- authored explanation chunks
- authored checks tied to teaching points
- worked example
- guided practice
- practice
- integrative

Then compile that authored intermediate into the thin runtime artifact.

For dynamic V2, the final runtime artifact is question-only.
It should store:
- questions
- task prompts
- teaching context

It should not store dynamic answer keys.
Runtime judges learner replies live from the current step context.

## Previous Planning Targets

The planner should default to:
- `1` lesson per LO for compact LOs
- `2` lessons per LO for broad or conceptually heavy LOs

The previous default was:
- `4-6` core chunks by default
- one worked example
- one guided practice
- one practice task
- one integrative close

If more than `6` core chunks would be required, split the lesson.

## Planner Contract

The planner remains a strict contract, but the preferred contract has changed.

The current preferred planner contract is:

- `lessonAim`
- planned chunk count
- one concrete object per teach/check chunk
- one misconception per teach/check chunk
- `inScope`
- `outOfScope`
- `constraints`
- a chunk mode marker only where procedural extension is needed

The older later-stage objective fields below are retained here only as legacy design context.

The planner is not advisory.
It is a required schema that later phases depend on.

The planner must run at `temperature 0`.

Each plan must emit:
- `lessonAim`
- `teachCheckCount`
- one concrete object for every planned teach/check chunk
- one misconception per teach/check chunk
- `workedExampleObjective`
- `guidedPracticeObjective`
- `practiceObjective`
- `integrativeObjective`
- `spacedReviewObjective`
- `inScope`
- `outOfScope`
- `constraints`

Minimum quality rules for a valid plan:
- `inScope` must contain concrete teaching anchors, not generic topic labels
- `outOfScope` must contain at least one neighbouring topic or lesson boundary
- `constraints` must include teach-before-test and no-untaught-terms style controls
- guided practice must clearly mirror the worked-example reasoning pattern
- later-stage objectives must be concrete enough to compile into one markable task each

If Phase 1 returns a thin or incomplete plan, the generator should not simply trust it.
It should deterministically backfill missing planning fields from:
- the requested stage plan
- the current lesson source text
- explicit in-scope / out-of-scope lines in the source
- neighbouring lesson lines in the source
- chunk objectives and chunk titles

This means the planner is locked in two ways:
1. prompt contract
2. deterministic coercion and backfill in code

The planner should fail closed toward structure, not fail open toward underspecified plans.

## Previous Generation Objective

The previous model expected a lesson that could support:
- concise teaching
- exactly 3 short-answer checks per core chunk
- corrective feedback with better exam wording
- one deeper probe where useful
- repair loops on real misconceptions
- a worked example that models the later reasoning
- guided practice that mirrors the worked example
- a markable independent practice task
- an integrative close that tests synthesis, not just more recall

## Previous Phase Model

The previous 13-phase generation pipeline remains documented here as historical context.
Its job is now to serve the chunk-plus-repair lesson model, not to force the lesson into a rigid block list.

Phases `1-8` should run inside one cumulative generation conversation.

That means:
- the conversation starts with one locked grounding packet containing:
  - lesson identity
  - stage plan
  - relevant LO/source lines only
- `Phase 1` output becomes real conversation history for `Phase 2`
- `Phase 1-2` become real conversation history for `Phase 3`
- and so on through `Phase 8`

Earlier generation phases should not be treated as disposable JSON blobs pasted into isolated fresh requests.
They should be preserved as the actual phase history of one generation session.

Scoring and refine may remain isolated from that conversation so judging and repair do not pollute the generation context.

1. `Phase 1 Planning`
2. `Phase 2 Vocabulary`
3. `Phase 3 Explanation`
4. `Phase 4 Basic Checks`
5. `Phase 4.1 Deeper Checks`
6. `Phase 5 Worked Example`
7. `Phase 6 Practice`
8. `Phase 7 Integration`
9. `Phase 8 Spaced Review`
10. `Phase 9 Assembler`
11. `Post-assembly repair pass`
12. `Phase 10 Score`
13. `Phase 11 Suggest Fixes`
14. `Phase 12 Refine`
15. `Phase 13 Rescore & Accept/Reject`

## Assembly Rule

The generator should build the pedagogic model first, then assemble the runtime stages.

That means:
- do not start from a page-block mentality
- do not overfit to a fixed `1-3` teach/check expectation
- do not generate worksheet-style bundles just because later runtime stages are few

The stored runtime artifact can still use:
- `intro`
- `teach_check`
- `worked_example`
- `guided_practice`
- `practice`
- `integrative`

But those are the delivery stages, not the planning truth.

The authored explanation chunk, not the runtime step, is the source of truth for:
- basic checks
- deeper checks
- exact-term targets
- application-task logic

`Phase 4 Basic Checks` writes the three short questions for each chunk.

`Phase 4.1 Deeper Checks` writes the deeper reasoning question for each chunk.

Their job is to:
- emit the canonical teach/check question objects
- keep exactly `3` short-answer questions per chunk
- keep each question aligned to the chunk objective
- keep abbreviation, code-letter, exact-term, and system/component distinctions correct at source

They are not allowed to:
- emit placeholder or generic check sets
- produce malformed chunks and still advance

After assembly, generation should run one deterministic repair pass before scoring.

That repair pass should:
- classify the local question/task type
- strip neighbouring-question contamination
- rebuild weak late-stage tasks into one concrete learner-facing task
- keep the stored lesson shape unchanged

## Consistency Requirement

Generation should optimise for:
- stable lesson structure
- stable chunk decomposition
- stable worked-example and practice arcs

Generation is allowed to be rigid because its output is the guard-rail artifact, not the live tutor performance.
Generation temperature should therefore be pinned to `0`.

That does not justify bloating the artifact with extra control fields that mainly script the runtime tutor.
Generation should emit the minimum guard-rail scaffold needed for correctness, scope, terminology, and progression.

## Acceptance and Quality

A generated lesson is only useful if it is competitive with a strong GPT tutoring baseline.

That means generation must optimise for:
- coherent chunking
- natural repair loops
- exact-term enforcement where required
- non-bundled, markable practice tasks

The current scoring gate and refinement path should judge the generated lesson against that standard.

Question-only rule:
- prompts may ask for questions and task wording only
- the final assembled dynamic lesson should not contain stored answer guidance
- runtime should judge learner replies from question text plus step context only

## Prompt Strategy

Generation system prompts should follow one stable structure:
- `You are an expert in ...`
- short audience/tone statement
- `Your job ...`
- `Always follow these steps ...`
- short rule list

Do not lead with internal wording like `You are Phase X`.

Audience and tone belong in the system prompt, not repeated in every user prompt.

User prompts for phases `2-8` should be phase-local only:
- lesson reference
- current phase request
- current phase schema
- compact phase-local rules/examples

They should not keep repeating:
- full source text
- tone and audience
- earlier phase outputs
- repasted planning/vocabulary/explanation JSON

The source grounding belongs in the locked history seed, not in every phase prompt.

The system prompt should be short and stable.
The user prompt should carry the phase task, not a repeated copy of the whole lesson context.

Generation prompts should stay compact and example-led.

Phase `8` is now a same-unit spaced-review artifact:
- it uses a dedicated grounding packet
- it reviews preceding lessons in the same unit first
- if there are no preceding lessons, it falls back to same-unit LO anchors
- it outputs `coveragePlan[]` and `questions[]`
- target count is `8` questions distributed as evenly as possible across source LOs

Preferred order of control:
1. deterministic binding and normalization in code
2. short critical rules in the phase prompt
3. compact good/bad examples for the recurring failure classes

Do not rely on repeated reminder blocks as the main steering mechanism.
If a rule matters enough to preserve exactness or markability, prefer deterministic enforcement over more prompt repetition.

## Refine Safety

Refinement is allowed to improve wording and markability.
It is not allowed to change protected lesson structure.

If refine:
- changes step count
- changes step order
- changes protected stage metadata
- or fails to parse cleanly

the original normalized lesson should be kept.

## Stabilization Rule

The main generation defects to eliminate are:
- wrong answer bound to the right question
- topic-label contamination in exact-term questions
- generic or meta-instruction late tasks
- long sentence answer guidance where the lesson needs discrete marking points
- contradiction between question type and answer-guidance type

These should be solved broadly through reusable question-type handling, not per-lesson hacks in the core stages.
