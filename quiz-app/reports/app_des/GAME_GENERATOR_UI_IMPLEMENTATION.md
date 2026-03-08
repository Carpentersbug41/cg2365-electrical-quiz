# Microbreak Game Generator - Current Implementation

Last verified: 2026-03-05
Status: Implemented and active

---

## 1. Operator Surface

- UI route: `/admin/generate-games`
- API route: `/api/admin/generate-games`

Supported operations:
- list lessons + current microbreak status (`GET`)
- preview generated games (`POST` with `operation=preview`)
- save generated games to lesson JSON (`POST` with `operation=save`)
- delete generated microbreak blocks (`DELETE`)

## 2. Generation Modes

- `mode=auto`: uses full supported game type pool
- `mode=manual`: caller supplies `allowedGameTypes`

Supported game types include:
`matching`, `sorting`, `spot-error`, `quick-win`, `sequencing`, `fill-gap`, `is-correct-why`, `diagnosis-ranked`, `classify-two-bins`, `scenario-match`, `formula-build`, `tap-the-line`, `tap-the-word`, `elimination`.

## 3. Runtime Contracts

- lesson filename is sanitized and resolved recursively in `src/data/lessons`
- curriculum scope is enforced (`isLessonIdAllowedForScope`)
- `GEMINI_API_KEY` is required for generation path
- if no valid microbreak slots exist, API returns success with `gamesPlanned=0`
- save path can accept client-provided `games` payload for operator-controlled commit

## 4. Data Included in Lesson List Response

Per lesson the API returns:
- basic lesson identity/title/unit
- microbreak counts and slot availability
- vocab/explanation availability counts
- simulation embed metadata (if diagram embed exists)
- socratic block presence and key settings

## 5. Out-of-Scope

This endpoint is focused on lesson microbreak blocks only.
Simulation cloning and socratic block insertion are handled by separate admin APIs.