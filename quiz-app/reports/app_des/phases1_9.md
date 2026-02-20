# Phases 1-9 Prompt System: Complete Explanation

## 1) What this is (high-level, no prior context required)

This app generates a full lesson by running a **9-phase pipeline**.  
Instead of one giant prompt, it uses smaller, specialized prompts in order:

1. Planning
2. Vocabulary
3. Explanation
4. Understanding Checks
5. Worked Example + Guided Practice
6. Practice Questions
7. Integration Questions
8. Foundation Check (Spaced Review)
9. Assembly

Each phase:
- gets structured input,
- builds a `systemPrompt` + `userPrompt`,
- calls the LLM,
- parses strict JSON,
- passes output to the next phase.

The orchestrator is `src/lib/generation/SequentialLessonGenerator.ts`.

Scope note:
- This document covers **generation phases 1-9 only**.
- Concurrency guards (duplicate-request lock), scoring/refinement (phases 10/12/13), and quality threshold gating are enforced outside this phase set (API route + post-assembly scoring pipeline).

---

## 2) How prompts are executed technically

All phase prompt classes extend `PhasePromptBuilder` (`src/lib/generation/phases/PhasePromptBuilder.ts`).

Shared behavior:
- `getPrompts(input)` returns:
  - `systemPrompt`
  - `userPrompt`
- every phase includes strict JSON rules:
  - valid RFC 8259 JSON only,
  - no markdown,
  - no comments,
  - double quotes,
  - no trailing commas,
  - return JSON only.

Parse pipeline (in `parseResponse` in `SequentialLessonGenerator.ts`):
1. `validateLLMResponse`
2. `cleanCodeBlocks`
3. `preprocessToValidJson`
4. `safeJsonParse`

If parsing fails, phase fails (except Phase 8, which has deterministic fallback behavior).

---

## 3) End-to-end flow with runtime limits

Runtime call pattern per phase uses:
`generateWithRetry(systemPrompt, userPrompt, 'phase', maxRetries, attemptHigherLimit, tokenLimit)`

Token limits and retries currently:
- Phase 1: retries=2, tokenLimit=4000
- Phase 2: retries=2, tokenLimit=3000
- Phase 3: retries=2, tokenLimit=8000
- Phase 4: retries=2, tokenLimit=6000
- Phase 5: retries=2, tokenLimit=6000
- Phase 6: retries=2, tokenLimit=5000
- Phase 7: retries=2, tokenLimit=5000
- Phase 8: retries=2, tokenLimit=4000
  - if wrong question count, explicit one-time retry with retries=1 and tokenLimit=5000

---

## 4) Phase-by-phase prompt details (exact behavior)

## Phase 1: Planning
Source: `src/lib/generation/phases/Phase1_Planning.ts`

### Purpose
Creates lesson structure and scope contract used by all later phases.

### System prompt (what it enforces)
- You are a lesson structure planner for City & Guilds technical/vocational courses.
- Domain-agnostic rule: no assumed trade/domain.
- Parse teaching constraints from `mustHaveTopics`:
  - `excludeHowTo`
  - `purposeOnly`
  - `identificationOnly`
  - `noCalculations`
  - `specificScope`
- Compute `taskMode` (single source of truth for downstream phases).
- Output syllabus scope anchoring:
  - `syllabusAnchors.unit`
  - `syllabusAnchors.learningOutcome`
  - `syllabusAnchors.coveredAC`
  - `syllabusAnchors.outOfScopeAC`
  - `scope.inScope/outOfScope/rationale`
- AC format required: `AC1`, `AC2`, etc. (disjoint covered vs out-of-scope).
- Strict JSON output only.

### User prompt (dynamic content injected)
Includes:
- lesson ID, topic, section, layout, prerequisites,
- `mustHaveTopics` if provided,
- whether worked example is likely needed.

Asks model to output exact JSON shape:
- layout,
- needsDiagram,
- explanationSections (1-2),
- needsWorkedExample,
- learningOutcomes (3-4),
- estimatedComplexity,
- taskMode,
- syllabusAnchors,
- scope,
- teachingConstraints.

### Runtime behavior
- Additional deterministic task-mode computation exists in code (`taskClassifier.ts`) and is used as fallback if model omits taskMode.
- If explanation sections missing/empty, code injects fallback section at order 4.

---

## Phase 2: Vocabulary
Source: `src/lib/generation/phases/Phase2_Vocabulary.ts`

### Purpose
Generate 4-6 essential terms required to understand the lesson.

### System prompt enforces
- 4-6 essential terms.
- one-sentence definitions.
- technically accurate but clear.
- include boundary clauses for confusable terms ("X is..., not ..." / "Different from ... because ...").
- domain-agnostic language.
- strict JSON only.

### User prompt injects
- lesson ID/topic/section,
- explanation section plan,
- learning outcomes.

Requires JSON:
- `{ "terms": [ { "term": "...", "definition": "..." } ] }`

### Runtime behavior
- Straight pass/fail parse; no custom fallback.

---

## Phase 3: Explanation
Source: `src/lib/generation/phases/Phase3_Explanation.ts`

### Purpose
Generate main teaching content block(s) and optional diagram metadata.

### System prompt enforces
- 400-600 words per explanation block.
- strict 9-part structure in fixed order:
  1. `### In this lesson`
  2. `**What this is**`
  3. `**Why it matters**`
  4. `**Key facts / rules**`
  5. mode-dependent heading
  6. `**Common mistakes**`
  7. `**Key Points**`
  8. `**Quick recap**`
  9. `### Coming Up Next`
- domain-agnostic rule.
- teaching principles: concrete-before-abstract, etc.
- must include concrete anchors after technical definitions.
- must include micro-scenario for measurable/quantitative concepts.
- must include contrast in common mistakes.
- must include 2-3 targeted misconceptions with AC tags in text and top-level JSON `misconceptions`.
- mode-dependent section 5 heading based on `TASK_MODE`:
  - PURPOSE_ONLY -> `**When to choose it**`
  - IDENTIFICATION -> `**How to recognise it**`
  - SELECTION/DIAGNOSIS -> `**How to apply it**`
  - CALCULATION -> `**How to calculate it**`
  - PROCEDURE -> `**How to do it**`
  - default -> `**How to use it**`
- if diagram needed: 3-5 `elementIds` in kebab-case.
- no invented standards/table values.

### User prompt injects
- lesson metadata,
- computed `TASK_MODE`,
- needsDiagram boolean,
- vocabulary terms,
- all learning outcomes,
- explanation section titles/orders,
- optional must-have/additional instructions.

Requires JSON:
- `explanations[]`
- `misconceptions[]`
- optional `diagramElements` when needed.

### Runtime behavior
- Fails phase if parse invalid.

---

## Phase 4: Understanding Checks
Source: `src/lib/generation/phases/Phase4_UnderstandingChecks.ts`

### Purpose
Generate formative check blocks immediately after each explanation.

### System prompt enforces
- anchor-fact method per explanation:
  - internally choose exactly 3 verbatim anchor facts.
  - Q1/Q2/Q3 = recall, one fact each.
  - Q4 = connection question linking all three.
- Q4 must include explicit reasoning stem (why/how do we know/etc).
- Q4 must begin with:
  - `Using your answers to Q1 (...), Q2 (...), and Q3 (...)...`
- no untaught terms.
- task-mode constraints:
  - PURPOSE_ONLY: no procedural question forms.
  - IDENTIFICATION: recognition/selection focus.
- answer rules:
  - `expectedAnswer` always array.
  - recall: exactly 2-4 strings.
  - connection: `answerType=long-text`, `keyPoints` (3-5), plus 2-3 example expected answers.

### User prompt injects
- full explanation content,
- task mode reminders,
- exact target output schema for check blocks.

### Runtime behavior
- one check block per explanation.
- expected order = explanation order + 0.5 (enforced by template and later assembly contract).

---

## Phase 5: Worked Example + Guided Practice
Source: `src/lib/generation/phases/Phase5_WorkedExample.ts`

### Purpose
Generate "I Do" + "We Do" scaffolding when needed.

### System prompt enforces
- generate both worked + guided when needed.
- if not needed and not purpose-only/identification: return nulls.
- mode behavior:
  - CALCULATION: formula/arithmetic steps.
  - PURPOSE_ONLY / IDENTIFICATION: selection/recognition, no operation steps.
  - SELECTION / DIAGNOSIS: decision criteria.
  - PROCEDURE: procedural allowed.
- no invented standards/table values.
- for PURPOSE_ONLY / IDENTIFICATION: **mandatory 4-step selection format**:
  1. identify context/constraints
  2. select option
  3. state purpose/result
  4. common wrong choice + why
- guided practice must mirror worked example exactly in step structure.
- guided `expectedAnswer` arrays only, 1-2 variants.

### User prompt injects
- topic,
- `needsWorkedExample` flag,
- explanation content as only knowledge source,
- task mode.

### Runtime behavior in orchestrator
- If not needed, skip phase and return undefined worked/guided.
- If parse fails but blueprint requires worked/guided, deterministic fallback blocks are generated in code.
- If output is partial and blueprint requires blocks, code fills missing blocks and aligns IDs/order to blueprint.

---

## Phase 6: Practice
Source: `src/lib/generation/phases/Phase6_Practice.ts`

### Purpose
Generate independent "You Do" questions.

### System prompt enforces
- 3-5 questions.
- if calculations taught: include numeric questions.
- include conceptual/application short-text questions.
- include at least one transfer scenario.
- include at least one early-reasoning question (why/how do we know/etc).
- task-mode constraints:
  - PURPOSE_ONLY: no operation procedure questions.
  - IDENTIFICATION: recognition/selection preferred.
- expectedAnswer always array.
- numeric answers = numbers only (units go in hint).
- short-text expectedAnswer = exactly 2-4 tight variants.

### User prompt injects
- full explanations,
- vocabulary,
- hasWorkedExample flag,
- task mode reminders.

### Runtime behavior
- parse fail => phase fail.

---

## Phase 7: Integration
Source: `src/lib/generation/phases/Phase7_Integration.ts`

### Purpose
Generate synthesis questions that connect the whole lesson.

### System prompt enforces
Two long-text questions only:
- INT-1 (Connection, L2)
  - links 2-3 concepts,
  - structured answer scaffold,
  - explicit reasoning demand.
- INT-2 (Synthesis, L3)
  - integrates major concepts,
  - structured scaffold,
  - must end exactly with:
    - `Answer in 3-4 sentences OR concise bullet points.`
- keyPoints and example expected answers required for both.

### User prompt injects
- learning outcomes,
- major concepts,
- explanation summaries,
- fixed output schema at order 9.5.

### Runtime behavior
- parse fail => phase fail.

---

## Phase 8: Spaced Review (Foundation Check)
Source: `src/lib/generation/phases/Phase8_SpacedReview.ts`

### Purpose
Generate prerequisite-check questions before current lesson starts.

### System prompt enforces
- **exactly 3 questions** (no more/no fewer).
- prerequisite knowledge only, not current lesson teaching.
- uses previous lesson titles if available.
- if anchors provided, must stay within anchors.
- all `answerType` fixed to `short-text`.
- each `expectedAnswer` = array of 2-4 strings.
- ban random out-of-context technical facts.
- field name must be `questionText`.

### User prompt injects
- current lesson ID/title/outcomes,
- previous lesson titles (up to 4) or fallback instruction,
- prerequisite anchors/foundation anchors if present,
- exact required JSON schema with SR-1/2/3.

### Runtime behavior (important)
- previous lesson titles are computed from `lessonIndex` (up to 4 prior lessons).
- if no learning outcomes from Phase 1 -> immediate deterministic fallback.
- after normal parse, strict post-validate:
  - must be exactly 3 questions,
  - each question must have valid `questionText` and `expectedAnswer[]`.
- if not exactly 3, one explicit retry is attempted.
- if retry still invalid, deterministic fallback is generated.
- if `answerType` not short-text, code force-corrects it.

Deterministic fallback output:
- always produces 3 generic prerequisite-review short-text questions,
- order 10, title `Foundation Check`.

---

## Phase 9: Assembler (no LLM prompt)
Source: `src/lib/generation/phases/Phase9_Assembler.ts`

### Purpose
Convert all prior phase outputs into final lesson JSON.

### Important: Phase 9 does NOT prompt the LLM
It is deterministic code-based assembly and validation.

### What it does
- creates blocks in strict contract order:
  - 1 outcomes
  - 2 vocab
  - 3 diagram (optional)
  - 4 explanation-1
  - 4.5 check-1
  - 5 explanation-2 (optional)
  - 5.5 check-2 (optional)
  - 6 worked-example (optional)
  - 7 guided-practice (optional)
  - 8 practice
  - 9.5 integrative
  - 10 spaced-review (must be last)
- normalizes diagram element IDs to kebab-case.
- validates:
  - unique orders,
  - strict increasing order,
  - required contract blocks present,
  - explanation/check pairing,
  - integrative at 9.5,
  - spaced-review last at 10.
- writes metadata including taskMode/scope/anchors/misconceptions when present.

---

## 5) How phase outputs depend on each other

- Phase 1 output controls scope + task mode for all downstream prompts.
- Phase 2 vocabulary is injected into Phase 3 explanations.
- Phase 3 explanations are the knowledge source for:
  - Phase 4 checks,
  - Phase 5 worked/guided,
  - Phase 6 practice,
  - Phase 7 integration.
- Phase 8 uses Phase 1 outcomes + prior lesson titles + optional prerequisite anchors.
- Phase 9 assembles everything and enforces ordering/contract rules.

So the pipeline enforces a pedagogical sequence:
**Plan -> Teach -> Check -> Scaffold -> Independent Practice -> Synthesis -> Prerequisite Reinforcement -> Assemble**

---

## 6) Where to find the exact prompt text in code

If you want literal prompt strings line-by-line, use:
- `src/lib/generation/phases/Phase1_Planning.ts`
- `src/lib/generation/phases/Phase2_Vocabulary.ts`
- `src/lib/generation/phases/Phase3_Explanation.ts`
- `src/lib/generation/phases/Phase4_UnderstandingChecks.ts`
- `src/lib/generation/phases/Phase5_WorkedExample.ts`
- `src/lib/generation/phases/Phase6_Practice.ts`
- `src/lib/generation/phases/Phase7_Integration.ts`
- `src/lib/generation/phases/Phase8_SpacedReview.ts`

Execution and fallbacks:
- `src/lib/generation/SequentialLessonGenerator.ts`

Task-mode classification logic:
- `src/lib/generation/taskClassifier.ts`
