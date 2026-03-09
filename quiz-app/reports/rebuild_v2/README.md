# Rebuild V2 Documentation Set

Last updated: 2026-03-09
Status: Working draft for ground-up rebuild planning

## Purpose

This folder defines the documentation set for rebuilding the current proof of concept as a production-grade platform.

The current application has validated the product direction. These docs are for designing the next system intentionally rather than extending the prototype further.

## Reading Order

1. `progress.md` - master handover / first-read operational brief for a new chat or implementer
2. `README.md`
3. `00_overview.md`
4. `01_prd.md`
5. `02_target_architecture.md`
6. `03_domain_model_and_schema_v2.md`
7. `04_learner_runtime.md`
8. `05_admin_ops.md`
9. `06_generation_platform.md`
10. `07_event_and_analytics_spec.md`
11. `08_migration_strategy.md`
12. `09_execution_roadmap.md`
13. `10_open_questions.md`
14. `11_decision_log.md`
15. `12_progress_tracker.md`
16. `13_deployment_split.md`
17. `14_phase1_release_checklist.md`
18. `15_tester_access_runbook.md`
19. `16_architecture_guardrails.md`
20. `17_module_dependency_matrix.md`
21. `18_data_invariants_and_state_machines.md`
22. `19_non_negotiables_for_v2.md`
23. `20_v2_completion_audit.md`
24. `21_ranked_implementation_backlog.md`

## Document Roles

- `progress.md`
  - first-read handover for a new LLM/chat
  - current state, what is working, what is left, what to do next, and where to read deeper
- `12_progress_tracker.md`
  - detailed implementation tracker / historical log
- `20_v2_completion_audit.md`
  - gap analysis between current implementation and target architecture
- `21_ranked_implementation_backlog.md`
  - ranked execution order for remaining implementation work

## Principles

- Rebuild the system around stable domains, not existing screens.
- Treat content, learning runtime, generation, and reporting as distinct concerns.
- Use a single source of truth for content and learner progress.
- Make published content immutable and versioned.
- Make AI asynchronous, reviewable, and operationally observable.
- Treat V2 as its own bounded system, not a convenient extension of V1/shared legacy paths.
- Define allowed dependencies and write ownership explicitly.
- Record non-negotiable anti-regression rules before implementation pressure creates shortcuts.

## Expected Output

When this doc set is complete, it should answer:

- What the new product is
- What data model it runs on
- What gets built first
- How the prototype is migrated without losing validated learning
- What is intentionally left out of v2
- What decisions are still unresolved
- What decisions have been formally made
- What V2 modules may depend on
- What data invariants and state transitions are enforced
- What implementation shortcuts are forbidden even if they appear faster
