# Progressive Depth-of-Processing Questions — Implementation Guide

**Project:** C&G 2365 Level 2 Learning Module  
**Feature:** Understanding Check Questions (Levels 1-2, plus L2/3 integrative)  
**Status:** Planning → Implementation  
**Date:** 2026-01-21

---

## 📋 Executive Summary

We are adding **4 progressive questions** (3 recall + 1 connection) after each major explanation section in lessons, plus **2 integrative questions** (1 connection + 1 synthesis) at the end of each lesson. This approach builds confidence through recall practice before introducing deeper cognitive engagement.

**Key principle:** Build foundation with **recall questions** (L1 x3) → connect concepts **(L2)** → conclude lesson with **progressive integrative questions** (L2 connection → L3 synthesis) to scaffold from confidence to sophisticated synthesis.

---

## 🎯 What We're Doing

### Current State

Lessons currently have:
- Explanation blocks (teaching content)
- Worked examples (modeling)
- Guided practice (scaffolded calculation steps)
- End-of-lesson practice (recall and application questions)

**Gap:** No immediate check for deeper understanding after each explanation section.

### New Addition

After each major **explanation block**, insert a **practice block** containing 4 questions:

```
Explanation: AC vs DC (order 4)
  ↓
Understanding Check: AC vs DC (order 4.5)  ← NEW
  - Level 1 question (recall - fact A)
  - Level 1 question (recall - fact B)
  - Level 1 question (recall - fact C)
  - Level 2 question (connection - relating A, B, C)
```

At the **end of each lesson**, add one integrative question:

```
9. Practice (end-of-lesson calculations)
9.5. Big Picture Question (NEW)  ← L2/3 integrative
10. Spaced Review
```

### What This Is NOT

- ❌ Replacing existing practice questions
- ❌ Adding more recall/memorization questions
- ❌ Creating a separate "test" section
- ❌ Using AI-generated questions on-the-fly

### What This IS

- ✅ Adding structured recall and connection questions
- ✅ Placing them strategically (right after teaching)
- ✅ Building confidence through multiple recall questions before deeper thinking
- ✅ Saving synthesis for end-of-lesson integrative question
- ✅ Using fixed, authored questions (testable, consistent)

---

## 🧠 Why We're Doing This (Evidence-Based Rationale)

### Three Proven Learning Mechanisms

#### 1. Retrieval Practice
**Research:** Testing effect shows that retrieving information strengthens memory more than re-reading.

**How these questions implement it:** Students must pull concepts from memory immediately after learning, not just recognize them.

#### 2. Elaborative Interrogation
**Research:** Asking "why?" questions improves understanding and retention.

**How these questions implement it:** Multiple L1 questions establish solid factual recall, then L2 questions ask "why" and "how" concepts relate.

#### 3. Self-Explanation
**Research:** Explaining reasoning aloud/in writing improves conceptual understanding.

**How these questions implement it:** Open-ended responses require students to articulate their understanding.

### The Progressive Depth Model

| Level | Cognitive Process | Bloom's Taxonomy | Where Used | Example |
|-------|------------------|------------------|------------|---------|
| **Level 1: Recall** | Remember factual information | Remember | After explanations (Q1-3) | "What is an electric current?" |
| **Level 2: Connection** | Link concepts | Understand/Apply | After explanations (Q4), Lesson end | "How does AC differ from DC and why does this matter?" |
| **Level 3: Synthesis** | Combine multiple lesson ideas | Analyze | Lesson end (integrative) | "Why does the UK use 230V AC at 50Hz? Consider transmission, safety, and equipment." |

**Why this progression matters:**
- Builds confidence with multiple recall questions first
- Avoids discouragement from premature complex questions
- L2 connection question ties the recalled facts together
- End-of-lesson synthesis comes when students have built foundation

---

## 🏗️ How It Works (Implementation Details)

### A. Content Structure (Lesson JSON)

Each understanding check is a **practice block** with special flags:

```json
{
  "id": "202-7A-check-ac-dc",
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
        "hint": "Think about the full name of AC."
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
        "questionText": "How do these characteristics (AC alternating direction vs DC one direction) affect which type is better for different applications?",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "AC is better for mains supply because it can be easily transformed to different voltages for transmission. DC is better for electronics and batteries because it provides steady voltage.",
        "hint": "Think about what each type is used for and why."
      }
    ]
  }
}
```

### B. New Fields Explained

| Field | Purpose | Values |
|-------|---------|--------|
| `mode` | Distinguishes from standard practice | `"conceptual"`, `"integrative"`, or `"standard-practice"` |
| `sequential` | Forces L1→L1→L1→L2 progression | `true` locks next question until current attempted |
| `cognitiveLevel` | Identifies question depth | `"recall"`, `"connection"`, `"synthesis"` |
| `expectedAnswer` | For LLM marking | Model answer showing expected response |
| `expectedKeywords` | DEPRECATED - for backward compatibility | Array of keywords (legacy system) |
| `minimumKeywordMatch` | DEPRECATED - for backward compatibility | Number (legacy system) |

### C. Marking Strategy

**Two-stage marking:**

1. **Deterministic (keyword check):**
   - Does answer contain ≥ N required keywords?
   - Are any forbidden keywords present? (misconception detection)

2. **LLM Enhancement (feedback only):**
   - If keywords present, LLM evaluates conceptual coherence
   - LLM generates encouraging feedback
   - LLM does NOT override correctness (only enrich feedback)

**Why this hybrid approach:**
- Maintains assessment validity (deterministic base)
- Provides rich feedback (LLM enhancement)
- Fails gracefully (if LLM unavailable, still works)

### D. Visual Distinction

Understanding check blocks will be styled differently:
- **Badge:** "Think Deeper" (purple) or "Big Picture Question" (integrative mode)
- **Sequential indicator:** Shows "Question 1 of 4" with lock icon on unreached questions
- **Cognitive level tag:** "Level 1: Recall" / "Level 2: Connection" / "Level 3: Synthesis"

---

## 📍 Placement Strategy

### Lesson Structure (Before)

```
1. Outcomes
2. Vocab
3. Diagram
4. Explanation
5. Explanation
6. Explanation
7. Worked Example
8. Guided Practice
9. Practice (end-of-lesson)
10. Spaced Review
```

### Lesson Structure (After)

```
1. Outcomes
2. Vocab
3. Diagram

4. Explanation: Topic A
4.5. Understanding Check: Topic A (NEW)

5. Explanation: Topic B
5.5. Understanding Check: Topic B (NEW)

6. Explanation: Topic C
6.5. Understanding Check: Topic C (NEW)

7. Worked Example
8. Guided Practice
9. Practice (end-of-lesson calculations) — KEEP
9.5. Big Picture Question (L2/3 integrative) — NEW
10. Spaced Review
```

### Placement Rules

| Lesson Element | Add Understanding Check? | Why/Why Not |
|----------------|-------------------------|-------------|
| After major explanation | ✅ YES (3xL1 + 1xL2) | Forces recall and connection before moving on |
| After worked example | ⚠️ OPTIONAL | Could add 1-2 recall questions about method steps |
| After guided practice | ❌ NO | Already has scaffolded questions |
| End of lesson (after practice) | ✅ YES (2x integrative: L2+L3) | Progressive scaffolding to full synthesis |

**Recommended frequency:** 
- 2-3 understanding check blocks per lesson (after key explanations)
- 2 integrative questions at lesson end (1 connection + 1 synthesis)

---

## 📝 Example Questions by Cognitive Level

### Topic: AC Principles (202-7A)

#### After Explanation: "AC vs DC"

**Level 1-A (Recall):**
> "What does AC stand for?"

*Tests:* Can recall the full term  
*Expected answer:* "Alternating Current"

**Level 1-B (Recall):**
> "What does 'alternating' mean in the context of electric current?"

*Tests:* Can recall the key characteristic  
*Expected answer:* "The current changes direction, flowing forwards then backwards regularly"

**Level 1-C (Recall):**
> "How does DC current flow?"

*Tests:* Can recall DC behavior  
*Expected answer:* "DC flows in only one direction continuously"

**Level 2 (Connection):**
> "How do these characteristics (AC alternating, DC one direction) affect which type is better for different applications?"

*Tests:* Can connect the recalled facts to practical applications  
*Expected answer:* "AC is better for mains supply because it can be easily transformed to different voltages. DC is better for electronics because it provides steady voltage."

---

#### After Explanation: "Frequency"

**Level 1-A (Recall):**
> "What is frequency?"

*Expected answer:* "The number of complete cycles per second"

**Level 1-B (Recall):**
> "What is the unit of frequency?"

*Expected answer:* "Hertz (Hz)"

**Level 1-C (Recall):**
> "What is the frequency of UK mains supply?"

*Expected answer:* "50 Hz"

**Level 2 (Connection):**
> "How does the frequency value (50 Hz) relate to how many times AC current changes direction in one second?"

*Expected answer:* "50 Hz means 50 complete cycles per second, so the current reverses direction 100 times per second (twice per cycle)"

---

#### After Explanation: "UK Mains Supply"

**Level 1-A (Recall):**
> "What is the voltage of UK mains supply?"

*Expected answer:* "230V"

**Level 1-B (Recall):**
> "What is the frequency of UK mains supply?"

*Expected answer:* "50 Hz"

**Level 1-C (Recall):**
> "Is UK mains supply AC or DC?"

*Expected answer:* "AC (Alternating Current)"

**Level 2 (Connection):**
> "Why is UK mains supply AC rather than DC?"

*Expected answer:* "AC can be easily transformed to different voltages using transformers, making it efficient for long-distance transmission from power stations to homes"

---

### End of Lesson: Integrative Question

**Level 2/3 (Synthesis):**
> "You've learned about AC vs DC, frequency (50 Hz), and UK mains supply (230V AC). Now explain: Why does the UK use 230V AC at 50Hz for the national grid, rather than DC? What are the practical advantages? (3-4 sentences)"

*Tests:* Can synthesize across all lesson concepts  
*Expected answer:* "The UK uses 230V AC at 50 Hz because AC can be easily transformed to different voltages using transformers. This allows power stations to transmit electricity at very high voltages (reducing losses over long distances) then step it down to safe 230V for homes. The 50 Hz frequency is standardized across Europe for equipment compatibility. DC cannot be easily transformed, making it inefficient for national transmission."

---

## 💻 Technical Implementation

### Phase 1: Code Changes (One-Time)

#### A. Update TypeScript Types

**File:** `src/data/lessons/types.ts`

Add new optional fields to `PracticeBlockContent`:

```typescript
export interface PracticeBlockContent {
  title: string;
  mode?: 'standard-practice' | 'conceptual' | 'integrative';  // NEW
  sequential?: boolean;                                         // NEW: Forces L1→L1→L1→L2 progression
  questions: {
    id: string;
    questionText: string;
    answerType: 'short-text' | 'numeric' | 'mcq';
    expectedAnswer: string | string[];                         // For LLM marking
    cognitiveLevel?: 'recall' | 'connection' | 'synthesis';    // NEW: Depth of processing
    expectedKeywords?: string[];                               // DEPRECATED: Backward compatibility
    minimumKeywordMatch?: number;                              // DEPRECATED: Backward compatibility
    options?: string[];
    correctOptionIndex?: number;
    hint?: string;
  }[];
}
```

#### B. Enhance PracticeBlock Component

**File:** `src/components/learning/blocks/PracticeBlock.tsx`

**Changes needed:**

1. **Visual styling for conceptual mode:**
```typescript
const isConceptual = content.mode === 'conceptual';
const badgeColor = isConceptual ? 'purple' : 'indigo';
const badgeText = isConceptual ? 'Think Deeper' : 'Practice';
```

2. **Sequential locking logic:**
```typescript
const [currentQuestion, setCurrentQuestion] = useState(0);
const [attemptedQuestions, setAttemptedQuestions] = useState<boolean[]>(
  new Array(content.questions.length).fill(false)
);

// Only show question if:
// - sequential is false, OR
// - it's the current question, OR
// - it's already been attempted
const isQuestionAccessible = (index: number) => {
  if (!content.sequential) return true;
  return index <= currentQuestion || attemptedQuestions[index];
};
```

3. **Display cognitive level tags:**
```typescript
{question.cognitiveLevel && (
  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
    {question.cognitiveLevel === 'recall' && 'Level 1: Recall'}
    {question.cognitiveLevel === 'connection' && 'Level 2: Connection'}
    {question.cognitiveLevel === 'synthesis' && 'Level 3: Synthesis'}
  </span>
)}
```

4. **Pass data to marking API:**
```typescript
const response = await fetch('/api/marking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    questionId: question.id,
    userAnswer: answers[index],
    answerType: 'conceptual',                          // For conceptual questions
    questionText: question.questionText,               // NEW: LLM needs context
    expectedAnswer: question.expectedAnswer,           // NEW: Model answer for LLM
    cognitiveLevel: question.cognitiveLevel,          // NEW: Helps LLM adjust feedback
  }),
});
```

#### C. Marking API

**File:** `src/app/api/marking/route.ts`

The marking API already supports LLM-based marking for conceptual questions. For recall questions (L1), the LLM compares the user answer against the `expectedAnswer` field. For connection and synthesis questions (L2/L3), the LLM evaluates conceptual understanding and coherence.

No changes needed - current implementation handles new structure.

**Estimated time:** 1-2 hours for all code changes

---

### Phase 2: Content Generation (Per Lesson)

#### Workflow: AI-Assisted + Human Review

**For each lesson:**

1. **Identify explanation sections** (manually review lesson JSON)

2. **Generate questions using AI:**
   - Provide explanation text to Claude/GPT
   - Use prompt template (see Appendix A)
   - Get 4 questions (3xL1, 1xL2)

3. **Review and refine:**
   - Check questions are answerable from explanation
   - Verify L1 questions build on each other
   - Ensure L2 question connects the L1 facts
   - Check integrative question synthesizes whole lesson

4. **Insert into lesson JSON:**
   - Add at `order: X.5` after explanation
   - Set `mode: "conceptual"` and `sequential: true`

5. **Test end-to-end:**
   - Load lesson
   - Attempt questions
   - Verify marking works
   - Check feedback quality

**Estimated time per lesson:** 20-30 minutes  
**Total for 12 lessons:** ~4-5 hours

---

## 📊 Success Metrics

### How We'll Know It's Working

**Quantitative:**
- Completion rate on understanding checks (target: >80%)
- Average attempts per question (target: 1.5-2.0)
- Time spent on understanding checks vs regular practice (should be higher)
- Improvement in end-of-lesson practice scores (after vs before adding checks)

**Qualitative:**
- Student feedback ("helped me understand" vs "too hard/confusing")
- Quality of student answers (coherent explanations vs keyword stuffing)
- Reduction in common misconceptions on quizzes

**Success threshold:**
- >70% of students complete all understanding checks
- >60% answer with sufficient keywords on first attempt
- Positive feedback on helpfulness

---

## 🗺️ Implementation Roadmap

### Week 1: Foundation
- [ ] Update TypeScript types (`types.ts`)
- [ ] Enhance PracticeBlock component
- [ ] Update marking API keyword logic
- [ ] Create question generation prompt template
- [ ] Test with dummy questions in one lesson

### Week 2: Content Pilot
- [ ] Generate understanding checks for 202-7A (AC Principles)
- [ ] Insert into lesson JSON
- [ ] Test end-to-end with real student (if available)
- [ ] Refine question quality and keywords
- [ ] Document lessons learned

### Week 3: Batch Content Generation
- [ ] Generate checks for remaining 11 lessons:
  - 201-1A: Health & Safety
  - 202-1A: Electrical Quantities
  - 202-2A: Ohm's Law
  - 202-3A: Series Circuits
  - 202-4A: Parallel Circuits
  - 202-5A: Power & Energy
  - 202-6A: Magnetism
  - 202-7B: AC Generation
  - 202-7C: Sine Wave Vocab
  - 202-7D: Transformers
  - 203-1A: Types of Cables
- [ ] Review all questions for quality
- [ ] Insert into lesson JSONs

### Week 4: Testing & Refinement
- [ ] Spot-check all lessons
- [ ] Test with real students (if available)
- [ ] Adjust keywords based on actual responses
- [ ] Document common issues
- [ ] Create teacher/tutor guidance notes

---

## 📚 Appendix A: Question Generation Prompt Template

Use this prompt when generating questions with AI:

```
You are an expert educational content creator for C&G 2365 Level 2 Electrical Science.

LESSON SECTION:
[paste explanation content here]

TASK:
Generate 4 progressive questions for this section: 3 recall questions that build on each other, then 1 connection question that relates them.

REQUIREMENTS:
- Question 1 (Level 1 - Recall): Simple factual recall from the explanation
- Question 2 (Level 1 - Recall): Related factual recall that builds on Q1
- Question 3 (Level 1 - Recall): Third related fact that completes the foundation
- Question 4 (Level 2 - Connection): Link all three facts from Q1-3 into practical understanding

CONSTRAINTS:
- Questions must be answerable using ONLY the content provided
- Stay within C&G 2365 Level 2 scope (no advanced calculus, complex theory)
- Keywords must reflect realistic student language (not textbook jargon)
- Avoid trick questions or irrelevant hypotheticals

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "id": "[lesson-id]-C[section#]-L1-A",
      "questionText": "...",
      "cognitiveLevel": "recall",
      "expectedAnswer": "...",
      "hint": "..."
    },
    {
      "id": "[lesson-id]-C[section#]-L1-B",
      "questionText": "...",
      "cognitiveLevel": "recall",
      "expectedAnswer": "...",
      "hint": "..."
    },
    {
      "id": "[lesson-id]-C[section#]-L1-C",
      "questionText": "...",
      "cognitiveLevel": "recall",
      "expectedAnswer": "...",
      "hint": "..."
    },
    {
      "id": "[lesson-id]-C[section#]-L2",
      "questionText": "...",
      "cognitiveLevel": "connection",
      "expectedAnswer": "...",
      "hint": "..."
    }
  ]
}

EXAMPLE (for reference):
Level 1-A: "What does AC stand for?"
Level 1-B: "What does 'alternating' mean in the context of electric current?"
Level 1-C: "How does DC current flow?"
Level 2: "How do these characteristics (AC alternating vs DC one direction) affect which type is better for different applications?"
```

---

## 📚 Appendix B: Quality Checklist

Before marking a question set as "complete," verify:

### Content Quality
- [ ] Questions are answerable from the explanation (no external knowledge required)
- [ ] Three L1 questions build on each other logically
- [ ] L2 question connects the three L1 facts
- [ ] Integrative question (if end-of-lesson) synthesizes whole lesson
- [ ] Language is appropriate for Level 2 students

### Technical Accuracy
- [ ] `expectedAnswer` provides clear model answer for LLM marking
- [ ] Hints are helpful but don't give away the answer
- [ ] Question IDs follow naming convention: `[lesson-id]-C[section#]-L1-[A/B/C]` or `L2`
- [ ] Integrative questions use `mode: "integrative"`

### Integration
- [ ] Block order is correct (X.5 after explanation at order X)
- [ ] `mode: "conceptual"` is set
- [ ] `sequential: true` is set
- [ ] JSON syntax is valid (no trailing commas, quotes balanced)

### Testing
- [ ] Question displays correctly in UI
- [ ] Sequential locking works (can't skip to Q2 before attempting Q1)
- [ ] Marking works (LLM compares to expectedAnswer)
- [ ] Feedback is helpful and encouraging
- [ ] Cognitive level tags display correctly (L1: Recall, L2: Connection, L3: Synthesis)

---

## 🔄 Future Enhancements (Post-MVP)

### Version 2.0 Ideas

1. **Adaptive difficulty:** If student struggles on L2, offer more scaffolding before L3

2. **Tutor integration:** "Stuck? Ask the tutor" button that provides Socratic prompting

3. **Progressive scaffolding:** Binary choice → Fill-in-blank → Open question (if stuck)

4. **Reflection prompts:** After correct answer, ask "Why does this matter in real installations?"

5. **Cross-lesson synthesis:** L4 questions that connect across multiple lessons

6. **Student examples bank:** Collect good student answers as exemplars for future learners

---

## ✅ Summary: What, Why, How

### What
- 4 questions (3xL1 recall + 1xL2 connection) after each major explanation
- 2 integrative questions (1xL2 connection + 1xL3 synthesis) at end of lesson

### Why
- Evidence-based: retrieval practice builds confidence before deeper thinking
- Students reported discouragement with premature complex questions
- Multiple recall questions establish solid foundation
- Progressive scaffolding at lesson end: connection question before synthesis
- End-of-lesson synthesis comes when students are ready

### How
- Add practice blocks with `mode: "conceptual"` and `sequential: true`
- Questions progress: recall (x3) → connection
- Add integrative block with `mode: "integrative"` at lesson end
- LLM marking compares to `expectedAnswer` field
- Place at `order: X.5` after explanation blocks, `9.5` at lesson end

### Impact
- Better retention and understanding
- Earlier misconception detection
- More sophisticated mental models
- Assessment-grade validity maintained

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-19  
**Next Review:** After pilot implementation (Week 2)
