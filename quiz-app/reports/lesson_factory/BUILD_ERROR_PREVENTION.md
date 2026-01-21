# Build Error Prevention Guide

This document explains common build errors and how to prevent them from happening again.

## Table of Contents
1. [Root Causes](#root-causes)
2. [Type Safety Issues](#type-safety-issues)
3. [Invalid String Literals](#invalid-string-literals)
4. [JSX Escaping Issues](#jsx-escaping-issues)
5. [Import/Export Issues](#importexport-issues)
6. [Pre-Commit Checklist](#pre-commit-checklist)
7. [Quick Reference](#quick-reference)

---

## Root Causes

The build errors occurred due to several categories of issues:

### 1. **Type Safety Violations**
- Using `any` types instead of proper TypeScript types
- Missing type assertions or incorrect type guards
- Type mismatches between interfaces and implementations

### 2. **Invalid String Literal Types**
- Using misconception codes that don't exist in the `MisconceptionCode` union type
- Using question tags that don't exist in the `QuestionTag` union type
- Typos in string literals that must match exact type definitions

### 3. **JSX Escaping Issues**
- Unescaped quotes (`"`) and apostrophes (`'`) in JSX text nodes
- React requires these to be escaped as `&quot;` and `&apos;`

### 4. **ESLint Violations**
- Using `let` instead of `const` for variables that aren't reassigned
- Unused variables and imports
- Using `require()` instead of ES6 `import` statements

### 5. **Missing Required Fields**
- JSON files missing required fields (e.g., `metadata` in lesson files)
- TypeScript interfaces requiring fields that weren't present

---

## Type Safety Issues

### Problem: Using `any` Types

**Error Example:**
```typescript
// ❌ BAD
catch (error: any) {
  console.log(error.message);
}

// ✅ GOOD
catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : '';
  console.log(errorMessage);
}
```

**Prevention:**
- Never use `any` - use `unknown` instead
- Use type guards: `error instanceof Error`
- Use proper type assertions: `as Type` only when necessary

### Problem: Type Mismatches

**Error Example:**
```typescript
// ❌ BAD
const config: AnswerValidationConfig = {
  ...otherConfig,
  strategy: config?.strategy || 'exact', // 'exact' not in MarkingStrategy union
};

// ✅ GOOD
const config: AnswerValidationConfig = {
  strategy: config?.strategy || 'numeric-tolerance', // Valid MarkingStrategy
  // ... other fields
};
```

**Prevention:**
- Always check type definitions before using string literals
- Use TypeScript's autocomplete to see valid values
- Reference: `src/lib/marking/types.ts` for `MarkingStrategy`

---

## Invalid String Literals

### Problem: Invalid Misconception Codes

**Error Example:**
```typescript
// ❌ BAD - These codes don't exist
misconceptionCodes: {
  1: 'CONFUSED_AC_DC',              // Wrong
  2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY', // Wrong
  3: 'OLD_COLOUR_CODE',              // Wrong
}

// ✅ GOOD - Use valid codes from the union type
misconceptionCodes: {
  1: 'CONFUSED_AC_DC_SOURCES',       // Correct
  2: 'CONFUSED_FREQUENCY_WITH_VOLTAGE', // Correct
  3: 'OTHER',                        // Fallback for undefined codes
}
```

**How to Find Valid Codes:**
1. Check `src/data/questions/types.ts` - see the `MisconceptionCode` union type
2. Check `src/lib/marking/misconceptionCodes.ts` - see all defined misconception definitions
3. Use TypeScript autocomplete - it will show valid options

**Common Invalid → Valid Mappings:**
- `'CONFUSED_AC_DC'` → `'CONFUSED_AC_DC_SOURCES'`
- `'CONFUSED_VOLTAGE_WITH_FREQUENCY'` → `'CONFUSED_FREQUENCY_WITH_VOLTAGE'`
- `'CONFUSED_RMS_PEAK'` → `'CONFUSED_RMS_WITH_PEAK'`
- `'OLD_COLOUR_CODE'` → `'OTHER'` (if no direct replacement)
- Any undefined code → `'OTHER'`

### Problem: Invalid Question Tags

**Error Example:**
```typescript
// ❌ BAD - These tags don't exist
tags: ['prefixes', 'tolerance', 'comparison', 'cables']

// ✅ GOOD - Use valid tags from the union type
tags: ['conversion', 'units', 'conceptual', 'application']
```

**How to Find Valid Tags:**
1. Check `src/data/questions/types.ts` - see the `QuestionTag` union type (lines 119-183)
2. Use TypeScript autocomplete

**Common Invalid → Valid Mappings:**
- `'prefixes'` → `'conversion'`
- `'tolerance'` → `'units'`
- `'comparison'` → `'conceptual'`
- `'cables'` → `'application'`
- `'permanent-magnet'` → `'magnetic-poles'`
- `'electromagnet'` → `'electromagnets'`
- `'relay'` → `'relays'`
- `'transformer'` → `'application'`
- `'solenoid'` → `'electromagnets'`
- `'induction'` → `'conceptual'`
- `'power'` → `'application'`

**Prevention:**
- Always reference the type definition file before adding tags
- Use `'OTHER'` for misconception codes when unsure
- Run `npm run build` locally before pushing

---

## JSX Escaping Issues

### Problem: Unescaped Quotes and Apostrophes

**Error Example:**
```tsx
// ❌ BAD
<p>Why does "Amps" mean "Quantity"?</p>
<p>You've completed the lesson.</p>

// ✅ GOOD
<p>Why does &quot;Amps&quot; mean &quot;Quantity&quot;?</p>
<p>You&apos;ve completed the lesson.</p>
```

**Prevention:**
- Always escape quotes: `"` → `&quot;`
- Always escape apostrophes: `'` → `&apos;`
- Or use template literals with proper escaping
- ESLint rule `react/no-unescaped-entities` will catch these

**Common Patterns:**
- `"text"` → `&quot;text&quot;`
- `'text'` → `&apos;text&apos;`
- `don't` → `don&apos;t`
- `you've` → `you&apos;ve`
- `let's` → `let&apos;s`

---

## Import/Export Issues

### Problem: Using `require()` Instead of `import`

**Error Example:**
```typescript
// ❌ BAD
const { getQuizProgress } = require('@/lib/progress/progressService');

// ✅ GOOD
import { getQuizProgress } from '@/lib/progress/progressService';
```

**Prevention:**
- Always use ES6 `import` statements
- ESLint rule `@typescript-eslint/no-require-imports` will catch these

### Problem: Missing Imports

**Error Example:**
```typescript
// ❌ BAD
export function filterQuestionsByTags(tags: string[]) { // QuestionTag[] expected

// ✅ GOOD
import { QuestionTag } from '@/data/questions/types';
export function filterQuestionsByTags(tags: QuestionTag[]) {
```

**Prevention:**
- Import types explicitly when needed
- TypeScript will error if types don't match

---

## ESLint Violations

### Problem: Using `let` Instead of `const`

**Error Example:**
```typescript
// ❌ BAD
let nextPos = vecAdd(currentPos, velocity);

// ✅ GOOD
const nextPos = vecAdd(currentPos, velocity);
```

**Prevention:**
- Always use `const` unless you need to reassign
- ESLint rule `prefer-const` will catch these

### Problem: Unused Variables

**Error Example:**
```typescript
// ❌ BAD
const [lessonProgress, setLessonProgress] = useState(null);
// lessonProgress never used

// ✅ GOOD
// Remove unused variables, or prefix with underscore if intentionally unused
const [_lessonProgress, setLessonProgress] = useState(null);
```

**Prevention:**
- Remove unused imports and variables
- Prefix with `_` if intentionally unused (e.g., `_unusedVar`)
- ESLint rule `@typescript-eslint/no-unused-vars` will catch these

---

## Missing Required Fields

### Problem: Missing Fields in JSON Files

**Error Example:**
```json
// ❌ BAD - Missing metadata field
{
  "id": "203-1A-types-of-cables",
  "title": "Types of Cables",
  "blocks": [...]
}

// ✅ GOOD - All required fields present
{
  "id": "203-1A-types-of-cables",
  "title": "Types of Cables",
  "blocks": [...],
  "metadata": {
    "unit": "203",
    "order": 1
  }
}
```

**Prevention:**
- Check the `Lesson` interface in `src/data/lessons/types.ts`
- Ensure all required fields are present
- Use TypeScript to validate JSON structure

---

## Pre-Commit Checklist

Before committing code, run these checks:

### 1. **Run TypeScript Check**
```bash
cd quiz-app
npm run build
```

This will catch:
- Type errors
- Invalid string literals
- Missing required fields
- Type mismatches

### 2. **Run ESLint**
```bash
npm run lint
```

This will catch:
- Unused variables
- `prefer-const` violations
- Unescaped JSX entities
- `require()` imports

### 3. **Verify Valid Types**

**For Misconception Codes:**
- Check `src/data/questions/types.ts` (lines 11-113)
- Or check `src/lib/marking/misconceptionCodes.ts` for all valid codes

**For Question Tags:**
- Check `src/data/questions/types.ts` (lines 119-183)

**For Marking Strategies:**
- Check `src/lib/marking/types.ts` (lines 52-59)

### 4. **Check JSX Files**
- Search for unescaped quotes: `"`
- Search for unescaped apostrophes: `'`
- Replace with `&quot;` and `&apos;`

### 5. **Verify JSON Files**
- Ensure all required fields from interfaces are present
- Validate JSON syntax
- Check lesson files have `metadata` field

---

## Quick Reference

### Valid Misconception Codes (Common Ones)
- `'OTHER'` - Use as fallback for undefined codes
- `'CONFUSED_AC_DC_SOURCES'` - Not `'CONFUSED_AC_DC'`
- `'CONFUSED_FREQUENCY_WITH_VOLTAGE'` - Not `'CONFUSED_VOLTAGE_WITH_FREQUENCY'`
- `'CONFUSED_RMS_WITH_PEAK'` - Not `'CONFUSED_RMS_PEAK'`
- `'CONFUSED_FREQUENCY_WITH_CURRENT'` - Valid
- `'UNITS_MISSING'` - Valid
- `'WRONG_UNITS'` - Valid

### Valid Question Tags (Common Ones)
- `'conversion'` - Not `'prefixes'`
- `'units'` - Not `'tolerance'`
- `'conceptual'` - Not `'comparison'`
- `'application'` - Generic application tag
- `'magnetic-poles'` - Not `'permanent-magnet'`
- `'electromagnets'` - Not `'electromagnet'`
- `'relays'` - Not `'relay'`

### Valid Marking Strategies
- `'exact-match'`
- `'normalized-match'`
- `'numeric-tolerance'` - Use for numeric questions
- `'contains-keywords'`
- `'regex-pattern'`
- `'ai-assisted'`
- `'step-validation'`

### JSX Escaping
- `"` → `&quot;`
- `'` → `&apos;`
- `&` → `&amp;` (if not part of entity)
- `<` → `&lt;` (if not JSX)
- `>` → `&gt;` (if not JSX)

---

## Automated Prevention

### Recommended Pre-Commit Hook

Create `.husky/pre-commit`:
```bash
#!/bin/sh
cd quiz-app
npm run build
npm run lint
```

Or use `lint-staged` for faster checks on changed files only.

### VS Code Settings

Add to `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

## Summary

**Most Common Errors:**
1. ❌ Invalid misconception codes → ✅ Check `types.ts` and use `'OTHER'` if unsure
2. ❌ Invalid question tags → ✅ Check `types.ts` for valid tags
3. ❌ Unescaped JSX entities → ✅ Use `&quot;` and `&apos;`
4. ❌ Using `any` types → ✅ Use `unknown` with type guards
5. ❌ Missing required fields → ✅ Check interface definitions

**Always Run Before Committing:**
```bash
npm run build  # Catches type errors
npm run lint  # Catches ESLint issues
```

**When in Doubt:**
- Check the type definition files
- Use TypeScript autocomplete
- Use `'OTHER'` for misconception codes
- Run the build locally first

---

## Related Files

- Type Definitions: `src/data/questions/types.ts`
- Misconception Definitions: `src/lib/marking/misconceptionCodes.ts`
- Marking Types: `src/lib/marking/types.ts`
- Lesson Types: `src/data/lessons/types.ts`
