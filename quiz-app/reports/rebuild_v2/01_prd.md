# Product Requirements Document

Last updated: 2026-03-06

## Product Goal

Build a curriculum-scoped learning platform that combines lesson delivery, assessment, review scheduling, and AI-assisted content operations while remaining operationally safe for institutional use.

## Primary Users

- learners
- tutors/teachers
- content operators
- administrators
- institutional decision-makers

## Core User Jobs

Learners need to:

- access structured lessons
- complete quizzes and retries
- receive review tasks at the right time
- improve over time with measurable progress

Tutors need to:

- track learner progress and weak areas
- trust published content
- reduce manual preparation overhead

Operators need to:

- create and review lessons/questions safely
- run generation pipelines with approval gates
- audit content decisions and revisions

Decision-makers need to:

- see retention, mastery, completion, and cohort outcomes
- understand whether the platform saves staff time

## MVP Scope for V2

V2 is sequenced into phases. The long-term product includes the full capability set, but we ship in slices.

### Phase 1 (Demo Slice)

- one curriculum: GCSE Biology
- learner-first: lesson -> quiz -> review -> outcomes
- versioned lessons and question bank
- server-backed attempts, mastery, and review queue
- outcomes dashboard (learner + basic admin view)
- AI generation is included:
  - generate lesson drafts
  - generate question drafts
  - operator approval required before publish

### Phase 2 (Operationalization)

- stronger admin ops (audit, bulk workflows, moderation ergonomics)
- richer reporting (cohort dashboards, exports, intervention views)
- reliability hardening (job retries, monitoring, data quality checks)

### Phase 3 (Expansion)

- additional curricula (GCSE Physics, C&G 2365, etc.)
- broader content types (simulations, microbreak games, plugins)
- deeper personalization

## Explicit Non-Goals for Initial V2

- all existing curricula on day one (explicitly deferred)
- every simulation and experimental mini-app
- every current admin surface
- real-time collaboration
- full multi-tenant white-labeling

## Success Metrics

- 14-day retention score
- lesson completion rate
- time to mastery
- review completion rate
- content approval turnaround time
- generation job success rate
