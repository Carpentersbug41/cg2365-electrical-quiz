# Guided Practice Must Mirror Workflow Steps — Content Standard

**Project:** C&G 2365 Level 2 Learning Module  
**Component:** Guided Practice blocks (We Do)  
**Applies to:** NEW lessons only (do not modify existing lessons)  
**Status:** Content standard (must-follow for workflow-based lessons)

---

## 1) The Rule (Core Principle)

When a lesson's worked example demonstrates a **repeatable workplace procedure**, the **Guided Practice must include prompts that cover all workflow steps**.

**Why this matters:** Guided Practice is not "extra questions." It is **muscle-memory training** for the procedure. Students must rehearse the complete workflow to develop reliable workplace habits.

---

## 2) When This Rule Applies (Scope)

### Apply This Standard When:

A lesson meets **ALL** of these criteria:

1. **Has a worked example** with explicit numbered steps (3-9 steps)
2. **Demonstrates a repeatable workplace procedure** that students will use across multiple scenarios (e.g., BS 7671 lookup, safe isolation, fault-finding, circuit testing)
3. **Procedure is decision-based** (not just conceptual explanation or single-use calculation)

**Examples of workflows requiring this standard:**
- BS 7671 lookup procedure (6 steps: state question → choose document → find location → extract rule → record proof → escalate conditions)
- Safe isolation procedure (7 steps)
- Dead testing routine (5 steps: confirm dead state → select instrument → check leads → null/zero → test and record)
- Fault-finding sequence (diagnostic steps)
- Circuit selection workflow (requirement → calculation → verification → recording)

### Do NOT Apply This Standard When:

- **Conceptual-only lessons**: Explaining what transformers are, how magnetism works (no workflow to mirror)
- **Pure calculation lessons**: Mathematical method demonstrations without workplace procedure context
- **Workflows with 10+ steps**: Too long for effective guided practice (see handling guidance below)
- **One-off explanations**: Single specific scenario with no repeatable procedure

---

## 3) Implementation Standard: Minimum 80% Coverage

### The 80% Threshold Rule

**Guided Practice prompts must cover at minimum 80% of the workflow steps.**

**Formula:**
```
Minimum required prompts = ROUNDUP(workflow_steps × 0.80)
```

**Examples:**
- 6-step workflow → minimum 5 prompts (6 × 0.80 = 4.8 → rounds to 5)
- 5-step workflow → minimum 4 prompts (5 × 0.80 = 4.0)
- 4-step workflow → minimum 4 prompts (4 × 0.80 = 3.2 → rounds to 4)
- 3-step workflow → minimum 3 prompts (3 × 0.80 = 2.4 → rounds to 3)

**Why 80% instead of 100%?** Allows sensible grouping of consecutive micro-steps while preventing over-condensation that loses the procedural training value.

---

## 4) Step Grouping Guidelines (When You Can Combine Steps)

### Prefer 1:1 Mapping (Default)

Default approach: Each workflow step gets one Guided Practice prompt.

**Example (6-step workflow → 6 prompts):**

Workflow:
1. State the question
2. Choose the document
3. Find location using index
4. Extract the rule
5. Record proof (document + reg number)
6. Check escalation conditions

Guided Practice:
1. Prompt: "What is the exact question you need to answer?"
2. Prompt: "Which document do you start with and why?"
3. Prompt: "What keyword would you use in the index?"
4. Prompt: "What type of rule are you extracting?"
5. Prompt: "What will you write in your notes to prove due diligence?"
6. Prompt: "What condition would make you escalate to BS 7671?"

### Allow Step Grouping Only When:

You may combine **consecutive micro-steps** into one prompt if:

1. **They form one logical decision** (e.g., "Open document + find index + look up keyword" = one navigation action)
2. **The combined prompt still trains the decision skill** (doesn't skip critical thinking)
3. **You stay above the 80% threshold** (never go below minimum required prompts)

**Example of acceptable grouping (6 steps → 5 prompts):**

Workflow steps 3-4 can combine if they're micro-actions:
- Step 3: "Find the index"
- Step 4: "Look up keyword"

Combined prompt: "How would you navigate to the regulation using the index?"

**Still meets 80% threshold:** 6 steps × 0.80 = 5 prompts required ✓

### Never Skip These Steps:

Even with grouping, these workflow elements MUST have dedicated prompts:

- **Step 1 (State the question)**: Trains problem identification
- **Recording step**: Trains documentation habits (critical for due diligence)
- **Final escalation/check conditions step**: Trains professional judgment and safety awareness

---

## 5) What We Mean by "Workflow" (Definition)

A **workflow** is a **repeatable decision process** students should use on real jobs.

**Key characteristics:**
- Has 3-9 distinct decision points
- Same sequence applies to different scenarios
- Trains professional habits (not just knowledge recall)
- Includes recording/documentation step
- Includes safety check or escalation consideration

**Not a workflow:**
- Single worked calculation example (unless it's part of a selection procedure)
- Conceptual explanation with examples
- Historical or background information

---

## 6) Why This Matters (Pedagogical Rationale)

### A) Trains Procedural Memory, Not Just "Knowing"

Students don't fail on-site because they "forgot a definition."

They fail because they **skip steps**:
- Don't check the right book
- Don't locate the correct section
- Don't record evidence
- Don't escalate when conditions are unusual

Mirroring the workflow forces the brain to learn the **sequence** as a routine.

### B) Reduces "Random Guessing" and Builds Dependable Method

When Guided Practice is shorter than the workflow (e.g., only 3 prompts for a 6-step procedure), students learn an incomplete version — they fill gaps with guessing.

Full workflow coverage prevents the "I'll just wing it" pattern and trains:
- Decision discipline
- Evidence-based working
- Documentation habits

### C) Makes Assessment and Feedback Clearer

If guided steps match the workflow:
- Marking detects exactly which step the student is missing
- Feedback can be step-specific ("You skipped Step 5: record proof")
- Progress is measurable (students improve at Step 2, Step 4, etc.)

### D) Protects Scope: Guided Practice Stays Tight and Aligned

When mirroring the workflow, Guided Practice stays focused on the lesson objective and doesn't become a mini-lecture or random question set.

### E) Creates Transfer: Same Method Works on New Scenarios

The point of a workflow is transfer:
- Garage socket → outdoor socket → shed supply → special location

If Guided Practice trains the workflow sequence, students apply it anywhere.

---

## 7) Implementation Format (How to Write Guided Practice)

### Block Structure

```json
{
  "id": "[LESSON-ID]-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice: [Workflow Name]",
    "problem": "[One workplace scenario different from worked example]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Matches workflow Step 1]",
        "expectedAnswer": ["[answer1]", "[variation2]"],
        "hint": "[Helpful hint if stuck]"
      },
      {
        "stepNumber": 2,
        "prompt": "[Matches workflow Step 2]",
        "expectedAnswer": ["[answer]"],
        "hint": "[Hint]"
      }
      // ... continue until 80%+ coverage achieved
    ]
  }
}
```

### Prompt Style Rules

- Each prompt should be answerable in **one short response**
- Keep language **job-real** (workplace context)
- Avoid introducing new content that wasn't taught
- Use the workflow verbs from the worked example:
  - "State…"
  - "Choose…"
  - "Find…"
  - "Extract…"
  - "Record…"
  - "Escalate/Check…"

---

## 8) Complete Example: 6-Step Workflow → 6 Guided Practice Prompts

### Worked Example (from lesson):

**Title:** Worked Example: The BS 7671 Lookup Workflow

**Given:** You need to check if a new socket in a domestic garage requires RCD protection.

**Steps:**
1. State the question: Does a garage socket need 30mA RCD protection?
2. Choose document: Start with the OSG as it is a common domestic scenario.
3. Find location: Use the Index or Contents under 'RCD' or 'Socket-outlets'.
4. Extract the rule: The rule generally states all general-purpose sockets up to 32A need RCD protection.
5. Record proof: Note '30mA RCD installed for garage socket as per BS 7671 Reg 411.3.3'.
6. Safety check: If the garage has unusual damp conditions, consult Guidance Note 7 (Special Locations).

### Guided Practice (mirroring the 6 steps):

**Title:** Guided Practice: Run the Lookup Workflow

**Problem:** A customer asks if plastic conduit can be used to protect cables in an office. You need to check the identification requirements.

**Steps:**

```json
"steps": [
  {
    "stepNumber": 1,
    "prompt": "What is the exact question you need to answer about the conduit?",
    "expectedAnswer": [
      "Can plastic conduit be used for cable protection in an office?",
      "What are the identification requirements for cables in plastic conduit?"
    ],
    "hint": "State the specific technical question the customer is asking."
  },
  {
    "stepNumber": 2,
    "prompt": "Which document should you start with for this common commercial scenario?",
    "expectedAnswer": ["OSG", "On-Site Guide"],
    "hint": "For common scenarios, which book gives quick guidance?"
  },
  {
    "stepNumber": 3,
    "prompt": "What keyword(s) would you use in the index/contents to find the relevant section?",
    "expectedAnswer": [
      "Conduit",
      "Cable protection",
      "Identification",
      "Conduit and identification"
    ],
    "hint": "Think about the main technical terms in your question."
  },
  {
    "stepNumber": 4,
    "prompt": "What type of requirement are you looking for? (e.g., protection requirement, identification requirement, installation method)",
    "expectedAnswer": [
      "Identification requirement",
      "Cable identification and protection requirements"
    ],
    "hint": "The customer is asking about what's allowed and how to identify it."
  },
  {
    "stepNumber": 5,
    "prompt": "What will you write in your job notes to prove you checked the regulations?",
    "expectedAnswer": [
      "Document name and regulation number with decision",
      "BS 7671 Reg [number] - plastic conduit acceptable with proper identification",
      "Checked OSG/BS 7671 Reg [number] - complies with identification requirements"
    ],
    "hint": "Record: document + reg number + your decision."
  },
  {
    "stepNumber": 6,
    "prompt": "What environmental condition would make you escalate from OSG to BS 7671 or Guidance Notes?",
    "expectedAnswer": [
      "Special location (bathroom, swimming pool)",
      "High risk environment",
      "Unusual environmental conditions",
      "If office has special electrical hazards"
    ],
    "hint": "When would a 'common scenario' become non-standard?"
  }
]
```

**Coverage check:** 6 workflow steps → 6 prompts = 100% coverage ✓

---

## 9) Handling Edge Cases

### Workflows with 10+ Steps

**Problem:** Guided Practice becomes too long and loses effectiveness.

**Solution:** Group related steps into logical phases:

**Example:** 12-step safe isolation procedure
- Group into 4 phases: Preparation (steps 1-3), Isolation (steps 4-6), Verification (steps 7-9), Securing (steps 10-12)
- Create 6-8 prompts covering key decision points from each phase
- Still train the complete procedure but at a higher abstraction level

**Verify:** Document why grouping was necessary and that all critical decisions are covered.

### Workflows with Optional/Conditional Steps

**Problem:** Some procedures have "if X then do Y" branches.

**Solution:** 
- Count the main path steps for the 80% calculation
- Include one prompt that addresses the conditional logic
- Example prompt: "Under what condition would you skip Step 4 and go directly to Step 6?"

### Mixed Lessons (Conceptual + Workflow)

**Problem:** Lesson teaches concepts AND a workflow.

**Solution:**
- If the workflow is central to the lesson objective → apply this standard
- If the workflow is supplementary/example only → use regular guided practice (2-3 conceptual questions)

---

## 10) Quality Checklist (Pass/Fail)

A Guided Practice block for a workflow-based lesson **passes** only if:

- [ ] **Coverage:** Number of prompts ≥ 80% of workflow steps (use formula above)
- [ ] **Sequence:** Prompts follow the same order as workflow steps
- [ ] **Language:** Prompts use the workflow verbs and are job-real
- [ ] **Recording step:** At least one prompt forces student to practice documentation/proof habit
- [ ] **Final check:** Last prompt (or one prompt) includes escalation/safety check/condition awareness
- [ ] **Scenario:** Problem is different from worked example but uses same workflow
- [ ] **Answer variations:** expectedAnswer arrays include reasonable variations
- [ ] **No new content:** Prompts don't introduce material not taught in the lesson

**If any box fails → rewrite the Guided Practice.**

---

## 11) Relationship to Other Question Types

This standard is about **Guided Practice** specifically, but it supports your broader design:

| Block Type | Purpose | Cognitive Focus | When Used |
|------------|---------|-----------------|-----------|
| **Understanding Check** (after explanation) | Reinforce concepts immediately | 3×Recall + 1×Connection | After each major explanation |
| **Guided Practice** (after worked example) | Train the method/procedure | Procedural habit formation | After worked example of workflow |
| **Practice** ("You Do") | Independent application | Apply without scaffolding | After guided practice |
| **Integrative** (end of lesson) | Big picture synthesis | 1×Connection + 1×Synthesis | End of lesson (order 9.5) |

**Key distinction:**
- **Guided Practice** = Trains procedural routine (workflow steps)
- **Integrative Questions** = Trains conceptual integration (connection → synthesis)

Both are needed for complete learning.

---

## 12) Notes for Lesson Authors

### When Planning a New Lesson:

1. **Identify if there's a workflow:**
   - Does the worked example show a repeatable procedure?
   - Would students use this same sequence on different jobs?

2. **Count the workflow steps:**
   - Explicitly number the steps in your worked example
   - Calculate minimum required Guided Practice prompts (steps × 0.80, round up)

3. **Draft Guided Practice to mirror:**
   - Start with 1:1 mapping (one prompt per step)
   - Only group steps if you can justify it AND stay above 80%
   - Never skip the recording step or final safety/escalation check

4. **Verify coverage:**
   - Use the quality checklist (Section 10)
   - If it fails, expand the Guided Practice before moving forward

### When Reviewing an AI-Generated Lesson:

AI may under-generate Guided Practice prompts. Always check:
- Does this lesson teach a workflow?
- If yes, does Guided Practice have 80%+ coverage?
- If no, request regeneration with explicit step count

---

## 13) Status Note: NEW Lessons Only

**IMPORTANT:** This standard applies to **new lessons created from this point forward**.

**Do NOT:**
- Retroactively modify existing lessons to fit this standard
- Apply this to lessons already in production
- Use this as a reason to refactor working content

**Rationale:** 
- Existing lessons may have different instructional design decisions
- Retroactive changes risk introducing inconsistencies
- Focus is on improving new content quality going forward

---

## 14) Related Documentation

- [Lesson Factory Master Template](./lesson_factory.md) - Block types and structure
- [Lesson Production Workflow](./LESSON_PRODUCTION_WORKFLOW.md) - AI-driven generation process
- [Internal Spec Template](./INTERNAL_SPEC_TEMPLATE.md) - Planning checklist

---

**End of Standard**

**Version:** 1.0  
**Created:** 2026-01-29  
**Last Updated:** 2026-01-29  
**Author:** C&G 2365 Learning Team
