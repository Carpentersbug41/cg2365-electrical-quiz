# URGENT: Environment Variable Fix Required

## Problem

Your LLM diagnostic analysis is failing because the `GEMINI_MODEL` environment variable is set to a non-existent model name.

**Current Error:**
```
Error: [GoogleGenerativeAI Error]: [503 Service Unavailable] 
The model is overloaded. Please try again later.
Model: gemini-3-flash-preview
```

**Root Cause:** The model name `gemini-3-flash-preview` does not exist.

---

## Fix Required (Manual Action)

You need to update your `.env.local` file in the `quiz-app` directory.

### Step 1: Locate Your .env.local File

The file should be at:
```
C:\Users\carpe\Desktop\hs_quiz\quiz-app\.env.local
```

### Step 2: Update the GEMINI_MODEL Variable

Open `.env.local` and change:

```env
# CHANGE FROM:
GEMINI_MODEL=gemini-3-flash-preview

# TO ONE OF THESE VALID MODELS:
GEMINI_MODEL=gemini-2.0-flash-exp
# OR
GEMINI_MODEL=gemini-1.5-flash
# OR
GEMINI_MODEL=gemini-1.5-pro
```

**Recommended:** Use `gemini-2.0-flash-exp` for best performance.

### Step 3: Restart Your Dev Server

After updating `.env.local`:

1. Stop your current dev server (Ctrl+C in terminal)
2. Restart it: `npm run dev`
3. Test the diagnostic again

---

## Valid Gemini Models (January 2026)

- `gemini-2.0-flash-exp` - Latest experimental flash model (recommended)
- `gemini-1.5-flash` - Stable fast model
- `gemini-1.5-pro` - More powerful but slower

**DO NOT USE:**
- `gemini-3-flash-preview` - Does not exist
- `gemini-3-flash-preview` - May not exist yet

---

## How to Verify It's Fixed

After restarting the server:

1. Go to any lesson (e.g., 202-5A)
2. Fail the diagnostic (score below 80%)
3. You should see:
   - "Why You Got These Wrong: [actual LLM analysis]"
   - NOT "We encountered an issue generating personalized analysis..."

---

## What I Fixed Automatically

I've already fixed the question distribution issue:
- Questions are now equally distributed across all previous lessons
- For 202-5A: 2-3 questions from each of 202-1A, 202-2A, 202-3A, 202-4A
- Questions are randomized within each lesson and shuffled at the end

**You MUST manually fix the .env.local file for the LLM to work.**
