## Master Lesson Template (Non-Negotiable, No-Duplication)

### 0) Lesson identity
- **Lesson ID:** `UNIT-TOPICCODE` (e.g., `204-14B`)
- **Title:** short + specific + level (“Beginner”, “Rig-safe”, etc.)
- **Unit / Topic:** (must match syllabus naming)
- **Audience:** beginner / intermediate / revision
- **Layout:** `linear-flow` or `split-vis` (+ diagram IDs if split-vis)
- **Prerequisites:** exact lesson IDs (no guessing)

---

### 1) Syllabus anchors (non-negotiable)
- **Unit:** (e.g., 202)
- **Learning Outcome(s):** (e.g., LO5)
- **Assessment Criteria covered in THIS lesson:** list
- **Range items covered:** list (or “none for this AC”)
- **Exam intent:** what this lesson prepares them to answer/do (1–2 bullets)

✅ Rule: *If it’s not anchored here, it doesn’t go in the lesson.*

---

### 2) Scope control (duplication killer)
**IN SCOPE (must teach)**
- bullet list

**OUT OF SCOPE (must NOT teach)**
- bullet list + “taught in: [lesson-id]”

**Assumptions about prior knowledge**
- 2–5 bullets (“already knows what a conductor is”, etc.)

✅ Rule: *If it’s OUT, you can mention it only as a signpost — no teaching.*

---

### 3) Lesson learning outcomes (your lesson LOs)
- 2–4 outcomes
- Each tagged with Bloom (remember / understand / apply)
- Must map to the syllabus anchors

✅ Rule: *Every practice question must trace back to one of these.*

---

### 4) Block plan (must match your JSON structure)
This is the “authoring blueprint” that becomes blocks later.

**Block order (standard)**
1. Outcomes  
2. Vocab  
3. Diagram (if split-vis)  
4. Explanation A  
4.5 Understanding Check A *(conceptual)*  
5. Explanation B  
5.5 Understanding Check B *(conceptual)*  
6. Explanation C  
6.5 Understanding Check C *(conceptual)*  
7. Worked Example *(only if needed)*  
8. Guided Practice *(scaffold steps aligned to workflow)*  
9. Practice *(standard practice)*  
9.5 Integrative *(end-of-lesson big question)*  
10. Spaced Review

✅ Rule: *Never duplicate what’s already in later lessons; never skip checks after explanations.*

---

### 5) Vocabulary (new terms only)
- 5–10 terms introduced **in this lesson only**
- Each: term + plain-English definition + “common confusion” note (optional)

✅ Rule: *If you didn’t define it here, don’t use it heavily later.*

---

### 6) Explanation plan (3–6 chunks)
For each chunk:
- **Title**
- 3–6 bullets of key teaching points
- 1–2 “beginner anchors” (simple analogy / mental model)
- 1 “don’t do this” warning if relevant (esp. 204)

✅ Rule: *Chunks must be short enough to justify a check right after.*

---

### 7) Understanding Checks (deeper processing slots)
After each major explanation:

**Understanding Check format**
- **L1 Recall x3** *(or x2 if the lesson is short)*
- **L2 Connection x1**
- *(No L3 here — keep synthesis for the end)*

**End-of-lesson integrative**
- **L2 Connection x1**
- **L3 Synthesis x1** *(3–4 sentences, combines lesson ideas)*

✅ Rule: *Your “processing questions” are always L2 + L3. Don’t dump them mid-lesson.*

---

### 8) Worked Example (conditional)
Only include if the lesson benefits from “watch me do it”.

- **Given**
- **Steps (3–6)**
- **Result**
- **Notes (why this method is safe / repeatable)**

✅ Rule: *If you include it, Guided Practice must mirror the same workflow.*

---

### 9) Guided Practice (alignment rules)
- 2–6 steps
- Each step:
  - prompt
  - expectedAnswer (keywords/phrases)
  - hint
- Steps must match the explanation workflow order exactly.

✅ Rule: *No surprise steps. Guided practice is the explanation, but scaffolded.*

---

### 10) Standard Practice (end-of-lesson)
Blueprint counts:
- Recall x __
- Apply x __
- Scenario x __
- Quick “spot the error” x __ *(optional)*

✅ Rule: *Practice should feel “doable” after guided practice.*

---

### 11) Misconceptions (explicit)
- 2–5 common misconceptions this lesson actively fixes
- For each: “wrong belief → correct belief”

✅ Rule: *At least one question should target each misconception.*

---

### 12) Safety & rig rules (Unit 204 especially)
- “Rig-safe only”
- “No live work”
- “Isolate / prove dead / supervised”
- “Stop-and-fix criteria”

✅ Rule: *This goes in the lesson whenever the content touches physical wiring.*

---

### 13) Mastery gate (simple rule)
Examples:
- “Must get the L2 connection question correct”
- “Must correctly map all conductors to terminals”
- “Pass if ≥80% AND Q4 correct”

✅ Rule: *Gate must match the lesson’s highest-value skill.*

---

### 14) Metadata + ID conventions
- ID naming pattern
- Block ID naming pattern
- Question ID pattern:
  - `[lesson]-C1-L1-A` etc.
  - Integrative: `[lesson]-INT-1`, `[lesson]-INT-2`

✅ Rule: *No freehand IDs.*

---

## One-Shot Example (Using Your Magnetism 202-5A)

### 0) Identity
- **Lesson ID:** `202-5A`
- **Title:** `202.5A — Magnetism Basics: Attraction, Repulsion, Flux`
- **Layout:** `linear-flow`
- **Audience:** Beginner
- **Prereqs:** none (or specify)

### 1) Syllabus anchors
- **Unit:** 202  
- **LO:** 5  
- **AC covered:**  
  - AC1 attraction/repulsion  
  - AC2 flux vs flux density  
- **Range:** none for AC1–2  
- **Exam intent:** define flux vs flux density; explain pole interactions

### 2) Scope control
**IN**
- attraction vs repulsion
- poles (N/S) basic
- flux (amount of field through area)
- flux density (concentration per area)

**OUT**
- magnetic effects of current (AC3) → `202-5B`
- AC generation (AC4) → `202-7B`
- sine wave characteristics (AC5) → `202-7C`

**Assumptions**
- student knows “force” means push/pull
- student knows “area” means surface size

### 3) Lesson LOs
- Describe attraction vs repulsion of poles (remember)
- Explain flux vs flux density (understand)
- Classify examples as flux vs flux density (apply)

### 4) Block plan
1 Outcomes  
2 Vocab  
4 Explanation A: poles & interactions  
4.5 Check A (3 recall + 1 connection)  
5 Explanation B: flux  
5.5 Check B  
6 Explanation C: flux density + comparison  
6.5 Check C  
9 Practice  
9.5 Integrative (L2 + L3)  
10 Spaced review

### 5) Vocab (new)
- magnet, pole, attraction, repulsion, magnetic field, flux, flux density

### 6) Explanation chunks
A) Poles & interactions  
- like repel, unlike attract  
- common mistake: “all magnets attract”  
B) Flux  
- “how much field passes through a surface”  
- analogy: “how much rain passes through a window frame”  
C) Flux density  
- “how concentrated”  
- same flux through smaller area → higher density

### 7) Understanding checks
- After A: 3 recall, 1 connection (“why do like poles repel?” basic)
- After B: 3 recall, 1 connection (link flux to area)
- After C: 3 recall, 1 connection (same flux different area)
- End integrative:
  - L2: connect flux vs density in one situation
  - L3: 3–4 sentence explanation using both terms correctly

### 8) Worked example
- Not needed (conceptual)

### 9) Guided practice
- Optional (classification steps) or skip

### 10) Practice blueprint
- Recall x4
- Apply/classify x4
- Scenario x2

### 11) Misconceptions
- “Flux = flux density”
- “All magnets attract”

### 12) Safety
- Not applicable (theory)

### 13) Mastery gate
- Must correctly explain flux vs flux density (the L2/L3 end questions)

---

