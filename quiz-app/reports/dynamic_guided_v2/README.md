# Dynamic Guided V2 Docs

This folder is the source of truth for the dynamic 2365 lesson module.

It does not replace or reinterpret the static V1 lesson system.

Static authored lessons in `src/data/lessons/2365` remain valid for that system.
The dynamic module is a separate planner, generator, and runtime path built in:
- `src/lib/dynamicGuidedV2/*`
- `src/data/dynamic-guided-v2/*`
- `src/app/dynamic-guided-v2/*`

Do not treat `reports/new_design` as the implementation source for this module.
That folder remains research/archive/reference only.

## Reading Order

1. [lesson_methodology.md](./lesson_methodology.md)
2. [lesson_spec.md](./lesson_spec.md)
3. [chunk_first_generation_plan.md](./chunk_first_generation_plan.md)
4. [generation_model.md](./generation_model.md)
5. [runtime_model.md](./runtime_model.md)
6. [actual_lesson_rubric.md](./actual_lesson_rubric.md)
7. [scoring_model.md](./scoring_model.md)
8. [generation_benchmark_gate.md](./generation_benchmark_gate.md)
9. [product_model.md](./product_model.md)
10. [build_plan.md](./build_plan.md)

## Architecture Reality

There are two valid systems in this repo:

1. Static V1 lessons
- authored lesson JSON under `src/data/lessons/2365`
- valid and separate
- not governed by the dynamic methodology docs

2. Dynamic 2365 lessons
- planner, generator, scorer, and runtime in the dynamic module
- governed by the docs in this folder
- compared against a strong GPT tutoring baseline

## Current Direction

The current target model is the chunk-first loop defined in:
- [chunk_first_generation_plan.md](./chunk_first_generation_plan.md)

That model replaces the older assumption that every dynamic lesson should always generate:
- worked example
- guided practice
- practice
- integrative

Those later stages are now optional and only expected for procedural or calculation-heavy chunks.

The supported dynamic surfaces are:
- `/2365/admin/dynamic-module`
- `/2365/admin/dynamic-generate`
- `/2365/dynamic-guided-v2/[lessonCode]?versionId=...`
- `/2365/simple-chatbot?lessonMode=1&lessonCode=...&dynamicVersionId=...`

The dynamic workflow is:
1. plan lesson blueprints from source text
2. generate a versioned dynamic lesson draft
3. score and inspect it
4. preview it in the dynamic runtime or `simple-chatbot`

## Main Rule

Keep static V1 and dynamic separate.

The dynamic module may borrow pedagogic ideas from V1, but it does not redefine the authored static lessons and it should not be forced to mirror the old block structure literally.

## Control Split

The dynamic module should use different levels of control for different jobs:
- planning and generation should be rigid and consistent
- scoring should be rigid and consistent
- runtime tutoring should be looser, adaptive, and natural
- generation and scoring should run at `temperature 0`
- runtime tutoring should not be pinned to `0`

That split is deliberate.

Generation exists to produce a reliable chunk-first lesson scaffold.
Scoring exists to judge lesson quality consistently.
Runtime tutoring exists to make the learner interaction feel like real tutoring rather than scripted page reading.

Dynamic V2 now stores questions and task prompts only.
It does not store dynamic answer keys in the final lesson artifact.
Runtime judges learner replies from the current step context:
- objective
- question text
- anchor facts
- key ideas
- misconceptions
- task constraints

Guard rails should therefore be kept to the minimum needed for:
- correctness
- scope control
- exact technical terminology where required
- safe progression
- clean chunk teaching
- `3` recall questions plus `1` deeper question per chunk by default

Do not strengthen guard rails at the cost of runtime performance.
If an extra guard rail mainly makes the live tutor stiffer, more scripted, or less adaptive, it is the wrong trade.

## Generation Release Gate

For generation quality, the release gate is now explicit:
- `lesson score` is the primary release score
- `plan score` and `fidelity score` must remain high, but they do not rescue a weak lesson
- the benchmark set and target thresholds are defined in [generation_benchmark_gate.md](./generation_benchmark_gate.md)

Prompt strategy for generation:
- system prompts should use a short stable expert/role/steps structure
- do not start system prompts with internal labels like `You are Phase X`
- audience and tone belong in the system prompt, not repeated in every user prompt
- phases `1-8` should start from one locked grounding packet in conversation history
- later phase prompts should rely on locked history, not repeated source dumps
- prefer compact good/bad examples over repeated reminder blocks
- do not keep adding duplicated `ALWAYS` instructions when deterministic binding can enforce the rule better
- keep generation rigid, but keep the prompt surface lean enough that examples remain the main steering signal
- if a reusable repair phase is added, it must be phase-scoped and generic; it may improve or preserve prior output, but it must not be allowed to degrade a valid chunk
- dynamic generation phases should generate chunk teaching, recall questions, deeper questions, and teaching context first
- do not generate or store dynamic answer keys in the final runtime artifact
- only generate guided practice / practice style tasks when the chunk is planned as procedural or calculation-heavy

## Planner Lock

The planner should now be treated as a strict contract, not a soft draft.

To lock the planner down:
- planning must run at `temperature 0`
- the planner must always emit:
  - `lessonAim`
  - `teachChecks`
  - one misconception per teach/check chunk
  - `inScope`
  - `outOfScope`
  - `constraints`
- a chunk mode marker should be present when a chunk needs procedural extension
- the planner must include at least one concrete out-of-scope boundary
- the planner must include explicit delivery constraints, not just chunk titles

If Phase 1 output is thin, the generator must deterministically backfill missing planning fields from:
- stage plan
- source text
- neighbouring lesson lines in the source
- chunk objectives/titles

The planner is considered healthy when:
- `plan score` stays at `100` or close to it on fresh runs
- source-grounding does not cap the plan
- later generation failures are lesson-content failures, not plan-completeness failures
