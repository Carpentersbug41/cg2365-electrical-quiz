# V2 Overview

Last updated: 2026-03-06

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

## Target System

V2 is a learning platform with four logical subsystems:

- learner platform
- content platform
- generation platform
- reporting platform

These may initially live in one repo and one deployment, but they must have explicit boundaries.

## Success Criteria

The rebuild is successful if it:

- supports one source of truth for lessons, questions, attempts, review items, and metrics
- allows reliable publishing and rollback of content
- runs AI generation as jobs with approvals and full artifacts
- gives institutions usable learner and cohort outcomes
- reduces operational fragility compared with the prototype

