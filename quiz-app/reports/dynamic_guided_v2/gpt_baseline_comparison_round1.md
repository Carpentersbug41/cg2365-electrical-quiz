# GPT Baseline Comparison Round 1

## Scope

Compared the current accepted dynamic lessons against the user's GPT baseline tutoring pattern.

Dynamic lessons reviewed:

- `203-3A`
- `203-4A`
- `203-5A`

Reference baseline:

- conversational chunked tutoring example for LO4 earthing / ADS
- characteristics observed:
  - narrow chunk teaching
  - 3 short checks per chunk
  - answer tightening into exam wording
  - persistent misconception repair inside the same chunk
  - natural clarification subloops before progression

## Headline Judgement

The current dynamic system is now structurally credible, but it still does **not** beat the GPT baseline on pedagogy.

It is better than earlier dynamic versions on:

- chunk count
- technical correctness
- answer guidance control
- runtime safety
- inspectability

It is still worse than the GPT baseline on:

- repair-loop quality
- conversational naturalness
- chunk-local misconception pursuit
- adaptive clarification depth

## Current Dynamic Strengths

### 1. Real core chunk shape now exists

All three accepted lessons now sustain a `5` teach/check chunk arc before the later application stages.

That is a real improvement over the old compressed `2`-chunk shape.

### 2. Stronger intros

The intros now include:

- a practical purpose line
- a chunk map
- a clearer explanation of what the lesson is about

This is materially closer to a real tutor opening than the old generic outcome list.

### 3. Better technical precision

Recent fixes removed several bad behaviors:

- untaught safety drift in `203-5A`
- incorrect `TN-C-S` / `PME` guidance
- bad conductor/component mismatches in `203-4A`
- placeholder-style openers

### 4. Better late-stage markability

Late tasks are less likely to collapse into unmarkable bundled outputs than before.

## Current Dynamic Weaknesses

### 1. Repair loops are still shallow

The GPT baseline keeps working on the exact confusion the learner just exposed.

The dynamic lessons still mostly provide:

- a planned chunk
- a check
- a feedback path

But they do not yet show the same persistent misconception pursuit.

### 2. Some chunks are still generator-shaped rather than tutor-shaped

Typical signs:

- phrasing is clean but slightly manufactured
- deeper questions are sometimes mechanically normalized rather than naturally conversational
- hints can still feel like test scaffolding rather than tutoring

### 3. Late stages still carry too much pedagogic burden

The GPT baseline does most of the real teaching and repair inside the chunk flow.

The current dynamic lessons still rely too much on:

- guided practice
- integrative close

to do the synthesis work.

That makes them feel more lesson-engineered than tutor-led.

### 4. Some remaining accepted issues are still visible

`203-3A`

- guided practice scenario still contains two loads and invites ambiguity
- integrative step still under-tests the promised synthesis

`203-4A`

- integrative close is now acceptable, but still slightly prompt-shaped
- answer guidance still needs stricter component-only sequencing

`203-5A`

- one voltage check still expects three values in one answer field
- integrative explanation guidance is still a little fragmentary

## Per-Lesson Comparison

### `203-3A`

Current state:

- accepted
- score `92`
- strong on technical chunking
- still weaker on scenario specificity in guided/integrative stages

Comparison to GPT baseline:

- better structure than before
- still less natural than baseline
- not enough misconception repair inside the chunk itself

Verdict:

- usable and solid
- still below the baseline tutor feel

### `203-4A`

Current state:

- accepted
- score `93`
- best example of the new chunk shape working on a concept-heavy topic

Comparison to GPT baseline:

- chunk flow is good
- technical terms are better controlled
- still less responsive than baseline when a learner is confused

Verdict:

- closest of the three to the desired shape
- still not yet at the baseline's repair quality

### `203-5A`

Current state:

- accepted
- score `93`
- strong explanation of voltage/current/heat-loss relationship

Comparison to GPT baseline:

- good teaching core
- still shows generator-style repetition and list-like checking in one chunk
- integrative close is cleaner than before but still not fully tutor-natural

Verdict:

- technically strong
- still below the baseline on adaptive feel

## What Must Change Next

### 1. Move more pedagogic work into chunk-local repair

The runtime should be better at staying inside one chunk when the learner is uncertain.

The goal is:

- teach
- 3 short checks
- tighten wording
- probe the misconception
- only then advance

### 2. Make deeper questions feel more like tutoring and less like gates

They should still be markable, but they need to sound like the tutor is extending the thought, not triggering the next state machine edge.

### 3. Reduce residual list-style answers inside teach/check chunks

Even when technically valid, list-heavy checks feel less natural than the baseline.

### 4. Keep later stages simpler

The GPT baseline wins because the early chunk sequence does most of the real teaching.

The dynamic system should copy that:

- stronger chunks
- lighter late-stage burden

## Final Position

The dynamic system is now operational and qualitatively improved.

It is not yet better than the GPT baseline.

The remaining gap is no longer basic infrastructure or scoring.

The remaining gap is:

- runtime repair quality
- chunk-local pedagogic naturalness
- tutor-like clarification behavior

That should be the focus of the next implementation round.
