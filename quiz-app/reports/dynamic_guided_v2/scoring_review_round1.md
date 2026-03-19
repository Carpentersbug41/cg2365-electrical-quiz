# Dynamic Scoring Review Round 1

## Review set

Fixed exported lesson set:

- `203-1A` from `.runtime/dynamic-guided-v2-generated-lessons/203-1a/latest.json`
- `203-3A` from `.runtime/dynamic-guided-v2-generated-lessons/203-3a/latest.json`
- `203-4A` from `.runtime/dynamic-guided-v2-generated-lessons/203-4a/latest.json`
- `203-5A` from `.runtime/dynamic-guided-v2-generated-lessons/203-5a/latest.json`

Reference docs:

- [lesson_methodology.md](./lesson_methodology.md)
- [lesson_spec.md](./lesson_spec.md)
- [scoring_model.md](./scoring_model.md)

## Current scoreboard

| Lesson | Saved score | Grade | Accepted | Initial reading |
| --- | ---: | --- | --- | --- |
| `203-1A` | 93 | strong | no | Scorer broadly correct; integrative task is too open for reliable marking. |
| `203-3A` | 92 | strong | no | Scorer broadly correct; practice task bundles too many labels into one response. |
| `203-4A` | 87 | usable | no | Scorer too lenient on answer-guidance contamination and too focused on intro thinness. |
| `203-5A` | 93 | strong | no | Scorer directionally correct, but still slightly lenient on factually wrong answer guidance. |

## Human review against the methodology

### `203-1A`

- **Methodology judgement**: mostly strong.
- **Why**:
  - teach/check sequence is coherent and teaches before testing.
  - worked example and guided practice align with the concept split.
  - integrative step asks for an open explanation of `EAWR` vs `BS 7671`, which is harder to mark reliably than the rest of the lesson.
- **Scorer judgement**: mostly correct.
- **Root cause class**: generation prompt problem.

### `203-3A`

- **Methodology judgement**: strong but over-bundled in later stages.
- **Why**:
  - teach/check content is grounded and concrete.
  - guided practice and especially practice compress too many identification tasks into single responses.
  - integrative step is still manageable, but dense.
- **Scorer judgement**: correct and possibly still slightly lenient.
- **Root cause class**: generation prompt problem.

### `203-4A`

- **Methodology judgement**: weaker than the saved score suggests.
- **Why**:
  - `Teach/Check 1` has contaminated answer guidance for the first basic question: the question asks what `S` stands for, but the guidance includes `TT Earthing System`.
  - this is a marking-robustness defect more serious than the current “thin intro” complaint.
  - later stages are usable, but the scorer missed the most important defect.
- **Scorer judgement**: too lenient and mis-prioritised.
- **Root cause class**: scoring prompt problem first, generation prompt problem second.

### `203-5A`

- **Methodology judgement**: strong structure, but answer guidance is too permissive in exactly the way the scorer reports.
- **Why**:
  - `kV` guidance accepts `Transmission Voltages`, which is factually wrong.
  - `Micro-generation` guidance accepts descriptive paraphrases when the question asks for a specific term.
  - the lesson remains well structured overall.
- **Scorer judgement**: correct on direction, slightly lenient on severity.
- **Root cause class**: scoring prompt problem and generation prompt problem.

## Round 1 conclusions

Repeated failure patterns across the four lessons:

1. bundled multi-part tasks in `guided_practice`, `practice`, and `integrative`
2. answer guidance that is too permissive for exact-term questions
3. answer guidance contaminated with wrong or neighbouring-question content
4. occasional over-weighting of intro thinness compared with more serious marking defects

Round 1 scoring-prompt action:

- explicitly penalize factually wrong answer guidance
- explicitly penalize answer guidance contaminated with answers from another question in the same step
- explicitly prioritize exact-term enforcement for code letters, abbreviations, and named items

Round 1 does **not** change:

- generation prompts
- schema
- local heuristic scoring math
- acceptance threshold

## Next comparison rule

After the prompt change, rescore the same four exported lessons without regenerating them.

Use the delta to decide the next work item:

- **generation prompt problem** if the scorer remains right and the lesson is genuinely weak
- **scoring prompt problem** if the scorer is still mis-prioritising or missing obvious defects
- **structural schema problem** if the current lesson representation makes fair scoring impossible

## Rescore results after the scoring fixes

The standalone rescore path was fixed to load the Next environment correctly, and the scorer was tightened on:

- contaminated answer guidance
- factually wrong answer guidance
- exact-term questions
- severe mixed-output bundled tasks

These are the settled Round 1 rescore results.

| Lesson | Previous | Rescored | Delta | Final top issue | Interpretation |
| --- | ---: | ---: | ---: | --- | --- |
| `203-1A` | 93 | 89 | `-4` | Four distinct classifications in one response field. | The scorer is now stricter on markability. This is defensible, though slightly harsher than the initial human instinct. |
| `203-3A` | 92 | 89 | `-3` | Practice asks for multiple mixed outputs in one learner response field. | This is the desired outcome. The scorer now prioritises the real bundled-task defect. |
| `203-4A` | 87 | 87 | `0` | Contaminated answer guidance for the `S` question includes `TT Earthing System`. | This is the desired outcome. The scorer now identifies the actual marking problem rather than the intro. |
| `203-5A` | 93 | 88 | `-5` | `kV` guidance includes `Transmission Voltages`, which is factually wrong. | This is the desired outcome. The scorer now treats wrong answer guidance as a serious defect. |

### What changed

- `203-3A` is fixed from a scoring perspective. The scorer now flags the mixed-output practice bundle rather than drifting to a secondary wording issue.
- `203-4A` is fixed from a scoring perspective. The scorer now catches contaminated answer guidance.
- `203-5A` is fixed from a scoring perspective. The scorer now treats wrong answer guidance as a major defect.
- `203-1A` is now being scored more harshly because its classification task is more markability-heavy than the original scorer allowed. That is arguable, but defensible.

### Updated next steps

1. Freeze the scoring changes from this round.
2. Move to generation-prompt fixes for the repeated defects now that the scorer is behaving credibly:
   - contaminated answer guidance
   - exact-term drift
   - bundled practice tasks
3. Regenerate the same lesson set and compare against these rescored baselines.
