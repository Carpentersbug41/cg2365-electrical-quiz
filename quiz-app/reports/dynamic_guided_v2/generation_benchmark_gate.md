# Generation Benchmark Gate

## Purpose

Define the explicit release gate for dynamic lesson generation.

This gate applies to the generated lesson artifact.
It is not a runtime-tone benchmark.
It is not a planner-only benchmark.

## Score Rule

A lesson is considered benchmark-strong only if it clears all of these:
- `lesson score >= 95`
- `plan score >= 90`
- `fidelity score >= 95`
- validation passed

Interpretation:
- `lesson score` is the real benchmark gate for this benchmark doc
- `plan score` and `fidelity score` must remain high, but they are support diagnostics

## Live Publish Rule

This benchmark gate is stricter than the live publish/reject rule in the generator.

Current live generator rule:
- unrepaired draft must clear the normal acceptance gate
- repaired lesson should aim for `90+`
- repaired lesson is publishable at `80+`
- repaired lesson is rejected only if its best repaired score stays below `80`

So:
- this doc defines the strong benchmark target
- it does not describe the live repaired publish floor

## Benchmark Set

Use this 10-lesson benchmark set for the current dynamic pass:
- `202-1A` Mathematical Principles for Electrical Work
- `202-2B` Measuring Electrical Quantities
- `202-4A` Electron Theory and Materials
- `202-4B` Resistance, Resistivity, and Voltage Drop
- `202-4D` Power and Effects of Electric Current
- `202-5A` Magnetism and Electromagnetism
- `203-1A` Statutory and Non-statutory Regulations
- `203-3A` Circuit Types
- `203-4A` Earthing Systems and ADS Components
- `203-5A` Electricity Generation and Transmission

## How To Run

Use the benchmark harness:
- `npm run benchmark:dynamic-generation`

The harness should:
- run fresh generation for the benchmark set
- record lesson, plan, and fidelity scores
- record validation state and top issue
- fail if any lesson misses the gate

## Prompt Strategy Rule

Generation prompts should be controlled like this:
- compact critical rules
- compact good/bad examples
- deterministic binding in code for exactness and markability

Do not treat repeated reminder blocks as the primary control mechanism.
If a rule must be obeyed consistently, prefer deterministic enforcement over prompt repetition.

## Failure Classes That Block Release

These are release-blocking generation defects:
- wrong answer attached to the right question
- exact-term drift to topic labels or neighbouring concepts
- unit questions accepting quantity names instead of units
- generic or meta-instruction late tasks
- sentence-like answer guidance where discrete marking points are required
- question/answer type mismatch
- contradiction between task target and answer guidance
