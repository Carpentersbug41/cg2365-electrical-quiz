# Quick Start: Lesson Generation

**One-page reference for creating lessons**

---

## 🚀 Basic Usage

### Request Format

```
Create Unit [NUMBER], Lesson [ID] - [TOPIC] ([SECTION])
```

### Examples

```
Create Unit 202, Lesson 1A - Electrical Quantities & Units (Science)
Create Unit 202, Lesson 2A - Ohm's Law Basics (Science)
Create Unit 305, Lesson 1A - PPE Selection (Health & Safety)
```

---

## 📚 Common Sections

| Section Name | Description | Content Type |
|--------------|-------------|--------------|
| `Science 2365 Level 2` | Electrical principles | Circuits, calculations, theory |
| `Health & Safety Level 1` | Foundational safety | Regulations, PPE, basic procedures |
| `Health & Safety Level 2` | Advanced safety | Risk assessment, systems, management |

---

## 🔢 Lesson ID Patterns

### Format: `[UNIT]-[SEQUENCE][VARIANT]`

**Examples:**
- `202-1A` - First lesson in Unit 202
- `202-1B` - Alternate/extended version of first lesson
- `202-2A` - Second lesson in Unit 202
- `305-3A` - Third lesson in Unit 305

**Sequence:** 1, 2, 3, 4... (order within unit)  
**Variant:** A (standard), B (extended), C (alternative approach)

---

## 🎨 Layout Decision Guide

| Layout | Use When | Example Topics |
|--------|----------|----------------|
| `split-vis` | Diagrams must stay visible, spatial/topology learning | Circuit diagrams, component layouts, system diagrams |
| `linear-flow` | Text-heavy, formulas, definitions, sequential reading | Calculations, regulations, theory, procedures |

### Automatic Layout Selection

**I choose `linear-flow` when:**
- ✅ Section: "Health & Safety", "Theory", "Regulations"
- ✅ Topic: "Calculations", "Formulas", "Definitions", "Units"
- ✅ Content: Regulations, PPE, risk assessment, safety procedures
- ✅ Format: Text-heavy, lists, sequential steps

**I choose `split-vis` when:**
- ✅ Section: "Science 2365" (circuit-based lessons)
- ✅ Topic: "Circuit", "Series", "Parallel", "Diagram", "Topology"
- ✅ Content: Spatial concepts, component placement
- ✅ Format: Visual diagrams that need to stay visible

**Override anytime:** Add `Layout: linear-flow` or `Layout: split-vis` to your request

---

## 📝 Optional Parameters

Add these if you want to specify:

```
Create Unit 202, Lesson 3A - Series Circuits (Science)
Layout: split-vis
Prerequisites: 202-1A, 202-2A
Focus: Emphasize real-world applications
Questions: Include more calculation problems
```

---

## ✅ What You'll Receive

```
Generated files ready for review:

1. 202-3A-series-circuits.json (450 lines)
   - 8-10 blocks (outcomes → vocab → diagram → explanation → 
     **understanding check (3×L1 + 1×L2)** → worked example → 
     guided practice → practice → **integrative question** → spaced review)
   - Layout: split-vis
   - Prerequisites: 202-1A, 202-2A
   - Learning outcomes: 3 (remember, understand, apply)
   - New: Progressive depth-of-processing questions after each explanation

2. seriesCircuitsQuestions.ts (50 questions)
   - Difficulty: 15 easy, 25 medium, 10 hard
   - Types: 20 conceptual, 30 calculation
   - All misconception codes mapped
   - Learning outcomes covered: 3/3
   - Auto-integrated into codebase

Validation: ✅ All checks passed
Integration: ✅ Auto-integrated (7-9 files updated)

🚨 CRITICAL: Page files updated (learn/page.tsx, learn/[lessonId]/page.tsx)
   Without these, lesson will NOT display on website!

[Complete file contents below]

Ready to test! Just restart dev server.
```

---

## 🔄 Common Requests After Generation

### Minor Fixes
```
Fix: Question 3005 option B should be "12 Ω" not "12 V"
```

### Content Adjustments
```
Change: Add analogy about water flow to explanation
Change: Worked example should use 9V instead of 12V
```

### Structural Changes
```
Rework: Need more conceptual questions, fewer calculations
Rework: Difficulty distribution should be 40% easy, 40% medium, 20% hard
```

---

## 📋 Quick Checklist (Your Review)

### Lesson Content
- [ ] Formulas and facts are correct
- [ ] Explanations are clear at appropriate level
- [ ] Worked example steps make sense
- [ ] Practice questions cover key concepts
- [ ] Prerequisites are logical

### Quiz Content
- [ ] Questions are unambiguous
- [ ] Correct answers are definitively correct
- [ ] Wrong answers are plausible (not obviously wrong)
- [ ] Difficulty feels right
- [ ] Good mix of question types

### Cumulative Quiz
- [ ] Orange cumulative button appears on lesson page
- [ ] Cumulative quiz includes questions from current + previous lessons
- [ ] Questions are properly mixed (not blocked by lesson)
- [ ] First lesson in unit works (shows only current lesson questions)

---

## 🚀 Testing After Generation

**Integration is automatic!** All files are created and connected.

1. **Restart dev server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/learn`
3. **🚨 FIRST: Verify lesson appears in list** ← If NOT visible, page files weren't updated!
4. **Test lesson**: Click new lesson, complete it, verify all blocks render
5. **Test regular quiz**: Click blue "Quiz" button, verify 50 questions load
6. **Test cumulative quiz**: Click orange "🔄 Cumulative" button, verify mixed questions
7. **Commit** when approved: `git add quiz-app/src && git commit -m "feat: Add [LESSON-ID] [Topic]"`

**Files auto-updated:** 
- Data: `questions.ts`, `questions/index.ts`, `lessonIndex.ts`
- Types: `questions/types.ts`, `misconceptionCodes.ts` (if new tags/codes)
- **Display: `learn/[lessonId]/page.tsx`, `learn/page.tsx`** ← **CRITICAL for visibility!**

---

## 📚 Full Documentation

For complete details, see:
- **Full Workflow**: `LESSON_PRODUCTION_WORKFLOW.md`
- **Template Guide**: `lesson_factory.md`
- **Internal Process**: `INTERNAL_SPEC_TEMPLATE.md`

---

## 💡 Tips

- **Be specific about topic focus** if it's important
- **Mention prerequisites** if there's a specific learning path
- **Specify layout** if you have a strong preference
- **Request iterations** freely - refinement is part of the process

---

## 🎯 Ready?

Just say:
```
Create Unit [NUMBER], Lesson [ID] - [TOPIC] ([SECTION])
```

That's it! 🚀

