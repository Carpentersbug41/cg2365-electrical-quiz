# Lesson Factory Prompt Builder — Cross-Unit Improvements (201/202/203/204/210 etc.)

This doc proposes **unit-agnostic** improvements to your `LessonPromptBuilder` and generation pipeline so lessons land at **95+/100** by default across **all units** (201, 202, 203, 204, 210…).

It focuses on:
- stronger *general* constraints (structure, marking robustness, alignment)
- a topic classifier that’s not brittle
- a validate/repair loop so “almost good” lessons auto-fix

---

## 1) Why lessons keep scoring sub-90 (systemic causes)

### 1.1 The prompt defines structure but not “Definition of Done”
Your system prompt is excellent at specifying JSON shape, but weak at enforcing:
- explicit LO coverage (each LO taught, not implied)
- question quality and marking robustness
- alignment (Worked Example → Guided Practice)
- consistent “student mental model” patterns

The model can comply structurally while still failing your rubric.

**Fix:** Add a global “Definition of Done” checklist and require a self-audit before output.

---

### 1.2 The generator has no second chance
LLMs will occasionally:
- omit a required range item
- mismatch order fields
- produce strict expectedAnswer values
- forget to align guided steps

Right now that goes straight into your app.

**Fix:** implement a **two-pass generate → lint → repair** pipeline.

---

### 1.3 Heuristics for worked examples are too narrow
Your current trigger is mostly “Science/circuit/calculation/ohm”.
But many non-science lessons still need “worked example” style thinking:
- scale conversions (plans)
- safe isolation steps (procedures)
- selection decision trees (cable, PPE, containment)
- inspection/testing workflows (sequence, pass/fail rules)
- design checks (diversity, load)

**Fix:** a proper `requiresWorkedExample()` detector based on **task type**, not unit number.

---

### 1.4 Answer marking isn’t robust by default
Single-string expected answers punish normal variations.

**Fix:** standard rule:
- `expectedAnswer` should be an **array** for most `short-text`
- numeric answers should be normalised consistently (string numeric, no units)
- allow common synonyms + acronym expansions

---

## 2) Unit-agnostic “Definition of Done” (add to system prompt)

Add a section to the **system prompt** that the model must satisfy:

### 2.1 Definition of Done (must pass)
- Every learning outcome is explicitly addressed in the explanation.
- Explanation includes a clearly labelled **“Key facts / rules”** section.
- Check-1 is **exactly** 3× recall + 1× connection, and the L2 ties back to the L1 facts.
- Integrative is **exactly** 2 questions: 1× connection + 1× synthesis (3–4 sentences).
- If a worked example exists, guided practice mirrors it step-for-step.
- Practice includes 3–5 questions and at least one applied item if there is an “apply” LO.
- `expectedAnswer` uses arrays for short-text unless there is exactly one canonical wording.
- Orders are monotonic and match the required sequence.
- No invented legal claims or unsafe instructions (keep rig/education safe framing where relevant).

This alone will raise average scores.

---

## 3) Make the explanation outline consistent (works for any unit)

Right now, the model writes “a blob” of explanation text. It needs a required outline.

Add to system prompt:

### 3.1 Explanation block MUST use this outline
1. **What this is (in plain terms)**
2. **Why it matters (real job context)**
3. **Key rules / facts**
4. **How to use it (mini workflow or checklist)**
5. **Common mistakes (2–4 bullets)**
6. **Quick recap (3 bullets)**

This works across:
- 201 safety
- 202 science
- 203 install tech
- 204 wiring/testing
- 210 inspection/testing etc.

---

## 4) Improve question generation rules (general)

### 4.1 Strengthen “Connection” question requirement
Add:
- Check-1 Q4 must explicitly reference **Q1, Q2, Q3** facts.
- Integrative Q1 must link **2–3 main concepts** from the lesson.
- Integrative Q2 must request **3–4 sentences** and integrate **all** lesson concepts.

### 4.2 Default to robust expectedAnswer arrays
Update your templates in the system prompt:

- For `short-text` answers, prefer:
  - `expectedAnswer: ["X", "X (expanded)", "common synonym"]`
- For acronyms, accept both:
  - `["Residual Current Device", "RCD"]`

### 4.3 Numeric answer policy
Pick one policy and enforce it everywhere:
- `answerType: "numeric"`
- `expectedAnswer: ["5.5"]`
- NEVER include units in expectedAnswer for numeric
- Put units in hint or explanation only

---

## 5) Fix the “worked example optional” logic (unit-agnostic)

### 5.1 Replace keyword checks with task-type classification
Create a utility that classifies a lesson into one or more task types:

**Task types (suggestion):**
- `calculation` (Ohm’s law, power, energy, scale, diversity)
- `procedure` (safe isolation, testing sequence, emergency actions)
- `selection` (choose cable, PPE, containment, protective device)
- `diagnosis` (fault finding logic, symptoms → causes)
- `identification` (symbols, components, cable IDs)
- `compliance` (regulations, documentation requirements)

Then apply these rules:
- If `calculation` → include worked example + guided practice
- If `procedure` → include worked example (step sequence) + guided practice (fill the blanks)
- If `selection` → include worked example (decision path) + guided practice (choose with reasons)

This avoids “Unit-specific” logic and works for all units.

---

## 6) Add “optional blocks” support (general improvement)

Your structure is fixed, but some topics benefit from extra blocks:
- “Common mistakes / misconceptions”
- “Cheat card”
- “Safety framing”
- “Checklist”

### 6.1 Add an optional mistakes block template
Add to system prompt:

- If topic has common traps (most do), include:
  - `type: "explanation"`
  - title: “Common Mistakes”
  - 4–6 bullets

This is unit-agnostic and lifts beginner clarity.

---

## 7) Improve layout inference (general)

Your `inferLayout(section, topic)` is a black box here, but conceptually:

### 7.1 Better default logic
- Use `split-vis` when the concept benefits from a diagram:
  - circuits, waveforms, symbols, drawings, wiring layouts, testing setups
- Use `linear-flow` for:
  - legislation, responsibilities, documentation, narrative procedures

### 7.2 Add a `diagramType` enum expansion (still generic)
Current `diagramType` is too limited for many units.

Expand to:
- `series`, `parallel`, `circuit`
- `plan`, `wiring`, `schematic`, `block`
- `procedure`, `table`, `graph`, `other`

This supports 202 science diagrams and 204 wiring diagrams and 210 testing sequences without unit-specific hacks.

---

## 8) Add playbook injection — but in a unit-agnostic way

You don’t want unit-specific prompts everywhere, but you *do* want consistent quality.

### 8.1 Add “style playbooks” based on task type (not unit)
Instead of “Unit 203 playbook”, create playbooks like:

- `playbook_calculation.md`
- `playbook_procedure.md`
- `playbook_selection.md`
- `playbook_identification.md`
- `playbook_compliance.md`

Each playbook contains:
- explanation outline emphasis
- typical misconception patterns
- examples of good Q1–Q4 structure
- how to write worked + guided alignment

Then inject based on task type classification.

This keeps the generator general across all units.

---

## 9) Add an automated lint + repair loop (most effective)

### 9.1 Pass 1: generate JSON
- JSON.parse
- schema validate (Zod/JSON schema)
- lint rules (below)

### 9.2 Lint rules (unit-agnostic)
- IDs unique
- orders correct and monotonic
- check-1 has exactly 4 questions and correct cognitive levels
- integrative has exactly 2 questions with correct cognitive levels
- if worked example exists → guided exists and has same number of steps
- explanation word count 400–600 (approx; allow 350–700 if needed)
- `questionText` fields exist (esp spaced review)
- numeric answers conform to policy

### 9.3 Pass 2: repair prompt
If lint fails, send the model:
- the JSON
- the lint failures list
- instruction: “Return corrected JSON only.”

This will raise your median quality more than any single prompt tweak.

---

## 10) Concrete code-level changes (small edits, big payoff)

### 10.1 Add a `qualityGate` section to system prompt
Insert after CRITICAL QUALITY RULES:
- A bullet list of “must verify before output”
- “If any item fails, fix it before responding.”

### 10.2 Replace `getTopicContext()` with classifier + contexts
Instead of string contains, do:
- `classify(topic, section, mustHaveTopics)` → task types
- then return general context text per task type

Example:
- if `procedure` → require step checklist language + aligned guided practice
- if `identification` → require legend/recognition framing + avoid over-definition
- if `calculation` → require worked example + guided practice + unit conversions

### 10.3 Expand worked example inclusion condition
Replace your current condition:

```ts
request.section.includes('Science') || topic includes circuit/calculation/ohms
with:

ts
Copy code
requiresWorkedExample(request)
where requiresWorkedExample returns true for calculation/procedure/selection tasks.

11) Recommended “global prompt” patch (copy/paste chunk)
Add this near the top of the system prompt:

The lesson MUST satisfy the Definition of Done checklist:

Every learning outcome is explicitly taught in the explanation.

Explanation includes “Key rules/facts” and “Common mistakes” sections.

Check-1: exactly 3 recall + 1 connection, and the connection references Q1–Q3.

Integrative: exactly 2 questions (connection + synthesis, 3–4 sentences).

If worked example exists, guided practice mirrors the same steps and decision points.

Prefer expectedAnswer arrays for short-text answers.

Numeric answers use numeric strings without units.

Block order must be: 1,2,(3 if split-vis),4,4.5,(5),(6),7,9.5,10.

Spaced review always order 10.

12) Next steps (implementation order)
Add Definition of Done checklist to the system prompt.

Enforce explanation outline.

Default expectedAnswer to arrays + numeric policy.

Add task-type classifier and update worked example inclusion logic.

Expand diagramType enum to support non-circuit visuals.

Add lint + repair pass.

If you do only 1 thing: add lint + repair. That’s the biggest quality jump.

makefile
Copy code
::contentReference[oaicite:0]{index=0}