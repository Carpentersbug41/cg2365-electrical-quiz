# How Answers Are Marked

## Overview

The quiz application uses a **semantic understanding approach** powered by Large Language Models (LLMs) to evaluate student answers, rather than simple keyword matching. This allows students to express concepts in their own words while still receiving accurate feedback.

---

## Key Principle: Semantic Understanding for ALL Module Questions

### ❌ What We DON'T Do (Keyword Matching)

Traditional quiz systems use keyword matching:
- "Does the answer contain 'voltage'?" ✓
- "Does the answer contain 'divides'?" ✓
- "Does the answer contain 'series'?" ✓
- If 3/3 keywords found → Mark as correct

**Problems with keyword matching:**
- Students can game the system by listing keywords without understanding
- Different phrasing gets marked wrong even if conceptually correct
- No assessment of actual understanding
- Can't detect misconceptions

### ✅ What We DO (LLM Semantic Evaluation)

**ALL module questions** (Practice, Guided Practice, Spaced Review) use Google's Gemini LLM to evaluate whether the student **demonstrates understanding**:

- Student Answer: "In a series circuit, the potential difference splits up between the components"
- LLM evaluates: Does this show understanding of voltage distribution in series circuits?
- LLM considers: Different terminology ("potential difference" vs "voltage"), alternative phrasing, technical accuracy, numerical answers with units

**Benefits:**
- Rewards genuine understanding regardless of exact wording
- Evaluates numerical answers semantically (understands "12 ohms", "12Ω", "12 Ω" as equivalent)
- Detects and corrects misconceptions
- Provides targeted, educational feedback
- Maintains technical standards
- **Consistent marking approach** - simpler for lesson authors

---

## The Marking System Architecture

### 1. Question Types & Marking Strategies

#### Module Questions - ALL use LLM Semantic Evaluation
**Applies to:**
- **Practice Block** questions (including numerical calculations)
- **Guided Practice** step-by-step questions
- **Spaced Review** questions

**Strategy:**
- Full LLM semantic evaluation for ALL answers
- **Model:** Gemini 2.0 Flash (configured in `.env`)
- **Temperature:** 0 (maximum consistency)
- **Output:** Structured JSON with score, feedback, and correctness

**Handles all answer types:**
- Conceptual: "Explain why...", "Describe how..."
- Numerical: "Calculate resistance..." (LLM understands "12Ω", "12 ohms", "12 Ω" as equivalent)
- Short answer: "What is Rule 1?" (accepts various phrasings)

#### Diagnostic/Quiz Questions - MCQ Only (Deterministic)
**Applies to:**
- Diagnostic prerequisite quizzes
- Traditional multiple choice quizzes

**Strategy:**
- Exact option matching (A/B/C/D)
- No LLM evaluation needed
- Fast, deterministic marking

---

## LLM Marking Prompt (Technical Details)

### The Prompt Structure

The LLM receives a carefully crafted prompt containing:

1. **Role Context**: "You are an expert electrical science educator marking C&G 2365 Level 2 student answers"
2. **Question Details**: The actual question text and cognitive level being tested
3. **Model Answer**: Reference answer for comparison (NOT given to student)
4. **Student Answer**: The learner's submitted response
5. **Marking Instructions**: Explicit rules for evaluation
6. **Output Format**: Structured JSON schema
7. **Feedback Templates**: Specific patterns to follow

### Key Configuration Settings

```typescript
{
  model: "gemini-2.0-flash-exp",  // From .env: GEMINI_MODEL
  temperature: 0,                  // Maximum consistency
  responseMimeType: "application/json"  // Structured output
}
```

### Scoring Scale

- **1.0**: Fully demonstrates required understanding, technically accurate
- **0.8-0.9**: Strong understanding, minor gaps or imprecision
- **0.6-0.7**: Adequate understanding, meets minimum standard
- **0.4-0.5**: Partial understanding, significant gaps
- **0.2-0.3**: Minimal understanding, mostly incorrect
- **0.0-0.1**: Incorrect, irrelevant, or no understanding

**Pass Threshold:** Score ≥ 0.5 marks as "correct"

### Feedback Templates (Critical Rules)

#### For CORRECT Answers:
- Template: `"Correct. [One-sentence rule or causal explanation]"`
- Example: `"Correct. In a series circuit, current is the same at all points because there's only one path."`

#### For INCORRECT Answers:
- **CRITICAL**: Never give the complete answer or full solution
- **POINT and GUIDE, don't TELL**
- Template: `"Not quite. [Name misconception]. [Point toward correct concept]"`
- Example BAD: ❌ `"Not quite. In fact, voltage divides across components while current stays constant."`
- Example GOOD: ✅ `"Not quite. Voltage doesn't stay the same in series circuits. Consider what happens to voltage across each component."`

### Strict Rules Enforced

1. **Maximum 1-2 sentences** - Keep feedback concise
2. **No praise words** - Avoid "Excellent!", "Perfect!", "Amazing!", "Well done!"
3. **Neutral tone** - Use "Correct." not "Correct!" or "Great work!"
4. **Semantic not syntactic** - Award credit for understanding, not exact wording
5. **Never reveal answers** - Guide thinking, don't give solutions
6. **Technical accuracy** - Maintain C&G 2365 Level 2 standards

---

## Visual Feedback System (Color Coding)

The UI provides immediate visual feedback through color coding:

### 🟢 Green (Correct)
- **Score:** 1.0 (100%)
- **Meaning:** Fully correct, demonstrates required understanding
- **Background:** `bg-green-50` with `border-green-300`
- **Text:** `text-green-800`
- **Audio:** Soft "ding" sound (880Hz sine wave, 0.2s duration)

### 🟡 Amber (Partial Credit / Nearly Correct)
- **Score:** > 0 but < 1.0
- **Meaning:** Partially correct, some understanding but gaps
- **Common Cases:**
  - Correct numerical value but wrong/missing units (0.7 score)
  - Good understanding but imprecise terminology (0.6-0.8 score)
  - Right idea but incomplete explanation (0.5-0.7 score)
- **Background:** `bg-amber-50` with `border-amber-300`
- **Text:** `text-amber-800`
- **Audio:** None

### 🔴 Red (Incorrect)
- **Score:** 0
- **Meaning:** Incorrect or demonstrates misconception
- **Background:** `bg-red-50` with `border-red-300`
- **Text:** `text-red-800`
- **Audio:** None

---

## Audio Feedback

### Soft "Ding" for Correct Answers

When a student answers correctly, a subtle audio cue plays:

```typescript
// Web Audio API implementation
oscillator.type = 'sine';
oscillator.frequency.value = 880;  // A5 note (880Hz)
gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
// Duration: 0.2 seconds
// Volume: 0.2 (subtle but audible)
```

**Design Principles:**
- **Subtle, not celebratory** - Confirmation cue, not reward sound
- **Brief** - 0.2 seconds only
- **Clean tone** - Pure sine wave at 880Hz
- **Respectful** - No excessive celebration or distraction

---

## Error Handling & Fallbacks

### Service Availability

The system gracefully handles LLM service failures:

1. **Quota Exceeded** (429 errors)
   - Display: "⚠️ Marking service quota exceeded. Please try again in a few minutes."
   - Action: Allow retry, provide error code

2. **Model Unavailable** (404 errors)
   - Display: "⚠️ Marking model temporarily unavailable. Please try again shortly."
   - Action: Allow retry, log error

3. **Network Errors**
   - Display: "⚠️ Unable to connect to marking service. Please check your internet connection."
   - Action: Allow retry

4. **Authentication Errors**
   - Display: "⚠️ Marking service authentication error. Please contact support."
   - Action: Log error with code, contact admin

### Fallback Strategy

Only Diagnostic/Quiz MCQ questions use deterministic marking:
- MCQ: Direct option comparison (no LLM needed)

All module questions rely on LLM, with robust error handling:
- Service availability checks
- Quota management
- Graceful error messages with retry options

---

## Implementation Files

### Core Marking Logic
- **`src/lib/marking/llmMarkingService.ts`** - LLM semantic evaluation (used for ALL module questions)
- **`src/lib/marking/markingService.ts`** - MCQ marking only (used for diagnostics/quizzes)
- **`src/lib/marking/types.ts`** - TypeScript interfaces and types

### API Endpoints
- **`src/app/api/marking/route.ts`** - Simplified marking API
  - Routes MCQ questions to deterministic marker
  - Routes ALL module questions to LLM marker

### UI Components (Module Blocks)
- **`src/components/learning/blocks/GuidedPracticeBlock.tsx`** - Guided practice (LLM marked)
- **`src/components/learning/blocks/PracticeBlock.tsx`** - Independent practice (LLM marked)
- **`src/components/learning/blocks/SpacedReviewBlock.tsx`** - Spaced review (LLM marked)

### Configuration
- **`.env.local`** - Environment variables (GEMINI_MODEL, API keys)
- **`src/lib/config/geminiConfig.ts`** - Model configuration and defaults
- **`src/data/lessons/types.ts`** - Simplified lesson structure (removed deprecated fields)

---

## Why This Approach?

### Educational Benefits

1. **Encourages Understanding Over Memorization**
   - Students can't game the system by keyword stuffing
   - Must demonstrate actual comprehension

2. **Flexible Expression**
   - Students can use their own words and terminology
   - Different cultural/linguistic backgrounds accommodated

3. **Immediate, Targeted Feedback**
   - Identifies specific misconceptions
   - Points students in right direction without giving answers
   - Maintains challenge and learning opportunity

4. **Maintains Standards**
   - Technical accuracy required for C&G 2365 Level 2
   - Consistent evaluation across all students
   - No subjective teacher variation

### Technical Benefits

1. **Scalable**
   - Can evaluate unlimited students simultaneously
   - Consistent quality regardless of volume

2. **Maintainable**
   - Prompt engineering easier than maintaining keyword lists
   - Single source of truth for marking logic

3. **Adaptable**
   - Easy to adjust difficulty by modifying pass threshold
   - Can tune feedback tone and detail level
   - Model improvements automatically benefit all questions

---

## Future Enhancements

Potential improvements being considered:

1. **Adaptive Difficulty** - Adjust pass threshold based on student history
2. **Misconception Tracking** - Build student misconception profiles over time
3. **Multi-Language Support** - Evaluate answers in multiple languages
4. **Enhanced Feedback** - Provide references to specific lesson content
5. **Confidence Scores** - Surface when LLM is uncertain about marking

---

## Configuration Reference

### Environment Variables

```bash
# Required
GEMINI_MODEL=gemini-2.0-flash-exp  # Or gemini-2.0-flash-thinking-exp
GOOGLE_AI_API_KEY=your_api_key_here  # For Google AI Studio

# Optional
GEMINI_FALLBACK_MODEL=gemini-1.5-flash  # Fallback if primary unavailable
```

### Tuning Parameters

Located in marking service files:

```typescript
// Pass threshold (0.0 to 1.0)
const PASS_THRESHOLD = 0.5;

// Numeric tolerance
const DEFAULT_TOLERANCE = 0.01;  // 1%

// Partial credit for units
const UNITS_PARTIAL_CREDIT = 0.7;  // 70%

// Audio feedback
const DING_FREQUENCY = 880;  // Hz
const DING_DURATION = 0.2;   // seconds
const DING_VOLUME = 0.2;     // 0.0 to 1.0
```

---

## Summary

The marking system prioritizes **genuine understanding** over rote memorization through:

- ✅ Semantic evaluation using LLMs (not keywords)
- ✅ Structured, consistent feedback templates
- ✅ Visual and audio cues for immediate feedback
- ✅ Guidance without revealing answers
- ✅ Graceful error handling and fallbacks
- ✅ Technical accuracy aligned with C&G 2365 standards

This approach creates an effective learning environment where students are encouraged to think critically and express their understanding naturally, while maintaining rigorous educational standards.
