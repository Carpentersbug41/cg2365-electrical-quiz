# Guided Chunk Handover And Next Steps

## Purpose

This document is the handover note for the current guided-chunk build state.

It is written for a new conversation with no prior context. It explains:
- what has already been built
- what is currently working
- what is still weak
- what should happen next, in order
- what not to undo

## Current State

The guided platform has just been reset on purpose.

The reason for the reset is simple:
- the generation/runtime stack became over-engineered
- bad guided content leaked through multiple stores
- debugging became harder than the lesson problem itself

Current position:
- guided DB content has been wiped
- guided local fallback stores have been wiped
- V1/static lessons were not touched
- the new baseline is now one built-in guided lesson frame stored directly in the project
- the next product direction is now defined in `dynamic_guided_runtime_v2.md`
- the next implementation base is now a separate module namespace, defined in `separate_dynamic_module_rebuild.md`

The system remains intentionally separate from the old static/block lesson runtime.

## What Is Working

### Guided runtime
- Route: `/guided-chunk/[lessonCode]`
- One scrolling tutor thread
- Pseudo-streamed tutor turns
- Pre-generated chunk plus first question presented as one live tutor turn
- Follow-up and repair behavior inside the thread
- Inline asset injection
- Inline microbreak injection
- LO-end test flow
- Session restore support
- Full DB-backed capture of:
  - lesson version id
  - session snapshot
  - normalized thread turns
  - normalized runtime events
- Derived guided admin analytics now computed from stored session data:
  - average response latency
  - fatigue score and fatigue-onset chunk
  - confusion score
  - disengagement score
  - support dependence score
  - recovery rate
  - transfer quality
  - pace mismatch score
  - learning efficiency
- These derived summary metrics are now also persisted into `gc_session_summaries`
- Guided admin now includes recent per-session drilldown
- Guided admin now includes a DB-backed experiment registry for prompt/UI/runtime/content changes
- Guided admin drilldown now has filters for lesson, status, source context, and variant
- Guided experiments now support status updates and win/loss/mixed/inconclusive classification
- Historical guided summaries can now be backfilled with:
  - `npx tsx scripts/backfillGuidedChunkSessionSummaries.ts`

### Clean built-in baseline
- `203-4A` now exists as a built-in guided frame:
  - `src/data/guided-chunk/2365/lesson2034A.ts`
- it is registered in:
  - `src/data/guided-chunk/index.ts`
- the runtime now resolves this as the baseline guided lesson
- the runtime reads chunk order directly from the stored frame JSON/object:
  - `loSequence[]`
  - then `chunkPlan[]`

### Guided debug inspection
- full guided debug logging is now enabled for:
  - session start
  - session restore
  - turn submit
- browser console now shows:
  - bootstrap payload
  - submit answer payload
  - returned API payload
- server console now shows:
  - full thread history
  - evaluator input
  - evaluator output
  - response payload

### Guided generation
- separate guided generation pipeline still exists in code
- but it is no longer the trusted baseline
- current direction is:
  - built-in JSON/object baseline first
  - prove runtime feel first
  - then rebuild generation on top of that simpler baseline

### Guided governance
- Guided lesson versions are now versioned independently
- Lifecycle states:
  - `draft`
  - `needs_review`
  - `approved`
  - `published`
  - `retired`
- Learner runtime should resolve published guided content only
- Guided admin can inspect generated versions and grading reports

### Guided admin/planner separation
- Old static workflow remains separate
- Guided workflow now uses guided-only admin routes
- This separation is important and should not be reversed

Current guided planner routes:
- `/2365/admin/guided-module`
- `/gcse/science/biology/admin/guided-module`

Current guided admin route:
- `/admin/guided-chunk`

## What Has Been Improved Recently

### Runtime behavior
- Clarification/meta turns are no longer treated as normal content answers
- Internal system wording such as "flagged for review" should not surface directly to learners
- Correct answers are now explicitly acknowledged more clearly
- Tutor streaming now preserves line breaks better than before

### Generation quality
- Sequential chunk generation reduced overlap and improved continuity
- Subject-specific refinement was added for `cg2365`
- Guided reports now show exactly where score was lost
- Guided planner rows now persist generated state across reload
- Guided planner rows now show success/error feedback inline
- Generic fallback guided frames are now explicitly rejected by the scorer/validator instead of being allowed to ship on heuristic structure alone

## Current Known Weaknesses

### 1. The guided evaluator/runtime layer is over-engineered
This is now the main problem.

The current evaluator layer:
- uses heavily constrained outcomes
- uses literal matching too aggressively
- falls back to rigid canned tutor phrases
- makes the tutor feel old, robotic, and overly marked-up

This is the next thing to simplify.

### 2. Generated guided content is not the current source of truth
The project hit a point where:
- generated versions were confusing
- published guided versions were stale
- local fallback stores were also stale
- old sessions were restoring old content

That is why guided storage was wiped and the baseline moved back to a built-in frame.

### 3. Generation should be rebuilt more simply
The current conclusion is:
- start with one clean stored guided frame
- get the runtime feeling right
- then reintroduce generation through a simpler pipeline

The intended simpler model is:
- V1 lesson generation prompts
- V1 scoring priorities
- chunk briefs generated in order
- runtime model produces the visible tutor wording from those briefs
- minimal runtime constraints
- only bolt on controls when real failures appear

### 4. Scoring was changed to the V1 rubric
Guided scoring has now been aligned to the V1 pedagogical rubric:
- beginner clarity
- teaching before testing
- marking robustness
- alignment to LO
- question quality

This is the correct direction, but scoring is not the priority now.
The priority is lesson quality and runtime feel.

### 3. Guided planner UX is better, but not complete
The guided planner now shows generated state after reload, but it is still a functional admin surface rather than a polished authoring tool.

### 5. Runtime naturalness still needs iteration
The runtime is structurally correct and now displays stored chunks in order, but it still feels mechanical.

The next improvements are likely to be in:
- tutor phrasing
- clarification handling
- chunk formatting
- question presentation inside the tutor bubble
- smoother transitions around repair and progression

### 5. AI-change-quality tracking is only partially implemented
The experiment registry and baseline-vs-target deltas now exist.

Still missing:
- mature experiment decision rules
- rollback automation
- richer per-change result recording beyond baseline delta summaries

## Current Best Read Of Subject Architecture

Do not build a totally separate generator per subject.

Correct architecture:
- one shared guided generator engine
- one shared guided runtime engine
- per-subject profiles
- per-subject scaffold/refinement rules
- per-subject scoring overlays

This is already the direction of the system.

Current important profiles:
- `gcse-science-biology`
- `cg2365`

The generator already injects subject-specific tone/profile instructions through:
- [profiles.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\generation\guidedChunk\profiles.ts)
- [prompts.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\generation\guidedChunk\prompts.ts)

The recent issue was not missing subject tone. It was that the `cg2365` scorer and fallback path were still allowing technically correct but poor learner-facing delivery.

## Current 2365 Position

Current baseline guided lesson:
- `203-4A`
- stored directly in:
  - `src/data/guided-chunk/2365/lesson2034A.ts`

This is now the source of truth for the guided POC.

This lesson exists to prove:
- order from stored JSON/object
- one clean scrolling runtime
- one believable tutor thread

It is not yet the final authored style.
It is the clean baseline to iterate from.

Current ground-up rebuild scaffold:
- `src/lib/dynamicGuidedV2/*`
- `src/data/dynamic-guided-v2/*`
- `src/app/dynamic-guided-v2/*`

This scaffold exists specifically so the rebuild does not extend the old guided runtime code.

## Immediate Next Steps

### Step 1. Test the built-in `203-4A` baseline
Use the built-in guided lesson only.

### Step 2. Inspect full payloads and thread history
Use browser console + server console logging to see:
- thread history
- answer payload
- evaluator result
- returned payload

### Step 3. Simplify the runtime model
The next redesign should remove evaluator over-engineering and move to a simpler tutor-response model.

### Step 4. Improve runtime naturalness using real failure cases
Use real learner interactions to tighten:
- tutor acknowledgment
- clarification handling
- question formatting
- transition language

### Step 5. Start real telemetry review once guided lessons are being used
Focus first on:
- completion rate
- exit chunk
- repair rate
- clarification/meta message frequency
- LO test outcomes
- fatigue/drop-off indicators

Then use that data to adjust prompts and runtime behavior.

## Recommended Work Order For The Next Conversation

1. Read `dynamic_guided_runtime_v2.md`
2. Read `separate_dynamic_module_rebuild.md`
3. Build inside `dynamicGuidedV2`, not `guidedChunk`
4. Run guided runtime checks on the separate baseline
5. Keep generation paused as the baseline source of truth
6. Only then reintroduce generation using the simpler model

## Do Not Undo

Do not reverse these decisions:
- keep guided and old/static workflows separate
- keep guided versions versioned; do not overwrite old versions
- keep grading reports persisted and visible
- keep one shared generator with subject-specific refinement, not one generator per subject
- keep sequential chunk generation with prior chunk history
- keep the learner runtime constrained under the hood even if tutor phrasing becomes more natural
- keep the dedicated targeted 2365 runner: `scripts/runGuidedChunk2365Targets.cjs`
- keep the fallback-frame guard in scoring/validation; do not let generic frames ship on structural heuristics alone

## Core Principle

The whole system is built around a measured improvement loop.

The right model is:
- generate
- inspect evidence
- tighten system
- regenerate
- compare
- keep the stronger version

The score report is not a side feature. It is part of the core operating philosophy.
