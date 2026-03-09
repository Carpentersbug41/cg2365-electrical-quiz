# Architecture Guardrails

Last updated: 2026-03-09

## Purpose

This document turns the V2 architecture from a set of intentions into a set of enforceable working rules.

## Guardrails

1. V2 is a bounded system.
   - V2 may reference V1 for product learning, migration exports, and isolated logic study.
   - V2 must not depend on V1 runtime/content modules at execution time.

2. Domain ownership is explicit.
   - Each domain owns its writes.
   - Cross-domain changes happen through owned service interfaces, not convenience updates.

3. Learner runtime reads published content only.
   - Draft and review-state content are not learner-visible.
   - Learner APIs do not read V1 content as fallback.

4. Generation is asynchronous and non-live.
   - Generation may create drafts and artifacts.
   - Generation must not mutate published learner-visible content directly.

5. Reporting is event-first.
   - Institutional metrics come from canonical events and approved aggregates.
   - Dashboard code should not invent logic independently from the event model.

6. Shared infrastructure must be generic.
   - Shared helpers are allowed only when they carry no V1 product behavior.
   - If a shared helper embeds legacy assumptions, V2 must fork or wrap it.

7. Transition states are not informal flags.
   - Versioning, job lifecycle, review lifecycle, and mastery lifecycle must use explicit transition paths.
   - Direct field mutation in handlers is not an acceptable substitute.

8. Temporary mixed-mode behavior is debt.
   - `APP_SURFACE_MODE=all` is transitional only.
   - Production intent is explicit V1 or explicit V2.

## Review Questions

Before merging a V2 feature, ask:

- Does this add any runtime dependency from V2 back into V1?
- Does this bypass a domain owner to save time?
- Does this make learner-visible behavior depend on draft or operational state?
- Does this add a second source of truth?
- Does this compute analytics outside the canonical event model?

If the answer to any of these is yes, the change should be reworked.
