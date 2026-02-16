# Module Planner vNext - Technical Documentation

Last verified: 2026-02-16
Primary UI route: `/admin/module`
Primary API routes: `/api/admin/module/*`
Library root: `src/lib/module_planner/*`

This is the deep technical reference for current Module Planner runtime behavior.

---

## 1. Architecture

Execution path:
1. browser UI (`src/app/admin/module/page.tsx`)
2. module API routes (`src/app/api/admin/module/*`)
3. planner core (`src/lib/module_planner/planner.ts`)
4. planner persistence (`src/lib/module_planner/db.ts`)
5. lesson-generator adapter (`src/lib/module_planner/adapter.ts`)
6. existing generator API (`/api/lesson-generator`)

Feature gate:
- `MODULE_PLANNER_ENABLED=true`

Optional auth gate:
- `MODULE_PLANNER_ADMIN_TOKEN`
- accepted in header `x-module-admin-token` or bearer token

---

## 2. Source Map

Core:
- `src/lib/module_planner/types.ts`
- `src/lib/module_planner/constants.ts`
- `src/lib/module_planner/featureFlag.ts`
- `src/lib/module_planner/errors.ts`
- `src/lib/module_planner/stableHash.ts`
- `src/lib/module_planner/masterLessonBlueprint.ts`
- `src/lib/module_planner/schemas.ts`
- `src/lib/module_planner/syllabus.ts`
- `src/lib/module_planner/db.ts`
- `src/lib/module_planner/planner.ts`
- `src/lib/module_planner/adapter.ts`

API:
- `src/app/api/admin/module/_utils.ts`
- `src/app/api/admin/module/runs/route.ts`
- `src/app/api/admin/module/runs/[id]/route.ts`
- `src/app/api/admin/module/syllabus/populate/route.ts`
- `src/app/api/admin/module/[id]/m0-distill/route.ts`
- `src/app/api/admin/module/[id]/m1-analyze/route.ts`
- `src/app/api/admin/module/[id]/m2-coverage/route.ts`
- `src/app/api/admin/module/[id]/m3-plan/route.ts`
- `src/app/api/admin/module/[id]/m4-blueprints/route.ts`
- `src/app/api/admin/module/[id]/m5-validate/route.ts`
- `src/app/api/admin/module/[id]/m6-generate/route.ts`
- `src/app/api/admin/module/[id]/lessons/[blueprintId]/generate/route.ts`

Syllabus upload route:
- `src/app/api/syllabus/upload/route.ts`

UI:
- `src/app/admin/module/page.tsx`

---

## 3. Configuration

Environment variables:
- `MODULE_PLANNER_ENABLED`
- `MODULE_PLANNER_ADMIN_TOKEN` (optional)
- `MODULE_PLANNER_CONCURRENCY` (clamped `1..2`)
- `MODULE_PLANNER_BASE_URL` (optional adapter target override)
- `NEXT_PUBLIC_APP_URL` (adapter fallback)
- `MODULE_PLANNER_BULK_M6_ENABLED` (bulk M6 route gate)
- `MODULE_PLANNER_DB_MODE=memory` (optional memory DB mode)

Supabase requirements for non-memory mode:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Planner constants (`src/lib/module_planner/constants.ts`):
- `MAX_ACS_PER_LESSON = 4`
- `DEFAULT_MAX_LESSONS_PER_LO = 2`
- `DEFAULT_MAX_ACS_PER_LESSON = 12`
- `DEFAULT_PREFERRED_ACS_PER_LESSON = 12`
- `DEFAULT_MINIMISE_LESSONS = false`
- `DEFAULT_LEVEL = 'Level 2'`
- `DEFAULT_AUDIENCE = 'beginner'`
- `DEFAULT_ORDERING_PREFERENCE = 'foundation-first'`

---

## 4. Persistence Layer

Implementation (`src/lib/module_planner/db.ts`):
- Supabase-first persistence
- in-memory fallback in tests or `MODULE_PLANNER_DB_MODE=memory`

SQL schema migrations:
- `supabase/migrations/202602140001_module_planner_vnext.sql`
- `supabase/migrations/202602140002_module_planner_ingestions.sql`

Primary tables:
- `module_runs`
- `module_run_artifacts`
- `generated_lessons`
- `syllabus_versions`
- `syllabus_ingestions`
- `syllabus_chunks`
- `syllabus_structure`

Upsert conflict keys:
- artifacts: `(run_id, stage)`
- generated lessons: `(run_id, blueprint_id)`
- syllabus structure: `(syllabus_version_id, unit)`

---

## 5. Type Contracts

Important request types (`src/lib/module_planner/types.ts`):

`ModuleConstraints`:
- `minimiseLessons`
- `defaultMaxLessonsPerLO`
- `maxAcsPerLesson`
- `preferredAcsPerLesson`
- `maxLessonsOverrides`
- `level`
- `audience`

`ModulePlanRequest`:
- `syllabusVersionId`
- `unit`
- `selectedLos`
- `constraints`
- `orderingPreference`
- `notes`

`LessonBlueprint`:
- `id`, `unit`, `lo`, `acAnchors`, `topic`
- `mustHaveTopics`, `level`, `layout`, `prerequisites`
- `masterBlueprint`

`M4BlueprintArtifact` includes:
- `blueprints`
- `loBlueprintSets`
- optional `loLedgers`
- optional `lessonLedgerMetadata`

`ValidationIssueCode` includes newer codes:
- `UNKNOWN_AC_KEY`
- `EXCEEDS_MAX_ACS_PER_LESSON`
- `EXCEEDS_PREFERRED_ACS_PER_LESSON`
- `DUPLICATES_PRIOR_LO_CONTENT`
- plus prior coverage/contract codes

---

## 6. Schema Validation Layer

`src/lib/module_planner/schemas.ts` enforces strict shape:
- missing key -> fail
- extra key -> fail
- wrong type -> fail

Validated contracts:
- `ModulePlanRequest`
- `UnitStructure`
- `CoverageTargets`
- `MinimalLessonPlan`
- `LessonBlueprint[]`
- `M4BlueprintArtifact`
- `ValidationResult`

---

## 7. Syllabus Ingestion and Canonical Structure

Core file: `src/lib/module_planner/syllabus.ts`

Functions include:
- text extraction from PDF/DOCX/TXT
- text cleanup and deterministic chunking
- canonical unit/LO/AC structure extraction
- range parsing
- version/chunk/structure access helpers

Upload route behavior (`/api/syllabus/upload`):
- stores `syllabus_versions`
- stores deterministic `syllabus_chunks`
- extracts canonical structures into `syllabus_structure`
- optional LLM normalizer fallback when parser confidence is low

Populate route behavior (`/api/admin/module/syllabus/populate`):
- creates ingestion record
- seeds default version from legacy chunks only if no versions exist

Legacy `src/lib/syllabus/chunks.json` is now bootstrap input, not planner truth layer.

---

## 8. Determinism and Replay

Hashing:
- `stableHash()` with deterministic key ordering (SHA-256)

`request_hash` inputs include:
- normalized chat transcript
- full `ModulePlanRequest`
- selected syllabus version + content hash
- key planning config values

Replay behavior:
- per-stage lookup by `(request_hash, stage)`
- replayed artifact can be copied from another run
- M1 chunk payload (`retrieved_chunk_ids`, `retrieved_chunk_text`) is persisted and reused

Helpers:
- `ensureM1RagChunkReuse(runId)`
- `ensureM2UsesStoredChunks(runId)`

---

## 9. Stage Engine (M0-M6)

### M0 Distill (`runM0Distill`)

- requires `unit` + `syllabusVersionId`
- validates version exists
- resolves selected LOs (explicit, inferred from transcript, or all for unit)
- normalizes constraints
- stores request JSON + request hash

### M1 Analyze (`runM1Analyze`)

- reads canonical structure for version+unit
- validates selected LOs exist in structure
- outputs LO/title list with source chunk IDs
- stores retrieved chunk payload for replay

### M2 Coverage (`runM2Coverage`)

- maps selected LOs to canonical AC targets from structure
- reuses M1 chunk payload metadata

### M3 Plan (`runM3Plan`)

- LLM planner (`callM3PlannerLLM`) only
- strict JSON contract for `MinimalLessonPlan`
- one automatic repair pass if first pass has blocking issues
- no deterministic fallback plan generation

### M4 Blueprints (`runM4Blueprints`)

- converts M3 plan into ordered blueprint IDs (e.g., `202-5A`, `202-5B`)
- builds `masterBlueprint` contracts
- uses LLM draft path with deterministic fallback per lesson
- stores extended artifact metadata (LO sets, ledgers)

### M5 Validate (`runM5Validate`)

- validates M2/M3/M4 consistency
- validates `masterBlueprint` contract per lesson
- validates LO ledger progression for duplicate prior content
- outputs `ValidationResult { valid, issues }`

### M6 Generate

Per-lesson function (`runM6GenerateLesson`):
- requires `M5.valid=true`
- generates one blueprint through adapter
- upserts generated lesson row + M6 summary artifact

Bulk function (`runM6Generate`):
- queue generation with concurrency `1..2`
- updates run status `m6-running` and potentially `failed`
- route gated by `MODULE_PLANNER_BULK_M6_ENABLED=true`

---

## 10. API Contracts

Common success shape:
```json
{
  "success": true,
  "stage": "M2",
  "replayed": false,
  "artifact": {}
}
```

Common error shape:
```json
{
  "success": false,
  "stage": "M2",
  "code": "MISSING_AC",
  "message": "...",
  "meta": {}
}
```

### Runs API

`GET /api/admin/module/runs`
- resolves version, unit, LOs, unit truth structure
- returns syllabus versions + latest ingestion

`POST /api/admin/module/runs`
- requires `syllabusVersionId` and `unit`
- creates run shell with `chatTranscript`

`GET /api/admin/module/runs/:id`
- returns run summary + replayable stage map

### Stage APIs

- `POST /api/admin/module/:id/m0-distill`
- `POST /api/admin/module/:id/m1-analyze`
- `POST /api/admin/module/:id/m2-coverage`
- `POST /api/admin/module/:id/m3-plan`
- `POST /api/admin/module/:id/m4-blueprints`
- `POST /api/admin/module/:id/m5-validate`

### Generation APIs

Per lesson:
- `POST /api/admin/module/:id/lessons/:blueprintId/generate`

Bulk (gated):
- `POST /api/admin/module/:id/m6-generate`

Syllabus ingestion:
- `POST /api/admin/module/syllabus/populate`
- `POST /api/syllabus/upload`
- `GET /api/syllabus/upload`

---

## 11. Adapter Integration

File: `src/lib/module_planner/adapter.ts`

Blueprint maps to `/api/lesson-generator` payload with:
- `unit`, `lessonId`, `topic`, `section`
- `layout`, `prerequisites`
- `mustHaveTopics` (semicolon-separated)
- `additionalInstructions` (includes AC anchors + blueprint compliance directive)
- `masterLessonBlueprint`

Base URL resolution:
1. explicit option
2. `MODULE_PLANNER_BASE_URL`
3. `NEXT_PUBLIC_APP_URL`
4. `http://localhost:3000`

---

## 12. Prompt and LLM Inventory

Module planner LLM usage:
- M3 planning (`callM3PlannerLLM`)
- M4 lesson draft generation (with deterministic fallback)

Lesson generation prompts still happen downstream in `/api/lesson-generator` and phase prompt files under `src/lib/generation/phases/*`.

---

## 13. Tests

Planner-related tests (`src/lib/module_planner/__tests__`):
- `feature-flag.test.ts`
- `hashing.test.ts`
- `planner.stages.test.ts`
- `planner.compliance-gaps.test.ts`
- `populate-workflow.test.ts`
- `syllabus-ingestion.test.ts`
- `syllabus.range.test.ts`
- `master-blueprint-contract.test.ts`
- `lesson-ui-smoke.test.ts`
- `lesson-mode-golden.test.ts`
- `failure-path.test.ts`

---

End of technical document.
