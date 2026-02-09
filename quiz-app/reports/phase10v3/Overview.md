# Phase 10 v3 (Simple Flow) — Pedagogy-first, Structure-locked

## Goal
Improve an existing C&G 2365 lesson **pedagogically** (clarity, staging, question quality, marking robustness) while keeping the **JSON structure locked** and outputting a **full replacement JSON** you can paste in wholesale.

---

## Flow (end-to-end)

### 0) Inputs
- `lessonJson` (existing lesson JSON)
- `structureSignature` (syllabus-derived structure contract: block set/order/types/ids)
- `additionalInstructions?` (optional UI text, sanitized + length-capped)

---

### 1) Scorer LLM (read-only)
**Purpose:** Score the *current* lesson and list the top pedagogy/marking problems.

**Messages**
- `system`: Scorer System Prompt (short; pedagogy + marking only; explicitly: “ignore structure; validators handle it”)
- *(optional injection, only if additionalInstructions exists)*  
  - `user`: `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions}`  
  - `assistant`: Acknowledged.
- `user`: `SCORE THIS LESSON...\nLESSON JSON:\n${lessonJson}`

**Output**
- `score` (0–100) + `band`
- `top10Issues`: 10 concrete pedagogy/marking issues (each with where/what to change; no structure talk)

If `score >= threshold` → **Ship** (no rewrite).

Else → continue.

---

### 2) Refiner LLM (full JSON output)
**Purpose:** Produce a **full improved lesson JSON** (wholesale replacement), improving pedagogy/marking while preserving structure.

**Messages**
- `system`: Refiner System Prompt (short; “keep structure exactly; improve pedagogy; output full JSON only”)
- *(optional injection, only if additionalInstructions exists)*  
  - `user`: `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions}`  
  - `assistant`: Acknowledged.
- `user`:  
  `REFINE THIS LESSON...\n`  
  `SYLLABUS STRUCTURE (IMMUTABLE):\n${structureSignature}\n`  
  `SCORER REPORT:\n${scorerReport}\n`  
  `ORIGINAL JSON:\n${lessonJson}`

**Output**
- `candidateLessonJson` (full JSON, same structure)

---

### 3) Deterministic Validation (post-rewrite)
**Purpose:** Reject bad candidates fast, without LLM judgement.
Checks:
- Structure unchanged vs `structureSignature` (block ids/types/orders/count)
- No forbidden changes (e.g., `answerType` unchanged)
- No corruption/placeholders
- JSON parseable + required fields still present

If fail → **Reject candidate** (keep original; log validator errors).

---

### 4) Scorer LLM (again, same as step 1)
**Purpose:** Independent score of the candidate using the **same** scoring prompt.

**Messages**
- same scorer system prompt
- same optional `additionalInstructions` injection
- `user`: `SCORE THIS LESSON...\nLESSON JSON:\n${candidateLessonJson}`

**Decision**
- Accept if score improves and/or `score >= threshold`
- Else reject (or allow N attempts if you want)

---

## Injection Rules (System vs History)
- Keep **system prompts short + stable** (“law”).
- Put optional `additionalInstructions` as **separate user message** (“case law”), acknowledged by assistant.
- Never put huge templates/rubrics in the system prompt.

---

## Priority Order (guardrail)
1) Deterministic invariants + `structureSignature` always win  
2) Scoring rubric / pedagogy criteria  
3) `additionalInstructions` (only if compatible; sanitized)

---

## Deletion Task (before rollout)
- Remove Phase 10 v1 (patch) and v2 (rewrite) paths from live workflow
- Replace with this single v3 pipeline
