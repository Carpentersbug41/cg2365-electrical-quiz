# V1 vs Dynamic Prompt Gap Report

## Summary

The current dynamic pipeline is not mainly failing because the model lacks lesson context. It is failing because later-stage prompts still allow the model to write explanatory or abstract prose where the learner needs a direct task.

The V1/authored lessons work better because they are:

- direct
- operational
- stepwise where needed
- explicit about the target
- consistent between lesson design and scoring

The dynamic prompts, especially in later stages, still encourage:

- indirect phrasing
- pedagogical narration instead of learner tasks
- abstract descriptions of what the learner should do
- weaker alignment between prompt contract and scoring contract

## What V1 Does Better

### 1. It names the learner task directly

V1 uses wording like:

- `Calculate the total Earth Fault Loop Impedance (Zs).`
- `State the formula used to calculate...`
- `Identify the values for Ze, R1, and R2...`

Dynamic often uses wording like:

- `Following the chain of causality...`
- `What is the technical term for...`
- `Explain how this leads to...`

That makes the task less clean.

### 2. It uses explicit scaffolding

V1 guided practice often contains:

- a scenario
- ordered prompts
- one operation per prompt

Dynamic later tasks often compress the whole teaching move into one question.

### 3. It uses domain language instead of paraphrase language

V1 says:

- `voltage drop`
- `resistivity`
- `calculate`
- `state the formula`

Dynamic sometimes says:

- `loss of electrical pressure`
- `chain of causality`

That adds noise instead of helping the learner.

### 4. It keeps question shape and expected task shape aligned

V1 questions clearly signal whether the learner should:

- identify
- state
- calculate
- explain

Dynamic later prompts still allow semantically blurred task forms.

## Main Prompt Design Conclusions

### Generation prompts should do this

- ask for direct learner tasks
- name the exact concept, value, system, instrument, or relationship
- prefer plain subject language over metaphor
- separate teaching prose from learner questions
- prefer one clear task over “pedagogical” wording

### Generation prompts should not do this

- describe the educational move instead of the learner task
- ask for abstract “technical term for what is happening” phrasing unless the target is explicitly named
- encourage long causal-chain wording in guided practice or integrative tasks
- rely on hidden scoring preferences that are not in the prompt contract

## Prompt Rewrite Direction

### Phase 1-4

Keep:

- structured planning
- vocabulary
- explanation
- basic checks

But use simpler, plainer language throughout.

### Phase 5

Worked example should explicitly model the same kind of task the learner will do next.

### Phase 6

This is the main problem area.

Guided practice should ask for:

- one concrete scenario
- one direct learner task
- one named target

Practice should ask for:

- one concrete independent task
- one named target

No indirect or pedagogical prose should appear in the final learner question.

### Phase 7

Integrative tasks should ask for:

- one synthesis question
- one named relationship or applied idea

Not a long bundled explanation prompt unless the prompt explicitly asks for a multi-part response.

### Phase 8

Spaced review should stay short, direct, and recall-focused.

## Scoring Implication

Scoring should represent the generation contract, not a stricter hidden contract.

That means:

- awkward wording = soft deduction
- unclear or generic learner task = hard problem
- bundled or structurally broken task = major problem

## Recommended Implementation Principle

For every prompt in the dynamic pipeline, ask:

`Would this wording produce the kind of learner-facing task that the V1/authored lesson would actually use?`

If not, rewrite it toward:

- direct
- explicit
- operational
- domain-first
