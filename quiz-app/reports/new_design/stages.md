## Linear Guided-Discovery Instruction Model

### 1. Teach one clear idea at a time

The system should begin by teaching only one concept, rule, process, or step at a time. It should not try to teach several ideas at once.

The explanation at this stage should be:
- clear
- direct
- focused
- matched to the learner's level

The goal is to give the learner an initial understanding without overloading them.

---

### 2. Ask questions immediately after teaching

After the explanation, the learner should be asked questions straight away.

The purpose of this is to make the learner actively process what they have just learned, rather than simply read it and move on.

These questions should be used to check whether the learner can:
- recall the idea
- explain it simply
- recognise it in an example
- apply it in a basic way

This stage is important because active recall and processing are stronger for memory and understanding than passive rereading.

---

### 3. Use the learner's answers as diagnostic information

If the learner answers correctly, the system can continue forward.

If the learner answers incorrectly, the system should not treat every wrong answer as the same kind of problem.

Instead, the wrong answer should be used to identify what kind of difficulty may be present. For example:
- the learner may have forgotten the explanation
- the learner may not understand a key word
- the learner may partly understand the idea but not be able to apply it
- the learner may be confused by the wording of the question
- the learner may have a deeper misconception about the concept itself

This matters because feedback should respond to the actual misunderstanding, not just the fact that the answer was wrong.

---

### 4. Move into a separate feedback stage when needed

If the learner gets the answer wrong, the system should enter a distinct feedback stage.

This feedback stage should not simply repeat the original teaching explanation with slightly different wording.

Its purpose is different:
- to reduce complexity
- to isolate the misunderstanding
- to repair understanding

This makes the feedback stage a remedial step, not just a repetition step.

---

### 5. Re-explain using much simpler language

In the feedback stage, the explanation should become much simpler than the original teaching explanation.

This means:
- simpler words
- shorter sentences
- less information at once
- stronger focus on the core idea only

The aim is to strip the concept back to the smallest meaningful version of the idea so the learner can rebuild understanding from a more basic starting point.

---

### 6. Rebuild understanding from the easiest possible check

After the simplified explanation, the system should not jump straight back to difficult questions.

Instead, it should begin with the easiest possible concept-checking question.

This first question should test only the most basic part of the idea.

Then the system should move upward gradually:
1. the simplest check
2. a slightly harder check
3. a fuller understanding check
4. a basic application check

This step-by-step rebuilding process helps the learner form understanding from the ground up.

---

### 7. Use guided discovery rather than just giving the answer

The system should not only tell the learner the right answer.

Instead, it should guide the learner toward understanding through carefully chosen questions.

This is a guided-discovery approach using Socratic questioning.

That means the system should:
- break the idea into smaller parts
- ask very simple concept checks
- help the learner notice the key feature
- guide them step by step toward the correct understanding

The goal is for the learner to think their way toward understanding, rather than passively receive correction.

---

### 8. Increase complexity gradually

Once the learner can answer the simplest checks correctly, the difficulty should increase slowly.

The system should not jump suddenly from a very easy question to a much harder one.

Instead, progression should be gradual, for example:
- recognition
- simple explanation
- clear example
- slightly changed example
- basic application

The rule is:
do not increase complexity until the learner shows understanding at the current level.

---

### 9. Continue forward once understanding is secure enough

When the learner has shown enough understanding, the system should move on to the next stage.

It should not:
- restart the whole lesson
- loop back through the full sequence
- reuse earlier prompts unnecessarily

The structure should remain linear and forward-moving.

This keeps the system simpler, clearer, and easier to manage.

---

### 10. Give each stage its own prompt

Each important part of the process should be handled by a separate prompt.

For example:
- one prompt for the intro
- one prompt for teach/check
- one prompt for basic feedback
- one prompt for deeper feedback and progression
- one prompt for worked example
- one prompt for guided or independent task stages

This makes the system easier to:
- design
- test
- debug
- refine

It also prevents a single prompt from trying to do too many jobs at once.

The prompts should stay lean.
The attachment should carry the stage-specific content.

For the current model:
- `teach_check` attachment should include the teaching facts and the 3 basic questions
- `feedback_basic` attachment should include the same concept facts, accepted basic answers, and one pre-generated deeper question
- `feedback_deeper` attachment should include the same deeper question and accepted deeper answer targets

The deeper question should not be invented on the fly by the runtime model.
It should be generated upstream as part of the attachment and stored with the section.

---

### 11. Avoid recursive loops and prompt reuse

The system should not repeatedly loop back through the same prompt structure.

It should not rely on circular logic such as:
- reteach
- retry
- reteach again
- retry again
- reuse the same prompt repeatedly

Instead, each stage should have a defined role in a fixed forward sequence.

The flow should be:

Intro -> Teach/Check -> Feedback Basic -> Feedback Deeper -> Worked Example -> Worked Example Feedback -> Guided Practice -> Practice -> Integrative -> Integrative Feedback

This keeps the architecture cleaner and avoids unnecessary complexity.

---

### 12. Full process in plain English

The model works like this:

1. Teach one small idea clearly.
2. Ask questions immediately so the learner must think about it.
3. Use the learner's answers to judge the basic recall.
4. Enter a basic feedback stage and ask the pre-generated deeper question for that section.
5. Use the learner's deeper answer to judge whether understanding is secure enough.
6. If understanding is secure, move forward into the worked example for that lesson path.
7. After the worked example, use a worked example feedback step to decide whether the learner is ready to try one themselves.
8. Then move into guided practice, then practice, then integrative close.
9. After the integrative task, use a final integrative feedback step to check whether the learner has pulled the lesson together well enough.
10. If understanding is not secure, stay on the active feedback stage and guide the learner until it is.

---

### 13. Spaced review is separate

Spaced review should not sit at the end of the main teaching arc.

In this model, spaced review is better treated as:
- prerequisite retrieval from earlier lessons
- a separate diagnostic gate
- or a later review cycle outside the live teaching sequence

That means spaced review should not be folded into the main lesson progression for this prototype.

---

### 14. Core purpose of the model

The purpose of this model is not just to deliver information.

Its purpose is to:
- teach clearly
- force active processing
- detect misunderstanding
- respond to misunderstanding in a targeted way
- rebuild understanding step by step
- keep the learning experience structured and linear

This makes it not just a teaching system, but a teaching-and-repair system.

---

### 15. Compact design summary

This model uses a linear, stage-based learning structure. One concept is taught at a time through a clear explanation. Immediately after teaching, the learner is asked questions that require recall, interpretation, and basic application, so they actively process the concept rather than passively read it. The learner's responses are then used diagnostically to judge whether understanding is secure or whether misunderstanding is present. If understanding is secure, the system continues forward into a worked example, then a worked-example readiness check, then guided practice, then independent practice, then integrative close and a final integrative feedback check. If understanding is weak, the system moves into a separate feedback stage. In this stage, the concept is re-explained using much simpler language, reduced complexity, and tighter focus on the core idea. The learner is then guided through a sequence of very simple concept-checking questions designed to rebuild understanding from the most basic level upward. Only when the learner demonstrates understanding at that level does the system gradually increase complexity again. Each stage is handled by a separate prompt, and the overall structure remains strictly linear rather than recursive. Spaced review remains separate from the live lesson arc and should be handled as prerequisite or later review logic, not as the closing lesson stage.
