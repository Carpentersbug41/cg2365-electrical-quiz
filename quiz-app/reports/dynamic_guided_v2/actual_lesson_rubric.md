# Actual Lesson Rubric

## Purpose

This rubric defines how to score the actual generated lesson.

It is separate from:
- `plan score`
- `fidelity score`

This is the score for the lesson itself:
- what it teaches
- what it asks
- how markable it is
- whether it would support a strong tutoring runtime

This rubric is for consistent human review across lessons.

## Separation Rule

This rubric applies to dynamic lessons only.

It does not score:
- static V1 authored lessons
- the lesson planner by itself
- runtime turn wording by itself

It scores the generated lesson artifact that the runtime will teach from.

## Score Definition

`lesson score` = the quality of the actual lesson.

Judge:
- technical correctness
- teaching quality
- question quality
- answer-guidance quality
- chunk quality
- application-task quality
- runtime readiness

Do not reward a lesson just because:
- the plan was good
- the JSON is tidy
- the lesson followed the plan closely

If the lesson content itself is weak, the lesson score must be weak.

## Weighted Rubric

Use these fixed categories:
- `beginner clarity` `0-30`
- `teaching before testing` `0-25`
- `marking robustness` `0-20`
- `alignment to LO` `0-15`
- `question quality` `0-10`

Total:
- `0-100`

## 1. Beginner Clarity `0-30`

Judge whether the lesson is clear for a beginner on first contact.

Reward:
- plain explanations
- correct sequencing of ideas
- explicit distinction between similar terms
- concrete examples where needed
- no unexplained jargon in questions

Penalize:
- vague teaching
- thin anchors
- unexplained terms
- confusing transitions
- assumptions that the learner already knows the answer

High score:
- a beginner could follow the lesson without guessing what the key idea is

Low score:
- the learner would be confused even before attempting the checks

## 2. Teaching Before Testing `0-25`

Judge whether the lesson teaches an idea before it asks for it.

Reward:
- every check maps back to something explicitly taught
- chunk teaching is enough to support the three checks
- deeper questions are downstream of the chunk, not random add-ons
- worked example prepares the guided practice

Penalize:
- untaught terms in questions
- checks that require facts not taught in the chunk
- guided/practice tasks that jump ahead of the lesson
- integrative tasks that introduce new ideas

High score:
- every question feels earned by the teaching that came before it

Low score:
- the learner is being tested on content the lesson did not actually teach

## 3. Marking Robustness `0-20`

Judge whether the lesson can be marked reliably.

Reward:
- exact-term questions use exact terms
- unit questions use units
- explanation tasks use discrete marking points
- answer guidance matches the question exactly
- no neighbouring-question contamination

Penalize:
- wrong answer guidance
- vague paraphrase acceptance on exact-term questions
- long paragraph answer keys
- mixed answer types in one response field
- meta-descriptions instead of real answers

High score:
- a marker or runtime could judge answers consistently

Low score:
- the answer key is wrong, vague, or unstable

## 4. Alignment To LO `0-15`

Judge whether the lesson stays inside the intended learning objective.

Reward:
- clear relevance to the blueprint topic
- examples and tasks that match the target LO
- no drift into nearby but untaught content
- later stages still belong to the same lesson arc

Penalize:
- out-of-scope calculations
- topic drift
- imported facts from neighbouring concepts
- application tasks that do not reflect the intended objective

High score:
- the lesson feels tightly about the target LO and nothing important is off-track

Low score:
- the lesson wanders or teaches the wrong thing

## 5. Question Quality `0-10`

Judge whether the questions are sharp and well-formed.

Reward:
- one question asks for one thing
- three basic checks are distinct
- deeper question probes understanding rather than repeating recall
- guided/practice/integrative tasks are concrete

Penalize:
- duplicate checks in the same chunk
- bundled questions
- generic placeholder stems
- “single best technical answer” style vagueness
- mismatches between question stem and expected answer format

High score:
- each question has a clear target and a clear purpose

Low score:
- the learner could not tell what kind of answer is actually being asked for

## Review Method

Score in this order:
1. read the lesson as a learner would
2. check teach/check chunks
3. check worked example and later stages
4. inspect answer guidance against the question stems
5. assign category scores
6. write the top 1-3 real defects

Do not score from:
- planner quality
- fidelity quality
- whether the generation run looked sophisticated

Score only from the lesson that exists.

## Grade Bands

Use these bands:
- `95-100` = `ship`
- `90-94` = `strong`
- `80-89` = `usable`
- `<80` = `rework`

For the current dynamic generation release bar, a lesson must normally clear:
- `95+` on `lesson score`

That bar is enforced on the benchmark set defined in:
- [generation_benchmark_gate.md](./generation_benchmark_gate.md)

## Typical Failure Classes

Common reasons to deduct:
- wrong exact term
- wrong unit
- wrong answer attached to the right question
- question asks for explanation but guidance is numeric only
- guided/practice task uses meta instructions instead of a real scenario
- integrative task bundles too much into one response
- later task introduces content not taught earlier

## Relationship To The Other Scores

- `lesson score`
  - primary quality score
  - use this to judge whether the lesson is actually good

- `plan score`
  - diagnostic only
  - tells you whether the lesson blueprint was sensible

- `fidelity score`
  - diagnostic only
  - tells you whether the lesson followed the blueprint

A lesson can have:
- high `plan score`
- high `fidelity score`
- low `lesson score`

That means the planner worked and the lesson followed the plan, but the lesson itself is still weak.

That case must still be treated as a weak lesson.
