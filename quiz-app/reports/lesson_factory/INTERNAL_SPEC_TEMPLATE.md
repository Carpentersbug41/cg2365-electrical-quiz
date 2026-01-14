# Internal Specification Template

**This document shows what I fill out internally before generating lesson content.**

You don't need to see this unless debugging, but it ensures consistency across all lessons.

---

## 📋 Purpose

Before generating lesson JSON and quiz TypeScript, I complete this internal specification. This ensures:
- All required information is determined
- Decisions are documented
- Quality standards are met
- Consistency across lessons

---

## 🔍 Specification Structure

### 1. Parse User Input

**Input received:**
```
Create Unit [X], Lesson [Y] - [TOPIC] ([SECTION])
```

**Extract:**
- Unit number: `[X]`
- Lesson ID: `[Y]`
- Topic: `[TOPIC]`
- Section: `[SECTION]`
- Optional params: layout, prerequisites, special requirements

---

### 2. Lesson Metadata

```yaml
LESSON_CORE:
  id: "[UNIT]-[LESSON]"               # e.g., "202-1A"
  title: "[ID] — [Topic]: [Subtitle]" # e.g., "202.1A — Electrical Quantities: Units and Measurements"
  description: "[1-2 sentence overview]"
  section: "[Full section name]"      # e.g., "Science 2365 Level 2"
  unit: "Unit [X]"                    # e.g., "Unit 202"
  topic: "[Topic name]"               # e.g., "Electrical Quantities"
  
LAYOUT_DECISION:
  chosen: "split-vis" | "linear-flow"
  reason: "[Why this layout was chosen]"
  
  # Decision logic:
  # - split-vis: Diagrams, circuits, spatial concepts, topology
  # - linear-flow: Text, formulas, definitions, calculations
  
  # Inference rules (if layout not explicitly specified):
  
  # Choose LINEAR-FLOW when:
  # - Section contains: "Health & Safety", "Theory", "Regulations", "Procedures"
  # - Topic contains: "Calculations", "Formulas", "Definitions", "Units", "Measurements"
  # - Topic is about: Regulations, PPE, risk assessment, safety procedures
  # - No spatial/visual components mentioned
  # - Content is primarily text, lists, or sequential steps
  
  # Choose SPLIT-VIS when:
  # - Section is: "Science 2365" (typically circuit-based)
  # - Topic contains: "Circuit", "Series", "Parallel", "Diagram", "Layout", "Topology"
  # - Topic is about: Component placement, spatial relationships, visual systems
  # - Diagrams/visuals must stay visible while reading content
  
  # User can override by explicitly specifying: "Layout: [split-vis|linear-flow]"
  
PREREQUISITES:
  inferred: ["[lesson-id]", ...]      # Based on logical progression
  reason: "[Why these prerequisites]"
  # If none: [] with reason "foundational lesson"
```

---

### 3. Learning Structure

```yaml
LEARNING_OUTCOMES: (3-4 outcomes)
  - text: "[Specific, measurable outcome]"
    bloomLevel: "remember"
    rationale: "[Why this outcome at this level]"
    
  - text: "[Specific, measurable outcome]"
    bloomLevel: "understand"
    rationale: "[Why this outcome at this level]"
    
  - text: "[Specific, measurable outcome]"
    bloomLevel: "apply"
    rationale: "[Why this outcome at this level]"

# Bloom's Taxonomy Distribution:
# - remember (1): State, recall, list, name
# - understand (1-2): Explain, describe, summarize
# - apply (1-2): Calculate, use, solve, demonstrate

VOCABULARY: (3-6 terms)
  - term: "[Technical term]"
    definition: "[Clear, concise definition]"
    source: "[Where concept comes from]"
    
  # Selection criteria:
  # - Essential for understanding
  # - Technical/domain-specific
  # - Used throughout lesson
  # - Not assumed prior knowledge
```

---

### 4. Content Planning

```yaml
EXPLANATION_BLOCK:
  title: "[Clear section title]"
  approach: "[Teaching strategy]"
  key_points:
    - "[Main concept 1]"
    - "[Main concept 2]"
    - "[Main concept 3]"
  analogies: "[Any helpful comparisons]"
  formulas: ["[Formula 1]", "[Formula 2]"]
  
WORKED_EXAMPLE:
  title: "Worked Example: [Problem Type]"
  scenario: "[Given information]"
  steps: (3-4 steps)
    - step: 1
      action: "[What to do]"
      formula: "[If applicable]"
      calculation: "[If applicable]"
      result: "[If applicable]"
  notes: "[Additional tips]"
  
GUIDED_PRACTICE:
  title: "Guided Practice (We Do)"
  problem: "[Problem statement]"
  steps: (2-3 prompts)
    - prompt: "[Guide question]"
      expected: ["[answer variations]"]
      hint: "[If stuck]"
      
PRACTICE_QUESTIONS: (3-5 questions)
  - id: "[LESSON-ID]-P1"
    type: "numeric" | "short-text"
    question: "[Problem or question]"
    answer: ["[variations]"]
    hint: "[Helpful guidance]"
    
SPACED_REVIEW: (4 questions)
  - "[Question reviewing prerequisite topic]"
  notes: "[What concepts being reinforced]"
```

---

### 5. Quiz Planning

```yaml
QUIZ_STRUCTURE:
  filename: "[topic]Questions.ts"
  total_questions: 50
  id_range_start: [3000 + offset]  # Ensure no conflicts
  
DIFFICULTY_DISTRIBUTION:
  easy: 15   (difficulty: 1-2)  # 30% of 50
  medium: 25 (difficulty: 2-3)  # 50% of 50
  hard: 10   (difficulty: 4-5)  # 20% of 50
  
TYPE_DISTRIBUTION:
  discrimination: 4  (20%) - Identify/classify
  conceptual: 4      (20%) - Understanding
  calculation: 8     (40%) - Numerical problem-solving
  application: 4     (20%) - Real-world scenarios
  
  # Adjust ratios based on topic:
  # - Heavy calculation topics: 60% calculation
  # - Theory-heavy topics: 60% conceptual
  # - Introductory topics: More discrimination questions

LEARNING_OUTCOME_COVERAGE:
  # Each learning outcome must be assessed by 3+ questions
  LO1: ["Q[IDs]"]  # questions that assess outcome 1
  LO2: ["Q[IDs]"]  # questions that assess outcome 2
  LO3: ["Q[IDs]"]  # questions that assess outcome 3
```

---

### 6. Question Generation Strategy

```yaml
FOR_EACH_QUESTION:
  
  CORE_CONTENT:
    id: [unique number 3000+]
    question: "[Clear, unambiguous question text]"
    correctAnswer: [0-3]
    section: "[Section name]"
    category: "[Topic name]"
    
  LEARNING_TAGS:
    tags: ["[tag1]", "[tag2]", "[tag3]"]
    # From approved list:
    # - Topology: series, parallel, mixed-circuit
    # - Concept: current-rule, voltage-rule, resistance-rule, ohms-law
    # - Cognitive: calculation, discrimination, explanation, conceptual, application
    
    learningOutcomeId: "[LESSON-ID]-LO[1-3]"
    
  ANSWER_DESIGN:
    correct_option: "[The definitively correct answer]"
    
    distractor_1: "[Wrong answer from misconception A]"
    misconceptionCode_1: "[CODE from approved list]"
    
    distractor_2: "[Wrong answer from misconception B]"
    misconceptionCode_2: "[CODE from approved list]"
    
    distractor_3: "[Wrong answer from misconception C]"
    misconceptionCode_3: "[CODE from approved list]"
    
    # Distractor design:
    # - Plausible (not obviously wrong)
    # - Represents actual student error
    # - Maps to misconception code
    
  METADATA:
    answerType: "mcq"
    difficulty: [1-5]  # Based on cognitive load
    estimatedTime: [30-120 seconds]
    explanation: "[Why correct answer is right]"
```

---

### 7. Misconception Strategy

```yaml
COMMON_MISCONCEPTIONS: (for this topic)
  - type: "[CODE]"
    description: "[What students typically do wrong]"
    example: "[Specific example]"
    
# For electrical topics, common codes:
# - USED_PARALLEL_RULE: Applied parallel formula in series
# - USED_SERIES_RULE: Applied series formula in parallel
# - CONFUSED_I_V_R: Mixed up current, voltage, resistance
# - MULTIPLIED_INSTEAD: Multiplied when should add
# - DIVIDED_INSTEAD: Divided when should multiply
# - RECIPROCAL_ERROR: Forgot reciprocal in parallel
# - FORMULA_NOT_REARRANGED: Used V=IR without solving for needed variable
# - TOPOLOGY_CONFUSION: Couldn't identify series vs parallel
# - UNITS_MISSING: Correct number but no units
# - WRONG_UNITS: Incorrect unit (mA vs A)

# For safety topics, create new codes as needed
```

---

### 8. Quality Assurance Checklist

```yaml
PRE_GENERATION_CHECKS:
  - [ ] All required fields determined
  - [ ] Layout decision justified
  - [ ] Prerequisites make logical sense
  - [ ] Learning outcomes are measurable
  - [ ] Vocabulary is appropriate level
  - [ ] Explanation approach is clear
  - [ ] Examples use realistic values
  - [ ] Question distribution is balanced
  - [ ] All tags/codes are from approved lists
  
POST_GENERATION_CHECKS:
  - [ ] Valid JSON/TypeScript syntax
  - [ ] All IDs follow conventions
  - [ ] No duplicate question IDs
  - [ ] All formulas are correct
  - [ ] All calculations verified
  - [ ] Distractors are plausible
  - [ ] Hints don't give away answers
  - [ ] Explanations are educational
  - [ ] Difficulty matches cognitive load
  - [ ] All learning outcomes covered
```

---

## 🔍 Example: Completed Internal Spec

### Input
```
Create Unit 202, Lesson 4A - Series Circuits (Science)
```

### Completed Specification

```yaml
LESSON_CORE:
  id: "202-4A"
  title: "202.4A — Series Circuits: Rules and Calculations"
  description: "Learn the three series circuit rules (current, voltage, resistance), understand why they're true, and apply them to basic calculations."
  section: "Science 2365 Level 2"
  unit: "Unit 202"
  topic: "Series Circuits"
  
LAYOUT_DECISION:
  chosen: "split-vis"
  reason: "Circuit diagrams must stay visible while learning rules"
  
PREREQUISITES:
  inferred: ["ohms-law-basics"]
  reason: "Need V=IR and units before learning circuit rules"

LEARNING_OUTCOMES:
  - text: "State the three series rules for current, voltage, and resistance"
    bloomLevel: "remember"
    rationale: "Foundation - must know the rules"
    
  - text: "Explain why current is the same in a series circuit"
    bloomLevel: "understand"
    rationale: "Conceptual understanding of topology"
    
  - text: "Calculate total resistance in simple series circuits"
    bloomLevel: "apply"
    rationale: "Practical application of series rule"

VOCABULARY:
  - term: "Series"
    definition: "Components connected in a single path with one loop and no branches"
    source: "Circuit topology"
    
  - term: "Current (I)"
    definition: "Flow of electric charge, measured in amperes (A)"
    source: "Prerequisite reinforcement"
    
  - term: "Voltage (V)"
    definition: "Electrical 'push' or potential difference, measured in volts (V)"
    source: "Prerequisite reinforcement"
    
  - term: "Resistance (R)"
    definition: "Opposition to current flow, measured in ohms (Ω)"
    source: "Prerequisite reinforcement"

QUIZ_STRUCTURE:
  filename: "seriesCircuitsQuestions.ts"
  total_questions: 50
  id_range_start: 3001
  
DIFFICULTY_DISTRIBUTION:
  easy: 15   # Questions 3001-3015
  medium: 25 # Questions 3016-3040
  hard: 10   # Questions 3041-3050
  
TYPE_DISTRIBUTION:
  discrimination: 3  # Identify series circuits
  conceptual: 5      # Why rules work
  calculation: 9     # Calculate resistance/current/voltage
  application: 3     # Real scenarios (Christmas lights, etc.)

LEARNING_OUTCOME_COVERAGE:
  LO1: [3001, 3002, 3012, 3019]  # State rules
  LO2: [3003, 3011, 3014, 3017, 3032]  # Explain why
  LO3: [3004, 3005, 3006, 3007, 3010, 3013, 3015, 3016, 3018]  # Calculate
```

---

## 📝 Notes

- This specification is **internal** - you only see the final output
- It ensures **consistency** across all lessons
- It documents **decision rationale** for quality assurance
- It provides **traceability** if issues arise
- It enables **process refinement** over time

---

## 🔄 Continuous Improvement

After each lesson, I note:
- What worked well
- What needed iteration
- Patterns in user feedback
- Areas for process improvement

This feeds back into better specifications for future lessons.

---

## ✨ Result

Following this internal process ensures every lesson meets the quality standard defined in `lesson_factory.md` and `LESSON_PRODUCTION_WORKFLOW.md`.

