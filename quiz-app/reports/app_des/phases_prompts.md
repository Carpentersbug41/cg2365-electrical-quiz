# Sequential Generation Phase Prompts - Current Contracts

Last verified: 2026-02-17
Status: Current implementation reference
Scope: Active prompt contracts in `src/lib/generation/phases`

Note (2026-02-17 sync):
- Module Planner behavior was updated to planner-only M0-M5 plus per-lesson generation controls.
- Phase prompt contracts in this document are unchanged.

---

## 1. Source of Truth

Prompt text source of truth:
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

Runtime orchestration truth:
- `src/lib/generation/SequentialLessonGenerator.ts`
- `src/lib/generation/phases/Phase9_Assembler.ts`
- `src/lib/generation/phases/Phase13_Rescore.ts`
- `src/lib/generation/config.ts`

---

## 2. Global Prompt Conventions

Shared base: `PhasePromptBuilder`

Cross-phase JSON requirements:
- valid JSON only
- no markdown wrappers
- no comments
- double-quoted keys
- no trailing commas

Cross-phase pedagogy direction:
- domain-agnostic language
- transferable technical pedagogy
- beginner clarity with teaching-before-testing

---

## 3. Phase Contracts (Summary)

### Phase 1 - Planning (`Phase1_Planning.ts`)

Core outputs:
- layout and diagram need
- explanation section planning
- worked-example requirement
- learning outcomes
- `taskMode` (single source of truth for downstream restrictions)
- syllabus anchor/scope metadata
- teaching constraints

### Phase 2 - Vocabulary (`Phase2_Vocabulary.ts`)

Core output:
- 4-6 terms with concise definitions

### Phase 3 - Explanation (`Phase3_Explanation.ts`)

Core outputs:
- explanation blocks
- optional diagram elements
- misconception targets

Notable constraints:
- fixed structured explanation style
- concrete anchors after formal concepts
- micro-scenarios for measurable/comparative concepts

### Phase 4 - Understanding Checks (`Phase4_UnderstandingChecks.ts`)

Core output:
- one conceptual check block per explanation
- 4 questions each (Q1-Q3 recall/short-text, Q4 connection/long-text)

### Phase 5 - Worked Example (`Phase5_WorkedExample.ts`)

Core output:
- `workedExample` + `guidedPractice`, or both null when not required

Notable constraints:
- mirrored step structure between worked and guided forms
- task-mode gating for wording and operation language

### Phase 6 - Practice (`Phase6_Practice.ts`)

Core output:
- independent practice block (order 8), 3-5 mixed questions

Notable constraints:
- includes transfer and early reasoning
- numeric expected answers must be numeric-only values

### Phase 7 - Integration (`Phase7_Integration.ts`)

Core output:
- integrative block at order 9.5
- exactly 2 long-text questions (connection + synthesis)

### Phase 8 - Spaced Review (`Phase8_SpacedReview.ts`)

Core output:
- spaced-review block at order 10
- exactly 3 short-text prerequisite questions

Runtime enforcement in generator:
- strict `questions.length === 3`
- one retry if wrong count
- deterministic fallback generator if still invalid

### Phase 9 - Assembler (`Phase9_Assembler.ts`)

Core behavior:
- assembles final lesson with fixed order contract
- requires key orders including `9.5` integrative and `10` spaced-review last
- projects planning metadata (`taskMode`, anchors/scope, constraints)

---

## 4. Phase 10-13 Refinement Contracts

### Active path

In `SequentialLessonGenerator`:
1. Phase 10 score
2. if below threshold (config default `95`), Phase 12 refine
3. Phase 13 rescore/compare
4. keep best lesson by policy

### Phase 10 (`Phase10_Score.ts`)

- LLM-backed rubric scoring
- requires structured output with `0-10` issues
- parser rejects `>10` issues

### Phase 12 (`Phase12_Refine.ts`)

- outputs complete refined lesson JSON
- validates structural invariants (ids/types/orders/answerTypes)

### Phase 13 (`Phase13_Rescore.ts`)

Acceptance policy:
- accept if total score improves
- also accept tie with fewer issues
- else keep original

`threshold` parameter is compatibility-only and not an acceptance gate.

---

## 5. Legacy Files Not On Active Runtime Path

Still present in repo:
- `Phase11_Suggest.ts`
- `Phase12_Implement.ts`

These are legacy patch-era modules and are not called by active runtime refinement orchestration.

---

## 6. Current Drift Notes

- Some logs/comments/config text still use patch-era language and fields like `patchesApplied`.
- Validation service currently still warns for 4 spaced-review questions in one path, while Phase 8 generation contract enforces 3.

Use runtime imports and call paths as architecture truth.

