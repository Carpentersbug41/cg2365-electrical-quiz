# Question Scoping Fix - Implementation Summary

## Date: 2026-01-20

## Problem Statement

The AI-generated "Check Your Understanding" questions were testing concepts from **future explanation blocks** that students hadn't learned yet, violating the fundamental "Teach First, Then Test" methodology specified in the Deeper Questions specification.

## Root Cause

When AI (Gemini) was used to generate questions, it had broader contextual knowledge and created logically coherent questions that made sense conceptually but crossed content boundaries within lessons. The generation prompt lacked explicit scoping boundaries.

## Audit Results

**Lessons Audited:** 12 total
**Violations Found:** 4 lessons with actual violations
**Questions Revised:** 4 questions

### Violations by Lesson

| Lesson | Violation Type | Question Revised |
|--------|----------------|------------------|
| **202-7A** | Major | Q1 in check-1 asked about frequency before it was taught |
| **202-7B** | Minor | Q3 in check-2 required Hz terminology not fully covered |
| **202-7C** | Minor | Q3 in check-1 required failure mechanisms not explained |
| **203-1A** | Major | Q3 in check-2 required solid wire cracking mechanism not explained |

### Clean Lessons (No Changes Needed)

- 202-1A - Electrical Quantities ✅
- 202-2A - Ohm's Law ✅
- 202-3A - Series Circuits ✅
- 202-4A - Parallel Circuits ✅
- 202-5A - Power & Energy ✅
- 202-6A - Magnetism & Electromagnetism ✅
- 202-7D - Transformers ✅
- 201-1A - Health & Safety Legislation ✅

## Changes Made

### 1. **202-7A - AC Principles** (lesson file: `202-7A-ac-principles.json`)

**Block:** check-1 (order 4.5) - "Check Your Understanding: AC vs DC: What's the Difference?"

**Original Question 1 (L2 - Connection):**
```
"What is the relationship between the way electrons move in an Alternating Current and the property known as frequency?"
```
- **Issue:** Asked about frequency BEFORE it was explained (frequency taught in order 5, not order 4)
- **Expected answer required:** Understanding of frequency cycles

**Revised Question 1:**
```
"How does the direction of electron movement in Alternating Current differ from the continuous one-way flow in Direct Current?"
```
- **Fix:** Removed frequency reference, focuses on AC vs DC electron movement patterns taught in order 4
- **Keywords updated:** Removed "frequency", kept "reverses direction", "periodically", "back and forth", "vibrate", "one direction", "continuous"

---

### 2. **202-7B - How AC is Generated** (lesson file: `202-7B-how-ac-is-generated.json`)

**Block:** check-2 (order 5.5) - "Check Your Understanding: How Rotation Produces AC"

**Original Question 3 (L4 - Hypothesis):**
```
"If a generator's loop speed was increased from 50 rotations per second to 60 rotations per second, what would happen to the resulting sine wave?"
```
- **Issue:** Expected answer referenced "60 Hz" and "USA standard" - requiring cross-lesson recall
- **Expected answer required:** "frequency to 60 Hz... matches the standard used in the USA"

**Revised Question 3:**
```
"If a generator's loop speed was increased from 50 rotations per second to 60 rotations per second, what would happen to the number of complete sine wave cycles produced?"
```
- **Fix:** Removed Hz terminology and USA standard requirement, focuses on rotation→cycle relationship
- **Keywords updated:** Changed from "60 Hz", "frequency" to "more cycles", "60 cycles", "per second", "increase", "faster"

---

### 3. **202-7C - Sine Wave Vocab** (lesson file: `202-7C-sine-wave-vocab.json`)

**Block:** check-1 (order 4.5) - "Check Your Understanding: Understanding AC Voltage Measurements"

**Original Question 3 (L4 - Hypothesis):**
```
"If an electrician is selecting a capacitor for a 230V AC circuit, what would happen if they only considered the RMS value instead of the peak voltage?"
```
- **Issue:** Expected answer required capacitor failure mechanism ("insulation breakdown", "fail") not explained in preceding section
- **Expected answer required:** "The capacitor would likely fail... insulation... breakdown"

**Revised Question 3:**
```
"When selecting a capacitor for a 230V AC circuit, why must the electrician use the peak voltage value rather than the RMS value for the voltage rating?"
```
- **Fix:** Changed from asking about failure to asking about WHY peak is needed (which IS explained)
- **Keywords updated:** Changed from "insulation", "fail", "breakdown" to "peak", "325V", "maximum voltage", "reaches", "higher"

---

### 4. **203-1A - Types of Cables** (lesson file: `203-1A-types-of-cables.json`)

**Block:** check-2 (order 5.5) - "Check Your Understanding: Cable Types"

**Original Question 3 (L4 - Hypothesis):**
```
"If someone installed Twin and Earth cable as a power lead for a portable heater that gets moved around daily, what problems would likely occur over time?"
```
- **Issue:** Expected answer required solid conductor failure mechanism ("crack and break from repeated bending")
- **Expected answer required:** "solid conductors would eventually crack and break... intermittent faults, overheating"

**Revised Question 3:**
```
"Why would using Twin and Earth cable for a portable heater that moves daily be inappropriate, based on the differences in conductor construction between T&E and flexible cord?"
```
- **Fix:** Changed from asking about failure problems to asking WHY it's inappropriate (which IS explained)
- **Keywords updated:** Changed from "break", "crack", "damage", "fail" to "solid conductors", "not designed", "movement", "flexibility", "rigid", "stranded"

---

## Quality Assurance

### Verification Steps Completed

1. ✅ **JSON Validation:** All modified lesson files validated - no syntax errors
2. ✅ **Linter Check:** No ESLint errors in modified files
3. ✅ **Build Test:** Next.js successfully compiles all lessons
4. ✅ **Server Test:** Dev server running on localhost:3000, lessons loading successfully
5. ✅ **Cognitive Level Maintained:** All revised questions maintain their original L2/L3/L4 classification
6. ✅ **Keyword Marking:** All revised questions include 5+ expected keywords with minimumKeywordMatch: 3

### Post-Fix Validation

Each revised question now:
- ✅ Tests ONLY content from the immediately preceding explanation block
- ✅ Maintains appropriate cognitive level (L2: Connection, L3: Synthesis, L4: Hypothesis)
- ✅ Uses realistic student language in keywords
- ✅ Provides helpful hints
- ✅ Remains within C&G 2365 Level 2 scope

## Impact

**Before Fix:**
- 4 questions violated "Teach First, Then Test" methodology
- Students would encounter questions about concepts not yet explained
- Could cause confusion and undermine learning confidence

**After Fix:**
- All questions properly scoped to preceding explanations
- Students can answer questions using ONLY what they just learned
- Methodology integrity restored

## Files Modified

1. `quiz-app/src/data/lessons/202-7A-ac-principles.json`
2. `quiz-app/src/data/lessons/202-7B-how-ac-is-generated.json`
3. `quiz-app/src/data/lessons/202-7C-sine-wave-vocab.json`
4. `quiz-app/src/data/lessons/203-1A-types-of-cables.json`

## Documentation Created

1. `quiz-app/AUDIT_REPORT_QUESTION_SCOPING.md` - Comprehensive audit of all 12 lessons
2. `quiz-app/QUESTION_SCOPING_FIX_SUMMARY.md` - This implementation summary

## Recommendations for Future Content Generation

To prevent this issue in future AI-generated questions:

1. **Explicit boundary warnings in prompts:** "Questions must ONLY use concepts defined in the immediately preceding explanation block. Do NOT reference any concepts from other sections."

2. **Content injection:** Include ONLY the target explanation block in the AI prompt, not the full lesson context

3. **Negative examples:** Provide examples of BAD questions that reference future content

4. **Validation step:** Cross-check each expected answer against the explanation content word-for-word before finalizing

5. **Human review:** Manual review of generated questions to catch cross-boundary references

## Conclusion

The methodology violation has been successfully corrected. All "Check Your Understanding" questions now properly test only the content from their immediately preceding explanation blocks, ensuring students are never asked about concepts they haven't been taught yet.

**Status:** ✅ ALL TODOS COMPLETED
**Build Status:** ✅ PASSING
**Server Status:** ✅ RUNNING (localhost:3000)
**Methodology Compliance:** ✅ RESTORED
