**Pedagogy Overview (Plain Language)**

This document explains how learning works in the app, why we designed it this way, and what benefit learners get.  
It is written for non-specialists.

This design is based on the research summarized in:
- `reports/app_des/txt/research summary.txt`
- `reports/app_des/txt/research.txt`

Important design principle:
- The pedagogy was researched and defined first.
- The app was then built to implement that pedagogy.
- In other words, the pedagogy drives the product design, not the other way around.

## What This App Is Trying To Do
- Build real understanding, not just short-term quiz scores.
- Improve long-term memory through repeated recall over time.
- Reduce false confidence ("I thought I knew it").
- Support exam performance and practical accuracy.

## The Core Teaching Model
We follow a repeated learning loop:
1. Teach the key idea briefly.
2. Ask the learner to recall or explain.
3. Detect errors or misconceptions.
4. Give targeted feedback.
5. Re-test the learner.
6. Revisit later (spacing).
7. Unlock next content only after evidence of mastery.

## What Is Implemented In The App Now

### 1) Retrieval First (not passive consumption)
What this means:
- The learner must pull the answer from memory before seeing help or answers.
- This is "active recall," not just re-reading notes.

Good example:
- "Explain why this answer is correct in your own words before moving on."

Bad example:
- "Tap to reveal answer" immediately, then move on.

How we know this is good:
- Practice testing/retrieval is one of the most reliable methods for durable learning and exam performance [R1][R2].

How this app implements it:
- Typed responses are required in many practice flows.
- Attempt-first behavior is enforced before full answers.

### 2) Corrective Feedback + Mandatory Correction
What this means:
- Feedback is not just "right/wrong."
- Learners must process the mistake and attempt a correction.

Good example:
- "You chose B. Before seeing the answer, explain what you now think is correct."

Bad example:
- Show correct option immediately after a wrong click.

How we know this is good:
- Feedback has stronger effects when it is specific and used to guide correction, not just score reporting [R3][R4].

How this app implements it:
- In immediate-feedback quiz mode, wrong MCQ answers require a correction attempt before reveal.
- Continue is blocked until correction is submitted.

### 3) Worked Example -> Guided Practice -> Independent Practice
What this means:
- First: show a clean model ("I do").
- Next: learner does similar steps with support ("We do").
- Then: learner solves independently ("You do").

Good example:
- Step-by-step model, then mirrored guided steps, then no-scaffold practice.

Bad example:
- Throwing novices into fully independent problems immediately.

How we know this is good:
- Worked examples help novices build schemas, and fading support improves transfer to independent solving [R5][R6].

How this app implements it:
- `Worked Example`, `Guided Practice`, and `Practice` blocks are standard.
- Guided support now fades by step; later steps require more independent attempts before hints/reveal.
- Generation validation now flags major worked/guided step mismatch as an error.

### 4) Answer Reveal Is Not a Free Exit
What this means:
- If an answer is revealed, the learner must still prove understanding.

Good example:
- Reveal answer -> mandatory transfer-style verification check -> continue only if passed.

Bad example:
- Reveal answer and auto-mark the item as complete.

How we know this is good:
- Avoids "illusion of competence" and preserves retrieval effort, which is key for retention [R1][R7].

How this app implements it:
- Guided/practice/spaced blocks require mandatory verification after reveal.
- Progress is blocked until verification succeeds.

### 5) Mastery Gating Across Lessons
What this means:
- Progression is unlocked by demonstrated learning, not by time spent.

Good example:
- Pass now -> mastery pending -> delayed retest -> mastery achieved.

Bad example:
- "Completed lesson" automatically unlocks everything.

How we know this is good:
- Mastery learning improves outcomes, especially by preventing gaps from accumulating [R8].

How this app implements it:
- Lessons are locked until previous lesson mastery.
- First pass sets mastery pending.
- Delayed success confirms mastery.

### 6) Socratic Questioning Tied To Misconceptions
What this means:
- The tutor asks targeted reasoning questions based on known misconceptions.

Good example:
- "You seem to be using a parallel rule in a series problem. What rule applies here and why?"

Bad example:
- Generic "Why?" prompts with no error model.

How we know this is good:
- Dialogue tutoring can improve deeper understanding when questioning is structured and diagnostic [R9][R10].

How this app implements it:
- One-question-at-a-time Socratic flow.
- Misconception map extracted from lesson metadata.
- Difficulty and intent adapt by evidence; wrong answers can trigger mandatory repair/retest loops.

### 7) Spacing + Review Scheduling
What this means:
- Learners re-encounter key ideas after delays (not just in one sitting).

Good example:
- Learn today -> short delayed review tomorrow/this week -> re-check again later.

Bad example:
- One-and-done lesson with no planned return.

How we know this is good:
- Distributed practice (spacing) is a high-confidence finding for long-term retention [R11][R12].

How this app implements it:
- Quiz completion schedules future review.
- Spaced review blocks exist.
- Delayed retest is part of mastery confirmation.

## Practical Examples

### Example A: Wrong MCQ in lesson quiz
1. Learner selects wrong option.
2. App marks it incorrect but does not reveal answer yet.
3. Learner writes a correction attempt.
4. App then reveals answer and explanation.
5. Learner continues.

Benefit: the learner must process the mistake, not skip past it.

### Example B: Guided calculation step
1. Learner attempts step and gets it wrong.
2. They receive targeted feedback.
3. If still stuck, hint/reveal unlocks only after enough attempts (more attempts required on later steps).
4. If reveal is used, verification must be passed.

Benefit: scaffolding fades and independence increases.

### Example C: Delayed mastery
1. Learner passes a lesson quiz today.
2. Status becomes mastery pending.
3. After delay, learner must pass retest.
4. Only then is mastery achieved and progression fully confirmed.

Benefit: confirms durable learning, not short-lived performance.

## What We Deliberately Avoid
- Over-reliance on MCQ recognition only.
- Ungated "next, next, next" progression.
- Immediate answer-giving without learner effort.
- Shallow gamification that rewards speed without thinking.
- Treating completion as mastery.

## Current Strengths And Remaining Work

### Strong now
- Retrieval-focused flow.
- Mandatory correction and post-reveal verification.
- Mastery gating with delayed confirmation.
- Misconception-aware Socratic loop.
- Stronger fade guidance than before.

### Next improvement priority
- Make due spaced reviews more central in the default learner path ("due reviews first"), not just available in review components.

## Why This Matters
Many apps create confidence without competence.  
This app is designed to require evidence of understanding over time, which improves retention, transfer, and safer practical performance.

## Summary (Quick Version)
- The app uses evidence-based methods: retrieval, feedback, fading scaffolds, spacing, Socratic repair, and mastery gating.
- Learners must attempt, correct, and re-test; they cannot bypass learning with quick answer reveals.
- Progression depends on demonstrated understanding, including delayed checks.
- This design is built for durable learning, not just completion metrics.

## References (cited in text)
- [R1] Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). *Improving Students' Learning With Effective Learning Techniques*. Psychological Science in the Public Interest, 14(1), 4-58.
- [R2] Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). *Rethinking the Use of Tests: A Meta-Analysis of Practice Testing*. Review of Educational Research.
- [R3] Shute, V. J. (2008). *Focus on Formative Feedback*. Review of Educational Research, 78(1), 153-189.
- [R4] Wisniewski, B., Zierer, K., & Hattie, J. (2020). *The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research*. Frontiers in Psychology.
- [R5] Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). *Why Minimal Guidance During Instruction Does Not Work*. Educational Psychologist, 41(2), 75-86.
- [R6] Barbieri, C. A., et al. (2023). *A Meta-analysis of the Worked Examples Effect on Mathematics Performance*. Educational Psychology Review.
- [R7] Baker, R. S., et al. (2008). *Gaming the System: Behavior in Computer-Based Learning Environments*. International Journal of Artificial Intelligence in Education.
- [R8] Kulik, C.-L., Kulik, J. A., & Bangert-Drowns, R. L. (1990). *Effectiveness of Mastery Learning Programs: A Meta-Analysis*. Review of Educational Research.
- [R9] Graesser, A. C., et al. (2004). *AutoTutor: A tutor with dialogue in natural language*. Behavior Research Methods, Instruments, & Computers.
- [R10] VanLehn, K. (2011). *The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems*. Educational Psychologist.
- [R11] Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). *Distributed practice in verbal recall tasks: A review and quantitative synthesis*. Psychological Bulletin.
- [R12] Vlach, H. A., & Sandhofer, C. M. (2012). *Distributing Learning Over Time: The Spacing Effect in Children's Acquisition and Generalization of Science Concepts*. Child Development.
