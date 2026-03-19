# Scoring Model

## Purpose

Define the quality bar for the new module.

## Base Rubric

Use the V1 scoring philosophy.

Primary dimensions:
- beginner clarity
- teaching before testing
- marking robustness
- alignment to LO
- question quality

Weighted ranges:
- beginner clarity: `0-30`
- teaching before testing: `0-25`
- marking robustness: `0-20`
- alignment to LO: `0-15`
- question quality: `0-10`

## Additional Dynamic V2 Checks

Also judge:
- whether the step brief would lead to good tutor output
- whether the questioning is concrete and useful
- whether the teaching is competitive with GPT baseline
- whether the sequence follows the intended instructional role cleanly

## What Must Not Pass

Do not pass a lesson because it only has:
- correct keywords
- valid JSON
- right curriculum labels
- technical structure without good teaching intent
- generic filler or placeholder content
- weak or missing teach/check questions
- a worked example without real steps, result, and takeaway
- low-quality drafts that fail validation but still look structurally complete

## Acceptance Rule

Dynamic scoring is now part of a strict quality gate, not just a report.

- validation failure caps the draft at `rework`
- drafts below `91` enter fix-plan and refinement
- only drafts at `95+` with no protected domain regressions are accepted and saved
- rejected drafts still surface the full score and issue list in admin for inspection

## Comparison Standard

The new module should be compared against:
- GPT simple-prompt baseline
- current learner outcomes

The score is only useful if it reflects real teaching quality.

This same scoring bar applies to:
- lesson drafts generated from native dynamic blueprints
- lesson drafts generated from the manual dynamic lesson generator
