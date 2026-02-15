# Module Planner v6 - Technical Documentation

Last verified: 2026-02-14
Primary UI route: `/admin/module`
Primary API routes: `/api/admin/module/*`
Library root: `src/lib/module_planner/*`

This document is the deep technical reference for Module Planner v6 and its integration with the existing lesson generation code.

---

## 1. System Architecture

Execution path:

1. Browser UI (`src/app/admin/module/page.tsx`)
2. Module API routes (`src/app/api/admin/module/*`)
3. Planner core (`src/lib/module_planner/planner.ts`)
4. Planner persistence (`src/lib/module_planner/db.ts`)
5. Existing lesson generation adapter (`src/lib/module_planner/adapter.ts`)
6. Existing generator API (`/api/lesson-generator`)
7. Existing prompt pipelines (`lessonPromptBuilder`, `quizPromptBuilder`, phase prompt builders)

Feature gate:

- `MODULE_PLANNER_ENABLED=true` required.
- Guard lives in `src/lib/module_planner/featureFlag.ts`.
- API guard wrapper lives in `src/app/api/admin/module/_utils.ts`.

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
- `src/app/api/admin/module/[id]/m0-distill/route.ts`
- `src/app/api/admin/module/[id]/m1-analyze/route.ts`
- `src/app/api/admin/module/[id]/m2-coverage/route.ts`
- `src/app/api/admin/module/[id]/m3-plan/route.ts`
- `src/app/api/admin/module/[id]/m4-blueprints/route.ts`
- `src/app/api/admin/module/[id]/m5-validate/route.ts`
- `src/app/api/admin/module/[id]/m6-generate/route.ts`

UI:
- `src/app/admin/module/page.tsx`

---

## 3. Configuration and Runtime Flags

Environment variables:

- `MODULE_PLANNER_ENABLED`
  - true-only check (`raw.toLowerCase() === 'true'`)
- `MODULE_PLANNER_CONCURRENCY`
  - parsed int, clamped to `1..2`
- `MODULE_PLANNER_DB_PATH`
  - optional file path override for planner DB json
- `MODULE_PLANNER_BASE_URL`
  - optional base URL override for adapter
- `NEXT_PUBLIC_APP_URL`
  - fallback adapter base URL

Constants (`src/lib/module_planner/constants.ts`):

- `MAX_ACS_PER_LESSON = 4`
- `DEFAULT_MAX_LESSONS_PER_LO = 2`
- `DEFAULT_LEVEL = 'Level 2'`
- `DEFAULT_AUDIENCE = 'beginner'`
- `DEFAULT_ORDERING_PREFERENCE = 'foundation-first'`
- `DEFAULT_MINIMISE_LESSONS = true`

---

## 4. Persistence Layer

Storage implementation:

- File-backed JSON DB in `src/lib/module_planner/db.ts`
- Default file: `.module_planner/module_planner_db.json`
- Logical tables implemented as arrays:
  - `module_runs`
  - `module_run_artifacts`
  - `module_run_lessons`

Logical schema:

`module_runs`:
- `id: string`
- `created_at: string`
- `unit: string`
- `status: string`
- `chat_transcript: string`
- `request_json: ModulePlanRequest | null`
- `request_hash: string | null`

`module_run_artifacts`:
- `id: string`
- `module_run_id: string`
- `stage: 'M0'|'M1'|'M2'|'M3'|'M4'|'M5'|'M6'`
- `artifact_json: unknown`
- `retrieved_chunk_ids: string[]`
- `retrieved_chunk_text: string`
- `created_at: string`

`module_run_lessons`:
- `id: string`
- `module_run_id: string`
- `blueprint_id: string`
- `lesson_id: string`
- `status: 'pending'|'success'|'failed'`
- `error: string | null`

Upsert keys:
- Artifacts: `(module_run_id, stage)`
- Run lessons: `(module_run_id, blueprint_id)`

---

## 5. Type Contracts (Field-Level)

From `src/lib/module_planner/types.ts`.

`ModulePlanRequest`:
- `unit: string`
- `selectedLos: string[]`
- `constraints: { minimiseLessons, defaultMaxLessonsPerLO, maxLessonsOverrides, level, audience }`
- `orderingPreference: 'foundation-first'|'lo-order'`
- `notes: string`

`UnitStructure`:
- `unit: string`
- `unitTitle: string`
- `los: [{ lo, title, sourceChunkIds[] }]`

`CoverageTargets`:
- `unit: string`
- `los: [{ lo, coverageTargets: [{ acKey, acText, range, sourceChunkIds[] }] }]`

`MinimalLessonPlan`:
- `unit: string`
- `los: [{ lo, lessonCount, lessons: [{ topicCode, title, coversAcKeys[], whySplit }] }]`

`LessonBlueprint`:
- `id: string`
- `unit: string`
- `lo: string`
- `acAnchors: string[]`
- `topic: string`
- `mustHaveTopics: string[]`
- `level: string`
- `layout: 'split-vis'|'linear-flow'`
- `prerequisites: string[]`
- `masterBlueprint?: MasterLessonBlueprint`

`MasterLessonBlueprint` (high level):
- `identity`
- `anchors`
- `scopeControl`
- `lessonOutcomes`
- `blockPlan` (explicit required blocks/order/check-after-explanation mapping)
- `checksSpec`
- `practiceSpec`
- `misconceptions`
- `safetyRigRules`
- `masteryGate`
- `idConventions`

`ValidationResult`:
- `valid: boolean`
- `issues: ValidationIssue[]`

Validation issue codes:
- `MISSING_AC`
- `DUPLICATE_AC_ASSIGNMENT`
- `DUPLICATE_LESSON`
- `OVERLAP_HIGH`
- `TOO_BROAD_SCOPE`
- `EXCEEDS_MAX_LESSONS`
- `RAG_EMPTY`
- `RAG_GROUNDEDNESS_FAIL`
- `JSON_SCHEMA_FAIL`
- `BLUEPRINT_MISSING_SECTION`
- `BLUEPRINT_BLOCK_ORDER_INVALID`
- `BLUEPRINT_ID_PATTERN_INVALID`
- `BLUEPRINT_ANCHOR_MISMATCH`
- `BLUEPRINT_GENERATION_MISMATCH`

---

## 6. Schema Validation Layer

`src/lib/module_planner/schemas.ts` enforces strict key shape for each stage output.

Behavior:
- Missing key -> validation fail
- Extra key -> validation fail
- Wrong type -> validation fail

This is done with `assertKeys()` and per-contract validators.

---

## 7. Determinism and Replay

Hashing:
- `stableHash()` in `src/lib/module_planner/stableHash.ts`
- deterministic JSON-like serialization with sorted object keys
- hash algorithm: SHA-256

Inputs to `request_hash` in `planner.ts`:
- normalized `chatTranscript`
- full `ModulePlanRequest`
- config constants (`maxAcsPerLesson`, ordering, lesson caps)

Replay behavior:
- `stageReplay()` looks up artifact by `(request_hash, stage)` using `findArtifactByRequestHash`
- if artifact belongs to another run, copied into current run
- run status advanced to stage completion without recompute

RAG replay constraints:
- M1 stores `retrieved_chunk_ids` and serialized `retrieved_chunk_text`
- M2 reuses M1 stored payload before falling back to id lookup
- helpers:
  - `ensureM1RagChunkReuse(runId)`
  - `ensureM2UsesStoredChunks(runId)`

---

## 8. Syllabus Retrieval and Parsing

`src/lib/module_planner/syllabus.ts` uses local chunk data:
- import: `@/lib/syllabus/chunks.json`

Core functions:
- `getUnitChunks(unit)`
- `getUnitLos(unit)`
- `normalizeLo(lo)`
- `parseAssessmentCriteriaFromContent(content)`
- `parseRangeFromContent(content)`

AC parsing logic:
- enters after `**Assessment criteria**` or `**AC**`
- stops at `**Range` section
- captures numbered items and bullet continuations

Range parsing logic:
- enters at `**Range` line
- consumes bullet/line content until section break

---

## 9. Stage Engine (M0-M6)

Implemented in `src/lib/module_planner/planner.ts`.

M0 `runM0Distill`:
- normalizes transcript/unit
- resolves selected LOs
- sanitizes constraints defaults
- builds/stores `ModulePlanRequest`
- computes/stores `request_hash`

M1 `runM1Analyze`:
- loads selected unit chunks
- validates selected LOs grounded in chunks
- outputs unit LO structure
- persists retrieved chunk IDs/text

M2 `runM2Coverage`:
- loads M1 artifact + replayed chunk payload
- extracts ACs per LO
- canonical key: `{unit}.LO{n}.AC{n}.{index}`
- validates groundedness and non-empty coverage

M3 `runM3Plan`:
- partitions ACs by cap `MAX_ACS_PER_LESSON`
- enforces per-LO max lessons
- deterministic topic code generation (`5A`, `5B`, ...)
- validates no duplication/omission

M4 `runM4Blueprints`:
- builds deterministic blueprint IDs: `${unit}-${topicCode}${counter}`
- derives `mustHaveTopics` from AC texts
- picks layout via keyword heuristic
- sets prerequisites chain when `foundation-first`
- constructs `masterBlueprint` contract via `buildMasterLessonBlueprint()`

M5 `runM5Validate`:
- cross-stage coverage checks
- duplicate/overlap checks
- cap checks
- scope checks for `acAnchors` and `mustHaveTopics`
- validates `masterBlueprint` contract with actionable errors:
  - required sections
  - block order/check placement
  - ID convention consistency
  - anchor parity with `blueprint.acAnchors`

M6 `runM6Generate`:
- requires `M5.valid=true`
- runs queue with concurrency `1..2`
- calls adapter only
- persists per-blueprint run lesson status
- builds generation summary artifact
- passes `masterLessonBlueprint` into `/api/lesson-generator`

Status transitions:
- `created`
- `m0-complete` ... `m6-complete`
- `m6-running`
- `failed`

---

## 10. API Surface (Module Planner)

Guard and error serializer:
- `src/app/api/admin/module/_utils.ts`

Common success response:
```json
{
  "success": true,
  "stage": "M2",
  "replayed": false,
  "artifact": {}
}
```

Common error response:
```json
{
  "success": false,
  "stage": "M2",
  "code": "MISSING_AC",
  "message": "...",
  "meta": {}
}
```

Endpoints:
- `GET /api/admin/module/runs`
- `POST /api/admin/module/runs`
- `GET /api/admin/module/runs/:id`
- `POST /api/admin/module/:id/m0-distill`
- `POST /api/admin/module/:id/m1-analyze`
- `POST /api/admin/module/:id/m2-coverage`
- `POST /api/admin/module/:id/m3-plan`
- `POST /api/admin/module/:id/m4-blueprints`
- `POST /api/admin/module/:id/m5-validate`
- `POST /api/admin/module/:id/m6-generate`

M0 payload shape (as sent by UI):
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
  "notes": "...",
  "chatTranscript": "..."
}
```

---

## 11. UI Technical Wiring

`src/app/admin/module/page.tsx`.

Key technical behaviors:
- Bootstrap: `GET /api/admin/module/runs`
- Create run: `POST /api/admin/module/runs`
- Stage execution: `POST /api/admin/module/${runId}/${stageRoute}`
- Summary refresh: `GET /api/admin/module/runs/${runId}`
- Replay toggle maps to `replayFromArtifacts`
- `AbortController` aborts previous in-flight client call

Stage route mapping:
- `M0 -> m0-distill`
- `M1 -> m1-analyze`
- `M2 -> m2-coverage`
- `M3 -> m3-plan`
- `M4 -> m4-blueprints`
- `M5 -> m5-validate`
- `M6 -> m6-generate`

---

## 12. Adapter Integration with Existing Generator

Adapter: `src/lib/module_planner/adapter.ts`

Blueprint -> existing lesson request mapping:
- `unit` (number)
- `lessonId` (blueprint ID minus `${unit}-` prefix)
- `topic`
- `section` (mapped by unit)
- `layout`
- `prerequisites`
- `mustHaveTopics` (semicolon-joined)
- `additionalInstructions` (`AC Anchors: ... Follow masterLessonBlueprint exactly...`)
- `masterLessonBlueprint` (verbatim contract)

Snippet:
```ts
return {
  unit: Number.parseInt(blueprint.unit, 10),
  lessonId,
  topic: blueprint.topic,
  section: SECTION_BY_UNIT[blueprint.unit] ?? `Unit ${blueprint.unit}`,
  layout: blueprint.layout,
  prerequisites: blueprint.prerequisites,
  mustHaveTopics: blueprint.mustHaveTopics.join('; '),
  additionalInstructions: blueprint.acAnchors.length > 0
    ? `AC Anchors: ${blueprint.acAnchors.join(', ')}. Follow masterLessonBlueprint exactly; do not invent block structure.`
    : 'Follow masterLessonBlueprint exactly; do not invent block structure.',
  masterLessonBlueprint: blueprint.masterBlueprint,
};
```

Adapter call target:
- `POST ${baseUrl}/api/lesson-generator`

Base URL resolution precedence:
1. explicit `options.apiBaseUrl`
2. `MODULE_PLANNER_BASE_URL`
3. `NEXT_PUBLIC_APP_URL`
4. `http://localhost:3000`

---

## 13. Prompt Inventory (All Relevant Prompt Paths)

## 13.1 Module Planner stage prompts

Current implementation status:
- Module planner M0-M6 does not execute dedicated LLM prompts.
- It uses deterministic code paths (parsing + transforms) in `planner.ts` and `syllabus.ts`.

## 13.2 Existing lesson-generation prompts (invoked at M6)

When M6 calls `/api/lesson-generator`, prompt-driven generation occurs in existing pipeline.

Primary prompt builders:
- `src/lib/generation/lessonPromptBuilder.ts`
- `src/lib/generation/quizPromptBuilder.ts`

Phase prompt builders (sequential and scoring/refinement paths):
- `src/lib/generation/phases/Phase1_Planning.ts`
- `src/lib/generation/phases/Phase2_Vocabulary.ts`
- `src/lib/generation/phases/Phase3_Explanation.ts`
- `src/lib/generation/phases/Phase4_UnderstandingChecks.ts`
- `src/lib/generation/phases/Phase5_WorkedExample.ts`
- `src/lib/generation/phases/Phase6_Practice.ts`
- `src/lib/generation/phases/Phase7_Integration.ts`
- `src/lib/generation/phases/Phase8_SpacedReview.ts`
- `src/lib/generation/phases/Phase10_Score.ts`
- `src/lib/generation/phases/Phase12_Refine.ts`

Common prompt API for phases:
- `src/lib/generation/phases/PhasePromptBuilder.ts`
- methods: `buildSystemPrompt`, `buildUserPrompt`, `getPrompts`

### Phase 10 score prompt excerpt

```ts
prompt += `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions.trim()}\n\n`;
prompt += `ASSISTANT ACKNOWLEDGMENT: I will consider this context when scoring and identifying issues.\n\n`;
```

### Phase 12 refine prompt excerpt

```ts
prompt += `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions.trim()}\n\n`;
prompt += `ASSISTANT ACKNOWLEDGMENT: I will consider this context when refining the lesson.\n\n`;
```

### Message structuring in file generator

`src/lib/generation/fileGenerator.ts` `buildMessageArray()` parses this pattern:
- `ADDITIONAL CONTEXT FROM USER:`
- `ASSISTANT ACKNOWLEDGMENT:`
- main prompt

and emits multi-turn message objects to the LLM wrapper.

## 13.3 Generator-side blueprint enforcement

`/api/lesson-generator` now performs:
- pre-generation contract validation (`validateMasterLessonBlueprintContract`)
- post-generation lesson-vs-blueprint validation (`validateLessonAgainstMasterLessonBlueprint`)

If either fails, API returns `400` and generation is blocked.

---

## 14. Cross-Code Integration Points

- Module planner generation output ends in standard lesson files through existing generator.
- Existing `/api/lesson-generator` writes generation score metadata:
  - `metadata.generationScore`
  - `metadata.generationScoreDetails`

This is outside module planner itself but directly affects M6 produced lessons.

---

## 15. Technical Constraints and Known Deviations

Implemented behavior vs requested directive:
- UI route is `/admin/module` (not a tab inside `/admin/generate`).
- DB uses file-backed store, not SQL migrations.
- M1/M2 are parser-driven, not LLM prompt-driven.
- M6 failure error code currently mapped as `JSON_SCHEMA_FAIL` in wrapper path.

---

## 16. Testing Artifacts

Module planner tests:
- `src/lib/module_planner/__tests__/planner.stages.test.ts`
- `src/lib/module_planner/__tests__/feature-flag.test.ts`
- `src/lib/module_planner/__tests__/lesson-ui-smoke.test.ts`
- `src/lib/module_planner/__tests__/lesson-mode-golden.test.ts`
- `src/lib/module_planner/__tests__/__snapshots__/lesson-mode-golden.test.ts.snap`

---

End of technical document.
