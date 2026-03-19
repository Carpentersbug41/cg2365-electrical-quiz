# Dynamic Guided V2 Docs

This folder is the source of truth for the ground-up rebuild of the dynamic guided lesson system.

This is the only doc folder that should be used for this project.

Do not treat `reports/new_design` as the implementation source for this rebuild.
That folder remains useful as research/archive/reference only.

## Reading Order

1. [product_model.md](./product_model.md)
2. [lesson_methodology.md](./lesson_methodology.md)
3. [runtime_model.md](./runtime_model.md)
4. [lesson_spec.md](./lesson_spec.md)
5. [generation_model.md](./generation_model.md)
6. [scoring_model.md](./scoring_model.md)
7. [build_plan.md](./build_plan.md)

## Architecture Reality

- `V1` is the working static lesson system and pedagogic reference
- `V2` is the intended long-term architecture, but it is not finished yet
- the failed chat/guided sidecar that was bolted onto V1 is not the base for this rebuild
- this project is therefore a clean transitional module that should later fold into proper V2

## Build Rule

This rebuild is separate from the old guided runtime code.
Build in:
- `src/lib/dynamicGuidedV2/*`
- `src/data/dynamic-guided-v2/*`
- `src/app/dynamic-guided-v2/*`

Reuse existing platform capabilities selectively, but do not extend the old guided/chatbot runtime architecture.

## Current Direction

The supported 2365 dynamic surfaces are:
- `/2365/admin/dynamic-module`
- `/2365/admin/dynamic-generate`
- `/2365/dynamic-guided-v2/[lessonCode]?versionId=...`
- `/2365/simple-chatbot?lessonMode=1&lessonCode=...&dynamicVersionId=...`

The native dynamic workflow is:
1. plan native lesson blueprints from source text in the dynamic module planner
2. generate a versioned dynamic lesson draft from one native blueprint or from the manual generator
3. preview that draft in the dynamic runtime or `simple-chatbot`

The old dynamic bridge into the V2 module planner is retired.

The main variables being tuned right now are:
- the native planner blueprint quality
- the lesson-generation prompt and attachment quality
- the runtime prompt and feedback flow

The main rule is:
- keep guided and dynamic separate
- do not re-extend the old guided/planner bridge into the dynamic system
