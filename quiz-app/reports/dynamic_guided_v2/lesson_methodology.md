# Lesson Methodology

## Purpose

Define the teaching model for the dynamic 2365 lesson module.

This methodology is for the dynamic planner, generator, scorer, and runtime only.
It does not replace the static V1 lesson model.

## Core Principle

A dynamic lesson is not a flat list of fixed learner-facing chunks.

It is:
- a small number of planned core chunks
- plus runtime repair loops when the learner is confused or imprecise
- followed by modelled and independent application

The goal is natural tutoring, not a worksheet or a rigid script.

## Control Principle

The dynamic module should not use one control style everywhere.

Use:
- rigid planning and generation for consistency
- rigid scoring for consistency
- loose runtime tutoring for adaptation

That means:
- the lesson artifact should be consistent and predictable
- the score should be consistent and predictable
- the live tutoring should be allowed to sound natural and adapt to the learner

The runtime should be flexible inside the guard rails, not outside them.

Those guard rails should be minimal.
They exist to keep the runtime:
- correct
- in scope
- aligned to required terminology
- safe to progress

They do not exist to script tutor wording, explanation rhythm, or repair style.
If an extra guard rail improves control but degrades dynamic tutoring quality, it should be rejected.

## Target Lesson Shape

A normal dynamic lesson should contain:
- `4-6` core chunks by default
- then a worked example
- then guided practice
- then independent practice
- then an integrative close

A core chunk contains:
- one main idea
- short teaching
- exactly 3 short-answer checks
- feedback on those checks
- one deeper probe when appropriate
- optional clarification / repair before progression

The important distinction is:
- core chunk = planned teaching move
- repair loop = runtime response to learner misunderstanding

Repair loops are expected and desirable.
They do not mean the planner created too many chunks.

## Chunk Progression Model

Within one core chunk, the runtime should behave like this:
1. teach one idea clearly
2. ask 3 short-answer questions
3. give feedback and tighten wording
4. ask or resolve one deeper question if the chunk needs it
5. repair misconceptions if needed
6. only then advance to the next core chunk

That is the teaching rhythm the generator should support.

## Planner Defaults

Planning defaults for the dynamic module:
- most LOs -> `1` lesson
- broad or conceptually heavy LOs -> `2` lessons
- only split further when one LO contains more than one clean teaching arc

Chunk defaults per lesson:
- compact lesson -> `4` core chunks
- normal lesson -> `5` core chunks
- denser lesson -> `6` core chunks

If one lesson would need more than `6` core chunks, split it into two lessons.

Split by teaching arc, not by LO label alone.

## What Counts As One Teaching Arc

A lesson should usually stay within one coherent arc:
- one conceptual family
- one worked-example pattern
- one type of application reasoning

If the content needs a different reasoning mode, a different safety logic, or a different application pattern, that is usually a new lesson.

## Current Runtime Mapping

The runtime still uses these stored stages:
- `intro`
- `teach_check`
- `worked_example`
- `guided_practice`
- `practice`
- `integrative`

And these runtime feedback phases:
- `feedback_basic`
- `feedback_deeper`
- `worked_example_feedback`
- `integrative_feedback`

That stage model is a delivery mechanism.
It is not the real pedagogic unit.

The real pedagogic unit is the core chunk plus whatever repair is needed before progression.

## Role Of V1

For the dynamic module, V1 is reference material only.

Useful things to retain from V1:
- teach before test
- explicit modelling before independent practice
- strong answer guidance
- pedagogic scoring discipline

Things not to copy literally:
- block-by-block authored lesson shape
- rigid phase mirroring when it weakens the tutoring flow
- assuming the planned chunk count must equal the number of learner turns

## Methodology Consequence

Do not try to make generation and runtime behave the same way.

Generation should be strict because structure is a quality requirement.
Runtime tutoring should be flexible because live learner repair is a quality requirement.

## What Good Looks Like

A strong dynamic lesson should feel like this:
- concise teaching
- sharp short-answer checks
- corrective feedback that improves exam wording
- clarification loops that stay on the learner's actual misunderstanding
- smooth movement into example, practice, and synthesis

If a strong GPT tutor would naturally stay on one point for three extra turns, the dynamic lesson should be able to do that without pretending those turns were separate planned chunks.
