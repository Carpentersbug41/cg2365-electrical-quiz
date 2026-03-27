# Current Generation Scores

Latest checked lessons on the current locked-history prompt architecture.

| Lesson | Lesson score | Plan score | Fidelity score | Current status | Main current failure |
| --- | ---: | ---: | ---: | --- | --- |
| `202-1A` | 69 | 100 | 100 | scored | Mean / Median / Mode checks share contaminated answer guidance instead of the correct terms |
| `202-2B` | 32 earlier; latest run failed before scoring | 100 earlier | 100 earlier | failed in generation | `Phase 8 Spaced Review` returned placeholder-like content |
| `202-4B` | 50 | 100 | 100 | scored | resistance unit question used current units instead of `Ohms` |
| `203-1A` | 88 earlier; latest run failed before scoring | 100 | 100 | fail-fast in `Phase 4` | checks drift away from the legal-status objective |
| `203-5A` | 82 | 100 | 100 | scored | question asks for an explanation, but guidance gives a voltage value |

## What Is Stable

- planning is stable at `100`
- fidelity is stable at `100`
- the locked-history prompt architecture is holding

## What Is Still Failing

- local question / answer mismatch inside `Phase 4`
- answer-type mismatch in later tasks
- occasional placeholder output in `Phase 8`
- `Phase 12 Refine` still tends to regress structure and gets rejected

## Main Read

The system is no longer mainly failing on plan drift or phase-history drift.
It is mainly failing on local lesson-content judgement inside the generated lesson itself.
