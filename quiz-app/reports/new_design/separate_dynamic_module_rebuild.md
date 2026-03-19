# Separate Dynamic Guided Module Rebuild

## Purpose

This document defines the hard separation rule for the new dynamic guided module rebuild.

The previous guided runtime and generation stack should not be patched forward into this rebuild. The new work should live in its own namespace, with its own routes, types, loader, data model, and runtime logic.

## Separation Rule

Do not build the new module on top of:
- `src/lib/guidedChunk/*`
- `src/lib/generation/guidedChunk/*`
- `src/app/guided-chunk/*`
- `src/app/api/guided-chunk/*`
- old guided admin/planner routes

Those paths may remain in the repo as historical reference, but they are not the implementation base for the rebuild.

The new module should begin in its own namespace.

## New Namespace

Use a separate module namespace for all new work.

Current baseline namespace:
- `src/lib/dynamicGuidedV2/*`
- `src/data/dynamic-guided-v2/*`
- `src/app/dynamic-guided-v2/*`

This makes the boundary explicit and prevents accidental reuse of old runtime behavior.

## Initial Scope

The rebuild should start with:
- one lesson
- one stored lesson spec
- one route
- one simple runtime
- no reuse of the old evaluator architecture
- no reuse of the old guided generation architecture

The first goal is to prove lesson quality and runtime feel, not platform completeness.

## Lesson Representation

The new module should store a lesson as a structured runtime spec.

The runtime spec should contain:
- lesson metadata
- learner tone/profile requirements
- LO list
- chunk briefs in order
- question requirements
- optional asset/microbreak markers

The stored object should guide runtime generation, not act as final prewritten learner text.

## Runtime Rule

The runtime should:
- load the lesson spec in strict stored order
- pass the current chunk brief to the model
- include recent conversation history
- let the model generate the visible tutor turn
- keep the state model minimal

Do not start by rebuilding heavy hidden logic.

## Scoring Rule

Use the V1 teaching-quality philosophy as the quality bar.
Do not invent a new complex scoring stack before the runtime is good.

Primary score concerns:
- beginner clarity
- teaching before testing
- marking robustness
- LO alignment
- question quality

## Implementation Principle

Build the new dynamic module as if the old guided runtime did not exist.

Use the old code only as reference material when examining mistakes to avoid.
Do not use it as the architecture to extend.
