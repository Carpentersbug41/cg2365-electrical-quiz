# AI Studio Handover: Prompt-First Game Replacement Workflow

## Scope of this handover
This document is only about the established workflow used in this project:
1. Write a behavior-first generation prompt.
2. Generate a full React/TypeScript game repo in AI Studio.
3. Clone the generated repo.
4. Use that generated behavior as the source of truth for replacement.

It intentionally does **not** describe hand-coding from scratch.

---

## Standard workflow (used repeatedly)
1. Pick one game type from the microbreak pipeline.
2. Write a strict behavior/integration prompt for AI Studio.
3. Ask AI Studio to output a production-ready React + TS repo.
4. Clone generated repo from GitHub.
5. Port behavior/UI exactly into the app replacement slot.
6. Validate in `/game-replacements` test page and run checks.

---

## Non-negotiable prompt constraints
Use these constraints in every prompt:
- Match repo behavior exactly; no reinterpretation.
- Keep in-app contract compatibility (props/content shape, callbacks).
- Do not require embed URL or iframe wrapper.
- Keep scoring deterministic.
- Support mouse, touch, keyboard.
- Include completion state + callback stats.
- Avoid schema break unless strictly required.
- Provide all code + dependency list + integration notes.
- Visual quality should be high (“beautiful/cute”), but mechanics come first.

---

## Reusable master prompt template
```text
Create a production-ready educational mini-game in React + TypeScript for direct code reuse.

Goal:
- This component will replace an existing in-app microbreak game.
- Behavior must be exact and deterministic.
- Do not build an embed/iframe simulation.

Integration contract:
- Preserve this game type contract exactly:
  - gameType: <GAME_TYPE>
  - content shape: <CONTENT_SHAPE>
  - completion callback: onComplete(score?: number, accuracy?: number)
  - optional skip callback: onSkip()
- Keep compatibility with existing generated lesson content.

Behavior requirements:
- <STEP-BY-STEP MECHANICS>
- Input validation + error feedback states.
- Correct/incorrect scoring rules.
- Completion detection + end summary.
- Keyboard, touch, mouse support.

UX requirements:
- Beautiful polished UI.
- Clear state transitions.
- Accessible labels/focus states.
- Mobile-safe interactions.

Deliverables:
- Full file tree
- Complete source code
- Dependency list
- README with integration notes and sample content JSON
```

---

## Prompt examples (ready to paste)

### Example 1: Sorting
```text
Create a production-ready educational sorting game in React + TypeScript.

Game contract:
- gameType: sorting
- content:
  {
    buckets: [string, string],
    items: Array<{ text: string; correctBucket: 0 | 1 }>
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- Show unsorted cards and two target buckets.
- Sort by drag-and-drop and tap-select fallback.
- Correct placement locks the card.
- Incorrect placement shows temporary feedback and card remains unsorted.
- Prevent duplicate placements.
- Completion when all cards are correctly placed.
- Deterministic score + accuracy.

Integration:
- No iframe/embed.
- Preserve exact content contract.
- Include sample JSON and integration README.

Visual:
- Make it beautiful and polished.
```

### Example 2: Sequencing
```text
Create a production-ready sequencing game in React + TypeScript.

Game contract:
- gameType: sequencing
- content:
  {
    steps: string[],
    correctOrder: string[],
    prompt?: string,
    instructions?: string,
    timerSeconds?: number
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- User reorders steps with drag and button controls.
- Check action validates exact order.
- Show per-step correctness and final score.
- Include timer-based pressure mode.
- Completion state with stats.

Integration:
- No embed URL.
- Keep contract fully compatible.
- Include sample content and README.

Visual:
- Make it beautiful and lively.
```

### Example 3: Fill Gap
```text
Create a production-ready fill-gap game in React + TypeScript.

Game contract:
- gameType: fill-gap
- content:
  {
    textTemplate: string, // contains {{gapId}} placeholders
    gaps: Array<{ id: string; options: string[]; correctOptionIndex: number }>,
    prompt?: string,
    instructions?: string,
    timerSeconds?: number
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- Render sentence with interactive gaps.
- Tap/click gap, select one option.
- Option should animate/slip into the gap.
- Check action validates all gaps.
- Show clear feedback and end summary.
- Deterministic scoring.

Integration:
- No iframe/embed.
- Preserve content schema.
- Include sample dataset and integration README.

Visual:
- Beautiful Duolingo-like motion quality.
```

### Example 4: Spot the Error
```text
Create a production-ready spot-the-error game in React + TypeScript.

Game contract:
- gameType: spot-error
- content:
  {
    scenario: string,
    statements: Array<{ text: string; isError: boolean }>,
    explanation?: string
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- Show scenario + list of statements.
- User identifies the incorrect statement(s).
- Check action validates selection.
- Show concise corrective explanation.
- Deterministic scoring and completion.

Integration:
- Keep schema compatible, no embed.
- Include sample JSON + README.

Visual:
- Beautiful, clean, high-contrast UI.
```

### Example 5: Formula Build
```text
Create a production-ready formula-builder game in React + TypeScript.

Game contract:
- gameType: formula-build
- content:
  {
    prompt?: string,
    tokens: string[],
    correctSequence: string[],
    timerSeconds?: number,
    questions?: Array<{
      prompt?: string,
      tokens: string[],
      correctSequence: string[],
      timerSeconds?: number
    }>
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- Token bank + answer assembly area.
- Tap token to add, tap answer token to remove.
- Check action validates exact order.
- Support reset.
- Deterministic scoring.

Integration:
- Preserve contract exactly.
- No iframe/embed.
- Include sample JSON and README.

Visual:
- Beautiful and playful with smooth layout animations.
```

### Example 6: Is-Correct-Why
```text
Create a production-ready “is-correct-why” game in React + TypeScript.

Game contract:
- gameType: is-correct-why
- content:
  {
    statement: string,
    isCorrect: boolean,
    reasons: string[],
    correctReasonIndex: number,
    explanation?: string,
    questions?: Array<{
      statement: string,
      isCorrect: boolean,
      reasons: string[],
      correctReasonIndex: number,
      explanation?: string
    }>
  }
- callbacks:
  onComplete(score?: number, accuracy?: number)
  onSkip()

Behavior:
- Step 1: choose Correct/Incorrect.
- Step 2: choose best reason.
- Step 3: check answer.
- If questions[] exists, support multi-question progression with next/finish flow.
- Deterministic scoring with partial credit support.

Integration:
- Preserve contract, no embed.
- Include sample content with 5 questions.
- Include README + dependency list.

Visual:
- Beautiful, modern, cute style with clear state transitions.
```

---

## Done apps (prompt-first AI Studio workflow)

| Game | Status | Source Repo |
|---|---|---|
| Matching | Done | Repo link not captured in current workspace notes |
| Sorting | Done | https://github.com/Carpentersbug41/Sorting.git |
| Sequencing | Done | https://github.com/Carpentersbug41/Sequence.git |
| Fill Gap | Done | https://github.com/Carpentersbug41/gap-fill.git |
| Spot the Error | Done | https://github.com/Carpentersbug41/Spot-the-error.git |
| Quick Win Sprint | Done | https://github.com/Carpentersbug41/quick-sprint.git |
| Formula Build | Done | https://github.com/Carpentersbug41/formula-builder.git |
| Is Correct Why | In progress/active styling and flow pass | Repo link not captured in current workspace notes |

Notes:
- “Tap Label / Drawings” was explicitly removed as a liability path.

---

## Not done yet (from current supported game types)
- diagnosis-ranked
- classify-two-bins
- scenario-match
- tap-the-line
- tap-the-word
- elimination

(These are listed in `src/data/lessons/types.ts` but do not yet have completed prompt-first replacement confirmation in this handover.)

---

## Where to verify current replacement state
- Admin replacement test page: `/game-replacements`
- Tenant-prefixed variant used in prior testing: `/2365/admin/game-replacements`

---

## Quick handover instruction for next LLM
Use this exact loop for each remaining game:
1. Write behavior-first prompt (using template above).
2. Generate repo in AI Studio.
3. Clone repo.
4. Port exact behavior into in-app replacement slot.
5. Validate on replacement test page.
6. Record repo link + status in this document.
