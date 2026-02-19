# Answers 6 - Admin Questions, Dedupe, Batch Trial Handover

As-of: 2026-02-18

## Direct answer to latest question
- Next step: implement an **alignment gate** so generated questions are rejected unless they semantically match the selected LO/AC syllabus content.
- Was the prompt specific enough? **No** for LO6 micro-renewables quality control. The batch of 50 was internally consistent but drifted into electrical testing/certification content, which indicates the prompt lacked strong LO-specific grounding and hard rejection criteria.

## What has already been implemented
- LO auto-population in `/admin/questions` from syllabus data.
- Run lifecycle improvements: queue/start/cancel, polling/progress, run cancel API.
- Draft review fixes: clickable approve/reject, approve-all, draft-only queue filtering.
- Run question management: per-question and bulk retire/hard-delete.
- Duplicate tooling:
  - similarity utility (`src/lib/questions/similarity.ts`)
  - generation-time duplicate checks
  - approval-time duplicate checks
  - duplicate report + resolve APIs
  - bulk cluster actions in UI
- Quiz improvements:
  - LO dropdown + LO descriptions
  - randomization/dedupe selection hardening
  - approved count pagination fix in repository queries
- Admin UI polish: hover/rollover effects for admin buttons.
- Batch quality trial feature:
  - API endpoint for 50-question trial evaluation (no DB writes)
  - UI panel to run trial and inspect metrics/questions

## Known user pain points still open
1. Batch trial confusion: user expected a run/questions in DB, but trial currently only reports metrics and preview output.
2. Semantic duplicates still leaking (same meaning, different wording), especially repeated "roof PV load-bearing" intent.
3. Need easier cleanup UX for selected runs/questions and clearer post-action refresh behavior in some views.

## Why duplicates still leak
- Current similarity checks are good for near-lexical overlap, but not strong enough for intent-level paraphrases.
- Answer-correlation alone is insufficient: many different questions can share a valid answer pattern.
- No final semantic intent clustering step before approval/use.

## Recommended next implementation (priority order)
1. **LO/AC Alignment Gate (highest impact)**
- Add `evaluateAlignment(question, selectedLo, selectedAc, syllabusContext)`.
- Score each candidate for:
  - topical match to LO/AC wording
  - required concept presence
  - off-topic drift penalty
- Reject candidates below threshold before insert/approval.

2. **Semantic Duplicate Gate (intent-level)**
- Add embedding or LLM-judge pass against:
  - existing approved questions for same qualification+LO
  - current generation batch
- Flag/auto-block when semantic similarity exceeds threshold even if text differs.
- Keep one representative and retire/block siblings.

3. **Generation strategy adjustment**
- Generate in batch (e.g., 50) with explicit diversity constraints by AC coverage.
- Enforce per-batch intent uniqueness before writing anything.
- Keep trial mode, but add an explicit CTA: `Promote trial set to draft run` (optional, user-confirmed).

4. **UI clarity updates**
- Label trial as "No DB writes" in large visible text.
- After approve/retire/hard-delete, refresh local state and remove rows immediately.
- In duplicate clusters, clarify buttons:
  - `Retire Duplicates (Keep Best 1)`
  - `Retire Entire Cluster`

## Proposed acceptance criteria for next LLM
- For selected LO/AC, >=95% of generated questions pass alignment gate.
- In a 50-question batch for one LO, semantic duplicate rate <=2%.
- No duplicate question appears twice in a single quiz session.
- Trial workflow clearly indicates whether questions are persisted.

## Concrete files likely to edit next
- `src/lib/questions/similarity.ts`
- `src/lib/questions/validateAndInsert.ts` (or equivalent insert pipeline)
- `src/app/api/admin/questions/trials/batch-quality/route.ts`
- `src/app/admin/questions/page.tsx`
- `src/lib/questions/*repo*.ts` (approved fetch for same LO/AC comparison)
- Any LLM prompt builder in `src/lib/questions/*prompt*`.

## Handover instructions for next LLM
1. Reproduce the LO6 trial mismatch and capture one failing sample set.
2. Implement alignment scoring first (do not tune duplicates first).
3. Add semantic duplicate pass against approved+batch sets.
4. Expose threshold metrics in trial report:
- alignment_fail_count
- semantic_duplicate_pairs
- off_topic_count
5. Add a user-visible toggle:
- `Strict mode (block low alignment / near-dup)` default ON.
6. Run focused tests for question generation/selection and duplicate APIs.
7. Update docs:
- `reports/app_des/quiz.md`
- `reports/app_des/quiz.txt`
- append outcome notes to this file.

## Suggested prompt tightening (minimum)
- Include only selected LO/AC syllabus snippets as primary context.
- Add explicit disallow list for adjacent topics not in selected AC.
- Require per-question rationale tag internally (`why_this_matches_ac`) for validation (not shown to end-user).
- Require uniqueness constraints across the full batch before final output.

## Quick status for user
- The pipeline is much stronger than before, but your latest 50-question set proves the prompt+gating is still too permissive on topical drift and intent duplicates.
- Next change should be alignment gate + semantic dedupe before persistence.
