# Module Dependency Matrix

Last updated: 2026-03-09

## Purpose

This document defines which V2 modules may depend on which others.

## Modules

- `identity-access`
- `curriculum-content`
- `learning-runtime`
- `assessment-review`
- `generation-jobs`
- `reporting-analytics`
- `admin-ops`

## Allowed Dependency Rules

`identity-access`

- may be used by all modules for auth/session/role checks
- must remain generic and not contain product workflow rules

`curriculum-content`

- may depend on `identity-access`
- may be read by `learning-runtime` through published read models only
- may be used by `admin-ops` for moderated draft/review/publish workflows
- may be written by `generation-jobs` only through content-owned draft creation/update interfaces

`learning-runtime`

- may depend on `identity-access`
- may read published views from `curriculum-content`
- may emit events to `reporting-analytics`
- may create/update review state only through `assessment-review`

`assessment-review`

- may depend on `identity-access`
- may read question/content identifiers from `curriculum-content`
- may consume learner outcomes from `learning-runtime`
- may emit events to `reporting-analytics`

`generation-jobs`

- may depend on `identity-access`
- may read curriculum metadata/context from `curriculum-content`
- may write draft artifacts and evaluations in its own domain
- may request draft version creation/update in `curriculum-content`
- may emit events to `reporting-analytics`
- must not publish content directly

`reporting-analytics`

- may receive events from all domains
- may read approved operational data only where canonical events/aggregates do not yet exist
- must not become a backdoor write path into operational domains

`admin-ops`

- may depend on `identity-access`
- may orchestrate actions across domains
- must call domain-owned services for mutations
- must not bypass invariants for convenience

## Forbidden Dependency Rules

- `learning-runtime` -> V1 runtime/content modules
- `assessment-review` -> V1 review/progress helpers
- `generation-jobs` -> learner-facing runtime handlers
- `admin-ops` -> direct table mutation where domain transition paths exist
- `reporting-analytics` -> ad hoc business logic that disagrees with canonical events

## Practical Code Rule

When implementation pressure makes a shared legacy helper attractive:

- if it is truly generic, wrap it in a V2-owned module
- if it carries legacy product assumptions, do not import it into V2
