# Chunk-First Generation Plan

## Purpose

This is the current target model for dynamic guided V2 generation.

It replaces the heavier default lesson arc as the main direction for dynamic lessons.

Static V1 lessons remain unchanged.

## Core Rule

The default dynamic lesson loop is chunk-first:

1. teach one chunk
2. ask `3` recall questions for that chunk
3. give runtime feedback until the learner is ready
4. ask `1` deeper question for that chunk
5. move to the next chunk

Dynamic V2 should optimise for this loop first.

## Generator Contract

For each chunk, generation should output:

- `title`
- `objective`
- teaching text or teaching lines
- exactly `3` recall questions
- exactly `1` deeper question

The generator should not assume every lesson needs:

- guided practice
- practice
- integrative
- a broad end-stage application arc

The generator should not store dynamic answer keys in the final runtime artifact.

## Runtime Contract

Runtime owns the interaction loop.

For each chunk, runtime should:

1. present the teaching text
2. ask the `3` recall questions one at a time
3. judge learner replies from chunk context
4. give feedback and decide whether to continue or advance
5. ask the deeper question
6. move to the next chunk when ready

Runtime judgement should use current chunk context only:

- objective
- teaching text
- question text
- anchor facts
- key ideas
- misconceptions

## Optional Procedural Extension

Some chunks need more than recall plus a deeper question.

Only add extra stages when the chunk is genuinely:

- calculation-based
- equation-based
- method-based
- sequence-based
- procedure-based

For those chunks, the planner may mark a `chunkMode` such as:

- `concept`
- `procedure`
- `calculation`

Default:

- `concept` chunks use the core chunk-first loop only

Optional extension for `procedure` or `calculation` chunks:

1. worked example
2. guided practice
3. `3-5` targeted practice questions

These extra stages are conditional, not universal.

## Stage Interpretation

Dynamic V2 should now treat the old late-stage labels like this:

- `integrative`
  - not required as a separate universal stage
  - the per-chunk deeper question is the main synthesis move by default
- `guided_practice`
  - optional, only when needed for procedural or calculation chunks
- `practice`
  - optional, only when needed for procedural or calculation chunks
- `spaced_review`
  - not part of the core chunk loop
  - may be reintroduced later only if it clearly improves the runtime

## Prompt Rule

Generation prompts should reflect the chunk-first contract.

That means:

- teaching prompts write chunk teaching text
- recall prompts write `3` short recall questions
- deeper prompts write `1` deeper question
- later-stage prompts only exist for chunks that need the procedural extension

Prompts should ask for direct learner-facing content, not abstract pedagogy prose.

## Scoring Rule

Scoring must judge the same contract.

For default concept chunks, scoring should reward:

- clear chunk teaching
- exactly `3` recall questions
- one worthwhile deeper question
- teaching before testing
- runtime-ready chunk context

Scoring must not penalize a concept chunk for lacking:

- guided practice
- practice
- integrative

Those only become scoring expectations when the chunk has been planned as:

- `procedure`
- `calculation`

## Implementation Direction

The next implementation pass should simplify the dynamic generator around this model:

- planner decides chunk count and chunk mode
- generator outputs chunk teaching plus checks first
- runtime owns the learner interaction loop
- optional procedural extension is added only where the planner marks it as needed

This is the canonical target for dynamic guided V2 unless a later doc explicitly replaces it.
