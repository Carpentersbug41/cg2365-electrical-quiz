# Admin Operations Specification

Last updated: 2026-03-06

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

## Lesson Lifecycle

Lesson content is versioned. A lesson has multiple versions, with exactly one `published` at a time.

Version states:

- `draft`: editable; created by human or generation job
- `needs_review`: locked for review
- `approved`: review passed; ready to publish
- `published`: live to learners; immutable
- `retired`: no longer live; retained for audit and rollback

Publishing swaps which approved version is live. Editing always creates a new version.

## Approval Gate

Default rule for AI-generated lesson drafts:

- publishing eligibility requires a final quality score of at least 92/100
- drafts below threshold remain in review state and require improvement/regeneration

## V1 Prototype Behavior to Replace

- direct edits that blur draft vs published state
- operator tools writing too close to learner runtime data
- weak auditability around content mutation
