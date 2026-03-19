# Product Model

## Purpose

Define what the new system is and what standard it must meet.

## Core Standard

The baseline is a strong GPT tutoring prompt.

If the rebuilt product cannot beat a simple GPT tutoring flow, there is no justification for extra complexity.

The product must therefore outperform plain GPT on some combination of:
- learner preference
- completion
- fatigue reduction
- answer quality
- LO test performance
- retention

## Core Shift

The old guided system treated chunks as final learner-facing text.

The new system treats chunks as structured teaching briefs for the runtime model.

So:
- lesson planning still happens up front
- chunking still happens up front
- but the visible tutor wording is produced live at runtime by the model

## Architecture Position

The correct position for this project is:
- use `V1` as the pedagogic and quality reference
- do not build on the failed guided/chat sidecar
- do not wait for unfinished `V2`
- build a separate transitional module now that is shaped so it can later move into proper `V2`

## Keep From V1

Keep:
- V1 planning methodology
- V1 lesson flow
- V1 scoring philosophy
- V1 pedagogic discipline
- onboarding and learner profile ideas
- quizzes and microbreak concepts
- diagrams/assets where useful
- telemetry and versioning patterns where useful

Do not keep:
- V1 block renderer
- old guided runtime state machine
- old guided evaluator architecture
- the bolted-on guided/chat runtime
- the previous guided generation stack

## Product Boundary

This project is not:
- a patch to V1
- the failed guided/chat sidecar
- the full finished V2 architecture

It is:
- a clean dynamic lesson rebuild
- aligned to future V2
- using V1 pedagogy and selected platform capabilities
- built separately so it can be proven before integration

## Supported 2365 Surfaces

The supported 2365 dynamic surfaces are:
- `/2365/admin/dynamic-module`
- `/2365/admin/dynamic-generate`
- `/2365/dynamic-guided-v2/[lessonCode]?versionId=...`
- `/2365/simple-chatbot?lessonMode=1&lessonCode=...&dynamicVersionId=...`

The native dynamic planner and the guided planner are separate product surfaces.
The old dynamic bridge into the legacy module planner is retired.

## Product Principle

Build one lesson that genuinely feels better than GPT baseline.
Then expand.
