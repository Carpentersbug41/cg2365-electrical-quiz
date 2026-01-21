# Feedback UX Spec (LLM-Prompted) — Correct/Incorrect/Partial + Soft “Ding” (and Engagement Addendum)

## Goal
Deliver feedback that improves **conceptual understanding and retention** without over-explaining or turning feedback into “celebration.” Feedback should be **informational, brief, and consistent**.

Key constraint: **No follow-up questions** in the feedback step.

---

## Audio/UX: Soft “Ding” for Correct Answers
- Use a **soft, unobtrusive ding** *only* when the learner’s answer is correct.
- Purpose: **confirmation cue**, not excitement/reward.
- Keep it **subtle** (non-startling), and provide a **mute toggle** / respect device accessibility settings.
- No confetti, no big animations. Visual confirmation can be a small checkmark or subtle highlight, but keep it minimal.

---

## Language Principles (Non-Negotiables)
1. **Confirm → compress → stop**
   - Confirm correctness status.
   - Add **one high-signal sentence** that “compresses” the concept (rule/causal).
   - End feedback (no next prompt, no extra teaching).

2. **Tone: neutral and calm**
   - Avoid hype, exaggerated praise, or emotional language.

3. **Keep it short**
   - **1–2 sentences max** in most cases.
   - If a formula is necessary, keep it to the minimum required.

4. **No praise stacking**
   - Avoid: “Excellent!”, “Perfect!”, “Amazing!”, “Well done!”
   - Allowed (sparingly): “Correct.” / “Not quite.” / “Close, but not correct.”

5. **Do not reveal the full solution immediately unless required**
   - For conceptual errors: correct the misconception with a short rule/contrast.
   - For calculation errors: identify the step error + give the correct rule/formula succinctly.

---

## Feedback Templates (Use Exactly These Patterns)

### A) Correct (confident)
**Ding plays.**
> **Correct.** [One-sentence rule or causal explanation.]

Example style:
> **Correct.** In a series circuit, current is the same everywhere because there is only one path for charge.

### B) Correct but vague (needs precision)
**Ding plays.**
> **Correct.** More precisely, [refined statement].

Example style:
> **Correct.** More precisely, current is the same at every point in a series circuit, not just at the supply.

### C) Incorrect (conceptual misconception)
**No ding.**
> **Not quite.** [Name the misconception plainly.] **In fact,** [correct rule in one sentence].

Example style:
> **Not quite.** Voltage does not stay the same in series. **In fact,** voltage divides across components while current stays constant.

### D) Incorrect (method / calculation error)
**No ding.**
> **Incorrect.** [Identify the wrong step.] **Rule:** [correct method in one sentence or minimal formula].

Example style:
> **Incorrect.** You combined resistances the wrong way. **Rule:** in series, total resistance is the sum of all resistors.

### E) Near-miss / common confusion (contrast needed)
**No ding.**
> **Close, but not correct.** [Wrong intuition.] **Correct idea:** [contrast statement].

Example style:
> **Close, but not correct.** Current does not split in series. **Correct idea:** current splits only in parallel circuits.

### F) Safety-critical / procedural violation (if applicable)
**No ding.**
> **Incorrect.** This breaks the safety rule that [rule]. **Correct rule:** [rule in one sentence].

Keep this strictly factual and direct.

---

## “What Not To Do” (Explicitly Disallowed)
- Confetti, fireworks, big animations on correct answers
- Excessive praise (“Excellent”, “Perfect”, “You’re a star”)
- Long paragraphs after a correct answer
- “Try again” with no information
- Giving the full answer without identifying the misconception (for conceptual errors)
- “Completion = mastery” language (“You’ve finished this topic” without evidence of mastery)

---

# Engagement Addendum (Return Usage Without Sabotaging Learning)

## Purpose
We want Duolingo-level “return usage” *without* replacing learning with dopamine theatre. Engagement mechanics are allowed **only** when they reinforce **learning behaviors** (retrieval, spacing, mastery), not tapping or completion.

## Engagement Rules (Non-Negotiables)
1. **Soft ding stays** (Correct = confirmation cue). No celebration effects.
2. **Progress must reflect mastery, not completion**
   - Progress increases when learners succeed on **retrieval**, including **spaced** returns.
   - Do not award meaningful progress for simply finishing a page.
3. **Streaks are allowed only if tied to learning behavior**
   - ✅ “Completed today’s scheduled retrieval set”
   - ❌ “Opened the app” or “Tapped through lessons”
4. **Micro-goals over hype**
   - Show clear, small targets (e.g., “Today: 6 questions / ~4 minutes”) to reduce friction.
5. **Praise is optional and capped**
   - Default tone is neutral (“Correct.”)
   - If encouragement is needed (e.g., younger GCSE learners): allow **one mild phrase max** (“Correct — key rule.”), never stacked, never “perfect/amazing.”
6. **Avoid variable reward loops**
   - No surprise confetti, loot-box randomness, or big celebration on correctness.
7. **Calm UI ≠ dull**
   - Reduce friction, start fast, keep goals clear, and make payoff visible (mastery-based progress).

## Summary Rule
Engagement mechanics must **increase the frequency of retrieval and spaced review**, not distract from them.
