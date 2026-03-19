# Dashboard And Workflows

## Product surface

Create a dedicated admin area:

- `admin/outcomes`

Do not keep this work mixed into `admin/users`.

## Main sections

### 1. Cohort summary

Purpose:

- show whether the product is broadly teaching effectively

Cards:

- retention 14d
- retention 30d
- transfer
- mastery rate
- review recovery
- median time to mastery

Support cards:

- active users
- attempts
- review backlog
- generation failure rate

### 2. Trend charts

Show daily or weekly trends for:

- active learners
- weighted accuracy
- review backlog
- review resolved
- retention success count
- transfer attempt count

### 3. Lesson table

Purpose:

- identify which lessons need product or content intervention

Columns:

- lesson code
- lesson title
- learners started
- completion rate
- mastery rate
- retention 14d
- transfer
- review recovery
- risk flag

### 4. LO table

Purpose:

- identify specific learning outcomes that are weak across lessons or cohorts

Columns:

- LO code
- learners attempted
- first accuracy
- latest accuracy
- score delta
- retention
- transfer
- mastery
- risk flag

### 5. User detail

Purpose:

- diagnostic drilldown only

Use:

- understanding whether a product issue is widespread or isolated

Do not position this as the primary purpose of the system.

### 6. Evidence reviews

Purpose:

- record what the team concluded from the data

UI needs:

- create review
- link dashboard scope
- capture headline, evidence summary, and metric snapshot
- list open and closed reviews

### 7. Interventions

Purpose:

- record product changes triggered by evidence

UI needs:

- create intervention
- link to evidence review
- set change type
- set scope
- set monitoring window
- record outcome decision

## Filters

Core filters:

- date window
- course
- unit
- lesson
- LO
- risk level
- cohort segment

## Exports

The system should support CSV export for:

- cohort summary snapshots
- lesson table
- LO table
- intervention history

## Workflow: evidence review

1. Admin filters to the relevant cohort or curriculum slice.
2. Reviews primary learning metrics.
3. Drills into lesson and LO detail.
4. Creates an evidence review entry.
5. Captures a short conclusion and links the relevant metrics snapshot.

## Workflow: intervention

1. Product owner or admin creates intervention entry.
2. States the hypothesis.
3. Links implementation reference.
4. Sets monitoring window.
5. Marks intervention as implemented.

## Workflow: post-change monitoring

1. Dashboard shows before and after window comparison.
2. Team reviews primary metrics first.
3. Team records keep, revise, or roll back.
4. Decision is stored in the intervention result record.

## API shape

Suggested namespace:

- `GET /api/admin/outcomes/summary`
- `GET /api/admin/outcomes/timeseries`
- `GET /api/admin/outcomes/lessons`
- `GET /api/admin/outcomes/learning-outcomes`
- `GET /api/admin/outcomes/users`
- `GET /api/admin/outcomes/users/[userId]`
- `GET /api/admin/outcomes/evidence-reviews`
- `POST /api/admin/outcomes/evidence-reviews`
- `GET /api/admin/outcomes/interventions`
- `POST /api/admin/outcomes/interventions`
- `POST /api/admin/outcomes/interventions/[id]/evaluate`

## UX rules

- primary learning metrics must be visually separated from operational metrics
- `null` means insufficient evidence, not failure
- every risk flag should be explainable
- every intervention should be traceable back to evidence
