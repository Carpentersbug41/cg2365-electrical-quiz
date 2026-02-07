# Complete Prompt Inventory: Grading & Phase 10 Refinement

**Date:** 2026-02-07  
**Purpose:** Document all prompts used in lesson scoring and Phase 10 refinement to review rubric/schema alignment and fix the "synthesis wants 3–4 sentences but answerType is short-text" problem.

---

## Executive Summary

The system uses **4 main prompts** during the scoring + Phase 10 flow:

1. **Scoring Prompt** (before Phase 10) - Initial lesson quality assessment
2. **Planner Prompt** (optional) - Classify issues by fixability
3. **Rewrite Prompt** (Phase 10 v2) - Holistic lesson refinement
4. **Scoring Prompt** (after Phase 10) - Re-score the candidate lesson

**Key Finding:** The scoring rubric expects synthesis questions to request "3-4 sentences" explicitly (Section D3), but Phase 10 policy **forbids changing answerType from short-text to long-text**. This creates a policy/rubric conflict.

---

## 1. SCORING PROMPTS (BEFORE & AFTER PHASE 10)

The **same prompts** are used both before and after Phase 10. The scoring service does not differentiate between pre/post scoring - it uses one unified prompt.

### 1.1 Scoring System Prompt

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`  
**Function:** `buildScoringSystemPrompt()` (line 218)  
**Model:** `process.env.GEMINI_MODEL` or `gemini-2.0-flash-exp` (from config)  
**Temperature:** `0.0` (deterministic, no variance)  
**Max Tokens:** `16000` (from config.ts, line 96)

**Verbatim System Prompt:**

```
You are an expert educational content reviewer for electrical trade training.

TASK
1) Score the lesson JSON on a 100-point rubric.
2) Identify the TOP 10 highest-impact learning quality issues.
3) For each issue, provide precise field-level patches.
4) Respect Phase 10 constraints (no add/remove/reorder blocks).

PHASE 10 CONSTRAINT (CRITICAL)
- Allowed operations:
  * SUBSTRING_REPLACE: Change text within a string field (use for small in-string edits)
  * PREPEND: Add text to beginning of field
  * APPEND: Add text to end of field
  * FULL_REPLACE: Replace entire field value (use sparingly for long fields)
- Not Allowed: 
  * Add blocks, remove blocks, reorder blocks, change block count
  * Change answerType (e.g., short-text → long-text) - breaks grading contract
  * Change block.order or block.type
- If an issue requires structural changes or answerType changes, mark fixability as "requiresRegeneration"

SUGGESTION FORMAT (CRITICAL):
For string field edits within long content (e.g., explanation blocks), use SUBSTRING_REPLACE format:
"SUBSTRING_REPLACE in blocks[3].content.content: find 'old text' replace with 'new text'"

For adding content:
"PREPEND to blocks[3].content.content: 'text to add at start'"
"APPEND to blocks[3].content.content: 'text to add at end'"

For complete field replacement (only when necessary):
"FULL_REPLACE blocks[4].content.questions[2].expectedAnswer with: ['variant1', 'variant2']"

⚠️ NEVER write: "Change blocks[3].content.content from 'X' to 'Y'" (ambiguous - leads to content destruction!)
✓ ALWAYS write: "SUBSTRING_REPLACE in blocks[3].content.content: find 'X' replace with 'Y'"

⚠️ NEVER suggest changing answerType (e.g., short-text → long-text)
✓ INSTEAD: For questions needing longer answers:
  - Add instructions to questionText: "Answer in 2-4 sentences..."
  - Tighten expectedAnswer to be more specific
  - Mark as "requiresRegeneration" if fundamental restructuring needed

SCORING RUBRIC (100 points total):

A) Schema & Contract Compliance (15 points)
   - Valid JSON, required fields present, no duplicate IDs
   - Relative ordering correct: checks after explanations; worked before guided; guided before independent; integrative near end; spaced review last
   - NOTE: Schema issues like IDs and field types are pre-normalized before scoring, so only flag if critically broken

B) Beginner Clarity & Staging (30 points)
   B1: Beginner Orientation (10 points)
       - Has "In this lesson" preview section explaining what students will learn
       - Has "Key Points" summary section with bullet list of main takeaways
       - Has "Coming Up Next" transition connecting to next lesson
   B2: Teaching-Before-Testing (10 points)
       - Content appears in explanation before questions assess it
       - No questions about terms/concepts not yet explicitly taught
       - Understanding checks placed immediately after relevant explanations
   B3: Scaffolding (10 points)
       - Difficulty ramps smoothly from simple to complex
       - Concepts build logically on each other
       - No sudden jumps in complexity

C) Worked/Guided/Independent Alignment (15 points)
   - Guided practice mirrors worked example steps exactly (same decision points, same process flow)
   - Independent practice matches what was modelled in worked/guided sections (no new task types suddenly introduced)
   - If no worked example exists, score full points

D) Questions & Cognitive Structure (25 points)
   D1: Scope + Technical Accuracy (10 points)
       - Questions match lesson scope and learning outcomes
       - Technically correct information throughout
       - Appropriate difficulty level for target audience
   D2: Question Quality (10 points)
       - Clear, unambiguous wording
       - Avoids unjustified absolutes ("always", "never" - prefer "typically", "often", "usually")
       - Uses appropriate question verbs for task type
   D3: Integrative Block Structure (5 points)
       - If integrative block exists, it contains exactly 2 questions
       - Question 1: connection question (ties together 2-3 major concepts)
       - Question 2: synthesis question (integrates all lesson concepts; student may answer in 3-4 sentences OR concise bullet points; grade on inclusion of key concepts, not exact phrasing)
       - NOTE: Synthesis questions using short-text answerType with "Answer in 3-4 sentences OR concise bullet points" instruction are valid—do NOT flag as friction

E) Marking Robustness (10 points)
   - expectedAnswer is gradeable and matches answerType
   - For numeric answers: expectedAnswer contains numbers only (no units - units go in hint)
   - For short-text: provides 2-6 acceptable variations (or 4-8 key points/phrases for synthesis questions)
   - EXCEPTION: For synthesis questions (cognitiveLevel: "synthesis"), short-text with instruction "Answer in 3-4 sentences OR concise bullet points" is VALID and should NOT be flagged as friction or incompatibility. Grade these questions on concept inclusion via key-points checklist.

F) Visual/Diagram Alignment (5 points)
   - Diagrams referenced appropriately in explanations and questions
   - No missing or broken diagram references

PRIORITIZATION RULES (CRITICAL)
- Maximum 10 issues total
- Focus on learning quality issues (sections B, C, D) - these drive student success
- Schema/mechanical issues (A, E) are pre-normalized - only flag if critically broken
- Impact ranking: Beginner Clarity (B) > Alignment (C) > Questions (D) > Marking (E) > Schema (A)
- If there are many similar mechanical issues (e.g., 20 IDs missing prefix), group them into ONE issue with note: "Deterministic fix - recommend code pre-pass"

OUTPUT FORMAT (JSON ONLY, no markdown)

Return JSON in this EXACT format:

{
  "total": 91,
  "breakdown": {
    "schemaCompliance": 14,
    "beginnerClarityStaging": 24,
    "alignment": 12,
    "questions": 22,
    "markingRobustness": 9,
    "visual": 5
  },
  "issues": [
    {
      "id": "ISSUE-1",
      "impact": 3,
      "category": "beginnerClarityStaging",
      "problem": "Explanation block at blocks[3] missing required 'Key Points' summary section with bullet list. Students need explicit takeaways for retention.",
      "fixability": "phase10",
      "jsonPointers": ["/blocks/3/content/content"],
      "patches": [
        {
          "op": "append",
          "path": "/blocks/3/content/content",
          "value": "\\n\\n### Key Points\\n- [Point one extracted from explanation]\\n- [Point two extracted from explanation]\\n- [Point three extracted from explanation]"
        }
      ]
    },
    {
      "id": "ISSUE-2",
      "impact": 2,
      "category": "beginnerClarityStaging",
      "problem": "Check block at blocks[4] asks about 'residual current' but explanation at blocks[3] never explicitly defines this term. Violates teaching-before-testing.",
      "fixability": "phase10",
      "jsonPointers": ["/blocks/3/content/content", "/blocks/4/content/questions"],
      "patches": [
        {
          "op": "prepend",
          "path": "/blocks/3/content/content",
          "value": "### In this lesson\\n\\nYou will learn about residual current and how it affects circuit protection.\\n\\n"
        }
      ]
    },
    {
      "id": "ISSUE-3",
      "impact": 2,
      "category": "alignment",
      "problem": "Guided practice at blocks[7] uses different steps than worked example at blocks[6]. Should mirror exactly for effective scaffolding.",
      "fixability": "requiresRegeneration",
      "jsonPointers": ["/blocks/6", "/blocks/7"],
      "patches": []
    }
  ],
  "grade": "Strong"
}

PATCH OPERATION TYPES:

"replaceSubstring" - Replace text WITHIN a string field (PREFERRED for explanation edits)
  Required fields: "op", "path", "find", "value"
  Use when: Fixing terminology, correcting phrases, updating specific text
  Example: {"op": "replaceSubstring", "path": "/blocks/3/content/content", "find": "looping and linear wiring", "value": "ring final and radial topologies"}

"replace" - Replace ENTIRE field value (use sparingly for long fields)
  Required fields: "op", "path", "from", "value"
  Use when: Changing short fields entirely (IDs, titles, expectedAnswer arrays)
  Example: {"op": "replace", "path": "/blocks/4/content/title", "from": "Old Title", "value": "New Title"}

"append" - Add text to END of existing string field
  Required fields: "op", "path", "value"
  Example: {"op": "append", "path": "/blocks/3/content/content", "value": "\\n\\n### Key Points\\n- Point one"}

"prepend" - Add text to BEGINNING of existing string field
  Required fields: "op", "path", "value"
  Example: {"op": "prepend", "path": "/blocks/3/content/content", "value": "### In this lesson\\n\\nOverview text\\n\\n"}

VALIDATION RULES:
- Total MUST equal sum of breakdown scores (CRITICAL - previous example had math error!)
- All paths must use JSON Pointer format (/blocks/3/content/title)
- Each issue must include a "jsonPointers" array listing all affected JSON Pointer paths
- Each issue must have at least one patch (unless fixability is "requiresRegeneration")
- Maximum 10 issues total
- Focus issues on learning quality (B, C, D sections), not mechanical schema fixes (A, E sections)

GRADE SCALE:
- 95-100: "Ship it" (excellent, production-ready)
- 90-94: "Strong" (good quality, minor improvements needed)
- 85-89: "Usable" (acceptable quality, some issues to address)
- Below 85: "Needs rework" (significant problems require attention)
```

---

### 1.2 Scoring User Prompt

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`  
**Function:** `buildScoringUserPrompt(lesson)` (line 411)

**Verbatim User Prompt:**

```
Score this electrical trade lesson using the rubric.

LESSON TO SCORE:
${lessonJson}

CRITICAL REMINDERS:
1. Focus on TOP 10 learning quality issues (sections B, C, D) - schema issues (A, E) are pre-normalized
2. Use structured patch format with JSON Pointer paths (e.g., "/blocks/3/content/content")
3. Ensure total score equals sum of breakdown scores (avoid math errors!)
4. Each patch must specify "op" (replace/append/prepend), "path", and "value"
5. Mark structural issues as "requiresRegeneration" with empty patches array

Return ONLY the JSON scoring object following the exact format specified above. No markdown, no additional text.
```

**Runtime Assembly:**
- `lessonJson` = `JSON.stringify(lesson, null, 2)` (full lesson JSON with 2-space indentation)
- No additional templates injected
- Called via `generateWithRetry()` with:
  - type: `'score'`
  - maxRetries: `2`
  - tokenLimit: `16000`

---

### 1.3 Scoring Response Parsing

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`  
**Function:** `parseScoringResponse()` (line 433)

**Post-processing:**
1. Remove markdown code blocks (```json)
2. Preprocess to valid JSON (remove trailing commas, comments)
3. Parse with `JSON.parse()`
4. Convert new format (issues/patches) to legacy format (details/suggestions) for backward compatibility
5. Map new breakdown field names to legacy names:
   - `beginnerClarityStaging` → `pedagogy`
   - `markingRobustness` → `marking`

---

## 2. PHASE 10 PLANNER PROMPT (OPTIONAL)

The planner stage is **optional** (enabled by default in config). It generates an explicit fix plan that classifies issues by fixability before the rewrite stage.

### 2.1 Planner System Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Planner.ts`  
**Function:** `buildSystemPrompt()` (line 139)  
**Model:** `process.env.GEMINI_MODEL` or `gemini-2.0-flash-exp`  
**Temperature:** Not explicitly set (defaults to 0)  
**Max Tokens:** `8000` (hardcoded in generatePlan at line 62)

**Verbatim System Prompt:**

```
You are an expert lesson JSON fix planner.

Your task is to analyze scoring issues and create an explicit fix plan that classifies each issue by fixability and provides structured instructions.

PHASE 10 INVARIANTS (CRITICAL):
- Cannot add blocks
- Cannot remove blocks
- Cannot reorder blocks
- Cannot change block.id, block.type, or block.order
- Cannot change lesson.id, lesson.unit, lesson.topic, or lesson.layout
- Block count must remain EXACTLY the same

ALLOWED OPERATIONS:
- Edit content within existing blocks
- Modify text fields (content, questionText, title, description, etc.)
- Update expectedAnswer arrays
- Modify hints
- Change Bloom levels
- Update learning outcomes

FIXABILITY CLASSIFICATIONS:

1. "deterministic" - Mechanical fixes that follow a clear rule:
   - Add missing "Coming Up Next" text
   - Standardize formatting
   - Fix consistent terminology issues

2. "llm_editable" - Content improvements requiring judgment:
   - Improve clarity of explanations
   - Enhance question wording
   - Add context or examples
   - Improve hint quality

3. "blocked_by_policy" - Conflicts with Phase 10 constraints:
   - Issue requires answerType change (answerType changes are STRICTLY FORBIDDEN)
   - Issue requires structural changes (add/remove/reorder blocks)
   - Note the specific policy conflict

4. "requires_regeneration" - Needs structural changes:
   - Issue requires adding/removing blocks
   - Needs reordering blocks
   - Requires changing block types
   - Fundamental restructuring of content

OUTPUT FORMAT:

Return ONLY valid JSON with this structure:

{
  "plan": [
    {
      "issueId": "B1.orientation.preview",
      "rubricRef": "B1",
      "fixability": "llm_editable",
      "targets": ["/blocks/3/content/content"],
      "instructions": "Add 'In this lesson' preview section at start of explanation. Should describe what students will learn in 2-3 sentences.",
      "guardrails": ["do not change block id or type", "preserve existing content"],
      "textSnippets": ["### In this lesson\\n\\nYou will learn about..."]
    },
    {
      "issueId": "B1.orientation.comingUpNext",
      "rubricRef": "B1",
      "fixability": "deterministic",
      "targets": ["/blocks/9/content/notes"],
      "instructions": "Append 'Coming Up Next: [Next Lesson Topic]' to notes field.",
      "textSnippets": [" Coming Up Next: Circuit Protection and Overcurrent Devices."]
    },
    {
      "issueId": "D3.integrative.synthesis.format",
      "rubricRef": "D3",
      "fixability": "llm_editable",
      "targets": ["/blocks/8/content/questions/1/questionText", "/blocks/8/content/questions/1/expectedAnswer"],
      "instructions": "Add 'Answer in 3-4 sentences' to questionText; set expectedAnswer to key-points checklist (4-8 phrases covering main concepts to look for in student answer)."
    }
  ]
}

RULES:
- One plan item per scoring issue
- Use JSON Pointer format for targets (e.g., "/blocks/3/content/content")
- Be specific in instructions - explain WHAT to add/change and WHERE
- For blocked issues, clearly state the policy conflict
- Include guardrails for safety (e.g., "preserve existing content", "do not change IDs")
- Optional textSnippets for deterministic fixes


OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

---

### 2.2 Planner User Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Planner.ts`  
**Function:** `buildUserPrompt(input)` (line 231)

**Verbatim User Prompt:**

```
CREATE A FIX PLAN FOR THIS LESSON.

LESSON METADATA:
- ID: ${originalLesson.id}
- Unit: ${originalLesson.unit}
- Topic: ${originalLesson.topic}
- Layout: ${originalLesson.layout}
- Block Count: ${blockCount} (MUST NOT CHANGE)

BLOCK STRUCTURE (IMMUTABLE):
${blockTypes}

SCORING ISSUES:
${issuesText}

TASK:
For each scoring issue above, create a fix plan item that:
1. Classifies fixability (deterministic / llm_editable / blocked_by_policy / requires_regeneration)
2. Lists target JSON Pointer paths
3. Provides clear, specific instructions
4. Notes any guardrails or safety constraints
5. For blocked issues, explains the policy conflict

Remember:
- Phase 10 CANNOT add/remove/reorder blocks
- Phase 10 CANNOT change answerType (especially short-text → long-text)
- Phase 10 CAN edit content within blocks
- Be explicit about what's fixable vs. what's blocked

Return ONLY the JSON plan object. No markdown, no additional text.
```

**Runtime Assembly:**
- `originalLesson.id/unit/topic/layout` = lesson metadata
- `blockCount` = `originalLesson.blocks.length`
- `blockTypes` = formatted list of blocks: `"  0: outcomes (id: 203-3A1-outcomes)\n  1: vocab (id: 203-3A1-vocab)..."`
- `issuesText` = formatted scoring issues from `formatScoringIssues()`:
  ```
  Total Score: 85/100 (Usable)
  
  ISSUE 1: beginnerClarityStaging: Explanation block at blocks[3] missing...
    Max Impact: 3 points
    Problem: [issue description]
    Suggestions:
      - [suggestion 1]
      - [suggestion 2]
    Affected Paths: /blocks/3/content/content
  
  ISSUE 2: ...
  ```

---

## 3. PHASE 10 REWRITE PROMPT (v2 HOLISTIC REWRITE)

Phase 10 v2 uses a holistic rewrite approach where the LLM outputs the full improved lesson JSON in one shot.

### 3.1 Rewrite System Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts`  
**Function:** `buildSystemPrompt()` (line 290)  
**Model:** `process.env.GEMINI_MODEL` or `gemini-2.0-flash-exp`  
**Temperature:** Not explicitly set (defaults to 0)  
**Max Tokens:** `24000` (hardcoded in rewriteLesson at line 96)

**Verbatim System Prompt:**

```
You are an expert lesson JSON refiner.

You will be given:
1) The ORIGINAL lesson JSON (valid).
2) A scoring report listing issues and suggested improvements.

Your job:
Return a NEW lesson JSON that fixes the issues while preserving the lesson's structure.

STRICT RULES (HARD):
- Output ONLY valid JSON. No commentary. No markdown. No code fences.
- Do NOT change: lesson.id, lesson.unit, lesson.topic, lesson.layout.
- Do NOT reorder blocks.
- Do NOT add blocks.
- Do NOT remove blocks.
- Do NOT change any block.id values.
- Do NOT change any block.type values.
- Do NOT change any block.order values.
- Keep blocks array length EXACTLY the same.
- Only edit fields inside existing blocks to improve clarity, correctness, marking robustness, and alignment.

CONTENT RULES:
- Fix the issues described in the scoring report as priority.
- Do not introduce "[object Object]" or placeholder text.
- If the scoring report contains malformed suggestions (e.g. '[object Object]'), ignore those suggestions and instead implement the intended fix safely.

ANSWER TYPE RULES (CRITICAL):
- VALID answerTypes: "short-text", "multiple-choice", "calculation", "true-false"
- NEVER use: "numeric", "long-text", "essay", "open-ended", or any other type
- DO NOT change answerType anywhere. This is a hard constraint.
- For synthesis questions (cognitiveLevel: "synthesis"): questionText MUST end with EXACTLY this instruction: "Answer in 3-4 sentences OR concise bullet points." AND expectedAnswer MUST be a checklist of 4-8 key concepts/phrases to grade against (not full sentence variants). Do not use any other numbers or phrasing variants.

SYNTHESIS QUESTION REQUIREMENTS:
- questionText ends with: "Answer in 3-4 sentences OR concise bullet points."
- expectedAnswer format: ["key concept 1", "key concept 2", "key concept 3", "key concept 4", ...]
- Example expectedAnswer: ["fault isolation and continuity", "cable economy", "load sharing across paths", "safety of movement during faults"]
- Do NOT use full sentence variants for synthesis questions

CONNECTION QUESTION REQUIREMENTS (D3 Question 1):
- For mapping questions (e.g., "which circuit type for X and Y"), expectedAnswer must use explicit mappings
- BAD: ["radial and ring", "ring and radial"]
- GOOD: ["lighting: radial; sockets: ring", "radial for lighting, ring final for sockets"]
- Prevents false positives from reversed answers

OUTPUT FORMAT:
Return the full lesson JSON object.


OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

---

### 3.2 Rewrite User Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts`  
**Function:** `buildUserPrompt(input)` (line 330)

**Verbatim User Prompt (without fix plan):**

```
REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
${JSON.stringify(originalLesson, null, 2)}

SCORING REPORT (issues + suggestions):
${scoringReport}

TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

**Verbatim User Prompt (with fix plan):**

```
REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
${JSON.stringify(originalLesson, null, 2)}

SCORING REPORT (issues + suggestions):
${scoringReport}

FIX PLAN (implement every non-blocked item):
${JSON.stringify(fixPlan, null, 2)}

IMPLEMENTATION PRIORITY:
- Implement ALL items marked as "deterministic" or "llm_editable"
- DO NOT attempt items marked as "blocked_by_policy" or "requires_regeneration"
- Follow the specific instructions and guardrails for each plan item
- Use the suggested textSnippets where provided

TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

**Runtime Assembly:**
- `originalLesson` = `JSON.stringify(originalLesson, null, 2)` (full lesson JSON)
- `scoringReport` = formatted scoring report from `formatScoringReport()`:
  ```
  Total Score: 85/100 (Usable)
  
  Issues by Section:
  
  ## beginnerClarityStaging: Explanation block at blocks[3] missing... (24/30)
  - Issue: Explanation block at blocks[3] missing required 'Key Points' summary section...
    Suggestion: Append to blocks[3].content.content: '### Key Points\n- Point one'
  
  ## alignment: Guided practice at blocks[7] uses different steps... (12/15)
  - Issue: Guided practice at blocks[7] uses different steps than worked example...
    Suggestion: Cannot be fixed by Phase 10 - requires regeneration
  ```
- `fixPlan` (optional) = `JSON.stringify(fixPlan, null, 2)` (structured plan with fixability classifications)

---

## 4. VALIDATION PROMPTS (NONE)

There are **no LLM prompts** for validation, structure checks, or corruption detection. All validation is **deterministic code** in `Phase10_Validators.ts`:

- **Structural Invariants:** Checks block count, IDs, types, orders match exactly (lines 35-100)
- **Block Completeness:** Validates required fields exist for each block type (lines 106-292)
- **Corruption Detection:** Pattern matching for `[object Object]`, invalid answerTypes, placeholders (lines 297-360)

No LLM calls involved in validation.

---

## 5. CONTEXT ASSEMBLY & MODEL DETAILS

### 5.1 Scoring Context

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`

**Function:** `scoreLessonWithLLM()` (line 194)

**Model Configuration:**
- **Model:** `process.env.GEMINI_MODEL` (default: `gemini-2.0-flash-exp`)
- **Temperature:** `0.0` (deterministic, no variance)
- **Max Tokens:** `16000`
- **Type:** `'score'` (for proper truncation detection)
- **Max Retries:** `2`

**Runtime Inputs:**
1. System prompt (verbatim from section 1.1)
2. User prompt with full lesson JSON (verbatim from section 1.2)
3. No additional context or templates

**Called via:**
```typescript
await this.generateWithRetry(
  systemPrompt,
  userPrompt,
  'score',
  2,
  false,
  16000
);
```

---

### 5.2 Planner Context

**File:** `quiz-app/src/lib/generation/phases/Phase10_Planner.ts`

**Function:** `generatePlan()` (line 40)

**Model Configuration:**
- **Model:** `process.env.GEMINI_MODEL` (default: `gemini-2.0-flash-exp`)
- **Temperature:** Not explicitly set (defaults to 0)
- **Max Tokens:** `8000`
- **Type:** `'phase'`
- **Max Retries:** `2`

**Runtime Inputs:**
1. System prompt (verbatim from section 2.1)
2. User prompt with lesson metadata, block structure, scoring issues (verbatim from section 2.2)
3. Optional fix plan from planner stage

**Called via:**
```typescript
await generateFn(
  systemPrompt,
  userPrompt,
  'phase',
  2,
  false,
  8000
);
```

---

### 5.3 Rewrite Context

**File:** `quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts`

**Function:** `rewriteLesson()` (line 48)

**Model Configuration:**
- **Model:** `process.env.GEMINI_MODEL` (default: `gemini-2.0-flash-exp`)
- **Temperature:** Not explicitly set (defaults to 0)
- **Max Tokens:** `24000` (increased for full lesson JSON output)
- **Type:** `'phase'`
- **Max Retries:** `2`

**Runtime Inputs:**
1. System prompt (verbatim from section 3.1)
2. User prompt with original lesson JSON, scoring report, optional fix plan (verbatim from section 3.2)
3. No additional templates

**Called via:**
```typescript
await generateFn(
  systemPrompt,
  userPrompt,
  'phase',
  2,
  false,
  24000
);
```

---

## 6. THE D3 SYNTHESIS PROBLEM

### 6.1 Problem Statement (RESOLVED)

**Previous Issue:**

Rubric Section D3 (Integrative Block Structure) expected:

> "Question 2: synthesis question (integrates all lesson concepts in **3-4 sentences**)"

Phase 10 Policy explicitly forbade:

> "⚠️ NEVER suggest changing answerType (e.g., short-text → long-text)"

Planner Prompt classified this as:

> "blocked_by_policy" - Issue requires answerType change (e.g., short-text → long-text is FORBIDDEN)

**Result:** Synthesis questions were marked as `blocked_by_policy` and never fixed by Phase 10.

**Solution Implemented (2026-02-07):**

The rubric has been updated to accept short-text answerType for synthesis questions. D3 now reads:

> "Question 2: synthesis question (integrates all lesson concepts; student may answer in 3-4 sentences OR concise bullet points; grade on inclusion of key concepts, not exact phrasing)"

This aligns the rubric with Phase 10 constraints while maintaining pedagogical goals.

---

### 6.2 Implementation Approach

**Updated Scoring Prompt:**

The scoring prompt now explicitly allows short-text answerType for synthesis questions with key-points grading:

> "For short-text: provides 2-6 acceptable variations (or 4-8 key points/phrases for synthesis questions)"

**Approach:**
- Add instructions to questionText: "Answer in 3-4 sentences..."
- Set expectedAnswer to a checklist of key concepts (4-8 phrases)
- Grade on concept inclusion, not exact phrasing
- Keep answerType as "short-text" (no changes needed)

This approach maintains the pedagogical goal (comprehensive synthesis) while working within Phase 10 constraints.

---

## 7. PROMPT FILE LOCATIONS IN RUN ARTIFACTS

When Phase 10 debug artifacts are enabled, prompts are saved to:

**Base Path:** `quiz-app/reports/phase10_runs/<runId>/`

**Run ID Format:** `{lessonId}__{timestamp}__{strategy}__{model}`  
**Example:** `203-3A1__2026-02-07T10-32-18-123Z__rewrite__gemini-2.0-flash-exp`

**Files Generated:**

| File | Purpose | Contains |
|------|---------|----------|
| `00_input_lesson.json` | Original lesson before Phase 10 | Full lesson JSON |
| `01_score_before.json` | Initial scoring result | Score breakdown + issues |
| `02_prompt_rewrite.json` | Rewrite prompt | System + user prompt + metadata |
| `03_output_rewrite.txt` | LLM raw response | Raw JSON output from rewrite |
| `04_prompt_plan.json` | Planner prompt (optional) | System + user prompt + metadata |
| `05_prompt_score_before.json` | Before scoring prompt | System + user prompt + metadata |
| `06_candidate_lesson.json` | Rewritten lesson | Full candidate JSON |
| `07_validation_result.json` | Validation details | Validator results per category |
| `08_score_after.json` | After-scoring result | Score breakdown + issues |
| `09_diff_before_after.json` | JSON diff | Field-level changes |
| `10_issue_lifecycle.json` | Issue tracking | Which issues were fixed |
| `11_pointer_diff.json` | Pointer-level diff | JSON Pointer paths changed |
| `12_prompt_score_after.json` | After scoring prompt | System + user prompt + metadata |
| `index.json` | Run metadata | Status, scores, timestamps |
| `README.md` | Human-readable report | Formatted run summary |

**Prompt JSON Format:**
```json
{
  "step": "rewrite",
  "model": "gemini-2.0-flash-exp",
  "temperature": 0,
  "maxTokens": 24000,
  "system": "You are an expert lesson JSON refiner...",
  "user": "REFINE THIS LESSON JSON...",
  "timestamp": "2026-02-07T10:32:18.123Z",
  "inputRefs": ["00_input_lesson.json", "01_score_before.json"],
  "notes": "Holistic rewrite approach (v2)"
}
```

---

## 8. SUMMARY & RECOMMENDATIONS

### 8.1 Current State

✅ **Working:**
- Scoring prompts are comprehensive and detailed
- Phase 10 v2 rewrite enforces hard structural invariants
- Planner correctly identifies policy conflicts
- **D3 synthesis questions now align with short-text policy** ✨

✅ **Fixed (2026-02-07):**
- **D3 synthesis questions can now be fixed by Phase 10** after rubric alignment
- Rubric now accepts "3-4 sentences OR concise bullet points" for synthesis
- Marking expectations updated to support key-points checklist (4-8 items)
- All prompts consistently enforce "DO NOT change answerType" rule
- D3 issues are now classified as `llm_editable` instead of `blocked_by_policy`

### 8.2 Implementation Summary (2026-02-07)

**Changes Made:**

1. **Scoring Prompt - Rubric D3** (`llmScoringService.ts` line 297):
   - **OLD:** "Question 2: synthesis question (integrates all lesson concepts in 3-4 sentences)"
   - **NEW:** "Question 2: synthesis question (integrates all lesson concepts; student may answer in 3-4 sentences OR concise bullet points; grade on inclusion of key concepts, not exact phrasing)"

2. **Scoring Prompt - Marking Section E** (`llmScoringService.ts` line 302):
   - **OLD:** "For short-text: provides 2-6 acceptable variations"
   - **NEW:** "For short-text: provides 2-6 acceptable variations (or 4-8 key points/phrases for synthesis questions)"

3. **Planner Prompt - D3 Example** (`Phase10_Planner.ts` lines 209-215):
   - Shows llm_editable example for D3 synthesis (not blocked_by_policy)
   - Demonstrates how to fix synthesis questions via questionText and expectedAnswer updates

4. **Planner Prompt - blocked_by_policy Definition** (`Phase10_Planner.ts` lines 174-177):
   - Focuses on answerType changes (STRICTLY FORBIDDEN) and structural changes
   - No longer references D3 synthesis conflict

5. **Rewrite Prompt - Answer Type Rules** (`Phase10_Rewrite.ts` lines 317-333):
   - **OLD:** "Do NOT change answerType unless you also update..."
   - **NEW:** "DO NOT change answerType anywhere. This is a hard constraint."
   - **Added:** SYNTHESIS QUESTION REQUIREMENTS section (lines 323-327)
   - **Added:** CONNECTION QUESTION REQUIREMENTS section (lines 329-333)

**Rationale:**
- Aligns rubric with Phase 10 constraints
- Maintains pedagogical goals (comprehensive synthesis)
- Enables Phase 10 to fix D3 issues via questionText and expectedAnswer updates
- Reduces blocked_by_policy count
- Clarifies answerType immutability policy

**Expected Outcomes:**
- D3 synthesis questions fixable by Phase 10
- Consistent grading approach using key-points checklist
- Clear, unambiguous answerType policy across all prompts

---

## 9. APPENDIX: SHARED UTILITIES

### 9.1 JSON Output Instructions Template

**File:** `quiz-app/src/lib/generation/phases/PhasePromptBuilder.ts`  
**Function:** `getJsonOutputInstructions()` (line 50)

**Used by:** All phase prompts (scoring, planner, rewrite)

**Verbatim Template:**

```

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

This template is appended to all system prompts via `${this.getJsonOutputInstructions()}`.

---

## 10. MODEL & ENVIRONMENT CONFIGURATION

**Environment Variables:**
- `GEMINI_MODEL` - Model name (default: `gemini-2.0-flash-exp`)
- `LLM_MODEL` - Alternative model name (fallback)
- `PHASE10_DEBUG_PATH` - Output path for run artifacts (default: `reports/phase10_runs`)

**Config File:** `quiz-app/src/lib/generation/config.ts`

**Scoring Config (lines 74-97):**
```typescript
scoring: {
  method: 'llm' as 'llm' | 'rubric',
  temperature: 0.0,
  maxTokens: 16000,
}
```

**Refinement Config (lines 6-72):**
```typescript
refinement: {
  enabled: true,
  scoreThreshold: 97,
  maxFixes: 10,
  strategy: 'rewrite' as 'patch' | 'rewrite',
  rewriteEnabled: true,
}
```

**Debug Artifacts Config (lines 114-159):**
```typescript
debugArtifacts: {
  enabled: true,
  outputPath: process.env.PHASE10_DEBUG_PATH || 'reports/phase10_runs',
  plannerStage: {
    enabled: true,
    model: undefined  // Uses same model as rewrite
  }
}
```

---

## 11. CHANGELOG

### 2026-02-07: D3 Synthesis Alignment with Short-Text Policy

**Problem:** D3 synthesis questions were marked as `blocked_by_policy` because the rubric expected "3-4 sentences" but Phase 10 forbids changing answerType from short-text to long-text.

**Solution:** Updated prompts to align D3 synthesis with short-text answerType policy.

**Files Modified:**

1. **`quiz-app/src/lib/generation/llmScoringService.ts`**
   - Line 297: Updated D3 rubric to accept "3-4 sentences OR concise bullet points"
   - Line 298: Added NOTE about synthesis questions being valid with short-text
   - Line 303: Updated marking section E to allow "4-8 key points/phrases for synthesis questions"
   - Line 304: Added EXCEPTION clause for synthesis questions

2. **`quiz-app/src/lib/generation/phases/Phase10_Planner.ts`**
   - Lines 209-215: Shows llm_editable example for D3 synthesis (not blocked_by_policy)
   - Lines 174-177: blocked_by_policy definition focuses on answerType changes and structural changes

3. **`quiz-app/src/lib/generation/phases/Phase10_Rewrite.ts`**
   - Lines 317-333: Hardened answerType policy to "DO NOT change answerType anywhere"
   - Lines 323-327: Added SYNTHESIS QUESTION REQUIREMENTS section
   - Lines 329-333: Added CONNECTION QUESTION REQUIREMENTS section

**Impact:**
- D3 synthesis questions are now fixable by Phase 10
- Phase 10 can update questionText and expectedAnswer for synthesis questions
- Marking expectations align with short-text grading using key-points checklist
- Reduced blocked_by_policy count in planner output
- Consistent, unambiguous answerType policy across all prompts

---

**End of Document**
