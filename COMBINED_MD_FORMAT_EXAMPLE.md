# Example: New COMBINED.md Format

This shows what you'll see in the new `COMBINED.md` files after improving a lesson.

---

# Phase 10 Debug Run

**Run ID:** 203-3A1__2026-02-07T12-53-48-490Z__rewrite__gemini-3-flash-preview
**Lesson:** 203-3A1
**Strategy:** rewrite
**Timestamp:** 2026-02-07T12:53:48.490Z
**Status:** success

================================================================================

## Summary

- **Score Before:** 91/100 (Strong)
- **Score After:** 94/100 (Strong)
- **Delta:** +3 points
- **Validation:** ✅ PASSED

================================================================================

## Step 1: Rewrite Prompt

**Timestamp:** 2026-02-07T12:53:48.538Z
**Model:** gemini-3-flash-preview
**Temperature:** 0
**Max Tokens:** 24000

### System Prompt

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
- Do NOT change answerType unless you also update the question's grading expectations so marking remains robust.
- Prefer keeping answerType unchanged and improving hints/expectedAnswer variants unless explicitly required.
- If you must change answerType, use ONLY one of the 4 valid types above.

OUTPUT FORMAT:
Return the full lesson JSON object.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    ... full lesson content ...
  ]
}

SCORING REPORT (issues + suggestions):
Total Score: 91/100 (Strong)

Issues by Section:

## questions: The integrative block question 2 (203-3A1-INT-2) is intended... (0/3)
- Issue: The integrative block question 2 (203-3A1-INT-2) is intended as a synthesis question but uses the 'short-text' answerType and a prompt that asks for simple identification. This prevents students from performing the required 3-4 sentence integration of all lesson concepts.
  Suggestion: Cannot be fixed by Phase 10 - requires regeneration

## beginnerClarityStaging: Check block question 203-3A1-C1-L2 includes 'safety of movem... (0/2)
- Issue: Check block question 203-3A1-C1-L2 includes 'safety of movement' as an expected answer, but this specific technical term is not explicitly taught in the preceding explanation block (blocks[3]).
  Suggestion: Modify blocks[3].content.content

... more issues ...

TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

---

## Step 1: Rewrite Output (Raw Model Response)

```json
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    ... full refined lesson with fixes applied ...
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

## Index Manifest

**File:** `INDEX.json`

```json
{
  "lessonId": "203-3A1",
  "runId": "203-3A1__2026-02-07T12-53-48-490Z__rewrite__gemini-3-flash-preview",
  "timestampUtc": "2026-02-07T12:53:48.490Z",
  "phase10Strategy": "rewrite",
  "models": {
    "rewrite": "gemini-3-flash-preview",
    "scoring": "gemini-3-flash-preview"
  },
  "scoreBefore": {
    "total": 91,
    "grade": "Strong",
    "breakdownFile": "01_score_before.json"
  },
  "scoreAfter": {
    "total": 94,
    "grade": "Strong",
    "breakdownFile": "11_score_after.json"
  },
  "validator": {
    "passed": true,
    "warnings": 0,
    "file": "16_validation.json"
  },
  "status": "success",
  "failure": null
}
```

---

... additional sections (scores, validation, diff) ...

---

## End of Report

Generated: 2026-02-07T13:15:22.123Z
Total files: 11

---

## KEY DIFFERENCES FROM OLD FORMAT

### OLD FORMAT (Before)
- Prompts buried in JSON: `{ "system": "...", "user": "..." }`
- Had to manually parse JSON to see prompt text
- Generic "Raw Model Output" label
- All files treated equally

### NEW FORMAT (After)  
- ✅ System Prompt displayed separately and fully expanded
- ✅ User Prompt displayed separately and fully expanded
- ✅ Clear "Raw Model Response" label
- ✅ Prompts/outputs prominently placed at the top
- ✅ Step-by-step flow clearly shown
- ✅ Timestamps and metadata visible

## HOW TO USE

1. Open `COMBINED.md` in any markdown viewer
2. Scroll to "Step 1: Rewrite Prompt" section
3. See EXACTLY what was sent to the model (system + user prompts)
4. Scroll to "Step 1: Rewrite Output" section
5. See EXACTLY what the model returned
6. Copy prompts for testing or debugging
7. Compare before/after to understand model changes
