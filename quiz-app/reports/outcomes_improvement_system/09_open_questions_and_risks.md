# Open Questions And Risks

## Open questions

### 1. What should count as transfer in the current app?

The initial build can infer transfer from source context values such as:

- `review`
- `cumulative`
- `interleaved`
- `mixed`

This should be validated against real runtime usage.

### 2. How much LO tagging exists in current content and attempts?

Lesson and LO breakdown quality depends on the quality of:

- lesson metadata
- question tagging
- runtime linkage between attempts and LOs

### 3. Do we need new runtime events immediately?

The first pass should derive as much as possible from existing data.
If key metrics remain weakly supported, then add new event instrumentation after the shared aggregation layer is stable.

### 4. Should intervention monitoring be lesson-scoped, feature-scoped, or both?

Answer:

- both, but lesson-scoped is easier to make reliable first

## Main risks

### Risk 1: Measuring activity instead of learning

Mitigation:

- keep primary learning metrics visually and logically separate

### Risk 2: Mixed V1/V2 data contamination

Mitigation:

- canonical merge layer
- explicit precedence rules
- dedupe by logical entity

### Risk 3: Overclaiming from weak evidence

Mitigation:

- use conservative metric definitions
- return `null` when evidence is insufficient
- require evidence review before intervention logging

### Risk 4: Dashboard sprawl

Mitigation:

- keep `admin/outcomes` focused
- do not mix content seeding, user management, and outcome review in one screen

### Risk 5: Historical loss

Mitigation:

- preserve raw evidence
- preserve reviews
- preserve interventions
- preserve before/after result records

## Recommended next step after this doc set

Build in this order:

1. dedicated `admin/outcomes` surface
2. shared canonical aggregation layer
3. lesson and LO level reporting
4. evidence review persistence
5. intervention logging and monitoring
