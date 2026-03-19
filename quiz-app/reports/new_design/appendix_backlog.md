# Guided Chunk V1 Backlog Appendix

This appendix contains the execution backlog for `guided_chunk_v1`.

## Milestones

1. Runtime contract and schema
2. Runtime engine and APIs
3. Shared session UI
4. Telemetry and analysis foundations
5. Baseline comparison and launch readiness

## Core Tickets

### M1 Schema
- define lesson frame contract
- define `guided_chunk_frame` separate from old `blocks[]` lessons
- define LO contract
- define chunk contract
- define repair template contract
- define asset injection contract
- define runtime version and variant ids
- convert one real lesson into the new frame

### M2 Runtime
- start / restore session
- next-turn decision logic
- pseudo-streamed tutor-turn rendering contract
- learner-turn submission
- bounded follow-up question generation
- repair flow
- inline asset flow
- microbreak flow
- session resume
- session end summary

### M3 UI
- shared session shell
- tutor turn renderer
- learner input in same surface
- scrolling chat-style window first
- chunk transition UI
- vocab turn UI
- repair turn UI
- inline image / diagram turn UI
- microbreak exercise UI

### M4 Telemetry
- create telemetry tables
- log session lifecycle
- log chunk lifecycle
- log tutor turns
- log learner turns
- log outcomes and repairs
- log microbreak events
- learner-message first-pass classifier
- first-pass fatigue heuristic
- session summary job

### M5 Validation
- define baseline comparison lesson
- define v1 success metrics
- define rollback conditions
- build first analysis dashboard/report
- run internal pilot
- run gated external trial

## Definition Of Done

`guided_chunk_v1` is done when:
- one real lesson works end to end in the new runtime
- learner and tutor interact in one shared thread
- the new runtime uses its own frame format rather than the old block lesson object
- repair works
- bounded follow-up generation works
- inline assets work
- optional microbreak flow works
- telemetry captures session, chunk, turn, and outcome data
- the runtime can be compared against the current lesson model
