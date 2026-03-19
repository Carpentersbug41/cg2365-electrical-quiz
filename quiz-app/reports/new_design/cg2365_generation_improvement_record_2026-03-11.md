# C&G 2365 Guided Generation Improvement Record

## Purpose

This document records why the `cg2365` guided lesson generator improved on March 11, 2026.

It exists so future work can build from evidence rather than memory.

## Scope

Target lessons:
- `203-4A`
- `203-4B`
- `203-4C`

Context:
- guided generation pipeline
- `cg2365` subject-specific refinement layer
- guided grading reports

## Before / After

### Before
- `203-4A v3`: `81 strong`
- `203-4B v2`: `88 ship`
- `203-4C v2`: `84 strong`

### Final current published set
- `203-4A v12`: `97 ship`
- `203-4B v10`: `95 ship`
- `203-4C v7`: `94 ship`

All current published versions pass validation.

## Main Failure Causes Before The Fix

The lower scores were not random. They came from a small set of repeatable generator defects in the `cg2365` refinement layer.

### 1. Malformed recall-question rewrites
Examples from earlier drafts:
- `What is the role of crucially, bonding?`
- `What is the role of without the electrode, a tt system?`

Root cause:
- electrical question rewriting was too shallow
- malformed stems were being passed through instead of being rebuilt cleanly

### 2. Duplicate or near-duplicate recall questions
Example pattern:
- two questions in the same chunk both asking for the role of the earthing conductor

Root cause:
- no robust duplicate-question fallback for electrical chunks

### 3. Electrical repair templates too generic
Recurring weak area:
- `measurement_labels_vs_conductor_roles`
- `bonding_vs_earthing`
- `fault_path_vs_device_disconnect`

Root cause:
- fallback repair text was structurally valid but not electrician-specific enough

### 4. Repeated electrical vocabulary across chunks
Example:
- repeated `MET` definitions across multiple chunks

Root cause:
- vocab enrichment was adding good terms, but without enough cross-chunk discipline

### 5. Dense electrical teaching blocks
Example:
- earth loop / Zs chunks stayed technically correct but were too dense for the tutor runtime

Root cause:
- electrical-specific formatting did not yet force enough scan structure

### 6. Missing electrical asset cueing
Example:
- earth loop path content had no dedicated inline image cue even when the grading report called for it

Root cause:
- asset injection rules covered lighting and ceiling-rose topics but not loop-path teaching

## Generator Changes That Improved The Score

Primary file:
- [GuidedChunkGenerator.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\generation\guidedChunk\GuidedChunkGenerator.ts)

### 1. Stronger `cg2365` question rewriting
Added targeted rewrites for:
- ADS disconnect questions
- bonding questions
- earthing conductor questions
- protective device questions
- TT / earth-electrode failure questions
- `R1`, `R2`, `Ze`, `Zs`, `MET` questions

Result:
- broken or generic question stems are now replaced with electrician-meaningful questions

### 2. Alternate recall-question generation when prompts collapse
Added a dedicated fallback path for duplicate or weak electrical prompts.

Examples of new fallback logic:
- earthing conductor: shared-installation vs per-circuit distinction
- bonding: metallic vs plastic service distinction
- earth loop: series-path reasoning instead of formula parroting

Result:
- duplicate or near-duplicate recall prompts no longer survive inside the same chunk

### 3. Stronger `cg2365` repair templates
Added explicit electrician-facing repair logic for:
- `measurement_labels_vs_conductor_roles`
- `bonding_vs_earthing`
- `fault_path_vs_device_disconnect`
- `plastic_services_do_not_need_bonding`

Result:
- repair text now redirects to the real electrical distinction instead of generic “close, try again” logic

### 4. Better electrical teaching-core refinement
Added rules to:
- mention ADS explicitly when loop impedance / `Zs` is being taught
- add modern supplementary bonding context when relevant
- add `extraneous-conductive-part` wording when bonding metal services is taught
- reinforce that the earthing conductor is usually one shared conductor for the installation
- add a clearer loop-sequence summary when source / fault / MET / return-path content is present

Result:
- chunk quality improved
- misconception coverage improved

### 5. Less repeated electrical vocab
Added cross-chunk vocab filtering so repeated high-frequency electrical terms are not redefined unnecessarily unless they are genuinely central to the current chunk.

Result:
- vocab quality improved
- repeated `MET`-style bloat reduced

### 6. Electrical asset injection for loop-path content
Added loop-path image injection logic for:
- earth loop
- `Zs`
- `Ze`
- `R1 + R2`

Result:
- runtime fit improved for electrical sequence/path topics

### 7. Stronger validation
Added validation for:
- malformed electrical recall prompts
- leading yes/no electrical prompts
- duplicate recall prompts inside a chunk
- repeated electrical vocab terms across too many chunks

Result:
- the same failure patterns are less likely to slip through again

### 8. Subject-tone enforcement is now explicit
The generator already had subject profiles, but the `cg2365` profile has now been tightened so learner-facing text must:
- use practical spoken electrical language
- avoid textbook-note or standards-note voice
- avoid French-root mnemonic explanations in the main teaching text

Result:
- the 2365 runtime now gets a clearer vocational tutor voice instead of technical note prose

### 9. Module bridge and fallback path were corrected
The major March 11 failure was not just question wording. The planner-to-guided fallback path could collapse into:
- `Unit: 203 ...`
- whole LO markdown blobs
- raw misconception bullets
- over-short label-only chunks

Fixes:
- add explicit guided fallback anchors in the module-planner bridge
- parse AC/range lines instead of swallowing the whole excerpt
- ignore misconception bullets in fallback topic extraction
- expand 2365 fallback chunks into proper electrical tutor turns
- stop validation from falsely failing on legitimate repeated core terms like `MET`

Result:
- when the LLM generation path degrades, the fallback path now still produces grounded 2365 lesson frames instead of generic garbage

## Why The Scores Improved

The scores improved because the system stopped treating `cg2365` as “generic guided content with electrical words inserted” and started enforcing electrical-specific quality rules in the final refinement stage.

In practical terms:
- question shaping became more vocational
- repair became more electrician-specific
- chunk formatting became easier to scan
- vocab became less repetitive
- the loop/path topics gained better support structure

This improved:
- chunk quality
- runtime fit
- misconception coverage
- vocab quality

## What Should Not Be Reversed

Do not undo these decisions:
- keep one shared generator engine
- keep `cg2365` as a subject-specific refinement layer, not a separate engine
- keep sequential chunk generation
- keep grading reports persisted
- keep old versions for comparison
- keep targeted regeneration rather than rerunning everything blindly

## Re-run Path

Targeted runner:
- [runGuidedChunk2365Targets.cjs](C:\Users\carpe\Desktop\hs_quiz\quiz-app\scripts\runGuidedChunk2365Targets.cjs)

Command:

```powershell
node scripts/runGuidedChunk2365Targets.cjs b9c5e1b7-6d25-43ee-8bd0-11e65926cd81 203-4A 203-4B 203-4C
```

## Next Implication

The current 203-series generator problem is resolved well enough that the next attention should move from generation quality to:
- runtime naturalness
- internal usage
- telemetry review
- improving learner-facing formatting inside the tutor bubble
