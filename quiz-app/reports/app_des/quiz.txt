# Quiz System Documentation (DB-Backed Question Bank + Run/Review + Duplicate Control Pipeline)

Last updated: 2026-02-18  
Project root: `C:\Users\carpe\Desktop\hs_quiz\quiz-app`

## 1. Scope

This document describes the current quiz system end-to-end:

- Learner quiz experience (`/quiz`)
- Admin question generation/review experience (`/admin/questions`)
- Database schema and storage
- API contracts
- Generation stages and orchestration
- LLM integration in validate stage
- Batch trial quality workflow
- Duplicate prevention and cleanup workflows
- RLS security model
- Import/migration scripts
- Tests and operational runbooks

This is the canonical implementation doc for the question bank system currently in this repo.

## 2. System Overview

The quiz system uses a database-backed question bank (`question_items`) instead of static TypeScript arrays for learner selection.

High-level model:

1. Syllabus truth source comes from `syllabus_structure` (latest syllabus version).
2. Admin creates a generation run in `/admin/questions`.
3. Pipeline stages execute and create `draft` questions.
4. Admin reviews/approves/rejects drafts.
5. Learner `/quiz` only consumes `status='approved'` questions.
6. Duplicate controls run at generation, approval, and cleanup-report layers.

Core folders:

- `src/app/quiz/page.tsx`
- `src/app/admin/questions/page.tsx`
- `src/app/api/quiz/*`
- `src/app/api/admin/questions/*`
- `src/lib/questions/*`
- `supabase/migrations/202602170001_question_bank_generation_review.sql`
- `supabase/migrations/202602180001_question_bank_rls.sql`

## 3. Data Storage

## 3.1 Syllabus Source

Current implementation reads syllabus from existing module-planner tables:

- `syllabus_versions`
- `syllabus_structure`

Adapter layer:

- `src/lib/questions/syllabusRepo.ts`

It projects `syllabus_structure` into runtime Unit/LO/AC objects used by quiz and generation.

## 3.2 Question Tables

Created by migration:

- `supabase/migrations/202602170001_question_bank_generation_review.sql`

Tables:

1. `question_items`
2. `question_generation_runs`
3. `question_generation_run_steps`
4. `question_reviews`

### `question_items`

Stores all question records (static import + generated + future seed sources).  
Important fields:

- `generation_run_id`
- `unit_code`, `lo_code`, `ac_code`
- `level`, `difficulty`, `format`
- `stem`, `options`, `correct`, `rationale`
- `source` (`static`, `generated`, `syllabus_seed`)
- `status` (`draft`, `approved`, `rejected`, `retired`)
- `hash` (unique dedupe key)

Key constraints/indexes:

- `idx_question_items_hash` (unique)
- `idx_question_items_unit_status`
- `idx_question_items_unit_lo_status`
- `idx_question_items_unit_lo_ac_status`
- `idx_question_items_format`
- `idx_question_items_level`
- `idx_question_items_run_status`

FK:

- `generation_run_id -> question_generation_runs(id)` with `ON DELETE SET NULL`

### `question_generation_runs`

Stores run configuration and summary:

- `unit_code`, `level`, `lo_codes`
- `target_count`
- `format_mix`, `difficulty_mix`
- `status` (`queued`, `running`, `completed`, `failed`, `cancelled`)
- `summary` JSONB

### `question_generation_run_steps`

Per-step execution state:

- `run_id`
- `step_key` (`distill`, `analyze`, `extract_coverage`, `plan`, `build_blueprints`, `validate`, `refresh_summary`)
- `status`
- `started_at`, `completed_at`
- `output`, `error`

Unique:

- `(run_id, step_key)`

### `question_reviews`

Audit trail for review actions:

- `question_id`
- `action` (`approve`, `reject`, `edit`, `retire`)
- `before`, `after`
- `actor`

## 4. Runtime Type Model

Defined in:

- `src/lib/questions/types.ts`

Includes:

- `QuestionItem`
- `QuestionGenerationRun`
- `QuestionGenerationRunStep`
- `QuestionBlueprint`
- `QuizBuildRequest`

## 5. Repository/Service Layer

## 5.1 Bank Repository

File: `src/lib/questions/bankRepo.ts`

Responsibilities:

- Create/list/get/update runs
- Upsert/list run steps
- Insert/list/update questions
- Create review audits
- Query approved question scopes and counts
- Paginate count scans for full-bank correctness (no 10k truncation)

Representative snippet:

```ts
export async function listApprovedQuestionsByScope(input: {
  unit_code: string;
  level: number;
  lo_codes?: string[];
  difficulty?: string;
  format?: string;
}): Promise<QuestionItem[]> { ... }
```

## 5.2 Syllabus Repository

File: `src/lib/questions/syllabusRepo.ts`

Responsibilities:

- Read latest syllabus structures
- Resolve units and LO/AC hierarchy

## 5.3 Validation + Hash

Files:

- `src/lib/questions/hash.ts`
- `src/lib/questions/validation.ts`

Hash:

- SHA-256 over normalized `stem + options + correct + unit/lo/ac + format`.

Validation:

- Field presence
- MCQ/multi-select option rules
- Correct-answer consistency
- Distinct options
- `all of the above` guard
- rationale requirement for MCQ/scenario

## 5.4 AC Mixing

File: `src/lib/questions/acMixing.ts`

Algorithm:

- Weight by coverage gap: `1 / (1 + approved_count_for_ac)`
- Weighted AC sampling
- Deduped question pick by:
  - row id
  - normalized content signature (`stem + options + correct`)
- Fallback pool fill
- Shortfall metadata

## 5.5 Similarity Service

File: `src/lib/questions/similarity.ts`

Current duplicate detection is deterministic and non-LLM:

- normalize text
- tokenize + stop-word removal
- weighted Jaccard scoring across stem/options/correct
- threshold varies by scope overlap (same LO/AC/format is stricter)

## 5.6 Alignment Gate

File: `src/lib/questions/alignment.ts`

Purpose:

- Score semantic-alignment of generated question content to selected LO/AC/range context
- Reject off-topic drafts before insertion
- Adaptive thresholds for broad AC text versus specific AC text

## 5.7 Prompt Builder

File: `src/lib/questions/generation/promptBuilder.ts`

Purpose:

- Centralized single-question and batch prompt templates
- Supports injected LO-specific context text in batch mode
- Enforces strict JSON contract and scope constraints

## 6. Admin Generation Pipeline

Orchestrator:

- `src/lib/questions/generation/orchestrator.ts`

Step order:

1. `distill`
2. `analyze`
3. `extract_coverage`
4. `plan`
5. `build_blueprints`
6. `validate`
7. `refresh_summary`

State is persisted into `question_generation_run_steps`.

## 6.1 Step Details

### Distill

- Loads unit/LO/AC from syllabus repo for run scope.
- Persists distilled context bundle.

### Analyze

- Produces per-AC structured analysis:
  - recommended formats
  - key terms
  - risk flags (currently empty list)

### Extract Coverage

- Reads approved bank coverage in scope.
- Produces counts by LO/AC/format/difficulty.

### Plan

- Uses AC-gap weighting and run target.
- Allocates counts by format mix and difficulty mix.

### Build Blueprints

- Expands plan into one blueprint per target question.

### Validate (LLM-integrated + alignment + near-duplicate gate)

- Implemented in:
  - `src/lib/questions/generation/validateAndInsert.ts`

Flow per blueprint:

1. LLM prompt generation (strict JSON only)
2. Parse + coerce (with malformed-JSON recovery)
3. Hard validation
4. If fail: one repair retry using validation errors
5. Per-blueprint bounded retries (`maxAttemptsPerBlueprint`) for alternate assessment angles
6. Alignment gate check (LO/AC/range overlap scoring)
7. Dedupe by hash
8. Near-duplicate check against:
  - approved questions in run scope
  - already-accepted drafts in current run
9. Insert as `draft` only when all gates pass

Output includes diagnostics:

- `llm_used_count`
- `repair_retry_count`
- `fallback_count`
- `created_count`
- `failed_count`
- `inserted_question_ids`

### Refresh Summary

- Summarizes run results and writes `question_generation_runs.summary`.

## 7. LLM Wiring Details

LLM client:

- `src/lib/llm/client.ts`

Model selection:

- `src/lib/config/geminiConfig.ts`

Current validate usage:

```ts
const model = client.getGenerativeModel({
  model: getGeminiModelWithDefault(),
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 1200,
    responseMimeType: 'application/json',
  },
});
```

Repair strategy:

- One retry only (bounded).
- Prompt includes concrete validation error reasons.

Deterministic fallback remains always available to preserve run continuity.

## 8. Admin UI

Page:

- `src/app/admin/questions/page.tsx`

Capabilities:

- Create run (unit/level/LO/targets/mixes)
- Start selected run
- Cancel selected run (`queued`/`running`)
- View run list and statuses
- Inspect step timeline and raw step JSON
- Auto-refresh timeline while run is in progress
- Validate-stage metrics badges (`LLM used`, `Repair retries`, `Fallbacks`)
- Review queue actions:
  - approve
  - reject
  - approve all pending drafts
- Review queue only displays `status='draft'` items
- Duplicate operations:
  - load duplicate cluster report for selected scope
  - retire duplicate cluster members while keeping selected canonical item
- Batch trial operations:
  - run batch-50 quality trial
  - optional context injections (one line per instruction/snippet)
  - visual progress bar while trial is running
  - trial metrics: parsed/accepted/valid/alignment/duplicate counts
  - alignment failure samples and near-duplicate pair samples

## 9. Learner UI

Page:

- `src/app/quiz/page.tsx`

Behavior:

- Loads dynamic unit catalog from DB-backed API.
- Supports unit practice with optional LO dropdown filter.
- Shows LO descriptions in UI.
- Builds quiz via server-side API using approved questions only.
- Uses existing `Quiz` component (MCQ-compatible payload shape).

## 10. API Contracts

## 10.1 Learner APIs

### `GET /api/quiz/catalog`

Returns units from syllabus + approved counts (includes zero-count units).

### `GET /api/quiz/units/:unit_code/los`

Returns LO list and approved counts for selected unit.

### `POST /api/quiz/build`

Input:

```json
{
  "unit_code": "202",
  "level": 2,
  "mode": "lo",
  "lo_codes": ["LO1"],
  "count": 20
}
```

Output:

- `questions[]` (MCQ payload for current renderer)
- `meta.shortfall`
- `meta.selection_summary`

Guarantee:

- Only approved questions are selected.

## 10.2 Admin APIs

### Runs

- `GET /api/admin/questions/runs`
- `POST /api/admin/questions/runs`
- `GET /api/admin/questions/runs/:run_id`
- `POST /api/admin/questions/runs/:run_id/start`
- `POST /api/admin/questions/runs/:run_id/cancel`
- `GET /api/admin/questions/runs/:run_id/drafts`

### Review Actions

- `POST /api/admin/questions/:question_id/approve`
- `POST /api/admin/questions/:question_id/reject`
- `POST /api/admin/questions/:question_id/edit`

Approval guard:

- `approve` blocks near-duplicates of already approved questions with `409` / `code='NEAR_DUPLICATE'`.

### Duplicate Control APIs

- `GET /api/admin/questions/duplicates`
  - Query: `unit_code` (required), `level` (optional), `lo_codes` (optional), `max_items` (optional)
  - Returns near-duplicate clusters in selected scope
- `POST /api/admin/questions/duplicates/resolve`
  - Body: `cluster_ids`, optional `keep_id`
  - Retires duplicate cluster members and keeps one canonical approved question

### Trial API

- `POST /api/admin/questions/trials/batch-quality`
  - Body: `unit_code`, `lo_code`, `level`, `count`, optional `context_injections[]`
  - Behavior:
    - multi-attempt batch generation
    - malformed JSON recovery/skip
    - strict acceptance filter (valid + aligned + non-duplicate)
    - returns accepted question set and diagnostics

### Retire/Delete APIs

- `POST /api/admin/questions/:question_id/retire`
- `POST /api/admin/questions/:question_id/delete`

## 11. Security and RLS

Migration:

- `supabase/migrations/202602180001_question_bank_rls.sql`

RLS enabled for:

- `question_items`
- `question_generation_runs`
- `question_generation_run_steps`
- `question_reviews`

Policies:

- Learner (`anon`/non-admin): can select only approved rows from `question_items`
- Learner cannot write question tables
- Learner cannot read generation tables
- Admin policy gate uses `public.is_admin()` for CRUD on all question tables

## 12. Static Import

Script:

- `scripts/importStaticQuestionsToBank.ts`

What it does:

- Reads legacy TS-tagged question banks
- Maps into `question_items`
- Marks `source='static'`, `status='approved'`
- Computes hash
- Upserts by unique hash

## 13. Test Coverage

Question-system tests:

- `src/lib/questions/__tests__/hash.test.ts`
- `src/lib/questions/__tests__/validation.test.ts`
- `src/lib/questions/__tests__/acMixing.test.ts`
- `src/lib/questions/__tests__/validateAndInsert.test.ts`
- `src/lib/questions/__tests__/alignment.test.ts`

Coverage intent:

- Hash stability
- Hard validation rules
- AC mixing and shortfall behavior
- LLM path:
  - first-pass success
  - repair retry path
  - deterministic fallback path

## 14. Operational Runbook

## 14.1 Apply Migrations

```powershell
npx supabase migration list --linked
npx supabase db push --linked
```

## 14.2 Import Static Questions

```powershell
npx tsx scripts/importStaticQuestionsToBank.ts
```

## 14.3 Run Local UI

```powershell
npm run dev
```

URLs:

- `http://localhost:3000/admin/questions`
- `http://localhost:3000/quiz`

## 14.4 Smoke Generation

- Create run in admin UI.
- Start run.
- Verify step statuses and draft rows.
- Verify cancel action on a queued/running run.
- Approve subset.
- Verify duplicate report loads for chosen unit/level scope.
- Resolve one duplicate cluster and confirm retired rows are excluded from learner quiz selection.
- Build learner quiz by Unit/LO.
- Confirm no draft items appear in learner payloads.

## 15. Known Limits and Next Work

1. Learner renderer currently consumes MCQ-compatible payload; non-MCQ rendering is a separate enhancement.
2. Analyze step is currently mostly rule-based and can be extended with richer risk tagging.
3. Similarity detection is rule-based token overlap (no embedding/LLM semantic scorer yet).
4. Batch trial currently uses client-side progress animation; server-side streaming progress is a future enhancement.

## 16. File Index (Implementation Map)

Core:

- `src/lib/questions/types.ts`
- `src/lib/questions/bankRepo.ts`
- `src/lib/questions/syllabusRepo.ts`
- `src/lib/questions/hash.ts`
- `src/lib/questions/validation.ts`
- `src/lib/questions/acMixing.ts`
- `src/lib/questions/similarity.ts`
- `src/lib/questions/alignment.ts`

Generation:

- `src/lib/questions/generation/orchestrator.ts`
- `src/lib/questions/generation/validateAndInsert.ts`
- `src/lib/questions/generation/promptBuilder.ts`

APIs:

- `src/app/api/quiz/catalog/route.ts`
- `src/app/api/quiz/units/[unit_code]/los/route.ts`
- `src/app/api/quiz/build/route.ts`
- `src/app/api/admin/questions/_utils.ts`
- `src/app/api/admin/questions/runs/route.ts`
- `src/app/api/admin/questions/runs/[run_id]/route.ts`
- `src/app/api/admin/questions/runs/[run_id]/start/route.ts`
- `src/app/api/admin/questions/runs/[run_id]/cancel/route.ts`
- `src/app/api/admin/questions/runs/[run_id]/drafts/route.ts`
- `src/app/api/admin/questions/duplicates/route.ts`
- `src/app/api/admin/questions/duplicates/resolve/route.ts`
- `src/app/api/admin/questions/trials/batch-quality/route.ts`
- `src/app/api/admin/questions/[question_id]/approve/route.ts`
- `src/app/api/admin/questions/[question_id]/reject/route.ts`
- `src/app/api/admin/questions/[question_id]/edit/route.ts`
- `src/app/api/admin/questions/[question_id]/retire/route.ts`
- `src/app/api/admin/questions/[question_id]/delete/route.ts`

UI:

- `src/app/admin/questions/page.tsx`
- `src/app/quiz/page.tsx`

Database:

- `supabase/migrations/202602170001_question_bank_generation_review.sql`
- `supabase/migrations/202602180001_question_bank_rls.sql`

Scripts:

- `scripts/importStaticQuestionsToBank.ts`
