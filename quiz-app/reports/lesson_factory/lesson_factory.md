# Lesson Factory: Master Template Guide

## Overview
This guide provides a reusable template for creating lesson JSON files that work with **LayoutA (Split-Vis)** and **LayoutB (Linear Flow)**. The same JSON structure works for both layouts - only the `layout` field changes to determine which rendering approach is used.

---

## When to Use Which Layout

| Layout | Use When | Key Feature |
|--------|----------|-------------|
| `split-vis` (LayoutA) | Spatial/topology learning, diagrams must stay visible | Sticky diagram on left (desktop) or top (mobile), content scrolls on right |
| `linear-flow` (LayoutB) | Text-heavy, definitions, formulas, non-spatial content | Single scrolling column, clean reading experience |

### Layout Inference Rules

When layout is not explicitly specified, the system automatically selects based on these criteria:

**Select `linear-flow` (LayoutB) when:**
- **Section indicators**: "Health & Safety", "Theory", "Regulations", "Procedures"
- **Topic indicators**: "Calculations", "Formulas", "Definitions", "Units", "Measurements"
- **Content type**: Regulations, PPE requirements, risk assessment, safety procedures, theoretical concepts
- **Format needs**: Text-heavy content, lists, sequential steps, reading-focused material
- **Visual needs**: No diagrams required, or only supplementary images

**Examples requiring `linear-flow`:**
- "Unit 201, Lesson 1 - Health and Safety (Health & Safety Level 1)"
- "Unit 202, Lesson 1A - Electrical Quantities & Units (Science)"
- "Unit 305, Lesson 2 - Risk Assessment Procedures (Health & Safety)"

**Select `split-vis` (LayoutA) when:**
- **Section indicators**: "Science 2365" (typically circuit-based)
- **Topic indicators**: "Circuit", "Series", "Parallel", "Diagram", "Layout", "Topology"
- **Content type**: Spatial relationships, component placement, circuit analysis, system diagrams
- **Format needs**: Diagrams must remain visible while reading explanations
- **Visual needs**: Essential visual reference throughout lesson

**Examples requiring `split-vis`:**
- "Unit 202, Lesson 4A - Series Circuits (Science)"
- "Unit 202, Lesson 5B - Parallel Circuit Topology (Science)"
- "Unit 203, Lesson 2 - Component Layout (Science)"

**Manual Override:**
Users can always explicitly specify layout by adding to their request:
```
Create Unit 201, Lesson 1 - Health and Safety (Health & Safety Level 1)
Layout: linear-flow
```

---

## Master Template Structure

```json
{
  "id": "[UNIT-NUMBER][LETTER]",
  "title": "[UNIT-NUMBER][LETTER] — [Topic]: [Specific Focus]",
  "description": "[One sentence describing what students will learn]",
  "layout": "[split-vis OR linear-flow]",
  "unit": "Unit [NUMBER]",
  "topic": "[Main Topic Name]",
  "learningOutcomes": [
    "[Action verb] + [what students will be able to do] - Remember level",
    "[Action verb] + [what students will be able to do] - Understand level",
    "[Action verb] + [what students will be able to do] - Apply level"
  ],
  "prerequisites": ["[previous-lesson-id]", "[another-prerequisite-id]"],
  "blocks": [
    // SEE BLOCK TEMPLATES BELOW
  ],
  "metadata": {
    "created": "[YYYY-MM-DD]",
    "updated": "[YYYY-MM-DD]",
    "version": "[X.Y]",
    "author": "[Team/Author Name]"
  }
}
```

---

## Field Explanations

### Top-Level Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | ✅ | Unique identifier using unit + letter pattern | `"202-4A"` |
| `title` | ✅ | Formatted as: `[id] — [Topic]: [Subtitle]` | `"202.4A — Series Circuits: Rules and Calculations"` |
| `description` | ✅ | Brief overview (1-2 sentences) | `"Learn the three series circuit rules..."` |
| `layout` | ✅ | Choose `"split-vis"` or `"linear-flow"` | `"split-vis"` |
| `unit` | ✅ | Unit identifier for organization | `"Unit 202"` |
| `topic` | ✅ | Main subject area | `"Series Circuits"` |
| `learningOutcomes` | ✅ | 2-4 measurable outcomes using Bloom's taxonomy | See template above |
| `prerequisites` | ⚪ | Array of lesson IDs students should complete first | `["ohms-law-basics"]` |
| `blocks` | ✅ | Array of content blocks (see below) | Multiple block objects |
| `metadata` | ✅ | Tracking information | See template above |

---

## Block Types & Templates

Blocks are ordered using the `order` field (1, 2, 3...). Each block has an `id`, `type`, `order`, and `content` object.

### 1. Outcomes Block
**Purpose:** Display learning objectives at start of lesson  
**When:** Always include as first block (order: 1)

```json
{
  "id": "[LESSON-ID]-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      {
        "text": "[Specific measurable outcome]",
        "bloomLevel": "remember"
      },
      {
        "text": "[Specific measurable outcome]",
        "bloomLevel": "understand"
      },
      {
        "text": "[Specific measurable outcome]",
        "bloomLevel": "apply"
      }
    ]
  }
}
```

**Bloom Levels:** `remember`, `understand`, `apply`, `analyze`, `evaluate`, `create`

---

### 2. Vocab Block
**Purpose:** Define key terms  
**When:** Early in lesson (order: 2), include 3-6 essential terms

```json
{
  "id": "[LESSON-ID]-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      {
        "term": "[Technical Term]",
        "definition": "[Clear, concise definition]"
      }
    ]
  }
}
```

---

### 3. Diagram Block
**Purpose:** Visual representation (interactive or video)  
**When:** Use for spatial/visual concepts (essential for split-vis layout)

```json
{
  "id": "[LESSON-ID]-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": "[Diagram Title]",
    "description": "[What the diagram shows]",
    "videoUrl": "[YouTube or video URL - optional]",
    "diagramType": "[series|parallel|circuit|other]",
    "elementIds": ["[element1]", "[element2]"],
    "placeholderText": "[Fallback description if diagram not rendered]"
  }
}
```

---

### 4. Explanation Block
**Purpose:** Teach core concepts ("I Do")  
**When:** After vocab/diagram, before examples (order: 4)

```json
{
  "id": "[LESSON-ID]-explain-[topic]",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "[Clear Section Title]",
    "content": "[Full explanation with **bold** and\n\nnewlines for formatting. Keep it clear and structured.]"
  }
}
```

**Tips:**
- Use `\n\n` for paragraph breaks
- Use `**text**` for bold emphasis
- Break into numbered rules/points when appropriate
- Connect to diagram/vocab when possible

---

### 5. Worked Example Block
**Purpose:** Show step-by-step problem solving ("I Do")  
**When:** After explanation, before guided practice (order: 5)

```json
{
  "id": "[LESSON-ID]-worked-example",
  "type": "worked-example",
  "order": 5,
  "content": {
    "title": "Worked Example: [Problem Type]",
    "given": "[What information is provided]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[What to do in this step]",
        "formula": "[Formula to use - or null]",
        "calculation": null,
        "result": null
      },
      {
        "stepNumber": 2,
        "description": "[Substitute values]",
        "formula": "[Formula]",
        "calculation": "[Actual numbers]",
        "result": null
      },
      {
        "stepNumber": 3,
        "description": "[Calculate final result]",
        "formula": null,
        "calculation": "[Final calculation]",
        "result": "[Answer with units]"
      }
    ],
    "notes": "[Additional tips or reminders]"
  }
}
```

---

### 6. Guided Practice Block
**Purpose:** Student attempts with scaffolding ("We Do")  
**When:** After worked example, before independent practice (order: 6)

```json
{
  "id": "[LESSON-ID]-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice (We Do)",
    "problem": "[Problem statement with given information]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Question to guide student]",
        "expectedAnswer": ["[answer1]", "[variation2]", "[alternative3]"],
        "hint": "[Helpful hint if stuck]"
      },
      {
        "stepNumber": 2,
        "prompt": "[Next question]",
        "expectedAnswer": ["[answer]", "[with-units]", "[variations]"],
        "hint": "[Hint for this step]"
      }
    ]
  }
}
```

**Tips:** Include multiple acceptable answer variations (with/without units, different formats)

### Special Rule: Workflow-Based Lessons

**If your lesson teaches a repeatable workplace procedure (3-9 steps), you MUST follow the [Guided Practice Workflow Standard](./GUIDED_PRACTICE_WORKFLOW_STANDARD.md).**

**Decision Tree:**

1. **Does the worked example demonstrate a repeatable workplace procedure?**
   - Examples: BS 7671 lookup, safe isolation, testing routine, fault-finding sequence, circuit selection workflow
   - NOT examples: Single calculation, conceptual explanation, one-off scenario

2. **If YES → Apply Workflow Standard:**
   - Count the workflow steps in your worked example
   - Calculate minimum required prompts: `ROUNDUP(steps × 0.80)`
   - Create Guided Practice prompts that mirror the workflow sequence
   - Include recording/documentation step and escalation/safety check
   - See [GUIDED_PRACTICE_WORKFLOW_STANDARD.md](./GUIDED_PRACTICE_WORKFLOW_STANDARD.md) for complete requirements

3. **If NO → Use Standard Guided Practice:**
   - 2-3 scaffolded questions
   - Focus on applying concepts from the lesson
   - No special workflow coverage requirement

**Quality Gate:** Workflow-based lessons with insufficient Guided Practice coverage (< 80% of workflow steps) must be revised before production.

---

### 7A. Understanding Check Blocks (After Explanations)
**Purpose:** Progressive depth-of-processing questions to reinforce learning immediately after explanation  
**When:** After each major explanation block (order: X.5, e.g., 4.5, 5.5), use 4 questions: 3×L1 (Recall) + 1×L2 (Connection)

```json
{
  "id": "[LESSON-ID]-check-[N]",
  "type": "practice",
  "order": 4.5,
  "content": {
    "title": "Check Your Understanding: [Topic]",
    "mode": "conceptual",
    "sequential": true,
    "questions": [
      {
        "id": "[LESSON-ID]-C1-L1-A",
        "questionText": "[Simple recall question]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Simple factual answer]",
        "hint": "[Gentle hint pointing to explanation]"
      },
      {
        "id": "[LESSON-ID]-C1-L1-B",
        "questionText": "[Another recall question, building on first]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Another fact]",
        "hint": "[Hint]"
      },
      {
        "id": "[LESSON-ID]-C1-L1-C",
        "questionText": "[Third recall question]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Third fact]",
        "hint": "[Hint]"
      },
      {
        "id": "[LESSON-ID]-C1-L2",
        "questionText": "[Connection question relating Q1, Q2, Q3]",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "[Answer showing relationship between previous concepts]",
        "hint": "[Hint about how concepts connect]"
      }
    ]
  }
}
```

**Cognitive Levels:** `recall` (Level 1), `connection` (Level 2), `synthesis` (Level 3 - for integrative only)

**Question Structure:**
- **Q1-3 (Level 1 - Recall):** Simple factual questions building foundational knowledge
- **Q4 (Level 2 - Connection):** Relates the three facts, shows relationships

---

### 7B. Practice Block
**Purpose:** Independent student work ("You Do")  
**When:** After guided practice (order: 7), include 3-5 questions

```json
{
  "id": "[LESSON-ID]-practice",
  "type": "practice",
  "order": 7,
  "content": {
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "[LESSON-ID]-P1",
        "questionText": "[Problem or question]",
        "answerType": "numeric",
        "expectedAnswer": ["[answer]", "[with-unit]", "[variations]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "[LESSON-ID]-P2",
        "questionText": "[Conceptual question]",
        "answerType": "short-text",
        "expectedAnswer": [
          "[key-phrase-1]",
          "[key-phrase-2]",
          "[acceptable-variation]"
        ],
        "hint": "[Hint]"
      }
    ]
  }
}
```

**Answer Types:** `numeric`, `short-text`, `multiple-choice`

---

### 7C. Integrative Question Block (End of Lesson)
**Purpose:** Progressive depth questions tying together all lesson concepts  
**When:** After practice block, before spaced review (order: 7.5 or 9.5)

```json
{
  "id": "[LESSON-ID]-integrative",
  "type": "practice",
  "order": 9.5,
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      {
        "id": "[LESSON-ID]-INT-1",
        "questionText": "[Connection question tying 2-3 major concepts] (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "[Answer showing relationships between major concepts]",
        "hint": "[Hint about connections]"
      },
      {
        "id": "[LESSON-ID]-INT-2",
        "questionText": "[Synthesis question integrating ALL lesson concepts] (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "[Comprehensive answer showing full integration]",
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}
```

**Purpose:** These "Big Picture Questions" provide scaffolding (connection first) before deep synthesis, reinforcing understanding once foundational knowledge is established

---

### 8. Spaced Review Block
**Purpose:** Review prerequisites to strengthen retention  
**When:** End of lesson (order: 8)

```json
{
  "id": "[LESSON-ID]-spaced-review",
  "type": "spaced-review",
  "order": 8,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      "[Question reviewing prerequisite 1]",
      "[Question reviewing prerequisite 2]",
      "[Question reviewing prerequisite 3]",
      "[Question reviewing prerequisite 4]"
    ],
    "notes": "[What concepts these questions review]"
  }
}
```

---

## Block Order Best Practice

**Standard Flow:**
1. Outcomes (set expectations)
2. Vocab (build foundation)
3. Diagram (if applicable - spatial concepts)
4. Explanation (teach concepts)
   - **4.5. Understanding Check** (3×L1 Recall + 1×L2 Connection) - After each major explanation
5. Worked Example (demonstrate)
6. Guided Practice (scaffold)
7. Practice (apply independently)
   - **7.5 or 9.5. Integrative Questions** (Big Picture - 1×L2 Connection + 1×L3 Synthesis)
8. Spaced Review (reinforce prerequisites)

**New Question Structure:**
- **After each explanation:** 4 questions (3×L1 + 1×L2) for immediate reinforcement
- **End of lesson:** 2 integrative questions (1×L2 Connection + 1×L3 Synthesis) to tie everything together

---

## Complete Example Reference

See `202-4A-series-circuits.json` for a fully implemented lesson using this template.

---

## LLM Prompt Strategy

When using an LLM to generate lessons:

1. **Input Required:**
   - Topic/concept to teach
   - Target audience/level
   - Prerequisite knowledge
   - Choose layout type (split-vis vs linear-flow)

2. **LLM Should Generate:**
   - Clear learning outcomes (Bloom's taxonomy)
   - 3-6 key vocabulary terms with definitions
   - Structured explanation breaking down concepts
   - Worked example with 3-4 clear steps
   - Guided practice (2-3 questions for standard lessons, OR workflow-mirror for procedure-based lessons - see GUIDED_PRACTICE_WORKFLOW_STANDARD.md)
   - Independent practice (3-5 varied questions)
   - Spaced review questions from prerequisites

3. **Quality Checks:**
   - All IDs follow naming convention
   - Learning outcomes are measurable
   - Explanations connect to examples
   - Practice difficulty gradually increases
   - All required fields present
   - JSON is valid

---

## Notes

- **Same template works for both layouts** - only change the `layout` field
- **LayoutC (Focus Mode)** uses a completely different structure for quizzes (see below)
- Keep explanations clear and concise
- Use formatting (`**bold**`, `\n\n` for breaks) to improve readability
- Include enough answer variations to catch common student responses
- Hints should guide thinking, not give away answers

---
---

# Quiz Factory: LayoutC (Focus Mode) Template

## Overview
**LayoutC (Focus Mode)** is completely different from lesson layouts. It's designed for quizzes and assessments with minimal distractions. Instead of lesson blocks, it uses an array of **TaggedQuestions** with enhanced metadata for learning analytics and misconception detection.

---

## When to Use LayoutC

| Use Case | Description |
|----------|-------------|
| **End-of-lesson quiz** | Assess understanding after completing a lesson |
| **Unit assessment** | Test multiple learning outcomes across lessons |
| **Practice quiz** | Low-stakes formative assessment |
| **Mock exam** | High-stakes summative assessment simulation |

**Key Features:**
- Locked tutor (no hints during assessment)
- Progress tracking
- Timer display
- Misconception detection
- Full-screen focus mode

---

## Quiz Data Structure

Unlike lessons, quizzes use a **question bank array** rather than JSON files. Questions are stored in TypeScript files and filtered/selected dynamically.

### Base Question Interface

```typescript
interface Question {
  id: number;                    // Unique question ID
  question: string;              // Question text
  options: string[];             // Array of answer options (4 typical)
  correctAnswer: number;         // Index of correct answer (0-3)
  category: string;              // e.g., "Series Circuits"
  section: string;               // e.g., "Science 2365 Level 2"
  image?: string;                // Optional image path
}
```

### TaggedQuestion Interface (Extended)

```typescript
interface TaggedQuestion extends Question {
  // Required Extensions
  tags: QuestionTag[];                    // For filtering/organization
  learningOutcomeId: string;              // Links to lesson outcome
  
  // Optional Learning Metadata
  answerType?: AnswerType;                // 'mcq', 'numeric', 'short-text', etc.
  misconceptionCodes?: {                  // Maps wrong answers to error types
    [answerIndex: number]: MisconceptionCode;
  };
  acceptableAnswers?: string[];           // For non-MCQ questions
  requiredUnits?: string;                 // For numeric answers (e.g., 'Ω', 'V', 'A')
  tolerance?: number;                     // Numeric tolerance (±)
  difficulty?: number;                    // 1-5 scale
  estimatedTime?: number;                 // Seconds to complete
  explanation?: string;                   // Correct answer explanation
}
```

---

## Master Quiz Question Template

```typescript
{
  // ===== CORE FIELDS (Required) =====
  id: [UNIQUE_NUMBER],
  question: "[Clear, unambiguous question text]",
  options: [
    "[Correct answer - place at index matching correctAnswer]",
    "[Distractor 1 - common misconception]",
    "[Distractor 2 - calculation error]",
    "[Distractor 3 - conceptual confusion]"
  ],
  correctAnswer: [0-3],
  section: "[Course/Level identifier]",
  category: "[Topic area]",
  
  // ===== REQUIRED EXTENSIONS =====
  tags: ["[tag1]", "[tag2]", "[tag3]"],
  learningOutcomeId: "[LESSON-ID]-LO[1-3]",
  
  // ===== OPTIONAL BUT RECOMMENDED =====
  answerType: "mcq",
  misconceptionCodes: {
    [WRONG_INDEX_1]: "[MISCONCEPTION_CODE]",
    [WRONG_INDEX_2]: "[MISCONCEPTION_CODE]",
    [WRONG_INDEX_3]: "[MISCONCEPTION_CODE]"
  },
  difficulty: [1-5],
  estimatedTime: [30-120],
  explanation: "[Why correct answer is right, brief explanation]",
  
  // ===== OPTIONAL (for specific types) =====
  requiredUnits: "[unit]",        // If numeric
  tolerance: [0.1],                // If numeric
  acceptableAnswers: ["[alt1]"],   // If short-text
  image: "[path/to/image.png]"     // If visual aid needed
}
```

---

## Field Explanations

### Core Fields

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `id` | ✅ | number | Unique integer ID (use 3000+ for custom) | `3001` |
| `question` | ✅ | string | Clear question text | `"What is the total resistance?"` |
| `options` | ✅ | string[] | Array of 4 answer choices | `["12 Ω", "6 Ω", ...]` |
| `correctAnswer` | ✅ | number | Index of correct option (0-3) | `0` |
| `section` | ✅ | string | Course/level identifier | `"Science 2365 Level 2"` |
| `category` | ✅ | string | Topic/unit name | `"Series Circuits"` |

### Required Extensions

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `tags` | ✅ | QuestionTag[] | 2-4 tags for filtering | `['series', 'calculation', 'resistance-rule']` |
| `learningOutcomeId` | ✅ | string | Links to lesson outcome | `"202-4A-LO3"` |

### Optional Metadata

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `answerType` | ⭐ Recommended | AnswerType | Type of answer format | `"mcq"` |
| `misconceptionCodes` | ⭐ Recommended | object | Maps wrong answers to error types | `{1: 'USED_PARALLEL_RULE'}` |
| `difficulty` | ⭐ Recommended | number (1-5) | Question difficulty | `2` |
| `estimatedTime` | ⭐ Recommended | number (seconds) | Expected completion time | `60` |
| `explanation` | ⭐ Recommended | string | Why answer is correct | `"In series, resistances add..."` |
| `requiredUnits` | ⚪ Optional | string | For numeric answers | `"Ω"` |
| `tolerance` | ⚪ Optional | number | ± tolerance for numeric | `0.1` |
| `acceptableAnswers` | ⚪ Optional | string[] | For text answers | `["single path", "one loop"]` |
| `image` | ⚪ Optional | string | Path to diagram/image | `"/images/series-circuit-1.png"` |

---

## QuestionTag Types

Tags help filter and organize questions. Use 2-4 relevant tags per question.

```typescript
type QuestionTag =
  | 'series'              // Series circuits
  | 'parallel'            // Parallel circuits
  | 'mixed-circuit'       // Combined series/parallel
  | 'ohms-law'            // Uses Ohm's Law (V=IR)
  | 'current-rule'        // About current behavior
  | 'voltage-rule'        // About voltage behavior
  | 'resistance-rule'     // About resistance calculation
  | 'calculation'         // Requires numerical calculation
  | 'discrimination'      // Identify/classify circuit type
  | 'explanation'         // Explain why/how
  | 'conceptual'          // Understanding, not calculation
  | 'application';        // Apply to real scenario
```

**Tagging Strategy:**
1. **Topology tag** (series/parallel/mixed)
2. **Concept tag** (current-rule/voltage-rule/resistance-rule)
3. **Cognitive tag** (calculation/conceptual/explanation/discrimination/application)

**Example:** A question about calculating total resistance in series would use:
- `['series', 'resistance-rule', 'calculation']`

---

## MisconceptionCode Types

Misconception codes identify **why** a student got an answer wrong, enabling targeted feedback.

```typescript
type MisconceptionCode =
  | 'USED_PARALLEL_RULE'        // Applied parallel formula in series context
  | 'USED_SERIES_RULE'          // Applied series formula in parallel context
  | 'UNITS_MISSING'             // Answer correct but units omitted
  | 'WRONG_UNITS'               // Incorrect unit (e.g., mA instead of A)
  | 'MULTIPLIED_INSTEAD'        // Multiplied when should add/divide
  | 'DIVIDED_INSTEAD'           // Divided when should multiply/add
  | 'RECIPROCAL_ERROR'          // Forgot reciprocal in parallel formula
  | 'SIGN_ERROR'                // Plus/minus error
  | 'ROUNDING_ERROR'            // Excessive rounding caused error
  | 'FORMULA_NOT_REARRANGED'    // Used V=IR without rearranging
  | 'CONFUSED_I_V_R'            // Mixed up I, V, R positions
  | 'TOPOLOGY_CONFUSION'        // Couldn't identify series vs parallel
  | 'OTHER';                    // Other/unknown error
```

**How to Use:**
Map each wrong answer index to the misconception it represents.

```typescript
misconceptionCodes: {
  1: 'USED_PARALLEL_RULE',      // Option 1 is wrong because they used parallel formula
  2: 'MULTIPLIED_INSTEAD',       // Option 2 is wrong because they multiplied
  3: 'RECIPROCAL_ERROR'          // Option 3 is wrong because they messed up reciprocal
}
```

---

## AnswerType Types

```typescript
type AnswerType =
  | 'mcq'           // Multiple choice (default)
  | 'numeric'       // Numeric answer with units
  | 'short-text'    // Short text response
  | 'step-by-step'  // Multi-step structured answer
  | 'true-false'    // True/false
  | 'matching';     // Match pairs
```

**Note:** LayoutC currently supports **MCQ only**, but the type system is extensible for future formats.

---

## Complete Example Questions

### Example 1: Basic Calculation (Easy)

```typescript
{
  id: 3001,
  question: "R1 = 5 Ω and R2 = 7 Ω are connected in series. Calculate the total resistance.",
  options: [
    "12 Ω",           // Correct
    "2 Ω",            // Subtracted instead
    "35 Ω",           // Multiplied instead
    "2.9 Ω"           // Used parallel formula
  ],
  correctAnswer: 0,
  section: "Science 2365 Level 2",
  category: "Series Circuits",
  tags: ['series', 'resistance-rule', 'calculation'],
  learningOutcomeId: "202-4A-LO3",
  answerType: 'mcq',
  misconceptionCodes: {
    1: 'USED_PARALLEL_RULE',
    2: 'MULTIPLIED_INSTEAD',
    3: 'RECIPROCAL_ERROR'
  },
  requiredUnits: 'Ω',
  difficulty: 2,
  estimatedTime: 60,
  explanation: "In series, resistances ADD: R_total = R1 + R2 = 5 + 7 = 12 Ω"
}
```

### Example 2: Conceptual Understanding (Medium)

```typescript
{
  id: 3002,
  question: "Why is the current the same everywhere in a series circuit?",
  options: [
    "Because there is only one path with no branches",    // Correct
    "Because resistance is equal in all components",      // Confused concept
    "Because voltage is the same across all components",  // Parallel behavior
    "Because of Ohm's Law"                                // Too vague
  ],
  correctAnswer: 0,
  section: "Science 2365 Level 2",
  category: "Series Circuits",
  tags: ['series', 'current-rule', 'explanation', 'conceptual'],
  learningOutcomeId: "202-4A-LO2",
  answerType: 'mcq',
  misconceptionCodes: {
    1: 'CONFUSED_I_V_R',
    2: 'TOPOLOGY_CONFUSION',
    3: 'OTHER'
  },
  difficulty: 2,
  estimatedTime: 60,
  explanation: "Current is the same everywhere in series because there's only one path for charge to flow. Like water in a single pipe."
}
```

### Example 3: Application (Harder)

```typescript
{
  id: 3003,
  question: "Three 6 Ω resistors in series are connected to a 18V supply. What is the current through each resistor?",
  options: [
    "1 A",            // Correct: 18V / 18Ω = 1A
    "3 A",            // Divided voltage by single resistor
    "6 A",            // Used voltage value directly
    "0.33 A"          // Used parallel calculation
  ],
  correctAnswer: 0,
  section: "Science 2365 Level 2",
  category: "Series Circuits",
  tags: ['series', 'calculation', 'application', 'current-rule', 'ohms-law'],
  learningOutcomeId: "202-4A-LO3",
  answerType: 'mcq',
  misconceptionCodes: {
    1: 'OTHER',
    2: 'FORMULA_NOT_REARRANGED',
    3: 'USED_PARALLEL_RULE'
  },
  requiredUnits: 'A',
  difficulty: 4,
  estimatedTime: 120,
  explanation: "Total resistance = 6 + 6 + 6 = 18 Ω. Current I = V/R = 18/18 = 1 A. In series, current is same through all resistors, so each gets 1 A."
}
```

---

## Question Bank Organization

Questions are organized in TypeScript files, not JSON. This allows for better type checking and reusability.

### File Structure

```
src/data/questions/
  ├── types.ts                        # Type definitions
  ├── seriesCircuitsQuestions.ts      # Series circuit questions
  ├── parallelCircuitsQuestions.ts    # Parallel circuit questions
  └── ...
```

### Question Bank File Template

```typescript
import { TaggedQuestion } from './types';

/**
 * [Topic] Question Bank
 * Aligned with lesson [LESSON-ID] learning outcomes
 */

export const [topicName]Questions: TaggedQuestion[] = [
  // ===== DISCRIMINATION QUESTIONS (Difficulty 1-2) =====
  {
    // Questions that test identification/classification
    // tags: [..., 'discrimination', ...]
  },
  
  // ===== CONCEPTUAL QUESTIONS (Difficulty 1-3) =====
  {
    // Questions testing understanding without calculation
    // tags: [..., 'conceptual', 'explanation', ...]
  },
  
  // ===== CALCULATION QUESTIONS (Difficulty 2-4) =====
  {
    // Questions requiring numerical calculation
    // tags: [..., 'calculation', ...]
  },
  
  // ===== APPLICATION QUESTIONS (Difficulty 3-5) =====
  {
    // Questions applying concepts to scenarios
    // tags: [..., 'application', ...]
  }
];
```

---

## Creating Distractors (Wrong Answers)

Good distractors represent **actual student misconceptions**, not random wrong answers.

### Distractor Design Principles

1. **Systematic Error** - Result of applying wrong formula/method
   - Example: Using parallel formula in series
   - Maps to: `USED_PARALLEL_RULE`

2. **Calculation Error** - Arithmetic mistake
   - Example: Multiplying instead of adding
   - Maps to: `MULTIPLIED_INSTEAD` or `DIVIDED_INSTEAD`

3. **Conceptual Confusion** - Misunderstanding concept
   - Example: Thinking current divides in series
   - Maps to: `TOPOLOGY_CONFUSION`

4. **Partial Understanding** - Right approach, wrong execution
   - Example: Forgetting reciprocal in parallel
   - Maps to: `RECIPROCAL_ERROR`

### Distractor Template for Calculation Questions

For a question asking to calculate total resistance in series (correct: 12 Ω):

```typescript
options: [
  "12 Ω",          // Correct: R1 + R2 = 5 + 7
  "35 Ω",          // MULTIPLIED_INSTEAD: 5 × 7
  "2.9 Ω",         // USED_PARALLEL_RULE: 1/(1/5 + 1/7)
  "2 Ω"            // DIVIDED_INSTEAD or subtracted: 7 - 5
]
```

---

## Difficulty Levels

| Level | Description | Cognitive Load | Time | Example |
|-------|-------------|----------------|------|---------|
| **1** | Recognition, recall | Low | 30-45s | "Which formula is for series?" |
| **2** | Simple application | Medium-Low | 45-60s | "Calculate R_total for R1=5, R2=7" |
| **3** | Multi-step or conceptual | Medium | 60-90s | "Find voltage drop given supply and R1" |
| **4** | Complex application | Medium-High | 90-120s | "Calculate current using series rules + Ohm's Law" |
| **5** | Novel scenarios, synthesis | High | 120+s | "Design circuit to meet specifications" |

---

## LLM Prompt Strategy for Quiz Generation

### Input Required

```
- Lesson ID and title
- Learning outcomes to assess (with Bloom levels)
- Number of questions: 50 (standard for comprehensive assessment)
- Difficulty distribution: 30% easy, 50% medium, 20% hard (15/25/10 questions)
- Question type mix (e.g., 30% conceptual, 70% calculation)
```

### LLM Should Generate

For each question:
1. **Clear question text** - Unambiguous, standalone
2. **One correct answer** - Clearly and definitively correct
3. **Three plausible distractors** - Based on real misconceptions
4. **Appropriate tags** - 2-4 relevant tags
5. **Misconception codes** - Map each distractor to error type
6. **Explanation** - Brief rationale for correct answer
7. **Difficulty rating** - Based on cognitive load
8. **Estimated time** - Realistic completion time

### Quality Checks

- [ ] Question is clear and unambiguous
- [ ] Correct answer is definitively correct
- [ ] All distractors are plausible (not obviously wrong)
- [ ] Each distractor maps to a misconception code
- [ ] Tags accurately describe the question
- [ ] Learning outcome ID matches lesson
- [ ] Difficulty matches question complexity
- [ ] Estimated time is reasonable
- [ ] Explanation is clear and educational
- [ ] All options are parallel in structure/length
- [ ] No trick questions or ambiguity

---

## Using Questions in LayoutC

Questions are passed to LayoutC dynamically:

```typescript
// Filter questions by lesson (regular quiz)
const quizQuestions = seriesCircuitsQuestions.filter(
  q => q.learningOutcomeId.startsWith('202-4A')
);

// OR get cumulative questions (current + all previous in unit)
import { getCumulativeQuestions } from '@/lib/questions/cumulativeQuestions';
const cumulativeQuestions = getCumulativeQuestions('202-4A');

// Render quiz
<LayoutC
  quizId="202-4A-quiz"
  quizTitle="Series Circuits Quiz"
  questions={quizQuestions}
  onComplete={(results) => {
    // Handle quiz completion
    // results includes score, misconceptions detected, etc.
  }}
/>
```

---

## Cumulative / Interleaving Quizzes

### Overview
In addition to regular lesson-specific quizzes, the system supports **cumulative quizzes** that combine questions from the current lesson with all previous lessons in the same unit.

### Features
- **Automatic generation** - No additional quiz files needed
- **Within-unit only** - Unit 202 lessons only mix with other Unit 202 lessons
- **50/50 split** - Default: 10 questions from current lesson, 10 from previous lessons
- **Smart sampling** - Randomly samples from question pools to ensure variety
- **Spaced repetition** - Each new lesson naturally reviews all earlier content
- **Visual distinction** - Orange "Cumulative" button vs blue "Quiz" button

### Access
Students access cumulative quizzes via the orange "🔄 Cumulative" button on lesson pages:
- `/learn/[lessonId]/quiz` - Regular quiz (current lesson only)
- `/learn/[lessonId]/quiz?mode=cumulative` - Cumulative quiz (current + previous)

### Question Selection Logic
```typescript
// Example: Lesson 202-4B (4th lesson in Unit 202)
// Cumulative quiz includes:
// - 202-1A (Electrical Quantities)
// - 202-2A (Ohm's Law)
// - 202-4A (Series Circuits)
// - 202-4B (Series Circuits Extended) ← current

// Result: ~20 questions
// - 10 from 202-4B (current, 50%)
// - 10 from 202-1A, 202-2A, 202-4A combined (previous, 50%)
// - Shuffled for proper interleaving
```

### Benefits for Learning
1. **Built-in spaced repetition** - Previous content reviewed automatically
2. **Discrimination practice** - Students must identify which concept applies
3. **Exam preparation** - Mimics real exam conditions (mixed topics)
4. **Early warning system** - Poor performance indicates gaps in earlier lessons

### Implementation
Cumulative quizzes use the same question banks - no additional question authoring required. The system:
1. Identifies current lesson's position in unit
2. Gets all previous lessons in same unit (by order)
3. Samples questions with configurable weighting
4. Shuffles for true interleaving effect

**See:** `CUMULATIVE_QUIZ_IMPLEMENTATION.md` for complete technical details.

---

## Testing Cumulative / Interleaving Quizzes

### Required Tests for Each New Lesson

When generating a new lesson, verify both quiz modes work correctly:

**Test 1: Regular Quiz (Blue Button)**
1. Navigate to `/learn/[lessonId]`
2. Click blue "Quiz" button
3. Verify: Only shows questions from current lesson
4. Complete quiz and verify grading works

**Test 2: Cumulative Quiz (Orange Button)**
1. Navigate to `/learn/[lessonId]`
2. Click orange "🔄 Cumulative" button
3. Verify: Shows mix of current + previous lessons in unit
4. Check header shows orange "Cumulative" badge
5. Verify question count is appropriate (~20 questions)
6. Complete quiz and verify grading works

**Test 3: First Lesson in Unit**
1. If lesson is first in its unit (e.g., 202-1A, 201-1A)
2. Cumulative quiz should work without errors
3. Should show only current lesson questions (no previous to include)

**Test 4: Question Quality**
1. Questions should be properly shuffled (not blocked by lesson)
2. Should see variety from different lessons (if not first lesson)
3. Questions should not repeat within same quiz attempt

### Validation Checklist

```
Cumulative Quiz Validation for [LESSON-ID]:
- [ ] Orange cumulative button visible on lesson page
- [ ] Blue regular quiz button still visible and functional
- [ ] Cumulative button has 🔄 icon
- [ ] Tooltip explains functionality
- [ ] Clicking cumulative button loads quiz at /learn/[lessonId]/quiz?mode=cumulative
- [ ] Quiz header shows orange "Cumulative" badge
- [ ] Header shows "Current Lesson + N previous" (if not first lesson)
- [ ] Question count is appropriate:
  - First lesson: ~10-15 questions (current only)
  - Later lessons: ~20 questions (50/50 split)
- [ ] Questions are properly mixed (not all from one lesson, then another)
- [ ] Only includes lessons from same unit (no cross-unit mixing)
- [ ] Grading works correctly
- [ ] Results screen shows appropriate feedback
- [ ] Both quiz modes work independently (no interference)
```

### Common Issues to Check

**Issue: Cumulative quiz shows same questions as regular quiz**
- Check: Is this the first lesson in the unit? (Expected behavior)
- Check: Are there questions from previous lessons in the unit?

**Issue: Cumulative quiz crashes or shows no questions**
- Check: Are all previous lessons properly registered in `lessonIndex.ts`?
- Check: Do previous lessons have questions in the question bank?
- Check: Is the `order` field correctly set in `lessonIndex.ts`?

**Issue: Questions are blocked (all from one lesson, then another)**
- Check: Is the shuffle function working? (Should see mixed questions)

**Issue: Cumulative quiz includes questions from different unit**
- Check: `unitNumber` field in `lessonIndex.ts` must match correctly
- Check: Questions are being filtered by unit properly

---

## Complete Reference Example

See `electricalQuantitiesQuestions.ts` for a fully implemented question bank with 50 questions covering all difficulty levels and question types. This is the standard quiz size for comprehensive assessment.

---

## Summary: Lesson vs Quiz Templates

| Aspect | Lesson (LayoutA/B) | Quiz (LayoutC) |
|--------|-------------------|----------------|
| **File Format** | JSON | TypeScript array |
| **Data Structure** | Blocks (outcomes, vocab, etc.) | TaggedQuestion array |
| **Purpose** | Teaching content | Assessment |
| **Tutor** | Always available | Locked during quiz |
| **Interactivity** | Read, practice, learn | Answer & submit only |
| **Feedback** | Immediate with hints | After submission only |
| **Layout** | Split-vis or Linear-flow | Focus mode (single column) |

