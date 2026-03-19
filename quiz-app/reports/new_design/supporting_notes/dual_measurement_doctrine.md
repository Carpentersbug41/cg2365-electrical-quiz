# Dual Measurement Doctrine

Date: 2026-03-09
Project: hs_quiz / quiz-app
Status: Operating doctrine

## 1. Purpose

This document defines the two distinct measurement systems used in the app.

These must not be confused.

The app measures:
1. learner performance
2. app performance

They are related, but they are not the same.

## 2. Learner Performance

Learner performance measurement is about the student.

Questions:
- what does the learner currently know?
- what are they getting wrong?
- which misconceptions recur?
- when do they need repair?
- when should spaced review be triggered?
- when are they fatiguing, guessing, or disengaging?

This measurement exists to improve instruction inside the app.

It supports:
- repair
- retries
- support level changes
- chunk progression
- vocab support
- spaced review
- microbreak exercise timing
- bounded runtime adaptation

This is instructional adaptation.

## 3. App Performance

App performance measurement is about the product itself.

Questions:
- which runtime design performs better?
- which chunk lengths create fatigue or dropout?
- which repair patterns recover learners best?
- which UI pacing choices help or hurt?
- which prompt or layout choices improve retention?
- where is the app failing pedagogically or experientially?

This measurement exists to improve the codebase and product design.

It supports:
- prompt changes
- layout changes
- runtime rule changes
- chunking changes
- pacing changes
- repair pattern changes
- telemetry heuristic changes
- bounded AI-led redesign within product constraints

This is product optimization.

## 4. Critical Distinction

A learner failure is not automatically an app failure.

A learner getting something wrong may mean:
- normal learning difficulty
- missing prerequisite knowledge
- a misconception requiring repair
- expected challenge within productive struggle

An app failure is more like:
- many learners fail at the same chunk for the same avoidable reason
- a repair pattern does not recover learners
- dropout spikes after a specific UI pattern
- fatigue rises after a specific chunk structure
- a feature adds friction without improving learning

## 5. Two Separate Loops

### 5.1 Learner loop
Use learner-performance data to improve the learner's path through the lesson.

Loop:
- observe learner behaviour
- adapt instruction within the app framework
- measure learner outcome
- feed later review and support

### 5.2 Product loop
Use app-performance data to improve the app itself.

Loop:
- observe aggregate runtime behaviour
- analyse app and runtime effectiveness
- generate recommendations
- update prompts, layout, or code
- measure the new variant
- keep, refine, or roll back

## 6. Role Of The AI

The AI may operate on both loops, but in different ways.

### 6.1 AI in learner loop
Role:
- bounded runtime adaptation
- instructional response
- repair and review decisions

Inputs:
- learner performance signals
- session state
- misconception data
- support/fatigue indicators

Output:
- in-app adaptation for that learner

### 6.2 AI in product loop
Role:
- evidence-led analysis
- redesign suggestions
- controlled prompt/runtime/UI/code changes

Inputs:
- aggregated app-performance data
- reports or database summaries
- research and pedagogic constraints
- experiment definitions and past results

Output:
- product improvements to the codebase

## 7. Non-Negotiable Rule

Do not use single-session learner failure as direct evidence that the app should be redesigned.

App-level redesign must be based on:
- aggregate patterns
- stable evidence
- outcome comparisons
- research constraints

## 8. Examples

### Example A: learner-level issue
A learner repeatedly gets resistance questions wrong.

Correct response:
- record misconception
- trigger repair
- add related spaced review
- monitor later improvement

This does not automatically imply the app is failing.

### Example B: app-level issue
Across many sessions, dropout rises sharply after chunk 3 when tutor turns exceed 170 words.

Correct response:
- record chunk-level app failure pattern
- analyze runtime structure
- propose shorter chunk or earlier microbreak exercise
- test updated variant

This is product optimization.

## 9. Success Criteria

The system is working correctly when:
- learner-performance data improves individual instruction
- app-performance data improves the product itself
- the two loops remain distinct but connected
- product redesign is driven by evidence, not anecdotes

## 10. Recommendation

Treat learner analytics and app analytics as separate layers in both the data model and the operating model.

Best terminology:
- `learner-performance measurement`
- `app-performance measurement`

Use the first to teach the learner better.
Use the second to build a better app.
