# Critical Git & Vercel Deployment Workflow

## ⚠️ ALWAYS WORK ON MAIN BRANCH ⚠️

**NEVER create feature branches. NEVER switch away from main.**

### Why This Matters

When you switch branches, your files appear to "disappear" because they're on a different branch. This causes panic and confusion. **All work must stay on `main`**.

## Pre-Deployment Checklist

Before pushing to Git and deploying to Vercel, **ALWAYS** verify:

### 1. Check Current Branch
```bash
git branch --show-current
```
**MUST show:** `main`

**If it shows anything else (like `feat/lesson-...`):**
- ❌ **STOP IMMEDIATELY**
- Switch back to main: `git checkout main`
- Your work is still on the feature branch - merge it first

### 2. Verify Your Work is Present
```bash
ls quiz-app/src/data/lessons/204-*.json
```
Check that all your lesson files are visible. If they're not there, you're on the wrong branch!

### 3. Commit and Push to Main
```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

**CRITICAL:** Always push to `origin main`, never to feature branches.

### 4. Deploy to Vercel
```bash
cd quiz-app
vercel --prod --yes
```

Vercel will build from the `main` branch on GitHub.

## What Went Wrong Today (Jan 29, 2026)

### The Problem
1. Work was committed to feature branch `feat/lesson-204-13B-1769622960347`
2. Build fixes were accidentally pushed to `main` 
3. IDE switched to `main` branch (which didn't have the new lessons)
4. Work appeared to "disappear" - causing panic
5. Work was actually safe on the feature branch, but invisible while on `main`

### The Solution
**Merged all feature branch work into `main` and deleted feature branches.**

Now everything lives on `main` - no more branch confusion.

## Rules Going Forward

1. ✅ **ALWAYS work on `main`** - check branch before starting work
2. ✅ **NEVER create feature branches** - they cause confusion
3. ✅ **Check branch before committing** - ensure you're on `main`
4. ✅ **Check branch before deploying** - Vercel uses `main`
5. ✅ **If files disappear** - you're on the wrong branch, switch back to `main`

## Emergency: "My Work Disappeared!"

If your lesson files suddenly vanish:

```bash
# Check which branch you're on
git branch --show-current

# If not on main, switch to main
git checkout main

# Verify your files are back
ls quiz-app/src/data/lessons/204-*.json
```

Your work didn't disappear - you were just on the wrong branch looking at an old version of the code.

## Vercel Deployment Notes

- Vercel deploys from the `main` branch on GitHub
- **Never deploy from a feature branch** - it will deploy old code
- Always ensure latest commits are pushed to `main` before deploying
- If deployment shows old lessons, check that you pushed to `main` not a feature branch

---

**Last Updated:** January 29, 2026
**Reason:** Consolidated all work to `main` branch to prevent branch confusion
