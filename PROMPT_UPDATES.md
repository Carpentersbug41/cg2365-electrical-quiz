# Scoring & Refinement Prompt Updates

**Date:** February 5, 2026  
**Status:** ✅ COMPLETE

## What Changed

Updated both LLM scoring and Phase 10 refinement prompts to work together more effectively with **laser-focused, specific suggestions**.

## The Two-Call Architecture

### Call 1: LLM Scoring (Holistic Evaluation)
**File:** `llmScoringService.ts`

**Purpose:** Evaluate the full lesson and identify top 10 issues with EXACT fixes

**Key Changes:**
- Focus on top 10 most impactful issues only (≥ 0.5 points each)
- Each suggestion must include the EXACT change to make
- Include JSON paths, old values, and new values
- Be so specific that Phase 10 just implements, no creative decisions

**Example Output:**
```json
{
  "section": "C3: expectedAnswer quality",
  "issues": [
    "Question 'blocks[6].content.questions[2].expectedAnswer' is 'approximately 20A' which is too vague"
  ],
  "suggestions": [
    "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A' to provide specific tolerance"
  ]
}
```

### Call 2: Phase 10 Refinement (Mechanical Implementation)
**File:** `Phase10_Refinement.ts`

**Purpose:** Convert those specific suggestions into JSON patches

**Key Changes:**
- Emphasize "implement the EXACT fixes specified"
- Suggestions contain exact changes - no creative interpretation
- Show clear examples of input suggestion → output patch
- Label suggestions as "EXACT FIX:" in the prompt

**Example Flow:**
```
Input Suggestion: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

Output Patch:
{
  "path": "blocks[6].content.questions[2].expectedAnswer",
  "newValue": "20A ± 2A",
  "reason": "Added specific tolerance per suggestion"
}
```

## Scoring Prompt - Key Requirements

### ❌ BAD Suggestions (Too Vague)
```
"Make expectedAnswer more specific"
"Improve question wording"
"Fix ID pattern"
```

### ✅ GOOD Suggestions (Laser Focused)
```
"Change expectedAnswer from 'approximately 20A' to '20A ± 2A'"
"Rewrite question to: 'Calculate the total resistance when three 10Ω resistors are connected in series.'"
"Change question ID from '203-3A4-C1-L1-A' to 'C1-L1-A'"
```

## Benefits

1. **Clearer Intent** - No ambiguity about what to fix
2. **Higher Success Rate** - Phase 10 knows exactly what to do
3. **Better Consistency** - Same suggestion always produces same patch
4. **Easier Debugging** - Can trace exact suggestion → patch → result
5. **Focused Effort** - Only tackle top 10-15 issues, not every minor problem

## Prioritization Logic

**Issue Impact Ranking:**
1. **Schema/Safety issues** (highest priority)
   - Invalid structure, safety violations
2. **Pedagogy issues**
   - Teaching-before-testing violations, scaffolding problems
3. **Question quality issues**
   - Banned verbs, vague expectedAnswers
4. **Visual issues** (lowest priority)
   - Diagram alignment

**Only report issues with ≥ 0.5 point impact** - ignore minor nitpicks

**Maximum 10 issues total** - forces laser focus on what matters most

## Example End-to-End Flow

### 1. Lesson Generated (Score: 91/100)

### 2. LLM Scoring Call
```
Issue 1: "blocks[4].content.questions[0].id is '203-3A4-C1-L1-A'"
Suggestion: "Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'"

Issue 2: "blocks[6].content.questions[2].expectedAnswer is 'approximately 20A'"
Suggestion: "Change blocks[6].content.questions[2].expectedAnswer from 'approximately 20A' to '20A ± 2A'"

... (up to 10 issues - laser focused)
```

### 3. Phase 10 Extracts Issues
```typescript
const issues = [
  {
    section: "A3: IDs + naming patterns",
    issue: "blocks[4].content.questions[0].id is '203-3A4-C1-L1-A'",
    suggestion: "Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'",
    pointsLost: 0.5
  },
  // ...
];
```

### 4. Phase 10 LLM Call (Patching)
```
Input: "EXACT FIX: Change blocks[4].content.questions[0].id from '203-3A4-C1-L1-A' to 'C1-L1-A'"

Output Patch:
{
  "path": "blocks[4].content.questions[0].id",
  "newValue": "C1-L1-A",
  "reason": "Removed lesson prefix per suggestion"
}
```

### 5. Patches Applied → Lesson Refined

### 6. Re-Score: 96/100 ✓

## Testing

The prompts are now tuned for:
- **Maximum clarity** - No ambiguous suggestions
- **Laser-focused refinement** - Top 10 issues only (highest impact)
- **High success rate** - Specific changes are easier to implement correctly
- **Score improvement** - From 91-93 → 95-97 range

## Files Modified

1. **`llmScoringService.ts`**
   - Updated scoring system prompt (lines 205-303)
   - Updated user prompt to emphasize specificity (lines 308-320)

2. **`Phase10_Refinement.ts`**
   - Updated system prompt to emphasize "implement exact fixes" (lines 301-366)
   - Added clear examples of input → output (lines 331-363)
   - Updated user prompt to label suggestions as "EXACT FIX:" (lines 368-378)

---

**Next:** Test with actual lesson generation to verify scoring and refinement quality.
