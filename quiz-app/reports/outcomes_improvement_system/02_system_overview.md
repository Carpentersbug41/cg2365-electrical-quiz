# System Overview

## Summary

The outcomes improvement system is a closed product-improvement loop:

1. Collect raw learner evidence.
2. Compute stable instructional metrics.
3. Review the evidence.
4. Record conclusions.
5. Record the product intervention.
6. Monitor outcomes after the intervention.
7. Iterate.

## The three layers

### 1. Evidence layer

This layer stores what actually happened.

Examples:

- question attempts
- lesson starts and completions
- mastery state changes
- review due and review resolved events
- quiz context and timing
- response times where available

This layer must preserve raw records.

### 2. Interpretation layer

This layer stores what the team concluded from the evidence.

Examples:

- "Lesson 203-4C has strong completion but weak 14-day retention."
- "Immediate answer reveal appears to increase repeat success but not transfer."
- "LO AC1.3 is repeatedly weak across multiple lessons."

This layer must not overwrite raw evidence. It should reference it.

### 3. Intervention layer

This layer stores what changed in the product because of the interpretation.

Examples:

- revised quiz explanation pattern
- changed review scheduling rule
- reworked lesson block order
- changed hint policy
- replaced a question set

This layer must be explicit and auditable.

## Current state in the app

The current codebase already contains outcomes-related reporting in two places:

- mixed/legacy admin outcomes in `/api/admin/users/outcomes*`
- V2 outcomes reporting in `/api/admin/v2/outcomes/*`

Current strengths:

- attempts, completion, mastery, review due/resolved, and active user reporting already exist
- V2 has aggregate-backed reporting
- lesson and unit breakdowns already exist in V2

Current weaknesses:

- reporting is split across V1/V2 and mixed-purpose surfaces
- some metrics are still activity-heavy rather than learning-valid
- the current dashboard does not persist evidence reviews or intervention logs
- there is no clean separation between raw evidence, interpretation, and intervention history

## Target state

The target system adds a dedicated product-improvement layer on top of existing runtime telemetry.

Target capabilities:

- dedicated admin outcomes page
- cohort view
- user view
- lesson view
- LO view
- evidence review records
- intervention records
- monitoring window tracking
- before/after comparisons

## Main user journeys

### Journey 1: Review learning effectiveness

1. Admin opens the outcomes page.
2. Reviews cohort summary.
3. Drills into weak lesson or LO areas.
4. Checks whether the issue is retention, transfer, mastery, or review recovery.
5. Creates an evidence review record.

### Journey 2: Decide a product change

1. Admin or product owner records a conclusion from evidence.
2. Creates an intervention record.
3. Links the intervention to lessons, LOs, routes, or feature areas.
4. Sets a monitoring window.

### Journey 3: Evaluate the change

1. Dashboard compares pre-change and post-change windows.
2. Team checks primary metrics first.
3. Team decides keep, revise, or roll back.
4. Decision is recorded.

## Proposed product surface

The system should live in a dedicated admin area:

- `admin/outcomes`

Supporting API namespace:

- `/api/admin/outcomes/*`

Suggested sub-surfaces:

- summary
- users
- lessons
- learning outcomes
- reviews
- interventions
- evidence reviews
