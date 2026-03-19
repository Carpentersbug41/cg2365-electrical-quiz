# V2 Overview

Last updated: 2026-03-10

## Problem Statement

The current app is a successful proof of concept but not a clean production architecture. It combines learner runtime, admin tooling, AI generation, content management, review scheduling, and reporting in one evolving application.

That structure is useful for discovery but risky for production. The next version should be a platform with clear domain boundaries and a stable operational model.

## Core Decision

V2 is a ground-up rebuild, not a refactor.

The rebuild should preserve:

- validated product ideas
- curriculum knowledge
- effective pedagogical patterns
- useful question QA workflows
- successful prompt/generation heuristics

The rebuild should not preserve:

- file-driven runtime content registration
- split local/server progress logic
- in-request long-running AI workflows
- route sprawl as architecture
- direct mutation of production content by generation flows

V2 may reuse ideas, prompt heuristics, and isolated utility logic from the prototype, but it must not take runtime dependencies on V1 product flows, route structure, or legacy content wiring.

## Target System

V2 is a learning platform with four logical subsystems:

- learner platform
- content platform
- generation platform
- reporting platform

These may initially live in one repo and one deployment, but they must have explicit boundaries.

Those boundaries are enforced by:

- V2-owned route surfaces
- V2-owned service-layer entry points for writes
- published-content read models for learner runtime
- explicit dependency rules between modules
- explicit anti-corruption rules between V1 and V2

## Success Criteria

The rebuild is successful if it:

- supports one source of truth for lessons, questions, attempts, review items, and metrics
- allows reliable publishing and rollback of content
- runs AI generation as jobs with approvals and full artifacts
- gives institutions usable learner and cohort outcomes
- reduces operational fragility compared with the prototype
- remains understandable under delivery pressure because ownership and forbidden shortcuts are documented

## Guardrail Standard

The rebuild docs are not complete unless they answer both of these:

1. what V2 should contain
2. what V2 engineers are not allowed to do

That second category is handled in:

- `16_architecture_guardrails.md`
- `17_module_dependency_matrix.md`
- `18_data_invariants_and_state_machines.md`
- `19_non_negotiables_for_v2.md`
