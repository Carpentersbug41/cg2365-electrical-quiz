# Outcomes Improvement System

Last updated: 2026-03-10
Owner: Carpe + Codex
Status: proposed build pack

## What this folder is

This folder defines the outcomes improvement system for the app.

The system exists to answer one question:

`Is the app's instructional design actually making learners learn more effectively, and if not, what should we change?`

This is not primarily a student score tracker.
It is a product-improvement and instructional-effectiveness system.

It should allow the team to:

- record learner outcome and usage evidence
- preserve historical evidence
- preserve the conclusions drawn from that evidence
- preserve the design changes made because of that evidence
- compare before and after results
- iterate on the product using evidence rather than intuition alone

## Reading order

1. `01_purpose_and_scope.md`
2. `02_system_overview.md`
3. `03_metric_framework.md`
4. `04_metric_definitions.md`
5. `05_data_contract_and_storage.md`
6. `06_dashboard_and_workflows.md`
7. `07_implementation_plan.md`
8. `08_governance_and_decision_process.md`
9. `09_open_questions_and_risks.md`

## Current app context

Relevant existing implementation and notes already in the repo:

- `src/app/api/admin/users/outcomes/route.ts`
- `src/app/api/admin/users/outcomes/timeseries/route.ts`
- `src/app/api/admin/v2/outcomes/summary/route.ts`
- `src/app/api/admin/v2/outcomes/timeseries/route.ts`
- `src/app/api/admin/v2/outcomes/breakdown/route.ts`
- `reports/rebuild_v2/11_decision_log.md`
- `reports/rebuild_v2/12_progress_tracker.md`
- `reports/new_design/new_runtime_telemetry_spec.md`
- `reports/new_design/blunt_assessment.md`

These files are useful inputs, but they do not yet form one coherent implementation pack for the outcomes improvement system. This folder does.

## Intended deliverable

After implementation, the app should have:

- a dedicated admin outcomes surface
- reliable learning-effectiveness metrics
- lesson and learning-outcome level breakdowns
- persisted evidence reviews
- persisted intervention logs
- before/after monitoring of product changes
