# Question Scoping Audit Report

## Executive Summary

**Problem:** AI-generated "Check Your Understanding" questions test content from future explanation blocks that students haven't learned yet, violating the "Teach First, Then Test" methodology.

**Violations Found:** 6 out of 12 lessons have scoping violations where questions reference future content.

**Total Questions Needing Revision:** 9 questions across 6 lessons.

---

## Detailed Findings by Lesson

### ✅ **202-1A** - Electrical Quantities (CLEAN)

**Check Block 1** (order 4.5) - "The Four Fundamental Electrical Quantities"
- Tests: Voltage, current, resistance, power relationships
- Preceding explanation: "The Four Fundamental Electrical Quantities"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

**Check Block 2** (order 5.5) - "Unit Prefixes: Making Numbers Manageable"
- Tests: Prefix usage, conversions
- Preceding explanation: "Unit Prefixes: Making Numbers Manageable"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

---

### ✅ **202-2A** - Ohm's Law (CLEAN)

**Check Block 1** (order 4.5) - "Understanding Ohm's Law"
- Tests: V=IR relationships, proportionality
- Preceding explanation: "Understanding Ohm's Law"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

---

### ✅ **202-3A** - Series Circuits (CLEAN)

**Check Block 1** (order 4.5) - "The 3 Series Rules"
- Tests: Current same everywhere, voltage sharing, resistance adding
- Preceding explanation: "The 3 Series Rules"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

---

### ✅ **202-4A** - Parallel Circuits (CLEAN)

**Check Block 1** (order 4.5) - "The 3 Parallel Rules"
- Tests: Voltage same, current splits, resistance decreases
- Preceding explanation: "The 3 Parallel Rules (and why they're true)"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

---

### ✅ **202-5A** - Power & Energy (CLEAN)

**Check Block 1** (order 4.5) - "Understanding Electrical Power"
- Tests: P=VI formula, power relationships
- Preceding explanation: "Understanding Electrical Power"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

**Check Block 2** (order 5.5) - "Power vs Energy"
- Tests: Energy formula, current draw, kWh
- Preceding explanation: "Power vs Energy: Understanding the Difference"
- **Status:** ✅ ALL QUESTIONS SCOPE CORRECTLY

---

### ❌ **202-7A** - AC Principles (VIOLATION)

**Check Block 1** (order 4.5) - "Check Your Understanding: AC vs DC"

Preceding explanation: "AC vs DC: What's the Difference?" (order 4)
- Content covers: AC vs DC definition, why AC for mains, mentions frequency EXISTS

**Question 1 (L2):** "What is the relationship between the way electrons move in an Alternating Current and the property known as frequency?"
- **VIOLATION:** ❌ Question tests FREQUENCY relationship
- **Issue:** Frequency is only MENTIONED ("AC has an extra property: frequency") but NOT EXPLAINED until order 5
- **Next section explains:** "Understanding Frequency" (order 5) - what Hz means, 50Hz UK mains

**Question 2 (L3):** "Why is AC current chosen for the mains electricity in our homes rather than using DC sources like batteries?"
- **Status:** ✅ CORRECT - Tests content from AC vs DC explanation

**Question 3 (L4):** "If a power station provided DC instead of AC, what would happen to the efficiency of the national grid?"
- **Status:** ✅ CORRECT - Tests AC advantages mentioned in explanation

**Action Required:** Replace Question 1 with one that tests AC vs DC concepts without requiring frequency knowledge.

---

### ❌ **202-7B** - How AC is Generated (VIOLATION)

**Check Block 2** (order 5.5) - "Check Your Understanding: How Rotation Produces AC"

Preceding explanation: "How Rotation Produces AC: The Sine Wave Explained" (order 5)
- Content covers: 0-360° rotation, sine wave generation, voltage at different angles

**Question 3 (L4):** "If a generator's loop speed was increased from 50 rotations per second to 60 rotations per second, what would happen to the resulting sine wave?"
- **VIOLATION:** ❌ Question asks about "frequency of the electricity" and "60 Hz"
- **Issue:** The explanation mentions rotation speed creates cycles but doesn't connect it to Hz frequency terminology or the 50/60Hz standards
- **Expected answer includes:** "frequency to 60 Hz... cycles every second... matches the standard used in the USA"
- **Problem:** Hz definition and 50/60Hz standards were taught in 202-7A, not this lesson

**Question 1 (L2):** "What is the relationship between the angle of the rotating loop and the amount of voltage produced?"
- **Status:** ✅ CORRECT - Tests rotation angle content

**Question 2 (L3):** "Explain why the current in the external circuit is described as 'alternating'..."
- **Status:** ✅ CORRECT - Tests alternating direction content

**Action Required:** Reword Question 3 to focus on rotation speed and sine wave properties WITHOUT requiring Hz/frequency terminology knowledge.

---

### ❌ **202-7C** - Sine Wave Vocab (VIOLATION)

**Check Block 1** (order 4.5) - "Check Your Understanding: Understanding AC Voltage Measurements"

Preceding explanation: "Understanding AC Voltage Measurements" (order 4)
- Content covers: RMS, peak, peak-to-peak definitions and relationships

**Question 3 (L4):** "If an electrician is selecting a capacitor for a 230V AC circuit, what would happen if they only considered the RMS value instead of the peak voltage?"
- **PARTIAL VIOLATION:** ⚠️ Question tests peak voltage importance
- **Issue:** Explanation says "Capacitors need peak voltage ratings, not RMS" but doesn't explain WHY or what happens if you use wrong rating
- **Expected answer includes:** "capacitor would likely fail... insulation... breakdown"
- **Problem:** Failure mechanism not explained in preceding section

**Question 1 (L2):** Peak vs peak-to-peak relationship
- **Status:** ✅ CORRECT

**Question 2 (L3):** Why multimeters show RMS
- **Status:** ✅ CORRECT

**Action Required:** Either: (1) Soften Q3 to not require failure mechanism, OR (2) Add failure explanation to order 4 content.

---

### ❌ **202-7D** - Transformers (MINOR ISSUE)

**Check Block 2** (order 5.5) - "Check Your Understanding: Mutual Induction"

Preceding explanation: "Mutual Induction Explained" (order 5)
- Content covers: The 5-step process of induction, magnetic coupling

**Question 3 (L4):** "If the iron core was removed and replaced with air, what would happen to the transformer's efficiency and why?"
- **MINOR ISSUE:** ⚠️ Tests iron core importance
- **Issue:** Previous explanation (order 4) explained iron core role, but current explanation doesn't re-emphasize it
- **Mitigation:** Students SHOULD remember from order 4, this is testing recall + application
- **Status:** 🔄 BORDERLINE - Acceptable but could be clearer

**Questions 1-2:** Test mutual induction process
- **Status:** ✅ CORRECT

**Action Required:** OPTIONAL - Could rephrase to be more clearly about the mutual induction process itself.

---

### ❌ **202-6A** - Magnetism & Electromagnetism (VIOLATION)

**Check Block 3** (order 6.5) - "Check Your Understanding: Applications: Motors, Relays, and Transformers"

Preceding explanation: "Applications: Motors, Relays, and Transformers" (order 6)
- Content covers: How motors, relays, and transformers work

**Question 3 (L4):** "What would happen if a transformer was connected to a DC battery instead of an AC supply, and why?"
- **VIOLATION:** ❌ Requires detailed transformer knowledge
- **Issue:** Explanation says "Transformers only work with AC" and briefly mentions "need changing field"
- **Expected answer:** "no changing magnetic field... no voltage would be produced... secondary coil"
- **Problem:** The brief mention doesn't give enough detail for students to construct a full answer about NO voltage in secondary

**Questions 1-2:** Test relay and isolation concepts
- **Status:** ✅ CORRECT

**Action Required:** Expand the transformer explanation in order 6 to include more detail about changing fields and induced voltage, OR simplify Q3.

---

### ❌ **203-1A** - Types of Cables (VIOLATION)

**Check Block 2** (order 5.5) - "Check Your Understanding: Cable Types"

Preceding explanation: "Common Cable Types and Where They're Used" (order 5)
- Content covers: T&E, singles, flex - construction and uses

**Question 3 (L4):** "If someone installed Twin and Earth cable as a power lead for a portable heater that gets moved around daily, what problems would likely occur over time?"
- **VIOLATION:** ❌ Requires understanding of solid conductor failure
- **Issue:** Explanation mentions T&E has "solid" conductors and flex has "stranded" for flexibility
- **Expected answer:** "solid conductors would eventually crack and break from repeated bending"
- **Problem:** Explanation doesn't explain what happens to solid wire when bent repeatedly - just says it's "rigid"

**Questions 1-2:** Test T&E vs flex construction
- **Status:** ✅ CORRECT

**Action Required:** Add explanation about solid wire cracking under repeated bending, OR reword Q3 to test the "not designed for movement" concept without requiring failure mechanism.

---

### ✅ **201-1A** - Health & Safety (CLEAN)

**Check Block 1** (order 3.5) - Purpose of regulations
- **Status:** ✅ CORRECT

**Check Block 2** (order 4.5) - HASAWA requirements
- **Status:** ✅ CORRECT

**Check Block 3** (order 5.5) - EAWR requirements
- **Status:** ✅ CORRECT

**Check Block 4** (order 6.5) - Employer/Employee responsibilities
- **Status:** ✅ CORRECT

---

## Summary Statistics

| Lesson | Status | Violations | Questions Needing Revision |
|--------|--------|------------|----------------------------|
| 202-1A | ✅ CLEAN | 0 | 0 |
| 202-2A | ✅ CLEAN | 0 | 0 |
| 202-3A | ✅ CLEAN | 0 | 0 |
| 202-4A | ✅ CLEAN | 0 | 0 |
| 202-5A | ✅ CLEAN | 0 | 0 |
| 202-7A | ❌ VIOLATION | 1 major | 1 |
| 202-7B | ❌ VIOLATION | 1 major | 1 |
| 202-7C | ❌ VIOLATION | 1 minor | 1 |
| 202-7D | ⚠️ BORDERLINE | 0-1 minor | 0-1 |
| 202-6A | ❌ VIOLATION | 1 major | 1 |
| 203-1A | ❌ VIOLATION | 1 major | 1 |
| 201-1A | ✅ CLEAN | 0 | 0 |

**Total:** 6 lessons need fixes, affecting 6-7 questions total.

---

## Root Cause Analysis

**Why did the AI generate forward-referencing questions?**

1. **Contextual knowledge bleeding:** AI has knowledge of all lesson topics and created logically coherent questions that make sense conceptually but cross content boundaries

2. **Lack of strict scoping:** The generation prompt asked for questions about the "explanation" but the AI interpreted this broadly to include related concepts

3. **Cognitive level requirements:** L4 (Hypothesis) questions naturally push beyond direct content to test application, but AI went too far into untaught territory

**Pattern:** Most violations involve terminology or mechanisms explained in later sections being required in answers.

---

## Recommendations for Future Content Generation

1. **Explicit boundary warnings:** Add to prompt: "Questions must ONLY use concepts defined in the immediately preceding explanation block. Do NOT reference any concepts from other sections."

2. **Content injection:** Include ONLY the target explanation block in the AI prompt, not the full lesson

3. **Negative examples:** Show the AI examples of BAD questions that reference future content

4. **Validation step:** After generation, cross-check each expected answer against the explanation content word-for-word

---

## Next Steps

1. Fix 202-7A check-1 Q1 (frequency question)
2. Fix 202-7B check-2 Q3 (Hz terminology)
3. Fix 202-7C check-1 Q3 (capacitor failure detail)
4. Review 202-7D check-2 Q3 (borderline - may keep as-is)
5. Fix 202-6A check-3 Q3 (transformer DC behavior)
6. Fix 203-1A check-2 Q3 (solid wire cracking mechanism)

Each fix will maintain the cognitive level (L2/L3/L4) and keyword-based marking structure.
