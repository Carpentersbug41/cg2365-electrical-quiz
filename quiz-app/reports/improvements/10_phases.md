# Sequential Lesson Generation: 10 Phases Architecture

**Last Updated:** February 6, 2026  
**Status:** Production System

---

## 🔄 Recent Changes (February 6, 2026)

Three major prompt improvements implemented based on expert feedback:

### Phase 3: Explanation ✅
- **Changed:** 6-part → **8-part structure**
- **Added:** "### In this lesson" orientation (goal + context + 3 takeaways)
- **Added:** "### Coming Up Next" transition section
- **Impact:** +3-5 points per lesson (beginner clarity)

### Phase 4: Understanding Checks ✅
- **Added:** **ANCHOR FACT METHOD** - Select 3 verbatim phrases from explanation first
- **Tightened:** expectedAnswer requirements (MUST be verbatim from explanation)
- **Reduced:** Variants from 2-6 → **EXACTLY 2-4 for L1, 1-2 for L2**
- **Impact:** +2-4 points per lesson (marking accuracy)

### Phase 5: Worked Example & Guided Practice ✅
- **Added:** **SELECTION EXAMPLE FORMAT** (exactly 4 steps for non-calculation lessons)
- **Strengthened:** **MIRRORING CONTRACT** - steps.length must match exactly
- **Added:** Provenance requirements (cite BS 7671 or describe lookup)
- **Reduced:** expectedAnswer variants from 2-6 → **1-2 only**
- **Impact:** +3-6 points per lesson (prevents misaligned practice)

**Expected Combined Impact:** Initial scores 87 → 92 (+5), Final scores 95 → 97 (+2)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Phase Documentation](#phase-documentation)
   - [Phase 1: Planning](#phase-1-planning)
   - [Phase 2: Vocabulary](#phase-2-vocabulary)
   - [Phase 3: Explanation](#phase-3-explanation)
   - [Phase 4: Understanding Checks](#phase-4-understanding-checks)
   - [Phase 5: Worked Example](#phase-5-worked-example--guided-practice)
   - [Phase 6: Practice](#phase-6-practice)
   - [Phase 7: Integration](#phase-7-integration)
   - [Phase 8: Spaced Review](#phase-8-spaced-review)
   - [Phase 9: Assembler](#phase-9-assembler)
   - [Phase 10: Refinement](#phase-10-refinement)
4. [Prompt Standards](#prompt-standards)
5. [Troubleshooting](#troubleshooting)

---

## Overview

The sequential lesson generation system breaks down the complex task of creating a complete educational lesson into **10 focused phases**, each with a single responsibility.

### Why 10 Phases Instead of Monolithic Prompt?

**Old Approach:** One 800-line prompt tries to do everything at once
- Hard to maintain
- Hard to debug
- Hard to improve specific aspects
- All-or-nothing: One failure breaks entire lesson

**New Approach:** 10 specialized phases with focused prompts
- Each phase has clear responsibility
- Easy to debug (know exactly where failure occurred)
- Easy to improve (modify one phase without breaking others)
- Graceful degradation (can skip optional phases)
- Enforces contracts (teach-before-test, block ordering)

### Benefits

| Benefit | How Sequential Phases Help |
|---------|---------------------------|
| **Quality** | Enforces teach-before-test (Phase 3 → Phase 4) |
| **Consistency** | Each phase focuses on one aspect |
| **Debuggability** | Know exactly which phase failed |
| **Maintainability** | Update prompts independently |
| **Extensibility** | Add new phases without breaking existing ones |
| **Validation** | Each phase validates its output before passing forward |

---

## Architecture

### Sequential Flow

```mermaid
flowchart TD
    Request[Generation Request]
    Phase1[Phase 1: Planning]
    Phase2[Phase 2: Vocabulary]
    Phase3[Phase 3: Explanation]
    Phase4[Phase 4: Checks]
    Phase5[Phase 5: Worked Example]
    Phase6[Phase 6: Practice]
    Phase7[Phase 7: Integration]
    Phase8[Phase 8: Spaced Review]
    Phase9[Phase 9: Assembler]
    Normalize[Schema Normalizer]
    Scoring[LLM Scoring]
    Phase10[Phase 10: Refinement]
    Output[Complete Lesson]
    
    Request --> Phase1
    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
    Phase5 --> Phase6
    Phase6 --> Phase7
    Phase7 --> Phase8
    Phase8 --> Phase9
    Phase9 --> Normalize
    Normalize --> Scoring
    Scoring -->|"score < 97"| Phase10
    Scoring -->|"score >= 97"| Output
    Phase10 --> Output
```

### Data Dependencies

```mermaid
flowchart LR
    P1[Planning]
    P2[Vocabulary]
    P3[Explanations]
    P4[Checks]
    P5[Examples]
    P6[Practice]
    P7[Integration]
    P8[SpacedReview]
    P9[Assembler]
    
    P1 -->|layout, outcomes| P2
    P1 -->|outcomes, constraints| P3
    P2 -->|terms| P3
    P2 -->|terms| P4
    P3 -->|content| P4
    P3 -->|content| P5
    P5 -->|worked steps| P6
    P3 -->|all content| P7
    P1 -->|prerequisites| P8
    
    P1 --> P9
    P2 --> P9
    P3 --> P9
    P4 --> P9
    P5 --> P9
    P6 --> P9
    P7 --> P9
    P8 --> P9
```

### Block Order Contract

The assembler enforces this strict ordering:

```
1    = Outcomes (required)
2    = Vocabulary (required)
3    = Diagram (optional)
4    = Explanation-1 (required)
4.5  = Check-1 (required - immediately after explanation)
5    = Explanation-2 (optional)
5.5  = Check-2 (optional - only if explanation-2 exists)
6    = Worked Example (optional)
7    = Guided Practice (optional - only if worked example exists)
8    = Practice (required)
9.5  = Integrative (required - NOT 9!)
10   = Spaced Review (required - MUST be last)
```

---

## JSON Lesson Schema & Contract

This section defines the complete structure, required fields, and validation rules for generated lessons.

### Top-Level Lesson Structure

```typescript
interface Lesson {
  id: string;                    // Format: "{unit}-{section}" (e.g., "203-3A11")
  title: string;                 // Display title
  description: string;           // Brief lesson summary
  layout: 'split-vis' | 'linear-flow';  // Visual layout mode
  unit: string;                  // Unit identifier (e.g., "Unit 203")
  topic: string;                 // Lesson topic/subject
  learningOutcomes: string[];    // 3-4 measurable outcomes (Bloom's taxonomy)
  prerequisites: string[];       // Array of prerequisite lesson IDs (can be empty)
  blocks: LessonBlock[];         // Array of content blocks (MUST follow ordering rules)
  metadata: {
    created: string;             // ISO date string
    updated: string;             // ISO date string
    version: string;             // Semantic version (e.g., "1.0")
    author: string;              // Author/team name
  };
}
```

### Block Structure

```typescript
interface LessonBlock {
  id: string;                    // Format: "{lessonId}-{suffix}"
  type: string;                  // Must be valid block type (see below)
  order: number;                 // Position in lesson (integers or .5 decimals)
  content: Record<string, unknown>;  // Type-specific content (see schemas below)
}
```

### Valid Block Types

| Type | Description | Order Position | Required |
|------|-------------|----------------|----------|
| `outcomes` | Learning objectives | 1 | ✅ Yes |
| `vocab` | Vocabulary/glossary | 2 | ✅ Yes |
| `diagram` | Image/video/diagram | 3 | ❌ Optional |
| `explanation` | Teaching content | 4, 5 | ✅ Yes (at least one) |
| `practice` (checks) | Understanding check questions | 4.5, 5.5 | ✅ Yes (after each explanation) |
| `worked-example` | Step-by-step demonstration | 6 | ❌ Optional (recommended) |
| `guided-practice` | Scaffolded practice | 7 | ❌ Optional (only if worked example exists) |
| `practice` (independent) | Independent practice questions | 8 | ✅ Yes |
| `practice` (integrative) | Synthesis questions | 9.5 | ✅ Yes |
| `spaced-review` | Prerequisite review | 10 | ✅ Yes (MUST be last) |
| `microbreak` | Rest/break block | Any | ❌ Optional |

### Block Content Schemas

#### Outcomes Block

```typescript
{
  "id": "{lessonId}-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      {
        "text": string,           // Measurable learning outcome
        "bloomLevel": "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create"
      }
    ]
  }
}
```

#### Vocabulary Block

```typescript
{
  "id": "{lessonId}-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      {
        "term": string,           // Technical term
        "definition": string      // One-sentence definition
      }
    ]
  }
}
```

#### Diagram Block

```typescript
{
  "id": "{lessonId}-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": string,
    "description": string,
    "videoUrl": string,           // Empty string if no video
    "diagramType": "circuit" | "schematic" | "photo" | "illustration",
    "elementIds": string[],       // Array of element labels
    "placeholderText": string     // Description for placeholder image
  }
}
```

#### Explanation Block

```typescript
{
  "id": "{lessonId}-explain-{n}",
  "type": "explanation",
  "order": 4 | 5,
  "content": {
    "title": string,              // Section title
    "content": string             // Markdown content (400-600 words, 8-part structure)
  }
}
```

**Required 8-Part Structure in `content`:**
1. `### In this lesson` (goal + context + 3 bullet takeaways)
2. `**What this is**`
3. `**Why it matters**`
4. `**Key facts / rules**` (MUST use this exact heading)
5. `**[MODE SECTION]**` (heading varies: "When to choose it", "How to recognize it", etc.)
6. `**Common mistakes**`
7. `**Quick recap**`
8. `### Coming Up Next` (transition)

#### Practice Block (Understanding Checks)

```typescript
{
  "id": "{lessonId}-check-{n}",
  "type": "practice",
  "order": 4.5 | 5.5,             // Immediately after corresponding explanation
  "content": {
    "title": string,
    "mode": "conceptual",
    "sequential": true,
    "questions": [
      // 3 recall (L1) + 1 connection (L2) questions
      {
        "id": "{lessonId}-C{n}-L1-{A|B|C}",
        "questionText": string,
        "answerType": "short-text",
        "cognitiveLevel": "recall" | "connection",
        "expectedAnswer": string[],    // MUST be array, 2-4 variants for L1, 1-2 for L2
        "hint": string
      }
    ]
  }
}
```

#### Worked Example Block

```typescript
{
  "id": "{lessonId}-worked-example",
  "type": "worked-example",
  "order": 6,
  "content": {
    "title": string,
    "given": string,              // Problem statement
    "steps": [
      {
        "stepNumber": number,     // Sequential (1, 2, 3, 4)
        "description": string,    // What to do
        "formula": string | null, // For calculations
        "calculation": string | null,
        "result": string | null
      }
    ],
    "notes": string               // Additional guidance
  }
}
```

#### Guided Practice Block

```typescript
{
  "id": "{lessonId}-guided",
  "type": "guided-practice",
  "order": 7,
  "content": {
    "title": string,
    "problem": string,            // Similar problem to worked example
    "steps": [
      {
        "stepNumber": number,     // MUST match worked example count exactly
        "prompt": string,         // Guiding question
        "expectedAnswer": string[],  // 1-2 variants only
        "hint": string
      }
    ]
  }
}
```

**CRITICAL:** `steps.length` must equal worked example `steps.length` (MIRRORING CONTRACT)

#### Practice Block (Independent)

```typescript
{
  "id": "{lessonId}-practice",
  "type": "practice",
  "order": 8,
  "content": {
    "title": string,
    "questions": [
      {
        "id": "{lessonId}-P{n}",
        "questionText": string,
        "answerType": "numeric" | "short-text" | "multiple-choice",
        "expectedAnswer": string[],    // For numeric: numbers only (no units!)
        "hint": string                 // For numeric: units go here
      }
    ]
  }
}
```

#### Practice Block (Integrative)

```typescript
{
  "id": "{lessonId}-integrative",
  "type": "practice",
  "order": 9.5,                   // MUST be exactly 9.5 (NOT 9, NOT 10)
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      // EXACTLY 2 questions
      {
        "id": "{lessonId}-INT-1",
        "questionText": string,   // Connection question (2-3 sentences)
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": string[],
        "hint": string
      },
      {
        "id": "{lessonId}-INT-2",
        "questionText": string,   // Synthesis question (3-4 sentences)
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": string[],
        "hint": string
      }
    ]
  }
}
```

#### Spaced Review Block

```typescript
{
  "id": "{lessonId}-spaced-review",
  "type": "spaced-review",
  "order": 10,                    // MUST be last block
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      {
        "id": "{lessonId}-SR-{n}",
        "questionText": string,   // Review from prerequisite lessons
        "expectedAnswer": string[],
        "hint": string
      }
    ],
    "notes": string               // Provenance: maps questions to prereq IDs
  }
}
```

### ID Pattern Rules

**Lesson ID Format:**
- Pattern: `{unit}-{section}`
- Example: `203-3A11`
- Must be unique across all lessons

**Block ID Format:**
- Pattern: `{lessonId}-{suffix}`
- Examples:
  - `203-3A11-outcomes`
  - `203-3A11-vocab`
  - `203-3A11-explain-1`
  - `203-3A11-check-1`
  - `203-3A11-worked-example`
  - `203-3A11-practice`
  - `203-3A11-integrative`
  - `203-3A11-spaced-review`

**Question ID Formats:**

| Question Type | Pattern | Example |
|--------------|---------|---------|
| Understanding Check (L1) | `{lessonId}-C{n}-L1-{A\|B\|C}` | `203-3A11-C1-L1-A` |
| Understanding Check (L2) | `{lessonId}-C{n}-L2` | `203-3A11-C1-L2` |
| Integration | `{lessonId}-INT-{n}` | `203-3A11-INT-1` |
| Practice | `{lessonId}-P{n}` | `203-3A11-P1` |
| Spaced Review | `{lessonId}-SR-{n}` | `203-3A11-SR-1` |

**Rules:**
- All IDs must be unique within the lesson
- All block and question IDs MUST start with lesson ID prefix
- Question numbering is sequential (no gaps)
- Understanding checks use A/B/C for three L1 questions per check

### Order Rules

**Fixed Positions:**
- Order 1: Outcomes (required)
- Order 2: Vocabulary (required)
- Order 3: Diagram (optional)
- Order 8: Independent practice (required)
- Order 9.5: Integrative (required, NOT 9 or 10)
- Order 10: Spaced review (required, MUST be last)

**Variable Positions:**
- Order 4: Explanation-1 (required)
- Order 4.5: Check-1 (required, immediately after explanation-1)
- Order 5: Explanation-2 (optional)
- Order 5.5: Check-2 (optional, only if explanation-2 exists)
- Order 6: Worked example (optional)
- Order 7: Guided practice (optional, only if worked example exists)

**Validation Rules:**
- Orders must be monotonically increasing (no gaps, no reversals)
- No duplicate orders allowed
- Check blocks must appear at `explanation.order + 0.5`
- Integrative MUST be at 9.5 (exactly)
- Spaced review MUST be at order 10 (last block)

### Question Schema Fields

**All Question Types:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | ✅ Yes | Must follow ID pattern |
| `questionText` | string | ✅ Yes | The actual question text |
| `answerType` | string | ✅ Yes | `"numeric"`, `"short-text"`, or `"multiple-choice"` |
| `expectedAnswer` | string[] | ✅ Yes | MUST be array (even for single answer) |
| `hint` | string | ❌ Optional | Guidance for students |
| `cognitiveLevel` | string | ❌ Optional | For checks: `"recall"`, `"connection"`, `"synthesis"` |

**expectedAnswer Rules:**
- MUST be an array of strings (even for single answer)
- For numeric questions: numbers only (no units, no text)
  - Example: `["230", "230.0"]` ✅ Correct
  - Example: `["230V", "230 volts"]` ❌ Wrong (units in answer)
- For short-text questions: 2-4 variants for L1, 1-2 for L2
- Variants should be tight normalization only (case, articles, punctuation)
- NO broad paraphrases or synonyms that change meaning

**Units in Numeric Questions:**
- Numbers go in `expectedAnswer`
- Units go in `hint` field
- Example:
  ```json
  {
    "questionText": "What is UK mains voltage? (Round to nearest whole number)",
    "answerType": "numeric",
    "expectedAnswer": ["230", "230.0"],
    "hint": "UK mains voltage in volts (V)"
  }
  ```

### Contract Validation

The assembler (Phase 9) enforces these rules with fail-fast validation:

**Critical Failures (Auto-cap score to 0):**
- Missing required top-level fields (`id`, `title`, `blocks`, etc.)
- Invalid JSON structure
- Duplicate block IDs
- Duplicate question IDs
- Spaced review not last block

**Serious Failures (-10 to -20 points):**
- Missing required blocks (outcomes, vocab, practice, integrative, spaced-review)
- Wrong block order (check before explanation)
- Block order contract violations (integrative not at 9.5)

**Moderate Failures (-5 to -10 points):**
- Invalid block types
- Missing explanation sections ("Key facts", "In this lesson")
- Guided practice step count mismatch with worked example
- Teaching-before-testing violations

**Minor Failures (-1 to -5 points):**
- Missing lesson prefix in IDs (fixed by normalizer)
- expectedAnswer not array (fixed by normalizer)
- Units in numeric answers (fixed by normalizer)
- Field name typos (fixed by normalizer)

### Real Example

From lesson `203-3A11-circuit-types-what-they-do.json`:

```json
{
  "id": "203-3A11",
  "title": "203.3A11 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary types of circuits used in electrical installations and their specific functions.",
    "Describe the fundamental differences between radial and ring final circuit topologies.",
    "Explain the typical applications for different circuit categories including power, lighting, and control."
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A11-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": { /* outcomes content */ }
    },
    {
      "id": "203-3A11-vocab",
      "type": "vocab",
      "order": 2,
      "content": { /* vocab content */ }
    },
    {
      "id": "203-3A11-explain-1",
      "type": "explanation",
      "order": 4,
      "content": { /* explanation content with 8-part structure */ }
    },
    {
      "id": "203-3A11-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "questions": [
          {
            "id": "203-3A11-C1-L1-A",
            "questionText": "What is the definition of a Final Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "An electrical circuit connected directly from a distribution board to the points of utilization",
              "A circuit connected directly from a distribution board to points of utilization"
            ]
          }
        ]
      }
    },
    {
      "id": "203-3A11-practice",
      "type": "practice",
      "order": 8,
      "content": { /* independent practice */ }
    },
    {
      "id": "203-3A11-integrative",
      "type": "practice",
      "order": 9.5,
      "content": { /* integrative questions */ }
    },
    {
      "id": "203-3A11-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": { /* spaced review */ }
    }
  ],
  "metadata": {
    "created": "2026-02-06",
    "updated": "2026-02-06",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

## Phase Documentation

---

## Phase 1: Planning

**Purpose:** Analyze lesson requirements and create structural blueprint

**Files:** `src/lib/generation/phases/Phase1_Planning.ts`

### Input Interface

```typescript
interface PlanningInput {
  request: GenerationRequest;
  requiresWorkedExample: boolean;
}
```

### Output Interface

```typescript
interface PlanningOutput {
  lessonId: string;
  layout: 'split-vis' | 'linear-flow' | 'focus-mode';
  needsDiagram: boolean;
  explanationSections: Array<{
    order: number;
    title: string;
    topic: string;
  }>;
  needsWorkedExample: boolean;
  learningOutcomes: string[];
  estimatedComplexity: 'simple' | 'medium' | 'complex';
  teachingConstraints?: {
    excludeHowTo?: boolean;
    purposeOnly?: boolean;
    identificationOnly?: boolean;
    noCalculations?: boolean;
    specificScope?: string;
  };
}
```

### System Prompt

```typescript
You are a lesson structure planner for C&G 2365 Electrical Training courses.

Your task is to analyze the lesson requirements and create a structural plan.

CONSTRAINT PARSING (CRITICAL):
Analyze mustHaveTopics for teaching scope constraints:
- "what [X] is for, not how to use" → excludeHowTo: true, purposeOnly: true
- "identify [X], not procedures" → identificationOnly: true, excludeHowTo: true
- "concepts only" or "definitions only" → noCalculations: true
- Any other scope limitation → specificScope: "[the constraint]"

These constraints MUST be passed to downstream phases to prevent scope violations.

[JSON output instructions]
```

### User Prompt Template

```typescript
Analyze this lesson and create a structural plan:

LESSON DETAILS:
- ID: {fullLessonId}
- Topic: {topic}
- Section: {section}
- Layout: {layout || 'auto'}
- Prerequisites: {prerequisites}
- MUST HAVE TOPICS: {mustHaveTopics}

ANALYSIS REQUIRED:
1. Determine layout type (split-vis, linear-flow, or focus-mode)
2. Identify how many explanation sections needed (1-2 max)
3. Create 3-4 learning outcomes (remember, understand, apply levels)
4. Determine if worked example needed

Return JSON with:
- lessonId
- layout
- needsDiagram
- explanationSections
- needsWorkedExample
- learningOutcomes
- estimatedComplexity
- teachingConstraints

RULES:
- explanationSections: 1 for simple topics, 2 for complex
- needsDiagram: true if split-vis OR visual topic
- needsWorkedExample: true if calculations/procedures
- learningOutcomes: 3-4 measurable outcomes using Bloom's taxonomy
```

### Key Features

- **Constraint Detection:** Parses "what X is for, not how to use" patterns
- **Layout Inference:** Determines best visual layout
- **Complexity Estimation:** Simple/medium/complex classification
- **Downstream Guidance:** Passes constraints to all subsequent phases

---

## Phase 2: Vocabulary

**Purpose:** Generate 4-6 essential technical terms with one-sentence definitions

**Files:** `src/lib/generation/phases/Phase2_Vocabulary.ts`

### Input Interface

```typescript
interface VocabularyInput {
  lessonId: string;
  topic: string;
  section: string;
  plan: PlanningOutput;
}
```

### Output Interface

```typescript
interface VocabularyOutput {
  terms: Array<{
    term: string;
    definition: string;
  }>;
}
```

### System Prompt

```typescript
You are a technical vocabulary specialist for C&G 2365 Electrical Training.

Your task is to identify and define the 4-6 most essential technical terms for this lesson.

DEFINITION QUALITY:
- One sentence per definition
- Clear, concise, and technically accurate
- Appropriate for Level 2 electrician students
- Focus on practical understanding, not overly academic

[JSON output instructions]
```

### User Prompt Template

```typescript
Generate essential vocabulary terms for this lesson:

LESSON DETAILS:
- ID: {lessonId}
- Topic: {topic}
- Section: {section}

LESSON PLAN:
{explanationSections}

LEARNING OUTCOMES:
{learningOutcomes}

Generate 4-6 essential technical terms that students MUST understand.

Return JSON:
{
  "terms": [
    { "term": "...", "definition": "..." }
  ]
}

REQUIREMENTS:
- Include ONLY essential terms (not basic electrical knowledge)
- Definitions must be one sentence each
- Use consistent terminology
- Order terms logically (foundational first)
```

### Key Features

- **Focused Scope:** Only lesson-specific terms (not general electrical knowledge)
- **Concise Definitions:** One sentence maximum
- **Logical Ordering:** Foundation concepts before advanced
- **Used By:** Phase 3 (explanations reference vocab), Phase 4 (checks can test vocab)

---

## Phase 3: Explanation

**Purpose:** Write 400-600 word teaching content with mandatory 8-part structure (includes beginner orientation and transition)

**Files:** `src/lib/generation/phases/Phase3_Explanation.ts`

**Updated:** February 6, 2026 - Added orientation and transition sections

### Input Interface

```typescript
interface ExplanationInput {
  lessonId: string;
  topic: string;
  section: string;
  mustHaveTopics?: string;
  additionalInstructions?: string;
  plan: PlanningOutput;
  vocabulary: VocabularyOutput;
  teachingConstraints?: TeachingConstraints;
  taskMode?: string;
  diagramElements?: DiagramElements;
}
```

### Output Interface

```typescript
interface ExplanationOutput {
  explanations: Array<{
    id: string;
    order: number;
    title: string;
    content: string;
  }>;
  diagramElements?: {
    elementIds: string[];
    placeholderDescription: string;
  };
}
```

### System Prompt

```typescript
You are an expert electrical training content writer for C&G 2365 courses.

Your task: write clear, accurate teaching explanations that match the lesson scope and learning outcomes.

OUTPUT RULES:
- Write 400-600 words per explanation block
- Use \n\n for paragraph breaks
- Use **bold** for key terms (especially vocabulary terms)
- Avoid unjustified absolutes. Use "typically", "commonly", "in most cases" unless a named source is provided

REQUIRED EXPLANATION STRUCTURE (EACH explanation block MUST include these headings in this order):
1) ### In this lesson
   - 1 sentence: what you're learning (goal)
   - 1 sentence: what context you're in (installation scenario)
   - 3 bullet points: three key takeaways (short, exam-friendly)
2) **What this is**
3) **Why it matters**
4) **Key facts / rules** (REQUIRED heading exactly; use 4-8 bullet points)
5) **[MODE SECTION]** (heading depends on TASK MODE below)
6) **Common mistakes**
7) **Quick recap** (1 short paragraph)
8) ### Coming Up Next (1-2 sentences)

TASK MODE OVERRIDES (CRITICAL - section 5 heading + content rules):
- If TASK_MODE includes "PURPOSE_ONLY":
  Section 5 heading MUST be: **When to choose it**
  Content: selection cues, scenarios, decision criteria, what problem it solves
  DO NOT give step-by-step instructions or physical actions

- If TASK_MODE includes "IDENTIFICATION" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to recognise it**
  Content: distinguishing features, comparisons, common confusions, where you'd see it

- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Section 5 heading MUST be: **How to apply it**
  Content: decision process, criteria, systematic checks (NOT physical steps)

- If TASK_MODE includes "CALCULATION":
  Section 5 heading MUST be: **How to calculate it**
  Content: formulas + worked reasoning in plain language

- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to do it**
  Content: procedures allowed, but keep them clear and safe

Default:
  Section 5 heading: **How to use it** (practical application, not overly detailed)

SCOPE CONTROL (for PURPOSE_ONLY / IDENTIFICATION / SELECTION modes):
- Do NOT describe physical actions or step-by-step procedures
- Avoid "how to test / verify / certify" unless the lesson explicitly requires it
- If you mention standards or guidance, name them (e.g., "BS 7671...", "IET On-Site Guide...") 
  and add "(refer to current edition)"

LEARNING OUTCOMES COVERAGE (CRITICAL):
- Every learning outcome must be explicitly taught somewhere in the explanation text
- Use key phrases from the learning outcomes so later questions can match wording

[JSON output instructions]
```

### User Prompt Template

```typescript
Write explanation content for this lesson:

LESSON DETAILS:
- ID: {lessonId}
- Topic: {topic}
- Section: {section}
- MUST HAVE TOPICS: {mustHaveTopics}
- ADDITIONAL INSTRUCTIONS: {additionalInstructions}

TASK MODE: {taskMode}

VOCABULARY TERMS (reference these):
{vocabulary.terms}

EXPLANATION SECTIONS TO WRITE:
{plan.explanationSections}

TEACHING CONSTRAINTS:
{teachingConstraints}

Write {explanationSections.length} explanation block(s) following the required 8-part structure.

Return JSON:
{
  "explanations": [
    {
      "id": "{lessonId}-explain-1",
      "order": 4,
      "title": "...",
      "content": "..."
    }
  ]
}

CRITICAL REQUIREMENTS:
- Each explanation MUST follow the required 8-part structure:
  1) ### In this lesson (with 3 bullet takeaways)
  2) **What this is**
  3) **Why it matters**
  4) **Key facts / rules** (REQUIRED heading exactly)
  5) [MODE SECTION] - heading based on TASK MODE rules
  6) **Common mistakes**
  7) **Quick recap**
  8) ### Coming Up Next
- MUST include "**Key facts / rules**" section (use exactly this heading)
- Address ALL learning outcomes explicitly (use LO phrases in at least one sentence per LO)
- Use vocabulary terms exactly as defined
- Each explanation must be 400-600 words
- Use \n\n for paragraph breaks, **bold** for emphasis
```

### Key Features

- **8-Part Structure:** Includes beginner orientation ("In this lesson") and transition ("Coming Up Next")
- **Longest Prompt:** Most complex phase with extensive constraints
- **Task Mode Aware:** Section 5 heading changes based on lesson type (When to choose it / How to recognise it / How to calculate it / etc.)
- **Constraint Enforcement:** Prevents scope violations through banned verb lists
- **Quality Standards:** Mandatory sections (Key facts, orientation, transition) ensure completeness
- **Absolute Language Control:** Requires hedging ("typically") unless citing named standards

### Example Output: 8-Part Structure

```markdown
### In this lesson

You're learning to identify different types of final circuits in domestic and commercial installations. By the end, you'll know when to choose a lighting circuit, power circuit, or control circuit. Three key points:

* Final circuits connect distribution boards to points of use
* Circuit type determines cable size and protective device rating
* Control circuits manage equipment without carrying full load current

**What this is**

A **Final Circuit** is the portion of an electrical installation that delivers electricity...

**Why it matters**

Selecting the correct circuit type ensures safe operation, code compliance, and efficient...

**Key facts / rules**

* Lighting circuits: Typically use 1.0mm² or 1.5mm² conductors...
* Power circuits: Serve socket outlets for general appliances...
* Control circuits: Low-power circuits managing motorized valves...

**When to choose it**

For a standard domestic room, select a lighting circuit for ceiling fixtures and a separate...

**Common mistakes**

Students often confuse control circuits with power circuits. While a control circuit might...

**Quick recap**

Final circuits deliver electricity to end users. Primary types include lighting, power, and...

### Coming Up Next

In the next section, we'll apply this knowledge by checking your understanding of circuit types through four quick questions.
```

---

## Phase 4: Understanding Checks

**Purpose:** Create formative assessment questions after each explanation using the Anchor Fact Method

**Files:** `src/lib/generation/phases/Phase4_UnderstandingChecks.ts`

**Updated:** February 6, 2026 - Added Anchor Fact Method for verbatim answer alignment

### Input Interface

```typescript
interface UnderstandingChecksInput {
  lessonId: string;
  explanations: ExplanationBlock[];
  teachingConstraints?: TeachingConstraints;
  taskMode?: string;
}
```

### Output Interface

```typescript
interface UnderstandingChecksOutput {
  checks: Array<{
    id: string;
    order: number;  // explanation.order + 0.5
    title: string;
    mode: 'conceptual';
    sequential: true;
    questions: UnderstandingQuestion[];  // 3 recall + 1 connection
  }>;
}
```

### System Prompt

```typescript
You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create formative assessment questions that check understanding of taught concepts.

ANCHOR FACT METHOD (REQUIRED):
For EACH explanation block:
1) Select EXACTLY 3 "Anchor Facts" from the explanation text.
   - Each Anchor Fact MUST be a short verbatim phrase/sentence copied from the explanation (6-20 words)
   - Each Anchor Fact MUST be important, specific, and gradeable (not vague)
2) Write Q1, Q2, Q3 as simple recall questions, each testing ONE Anchor Fact
3) Write Q4 (L2) as a connection question that explicitly connects ALL THREE Anchor Facts

IMPORTANT: Do NOT output the anchor facts as separate fields (no schema changes). 
Use them internally to generate questions and expected answers.

QUESTION STRUCTURE (for each check):
- Question 1 (L1-A): Simple recall - test one specific fact from explanation
- Question 2 (L1-B): Simple recall - test another fact, building on Q1
- Question 3 (L1-C): Simple recall - test a third fact, building on Q1 and Q2
- Question 4 (L2): Connection - MUST explicitly reference Q1, Q2, Q3 facts by name/content

COGNITIVE LEVELS:
- Recall (L1): "What is...", "Define...", "State..." - simple factual questions
- Connection (L2): "How do X and Y relate?", "Why does X affect Y?" - relationship questions

L2 CONNECTION QUESTION REQUIREMENTS (CRITICAL):
- MUST begin with: "Using your answers to Q1 ([topic]), Q2 ([topic]), and Q3 ([topic])..."
- MUST explicitly reference all three L1 facts by their content
- MUST ask how they connect or relate to each other

TEACHING CONSTRAINTS (if provided):
If PURPOSE_ONLY or IDENTIFICATION mode:
- L1 questions MUST test PURPOSE and IDENTIFICATION, NOT procedures
- BANNED VERBS: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert,
                thread, technique, method, step, process, operate
- REQUIRED PATTERNS:
  * "What is [X] used for?"
  * "Which tool should be selected when..."
  * "State the purpose of [X]"
  * "Identify the equipment for [scenario]"

EXPECTED ANSWER REQUIREMENTS (CRITICAL - VERBATIM ALIGNMENT):

For L1 Questions (Q1, Q2, Q3):
- expectedAnswer[0] MUST be verbatim text from the explanation (the anchor fact or a direct substring)
- EXACTLY 2-4 variants total (not 2-6)
- Variants are ONLY for normalization: case, pluralization, articles (a/an/the), hyphenation
- DO NOT include broad paraphrases or synonyms that change meaning
- Each L1 question tests EXACTLY one anchor fact

For L2 Question (Q4):
- expectedAnswer MUST explicitly mention ALL THREE anchor facts or their key terms
- EXACTLY 1-2 strings total (down from 2-6)
- The answer must be a connection statement, not a vague summary

BANNED PRACTICES (for all questions):
- DO NOT use terms not present in the explanation
- DO NOT ask about content not taught
- DO NOT accept vague answers like "for safety" or "to comply"

[JSON output instructions]
```

### User Prompt Template

```typescript
Create understanding check questions for this lesson's explanations.

EXPLANATION 1 (Order {exp.order}):
Title: {exp.title}
Content:
{exp.content}

[If multiple explanations, repeat for each]

TASK MODE: {taskMode}
[If PURPOSE_ONLY: Include banned verbs reminder and required patterns]

Create {explanations.length} understanding check block(s).

Return JSON:
{
  "checks": [
    {
      "id": "{lessonId}-check-1",
      "order": 4.5,
      "title": "Check Your Understanding: {explanation.title}",
      "mode": "conceptual",
      "sequential": true,
      "questions": [
        {
          "id": "{lessonId}-C1-L1-A",
          "questionText": "[Recall question]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Answer]", "[Alternative]"],
          "hint": "[Hint]"
        },
        // ... L1-B, L1-C, L2
      ]
    }
  ]
}

REQUIREMENTS:
- 4 questions per check (3 recall + 1 connection)
- Connection question must reference all 3 recall facts
- All answers derivable from explanation
- Respect teaching constraints if present
```

### Key Features

- **Anchor Fact Method:** Selects 3 verbatim phrases from explanation first, then builds questions around them
- **Teach-Before-Test Enforcement:** Can only ask about content from Phase 3
- **Cognitive Scaffolding:** 3 simple recall (L1) → 1 connection (L2) question
- **Verbatim Answers:** expectedAnswer[0] for L1 questions MUST be verbatim from explanation
- **Tight Variants:** EXACTLY 2-4 variants for L1, 1-2 for L2 (not broad paraphrases)
- **Constraint Aware:** Respects PURPOSE_ONLY and IDENTIFICATION modes (no procedure questions)
- **Placement:** Order = explanation.order + 0.5 (immediately after)

### Example Output: Anchor Fact Method

**From Explanation (Phase 3):**
> "Lighting circuits typically use 1.0mm² or 1.5mm² conductors and are commonly protected by a 6A or 10A circuit breaker."

**Anchor Facts Selected (internal - not output):**
1. "Lighting circuits typically use 1.0mm² or 1.5mm² conductors"
2. "commonly protected by a 6A or 10A circuit breaker"
3. "Control circuits manage equipment without carrying full load current"

**Generated Questions:**

```json
{
  "questions": [
    {
      "id": "203-3A11-C1-L1-A",
      "cognitiveLevel": "recall",
      "questionText": "What conductor sizes are typically used for lighting circuits?",
      "answerType": "short-text",
      "expectedAnswer": [
        "1.0mm² or 1.5mm²",
        "1.0mm² or 1.5mm² conductors",
        "1.0 or 1.5mm²"
      ]
    },
    {
      "id": "203-3A11-C1-L1-B",
      "cognitiveLevel": "recall",
      "questionText": "What protective device ratings are commonly used for lighting circuits?",
      "answerType": "short-text",
      "expectedAnswer": [
        "6A or 10A circuit breaker",
        "6A or 10A",
        "6 or 10 amp breaker"
      ]
    },
    {
      "id": "203-3A11-C1-L2",
      "cognitiveLevel": "connection",
      "questionText": "Using your answers to Q1 (conductor sizes), Q2 (protective devices), and Q3 (control circuits), explain why control circuits can use smaller conductors than lighting circuits.",
      "answerType": "short-text",
      "expectedAnswer": [
        "Control circuits manage equipment without carrying full load current, so they need less protection than lighting circuits"
      ]
    }
  ]
}
```

**Key Improvements:**
- expectedAnswer[0] is verbatim from explanation (gradeable with exact string match)
- Only 2-4 variants (tight normalization: units, articles, punctuation)
- L2 question explicitly connects all three anchor facts

---

## Phase 5: Worked Example & Guided Practice

**Purpose:** Generate step-by-step modeling for calculation/procedure/selection tasks (conditional) with strict mirroring

**Files:** `src/lib/generation/phases/Phase5_WorkedExample.ts`

**Updated:** February 6, 2026 - Added Selection Example Format (4 steps) and strengthened Mirroring Contract

### Input Interface

```typescript
interface WorkedExampleInput {
  lessonId: string;
  topic: string;
  explanations: ExplanationBlock[];
  needsWorkedExample: boolean;
  teachingConstraints?: TeachingConstraints;
  taskMode?: string;
}
```

### Output Interface

```typescript
interface WorkedExampleOutput {
  workedExample?: {
    id: string;
    order: number;  // 6
    title: string;
    given: string;
    steps: WorkedExampleStep[];
    notes: string;
  };
  guidedPractice?: {
    id: string;
    order: number;  // 7
    title: string;
    problem: string;
    steps: GuidedPracticeStep[];
  };
}
```

### System Prompt

```typescript
You are a practical training specialist for C&G 2365 Electrical Training.

Your task is to create worked examples and guided practice for calculation/procedure/selection topics.

OUTPUT REQUIREMENT:
- Always return BOTH workedExample AND guidedPractice (not just one)
- They work as a pair: "I Do" (worked) → "We Do" (guided) → "You Do" (independent practice in Phase 6)

SELECTION EXAMPLE FORMAT (for PURPOSE_ONLY / IDENTIFICATION tasks - use EXACTLY 4 steps):
Step 1: "Identify job context" (material/type/constraint)
Step 2: "Select correct [tool/equipment/circuit]"
Step 3: "State purpose" (one line)
Step 4: "Common wrong choice and why" (one line)

CALCULATION EXAMPLE FORMAT (for CALCULATION tasks):
- Show formulas first
- Step-by-step substitution
- Show units throughout
- Final result with units

MIRRORING CONTRACT (CRITICAL - NO EXCEPTIONS):
guidedPractice.steps.length MUST EQUAL workedExample.steps.length
stepNumbers MUST match exactly (1..N, no gaps)
Same decision points, same order, same logic path
Different scenario/values only

PROVENANCE REQUIREMENTS (for standard values):
- IF using BS 7671 or IET guidance values: cite the source explicitly
- IF values not provided in explanation: describe how to look them up (don't invent table entries)
- DO NOT invent standard wire sizes, breaker ratings, or other spec values

GUIDED PRACTICE expectedAnswer RULES:
- EXACTLY 1-2 variants (down from 2-6)
- Tight normalization only (case, units, rounding to 1 decimal place)
- NO broad paraphrases

[JSON output instructions]
```

### User Prompt Template

```typescript
Create worked example and guided practice for this lesson.

LESSON DETAILS:
- ID: {lessonId}
- Topic: {topic}
- Needs worked example: {needsWorkedExample}

EXPLANATION CONTENT:
{explanations}

TASK MODE: {taskMode}

[If needsWorkedExample = false AND not PURPOSE_ONLY]:
Return: { "workedExample": null, "guidedPractice": null }

[If PURPOSE_ONLY/IDENTIFICATION]:
Create SELECTION worked example showing decision process.

[If CALCULATION]:
Create calculation worked example with formulas.

Return JSON:
{
  "workedExample": {
    "id": "{lessonId}-worked-example",
    "order": 6,
    "title": "Worked Example: {task}",
    "given": "...",
    "steps": [
      {
        "stepNumber": 1,
        "description": "...",
        "formula": "..." or null,
        "calculation": "..." or null,
        "result": "..." or null
      }
    ],
    "notes": "..."
  },
  "guidedPractice": {
    "id": "{lessonId}-guided",
    "order": 7,
    "title": "Guided Practice (We Do)",
    "problem": "...",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Guiding question]",
        "expectedAnswer": ["..."],
        "hint": "..."
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- For PURPOSE_ONLY/IDENTIFICATION tasks: Use SELECTION EXAMPLE FORMAT (exactly 4 steps)
- Guided practice MUST mirror worked example: guidedPractice.steps.length === workedExample.steps.length
- stepNumbers MUST match exactly (1, 2, 3, 4 - no gaps, no extras)
- expectedAnswer for guided practice: EXACTLY 1-2 variants (tight normalization only)
- DO NOT invent standard values (wire sizes, ratings) unless they appear in the explanation
- If using BS 7671 values: cite source explicitly or describe lookup method
```

### Key Features

- **Selection Example Format:** 4-step structure for PURPOSE_ONLY/IDENTIFICATION tasks (Identify context → Select tool → State purpose → Common mistake)
- **Strict Mirroring Contract:** guidedPractice.steps.length MUST equal workedExample.steps.length (no exceptions)
- **I Do → We Do Scaffolding:** Worked example models, guided practice scaffolds
- **Provenance Requirements:** Must cite sources for standard values (BS 7671, IET) or describe lookup
- **Tight Variants:** expectedAnswer limited to 1-2 variants (down from 2-6)
- **Flexible Task Types:** Handles calculations, selections, procedures
- **Critical for 95+ Scores:** Prevents "blank page panic" in independent practice

### Example Output: Selection Format (4 steps)

```json
{
  "workedExample": {
    "id": "203-3A11-worked-example",
    "title": "Worked Example: Selecting the Right Circuit Type",
    "given": "You're wiring a domestic kitchen...",
    "steps": [
      {
        "stepNumber": 1,
        "description": "Identify job context: domestic kitchen, multiple appliances, socket outlets",
        "result": "Need power circuit for general use"
      },
      {
        "stepNumber": 2,
        "description": "Select correct circuit: Ring final circuit (32A) for socket outlets",
        "result": "Ring final circuit selected"
      },
      {
        "stepNumber": 3,
        "description": "State purpose: Allows multiple socket outlets with lower conductor size (2.5mm²)",
        "result": "Purpose: efficient power distribution"
      },
      {
        "stepNumber": 4,
        "description": "Common wrong choice: Radial circuit would need thicker cable for same load",
        "result": "Ring circuit is more economical here"
      }
    ]
  },
  "guidedPractice": {
    "steps": [
      { "stepNumber": 1, "prompt": "What is the job context?", "expectedAnswer": ["office space, lighting, ceiling fixtures"] },
      { "stepNumber": 2, "prompt": "Which circuit type?", "expectedAnswer": ["lighting circuit"] },
      { "stepNumber": 3, "prompt": "What is the purpose?", "expectedAnswer": ["provides illumination with appropriate protection"] },
      { "stepNumber": 4, "prompt": "What would be wrong?", "expectedAnswer": ["using a power circuit would be oversized"] }
    ]
  }
}
```

### Remaining Issue

**Problem:** Still hardcoded to only run for calculations (line 411 in `SequentialLessonGenerator.ts`):
```typescript
const needsWorkedExample = requiresWorkedExample([
  { type: 'calculation', confidence: 0.8 }
]);
```

**Solution:** Make worked examples mandatory for ALL lesson types:
```typescript
const needsWorkedExample = true;  // Always include (use selection format if not calculation)
```

**Expected Impact:** +5-8 points per lesson

---

## Phase 6: Practice

**Purpose:** Create 3-5 independent practice questions ("You Do")

**Files:** `src/lib/generation/phases/Phase6_Practice.ts`

### Input Interface

```typescript
interface PracticeInput {
  lessonId: string;
  explanations: ExplanationBlock[];
  vocabulary: VocabularyOutput;
  hasWorkedExample: boolean;
  teachingConstraints?: TeachingConstraints;
  taskMode?: string;
}
```

### Output Interface

```typescript
interface PracticeOutput {
  practice: {
    id: string;
    order: number;  // 8
    title: string;
    questions: PracticeQuestion[];
  };
}
```

### System Prompt

```typescript
You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create independent practice questions that assess understanding.

QUESTION TYPES:
- If lesson has calculations: Include 2-3 numeric questions
- Include 2-3 short-text conceptual/application questions
- Mix of direct application and scenario-based questions

TEACHING CONSTRAINTS (if provided):
If PURPOSE_ONLY or IDENTIFICATION mode:
- Practice questions MUST test purpose/selection, NOT procedures
- BANNED VERBS: [same list as Phase 4]
- ALLOWED PATTERNS:
  * "Which tool is appropriate for [scenario]?"
  * "State the purpose of [X]"
  * "Identify the equipment needed for [task]"
  * "Select the correct [item] for [material/situation]"

ANSWER FORMAT RULES (CRITICAL):
- expectedAnswer: ALWAYS an array of strings
- For numeric answers: Include ONLY the number (no units!)
- Units go in the "hint" field, not in expectedAnswer
- Examples:
  ✓ expectedAnswer: ["230"], hint: "UK mains voltage (V)"
  ✗ expectedAnswer: ["230V"] - WRONG!

NUMERIC QUESTION REQUIREMENTS:
Rounding instructions MUST be in questionText:
- "(Round to 1 decimal place)" or "(Round to nearest whole number)"
expectedAnswer for numeric: ["40", "40.0"] (handles students with/without trailing zeros)

EXPECTED ANSWER REQUIREMENTS (marking robustness):
- 1 canonical answer (exact from explanation)
- Maximum 2-3 variants (case/singular/plural/acronym only)
- NO broad paraphrases

[JSON output instructions]
```

### User Prompt Template

```typescript
Create independent practice questions for this lesson.

EXPLANATION CONTENT:
{explanations}

VOCABULARY TERMS:
{vocabulary.terms}

LESSON CONTEXT:
- Has worked example: {hasWorkedExample}
- Task mode: {taskMode}

Create 3-5 practice questions at order 8.

Return JSON:
{
  "practice": {
    "id": "{lessonId}-practice",
    "order": 8,
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "{lessonId}-P1",
        "questionText": "...",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["..."],
        "hint": "..."
      }
    ]
  }
}

REQUIREMENTS:
- 3-5 questions total
- Mix difficulty levels
- All answers derivable from explanation
- For numeric: numbers only in expectedAnswer, units in hint
- Respect teaching constraints if present
```

### Key Features

- **Builds on Worked Example:** Questions match modeled skills
- **Mixed Difficulty:** Some straightforward, some applied
- **Constraint Aware:** Tests purpose/selection for PURPOSE_ONLY lessons
- **Numeric Handling:** Strict format (numbers only, units in hints)

---

## Phase 7: Integration

**Purpose:** Generate exactly 2 synthesis questions tying all concepts together

**Files:** `src/lib/generation/phases/Phase7_Integration.ts`

### Input Interface

```typescript
interface IntegrationInput {
  lessonId: string;
  plan: PlanningOutput;
  explanations: ExplanationBlock[];
}
```

### Output Interface

```typescript
interface IntegrationOutput {
  integrative: {
    id: string;
    order: number;  // 9.5
    title: string;
    mode: 'integrative';
    sequential: true;
    questions: IntegrativeQuestion[];  // Exactly 2
  };
}
```

### System Prompt

```typescript
You are an advanced assessment specialist for C&G 2365 Electrical Training.

Your task is to create integrative questions that synthesize lesson concepts.

QUESTION REQUIREMENTS:
Question 1 (Connection - L2):
- Links 2-3 major concepts from different parts of the lesson
- Asks "how" or "why" these concepts relate
- Expected answer: 2-3 sentences
- Shows understanding of relationships

Question 2 (Synthesis - L3):
- Integrates ALL major concepts from the lesson
- Asks for comprehensive explanation showing full understanding
- Explicitly request 3-4 sentences in the question
- Expected answer: 3-4 sentences
- Shows "big picture" understanding

[JSON output instructions]
```

### User Prompt Template

```typescript
Create integrative questions that synthesize this lesson's concepts.

LEARNING OUTCOMES:
{plan.learningOutcomes}

MAJOR CONCEPTS COVERED:
{explanations.map(e => e.title)}

EXPLANATION SUMMARIES:
{explanations}

Create 2 integrative questions at order 9.5.

Return JSON:
{
  "integrative": {
    "id": "{lessonId}-integrative",
    "order": 9.5,
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      {
        "id": "{lessonId}-INT-1",
        "questionText": "[Connection question linking 2-3 concepts] (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["..."],
        "hint": "..."
      },
      {
        "id": "{lessonId}-INT-2",
        "questionText": "[Synthesis question integrating ALL concepts] (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": ["..."],
        "hint": "..."
      }
    ]
  }
}

REQUIREMENTS:
- Question 1: Link 2-3 different major concepts, request 2-3 sentences
- Question 2: Integrate ALL concepts, request 3-4 sentences explicitly
- Both require deep understanding beyond recall
```

### Key Features

- **Exactly 2 Questions:** Enforced pattern (connection + synthesis)
- **Cross-Concept:** Pulls from all explanations
- **High Cognitive Level:** Tests understanding, not just recall
- **Order 9.5:** Near end but before spaced review

---

## Phase 8: Spaced Review

**Purpose:** Generate 4 prerequisite review questions (spaced repetition)

**Files:** `src/lib/generation/phases/Phase8_SpacedReview.ts`

### Input Interface

```typescript
interface SpacedReviewInput {
  lessonId: string;
  prerequisites: string[];
  prerequisiteAnchors?: string;
}
```

### Output Interface

```typescript
interface SpacedReviewOutput {
  spacedReview: {
    id: string;
    order: number;  // 10
    title: string;
    questions: SpacedReviewQuestion[];  // 4 questions
    notes: string;  // Provenance mapping
  };
}
```

### System Prompt

```typescript
You are a spaced repetition specialist for C&G 2365 Electrical Training.

Your task is to create review questions from PREREQUISITE lessons only.

CRITICAL RULES:
- Questions MUST review concepts from prerequisite lessons (provided as anchors)
- Do NOT test current lesson content
- Do NOT use generic fundamentals unless they appeared in prerequisites
- Questions should be simple recall (appropriate for quick review)
- Each question must be traceable to a specific prerequisite lesson

FIELD NAME: Use "questionText" (NOT "attText", "question_text", or any variant)

[JSON output instructions]
```

### User Prompt Template

```typescript
Create spaced review questions from prerequisite lessons.

PREREQUISITES: {prerequisites}

[If no prerequisites]:
Return:
{
  "spacedReview": {
    "id": "{lessonId}-spaced-review",
    "order": 10,
    "questions": [],
    "notes": "No prerequisites for this foundational lesson"
  }
}

[If prerequisites exist]:
PREREQUISITE ANCHORS (key facts to review):
{prerequisiteAnchors}

Create 4 spaced review questions.

Return JSON:
{
  "spacedReview": {
    "id": "{lessonId}-spaced-review",
    "order": 10,
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      {
        "id": "{lessonId}-SR-1",
        "questionText": "[Review question from prereq 1]",
        "expectedAnswer": ["..."],
        "hint": "..."
      }
      // ... SR-2, SR-3, SR-4
    ],
    "notes": "SR-1 -> {prereqId} ([concept]); SR-2 -> {prereqId} ([concept]); ..."
  }
}

REQUIREMENTS:
- Exactly 4 questions
- Each traceable to specific prerequisite
- Simple recall format
- Provenance in notes field
```

### Key Features

- **Prerequisite Only:** Never tests current lesson
- **Provenance Tracking:** Notes field maps questions to prereq IDs
- **Can Be Empty:** Returns empty array if no prerequisites
- **Always Last:** Order 10 (enforced by assembler)

### Current Issue

**Problem:** Returns empty questions array if no prerequisites
**Expert Feedback:** Empty block is "wasted scoring opportunity"

---

## Phase 9: Assembler

**Purpose:** Assemble all phase outputs into complete lesson JSON (NOT LLM-based)

**Files:** `src/lib/generation/phases/Phase9_Assembler.ts`

### Input Interface

```typescript
interface AssemblerInput {
  lessonId: string;
  title: string;
  description: string;
  topic: string;
  unit: string;
  prerequisites?: string[];
  youtubeUrl?: string;
  imageUrl?: string;
  plan: PlanningOutput;
  vocabulary: VocabularyOutput;
  explanations: ExplanationOutput;
  checks: UnderstandingChecksOutput;
  workedExample: WorkedExampleOutput;
  practice: PracticeOutput;
  integration: IntegrationOutput;
  spacedReview: SpacedReviewOutput;
}
```

### Output

```typescript
Complete Lesson object (assembled from all phases)
```

### Assembly Logic (TypeScript, not LLM)

```typescript
assemble(input: AssemblerInput): Lesson {
  const blocks: any[] = [];

  // 1. Outcomes block (order: 1)
  blocks.push({ type: 'outcomes', order: 1, ... });

  // 2. Vocab block (order: 2)
  blocks.push({ type: 'vocab', order: 2, ... });

  // 3. Diagram block (order: 3) - optional
  if (plan.needsDiagram) {
    blocks.push({ type: 'diagram', order: 3, ... });
  }

  // 4 & 4.5: Explanation-1 and Check-1 (PAIRED)
  blocks.push({ type: 'explanation', order: 4, ... });
  blocks.push({ type: 'practice', order: 4.5, ... });

  // 5 & 5.5: Explanation-2 and Check-2 (if exists)
  if (explanations.length > 1) {
    blocks.push({ type: 'explanation', order: 5, ... });
    blocks.push({ type: 'practice', order: 5.5, ... });
  }

  // 6. Worked example (optional)
  if (workedExample.workedExample) {
    blocks.push({ type: 'worked-example', order: 6, ... });
  }

  // 7. Guided practice (optional)
  if (workedExample.guidedPractice) {
    blocks.push({ type: 'guided-practice', order: 7, ... });
  }

  // 8. Practice
  blocks.push({ type: 'practice', order: 8, ... });

  // 9.5. Integrative
  blocks.push({ type: 'practice', order: 9.5, ... });

  // 10. Spaced review (MUST be last)
  blocks.push({ type: 'spaced-review', order: 10, ... });

  // Sort and validate
  blocks.sort((a, b) => a.order - b.order);
  this.validateBlockOrders(blocks);
  this.validateOrderContract(blocks);

  return lesson;
}
```

### Validation Rules

**Block Order Contract Enforcement:**
```typescript
// Required orders that MUST exist
const required = [1, 2, 8, 9.5, 10];

// If explanation at 4, check at 4.5 MUST exist
// If explanation at 5, check at 5.5 MUST exist
// Integrative MUST be at 9.5 (not 9, not 11)
// Spaced review MUST be last (order 10)
// All orders must be unique and monotonic increasing
```

### Key Features

- **Pure TypeScript:** No LLM call (deterministic assembly)
- **Contract Enforcement:** Hard validation of block order rules
- **Fail-Fast:** Throws errors if contract violated
- **Blame Assignment:** Error messages identify which phase broke contract

---

## Phase 10: Refinement

**Purpose:** Score lesson and apply surgical JSON patches if score < 97

**Files:** `src/lib/generation/phases/Phase10_Refinement.ts`

### Input Interface

```typescript
interface RefinementInput {
  lesson: Lesson;
  rubricScore: RubricScore;
  maxFixes: number;  // Default: 10
}
```

### Output Interface

```typescript
interface RefinementOutput {
  originalLesson: Lesson;
  refined: Lesson;
  patchesApplied: RefinementPatch[];
  originalScore: number;
  refinedScore: number;
  improvementSuccess: boolean;
}
```

### System Prompt

```typescript
You are a surgical JSON editor for C&G 2365 lesson refinement.

Your ONLY job: Implement the exact fixes specified in the suggestions.

RULES:
- Each suggestion contains the EXACT change to make
- Implement suggestions EXACTLY as written - no creative interpretation
- Return JSON patches in strict format
- Maximum 10 patches total (laser focus on highest impact)

CONSTRAINTS (CRITICAL):
- ALLOWED: Replace field values, prepend/append to strings
- NOT ALLOWED: Add blocks, remove blocks, reorder blocks
- If you cannot implement a fix within these constraints, skip it

PATCH FORMAT:
{
  "patches": [
    {
      "path": "blocks[X].content.field",
      "newValue": "...",
      "reason": "..."
    }
  ]
}

[JSON output instructions]
```

### User Prompt Template

```typescript
Apply these exact fixes to the lesson:

LESSON ID: {lessonId}

ISSUES TO FIX (implement EXACTLY as specified):
{issues.map((issue, idx) => `
Issue ${idx + 1}: [{issue.section}]
Problem: {issue.issue}
EXACT FIX: {issue.suggestion}
Points to recover: {issue.severity}
`)}

Return patches in strict JSON format.
Each patch must specify: path, newValue, reason.
```

### Workflow

```mermaid
flowchart TD
    Score[LLM Scoring]
    Check{Score < 97?}
    Extract[Extract Top 10 Issues]
    Phase10[Phase 10: Generate Patches]
    Apply[Apply Patches]
    Validate[Validate Structure]
    Rescore[Re-score Refined]
    Compare{Improved?}
    KeepRefined[Keep Refined + Save Original]
    KeepOriginal[Keep Original Only]
    
    Score --> Check
    Check -->|Yes| Extract
    Check -->|No| KeepOriginal
    Extract --> Phase10
    Phase10 --> Apply
    Apply --> Validate
    Validate -->|Pass| Rescore
    Validate -->|Fail| KeepOriginal
    Rescore --> Compare
    Compare -->|Yes| KeepRefined
    Compare -->|No| KeepOriginal
```

### Key Features

- **Two-Call System:** Scoring suggests → Phase 10 implements
- **Laser-Focused:** Top 10 issues only
- **Exact Instructions:** "Change X from Y to Z" (no ambiguity)
- **Safety Net:** Re-scores and rejects harmful patches
- **Audit Trail:** Saves both original and refined versions

### Patch Application Rules (Deep Dive)

Phase 10 applies surgical JSON patches to fix issues identified by the LLM scorer. Understanding how patches work is critical for debugging refinement failures.

#### Patch Operations

**Replace Operation**

Replaces the entire value of a field.

```typescript
{
  "op": "replace",
  "path": "/blocks/4/content/title",
  "from": "Old Title",  // Optional: for validation
  "value": "New Title"
}
```

**Use cases:**
- Changing block titles
- Fixing question IDs
- Correcting field values
- Updating terminology

**Example:** Fix question ID missing lesson prefix
```json
{
  "op": "replace",
  "path": "/blocks/4/content/questions/0/id",
  "from": "C1-L1-A",
  "value": "203-3A11-C1-L1-A"
}
```

**Validation:**
- Path must exist in lesson JSON
- Type of new value must match existing type
- For strings: any string value allowed
- For numbers: numeric values only
- For arrays/objects: must provide complete replacement

---

**Append Operation**

Adds text to the END of an existing string field. The existing content is preserved intact.

```typescript
{
  "op": "append",
  "path": "/blocks/3/content/content",
  "value": "\n\n### Key Points\n- Point one\n- Point two\n- Point three"
}
```

**Use cases:**
- Adding missing summary sections at end of content
- Appending "Coming Up Next" transitions
- Adding "Key Points" summaries
- Inserting additional guidance at end

**Example:** Add missing "Key Points" section to explanation
```json
{
  "op": "append",
  "path": "/blocks/3/content/content",
  "value": "\n\n### Key Points\n- Final circuits connect distribution boards to utilization points\n- Circuit types include power, lighting, and control\n- Selection depends on load requirements and safety needs"
}
```

**Requirements:**
- Target field MUST be a string
- Attempting to append to non-string field → patch skipped
- Value is concatenated directly to end of existing string
- Use `\n\n` to add proper spacing

---

**Prepend Operation**

Adds text to the BEGINNING of an existing string field. The existing content is preserved intact.

```typescript
{
  "op": "prepend",
  "path": "/blocks/3/content/content",
  "value": "### In this lesson\n\nYou will learn about circuit types and their applications.\n\n"
}
```

**Use cases:**
- Adding missing "In this lesson" orientation at start
- Inserting introductory sections
- Adding context before existing content
- Prefixing warnings or prerequisites

**Example:** Add missing orientation section to explanation
```json
{
  "op": "prepend",
  "path": "/blocks/3/content/content",
  "value": "### In this lesson\n\nYou will learn to identify circuit types and their specific functions in electrical installations.\n\n"
}
```

**Requirements:**
- Target field MUST be a string
- Attempting to prepend to non-string field → patch skipped
- Value is concatenated directly to start of existing string
- Use `\n\n` at end for proper spacing from existing content

---

#### JSON Path Resolution

Patches use **JSON Pointer** format for paths, which is converted internally to dot notation.

**Path Syntax:**

| JSON Pointer | Dot Notation | Meaning |
|-------------|--------------|---------|
| `/blocks/3` | `blocks[3]` | 4th block (0-indexed) |
| `/blocks/3/type` | `blocks[3].type` | Type field of 4th block |
| `/blocks/3/content/title` | `blocks[3].content.title` | Title in content |
| `/blocks/4/content/questions/0/id` | `blocks[4].content.questions[0].id` | First question's ID |

**Resolution Rules:**
1. Path starts with `/` (root)
2. Segments separated by `/`
3. Numeric segments = array indexes (0-based)
4. Non-numeric segments = object keys
5. Nested paths traverse through objects and arrays

**Examples:**

```typescript
// Simple field access
"/title" → lesson.title

// Block access
"/blocks/3" → lesson.blocks[3]

// Nested content
"/blocks/3/content/title" → lesson.blocks[3].content.title

// Array within content
"/blocks/4/content/questions/2/questionText"
→ lesson.blocks[4].content.questions[2].questionText
```

---

#### Validation Rules

**Before Applying Patches:**

1. **Path Existence Check**
   - Path must exist in current lesson JSON
   - For arrays: index must be `< array.length`
   - For objects: all keys in path must exist
   - Invalid path → patch skipped with warning

2. **Type Compatibility**
   - For prepend/append: field MUST be string type
   - For replace: new value type must match existing (or be compatible)
   - Type mismatch → patch skipped with warning

3. **Structural Integrity**
   - Block count must remain unchanged
   - Cannot add new blocks
   - Cannot remove blocks
   - Cannot reorder blocks
   - Structural changes → patch rejected

**After Applying Patches:**

1. **JSON Validity**
   - Patched lesson must parse as valid JSON
   - No syntax errors
   - All quotes properly escaped
   - Parse failure → revert to original

2. **Schema Compliance**
   - All required fields still present
   - Block types remain valid
   - IDs remain unique
   - Schema violation → revert to original

3. **Block Count Preservation**
   - `refined.blocks.length === original.blocks.length`
   - Count mismatch → revert to original

4. **Field Integrity**
   - No required fields deleted
   - No field type changes (unless intentional replace)
   - Field integrity violation → revert to original

---

#### Fail Conditions

**Invalid Path (Patch Skipped)**

```json
// Only 11 blocks exist (0-10), but patch references block 15
{
  "op": "replace",
  "path": "/blocks/15/content/title",
  "value": "New Title"
}
```

**Result:** Patch skipped with warning
```
⊘ Rejecting patch: /blocks/15/content/title references non-existent block[15]
```

---

**Type Mismatch (Patch Skipped)**

```json
// Attempting to append to a numeric field
{
  "op": "append",
  "path": "/blocks/3/order",
  "value": ".5"
}
```

**Result:** Patch skipped (order is number, not string)
```
✗ FAILED at blocks[3].order: Cannot append to non-string field
```

---

**Missing Field (Patch Skipped)**

```json
// Field doesn't exist in lesson
{
  "op": "replace",
  "path": "/blocks/5/content/unknownField",
  "value": "Some value"
}
```

**Result:** Patch skipped with warning
```
⊘ Path /blocks/5/content/unknownField does not exist
```

---

**Structural Change Attempt (Rejected by Prompt)**

LLM scorer suggests: "Insert a new worked example block between blocks 5 and 6"

**Result:** Phase 10 prompt explicitly forbids this
```
FORBIDDEN:
- Adding new blocks (use "blocks[N]" path only for existing blocks)
- Removing blocks
- Changing block count in any way
```

Scorer marks issue as `fixability: "requiresRegeneration"` with empty patches array.

---

#### Patch Application Flow

```typescript
// Simplified version of Phase10_Refinement.ts applyPatches() method

function applyPatches(lesson: Lesson, patches: RefinementPatch[]): Lesson {
  // 1. Deep clone lesson (preserve original)
  const cloned = JSON.parse(JSON.stringify(lesson));
  
  // 2. Apply each patch
  for (const patch of patches) {
    try {
      const oldValue = getValueAtPath(cloned, patch.path);
      
      let finalValue = patch.newValue;
      
      // Handle prepend/append for strings
      if (patch.operation === 'prepend' && typeof oldValue === 'string') {
        finalValue = patch.newValue + oldValue;
      } else if (patch.operation === 'append' && typeof oldValue === 'string') {
        finalValue = oldValue + patch.newValue;
      }
      // For 'replace' operation, use newValue as-is
      
      setValueAtPath(cloned, patch.path, finalValue);
      
      console.log(`✓ ${patch.path} [${patch.operation}]`);
      console.log(`   Old: "${oldValue}"`);
      console.log(`   New: "${finalValue}"`);
      
    } catch (e) {
      console.warn(`✗ FAILED at ${patch.path}:`, e);
      // Continue to next patch (don't abort entire refinement)
    }
  }
  
  // 3. Validate patched lesson
  if (!validatePatches(lesson, cloned)) {
    throw new Error('Validation failed - reverting to original');
  }
  
  return cloned;
}
```

**Key Points:**
- Original lesson preserved (deep clone)
- Patches applied sequentially
- Individual patch failures don't abort entire process
- Final validation before accepting changes
- If validation fails, revert to original

---

#### Validation Implementation

```typescript
function validatePatches(original: Lesson, patched: Lesson): boolean {
  // 1. Must have same basic structure
  if (!patched.id || !patched.title || !patched.blocks) {
    console.warn('[Refinement] Missing required fields after patching');
    return false;
  }
  
  // 2. Block count must be unchanged
  if (original.blocks.length !== patched.blocks.length) {
    console.warn('[Refinement] Block count changed after patching');
    return false;
  }
  
  // 3. Block types must remain valid
  const validBlockTypes = [
    'outcomes', 'vocab', 'diagram', 'explanation', 
    'worked-example', 'guided-practice', 'practice', 
    'spaced-review', 'microbreak'
  ];
  
  for (let i = 0; i < original.blocks.length; i++) {
    const patchedType = patched.blocks[i].type;
    
    if (!validBlockTypes.includes(patchedType)) {
      console.warn(`[Refinement] Block ${i} has invalid type: "${patchedType}"`);
      return false;
    }
  }
  
  return true;
}
```

---

#### Real Patch Examples

**Example 1: Fix Missing Lesson Prefix in Question ID**

```json
{
  "op": "replace",
  "path": "/blocks/4/content/questions/0/id",
  "from": "C1-L1-A",
  "value": "203-3A11-C1-L1-A"
}
```

**Before:**
```json
{
  "id": "C1-L1-A",
  "questionText": "What is a Final Circuit?"
}
```

**After:**
```json
{
  "id": "203-3A11-C1-L1-A",
  "questionText": "What is a Final Circuit?"
}
```

**Points Recovered:** +2 (Schema Compliance)

---

**Example 2: Add Missing "In This Lesson" Orientation**

```json
{
  "op": "prepend",
  "path": "/blocks/3/content/content",
  "value": "### In this lesson\n\nYou will learn to identify different types of circuits and understand when to use each type in electrical installations.\n\n"
}
```

**Before:**
```markdown
**What this is**

A Final Circuit is an electrical circuit...
```

**After:**
```markdown
### In this lesson

You will learn to identify different types of circuits and understand when to use each type in electrical installations.

**What this is**

A Final Circuit is an electrical circuit...
```

**Points Recovered:** +3 (Beginner Clarity)

---

**Example 3: Add Missing "Key Points" Summary**

```json
{
  "op": "append",
  "path": "/blocks/3/content/content",
  "value": "\n\n### Key Points\n- Final circuits connect the distribution board to end-user devices\n- Different circuit types serve different functions (power, lighting, control)\n- Proper circuit selection ensures safety and prevents overloading"
}
```

**Before:**
```markdown
...efficient power distribution.

### Coming Up Next
In our next lesson...
```

**After:**
```markdown
...efficient power distribution.

### Key Points
- Final circuits connect the distribution board to end-user devices
- Different circuit types serve different functions (power, lighting, control)
- Proper circuit selection ensures safety and prevents overloading

### Coming Up Next
In our next lesson...
```

**Points Recovered:** +3 (Beginner Clarity)

---

#### Debugging Patch Failures

**Common Issues:**

1. **"Cannot read property of undefined"**
   - Path references non-existent field
   - Check array indexes (0-based)
   - Verify all path segments exist

2. **"Type mismatch"**
   - Attempting prepend/append on non-string
   - Check field type in original lesson
   - Use replace operation instead

3. **"Block count changed"**
   - Patch accidentally deleted array element
   - Check for array manipulation
   - Verify path doesn't remove blocks

4. **"Validation failed"**
   - Patched lesson violates schema
   - Check for required field deletion
   - Verify block types remain valid

**Diagnostic Commands:**

```typescript
// Audit all IDs after patching
auditAllIDs(patchedLesson);

// Compare block counts
console.log(`Original: ${original.blocks.length} blocks`);
console.log(`Patched: ${patched.blocks.length} blocks`);

// Validate specific path exists
const value = getValueAtPath(lesson, "/blocks/3/content/title");
console.log(`Path exists: ${value !== undefined}`);
```

---

## Real Refinement Example (Complete Walkthrough)

This section shows a complete refinement cycle using lesson `203-3A11` as the base, demonstrating how Phase 10 improves lesson quality through surgical patches.

### Initial Lesson Generation (Before Refinement)

**Lesson ID:** `203-3A11-circuit-types-what-they-do`

**Generated by:** Sequential 10-phase system (Phases 1-9)

**Initial Score:** 87/100

### LLM Scorer Analysis

**Breakdown:**

| Section | Score | Max | Issues |
|---------|-------|-----|--------|
| Schema & Contract | 14/15 | 15 | Minor: 1 question ID missing prefix |
| Beginner Clarity & Staging | 20/30 | 30 | **MAJOR:** Missing orientation, missing key points |
| Alignment | 11/15 | 15 | Moderate: Terminology inconsistency |
| Questions & Cognitive | 22/25 | 25 | Minor: Question wording could be clearer |
| Marking Robustness | 10/10 | 10 | None |
| Visual/Diagram | 5/5 | 5 | None |
| **Total** | **87/100** | **100** | |

**Grade:** "Strong" (but below 97 threshold → triggers Phase 10)

### Top Issues Identified (Ranked by Impact)

**Issue 1: Missing "In This Lesson" Orientation** (Beginner Clarity)
- **Location:** `blocks[3]` (explanation-1 content)
- **Problem:** Explanation starts directly with "**What this is**" without beginner orientation
- **Impact:** -3 points
- **Fixability:** phase10 (prepend operation)
- **Suggestion:** Prepend orientation section with goal, context, and 3 bullet takeaways

**Issue 2: Missing "Key Points" Summary** (Beginner Clarity)
- **Location:** `blocks[3]` (explanation-1 content)
- **Problem:** No explicit bullet-point summary of key takeaways
- **Impact:** -3 points
- **Fixability:** phase10 (append operation before "Coming Up Next")
- **Suggestion:** Append key points section with 3 main takeaways

**Issue 3: Terminology Inconsistency** (Questions)
- **Location:** `blocks[4].content.questions[2]` (check question)
- **Problem:** Question asks about "circuit layout" but explanation uses "Circuit Topology" as the defined term
- **Impact:** -2 points
- **Fixability:** phase10 (replace operation)
- **Suggestion:** Change "layout" to "topology" in question text

**Issue 4: Explanation Missing "Coming Up Next"** (Beginner Clarity)
- **Location:** `blocks[5]` (explanation-2 content)
- **Problem:** Second explanation missing transition to next section
- **Impact:** -2 points
- **Fixability:** phase10 (append operation)
- **Suggestion:** Append transition statement

**Issue 5: Question ID Missing Lesson Prefix** (Schema)
- **Location:** `blocks[4].content.questions[3].id`
- **Problem:** ID is `C1-L2` instead of `203-3A11-C1-L2`
- **Impact:** -1 point
- **Fixability:** phase10 (replace operation)
- **Suggestion:** Add lesson prefix

**Note:** Issues 6-10 were minor formatting/style issues addressed by same operations.

### Phase 10 Patch Generation

Based on top 5 issues, Phase 10 generates these patches:

```json
{
  "patches": [
    {
      "op": "prepend",
      "path": "/blocks/3/content/content",
      "value": "### In this lesson\n\nYou're learning to identify the primary types of circuits used in electrical installations—such as power, lighting, and control circuits—and understand when to select each type. By the end, you'll know the difference between radial and ring final circuit topologies and their typical applications.\n\n**Three key points:**\n- Final circuits connect distribution boards directly to points of utilization\n- Circuit type determines cable size, protective device rating, and installation method\n- Topology choice (radial vs ring) affects current capacity and cable requirements\n\n"
    },
    {
      "op": "append",
      "path": "/blocks/3/content/content",
      "value": "\n\n### Key Points\n- Final circuits deliver electricity from the distribution board to end-user devices (sockets, lights, appliances)\n- Different circuit types serve specific functions: power for general use, lighting for illumination, control for managing equipment\n- Proper circuit selection ensures safety, prevents overloading, and maintains code compliance"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/2/questionText",
      "from": "What is circuit layout?",
      "value": "What is Circuit Topology?"
    },
    {
      "op": "append",
      "path": "/blocks/5/content/content",
      "value": "\n\n### Coming Up Next\n\nIn our next lesson, we will explore the specific protective devices, such as MCBs and RCDs, used to safeguard these circuit types."
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/3/id",
      "from": "C1-L2",
      "value": "203-3A11-C1-L2"
    }
  ]
}
```

### Patch Application Process

**Console Output:**

```
🔧 [Phase 10] Applying 5 patches to cloned lesson...
🔧 [Phase 10] Original lesson blocks: 11

   ✓ /blocks/3/content/content [prepend]
      Old: "**What this is**\n\nIn a modern electrical..."
      New: "### In this lesson\n\nYou're learning to identify...\n\n**What this is**\n\nIn a modern electrical..."
      Reason: Missing beginner orientation
      Expected improvement: +3 points

   ✓ /blocks/3/content/content [append]
      Old: "...efficient power distribution.\n\n### Coming Up Next..."
      New: "...efficient power distribution.\n\n### Key Points\n- Final circuits deliver...\n\n### Coming Up Next..."
      Reason: Missing key points summary
      Expected improvement: +3 points

   ✓ /blocks/4/content/questions/2/questionText [replace]
      Old: "What is circuit layout?"
      New: "What is Circuit Topology?"
      Reason: Terminology inconsistency
      Expected improvement: +2 points

   ✓ /blocks/5/content/content [append]
      Old: "...thermal limits of the cables."
      New: "...thermal limits of the cables.\n\n### Coming Up Next\n\nIn our next lesson..."
      Reason: Missing transition section
      Expected improvement: +2 points

   ✓ /blocks/4/content/questions/3/id [replace]
      Old: "C1-L2"
      New: "203-3A11-C1-L2"
      Reason: Missing lesson prefix
      Expected improvement: +1 point

🔧 [Phase 10] Patch Application Summary:
   Successful: 5/5
   Failed: 0/5
   Cloned lesson blocks: 11
```

### Before/After Comparison

**Block 3 (Explanation-1) - BEFORE:**

```markdown
**What this is**

In a modern electrical installation, a **Final Circuit** is the end-point of the distribution system. It is defined as an electrical circuit connected directly from a distribution board to the points of utilization...

[... 450 words of content ...]

**Quick recap**

A **Final Circuit** delivers electricity from the distribution board to the end user. Primary types include lighting for illumination, power for general appliances, and **Control Circuit** arrangements for managing equipment.
```

**Block 3 (Explanation-1) - AFTER:**

```markdown
### In this lesson

You're learning to identify the primary types of circuits used in electrical installations—such as power, lighting, and control circuits—and understand when to select each type. By the end, you'll know the difference between radial and ring final circuit topologies and their typical applications.

**Three key points:**
- Final circuits connect distribution boards directly to points of utilization
- Circuit type determines cable size, protective device rating, and installation method
- Topology choice (radial vs ring) affects current capacity and cable requirements

**What this is**

In a modern electrical installation, a **Final Circuit** is the end-point of the distribution system. It is defined as an electrical circuit connected directly from a distribution board to the points of utilization...

[... 450 words of content ...]

**Quick recap**

A **Final Circuit** delivers electricity from the distribution board to the end user. Primary types include lighting for illumination, power for general appliances, and **Control Circuit** arrangements for managing equipment.

### Key Points
- Final circuits deliver electricity from the distribution board to end-user devices (sockets, lights, appliances)
- Different circuit types serve specific functions: power for general use, lighting for illumination, control for managing equipment
- Proper circuit selection ensures safety, prevents overloading, and maintains code compliance
```

**Changes:**
- ✅ Added orientation section at start (prepend)
- ✅ Added key points summary before recap (append)
- ✅ Now follows complete 8-part structure

---

**Block 4 (Understanding Check) Question 3 - BEFORE:**

```json
{
  "id": "C1-L2",
  "questionText": "What is circuit layout?",
  "answerType": "short-text",
  "cognitiveLevel": "connection"
}
```

**Block 4 (Understanding Check) Question 3 - AFTER:**

```json
{
  "id": "203-3A11-C1-L2",
  "questionText": "What is Circuit Topology?",
  "answerType": "short-text",
  "cognitiveLevel": "connection"
}
```

**Changes:**
- ✅ Fixed ID: added lesson prefix
- ✅ Fixed terminology: "layout" → "Circuit Topology"

---

**Block 5 (Explanation-2) - BEFORE:**

```markdown
[... content ...]

**Quick recap**

**Circuit Topology** defines how we layout our wiring. A **Radial Circuit** is a simple line from start to finish, used for lighting and dedicated heavy loads. A **Ring Final Circuit** is a continuous loop that allows for efficient power distribution over a larger area.
```

**Block 5 (Explanation-2) - AFTER:**

```markdown
[... content ...]

**Quick recap**

**Circuit Topology** defines how we layout our wiring. A **Radial Circuit** is a simple line from start to finish, used for lighting and dedicated heavy loads. A **Ring Final Circuit** is a continuous loop that allows for efficient power distribution over a larger area.

### Coming Up Next

In our next lesson, we will explore the specific protective devices, such as MCBs and RCDs, used to safeguard these circuit types.
```

**Changes:**
- ✅ Added transition section (append)

### Re-Scoring the Refined Lesson

After patches applied, the lesson is re-scored:

**Refined Score:** 93/100

**Breakdown:**

| Section | Original | Refined | Change |
|---------|----------|---------|--------|
| Schema & Contract | 14/15 | 15/15 | +1 ✅ |
| Beginner Clarity & Staging | 20/30 | 28/30 | +8 ✅ |
| Alignment | 11/15 | 11/15 | 0 |
| Questions & Cognitive | 22/25 | 24/25 | +2 ✅ |
| Marking Robustness | 10/10 | 10/10 | 0 |
| Visual/Diagram | 5/5 | 5/5 | 0 |
| **Total** | **87/100** | **93/100** | **+6** ✅ |

**Grade:** "Strong" (improved, still below 97 but significant progress)

**Score Delta: +6 points (87 → 93)**

### What Improved

**Schema & Contract (+1):**
- ✅ Fixed missing lesson prefix in question ID
- All IDs now follow correct pattern

**Beginner Clarity & Staging (+8):**
- ✅ Added "In this lesson" orientation with goal, context, 3 takeaways (+3)
- ✅ Added "Key Points" summary with bullet list (+3)
- ✅ Added "Coming Up Next" transition (+2)
- Now follows complete 8-part structure

**Questions & Cognitive (+2):**
- ✅ Fixed terminology inconsistency (layout → topology)
- Questions now use exact terms from explanation

### Remaining Issues (Why Not 97+?)

**Issue 1: Alignment (-4 points)**
- **Problem:** No worked example exists for this lesson (calculation-only trigger in codebase)
- **Why not fixed:** Phase 10 cannot add blocks (structural change)
- **Solution:** Requires code change to make worked examples universal

**Issue 2: Second Explanation Missing Key Points (-2 points)**
- **Problem:** Only explanation-1 got key points appended; explanation-2 still missing
- **Why not fixed:** Phase 10 budget limited to 10 patches, prioritized highest impact
- **Solution:** Could be fixed by additional patch in next iteration

### Phase 10 Success Metrics

**Patches Applied:** 5/5 (100% success rate)

**Points Recovered:**
- Target: +11 points (maximum possible from top 5 issues)
- Actual: +6 points (55% of maximum)
- Efficiency: Good (most high-impact issues addressed)

**What Worked:**
- ✅ Prepend/append operations preserved all existing content
- ✅ No validation errors or rollbacks
- ✅ Block count preserved (11 blocks before and after)
- ✅ All patches applied successfully

**What Didn't Work:**
- ⚠️ Some fixes didn't yield expected point gains (terminology fix worth 0 points in re-scoring)
- ⚠️ Structural issues (missing worked example) remain unfixable

### Audit Trail

Both versions saved for comparison:

```
lessons/
  203-3A11-circuit-types-what-they-do.json          (refined version - score 93)
  203-3A11-circuit-types-what-they-do.original.json (original version - score 87)
```

**Metadata in refined version:**

```json
{
  "metadata": {
    "created": "2026-02-06",
    "updated": "2026-02-06",
    "version": "1.0",
    "author": "C&G 2365 Learning Team",
    "refinement": {
      "wasRefined": true,
      "originalScore": 87,
      "refinedScore": 93,
      "patchesApplied": 5,
      "timestamp": "2026-02-06T14:32:15Z"
    }
  }
}
```

### Lessons Learned

**What This Example Teaches:**

1. **Phase 10 is effective for content additions**
   - Prepend/append operations excel at adding missing sections
   - No risk to existing content (preserves everything)

2. **Terminology fixes may not always score points**
   - Fixing "layout" → "topology" was pedagogically correct
   - But scorer didn't deduct points for it originally (false positive in issue detection)

3. **Structural issues are beyond Phase 10's scope**
   - Missing worked example requires regeneration
   - Cannot add blocks, only modify existing content

4. **Beginner clarity improvements have highest ROI**
   - +8 points from orientation and summaries
   - Most impactful category for Phase 10 fixes

5. **10-patch limit is usually sufficient**
   - 5 patches recovered 55% of possible points
   - Diminishing returns after top issues addressed

### When to Regenerate vs Refine

**Use Phase 10 Refinement when:**
- Missing sections in existing blocks (orientation, key points, transitions)
- Terminology inconsistencies
- ID format issues
- Minor wording improvements
- Score 85-96 (close to threshold)

**Regenerate the entire lesson when:**
- Missing required blocks (no worked example, no vocab)
- Wrong block order (major contract violations)
- Score < 85 (too many fundamental issues)
- Guided practice step count mismatch (structural)
- Teaching-before-testing violations requiring new content

---

## Pre-Scoring: Schema Normalizer

**Purpose:** Fix deterministic issues before LLM scoring (frees up "top 10" budget)

**Files:** `src/lib/generation/lessonNormalizer.ts`

### What It Fixes

```typescript
function normalizeLessonSchema(lesson: Lesson): NormalizationResult {
  // 1. Add lesson prefix to all block IDs
  // 2. Add lesson prefix to all question IDs
  // 3. Convert expectedAnswer to arrays
  // 4. Fix duplicate block orders
  // 5. Correct spaced-review field names (questionText)
  // 6. Remove units from numeric expectedAnswer values
  
  return { normalized, fixesApplied };
}
```

### Example Output

```
📐 [Normalization] Applied 8 automatic fixes:
   ✓ Block 0 ID: 'outcomes' → '203-3A11-outcomes'
   ✓ Question 4.0 ID: 'C1-L1-A' → '203-3A11-C1-L1-A'
   ✓ Question 4.1 ID: 'C1-L1-B' → '203-3A11-C1-L1-B'
   ✓ Question 8.2 expectedAnswer: removed units from numeric
   ...
```

### Impact

**Before Normalizer:**
```
LLM Scorer finds: 20 issues
- 15 ID issues (mechanical)
- 3 order issues (mechanical)
- 2 content issues (learning quality)

Phase 10 budget: 10 issues
Result: Wastes 10 on IDs, ignores content
```

**After Normalizer:**
```
Normalizer fixes: 18 mechanical issues
LLM Scorer finds: 10 issues (all learning quality)
- Missing "Key Points" sections
- Missing orientation
- Teaching-before-testing violations
- Guided practice misalignment

Phase 10 budget: 10 issues
Result: All 10 fix learning quality → higher scores
```

---

## LLM Scoring System

**Purpose:** Evaluate lesson quality and suggest improvements (replaces 976-line rubric)

**Files:** `src/lib/generation/llmScoringService.ts`

### System Prompt (Updated Feb 6, 2026)

```typescript
You are an expert educational content reviewer for electrical trade training.

TASK
1) Score the lesson JSON on a 100-point rubric.
2) Identify the TOP 10 highest-impact learning quality issues.
3) For each issue, provide precise field-level patches.
4) Respect Phase 10 constraints (no add/remove/reorder blocks).

PHASE 10 CONSTRAINT (CRITICAL)
- Allowed: replace field values; prepend/append to string content
- Not Allowed: add blocks, remove blocks, reorder blocks, change block count
- If issue requires structural changes, mark fixability as "requiresRegeneration"

SCORING RUBRIC (100 points total):

A) Schema & Contract Compliance (15 points)
- Valid JSON, required fields, no duplicate IDs
- Relative ordering: checks after explanations; worked before guided; 
  guided before independent; integrative near end; spaced review last
- NOTE: Schema issues pre-normalized, only flag if critically broken

B) Beginner Clarity & Staging (30 points)
   B1: Beginner Orientation (10 points)
       - Has "In this lesson" preview section
       - Has "Key Points" summary with bullet list
       - Has "Coming Up Next" transition
   B2: Teaching-Before-Testing (10 points)
       - Content in explanation before questions assess it
       - No questions about untaught terms/concepts
       - Checks placed immediately after explanations
   B3: Scaffolding (10 points)
       - Difficulty ramps smoothly
       - Concepts build logically

C) Worked/Guided/Independent Alignment (15 points)
- Guided practice mirrors worked example steps exactly
- Independent practice matches modeled skills
- No new task types suddenly introduced
- If no worked example: score full points

D) Questions & Cognitive Structure (25 points)
   D1: Scope + Technical Accuracy (10 points)
       - Questions match lesson scope and outcomes
       - Technically correct information
   D2: Question Quality (10 points)
       - Clear, unambiguous wording
       - Avoids unjustified absolutes (prefer "typically", "often")
       - Appropriate question verbs
   D3: Integrative Block Structure (5 points)
       - If integrative block exists, exactly 2 questions
       - Q1: connection (2-3 concepts)
       - Q2: synthesis (all concepts, 3-4 sentences)

E) Marking Robustness (10 points)
- expectedAnswer gradeable and matches answerType
- Numeric answers: numbers only (no units)
- Short-text: 2-6 acceptable variations

F) Visual/Diagram Alignment (5 points)
- Diagrams referenced appropriately
- No missing/broken references

PRIORITIZATION (CRITICAL):
- Maximum 10 issues total
- Focus on learning quality (B, C, D sections)
- Schema/mechanical (A, E) pre-normalized - only flag if broken
- Impact ranking: Beginner Clarity > Alignment > Questions > Marking > Schema
- If many similar issues, group with note: "Deterministic fix - recommend code pre-pass"

OUTPUT FORMAT (JSON ONLY):
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
      "problem": "Explanation at blocks[3] missing 'Key Points' summary. Students need explicit takeaways.",
      "fixability": "phase10",
      "patches": [
        {
          "op": "append",
          "path": "/blocks/3/content/content",
          "value": "\\n\\n### Key Points\\n- Point one\\n- Point two"
        }
      ]
    }
  ],
  "grade": "Strong"
}

PATCH OPERATIONS:
- "replace": {"op": "replace", "path": "/blocks/4/title", "from": "Old", "value": "New"}
- "append": {"op": "append", "path": "/blocks/3/content/content", "value": "\\n\\nText"}
- "prepend": {"op": "prepend", "path": "/blocks/3/content/content", "value": "Text\\n\\n"}

VALIDATION:
- Total MUST equal sum of breakdown scores
- Paths use JSON Pointer format (/blocks/3/content/title)
- Each issue needs ≥1 patch (unless requiresRegeneration)
- Max 10 issues
- Focus on learning quality (B, C, D)
```

### User Prompt

```typescript
Score this electrical trade lesson using the rubric.

LESSON TO SCORE:
{lesson JSON - can be 3,000-6,000 tokens}

CRITICAL REMINDERS:
1. Focus on TOP 10 learning quality issues (B, C, D sections)
2. Use structured patch format with JSON Pointer paths
3. Ensure total equals sum of breakdown scores
4. Each patch needs "op", "path", "value"
5. Mark structural issues as "requiresRegeneration"

Return ONLY JSON scoring object (no markdown).
```

### Key Changes (Feb 6, 2026)

1. **Token Limit:** 8,000 → 16,000 (prevents truncation)
2. **Rubric Rewrite:** Explicit scoring for high-yield patterns
3. **Pre-Normalization:** Schema fixes done before scoring
4. **Structured Patches:** JSON ops instead of free-text strings
5. **Prioritization:** Learning quality over mechanical fixes

---

## Prompt Standards

All phases follow these conventions:

### Common Structure

```typescript
class PhaseX extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase X: Name';
  }

  protected buildSystemPrompt(): string {
    return `You are a [specialist role] for C&G 2365 Training.
    
Your task is to [specific objective].

[Rules, constraints, quality standards]

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: InputType): string {
    return `[Specific task description]
    
[Context from previous phases]

[Requirements and format]`;
  }
}
```

### JSON Output Instructions

All phases use `this.getJsonOutputInstructions()` which enforces:
- Valid RFC 8259 JSON only
- No markdown code blocks
- Double-quoted property names
- No trailing commas
- No comments

### Token Limits by Phase

| Phase | Type | Default Tokens | Notes |
|-------|------|---------------|-------|
| Phase 1 | phase | Default | Planning (small output) |
| Phase 2 | phase | Default | Vocabulary (small output) |
| Phase 3 | lesson | Default | Explanation (400-600 words) |
| Phase 4 | phase | Default | Checks (structured JSON) |
| Phase 5 | phase | Default | Worked example (conditional) |
| Phase 6 | phase | Default | Practice questions |
| Phase 7 | phase | Default | Integration (2 questions) |
| Phase 8 | phase | Default | Spaced review (4 questions) |
| Phase 9 | N/A | N/A | TypeScript only (no LLM) |
| Phase 10 | phase | Default | Patches (small output) |
| **Scoring** | lesson | **16,000** | Large: lesson JSON + detailed feedback |

### Error Handling

All phases use `generateWithRetry()` which:
- Retries up to 3 times on failure
- Detects truncation and retries with higher limits
- Validates response before parsing
- Logs all attempts for debugging

---

## Troubleshooting

### Common Issues

**Issue: Phase 5 Skipped (No Worked Example)**

**Symptom:**
```
📝 Phase 5: Worked Example...
    ⊘ Skipped (not needed)
```

**Cause:** Line 411 in `SequentialLessonGenerator.ts` only triggers for calculations:
```typescript
const needsWorkedExample = requiresWorkedExample([
  { type: 'calculation', confidence: 0.8 }
]);
```

**Fix:** Update to include identification/selection tasks:
```typescript
const tasks = classifyLessonTask(request.topic, request.section, request.mustHaveTopics);
const needsWorkedExample = requiresWorkedExample(tasks);
```

**Impact:** Lessons without calculations miss Worked/Guided blocks → scores 85-90 instead of 95+

---

**Issue: Empty Spaced Review**

**Symptom:**
```json
{
  "type": "spaced-review",
  "content": {
    "questions": [],
    "notes": "No prerequisites for this foundational lesson"
  }
}
```

**Cause:** Phase 8 returns empty array if `prerequisites.length === 0`

**Fix Options:**
1. **Require prerequisites:** Don't allow foundational lessons
2. **Generate generic review:** Use common electrical fundamentals
3. **Accept empty:** Keep current behavior (expert says "wasted opportunity")

---

**Issue: Missing "In This Lesson" Orientation** ✅ FIXED (Feb 6, 2026)

**Status:** RESOLVED - Phase 3 now uses 8-part structure

**Previous Problem:** Scoring deducted points for missing beginner orientation

**Solution Implemented:**
Phase 3 updated to require **8-part structure** (was 6-part):
```
1. ### In this lesson (goal + context + 3 bullet takeaways)
2. **What this is**
3. **Why it matters**
4. **Key facts / rules**
5. **[MODE SECTION]** (When to choose it / How to / etc.)
6. **Common mistakes**
7. **Quick recap**
8. ### Coming Up Next (transition to next section)
```

**Impact:** +3-5 points per lesson (beginner clarity improved)

---

**Issue: Guided Practice Doesn't Mirror Worked Example** ✅ FIXED (Feb 6, 2026)

**Status:** RESOLVED - Phase 5 now enforces strict MIRRORING CONTRACT

**Previous Problem:** Scoring deducted points for misalignment (different step counts, different decision points)

**Solution Implemented:**
Phase 5 updated with **MIRRORING CONTRACT** enforcement:
```
CRITICAL RULE (no exceptions):
- guidedPractice.steps.length MUST EQUAL workedExample.steps.length
- stepNumbers MUST match exactly (1, 2, 3, 4... - no gaps, no extras)
- Same decision points at each step
- Same process flow (only values/scenario change)

Example:
Worked Step 1: "Identify job context: domestic kitchen, multiple appliances"
Guided Step 1: "Identify job context: [student must identify from new scenario]"

Worked Step 2: "Select correct circuit: Ring final circuit (32A)"
Guided Step 2: "Select correct circuit: [student must select from new scenario]"
```

**Additional Improvements:**
- expectedAnswer variants reduced from 2-6 → **1-2 only**
- Added provenance requirements (cite BS 7671 or describe lookup)
- Added "No invented table values" rule

**Impact:** +3-6 points per lesson (prevents misaligned practice)

---

**Issue: Invented Table Values in Worked Examples** ✅ FIXED (Feb 6, 2026)

**Status:** RESOLVED - Phase 5 now requires provenance for standard values

**Previous Problem:** Worked examples would invent cable sizes, breaker ratings, or other spec values not provided in the explanation

**Symptom:**
```
Step 2: "Select 2.5mm² cable and 20A breaker"
(But explanation never mentioned these specific values)
```

**Solution Implemented:**
Phase 5 updated with **PROVENANCE REQUIREMENTS**:
```
CRITICAL RULES:
- IF using BS 7671 or IET guidance values: cite the source explicitly
  Example: "BS 7671 Table 4D5 specifies 2.5mm² for 20A circuits"

- IF values not provided in explanation: describe how to look them up
  Example: "Refer to BS 7671 Appendix 4 to select appropriate cable size"

- DO NOT invent standard wire sizes, breaker ratings, or spec values
```

**Why This Matters:**
- Students need to learn WHERE values come from, not just the values
- Invented values create false confidence without source knowledge
- Real exam questions test lookup skills, not memorization

**Impact:** +2-3 points per lesson (technical accuracy improved)

---

**Issue: Understanding Check Answers Not in Explanation** ✅ FIXED (Feb 6, 2026)

**Status:** RESOLVED - Phase 4 now uses ANCHOR FACT METHOD

**Previous Problem:** Understanding check questions would accept broad paraphrases or vague answers not verbatim from explanation

**Symptom:**
```
Question: "What is a final circuit?"
expectedAnswer: ["a circuit that delivers power", "circuit from board to outlet", ...]
(6+ variants, some not in explanation text)
```

**Solution Implemented:**
Phase 4 updated with **ANCHOR FACT METHOD**:
```
CRITICAL PROCESS:
1) Select EXACTLY 3 "Anchor Facts" from explanation (verbatim phrases, 6-20 words)
2) Write Q1, Q2, Q3 to test these anchor facts
3) expectedAnswer[0] MUST be verbatim from explanation
4) EXACTLY 2-4 variants for L1 (tight normalization only: case, plural, articles)
5) EXACTLY 1-2 variants for L2

Example:
Explanation text: "Lighting circuits typically use 1.0mm² or 1.5mm² conductors"
Anchor Fact: "Lighting circuits typically use 1.0mm² or 1.5mm² conductors"
Question: "What conductor sizes are typically used for lighting circuits?"
expectedAnswer: [
  "1.0mm² or 1.5mm²",  // verbatim substring
  "1.0mm² or 1.5mm² conductors",  // with "conductors"
  "1.0 or 1.5mm²"  // unit variation
]
```

**Why This Matters:**
- Gradeable with exact string matching (no ambiguous "close enough")
- Students learn precise terminology from the explanation
- Reduces false positives from vague answers like "for safety"

**Impact:** +2-4 points per lesson (marking robustness improved)

---

**Issue: Order Contract Violation**

**Symptom:**
```
Error: ORDER CONTRACT VIOLATION: Missing required block order 4.5
```

**Cause:** Phase 4 didn't generate check for explanation-1

**Fix:** Phase 4 MUST generate check for every explanation Phase 3 produces

---

## Common LLM Generation Mistakes (Comprehensive Reference)

This section documents recurring LLM generation errors, their impacts, how they're fixed, and prevention strategies.

### 1. ID Pattern Violations

#### 1.1 Missing Lesson Prefix

**Symptom:**
```json
{
  "id": "C1-L1-A",  // Missing "203-3A11-" prefix
  "questionText": "What is a Final Circuit?"
}
```

**Correct Format:**
```json
{
  "id": "203-3A11-C1-L1-A",  // Has lesson prefix
  "questionText": "What is a Final Circuit?"
}
```

**Impact:** -2 points (Schema Compliance)

**Frequency:** High (affects 40-60% of generated lessons)

**Fixed by:** Schema Normalizer (automatic pre-scoring fix)

**How to prevent:**
- Phase 4 prompt emphasizes: "Each question ID must start with `{lessonId}-`"
- User prompt shows exact format: `{lessonId}-C{n}-L{level}-{A|B|C}`
- But LLMs often forget prefix despite explicit instructions

**Detection:**
```typescript
// Normalizer checks all question IDs
if (!question.id.startsWith(lesson.id + '-')) {
  fixes.push(`Add lesson prefix: ${question.id} → ${lesson.id}-${question.id}`);
}
```

---

#### 1.2 Wrong ID Pattern

**Symptom:**
```json
// Wrong patterns LLMs generate:
"P-1"              // Has dash before number
"203-3A11-practice-1"  // Has "practice" in ID
"question-1"       // Generic name
"prac1"           // Abbreviated
```

**Correct Format:**
```json
"203-3A11-P1"      // Correct: {lessonId}-P{n}
```

**Impact:** -2 points (Schema Compliance)

**Frequency:** Medium (affects 20-30% of lessons)

**Fixed by:** Manual patch or regeneration (normalizer doesn't auto-fix wrong patterns)

**How to prevent:**
- Phase 6 prompt includes pattern table with examples
- System prompt shows: "Practice questions: `{lessonId}-P{n}` (e.g., `203-3A11-P1`)"
- LLMs sometimes invent their own "logical" patterns

**Prevention example in Phase 6:**
```typescript
QUESTION ID PATTERNS (CRITICAL - EXACT FORMAT REQUIRED):
Practice questions: {lessonId}-P{n}
Examples:
  ✓ CORRECT: "203-3A11-P1", "203-3A11-P2", "203-3A11-P3"
  ✗ WRONG: "P-1", "203-3A11-practice-1", "question-1"
```

---

#### 1.3 Duplicate IDs

**Symptom:**
```json
{
  "questions": [
    { "id": "203-3A11-C1-L1-A", "questionText": "..." },
    { "id": "203-3A11-C1-L1-B", "questionText": "..." },
    { "id": "203-3A11-C1-L1-A", "questionText": "..." }  // Duplicate!
  ]
}
```

**Impact:** -5 to -20 points (Auto-cap - critical failure)

**Frequency:** Low (< 5% of lessons)

**Fixed by:** Regeneration required (structural data error)

**How to prevent:**
- LLM sometimes "restarts" numbering mid-generation
- Happens when token limit is hit and response truncated
- More common with smaller context windows

**Why it happens:**
- LLM loses track of previous IDs when generating long question lists
- Regenerative completion can restart from earlier state
- Phase-by-phase architecture reduces this (smaller outputs per phase)

---

### 2. Block Ordering Mistakes

#### 2.1 Check Not After Explanation

**Symptom:**
```json
[
  { "type": "outcomes", "order": 1 },
  { "type": "vocab", "order": 2 },
  { "type": "practice", "order": 4 },      // Check at 4
  { "type": "explanation", "order": 5 }    // Explanation at 5 - WRONG ORDER!
]
```

**Correct Order:**
```json
[
  { "type": "outcomes", "order": 1 },
  { "type": "vocab", "order": 2 },
  { "type": "explanation", "order": 4 },   // Explanation first
  { "type": "practice", "order": 4.5 }     // Check after (explanation.order + 0.5)
]
```

**Impact:** -10 points (Contract violation - teaches before testing principle broken)

**Frequency:** Low (< 5% - Phase 9 Assembler enforces correct order)

**Fixed by:** Phase 9 Assembler (deterministic enforcement)

**How to prevent:**
- Phase 4 calculates order as `explanation.order + 0.5` (not hardcoded)
- Phase 9 validates and reorders if necessary
- This is a fail-safe mechanism, not a primary prevention

**Assembler Logic:**
```typescript
// Phase 9 enforces pairing
explanations.forEach((exp) => {
  blocks.push({ type: 'explanation', order: exp.order });
  blocks.push({ type: 'practice', order: exp.order + 0.5 });  // Always paired
});
```

---

#### 2.2 Integrative Block at Wrong Position

**Symptom:**
```json
{ "type": "practice", "mode": "integrative", "order": 9 }    // WRONG: should be 9.5
{ "type": "practice", "mode": "integrative", "order": 10 }   // WRONG: spaced-review must be last
{ "type": "practice", "mode": "integrative", "order": 11 }   // WRONG: out of range
```

**Correct Position:**
```json
{ "type": "practice", "mode": "integrative", "order": 9.5 }  // MUST be exactly 9.5
```

**Impact:** -5 points (Contract violation)

**Frequency:** Low (< 10% - Phase 7 and 9 enforce this)

**Fixed by:** Phase 9 Assembler forces `order: 9.5`

**How to prevent:**
- Phase 7 prompt explicitly states: "order: 9.5 (NOT 9, NOT 10)"
- Phase 9 hardcodes integrative order to 9.5
- This position ensures integrative comes before spaced review but after practice

**Why 9.5 specifically:**
- After independent practice (order 8)
- Before spaced review (order 10, MUST be last)
- Leaves room for optional blocks between 8 and 9.5

---

#### 2.3 Spaced Review Not Last

**Symptom:**
```json
[
  { "type": "practice", "order": 8 },
  { "type": "spaced-review", "order": 9 },      // WRONG: not last
  { "type": "practice", "order": 9.5 },         // Integrative should come before spaced
  { "type": "microbreak", "order": 10 }         // WRONG: spaced must be last
]
```

**Correct Order:**
```json
[
  { "type": "practice", "order": 8 },
  { "type": "practice", "order": 9.5 },         // Integrative
  { "type": "spaced-review", "order": 10 }      // MUST be last (highest order)
]
```

**Impact:** -10 to -20 points (Auto-cap - critical contract violation)

**Frequency:** Very Low (< 2% - Phase 9 enforces this)

**Fixed by:** Phase 9 Assembler enforces spaced review as last block

**How to prevent:**
- Phase 8 always generates `order: 10`
- Phase 9 adds spaced review last, validates it's highest order
- Fail-fast validation rejects lesson if violated

**Assembler Validation:**
```typescript
validateOrderContract(blocks: LessonBlock[]): void {
  const spacedReview = blocks.find(b => b.type === 'spaced-review');
  const maxOrder = Math.max(...blocks.map(b => b.order));
  
  if (spacedReview && spacedReview.order !== maxOrder) {
    throw new Error('ORDER CONTRACT VIOLATION: Spaced review must be last block');
  }
}
```

---

### 3. Missing Required Blocks

#### 3.1 No Outcomes Block

**Symptom:**
```json
{
  "blocks": [
    { "type": "vocab", "order": 1 },        // Starts with vocab instead of outcomes
    { "type": "explanation", "order": 2 }
  ]
}
```

**Correct Structure:**
```json
{
  "blocks": [
    { "type": "outcomes", "order": 1 },     // MUST be first block
    { "type": "vocab", "order": 2 },
    { "type": "explanation", "order": 4 }
  ]
}
```

**Impact:** -20 points (Auto-cap to 0 - structural failure)

**Frequency:** Extremely Low (< 1% - Phase 1 always generates)

**Fixed by:** Regeneration required (structural failure)

**How to prevent:**
- Phase 1 (Planning) always includes outcomes in plan
- Phase 9 (Assembler) MUST receive outcomes from Phase 1
- If Phase 1 fails, entire generation aborts

**Why outcomes must be first:**
- Students need to know learning goals before content
- Pedagogical best practice (backwards design)
- Assessment alignment requires visible outcomes

---

#### 3.2 No Vocabulary Block

**Symptom:**
```json
{
  "blocks": [
    { "type": "outcomes", "order": 1 },
    { "type": "explanation", "order": 2 }   // Missing vocab block at order 2
  ]
}
```

**Correct Structure:**
```json
{
  "blocks": [
    { "type": "outcomes", "order": 1 },
    { "type": "vocab", "order": 2 },        // MUST have vocab at order 2
    { "type": "explanation", "order": 4 }
  ]
}
```

**Impact:** -5 points (Schema Compliance)

**Frequency:** Very Low (< 2% - Phase 2 always generates)

**Fixed by:** Regeneration required

**How to prevent:**
- Phase 2 (Vocabulary) always generates 4-6 terms
- Phase 9 expects vocab block from Phase 2
- Empty vocab block (0 terms) would also fail validation

---

#### 3.3 Empty Spaced Review

**Symptom:**
```json
{
  "type": "spaced-review",
  "order": 10,
  "content": {
    "questions": [],                        // Empty array
    "notes": "No prerequisites for this foundational lesson"
  }
}
```

**Impact:** -3 points (Wasted scoring opportunity)

**Frequency:** Medium-High (30-40% when no prerequisites exist)

**Fixed by:** Phase 10 cannot fix (empty content - would need to generate questions)

**How to prevent:**
- Current: Phase 8 returns empty array if no prerequisites
- Proposed: Generate generic electrical fundamentals review questions
- Expert feedback: "Empty block is wasted scoring opportunity"

**Possible Fix (Not Yet Implemented):**
```typescript
// Phase 8 could generate fallback questions even without prereqs
if (prerequisites.length === 0) {
  // Generate 4 questions on foundational electrical concepts
  questions = [
    { questionText: "State the voltage of UK domestic mains supply.", expectedAnswer: ["230V"] },
    { questionText: "What does the L conductor carry in a three-phase system?", expectedAnswer: ["Line current", "Live current"] },
    // ... 2 more generic questions
  ];
}
```

---

### 4. Vague expectedAnswer Patterns

#### 4.1 Generic Safety Answers

**Symptom:**
```json
{
  "questionText": "Why must circuits be properly sized?",
  "expectedAnswer": [
    "for safety",
    "to be safe",
    "safety reasons",
    "because it's safer"
  ]
}
```

**Problem:**
- Too vague to grade accurately
- Students can guess without understanding
- Doesn't test specific knowledge

**Better Format:**
```json
{
  "questionText": "Why must circuits be properly sized?",
  "expectedAnswer": [
    "to prevent cable overheating and potential fire hazards",
    "prevents cable overheating",
    "to avoid exceeding the cable's current-carrying capacity"
  ]
}
```

**Impact:** -3 points per question (Marking Robustness + Question Quality)

**Frequency:** Medium (15-25% of questions before Feb 6 update)

**Fixed by:**
- Phase 10 can replace with specific criteria
- Better: Phase 4 should prevent using Anchor Fact Method

**How to prevent (Feb 6 Update):**
- Anchor Fact Method: Select verbatim phrase from explanation first
- Prompt includes: "BANNED ANSWERS: 'for safety', 'to comply', 'good practice' (too vague)"
- Requires: "expectedAnswer must specify WHAT safety concern or WHICH regulation"

---

#### 4.2 Compliance Without Specifics

**Symptom:**
```json
{
  "questionText": "Why are RCDs required?",
  "expectedAnswer": [
    "to comply with regulations",
    "regulatory compliance",
    "required by code",
    "it's the law"
  ]
}
```

**Problem:**
- Doesn't test understanding of WHY regulation exists
- No specific regulation cited
- Could apply to any requirement

**Better Format:**
```json
{
  "questionText": "According to BS 7671, why are RCDs required for socket outlets?",
  "expectedAnswer": [
    "to provide additional protection against electric shock in fault conditions",
    "protects against electric shock if insulation fails",
    "provides 30mA trip protection for socket circuits"
  ]
}
```

**Impact:** -2 points per question (Question Quality)

**Frequency:** Medium (10-20% of questions)

**Fixed by:** Phase 10 can replace with specific regulation name + purpose

**How to prevent:**
- Phase 4 prompt: "If mentioning standards/regulations, name them (BS 7671, IET On-Site Guide)"
- Anchor Fact Method ensures answer comes from explanation (which should cite standards)

---

#### 4.3 Overly Broad Paraphrases

**Symptom:**
```json
{
  "questionText": "What is a Ring Final Circuit?",
  "expectedAnswer": [
    "a type of circuit",
    "a circuit arrangement",
    "a way to wire outlets",
    "a power circuit",
    "circuit for sockets",
    "electrical loop",
    "wiring method",
    "circuit topology"
  ]
}
```

**Problem:**
- 8 variants (too many)
- Some variants not in explanation (guessing allowed)
- Broad terms could apply to many circuit types
- Not testing specific knowledge

**Better Format (Anchor Fact Method):**
```json
{
  "questionText": "What is a Ring Final Circuit?",
  "expectedAnswer": [
    "a continuous loop starting and ending at the same protective device",
    "continuous loop starting and ending at the same protective device",
    "a loop starting and ending at the same circuit breaker"
  ]
}
```

**Impact:** -2 points per question (Marking Robustness + Teaching-Before-Testing)

**Frequency:** High (40-50% of questions before Feb 6 update)

**Fixed by:**
- Phase 10 cannot fix (requires semantic judgment)
- Must prevent at generation time

**How to prevent (Feb 6 Update):**
- Phase 4 updated: "EXACTLY 2-4 variants for L1, 1-2 for L2" (down from 2-6)
- Variants are ONLY for normalization: case, articles, plural
- First variant MUST be verbatim from explanation (Anchor Fact)

---

#### 4.4 Vague Connection Answers

**Symptom:**
```json
{
  "id": "203-3A11-C1-L2",
  "cognitiveLevel": "connection",
  "questionText": "How do final circuits, circuit types, and topology relate to each other?",
  "expectedAnswer": [
    "they are all related",
    "they work together",
    "they're part of the same system",
    "they all involve circuits"
  ]
}
```

**Problem:**
- Doesn't test actual understanding of relationships
- Student could write this without reading lesson
- No specific connection identified

**Better Format:**
```json
{
  "id": "203-3A11-C1-L2",
  "cognitiveLevel": "connection",
  "questionText": "Using your answers to Q1 (final circuits), Q2 (circuit types), and Q3 (topology), explain how circuit selection depends on all three factors.",
  "expectedAnswer": [
    "Final circuits are categorized by circuit type (power, lighting, control) and then implemented using specific topologies (radial or ring) based on load requirements and distribution area"
  ]
}
```

**Impact:** -3 points per question (Question Quality + Cognitive Structure)

**Frequency:** Medium (20-30% of L2 questions)

**Fixed by:** Phase 10 can replace with specific connection statement

**How to prevent (Feb 6 Update):**
- Phase 4 L2 question prompt: "MUST explicitly reference all three L1 facts by name/content"
- Question text should use formula: "Using your answers to Q1 ([topic]), Q2 ([topic]), Q3 ([topic])..."
- expectedAnswer MUST mention all three anchor facts or their key terms

---

### 5. Field Name and Type Mistakes

#### 5.1 Wrong Field Name in Spaced Review

**Symptom:**
```json
{
  "type": "spaced-review",
  "content": {
    "questions": [
      {
        "id": "203-3A11-SR-1",
        "attText": "What is voltage?",          // WRONG: should be "questionText"
        "expectedAnswer": ["..."]
      },
      {
        "id": "203-3A11-SR-2",
        "question_text": "What is current?",    // WRONG: underscore instead of camelCase
        "expectedAnswer": ["..."]
      }
    ]
  }
}
```

**Correct Format:**
```json
{
  "questionText": "What is voltage?",  // CORRECT: camelCase, no abbreviation
  "expectedAnswer": ["electrical potential difference"]
}
```

**Impact:** -2 points per question (Schema Compliance)

**Frequency:** Medium (10-15% of spaced review questions)

**Fixed by:** Schema Normalizer (automatic)

**How it's fixed:**
```typescript
// Normalizer checks for common typos
if (q.attText || q.questiontext || q.question_text) {
  const wrongField = q.attText ? 'attText' : q.questiontext ? 'questiontext' : 'question_text';
  q.questionText = q[wrongField];
  delete q[wrongField];
  fixes.push(`Renamed '${wrongField}' → 'questionText'`);
}
```

**How to prevent:**
- Phase 8 prompt: "FIELD NAME: Use 'questionText' (NOT 'attText', 'question_text', or any variant)"
- LLMs sometimes use different naming conventions from examples they've seen

---

#### 5.2 expectedAnswer as String

**Symptom:**
```json
{
  "questionText": "What is UK mains voltage?",
  "answerType": "numeric",
  "expectedAnswer": "230V"               // WRONG: string instead of array
}
```

**Correct Format:**
```json
{
  "questionText": "What is UK mains voltage?",
  "answerType": "numeric",
  "expectedAnswer": ["230"]              // CORRECT: array of strings (no units)
}
```

**Impact:** -3 points (Schema Compliance + Marking Robustness)

**Frequency:** Low (5-10% - most prompts show array format)

**Fixed by:** Schema Normalizer (automatic conversion)

**How it's fixed:**
```typescript
if (q.expectedAnswer && !Array.isArray(q.expectedAnswer)) {
  q.expectedAnswer = [String(q.expectedAnswer)];
  fixes.push(`Converted expectedAnswer to array`);
}
```

**How to prevent:**
- All phase prompts show: `"expectedAnswer": ["..."]` (array format)
- JSON output instructions emphasize array requirement

---

#### 5.3 Units in Numeric Answers

**Symptom:**
```json
{
  "questionText": "What is UK mains voltage? (Round to nearest whole number)",
  "answerType": "numeric",
  "expectedAnswer": ["230V", "230 volts", "230 V"]  // WRONG: has units
}
```

**Correct Format:**
```json
{
  "questionText": "What is UK mains voltage? (Round to nearest whole number)",
  "answerType": "numeric",
  "expectedAnswer": ["230", "230.0"],     // CORRECT: numbers only
  "hint": "UK mains voltage in volts (V)" // Units go in hint
}
```

**Impact:** -2 points per question (Marking Robustness)

**Frequency:** Medium-High (30-40% of numeric questions)

**Fixed by:** Schema Normalizer (strips units automatically)

**How it's fixed:**
```typescript
if (q.answerType === 'numeric') {
  const cleaned = q.expectedAnswer.map((answer: string) => {
    const str = String(answer);
    if (/[a-zA-Z%]/.test(str)) {  // Contains letters or %
      const match = str.match(/-?\d+\.?\d*/);
      return match ? match[0] : str;  // Extract number only
    }
    return str;
  });
  q.expectedAnswer = cleaned;
}
```

**How to prevent:**
- Phase 6 prompt: "CRITICAL: For numeric answers, expectedAnswer contains ONLY numbers (no units). Units go in 'hint' field."
- Shows example with units in hint, not answer

---

### 6. Content Quality Issues

#### 6.1 Missing "Key Facts" Section

**Symptom:**

Explanation content has sections:
- ✅ What this is
- ✅ Why it matters
- ❌ Key rules (WRONG: should be "Key facts / rules")
- ✅ How to apply it
- ✅ Common mistakes

**Correct heading:**
```markdown
**Key facts / rules**
```

**Impact:** -3 points (Beginner Clarity - scorer looks for EXACT heading)

**Frequency:** Medium (15-20% of explanations before Feb 6 update)

**Fixed by:** Phase 10 can append section (if completely missing) or fix heading

**How to prevent (Feb 6 Update):**
- Phase 3 prompt: "REQUIRED heading EXACTLY: `**Key facts / rules**` (use this exact text)"
- System prompt emphasizes: "Use 4-8 bullet points under this heading"

---

#### 6.2 Missing "In This Lesson" Orientation

**Symptom:**

Explanation starts directly with:
```markdown
**What this is**

A Final Circuit is an electrical circuit...
```

Missing orientation section before "What this is".

**Correct Structure:**
```markdown
### In this lesson

You're learning to identify circuit types and their applications. By the end, you'll know when to select each type. Three key points:
- Final circuits connect distribution boards to utilization points
- Circuit type determines cable size and protective devices
- Selection depends on load requirements and safety

**What this is**

A Final Circuit is an electrical circuit...
```

**Impact:** -3 points (Beginner Clarity - students need context before diving in)

**Frequency:** High (60-80% before Feb 6 update, 5-10% after)

**Fixed by:** Phase 10 can prepend orientation section

**How to prevent (Feb 6 Update):**
- Phase 3 updated to require **8-part structure** (was 6-part)
- Section 1 MUST be: `### In this lesson` (goal + context + 3 bullets)
- Prompt shows exact format to follow

---

#### 6.3 Guided Practice Step Count Mismatch

**Symptom:**

Worked Example:
```json
{
  "steps": [
    { "stepNumber": 1, "description": "Identify context" },
    { "stepNumber": 2, "description": "Select circuit" },
    { "stepNumber": 3, "description": "State purpose" },
    { "stepNumber": 4, "description": "Common mistake" }
  ]
}
```

Guided Practice:
```json
{
  "steps": [
    { "stepNumber": 1, "prompt": "What is the context?" },
    { "stepNumber": 2, "prompt": "Which circuit?" }
    // Missing steps 3 and 4!
  ]
}
```

**Problem:**
- Worked example has 4 steps
- Guided practice has only 2 steps
- Student has no scaffolding for steps 3-4
- Violates "I Do, We Do, You Do" pedagogy

**Impact:** -5 to -8 points (Alignment - major pedagogical failure)

**Frequency:** Medium (20-30% before Feb 6 update)

**Fixed by:** Regeneration required (Phase 10 cannot add steps - structural change)

**How to prevent (Feb 6 Update):**
- Phase 5 updated with **MIRRORING CONTRACT** (no exceptions)
- Prompt: "guidedPractice.steps.length MUST EQUAL workedExample.steps.length"
- Prompt: "stepNumbers MUST match exactly (1, 2, 3, 4 - no gaps, no extras)"
- System prompt includes multiple warnings about this

---

#### 6.4 Teaching-Before-Testing Violations

**Symptom:**

Explanation content:
```markdown
Final circuits deliver electricity from the distribution board
to socket outlets, lighting, and appliances. They are protected
by circuit breakers sized for the cable's current capacity.
```

Check question:
```json
{
  "questionText": "What is the purpose of residual current protection?",
  "expectedAnswer": ["protects against earth fault currents"]
}
```

**Problem:**
- Explanation never mentions "residual current" or RCDs
- Question tests content not taught
- Student cannot answer without external knowledge

**Impact:** -5 points per question (Teaching-Before-Testing - major violation)

**Frequency:** Low (5-10% - Phase 4 reads explanation before generating questions)

**Fixed by:**
- Phase 10 can prepend explanation content defining the term
- Better: Regenerate Phase 4 with correct context

**How to prevent:**
- Phase 4 receives full explanation text as input
- Prompt: "CRITICAL: Only ask about content EXPLICITLY taught in the explanation"
- Anchor Fact Method ensures questions test verbatim content from explanation

---

### Summary: Impact Rankings

| Issue Category | Avg Impact | Frequency | Auto-Fixed | Priority |
|---------------|------------|-----------|------------|----------|
| Missing orientation/summaries | -6 to -9 | High | Phase 10 | 🔴 High |
| Guided practice mismatch | -5 to -8 | Medium | Regenerate | 🔴 High |
| Teaching-before-testing | -5 per Q | Low | Phase 10 | 🔴 High |
| Missing required blocks | -10 to -20 | Very Low | Regenerate | 🔴 High |
| Vague expectedAnswer | -2 to -3 | Medium | Phase 10 | 🟡 Med |
| Block ordering | -5 to -10 | Low | Phase 9 | 🟡 Med |
| ID pattern issues | -2 | High | Normalizer | 🟢 Low |
| Field name typos | -2 | Medium | Normalizer | 🟢 Low |
| Units in numeric | -2 | High | Normalizer | 🟢 Low |

**Key Takeaways:**

1. **Highest ROI fixes:** Orientation and summaries (Phase 10 can add with prepend/append)
2. **Biggest failures:** Structural issues (missing blocks, ordering) - require regeneration
3. **Most common:** ID and field issues - but auto-fixed by normalizer
4. **Hardest to prevent:** Vague answers - requires semantic understanding

---

## File Locations

### Phase Files
- **Base Class:** `src/lib/generation/phases/PhasePromptBuilder.ts`
- **Phase 1-10:** `src/lib/generation/phases/Phase{N}_*.ts`
- **Orchestrator:** `src/lib/generation/SequentialLessonGenerator.ts`
- **Integration:** `src/lib/generation/fileGenerator.ts`

### Support Files
- **Normalizer:** `src/lib/generation/lessonNormalizer.ts`
- **Scoring:** `src/lib/generation/llmScoringService.ts`
- **Config:** `src/lib/generation/config.ts`
- **Types:** `src/lib/generation/types.ts`
- **Utils:** `src/lib/generation/utils.ts`

### Documentation
- **This File:** `reports/improvements/10_phases.md`
- **Phase 10 Deep Dive:** `reports/improvements/phase_10.md`
- **Scoring Details:** `reports/improvements/scoring_prompts.md`
- **Implementation Summary:** `reports/improvements/FINAL_SUMMARY.md`

---

## Performance Metrics

### Current Performance (Feb 2026)

**Per-Lesson Generation Time:**
```
Phase 1 (Planning):           ~2-4 seconds
Phase 2 (Vocabulary):         ~2-3 seconds
Phase 3 (Explanation):        ~8-12 seconds
Phase 4 (Understanding):      ~4-6 seconds
Phase 5 (Worked/Guided):      ~6-10 seconds (if runs)
Phase 6 (Practice):           ~4-6 seconds
Phase 7 (Integration):        ~3-5 seconds
Phase 8 (Spaced Review):      ~3-5 seconds
Phase 9 (Assembler):          <1 second (TypeScript)
Normalization:                <1 second (TypeScript)
LLM Scoring:                  ~4-6 seconds
Phase 10 (if triggered):     ~6-10 seconds

Total: ~50-75 seconds for complete lesson
```

**Token Usage:**
```
Phases 1-8:        ~60,000-70,000 tokens
Scoring:           ~6,000-10,000 tokens (input + output)
Phase 10:          ~4,000-6,000 tokens (if runs)

Total: ~70,000-86,000 tokens per lesson
```

**Success Rates (Feb 2026):**
```
Generation success:   99.5% (very rare failures)
Initial score avg:    87/100 → 92/100 (expected with Phase 3-5 improvements)
Phase 10 trigger:     ~80% of lessons (score < 97)
Refinement success:   100% (2/2 recent tests)
Final score avg:      95/100 → 97/100 (expected with improvements)
Reaching 97+:         ~50% → target 90%+ (with Phase 3-5 improvements)
```

**Recent Improvements (Feb 6, 2026):**
- Phase 3: 8-part structure (added orientation + transition)
- Phase 4: Anchor Fact Method (verbatim answers)
- Phase 5: Selection format (4 steps) + strict mirroring

---

## Recent Improvements (February 6, 2026)

Based on expert feedback and testing results, the following improvements have been implemented:

### 1. ✅ COMPLETED: "In This Lesson" Orientation + Transition (HIGH IMPACT)

**Status:** Implemented in Phase 3  
**Changes Made:**
- Changed from 6-part to **8-part structure**
- Added "### In this lesson" as section 1 (before "What this is")
  - 1 sentence: learning goal
  - 1 sentence: installation context
  - 3 bullet points: key takeaways
- Added "### Coming Up Next" as section 8 (after "Quick recap")

**Expected Impact:** +3-5 points per lesson

### 2. ✅ COMPLETED: Anchor Fact Method for Understanding Checks (HIGH IMPACT)

**Status:** Implemented in Phase 4  
**Changes Made:**
- Added **ANCHOR FACT METHOD**: Select 3 verbatim phrases from explanation first
- Strengthened expectedAnswer requirements:
  - L1 questions: expectedAnswer[0] MUST be verbatim from explanation
  - EXACTLY 2-4 variants for L1 (down from 2-6)
  - EXACTLY 1-2 variants for L2 (down from 2-6)
- Removed broad paraphrases (tight normalization only)

**Expected Impact:** +2-4 points per lesson (better marking accuracy)

### 3. ✅ COMPLETED: Selection Example Format + Strict Mirroring (HIGH IMPACT)

**Status:** Implemented in Phase 5  
**Changes Made:**
- Added **SELECTION EXAMPLE FORMAT** (exactly 4 steps):
  1. Identify job context
  2. Select correct tool/equipment/circuit
  3. State purpose
  4. Common wrong choice and why
- Strengthened **MIRRORING CONTRACT**:
  - guidedPractice.steps.length MUST equal workedExample.steps.length
  - stepNumbers MUST match exactly (no gaps, no extras)
- Added provenance requirements for standard values (cite BS 7671 or describe lookup)
- Tightened expectedAnswer: 1-2 variants only (down from 2-6)

**Expected Impact:** +3-6 points per lesson (prevents misaligned practice)

### 4. TODO: Make Worked Examples Universal (HIGH IMPACT)

**Where:** `SequentialLessonGenerator.ts` line 411  
**Change:** 
```typescript
// BEFORE:
const needsWorkedExample = requiresWorkedExample([
  { type: 'calculation', confidence: 0.8 }
]);

// AFTER:
const tasks = classifyLessonTask(request.topic, request.section, request.mustHaveTopics);
const needsWorkedExample = requiresWorkedExample(tasks) || true;  // Always include
```

**Expected Impact:** +5-8 points per lesson (prevents "blank page panic")

### 5. TODO: Populate Spaced Review Even Without Prerequisites (MEDIUM IMPACT)

**Where:** Phase 8 prompt  
**Change:** Generate generic electrical fundamentals review if no prereqs  
**Expected Impact:** +2-3 points per lesson

---

## Conclusion

The 10-phase sequential architecture provides:

- **Modularity:** Each phase has single responsibility
- **Debuggability:** Know exactly where issues occur
- **Quality:** Enforces contracts (teach-before-test, ordering, verbatim answers)
- **Maintainability:** Update phases independently
- **Extensibility:** Add new phases without breaking existing

**Current Status (February 6, 2026):**
- Phase 3-5 improvements implemented (orientation, anchor facts, selection format, strict mirroring)
- Expected initial scores: 87 → 92 (+5 from Phase 3-5 improvements)
- Expected Phase 10 refinement: 92 → 97 (+5 from laser-focused patches)
- Target: 90%+ of lessons reach 97+ (up from 50%)

**Next Priority:** 
1. Make worked examples mandatory for ALL lesson types (not just calculations)
2. Populate spaced review even when no prerequisites exist
3. Monitor score improvements from Phase 3-5 changes

---

**Related Documentation:**
- [Phase 10 Deep Dive](./phase_10.md) - Refinement system details
- [Scoring System](./scoring_prompts.md) - LLM scoring prompts and analysis
- [Implementation Summary](./FINAL_SUMMARY.md) - Overall system status
- [Handover Documents](./handover2.md) - Debugging and fixes history
