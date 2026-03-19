# Research Basis For Guided Chunk Platform

## Purpose

This document is the canonical research synthesis for the guided chunk platform. It is organized by design decision, not by raw literature dump.

## 1. Chunking And Segmentation

Research implication:
- smaller meaningful segments generally reduce cognitive load and improve retention relative to long uninterrupted instruction

Product implication:
- deliver one short teaching chunk at a time
- avoid dumping the full lesson up front

What to measure:
- dropout by chunk index
- fatigue markers by chunk length
- retention by chunk length band

## 2. Retrieval Practice

Research implication:
- retrieval is one of the strongest supported learning strategies
- the key principle is frequent retrieval, not a universal fixed question count

Product implication:
- ask at least one immediate recall question after teaching
- compare denser recall patterns later by experiment, not assumption

What to measure:
- immediate recall success
- repair rate after recall
- later review success

## 3. Guided Instruction And Worked Examples

Research implication:
- novices benefit from guidance and examples more than from weakly guided discovery

Product implication:
- repair should be explicit and supportive
- the runtime should not default to pure open-ended Socratic probing for new content

What to measure:
- success after guided repair
- transfer after explanation vs no explanation

## 4. Misconception Repair

Research implication:
- explicit contrast and refutation are often effective for correcting misconceptions

Product implication:
- repair should identify the misconception, contrast it with the correct rule, and retest quickly

What to measure:
- recovery after repair
- recurrence of same misconception later

## 5. Fatigue And Microbreak Exercises

Research implication:
- short breaks can reduce fatigue and restore vigor; performance effects are more conditional

Product implication:
- use brief instructional microbreak exercises after sustained text-heavy or repair-heavy runs
- do not treat them as decorative games

What to measure:
- post-exercise latency
- post-exercise correctness
- fatigue markers before and after exercise

## 6. Vocabulary Placement

Research implication:
- technical vocabulary is best introduced selectively and in context

Product implication:
- teach vocab just in time
- avoid front-loaded glossary dumps

What to measure:
- later correct use of taught terms
- confusion between neighboring terms

## 7. Self-Explanation And Transfer

Research implication:
- explanation prompts can improve transfer when used selectively and aligned to the learning goal

Product implication:
- use explanation prompts sparingly for concept integration and transfer, not after every turn

What to measure:
- transfer success after explanation prompts
- dropout after explanation-heavy chunks

## 8. Pacing And Reveal

Research implication:
- segmentation is supported; theatrical streaming alone is not a proven learning mechanism

Product implication:
- progressive reveal is acceptable as a pacing tool, not as a substitute for sound pedagogy

What to measure:
- reveal skip rate
- replay or speed-up usage
- correctness by pacing variant

## 9. Trust And Conversational Tutoring

Research implication:
- pedagogical agents and educational chatbots can help, but effect sizes depend heavily on implementation details

Product implication:
- the tutor should feel natural, concise, and supportive without becoming distracting or over-performative

What to measure:
- persistence after error by tutor style
- frustration by tutor style

## 10. Spacing And Review Timing

Research implication:
- spaced review remains one of the strongest supported effects in learning research

Product implication:
- chunk performance should feed later review scheduling

What to measure:
- delayed review success by chunk performance profile

## 11. Mastery And Support Dependence

Research implication:
- support should help novices but fade as performance stabilizes; there is no single universal threshold for every context

Product implication:
- measure support dependence instead of assuming success equals mastery

What to measure:
- supported vs unsupported success
- support fade success
- later retention

## Bottom Line

The platform should remain:
- structured
- adaptive within constraints
- measured continuously
- improved from evidence rather than vibe or novelty
