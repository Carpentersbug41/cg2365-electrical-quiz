# Old Pipeline Recovery

## Purpose

Record the generation discipline that made the older static pipeline reliable, and define how the dynamic generator should copy that discipline without reusing static lesson JSON directly.

## Reference Pattern

Static lessons such as [204-10B-circuit-map-thinking-conductor-roles-expected-outcomes.json](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\data\lessons\2365\204-10B-circuit-map-thinking-conductor-roles-expected-outcomes.json) are strong because they are built in this order:

1. outcomes
2. vocabulary
3. authored explanation blocks
4. checks derived from those blocks
5. worked example
6. guided practice
7. practice
8. integrative close
9. answer key / spaced review

The key property is not the prose length. It is the construction order:

- explanation is the source of truth
- checks are downstream of explanation
- worked/guided/practice are typed and narrow
- answer targets are explicit and markable

## Dynamic Recovery Rule

Dynamic generation should follow the same authored order internally, then compile to the current thin runtime artifact.

That means:

- do not generate runtime step fields as the primary truth
- do not generate checks independently of taught points
- do not generate application stages as separate freeform tasks detached from the chunk arc

Instead, the dynamic generator should create a slim authored intermediate:

- outcomes
- vocab
- teach/check chunks with:
  - teaching points
  - key terms
  - key ideas
  - misconceptions
  - authored checks tied to teaching points
- worked example
- guided practice
- practice
- integrative

Only after that should the assembler compile the thin runtime lesson.

## Why The Current Dynamic Path Drifted

The current dynamic path has been too field-oriented:

- explanation fields
- check fields
- answer guidance fields
- application task fields

These have often been produced in parallel and repaired later.

That creates the failure pattern we have repeatedly seen:

- the question is right but the marking guidance is wrong
- the term is taught but the check targets a different label
- the application task is structurally plausible but not derived from the worked example
- the integrative close becomes a bundle instead of one markable synthesis task

## Required Design Rule

Generation remains rigid.
Runtime remains adaptive.

So the generator should be allowed to be disciplined, repetitive, and typed if that improves:

- coherence
- markability
- explanation-to-check alignment
- worked-example-to-practice alignment

The runtime tutor is where naturalness should live.
