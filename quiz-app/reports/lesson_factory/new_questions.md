# New Question Structure Implementation - Progress & Next Steps

**Date Created:** 2026-01-21  
**Status:** ✅ 12 of 12 lessons completed (100%)

---

## 📋 What Was Changed

### Overview
We updated all lessons to use the new progressive depth-of-processing question structure to reduce student discouragement:

**OLD Structure (being removed):**
- Question 1: Level 2 (Connection)
- Question 2: Level 3 (Synthesis)
- Question 3: Level 4 (Hypothesis)

**NEW Structure (implementing):**
- Question 1: Level 1 (Recall) - simple fact
- Question 2: Level 1 (Recall) - builds on Q1
- Question 3: Level 1 (Recall) - builds on Q2
- Question 4: Level 2 (Connection) - relates Q1, Q2, Q3

**PLUS:**
- One integrative question at end of lesson (before spaced review)
- Mode: `'integrative'` with cognitive level `'synthesis'`
- Title: "Putting It All Together"

### Cognitive Levels Updated
- ✅ `'recall'` - Level 1 (NEW)
- ✅ `'connection'` - Level 2
- ✅ `'synthesis'` - Level 3
- ❌ `'hypothesis'` - Level 4 (REMOVED)

---

## ✅ ALL LESSONS COMPLETED! (12 of 12)

| Lesson | File | Checks Updated | Integrative Added | Status |
|--------|------|----------------|-------------------|---------|
| 202-1A | electrical-quantities-units.json | 2 → 2 | ✅ | ✅ DONE |
| 202-2A | ohms-law.json | 1 → 1 | ✅ | ✅ DONE |
| 202-3A | series-circuits.json | 1 → 1 | ✅ | ✅ DONE |
| 202-4A | series-circuits-extended.json | 1 → 1 | ✅ | ✅ DONE |
| 202-5A | power-energy.json | 2 → 2 | ✅ | ✅ DONE |
| 202-7A | ac-principles.json | 3 → 3 | ✅ | ✅ DONE |
| 202-6A | magnetism-electromagnetism.json | 3 → 3 | ✅ | ✅ DONE |
| 202-7B | how-ac-is-generated.json | 2 → 2 | ✅ | ✅ DONE |
| 202-7C | sine-wave-vocab.json | 3 → 3 | ✅ | ✅ DONE |
| 202-7D | transformers.json | 3 → 3 | ✅ | ✅ DONE |
| 203-1A | types-of-cables.json | 2 → 2 | ✅ | ✅ DONE |
| 201-1A | health-safety-legislation.json | 4 → 4 | ✅ | ✅ DONE |

**All verified with no linting errors.**

---

## 🎉 PROJECT COMPLETE!

---

## 🔧 How to Complete Remaining Lessons

### Step 1: Find Understanding Check Blocks

Search for old structure:
```bash
grep -n "cognitiveLevel.*hypothesis" quiz-app/src/data/lessons/[FILENAME].json
```

Or search for:
```bash
grep -n "Check Your Understanding" quiz-app/src/data/lessons/[FILENAME].json
```

### Step 2: For Each Understanding Check Block

**BEFORE (Old Structure - 3 questions):**
```json
{
  "title": "Check Your Understanding: [Topic]",
  "mode": "conceptual",
  "sequential": true,
  "questions": [
    {
      "questionText": "[Complex connection question]",
      "cognitiveLevel": "connection",
      "id": "XXX-C1-L2",
      "answerType": "short-text"
    },
    {
      "questionText": "[Synthesis question]",
      "cognitiveLevel": "synthesis",
      "id": "XXX-C1-L3",
      "answerType": "short-text"
    },
    {
      "questionText": "[Hypothesis question]",
      "cognitiveLevel": "hypothesis",
      "id": "XXX-C1-L4",
      "answerType": "short-text"
    }
  ]
}
```

**AFTER (New Structure - 4 questions):**
```json
{
  "title": "Check Your Understanding: [Topic]",
  "mode": "conceptual",
  "sequential": true,
  "questions": [
    {
      "id": "XXX-C1-L1-A",
      "questionText": "[Simple factual recall question]",
      "answerType": "short-text",
      "cognitiveLevel": "recall",
      "expectedAnswer": "[Simple answer]",
      "hint": "[Gentle hint]"
    },
    {
      "id": "XXX-C1-L1-B",
      "questionText": "[Another simple fact, building on first]",
      "answerType": "short-text",
      "cognitiveLevel": "recall",
      "expectedAnswer": "[Another fact]",
      "hint": "[Hint]"
    },
    {
      "id": "XXX-C1-L1-C",
      "questionText": "[Third simple fact]",
      "answerType": "short-text",
      "cognitiveLevel": "recall",
      "expectedAnswer": "[Third fact]",
      "hint": "[Hint]"
    },
    {
      "id": "XXX-C1-L2",
      "questionText": "[Connection question: How do Q1, Q2, Q3 relate?]",
      "answerType": "short-text",
      "cognitiveLevel": "connection",
      "expectedAnswer": "[Answer showing relationships]",
      "hint": "[Hint about connections]"
    }
  ]
}
```

**Key Changes:**
1. Change 3 questions → 4 questions
2. Questions 1-3: Change to `cognitiveLevel: "recall"` with simple factual questions
3. Question 4: Keep as `cognitiveLevel: "connection"` but make it relate all three facts
4. Update IDs: L1-A, L1-B, L1-C, L2 (remove L3 and L4)
5. Ensure `"sequential": true` is present

### Step 3: Add Integrative Question (End of Lesson)

Find the spaced review block (usually order 8, 9, or 10) and add BEFORE it:

```json
{
  "id": "XXX-integrative",
  "type": "practice",
  "order": 9.5,  // or 7.5 or 8.5 - just before spaced review
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "questions": [
      {
        "id": "XXX-INT-1",
        "questionText": "You've learned about [concept A], [concept B], and [concept C]. Explain: Why [big picture question]? How [practical application]? (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "[Comprehensive answer integrating all lesson concepts]",
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}
```

**Integrative Question Tips:**
- Tie together ALL major concepts from the lesson
- Ask for 3-4 sentences explicitly
- Focus on "why it matters" and practical applications
- Use cognitive level: `"synthesis"`
- Use mode: `"integrative"` (this gives special blue badge styling)

### Step 4: Verify No Errors

After updating each lesson:
```bash
# Check for linting errors
npm run lint quiz-app/src/data/lessons/[FILENAME].json

# Or in Cursor/VSCode, just check the Problems panel
```

---

## 📝 REAL EXAMPLES FROM COMPLETED LESSONS

### Example 1: 202-1A (Electrical Quantities)

**OLD Check 1:**
```json
"questions": [
  {
    "questionText": "Using the water analogy provided in the text, how does the relationship between voltage and current work in an electrical circuit?",
    "cognitiveLevel": "connection",
    "id": "202-1A-C1-L2"
  },
  {
    "questionText": "Why does a material with high resistance, such as rubber, affect the amount of power an electrical device can use?",
    "cognitiveLevel": "synthesis",
    "id": "202-1A-C1-L3"
  },
  {
    "questionText": "What would happen to the current flow in a circuit if the voltage was completely removed...",
    "cognitiveLevel": "hypothesis",
    "id": "202-1A-C1-L4"
  }
]
```

**NEW Check 1:**
```json
"questions": [
  {
    "id": "202-1A-C1-L1-A",
    "questionText": "What is current and what is its SI unit?",
    "answerType": "short-text",
    "cognitiveLevel": "recall",
    "expectedAnswer": "Current is the rate of flow of electric charge, measured in amperes (A)",
    "hint": "Think about what 'I' represents and its unit."
  },
  {
    "id": "202-1A-C1-L1-B",
    "questionText": "What is voltage and what is its SI unit?",
    "answerType": "short-text",
    "cognitiveLevel": "recall",
    "expectedAnswer": "Voltage is electrical potential difference or 'push', measured in volts (V)",
    "hint": "What quantity provides the electrical 'pressure'?"
  },
  {
    "id": "202-1A-C1-L1-C",
    "questionText": "What is resistance and what is its SI unit?",
    "answerType": "short-text",
    "cognitiveLevel": "recall",
    "expectedAnswer": "Resistance is the opposition to current flow, measured in ohms (Ω)",
    "hint": "What quantity opposes the flow of electricity?"
  },
  {
    "id": "202-1A-C1-L2",
    "questionText": "How do these three quantities (voltage, current, and resistance) work together in an electrical circuit using the water analogy?",
    "answerType": "short-text",
    "cognitiveLevel": "connection",
    "expectedAnswer": "Voltage acts as the electrical pressure that pushes current (the flow of charge) through the circuit. Resistance opposes this flow - like friction in a pipe. Higher voltage increases flow, while higher resistance decreases it.",
    "hint": "Think about pressure, flow rate, and what slows down the flow."
  }
]
```

**NEW Integrative (added at end):**
```json
{
  "id": "202-1A-integrative",
  "type": "practice",
  "order": 8.5,
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "questions": [
      {
        "id": "202-1A-INT-1",
        "questionText": "You've learned about the four fundamental quantities (current, voltage, resistance, power) and unit prefixes (kilo, milli, micro). Explain: Why is it important for an electrician to understand both the quantities AND the prefixes when working with electrical values? Give practical examples. (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "Understanding the quantities helps electricians know what they're measuring - current flow, electrical pressure, opposition, or energy rate. Understanding prefixes allows them to work with real-world values efficiently, converting between units like 0.005 A to 5 mA or 2,500 Ω to 2.5 kΩ. Together, this knowledge enables clear communication, accurate calculations, and proper equipment selection. Without both, an electrician might misread values or make calculation errors that could affect safety or system performance.",
        "hint": "Think about measurement, communication, calculations, and real-world applications."
      }
    ]
  }
}
```

### Example 2: 202-7A (AC Principles) 

See this file for another complete example with 3 understanding checks updated.

---

## 🎯 QUICK CHECKLIST FOR EACH LESSON

For each lesson file:

- [ ] Find all "Check Your Understanding" blocks (search for `"Check Your Understanding"`)
- [ ] For EACH check block found:
  - [ ] Replace 3 old questions with 4 new questions
  - [ ] Questions 1-3: Simple recall (`cognitiveLevel: "recall"`)
  - [ ] Question 4: Connection (`cognitiveLevel: "connection"`)
  - [ ] Update IDs: L1-A, L1-B, L1-C, L2
  - [ ] Ensure hints are helpful but not solving
- [ ] Add ONE integrative question before spaced review:
  - [ ] Order: X.5 (just before spaced review)
  - [ ] Mode: `"integrative"`
  - [ ] Cognitive level: `"synthesis"`
  - [ ] Asks for 3-4 sentences
  - [ ] Ties together all major lesson concepts
- [ ] Run linter to verify no errors
- [ ] Mark lesson as DONE in this document

---

## 🚀 STARTING A NEW SESSION

### 1. Check Current State
```bash
cd quiz-app
grep -l "hypothesis" src/data/lessons/*.json
```

This will list all files still needing updates.

### 2. Pick Next Lesson
Start with: `202-6A-magnetism-electromagnetism.json`

### 3. Follow Process Above
- Update understanding checks (3 → 4 questions, L2/L3/L4 → L1/L1/L1/L2)
- Add integrative question at end
- Verify with linter

### 4. Update This Document
Mark completed lessons in the tables above.

---

## 📚 RELATED DOCUMENTATION

All documentation has been updated to reflect the new structure:

- ✅ `Deeper_questions.md` - Full specification of new structure
- ✅ `lesson_factory.md` - Master template guide
- ✅ `how_to_fill_in_layout.md` - Comprehensive content guide  
- ✅ `LESSON_PRODUCTION_WORKFLOW.md` - Production process
- ✅ `INTERNAL_SPEC_TEMPLATE.md` - Planning template
- ✅ `QUICK_START.md` - Quick reference
- ✅ `supplementary_lessons.md` - Supplementary content guide

---

## ⚠️ IMPORTANT NOTES

1. **Don't edit 202-7A** - Already completed earlier
2. **Sequential must be true** - Ensures questions unlock in order
3. **IDs must be unique** - Format: `LESSON-C#-L#-[A/B/C]` or `LESSON-INT-1`
4. **Integrative goes BEFORE spaced review** - Check order numbers carefully
5. **Mode matters** - `"conceptual"` for checks, `"integrative"` for final question
6. **Read the explanation first** - Make recall questions match what was just taught

---

## 🎨 STYLING INFO (FYI)

The PracticeBlock component automatically handles styling:
- **Conceptual mode** (purple badge): "📖 Check Your Understanding"
- **Integrative mode** (blue badge): "🏆 Putting It All Together"
- Sequential locking: Q2 unlocks after Q1 answered, etc.

No code changes needed - just use the correct `mode` field.

---

## ✅ WHEN ALL DONE

After completing all 6 remaining lessons:

1. Run full linter check:
```bash
cd quiz-app
npm run lint
```

2. Test 2-3 lessons in browser to verify:
   - Understanding checks show purple badges
   - Questions unlock sequentially
   - Integrative question shows blue badge
   - No errors in console

3. Commit all changes:
```bash
git add quiz-app/src/data/lessons/
git commit -m "feat: Update all lessons to new question structure (3xL1+1xL2)"
```

---

**Last Updated:** 2026-01-21  
**Completed By:** AI Assistant  
**Next Session:** Continue with 202-6A-magnetism-electromagnetism.json
