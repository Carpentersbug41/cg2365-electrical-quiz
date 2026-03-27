# Runtime A/B Review Round 1

## Scope
Compare runtime variants on live `simple-chatbot` lesson turns only:

- `control`
- `lean_feedback_v1`

Source artifact:
- [.runtime/dynamic-runtime-variant-comparison.json](C:\Users\carpe\Desktop\hs_quiz\quiz-app\.runtime\dynamic-runtime-variant-comparison.json)

Probe set:
- `203-4A`
- `203-5A`
- `202-2B`

Probe points:
- `teach`
- `feedback_basic`
- `feedback_deeper`

## Findings

### Teach turns
- `lean_feedback_v1` is only slightly different from `control`.
- The main difference is not teach delivery; it is feedback behavior.

### feedback_basic
- `lean_feedback_v1` is more direct and less report-like.
- It responds to the learner answer faster and avoids some of the control-path "answer key" tone.
- `202-2B` is the clearest win:
  - `control`: good, but more formal
  - `lean_feedback_v1`: concise, direct, and cleanly confirms the secure answer

### feedback_deeper
- `lean_feedback_v1` is better at staying on one repair target.
- It produces shorter, more usable retry questions.
- It is still not at GPT quality, but it is closer than `control`.

## Decision
Promote `lean_feedback_v1` to the default runtime variant for lesson-mode tutoring.

Reason:
- better live tutoring feel
- more direct misconception handling
- less marking-report tone
- no regression in runtime flow

## Implementation Rule
- default runtime variant: `lean_feedback_v1`
- keep `control` available by explicit override for comparison/debugging
- do not change generation or scoring because of this decision

## Residual Risks
- The reply classifier is still heuristic and can over-label some partial answers as `misconception`.
- Worked-example and integrative feedback are still on the older control-style logic.
- This promotion improves runtime behavior, but it does not by itself close the full GPT gap.
