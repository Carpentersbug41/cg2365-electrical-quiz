**Pedagogy Overview (Plain-Language)**

This document explains the learning design used in the app, why we chose it, and how it helps people learn. It is written for a non-technical reader.

**What We Are Trying To Achieve**
- Real understanding, not just short-term quiz performance.
- Long-term memory, so learners can still explain and apply ideas later.
- Strong exam readiness without shallow memorization.
- Safe, accurate practice for technical procedures.

**Core Learning Ideas We Use**
These are well-supported in learning science and are summarized in `reports/app_des/txt/research summary.txt`.

1. Active recall beats passive reading  
We ask learners to retrieve answers from memory. This creates stronger memory than just re-reading or watching.

2. Feedback should correct errors quickly  
We give clear feedback right after an attempt so learners can fix mistakes before they become habits.

3. Spacing improves long-term retention  
We bring back concepts after a delay so knowledge lasts beyond the lesson.

4. Mastery requires evidence, not completion  
Finishing a page is not enough. Learners must show they can recall and apply the concept later.

5. Socratic questioning builds deeper understanding  
We ask targeted questions that make the learner explain, connect, and reason, not just repeat facts.

**How The App Implements These Ideas**

**1) Short, guided lesson flow**
- Lessons present core ideas clearly and briefly.
- Worked examples show the correct method step by step.
- Guided practice follows, then independent practice.

Why this helps: it builds a mental model, then fades support so the learner can do it alone.

**2) Practice uses retrieval, not recognition**
- Many questions require typed answers, not just multiple choice.
- Learners must explain their reasoning before some answers can be submitted.

Why this helps: typing and explaining forces retrieval and deeper processing.

**3) Immediate, specific feedback**
- After an answer, the system explains what was right or wrong and what to fix.
- If the learner is wrong, the feedback points to the gap instead of just giving the answer.

Why this helps: quick correction prevents persistent misconceptions.

**4) Spaced review and delayed retest**
- After a lesson pass, a delayed retest is scheduled.
- Reviews reappear later so the learner must recall after time has passed.

Why this helps: delayed recall is the strongest test of real learning.

**5) Mastery is earned, not assumed**
- Passing once puts the learner in "mastery pending."
- True mastery is only confirmed after a later successful retest.

Why this helps: it avoids the false feeling of mastery that happens right after practice.

**6) Socratic questions for deeper thinking**
- The app asks one question at a time and adapts difficulty.
- It tracks which levels the learner can answer and adjusts upward only after strong evidence.
- It can target known misconceptions and require repair of wrong thinking before moving on.

Why this helps: learners practice explaining, not just naming facts.

**7) No quick answer escapes**
- If a learner reveals an answer, a mandatory verification check follows.
- They must answer a similar question correctly before continuing.

Why this helps: it prevents dependence on answer reveals and forces true understanding.

**Examples (Simple)**

Example 1: Electrical safety test  
Learner answers a question about safe isolation.  
If wrong, the app gives feedback on the missing step and asks a follow-up check.  
If the learner reveals the answer, they must still pass a verification check.

Example 2: Physics concept  
Learner is asked to explain why voltage drops in a series circuit.  
Socratic questions move from recall to connection to reasoning.  
Only after repeated strong answers does the level increase.

Example 3: Spaced review  
Learner passes a lesson today.  
Two days later, a short review appears.  
The learner must recall and explain again to confirm mastery.

**What We Avoid (On Purpose)**
- Endless multiple choice that only tests recognition.
- Shallow points and streaks that reward speed more than learning.
- Letting learners skip real practice by revealing answers.
- Moving on just because a page was completed.

**Why This Matters**
People often feel confident right after a lesson but forget a week later.  
Our design forces the learner to prove understanding over time, which leads to better performance and safer real-world use.

**Summary (Short Version)**
This app is designed for real learning, not just quick quizzes.  
It uses active recall, immediate feedback, spaced review, and strict mastery checks.  
Learners must explain answers, fix mistakes, and pass delayed retests.  
Even when answers are revealed, a verification check is required.  
This approach is strongly supported by learning science and leads to deeper understanding and longer retention.
