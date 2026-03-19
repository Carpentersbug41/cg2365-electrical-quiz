# Implementation Plan

## Build objective

Build a dedicated outcomes improvement system that sits on top of the current app and supports evidence-based product iteration.

## Constraints

- use existing runtime data first
- avoid breaking current learner flows
- prefer derived metrics over speculative new telemetry in the first pass
- keep V1 and V2 merge logic explicit
- degrade gracefully when optional tables are absent

## Phase 1: Stabilize current outcomes reporting

Goal:

- make current outcome metrics trustworthy enough to use as a base

Tasks:

- extract shared canonical aggregation logic from the current routes
- fix review backlog semantics
- fix V1/V2 lesson deduplication
- weight cohort headline metrics correctly
- handle missing optional tables as empty datasets
- remove outcomes work from `admin/users` and move it to a dedicated page

Expected outputs:

- stable `admin/outcomes` page
- stable `/api/admin/outcomes/*` routes

## Phase 2: Add learning-valid metrics

Goal:

- move from activity-heavy reporting to stronger instructional metrics

Tasks:

- add retention 7d, 14d, 30d
- add transfer classification from source context
- add review recovery metric
- add lesson and LO breakdowns
- add explicit risk flags

Expected outputs:

- lesson table
- LO table
- timeseries with retention and transfer where data exists

## Phase 3: Add evidence review persistence

Goal:

- capture what the team concludes from the data

Tasks:

- add evidence review storage
- add create/list UI
- store metric snapshots with review entries

Expected outputs:

- evidence review panel
- evidence review API routes

## Phase 4: Add intervention log and monitoring

Goal:

- connect evidence to product change and post-change monitoring

Tasks:

- add intervention storage
- link interventions to evidence reviews
- add before/after comparison view
- add intervention evaluation workflow

Expected outputs:

- intervention list
- intervention detail
- intervention result records

## Recommended code structure

### Shared logic

Suggested modules:

- `src/lib/outcomes/canonical.ts`
- `src/lib/outcomes/metrics.ts`
- `src/lib/outcomes/risk.ts`
- `src/lib/outcomes/storage.ts`

### Routes

- `src/app/api/admin/outcomes/summary/route.ts`
- `src/app/api/admin/outcomes/timeseries/route.ts`
- `src/app/api/admin/outcomes/lessons/route.ts`
- `src/app/api/admin/outcomes/learning-outcomes/route.ts`
- `src/app/api/admin/outcomes/users/route.ts`
- `src/app/api/admin/outcomes/users/[userId]/route.ts`
- `src/app/api/admin/outcomes/evidence-reviews/route.ts`
- `src/app/api/admin/outcomes/interventions/route.ts`

### UI

- `src/app/admin/outcomes/page.tsx`
- supporting client components under `src/components/admin/outcomes/*`

## Validation requirements

Add route or unit tests covering:

- V1 only inputs
- V2 only inputs
- mixed V1/V2 duplicate entities
- missing optional tables
- weighted cohort accuracy
- backlog semantics
- retention window classification
- transfer classification
- risk flag generation
- intervention persistence and retrieval

## Acceptance criteria

The first full delivery is acceptable when:

- the dashboard no longer mixes user admin and outcomes admin
- lesson and LO views exist
- headline learning metrics are clearly separated from operational metrics
- evidence reviews can be created and retrieved
- interventions can be created and linked to evidence reviews
- before/after intervention results can be stored

## Recommended implementation order

1. Shared canonical aggregation
2. Summary and timeseries routes
3. Lesson and LO routes
4. Dedicated outcomes page
5. Evidence review persistence
6. Intervention persistence
7. Before/after monitoring
