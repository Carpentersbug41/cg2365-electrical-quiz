# 🚨 CRITICAL: Generator Stability Guidelines

**For Developers: Read This Before Touching Generation Code**

This document explains what you **MUST NOT** change in the generation system and why. Every time these patterns are violated, the generator breaks and we have to spend hours debugging the same issues repeatedly.

---

## Table of Contents

1. [Never Remove Debug Info Flow](#never-remove-debug-info-flow)
2. [Never Skip Response Validation](#never-skip-response-validation)
3. [Never Use eval() for JSON Parsing](#never-use-eval-for-json-parsing)
4. [Never Remove .json Extensions from Imports](#never-remove-json-extensions-from-imports)
5. [Never Change JSON Parsing Order](#never-change-json-parsing-order)
6. [Never Disable Strict Linting](#never-disable-strict-linting)
7. [Never Remove Preprocessing Steps](#never-remove-preprocessing-steps)
8. [What You CAN Safely Change](#what-you-can-safely-change)

---

## 1. Never Remove Debug Info Flow

### ❌ NEVER DO THIS:

```typescript
// BAD: Removing debugInfo from error responses
return NextResponse.json({
  success: false,
  error: result.error,
  // debugInfo: result.debugInfo, // REMOVED - DON'T DO THIS!
}, { status: 500 });
```

```typescript
// BAD: Not passing debugInfo through error propagation
if (!parsed.success) {
  return {
    success: false,
    content: {} as Lesson,
    error: parsed.error,
    // Missing debugInfo!
  };
}
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Always include debugInfo in error responses
return NextResponse.json({
  success: false,
  error: result.error,
  debugInfo: result.debugInfo, // REQUIRED!
}, { status: 500 });
```

```typescript
// GOOD: Always propagate debugInfo through error chain
if (!parsed.success) {
  return {
    success: false,
    content: {} as Lesson,
    error: parsed.error,
    debugInfo: {
      rawResponse: cleanedContent,
      parseError: parsed.error,
      errorPosition: parsed.errorDetails,
      // ... full debug context
    }
  };
}
```

### WHY THIS MATTERS:

**Without debugInfo, debugging is impossible.** When generation fails with a parse error, we need to see:
- The exact raw response from the LLM
- The exact character position where parsing failed
- The context around the error
- What operation was being attempted

Without this info, you're debugging blind. You can't tell if the LLM returned bad JSON, if preprocessing failed, or if there's a bug in the parsing logic.

**See:** Problem 10 in [gen_problems.md](gen_problems.md) - we spent hours fixing this after someone removed debugInfo.

---

## 2. Never Skip Response Validation

### ❌ NEVER DO THIS:

```typescript
// BAD: Immediately parsing without validation
const text = result.response.text();
const cleanedText = cleanCodeBlocks(text);
const parsed = JSON.parse(cleanedText); // BOOM! Fails if text is error message
```

```typescript
// BAD: Removing validation "to simplify code"
const text = result.response.text();
// const validation = validateLLMResponse(text); // REMOVED - DON'T DO THIS!
// if (!validation.valid) { throw new Error(...); }
const cleanedText = cleanCodeBlocks(text);
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Validate before any processing
const text = result.response.text();

// CRITICAL: Validate response before parsing
const validation = validateLLMResponse(text);
if (!validation.valid) {
  debugLog('RESPONSE_VALIDATION_FAILED', {
    error: validation.error,
    detectedType: validation.detectedType,
    responsePreview: text.substring(0, 500)
  });
  throw new Error(validation.error || 'Invalid response from LLM');
}

const cleanedText = cleanCodeBlocks(text);
```

### WHY THIS MATTERS:

**The Gemini API can return error messages as plain text.** When rate limited, when quota exceeded, or when the API is down, it returns strings like:
- "Internal Server Error"
- "Rate limit exceeded"
- "Quota exceeded for quota metric"

If you try to parse these as JSON, you get confusing errors like:
```
Unexpected token 'I', "Internal S"... is not valid JSON
```

This hides the real problem (API error) behind a misleading parse error. The validation function catches these BEFORE parsing and returns the actual error message.

**See:** Problem 11 in [gen_problems.md](gen_problems.md) - just fixed this Feb 4, 2026.

---

## 3. Never Use eval() for JSON Parsing

### ❌ NEVER DO THIS:

```typescript
// BAD: Using eval() to parse JavaScript objects
const questions = eval(`(${cleanedContent})`);
```

```typescript
// BAD: Using Function constructor (same as eval)
const questions = new Function('return ' + cleanedContent)();
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Use JSON.parse with RFC 8259 compliant JSON
const parsed = safeJsonParse<QuizQuestion[]>(cleanedContent);
if (!parsed.success) {
  return {
    success: false,
    error: parsed.error,
    debugInfo: { ... }
  };
}
const questions = parsed.data;
```

### WHY THIS MATTERS:

1. **Security Risk:** `eval()` executes arbitrary code. If the LLM returns malicious code (even accidentally), you're executing it.

2. **Unpredictable Behavior:** JavaScript object notation ≠ JSON. Things that work in eval() might not work in JSON.parse():
   - Unquoted property names: `{id: 1}` works in eval, fails in JSON.parse
   - Trailing commas: `[1, 2,]` works in eval, fails in JSON.parse
   - Comments: `{/* comment */ id: 1}` works in eval, fails in JSON.parse

3. **Inconsistent Results:** The LLM learns from your prompts. If you use eval(), it starts returning JavaScript instead of JSON, then breaks when you switch to JSON.parse.

4. **Hard to Debug:** When eval() fails, stack traces are useless.

**The prompts now explicitly request RFC 8259 JSON** with quoted property names. Don't break this by using eval().

**See:** Problem 8 in [gen_problems.md](gen_problems.md) - we removed all eval() usage.

---

## 4. Never Remove .json Extensions from Imports

### ❌ NEVER DO THIS:

```typescript
// BAD: Missing .json extension
import lesson from '@/data/lessons/202-4A-series-circuits';
```

```typescript
// BAD: Removing .json in fileIntegrator.ts
const lessonPath = `@/data/lessons/${filename}`; // Missing .json!
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Include .json extension
import lesson from '@/data/lessons/202-4A-series-circuits.json';
```

```typescript
// GOOD: Always append .json in generated imports
const lessonPath = `@/data/lessons/${filename}.json`;
```

### WHY THIS MATTERS:

**Next.js requires explicit .json extensions for JSON imports.** Without it:
- Module resolution fails
- You get "Cannot find module" errors
- Hot-reload breaks
- Build fails

This is not a TypeScript thing, it's a Next.js + ES modules thing. The extension is **required**.

When `fileIntegrator.ts` generates imports for the `/learn` pages, it MUST include `.json`. Don't remove it "to clean up the code" or "because it looks weird".

**See:** Problem 2 in [gen_problems.md](gen_problems.md) - we fixed this permanently but people keep removing it.

---

## 5. Never Change JSON Parsing Order

### ❌ NEVER DO THIS:

```typescript
// BAD: Changing the order of operations
const text = result.response.text();
const parsed = JSON.parse(text); // Parse before cleaning!
const cleaned = cleanCodeBlocks(parsed); // Too late!
```

```typescript
// BAD: Skipping preprocessing
const text = result.response.text();
const validation = validateLLMResponse(text);
// const preprocessed = preprocessToValidJson(text); // REMOVED - DON'T DO THIS!
const parsed = JSON.parse(text); // Fails on trailing commas!
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Follow this EXACT order
const text = result.response.text();

// 1. Validate (checks for error messages)
const validation = validateLLMResponse(text);
if (!validation.valid) {
  throw new Error(validation.error);
}

// 2. Clean code blocks (removes ```json markers)
const cleaned = cleanCodeBlocks(text);

// 3. Preprocess (removes trailing commas, comments, etc)
const preprocessed = preprocessToValidJson(cleaned);

// 4. Parse (RFC 8259 JSON only)
const parsed = safeJsonParse(preprocessed);
if (!parsed.success) {
  // Handle error with debugInfo
}
```

### WHY THIS MATTERS:

Each step handles different issues from LLM responses:

1. **Validate:** Catches error messages ("Internal Server Error") before they reach JSON parsing
2. **Clean:** Removes markdown code blocks (````json ... ````) that LLM sometimes adds
3. **Preprocess:** Fixes common JSON issues (trailing commas, comments) that LLM makes
4. **Parse:** Converts valid JSON string to object

**If you skip or reorder these steps:**
- Validation won't catch API errors → confusing parse errors
- Code blocks remain → JSON.parse fails on backticks
- Trailing commas remain → JSON.parse fails (strict RFC 8259)
- Parse fails → you get no data

This order was carefully designed after months of debugging LLM response issues. Don't change it.

**See:** Problem 8 in [gen_problems.md](gen_problems.md) - the evolution of this parsing pipeline.

---

## 6. Never Disable Strict Linting

### ❌ NEVER DO THIS:

```typescript
// BAD: Skipping strict lint
// const strictLint = this.strictLintService.strictLint(parsed.data, lessonId);
// if (!strictLint.passed) { ... } // REMOVED - DON'T DO THIS!

return { 
  success: true, 
  content: parsed.data 
};
```

```typescript
// BAD: Commenting out lint checks "to make tests pass"
// if (question.cognitiveLevel === 'hypothesis') {
//   errors.push('Uses removed cognitiveLevel "hypothesis"');
// }
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Always run strict lint
const strictLint = this.strictLintService.strictLint(parsed.data, lessonId);
if (!strictLint.passed) {
  // Attempt repair
  const repaired = await this.repairLesson(...);
  // Return repaired version
}
```

### WHY THIS MATTERS:

**Strict linting catches issues that break the UI at runtime.** These aren't "nice to have" checks, they're critical:

1. **Wrong field names:** `attText` instead of `questionText` → crashes SpacedReviewBlock
2. **Wrong data types:** `expectedAnswer: "value"` instead of `["value"]` → marking fails
3. **Missing required fields:** No `cognitiveLevel` → integrative blocks break
4. **Invalid structure:** Block orders collide → rendering breaks

**Strict lint is the last line of defense** before bad data reaches production. It catches:
- LLM mistakes (typos, wrong formats)
- Schema violations (missing fields, wrong types)
- Structural issues (order collisions, missing blocks)

If you disable it "to make generation faster" or "because validation is annoying", you're shipping broken lessons that crash at runtime.

**See:** Problem 5 in [gen_problems.md](gen_problems.md) - `attText` typo crashed the UI.

---

## 7. Never Remove Preprocessing Steps

### ❌ NEVER DO THIS:

```typescript
// BAD: Removing trailing comma fix "because it's redundant"
export function preprocessToValidJson(content: string): string {
  let processed = content.trim();
  // processed = processed.replace(/,(\s*[}\]])/g, '$1'); // REMOVED - DON'T DO THIS!
  return processed;
}
```

```typescript
// BAD: Removing comment stripping "to save time"
// processed = processed.replace(/\/\/.*$/gm, ''); // REMOVED
// processed = processed.replace(/\/\*[\s\S]*?\*\//g, ''); // REMOVED
```

### ✅ ALWAYS DO THIS:

```typescript
// GOOD: Keep all preprocessing steps
export function preprocessToValidJson(content: string): string {
  let processed = content.trim();
  
  // Remove trailing commas (LLM often adds these)
  processed = processed.replace(/,(\s*[}\]])/g, '$1');
  
  // Remove comments (LLM sometimes adds these)
  processed = processed.replace(/\/\/.*$/gm, '');
  processed = processed.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Fix bracket mismatches (rare but happens)
  processed = processed.replace(/\)\s*(\])/g, '$1');
  processed = processed.replace(/\)\s*(\})/g, '$1');
  
  return processed;
}
```

### WHY THIS MATTERS:

**LLMs are non-deterministic.** Even with perfect prompts, they occasionally:
- Add trailing commas: `{id: 1, name: "test",}` ← that comma breaks JSON.parse
- Add comments: `{id: 1 /* user ID */}` ← JSON doesn't support comments
- Mix brackets: `["test")]` ← should be `["test"]`

These issues are **rare but recurring**. You might not see them in 10 generations, then suddenly see them in the 11th. If you remove preprocessing because "I haven't seen that error in a while", it will come back.

Each preprocessing step fixes a **real issue we've encountered**. Don't remove them because they "look unnecessary". They're there because we debugged those exact errors.

**See:** Problem 8 in [gen_problems.md](gen_problems.md) - the history of preprocessing fixes.

---

## What You CAN Safely Change

### ✅ Safe to Modify:

1. **Prompt text** (as long as you keep "RFC 8259 JSON" requirement)
2. **Token limits** (in constants.ts)
3. **Validation warning thresholds** (warnings, not errors)
4. **UI styling** (generate/page.tsx layout/colors)
5. **Debug log messages** (change wording, add more logs)
6. **Git commit messages** (gitService.ts)
7. **Retry delays** (RETRY_DELAY_MS)
8. **Variable names** (as long as types remain correct)

### ✅ Safe to Add:

1. **New validation checks** (add to ValidationService, don't remove existing ones)
2. **New preprocessing patterns** (add to preprocessToValidJson, don't remove existing ones)
3. **More debug logging** (always helpful)
4. **Better error messages** (make them clearer, don't remove context)
5. **New features** (add alongside existing code, don't replace)

### ⚠️ Need Review Before Changing:

1. **Type definitions** (types.ts - affects entire system)
2. **API response structure** (affects frontend/backend contract)
3. **File paths** (lessons, quizzes, integration files)
4. **Import/export patterns** (fileIntegrator.ts)
5. **Parsing pipeline order** (see section 5)

---

## Common Mistakes That Break Everything

### Mistake 1: "Simplifying" the Code

**Thought:** "This code is too complex, let me simplify it by removing unnecessary checks."

**Reality:** Every check exists because we debugged that exact failure case. Remove it and the error returns.

**Example:**
- Removed `finishReason` check → Generation failed silently on safety violations
- Removed `validateLLMResponse` → API errors showed as JSON parse errors
- Removed debug info → Spent 2 hours debugging blind

**Rule:** If you don't understand why code exists, **ask first, don't delete**.

### Mistake 2: "I Haven't Seen That Error"

**Thought:** "We haven't seen trailing comma errors in months, let's remove that preprocessing."

**Reality:** LLMs are non-deterministic. Rare errors (1 in 100 generations) still happen. Remove the fix and you'll see it again.

**Rule:** **Never remove defensive code because "it works without it".** It works BECAUSE of it.

### Mistake 3: "This Will Make It Faster"

**Thought:** "Let's skip validation to speed up generation."

**Reality:** Skipping validation saves 10ms. Debugging production crashes costs 2 hours.

**Rule:** **Never optimize by removing safety checks.** Optimize by making valid operations faster.

### Mistake 4: "The Prompt Fixed It"

**Thought:** "I improved the prompt, so the LLM never returns bad JSON anymore. Let's remove preprocessing."

**Reality:** Prompts improve consistency, they don't guarantee it. LLMs can still make mistakes.

**Rule:** **Keep defensive code even after prompt improvements.** Defense in depth.

### Mistake 5: "This Looks Wrong"

**Thought:** "This code looks weird/ugly/redundant. Let me rewrite it to be cleaner."

**Reality:** Code that looks weird often handles edge cases you haven't considered.

**Example:**
```typescript
// Looks redundant, right?
if (!parsed.success || !parsed.data) { ... }
```

But it handles two cases:
- `parsed.success = false` → parse failed
- `parsed.success = true` but `parsed.data = undefined` → parse "succeeded" with null

**Rule:** **If code looks weird, there's probably a reason.** Read git history, check gen_problems.md, or ask before changing.

---

## How to Safely Make Changes

### Step 1: Read This Document

You're here. Good start.

### Step 2: Read gen_problems.md

See what broke before and why: [gen_problems.md](gen_problems.md)

Every problem documents:
- What broke
- Why it broke
- How it was fixed
- How to prevent it

### Step 3: Check Git History

```bash
git log --oneline -- path/to/file.ts
git show <commit-hash>
```

See why code was added and what problem it solved.

### Step 4: Test Thoroughly

Before committing changes:

1. **Generate a lesson** - Full generation, check files created
2. **Check dev server** - No build errors, hot-reload works
3. **Check browser** - Lesson displays correctly
4. **Check debug.log** - No unexpected errors
5. **Generate with invalid API key** - Error handling works
6. **Read generated files** - JSON is valid, content makes sense

### Step 5: Document Your Change

If you add new defensive code, document it:
- Add comment explaining what it prevents
- Update gen_problems.md if it fixes a new issue
- Add to this document if it's a critical pattern

### Step 6: Don't Touch These Files (Unless Expert)

High-risk files that break everything when changed incorrectly:

1. `fileGenerator.ts` - Core generation logic, parsing pipeline
2. `validationService.ts` - All checks exist for a reason
3. `strictLintService.ts` - Critical quality enforcement
4. `utils.ts` - Especially preprocessing and parsing functions
5. `types.ts` - Changes affect entire codebase
6. `fileIntegrator.ts` - Import/export generation, easy to break

If you must change these, **get a senior dev to review BEFORE committing**.

---

## Red Flags: Signs You're About to Break Something

🚩 **You're deleting code you don't understand**
→ Stop. Read it first. Ask questions.

🚩 **You're removing error handling to "simplify"**
→ Stop. That error happens. Keep the handling.

🚩 **You're commenting out validation checks**
→ Stop. Those checks prevent production bugs.

🚩 **You're changing the order of operations**
→ Stop. That order is deliberate. Read section 5.

🚩 **You're removing debug logging**
→ Stop. We need those logs when things break.

🚩 **You're using eval() for "flexibility"**
→ Stop. Use JSON.parse. Read section 3.

🚩 **You're skipping steps to "optimize"**
→ Stop. Measure first. Don't optimize by removing safety.

🚩 **You haven't tested with actual generation**
→ Stop. Test before committing.

---

## When to Ignore This Document

### Only ignore this if:

1. You are **fixing a critical production bug** and have no other option
2. You have **verified with tests** that your change works
3. You have **documented why** you broke the rules
4. You will **add new defensive code** to handle the issue differently
5. You will **update this document** with the new pattern

**In all other cases: Follow this document.**

---

## Questions?

**Before changing generation code, ask:**

1. Why does this code exist? (Check git history)
2. What problem does it solve? (Check gen_problems.md)
3. What breaks if I remove it? (Test it)
4. Is there a safer way? (Ask senior dev)

**If you break something:**

1. Check debug.log immediately
2. Read gen_problems.md for similar issues
3. Revert your changes
4. Test that revert fixes it
5. Figure out the root cause BEFORE trying again

---

## Summary: The Golden Rules

1. ✅ **Keep all validation** - Every check exists because we debugged that failure
2. ✅ **Keep all preprocessing** - Handles real LLM quirks we've seen
3. ✅ **Keep debug info flow** - Debugging blind is impossible
4. ✅ **Keep parsing order** - Validate → Clean → Preprocess → Parse
5. ✅ **Use JSON.parse only** - Never eval(), never Function()
6. ✅ **Include .json extensions** - Next.js requires them
7. ✅ **Test before committing** - Generate real lessons, check everything
8. ✅ **Document your changes** - Future you will thank you

**Remember:** This code was written after debugging the same issues dozens of times. It looks complex because generation is complex. Every "unnecessary" check handles a real error we've seen.

**Don't simplify it. Don't optimize it. Don't "clean it up".**

**If it works, leave it alone.**

---

**Last Updated:** Feb 4, 2026
**Maintained by:** Generation System Team
**Questions:** Read gen_problems.md first, then ask in #generator-help
