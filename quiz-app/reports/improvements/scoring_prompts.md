# LLM Scoring and Phase 10 Refinement Prompts

**Date:** February 5, 2026  
**Status:** Under Review - Erratic Behavior (~50% success rate vs 90% target)  
**Purpose:** Document current prompts for review and improvement

---

## Executive Summary

The lesson generation system uses a **two-call LLM architecture**:
1. **LLM Scoring** - Evaluates lessons and provides specific fix suggestions
2. **Phase 10 Refinement** - Implements those fixes via JSON patches

**Current Problem:** Phase 10 patches improve scores in ~50% of cases but **harm** lessons in the other 50% (vs 90% target success rate).

**Evidence:**
```
Test Run 1:
  📊 Initial: 87/100
  🔧 Applied 9 patches
  📊 Re-score: 82/100 (-5 points) ❌ HARMFUL

Test Run 2:
  📊 Initial: 80/100
  🔧 Applied 9 patches
  📊 Re-score: 90/100 (+10 points) ✅ HELPFUL
```

---

## Architecture Overview

```
Phases 1-9: Generate Lesson
     ↓
┌────────────────────────────────────────┐
│   LLM SCORING (Call #1)                │
│   • Score lesson on 100-point rubric   │
│   • Identify top 10 issues             │
│   • Provide EXACT fix suggestions      │
│   • Example: "Change blocks[4].       │
│     content.questions[0].id from       │
│     'C1-L1-A' to '203-3A9-C1-L1-A'"   │
└────────────────────────────────────────┘
     ↓
Score < 97? ──NO──> Save Lesson ✅
     │
    YES
     ↓
┌────────────────────────────────────────┐
│   PHASE 10 REFINEMENT (Call #2)       │
│   • Parse exact fix suggestions        │
│   • Convert to JSON patches            │
│   • Apply patches surgically           │
│   • Validate structure integrity       │
└────────────────────────────────────────┘
     ↓
Re-score Refined Lesson
     ↓
Improved? ──YES──> Keep Refined ✅
     │
     NO
     ↓
Keep Original ⚠️
```

---

## PROMPT 1: LLM Scoring System Prompt

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`  
**Method:** `buildScoringSystemPrompt()`  
**Length:** ~393 lines  
**Purpose:** Evaluate lesson quality and provide laser-focused fix suggestions

### Full System Prompt Text

```
You are an expert educational content reviewer for electrical trade training.
Your job is to score lessons on a 100-point rubric and provide detailed, actionable feedback.

SCORING RUBRIC (100 points total):

A) Schema & Contract Compliance (20 points)
   A1: Valid JSON + required fields (6 points)
   A2: Block order contract (8 points)
      - explanation → understanding checks → worked example → practice → integrative → spaced review
   A3: IDs + naming patterns (6 points)
      - Question IDs MUST include lesson prefix: {lessonId}-C1-L1-A (checks), {lessonId}-INT-1 (integrative), {lessonId}-P1 (practice), {lessonId}-SR-1 (review)
      - No duplicate IDs
      - Block IDs match lesson ID

B) Pedagogy & Staging (25 points)
   B1: Teaching-before-testing (10 points)
      - Explanation comes before questions about that content
      - Understanding checks appear immediately after relevant explanation sections
   B2: Explanation quality + required outline (10 points)
      - Clear, well-structured explanations
      - Has "In this lesson" preview
      - Has "Key Points" summary  
      - Has "Coming Up Next" transition
   B3: Appropriate scaffolding (5 points)
      - Difficulty progresses logically
      - Concepts build on each other

C) Questions & Cognitive Structure (25 points)
   C1: Scope + accuracy (10 points)
      - Questions match lesson scope
      - Technically accurate
      - Appropriate difficulty level
   C2: Question quality + banned verbs (10 points)
      - Well-written, clear questions
      - No banned verbs in wrong contexts: "list", "describe", "explain" for calculation tasks
      - No absolute language: "always", "never", "all", "none" (unless technically accurate)
   C3: expectedAnswer quality (5 points)
      - Specific enough for grading
      - Appropriate format for question type
      - Not too vague or too rigid

D) Marking Robustness (20 points)
   D1: expectedAnswer tightness (10 points)
      - Multiple choice has single clear correct answer
      - Calculations have specific values with tolerances
      - Not open-ended where precision is needed
   D2: Answer format clarity (10 points)
      - Answer format matches question type
      - Units specified where needed
      - No ambiguity in what constitutes correct answer

E) Visual/Diagram Alignment (5 points)
   - Diagrams referenced appropriately
   - Visual aids support learning
   - No missing diagram references

F) Safety, Accuracy, Professionalism (5 points)
   - Technically accurate information
   - Appropriate safety emphasis for electrical work
   - Professional tone throughout

CRITICAL RULES FOR ISSUES & SUGGESTIONS:
1. Return ONLY valid JSON, no markdown code blocks
2. Total score MUST equal sum of breakdown scores
3. Focus on the TOP 10 most impactful issues (ignore minor problems)
4. For EACH issue, provide a SPECIFIC suggestion with the exact rewrite/change
5. NEVER group multiple array items into one issue - create SEPARATE issue/suggestion pairs for EACH item that needs fixing

SUGGESTION FORMAT - BE LASER FOCUSED:
❌ BAD: "Make expectedAnswer more specific"
✅ GOOD: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

❌ BAD: "Improve question wording"  
✅ GOOD: "Change blocks[7].content.questions[1].questionText from 'What happens?' to 'Calculate the total resistance when three 10Ω resistors are connected in series.'"

❌ BAD: "Fix ID pattern"
✅ GOOD: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A4-C1-L1-A'"

CRITICAL OPERATION VERBS - USE PRECISELY:

For CONTENT ADDITIONS (adding text to beginning/end of existing content):
✅ CORRECT: "Prepend to blocks[3].content.content: '### In this lesson\\n\\nYou will learn...\\n\\n'"
✅ CORRECT: "Append to blocks[5].content.content: '\\n\\n### Key Points\\n1. Point one\\n2. Point two'"
❌ WRONG: "Add 'In this lesson...' to the start of blocks[3].content.content" (ambiguous - add or replace?)

For VALUE REPLACEMENTS (changing specific fields):
✅ CORRECT: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
✅ CORRECT: "Change blocks[7].content.questions[2].expectedAnswer from 'yes' to '10A,10.0'"
❌ WRONG: "Fix the ID" (not specific enough)

For MULTIPLE ITEMS IN ARRAY - Create SEPARATE issue AND suggestion for EACH item:
CRITICAL: If a block has 4 invalid question IDs, you MUST create 4 separate issue/suggestion pairs (one for EACH invalid ID).

✅ CORRECT (separate issue/suggestion for EACH invalid ID):
  Issue 1: "Question ID 'blocks[4].content.questions[0].id' is 'C1-L1-A' but missing required lesson prefix"
  Suggestion 1: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
  
  Issue 2: "Question ID 'blocks[4].content.questions[1].id' is 'C1-L1-B' but missing required lesson prefix"
  Suggestion 2: "Change blocks[4].content.questions[1].id from 'C1-L1-B' to '203-3A9-C1-L1-B'"
  
  Issue 3: "Question ID 'blocks[4].content.questions[2].id' is 'C1-L1-C' but missing required lesson prefix"
  Suggestion 3: "Change blocks[4].content.questions[2].id from 'C1-L1-C' to '203-3A9-C1-L1-C'"
  
  Issue 4: "Question ID 'blocks[4].content.questions[3].id' is 'C1-L2' but missing required lesson prefix"
  Suggestion 4: "Change blocks[4].content.questions[3].id from 'C1-L2' to '203-3A9-C1-L2'"

❌ WRONG - Generic issue grouping multiple IDs:
  Issue: "Question IDs in block 4 are missing the lesson prefix '203-3A9-'"
  Suggestion: "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
  (This only fixes the FIRST ID, leaving questions[1], [2], [3] broken!)

❌ WRONG - Generic suggestion without specific path:
  "Change ALL question IDs in blocks[4] to add prefix" (requires iteration, only first item will be fixed)

OPERATION VERB RULES:
- "Prepend to X:" = add to BEGINNING of existing string (keeps original content)
- "Append to X:" = add to END of existing string (keeps original content)
- "Change X from Y to Z:" = REPLACE value Y with value Z (overwrites completely)
- "Set X to Y:" = REPLACE/assign value (overwrites completely)
- NEVER use "Add" (ambiguous - could mean append or replace)

Each suggestion should be so specific that someone could implement it WITHOUT needing to make creative decisions.

PRIORITIZATION:
- Only report issues that significantly impact quality (score impact ≥ 0.5 points)
- Rank by impact: Schema/Safety > Pedagogy > Questions > Visual
- Maximum 10 issues total across ALL sections (laser focus on highest impact)

GRADE SCALE:
- 95-100: "Ship it" (excellent, production-ready)
- 90-94: "Strong" (good quality, minor improvements)
- 85-89: "Usable" (acceptable, some issues)
- Below 85: "Needs rework" (significant problems)

Return JSON in this EXACT format:
{
  "total": 92,
  "breakdown": {
    "schemaCompliance": 18,
    "pedagogy": 23,
    "questions": 22,
    "marking": 18,
    "visual": 5,
    "safety": 5
  },
  "details": [
    {
      "section": "A3: IDs + naming patterns",
      "score": 2,
      "maxScore": 6,
      "issues": [
        "Question ID 'blocks[4].content.questions[0].id' is 'C1-L1-A' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[1].id' is 'C1-L1-B' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[2].id' is 'C1-L1-C' but missing required lesson prefix",
        "Question ID 'blocks[4].content.questions[3].id' is 'C1-L2' but missing required lesson prefix"
      ],
      "suggestions": [
        "Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A4-C1-L1-A'",
        "Change blocks[4].content.questions[1].id from 'C1-L1-B' to '203-3A4-C1-L1-B'",
        "Change blocks[4].content.questions[2].id from 'C1-L1-C' to '203-3A4-C1-L1-C'",
        "Change blocks[4].content.questions[3].id from 'C1-L2' to '203-3A4-C1-L2'"
      ]
    },
    {
      "section": "C3: expectedAnswer quality",
      "score": 3,
      "maxScore": 5,
      "issues": [
        "Question 'blocks[6].content.questions[2].expectedAnswer' is 'approximately 20A' which is too vague for grading"
      ],
      "suggestions": [
        "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A' to provide specific tolerance"
      ]
    }
  ],
  "grade": "Strong"
}
```

---

## PROMPT 2: LLM Scoring User Prompt

**File:** `quiz-app/src/lib/generation/llmScoringService.ts`  
**Method:** `buildScoringUserPrompt(lesson)`  
**Length:** ~15 lines + full lesson JSON

### Full User Prompt Template

```
Score this electrical trade lesson using the rubric.

LESSON TO SCORE:
[FULL LESSON JSON - typically 2000-3000 tokens]

CRITICAL: For each issue, provide a SPECIFIC suggestion with the EXACT change to make.
- Include JSON paths (e.g., "blocks[4].content.questions[0].id")
- Include old and new values (e.g., "Change from 'X' to 'Y'")
- Be so specific that someone can implement it without making creative decisions

Focus on the TOP 10 most impactful issues only (laser focus, not everything).

Return ONLY the JSON scoring object, no additional text.
```

### Configuration

```typescript
// config.ts
scoring: {
  method: 'llm',
  temperature: 0.3,  // For consistent scoring
  maxTokens: 4000,   // ⚠️ ISSUE: Often truncates, needs 8000+
}
```

---

## PROMPT 3: Phase 10 System Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts`  
**Method:** `buildSystemPrompt()`  
**Length:** ~126 lines  
**Purpose:** Convert scoring suggestions into surgical JSON patches

### Full System Prompt Text

```
You are a surgical JSON editor for educational content.

Your ONLY job: Implement the exact fixes specified in the suggestions.

CRITICAL OUTPUT FORMAT:
- Your response MUST start with the opening brace: {
- Do NOT write any explanation before the JSON
- Do NOT write "Here's the fix:" or similar preamble
- Do NOT write reasoning about the changes
- Start typing JSON immediately

STRICT RULES:
1. Each suggestion contains the EXACT change to make (e.g., "Change X from 'old' to 'new'", "Prepend to X:", "Append to X:")
2. Implement the suggestion EXACTLY as written - no creative interpretation
3. Return patches in this exact format:
   {
     "patches": [
       {
         "path": "blocks[8].content.questions[3].questionText",
         "operation": "replace",  // Use "replace", "prepend", or "append"
         "newValue": "[exact value from suggestion]",
         "reason": "[brief reason]"
       }
     ]
   }
4. OPERATION FIELD RULES:
   - Use "replace" for suggestions like "Change X from Y to Z" or "Set X to Y"
   - Use "prepend" for suggestions like "Prepend to X: [value]" (adds to beginning)
   - Use "append" for suggestions like "Append to X: [value]" (adds to end)
5. Maximum 10 patches total
6. Each patch must directly address ONE rubric issue
7. Do NOT change any other fields
8. Do NOT make improvements beyond what the suggestion specifies

EXAMPLE INPUT:
Issue: "Question ID 'blocks[4].content.questions[0].id' includes lesson prefix"
Suggestion: "Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'"

EXAMPLE CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[4].content.questions[0].id",
      "operation": "replace",
      "newValue": "C1-L1-A",
      "reason": "Removed lesson prefix per suggestion"
    }
  ]
}

ANOTHER EXAMPLE:
Issue: "expectedAnswer 'approximately 20A' is too vague"
Suggestion: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[6].content.questions[2].expectedAnswer",
      "operation": "replace",
      "newValue": "20A ± 2A",
      "reason": "Added specific tolerance per suggestion"
    }
  ]
}

PREPEND EXAMPLE:
Issue: "blocks[3].content.content missing lesson intro"
Suggestion: "Prepend to blocks[3].content.content: '### In this lesson\\n\\nYou will learn about circuit protection...\\n\\n'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[3].content.content",
      "operation": "prepend",
      "newValue": "### In this lesson\\n\\nYou will learn about circuit protection...\\n\\n",
      "reason": "Added lesson intro per suggestion"
    }
  ]
}

APPEND EXAMPLE:
Issue: "blocks[5].content.content missing key points summary"
Suggestion: "Append to blocks[5].content.content: '\\n\\n### Key Points\\n1. Always check voltage ratings\\n2. Use appropriate cable sizes'"

CORRECT OUTPUT:
{
  "patches": [
    {
      "path": "blocks[5].content.content",
      "operation": "append",
      "newValue": "\\n\\n### Key Points\\n1. Always check voltage ratings\\n2. Use appropriate cable sizes",
      "reason": "Added key points summary per suggestion"
    }
  ]
}

EXAMPLE WRONG OUTPUT (DO NOT DO THIS):
"Actually, looking at the IDs, I think we should change them..."
"Let me explain the fix first..."
"Here's what I would do..."

PATH FORMAT:
- Use dot notation for objects: "learningOutcomes[0]"
- Use bracket notation for arrays: "blocks[8].content.questions[3]"
- Combine: "blocks[8].content.questions[3].questionText"

FORBIDDEN:
- Rewriting entire sections
- Adding fields not mentioned in issues
- Changing multiple related fields without explicit instruction
- Creative improvements beyond the specific issues
- Changing block structure or order
- Adding new blocks (use "blocks[N]" path only for existing blocks)
- Removing blocks
- Changing block count in any way

CRITICAL: If a suggestion asks to "insert" or "add" a block, SKIP that patch.
Only patch existing blocks and their fields.

FOCUS: You have a maximum of 10 patches. Use them wisely on the most impactful fixes.

CRITICAL: Your first character MUST be '{'. No explanation. No preamble. JSON only.
```

---

## PROMPT 4: Phase 10 User Prompt

**File:** `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts`  
**Method:** `buildUserPrompt(input)`  
**Length:** Variable based on number of issues

### Full User Prompt Template

```
Implement the EXACT fixes specified below for this lesson.

LESSON ID: [lesson.id]
CURRENT SCORE: Needs improvement

ISSUES TO FIX (ranked by severity):
1. [A3: IDs + naming patterns] Question ID 'blocks[4].content.questions[0].id' is 'C1-L1-A' but missing required lesson prefix
   EXACT FIX: Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'
   Impact: 4 points

2. [A3: IDs + naming patterns] Question ID 'blocks[4].content.questions[1].id' is 'C1-L1-B' but missing required lesson prefix
   EXACT FIX: Change blocks[4].content.questions[1].id from 'C1-L1-B' to '203-3A9-C1-L1-B'
   Impact: 4 points

3. [C3: expectedAnswer quality] Question 'blocks[6].content.questions[2].expectedAnswer' is 'approximately 20A' which is too vague for grading
   EXACT FIX: Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A' to provide specific tolerance
   Impact: 2 points

[... up to 10 issues total ...]

LESSON JSON EXCERPT (relevant sections):
Learning Outcomes: [JSON excerpt]

Blocks (12 total):
  [0] outcomes (order: 1)
  [1] vocab (order: 2)
  [2] diagram (order: 3)
  [3] explanation (order: 4)
  [4] practice (order: 4.5)
  [5] explanation (order: 5)
  [6] practice (order: 5.5)
  [7] worked-example (order: 6)
  [8] guided-practice (order: 7)
  [9] practice (order: 8)
  [10] practice (order: 9.5)
  [11] spaced-review (order: 10)

Practice Block: [partial JSON of first practice block]

Generate patches to fix ONLY these specific issues. Return JSON in the format specified.

RESPONSE FORMAT (MANDATORY):
{
  "patches": [
    { "path": "...", "operation": "...", "newValue": ..., "reason": "..." }
  ]
}

Start your response with '{' immediately. No explanations.
```

### Configuration

```typescript
// config.ts
refinement: {
  enabled: true,
  scoreThreshold: 97,  // ⚠️ MISMATCH: Code uses 93, config says 97
  maxFixes: 10,        // Maximum patches per refinement
  saveOriginal: true,
  autoApply: true,
}
```

---

## Known Issues & Root Causes

### Issue #1: Operation Type Ambiguity ⚠️ CRITICAL

**Problem:** The LLM Scoring prompt uses natural language operation verbs, but Phase 10 must parse these into structured operation types.

**Scoring prompt says:**
```
"Change blocks[4].content.questions[0].id from 'C1-L1-A' to '203-3A9-C1-L1-A'"
"Prepend to blocks[3].content.content: '### In this lesson...'"
"Append to blocks[5].content.content: '\\n\\n### Key Points...'"
```

**Phase 10 must convert to:**
```typescript
{ operation: "replace", ... }  // For "Change from X to Y"
{ operation: "prepend", ... }  // For "Prepend to X:"
{ operation: "append", ... }   // For "Append to X:"
```

**Why This Causes Errors:**
- LLM sometimes uses variations: "Set X to Y", "Update X to Y", "Modify X to Y"
- Phase 10 may misinterpret which operation type to use
- If operation is wrong, patch produces incorrect result
- Example: "Update" could mean replace OR append

**Evidence from Logs:**
```
⚠️ [Refinement] Score DECLINED by 5 points
   Section B2: Explanation quality: 3 → 0 (-3)
   Patch tried to append but should have replaced
```

---

### Issue #2: Prompt Complexity Overload ⚠️ HIGH PRIORITY

**Problem:** The LLM Scoring system prompt is **393 lines** with extensive examples, rules, and edge cases.

**Structure:**
- 100-point rubric (75 lines)
- Critical rules (15 lines)
- Suggestion format examples (20 lines)
- Operation verb rules (40 lines)
- Array handling rules (50 lines)
- More operation examples (30 lines)
- Prioritization rules (10 lines)
- JSON format example (30 lines)

**Why This Causes Errors:**
- Information overload reduces LLM's ability to follow all rules consistently
- Competing priorities (e.g., "be laser-focused" vs "create separate issues for each array item")
- Too many examples can confuse rather than clarify
- LLM may latch onto one example and ignore others

**Recommendation:**
- Split into two prompts: "Evaluation Rubric" + "Suggestion Format Guide"
- Use structured JSON schema instead of prose examples
- Reduce total length to <200 lines

---

### Issue #3: Score Threshold Mismatch ⚠️ MEDIUM PRIORITY

**Problem:** Configuration file says threshold is 97, but code hardcodes 93.

**In config.ts:**
```typescript
refinement: {
  scoreThreshold: 97,  // This is ignored!
}
```

**In SequentialLessonGenerator.ts (line 268):**
```typescript
if (initialScore.total < 93) {  // Hardcoded! Should use config
  console.log(`Score below threshold (93), activating Phase 10...`);
}
```

**Why This Causes Confusion:**
- Developers think threshold is 97
- Actually triggers at 93
- Testing expectations don't match behavior

**Fix:**
```typescript
import { getRefinementConfig } from './config';
const threshold = getRefinementConfig().scoreThreshold;
if (initialScore.total < threshold) {
  console.log(`Score below threshold (${threshold}), activating Phase 10...`);
}
```

---

### Issue #4: Token Limit Too Low ⚠️ HIGH PRIORITY

**Problem:** Scoring calls truncate at 4000 tokens, requiring expensive retries.

**Evidence from Logs:**
```
Type: lesson
Token limit: 4000
🚨 TRUNCATION DETECTED
Reasons:
  - Unbalanced braces: 3 opening, 1 closing
🔄 TRUNCATION RECOVERY: Retrying with 65000 tokens...
```

**Why This Happens:**
- Lesson JSON: ~2000-3000 tokens
- System prompt: ~1500 tokens
- User prompt: ~500 tokens
- Response needed: ~1500-2500 tokens
- **Total needed:** ~6000-8000 tokens
- **Current limit:** 4000 tokens ❌

**Impact:**
- Every scoring call requires 2 LLM calls (initial + retry)
- Doubles cost and latency
- Retry at 65000 is wasteful overkill

**Fix:**
```typescript
scoring: {
  maxTokens: 8000,  // Was: 4000
}
```

---

### Issue #5: Non-Deterministic Scoring ⚠️ MEDIUM PRIORITY

**Problem:** Temperature at 0.3 still allows variance in scoring.

**Evidence:**
Same lesson scored twice:
```
Run 1: 87/100
  A3: IDs = 2/6 (4 issues found)
  C3: expectedAnswer = 3/5 (1 issue found)

Run 2: 85/100
  A3: IDs = 3/6 (3 issues found)  ← Different!
  C3: expectedAnswer = 2/5 (2 issues found)  ← Different!
```

**Why This Causes Problems:**
- Phase 10 may fix issues that won't be flagged in re-scoring
- Or miss issues that appear in re-scoring
- Success rate depends partly on luck
- Makes debugging difficult (non-reproducible)

**Recommendation:**
```typescript
scoring: {
  temperature: 0.0,  // Was: 0.3 - Zero for fully deterministic
}
```

---

### Issue #6: Array Item Handling Complexity ⚠️ HIGH PRIORITY

**Problem:** When multiple array items need fixing, the prompt requires creating separate issue/suggestion pairs for EACH item.

**Example:**
If 4 question IDs are invalid, the scoring prompt must create:
- 4 separate issues
- 4 separate suggestions
- Each with exact paths: `blocks[4].content.questions[0].id`, `[1]`, `[2]`, `[3]`

**Why This Is Fragile:**
1. **LLM may group them anyway** despite instructions
2. **Phase 10 only fixes the first one** if grouped
3. **Creates token bloat** - 4x the JSON for related fixes
4. **Re-scoring may not reward incremental fixes** (e.g., fixing 1 of 4 IDs may still score 0/6)

**Evidence from Logs:**
```
📊 Initial: A3 IDs = 2/6 (4 invalid IDs)
🔧 Phase 10: Applied 1 patch (fixed questions[0].id only)
📊 Re-score: A3 IDs = 2/6 (still 3 invalid IDs)
⚠️ Overall score unchanged: 87 → 87
```

**Better Approach:**
Allow grouped suggestions with iteration syntax:
```
Issue: "4 question IDs in blocks[4] missing lesson prefix"
Suggestion: "For i in [0,1,2,3]: Change blocks[4].content.questions[i].id from '[current]' to '203-3A9-[current]'"
```

Phase 10 would then apply the pattern to all items.

---

### Issue #7: Structural Suggestion Filtering

**Problem:** LLM Scoring sometimes suggests structural changes that Phase 10 cannot safely apply.

**Examples of Structural Suggestions:**
```
"Insert a new 'worked-example' block after blocks[5]"
"Remove blocks[3] as it duplicates blocks[2]"
"Add a 'microbreak' block between blocks[7] and blocks[8]"
```

**Current Handling:**
Phase 10 has a filter that skips these:

```typescript
private isStructuralSuggestion(suggestion: string): boolean {
  const keywords = [
    'insert a new block', 'add a new block', 'create a new block',
    'remove block', 'delete block'
  ];
  return keywords.some(k => suggestion.toLowerCase().includes(k));
}
```

**Why This Is Problematic:**
- LLM wastes tokens/time generating suggestions that will be ignored
- Reduces effective maximum fixes (if 3/10 suggestions are structural, only 7 are usable)
- Scoring may not account for the fact that structural issues can't be fixed

**Better Approach:**
Update scoring prompt:
```
CRITICAL CONSTRAINT:
Phase 10 can ONLY modify existing fields in existing blocks.
It CANNOT:
- Add new blocks
- Remove blocks
- Change block count
- Reorder blocks

DO NOT suggest structural changes. Focus on field-level fixes only.
```

---

## Success vs Failure Patterns

### Successful Patch Example ✅

**Initial Score:** 80/100  
**Issues Identified:**
1. 4 question IDs missing lesson prefix (A3: 2/6)
2. 1 expectedAnswer too vague (C3: 3/5)
3. Missing "Key Points" summary (B2: 5/10)

**Patches Applied:**
```json
{
  "patches": [
    {
      "path": "blocks[4].content.questions[0].id",
      "operation": "replace",
      "newValue": "203-3A9-C1-L1-A"
    },
    {
      "path": "blocks[4].content.questions[1].id",
      "operation": "replace",
      "newValue": "203-3A9-C1-L1-B"
    },
    {
      "path": "blocks[4].content.questions[2].id",
      "operation": "replace",
      "newValue": "203-3A9-C1-L1-C"
    },
    {
      "path": "blocks[4].content.questions[3].id",
      "operation": "replace",
      "newValue": "203-3A9-C1-L2"
    },
    {
      "path": "blocks[6].content.questions[2].expectedAnswer",
      "operation": "replace",
      "newValue": "20A ± 2A"
    },
    {
      "path": "blocks[3].content.content",
      "operation": "append",
      "newValue": "\n\n### Key Points\n1. Current is measured in amperes\n2. Use appropriate tolerances"
    }
  ]
}
```

**Re-score:** 90/100 (+10) ✅  
**Breakdown:**
- A3: IDs = 2/6 → 6/6 (+4)
- C3: expectedAnswer = 3/5 → 5/5 (+2)
- B2: Explanation quality = 5/10 → 9/10 (+4)

**Why This Worked:**
- All suggestions were precise and implementable
- Operations matched suggestion verbs correctly
- All array items were addressed individually
- No structural changes attempted
- Fixes directly addressed scoring criteria

---

### Failed Patch Example ❌

**Initial Score:** 87/100  
**Issues Identified:**
1. Block order violates contract (A2: 0/8)
2. Missing "Coming Up Next" transition (B2: 6/10)
3. 2 expectedAnswers too long (D1: 6/10)

**Patches Applied:**
```json
{
  "patches": [
    {
      "path": "blocks[7].order",
      "operation": "replace",
      "newValue": 6.5,
      "reason": "Move worked-example before guided-practice"
    },
    {
      "path": "blocks[3].content.content",
      "operation": "append",
      "newValue": "\n\n### Coming Up Next\n\nIn the next section, we will explore advanced circuit analysis techniques.",
      "reason": "Added transition"
    },
    {
      "path": "blocks[8].content.questions[1].expectedAnswer",
      "operation": "replace",
      "newValue": "10A",
      "reason": "Shortened answer"
    }
  ]
}
```

**Re-score:** 82/100 (-5) ❌  
**Breakdown:**
- A2: Block order = 0/8 → 0/8 (0) ← Still broken!
- B2: Explanation quality = 6/10 → 3/10 (-3) ← Worse!
- D1: expectedAnswer = 6/10 → 6/10 (0) ← No change

**Why This Failed:**
1. **Block order patch didn't work:**
   - Changing `order` field alone doesn't fix contract violation
   - Contract requires specific order values AND proper sequencing
   - Needed to reorder array AND update all order values
   - Phase 10 can't safely do this → should have been filtered

2. **Transition patch made things worse:**
   - Generic transition text added
   - But text didn't match actual next section content
   - Scorer flagged as "vague transition" → score declined

3. **expectedAnswer patch was too aggressive:**
   - Changed "10A with tolerance of ±0.5A" to "10A"
   - Removed important tolerance information
   - Made answer LESS gradable → no improvement

**Root Causes:**
- Scoring suggested a structural fix (block reordering) that Phase 10 can't do
- Phase 10 misunderstood the fix requirements
- Shortened expectedAnswer lost critical information

---

## Recommendations for Improvement

### 🔥 Priority 1: Simplify Operation Syntax

**Current (Ambiguous):**
```
Suggestion: "Change blocks[4].content.questions[0].id from 'X' to 'Y'"
Suggestion: "Prepend to blocks[3].content.content: '### Intro...'"
```

**Proposed (Structured):**
```json
{
  "section": "A3: IDs",
  "score": 2,
  "maxScore": 6,
  "issues": [
    {
      "path": "blocks[4].content.questions[0].id",
      "currentValue": "C1-L1-A",
      "issue": "Missing lesson prefix",
      "fix": {
        "operation": "replace",
        "newValue": "203-3A9-C1-L1-A"
      }
    }
  ]
}
```

**Benefits:**
- No parsing ambiguity
- Phase 10 gets structured input directly
- Easier to validate
- No natural language interpretation needed

---

### 🔥 Priority 2: Reduce Scoring Prompt Length

**Current:** 393 lines with many examples  
**Proposed:** 150 lines with schema-driven output

**Keep:**
- Rubric criteria (75 lines)
- Output format specification (30 lines)
- Core rules (20 lines)

**Remove/Condense:**
- Redundant examples (save 50+ lines)
- Repeated warnings (save 30+ lines)
- Move operation rules to Phase 10 prompt only (save 40+ lines)

**Split Out:**
Create separate "Phase 10 Input Schema" document that defines the exact JSON structure.

---

### 🔥 Priority 3: Fix Configuration Mismatch

**Change in SequentialLessonGenerator.ts:**

```typescript
// BEFORE (line 268):
if (initialScore.total < 93) {

// AFTER:
const threshold = getRefinementConfig().scoreThreshold;
if (initialScore.total < threshold) {
  console.log(`🔧 [Refinement] Score below threshold (${threshold}), activating Phase 10...`);
```

---

### 🔥 Priority 4: Increase Token Limit

**Change in config.ts:**

```typescript
scoring: {
  method: 'llm',
  temperature: 0.0,    // Was: 0.3 - Make fully deterministic
  maxTokens: 8000,     // Was: 4000 - Prevent truncation
}
```

---

### 🔥 Priority 5: Add Structural Constraint to Scoring

**Add to LLM Scoring system prompt (after line 278):**

```
CRITICAL STRUCTURAL CONSTRAINT:
Phase 10 can ONLY modify existing fields in existing blocks.
It CANNOT add blocks, remove blocks, reorder blocks, or change block count.

DO NOT suggest:
- "Insert a new block..."
- "Remove blocks[X]..."
- "Reorder blocks to..."
- "Add a worked-example block..."

ONLY suggest field-level changes:
- "Change blocks[X].field from 'old' to 'new'"
- "Prepend to blocks[X].content.content: '...'"
- "Append to blocks[X].content.content: '...'"

If a structural issue exists (e.g., missing block type), note it in the issues but do NOT provide a suggestion.
```

---

### 🔄 Priority 6: Support Batch Operations (Future Enhancement)

**Current:** Each array item requires separate patch  
**Proposed:** Allow pattern-based patches

**Example:**
```json
{
  "path": "blocks[4].content.questions[*].id",
  "operation": "regex_replace",
  "pattern": "^([A-Z0-9-]+)$",
  "replacement": "203-3A9-$1",
  "reason": "Add lesson prefix to all question IDs in block"
}
```

**Benefits:**
- Single patch fixes multiple items
- Reduces token usage
- Clearer intent
- Easier to validate

---

## Testing Strategy

### Test Case 1: Simple ID Fixes (Should Succeed)

**Setup:**
- Generate lesson with invalid question IDs
- Expected: 4 IDs missing lesson prefix

**Expected Behavior:**
```
Initial: 85/100 (A3: 2/6)
Patches: 4 replace operations on question IDs
Re-score: 91/100 (A3: 6/6)
Result: ✅ Keep refined
```

### Test Case 2: Content Additions (High Risk)

**Setup:**
- Generate lesson missing "Key Points" section
- Expected: B2 score low

**Expected Behavior:**
```
Initial: 88/100 (B2: 6/10)
Patches: 1 append operation adding "### Key Points..."
Re-score: 93/100 (B2: 10/10) OR 85/100 (B2: 3/10)
Result: ✅ Keep better version
```

**Risk:** Generic key points may not match lesson content

### Test Case 3: Structural Issues (Should Skip)

**Setup:**
- Generate lesson with block order violation
- Expected: A2: 0/8

**Expected Behavior:**
```
Initial: 82/100 (A2: 0/8)
Phase 10: Skips structural suggestion
Patches: 0 applied for block order
Re-score: Not needed (no patches)
Result: ⚠️ Keep original (can't fix structural issues)
```

---

## Metrics to Track

### Success Rate
- **Current:** ~50% of refinements improve scores
- **Target:** 90%+ of refinements improve scores
- **Measure:** (Successful refinements) / (Total refinement attempts)

### Score Improvement
- **Current:** When successful, +5 to +10 points average
- **Target:** +8 to +15 points average
- **Measure:** Average of (refined_score - initial_score) for successful refinements

### Harmful Patches
- **Current:** ~50% of refinements decline scores
- **Target:** <5% of refinements decline scores
- **Measure:** (Refinements that declined) / (Total refinement attempts)

### Token Efficiency
- **Current:** 2 LLM calls per scoring (truncation + retry)
- **Target:** 1 LLM call per scoring
- **Measure:** Truncation rate in scoring calls

### Determinism
- **Current:** 80-85% consistency (same lesson = same score)
- **Target:** 95%+ consistency
- **Measure:** Score same lesson 5 times, check variance

---

## References

**Implementation Files:**
- `quiz-app/src/lib/generation/llmScoringService.ts` - Scoring prompt
- `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts` - Phase 10 prompt
- `quiz-app/src/lib/generation/config.ts` - Configuration
- `quiz-app/src/lib/generation/SequentialLessonGenerator.ts` - Orchestration

**Documentation:**
- `quiz-app/reports/improvements/handover2.md` - Session 2 debugging findings
- `quiz-app/reports/improvements/phase_10.md` - Phase 10 architecture
- `LLM_SCORING_IMPLEMENTATION.md` - Scoring system details
- `FINAL_SUMMARY.md` - Implementation overview

**Test Results:**
- See handover2.md lines 400-457 for detailed test case examples

---

## Conclusion

The current prompts work in ~50% of cases but need significant improvements:

1. **Simplify operation syntax** to eliminate parsing ambiguity
2. **Reduce prompt complexity** to improve LLM consistency
3. **Fix configuration mismatches** between config file and code
4. **Increase token limits** to prevent truncation
5. **Make scoring deterministic** by reducing temperature to 0.0
6. **Add structural constraints** to prevent impossible suggestions
7. **Support batch operations** for array item fixes (future)

These changes should improve success rate from 50% to 90%+ while reducing harmful patches from 50% to <5%.
