# How to Fill In Lesson Layouts: Complete Guide

**A comprehensive step-by-step guide for creating lesson content - no prior knowledge required**

---

## 📖 Table of Contents

1. [Introduction: What Are Lesson Layouts?](#introduction)
2. [Understanding the Two Main Layouts](#layouts)
3. [Lesson Structure Overview](#structure)
4. [Block-by-Block Guide](#blocks)
5. [Complete Walkthrough Examples](#examples)
6. [Common Mistakes & How to Avoid Them](#mistakes)
7. [Quality Checklist](#checklist)
8. [Quick Reference Templates](#reference)

---

<a name="introduction"></a>
## 🎯 Introduction: What Are Lesson Layouts?

### What This Guide Is For

This guide teaches you how to create **lesson content** for the C&G 2365 electrical training system. You'll learn to fill in structured lesson templates that guide students through learning new electrical concepts.

**No technical background required** - this guide assumes you're starting from zero.

### What You'll Be Creating

Each lesson you create will include:

1. **Learning objectives** - What students will be able to do
2. **Vocabulary** - Key terms students need to know
3. **Explanations** - Clear teaching of concepts
4. **Examples** - Worked demonstrations
5. **Practice** - Questions for students to try
6. **Review** - Reinforcement of earlier material

### Why Structure Matters

All lessons follow the same structure so students know what to expect. This consistency helps learning because students can focus on the **content** rather than figuring out **how the lesson works**.

---

<a name="layouts"></a>
## 🎨 Understanding the Two Main Layouts

There are **two layout types** to choose from. The layout determines how content appears on screen.

### Layout A: Split-Vis (Split Visual)

**When to use:** Lessons with **diagrams that students need to see while reading**

```
┌─────────────────────────────────┐
│  Desktop View:                  │
│  ┌──────────┬──────────────┐   │
│  │          │              │   │
│  │ DIAGRAM  │  EXPLANATION │   │
│  │ (stays   │  (scrolls)   │   │
│  │  fixed)  │              │   │
│  │          │              │   │
│  └──────────┴──────────────┘   │
└─────────────────────────────────┘
```

**Best for:**
- Circuit diagrams
- Component layouts
- Spatial relationships
- Anything where the image needs to stay visible

**Real examples:**
- Series circuits (students need to see the circuit while reading about current flow)
- Parallel circuits (diagram shows the branches)
- Wiring layouts (spatial understanding is key)

---

### Layout B: Linear-Flow

**When to use:** Lessons that are **text-heavy** without essential diagrams

```
┌─────────────────────────────────┐
│  Desktop View:                  │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │      CONTENT             │  │
│  │      (single column,     │  │
│  │       scrolls)           │  │
│  │                          │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

**Best for:**
- Formulas and calculations
- Definitions and theory
- Safety regulations
- Step-by-step procedures
- Lists and sequential information

**Real examples:**
- Ohm's Law calculations
- Health & Safety regulations
- Electrical quantities and units
- PPE requirements

---

### Decision Guide: Which Layout?

Ask yourself: **"Does the student need to look at a diagram while reading the explanation?"**

| Answer | Choose | Why |
|--------|--------|-----|
| **YES** - The diagram is essential reference | **Split-Vis** | Diagram stays visible, student can refer to it constantly |
| **NO** - The content is primarily text/formulas | **Linear-Flow** | Clean reading experience, no wasted screen space |
| **MAYBE** - Diagram is helpful but not essential | **Linear-Flow** | Images can be included inline in the explanation |

---

<a name="structure"></a>
## 🏗️ Lesson Structure Overview

Every lesson contains **8-10 blocks** in this order:

```
1. Outcomes Block           → "By the end, you'll be able to..."
2. Vocab Block              → "Key terms you'll learn"
3. Diagram Block*           → Visual representation (if needed)
4. Explanation Block        → "Here's how it works..."
   4.5. Understanding Check → 4 questions (3×L1 Recall + 1×L2 Connection)
5. Worked Example           → "Watch me do one..."
6. Guided Practice          → "Let's do one together..."
7. Practice Block           → "Now you try..."
   7.5/9.5. Integrative Qs  → "Big picture questions" (1×L2 Connection + 1×L3 Synthesis)
8. Spaced Review            → "Let's revisit earlier topics..."

* Diagram block is required for Split-Vis, optional for Linear-Flow
```

This follows the **"I Do, We Do, You Do"** teaching method with **progressive depth**:
- **I Do** (Teacher shows): Explanation + Worked Example
- **Check Understanding**: 3 simple recall questions + 1 connection question after explanations
- **We Do** (Together): Guided Practice
- **You Do** (Student alone): Practice Block
- **Integrate**: One deeper question tying everything together at the end

---

<a name="blocks"></a>
## 📦 Block-by-Block Guide

Now let's learn how to fill in each block type with detailed instructions and examples.

---

### Block 1: Outcomes Block

**Purpose:** Tell students what they'll be able to do by the end of the lesson

#### What to Include

You need **3-4 learning outcomes** that are:
- **Specific** - Clear about what students will do
- **Measurable** - You can test if they achieved it
- **Leveled** - Use appropriate action verbs

#### The Three Levels (Bloom's Taxonomy Simplified)

| Level | What It Means | Action Verbs | Example |
|-------|---------------|--------------|---------|
| **Remember** | Recall facts | List, name, define, state, identify | "Define what voltage means" |
| **Understand** | Explain concepts | Explain, describe, summarize, compare | "Explain why current is the same in series circuits" |
| **Apply** | Use knowledge | Calculate, solve, apply, demonstrate | "Calculate total resistance using the series rule" |

#### Template

```json
{
  "id": "202-4A-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      {
        "text": "[Action verb] + [what students will do]",
        "bloomLevel": "remember"
      },
      {
        "text": "[Action verb] + [what students will do]",
        "bloomLevel": "understand"
      },
      {
        "text": "[Action verb] + [what students will do]",
        "bloomLevel": "apply"
      }
    ]
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      {
        "text": "State the three series circuit rules for current, voltage, and resistance",
        "bloomLevel": "remember"
      },
      {
        "text": "Explain why current is the same everywhere in a series circuit",
        "bloomLevel": "understand"
      },
      {
        "text": "Calculate total resistance, voltage drops, and current in series circuits",
        "bloomLevel": "apply"
      }
    ]
  }
}
```

#### Tips for Writing Good Outcomes

✅ **DO:**
- Start with action verbs (see table above)
- Be specific about what students will do
- Make them testable (you can create a quiz question for each)
- Progress from simple to complex

❌ **DON'T:**
- Use vague verbs like "understand," "know," "learn" (these aren't measurable)
- Make them too broad ("Understand electricity")
- Make them too narrow ("Memorize the formula V=IR")
- Include more than one skill per outcome

---

### Block 2: Vocab Block

**Purpose:** Define 3-6 key technical terms students will encounter

#### What to Include

Choose terms that:
- **Are essential** to understanding the lesson
- **Appear multiple times** in the content
- **Students may not know** from previous lessons
- **Are technical/specific** to this topic

#### How Many Terms?

- **Minimum:** 3 terms
- **Ideal:** 4-5 terms
- **Maximum:** 6 terms (more gets overwhelming)

#### Template

```json
{
  "id": "202-4A-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      {
        "term": "[Technical Term]",
        "definition": "[Clear, simple definition in one sentence]"
      },
      {
        "term": "[Technical Term]",
        "definition": "[Clear, simple definition in one sentence]"
      }
    ]
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      {
        "term": "Series Circuit",
        "definition": "A circuit where components are connected end-to-end in a single path with no branches"
      },
      {
        "term": "Total Resistance (R_total)",
        "definition": "The combined resistance of all components in a circuit, measured in Ohms (Ω)"
      },
      {
        "term": "Voltage Drop",
        "definition": "The amount of voltage used up by each component as current flows through it"
      },
      {
        "term": "Single Path",
        "definition": "A circuit configuration where current has only one route to flow through"
      }
    ]
  }
}
```

#### Tips for Writing Good Definitions

✅ **DO:**
- Keep definitions to ONE sentence
- Use simple language students already know
- Include units where relevant (Ω, V, A)
- Explain what it means in practical terms

❌ **DON'T:**
- Use the term in its own definition ("Series means things in series")
- Include formulas in definitions (save for explanation block)
- Use other technical terms they don't know yet
- Make definitions longer than 20-25 words

---

### Block 3: Diagram Block

**Purpose:** Provide visual representation of concepts (Required for Split-Vis, Optional for Linear-Flow)

#### When to Include

- **Always include** if using Split-Vis layout
- **Include** if a diagram significantly aids understanding
- **Skip** if the lesson is purely text/formulas with no visual component

#### What Makes a Good Diagram?

A diagram should:
- **Show the concept** students need to understand
- **Be referenced** in the explanation text
- **Include labels** for key components
- **Be clear and uncluttered**

#### Template

```json
{
  "id": "202-4A-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": "[Short descriptive title]",
    "description": "[What the diagram shows - 1-2 sentences]",
    "videoUrl": "[YouTube URL or leave empty]",
    "diagramType": "[series|parallel|circuit|other]",
    "elementIds": ["element1", "element2", "element3"],
    "placeholderText": "[Text description if diagram fails to load]"
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": "Basic Series Circuit",
    "description": "A simple series circuit showing a battery, switch, and three resistors connected in a single path with no branches",
    "videoUrl": "",
    "diagramType": "series",
    "elementIds": ["battery", "switch", "R1", "R2", "R3"],
    "placeholderText": "A series circuit with a 12V battery connected to three resistors (4Ω, 6Ω, and 2Ω) in a single loop with no branches"
  }
}
```

#### Diagram Types

| Type | Use For | Elements Example |
|------|---------|------------------|
| `series` | Series circuits | battery, resistors in line |
| `parallel` | Parallel circuits | battery, branching paths |
| `circuit` | Mixed/complex circuits | multiple components |
| `other` | Non-circuit diagrams | waveforms, layouts, equipment |

#### Tips for Diagram Block

✅ **DO:**
- Make the title descriptive but short (3-7 words)
- Write placeholderText as if describing it to someone over the phone
- List all major elements in elementIds
- Reference diagram elements in explanation text

❌ **DON'T:**
- Assume diagram is self-explanatory (always include description)
- Skip placeholderText (accessibility requirement)
- Use diagrams with too much detail (keep it focused)

---

### Block 4: Explanation Block

**Purpose:** Teach the core concepts - this is the "teaching" part of the lesson

#### What to Include

The explanation should:
- **Teach the concept** from scratch (assume no prior knowledge except prerequisites)
- **Connect to the diagram** if you have one
- **Break into clear sections** with headings
- **Use analogies** where helpful
- **Include formulas** if relevant

#### Structure Your Explanation

Use this structure:

1. **What it is** (definition in simple terms)
2. **Why it matters** (real-world relevance)
3. **How it works** (the mechanism/process)
4. **Rules or formulas** (if applicable)
5. **Key points summary** (wrap up main ideas)

#### Template

```json
{
  "id": "202-4A-explain-rules",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "[Clear section title - what you're teaching]",
    "content": "[Full explanation with **bold** for emphasis\n\nUse \\n\\n for paragraph breaks\n\nStructure with numbered points or sections]"
  }
}
```

#### Formatting in Explanation Text

- `**text**` - Makes text bold (use for key terms)
- `\n\n` - Creates a paragraph break
- Numbered lists - Use "1. ", "2. ", etc. for steps/rules
- Bullet points - Use "- " or "• " for lists

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-explain-rules",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "The Three Series Circuit Rules",
    "content": "When components are connected in series, they share a **single path** for current to flow. This creates three predictable behaviors that always occur in series circuits.\n\n**Rule 1: Current is the Same Everywhere**\n\nIn a series circuit, the current is identical at every point. Whether you measure before the first resistor, between resistors, or after the last resistor, you'll get the same value.\n\nWhy? Because there's only **one path** for electrons to flow through. Think of it like water in a single pipe - the flow rate is the same everywhere in the pipe because the water has nowhere else to go.\n\nFormula: **I_total = I1 = I2 = I3**\n\n**Rule 2: Voltages Add Up**\n\nThe individual voltage drops across each component add up to equal the supply voltage. Each component \"uses up\" some voltage as current flows through it.\n\nThink of voltage like a budget. If you have £12 to spend and you buy three items, the three prices must add up to £12. Similarly, if you have a 12V battery and three resistors, the voltage drops must add up to 12V.\n\nFormula: **V_total = V1 + V2 + V3**\n\n**Rule 3: Resistances Add Up**\n\nTotal resistance in series is simply the sum of all individual resistances. This makes series calculations straightforward - just add them up.\n\nFormula: **R_total = R1 + R2 + R3**\n\nIf you have a 4Ω resistor, a 6Ω resistor, and a 2Ω resistor in series, the total resistance is 4 + 6 + 2 = 12Ω.\n\n**Why These Rules Matter**\n\nThese three rules allow you to solve any series circuit problem. If you know any two values, you can find the third using Ohm's Law (V = IR) combined with these series rules."
  }
}
```

#### Tips for Writing Explanations

✅ **DO:**
- Start simple, build complexity gradually
- Use real-world analogies (water in pipes, money, traffic)
- Bold key terms and formulas
- Break into clear sections with subheadings
- Explain the "why" not just the "what"
- Connect back to vocabulary terms
- Include practical implications

❌ **DON'T:**
- Assume prior knowledge beyond prerequisites
- Use jargon without explaining it
- Make paragraphs longer than 4-5 sentences
- Skip the reasoning behind rules
- Present formulas without context
- Make it too abstract - keep it practical

#### Length Guidelines

- **Minimum:** 300 words (about 2-3 paragraphs)
- **Ideal:** 400-600 words (comprehensive but focused)
- **Maximum:** 800 words (beyond this, consider splitting into two explanation blocks)

---

### Block 4.5: Understanding Check Block

**Purpose:** Immediate reinforcement after explanation with progressive depth-of-processing questions

**IMPORTANT:** This addresses student discouragement with harder questions early on. We start with simple recall, building confidence before connecting concepts.

#### What to Include

After each major explanation block, add 4 questions:
- **Questions 1-3:** Level 1 (Recall) - Simple factual questions
- **Question 4:** Level 2 (Connection) - Relates questions 1-3

#### Structure: 3×L1 + 1×L2

**Question 1-3 (Level 1 - Recall):**
- Ask simple factual questions
- Test basic memory of what was just explained
- Build foundational knowledge
- Each question builds on the previous one

**Question 4 (Level 2 - Connection):**
- Shows relationships between the three facts
- Asks "how" or "why" questions
- Connects to real applications
- Should relate to questions 1, 2, and 3

#### Template

```json
{
  "id": "202-4A-check-1",
  "type": "practice",
  "order": 4.5,
  "content": {
    "title": "Check Your Understanding: [Topic from Explanation]",
    "mode": "conceptual",
    "sequential": true,
    "questions": [
      {
        "id": "202-4A-C1-L1-A",
        "questionText": "[Simple recall question]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Simple factual answer]",
        "hint": "[Gentle hint]"
      },
      {
        "id": "202-4A-C1-L1-B",
        "questionText": "[Another simple recall, building on first]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Another fact]",
        "hint": "[Hint]"
      },
      {
        "id": "202-4A-C1-L1-C",
        "questionText": "[Third recall question]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Third fact]",
        "hint": "[Hint]"
      },
      {
        "id": "202-4A-C1-L2",
        "questionText": "[Connection question: How do these relate? Why is this important?]",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "[Answer showing relationships]",
        "hint": "[Hint about connections]"
      }
    ]
  }
}
```

#### Real Example: AC vs DC Check

```json
{
  "id": "202-7A-check-1",
  "type": "practice",
  "order": 4.5,
  "content": {
    "title": "Check Your Understanding: AC vs DC",
    "mode": "conceptual",
    "sequential": true,
    "questions": [
      {
        "id": "202-7A-C1-L1-A",
        "questionText": "What does AC stand for?",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "Alternating Current",
        "hint": "Think about the full name for AC."
      },
      {
        "id": "202-7A-C1-L1-B",
        "questionText": "What does 'alternating' mean in the context of electric current?",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "The current changes direction, flowing forwards then backwards regularly",
        "hint": "Think about what makes AC different from DC."
      },
      {
        "id": "202-7A-C1-L1-C",
        "questionText": "How does DC current flow?",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "DC flows in only one direction continuously",
        "hint": "DC stands for Direct Current."
      },
      {
        "id": "202-7A-C1-L2",
        "questionText": "How do these characteristics affect which type is better for different applications?",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "AC is better for mains supply because it can be transformed for transmission. DC is better for electronics because it provides steady voltage.",
        "hint": "Think about transformers and long-distance transmission."
      }
    ]
  }
}
```

#### Tips for Understanding Checks

✅ **DO:**
- Keep L1 questions very simple - just recall
- Make questions build on each other (Q1→Q2→Q3)
- Use L2 to show "why it matters"
- Place immediately after the related explanation
- Use `"sequential": true` to lock questions

❌ **DON'T:**
- Make L1 questions require analysis
- Jump to complex concepts in early questions
- Make L2 too difficult at this stage
- Skip the sequential locking

---

### Block 5: Worked Example Block

**Purpose:** Demonstrate step-by-step problem solving ("I Do" - teacher demonstrates)

#### What to Include

A worked example should:
- **Start with a realistic problem**
- **Show every step** explicitly
- **Explain what you're doing** in each step
- **Show the final answer** with units

#### Structure: The Four-Part Format

Every worked example has:

1. **Given** - What information is provided
2. **Steps** - Numbered sequence showing the process
3. **Result** - Final answer with units
4. **Notes** - Additional tips or reminders (optional)

#### Template

```json
{
  "id": "202-4A-worked-example",
  "type": "worked-example",
  "order": 5,
  "content": {
    "title": "Worked Example: [Problem Type]",
    "given": "[What information is provided in the problem]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[What you're doing in this step]",
        "formula": "[Formula being used, or null]",
        "calculation": null,
        "result": null
      },
      {
        "stepNumber": 2,
        "description": "[Substitute the values]",
        "formula": "[Formula with variables]",
        "calculation": "[Same formula with actual numbers]",
        "result": null
      },
      {
        "stepNumber": 3,
        "description": "[Calculate the final answer]",
        "formula": null,
        "calculation": "[The arithmetic]",
        "result": "[Final answer with units]"
      }
    ],
    "notes": "[Additional tips, common mistakes to avoid, or when to use this method]"
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-worked-example",
  "type": "worked-example",
  "order": 5,
  "content": {
    "title": "Worked Example: Finding Total Resistance and Current",
    "given": "Three resistors (R1 = 4Ω, R2 = 6Ω, R3 = 2Ω) are connected in series to a 12V battery. Find the total resistance and current.",
    "steps": [
      {
        "stepNumber": 1,
        "description": "Calculate total resistance using the series rule (resistances add up)",
        "formula": "R_total = R1 + R2 + R3",
        "calculation": null,
        "result": null
      },
      {
        "stepNumber": 2,
        "description": "Substitute the values into the formula",
        "formula": "R_total = R1 + R2 + R3",
        "calculation": "R_total = 4Ω + 6Ω + 2Ω",
        "result": null
      },
      {
        "stepNumber": 3,
        "description": "Add the resistances together",
        "formula": null,
        "calculation": "R_total = 12Ω",
        "result": "12Ω"
      },
      {
        "stepNumber": 4,
        "description": "Now calculate current using Ohm's Law. We know voltage (12V) and resistance (12Ω)",
        "formula": "I = V / R",
        "calculation": null,
        "result": null
      },
      {
        "stepNumber": 5,
        "description": "Substitute the values",
        "formula": "I = V / R",
        "calculation": "I = 12V / 12Ω",
        "result": null
      },
      {
        "stepNumber": 6,
        "description": "Calculate the current",
        "formula": null,
        "calculation": "I = 1A",
        "result": "1A"
      }
    ],
    "notes": "Remember: In series circuits, current is the same everywhere, so this 1A flows through all three resistors. Always include units in your final answer."
  }
}
```

#### How Many Steps?

- **Minimum:** 3 steps (any fewer and it's too simple)
- **Ideal:** 4-6 steps (shows process clearly)
- **Maximum:** 8 steps (beyond this, problem is too complex for one example)

#### Step Structure Rules

Each step should have:
- `stepNumber` - The number (1, 2, 3...)
- `description` - What you're doing (always filled in)
- `formula` - The formula being used (null if just arithmetic)
- `calculation` - Numbers substituted in (null if just showing formula)
- `result` - Final answer (null unless this is the final step)

#### Tips for Worked Examples

✅ **DO:**
- Use realistic values (avoid trick numbers)
- Show your working clearly
- Explain each step in plain English
- Include units throughout
- Make the problem relevant to real electrical work
- Build on the explanation block

❌ **DON'T:**
- Skip steps ("obviously, the answer is...")
- Use values that give messy decimals (unless teaching rounding)
- Combine multiple steps into one
- Forget units in the result
- Make the problem too complex
- Assume students see the obvious connections

---

### Block 6: Guided Practice Block

**Purpose:** Scaffolded practice where students try with prompts ("We Do" - teacher guides)

#### What to Include

Guided practice should:
- **Present a similar problem** to the worked example
- **Break it into prompted steps** (questions that guide thinking)
- **Provide hints** if students get stuck
- **Accept multiple answer formats** (with units, without, etc.)

#### Structure: Problem + Prompted Steps

1. **Problem statement** - Give the scenario
2. **Steps (2-4 prompts)** - Questions that guide students through solving it
3. **Each step includes:**
   - Prompt (question to answer)
   - Expected answer variations
   - Hint (if they're stuck)

#### Template

```json
{
  "id": "202-4A-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice (We Do)",
    "problem": "[Problem statement with given values]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Question that guides them to the first step]",
        "expectedAnswer": ["[answer1]", "[variation2]", "[alternative3]"],
        "hint": "[Helpful hint without giving away the answer]"
      },
      {
        "stepNumber": 2,
        "prompt": "[Next guiding question]",
        "expectedAnswer": ["[answer]", "[with-units]", "[without-units]"],
        "hint": "[Hint for this step]"
      }
    ]
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice (We Do)",
    "problem": "Two resistors (R1 = 8Ω and R2 = 4Ω) are connected in series with a 24V supply. Let's find the total resistance and circuit current together.",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "First, what is the total resistance? (Remember the series rule for resistance)",
        "expectedAnswer": ["12Ω", "12", "12 Ω", "12 ohms"],
        "hint": "In series, resistances add up: R_total = R1 + R2"
      },
      {
        "stepNumber": 2,
        "prompt": "Now, using Ohm's Law, calculate the current flowing through the circuit",
        "expectedAnswer": ["2A", "2", "2 A", "2 amps", "2 amperes"],
        "hint": "Use I = V / R. You know V = 24V and you just found R_total = 12Ω"
      },
      {
        "stepNumber": 3,
        "prompt": "Is this current the same through both resistors, or different?",
        "expectedAnswer": ["same", "the same", "identical", "equal", "same everywhere"],
        "hint": "Remember the first series circuit rule about current"
      }
    ]
  }
}
```

#### How Many Steps?

- **Minimum:** 2 steps
- **Ideal:** 2-3 steps
- **Maximum:** 4 steps (keep it focused)

#### Writing Good Prompts

Prompts should:
- **Be questions**, not instructions
- **Guide thinking** without giving away the method
- **Build on previous steps**
- **Use "you" language** (more engaging)

**Examples:**

✅ Good: "What formula relates voltage, current, and resistance?"
❌ Bad: "Use Ohm's Law"

✅ Good: "Looking at the circuit, what is the total resistance?"
❌ Bad: "Calculate R_total by adding R1 and R2"

#### Expected Answer Variations

Always include multiple acceptable formats:

```json
"expectedAnswer": [
  "12Ω",          // With unit symbol
  "12 Ω",         // With space
  "12",           // Just number
  "12 ohms",      // Full word
  "12Ohms"        // Common misspelling
]
```

This ensures the system marks students correct even if they format slightly differently.

#### Writing Good Hints

✅ **DO:**
- Point to the relevant rule or formula
- Remind them what they know
- Suggest where to look (diagram, formulas)

❌ **DON'T:**
- Give the answer
- Do the calculation for them
- Make hints more confusing than helpful

---

### Block 7: Practice Block

**Purpose:** Independent practice - students solve problems alone ("You Do")

#### What to Include

Practice questions should:
- **Test the learning outcomes**
- **Include variety** (calculation + conceptual)
- **Progress in difficulty** (easier first)
- **Cover all key concepts** from the lesson
- **Be doable** with what they've learned

#### How Many Questions?

- **Minimum:** 3 questions
- **Ideal:** 4-5 questions
- **Maximum:** 6 questions (more is overwhelming)

#### Question Types

**Three types to include:**

| Type | Purpose | Example |
|------|---------|---------|
| **Numeric** | Calculation practice | "Calculate the total resistance" |
| **Short-text** | Conceptual understanding | "Explain why current is the same" |
| **MCQ** | Quick checks or discrimination | "Which rule describes voltage in series?" |

Aim for: **2-3 numeric, 1-2 short-text, 0-1 MCQ**

#### Template

```json
{
  "id": "202-4A-practice",
  "type": "practice",
  "order": 7,
  "content": {
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "202-4A-P1",
        "questionText": "[Problem or question]",
        "answerType": "numeric",
        "expectedAnswer": ["[answer]", "[with-unit]", "[variations]"],
        "hint": "[Helpful hint that guides without solving]"
      },
      {
        "id": "202-4A-P2",
        "questionText": "[Conceptual question]",
        "answerType": "short-text",
        "expectedAnswer": ["[key-phrase-1]", "[key-phrase-2]", "[variation]"],
        "hint": "[Hint]"
      },
      {
        "id": "202-4A-P3",
        "questionText": "[MCQ question]",
        "answerType": "mcq",
        "options": ["[option1]", "[option2]", "[option3]", "[option4]"],
        "correctOptionIndex": 0,
        "hint": "[Hint]"
      }
    ]
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-practice",
  "type": "practice",
  "order": 7,
  "content": {
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "202-4A-P1",
        "questionText": "Three resistors of 3Ω, 5Ω, and 7Ω are connected in series. Calculate the total resistance.",
        "answerType": "numeric",
        "expectedAnswer": ["15Ω", "15", "15 Ω", "15 ohms"],
        "hint": "Remember: In series, resistances add up. R_total = R1 + R2 + R3"
      },
      {
        "id": "202-4A-P2",
        "questionText": "A series circuit has a 9V battery and three equal resistors. If the total resistance is 18Ω, what is the current?",
        "answerType": "numeric",
        "expectedAnswer": ["0.5A", "0.5", "0.5 A", "0.5 amps", "500mA", "500 mA"],
        "hint": "Use Ohm's Law: I = V / R. You have both V and R."
      },
      {
        "id": "202-4A-P3",
        "questionText": "Explain in your own words why the current is the same everywhere in a series circuit.",
        "answerType": "short-text",
        "expectedAnswer": [
          "only one path",
          "single path",
          "no branches",
          "nowhere else to go",
          "electrons flow through same route"
        ],
        "hint": "Think about the path that current takes. How many routes are available?"
      },
      {
        "id": "202-4A-P4",
        "questionText": "A series circuit has two resistors: 10Ω and 15Ω. The supply voltage is 25V. Calculate the voltage drop across the 10Ω resistor.",
        "answerType": "numeric",
        "expectedAnswer": ["10V", "10", "10 V", "10 volts"],
        "hint": "First find total resistance, then current, then use V = IR for the 10Ω resistor specifically"
      }
    ]
  }
}
```

#### Question ID Format

Always use: `[LESSON-ID]-P[NUMBER]`

Examples:
- `202-4A-P1` (first practice question)
- `202-4A-P2` (second practice question)
- `305-2A-P3` (third practice question)

#### Expected Answers for Each Type

**Numeric questions:**
```json
"expectedAnswer": [
  "15Ω",      // Ideal answer
  "15",       // Without unit
  "15 Ω",     // With space
  "15 ohms",  // Full word
  "15Ohms"    // Common variations
]
```

**Short-text questions:**
```json
"expectedAnswer": [
  "only one path",           // Key phrase 1
  "single path",             // Alternative wording
  "no branches",             // Key phrase 2
  "nowhere else to go"       // Student-friendly phrasing
]
```
*Note: System checks if student's answer contains ANY of these phrases*

**MCQ questions:**
```json
"options": [
  "Correct answer",
  "Plausible wrong answer (common misconception)",
  "Another plausible wrong answer",
  "Third plausible wrong answer"
],
"correctOptionIndex": 0  // 0 = first option, 1 = second, etc.
```

#### Difficulty Progression

Arrange questions from easier to harder:

1. **Q1-2:** Direct application of a single rule
2. **Q3-4:** Requires combining concepts or multiple steps
3. **Q5 (optional):** Challenge question or conceptual

#### Tips for Practice Questions

✅ **DO:**
- Use different values from worked example
- Test each learning outcome
- Include both calculation and conceptual questions
- Make questions realistic to electrical work
- Provide helpful hints
- Accept multiple answer formats

❌ **DON'T:**
- Repeat exact worked example with different numbers
- Make questions harder than the lesson taught
- Use trick questions
- Forget hints
- Only test calculation (include conceptual understanding)
- Make all questions the same difficulty

---

### Block 7.5: Integrative Question Block

**Purpose:** Deep synthesis question tying all lesson concepts together

**When to Add:** After practice block (order: 7.5 or 9.5), before spaced review

#### What to Include

One "Big Picture Question" that:
- **Ties together** all major concepts from the lesson
- **Requires 2-3 sentences** to answer properly
- **Shows synthesis** of understanding (Level 2/3)
- **Reinforces** the big picture once foundations are solid

#### Structure: One Deep Question

This is a **special question** that appears different from regular practice:
- Blue badge: "🏆 Putting It All Together"
- Longer, more thoughtful answer required
- Tests whether student can integrate all concepts

#### Template

```json
{
  "id": "202-7A-integrative",
  "type": "practice",
  "order": 9.5,
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "questions": [
      {
        "id": "202-7A-INT-1",
        "questionText": "[2-3 sentence question that ties up multiple concepts from the lesson] (Aim for 3-4 sentences in your answer)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "[Comprehensive answer showing integration of concepts]",
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}
```

#### Real Example: AC Principles Integrative

```json
{
  "id": "202-7A-integrative",
  "type": "practice",
  "order": 9.5,
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "questions": [
      {
        "id": "202-7A-INT-1",
        "questionText": "You've learned about AC vs DC, frequency (50 Hz), and UK mains supply (230V AC). Now explain: Why does the UK use 230V AC at 50Hz for the national grid rather than DC? What are the practical advantages? (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "The UK uses 230V AC at 50 Hz because AC can be easily transformed to different voltages using transformers. This allows power stations to transmit electricity at very high voltages (reducing losses over long distances) then step it down to safe 230V for homes. The 50 Hz frequency is standardized across Europe for equipment compatibility. DC cannot be easily transformed, making it inefficient for national transmission.",
        "hint": "Think about transformers, transmission efficiency, and standardization."
      }
    ]
  }
}
```

#### Tips for Integrative Questions

✅ **DO:**
- Wait until end of lesson (after practice)
- Require integration of multiple concepts
- Make it feel "special" with the integrative mode
- Ask for 3-4 sentences explicitly
- Cover the "big why" of the lesson

❌ **DON'T:**
- Make it too hard - it's still Level 2/3, not Level 4
- Just repeat a practice question
- Make it about only one concept
- Skip this block - it's important for deep learning

#### Cognitive Level Guide

- **Level 1 (Recall):** Simple facts - "What is...?"
- **Level 2 (Connection):** Relationships - "How do these relate?"
- **Level 3 (Synthesis):** Integration - "Explain why... considering..."

---

### Block 8: Spaced Review Block

**Purpose:** Reinforce prerequisite material (spaced repetition for retention)

#### What to Include

Spaced review should:
- **Review prerequisite lessons**
- **Include 4 questions**
- **Cover different topics** from earlier lessons
- **Be quick recall** (not complex new problems)

#### Structure: Simple Question List

Unlike other practice, spaced review is simpler:
- Just a list of 4 questions
- No expected answers (checking for engagement, not correctness)
- Brief notes about what's being reviewed

#### Template

```json
{
  "id": "202-4A-spaced-review",
  "type": "spaced-review",
  "order": 8,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      "[Question reviewing prerequisite concept 1]",
      "[Question reviewing prerequisite concept 2]",
      "[Question reviewing prerequisite concept 3]",
      "[Question reviewing prerequisite concept 4]"
    ],
    "notes": "[What previous lessons or concepts these questions review]"
  }
}
```

#### Real Example: Series Circuits Lesson

```json
{
  "id": "202-4A-spaced-review",
  "type": "spaced-review",
  "order": 8,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      "What does voltage measure in a circuit?",
      "State Ohm's Law and identify each variable",
      "What is the unit of electrical resistance?",
      "If you double the resistance while keeping voltage constant, what happens to current?"
    ],
    "notes": "These questions review electrical quantities (202-1A) and Ohm's Law (202-2A), which are prerequisites for understanding series circuits"
  }
}
```

#### What Makes Good Spaced Review Questions?

✅ **DO:**
- Review actual prerequisite lessons
- Ask quick recall questions
- Cover fundamental concepts
- Keep questions short and clear
- Review concepts students will use again

❌ **DON'T:**
- Ask about the current lesson
- Make questions too complex
- Include calculation problems
- Review irrelevant topics
- Make it longer than 4 questions

#### How to Identify What to Review

Look at the lesson's prerequisite list:

```json
"prerequisites": ["202-1A", "202-2A"]
```

Then ask: "What key concepts from 202-1A and 202-2A will students need to remember?"

Create one question per prerequisite, plus 1-2 covering fundamental concepts.

---

<a name="examples"></a>
## 📚 Complete Walkthrough Examples

Now let's walk through creating two complete lessons from scratch:
1. **Example A:** Science lesson with calculations (Linear-Flow)
2. **Example B:** Circuit lesson with diagram (Split-Vis)

---

### Example A: Ohm's Law Basics (Linear-Flow)

**Scenario:** Create a lesson teaching Ohm's Law to students who know basic electrical quantities.

#### Step 1: Choose Layout

**Question:** Does the student need a diagram visible while reading?
**Answer:** Not essential - formula and calculations can be inline
**Layout:** **Linear-Flow**

#### Step 2: Fill Top-Level Fields

```json
{
  "id": "202-2A",
  "title": "202.2A — Ohm's Law: V = IR",
  "description": "Learn to use Ohm's Law to calculate voltage, current, and resistance in electrical circuits",
  "layout": "linear-flow",
  "unit": "Unit 202",
  "topic": "Ohm's Law",
  "learningOutcomes": [
    "State Ohm's Law and define each variable (V, I, R)",
    "Explain the relationship between voltage, current, and resistance",
    "Calculate voltage, current, or resistance when given the other two values"
  ],
  "prerequisites": ["202-1A"],
  "blocks": [ ... ]
}
```

#### Step 3: Block 1 - Outcomes

```json
{
  "id": "202-2A-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      {
        "text": "State Ohm's Law formula and identify each variable",
        "bloomLevel": "remember"
      },
      {
        "text": "Explain how changes in voltage or resistance affect current",
        "bloomLevel": "understand"
      },
      {
        "text": "Calculate voltage, current, or resistance using Ohm's Law",
        "bloomLevel": "apply"
      }
    ]
  }
}
```

#### Step 4: Block 2 - Vocab

```json
{
  "id": "202-2A-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      {
        "term": "Ohm's Law",
        "definition": "The relationship between voltage, current, and resistance, expressed as V = IR"
      },
      {
        "term": "Voltage (V)",
        "definition": "The electrical pressure that pushes current through a circuit, measured in Volts"
      },
      {
        "term": "Current (I)",
        "definition": "The rate of flow of electrical charge, measured in Amperes (A)"
      },
      {
        "term": "Resistance (R)",
        "definition": "Opposition to current flow in a circuit, measured in Ohms (Ω)"
      },
      {
        "term": "Formula Rearrangement",
        "definition": "Changing the form of V = IR to solve for different variables (I = V/R or R = V/I)"
      }
    ]
  }
}
```

#### Step 5: Block 3 - Diagram (Optional for Linear-Flow)

*Skip diagram block for this lesson - formulas work better inline*

#### Step 6: Block 4 - Explanation

```json
{
  "id": "202-2A-explain",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "Understanding Ohm's Law",
    "content": "**What is Ohm's Law?**\n\nOhm's Law describes the relationship between three fundamental electrical quantities: voltage (V), current (I), and resistance (R). It's one of the most important formulas in electrical work.\n\nThe formula is: **V = I × R**\n\nWhere:\n- V = Voltage in Volts (V)\n- I = Current in Amperes (A)\n- R = Resistance in Ohms (Ω)\n\n**Understanding the Relationship**\n\nThink of electricity like water flowing through a pipe:\n- **Voltage** is the water pressure (pushing force)\n- **Current** is the flow rate (how much water per second)\n- **Resistance** is the pipe size (narrow pipe = more resistance)\n\nOhm's Law tells us: The current that flows depends on both the voltage (pressure) and resistance (pipe size).\n\n**What the Formula Tells Us**\n\n1. **More voltage = More current** (if resistance stays the same)\n   Example: 12V pushes twice as much current as 6V through the same resistor\n\n2. **More resistance = Less current** (if voltage stays the same)\n   Example: A 20Ω resistor allows half the current of a 10Ω resistor with the same voltage\n\n3. **The relationship is proportional**: Double the voltage, double the current (with fixed resistance)\n\n**Rearranging the Formula**\n\nSometimes you need to find I or R instead of V. Rearrange the formula:\n\n- To find **Current**: I = V / R\n- To find **Resistance**: R = V / I\n- To find **Voltage**: V = I × R\n\nTip: Cover the variable you want to find on the triangle, and what remains tells you the formula.\n\n**When Do Electricians Use This?**\n\n- Calculating circuit current from supply voltage and load resistance\n- Finding what voltage will appear across a component\n- Determining if a cable has too much resistance\n- Troubleshooting: measuring unexpected voltages or currents"
  }
}
```

#### Step 7: Block 5 - Worked Example

```json
{
  "id": "202-2A-worked-example",
  "type": "worked-example",
  "order": 5,
  "content": {
    "title": "Worked Example: Finding Circuit Current",
    "given": "A 12V battery is connected to a 6Ω resistor. Calculate the current flowing through the circuit.",
    "steps": [
      {
        "stepNumber": 1,
        "description": "Identify what we know and what we need to find",
        "formula": null,
        "calculation": "Known: V = 12V, R = 6Ω\nFind: I = ?",
        "result": null
      },
      {
        "stepNumber": 2,
        "description": "Choose the correct form of Ohm's Law (we need to find I)",
        "formula": "I = V / R",
        "calculation": null,
        "result": null
      },
      {
        "stepNumber": 3,
        "description": "Substitute the known values into the formula",
        "formula": "I = V / R",
        "calculation": "I = 12V / 6Ω",
        "result": null
      },
      {
        "stepNumber": 4,
        "description": "Calculate the result",
        "formula": null,
        "calculation": "I = 2A",
        "result": "2A"
      }
    ],
    "notes": "Always include units in your answer. Current is measured in Amperes (A). Check your answer makes sense: a 12V supply with 6Ω resistance should give a reasonable current - 2A is realistic."
  }
}
```

#### Step 8: Block 6 - Guided Practice

```json
{
  "id": "202-2A-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice (We Do)",
    "problem": "A resistor of 10Ω has a current of 3A flowing through it. Let's find the voltage across the resistor together.",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "What do we know, and what do we need to find?",
        "expectedAnswer": ["R = 10Ω, I = 3A, find V", "resistance 10 ohms, current 3 amps, need voltage", "know R and I, find V"],
        "hint": "List the given values (R and I) and identify what's missing (V)"
      },
      {
        "stepNumber": 2,
        "prompt": "Which form of Ohm's Law should we use?",
        "expectedAnswer": ["V = IR", "V = I × R", "V equals I times R", "voltage equals current times resistance"],
        "hint": "We need to find V (voltage), so use the formula with V on the left side"
      },
      {
        "stepNumber": 3,
        "prompt": "Calculate the voltage",
        "expectedAnswer": ["30V", "30", "30 V", "30 volts"],
        "hint": "Substitute: V = 3A × 10Ω. Multiply the numbers together"
      }
    ]
  }
}
```

#### Step 9: Block 7 - Practice

```json
{
  "id": "202-2A-practice",
  "type": "practice",
  "order": 7,
  "content": {
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "202-2A-P1",
        "questionText": "A 9V battery is connected to a 3Ω resistor. Calculate the current.",
        "answerType": "numeric",
        "expectedAnswer": ["3A", "3", "3 A", "3 amps"],
        "hint": "Use I = V / R. Divide voltage by resistance."
      },
      {
        "id": "202-2A-P2",
        "questionText": "A current of 5A flows through a resistor, causing a voltage drop of 15V. What is the resistance?",
        "answerType": "numeric",
        "expectedAnswer": ["3Ω", "3", "3 Ω", "3 ohms"],
        "hint": "Use R = V / I. Divide voltage by current."
      },
      {
        "id": "202-2A-P3",
        "questionText": "Explain what happens to current if you double the voltage while keeping resistance constant.",
        "answerType": "short-text",
        "expectedAnswer": ["current doubles", "current also doubles", "doubles", "increases by factor of 2", "twice as much current"],
        "hint": "Look at the formula I = V / R. If V doubles and R stays the same, what happens to I?"
      },
      {
        "id": "202-2A-P4",
        "questionText": "A resistor has 24V across it and 4A flowing through it. Calculate its resistance.",
        "answerType": "numeric",
        "expectedAnswer": ["6Ω", "6", "6 Ω", "6 ohms"],
        "hint": "Use R = V / I. You have both V and I."
      }
    ]
  }
}
```

#### Step 10: Block 8 - Spaced Review

```json
{
  "id": "202-2A-spaced-review",
  "type": "spaced-review",
  "order": 8,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      "What is the unit of voltage?",
      "What does 'mA' stand for, and how many mA are in 1A?",
      "Define what electrical resistance means",
      "Name three fundamental electrical quantities we measure in circuits"
    ],
    "notes": "Reviews electrical quantities and units from lesson 202-1A"
  }
}
```

**Complete! That's a full Linear-Flow lesson.**

---

### Example B: Series Circuits with Diagram (Split-Vis)

**Scenario:** Teaching series circuit rules where students need to see the circuit diagram throughout.

#### Step 1: Choose Layout

**Question:** Does the student need a diagram visible while reading?
**Answer:** YES - students need to see circuit topology while learning about current flow
**Layout:** **Split-Vis**

#### Step 2: Fill Top-Level Fields

```json
{
  "id": "202-4A",
  "title": "202.4A — Series Circuits: Rules and Behavior",
  "description": "Learn the three series circuit rules and how to apply them to calculate current, voltage, and resistance",
  "layout": "split-vis",
  "unit": "Unit 202",
  "topic": "Series Circuits",
  "learningOutcomes": [
    "Identify series circuits from diagrams and descriptions",
    "State and explain the three series circuit rules",
    "Calculate current, voltage drops, and total resistance in series circuits"
  ],
  "prerequisites": ["202-1A", "202-2A"],
  "blocks": [ ... ]
}
```

#### Step 3-10: Fill All Blocks

*(Same process as Example A, but include diagram block with detailed circuit diagram)*

**Key difference:** Block 3 must be a comprehensive diagram block:

```json
{
  "id": "202-4A-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": "Series Circuit Example",
    "description": "A series circuit showing a 12V battery connected to three resistors (R1=4Ω, R2=6Ω, R3=2Ω) in a single path with no branches",
    "videoUrl": "",
    "diagramType": "series",
    "elementIds": ["battery", "R1", "R2", "R3", "wire"],
    "placeholderText": "Circuit diagram showing a 12V battery connected to three resistors in series: R1 (4Ω), R2 (6Ω), and R3 (2Ω). Current flows in a single loop with no branches. Current flow is marked with arrows showing the same direction throughout."
  }
}
```

**Complete! That's a full Split-Vis lesson.**

---

<a name="mistakes"></a>
## ⚠️ Common Mistakes & How to Avoid Them

### Mistake 1: Vague Learning Outcomes

❌ **Wrong:** "Understand Ohm's Law"
✅ **Right:** "Calculate current using Ohm's Law when given voltage and resistance"

**Why:** "Understand" isn't measurable. Use specific action verbs.

---

### Mistake 2: Too Many Vocabulary Terms

❌ **Wrong:** Including 10+ terms
✅ **Right:** 4-5 essential terms only

**Why:** Information overload. Focus on terms they'll use repeatedly.

---

### Mistake 3: Explanations That Assume Knowledge

❌ **Wrong:** "Using Kirchhoff's current law, we see that..."
✅ **Right:** "Current is the same everywhere because there's only one path..."

**Why:** Students don't have advanced knowledge. Explain from first principles.

---

### Mistake 4: Worked Examples That Skip Steps

❌ **Wrong:** "Obviously, the answer is 12Ω"
✅ **Right:** "Step 1: Add resistances. Step 2: 4 + 6 + 2 = 12. Result: 12Ω"

**Why:** What's obvious to you isn't obvious to learners. Show every step.

---

### Mistake 5: Practice Without Variety

❌ **Wrong:** Five calculation questions, all the same type
✅ **Right:** Mix of calculations, conceptual questions, and applications

**Why:** Students need to understand concepts, not just follow procedures.

---

### Mistake 6: Forgetting Units

❌ **Wrong:** Expected answer: "12"
✅ **Right:** Expected answers: ["12Ω", "12", "12 Ω", "12 ohms"]

**Why:** Students need to learn proper engineering practice (always include units).

---

### Mistake 7: Hints That Give Away Answers

❌ **Wrong:** "The answer is found by adding 4 + 6 + 2"
✅ **Right:** "Remember the series rule: resistances add up"

**Why:** Hints should guide thinking, not solve the problem.

---

### Mistake 8: Wrong Layout Choice

❌ **Wrong:** Using Linear-Flow for a circuit topology lesson
✅ **Right:** Using Split-Vis when diagrams are essential reference

**Why:** Layout affects learning effectiveness.

---

### Mistake 9: Spaced Review of Current Lesson

❌ **Wrong:** Reviewing concepts just taught in this lesson
✅ **Right:** Reviewing prerequisite lessons only

**Why:** Spaced review is for retention over time, not immediate recall.

---

### Mistake 10: Inconsistent Difficulty

❌ **Wrong:** Starting with complex problems, ending with simple ones
✅ **Right:** Progressing from simple to complex throughout

**Why:** Build confidence gradually. Start easy, increase challenge.

---

<a name="checklist"></a>
## ✅ Quality Checklist

Use this checklist before submitting any lesson:

### Structure

- [ ] All 8 blocks present and in correct order
- [ ] Block IDs follow naming convention: `[LESSON-ID]-[block-type]`
- [ ] Order field is sequential (1, 2, 3... 8)
- [ ] Layout choice is appropriate for content type

### Outcomes Block

- [ ] 3-4 learning outcomes present
- [ ] Each outcome starts with measurable action verb
- [ ] Bloom levels assigned (remember, understand, apply)
- [ ] Outcomes progress from simple to complex

### Vocab Block

- [ ] 3-6 terms included
- [ ] Definitions are one sentence each
- [ ] Definitions use simple language
- [ ] Terms are essential to the lesson

### Diagram Block (if included)

- [ ] Title is descriptive
- [ ] Description explains what's shown
- [ ] PlaceholderText provides text alternative
- [ ] ElementIds lists key components
- [ ] DiagramType is appropriate

### Explanation Block

- [ ] Title clearly states what's being taught
- [ ] Content is 400-600 words
- [ ] Broken into clear sections
- [ ] Uses **bold** for key terms
- [ ] Uses `\n\n` for paragraph breaks
- [ ] Includes formulas where relevant
- [ ] Uses analogies or real-world examples
- [ ] Explains "why," not just "what"

### Worked Example Block

- [ ] Problem is realistic and clear
- [ ] Given section states what's known
- [ ] 4-6 steps showing complete process
- [ ] Each step has clear description
- [ ] Formulas included where used
- [ ] Final result includes units
- [ ] Notes section provides tips

### Guided Practice Block

- [ ] Problem is similar to worked example
- [ ] 2-3 prompted steps
- [ ] Each prompt is a question, not instruction
- [ ] Expected answers include multiple variations
- [ ] Hints guide without giving away answers

### Practice Block

- [ ] 4-5 questions included
- [ ] Mix of numeric and short-text questions
- [ ] Questions progress in difficulty
- [ ] All learning outcomes tested
- [ ] Question IDs follow format: `[LESSON-ID]-P[N]`
- [ ] Expected answers include unit variations
- [ ] Hints are helpful but not solve-it-for-you

### Spaced Review Block

- [ ] 4 questions present
- [ ] Questions review prerequisite lessons
- [ ] Questions are quick recall, not complex
- [ ] Notes explain what's being reviewed

### Content Quality

- [ ] Language is clear and accessible
- [ ] Technical terms are explained
- [ ] Analogies are appropriate and helpful
- [ ] Real-world relevance is clear
- [ ] Examples are realistic
- [ ] Calculations are correct
- [ ] Units are used consistently

### Teaching Effectiveness

- [ ] Builds from prior knowledge (prerequisites)
- [ ] Progresses logically from simple to complex
- [ ] Provides adequate practice opportunities
- [ ] Includes both procedural and conceptual learning
- [ ] Connects theory to practice

---

<a name="reference"></a>
## 📋 Quick Reference Templates

### Minimal Complete Lesson Template

```json
{
  "id": "[UNIT-NUMBER][LETTER]",
  "title": "[ID] — [Topic]: [Subtitle]",
  "description": "[One sentence what students learn]",
  "layout": "split-vis OR linear-flow",
  "unit": "Unit [NUMBER]",
  "topic": "[Topic]",
  "learningOutcomes": [
    "[Remember level outcome]",
    "[Understand level outcome]",
    "[Apply level outcome]"
  ],
  "prerequisites": ["[lesson-id]"],
  "blocks": [
    {
      "id": "[ID]-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {"text": "[outcome]", "bloomLevel": "remember"},
          {"text": "[outcome]", "bloomLevel": "understand"},
          {"text": "[outcome]", "bloomLevel": "apply"}
        ]
      }
    },
    {
      "id": "[ID]-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {"term": "[term]", "definition": "[definition]"}
        ]
      }
    },
    {
      "id": "[ID]-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "[title]",
        "description": "[description]",
        "videoUrl": "",
        "diagramType": "[type]",
        "elementIds": ["[element]"],
        "placeholderText": "[text description]"
      }
    },
    {
      "id": "[ID]-explain",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "[title]",
        "content": "[explanation with **bold** and\n\nparagraph breaks]"
      }
    },
    {
      "id": "[ID]-worked-example",
      "type": "worked-example",
      "order": 5,
      "content": {
        "title": "Worked Example: [type]",
        "given": "[what's provided]",
        "steps": [
          {
            "stepNumber": 1,
            "description": "[what you're doing]",
            "formula": "[formula or null]",
            "calculation": "[numbers or null]",
            "result": "[answer with units or null]"
          }
        ],
        "notes": "[tips]"
      }
    },
    {
      "id": "[ID]-guided",
      "type": "guided-practice",
      "order": 6,
      "content": {
        "title": "Guided Practice (We Do)",
        "problem": "[problem statement]",
        "steps": [
          {
            "stepNumber": 1,
            "prompt": "[guiding question]",
            "expectedAnswer": ["[answer]", "[variation]"],
            "hint": "[hint]"
          }
        ]
      }
    },
    {
      "id": "[ID]-practice",
      "type": "practice",
      "order": 7,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "[ID]-P1",
            "questionText": "[question]",
            "answerType": "numeric",
            "expectedAnswer": ["[answer]", "[variations]"],
            "hint": "[hint]"
          }
        ]
      }
    },
    {
      "id": "[ID]-spaced-review",
      "type": "spaced-review",
      "order": 8,
      "content": {
        "title": "Spaced Review (from prerequisites)",
        "questions": [
          "[question 1]",
          "[question 2]",
          "[question 3]",
          "[question 4]"
        ],
        "notes": "[what's being reviewed]"
      }
    }
  ],
  "metadata": {
    "created": "[YYYY-MM-DD]",
    "updated": "[YYYY-MM-DD]",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

### Action Verb Reference (Bloom's Taxonomy)

| Level | Verbs for Learning Outcomes |
|-------|----------------------------|
| **Remember** | Define, List, Name, State, Identify, Recall, Label, Match |
| **Understand** | Explain, Describe, Summarize, Interpret, Compare, Classify, Discuss |
| **Apply** | Calculate, Solve, Apply, Demonstrate, Use, Implement, Execute |
| **Analyze** | Analyze, Differentiate, Examine, Compare, Contrast, Investigate |
| **Evaluate** | Evaluate, Judge, Justify, Assess, Critique, Recommend |
| **Create** | Design, Construct, Develop, Create, Plan, Formulate |

*Note: Most C&G 2365 Level 2 lessons focus on Remember, Understand, and Apply levels.*

---

### Question Type Quick Reference

| Type | When to Use | Example | Expected Answer Format |
|------|-------------|---------|----------------------|
| **numeric** | Calculations, measurements | "Calculate total resistance" | ["15Ω", "15", "15 Ω"] |
| **short-text** | Explanations, definitions | "Explain why current is the same" | ["single path", "no branches"] |
| **mcq** | Quick checks, discrimination | "Which rule describes series voltage?" | Use correctOptionIndex |

---

### File Naming Convention

| Component | Format | Example |
|-----------|--------|---------|
| Lesson ID | [UNIT]-[NUMBER][LETTER] | 202-4A |
| Filename | [ID]-[topic-slug].json | 202-4A-series-circuits.json |
| Block ID | [LESSON-ID]-[block-type] | 202-4A-outcomes |
| Question ID | [LESSON-ID]-P[number] | 202-4A-P1 |

---

## 🎓 Summary: Your Lesson Creation Process

Follow these steps every time:

1. **Choose layout** (Split-Vis vs Linear-Flow)
2. **Write top-level fields** (ID, title, description, etc.)
3. **Fill Block 1:** Outcomes (3-4 measurable outcomes)
4. **Fill Block 2:** Vocab (4-5 key terms)
5. **Fill Block 3:** Diagram (if needed)
6. **Fill Block 4:** Explanation (400-600 words, clear sections)
7. **Fill Block 5:** Worked Example (4-6 steps)
8. **Fill Block 6:** Guided Practice (2-3 prompted steps)
9. **Fill Block 7:** Practice (4-5 varied questions)
10. **Fill Block 8:** Spaced Review (4 prerequisite questions)
11. **Review using checklist**
12. **Test in the system**

---

## 💡 Final Tips for Success

### Think Like a Student

- What would confuse you if you'd never seen this before?
- Where might you get stuck?
- What connections might you miss?

### Be Explicit

- Don't assume "obvious" connections
- Explain the reasoning behind formulas
- Show why rules work, not just what they are

### Test Your Content

- Can you answer the practice questions using only the explanation?
- Do the worked example and guided practice prepare students for independent practice?
- Are prerequisites actually sufficient?

### Maintain Consistency

- Use the same terms throughout
- Keep formatting consistent
- Follow the same structure every time

---

## 📚 Where to Go Next

**For more detail:**
- **Full workflow process:** `LESSON_PRODUCTION_WORKFLOW.md`
- **Template reference:** `lesson_factory.md`
- **Quick start guide:** `QUICK_START.md`
- **Supplementary lessons:** `supplementary_lessons.md`

**Ready to create?**

Start with the templates above, follow the block-by-block guide, and use the checklist to ensure quality. You've got this! 🚀

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-20  
**Author:** C&G 2365 Learning Team
