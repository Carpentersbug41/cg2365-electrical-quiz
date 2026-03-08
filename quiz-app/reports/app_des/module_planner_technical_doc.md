# Module Planner vNext - Technical Notes

Last verified: 2026-03-05
Primary route: `/admin/module`
Library root: `src/lib/module_planner/*`

---

## 1. Core Components

- `planner.ts`: stage orchestration and artifact contracts
- `db.ts`: run/artifact/lesson persistence
- `syllabus.ts`: syllabus parsing/chunk retrieval helpers
- `schemas.ts`: runtime validators for stage payloads
- `masterLessonBlueprint.ts`: blueprint contract + validation
- `adapter.ts`: bridge from planner blueprints to lesson-generator API

## 2. Run Model

Each planner run stores:
- request JSON
- stage artifacts per M stage
- status transitions (`m0-complete` ... `m6-complete`)
- optional generated lessons linked to blueprint IDs

## 3. Determinism and Replay

- request hash uses normalized transcript + constraints + syllabus hash
- stage replay can reuse artifacts from matching prior run
- reused artifacts are copied into current run for traceability

## 4. Validation Model

Each stage output is schema-validated.
Errors are surfaced as structured `ModulePlannerError` codes (for example `JSON_SCHEMA_FAIL`, `RAG_EMPTY`, `RAG_GROUNDEDNESS_FAIL`).

## 5. Syllabus and Scope

Routes select syllabus versions filtered to current curriculum scope.
Unit/LO selection and ingestion metadata are read from planner storage.

## 6. Generation Integration

M6 and blueprint-specific generate routes call adapter logic that invokes lesson generation and stores resulting payload/status in run lessons table.