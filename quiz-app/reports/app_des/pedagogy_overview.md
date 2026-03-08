# Pedagogy Overview (Implementation-Aligned)

Last verified: 2026-03-05
Scope: Learning behaviors observable in current app runtime

---

## 1. Core Learning Strategy Implemented

The app is built around retrieval-first learning:
- frequent quiz retrieval from lesson content
- immediate feedback + explanation handling
- typed retries for deeper correction on wrong answers
- cumulative quiz mode to revisit prior lessons

## 2. Readiness + Progress Model

- lessons can enforce prerequisite diagnostics via `DiagnosticGate`
- lesson access is wrapped by `MasteryUnlockGate`
- learner progress is tracked locally; optional server tracking is available when auth progress is enabled

## 3. Spacing and Review

- my-quiz-set workflows support cadence-based repeated practice
- wrong answers can be persisted to review queue
- review queue items feed future quiz-set builds (review-first blend)

## 4. Personalization Layer

- onboarding interview generates profile context
- tutor/profile injections are used to adapt style and pacing
- user and global prompt profile controls exist in admin

## 5. Curriculum-Scoped Learning

Pedagogy is applied consistently, but content scope is isolated by curriculum prefix:
- `/2365/*`
- `/gcse/science/physics/*`
- `/gcse/science/biology/*`

## 6. Research Files in This Folder

`txt/research summary.txt` and `txt/research.txt` are evidence/background inputs, not direct implementation contracts.