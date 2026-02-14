# Microbreak Game Generator UI - Current Implementation

Last verified: 2026-02-12
Status: Implemented and in use
Scope: Admin generation UI, API, generation service, runtime rendering

---

## 1. Overview

The microbreak system inserts short engagement blocks into lesson JSON. It supports preview-before-save from an admin page and renders in learner lesson flows.

Primary admin route:
- `/admin/generate-games`

Primary API route:
- `/api/admin/generate-games`

---

## 2. Current Architecture

### Admin page and form

- Page: `src/app/admin/generate-games/page.tsx`
- Form and state orchestration: `src/components/admin/GameGeneratorForm.tsx`

### Server API

- Route: `src/app/api/admin/generate-games/route.ts`
- Uses `generateMicrobreaksForLesson()` from `src/lib/generation/gameGenerator.ts`

### Learner runtime

- Block renderer: `src/components/learning/microbreaks/MicrobreakBlock.tsx`
- Game components under `src/components/learning/microbreaks/games/`
- Telemetry service: `src/lib/microbreaks/telemetryService.ts`

---

## 3. Supported Game Types

Current union in UI/API/types:
- `matching`
- `sorting`
- `spot-error`
- `tap-label`
- `quick-win`

Type source:
- `src/data/lessons/types.ts` (`GameType` / `MicrobreakContent`)

---

## 4. Admin UI Flow

## 4.1 Load lessons (GET)

On mount, form calls:
- `GET /api/admin/generate-games`

Response includes lesson options with:
- `id`, `filename`, `title`, `unit`, `description`
- `microbreakCount`
- `vocabTermCount`, `explanationCount`, `totalBlocks`
- boolean flags `hasVocab`, `hasExplanations`

## 4.2 Configure generation

Form state:
- lesson selected by `filename`
- selected game types (checkbox set)
- game count per type: `1` or `2` (UI constrained)

The form computes total requested games:
- `total = count * selectedGameTypes.size`

## 4.3 Preview mode

`handleGeneratePreview()` posts:
- `mode: "preview"`

If successful:
- `generatedGames` stored in form state
- preview UI shown via `GamePreview`

## 4.4 Save mode

`handleSaveToLesson()` posts:
- `mode: "save"`

If successful:
- lesson file updated on disk
- success message shown
- lesson list is re-fetched to refresh microbreak counts

---

## 5. API Contract

## 5.1 GET `/api/admin/generate-games`

Behavior:
- scans `src/data/lessons/*.json`
- parses each lesson
- returns metadata for selection and readiness

Error handling:
- per-file read errors are logged and file is skipped
- route-level scan failure returns `500`

## 5.2 POST `/api/admin/generate-games`

Expected request body:

```json
{
  "filename": "203-3A-circuit-types-what-they-do-principles-of-operation.json",
  "gameTypes": ["matching", "sorting"],
  "count": 2,
  "mode": "preview"
}
```

Validation and security:
- `GEMINI_API_KEY` must exist
- `filename` required
- `gameTypes` must be non-empty array
- filename sanitized to alphanumeric/dash/dot
- filename must end with `.json`
- filename must not contain path separators

Generation behavior:
- route computes `totalGames = count * gameTypes.length`
- calls `generateMicrobreaksForLesson(lesson, { gameTypes, count: totalGames })`

Response modes:
- `mode: "preview"` -> returns generated games only (no file write)
- `mode: "save"` -> appends games to lesson blocks, sorts by order, updates metadata, writes JSON

Save-side metadata update behavior:
- `lesson.metadata.updated = YYYY-MM-DD`
- increments minor segment of `lesson.metadata.version` when present

---

## 6. Generation Service Details

Implementation:
- `src/lib/generation/gameGenerator.ts`

LLM usage:
- `GoogleGenerativeAI` directly (with configured model from `geminiConfig`)
- `responseMimeType: "application/json"`

Input content sources used in prompt:
- vocabulary block terms
- explanation block snippets

Key prompt constraints baked in:
- use only already-taught lesson content
- short items
- reinforcement only (no new information)

---

## 7. Placement Algorithm

Core placement logic aims to keep games pedagogically safe and interleaved.

### Minimum safe order

`getMinimumSafeGameOrder()`:
- anchors after last explanation if explanations exist
- otherwise after last vocab block

### Interleaved slot construction

`buildInterleavedGameOrders()`:
- scans non-microbreak blocks in order
- ignores `spaced-review` as insertion anchor
- inserts at most one microbreak per gap
- skips gaps that already contain a microbreak
- avoids collisions with existing block orders
- caps generated count to available valid slots

### Manual placement support

If `insertAfterBlocks` is provided, placement can target specific block IDs.

### Validation

`validateGamePlacement()` checks for too-early placement:
- before vocab anchor
- before explanation anchor

Warnings are logged; generation still returns blocks.

---

## 8. Saved Lesson Mutation Rules

When `mode = "save"`, API does:
1. `lesson.blocks.push(...games)`
2. `lesson.blocks.sort((a, b) => a.order - b.order)`
3. metadata update/version bump
4. overwrite lesson JSON file

No separate patch file is used for this path.

---

## 9. Learner Runtime Behavior

### Rendering

`MicrobreakBlock` dispatches by content:
- `breakType: "rest"` -> `RestMicrobreak`
- `gameType` switch -> matching/sorting/spot-error/tap-label/quick-win components

### Telemetry

Logged via `logMicrobreakTelemetry()` to localStorage key:
- `microbreak-telemetry`

Telemetry payload includes:
- `lessonId`, `breakId`, `breakType`, optional `gameType`
- `startedAt`, optional `completedAt`
- `skipped`
- optional `gameScore`, `gameAccuracy`

### Preferences and effects

Celebration/sound preferences key:
- `microbreak-preferences`

Current sound assets:
- success: `/sounds/correct.mp3`
- failure: `/sounds/wrong.mp3`
- click: `/sounds/click.mp3`

Celebration engine includes 10 effect variants.

---

## 10. Data Model Reference

Microbreak types in `src/data/lessons/types.ts`:
- `RestMicrobreakContent`
- `MatchingGameContent`
- `SortingGameContent`
- `SpotErrorGameContent`
- `TapLabelGameContent`
- `QuickWinGameContent`

Lesson block representation:
- `type: "microbreak"`
- `content: MicrobreakContent`
- `order: number`

---

## 11. Operational Notes and Constraints

- API key is mandatory for generation requests.
- UI currently constrains count-per-type to 1 or 2.
- API computes total requested games as count-per-type multiplied by number of selected types.
- If valid interleaved slots are fewer than requested, generator caps to available slots and logs warning.
- Existing microbreaks are considered during slot assignment to avoid clustering.

---

## 12. Known Gaps

- Admin route has no explicit auth guard in this file; access control depends on app-level deployment conventions.
- Generation is tied to Gemini path in `gameGenerator.ts` (no Vertex abstraction used here).
- API logs verbose request/stack details in error paths for debugging.

---

This document replaces earlier versions that no longer matched current game type set, placement logic, and sound asset paths.
