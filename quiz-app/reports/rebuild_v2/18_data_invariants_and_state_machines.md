# Data Invariants and State Machines

Last updated: 2026-03-10

## Purpose

This document defines the data invariants that protect V2 from drift and the state machines that should be enforced explicitly.

## Core Invariants

1. Published content is immutable.
2. A lesson has at most one published version.
3. A question has at most one published version.
4. A learner has one authoritative mastery record per lesson.
5. Attempts are append-only.
6. Events are append-only.
7. A review item represents one active remediation state for one learner/question/source context.
8. Unsafe duplicate active generation jobs are not allowed.

## Lesson Version State Machine

States:

- `draft`
- `needs_review`
- `approved`
- `published`
- `retired`

Allowed transitions:

- `draft -> needs_review`
- `needs_review -> draft`
- `needs_review -> approved`
- `approved -> published`
- `published -> retired`
- `retired -> published` only through explicit rollback/swap path

Rules:

- learner runtime reads `published` only
- `published` is immutable
- edit after publish creates a new `draft`
- publish must atomically replace the currently published version for the same lesson

## Question Version State Machine

States:

- `draft`
- `needs_review`
- `approved`
- `published`
- `retired`

Rules mirror lesson versions.

## Generation Job State Machine

States:

- `queued`
- `running`
- `needs_review`
- `approved`
- `rejected`
- `failed`

Allowed transitions:

- `queued -> running`
- `running -> needs_review`
- `running -> failed`
- `failed -> queued` only through explicit retry path with attempt accounting
- `needs_review -> approved`
- `needs_review -> rejected`

Rules:

- claiming a job must be concurrency-safe
- retryable failures must record reason codes
- job status must not imply learner-visible publish state

## Review Item State Machine

States:

- `due`
- `completed`
- `resolved`

Allowed transitions:

- `due -> completed`
- `completed -> due` when another repetition is scheduled
- `completed -> resolved`

Rules:

- review scheduling is server-owned
- completion and resolution are distinct concepts

## Mastery State Machine

Phase 1 states:

- `pending`
- `achieved`

Allowed transitions:

- `pending -> achieved`

Phase 1 rule:

- set `achieved` when learner scores `>= 80%` on the lesson quiz

Rules:

- mastery is derived from server-owned assessment outcomes
- review results are measured separately in phase 1 and do not silently rewrite mastery rules

## Enforcement Guidance

Where possible, invariants should be enforced in:

- database constraints/indexes
- database transition functions
- V2-owned service-layer methods
- tests that cover invalid transitions and partial-failure cases
