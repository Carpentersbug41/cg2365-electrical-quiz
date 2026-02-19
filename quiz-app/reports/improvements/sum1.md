# Handover Summary: Quiz Question Generation / Admin Workflow

As-of: 2026-02-19
Project: `C:\Users\carpe\Desktop\hs_quiz\quiz-app`

## 1) Core Goal
Primary objective from user:
- Make question generation for `/admin/questions` produce high-quality, LO/AC-aligned, non-duplicate questions at usable volume.
- Prefer batch generation (trial-style), not fragile one-by-one generation.
- Provide clear visibility/progress/reporting so admin can trust what is happening.

Secondary UX/admin goals:
- Fix approve/reject workflow issues.
- Add cancel-run and better status feedback.
- Add duplicate cleanup controls and safer delete behavior.
- Ensure `/quiz` uses the right approved question counts and LO filtering.

## 2) High-Level State
- Many requested features were implemented.
- Batch trial path works significantly better than before and can reach 50 accepted with diagnostics.
- Real run path has been reworked toward batch-first behavior but is still unstable in some cases.
- Latest critical issue: real run `validate` reported `parsed_count=0` across attempts and `created_count=0`.
- Additional fixes were applied after that report to avoid auto-failing all blueprints and to fall back to single-path generation.
- Run-level validate reporting UI was added (download + accepted/attempted lists), but it can still be empty when model batch calls fail/time out.
- Needs fresh re-test in new chat/session.

## 3) Key Implementations Completed

### 3.1 Admin questions page and run workflow
- LO auto-population from syllabus in `/admin/questions`.
- Clickable approve/reject actions and `Approve All Drafts`.
- Draft queue filtered to `status='draft'`.
- Run cancel support:
  - API: `POST /api/admin/questions/runs/[run_id]/cancel`
  - UI button: `Cancel Selected Run`.
- Run progress/elapsed display while starting runs.
- Added run safety note and progress indicators in UI.

### 3.2 Duplicate management
- Deterministic similarity engine in `src/lib/questions/similarity.ts`.
- Duplicate report API + resolve API.
- Duplicate cluster bulk actions in UI.
- Retire duplicates / retire entire cluster options.

### 3.3 Delete/retire safety and recovery
- Hard delete API and UI added.
- Problem found: draft questions could be deleted from run manager, removing approval queue.
- Fix applied:
  - Draft items are protected from delete/hard-delete in run manager.
  - Added restore endpoint for retired items:
    - `POST /api/admin/questions/[question_id]/restore`
  - Added `Retired Questions (This Run)` panel with `Restore to Draft`.

### 3.4 Batch trial system
- Trial API: `POST /api/admin/questions/trials/batch-quality`.
- Prompt builder and alignment gate integrated into trial.
- Trial supports `context_injections` lines.
- Trial report now includes:
  - parsed/accepted/valid/invalid
  - alignment pass/fail
  - near-dup metrics
  - attempt summary
  - accepted questions
  - attempted questions (full parsed set)
- Download button added:
  - `Download Full Trial Report (JSON)`.
- Batch trial progress bar added in UI.

### 3.4.1 Real Run Validate Report
- Added report presentation in `/admin/questions` Step Timeline for `validate`:
  - `Download Validate Report`
  - per-LO batch summary metrics
  - `Show Accepted Questions (...)`
  - `Show Attempted Questions (...)`
- Data source is `validate` step output:
  - `debug.batch_reports[]`
- When batch model calls fail/time out, this report can show:
  - `parsed_count: 0`
  - empty accepted/attempted arrays
  - attempt summaries with explicit model failure text

### 3.5 Alignment and prompt infrastructure
- Added alignment scorer:
  - `src/lib/questions/alignment.ts`
- Added reusable prompt builders:
  - `src/lib/questions/generation/promptBuilder.ts`
- Alignment gate wired into generation validation path.
- Adaptive alignment threshold changes added for broad ACs.

### 3.6 Real run quality pipeline improvements
- Real run validate path receives stricter gates (validation + alignment + near-dup).
- Malformed JSON recovery for LLM outputs.
- LLM timeout protections:
  - single generation timeout (~30s)
  - batch generation timeout (~45s currently after latest patch)
- Validate and run time budgets:
  - validate max duration set in orchestrator (`VALIDATE_MAX_DURATION_MS`).
  - run max duration increased from 240000ms to 720000ms while debugging.
- Debug output added to run steps:
  - step elapsed/run elapsed durations
  - batch validate stats.

### 3.7 Quiz page improvements (from earlier in thread)
- LO dropdown and LO descriptions on `/quiz`.
- Random selection and duplicate suppression improvements.
- Approved count query pagination fixes in bank repository.

## 4) Current Critical Issue (Last Known)
User provided validate output:
- `Status: completed`
- `created_count: 0`
- `failed_count: 50`
- `Batch groups: 1 | Batch LLM calls: 5`
- `batch report: parsed_count=0, accepted_count=0`

Meaning:
- Real run batch calls were returning no parseable questions (or parse extraction failed) during those attempts.
- No drafts created, therefore nothing to approve.

Post-report fixes applied:
1. Batch loop now respects a deadline (`deadlineMs`) so it cannot drift.
2. Batch request size reduced to avoid oversized unstable responses.
3. Batch model failures/timeouts are logged in attempt summary and break after repeated failures.
4. Most important: batch failures are no longer final-failed immediately; unresolved blueprints now fall through to single-item generation path for recovery.
5. Added visible run-level validate report UI + JSON download from Step Timeline.
6. Reduced batch prompt payload pressure (smaller anti-dup history), increased batch timeout, and lowered batch max output tokens for stability.

Needs verification with a new run.

## 5) What We Are Trying To Achieve (Explicit)
Target behavior for production run (`Create Run` + `Start Selected Run`):
- Use batch generation strategy comparable to Batch-50 trial.
- Produce close to requested count (default 50) with strict quality gates.
- Avoid semantic duplicates.
- Surface clear report/progress/debug so admins can trust outcomes.
- Never silently end with 0 drafts without intelligible reasons/recovery.

## 6) Latest File Areas Touched (Important)

Core generation:
- `src/lib/questions/generation/validateAndInsert.ts`
- `src/lib/questions/generation/orchestrator.ts`
- `src/lib/questions/generation/promptBuilder.ts`
- `src/lib/questions/alignment.ts`
- `src/lib/questions/similarity.ts`

Admin APIs:
- `src/app/api/admin/questions/trials/batch-quality/route.ts`
- `src/app/api/admin/questions/runs/[run_id]/cancel/route.ts`
- `src/app/api/admin/questions/[question_id]/delete/route.ts`
- `src/app/api/admin/questions/[question_id]/retire/route.ts`
- `src/app/api/admin/questions/[question_id]/restore/route.ts`
- `src/app/api/admin/questions/duplicates/route.ts`
- `src/app/api/admin/questions/duplicates/resolve/route.ts`

Admin UI:
- `src/app/admin/questions/page.tsx`

Docs updated previously:
- `reports/app_des/quiz.md`
- `reports/app_des/quiz.txt`
- `reports/app_des/app_des.md`
- `reports/improvements/answers6.md`

## 7) Immediate Next Steps for Next Chat (Priority Order)
1. Run one fresh real run (`target_count=50`, LO6 scope) and inspect `validate` step output.
2. Confirm whether post-fix fallback recovery now creates drafts when batch parse is zero.
3. Confirm run report UI shows populated `debug.batch_reports[0]` with attempted/accepted arrays when batch parsing succeeds.
4. If still `parsed_count=0` in real run batch:
   - capture raw model response length/preview in validate debug (safe truncated string) to diagnose parse vs model failure.
   - compare model config between trial and real run batch calls.
5. If parsed zero persists, temporarily force real run validate to call the exact same batch helper logic used in trial route to eliminate divergence.
6. Decide whether to keep single-item fallback (resilience) or fail-fast (strict transparency) when batch path is unavailable.

## 8) Default/UX Requirements Confirmed by User
- Default target question count should be 50.
- Batch trial should always produce a full report and downloadable data.
- Admin needs visible progress bar/status.
- Generation should not "loop" for 10+ minutes without clarity.

## 9) Known Constraints / Notes
- `vitest` intermittently fails in this environment due `spawn EPERM` (esbuild startup), but `tsc --noEmit` has been used successfully for compile checks.
- Repo has unrelated dirty files; do not reset/revert user changes.

## 10) Quick Operator Guidance
If admin says "no questions to approve":
- Check selected run id is current run.
- Check `validate.created_count` and `inserted_question_ids` in step output.
- If `created_count=0`, use:
  - `debug.batch_reports[]`
  - `Download Validate Report`
  - `failures[]`
  to diagnose parse zero vs gate rejections vs timeout/fallback exhaustion.
- If questions were retired accidentally, restore from `Retired Questions (This Run)` panel.

---
This handover is intended to continue directly from the end of this chat without re-discovery.
