# Admin Operations Specification

Last updated: 2026-03-09

## Purpose

Admin operations in V2 must support content trust, not just content speed.

## Core Workflows

- create/edit lesson draft
- review generated lesson draft
- publish/unpublish lesson version
- create/edit question draft
- approve/reject question version
- run duplicate analysis
- inspect generation artifacts
- audit content decisions

## Role Model

- `admin`
- `content_operator`
- `teacher`
- `learner`

Do not collapse all privileged behavior into one admin role if operationally avoidable.

## Required Controls

- who created a draft
- who approved it
- when it changed
- what generation job produced it
- what published version is live
- what checklist/evidence justified approval
- whether the transition used a normal or exceptional path

## Lesson Lifecycle

Lesson content is versioned. A lesson has multiple versions, with exactly one `published` at a time.

Version states:

- `draft`: editable; created by human or generation job
- `needs_review`: locked for review
- `approved`: review passed; ready to publish
- `published`: live to learners; immutable
- `retired`: no longer live; retained for audit and rollback

Publishing swaps which approved version is live. Editing always creates a new version.

Transitions must be executed via V2-owned service/database transition paths, not direct table updates from UI handlers.

## Approval Gate

Default rule for AI-generated lesson drafts:

- publishing eligibility requires a final quality score of at least 92/100
- drafts below threshold remain in review state and require improvement/regeneration

## Admin Boundary Rules

- admin tools orchestrate domain actions; they do not bypass domain invariants
- admin pages do not write operational rows directly from form handlers when a service transition exists
- admin tools must not query V1 content/runtime state to fill V2 workflow gaps
- emergency/manual override paths, if ever added, must be explicit, rare, and auditable

## V1 Prototype Behavior to Replace

- direct edits that blur draft vs published state
- operator tools writing too close to learner runtime data
- weak auditability around content mutation
- “temporary” admin shortcuts that become production behavior
