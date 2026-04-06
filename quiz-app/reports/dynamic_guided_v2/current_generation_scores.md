# Current Generation Scores

Latest known lesson outcomes on the current live dynamic-guided-v2 pipeline.

This snapshot reflects the current system state:
- cleaned prompts across Phases 1-3, 4.1, and 5-12
- Phase 4 left on the safer baseline wording
- fixable Phase 4 mismatches now continue into scoring/repair
- repair loop keeps the best valid repaired state seen during the run
- repaired publish floor is now `80`

## Current Live Read

| Lesson | Initial score | Best / final known score | Repair used | Publish status | Main live note |
| --- | ---: | ---: | --- | --- | --- |
| `202-4A` | `94` | `94` | no clear repair need in the recorded strong run | publish | strong overall; deeper questions still somewhat open-ended |
| `202-5A` | `93` in a recent strong baseline run; `91` in a later smoke run | `91-93` depending on run | yes in some runs | publish | main weakness is still deeper-question markability |
| `202-6A` | `94` | `94` | not materially | publish | strong, with open-ended deeper questions as the main weakness |
| `203-1A` | `94` | `94` | not materially | publish | strong, but still prone to meta deeper questions |
| `203-4A` | `89` in the repaired-validation check | `93` | yes | publish | previously died early; now survives repair and clears the gate |
| `203-5A` | `88` in the best-state retention check | `94` | yes | publish | previously degraded late in repair; now keeps the best repaired state |

## Important Changes From Earlier Snapshots

### `203-4A`

Earlier behavior:
- could fail early on a fixable Phase 4 teach/check mismatch

Current behavior:
- continues into scoring and repair
- latest known repaired result: `93`

### `203-5A`

Earlier behavior:
- repair path could improve the lesson and then later drag it back down
- example path:
  - `88 -> 90 -> 94 -> 86`
- old final kept state: `86`

Current behavior:
- same run shape now keeps the best repaired state
- latest known final kept result: `94`

## What Is Stable

- the cleaned prompt architecture is not causing obvious broad regressions
- planning and fidelity remain strong
- the repair pipeline is more robust than before
- strong lessons stay strong

## What Is Still Weak

- deeper-question quality is still the most common recurring weakness
- evaluator reliability is still imperfect on some runs
- some lessons remain volatile across fresh runs
- Phase 4 question writing is still the most fragile generation phase

## Main Read

The live system is now in a better place than the earlier fail-fast snapshots suggested.

Most important improvements:
- fixable Phase 4 issues are no longer always fatal before repair
- repaired lessons keep the best valid repaired score, not just the last accepted one
- repaired lessons are now publishable at `80+`, with `90+` remaining the target

So the next step is no longer broad prompt surgery.

The next step is:
- test the actual lesson set
- identify recurring defects in real outputs
- then tighten the specific phase causing those defects
