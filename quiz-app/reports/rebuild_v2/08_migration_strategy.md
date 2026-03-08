# Migration Strategy

Last updated: 2026-03-06

## Overall Approach

Build V2 in parallel. Do not try to transform the prototype into the final architecture in place.

## Migration Phases

### Phase 1: Freeze prototype surface area

- stop major feature expansion
- define the final list of prototype behaviors worth preserving
- export lessons, questions, users, attempts, review states

### Phase 2: Stand up V2 foundation

- schema v2
- content platform
- learner runtime for one curriculum slice
- event logging

### Phase 3: Migrate one thin slice

- one program or one unit
- one cohort
- one end-to-end learner flow

### Phase 4: Dual-run and compare

- compare learner progress
- compare assessment outcomes
- compare review scheduling behavior

### Phase 5: Cut over

- move active cohorts
- deprecate old runtime paths
- retain prototype as archive/reference

## What to Migrate

- learner accounts
- learner profile fields required for personalization

Explicitly not migrating:

- attempt/progress history
- review queue state

## What Not to Migrate Directly

- published lesson/question content from the PoC (V2 will create new GCSE Biology content)
- experimental route structure
- file-based registries
- operational shortcuts used only in the prototype
- any content without publish-quality confidence
