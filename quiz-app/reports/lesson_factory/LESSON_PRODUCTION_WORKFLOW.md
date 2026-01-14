# Lesson Production Workflow (AI-Driven)

## 📋 Overview

This document defines the **complete autonomous workflow** for lesson and quiz generation. You provide minimal parameters, I handle everything else, following the templates in `lesson_factory.md`.

**Process Type:** AI-Driven (Option A)  
**Time per Lesson:** 20-40 minutes  
**Quality Standard:** Production-ready with validation

---

## 🎯 How It Works

### You Provide (Minimal Input)

```
Create Unit [NUMBER], Lesson [ID] - [TOPIC] ([SECTION])
```

**Example:**
```
Create Unit 202, Lesson 1A - Electrical Quantities & Units (Science)
```

**Required Parameters:**
- **Unit Number**: e.g., 202
- **Lesson ID**: e.g., 1A, 2A, 3B (follows your numbering scheme)
- **Topic**: What the lesson teaches
- **Section**: Science 2365 Level 2, Health & Safety Level 1, etc.

**Optional Parameters (if you want to specify):**
- Layout preference: `split-vis` or `linear-flow`
- Prerequisites: specific lesson IDs to depend on
- Special focus areas or requirements

---

## 🤖 What I Do (Autonomous Process)

### Phase 1: Internal Specification (I Fill Out)

I create a complete specification including:

1. **Lesson Metadata**
   - Full lesson ID (e.g., `202-1A`)
   - Formatted title following pattern: `[ID] — [Topic]: [Subtitle]`
   - Description (1-2 sentences)
   - Layout decision (based on content type)
   - Unit and topic assignment

2. **Learning Structure**
   - 3-4 Learning outcomes (covering remember, understand, apply levels)
   - 3-6 Key vocabulary terms with definitions
   - Prerequisites (inferred from unit structure or specified)

3. **Content Planning**
   - Explanation focus and approach
   - Worked example scenario with 3-4 steps
   - Guided practice problem
   - 3-5 Practice questions with variety
   - Spaced review topics from prerequisites

4. **Quiz Planning**
   - 50 questions total (comprehensive assessment)
   - Difficulty distribution: 30% easy, 50% medium, 20% hard (15/25/10 questions)
   - Type distribution: 40% conceptual, 60% calculation (adjusted for topic)
   - Question tags and misconception mapping strategy

### Phase 2: Lesson JSON Generation

I create the complete lesson file following this structure:

```json
{
  "id": "202-1A",
  "title": "202.1A — [Topic]: [Subtitle]",
  "description": "...",
  "layout": "split-vis" or "linear-flow",
  "unit": "Unit 202",
  "topic": "[Topic]",
  "learningOutcomes": [...],
  "prerequisites": [...],
  "blocks": [
    // 1. Outcomes block
    // 2. Vocab block (3-6 terms)
    // 3. Diagram block (if applicable)
    // 4. Explanation block
    // 5. Worked example block
    // 6. Guided practice block
    // 7. Practice block (3-5 questions)
    // 8. Spaced review block
  ],
  "metadata": {
    "created": "[today's date]",
    "updated": "[today's date]",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

**Layout Decision Rules:**

I automatically choose the layout based on these inference rules:

**Choose LINEAR-FLOW when:**
- Section contains: "Health & Safety", "Theory", "Regulations", "Procedures"
- Topic contains: "Calculations", "Formulas", "Definitions", "Units", "Measurements"
- Topic is about: Regulations, PPE, risk assessment, safety procedures
- Content is primarily text, lists, sequential steps, or theoretical concepts
- No spatial/visual components that need to stay visible

**Choose SPLIT-VIS when:**
- Section is: "Science 2365" (typically circuit-based)
- Topic contains: "Circuit", "Series", "Parallel", "Diagram", "Layout", "Topology"
- Topic is about: Component placement, spatial relationships, visual systems
- Diagrams/visuals must stay visible while reading content

**Override:** You can explicitly specify layout by adding: `Layout: linear-flow` or `Layout: split-vis` to your request

### Phase 3: Quiz TypeScript Generation

I create the quiz file with 50 questions:

```typescript
import { TaggedQuestion } from './types';

/**
 * [Topic] Question Bank
 * Aligned with lesson [LESSON-ID] learning outcomes
 */

export const [topic]Questions: TaggedQuestion[] = [
  // 15 Easy questions (difficulty: 1-2)
  // 25 Medium questions (difficulty: 2-3)
  // 10 Hard questions (difficulty: 4-5)
  
  // Each question includes:
  // - Unique ID (3000+ range, avoid conflicts)
  // - Clear question text
  // - 4 options (1 correct + 3 plausible distractors)
  // - Misconception codes mapping wrong answers
  // - Appropriate tags
  // - Learning outcome link
  // - Explanation of correct answer
];
```

**Question Distribution:**
- **Discrimination** (20%): Identify/classify concepts
- **Conceptual** (20%): Understanding without calculation
- **Calculation** (40%): Numerical problem-solving
- **Application** (20%): Real-world scenarios

### Phase 4: Self-Validation

I check against these criteria before presenting:

#### Automated Checks
- ✅ Valid JSON/TypeScript syntax
- ✅ All required fields present
- ✅ Block ordering correct (1-8)
- ✅ All IDs follow naming conventions
- ✅ Learning outcomes have Bloom levels
- ✅ All tags are from approved list
- ✅ All misconception codes are valid
- ✅ Question count = 50
- ✅ Unique question IDs (no duplicates)
- ✅ Learning outcome IDs match lesson

#### Content Quality Checks
- ✅ Formulas are correct
- ✅ Calculations verified
- ✅ Terminology consistent
- ✅ Distractors represent real misconceptions
- ✅ Hints don't give away answers
- ✅ Explanations are clear
- ✅ Difficulty matches cognitive load
- ✅ Prerequisites make logical sense

### Phase 5: Integration & Presentation

**I automatically integrate the files into your codebase**, updating all necessary imports and registries.

**Files I Create:**
1. `quiz-app/src/data/lessons/[LESSON-ID]-[topic-slug].json`
2. `quiz-app/src/data/questions/[topic]Questions.ts`

**Files I Update (Auto-Integration):**
3. `quiz-app/src/data/questions/index.ts` - Add import and export
4. `quiz-app/src/data/questions.ts` - Add to main questions array
5. `quiz-app/src/data/lessons/lessonIndex.ts` - Add lesson entry
6. `quiz-app/src/app/learn/[lessonId]/page.tsx` - Import lesson JSON
7. `quiz-app/src/app/learn/page.tsx` - Add to lessons list

**Then I present:**

```
✅ Integration Complete!

Generated and integrated:

1. [LESSON-ID]-[topic-slug].json ([N] lines)
   - 8 blocks: outcomes, vocab, [diagram/explanation], worked example, 
     guided practice, practice, spaced review
   - Layout: [split-vis/linear-flow] ([reason])
   - Prerequisites: [list or "none"]
   - Learning outcomes: [count] covering [Bloom levels]

2. [topic]Questions.ts ([N] lines)
   - 50 questions total
   - Difficulty: [X easy, Y medium, Z hard]
   - Types: [breakdown]
   - All misconception codes mapped
   - Learning outcomes covered: [X/X]

Updated 5 integration files:
✅ questions/index.ts
✅ questions.ts
✅ lessonIndex.ts
✅ learn/[lessonId]/page.tsx
✅ learn/page.tsx

Validation Status: ✅ All checks passed

Ready to test! Just restart your dev server.
```

---

## 🔄 Iteration Process

If you find issues during review:

### Minor Changes
For small fixes (typos, wording, single question adjustments):
```
Fix: Question 3004 option 2 should be "35 Ω" not "30 Ω"
```

### Content Changes
For content adjustments:
```
Change: Add water pipe analogy to explanation block
Change: Worked example should use different resistor values
```

### Structural Changes
For bigger changes:
```
Rework: Practice questions need more variety
Rework: Quiz has too many easy questions, redistribute
```

I'll make updates and re-validate before presenting again.

---

## ✅ Validation Checklist Reference

### Lesson JSON Requirements

| Category | Requirement | Check |
|----------|------------|-------|
| **Structure** | Valid JSON syntax | ✅ |
| | All top-level fields present | ✅ |
| | 8 blocks in correct order | ✅ |
| | All block IDs follow pattern | ✅ |
| **Content** | 3-4 learning outcomes with Bloom levels | ✅ |
| | 3-6 vocabulary terms | ✅ |
| | Worked example has 3-4 steps | ✅ |
| | Practice has 3-5 questions | ✅ |
| | Spaced review has 4 questions | ✅ |
| **Quality** | Formulas are correct | ✅ |
| | Explanations are clear | ✅ |
| | Terminology is consistent | ✅ |
| | Prerequisites make sense | ✅ |

### Quiz TypeScript Requirements

| Category | Requirement | Check |
|----------|------------|-------|
| **Structure** | Valid TypeScript syntax | ✅ |
| | Exports array with 50 questions | ✅ |
| | All questions have unique IDs | ✅ |
| | All required fields present | ✅ |
| **Distribution** | 15 easy (difficulty 1-2) | ✅ |
| | 25 medium (difficulty 2-3) | ✅ |
| | 10 hard (difficulty 4-5) | ✅ |
| **Tagging** | All tags from approved list | ✅ |
| | All misconception codes valid | ✅ |
| | Learning outcome IDs match lesson | ✅ |
| **Quality** | Questions are unambiguous | ✅ |
| | Correct answers are definitively correct | ✅ |
| | Distractors are plausible | ✅ |
| | Misconception mapping is accurate | ✅ |

---

## 🚀 Testing (You Execute)

**Integration is automatic!** I handle all file updates. You just need to:

### 1. Restart Dev Server

```bash
# Stop server if running (Ctrl+C)
npm run dev
```

### 2. Navigate & Test

```
http://localhost:3000/learn
```

**Verify:**
- ✅ New lesson appears in the lessons list
- ✅ Clicking opens the lesson page
- ✅ All blocks render correctly
- ✅ Complete lesson → quiz button appears
- ✅ Quiz loads with 50 questions
- ✅ Questions display and grade properly

### 3. Commit (Once Approved)

```bash
git add quiz-app/src/data/
git add quiz-app/src/app/learn/
git commit -m "feat: Add [LESSON-ID] [Topic] lesson and quiz (50 questions)"
```

**Note:** All 7 integration files are already updated automatically!

---

## 📊 Quality Metrics to Track

After deploying lessons, track these metrics to improve the process:

- **Generation accuracy**: How many iterations needed?
- **Issue types**: What categories of problems came up?
- **Student performance**: Quiz pass rates, common wrong answers
- **Content gaps**: What prerequisites were actually needed?

Feed this data back to refine future lesson specifications.

---

## 🚨 Common Pitfalls I Avoid

1. **Vague learning outcomes** → I make them specific and measurable
2. **Weak distractors** → I ensure they represent real student errors
3. **Inconsistent terminology** → I check against existing lessons
4. **Missing prerequisites** → I verify logical lesson progression
5. **Incorrect difficulty ratings** → I match cognitive load to rating
6. **Giving away answers in hints** → I make hints guide thinking, not solve

---

## 📚 Reference Documents

- **Template Guide**: `lesson_factory.md`
- **Example Lesson**: `202-4A-series-circuits.json`
- **Example Quiz**: `seriesCircuitsQuestions.ts`
- **Quick Start**: `QUICK_START.md`
- **Internal Spec**: `INTERNAL_SPEC_TEMPLATE.md`

---

## 🔄 Process Improvement

This workflow evolves. Document:
- What works well
- Bottlenecks
- Recurring issues
- Suggestions for automation

Update this document as patterns emerge.

---

## ✨ Ready to Use

To generate a lesson, simply say:

```
Create Unit [NUMBER], Lesson [ID] - [TOPIC] ([SECTION])
```

I'll handle the rest! 🚀

