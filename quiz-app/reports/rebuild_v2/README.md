# Rebuild V2 Documentation Set

Last updated: 2026-03-06
Status: Working draft for ground-up rebuild planning

## Purpose

This folder defines the documentation set for rebuilding the current proof of concept as a production-grade platform.

The current application has validated the product direction. These docs are for designing the next system intentionally rather than extending the prototype further.

## Reading Order

1. `00_overview.md`
2. `01_prd.md`
3. `02_target_architecture.md`
4. `03_domain_model_and_schema_v2.md`
5. `04_learner_runtime.md`
6. `05_admin_ops.md`
7. `06_generation_platform.md`
8. `07_event_and_analytics_spec.md`
9. `08_migration_strategy.md`
10. `09_execution_roadmap.md`
11. `10_open_questions.md`
12. `11_decision_log.md`

## Principles

- Rebuild the system around stable domains, not existing screens.
- Treat content, learning runtime, generation, and reporting as distinct concerns.
- Use a single source of truth for content and learner progress.
- Make published content immutable and versioned.
- Make AI asynchronous, reviewable, and operationally observable.

## Expected Output

When this doc set is complete, it should answer:

- What the new product is
- What data model it runs on
- What gets built first
- How the prototype is migrated without losing validated learning
- What is intentionally left out of v2
- What decisions are still unresolved
- What decisions have been formally made
