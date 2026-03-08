# First Version Scope: Brutally Narrow Definition

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: V1 scope definition

## 1. Purpose

This document defines the brutally narrow first version of the new guided lesson module.

The purpose of v1 is not to realize the full vision.
The purpose of v1 is to prove that the new runtime is worth continuing.

If v1 tries to solve everything, it will become hard to build, hard to measure, and hard to trust.

## 2. What V1 Must Prove

V1 must prove only these things:

1. learners can complete a lesson in the new runtime without increased confusion
2. the shared tutor-thread format feels more natural than the current lesson flow
3. chunk-by-chunk delivery does not reduce learning quality
4. the runtime can detect meaningful behavioural patterns
5. at least one or two targeted adaptive moves improve the session

That is enough.

V1 does not need to prove:
- full AI-autonomous redesign
- perfect personalization
- universal superiority over every existing lesson mode
- optimal pacing for every learner type
- complete solution to fatigue, motivation, and transfer in one release

## 3. The Brutally Honest V1 Principle

V1 should be a constrained conversational lesson runtime.

Not:
- a fully dynamic AI tutor
- a fully adaptive curriculum engine
- a replacement for every current lesson feature
- a giant orchestration system with dozens of states

Just:
- one good bounded runtime
- for one limited lesson format
- with strong telemetry
- measured against the current approach

## 4. V1 Must Include

### 4.1 One runtime mode only
Build exactly one new runtime mode:
- `guided_chunk_v1`

No extra lesson runtime families in v1.

### 4.2 One shared session window
The learner experience must happen in one surface:
- tutor messages
- learner replies
- repair turns
- microbreak exercises
- chunk transitions

Everything should happen in the same thread/card.

### 4.3 Pre-generated lesson frame
V1 lessons must use a bounded frame.

Each lesson should have:
- chunk teaching core
- vocab items
- candidate recall questions
- optional deeper question
- misconception / repair patterns
- optional microbreak slot

Do not generate the lesson structure live during runtime.

### 4.4 Small state machine
Use only these states in v1:
- `teach`
- `recall`
- `repair`
- `transition`
- `microbreak`
- `summary`

Do not add more states unless there is a hard need.

Specifically exclude in v1:
- elaborate branching states
- multiple Socratic sub-modes
- complex dialogue planning layers

### 4.5 One adaptation rule set
V1 should adapt in only a few ways:
- if learner is correct, advance
- if learner is partially correct or incorrect, trigger short repair
- if learner shows repeated weakness, give one more supported retry
- if chunk boundary is marked, optionally show microbreak exercise

That is enough for v1.

### 4.6 Strong telemetry from day one
V1 must log:
- session start / end
- chunk start / complete / abandon
- tutor turn rendered
- learner message submitted
- learner message classified
- turn correctness
- misconception code if available
- repair triggered
- microbreak started / completed / skipped
- exit point

If this is missing, v1 is not acceptable.

### 4.7 Link to learning outcomes
V1 must be linkable to later performance.

At minimum, connect the runtime to:
- end-of-lesson quiz performance
- related later review performance

Without that, you will only know whether the runtime feels better.

## 5. V1 Should Include If Cheap

These are good additions only if they are low-cost and low-risk:
- streamed or progressive tutor reveal
- bounded pace controls like `continue`, `speed up`, `replay`
- short vocab cards inside the thread
- one deeper question per selected chunk

These are not essential to prove the concept.

## 6. V1 Must Exclude

### 6.1 No full live lesson generation at runtime
Do not generate chunk structure, sequencing, and lesson logic live.
That will explode variability and make results hard to interpret.

### 6.2 No large-scale personalization engine
Do not build full personalization by profile, mood, pace preference, prior interest, and inferred style in v1.

Keep it simple:
- maybe slight tone variation
- maybe light support adaptation from performance

Nothing more.

### 6.3 No autonomous threshold changes
Do not let the system change:
- mastery thresholds
- pass/fail rules
- diagnostic criteria
- scoring rules

Those stay fixed in v1.

### 6.4 No complex multi-agent orchestration
Do not build separate internal agents for:
- tutor
- scorer
- fatigue detector
- planner
- evaluator
- critic

That is overbuilt for v1.

Use a simple runtime pipeline and post-hoc analytics.

### 6.5 No giant UI redesign beyond the runtime shell
Do not redesign the whole app around the new module before the new module proves itself.

V1 only needs:
- the runtime shell
- the thread UI
- the key turn components

### 6.6 No too-many-variables experiment
Do not change chunk size, tone, question count, microbreak timing, and pacing all at once.

V1 needs clean comparisons.

### 6.7 No vanity features
Exclude anything whose main value is "this feels futuristic" unless it serves a measurable learning or fatigue-management purpose.

Examples to avoid in v1:
- theatrical agent behavior
- heavy voice theatrics
- excessive animations
- decorative streaming delays
- complex avatar systems

## 7. Recommended V1 Lesson Shape

For one chunk:

1. short tutor teaching turn
2. one recall question
3. learner response
4. short tutor reaction
5. if wrong: repair + retry
6. if correct: move to next chunk
7. at selected boundaries: brief microbreak exercise

This is enough.

Do not try to make every chunk contain:
- multiple recall turns
- deeper challenge
- explanation prompt
- game
- reflection
- voice interaction
- spaced review

That will overload the runtime and muddy the evidence.

## 8. Recommended V1 Content Limits

Suggested defaults:
- teaching chunk: roughly 80-150 words
- repair turn: 20-70 words
- vocab turn: 20-60 words
- recall question count: usually 1 per chunk
- deeper question: optional, not routine
- microbreak frequency: after 2-4 chunks, not every chunk

These are starting defaults, not final truths.

## 9. Recommended V1 Comparison Strategy

Compare `guided_chunk_v1` against one clear baseline.

Baseline should be:
- current lesson runtime for the same or equivalent lesson

Primary comparison outcomes:
- completion rate
- chunk-level dropout
- repair recovery
- end-of-lesson performance
- later related review performance
- fatigue markers

Do not compare too many baselines at once.

## 10. What V1 Success Looks Like

V1 is successful if:
- learners can use it without obvious confusion
- completion is at least competitive with the current runtime
- repair cycles show meaningful recovery
- telemetry clearly shows where fatigue and dropout occur
- at least one runtime adjustment can be justified by the data

V1 is very successful if:
- delayed related performance improves
- the shared tutor-thread runtime is clearly preferred behaviourally
- microbreak exercises measurably reduce fatigue markers

## 11. What V1 Failure Looks Like

V1 has failed if:
- learners are more confused than in the current runtime
- dropout rises sharply without later retention gain
- telemetry is too weak to explain what happened
- runtime logic becomes too complex to debug
- changes cannot be tied to outcomes
- the experience feels lively but produces no measurable learning advantage

## 12. The Hard Truth

The danger is not that v1 will be too simple.
The danger is that v1 will be too ambitious.

A narrow v1 that teaches well and measures well is far more valuable than a broad v1 that looks impressive and teaches ambiguously.

## 13. Recommendation

Build v1 as a deliberately limited proof system.

What to build:
- one runtime
- one thread UI
- one small state machine
- bounded content frame
- strong telemetry
- one clean comparison against the current lesson model

What to defer:
- rich personalization
- broad autonomous redesign
- complex pacing intelligence
- major threshold changes
- large-scale UI ecosystem changes

## 14. Final Scope Statement

If a proposed feature does not help v1 answer this question, it should probably be deferred:

"Does a constrained conversational chunked runtime improve the learning experience and produce measurable evidence we can use to improve it further?"

If the answer is no, do not put it in v1.
