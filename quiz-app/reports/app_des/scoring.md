# Scoring Phases: Complete Explanation (High-Level + Low-Level + Prompts)

## 1) High-level overview

The app has a post-generation scoring/refinement pipeline that runs after phases 1-9 assemble a lesson.

Active runtime path in `src/lib/generation/SequentialLessonGenerator.ts`:
1. Phase 10: `Phase10_Score` (LLM pedagogical scoring)
2. Phase 12: `Phase12_Refine` (LLM full-lesson rewrite/refinement)
3. Phase 13: `Phase13_Rescore` (re-score candidate and accept/reject)

Request-level runtime guards in `src/app/api/lesson-generator/route.ts`:
- Per-lesson lock file prevents concurrent duplicate generation for the same lesson.
- If a lock exists, API returns `409` with `code: GENERATION_IN_PROGRESS`.
- After generation/refinement, API enforces quality gate before writing files.
- If final score is below threshold, API returns `422` with `code: QUALITY_THRESHOLD_FAIL` and refinement report metadata.

Legacy path still present in code but not used by current orchestrator:
- Phase 11: `Phase11_Suggest` (patch planning)
- Phase 12 (legacy): `Phase12_Implement` (apply patch ops)

So in practice today, the system uses a **score -> full rewrite -> rescore** loop, not patch planning/application.

---

## 2) Trigger and runtime behavior

Source: `src/lib/generation/SequentialLessonGenerator.ts`, `src/lib/generation/config.ts`

- Refinement config is read via `getRefinementConfig()`.
- Default `scoreThreshold` in config is `95`.
- After Phase 9 assembly (and normalization), the lesson is scored by Phase 10.
- If `initialScore.total < threshold`, refinement runs.
- If score meets threshold, refinement is skipped.

Important runtime details:
- Scoring phase uses `generateWithRetry(..., 'score', ..., tokenLimit=12000, modelOverride=phase10Model)`.
- Refinement phase uses `generateWithRetry(..., 'lesson', ..., tokenLimit=16000, modelOverride=phase12Model)`.
- Rescore calls Phase 10 again on candidate lesson.
- Final acceptance policy (Phase 13):
  - candidate must meet threshold, AND
  - candidate must have no domain regressions, AND
  - candidate must either improve total score OR keep score with fewer issues.
  - otherwise candidate is rejected and original is kept.

---

## 3) Data contracts

### Phase10 score object
Source: `src/lib/generation/phases/Phase10_Score.ts`

`Phase10Score` fields:
- `total` (0-100)
- `grade` (`Ship it | Strong | Usable | Needs rework`)
- `syllabus` context
- `breakdown`:
  - `beginnerClarity` /30
  - `teachingBeforeTesting` /25
  - `markingRobustness` /20
  - `alignmentToLO` /15
  - `questionQuality` /10
- `issues` (0-10 max)
- `overallAssessment`

`Phase10Issue` fields:
- `id`, `category`, `jsonPointers`, `excerpt`, `problem`, `whyItMatters`, optional `alignmentGap`

### Phase12 refine output
Source: `src/lib/generation/phases/Phase12_Refine.ts`

- returns full `refinedLesson` JSON
- validates structural invariants before success

### Phase13 decision output
Source: `src/lib/generation/phases/Phase13_Rescore.ts`

- `accepted`, `originalScore`, `candidateScore`, `improvement`, `finalLesson`, `reason`
- includes detailed score objects optionally

---

## 4) Active phases in detail

## Phase 10: Pedagogical Scoring (active)
Source: `src/lib/generation/phases/Phase10_Score.ts`

### What it does
1. Retrieves syllabus context via RAG (`retrieveSyllabusContext`).
2. Builds system + user prompts (syllabus-aware).
3. Calls LLM for scoring.
4. Parses and validates scoring JSON.

### Runtime constraints
- maxRetries: 2
- tokenLimit: 12000
- model: `getPhase10Model()`
  - `PHASE10_MODEL` if set,
  - else fallback to `GEMINI_MODEL`.

### Parse and validation
- cleans markdown code fences if present,
- preprocesses JSON,
- parses JSON,
- validates required fields,
- enforces `issues.length <= 10`.

### Phase 10 prompt (system template)

```text
You are an expert pedagogical quality assessor for City & Guilds technical and vocational lessons.

GOAL: Score this lesson's PEDAGOGICAL QUALITY anchored to syllabus outcomes and criteria.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Evaluate pedagogy using patterns that transfer across technical subjects.

UNIVERSAL PEDAGOGICAL STANDARDS:
- Concrete before abstract.
- Observable before symbolic.
- Concept before unit.
- Definition + concrete anchor + micro-scenario.
- Recall -> reasoning -> integration.
- Simplified but technically defensible language.

[SYLLABUS CONTEXT section is injected dynamically; includes unit, LO, ACs, and scoped AC note]

SCORING RUBRIC (100 points total):
A) Beginner Clarity (30 points)
B) Teaching-Before-Testing (25 points)
C) Marking Robustness (20 points)
D) Alignment to LO/AC (15 points)
E) Question Quality (10 points)

CRITICAL REQUIREMENTS:
- Return 0-10 issues (no more than 10), sorted by severity/impact.
- If syllabus exists, reference relevant AC where applicable.
- Cross-cutting issues use alignmentGap='GENERAL PEDAGOGY'.
- Use AC labels as AC1/AC2/AC3 indexed to listed criteria.
- Focus content quality (not schema structure).

OUTPUT FORMAT JSON:
{
  "total": 0-100,
  "grade": "Ship it|Strong|Usable|Needs rework",
  "syllabus": {...},
  "breakdown": {...},
  "issues": [/* 0-10 */],
  "overallAssessment": "2-3 sentence summary"
}

VALIDATION RULES:
- issues length <= 10
- total == sum of breakdown
- each issue has required fields
- overallAssessment 2-3 sentences max

[Shared JSON-only requirements appended from PhasePromptBuilder]
```

### Phase 10 prompt (user template)

```text
[Optional additional context from user]
ASSISTANT ACKNOWLEDGMENT: I will consider this context when scoring and identifying issues.

Score this lesson using the pedagogical rubric.

LESSON TO SCORE:
<full lesson JSON>

CRITICAL REMINDERS:
1. Return 0-10 issues (no more than 10).
2. Each issue must include: excerpt, problem, whyItMatters, alignmentGap
3. Ensure total score equals sum of breakdown scores
4. Focus on PEDAGOGICAL QUALITY - structure already validated
5. Reference specific Assessment Criteria when applicable
6. Use AC labels like AC1/AC2

Return ONLY the JSON scoring object.
```

---

## Phase 12: Full-Lesson Refinement (active)
Source: `src/lib/generation/phases/Phase12_Refine.ts`

### What it does
1. Receives original lesson + Phase10 score/issues + syllabus context.
2. Extracts immutable structure signature:
  - block count,
  - block IDs/types/orders,
  - question answerTypes.
3. Prompts LLM to return complete refined lesson JSON.
4. Validates structure unchanged.
5. Returns refined lesson if valid; otherwise fail and keep original.

### Runtime constraints
- maxRetries: 3
- tokenLimit: 16000
- model: `getPhase12Model()`
  - `PHASE12_MODEL` if set,
  - else `PHASE10_MODEL`,
  - else `GEMINI_MODEL`.

### Structural guardrails (hard)
- cannot change block count,
- cannot change block IDs,
- cannot change block types,
- cannot change block orders,
- cannot change question `answerType`.

### Phase 12 prompt (system template)

```text
You are a pedagogical refinement expert for City & Guilds technical and vocational lessons.

TASK: Output a COMPLETE refined lesson JSON that fixes the pedagogical issues below while preserving the exact structure.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Keep all refinements transferable across technical subjects.

UNIVERSAL PEDAGOGICAL STANDARDS TO ENFORCE:
- Concrete before abstract.
- Observable before symbolic.
- Concept before unit.
- Definition + concrete anchor + micro-scenario.
- Recall -> reasoning -> integration.
- Simplified but technically defensible wording.

[Injected syllabus section if available]

LOCKED STRUCTURE (IMMUTABLE - DO NOT CHANGE):
- Block count: N
- Block IDs/types/orders: [full list injected]
- answerType fields: [question id -> answerType list injected]

PEDAGOGICAL ISSUES TO FIX:
- baseline score + full breakdown + issue list injected

IMPROVEMENT-STAGE SCORE GUARDRAILS (NON-NEGOTIABLE):
- Do not regress any scoring domain.
- Preserve or raise every domain.
- Prioritize Beginner Clarity and Teaching-Before-Testing.

REFINEMENT RULES:
1. Output COMPLETE lesson JSON.
2. Fix pedagogical issues in content.
3. Improve clarity, examples, wording, expectedAnswer quality.
3a..3f include concrete anchors, micro-scenarios, early reasoning, teach-before-test.
4-8. Do not alter structural invariants.
9-10. Preserve/add scope/anchor/misconception metadata as appropriate.
11. Ensure no question tests untaught content.

PEDAGOGICAL PRIORITIES:
- beginner-friendly language
- teaching-before-testing
- keep/improve every rubric domain
- robust expectedAnswer arrays
- alignment to syllabus and declared scope

[Shared JSON-only requirements appended]

Return the COMPLETE refined lesson as valid JSON. Nothing else.
```

### Phase 12 prompt (user template)

```text
[Optional additional context from user]
ASSISTANT ACKNOWLEDGMENT: I will consider this context when refining the lesson.

ORIGINAL LESSON TO REFINE:
<full original lesson JSON>

IMPROVEMENT-STAGE NON-REGRESSION TARGETS:
- Baseline Beginner Clarity: x/30
- Baseline Teaching-Before-Testing: y/25
- Baseline Marking Robustness: z/20
- Baseline Alignment to LO: a/15
- Baseline Question Quality: b/10
- Do not lower any baseline domain score.
- Explicitly improve Beginner Clarity and Teaching-Before-Testing where possible.

Output the complete refined lesson JSON that fixes pedagogical issues while preserving structure and avoiding score regressions.
```

---

## Phase 13: Rescore and Compare (active)
Source: `src/lib/generation/phases/Phase13_Rescore.ts`

### What it does
- Calls Phase 10 scorer on candidate lesson.
- Compares candidate vs original score and breakdown.
- Tracks domain regressions and pedagogy regressions.
- Applies acceptance rule:
  - accept only if candidate meets threshold,
  - and has zero domain regressions,
  - and improved total score (or same score with fewer issues),
  - else reject candidate and keep original.

### Prompt behavior
- Phase 13 has no own prompt template.
- It reuses Phase 10 prompts via `Phase10_Score.scoreLesson(candidateLesson, ...)`.

### Decision logic details
- Improvement = `candidate.total - original.total`.
- Regressions are explicitly detected per domain.
- Regressions auto-reject candidate.

---

## 5) Legacy phases (present in code, not used by current orchestrator)

## Phase 11: Improvement Suggestions (legacy)
Source: `src/lib/generation/phases/Phase11_Suggest.ts`

### Purpose
Converts Phase10 issues into patch plans.

### Runtime
- LLM call with maxRetries=2, tokenLimit=12000.

### Output shape
- `fixablePlans[]` (with patch ops)
- `blockedIssues[]`
- `regenerationNeeded` boolean

### Patch ops
- `replaceSubstring`, `append`, `prepend`, `replace`
- path format: JSON Pointer

### Phase 11 prompt (system template summary)

```text
You are an expert lesson improver...
Goal: generate actionable fix patches.
Enforce Phase10 invariants (no block add/remove/reorder, no answerType changes).
Classify issues as:
- llm_editable
- blocked_by_policy
- requires_regeneration
Output JSON with fixablePlans, blockedIssues, regenerationNeeded.
```

### Phase 11 prompt (user template summary)

```text
Injects syllabus context, immutable block structure summary, and full issue list.
Asks model to return fix plan per issue or blocked/regeneration classification.
```

---

## Phase 12_Implement: Patch application (legacy)
Source: `src/lib/generation/phases/Phase12_Implement.ts`

### Purpose
Applies Phase11 patch operations deterministically (no LLM call).

### Steps
1. Deep-clone original lesson.
2. Apply each patch op by JSON Pointer path.
3. Validate candidate with `validateCandidate(...)`.
4. Return success/failure with patches applied/skipped.

### Validators used
Source: `src/lib/generation/phases/Phase10_Validators.ts`

- `validateStructuralInvariants`
- `validateBlockCompleteness`
- `detectCorruption`
- `validateSynthesisInstructions`

Combined via `validateCandidate(...)`.

---

## 6) Compatibility scorer service
Source: `src/lib/generation/llmScoringService.ts`

- This is a compatibility wrapper around Phase10 architecture.
- It does structural checks first.
- Then delegates pedagogical scoring to `Phase10_Score`.
- It still contains older prompt builder methods (`buildScoringSystemPrompt`, `buildScoringUserPrompt`) for legacy compatibility patterns.
- Current active scoring path in sequential generator uses `Phase10_Score` directly.

---

## 7) Model and config wiring

Source: `src/lib/config/geminiConfig.ts`

- `getPhase10Model()`:
  - `PHASE10_MODEL` -> else `GEMINI_MODEL`
- `getPhase12Model()`:
  - `PHASE12_MODEL` -> else `PHASE10_MODEL` -> else `GEMINI_MODEL`

Source: `src/lib/generation/config.ts`

- `refinement.enabled` default `true`
- `refinement.scoreThreshold` default `95`
- `scoring.temperature` default `0.0`
- `scoring.maxTokens` default `16000`

---

## 8) End-to-end control flow (active)

1. Lesson generated by phases 1-9.
2. Lesson normalized.
3. Phase 10 scores lesson.
4. If score < threshold:
  - Phase 12 generates full refined lesson,
  - Phase 12 validates structural invariants,
  - Phase 13 re-scores candidate,
  - keep candidate only if strict acceptance policy passes.
5. Build refinement report status in metadata (`pass_no_refinement`, `pass_after_refinement`, `fail_below_threshold`, `fail_regression`, `fail_refinement_error`).
6. API route enforces quality threshold before file write:
  - pass: continue write/integrate/commit
  - fail: return `422 QUALITY_THRESHOLD_FAIL` with report and no file write.
7. Return final lesson plus refinement metadata/report and debug bundle.

Admin visibility:
- `src/app/admin/module/page.tsx` reads persisted report fields from lesson payload and shows quality status/reason in the table and detail view.

This gives a constrained optimization loop:
- quality can improve,
- schema structure is preserved,
- final output is selected by measurable score comparison plus threshold/regression guardrails.

---

## 9) Where to inspect exact code

Active scoring/refinement:
- `src/lib/generation/phases/Phase10_Score.ts`
- `src/lib/generation/phases/Phase12_Refine.ts`
- `src/lib/generation/phases/Phase13_Rescore.ts`
- `src/lib/generation/SequentialLessonGenerator.ts`

Legacy patch pipeline:
- `src/lib/generation/phases/Phase11_Suggest.ts`
- `src/lib/generation/phases/Phase12_Implement.ts`
- `src/lib/generation/phases/Phase10_Validators.ts`

Config/model:
- `src/lib/generation/config.ts`
- `src/lib/config/geminiConfig.ts`

Compatibility wrapper:
- `src/lib/generation/llmScoringService.ts`

---

## 10) Additional prompt bodies (legacy + compatibility)

These are included so this doc contains prompt coverage for all scoring-related phases currently in the repo.

## Phase 11 prompt (system template, fuller excerpt)

```text
You are an expert lesson improver for City & Guilds technical and vocational training.

GOAL: Generate concrete, actionable fix patches for pedagogical issues identified in Phase 10 scoring.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Keep fixes transferable across technical subjects.

PEDAGOGICAL TIGHTENING PRIORITIES:
- Add concrete anchors after formal definitions when missing.
- Add micro-scenarios for quantity/unit/comparison concepts when missing.
- Raise early cognitive demand from recall to reasoning where missing.
- Tighten technical precision (simplify without distortion).
- Add/repair explicit syllabus anchors and in-scope/out-of-scope scope declarations when missing.
- Add/repair structured misconceptions targeting.

PHASE 10 INVARIANTS (CANNOT VIOLATE):
- Cannot add/remove/reorder blocks.
- Cannot change block.id/block.type/block.order.
- Cannot change answerType.
- Block count must stay identical.

ALLOWED OPERATIONS:
- Edit content in existing blocks/fields.
- Modify text fields and arrays inside existing blocks.

FIXABILITY CLASSIFICATION:
1) llm_editable
2) blocked_by_policy
3) requires_regeneration

PATCH OPS:
- replaceSubstring
- append
- prepend
- replace

OUTPUT JSON:
{
  "fixablePlans": [...],
  "blockedIssues": [...],
  "regenerationNeeded": false
}
```

## Phase 11 prompt (user template, fuller excerpt)

```text
CREATE FIX PLANS FOR THESE PEDAGOGICAL ISSUES.

[Optional syllabus context injected]

LESSON METADATA:
- ID
- Title
- Block Count (MUST NOT CHANGE)

BLOCK STRUCTURE (IMMUTABLE):
[index, type, id list]

PHASE 10 SCORING ISSUES:
[Issue-by-issue details including category, problem, paths, excerpt, alignment gap]

TASK:
For each issue:
1) create fix plan with patches if editable
2) mark blocked with policy conflict if not
3) mark regeneration-needed if fundamental restructuring required

Return ONLY JSON suggestions object.
```

## Compatibility scorer prompts (legacy wrapper)

Source: `src/lib/generation/llmScoringService.ts`

The wrapper still contains old internal prompt builders:
- `buildScoringSystemPrompt()`
- `buildScoringUserPrompt()`

Current sequential scoring path does not use those templates directly (it uses `Phase10_Score`), but they remain in code for backward compatibility.
