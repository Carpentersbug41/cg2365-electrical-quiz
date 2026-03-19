# Governance And Decision Process

## Core rule

Never let "the AI concluded X" become the system of record by itself.

The system of record should be:

1. raw evidence
2. computed metrics
3. human-readable conclusion
4. approved intervention
5. monitored result

## Required separation

### Raw evidence

What happened in the app.

### Conclusion

What the team thinks the evidence means.

### Intervention

What the team changed in the product.

### Result

What happened after the change.

## Review cadence

Recommended cadence:

- weekly: operational review
- fortnightly: lesson and LO outcome review
- monthly: intervention review

## Decision workflow

### Step 1: Review evidence

Questions:

- Is the signal strong enough to act on?
- Is the issue lesson-specific, LO-specific, or product-wide?
- Are we looking at retention or only repeat performance?

### Step 2: Record conclusion

The conclusion should include:

- what is weak
- where it is weak
- why the team believes it is weak
- which metrics support the conclusion

### Step 3: Approve intervention

The intervention should include:

- hypothesis
- scope
- expected metric movement
- implementation reference
- monitoring dates

### Step 4: Evaluate result

Questions:

- Did primary learning metrics improve?
- Did supporting metrics improve in a way that matches the hypothesis?
- Did any new negative side effects appear?

### Step 5: Decide

Decision options:

- keep
- revise
- roll back
- gather more evidence

## Good decision examples

- "Keep the new review reminder cadence because 14-day retention improved while review backlog fell."
- "Revise the new hint flow because completion improved but transfer fell."
- "Roll back the simplified mastery quiz because first-pass scores rose but delayed retention did not."

## Bad decision examples

- "Keep the change because users were more active."
- "Keep the change because average score went up" without checking repeat effects or delayed performance.
- "The AI said the lesson is weak" with no metric or scope reference.

## Governance requirements

- interventions must have an owner
- interventions must have a monitoring window
- evidence reviews should not be deleted casually
- result summaries should remain historically visible

## Privacy requirements

- avoid storing unnecessary learner narrative in free text
- do not write subjective personal judgments about individual learners
- keep notes focused on product behavior and curriculum behavior
