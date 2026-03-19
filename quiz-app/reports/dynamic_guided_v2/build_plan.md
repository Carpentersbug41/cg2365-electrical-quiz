# Build Plan

## Phase 0

Lock the architecture boundary.

Rules:
- keep V1 static lessons and V1 generation pipeline
- do not use the failed guided/chat sidecar as the base
- do not block on unfinished V2
- build in the separate `dynamicGuidedV2` module

## Phase 1

Build a minimal separate runtime.

Deliver:
- separate lesson spec
- separate route
- one lesson
- one simple tutor loop
- no old guided runtime reuse
- no heavy evaluator
- no broad platform rebuild

## Phase 2

Make one baseline chatbot genuinely good.

Check:
- tutor naturalness
- first-chunk quality
- question quality
- comparison against GPT baseline

Current test surface:
- `/simple-chatbot`

Current variables:
- system prompt
- attached source / lesson context

Prompt boundary for the current runtime:
- Prompt 1 = intro
- Prompt 2 = baseline lesson prompt for the teaching turn
- Prompt 3 = lesson feedback prompt for learner answers

Do not add more prompt stages yet.
First prove:
- the intro prompt
- the section-level retrieval path
- the teach / feedback cycle on one retrieved section

## Phase 3

Build the native dynamic planning and generation path.

Deliver:
- native dynamic module planner run store
- native dynamic blueprints produced from source text
- dynamic lesson generation from those native blueprints
- manual one-off dynamic lesson generation from grounded source text
- scored lesson drafts attached to the runtime as grounded context

Current attachment requirement:
- generate clearly marked runtime sections
- do not rely on raw V1 blocks as the direct attachment format
- keep each section narrow enough for one runtime cycle:
  - one teaching turn
  - one learner reply
  - one feedback turn that either stays on the same section or advances

Success criterion:
- first teaching chunk scores `90+`
- then push toward `95+`

## Phase 4

Add selective platform capability reuse.

Bring in only what improves the lesson:
- onboarding tone/profile input
- quiz steps
- microbreak steps
- diagrams/assets

Do not bring in old runtime logic.

## Phase 5

Add measurement.

Capture:
- session history
- questions
- answers
- progression
- drop-off
- answer quality

## Phase 6

Only then add more control.

Possible later additions:
- tighter progression rules
- microbreak injection
- richer assets
- subject-specific refinements
- stronger analytics

## Current Supported 2365 Surfaces

- `/2365/admin/dynamic-module`
- `/2365/admin/dynamic-generate`
- `/2365/dynamic-guided-v2/[lessonCode]?versionId=...`
- `/2365/simple-chatbot?lessonMode=1&lessonCode=...&dynamicVersionId=...`

## Hard Rule

Do not rebuild the old guided complexity first.
Do not route dynamic generation back through the old module-planner bridge.
Keep guided and dynamic separate.
