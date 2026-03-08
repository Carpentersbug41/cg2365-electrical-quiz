# Sign-In, Onboarding, and Auth Progress - Operator Guide

Last verified: 2026-03-05
Primary UI routes:
- `/auth/sign-in`
- `/auth/callback`
- `/onboarding`

---

## 1. Current Sign-In UX

`/auth/sign-in` supports:
- email/password sign in
- email/password sign up
- in-session sign-out

Redirect target defaults to onboarding, then learner flow.

## 2. Callback Behavior

`/auth/callback` supports both:
- OTP hash verification (`token_hash` + `type`)
- auth code exchange (`code`)

On success, user is redirected to safe `next` path or scoped default learn route.

## 3. Onboarding Flow

`/onboarding` runs an interview loop via `/api/onboarding/interview` and stores profile summary used for tutor personalization.

## 4. Auth-Backed Progress Features

When `AUTH_PROGRESS_ENABLED=true`, signed-in users can use:
- quiz set CRUD and run/finalize APIs
- attempt logging
- server-side lesson progress APIs
- review queue and wrong-item review endpoints

## 5. Operational Notes

If Supabase env vars are missing, sign-in page and protected APIs fail closed with clear error responses.