# Module Planner v6 - Operator Guide and Interface Reference

Last verified: 2026-02-14
Route: `/admin/module`
API base: `/api/admin/module/*`

This document explains exactly how to use Module Planner v6 as implemented, including UI controls, stage behavior, payloads, and what prompts/instructions are actually used.

---

## 1. What It Is

Module Planner v6 is a staged module-generation workflow that creates lesson blueprints and then calls the existing lesson generator.

Stages:
- `M0` Distill
- `M1` Analyze
- `M2` Extract Coverage
- `M3` Plan
- `M4` Build Blueprints (now includes strict `masterBlueprint` contract)
- `M5` Validate (now enforces blueprint contract compliance)
- `M6` Generate (now blocks if lesson output violates blueprint contract)

Feature flag:
- `MODULE_PLANNER_ENABLED=true` is required

If disabled, endpoints return:
```json
{
  "success": false,
  "code": "MODULE_PLANNER_DISABLED",
  "message": "Module planner is disabled by MODULE_PLANNER_ENABLED."
}
```

---

## 2. Exact UI Walkthrough (`/admin/module`)

## 2.1 Header

- Title: `Module Planner v6`
- Right button `Lesson` links to `/generate`

## 2.2 Run Setup Fields

Left column:
- `Unit`
  - dropdown from `GET /api/admin/module/runs`
- `Selected LOs (comma-separated)`
  - example: `LO1, LO5`
  - blank means planner resolves defaults from unit
- `Chat Transcript`
  - free text intent for the run

Right column:
- `Notes`
  - additional planning note text
- `Max lessons / LO`
  - numeric lesson cap used by M3
- `Ordering`
  - `foundation-first` or `lo-order`
- `Level`
  - default `Level 2`
- `Audience`
  - default `beginner`
- `Replay-from-artifacts`
  - if checked, stages reuse existing artifacts for matching `request_hash`

Buttons:
- `Create Run`
- `Stop` (aborts current browser request only)

## 2.3 Stages Section

Stage buttons:
- `Distill`
- `Analyze`
- `Extract Coverage`
- `Plan`
- `Build Blueprints`
- `Validate`
- `Generate`

Button suffix:
- `*` means replay artifact exists for this stage/hash

## 2.4 Output Panels

- One JSON panel per stage showing latest artifact
- Run summary JSON panel shows:
  - run status
  - stored artifacts
  - generated lessons rows

---

## 3. How to Run It (Step-by-Step)

1. Set env flag and run app.
```powershell
$env:MODULE_PLANNER_ENABLED="true"
npm run dev
```
2. Open `http://localhost:3000/admin/module`.
3. Fill fields:
- Unit: `202`
- Selected LOs: `LO1, LO5` (optional)
- Chat Transcript: see example below
- Notes: optional
- Max lessons/LO: `2` (or desired)
- Ordering: `foundation-first`
4. Click `Create Run`.
5. Execute stages in order (`M0` -> `M6`).
6. Check `M5` output (`valid: true`) before generating.
7. Click `Generate`.
8. Inspect Run Summary for lesson generation success/failure rows.

---

## 4. What to Type (Prompt/Input Examples)

These are the user inputs currently used by the interface.

## 4.1 Chat Transcript examples

Example A:
```text
Plan Unit 202 focusing on LO1 and LO5. Keep lessons concise and beginner-friendly. Start with foundation maths before magnetism.
```

Example B:
```text
Create minimal coverage for Unit 203 LO1 and LO2 with no more than 2 lessons per LO. Prioritise practical installation sequence.
```

## 4.2 Notes examples

```text
Keep language simple. Avoid unnecessary lesson splits.
```

```text
Bias toward split-vis when electrical diagrams/waveforms are central.
```

Important:
- Chat Transcript and Notes are planning inputs.
- They are not currently passed as open-ended LLM prompts in the module planner pipeline.

---

## 5. Prompts/Instructions Involved (Exact Runtime Behavior)

Current module planner implementation is deterministic parser/planner logic.

What this means:
- No dedicated M0-M6 LLM prompt templates are executed in this module path.
- Input text (`chatTranscript`, `notes`) is used to shape request/config.
- M1/M2 read from local syllabus chunks (`@/lib/syllabus/chunks.json`) and parse LO/AC content.

Where instruction logic exists:
- Distill logic and defaults: `src/lib/module_planner/planner.ts`
- Syllabus parsing rules: `src/lib/module_planner/syllabus.ts`

Generator prompt note:
- At M6, module planner calls existing `/api/lesson-generator` through adapter.
- Prompting inside the existing lesson generator remains in the legacy generation pipeline, not module planner stages.

---

## 6. API Contracts (Used by UI)

## 6.1 Create/list runs

`GET /api/admin/module/runs`
- returns available units

`POST /api/admin/module/runs`
```json
{
  "unit": "202",
  "chatTranscript": "Plan LO1 and LO5 with concise coverage"
}
```

## 6.2 Get run summary

`GET /api/admin/module/runs/:id`
- returns run, artifacts, lessons, replayable map

## 6.3 Stage execution

All stage endpoints accept:
```json
{ "replayFromArtifacts": true }
```

M0 accepts additional distill payload:
```json
{
  "replayFromArtifacts": true,
  "unit": "202",
  "selectedLos": ["LO1", "LO5"],
  "constraints": {
    "minimiseLessons": true,
    "defaultMaxLessonsPerLO": 2,
    "maxLessonsOverrides": {},
    "level": "Level 2",
    "audience": "beginner"
  },
  "orderingPreference": "foundation-first",
  "notes": "Keep concise",
  "chatTranscript": "Plan LO1 and LO5"
}
```

Stage endpoints:
- `POST /api/admin/module/:id/m0-distill`
- `POST /api/admin/module/:id/m1-analyze`
- `POST /api/admin/module/:id/m2-coverage`
- `POST /api/admin/module/:id/m3-plan`
- `POST /api/admin/module/:id/m4-blueprints`
- `POST /api/admin/module/:id/m5-validate`
- `POST /api/admin/module/:id/m6-generate`

Generator payload from M6 to `/api/lesson-generator` now includes:
- `masterLessonBlueprint` (hard contract consumed by generator API)

Success shape:
```json
{
  "success": true,
  "stage": "M3",
  "replayed": false,
  "artifact": {}
}
```

Error shape:
```json
{
  "success": false,
  "stage": "M3",
  "code": "MISSING_AC",
  "message": "...",
  "meta": {}
}
```

---

## 7. Stage Outputs You Should Expect

- `M0`: `ModulePlanRequest`
- `M1`: unit LO structure with `sourceChunkIds`
- `M2`: canonical AC keys per LO
- `M3`: minimal lesson plan with topic codes (`5A`, `5B`)
- `M4`: `LessonBlueprint[]` with deterministic IDs like `202-5A1` and a populated `masterBlueprint` object per lesson
- `M5`: validation (`valid` + `issues`) including blueprint section/order/ID/anchor checks
- `M6`: generation summary (`generated`, `failed`, `lessonIds`) after enforcing blueprint contract at `/api/lesson-generator`

If `M5.valid` is false, do not run `M6`.

---

## 8. Replay and Determinism

- A stable `request_hash` is computed from transcript + request + constants.
- With replay ON and matching hash, stage artifact is reused.
- `M1` chunk IDs/text are persisted and reused for deterministic `M2` behavior.

Operator guidance:
- Keep transcript and constraints unchanged if you want exact repeat output.
- Change any of those and you may get a different hash and a fresh run path.

---

## 9. Failure Handling and Practical Troubleshooting

Common causes:
- Missing flag -> `MODULE_PLANNER_DISABLED`
- Bad unit/LO -> `RAG_EMPTY` or `RAG_GROUNDEDNESS_FAIL`
- Over-tight lesson cap -> `EXCEEDS_MAX_LESSONS`
- Coverage mismatch -> `MISSING_AC`, `DUPLICATE_AC_ASSIGNMENT`
- Blueprint contract mismatch -> `BLUEPRINT_MISSING_SECTION`, `BLUEPRINT_BLOCK_ORDER_INVALID`, `BLUEPRINT_ID_PATTERN_INVALID`, `BLUEPRINT_ANCHOR_MISMATCH`
- Generation failure in M6 -> run status can become `failed`

Quick checks:
1. Confirm `MODULE_PLANNER_ENABLED=true`.
2. Use valid unit and LO tags (`LO1`, `LO2`, ...).
3. Increase `Max lessons / LO` if M3 fails cap checks.
4. Re-run stage with replay disabled if artifact seems stale.
5. If M5 fails blueprint checks, inspect `M4` artifact `masterBlueprint` and fix missing/invalid sections before M6.

---

## 10. Current Implementation Notes

- Route is `/admin/module` (not tabbed into `/admin/generate`).
- Persistence is file-backed logical tables under `.module_planner/module_planner_db.json` by default.
- `Stop` button aborts client fetch only.

---

## 11. Key Source Files

- UI: `src/app/admin/module/page.tsx`
- Stage engine: `src/lib/module_planner/planner.ts`
- Master blueprint contract builder/validators: `src/lib/module_planner/masterLessonBlueprint.ts`
- Schemas: `src/lib/module_planner/schemas.ts`
- Types: `src/lib/module_planner/types.ts`
- Syllabus parsing: `src/lib/module_planner/syllabus.ts`
- Adapter: `src/lib/module_planner/adapter.ts`
- API routes: `src/app/api/admin/module/*`

---

End of operator guide.
