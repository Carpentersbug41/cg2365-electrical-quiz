# Module Planner vNext - Operator Guide

Last verified: 2026-03-05
UI route: `/admin/module`
API base: `/api/admin/module/*`

---

## 1. Purpose

Module Planner runs a staged syllabus-grounded planning workflow and then supports per-blueprint lesson generation.

Stages shown in UI:
- M0 Distill
- M1 Analyze
- M2 Coverage
- M3 Plan
- M4 Blueprints
- M5 Validate
- M6 Generate

## 2. Typical Operator Flow

1. Pick syllabus version and unit
2. Create run (`/api/admin/module/runs`)
3. Execute M0-M5 stage routes
4. Inspect artifacts + validation issues
5. Generate one blueprint lesson at a time from M6/lesson generate route

## 3. Guardrails

- route access is protected by module planner access guard
- scope filtering prevents cross-curriculum syllabus leakage
- stage artifacts are schema-validated and persisted
- optional replay from prior artifacts is supported when request hash matches

## 4. Inputs You Control in UI

- LO scope (auto or manual override)
- level/audience
- lesson count and AC constraints
- ordering preference (`foundation-first` or `lo-order`)
- optional admin token headers

## 5. Current Constraints

- feature gated by `MODULE_PLANNER_ENABLED`
- depends on syllabus ingestion/version data in planner tables
- generation remains lesson-by-lesson at blueprint level