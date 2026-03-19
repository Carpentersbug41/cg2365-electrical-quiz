# AI Improvement System

## Purpose

This document defines how the platform improves itself over time through a controlled AI-led product loop.

## Core Principle

The AI improves the app from:
- research evidence
- behavioural telemetry
- learning outcomes
- product constraints

The AI must not redesign the app from:
- intuition alone
- anecdotes
- engagement-only metrics
- unconstrained autonomy

## Improvement Loop

1. collect runtime and outcome data
2. generate structured reports or query stable views
3. analyze patterns
4. identify likely causes
5. propose bounded changes
6. classify risk
7. ship a versioned variant or reject the change
8. compare against baseline
9. keep, refine, or roll back

## Modes

### Report mode
Use structured reports as the standard input to analysis.
Best default mode.

### Direct DB mode
Use direct inspection only when a report is insufficient.
Read-only by default for analysis.

## What The AI May Change Safely

Default low-risk change domains:
- prompt wording
- tutor tone
- repair phrasing
- chunk presentation
- reveal timing
- microbreak timing experiments
- bounded layout refinements

## What The AI Must Not Change Autonomously

Without explicit approval, the AI must not directly change:
- grading standards
- pass/fail thresholds
- diagnostic gates
- curriculum coverage rules
- privacy rules
- experiment evaluation criteria

## Experiment Rules

Every meaningful change must have:
- `change_id`
- `variant_id`
- hypothesis
- expected effect
- primary metric
- secondary metrics
- rollback rule

Change only a small number of variables at once.

## Evaluation Priority

Use this priority order:
1. learning outcomes
2. productive persistence
3. fatigue and friction
4. engagement

The system must not optimize engagement at the expense of learning.

## Required Traceability

Keep a history of:
- prompt versions
- runtime versions
- layout variants
- report ids
- change records
- rollback decisions

Current implementation status:
- guided runtime already logs lesson version, runtime version, and variant id in telemetry
- guided admin now has a DB-backed experiment registry:
  - `gc_experiments`
  - `gc_experiment_changes`
- experiment performance can now be compared against baseline variants in guided admin
- experiment status can now be moved through active/completed/rolled_back/cancelled in guided admin
- AI-change-quality measurement is now partially implemented through:
  - experiment deltas
  - win/loss/mixed/inconclusive classification
- still missing:
  - mature automatic decision rules
  - rollback automation

## Standard Output Format For AI Analysis

For each issue:
- problem
- evidence
- likely cause
- research basis
- proposed change
- change type
- risk level
- expected effect
- metric to watch
- rollback condition

## Relationship To Other Docs

- `telemetry_and_analysis_spec.md` defines the evidence source
- `appendix_report_template.md` defines the standard analysis input
- `appendix_change_log_template.md` defines how shipped changes are recorded
