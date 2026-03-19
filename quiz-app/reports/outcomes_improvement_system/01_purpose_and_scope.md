# Purpose And Scope

## Core statement

The outcomes improvement system exists to measure whether the app's instructional design produces real learning, and to identify what parts of the product should be changed to improve retention, transfer, mastery, and reliability.

## Why we are doing this

The app is already more than a quiz tool. It includes:

- lesson delivery
- quiz and practice flows
- review scheduling
- mastery tracking
- admin generation and QA flows

That means the product can influence learning outcomes in many ways. Without a disciplined outcomes system, the team can easily mistake:

- more activity for more learning
- easier questions for better teaching
- higher completion for better retention
- more hints for better understanding

This system is intended to prevent those errors.

## What this system is for

- measuring instructional effectiveness of the product
- detecting where the product helps or harms learning
- identifying weak lessons, weak question types, weak review flows, and weak UX patterns
- recording product conclusions and the changes made because of them
- evaluating whether those changes improved outcomes

## What this system is not for

- a student leaderboard
- a vanity analytics dashboard
- a replacement for teacher judgment
- a system whose main purpose is to push up short-term scores by making tasks easier
- a causal research lab with full experimental certainty

## Primary users

- product owner
- developer
- instructional designer
- admin reviewing curriculum performance

## Secondary users

- tutor or curriculum lead using lesson and LO level breakdowns
- pilot partner reviewing institutional outcomes

## Product principle

The system optimizes for:

`better app design -> better learning conditions -> better learner outcomes`

It does not optimize for:

`more dashboard activity -> nicer looking numbers`

## Scope of the first serious build

The first proper build should support:

- learner outcome measurement using existing runtime data
- lesson and LO breakdowns
- retention and transfer proxies that are explicit and conservative
- persisted evidence review notes
- persisted intervention log entries
- before/after monitoring windows for each intervention

## Out of scope for the first build

- fully automated design-change deployment
- full experiment randomization engine
- highly inferential claims about causality
- complex predictive learner scoring
- institution-specific benchmarking models

## Success criteria

The system is successful when the team can answer:

- Which lesson formats produce weak retention?
- Which review patterns actually recover forgotten material?
- Which LO areas consistently fail to reach mastery?
- Which product changes improved learning signals after release?
- Which changes should be kept, revised, or rolled back?
