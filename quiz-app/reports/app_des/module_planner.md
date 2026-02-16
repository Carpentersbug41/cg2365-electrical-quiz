# Module Planner vNext - Operator Guide and Interface Reference

Last verified: 2026-02-16
Route: `/admin/module`
API base: `/api/admin/module/*`

This guide explains how to run the current Module Planner implementation from the admin UI.

---

## 1. What It Is

Module Planner is a syllabus-versioned pipeline that:
1. distills run request inputs (`M0`)
2. analyzes canonical unit/LO structure (`M1`)
3. extracts canonical AC coverage (`M2`)
4. creates lesson plan proposals (`M3`)
5. builds lesson blueprints (`M4`)
6. validates blueprint and coverage contracts (`M5`)
7. generates lessons from selected blueprints (per-lesson M6)

Feature gate:
- `MODULE_PLANNER_ENABLED=true`

Optional admin gate:
- `MODULE_PLANNER_ADMIN_TOKEN` (sent as `x-module-admin-token` or `Authorization: Bearer ...`)

---

## 2. Setup

Required for planner APIs/UI:
- `MODULE_PLANNER_ENABLED=true`

Required for DB-backed planner persistence:
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Required DB migrations:
- `supabase/migrations/202602140001_module_planner_vnext.sql`
- `supabase/migrations/202602140002_module_planner_ingestions.sql`

Run app:
```powershell
npm run dev
```

---

## 3. UI Walkthrough (`/admin/module`)

### Header and navigation

- Title: `Module Planner vNext`
- Right button `Lesson` links to `/generate`

### Syllabus controls

- `Populate syllabus`
  - seeds a default syllabus version from legacy chunks when no versions exist
  - tracks ingestion state (`RUNNING`, `READY`, `FAILED`)
- `Upload syllabus`
  - accepts `PDF`, `DOCX`, `TXT`
  - creates new syllabus version + chunks + unit structures
- `Syllabus version` selector
  - switches planner context to selected version

### Run setup

Inputs:
- `Unit`
- `Selected LOs` (default from selected unit)
- `Manual LO override` (optional)
- `Chat Transcript`
- `Notes`
- `Max lessons/LO`
- `Max ACs/Lesson (hard)`
- `Preferred ACs/Lesson (soft)`
- `Ordering` (`foundation-first` or `lo-order`)
- `Level`
- `Audience`
- `Replay-from-artifacts`

Buttons:
- `Create Run`
- `Plan lessons (M0-M5)`
- stage buttons for `M0`..`M5`
- `Refresh Run Summary`

### Results panels

- per-stage artifact panels (`M0`..`M5`)
- truth-layer panel for selected unit (LOs/ACs/range)
- run summary JSON
- chunk diagnostics (stage/chunk/page ranges)
- lesson plan matrix with per-blueprint `Generate now`
- generated lesson payload modal (`View`)

---

## 4. Stage Execution Behavior

### M0 Distill

Creates `ModulePlanRequest` with:
- `syllabusVersionId`
- selected `unit`
- resolved `selectedLos`
- normalized constraints
- ordering preference
- notes

Important behaviors:
- `syllabusVersionId` is required
- selected LOs can be inferred from transcript (`LO1`, `LO5`, etc.) when explicit input is empty
- request hash includes syllabus content hash + request + transcript

### M1 Analyze

- reads canonical unit structure from selected syllabus version
- validates selected LOs are present
- stores retrieved chunk IDs + serialized chunk text payload for replay determinism

### M2 Coverage

- maps each selected LO to canonical AC targets (`acKey`, `acText`, range)
- reuses M1 stored chunk payload for deterministic grounding metadata

### M3 Plan

- LLM-driven planner (no deterministic auto-plan fallback)
- one automatic repair pass if first plan has blocking issues
- fails with schema/validation error if repair also fails

### M4 Build Blueprints

- generates ordered lesson blueprints by LO
- includes `masterBlueprint` contract payload
- stores extended artifact fields:
  - `blueprints`
  - `loBlueprintSets`
  - `loLedgers`
  - `lessonLedgerMetadata`

### M5 Validate

- validates M2/M3/M4 coherence and contract compliance
- checks include:
  - missing/duplicate/unknown AC assignment
  - lesson and overlap constraints
  - blueprint contract sections/order/ID/anchor alignment
  - duplicate prior LO teaching content (ledger-based)

---

## 5. Generation (M6)

Default operator path is per-lesson generation from the matrix:
- `POST /api/admin/module/:runId/lessons/:blueprintId/generate`

Behavior:
- requires `M5.valid=true`
- stores row in `generated_lessons`
- updates M6 summary artifact (`generated`, `failed`, `lessonIds`)
- persists lesson payload metadata, including generated lesson JSON when available

Bulk M6 endpoint:
- `POST /api/admin/module/:runId/m6-generate`
- disabled unless `MODULE_PLANNER_BULK_M6_ENABLED=true`
- returns 403 with explicit message when disabled

---

## 6. Replay and Determinism

- `Replay-from-artifacts` uses `request_hash` + stage lookup
- if artifact belongs to another run, it is copied into current run
- M1 retrieved chunk payload is persisted and reused in M2

Keep transcript + constraints + syllabus version constant for reproducible outputs.

---

## 7. Syllabus Ingestion Details

### Populate flow

Endpoint: `POST /api/admin/module/syllabus/populate`
- creates ingestion row (`source=legacy-seed`)
- seeds legacy chunks only when no syllabus versions exist
- marks ingestion state `READY` or `FAILED`

### Upload flow

Endpoint: `POST /api/syllabus/upload`
- accepts multipart `file`
- extracts and cleans text
- deterministic chunking
- canonical structure extraction
- optional LLM normalizer fallback when parser confidence is low
- writes version metadata (`chunkCount`, `loCount`, `acCount`, etc.)

---

## 8. Common Errors and Checks

- `MODULE_PLANNER_DISABLED` -> enable `MODULE_PLANNER_ENABLED=true`
- `UNAUTHORIZED` -> send valid admin token if configured
- `JSON_SCHEMA_FAIL` in M0 -> missing/unknown `syllabusVersionId` or malformed payload
- `RAG_EMPTY` / `RAG_GROUNDEDNESS_FAIL` -> invalid unit/LO for selected syllabus version
- M3 failure -> LLM unavailable/invalid JSON or unresolved blocking issues after single repair
- M5 invalid -> inspect validation issues before any generation
- bulk M6 403 -> use per-lesson `Generate now` or enable bulk env flag

---

## 9. Key Source Files

- UI: `src/app/admin/module/page.tsx`
- Routes: `src/app/api/admin/module/*`
- Per-lesson generation route: `src/app/api/admin/module/[id]/lessons/[blueprintId]/generate/route.ts`
- Planner core: `src/lib/module_planner/planner.ts`
- Syllabus ingestion/parsing: `src/lib/module_planner/syllabus.ts`
- Persistence: `src/lib/module_planner/db.ts`
- Adapter to `/api/lesson-generator`: `src/lib/module_planner/adapter.ts`

---

End of operator guide.
