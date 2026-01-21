# Supplementary Lessons: Additional Material Guide

**Quick reference for creating supplementary lessons that fill gaps in the syllabus**

---

## 📋 What Supplementary Lessons Are

**Supplementary lessons** are full-length lessons that cover material not explicitly in the core C&G 2365 syllabus, but essential for proper understanding and practical competence.

They are **"missing rungs on the ladder"** - prerequisite skills, bridge concepts, and connections that students need but the syllabus doesn't explicitly teach.

### Key Characteristics

- ✅ **Full lessons**: Same structure, duration, and quiz size as core lessons
- ✅ **Same layouts**: Use LayoutA (split-vis) or LayoutB (linear-flow) as appropriate
- ✅ **Same blocks**: 8-10 blocks (outcomes → vocab → explanation → examples → practice → review)
- ✅ **Same quizzes**: 50 questions with full misconception tracking
- ✅ **No special styling**: Render as regular lesson cards on `/learn` page

### What Makes Them "Supplementary"

The **only difference** is their purpose:
- **Core lessons (A variants)**: Cover explicit syllabus learning outcomes
- **Supplementary lessons (B/C/D variants)**: Cover essential material the syllabus assumes or omits

---

## 🎯 When to Create Supplementary Lessons

### Group A — Maths, Units & Foundation Skills
**Why needed:** Syllabus assumes these, but most students lack them

**Examples:**
- Engineering notation & prefixes (m, µ, k, M)
- Unit conversion for electricians (A/mA, Ω/kΩ, W/kW)
- Formula rearrangement drill
- Proportional thinking ("double R → what happens to I?")

**Placement:** Early in Unit 202 (before calculations start)

---

### Group B — Instruments, Readings & Measurements
**Why needed:** Testing (Unit 204) becomes easy when you understand what readings mean

**Examples:**
- What each meter function measures
- Continuity meaning (what it proves and doesn't prove)
- Insulation resistance meaning
- Polarity meaning

**Placement:** Before Unit 204, or early in 202 for conceptual awareness

---

### Group C — Core Circuit Behaviour
**Why needed:** Stops circuits feeling like memorized rules; helps fault logic

**Examples:**
- Series fault logic (open/high resistance: what changes)
- Parallel fault logic (one branch fails: what changes)
- Power and heating effect connections

**Placement:** After series/parallel lessons (202-3A, 202-4A)

---

### Group D — Safety Science Bridges
**Why needed:** Where "science" becomes "site safety"

**Examples:**
- Heating effect of current → overheating risk
- Shock severity factors
- Voltage drop concept and symptoms
- Earth fault vs short vs overload (plain terms)

**Placement:** Between Unit 201 (safety) and Unit 202 (science), or inline with related topics

---

### Group E — Magnetism & AC Bridges
**Why needed:** Explains transformers/relays/motors without Level 3 depth

**Examples:**
- **202-7B: How AC is Generated** (single-loop generator → sine wave)
- Magnetic field around conductors
- Electromagnets as devices (relay/contactor behavior)
- Transformer principle (Level 2 appropriate)

**Placement:** Inline with Unit 202 magnetism/AC lessons (202-6A, 202-7A)

---

### Group F — Installation Decisions
**Why needed:** Makes Unit 203 coherent instead of random product knowledge

**Examples:**
- Cable selection logic (current, environment, protection)
- Protection device roles (MCB vs RCD vs RCBO)
- External influences basics (IP ratings, zones)

**Placement:** Within Unit 203 sequence

---

### Group G — Work Method & Professional Routine
**Why needed:** Practical assessment and professional competence

**Examples:**
- Hazard vs risk
- Hierarchy of control
- Safe isolation routine
- Good workmanship standards

**Placement:** Within Unit 201/210

---

## 🔢 Naming Convention

### Format: Standard Letter Variants

```
[UNIT]-[NUMBER][LETTER]

EXAMPLES:
202-1A  → Core lesson (syllabus outcome 1)
202-1B  → Supplementary lesson (related to topic 1)
202-1C  → Another supplementary lesson (related to topic 1)

202-7A  → AC Principles (core syllabus)
202-7B  → How AC is Generated (supplementary)
202-7C  → AC Waveform Analysis (supplementary, if needed)
```

### Sequencing Rules

- **A variant**: Always the core syllabus lesson
- **B/C/D variants**: Supplementary lessons, numbered by creation order
- **Order field**: Controls placement on `/learn` page (use decimals if needed)

**Example placement:**
```typescript
{
  id: '202-7A',
  title: 'AC Principles',
  order: 7,  // Main position
},
{
  id: '202-7B',
  title: 'How AC is Generated',
  order: 7.1,  // Appears right after 202-7A
}
```

---

## 📝 Generation Request Format

### Standard Format

```
Create Unit [NUMBER], Lesson [ID] - [TOPIC] ([SECTION])
Note: Supplementary lesson covering [gap/bridge concept]
```

### Examples

```
Create Unit 202, Lesson 7B - How AC is Generated (Science)
Note: Supplementary lesson covering single-loop generator producing sine wave
Layout: split-vis
Related: 202-7A (AC Principles)
```

```
Create Unit 202, Lesson 2B - Formula Rearrangement (Science)
Note: Supplementary lesson covering transposition skills for V=IR, P=VI
Layout: linear-flow
Prerequisites: 202-1A (Quantities & Units)
```

---

## 🏗️ Lesson Structure

Supplementary lessons use **exactly the same structure** as core lessons:

### Standard Block Sequence

1. **Outcomes** (2-4 outcomes, Bloom's taxonomy)
2. **Vocab** (3-6 key terms)
3. **Diagram** (if visual/spatial concept)
4. **Explanation** (clear, structured teaching)
   - **4.5. Understanding Check** (3×L1 Recall + 1×L2 Connection after each explanation)
5. **Worked Example** (3-4 steps)
6. **Guided Practice** (2-3 scaffolded prompts)
7. **Practice** (3-5 independent questions)
   - **7.5/9.5. Integrative Question** (Big Picture - L2/L3 Synthesis)
8. **Spaced Review** (4 questions from prerequisites)

### Quiz Structure

```yaml
QUIZ_SIZE: 50 questions (same as core lessons)

DIFFICULTY_DISTRIBUTION:
  easy: 15 (30%)
  medium: 25 (50%)
  hard: 10 (20%)

TYPE_DISTRIBUTION:
  - Adjust based on topic
  - Conceptual vs calculation mix as appropriate
  - Include misconception tracking
```

---

## 💡 Design Principles

### 1. Target Specific Gaps

Each supplementary lesson should address a **specific, identifiable gap** in the syllabus:
- Prerequisite skill students lack
- Bridge concept connecting theory to practice  
- "Silent fail point" in assessments
- Real-world application not covered explicitly

### 2. Keep Standard Quality

Don't compromise on quality because it's "supplementary":
- ✅ Full learning outcomes
- ✅ Complete worked examples
- ✅ Comprehensive quiz (50 questions)
- ✅ Misconception tracking
- ✅ Proper spaced review

### 3. Link to Core Content

Make connections explicit:
- Reference related core lessons in description
- Use appropriate prerequisites
- Include in cumulative quizzes
- Position logically in lesson sequence

### 4. Maintain Consistency

Supplementary lessons should feel like regular lessons:
- Same visual styling
- Same interaction patterns
- Same assessment standards
- Same lesson factory process

---

## 📚 Example: Complete Supplementary Lesson

### 202-7B: How AC is Generated

**Context:**
- Core lesson 202-7A covers AC principles (what AC is, frequency, UK mains)
- But doesn't explain **how** AC is generated
- Students struggle to visualize why AC is a sine wave
- This bridge concept makes transformers/generators more intuitive

**Lesson Structure:**
```yaml
id: "202-7B"
title: "202.7B — How AC is Generated: Single-Loop Generator"
description: "Understand how rotating a loop in a magnetic field generates alternating current with a sine wave pattern"
layout: "split-vis"  # Diagram essential
unit: "Unit 202"
topic: "AC Generation"

prerequisites:
  - "202-6A"  # Magnetism (need magnetic field concepts)
  - "202-7A"  # AC Principles (need AC/frequency basics)

learningOutcomes:
  - "Describe the basic components of a simple AC generator"
  - "Explain how rotation in a magnetic field produces alternating current"
  - "Relate generator rotation position to points on the sine wave"

blocks:
  1. Outcomes
  2. Vocab (generator, armature, slip rings, brushes)
  3. Diagram (animated/video showing rotation → sine wave)
  4. Explanation (step-by-step: 0°, 90°, 180°, 270°, 360°)
     4.5. Understanding Check (3×L1: parts, rotation, output + 1×L2: why sine wave)
  5. Worked Example (trace one rotation, identify wave points)
  6. Guided Practice (given rotation angle, find current direction)
  7. Practice (5 questions: conceptual + diagram interpretation)
     9.5. Integrative Question (why AC generation produces sine wave)
  8. Spaced Review (magnetism + AC principles)

quiz: 50 questions
  - 20 conceptual (how generators work)
  - 15 visual (identify rotation positions)
  - 10 application (generator scenarios)
  - 5 connections (why transformers need AC)
```

**Placement:**
```typescript
// In lessonIndex.ts
{
  id: '202-7A',
  title: 'AC Principles',
  order: 7,
},
{
  id: '202-7B',
  title: 'How AC is Generated',
  order: 7.1,  // Right after AC Principles
}
```

---

## ✅ Quality Checklist

### Before Creating Supplementary Lesson

- [ ] Gap/bridge concept clearly identified
- [ ] Not already covered in existing lessons
- [ ] Essential for student success (not just "nice to know")
- [ ] Can be taught as standalone lesson
- [ ] Fits logically with existing sequence

### During Creation

- [ ] Full lesson structure (8-10 blocks)
- [ ] 50-question quiz with misconception codes
- [ ] Appropriate layout chosen (split-vis vs linear-flow)
- [ ] Prerequisites correctly identified
- [ ] Learning outcomes measurable and clear

### After Creation

- [ ] Positioned correctly in lessonIndex.ts
- [ ] Order field places it logically
- [ ] Referenced by related lessons if needed
- [ ] Cumulative quizzes include it properly
- [ ] No styling differences from core lessons

---

## 🔄 Integration with Core Lessons

### Prerequisites Linking

Core lessons can list supplementary lessons as prerequisites:

```json
// 202-8A (hypothetical future lesson)
{
  "prerequisites": ["202-7A", "202-7B"],
  // Now assumes students understand both AC principles AND generation
}
```

### Cumulative Quizzes

Supplementary lessons are automatically included in cumulative quizzes:
- Same unit number → included in unit cumulative
- Same question weighting as core lessons
- No special handling needed

### Visual Presentation

On `/learn` page:
- Appears inline with core lessons
- No special badge or styling
- Same card design and interaction
- Students experience it as "just another lesson"

---

## 📖 Reference: The Seven Groups

Based on `mini_lessons.md` analysis, supplementary lessons typically fall into seven groups:

| Group | Focus | Example Topics |
|-------|-------|----------------|
| **A** | Maths & Units | Prefixes, conversions, formula rearrangement |
| **B** | Instruments & Readings | What meters measure, test interpretation |
| **C** | Circuit Behavior | Fault logic, power connections |
| **D** | Safety Bridges | Heating effect, shock factors, voltage drop |
| **E** | Magnetism & AC | Generator principles, transformers, relays |
| **F** | Installation | Cable/protection selection, environments |
| **G** | Work Method | Isolation, good workmanship, communication |

Use these groups to identify gaps and plan supplementary lessons.

---

## 🚀 Quick Start

**To create a supplementary lesson:**

1. Identify the gap (which group? which existing lesson relates?)
2. Assign letter code (next available: B, C, D...)
3. Use standard request format:
   ```
   Create Unit [N], Lesson [ID] - [Topic] ([Section])
   Note: Supplementary lesson covering [specific gap]
   ```
4. Review and test like any other lesson
5. Position using `order` field in lessonIndex.ts

**That's it!** No special handling, no different structure, just a regular lesson filling a gap.

---

## 📚 Full Documentation

For complete lesson creation details:
- **Full Workflow**: `LESSON_PRODUCTION_WORKFLOW.md`
- **Template Guide**: `lesson_factory.md`
- **Quick Start**: `QUICK_START.md`
- **Internal Spec**: `INTERNAL_SPEC_TEMPLATE.md`

---

## 💡 Philosophy

**"Missing rungs on the ladder"**

The C&G 2365 syllabus is comprehensive but assumes certain prerequisite knowledge and leaves some connections implicit. Supplementary lessons make those rungs explicit, ensuring every student has solid footing for the climb.

They're not "extra" or "bonus" content - they're **essential** material that the syllabus structure doesn't explicitly call out but successful students absolutely need.

---

**Ready to create supplementary lessons? Use the same process as core lessons, just with a clear understanding of what gap you're filling.**
