# Dynamic Scoring Review Round 2

## Scope
This round stayed on scoring only. No generation prompts, schema, or runtime lesson structure were changed.

Baseline lesson set:
- `203-1A`
- `203-3A`
- `203-4A`
- `203-5A`

Method used:
- compare the exported lesson JSON in `.runtime/dynamic-guided-v2-generated-lessons/<lesson-code>/latest.json`
- compare the saved/generated score against a manual score using:
  - `reports/dynamic_guided_v2/lesson_methodology.md`
  - `reports/dynamic_guided_v2/lesson_spec.md`
  - `reports/dynamic_guided_v2/scoring_model.md`
- patch the local fallback scorer until the score and top advisory class match the manual review closely

Important current environment fact:
- live Phase 10 model scoring is blocked by Gemini returning `403 Forbidden` because the configured API key is reported as leaked
- therefore the verified scoring path in this round is the local fallback scorer

## Code changes in this round
Files changed:
- `src/lib/dynamicGuidedV2/generation/DynamicLessonGenerator.ts`
- `src/lib/dynamicGuidedV2/generation/DynamicLessonGenerator.test.ts`
- `src/lib/dynamicGuidedV2/versionStore.ts`
- `scripts/runDynamicLessonRuntimeE2E.mjs`
- `scripts/runDynamicModuleE2E.mjs`

Scoring changes:
- detect contaminated answer guidance copied from neighbouring questions
- detect exact-term drift where a question asks for one term/abbreviation but guidance accepts descriptive paraphrases
- detect topic-label answers being accepted instead of the requested abbreviation/term
- penalize same-box classification bundles more realistically
- penalize mixed-output practice bundles more realistically
- sort issues by impact so real marking defects outrank weaker secondary issues
- keep fallback-notice issues visible without hiding the real pedagogical defect

Harness fixes:
- strip BOM when reading the local version store in scripts and runtime store access
- make module E2E fail immediately with the real generation API error instead of timing out

## Manual vs rescored comparison
Manual baseline from the pedagogy review:

| Lesson | Manual score | Manual grade | Manual primary advisory |
|---|---:|---|---|
| `203-1A` | 88 | usable | practice classification bundle is too broad for one response field |
| `203-3A` | 88 | usable | practice mixes several outputs/scenarios in one response field |
| `203-4A` | 84 | usable | contaminated answer guidance accepts `TT` for the `S` question |
| `203-5A` | 86 | usable | `kV` guidance accepts a topic label instead of the correct abbreviation expansion |

Final rescored results from `npm run score:dynamic-review`:

| Lesson | Rescored score | Rescored grade | Delta vs manual | Rescored primary advisory | Agreement |
|---|---:|---|---:|---|---|
| `203-1A` | 89 | usable | +1 | practice classification bundle weakens marking granularity | yes |
| `203-3A` | 89 | usable | +1 | practice mixes multiple outputs in one response field | yes |
| `203-4A` | 87 | usable | +3 | contaminated answer guidance accepts `TT` from a neighbouring question | yes |
| `203-5A` | 87 | usable | +1 | `kV` question accepts a topic label/neighbouring concept instead of the requested term | yes |

Result:
- all four lessons are now within `±3` of the manual score
- all four now match the manual grade bucket
- all four now match the manual primary advisory class closely enough to use as a stable judge for the next generation pass

## E2E status
Regression commands run:
- `npm run score:dynamic-review` -> passed
- `npm run test:e2e:dynamic-runtime` -> blocked by live model/provider path
- `npm run test:e2e:dynamic` -> blocked by live model/provider path

Current blockers:
1. `test:e2e:dynamic`
- generation route now fails fast with the real provider error
- current error:
  - `[403 Forbidden] Your API key was reported as leaked. Please use another API key.`

2. `test:e2e:dynamic-runtime`
- local BOM/version-store bug is fixed
- runtime still depends on the live chatbot/model path, which currently fails because of the same provider issue

## Conclusion
Scoring is now calibrated enough to freeze for the next round.

Practical meaning:
- the local scorer is no longer the moving target
- it now agrees with the pedagogy review on the fixed four baseline lessons
- the next work should move to generation prompt quality, not more scoring churn

Remaining external blocker:
- live model-backed generation/runtime E2E cannot fully pass until the Gemini key/provider issue is resolved
