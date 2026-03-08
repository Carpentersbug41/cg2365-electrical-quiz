# Phases 1-9 Lesson Generation System (Current)

Last verified: 2026-03-05
Primary runtime: `src/lib/generation/SequentialLessonGenerator.ts`

---

## 1. Active Phase Sequence

The generator composes lessons through specialized phases:
1. Planning
2. Vocabulary
3. Explanation
4. Understanding Checks
5. Worked Example (conditional)
6. Practice
7. Integration
8. Spaced Review
9. Assembler

## 2. Key Runtime Behavior

- each phase has parse/validation safeguards
- failures short-circuit with phase-specific error
- phase progress metadata is collected for API response/debugging

## 3. Important Logic Rules

- worked example/guided practice can be forced for calculation-heavy outputs
- phase outputs are normalized before later scoring/refinement
- curriculum and syllabus grounding instructions can be injected upstream via lesson-generator API

## 4. What Happens After Phase 9

Phases 10/12/13 run post-assembly for quality refinement when needed.
See `improvement_pahes10_13prompts.md` and `scoring.md` for that path.