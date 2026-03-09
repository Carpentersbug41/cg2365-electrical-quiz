# Additional Research Agenda For New Lesson Runtime UI

Date: 2026-03-08
Project: hs_quiz / quiz-app
Status: Research-to-design brief

## 1. Purpose

This document covers the next layer of research that matters for the new staged lesson platform.

The aim is not only to summarize the evidence. The aim is to connect each research area to:
- concrete product decisions
- concrete UI implications
- concrete telemetry fields so the team can learn from usage data

This document assumes the new runtime is:
- chunked
- conversational
- retrieval-first
- adaptive within a bounded lesson frame
- instrumented from day one

## 2. Executive Summary

The highest-value research areas for this platform are:
1. self-explanation
2. desirable difficulty vs overload
3. misconception repair
4. fatigue detection
5. mastery thresholds
6. domain-specific vocabulary instruction
7. session length and stopping points
8. attention restoration through microbreak exercises
9. personalization by prior knowledge
10. motivation, trust, and persistence in conversational tutors
11. adaptive spacing and review timing
12. transfer assessment
13. UI pacing and reveal effects

Most important overall conclusion:
The evidence continues to favor structured adaptive tutoring over freeform tutoring. The best design path is to make the system responsive, but keep the pedagogic path constrained and measurable.

## 3. Research Areas

### 3.1 Self-explanation

What the research says
- Self-explanation is often effective, especially for transfer and principled understanding, but it is not universally beneficial in all forms.
- A review by Rittle-Johnson and Loehr argues that self-explanation works under constraints: prompts must align to the intended learning outcome, and poorly targeted explanation prompts can draw effort away from more important information.
- Rittle-Johnson (2006) found self-explanation and direct instruction both helped; self-explanation especially supported transfer.
- Research comparing written explaining formats suggests self-explaining can be more effective than writing explanations for a fictitious other, and oral explanation may outperform written explanation in some contexts.

Implications for this product
- The tutor should sometimes ask learners to explain, but not after every turn.
- Explanation prompts should be used when the goal is transfer, principle abstraction, or concept integration.
- Do not require long written explanations after every chunk.
- Use short explanation prompts such as:
  - "Why does that happen?"
  - "Say that in your own words."
  - "What tells you this is the right rule?"

UI implications
- Add a distinct `explain` turn type, used sparingly.
- Keep explanation prompts short and bounded.
- Prefer explanation after the learner has at least some foothold, not as the very first move on new content.

What to record
- whether an explanation prompt was shown
- explanation prompt type
- response length
- semantic relevance
- later transfer-question performance
- whether explanation improved later recall or deeper-question success

Design question to answer with telemetry
- Which explanation prompt types produce better later transfer without increasing dropout?

### 3.2 Desirable difficulty vs overload

What the research says
- Desirable difficulties can improve long-term learning, but only when challenge remains productive rather than overwhelming.
- Review work on desirable difficulty emphasizes that effortful learning can help retention, but not every difficulty is beneficial.
- Cognitive load research and the minimal-guidance literature still strongly caution against overload for novices.

Implications for this product
- The tutor should create effort, not confusion.
- Harder questions should appear when the learner has enough foundation.
- More challenge is not always better.

UI implications
- Use progressive challenge:
  - teach
  - quick recall
  - repair if needed
  - deeper challenge if ready
- Avoid chains of several hard turns with no success signal.
- Use visible progress to maintain willingness to continue through difficulty.

What to record
- question difficulty level
- learner correctness at each level
- latency change after difficulty increase
- repair rate after deeper turns
- dropout after deeper turns
- recovery after challenge

Design question to answer with telemetry
- At what point does deeper questioning stop being productive and start increasing abandonment?

### 3.3 Misconception repair

What the research says
- Refutation-based approaches have consistent support for correcting scientific misconceptions.
- A 2024 meta-analysis found a significant advantage for refutation texts over non-refutation texts in confronting scientific misconceptions.
- Prior work also suggests explicit refutation can be particularly helpful for high-confidence misconceptions.
- Not every implementation shows extra gains beyond good explanation, but the broader evidence favors making the misconception explicit and contrasting it with the correct idea.

Implications for this product
- Repair should not simply say "incorrect".
- Better repair pattern:
  1. identify the misconception
  2. explicitly contrast it with the correct rule
  3. give the shortest useful correction
  4. retest immediately

UI implications
- Repair turns should feel distinct from ordinary feedback.
- Use brief contrast cards or contrast tutor messages.
- Avoid long re-teaching unless repeated failure occurs.

What to record
- misconception code
- learner confidence proxy if available
- repair pattern used
- retest success or failure
- later recurrence of same misconception
- dropout after repair

Design question to answer with telemetry
- Which repair pattern produces the highest immediate recovery and lowest later recurrence?

### 3.4 Fatigue detection

What the research says
- There is broad evidence that digital fatigue and sustained screen-based learning strain attention, concentration, and persistence.
- Micro-break research suggests brief breaks can reduce fatigue and improve vigor, although performance effects are less reliable for cognitively demanding tasks.
- There is less direct education-specific evidence for exact behavioral fatigue markers, so the product will need to infer fatigue operationally.

Implications for this product
- Fatigue should be treated as an inferred state, not a user survey field.
- The main fatigue question is behavioural: when does performance quality start to degrade during text-heavy instruction?

UI implications
- The UI should be able to vary pace, insert microbreak exercises, and shorten the next tutor turn when fatigue risk rises.
- Very long text-only runs are a risk.

What to record
- response latency slope
- message length slope
- hint rate over time
- low-effort turns
- uncertainty markers
- inactivity gaps
- chunk word count before exit
- post-microbreak recovery

Design question to answer with telemetry
- Which session patterns reliably precede fatigue-like behaviour, and can the UI interrupt those patterns in time?

### 3.5 Mastery thresholds

What the research says
- Mastery learning as a broad approach has strong historical and practical support, but the research does not yield one universal threshold that should govern every skill and context.
- Adaptive spaced education studies suggest learning efficiency improves when already-mastered content is shown less often.
- The practical lesson is not "90% is always right"; it is that advancement and repetition should depend on observed competence and later retention.

Implications for this product
- Advancement should be based on demonstrated performance, not just exposure.
- Chunk mastery likely needs several signals, not one score.

UI implications
- The UI should support soft advancement rules:
  - advance
  - repair and continue
  - hold and retry
- Avoid visibly punitive repetition.

What to record
- first-attempt correctness
- retest correctness
- hint dependence
- later reuse success
- delayed related item performance
- number of exposures before stable success

Design question to answer with telemetry
- What combination of immediate performance signals best predicts later retention for a chunk?

### 3.6 Domain-specific vocabulary instruction

What the research says
- Science and technical vocabulary are major barriers to comprehension.
- Vocabulary is best taught selectively and in context, rather than front-loading every term.
- Good science vocabulary practice emphasizes deciding which terms require pre-teaching, which can be inferred in context, and which should be revisited through use.

Implications for this product
- Vocab should be introduced just-in-time.
- Only teach terms that are required for the next conceptual move.
- Reuse those terms later so they become functional, not decorative.

UI implications
- Use inline vocab moments, not glossary dumps.
- A vocab turn should be short and tied to the next task.
- A term card may appear briefly, then collapse into the thread.

What to record
- term introduced
- where in the chunk it was introduced
- later correct use of the term
- confusion with neighboring terms
- dropout or repair around vocab-heavy chunks

Design question to answer with telemetry
- Which vocab placement pattern leads to better later term use: before chunk, inline during chunk, or immediately after chunk?

### 3.7 Session length and stopping points

What the research says
- There is no universal ideal lesson duration, but the evidence on fatigue, segmentation, and break-taking suggests sessions should respect attentional limits.
- Long self-regulated study periods often benefit from structured or semi-structured breaks.

Implications for this product
- The lesson format needs natural stopping points.
- A single LO may sometimes need to span multiple short sessions.

UI implications
- Build meaningful session boundaries.
- Allow clean stopping at chunk boundaries.
- Consider resumable sessions rather than forcing a full LO in one sitting.

What to record
- session duration
- chunk where users stop voluntarily
- whether they return later
- performance before and after long sessions
- retention by session length band

Design question to answer with telemetry
- What session length and chunk count maximize completion and retention without increasing fatigue markers?

### 3.8 Microbreak exercises and attention restoration

What the research says
- Short breaks reliably improve vigor and reduce fatigue, but effects on performance are smaller and depend on task demands.
- Highly demanding tasks may require more than a tiny break for performance benefits.
- Short microbreaks can still be useful for restoring attention and reducing strain.

Implications for this product
- Microbreak exercises should be justified as fatigue-management and task-variation tools, not as entertainment.
- They should interrupt long text runs or demanding repair sequences, not appear constantly.

UI implications
- Keep microbreak exercises brief.
- Place them after sustained text-heavy explanation or heavy repair.
- Make them easy to complete and clearly connected to the lesson.

What to record
- exercise type
- placement after chunk index
- completion or skip
- time spent
- next-turn latency
- next-turn answer quality
- dropout after exercise vs no exercise

Design question to answer with telemetry
- Which microbreak exercise types and timings best restore next-turn performance?

### 3.9 Personalization by prior knowledge

What the research says
- Expertise-reversal work shows that support that helps novices may become redundant for stronger learners.
- Adaptive systems are most defensible when they personalize based on demonstrated knowledge and performance rather than broad learner-style assumptions.

Implications for this product
- Prior knowledge should influence:
  - chunk size
  - amount of direct explanation
  - amount of scaffolding
  - use of worked examples
  - deeper-question timing

UI implications
- Do not expose this as "learning styles".
- Adapt support behind the scenes.
- Stronger learners may need faster pacing and fewer scaffolds.

What to record
- entry diagnostic performance
- early chunk performance
- hints needed
- repair frequency
- eventual retention
- support level shown

Design question to answer with telemetry
- Which runtime adjustments by prior knowledge improve learning efficiency without hurting weaker learners?

### 3.10 Motivation, trust, and persistence in conversational tutors

What the research says
- Reviews of pedagogical agents and educational chatbots generally show small positive effects on learning and motivation, but design details matter heavily.
- Trust in chatbots depends on user factors, system attributes, interaction quality, and context.
- A 2024/2025 umbrella review of pedagogical agents found positive effects are generally small and context-dependent.
- Some recent experimental work suggests emotional feedback can improve engagement, while added agent features can sometimes slightly hurt transfer if distracting.

Implications for this product
- The tutor should feel supportive and human enough to sustain interaction, but not so performative that it becomes a distraction.
- Tutor tone and responsiveness matter.

UI implications
- Keep the tutor natural and direct.
- Use emotional feedback lightly.
- Avoid over-designed agent theatrics that may distract from learning.

What to record
- tutor style / prompt profile id
- learner persistence after error
- recovery after gentle vs neutral feedback
- session duration by tutor style
- dropout by tutor style
- message sentiment / frustration markers

Design question to answer with telemetry
- Which tutor tone increases persistence after wrong answers without reducing transfer?

### 3.11 Adaptive spacing and review timing

What the research says
- Spacing and testing remain among the best-supported learning effects.
- Adaptive spaced systems can improve learning efficiency by reducing repeated exposure to already-mastered material while maintaining outcomes.

Implications for this product
- The runtime should connect chunk performance to later review scheduling.
- A concept taught in-chunk should come back later at an interval informed by performance.

UI implications
- The runtime should not end at chunk completion; it should feed later reviews.
- Review should feel connected to past struggle, not random.

What to record
- chunk performance summary
- next review due date
- review completion
- review correctness
- spacing interval
- whether failure in review was predicted by weak chunk performance

Design question to answer with telemetry
- Which chunk-level signals best predict how soon a concept should be reviewed again?

### 3.12 Transfer assessment

What the research says
- Near transfer and far transfer are distinct and should not be conflated.
- Self-explanation and deeper questioning are often more relevant to transfer than to simple recall.

Implications for this product
- The platform should separately measure:
  - immediate recall
  - near transfer
  - later transfer

UI implications
- Not every chunk needs a transfer task.
- The runtime should reserve deeper questions for moments where transfer matters.

What to record
- whether a deeper or transfer question was shown
- performance on that question
- later related transfer-item performance
- dropout after deeper turns

Design question to answer with telemetry
- Which chunks benefit from deeper questions, and which are better kept at recall level first?

### 3.13 UI pacing and reveal effects

What the research says
- Segmentation is supported; theatrical streaming as such is not strongly established as a learning mechanism.
- Some learner control over pace can help, but learners do not always regulate pace well on their own.

Implications for this product
- Progressive reveal is defensible as a pacing tool.
- Streaming should be treated as a UX experiment, not a scientific learning guarantee.

UI implications
- Allow bounded pacing control:
  - continue when ready
  - speed up reveal
  - replay last tutor turn
- Do not force long unskippable reveal animations.

What to record
- streamed vs non-streamed turn
- reveal duration
- speed-up used
- replay used
- latency and correctness after each variant
- dropout by reveal style

Design question to answer with telemetry
- Does progressive reveal help weaker learners enough to justify its cost for stronger learners?

## 4. Cross-Cutting Telemetry Recommendations

To use this research for UI design, the system should log the following cross-cutting fields consistently:
- `runtime_version`
- `variant_id`
- `chunk_id`
- `chunk_index`
- `chunk_word_count`
- `tutor_state`
- `question_type`
- `difficulty_level`
- `support_level`
- `microbreak_type`
- `response_latency_ms`
- `learner_word_count`
- `classification_label`
- `correctness`
- `misconception_code`
- `repair_triggered`
- `hint_used`
- `session_duration_ms`
- `exit_chunk_index`
- `delayed_review_outcome`

## 5. Highest-Value UI Experiments

Based on the research, the first UI experiments worth running are:

1. Chunk size
- compare shorter vs longer chunks
- outcome: dropout, fatigue, recall, repair

2. Explanation prompt frequency
- compare sparse vs frequent explanation prompts
- outcome: transfer, dropout, answer quality

3. Repair format
- direct correction vs contrast prompt vs mini worked example
- outcome: immediate recovery, later recurrence, persistence

4. Microbreak timing
- after chunk 2 vs after chunk 3 vs only after repair-heavy sequences
- outcome: next-turn quality, fatigue, completion

5. Reveal pacing
- streamed vs fast reveal vs click-to-reveal
- outcome: persistence, latency, correctness, skip behavior

6. Tutor tone
- neutral-direct vs warm-supportive
- outcome: persistence after errors, frustration markers, completion, transfer

## 6. Research-Informed Priorities For Build

If resources are limited, prioritize evidence areas in this order:

1. misconception repair
2. fatigue detection
3. mastery thresholds
4. self-explanation prompts
5. microbreak exercise timing
6. prior-knowledge adaptation
7. reveal / pacing UI
8. tutor tone and trust
9. session stopping structure
10. vocabulary placement
11. spacing rules
12. transfer measurement refinement

Why this order
- The first five directly affect whether the runtime teaches effectively and whether learners stay in it.
- The later items matter too, but are less foundational to the first usable version.

## 7. Recommendation

Use this research as a measurement plan, not just a reading list.

For every major UI or runtime decision, the team should write down:
- what the theory predicts
- what event data will test it
- what success and failure would look like

That is how the new platform becomes evidence-led rather than intuition-led.

## 8. Sources

1. Rittle-Johnson B. Promoting transfer: effects of self-explanation and direct instruction. Child Development. 2006.
https://pubmed.ncbi.nlm.nih.gov/16460521/

2. Rittle-Johnson B, Loehr A. Eliciting explanations: Constraints on when self-explanation aids learning. Psychonomic Bulletin & Review. 2017.
https://pubmed.ncbi.nlm.nih.gov/27368627/

3. Hoogerheide V, et al. Learning by writing explanations: Is explaining to a fictitious student more effective than self-explaining? Learning and Instruction. 2021.
https://www.sciencedirect.com/science/article/pii/S0959475220307337

4. Nelson A, Eliasz KL. Desirable Difficulty: Theory and application of intentionally challenging learning. Medical Education. 2023.
https://pubmed.ncbi.nlm.nih.gov/35950522/

5. Kirschner PA, Sweller J, Clark RE. Why minimal guidance during instruction does not work. Educational Psychologist. 2006.
https://dspace.library.uu.nl/handle/1874/16899

6. Beker K, et al. Refutations in science texts lead to hypercorrection of misconceptions held with high confidence. Contemporary Educational Psychology. 2015.
https://www.sciencedirect.com/science/article/pii/S0361476X15000235

7. Guzzetti et al. The effectiveness of refutation text in confronting scientific misconceptions: A meta-analysis. Educational Psychologist. 2024.
https://www.tandfonline.com/doi/full/10.1080/00461520.2024.2365628

8. Albulescu P, et al. Give me a break! A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance. PLoS One. 2022.
https://pmc.ncbi.nlm.nih.gov/articles/PMC9432722/

9. Lee KE, et al. 40-second green roof views sustain attention: The role of micro-breaks in attention restoration. Journal of Environmental Psychology. 2015.
https://www.sciencedirect.com/science/article/pii/S0272494415000328

10. Kerfoot BP. Adaptive spaced education improves learning efficiency: a randomized controlled trial. Journal of Urology. 2010.
https://pubmed.ncbi.nlm.nih.gov/20022032/

11. Hu J, Xiao W. What are the influencing factors of online learning engagement? A systematic literature review. Frontiers in Psychology. 2025.
https://pubmed.ncbi.nlm.nih.gov/40166394/

12. Schroeder NL, Davis RO, Yang E. Designing and Learning With Pedagogical Agents: An Umbrella Review. Journal of Educational Computing Research. 2024/2025.
https://par.nsf.gov/biblio/10591783-designing-learning-pedagogical-agents-umbrella-review

13. Li et al. The facts about the effects of pedagogical agents on learners' cognitive load: a meta-analysis based on 24 studies. 2025.
https://pubmed.ncbi.nlm.nih.gov/40777219/

14. Kuhail MA, et al. Interacting with educational chatbots: A systematic review. Education and Information Technologies. 2023.
https://link.springer.com/article/10.1007/s10639-022-11177-3

15. Trust in AI chatbots: A systematic review. Telematics and Informatics. 2025.
https://www.sciencedirect.com/science/article/abs/pii/S0736585325000024

16. Strategies for Vocabulary Instruction in Science. American Museum of Natural History.
https://www.amnh.org/learn-teach/curriculum-collections/integrating-literacy-strategies-into-science-instruction/vocabulary-instruction
